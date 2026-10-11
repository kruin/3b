'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={window:{},location:{hash:'#owner=kruin',search:'?beheerTafel=klein&beheerSpoor=VIJF'},URLSearchParams,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({textContent:''}),body:{classList:{contains:()=>false}}}};
vm.createContext(ctx);for(const f of ['config-v208.js','kruinwaarden-generated-v208.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/app-v208.js','utf8').replace('  init();','  window.test={normalize,applyAllAutomaticCalculations,baseTrackReferenceSvg,ui,state,bandBall,drawTable,applyBeheerSelection};'),ctx);

const t=ctx.window.test;t.normalize();t.applyAllAutomaticCalculations();t.ui.pattern='VIJF';t.ui.trackFamily='parallel';t.ui.lineOneMode='basis';t.ui.playRange='alles';t.applyBeheerSelection();assert.equal(t.ui.tableMode,'klein');assert.equal(t.ui.editTable,'klein');assert.equal(t.ui.pattern,'VIJF');
for(const table of ['klein','groot'])for(const direction of ['west','oost']){
 t.ui.direction=direction;const r=t.state.data[table].VIJF;
 r.romp.from={band:'oost',value:20,status:'approved'};r.romp.to={band:'zuid',value:table==='klein'?38:36,status:'approved'};
 const svg=t.drawTable(table),group=svg.slice(svg.indexOf('<g data-part="romp"'),svg.indexOf('<g data-part="kruis"'));
 const circles=[...group.matchAll(/<circle class="[^"]*ball-visible"[^>]*cx="([^"]+)" cy="([^"]+)"/g)];
 assert.equal(circles.length,1,'Romp tekent zijn aankomstbal; de vertrekbal wordt één keer als gedeelde Nek/Romp-bal getekend');
 const scale=340/ctx.window.THREEB_START_CONFIG.tables[table].widthCm,departure=t.bandBall(r.romp.from,r.romp.to,table,3.075),arrival=t.bandBall(r.romp.to,r.romp.from,table,3.075),visible=[...svg.matchAll(/<circle class="[^"]*ball-visible"[^>]*cx="([^"]+)" cy="([^"]+)"/g)].map(m=>m.slice(1).map(Number)),screen=p=>[110+p.x*scale,90+p.y*scale],near=p=>visible.some(([x,y])=>Math.hypot(x-screen(p)[0],y-screen(p)[1])<.001);
 assert(near(departure),'Gedeelde Nek/Romp-bal ontbreekt');assert(near(arrival),'Romp-aankomstbal ontbreekt');
 assert(group.includes('value-guide-v')&&group.includes('value-guide-a'),'Stiplijngidsen blijven aanwezig');
}
console.log('BALWEERGAVECONTROLE OK: echte getekende SVG, Romp V20 met één gedeelde vertrekbal en eigen aankomstbal plus stiplijngidsen, beide tafelmaten/richtingen.');
