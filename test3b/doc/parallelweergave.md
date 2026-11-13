# Parallelle Neuzen en sporen

De kleur en arcering van een Neus blijven gekoppeld aan het bijbehorende spoor.
Dit geldt in H2, H3 en op de gewone tafel. De weergave verandert geen geometrie,
meetwaarden, ballen of contactzones.

In **H2 · De Parallel van VIJF → ⚙**:

- **Per spoor** (standaard): ieder spoor heeft een vaste combinatie van kleur en
  lijnpatroon, voor zijn Neus en alle beschikbare vervolglijnen.
- **Alle parallelsporen gelijk**: één kleur en arcering voor de hele vergelijking.
- **Per lijnsoort**: de oorspronkelijke kleuren van Neus, Kop, Romp enzovoort.
- **Eén spoor · stap voor stap** (standaard) of **alle beschikbare sporen samen**.
- **Volledig spoor** (standaard) of de optionele opbouw **Neus → Romp → spoor**.
  De drie knoppen verschijnen bij de tafel wanneer de opbouw aanstaat.

Stap voor stap helpt bij volgen; samen helpt bij vergelijken. Ontbrekende
metingen en sporen buiten LKL blijven behandeld zoals in de cursus.

In **H3 → ⚙** staan alleen de kleur- en arceringskeuzes. De ingestelde aantallen
alternatieve oplossingen blijven gelden. De parallelle Neus door Wit en de
correctie-Neus dragen de code van het gekozen referentiespoor; de correctie is
een aparte, indicatieve richting en verandert dat referentiespoor niet.

De algemene configuratie bevat dezelfde voorkeuren. Ze worden afzonderlijk van
de meetgegevens in deze browser bewaard (`3b-parallelweergave-v1`). Ook de
demo-animatie behoudt het lijnpatroon.

Controle: `CHROMIUM_PATH=/usr/bin/chromium node test3b/parallelweergave-controle-v208.js`.
Deze controle bestrijkt Klein/Groot, desktop/telefoon, codes, zichtbare arcering na
animatie, stapopbouw, overzicht, instellingen bewaren, fullscreen, H3 en de gewone
tafel. Bestaande cursus- en doelspoorcontroles verifiëren de overige bediening.
