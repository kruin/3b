'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require('playwright');
const executablePath=process.env.CHROMIUM_PATH||chromium.executablePath();
if(!fs.existsSync(executablePath)){console.log('OPSTARTCONTROLE OVERGESLAGEN: Chromium ontbreekt.');process.exit(0);}
(async()=>{
 const browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}])for(const configured of [false,true]){
   const page=await browser.newPage({viewport}),errors=[];let requestCount=0,held;
   page.on('pageerror',error=>errors.push(error.message));
   if(configured)await page.route('**/config-v181.js',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(__dirname,'config-v181.js'),'utf8')+"\nTHREEB_START_CONFIG.userAccess.supabase.url='https://example.com';THREEB_START_CONFIG.userAccess.supabase.anonKey='test';"}));
   await page.route('https://cdn.jsdelivr.net/**',route=>{requestCount++;held=route;});
   await page.goto('file://'+path.join(__dirname,'index.html')+'#owner=kruin',{waitUntil:'commit'});
   await page.waitForSelector('.table-svg',{timeout:3000});
   assert.equal(requestCount,configured?1:0);
   if(held)await held.abort();
   assert.deepStrictEqual(errors,[]);
   await page.reload({waitUntil:'commit'});await page.waitForSelector('.table-svg',{timeout:3000});
   if(held)await held.abort().catch(()=>{});
   assert.deepStrictEqual(errors,[]);await page.close();
  }
  console.log('OPSTARTCONTROLE OK: eerste start en refresh op desktop/mobiel; zonder externe configuratie en met een hangende externe dienst.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
