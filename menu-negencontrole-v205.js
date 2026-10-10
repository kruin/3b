'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=__dirname,read=name=>fs.readFileSync(path.join(root,name),'utf8');
// Minimal DOM used only for moving the actual toolbar and invoking its actions.
function fixture(old=null){
 const ids={},listeners={},storage=new Map();
 const classes=()=>{const values=new Set();return{add:(...xs)=>xs.forEach(x=>values.add(x)),remove:(...xs)=>xs.forEach(x=>values.delete(x)),contains:x=>values.has(x),toggle:x=>{if(values.has(x)){values.delete(x);return false;}values.add(x);return true;}};};
 function node(tag='div'){return{tag,children:[],attributes:{},classList:classes(),hidden:false,setAttribute(k,v){this.attributes[k]=v;},append(child){if(child.parentElement)child.parentElement.children=child.parentElement.children.filter(x=>x!==child);child.parentElement=this;this.children.push(child);if(child.id)ids[child.id]=child;},insertBefore(child){this.append(child);},querySelector(selector){return selector==='footer'?footer:null;},set innerHTML(text){for(const m of text.matchAll(/id="([^"]+)"/g)){const child=node();child.id=m[1];this.append(child);}}};}
 const body=node('body'),menu=node(),editor=node(),footer=node('footer');editor.id='lineEditor';editor.hidden=true;ids.lineEditor=editor;
 for(const id of ['saveState','tableMenuToggle']){ids[id]=node();ids[id].id=id;}
 body.append(menu);body.append(editor);editor.append(footer);body.classList.add('table-only');
 const memory={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 if(old)memory.setItem('3b-canonical-west-v2',JSON.stringify(old));
 const ctx={window:{},location:{hash:'',search:''},URLSearchParams,localStorage:memory,sessionStorage:{...memory},document:{body,getElementById:id=>ids[id]||null,createElement:node,querySelector:s=>s==='.central-track-controls'?menu:null,addEventListener:(type,fn)=>listeners[type]=fn}};
 vm.createContext(ctx);for(const name of ['config-v205.js','kruinwaarden-generated-v205.js'])vm.runInContext(read(name),ctx);
 const source=read('app-v205.js').replace('  init();',`  render=()=>{}; window.test={state,ui,normalize,prepareNineRoutes,applyAllAutomaticCalculations,chooseCentralTrack,data,activeLines,segments,bandBall,drawableGeometry,parallelBounds,ensureExperimentToolbar,dockExperimentToolbar,closeTableMenu,toggleTableMenu,initExperimentSession,experimentCheckpoint,save,experimentSnapshot,experimentData};`);
 vm.runInContext(source,ctx);const T=ctx.window.test;T.normalize();T.prepareNineRoutes();T.applyAllAutomaticCalculations();
 return{T,ctx,body,menu,editor,ids,listeners};
}
const f=fixture(),{T}=f;
T.ensureExperimentToolbar();assert.equal(f.ids.experimentToolbar.parentElement,f.menu,'Undo must start inside the menu');assert(!f.body.classList.contains('table-menu-open'));
T.toggleTableMenu();assert(f.body.classList.contains('table-menu-open'));T.closeTableMenu();assert(!f.body.classList.contains('table-menu-open'));
T.dockExperimentToolbar(true);assert.equal(f.ids.experimentToolbar.parentElement,f.editor);T.dockExperimentToolbar(false);assert.equal(f.ids.experimentToolbar.parentElement,f.menu,'Closing the editor must return Undo to the menu');
T.toggleTableMenu();f.listeners.keydown({key:'Escape'});assert(!f.body.classList.contains('table-menu-open'),'Escape must close the menu');
const css=read('styles.css');assert(css.includes('body.table-only .central-track-controls { display:none;'));assert(css.includes('body.table-only.table-menu-open .central-track-controls { display:flex;'));assert(css.includes('.central-track-controls > .experiment-toolbar{position:static;display:block;'));
T.initExperimentSession();const before=T.experimentData(T.experimentSnapshot());T.experimentCheckpoint();T.state.data.klein.NEGEN.romp.to={band:'zuid',value:16.375,status:'edited',source:'user',userAdjusted:true};T.save();const edited=T.experimentData(T.experimentSnapshot());assert.notEqual(edited,before);f.ids.sessionUndo.onclick();assert.equal(T.experimentData(T.experimentSnapshot()),before);f.ids.sessionRedo.onclick();assert.equal(T.experimentData(T.experimentSnapshot()),edited);f.ids.sessionReject.onclick();assert.equal(T.experimentData(T.experimentSnapshot()),before);
const keys=['neus','kop','nek','romp','kruis','been','hiel'];
for(const table of ['klein','groot'])for(const direction of ['west','oost'])for(const track of ['NEGEN','HALFNEGEN','NEGEN-1','NEGEN-2']){
 T.ui.editTable=table;T.ui.direction=direction;T.chooseCentralTrack(track);const route=T.data(table);
 assert.deepEqual(Array.from(T.activeLines(),x=>x.key),keys);assert.deepEqual(Array.from(T.segments(table),x=>x.key),keys);
 assert.equal(route.neus.to.value,({NEGEN:90,HALFNEGEN:85,'NEGEN-1':80,'NEGEN-2':70})[track]);
 for(let i=0;i<keys.length-1;i++){const a=route[keys[i]],b=route[keys[i+1]],x=T.bandBall(a.to,a.from,table,3.075),y=T.bandBall(b.from,b.to,table,3.075);assert(Math.hypot(x.x-y.x,x.y-y.y)<.002,`${table}/${direction}/${track}: ${keys[i]} / ${keys[i+1]} lose the shared ball`);}
 for(const key of keys.slice(1))assert(T.drawableGeometry(table,key),`${table}/${direction}/${track}: ${key} outside the cloth`);
 assert.equal(T.parallelBounds(table,'NEGEN').maximum,0); // NEGEN P0 is selectable; there is no P+1.
}
// The app feature upgrade also works with an explicitly retained v193 basis.
const old=JSON.parse(JSON.stringify(T.state));old.basis={id:'retained-v193',config:JSON.parse(JSON.stringify(f.ctx.window.THREEB_START_CONFIG)),values:JSON.parse(JSON.stringify(f.ctx.window.THREEB_KRUIN_VALUES))};old.basis.config.release='193';old.basis.config.publicRelease='193';old.basis.config.lklTrackRules.appliesTo=old.basis.config.lklTrackRules.appliesTo.filter(x=>x!=='NEGEN');delete old.basis.config.patternByLine.NEGEN;
for(const table of ['klein','groot'])for(const part of keys.slice(1)){old.data[table].NEGEN[part].from.value=null;old.data[table].NEGEN[part].to.value=null;old.basis.values.tracks[table].NEGEN.linePoints[part].from.value=null;old.basis.values.tracks[table].NEGEN.linePoints[part].to.value=null;}
old.data.klein.VIJF.romp.to={band:'zuid',value:37.125,status:'edited',source:'user',userAdjusted:true};
const migrated=fixture(old).T;migrated.chooseCentralTrack('NEGEN');assert.equal(migrated.segments('klein').length,7);assert.equal(migrated.segments('groot').length,7);assert.equal(migrated.state.data.klein.VIJF.romp.to.value,37.125,'Existing user edit must survive');
console.log('MENU-NEGENCONTROLE OK: menuplaatsing, sluiten/Escape, lijneditor, Undo/Redo/Verwerp; volledige NEGEN/HALF NEGEN/P−1/P−2, beide tafels en richtingen, één gedeelde bal en behoud van v193-gebruikerswaarden. Geen browserlayouttest.');
