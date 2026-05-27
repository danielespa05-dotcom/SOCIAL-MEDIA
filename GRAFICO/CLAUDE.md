# Social Content Generator — Sistema multi-cliente

## Cos'è questo progetto

Generatore di contenuti social (caroselli Instagram, post singoli, story) **condiviso tra più clienti**. L'output è HTML/CSS per ogni slide, visualizzabile in browser e esportabile in PNG/JPG/MP4.

Lo stesso motore (script + dipendenze) serve tutti i clienti. Ogni cliente ha la sua cartella isolata con brand, template, contenuti, export e preview.

---

## Struttura del progetto

```
GRAFICO/
├── CLAUDE.md                     # Questo file — guida di sistema
├── package.json                  # Dipendenze condivise (puppeteer, ffmpeg-static)
├── node_modules/                 # Condiviso
├── scripts/
│   ├── export.js                 # HTML → PNG/JPG/PDF/MP4 (accetta --client=<nome>)
│   ├── preview.js                # Mockup IG swipeable (accetta --client=<nome>)
│   ├── canva-upload.js           # PDF vettoriali → cloudflared → Canva (testi editabili)
│   └── canva-png-upload.js       # HTML → PNG @2x → PDF raster → cloudflared → Canva (non editabile, pixel-perfect)
└── clients/
    ├── comnia/
    │   ├── CLAUDE.md             # Brand book + design system COMNIA
    │   ├── brand/
    │   │   ├── brand-profile.json
    │   │   ├── preview-config.json    # Username IG, avatar
    │   │   └── assets/                # Loghi, foto team permanenti
    │   ├── templates/
    │   │   ├── carousel/ post/ story/
    │   ├── output/[nome-contenuto]/   # HTML sorgente + asset one-shot
    │   ├── export/[nome-contenuto]/   # PNG/MP4 finali
    │   └── preview/[nome-contenuto].html
    └── siria/
        ├── CLAUDE.md
        ├── brand/ templates/ output/ export/ preview/
```

**Principio:** tutto ciò che è specifico di un cliente vive sotto `clients/<nome>/`. Lo `scripts/` e le dipendenze sono condivisi e non vanno duplicati per cliente.

---

## Come selezionare il cliente

Tutti gli script accettano il flag `--client=<nome>` (di default `comnia`):

```bash
node scripts/preview.js nome-contenuto --client=siria
node scripts/export.js nome-contenuto --client=siria
node scripts/export.js nome-contenuto --client=comnia --jpg
```

In alternativa, si può settare `CLIENT=siria` come variabile d'ambiente.

Lo script:
1. Risolve `clients/<client>/output/<nome-contenuto>/` come input
2. Genera output in `clients/<client>/export/<nome-contenuto>/` (export) o `clients/<client>/preview/<nome-contenuto>.html` (preview)

---

## Workflow generico (vale per tutti i clienti)

1. **Identificare il cliente**: l'utente indica per quale cliente è il contenuto. Se non specificato, chiedere.
2. **Leggere il CLAUDE.md del cliente** in `clients/<client>/CLAUDE.md` per palette, font, tono, template specifici.
3. **Generare le slide** in `clients/<client>/output/<nome-contenuto>/` rispettando il design system del cliente.
4. **Lanciare il preview** subito dopo aver creato/modificato le slide:
   ```bash
   node scripts/preview.js <nome-contenuto> --client=<client>
   ```
   Questo apre nel browser il mockup Instagram swipeable.
5. **Iterare** sulle modifiche. Rilanciare il preview dopo ogni modifica.
6. **Export finale** quando approvato:
   ```bash
   node scripts/export.js <nome-contenuto> --client=<client>
   ```

**Regola universale:** non aprire mai le singole slide HTML con `open slide-XX.html`. Usare sempre il preview IG.

---

## Dimensioni canvas (standard per tutti i clienti)

| Formato       | Larghezza | Altezza | Aspect ratio |
|---------------|-----------|---------|--------------|
| Post/Carousel | 1080px    | 1350px  | 4:5          |
| Story         | 1080px    | 1920px  | 9:16         |

---

## Stack tecnico (condiviso)

- **puppeteer** — screenshot HTML → PNG (1080x1350 o 1080x1920), usato da `export.js` e da `canva-png-upload.js`
- **ffmpeg-static** — slide con `<video>` → MP4 con overlay
- **pdf-lib** — usata da `canva-upload.js` (merge dei PDF vettoriali per-slide in un singolo PDF multi-pagina) e da `canva-png-upload.js` (wrap dei PNG raster in un PDF multi-pagina ognuna pagina = un'immagine)
- Ogni file HTML è standalone: CSS inline, nessuna dipendenza esterna tranne Google Fonts

Lo script `export.js` auto-rileva `<video>` nelle slide e produce MP4 invece di PNG. Vedi il `CLAUDE.md` del cliente per i dettagli di brand (palette video, ecc.).

---

## Upload su Canva via cloudflared (2 varianti)

Per portare un carosello dentro Canva ci sono **due script** che differiscono solo per il tipo di file pubblicato via cloudflared. La scelta dipende dal trade-off **editabilità vs fedeltà**.

| Script | Sorgente | Cosa diventa in Canva | Quando usarlo |
|---|---|---|---|
| `canva-upload.js` | PDF vettoriali per-slide (`slide-XX.pdf` generati da `export.js --pdf`) | Layer editabili: i testi restano testo, le forme restano forme | Clienti che vogliono editare i contenuti su Canva (es. **Comnia**, o brand con design semplici dove l'estrazione testo di Canva funziona bene) |
| `canva-png-upload.js` | HTML (rigenera PNG @2x internamente via Puppeteer) | Immagini raster non editabili: una pagina = un PNG full-bleed | Pixel-perfect, quando l'estrazione testo di Canva crea bug (font sostituiti, span concatenati, filtri CSS sui loghi). Usato da **Siria** (Opzione C, default per quel cliente) |

**Prerequisito comune:** `cloudflared` installato (`brew install cloudflared`).

### Variante A — `canva-upload.js` (testi editabili)

```bash
npm run export -- <nome-contenuto> --client=<client> --pdf   # genera i PDF
npm run canva-upload -- <nome-contenuto> --client=<client> [--keepalive=<sec>]
```

Lo script unisce i PDF per-slide in un singolo multi-pagina e lo espone via cloudflared. Claude poi chiama `import-design-from-url` con l'URL stampato.

### Variante B — `canva-png-upload.js` (pixel-perfect, non editabile)

```bash
npm run canva-png-upload -- <nome-contenuto> --client=<client> [--keepalive=<sec>] [--skip-export]
```

Lo script genera PNG @2x da HTML, li wrappa in un PDF raster multi-pagina, espone via cloudflared. Claude chiama `import-design-from-url` con l'URL stampato. Vedi `clients/siria/CLAUDE.md` per il flusso completo end-to-end (naming, cartella di destinazione).

### Note comuni a entrambi gli script

- Lo script stampa `PUBLIC_URL=https://....trycloudflare.com/<nome>.pdf` quando l'URL è pronto, poi resta vivo per il keepalive (default 90s per `canva-upload`, 180s per `canva-png-upload`).
- L'URL è temporaneo e cambia a ogni run. Cloudflare quick tunnels è "best-effort": può tardare 5-10 secondi a propagarsi → se il primo import fallisce con `"Failed to download"`, verificare con `curl -I <URL>` e riprovare l'import.
- Lo script va in errore dopo 30 secondi se cloudflared non risponde affatto.
- Il file è esposto pubblicamente per la durata del keepalive: URL random ma chiunque lo conosca può scaricarlo finché vive.

### Quale scegliere per un nuovo cliente

Default: parti da `canva-upload.js` (variante A). Se vedi bug di importazione su Canva (logo placeholder, testo concatenato, font shift evidenti) e il cliente non ha bisogno di editare i testi su Canva, switcha a `canva-png-upload.js` (variante B). Codifica la scelta in `clients/<client>/CLAUDE.md`.

---

## Gestione asset (regole generali)

Due categorie separate per ogni cliente, due posti separati:

### Brand asset → `clients/<client>/brand/assets/`
Immagini **permanenti e riutilizzabili** dal cliente:
- Loghi, foto del team, icone, pattern, texture

Path nei template: `../../brand/assets/nome-file.png`

### Asset di contenuto → `clients/<client>/output/<nome-contenuto>/`
Immagini che appartengono a **un singolo contenuto**:
- Screenshot, grafici, foto di contesto specifiche

Layout:
- **< 5 immagini** → flat accanto agli `.html`
- **5+ immagini** → dentro `img/`

Path nelle slide: `./screenshot.png` o `./img/foto-1.jpg`

### Regole assolute
- **MAI** mettere asset one-shot in `brand/assets/` — inquina il brand kit.
- **MAI** referenziare asset da un altro cliente. Ogni cliente è isolato.
- **MAI** referenziare asset di un carosello da un altro contenuto dello stesso cliente — promuoverlo a brand asset.

---

## Aggiungere un nuovo cliente

1. Copia la struttura: `cp -R clients/comnia clients/<nuovo-cliente>`
2. Svuota `output/`, `export/`, `preview/`:
   ```bash
   rm -rf clients/<nuovo-cliente>/{output,export,preview}/*
   ```
3. Modifica `clients/<nuovo-cliente>/brand/brand-profile.json` con nome, palette, tipografia del nuovo brand
4. Sostituisci `clients/<nuovo-cliente>/brand/assets/` con i loghi del nuovo cliente
5. Aggiorna `clients/<nuovo-cliente>/brand/preview-config.json` con username IG e avatar
6. Riscrivi `clients/<nuovo-cliente>/CLAUDE.md` con il brand book specifico (palette, font, regole, template)
7. Personalizza i template HTML in `clients/<nuovo-cliente>/templates/` con i nuovi colori/font

---

## Slide con video

Vale per tutti i clienti. Vedi il `CLAUDE.md` del cliente per il dettaglio del flow.

In sintesi:
1. Mettere il video in `clients/<client>/output/<nome-contenuto>/` (es. `video.mov`)
2. Nell'HTML: `<video src="./video.mov" autoplay loop muted playsinline>` con `object-fit: cover` o `contain`
3. Elementi sopra il video: classe `.above-video`
4. `export.js` auto-rileva e compone un MP4 1080×1350 in 3 layer (background, video, overlay)

---

## Quando lavori a un contenuto

Prima di toccare una slide:

1. **Chiedi/conferma per quale cliente** stai lavorando se non chiaro dal contesto
2. **Leggi `clients/<client>/CLAUDE.md`** per il design system di quel cliente (palette, tipografia, template, tono)
3. Tutti i comandi e i path devono includere il cliente corretto

Non mischiare mai brand o regole di un cliente con un altro.
