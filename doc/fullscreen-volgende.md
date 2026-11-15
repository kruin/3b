# Volgende in mobiel fullscreen

In de vrije ruimte onder de geschilderde cursustafel staan **Vorige** en
**Volgende**. Deze gebruiken dezelfde lesnavigatie als het normale scherm, ook
bij een overgang naar de volgende les. Fullscreen blijft daarbij actief.

De plaatsing gebruikt de werkelijke SVG-viewBox en schermtransformatie. De tafel
wordt niet verschoven of verkleind om plaats te maken. De knoppen verschijnen
alleen wanneer onder de volledige tafel voldoende vrije hoogte overblijft, met
ruimte voor de veilige onderrand van de telefoon. Bij H3 krijgt de bestaande
keuze van doelsporen voorrang: de twee menu's overlappen niet.

Terug, bal slepen en de normale weergave blijven beschikbaar. Op desktop wordt
geen extra mobiele navigatie getoond.

Controle: `CHROMIUM_PATH=/usr/bin/chromium node test3b/fullscreen-volgende-controle-v208.js`.
De controle omvat twee staande telefoonformaten, liggend, desktop, vrije
tafelruimte, stappen vooruit/achteruit, lesovergang, doelspoorbediening en slepen
met aanraking in fullscreen.
