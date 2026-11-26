# Een eigen cursus per patroon

**VIJF is de hoofdcursus.** VIER, ZES, ZEVEN en ACHT hebben elk een eigen cursusroute. Via de knop Cursus kies je het patroon en zie je alleen de hoofdstukken die daarbij horen. Het hoofdscherm neemt dat patroon meteen over, inclusief de patroonkeuze en het spoorlabel. Naar tafel en terug naar de les behouden dezelfde keuze.

- [Cursus VIJF](../?cursus=inhoud&leerspoor=VIJF#owner=user)
- [Cursus VIER](../?cursus=inhoud&leerspoor=VIER#owner=user)
- [Cursus ZES](../?cursus=inhoud&leerspoor=ZES#owner=user)
- [Cursus ZEVEN](../?cursus=inhoud&leerspoor=ZEVEN#owner=user)
- [Cursus ACHT](../?cursus=inhoud&leerspoor=ACHT#owner=user)

## VIJF

H1 bevat VIJF lijn na lijn, Rood op de Romp en het Karkas van VIJF. Het extra ZES-voorbeeld is uit deze leerroute gehaald. Vóór H1 staat het zelfstandige onderdeel Lijnen · V, R en A, inclusief zelf meten en R op Noord als meetanker. H2 gebruikt de parallellen en Neus van VIJF. Aankomsten op ZUID staat na H2 als eigen onderdeel met detailbeelden per spoor. De korte uitstapjes naar VIER, ZES, ZEVEN en ACHT zijn vervangen door de eigen cursussen. H3 beperkt de correctiekeuze tot de VIJF-familie. H4 vergelijkt bij VIJF Kop A 19 op Klein met 15 op Groot.

De volgende stap aan het einde van een VIJF-hoofdstuk blijft binnen deze cursus. H4 loopt dus niet door naar ACHT. De voortgang wordt per cursus apart bewaard.

## VIER, ZES, ZEVEN en ACHT

Elke cursus begint bij de eigen Neus, Romp en het Kruis, met de beschikbare brongegevens en hun meetstatus. Een ontbrekende lijn krijgt een melding. Een berekende of oudere referentie wordt niet als bevestigde meting gepresenteerd.

De Neusles gebruikt het gekozen patroon. Kort, midden en lang blijven indicatieve afstandsvoorbeelden.

- **VIER:** het bestaande BUBI-voorbeeld VIER−1 staat hier.
- **ZES:** de bestaande Neus- en correctievoorbeelden staan hier.
- **ZEVEN:** het bestaande BIBU-voorbeeld ZEVEN+1 staat hier.
- **ACHT:** H4 bevat Romp V 45/48, nieuw laken 43 als apart geval en de voorbereide aanvulling uit Mister 100.

## Kruis-zones en BIBU blijven bij het betreffende patroon

Kruin kiest voor toepassingen onder de betreffende patrooncursussen, niet voor een aparte cursus Sporen vergelijken.

De bestaande Kruis-zonevoorbeelden zijn gekoppeld aan de patronen die erin voorkomen als Romp- of Kruis-oplossing:

- Romp VIJF × Kruis ACHT: bij VIJF en ACHT.
- Romp VIJF × Kruis ZEVEN: bij VIJF en ZEVEN.
- Romp VIJF−1 × Kruis ZES: bij VIJF en ZES.

In zulke toepassingen kunnen alternatieve patronen zichtbaar zijn: ze zijn onderdeel van de oplossing bij dat voorbeeld. De vrije verplaatsing van Rood en het zoeken naar alternatieven blijven behouden. De hoofdlessen en automatische lesvolgorde blijven bij het gekozen patroon.

BIBU/BUBI is beschikbaar bij de eigen bestaande voorbeelden VIER en ZEVEN. De algemene Waaierintroductie en Namen staan apart onder Algemene basis en namen. Via bal 2 blijft onder Later bij VIJF.

## Bestaande links

Oudere directe links naar ACHT, de ZES-Neusles en de korte patroonvoorbeelden blijven bruikbaar en openen de eigen cursus. Nieuwe links gebruiken `leerspoor=VIJF`, `leerspoor=ZES` enzovoort om de cursus expliciet aan te geven.

## Controle

`CHROMIUM_PATH=/usr/bin/chromium node test3b/patrooncursussen-controle-v208.js` controleert de leerpaden op desktop en telefoon, de eigen geometrie, de verdeling van Kruis-zones/BIBU, oude links, voortgang en het behoud van meetgegevens.

De afzonderlijke H4-controles blijven:

- `klein-groot-controle-v208.js`: VIJF 19/15.
- `acht-klein-groot-controle-v208.js`: ACHT 45/48 en nieuw laken 43 apart.

`CHROMIUM_PATH=/usr/bin/chromium node test3b/cursus-hoofdscherm-controle-v208.js` controleert de echte cursuskeuzeklikken voor alle vijf patronen, de hoofdschermselectie, terugkeer vanuit de les, herladen en behoud van meetgegevens op desktop en telefoon.

## Lijnen en ZUID

Alle patrooncursussen hebben de zelfstandige onderdelen [Lijnen · V, R en A](lijnen-vra.md) en [Aankomsten op ZUID](aankomsten-zuid.md). De voorbeelden gebruiken hun eigen bronwaarden. Meetsysteem is teruggebracht tot de algemene meetvolgorde; specifieke uitleg staat in de eigen cursus.

Controle: `CHROMIUM_PATH=/usr/bin/chromium node test3b/lijnen-zuid-controle-v208.js`.

## Navigatie vanaf v208-r127

Cursus gebruikt Les-nummers en start bij Waaier en Parallel. Verder met mijn les hervat de bewaarde stap. De H-hoofdstukken staan afzonderlijk onder Uitleg; daar staan Meetsysteem, Lijnen · V/R/A en Namen. De praktische meetles komt na VIJF lijn na lijn: Neus A, Kop A, Romp V/A, aankomst controleren en het eigen tafelbestand bewaren. Daarna VIJF+1 en VIJF−1; ZES blijft een eigen cursus.

## Eerst resultaten zien, daarna Zelf · v208-r128

Zelf meten komt na Aankomsten op ZUID. U ziet eerst Kruins meetresultaten en de aankomstballen van het hoofdspoor en de parallellen. Pas daarna volgt eigen meetinvoer, spoor voor spoor. De verkorte vierbander komt later als eigen cursusonderdeel met meetresultaten; er staat al een technische basis voor vertrek vanaf Kop en indicatieve correctie. Andere meetresultaten kunnen later op dezelfde manier vóór Zelf worden toegevoegd. Er worden nu geen nieuwe geometrie of meetwaarden toegevoegd.

Bij Zelf · LKL wordt het belang van precieze Kop A opnieuw uitgelegd: de bekende Neus-bandbal op West en Romp-bandbal op Oost bepalen het tussenstuk via Noord niet. Een fout in Kop A maakt de berekende Kop en Nek onbetrouwbaar, ook als Neus en Romp kloppen. Kruins waarde geldt voor zijn tafel; U meet op de eigen tafel. Tijdens de stoot snel én precies registreren blijft het meetprobleem; profielmal volgt.

## Later: verschil LKL / 6–7-bander · VIER apart

De uitleg van het verschil komt later. VIER is daarbij een bijzonder geval en krijgt een eigen voorbeeld en toelichting. Houd rekening met de eigen bandvolgorde en het eindpunt; de Romp van VIER kan Zuid overslaan. Neem regels voor andere sporen niet automatisch over. De huidige Zelf-les blijft bij jouw gekozen LKL-patroon en de daarvoor beschikbare meetresultaten.

## Karkas staat bij Uitleg · v208-r130

Karkas is uit de cursusvolgorde gehaald. De uitleg, voorbeelden, directe links en begripslinks blijven beschikbaar onder Uitleg → H1. De lessen na Romp en Neus lopen verder met De Parallel van VIJF. Lesnummers schuiven mee; opgeslagen voortgang gebruikt interne les-ID’s. Wie bij Karkas was gebleven gaat verder bij Parallel; de oorspronkelijke voortgang krijgt eerst een lokale reservekopie met Nederlandse datum/tijd, tafel, spoor en versie. Meetgegevens veranderen niet.

Mogelijke volgende vereenvoudigingen, nog niet uitgevoerd: Vergelijk Klein/Groot, uitgebreide Neusvarianten en BIBU/BUBI als verdieping onder Uitleg. Concrete oefeningen in waarnemen, kiezen en uitvoeren blijven in de cursus.
