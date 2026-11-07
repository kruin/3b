'use strict';
const assert=require('assert'),fs=require('fs'),http=require('http'),path=require('path'),vm=require('vm'),{chromium}=require('playwright');
const source=fs.readFileSync(path.join(__dirname,'spoorscherm-v208.js'),'utf8');
const math=source.slice(source.indexOf('  function distanceToPart('),source.indexOf('  function renderDoubles('));
const ctx={lerp:(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t})};vm.createContext(ctx);vm.runInContext(math,ctx);
const part=(x,y,X,Y)=>({from:{x,y},to:{x:X,y:Y}});
const z=ctx.doubleZone(part(0,0,20,0),part(10,-10,10,10),2);
assert(Math.abs(z.from.x-8)<1e-7&&Math.abs(z.to.x-12)<1e-7);assert.equal(z.hit.x,10);
assert.equal(ctx.doubleZone(part(0,0,20,0),part(0,3,20,3),2),null);
const end=ctx.doubleZone(part(0,0,20,0),part(10,1,10,5),2);
assert(Math.abs(end.from.x-(10-Math.sqrt(3)))<1e-7);assert.equal(end.hit,null);
const server=http.createServer((req,res)=>{const file=path.resolve(__dirname,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(data);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
try{for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:844,height:390}]){
 const page=await browser.newPage({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.QA_URL||'http://127.0.0.1:'+server.address().port+'/')+'?h1=romp-kruis');
 await page.waitForSelector('#h1DoubleTracks',{state:'visible'});
 for(const table of ['klein','groot']){
  assert((await page.locator('#lklExerciseTitle').textContent()).includes('ZEVEN'));
  const romp=page.locator('#h1RompChoice'),kruis=page.locator('#h1KruisChoice');
  const romps=await romp.locator('option').evaluateAll(nodes=>nodes.map(n=>n.value));assert(romps.some(k=>k.includes('+'))&&romps.some(k=>k.includes('-')));
  assert.equal(await page.locator('[data-h1-naive]').count(),0);
  assert.equal(await page.locator('#h1DoubleTracks table').count(),0);
  const allCrosses=new Set();
  for(const key of romps){
    await romp.selectOption(key);assert.equal(await romp.inputValue(),key);
    const crosses=await kruis.locator('option').evaluateAll(nodes=>nodes.map(n=>n.value));
    for(const choice of crosses){allCrosses.add(choice);await kruis.selectOption(choice);assert.equal(await page.locator('[data-h1-zone]').count(),1);}
    if(!crosses.length)assert.equal(await page.locator('[data-h1-zone]').count(),0);
  }
  assert(allCrosses.has('VIJF')&&allCrosses.has('ZES')&&allCrosses.has('ZEVEN')&&allCrosses.has('ACHT'));
  assert([...allCrosses].some(k=>/[+-]/.test(k)));
  await romp.selectOption('ZEVEN');
  console.log(table,viewport.width,'Romp-keuzes',romps.length,'Kruis-keuzes',allCrosses.size);
  const text=await page.locator('#h1DoubleTracks').innerText();assert(!/cm|coördinaten|hoekverschil|r1|r₁/.test(text));assert(text.includes('bal 1 én B3'));
  const box=await page.locator('#lklLesson1').evaluate(d=>({r:d.getBoundingClientRect().toJSON(),scroll:d.scrollWidth,client:d.clientWidth}));assert(box.scroll<=box.client+1);assert(box.r.x>=0&&box.r.y>=0&&box.r.bottom<=viewport.height+1);
  await page.locator('#h1DoubleTracks').scrollIntoViewIfNeeded();if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.QA_DIR,'h1-'+table+'-'+viewport.width+'.png')});}
  await page.locator('#courseTableToggle').click();
 }
 await page.locator('#nextLklExercise').click();assert((await page.locator('#lklExerciseTitle').textContent()).includes('ACHT'));
 await page.locator('#nextLklExercise').click();assert(await page.locator('#h1DoubleTracks').isHidden(),'H2 hides H1 inventory');
 assert.deepEqual(errors,[]);await page.close();
}console.log('H1 OK: capsule boundaries, endpoints, no-contact; direct H1, ZEVEN choice tracks, zones with both ball widths and no calculation details on Klein/Groot at desktop and portrait/landscape touch viewports; H2 navigation; no JS errors.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
