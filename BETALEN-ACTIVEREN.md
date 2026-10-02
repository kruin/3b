# Betalen activeren · 3B v181

Betalen verschijnt uitsluitend nadat de gebruiker een duimpje geeft. `€0` sluit de barbon stil; alleen **Spa rood** en **Bitterballen** openen Mollie.

## Eenmalig in Supabase

1. Open uw Supabase-project en maak de Edge Function `create-mollie-payment`.
2. Gebruik daarvoor `supabase/functions/create-mollie-payment/index.ts` uit deze map.
3. Zet voor deze functie JWT-controle uit, zoals vastgelegd in `supabase/config.toml`. Betalen is openbaar; bewerken blijft een afzonderlijke aanmeldfunctie.
4. Voeg in de Supabase-projectinstellingen deze geheime waarden toe:
   - `MOLLIE_API_KEY`: uw Mollie live API-key;
   - `PAYMENT_RETURN_URL`: `https://kruin.github.io/3b/`.
5. Deploy de functie.

Voer de geheime Mollie-key uitsluitend rechtstreeks in Supabase in. Zet hem nooit in `config-v181.js`, GitHub, een ZIP of een chatbericht.

## Eenmalig in de openbare 3B-map

1. Start `Activeer_Betalen.bat`.
2. Vul de publieke **Project URL** en **anon key** van Supabase in.
3. Start daarna `Publiceer_3B.bat`.

De starter vult alleen `paymentUrl` en `paymentAnonKey` in. Aanmelden, cloudopslag en sessieregistratie worden hierdoor niet automatisch aangezet.

## Testen

1. Open de gepubliceerde app in een privévenster.
2. Geef een duimpje.
3. Kies `€0`: de barbon sluit zonder reactie.
4. Kies **Spa rood**: Mollie toont exact `€2,50`.
5. Kies **Bitterballen**: Mollie toont exact `€8,00`.
6. Rond eerst een betaling af met een Mollie-testkey. Vervang die pas daarna in Supabase door de live key.

De server negeert bedragen uit de browser en koppelt zelf `spa_rood` aan `€2,50` en `bitterballen` aan `€8,00`.
