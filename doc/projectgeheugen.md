# 3B · projectgeheugen v181

Vastgelegd: 2 oktober 2026. App v181; cursus 1.2. Deze actuele afspraken zijn
leidend boven oudere voorstellen. Geen nieuwe Neus–Been-metingen zijn aangeleverd.

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
Kop A Noord, Nek A Oost, Romp A Zuid of West; Kruis A doorgaans West/Zuid;
Been A standaard Oost. Automatische V-banden volgen de vorige aankomstband.
Alle handmatige waarden blijven bewerkbaar en behouden bij herberekenen.
Auto laat opnieuw berekenen met voldoende bekende ankers.

Nummering start bij 0 en loopt met de bal mee (lange band 0–80, korte 0–40).
SQLite bewaart één basisrichting; spiegeling gebeurt in de app.
Kruin mat Kop A bij VIJF: Klein 19, Groot 15. Dit zijn tafelgebonden referenties,
geen algemene wet. Kop A bij voorkeur meten; een gekozen benadering blijft
herkenbaar. Nek V wordt vanuit de gedeelde bandbal berekend.

Herkomst: oker configuratie/karkas; groen Kruinwaarde/Kruinmeting/eigen meting;
rood berekend/benadering; blauw Ge-edit. Labels onderscheiden de categorieën.

## Beheer, bestanden en publicatie

SQLite is de zelfstandige private beheerbron, met beheerblad en directe SQL.
XLSX/ODS in archief-v178 zijn historisch, geen generatorinput. Mijn tafel blijft
voor gebruikers beschikbaar in de bestaande bestandsvormen. Gebruik een eigen
v179/v180-database door die vóór starten in de nieuwe private map te zetten;
bewaar de oude map als reservekopie. Publicatie is een afzonderlijke handeling.
De v172–v180-bases blijven onveranderd beschikbaar.

## Nog uit te werken

Eerste meetspoor voor KKL/KLK/Neus–Been; bijbehorende bandroute en ijkpunten;
verschillende stootwijzen als meetreeksen; exacte passage van bal 2.
Een eindpunt/doelband per stoot en automatische passagecontrole zijn voorstellen,
geen al geïmplementeerde functies. Echte browsertest van deze release staat open.
