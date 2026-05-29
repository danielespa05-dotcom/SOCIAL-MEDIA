# COPYWRITER

Generatore di contenuti social (caroselli, post, story) multi-cliente.
HTML/CSS → PNG/PDF/MP4, con upload su Canva via cloudflared.

---

## Setup su un nuovo computer

### 1. Clona il repo

```bash
git clone <url-repo-github>
cd COPYWRITER
```

### 2. Installa Node.js (v24 LTS)

```bash
brew install node
```

### 3. Installa cloudflared

```bash
brew install cloudflared
```

### 4. Installa le dipendenze npm

```bash
cd GRAFICO
npm install
```

Puppeteer scarica Chromium durante l'installazione — può volerci qualche minuto.

---

## Comandi principali

Tutti i comandi vanno eseguiti dalla cartella `GRAFICO/`.

```bash
# Preview Instagram swipeable nel browser
node scripts/preview.js <nome-contenuto> --client=<cliente>

# Export PNG/MP4 finali
node scripts/export.js <nome-contenuto> --client=<cliente>

# Upload su Canva (pixel-perfect, non editabile)
npm run canva-png-upload -- <nome-contenuto> --client=<cliente>

# Upload su Canva (testi editabili)
npm run canva-upload -- <nome-contenuto> --client=<cliente>
```

Clienti disponibili: `comnia`, `siria`

---

## Struttura

```
GRAFICO/
├── scripts/          # export.js, preview.js, canva-upload.js, canva-png-upload.js
├── clients/
│   ├── comnia/       # brand, templates, output (sorgenti HTML), export (PNG/MP4)
│   └── siria/        # brand, templates, output (sorgenti HTML), export (PNG/MP4)
└── package.json
SCRITTORE/
└── clients/          # copy e brief testuali per cliente
```

Le cartelle `export/` e `preview/` sono escluse da git (file generati).
I sorgenti HTML in `output/` sono versionati.
