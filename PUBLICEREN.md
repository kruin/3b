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

- kloont bij een ontbrekende `.git` eerst `kruin/3b` naar een tijdelijke map
  en herstelt alleen de Git-geschiedenis; de actuele releasebestanden blijven staan;
- weigert een andere remote dan `kruin/3b`;
- controleert alle releasebestanden vóór commit en push;
- vergelijkt lokale commit en `origin/main`;
- wacht maximaal tien minuten op GitHub Pages;
- meldt pas KLAAR als Main werkelijk `app-v67.js`, `config-v67.js`,
  `styles.css?v=67` en versie 67 levert én Doc bereikbaar is.

`Kruin.bat` is de enige lokale beheeringang. De BAT opent een geldige
`file:///.../index.html#owner=kruin`-URL; voeg het fragment niet handmatig aan
een Windows-bestandspad toe. Publiceer een gedownloade
KruinLines-JSON pas nadat de waarden gecontroleerd en bewust in de openbare
startconfiguratie opgenomen zijn. GitHub Pages kan lokale Freezes niet zelf
naar de repository terugschrijven.

In Instellingen meldt de lokale eigenaarsmodus of er Freezes bestaan die
nieuwer zijn dan de in die appversie meegeleverde publicatie. De BAT vergelijkt
daarna de lokale Git-commit met `origin/main` en controleert afzonderlijk of
GitHub Pages precies dezelfde release-assets serveert.

Controleer aanvullend `https://kruin.github.io/3b/controle-v67.html` en
`https://kruin.github.io/3b/doc/`.

## Mobiele Uitlegeditor

Open op mobiel `https://kruin.github.io/3b/#owner=kruin`, ga naar Instellingen
en kies **Mobiele Uitlegeditor**. Deze modus bewaart alleen lokaal en kan niet
naar GitHub schrijven. Download na het bewerken altijd de uitleg-JSON en neem
die bewust op in een volgende release.

## Belangrijk

On-screen invoer staat alleen in de lokale browser. Publiceren verandert die
invoer niet en stuurt deze niet naar GitHub. Maak via **My tables/Mijn tafels**
een JSON-reservekop om configuraties tussen apparaten over te brengen.

De app is volledig statisch (HTML, CSS en JavaScript) en GitHub Pages-compatibel.
