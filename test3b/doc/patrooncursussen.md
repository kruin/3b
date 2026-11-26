# Een eigen cursus per patroon

**VIJF is de hoofdcursus.** VIER, ZES, ZEVEN en ACHT hebben elk een eigen cursusroute. Via de knop Cursus kies je het patroon en zie je alleen de hoofdstukken die daarbij horen. Het hoofdscherm neemt dat patroon meteen over, inclusief de patroonkeuze en het spoorlabel. Naar tafel en terug naar de les behouden dezelfde keuze.

- [Cursus VIJF](https://kruin.github.io/3b/?cursus=inhoud&leerspoor=VIJF#owner=user)
- [Cursus VIER](https://kruin.github.io/3b/?cursus=inhoud&leerspoor=VIER#owner=user)
- [Cursus ZES](https://kruin.github.io/3b/?cursus=inhoud&leerspoor=ZES#owner=user)
- [Cursus ZEVEN](https://kruin.github.io/3b/?cursus=inhoud&leerspoor=ZEVEN#owner=user)
- [Cursus ACHT](https://kruin.github.io/3b/?cursus=inhoud&leerspoor=ACHT#owner=user)

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
