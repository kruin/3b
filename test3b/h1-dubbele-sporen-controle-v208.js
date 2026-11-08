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
// Two ball-wide corridors overlap even when the B3 centre is off the Romp.
const near=ctx.doubleZone(part(0,0,20,0),part(0,3,20,3),4);
assert(near&&Math.abs(near.nearA.y-near.nearB.y)===3);
const server=http.createServer((req,res)=>{const file=path.resolve(__dirname,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(data);});});

(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
try{for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:844,height:390}]){
 const page=await browser.newPage({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.QA_URL||'http://127.0.0.1:'+server.address().port+'/')+'?h1=romp-kruis');await page.waitForSelector('#h1DoubleTracks',{state:'visible'});
 for(const table of ['klein','groot']){
  assert.equal(await page.locator('#lklExerciseTitle').textContent(),'Kruis ACHT');
  assert.equal(await page.locator('[data-kz-b3]').count(),1);
  assert.equal(await page.locator('#h1DoubleTracks select,#h1AllZones,[data-h1-zone]').count(),0);
  assert((await page.locator('#kzSingleExample').textContent()).includes('Romp VIJF'));
  const result=await page.locator('#lklLessonTable').evaluate(svg=>{
    const ball=svg.querySelector('[data-kz-b3]'),p={x:+ball.getAttribute('cx'),y:+ball.getAttribute('cy')};
    return [...svg.querySelectorAll('line[data-kz-line]')].filter(l=>['Romp VIJF','Kruis ACHT'].includes(l.dataset.kzLine)).map(l=>{
      const a={x:+l.getAttribute('x1'),y:+l.getAttribute('y1')},b={x:+l.getAttribute('x2'),y:+l.getAttribute('y2')},dx=b.x-a.x,dy=b.y-a.y,t=((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy);
      return {t,distance:Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy),endDistance:Math.hypot(p.x-b.x,p.y-b.y)};
    });
  });
  assert.equal(result.length,2);for(const r of result){assert(r.t>1);assert(r.distance<1e-5);assert(Math.abs(r.endDistance-6.15)<1e-5);}
  const clearance=await page.locator('[data-kz-b3]').evaluate(b=>Number(b.dataset.clearance)-Number(b.dataset.diameter));assert(clearance>0);
  assert.equal(await page.locator('[data-kz-b1]').count(),1);
  await page.locator('#kzFollowB1').click();await page.waitForFunction(()=>document.querySelector('#lklLessonTable').dataset.kzDemo==='contact');
  const gap=await page.locator('#lklLessonTable').evaluate(svg=>{const a=svg.querySelector('[data-kz-b1]'),b=svg.querySelector('[data-kz-b3]');return Math.hypot(+a.getAttribute('cx')-+b.getAttribute('cx'),+a.getAttribute('cy')-+b.getAttribute('cy'));});assert(Math.abs(gap-6.15)<1e-5);
  for(const track of ['ACHT','ZEVEN','ZES']){
    assert.equal(await page.locator('#lklExerciseTitle').textContent(),'Kruis '+track);
    assert.equal(await page.locator('[data-kz-b3]').count(),track==='ACHT'?1:0);
    const box=await page.locator('#lklLesson1').evaluate(d=>({r:d.getBoundingClientRect().toJSON(),scroll:d.scrollWidth,client:d.clientWidth}));assert(box.scroll<=box.client+1);assert(box.r.x>=0&&box.r.y>=0&&box.r.bottom<=viewport.height+1);
    if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.QA_DIR,'kruis-'+track+'-'+table+'-'+viewport.width+'.png')});}
    if(track!=='ZES')await page.locator('#nextLklExercise').click();
  }
  await page.locator('#previousLklExercise').click();await page.locator('#previousLklExercise').click();
  await page.locator('#courseTableToggle').click();
 }
 await page.locator('#nextLklExercise').click();await page.locator('#nextLklExercise').click();await page.locator('#nextLklExercise').click();assert(await page.locator('#h1DoubleTracks').isHidden());
 assert.deepEqual(errors,[]);await page.close();
}console.log('KZ OK: ACHT → ZEVEN → ZES, exactly one B3 at the true intersection Kruis ACHT / Romp VIJF; incoming ACHT clears B3, both trajectories stop at first ball contact and B1 follows the route around South, no selectors or zone overview, Klein/Groot desktop/portrait/landscape, H2 navigation, no JS errors.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
