# Mijn spoor · 0.6 · test

Alleen Kruin, alleen LKL. Open **Mijn spoor** bij de tafel of via
`?meten=lkl#owner=kruin`, met een volledig Kruin-werkbestand geopend.

## Tafel eerst, één lijn tegelijk

1. Kies Klein/Groot. Begin met VIJF; andere sporen staan onder **Later**.
2. De echte tafel en het hele spoor staan voorop. De huidige lijn is gemarkeerd.
3. Open **Waarden van Neus aanpassen**. V, R en A staan samen; de tafel blijft
   zichtbaar. Op desktop staan tafel en velden naast elkaar.
4. Wijzig een waarde: **Mijn spoor** verandert direct. Ook eerdere wijzigingen
   aan andere lijnen uit dezelfde meetreeks blijven in de voorvertoning.
5. Kies **Kruin-spoor** om de huidige referentie te zien en **Mijn spoor** om
   terug te keren. Schaal, gekozen lijn en alle invoer blijven behouden.
6. **Tafel vergroten** sluit op mobiel de velden; de invoer blijft bewaard.
7. Bewaar de lijnmetingen. Vorige/Volgende gaat naar Kop, Nek, Romp, Kruis en Been.

De tekening gebruikt de werkelijke appgeometrie, meetbasis en bestaande
karkas-/Kruisberekening. Zij is een **berekende voorvertoning**, geen nieuwe
meting. Bandballen hebben de werkelijke balbreedte. LKL stopt op de huidige
uitloop van Been. Stipwaarden worden als projecties van lijnen getekend.

Bij conflicterende V/A/R wordt geen schijnbaar geldig werkspoor getoond.
Bij een losse lijnwaarneming die niet aan de vorige lijn aansluit stopt het
verbonden spoor; de losse huidige lijn kan gestippeld worden getoond.
Er wordt geen aansluitende lijn of uitloop verzonnen. De expliciete
Kruin-weergave blijft beschikbaar als vergelijking. Deze voorvertoning
wijzigt geen actieve lijnwaarden, hoofdtafel of databasepunten.

Automatisch ingevulde berekeningen worden niet als waarneming opgeslagen. Alleen velden waarin je zelf invoert worden als waarneming bewaard; een
getoonde databasewaarde wordt niet vanzelf een nieuwe meting. Decimalen
mogen met een komma. Ook een gedeeltelijke lijnmeting mag. Het huidige
LKL-Been eindigt vóór de volgende band; een A daar is geen verplichte meting.

## Database, concepten en bewaarstatus

V/A komen rechtstreeks uit `lijnpunten` van de geopende SQLite-database.
R uit de database blijft herkenbaar als opgeslagen raakpunt, rechtstreeks
of als contactmetadata bij de lijn. Wat ontbreekt maar uit bekende lijnen
berekend kan worden, wordt automatisch ingevuld: onder meer Kop V, Nek V/A,
Kruis V/A en de berekenbare raakpunten. De velden krijgen **Berekend · niet
gemeten** als herkomst. Zij volgen ook eerdere wijzigingen in Mijn spoor.
Bij een opgeslagen R kan de ontbrekende V of A worden afgeleid wanneer er
voldoende onafhankelijke gegevens zijn. Wat niet bepaald kan worden,
blijft leeg; een ongemeten standaardwaarde wordt niet als berekening ingevuld.
Bestaande databasewaarden en eigen invoer worden behouden.

Concepten blijven per lijn op deze telefoon bewaard. Ook eerdere concepten
uit de oude invoer per V/A/R worden ingelezen. Browsergegevens wissen kan
lokale concepten verwijderen; bewaar daarom de lijnmetingen.

Alle ingevoerde waarden van één lijn worden in **één transactie** toegevoegd
aan `instellingen.lkl-meetlog-v1`. Zij behouden ieder een uniek ID, tijdstip,
basis, tafel, spoor, lijn, V/R/A, band, exacte waarde en notitie. De bestaande
actieve lijnpunten worden niet overschreven. Toepassing vanuit het meetlog
en automatische openbare JSON-export zijn nog niet gebouwd.

Bij een gekoppeld GitHub-werkbestand gebruikt de gehele lijn één gecontroleerde
GitHub-schrijfactie. Alleen na bevestiging staat er **Op GitHub bevestigd**.
Zonder koppeling staat de lijnmeting uitsluitend in de lokale werkdatabase;
maak desgewenst een databaseback-up via Beheer. Bij onzekere synchronisatie
blijft de batch lokaal aanwezig en wordt blind opnieuw toevoegen voorkomen.
Controleer of heropen dan het GitHub-werkbestand. De invoer blijft bewaard.

## Ontbrekende waarden en verschillen

Elke lijn meldt alleen wat nog niet bepaald kan worden; een berekend veld vraagt geen handmatige meting. Gekoppelde V-waarden en Nek hoeven
niet allemaal apart te worden gemeten. Een opgeslagen R dat meer dan 0,5 stip
van het uit V/A berekende contact verschilt, vraagt om controle van bron en
meetprecisie. Dit is een inventarisgrens, geen bewijs van een fysieke fout.
Een laatste waarneming in het meetlog die van de actieve databasewaarde
verschilt, krijgt eveneens een melding. Geen van deze verschillen verandert
automatisch een referentie.

Config → **LKL · meten en beslissen** inventariseert de actuele werkbasis,
per tafel/patroon en desgewenst parallellen. De knop naar Mijn spoor opent
rechtstreeks de betreffende lijn. Een uitgebreid extern auditbestand wordt
niet openbaar gepubliceerd.

## Later: U

U leest vrijgegeven Kruin-JSON en bewaart eigen tafelmetingen in een eigen
JSON. U schrijft nooit in de Kruin-database. De huidige tool blijft alleen
voor Kruin; de U-cursus houdt haar eigen gefaseerde introductie.

## Verificatie

`KRUIN_TEST_DB=/pad/naar/wegwerpkopie.sqlite3 node mijn-spoor-controle-v208.cjs`
controleert mobiel staand/liggend en desktop: V/R/A samen per lijn, exacte
SQL-waarden, velden wijzigen, gedeeltelijke invoer, atomair bewaren, ongeldige
invoer, herladen, conceptmigratie, ontbrekende/conflicterende waarden, onzekere
GitHub-opslag en onveranderde actieve SQL-tabellen. GitHub-opslag wordt
uitsluitend gesimuleerd; er zijn geen echte private databasewijzigingen.


## Kruin: QR naar de U-cursus

In het **Kruin-menu** staat **QR · U-cursus**. Voordat een database is
geopend staat die knop bij **GitHub-werkbestand**. De QR en de klikbare afbeelding openen de U-cursus in een nieuw
tabblad. Alleen cursusstart, actuele testversie en `owner=user` worden gedeeld;
geen database, meetwaarden, tafel-view of token. Deze U-cursusstand gebruikt
eigen browseropslag; QR openen op hetzelfde apparaat verandert de Kruin-werkstand niet.

## Voorstel voor de U-route — nog niet omgebouwd

De huidige eigen JSON-meetroute voor U is nog niet gebouwd. Het voorstel is:

1. Tafel voorop. Kort de waaier en parallellen laten zien.
2. VIJF als eerste spoornaam: één herkenbaar geheel op de tafel.
3. Jouw VIJF op jouw tafel meten, lijn voor lijn; bekende berekeningen vullen
   vanzelf aan. Kort: eigen gegevens blijven gescheiden van Kruins referentie.
4. Bewaren: direct zichtbaar dat de eigen tafel behouden is. JSON-bestand en
   herladen worden later uitgelegd; een lokaal concept kan ondertussen bestaan.
5. ZUID — **Kijk!** Eerst de aankomstbal van jouw VIJF.
6. VIJF+1 vanuit de gemeten basis berekenen en aan tafel controleren. Bewaren.
   Eindigen op ZUID: VIJF en VIJF+1 als twee aankomstposities.
7. +2, +3 enzovoort herhalen: de reeks aankomstballen groeit pas wanneer het
   volgende spoor aan bod is geweest. De nieuwe bal valt op; oudere blijven
   zichtbaar. Werkelijke schaal en balbreedte, zonder geforceerde tussenruimte.

Begin op één tafelformaat. Vergelijk Groot/Klein later. Toon alleen de actuele
stap en de benodigde bediening. Benoem afzonderlijk wat gemeten en wat
berekend is. Voor +1 hoeft U niet het hele spoor opnieuw in te voeren: het
systeem doet een voorstel op basis van VIJF en de beschikbare meetregels.
Bij het bewaren moet helder blijven wat alleen op het apparaat staat en wat
als eigen JSON-bestand veilig is meegenomen.

ZUID wordt ook een zelfstandig herkenningspunt: **spoor → aankomst**, maar
ook **positie op ZUID → spoornaam**. U hoeft daarvoor niet telkens de hele
Romp te bekijken. Een balpositie kan de spoornaam tonen; het hele spoor is
vervolgens desgewenst op te roepen. Bij aankomsten die qua balbreedte dicht
bijeen liggen moet de app de mogelijke sporen tonen, zonder schijnzekerheid.
Dit hoort bij het voorstel voor de nieuwe U-route; het is nog niet omgebouwd.


## U-intro op test v208-r117

Vijf korte schermen tonen achtereenvolgens 0, VIJF uit de waaier, VIJF/ZES,
parallel VIJF en VIJF+1. De gecombineerde zesde overzichtsstap en de teller
zijn verwijderd. W+1 wordt niet meer als spoornaam gebruikt; +1 verwijst
uitsluitend naar P, bijvoorbeeld de parallel VIJF+1 van VIJF.

De tafel toont de drie acquits op de lengteas zoals gedefinieerd door de
appgeometrie en alle stippen/waarden op de vier stiplijnen. Tekengrootte wordt
op pixels afgestemd, met ruimte rondom de tafel zodat waarden leesbaar zijn.
Na het vijfde scherm gaat U direct naar VIJF, vanaf de Neus, zonder een
inhoudsopgave ertussen. De eerste VIJF-weergave heeft één primaire vervolgknop;
extra bediening blijft voor later. Ook de Cursus-knop hervat in deze U-beginstand de les, in plaats van meteen een onderdelenmenu te openen. De berekeningen en meetwaarden veranderen niet.
Cursuslinks behouden de afzonderlijke U-cursusopslag.

### U-instap v208-r118

De eerste vijf introductieschermen en de eerste VIJF-les tonen tafel en lijnnaam. Uitleg staat dicht achter ‘Uitleg’ en blijft opvraagbaar. ‘Volgende’ staat centraal onder de tafel, op een vaste plek; doorklikken hoeft niet op de animatie te wachten. Terugredeneren blijft een zelfstandige visuele les; deze wijziging verwijdert die les niet.

### W en P proberen (v208-r119)

In het W-scherm kan U kiezen tussen VIJF, ZES en ZEVEN, met vertrek vanuit dezelfde 0. In het P-scherm kan U VIJF, VIJF+1 en VIJF+2 kiezen; de richting blijft gelijk en het vertrek verschuift. VIJF blijft als dunne referentielijn zichtbaar. Alle lijnen komen rechtstreeks uit de actieve cursusmeetbasis. Proberen is optioneel; Volgende blijft onmiddellijk beschikbaar.

### Essentiële W/P-uitleg (v208-r120)

De start kondigt W en daarna P aan. Per stap is één korte instructie zichtbaar; verdiepende uitleg blijft opvraagbaar. Bij W verschijnen de spoornamen VIJF, ZES en ZEVEN bij de gekozen richting. Bij P zijn −1, 0, +1 en +2 beschikbaar; P−1 → VIJF−1 enzovoort. De live tabel gebruikt steeds de eigen cursuslijn uit de meetbasis; proberen blijft optioneel.

### Eerst proberen (v208-r121)

Bij W verschijnt Volgende nadat U ZES én ZEVEN heeft gekozen. Bij P geldt dat voor VIJF−1 én VIJF+1. De aanwijzing noemt de nog te proberen keuze; er is geen wachttijd. W gebruikt uitsluitend spoornamen. Terugkeren bewaart de keuzes binnen deze introductie; een nieuwe start of een andere tafel begint opnieuw.

### Meten is weten — aan de tafel (v208-r122)

De cursus begint met Kruins werkwijze aan de echte biljarttafel: spelen, lijnen meten en controleren. VIJF, de parallellen +/− en andere hoofdsporen zoals ZES vormen de meetbasis die de app laat zien. Gemeten en berekende waarden blijven onderscheiden. De U-cursus geeft dit eerst als korte oorsprong bij de tafel; de praktische meetles voor de eigen tafel volgt later.

### Direct naar de editor (v208-r124)

Kruin heeft op het hoofdscherm een eigen knop **Editor · V/R/A**, ook op mobiel. Zonder geopend werkbestand leidt deze naar de GitHub-verbinding; na openen van de database verschijnt de editor. De directe ingang is `?editor=1#owner=kruin`. Neus V is de terugverlenging naar de Zuid-stiplijn, berekend uit de Neus; het is niet de positie van de vertrekbal. De kwartstipweergave 3− betekent 2,75. De precieze geometrische waarde kan bij weergave zijn afgerond. Er worden geen spoor- of databasewaarden gewijzigd door deze ingang.

Onvolledige sporen blijven in de eigen spoorkeuze van de editor beschikbaar. Kies bijvoorbeeld VIER en vul de ontbrekende karkasankers in. De editor gebruikt geen filter voor volledig tekenbare LKL-sporen. Afgeleide velden blijven berekend; ontbrekende onafhankelijke meetvelden blijven invoerbaar.
