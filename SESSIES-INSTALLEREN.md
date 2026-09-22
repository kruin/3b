# Sessieregistratie installeren

Versie 78 registreert uitsluitend:

- `started_at`: start van de sessie;
- `duration_seconds`: verstreken sessieduur.

De willekeurige technische `id` is alleen nodig om dezelfde sessie bij te werken. Er worden geen e-mailadressen, tafelwaarden, lijnen, foto’s, barbonkeuzes, IP-adressen of browserkenmerken door de app meegestuurd.

## Installatie

1. Maak een Supabase-project.
2. Open de SQL Editor en voer `supabase-session-schema.sql` uit.
3. Vul in `config-v107.js` bij `userAccess.supabase` alleen de project-URL en publieke anon key in.
4. Publiceer versie 85.

Zonder URL en anon key blijft 3B normaal werken en wordt niets verzonden.

## Bekijken

Bekijk sessies uitsluitend in het afgeschermde Supabase-dashboard. De publieke website kan de tabel niet uitlezen.

De uiteindelijke sessieduur kan maximaal ongeveer 30 seconden korter zijn wanneer een browser abrupt wordt afgesloten. De app schrijft daarom tijdens gebruik periodiek een nieuwe duur weg.
