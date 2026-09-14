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

### 2026-09-13 — LKL, compacte bediening en Lijn 1 versie 14

- Terminologie gecorrigeerd: LKL is Patroon; VIJF enz. zijn Lijnen; Neus enz.
  zijn Delen.
- VIJF t/m ACHT zijn aan LKL gekoppeld.
- Bandvolgorde is vaste config en heeft geen on-screen keuzelijsten meer.
- Waardeknoppen rouleren zonder schermtoetsenbord binnen config-min/max.
- VIJF Nek-V heeft als eerste expliciete range 13–18.
- Buiten LKL-ranges wordt de status Vrij spel.
- Lijn 1 is de eerste afstootlijn en heeft sleepbediening plus stappen van 1 cm.

### 2026-09-13 — Parallelle lijnen en Waaier versie 15

- HALFZES is geen gewone tussennaam maar onderdeel van de Waaier.
- Bij de Waaier blijft het vertrekpunt Z vast en draait de richting van Lijn 1.
- `VIJF+1`, `ZES-1` enzovoort zijn zelfstandige lijnen die parallel lopen aan hun basislijn.
- Een parallelstap is één stip: `VIJF+1` verschuift van W 50 naar W 60 en van Z naar Z+1.
- De startpunten Z-4 t/m Z+4 liggen op de verticale middenlijn en zijn configureerbaar.
- Parallelverschuiving en Waaier mogen nooit door één rekenregel worden afgehandeld.

### 2026-09-13 — Configureren door bandballen te slepen versie 16

- Een bandbal is per definitie één gedeeld punt van twee delen.
- Voorbeeld: dezelfde bal is tegelijk `Kop A` en `Nek V`.
- Slepen gebeurt uitsluitend langs de betreffende band.
- De app rekent vanuit de nieuwe fysieke balpositie beide stiplijnwaarden terug.
- Beide waarden worden als één wijziging opgeslagen; de gebruiker hoeft ze niet apart in te voeren.
- De speelbal is geen gedeeld bandpunt en blijft de lengtebediening van Lijn 1.

### 2026-09-13 — Betrouwbaar slepen op mobiel versie 17

- De zichtbare bal krijgt een grotere onzichtbare raakzone; de balmaat zelf verandert niet.
- Een gestippelde halo geeft aan dat de bal sleepbaar is.
- Een aanraking buiten de raakzone blijft een normale schermbeweging.
- Vanaf pointer-down op de raakzone worden scrollen en tekstselectie tijdelijk geblokkeerd.
- Pointer-up en pointer-cancel beëindigen de blokkering altijd.
- De eerdere aanname dat Been vast op de tegenoverliggende lange band eindigt,
  is vervallen in versie 18.
- Desktop houdt de tafel sticky; mobiel toont de tafel vóór en tijdens de
  compacte invoer.

### 2026-09-13 — Eén Been over twee banden versie 18

- Been A is één doorlopende aankomstzone van midden Noord via de
  noordoosthoek naar midden Oost.
- In canonieke stipwaarden is dat Noord 20–40, gevolgd door Oost 0–80.
- De gespiegeld-oostweergave gebruikt Noord 20–0, gevolgd door West 0–80.
- Bij stappen of slepen wisselt de app bij de hoek automatisch van band.
- Eén Been vervangt hiermee functioneel de vroegere linker- en
  rechterbeenvarianten.

### 2026-09-13 — Klein VIJF voltooid versie 19

- Standaard Klein VIJF: Kruis V 36, A 10; Been V 5, A 70.
- Been A 70 is een geldige langebandwaarde en mag niet naar 40 worden geklemd.
- Alleen een bestaande lokale Klein-VIJF-staart met exact vier nulwaarden wordt
  eenmalig naar deze standaard gemigreerd; andere gebruikerswaarden blijven staan.

### 2026-09-13 — Mobiele balbediening versie 20

- Direct slepen blijft bestaan, maar is niet langer noodzakelijk.
- Tikken op een bandbal opent een vast mobiel paneel met −10, −1, +1 en +10.
- Het paneel benoemt de geselecteerde bal en toont de bijbehorende A- en V-waarden.
- Bij een gedeelde bal wijzigen beide aangrenzende waarden als één geometrische stap.
- Bij Been A lopen de stapknoppen over de geconfigureerde hoekzone en wisselen automatisch van band.

### 2026-09-13 — Samengestelde klikzone versie 21

- De klik- en sleepzone van een gedeelde bal omvat de bal, vorige A en volgende V.
- Het gehele omkaderde gebied bedient één gedeeld fysiek balpunt.
- SVG-teksten en waardelabels ontvangen zelf geen pointer-events en blokkeren de zone niet.
- Slepen binnen de zone blijft beperkt tot de band van de geselecteerde bal.

### 2026-09-14 — Tweevingerbediening uitgelegd versie 22

- Mobiel: houd de samengestelde bal+A+V-zone met één vinger vast.
- Sleep vervolgens met een tweede vinger op een vrije plaats van het scherm.
- De geselecteerde bal beweegt langs zijn band; laat daarna beide vingers los.
- Deze werkwijze staat compact en zichtbaar boven de mobiele tafel.
- De stapknoppen blijven beschikbaar voor nauwkeurige correctie.

### 2026-09-13 — exacte ballen en versleepbare afstoot versie 13

- Stiplabels tonen standaard uitsluitend de waarde en staan op de stiplijn.
- Balmiddens worden berekend op één fysieke balradius binnen de band.
- Dikke lijnen lopen van balomtrek tot balomtrek; dunne lijnen verbinden de
  balomtrek met de stiplijn.
- Balstijl is config: wit/geel en effen/met stippen.
- De speelbal is versleepbaar over de eerste zichtbare afstootlijn.
- De afstootlengte en balpositie worden per tafel, systeem en stootbeeld lokaal
  bewaard zonder V/A te veranderen.

### 2026-09-13 — stipwaardelabels versie 12

- Ieder V- en A-constructielijntje vermeldt deelnaam, V/A en stipwaarde.
- De labelweergave is config en on-screen selecteerbaar.
- Stijl `bij_lijntje` behoudt alle standaardnummeringen.
- Stijl `vervang_dichtstbijzijnde_nummer` onderdrukt per lijnpunt het
  dichtstbijzijnde standaardtiental en toont daar het exacte gekleurde label.
- Eén implementatie voorkomt verschillen tussen twee losse appversies.

### 2026-09-13 — bal- en constructielijnen versie 11

- Pijlpunten verwijderd.
- Dikke looplijn gebruikt de geschaalde baldiameter van 61,5 mm.
- Ballen worden volledig gevuld en fysiek tegen de band geplaatst.
- Dunne lijnen lopen van het balmidden naar V en A op de stiplijnen.
- Neus wordt vanuit Z achterwaarts tot de stiplijn verlengd.
- Bij Verkorte 4-bander levert Kop-V de achterwaartse constructielijn.

### 2026-09-13 — absolute Koplengtecorrectie versie 10

- Koplengte wordt absoluut in centimeters berekend uit V en A op de stiplijnen.
- Indicatieve basis: 80% mee-effect bij 140 cm Koplengte.
- Correctie: 2 procentpunt per 25 cm, begrensd op -10/+10 procentpunt.
- On-screen standen: Advies, Aan en Uit; standaard is Advies.
- Advies wijzigt niets; Aan bewaart het berekende effect als actieve waarde.
- De correctie verandert de V/A-geometrie niet en blijft als indicatief gemerkt
  zolang ervaringsgegevens ontbreken.

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
# Versie 23 — 2026-09-14

- Standaard toont de LKL-configuratie alleen Neus en Romp; via `Alle delen` worden alle delen bewerkbaar.
- Dubbelklik op desktop of dubbeltik op mobiel op een bandbal opent een compacte editor voor de gekoppelde A- en V-waarden.
- Een wijziging in A of V wordt direct omgerekend naar dezelfde gedeelde balpositie en live getekend.
# Versie 24 — 2026-09-14

- Geen afzonderlijk zichtbaar editvenster: de tafel is het hoofdscherm.
- Bewerken gebeurt uitsluitend via de compacte popup van de geselecteerde gedeelde bandbal.
# Versie 25 — 2026-09-14

- Het vaste editvenster verdwijnt uitsluitend op mobiel (maximaal 650 px breed).
- Mobiel: tafel plus compacte bandbal-popup. Desktop: tafel plus compacte Neus/Romp-editor.
# Versie 26 — 2026-09-14

- Desktop en mobiel tonen geen vast editvenster; configuratie verloopt alleen via de popup van de bandbal.
- Deze zichtbaarheid is een algemene CSS-regel en hangt niet af van schermbreedte of opgeslagen lokale staat.
# Versie 27 — 2026-09-14

- Elke paginalaad start met focus op de tafel en gebruikt de volledige viewport.
- Deze startweergave wordt niet uit localStorage gelezen: refresh herstelt haar altijd.
- Instellingen kunnen tijdelijk worden geopend; `Tafel` sluit ze weer.
- Echte browser-fullscreen vereist vanwege browserbeveiliging een klik op `⛶`.
