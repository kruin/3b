# Mijn spoor · 0.1 · test

Mobiele invoertool in de app, voorlopig alleen voor Kruin en alleen LKL.
Open **Mijn spoor** bij de tafel, of gebruik `?meten=lkl#owner=kruin`.
Een geopend volledig Kruin-werkbestand is nodig. Productie is niet gewijzigd.

1. Kies Klein of Groot van de huidige werkdatabase en het spoor.
2. Kies Neus, Kop, Romp of Kruis; kies V, A of R, band en stipwaarde.
3. Bewaar. Ook één losse waarneming is geldig. Decimalen mogen met een komma.
4. Lees de bewaarstatus. Ga verder met een volgende meting of wissel lijn/soort.

Concepten blijven per tafel, spoor, lijn en V/A/R op deze telefoon staan.
Zij zijn nog geen opgeslagen databasewaarnemingen. Bij een fout blijft het
concept beschikbaar. Browsergegevens verwijderen verwijdert ook lokale concepten.

Elke bewaarde waarneming heeft een uniek ID, tijdstip, basis, tafel, spoor,
lijn, soort, band, exacte numerieke waarde en optionele notitie. Zij wordt in
`instellingen.lkl-meetlog-v1` van de volledige SQLite-werkdatabase toegevoegd.
De overige instellingen en alle actieve lijnpunten blijven ongewijzigd.
Een ID kan niet stilzwijgend voor een andere waarneming worden hergebruikt.

Bij een GitHub-werkbestand gebruikt bewaren de bestaande gecontroleerde
schrijfprocedure. Alleen na bevestiging staat er **Op GitHub bevestigd**.
Zonder GitHub-koppeling staat de waarneming uitsluitend in de lokale
werkdatabase op dit apparaat; maak een databaseback-up via Beheer.
Bij onzekere synchronisatie worden verdere logwijzigingen tegengehouden:
controleer/heropen het werkbestand. Een concept kan dan nog niet als
bevestigde GitHub-opslag worden aangemerkt.

De referentie en het uit V/A berekende R worden herkenbaar getoond.
Een voorwaardelijk V/R/A-voorstel gebruikt de huidige appgeometrie, maar
wordt nooit als gemeten waarde opgeslagen. Geen geldig voorstel betekent
niet dat een geldige losse waarneming verloren moet gaan.

De huidige tool verzamelt waarnemingen. Een toepassing/goedkeuring vanuit
het log en een automatische openbare JSON-export zijn nog niet gebouwd.
De huidige spoor-editor blijft apart. Ruwe metingen worden nooit vanzelf
actieve of openbare spoorgegevens.

## Meetcontrole

Config → **LKL · meten en beslissen** inventariseert de geopende werkbasis,
per tafel/patroon, met optioneel parallellen. Er is een directe knop naar
Mijn spoor zonder berekende voorstellen in het invoerveld te zetten.
Een ontbrekende meetvlag bewijst niet dat Kruin nooit heeft gemeten:
bevestig de bron of meet opnieuw. Gekoppelde V-waarden en Nek mogen worden
afgeleid. Het huidige Been eindigt vóór de volgende band; Been A wordt niet
ten onrechte als ontbrekende meting gevraagd.

De controle draait lokaal op het geopende werkbestand. Een uitgebreid
extern auditbestand wordt niet openbaar gepubliceerd. Verschillen tussen
een opgegeven R en V/A vragen ook controle van de meetprecisie; de grens
0,5 stip is een inventarisgrens, geen bewijs dat een meting fysiek fout is.

## Uitgangspunt en fasering

U kiest aan het begin van de Meetbasis eerst Klein/Groot voor de eigen tafel
en bevestigt benedenacquit 0. Die keuze wordt afzonderlijk bewaard; zij maakt
van de cursusreferentie geen eigen meting. Andere oorsprongen zijn nog niet
ondersteund. Kruin vindt de huidige referentie bij Config.
De introductie bouwt één tafel op: 0, W, W+1, P, P+1; de andere tafel is een
afzonderlijke vervolgstap. Aankomsten op ZUID heeft Bekijken, Vergelijken en
Uitleg, zodat niet alle controls en berekeningen tegelijk verschijnen.

## Later: U

U leest de vrijgegeven Kruin-JSON en bewaart eigen tafelmetingen afzonderlijk
in een eigen JSON. U schrijft niet in de Kruin-database. Deze versie biedt U
nog geen Mijn spoor-knop. Database en JSON krijgen dezelfde begrippen en
expliciete formaatversies. Een nieuwe Kruin-publicatie mag eigen waarden
niet overschrijven.

## Verificatie

`KRUIN_TEST_DB=/pad/naar/wegwerpkopie.sqlite3 node mijn-spoor-controle-v208.cjs`
controleert mobiel staand/liggend en desktop: concepten, A/R los bewaren,
herladen van SQLite, idempotentie, validatie, onderbroken opslag, alle
bestaande SQL-tabellen/instellingen en een GitHub-simulatie. Deze controle
schrijft nooit naar de echte private GitHub-database.
