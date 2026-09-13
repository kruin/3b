# Projectafspraken 3B

Dit document wordt bij iedere functionele of technische projectwijziging
bijgewerkt.

## Publicatiemodel

- Doelplatform: GitHub Pages (`github.io`).
- Repository: `https://github.com/kruin/3b`.
- Publieke app: `https://kruin.github.io/3b/`.
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
- Neus vertrekt standaard uit Z; overige delen bestaan uit V en A.
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
- Benamingen zijn: Neus, Kop, Nek, Romp, Kruis en Been.
- Engels is de standaardtaal; Nederlands is on-screen selecteerbaar.
- De weergave kan Groot, Klein of Beide tonen. Bij Beide kiest de gebruiker
  expliciet welke tafel in het invoerscherm wordt bewerkt.
- De vertrekkeuze is Neus of Verkorte 4-bander. In de verkorte weergave
  verdwijnt Neus en wordt Kop het eerste deel op basis van zijn eigen V en A.
- Beide speelvlakken hebben dezelfde beeldmaat. De fysieke tafelmaten en vaste
  stiplijnafstand van 9,5 cm bepalen wel hun eigen geometrie.

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
9. Iedere release heeft een hoger nummer in `VERSIE.txt`, de configuratie en de
   bestandsnamen van de JavaScript-assets, zodat GitHub Pages geen ouder script
   met dezelfde URL uit de CDN-cache kan blijven leveren.

## Wijzigingslog

### 2026-09-13 — 3B versie 9

- Project- en publicatienaam gewijzigd van `drieband` naar `3b`.
- Tweetalige interface toegevoegd, met Engels als standaard.
- Groot/Klein/Beide, West/Oost en vertrekkeuze on-screen configureerbaar.
- Twee benen samengevoegd tot Been; het achtervoegsel “lijn” verwijderd.
- Mijn tafels/My tables vervangt Config als JSON-download.
- Nieuwe geïsoleerde browseropslag voorkomt invloed van oudere releases.
- Publicatiecontrole wacht maximaal tien minuten en keurt uitsluitend v9 goed.

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

### 2026-09-13 — publicatiecontrole versie 4

- Zichtbaar appversienummer toegevoegd.
- `VERSIE.txt` als ondubbelzinnige release-identificatie toegevoegd.
- Cachebrekende versienummers aan `config.js` en `app.js` toegevoegd.
- Publicatie-BAT uitgebreid met map-, Git-root-, versie- en commitcontrole.

### 2026-09-13 — redesign spiegeling en publicatie versie 5

- Eén canonieke westconfig ingevoerd; wisselen van view muteert nooit meer de
  opgeslagen lijnconfiguratie.
- Oost wordt uitsluitend tijdens weergave exact horizontaal gespiegeld.
- In de oost-view tonen en bewerken bandkeuzes de gespiegelde bandnaam, terwijl
  intern de canonieke westconfig behouden blijft.
- Alle vier nummeringsassen gebruiken dezelfde viewtransformatie.
- Configuraties uit opslagversie 1 en 2 worden naar canoniek west gemigreerd.
- Scripts hebben nu onveranderlijke releasenamen: `config-v5.js` en `app-v5.js`.
- Zelfstandige `controle-v5.html` toegevoegd om de online release onafhankelijk
  van lokale opslag en de hoofdapp te controleren.

### 2026-09-13 — leesbare nummeringen versie 6

- Stipcirkels vergroot van 2,7 naar 3,6 SVG-eenheden.
- Nummeringen vergroot van 9 naar 13 SVG-eenheden en zwaarder gezet.
- Lichte contrastrand rond cijfers toegevoegd voor leesbaarheid op alle zijden.
- Meer afstand tussen nummering en stiplijn toegepast.
- Releasebestanden hernoemd naar `config-v6.js`, `app-v6.js` en
  `controle-v6.html`.

### 2026-09-13 — schone online opslag versie 7

- Vastgesteld via de gebruikersafbeelding dat GitHub Pages versie 6 laadde;
  grote nummeringen en de oosttitel waren zichtbaar.
- Verschil tussen schone lokale clone en online apparaten herleid tot de oude,
  gedeelde browseropslagsleutel van versies 1–6.
- Nieuwe blijvende opslagsleutel `drieband-canoniek-west-v1` ingevoerd.
- Oude online toestand wordt niet meer automatisch geladen of gemigreerd.
- JSON-import blijft beschikbaar voor een bewust gekozen reservekop.
- Releasebestanden hernoemd naar `config-v7.js`, `app-v7.js` en
  `controle-v7.html`.

### 2026-09-13 — geverifieerde publicatie versie 8

- BAT scheidt voortaan drie resultaten: lokale commit, remote `origin/main` en
  daadwerkelijk door GitHub Pages geleverde bestanden.
- `KLAAR` verschijnt uitsluitend wanneer online `VERSIE.txt` bij de lokale
  release past én online `index.html` de versie-8-scripts laadt.
- Online controle gebruikt de volledige commitcode als unieke queryparameter.
- De BAT wacht maximaal vier minuten op de asynchrone Pages-deployment.
- Bij een blijvend oude deployment verschijnt `PUBLICATIE NIET GESLAAGD` met
  concrete herstelstappen; een geslaagde push wordt niet als sitesucces gemeld.
- Releasebestanden hernoemd naar `config-v8.js`, `app-v8.js` en
  `controle-v8.html`.
