# Projectafspraken TAFEL

Dit document wordt bij iedere functionele of technische projectwijziging
bijgewerkt.

## Publicatiemodel

- Doelplatform: GitHub Pages (`github.io`).
- Repository: `https://github.com/kruin/drieband`.
- Publieke app: `https://kruin.github.io/drieband/`.
- De productie-app blijft statisch: HTML, CSS en client-side JavaScript.
- Iedere nieuwe specificatie wordt gecontroleerd op GitHub Pages-compatibiliteit.
- Functies die accounts, centrale opslag, automatische synchronisatie, geheime
  sleutels of serverberekeningen vereisen, worden niet stilzwijgend toegevoegd.
  Eerst wordt gemeld dat daarvoor een externe dienst nodig is.

## Configuratie en gegevens

- `config.js` is de openbare startconfiguratie.
- Gebruikersinvoer blijft lokaal in `localStorage` van apparaat en browser.
- Overdracht en reservekop verlopen via JSON-export en JSON-import.
- Klein en Groot hebben gescheiden configuraties.
- VIJF t/m TWAALF zijn afzonderlijk selecteerbaar.
- De neuslijn vertrekt standaard uit Z; overige lijnwaarden bestaan uit V en A.
- Bekende stipwaarden: west/oost 0–80 en noord/zuid 0–40.
- Bij spiegelen van neuslijn west naar oost spiegelen ook alle vier zichtbare
  nummeringsassen. Dezelfde stipwaarde blijft dezelfde waarde in het gekozen
  perspectief; west/oost wisselen als bandzijde.
- Stiplijnen liggen 9,5 cm buiten de bandrand.
- Baldiameter: 61,5 mm.

## Geldige huidige scope

- VIJF bevat de vastgelegde startwaarden.
- ZES t/m TWAALF zijn voorlopig leeg.
- Geen effect-, fysica- of ervaringscorrecties zolang daarvoor geen geldige
  gegevens zijn vastgelegd.
- Benamingen zijn: neus/neuslijn, kop/koplijn, nek/neklijn, romp/romplijn,
  kruis/kruislijn, linkerbeen/linkerbeenlijn en rechterbeen/rechterbeenlijn.

## Publicatiecontrole

Voor iedere release:

1. Startpagina opent zonder serverfout.
2. Klein en Groot zijn selecteerbaar en afzonderlijk opgeslagen.
3. Alle aangeboden patronen zijn selecteerbaar.
4. Wijzigen van V/A werkt de SVG direct bij.
5. JSON-export en -import werken.
6. SVG-export werkt.
7. Er zijn geen absolute lokale paden, localhost-verwijzingen of geheime
   gegevens opgenomen.
8. `index.html` staat in de hoofdmap van de publicatie-ZIP.

## Wijzigingslog

### 2026-09-12 — publicatiepakket v1

- GitHub Pages-publicatie-instructie toegevoegd.
- Afzonderlijke klantinstructie toegevoegd.
- Lokaal opslagmodel en overdracht tussen apparaten vastgelegd.
- Permanente GitHub Pages-compatibiliteitscontrole vastgelegd.

### 2026-09-13 — eerste Git-publicatie

- Repositorynaam gecorrigeerd en vastgelegd als `kruin/drieband`.
- `Publiceer_Drieband.bat` toegevoegd voor initialisatie, eerste commit en push.
- Vastgelegd dat de echte `index.html` wordt geplaatst; geen lege tussenpagina.
- BAT stopt veilig bij een afwijkende bestaande Git-remote.

### 2026-09-13 — gespiegelde nummeringen

- Nummeringen op alle vier stiplijnen zichtbaar gemaakt.
- Nummeringsrichting spiegelt mee met neuslijn west/oost.
- Spiegeltransformatie gebruikt dezelfde stipwaarden en wisselt west/oost.
- Versie-1-browserconfiguraties worden eenmalig naar het nieuwe assenmodel
  gemigreerd.
