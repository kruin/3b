# 3B — handleiding voor de gebruiker

Geldig voor versie 108.

## Aankomsten vergelijken

Kies centraal **−S+** of **Waaier** en daarna bij **Weergave** de keuze
**Aankomsten**. Stap met de lijnbediening door Neus, Kop, Nek, Romp en de
volgende lijnen. Bij −S+ verschijnen de aankomstballen van de parallelsporen.
Bij Waaier verschijnen het basisspoor, de HALF-stand en het volgende spoor.

Op Klein vormen de Romp-aankomsten S−2 tot en met S+2 op band 4 (Zuid) een
rij exact aansluitende ballen: **Alle ballen verzamelen!**

## 1. Beginnen

Open `https://kruin.github.io/3b/`. Een nieuwe gebruiker begint bij de cursus.
De eerste vraag is: **op welk spoor ligt mijn doelbal?** Er kunnen meerdere
sporen bruikbaar zijn. Bij langere lijnen moet de speelbal rollend bij de
eerste band aankomen.

Een terugkerende gebruiker ziet **Start! →**. Tik of klik daarop om de tafel te
gebruiken. Kijken is openbaar. E-mailaanmelding en accountopslag zijn voorbereid,
maar nog niet geactiveerd; gebruik voorlopig lokale opslag en een JSON-reservekop.

## 2. Begrippen

- **Spoor**: de volledige baan, bijvoorbeeld Spoor VIJF.
- **Lijn**: één gekleurd deel van een spoor.
- **V**: vertrekwaarde van een lijn.
- **A**: aankomstwaarde van een lijn.
- **Stiplijn**: de meetlijn langs een band die de stippen verbindt. De bandrand is niet de meetlijn.
- **Kruinreferentie**: de meegeleverde uitgangswaarde. Een eigen aanpassing verandert deze niet.

De lijnvolgorde is Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen.

## 3. Tafel kiezen

Open het centrale menu op de tafel en kies Groot, Klein of Vergelijkend, het
gewenste spoor en de reeks Waaier of −S+. Na een keuze sluit het menu zodra je
de tafel aanraakt. Tik op een leeg tafeldeel voor fullscreen.

## 4. Een lijn aanpassen

1. Kies tafel en spoor.
2. Raak de eerste lijnhelft aan om **V** te activeren.
3. Raak de tweede lijnhelft aan om **A** te activeren.
4. Precies rond het midden wordt niets gekozen.
5. Sleep de actieve bandbal of gebruik `−1` en `+1`.
6. De bediening vermeldt lijn, V/A, band en actuele waarde.
7. Kies **Klaar · bewaar**.

Standaard zijn Kop, Romp en Been aanpasbaar. De andere delen volgen via de
ketenregels. Controleer berekende waarden aan de tafel.

### Voorbeeld: eigen Romp op Klein · VIJF

De Kruinreferentie is `O20 → Z38`. Vind je zelf `O22 → Z36`:

1. raak de eerste helft van Romp aan en verhoog V van 20 naar 22;
2. raak de tweede helft aan en verlaag A van 38 naar 36;
3. kies **Klaar · bewaar**.

Je eigen `22–36` blijft lokaal bewaard. Kruins `20–38` blijft intact.
Vanaf versie 108 krijgt een met **Klaar · bewaar** bevestigde waarde expliciet
de herkomst *eigen gebruiker*. Een volgende release kan haar daardoor van een
oude foutieve berekening onderscheiden.

## 5. Kleuren en bewaren

- **Berekend**: automatisch afgeleid en nog te controleren.
- **Bewerkt**: handmatig gewijzigd.
- **Goedgekeurd**: met **Klaar · bewaar** bevestigd.

Maak regelmatig een reservekop via **Mijn tafels**. Gebruik **Import** om deze
JSON later terug te zetten. Browseropslag is apparaat- en browsergebonden.

## 6. Waaier en −S+

- Waaier bevat de hele en HALFsporen.
- −S+ bevat parallelle sporen rond het basisspoor.
- De dunne lijn toont het basisspoor als vaste referentie.
- Statisch toont het hele spoor; Lijn voor lijn vergelijkt één lijn tegelijk.
- Terug naar basisspoor verwijdert de −/+verschuiving.

## 7. Cursus, duimpje en privacy

Open **Cursus** vanuit de centrale bediening. De cursus begint bij de doelbal
en bouwt daarna verder naar de eigen positie en uitvoering.

De barbon verschijnt uitsluitend na een tik op 👍. Bij €0 sluit hij stil.
Wanneer sessieregistratie wordt geactiveerd, bewaart 3B alleen sessiestart en
sessielengte. Persoonlijke tafelwaarden blijven privé.

## 8. Problemen oplossen

- Verkeerd spoor: kies opnieuw het basisspoor in het centrale menu.
- Waarde reageert niet: raak duidelijk de eerste of tweede lijnhelft aan.
- Oude waarde: gebruik **Herstel lijn + tafel** of importeer je reservekop.
- Gebruikers publiceren niet; meld publicatieproblemen aan Kruin.
