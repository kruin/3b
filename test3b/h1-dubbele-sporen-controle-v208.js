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
try{for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:844,height:390}].filter(v=>!process.env.QA_WIDTH||v.width===Number(process.env.QA_WIDTH))){
 const page=await browser.newPage({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.QA_URL||'http://127.0.0.1:'+server.address().port+'/')+'?h1=romp-kruis');await page.waitForSelector('#h1DoubleTracks',{state:'visible'});


 for(const table of ['klein','groot']){
  const centers=[];
  for(let group=0;group<3;group++){
   let fixed=null;
   for(let stage=0;stage<3;stage++){
    const title=await page.locator('#lklExerciseTitle').textContent();
    assert(title.includes(stage===0?'Achterompositie · '+['ACHT','ZEVEN','ZES'][group]:'Oplossing '+stage));
    assert.equal(await page.locator('[data-kz-b3]').count(),1);
    assert.equal(await page.locator('#kzExamples button').count(),3);
    assert.equal(await page.locator('#h1DoubleTracks select,#h1AllZones,[data-h1-zone]').count(),0);
    const geometry=await page.locator('#lklLessonTable').evaluate(svg=>{
      const ball=svg.querySelector('[data-kz-b3]'),p={x:+ball.getAttribute('cx'),y:+ball.getAttribute('cy')};
      return {p,example:svg.dataset.kzExample,lines:[...svg.querySelectorAll('line[data-kz-line]')].map(l=>{
        const a={x:+l.getAttribute('x1'),y:+l.getAttribute('y1')},b={x:+l.getAttribute('x2'),y:+l.getAttribute('y2')},dx=b.x-a.x,dy=b.y-a.y,t=((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy),u=Math.max(0,Math.min(1,t));
        return {name:l.dataset.kzLine,distance:Math.hypot(p.x-a.x-u*dx,p.y-a.y-u*dy),endDistance:Math.hypot(p.x-b.x,p.y-b.y)};
      })};
    });
    assert.equal(geometry.example,['ACHT','ZEVEN','ZES'][group]);
    if(fixed)assert.deepEqual(geometry.p,fixed,'B3 must stay exactly fixed within one example');else {fixed=geometry.p;centers.push(fixed);}
    if(stage===0){assert.equal(geometry.lines.length,2);for(const l of geometry.lines)assert(l.distance>6.65,'Miss before AND after the band');}
    else {assert.equal(geometry.lines.length,1);assert(Math.abs(geometry.lines[0].endDistance-6.15)<1e-5,'Real first ball contact');}
    if(viewport.width===1280||group===0&&stage===0){
      await page.locator('#kzFollowB1').click();await page.waitForFunction(expected=>document.querySelector('#lklLessonTable').dataset.kzDemo===expected,stage===0?'miss':'contact');
      const gap=await page.locator('#lklLessonTable').evaluate(svg=>{const a=svg.querySelector('[data-kz-b1]'),b=svg.querySelector('[data-kz-b3]');return Math.hypot(+a.getAttribute('cx')-+b.getAttribute('cx'),+a.getAttribute('cy')-+b.getAttribute('cy'));});
      if(stage===0)assert(gap>6.15);else assert(Math.abs(gap-6.15)<1e-5);
    }
    const box=await page.locator('#lklLesson1').evaluate(d=>({r:d.getBoundingClientRect().toJSON(),scroll:d.scrollWidth,client:d.clientWidth}));assert(box.scroll<=box.client+1,JSON.stringify({viewport,table,group,stage,box}));assert(box.r.x>=0&&box.r.y>=0&&box.r.bottom<=viewport.height+1);
    if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.QA_DIR,'kz-'+group+'-'+stage+'-'+table+'-'+viewport.width+'.png')});}
    if(group<2||stage<2)await page.locator('#nextLklExercise').click();
   }
  }
  for(let i=0;i<centers.length;i++)for(let j=0;j<i;j++)assert(Math.hypot(centers[i].x-centers[j].x,centers[i].y-centers[j].y)>3,'Distinct examples');
  await page.locator('#kzExamples button[data-kz-example="ACHT"]').click();
  assert((await page.locator('#lklExerciseTitle').textContent()).includes('ACHT mist'));
  console.log(table,viewport.width,'3 distinct achterom positions, 6 solutions, fixed B3 per example');
  await page.locator('#courseTableToggle').click();
 }
 for(let i=0;i<9;i++)await page.locator('#nextLklExercise').click();assert(await page.locator('#h1DoubleTracks').isHidden());
 assert.deepEqual(errors,[]);await page.close();
}console.log('KZ OK: 3 achterom examples and 6 solutions PER table, ACHT/ZEVEN/ZES, separate real geometries for Klein/Groot, fixed B3 per example, both ball radii, 9 screens, animations, desktop/portrait/landscape, example navigation and H2.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
