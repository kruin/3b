/* Uitvoerbare beheerbladcontrole zonder externe browserafhankelijkheid.
   Test de echte UI-JavaScript tegen de echte lokale SQLite-server. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path'),os=require('os'),cp=require('child_process');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'3b-beheerblad-'));fs.cpSync(path.dirname(__dirname),temp,{recursive:true});
 const privateDir=path.join(temp,'3B-private-Kruinconfig-v181'),publicDir=path.join(temp,'3B-openbare-app-v181');
 const child=cp.spawn(process.platform==='win32'?'python':'python3',[path.join(privateDir,'Kruinconfig_server.py'),publicDir,'--no-browser']);
 const base=await new Promise((resolve,reject)=>{let text='';child.stdout.on('data',chunk=>{text+=chunk;const m=text.match(/Kruinconfig-editor: (http:\/\/[^/]+)/);if(m)resolve(m[1]);});child.on('error',reject);child.on('exit',code=>reject(Error('Server exit '+code)));});
 try{
  const elements={};
  class Element{
   constructor(tag){this.tagName=tag;this.children=[];this._value='';this.checked=false;this.disabled=false;this.style={};this.classList={toggle:()=>{}};}
   set id(value){this._id=value;elements[value]=this;}get id(){return this._id;}
   set value(value){this._value=String(value);}get value(){return this._value;}
   append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=[...nodes];}
   querySelector(selector){if(selector==='tbody'){return this.body??=new Element('tbody');}throw Error('Onverwachte selector '+selector);}
   setAttribute(name,value){this[name]=value;}checkValidity(){const n=Number(this.value);return this.value===''||Number.isFinite(n)&&(!(this.min!==undefined)||n>=Number(this.min))&&(!(this.max!==undefined)||n<=Number(this.max));}
  }
  const html=fs.readFileSync(path.join(privateDir,'SQLite-beheer.html'),'utf8');
  for(const m of html.matchAll(/<(\w+)\b[^>]*\bid="([^"]+)"[^>]*>/g)){const e=new Element(m[1]);e.id=m[2];for(const a of ['min','max','type']){const value=m[0].match(new RegExp(a+'="([^"]+)"'));if(value)e[a]=value[1];}}
  elements.tafel.value='klein';const context={document:{getElementById:id=>elements[id],createElement:tag=>new Element(tag)},window:{addEventListener:()=>{}},URLSearchParams,fetch:(url,args)=>fetch(base+url,args)};
  vm.createContext(context);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
  const loaded=async()=>{for(let i=0;i<300;i++){if(!elements.save.disabled&&elements['romp-A-waarde'])return;await new Promise(r=>setTimeout(r,10));}throw Error('Beheerblad laadt niet');};await loaded();
  assert.equal(elements.values.body.children.length,9);assert.equal(elements['romp-A-waarde'].value,'38');assert.equal(elements.basis.value,'standaard');assert.equal(elements.crossBandChoice.hidden,true);assert(elements.loopOrigin.textContent.includes('Berekend'));
  elements['romp-A-waarde'].value='36.123456789';elements['romp-A-waarde'].oninput();elements['romp-A-herkomst'].value='kruin_measured';
  elements.tafel.value='groot';elements.tafel.onchange();assert.equal(elements.tafel.value,'klein','Onbewaarde edit moet behouden blijven');
  await elements.save.onclick();assert(elements.status.textContent.includes('Bewaard in SQLite'));assert.equal(elements['romp-A-waarde'].value,'36.123456789');
  const db=path.join(privateDir,'Kruinconfig.sqlite3');const value=cp.execFileSync(process.platform==='win32'?'python':'python3',['-c',"import sqlite3,sys; print(sqlite3.connect(sys.argv[1]).execute(\"SELECT waarde FROM lijnpunten WHERE basis_id='standaard' AND tafel='klein' AND spoor='VIJF' AND lijn='romp' AND kant='A'\").fetchone()[0])",db],{encoding:'utf8'}).trim();assert.equal(value,'36.123456789');
  elements.newBasisName.value='Clubtafel';await elements.cloneBasis.onclick();assert.notEqual(elements.basis.value,'standaard');assert(elements.tableLink.href.includes('beheerBasis='+elements.basis.value));assert.equal(elements['romp-A-waarde'].value,'36.123456789');
  elements['romp-A-waarde'].value='35.25';elements['romp-A-waarde'].oninput();await elements.save.onclick();assert.equal(elements['romp-A-waarde'].value,'35.25');
  elements.basis.value='standaard';await elements.basis.onchange();await loaded();assert.equal(elements['romp-A-waarde'].value,'36.123456789','Extra basis mag bronbasis niet wijzigen');
  elements['romp-A-waarde'].value='0';elements['romp-A-waarde'].oninput();await elements.save.onclick();assert.equal(elements['romp-A-waarde'].value,'0');
  elements['romp-A-waarde'].value='';elements['romp-A-waarde'].oninput();await elements.save.onclick();assert.equal(elements['romp-A-waarde'].value,'');
  // Automatic defaults, one upstream band change, override, and explicit reset.
  assert.equal(elements['neus-A-band'].value,'west');assert.equal(elements['kop-A-band'].value,'noord');assert.equal(elements['nek-A-band'].value,'oost');assert.equal(elements['been-A-band'].value,'oost');
  elements['romp-A-band'].value='west';elements['romp-A-band'].onchange();assert.equal(elements['kruis-V-band'].value,'west','Automatische startband volgt Romp A');
  elements.crossBand.value='zuid';elements.crossBand.onchange();assert.equal(elements['kruis-A-band'].value,'zuid');assert.equal(elements['been-V-band'].value,'zuid');
  elements['been-V-waarde'].value='23.123456789';elements['been-V-waarde'].oninput();assert.equal(elements['been-V-herkomst'].value,'user');
  await elements.save.onclick();assert(elements.status.textContent.includes('Bewaard in SQLite'));assert.equal(elements['been-V-waarde'].value,'23.123456789');assert.equal(elements['been-V-herkomst'].value,'user');
  // Updating upstream does not replace a manually chosen departure band.
  elements.crossBand.value='west';elements.crossBand.onchange();assert.equal(elements['been-V-band'].value,'zuid');
  await elements.save.onclick();assert.equal(elements['been-V-band'].value,'zuid');assert.equal(elements['been-V-waarde'].value,'23.123456789');
  elements['been-V-auto'].onclick();assert.equal(elements['been-V-band'].value,'west');assert.equal(elements['been-V-waarde'].value,'');
  await elements.save.onclick();assert.equal(elements['been-V-herkomst'].value,'automatic');assert.equal(elements['been-V-waarde'].value,'');
  const dbauto=cp.execFileSync(process.platform==='win32'?'python':'python3',['-c',"import sqlite3,sys,json; print(json.dumps(sqlite3.connect(sys.argv[1]).execute(\"SELECT waarde,status,bewerkt FROM lijnpunten WHERE basis_id='standaard' AND tafel='klein' AND spoor='VIJF' AND lijn='been' AND kant='V'\").fetchone()))",db],{encoding:'utf8'}).trim();assert.deepEqual(JSON.parse(dbauto),[null,'calculated',0]);
  elements.spoor.value='VIER';elements.spoor.onchange();await loaded();assert.equal(elements.crossBandChoice.hidden,false);assert(elements.crossLoop.children[0].textContent.includes('contra'));
  elements.crossLoop.value='+';elements.crossLoop.onchange();assert(elements.loopOrigin.textContent.includes('Ge-edit'));await elements.save.onclick();assert.equal(elements.crossLoop.value,'+');assert(elements.loopOrigin.textContent.includes('Ge-edit'));
  elements.crossLoop.value='';elements.crossLoop.onchange();await elements.save.onclick();assert.equal(elements.crossLoop.value,'');assert(elements.crossLoop.children[0].textContent.includes('contra'));assert(elements.loopOrigin.textContent.includes('Berekend'));
  await elements.generate.onclick();assert(elements.status.textContent.includes('Tafel bijgewerkt'));
  console.log('BEHEERBLADCONTROLE OK: echte UI-JavaScript en SQLite-API, losse waarden, herkomst, decimalen, nul/leeg, behoud onbewaarde edits, kopie basis en controletafellink. Automatische banden, Romp West, Kruis Zuid/West, handmatige override en Auto-herstel. Geen visuele browsertest.');
 }finally{child.kill();await new Promise(r=>child.once('exit',r));fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1});
