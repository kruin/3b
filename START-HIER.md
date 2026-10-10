Voor v206: zie [WIJZIGINGEN-v206.md](WIJZIGINGEN-v206.md). Publiceer_3B.bat bereidt Node/Playwright/Chromium automatisch voor.

# Actuele werkwijze v206

Voor Kruinbeheer: start Bekijk_Kruinconfig in de private map. Het SQLite-beheerblad
is de ingang; Kruinconfig.sqlite3 bevat de losse waarden en menu-indeling.
Bewaar in SQLite, controleer op de tafel en vernieuw een al geopende controletafel.
XLSX/ODS zijn alleen archiefkopieën en worden niet meer gelezen.
Zie HANDLEIDING-KRUIN.md in de private map voor migratie, direct SQL en publicatie.

Voor gewone gebruikers: gebruik de tafel, Cursus en Mijn tafel zoals beschreven
in HANDLEIDING-GEBRUIKER.md. Eigen tafels en oudere bases blijven behouden.


## Bandballen · V/A

Kies Menu → Weergave → Bandballen · V/A. Deze weergave toont bandballen met
korte V/A-lijnen, zonder de volledige banen of uitlooplijnen. Iedere korte lijn
begint op de stiplijn, loopt door het balmiddelpunt en gaat standaard 5 cm verder.
De V/A-waarde staat leesbaar op het stuk tussen stiplijn en bal. De speelbal
in het veld wordt in deze weergave weggelaten. Patroonlengte en herkomst blijven
leidend: geen aankomstbal voorbij het einde van het patroon.

Tik op een korte lijn of bandbal om de lijneditor te openen. Onder Bandballen
kun je de verlenging voorbij het balmiddelpunt voor V en A apart instellen
(0–30 cm). Dit wordt direct lokaal bewaard per tafel, spoor/stand en lijn.
Bij Neus is alleen A een bandpunt. De configuratie wijzigt geen spoorwaarden.
De bandballen blijven sleepbaar; na slepen opent de normale override-editor.
Kies Heel spoor om de normale banen weer te zien.

De extra rij Sporen / HALF NEGEN / NEGEN is verwijderd. Beide sporen blijven
beschikbaar in de gewone spoorkeuze. Het keuzemenu ligt boven de bandbediening;
de knop Parallel (P) kan geen menuveld meer bedekken.
