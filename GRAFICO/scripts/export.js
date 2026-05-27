const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const args = process.argv.slice(2);
const clientArg = args.find(a => a.startsWith('--client='));
const client = clientArg ? clientArg.split('=')[1] : (process.env.CLIENT || 'comnia');

const positional = args.filter(a => !a.startsWith('--client='));
const contentName = positional[0];
if (!contentName) {
  console.error('Usage: node scripts/export.js <content-name> [--client=<name>] [--jpg|--png|--pdf]');
  process.exit(1);
}

const formatArg = positional.slice(1).find(a => a === '--jpg' || a === '--jpeg' || a === '--png' || a === '--pdf');
const imageFormat = (formatArg === '--jpg' || formatArg === '--jpeg') ? 'jpeg' : 'png';
const imageExt = imageFormat === 'jpeg' ? 'jpg' : 'png';

const clientRoot = path.join(__dirname, '..', 'clients', client);
if (!fs.existsSync(clientRoot)) {
  console.error(`Cliente non trovato: clients/${client}`);
  process.exit(1);
}

// Default di export per-cliente: legge brand-profile.json se presente.
// Override esplicito via CLI: --pdf | --png | --jpg ha sempre la precedenza.
let brandExportFormat = null;
const brandProfilePath = path.join(clientRoot, 'brand', 'brand-profile.json');
if (fs.existsSync(brandProfilePath)) {
  try {
    const bp = JSON.parse(fs.readFileSync(brandProfilePath, 'utf-8'));
    brandExportFormat = bp && bp.export && bp.export.format ? bp.export.format : null;
  } catch {}
}
const usePdf = formatArg === '--pdf' || (!formatArg && brandExportFormat === 'pdf');

const inputDir = path.join(clientRoot, 'output', contentName);
const outputDir = path.join(clientRoot, 'export', contentName);

if (!fs.existsSync(inputDir)) {
  console.error(`Cartella non trovata: ${inputDir}`);
  process.exit(1);
}

const OVERLAY_SELECTOR = '.above-video';

(async () => {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch();
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.html')).sort();

  if (files.length === 0) {
    console.error(`Nessun file .html trovato in ${inputDir}`);
    await browser.close();
    process.exit(1);
  }

  for (const file of files) {
    const page = await browser.newPage();
    const filePath = path.join(inputDir, file);
    const html = fs.readFileSync(filePath, 'utf-8');

    const isStory = html.includes('slide--story');
    const width = 1080;
    const height = isStory ? 1920 : 1350;
    const baseName = file.replace('.html', '');
    const hasVideo = /<video\b[^>]*src=/i.test(html);

    const deviceScaleFactor = hasVideo ? 1 : 2;

    await page.setViewport({ width, height, deviceScaleFactor });
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      const images = Array.from(document.images);
      await Promise.all(images.map(img => img.complete
        ? Promise.resolve()
        : new Promise(res => { img.onload = img.onerror = res; })
      ));
    });

    if (hasVideo) {
      const videoInfo = await page.evaluate(() => {
        const v = document.querySelector('video');
        if (!v) return null;
        const rect = v.getBoundingClientRect();
        return {
          src: v.getAttribute('src'),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          objectFit: getComputedStyle(v).objectFit
        };
      });

      if (!videoInfo || !videoInfo.src) {
        console.error(`✗ ${file}: <video> senza src, salto`);
        await page.close();
        continue;
      }

      await page.evaluate((sel) => {
        document.querySelectorAll('video').forEach(v => v.style.visibility = 'hidden');
        document.querySelectorAll(sel).forEach(e => e.style.visibility = 'hidden');
      }, OVERLAY_SELECTOR);
      const bgPath = path.join(outputDir, `.${baseName}-bg.png`);
      await page.screenshot({
        path: bgPath,
        type: 'png',
        clip: { x: 0, y: 0, width, height }
      });

      const hasOverlay = await page.evaluate((sel) => {
        const overlays = Array.from(document.querySelectorAll(sel));
        if (overlays.length === 0) return false;

        const keep = new Set();
        overlays.forEach(o => {
          let el = o;
          while (el) { keep.add(el); el = el.parentElement; }
        });

        overlays.forEach(e => e.style.removeProperty('visibility'));

        keep.forEach(e => {
          if (!overlays.includes(e)) {
            e.style.setProperty('background', 'transparent', 'important');
            e.style.setProperty('background-color', 'transparent', 'important');
            e.style.setProperty('background-image', 'none', 'important');
          }
        });

        document.querySelectorAll('body *').forEach(e => {
          if (!keep.has(e)) {
            e.style.setProperty('visibility', 'hidden', 'important');
          }
        });

        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
        return true;
      }, OVERLAY_SELECTOR);

      let overlayPath = null;
      if (hasOverlay) {
        overlayPath = path.join(outputDir, `.${baseName}-overlay.png`);
        await page.screenshot({
          path: overlayPath,
          type: 'png',
          omitBackground: true,
          clip: { x: 0, y: 0, width, height }
        });
      }

      const videoSrc = path.resolve(path.dirname(filePath), videoInfo.src);
      const outMp4 = path.join(outputDir, `${baseName}.mp4`);
      const { x, y, w, h, objectFit } = videoInfo;

      let videoScale;
      if (objectFit === 'cover') {
        videoScale = `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},setsar=1`;
      } else if (objectFit === 'contain') {
        videoScale = `scale=${w}:${h}:force_original_aspect_ratio=decrease,setsar=1`;
      } else {
        videoScale = `scale=${w}:${h},setsar=1`;
      }

      let inputs = [
        '-loop', '1', '-i', bgPath,
        '-i', videoSrc
      ];
      let filter;
      if (overlayPath) {
        inputs.push('-loop', '1', '-i', overlayPath);
        filter = `[1:v]${videoScale}[vid];[0:v][vid]overlay=${x}:${y}[bgv];[bgv][2:v]overlay=0:0:shortest=1`;
      } else {
        filter = `[1:v]${videoScale}[vid];[0:v][vid]overlay=${x}:${y}:shortest=1`;
      }

      const ffArgs = [
        '-y',
        ...inputs,
        '-filter_complex', filter,
        '-map', '1:a?',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'medium',
        '-crf', '18',
        '-r', '30',
        '-shortest',
        '-movflags', '+faststart',
        outMp4
      ];

      const result = spawnSync(ffmpegPath, ffArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
      try { fs.unlinkSync(bgPath); } catch {}
      if (overlayPath) { try { fs.unlinkSync(overlayPath); } catch {} }

      if (result.status !== 0) {
        console.error(`✗ ${baseName}.mp4 — ffmpeg error`);
        if (result.stderr) console.error(result.stderr.toString().split('\n').slice(-10).join('\n'));
      } else {
        const layers = hasOverlay ? '3 layer' : '2 layer';
        console.log(`✓ ${baseName}.mp4  (${width}x${height} · video · ${layers})`);
      }
    } else if (usePdf) {
      const outName = `${baseName}.pdf`;
      await page.pdf({
        path: path.join(outputDir, outName),
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });
      console.log(`✓ ${outName}  (${width}x${height} · pdf)`);
    } else {
      const outName = `${baseName}.${imageExt}`;
      const screenshotOpts = {
        path: path.join(outputDir, outName),
        type: imageFormat,
        clip: { x: 0, y: 0, width, height }
      };
      if (imageFormat === 'jpeg') screenshotOpts.quality = 95;
      await page.screenshot(screenshotOpts);
      console.log(`✓ ${outName}  (${width}x${height})`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\nExport completato in clients/${client}/export/${contentName}/`);
})();
