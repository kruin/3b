'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),{chromium}=require('playwright');
const server=http.createServer((req,res)=>{
  const file=path.join(__dirname,new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
  fs.readFile(file,(error,bytes)=>{
    if(error){res.writeHead(404).end();return;}
    if(file.endsWith('spoorscherm-v208.js'))bytes=bytes.toString().replace('window.installThreeBLklLesson=adapter=>{','window.installThreeBLklLesson=adapter=>{window.__qa=adapter;');
    res.setHeader('content-type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(bytes);
  });
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
  try{for(const width of [1280,390]){
    const page=await browser.newPage({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600}),errors=[];
    page.on('pageerror',e=>errors.push(e.stack));
    await page.goto('http://127.0.0.1:'+server.address().port+'/?h3=correctie');
    await page.waitForSelector('#courseMeasurementTable');
    const read=track=>page.evaluate(track=>{const d=window.__qa.lesson1Data(track);return {profile:d.measurementTable,label:d.tableLabel,body:d.route.romp,cross:d.route.kruis,bodyPart:d.rompPart,crossPart:d.kruisPart,head:d.journey.find(p=>p.key==='kop'),geometry:d.geometry,been:d.beenPart};},track);
    let d=await read('VIER');assert.equal(d.profile,'klein-ingespeeld');assert.equal(d.body.from.value,5);assert.equal(d.body.to.band,'west');assert.equal(d.body.to.value,70);
    for(const [track,band,value]of [['VIJF','oost',10],['ZES','oost',5],['ZEVEN','oost',0],['ACHT','noord',0]]){
      d=await read(track);assert.equal(d.cross.to.band,band);assert.equal(d.cross.to.value,value);assert.equal(d.cross.to.measurement,true);assert.equal(d.cross.from.calculationBasis,'measured_cross_arrival');
      assert(d.crossPart,track+' measured cross available');
      // The measured cross begins at the body arrival ball, not at a separate guessed point.
      assert(Math.hypot(d.crossPart.from.x-d.bodyPart.to.x,d.crossPart.from.y-d.bodyPart.to.y)<.001,track+' body/cross shared ball centre');
    }
    d=await read('VIJF');assert.equal(d.body.to.value,38);
    const fifth=await page.evaluate(()=>{const k=window.THREEB_KRUIN_VALUES;return {definition:k.sourceNotes.lineDefinitions['5'],six:k.tracks.klein.ZESZEVEN};});assert(fifth.definition.appliesTo.includes('sixSeven'));assert.deepEqual(fifth.six.kruisA,fifth.six.linePoints.kruis.to);assert.equal(fifth.six.kruisA.source,'estimate','six-seven source is preserved, not replaced by LKL measurement');
    d=await read('ACHT-1');assert.equal(d.body.to.value,22);
    // A profile switch must isolate user edits, including origin-route stores.
    await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('3b-canonical-west-v2'));s.data.klein.VIJF.romp.to={band:'zuid',value:37.25,status:'edited',source:'user',userAdjusted:true};s.startAcquitRoutes??={};s.startAcquitRoutes['omb:0:klein:VIJF']={userFixture:true};localStorage.setItem('3b-canonical-west-v2',JSON.stringify(s));});
    await page.reload();await page.waitForSelector('#courseMeasurementTable');
    await page.locator('#courseMeasurementTable').selectOption('klein-nieuw');
    d=await read('ZES');assert.equal(d.profile,'klein-nieuw');assert(d.label.includes('nieuw laken'));assert.equal(d.body.to.value,28);assert(d.head);assert(Math.abs(d.head.to.x-15/40*d.geometry.widthCm)<.001,'R15 determines the real head contact');assert.equal(d.been,null,'no Been invented beyond measured line 5');
    const inspection=await page.evaluate(()=>{const source=window.THREEB_KRUIN_VALUES.measurementTables['klein-nieuw'].tracks.ZES;const state=JSON.parse(localStorage.getItem('3b-canonical-west-v2'));return {r:source.railContactMeasurements.kop,a:source.kopA,route:state.startAcquitRoutes?.['omb:0:klein:VIJF'],own:state.data.klein.VIJF.romp.to};});
    assert.equal(inspection.r.value,15);assert.equal(inspection.r.measurementKind,'raakpunt');assert.equal(inspection.r.bibliography.title,'Modern Biljarten');assert.equal(inspection.r.bibliography.page,27);assert.notEqual(inspection.a.value,15,'R15 is never copied into A15');assert.equal(inspection.route,undefined);assert.notEqual(inspection.own.value,37.25);
    await page.locator('#courseMeasurementTable').selectOption('klein-ingespeeld');
    let own=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('3b-canonical-west-v2'));return {value:s.data.klein.VIJF.romp.to.value,route:s.startAcquitRoutes['omb:0:klein:VIJF']};});assert.equal(own.value,37.25);assert(own.route.userFixture);
    d=await read('VIJF');assert.equal(d.body.to.value,38,'course keeps published source separate from user edit');
    await page.locator('#courseMeasurementTable').selectOption('klein-nieuw');await page.reload();await page.waitForSelector('#courseMeasurementTable');assert.equal(await page.locator('#courseMeasurementTable').inputValue(),'klein-nieuw');
    if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.QA_DIR,'meetprofielen-'+width+'.png')});}
    assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+1,'no page overflow');
    await page.locator('#courseFullscreen').click();assert(await page.locator('#courseMeasurementTable').isHidden());await page.locator('#courseFullscreen').click();
    await page.evaluate(()=>window.ThreeBTableText.update({courseTable:'groot'}));
    d=await read('ZES');assert.equal(d.body.to.value,28);d=await read('ACHT');assert.equal(d.body.from.value,48);
    const groot=await page.evaluate(()=>{const k=window.THREEB_KRUIN_VALUES;return {lkl:k.measurementTables['groot-lkl'].tracks.VIER,fel:k.measurementTables['groot-felle-afstoot'].tracks.VIER};});assert.equal(groot.lkl.rompA.value,70);assert.equal(groot.fel.rompA.value,60);assert.equal(groot.fel.rompV.value,null,'missing departure never invented');
    assert.deepEqual(errors,[]);console.log(width,'profiles, actual V/A, measured fifth-line continuity, R/A distinction, Duon, edit isolation, reload, fullscreen, groot and Felle afstoot: OK');await page.close();
  }}finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
