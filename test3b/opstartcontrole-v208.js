'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require('playwright');
const executablePath=process.env.CHROMIUM_PATH||chromium.executablePath();
if(!fs.existsSync(executablePath)){console.log('OPSTARTCONTROLE MISLUKT: Chromium ontbreekt.');process.exit(1);}
(async()=>{
 // Use the supported local HTTP workflow; managed browsers can block file://.
 const server=require('http').createServer((req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;const file=path.join(__dirname,pathname==='/'?'index.html':pathname);if(!file.startsWith(__dirname+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(error,body)=>{if(error){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(body);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}])for(const configured of [false,true]){
   const page=await browser.newPage({viewport}),errors=[];let requestCount=0,held;
   page.on('pageerror',error=>errors.push(error.message));
   if(configured)await page.route('**/config-v208.js',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(__dirname,'config-v208.js'),'utf8')+"\nTHREEB_START_CONFIG.userAccess.supabase.url='https://example.com';THREEB_START_CONFIG.userAccess.supabase.anonKey='test';"}));
   await page.route('https://cdn.jsdelivr.net/**',route=>{requestCount++;held=route;});
   await page.goto(base+'/index.html#owner=kruin',{waitUntil:'commit'});
   await page.waitForSelector('.table-svg',{timeout:8000});
   assert.equal(requestCount,configured?1:0);
   if(held)await held.abort();
   assert.deepStrictEqual(errors,[]);
   await page.reload({waitUntil:'commit'});await page.waitForSelector('.table-svg',{timeout:8000});
   if(held)await held.abort().catch(()=>{});
   assert.deepStrictEqual(errors,[]);await page.close();
  }
  console.log('OPSTARTCONTROLE OK: eerste start en refresh op desktop/mobiel; zonder externe configuratie en met een hangende externe dienst.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
