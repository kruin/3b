'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require('playwright');
const executablePath=process.env.CHROMIUM_PATH||chromium.executablePath();
if(!fs.existsSync(executablePath)){console.log('CURSUSCONTROLE OVERGESLAGEN: Chromium ontbreekt.');process.exit(0);}
const root=__dirname,server=http.createServer((req,res)=>{const file=path.resolve(root,new URL(req.url,'http://localhost').pathname.slice(1)||'index.html');if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(fs.readFileSync(file));});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<500}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const key='3b-canonical-west-v2';
  const reopen=async()=>{if(await page.locator('#tableStartCue').isVisible())await page.locator('#tableStartCue').click();await page.locator('#bandMenu').click();await page.locator('#openExplanation').click();await page.waitForSelector('#explanationCarousel',{state:'visible'});};
  await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForSelector('#explanationCarousel',{state:'visible'});
  assert((await page.locator('#explanationLevel').textContent()).includes('Bal zoekt spoor'));
  await page.locator('#courseTableSelect').selectOption('klein');
  assert.equal(await page.locator('#explanationVisual .table-svg').count(),1);
  assert.equal(await page.locator('#explanationVisual g[data-part]').count(),2);
  assert.equal(await page.locator('#explanationVisual .series-overview').count(),0);
  const layout=await page.locator('#explanationVisual .table-svg').evaluate(svg=>{const a=svg.getBoundingClientRect(),v=svg.closest('.explanation-visual').getBoundingClientRect();return a.left>=v.left-1&&a.right<=v.right+1&&a.top>=v.top-1&&a.bottom<=v.bottom+1;});assert(layout,'Lesbeeld valt buiten het beeldvak');
  const controls=await page.locator('#bandMenu').evaluate(el=>getComputedStyle(el).visibility);assert.equal(controls,'hidden');
  await page.locator('#nextExplanation').click();assert((await page.locator('#explanationTitle').textContent()).includes('Karkas'));await page.locator('#nextExplanation').click();await page.getByRole('button',{name:'Nee, naast de Romp',exact:true}).click();assert((await page.locator('#courseFeedback').textContent()).includes('middelpunt'));
  await page.getByRole('button',{name:'Ja, op de Romp',exact:true}).click();
  await page.locator('#nextExplanation').click();await page.getByRole('button',{name:'Naar de Neus · lengte instellen',exact:true}).click();
  await page.waitForSelector('#lineEditor',{state:'visible'});assert(await page.locator('#noseLengthEditor').isVisible());assert(!(await page.locator('#lineEditorValues').isVisible()));
  await page.locator('#closeLineEditor').click();await reopen();assert((await page.locator('#explanationTitle').textContent()).includes('speelbal'));
  await page.locator('#nextExplanation').click();await page.locator('#nextExplanation').click();
  await page.locator('#courseAttempt1').fill('36.1256789');await page.getByRole('button',{name:'Toon poging 1 op mijn tafel',exact:true}).click();
  const data=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).data.klein.VIJF.romp,key);assert.equal(data.to.value,36.1256789);assert.equal(data.from.value,20);
  await reopen();assert((await page.locator('#explanationTitle').textContent()).includes('Romplijn vast'));
  await page.locator('#nextExplanation').click();await page.locator('#courseAttempt2').fill('36.25');await page.locator('#courseAttempt3').fill('36.5');
  await page.reload();await page.waitForSelector('.table-svg');await reopen();assert((await page.locator('#explanationTitle').textContent()).includes('herhaal'));
  assert.equal(await page.locator('#courseAttempt1').inputValue(),'36.1256789');assert.equal(await page.locator('#courseAttempt3').inputValue(),'36.5');
  await page.locator('#nextExplanation').click();assert(await page.locator('#completeCourseLesson').isDisabled());await page.locator('#courseCanRepeat').check();await page.locator('#completeCourseLesson').click();assert((await page.locator('#courseCompletionStatus').textContent()).includes('Les 1 bewaard'));
  await page.getByRole('button',{name:'Verder · VIJF+1 en VIJF−1',exact:true}).click();assert((await page.locator('#explanationLevel').textContent()).includes('Les 2'));
  assert((await page.locator('#explanationVisual .table-svg').getAttribute('aria-label')).includes('VIJF+1'));
  await page.locator('#nextExplanation').click();await page.getByRole('button',{name:'Toon VIJF+1 op mijn tafel',exact:true}).click();
  const ui=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).ui,key);assert.equal(ui.parallelOffset,1);assert.equal(ui.lineOneMode,'parallel');
  await reopen();await page.locator('#changeCourseAssessment').click();await page.locator('[data-course-assessment="explore-tracks"]').click();
  while(!(await page.locator('#explanationTitle').textContent()).includes('Spoor VIER')){assert(!(await page.locator('#nextExplanation').isDisabled()));await page.locator('#nextExplanation').click();}
  const labels=await page.locator('#explanationVisual .table-svg').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));assert(labels.every(text=>text.includes('Spoor VIER')),'VIER gebruikt de verkeerde tekening');
  await page.locator('#closeExplanation').click();
  if(await page.locator('#tableStartCue').isVisible())await page.locator('#tableStartCue').click();
  await page.locator('#bandMenu').click();await page.locator('#menuSettings summary').click();
  const oldId=await page.locator('#tableBasisSelect option').evaluateAll(nodes=>nodes.map(n=>n.value).find(id=>id.startsWith('kruin-v174-')));assert(oldId);
  await page.locator('#tableBasisSelect').selectOption(oldId);page.once('dialog',dialog=>dialog.accept());await page.locator('#chooseTableBasis').click();
  await page.waitForFunction(({key,id})=>JSON.parse(localStorage.getItem(key))?.basis?.id===id,{key,id:oldId});await page.waitForSelector('.table-svg');
  if(!(await page.locator('#explanationCarousel').isVisible()))await reopen();assert((await page.locator('#explanationLevel').textContent()).includes('Bal zoekt spoor'),'Oudere basis krijgt de actuele cursus');
  assert.deepStrictEqual(errors,[]);await page.close();
 }
 console.log('CURSUSCONTROLE OK: desktop/mobiel, twee lijnen zonder overliggende bediening, doelbalfeedback, vaste Neus, drie exacte Rompnotities, V ongewijzigd, les bewaren/hervatten, Parallel voor Waaier en juiste VIER-tekening.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
