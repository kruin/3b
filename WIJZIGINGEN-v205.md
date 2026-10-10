# v205 — handmatige waarden en overrides op de tafel

SQLite-beheer toont alleen vastgelegde Kruinwaarden, metingen en eigen edits.
Berekende uitkomsten, parallelverschuivingen en ongeijkte proefwaarden worden
niet in het waardenoverzicht getoond. Een handmatige nul blijft zichtbaar.
Het overzicht is alleen-lezen. Instellingen (zoals uitloop en Neuscorrectie)
blijven in het beheerblad te bewaren; dit wijzigt geen lijnpunten.

Tik op een lijn of op de lijnnaam op de tafel. Vertrek V en aankomst A kunnen
worden overschreven, inclusief berekende punten. Bij de Neus blijft V het
acquit; A en afstootlengte zijn bewerkbaar. Na een sleepactie opent hetzelfde
editvenster. In lijn-voor-lijn zijn aparte V/A-sleepgrepen beschikbaar.

Auto V / Auto A verwijdert die override en herstelt het oorspronkelijke punt
of de automatische berekening. De oorspronkelijke puntgegevens worden bij
een override bewaard, ook bij SQLite-opslag en opnieuw openen.
Bewaar in database schrijft vanuit de private tafel naar SQLite. Op de
openbare tafel is dit Bewaar lokaal. Sluiten sluit de voorvertoning; Undo
herstelt een eerdere werkstand. Na Auto ook bewaren om SQLite bij te werken.

Kruin-beheer: pak de volledige ZIP uit, start Bekijk_Kruinconfig.bat in de
private map en kies Bewerk op de tafel. Herlaad het beheerblad na tafelopslag.
Alle historische bases blijven ongewijzigd. Geen externe publicatie uitgevoerd.
De geïntegreerde browserinstaller uit v197 blijft aanwezig.

---

# 3B v205 — Neuscorrectie, 6–7-sporen en browserinstallatie

Geldig voor versie 197.

## Publiceren en testen met één batch

Start `Publiceer_3B.bat`. De batch controleert eerst de browserinstallatie.
Bij ontbrekende of te oude Node.js (onder 20) zet hij Node.js **24.21.0**
klaar in je gebruikersmap. Deze versie wordt voor de batch gebruikt; je bestaande
Node-installatie blijft beschikbaar voor andere projecten. Hiervoor is geen
beheerderinstallatie nodig. De officiële ZIP-download wordt met SHA256 gecontroleerd.

Daarna installeert hij zo nodig **Playwright 1.62.1** uit de package-lock en het
bijbehorende **Chromium**. npm gebruikt daarbij de geschikte Node-runtime.
Een losse npm-update is niet nodig. Dezelfde voorbereiding zit in
`Regressiecontrole_3B.bat`. `Installeer_Browsertests_3B.bat` blijft ook los bruikbaar.

Een installatie- of testfout stopt de batch vóór publiceren. Bij een volgende
start worden aanwezige onderdelen hergebruikt. Eerste installatie vereist internet.
Git moet aanwezig zijn voor publiceren; Python is nodig voor de private beheercontroles.

De Windows-BAT/PowerShell-volgorde en foutstops zijn gecontroleerd, evenals de
uitvoerbare Node-installatielogica. De Windows-bootstrap is hier niet op een
Windows-computer uitgevoerd. De browsercontroles zijn uitgevoerd in Chromium
op Linux, met desktop en touch-emulatie; geen fysieke telefoon of Safari.

## Kortere Neus: Romp als zichtbaar ijkpunt

Menu → **Korte Neus → Romp · proefcorrectie**. Instellingen gelden per tafel.
Klein begint met **+½ balbreedte per 10 cm kortere Neus** en **0°** hoekcorrectie.
Groot begint uitgeschakeld. De baldiameter is 6,15 cm: een halve bal is 3,075 cm.
Het positieve teken verschuift de Romp-aankomst richting hogere A-waarden op de
band; het negatieve teken de andere kant op. De Oost-weergave spiegelt dezelfde
correctie. Deze waarden zijn een meetvoorstel, geen vastgestelde biljartwet.

| Neus bij standaard 83 cm | Inkorting | Romp-verschuiving, proefstand |
|---|---:|---:|
| 93 cm | langer | 0 cm |
| 83 cm | 0 cm | 0 cm |
| 78 cm | 5 cm | 1,5375 cm |
| 73 cm | 10 cm | 3,075 cm |
| 63 cm | 20 cm | 6,15 cm |

Start met coefficient 0,5. Vergelijk daarna 0,25 en 1,0 als de meting daar reden
voor geeft. Test het teken met dezelfde afstootrichting, snelheid en effect.
De hoek staat eerst op nul: Romp blijft evenwijdig aan zijn standaardlijn.
Bij een zichtbaar richtingsverschil kun je ±0,25° per 10 cm proberen en daarna
±0,5°. Meet daarvoor zowel V als A van Romp; alleen A bepaalt nog geen richting.
Neus/Kop blijven referenties; Nek verbindt met de aangepaste Romp. Kruis, Been en
Hiel schuiven met de Romp mee en behouden hun aansluitingen. De hoekproef werkt
ook door in de volgende lijnen. Het blijft een geometrische proefcorrectie.

De eerste lengtewijziging bewaart de standaardbaan met de oorspronkelijke
metingen. Terug naar de standaardlengte, of de correctie uitzetten, herstelt die
waarden. Er ontstaat geen cumulatieve verschuiving bij herhaald korter/langer.
Gebruik **Huidige baan als standaard** nadat je de baan op jouw tafel hebt geijkt.
Een bewuste Romp-edit legt bij de volgende lengtewijziging een nieuw ijkpunt vast
bij de huidige Neuslengte. Undo/Opnieuw, Mijn tafel en SQLite-spooropslag bewaren
ook het ijkpunt en de proefinstellingen. Het beheerblad heeft dezelfde
Neuscorrectie-instellingen. Een nieuwe puntmeting in SQLite maakt de actuele
baan bij de huidige afstootlengte tot ijkpunt.

Proefgrens: maximaal 30 cm inkorting telt mee; verder inkorten vergroot de
correctie niet. Langere Neus heeft voorlopig coefficient 0. Deze grenzen en
langere-Neus-coefficienten staan in config/SQLite. Een Romp buiten het tafelbereik
wordt gemeld en de standaardbaan blijft zichtbaar.

## 6–7 van VIJF−2 tot NEGEN

Kies patroon **6–7 banden** en de gewenste spoorstand. Het is één patroon,
naast LKL en Vrij spel, met eigen records in SQLite. De VIJF-recordnaam uit v196
blijft behouden, zodat eigen 6–7-metingen niet verdwijnen.

| Basisspoor | Beschikbare standen |
|---|---|
| VIJF | −2, −1, basis, +1, +2, +3 |
| ZES | −2, −1, basis, +1, +2 |
| ZEVEN | −2, −1, basis, +1 |
| ACHT | −2, −1, basis |
| NEGEN | −2, −1, basis |

Dat zijn **21 standen**, elk voor Klein en Groot. De Neus gebruikt de
parallelstand; de verdere 6–7-baan heeft zelfstandige proefankers per stand.
Ze zijn rood als benadering aangegeven, niet als meting. Meetwaarden kunnen
ze in SQLite vervangen. Zeven lijnen tot het einde van Hiel plus standaard
**10 cm uitloop** (instelbaar). Karkas: Neus + Been. De eigen LKL-gegevens blijven
apart. Voor LKL blijven half Been, na contra kwart van de volgende lijn en
VIER kwart Been van kracht. Basislijnen blijven standaard uit op tafel en aan
in cursus; beide voorkeuren zijn afzonderlijk instelbaar.

## Bronnen voor installatie en meetcontext

- [Officiële Node.js 24-downloads](https://nodejs.org/download/release/latest-v24.x/)
- [Playwright-browserinstallatie](https://playwright.dev/docs/browsers)
- [Playwright-installatie in CI: package-lock en browser](https://playwright.dev/docs/ci-intro)
- [Mathavan, Jackson & Parkin (2010): cushion impacts](https://journals.sagepub.com/doi/10.1243/09544062JMES1964)

De laatste bron bespreekt de invloed van snelheid en spin op bandbotsingen;
zij onderbouwt niet de voorgestelde 0,5-bal-coefficient. Die moet jouw tafeltest bepalen.
