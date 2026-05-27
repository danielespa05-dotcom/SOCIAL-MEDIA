# COMNIA — Brand book & design system

> **Sistema generale:** vedi `GRAFICO/CLAUDE.md` per struttura multi-cliente, script, workflow.
> Questo file copre **solo** il brand COMNIA.

## Cliente

**Comnia** — digital agency di Padova. Tono diretto, informativo, opinionato. No meme, no pop culture, no emoji decorativi, no claim generici.

---

## Path di lavoro (cliente comnia)

- Brand: `clients/comnia/brand/`
- Template: `clients/comnia/templates/`
- Sorgente slide: `clients/comnia/output/<nome-contenuto>/`
- Export PNG/MP4: `clients/comnia/export/<nome-contenuto>/`
- Preview IG: `clients/comnia/preview/<nome-contenuto>.html`

Comandi:
```bash
node scripts/preview.js <nome-contenuto> --client=comnia
node scripts/export.js  <nome-contenuto> --client=comnia
```

(Il flag `--client=comnia` è il default e può essere omesso.)

---

## Design System COMNIA — Social

### Palette colori

| ID            | Hex       | Ruolo                                    | Quando usare                                  |
|---------------|-----------|------------------------------------------|-----------------------------------------------|
| `bg-dark`     | `#0A0A0A` | Sfondo scuro principale                  | Cover ad alto impatto, slide dark             |
| `bg-warm`     | `#F0EBE5` | Sfondo chiaro (beige caldo)              | Slide testo, content slide                    |
| `red-comnia`  | `#C82B2B` | Accent brand                             | Keyword highlight, CTA, frecce, logo O        |
| `red-cta`     | `#B71C1C` | CTA filled                               | Bottoni, badge CTA finale                     |
| `white`       | `#FFFFFF` | Testo su sfondo scuro                    | Titoli e body su bg-dark                      |
| `text-dark`   | `#1A1A1A` | Testo su sfondo chiaro                   | Titoli e body su bg-warm                      |
| `text-muted`  | `#6B6B6B` | Testo secondario su sfondo chiaro        | Attribution, caption, meta-info               |
| `bubble-dark` | `#1A1A1A` | Bubble/callout su sfondo chiaro          | Blocco evidenziato con testo bianco           |
| `bubble-light`| `#E8E3DD` | Bubble/callout su sfondo chiaro (soft)   | Blocco evidenziato con testo nero             |
| `pastel-yellow` | `#F5E642` | Accent pastello giallo                 | Etichette, tag, highlight sfondo, badge       |
| `pastel-coral`  | `#F5A89A` | Accent pastello corallo/rosso          | Etichette, tag, highlight sfondo, badge       |
| `pastel-blue`   | `#A8D8EA` | Accent pastello azzurro                | Etichette, tag, highlight sfondo, badge       |

**Regole ferree:**
- MAI usare `#FFFFFF` come sfondo sezione. Usare `#F0EBE5` per le slide chiare.
- MAI usare `red-comnia` come colore body text. Solo per keyword highlight e elementi UI.
- MAI usare grigi intermedi (#888, #AAA) per il testo. O bianco o nero, niente mezze misure.
- Il rosso si usa SOLO per: keyword highlight (bold), triangolino di navigazione (▶), CTA, logo O.
- **Spigoli vivi ovunque**: tutte le forme (bubble, tag, bottoni, immagini, accent line) hanno `border-radius: 0`. Mai arrotondare.

**Colori pastello — regole d'uso:**
- I 3 pastelli (giallo, corallo, azzurro) servono per dare vita alle slide senza rompere il sistema bitonale nero/beige.
- Usarli SOLO come sfondo di: etichette/tag, highlight di testo (stile evidenziatore), linee decorative, bullet/numerazione, badge categoria.
- Il testo sopra i pastelli è SEMPRE `text-dark` (#1A1A1A), mai bianco.
- MAI usare i pastelli come sfondo di un'intera slide o di una bubble grande.
- Alternare i 3 colori per dare varietà: se una slide ha un tag giallo, la successiva usa corallo o azzurro.
- Su sfondo `bg-dark`: i pastelli funzionano benissimo come accento (tag, highlight bar, accent line).
- Su sfondo `bg-warm`: i pastelli funzionano per tag e highlight bar, ma usare con moderazione (max 2 elementi pastello per slide).

### Tipografia

**Font:** `Montserrat` (Google Fonts) — fallback: `Poppins`, `sans-serif`

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');
```

| Livello          | Weight | Style   | Size (1080px canvas) | Case           | Uso                                    |
|------------------|--------|---------|----------------------|----------------|----------------------------------------|
| Display          | 900    | normal  | 72-96px              | uppercase      | Titolo cover, keyword giganti          |
| Heading          | 900    | normal  | 48-64px              | sentence_case  | Titolo slide interne                   |
| Body large       | 400    | normal  | 36-42px              | sentence_case  | Testo principale slide content         |
| Body large bold  | 700    | normal  | 36-42px              | sentence_case  | Keyword inline nel body                |
| Body large bold italic | 700 | italic | 36-42px           | sentence_case  | Frasi emotive, CTA testuali, commenti |
| Caption          | 400    | normal  | 24-28px              | sentence_case  | Attribution, fonte, data               |
| CTA text         | 700    | italic  | 36-42px              | sentence_case  | Testo dentro bottoni/badge CTA         |

**Regole tipografiche:**
- Titoli SEMPRE weight 900. Mai scendere sotto 700 per qualsiasi heading.
- Keyword highlight = stesso size del body ma in `bold` (700) + colore `red-comnia`.
- Frasi emotive/gancio = `bold italic` (700 italic) + colore `text-dark` o `white`.
- Interlinea body: `line-height: 1.4` — leggermente stretta, impattante.
- Interlinea titoli: `line-height: 1.1` — compatta, display.
- Letter-spacing titoli: `-0.02em` (tight). Mai largo.

### Elementi grafici ricorrenti

#### Logo
- Posizione: **top-right** o **top-center** su ogni slide
- Size: circa 80-100px di larghezza
- Variante: `logo-white.png` su sfondo scuro, `logo-dark.png` su sfondo chiaro
- Path nei template: `../../brand/assets/logo-white.png` (relativo da `clients/comnia/output/<contenuto>/slide.html`)
- Il logo NON va nella CTA finale (lì va il testo CTA)

#### Triangolino di navigazione (▶)
- Simbolo: `▶` (U+25B6, black right-pointing triangle — triangolo pieno)
- Colore: `red-comnia` (#C82B2B)
- Posizione: fine del testo, inline, allineato a destra
- Significato: "swipe per continuare"
- NON usare nella slide finale (CTA)

#### Bubble/Callout
- Border-radius: `0` (spigoli vivi — SEMPRE)
- Padding: `24-32px`
- Due varianti:
  - **Dark bubble**: bg `#1A1A1A`, testo `#FFFFFF` — su sfondo chiaro, per evidenziare concetto chiave
  - **Light bubble**: bg `#E8E3DD`, testo `#1A1A1A` — su sfondo chiaro, per citazioni o blocchi secondari

#### Divider
- Linea sottile `1px solid` in `#D0C8BE` (su sfondo chiaro) o `#333333` (su sfondo scuro)
- Usare con parsimonia, solo per separare blocchi logici

#### Immagini
- Le immagini (screenshot, grafici, foto di contesto) vanno inserite con:
  - `border-radius: 0` sempre (spigoli vivi)
  - Nessun bordo su sfondo scuro
  - Ombra leggera: `box-shadow: 0 4px 24px rgba(0,0,0,0.12)` su sfondo chiaro
- Le foto di persone possono essere ritagliate (cutout) con sfondo trasparente
- MAI usare meme. Preferire: screenshot di tool, grafici, foto di contesto reale, dati

---

## Template: Carosello Instagram (1080x1350)

### Slide 1 — Cover

**Scopo:** Hook visivo. Fermare lo scroll.

**Regole cover:**
- Sfondo: `bg-dark` (#0A0A0A) per massimo impatto, oppure `bg-warm` per tono informativo
- Titolo: weight 900, 72-96px, keyword in `red-comnia`
- Sottotitolo: weight 400, 32-36px, colore `white` o `text-muted`
- Se c'è un'immagine: posizionata in basso o a destra, max 50% dello spazio
- Triangolino `▶` in rosso alla fine del sottotitolo

### Slide 2-N — Content

**Scopo:** Argomentare. Un concetto per slide.

**Regole content:**
- Sfondo: `bg-warm` (#F0EBE5) — default per le slide testo
- Alternare: se ci sono 5+ slide, inserire 1 slide su sfondo `bg-dark` per ritmo visivo
- Un concetto per slide. Max 6-8 righe di testo.
- Keyword in **bold rosso**, concetti chiave in **bold nero**
- Usare bubble per isolare citazioni o dati importanti
- Se c'è un elenco: usare chevron `›` blu/rosso come bullet, mai bullet point standard
- Triangolino `▶` alla fine dell'ultima riga, allineato a destra
- Immagini (screenshot, grafici): posizionate sotto il testo o a fianco (50/50)

### Slide Finale — CTA

**Scopo:** Chiudere con azione o engagement.

**Regole CTA:**
- Sfondo: `bg-warm` o `bg-dark` (opposto alla slide precedente per contrasto)
- Logo centrato in alto
- Frase di chiusura: weight 700, 36-42px, tono diretto ("Cosa ne pensi?", "Parliamone")
- Bottone CTA: bg `red-cta` (#B71C1C), testo bianco, bold italic, border-radius `0` (spigoli vivi)
- Alternative al bottone: testo CTA grande in bold italic senza box
- NON usare triangolini `▶` nella slide finale

---

## Template: Post Singolo — Quote Card (1080x1350)

**Regole quote card:**
- Sfondo: `bg-warm` (#F0EBE5)
- Virgolette stilizzate: grandi, in `red-comnia`, font weight 900, size ~80px
- Citazione: weight 900, 42-54px, keyword in `red-comnia`
- Foto persona: ritaglio trasparente (cutout), posizionata in basso a destra, sovrapposta parzialmente al testo
- Attribution: weight 400, 24px, colore `text-muted`, allineato a sinistra sotto la citazione

---

## Template: Story Instagram (1080x1920)

**Regole story:**
- Sfondo: `bg-dark` per default (le story funzionano meglio scure)
- Titolo: weight 900, 64-80px, uppercase, bianco con keyword in rosso
- Body: weight 400, 32-36px, bianco
- Immagine: grande, centrata, occupa 40-50% dello spazio verticale
- CTA in basso: testo in bold italic bianco o bottone rosso
- Più verticale = più respiro. Non stipare tutto in alto.

---

## CSS Base COMNIA (da includere in ogni file HTML)

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

:root {
  --bg-dark: #0A0A0A;
  --bg-warm: #F0EBE5;
  --red-comnia: #C82B2B;
  --red-cta: #B71C1C;
  --white: #FFFFFF;
  --text-dark: #1A1A1A;
  --text-muted: #6B6B6B;
  --bubble-dark: #1A1A1A;
  --bubble-light: #E8E3DD;
  --pastel-yellow: #F5E642;
  --pastel-coral: #F5A89A;
  --pastel-blue: #A8D8EA;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.slide {
  width: 1080px;
  height: 1350px;
  position: relative;
  overflow: hidden;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slide--story { width: 1080px; height: 1920px; }
.slide--dark { background-color: var(--bg-dark); color: var(--white); }
.slide--light { background-color: var(--bg-warm); color: var(--text-dark); }

.logo { position: absolute; top: 40px; right: 40px; width: 90px; height: auto; }
.logo--center { right: auto; left: 50%; transform: translateX(-50%); }

.title { font-weight: 900; font-size: 72px; line-height: 1.1; letter-spacing: -0.02em; }
.title--display { font-size: 96px; text-transform: uppercase; }

.body-text { font-weight: 400; font-size: 38px; line-height: 1.4; }
.keyword { color: var(--red-comnia); font-weight: 700; }
.keyword-bold { font-weight: 700; }
.emotive { font-weight: 700; font-style: italic; }
.arrow { color: var(--red-comnia); font-weight: 900; }

.bubble { border-radius: 0; padding: 28px 32px; margin: 20px 0; }
.bubble--dark { background-color: var(--bubble-dark); color: var(--white); }
.bubble--light { background-color: var(--bubble-light); color: var(--text-dark); }

.cta-button {
  background-color: var(--red-cta); color: var(--white);
  font-weight: 700; font-style: italic; font-size: 36px;
  padding: 24px 48px; border-radius: 0;
  display: inline-block; text-align: center;
}

.caption { font-weight: 400; font-size: 24px; color: var(--text-muted); }
.quote-mark { font-weight: 900; font-size: 80px; color: var(--red-comnia); line-height: 0.8; }

.image-container { border-radius: 0; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
.image-container--dark { border-radius: 0; box-shadow: none; }

.tag {
  display: inline-block; font-weight: 700; font-size: 24px;
  padding: 8px 20px; border-radius: 0; color: var(--text-dark);
}
.tag--yellow { background-color: var(--pastel-yellow); }
.tag--coral { background-color: var(--pastel-coral); }
.tag--blue { background-color: var(--pastel-blue); }

.highlight-bar {
  display: inline; background-color: var(--pastel-yellow);
  padding: 2px 8px;
  box-decoration-break: clone; -webkit-box-decoration-break: clone;
}
.highlight-bar--coral { background-color: var(--pastel-coral); }
.highlight-bar--blue { background-color: var(--pastel-blue); }

.accent-line { width: 80px; height: 6px; border-radius: 0; }
.accent-line--yellow { background-color: var(--pastel-yellow); }
.accent-line--coral { background-color: var(--pastel-coral); }
.accent-line--blue { background-color: var(--pastel-blue); }
```

---

## Istruzioni operative (Comnia)

### Quando generi un carosello

1. Chiedi: **topic**, **numero di slide**, **tono** (informativo/opinione/educativo), **immagini** (opzionale)
2. Genera un file HTML per ogni slide in `clients/comnia/output/<nome-contenuto>/`
3. Ogni file HTML è **standalone**: CSS inline nell'`<head>`, immagini con path relativo
4. Usa le classi CSS sopra come base, personalizzando per ogni slide
5. Il testo va **hardcoded** nell'HTML (non dinamico)
6. Rispetta la struttura: cover → content → CTA
7. Alterna sfondo chiaro/scuro se il carosello ha 5+ slide
8. **Subito dopo:** `node scripts/preview.js <nome-contenuto> --client=comnia`

### Quando generi un post singolo

1. Chiedi: **citazione**, **autore**, **foto** (opzionale)
2. Genera un singolo file HTML in `clients/comnia/output/<nome-contenuto>/`
3. Foto come cutout in basso a destra se presente
4. Lancia il preview

### Quando generi una story

1. Chiedi: **messaggio**, **immagine** (opzionale), **CTA**
2. Genera un singolo file HTML con `.slide--story` (1080x1920)
3. Lancia il preview

### Regole assolute COMNIA

- **MAI** usare meme o riferimenti pop culture nelle immagini
- **MAI** usare sfondo bianco puro — sempre `bg-warm` o `bg-dark`
- **MAI** usare border-radius > 0 su qualsiasi forma (spigoli vivi ovunque)
- **MAI** usare font diversi da Montserrat
- **MAI** superare 8 righe di testo per slide
- **SEMPRE** inserire il logo su ogni slide
- **SEMPRE** inserire il triangolino `▶` in rosso sulle slide intermedie (mai nella CTA)
- **SEMPRE** usare bold (700) per keyword e bold italic (700i) per frasi emotive
- **SEMPRE** mantenere padding minimo 60px su tutti i lati

---

## Slide con video (carosello misto IG)

1. Metti il video in `clients/comnia/output/<nome-contenuto>/` (es. `video-cover.mov` o `.mp4`)
2. Nell'HTML: `<video src="./nome-video.mov" autoplay loop muted playsinline>` dentro il contenitore. CSS `object-fit: cover` o `contain`
3. Elementi sopra il video: classe `.above-video` — vanno in un layer sopra il video nell'MP4 finale
4. `export.js` auto-rileva `<video>` e produce MP4 1080×1350 in 3 layer
5. Output in `clients/comnia/export/<nome-contenuto>/`: `.mp4` per le slide con video, `.png` per le altre
6. IG accetta mp4 + png insieme nello stesso carosello

---

## Checklist pre-output (Comnia)

- [ ] Ogni slide ha il logo posizionato correttamente
- [ ] I colori usati sono SOLO quelli della palette definita
- [ ] Le keyword sono in bold rosso, i concetti in bold nero, le frasi emotive in bold italic
- [ ] Le slide intermedie hanno il triangolino `▶` in rosso
- [ ] La slide finale NON ha frecce ma ha CTA
- [ ] Il testo non supera 8 righe per slide
- [ ] Il padding è minimo 60px su tutti i lati
- [ ] Il font è Montserrat in tutti i weight corretti
- [ ] Gli sfondi sono `bg-dark` o `bg-warm`, mai bianco puro
- [ ] Le immagini hanno border-radius 0 (spigoli vivi su ogni sfondo)
