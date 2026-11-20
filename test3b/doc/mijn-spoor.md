# Mijn spoor · 0.4 · test

Alleen Kruin, alleen LKL. Open **Mijn spoor** bij de tafel of via
`?meten=lkl#owner=kruin`, met een volledig Kruin-werkbestand geopend.

## Eén lijn tegelijk

1. Kies Klein/Groot. Begin met VIJF; andere sporen staan onder **Later**.
2. Eerst verschijnt **Neus**, met **V, R en A samen** op één formulier.
3. De velden bevatten de opgeslagen waarden uit de geopende database.
   Ontbrekende waarden blijven leeg. Het vaste vertrekpunt acquit S is leesbaar.
4. Vul de gemeten wijzigingen in en kies **Bewaar lijnmetingen**.
5. Met Vorige/Volgende ga je naar Kop, Nek, Romp, Kruis en Been.

Er zijn geen losse V/A/R-schermen meer. Alleen velden waarin je zelf invoert
worden als waarneming bewaard; een getoonde databasewaarde wordt niet vanzelf
een nieuwe meting. Decimalen mogen met een komma. Ook een gedeeltelijke
lijnmeting mag. Het huidige LKL-Been eindigt vóór de volgende band; een A op
die volgende band is geen verplichte meting.

## Database, concepten en bewaarstatus

V/A komen rechtstreeks uit `lijnpunten` van de geopende SQLite-database.
R wordt alleen getoond als er een opgeslagen raakpunt is, rechtstreeks of
als contactmetadata bij de lijn. Er is geen automatische invulling met een
berekende waarde. Eventuele berekeningen staan apart en zijn herkenbaar.

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

Elke lijn toont wat niet is opgeslagen. Gekoppelde V-waarden en Nek hoeven
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
