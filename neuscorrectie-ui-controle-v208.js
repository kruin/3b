'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os'),assert=require('assert'),{chromium}=require('playwright');
const state=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('3b-canonical-west-v2')));
async function tap(p,s,m){await p.locator(s).scrollIntoViewIfNeeded();m?await p.locator(s).tap():await p.locator(s).click();}
async function menu(p,m){if(!await p.locator('#closeSelectionMenu').isVisible())await tap(p,'#bandMenu',m);}
async function choose(p,s,v,m){await menu(p,m);if(await p.locator(s).evaluate(el=>!!el.closest('#menuSettings'))&&!await p.locator('#menuSettings').evaluate(el=>el.open))await tap(p,'#menuSettings summary',m);await p.locator(s).scrollIntoViewIfNeeded();await p.locator(s).selectOption(v);}
async function nose(p,m){if(!await p.locator('#lineEditor').isVisible())await tap(p,'#bandLineValue',m);}
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'3b208-nose-'));fs.cpSync(path.dirname(__dirname),temp,{recursive:true});const pub=path.join(temp,'3B-openbare-app-v208'),priv=path.join(temp,'3B-private-Kruinconfig-v208');
 const child=cp.spawn(process.platform==='win32'?'python':'python3',[path.join(priv,'Kruinconfig_server.py'),pub,'--no-browser']);
 const base=await new Promise((resolve,reject)=>{let out='';child.stdout.on('data',d=>{out+=d;const m=out.match(/Kruinconfig-editor: (http:\/\/[^/]+)/);if(m)resolve(m[1]);});child.on('error',reject);child.on('exit',code=>reject(Error('Server '+code)));});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:844,height:390}]){
  const mobile=viewport.width!==1280,p=await browser.newPage({viewport,isMobile:mobile,hasTouch:mobile}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(15000);await p.goto(base+'/#owner=kruin');await p.waitForSelector('.table-svg');
  await choose(p,'#centralTableMode','klein',mobile);await choose(p,'#parallelDisplaySelect','line',mobile);if(await p.locator('#closeSelectionMenu').isVisible())await tap(p,'#closeSelectionMenu',mobile);
  await nose(p,mobile);await p.locator('#noseLengthValue').fill('83');await p.locator('#noseLengthValue').dispatchEvent('input');await tap(p,'#closeLineEditor',mobile);
  const original=(await state(p)).data.klein.VIJF.romp;console.log('Start Neus-test '+viewport.width);
  await nose(p,mobile);await p.locator('#noseLengthValue').fill('73');await p.locator('#noseLengthValue').dispatchEvent('input');
  let saved=await state(p);assert.equal(saved.strokeLengthsCm.klein.VIJF,73);assert(saved.noseLengthAnchors.klein.VIJF.active);assert.equal(saved.noseLengthAnchors.klein.VIJF.appliedShiftCm,3.075);
  await tap(p,'#closeLineEditor',mobile);await menu(p,mobile);if(!await p.locator('#noseCorrectionSettings').evaluate(el=>el.open))await tap(p,'#noseCorrectionSettings summary',mobile);
  await p.locator('#noseCorrectionShift').fill('1');await p.locator('#noseCorrectionShift').dispatchEvent('change');assert.equal((await state(p)).noseLengthAnchors.klein.VIJF.appliedShiftCm,6.15);
  await p.locator('#noseCorrectionShift').fill('0.5');await p.locator('#noseCorrectionShift').dispatchEvent('change');await p.locator('#noseCorrectionAngle').fill('0.25');await p.locator('#noseCorrectionAngle').dispatchEvent('change');assert.equal((await state(p)).noseLengthAnchors.klein.VIJF.appliedAngleDeg,.25);
  await tap(p,'#sessionUndo',mobile);assert.equal((await state(p)).noseLengthAnchors.klein.VIJF.appliedAngleDeg,0,'Undo herstelt hoek en route');await tap(p,'#sessionRedo',mobile);assert.equal((await state(p)).noseLengthAnchors.klein.VIJF.appliedAngleDeg,.25);
  await p.locator('#noseCorrectionAngle').fill('0');await p.locator('#noseCorrectionAngle').dispatchEvent('change');await tap(p,'#closeSelectionMenu',mobile);
  await nose(p,mobile);await p.locator('#noseLengthValue').fill('83');await p.locator('#noseLengthValue').dispatchEvent('input');assert.deepEqual((await state(p)).data.klein.VIJF.romp,original,'83 cm herstelt exact de standaard');
  await p.locator('#noseLengthValue').fill('73');await p.locator('#noseLengthValue').dispatchEvent('input');await tap(p,'#saveLineEditor',mobile);await p.waitForFunction(()=>document.querySelector('#spoorSaveStatus').textContent.includes('opgeslagen'));
  const before=await state(p);await p.reload();await p.waitForSelector('.table-svg');const after=await state(p);assert.equal(after.strokeLengthsCm.klein.VIJF,73);assert(after.noseLengthAnchors.klein.VIJF.active);assert.deepEqual(after.noseLengthAnchors.klein.VIJF.route,before.noseLengthAnchors.klein.VIJF.route,'SQLite bewaart oorspronkelijke meetpunten');
  // Restore default in SQLite so each viewport starts with the same standard.
  await choose(p,'#parallelDisplaySelect','line',mobile);if(await p.locator('#closeSelectionMenu').isVisible())await tap(p,'#closeSelectionMenu',mobile);await nose(p,mobile);await p.locator('#noseLengthValue').fill('83');await p.locator('#noseLengthValue').dispatchEvent('input');await tap(p,'#saveLineEditor',mobile);await p.waitForFunction(()=>document.querySelector('#spoorSaveStatus').textContent.includes('opgeslagen'));await tap(p,'#closeLineEditor',mobile);
  await choose(p,'#parallelDisplaySelect','whole',mobile);await choose(p,'#playRange','sixSeven',mobile);
  const keys=await p.locator('#centralLineSelect option').evaluateAll(os=>os.map(o=>o.value));assert.equal(keys.length,21);assert(keys.includes('ZESZEVEN-2')&&keys.includes('ZESZEVEN_NEGEN'));
  for(const [index,key] of keys.entries()){
   await choose(p,'#noseDirection',index%2?'oost':'west',mobile);await choose(p,'#centralLineSelect',key,mobile);assert.equal((await state(p)).ui.playRange,'sixSeven');
   assert.deepEqual(await p.locator('#svgMount g[data-part]').evaluateAll(gs=>gs.map(g=>g.dataset.part)),['neus','kop','nek','romp','kruis','been','hiel'],key+' zeven lijnen');assert.equal(await p.locator('#svgMount .pattern-runout').getAttribute('data-runout-cm'),'10');
  }
  await menu(p,mobile);await p.screenshot({path:path.join(process.env.QA_DIR||os.tmpdir(),'v208-neus-en-zeszeven-'+viewport.width+'.png')});assert.deepEqual(errors,[]);await p.close();console.log('Neus/Romp en 21 6–7-standen OK: '+viewport.width+'×'+viewport.height+(mobile?' touch':''));
 }
 const p=await browser.newPage();await p.goto(base+'/beheer');await p.waitForSelector('#values tbody tr');await p.locator('details summary').filter({hasText:'Korte Neus'}).click();await p.locator('#noseShift').fill('-0.25');await p.locator('#save').click();await p.waitForFunction(()=>document.querySelector('#status').textContent.includes('Bewaard'));await p.reload();await p.waitForSelector('#values tbody tr');assert.equal(await p.locator('#noseShift').inputValue(),'-0.25');await p.close();
 console.log('NEUSCORRECTIE-BROWSER OK: fysieke bediening desktop + touch-emulatie portrait/landscape, Neus/Romp, hoek, Undo/Redo, standaardherstel, SQLite-ijkpunt/instelling/reload en alle 21 6–7-standen per viewport.');
 }finally{await browser.close();child.kill();await new Promise(r=>child.once('exit',r));fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
