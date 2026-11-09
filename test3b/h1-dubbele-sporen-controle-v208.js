'use strict';
const assert=require('assert'),fs=require('fs'),http=require('http'),path=require('path'),vm=require('vm'),{chromium}=require('playwright');
const source=fs.readFileSync(path.join(__dirname,'spoorscherm-v208.js'),'utf8');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('window.ThreeBKzSolver='),source.indexOf('/* Fixed course sequence.')),ctx);
const S=ctx.window.ThreeBKzSolver;
const part=(x,y,X,Y)=>({from:{x,y},to:{x:X,y:Y}});
const fixture={track:'T',radiusCm:2,rompPart:part(10,50,90,50),kruisPart:part(90,50,90,10)};
assert(S.solutions([fixture],{x:50,y:54.9},3).some(s=>s.kind==='romp'),'r1+r3');
assert.equal(S.solutions([fixture],{x:50,y:55.1},3).length,0);
assert.equal(S.solutions([fixture],{x:94,y:25},3)[0].kind,'kruis');
const loop={...fixture,kruisPart:part(90,50,10,50)};
assert.equal(S.solutions([loop],{x:50,y:50},3).filter(s=>s.kind==='kruis').length,0,'Romp first contact blocks Kruis');
assert.equal(S.contact(part(10,50,20,50),{x:30,y:50},5),null,'finite segment');
assert.equal(S.contact(part(10,50,10,50),{x:10,y:50},5),null);
assert.equal(S.solutions([{...fixture,rompPart:null}],{x:94,y:25},3).length,0,'unknown approach');
const server=http.createServer((req,res)=>{
 const f=path.resolve(__dirname,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));
 if(!f.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(f,(e,b)=>{if(e){res.writeHead(404).end();return;}
 let body=b;if(f.endsWith('spoorscherm-v208.js'))body=b.toString().replace('window.installThreeBLklLesson=adapter=>{','window.installThreeBLklLesson=adapter=>{window.__kzQaAdapter=adapter;');
 res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':f.endsWith('.css')?'text/css':'application/octet-stream');res.end(body);
 });
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
 try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844},{width:844,height:390}].filter(v=>!process.env.QA_WIDTH||v.width===+process.env.QA_WIDTH)){
   const page=await browser.newPage({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto((process.env.QA_URL||'http://127.0.0.1:'+server.address().port+'/')+'?h1=romp-kruis');
   await page.waitForSelector('[data-kz-b3]');
   assert(await page.locator('#courseScreenConfig').isVisible());assert(await page.locator('#lklExerciseText').isHidden(),'Kruis explanation collapsed');
   await page.locator('#kzExplanation summary').click();assert(await page.locator('#lklExerciseText').isVisible());await page.locator('#kzExplanation summary').click();
   assert.equal(await page.locator('#tableTextConfig').evaluate(n=>n.parentElement.id),'generalDisplaySettings');
   assert.equal(await page.locator('#mobilePreview').evaluate(n=>n.parentElement.id),'generalAdminSettings');
   assert.equal(await page.locator('#bandCore').evaluate(n=>n.parentElement.id),'generalMeasureSettings');
   assert.equal(await page.locator('#lklLessonTitle').textContent(),'kruis 0.1');assert((await page.title()).includes('kruis 0.1'));
   for(const table of ['klein','groot']){
    const savedData=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('3b-canonical-west-v2')||'{}');return JSON.stringify([s.data,s.startAcquitRoutes,s.variantData]);});
    const position=()=>page.locator('[data-kz-b3]').evaluate(n=>({x:+n.getAttribute('cx'),y:+n.getAttribute('cy'),r:+n.getAttribute('r')}));
    const keys=()=>page.locator('[data-kz-match]').evaluateAll(nodes=>nodes.map(n=>n.dataset.kzMatch).sort());
    const verify=async()=>{
      const p=await position(),found=await keys();
      // Independent quadratic contact oracle against actual application paths, local QA only.
      const expected=await page.evaluate(({p})=>{
       const a=window.__kzQaAdapter;if(!a)return null;
       const contact=(s,D)=>{if(!s)return false;const vx=s.to.x-s.from.x,vy=s.to.y-s.from.y,dx=s.from.x-p.x,dy=s.from.y-p.y,A=vx*vx+vy*vy,B=2*(dx*vx+dy*vy),C=dx*dx+dy*dy-D*D,disc=B*B-4*A*C;if(!A||disc<0)return false;const t=(-B-Math.sqrt(disc))/(2*A);return t>=0&&t<=1;};
       const distance=s=>{const vx=s.to.x-s.from.x,vy=s.to.y-s.from.y,u=Math.max(0,Math.min(1,((p.x-s.from.x)*vx+(p.y-s.from.y)*vy)/(vx*vx+vy*vy)));return Math.hypot(p.x-s.from.x-u*vx,p.y-s.from.y-u*vy);};
       const out=[];for(const key of a.courseTrackKeys()){let t;try{t=a.lesson1Data(key);}catch(_){continue;}const D=t.radiusCm+p.r,b=t.rompPart,c=t.kruisPart;if(contact(b,D))out.push('romp:'+key);if(b&&c&&distance(b)>D+1e-8&&Math.hypot(b.to.x-c.from.x,b.to.y-c.from.y)<1e-4&&contact(c,D))out.push('kruis:'+key);}
       return out.sort();
      },{p});
      if(expected)assert.deepEqual(found,expected,'all and only available first-contact solutions');
      const drawing=await page.locator('#lklLessonTable').evaluate(svg=>{
       const b=svg.querySelector('[data-kz-b3]'),a=svg.querySelector('[data-kz-b1]');
       return {count:+svg.dataset.kzMatchCount,kind:svg.dataset.kzSolutionKind,gap:a?Math.hypot(+a.getAttribute('cx')-+b.getAttribute('cx'),+a.getAttribute('cy')-+b.getAttribute('cy')):null,D:a?+a.getAttribute('r')+ +b.getAttribute('r'):null,widths:[...svg.querySelectorAll('[data-kz-ballwidth]')].map(n=>+n.getAttribute('stroke-width')),diameter:a?2* +a.getAttribute('r'):null};
      });
      assert.equal(await page.locator('[data-kz-alternative]').count(),found.length===2?1:0,'only one alternative gets a thin path');
      assert.equal(await page.locator('[data-kz-alternatives-alert]').count(),found.length>2?1:0,'alert for multiple alternatives');
      const nose=page.locator('[data-kz-line^="Neus "]');assert.equal(await nose.count(),found.length?1:0,'Neus follows the selected solution');
      if(found.length){const selected=await page.locator('#lklLessonTable').getAttribute('data-kz-solution-track');assert.equal(await nose.getAttribute('data-kz-line'),'Neus '+selected.replace('-','−'));}
      assert.equal(drawing.count,found.length);for(const w of drawing.widths)assert(Math.abs(w-drawing.diameter)<1e-9);
      if(found.length)assert(Math.abs(drawing.gap-drawing.D)<1e-5,'display B1 at physical first contact');
      const box=await page.locator('#lklLesson1').evaluate(d=>({r:d.getBoundingClientRect().toJSON(),w:d.scrollWidth,c:d.clientWidth}));assert(box.w<=box.c+1);assert(box.r.x>=0&&box.r.y>=0&&box.r.bottom<=viewport.height+1);
      return found;
    };
    const nearby=await page.locator('#kzResults').evaluate(n=>{const r=n.getBoundingClientRect(),info=n.closest('.lkl-course-info').getBoundingClientRect(),table=document.querySelector('#lklLessonTable').getBoundingClientRect();return {top:r.top,infoTop:info.top,bottom:r.bottom,infoBottom:info.bottom,tableBottom:table.bottom};});
    assert(Math.abs(nearby.top-nearby.infoTop)<3,'solution buttons start next to table, before explanatory text');
    if(viewport.width===390)assert(nearby.top-nearby.tableBottom<15&&nearby.bottom<=nearby.infoBottom,'mobile solutions visible immediately below table');
    const samples=[];
    for(const [i,[romp,kruis]]of [['VIJF','ACHT'],['VIJF','ZEVEN'],['VIJF-1','ZES']].entries()){
      await page.locator('[data-kz-example="case-'+i+'"]').click();
      const found=await verify();assert(found.includes('romp:'+romp));assert(found.includes('kruis:'+kruis));samples.push(await position());
      if(found.length===2){const alternative=page.locator('[data-kz-alternative]'),key=await alternative.getAttribute('data-kz-alternative');assert.equal(await alternative.locator('[data-kz-ballwidth]').count(),0);await alternative.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-kz-match=\"'+key+'\"]').getAttribute('aria-pressed'),'true');assert.deepEqual(await position(),samples.at(-1));await verify();}
      await page.locator('[data-kz-match="kruis:'+kruis+'"]').click();assert.deepEqual(await position(),samples.at(-1));await verify();
    }
    await page.locator('#courseScreenConfig').click();
    const limit=page.locator('#kzAlternativeLimit'),beforeConfig=await position(),available=Math.max(0,(await keys()).length-1);
    await limit.selectOption('all');assert.equal(await page.locator('[data-kz-alternative]').count(),available);assert.equal(await page.locator('[data-kz-alternatives-alert]').count(),0);
    if(available){const alt=page.locator('[data-kz-alternative]').first(),key=await alt.getAttribute('data-kz-alternative');await alt.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-kz-match="'+key+'"]').getAttribute('aria-pressed'),'true');}
    await limit.selectOption('0');assert.equal(await page.locator('[data-kz-alternative]').count(),0);assert.equal(await page.locator('[data-kz-alternatives-alert]').count(),0);
    await limit.selectOption('2');assert.equal(await page.locator('[data-kz-alternative]').count(),available<=2?available:0);assert.equal(await page.locator('[data-kz-alternatives-alert]').count(),available>2?1:0);
    assert.deepEqual(await position(),beforeConfig,'display config preserves B3');
    await page.reload();await page.waitForSelector('[data-kz-b3]');assert.equal(await limit.inputValue(),'2','alternative limit persists');
    if(!await page.locator('#kzAlternativeConfig').getAttribute('open'))await page.locator('#courseScreenConfig').click();
    await limit.selectOption('1');await page.locator('#courseScreenConfig').click();await verify();
    const geometry=await page.evaluate(()=>{const a=window.__kzQaAdapter;if(a)return a.lesson1Data('VIJF').geometry;const c=window.THREEB_START_CONFIG;return c.tables[document.querySelector('#lklLesson1').dataset.table];});
    const screen=async p=>page.locator('#lklLessonTable').evaluate((svg,p)=>{const q=new DOMPoint(p.x,p.y).matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y};},p);
    const tap=async p=>{const q=await screen(p);if(viewport.width===390)await page.touchscreen.tap(q.x,q.y);else await page.mouse.click(q.x,q.y);};
    // Drag the visible B3 through new positions. No confirmation or submit button.
    let p=await position(),from=await screen(p),to=await screen({x:geometry.widthCm*.65,y:geometry.heightCm*.65});
    if(viewport.width===390){
      const cdp=await page.context().newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:from.x,y:from.y,id:1}]});
      for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/8,y:from.y+(to.y-from.y)*i/8,id:1}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
    }else{await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:8});await page.mouse.up();}
    const moved=await position();assert(Math.hypot(moved.x-p.x,moved.y-p.y)>3);assert(Math.hypot(moved.x-geometry.widthCm*.65,moved.y-geometry.heightCm*.65)<.01,'Drag follows pointer exactly');await verify();
    await tap({x:geometry.widthCm/2,y:10});
    assert.equal((await verify()).length,0,'no invented solution where no available paths pass');
    await page.locator('[data-kz-example="case-0"]').click();await verify();
    p=await position();await page.locator('[data-kz-nudge="rechts"]').click();assert(Math.abs((await position()).x-p.x-1)<1e-6);await verify();
    await page.locator('#lklLessonTable').focus();p=await position();await page.keyboard.press('ArrowLeft');assert(Math.abs((await position()).x-p.x+1)<1e-6);await verify();
    if(!process.env.QA_STATIC&&viewport.width===1280){await page.locator('[data-kz-match="kruis:ACHT"]').click();await page.locator('#kzFollowB1').click();await page.waitForFunction(()=>document.querySelector('#lklLessonTable').dataset.kzDemo==='contact');await verify();}
    if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.QA_DIR,'user-b3-'+table+'-'+viewport.width+'.png')});}
    assert.equal(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('3b-canonical-west-v2')||'{}');return JSON.stringify([s.data,s.startAcquitRoutes,s.variantData]);}),savedData,'B3 moves must not edit measured routes');
    console.log(table,viewport.width,'dynamic matches, drag/tap, first contacts, ball widths');
    await page.locator('#courseTableToggle').click();
   }
   for(let i=0;i<3;i++)await page.locator('#nextLklExercise').click();assert(await page.locator('#h1DoubleTracks').isHidden(),'H2 navigation');assert(await page.locator('#courseScreenConfig').isHidden());assert(await page.locator('#lklExerciseText').isVisible(),'H2 lesson explanation restored');assert.equal(await page.locator('#lklLessonTable').evaluate(svg=>svg.style.touchAction),'');
   await page.goto((process.env.QA_URL||'http://127.0.0.1:'+server.address().port+'/')+'?h1=romp-kruis&kruis=ZES');await page.waitForSelector('[data-kz-b3]');assert(await page.locator('[data-kz-match="kruis:ZES"]').count());assert(await page.locator('[data-kz-match="romp:VIJF-1"]').count());
   await page.locator('#closeLklLesson').click();await page.locator('#bandMenu').click();await page.locator('#cleanConfigMore>summary').click();
   assert(await page.locator('#generalDisplayConfig>summary').isVisible());assert(await page.locator('#generalMeasureConfig>summary').isVisible());assert(await page.locator('#generalAdminConfig>summary').isVisible());
   assert(await page.locator('#mobilePreview').isHidden(),'test tools collapsed separately');
   for(const id of ['generalDisplayConfig','generalMeasureConfig','generalAdminConfig']){await page.locator('#'+id+'>summary').click();const size=await page.locator('#cleanConfigDialog').evaluate(d=>({x:d.getBoundingClientRect().x,width:d.getBoundingClientRect().width}));assert(size.x>=0&&size.x+size.width<=viewport.width+1,'general config fits mobile');await page.locator('#'+id+'>summary').click();}
   await page.locator('#closeCleanConfig').click();
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('USER KZ OK: moving B3 dynamically recomputes all matching Rompen/Kruisen; independent contact oracle, unequal radii, early Romp-hit rejection, empty positions, real ball-width paths, Klein/Groot desktop and touch viewports.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
