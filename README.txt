3B LIJNCONFIGURATOR - VERSIE 205
================================

Dit is de openbare appmap. Gebruik geen bestanden uit v139 tot en met v142 in
deze map.

LOKAAL OPENEN
- Windows: start Kruin.bat.
- Mac: start Kruin.command.
- Gewone gebruiker: open index.html.

PUBLICEREN
- Start Publiceer_3B.bat.
- De starter herstelt zo nodig de Git-koppeling, publiceert en controleert
  https://kruin.github.io/3b/.

PRIVATE KRUINWAARDEN
- Beheer Kruinwaarden via Bekijk_Kruinconfig in de private map; SQLite is de bron.
- Gebruik de naastliggende map 3B-private-Kruinconfig-v205.
- Bekijk_Kruinconfig genereert vandaar kruinwaarden-generated-v205.js.

BETALEN
- Lees BETALEN-ACTIVEREN.md.
- Activeer_Betalen.bat vult alleen publieke Supabase-projectgegevens in.
- Een geheime Mollie-key hoort uitsluitend in Supabase.

Zie START-HIER.md en HANDLEIDING-GEBRUIKER.md voor de volledige werkwijze.

BROWSER- EN TOUCHTESTS
- Installeer Node.js als dat nog ontbreekt.
- Windows: start Installeer_Browsertests_3B.bat.
- Mac/Linux: start Installeer_Browsertests_3B.command.
- De installer zet Playwright 1.62.1 en Chromium klaar en voert de controles uit.
- Daarna: npm test of Regressiecontrole_3B.bat.
- Ontbreekt de browser, dan mislukt de controle; tests worden niet stil overgeslagen.
- Houd beide mappen naast elkaar voor alle 23 controles, inclusief private opslag.
- De touchtest gebruikt browser-touchinvoer in staande en liggende weergave,
  met Klein/Groot en West/Oost. Dit is geen test op een fysieke telefoon.

PATROONLENGTE
- De tafel tekent alle lijnen tot het gedefinieerde eindpunt.
- LKL: vijf bandcontacten en uitloop tot half Been.
- Na contra: nog één volledige lijn en band, daarna een kwart van de volgende lijn.
- VIER: Romp schakelt naar contra; Kruis blijft contra, daarna kwart Been.
- Dunne referenties en reeksweergaven stoppen op dezelfde patroonlengte.
