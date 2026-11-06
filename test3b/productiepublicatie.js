/* Production can only be requested from Kruin's test UI. Never used by Codex tests against real writes. */
(() => {
'use strict';
const api='https://api.github.com/repos/kruin/3b',encoder=new TextEncoder();
const labels={data:'Meetgegevens',app:'App en cursus',both:'Beide'};
const hex=bytes=>Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
const sha256=bytes=>crypto.subtle.digest('SHA-256',bytes).then(hex);
const gitsha=async bytes=>{const h=encoder.encode('blob '+bytes.length+'\0'),all=new Uint8Array(h.length+bytes.length);all.set(h);all.set(bytes,h.length);return hex(await crypto.subtle.digest('SHA-1',all));};
const b64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);};
const safe=p=>typeof p==='string'&&p.length<220&&!p.startsWith('/')&&!p.split('/').some(x=>!x||x==='.'||x==='..')&&!/sqlite|\.git|test3b|publicatie|token/i.test(p)&&/^[a-zA-Z0-9_.\/-]+$/.test(p);
function client(token){return async(path,method='GET',body)=>{const response=await fetch(api+path,{method,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store',credentials:'omit',redirect:'error'});if(!response.ok)throw Object.assign(Error(response.status===401?'GitHub-toegang verlopen.':response.status===403||response.status===404?'Geen publicatierecht. Kies bij je token eigenaar kruin en repository 3b met Contents: Read and write. Voor meetgegevens is ook lezen van 3b-kruin-beheer nodig.':response.status===409||response.status===422?'GitHub is intussen gewijzigd. Er is niets overschreven. Open de publicatie opnieuw.':'GitHub-aanvraag mislukt ('+response.status+').'),{status:response.status});return response.status===204?null:await response.json();};}
function allowed(){return /\/test3b\/publiceer\.html$/.test(location.pathname)&&new URLSearchParams(location.hash.slice(1)).get('owner')==='kruin';}
async function prepare(choice,token){
 if(!allowed())throw Error('Publiceren kan alleen vanuit Kruin-beheer op test.');
 if(!labels[choice]||!String(token).trim())throw Error('Kies wat je wilt publiceren en verbind met GitHub.');
 const request=client(String(token).trim()),response=await fetch('publicatie/kandidaat.json',{cache:'no-store'});if(!response.ok)throw Error('Geen geteste publicatiekandidaat beschikbaar.');
 const raw=new Uint8Array(await response.arrayBuffer()),manifest=JSON.parse(new TextDecoder().decode(raw));
 if(manifest.schema!==1||!/^v\d+-r\d+$/.test(manifest.version)||!Array.isArray(manifest.files))throw Error('Ongeldige publicatiekandidaat.');
 const head=(await request('/git/ref/heads/main')).object.sha;
 const published=await request('/contents/test3b/publicatie/kandidaat.json?ref='+head);if(published.sha!==await gitsha(raw))throw Error('Deze testversie is verouderd. Open de actuele testsite; er is niets gepubliceerd.');
 const testRuns=await request('/actions/runs?head_sha='+head+'&per_page=30');
 const pages=testRuns.workflow_runs?.find(r=>r.name==='pages-build-deployment');
 if(!pages||pages.conclusion!=='success')throw Error('De actuele testdeployment is nog niet geslaagd. Publiceer pas na een geslaagde testdeployment.');
 const commit=await request('/git/commits/'+head),tree=await request('/git/trees/'+commit.tree.sha+'?recursive=1');if(tree.truncated)throw Error('GitHub-bestandenlijst onvolledig. Geen publicatie gestart.');
 const existing=new Map(tree.tree.map(x=>[x.path,x]));
 if(choice!=='app'){
  const r=await fetch('https://api.github.com/repos/kruin/3b-kruin-beheer/contents/Kruinconfig.sqlite3?ref=main',{headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+String(token).trim()},cache:'no-store',credentials:'omit',redirect:'error'});
  if(!r.ok)throw Error('Kan de actuele private database niet controleren. Geef dit token ook leestoegang tot 3b-kruin-beheer.');
  if((await r.json()).sha!==manifest.privateDbSha)throw Error('De database bevat nieuwere metingen dan deze testbasis. Laat eerst de testbasis vernieuwen en controleer die. Productie is niet gewijzigd.');
 }
 const files=[],seen=new Set();
 for(const f of manifest.files){
  if(!safe(f.path)||!['data','app'].includes(f.group)||seen.has(f.path)||!/^[a-f0-9]{64}$/.test(f.sha256)||f.before!==null&&!/^[a-f0-9]{40}$/.test(f.before))throw Error('Onveilige publicatiebestanden.');seen.add(f.path);
  if(choice!=='both'&&f.group!==choice)continue;
  const r=await fetch('publicatie/bestanden/'+f.path,{cache:'no-store'});if(!r.ok)throw Error('Publicatiebestand ontbreekt: '+f.path);const bytes=new Uint8Array(await r.arrayBuffer());if(await sha256(bytes)!==f.sha256)throw Error('Publicatiebestand gewijzigd: '+f.path);
  const sha=await gitsha(bytes),old=existing.get(f.path);if(old&&old.type!=='blob')throw Error('Onverwacht productiebestand: '+f.path);
  if((old?.sha||null)!==f.before&&old?.sha!==sha)throw Error('Productie is sinds deze testkandidaat gewijzigd. Laat eerst de kandidaat vernieuwen. Er is niets overschreven.');
  if(old?.sha!==sha)files.push({path:f.path,bytes,sha});
 }
 if(!manifest.files.some(f=>choice==='both'||f.group===choice))throw Error('Geen bestanden voor deze keuze.');
 return {request,head,baseTree:commit.tree.sha,files,version:manifest.version,choice};
}
async function publish(plan,report){
 if(!allowed())throw Error('Publiceren kan alleen op test.');
 if((await plan.request('/git/ref/heads/main')).object.sha!==plan.head)throw Error('GitHub is gewijzigd na de controle. Controleer opnieuw; productie is niet gewijzigd.');
 if(!plan.files.length)return {unchanged:true,sha:plan.head};
 report('Bestanden worden klaargezet. Productie is nog niet gewijzigd.');
 const tree=[];for(const file of plan.files){const blob=await plan.request('/git/blobs','POST',{content:b64(file.bytes),encoding:'base64'});if(blob.sha!==file.sha)throw Error('GitHub bevestigt een ander bestand. Geen publicatie.');tree.push({path:file.path,mode:'100644',type:'blob',sha:blob.sha});}
 const nextTree=await plan.request('/git/trees','POST',{base_tree:plan.baseTree,tree});
 const commit=await plan.request('/git/commits','POST',{message:'Kruin vanuit test: '+labels[plan.choice]+' naar productie ('+plan.version+')',tree:nextTree.sha,parents:[plan.head]});
 report('Publicatie wordt bevestigd…');
 try{await plan.request('/git/refs/heads/main','PATCH',{sha:commit.sha,force:false});}
 catch(e){try{if((await plan.request('/git/ref/heads/main')).object.sha!==commit.sha)throw e;}catch(_){const error=Error('Uitkomst publicatie niet bevestigd. Niet opnieuw klikken. Controleer GitHub voordat je verdergaat.');error.uncertain=true;throw error;}}
 return {sha:commit.sha};
}
async function deployment(request,sha){const data=await request('/actions/runs?head_sha='+sha+'&per_page=30');const run=data.workflow_runs?.find(r=>r.name==='pages-build-deployment');if(!run)return {done:false};if(run.status!=='completed')return {done:false,url:run.html_url};if(run.conclusion!=='success')throw Error('GitHub heeft de bestanden ontvangen, maar de websitepublicatie is mislukt. Controleer het publicatieverslag; niet blind opnieuw publiceren.');return {done:true,url:run.html_url};}
window.ThreeBProduction={prepare,publish,deployment};
if(!document.getElementById('productionForm'))return;
const $=id=>document.getElementById(id);let plan=null,busy=false,timer=null;const status=s=>$('productionStatus').textContent=s;
function reset(){if(busy)return;plan=null;$('confirmProduction').hidden=true;$('checkProduction').disabled=false;}
$('productionChoice').onchange=reset;$('productionToken').oninput=reset;
$('checkProduction').onclick=async()=>{if(busy)return;busy=true;plan=null;$('confirmProduction').hidden=true;$('checkProduction').disabled=true;status('Ik controleer de testversie en productie…');try{plan=await prepare($('productionChoice').value,$('productionToken').value);$('productionToken').value='';status(plan.files.length?plan.version+' · '+labels[plan.choice]+'. Je gaat de gewone gebruikerssite bijwerken. SQLite blijft privé.': 'Deze keuze staat al op productie. Er hoeft niets te worden overgenomen.');$('confirmProduction').hidden=!plan.files.length;}catch(e){status(e.message);}finally{busy=false;$('checkProduction').disabled=Boolean(plan);}};
$('confirmProduction').onclick=async()=>{if(busy||!plan)return;busy=true;$('confirmProduction').disabled=true;$('productionChoice').disabled=true;$('productionToken').disabled=true;try{const result=await publish(plan,status);status('Bestanden op GitHub ontvangen. De website wordt bijgewerkt; nog niet klaar.');const link=$('productionReport');link.href='https://github.com/kruin/3b/commit/'+result.sha;link.hidden=false;const poll=async()=>{try{const state=await deployment(plan.request,result.sha);if(state.url)link.href=state.url;if(state.done){status('Klaar. '+labels[plan.choice]+' staat op productie · '+plan.version+'.');$('productionSite').hidden=false;return;}timer=setTimeout(poll,15000);}catch(e){status(e.message+' De online publicatie is nog niet bevestigd.');$('resumeProduction').hidden=false;}};$('resumeProduction').onclick=()=>{$('resumeProduction').hidden=true;poll();};poll();}catch(e){status(e.message);/* Never offer a blind retry after a write. */}};
window.addEventListener('pagehide',()=>clearTimeout(timer));
if(!allowed()){$('productionForm').hidden=true;status('Deze ingang is alleen voor Kruin op test.');}
})();
