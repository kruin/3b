'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),http=require('http'),{chromium}=require('playwright');
const root=__dirname,server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream');res.end(data);});});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
 try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   const page=await browser.newPage({viewport,isMobile:viewport.width<600,hasTouch:viewport.width<600}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const base=process.env.QA_URL||'http://127.0.0.1:'+server.address().port+'/';
   await page.goto(base+'?entry=table');await page.waitForSelector('#cleanConfigDialog',{state:'attached'});
   const setRange=async value=>page.locator('#playRange').evaluate((select,value)=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));},value);
   await setRange('lkl');
   const choices=await page.locator('#patternSelect option').evaluateAll(options=>options.map(o=>({value:o.value,text:o.textContent})));
   assert.deepEqual(choices.map(o=>o.value),['VIER','VIJF','ZES','ZEVEN','ACHT','NEGEN']);
   assert.equal(await page.locator('#lineSelectLabel').textContent(),'Patroon','VIJF etc. are named patterns');
   assert.equal(await page.locator('#rangeLabel').textContent(),'Patroonfamilie');
   const baseline=await page.evaluate(()=>{const state=JSON.parse(localStorage.getItem('3b-canonical-west-v2'));const drie=JSON.stringify(state.data.klein.DRIE);state.basis={config:structuredClone(window.THREEB_START_CONFIG),values:window.THREEB_KRUIN_VALUES};state.basis.config.lklTrackRules.panelTracks=['NUL','EEN','TWEE','DRIE','VIER','VIJF','ZES','ZEVEN','ACHT','NEGEN'];state.basis.config.terminology.trackName.default='spoor';state.ui.playRange='lkl';state.ui.pattern='DRIE';state.ui.lineOneMode='basis';localStorage.setItem('3b-canonical-west-v2',JSON.stringify(state));return drie;});
   await page.reload();await page.waitForSelector('#cleanConfigDialog',{state:'attached'});
   assert.equal(await page.locator('#patternSelect').inputValue(),'VIJF','old DRIE LKL selection falls back to VIJF');assert.equal(await page.locator('#lineSelectLabel').textContent(),'Patroon');assert.equal(await page.locator('#patternSelect option[value="DRIE"]').count(),0,'old saved basis uses current LKL scope');
   assert.equal(await page.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('3b-canonical-west-v2')).data.klein.DRIE)),baseline,'excluded pattern data remains stored');
   await setRange('vrij');assert(await page.locator('#patternSelect option[value="DRIE"]').count(),'free play retains DRIE');await setRange('lkl');
   await page.locator('#bandMenu').click();await page.locator('#levelLklCourse').click();await page.waitForSelector('#courseContentsDialog[open]');assert.equal(await page.locator('#openChapterTwo').count(),0);await page.locator('[data-course-intro]').click();await page.waitForSelector('#meetsysteemIntro[open]');
   assert.equal(await page.locator('[data-intro-line="W"]').count(),5,'intro draws VIER through ACHT');
   assert.deepEqual(await page.locator('#meetIntroExample option').evaluateAll(options=>options.map(o=>o.value)),['4','5','6','7','8']);
   assert.equal(await page.locator('[data-line-values-principle]').count(),0,'Waaier comes first');
   await page.locator('#nextMeetIntro').click();
   assert((await page.locator('#meetIntroText>p').first().textContent()).includes('afgeleide waarde'),'R is explained before other introductory text');
   const detail=page.locator('[data-intro-line-values] img');await detail.evaluate(img=>img.decode());assert(await detail.isVisible(),'real contact detail already in first Waaier page');
   if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.QA_DIR,'lijnwaarden-eerste-waaier-'+viewport.width+'.png')});}
   const firstTable=await detail.getAttribute('src');await page.locator('#meetIntroTableSize').click();await detail.evaluate(img=>img.decode());assert.notEqual(await detail.getAttribute('src'),firstTable,'detail follows Klein/Groot');await page.locator('#meetIntroTableSize').click();
   await page.locator('#nextMeetIntro').click();
   const text=await page.locator('#meetIntroText').innerText();assert(text.includes('VIJF is de naam van dit patroon'));assert(text.includes('LKL benoemt de familie'));assert(text.includes('afgeleide waarde'));assert(text.includes('twee lijnen'));
   if(process.env.QA_DIR){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.QA_DIR,'lijnwaarden-intro-'+viewport.width+'.png')});}
   await page.locator('#nextMeetIntro').click();await page.locator('#nextMeetIntro').click();await page.waitForSelector('#lklLesson1[open]');assert((await page.locator('#lklApproach').textContent()).includes('afgeleid'),'line lesson repeats principle');
   const bounds=await page.locator('#lklLesson1').evaluate(d=>d.getBoundingClientRect().toJSON());assert(bounds.x>=0&&bounds.right<=viewport.width+1&&bounds.bottom<=viewport.height+1,'mobile intro stays inside viewport');
   assert.deepEqual(errors,[]);console.log(viewport.width,'LKL >= VIER, pattern names, DRIE retention, free play, five-line intro: OK');await page.close();
  }
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
