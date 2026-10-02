'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),os=require('os');
const {chromium}=require('playwright');
const executablePath=process.env.CHROMIUM_PATH||chromium.executablePath();
if(!fs.existsSync(executablePath)){console.log('TAFELBESTAND UI OVERGESLAGEN: Chromium ontbreekt.');process.exit(0);}
const root=__dirname,temp=fs.mkdtempSync(path.join(os.tmpdir(),'3b-tafelbestanden-'));
let upgraded=false;
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,name);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}
 let bytes=fs.readFileSync(file);
 if(upgraded&&name==='basis-catalogus-v178.js')bytes=Buffer.from(bytes.toString()+`\nconst testBasis=JSON.parse(JSON.stringify(THREEB_BASES.at(-1)));testBasis.id='kruin-test-nieuw-laken';testBasis.label='Nieuw laken';testBasis.values.tracks.klein.VIJF.rompA.value=31;THREEB_BASES.push(testBasis);THREEB_DEFAULT_BASIS=testBasis.id;`);
 if(upgraded&&name==='kruinwaarden-generated-v178.js')bytes=Buffer.from(bytes.toString()+`\nTHREEB_KRUIN_VALUES.tracks.klein.VIJF.rompA.value=31;`);
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'application/octet-stream');res.end(bytes);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   upgraded=false;
   const page=await browser.newPage({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<500});
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.route('https://cdn.jsdelivr.net/**',route=>route.abort());
   const url=`http://127.0.0.1:${server.address().port}/`;
   await page.goto(url);await page.waitForSelector('.table-svg');
   const key='3b-canonical-west-v2';
   await page.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key));s.data.klein.VIJF.romp.to={band:'zuid',value:36.123456789,status:'edited',source:'user',userAdjusted:true};s.strokeLengthsCm={klein:{VIJF:83.987654321}};s.departurePositions['klein:VIJF']=0;s.variantData.klein={'VIJF+1':JSON.parse(JSON.stringify(s.data.klein.VIJF))};s.bandOverrides={klein:{VIJF:{romp:{from:'oost',to:'zuid'}}}};s.tableName='Café Kruin, tafel 2';localStorage.setItem(key,JSON.stringify(s));},key);
   await page.reload();await page.waitForSelector('.table-svg');
   const expected=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
   assert.equal(expected.data.klein.VIJF.romp.to.value,36.123456789,'Reload rondt af');
   if(await page.locator('#tableStartCue').isVisible())await page.locator('#tableStartCue').click();
   await page.locator('#bandMenu').click();await page.locator('#menuSettings summary').click();
   const downloads=[];
   for(const format of ['xlsx','ods','sqlite3','csv']){
    await page.locator('#tableFileFormat').selectOption(format);
    const pending=page.waitForEvent('download');await page.locator('#downloadTableFile').click();const download=await pending;
    const dest=path.join(temp,viewport.width+'-'+download.suggestedFilename());await download.saveAs(dest);downloads.push(dest);
   }
   upgraded=true;
   await page.reload();await page.waitForSelector('.table-svg');
   assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).basis.id,key),expected.basis.id,'Nieuwe publicatie vervangt de eigen basis');
   for(const file of downloads){
    await page.evaluate(key=>localStorage.removeItem(key),key);await page.reload();await page.waitForSelector('.table-svg');
    assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).basis.id,key),'kruin-test-nieuw-laken');
    // Input remains available within the settings menu; upload itself triggers a complete reload.
    await page.locator('#importTableFile').setInputFiles(file);
    await page.waitForFunction(({key,id})=>JSON.parse(localStorage.getItem(key))?.basis?.id===id,{key,id:expected.basis.id});
    await page.waitForSelector('.table-svg');
    const restored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
    for(const field of ['data','variantData','strokeLengthsCm','departurePositions','bandOverrides','tableName','basis'])assert.deepStrictEqual(restored[field],expected[field],path.extname(file)+' '+field);
   }
   if(await page.locator('#tableStartCue').isVisible())await page.locator('#tableStartCue').click();
   await page.locator('#bandMenu').click();await page.locator('#menuSettings summary').click();
   await page.locator('#tableBasisSelect').selectOption('kruin-test-nieuw-laken');page.once('dialog',dialog=>dialog.accept());
   await page.locator('#chooseTableBasis').click();await page.waitForSelector('.table-svg');
   await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key))?.basis?.id==='kruin-test-nieuw-laken',key);
   const changed=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
   assert.equal(changed.data.klein.VIJF.romp.to.value,31,'Bewuste basiskeuze gebruikt de nieuwe waarde');
   assert.equal(changed.tableName,expected.tableName);
   assert.deepStrictEqual(errors,[]);
   await page.close();
  }
  console.log('TAFELBESTAND UI OK: desktop/mobiel, downloads en terugladen in alle vier formaten na nieuwe Kruinpublicatie; oude basis, decimalen en tafelnaam blijven behouden; bewuste basiskeuze werkt.');
 }finally{await browser.close();server.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
