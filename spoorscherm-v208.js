window.THREEB_RELEASE=Object.freeze({"version": "v208-r89", "date": "2026-11-05", "channel": "test", "compatibilityBase": "v208-r15"});
window.THREEB_DB_SOURCE=Object.freeze({"fingerprint": "d5d6ae4d05f9e7fe32d327af82b7199ca034381d9b3cb3b350984c2d62cbe2ca", "version": "v208-r89", "date": "2026-11-05"});
/* Shared display provenance. Approval and technical pinning are not manual entry. */
const ThreeBValueOrigin=(()=>{
  function kind(p){
    if(!p||p.value===null||p.value===undefined||p.value===''||p.kind==='acquit')return 'unknown';
    if(['contact','derived_contact'].includes(p.inputMethod))return 'calculated';
    if(p.source==='estimate')return 'estimate';
    if(p.measurement===true||['user','measured','kruin_measured','kruin_manual'].includes(p.source))return 'manual';
    if(p.status==='calculated'||p.source==='automatic'||p.source==='user-approved-calculation'||p.calculationBasis==='retained_karkas_anchor')return 'calculated';
    if(p.status==='edited'||p.userAdjusted===true)return 'manual';
    return 'basis';
  }
  function label(p){return {manual:'Handmatig ingevoerd',calculated:'Berekend',estimate:'Berekend · schatting',basis:'Basiswaarde · niet als meting vastgelegd',unknown:'Geen waarde / vaste referentie'}[kind(p)];}
  function decorate(el,p){const k=kind(p);el.dataset.valueKind=k;el.style.fontWeight=k==='manual'?'800':'400';el.title=label(p);el.setAttribute('aria-description',label(p));}
  return {kind,label,decorate,weight:p=>kind(p)==='manual'?800:400};
})();
if(typeof window!=='undefined')window.ThreeBValueOrigin=ThreeBValueOrigin;
if(typeof module!=='undefined')module.exports=ThreeBValueOrigin;

/* LKL measurement workflow; other patterns keep their own framework. */
const ThreeBLklKarkas=(()=>{
  const origin=typeof ThreeBValueOrigin!=='undefined'?ThreeBValueOrigin:require('./Waardeherkomst.js');
  const known=p=>p&&p.value!==null&&p.value!==''&&Number.isFinite(Number(p.value));
  function entered(p,own=false){return known(p)&&(!own||p.inputOwner==='user'||p.inputOwner===undefined&&p.editOwner==='user')&&(origin.kind(p)==='manual'||p.inputMethod==='contact'&&p.contactCurrent!==false&&known(p.manualContact));}
  function status(lines,own=false){const by=Object.fromEntries(lines.map(l=>[l.key,l]));const checks={neus:by.neus?.contactValid!==false&&entered(by.neus?.A,own),kop:by.kop?.contactValid!==false&&entered(by.kop?.A,own),romp:by.romp?.contactValid!==false&&known(by.romp?.V)&&known(by.romp?.A)&&(entered(by.romp?.V,own)||entered(by.romp?.A,own))};return {checks,count:Object.values(checks).filter(Boolean).length,complete:Object.values(checks).every(Boolean)};}
  const routeStatus=route=>status(['neus','kop','romp'].map(key=>({key,V:route?.[key]?.from,A:route?.[key]?.to})),true);
  const anchors=[['neus','to'],['kop','to'],['romp','from'],['romp','to']];
  const clone=x=>JSON.parse(JSON.stringify(x));
  const signature=route=>JSON.stringify([['start',route?.neus?.from?.kind,Number(route?.neus?.from?.offset)||0],...anchors.map(([line,side])=>[line,side,route?.[line]?.[side]?.band,route?.[line]?.[side]?.value])]);
  const routeKey=(table,track,direction='west')=>'omb:0:'+table+':'+track+(direction==='oost'?':oost':'');
  function kruinRoute(K,table,track,direction='west'){
    const spec=K.tracks?.[table]?.[track];if(!spec)return null;const r=clone(spec.linePoints||{});
    for(const [name,line,side] of [['neusA','neus','to'],['kopA','kop','to'],['rompV','romp','from'],['rompA','romp','to'],['beenA','been','to']])if(spec[name]&&!r[line]?.[side]){r[line]??={};r[line][side]=clone(spec[name]);}
    const own=K.startAcquitRoutes?.[routeKey(table,track,direction)]||K.startAcquitRoutes?.[routeKey(table,track)];for(const [line,pair] of Object.entries(own||{}))for(const side of ['from','to']){const p=pair[side];if(known(p)&&(p.userAdjusted||p.status==='edited'||p.source==='user')){r[line]??={};r[line][side]=clone(p);}}
    return r;
  }
  function validTransfer(state,K,key){const t=state.lklTransfers?.[key];if(!t||t.expired||!state.startAcquitRoutes?.[key])return false;const base=state.startAcquitRoutes?.[t.baseKey];if(!base||!routeStatus(base).complete||signature(base)!==t.baseSignature)return false;return signature(kruinRoute(K,t.table,t.baseTrack,t.direction))===t.kruinBaseSignature&&signature(kruinRoute(K,t.table,t.track,t.direction))===t.kruinTrackSignature;}
  function invalidateTransfers(state,K){for(const [key,t] of Object.entries(state.lklTransfers||{}))if(!validTransfer(state,K,key)){t.expired=true;if(state.startAcquitRoutes?.[key]){state.lklUserDrafts??={};state.lklUserDrafts[key]??=clone(state.startAcquitRoutes[key]);delete state.startAcquitRoutes[key];}}}
  const hasUserInput=route=>Object.values(route||{}).some(pair=>Object.values(pair||{}).some(p=>p&&typeof p==='object'&&(p.inputOwner==='user'||p.inputOwner===undefined&&(p.editOwner==='user'||p.editOwner!=='kruin'&&(p.source==='user'||p.status==='edited')))));
  function proposal(state,K,table,baseTrack,direction,calculate,valid){
    const baseKey=routeKey(table,baseTrack,direction),base=state.startAcquitRoutes?.[baseKey],kb=kruinRoute(K,table,baseTrack,direction);if(!base||!routeStatus(base).complete)throw Error('Bewaar eerst je eigen metingen van Neus, Kop en Romp voor dit basisspoor.');
    const result={table,baseTrack,baseKey,direction,baseSignature:signature(base),kruinBaseSignature:signature(kb),items:[]};
    for(const track of Object.keys(K.tracks?.[table]||{}).filter(k=>k.startsWith(baseTrack)&&/^[+-]\d+$/.test(k.slice(baseTrack.length))).sort((a,b)=>Number(a.slice(baseTrack.length))-Number(b.slice(baseTrack.length)))){
      const key=routeKey(table,track,direction),kv=kruinRoute(K,table,track,direction),item={track,key,available:false,kruinTrackSignature:signature(kv)};result.items.push(item);
      if(hasUserInput(state.lklUserDrafts?.[key])||hasUserInput(state.startAcquitRoutes?.[key])){item.reason='Eigen meetinvoer aanwezig; blijft behouden';continue;}
      const r=clone(base);let reason='';if(base.neus?.from?.kind==='acquit'&&kb?.neus?.from?.kind==='acquit'&&kv?.neus?.from?.kind==='acquit')r.neus.from={...clone(base.neus.from),offset:(Number(base.neus.from.offset)||0)+(Number(kv.neus.from.offset)||0)-(Number(kb.neus.from.offset)||0)};
      for(const [line,side] of anchors){const u=base[line]?.[side],a=kb?.[line]?.[side],b=kv?.[line]?.[side];if(![u,a,b].every(known)){reason='Kruinreferentie onvolledig; meet dit spoor zelf';break;}if(u.band!==a.band||a.band!==b.band){reason='Bandwissel: meet dit spoor zelf';break;}r[line][side]={...clone(u),band:b.band,value:u.value+(b.value-a.value),source:'kruin_transfer',status:'calculated',measurement:false,userAdjusted:true,inputOwner:'transfer',inputMethod:'transferred',manualContact:null,calculationBasis:'kruin_base_delta'};}
      if(reason){item.reason=reason;continue;}
      const a=kb?.been?.to,b=kv?.been?.to,u=base.been?.to;if([a,b,u].every(known)&&a.band===b.band&&u.band===a.band)r.been.to={...clone(u),value:u.value+(b.value-a.value),source:'kruin_transfer',status:'calculated',measurement:false,userAdjusted:true,inputOwner:'transfer',inputMethod:'transferred',manualContact:null,calculationBasis:'kruin_base_delta'};
      try{item.route=calculate(r,track);if(!valid(item.route))throw Error('Geen berekenbaar LKL-karkas');item.available=true;}catch(_){item.reason='Geometrie vraagt controle; meet dit spoor zelf';}
    }
    return result;
  }
  function accept(state,K,p){if(signature(state.startAcquitRoutes?.[p.baseKey])!==p.baseSignature||!routeStatus(state.startAcquitRoutes?.[p.baseKey]).complete||signature(kruinRoute(K,p.table,p.baseTrack,p.direction))!==p.kruinBaseSignature)throw Error('Je basis of de Kruinreferentie is gewijzigd. Bekijk een nieuw voorstel.');
    const items=p.items.filter(i=>i.available);for(const i of items){if(signature(kruinRoute(K,p.table,i.track,p.direction))!==i.kruinTrackSignature||hasUserInput(state.lklUserDrafts?.[i.key])||hasUserInput(state.startAcquitRoutes?.[i.key]))throw Error('Meetgegevens gewijzigd. Bekijk een nieuw voorstel.');}
    state.lklTransfers??={};for(const i of items){state.startAcquitRoutes[i.key]=clone(i.route);if(state.lklUserDrafts)delete state.lklUserDrafts[i.key];state.lklTransfers[i.key]={baseKey:p.baseKey,baseTrack:p.baseTrack,baseSignature:p.baseSignature,kruinBaseSignature:p.kruinBaseSignature,kruinTrackSignature:i.kruinTrackSignature,table:p.table,track:i.track,direction:p.direction,acceptedAt:new Date().toISOString()};}return items.length;
  }
  function prepareUserState(state,K,apply,fresh=false){
    state.lklUserDrafts??={};state.startAcquitRoutes??={};const copy=x=>JSON.parse(JSON.stringify(x));
    for(const [key,route] of Object.entries(state.startAcquitRoutes)){if(key.includes('ZESZEVEN'))continue;if(fresh){delete state.startAcquitRoutes[key];continue;}if(!routeStatus(route).complete&&!validTransfer(state,K,key)){state.lklUserDrafts[key]??=copy(route);delete state.startAcquitRoutes[key];}}
    invalidateTransfers(state,K);
    for(const [table,tracks] of Object.entries(state.data||{}))for(const [track,route] of Object.entries(tracks)){
      if(track.startsWith('ZESZEVEN'))continue;const key='omb:0:'+table+':'+track;
      if(!fresh&&hasUserInput(route)&&!state.startAcquitRoutes[key]){if(routeStatus(route).complete)state.startAcquitRoutes[key]=copy(route);else state.lklUserDrafts[key]??=copy(route);}
      apply(route,K.tracks?.[table]?.[track]);
      for(const pair of Object.values(route||{}))if(pair&&typeof pair==='object')for(const [side,p] of Object.entries(pair))if(p&&typeof p==='object')pair[side]={...p,inputOwner:'kruin'};
    }
    for(const [table,tracks] of Object.entries(state.variantData||{}))for(const [track,route] of Object.entries(tracks))if(!track.startsWith('ZESZEVEN')){const key='omb:0:'+table+':'+track;if(!fresh&&!state.startAcquitRoutes[key]&&hasUserInput(route))state.lklUserDrafts[key]??=copy(route);delete tracks[track];}
  }
  const instructions={
    neus:'Begin met de basislijn, bijvoorbeeld VIJF · Klein. Meet de Neus en voer R of A in. Een getekende basiswaarde is nog geen eigen meting.',
    kop:'Kop V wordt altijd berekend. Meet R met pionnen op de noordbandrand: de pion die loodrecht op de band omvalt, markeert het raakpunt. Voer R in; A wordt berekend. Of loop mee, kijk in de Kop-lijn en bepaal Kop A op de stiplijn langs Kop V–Kop A. Voer A in; R wordt berekend.',
    romp:'Je afstoot levert de werkelijk gespeelde Romplijn. Kijk vanaf het bekende kijkpunt A bij de zuidband in de verwachte lijn en zie de bal aankomen vanaf Romp V op de oostelijke stiplijn. Voer het waargenomen V in; met het bekende A berekent de app R. Je hoeft R dan niet nog eens te meten. Wijkt je kijkpunt af, leg dat vast als A. Je kunt R ook afzonderlijk meten.'
  };
  function applyCourse(c){
    const prior=c?.explanation?.levels?.find(l=>l.key==='LKL')?.slides?.find(s=>s.key==='lesson-five-goal');
    if(prior?.text?.nl?.includes('Les 2 werkt terug vanaf een vaste Romp Oost 30 → Zuid 30 op Klein: eerst bal 3, dan bal 1, daarna de gegeven Neus ter controle. De vaste oefenwaarden wijzigen mijn eigen metingen niet.'))prior.text.nl=prior.text.nl.replace('Les 2 werkt terug vanaf een vaste Romp Oost 30 → Zuid 30 op Klein: eerst bal 3, dan bal 1, daarna de gegeven Neus ter controle. De vaste oefenwaarden wijzigen mijn eigen metingen niet.','Les 2 werkt terug vanaf de Romp van hetzelfde gemeten VIJF: eerst bal 3, dan bal 1, daarna de Neus ter controle. Les 3 vergelijkt VIJF−1, +1, +2 en +3, ook via hun aankomsten. Les 4 herhaalt of bal 1 op hetzelfde spoor ligt als bal 3. Naar tafel en Terug naar mijn les houden dezelfde tekening en stap vast. Na deze VIJF-reeks vormt de waaier de brug naar ZES en volgende basissporen.');
    if(!c||c.__lklMeasurementCourse==='1.9')return;c.__lklMeasurementCourse='1.9';
    if(c.editor)c.editor.lklBasicParts=['neus','kop','romp'];if(c.speedProfiles?.lkl)c.speedProfiles.lkl.framework=['neus','romp'];
    const course=c.explanation;if(!course)return;course.previousCardsLklMeasurements={};course.updated='2026-11-01';course.version='1.9';
    if(course.glossary?.karkas)course.glossary.karkas.text={nl:'Bij LKL is het zichtbare karkas Neus en Romp. Eerst herken je deze twee lijnen en de posities van bal 3 en bal 1. In een latere meetles onderzoek je wat je eigen afstoot doet: waar ligt mijn Kop A? Voor een complete eigen meetbasis zijn Neus, Romp en aanvullend Kop R of A nodig. Neus en Romp alleen bepalen Kop niet eenduidig: ook Kop R of A moet gemeten en ingevoerd zijn. Kop V is altijd berekend. Pas met meetgegevens voor alle drie is de eigen meetbasis compleet. Andere patronen worden daarna afzonderlijk onderzocht.',en:'The visible LKL framework is Nose and Body. Your own Head A is measured in a later lesson. A complete personal calibration also requires Head R or A. Head R or A must be measured; Head V is calculated. All three require entered measurements. Other patterns are researched separately.'};
    if(course.glossary?.hiel)course.glossary.hiel.text={nl:'De lijn na Been. LKL stopt op half Been. De 6–7-bander doorloopt de hele Hiel, met daarna standaard 15 cm extra uitloop. Die extra lengte is per tafel en basisspoor instelbaar. Een harder lopende bal hoort bij het afzonderlijke patroon 6–7 banden met eigen meetwaarden, niet bij een verlengde LKL-baan. De animatie berekent geen snelheidsovergang.',en:'The line after Leg. The LKL course runs out halfway along Leg. A harder-running ball uses the separate 6–7-cushion pattern with its own measurements, not an extended LKL route.'};
    if(course.glossary?.kop)course.glossary.kop.text={nl:instructions.kop,en:'Head V is calculated. Measure Head R with cushion-edge markers and calculate A, or sight along Head V–A and enter A to calculate R.'};
    const changes={
      'lesson-five-goal':['Start met LKL · lijn na lijn','Ik volg de bal altijd in dezelfde volgorde: Neus → Kop → Nek → Romp → Kruis → Been. Bij LKL volgt uitloop tot half Been; een harder lopende bal hoort bij het afzonderlijke patroon 6–7 banden. Eerst de Neus, daarna pas de Kop, daarna de Nek enzovoort. Geen keuzevragen of willekeurige lijnkeuze. De bal rolt langs de actieve lijn; ik kan pauzeren, herhalen en naar de vorige of volgende stap. Les 1 volgt VIJF voorwaarts. Les 2 werkt terug vanaf de Romp van hetzelfde gemeten VIJF: eerst bal 3, dan bal 1, daarna de Neus ter controle. Les 3 vergelijkt VIJF−1, +1, +2 en +3, ook via hun aankomsten. Les 4 herhaalt of bal 1 op hetzelfde spoor ligt als bal 3. Naar tafel en Terug naar mijn les houden dezelfde tekening en stap vast. Na deze VIJF-reeks vormt de waaier de brug naar ZES en volgende basissporen. Eigen metingen en mijn Kop A komen later. Schuivende bal is voor het latere Pro-niveau.','Start with LKL and one base track, for example FIVE on Small. Enter measurements for Nose, Head and Body before the framework is complete. Other patterns follow later.'],
      'lesson-framework':['Lijn na lijn · het karkas Neus en Romp','Ik volg eerst Neus, Kop, Nek, Romp, Kruis en Been. LKL loopt uit tot half Been; harder gaat naar het afzonderlijke patroon 6–7 banden. De bal bouwt het spoor in die vaste volgorde op, zonder keuzevragen. Het karkas is wat je ziet: Neus en Romp. Herken eerst op welk spoor bal 3 ligt en of bal 1 op de bijbehorende Neus ligt. Daar komt later bij wat je doet: je eigen afstoot en de vraag waar jouw Kop A ligt. Voor een complete eigen meetbasis zijn Neus, Romp en aanvullend Kop R of A nodig. Meet eerst de gekozen basislijn op je tafel en voer de meetgegevens van alle drie in. Kop V voert je niet in: die wordt berekend. Voor Kop meet je R of A. Voor de Romp observeert je je eigen afstoot: meet V langs het bekende kijkpunt A, dan berekent de app R; een aparte R-meting is dan niet nodig. Het gaat om je eigen waarnemingen; de Kruinwaarden zijn het startvoorbeeld. Je mag tussentijds bewaren als concept. Zolang je eigen metingen van alle drie niet compleet zijn, blijft Kruin voor dit spoor actief.','LKL requires measured Nose, Head and Body. Head V is calculated; measure Head R or A. Observe Body V from the known viewing point A to calculate R; a separate R measurement is not required. Only your own recorded measurements complete the User framework. Partial work is saved as a draft while Kruin remains active.'],
      'lesson-head-measure':['Latere meetles · waar ligt mijn Kop A?','Het zichtbare karkas is Neus en Romp. Nu onderzoek je wat je eigen afstoot doet: waar ligt mijn Kop A op de noordelijke stiplijn? Tot die eigen meting bekend is, blijft Kruins Kop het aangegeven uitgangspunt. '+instructions.kop,'Measure Head R with markers on the north cushion edge: the marker falling perpendicular to the cushion identifies the contact. Enter R to calculate A. Alternatively walk alongside and sight along Head V–A, enter A to calculate R. Head V is always calculated.'],
      'lesson-record-body':['Romp meten · kijken vanaf de zuidband',instructions.romp,'Your shot supplies the actual Body line. Observe Body V on the east diamond line from the known viewing point A at the south cushion. Enter V to calculate R with that known A; no separate R measurement is required. Record A if the viewing point changes.'],
      'lesson-neck-departure':['Eigen meetbasis compleet? Dan de afgeleide waarden','Controleer de meetgegevens van Neus, Kop en Romp. Zonder Kop R of A ontbreekt een meetanker, ook als de app al een voorbeeld tekent. Met de complete meetgegevens berekent de app onder meer Kop V en de Nek-waarden. Handmatige invoer staat vet; berekende waarden normaal. De lijnen delen steeds dezelfde bandbal.','Check measurements for Nose, Head and Body. Without Head R or A an anchor is missing, even if an example is drawn. Complete measurements determine Head V and Neck values. Manual input is bold; calculated values are regular.'],
      'lesson-five-finish':['LKL · is je eigen meetbasis compleet?','Controleer op de basislijn: Neus gemeten, Kop R of A gemeten, je Romp V gemeten vanuit bekend kijkpunt A (of je gemeten R ingebracht). Kop V blijft berekend. Bewaar het spoor en herhaal de stoot aan tafel. Vergelijk de meting, de getekende lijn en de herkomstmarkering. Als deze werkwijze goed werkt, onderzoeken we andere patronen afzonderlijk.','Check the base track: measured Nose, measured Head R or A, and your measured Body V with known viewing point A, or your measured R. Head V remains calculated. Save and repeat on the real table before extending to other patterns.']
    };
    changes['lesson-roll-at-first']=['Romp waarnemen · je afstoot',instructions.romp,'Observe your actual shot from the known viewing point A at the south cushion. Record Body V at the east diamond line; calculate R with known A.'];
    changes['lesson-repeat-body']=['Herhaal de metingen van je karkas','Herhaal dezelfde LKL-basislijn vanuit dezelfde startpositie en met zo gelijk mogelijke afstoot. Controleer Neus, meet Kop R of A en observeer je Romp V vanaf het bekende kijkpunt A. Vergelijk de werkelijk gespeelde lijnen met de ingevoerde meetgegevens. Berekende waarden hoef je niet opnieuw als losse metingen in te voeren.','Repeat the same LKL base track from the same start with comparable shots. Check Nose, measure Head R or A, and observe Body V from known viewing point A. Compare actual lines with the recorded measurements.'];
    const lklLevel=(course.levels||[]).find(l=>l.key==='LKL');if(lklLevel&&!lklLevel.slides.some(s=>s.key==='lesson-kruin-transfer'))lklLevel.slides.push({key:'lesson-kruin-transfer',title:{nl:'Na je basis · Kruins gemeten +/−-reeks overnemen',en:'After your base · transfer Kruin’s measured +/− series'},text:{nl:'Meet eerst je eigen LKL-basis, bijvoorbeeld VIJF op Klein: Neus, Kop en Romp. Tot je eigen verplichte meetinvoer compleet is, blijft de Kruinconfiguratie voor dat spoor gelden. Kruin heeft ook de +/−-sporen uitgemeten. Met Kruin VIJF, Kruin VIJF+2 en jouw gemeten VIJF berekent de app een voorstel voor jouw VIJF+2: jouw basis plus het gemeten verschil bij Kruin. In het meetbasisscherm kies je Voorstel +/− bekijken, controleert de aankomsten en neemt het voorstel expliciet over. Die reeks is afgeleid uit je basis en Kruins meetserie; zij is geen nieuwe serie eigen metingen. Het grote plaatje is zo al beschikbaar en je hoeft niet standaard alle varianten opnieuw te testen. Wil je meer weten, kies dan gericht extra metingen. Bestaande eigen meetinvoer wordt niet vervangen. Bij ontbrekende referenties of een bandwissel vraagt het voorstel om een eigen meting. Verander je later je basis, dan moet je het voorstel opnieuw beoordelen.',en:'First measure your own LKL base: Nose, Head and Body. Until complete, Kruin remains active. Kruin has measured the +/− tracks. Review and explicitly accept a proposal: your base plus Kruin’s measured difference. Transferred values are derived, not new personal measurements. Inspect arrivals first and optionally add targeted tests. Existing personal measurements are preserved; changed bases require a new proposal.'},image:{source:'text'}});
    const routeCard=(course.levels||[]).find(l=>l.key==='LKL')?.slides?.find(s=>s.key==='route-names-three-minus-plus');if(routeCard)changes[routeCard.key]=[routeCard.title.nl,routeCard.text.nl.replace('LKL gebruikt Neus–Romp als karkas.','LKL gebruikt Neus en Romp als zichtbaar karkas; Kop R of A is een aanvullende meting voor je eigen verloop.'),routeCard.text.en.replace('LKL uses the Nose–Body framework.','LKL uses the measured Nose–Head–Body framework.')];
    for(const level of course.levels||[])if(level.key==='LKL')for(const slide of level.slides||[]){const change=changes[slide.key];if(!change)continue;course.previousCardsLklMeasurements[slide.key]=JSON.parse(JSON.stringify(slide));slide.title={...slide.title,nl:change[0]};slide.text={nl:change[1],en:change[2]};if(['lesson-framework','lesson-five-finish'].includes(slide.key)&&slide.image)slide.image.parts=['neus','romp'];if(slide.key==='lesson-five-goal'&&slide.image)slide.image.parts=['neus'];if(['lesson-roll-at-first','lesson-repeat-body'].includes(slide.key)&&slide.image)delete slide.image.measurement;if(slide.key==='lesson-head-measure'&&slide.image){slide.image.parts=['neus','kop'];delete slide.image.measurement;}}
  }
  return {status,entered,routeStatus,prepareUserState,kruinRoute,signature,validTransfer,invalidateTransfers,proposal,accept,instructions,applyCourse};
})();
if(typeof window!=='undefined')window.ThreeBLklKarkas=ThreeBLklKarkas;
if(typeof module!=='undefined')module.exports=ThreeBLklKarkas;

/* qrcode-generator 1.4.4 (npm), MIT
MIT License

Copyright (c) 2009 Kazuhiko Arase

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  }
}(function () {
    return qrcode;
}));

/* A small, allowlisted view snapshot. No measurements, files, tokens or account state. */
window.ThreeBMobileView=(()=>{
  const enums={t:['klein','groot','beide'],e:['klein','groot'],s:['tables','balls','tracks'],p:['lkl','sixSeven','vrij'],d:['west','oost'],f:['parallel','waaier'],w:['whole','line','arrivals','bandballs']};
  function clean(raw){if(!raw||raw.v!==1)return null;const out={v:1};for(const [key,values]of Object.entries(enums)){if(!values.includes(raw[key]))return null;out[key]=raw[key];}if(typeof raw.k!=='string'||!/^[-A-Z0-9_+]{1,40}$/.test(raw.k)||typeof raw.r!=='boolean'||!Number.isInteger(raw.n)||raw.n<0||raw.n>6)return null;out.k=raw.k;out.r=raw.r;out.n=raw.n;return out;}
  function encode(raw){const value=clean(raw);if(!value)throw Error('Ongeldige tafel-view.');return btoa(JSON.stringify(value)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function decode(value){try{if(typeof value!=='string'||value.length>1800||!/^[A-Za-z0-9_-]+$/.test(value))return null;return clean(JSON.parse(atob(value.replace(/-/g,'+').replace(/_/g,'/'))));}catch(_){return null;}}
  function image(url){const code=qrcode(0,'M');code.addData(url);code.make();return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(code.createSvgTag({cellSize:5,margin:20,scalable:true}));}
  function link(url,view){const target=new URL(url);const hash=new URLSearchParams(target.hash.slice(1));hash.set('tableView',encode(view));target.hash=hash.toString();return target.href;}
  function qrPage(){const raw=new URLSearchParams(location.hash.slice(1)).get('tableView'),view=decode(raw);if(!view)return;const open=document.querySelector('a[href*="open.html"]'),img=document.querySelector('img');if(!open||!img)return;open.href=link(open.href,view);img.src=image(open.href);img.alt='QR-code met de gekozen tafel-view';const p=document.createElement('p');p.textContent='Deze QR neemt tafelkeuze, spoor en schaal mee. Metingen en toegangstokens worden niet verstuurd.';document.body.append(p);}
  return {clean,encode,decode,image,link,qrPage};
})();

/* Physical phone testing: show the project's published QR, without changing app state. */
if(typeof window!=='undefined'){
  window.installMobileTestQr=function({button,imageUrl,testUrl,qrPageUrl,getView}){
    if(!button)return;
    let dialog=document.getElementById('mobileQrDialog');
    if(!dialog){
      const style=document.createElement('style');style.textContent='#mobileQrDialog{width:min(94vw,440px);max-height:92dvh;box-sizing:border-box;overflow:auto;padding:16px;border:1px solid #82958b;border-radius:12px;background:#fff;color:#142e24;font:16px system-ui;text-align:center}#mobileQrDialog::backdrop{background:#0006}#mobileQrDialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}#mobileQrDialog h2{font:700 20px system-ui;margin:0}#mobileQrDialog button{min-width:44px;min-height:44px;font:20px system-ui;color:#142e24;background:#f1f5f2;border:1px solid #82958b;border-radius:6px}#mobileQrDialog img{display:block;width:100%;height:auto;max-width:410px;margin:12px auto;background:#fff}#mobileQrDialog p{font:14px/1.4 system-ui;margin:10px 0}#mobileQrDialog a{color:#1552a0;text-decoration:underline}';document.head.append(style);
      dialog=document.createElement('dialog');dialog.id='mobileQrDialog';dialog.setAttribute('aria-labelledby','mobileQrTitle');
      const header=document.createElement('header'),title=document.createElement('h2'),close=document.createElement('button');title.id='mobileQrTitle';title.textContent='Test op je telefoon';close.type='button';close.textContent='×';close.setAttribute('aria-label','QR sluiten');close.onclick=()=>dialog.close();header.append(title,close);
      const img=document.createElement('img');img.id='mobileViewQrImage';img.src=imageUrl;img.alt='QR-code om dit project op je telefoon te openen';
      const instruction=document.createElement('p');instruction.textContent='Scan met de camera van je telefoon. Test staand én liggend.';
      const links=document.createElement('p'),large=document.createElement('a'),open=document.createElement('a');large.id='mobileViewQrLarge';large.href=qrPageUrl;large.textContent='QR groot openen';large.target='_blank';large.rel='noopener';open.id='mobileViewQrOpen';open.href=testUrl;open.textContent='Open de site';open.target='_blank';open.rel='noopener';links.append(large,document.createTextNode(' · '),open);
      const note=document.createElement('p');note.id='mobileViewQrNote';note.textContent='De QR opent de site; eigen gegevens en instellingen worden niet automatisch overgenomen.';
      dialog.append(header,instruction,img,links,note);document.body.append(dialog);
    }
    button.textContent='QR · Test op telefoon';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','mobileQrDialog');button.onclick=()=>{if(getView){try{const view=getView(),url=window.ThreeBMobileView.link(testUrl,view),page=new URL(qrPageUrl);page.hash=new URLSearchParams({tableView:window.ThreeBMobileView.encode(view)}).toString();dialog.querySelector('#mobileViewQrImage').src=window.ThreeBMobileView.image(url);dialog.querySelector('#mobileViewQrOpen').href=url;dialog.querySelector('#mobileViewQrLarge').href=page.href;dialog.querySelector('#mobileViewQrNote').textContent='Deze mobiele test neemt de huidige tafel-view over: tafelkeuze, spoor en schaal. De indeling past zich aan je telefoon aan. Metingen en toegangstokens worden niet verstuurd; gebruik dezelfde meetbasis op beide apparaten.';}catch(e){dialog.querySelector('#mobileViewQrImage').src=imageUrl;dialog.querySelector('#mobileViewQrOpen').href=testUrl;dialog.querySelector('#mobileViewQrLarge').href=qrPageUrl;dialog.querySelector('#mobileViewQrNote').textContent='De tafel-view kon niet worden meegenomen. Deze QR opent alleen de site, zonder je huidige tafel-view.';if(!dialog.open)dialog.showModal();return;}}if(!dialog.open)dialog.showModal();};
  };
  const script=document.currentScript;
  if(script?.dataset.testUrl){
    const setup=()=>{const button=document.createElement('button');button.id='openMobileQr';button.type='button';button.style.cssText='position:fixed;right:12px;top:12px;z-index:3000;min-height:44px;padding:8px 14px;border:1px solid #82958b;border-radius:8px;background:white;color:#142e24;font:700 15px system-ui';document.body.append(button);window.installMobileTestQr({button,imageUrl:new URL(script.dataset.qrImage,script.src).href,testUrl:script.dataset.testUrl,qrPageUrl:new URL(script.dataset.qrPage,script.src).href});};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
  }
}

/* Test release freshness, separate from the SQLite blob revision. No automatic reload. */
(() => {
 'use strict';let last=null,pending;
 const latestUrl=()=>{const u=new URL('open.html',location.href);if(new URLSearchParams(location.search).get('mode')==='user')u.searchParams.set('mode','user');u.hash=location.hash;return u.href;};
 function paint(){if(!document.body)return;let box=document.getElementById('testUpdateNotice');if(last?.ok){box?.remove();return;}if(!last)return;if(!box){box=document.createElement('section');box.id='testUpdateNotice';box.setAttribute('role','alert');box.style.cssText='position:fixed;left:8px;right:8px;bottom:8px;z-index:7000;max-width:760px;margin:auto;padding:12px;box-sizing:border-box;background:#fff0c2;color:#142e24;border:2px solid #a66b14;border-radius:8px;font:15px/1.4 system-ui;box-shadow:0 3px 16px #0004';const text=document.createElement('span');text.className='version-message';const button=document.createElement('button');button.type='button';button.textContent='Nieuwste testversie openen';button.style.cssText='min-height:44px;margin:8px 0 0;padding:8px';button.onclick=()=>{if(window.hasThreeBSpoorChanges?.()&&!confirm('Nieuwste versie openen? Invoer die nog niet is bewaard kan verloren gaan.'))return;location.assign(latestUrl());};box.append(text,document.createElement('br'),button);document.body.append(box);}box.querySelector('.version-message').textContent=last.message;}
 async function check(){if(!window.THREEB_TEST_ENVIRONMENT)return {ok:true};if(pending)return pending;pending=(async()=>{const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),8000);try{const u=new URL('RELEASE.json',location.href);u.searchParams.set('check',String(Date.now()));const response=await fetch(u,{cache:'no-store',credentials:'omit',signal:abort.signal});if(!response.ok)throw Error();const release=await response.json();if(!/^v\d+-r\d+$/.test(release.version))throw Error();const current=window.THREEB_RELEASE?.version;last={ok:release.version===current,version:release.version,message:release.version===current?'':'Deze tab gebruikt '+current+'; op test staat '+release.version+'. Bewaren op GitHub is geblokkeerd. Je werk blijft behouden; open de nieuwste testversie.'};}catch(_){last={ok:false,message:'De actuele appversie kan niet worden gecontroleerd. Bewaren op GitHub is tijdelijk geblokkeerd; je werk blijft behouden. Controleer de verbinding en probeer opnieuw.'};}finally{clearTimeout(timer);pending=null;}paint();return last;})();return pending;}
 async function assertCurrent(){const result=await check();if(!result.ok)throw Object.assign(Error(result.message),{stale:true});}
 window.ThreeBReleaseGuard={check,assertCurrent,get status(){return last;}};
 const init=()=>{if(!window.THREEB_TEST_ENVIRONMENT)return;const u=new URL(location.href);if(u.searchParams.has('v')||u.searchParams.has('_refresh')){u.searchParams.delete('v');u.searchParams.delete('_refresh');history.replaceState(history.state,'',u.href);}setTimeout(()=>{if(document.body.classList.contains('database-not-open')){const style=document.createElement('style');style.textContent='body.test-status-hidden #testEnvironmentBanner{display:none!important}';document.head.append(style);document.body.classList.add('test-status-hidden');document.documentElement.style.setProperty('--threeb-test-banner-height','0px');}},7000);check();};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();window.addEventListener('focus',()=>{if(window.THREEB_TEST_ENVIRONMENT)check();});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&window.THREEB_TEST_ENVIRONMENT)check();});
})();

/* Fixed private SQLite endpoint; token stays in this page's memory only. */
(() => {
 'use strict';
 const endpoint='https://api.github.com/repos/kruin/3b-kruin-beheer/contents/Kruinconfig.sqlite3',limit=32*1024*1024;let token='';
 const fail=(message,status)=>Object.assign(Error(message),{status});
 async function request(method='GET',body,raw=false){
  if(!token)throw fail('Verbind eerst met GitHub via je toegangstoken.',401);
  const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),30000);
  try{const r=await fetch(endpoint+(method==='GET'?'?ref=main':''),{method,headers:{Authorization:'Bearer '+token,Accept:raw?'application/vnd.github.raw+json':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),credentials:'omit',cache:'no-store',redirect:'error',signal:abort.signal});
   if(!r.ok){if(r.status===401)token='';throw fail(r.status===401?'GitHub-toegang verlopen of ongeldig. Verbind opnieuw.':r.status===403?'GitHub weigert toegang. Controleer repositorykeuze, Contents: Read and write en eventuele token-goedkeuring.':r.status===404?'Private database niet toegankelijk. Controleer eigenaar en repositorykeuze van je token.':[409,422].includes(r.status)?'GitHub is intussen gewijzigd. Er is niets overschreven. Open eerst de actuele GitHub-versie.':'GitHub-aanvraag mislukt ('+r.status+').',r.status);}
   return raw?new Uint8Array(await r.arrayBuffer()):await r.json();
  }catch(e){if(e.status)throw e;throw fail('GitHub niet bereikbaar. Controleer je verbinding en probeer opnieuw.',0);}finally{clearTimeout(timer);}
 }
 const decode=text=>Uint8Array.from(atob(text.replace(/\s/g,'')),c=>c.charCodeAt(0));
 const encode=bytes=>{let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(text);};
 const equal=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
 async function read(){const info=await request();if(!info.sha||info.type!=='file'||info.size>limit)throw fail('GitHub-bestand ontbreekt of is groter dan 32 MB.',0);const bytes=info.encoding==='base64'&&info.content?decode(info.content):await request('GET',null,true);if(bytes.length>limit)throw fail('GitHub-bestand is groter dan 32 MB.',0);return {bytes,sha:info.sha};}
 async function write(bytes,sha,message){
  await window.ThreeBReleaseGuard?.assertCurrent();
  const current=await read();if(equal(current.bytes,bytes))return {...current,verified:true};
  if(current.sha!==sha)throw fail('GitHub is intussen gewijzigd. Je werk is behouden; er is niets overschreven. Open eerst de actuele GitHub-versie.',409);
  try{const result=await request('PUT',{message,content:encode(bytes),sha,branch:'main'});if(!result.content?.sha)throw fail('GitHub-bevestiging ontbreekt.',0);return {sha:result.content.sha,commit:result.commit?.sha,verified:true};}
  catch(error){if(error.status)throw error;try{const actual=await read();if(equal(actual.bytes,bytes))return {...actual,verified:true};}catch(_){}error.uncertain=true;error.message='Uitkomst GitHub-bewaring onbekend. Je wijzigingen zijn lokaal behouden. Verbind opnieuw om de GitHub-versie te controleren; niet blind opnieuw uploaden.';throw error;}
 }
 window.ThreeBGitHub={async connect(value){token=String(value||'').trim();try{return await read();}catch(e){token='';throw e;}},read,write,disconnect(){token='';},get connected(){return Boolean(token);}};
})();

/* Owner-only SQLite file workspace. No server, credentials, or database upload. */
(() => {
  'use strict';
  const key='3b-canonical-west-v2',clone=x=>JSON.parse(JSON.stringify(x)),parts=['neus','kop','nek','romp','kruis','been','hiel','voet','teen'],bands=['west','noord','oost','zuid'],arrivals=['west','noord','oost','zuid','west','oost','noord','zuid','west'];
  const fields={band:'band',value:'waarde',kind:'kind',status:'status',source:'herkomst',userAdjusted:'bewerkt',measurement:'meting',calculationBasis:'berekenbasis'};
  let sql,db,record,store,busy=false,contentFingerprint=null;
  const enabled=()=>Boolean(window.THREEB_TEST_ENVIRONMENT)&&new URLSearchParams(location.hash.slice(1)).get('owner')==='kruin';
  const ready=()=>sql??=window.initSqlJs();
  const rows=(query,args=[])=>{const s=db.prepare(query);try{s.bind(args);const out=[];while(s.step())out.push(s.getAsObject());return out;}finally{s.free();}};
  const setting=name=>rows('SELECT waarde FROM instellingen WHERE sleutel=?',[name])[0]?.waarde;
  const hash=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
  async function storage(){if(store)return store;store=await new Promise((ok,no)=>{const r=indexedDB.open('3b-sqlite-workspace:'+location.pathname,1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(Error('Werkbestandopslag is niet beschikbaar.'));});return store;}
  async function get(){const s=await storage();return new Promise((ok,no)=>{const r=s.transaction('files').objectStore('files').get('active');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
  async function put(value,archive){const s=await storage();return new Promise((ok,no)=>{const t=s.transaction('files','readwrite'),o=t.objectStore('files');if(archive)o.put(archive,'archive:'+Date.now());value?o.put(value,'active'):o.delete('active');t.oncomplete=ok;t.onerror=()=>no(Error('Werkdatabase kon niet duurzaam in de browser worden opgeslagen. Download je bestaande bestand.'));t.onabort=()=>no(Error('Databaseopslag afgebroken.'));});}
  function validate(){if(rows('PRAGMA quick_check')[0]?.quick_check!=='ok')throw Error('SQLite-bestand is beschadigd.');for(const name of ['basissen','instellingen','sporen','lijnpunten','menu','patronen','neuscorrectie','overzichten'])if(!rows("SELECT name FROM sqlite_master WHERE type='table' AND name=?",[name]).length)throw Error('Dit is geen volledige Kruinconfig-database.');if(rows('PRAGMA foreign_key_check').length)throw Error('Database bevat ongeldige verwijzingen.');db.run('PRAGMA foreign_keys=ON');}
  function point(r){if(!r||r.is_null&&r.band===null&&r.waarde===null&&r.start===null)return null;const p=JSON.parse(r.extra_json||'{}');for(const [field,col] of Object.entries(fields)){const v=r[col];if(field==='value')p.value=r.kind==='acquit'?r.start:v;else if(v!==null)p[field]=['measurement','userAdjusted'].includes(field)?Boolean(v):v;}return p;}
  async function source(){
    const basis=setting('standaard_basis'),b=rows('SELECT * FROM basissen WHERE id=?',[basis])[0];if(!b)throw Error('De standaardbasis ontbreekt.');
    const k={release:Number(window.THREEB_RELEASE?.version.match(/^v(\d+)/)?.[1]||208),source:'SQLite-werkbestand',beheerBasis:basis,beheerRevision:'werkbestand:'+await hash(record.bytes),tracks:{klein:{},groot:{}},savedSpoorValues:[],onscreenMenu:{safeGapPx:b.veilige_afstand,zones:['top','left','right','bottom'],groups:{}}};
    for(const name of ['startAcquitRoutes','startAcquitLengths','spoorLineNotes']){const text=setting(name+':'+basis);if(text)k[name]=JSON.parse(text);}
    k.startAcquitOffset=0;k.noseLengthCorrection={};for(const r of rows('SELECT * FROM neuscorrectie WHERE basis_id=?',[basis]))k.noseLengthCorrection[r.tafel]=JSON.parse(r.config_json);
    k.patternSettings={};for(const r of rows('SELECT * FROM patronen WHERE basis_id=?',[basis]))k.patternSettings[r.patroon]={labels:{nl:r.naam},endLine:r.eindlijn,extraRunOutCm:r.uitloop_cm,framework:JSON.parse(r.karkas_json)};
    for(const r of rows('SELECT * FROM sporen WHERE basis_id=?',[basis])){
      if(!k.tracks[r.tafel])throw Error('Onbekende tafel in werkbestand.');const spec=JSON.parse(r.extra_json||'{}');Object.assign(spec,{crossAngleDeg:r.kruis_hoek,crossArrivalBand:r.kruis_band});if(r.kruis_loop)spec.crossLoopOverride=r.kruis_loop;
      const raw=rows('SELECT * FROM lijnpunten WHERE basis_id=? AND tafel=? AND spoor=?',[basis,r.tafel,r.spoor]),p={};for(const row of raw)p[row.lijn+row.kant]=point(row);
      for(let i=0;i<parts.length;i++){const line=parts[i];let a=p[line+'A'];if(!a)a={band:line==='kruis'?r.kruis_band:arrivals[i],value:null,status:['nek','kruis','hiel','voet','teen'].includes(line)?'calculated':'approved',source:'automatic'};else if(!a.band)a.band=line==='kruis'?r.kruis_band:arrivals[i];if(a.source==='automatic'&&line==='kruis')a.band=r.kruis_band;p[line+'A']=a;if(i){let v=p[line+'V'];const prev=p[parts[i-1]+'A'];if(!v)v={band:prev.band,value:null,status:'calculated',source:'automatic'};else if(v.status==='calculated'&&!v.userAdjusted||!v.band)v.band=prev.band;p[line+'V']=v;}}
      spec.linePoints={};for(const line of parts){const pair={};if(p[line+'V'])pair.from=p[line+'V'];if(p[line+'A'])pair.to=p[line+'A'];if(Object.keys(pair).length)spec.linePoints[line]=pair;}
      for(const [name,line,side] of [['neusA','neus','to'],['kopA','kop','to'],['nekA','nek','to'],['rompV','romp','from'],['rompA','romp','to'],['beenA','been','to']])if(spec.linePoints[line]?.[side])spec[name]=clone(spec.linePoints[line][side]);
      k.tracks[r.tafel][r.spoor]=spec;if(r.afstoot_cm!==null){k.strokeLengthsCm??={};(k.strokeLengthsCm[r.tafel]??={})[r.spoor]=r.afstoot_cm;}
    }
    for(const r of rows('SELECT * FROM menu WHERE basis_id=?',[basis]))k.onscreenMenu.groups[r.groep]={zone:r.zone,order:r.volgorde,visible:Boolean(r.zichtbaar)};
    for(const r of rows('SELECT snapshot FROM overzichten WHERE basis_id=?',[basis]))k.savedSpoorValues.push(JSON.parse(r.snapshot));return k;
  }
  async function fingerprint(){const content=[];for(const {name} of rows("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")){const quoted='"'+name.replaceAll('"','""')+'"';let result;try{result=db.exec('SELECT * FROM '+quoted+' ORDER BY rowid')[0];}catch(_){result=db.exec('SELECT * FROM '+quoted)[0];}const columns=rows('PRAGMA table_info('+quoted+')').map(r=>r.name),values=(result?.values||[]).filter(r=>name!=='instellingen'||r[0]!=='approval_notices_v208');content.push([name,columns,values]);}return hash(new TextEncoder().encode(JSON.stringify(content)));}
  function originStatus(){const badge=document.getElementById('databaseOriginBadge');if(!badge)return;const ref=window.THREEB_DB_SOURCE;if(record?.github){const g=record.github;badge.textContent=g.conflict?'GitHub gewijzigd · heropenen vereist':!window.ThreeBGitHub.connected?'GitHub-werkbestand · opnieuw verbinden':g.pending?'Niet op GitHub bevestigd · werk behouden':'GitHub-werkbestand · gecontroleerd/bewaard';badge.style.background=g.conflict||!window.ThreeBGitHub.connected||g.pending?'#fff0c2':'#dcefe0';badge.title='GitHub-bestandsrevisie: '+g.sha;const detail=document.getElementById('databaseOriginDetail');if(detail)detail.textContent='GitHub-revisie '+g.sha.slice(0,12)+' · gecontroleerd '+new Date(g.verifiedAt).toLocaleString()+'. Bewaar spoor controleert op wijzigingen voordat het op GitHub schrijft.';return;}if(!record){badge.textContent='Nog geen database gekozen';badge.style.background='#e4ece5';return;}const same=contentFingerprint&&contentFingerprint===ref?.fingerprint;badge.textContent=same?'GitHub-bron · ongewijzigde werkkopie — upload niet nodig':record.savedAt?'Lokale wijzigingen · GitHub niet gecontroleerd':'Andere databaseversie · GitHub niet gecontroleerd';badge.style.background=same?'#dcefe0':'#fff0c2';badge.title='Vergelijking met de bron bij bouwen van '+(ref?.version||'de testversie')+' ('+(ref?.date||'')+'). Geen live GitHub-controle. Bron: '+(ref?.fingerprint||'onbekend')+'; werkdatabase: '+(contentFingerprint||'onbekend');const detail=document.getElementById('databaseOriginDetail');if(detail)detail.textContent='Bron bij '+(ref?.version||'deze testversie')+': '+(ref?.fingerprint?.slice(0,12)||'onbekend')+' · geen live GitHub-controle. Bewaren op dit apparaat is geen upload.';}
  function compactUi(){
    const panel=document.getElementById('databaseWorkspace');if(!panel)return;const connected=Boolean(record?.github&&window.ThreeBGitHub.connected),needsConnection=!record||!connected;
    document.getElementById('databaseConnectArea').hidden=!needsConnection;document.getElementById('databaseIntro').hidden=Boolean(record);
    const badge=document.getElementById('databaseOriginBadge');badge.hidden=!record||Boolean(record.github&&connected&&!record.github.pending&&!record.github.conflict);
    const status=document.getElementById('databaseWorkspaceStatus');status.hidden=connected&&!record.github.pending&&!record.github.conflict&&!/mislukt|geblokkeerd|onbekend|weigert|verlopen|kon niet|afwijkt|intussen/i.test(status.textContent);
    const tools=document.getElementById('databaseTools'),button=document.getElementById('databaseManage');button.setAttribute('aria-expanded',String(tools.open));
  }
  function notify(message){const node=document.getElementById('databaseWorkspaceStatus');if(node)node.textContent=message;const modalStatus=document.getElementById('githubConnectionStatus');if(modalStatus)modalStatus.textContent=message;originStatus();compactUi();window.dispatchEvent(new Event('threeb-database-state'));}
  async function restore(){if(!enabled())return;try{record=await get();if(record){const SQL=await ready();db?.close();db=new SQL.Database(new Uint8Array(record.bytes));validate();contentFingerprint=await fingerprint();window.THREEB_KRUIN_VALUES=await source();}}catch(e){db?.close();db=null;record=null;window.ThreeBDatabaseWorkspace.error=e.message;}document.body.classList.toggle('database-not-open',!record);document.body.classList.toggle('database-workspace',Boolean(record));if(!record)window.THREEB_KRUIN_VALUES=null;mount();}
  async function open(file,{github=null,startInPlace=false}={}){if(window.hasThreeBSpoorChanges?.())throw Error('Bewaar je spoorwijzigingen of kies Herlaad voordat je een database opent.');if(busy)return;busy=true;const old=db,oldRecord=record;try{const bytes=new Uint8Array(await file.arrayBuffer());if(bytes.byteLength>32*1024*1024)throw Error('Database is groter dan 32 MB.');const SQL=await ready();db=new SQL.Database(bytes);validate();record={bytes,name:file.name,openedAt:new Date().toISOString(),backupState:oldRecord?oldRecord.backupState:localStorage.getItem(key),backupSession:oldRecord?.backupSession??Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)).filter(k=>k.includes('experiment:')).map(k=>[k,sessionStorage.getItem(k)])};await source();if(github){contentFingerprint=await fingerprint();record.github={...github,syncedFingerprint:contentFingerprint};}await put(record,oldRecord);for(const k of Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)))if(k.includes('experiment:'))sessionStorage.removeItem(k);localStorage.removeItem(key);if(startInPlace){document.getElementById('databaseWorkspace')?.remove();document.getElementById('databaseMobileToggle')?.remove();const src=[...document.scripts].find(s=>s.src.includes('/app-v208.js'))?.src;if(!src)throw Error('Heropen de testpagina om de database te starten.');const script=document.createElement('script');script.src=src;document.body.append(script);}else location.reload();}catch(e){if(db!==old)db?.close();db=old;record=oldRecord;notify(e.message);throw e;}finally{busy=false;}}
  function download(bytes,name){const url=URL.createObjectURL(new Blob([bytes],{type:'application/vnd.sqlite3'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  function putPoint(basis,table,track,line,side,p){
    const extra=Object.fromEntries(Object.entries(p).filter(([k])=>!Object.hasOwn(fields,k)));const values=[basis,table,track,line,side,p.band??null,p.kind==='acquit'?null:p.value??null,p.kind==='acquit'?String(p.value):null,p.kind??null,p.status??null,p.source??null,p.userAdjusted===undefined?null:Number(p.userAdjusted),p.measurement===undefined?null:Number(p.measurement),p.calculationBasis??null,0,JSON.stringify(extra)];
    db.run('INSERT INTO lijnpunten VALUES('+values.map(()=>'?').join(',')+') ON CONFLICT(basis_id,tafel,spoor,lijn,kant) DO UPDATE SET band=excluded.band,waarde=excluded.waarde,start=excluded.start,kind=excluded.kind,status=excluded.status,herkomst=excluded.herkomst,bewerkt=excluded.bewerkt,meting=excluded.meting,berekenbasis=excluded.berekenbasis,is_null=excluded.is_null,extra_json=excluded.extra_json',values);
  }
  function showConnection(){
    let dialog=document.getElementById('githubConnectionDialog');if(dialog?.open)return;
    const form=document.querySelector('.db-github-connect');if(!form)return;
    if(!dialog){dialog=document.createElement('dialog');dialog.id='githubConnectionDialog';dialog.style.cssText='width:min(94vw,480px);max-height:90dvh;overflow:auto;box-sizing:border-box;padding:16px;background:#f4effc;color:#142e24;border:1px solid #8064a6;border-radius:10px;font:16px/1.5 system-ui';const heading=document.createElement('h2');heading.textContent='GitHub verbinden';heading.style.fontSize='20px';const close=document.createElement('button');close.type='button';close.textContent='Sluiten';close.onclick=()=>dialog.close();const status=document.createElement('p');status.id='githubConnectionStatus';status.setAttribute('role','status');dialog.append(heading,close,status);document.body.append(dialog);}
    const anchor=document.createComment('github-connection-home');form.before(anchor);dialog.append(form);dialog.addEventListener('close',()=>{document.getElementById('githubAccessToken').value='';anchor.replaceWith(form);},{once:true});dialog.showModal();document.getElementById('githubAccessToken').focus();
  }
  async function connectGithub(){
    if(busy)throw Error('Wacht tot de databasebewerking klaar is.');if(window.hasThreeBSpoorChanges?.()&&!record?.github)throw Error('Bewaar of herlaad eerst je openstaande spoorwijzigingen.');
    try{await window.ThreeBReleaseGuard?.assertCurrent();}catch(e){notify(e.message);throw e;}const field=document.getElementById('githubAccessToken'),value=field.value;field.value='';busy=true;
    try{notify('GitHub-database openen…');const remote=await window.ThreeBGitHub.connect(value),SQL=await ready(),old=db;let remoteFingerprint;try{db=new SQL.Database(remote.bytes);validate();remoteFingerprint=await fingerprint();}finally{if(db!==old)db?.close();db=old;}
      if(record){if(contentFingerprint!==remoteFingerprint&&record.github?.sha!==remote.sha){if(record.github){record={...record,github:{...record.github,conflict:true}};await put(record);}throw Error('Deze werkstand wijkt af van GitHub. Maak zo nodig een back-up en sluit het werkbestand; open daarna de actuele GitHub-database. Er is niets overschreven.');}record={...record,github:{sha:remote.sha,syncedFingerprint:remoteFingerprint,verifiedAt:new Date().toISOString(),pending:contentFingerprint!==remoteFingerprint}};await put(record);document.getElementById('githubConnectionDialog')?.close();notify(record.github.pending?'Verbonden; lokale wijzigingen zijn nog niet op GitHub bewaard.':'GitHub-database gecontroleerd en verbonden. Bewaar spoor bewaart rechtstreeks op GitHub.');return;}
      busy=false;await open(new File([remote.bytes],'Kruinconfig.sqlite3'),{github:{sha:remote.sha,verifiedAt:new Date().toISOString(),pending:false},startInPlace:true});
    }catch(e){notify(e.message);throw e;}finally{busy=false;}
  }
  async function commit({table,track,routeKey,route,length,changes=[],notes,runOutCm}){
    if(!db||!record)throw Error('Open eerst het GitHub-werkbestand.');if(record.github&&!window.ThreeBGitHub.connected)throw Error('Verbind opnieuw met GitHub om rechtstreeks te bewaren. Je spoorwijzigingen blijven staan.');if(busy)throw Error('Database wordt al bijgewerkt.');busy=true;const before=db.export(),oldRecord=record,oldFingerprint=contentFingerprint;let staged=false,keepPending=false;
    try{const basis=setting('standaard_basis');db.run('BEGIN');const trackRow=rows('SELECT * FROM sporen WHERE basis_id=? AND tafel=? AND spoor=?',[basis,table,track])[0];if(!trackRow)throw Error('Dit spoor ontbreekt in de database.');const extra=JSON.parse(trackRow.extra_json);if(runOutCm!==undefined){if(!track.startsWith('ZESZEVEN')||!Number.isFinite(runOutCm)||runOutCm<0||runOutCm>100)throw Error('Uitloop moet tussen 0 en 100 cm liggen.');extra.sixSevenRunOutCm=runOutCm;}
      for(const change of changes){if(change.side==='L'||change.side==='N')continue;const side=change.side==='V'?'V':'A';if(!parts.includes(change.line)||!bands.includes(change.point.band)||change.point.value!==null&&!Number.isFinite(change.point.value))throw Error('Ongeldig gemeten punt.');if(!routeKey.endsWith(':oost')){putPoint(basis,table,track,change.line,side,route[change.line][side==='V'?'from':'to']);if(extra.lineApprovals?.[change.line])extra.lineApprovals[change.line]=false;}}
      db.run('UPDATE sporen SET extra_json=? WHERE basis_id=? AND tafel=? AND spoor=?',[JSON.stringify(extra),basis,table,track]);
      for(const [name,value] of [['startAcquitRoutes',route],['startAcquitLengths',length]]){if(value===undefined)continue;const saved=JSON.parse(setting(name+':'+basis)||'{}');saved[routeKey]=value;db.run('INSERT OR REPLACE INTO instellingen(sleutel,waarde) VALUES(?,?)',[name+':'+basis,JSON.stringify(saved)]);}
      if(notes&&Object.keys(notes).length){const all=JSON.parse(setting('spoorLineNotes:'+basis)||'{}');all[routeKey]={...all[routeKey],...notes};db.run('INSERT OR REPLACE INTO instellingen(sleutel,waarde) VALUES(?,?)',['spoorLineNotes:'+basis,JSON.stringify(all)]);}
      if(rows('PRAGMA foreign_key_check').length)throw Error('Opslag bevat ongeldige verwijzingen.');db.run('COMMIT');record={...record,bytes:db.export(),savedAt:new Date().toISOString()};contentFingerprint=await fingerprint();if(record.github)record.github={...record.github,pending:true};await put(record);staged=true;
      if(record.github){let result;try{result=await window.ThreeBGitHub.write(record.bytes,oldRecord.github.sha,'Kruin: '+table+' '+track+' bewaren ('+(window.THREEB_RELEASE?.version||'test')+')');}catch(error){if(error.uncertain||error.stale){keepPending=true;notify(error.message);}throw error;}
        record={...record,github:{sha:result.sha,commit:result.commit||null,syncedFingerprint:contentFingerprint,verifiedAt:new Date().toISOString(),pending:false}};
        let cacheWarning=false;try{await put(record);}catch(_){cacheWarning=true;}
        notify('Op GitHub bewaard · '+result.sha.slice(0,8)+(cacheWarning?' · browsercache niet bijgewerkt; verbind na herladen opnieuw.':'. Geen download nodig.'));
      }else notify('Lokale back-up bijgewerkt op dit apparaat; niet op GitHub bewaard.');
    }catch(e){if(keepPending)throw e;try{db.run('ROLLBACK');}catch(_){}db.close();const SQL=await ready();db=new SQL.Database(before);record=oldRecord;contentFingerprint=oldFingerprint;validate();if(record.github&&[409,422].includes(e.status))record={...record,github:{...record.github,conflict:true}};if(staged||record.github?.conflict)try{await put(record);}catch(_){e.message+=' De browsercache kon niet worden hersteld; controleer de werkstand na herladen.';}notify(e.message);throw e;}finally{busy=false;}
  }
  async function close(){if(window.hasThreeBSpoorChanges?.())throw Error('Bewaar je spoorwijzigingen of kies Herlaad voordat je het werkbestand sluit.');if(!record)return;const old=record;await put(null,old);old.backupState===null?localStorage.removeItem(key):localStorage.setItem(key,old.backupState);for(const k of Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)))if(k.includes('experiment:'))sessionStorage.removeItem(k);for(const [k,v] of old.backupSession||[])sessionStorage.setItem(k,v);location.reload();}
  function mount(){if(!enabled()||!document.body||document.getElementById('databaseWorkspace'))return;const style=document.createElement('style');style.textContent='#databaseWorkspace .db-compact-header{display:flex;align-items:center;justify-content:space-between;gap:8px}#databaseWorkspace .db-compact-header button{min-height:40px;margin:0;padding:6px 12px}#databaseWorkspace [hidden]{display:none!important}#databaseWorkspace #databaseTools>summary{display:none}#databaseWorkspace #databaseOriginBadge{margin:8px 0 0}#databaseWorkspace #databaseWorkspaceStatus{margin:8px 0;font-size:14px}#databaseWorkspace .db-github-primary,#githubConnectionDialog .db-github-primary{display:block;box-sizing:border-box;padding:12px;min-height:44px;background:#176f4f;color:white;font-weight:700;text-align:center;text-decoration:none;border-radius:7px;margin:12px 0}#databaseWorkspace .db-source-help{margin:14px 0}body.database-workspace .table-file-tools{display:none!important}body.database-not-open{background:#eee9f7!important;min-height:100dvh}body.database-not-open> :not(#databaseWorkspace):not(#testEnvironmentBanner):not(#mobileQrDialog):not(#testUpdateNotice){display:none!important}body.database-not-open #databaseWorkspace{position:fixed!important;top:90px;left:50%;transform:translateX(-50%);width:min(520px,calc(100vw - 24px))!important;max-height:calc(100dvh - 110px);overflow:auto;margin:0!important;line-height:1.5;font:15px system-ui!important}body.database-not-open #testEnvironmentBanner{background:#4e347a!important;color:white!important;font:600 14px system-ui!important;padding:12px!important;text-align:center}body.database-not-open #testEnvironmentBanner a{color:white}body.database-not-open .db-workfile-actions{display:none}#databaseStartQr{width:100%;min-height:40px;margin-top:12px}.db-workfile-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:stretch;margin:12px 0}.db-workfile-actions button,.db-workfile-actions a{box-sizing:border-box;min-height:40px;margin:0!important}.db-workfile-actions a{display:flex;align-items:center;justify-content:center;padding:6px 8px;border:1px solid #b9accc;border-radius:8px;background:#fff;color:#142e24;text-align:center;text-decoration:none}.db-workfile-actions #closeDatabaseWorkspace{grid-column:1/-1}@media(max-width:999px),(pointer:coarse){body.database-workspace #databaseWorkspace{display:none;position:fixed!important;top:calc(var(--threeb-test-banner-height,48px) + 60px)!important;left:8px!important;right:8px!important;width:auto!important;max-width:none!important;max-height:calc(100dvh - var(--threeb-test-banner-height,48px) - 76px);overflow:auto;z-index:4000;margin:0!important;font:16px system-ui!important}body.database-workspace.database-panel-open #databaseWorkspace{display:block}#databaseMobileToggle{position:fixed;top:calc(var(--threeb-test-banner-height,48px) + 8px);left:8px;z-index:4001;min-height:44px;padding:8px 12px;border:1px solid #8064a6;border-radius:8px;background:#f4effc;color:#142e24;font:600 15px system-ui}#databaseWorkspace input[type=file]{min-height:48px;width:100%;font:16px system-ui}#databaseWorkspace summary{min-height:44px;cursor:pointer}#databaseWorkspace .db-workfile-actions{grid-template-columns:1fr}body.database-not-open #databaseWorkspace{top:70px!important;left:50%!important;right:auto!important;max-height:calc(100dvh - 86px)}}@media(min-width:1000px) and (pointer:fine){#databaseMobileToggle{display:none}}';document.head.append(style);const panel=document.createElement('section');panel.id='databaseWorkspace';panel.style.cssText='position:relative;margin:8px 8px 8px auto;width:360px;max-width:calc(100vw - 16px);box-sizing:border-box;padding:10px;border:1px solid #8064a6;border-radius:8px;background:#f4effc;color:#142e24;font:14px system-ui';panel.innerHTML='<header class="db-compact-header"><strong>GitHub-werkbestand</strong><button id="databaseManage" type="button" aria-expanded="false">Beheer</button></header><p id="databaseOriginBadge" role="status" style="padding:8px;border-radius:6px;font-weight:700;line-height:1.35"></p><p id="databaseIntro">Verbind om te starten. Bewaar spoor schrijft daarna rechtstreeks op GitHub.</p><div id="databaseConnectArea"><section class="db-github-connect"><label><strong>GitHub-toegangstoken</strong><input id="githubAccessToken" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" style="display:block;width:100%;box-sizing:border-box;min-height:44px;font:16px system-ui" aria-label="GitHub-toegangstoken"></label><button id="openGithubDatabase" class="db-github-primary" type="button">GitHub-werkbestand openen / verbinden</button><small>Eenmalig per pagina-sessie. Token blijft alleen in het geheugen van deze pagina.</small><a id="createGithubPhoneToken" href="https://github.com/settings/personal-access-tokens/new?name=Kruin%20telefoon&amp;target_name=kruin&amp;contents=write&amp;expires_in=30" target="_blank" rel="noopener noreferrer" style="display:block;min-height:44px;padding:12px 0;box-sizing:border-box">Token maken voor deze telefoon</a><p style="margin:0 0 10px">Nieuwe telefoon? Log op GitHub in als <strong>kruin</strong>. Kies alleen <strong>3b-kruin-beheer</strong> en controleer <strong>Contents: Read and write</strong>. Maak het token, kopieer het en keer terug naar dit tabblad om het hierboven te plakken.</p><details><summary>Token instellen op GitHub</summary><p>Maak een fine-grained token voor eigenaar kruin, alleen repository 3b-kruin-beheer, met Contents: Read and write en een korte vervaldatum. Plak het alleen hier; nooit in chat of een bestand.</p><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">Toegangstoken maken op GitHub</a></details></section></div><p id="databaseWorkspaceStatus" role="status"></p><details id="databaseTools"><summary>Back-up en details</summary><button id="databaseReconnect" type="button">Opnieuw verbinden</button><details class="db-source-help"><summary>2 · Lokale back-up terugzetten</summary><p>Een lokale kopie is een back-up. Terugzetten vervangt de werkstand in deze browser; GitHub verandert niet.</p><label><strong>Kies de lokale back-up</strong><input id="openDatabaseWorkspace" type="file" style="display:block;max-width:100%"></label></details><div class="db-workfile-actions"><button id="downloadDatabaseWorkspace" type="button">Bewaar db lokaal · back-up</button>  <button id="closeDatabaseWorkspace" type="button">Sluit GitHub-werkbestand</button></div><p><small id="databaseAppVersion"></small><br><small id="databaseOriginDetail"></small></p><small>Productie apart. Lokale bestanden zijn alleen back-ups.</small></details>';(document.getElementById('testEnvironmentBanner')||document.body.firstChild)?.after(panel);document.getElementById('databaseManage').onclick=()=>{const tools=document.getElementById('databaseTools');tools.open=!tools.open;compactUi();};document.getElementById('databaseTools').ontoggle=compactUi;document.getElementById('databaseReconnect').onclick=showConnection;document.getElementById('databaseAppVersion').textContent='App '+(window.THREEB_RELEASE?.version||'');const transfer=document.getElementById('testTransfer');if(transfer)transfer.hidden=true;document.getElementById('openDatabaseWorkspace').onchange=e=>{const file=e.target.files[0];if(file)open(file).catch(()=>{});};document.getElementById('openGithubDatabase').onclick=()=>connectGithub().catch(()=>{});document.getElementById('downloadDatabaseWorkspace').onclick=()=>download(record.bytes,'Kruinconfig.sqlite3');document.getElementById('closeDatabaseWorkspace').onclick=()=>close().catch(e=>notify(e.message));for(const id of ['downloadDatabaseWorkspace','closeDatabaseWorkspace'])document.getElementById(id).disabled=!record;if(record){const toggle=document.createElement('button');toggle.id='databaseMobileToggle';toggle.type='button';toggle.textContent='GitHub-werkbestand';toggle.setAttribute('aria-controls','databaseWorkspace');toggle.setAttribute('aria-expanded','false');toggle.onclick=()=>{const shown=document.body.classList.toggle('database-panel-open');toggle.setAttribute('aria-expanded',String(shown));toggle.textContent=shown?'Paneel sluiten':'GitHub-werkbestand';};panel.after(toggle);}if(!record){const version=window.THREEB_RELEASE?.version||'';const banner=document.getElementById('testEnvironmentBanner');if(banner?.firstChild?.nodeType===3)banner.firstChild.textContent='TEST '+version+' · Open je GitHub-werkbestand ';document.title='TEST · '+version+' · GitHub-werkbestand openen';const qr=document.createElement('button');qr.id='databaseStartQr';qr.type='button';qr.textContent='QR · Test op telefoon';panel.append(qr);window.installMobileTestQr?.({button:qr,imageUrl:new URL('qr-test-neus.png?v='+version,location.href).href,testUrl:'https://kruin.github.io/3b/test3b/open.html#owner=kruin',qrPageUrl:new URL('qr.html?v='+version,location.href).href});}notify(window.ThreeBDatabaseWorkspace.error||(record?'GitHub-werkbestand: '+record.name:'Verbind met GitHub; een lokaal bestand is niet nodig.'));}
  window.ThreeBDatabaseWorkspace={restore,open,commit,connectGithub,showConnection,get busy(){return busy;},get active(){return Boolean(db&&record);},get required(){return enabled();},get remote(){return Boolean(record?.github);},get saveMessage(){return document.getElementById('databaseWorkspaceStatus')?.textContent||'';},get sourceStatus(){if(record?.github)return record.github.conflict?'GitHub gewijzigd · heropenen':!window.ThreeBGitHub.connected?'GitHub · opnieuw verbinden':record.github.pending?'GitHub · niet bevestigd':'GitHub-werkbestand';return !record?'Geen werkdatabase':contentFingerprint===window.THREEB_DB_SOURCE?.fingerprint?'GitHub-bron ongewijzigd':record.savedAt?'Lokaal gewijzigd':'Andere databaseversie';},mount};
})();

'use strict';
// R uses the cushion numbering (0–80 / 0–40). Its tangential coordinate
// is the ball centre's coordinate; the normal coordinate is the cushion edge.
const SpoorGeometry = (() => {
  const bands=['west','noord','oost','zuid'];
  const known=p=>p&&(p.kind==='acquit'||p.value!==null&&p.value!==''&&Number.isFinite(Number(p.value))&&bands.includes(p.band));
  function point(p,g){
    if(!known(p))throw Error('V of A is nog onbekend.');
    const {widthCm:w,heightCm:h,dotOffsetCm:d}=g,v=Number(p.value);
    if(p.kind==='acquit')return {x:w/2,y:h*(.75-((Number(p.offset)||0)+(Number(g.startAcquitOffset)||0))/8)};
    return {west:{x:-d,y:(1-v/80)*h},oost:{x:w+d,y:v/80*h},noord:{x:v/40*w,y:-d},zuid:{x:(1-v/40)*w,y:h+d}}[p.band];
  }
  function value(band,p,g){return {west:(1-p.y/g.heightCm)*80,oost:p.y/g.heightCm*80,noord:p.x/g.widthCm*40,zuid:(1-p.x/g.widthCm)*40}[band];}
  function contact(v,a,g){
    const from=point(v,g),to=point(a,g),vertical=['west','oost'].includes(a.band);
    const axis=vertical?'x':'y',target={west:g.inset,oost:g.widthCm-g.inset,noord:g.inset,zuid:g.heightCm-g.inset}[a.band];
    const delta=from[axis]-to[axis];if(Math.abs(delta)<1e-9)throw Error('Geen uniek raakpunt.');
    const u=(target-to[axis])/delta,p={x:to.x+u*(from.x-to.x),y:to.y+u*(from.y-to.y)};
    if(p.x<g.inset-1e-6||p.x>g.widthCm-g.inset+1e-6||p.y<g.inset-1e-6||p.y>g.heightCm-g.inset+1e-6)throw Error('Raakpunt ligt buiten de band.');
    return {band:a.band,value:value(a.band,p,g)};
  }
  function arrival(v,r,g){return arrivalFromBall(point(v,g),r,g);}
  function arrivalFromBall(from,r,g){
    if(!bands.includes(r.band)||!Number.isFinite(r.value))throw Error('Kies een band en een geldig raakpunt.');
    const w=g.widthCm,h=g.heightCm,d=g.dotOffsetCm,i=g.inset;
    const ball={west:{x:i,y:(1-r.value/80)*h},oost:{x:w-i,y:r.value/80*h},noord:{x:r.value/40*w,y:i},zuid:{x:(1-r.value/40)*w,y:h-i}}[r.band];
    if(ball.x<i-1e-6||ball.x>w-i+1e-6||ball.y<i-1e-6||ball.y>h-i+1e-6)throw Error('Raakpunt ligt buiten de band.');
    const axis=['west','oost'].includes(r.band)?'x':'y',target={west:-d,oost:w+d,noord:-d,zuid:h+d}[r.band],delta=from[axis]-ball[axis];
    if(Math.abs(delta)<1e-9)throw Error('Geen unieke aankomst.');
    const u=(target-ball[axis])/delta,p={x:ball.x+u*(from.x-ball.x),y:ball.y+u*(from.y-ball.y)};
    return {band:r.band,value:value(r.band,p,g)};
  }
  function departureFromBall(ball,a,band,g){
    const aim=point(a,g),axis=['west','oost'].includes(band)?'x':'y',target={west:-g.dotOffsetCm,oost:g.widthCm+g.dotOffsetCm,noord:-g.dotOffsetCm,zuid:g.heightCm+g.dotOffsetCm}[band],delta=aim[axis]-ball[axis];
    if(Math.abs(delta)<1e-9)throw Error('Geen uniek vertrek.');const u=(target-ball[axis])/delta,p={x:ball.x+u*(aim.x-ball.x),y:ball.y+u*(aim.y-ball.y)};return {band,value:value(band,p,g)};
  }
  return {contact,arrival,arrivalFromBall,departureFromBall,point};
})();

/* Translate a launch ray, then find its real cushion sequence. Coordinates are
   ball centres; stip values are projections on the original diamond lines. */
const ThreeBStartRay=(()=>{
  function trace(nose,g,offset,count=9){
    const w=g.widthCm,h=g.heightCm,d=g.dotOffsetCm,r=g.inset;
    if(!nose?.from||!nose?.to||nose.to.value===null||nose.to.value===undefined||nose.to.value===''||!Number.isFinite(Number(nose.to.value)))return {error:'Neusrichting nog onbekend',pattern:'?'};
    const from=SpoorGeometry.point(nose.from,{...g,startAcquitOffset:Number(g.referenceOffset)||0}),aim=SpoorGeometry.point(nose.to,{...g,startAcquitOffset:0});
    let p={x:from.x,y:from.y-h*offset/8},v={x:aim.x-from.x,y:aim.y-from.y};
    const heading={...v},origin={...p},hits=[],segments=[];
    if(!Object.values(v).every(Number.isFinite)||Math.hypot(v.x,v.y)<1e-9)return {error:'Neusrichting nog onbekend',pattern:'?'};
    if(p.x<=r||p.x>=w-r||p.y<=r||p.y>=h-r)return {error:'Vertrekpunt ligt buiten het speelvlak',pattern:'?'};
    function stip(band,at,dir){
      const vertical=band==='west'||band==='oost',axis=vertical?'x':'y',target={west:-d,oost:w+d,noord:-d,zuid:h+d}[band];
      const u=(target-at[axis])/dir[axis],q={x:at.x+u*dir.x,y:at.y+u*dir.y};
      const value={west:(1-q.y/h)*80,oost:q.y/h*80,noord:q.x/w*40,zuid:(1-q.x/w)*40}[band];
      return {band,value,status:'calculated',source:'start_acquit_geometry',calculationBasis:'translated_launch_ray'};
    }
    for(let i=0;i<count;i++){
      const times=[['west',v.x<0?(r-p.x)/v.x:Infinity],['oost',v.x>0?(w-r-p.x)/v.x:Infinity],['noord',v.y<0?(r-p.y)/v.y:Infinity],['zuid',v.y>0?(h-r-p.y)/v.y:Infinity]].filter(([,t])=>t>1e-9).sort((a,b)=>a[1]-b[1]);
      if(!times.length||!Number.isFinite(times[0][1]))return {error:'Geen volgende band',pattern:'?',hits,segments,heading,origin};
      if(Math.abs(times[0][1]-times[1]?.[1])<1e-8)return {error:'Hoekpunt: geen eenduidige bandvolgorde',pattern:'?',hits,segments,heading,origin};
      const [band,t]=times[0],end={x:p.x+t*v.x,y:p.y+t*v.y};
      segments.push({from:i?stip(hits[i-1].band,p,v):{...nose.from},to:stip(band,end,v)});
      hits.push({band,center:end});p=end;v={x:(band==='west'||band==='oost')?-v.x:v.x,y:(band==='noord'||band==='zuid')?-v.y:v.y};
    }
    return {pattern:hits.slice(0,3).map(hit=>['west','oost'].includes(hit.band)?'L':'K').join(''),hits,segments,heading,origin};
  }
  return {trace};
})();

/* Screen-size appearance only. Physical radii and contact geometry stay unchanged. */
window.ThreeBUniformBalls=(()=>{
  const diameter=20,observed=new WeakSet();let pending=false;
  function mode(){return window.ThreeBTableText?.get().scaleMode||'tracks';}
  function dimensions(){return window.ThreeBTableText?.dimensions()||{groot:{widthCm:142,heightCm:284},klein:{widthCm:115,heightCm:230}};}
  function targetDiameter(svg,unit){
    const tables=dimensions(),table=svg.dataset.viewTable||svg.dataset.courseTable||'klein',maxW=Math.max(tables.groot.widthCm,tables.klein.widthCm),ratio=tables[table].widthCm/maxW;
    const fieldUnits=svg.id==='lklLessonTable'?Number(svg.dataset.courseWidth)||tables[table].widthCm:340,fieldPixels=fieldUnits*unit;
    const referencePixels=mode()==='balls'?fieldPixels/ratio:fieldPixels,physicalDiameter=(window.THREEB_START_CONFIG?.ballDiameterMm||61.5)/10;
    const base=Math.min(diameter,referencePixels*physicalDiameter/maxW);
    return mode()==='tables'?base/ratio:base;
  }
  function courseFrame(svg,g,table){
    const tables=dimensions(),maxW=Math.max(tables.groot.widthCm,tables.klein.widthCm),maxH=Math.max(tables.groot.heightCm,tables.klein.heightCm),ratio=g.widthCm/maxW;
    const w=mode()==='balls'?maxW+64:g.widthCm+64*ratio,h=mode()==='balls'?maxH+64:g.heightCm+64*ratio;
    svg.dataset.courseTable=table;svg.dataset.courseWidth=String(g.widthCm);svg.setAttribute('viewBox',`${(g.widthCm-w)/2} ${(g.heightCm-h)/2} ${w} ${h}`);
  }
  function trackBadge(svg,g,label,mirrored=false){
    let badge=svg.querySelector('.course-track-name');if(!label){badge?.remove();return;}
    const ns='http://www.w3.org/2000/svg',matrix=svg.getScreenCTM(),unit=matrix?Math.hypot(matrix.a,matrix.b)||1:1;
    if(!badge){badge=document.createElementNS(ns,'g');badge.setAttribute('class','course-track-name');badge.style.pointerEvents='none';badge.append(document.createElementNS(ns,'rect'),document.createElementNS(ns,'text'));svg.append(badge);}
    Object.assign(badge.dataset,{label,w:String(g.widthCm),h:String(g.heightCm),mirrored:String(mirrored)});
    const [rect,text]=badge.children;if(text.textContent!==label)text.textContent=label;
    text.style.cssText='font:800 '+(19/unit)+'px system-ui;fill:#173b30;stroke:none;transform:none';text.setAttribute('text-anchor','middle');text.setAttribute('dominant-baseline','central');
    const width=(text.getComputedTextLength()||label.length*12/unit)+8/unit,height=29/unit,angle=Number(svg.dataset.desktopAngle)||0,quarter=Math.abs(angle)%180===90;
    const cx=mirrored?(quarter?height:width)/2+2/unit:g.widthCm-(quarter?height:width)/2-2/unit,cy=g.heightCm-(quarter?width:height)/2-4/unit;
    badge.setAttribute('transform',`translate(${cx} ${cy}) rotate(${-angle}) translate(${-width/2} ${-height/2})`);
    for(const [k,v]of Object.entries({width,height,rx:4/unit,fill:'#fff6d6',stroke:'#173b30','stroke-width':1/unit}))rect.setAttribute(k,v);
    text.setAttribute('x',width/2);text.setAttribute('y',height/2);
  }
  function apply(svg){
    const m=svg?.getScreenCTM();if(!m)return;const unit=Math.hypot(m.a,m.b),target=targetDiameter(svg,unit);if(!Number.isFinite(unit)||unit<=0)return;
    for(const group of svg.querySelectorAll('g.uniform-ball')){
      const ball=group.querySelector('.ball-visible'),radius=Number(group.dataset.geometryRadius);if(!ball||!radius)continue;
      const x=Number(ball.getAttribute('cx')),y=Number(ball.getAttribute('cy')),scale=target/(2*radius*unit);
      group.setAttribute('transform',`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`);
      ball.setAttribute('vector-effect','non-scaling-stroke');ball.style.strokeWidth=Math.min(2,target/8)+'px';
    }
    for(const ball of svg.querySelectorAll('.lesson-ball,.lesson-target,.course-arrival')){ball.setAttribute('r',target/(2*unit));ball.setAttribute('vector-effect','non-scaling-stroke');ball.style.strokeWidth=Math.min(2,target/8)+'px';}
    for(const number of svg.querySelectorAll('.ball-number'))number.style.fontSize=(9*target/diameter/unit)+'px';
    const numbers=[...svg.querySelectorAll('.south-offset-number')];if(numbers.length){
      const points=numbers.map(group=>new DOMPoint(Number(group.dataset.x),Number(group.dataset.y)).matrixTransform(m));let spacing=Infinity,width=0,height=0;
      for(const [i,group]of numbers.entries()){const text=group.querySelector('text');text.setAttribute('x','0');text.setAttribute('y','0');text.setAttribute('text-anchor','middle');text.setAttribute('dominant-baseline','central');text.style.cssText='font:800 '+(12/unit)+'px system-ui;fill:#fff8df;stroke:#176548;stroke-width:'+(2/unit)+'px;paint-order:stroke;transform:none';const box=text.getBBox();width=Math.max(width,box.width*unit);height=Math.max(height,box.height*unit);if(i)spacing=Math.min(spacing,Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));}
      const along=width*Math.abs(m.a/unit)+height*Math.abs(m.b/unit)+2,gap=width*Math.abs(m.c/unit)+height*Math.abs(m.d/unit)+3,rows=Math.min(numbers.length,Math.max(1,Math.ceil(along/Math.max(.01,spacing)))),angle=Math.atan2(m.b,m.a)*180/Math.PI;
      for(const [i,group]of numbers.entries()){const screen=new DOMPoint(points[i].x,points[i].y),offset=target/2+8+(i%rows)*gap;screen.x-=m.c/unit*offset;screen.y-=m.d/unit*offset;const local=screen.matrixTransform(m.inverse());group.setAttribute('transform',`translate(${local.x} ${local.y}) rotate(${-angle})`);}
    }
    const badge=svg.querySelector('.course-track-name');if(badge)trackBadge(svg,{widthCm:Number(badge.dataset.w),heightCm:Number(badge.dataset.h)},badge.dataset.label,badge.dataset.mirrored==='true');
  }
  function refresh(){pending=false;for(const svg of document.querySelectorAll('#svgMount .table-svg,#lklLessonTable')){if(!observed.has(svg)){observed.add(svg);resize.observe(svg);}apply(svg);}}
  function schedule(){if(!pending){pending=true;requestAnimationFrame(refresh);}}
  const resize=new ResizeObserver(schedule);
  function start(){new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});window.addEventListener('resize',schedule);schedule();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  return {apply,diameter,courseFrame,trackBadge};
})();

/* Introductory explanation. Reads table dimensions; never edits measurements. */
window.ThreeBMeetsysteemIntro={create({geometry,route,onContinue,onClose}){
  const key='3b-meetsysteem-intro-v1',ns='http://www.w3.org/2000/svg';let step=0,view='W',exampleP=0,exampleW=5,parallelLesson=false,mirrored=false,drawWidth=0,demo=false,demoFrame=0;
  const dialog=document.createElement('dialog');dialog.id='meetsysteemIntro';dialog.setAttribute('aria-labelledby','meetIntroTitle');
  dialog.innerHTML='<header><h2 id="meetIntroTitle">De Waaier<small style="display:block;font-size:15px;font-weight:500">Van Top tot Teen</small><small style="display:block;font-size:13px;font-weight:500">Kruins tafel · metingen van Kruin</small></h2><button id="closeMeetIntro" type="button" aria-label="Introductie sluiten">×</button></header><div class="meet-intro-layout"><section class="meet-intro-stage"><p id="meetIntroOrientation">Links is west, rechts is oost; boven is noord, onder is zuid.</p><button type="button" id="meetIntroMirror" aria-pressed="false">Spiegelen · naar oost</button><svg id="meetIntroTable" role="img" aria-label="Benedenacquit 0 en de eerste lijnen"></svg></section><section class="meet-intro-info"><div class="course-progress-row"><p id="meetIntroProgress"></p><button type="button" id="meetIntroTableSize"></button></div><button type="button" id="meetIntroSystem">Meetsysteem</button><h3 id="meetIntroHeading"></h3><div id="meetIntroText"></div><nav id="meetIntroViews" aria-label="Twee views"><button type="button" data-meet-view="P">P · Parallel</button><button type="button" data-meet-view="W">Waaier</button></nav><label id="meetIntroExampleControl">Voorbeeld <select id="meetIntroExample" aria-label="Voorbeeld kiezen"></select></label><button type="button" id="meetIntroDemo" hidden>▶ Demo opnieuw</button><p id="meetIntroViewDescription"></p><nav class="meet-intro-navigation"><button id="previousMeetIntro" type="button">← Vorige</button><button id="nextMeetIntro" type="button">Volgende →</button></nav></section></div>';
  const style=document.createElement('style');style.textContent='#meetsysteemIntro{box-sizing:border-box;width:min(940px,calc(100vw - 16px));max-width:calc(100vw - 16px);max-height:calc(100dvh - 16px);padding:14px;margin:auto;border:2px solid #176f4f;border-radius:12px;background:#faf8ef;color:#173b30;font:16px/1.5 system-ui;overflow:auto}#meetsysteemIntro::backdrop{background:#0008}#meetsysteemIntro header{position:sticky;top:-14px;z-index:3;background:#faf8ef;display:flex;align-items:center;justify-content:space-between;gap:10px}#meetsysteemIntro h2{font-size:20px;margin:0}#meetsysteemIntro h3{font-size:19px}#meetsysteemIntro button{min-height:44px;padding:7px 12px;border:1px solid #78988b;border-radius:6px;background:white;color:#173b30;font:inherit;cursor:pointer}#meetsysteemIntro button:disabled{opacity:.45}#meetsysteemIntro [aria-pressed=true]{background:#176f4f;color:white}.meet-intro-layout{display:grid;grid-template-columns:minmax(220px,1fr) minmax(240px,1.2fr);gap:18px}.meet-intro-stage{min-width:0;position:sticky;top:var(--meet-intro-header,64px);align-self:start}#meetIntroOrientation{font-size:13px;margin:3px 0}#meetIntroMirror{font-size:13px!important;margin-bottom:5px}#resumeMeetIntro[hidden]{display:none}#meetIntroTable{display:block;width:100%;height:min(66dvh,600px);background:#704725;border-radius:8px}.meet-intro-navigation,#meetIntroViews{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}#meetIntroExercise{padding:10px;background:#e4eee6;border-radius:6px;font-weight:600}#meetIntroProgress{font-size:14px}#meetIntroViewDescription{font-size:14px}#meetIntroViews[hidden],#meetIntroExampleControl[hidden]{display:none}#meetIntroExample{font:inherit;min-height:44px;max-width:100%;padding:6px}@media(max-width:650px){#meetsysteemIntro{padding:10px}.meet-intro-layout{grid-template-columns:minmax(0,1fr);gap:6px}#meetIntroTable{height:36dvh;min-height:180px}.meet-intro-stage{z-index:1;background:#faf8ef}.meet-intro-info h3{margin:8px 0}.meet-intro-info p{margin:8px 0}}';
  // Keep navigation outside the scrolling explanation, as in the line lessons.
  dialog.append(dialog.querySelector('.meet-intro-navigation'));
  style.textContent+=`
  #meetsysteemIntro{width:min(1120px,calc(100dvw - 16px));height:calc(100dvh - 16px);max-height:calc(100dvh - 16px);padding:12px;overflow:hidden}
  #meetsysteemIntro[open]{display:grid;grid-template-rows:76px minmax(0,1fr) auto;gap:10px}
  #meetsysteemIntro>header{position:static;min-width:0;min-height:0;height:76px;box-sizing:border-box;padding:0 0 8px;border-bottom:1px solid #b6c7bd}
  #meetsysteemIntro>header h2{font-size:19px;line-height:1.2;min-width:0}
  #meetsysteemIntro>header>button{min-width:44px;height:44px;flex-shrink:0;padding:4px;font-size:22px}
  #meetsysteemIntro .meet-intro-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.85fr);gap:16px;min-height:0;overflow:hidden}
  #meetsysteemIntro .meet-intro-stage{position:static;display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:6px;min-height:0;align-self:stretch;overflow:hidden}
  #meetsysteemIntro #meetIntroOrientation{margin:0}
  #meetsysteemIntro #meetIntroMirror{justify-self:start;margin:0}
  #meetsysteemIntro #meetIntroTable{width:100%;height:100%;min-height:0;max-height:100%}
  #meetsysteemIntro .meet-intro-info{min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:8px}
  #meetsysteemIntro>.meet-intro-navigation{display:grid;grid-template-columns:1fr 1fr;position:static;margin:0;padding:8px 0 0;border-top:1px solid #b6c7bd;gap:8px;min-width:0}
  #meetsysteemIntro>.meet-intro-navigation button{box-sizing:border-box;margin:0;min-width:0;height:44px;min-height:44px;font-size:15px;padding:4px;white-space:nowrap}
  @media(max-width:600px) and (orientation:portrait){
    #meetsysteemIntro{padding:8px}
    #meetsysteemIntro[open]{gap:6px}
    #meetsysteemIntro .meet-intro-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1.3fr) minmax(0,1fr);gap:10px}
    #meetsysteemIntro .meet-intro-info{border-top:1px solid #b6c7bd;padding-top:6px}
  }
  @media(orientation:landscape) and (max-height:500px){
    #meetsysteemIntro{padding:6px}
    #meetsysteemIntro[open]{grid-template-rows:60px minmax(0,1fr) auto;gap:4px}
    #meetsysteemIntro>header{height:60px;padding-bottom:3px}
    #meetsysteemIntro>header h2{font-size:16px;line-height:1.1}
    #meetsysteemIntro .meet-intro-layout{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
    #meetsysteemIntro>.meet-intro-navigation{padding-top:4px}
  }`;
  style.textContent+='#meetsysteemIntro #meetIntroSystem{display:inline-flex;align-items:center;min-height:44px;margin:0;padding:0 2px;border:0;background:transparent;color:#176f4f;font-size:15px;text-decoration:underline}';
  document.head.append(style);document.body.append(dialog);const $=id=>dialog.querySelector('#'+id),svg=$('meetIntroTable');
  const introSteps=[
    {title:'De Waaier vanuit benedenacquit 0',text:'<p>Jij bent de speler: de User of Gebruiker. Je kijkt in deze cursus naar <strong>Kruins tafel en Kruins metingen</strong>. Eigen metingen op je eigen tafel(s) volgen later. Met “ik” in de uitleg wordt de speler bedoeld, dus jij met bal 1.</p><p>Je kijkt naar links: dat noemen we <strong>west</strong>. Rechts is <strong>oost</strong>, boven noord en onder zuid. Met Spiegelen bekijk je dezelfde opzet naar de andere kant.</p><p>Het benedenacquit is de onderste vaste markering op het laken. Dat punt noem je <strong>0</strong>.</p><p>Andere meetsystemen nemen vaak een hoek als oorsprong. Hier heb je 0 vlak bij je en steeds in het zicht. Vanuit die vaste kijkbasis overzie je het scala van eerste lijnen naar de stiplijnen.</p><p>De Waaier blijft hier beperkt tot de lange band: de eerste <strong>L van LKL</strong>. De demo laat de eerste lijnen vanuit 0 één voor één naar die stiplijn uitwaaieren, van 0 t/m 80. Het vertrekpunt blijft steeds hetzelfde.</p><p>Acquit 0 is je referentiepunt. De witte stippen rond de tafel liggen op de stiplijnen. De bandgetallen helpen je daar plaatsen aan te wijzen; NUL is een afzonderlijke spoornaam.</p>'},
    {title:'De Waaier: vanuit 0 naar 0 t/m 8',text:'<p>Het vertrekpunt <strong>0 blijft vast</strong>. De richting verandert: de eerste lijnen waaieren naar verschillende plaatsen op de stiplijn uit.</p><p>Je ziet de reeks <strong>0 t/m 8</strong>, met stiplijnwaarden 0 t/m 80.</p><p>Zo’n eerste lijn hoort bij een <strong>patroon</strong>: de volgorde van de banden die de bal raakt. De lijn vanuit 0 naar <strong>50 (stip 5)</strong> bespreken we hier binnen <strong>LKL: lang–kort–lang</strong>. De bal raakt eerst een lange band, dan een korte band en vervolgens weer een lange band.</p><p>We beginnen met LKL en lichten daaruit <strong>VIJF</strong> uit. De eerste lijn alleen vertelt nog niet het hele verhaal: ook het verdere bandverloop hoort bij het patroon. Andere patronen komen later.</p>'},
    {title:'VIJF is één van de mogelijkheden',text:'<p>Uit de Waaier licht je nu <strong>5 · VIJF</strong> uit: één herkenbaar spoor uit de reeks.</p><p>Het systeem geeft je vaste namen. <strong>LKL</strong> benoemt het patroon: lange–korte–lange band aan het begin van het bandverloop. <strong>VIJF</strong> benoemt een spoor. De eerste lijn vanaf je afstoot heet <strong>Neus</strong>. In <strong>Van Top tot Teen</strong> leer je de lijnnamen verder kennen. Top is daar de keutop: de pomerans.</p><p>Die namen zijn handig in de cursus én aan de echte tafel. Met “de Neus van VIJF in LKL” kun je precies aangeven welk patroon, welk spoor en welke lijn je bedoelt.</p><p>Hier zie je alleen de <strong>Neus van VIJF</strong>: vanaf 0 naar de eerste band. Het dunne hulplijntje loopt door naar <strong>50 op de westelijke stiplijn</strong>. De bal raakt de band vóór die stiplijn; bandcontact en richtpunt zijn dus verschillende plaatsen. Je volgt hierna VIJF lijn voor lijn. Als je de Neus kent, bekijk je later de parallellen van VIJF.</p><p>Je kunt de gebruikte lijnen en patronen zelf inmeten. De meetlessen volgen later.</p><details id="meetIntroLater"><summary>Later: eigen metingen en lange/korte Neus</summary><p>Het doel is dat je met je eigen meetbasis minder en overzichtelijkere correcties nodig hebt dan bij een aanpak met veel afzonderlijke hoekcorrecties.</p><p>Fysieke factoren zoals de uitvoering van je afstoot, snelheid en effect spelen mee. Hoe je de Neuslengte gebruikt bij een eventuele richtingcorrectie, onderzoeken we later met eigen metingen. Lange Neus, korte Neus en richtingcorrectie krijgen een aparte les met eigen metingen.</p></details>'}
    ,{title:'De Romp van hetzelfde spoor VIJF',text:'<p>De <strong>Romp</strong> is de lijn vanaf de lange oostband richting de zuidzijde. Op Klein hoort daarbij <strong>20 op de oostelijke stiplijn</strong>: de gemeten vertrekwaarde van de Romp.</p><p>De gele lijn is de Romp. De Neus blijft gedempt zichtbaar. Samen vormen Neus en Romp het zichtbare <strong>Karkas</strong> van dit spoor VIJF. Je kunt hun vertrek en aankomst op de stiplijnen rechtstreeks zien en meten: dat zijn <strong>V en A</strong>. Het raakpunt R wordt daaruit berekend.</p><p>Ze horen bij hetzelfde bandverloop: na de Neus volgen <strong>Kop en Nek</strong>, en daarna de Romp. Die tussenliggende lijnen slaan we bij het rollen niet over; in les 2 volgt de bal het hele spoor lijn voor lijn.</p><p><strong>Kruins metingen zijn je uitgangspunt.</strong> Later pas je met eigen metingen de Neus en Romp van VIJF en ZES aan. Daarbij meet je ook Kop R of A om het vervolg vast te leggen; Kop V en de aansluitende waarden worden berekend. In deze cursus blijf je naar Kruins tafel kijken.</p>'}
  ];
  const parallelSteps=[
    {title:'Parallel, nu je de Neus kent',text:'<p>Je kent de Neus van VIJF. Bij <strong>P · Parallel</strong> blijven de eerste lijnen evenwijdig: <strong>alle neuzen wijzen dezelfde kant op</strong>.</p><p>Het vertrek schuift mee ten opzichte van acquit 0. De vervolglijnen volgen hun eigen metingen; ze hoeven niet allemaal parallel te lopen.</p>'},
    {title:'VIJF−2 t/m VIJF+3 vergelijken',text:'<p>De voorbeelden zijn <strong>VIJF−2, VIJF−1, VIJF, VIJF+1, VIJF+2 en VIJF+3</strong>. VIJF is je referentielijn.</p><p>Dit zijn eerste-lijnvoorbeelden. Het vertrek verschuift terwijl de richting gelijk blijft.</p>'},
    {title:'Parallel en Waaier uit elkaar houden',text:'<p>Bij de <strong>Waaier</strong> blijft vertrekpunt 0 vast en verandert de richting. Bij <strong>P</strong> blijft de richting gelijk en verschuift het vertrek.</p><p>De twee views laten dit verschil zien.</p>'}
  ];
  function el(tag,attrs={},text){if(mirrored){attrs={...attrs};for(const k of ['cx','x1','x2'])if(attrs[k]!==undefined)attrs[k]=drawWidth-Number(attrs[k]);if(attrs.x!==undefined)attrs.x=drawWidth-Number(attrs.x)-(tag==='rect'?Number(attrs.width||0):0);if(attrs['text-anchor']==='start')attrs['text-anchor']='end';else if(attrs['text-anchor']==='end')attrs['text-anchor']='start';}const node=document.createElementNS(ns,tag);for(const [name,value]of Object.entries(attrs))node.setAttribute(name,value);if(text!==undefined)node.textContent=text;svg.append(node);return node;}
  function draw(){cancelAnimationFrame(demoFrame);for(const a of svg.getAnimations({subtree:true}))a.cancel();const g=geometry(),w=g.widthCm,h=g.heightCm,m=Math.max(13,(g.dotOffsetCm||0)+14),x=w/2,y=h*.75,unit=Math.max(.1,Math.min(svg.clientWidth/(w+2*m)||1,svg.clientHeight/(h+2*m)||1)),numberSize=Math.max(4,10/unit),labelSize=Math.max(5,13/unit);drawWidth=w;dialog.style.setProperty('--meet-intro-header',(dialog.querySelector('header').getBoundingClientRect().height+6)+'px');svg.dataset.demoProgress='0';svg.replaceChildren();svg.setAttribute('viewBox',[-m,-m,w+2*m,h+2*m].join(' '));svg.dataset.table=g.table;svg.dataset.view=view;
    el('rect',{x:0,y:0,width:w,height:h,fill:'#176f4f',stroke:'#e7c66e','stroke-width':1});const defs=document.createElementNS(ns,'defs');for(const [id,fill]of [['introArrowSelected','#ffdc68'],['introArrowOther','#82dcd4']]){const marker=document.createElementNS(ns,'marker');for(const [k,v]of Object.entries({id,viewBox:'0 0 6 6',refX:6,refY:3,markerWidth:4,markerHeight:4,orient:'auto'}))marker.setAttribute(k,v);const path=document.createElementNS(ns,'path');path.setAttribute('d','M0 0 L6 3 L0 6 Z');path.setAttribute('fill',fill);marker.append(path);defs.append(marker);}svg.append(defs);
    for(const band of ['west','noord','oost','zuid'])for(let value=0;value<=(band==='west'||band==='oost'?80:40);value+=10){const p=SpoorGeometry.point({band,value},g);el('circle',{cx:p.x,cy:p.y,r:1.1,fill:'#fff8dc','data-intro-band':band,'data-value':value});el('text',{x:p.x+(band==='west'?-3:band==='oost'?3:0),y:p.y+(band==='noord'?-3:band==='zuid'?5:1.5),'font-size':numberSize,'text-anchor':band==='west'?'end':band==='oost'?'start':'middle',fill:'#fff8dc'},String(value));}
    {if(view==='P'){for(const offset of [-2,-1,0,1,2,3]){const shift=-offset*h/8,selected=offset===exampleP;el('line',{'data-intro-line':'P','data-example':offset,'data-highlighted':String(selected),'marker-end':selected?'url(#introArrowSelected)':'url(#introArrowOther)',x1:x,y1:y+shift,x2:-g.dotOffsetCm,y2:h*.375+shift,stroke:selected?'#ffdc68':offset===0?'#fff8dc':'#82dcd4','stroke-width':selected?2.1:1,opacity:demo&&!parallelLesson&&step===1?.18:selected?1:.7});el('circle',{cx:x,cy:y+shift,r:1.4,fill:'#82dcd4'});}}else for(let example=0;example<=8;example++){const selected=example===exampleW;if(!parallelLesson&&(step>=2||step===1&&demo&&selected))continue;el('line',{'data-intro-line':'W','data-example':example,'data-highlighted':String(selected),'marker-end':selected?'url(#introArrowSelected)':'url(#introArrowOther)',x1:x,y1:y,x2:-g.dotOffsetCm,y2:h*(1-example/8),stroke:selected?'#ffdc68':example===5?'#fff8dc':'#82dcd4','stroke-width':selected?2.1:1,opacity:demo&&!parallelLesson&&step===1?.18:selected?1:.7});}
      if(!parallelLesson&&(step>=2||step===1&&demo)){let measured;try{measured=route?.();}catch(_){}for(const part of (measured?.journey||[]).filter(p=>step===1&&demo||p.key==='neus'||step===3&&p.key==='romp'))el('line',{'data-intro-spoor':part.key,x1:part.from.x,y1:part.from.y,x2:part.to.x,y2:part.to.y,stroke:'#ffdc68',opacity:step===3&&part.key==='neus'?.35:1,'stroke-width':2.1,'marker-end':'url(#introArrowSelected)'});for(const [key,side] of (step===3?[['romp','from'],['romp','to']]:[['neus','to']])){const ref=measured?.route?.[key]?.[side],part=measured?.journey?.find(p=>p.key===key);if(!ref||!part)continue;const p=SpoorGeometry.point(ref,g),anchor=side==='from'?part.from:part.fullTo||part.to;el('line',{'data-intro-reference':key,'data-side':side,'data-value':ref.value,x1:anchor.x,y1:anchor.y,x2:p.x,y2:p.y,stroke:'#ffdc68','stroke-width':1,'stroke-dasharray':'2 2'});el('circle',{cx:p.x,cy:p.y,r:2.2,fill:'none',stroke:'#ffdc68','stroke-width':1});}}
      if(demo){const parts=[...svg.querySelectorAll(parallelLesson?'[data-intro-line][data-highlighted=true]':step===0?'[data-intro-line=W]':step===3?'[data-intro-spoor=romp]':'[data-intro-spoor]')].map(node=>{const p={node,x1:+node.getAttribute('x1'),y1:+node.getAttribute('y1'),x2:+node.getAttribute('x2'),y2:+node.getAttribute('y2')};node.setAttribute('x2',p.x1);node.setAttribute('y2',p.y1);return p;}),start=performance.now();const tick=now=>{const progress=(now-start)/700;parts.forEach((p,i)=>{const t=Math.max(0,Math.min(1,progress-i));p.node.setAttribute('x2',p.x1+(p.x2-p.x1)*t);p.node.setAttribute('y2',p.y1+(p.y2-p.y1)*t);});svg.dataset.demoProgress=String(Math.min(1,progress/parts.length));if(progress<parts.length)demoFrame=requestAnimationFrame(tick);};demoFrame=requestAnimationFrame(tick);}
      el('text',{x:w/2,y:8,'font-size':labelSize,'text-anchor':'middle',fill:'#ffdc68','font-weight':800},!parallelLesson&&step===0?'Waaier · 0–8':demo&&step===1&&!parallelLesson?'Demo VIJF · LKL':!parallelLesson&&step>=2?'VIJF · '+(step===3?'Romp':'Neus'):view==='P'?'P · VIJF'+(exampleP?(exampleP>0?'+':'−')+Math.abs(exampleP):''):'Waaier · '+exampleW+' · '+['NUL','EEN','TWEE','DRIE','VIER','VIJF','ZES','ZEVEN','ACHT'][exampleW]);
    }
    el('circle',{'data-intro-zero':'',cx:x,cy:y,r:Math.max(3.6,10/unit),fill:'#ffdc68',stroke:'#173b30','stroke-width':.7});el('text',{x,y:y+labelSize*.35,'font-size':labelSize,'font-weight':800,'text-anchor':'middle',fill:'#173b30'},'0');el('text',{x:x+Math.max(6,14/unit),y:y+2,'font-size':Math.max(4.4,11/unit),fill:'white'},'acquit 0');
    if(!parallelLesson&&(step>=2||step===1&&demo))window.ThreeBUniformBalls.trackBadge(svg,g,'VIJF',mirrored);
  }
  function render(){const s=(parallelLesson?parallelSteps:introSteps)[step];dialog.querySelector('.meet-intro-info').scrollTop=0;dialog.dataset.step=step;dialog.dataset.view=view;$('meetIntroProgress').textContent=(parallelLesson?'Les 4 · parallel · stap ':'Les 1 · introductie · stap ')+(step+1)+' van '+(parallelLesson?parallelSteps:introSteps).length+' · '+(geometry().table==='groot'?'Groot':'Klein');$('meetIntroProgress').textContent=$('meetIntroProgress').textContent.replace(/ · (Klein|Groot)$/,'');$('meetIntroTableSize').textContent=(geometry().table==='groot'?'Groot':'Klein')+' ⇄';$('meetIntroTableSize').setAttribute('aria-label','Wissel cursustafel');$('meetIntroHeading').textContent=s.title;$('meetIntroText').innerHTML=s.text;const later=$('meetIntroLater');if(later){const content=document.createElement('template');content.innerHTML=window.THREEB_SYSTEM_GUIDE_HTML||'';const corrections=content.content.querySelector('.course-corrections');if(corrections){later.replaceChildren();const summary=document.createElement('summary');summary.textContent='Later: correcties';later.append(summary,corrections.cloneNode(true));}}$('meetIntroViews').hidden=!parallelLesson;$('meetIntroDemo').hidden=false;$('meetIntroExampleControl').hidden=!parallelLesson&&(step===0||step>=2);const select=$('meetIntroExample');select.replaceChildren();for(const value of view==='P'?[-2,-1,0,1,2,3]:[0,1,2,3,4,5,6,7,8]){const name=view==='P'?'VIJF'+(value?(value>0?'+':'−')+Math.abs(value):''):value+' · '+['NUL','EEN','TWEE','DRIE','VIER','VIJF','ZES','ZEVEN','ACHT'][value];select.add(new Option(name,String(value)));}select.value=String(view==='P'?exampleP:exampleW);$('meetIntroMirror').setAttribute('aria-pressed',String(mirrored));$('meetIntroMirror').textContent=mirrored?'Spiegelen · terug naar west':'Spiegelen · naar oost';$('previousMeetIntro').disabled=step===0;$('nextMeetIntro').textContent='Volgende →';$('meetIntroViewDescription').textContent=step||parallelLesson?(view==='P'?'P: de richting van de eerste lijn blijft gelijk. Ik verschuif de lijn evenwijdig; het vertrek schuift mee ten opzichte van 0.':'Waaier: ik houd vertrekpunt 0 vast en verander de richting. De eerste lijnen waaieren vanuit hetzelfde punt uit.'):'Ik houd mijn vaste referentiepunt in het zicht.';if(step||parallelLesson)$('meetIntroViewDescription').textContent+=' Voorbeeld: '+select.selectedOptions[0].textContent+'.';if(!parallelLesson&&step>=2)$('meetIntroViewDescription').textContent=step===3?'VIJF · Neus en Romp vormen het zichtbare Karkas.':'VIJF · Neus naar stiplijn 50. Het hele spoor volgt lijn voor lijn.';for(const button of dialog.querySelectorAll('[data-meet-view]'))button.setAttribute('aria-pressed',String(button.dataset.meetView===view));draw();}
  $('meetIntroTableSize').onclick=()=>{window.ThreeBTableText.update({courseTable:geometry().table==='klein'?'groot':'klein'});render();};
  $('meetIntroSystem').onclick=()=>window.openThreeBMeetsysteem?.();
  $('meetIntroDemo').onclick=()=>{demo=true;if(!parallelLesson&&step===1)exampleW=5;render();};$('meetIntroMirror').onclick=()=>{mirrored=!mirrored;render();};
  $('meetIntroExample').onchange=e=>{demo=false;if(view==='P')exampleP=Number(e.target.value);else exampleW=Number(e.target.value);render();};window.addEventListener('resize',()=>{if(dialog.open)requestAnimationFrame(draw);});
  const close=()=>{cancelAnimationFrame(demoFrame);for(const a of svg.getAnimations({subtree:true}))a.cancel();dialog.close();onClose?.();};$('closeMeetIntro').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});$('previousMeetIntro').onclick=()=>{if(step){step--;demo=true;render();dialog.scrollTop=0;}};$('nextMeetIntro').onclick=()=>{if(step<(parallelLesson?parallelSteps:introSteps).length-1){step++;demo=true;dialog.scrollTop=0;if(!parallelLesson&&step>=2){view='W';exampleW=5;}render();}else{if(!parallelLesson)try{localStorage.setItem(key,'1');}catch(_){}cancelAnimationFrame(demoFrame);dialog.close();onContinue({parallel:parallelLesson});}};for(const button of dialog.querySelectorAll('[data-meet-view]'))button.onclick=()=>{view=button.dataset.meetView;render();};
  return {pause(){cancelAnimationFrame(demoFrame);for(const a of svg.getAnimations({subtree:true}))a.pause();},completed(){try{return localStorage.getItem(key)==='1';}catch(_){return false;}},open({parallel=false,at=0}={}){mirrored=false;parallelLesson=parallel;step=Math.max(0,Math.min((parallel?parallelSteps:introSteps).length-1,Number(at)||0));demo=true;view=parallel?'P':'W';exampleP=0;exampleW=5;render();if(!dialog.open)dialog.showModal();dialog.scrollTop=0;requestAnimationFrame(()=>{draw();dialog.scrollTop=0;});}};
}};

/* Read-only KZ matching: finite measured centre paths, contact at r1+r3. */
window.ThreeBKzSolver=(()=>{
  function distance(p,part){
    if(!part)return Infinity;const dx=part.to.x-part.from.x,dy=part.to.y-part.from.y,l2=dx*dx+dy*dy;if(!l2)return Infinity;
    const u=Math.max(0,Math.min(1,((p.x-part.from.x)*dx+(p.y-part.from.y)*dy)/l2));
    return Math.hypot(p.x-part.from.x-u*dx,p.y-part.from.y-u*dy);
  }
  function contact(part,center,D){
    if(!part||!Number.isFinite(D)||D<=0)return null;
    const dx=part.to.x-part.from.x,dy=part.to.y-part.from.y,length=Math.hypot(dx,dy);if(length<1e-9)return null;
    const ux=dx/length,uy=dy/length,along=(center.x-part.from.x)*ux+(center.y-part.from.y)*uy,perp=(center.x-part.from.x)*uy-(center.y-part.from.y)*ux;
    if(Math.abs(perp)>D)return null;
    const travel=along-Math.sqrt(Math.max(0,D*D-perp*perp));
    return travel>=0&&travel<=length?{x:part.from.x+travel*ux,y:part.from.y+travel*uy}:null;
  }
  function solutions(tracks,center,targetRadius){
    const result=[];
    for(const track of tracks){
      const body=track.rompPart,cross=track.kruisPart,D=track.radiusCm+targetRadius;
      const bodyContact=contact(body,center,D);
      if(bodyContact)result.push({track:track.track,kind:'romp',contact:bodyContact,part:body,trackData:track,distance:distance(center,body)});
      // A route that hits B3 on Romp cannot first reach it on Kruis.
      if(body&&cross&&distance(center,body)>D+1e-8&&Math.hypot(body.to.x-cross.from.x,body.to.y-cross.from.y)<1e-4){
        const crossContact=contact(cross,center,D);
        if(crossContact)result.push({track:track.track,kind:'kruis',contact:crossContact,part:cross,trackData:track,distance:distance(center,cross)});
      }
    }
    return result.sort((a,b)=>a.distance-b.distance||a.track.localeCompare(b.track,'nl',{numeric:true}));
  }
  return {distance,contact,solutions};
})();

/* Fixed course sequence. Animation reads shared band-ball positions, never writes measurements. */
window.installThreeBLklLesson=adapter=>{
  const actions=document.querySelector('#explanationCarousel .course-header-actions');if(!actions)return;
  const names={neus:'Neus',kop:'Kop',nek:'Nek',romp:'Romp',kruis:'Kruis',been:'Been',hiel:'Hiel',uitloop:'Uitloop na Hiel'},order=['neus','kop','nek','romp','kruis','been'],colors={neus:'#59bdec',kop:'#edb55b',nek:'#ad9be5',romp:'#37d3b2',kruis:'#ed88b6',been:'#d2dd68',hiel:'#edb55b',uitloop:'#edb55b'};
  const explanations={neus:'Ik volg mijn speelbal vanaf de afstoot naar de eerste lange band: West.',kop:'Na de Neus volgt de Kop, van West naar de korte noordband. Waar mijn eigen Kop A ligt, meet ik in een latere meetles.',nek:'Na de Kop volgt de Nek, van de noordband naar de lange oostband. De Nek verbindt Kop en Romp.',romp:'Na de Nek volgt de Romp, vanaf de oostband richting de zuidzijde. Neus en Romp vormen het zichtbare Karkas.',kruis:'Na de Romp volgt het Kruis. Ik blijf dezelfde bal volgen; ik spring niet naar een andere lijn.',been:'Na het Kruis volgt het Been. In LKL loopt de bal uit tot 45% van het Been en komt daar tot rust.',hiel:'Na Been volgt Hiel. In het afzonderlijke 6–7-patroon wordt de hele Hiel doorlopen.'};
  const lessons=[{track:'VIJF',title:'Les 2 · VIJF lijn na lijn'},{track:'VIJF',title:'Les 3 · VIJF terug vanaf de Romp'},{track:'VIJF',title:'Les 4 · sporen van VIJF'},{track:'VIJF',title:'kruis 0.1'},{track:'VIJF',title:'H2 · Via bal 2'}];
  let lesson=0,index=0,data=null,frame=0,progress=0,started=0,running=false,demoAnimations=[],reference=false,lineNode,ballNode,markNode;
  const d=document.createElement('dialog');d.id='lklLesson1';d.setAttribute('aria-labelledby','lklLessonTitle');
  d.innerHTML=`<header><h2 id="lklLessonTitle"></h2><button type="button" id="closeLklLesson" aria-label="Cursus sluiten">×</button></header><p id="lklLessonSource"></p><p id="lklCourseBasis">Je kijkt naar Kruins tafel. Eigen metingen op je eigen tafel(s) volgen later.</p><p id="lklLessonProgress"></p><p id="lklDiamondCaption" hidden></p><div class="lkl-lesson-layout"><svg id="lklLessonTable" role="img" aria-label="De bal volgt het LKL-spoor lijn na lijn"></svg><section><p id="lklFixedQuestions"><strong>LKL · lang–kort–lang</strong></p><h3 id="lklExerciseTitle"></h3><p id="lklExerciseText"></p><p id="lklRouteSequence" aria-label="Lijnvolgorde"></p><p id="lklApproach">De bal volgt het spoor lijn na lijn.</p><p id="lklAnimationStatus" role="status" aria-live="polite"></p><p id="lklGeometryNotice"></p><fieldset id="courseRunOutConfig" hidden><legend>Config · uitloop van dit basisspoor</legend><label>Na Hiel (cm) <input id="courseRunOutCm" required type="number" min="0" max="100" step="1"></label><button type="button" id="saveCourseRunOut">Bewaar uitloop</button><p id="courseRunOutStatus" role="status"></p></fieldset><button type="button" id="harderLkl">Harder lopende bal → 6–7 banden</button><button type="button" id="lklRoll">Pauze</button><button type="button" id="repeatLklLine">Demo opnieuw</button><p id="lklCourseSimulationNote">Dit is een weergave van het actieve spoor, geen voorspelling van snelheid. Bal 3 staat alvast op de Romp; bal 2 en de volledige carambole komen later.</p></section></div><nav id="lklStepNavigation" aria-label="Lesstappen"><button type="button" id="previousLklExercise">← Vorige stap</button><button type="button" id="nextLklExercise">Volgende stap →</button><button type="button" id="repeatLklLesson">Les opnieuw</button></nav><nav id="lklLessonNavigation" aria-label="Lessen"><button type="button" id="previousLklLesson">← Vorige les</button><button type="button" id="nextLklLesson">Volgende les →</button><button type="button" id="lessonToIndependent">Naar tafel ↔</button></nav>`;
  document.body.append(d);const $=id=>d.querySelector('#'+id),svg=$('lklLessonTable'),ns='http://www.w3.org/2000/svg';
  const layout=d.querySelector('.lkl-lesson-layout'),info=layout.querySelector('section');info.className='lkl-course-info';
  const stage=document.createElement('section');stage.className='lkl-course-stage';stage.setAttribute('aria-label','Vaste cursustafel');layout.prepend(stage);stage.append(svg,$('lklDiamondCaption'));
  info.prepend($('lklLessonProgress'));const playback=document.createElement('nav');playback.className='lkl-course-playback';playback.setAttribute('aria-label','Rollende bal');$('lklExerciseText').after(playback);playback.append($('lklRoll'),$('repeatLklLine'));
  d.querySelector('header').insertBefore($('lessonToIndependent'),$('closeLklLesson'));
  $('lklLessonNavigation').hidden=true;$('repeatLklLesson').hidden=true;
  info.append($('lklLessonSource'),$('lklCourseBasis'),$('lklLessonNavigation'),$('repeatLklLesson'));
  const style=document.createElement('style');style.textContent=`#lklLesson1,#lklUseChoice{position:fixed;inset:0;margin:auto;box-sizing:border-box;width:min(940px,96vw);max-width:calc(100dvw - 16px);max-height:calc(100dvh - 16px);overflow:auto;border:2px solid #176f4f;border-radius:12px;background:#faf8ef;color:#173b30;padding:16px;font:16px/1.45 system-ui}#lklLesson1::backdrop,#lklUseChoice::backdrop{background:#0008}#lklLesson1 header,#lklUseChoice header{display:flex;align-items:center;justify-content:space-between;gap:12px}#lklLesson1 header{position:sticky;top:-16px;z-index:2;background:#faf8ef;border-bottom:1px solid #b6c7bd;padding:6px 0}#lklLesson1 h2,#lklUseChoice h2{font-size:21px;margin:0}#lklLesson1 button,#lklUseChoice button{min-height:44px;padding:9px 12px;margin:4px;border:1px solid #78988b;border-radius:7px;background:white;color:#173b30;font:inherit}#lklLesson1 button:disabled{opacity:.45}#closeLklLesson{flex-shrink:0;font-weight:700!important}.lkl-lesson-layout{display:grid;grid-template-columns:minmax(210px,1fr) 1.3fr;gap:20px}#lklLessonTable{width:100%;height:min(60vh,580px);background:#76502c;border-radius:8px}#lklLessonTable text{font-family:system-ui;font-weight:700;paint-order:stroke;stroke:#176548;stroke-width:1.5px;fill:white}#lklStepNavigation{position:sticky;bottom:-16px;z-index:2;display:flex;flex-wrap:wrap;gap:4px;padding:8px 0;background:#faf8ef;border-top:1px solid #b6c7bd}#lklLessonNavigation{display:flex;flex-wrap:wrap;gap:4px;padding:8px 0;border-top:1px solid #b6c7bd}#lklLessonSource{background:#e4eee6;padding:8px;border-radius:6px}#lklRouteSequence{display:flex;gap:5px;flex-wrap:wrap}#lklRouteSequence button{min-height:44px;margin:0;padding:4px 7px;border:1px solid #78988b;border-radius:5px;font-size:14px;cursor:pointer}#lklRouteSequence [aria-current=step]{background:#176f4f;color:white;font-weight:800}#lklDiamondCaption{font-weight:800;color:#173b30;background:#fff0ad;padding:7px;border-radius:6px;margin:8px 0}#lklDiamondCaption[hidden]{display:none}#lklApproach{font-size:14px}#lklAnimationStatus{font-weight:700}#courseRunOutConfig{min-width:0;margin:12px 0}#courseRunOutConfig input{box-sizing:border-box;width:100px;max-width:100%;min-height:44px;font:inherit}#changeCourseAssessment{display:none!important}#lklUseChoice{width:min(560px,94vw)}#chooseLklCourse,#chooseLklPractice{display:block;text-align:left;width:100%;margin:12px 0!important}#lklUseChoice strong,#lklUseChoice span{display:block}#lklUseModes{pointer-events:auto;grid-column:1/-1;display:grid;gap:6px;margin:8px 0;padding:10px;background:#f7f4e9;border-radius:8px;color:#173b30}#lklUseModes button{white-space:normal;min-height:44px;font:600 15px system-ui;padding:8px}#lklUseModes p{font:14px/1.4 system-ui;margin:0}#lklLevelBar{position:fixed;top:calc(var(--threeb-test-banner-height,0px) + 6px);left:50%;transform:translateX(-50%);z-index:2401;display:flex;align-items:center;gap:8px;box-sizing:border-box;max-width:calc(100vw - 16px);padding:6px 10px;border-radius:9px;border:1px solid #729081;background:#faf8ef;color:#173b30;box-shadow:0 2px 8px #0003;font:600 14px system-ui}#lklLevelBar strong{white-space:nowrap}#lklLevelBar button{min-height:44px;padding:6px 10px;border:1px solid #78988b;border-radius:6px;background:white;color:#173b30;font:inherit}#lklLevelBar button[aria-pressed=true]{background:#176f4f;color:white}body.table-only #onscreenLayout{box-sizing:border-box;padding-top:72px!important}body.test-desktop-workbench #lklLevelBar{left:calc((100vw - var(--test-workbench-width) - 24px)/2)}@media(max-width:600px){.lkl-lesson-layout{display:block}#lklLessonTable{height:38dvh}#lklLesson1{padding:10px}#lklLesson1 h2{font-size:18px}#lklLesson1 header{top:-10px}#lklStepNavigation{bottom:-10px}#lklLevelBar{gap:5px;padding:5px;font-size:12px;width:calc(100vw - 16px)}#lklLevelBar button{flex:1;padding:4px 6px}}`;
  style.textContent+=`
  #lklLessonNavigation[hidden],#repeatLklLesson[hidden]{display:none!important}
  #lklLesson1{width:min(1120px,calc(100dvw - 16px));height:calc(100dvh - 16px);max-height:calc(100dvh - 16px);padding:12px;overflow:hidden}
  #lklLesson1[open]{display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:10px}
  #lklLesson1>header{position:static;padding:0 0 8px;min-width:0;box-sizing:border-box;height:60px;min-height:60px}
  #lklLesson1>header h2{font-size:19px;line-height:1.2;min-width:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  #lklLesson1 .lkl-lesson-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.85fr);gap:16px;min-height:0;overflow:hidden}
  #lklLesson1 .lkl-course-stage{display:grid;grid-template-rows:minmax(0,1fr) 36px;gap:6px;min-width:0;min-height:0;overflow:hidden}
  #lklLesson1 #lklLessonTable{display:block;width:100%;height:100%;min-height:0;max-height:100%}
  #lklLesson1 #lklDiamondCaption{margin:0;padding:5px 8px;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
  #lklLesson1 #lklDiamondCaption[hidden]{display:block;visibility:hidden}
  #lklLesson1 .lkl-course-info{min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:8px}
  #lklLesson1 #lklLessonProgress{margin:0 0 8px;font-size:14px;font-weight:700}
  #lklLesson1 #lklExerciseTitle{margin:8px 0;font-size:19px}
  #lklLesson1 .lkl-course-info p{margin:8px 0}
  #lklLesson1 #lklFixedQuestions{font-size:14px}
  #lklLesson1 .lkl-course-playback{display:flex;flex-wrap:wrap;gap:4px}
  #lklLesson1 #lklStepNavigation{position:static;display:grid;grid-template-columns:1fr 1fr;padding:8px 0 0;margin:0;gap:8px;min-width:0}
  #lklLesson1 #lklStepNavigation button{margin:0;min-width:0;height:44px;min-height:44px;font-size:15px;padding:4px;white-space:nowrap}
  #lklLesson1 #lklStepNavigation .next-chapter{white-space:normal;line-height:1.1;font-size:13px}
  #lklLesson1 #lklLessonNavigation{margin-top:12px}
  #lklLesson1 #lklLessonSource{font-size:13px}
  @media(max-width:600px) and (orientation:portrait){
    #lklLesson1{padding:8px;gap:6px}
    #lklLesson1>header h2{font-size:17px}
    #lklLesson1>header button{font-size:14px;padding:6px;margin:0}
    #lklLesson1 .lkl-lesson-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1.3fr) minmax(0,1fr);gap:10px}
    #lklLesson1 .lkl-course-stage{grid-template-rows:minmax(0,1fr) 30px;gap:4px}
    #lklLesson1 .lkl-course-info{border-top:1px solid #b6c7bd;padding-top:6px}
  }
  @media(orientation:landscape) and (max-height:500px){
    #lklLesson1{padding:6px;gap:4px}
    #lklLesson1>header{padding-bottom:3px;height:46px;min-height:46px}
    #lklLesson1>header h2{font-size:16px}
    #lklLesson1>header button{font-size:14px;padding:4px 8px;margin:0}
    #lklLesson1 .lkl-lesson-layout{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
    #lklLesson1 #lklStepNavigation{padding-top:4px}
  }`;
  style.textContent+=`#courseBridge{position:fixed;right:8px;top:calc(var(--threeb-test-banner-height,0px) + 6px);z-index:1200;display:flex;gap:4px;max-width:calc(100vw - 16px)}#courseBridge[hidden],#courseBridge button[hidden]{display:none!important}#courseBridge button{min-height:40px;border:0;border-radius:5px;background:#173b30e6;color:white;font:600 13px system-ui;padding:6px 8px}#svgMount #lklLessonTable{position:absolute;background:transparent}#lklLesson1 #lessonToIndependent{font-size:14px;min-height:44px;flex-shrink:0}#lklLesson1 #closeLklLesson{font-size:22px;min-width:44px;padding:4px;margin:0}#lklLesson1 #vijfParallelViews{display:flex;flex-wrap:wrap;gap:4px}#lklLesson1 #vijfParallelViews[hidden],#lklLesson1 #checkVijfExercise[hidden]{display:none!important}#lklLesson1 [data-vijf-view][aria-pressed=true]{background:#176f4f;color:white}`;
  style.textContent+='.course-progress-row{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0}.course-progress-row>p{margin:0!important;min-width:0;flex:1}.course-progress-row>button{flex-shrink:0;margin:0!important;font-size:14px!important;padding:6px 8px!important}';document.head.append(style);
  function el(tag,attrs={},label){const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);if(label)n.textContent=label;svg.append(n);return n;}
  const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
  function stop(){cancelAnimationFrame(frame);frame=0;running=false;for(const a of demoAnimations)a.cancel();demoAnimations=[];}
  function position(t){const part=data.journey[index],p=lerp(part.from,part.to,t);lineNode.setAttribute('x2',p.x);lineNode.setAttribute('y2',p.y);ballNode.setAttribute('cx',p.x);ballNode.setAttribute('cy',p.y);d.dataset.progress=String(t);}
  function roll(){if(!d.open||lesson!==0)return;stop();if(progress>=1)progress=0;started=performance.now()-progress*1800;running=true;$('lklRoll').textContent='Pauze';$('lklAnimationStatus').textContent='Ik volg de bal langs de '+names[data.journey[index].key]+'.';const tick=now=>{progress=Math.min(1,(now-started)/1800);position(progress);if(progress<1)frame=requestAnimationFrame(tick);else{running=false;frame=0;$('lklRoll').textContent='Opnieuw rollen';$('lklAnimationStatus').textContent=index<data.journey.length-1?'De bal is bij de band. Volgende stap: '+names[data.journey[index+1].key]+'.':(data.pattern==='LKL'?'De bal is uitgelopen tot 45% van Been. Ik bekijk VIJF opnieuw aan tafel.':'De bal is uitgelopen: hele Hiel + '+data.runOutCm+' cm.');}};frame=requestAnimationFrame(tick);}
  function drawAllCourseDiamonds(g){
    for(const band of ['west','noord','oost','zuid']){const group=el('g',{class:'course-diamonds','data-band':band,'aria-label':'Stiplijn '+band}),maximum=['west','oost'].includes(band)?80:40;
      for(let value=0;value<=maximum;value+=10){const p=SpoorGeometry.point({band,value},g),circle=document.createElementNS(ns,'circle'),text=document.createElementNS(ns,'text');for(const [k,v]of Object.entries({cx:p.x,cy:p.y,r:1.8,fill:'#fff8dc',stroke:'#382918','stroke-width':.5,'data-diamond':value}))circle.setAttribute(k,v);
        const pos=band==='west'?{x:p.x-6,y:p.y+3,'text-anchor':'end'}:band==='oost'?{x:p.x+6,y:p.y+3,'text-anchor':'start'}:band==='noord'?{x:p.x,y:p.y-7,'text-anchor':'middle'}:{x:p.x,y:p.y+11,'text-anchor':'middle'};
        for(const [k,v]of Object.entries({...pos,'font-size':8.5,style:'fill:#fff8dc;stroke:#593c21;stroke-width:1.5px','data-number':value}))text.setAttribute(k,v);text.textContent=String(value);group.append(circle,text);
      }
    }
  }
  function drawKarkasDiamonds(part,g,referenceOverride=null){
    const reference=referenceOverride||(part.key==='neus'?data.route.neus?.to:data.pattern==='LKL'&&part.key==='romp'?data.route.romp?.from:data.route[part.key]?.to);
    if(!reference||reference.value===null||reference.value===undefined||reference.value===''||!Number.isFinite(Number(reference.value))||!['west','oost','noord','zuid'].includes(reference.band))return;
    const band=reference.band,value=Number(reference.value),maximum=['west','oost'].includes(band)?80:40,existing=svg.querySelector('.course-diamonds[data-band='+band+']'),group=existing||el('g',{'class':'course-diamonds','data-band':band,'data-active-value':value,'aria-label':'Stiplijn '+band+' · '+SpoorScreenFormat.format(value)});
    group.dataset.activeValue=String(value);const tick=group.querySelector('[data-number="'+value+'"]');if(tick){tick.classList.add('active-diamond-label');tick.style.fill='#ffdc62';}
    function add(tag,attrs,text){const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;group.append(n);return n;}
    function labelAt(p){return band==='west'?{x:p.x-6,y:p.y+3,'text-anchor':'end'}:band==='oost'?{x:p.x+6,y:p.y+3,'text-anchor':'start'}:band==='noord'?{x:p.x,y:p.y-7,'text-anchor':'middle'}:{x:p.x,y:p.y+11,'text-anchor':'middle'};}
    if(!existing)for(let v=0;v<=maximum;v+=10){const p=SpoorGeometry.point({band,value:v},g);add('circle',{cx:p.x,cy:p.y,r:1.8,fill:'#fff8dc',stroke:'#382918','stroke-width':.5,'data-diamond':v});if(Math.abs(v-value)>=4||Math.abs(v-value)<1e-8){const active=Math.abs(v-value)<1e-8;add('text',{...labelAt(p),'font-size':8.5,style:'fill:'+(active?'#ffdc62':'#fff8dc')+';stroke:#593c21;stroke-width:1.5px','data-number':v,...(active?{class:'active-diamond-label'}:{})},String(v));}}
    const p=SpoorGeometry.point(reference,g);add('circle',{cx:p.x,cy:p.y,r:3,fill:'none',stroke:'#ffdc62','stroke-width':1.3,class:'active-diamond'});if(Math.abs(value-Math.round(value/10)*10)>1e-8)add('text',{...(band==='west'?{x:p.x+6,y:p.y+3,'text-anchor':'start'}:band==='oost'?{x:p.x-6,y:p.y+3,'text-anchor':'end'}:band==='noord'?{x:p.x,y:p.y+10,'text-anchor':'middle'}:{x:p.x,y:p.y-6,'text-anchor':'middle'}),'font-size':8.5,style:'fill:#ffdc62;stroke:#593c21;stroke-width:1.5px',class:'active-diamond-label'},SpoorScreenFormat.format(value));
    const anchor=referenceOverride?(reference===data.route[part.key]?.from?part.from:part.fullTo||part.to):part.key==='romp'?part.from:part.fullTo||part.to;add('line',{x1:anchor.x,y1:anchor.y,x2:p.x,y2:p.y,stroke:'#ffdc62','stroke-width':.7,'stroke-dasharray':'2 2',class:'diamond-reference'});
    $('lklDiamondCaption').textContent=names[part.key]+' · '+({west:'West',oost:'Oost',noord:'Noord',zuid:'Zuid'}[band])+' · '+SpoorScreenFormat.format(value);$('lklDiamondCaption').hidden=false;
  }
  const progressRow=document.createElement('div');progressRow.className='course-progress-row';$('lklLessonProgress').before(progressRow);const tableToggle=document.createElement('button');tableToggle.id='courseTableToggle';tableToggle.type='button';progressRow.append($('lklLessonProgress'),tableToggle);
  tableToggle.onclick=()=>{const fraction=progress,wasRunning=running;stop();window.ThreeBTableText.update({courseTable:data.table==='klein'?'groot':'klein'});data=readLessonData();render();if(lesson===0){stop();progress=fraction;position(progress);if(wasRunning)roll();else $('lklRoll').textContent=progress===1?'Opnieuw rollen':'Verder rollen';}remember();};
  const kzDefinitions=[
    {romp:'VIJF',kruis:'ACHT',miss:'ZEVEN'},
    {romp:'VIJF',kruis:'ZEVEN',miss:'ZES'},
    {romp:'VIJF-1',kruis:'ZES',miss:'ZES-2'}
  ];
  const parallelTracks=['VIJF-2','VIJF-1','VIJF','VIJF+1','VIJF+2','VIJF+3'],crossTracks=kzDefinitions.map(c=>c.miss);
  const courseScopeTracks=()=>lesson===4?['VIJF']:lesson===3?adapter.courseTrackKeys():parallelTracks;
  const parallelViews=document.createElement('nav');parallelViews.id='vijfParallelViews';parallelViews.setAttribute('aria-label','Tafelviews');parallelViews.innerHTML='<button type="button" data-vijf-view="whole">Spoor</button><button type="button" data-vijf-view="framework">Karkas</button><button type="button" data-vijf-view="arrivals">Aankomst</button>';parallelViews.hidden=true;$('lklExerciseText').after(parallelViews);
  const checkExercise=document.createElement('button');checkExercise.id='checkVijfExercise';checkExercise.type='button';checkExercise.textContent='Toon Karkas · controle';checkExercise.hidden=true;$('lklExerciseText').after(checkExercise);checkExercise.onclick=()=>{checked=!checked;render();};
  function courseTrack(){if(lesson===3)return kzSelected?.table===(adapter.tableTextSettings?.().courseTable||'klein')?kzSelected.track:'VIJF';return lesson===2?(parallelTracks[index]||'VIJF'):'VIJF';}
  function readLessonData(){const result=lesson===1?adapter.lesson2Data():adapter.lesson1Data(courseTrack());if(lesson!==3&&lesson!==2&&!result.journey.length)throw Error(lesson===3?'Het Kruis is nog niet berekenbaar.':'Het Karkas van VIJF is nog onvolledig.');return result;}
  const angleSketch=document.createElement('div');angleSketch.id='lklCrossAngle';angleSketch.hidden=true;angleSketch.innerHTML='<svg viewBox="0 0 150 105" width="150" height="105" style="width:150px;height:105px;max-width:100%" role="img" aria-label="45 graden: gelijke horizontale en verticale verplaatsing"><path d="M15 85H100V0" fill="none" stroke="#80988a" stroke-dasharray="4 4"/><path d="M15 85L100 0" stroke="#9b356c" stroke-width="4"/><text x="42" y="76" fill="#173b30" font-size="18">45°</text><path d="M89 85V74H100" fill="none" stroke="#80988a"/></svg><p class="hint">45°: horizontaal en verticaal even ver.</p>';$('lklExerciseTitle').after(angleSketch);
  function field(){const g=data.geometry;svg.replaceChildren();window.ThreeBUniformBalls.courseFrame(svg,g,data.table||'klein');el('rect',{x:0,y:0,width:g.widthCm,height:g.heightCm,fill:'#176548',stroke:'#f7df98','stroke-width':1.4});$('lklDiamondCaption').hidden=true;drawAllCourseDiamonds(g);}
  function courseEndpointLabels(p){
    const prefs=adapter.tableTextSettings?.()||{showEndpoints:true,endpointSize:15};if(!prefs.showEndpoints)return;
    const pair=data.route[p.key],dx=p.to.x-p.from.x,dy=p.to.y-p.from.y,len=Math.hypot(dx,dy);if(!pair||!len)return;
    for(const [side,ref,a,b]of [['V',p.key==='neus'?data.neusDeparture:pair.from,p.from,p.to],...(p.fraction<1?[]:[['A',pair.to,p.to,p.from]])]){
      if(ref?.value===null||ref?.value===undefined||ref?.value==='')continue;const t=.16;
      el('text',{class:'endpoint-value','data-part':p.key,'data-side':side,'data-value':ref.value,'data-value-band':ref.band,x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,'text-anchor':'middle','dominant-baseline':'middle',style:'fill:#173b30;stroke:#fff8df;stroke-width:1.2px;pointer-events:none'},p.key==='neus'&&side==='A'&&adapter.neusArrivalLabel?adapter.neusArrivalLabel(ref.value,data.track):SpoorScreenFormat.format(ref.value));
    }
    requestAnimationFrame(()=>{const m=svg.getScreenCTM();if(!m)return;const unit=Math.hypot(m.a,m.b);for(const text of svg.querySelectorAll('.endpoint-value'))text.style.fontSize=(prefs.endpointSize/unit)+'px';});
  }
  function courseSegment(p,thin=false){const line=el('line',{x1:p.from.x,y1:p.from.y,x2:p.to.x,y2:p.to.y,stroke:thin?'#f5d680':colors[p.key],'stroke-width':thin?.7:3.5,...(thin?{'stroke-dasharray':'3 2',opacity:.7}:{})});line.dataset.part=p.key;line.dataset.reference=String(thin);if(!thin){courseEndpointLabels(p);const q=lerp(p.from,p.to,.5);el('text',{x:q.x+2,y:q.y-4,'font-size':7.5},names[p.key]);}}
  function numberedBall(p,n,color,cls){const circle=el('circle',{cx:p.x,cy:p.y,r:data.radiusCm,fill:color,stroke:'#222','stroke-width':.5,class:cls});el('text',{x:p.x,y:p.y,'dominant-baseline':'middle','font-size':4.5,'text-anchor':'middle',class:'ball-number',style:'fill:#17271f;stroke:none'},String(n));return circle;}
  function stepDemo(){
    stop();if(lesson===3||lesson===2&&index===parallelTracks.length){$('repeatLklLine').hidden=true;d.dataset.demo='still';return;}$('repeatLklLine').hidden=false;$('repeatLklLine').textContent='Demo opnieuw';
    const nodes=[...svg.querySelectorAll(lesson===2&&(index===parallelTracks.length||parallelView==='arrivals')?'.course-arrival':'line[data-part]:not([data-reference=true])')];
    $('repeatLklLine').hidden=nodes.length===0;
    nodes.forEach((node,i)=>{const length=node.tagName.toLowerCase()==='line'?Math.hypot(+node.getAttribute('x2')-+node.getAttribute('x1'),+node.getAttribute('y2')-+node.getAttribute('y1')):0;
      demoAnimations.push(node.animate(length?[{strokeDasharray:String(length),strokeDashoffset:String(length)},{strokeDasharray:String(length),strokeDashoffset:'0'}]:[{opacity:.15},{opacity:1}],{duration:700,delay:i*300,fill:'both'}));
    });
    d.dataset.demo='step';
  }
  function quietStep(){stop();$('harderLkl').hidden=true;$('courseRunOutConfig').hidden=true;$('lklRoll').hidden=true;$('repeatLklLine').hidden=true;$('lklAnimationStatus').textContent='';$('lklGeometryNotice').textContent='';$('lklRouteSequence').replaceChildren();$('lklLessonSource').textContent='Kruins tafel · metingen van Kruin';$('lklLessonTitle').textContent=lessons[lesson].title;d.dataset.lesson=String(lesson+2);d.dataset.source=data.source;d.dataset.pattern=data.pattern;d.dataset.track=data.track;d.dataset.table=data.table||'klein';d.dataset.signature=JSON.stringify(data.route);$('previousLklLesson').disabled=lesson===0&&!systemIntro;$('nextLklLesson').disabled=lesson===lessons.length-1;info.scrollTop=0;d.scrollTop=0;}
  function renderParallel(){
    data=adapter.lesson1Data(courseTrack());quietStep();const overview=index===parallelTracks.length,view=overview?'arrivals':parallelView;parallelViews.hidden=overview;d.dataset.line=overview?'aankomsten':'parallellen';d.dataset.view=view;
    $('lklLessonProgress').textContent=`Stap ${index+1} van ${parallelTracks.length+1} · ${data.trackLabel} · ${data.tableLabel||'Klein'}`;
    $('lklExerciseTitle').textContent=overview?'Tot slot: de ballen op Zuid':data.trackLabel+' vergelijken met VIJF';
    $('lklExerciseText').textContent=overview?'De aankomsten van VIJF−1, VIJF, VIJF+1, VIJF+2 en VIJF+3 samen. Op de zuidband staan alleen de ballen met −1, 0, +1, +2 en +3. Het nummer 0 is VIJF zelf.':'Ik verschuif mijn afstoot parallel. Ik vergelijk '+data.trackLabel+' met het basisspoor VIJF en bekijk ook de aankomst. Afzonderlijke gemeten vervolglijnen hoeven niet strikt parallel te lopen.';
    if(!overview&&data.departureAdjustment)$('lklExerciseText').textContent+=' Bij VIJF−2 ligt het theoretische vertrek op de zuidband. Daar past geen hele bal. De getoonde bal is iets naar binnen geschoven op dezelfde Neuslijn: dezelfde richting en meetwaarden, een iets kortere Neus.';
    if(!overview&&view==='arrivals')$('lklExerciseText').textContent+=' Aankomst toont punten. Met Spoor zie je de lijnen weer.';
    $('lklApproach').textContent=overview?'Dezelfde vijf sporen, elk met zijn eigen aankomst.':'VIJF−2 → VIJF−1 → VIJF → VIJF+1 → VIJF+2 → VIJF+3 → aankomsten.';
    for(const b of parallelViews.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.vijfView===view));field();
    if(overview){const missing=[];for(const [i,track] of ['VIJF-1','VIJF','VIJF+1','VIJF+2','VIJF+3'].entries()){const choice=track==='VIJF'?data:adapter.lesson1Data(track),arrival=choice.journey.find(p=>p.key==='romp'&&p.band==='zuid'&&p.fraction===1);if(!arrival){missing.push(track);continue;}el('circle',{cx:arrival.to.x,cy:arrival.to.y,r:choice.radiusCm,fill:'#fff8df',stroke:'#222','stroke-width':.5,class:'course-arrival course-south-arrival','data-track':track,'data-band':'zuid','data-source':'kruin',role:'img','aria-label':track+' · aankomst op Zuid'});const offset=i-1,label=document.createElementNS(ns,'g'),text=document.createElementNS(ns,'text');label.setAttribute('class','south-offset-number');Object.assign(label.dataset,{x:String(arrival.to.x),y:String(arrival.to.y),row:String(i%2),offset:String(offset)});text.textContent=offset>0?'+'+offset:offset<0?'−'+Math.abs(offset):'0';label.append(text);svg.append(label);}if(missing.length)$('lklGeometryNotice').textContent='Geen berekenbare zuidaankomst voor '+missing.join(', ')+'. Die bal wordt niet getekend.';return;}
    if(data.excluded){const unknown=data.actualPattern==='?';$('lklGeometryNotice').textContent=unknown?data.trackLabel+': het bandverloop is nog niet te bepalen. Controleer Neus, Kop en Romp in de gebruikte meetbasis.':data.trackLabel+' valt buiten LKL ('+data.actualPattern+'). De tafel blijft leeg.';el('text',{x:data.geometry.widthCm/2,y:data.geometry.heightCm/2,'text-anchor':'middle','font-size':6.5},unknown?'Meetbasis nog onvolledig':'Geen passend LKL-spoor');return;}
    if(data.unavailable)$('lklGeometryNotice').textContent=data.track==='VIJF-2'?'Bij VIJF−2 valt de opgeslagen Romp-lijn bij de hoek buiten de opgegeven band. Hier zie je daarom alleen het berekenbare voorste deel; de meetwaarden blijven behouden.':'Het vervolg vanaf '+names[data.unavailable]+' is nog niet geldig of bepaald. Ik toon alleen het beschikbare Spoor.';
    const base=adapter.lesson1Data('VIJF');if(view==='framework')for(const p of base.journey.filter(p=>['neus','romp'].includes(p.key)))courseSegment(p,true);
    for(const p of data.journey){
      if(view==='arrivals'&&p.fraction===1)drawKarkasDiamonds(p,data.geometry,data.route[p.key]?.to);else if(view!=='arrivals'&&['neus','romp'].includes(p.key))drawKarkasDiamonds(p,data.geometry);
      if(view==='arrivals'){
        if(p.fraction===1){const ref=data.route[p.key]?.to;const mark=numberedBall(p.to,'',colors[p.key],'course-arrival');mark.dataset.arrival=p.key;const q=lerp(p.to,{x:data.geometry.widthCm/2,y:data.geometry.heightCm/2},.1);el('text',{'data-arrival-label':p.key,x:q.x,y:q.y,'font-size':5.8,'text-anchor':'middle'},names[p.key]+' '+SpoorScreenFormat.format(ref?.value));}

      }else if(view==='whole'||['neus','romp'].includes(p.key))courseSegment(p);
    }
    if(view!=='arrivals'){const nose=data.journey.find(p=>p.key==='neus');if(nose){const ball=numberedBall(nose.from,1,'white','lesson-ball');if(data.departureAdjustment)ball.dataset.adjustedStart='true';}const body=data.journey.find(p=>p.key==='romp');if(body)numberedBall(lerp(body.from,body.to,.55),3,'#f34d4d','lesson-target');}
  }

  parallelViews.onclick=e=>{const view=e.target.closest('[data-vijf-view]')?.dataset.vijfView;if(view){parallelView=view;render();}};
  const viaTwo=document.createElement('section');viaTwo.id='viaBallTwoIntro';viaTwo.hidden=true;viaTwo.innerHTML='<svg viewBox="0 0 240 175" width="240" height="175" style="display:block;max-width:100%;height:auto" role="img" aria-label="Schema: aanloop naar bal 2 en gewenste Neus na contact"><defs><marker id="viaTwoArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#173b30"/></marker></defs><path d="M115 160V115" fill="none" stroke="#173b30" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#viaTwoArrow)"/><path d="M115 95L75 25.7" fill="none" stroke="#298db0" stroke-width="4" marker-end="url(#viaTwoArrow)"/><circle cx="115" cy="95" r="17" fill="white" stroke="#173b30"/><circle cx="144.444" cy="78" r="17" fill="#f3d65d" stroke="#173b30"/><text x="115" y="101" text-anchor="middle" font-size="17" fill="#173b30">1</text><text x="144.444" y="84" text-anchor="middle" font-size="17" fill="#173b30">2</text><text x="22" y="35" font-size="15" fill="#173b30">Neus</text><text x="130" y="155" font-size="15" fill="#173b30">Aanloop</text></svg><p>Schema: de aanloop naar bal 2 en de gewenste Neus zijn verschillende richtingen. Dit schema geeft geen vaste raakdikte voor iedere ligging.</p><h4>Dik of dun raken</h4><p>Hoeveel je bal 2 raakt, beïnvloedt hoe beide ballen verdergaan. De ligging van bal 1 en bal 2 bepaalt hoe je op de gewenste Neus kunt aansluiten. Je zoekt geen vaste dikte die altijd bij VIJF hoort.</p><h4>Hoog of laag afstoten</h4><p>Dik/dun gaat over hoeveel je bal 2 raakt. Hoog/laag gaat over waar je bal 1 met de pomerans raakt. Die afstoothoogte beïnvloedt de rol en de richting waarin bal 1 na het contact verdergaat. Het zijn verschillende keuzes die samen de uitvoering bepalen.</p><h4>Rollend of schuivend</h4><p>Hoog/laag benoemt waar de pomerans bal 1 raakt. Rollend/schuivend benoemt de toestand van bal 1 wanneer hij bal 2 bereikt. Dat is niet automatisch hetzelfde: ook de afstand en het tempo spelen mee. Die toestand beïnvloedt het vertrek na bal 2 en hoort dus bij de aansluiting op het gekozen Spoor.</p><h4>Tempo en verdere uitvoering</h4><p>Ook snelheid, afstand tot bal 2 en de lengte van de Neus tellen mee. We behandelen die onderdelen gericht bij de voorbeelden. Zij-effect en precieze correcties werken we later uit.</p><h4>Hoe bereik je het gekozen Spoor?</h4><p>Eerst bepaal je op welk Spoor bal 3 ligt. Daarna bekijk je hoe bal 1 via bal 2 op de Neus van dat Spoor kan vertrekken. VIJF is het eerste herkenbare voorbeeld; dezelfde aanpak geldt voor de andere Sporen en hun parallellen, met hun eigen Neus.</p><h4>De klos</h4><p>Bal 2 blijft na het contact ook bewegen. Hij kan later opnieuw op de weg van bal 1 komen. Kruisende baanlijnen alleen betekenen nog geen klos: de ballen moeten daar ook tegelijk aankomen.</p><p>De verdere voorbeelden behandelen de uitvoeringskeuzes afzonderlijk en in samenhang. De cursus blijft Kruins meetbasis gebruiken.</p>';$('lklExerciseText').after(viaTwo);
  function renderViaTwo(){
    quietStep();d.dataset.chapter='2';d.dataset.line='via-bal-2';$('lklLessonProgress').textContent='Introductie · de Sporen · '+data.tableLabel;$('lklExerciseTitle').textContent='Via bal 2 naar het gekozen Spoor';$('lklExerciseText').textContent='Bal 3 ligt op het gekozen Spoor. Nu speel je bal 1 eerst tegen bal 2. Na dat contact moet bal 1 op de bijbehorende Neus vertrekken. VIJF is hier het eerste voorbeeld.';$('lklApproach').textContent='De tafel toont de gewenste Neus van VIJF na bal 2; het schema ernaast onderscheidt de aanloop en het vertrek.';$('lklCourseSimulationNote').textContent='De getekende Neus komt uit Kruins meetbasis. Het schema toont geen berekende botsing of zekerheid over een klos.';field();const nose=data.journey.find(p=>p.key==='neus'),body=data.rompPart||data.journey.find(p=>p.key==='romp');
    if(body)courseSegment(body,true);if(nose){courseSegment(nose);drawKarkasDiamonds(nose,data.geometry);numberedBall(nose.from,1,'white','lesson-ball');}if(body)numberedBall(lerp(body.from,body.to,.55),3,'#f34d4d','lesson-target');
  }

  // Finite centre trajectories; a stationary B3 can be reached within r1+r3.
  const doubles=document.createElement('section');doubles.id='h1DoubleTracks';
  $('lklExerciseText').after(doubles);
  function distanceToPart(p,b){const x=b.to.x-b.from.x,y=b.to.y-b.from.y,t=Math.max(0,Math.min(1,((p.x-b.from.x)*x+(p.y-b.from.y)*y)/(x*x+y*y)));return Math.hypot(p.x-b.from.x-t*x,p.y-b.from.y-t*y);}
  function doubleZone(a,b,r){
    const at=t=>lerp(a.from,a.to,t),dist=t=>distanceToPart(at(t),b);
    let lo=0,hi=1;for(let k=0;k<90;k++){const u=(2*lo+hi)/3,v=(lo+2*hi)/3;if(dist(u)<dist(v))hi=v;else lo=u;}
    const mid=(lo+hi)/2;if(dist(mid)>r+1e-8)return null;
    let l=0,h=mid;for(let k=0;k<60;k++){const t=(l+h)/2;if(dist(t)<=r)h=t;else l=t;}const start=dist(0)<=r?0:h;
    l=mid;h=1;for(let k=0;k<60;k++){const t=(l+h)/2;if(dist(t)<=r)l=t;else h=t;}const end=dist(1)<=r?1:l;
    const ax=a.to.x-a.from.x,ay=a.to.y-a.from.y,bx=b.to.x-b.from.x,by=b.to.y-b.from.y,det=ax*by-ay*bx,dx=b.from.x-a.from.x,dy=b.from.y-a.from.y;
    const t=(dx*by-dy*bx)/det,u=(dx*ay-dy*ax)/det;
    const nearA=at(mid),vx=b.to.x-b.from.x,vy=b.to.y-b.from.y,bt=Math.max(0,Math.min(1,((nearA.x-b.from.x)*vx+(nearA.y-b.from.y)*vy)/(vx*vx+vy*vy))),nearB=lerp(b.from,b.to,bt);
    return {nearA,nearB,from:at(start),to:at(end),length:(end-start)*Math.hypot(ax,ay),hit:Math.abs(det)>1e-9&&t>=0&&t<=1&&u>=0&&u<=1?at(t):null};
  }




  const kzCases=new Map();
  const kzPositions=new Map(),kzPresetIndices=new Map();let kzSelected=null,kzPointer=null;
  function kzContact(part,center,D){
    if(!part)return null;
    const dx=part.to.x-part.from.x,dy=part.to.y-part.from.y,length=Math.hypot(dx,dy),ux=dx/length,uy=dy/length;
    const along=(center.x-part.from.x)*ux+(center.y-part.from.y)*uy,perp=(center.x-part.from.x)*uy-(center.y-part.from.y)*ux;
    if(Math.abs(perp)>D)return null;
    const travel=along-Math.sqrt(Math.max(0,D*D-perp*perp));
    return travel>=0&&travel<=length?{x:part.from.x+travel*ux,y:part.from.y+travel*uy}:null;
  }

  const kzTrackSets=new Map();
  function kzCase(){
    const table=adapter.tableTextSettings?.().courseTable||'klein',baseKey=crossTracks[index],key=table+':'+index+':'+baseKey;
    if(kzCases.has(key))return kzCases.get(key);
    if(!kzTrackSets.has(table)){
      const tracks=[];for(const name of adapter.courseTrackKeys()){try{tracks.push(adapter.lesson1Data(name));}catch(_){}}
      kzTrackSets.set(table,tracks);
    }

    const definition=kzDefinitions[index],tracks=kzTrackSets.get(table);
    const base=tracks.find(t=>t.track===definition.miss),one=tracks.find(t=>t.track===definition.romp),two=tracks.find(t=>t.track===definition.kruis);
    const incoming=base?.rompPart,cross=base?.kruisPart,D=2*(base?.radiusCm||0);
    const projection=(p,part)=>{const dx=part.to.x-part.from.x,dy=part.to.y-part.from.y;return ((p.x-part.from.x)*dx+(p.y-part.from.y)*dy)/(dx*dx+dy*dy);};
    const joined=t=>t.rompPart&&t.kruisPart&&Math.hypot(t.rompPart.to.x-t.kruisPart.from.x,t.rompPart.to.y-t.kruisPart.from.y)<1e-4;
    const center=one?.rompPart&&two?.kruisPart?doubleZone(one.rompPart,two.kruisPart,D)?.hit:null;
    let result=null;
    if(center&&incoming&&cross&&joined(base)&&joined(two)){
      const before=distanceToPart(center,incoming),after=distanceToPart(center,cross),t=projection(center,cross);
      const atY=part=>{const u=(center.y-part.from.y)/(part.to.y-part.from.y);return u>=0&&u<=1?part.from.x+u*(part.to.x-part.from.x):null;};
      const x1=atY(incoming),x2=atY(cross),between=x1!==null&&x2!==null&&center.x>Math.min(x1,x2)&&center.x<Math.max(x1,x2);
      const contact1=kzContact(one.rompPart,center,D),contact2=kzContact(two.kruisPart,center,D);
      if(contact1&&contact2&&projection(contact1,one.rompPart)>.35&&projection(center,incoming)>.35&&before>D+.25&&after>D+.25&&distanceToPart(center,two.rompPart)>D+.25&&between&&t>0&&t<1)
        result={center,before,after,t,contact1,contact2,base,one,two,D};
    }
    kzCases.set(key,result);return result;
  }

  function kzMove(point){
    if(lesson!==3||!data)return;
    const g=data.geometry,r=data.radiusCm;
    kzPositions.set(data.table,{x:Math.max(r,Math.min(g.widthCm-r,point.x)),y:Math.max(r,Math.min(g.heightCm-r,point.y))});
    renderDoubles();stepNavigation();
  }
  function renderDoubles(){
    stop();doubles.replaceChildren();field();const labels=[],table=data.table,g=data.geometry,r=data.radiusCm;
    if(kzPresetIndices.get(table)!==index||!kzPositions.has(table)){
      const example=kzCase();kzPositions.set(table,example?{...example.center}:{x:g.widthCm/2,y:g.heightCm*.75});kzPresetIndices.set(table,index);kzSelected=null;
    }
    const center=kzPositions.get(table),tracks=kzTrackSets.get(table)||[];
    const matches=window.ThreeBKzSolver.solutions(tracks,center,r);
    const selected=matches.find(m=>kzSelected?.table===table&&m.track===kzSelected.track&&m.kind===kzSelected.kind)||matches[0];
    kzSelected=selected?{table,track:selected.track,kind:selected.kind}:null;
    if(selected)data=selected.trackData;
    const name=key=>key.replace('-','−');
    const presets=document.createElement('nav');presets.id='kzExamples';presets.setAttribute('aria-label','Startposities');presets.style.cssText='display:flex;flex-wrap:wrap;gap:6px';
    for(const [i,definition]of kzDefinitions.entries()){
      const button=document.createElement('button');button.type='button';button.style.cssText='min-width:0;font-size:13px;padding:6px';button.textContent=name(definition.romp)+' × '+definition.kruis;button.dataset.kzExample='case-'+i;
      button.onclick=()=>{index=i;kzPresetIndices.delete(table);kzSelected=null;render();info.scrollTop=0;};presets.append(button);
    }
    doubles.append(presets);
    const movement=document.createElement('nav');movement.id='kzMoveB3';movement.setAttribute('aria-label','B3 verplaatsen');movement.style.cssText='display:flex;gap:6px;margin:10px 0';
    for(const [text,dx,dy,direction]of [['←',-1,0,'links'],['↑',0,-1,'boven'],['↓',0,1,'beneden'],['→',1,0,'rechts']]){
      const button=document.createElement('button');button.type='button';button.textContent=text;button.setAttribute('aria-label','B3 naar '+direction);button.dataset.kzNudge=direction;button.onclick=()=>{const p=kzPositions.get(table);kzMove({x:p.x+dx,y:p.y+dy});svg.focus({preventScroll:true});};movement.append(button);
    }
    doubles.append(movement);
    const results=document.createElement('section');results.id='kzResults';results.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px';
    for(const [kind,title]of [['romp','Romp'],['kruis','Kruis']]){
      const items=matches.filter(m=>m.kind===kind),group=document.createElement('section'),heading=document.createElement('strong');group.style.minWidth='0';heading.textContent=title+' ('+items.length+')';group.append(heading);
      const list=document.createElement('div');list.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px';list.dataset.kzMatches=kind;
      for(const item of items){
        const button=document.createElement('button');button.type='button';button.textContent=name(item.track);button.dataset.kzMatch=kind+':'+item.track;button.setAttribute('aria-pressed',String(item===selected));button.style.cssText='font-size:14px;padding:6px 10px';
        if(item===selected){button.style.background=kind==='romp'?'#ffdc62':'#ed88b6';button.style.color='#173b30';}
        button.onclick=()=>{kzSelected={table,track:item.track,kind};render();};list.append(button);
      }
      if(!items.length){const empty=document.createElement('span');empty.textContent='Geen passende lijn op deze plek.';list.append(empty);}
      group.append(list);results.append(group);
    }
    doubles.prepend(results);
    if(matches.length>2){const alert=document.createElement('p');alert.dataset.kzAlternativesAlert='true';alert.setAttribute('role','status');alert.style.cssText='padding:8px;border:2px solid #b86e00;border-radius:6px;font-weight:bold';alert.textContent='Te veel alternatieve paden ('+(matches.length-1)+'). Kies een spoor via de knoppen; de alternatieve lijnen blijven verborgen.';results.after(alert);}
    const label=(p,text,color)=>{const n=el('text',{x:p.x+4,y:p.y-3,'font-size':6,style:'fill:'+color},text);labels.push(n);return n;};
    const line=(part,color,text,dashed=false)=>{
      el('line',{x1:part.from.x,y1:part.from.y,x2:part.to.x,y2:part.to.y,stroke:color,'stroke-width':2*r,'stroke-linecap':'round',opacity:.38,'data-kz-ballwidth':text});
      el('line',{x1:part.from.x,y1:part.from.y,x2:part.to.x,y2:part.to.y,stroke:color,'stroke-width':.55,...(dashed?{'stroke-dasharray':'3 2',opacity:.7}:{}),'data-kz-line':text});
      const dx=part.to.x-part.from.x,dy=part.to.y-part.from.y,len=Math.hypot(dx,dy);if(len<1e-9)return label(part.from,text,color);const tip=lerp(part.from,part.to,.65),ux=dx/len,uy=dy/len,head=Math.min(4,len*.45),half=head*.45;
      el('polygon',{points:tip.x+','+tip.y+' '+(tip.x-head*ux-half*uy)+','+(tip.y-head*uy+half*ux)+' '+(tip.x-head*ux+half*uy)+','+(tip.y-head*uy-half*ux),fill:color});
      return label(lerp(part.from,part.to,.4),text,color);
    };
    // Show a single alternative without obscuring the chosen ball-width path.
    if(selected&&matches.length===2){
      const alternative=matches.find(item=>item!==selected),{track,kind,part,contact,trackData}=alternative;
      const group=el('g',{'data-kz-alternative':kind+':'+track,role:'button',tabindex:'0','aria-label':'Kies '+(kind==='romp'?'Romp ':'Kruis ')+name(track),style:'cursor:pointer'});
      const choose=event=>{event.preventDefault();event.stopPropagation();kzSelected={table,track,kind};render();};
      group.onpointerdown=event=>event.stopPropagation();group.onclick=choose;group.onkeydown=event=>{if(event.key==='Enter'||event.key===' ')choose(event);};
      const color=kind==='romp'?'#ffdc62':'#ed88b6';
      const parts=kind==='kruis'?[trackData.rompPart,{...part,to:contact}]:[{...part,to:contact}];
      for(const [i,p]of parts.entries()){
        const attrs={x1:p.from.x,y1:p.from.y,x2:p.to.x,y2:p.to.y};
        const hit=el('line',{...attrs,stroke:'transparent','stroke-width':6,'pointer-events':'stroke'});group.append(hit);
        const guide=el('line',{...attrs,stroke:color,'stroke-width':.55,'pointer-events':'none',...(kind==='kruis'&&i===0?{'stroke-dasharray':'3 2'}:{})});group.append(guide);
      }
      const caption=label(lerp(part.from,contact,.5),'Alternatief: '+(kind==='romp'?'Romp ':'Kruis ')+name(track),color);group.append(caption);
    }
    let b1=null,b1Label=null,points=null;
    if(selected){
      const {track,kind,contact,part,trackData}=selected;
      if(kind==='romp'){
        line({...part,to:contact},'#ffdc62','Romp '+name(track));points=[part.from,contact];
      }else{
        line(trackData.rompPart,'#e3e9db','Aanloop '+name(track),true);
        const caption=line({...part,to:contact},'#ed88b6','Kruis '+name(track));if(Math.hypot(contact.x-part.from.x,contact.y-part.from.y)<6*r)caption.setAttribute('y',Number(caption.getAttribute('y'))+10);
        points=[trackData.rompPart.from,trackData.rompPart.to,contact];
      }
      b1=el('circle',{cx:contact.x,cy:contact.y,r:trackData.radiusCm,fill:'white',stroke:'#222','stroke-width':.4,'data-kz-b1':'true'});
      b1Label=label(contact,'B1','#fff');
      const play=document.createElement('button');play.type='button';play.id='kzFollowB1';play.textContent='Volg '+(kind==='romp'?'Romp ':'Kruis ')+name(track);results.after(play);
      play.onclick=()=>{
        stop();svg.dataset.kzDemo='running';const begin=performance.now(),lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y)),length=lengths.reduce((a,b)=>a+b,0);
        const at=p=>{b1.setAttribute('cx',p.x);b1.setAttribute('cy',p.y);b1Label.setAttribute('x',p.x+4);b1Label.setAttribute('y',p.y-3);};at(points[0]);
        const tick=now=>{const fraction=Math.min(1,(now-begin)/2400);let travel=fraction*length,i=0;while(i<lengths.length-1&&travel>lengths[i]){travel-=lengths[i];i++;}at(lerp(points[i],points[i+1],lengths[i]?travel/lengths[i]:1));if(fraction<1)frame=requestAnimationFrame(tick);else{frame=0;svg.dataset.kzDemo='contact';}};frame=requestAnimationFrame(tick);
      };
    }
    const ball=el('circle',{cx:center.x,cy:center.y,r,fill:'#f34d4d',stroke:'#222','stroke-width':.4,'data-kz-b3':'true',style:'cursor:grab'});
    ball.setAttribute('aria-label','B3, verplaats op tafel');label(center,'B3','#fff');
    svg.dataset.kzSolutionKind=selected?.kind||'none';svg.dataset.kzSolutionTrack=selected?.track||'';svg.dataset.kzMatchCount=String(matches.length);
    svg.style.touchAction='none';svg.style.cursor='crosshair';svg.setAttribute('tabindex','0');svg.setAttribute('aria-label','Verplaats B3 op de biljarttafel; het systeem toont passende Rompen en Kruisen');
    const local=event=>new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());
    svg.onpointerdown=event=>{if(lesson!==3||event.button!==0)return;const p=local(event);if(p.x<0||p.x>g.widthCm||p.y<0||p.y>g.heightCm)return;event.preventDefault();kzPointer=event.pointerId;svg.setPointerCapture(event.pointerId);svg.focus({preventScroll:true});kzMove(p);};
    svg.onpointermove=event=>{if(lesson!==3||kzPointer!==event.pointerId)return;event.preventDefault();kzMove(local(event));};
    svg.onpointerup=svg.onpointercancel=event=>{if(kzPointer===event.pointerId){kzPointer=null;if(svg.hasPointerCapture(event.pointerId))svg.releasePointerCapture(event.pointerId);}};
    svg.onkeydown=event=>{if(lesson!==3)return;const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(d){event.preventDefault();const step=event.shiftKey?5:1;kzMove({x:center.x+d[0]*step,y:center.y+d[1]*step});}};
    requestAnimationFrame(()=>{const m=svg.getScreenCTM();if(m){const unit=Math.hypot(m.a,m.b);for(const n of labels)n.style.fontSize=(11/unit)+'px';}});
    $('lklDiamondCaption').hidden=true;if(kzPointer!==null)results.scrollIntoView({block:'start'});
  }
  function renderCross(){
    data=adapter.lesson1Data(courseTrack());quietStep();d.dataset.line='kruis';
    $('lklLessonProgress').textContent='B3 bepaalt de keuze · '+data.tableLabel;
    $('lklExerciseTitle').textContent='Waar ligt B3?';
    $('lklExerciseText').textContent='Sleep B3: het systeem toont direct de passende Rompen en Kruisen.';
    $('lklApproach').textContent='Kies een gevonden lijn om de oplossing op tafel te zien.';
    $('lklCourseSimulationNote').textContent='De strook is één bal breed. Bij een Kruis-oplossing passeert de aanloop B3 vrij.';
    angleSketch.hidden=true;renderDoubles();
  }
  function renderBackwards(){
    stop();const body=data.journey.find(p=>p.key==='romp'),nose=data.journey.find(p=>p.key==='neus'),g=data.geometry;if(!body||!nose)throw Error('Neus of Romp is nog niet bepaald.');
    quietStep();d.dataset.line=['ballen','romp','karkas','neus'][index];d.dataset.reverseStep=String(index);
    $('lklLessonProgress').textContent=`Stap ${index+1} van 4 · VIJF · terugredeneren · ${data.tableLabel||'Klein'}`;
    $('lklExerciseTitle').textContent=['Eerst twee ballen','Welke Romp? VIJF past','Het Karkas van VIJF','De Neus: mijn stootrichting'][index];
    $('lklExerciseText').textContent=[
      'Ik zie bal 1 en bal 3. Binnen deze reeks van het Patroon LKL kies ik uit een beperkt aantal Rompen: VIER, VIJF, ZES, ZEVEN en ACHT. Welke past bij bal 3?',
      'Ik vergelijk de Rompen van VIER, VIJF, ZES, ZEVEN en ACHT. De Romp van VIJF gaat door bal 3; de andere Rompen passen hier niet. VIJF wint: bal 3 ligt op VIJF. Ik herken zo het Spoor binnen het gekozen Patroon LKL.',
      'Ik voeg de Neus toe: Neus en Romp vormen samen het zichtbare Karkas van VIJF. Ik herken nu het verband tussen de plaats van bal 3 op de Romp en mijn vertrek met bal 1. Kop en Nek verbinden die lijnen bij het werkelijke bandverloop.',
      'Ik licht de Neus van VIJF uit als stootrichting: vanaf bal 1 naar 50 op de westelijke stiplijn. Balcontact met de band ligt vóór die stiplijn. Ik volg dezelfde gemeten VIJF; de Neus is niet uit alleen de Romp berekend.'
    ][index]+' Voor het gemak zijn bal 1 en bal 3 hier precies op hetzelfde Spoor VIJF geplaatst. Correcties als bal 1 niet helemaal bij dat Spoor past, komen later aan de orde.';
    if(index===1){const missing=data.rompChoices.filter(c=>!c.part).map(c=>c.track);if(missing.length){$('lklGeometryNotice').textContent='Voor '+data.tableLabel+' ontbreken Rompmeetwaarden van '+missing.join(', ')+'. Die lijn wordt niet getekend.';$('lklExerciseText').textContent='Ik vergelijk de beschikbare Rompen van '+data.rompChoices.filter(c=>c.part).map(c=>c.track).join(', ')+'. Van de getoonde Rompen past VIJF bij bal 3: bal 3 ligt op VIJF. Voor het gemak liggen bal 1 en bal 3 precies op hetzelfde Spoor VIJF; correcties komen later.';}}
    $('lklApproach').textContent='Twee ballen → Romp VIJF → Karkas VIJF → stootrichting Neus VIJF.';
    svg.replaceChildren();window.ThreeBUniformBalls.courseFrame(svg,g,data.table||'klein');el('rect',{x:0,y:0,width:g.widthCm,height:g.heightCm,fill:'#176548',stroke:'#f7df98','stroke-width':1.4});drawAllCourseDiamonds(g);$('lklDiamondCaption').hidden=index===0;
    if(index===1){for(const [i,{track,part}]of data.rompChoices.entries()){if(track==='VIJF'||!part)continue;const line=el('line',{'data-romp-choice':track,'data-source':'kruin',x1:part.from.x,y1:part.from.y,x2:part.to.x,y2:part.to.y,stroke:['#d9c1a0','#37d3b2','#b3c7e9','#d9b0db','#dfcf8e'][i],'stroke-width':1.5,opacity:.85});const at=lerp(part.from,part.to,.3);el('text',{'data-romp-label':track,x:at.x+2,y:at.y-4,'font-size':6.5},track);}}
    if(index>=1){drawKarkasDiamonds(body,g);drawKarkasDiamonds(body,g,data.route.romp.to);courseSegment(body);if(index===1){const chosen=svg.querySelector('line[data-part=romp]');chosen.dataset.rompChoice='VIJF';chosen.dataset.source='kruin';chosen.dataset.selected='true';chosen.setAttribute('stroke','#ffdc62');const at=lerp(body.from,body.to,.3);el('text',{'data-romp-label':'VIJF',x:at.x+2,y:at.y-4,'font-size':7.5,style:'fill:#ffdc62'},'VIJF');}$('lklDiamondCaption').textContent='VIJF · Romp · '+SpoorScreenFormat.format(data.route.romp.from.value)+' → '+SpoorScreenFormat.format(data.route.romp.to.value);}
    if(index>=2){courseSegment(nose);drawKarkasDiamonds(nose,g);}
    if(index===3){const target=SpoorGeometry.point(data.route.neus.to,g);el('line',{'data-part':'stootrichting',x1:nose.from.x,y1:nose.from.y,x2:target.x,y2:target.y,stroke:'#ffdc62','stroke-width':1.3,'stroke-dasharray':'3 2'});const q=lerp(nose.from,target,.45);el('text',{x:q.x+3,y:q.y-4,'font-size':7},'Neus · naar 50');}
    numberedBall(data.lessonTwoTarget||lerp(body.from,body.to,.55),3,'#f34d4d','lesson-target');numberedBall(nose.from,1,'white','lesson-ball');info.scrollTop=0;d.scrollTop=0;
  }

  function render(){if(lesson!==3){kzPointer=null;svg.style.touchAction='';svg.style.cursor='';svg.removeAttribute('tabindex');svg.onpointerdown=svg.onpointermove=svg.onpointerup=svg.onpointercancel=svg.onkeydown=null;}doubles.hidden=lesson!==3;viaTwo.hidden=lesson!==4;d.dataset.chapter=lesson===4?'2':'1';angleSketch.hidden=lesson!==3;$('lklCourseSimulationNote').textContent=lesson===2&&index===parallelTracks.length?'Je ziet dezelfde speelbal op vijf mogelijke aankomstplekken: vijf afzonderlijke afstoten.':lesson===3?'Je bekijkt de Romp, het Kruis en de uitloop over het Been van één afstoot.':'Dit is een weergave van het actieve Spoor, geen voorspelling van snelheid. Bal 3 staat alvast op de Romp; bal 2 en de volledige carambole komen later.';$('previousLklLesson').textContent=lesson===0?'← Les 1 · introductie':'← Vorige les';$('previousLklExercise').textContent=lesson===0&&index===0?'← Introductie':'← Vorige stap';document.getElementById('openParallelExamples')?.toggleAttribute('hidden',lesson!==2||index===parallelTracks.length);d.dataset.track=data.track;d.dataset.table=data.table||'klein';if(lesson!==3){delete d.dataset.caseIndex;delete d.dataset.onTrack;delete d.dataset.checked;}if(lesson!==2)delete d.dataset.view;parallelViews.hidden=lesson!==2;checkExercise.hidden=true;delete d.dataset.reverseStep;if(lesson===4){renderViaTwo();stepDemo();remember();return;}if(lesson===3){renderCross();stepDemo();remember();return;}if(lesson===1){renderBackwards();stepDemo();remember();return;}if(lesson===2){renderParallel();stepDemo();remember();return;}$('lklRoll').hidden=false;$('repeatLklLine').hidden=false;$('lklApproach').textContent='De bal volgt het spoor lijn na lijn.';$('nextLklExercise').textContent='Volgende stap →';stop();progress=0;const part=data.journey[index],g=data.geometry;d.dataset.lesson=String(lesson+2);d.dataset.line=part.key;d.dataset.source=data.source;d.dataset.pattern=data.pattern;d.dataset.endpoint=JSON.stringify(data.journey.at(-1));d.dataset.signature=JSON.stringify(data.route);$('lklLessonTitle').textContent=lessons[lesson].title;$('lklLessonProgress').textContent=`Stap ${index+1} van ${data.journey.length} · ${data.trackLabel} · ${data.pattern} · ${data.tableLabel||'Klein'}`;$('lklLessonSource').textContent='Kruins tafel · metingen van Kruin';$('lklExerciseTitle').textContent=`${index+1}. ${part.runOut&&part.key==='been'?'Half Been':names[part.key]}`;$('lklExerciseText').textContent=data.pattern==='6–7 banden'?(part.key==='neus'?'Dit is het afzonderlijke patroon 6–7 banden, met eigen meetwaarden. Ik volg de bal opnieuw vanaf de Neus.':part.key==='hiel'?'De 6–7-bander doorloopt de hele Hiel tot de volgende band. Daarna volgt de ingestelde extra uitloop.':part.key==='uitloop'?'Na de Hiel rolt de bal nog '+data.runOutCm+' cm door. Deze uitloop is instelbaar per basisspoor en tafel.':part.key==='romp'?'Na de Nek volgt de Romp. Bij 6–7 banden zijn Neus en Been de karkasankers.':part.key==='been'?'Na het Kruis volgt het Been. In dit afzonderlijke patroon is Been een Karkasanker; het vervolg loopt door over de Hiel.':explanations[part.key]):explanations[part.key];$('courseRunOutConfig').hidden=data.pattern!=='6–7 banden';$('courseRunOutCm').value=data.runOutCm;$('harderLkl').hidden=true;$('lklGeometryNotice').textContent=data.unavailable?'Het vervolg vanaf '+names[data.unavailable]+' is in deze configuratie niet geldig of nog niet bepaald. Ik teken daar geen verzonnen lijn.':'';$('previousLklExercise').disabled=index===0&&!systemIntro;$('nextLklExercise').disabled=index===data.journey.length-1;$('previousLklLesson').disabled=lesson===0&&!systemIntro;$('nextLklLesson').disabled=lesson===lessons.length-1;
    $('lklRouteSequence').replaceChildren();for(const key of order){const chip=document.createElement('button');chip.type='button';chip.textContent=names[key]+(key==='been'&&data.pattern==='LKL'?' (45%)':'');chip.dataset.line=key;const target=data.journey.findIndex(p=>p.key===key);chip.disabled=target<0;chip.setAttribute('aria-label','Toon '+names[key]);chip.onclick=()=>{if(target>=0){index=target;render();}};if(key===part.key)chip.setAttribute('aria-current','step');$('lklRouteSequence').append(chip);}
    svg.replaceChildren();window.ThreeBUniformBalls.courseFrame(svg,g,data.table||'klein');el('rect',{x:0,y:0,width:g.widthCm,height:g.heightCm,fill:'#176548',stroke:'#f7df98','stroke-width':1.4});
    $('lklDiamondCaption').hidden=true;drawAllCourseDiamonds(g);drawKarkasDiamonds(part,g);
    for(let n=0;n<=index;n++){const p=data.journey[n],current=n===index;const line=el('line',{x1:p.from.x,y1:p.from.y,x2:current?p.from.x:p.to.x,y2:current?p.from.y:p.to.y,stroke:colors[p.key],'stroke-width':current?3.5:2.5,opacity:current?1:.6});line.dataset.part=p.key;courseEndpointLabels(p);if(current)lineNode=line;const mid=lerp(p.from,p.to,.5);el('text',{x:mid.x+2,y:mid.y-4,'font-size':7.5},p.runOut&&p.key==='been'?'Been · 45%':names[p.key]);}
    const body=data.journey.find(p=>p.key==='romp');if(body){const target=lerp(body.from,body.to,.55);el('circle',{cx:target.x,cy:target.y,r:data.radiusCm,fill:'#f34d4d',stroke:'#222','stroke-width':.4,class:'lesson-target'});el('text',{x:target.x,y:target.y+1.5,'font-size':4.5,'text-anchor':'middle',class:'ball-number',style:'fill:#17271f;stroke:none'},'3');}
    ballNode=el('circle',{r:data.radiusCm,fill:'#fff',stroke:'#222','stroke-width':.5,class:'lesson-ball'});position(0);if(d.open){info.scrollTop=0;d.scrollTop=0;roll();}remember();
  }
  function setMode(mode){document.body.dataset.learningMode=mode;for(const [id,m]of [['levelLklCourse','course'],['levelLklPractice','practice']])document.getElementById(id)?.setAttribute('aria-pressed',String(m===mode));document.getElementById('lklUseStatus').textContent=mode==='course'?'Cursus · de bal lijn na lijn volgen.':'Geoefend · zelfstandig oefenen en meten.';}
  let startedCourse=false,practiceActive=false,checked=false,checkpointReady=false,parallelView='whole',bridgeVisible=false,restoreTable=false;
  const checkpointKey='3b-vijf-course-progress-v2';
  const bridge=document.createElement('nav');bridge.id='courseBridge';bridge.hidden=true;bridge.setAttribute('aria-label','Cursus en tafel');bridge.innerHTML='<button type="button" id="returnToVijfLesson">← Terug naar mijn les</button><button type="button" id="checkVijfOnTable" hidden>Toon Karkas</button><button type="button" id="cycleVijfView" hidden>View: spoor</button>';document.body.append(bridge);
  function remember(view){stepNavigation();if(!checkpointReady||!startedCourse)return;try{localStorage.setItem(checkpointKey,JSON.stringify({lesson,index,track:courseTrack(),overview:lesson===2&&index===parallelTracks.length,checked,parallelView,fraction:progress,view:view||(practiceActive?'table':'lesson')}));}catch(_){} }
  function setBridge(){bridge.hidden=!startedCourse||!bridgeVisible||d.open;bridge.setAttribute('aria-label','Kruins tafel · cursus');document.getElementById('returnToVijfLesson').textContent=lesson===4?'← Kruins tafel · H2 · Via bal 2':'← Kruins tafel · les '+(lesson+2)+' · stap '+(index+1);const check=document.getElementById('checkVijfOnTable');check.hidden=true;document.getElementById('cycleVijfView').hidden=!practiceActive||lesson!==2||index===parallelTracks.length;document.getElementById('cycleVijfView').textContent='View: '+({whole:'Spoor',framework:'Karkas',arrivals:'Aankomst'}[parallelView]);check.textContent=checked?'Volgende oefening →':'Toon Karkas';}
  function restoreCanvas(){svg.classList.remove('table-svg','course-linked-svg');svg.removeAttribute('style');delete svg.dataset.viewTable;delete svg.dataset.desktopAngle;for(const text of svg.querySelectorAll('text')){text.style.removeProperty('transform');text.style.removeProperty('transform-box');text.style.removeProperty('transform-origin');}stage.prepend(svg);}
  function fitLinked(){if(!practiceActive||d.open)return;adapter.fitCourseTable?.();const angle=Number(svg.dataset.desktopAngle)||0;for(const text of svg.querySelectorAll('text')){text.style.transformBox='fill-box';text.style.transformOrigin='center';text.style.transform=angle?'rotate('+(-angle)+'deg)':'';}window.ThreeBUniformBalls.apply(svg); }
  function dockCanvas(){if(!practiceActive||d.open)return;const card=document.querySelector('#svgMount .drawing-card');if(!card)return;const current=card.querySelector('.table-svg');svg.classList.add('table-svg','course-linked-svg');svg.dataset.viewTable=data.table||'klein';if(current!==svg){if(current)current.replaceWith(svg);else card.append(svg);}let marker=svg.querySelector('[data-config-neus-center]');if(!marker){marker=document.createElementNS(ns,'g');marker.setAttribute('data-config-neus-center','');svg.append(marker);}const n=data.journey.find(p=>p.key==='neus');if(n){marker.dataset.x=(n.from.x+n.to.x)/2;marker.dataset.y=(n.from.y+n.to.y)/2;}else marker.remove();document.body.classList.add('course-table-linked');fitLinked();setBridge();}
  function validSelection(){const s=adapter.courseSelection?.();return s?.track===courseTrack()&&s.table===(adapter.tableTextSettings?.().courseTable||'klein')&&s.mode===s.table&&s.direction==='west'&&s.pattern==='lkl';}
  function practice(){const fraction=progress;stop();chooser.close();if(d.open)d.close();startedCourse=true;bridgeVisible=true;practiceActive=false;restoreCanvas();adapter.enterCoursePractice?.(courseTrack());if(lesson===2)adapter.setCourseView?.(index===parallelTracks.length?'arrivals':parallelView);practiceActive=true;data=readLessonData();render();if(lesson===0){progress=fraction;position(progress);}dockCanvas();setMode('practice');setBridge();remember('table');window.dispatchEvent(new Event('threeb-table-return'));}
  function independent(){bridgeVisible=false;adapter.setCourseScope?.(false);stop();chooser.close();if(d.open)d.close();practiceActive=false;document.body.classList.remove('course-table-linked');restoreCanvas();adapter.enterPractice?.();setMode('practice');setBridge();remember('normal');window.dispatchEvent(new Event('threeb-table-return'));}
  function openLesson(number=0){if(document.getElementById('spoorScreen')?.open){alert('Sluit eerst het spoorscherm; je meetinvoer blijft behouden.');return;}try{practiceActive=false;lesson=number;adapter.setCourseScope?.(true,courseScopeTracks());document.body.classList.remove('course-table-linked');restoreCanvas();adapter.refreshCourseTable?.();stop();startedCourse=true;lesson=number;if(lesson===2)parallelView='whole';index=0;checked=false;data=readLessonData();render();if(!d.open)d.showModal();info.scrollTop=0;d.scrollTop=0;setMode('course');setBridge();remember('lesson');roll();}catch(e){alert('De les kan niet starten: '+e.message);}}
  window.openThreeBChapter2=()=>openLesson(4);
  function resumeLesson(){if(document.getElementById('spoorScreen')?.open){alert('Sluit eerst het spoorscherm; je meetinvoer blijft behouden.');return;}const oldProgress=progress;practiceActive=false;adapter.setCourseScope?.(true,courseScopeTracks());document.body.classList.remove('course-table-linked');restoreCanvas();adapter.refreshCourseTable?.();data=readLessonData();render();if(!d.open)d.showModal();if(lesson===0){progress=oldProgress;position(progress);roll();}setMode('course');setBridge();remember('lesson');}
  function launchCourse(){chooser.close();document.getElementById('closeExplanation')?.click();if(startedCourse)resumeLesson();else openLesson(0);}
  const systemIntro=window.ThreeBMeetsysteemIntro?.create({geometry:()=>adapter.courseIntroGeometry(),route:()=>adapter.lesson1Data('VIJF'),onContinue:({parallel=false}={})=>{if(parallel)launchCourse();else{chooser.close();document.getElementById('closeExplanation')?.click();openLesson(0);}},onClose:independent});
  function startCourse(){if(document.getElementById('spoorScreen')?.open){alert('Sluit eerst het spoorscherm; je meetinvoer blijft behouden.');return;}chooser.close();stop();setMode('course');if(systemIntro)systemIntro.open();else launchCourse();}
  const parallelExamples=document.createElement('button');parallelExamples.id='openParallelExamples';parallelExamples.type='button';parallelExamples.textContent='Voorbeelden · VIJF−2 t/m VIJF+3';parallelExamples.hidden=true;parallelExamples.onclick=()=>{stop();if(d.open)d.close();systemIntro?.open({parallel:true});};$('lklExerciseText').after(parallelExamples);
  function previousIntroduction(){stop();if(d.open)d.close();systemIntro?.open({at:3});}
  document.getElementById('returnToVijfLesson').onclick=resumeLesson;
  document.getElementById('checkVijfOnTable').onclick=()=>{if(checked){index=(index+1)%6;checked=false;}else checked=true;render();dockCanvas();remember('table');};
  document.getElementById('cycleVijfView').onclick=()=>{parallelView=['whole','framework','arrivals'][(['whole','framework','arrivals'].indexOf(parallelView)+1)%3];adapter.setCourseView?.(parallelView);};
  window.addEventListener('threeb-spoor-state',()=>{if(!practiceActive||d.open)return;if(!validSelection()){practiceActive=false;document.body.classList.remove('course-table-linked');restoreCanvas();setBridge();remember('normal');return;}if(lesson===2&&index<parallelTracks.length){const s=adapter.courseSelection();parallelView=s.display==='arrivals'?'arrivals':s.framework?'framework':'whole';}try{const fraction=progress;data=readLessonData();render();if(lesson===0){progress=fraction;position(progress);}dockCanvas();}catch(_){practiceActive=false;restoreCanvas();setBridge();}});
  window.addEventListener('resize',()=>requestAnimationFrame(fitLinked));
  $('saveCourseRunOut').onclick=()=>{};
  $('closeLklLesson').onclick=independent;d.addEventListener('cancel',e=>{e.preventDefault();independent();});d.addEventListener('close',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){stop();$('lklRoll').textContent='Verder rollen';}});
  function stepNavigation(){
    if(data){tableToggle.textContent=(data.table==='groot'?'Groot':'Klein')+' ⇄';tableToggle.setAttribute('aria-label','Tafel '+(data.table==='groot'?'Groot':'Klein')+'; wissel naar '+(data.table==='groot'?'Klein':'Groot'));$('lklLessonProgress').textContent=$('lklLessonProgress').textContent.replace(/ · (Klein|Groot)$/,'');const overview=lesson===2&&index===parallelTracks.length;$('lklDiamondCaption').style.fontSize=overview?'19px':'';window.ThreeBUniformBalls.trackBadge(svg,data.geometry,overview||lesson===3?null:data.trackLabel);if(overview){$('lklDiamondCaption').hidden=false;$('lklDiamondCaption').textContent='VIJF-reeks';}requestAnimationFrame(()=>window.ThreeBUniformBalls.apply(svg));}
    $('previousLklExercise').textContent='← Vorige';$('nextLklExercise').textContent=lesson===3?(index===crossTracks.length-1?'Volgend hoofdstuk · H2 Via bal 2 →':'Volgende startpositie →'):'Volgende →';$('nextLklExercise').classList.toggle('next-chapter',lesson===3&&(index===crossTracks.length-1||index%3===2));
    $('previousLklExercise').disabled=false;
    $('nextLklExercise').disabled=lesson===lessons.length-1&&index===totalSteps()-1;
  }
  const totalSteps=()=>lesson===4?1:lesson===2?parallelTracks.length+1:lesson===3?crossTracks.length:lesson===1?4:data.journey.length;
  $('previousLklExercise').onclick=()=>{if(index>0){index--;checked=false;render();}else if(lesson===0)previousIntroduction();else{openLesson(lesson-1);index=totalSteps()-1;render();}};$('nextLklExercise').onclick=()=>{if(index<totalSteps()-1){index++;checked=false;render();}else if(lesson<lessons.length-1)openLesson(lesson+1);};$('previousLklLesson').onclick=()=>{if(lesson>0)openLesson(lesson-1);else previousIntroduction();};$('nextLklLesson').onclick=()=>{if(lesson<lessons.length-1)openLesson(lesson+1);};$('repeatLklLesson').onclick=()=>openLesson(lesson);$('repeatLklLine').onclick=()=>{if(lesson===0){progress=0;roll();}else stepDemo();};$('lklRoll').onclick=()=>{if(running){stop();$('lklRoll').textContent='Verder rollen';$('lklAnimationStatus').textContent='Pauze · ik bekijk de '+names[data.journey[index].key]+'.';}else roll();};$('lessonToIndependent').onclick=practice;$('harderLkl').onclick=()=>{};
  const button=document.createElement('button');button.type='button';button.id='startLklLesson1';button.textContent='Cursus · LKL lijn na lijn';button.onclick=startCourse;actions.prepend(button);
  const chooser=document.createElement('dialog');chooser.id='lklUseChoice';chooser.innerHTML=`<header><h2>De Waaier · cursus of geoefend</h2><button type="button" id="closeLklUseChoice">Sluiten</button></header><button type="button" id="chooseLklCourse"><strong>Cursus · stap voor stap</strong><span>De Waaier: ik begin bij benedenacquit 0 en zie de Waaier 0 t/m 8. Daaruit kies ik VIJF en volg dat spoor lijn voor lijn.</span></button><button type="button" id="chooseLklPractice"><strong>Geoefend · zelfstandig</strong><span>Ik oefen en meet zelf aan tafel.</span></button><details><summary>Naslag en meetlessen</summary><button type="button" id="openLklReferences">Open naslag en meetlessen</button></details>`;document.body.append(chooser);
  const menu=document.querySelector('.onscreen-control-menuPanel .central-track-controls')||document.querySelector('.central-track-controls');const modes=document.createElement('section');modes.id='lklUseModes';modes.innerHTML='<button type="button" id="menuLklCourse">Cursus · stap voor stap</button><button type="button" id="menuLklPractice">Geoefend · zelfstandig</button><p id="lklUseStatus"></p>';menu?.append(modes);
  const level=document.createElement('nav');level.id='lklLevelBar';level.setAttribute('aria-label','Niveau');level.innerHTML='<strong>Niveau · LKL</strong><button type="button" id="levelLklCourse">Cursus · stap voor stap</button><button type="button" id="levelLklPractice">Geoefend · zelfstandig</button>';document.body.append(level);
  const namesDialog=document.createElement('dialog');namesDialog.id='tableNamesDialog';namesDialog.setAttribute('aria-labelledby','tableNamesTitle');
  namesDialog.innerHTML='<header><h2 id="tableNamesTitle">Namen en lesindeling</h2><button type="button" id="closeTableNames" aria-label="Namen sluiten">×</button></header><p>Naslag bij de cursus <strong>De Waaier — Van Top tot Teen</strong>.</p><dl><dt>Waaier</dt><dd>Eerste lijnen vanuit hetzelfde benedenacquit 0 naar de lange band: de eerste L van LKL. De richting verandert.</dd><dt>Patroon</dt><dd>De volgorde van de geraakte banden. LKL betekent lang–kort–lang.</dd><dt>Spoor</dt><dd>Het bij elkaar horende lijnverloop binnen een patroon. VIJF is een spoor binnen LKL.</dd><dt>Karkas</dt><dd>De herkenbare Neus en Romp van hetzelfde spoor. Kop en Nek verbinden ze.</dd><dt>Neus</dt><dd>De eerste lijn, vanaf de afstoot naar de eerste band.</dd><dt>Kop</dt><dd>De lijn na de Neus: bij LKL naar de korte noordband.</dd><dt>Nek</dt><dd>De verbinding van de Kop naar de lange oostband.</dd><dt>Romp</dt><dd>De lijn vanaf de oostband richting de zuidzijde.</dd><dt>Kruis</dt><dd>De lijn na de Romp.</dd><dt>Been</dt><dd>De lijn na het Kruis. In deze LKL-weergave loopt de bal uit tot 45% van Been.</dd></dl><h3>De lessen</h3><ol><li>De Waaier, VIJF, Neus en Romp.</li><li>VIJF lijn na lijn: Neus → Kop → Nek → Romp → Kruis → Been.</li><li>Twee ballen → Romp VIJF → Karkas VIJF → stootrichting Neus.</li><li>VIJF−2, VIJF−1, VIJF en de positieve parallellen; aankomsten op Zuid.</li><li>kruis 0.1: verplaats B3 en bekijk passende Rompen en Kruisen.</li></ol><p>De cursus toont Kruins tafel en metingen. Eigen tafels en eigen metingen volgen later.</p>';
  document.body.append(namesDialog);namesDialog.querySelector('#closeTableNames').onclick=()=>namesDialog.close();
  const systemDialog=document.createElement('dialog');systemDialog.id='systemGuideDialog';systemDialog.setAttribute('aria-labelledby','systemGuideTitle');systemDialog.innerHTML='<header><h2 id="systemGuideTitle">Meetsysteem</h2><button type="button" id="closeSystemGuide" aria-label="Meetsysteem sluiten">×</button></header><section class="system-guide-content">'+(window.THREEB_SYSTEM_GUIDE_HTML||'').replace(/^<h1>.*?<\/h1>\s*/,'')+'</section>';document.body.append(systemDialog);systemDialog.querySelector('#closeSystemGuide').onclick=()=>systemDialog.close();
  window.openThreeBMeetsysteem=()=>{if(systemDialog.open)return;stop();systemIntro?.pause();if(d.open&&lesson===0)$('lklRoll').textContent='Verder rollen';document.getElementById('cleanConfigDialog')?.close();systemDialog.showModal();systemDialog.scrollTop=0;};
  const systemButton=document.createElement('button');systemButton.id='lklSystemGuide';systemButton.type='button';systemButton.textContent='Meetsysteem';systemButton.onclick=window.openThreeBMeetsysteem;progressRow.after(systemButton);

  const namesButton=document.createElement('button');namesButton.id='lklOutlineToggle';namesButton.type='button';namesButton.textContent='Namen';namesButton.title='Namen en lesindeling';namesButton.setAttribute('aria-label','Namen en lesindeling');namesButton.onclick=()=>{document.getElementById('cleanConfigDialog')?.close();if(!namesDialog.open)namesDialog.showModal();namesDialog.scrollTop=0;};document.getElementById('levelLklCourse').after(namesButton);
  const namesStyle=document.createElement('style');namesStyle.textContent='#tableNamesDialog{box-sizing:border-box;width:min(600px,calc(100vw - 20px));max-height:calc(100dvh - 20px);padding:16px;border:2px solid #176f4f;border-radius:10px;background:#faf8ef;color:#173b30;font:16px/1.5 system-ui;overflow:auto}#tableNamesDialog::backdrop{background:#0006}#tableNamesDialog header{position:sticky;top:-16px;z-index:1;background:#faf8ef;display:flex;align-items:center;justify-content:space-between;gap:12px}#tableNamesDialog h2{font-size:21px;margin:0}#tableNamesDialog button{min-width:44px;min-height:44px;border:1px solid #78988b;border-radius:6px;background:white;color:#173b30;font:inherit}#tableNamesDialog dt{font-weight:750;margin-top:10px}#tableNamesDialog dd{margin:0 0 8px}';namesStyle.textContent=namesStyle.textContent.replaceAll('#tableNamesDialog',':is(#tableNamesDialog,#systemGuideDialog)')+'#lklLesson1 #lklSystemGuide{display:inline-flex;align-items:center;min-height:44px;margin:0;padding:0 2px;border:0;background:transparent;color:#176f4f;font-size:15px;text-decoration:underline}';document.head.append(namesStyle);

  for(const id of ['chooseLklCourse','menuLklCourse','levelLklCourse'])document.getElementById(id).onclick=startCourse;for(const id of ['chooseLklPractice','menuLklPractice','levelLklPractice'])document.getElementById(id).onclick=independent;
  const legacy=document.getElementById('openExplanation');legacy?.addEventListener('click',e=>{if(reference)return;e.preventDefault();e.stopImmediatePropagation();if(!chooser.open)chooser.showModal();},true);chooser.querySelector('#closeLklUseChoice').onclick=()=>chooser.close();chooser.querySelector('#openLklReferences').onclick=()=>{chooser.close();adapter.prepareCourseReference?.();reference=true;try{legacy.click();}finally{reference=false;}};
  const directTable=!!window.THREEB_PHONE_VIEW_APPLIED||new URLSearchParams(location.search).get('entry')==='table';
  try{const saved=JSON.parse(localStorage.getItem(checkpointKey));if(saved&&Number.isInteger(saved.lesson)&&saved.lesson>=0&&saved.lesson<lessons.length&&Number.isInteger(saved.index)&&saved.index>=0&&saved.index<Math.max(crossTracks.length,parallelTracks.length+1)){lesson=saved.lesson;index=lesson===1?Math.min(3,saved.index):lesson===2?(saved.track?saved.overview?parallelTracks.length:Math.max(0,parallelTracks.indexOf(saved.track)):saved.index===4?parallelTracks.length:parallelTracks.indexOf(['VIJF-1','VIJF+1','VIJF+2','VIJF+3'][saved.index]||'VIJF')):lesson===3?Math.min(crossTracks.length-1,saved.index):Math.min(order.length-1,saved.index);parallelView=['whole','framework','arrivals'].includes(saved.parallelView)?saved.parallelView:'whole';checked=Boolean(saved.checked);startedCourse=true;progress=Number.isFinite(saved.fraction)?Math.max(0,Math.min(1,saved.fraction)):0;if(window.THREEB_PHONE_VIEW_APPLIED){saved.view='normal';localStorage.setItem(checkpointKey,JSON.stringify(saved));}restoreTable=saved.view==='table';bridgeVisible=restoreTable;}}catch(_){}checkpointReady=true;delete window.THREEB_PHONE_VIEW_APPLIED;setBridge();
  setMode('practice');delete window.THREEB_CHOOSE_USAGE_ON_START;
  const directH1=new URLSearchParams(location.search).get('h1')==='romp-kruis';
  if(directH1){requestAnimationFrame(()=>{for(const dialog of [chooser,systemIntro?.dialog])dialog?.close?.();document.getElementById('meetsysteemIntro')?.close();openLesson(3);document.title=(window.THREEB_TEST_ENVIRONMENT?'TEST · ':'')+'kruis 0.1 · 3B';const wanted=new URLSearchParams(location.search).get('kruis')?.toUpperCase(),at=kzDefinitions.findIndex(d=>d.kruis===wanted);if(at>=0){index=at;data=readLessonData();render();}});}
  if(!directH1&&adapter.inputOwner?.()!=='kruin'&&!directTable){restoreTable=false;bridgeVisible=false;setBridge();startCourse();}
  if(!directH1&&restoreTable)requestAnimationFrame(()=>{adapter.setCourseScope?.(true,courseScopeTracks());if(validSelection()){try{const fraction=progress;practiceActive=true;data=readLessonData();render();if(lesson===0){progress=fraction;position(progress);}dockCanvas();setBridge();}catch(_){practiceActive=false;setBridge();}}});
};

/* One entry point; reuse existing controls and their listeners. */
window.installThreeBCleanConfig=function(){
  if(document.getElementById('cleanConfigDialog'))return;
  const get=id=>document.getElementById(id),gear=get('bandMenu');if(!gear)return;
  const touch=navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches;document.body.classList.toggle('touch-track-choices',touch);
  const style=document.createElement('style');style.textContent=`
  body.table-only.clean-config.mobile-full-table .drawing{position:fixed!important;inset:auto!important;left:var(--mobile-table-left,0px)!important;top:var(--mobile-table-top,0px)!important;width:var(--mobile-table-width,100vw)!important;height:var(--mobile-table-height,100dvh)!important;min-width:0!important;min-height:0!important}body.clean-config.mobile-full-table #cleanConfigDialog{max-width:calc(var(--mobile-table-width,100vw) - 16px)!important;max-height:calc(var(--mobile-table-height,100dvh) - 16px)!important}body.clean-config.mobile-full-table #onscreenLayout{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important}
  body.touch-track-choices #cleanConfigTracks{display:none!important}
  body.clean-config .band-side{transform:translate(-50%,-50%)!important;height:auto!important;min-height:36px;padding:6px 9px!important}body.clean-config #bandDock,body.clean-config #desktopWorkbench,body.clean-config #databaseMobileToggle{display:none!important}
  body.clean-config #onscreenLayout{padding-top:0!important}
  body.clean-config.test-desktop-workbench .drawing{inset:var(--threeb-test-banner-height,0px) 0 0!important}
  body.clean-config #bandMenu{position:fixed!important;left:var(--config-x,50%)!important;top:var(--config-y,50%)!important;transform:translate(-50%,-50%)!important;width:90px!important;height:44px!important;z-index:2300;font-size:16px;border-radius:22px;cursor:grab;touch-action:none;user-select:none;display:flex;align-items:center;justify-content:center;gap:5px}
  #cleanConfigDialog{position:fixed;inset:0;margin:auto;box-sizing:border-box;width:min(224px,calc(100vw - 16px));height:fit-content;max-height:calc(100dvh - 16px);padding:6px;z-index:2400;box-shadow:0 3px 12px #0003;border:1px solid #b9b7a7;border-radius:14px;background:#faf9f2;color:#19392e;overflow:auto}
  #cleanConfigDialog:has(#cleanConfigMore[open]){width:min(440px,calc(100vw - 24px))}
  #cleanConfigDialog::backdrop{background:#132c2366}
  #cleanConfigDialog header{cursor:grab;touch-action:none;user-select:none;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  #cleanConfigDialog h2,#cleanConfigDialog h3{margin:0;font-size:18px}
  #cleanConfigDialog #cleanConfigCourse>h3{display:none}
  #cleanConfigDialog #cleanConfigTracks{display:grid;gap:6px;margin-bottom:8px}
  #cleanConfigDialog #bandTrack,#cleanConfigDialog #bandLine{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px;background:#80582f;border-radius:8px;color:#fff4dd;min-width:0}
  #cleanConfigDialog #bandTrack small,#cleanConfigDialog #bandLine small{font:600 14px system-ui}
  #cleanConfigDialog #bandTrack>span,#cleanConfigDialog #bandLine>span{display:flex;align-items:center;gap:4px;min-width:0}
  #cleanConfigDialog #bandTrack output,#cleanConfigDialog #bandLine output{font:700 16px system-ui;text-align:center;min-width:68px}
  #cleanConfigDialog #bandTrack button,#cleanConfigDialog #bandLine button{width:36px;margin:0;padding:4px;background:#fff7e9;color:#442a13;border:1px solid #c6ab82;border-radius:6px}
  #cleanConfigDialog #levelLklCourse{margin:0;width:100%}
  #cleanConfigDialog #cleanConfigMore>summary{font-size:14px;padding:8px 0;min-height:28px}
  #cleanConfigDialog button,#cleanConfigDialog select{min-height:44px;cursor:pointer}
  #cleanConfigDialog #bandCore{position:static!important;inset:auto!important;transform:none!important;width:100%!important;max-width:none!important;box-sizing:border-box;display:grid!important;grid-template-columns:1fr!important;overflow:visible;gap:8px;margin:0 0 18px}
  #cleanConfigDialog .band-drag-handle,#cleanConfigDialog #bandCore:before,#cleanConfigDialog #bandCore:after{display:none!important}
  #cleanConfigDialog #bandCore .band-step{width:auto!important;min-width:0!important;display:flex!important;justify-content:space-between;align-items:center;padding:0 8px}
  #cleanConfigDialog #bandCore .band-step>span{display:flex;align-items:center;gap:8px}
  #cleanConfigDialog #bandCore select{max-width:240px;min-width:0;width:auto}
  #cleanConfigDialog .central-track-controls>.central-line-select:not(#parallelDisplayControl),#cleanConfigDialog #centralPatternControl,#cleanConfigDialog #centralParallelControl{display:none!important}
  #cleanConfigDialog #lklLevelBar{position:static!important;inset:auto!important;transform:none!important;display:flex!important;flex-wrap:wrap;gap:8px;width:auto!important;min-height:0!important;margin:0;padding:0;background:none;box-shadow:none;border:0}
  #cleanConfigDialog #lklLevelBar strong{display:none}
  #cleanConfigDialog #lklLevelBar button{flex:1}
  #cleanConfigDialog #lklUseStatus{margin:8px 0 16px}
  #cleanConfigDialog #cleanConfigMore>summary{padding:12px 0;font-weight:bold;cursor:pointer}
  #cleanConfigDialog .central-track-controls{position:static!important;inset:auto!important;transform:none!important;width:auto!important;max-height:none!important;display:block!important;pointer-events:auto}
  #cleanConfigDialog .central-track-controls>#lklUseModes,#cleanConfigDialog .selection-menu-header,#cleanConfigDialog #centralTrackControl,#cleanConfigDialog #centralTableControl,#cleanConfigDialog #parallelPartControl{display:none!important}
  #cleanConfigDialog #databaseWorkspace{display:block!important;transform:none!important;position:static!important;width:auto!important;max-height:none!important;box-sizing:border-box;overflow:visible}
  #cleanConfigDialog #menuSettings{margin:8px 0}
  #cleanConfigDialog #bandUndo,#cleanConfigDialog #bandReset,#cleanConfigDialog #bandSave,#cleanConfigDialog #thumbUp{position:static!important;inset:auto!important;transform:none!important;margin:4px}
  #cleanConfigDialog[open]:not(:has(#cleanConfigMore[open])){display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4px 6px}
  #cleanConfigDialog>header{grid-column:1/-1;margin:0;min-height:28px;gap:4px}
  #cleanConfigDialog>header h2{font-size:12px}
  #cleanConfigDialog>header h2::before{content:'⋮⋮';margin-right:5px;font-size:15px}
  #cleanConfigDialog #closeCleanConfig{min-height:28px;height:28px;width:28px;padding:0;margin:0}
  #cleanConfigDialog #cleanConfigTracks{grid-column:1/-1;margin:0}
  #cleanConfigDialog #cleanConfigTracks #bandTrack{padding:0 3px;gap:0}
  #cleanConfigDialog #cleanConfigTracks #bandTrack small{display:none}
  #cleanConfigDialog #cleanConfigTracks #bandTrack>span{display:grid;grid-template-columns:44px minmax(0,1fr) 44px;gap:2px;width:100%}
  #cleanConfigDialog #cleanConfigTracks #bandTrack output{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #cleanConfigDialog #cleanConfigTracks #bandTrack button{width:44px}
  #cleanConfigDialog #cleanConfigCourse{grid-column:1;margin:0}
  #cleanConfigDialog #levelLklCourse{font-size:14px}
  #cleanConfigDialog #cleanConfigMore{grid-column:2;margin:0}
  #cleanConfigDialog #cleanConfigMore>summary{box-sizing:border-box;display:flex;align-items:center;justify-content:center;list-style:none;padding:0!important;min-height:44px;border:1px solid #78988b;border-radius:6px;font:600 13px system-ui;background:white}
  #cleanConfigDialog #cleanConfigMore>summary::-webkit-details-marker{display:none}
  #cleanConfigDialog:has(#cleanConfigMore[open]){padding:12px}
  #cleanConfigDialog:has(#cleanConfigMore[open])>header{margin-bottom:8px}
  #cleanConfigDialog:has(#cleanConfigMore[open]) #cleanConfigTracks{margin-bottom:8px}
  #cleanConfigDialog:has(#cleanConfigMore[open]) #cleanConfigMore>summary{margin:8px 0}
  @media(pointer:coarse){#cleanConfigDialog>header{min-height:44px}#cleanConfigDialog #closeCleanConfig{min-height:44px;height:44px;width:44px}}
  body.clean-config #bandMenu{width:44px!important;font-size:22px;border-radius:50%}
  #cleanConfigDialog[open]:not(:has(#cleanConfigMore[open])){display:flex;align-items:center;gap:2px;flex-wrap:nowrap;width:max-content;max-width:calc(100vw - 16px);padding:0;border:0;background:transparent;box-shadow:none;overflow:visible}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open]))>header{display:contents}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigTitle{order:0;flex:none;margin:0;padding:0 2px;font:16px/28px system-ui;color:white;text-shadow:0 1px 3px #111;cursor:grab}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigTitle::before{content:none}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #closeCleanConfig{order:4;flex:none;width:24px;height:28px;min-height:28px;border:0;background:#173b30d9;color:white;font-size:18px;border-radius:4px}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigTracks{order:1;flex:none;margin:0}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #bandTrack{padding:0;background:#173b30d9;border-radius:4px}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #bandTrack>span{grid-template-columns:28px 72px 28px;gap:0;width:128px}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #bandTrack button{min-height:28px;height:28px;width:28px;font-size:17px;color:white;background:transparent;border:0}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #bandTrack output{font-size:13px;color:white}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigCourse{order:2;flex:none;width:54px;margin:0}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #levelLklCourse{min-width:0;min-height:28px;height:28px;padding:0 4px;margin:0;font-size:12px;line-height:1.1;color:white;background:#173b30d9;border:0;border-radius:4px}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigMore{order:3;flex:none;width:28px;margin:0}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigMore>summary{min-height:28px;height:28px;padding:0!important;font-size:0;color:white;background:#173b30d9;border:0;border-radius:4px}
  #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigMore>summary::after{content:'⚙';font-size:18px}
  #cleanConfigDialog:has(#cleanConfigMore[open]){background:#faf9f2;border:1px solid #b9b7a7;box-shadow:0 3px 12px #0003}
  @media(pointer:coarse){
    #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigTitle{line-height:44px}
    #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #bandTrack>span{grid-template-columns:32px 70px 32px;width:134px}
    #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #bandTrack button{width:32px;min-height:44px;height:44px}
    #cleanConfigDialog:not(:has(#cleanConfigMore[open])) #levelLklCourse,#cleanConfigDialog:not(:has(#cleanConfigMore[open])) #cleanConfigMore>summary,#cleanConfigDialog:not(:has(#cleanConfigMore[open])) #closeCleanConfig{min-height:44px;height:44px}
  }
  `;document.head.append(style);
  const dialog=document.createElement('dialog');dialog.id='cleanConfigDialog';dialog.setAttribute('aria-label','Spoor en cursus');dialog.innerHTML='<header><h2 id="cleanConfigTitle" aria-label="Bediening verslepen">⠿</h2><button type="button" id="closeCleanConfig" aria-label="Menu sluiten">×</button></header><section id="cleanConfigTracks" aria-label="Spoor"></section><section id="cleanConfigCourse" aria-label="Cursus"><h3>Cursus</h3></section><details id="cleanConfigMore"><summary>⚙ Config</summary><div id="cleanConfigSettings"></div></details>';document.body.append(dialog);document.body.classList.add('clean-config');
  gear.textContent='☰';gear.setAttribute('aria-label','Spoor en cursus openen');gear.title='Spoor en cursus · klik om te openen, versleep naar een vrije plek';document.body.append(gear);
  const move=(node,parent)=>{if(node&&node.parentElement!==parent)parent.append(node);};
  function reconcile(){if(touch)get('centralLineSelect')?.closest('.central-track-stepper')?.style.setProperty('display','flex','important');move(get('bandTrack'),get('cleanConfigTracks'));move(get('bandLine'),get('bandCore'));move(get('lklLevelBar'),get('cleanConfigCourse'));get('levelLklCourse').textContent='Cursus';
    const settings=get('cleanConfigSettings');move(get('bandCore'),settings);move(get('levelLklPractice'),settings);move(get('lklUseStatus'),settings);move(document.querySelector('.central-track-controls'),settings);
    const db=get('databaseWorkspace');if(db&&!db.closest('#githubConnectionDialog'))move(db,settings);
    for(const id of ['mobilePreview','bandUndo','bandReset','bandSave','thumbUp'])move(get(id),settings);
    document.body.append(gear);position();
  }
  const gearKey='3b-clean-config-free-position-v1',dialogKey='3b-clean-config-dialog-position-v1';let gearDrag=false,windowDrag=false,suppressGearClick=false,lastPattern=null;
  const read=key=>{try{const p=JSON.parse(localStorage.getItem(key));return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?p:null;}catch(_){return null;}};
  const write=(key,p)=>{try{localStorage.setItem(key,JSON.stringify(p));}catch(_){}};
  const erase=key=>{try{localStorage.removeItem(key);}catch(_){}};
  try{if(localStorage.getItem('3b-clean-config-neus-default-v1')!=='1'){localStorage.setItem('3b-clean-config-position-v1','central');erase(gearKey);localStorage.setItem('3b-clean-config-neus-default-v1','1');}}catch(_){}
  try{if(localStorage.getItem('3b-clean-strip-layout-v1')!=='1'){erase(dialogKey);localStorage.setItem('3b-clean-strip-layout-v1','1');}}catch(_){}
  try{if(localStorage.getItem('3b-menu-table-center-v1')!=='1'){erase(gearKey);erase(dialogKey);localStorage.setItem('3b-clean-config-position-v1','central');localStorage.setItem('3b-menu-table-center-v1','1');}}catch(_){}
  try{if(localStorage.getItem('3b-menu-upper-inside-v1')!=='1'){erase(gearKey);localStorage.setItem('3b-clean-config-position-v1','central');localStorage.setItem('3b-menu-upper-inside-v1','1');}}catch(_){}
  const clamp=(v,min,max)=>Math.max(min,Math.min(Math.max(min,max),v));
  const visibleScreen=()=>{const v=window.visualViewport,left=v?.offsetLeft||0,top=v?.offsetTop||0,width=v?.width||innerWidth,height=v?.height||innerHeight;return {left,top,width,height,right:left+width,bottom:top+height};};
  function placeGear(x,y){const r=gear.getBoundingClientRect(),v=visibleScreen();document.body.style.setProperty('--config-x',clamp(x,v.left+r.width/2+8,v.right-r.width/2-8)+'px');document.body.style.setProperty('--config-y',clamp(y,v.top+r.height/2+8,v.bottom-r.height/2-8)+'px');}
  const select=get('menuButtonPositionSelect');if(select){select.closest('label').querySelector('span').textContent='Menuknop';select.querySelector('option[value=central]').textContent='Midden op tafel';const custom=new Option('Eigen plek · versleep','free');custom.disabled=true;select.add(custom);}
  function position(){if(gearDrag)return;const pattern=get('bandPatternSelect')?.value;
    if(lastPattern&&lastPattern!==pattern){erase(gearKey);try{localStorage.setItem('3b-clean-config-position-v1','central');}catch(_){}}lastPattern=pattern;
    const svg=document.querySelector('.table-svg[data-view-table="'+get('editTable')?.value+'"]')||document.querySelector('.table-svg');if(!svg)return;
    const b=svg.getBoundingClientRect(),matrix=svg.getScreenCTM(),mirrored=get('noseDirection')?.value==='oost',table=window.THREEB_START_CONFIG?.tables?.[get('editTable')?.value]||{widthCm:105,heightCm:210};const course=svg.id==='lklLessonTable';let anchor=matrix?new DOMPoint(course?table.widthCm/2:280,course?table.heightCm/2:90+170*table.heightCm/table.widthCm).matrixTransform(matrix):null;
    let saved=read(gearKey);if(saved?.pattern&&saved.pattern!==pattern){erase(gearKey);saved=null;}let corner=false;try{corner=localStorage.getItem('3b-clean-config-position-v1')==='corner';}catch(_){}
    const stored=saved&&Number.isFinite(saved.tableX)&&matrix?new DOMPoint(mirrored?560-saved.tableX:saved.tableX,saved.tableY).matrixTransform(matrix):null;placeGear(saved?stored?.x??saved.x*innerWidth:corner?b.right-53:anchor?.x??b.left+b.width/2,saved?stored?.y??saved.y*innerHeight:corner?b.top+30:anchor?.y??b.top+b.height/2);if(select)select.value=saved?'free':corner?'corner':'central';fitDialog();
  }
  function placeDialog(left,top){const r=dialog.getBoundingClientRect(),v=visibleScreen();Object.assign(dialog.style,{left:clamp(left,v.left+8,v.right-r.width-8)+'px',top:clamp(top,v.top+8,v.bottom-r.height-8)+'px',right:'auto',bottom:'auto',margin:'0'});}
  function fitDialog(){if(!dialog.open||windowDrag)return;const saved=read(dialogKey);if(saved){placeDialog(saved.x*innerWidth,saved.y*innerHeight);return;}const r=dialog.getBoundingClientRect(),v=visibleScreen();if(get('cleanConfigMore').open){placeDialog(v.left+(v.width-r.width)/2,v.top+(v.height-r.height)/2);return;}
    const svg=document.querySelector('.table-svg[data-view-table="'+get('editTable')?.value+'"]')||document.querySelector('.table-svg'),matrix=svg?.getScreenCTM();
    if(!matrix){placeDialog((innerWidth-r.width)/2,(innerHeight-r.height)/2);return;}
    // Choose an empty patch near the centre; line/ball rectangles are deliberately
    // avoided using SVG hit testing, not their misleading diagonal bounding boxes.
    let best=null;const blockers=svg.querySelectorAll('.route-line,circle');
    for(const [x,y] of [[280,375],[280,485],[280,430],[200,430],[360,430],[200,345],[360,345],[200,515],[360,515],[280,260],[280,600]]){
      const p=new DOMPoint(x,y).matrixTransform(matrix),left=clamp(p.x-r.width/2,v.left+8,v.right-r.width-8),top=clamp(p.y-r.height/2,v.top+8,v.bottom-r.height-8);let hits=0;
      for(const node of blockers){const box=node.getBoundingClientRect();if(box.right<left||box.left>left+r.width||box.bottom<top||box.top>top+r.height)continue;const inverse=node.getScreenCTM()?.inverse();if(!inverse)continue;for(let dx=0;dx<=r.width;dx+=16)for(let dy=0;dy<=r.height;dy+=12){const q=new DOMPoint(left+dx,top+dy).matrixTransform(inverse);if(node.isPointInStroke?.(q)||node.isPointInFill?.(q))hits++;}}
      const g=gear.getBoundingClientRect(),overlap=Math.max(0,Math.min(left+r.width,g.right)-Math.max(left,g.left))*Math.max(0,Math.min(top+r.height,g.bottom)-Math.max(top,g.top));const score=hits*1000+overlap*100+Math.hypot(x-280,y-430);if(!best||score<best.score)best={left,top,score};
    }placeDialog(best.left,best.top);
  }
  function bindDrag(node,key,isGear){node.addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button!==0||!isGear&&event.target.closest('button,a,input,select,textarea'))return;event.stopPropagation();if(isGear)suppressGearClick=false;const box=(isGear?gear:dialog).getBoundingClientRect(),sx=event.clientX,sy=event.clientY,id=event.pointerId;let moved=false;
    const move=e=>{if(e.pointerId!==id)return;if(!moved&&Math.hypot(e.clientX-sx,e.clientY-sy)<6)return;if(!moved)node.setPointerCapture(e.pointerId);moved=true;e.preventDefault();if(isGear){gearDrag=true;placeGear(box.x+box.width/2+e.clientX-sx,box.y+box.height/2+e.clientY-sy);}else{windowDrag=true;placeDialog(box.x+e.clientX-sx,box.y+e.clientY-sy);}};
    const end=e=>{if(e.pointerId!==id)return;document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',end);document.removeEventListener('pointercancel',end);if(moved){if(e.type!=='pointercancel'){const r=(isGear?gear:dialog).getBoundingClientRect();const svg=document.querySelector('.table-svg[data-view-table="'+get('editTable')?.value+'"]')||document.querySelector('.table-svg'),matrix=svg?.getScreenCTM(),point=isGear&&matrix?new DOMPoint(r.x+r.width/2,r.y+r.height/2).matrixTransform(matrix.inverse()):null;write(key,isGear?{tableX:point?(get('noseDirection')?.value==='oost'?560-point.x:point.x):undefined,tableY:point?.y,x:(r.x+r.width/2)/innerWidth,y:(r.y+r.height/2)/innerHeight,pattern:get('bandPatternSelect')?.value}:{x:r.x/innerWidth,y:r.y/innerHeight});}if(e.type==='pointercancel'&&!isGear)placeDialog(box.x,box.y);if(isGear)suppressGearClick=true;}gearDrag=false;windowDrag=false;if(isGear&&!moved&&e.type==='pointerup'){e.preventDefault();suppressGearClick=true;openConfig();}position();};
    document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  });}
  bindDrag(gear,gearKey,true);bindDrag(dialog.querySelector('header'),dialogKey,false);
  function openConfig(){reconcile();if(!dialog.open){get('cleanConfigMore').open=false;dialog.scrollTop=0;dialog.show();get('closeCleanConfig').focus({preventScroll:true});}fitDialog();}
  document.addEventListener('pointerdown',()=>{suppressGearClick=false;},true);
  document.addEventListener('click',e=>{if(suppressGearClick&&e.detail!==0){suppressGearClick=false;e.preventDefault();e.stopImmediatePropagation();}},true);
  gear.onclick=e=>{e.preventDefault();e.stopPropagation();suppressGearClick=false;openConfig();};get('closeCleanConfig').onclick=()=>dialog.close();get('closeSelectionMenu')?.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open&&!document.querySelector('dialog:modal')){e.preventDefault();dialog.close();}});
  dialog.addEventListener('toggle',()=>requestAnimationFrame(fitDialog),true);
  const textConfig=document.createElement('fieldset');textConfig.id='tableTextConfig';textConfig.innerHTML='<legend>Tafel en teksten</legend><label>Schaalweergave <select id="tableScaleMode"><option value="tables">Tafels even groot</option><option value="balls">Ballen even groot</option><option value="tracks">Vergelijk sporen</option></select></label><p id="tableScaleHint"></p><label>Cursustafel <select id="courseTableSize"><option value="klein">Klein · standaard</option><option value="groot">Groot</option></select></label><label>Bandteksten (px) <input id="tableBandFontSize" type="number" min="12" max="28" step="1"></label><label><input id="showEndpointValues" type="checkbox"> Labels bij begin en eind van de lijn</label><label>Neus · aankomst <select id="neusArrivalLabelMode"><option value="number">Getal · 50</option><option value="name">Spoornaam · VIJF</option><option value="both">Beide · 50 · VIJF</option></select></label><label>Lijngetallen (px) <input id="tableEndpointFontSize" type="number" min="10" max="26" step="1"></label>';get('cleanConfigSettings').prepend(textConfig);
  const textPrefs=window.ThreeBTableText.get();get('courseTableSize').value=textPrefs.courseTable;get('tableScaleMode').value=textPrefs.scaleMode;get('tableBandFontSize').value=textPrefs.bandSize;get('tableEndpointFontSize').value=textPrefs.endpointSize;get('showEndpointValues').checked=textPrefs.showEndpoints;get('neusArrivalLabelMode').value=textPrefs.neusArrivalLabelMode;
  textConfig.onchange=e=>{if(!e.target.checkValidity())return;const fields={neusArrivalLabelMode:['neusArrivalLabelMode',e.target.value],tableScaleMode:['scaleMode',e.target.value],courseTableSize:['courseTable',e.target.value],tableBandFontSize:['bandSize',Number(e.target.value)],tableEndpointFontSize:['endpointSize',Number(e.target.value)],showEndpointValues:['showEndpoints',e.target.checked]},field=fields[e.target.id];if(field)window.ThreeBTableText.update({[field[0]]:field[1]});};
  function syncScaleMode(){const prefs=window.ThreeBTableText.get(),mode=prefs.scaleMode;get('tableScaleMode').value=mode;get('courseTableSize').value=prefs.courseTable;get('neusArrivalLabelMode').value=prefs.neusArrivalLabelMode;get('tableScaleHint').textContent=({tables:'Gelijke gele randen; de bal op Klein is naar verhouding groter.',balls:'Gelijke ballen; Klein wordt kleiner getekend dan Groot.',tracks:'Gelijke gele randen en ballen om lijnen te vergelijken.'})[mode];}window.addEventListener('threeb-spoor-state',syncScaleMode);syncScaleMode();
  const reset=document.createElement('button');reset.id='resetConfigPosition';reset.type='button';reset.textContent='Config naar standaardplek';reset.title='Menu rechtsboven in het speelvlak, linksboven bij spiegelen';get('cleanConfigSettings').append(reset);reset.onclick=()=>{erase(gearKey);erase(dialogKey);dialog.removeAttribute('style');if(select){select.value='central';select.dispatchEvent(new Event('change',{bubbles:true}));}position();};
  dialog.addEventListener('click',e=>{const id=e.target.closest('button,a')?.id;if(['levelLklCourse','levelLklPractice','openExplanation','openSpoorscherm','openLklFramework','desktopOpenSpoor','mobilePreview','userSettingsButton','toggleConfig','thumbUp'].includes(id))dialog.close();},true);
  get('menuButtonPositionSelect')?.addEventListener('change',e=>{erase(gearKey);try{localStorage.setItem('3b-clean-config-position-v1',e.target.value);}catch(_){}requestAnimationFrame(position);});
  const mount=get('svgMount');if(mount&&window.ResizeObserver)new ResizeObserver(()=>requestAnimationFrame(position)).observe(mount);
  function resetMenu(){erase(gearKey);erase(dialogKey);try{localStorage.setItem('3b-clean-config-position-v1','central');}catch(_){}requestAnimationFrame(position);}
  window.addEventListener('pageshow',resetMenu);window.addEventListener('focus',resetMenu);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)resetMenu();});
  document.addEventListener('close',resetMenu,true);window.addEventListener('threeb-table-return',resetMenu);resetMenu();
  window.addEventListener('threeb-table-layout',position);window.addEventListener('resize',()=>requestAnimationFrame(reconcile));window.addEventListener('threeb-spoor-state',()=>requestAnimationFrame(position));reconcile();requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
};

/* Symbols and compact values belong only to the spoor editor. */
const SpoorScreenFormat=(()=>{
  const doubles=['⇗','⇘','⇙','⇖'],singles=['↗','↘','↙','↖'];
  function format(value){
    if(value===null||value===undefined||!Number.isFinite(Number(value)))return '';
    const quarter=Math.round(Number(value)*4),base=Math.floor(quarter/4),rest=quarter-base*4;
    return rest===0?String(base):rest===1?base+'+':rest===2?base+'++':(base+1)+'−';
  }
  function parse(text){
    if(!text.trim())return null;
    const m=text.trim().replace(/−/g,'-').match(/^([+-]?\d+)(\+\+|\+|-)?$/);
    if(!m)throw Error('Gebruik bijvoorbeeld 30, 30+, 30++ of 31−.');
    return Number(m[1])+({'':0,'+':.25,'++':.5,'-':-.25}[m[2]||'']);
  }
  function arrow(v,a,geometry,direction='west',style='double'){
    try{
      const from=SpoorGeometry.point(v,geometry),to=SpoorGeometry.point(a,geometry);
      const dx=(to.x-from.x)*(direction==='oost'?-1:1),dy=to.y-from.y;
      if(Math.hypot(dx,dy)<1e-8)return '·';
      if(Math.abs(dx)<1e-8)return dy<0?(style==='double'?'⇑':'↑'):(style==='double'?'⇓':'↓');
      if(Math.abs(dy)<1e-8)return dx>0?(style==='double'?'⇒':'→'):(style==='double'?'⇐':'←');
      const index=dx>0?(dy<0?0:1):(dy>0?2:3);return (style==='double'?doubles:singles)[index];
    }catch(_){return '·';}
  }
  function contact(band,direction='west',style='bar'){
    if(direction==='oost')band={west:'oost',oost:'west'}[band]||band;
    return (style==='bar'?{west:'⇤',oost:'⇥',noord:'⤒',zuid:'⤓'}:{west:'←',oost:'→',noord:'↑',zuid:'↓'})[band]||'·';
  }
  function arrival(text,band,direction='west'){
    const match=text.trim().match(/^(west|oost|noord|zuid|[wonz])\s*[·:]?\s*(.*)$/i);
    if(!match)return {band,value:parse(text)};
    const names={w:'west',o:'oost',n:'noord',z:'zuid'},shown=names[match[1].toLowerCase()]||match[1].toLowerCase(),canonical=direction==='oost'?({west:'oost',oost:'west'}[shown]||shown):shown;
    if(!['west','zuid'].includes(canonical))throw Error('Romp: kies '+(direction==='oost'?'Oost':'West')+' of Zuid.');
    const value=parse(match[2]);if(value===null)throw Error('Vul ook de waarde in, bijvoorbeeld Zuid 19.');return {band:canonical,value};
  }
  return {format,parse,arrival,arrow,contact};
})();
if(typeof module!=='undefined')module.exports=SpoorScreenFormat;
if(typeof window!=='undefined')window.installThreeBSpoorScreen=adapter=>{
  document.body.classList.add('spoor-editor-only');
  if(window.THREEB_TEST_ENVIRONMENT){
    document.body.classList.add('threeb-test-appearance');
    if(!document.getElementById('threebTestAppearance')){const style=document.createElement('style');style.id='threebTestAppearance';style.textContent=`
      body.threeb-test-appearance,.threeb-test-appearance .drawing{background:#eee9f7!important}
      .threeb-test-appearance #testEnvironmentBanner{position:sticky;top:0;z-index:900;background:#4e347a!important;color:#fff!important;border-bottom:3px solid #bba5df;font:600 14px system-ui!important;padding:10px!important}
      .threeb-test-appearance.course-open #testEnvironmentBanner{visibility:hidden}
      .threeb-test-appearance #testEnvironmentBanner a{color:#fff!important;text-decoration:underline}
      .threeb-test-appearance #spoorTestVersion{display:inline-block;background:#fff;color:#4e347a;padding:3px 8px;border-radius:5px;font-weight:800;margin-right:6px}
      .threeb-test-appearance #testTransfer{position:relative!important;top:auto!important;right:auto!important;z-index:1!important;margin:8px 8px 8px auto;background:#f4effc!important;border-color:#8064a6!important}
      .threeb-test-appearance #centralStartAcquitControl{background:#f4effc;border-color:#8064a6}
      .threeb-test-appearance #spoorScreen{background:#faf8ff;border:2px solid #8064a6}
      #desktopWorkbench{display:none}
      body.test-desktop-workbench{--test-workbench-width:360px;overflow:hidden}
      body.test-desktop-workbench #desktopWorkbench{display:flex;flex-direction:column;gap:12px;position:fixed;top:calc(var(--threeb-test-banner-height,48px) + 12px);right:12px;bottom:12px;width:var(--test-workbench-width);overflow:auto;box-sizing:border-box;z-index:950;padding:0 0 16px}
      body.test-desktop-workbench #desktopWorkbench #databaseWorkspace{position:static!important;margin:0!important;width:100%!important;max-width:none!important;font-size:15px!important;line-height:1.4}
      body.test-desktop-workbench #databaseWorkspace summary{font-size:16px}
      body.test-desktop-workbench #databaseWorkspace button{min-height:40px;margin-bottom:6px}
      body.test-desktop-workbench #desktopWorkbench #bandDock{position:relative!important;inset:auto!important;left:auto!important;top:auto!important;transform:none!important;width:100%!important;flex-shrink:0;box-sizing:border-box}
      body.test-desktop-workbench #desktopWorkbench #bandCore{width:100%;margin:0}
      body.test-desktop-workbench #desktopWorkbench #bandMenu{margin:0 0 6px auto}
      body.test-desktop-workbench #desktopWorkbench #mobilePreview{display:flex!important;align-items:center;justify-content:center;min-height:40px;width:100%;flex-shrink:0;font-size:15px}
      body.test-desktop-workbench #desktopWorkbench .onscreen-control-menuPanel{display:none!important;position:static!important;inset:auto!important;pointer-events:auto;width:100%;flex-shrink:0}
      body.test-desktop-workbench.table-menu-open #desktopWorkbench .onscreen-control-menuPanel{display:block!important}
      body.test-desktop-workbench #desktopWorkbench .central-track-controls{position:static!important;inset:auto!important;transform:none!important;width:100%!important;max-width:100%!important;max-height:none!important;margin:0!important;box-sizing:border-box}
      body.test-desktop-workbench #bandDock.workbench-menu-floating{position:fixed!important;width:340px!important;max-width:calc(100vw - 8px)!important;z-index:3900}
      body.threeb-test-appearance #bandDock{width:min(340px,calc(100vw - 16px));max-width:calc(100vw - 16px)}
      body.threeb-test-appearance #bandCore{display:grid!important;grid-template-columns:1fr!important;grid-auto-flow:row!important;gap:8px!important;width:100%!important;min-width:0!important;max-width:100%!important;padding:10px!important;box-sizing:border-box;overflow:visible!important;border-radius:10px;background:#80582f;box-shadow:0 3px 14px #0003}
      body.threeb-test-appearance #bandCore .band-drag-handle{grid-column:1/-1;min-height:32px;display:flex;align-items:center;justify-content:center;font:600 14px system-ui;color:#fff4dd;cursor:grab;touch-action:none}
      body.threeb-test-appearance #bandCore .band-step{display:grid!important;grid-template-columns:70px minmax(0,1fr)!important;align-items:center;gap:8px;min-width:0!important;width:100%!important;margin:0!important;padding:0!important;box-sizing:border-box}
      body.threeb-test-appearance #bandCore .band-step small{font:600 14px system-ui;color:#fff4dd;letter-spacing:0;text-transform:none;text-align:left}
      body.threeb-test-appearance #bandCore .band-step>span{display:grid!important;grid-template-columns:44px minmax(0,1fr) 44px;align-items:center;gap:6px;min-width:0!important}
      body.threeb-test-appearance #bandCore button,body.threeb-test-appearance #bandCore select{min-height:44px!important;min-width:0!important;font:600 17px system-ui!important;box-sizing:border-box}
      body.threeb-test-appearance #bandCore button{width:44px!important;padding:4px!important;border-radius:6px;background:#fff7e9;color:#442a13;border:1px solid #c6ab82}
      body.threeb-test-appearance #bandCore select{width:100%!important;max-width:100%!important;padding:6px;border:1px solid #c6ab82;border-radius:6px;background:#fff7e9;color:#442a13}
      body.threeb-test-appearance #bandCore output{font:700 16px system-ui;color:white;text-align:center;min-width:0;overflow:hidden;text-overflow:ellipsis}
      body.threeb-test-appearance #bandMenu{width:44px;min-height:44px;font-size:22px}
      #testVersionRecall{grid-column:1/-1;font:600 14px system-ui;padding:8px 12px;min-height:44px;border:1px solid #8a9b91;border-radius:7px;color:#142e24;background:#fff7e9}
      #desktopOpenSpoor{min-height:44px;background:#176f4f;color:white;border:0;border-radius:7px;font:700 15px system-ui;flex-shrink:0}
      body.test-desktop-workbench .drawing{position:fixed!important;inset:var(--threeb-test-banner-height,48px) calc(var(--test-workbench-width) + 24px) 0 0!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;max-width:none!important;max-height:none!important;border:0!important;border-radius:0!important;overflow:hidden}
      body.test-desktop-workbench .drawing>.drawing-heading{position:absolute!important;inset:0 0 auto!important}
      body.test-desktop-workbench #svgMount{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:100%!important}
      body.test-desktop-workbench .onscreen-layout{height:100%!important;max-height:100%!important}
      body.test-desktop-workbench.course-open #desktopWorkbench,body.customer-preview #desktopWorkbench,body.course-open #bandDock.workbench-menu-floating,body.customer-preview #bandDock.workbench-menu-floating{visibility:hidden;pointer-events:none}

    `;document.head.append(style);}
  }

  const releaseVersion=window.THREEB_RELEASE?.version||'onbekend';
  const userQr=adapter.inputOwner?.()==='user';window.installMobileTestQr?.({getView:()=>adapter.mobileTableView(),button:document.getElementById('mobilePreview'),imageUrl:new URL((userQr?'qr-user.png':'qr-test-neus.png')+'?v='+releaseVersion,location.href).href,testUrl:userQr?'https://kruin.github.io/3b/test3b/open.html?mode=user#owner=user':'https://kruin.github.io/3b/test3b/open.html#owner=kruin',qrPageUrl:new URL((userQr?'qr-user.html':'qr.html')+'?v='+releaseVersion,location.href).href});
  const compactVersionStyle=document.createElement('style');compactVersionStyle.textContent='body.test-status-hidden #testEnvironmentBanner{display:none!important}';document.head.append(compactVersionStyle);
  let statusTimer;
  function showVersionBriefly(){document.body.classList.remove('test-status-hidden');markTestVersion();clearTimeout(statusTimer);statusTimer=setTimeout(()=>{document.body.classList.add('test-status-hidden');document.documentElement.style.setProperty('--threeb-test-banner-height','0px');},7000);}
  const markTestVersion=()=>{
    const banner=document.querySelector('#testEnvironmentBanner');if(!banner)return;
    if(!document.getElementById('spoorTestVersion')){const version=document.createElement('span');version.id='spoorTestVersion';version.textContent='TEST '+releaseVersion;banner.prepend(version);}
    document.title='TEST · 3B '+releaseVersion;
    const description=[...banner.childNodes].find(n=>n.nodeType===3);
    if(description)description.textContent=window.ThreeBDatabaseWorkspace?.active?' · DB: '+window.ThreeBDatabaseWorkspace.sourceStatus+' · productie apart ':' · Kruin configureren · open een SQLite-werkbestand ';
    document.documentElement.style.setProperty('--threeb-test-banner-height',document.body.classList.contains('test-status-hidden')?'0px':banner.offsetHeight+'px');
  };
  markTestVersion();showVersionBriefly();const recall=document.createElement('button');recall.id='testVersionRecall';recall.type='button';recall.textContent='Versie en status';recall.onclick=()=>{showVersionBriefly();const detail=document.getElementById('testStatusDetails');detail.hidden=!detail.hidden;detail.textContent='App: '+releaseVersion+'\nDatabase: '+(window.ThreeBDatabaseWorkspace?.sourceStatus||'U · JSON-tafel')+'\n'+(document.getElementById('databaseOriginDetail')?.textContent||'');};const selectionMenu=document.querySelector('.onscreen-control-menuPanel .central-track-controls')||document.querySelector('.onscreen-control-menuPanel');(selectionMenu||document.getElementById('bandDock')||document.body).append(recall);const statusDetail=document.createElement('p');statusDetail.id='testStatusDetails';statusDetail.hidden=true;statusDetail.style.cssText='grid-column:1/-1;white-space:pre-line;font:14px/1.5 system-ui;background:#fff7e9;color:#142e24;padding:10px;border-radius:6px';recall.after(statusDetail);window.addEventListener('DOMContentLoaded',markTestVersion,{once:true});window.addEventListener('resize',markTestVersion);window.addEventListener('threeb-database-state',markTestVersion);

  if(document.getElementById('openSpoorscherm'))return;
  const css=document.createElement('style');css.textContent=`
  body:has(#explanationCarousel:not([hidden])) #testTransfer,body:has(#spoorScreen[open]) #testTransfer{display:none}
  .spoor-origin-options [hidden]{display:none!important}
  .spoor-reference-diff{border-color:#a36b00!important;background:#fff3d4!important}.spoor-origin-options{display:flex;gap:4px;width:100%}.spoor-origin-options button{flex:1;min-height:44px;min-width:0;padding:5px 4px;border:1px solid #8a9b91;border-radius:5px;background:#f7f5ed;color:#142e24;font:600 13px system-ui;touch-action:manipulation}#spoorScreen .spoor-origin-options button{min-height:44px}.spoor-origin-options button.active{background:#176f4f!important;color:#fff!important;border-color:#0d4934}.spoor-start-setting{grid-column:1/-1;display:grid;gap:4px}#centralStartAcquit[hidden],#spoorStart[hidden]{display:none!important}
  [data-start-acquit="true"]{pointer-events:auto;cursor:pointer}#centralStartAcquitControl{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;padding:5px 8px;background:#f7f5ed;color:#142e24;border:1px solid #8a9b91;border-radius:6px;font:600 13px system-ui}#spoorScreen .spoor-start-cycle{font:inherit;padding:0 3px;background:transparent;border:0;color:inherit;min-width:0;width:100%;touch-action:manipulation}#startAcquitCycle{font:800 16px system-ui;padding:2px 8px;min-height:32px;touch-action:manipulation}#startAcquitPatternStatus{flex-basis:100%;text-align:center;font-size:12px}#centralStartAcquitControl{flex-wrap:wrap}#centralStartAcquit{min-height:32px;max-width:65%;font:inherit} #spoorScreen{position:fixed;inset:auto;margin:0;z-index:4100;box-shadow:0 8px 30px #0005;width:min(96vw,620px);max-height:94dvh;overflow:auto;padding:12px;border:1px solid #8a9b91;border-radius:10px;background:#f7f5ed;color:#142e24;font:15px system-ui;box-sizing:border-box;--spoor-symbol-size:32px}
  body.spoor-editor-only #lineEditor,body.spoor-editor-only #ballNudgePanel,body.spoor-editor-only .workspace>.editor,body.spoor-editor-only .ball-value-window,body.spoor-editor-only #toggleConfig{display:none!important}#spoorScreen>header{cursor:grab;touch-action:none;user-select:none}#spoorScreen>header:active{cursor:grabbing}#spoorScreen header,#spoorScreen footer{display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap}#spoorScreen h2{font-size:18px;margin:0}
  #spoorScreen table{width:100%;table-layout:fixed;border-collapse:collapse;background:#fff}#spoorScreen th,#spoorScreen td{padding:6px 3px;border-bottom:1px solid #d8dfd8;text-align:left}#spoorScreen thead th{font-size:14px;text-align:center;background:#e4ece5}#spoorScreen th:first-child{width:14%;white-space:nowrap}#spoorScreen td{width:20%}#spoorScreen thead th:last-child{width:26%;font-size:12px}#spoorScreen tbody th{font-size:13px;text-transform:none;letter-spacing:0}#spoorScreen .spoor-point{position:relative;display:flex;align-items:center;white-space:nowrap;isolation:isolate}
  #spoorScreen .spoor-symbol{position:absolute;right:4px;top:50%;transform:translateY(-50%);z-index:0;opacity:.24;pointer-events:none;font-family:'Noto Sans Symbols 2','DejaVu Sans',sans-serif;font-size:var(--spoor-symbol-size);font-weight:800;line-height:1.25;min-width:1.1em;text-align:center;color:#123e2c;font-style:normal;-webkit-text-stroke:.25px currentColor}
  #spoorScreen .spoor-value{position:relative;z-index:1;background:transparent!important;width:100%;min-width:0;min-height:38px;padding:4px 2px;margin:0;font:400 16px system-ui;font-variant-numeric:tabular-nums;text-align:center;box-sizing:border-box}#spoorScreen .spoor-value:disabled{opacity:1;color:#655b40;background:#f4f1e8}#spoorScreen .spoor-unit{position:absolute;right:4px;bottom:1px;z-index:2;font-size:9px;pointer-events:none}#spoorScreen .selected-line{background:#fff2c7}#spoorScreen .automatic{color:#655b40}#spoorScreen footer{position:sticky;bottom:0;background:#f7f5ed;padding:8px 0 0}#spoorScreen button{min-height:38px}#spoorScreen .hint{font-size:12px;line-height:1.4;margin:8px 0}#spoorScreenStatus{flex-basis:100%;font-size:13px}#spoorScreenStatus.error{color:#a72222}#spoorScreen .spoor-tools{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:8px 0}#spoorScreen .spoor-tools label{display:flex;align-items:center;gap:6px}#spoorStyleConfig{margin:8px 0;font-size:13px}#spoorStyleConfig summary{cursor:pointer;font-weight:700;padding:10px;border:1px solid #8a9b91;border-radius:6px;background:#e4ece5}#spoorScreen #configSpoorScreen,#courseSpoorConfig{font-weight:700;background:#e4ece5;color:#142e24;border:1px solid #8a9b91;border-radius:6px;padding:6px 12px;min-height:38px}#spoorStyleConfig .styles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}#spoorStyleConfig label{display:grid;gap:3px}#spoorScreen select{min-height:36px;max-width:100%;font:inherit}#spoorScreen .start{font-size:13px}#spoorScreen .terminal{display:block;font-size:10px;white-space:normal}
  #svgMount .table-svg{overflow:visible}
  #svgMount .table-svg[data-desktop-angle] text{transform-box:fill-box;transform-origin:center;transform:rotate(calc(-1 * var(--desktop-table-angle,0deg)))}
  #svgMount .table-svg[data-desktop-angle] :is(.route-caption,.value-tag){transform-box:fill-box;transform-origin:center;transform:rotate(calc(-1 * var(--desktop-table-angle,0deg)))}
  #svgMount .table-svg[data-desktop-angle] :is(.route-caption,.value-tag) text{transform:none}
  #svgMount .segment-hit:focus{outline:none}#svgMount .segment-hit:focus-visible{stroke:#ffd35a;stroke-width:4}

  body.table-only.mobile-preview.mobile-preview-landscape .drawing{width:min(844px,96vw)!important;height:min(390px,90dvh)!important}
  @media(pointer:coarse){body.table-only .view-actions{display:none!important}}
  @media(max-width:999px),(pointer:coarse){body.database-workspace:not(.database-not-open) #databaseMobileToggle{top:calc(var(--threeb-test-banner-height,0px) + 76px)!important}}
  #spoorScreen tr[hidden]{display:none!important}#spoorScreen .lkl-karkas-anchor th{border-left:4px solid #176f4f;background:#e4eee6}#lklFramework [hidden],#lklFramework[hidden]{display:none!important}#lklFramework .lkl-transfer-table{font-size:12px;width:100%;border-collapse:collapse}#lklFramework .lkl-transfer-table td,#lklFramework .lkl-transfer-table th{padding:4px;text-align:left}
  .table-size-label{display:none;position:absolute;top:4px;left:50%;transform:translateX(-50%);z-index:5;box-sizing:border-box;max-width:calc(100% - 12px);padding:5px 12px;border-radius:7px;border:1px solid #efd09b;background:#fff8e9;color:#173d2c;font:800 clamp(16px,1.6vw,22px)/1.2 system-ui;text-align:center;white-space:nowrap;pointer-events:none;box-shadow:0 1px 5px #0003}
  body.compare-tables .table-size-label{display:block}
  /* Mobile preview is a container, not the desktop viewport. */
  body.table-only.mobile-preview .onscreen-layout{width:100%;height:100%;min-width:0;min-height:0}
  body.table-only.mobile-preview .drawing{padding:0;box-sizing:border-box}
  body.table-only.mobile-preview .svg-mount,body.table-only.mobile-preview .drawing-card{min-width:0;min-height:0;max-width:100%;max-height:100%}
  @media(min-width:761px){body.table-only .view-actions{left:8px;right:auto;z-index:2251}}
  @media(max-width:400px){#spoorScreen{padding:8px}#spoorScreen th,#spoorScreen td{padding:5px 1px}#spoorScreen .spoor-value{font-size:15px}#spoorScreen .spoor-symbol{min-width:1em}}
  `;document.head.append(css);
  const button=document.createElement('button');button.id='openSpoorscherm';button.type='button';button.textContent='Spoorscherm · V/R/A';document.querySelector('.selection-menu-header').after(button);
  const dialog=document.createElement('dialog');dialog.id='spoorScreen';
  dialog.innerHTML=`<header><h2 id="spoorScreenTitle">Spoorscherm</h2><div><button id="configSpoorScreen" type="button" aria-expanded="false" aria-controls="spoorStyleConfig">⚙ Config</button><button id="positionSpoorScreen" type="button" title="Terug in beeld" aria-label="Spoorscherm terug in beeld">↺</button><button id="closeSpoorScreen" type="button" aria-label="Sluiten" title="Sluiten">×</button></div></header>
  <p class="hint spoor-origin-legend"><b>Vet: handmatig ingevoerd</b> · normaal: berekend of basiswaarde. Houd een waarde vast/hover voor de herkomst.</p><div class="spoor-tools"><label><input id="mirrorSpoorScreen" type="checkbox">Spiegelen · naar Oost</label><span id="spoorDirectionLabel"></span></div>
  <section id="lklFramework" hidden style="padding:10px;background:#e4eee6;border:1px solid #819d89;border-radius:8px;margin:8px 0"><strong>Eigen meetbasis LKL · Neus, Kop en Romp</strong><p id="lklFrameworkStatus" role="status" style="margin:6px 0;font-weight:700"></p><p id="lklFrameworkUserRule" class="hint" hidden></p><p id="lklFrameworkChecks" class="hint"></p><button id="toggleFrameworkLines" type="button">Karkas tonen</button><details><summary style="padding:10px 0;cursor:pointer">Hoe meet ik LKL?</summary><p id="lklNoseInstruction" class="hint"></p><p id="lklHeadInstruction" class="hint"></p><p id="lklBodyInstruction" class="hint"></p></details><section id="lklTransferOffer" hidden style="margin-top:10px;border-top:1px solid #8aa28f;padding-top:8px"><strong>Je basis staat · gebruik Kruins gemeten +/−-reeks</strong><p class="hint">Je basis + het gemeten verschil bij Kruin geeft een voorstel voor jouw +/−-sporen. Bekijk eerst de aankomsten; extra zelf testen is jouw keuze. Overgenomen waarden zijn afgeleid.</p><button id="reviewLklTransfer" type="button">Voorstel +/− bekijken</button><div id="lklTransferReview" hidden><div id="lklTransferRows" style="overflow:auto;margin-top:8px"></div><button id="acceptLklTransfer" type="button">Neem beschikbare voorstellen over</button><p id="lklTransferInfo" class="hint"></p></div></section></section>
  <table><thead><tr><th>Lijn</th><th>V</th><th>R</th><th>A</th><th aria-label="Opmerking">Opmerking</th></tr></thead><tbody></tbody></table>
  <details id="spoorStyleConfig"><summary>Config</summary><p id="spoorComparisonInfo" class="hint" hidden></p><div class="styles"><label><span>Oriëntatiekruisjes op tafel</span><input id="showTableAcquits" type="checkbox" style="width:24px;height:24px;min-height:24px"></label><label>Mobiel · staand / liggend<select id="mobileTableOrientation"><option value="auto">Automatisch</option><option value="upright">Staand</option><option value="right">Liggend ↻ rechtsom</option><option value="left">Liggend ↺ linksom</option></select></label><label>Desktop · Klein<select id="desktopOrientationKlein"><option value="upright">Rechtop</option><option value="right">↻ Kwartslag rechtsom</option><option value="left">↺ Kwartslag linksom</option></select></label><label>Desktop · Groot<select id="desktopOrientationGroot"><option value="upright">Rechtop</option><option value="right">↻ Kwartslag rechtsom</option><option value="left">↺ Kwartslag linksom</option></select></label><label>V en A<select id="spoorArrowStyle"><option value="double">⇖ Dubbele pijlen</option><option value="single">↖ Enkele pijlen</option></select></label><label>Raakpunt<select id="spoorContactStyle"><option value="bar">⇥ Pijl met bandstreep</option><option value="single">→ Enkele pijl</option></select></label><label>Symboolgrootte<select id="spoorSymbolSize"><option value="24">24</option><option value="28">28</option><option value="32" selected>32</option></select></label></div><p class="hint">Het benedenacquit is de vaste basis voor de naamgeving in de cursus. Parallelsporen vanuit het midden- of bovenacquit blijven bruikbaar. Extra vertrekletters en alternatieve spoornamen voegen weinig toe aan de bestaande spoor- en +/−-notatie, maar vragen telkens een vertaling en leiden af. Daarom leren we geen afzonderlijk naamstelsel per acquit aan. Parallel en waaier behouden hun eigen werking. Een referentiepunt op de band is geen positie voor het balmiddelpunt.<br>V en A volgen de speelrichting; R wijst naar de geraakte band.<br>30+ ≈ 30¼ · 30++ ≈ 30½ · 31− ≈ 30¾. Exacte bestaande waarden blijven bewaard.</p></details>
  <p id="spoorMeasurementHint" class="hint"></p><footer><button id="saveSpoorScreen" type="button">Bewaar spoor</button><button id="connectGithubSpoor" type="button" hidden>GitHub verbinden</button><button id="reloadSpoorScreen" type="button">Herlaad</button><span id="spoorScreenStatus" role="status" aria-live="polite"></span></footer>`;
  document.body.append(dialog);const frameworkButton=document.createElement('button');frameworkButton.id='openLklFramework';frameworkButton.type='button';frameworkButton.textContent='LKL · eigen meetbasis';button.after(frameworkButton);frameworkButton.onclick=()=>open({framework:true,recenter:true});const syncFrameworkButton=()=>{frameworkButton.hidden=adapter.read().selectedPattern!=='LKL';};window.addEventListener('threeb-spoor-state',syncFrameworkButton);syncFrameworkButton();

  const $=id=>dialog.querySelector('#'+id),body=dialog.querySelector('tbody'),text=(message,error=false)=>{$('spoorScreenStatus').textContent=message;$('spoorScreenStatus').classList.toggle('error',error);};
  let original,working,dirty=false,saving=false,viewDirection,previewing=false,openNote=null,frameworkOnly=false,transferProposal=null;
  function syncConnectionControl(){const connected=Boolean(window.ThreeBGitHub?.connected);$('connectGithubSpoor').hidden=!window.ThreeBDatabaseWorkspace?.remote||connected;if(connected&&!saving&&/Verbind.*GitHub|GitHub-toegang.*verlopen/i.test($('spoorScreenStatus').textContent))text(dirty?'Wijzigingen nog niet bewaard.':'');}
  window.addEventListener('threeb-database-state',syncConnectionControl);
  document.addEventListener('pointerdown',e=>{if(openNote&&!e.target.closest('.spoor-note'))openNote.close();},true);
  $('reviewLklTransfer').onclick=()=>{if(dirty){text('Bewaar eerst je eigen basismetingen.',true);return;}try{transferProposal=adapter.transferProposal(original.direction);const target=$('lklTransferRows');target.replaceChildren();const table=document.createElement('table');table.className='lkl-transfer-table';const head=document.createElement('tr');for(const name of ['Spoor','Kop A','Romp A','Voorstel']){const th=document.createElement('th');th.textContent=name;head.append(th);}table.append(head);for(const item of transferProposal.items){const tr=document.createElement('tr');tr.dataset.transferTrack=item.track;const value=p=>{if(!p)return '—';const band=original.direction==='oost'?({west:'oost',oost:'west'}[p.band]||p.band):p.band;return ({west:'W',noord:'N',oost:'O',zuid:'Z'}[band]||'')+' '+SpoorScreenFormat.format(p.value);};for(const text of [item.track,item.available?value(item.route.kop.to):'—',item.available?value(item.route.romp.to):'—',item.available?'Afgeleid':item.reason]){const td=document.createElement('td');td.textContent=text;tr.append(td);}table.append(tr);}target.append(table);const count=transferProposal.items.filter(i=>i.available).length;$('acceptLklTransfer').disabled=!count;$('lklTransferInfo').textContent=count+' voorstellen beschikbaar. Eigen meetinvoer blijft behouden. Bij een andere basis beoordeel je de overdracht opnieuw.';$('lklTransferReview').hidden=false;}catch(error){text(error.message,true);}};
  $('acceptLklTransfer').onclick=()=>{if(dirty||!transferProposal)return;try{const n=adapter.acceptTransfer(transferProposal);load();text(n+' afgeleide +/−-sporen overgenomen. Je eigen basis en andere eigen meetinvoer zijn behouden.');}catch(error){text(error.message,true);}};
  $('toggleFrameworkLines').onclick=()=>{frameworkOnly=!frameworkOnly;updateFramework();};for(const [id,key] of [['lklNoseInstruction','neus'],['lklHeadInstruction','kop'],['lklBodyInstruction','romp']])$(id).textContent=ThreeBLklKarkas.instructions[key];
  $('connectGithubSpoor').onclick=()=>window.ThreeBDatabaseWorkspace?.showConnection();
  $('showTableAcquits').checked=adapter.showAcquits?.()!==false;$('showTableAcquits').onchange=()=>adapter.setShowAcquits($('showTableAcquits').checked);
  $('mobileTableOrientation').value=adapter.mobileOrientation?.()||'auto';$('mobileTableOrientation').onchange=()=>adapter.setMobileOrientation($('mobileTableOrientation').value);
  for(const table of ['klein','groot']){
    const field=$('desktopOrientation'+(table==='klein'?'Klein':'Groot'));field.value=adapter.desktopOrientations?.()[table]||'upright';
    field.onchange=()=>adapter.setDesktopOrientation(table,field.value);
  }
  const notesStyle=document.createElement('style');notesStyle.textContent='#spoorScreen .spoor-note-cell{width:26%;padding:2px}#spoorScreen .spoor-note-preview{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#spoorScreen .spoor-note-more{flex:none;margin-left:3px}#spoorScreen .spoor-note-button:has(.spoor-note-more:not([hidden])) .spoor-note-preview{text-overflow:clip}#spoorScreen .spoor-note-button{display:flex;align-items:center;width:100%;min-width:0;min-height:38px;padding:4px 6px;text-align:left;font:13px system-ui;background:#e4ece5;border:1px solid #8a9b91;border-radius:5px;color:#142e24}#spoorScreen .spoor-note-popup{position:fixed;z-index:4300;width:min(300px,calc(100vw - 16px));box-sizing:border-box;padding:10px;background:#fffbed;border:1px solid #8a9b91;border-radius:8px;box-shadow:0 4px 16px #0004;font:14px system-ui}#spoorScreen .spoor-note-popup[hidden]{display:none}#spoorScreen .spoor-note-popup textarea{display:block;width:100%;box-sizing:border-box;margin-top:6px;min-height:120px;font:16px/1.4 system-ui;resize:vertical}';document.head.append(notesStyle);
  const styleKey='3b-spoorscherm-stijlen-v1';
  try{const saved=JSON.parse(localStorage.getItem(styleKey)||'{}');for(const [id,value] of Object.entries(saved))if($(id)&&[...$(id).options].some(o=>o.value===value))$(id).value=value;}catch(_){}
  function symbols(tr,line){
    const row=working[line.key],arrow=SpoorScreenFormat.arrow(row.V,row.A,original.geometry,original.direction,$('spoorArrowStyle').value);
    for(const side of ['V','L','R','A']){const symbol=tr.querySelector('.spoor-symbol[data-side='+side+']');if(!symbol)continue;symbol.textContent=side==='L'?'↔':side==='R'?SpoorScreenFormat.contact(row.A?.band,original.direction,$('spoorContactStyle').value):arrow;const directions={'⇗':'noordoost','↗':'noordoost','⇘':'zuidoost','↘':'zuidoost','⇙':'zuidwest','↙':'zuidwest','⇖':'noordwest','↖':'noordwest','⇑':'noord','↑':'noord','⇓':'zuid','↓':'zuid','⇒':'oost','→':'oost','⇐':'west','←':'west'};const band=original.direction==='oost'?({west:'oost',oost:'west'}[row.A?.band]||row.A?.band):row.A?.band;
      const label=side==='L'?'Afstootlengte in centimeter':side==='R'?'Raakpunt met de '+band+'band':side+' · speelrichting '+(directions[arrow]||'onbekend');symbol.setAttribute('aria-label',label);symbol.title=label;}
  }
  function updateFramework(){
    if(!original)return;const lkl=original.selectedPattern==='LKL',section=$('lklFramework');section.hidden=!lkl;
    for(const tr of body.rows){const anchor=['neus','kop','romp'].includes(tr.dataset.line);tr.hidden=lkl&&frameworkOnly&&!anchor;tr.classList.toggle('lkl-karkas-anchor',lkl&&anchor);}
    if(!lkl)return;
    const lines=original.lines.map(line=>{const row=working[line.key],A={...row.A};let contactValid=true;try{SpoorGeometry.contact(row.V,A,original.geometry);}catch(_){contactValid=false;}if(A.inputMethod==='contact')try{const contact=SpoorGeometry.contact(row.V,A,original.geometry);A.contactCurrent=contact.band===A.manualContact?.band&&Math.abs(contact.value-A.manualContact.value)<1e-4;}catch(_){A.contactCurrent=false;}return {...line,V:row.V,A,contactValid};});
    const result=ThreeBLklKarkas.status(lines,original.userMustMeasure);section.dataset.complete=String(result.complete);$('lklFrameworkStatus').textContent=(result.complete?'Eigen meetbasis compleet':'Eigen meetbasis nog onvolledig')+' · '+result.count+'/3 meetlijnen ingebracht'+(dirty?' · nog niet bewaard':'');
    if(original.userMustMeasure){
      if(original.transferInfo){section.dataset.complete='true';$('lklFrameworkStatus').textContent='Afgeleid uit je gemeten '+original.transferInfo.baseTrack+' en Kruins meetserie'+(dirty?' · eigen aanvulling nog niet bewaard':'');}
      $('lklFrameworkStatus').textContent+=' · actief: '+original.activeSource;
      if(original.transferExpired)$('lklFrameworkStatus').textContent+=' · basis gewijzigd: bekijk de overdracht opnieuw';
    }
    $('lklTransferOffer').hidden=!original.canTransfer;$('reviewLklTransfer').disabled=dirty;

    $('lklFrameworkChecks').textContent=['neus','kop','romp'].map(key=>({neus:'Neus',kop:'Kop R of A',romp:'Rompmeting · met bekend kijkpunt A'}[key])+': '+(result.checks[key]?'ingebracht':'meting ontbreekt')).join(' · ');
    $('lklFrameworkUserRule').hidden=!original.userMustMeasure;if(original.userMustMeasure){$('lklFrameworkUserRule').textContent=original.transferExpired?'Je basis is gewijzigd. Open je basisspoor en beoordeel de overdracht opnieuw. Intussen blijft Kruin voor dit spoor actief.':original.transferInfo?'Dit spoor is afgeleid uit je eigen gemeten basis. Je kunt desgewenst extra eigen metingen toevoegen.':'Eerst je eigen metingen van alle drie. Tot die compleet zijn blijft de tafel Kruin tonen; je conceptmetingen worden apart bewaard.';if(original.transferInfo)$('lklFrameworkChecks').textContent='Eigen aanvullingen: '+result.count+'/3 meetlijnen. Aanvullen is optioneel.';}
    $('toggleFrameworkLines').textContent=frameworkOnly?'Alle lijnen tonen':'Alleen meetbasis tonen';
  }
  function provenance(tr,line){
    const row=working[line.key];for(const side of ['V','A']){const el=tr.querySelector('.spoor-value[data-side='+side+']');if(el)ThreeBValueOrigin.decorate(el,row[side]);}
    const r=tr.querySelector('.spoor-value[data-side=R]');if(r){let entered=row.A?.inputMethod==='contact'&&row.A.manualContact;try{const contact=SpoorGeometry.contact(row.V,row.A,original.geometry);if(entered&&(entered.band!==contact.band||Math.abs(entered.value-contact.value)>1e-4))entered=null;}catch(_){entered=null;}ThreeBValueOrigin.decorate(r,entered?{value:entered.value,source:'user'}:{value:r.value===''?null:0,status:'calculated'});}
  }
  function refresh(tr,line){
    const band=working[line.key].A?.band,shown=original.direction==='oost'?({west:'oost',oost:'west'}[band]||band):band,label=tr.querySelector('.spoor-arrival-band-label');if(label)label.textContent=shown||'';
    provenance(tr,line);const input=tr.querySelector('.spoor-value[data-side=R]');
    if(!input){symbols(tr,line);return;}
    try{input.value=SpoorScreenFormat.format(SpoorGeometry.contact(working[line.key].V,working[line.key].A,original.geometry).value);input.setCustomValidity('');}
    catch(error){input.value='';input.title=error.message;input.setCustomValidity('');}
    provenance(tr,line);symbols(tr,line);
  }
  function controls(td,line,side){
    const row=working[line.key],p=side==='L'?{value:row.lengthCm}:side==='R'?null:row[side];
    if(p?.kind==='acquit'){td.textContent='S'+(Number(p.offset)?(Number(p.offset)>0?'+':'')+p.offset:'');td.className='start';return;}
    const wrap=document.createElement('div');wrap.className='spoor-point';const symbol=document.createElement('span');symbol.className='spoor-symbol';symbol.dataset.side=side;symbol.setAttribute('role','img');
    const input=document.createElement('input');input.type='text';input.className='spoor-value';input.dataset.side=side;input.value=SpoorScreenFormat.format(p?.value);input.placeholder='·';input.autocomplete='off';input.spellcheck=false;input.disabled=Boolean(window.ThreeBDatabaseWorkspace?.required&&!window.ThreeBDatabaseWorkspace.active)||line.terminal||side==='L'&&!original.strokeLimits||side==='V'&&line.editableV===false||side==='A'&&line.editableA===false||side==='R'&&line.editableA===false;input.setAttribute('aria-label',side==='L'?'Neus afstootlengte in cm':line.label+' '+side+' waarde');
    if(p?.inputReference&&(p.band!==p.inputReference.band||Math.abs(p.value-p.inputReference.value)>.125)){input.title='Afgeleid uit karkas; opgeslagen meting '+SpoorScreenFormat.format(p.inputReference.value);input.classList.add('spoor-reference-diff');}
    if(side==='A'){const label=document.createElement('small');label.className='spoor-arrival-band-label';const band=row.A?.band;label.textContent=original.direction==='oost'?({west:'oost',oost:'west'}[band]||band):band;label.style.cssText='display:block;text-align:center;font:11px system-ui';td.append(label);if(['been','romp'].includes(line.key)&&!line.terminal){input.title=line.key==='been'?'Onder 20: Oost · boven 20: Noord. 20 is niet eenduidig.':'Getal behoudt de getoonde band. Band wijzigen: '+(original.direction==='oost'?'Oost':'West')+' 10 of Zuid 40.';}}
    wrap.append(input,symbol);if(side==='L'){const unit=document.createElement('small');unit.className='spoor-unit';unit.textContent='cm';wrap.append(unit);}td.prepend(wrap);
    input.oninput=()=>{
      try{
        const parsed=line.key==='romp'&&(side==='A'||side==='R')?SpoorScreenFormat.arrival(input.value,row.A?.band,original.direction):{value:SpoorScreenFormat.parse(input.value),band:row.A?.band};
        const value=parsed.value;let arrivalBand=parsed.band;
        if(line.key==='been'&&!line.terminal&&(side==='A'||side==='R')){
          const longBand=line.key==='been'?'oost':'west',shortBand=line.key==='been'?'noord':'zuid',shown=original.direction==='oost'?({west:'oost',oost:'west'}[longBand]||longBand):longBand;
          if(value===null||value<0||value>40||value===20)throw Error(line.label+': onder 20 = '+shown+', boven 20 = '+shortBand+' (tot 40). 20 is niet eenduidig.');
          arrivalBand=value<20?longBand:shortBand;
        }
        if(side==='L'){
          const limits=original.strokeLimits;if(value===null||!limits||value<limits.min-1e-6||value>limits.max+1e-6)throw Error('Lengte buiten bereik ('+Math.ceil(limits?.min||0)+'–'+Math.floor(limits?.max||0)+' cm).');row.lengthCm=value;row.changed.add('L');
        }else if(side==='R'){
          if(value===null)throw Error('Vul het raakpunt in, of kies Herlaad.');
          const r={band:arrivalBand,value},a=line.editableV===false&&row.startBall?SpoorGeometry.arrivalFromBall(row.startBall,r,original.geometry):SpoorGeometry.arrival(row.V,r,original.geometry);row.A={...row.A,...a,inputMethod:'contact',inputOwner:adapter.inputOwner?.()||'user',manualContact:{band:r.band,value:r.value}};row.changed.add('A');
          td.parentElement.querySelector('.spoor-value[data-side=A]').value=SpoorScreenFormat.format(a.value);
        }else{row[side]={...row[side],...(side==='A'?{band:arrivalBand,manualContact:null}:{}),value,source:'user',status:'edited',userAdjusted:true,inputMethod:'value',inputOwner:adapter.inputOwner?.()||'user'};row.changed.add(side);}
        if(line.editableV===false&&row.startBall&&(side==='A'||side==='R')){row.V={...row.V,...SpoorGeometry.departureFromBall(row.startBall,row.A,row.V.band,original.geometry)};td.parentElement.querySelector('.spoor-value[data-side=V]').value=SpoorScreenFormat.format(row.V.value);}
        input.setCustomValidity('');dirty=true;preview();if(side!=='R')refresh(td.parentElement,line);else{provenance(td.parentElement,line);symbols(td.parentElement,line);}text('Wijzigingen nog niet bewaard.');
      }catch(error){input.setCustomValidity(error.message);text(error.message,true);}
    };
    input.onblur=()=>{if(input.checkValidity()&&input.value!=='')input.value=SpoorScreenFormat.format(line.key==='romp'&&(side==='A'||side==='R')?SpoorScreenFormat.arrival(input.value,row.A?.band,original.direction).value:SpoorScreenFormat.parse(input.value));};
  }
  function changes(){const list=[];for(const [line,row] of Object.entries(working||{}))for(const side of row.changed)list.push({line,side,point:side==='N'?{value:row.note}:side==='L'?{value:row.lengthCm}:row[side]});return list;}
  function clearPreview(){previewing=true;try{adapter.clearPreview?.();}finally{previewing=false;}}
  function preview(){if(!adapter.preview)return;previewing=true;try{const updated=adapter.preview(original,changes());for(const line of updated.lines){const row=working[line.key],tr=[...body.rows].find(r=>r.dataset.line===line.key);row.startBall=line.startBall;for(const side of ['V','A']){if(!row.changed.has(side))row[side]=structuredClone(line[side]);const el=tr.querySelector('.spoor-value[data-side='+side+']');if(el&&document.activeElement!==el)el.value=SpoorScreenFormat.format(row[side]?.value);}refresh(tr,line);}updateFramework();}finally{previewing=false;}}
  function noteCell(tr,line){
    const td=document.createElement('td'),wrap=document.createElement('div'),button=document.createElement('button'),popup=document.createElement('div'),label=document.createElement('label'),input=document.createElement('textarea');td.className='spoor-note-cell';wrap.className='spoor-note';button.type='button';button.className='spoor-note-button';const first=document.createElement('span'),more=document.createElement('span');first.className='spoor-note-preview';more.className='spoor-note-more';more.textContent='…';more.setAttribute('aria-label','Meer regels');button.append(first,more);const updatePreview=value=>{first.textContent=value.split(/\r?\n/)[0]||'—';more.hidden=!/\r?\n/.test(value);button.title=value||'Opmerking toevoegen';};updatePreview(line.note||'');button.setAttribute('aria-label','Opmerking '+line.label);button.setAttribute('aria-expanded','false');popup.className='spoor-note-popup';popup.hidden=true;label.textContent='Opmerking · '+line.label;input.value=line.note||'';input.rows=5;input.setAttribute('aria-label','Opmerking bij '+line.label);label.append(input);popup.append(label);wrap.append(button,popup);td.append(wrap);tr.append(td);
    let pinned=false,skipFocus=false;
    const hide=(force=false)=>{if(!force&&(pinned||popup.contains(document.activeElement)))return;pinned=false;popup.hidden=true;button.setAttribute('aria-expanded','false');if(openNote?.popup===popup)openNote=null;if(force&&popup.contains(document.activeElement))document.activeElement.blur();};
    const show=()=>{if(openNote&&openNote.popup!==popup)openNote.close();openNote={popup,close:()=>hide(true)};popup.hidden=false;button.setAttribute('aria-expanded','true');const box=button.getBoundingClientRect();popup.style.left=Math.max(8,Math.min(innerWidth-316,box.right-300))+'px';popup.style.top=Math.max(8,Math.min(innerHeight-210,box.bottom+4))+'px';};
    wrap.onpointerenter=e=>{if(e.pointerType!=='touch')show();};wrap.onpointerleave=()=>hide();button.onfocus=()=>{if(!skipFocus)show();};button.onclick=()=>{pinned=!pinned;if(pinned){show();input.focus();}else{button.blur();input.blur();hide(true);}};input.onblur=()=>{if(!wrap.matches(':hover'))hide();};input.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide(true);skipFocus=true;button.focus();skipFocus=false;}};input.oninput=()=>{working[line.key].note=input.value;working[line.key].changed.add('N');updatePreview(input.value);dirty=true;text('Opmerking nog niet bewaard.');};
  }
  function load(direction=viewDirection){
    transferProposal=null;$('lklTransferReview').hidden=true;openNote?.close();openNote=null;clearPreview();syncConnectionControl();
    original=adapter.read(direction);viewDirection=original.direction;working={};dirty=false;body.replaceChildren();
    const comparison=$('spoorComparisonInfo');comparison.hidden=!window.THREEB_TEST_ENVIRONMENT;comparison.textContent=adapter.comparisonInfo?.()||'';comparison.title='Vergelijk deze tafelcode op desktop en telefoon. Bij verschillende codes zijn de getoonde tafelgegevens of instellingen niet gelijk.';
    $('spoorScreenTitle').textContent='Spoorscherm · '+original.label+' · '+(original.selectedPattern||original.actualPattern);$('mirrorSpoorScreen').checked=original.direction==='oost';$('spoorDirectionLabel').textContent=original.direction==='oost'?'Oost':'West';
    $('spoorMeasurementHint').textContent=(original.startError?original.startError+'. ':original.selectedPattern&&original.selectedPattern!=='LKL'?'Eerste drie banden: '+original.actualPattern+'. ':original.actualPattern!=='LKL'?'Dit spoor valt buiten LKL ('+original.actualPattern+'). ':'')+(original.direction==='oost'?'Eigen Oost-meting: apart bewaard; de West-meting blijft behouden.':'');
    const head=original.lines.find(line=>line.key==='kop')?.A;if(!head||head.value===null)$('spoorMeasurementHint').textContent+=' Kop A is nog niet gemeten; de tussenroute is onvolledig.';else if(head.source==='estimate')$('spoorMeasurementHint').textContent+=' Kop A is een schatting, geen meting.';
    $('spoorMeasurementHint').textContent+=original.selectedPattern==='LKL'?' Karkas LKL: Neus, Kop en Romp meten en inbrengen. Kop V is altijd berekend; Kop R of A is een meting. Zonder alle drie is dit nog een voorvertoning.':' Neus en Romp zijn leidend; Kop A is het meetanker. De tussenwaarden zijn afgeleid.';
    for(const line of original.lines){working[line.key]={V:structuredClone(line.V),A:structuredClone(line.A),note:line.note||'',lengthCm:line.key==='neus'?original.strokeLengthCm:null,startBall:line.startBall,changed:new Set()};const tr=document.createElement('tr');tr.dataset.line=line.key;
      const th=document.createElement('th');th.scope='row';th.textContent=line.label;tr.append(th);
      if(line.terminal){const small=document.createElement('span');small.className='terminal';small.textContent='Auto'+(line.fraction===.45?' · 45%':line.fraction===.5?' · ½':line.fraction===.25?' · ¼':'');th.append(small);}
      for(const side of ['V','R','A']){const td=document.createElement('td');if(line.terminal)td.className='automatic';controls(td,line,side);tr.append(td);}noteCell(tr,line);body.append(tr);refresh(tr,line);
    }
    const refs=original.lines.flatMap(line=>['V','A'].filter(side=>line[side]?.inputReference&&Math.abs(line[side].value-line[side].inputReference.value)>.125).map(side=>line.label+' '+side+': opgeslagen '+SpoorScreenFormat.format(line[side].inputReference.value)+', uit karkas '+SpoorScreenFormat.format(line[side].value)));if(refs.length)$('spoorMeasurementHint').textContent+=' Tussenmetingen bewaard als referentie: '+refs.join('; ')+'.';
    updateFramework();
    dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');text(window.ThreeBDatabaseWorkspace?.required?(window.ThreeBDatabaseWorkspace.active?(window.ThreeBDatabaseWorkspace.remote?(window.ThreeBGitHub.connected?'':'Verbind met GitHub om te bewaren.'):'Lokale back-up · nog niet met GitHub verbonden.'):'Open eerst een SQLite-werkdatabase om je spoor te bewaren.'):window.THREEB_TEST_ENVIRONMENT?'TEST · bewaren in aparte browseropslag.':'Bewaar spoor om je wijzigingen vast te leggen.');
  }
  for(const id of ['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'])$(id).onchange=()=>{localStorage.setItem(styleKey,JSON.stringify(Object.fromEntries(['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'].map(id=>[id,$(id).value]))));dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');for(const tr of body.rows)symbols(tr,original.lines.find(l=>l.key===tr.dataset.line));};
  let position;
  function place(next){const box=dialog.getBoundingClientRect();const left=Math.max(48-box.width,Math.min(innerWidth-48,next.left)),top=Math.max(-18,Math.min(innerHeight-32,next.top));position={left,top};dialog.style.left=left+'px';dialog.style.top=top+'px';}
  function recenter(){const box=dialog.getBoundingClientRect();place({left:(innerWidth-box.width)/2,top:Math.max(8,(innerHeight-box.height)/2)});}
  function open(options={}){
    if(dialog.open&&dirty){text('Bewaar of herlaad voordat je een andere lijn kiest.',true);return;}
    frameworkOnly=Boolean(options.framework||options.line==='romp');load();if(!dialog.open)dialog.show();
    if(options.recenter||!position)recenter();else place(position);
    if(options.line){const row=[...body.rows].find(row=>row.dataset.line===options.line);row?.classList.add('selected-line');}
    document.querySelector('#closeSelectionMenu')?.click();document.querySelector('#closeOwnerMenu')?.click();
  }
  window.openThreeBSpoorScreen=open;button.onclick=()=>open({recenter:true});
  $('positionSpoorScreen').onclick=recenter;
  function fitExpandedConfig(){requestAnimationFrame(()=>{if(!dialog.open)return;const box=dialog.getBoundingClientRect();if(box.top>=0&&box.bottom>innerHeight-8)place({left:box.left,top:Math.max(8,innerHeight-box.height-8)});});}
  function showConfig(){const config=$('spoorStyleConfig');config.open=true;fitExpandedConfig();config.scrollIntoView({block:'nearest'});$('showTableAcquits').focus({preventScroll:true});}
  $('configSpoorScreen').onclick=showConfig;
  $('spoorStyleConfig').ontoggle=()=>{ $('configSpoorScreen').setAttribute('aria-expanded',String($('spoorStyleConfig').open));if($('spoorStyleConfig').open)fitExpandedConfig(); };
  const courseActions=document.querySelector('#explanationCarousel .course-header-actions');if(courseActions){const measure=document.createElement('button');measure.type='button';measure.id='courseLklFramework';measure.textContent='Latere meetles · mijn Kop A';measure.onclick=()=>{if(dirty){text('Bewaar of herlaad eerst je meetinvoer.',true);return;}document.getElementById('closeExplanation')?.click();adapter.prepareLklCourse?.();open({framework:true,recenter:true});};courseActions.prepend(measure);const config=document.createElement('button');config.type='button';config.id='courseSpoorConfig';config.textContent='⚙ Config';config.onclick=()=>{open({recenter:true});showConfig();};courseActions.prepend(config);}

  window.installThreeBLklLesson?.(adapter);
  const course=document.querySelector('#explanationCarousel');
  if(course&&!document.getElementById('courseAcquitMotivation')){
    const motivation=document.createElement('p');motivation.id='courseAcquitMotivation';
    motivation.textContent="We nemen het benedenacquit als vaste basis voor de naamgeving. Vanuit het midden- of bovenacquit spelen blijft mogelijk, ook met parallelsporen; die vertrekpunten kunnen praktisch handig zijn. We hebben al spoornamen, zoals VIJF en ZES, en parallelstanden, zoals VIJF+2. Extra vertrekletters met alternatieve spoornamen voegen voor deze instructie weinig toe, maar vragen telkens een vertaling. Die beperkte meerwaarde weegt niet op tegen de afleiding en verwarring. Daarom gebruiken we de bestaande spoor- en +/−-notatie. Andere acquits blijven bruikbare oriëntatie- en vertrekpunten, zonder een afzonderlijk naamstelsel. Parallel en waaier behouden hun eigen werking. Het gemeten karkas en de aanvullende Kop-meting blijven leidend.";
    motivation.style.cssText='margin:8px 12px;line-height:1.45;max-width:70ch';
    const assessment=document.getElementById('courseAssessment');
    if(assessment?.parentElement)assessment.before(motivation);else course.append(motivation);
  }

  const header=dialog.querySelector('header');header.onpointerdown=event=>{
    if(event.button!==0||event.target.closest('button,input,select'))return;
    event.preventDefault();const box=dialog.getBoundingClientRect(),x=event.clientX,y=event.clientY;header.setPointerCapture(event.pointerId);
    const move=e=>{if(e.pointerId===event.pointerId)place({left:box.left+e.clientX-x,top:box.top+e.clientY-y});};
    const end=e=>{if(e.pointerId!==event.pointerId)return;header.removeEventListener('pointermove',move);header.removeEventListener('pointerup',end);header.removeEventListener('pointercancel',end);};
    header.addEventListener('pointermove',move);header.addEventListener('pointerup',end);header.addEventListener('pointercancel',end);
  };
  window.addEventListener('resize',()=>{if(dialog.open&&position)place(position);});
  window.addEventListener('threeb-spoor-state',()=>{if(!dialog.open||saving||previewing)return;if(dirty){text('Tafel gewijzigd; bewaar of herlaad vóór verdere edits.',true);return;}load();});
  $('mirrorSpoorScreen').onchange=()=>{if(saving||dirty){$('mirrorSpoorScreen').checked=original.direction==='oost';text('Bewaar of herlaad voordat je spiegelt.',true);return;}load($('mirrorSpoorScreen').checked?'oost':'west');};
  function close(){if(saving)return;if(dirty&&!confirm('Niet-bewaarde spoorwijzigingen verwerpen en sluiten?'))return;dirty=false;openNote?.close();dialog.close();clearPreview();}
  $('closeSpoorScreen').onclick=close;dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}});dialog.addEventListener('cancel',e=>{e.preventDefault();close();});$('reloadSpoorScreen').onclick=()=>{if(!saving)load();};
  window.hasThreeBSpoorChanges=()=>dirty||saving;
  $('saveSpoorScreen').onclick=async()=>{
    if(saving)return;if(window.ThreeBDatabaseWorkspace?.required&&!window.ThreeBDatabaseWorkspace.active){text('Open eerst je SQLite-werkdatabase via Open werkdatabase. Daarna bewaart Bewaar spoor in die database.',true);return;}for(const input of dialog.querySelectorAll('.spoor-value'))if(!input.reportValidity())return;if(!dirty&&!window.ThreeBDatabaseWorkspace?.active){text('Geen gewijzigde waarden.');return;}
    const edits=changes();clearPreview();
    saving=true;for(const el of dialog.querySelectorAll('input,textarea,select,button'))el.disabled=true;text('Bewaren…');
    try{await adapter.save(original,edits);load();text(adapter.lastSaveMessage?.()||(window.ThreeBDatabaseWorkspace?.active?(window.ThreeBDatabaseWorkspace.remote?window.ThreeBDatabaseWorkspace.saveMessage:'Spoor bewaard in SQLite · lokale back-up; niet op GitHub.'):original.direction==='oost'?'Oost-meting apart bewaard in deze browser.':window.THREEB_TEST_ENVIRONMENT?'Spoor bewaard in de testbrowser.':'Spoor bewaard.'));}
    catch(error){preview();text(error.message,true);if(window.ThreeBDatabaseWorkspace?.remote&&!window.ThreeBGitHub.connected)window.ThreeBDatabaseWorkspace.showConnection();}
    finally{saving=false;for(const el of dialog.querySelectorAll('button,textarea,select,#mirrorSpoorScreen'))el.disabled=false;if(dirty)for(const tr of body.rows)if(!original.lines.find(l=>l.key===tr.dataset.line).terminal)for(const el of tr.querySelectorAll('input'))el.disabled=false;}
  };
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  if(window.THREEB_TEST_ENVIRONMENT&&document.getElementById('databaseWorkspace')){
    const sidebar=document.createElement('aside');sidebar.id='desktopWorkbench';sidebar.setAttribute('aria-label','Kruin configureren');
    const quick=document.createElement('button');quick.id='desktopOpenSpoor';quick.type='button';quick.textContent='Spoorscherm · V / R / A';quick.onclick=()=>open({recenter:true});
    document.body.append(sidebar);
    const nodes=[document.getElementById('databaseWorkspace'),document.getElementById('bandDock'),document.getElementById('mobilePreview'),document.querySelector('.onscreen-control-menuPanel')].filter(Boolean),anchors=nodes.map(node=>{const anchor=document.createComment('workbench-original-position');node.before(anchor);return anchor;});
    const dock=document.getElementById('bandDock');const grip=dock?.querySelector('.band-drag-handle');if(grip)grip.textContent='⋮⋮ Verplaats menu';
    dock?.addEventListener('pointerdown',event=>{
      if(!document.body.classList.contains('test-desktop-workbench')||event.button!==0||!event.target.closest('.band-drag-handle'))return;
      if(!dock.classList.contains('workbench-menu-floating')){const box=dock.getBoundingClientRect();dock.classList.add('workbench-menu-floating');document.body.append(dock);dock.style.left=box.left+'px';dock.style.top=box.top+'px';adapter.setDockPosition?.(box.left,box.top);adapter.floatDock?.();}
    },true);
    let previous=null;
    const layout=()=>{const desktop=innerWidth>=1000&&!matchMedia('(pointer:coarse)').matches;document.body.classList.toggle('test-desktop-workbench',desktop);if(desktop===previous)return;previous=desktop;
      if(desktop){sidebar.append(nodes[0]);if(dock){if(adapter.dockFloating?.()){dock.classList.add('workbench-menu-floating');document.body.append(dock);const saved=adapter.dockPosition?.();if(saved)adapter.setDockPosition(saved.x*innerWidth,saved.y*innerHeight);}else{dock.classList.remove('workbench-menu-floating');sidebar.append(dock);}}sidebar.append(quick);for(const node of nodes.slice(2))sidebar.append(node);}else{nodes.forEach((node,i)=>{node.classList.remove('workbench-menu-floating');anchors[i].after(node);});quick.remove();}
      requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
    };
    window.addEventListener('resize',layout);layout();
  }

  window.installThreeBCleanConfig?.();

};
