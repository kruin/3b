const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=__dirname;const ctx={window:{},location:{hash:''},URLSearchParams,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({textContent:""}),body:{classList:{contains:()=>false}}}};
vm.createContext(ctx);for(const f of ['config-v173.js','kruinwaarden-generated-v173.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),ctx);
let s=fs.readFileSync(root+'/app-v173.js','utf8').replace('  init();','  window.test={state,ui,normalize,applyAllAutomaticCalculations,chooseCentralTrack,data,point,bandBall,positionOrigin,statusColor,zLabel,repairStoredVariantBridges,activeLines,parallelBounds,parallelRouteAt,arrivalCenters,spoorSnapshot,applySavedKruinSnapshots};');vm.runInContext(s,ctx);const T=ctx.window.test;T.normalize();T.applyAllAutomaticCalculations();T.ui.trackFamily='parallel';
for(const table of ['klein','groot'])for(const dir of ['west','oost']){T.ui.direction=dir;T.chooseCentralTrack('VIJF+1');const r=T.data(table),a=T.bandBall(r.kop.to,r.kop.from,table,3.075),b=T.bandBall(r.nek.from,r.nek.to,table,3.075);assert(Math.hypot(a.x-b.x,a.y-b.y)<.01,'Kop/Nek mismatch');}
T.ui.trackFamily='parallel';assert.equal(T.zLabel(0),'P');assert.equal(T.zLabel(1),'P+1');assert.equal(T.zLabel(-2),'P−2');T.ui.trackFamily='waaier';assert.equal(T.zLabel(0),'W');assert.equal(T.zLabel(2),'W+2');
assert.equal(T.positionOrigin({source:'kruin_excel',status:'approved'}),'kruin');assert.equal(T.positionOrigin({source:'kruin_excel',status:'edited'}),'edited');assert.equal(T.positionOrigin({source:'user',status:'approved'}),'edited');assert.equal(T.positionOrigin({status:'calculated'}),'calculated');assert.equal(T.positionOrigin({kind:'acquit'}),'framework');
T.ui.trackFamily='parallel';T.chooseCentralTrack('VIJF+1');const old=JSON.parse(JSON.stringify(T.data('klein')));old.nek.from.value=30;T.state.variantData={klein:{'VIJF+1':old}};T.repairStoredVariantBridges();const restored=T.data('klein');assert(restored.nek.from.value!==30,'Opgeslagen fout is niet hersteld');
restored.nek.from={band:'noord',value:12,status:'approved',source:'user',userAdjusted:true};T.state.appliedMigrations=T.state.appliedMigrations.filter(x=>x!=='variant-bridge-v173');T.repairStoredVariantBridges();assert.equal(T.data('klein').nek.from.value,12,'Eigen wijziging overschreven');
console.log('GEOMETRIECONTROLE OK: VIJF+1 Kop/Nek, Groot/Klein, Oost/West, P/W en positiekleuren.');

for(const table of ['klein','groot'])for(const dir of ['west','oost'])for(const [index,pattern] of ['NUL','EEN','TWEE','DRIE','VIER','VIJF','ZES','ZEVEN','ACHT'].entries()){
 T.ui.direction=dir;T.chooseCentralTrack(pattern);const bounds=T.parallelBounds(table);assert.equal(bounds.maximum,8-index,pattern+' maximum');
 const before=JSON.stringify(T.ui),snap=T.spoorSnapshot(table);assert.equal(JSON.stringify(T.ui),before,'Snapshot changes selection');
 assert.equal(snap.tracks.length,bounds.maximum-bounds.minimum+1);
 for(const track of snap.tracks){assert.equal(track.lines.length,7);const r=T.parallelRouteAt(table,track.offset),centers=T.arrivalCenters(table,r);
 for(const line of track.lines){assert.deepStrictEqual(line.from,r[line.key]?.from??null);assert.deepStrictEqual(line.to,r[line.key]?.to??null);
 if(T.activeLines().some(x=>x.key===line.key)&&r[line.key]?.from?.value!=null && r[line.key]?.to?.value!=null){assert(centers[line.key],pattern+' '+track.key+' '+line.key);const expected=T.bandBall(r[line.key].to,r[line.key].from,table,3.075);assert.deepStrictEqual(centers[line.key],expected);}}
 }
}
T.chooseCentralTrack('VIJF-1');T.state.variantData.klein['VIJF-1']=JSON.parse(JSON.stringify(T.data('klein')));T.state.variantData.klein['VIJF-1'].romp.to={band:'zuid',value:39.123456789,status:'edited',userAdjusted:true};
assert.equal(T.spoorSnapshot('klein').tracks.find(x=>x.key==='VIJF-1').lines.find(x=>x.key==='romp').to.value,39.123456789);
fs.writeFileSync('/tmp/spoor-test-snapshot.json',JSON.stringify(T.spoorSnapshot('klein')));
console.log('SPOORCONTROLE OK: alle LKL-sporen, beide tafels/richtingen, alle standen en beschikbare lijnen; exacte eigen waarden.');
