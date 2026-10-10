'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),{chromium}=require('playwright');
const root=__dirname,executablePath=process.env.CHROMIUM_PATH||chromium.executablePath();
if(!fs.existsSync(executablePath))throw Error('Chromium ontbreekt. Start Installeer_Browsertests_3B.');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,new URL(req.url,'http://local').pathname.slice(1)||'index.html');
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}
 let source=fs.readFileSync(file);
 if(file.endsWith('app-v206.js'))source=Buffer.from(source.toString().replace('  init();','  window.lengthTest={ui,state,data,bandBall,save,render,chooseCentralTrack,patternExtent,patternLineFraction,applyAutomaticCalculations}; init();'));
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(source);
});
const choose=(page,id,value)=>page.locator(id).evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));},value);
(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});try{
 for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:844,height:390}])for(const table of ['klein','groot'])for(const direction of ['west','oost']){
  const page=await browser.newPage({viewport,isMobile:viewport.width!==1280,hasTouch:viewport.width!==1280}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/#owner=kruin`);await page.waitForSelector('#svgMount .table-svg');await page.evaluate(()=>{lengthTest.ui.showBasis=true;lengthTest.render();});
  await choose(page,'#centralTableMode',table);await choose(page,'#noseDirection',direction);
  for(const family of ['waaier','parallel']){
   await choose(page,'#trackFamilySelect',family);await choose(page,'#parallelDisplaySelect','whole');
   for(const track of ['VIER','VIJF','ACHT','NEGEN',family==='waaier'?'HALFNEGEN':'NEGEN-1']){
    await choose(page,'#centralLineSelect',track);
    // Groot VIER heeft nog geen Romp-A in de bron. Alleen deze test vult een
    // expliciet testanker in; de meegeleverde bron blijft onbekend.
    if(table==='groot'&&track==='VIER')await page.evaluate(()=>{const t=lengthTest,r=t.data('groot');if(r.romp.to.value===null){r.romp.from={band:'oost',value:10,status:'calculated',source:'test_fixture'};r.romp.to={band:'west',value:70,status:'calculated',source:'test_fixture'};t.applyAutomaticCalculations('groot');t.render();}});
    const expectedFraction=track==='VIER'?.25:.5;
    const actual=await page.evaluate(table=>{
     const t=lengthTest,route=t.data(table),svg=document.querySelector('#svgMount .table-svg'),leg=svg.querySelector('g[data-part="been"]'),end=leg?.querySelector('.runout-ball'),scale=340/THREEB_START_CONFIG.tables[table].widthCm;
     const from=t.bandBall(route.been.from,route.been.to,table,3.075),to=t.bandBall(route.been.to,route.been.from,table,3.075),point=p=>({x:110+p.x*scale,y:90+p.y*scale});
     const base=t.state.data[table][t.ui.pattern].been,baseFrom=t.bandBall(base.from,base.to,table,3.075),baseTo=t.bandBall(base.to,base.from,table,3.075),baseFraction=t.ui.pattern==='VIER'?.25:.5,baseEnd=point({x:baseFrom.x+(baseTo.x-baseFrom.x)*baseFraction,y:baseFrom.y+(baseTo.y-baseFrom.y)*baseFraction});const reference=svg.querySelector('[data-reference-part="been"]');
     return{keys:[...svg.querySelectorAll('g[data-part]')].map(g=>g.dataset.part),from:point(from),to:point(to),end:end&&{x:Number(end.getAttribute('cx')),y:Number(end.getAttribute('cy'))},fraction:leg&&Number(leg.dataset.runoutFraction),baseEnd,references:[...svg.querySelectorAll('[data-reference-part]')].map(g=>g.dataset.referencePart),reference:reference&&{x:Number(reference.getAttribute('x2')),y:Number(reference.getAttribute('y2'))},arrivalGuides:leg?.querySelectorAll('.value-guide-a,.endpoint-hit,.junction-hit').length,loops:[route.romp.loop,route.kruis.loop],data:JSON.stringify(t.state.data)};
    },table);
    if(table==='groot'&&track==='ACHT'){assert.deepEqual(actual.keys,['neus','romp'],'Ontbrekend Kop-anker mag geen fictieve keten opleveren');assert.equal(actual.end,null);continue;}
    assert.deepEqual(actual.keys,['neus','kop','nek','romp','kruis','been'],`${viewport.width}/${table}/${direction}/${family}/${track}: patroon eindigt in Been: ${JSON.stringify(actual.keys)}`);
    assert.equal(actual.fraction,expectedFraction);assert(actual.end);assert.equal(actual.arrivalGuides,0,'Uitloop heeft geen verzonnen bandcontact of aankomstwaarde');
    const expected={x:actual.from.x+(actual.to.x-actual.from.x)*expectedFraction,y:actual.from.y+(actual.to.y-actual.from.y)*expectedFraction};
    assert(Math.hypot(actual.end.x-expected.x,actual.end.y-expected.y)<1e-8,'Werkelijk getekende eindbal staat op de voorgeschreven fractie');
    if(track==='VIER')assert.deepEqual(actual.loops,['-','-'],'Romp en de volgende Kruis blijven contra');
    if(family==='parallel'){assert(!actual.references.includes('hiel'));assert(Math.hypot(actual.reference.x-actual.baseEnd.x,actual.reference.y-actual.baseEnd.y)<1e-8,'Dunne referentie stopt op dezelfde lengte');}
    await page.evaluate(()=>{lengthTest.ui.frameworkView=true;lengthTest.render();});assert.deepEqual(await page.locator('#svgMount g[data-part]').evaluateAll(gs=>gs.map(g=>g.dataset.part)),['neus','romp'],'Karkas blijft Neus + Romp');
    await page.evaluate(()=>{lengthTest.ui.frameworkView=false;lengthTest.ui.seriesOverview=true;lengthTest.ui.seriesFocus='actieveLijn';lengthTest.ui.parallelPartIndex=5;lengthTest.render();});
    assert.equal(await page.locator('#svgMount [data-focus-part="hiel"]').count(),0);
    const activeEnd=await page.locator('#svgMount .series-overview-active [data-focus-part="been"]').evaluate(el=>({x:Number(el.getAttribute('x2')),y:Number(el.getAttribute('y2'))}));assert(Math.hypot(activeEnd.x-expected.x,activeEnd.y-expected.y)<1e-8,'Actieve reeksweergave stopt op de patroonlengte');
    await page.evaluate(()=>{lengthTest.ui.seriesOverview=false;lengthTest.ui.parallelPartIndex=0;lengthTest.render();});
    assert.equal(await page.evaluate(()=>JSON.stringify(lengthTest.state.data)),actual.data,'Tekenbegrenzing verandert geen bewaarde waarden');
    if(process.env.QA_DIR&&family==='parallel'&&['VIER','NEGEN'].includes(track)&&table==='klein'&&direction==='west')await page.screenshot({path:path.join(process.env.QA_DIR,`patroonlengte-${viewport.width}-${track}.png`)});
   }
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 // Algemene contra-regel, ook als een ander lijndeel als eerste naar contra schakelt.
 const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/#owner=kruin`);await page.waitForSelector('.table-svg');
 assert.deepEqual(await page.evaluate(()=>{lengthTest.chooseCentralTrack('VIJF');const route=JSON.parse(JSON.stringify(lengthTest.data('klein')));for(const p of Object.values(route))p.loop='+';route.nek.loop='-';route.romp.loop='-';return lengthTest.patternExtent('klein',route);}),{index:4,fraction:.25});
 await page.close();console.log('PATROONLENGTE UI OK: 120 patronen op desktop, staand/liggend, Klein/Groot, West/Oost en Waaier/Parallel; LKL half Been, VIER kwart Been na contra, referenties/reeksen begrensd, karkas en waarden behouden; Groot VIER met lokaal testanker, Groot ACHT zonder Kop-anker blijft onvolledig.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
