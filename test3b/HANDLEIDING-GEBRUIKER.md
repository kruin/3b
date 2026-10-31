# 3B v208-r38 — User-werkwijze

# LKL meten: Neus, Kop en Romp

Begin met LKL en één basislijn, bijvoorbeeld VIJF op Klein. Je onderzoekt wat je eigen afstoot werkelijk doet. Bouw het karkas op uit ingevoerde metingen van **Neus, Kop en Romp**. Een getekende basiswaarde of schatting telt nog niet als een eigen meetgegeven. Begin pas aan andere patronen nadat deze werkwijze goed werkt.

## Verplicht voor User: eerst je eigen basis

De User-werkwijze gebruikt alleen je eigen ingevoerde metingen voor voltooiing. Een aanwezige Kruinmeting telt niet automatisch als een meting van User. Zolang eigen Neus, Kop en Romp niet compleet zijn, blijft de Kruinconfiguratie van de geladen basis voor dat spoor actief. Het spoorscherm bewaart onvolledige eigen invoer als concept, zodat je op een ander moment verder kunt. Conceptwaarden in het scherm zijn dan nog niet de actieve tafelconfiguratie.

Na complete eigen meetinvoer en Bewaar spoor is je eigen basis actief. De gewone User-gegevens blijven in je persoonlijke tafelbestand (JSON); dit schrijft niet in Kruins private database. Kruin-beheer kan officiële meetgegevens wel rechtstreeks configureren en blijft gedeeltelijke invoer kunnen bewaren.


## Neus

Meet de Neus van je gekozen afstoot en voer R of A in. De startpositie is bekend. De app berekent de bijbehorende stiplijn- en contactwaarden. Bewaar ook een gedeeltelijke meetreeks; het karkas blijft dan als onvolledig aangeduid.

## Kop: R meten met pionnen

Zet pionnen op de rand van de noordband rond het verwachte raakpunt. Test je afstoot. De pion die loodrecht op de band omvalt, markeert het raakpunt R. Voer **Kop R** in; de app berekent **Kop A**. Kop V is altijd berekend en wordt niet als zelfstandig meetveld aangeboden.

## Kop: A waarnemen door mee te lopen

Loop met de bal mee, ga in de Kop-lijn kijken en zie de gespeelde lijn **Kop V–Kop A**. Bepaal A op de noordelijke stiplijn en voer **Kop A** in. De app berekent dan **Kop R**. Je hoeft niet zowel R als A afzonderlijk te meten: het zijn twee manieren om dezelfde gemeten Kop vast te leggen.

## Romp: je afstoot waarnemen

Je afstoot levert de werkelijk gespeelde Romplijn. Kijk vanaf het bekende kijkpunt A bij de zuidband in de verwachte Romp-lijn. Je ziet de bal aankomen vanaf **Romp V** op de oostelijke stiplijn. Voer het waargenomen V in. Met dat V en het bekende A berekent de app **Romp R**; R hoeft dan niet nog eens afzonderlijk gemeten te worden. Wijkt je kijkpunt af, leg dat vast als A. Je kunt R ook afzonderlijk meten en invoeren.

Bij de uitgevoerde afstoot is er één werkelijk contactpunt. Je neemt de gespeelde lijn waar; de app berekent het daarbij horende R.

## Wanneer staat het karkas?

Neus, Kop en Romp hebben elk een ingevoerd meetgegeven nodig, met voldoende bekende referentiepunten om de lijn te bepalen. Voor Kop is dat R of A; V wordt afgeleid uit de voorafgaande balpositie. Voor Romp kan de meting van V vanaf bekend kijkpunt A volstaan. Je hoeft dus niet ieder berekend getal opnieuw te meten.

Het Romp-/karkasscherm toont daarom Neus, Kop en Romp samen en vermeldt welke meetlijn nog ontbreekt. Berekeningen mogen als voorvertoning zichtbaar zijn; pas bij alle drie ingevoerde meetlijnen staat het karkas. Tussentijds bewaren blijft mogelijk. Handmatig ingevoerde waarden zijn vet; berekende waarden normaal. Nieuwe invoer moet je met **Bewaar spoor** vastleggen.

De status is een controle op aanwezige meetinvoer en berekenbaarheid, geen onafhankelijk bewijs dat een afstoot in de praktijk is gecontroleerd. Andere patronen, waaronder 6–7 banden, houden voorlopig hun bestaande werking.

## Daarna: voorstel voor de gemeten +/−-reeks

Kruin heeft de +/−-sporen uitgemeten. Je kunt vanuit je eigen gemeten VIJF het voorstel voor bijvoorbeeld je VIJF+2 laten berekenen:

**User VIJF+2 = User VIJF + (Kruin VIJF+2 − Kruin VIJF).**

De gemeten verschillen worden toegepast op de overeenkomstige karkaswaarden. De bekende startreferentie blijft de parallelstand volgen; de aansluitende lijnwaarden en raakpunten worden opnieuw berekend. Het voorstel toont onder meer Kop A en Romp A: het grote plaatje van de aankomsten is daarmee al beschikbaar. Je hoeft niet standaard alle +/−-sporen opnieuw te testen. Als je meer wilt weten of bijstellen, voeg je gericht extra eigen metingen toe.

1. Bewaar eerst je volledige eigen basisspoormetingen.
2. Kies in het karkasscherm **Voorstel +/− bekijken**.
3. Bekijk de aankomsten en de vermeldingen per spoor.
4. Kies **Neem beschikbare voorstellen over** als je het voorstel wilt gebruiken.

Overgenomen sporen zijn afgeleid uit je eigen basis en Kruins meetserie. Ze worden niet als nieuwe eigen metingen gemarkeerd; berekende waarden blijven normaal weergegeven. Bestaande eigen metingen en eigen concepten worden niet overschreven. Bij onvolledige referenties, een bandwissel of onberekenbare geometrie wordt dat spoor niet overgenomen; daar kun je zelf meten. Er wordt niets kunstmatig afgeknipt op de bandgrenzen.

Verander je later je eigen basis, dan vervalt de geldigheid van de eerdere overdracht. Tot een nieuw beoordeeld voorstel blijft voor die varianten Kruin actief. Je eerdere gegevens blijven als concept behouden. **Bewaar mijn tafel** en **Terugladen** nemen de eigen basis, eigen concepten en geaccepteerde overdracht mee in je JSON-tafelbestand.

## Taal

We spreken je aan met **je**. **U** is de rol *User*, geen aanspreekvorm.


Bewaar mijn tafel en Terugladen gebruiken het volledige JSON-tafelbestand. De officiële private Kruin-database wordt hiermee niet gewijzigd.
