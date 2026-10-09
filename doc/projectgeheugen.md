# 3B · projectgeheugen v194

Vastgelegd: 8 oktober 2026. App v194; cursus 1.2. Deze actuele afspraken zijn
leidend boven oudere voorstellen. Geen nieuwe Neus–Been-metingen zijn aangeleverd.

## Actuele voorrangsregel — P0 leidt automatische lijnen

P0, bijvoorbeeld VIJF, bevat het karkas en de basisrichting per lijn. Voor elk
overeenkomstig segment van P−2, P−1, P+1, P+2 en P+3 geldt: ontbreekt een
gemeten of ge-edite waarde, dan wordt dat segment parallel aan hetzelfde
segment van P0 geconstrueerd. Een gemeten of ge-edite lijn blijft leidend en
wordt niet door de parallelberekening vervangen. De huidige automatische Nek
wordt dynamisch uit Kop en Romp geconstrueerd; aanwezige handmatige Nekwaarden
blijven, net als bij de andere lijnen, behouden.

## Patroon, spoor en karkas

Projectregel: **nieuw karkas = nieuw patroon**. Een patroon heeft een eigen
karkas, bandroute, meetankers en stootwijze. Een spoor (VIJF, VIER, enzovoort)
is een concrete baan binnen dat patroon. Gelijke bandvolgorde betekent niet
dat meetwaarden van een ander karkas overgenomen mogen worden.

LKL behoudt Neus–Romp. KKL en KLK vragen eigen karkassen en regels.
Neus–Been is een afzonderlijk nieuw patroon in voorbereiding; niet opnemen in
LKL. Alleen vermelden en voorbereiden. Oude A/V-waarden van de eerste lijnen
mogen niet automatisch in het nieuwe patroon worden hergebruikt.

## Neus–Been: volgorde van onderzoek

1. Meet Neus en Been als karkas. Leg tafel (Klein/Groot), start, afstootlengte,
   concrete bandroute, stootwijze/snelheid en effect vast.
2. Meet daarna noodzakelijke ijkpunten, waaronder Kop A.
3. Vul Kop, Nek, Romp en Kruis in of bereken ze waar de ankers dat toelaten.
4. Controleer de gehele relevante baan. Onbekende waarden blijven onbekend.

Kruin verwacht bij harder stoten andere vroege aankomsten. Dit is een
onderzoeksvraag met eigen meetreeksen; geen universele hoekcorrectie of
snelheidsberekening in deze versie. De app rekent geometrie, geen balfysica.

## Bal 2 exact passeren

Bij losse driebanders moet de speelbal bal 2 nogal eens exact passeren.
Het juiste Been-eindpunt alleen is onvoldoende. Registreer bal 2-positie,
het betreffende trajectdeel, passeerkant en gewenste vrije ruimte. Controleer
op de echte tafel. Er is nog geen automatische botsings- of passagecontrole.

## Praktische scope van LKL

Been en vooral Hiel kunnen buiten het bruikbare speeltraject liggen: de bal
moet te ver doorrollen. Zij blijven als optioneel vervolg beschikbaar voor
onderzoek en uitleg. De cursus verlangt geen volledige uitloop naar Hiel.
Begin met Neus–Romp, voeg Kop/Nek/Kruis toe. Bewaar bestaande vervolgwaarden.

## Kruis en loop

Standaard Kruishoek: 45°, gemeten vanaf horizontaal. Bij hetzelfde Romp-anker
met aankomst op West geeft 46° hogere/noordelijkere Kruis A, 44° lagere/
zuidelijkere A. Dit betreft geometrie, geen effect- of snelheidsvoorspelling.
De extra aankomstbandkeuze is voorlopig relevant voor testen op VIJF P+1,
P+2, P+3 en VIER P, P+1, P+2, P−1, P−2. Andere losse lijnpunten blijven
handmatig overschrijfbaar.

Eén band overslaan keert de effectstand: vanuit mee naar contra, ook kerend
effect genoemd. De stand blijft tot een volgende bandoverslag. Geen regels
voor twee of meer banden tegelijk overslaan opnemen. Kruisloop wordt uit de
bandroute bepaald en blijft handmatig aanpasbaar. Auto herstelt de routebepaling;
een override wordt in het beheerblad als Ge-edit aangeduid.

## Punten, banden en herkomst

A en V liggen op stiplijnen. Twee aansluitende lijnen delen één fysieke bandbal,
maar hun A/V-getallen hoeven niet gelijk te zijn. Neus A standaard West,
Kop A Noord, de berekende Nek loopt Noord–Oost, Romp A Zuid of West; Kruis A doorgaans West/Zuid;
Been A standaard Oost. Automatische V-banden volgen de vorige aankomstband.
Alle handmatige waarden blijven bewerkbaar en behouden bij herberekenen.
Auto laat opnieuw berekenen met voldoende bekende ankers.

Nummering start bij 0 en loopt met de bal mee (lange band 0–80, korte 0–40).
SQLite bewaart één basisrichting; spiegeling gebeurt in de app.
Kruin mat Kop A bij VIJF: Klein 19, Groot 15. Dit zijn tafelgebonden referenties,
geen algemene wet. Kop A bij voorkeur meten; een gekozen benadering blijft
herkenbaar. Bij de huidige automatische waarden volgt de Nek dynamisch uit de
gedeelde Noord- en Oostbal; gemeten of ge-edite Nekwaarden blijven leidend.

Herkomst: oker configuratie/karkas; groen Kruinwaarde/Kruinmeting/eigen meting;
rood berekend/benadering; blauw Ge-edit. Labels onderscheiden de categorieën.

## Beheer, bestanden en publicatie

SQLite is de zelfstandige private beheerbron, met beheerblad en directe SQL.
XLSX/ODS in archief-v178 zijn historisch, geen generatorinput. Mijn tafel blijft
voor gebruikers beschikbaar in de bestaande bestandsvormen. Gebruik een eigen
v179/v180-database door die vóór starten in de nieuwe private map te zetten;
bewaar de oude map als reservekopie. Publicatie is een afzonderlijke handeling.
De v172–v180-bases blijven onveranderd beschikbaar.


## Versie-ZIP in de private GitHub-repo

Bewaar de complete versie-ZIP in de map boven de uitgepakte openbare/private
mappen. Start Publiceer_KruinBeheer.bat (Mac: .command) in de private map.
De starter zoekt een ZIP met het huidige versienummer in de bovenliggende map.
Als er meerdere zijn, kiest hij de laatst gewijzigde. Hij controleert de ZIP
en neemt die op in `versies/` in `kruin/3b-kruin-beheer`.

De starter houdt slechts één nieuwste versie-ZIP in de huidige repo-inhoud.
Oudere versie-ZIP’s worden uit Git verwijderd; lokale bestanden blijven staan.
Een reeds aanwezige nieuwere repo-versie wordt behouden. Als er geen passende
ZIP in de bovenliggende map staat, blijft de nieuwste bestaande repo-ZIP staan;
zonder enig archief gaat de beheerpublicatie gewoon verder zonder ZIP.
Een beschadigde nieuwe ZIP stopt de publicatie vóór het opschonen.

Git-geschiedenis wordt niet herschreven: oude ZIP’s blijven in eerdere commits
terug te vinden. De openbare repo krijgt de complete versie-ZIP niet.
De meegeleverde helper Bewaar_versiezip.py en controle Versiezipcontrole.py
regelen en testen dit voor beide starters. Het private SQLite-bestand wordt
zoals voorheen meegenomen.

## Nog uit te werken

Eerste meetspoor voor KKL/KLK/Neus–Been; bijbehorende bandroute en ijkpunten;
verschillende stootwijzen als meetreeksen; exacte passage van bal 2.
Een eindpunt/doelband per stoot en automatische passagecontrole zijn voorstellen,
geen al geïmplementeerde functies. Echte browsertest van deze release staat open.

## v194 — versienummer én versie-inhoud verplicht gelijk

De actuele release komt uit de openbare config. De regressietest vergelijkt
dit nummer met de bestandsnamen, interne config- en Kruinwaardenrelease,
HTML- en stylesheetverwijzingen, VERSIE.txt, documentatie, controlepagina,
openbare publicatie-BAT en aanwezige private beheerbestanden. De private
Windows- en Mac-publicatiestarters draaien bovendien `Versiecontrole.py`
voordat Git of het versie-ZIP wordt gewijzigd. Iedere operationele verwijzing
naar een andere release stopt de publicatie; historische vermeldingen in de
documentatie en oude basisarchieven blijven toegestaan.


# 3B v194 — menuherstel en volledige NEGEN

Het undo-menu staat bij starten dicht. Open ☰ voor Undo, Opnieuw, Verwerp
experiment en Sessiestart. Sluit met ×, Escape of een tik op de tafel.
In de lijneditor blijft dezelfde herstelbediening beschikbaar; na sluiten
keert zij terug naar het menu. Ctrl+Z werkt ook met het menu dicht.

NEGEN en HALF NEGEN gebruiken dezelfde lijnketen en bediening als ACHT:
Neus, Kop, Nek, Romp, Kruis, Been en Hiel. Karkas toont Neus + Romp;
de gewone LKL-weergave begint zoals bij ACHT met Neus + Romp. Kies
Parallel of voeg de vervolglijnen toe om meer lijnen te bekijken.
NEGEN heeft P−2, P−1 en P0; P+1 is niet beschikbaar.

Neus A90 en HALF NEGEN A85 blijven behouden. De nog ontbrekende
NEGEN-Romp is voorlopig geëxtrapoleerd uit de actuele ZEVEN/ACHT:
klein V51→A15, groot V59→A14. Kop A is voorlopig geometrisch benaderd
uit de Neus (klein circa 3,162, groot circa 1,994). Been A10 is een
bestaande LKL-beginwaarde. Alle nieuwe aannames zijn berekend/benadering,
geen nieuwe metingen. Metingen en gebruikerswijzigingen blijven leidend.

Gewone LKL: **5 banden + uitloop tot midden lijn 6 (Been)**.

## Voorstel LKL-zesbander

Een apart patroon voor een snellere Neus en hardere bandbotsingen:
**6 banden**, met **7 banden** als afzonderlijke vervolgvariant.
Het karkas bestaat uitsluitend uit **Neus + Been**. Romp, Kop, Nek,
Kruis en Hiel worden gemeten of berekend; Romp is geen karkasanker.
Dit voorstel is vastgelegd in config en projectgeheugen; het is nog
geen selecteerbare patroonstand in de tafel.

In de huidige database is geen Been-punt expliciet als eigen meting
gemarkeerd. Wel bestaat de Kruin-beginwaarde Been A10 op Oost.
Voorstel voor de eerste meetreeks: behoud de bestaande Neus S–A per
spoor en begin bij Been A10, op beide tafels. Meet eerst Been V en A
bij de hogere snelheid. De bestaande berekende Been V mag als eerste
proefstand dienen, met herkomst 'benadering uit gewone LKL'.
Verhoog de snelheid tot 6 banden (of apart 7); de afstootlengte in cm
is niet de snelheid. Leg per proef het aantal banden en de uitloop vast.
Gebruik geen willekeurige snelheidscorrectie in stippen: daarvoor ontbreken
metingen. Ook de 45°-Kruisregel van gewone LKL wordt niet vanzelf
een vaste zesbanderregel. Daarna pas de tussenlijnen afleiden of meten.

## Controle

Menuplaatsing, sluiten/Escape, Undo/Redo/Verwerp, v193-gebruikerswaarden,
NEGEN/HALF NEGEN/P−1/P−2 en alle gedeelde aansluitballen worden apart
gecontroleerd voor klein/groot en west/oost. De gewone regressietests
blijven aanwezig. Een echte browserlayouttest kon in deze werkomgeving
niet worden uitgevoerd doordat Chromium niet beschikbaar is.
