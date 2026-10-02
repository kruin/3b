'use strict';const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os'),assert=require('assert');
const executablePath=process.env.CHROMIUM_PATH||chromium.executablePath();
if(!fs.existsSync(executablePath)){console.log('SQLITE-BROWSERCONTROLE OVERGESLAGEN: Chromium ontbreekt.');process.exit(0);}
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'3b-sqlite-ui-'));fs.cpSync(path.dirname(__dirname),temp,{recursive:true});
 const privateDir=path.join(temp,'3B-private-Kruinconfig-v181'),publicDir=path.join(temp,'3B-openbare-app-v181'),python=process.platform==='win32'?'python':'python3';
 const child=cp.spawn(python,[path.join(privateDir,'Kruinconfig_server.py'),publicDir,'--no-browser']);
 const base=await new Promise((resolve,reject)=>{let output='';child.stdout.on('data',data=>{output+=data;const m=output.match(/Kruinconfig-editor: (http:\/\/[^/]+)/);if(m)resolve(m[1]);});child.on('error',reject);child.on('exit',code=>reject(Error('Server exit '+code)));});
 const browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<500}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/beheer');await page.waitForSelector('#values tbody tr');assert.equal(await page.locator('#values tbody tr').count(),9);
  await page.locator('#romp-A-waarde').fill('36.1256789');await page.locator('#romp-A-herkomst').selectOption('kruin_measured');await page.locator('#save').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Bewaard in SQLite'));
  await page.reload();await page.waitForSelector('#values tbody tr');assert.equal(await page.locator('#romp-A-waarde').inputValue(),'36.1256789');
  const link=await page.locator('#tableLink').getAttribute('href');await page.goto(base+link);await page.waitForSelector('.table-svg');
  const route=await page.evaluate(()=>JSON.parse(localStorage.getItem('3b-canonical-west-v2')).data.klein.VIJF.romp.to);assert.equal(route.value,36.1256789);assert.equal(route.measurement,true);
  await page.goto(base+'/beheer');await page.waitForSelector('#values tbody tr');assert.equal(await page.locator('#romp-A-waarde').inputValue(),'36.1256789');
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);assert(width<=viewport.width+1,'Het beheerblad moet tabelscroll gebruiken, geen paginabrede uitloop');
  await page.screenshot({path:'/tmp/3b181-sqlite-'+viewport.width+'.png',fullPage:true});assert.deepStrictEqual(errors,[]);await page.close();
 }console.log('SQLITE-BROWSERCONTROLE OK: desktop/mobiel, losse waarden bewaren, reload, herkomst, controletafel en tabelscroll.');
 }finally{await browser.close();child.kill();await new Promise(r=>child.once('exit',r));fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
