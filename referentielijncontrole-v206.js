'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={window:{},location:{hash:''},URLSearchParams,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({textContent:''}),body:{classList:{contains:()=>false}}}};
vm.createContext(ctx);for(const f of ['config-v206.js','kruinwaarden-generated-v206.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/app-v206.js','utf8').replace('  init();','  window.test={normalize,applyAllAutomaticCalculations,baseTrackReferenceSvg,ui,state,bandBall};'),ctx);
const t=ctx.window.test;t.normalize();t.applyAllAutomaticCalculations();t.ui.showBasis=true;t.ui.pattern='VIJF';t.ui.trackFamily='parallel';t.ui.lineOneMode='basis';
for(const table of ['klein','groot'])for(const dir of ['west','oost']){
 t.ui.direction=dir;const r=t.state.data[table].VIJF;
 // De berekende Nek en de Rompreferentie gebruiken dezelfde actuele keten.
 const value=table==='klein'?38:36;r.romp.from={band:'oost',value:20,status:'approved'};r.romp.to={band:'zuid',value,status:'approved'};
 const svg=t.baseTrackReferenceSvg(table,p=>p,new Set(['neus','kop','nek','romp','kruis','been','hiel']));
 const line=svg.match(/<line data-reference-part="romp" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/);assert(line,'Rompreferentie ontbreekt');
 const a=t.bandBall(r.romp.from,r.romp.to,table,3.075),b=t.bandBall(r.romp.to,r.romp.from,table,3.075);
 assert.deepEqual(line.slice(1).map(Number),[a.x,a.y,b.x,b.y],table+' '+dir+' referentie gebruikt Romp V20/A'+value);
 // Ook veranderde bronwaarden moeten onmiddellijk dezelfde geometrie volgen.
 r.romp.from.value=21;r.romp.to.value=value-1;const changed=t.baseTrackReferenceSvg(table,p=>p,new Set(['romp']));assert.notEqual(changed,svg);
}
console.log('REFERENTIELIJNCONTROLE OK: dunne Rompreferentie volgt eigen V/A op beide maten en richtingen; de Nek blijft onderdeel van de berekende keten.');
