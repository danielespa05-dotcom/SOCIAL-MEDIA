// One-off upload: wraps the 1500x785 PNG in a PDF and exposes via cloudflared.
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { PDFDocument } = require(path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'pdf-lib'));

const here = __dirname;
const pngPath = path.join(here, 'ig-caricabatterie-ev.png');
const pdfName = 'ig-caricabatterie-ev.pdf';
const pdfPath = path.join(here, pdfName);
const keepaliveSec = 240;

(async () => {
  const pngBuf = fs.readFileSync(pngPath);
  const pdf = await PDFDocument.create();
  const img = await pdf.embedPng(pngBuf);
  const page = pdf.addPage([img.width, img.height]);
  page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  const out = await pdf.save();
  fs.writeFileSync(pdfPath, out);
  console.log(`PDF: ${pdfPath} (${img.width}x${img.height})`);

  const server = http.createServer((req, res) => {
    if (req.url === '/' + pdfName || req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Length': out.length });
      res.end(out);
    } else {
      res.writeHead(404); res.end('not found');
    }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  console.log(`HTTP: http://127.0.0.1:${port}/${pdfName}`);

  const cf = spawn('cloudflared', ['tunnel', '--url', `http://127.0.0.1:${port}`], { stdio: ['ignore', 'pipe', 'pipe'] });
  let printed = false;
  const onData = (d) => {
    const s = d.toString();
    const m = s.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (m && !printed) {
      printed = true;
      console.log(`PUBLIC_URL=${m[0]}/${pdfName}`);
    }
  };
  cf.stdout.on('data', onData);
  cf.stderr.on('data', onData);

  setTimeout(() => {
    console.log('keepalive done');
    try { cf.kill('SIGTERM'); } catch {}
    server.close(() => process.exit(0));
  }, keepaliveSec * 1000);
})();
