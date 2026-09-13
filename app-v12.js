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
  function initial(){ const d={}; Object.keys(C.tables).forEach(t=>{d[t]={};C.patterns.forEach(n=>{d[t][n]=blank();Object.assign(d[t][n],copy(C.defaults[t]?.[n]||{}));});});return {version:6,model:"canonical-west-v2",data:d,ui:{language:C.defaultLanguage,tableMode:C.defaultTableMode,editTable:"groot",pattern:"VIJF",direction:C.defaultDirection,departure:C.defaultDeparture,correctionMode:C.shortenedFourCushionCorrection.defaultMode,valueStyle:C.drawing.valueLabels.defaultMode}}; }
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if([4,5,6].includes(x?.version)&&x.data){x.version=6;return x;}}catch(_){}return initial();}
  const state=load(); let ui=state.ui;
  function normalize(){
    const base=initial(); Object.keys(C.tables).forEach(t=>{state.data[t]??={};C.patterns.forEach(n=>{state.data[t][n]??=base.data[t][n];C.lines.forEach(l=>state.data[t][n][l.key]??=base.data[t][n][l.key]);});});
    ui.language=["en","nl"].includes(ui.language)?ui.language:"en"; ui.tableMode=["groot","klein","beide"].includes(ui.tableMode)?ui.tableMode:"groot"; ui.editTable=["groot","klein"].includes(ui.editTable)?ui.editTable:(ui.tableMode==="klein"?"klein":"groot");
    ui.pattern=C.patterns.includes(ui.pattern)?ui.pattern:"VIJF"; ui.direction=["west","oost"].includes(ui.direction)?ui.direction:"west"; ui.departure=["neus","kop"].includes(ui.departure)?ui.departure:"neus"; ui.correctionMode=C.shortenedFourCushionCorrection.modes.includes(ui.correctionMode)?ui.correctionMode:C.shortenedFourCushionCorrection.defaultMode; ui.valueStyle=C.drawing.valueLabels.modes.includes(ui.valueStyle)?ui.valueStyle:C.drawing.valueLabels.defaultMode;
  }
  function save(){state.ui=ui;localStorage.setItem(KEY,JSON.stringify(state));$("saveState").textContent=T[ui.language].saved;}
  function tr(k){return T[ui.language][k]||k;} function tableLabel(k){return C.tables[k].labels[ui.language];} function patternLabel(k){return C.patternLabels[k][ui.language];} function lineLabel(l){return l.labels[ui.language];}
  function mirror(b){return b==="west"?"oost":b==="oost"?"west":b;} function shownBand(b){return ui.direction==="oost"?mirror(b):b;} function storedBand(b){return ui.direction==="oost"?mirror(b):b;}
  function activeLines(){return C.lines.slice(ui.departure==="kop"?1:0);} function data(t=ui.editTable){return state.data[t][ui.pattern];}
  function init(){normalize();bind();render();}
  function bind(){
    [["languageSelect","language"],["tableMode","tableMode"],["editTable","editTable"],["patternSelect","pattern"],["noseDirection","direction"],["departureLine","departure"],["correctionMode","correctionMode"],["valueStyle","valueStyle"]].forEach(([id,key])=>$(id).addEventListener("change",e=>{ui[key]=e.target.value;if(key==="tableMode"&&ui.tableMode!=="beide")ui.editTable=ui.tableMode;save();render();}));
    $("exportSvg").onclick=exportSvg;$("exportJson").onclick=exportJson;$("importJson").onchange=importJson;$("resetPattern").onclick=reset;
  }
  function render(){
    document.documentElement.lang=ui.language; document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=tr(e.dataset.i18n)); $("releaseVersion").textContent=C.release;
    const tm=$("tableMode");tm.options[0].text=tr("large");tm.options[1].text=tr("small");tm.options[2].text=tr("both");tm.value=ui.tableMode;
    const et=$("editTable");et.options[0].text=tr("large");et.options[1].text=tr("small");et.value=ui.editTable;$("editTableControl").hidden=ui.tableMode!=="beide";
    $("languageSelect").value=ui.language; const dir=$("noseDirection");dir.options[0].text=tr("west");dir.options[1].text=tr("east");dir.value=ui.direction;
    const dep=$("departureLine");dep.options[0].text=tr("nose");dep.options[1].text=ui.language==="nl"?"Verkorte 4-bander":"Shortened four-cushion";dep.value=ui.departure;
    const cm=$("correctionMode"),cl=ui.language==="nl"?["Advies","Aan","Uit"]:["Advice","On","Off"]; $("correctionLabel").textContent=ui.language==="nl"?"Correctie":"Correction"; [...cm.options].forEach((o,i)=>o.text=cl[i]);cm.value=ui.correctionMode;$("correctionControl").hidden=ui.departure!=="kop";
    const vs=$("valueStyle"),vl=ui.language==="nl"?["Bij elk lijntje","Vervang dichtstbijzijnde nummer"]:["At each guide","Replace nearest number"];$("valueStyleLabel").textContent=ui.language==="nl"?"Stipwaarden":"Diamond values";[...vs.options].forEach((o,i)=>o.text=vl[i]);vs.value=ui.valueStyle;
    const ps=$("patternSelect");ps.replaceChildren();C.patterns.forEach(n=>ps.add(new Option(patternLabel(n),n)));ps.value=ui.pattern;
    $("exportJson").textContent=tr("myTables");$("helpText").textContent=tr("help");
    $("editorTitle").textContent=`${tableLabel(ui.editTable)} · ${patternLabel(ui.pattern)}`;
    const views=ui.tableMode==="beide"?["groot","klein"]:[ui.tableMode];$("drawingTitle").textContent=`${patternLabel(ui.pattern)} · ${ui.direction==="west"?tr("west"):tr("east")}`;
    renderRows();renderCorrection();$("svgMount").innerHTML=views.map(drawTable).join("");
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
  function headCorrection(tableKey){
    const rule=C.shortenedFourCushionCorrection,head=data(tableKey).kop;
    if(!complete(head.from)||!complete(head.to)||!valid(head.from)||!valid(head.to))return null;
    const a=point(head.from,tableKey),b=point(head.to,tableKey);
    const length=Math.hypot(b.x-a.x,b.y-a.y),raw=(length-rule.headLength.referenceLengthCm)/rule.headLength.stepCm*rule.headLength.percentagePointsPerStep;
    const correction=Math.max(rule.headLength.minimumCorrectionPercentagePoints,Math.min(rule.headLength.maximumCorrectionPercentagePoints,raw));
    const effect=Math.max(rule.effectLimitsPercent.minimum,Math.min(rule.effectLimitsPercent.maximum,rule.baseEffectPercent+correction));
    return {lengthCm:Math.round(length*10)/10,correctionPercentagePoints:Math.round(correction),effectPercent:Math.round(effect)};
  }
  function renderCorrection(){
    const box=$("correctionAdvice");
    if(ui.departure!=="kop"){box.hidden=true;return;}
    box.hidden=false;
    if(ui.correctionMode==="uit"){delete state.activeEffect;box.className="correction-advice off";box.textContent=ui.language==="nl"?"Correctie uit: Kop wordt alleen volgens V en A getekend.":"Correction off: Head is drawn from V and A only.";localStorage.setItem(KEY,JSON.stringify(state));return;}
    const result=headCorrection(ui.editTable);
    if(!result){delete state.activeEffect;box.className="correction-advice";box.textContent=ui.language==="nl"?"Vul V en A van Kop volledig in voor het lengteadvies.":"Complete Head V and A to calculate the length advice.";localStorage.setItem(KEY,JSON.stringify(state));return;}
    const sign=result.correctionPercentagePoints>0?"+":"";
    if(ui.correctionMode==="aan")state.activeEffect={table:ui.editTable,pattern:ui.pattern,type:"mee-effect",...result};else delete state.activeEffect;
    box.className=`correction-advice ${ui.correctionMode==="aan"?"active":""}`;
    box.textContent=ui.language==="nl"
      ?`Kop ${result.lengthCm} cm · correctie ${sign}${result.correctionPercentagePoints} procentpunt · ${ui.correctionMode==="aan"?"actief":"advies"}: ${result.effectPercent}% mee-effect.`
      :`Head ${result.lengthCm} cm · correction ${sign}${result.correctionPercentagePoints} percentage points · ${ui.correctionMode==="aan"?"active":"advice"}: ${result.effectPercent}% running English.`;
    localStorage.setItem(KEY,JSON.stringify(state));
  }
  function point(p,t){const {widthCm:w,heightCm:h,dotOffsetCm:d}=C.tables[t];if(p.kind==="acquit")return{x:w/2,y:h*.75};const v=Number(p.value);let q;if(p.band==="west")q={x:-d,y:(1-v/80)*h};if(p.band==="oost")q={x:w+d,y:v/80*h};if(p.band==="noord")q={x:v/40*w,y:-d};if(p.band==="zuid")q={x:(1-v/40)*w,y:h+d};return ui.direction==="oost"?{x:w-q.x,y:q.y}:q;}
  function bandBall(stip,other,t,radiusCm){
    const table=C.tables[t],a=point(stip,t),b=point(other,t),dx=b.x-a.x,dy=b.y-a.y;
    const shown=ui.direction==="oost"?mirror(stip.band):stip.band;
    let u=0;
    if(shown==="west")u=(0-a.x)/dx;else if(shown==="oost")u=(table.widthCm-a.x)/dx;
    else if(shown==="noord")u=(0-a.y)/dy;else if(shown==="zuid")u=(table.heightCm-a.y)/dy;
    const length=Math.hypot(dx,dy)||1,contact={x:a.x+u*dx,y:a.y+u*dy};
    return {x:contact.x+dx/length*radiusCm,y:contact.y+dy/length*radiusCm};
  }
  function backwardGuide(z,toward,t){
    const {widthCm:w,heightCm:h,dotOffsetCm:d}=C.tables[t],dx=z.x-toward.x,dy=z.y-toward.y,candidates=[];
    if(dx<0)candidates.push((-d-z.x)/dx);if(dx>0)candidates.push((w+d-z.x)/dx);
    if(dy<0)candidates.push((-d-z.y)/dy);if(dy>0)candidates.push((h+d-z.y)/dy);
    const u=Math.min(...candidates.filter(v=>v>0));
    return {x:z.x+u*dx,y:z.y+u*dy};
  }
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function formattedValue(value){const n=Number(value),text=Number.isFinite(n)?String(Math.round(n*1000)/1000):String(value);return ui.language==="nl"?text.replace(".",","):text;}
  function valueTag(p,text,color,cx,cy){
    const dx=cx-p.x,dy=cy-p.y,length=Math.hypot(dx,dy)||1,x=p.x+dx/length*28,y=p.y+dy/length*28,width=Math.max(54,text.length*6.7+14);
    return `<g class="value-tag"><rect x="${x-width/2}" y="${y-10}" width="${width}" height="20" rx="7" fill="#fffaf0" stroke="${color}" stroke-width="2"/><text x="${x}" y="${y+4}" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="800" fill="#2b2118">${esc(text)}</text></g>`;
  }
  function suppressedDots(t){
    const hidden=new Set();if(ui.valueStyle!=="vervang_dichtstbijzijnde_nummer")return hidden;
    activeLines().forEach(l=>{const seg=data(t)[l.key];[seg.from,seg.to].forEach(p=>{if(p.kind==="acquit"||!complete(p)||!valid(p))return;const band=shownBand(p.band),max=(band==="west"||band==="oost")?80:40,nearest=Math.max(0,Math.min(max,Math.round(Number(p.value)/10)*10));hidden.add(`${band}:${nearest}`);});});
    return hidden;
  }
  function drawTable(t){
    const table=C.tables[t],W=510,H=850,fieldW=340,fieldH=680,scale=fieldW/table.widthCm,d=table.dotOffsetCm*scale,x=(W-fieldW)/2,y=90,wood=d+14,map=p=>({x:x+p.x*scale,y:y+p.y*scale}),segs=segments(t);let s=`<svg class="table-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(patternLabel(ui.pattern))} ${esc(tableLabel(t))}"><rect width="${W}" height="${H}" rx="18" fill="#f7f1e5"/><text x="${W/2}" y="28" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="800" fill="#2b2118">${esc(patternLabel(ui.pattern))} · ${esc(tableLabel(t).toUpperCase())}</text><text x="${W/2}" y="49" text-anchor="middle" font-family="system-ui" font-size="11" fill="#6d5d4b">${table.widthCm} × ${table.heightCm} cm · 9.5 cm</text><rect x="${x-wood}" y="${y-wood}" width="${fieldW+2*wood}" height="${fieldH+2*wood}" rx="11" fill="#704725" stroke="#3a2516" stroke-width="3"/><rect x="${x}" y="${y}" width="${fieldW}" height="${fieldH}" fill="#176f4f" stroke="#e7c66e" stroke-width="3"/>`;
    s+=dots(t,map,suppressedDots(t));
    segs.forEach(l=>{
      const seg=data(t)[l.key],radiusCm=C.ballDiameterMm/20,stipA=point(seg.from,t),stipB=point(seg.to,t);
      const ballA=seg.from.kind==="acquit"?stipA:bandBall(seg.from,seg.to,t,radiusCm),ballB=bandBall(seg.to,seg.from,t,radiusCm);
      const guideA=seg.from.kind==="acquit"?backwardGuide(ballA,ballB,t):stipA;
      const A=map(ballA),B=map(ballB),GA=map(guideA),GB=map(stipB),ballRadius=radiusCm*scale,lineWidth=C.ballDiameterMm/10*scale,guideWidth=C.drawing.guideLineWidthSvg,mx=(A.x+B.x)/2,my=(A.y+B.y)/2;
      const fromValue=seg.from.kind==="acquit"?"Z":formattedValue(seg.from.value),toValue=formattedValue(seg.to.value);
      const fromTag=`${lineLabel(l)} · V ${fromValue}`,toTag=`${lineLabel(l)} · A ${toValue}`;
      s+=`<g data-part="${l.key}"><line x1="${GA.x}" y1="${GA.y}" x2="${A.x}" y2="${A.y}" stroke="${l.color}" stroke-width="${guideWidth}"/><line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="${l.color}" stroke-width="${lineWidth}" stroke-linecap="round"/><line x1="${B.x}" y1="${B.y}" x2="${GB.x}" y2="${GB.y}" stroke="${l.color}" stroke-width="${guideWidth}"/><circle cx="${A.x}" cy="${A.y}" r="${ballRadius}" fill="${l.color}"/><circle cx="${B.x}" cy="${B.y}" r="${ballRadius}" fill="${l.color}"/><text x="${mx}" y="${my-10}" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="800" fill="#fff6dd" stroke="#103d2c" stroke-width="3" paint-order="stroke fill">${esc(lineLabel(l))}</text>${valueTag(GA,fromTag,l.color,x+fieldW/2,y+fieldH/2)}${valueTag(GB,toTag,l.color,x+fieldW/2,y+fieldH/2)}</g>`;
    });
    const z=map(point({kind:"acquit"},t));s+=`<circle cx="${z.x}" cy="${z.y}" r="5" fill="#fff" stroke="#2b2118" stroke-width="2"/><text x="${z.x+10}" y="${z.y+4}" font-family="system-ui" font-size="12" font-weight="800" fill="#fff" stroke="#103d2c" stroke-width="3" paint-order="stroke fill">Z</text><text x="${W/2}" y="${H-17}" text-anchor="middle" font-family="system-ui" font-size="11" fill="#6d5d4b">${segs.length===activeLines().length?tr("complete"):`${segs.length}/${activeLines().length} ${tr("lines")}`}</text></svg>`;return `<div class="drawing-card">${s}</div>`;
  }
  function displayPoint(b,v,t){return point({band:ui.direction==="oost"?mirror(b):b,value:v},t);}
  function dots(t,map,hidden){let c='<g fill="#fff8dc" stroke="#3b291c" stroke-width=".8">',l='<g fill="#fff8dc" stroke="#4b301d" stroke-width="3" paint-order="stroke fill" font-family="system-ui" font-size="14" font-weight="800">';["west","oost"].forEach(b=>{for(let v=0;v<=80;v+=10){const p=map(displayPoint(b,v,t));c+=`<circle cx="${p.x}" cy="${p.y}" r="4"/>`;if(!hidden.has(`${b}:${v}`))l+=`<text x="${p.x+(b==="west"?-13:13)}" y="${p.y+5}" text-anchor="${b==="west"?"end":"start"}">${v}</text>`;}});["noord","zuid"].forEach(b=>{for(let v=0;v<=40;v+=10){const p=map(displayPoint(b,v,t));c+=`<circle cx="${p.x}" cy="${p.y}" r="4"/>`;if(!hidden.has(`${b}:${v}`))l+=`<text x="${p.x}" y="${p.y+(b==="noord"?-13:23)}" text-anchor="middle">${v}</text>`;}});return c+'</g>'+l+'</g>';}
  function download(name,content,type){const blob=new Blob([content],{type}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  function exportSvg(){const svgs=[...document.querySelectorAll(".table-svg")];svgs.forEach((s,i)=>download(`3B-${ui.tableMode==="beide"?(i?"small":"large"):ui.tableMode}-${ui.pattern}.svg`,new XMLSerializer().serializeToString(s),"image/svg+xml"));}
  function exportJson(){download(ui.language==="nl"?"3B-mijn-tafels.json":"3B-my-tables.json",JSON.stringify(state,null,2),"application/json");}
  async function importJson(e){const f=e.target.files[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x?.data)throw Error("Invalid file");state.data=x.data;normalize();save();render();}catch(err){$("messages").textContent=err.message;}e.target.value="";}
  function reset(){if(!confirm(`${tr("confirm")} ${patternLabel(ui.pattern)} · ${tableLabel(ui.editTable)}?`))return;state.data[ui.editTable][ui.pattern]=blank();save();render();}
  init();
})();
