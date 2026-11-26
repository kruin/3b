# Kruin-meeteditie voor test

Bron: [Biljart klein en groot](https://docs.google.com/spreadsheets/d/1CKztHLnXb4BX_3fngsVrye9j1ynxPRpGB3YRG22J0xI/edit?usp=drive_link), rechtstreeks gelezen uit de gedeelde pagina's. De oorspronkelijke notaties staan in `kruin-sheet-bron.json`; `kruin-vergelijking.json` bewaart de vergelijking met de database vóór invoer. `kruin-wijzigingen.json` bevat de bevestigde wijzigingen.

## Tafels en patronen

- **Klein · ingespeeld** is standaard. Onder meer VIER Oost 5 → West 10 (sheet: 70), VIJF 20 → 38 en ACHT−1 met A 22.
- **Klein · nieuw laken** heeft eigen meetgegevens en eigen bewaarde gebruikerswijzigingen. De tafelafmetingen blijven 115 × 230 cm.
- **Groot · LKL / Raedthuys** gebruikt bij ZES A 28, bij ACHT V 48 en bij VIER West 10 (sheet: 70).
- **Felle afstoot** is afzonderlijk geregistreerd: groot, VIER, West 20 (sheet: 60). Romp V ontbreekt nog, dus er wordt geen volledig spoor verzonnen. In de configuratie staat deze meetnotitie bij het patroon.

## V, A, R en Lijn 5

V en A zijn de stipwaarden van een lijn. Het neerwaartse driehoekje betekent **R: raakpunt op de band**. R wordt afzonderlijk bewaard. Bij een gemeten Kop R berekent de app de Kop A uit die bandpositie, de echte aankomstbal van de Neus en de bestaande tafelgeometrie; het getal van R wordt niet rechtstreeks als A ingevoerd.

Klein-ingespeeld VIJF: de sheetnotitie R 37 blijft bewaard, evenals de oorspronkelijke A 40 in de bronopname. Kruin heeft voor de te gebruiken lijn uitdrukkelijk **V 20 → A 38** gekozen; die aanwijzing gaat voor.

**Lijn 5 (Kruis), kolom P** bevat aankomsten: L = lange band **Oost**, K = korte band **Noord**. In het tabblad nieuw laken staat dezelfde rubriek in kolom N. **VIJF → West 10** (laatste correctie van Kruin; de eerdere Oost-koppeling vervalt), ZES → Oost 5, ZEVEN → Oost 0, ACHT → Noord 0. De groot-waarden komen uit LKL GROOT; Raedthuys bevat daar geen ingevulde Lijn 5.

**Lijn 5 hoort ook bij het patroon 6–7 banden.** Die sporen hebben dezelfde lijnnaam en afzonderlijke V/A-velden. Kruin heeft bevestigd dat de geteste Lijn 5 ook hier geldt. Daarom worden de aankomsten van VIJF, ZES en ZEVEN overgenomen naar respectievelijk ZESZEVEN, ZESZEVEN_ZES en ZESZEVEN_ZEVEN, met bronverwijzing en bevestiging. Overige bestaande schatwaarden worden daarmee niet tot meting verklaard.

De specifieke bandcorrectie voor VIJF gaat voor de eerdere algemene interpretatie van L. Dezelfde correctie geldt voor de geteste VIJF-lijn die naar ZESZEVEN is overgenomen.

De Kruislijn wordt vanuit de echte aankomstbal van de Romp naar deze gemeten A opgebouwd. Een getekend schuin label in de sheet levert geen hoekmeting. De eerdere algemene 45°-regel wordt voor deze gemeten lijnen niet gebruikt. De sheet levert geen volgende aankomst voor Been; het oude vaste getal 10 wordt daarom voor deze sporen niet als nieuwe vervolgmeting gebruikt.

Ontbrekende of onzekere nieuwe waarden wissen geen bestaande Kruinreferentie. Zulke bewaarde referenties houden hun oorspronkelijke meetstatus; `retainedReferenceRevision` vermeldt de vorige basis. Waarden met vraagtekens worden niet afgerond of als bevestigde meting ingevoerd. West-Rompwaarden uit de sheet tellen vanaf Noord; de app telt op West vanaf Zuid. De import zet daarom uitsluitend deze bronwaarden om met **80 − sheetwaarde**. Zo wordt 70 → West 10, 75 → West 5, 80 → West 0 en 85 → West −5. De oorspronkelijke waarde en het nulpunt blijven in `sheetPoint` bewaard. Er zijn 16 profielmetingen gecorrigeerd; `westNumberingCorrections` somt ze op. Bestaande appwaarden, eigen metingen en de afzonderlijk bevestigde Kruis-aankomsten worden niet nogmaals omgekeerd.

Doorlopende projecties blijven behouden, inclusief −5 en −10. Als dezelfde gemeten lijn eerst de Zuidband raakt, berekent de weergave de aankomst op die eerste band uit de bestaande lijn en balmiddelpuntgeometrie. De oorspronkelijke West-projectie blijft in `projectionReference` staan; er wordt geen nieuwe meting of spiegelhoek verzonnen.

## Bronvermelding Duon

**A. Duon, _Modern Biljarten_, p. 27**, kleine tafel. De waarde **15** bij ZES op klein-nieuw is als afzonderlijke R-meting met deze bron opgeslagen.

## Database en opnieuw bouwen

`../kruin-meetgegevens-v208.sqlite3` bevat de volledige actuele basis, de vier meetprofielen en de oorspronkelijke broncellen. De actieve JavaScript-waarden en de SQLite-payload worden uit hetzelfde resultaat opgebouwd en op gelijkheid gecontroleerd. Historische SQLite-archieven en productie blijven ongewijzigd.

Vanuit de repository:

1. `python test3b/meetbron-lezen.py` ververst uitsluitend de bronopname via de gedeelde link.
2. `python test3b/meetgegevens-bijwerken.py` bouwt de bevestigde meeteditie en controleert SQLite-integriteit en gelijkheid met de JavaScript-waarden.
3. `CHROMIUM_PATH=/usr/bin/chromium node test3b/meetprofielen-controle-v208.js` controleert desktop en telefoon, V/A/R, Lijn 5, profielisolatie, herladen en fullscreen.

De tweede stap gebruikt het oorspronkelijke SQLite-archief alleen-lezen als basis. Nieuwe sheetwijzigingen moeten eerst inhoudelijk worden vergeleken; het script is geen blinde import van alle ingevulde cellen.

Bij het terughalen van een bewaarde tafelstand worden de gepubliceerde bronpunten opnieuw toegepast, met behoud van eigen wijzigingen. De QR-testlink gebruikt `meetprofiel=klein-ingespeeld`, zodat ook een telefoon die eerder Groot of nieuw laken toonde direct het bedoelde voorbeeld opent.

Controle West-nummering: `CHROMIUM_PATH=/usr/bin/chromium node test3b/west-nummering-controle-v208.js`. Deze controle toetst alle 16 omzettingen, behoud van bronwaarden, correcte bandwissels voor doorlopende projecties, SQLite-gelijkheid, weergave op desktop/telefoon, oudere bewaarde tafelstanden en het behoud van eigen metingen.
