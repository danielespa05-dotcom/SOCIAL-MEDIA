# SCRITTORE — Copy & contenuti testuali (multi-cliente)

## Cos'è questo progetto

Modulo testuale del progetto COPYWRITER. Qui vive il copy: post LinkedIn, caption Instagram, caroselli (file markdown), email, copy brand positioning. Output testuale, non grafico (per la grafica vedi `../GRAFICO/`).

Lo SCRITTORE è **condiviso tra più clienti**. Ogni cliente ha il suo brand book (tono di voce, leve psicologiche, regole formato) e i suoi output.

---

## Struttura

```
SCRITTORE/
├── CLAUDE.md                       # Questo file — guida di sistema
└── clients/
    ├── comnia/
    │   ├── CLAUDE.md               # Brand book Comnia (Andrea Comparin, tono, leve)
    │   ├── output/
    │   │   ├── instagram/          # Caroselli + caption IG
    │   │   └── linkedin/           # Post LinkedIn
    │   ├── caption_linkedin_markdown.txt   # Esempio formato caption
    │   ├── carosello_file_md.md           # Esempio formato carosello
    │   └── cover_markdown_demo.md         # Esempio formato cover
    └── siria/
        ├── CLAUDE.md
        └── output/
            ├── instagram/
            └── linkedin/
```

---

## Workflow generale

1. **Identifica il cliente** per cui si sta scrivendo
2. **Leggi `clients/<client>/CLAUDE.md`** per tono, regole, leve, esempi
3. **Scrivi il file** in `clients/<client>/output/<piattaforma>/<nome>.md`
4. **Iterazione**: l'utente corregge → le correzioni sono materiale di apprendimento, vanno integrate
5. **Test finale** del cliente (es. per Comnia: "Lo direbbe Andrea al bar?")

---

## Convenzioni nomenclatura output

- **Caroselli IG:** `clients/<client>/output/instagram/carosello_<topic>.md`
- **Post IG (caption):** `clients/<client>/output/instagram/post_<topic>.md`
- **Post LinkedIn:** `clients/<client>/output/linkedin/<topic>.md`

Per le **varianti** dello stesso contenuto: aggiungi `_v2`, `_v3` al nome (es. `post_neurodivergenza_compatibile_varianti.md`).

---

## Relazione con GRAFICO

Quando un copy diventa un carosello grafico:
- Il markdown del carosello vive qui in `SCRITTORE/clients/<client>/output/instagram/`
- Le slide HTML/PNG vivono in `GRAFICO/clients/<client>/output/<nome-contenuto>/`
- Il `nome-contenuto` nella cartella GRAFICO dovrebbe coincidere/corrispondere al file markdown qui

---

## Aggiungere un nuovo cliente

1. Crea `clients/<nuovo-cliente>/output/{instagram,linkedin}/`
2. Crea `clients/<nuovo-cliente>/CLAUDE.md` partendo dal template di un cliente esistente, sostituendo:
   - Nome cliente, founder, contesto azienda
   - Tono di voce (SÌ / NO)
   - Leve psicologiche
   - Regole formato (se diverse)
   - Esempi di hook e chiusure approvate

---

## Quando lavori a un copy

Prima di scrivere:
1. **Chiedi/conferma per quale cliente** stai scrivendo
2. **Leggi `clients/<client>/CLAUDE.md`** — ogni cliente ha tono, leve e regole diversi
3. Tutti i path di output devono essere sotto `clients/<client>/`

Non mischiare mai tono o regole di un cliente con un altro.
