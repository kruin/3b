'use strict';const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=__dirname;const config=fs.readFileSync(root+'/config-v181.js','utf8'),source=fs.readFileSync(root+'/kruinwaarden-generated-v181.js','utf8');
let app=fs.readFileSync(root+'/app-v181.js','utf8').replace('  init();','  window.test={state,ui,normalize,applyCurrentKruinSources,applyAllAutomaticCalculations,applySavedKruinSnapshots,spoorSnapshot,bandBall,data,originLabel,statusColor,displayedSegment,applyAutomaticCalculations,followAutomaticBands,noseArrivalLocked};');
function run(privateMode,old,snapshot){
 const ctx={window:{},location:{hash:privateMode?'#owner=kruin':'',search:''},URLSearchParams,localStorage:{getItem:()=>old?JSON.stringify(old):null,setItem:()=>{}},document:{getElementById:()=>({textContent:''}),body:{classList:{contains:()=>false}}}};
 vm.createContext(ctx);vm.runInContext(config,ctx);vm.runInContext(source,ctx);
 const K=ctx.window.THREEB_KRUIN_VALUES,body=K.tracks.klein.VIJF;
 body.rompA.value=36.1256789;body.linePoints.romp.to.value=36.1256789;
 body.beenA.value=12;body.linePoints.been.to.value=12;
 body.kopA.value=18.1256789;body.linePoints.kop.to.value=18.1256789;
 if(snapshot){K.savedSpoorValues=[JSON.parse(JSON.stringify(snapshot))];const route=K.savedSpoorValues[0].tracks.find(t=>t.offset===0).lines;route.find(l=>l.key==='romp').to.value=36.1256789;route.find(l=>l.key==='kop').to.value=18.1256789;}
 vm.runInContext(app,ctx);const T=ctx.window.test;T.normalize();T.applyCurrentKruinSources();T.applyAllAutomaticCalculations();T.applySavedKruinSnapshots();return T;
}
const fresh=run(true);assert.equal(fresh.state.data.klein.VIJF.romp.to.value,36.1256789);assert.equal(fresh.state.data.klein.VIJF.been.to.value,12);assert.equal(fresh.state.data.klein.VIJF.kop.to.value,18.1256789);assert.equal(fresh.originLabel(fresh.state.data.klein.VIJF.kop.to),'Kruinmeting');
const old=JSON.parse(JSON.stringify(fresh.state));old.data.klein.VIJF.romp.to={band:'zuid',value:42,status:'edited',source:'user',userAdjusted:true};
const privateAgain=run(true,old);assert.equal(privateAgain.state.data.klein.VIJF.romp.to.value,36.1256789,'Private reload moet actuele SQLite lezen');
const userAgain=run(false,old);assert.equal(userAgain.state.data.klein.VIJF.romp.to.value,42,'Eigen openbare tafel mag niet veranderen');
const snapshot=fresh.spoorSnapshot('klein');snapshot.tracks.find(t=>t.offset===0).lines.find(l=>l.key==='nek').from.value=30;
const rejoined=run(true,null,snapshot),route=rejoined.state.data.klein.VIJF,a=rejoined.bandBall(route.kop.to,route.kop.from,'klein',3.075),b=rejoined.bandBall(route.nek.from,route.nek.to,'klein',3.075);assert(Math.hypot(a.x-b.x,a.y-b.y)<.01,'Oude berekende brug moet na bronwijziging opnieuw aansluiten');
// Every supplied manual endpoint must survive calculations, reload and drawing.
for(const table of ['klein','groot']){
 const T=run(true),r=T.state.data[table].VIJF;
 for(const [part,side,value] of [['neus','to',51.123456789],['kop','from',46.123456789],['nek','from',17.123456789],['kruis','from',31.123456789],['kruis','to',8.123456789],['been','from',7.123456789],['been','to',12.123456789],['hiel','from',13.123456789]]){
  r[part][side]={...r[part][side],value,status:'edited',source:'user',userAdjusted:true};
 }
 r.romp.to={band:'west',value:37.123456789,status:'edited',source:'user',userAdjusted:true};
 r.kruis.from.band='west';r.kruis.to.band='zuid';r.been.from.band='zuid';
 const saved=JSON.parse(JSON.stringify(r));T.applyAllAutomaticCalculations();
 for(const [part,line] of Object.entries(saved))for(const [side,p] of Object.entries(line))if(p?.status==='edited')assert.deepEqual(JSON.parse(JSON.stringify(r[part][side])),p,part+' '+side+' mag niet overschreven worden');
 T.ui.pattern='VIJF';T.ui.editTable=table;T.ui.lineOneMode='basis';
 assert.equal(T.displayedSegment(table,{key:'neus'},0).to.value,51.123456789,'Tekening moet handmatige Neus tonen');
 const reopened=run(false,JSON.parse(JSON.stringify(T.state)));assert.equal(reopened.state.data[table].VIJF.romp.to.band,'west');assert.equal(reopened.state.data[table].VIJF.neus.to.value,51.123456789);
}
// Automatic V follows the arrival band; manually supplied V is untouched.
const T=run(true),r=T.state.data.klein.VIJF;r.romp.to.band='west';r.kruis.from={band:'zuid',value:null,status:'calculated',source:'automatic'};T.followAutomaticBands('klein');assert.equal(r.kruis.from.band,'west');
r.kruis.to={band:'zuid',value:8.5,status:'edited',source:'user'};r.been.from={band:'west',value:null,status:'calculated',source:'automatic'};T.followAutomaticBands('klein');assert.equal(r.been.from.band,'zuid');
T.applyAutomaticCalculations('klein');assert.equal(r.kruis.to.value,8.5);assert.equal(r.kruis.to.band,'zuid');
console.log('SQLITE-APPCONTROLE OK: exacte Romp/Kop/Been uit database, herkomst, private refresh en behoud eigen gebruikerswaarden.');
