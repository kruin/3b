# 3B publiceren via GitHub Pages

Repository: `https://github.com/kruin/3b`  
Website: `https://kruin.github.io/3b/`

## Eerste inrichting

1. Hernoem of maak de repository `3b`.
2. Plaats de inhoud van dit pakket rechtstreeks in de hoofdmap; `index.html`
   moet dus in de root staan.
3. Start `Publiceer_3B.bat`.
4. Kies op GitHub bij **Settings → Pages**: **Deploy from a branch**,
   branch **main**, map **/(root)**.

## Iedere release

Vervang de bestanden in de lokale clone en start `Publiceer_3B.bat`. De BAT:

- weigert een andere remote dan `kruin/3b`;
- controleert alle versie-13-bestanden vóór commit en push;
- vergelijkt lokale commit en `origin/main`;
- wacht maximaal tien minuten op GitHub Pages;
- meldt pas KLAAR als de publieke site werkelijk `app-v13.js`,
  `config-v13.js` en versie 13 levert.

Controleer aanvullend `https://kruin.github.io/3b/controle-v13.html`.

## Belangrijk

On-screen invoer staat alleen in de lokale browser. Publiceren verandert die
invoer niet en stuurt deze niet naar GitHub. Maak via **My tables/Mijn tafels**
een JSON-reservekop om configuraties tussen apparaten over te brengen.

De app is volledig statisch (HTML, CSS en JavaScript) en GitHub Pages-compatibel.
