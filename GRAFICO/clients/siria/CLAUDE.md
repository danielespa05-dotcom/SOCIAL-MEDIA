# SIRIA AUTORICAMBI — Brand book & design system

> **Sistema generale:** vedi `GRAFICO/CLAUDE.md` per struttura multi-cliente, script, workflow.
> Questo file copre **solo** il brand Siria Autoricambi.
>
> **Versione 2 — aggiornata sui reference visivi reali** (vedi `clients/siria/brand/references/`). La precedente conteneva regole "ereditate" dal template Comnia non valide per Siria — questa le supera.

## Cliente

**Siria Autoricambi** (S.I.RI.A. S.R.L. — Società Ingrosso Ricambi ed Autoaccessori). Grossista indipendente di ricambi e accessori auto. B2B. Sede a Saonara (PD). Fondata nel 1996 — **30 anni nel 2026** (leva narrativa centrale).

Catalogo: 70.000 articoli in 500 categorie. Portale proprietario (non TecDoc) — unico in Italia con dati propri.

**Sito:** www.siriapd.it
**Instagram:** [@siriaautoricambipadova](https://instagram.com/siriaautoricambipadova)
**Contatti:** +39 049 879 2186 · servizio.clienti@siriapd.it
**Referente operativa/grafica:** Rosita
**Supervisione finale:** Tiziano Greggio (GM/founder)

### Posizionamento

Ricambista **consulenziale, indipendente, con dati propri**. Non compete sul prezzo. Compete su expertise, copertura del catalogo, continuità (30 anni in un settore dove i grossisti chiudono in 5).

### Tono di voce (per scelte visive)

Diretto, competente, appassionato, mai arrogante. *"Come Tiziano al banco con un cliente fidato."*
Tradotto in scelte visive: **niente fronzoli**, niente "pubblicità anni 2010", niente foto stock generiche. Preferire **autenticità** (magazzino vero, persone vere, prodotti reali).

---

## Path di lavoro

- Brand: `clients/siria/brand/`
- **Reference visivi:** `clients/siria/brand/references/` — caroselli/post Siria pubblicati. **Consultare prima di produrre.** Sono la fonte di verità del brand reale.
- Asset: `clients/siria/brand/assets/`
  - `logo.png` — marchio completo (lettering SIRIA + S-strada). Raster.
  - `marchio_30anni_badge.svg` — simbolo "30°" anniversario (volante stilizzato). Vettoriale.
  - `marchio_30anni_lockup_con_tagline.svg` — 30° + tagline "Da 30 anni facciamo strada insieme."
- Template: `clients/siria/templates/`
- Sorgente slide: `clients/siria/output/<nome-contenuto>/`
- Export **PNG**/MP4: `clients/siria/export/<nome-contenuto>/` — per Siria il default è PNG @2x (un file per slide, 2160×2700px ottenuto da viewport 1080×1350 con `deviceScaleFactor: 2`). Le slide con `<video>` restano MP4. La regola è codificata in `brand-profile.json` (`export.format: "png"`) e applicata automaticamente da `scripts/export.js`. L'upload su Canva passa da `scripts/canva-png-upload.js` (vedi sezione dedicata sotto) che rigenera i PNG internamente.
- Preview IG: `clients/siria/preview/<nome-contenuto>.html`

Comandi:
```bash
node scripts/preview.js          <nome-contenuto> --client=siria
node scripts/export.js           <nome-contenuto> --client=siria
node scripts/canva-png-upload.js <nome-contenuto> --client=siria
```

---

## Design System SIRIA

### Palette colori (HEX ufficiali confermati)

| ID | Hex | Ruolo |
|---|---|---|
| `blu-siria` | `#162983` | Colore primario brand |
| `arancio-siria` | `#F09305` | Colore secondario brand (paritetico al blu) |
| `white` | `#FFFFFF` | Sfondo chiaro, testo su scuro |
| `text-dark` | `#1A1A1A` | Body text su sfondo chiaro |
| `text-muted` | `#6B6B6B` | Caption, footer, attribution |

**Sistema cromatico:** blu e arancio sono **paritetici**. Entrambi sono colori-fondo e colori-testo. Il bianco è il terzo fondo neutro. Niente quarto colore, niente grigi intermedi (#888, #AAA) — solo `text-dark` o `text-muted`.

### Sfondi consentiti (4 famiglie alternabili)

| Sfondo | Quando usarlo | Esempi reference |
|---|---|---|
| **`arancio-siria` pieno** | Slide narrative, manifesti, storytelling 30 anni, claim ad alto impatto | "CINQUE FILTRI" arancio, "1996 UN MAGAZZINO", "L'idea è semplice" |
| **`blu-siria` pieno** | Slide narrative, quote impatto, brand identity, claim asciutti | "UN ORDINE NON È SOLO UN PACCO", "EMOZIONE INDIPENDENZA", "SIRIA AUTORICAMBI" |
| **`white` pieno** | Slide ritratto-team, chiusure pulite, slide tipografiche calme | "FABIO" ritratto, "SE VUOI UN RICAMBIO PRECISO" chiusura, "+70.000 ARTICOLI" |
| **Paper texture** (carta stropicciata) | **Variante libera** di bianco o blu — dà calore e differenzia dalle tinte piatte. Intercambiabile, non vincolata a un tipo di contenuto. | "NORMATIVA EURO 7" (paper blu), "Filtri antiparticolato" (paper bianco), "VALE LA PENA" (paper bianco) |

**Regole sfondi:**
- Si **alternano liberamente** dentro lo stesso carosello — non c'è un default fisso né un pattern obbligatorio.
- Niente gradients. Tinta piatta o paper texture.
- Niente sfondi grigi, beige, neri.
- Blu come fondo NON è eccezionale — è uno dei due fondi primari, paritetico all'arancio.

### Tipografia

Due font, entrambi su **Google Fonts**:
- **Anton** — display per **titoli, sottotitoli e numeri grandi**. Peso unico 400.
- **Carlito** — body text. Pesi 400 e 700, italics disponibili.

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap');
```

| Livello | Famiglia | Weight | Size (canvas 1080) | Case | Uso |
|---|---|---|---|---|---|
| Title-display | Anton | 400 | 120-180px | uppercase | Titoli cover, parole-chiave stacked |
| Title | Anton | 400 | 90-120px | uppercase | Titoli interni standard |
| Subheading | Anton | 400 | 60-80px | uppercase | Sotto-titoli (NB: Anton, **non** Carlito) |
| Eyebrow | Carlito | 700 | 26-32px | uppercase | Occhiello opzionale sopra il titolo (es. "LA FAMIGERATA") |
| Body | Carlito | 400 | 32-44px | sentence | Body text principale |
| Body bold | Carlito | 700 | 32-44px | sentence | Keyword inline (nero o arancio) |
| Body emotive | Carlito | 700 italic | 32-44px | sentence | Frasi emotive, citazioni inline |
| Caption | Carlito | 400 | 22-26px | sentence | siriapd.it, telefono, footer |
| Numerone | Anton | 400 | 200-280px | uppercase | Numeri grandi espressivi (1996, 2026, 70.000, 30) |

**Regole tipografiche:**
- Anton: solo uppercase, peso unico 400.
- Anton è ammesso anche per i **sottotitoli** (in passato si pensava Carlito → correzione).
- Carlito: 400 normale, 700 per keyword/bold/emotive (può essere italic).
- Interlinea body: `1.4`. Titoli Anton: `1.0-1.05`.
- Numeri grandi (1996, 2026, 30, 70.000) → Anton uppercase, possono mescolare colori (arancio+blu) o avere outline.

### Colore-testo nei titoli — DOPPIO TONO ALTERNATO

Pattern centrale del brand. Le parole del titolo si alternano cromaticamente:

- **Su sfondo arancio:** parole alternate **blu + bianco**. Es. *"L'idea è semplice:* (blu) *un salto nel nuovo mercato"* (bianco). Crea ritmo "barrato".
- **Su sfondo blu:** parole alternate **arancio + bianco**. Es. *"EMOZIONE"* (arancio) *"INDIPENDENZA"* (bianco) *"COLLABORAZIONE"* (arancio).
- **Su sfondo bianco:** parole alternate **blu + arancio**. Es. *"SE VUOI UN"* (blu) *"RICAMBIO PRECISO,"* (arancio) *"SAI DOVE"* (blu) *"TROVARCI."* (arancio).

L'arancio nei titoli **non è solo highlight di keyword** — è uno dei **due colori co-protagonisti** del titolo.

### Colore-testo nei body

- **Keyword inline:** bold nero (`text-dark`) **oppure** bold arancio (`arancio-siria`). Entrambi validi a seconda del contesto. (Nei reference si vede sia `**zero margine per gli errori**` bold nero, sia `**Filtri antiparticolato**` bold arancio.)
- **Body emotive/citazioni:** Carlito 700 italic, su colore brand (blu o arancio) in base al fondo.
- **Body principale:** Carlito 400 in `text-dark` (su sfondi bianchi/paper bianco) o `white` (su sfondi blu/arancio).

### Logo — posizione e versioni

**Posizione standard:** **top-center** in tutte le slide. Mai top-right o top-left. Dimensione tipica 200-280px largo.

**Versioni e utilizzo:**

| Versione | File | Quando |
|---|---|---|
| **Marchio completo** (lettering SIRIA + S-strada + footer URL) | `logo.png` | **Fallback temporaneo** finché non arriva il lettering puro. In nuove slide preferire l'asset lettering quando disponibile. |
| **Lettering puro SIRIA** (5 lettere stilizzate, no S-strada) | ⚠️ DA RICHIEDERE A ROSITA | **Standard per tutte le slide social**. È quello che compare in cima a tutti i caroselli reali. Servono 2 varianti: blu+arancio (per sfondi bianchi/paper bianco) e bianco+blu (per sfondi arancio/blu/paper blu). |
| **Lockup "SIRIA + AUTORICAMBI"** (lettering + scritta AUTORICAMBI arancio sotto, su cornice blu) | `lockup_siria_autoricambi.png` | **Esclusivamente per Layout F — Manifesto Valori / Brand identity**. Funziona su slide con sfondo blu (la cornice del PNG si fonde col fondo). |
| **Badge 30° anniversario** | `marchio_30anni_badge.svg` | **Slide di chiusura** standard 2026 + slide narrative della serie 30 anni. |

**Dot della "I" e "A" del lettering:** arancio su lettering blu, blu su lettering bianco. Mai pieni o sostituiti.

---

## Elementi grafici ricorrenti

### Badge 30 anni (anniversario 2026)

- File: `marchio_30anni_badge.svg`
- Sempre nel piede della slide di **chiusura** + slide narrative serie 30 anni.
- Su sfondi chiari: arancio outline. Su sfondi scuri: bianco outline.
- Dimensione tipica: 200-280px largo.

### Frecce line — indicatori di lettura/swipe

- **Solo frecce stilizzate sottili** (`→`, tratto fine 4-6px, punta aperta), allineate generalmente in basso a destra o accanto al body come elementi decorativi.
- Colore: bianco su arancio/blu, arancio su bianco/paper.
- **Mai** triangoli pieni `▶`, mai page numbers tipo "02/04", mai chevron `›` come bullet.

### Box "timbro" arancio

- Rettangolo arancio compatto con parola-chiave in **blu** Anton uppercase (es. "NORMATIVA", "VALE LA PENA", "LO FACCIAMO OGNI GIORNO").
- **Dritto** o **leggermente inclinato** (−2°/+2°), effetto timbro/cartellino.
- Altezza tipica: 90-130px. Padding 30-40px H, 20-30px V.
- Radius: 4-8px.
- Cuore visivo del **Layout B**, ricorre anche come decorativo in altri layout (es. Layout E variante "LO FACCIAMO OGNI GIORNO").

### Stacked overlap typography

- Pattern visivo firma di Siria: **titolo arancio enorme "dietro"** + **titolo bianco/blu più piccolo "davanti"** che si sovrappone parzialmente al titolo arancio.
- Esempio: "CINQUE FILTRI" → *"CINQUE"* arancio gigante + *"UNO SOLO VIENE CAMBIATO REGOLARMENTE"* bianco/blu sovrapposto al "C" + *"FILTRI"* arancio gigante sotto.
- Crea profondità visiva e doppia gerarchia di lettura.
- Cuore visivo del **Layout A**.

### Product photos cutout integrate

- Foto prodotti scontornate (sfondo trasparente), inserite come **elementi decorativi sparsi**, non come "foto-cover".
- Esempi: forklift, telefono fisso, catalogo, pacco di cartone, filtri, candele, cinghia.
- Sovrapposte al testo con leggera ombra per profondità.
- Foto reali del catalogo Siria — mai stock generico.

### Eyebrow uppercase (opzionale)

- Piccolo testo maiuscolo (Carlito 700, 26-32px) sopra un titolo, come occhiello/categoria.
- Esempi: "LA FAMIGERATA" (Layout D), "SPECIAL OFFER" (Layout G).
- Colore: bianco su sfondi colorati, blu su sfondi chiari.
- **Opzionale**, usato in Layout D (cover prodotto) e Layout G (promo).

---

## Layout codificati

Sei layout standard (A-F) + uno facoltativo (G) per promozioni. Per produrre una slide:

1. Identifica pillar/tipo di contenuto
2. Scegli il layout corrispondente (vedi tabella in "Pillar content" sotto)
3. **Consulta 1-2 reference** in `clients/siria/brand/references/`
4. Applica le regole del layout

### Layout A — Stacked headline con overlay (storytelling)

**Quando usarlo:** storytelling 30 anni, claim ad alto impatto, narrative tipografiche, slide manifesto.

**Sfondo:** arancio pieno, blu pieno o bianco/paper.

**Struttura:**
- Logo lettering top-center
- **Titolo grande Anton** uppercase 120-180px a tutta larghezza
- **Parole-chiave arancio "dietro"** che attraversano il canvas
- **Parole-chiave bianche/blu "davanti"** sovrapposte parzialmente alle prime (stacked overlap)
- Eventuali **product photos cutout** integrate nei "buchi" del testo
- Eventuale **post-scriptum** Carlito piccolo in fondo
- Eventuale **freccia line** bottom-right
- **Badge 30°** bottom-center per slide serie anniversario

**Esempi reference:**
- `Carosello 30:04/` (tutte le slide tranne la 5)
- "CINQUE FILTRI" (3 varianti colore)
- "1996 UN MAGAZZINO, UN CATALOGO, UN TELEFONO"
- "2026 +70.000 RICAMBI ORDINI DIGITALI"
- "UN ORDINE NON È SOLO UN PACCO CHE PARTE"

### Layout B — Box "timbro" + titolo grande

**Quando usarlo:** news/aggiornamenti settore, normative, claim verticali, etichette tematiche.

**Sfondo:** paper texture bianca o blu (preferito), oppure tinta piatta bianco.

**Struttura:**
- Logo lettering top-center o top-right
- **Box "timbro" arancio** con parola-chiave (dritto o leggermente inclinato)
- **Titolo grande blu** Anton uppercase 120-180px sotto al box (1-3 righe)
- Eventuale **body Carlito** corto (max 2-3 righe)
- **Freccia line** orizzontale arancio
- siriapd.it footer

**Esempi reference:**
- "NORMATIVA EURO 7"
- "VALE LA PENA ESSERE AGGIORNATI"
- "+70.000 ARTICOLI UNO PER OGNI ESIGENZA"

### Layout C — Body text con keyword colorate

**Quando usarlo:** spiegazioni tecniche, slide di approfondimento, citazioni narrative.

**Sfondo:** paper texture bianca o blu.

**Struttura:**
- Logo lettering top-center o top-right
- **Body text grande** Carlito 36-44px, 5-8 righe divise in paragrafi
- **Keyword inline** in arancio bold (o bold nero)
- **Frecce line decorative** ai lati del paragrafo per ritmare
- **Badge 30°** bottom-center se slide serie 30 anni
- siriapd.it footer opzionale

**Esempi reference:**
- "Filtri antiparticolato obbligatori anche per i motori a benzina…"
- "Mentre il mercato cambiava, Tiziano apre Siria Autoricambi…"
- "Dietro c'è una chiamata, una ricerca nel sistema…"
- "OGGI: 70.000 ARTICOLI 500 CATEGORIE…"

### Layout D — Cover prodotto con foto cutout

**Quando usarlo:** cover di apertura caroselli prodotto/tecnici, rubrica "Lo Sapevi?", introduzione contenuto specifico.

**Sfondo:** arancio pieno (parte alta) + arancio pieno (parte bassa lasciata vuota per overlay/copy successivo).

**Struttura:**
- Logo lettering top-center (opzionale in questo layout)
- **Eyebrow** Carlito 700 uppercase bianco ("LA FAMIGERATA")
- **Titolo grande Anton** uppercase bianco
- **Sotto-titolo in box blu** rettangolare
- **Foto prodotto cutout** (motore, candela, freno, filtro…) a destra/centro
- Parte bassa vuota per intro narrativa successiva

**Esempi reference:**
- "LA FAMIGERATA CINGHIA A BAGNO D'OLIO"

### Layout E — Chiusura standard 30°

**Quando usarlo:** **ultima slide di ogni carosello 2026** (firma 30 anni).

**Sfondo:** bianco pieno.

**Struttura:**
- Logo lettering top-center (versione blu+arancio)
- **Titolo grande Anton** uppercase con parole alternate **blu + arancio**
- **siriapd.it** sotto in Carlito 400
- **Badge 30°** centrato in basso, arancio outline

**Varianti di copy approvate (ne ruotano 2-3 per evitare ripetitività):**
1. *"SE VUOI UN RICAMBIO PRECISO, SAI DOVE TROVARCI."* — standard
2. *"LO FACCIAMO OGNI GIORNO SU 70.000 REFERENZE DIVERSE. SE VUOI UN RICAMBIO PRECISO, SENZA SORPRESE, SAI DOVE TROVARCI."* — con box "timbro" inclinato sopra
3. *"+70.000 ARTICOLI UNO PER OGNI ESIGENZA."* — variante più descrittiva

**Esempi reference:**
- "SE VUOI UN RICAMBIO PRECISO" (×3 caroselli)
- "LO FACCIAMO OGNI GIORNO SU 70.000 REFERENZE DIVERSE"

### Layout F — Manifesto valori / Brand identity

**Quando usarlo:** slide manifesto, dichiarazione di valori, "chi siamo", brand identity card.

**Sfondo:** blu pieno (preferito) o arancio pieno.

**Struttura:**
- **Lockup "SIRIA + AUTORICAMBI"** grande top-center (versione con AUTORICAMBI arancio sotto)
- **Lista di parole-valore** Anton uppercase impilate verticalmente, alternate cromaticamente (arancio/bianco su blu; blu/bianco su arancio)
- Eventuale **tagline** Carlito sotto (es. *"Siria Autoricambi. Dal 1996."*)
- **siriapd.it** footer
- **Badge 30°** bottom

**Esempi reference:**
- "SIRIA AUTORICAMBI Indipendenti dal 1996"
- "EMOZIONE INDIPENDENZA COLLABORAZIONE"

### Layout G — Promo "Flash" (facoltativo, fase 2)

**⚠️ Cautela d'uso:** in **fase 1** (oggi) Siria fa info, non offerte. Attivare solo quando Tiziano dà OK su una campagna promozionale specifica (offerta WhatsApp VIP, sconto categoria, lancio nuova linea).

**Sfondo:** blu pieno o arancio pieno (alternabili tra slide come nei reference Flash Sale).

**Struttura:**
- **Eyebrow piccolo** top-left con freccia line (es. "OFFERTA RISERVATA →")
- **Titolo gigante** Anton uppercase a tutto canvas
- **Foto prodotto cutout** integrata nel titolo (sovrapposta)
- **Body Carlito** sotto ("Sconto fino al X%")
- **Bottone pill CTA** — opposto cromatico al fondo (bianco su blu, blu su arancio)
- **Footer info** Carlito caption (sito + telefono o location)

**Mai usare per slide-prodotto generiche** — solo per promozioni vere e limitate. Layout esterno di ispirazione, non Siria-nativo.

---

## Regole visive trasversali (per tutti i layout)

- **Niente stock photo generiche.** Solo foto reali (magazzino, team, prodotti).
- **Niente toni "premium" / "luxury".** Siria è B2B, tecnico, autentico.
- **Niente gradients.** Tinta piatta o paper texture.
- **Spigoli leggermente arrotondati:** `8px` default su box/bubble, `12px` su immagini, `pill` solo Layout G.
- **Densità informativa moderata.** Variabile per layout (vedi singole regole), ma in generale max 6-8 righe/slide.
- **Mai claim vuoti a tutto schermo** (es. "ECCELLENZA NEL RICAMBIO").
- **Mai grigi intermedi** (#888, #AAA).
- **Foto persone reali** del team (Tiziano, Rosita, Fabio, Alessandra, Anna, Christian, Gabriele) ammesse e desiderate. Persone con abbigliamento brand (gilet arancio Siria) → integrazione cromatica naturale.

---

## CSS Base SIRIA (da includere in ogni file HTML)

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap');

:root {
  --blu-siria: #162983;
  --arancio-siria: #F09305;
  --white: #FFFFFF;
  --text-dark: #1A1A1A;
  --text-muted: #6B6B6B;
  --radius: 8px;
  --radius-img: 12px;
  --radius-pill: 9999px;  /* Solo Layout G */
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Carlito', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.slide {
  width: 1080px;
  height: 1350px;
  position: relative;
  overflow: hidden;
  padding: 80px 70px;
}

.slide--story { width: 1080px; height: 1920px; }

/* Sfondi alternabili */
.slide--orange { background-color: var(--arancio-siria); color: var(--white); }
.slide--blue { background-color: var(--blu-siria); color: var(--white); }
.slide--white { background-color: var(--white); color: var(--text-dark); }
.slide--paper-light { background-color: #FAFAF7; color: var(--text-dark); }  /* texture opzionale via PNG */
.slide--paper-blue { background-color: var(--blu-siria); color: var(--white); }  /* texture opzionale via PNG */

/* Logo top-center */
.logo {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: auto;
}

/* Tipografia */
.title-display {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 150px;
  line-height: 1.0;
}

.title {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 100px;
  line-height: 1.05;
}

.subheading {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 70px;
  line-height: 1.05;
}

.eyebrow {
  font-family: 'Carlito', sans-serif;
  font-weight: 700;
  font-size: 28px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.body-text {
  font-family: 'Carlito', sans-serif;
  font-weight: 400;
  font-size: 38px;
  line-height: 1.4;
}

.keyword-orange { color: var(--arancio-siria); font-weight: 700; }
.keyword-blue { color: var(--blu-siria); font-weight: 700; }
.keyword-white { color: var(--white); font-weight: 700; }
.keyword-bold { font-weight: 700; }
.emotive { font-weight: 700; font-style: italic; }

.numerone {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 240px;
  line-height: 0.9;
}

.caption {
  font-family: 'Carlito', sans-serif;
  font-weight: 400;
  font-size: 24px;
  color: var(--text-muted);
}

/* Box "timbro" arancio (Layout B) */
.tag-stamp {
  display: inline-block;
  background-color: var(--arancio-siria);
  color: var(--blu-siria);
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 64px;
  padding: 16px 32px;
  border-radius: var(--radius);
}

.tag-stamp--tilted { transform: rotate(-2deg); }
.tag-stamp--blue { background-color: var(--blu-siria); color: var(--white); }

/* Stacked overlap (Layout A) */
.stacked-bg {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  color: var(--arancio-siria);
  font-size: 180px;
  line-height: 1.0;
  position: relative;
  z-index: 1;
}

.stacked-fg {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 90px;
  line-height: 1.0;
  position: absolute;
  z-index: 2;
}

.stacked-fg--white { color: var(--white); }
.stacked-fg--blue { color: var(--blu-siria); }

/* Frecce line (no triangoli pieni) */
.arrow-line {
  font-family: 'Carlito', sans-serif;
  font-weight: 400;
  font-size: 56px;
  color: var(--arancio-siria);
}
.arrow-line--white { color: var(--white); }
.arrow-line--blue { color: var(--blu-siria); }

/* Badge 30 anni */
.badge-30 {
  width: 280px;
  height: auto;
  /* SVG: ../../brand/assets/marchio_30anni_badge.svg */
}

/* CTA pill (solo Layout G) */
.cta-pill {
  display: inline-block;
  padding: 24px 56px;
  border-radius: var(--radius-pill);
  font-family: 'Carlito', sans-serif;
  font-weight: 700;
  font-size: 32px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.cta-pill--white-on-blue { background-color: var(--white); color: var(--blu-siria); }
.cta-pill--blue-on-orange { background-color: var(--blu-siria); color: var(--white); }
```

> **Spigoli:** leggermente arrotondati (`8px` box/bubble, `12px` immagini contenitori, `pill` solo Layout G).

---

## Upload su Canva (Opzione C — pixel-perfect raster)

Workflow definitivo confermato 2026-05-14 dal cliente. Le slide HTML diventano immagini raster non-editabili dentro un design Canva multi-pagina nella cartella `SIRIA Autoricambi`.

**Trigger esplicito** — Solo quando Daniele dice "manda su Canva" / "carica su Canva" (mai automatico).

**Comando:**
```bash
npm run canva-png-upload -- <nome-contenuto> --client=siria
# oppure: --skip-export se i PNG sono già in export/<nome-contenuto>/
```

**Cosa fa lo script** (`scripts/canva-png-upload.js`):
1. Genera PNG @2x (2160×2700) da ogni `output/<nome-contenuto>/slide-XX.html` via Puppeteer
2. Salva i PNG in `export/<nome-contenuto>/slide-XX.png`
3. Wrappa tutti i PNG in un singolo PDF multi-pagina **raster** via pdf-lib (ogni pagina = una immagine PNG, niente testo vettoriale)
4. Espone il PDF via cloudflared quick tunnel
5. Stampa `PUBLIC_URL=https://....trycloudflare.com/<nome-contenuto>.pdf`
6. Mantiene server + tunnel attivi per il keepalive (default 180s) poi auto-cleanup

**Dopo lo script:**
1. Leggere `PUBLIC_URL` dallo stdout
2. Chiamare `mcp__claude_ai_Canva__import-design-from-url` con quell'URL + nome `"PED <Mese italiano> <GG> SIRIA"` (es. `PED Maggio 14 SIRIA`)
3. Chiamare `mcp__claude_ai_Canva__move-item-to-folder` con `item_id` = design ID restituito da import, `to_folder_id` = `FAHDd3nDfFo` (cartella `SIRIA Autoricambi`)
4. Se compaiono più caroselli Siria nello stesso giorno, chiedere a Daniele il suffisso (`— v2`, `— quote A`, ecc.)

**Why Opzione C raster e non PDF vettoriale (vecchio `canva-upload.js`):**
- L'import PDF vettoriale di Canva tenta di estrarre testo come layer editabili, ma con i CSS Siria (font Anton/Carlito sostituiti, spans inline multi-colore, filtri CSS sul logo) genera bug noti: logo placeholder vuoto, parole concatenate senza spazio, font shift.
- Con PNG → PDF raster, Canva importa ogni pagina come immagine. Niente estrazione testo, niente bug. Fedeltà 100% rispetto all'HTML renderizzato dal browser. Trade-off: nessun layer editabile in Canva, le modifiche si fanno in HTML e si ri-uploada.

**Limiti operativi:**
- **Cloudflare quick tunnel può tardare 5-10 secondi** a propagarsi. Se la prima chiamata a `import-design-from-url` torna `"Failed to download the file from given URL"`, verificare con `curl -I <URL>` (atteso `200`) e riprovare l'import senza rilanciare lo script.
- L'URL è pubblico per la durata del keepalive: chiunque lo conosca può scaricarlo. Non condividerlo.

**Cartelle Canva da NON toccare** (anche se hanno "Siria" nel nome):
- `SIRIA-COMNIA file approvazione` (ID `FAHD2GVAxaM`) — mista, ignorare.

**Cosa NON usare per Siria:**
- ❌ `canva-upload.js` (PDF vettoriale → testo editabile) — produce i bug visti sul carosello presa 16A v1.
- ❌ `generate-design` / `generate-design-structured` (AI nativo Canva) — scartato perché non rispetta il design system.

---

## Frequenza pubblicazione

- **Facebook + Instagram:** 2 post/settimana (stesso contenuto adattato ai due formati)
- **LinkedIn:** 1-2 post/settimana (solo visione/settore, no promozioni)
- **Story IG:** contenuti rapidi e richiami Membership, frequenza libera

---

## Pillar content (calendario social)

| Pillar | Frequenza | % piano |
|--------|-----------|---------|
| **Scopri il catalogo** | 3/mese | 35% |
| **Dietro al banco** | 2/mese | 25% |
| **30 Anni di Siria** | 1/mese | 12% |
| **Il servizio che non ti aspetti** | 1/mese | 12% |
| **Il settore che cambia** | 1/mese | 16% |

### Rubriche ricorrenti

- **"Lo Sapevi?"** — carosello 3-4 slide su una categoria nascosta del catalogo.
- **"Dal Magazzino"** — foto autentica + caption breve (no produzione professionale, no stock).
- **"Chiedilo a Tiziano"** — video 60-90 sec, smartphone, risposta a domanda reale.
- **"Il Pezzo Misterioso"** — quiz settimanale: foto ravvicinata + domanda.
- **"30 Anni. Stessa Passione."** — campagna anniversario (marzo-maggio 2026), 1 post/sett. per 12 settimane.

---

## Rotazione dei layout — REGOLA FONDAMENTALE

**Nessun pillar è vincolato a uno specifico layout.** I layout vanno **a rotazione** tra i post — l'obiettivo è evitare che caroselli successivi sembrino fatti dallo stesso stampino.

**Come applicare la rotazione:**

1. **Cover (slide 1):** scegliere tra **Layout A**, **B**, **D** o **F** (sono quelli con impatto visivo da "cover"). Variare la cover tra caroselli consecutivi — se l'ultimo era Layout D, il prossimo NON sia Layout D.
2. **Slide interne (slide 2 a N-1):** mixare liberamente **A, B, C, D, F** dentro lo stesso carosello, con la regola di **non ripetere lo stesso layout in slide consecutive**. Variare = ritmo visivo.
3. **Chiusura (ultima slide):** **sempre Layout E** (firma 2026). Questa è l'unica eccezione alla rotazione: è la signature del brand per tutto il 2026, ricorre identica (con le 2-3 varianti di copy approvate).
4. **Layout G** (promo): solo in fase 2, mai mescolato a contenuti info-narrativi normali.

**Esempio di rotazione su 4 caroselli consecutivi (pillar "Scopri il catalogo"):**

| # | Cover | Interne | Chiusura |
|---|---|---|---|
| 1 | D | C → B → C | E |
| 2 | A | C → D → A | E |
| 3 | B | C → A → C | E |
| 4 | D | A → B → C | E |

Stesso pillar, ma ogni carosello è visivamente diverso.

---

## Template: Story Instagram (1080x1920)

I layout sopra si adattano anche al canvas 1920 verticale:
- Sfondi: stessi 4 (arancio/blu/bianco/paper)
- Logo lettering top-center, più piccolo (160-180px largo)
- Titolo Anton 80-100px
- Body Carlito 28-32px
- Eventuale immagine grande centrata, 40-50% spazio verticale
- CTA in basso (testo Anton uppercase o badge 30°)

---

## Cose da sapere prima di produrre slide

1. **Mai citare competitor per nome** (in particolare Reda Ricambi).
2. **Mai comunicare verso la Sardegna** — quindi mai contenuti geo-targetizzati lì.
3. **Tiziano Greggio sempre in copia/supervisione** sulle uscite reali.
4. **Membership = servizio, mai promozione.** Se compare nelle slide, va trattato come elemento permanente del brand.
5. **Genuin Core / Gen Core:** linea ricambi rigenerati selezionati da Tiziano. **Marchio non ancora registrato** — non aggiungere ®, TM o claim di esclusività legale.
6. **30 anni nel 2026** = leva narrativa centrale. Quando ha senso, attivarla.
7. **Consultare reference** in `clients/siria/brand/references/` prima di produrre. Se il layout che stai progettando non corrisponde a nessuno dei 6 codificati (A-F) o al G facoltativo, fermati e chiedi conferma.

---

## Slide con video (carosello misto IG)

1. Mettere il video in `clients/siria/output/<nome-contenuto>/`
2. Nell'HTML: `<video src="./video.mp4" autoplay loop muted playsinline>` con `object-fit: cover` o `contain`
3. Elementi sopra il video: classe `.above-video`
4. `export.js` auto-rileva e produce MP4 1080×1350 in 3 layer

Casi d'uso video per Siria:
- Demo prodotti (soprattutto **illuminazione/fanaleria LED**)
- Time-lapse magazzino
- "Chiedilo a Tiziano" — risposta tecnica breve

---

## Setup checklist (asset disponibili / mancanti)

- [x] Palette colori — HEX ufficiali: `#162983` blu, `#F09305` arancio, `#FFFFFF` bianco
- [x] Tipografia (Anton + Carlito) — confermati da brand book Siria
- [x] Handle Instagram (`siriaautoricambipadova`)
- [x] Spigoli arrotondati
- [x] Sfondi: 4 famiglie alternabili
- [x] Logo posizione: top-center standard
- [x] `logo.png` — marchio completo (fallback temporaneo)
- [x] `marchio_30anni_badge.svg` — simbolo 30° anniversario
- [x] `marchio_30anni_lockup_con_tagline.svg`
- [x] Reference visivi in `brand/references/` (4 caroselli + multipli post reali)
- [x] 6 layout codificati + 1 facoltativo
- [x] **Lockup SIRIA + AUTORICAMBI** ricevuto come PNG su sfondo blu. Da salvare in `brand/assets/lockup_siria_autoricambi.png` (drag&drop da Finder). Funziona direttamente su slide Layout F con sfondo blu — la cornice blu del PNG si fonde col fondo della slide. Se in futuro servirà Layout F su sfondo arancio, ci servirà una variante con cornice arancio o trasparente.
- [ ] **Logo lettering puro** (5 lettere SIRIA su trasparente) → NON DISPONIBILE. Per ora si usa `logo.png` (marchio completo) come fallback temporaneo.
- [ ] **Paper texture PNG** (bianca + blu) → NON DISPONIBILE. Per simulare la texture si può usare un sottile rumore CSS (es. `background-image: url(...)` con SVG noise inline) oppure restare su tinte piatte.

---

## Workflow operativo

1. **Identifica pillar/rubrica** del contenuto
2. **Scegli i layout** del carosello (consulta tabella Pillar content)
3. **Consulta 1-2 reference** in `clients/siria/brand/references/` corrispondenti
4. Genera HTML in `clients/siria/output/<nome-contenuto>/`
5. `node scripts/preview.js <nome-contenuto> --client=siria` per il preview
6. Revisione Rosita → revisione/copia Tiziano
7. `node scripts/export.js <nome-contenuto> --client=siria` per l'export finale (per Siria genera automaticamente **PNG @2x per slide** + MP4 per slide video — vedi `brand-profile.json` campo `export`). Step opzionale: `canva-png-upload.js` rigenera i PNG internamente, quindi può anche essere lanciato direttamente saltando l'export standalone.
8. Su richiesta esplicita di Daniele ("manda su Canva"): `npm run canva-png-upload -- <nome-contenuto> --client=siria` + chiamate MCP Canva (vedi sezione **Upload su Canva (Opzione C)** sopra).
