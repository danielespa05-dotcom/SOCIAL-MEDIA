// canva-png-upload.js
// HTML → PNG @2x → cloudflared → Canva (Opzione C: pixel-perfect, non editabile)
// Usage: node scripts/canva-png-upload.js <content-name> [--client=<name>] [--keepalive=<sec>] [--skip-export]
//
// Con --skip-export non rigenera i PNG se sono già presenti in export/<content>/

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { PDFDocument } = require('pdf-lib');

const args = process.argv.slice(2);
const clientArg = args.find(a => a.startsWith('--client='));
const client = clientArg ? clientArg.split('=')[1] : (process.env.CLIENT || 'comnia');
const keepaliveArg = args.find(a => a.startsWith('--keepalive='));
const keepaliveSec = keepaliveArg ? parseInt(keepaliveArg.split('=')[1], 10) : 180;
const skipExport = args.includes('--skip-export');

const positional = args.filter(a => !a.startsWith('--'));
const contentName = positional[0];
if (!contentName) {
  console.error('Usage: node scripts/canva-png-upload.js <content-name> [--client=<name>] [--keepalive=<sec>] [--skip-export]');
  process.exit(1);
}

const clientRoot = path.join(__dirname, '..', 'clients', client);
const inputDir = path.join(clientRoot, 'output', contentName);
const exportDir = path.join(clientRoot, 'export', contentName);

if (!fs.existsSync(clientRoot)) {
  console.error(`Cliente non trovato: clients/${client}`);
  process.exit(1);
}

if (!fs.existsSync(inputDir)) {
  console.error(`Cartella slide non trovata: ${inputDir}`);
  process.exit(1);
}

const htmlFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.html')).sort();
if (htmlFiles.length === 0) {
  console.error(`Nessun file .html trovato in ${inputDir}`);
  process.exit(1);
}

console.log(`[canva-png-upload] cliente: ${client}`);
console.log(`[canva-png-upload] contenuto: ${contentName}`);
console.log(`[canva-png-upload] slide HTML: ${htmlFiles.length} (${htmlFiles.join(', ')})`);

let server = null;
let cf = null;
let cleanupCalled = false;
let urlTimeoutTimer = null;
let keepaliveTimer = null;

function cleanup(code = 0) {
  if (cleanupCalled) return;
  cleanupCalled = true;
  if (urlTimeoutTimer) clearTimeout(urlTimeoutTimer);
  if (keepaliveTimer) clearTimeout(keepaliveTimer);
  if (cf) { try { cf.kill('SIGTERM'); } catch {} }
  if (server) { try { server.close(); } catch {} }
  setTimeout(() => process.exit(code), 200);
}

process.on('SIGINT', () => cleanup(130));
process.on('SIGTERM', () => cleanup(143));

(async () => {
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

  const pngEntries = []; // [{filename, buffer}]

  // Controlla se i PNG esistono già (per --skip-export)
  const existingPngs = skipExport
    ? fs.readdirSync(exportDir).filter(f => /^slide-\d+\.png$/i.test(f)).sort()
    : [];

  if (skipExport && existingPngs.length === htmlFiles.length) {
    console.log(`[canva-png-upload] --skip-export: carico ${existingPngs.length} PNG esistenti`);
    for (const f of existingPngs) {
      const buffer = fs.readFileSync(path.join(exportDir, f));
      pngEntries.push({ filename: f, buffer });
      console.log(`  ✓ ${f}  (${(buffer.length / 1024).toFixed(0)} KB)`);
    }
  } else {
    // Genera PNG da HTML via Puppeteer
    if (skipExport && existingPngs.length !== htmlFiles.length) {
      console.log(`[canva-png-upload] PNG non trovati o mancanti — rigenero da HTML`);
    } else {
      console.log(`[canva-png-upload] generazione PNG @2x da HTML...`);
    }

    const browser = await puppeteer.launch();

    for (const file of htmlFiles) {
      const page = await browser.newPage();
      const filePath = path.join(inputDir, file);
      const html = fs.readFileSync(filePath, 'utf-8');

      const isStory = html.includes('slide--story');
      const width = 1080;
      const height = isStory ? 1920 : 1350;

      await page.setViewport({ width, height, deviceScaleFactor: 2 });
      await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        const images = Array.from(document.images);
        await Promise.all(images.map(img => img.complete
          ? Promise.resolve()
          : new Promise(res => { img.onload = img.onerror = res; })
        ));
      });

      const baseName = file.replace('.html', '');
      const pngFilename = `${baseName}.png`;
      const pngPath = path.join(exportDir, pngFilename);

      const buffer = await page.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width, height }
      });

      fs.writeFileSync(pngPath, buffer);
      pngEntries.push({ filename: pngFilename, buffer: Buffer.from(buffer) });
      console.log(`  ✓ ${pngFilename}  (${width * 2}×${height * 2} · ${(buffer.length / 1024).toFixed(0)} KB)`);

      await page.close();
    }

    await browser.close();
    console.log(`[canva-png-upload] ${pngEntries.length} PNG salvati in clients/${client}/export/${contentName}/`);
  }

  // Wrap PNGs in un PDF multi-pagina (raster, non-editabile in Canva)
  console.log(`[canva-png-upload] wrappo i PNG in un PDF multi-pagina (raster)...`);
  const pdfDoc = await PDFDocument.create();
  for (const entry of pngEntries) {
    const pngImage = await pdfDoc.embedPng(entry.buffer);
    const w = pngImage.width;
    const h = pngImage.height;
    const page = pdfDoc.addPage([w, h]);
    page.drawImage(pngImage, { x: 0, y: 0, width: w, height: h });
  }
  const pdfBytes = Buffer.from(await pdfDoc.save());
  const pdfFilename = `${contentName}.pdf`;
  console.log(`[canva-png-upload] PDF multi-pagina: ${pdfFilename} — ${(pdfBytes.length / 1024).toFixed(0)} KB · ${pdfDoc.getPageCount()} pagine`);

  // Server HTTP locale
  const port = await new Promise((resolve, reject) => {
    const tmpServer = http.createServer((req, res) => {
      const requestedFile = decodeURIComponent(req.url.replace(/^\//, ''));
      if (requestedFile === pdfFilename) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdfFilename}"`);
        res.setHeader('Content-Length', pdfBytes.length);
        res.end(pdfBytes);
        return;
      }
      const entry = pngEntries.find(p => p.filename === requestedFile);
      if (entry) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="${entry.filename}"`);
        res.setHeader('Content-Length', entry.buffer.length);
        res.end(entry.buffer);
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
    });
    tmpServer.on('error', reject);
    tmpServer.listen(0, '127.0.0.1', () => {
      server = tmpServer;
      resolve(tmpServer.address().port);
    });
  });

  console.log(`[canva-png-upload] server locale attivo su porta ${port}`);

  // cloudflared quick tunnel
  console.log(`[canva-png-upload] avvio cloudflared quick tunnel...`);
  cf = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${port}`], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let publicBaseUrl = null;

  const onChunk = (chunk) => {
    const text = chunk.toString();
    if (!publicBaseUrl) {
      const m = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (m) {
        publicBaseUrl = m[0];
        if (urlTimeoutTimer) clearTimeout(urlTimeoutTimer);

        console.log('');
        console.log(`PUBLIC_URL=${publicBaseUrl}/${pdfFilename}`);
        console.log('');
        console.log(`[canva-png-upload] PDF (${pngEntries.length} pagine raster) pronto. Server attivo per ${keepaliveSec} secondi.`);

        keepaliveTimer = setTimeout(() => {
          console.log(`[canva-png-upload] keepalive scaduto, chiudo tunnel e server.`);
          cleanup(0);
        }, keepaliveSec * 1000);
      }
    }
  };

  cf.stdout.on('data', onChunk);
  cf.stderr.on('data', onChunk);

  cf.on('error', (err) => {
    console.error(`[canva-png-upload] errore cloudflared: ${err.message}`);
    cleanup(1);
  });

  cf.on('exit', (code) => {
    if (!publicBaseUrl) {
      console.error(`[canva-png-upload] cloudflared terminato prima di restituire un URL (exit code: ${code})`);
      cleanup(1);
    }
  });

  urlTimeoutTimer = setTimeout(() => {
    if (!publicBaseUrl) {
      console.error(`[canva-png-upload] timeout: cloudflared non ha restituito un URL entro 30 secondi.`);
      cleanup(1);
    }
  }, 30000);

})().catch((err) => {
  console.error(`[canva-png-upload] errore: ${err.message}`);
  cleanup(1);
});
