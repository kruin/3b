'use strict';
const assert=require('assert'),fs=require('fs'),http=require('http'),path=require('path'),{chromium}=require('playwright');
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'stiplijnen-voorbeeld-v208.json'),'utf8'));
const server=http.createServer((req,res)=>{const file=path.resolve(__dirname,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}if(file.endsWith('spoorscherm-v208.js'))data=data.toString().replace('window.installThreeBLklLesson=adapter=>{','window.installThreeBLklLesson=adapter=>{window.__stipQaAdapter=adapter;');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'application/octet-stream');res.end(data);});});
const near=(a,b,message)=>assert(Math.abs(a-b)<1e-6,message);
const pointNear=(a,b,message)=>{near(a.x,b.x,message+' x');near(a.y,b.y,message+' y');};
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const local='http://127.0.0.1:'+server.address().port+'/',base=process.env.QA_URL||local;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
 try{
  // Read the real app adapter, rather than deriving or guessing a new billiard route.
  const app=await browser.newPage();await app.goto(local+'?h1=romp-kruis');await app.waitForSelector('[data-kz-b3]');
  for(let i=0;i<2;i++){
   const actual=await app.evaluate(()=>window.__stipQaAdapter.lesson1Data('VIJF')),example=fixture.examples[actual.table],kop=actual.journey.find(part=>part.key==='kop');
   pointNear(example.incoming.from,actual.neusPart.from,'actual Neus start');pointNear(example.incoming.to,actual.neusPart.to,'actual Neus contact centre');pointNear(example.outgoing.from,kop.from,'same real band ball');pointNear(example.outgoing.to,kop.to,'actual Kop end');near(example.radiusCm,actual.radiusCm,'real ball radius');near(example.incoming.arrival.value,actual.route.neus.to.value,'Neus A');near(example.outgoing.departure.value,actual.route.kop.from.value,'Kop V');near(example.outgoing.arrival.value,actual.route.kop.to.value,'measured Kop A');
   assert.equal(actual.route.kop.to.measurement,true);await app.locator('#courseTableToggle').click();
  }
  await app.locator('#kzExplanation summary').click();const popupPromise=app.waitForEvent('popup');await app.locator('#lklLineValuesHelp').click();const popup=await popupPromise;await popup.waitForSelector('#diagram svg');assert(popup.url().endsWith('/stiplijnen.html'));await popup.close();await app.close();
  for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:320,height:740},{width:844,height:390}]){
   const page=await browser.newPage({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'stiplijnen.html');await page.waitForSelector('#diagram svg');
   for(const table of ['klein','groot']){
    await page.locator('button[data-table="'+table+'"]').click();const example=fixture.examples[table];
    assert.equal(await page.locator('#diagram svg').getAttribute('data-table'),table);assert.equal(await page.locator('[data-stip-value]').count(),2);assert.equal(await page.locator('[data-bandcontact]').count(),1);
    near(+(await page.locator('[data-stip-value="A"]').getAttribute('data-value')),example.incoming.arrival.value,'diagram A matches app');near(+(await page.locator('[data-stip-value="V"]').getAttribute('data-value')),example.outgoing.departure.value,'diagram V matches app');
    const geometry=await page.locator('#diagram svg').evaluate(svg=>{
     const ends=line=>({a:{x:+line.getAttribute('x1'),y:+line.getAttribute('y1')},b:{x:+line.getAttribute('x2'),y:+line.getAttribute('y2')}}),inLine=ends(svg.querySelector('[data-actual-path="Neus"]')),outLine=ends(svg.querySelector('[data-actual-path="Kop"]')),A=ends(svg.querySelector('[data-line-endpoint="A"]')),V=ends(svg.querySelector('[data-line-endpoint="V"]'));
     const error=(p,a,b)=>Math.abs((p.x-a.x)*(b.y-a.y)-(p.y-a.y)*(b.x-a.x))/Math.hypot(b.x-a.x,b.y-a.y);
     const textOutside=[...svg.querySelectorAll('text')].filter(n=>{const r=n.getBBox();return r.x<0||r.y<0||r.x+r.width>440||r.y+r.height>640;}).map(n=>n.textContent);
     return {inLine,outLine,A,V,arrivalError:error(A.b,inLine.a,inLine.b),departureError:error(V.a,outLine.a,outLine.b),textOutside};
    });
    assert(geometry.arrivalError<1e-4&&geometry.departureError<1e-4,'dashed extensions are collinear with actual paths');pointNear(geometry.inLine.b,geometry.outLine.a,'shared actual centre');assert.deepEqual(geometry.textOutside,[],'labels stay inside exported detail');
    for(const focus of ['incoming','outgoing','both']){await page.locator('[data-focus="'+focus+'"]').click();assert.equal(await page.locator('[data-focus="'+focus+'"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-line="incoming"]').getAttribute('opacity'),focus==='outgoing'?'0.2':'1');assert.equal(await page.locator('[data-line="outgoing"]').getAttribute('opacity'),focus==='incoming'?'0.2':'1');}
    const layout=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));assert(layout.scroll<=layout.width,'no horizontal overflow');
    if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.locator('figure').screenshot({path:path.join(process.env.QA_DIR,'stiplijnen-'+table+'-'+viewport.width+'.png')});}
   }
   const downloadPromise=page.waitForEvent('download');await page.locator('#download-diagram').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'stiplijnen-vijf-groot.svg');assert.equal(await download.failure(),null);assert.deepEqual(errors,[]);console.log(viewport.width,'actual VIJF geometry, one band contact, two line values, focus, SVG export and layout: OK');await page.close();
  }
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
