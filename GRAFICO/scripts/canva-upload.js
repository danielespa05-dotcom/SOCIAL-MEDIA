const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { PDFDocument } = require('pdf-lib');

const args = process.argv.slice(2);
const clientArg = args.find(a => a.startsWith('--client='));
const client = clientArg ? clientArg.split('=')[1] : (process.env.CLIENT || 'comnia');
const keepaliveArg = args.find(a => a.startsWith('--keepalive='));
const keepaliveSec = keepaliveArg ? parseInt(keepaliveArg.split('=')[1], 10) : 90;

const positional = args.filter(a => !a.startsWith('--'));
const contentName = positional[0];
if (!contentName) {
  console.error('Usage: node scripts/canva-upload.js <content-name> [--client=<name>] [--keepalive=<sec>]');
  console.error('  Default keepalive: 90 secondi (tempo durante il quale il PDF resta scaricabile)');
  process.exit(1);
}

const clientRoot = path.join(__dirname, '..', 'clients', client);
const exportDir = path.join(clientRoot, 'export', contentName);

if (!fs.existsSync(exportDir)) {
  console.error(`Cartella export non trovata: ${exportDir}`);
  console.error(`Esegui prima: npm run export -- ${contentName} --client=${client}`);
  process.exit(1);
}

const pdfFiles = fs.readdirSync(exportDir)
  .filter(f => /^slide-\d+\.pdf$/i.test(f))
  .sort();

if (pdfFiles.length === 0) {
  console.error(`Nessun file slide-XX.pdf trovato in ${exportDir}`);
  console.error(`Esegui prima: npm run export -- ${contentName} --client=${client}`);
  process.exit(1);
}

console.log(`[canva-upload] cliente: ${client}`);
console.log(`[canva-upload] contenuto: ${contentName}`);
console.log(`[canva-upload] trovati ${pdfFiles.length} PDF: ${pdfFiles.join(', ')}`);

let publicUrl = null;
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
  console.log(`[canva-upload] unisco i PDF in un singolo file multi-pagina...`);
  const merged = await PDFDocument.create();
  for (const f of pdfFiles) {
    const bytes = fs.readFileSync(path.join(exportDir, f));
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  const mergedBytes = Buffer.from(await merged.save());
  const filename = `${contentName}.pdf`;
  console.log(`[canva-upload] PDF unito: ${filename} — ${(mergedBytes.length / 1024).toFixed(0)} KB · ${merged.getPageCount()} pagine`);

  const port = await new Promise((resolve, reject) => {
    const tmpServer = http.createServer((req, res) => {
      const expected = '/' + filename;
      if (req.url === expected || req.url === '/' + encodeURIComponent(filename)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Content-Length', mergedBytes.length);
        res.end(mergedBytes);
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
  console.log(`[canva-upload] server locale attivo: http://127.0.0.1:${port}/${filename}`);

  console.log(`[canva-upload] avvio cloudflared quick tunnel...`);
  cf = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${port}`], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const onChunk = (chunk) => {
    const text = chunk.toString();
    if (!publicUrl) {
      const m = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (m) {
        publicUrl = `${m[0]}/${filename}`;
        if (urlTimeoutTimer) clearTimeout(urlTimeoutTimer);
        console.log(``);
        console.log(`PUBLIC_URL=${publicUrl}`);
        console.log(``);
        console.log(`[canva-upload] URL pubblico pronto. Server attivo per ${keepaliveSec} secondi.`);
        keepaliveTimer = setTimeout(() => {
          console.log(`[canva-upload] keepalive scaduto, chiudo tunnel e server.`);
          cleanup(0);
        }, keepaliveSec * 1000);
      }
    }
  };

  cf.stdout.on('data', onChunk);
  cf.stderr.on('data', onChunk);

  cf.on('error', (err) => {
    console.error(`[canva-upload] errore cloudflared: ${err.message}`);
    cleanup(1);
  });

  cf.on('exit', (code) => {
    if (!publicUrl) {
      console.error(`[canva-upload] cloudflared terminato prima di restituire un URL (exit code: ${code})`);
      cleanup(1);
    }
  });

  urlTimeoutTimer = setTimeout(() => {
    if (!publicUrl) {
      console.error(`[canva-upload] timeout: cloudflared non ha restituito un URL entro 30 secondi.`);
      cleanup(1);
    }
  }, 30000);
})().catch((err) => {
  console.error(`[canva-upload] errore: ${err.message}`);
  cleanup(1);
});
