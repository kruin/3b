'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={window:{},location:{hash:''},URLSearchParams,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({textContent:''}),body:{classList:{contains:()=>false}}}};
vm.createContext(ctx);for(const f of ['config-v194.js','kruinwaarden-generated-v194.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/app-v194.js','utf8').replace('  init();','  window.test={normalize,applyAllAutomaticCalculations,baseTrackReferenceSvg,ui,state,bandBall,data,point,chooseCentralTrack,applyAutomaticCalculations,drawTable};'),ctx);

const t=ctx.window.test;t.normalize();t.applyAllAutomaticCalculations();t.ui.trackFamily='parallel';
assert.equal(ctx.window.THREEB_START_CONFIG.drawing.junctionBalls.bandCenterLineInsetCm,3,'Bandmiddellijn moet configureerbaar op 3 cm staan');
const parallelParts=['neus','kop','nek','romp','kruis','been','hiel'],complete=p=>p&&(p.kind==='acquit'||p.band&&p.value!==null&&Number.isFinite(Number(p.value)));
function parallelError(t,table,a,b){const p=t.point(a.from,table),q=t.point(a.to,table),u=t.point(b.from,table),v=t.point(b.to,table),cross=(v.x-u.x)*(q.y-p.y)-(v.y-u.y)*(q.x-p.x),den=Math.hypot(v.x-u.x,v.y-u.y)*Math.hypot(q.x-p.x,q.y-p.y);return Math.abs(cross)/den;}
for(const table of ['klein','groot'])for(const dir of ['west','oost']){
 t.ui.direction=dir;t.chooseCentralTrack('VIJF');const base=t.data(table);
 assert.equal(base.neus.to.value,50,table+' VIJF Neus moet S–50 blijven');assert.equal(base.romp.from.value,20,table+' VIJF Romp V moet 20 blijven');assert.equal(base.romp.to.value,table==='klein'?38:36,table+' VIJF Romp A wijkt af');
 for(const offset of [-2,-1,1,2,3]){
  t.chooseCentralTrack('VIJF'+(offset>0?'+':'')+offset);const r=t.data(table);
  if(r.kop.parallelUnavailable){assert(offset!==1,'VIJF+1 moet beschikbaar zijn');continue;}
  for(const key of parallelParts)if([base[key]?.from,base[key]?.to,r[key]?.from,r[key]?.to].every(complete))assert(parallelError(t,table,base[key],r[key])<.000001,`${table} ${dir} ${offset} ${key} niet parallel aan VIJF`);
  for(let i=0;i<parallelParts.length-1;i++){const previous=parallelParts[i],next=parallelParts[i+1];if([r[previous]?.from,r[previous]?.to,r[next]?.from,r[next]?.to].every(complete)){const arrival=t.bandBall(r[previous].to,r[previous].from,table,3.075),departure=t.bandBall(r[next].from,r[next].to,table,3.075);assert(Math.hypot(arrival.x-departure.x,arrival.y-departure.y)<.00001,`${previous}/${next} moet één gedeelde bal houden`);}}
  const cfg=ctx.window.THREEB_START_CONFIG.tables[table],bodyV=t.bandBall(r.romp.from,r.romp.to,table,3.075),bodyA=t.bandBall(r.romp.to,r.romp.from,table,3.075);assert(Math.abs(bodyV.x-(dir==='west'?cfg.widthCm-3:3))<.00001,'Romp V ligt niet op de 3-cm-bandlijn');assert(Math.abs(bodyA.y-(cfg.heightCm-3))<.00001,'Romp A ligt niet op de 3-cm-bandlijn');
 }
 t.chooseCentralTrack('VIJF+1');let r=t.data(table);t.state.variantData??={};t.state.variantData[table]??={};t.state.variantData[table]['VIJF+1']=JSON.parse(JSON.stringify(r));r=t.state.variantData[table]['VIJF+1'];r.kop.to={band:'noord',value:17,status:'approved',source:'kruin_sqlite'};t.applyAutomaticCalculations(table);assert.equal(r.kop.to.source,'parallel_translation','Oude afzonderlijke DB-waarde hersteld');
 r.kop.to={band:'noord',value:18,status:'edited',source:'user',userAdjusted:true};t.applyAutomaticCalculations(table);assert.equal(r.kop.to.value,18,'Eigen Kop A blijft behouden');delete t.state.variantData[table]['VIJF+1'];
 for(const [index,key] of parallelParts.slice(1).entries()){
  t.chooseCentralTrack('VIJF+1');const variant=JSON.parse(JSON.stringify(t.data(table)));t.state.variantData[table]['VIJF+1']=variant;const before=JSON.parse(JSON.stringify(variant[key])),manual={...variant[key].to,value:Number(variant[key].to.value)+.123456,status:index%2?'approved':'edited',source:index%2?'measured':'user',measurement:Boolean(index%2),userAdjusted:!index%2};variant[key].to=manual;const after=t.data(table);assert.deepEqual(JSON.parse(JSON.stringify(after[key].from)),before.from,`${key} V naast handmatige waarde gewijzigd`);assert.deepEqual(JSON.parse(JSON.stringify(after[key].to)),manual,`${key} handmatige A niet behouden`);delete t.state.variantData[table]['VIJF+1'];
 }
}
t.ui.direction='west';t.ui.seriesOverview=true;t.ui.seriesFocus='noord';t.ui.playRange='alles';t.chooseCentralTrack('VIJF');
const overview=t.drawTable('klein');
assert(overview.includes('class="series-overview-active" aria-hidden="true" stroke-width="1.6"'),'P0 heeft niet dezelfde smalle middenlijn als de overige P-standen');
assert((overview.match(/class="focus-arrival"/g)||[]).length>=4,'Brede eindballen bij de smalle Kop/Nek-lijnen ontbreken');
assert(overview.includes('data-focus-part="kop"')&&overview.includes('data-focus-part="nek"'),'Kop en Nek ontbreken in het Noord-overzicht');
console.log('PARALLELCONTROLE OK: configureerbare 3-cm-bandmiddellijn; P0-karkas VIJF S–50 en Romp V20–A38/A36; ieder beschikbaar automatisch lijndeel parallel op Groot/Klein en West/Oost; iedere aansluiting één gedeelde bal; gemeten en ge-edite lijnen blijven leidend.');
