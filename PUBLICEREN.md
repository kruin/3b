# TAFEL publiceren via GitHub Pages

## Eenmalige inrichting

1. Meld je aan bij GitHub en maak de repository `drieband`.
2. Pak de distributie-ZIP uit.
3. Plaats **de inhoud** van de ZIP in de hoofdmap van de repository. `index.html`
   moet dus rechtstreeks in de repository staan, niet in een extra submap.
4. Commit en push de bestanden naar de branch `main`.
5. Open in GitHub: **Settings → Pages**.
6. Kies bij **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
7. Klik **Save**. Na de eerste publicatie staat de app normaal op:
   `https://kruin.github.io/drieband/`

## Eerste inhoud plaatsen met de BAT

GitHub toont branch `main` pas nadat de repository ten minste één commit heeft.
Daarom staat `Publiceer_Drieband.bat` in het pakket:

1. Pak de volledige ZIP uit.
2. Controleer dat `index.html` en `Publiceer_Drieband.bat` in dezelfde map staan.
3. Dubbelklik op `Publiceer_Drieband.bat`.
4. Meld je bij GitHub aan wanneer Git daarom vraagt.
5. De BAT maakt zo nodig de lokale repository en branch `main`, koppelt
   `https://github.com/kruin/drieband.git`, commit de echte app en pusht deze.
6. Open daarna **Settings → Pages** en selecteer `main` en `/(root)`.

De BAT maakt bewust geen lege `index.html`: de echte startpagina is al aanwezig
en wordt bij de eerste commit direct gepubliceerd.

## Bij iedere nieuwe versie

1. Bewaar eerst eventueel lokaal ingevoerde configuraties via **Config**.
2. Vervang in de repository de programmabestanden door de nieuwe versie.
3. Controleer dat `index.html`, `styles.css`, `app-v7.js`, `config-v7.js` en
   `VERSIE.txt` aanwezig zijn.
4. Commit met een herkenbare omschrijving en push naar `main`.
5. Wacht tot **Actions** en **Settings → Pages** de publicatie als geslaagd tonen.
6. Open de publieke URL en controleer Klein/Groot, een patroon, tekenen,
   JSON-export/import en SVG-export.
7. Controleer onderaan de app of het zichtbare versienummer overeenkomt met
   `VERSIE.txt` uit het publicatiepakket.
8. Open `/controle-v7.html`; daar moet geladen configuratieversie `7` staan.

## Belangrijk onderscheid

- `config.js` bevat de openbare startconfiguratie en komt op GitHub.
- Invoer via het scherm wordt in `localStorage` van de browser bewaard en komt
  niet op GitHub.
- Klanten hebben geen GitHub-account en geen toegang tot de repository nodig.
- Er is geen automatische synchronisatie tussen apparaten. Daarvoor exporteert
  de gebruiker JSON op apparaat A en importeert die op apparaat B.
- Verwijderen van browsergegevens, privévensters of een andere browser kan een
  lokale configuratie onbereikbaar maken. JSON-export is de reservekop.

## Git-opdrachten (optioneel)

Voer deze uit in de uitgepakte projectmap nadat de lege repository is gemaakt:

```bash
git init
git add .
git commit -m "Publiceer TAFEL lijnconfigurator"
git branch -M main
git remote add origin https://github.com/kruin/drieband.git
git push -u origin main
```

Voor een volgende versie:

```bash
git add .
git commit -m "Werk TAFEL bij"
git push
```

De vastgelegde repository voor dit project is `kruin/drieband`.

## Problemen oplossen

Als Git bij de eerste commit om je identiteit vraagt, voer dan eenmaal uit:

```bash
git config --global user.name "Jouw naam"
git config --global user.email "jouw-github-email@example.com"
```

Start daarna `Publiceer_Drieband.bat` opnieuw. Als GitHub om aanmelding vraagt,
gebruik dan de aanmeldmethode van Git Credential Manager; een gewoon
GitHub-wachtwoord wordt niet als Git-wachtwoord gebruikt.

## GitHub Pages-compatibiliteit

De app gebruikt uitsluitend statische HTML, CSS en JavaScript. Er zijn geen
server, database, Python-installatie of geheime sleutels nodig. Nieuwe functies
moeten dit uitgangspunt behouden of uitdrukkelijk melden waarom een externe
dienst nodig is.
