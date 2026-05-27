const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const clientArg = args.find(a => a.startsWith('--client='));
const client = clientArg ? clientArg.split('=')[1] : 'comnia';
const positional = args.filter(a => !a.startsWith('--client='));
const contentName = positional[0];
const slideName = positional[1] || 'slide-01';

if (!contentName) {
  console.error('Usage: node slide-to-canva.js <content-name> [slide-name] [--client=<name>]');
  console.error('Example: node slide-to-canva.js carosello_presa_16a_ricarica slide-01 --client=siria');
  process.exit(1);
}

const clientRoot = path.join(__dirname, '..', 'clients', client);
const slidePath = path.join(clientRoot, 'output', contentName, `${slideName}.html`);
const outDir = path.join(clientRoot, 'export', contentName, 'canva');

if (!fs.existsSync(slidePath)) {
  console.error(`Slide non trovata: ${slidePath}`);
  process.exit(1);
}

(async () => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const html = fs.readFileSync(slidePath, 'utf-8');
  const isStory = html.includes('slide--story');
  const width = 1080;
  const height = isStory ? 1920 : 1350;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // PDF — vettoriale, testi restano testi
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(`file://${slidePath}`, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.images);
    await Promise.all(images.map(img => img.complete
      ? Promise.resolve()
      : new Promise(res => { img.onload = img.onerror = res; })
    ));
  });

  const pdfPath = path.join(outDir, `${slideName}.pdf`);
  await page.pdf({
    path: pdfPath,
    width: `${width}px`,
    height: `${height}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false
  });
  console.log(`✓ PDF (vettoriale):  ${pdfPath}`);

  // PNG hi-res 3×
  const page2 = await browser.newPage();
  await page2.setViewport({ width, height, deviceScaleFactor: 3 });
  await page2.goto(`file://${slidePath}`, { waitUntil: 'networkidle0' });
  await page2.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.images);
    await Promise.all(images.map(img => img.complete
      ? Promise.resolve()
      : new Promise(res => { img.onload = img.onerror = res; })
    ));
  });

  const pngPath = path.join(outDir, `${slideName}@3x.png`);
  await page2.screenshot({
    path: pngPath,
    type: 'png',
    clip: { x: 0, y: 0, width, height }
  });
  console.log(`✓ PNG @3x (raster):  ${pngPath}  (${width * 3}×${height * 3})`);

  await browser.close();
  console.log(`\nFile salvati in: ${outDir}`);
  console.log(`\nCome usarli in Canva:`);
  console.log(`  • PDF  → Canva Pro: "Crea design da file" o "Importa file" → diventa editabile`);
  console.log(`  • PNG  → Canva Free/Pro: caricalo come immagine, lavora sopra (non editabile per-elemento)`);
})();
