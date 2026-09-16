# 3B — start hier

Deze map bevat zowel de openbare 3B-app als de lokale hulpmiddelen voor Kruin.
Pak een download altijd **volledig uit** voordat je een BAT-bestand start.

## Openbare ingangen

- **Main:** `https://kruin.github.io/3b/` — de klantapp.
- **Doc:** `https://kruin.github.io/3b/doc/` — uitleg voor klanten en Kruin.
- **Kruin mobiel:** `https://kruin.github.io/3b/#owner=kruin` — toont in de app
  de knop **Kruin**.

GitHub Pages publiceert vanuit branch `main`, map `/(root)`. De map `doc/`
wordt daardoor automatisch de tweede ingang; stel `/docs` niet als aparte
publicatiebron in.

## Welke startknop gebruik ik?

| Bestand | Voor wie? | Doel |
|---|---|---|
| `Kruin.bat` | Kruin op Windows | Opent één Kruin-menu voor alle bewerkingen en controles. |
| `Kruin.command` | Kruin op Mac | Opent hetzelfde Kruin-menu op macOS. |
| `Publiceer_3B.bat` | Kruin | Controleert, commit en publiceert een bewuste nieuwe release via GitHub. |

## Kruin — uitleg en cursus bewerken

1. Start `Kruin.bat` op Windows of `Kruin.command` op Mac en klik **Kruin**.
2. Kies **Uitleg bewerken** en daarna een bestaande of nieuwe kaart.
3. Vul level, kaartsoort, tafel, lijn, zichtbare delen en beide talen in.
4. Klik **Bewaar kaart**. Dit bewaart de werkwijziging alleen in deze browser.
5. Klik **Voorbeeld** om de kaart in de carrousel te controleren.
6. Klik na het werk op **Download uitleg-JSON**.

### Foto’s bij uitlegkaarten

1. Kies in de Uitlegeditor bij **Foto of tafeltekening** voor **Foto**.
2. Kies een foto op telefoon/computer, of vul een bestaand pad zoals
   `media/fotos/voorbeeld.webp` in.
3. De editor verkleint een lokale foto automatisch tot maximaal 1600 pixels.
4. Vul bijschrift en beschrijving in het Nederlands en Engels in.
5. Gebruik **Kopieer foto** om dezelfde foto ook op een andere kaart te tonen.
6. Gebruik **Verplaats foto** om hem van de huidige naar een andere kaart te verplaatsen.
7. Controleer **Voorbeeld** en download daarna de uitleg-JSON.

Boven iedere uitlegkaart staat **Instructie voor carrouseltekst**. Deze past
zich aan het gekozen type, de tafel en de lijn aan. Klik **Kopieer instructie**
en stuur de tekst samen met je ruwe notities en foto’s aan ChatGPT.

Op mobiel opent Kruin `https://kruin.github.io/3b/#owner=kruin`, tikt **Kruin**
en kiest **Uitleg bewerken**. De Kruin-knop bestaat niet in de klantmodus.

### Kruin op mobiel — kort onthouden

1. Open de Kruin-link, niet de gewone Main-link.
2. Tik **Kruin** en daarna **Uitleg bewerken**.
3. Bewerk en bewaar de kaart.
4. Bekijk **Voorbeeld**.
5. Download vóór het afsluiten altijd de **uitleg-JSON**.
6. Upload later die JSON samen met de nieuwste 3B-ZIP voor opname in de
   volgende openbare versie.

**Bewaar kaart is lokaal. Download JSON is een reservekop. Geen van beide is
al een publicatie.**

De uitleg-JSON is een reservekop en overdrachtsbestand. Downloaden publiceert
niets. Geef dit bestand samen met de nieuwste 3B-ZIP aan ChatGPT om de kaarten
bewust in een volgende openbare release te laten opnemen.

### Gemeenschappelijk of tafelspecifiek?

- **Gemeenschappelijk — Groot + Klein:** algemene uitleg over het systeem.
- **Lijn + één tafel:** uitleg over een concrete lijn, bijvoorbeeld VIJF op
  Groot of VIJF op Klein. Zo'n kaart hoort altijd bij één tafel en bewaart een
  momentopname van de betreffende KruinLine.

## Kruin — standaard-stipwaarden beheren

1. Start `Kruin.bat` op Windows of `Kruin.command` op Mac, klik **Kruin** en kies **Lijnen en stipwaarden bewerken**.
2. Kies Groot of Klein en kies de lijn.
3. Open zo nodig **Alle delen**.
4. Wijzig A en V via een bandbal, de invoervelden of de stapknoppen.
5. Controleer de volledige lijn en keur gecontroleerde waarden goed met **OK**.
6. Klik **Freeze** om een lokale KruinLine en JSON-bestand te maken.

Een Freeze of JSON-download verandert de openbare standaard nog niet. Laat de
gecontroleerde KruinLine bewust in de volgende bronconfiguratie opnemen.

### Ballen activeren

- Alle lijnpunten mogen voorlopig over de volledige fysieke band worden
  verschoven: 0–40 op een korte band en 0–80 op een lange band. Dit geldt ook
  voor Kruis. Inhoudelijke beperkingen worden later toegevoegd.
- Eén klik of tik op een bal opent direct de bediening; dubbelklikken hoeft niet.
- Klik of tik op de bovenste/onderste of eerste/tweede helft van een gekleurde
  lijn: 3B activeert automatisch de dichtstbijzijnde van de twee ballen.
- Bij **Been → Hiel** blijft dit één gedeelde bal wanneer Been A rond de hoek
  tussen Noord en Oost beweegt.

### Ontbrekende waarden vanaf Neus laten berekenen

Voer op Groot of Klein een complete **Neus**, alleen **Kop A** en een complete
**Romp** in. Bijvoorbeeld: Neus `Z–50`, Kop `A15` en Romp `20–38`. Zodra deze
drie ankers compleet zijn, berekent 3B automatisch **Kop V** en **Nek V/A**.
Deze regel geldt voor iedere lijn van NUL tot en met TWAALF.

De afgeleide waarden staan in de kleur **Berekend**. Controleer ze aan de
tafel en kies pas daarna **OK**. Een handmatig bewerkte of reeds goedgekeurde
waarde wordt nooit door deze automatische berekening vervangen.

### Aansluitketen vanaf Neus — alle lijnen en tafels

Voor iedere lijn van **NUL tot en met TWAALF**, op **Groot en Klein**, gebruikt
3B de volgorde **Neus → Kop → Nek → Romp → Kruis → Been → Hiel → Voet → Teen**.
De A van het ene deel en de V van het volgende deel moeten naar dezelfde
fysieke bandbal leiden.

Als de vorige lijn compleet is en A van de volgende lijn bekend is, vult 3B de
ontbrekende V rood als **Berekend** in. Dit wordt als keten verder doorgegeven.
Ook een geïmporteerde of geïnstalleerde lijn wordt gecontroleerd. Bij twee
volledig handmatige waarden die niet aansluiten verschijnt een waarschuwing;
gebruik dan de gedeelde bandbal om het paar samen te corrigeren.

## Kruin — controleren en publiceren

1. Start de Kruin-starter voor Windows of Mac en klik **Kruin**.
2. Kies **Klant mobiel testen** om de gepubliceerde
   klantinhoud in een mobiel scherm te bekijken. Conceptuitleg en
   eigenaarsfuncties zijn in deze preview verborgen.
3. Controleer Groot, Klein, West, Oost, lijnen en uitleg.
4. Kies **Stop klanttest** om terug te keren.
5. Start pas daarna `Publiceer_3B.bat`.

De publicatie-BAT controleert versie-assets, Git-remote, commit, GitHub Pages
en de gepubliceerde release. Een fout wordt zichtbaar gemeld.

Ontbreekt de verborgen map `.git`, bijvoorbeeld nadat je opnieuw vanuit een
ZIP begint? Dan kloont `Publiceer_3B.bat` eerst `kruin/3b` naar een tijdelijke
map en zet alleen de Git-geschiedenis terug in de huidige projectmap. De BAT
behoudt jouw actuele 3B-bestanden en publiceert pas nadat dit herstel gelukt is.

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

## Probleem: VIJF toont toch HALFZES

Vanaf versie 49 wordt deze oude mobiele instelling automatisch hersteld naar
**VIJF · Basis**. Kies je later opnieuw een basislijn zoals VIJF of ZES, dan
wordt Lijn 1 eveneens op Basis gezet. HALFZES verschijnt alleen wanneer je
bewust **Lijn 1 → Waaier → HALFZES** kiest.
