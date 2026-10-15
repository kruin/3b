'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={window:{THREEB_BANDNUMMERING:require('./bandnummering-v208')},location:{hash:'',search:''},URLSearchParams,localStorage:{getItem:()=>null,setItem(){}},document:{getElementById:()=>({textContent:''}),body:{classList:{contains:()=>false}}}};
vm.createContext(ctx);
for(const name of ['config-v208.js','kruinwaarden-generated-v208.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+name,'utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/app-v208.js','utf8').replace('  init();','window.test={C,state,ui,normalize,applyAllAutomaticCalculations,chooseCentralTrack,data,bandBall,point,firstCushionContact,bandCenterLineInsetCm,applyConfiguredCrossFromBody,applyAutomaticCalculations,parallelBounds,parallelRouteAt};'),ctx);
const T=ctx.window.test;T.normalize();T.applyAllAutomaticCalculations();
const copy=x=>JSON.parse(JSON.stringify(x)),epsilon=.0001;
function inside(p,t){const c=T.C.tables[t],r=T.bandCenterLineInsetCm();assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.x>=r-epsilon&&p.x<=c.widthCm-r+epsilon&&p.y>=r-epsilon&&p.y<=c.heightCm-r+epsilon,`${t}: ball outside ${JSON.stringify(p)}`);}
function firstHit(a,b,t){const c=T.C.tables[t],r=T.bandCenterLineInsetCm(),dx=b.x-a.x,dy=b.y-a.y,hits=[];for(const [axis,bound] of [['x',r],['x',c.widthCm-r],['y',r],['y',c.heightCm-r]]){const d=axis==='x'?dx:dy;if(Math.abs(d)<1e-10)continue;const u=(bound-a[axis])/d;if(u>epsilon)hits.push(u);}assert(hits.length);assert(Math.abs(Math.min(...hits)-1)<epsilon,'Earlier cushion crossed before arrival');}
let routes=0,segments=0,missing=0;
for(const t of ['klein','groot'])for(const direction of ['west','oost'])for(const key of ['VIER+3','VIER+4','VIJF-2']){
 T.ui.direction=direction;T.chooseCentralTrack(key);T.applyAutomaticCalculations(t);const route=T.data(t);
 if(route.romp.to.value===null){assert.equal(t,'groot');assert(key.startsWith('VIER'));assert.equal(route.kruis.to.value,null,'Missing anchors must stay missing');missing++;continue;}
 let previous=null;
 for(const part of T.C.parts.slice(0,7)){
  const s=route[part.key];if(s?.from?.value==null||s?.to?.value==null)break;
  const a=T.bandBall(s.from,s.to,t,3.075),b=T.bandBall(s.to,s.from,t,3.075);
  inside(b,t);if(s.from.kind!=='acquit'){inside(a,t);firstHit(a,b,t);if(previous)assert(Math.hypot(a.x-previous.x,a.y-previous.y)<epsilon,'Joint broken at '+key+' '+part.key);}
  previous=b;segments++;
 }
 const again=copy(T.data(t));assert.deepEqual(copy(T.data(t)),again,'Repeated reads must not undo correction');routes++;
}
assert.equal(routes,8);assert.equal(missing,4);assert(segments>=40);
// All departure rails, axis directions, and mirrors use physical first contact.
for(const t of ['klein','groot'])for(const direction of ['west','oost']){
 T.ui.direction=direction;const c=T.C.tables[t],r=T.bandCenterLineInsetCm();
 for(const origin of [{x:r,y:c.heightCm/2},{x:c.widthCm-r,y:c.heightCm/2},{x:c.widthCm/2,y:r},{x:c.widthCm/2,y:c.heightCm-r}])for(const d of [{x:1,y:1},{x:-1,y:-1},{x:1,y:0},{x:0,y:1}]){
  const h=T.firstCushionContact(t,origin,d);if(!h)continue;inside(h.point,t);firstHit(origin,h.point,t);
 }
 assert.equal(T.firstCushionContact(t,{x:-1,y:10},{x:1,y:1}),null);
 T.chooseCentralTrack('VIJF');const route=T.data(t),old=copy(route.kruis);route.kruis.from={band:'zuid',value:22.125,status:'edited',source:'user',userAdjusted:true};const before=copy(route.kruis);T.applyConfiguredCrossFromBody(t);assert.deepEqual(copy(route.kruis),before,'User point overwritten');route.kruis=old;
}
console.log(`KRUISGEOMETRIE OK: ${routes} routes, ${segments} segments, Klein/Groot West/Oost; 4 missing-anchor cases preserved; first contact, shared balls, repeated reads and user protection.`);
