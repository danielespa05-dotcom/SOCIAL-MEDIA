const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const args = process.argv.slice(2);
const clientArg = args.find(a => a.startsWith('--client='));
const client = clientArg ? clientArg.split('=')[1] : (process.env.CLIENT || 'comnia');

const positional = args.filter(a => !a.startsWith('--client='));
const contentName = positional[0];
if (!contentName) {
  console.error('Usage: node preview.js <content-name> [--client=<name>]');
  process.exit(1);
}

const clientRoot = path.join(__dirname, '..', 'clients', client);
if (!fs.existsSync(clientRoot)) {
  console.error(`Cliente non trovato: clients/${client}`);
  process.exit(1);
}

// Per-client preview config (IG handle, avatar letters, accent color)
const previewConfigPath = path.join(clientRoot, 'brand', 'preview-config.json');
let previewConfig = {
  username: client,
  avatarText: client.slice(0, 2),
  avatarAccentIdx: 1,
  avatarAccentColor: '#C82B2B',
  avatarBg: '#0A0A0A'
};
if (fs.existsSync(previewConfigPath)) {
  try {
    previewConfig = { ...previewConfig, ...JSON.parse(fs.readFileSync(previewConfigPath, 'utf-8')) };
  } catch (e) {
    console.warn(`Warning: impossibile leggere ${previewConfigPath}, uso defaults`);
  }
}

const inputDir = path.join(clientRoot, 'output', contentName);
if (!fs.existsSync(inputDir)) {
  console.error(`Cartella non trovata: clients/${client}/output/${contentName}`);
  process.exit(1);
}

const slides = fs.readdirSync(inputDir)
  .filter(f => f.match(/^slide-\d+\.html$/))
  .sort();

if (slides.length === 0) {
  console.error(`Nessuna slide trovata in clients/${client}/output/${contentName}`);
  process.exit(1);
}

const firstSlide = fs.readFileSync(path.join(inputDir, slides[0]), 'utf-8');
const isStory = firstSlide.includes('slide--story');
const canvasW = 1080;
const canvasH = isStory ? 1920 : 1350;

// Build avatar inner HTML: letters with one accent-colored char
const avatarHtml = previewConfig.avatarText.split('').map((ch, i) =>
  i === previewConfig.avatarAccentIdx
    ? `<span class="o-red">${ch}</span>`
    : ch
).join('');

const previewHtml = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Preview — ${contentName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #fafafa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: #262626;
}

.header-bar {
  width: 100%;
  max-width: 470px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #8e8e8e;
}

.header-bar strong { color: #262626; }

.ig-post {
  width: 100%;
  max-width: 470px;
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  overflow: hidden;
}

.ig-header {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  gap: 10px;
}

.ig-avatar-ring {
  padding: 2px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.ig-avatar-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${previewConfig.avatarBg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 900;
  font-size: 14px;
  border: 2px solid #fff;
}

.ig-avatar-inner .o-red { color: ${previewConfig.avatarAccentColor}; }

.ig-username {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

.ig-username .verified {
  display: inline-block;
  margin-left: 2px;
  width: 12px;
  height: 12px;
  background: #3897f0;
  border-radius: 50%;
  vertical-align: middle;
  position: relative;
}

.ig-username .verified::after {
  content: '✓';
  position: absolute;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.ig-more {
  font-size: 20px;
  letter-spacing: 2px;
  color: #262626;
  cursor: pointer;
}

.ig-media {
  position: relative;
  width: 100%;
  aspect-ratio: ${canvasW} / ${canvasH};
  background: #000;
  overflow: hidden;
}

.slides-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.slide-frame {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slide-frame iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: ${canvasW}px;
  height: ${canvasH}px;
  border: 0;
  transform-origin: top left;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #262626;
  z-index: 5;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: opacity 0.2s;
}

.nav-arrow:disabled {
  opacity: 0;
  pointer-events: none;
}

.nav-prev { left: 10px; }
.nav-next { right: 10px; }

.slide-counter {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 5;
}

.ig-actions {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  gap: 16px;
}

.ig-actions svg {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.ig-actions .spacer { flex: 1; }

.ig-dots {
  display: flex;
  gap: 4px;
  justify-content: center;
  padding: 4px 0 8px;
}

.ig-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c7c7c7;
  transition: background 0.2s;
}

.ig-dot.active { background: #0095f6; }

.ig-likes {
  padding: 0 14px 6px;
  font-size: 14px;
  font-weight: 600;
}

.ig-caption {
  padding: 0 14px 10px;
  font-size: 14px;
  line-height: 1.4;
}

.ig-caption strong { font-weight: 600; }

.ig-time {
  padding: 0 14px 12px;
  font-size: 11px;
  color: #8e8e8e;
  text-transform: uppercase;
  letter-spacing: 0.2px;
}

.hint {
  margin-top: 20px;
  font-size: 12px;
  color: #8e8e8e;
  text-align: center;
}

.hint kbd {
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 11px;
}
</style>
</head>
<body>

<div class="header-bar">
  <span>Preview — <strong>${contentName}</strong> · cliente <strong>${client}</strong></span>
  <span>${slides.length} slide · ${isStory ? 'Story 9:16' : 'Post 4:5'}</span>
</div>

<div class="ig-post">
  <div class="ig-header">
    <div class="ig-avatar-ring">
      <div class="ig-avatar-inner">${avatarHtml}</div>
    </div>
    <div class="ig-username">${previewConfig.username}<span class="verified"></span></div>
    <div class="ig-more">⋯</div>
  </div>

  <div class="ig-media" id="media">
    <div class="slide-counter" id="counter">1/${slides.length}</div>
    <div class="slides-track" id="track">
      ${slides.map((s, i) => `<div class="slide-frame"><iframe src="../output/${contentName}/${s}?v=${Date.now()}" data-idx="${i}" scrolling="no"></iframe></div>`).join('\n      ')}
    </div>
    <button class="nav-arrow nav-prev" id="prev" aria-label="Precedente">‹</button>
    <button class="nav-arrow nav-next" id="next" aria-label="Successiva">›</button>
  </div>

  <div class="ig-actions">
    <svg viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/></svg>
    <svg viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <svg viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
    <div class="spacer"></div>
    <svg viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
  </div>

  <div class="ig-dots" id="dots">
    ${slides.map((_, i) => `<div class="ig-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></div>`).join('')}
  </div>

  <div class="ig-likes">Piace a <strong>${previewConfig.username}</strong> e altri</div>
  <div class="ig-caption"><strong>${previewConfig.username}</strong> ${contentName.replace(/-/g, ' ')} ▶</div>
  <div class="ig-time">Oggi</div>
</div>

<div class="hint">
  Usa <kbd>←</kbd> <kbd>→</kbd> o trascina per scorrere · click sulle frecce · tap sui puntini
</div>

<script>
const track = document.getElementById('track');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const counter = document.getElementById('counter');
const dots = [...document.querySelectorAll('.ig-dot')];
const media = document.getElementById('media');
const total = ${slides.length};
const canvasW = ${canvasW};
const canvasH = ${canvasH};
let idx = 0;

function scaleIframes() {
  const rect = media.getBoundingClientRect();
  const scale = rect.width / canvasW;
  document.querySelectorAll('.slide-frame iframe').forEach(f => {
    f.style.transform = 'scale(' + scale + ')';
  });
}

function render() {
  track.style.transform = 'translateX(-' + (idx * 100) + '%)';
  counter.textContent = (idx + 1) + '/' + total;
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === total - 1;
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function go(n) {
  idx = Math.max(0, Math.min(total - 1, n));
  render();
}

prevBtn.addEventListener('click', () => go(idx - 1));
nextBtn.addEventListener('click', () => go(idx + 1));
dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.idx)));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') go(idx - 1);
  if (e.key === 'ArrowRight') go(idx + 1);
});

let startX = null;
media.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
media.addEventListener('touchend', e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
  startX = null;
});

let mouseStart = null;
media.addEventListener('mousedown', e => { mouseStart = e.clientX; });
media.addEventListener('mouseup', e => {
  if (mouseStart === null) return;
  const dx = e.clientX - mouseStart;
  if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
  mouseStart = null;
});

window.addEventListener('resize', scaleIframes);
window.addEventListener('load', scaleIframes);
scaleIframes();
render();
</script>

</body>
</html>`;

const previewDir = path.join(clientRoot, 'preview');
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

const previewPath = path.join(previewDir, `${contentName}.html`);
fs.writeFileSync(previewPath, previewHtml);

console.log(`✓ Preview generata: clients/${client}/preview/${contentName}.html`);
console.log(`  ${slides.length} slide · formato ${isStory ? 'Story 1080x1920' : 'Post 1080x1350'}`);

exec(`open "${previewPath}"`, err => {
  if (err) console.error('Apri manualmente:', previewPath);
});
