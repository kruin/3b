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
