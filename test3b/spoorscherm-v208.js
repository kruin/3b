window.THREEB_RELEASE=Object.freeze({"version": "v208-r26", "date": "2026-10-30", "channel": "test", "compatibilityBase": "v208-r15"});
window.THREEB_DB_SOURCE=Object.freeze({"fingerprint": "d5d6ae4d05f9e7fe32d327af82b7199ca034381d9b3cb3b350984c2d62cbe2ca", "version": "v208-r26", "date": "2026-10-30"});
/* Physical phone testing: show the project's published QR, without changing app state. */
if(typeof window!=='undefined'){
  window.installMobileTestQr=function({button,imageUrl,testUrl,qrPageUrl}){
    if(!button)return;
    let dialog=document.getElementById('mobileQrDialog');
    if(!dialog){
      const style=document.createElement('style');style.textContent='#mobileQrDialog{width:min(94vw,440px);max-height:92dvh;box-sizing:border-box;overflow:auto;padding:16px;border:1px solid #82958b;border-radius:12px;background:#fff;color:#142e24;font:16px system-ui;text-align:center}#mobileQrDialog::backdrop{background:#0006}#mobileQrDialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}#mobileQrDialog h2{font:700 20px system-ui;margin:0}#mobileQrDialog button{min-width:44px;min-height:44px;font:20px system-ui;color:#142e24;background:#f1f5f2;border:1px solid #82958b;border-radius:6px}#mobileQrDialog img{display:block;width:100%;height:auto;max-width:410px;margin:12px auto;background:#fff}#mobileQrDialog p{font:14px/1.4 system-ui;margin:10px 0}#mobileQrDialog a{color:#1552a0;text-decoration:underline}';document.head.append(style);
      dialog=document.createElement('dialog');dialog.id='mobileQrDialog';dialog.setAttribute('aria-labelledby','mobileQrTitle');
      const header=document.createElement('header'),title=document.createElement('h2'),close=document.createElement('button');title.id='mobileQrTitle';title.textContent='Test op je telefoon';close.type='button';close.textContent='×';close.setAttribute('aria-label','QR sluiten');close.onclick=()=>dialog.close();header.append(title,close);
      const img=document.createElement('img');img.src=imageUrl;img.alt='QR-code om dit project op je telefoon te openen';
      const instruction=document.createElement('p');instruction.textContent='Scan met de camera van je telefoon. Test staand én liggend.';
      const links=document.createElement('p'),large=document.createElement('a'),open=document.createElement('a');large.href=qrPageUrl;large.textContent='QR groot openen';large.target='_blank';large.rel='noopener';open.href=testUrl;open.textContent='Open de site';open.target='_blank';open.rel='noopener';links.append(large,document.createTextNode(' · '),open);
      const note=document.createElement('p');note.textContent='De QR opent de site; eigen gegevens en instellingen worden niet automatisch overgenomen.';
      dialog.append(header,instruction,img,links,note);document.body.append(dialog);
    }
    button.textContent='QR · Test op telefoon';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','mobileQrDialog');button.onclick=()=>{if(!dialog.open)dialog.showModal();};
  };
  const script=document.currentScript;
  if(script?.dataset.testUrl){
    const setup=()=>{const button=document.createElement('button');button.id='openMobileQr';button.type='button';button.style.cssText='position:fixed;right:12px;top:12px;z-index:3000;min-height:44px;padding:8px 14px;border:1px solid #82958b;border-radius:8px;background:white;color:#142e24;font:700 15px system-ui';document.body.append(button);window.installMobileTestQr({button,imageUrl:new URL(script.dataset.qrImage,script.src).href,testUrl:script.dataset.testUrl,qrPageUrl:new URL(script.dataset.qrPage,script.src).href});};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
  }
}

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
  function originStatus(){const badge=document.getElementById('databaseOriginBadge');if(!badge)return;const ref=window.THREEB_DB_SOURCE;if(!record){badge.textContent='Nog geen database gekozen';badge.style.background='#e4ece5';return;}const same=contentFingerprint&&contentFingerprint===ref?.fingerprint;badge.textContent=same?'GitHub-bron · ongewijzigde werkkopie — upload niet nodig':record.savedAt?'Lokale wijzigingen · GitHub niet gecontroleerd':'Andere databaseversie · GitHub niet gecontroleerd';badge.style.background=same?'#dcefe0':'#fff0c2';badge.title='Vergelijking met de bron bij bouwen van '+(ref?.version||'de testversie')+' ('+(ref?.date||'')+'). Geen live GitHub-controle. Bron: '+(ref?.fingerprint||'onbekend')+'; werkdatabase: '+(contentFingerprint||'onbekend');const detail=document.getElementById('databaseOriginDetail');if(detail)detail.textContent='Bron bij '+(ref?.version||'deze testversie')+': '+(ref?.fingerprint?.slice(0,12)||'onbekend')+' · geen live GitHub-controle. Bewaren op dit apparaat is geen upload.';}
  function notify(message){const node=document.getElementById('databaseWorkspaceStatus');if(node)node.textContent=message;originStatus();window.dispatchEvent(new Event('threeb-database-state'));}
  async function restore(){if(!enabled())return;try{record=await get();if(record){const SQL=await ready();db=new SQL.Database(new Uint8Array(record.bytes));validate();contentFingerprint=await fingerprint();window.THREEB_KRUIN_VALUES=await source();}}catch(e){db?.close();db=null;record=null;window.ThreeBDatabaseWorkspace.error=e.message;}document.body.classList.toggle('database-not-open',!record);document.body.classList.toggle('database-workspace',Boolean(record));if(!record)window.THREEB_KRUIN_VALUES=null;mount();}
  async function open(file){if(window.hasThreeBSpoorChanges?.())throw Error('Bewaar je spoorwijzigingen of kies Herlaad voordat je een database opent.');if(busy)return;busy=true;const old=db,oldRecord=record;try{const bytes=new Uint8Array(await file.arrayBuffer());if(bytes.byteLength>32*1024*1024)throw Error('Database is groter dan 32 MB.');const SQL=await ready();db=new SQL.Database(bytes);validate();record={bytes,name:file.name,openedAt:new Date().toISOString(),backupState:oldRecord?oldRecord.backupState:localStorage.getItem(key),backupSession:oldRecord?.backupSession??Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)).filter(k=>k.includes('experiment:')).map(k=>[k,sessionStorage.getItem(k)])};await source();await put(record,oldRecord);for(const k of Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)))if(k.includes('experiment:'))sessionStorage.removeItem(k);localStorage.removeItem(key);location.reload();}catch(e){if(db!==old)db?.close();db=old;record=oldRecord;notify(e.message);throw e;}finally{busy=false;}}
  function download(bytes,name){const url=URL.createObjectURL(new Blob([bytes],{type:'application/vnd.sqlite3'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  function putPoint(basis,table,track,line,side,p){
    const extra=Object.fromEntries(Object.entries(p).filter(([k])=>!Object.hasOwn(fields,k)));const values=[basis,table,track,line,side,p.band??null,p.kind==='acquit'?null:p.value??null,p.kind==='acquit'?String(p.value):null,p.kind??null,p.status??null,p.source??null,p.userAdjusted===undefined?null:Number(p.userAdjusted),p.measurement===undefined?null:Number(p.measurement),p.calculationBasis??null,0,JSON.stringify(extra)];
    db.run('INSERT INTO lijnpunten VALUES('+values.map(()=>'?').join(',')+') ON CONFLICT(basis_id,tafel,spoor,lijn,kant) DO UPDATE SET band=excluded.band,waarde=excluded.waarde,start=excluded.start,kind=excluded.kind,status=excluded.status,herkomst=excluded.herkomst,bewerkt=excluded.bewerkt,meting=excluded.meting,berekenbasis=excluded.berekenbasis,is_null=excluded.is_null,extra_json=excluded.extra_json',values);
  }
  async function commit({table,track,routeKey,route,length,changes,notes}){
    if(!db||!record)throw Error('Open eerst je SQLite-werkdatabase via Open werkdatabase.');if(busy)throw Error('Database wordt al bijgewerkt.');busy=true;const before=db.export(),oldRecord=record,oldFingerprint=contentFingerprint;
    try{const basis=setting('standaard_basis');db.run('BEGIN');const trackRow=rows('SELECT * FROM sporen WHERE basis_id=? AND tafel=? AND spoor=?',[basis,table,track])[0];if(!trackRow)throw Error('Dit spoor ontbreekt in de database.');const extra=JSON.parse(trackRow.extra_json);
      for(const change of changes){if(change.side==='L'||change.side==='N')continue;const side=change.side==='V'?'V':'A';if(!parts.includes(change.line)||!bands.includes(change.point.band)||change.point.value!==null&&!Number.isFinite(change.point.value))throw Error('Ongeldig gemeten punt.');if(!routeKey.endsWith(':oost')){putPoint(basis,table,track,change.line,side,route[change.line][side==='V'?'from':'to']);if(extra.lineApprovals?.[change.line])extra.lineApprovals[change.line]=false;}}
      db.run('UPDATE sporen SET extra_json=? WHERE basis_id=? AND tafel=? AND spoor=?',[JSON.stringify(extra),basis,table,track]);
      for(const [name,value] of [['startAcquitRoutes',route],['startAcquitLengths',length]]){if(value===undefined)continue;const saved=JSON.parse(setting(name+':'+basis)||'{}');saved[routeKey]=value;db.run('INSERT OR REPLACE INTO instellingen(sleutel,waarde) VALUES(?,?)',[name+':'+basis,JSON.stringify(saved)]);}
      if(notes&&Object.keys(notes).length){const all=JSON.parse(setting('spoorLineNotes:'+basis)||'{}');all[routeKey]={...all[routeKey],...notes};db.run('INSERT OR REPLACE INTO instellingen(sleutel,waarde) VALUES(?,?)',['spoorLineNotes:'+basis,JSON.stringify(all)]);}
      if(rows('PRAGMA foreign_key_check').length)throw Error('Opslag bevat ongeldige verwijzingen.');db.run('COMMIT');record={...record,bytes:db.export(),savedAt:new Date().toISOString()};contentFingerprint=await fingerprint();await put(record);notify('SQLite-werkdatabase bijgewerkt op dit apparaat. Kies Bewaar db lokaal voor een bestand.');
    }catch(e){try{db.run('ROLLBACK');}catch(_){}db.close();const SQL=await ready();db=new SQL.Database(before);record=oldRecord;contentFingerprint=oldFingerprint;validate();originStatus();throw e;}finally{busy=false;}
  }
  async function close(){if(window.hasThreeBSpoorChanges?.())throw Error('Bewaar je spoorwijzigingen of kies Herlaad voordat je het werkbestand sluit.');if(!record)return;const old=record;await put(null,old);old.backupState===null?localStorage.removeItem(key):localStorage.setItem(key,old.backupState);for(const k of Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)))if(k.includes('experiment:'))sessionStorage.removeItem(k);for(const [k,v] of old.backupSession||[])sessionStorage.setItem(k,v);location.reload();}
  function mount(){if(!enabled()||!document.body||document.getElementById('databaseWorkspace'))return;const style=document.createElement('style');style.textContent='body.database-workspace .table-file-tools{display:none!important}body.database-not-open{background:#eee9f7!important;min-height:100dvh}body.database-not-open> :not(#databaseWorkspace):not(#testEnvironmentBanner):not(#mobileQrDialog){display:none!important}body.database-not-open #databaseWorkspace{position:fixed!important;top:90px;left:50%;transform:translateX(-50%);width:min(520px,calc(100vw - 24px))!important;max-height:calc(100dvh - 110px);overflow:auto;margin:0!important;line-height:1.5;font:15px system-ui!important}body.database-not-open #testEnvironmentBanner{background:#4e347a!important;color:white!important;font:600 14px system-ui!important;padding:12px!important;text-align:center}body.database-not-open #testEnvironmentBanner a{color:white}body.database-not-open .db-workfile-actions{display:none}#databaseStartQr{width:100%;min-height:40px;margin-top:12px}.db-workfile-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:stretch;margin:12px 0}.db-workfile-actions button,.db-workfile-actions a{box-sizing:border-box;min-height:40px;margin:0!important}.db-workfile-actions a{display:flex;align-items:center;justify-content:center;padding:6px 8px;border:1px solid #b9accc;border-radius:8px;background:#fff;color:#142e24;text-align:center;text-decoration:none}.db-workfile-actions #closeDatabaseWorkspace{grid-column:1/-1}@media(max-width:999px),(pointer:coarse){body.database-workspace #databaseWorkspace{display:none;position:fixed!important;top:calc(var(--threeb-test-banner-height,48px) + 60px)!important;left:8px!important;right:8px!important;width:auto!important;max-width:none!important;max-height:calc(100dvh - var(--threeb-test-banner-height,48px) - 76px);overflow:auto;z-index:4000;margin:0!important;font:16px system-ui!important}body.database-workspace.database-panel-open #databaseWorkspace{display:block}#databaseMobileToggle{position:fixed;top:calc(var(--threeb-test-banner-height,48px) + 8px);left:8px;z-index:4001;min-height:44px;padding:8px 12px;border:1px solid #8064a6;border-radius:8px;background:#f4effc;color:#142e24;font:600 15px system-ui}#databaseWorkspace input[type=file]{min-height:48px;width:100%;font:16px system-ui}#databaseWorkspace summary{min-height:44px;cursor:pointer}#databaseWorkspace .db-workfile-actions{grid-template-columns:1fr}body.database-not-open #databaseWorkspace{top:70px!important;left:50%!important;right:auto!important;max-height:calc(100dvh - 86px)}}@media(min-width:1000px) and (pointer:fine){#databaseMobileToggle{display:none}}';document.head.append(style);const panel=document.createElement('section');panel.id='databaseWorkspace';panel.style.cssText='position:relative;margin:8px 8px 8px auto;width:360px;max-width:calc(100vw - 16px);box-sizing:border-box;padding:10px;border:1px solid #8064a6;border-radius:8px;background:#f4effc;color:#142e24;font:14px system-ui';panel.innerHTML='<details open><summary><strong>Kruin · database configureren</strong></summary><p>Eenmalig: kies je bestaande <strong>Kruinconfig.sqlite3</strong>. Daarna opent deze browser je werkdatabase automatisch, ook bij een nieuwe testversie.</p><label><strong>Kies mijn database en start</strong><input id="openDatabaseWorkspace" type="file" style="display:block;max-width:100%"></label><details class="db-source-help"><summary>Nog geen database op dit apparaat?</summary><p>Haal alleen dan de centrale database op. Kies het gedownloade bestand hierboven.</p><a href="https://github.com/kruin/3b-kruin-beheer/blob/main/Kruinconfig.sqlite3" target="_blank" rel="noopener noreferrer">Centrale database downloaden (GitHub)</a></details><div class="db-workfile-actions"><button id="downloadDatabaseWorkspace" type="button">Bewaar db lokaal</button> <a id="uploadDatabaseWorkspace" href="https://github.com/kruin/3b-kruin-beheer/upload/main" target="_blank" rel="noopener noreferrer">Werkdatabase uploaden</a> <button id="closeDatabaseWorkspace" type="button">Sluit werkbestand</button></div><p id="databaseOriginBadge" role="status" style="padding:10px;border-radius:6px;font-weight:700;line-height:1.4"></p><small id="databaseOriginDetail"></small><p id="databaseWorkspaceStatus" role="status"></p><small>Werkbestand blijft lokaal tot je uploadt. Productie bijwerken blijft een aparte opdracht.</small></details>';(document.getElementById('testEnvironmentBanner')||document.body.firstChild)?.after(panel);const transfer=document.getElementById('testTransfer');if(transfer)transfer.hidden=true;document.getElementById('openDatabaseWorkspace').onchange=e=>{const file=e.target.files[0];if(file)open(file).catch(()=>{});};document.getElementById('downloadDatabaseWorkspace').onclick=()=>download(record.bytes,'Kruinconfig.sqlite3');document.getElementById('closeDatabaseWorkspace').onclick=()=>close().catch(e=>notify(e.message));for(const id of ['downloadDatabaseWorkspace','closeDatabaseWorkspace'])document.getElementById(id).disabled=!record;if(record){const toggle=document.createElement('button');toggle.id='databaseMobileToggle';toggle.type='button';toggle.textContent='Database';toggle.setAttribute('aria-controls','databaseWorkspace');toggle.setAttribute('aria-expanded','false');toggle.onclick=()=>{const shown=document.body.classList.toggle('database-panel-open');toggle.setAttribute('aria-expanded',String(shown));toggle.textContent=shown?'Paneel sluiten':'Database';};panel.after(toggle);}if(record){panel.querySelector('details>p').textContent='Je werkdatabase is automatisch geopend. Bewerk de tafel en kies Bewaar spoor. Kies Bewaar db lokaal voor een reservekopie; upload apart naar GitHub.';panel.querySelector('label strong').textContent='Andere werkdatabase openen';}if(!record){const version=window.THREEB_RELEASE?.version||'';const banner=document.getElementById('testEnvironmentBanner');if(banner?.firstChild?.nodeType===3)banner.firstChild.textContent='TEST '+version+' · Open je SQLite-werkdatabase ';document.title='TEST · '+version+' · Database openen';const qr=document.createElement('button');qr.id='databaseStartQr';qr.type='button';qr.textContent='QR · Test op telefoon';panel.append(qr);window.installMobileTestQr?.({button:qr,imageUrl:new URL('qr-test-neus.png?v='+version,location.href).href,testUrl:'https://kruin.github.io/3b/test3b/?v='+version+'#owner=kruin',qrPageUrl:new URL('qr.html?v='+version,location.href).href});}notify(window.ThreeBDatabaseWorkspace.error||(record?'Werkdatabase: '+record.name:'Kies een bestand; opnieuw downloaden is niet nodig als je het al hebt.'));}
  window.ThreeBDatabaseWorkspace={restore,open,commit,get active(){return Boolean(db&&record);},get required(){return enabled();},get sourceStatus(){return !record?'Geen werkdatabase':contentFingerprint===window.THREEB_DB_SOURCE?.fingerprint?'GitHub-bron ongewijzigd':record.savedAt?'Lokaal gewijzigd':'Andere databaseversie';},mount};
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
  return {format,parse,arrow,contact};
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
      #desktopOpenSpoor{min-height:44px;background:#176f4f;color:white;border:0;border-radius:7px;font:700 15px system-ui;flex-shrink:0}
      body.test-desktop-workbench .drawing{position:fixed!important;inset:var(--threeb-test-banner-height,48px) calc(var(--test-workbench-width) + 24px) 0 0!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;max-width:none!important;max-height:none!important;border:0!important;border-radius:0!important;overflow:hidden}
      body.test-desktop-workbench .drawing>.drawing-heading{position:absolute!important;inset:0 0 auto!important}
      body.test-desktop-workbench #svgMount{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:100%!important}
      body.test-desktop-workbench .onscreen-layout{height:100%!important;max-height:100%!important}
      body.test-desktop-workbench.course-open #desktopWorkbench,body.customer-preview #desktopWorkbench,body.course-open #bandDock.workbench-menu-floating,body.customer-preview #bandDock.workbench-menu-floating{visibility:hidden;pointer-events:none}

    `;document.head.append(style);}
  }

  const releaseVersion=window.THREEB_RELEASE?.version||'onbekend';
  window.installMobileTestQr?.({button:document.getElementById('mobilePreview'),imageUrl:new URL('qr-test-neus.png?v='+releaseVersion,location.href).href,testUrl:'https://kruin.github.io/3b/test3b/?v='+releaseVersion+'#owner=kruin',qrPageUrl:new URL('qr.html',location.href).href});
  const markTestVersion=()=>{
    const banner=document.querySelector('#testEnvironmentBanner');if(!banner)return;
    if(!document.getElementById('spoorTestVersion')){const version=document.createElement('span');version.id='spoorTestVersion';version.textContent='TEST '+releaseVersion;banner.prepend(version);}
    document.title='TEST · 3B '+releaseVersion;
    const description=[...banner.childNodes].find(n=>n.nodeType===3);
    if(description)description.textContent=window.ThreeBDatabaseWorkspace?.active?' · DB: '+window.ThreeBDatabaseWorkspace.sourceStatus+' · productie apart ':' · Kruin configureren · open een SQLite-werkbestand ';
    document.documentElement.style.setProperty('--threeb-test-banner-height',banner.offsetHeight+'px');
  };
  markTestVersion();window.addEventListener('DOMContentLoaded',markTestVersion,{once:true});window.addEventListener('resize',markTestVersion);window.addEventListener('threeb-database-state',markTestVersion);

  if(document.getElementById('openSpoorscherm'))return;
  const css=document.createElement('style');css.textContent=`
  body:has(#explanationCarousel:not([hidden])) #testTransfer,body:has(#spoorScreen[open]) #testTransfer{display:none}
  .spoor-origin-options [hidden]{display:none!important}
  .spoor-reference-diff{border-color:#a36b00!important;background:#fff3d4!important}.spoor-origin-options{display:flex;gap:4px;width:100%}.spoor-origin-options button{flex:1;min-height:44px;min-width:0;padding:5px 4px;border:1px solid #8a9b91;border-radius:5px;background:#f7f5ed;color:#142e24;font:600 13px system-ui;touch-action:manipulation}#spoorScreen .spoor-origin-options button{min-height:44px}.spoor-origin-options button.active{background:#176f4f!important;color:#fff!important;border-color:#0d4934}.spoor-start-setting{grid-column:1/-1;display:grid;gap:4px}#centralStartAcquit[hidden],#spoorStart[hidden]{display:none!important}
  [data-start-acquit="true"]{pointer-events:auto;cursor:pointer}#centralStartAcquitControl{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;padding:5px 8px;background:#f7f5ed;color:#142e24;border:1px solid #8a9b91;border-radius:6px;font:600 13px system-ui}#spoorScreen .spoor-start-cycle{font:inherit;padding:0 3px;background:transparent;border:0;color:inherit;min-width:0;width:100%;touch-action:manipulation}#startAcquitCycle{font:800 16px system-ui;padding:2px 8px;min-height:32px;touch-action:manipulation}#startAcquitPatternStatus{flex-basis:100%;text-align:center;font-size:12px}#centralStartAcquitControl{flex-wrap:wrap}#centralStartAcquit{min-height:32px;max-width:65%;font:inherit} #spoorScreen{position:fixed;inset:auto;margin:0;z-index:4100;box-shadow:0 8px 30px #0005;width:min(96vw,520px);max-height:94dvh;overflow:auto;padding:12px;border:1px solid #8a9b91;border-radius:10px;background:#f7f5ed;color:#142e24;font:15px system-ui;box-sizing:border-box;--spoor-symbol-size:32px}
  body.spoor-editor-only #lineEditor,body.spoor-editor-only #ballNudgePanel,body.spoor-editor-only .workspace>.editor,body.spoor-editor-only .ball-value-window,body.spoor-editor-only #toggleConfig{display:none!important}#spoorScreen>header{cursor:grab;touch-action:none;user-select:none}#spoorScreen>header:active{cursor:grabbing}#spoorScreen header,#spoorScreen footer{display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap}#spoorScreen h2{font-size:18px;margin:0}
  #spoorScreen table{width:100%;table-layout:fixed;border-collapse:collapse;background:#fff}#spoorScreen th,#spoorScreen td{padding:6px 3px;border-bottom:1px solid #d8dfd8;text-align:left}#spoorScreen thead th{font-size:14px;text-align:center;background:#e4ece5}#spoorScreen th:first-child{width:19%;white-space:nowrap}#spoorScreen td{width:27%}#spoorScreen tbody th{font-size:13px;text-transform:none;letter-spacing:0}#spoorScreen .spoor-point{position:relative;display:flex;align-items:center;white-space:nowrap;isolation:isolate}
  #spoorScreen .spoor-symbol{position:absolute;right:4px;top:50%;transform:translateY(-50%);z-index:0;opacity:.24;pointer-events:none;font-family:'Noto Sans Symbols 2','DejaVu Sans',sans-serif;font-size:var(--spoor-symbol-size);font-weight:800;line-height:1.25;min-width:1.1em;text-align:center;color:#123e2c;font-style:normal;-webkit-text-stroke:.25px currentColor}
  #spoorScreen .spoor-value{position:relative;z-index:1;background:transparent!important;width:100%;min-width:0;min-height:38px;padding:4px 2px;margin:0;font:600 16px system-ui;font-variant-numeric:tabular-nums;text-align:center;box-sizing:border-box}#spoorScreen .spoor-value:disabled{opacity:1;color:#655b40;background:#f4f1e8}#spoorScreen .spoor-unit{position:absolute;right:4px;bottom:1px;z-index:2;font-size:9px;pointer-events:none}#spoorScreen .selected-line{background:#fff2c7}#spoorScreen .automatic{color:#655b40}#spoorScreen footer{position:sticky;bottom:0;background:#f7f5ed;padding:8px 0 0}#spoorScreen button{min-height:38px}#spoorScreen .hint{font-size:12px;line-height:1.4;margin:8px 0}#spoorScreenStatus{flex-basis:100%;font-size:13px}#spoorScreenStatus.error{color:#a72222}#spoorScreen .spoor-tools{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:8px 0}#spoorScreen .spoor-tools label{display:flex;align-items:center;gap:6px}#spoorStyleConfig{margin:8px 0;font-size:13px}#spoorStyleConfig summary{cursor:pointer;font-weight:700;padding:10px;border:1px solid #8a9b91;border-radius:6px;background:#e4ece5}#spoorScreen #configSpoorScreen,#courseSpoorConfig{font-weight:700;background:#e4ece5;color:#142e24;border:1px solid #8a9b91;border-radius:6px;padding:6px 12px;min-height:38px}#spoorStyleConfig .styles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}#spoorStyleConfig label{display:grid;gap:3px}#spoorScreen select{min-height:36px;max-width:100%;font:inherit}#spoorScreen .start{font-size:13px}#spoorScreen .terminal{display:block;font-size:10px;white-space:normal}
  #svgMount .table-svg[data-desktop-angle] text{transform-box:fill-box;transform-origin:center;transform:rotate(calc(-1 * var(--desktop-table-angle,0deg)))}
  #svgMount .table-svg[data-desktop-angle] :is(.route-caption,.value-tag){transform-box:fill-box;transform-origin:center;transform:rotate(calc(-1 * var(--desktop-table-angle,0deg)))}
  #svgMount .table-svg[data-desktop-angle] :is(.route-caption,.value-tag) text{transform:none}
  #svgMount .segment-hit:focus{outline:none}#svgMount .segment-hit:focus-visible{stroke:#ffd35a;stroke-width:4}

  body.table-only.mobile-preview.mobile-preview-landscape .drawing{width:min(844px,96vw)!important;height:min(390px,90dvh)!important}
  @media(pointer:coarse){body.table-only .view-actions{display:none!important}}
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
  <div class="spoor-tools"><label><input id="mirrorSpoorScreen" type="checkbox">Spiegelen · naar Oost</label><span id="spoorDirectionLabel"></span></div>
  <table><thead><tr><th>Lijn</th><th>V</th><th>R</th><th>A</th><th aria-label="Opmerking">✎</th></tr></thead><tbody></tbody></table>
  <details id="spoorStyleConfig"><summary>Config</summary><p id="spoorComparisonInfo" class="hint" hidden></p><div class="styles"><label><span>Oriëntatiekruisjes op tafel</span><input id="showTableAcquits" type="checkbox" style="width:24px;height:24px;min-height:24px"></label><label>Mobiel · staand / liggend<select id="mobileTableOrientation"><option value="auto">Automatisch</option><option value="upright">Staand</option><option value="right">Liggend ↻ rechtsom</option><option value="left">Liggend ↺ linksom</option></select></label><label>Desktop · Klein<select id="desktopOrientationKlein"><option value="upright">Rechtop</option><option value="right">↻ Kwartslag rechtsom</option><option value="left">↺ Kwartslag linksom</option></select></label><label>Desktop · Groot<select id="desktopOrientationGroot"><option value="upright">Rechtop</option><option value="right">↻ Kwartslag rechtsom</option><option value="left">↺ Kwartslag linksom</option></select></label><label>V en A<select id="spoorArrowStyle"><option value="double">⇖ Dubbele pijlen</option><option value="single">↖ Enkele pijlen</option></select></label><label>Raakpunt<select id="spoorContactStyle"><option value="bar">⇥ Pijl met bandstreep</option><option value="single">→ Enkele pijl</option></select></label><label>Symboolgrootte<select id="spoorSymbolSize"><option value="24">24</option><option value="28">28</option><option value="32" selected>32</option></select></label></div><p class="hint">Het benedenacquit is de vaste basis voor de naamgeving in de cursus. Parallelsporen vanuit het midden- of bovenacquit blijven bruikbaar. Extra vertrekletters en alternatieve spoornamen voegen weinig toe aan de bestaande spoor- en +/−-notatie, maar vragen telkens een vertaling en leiden af. Daarom leren we geen afzonderlijk naamstelsel per acquit aan. Parallel en waaier behouden hun eigen werking. Een referentiepunt op de band is geen positie voor het balmiddelpunt.<br>V en A volgen de speelrichting; R wijst naar de geraakte band.<br>30+ ≈ 30¼ · 30++ ≈ 30½ · 31− ≈ 30¾. Exacte bestaande waarden blijven bewaard.</p></details>
  <p id="spoorMeasurementHint" class="hint"></p><footer><button id="saveSpoorScreen" type="button">Bewaar spoor</button><button id="reloadSpoorScreen" type="button">Herlaad</button><span id="spoorScreenStatus" role="status" aria-live="polite"></span></footer>`;
  document.body.append(dialog);
  const $=id=>dialog.querySelector('#'+id),body=dialog.querySelector('tbody'),text=(message,error=false)=>{$('spoorScreenStatus').textContent=message;$('spoorScreenStatus').classList.toggle('error',error);};
  let original,working,dirty=false,saving=false,viewDirection,previewing=false;
  $('showTableAcquits').checked=adapter.showAcquits?.()!==false;$('showTableAcquits').onchange=()=>adapter.setShowAcquits($('showTableAcquits').checked);
  $('mobileTableOrientation').value=adapter.mobileOrientation?.()||'auto';$('mobileTableOrientation').onchange=()=>adapter.setMobileOrientation($('mobileTableOrientation').value);
  for(const table of ['klein','groot']){
    const field=$('desktopOrientation'+(table==='klein'?'Klein':'Groot'));field.value=adapter.desktopOrientations?.()[table]||'upright';
    field.onchange=()=>adapter.setDesktopOrientation(table,field.value);
  }
  const notesStyle=document.createElement('style');notesStyle.textContent='#spoorScreen .spoor-note-cell{width:34px;padding:2px}#spoorScreen .spoor-note-button{min-width:32px;min-height:38px;padding:2px;background:#e4ece5;border:1px solid #8a9b91;border-radius:5px;color:#142e24}#spoorScreen .spoor-note-popup{position:fixed;z-index:4300;width:min(300px,calc(100vw - 16px));box-sizing:border-box;padding:10px;background:#fffbed;border:1px solid #8a9b91;border-radius:8px;box-shadow:0 4px 16px #0004;font:14px system-ui}#spoorScreen .spoor-note-popup[hidden]{display:none}#spoorScreen .spoor-note-popup textarea{display:block;width:100%;box-sizing:border-box;margin-top:6px;min-height:120px;font:16px/1.4 system-ui;resize:vertical}';document.head.append(notesStyle);
  const styleKey='3b-spoorscherm-stijlen-v1';
  try{const saved=JSON.parse(localStorage.getItem(styleKey)||'{}');for(const [id,value] of Object.entries(saved))if($(id)&&[...$(id).options].some(o=>o.value===value))$(id).value=value;}catch(_){}
  function symbols(tr,line){
    const row=working[line.key],arrow=SpoorScreenFormat.arrow(row.V,row.A,original.geometry,original.direction,$('spoorArrowStyle').value);
    for(const side of ['V','L','R','A']){const symbol=tr.querySelector('.spoor-symbol[data-side='+side+']');if(!symbol)continue;symbol.textContent=side==='L'?'↔':side==='R'?SpoorScreenFormat.contact(row.A?.band,original.direction,$('spoorContactStyle').value):arrow;const directions={'⇗':'noordoost','↗':'noordoost','⇘':'zuidoost','↘':'zuidoost','⇙':'zuidwest','↙':'zuidwest','⇖':'noordwest','↖':'noordwest','⇑':'noord','↑':'noord','⇓':'zuid','↓':'zuid','⇒':'oost','→':'oost','⇐':'west','←':'west'};const band=original.direction==='oost'?({west:'oost',oost:'west'}[row.A?.band]||row.A?.band):row.A?.band;
      const label=side==='L'?'Afstootlengte in centimeter':side==='R'?'Raakpunt met de '+band+'band':side+' · speelrichting '+(directions[arrow]||'onbekend');symbol.setAttribute('aria-label',label);symbol.title=label;}
  }
  function refresh(tr,line){
    const input=tr.querySelector('.spoor-value[data-side=R]');
    if(!input){symbols(tr,line);return;}
    try{input.value=SpoorScreenFormat.format(SpoorGeometry.contact(working[line.key].V,working[line.key].A,original.geometry).value);input.setCustomValidity('');}
    catch(error){input.value='';input.title=error.message;input.setCustomValidity('');}
    symbols(tr,line);
  }
  function controls(td,line,side){
    const row=working[line.key],p=side==='L'?{value:row.lengthCm}:side==='R'?null:row[side];
    if(p?.kind==='acquit'){td.textContent='S'+(Number(p.offset)?(Number(p.offset)>0?'+':'')+p.offset:'');td.className='start';return;}
    const wrap=document.createElement('div');wrap.className='spoor-point';const symbol=document.createElement('span');symbol.className='spoor-symbol';symbol.dataset.side=side;symbol.setAttribute('role','img');
    const input=document.createElement('input');input.type='text';input.className='spoor-value';input.dataset.side=side;input.value=SpoorScreenFormat.format(p?.value);input.placeholder='·';input.autocomplete='off';input.spellcheck=false;input.disabled=Boolean(window.ThreeBDatabaseWorkspace?.required&&!window.ThreeBDatabaseWorkspace.active)||line.terminal||side==='L'&&!original.strokeLimits||side==='V'&&line.editableV===false||side==='A'&&line.editableA===false||side==='R'&&line.editableA===false;input.setAttribute('aria-label',side==='L'?'Neus afstootlengte in cm':line.label+' '+side+' waarde');
    if(p?.inputReference&&(p.band!==p.inputReference.band||Math.abs(p.value-p.inputReference.value)>.125)){input.title='Afgeleid uit karkas; opgeslagen meting '+SpoorScreenFormat.format(p.inputReference.value);input.classList.add('spoor-reference-diff');}
    wrap.append(input,symbol);if(side==='L'){const unit=document.createElement('small');unit.className='spoor-unit';unit.textContent='cm';wrap.append(unit);}td.append(wrap);
    input.oninput=()=>{
      try{
        const value=SpoorScreenFormat.parse(input.value);
        if(side==='L'){
          const limits=original.strokeLimits;if(value===null||!limits||value<limits.min-1e-6||value>limits.max+1e-6)throw Error('Lengte buiten bereik ('+Math.ceil(limits?.min||0)+'–'+Math.floor(limits?.max||0)+' cm).');row.lengthCm=value;row.changed.add('L');
        }else if(side==='R'){
          if(value===null)throw Error('Vul het raakpunt in, of kies Herlaad.');
          const r={band:row.A.band,value},a=line.editableV===false&&row.startBall?SpoorGeometry.arrivalFromBall(row.startBall,r,original.geometry):SpoorGeometry.arrival(row.V,r,original.geometry);row.A={...row.A,...a};row.changed.add('A');if(row.V.kind!=='acquit'&&line.editableV!==false)row.changed.add('V');
          td.parentElement.querySelector('.spoor-value[data-side=A]').value=SpoorScreenFormat.format(a.value);
        }else{row[side]={...row[side],value};row.changed.add(side);}
        if(line.editableV===false&&row.startBall&&(side==='A'||side==='R')){row.V={...row.V,...SpoorGeometry.departureFromBall(row.startBall,row.A,row.V.band,original.geometry)};td.parentElement.querySelector('.spoor-value[data-side=V]').value=SpoorScreenFormat.format(row.V.value);}
        input.setCustomValidity('');dirty=true;preview();if(side!=='R')refresh(td.parentElement,line);else symbols(td.parentElement,line);text('Wijzigingen nog niet bewaard.');
      }catch(error){input.setCustomValidity(error.message);text(error.message,true);}
    };
    input.onblur=()=>{if(input.checkValidity()&&input.value!=='')input.value=SpoorScreenFormat.format(SpoorScreenFormat.parse(input.value));};
  }
  function changes(){const list=[];for(const [line,row] of Object.entries(working||{}))for(const side of row.changed)list.push({line,side,point:side==='N'?{value:row.note}:side==='L'?{value:row.lengthCm}:row[side]});return list;}
  function clearPreview(){previewing=true;try{adapter.clearPreview?.();}finally{previewing=false;}}
  function preview(){if(!adapter.preview)return;previewing=true;try{const updated=adapter.preview(original,changes());for(const line of updated.lines){const row=working[line.key],tr=[...body.rows].find(r=>r.dataset.line===line.key);row.startBall=line.startBall;for(const side of ['V','A']){if(!row.changed.has(side))row[side]=structuredClone(line[side]);const el=tr.querySelector('.spoor-value[data-side='+side+']');if(el&&document.activeElement!==el)el.value=SpoorScreenFormat.format(row[side]?.value);}refresh(tr,line);}}finally{previewing=false;}}
  function noteCell(tr,line){
    const td=document.createElement('td'),wrap=document.createElement('div'),button=document.createElement('button'),popup=document.createElement('div'),label=document.createElement('label'),input=document.createElement('textarea');td.className='spoor-note-cell';wrap.className='spoor-note';button.type='button';button.className='spoor-note-button';button.textContent=line.note?'✎•':'✎';button.setAttribute('aria-label','Opmerking '+line.label);button.setAttribute('aria-expanded','false');popup.className='spoor-note-popup';popup.hidden=true;label.textContent='Opmerking · '+line.label;input.value=line.note||'';input.rows=5;input.setAttribute('aria-label','Opmerking bij '+line.label);label.append(input);popup.append(label);wrap.append(button,popup);td.append(wrap);tr.append(td);
    let pinned=false;
    const show=()=>{popup.hidden=false;button.setAttribute('aria-expanded','true');const box=button.getBoundingClientRect();popup.style.left=Math.max(8,Math.min(innerWidth-316,box.right-300))+'px';popup.style.top=Math.max(8,Math.min(innerHeight-210,box.bottom+4))+'px';};
    const hide=()=>{if(pinned||popup.contains(document.activeElement))return;popup.hidden=true;button.setAttribute('aria-expanded','false');};
    wrap.onpointerenter=e=>{if(e.pointerType!=='touch')show();};wrap.onpointerleave=hide;button.onfocus=show;button.onclick=()=>{pinned=!pinned;if(pinned){show();input.focus();}else{button.blur();input.blur();hide();}};input.onblur=()=>{if(!wrap.matches(':hover'))hide();};input.oninput=()=>{working[line.key].note=input.value;working[line.key].changed.add('N');button.textContent=input.value?'✎•':'✎';dirty=true;text('Opmerking nog niet bewaard.');};
  }
  function load(direction=viewDirection){
    clearPreview();
    original=adapter.read(direction);viewDirection=original.direction;working={};dirty=false;body.replaceChildren();
    const comparison=$('spoorComparisonInfo');comparison.hidden=!window.THREEB_TEST_ENVIRONMENT;comparison.textContent=adapter.comparisonInfo?.()||'';comparison.title='Vergelijk deze tafelcode op desktop en telefoon. Bij verschillende codes zijn de getoonde tafelgegevens of instellingen niet gelijk.';
    $('spoorScreenTitle').textContent='Spoorscherm · '+original.label+' · '+(original.selectedPattern||original.actualPattern);$('mirrorSpoorScreen').checked=original.direction==='oost';$('spoorDirectionLabel').textContent=original.direction==='oost'?'Oost':'West';
    $('spoorMeasurementHint').textContent=(original.startError?original.startError+'. ':original.selectedPattern&&original.selectedPattern!=='LKL'?'Eerste drie banden: '+original.actualPattern+'. ':original.actualPattern!=='LKL'?'Dit spoor valt buiten LKL ('+original.actualPattern+'). ':'')+(original.direction==='oost'?'Eigen Oost-meting: apart bewaard; de West-meting blijft behouden.':'');
    const head=original.lines.find(line=>line.key==='kop')?.A;if(!head||head.value===null)$('spoorMeasurementHint').textContent+=' Kop A is nog niet gemeten; de tussenroute is onvolledig.';else if(head.source==='estimate')$('spoorMeasurementHint').textContent+=' Kop A is een schatting, geen meting.';
    $('spoorMeasurementHint').textContent+=' Neus en Romp zijn leidend; Kop A is het meetanker. De tussenwaarden zijn afgeleid.';
    for(const line of original.lines){working[line.key]={V:structuredClone(line.V),A:structuredClone(line.A),note:line.note||'',lengthCm:line.key==='neus'?original.strokeLengthCm:null,startBall:line.startBall,changed:new Set()};const tr=document.createElement('tr');tr.dataset.line=line.key;
      const th=document.createElement('th');th.scope='row';th.textContent=line.label;tr.append(th);
      if(line.terminal){const small=document.createElement('span');small.className='terminal';small.textContent='Auto'+(line.fraction===.5?' · ½':line.fraction===.25?' · ¼':'');th.append(small);}
      for(const side of ['V','R','A']){const td=document.createElement('td');if(line.terminal)td.className='automatic';controls(td,line,side);tr.append(td);}noteCell(tr,line);body.append(tr);refresh(tr,line);
    }
    const refs=original.lines.flatMap(line=>['V','A'].filter(side=>line[side]?.inputReference&&Math.abs(line[side].value-line[side].inputReference.value)>.125).map(side=>line.label+' '+side+': opgeslagen '+SpoorScreenFormat.format(line[side].inputReference.value)+', uit karkas '+SpoorScreenFormat.format(line[side].value)));if(refs.length)$('spoorMeasurementHint').textContent+=' Tussenmetingen bewaard als referentie: '+refs.join('; ')+'.';
    dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');text(window.ThreeBDatabaseWorkspace?.required?(window.ThreeBDatabaseWorkspace.active?'SQLite-werkbestand geopend · Bewaar spoor bewaart op dit apparaat. Bewaar db lokaal maakt een bestand.':'Open eerst een SQLite-werkdatabase om je spoor te bewaren.'):window.THREEB_TEST_ENVIRONMENT?'TEST · bewaren in aparte browseropslag.':'Bewaar spoor om je wijzigingen vast te leggen.');
  }
  for(const id of ['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'])$(id).onchange=()=>{localStorage.setItem(styleKey,JSON.stringify(Object.fromEntries(['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'].map(id=>[id,$(id).value]))));dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');for(const tr of body.rows)symbols(tr,original.lines.find(l=>l.key===tr.dataset.line));};
  let position;
  function place(next){const box=dialog.getBoundingClientRect();const left=Math.max(48-box.width,Math.min(innerWidth-48,next.left)),top=Math.max(-18,Math.min(innerHeight-32,next.top));position={left,top};dialog.style.left=left+'px';dialog.style.top=top+'px';}
  function recenter(){const box=dialog.getBoundingClientRect();place({left:(innerWidth-box.width)/2,top:Math.max(8,(innerHeight-box.height)/2)});}
  function open(options={}){
    if(dialog.open&&dirty){text('Bewaar of herlaad voordat je een andere lijn kiest.',true);return;}
    load();if(!dialog.open)dialog.show();
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
  const courseActions=document.querySelector('#explanationCarousel .course-header-actions');if(courseActions){const config=document.createElement('button');config.type='button';config.id='courseSpoorConfig';config.textContent='⚙ Config';config.onclick=()=>{open({recenter:true});showConfig();};courseActions.prepend(config);}

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
  function close(){if(saving)return;if(dirty&&!confirm('Niet-bewaarde spoorwijzigingen verwerpen en sluiten?'))return;dirty=false;dialog.close();clearPreview();}
  $('closeSpoorScreen').onclick=close;dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}});dialog.addEventListener('cancel',e=>{e.preventDefault();close();});$('reloadSpoorScreen').onclick=()=>{if(!saving)load();};
  window.hasThreeBSpoorChanges=()=>dirty||saving;
  $('saveSpoorScreen').onclick=async()=>{
    if(saving)return;if(window.ThreeBDatabaseWorkspace?.required&&!window.ThreeBDatabaseWorkspace.active){text('Open eerst je SQLite-werkdatabase via Open werkdatabase. Daarna bewaart Bewaar spoor in die database.',true);return;}for(const input of dialog.querySelectorAll('.spoor-value'))if(!input.reportValidity())return;if(!dirty&&!window.ThreeBDatabaseWorkspace?.active){text('Geen gewijzigde waarden.');return;}
    const edits=changes();clearPreview();
    saving=true;for(const el of dialog.querySelectorAll('input,textarea,select,button'))el.disabled=true;text('Bewaren…');
    try{await adapter.save(original,edits);load();text(window.ThreeBDatabaseWorkspace?.active?'Spoor bewaard in SQLite-werkdatabase. Bewaar db lokaal maakt een bestand; upload apart naar GitHub.':original.direction==='oost'?'Oost-meting apart bewaard in deze browser.':window.THREEB_TEST_ENVIRONMENT?'Spoor bewaard in de testbrowser.':'Spoor bewaard.');}
    catch(error){preview();text(error.message,true);}
    finally{saving=false;for(const el of dialog.querySelectorAll('button,textarea,select,#mirrorSpoorScreen'))el.disabled=false;if(dirty)for(const tr of body.rows)if(!original.lines.find(l=>l.key===tr.dataset.line).terminal)for(const el of tr.querySelectorAll('input'))el.disabled=false;}
  };
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  if(window.THREEB_TEST_ENVIRONMENT&&document.getElementById('databaseWorkspace')){
    const sidebar=document.createElement('aside');sidebar.id='desktopWorkbench';sidebar.setAttribute('aria-label','Kruin configureren');
    const quick=document.createElement('button');quick.id='desktopOpenSpoor';quick.type='button';quick.textContent='Spoorscherm · V / R / A';quick.onclick=()=>open({recenter:true});
    document.body.append(sidebar);
    const nodes=[document.getElementById('databaseWorkspace'),document.getElementById('bandDock'),document.getElementById('mobilePreview'),document.querySelector('.onscreen-control-menuPanel')].filter(Boolean),anchors=nodes.map(node=>{const anchor=document.createComment('workbench-original-position');node.before(anchor);return anchor;});
    const dock=document.getElementById('bandDock');
    dock?.addEventListener('pointerdown',event=>{
      if(!document.body.classList.contains('test-desktop-workbench')||event.button!==0||!event.target.closest('.band-drag-handle'))return;
      if(!dock.classList.contains('workbench-menu-floating')){const box=dock.getBoundingClientRect();dock.classList.add('workbench-menu-floating');document.body.append(dock);dock.style.left=box.left+'px';dock.style.top=box.top+'px';}
    },true);
    let previous=null;
    const layout=()=>{const desktop=innerWidth>=1000&&!matchMedia('(pointer:coarse)').matches;document.body.classList.toggle('test-desktop-workbench',desktop);if(desktop===previous)return;previous=desktop;
      if(desktop){sidebar.append(nodes[0]);if(dock){dock.classList.add('workbench-menu-floating');document.body.append(dock);const saved=adapter.dockPosition?.();if(saved)adapter.setDockPosition(saved.x*innerWidth,saved.y*innerHeight);else adapter.setDockPosition(Math.max(8,innerWidth-740),Math.max(64,(document.getElementById('testEnvironmentBanner')?.getBoundingClientRect().bottom||48)+12));}sidebar.append(quick);for(const node of nodes.slice(2))sidebar.append(node);}else{nodes.forEach((node,i)=>{node.classList.remove('workbench-menu-floating');anchors[i].after(node);});quick.remove();}
      requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
    };
    window.addEventListener('resize',layout);layout();
  }

};
