'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={window:{},location:{hash:'#owner=kruin'},URLSearchParams,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({textContent:''}),body:{classList:{contains:()=>false}},querySelectorAll:()=>[]}};
vm.createContext(ctx);ctx.window.THREEB_BANDNUMMERING=require('./bandnummering-v208');for(const f of ['config-v208.js','kruinwaarden-generated-v208.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/app-v208.js','utf8').replace('  function render(){','  function render(){return;').replace('  init();','  window.test={normalize,applyAllAutomaticCalculations,ui,state,data,bandBall,drawTable,chooseCentralTrack,applyAutomaticCalculations,valueTag,ballValueWindow,labelStackShift,bindValueLabelHover,originLabel,applyKruinSource,updateJunction};'),ctx);
const t=ctx.window.test;t.normalize();t.applyAllAutomaticCalculations();t.ui.trackFamily='parallel';t.ui.playRange='alles';
for(const table of ['klein','groot'])for(const direction of ['west','oost'])for(const key of ['VIJF','VIJF+1','VIJF+2','VIJF+3','VIJF-1','VIJF-2']){
 t.ui.direction=direction;t.chooseCentralTrack(key);t.applyAutomaticCalculations(table);const r=t.data(table);
 for(const [a,b] of [['neus','kop'],['kop','nek'],['nek','romp'],['romp','kruis'],['kruis','been'],['been','hiel']]){
  if([r[a].from,r[a].to,r[b].from,r[b].to].some(p=>p.value===null))continue;
  const x=t.bandBall(r[a].to,r[a].from,table,3.075),y=t.bandBall(r[b].from,r[b].to,table,3.075);
  assert(Math.hypot(x.x-y.x,x.y-y.y)<.00001,`${table} ${direction} ${key}: ${a}/${b} dezelfde bal`);
 }
 const svg=t.drawTable(table),vb=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number),bounds={left:vb[0],top:vb[1],right:vb[0]+vb[2],bottom:vb[1]+vb[3]};
 assert(svg.indexOf('class="segment-hit"')<svg.indexOf('<g data-part='),'Lijnkliklaag onder ballen');
 assert(svg.lastIndexOf('class="value-tag')>svg.lastIndexOf('class="ball-visible'),'Waarden boven route');
 for(const match of svg.matchAll(/<g class="value-tag[^>]*><rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/g)){
  const [x,y,w,h]=match.slice(1).map(Number);assert(x>=bounds.left&&y>=bounds.top&&x+w<=bounds.right&&y+h<=bounds.bottom,'Label geheel binnen tafelbeeld');
 }
 const wood=(vb[2]-340)/2;
 for(const band of ['west','oost','noord','zuid']){
  const panel=t.ballValueWindow({x:110,y:770},band,r.kop.to,r.nek.from,110,90,340,680,wood),m=panel.match(/<rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/),[x,y,w,h]=m.slice(1).map(Number);
  assert(x>=bounds.left&&y>=bounds.top&&x+w<=bounds.right&&y+h<=bounds.bottom,'Balvenster binnen beeld');
 }
}
for(const table of ['klein','groot'])for(const side of ['A','V','both'])for(const index of [0,1,2,3,4]){
 t.ui.direction='west';t.chooseCentralTrack('VIJF');const original=JSON.parse(JSON.stringify(t.state.data[table].VIJF)),parts=['neus','kop','nek','romp','kruis','been'],a=parts[index],b=parts[index+1],r=t.data(table),center=t.bandBall(r[a].to,r[a].from,table,3.075);
 if(['west','oost'].includes(r[a].to.band))center.y+=.25;else center.x+=.25;
 t.updateJunction(table,index,center,side);for(let pass=0;pass<3;pass++)t.applyAutomaticCalculations(table);const x=t.bandBall(r[a].to,r[a].from,table,3.075),y=t.bandBall(r[b].from,r[b].to,table,3.075);
 assert(Math.hypot(x.x-y.x,x.y-y.y)<.05,`Na verplaatsen ${table} ${side} ${a}/${b} dezelfde bal`);
 t.state.data[table].VIJF=original;
}
t.chooseCentralTrack('VIJF');const route=t.state.data.groot.VIJF;route.nek.to={band:'oost',value:20,status:'edited',source:'user',userAdjusted:true};t.applyAutomaticCalculations('groot');assert.equal(route.nek.to.value,20);assert.equal(route.nek.to.status,'edited','Eigen Nek-afwijking blijft behouden');
assert(t.originLabel({source:'user',editOwner:'kruin'}).includes('Kruin-edit'));
const imported={kop:{to:{}}};t.applyKruinSource(imported,{linePoints:{kop:{to:{band:'noord',value:18,source:'user'}}}});assert.equal(imported.kop.to.editOwner,'kruin');
const user={kop:{to:{band:'noord',value:17,source:'user',userAdjusted:true,editOwner:'user'}}};t.applyKruinSource(user,{linePoints:{kop:{to:{band:'noord',value:18,source:'user'}}}},false);assert.equal(user.kop.to.editOwner,'user');assert.equal(user.kop.to.value,17);
const first={x:10,y:10,width:208,height:40},second={x:30,y:20,width:180,height:40};assert.equal(t.labelStackShift(first,second,{top:0,bottom:800}),36);
const bottom={...first,y:750};assert.equal(t.labelStackShift(bottom,{...second,y:760},{top:0,bottom:800}),-56);
// Exercise real pointer/focus bindings, with transparent hit targets and two overlapping labels.
const tags=[0,1].map(i=>({attrs:{},classList:{toggle:(name,on)=>tags[i].visible=on},removeAttribute(name){delete this.attrs[name];},setAttribute(name,value){this.attrs[name]=value;},querySelector:()=>({getAttribute:key=>String((i?second:first)[key])}),closest:()=>({viewBox:{baseVal:{x:0,y:0,width:410,height:800}}})}));
const handlers={},hit={dataset:{junctionIndex:'0',junctionTable:'klein'},matches:s=>s==='.junction-hit',addEventListener:(name,fn)=>handlers[name]=fn};
ctx.document.querySelectorAll=selector=>selector.includes('.cue-hit')?[hit]:[tags[selector.includes(':0:A')?0:1]];
t.ui.valueLabelMode='on';t.bindValueLabelHover();handlers.pointerenter();assert(tags.every(x=>x.visible));assert(tags[1].attrs.transform);handlers.pointerleave();assert(tags.every(x=>!x.visible));handlers.focus();assert(tags.every(x=>x.visible));handlers.blur();assert(tags.every(x=>!x.visible));
console.log('TAFELHERKOMSTCONTROLE OK: VIJF P/±standen, Groot/Klein, West/Oost; automatische aansluitingen delen één bal tot 0,00001 cm, labels en balvensters binnen beeld, hover/focus en behoud eigen edits/Kruin-edit.');
