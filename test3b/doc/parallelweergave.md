# Parallelle Neuzen en sporen

De kleur en arcering van een Neus blijven gekoppeld aan het bijbehorende spoor.
Dit geldt in H2, H3 en op de gewone tafel. De weergave verandert geen geometrie,
meetwaarden, ballen of contactzones.

De configuratielijsten zijn uitsluitend voor **Kruin**. U ziet de ingestelde weergave en gebruikt spoor- en stapknoppen, zonder kleur-, arcerings- of aantallenlijsten. U kan de instellingen niet via de weergave-API aanpassen. De uitgebreide weergave- en beheerpanelen blijven eveneens bij Kruin; spelen en eigen metingen blijven bereikbaar.

Kruin opent de weergaveconfiguratie met `config=kruin` als URL-parameter. De bestaande Kruin-werkbediening met `#owner=kruin` gebruikt dezelfde weergave-instellingen. Een mobiele U-preview toont de lijsten niet.

In **Kruin → H2 · De Parallel van VIJF → ⚙**:

- **Per spoor** (standaard): ieder spoor heeft een vaste combinatie van kleur en
  lijnpatroon, voor zijn Neus en alle beschikbare vervolglijnen.
- **Alle parallelsporen gelijk**: één kleur en arcering voor de hele vergelijking.
- **Per lijnsoort**: de oorspronkelijke kleuren van Neus, Kop, Romp enzovoort.
- **Eén spoor · stap voor stap** (standaard) of **alle beschikbare sporen samen**.
- **Volledig spoor** (standaard) of de optionele opbouw **Neus → Romp → spoor**.
  De drie knoppen verschijnen bij de tafel wanneer de opbouw aanstaat.

Stap voor stap helpt bij volgen; samen helpt bij vergelijken. Ontbrekende
metingen en sporen buiten LKL blijven behandeld zoals in de cursus.

In **Kruin → H3 → ⚙** staan alleen de kleur- en arceringskeuzes. De ingestelde aantallen
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

Rolcontrole: `CHROMIUM_PATH=/usr/bin/chromium node test3b/kruin-config-controle-v208.js`.

De rolcontrole en parallelweergavecontrole slagen op desktop en telefoon. De
bestaande cursuscontrole slaagt eveneens. De oudere uitgebreide Kruis-zones-test
heeft daarnaast een vaste verwachting voor de voorbeeldparen bij regel 72 die
niet meer bij de bijgewerkte meetbasis past. Dezelfde fout is vastgesteld op de
ongewijzigde uitgangsversie `1aa7539`; de configuratierollen veranderen geen
meetlijnen of contactberekening.
