'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert'),{chromium}=require('playwright');
(async()=>{
 const server=http.createServer((req,res)=>{const file=path.join(__dirname,new URL(req.url,'http://localhost').pathname);if(!file.startsWith(__dirname+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(e,data)=>{if(e){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox','--disable-dev-shm-usage']});
  let checked=0,missing=0;
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   const page=await browser.newPage({viewport,isMobile:viewport.width===390,hasTouch:viewport.width===390}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const table of ['klein','groot'])for(const key of ['VIER+3','VIER+4','VIJF-2'])for(const direction of ['west','oost']){
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html?beheerTafel=${table}&beheerSpoor=${encodeURIComponent(key)}#owner=kruin`);await page.waitForSelector('#svgMount .table-svg');
    await page.evaluate(({table,key,direction})=>{for(const [id,value] of [['centralTableMode',table],['trackFamilySelect','parallel'],['centralLineSelect',key],['noseDirection',direction]]){const select=document.getElementById(id);select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));}},{table,key,direction});const selected=await page.evaluate(()=>JSON.parse(localStorage.getItem('3b-canonical-west-v2')).ui);assert.equal(selected.editTable,table);assert.equal(selected.pattern,key.split(/[+-]/)[0]);assert.equal(selected.parallelOffset,Number(key.match(/[+-]\d+$/)[0]));assert.equal(selected.direction,direction);
    const result=await page.locator('#svgMount').evaluate((node,table)=>{const svg=node.querySelector('.table-svg'),groups=[...svg.querySelectorAll('g[data-part="kruis"][data-table]')],balls=groups.flatMap(g=>[...g.querySelectorAll('.ball-visible')].map(b=>({x:Number(b.getAttribute('cx')),y:Number(b.getAttribute('cy'))}))),lines=groups.flatMap(g=>[...g.querySelectorAll('.route-line')].map(l=>Object.fromEntries(['x1','x2','y1','y2'].map(k=>[k,Number(l.getAttribute(k))]))));return {groups:groups.length,balls,lines,table};},table);
    if(table==='groot'&&key.startsWith('VIER')){assert.equal(result.groups,0,'No invented route for missing Groot anchors');missing++;continue;}
    assert.equal(result.groups,1,table+' '+key+' Kruis rendered');assert(result.balls.length>=1);assert.equal(result.lines.length,1);
    for(const p of result.balls)assert(p.x>=110&&p.x<=450&&p.y>=90&&p.y<=770,`${table} ${key} ${direction}: rendered ball outside playing surface ${JSON.stringify(p)}`);
    for(const l of result.lines)assert(l.x1>=110&&l.x1<=450&&l.x2>=110&&l.x2<=450&&l.y1>=90&&l.y1<=770&&l.y2>=90&&l.y2<=770,'Rendered cross outside playing surface');
    checked++;
    if(process.env.QA_DIR&&viewport.width===390&&table==='klein'&&direction==='west'){fs.mkdirSync(process.env.QA_DIR,{recursive:true});await page.locator('#svgMount').screenshot({path:path.join(process.env.QA_DIR,key.replace('+','plus')+'-r15.png')});}
   }
   assert.deepEqual(errors,[]);await page.close();
  }
  assert.equal(checked,16);assert.equal(missing,8);console.log('KRUIS BROWSER OK: 16 desktop/touch renderings, Klein/Groot West/Oost; 8 missing-anchor renderings stay empty; no page errors.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
