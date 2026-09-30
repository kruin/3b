# 3B — handleiding voor de gebruiker

Geldig voor versie 170.

Open **U-config** om de persoonlijke tafelweergave te wijzigen. V/A-labels
kunnen klein, alleen bij de actieve bal of uit worden getoond. De bal en de
lijnen van en naar de stiplijn blijven zichtbaar. U-config wijzigt geen
Kruinwaarden.

De tafel staat Oost–West op desktop en in mobiel landschap. In mobiel portret
staat zij Noord–Zuid. De richting verandert alleen de schermweergave; de
spoorwaarden en sleepberekeningen blijven gelijk.

De tafel vult het volledige appvenster. Mobiel portret toont haar rechtop.
Mobiel landschap en desktop tonen dezelfde tafel dwars. De bediening staat op
de zichtbare houten banden; het groene laken blijft vrij:

- boven: `− Spoor +`;
- onder: `− Lijn +`;
- links: wissel tussen Waaier en Parallel (P);
- rechts: wissel tussen Groot, Klein en Vergelijk;
- linkerboven: Undo;
- rechterboven: menu;
- linkeronder: Herstel, na bevestiging;
- rechteronder: Bewaar.

Tik op het groene laken om een geopend menu te sluiten. Deze tik zet fullscreen
niet aan of uit. Raak voor het verschuiven de betreffende bandbal aan. Tik kort
op **S** om alle Waaier-Neuzen of Parallel-sporen als dunne referentielijnen
te tonen; de actieve route blijft breed en gelabeld.

Bij draaien van het toestel verhuist de bediening automatisch naar de nieuwe
zichtbare boven-, onder-, linker- en rechterband. De teksten blijven rechtop.

De meegeleverde Kruinreferenties worden door Kruin in een private Excel beheerd.
De openbare app ontvangt uitsluitend de waarden die nodig zijn om de sporen te
tekenen. Persoonlijke gebruikerswaarden blijven daarvan gescheiden en privé.

## Aankomsten vergelijken

Kies centraal **Parallel (P)** of **Waaier** en daarna bij **Weergave** de keuze
**Aankomsten**. Stap met de lijnbediening door Neus, Kop, Nek, Romp en de
volgende lijnen. Bij Parallel (P) verschijnen de aankomstballen van de parallelsporen.
Bij Waaier verschijnen het basisspoor, de HALF-stand en het volgende spoor.

De Aankomstenweergave toont uitsluitend de gekozen **basislijn** plus de
aankomstballen van de bijbehorende vergelijkingsstanden. Zij staan werkelijk
tegen de aankomstband en kunnen naast elkaar liggen, elkaar overlappen of uit
elkaar liggen. De weergave begint standaard bij **Romp**.

Op Klein vormen de Romp-aankomsten S−2 tot en met S+2 op band 4 (Zuid) een
rij exact aansluitende ballen: **Alle ballen verzamelen!**

## 1. Beginnen

Open `https://kruin.github.io/3b/`. Een nieuwe gebruiker begint bij de cursus.
De eerste vraag is: **op welk spoor ligt mijn doelbal?** Er kunnen meerdere
sporen bruikbaar zijn. Bij langere lijnen moet de speelbal rollend bij de
eerste band aankomen.

Een terugkerende gebruiker ziet **Start! →**. Tik of klik daarop om de tafel te
gebruiken. Kijken is openbaar. Beheer en gebruikersopslag lopen via account en
database. JSON-import en -export staan daarom niet meer in de gebruikersinterface.

## 2. Begrippen

- **Spoor**: de volledige baan, bijvoorbeeld Spoor VIJF.
- **Lijn**: één gekleurd deel van een spoor.
- **Basisspoor**: het hele spoor zonder HALF- of −/+verschuiving, bijvoorbeeld VIJF.
- **Waaier**: de overgang van een basisspoor naar het volgende spoor.
- **Waaierstand**: één gekozen stand in de Waaier, bijvoorbeeld VIJF, HALFZES of ZES.
- **HALF-stand**: de middelste waaierstand, precies tussen twee buursporen.
- **Parallel (P)**: de verzameling parallelstanden rond één basisspoor.
- **Parallelstand**: één stand uit Parallel (P), bijvoorbeeld VIJF−1 of VIJF+2.
- **Aankomstenweergave**: toont voor de gekozen lijn waar de bal in iedere waaier- of parallelstand aankomt.
- **V**: vertrekwaarde van een lijn.
- **A**: aankomstwaarde van een lijn.
- **Stiplijn**: de meetlijn langs een band die de stippen verbindt. De bandrand is niet de meetlijn.
- **Kruinreferentie**: de meegeleverde uitgangswaarde. Een eigen aanpassing verandert deze niet.

De lijnvolgorde is Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen.
Been had door de vorm ook Staart kunnen heten; de vaste naam blijft Been.
In de cursus heten **Been en Hiel samen de Uitloop**.

De standaardstoot is eerst geijkt op het uitrollen van bal 1 naar de middenzone
van het biljart. De Uitloop is later toegevoegd door de baan met handmatige
tafeltests en Kruinconfig via Been naar A-Hiel door te trekken. De Uitloop is
dus een geteste uitbreiding van het spoor; de middenzone blijft het eerste
ijkpunt.

### Spoor VIER

Bij Spoor VIER loopt Romp van **Oost naar West**. Kruis vertrekt uit dezelfde
bal aan de Westband en loopt met `− contra` naar de Zuidband. Daarna volgt de
Uitloop: Been + Hiel. De Kruishoek bepaalt de precieze aankomst van Kruis op
Zuid. De bandvolgorde van VIER wijkt hierdoor bewust af van die van VIJF.

Algemene regel: wanneer bal en lijn een band overslaan, ontstaat een ander
Karkas en schakelt de loopstand van mee naar contra, of bij een volgende
bandoverslag weer terug. De berekende stand blijft voor de volgende lijnen
gelden. Daarom schakelt VIER al bij Romp `Oost → West`; Kruis `West → Zuid`
erft de contra-stand. Bij VIJF volgt deze omschakeling pas bij Been
`West → Oost`.

Neus, Kop en Nek vormen de aanloop onder drie banden. Zij worden in de cursus
wel geïntroduceerd, maar niet als doelroute aangeboden. De routekeuze voor de
doelbal begint bij Romp (3 banden) en loopt verder via Kruis, Been, Hiel, Voet
en Teen.

## Kruinneus en Gebruikersneus

Kruin configureert per tafel en spoor een **Kruinneus** als referentie. De
gebruiker kan deze lokaal aanpassen; die aanpassing heet **Gebruikersneus**.
De Kruinreferentie wordt daardoor niet gewijzigd of gepubliceerd.

Laat bal 1 rollend aankomen op band 1. Strookt bal 1 niet met het gekozen spoor
van de doelbal, verander de richting van de Neus voorzichtig en speel meerdere
pogingen. Bij een korte Neus is de benodigde correctie doorgaans klein, terwijl
de gevolgen groot kunnen zijn. Bij een langere Neus kan een grotere correctie
nodig zijn. De cursus schrijft geen universele waarde voor: **speel en meet**.

Met **Herstel Kruinneus** wordt alleen de Neus van het huidige spoor en de
zichtbare tafel(s) teruggezet. Andere lokale lijnwaarden blijven behouden.

## Berekend vervolg na een aanpassing

### Verplichte eerste stap: Romp

Per spoor en per tafel moet de gebruiker eerst **V-Romp én A-Romp** aanpassen.
Klein en Groot hebben ieder een eigen Romp-kalibratie. Totdat beide waarden
zijn aangeleverd en het voorstel is aanvaard, blijft de rest van de tafel
alleen-lezen. Pas daarna zijn Neus en andere lijnpunten aanpasbaar.

De basisweergave toont daarom Neus en Romp. Vanuit die twee basislijnen
berekent 3B Kop en Nek, behalve waar de actuele Kruinconfiguratie daarvoor
expliciete handmatige waarden bevat. Vervolgens wordt ook Kruis en het verdere
spoor berekend.

Een bandbal is gedeeld: de aankomst van de ene lijn is het vertrek van de
volgende. Daarom beïnvloedt bijvoorbeeld **A-Kop +1** ook V-Nek en het verdere
verloop van het spoor. Na iedere wijziging toont 3B een **voorgesteld berekend
verloop** met alle afgeleide waarden vanaf die plaats.

- **Stem in · bewaar verloop** keurt de handmatige wijziging en het getoonde
  berekende vervolg samen goed.
- **Verwerp** herstelt de toestand van vóór de wijziging.
- De berekening gebruikt altijd de regels en ankers uit de actuele
  Kruinconfiguratie. Een toekomstige Kruinconfiguratie gebruikt automatisch
  dezelfde voorstel- en instemmingsstap.

## 3. Tafel kiezen

Open het centrale menu op de tafel en kies Groot, Klein of Vergelijkend, het
gewenste spoor en de reeks Waaier of Parallel (P). Na een keuze sluit het menu zodra je
de tafel aanraakt. Tik op een leeg tafeldeel voor fullscreen.

Op een echte telefoon gebruikt de tafel automatisch het volledige zichtbare scherm. Op desktop kunt u dezelfde smalle weergave controleren met **Klant mobiel testen** rechtsboven; dezelfde knop sluit de test weer.

### On-screen bediening

De bediening staat in vier gereserveerde zones rond de tafel:

- boven: huidig spoor of huidige lijn;
- links: vorige keuze;
- rechts: volgende keuze;
- onder: menu, schuifbediening en bewaren.

De middenzone is uitsluitend voor tafel, ballen, lijnen en stipwaarden. Knoppen
mogen deze zone niet overlappen. Wanneer een ondermenu of het berekende verloop
meer ruimte nodig heeft, wordt de tafelruimte kleiner; de bediening wordt nooit
over een stipwaarde gelegd.

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
Vanaf versie 151 krijgt een met **Klaar · bewaar** bevestigde waarde expliciet
de herkomst *eigen gebruiker*. Een volgende release kan haar daardoor van een
oude foutieve berekening onderscheiden.

## 5. Kleuren en bewaren

- **Berekend**: automatisch afgeleid en nog te controleren.
- **Bewerkt**: handmatig gewijzigd.
- **Goedgekeurd**: met **Klaar · bewaar** bevestigd.

Bevestigde wijzigingen worden via het account in de database bewaard. De
gebruikersinterface bevat geen afzonderlijke JSON-reservekop of JSON-import meer.

## 6. Waaier en Parallel (P)

- De **Waaier** bevat het basisspoor, de HALF-stand en het volgende spoor.
- Iedere keuze daarbinnen heet een **waaierstand**.
- **Parallel (P)** bevat parallelstanden rond het basisspoor.
- De paneelknoppen klappen niet rond: vóór VIER en na ACHT blijft de Waaier staan.
- Binnen Parallel (P) blijven −/+ bij hetzelfde basisspoor. VIJF loopt bijvoorbeeld van
  VIJF−2 tot VIJF+3; aan een grens wordt de betreffende knop uitgeschakeld.
- De dunne lijn toont het basisspoor als vaste referentie.
- Statisch toont het hele spoor; Lijn voor lijn vergelijkt één lijn tegelijk.
- Aankomsten toont alleen de gekozen basislijn plus de aankomstballen van alle vergelijkingsstanden.
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
# Karkas van een spoor

Het **Karkas** (*Framework*) bestaat uit Neus en Romp. Deze twee lijnen vormen
de eerste herkenbare basis van een LKL-spoor. Kies eerst het spoor en daarna
**Karkas** om alleen die twee lijnen te tonen.

Een spoor is bijvoorbeeld VIJF of ZES. Een lijn is een onderdeel van dat spoor.
LKL heet het patroon: de opeenvolging lang–kort–lang.

Tik op een lijn om haar waarden in het gekleurde lijnvenster te bekijken of te
wijzigen. Neus is de uitzondering: de Neus zelf ligt vast; alleen de
afstootlengte kan worden aangepast.

3B versie 170 · menu, posities en Nek
- Instellingen opent met muis en touch en blijft boven de bandbediening.
- Focus heet Start; vertreklabels gebruiken P/P+1/P−2 of W/W+2.
- Positiekleuren: Karkas oker, Kruin groen, Berekend rood, Bewerkt blauw.
- Kop/Nek wordt na het toepassen van variantankers opnieuw aangesloten.
- Eerder berekende opgeslagen varianten worden hersteld; eigen wijzigingen blijven behouden.
- Private Excel/ODS-bronwaarden uit v165 zijn ongewijzigd meegeleverd.

Versie 170: Lijn voor lijn toont automatisch de config van de gekozen lijn. Min/plus voor Lijn wisselt het configvenster mee. Bestaande bewerkingen worden geladen; gewijzigde waarden krijgen hun positiekleur. Neus toont alleen de afstootlengte.
