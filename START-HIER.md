# 3B — start hier

Deze map bevat zowel de openbare 3B-app als de lokale hulpmiddelen voor Kruin.
Pak een download altijd **volledig uit** voordat je een BAT-bestand start.

## Welke startknop gebruik ik?

| Bestand | Voor wie? | Doel |
|---|---|---|
| `Edit_Uitleg.bat` | Kruin | Opent meteen de editor voor cursus- en uitlegkaarten. |
| `Open_KruinLines.bat` | Kruin | Opent het beheer van lijnen en standaard-stipwaarden. |
| `Open_3B.bat` | Kruin/tester | Opent dezelfde alleen-lezen klantweergave als de openbare website. |
| `Publiceer_3B.bat` | Kruin | Controleert, commit en publiceert een bewuste nieuwe release via GitHub. |

## Kruin — uitleg en cursus bewerken

1. Dubbelklik op `Edit_Uitleg.bat`.
2. Kies een bestaande kaart of klik **+ Nieuwe kaart**.
3. Vul level, kaartsoort, tafel, lijn, zichtbare delen en beide talen in.
4. Klik **Bewaar kaart**. Dit bewaart de werkwijziging alleen in deze browser.
5. Klik **Voorbeeld** om de kaart in de carrousel te controleren.
6. Klik na het werk op **Download uitleg-JSON**.

De uitleg-JSON is een reservekop en overdrachtsbestand. Downloaden publiceert
niets. Geef dit bestand samen met de nieuwste 3B-ZIP aan ChatGPT om de kaarten
bewust in een volgende openbare release te laten opnemen.

### Gemeenschappelijk of tafelspecifiek?

- **Gemeenschappelijk — Groot + Klein:** algemene uitleg over het systeem.
- **Lijn + één tafel:** uitleg over een concrete lijn, bijvoorbeeld VIJF op
  Groot of VIJF op Klein. Zo'n kaart hoort altijd bij één tafel en bewaart een
  momentopname van de betreffende KruinLine.

## Kruin — standaard-stipwaarden beheren

1. Dubbelklik op `Open_KruinLines.bat`.
2. Kies Groot of Klein en kies de lijn.
3. Open zo nodig **Alle delen**.
4. Wijzig A en V via een bandbal, de invoervelden of de stapknoppen.
5. Controleer de volledige lijn en keur gecontroleerde waarden goed met **OK**.
6. Klik **Freeze** om een lokale KruinLine en JSON-bestand te maken.

Een Freeze of JSON-download verandert de openbare standaard nog niet. Laat de
gecontroleerde KruinLine bewust in de volgende bronconfiguratie opnemen.

## Kruin — controleren en publiceren

1. Start `Open_3B.bat`.
2. Controleer de gewone klantweergave zonder eigenaarsknoppen.
3. Kies in de Kruin-werkomgeving **Klant mobiel testen** om de gepubliceerde
   klantinhoud in een mobiel scherm te bekijken. Conceptuitleg en
   eigenaarsfuncties zijn in deze preview verborgen.
4. Controleer Groot, Klein, West, Oost, lijnen en uitleg.
5. Kies **Stop klanttest** om terug te keren.
6. Start pas daarna `Publiceer_3B.bat`.

De publicatie-BAT controleert versie-assets, Git-remote, commit, GitHub Pages
en de gepubliceerde release. Een fout wordt zichtbaar gemeld.

## Wat doet `.gitignore`?

Git bewaart de openbare app, documentatie en BAT-starters. Lokale werkexports
worden niet per ongeluk gepubliceerd. Genegeerd worden onder meer Mijn tafels,
MyLines, lokale KruinLines, uitleg-JSON, SVG-downloads, ZIP's en reservekopieën.

Een JSON die openbaar moet worden, moet eerst bewust in de bronconfiguratie
worden verwerkt. Alleen het losse bestand in de projectmap zetten is niet
voldoende.

## Klant — 3B gebruiken

Klanten openen `https://kruin.github.io/3b/`. Zij kunnen een tafel, lijn,
richting en route kiezen, een KruinLine als werkkopie installeren, hun eigen
MyLines bewaren, Mijn tafels downloaden en de gepubliceerde uitleg bekijken.

Klanten kunnen gepubliceerde KruinLines en uitlegkaarten niet wijzigen. Vanuit
de app kunnen zij ook niet rechtstreeks naar GitHub publiceren.

## Lokaal, gedownload of gepubliceerd?

| Toestand | Betekenis |
|---|---|
| Lokaal bewaard | Staat alleen in de huidige browser op dit apparaat. |
| JSON gedownload | Er is een reservekop; de openbare app is niet veranderd. |
| In bronconfiguratie opgenomen | De inhoud zit klaar in een nieuwe release. |
| Gepubliceerd | De gecontroleerde release staat via GitHub Pages online. |
