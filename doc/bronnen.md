# 3B · bronnen en afspraken v181

App v181 · cursus 1.2 · bijgewerkt 2 oktober 2026.

## Projectafspraken van 2 oktober 2026

Primaire bron: de instructies en bevestigingen van Kruin in dit gesprek.
De nieuwste correctie gaat vóór oudere voorstellen.

| Onderwerp | Bronstatus | Verwerking |
|---|---|---|
| Nieuw karkas = nieuw patroon | Vastgelegde projectafspraak | Neus–Been afzonderlijk; geen LKL-waarden overnemen |
| Eerst Neus–Been, daarna Kop/Nek/Romp/Kruis | Onderzoekswerkwijze van Kruin | Meetplan en cursus, geen verzonnen aankomsten |
| Been/Hiel buiten praktische scope | Observatie van Kruin | Optioneel vervolg; geen gegarandeerde reikwijdte |
| Bal 2 exact passeren | Vereiste van Kruin voor betreffende stoten | Positie, segment, kant en vrije ruimte meten |
| Eén band overslaan: contra / kerend effect | Bevestigde routeafspraak | Loop uit route, handmatig overschrijfbaar |
| Meer dan één band tegelijk overslaan | Expliciet uitgesloten | Geen nieuwe regels daarvoor |
| Kruis-aankomstbandkeuze op geselecteerde P-sporen | Voorlopige testafspraak | VIJF +1/+2/+3, VIER P/+1/+2/−1/−2 |
| Alle waarden en Kruisloop blijven aanpasbaar | Expliciete correctie van Kruin | Ge-edit en Auto behouden |

## Kruisgeometrie

Primaire technische bron: `app-v181.js`, functies
`applyConfiguredCrossFromBody`, `diamondValueThroughBall`, `point` en `bandBall`.
De constructie gebruikt tan(hoek) vanaf horizontaal; West wordt genummerd van
0 onder naar 80 boven in de basisrichting. Bij een gelijk Romp-anker stijgt
Kruis A op West bij 46° ten opzichte van 45°, binnen het geldige bereik.
Dit wordt numeriek getest op beide tafels en beide spiegelrichtingen.
De nummering en spiegeling staan in de app; de database bevat één richting.

## Tafelmetingen

Bron: door Kruin aangeleverde metingen en de bestaande SQLite-basis.
VIJF Kop A Klein 19 en Groot 15 zijn Kruin-tafelreferenties. Niet bewezen
universeel voor andere tafels, snelheden of het nieuwe Neus–Been-karkas.
Oude openbare v172–v180-bases blijven integraal en onveranderd bewaard.

## Wat geen meetbron is

De geometrische simulatie is geen snelheids-/effectmodel. De verwachting dat
harder stoten vroegere aankomsten verandert wordt als onderzoeksvraag bewaard;
geen ongevalideerde correctie wordt ingevoerd. Neus–Been heeft nog geen
meetdataset. De cursusillustraties van LKL tonen geen getest Neus–Been-spoor.

## Versiebestanden en controle

- Config en cursus: `../config-v181.js` (cursus 1.2).
- Geometrie en gebruikersbediening: `../app-v181.js`.
- Publicatiebronwaarden: `../kruinwaarden-generated-v181.js`.
- Private bron: `Kruinconfig.sqlite3`, `Kruin_database.py` en `SQLite-beheer.html`.
- Projectgeheugen: `projectgeheugen.md` en `PROJECTGEHEUGEN-v181.md` in de ZIP.
- Volledige cursus in tekst: `CURSUS-v181.md` in de ZIP.
- Controles en beperkingen: `CONTROLE-v181.txt` in de ZIP.
- De aangeleverde afbeelding van het Kruisbeheer staat ongewijzigd in de
  private map `bronnen/Kruisbeheer-v180.png` als historische UI-bron.

Geen externe literatuurstudie is uitgevoerd voor deze release. Projectafspraken,
tafelmetingen en programmaconstructies zijn hierboven apart benoemd.
