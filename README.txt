TAFEL LIJNCONFIGURATOR
=====================

Online gebruiken
----------------
Open de GitHub Pages-link die de beheerder verstrekt. De app werkt op desktop,
tablet en mobiel. Iedere gebruiker bewaart de eigen invoer lokaal in de eigen
browser; de invoer wordt niet naar GitHub verstuurd.

Starten
-------
Dubbelklik op Open_TAFEL.bat of rechtstreeks op index.html. De app werkt lokaal
en heeft geen installatie, Python of internetverbinding nodig.

Gebruik
-------
1. Kies Klein of Groot.
2. Kies VIJF t/m TWAALF.
3. Vul voor iedere lijn vertrekband/-waarde (V) en aankomstband/-waarde (A) in.
4. De tekening verandert onmiddellijk.

De neuslijn vertrekt altijd vanuit Z. Stipwaarden lopen op west/oost van 0–80
en op noord/zuid van 0–40. De vier stiplijnen liggen 9,5 cm buiten de bandrand.
Bij keuze “Naar oost — gespiegeld” spiegelen de lijnen en de nummeringen op alle
vier stiplijnen samen.
Onderaan staat het actieve releasenummer. Dit moet na publicatie overeenkomen
met `VERSIE.txt`.

Bewaren
-------
Invoer wordt automatisch in de browser opgeslagen. Gebruik “Config” om een
JSON-reservekop te downloaden en “Importeer” om die later terug te zetten.
Gebruik “SVG” om de huidige tekening te downloaden.

Let op: lokale browsergegevens zijn per apparaat en per browser gescheiden.
Maak daarom geregeld een JSON-reservekop. Gebruik export en import om dezelfde
configuratie op een ander apparaat te openen.

Inhoud
------
- VIJF bevat de bestaande waarden als startconfig.
- ZES t/m TWAALF zijn leeg en worden niet automatisch berekend.
- Configuraties van Klein en Groot worden afzonderlijk opgeslagen.
- Er worden geen effect-, fysica- of ervaringscorrecties toegepast.

Documentatie
------------
- PUBLICEREN.md: instructie voor beheer en publicatie via GitHub Pages.
- Publiceer_Drieband.bat: maakt zo nodig branch main en plaatst de app via Git.
- KLANT-INSTRUCTIE.md: korte gebruiksinstructie voor klanten.
- PROJECTAFSPRAKEN.md: blijvende technische en functionele afspraken.
