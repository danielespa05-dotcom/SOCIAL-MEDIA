# I file .md non li ha inventati Anthropic. E le macchine non li capiscono come pensiamo.

Il Markdown esiste dal 2004. Lo ha creato John Gruber (con Aaron Swartz) per una ragione banale: permettere ai giornalisti del web di scrivere HTML senza impazzire. Sintassi umana che diventava markup. Fine.

Per anni è rimasto roba da developer. GitHub lo ha reso popolare con i `README.md`. Poi è arrivata l'AI — e improvvisamente tutti parlano di file `.md` come se fossero una tecnologia nuova.

Non lo sono.

## Allora perché ne sentiamo parlare solo adesso?

Perché i sistemi AI (Claude, GPT, e gli altri) li usano per ricevere contesto strutturato: istruzioni di sistema, documentazione di progetto, regole di comportamento. Il CLAUDE.md, il system prompt, la "memoria" — tutto `.md`.

Ed è qui che il marketing ha fatto il suo lavoro: ha preso uno strumento vecchio e lo ha riposizionato come "il modo per parlare con l'AI".

## Ma attenzione a una cosa fondamentale.

Le macchine non parlano la nostra lingua. Non "leggono" un file Markdown come lo leggiamo noi. Vedono token. Sequenze di numeri. La struttura con i `#` e i `**grassetti**` non esiste per loro — esiste per noi, che scriviamo il prompt e vogliamo organizzare i pensieri.

Il Markdown è uno strumento umanistico spacciato per tecnologico.

## Ci sono modi più efficienti?

Sì. In termini puri di token e contesto:

- **XML tags** — Anthropic stessa li raccomanda per Claude. `<context>...</context>` è più preciso di una sezione in Markdown.
- **JSON/YAML** — per dati strutturati, zero ambiguità, meno rumore.
- **Tool use / function calling** — invece di spiegare all'AI cosa fare in linguaggio naturale, le dai uno schema. Lei chiama la funzione. Niente interpretazione.
- **Fine-tuning** — se un comportamento lo ripeti mille volte, lo insegni al modello una volta sola. Non lo scrivi in ogni prompt.

La gerarchia è: più sei vicino al formato nativo della macchina, meno token sprechi, meno margine di errore.

Il problema è che questi strumenti richiedono competenze tecniche. Quindi usiamo il Markdown — perché è leggibile, è umano, è accessibile.

**Gli umani sempre così umanocentrici.**

Costruiamo strumenti per le macchine ottimizzati per noi. Poi ci stupiamo quando le macchine non "ci capiscono" davvero.

---

**P.S.** Se stai leggendo questo come file `.md` in VS Code — premi `⌘ + Shift + V`. Vedrai esattamente la differenza tra come lo leggiamo noi e come lo vede la macchina.
