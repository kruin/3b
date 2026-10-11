# Actuele werkwijze v208

Voor Kruinbeheer: start Bekijk_Kruinconfig in de private map. Het SQLite-beheerblad
is de ingang; Kruinconfig.sqlite3 bevat de losse waarden en menu-indeling.
Bewaar in SQLite, controleer op de tafel en vernieuw een al geopende controletafel.
XLSX/ODS zijn alleen archiefkopieën en worden niet meer gelezen.
Zie HANDLEIDING-KRUIN.md in de private map voor migratie, direct SQL en publicatie.

Voor gewone gebruikers: gebruik de tafel, Cursus en Mijn tafel zoals beschreven
in HANDLEIDING-GEBRUIKER.md. Eigen tafels en oudere bases blijven behouden.

## Experimenteren, behouden en terugzetten

Elke verplaatsing maakt één stap in de sessiegeschiedenis. **Undo** en **Opnieuw**
blijven werken wanneer je een ander spoor kiest en na vernieuwen van dezelfde
browsertab. **Verwerp experiment** herstelt de volledige stand van vóór het
lopende experiment, inclusief berekende waarden, herkomst, bandkeuzes en
parallelvarianten. **Sessiestart** herstelt de stand waarmee deze tab begon; ook
dat herstel is met Undo terug te draaien.

Een punt mag tijdens slepen doorlopen naar de volgende band wanneer die band in
de route van de lijn is toegestaan. Zou een verplaatsing een bestaande lijn
ontekenbaar maken, dan houdt de app de laatste tekenbare stand vast. Dit geldt
voor alle bewerkbare V- en A-punten, op beide tafels en in beide richtingen.

**Behouden** sluit het huidige experiment af in de lokale werkstand. In het
private beheer legt alleen **Bewaar in database** de getoonde waarden vast in
SQLite. Undo na zo'n databasebewaring herstelt eerst de werkstand; gebruik daarna
opnieuw **Bewaar in database** om ook SQLite op die herstelde stand te zetten.
