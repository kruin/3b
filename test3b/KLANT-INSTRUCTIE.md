# 3B gebruiken

> Actuele hoofdhandleiding: `HANDLEIDING-GEBRUIKER.md`.
> Dit bestand blijft alleen bestaan voor oude verwijzingen.

Open `https://kruin.github.io/3b/` op mobiel, tablet of desktop.

1. Kies Language/Taal.
2. Kies Large, Small of Both.
3. Kies patroon, richting West/Oost en route.
4. Vul per deel V en A in; de tekening verandert direct.
5. In Both kiest “Edit table” welke tafel je bewerkt.

De normale route begint met Neus vanuit Z. Bij **Shortened four-cushion /
Verkorte 4-bander** verdwijnt Neus en begint de weergave met Kop, op basis van
de eigen V- en A-waarden van Kop.

Bevestigde invoer wordt via het account in de database bewaard. JSON-import en
-export staan niet in de gebruikersinterface.
# KruinLines en eigen wijzigingen

- **KruinLines** bevat de door Kruin gepubliceerde uitgangslijnen.
- Eigen wijzigingen worden via het account in de database bewaard.
- De gebruiker hoeft geen JSON-bestanden te beheren.
- De gepubliceerde KruinLine verandert niet door eigen wijzigingen.

## Kruin: uitleg op mobiel bewerken

1. Open `https://kruin.github.io/3b/#owner=kruin`.
2. Kies **Instellingen** en daarna **Mobiele Uitlegeditor**.
3. Kies een kaart of maak een nieuwe kaart.
4. Vul level, soort, tafel, lijn, zichtbare delen, titels en teksten in.
5. Kies **Voorbeeld** om de kaart in de carrousel te bekijken.
6. Kies **Download uitleg-JSON** als reservekop en voor opname in een release.

Deze eigenaarsweergave is een lokale werkmodus, geen accountbeveiliging. De
statische website kan niets naar GitHub schrijven. Alleen een bewust
gepubliceerde volgende release wijzigt de uitleg voor klanten.

## Kruin: uitleg op desktop bewerken

Pak het pakket volledig uit en dubbelklik op `Edit_Uitleg.bat`. De lokale
Kruin-modus wordt geopend en de Uitlegeditor verschijnt meteen. Gebruik
`Open_KruinLines.bat` voor lijn- en stipwaarden en `Open_3B.bat` voor controle
van de gewone klantweergave.
