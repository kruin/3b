'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={window:{},location:{hash:''},URLSearchParams,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({textContent:''}),body:{classList:{contains:()=>false}}}};
vm.createContext(ctx);for(const f of ['config-v208.js','kruinwaarden-generated-v208.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
let s=fs.readFileSync('app-v208.js','utf8').replace('  init();','  window.test={state,ui,C,K,normalize,applyAllAutomaticCalculations,applyAutomaticCalculations,chooseCentralTrack,data,bandBall,point,setStrokeLength,noseLengthAnchor,noseCorrectionSettings,applyNoseLengthCorrection,restoreNoseCorrections,spoorSnapshot,parallelBounds,parallelRouteAt,ensureSixSevenState};');
vm.runInContext(s,ctx);const T=ctx.window.test,clone=x=>JSON.parse(JSON.stringify(x));T.normalize();T.applyAllAutomaticCalculations();T.ensureSixSevenState();
const center=(r,side,t)=>T.bandBall(r.romp[side],r.romp[side==='from'?'to':'from'],t,3.075);
const cases=['VIJF','ZES','ZEVEN','ACHT','NEGEN','ZESZEVEN','ZESZEVEN_ZES','ZESZEVEN_ZEVEN','ZESZEVEN_ACHT','ZESZEVEN_NEGEN'];
for(const key of cases)for(const direction of ['west','oost']){
 T.chooseCentralTrack(key);T.ui.direction=direction;T.ui.lineOneMode='basis';const r=clone(T.data('klein'));
 T.state.strokeLengthsCm??={};T.state.strokeLengthsCm.klein??={};T.state.strokeLengthsCm.klein[key]=83;T.state.noseLengthAnchors={};
 const a=center(r,'from','klein'),b=center(r,'to','klein');T.setStrokeLength('klein',73);
 const corrected=T.data('klein'),anchor=T.noseLengthAnchor('klein');assert(anchor.active,key+' '+direction+' '+anchor.error);
 assert.notEqual(corrected.been.to.value,r.been.to.value,key+' Been schuift mee');
 const c=center(corrected,'from','klein'),d=center(corrected,'to','klein');
 assert(Math.abs(Math.hypot(d.x-b.x,d.y-b.y)-3.075)<.002,key+' displacement '+JSON.stringify({b,d}));
 const v={x:b.x-a.x,y:b.y-a.y},w={x:d.x-c.x,y:d.y-c.y};assert(Math.abs(v.x*w.y-v.y*w.x)/Math.hypot(v.x,v.y)/Math.hypot(w.x,w.y)<.00001,key+' direction');
 for(let i=0;i<6;i++){const before=corrected[T.C.parts[i].key],after=corrected[T.C.parts[i+1].key];if(before.to.value===null||after.from.value===null||after.to.value===null)continue;const e=T.bandBall(before.to,before.from,'klein',3.075),f=T.bandBall(after.from,after.to,'klein',3.075);assert(Math.hypot(e.x-f.x,e.y-f.y)<.01,key+' chain '+i);}
 for(const length of [78,63,73,78,83])T.setStrokeLength('klein',length);
 assert.deepEqual(clone(T.data('klein')),r,key+' standard restored without drift');
}
T.chooseCentralTrack('VIJF');T.ui.direction='west';T.state.noseLengthAnchors={};T.state.strokeLengthsCm.klein.VIJF=83;
T.state.noseCorrectionConfig={klein:{enabled:true,shiftBallsPer10Cm:-.5,angleDegPer10Cm:.25}};
const original=clone(T.data('klein'));T.setStrokeLength('klein',73);assert(T.noseLengthAnchor('klein').active);assert.equal(T.noseLengthAnchor('klein').appliedAngleDeg,.25);
T.state.noseCorrectionConfig.klein.enabled=false;T.applyNoseLengthCorrection('klein');assert.deepEqual(clone(T.data('klein')),original);
T.state.noseCorrectionConfig.klein.enabled=true;T.applyNoseLengthCorrection('klein');
T.data('klein').romp.to={band:'zuid',value:38.25,status:'edited',source:'user',userAdjusted:true};T.setStrokeLength('klein',68);assert.equal(T.noseLengthAnchor('klein').referenceLengthCm,73);assert.equal(T.noseLengthAnchor('klein').route.romp.to.value,38.25);
T.setStrokeLength('klein',73);assert.equal(T.data('klein').romp.to.value,38.25);
const snapshot=T.spoorSnapshot('klein');assert.equal(snapshot.noseLengthCorrection.anchor.route.romp.to.value,38.25);
// Own stored parallel Body edits get their own correction and a connected tail.
for(const key of ['VIJF','ZESZEVEN']){
 T.chooseCentralTrack(key);T.ui.direction='west';T.state.noseLengthAnchors={};T.state.noseCorrectionConfig={klein:{enabled:true,shiftBallsPer10Cm:.5,angleDegPer10Cm:0}};T.state.strokeLengthsCm.klein[key]=83;
 const v=clone(T.parallelRouteAt('klein',1));v.romp.to={...v.romp.to,value:Number(v.romp.to.value)+.1,status:'edited',source:'user',userAdjusted:true};T.state.variantData??={};T.state.variantData.klein??={};T.state.variantData.klein[key+'+1']=v;T.chooseCentralTrack(key+'+1');T.applyAutomaticCalculations('klein');T.chooseCentralTrack(key);
 T.setStrokeLength('klein',73);T.chooseCentralTrack(key+'+1');const changed=T.data('klein');
 for(let i=0;i<6;i++){const x=changed[T.C.parts[i].key],y=changed[T.C.parts[i+1].key];if(x.to.value===null||y.from.value===null||y.to.value===null)continue;const a=T.bandBall(x.to,x.from,'klein',3.075),b=T.bandBall(y.from,y.to,'klein',3.075);assert(Math.hypot(a.x-b.x,a.y-b.y)<.01,key+' own parallel connection '+i);}
 T.chooseCentralTrack(key);T.setStrokeLength('klein',83);assert.equal(T.state.variantData.klein[key+'+1'].romp.to.value,v.romp.to.value);
}
let count=0;
for(const table of ['klein','groot'])for(const direction of ['west','oost'])for(const key of T.C.patternFamilies.sixSeven.tracks){
 T.chooseCentralTrack(key);T.ui.direction=direction;const bounds=T.parallelBounds(table);
 for(let offset=bounds.minimum;offset<=bounds.maximum;offset++){
  const r=T.parallelRouteAt(table,offset);count++;
  for(const part of T.C.parts.slice(0,7)){assert(r[part.key].to.value!==null,table+' '+key+' '+offset+' '+part.key);assert(Number.isFinite(Number(r[part.key].to.value)));}
  for(let i=0;i<6;i++){const x=r[T.C.parts[i].key],y=r[T.C.parts[i+1].key],a=T.bandBall(x.to,x.from,table,3.075),b=T.bandBall(y.from,y.to,table,3.075);assert(Math.hypot(a.x-b.x,a.y-b.y)<.01,table+' '+key+' '+offset+' '+i);}
 }
}
console.log('NEUSCORRECTIE OK: 20 spoor/richting-cases, halve bal/10 cm, hoek, schakelen, geen drift, eigen Romp-edit/ijkpunt en export. 6–7: '+count+' routes met zeven verbonden lijnen.');
