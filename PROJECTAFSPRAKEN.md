# Projectafspraken 3B

### 2026-09-16 — volledige lijnreeks NUL–TWAALF versie 55

- Selecteerbare lijnen zijn NUL, EEN, TWEE, DRIE, VIER, VIJF, ZES, ZEVEN, ACHT, NEGEN, TIEN, ELF en TWAALF.
- Elke lijn bestaat op Groot en Klein uit Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen.
- De berekeningsketen en aansluitcontrole gelden voor alle dertien lijnen.
- VIJF bevat de vastgelegde uitgangswaarden; de overige lijnen beginnen leeg totdat Kruin waarden invoert.

### 2026-09-16 — volledige keten vanaf Neus versie 54

- De geborgde volgorde is Neus → Kop → Nek → Romp → Kruis → Been → Hiel → Voet → Teen.
- Berekening en aansluitcontrole beginnen beide bij Neus.
- De ankerbrug met complete Neus, Kop A en complete Romp geldt voor alle lijnen en voor Groot en Klein.
- Kleine en grote oude VIJF-standaarden worden alleen bij herkenning van de exacte oude waarden gemigreerd.
- Afgeleide correcties blijven rood `calculated` totdat Kruin ze met OK goedkeurt.

### 2026-09-16 — algemene aansluitketen versie 53

- De vaste volgorde is Romp → Kruis → Been → Hiel → Voet → Teen.
- De A van ieder deel en de V van het volgende deel verwijzen naar dezelfde fysieke bandbal.
- Deze ketenregel geldt voor NUL tot en met TWAALF.
- De regel geldt op Groot en Klein en ook na importeren of installeren van een lijn.
- Lege en berekende waarden mogen automatisch worden afgeleid; handmatig goedgekeurde waarden niet.
- Een volledig handmatig paar dat geometrisch niet aansluit wordt zichtbaar gemeld.
- De eerdere standaard `Klein · VIJF · Kruis V36` wordt gemigreerd naar `V31` met status `calculated`; Been V5–A70 sluit daarop aan.

### 2026-09-16 — ankerberekening Klein versie 52

- De ankers zijn een complete Neus, Kop A en een complete Romp.
- Zodra deze op Klein beschikbaar zijn, berekent de geometrie Kop V en Nek V/A.
- De uitkomsten zijn afgeleid en krijgen daarom status `calculated` en de kleur Berekend.
- De berekening vervangt alleen lege of eerder berekende waarden.
- Handmatig bewerkte en goedgekeurde waarden hebben altijd voorrang.

### 2026-09-16 — foto’s en tekstinstructie versie 51

- Iedere uitlegkaart kan een tafeltekening of foto gebruiken.
- Een lokale foto wordt voor opslag tot maximaal 1600 pixels verkleind en als WebP bewaard.
- Foto’s kunnen tussen uitlegkaarten worden gekopieerd of verplaatst.
- Bijschrift en toegankelijke beschrijving worden afzonderlijk in Nederlands en Engels opgeslagen.
- De Uitlegeditor toont bij iedere kaart de vaste, op scope aangepaste instructie voor carrouseltekst.

### 2026-09-16 — automatisch Git-herstel versie 50

- Als `.git` ontbreekt, kloont de publicatie-BAT eerst `kruin/3b` naar een tijdelijke map.
- Alleen de gekloonde Git-geschiedenis wordt in de actuele werkmap geplaatst.
- De actuele releasebestanden worden niet door de GitHub-versie vervangen.
- Zonder geslaagde clone vindt geen commit of publicatie plaats.

### 2026-09-16 — basislijn herstelt basisstand versie 49

- Een expliciete keuze van VIJF, ZES enzovoort zet Lijn 1 op `basis`.
- HALFZES hoort uitsluitend bij een bewuste Waaier-keuze.
- Bestaande lokale instellingen met de oude vastgelopen HALFZES-toestand worden eenmalig naar Basis gemigreerd.

### 2026-09-16 — macOS-starter versie 48

- Windows gebruikt `Kruin.bat`.
- macOS gebruikt `Kruin.command`.
- Beide starters openen `Kruin.html`, die doorstuurt naar de Kruin-eigenaarsmodus.
- Mobiele apparaten gebruiken de online Kruin-link.

### 2026-09-16 — één Kruin-ingang versie 47

- Kruin gebruikt één knop `Kruin` voor alle editfuncties.
- Het Kruin-menu biedt uitleg, lijnen/stipwaarden, klant-mobile-test en documentatie.
- Windows gebruikt uitsluitend `Kruin.bat` als lokale beheeringang.
- Losse Open- en Edit-BAT-bestanden zijn vervallen.

### 2026-09-16 — Kruin-editknop versie 46

- De app toont `Kruin · Uitleg bewerken` uitsluitend wanneer de Kruin-eigenaarsmodus actief is.
- De knop opent dezelfde Uitlegeditor op desktop en mobiel.
- De openbare klantmodus en de klant-mobile-preview tonen de knop nooit.

### 2026-09-16 — Main en Doc versie 45

- De openbare klantapp blijft op `/3b/` en heet Main.
- De openbare documentatie staat op `/3b/doc/` en heet Doc.
- Main en Doc linken wederzijds naar elkaar.
- GitHub Pages blijft publiceren vanuit branch `main`, map `/(root)`.
- De publicatiecontrole moet beide ingangen bevestigen.

### 2026-09-16 — centrale uitleg versie 44

- `START-HIER.md` is de primaire bedienings- en workflowhandleiding.
- De handleiding scheidt de rollen Kruin, klant en publicatiebeheer.
- Iedere workflow benoemt expliciet wat lokaal blijft, wat een reservekop is en wat openbaar wordt.
- README verwijst voortaan als eerste naar deze centrale handleiding.
- De desktop mobiele preview simuleert de openbare klantmodus en toont geen Kruin-conceptuitleg.

### 2026-09-15 — Git-uitsluitingen versie 43

- Lokale JSON-exports, SVG-downloads, ZIP-pakketten en reservekopieën horen niet in Git.
- De drie BAT-starters, openbare appbestanden, documentatie en publicatiecontrole horen wel in Git.
- Gepubliceerde uitleg en KruinLines worden bewust in de versiebron opgenomen, niet als losse browserexport.

### 2026-09-15 — desktopstart uitleg versie 42

- `Edit_Uitleg.bat` is de primaire desktopingang voor het huidige uitlegwerk.
- `Open_KruinLines.bat` blijft afzonderlijk beschikbaar voor lijn- en stipwaardenbeheer.
- `Open_3B.bat` opent uitsluitend de gewone lokale klantweergave.
- De uitlegingang activeert de lokale Kruin-eigenaarsmodus en opent de Uitlegeditor direct.

### 2026-09-15 — mobiele Uitlegeditor versie 41

- De Uitlegeditor is uitsluitend zichtbaar in de Kruin-eigenaarsmodus.
- De editor werkt op mobiel en desktop en bewaart conceptkaarten alleen in de lokale browser.
- Een conceptkaart bevat level, scope, tafel, lijn, zichtbare delen en Nederlandse en Engelse titel en tekst.
- De editor kan kaarten toevoegen, wijzigen, verwijderen, vooraf bekijken en als één uitleg-JSON downloaden.
- De statische app schrijft nooit rechtstreeks naar GitHub; opname in een openbare release blijft een bewuste publicatiestap.
- De openbare klantweergave van de uitleg blijft alleen-lezen.

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
- KruinLines is de gepubliceerde, alleen-lezen catalogus van Kruin.
- Op GitHub Pages kan KruinLines door iedere gebruiker worden bekeken en als
  werkkopie worden geïnstalleerd, maar nooit worden gewijzigd.
- Alleen de lokale start via `Open_KruinLines.bat` activeert beheer: een Freeze
  wordt dan lokaal aan KruinLines toegevoegd en direct als JSON gedownload.
- Klanten bewaren hun eigen bevroren lijnen uitsluitend in MyLines.
- Publicatie van een nieuwe KruinLine blijft een bewuste Git-publicatie; GitHub
  Pages heeft geen veilige eigenaarslogin en schrijft nooit terug naar GitHub.
- Klein en Groot hebben gescheiden configuraties.
- NUL t/m TWAALF zijn afzonderlijk selecteerbaar.
- Neus vertrekt standaard uit Z; overige delen bestaan uit V en A.
- Bekende stipwaarden: west/oost 0–80 en noord/zuid 0–40.
- Bij spiegelen van neuslijn west naar oost spiegelen ook alle vier zichtbare
  nummeringsassen. Dezelfde stipwaarde blijft dezelfde waarde in het gekozen
  perspectief; west/oost wisselen als bandzijde.
- Stiplijnen liggen 9,5 cm buiten de bandrand.
- Baldiameter: 61,5 mm.

## Geldige huidige scope

- VIJF bevat de vastgelegde startwaarden.
- NUL t/m VIER en ZES t/m TWAALF zijn voorlopig leeg.
- Geen effect-, fysica- of ervaringscorrecties zolang daarvoor geen geldige
  gegevens zijn vastgelegd.
- Benamingen zijn: Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen.
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

## Uitleg en levels

- Uitleg is een uitbreidbare carrousel; inhoudsversie 0.1 begint met Level 1 LKL.
- Een level legt een toepassing van het lijnensysteem uit en bevat geordende kaarten.
- Tafelbeelden worden uit echte, opgeslagen KruinLines opgebouwd.
- Kruin kan lokaal een gekozen KruinLine als momentopname aan Uitleg toevoegen.
- Klanten kunnen de gepubliceerde uitleg bekijken, maar niet wijzigen.
- Nieuwe levels en kaarten worden declaratief in `config-v35.js` toegevoegd.
- Uitleg 0.1 behandelt: waarom lijnen in plaats van losse stippen, A/V op de
  stiplijnen, en SCHUIF als verplaatsing en naamgeving van een volledige lijn.
- De gepubliceerde uitleg is gemeenschappelijk voor Groot en Klein; vaste
  uitlegkaarten tonen beide tafels binnen dezelfde kaart.
- Uitleg bij een concrete LIJN is daarentegen altijd tafelspecifiek: iedere
  kaart legt `lijn`, `tafel` en een onveranderlijke snapshot vast.
- De schematische speelbal op de basis-vijftigkaart ligt met zijn middelpunt
  één baldiameter van de binnenrand van de rechterband én één baldiameter van
  de binnenrand van de zuidband.
- Deze uitgangspositie heet `Hoek`; Engels: `Corner`.

## Wijzigingslog

### 2026-09-15 — tafelspecifieke LIJN-uitleg versie 40

- Algemene uitleg is gemeenschappelijk voor Groot en Klein.
- Toelichting bij VIJF en andere concrete LIJNen hoort bij precies één tafel.
- KruinLine-uitlegkaarten bewaren verplicht lijn, tafel en snapshot.
- De zichtbare contextkop schakelt tussen `Groot + Klein` en `LIJN · Tafel`.

### 2026-09-15 — gemeenschappelijke uitleg en exacte speelbal versie 38

- Eén carrousel bedient Groot en Klein gezamenlijk.
- Beide tafels staan naast elkaar op de vaste uitlegkaarten.
- De speelbalpositie op ‘basis vijftig’ is niet langer een visuele schatting:
  de afstand van het balmiddelpunt tot beide aangrenzende bandranden is 61,5 mm.
- De speelbal heeft een zichtbare aanwijslijn en naam.

### 2026-09-15 — lokale KruinLines-starter versie 37

- Windows mag `#owner=kruin` niet als deel van de bestandsnaam ontvangen.
- `Open_KruinLines.bat` zet het volledige lokale pad daarom via PowerShell om
  naar een `file:///`-URL en voegt daarna pas het browserfragment toe.
- De starter toont een foutmelding en pauzeert wanneer openen mislukt.

### 2026-09-15 — Uitleg 0.1 en levels versie 35

- Level 1 LKL bevat een tafelgerichte carrousel met drie eerste kaarten.
- VIJF Neus en Romp vormen het basisbeeld; de SCHUIF-kaart toont Neus.
- Lokale KruinLine-momentopnamen kunnen als uitbreidingskaart worden toegevoegd.
- De hoofdtafel blijft het dominante beeld op desktop en mobiel.

### 2026-09-15 — Basis-vijftigkaart apart versie 36

- ‘Een globale regel als basis vijftig is niet precies genoeg’ vormt één
  zelfstandige uitlegkaart.
- Het beeld is een lege tafel met alleen de speelbal ongeveer rechtsonder.
- De uitleg over zelf gespeelde, meermalen gecontroleerde lijnen volgt op een
  aparte kaart met VIJF Neus en Romp.

### 2026-09-15 — KruinLines en MyLines versie 34

- KruinLines is op GitHub Pages zichtbaar en installabel, maar onveranderlijk.
- De eigenaarsmodus werkt alleen bij een lokaal bestand met `#owner=kruin` en
  wordt geopend met `Open_KruinLines.bat`; dezelfde parameter werkt online niet.
- Freeze verschijnt pas na een wijziging en bewaart de volledige gekozen lijn
  voor de gekozen tafel.
- Freeze gaat in eigenaarsmodus naar KruinLines en voor klanten naar MyLines.
- Undo en Redo bewaren maximaal vijftig momentopnamen.
- Herstel zet uitsluitend de gekozen lijn op de gekozen tafel terug naar de
  gepubliceerde startconfiguratie.
- Hiel, Voet en Teen zijn na Been toegevoegd.

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
# Versie 28 — 2026-09-14

- `table-only` wordt niet alleen in HTML gezet, maar opnieuw afgedwongen bij init, `pageshow` en terugkeer naar een zichtbare mobiele pagina.
- Iedere nieuwe schermstart sluit de bandbal-popup en scrollt naar het begin.
- CSS krijgt per release een cacheparameter; de publicatie-BAT verifieert die parameter voortaan ook op GitHub Pages.
# Versie 29 — 2026-09-14

- Mobiel is geen responsieve afgeleide van desktop meer, maar een vaste tafelstage met `100svh` en `position: fixed`.
- Eénvingersleep gebruikt uitsluitend de pointer waarmee het gebaar begon; een tweede vinger kan de bal niet meer overnemen.
- Binnen de mobiele tafel zijn browserpan, zoom en overscroll uitgeschakeld.
- Desktop biedt `TEST MOBILE VIEW`: een 390 × maximaal 844 px testkader met dezelfde popupindeling.
# Versie 30 — 2026-09-14

- Geen bottom sheet: de bandbalbediening is een contextuele popup naast de gekozen bal.
- De popup is maximaal 220 px breed, gebruikt compacte knoppen en wordt aan de vrije zijde van de bal geplaatst.
- Bij iedere hertekening volgt de popup de actuele balpositie en blijft zij binnen de viewport.
# Versie 31 — 2026-09-14

- Modus `LKL` is de vaste startmodus en toont in de tafel alleen Neus en Romp.
- Modus `Free play` toont alle ingevulde delen en activeert het vrije slepen van speelbal en bandballen.
- De modus is een gebruikerskeuze en wordt niet meer impliciet gewijzigd door de validatie van waarden.
# Versie 32 — 2026-09-15

- `Instellingen` opent altijd de volledige klassieke V-A-editor: Neus, Kop, Nek, Romp, Kruis en Been.
- Dit geldt voor LKL en Free play en staat los van wat op het hoofdscherm getekend wordt.
- Op het hoofdscherm start slepen direct bij pointerdown op een bal in beide modi.
# Versie 33 — 2026-09-15

- LKL begint met Neus en Romp; `+ Kop`, `+ Nek`, `+ Kruis` en `+ Been` voegen delen toe. Na alle toevoegingen herstelt de knop de basis.
- Waardestatus per punt: `calculated` rood, `edited` blauw, `approved` groen.
- Handmatige stappen, invoer en balsleep leveren `edited`; afgeleide partnerwaarden leveren `calculated`; OK levert `approved`.
