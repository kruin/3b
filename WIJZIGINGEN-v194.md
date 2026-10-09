# 3B v194 — menuherstel en volledige NEGEN

Het undo-menu staat bij starten dicht. Open ☰ voor Undo, Opnieuw, Verwerp
experiment en Sessiestart. Sluit met ×, Escape of een tik op de tafel.
In de lijneditor blijft dezelfde herstelbediening beschikbaar; na sluiten
keert zij terug naar het menu. Ctrl+Z werkt ook met het menu dicht.

NEGEN en HALF NEGEN gebruiken dezelfde lijnketen en bediening als ACHT:
Neus, Kop, Nek, Romp, Kruis, Been en Hiel. Karkas toont Neus + Romp;
de gewone LKL-weergave begint zoals bij ACHT met Neus + Romp. Kies
Parallel of voeg de vervolglijnen toe om meer lijnen te bekijken.
NEGEN heeft P−2, P−1 en P0; P+1 is niet beschikbaar.

Neus A90 en HALF NEGEN A85 blijven behouden. De nog ontbrekende
NEGEN-Romp is voorlopig geëxtrapoleerd uit de actuele ZEVEN/ACHT:
klein V51→A15, groot V59→A14. Kop A is voorlopig geometrisch benaderd
uit de Neus (klein circa 3,162, groot circa 1,994). Been A10 is een
bestaande LKL-beginwaarde. Alle nieuwe aannames zijn berekend/benadering,
geen nieuwe metingen. Metingen en gebruikerswijzigingen blijven leidend.

Gewone LKL: **5 banden + uitloop tot midden lijn 6 (Been)**.

## Voorstel LKL-zesbander

Een apart patroon voor een snellere Neus en hardere bandbotsingen:
**6 banden**, met **7 banden** als afzonderlijke vervolgvariant.
Het karkas bestaat uitsluitend uit **Neus + Been**. Romp, Kop, Nek,
Kruis en Hiel worden gemeten of berekend; Romp is geen karkasanker.
Dit voorstel is vastgelegd in config en projectgeheugen; het is nog
geen selecteerbare patroonstand in de tafel.

In de huidige database is geen Been-punt expliciet als eigen meting
gemarkeerd. Wel bestaat de Kruin-beginwaarde Been A10 op Oost.
Voorstel voor de eerste meetreeks: behoud de bestaande Neus S–A per
spoor en begin bij Been A10, op beide tafels. Meet eerst Been V en A
bij de hogere snelheid. De bestaande berekende Been V mag als eerste
proefstand dienen, met herkomst 'benadering uit gewone LKL'.
Verhoog de snelheid tot 6 banden (of apart 7); de afstootlengte in cm
is niet de snelheid. Leg per proef het aantal banden en de uitloop vast.
Gebruik geen willekeurige snelheidscorrectie in stippen: daarvoor ontbreken
metingen. Ook de 45°-Kruisregel van gewone LKL wordt niet vanzelf
een vaste zesbanderregel. Daarna pas de tussenlijnen afleiden of meten.

## Controle

Menuplaatsing, sluiten/Escape, Undo/Redo/Verwerp, v193-gebruikerswaarden,
NEGEN/HALF NEGEN/P−1/P−2 en alle gedeelde aansluitballen worden apart
gecontroleerd voor klein/groot en west/oost. De gewone regressietests
blijven aanwezig. Een echte browserlayouttest kon in deze werkomgeving
niet worden uitgevoerd doordat Chromium niet beschikbaar is.
