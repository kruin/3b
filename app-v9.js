(() => {
  "use strict";
  const C = window.THREEB_START_CONFIG, KEY = "3b-canonical-west-v2";
  const bands = ["west","noord","oost","zuid"];
  const T = {
    en:{localConfig:"local work configuration",title:"3B line configurator",subtitle:"Enter diamond values and view the complete route immediately.",language:"Language",tables:"Tables",editTable:"Edit table",name:"Name",direction:"Direction",departure:"Departure",import:"Import",clear:"Clear name",screenConfig:"On-screen configuration",part:"Part",from:"V · departure",to:"A · arrival",rail:"Rail",value:"Value",display:"Live display",footer:"All points are line points on the four diamond lines · the cushion edge is not a measuring line · data stays in this browser",saved:"Saved locally",large:"Large",small:"Small",both:"Both",west:"West",east:"East — mirrored",nose:"Nose",head:"Head",lines:"parts",complete:"Complete route",empty:"Enter V and A to draw parts",help:"Long diamond lines: 0–80. Short diamond lines: 0–40. The selected departure starts at Z. Decimals are allowed.",out:"value outside rail range",confirm:"Clear",myTables:"My tables"},
    nl:{localConfig:"lokale werkconfig",title:"3B lijnconfigurator",subtitle:"Vul stipwaarden in en bekijk de volledige loop direct.",language:"Taal",tables:"Tafels",editTable:"Bewerk tafel",name:"Naam",direction:"Richting",departure:"Vertreklijn",import:"Importeer",clear:"Wis naam",screenConfig:"On-screen config",part:"Deel",from:"V · vertrek",to:"A · aankomst",rail:"Band",value:"Waarde",display:"Directe weergave",footer:"Alle punten zijn lijnpunten op de vier stiplijnen · de bandrand is geen rekenlijn · gegevens blijven in deze browser",saved:"Lokaal opgeslagen",large:"Groot",small:"Klein",both:"Beide",west:"West",east:"Oost — gespiegeld",nose:"Neus",head:"Kop",lines:"delen",complete:"Volledige loop",empty:"Vul V en A in om delen te tekenen",help:"Lange stiplijnen: 0–80. Korte stiplijnen: 0–40. De gekozen vertreklijn start bij Z. Decimalen zijn toegestaan.",out:"waarde buiten bandbereik",confirm:"Wis",myTables:"Mijn tafels"}
  };
  const $ = id => document.getElementById(id), copy = v => JSON.parse(JSON.stringify(v));
  function blank(){ const p={}; C.lines.forEach((l,i)=>p[l.key]=i===0?{from:{kind:"acquit",value:"Z"},to:{band:"west",value:null}}:{from:{band:"",value:null},to:{band:"",value:null}}); return p; }
  function initial(){ const d={}; Object.keys(C.tables).forEach(t=>{d[t]={};C.patterns.forEach(n=>{d[t][n]=blank();Object.assign(d[t][n],copy(C.defaults[t]?.[n]||{}));});});return {version:4,model:"canonical-west-v2",data:d,ui:{language:C.defaultLanguage,tableMode:C.defaultTableMode,editTable:"groot",pattern:"VIJF",direction:C.defaultDirection,departure:C.defaultDeparture}}; }
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x?.version===4&&x.data)return x;}catch(_){}return initial();}
  const state=load(); let ui=state.ui;
  function normalize(){
    const base=initial(); Object.keys(C.tables).forEach(t=>{state.data[t]??={};C.patterns.forEach(n=>{state.data[t][n]??=base.data[t][n];C.lines.forEach(l=>state.data[t][n][l.key]??=base.data[t][n][l.key]);});});
    ui.language=["en","nl"].includes(ui.language)?ui.language:"en"; ui.tableMode=["groot","klein","beide"].includes(ui.tableMode)?ui.tableMode:"groot"; ui.editTable=["groot","klein"].includes(ui.editTable)?ui.editTable:(ui.tableMode==="klein"?"klein":"groot");
    ui.pattern=C.patterns.includes(ui.pattern)?ui.pattern:"VIJF"; ui.direction=["west","oost"].includes(ui.direction)?ui.direction:"west"; ui.departure=["neus","kop"].includes(ui.departure)?ui.departure:"neus";
  }
  function save(){state.ui=ui;localStorage.setItem(KEY,JSON.stringify(state));$("saveState").textContent=T[ui.language].saved;}
  function tr(k){return T[ui.language][k]||k;} function tableLabel(k){return C.tables[k].labels[ui.language];} function patternLabel(k){return C.patternLabels[k][ui.language];} function lineLabel(l){return l.labels[ui.language];}
  function mirror(b){return b==="west"?"oost":b==="oost"?"west":b;} function shownBand(b){return ui.direction==="oost"?mirror(b):b;} function storedBand(b){return ui.direction==="oost"?mirror(b):b;}
  function activeLines(){return C.lines.slice(ui.departure==="kop"?1:0);} function data(t=ui.editTable){return state.data[t][ui.pattern];}
  function init(){normalize();bind();render();}
  function bind(){
    [["languageSelect","language"],["tableMode","tableMode"],["editTable","editTable"],["patternSelect","pattern"],["noseDirection","direction"],["departureLine","departure"]].forEach(([id,key])=>$(id).addEventListener("change",e=>{ui[key]=e.target.value;if(key==="tableMode"&&ui.tableMode!=="beide")ui.editTable=ui.tableMode;save();render();}));
    $("exportSvg").onclick=exportSvg;$("exportJson").onclick=exportJson;$("importJson").onchange=importJson;$("resetPattern").onclick=reset;
  }
  function render(){
    document.documentElement.lang=ui.language; document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=tr(e.dataset.i18n)); $("releaseVersion").textContent=C.release;
    const tm=$("tableMode");tm.options[0].text=tr("large");tm.options[1].text=tr("small");tm.options[2].text=tr("both");tm.value=ui.tableMode;
    const et=$("editTable");et.options[0].text=tr("large");et.options[1].text=tr("small");et.value=ui.editTable;$("editTableControl").hidden=ui.tableMode!=="beide";
    $("languageSelect").value=ui.language; const dir=$("noseDirection");dir.options[0].text=tr("west");dir.options[1].text=tr("east");dir.value=ui.direction;
    const dep=$("departureLine");dep.options[0].text=tr("nose");dep.options[1].text=ui.language==="nl"?"Verkorte 4-bander":"Shortened four-cushion";dep.value=ui.departure;
    const ps=$("patternSelect");ps.replaceChildren();C.patterns.forEach(n=>ps.add(new Option(patternLabel(n),n)));ps.value=ui.pattern;
    $("exportJson").textContent=tr("myTables");$("helpText").textContent=tr("help");
    $("editorTitle").textContent=`${tableLabel(ui.editTable)} · ${patternLabel(ui.pattern)}`;
    const views=ui.tableMode==="beide"?["groot","klein"]:[ui.tableMode];$("drawingTitle").textContent=`${patternLabel(ui.pattern)} · ${ui.direction==="west"?tr("west"):tr("east")}`;
    renderRows();$("svgMount").innerHTML=views.map(drawTable).join("");
  }
  function renderRows(){
    const body=$("lineRows");body.replaceChildren();const d=data(), lines=activeLines();
    lines.forEach((line,i)=>{const s=d[line.key],row=document.createElement("tr"),name=document.createElement("td");name.className="line-name";name.innerHTML=`<span class="line-swatch" style="background:${line.color}"></span>${lineLabel(line)}`;row.append(name);
      if(line.key==="neus"){const z=document.createElement("td");z.colSpan=2;z.innerHTML='<span class="fixed-z">Z</span>';row.append(z);}else{row.append(bandCell(line.key,"from",shownBand(s.from.band)),valueCell(line.key,"from",s.from.value));}
      row.append(bandCell(line.key,"to",shownBand(s.to.band)),valueCell(line.key,"to",s.to.value));const c=document.createElement("td"),b=document.createElement("button");b.className="row-clear";b.textContent="×";b.onclick=()=>{clear(line.key);save();render();};c.append(b);row.append(c);body.append(row);
    }); updateStatus();
  }
  function bandCell(k,side,val){const td=document.createElement("td"),s=document.createElement("select");s.add(new Option("—",""));bands.forEach(b=>s.add(new Option(bandName(b),b)));s.value=val||"";s.onchange=e=>update(k,side,"band",e.target.value);td.append(s);return td;}
  function valueCell(k,side,val){const td=document.createElement("td"),i=document.createElement("input");i.type="number";i.step="any";i.inputMode="decimal";i.placeholder="—";i.value=val??"";i.oninput=e=>update(k,side,"value",e.target.value===""?null:Number(e.target.value));td.append(i);return td;}
  function bandName(b){const x={en:{west:"West",noord:"North",oost:"East",zuid:"South"},nl:{west:"West",noord:"Noord",oost:"Oost",zuid:"Zuid"}};return x[ui.language][b];}
  function update(k,side,field,val){if(field==="band")val=storedBand(val);data()[k][side][field]=val;save();render();}
  function clear(k){data()[k]=k==="neus"?{from:{kind:"acquit",value:"Z"},to:{band:"west",value:null}}:{from:{band:"",value:null},to:{band:"",value:null}};}
  function complete(p){return p?.kind==="acquit"||(bands.includes(p?.band)&&p.value!==null&&p.value!==""&&Number.isFinite(Number(p.value)));} function valid(p){if(p?.kind==="acquit")return true;if(!complete(p))return false;return Number(p.value)>=0&&Number(p.value)<=((p.band==="west"||p.band==="oost")?80:40);}
  function segments(t){return activeLines().filter(l=>{const s=data(t)[l.key];return complete(s.from)&&complete(s.to)&&valid(s.from)&&valid(s.to);});}
  function updateStatus(){const n=segments(ui.editTable).length,total=activeLines().length,s=$("completionStatus");s.textContent=`${n}/${total} ${tr("lines")}`;s.classList.toggle("complete",n===total);}
  function point(p,t){const {widthCm:w,heightCm:h,dotOffsetCm:d}=C.tables[t];if(p.kind==="acquit")return{x:w/2,y:h*.75};const v=Number(p.value);let q;if(p.band==="west")q={x:-d,y:(1-v/80)*h};if(p.band==="oost")q={x:w+d,y:v/80*h};if(p.band==="noord")q={x:v/40*w,y:-d};if(p.band==="zuid")q={x:(1-v/40)*w,y:h+d};return ui.direction==="oost"?{x:w-q.x,y:q.y}:q;}
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function drawTable(t){
    const table=C.tables[t],W=510,H=850,fieldW=340,fieldH=680,scale=fieldW/table.widthCm,d=table.dotOffsetCm*scale,x=(W-fieldW)/2,y=90,wood=d+14,map=p=>({x:x+p.x*scale,y:y+p.y*scale}),segs=segments(t);let s=`<svg class="table-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(patternLabel(ui.pattern))} ${esc(tableLabel(t))}"><rect width="${W}" height="${H}" rx="18" fill="#f7f1e5"/><text x="${W/2}" y="28" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="800" fill="#2b2118">${esc(patternLabel(ui.pattern))} · ${esc(tableLabel(t).toUpperCase())}</text><text x="${W/2}" y="49" text-anchor="middle" font-family="system-ui" font-size="11" fill="#6d5d4b">${table.widthCm} × ${table.heightCm} cm · 9.5 cm</text><rect x="${x-wood}" y="${y-wood}" width="${fieldW+2*wood}" height="${fieldH+2*wood}" rx="11" fill="#704725" stroke="#3a2516" stroke-width="3"/><rect x="${x}" y="${y}" width="${fieldW}" height="${fieldH}" fill="#176f4f" stroke="#e7c66e" stroke-width="3"/>`;
    s+=dots(t,map)+`<defs><marker id="arrow-${t}" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path d="M0 0L9 3.5L0 7Z" fill="context-stroke"/></marker></defs>`;
    segs.forEach(l=>{const seg=data(t)[l.key],a=map(point(seg.from,t)),b=map(point(seg.to,t)),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;s+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#fff" stroke-opacity=".8" stroke-width="9"/><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${l.color}" stroke-width="5" marker-end="url(#arrow-${t})"/><circle cx="${a.x}" cy="${a.y}" r="5" fill="#fffaf0" stroke="${l.color}" stroke-width="2.5"/><circle cx="${b.x}" cy="${b.y}" r="5" fill="#fffaf0" stroke="${l.color}" stroke-width="2.5"/><text x="${mx}" y="${my-8}" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="800" fill="#fff6dd" stroke="#103d2c" stroke-width="3" paint-order="stroke fill">${esc(lineLabel(l))}</text>`;});
    const z=map(point({kind:"acquit"},t));s+=`<circle cx="${z.x}" cy="${z.y}" r="5" fill="#fff" stroke="#2b2118" stroke-width="2"/><text x="${z.x+10}" y="${z.y+4}" font-family="system-ui" font-size="12" font-weight="800" fill="#fff" stroke="#103d2c" stroke-width="3" paint-order="stroke fill">Z</text><text x="${W/2}" y="${H-17}" text-anchor="middle" font-family="system-ui" font-size="11" fill="#6d5d4b">${segs.length===activeLines().length?tr("complete"):`${segs.length}/${activeLines().length} ${tr("lines")}`}</text></svg>`;return `<div class="drawing-card">${s}</div>`;
  }
  function displayPoint(b,v,t){return point({band:ui.direction==="oost"?mirror(b):b,value:v},t);}
  function dots(t,map){let c='<g fill="#fff8dc" stroke="#3b291c" stroke-width=".8">',l='<g fill="#fff8dc" stroke="#4b301d" stroke-width="3" paint-order="stroke fill" font-family="system-ui" font-size="14" font-weight="800">';["west","oost"].forEach(b=>{for(let v=0;v<=80;v+=10){const p=map(displayPoint(b,v,t));c+=`<circle cx="${p.x}" cy="${p.y}" r="4"/>`;l+=`<text x="${p.x+(b==="west"?-13:13)}" y="${p.y+5}" text-anchor="${b==="west"?"end":"start"}">${v}</text>`;}});["noord","zuid"].forEach(b=>{for(let v=0;v<=40;v+=10){const p=map(displayPoint(b,v,t));c+=`<circle cx="${p.x}" cy="${p.y}" r="4"/>`;l+=`<text x="${p.x}" y="${p.y+(b==="noord"?-13:23)}" text-anchor="middle">${v}</text>`;}});return c+'</g>'+l+'</g>';}
  function download(name,content,type){const blob=new Blob([content],{type}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  function exportSvg(){const svgs=[...document.querySelectorAll(".table-svg")];svgs.forEach((s,i)=>download(`3B-${ui.tableMode==="beide"?(i?"small":"large"):ui.tableMode}-${ui.pattern}.svg`,new XMLSerializer().serializeToString(s),"image/svg+xml"));}
  function exportJson(){download(ui.language==="nl"?"3B-mijn-tafels.json":"3B-my-tables.json",JSON.stringify(state,null,2),"application/json");}
  async function importJson(e){const f=e.target.files[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x?.data)throw Error("Invalid file");state.data=x.data;normalize();save();render();}catch(err){$("messages").textContent=err.message;}e.target.value="";}
  function reset(){if(!confirm(`${tr("confirm")} ${patternLabel(ui.pattern)} · ${tableLabel(ui.editTable)}?`))return;state.data[ui.editTable][ui.pattern]=blank();save();render();}
  init();
})();
