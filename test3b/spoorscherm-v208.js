'use strict';
// R uses the cushion numbering (0–80 / 0–40). Its tangential coordinate
// is the ball centre's coordinate; the normal coordinate is the cushion edge.
const SpoorGeometry = (() => {
  const bands=['west','noord','oost','zuid'];
  const known=p=>p&&(p.kind==='acquit'||p.value!==null&&p.value!==''&&Number.isFinite(Number(p.value))&&bands.includes(p.band));
  function point(p,g){
    if(!known(p))throw Error('V of A is nog onbekend.');
    const {widthCm:w,heightCm:h,dotOffsetCm:d}=g,v=Number(p.value);
    if(p.kind==='acquit')return {x:w/2,y:h*(.75-(Number(p.offset)||0)/8)};
    return {west:{x:-d,y:(1-v/80)*h},oost:{x:w+d,y:v/80*h},noord:{x:v/40*w,y:-d},zuid:{x:(1-v/40)*w,y:h+d}}[p.band];
  }
  function value(band,p,g){return {west:(1-p.y/g.heightCm)*80,oost:p.y/g.heightCm*80,noord:p.x/g.widthCm*40,zuid:(1-p.x/g.widthCm)*40}[band];}
  function contact(v,a,g){
    const from=point(v,g),to=point(a,g),vertical=['west','oost'].includes(a.band);
    const axis=vertical?'x':'y',target={west:g.inset,oost:g.widthCm-g.inset,noord:g.inset,zuid:g.heightCm-g.inset}[a.band];
    const delta=from[axis]-to[axis];if(Math.abs(delta)<1e-9)throw Error('Geen uniek raakpunt.');
    const u=(target-to[axis])/delta,p={x:to.x+u*(from.x-to.x),y:to.y+u*(from.y-to.y)};
    if(p.x<g.inset-1e-6||p.x>g.widthCm-g.inset+1e-6||p.y<g.inset-1e-6||p.y>g.heightCm-g.inset+1e-6)throw Error('Raakpunt ligt buiten de band.');
    return {band:a.band,value:value(a.band,p,g)};
  }
  function arrival(v,r,g){
    if(!bands.includes(r.band)||!Number.isFinite(r.value))throw Error('Kies een band en een geldig raakpunt.');
    const w=g.widthCm,h=g.heightCm,d=g.dotOffsetCm,i=g.inset;
    const ball={west:{x:i,y:(1-r.value/80)*h},oost:{x:w-i,y:r.value/80*h},noord:{x:r.value/40*w,y:i},zuid:{x:(1-r.value/40)*w,y:h-i}}[r.band];
    if(ball.x<i-1e-6||ball.x>w-i+1e-6||ball.y<i-1e-6||ball.y>h-i+1e-6)throw Error('Raakpunt ligt buiten de band.');
    const from=point(v,g),axis=['west','oost'].includes(r.band)?'x':'y',target={west:-d,oost:w+d,noord:-d,zuid:h+d}[r.band],delta=from[axis]-ball[axis];
    if(Math.abs(delta)<1e-9)throw Error('Geen unieke aankomst.');
    const u=(target-ball[axis])/delta,p={x:ball.x+u*(from.x-ball.x),y:ball.y+u*(from.y-ball.y)};
    return {band:r.band,value:value(r.band,p,g)};
  }
  return {contact,arrival,point};
})();

/* Symbols and compact values belong only to the spoor editor. */
const SpoorScreenFormat=(()=>{
  const doubles=['⇗','⇘','⇙','⇖'],singles=['↗','↘','↙','↖'];
  function format(value){
    if(value===null||value===undefined||!Number.isFinite(Number(value)))return '';
    const quarter=Math.round(Number(value)*4),base=Math.floor(quarter/4),rest=quarter-base*4;
    return rest===0?String(base):rest===1?base+'+':rest===2?base+'++':(base+1)+'−';
  }
  function parse(text){
    if(!text.trim())return null;
    const m=text.trim().replace(/−/g,'-').match(/^([+-]?\d+)(\+\+|\+|-)?$/);
    if(!m)throw Error('Gebruik bijvoorbeeld 30, 30+, 30++ of 31−.');
    return Number(m[1])+({'':0,'+':.25,'++':.5,'-':-.25}[m[2]||'']);
  }
  function arrow(v,a,geometry,direction='west',style='double'){
    try{
      const from=SpoorGeometry.point(v,geometry),to=SpoorGeometry.point(a,geometry);
      const dx=(to.x-from.x)*(direction==='oost'?-1:1),dy=to.y-from.y;
      if(Math.hypot(dx,dy)<1e-8)return '·';
      if(Math.abs(dx)<1e-8)return dy<0?(style==='double'?'⇑':'↑'):(style==='double'?'⇓':'↓');
      if(Math.abs(dy)<1e-8)return dx>0?(style==='double'?'⇒':'→'):(style==='double'?'⇐':'←');
      const index=dx>0?(dy<0?0:1):(dy>0?2:3);return (style==='double'?doubles:singles)[index];
    }catch(_){return '·';}
  }
  function contact(band,direction='west',style='bar'){
    if(direction==='oost')band={west:'oost',oost:'west'}[band]||band;
    return (style==='bar'?{west:'⇤',oost:'⇥',noord:'⤒',zuid:'⤓'}:{west:'←',oost:'→',noord:'↑',zuid:'↓'})[band]||'·';
  }
  return {format,parse,arrow,contact};
})();
if(typeof module!=='undefined')module.exports=SpoorScreenFormat;
if(typeof window!=='undefined')window.installThreeBSpoorScreen=adapter=>{
  document.body.classList.add('spoor-editor-only');
  if(document.getElementById('openSpoorscherm'))return;
  const css=document.createElement('style');css.textContent=`
  #spoorScreen{position:fixed;inset:auto;margin:0;z-index:3000;box-shadow:0 8px 30px #0005;width:min(96vw,460px);max-height:94dvh;overflow:auto;padding:12px;border:1px solid #8a9b91;border-radius:10px;background:#f7f5ed;color:#142e24;font:15px system-ui;box-sizing:border-box;--spoor-symbol-size:32px}
  body.spoor-editor-only #lineEditor,body.spoor-editor-only #ballNudgePanel,body.spoor-editor-only .workspace>.editor,body.spoor-editor-only .ball-value-window,body.spoor-editor-only #toggleConfig{display:none!important}#spoorScreen>header{cursor:grab;touch-action:none;user-select:none}#spoorScreen>header:active{cursor:grabbing}#spoorScreen header,#spoorScreen footer{display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap}#spoorScreen h2{font-size:18px;margin:0}
  #spoorScreen table{width:100%;table-layout:fixed;border-collapse:collapse;background:#fff}#spoorScreen th,#spoorScreen td{padding:6px 3px;border-bottom:1px solid #d8dfd8;text-align:left}#spoorScreen thead th{font-size:14px;text-align:center;background:#e4ece5}#spoorScreen th:first-child{width:19%;white-space:nowrap}#spoorScreen td{width:27%}#spoorScreen tbody th{font-size:13px;text-transform:none;letter-spacing:0}#spoorScreen .spoor-point{position:relative;display:flex;align-items:center;white-space:nowrap;isolation:isolate}
  #spoorScreen .spoor-symbol{position:absolute;right:4px;top:50%;transform:translateY(-50%);z-index:0;opacity:.24;pointer-events:none;font-family:'Noto Sans Symbols 2','DejaVu Sans',sans-serif;font-size:var(--spoor-symbol-size);font-weight:800;line-height:1.25;min-width:1.1em;text-align:center;color:#123e2c;font-style:normal;-webkit-text-stroke:.25px currentColor}
  #spoorScreen .spoor-value{position:relative;z-index:1;background:transparent!important;width:100%;min-width:0;min-height:38px;padding:4px 2px;margin:0;font:600 16px system-ui;font-variant-numeric:tabular-nums;text-align:center;box-sizing:border-box}#spoorScreen .spoor-value:disabled{opacity:1;color:#655b40;background:#f4f1e8}#spoorScreen .spoor-unit{position:absolute;right:4px;bottom:1px;z-index:2;font-size:9px;pointer-events:none}#spoorScreen .selected-line{background:#fff2c7}#spoorScreen .automatic{color:#655b40}#spoorScreen footer{position:sticky;bottom:0;background:#f7f5ed;padding:8px 0 0}#spoorScreen button{min-height:38px}#spoorScreen .hint{font-size:12px;line-height:1.4;margin:8px 0}#spoorScreenStatus{flex-basis:100%;font-size:13px}#spoorScreenStatus.error{color:#a72222}#spoorScreen .spoor-tools{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:8px 0}#spoorScreen .spoor-tools label{display:flex;align-items:center;gap:6px}#spoorStyleConfig{margin:8px 0;font-size:13px}#spoorStyleConfig summary{cursor:pointer}#spoorStyleConfig .styles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}#spoorStyleConfig label{display:grid;gap:3px}#spoorScreen select{min-height:36px;max-width:100%;font:inherit}#spoorScreen .start{font-size:13px}#spoorScreen .terminal{display:block;font-size:10px;white-space:normal}
  @media(max-width:400px){#spoorScreen{padding:8px}#spoorScreen th,#spoorScreen td{padding:5px 1px}#spoorScreen .spoor-value{font-size:15px}#spoorScreen .spoor-symbol{min-width:1em}}
  `;document.head.append(css);
  const button=document.createElement('button');button.id='openSpoorscherm';button.type='button';button.textContent='Spoorscherm · V/R/A';document.querySelector('.selection-menu-header').after(button);
  const dialog=document.createElement('dialog');dialog.id='spoorScreen';
  dialog.innerHTML=`<header><h2 id="spoorScreenTitle">Spoorscherm</h2><div><button id="positionSpoorScreen" type="button" title="Terug in beeld" aria-label="Spoorscherm terug in beeld">↺</button><button id="closeSpoorScreen" type="button" aria-label="Sluiten" title="Sluiten">×</button></div></header>
  <div class="spoor-tools"><label><input id="mirrorSpoorScreen" type="checkbox">Spiegelen · naar Oost</label><span id="spoorDirectionLabel"></span></div>
  <table><thead><tr><th>Lijn</th><th>V</th><th>R</th><th>A</th></tr></thead><tbody></tbody></table>
  <details id="spoorStyleConfig"><summary>Config</summary><div class="styles"><label>S · startpunt<select id="spoorStart"><option value="0">Benedenacquit · S</option><option value="2">Middenacquit · S+2</option><option value="4">Bovenacquit · S+4</option></select></label><label>V en A<select id="spoorArrowStyle"><option value="double">⇖ Dubbele pijlen</option><option value="single">↖ Enkele pijlen</option></select></label><label>Raakpunt<select id="spoorContactStyle"><option value="bar">⇥ Pijl met bandstreep</option><option value="single">→ Enkele pijl</option></select></label><label>Symboolgrootte<select id="spoorSymbolSize"><option value="24">24</option><option value="28">28</option><option value="32" selected>32</option></select></label></div><p class="hint">V en A volgen de speelrichting; R wijst naar de geraakte band.<br>30+ ≈ 30¼ · 30++ ≈ 30½ · 31− ≈ 30¾. Exacte bestaande waarden blijven bewaard.</p></details>
  <p id="spoorMeasurementHint" class="hint"></p><footer><button id="saveSpoorScreen" type="button">Bewaar spoor</button><button id="reloadSpoorScreen" type="button">Herlaad</button><span id="spoorScreenStatus" role="status" aria-live="polite"></span></footer>`;
  document.body.append(dialog);
  const $=id=>dialog.querySelector('#'+id),body=dialog.querySelector('tbody'),text=(message,error=false)=>{$('spoorScreenStatus').textContent=message;$('spoorScreenStatus').classList.toggle('error',error);};
  let original,working,dirty=false,saving=false,viewDirection;
  const styleKey='3b-spoorscherm-stijlen-v1';
  try{const saved=JSON.parse(localStorage.getItem(styleKey)||'{}');for(const [id,value] of Object.entries(saved))if($(id)&&[...$(id).options].some(o=>o.value===value))$(id).value=value;}catch(_){}
  function symbols(tr,line){
    const row=working[line.key],arrow=SpoorScreenFormat.arrow(row.V,row.A,original.geometry,original.direction,$('spoorArrowStyle').value);
    for(const side of ['V','L','R','A']){const symbol=tr.querySelector('.spoor-symbol[data-side='+side+']');if(!symbol)continue;symbol.textContent=side==='L'?'↔':side==='R'?SpoorScreenFormat.contact(row.A?.band,original.direction,$('spoorContactStyle').value):arrow;const directions={'⇗':'noordoost','↗':'noordoost','⇘':'zuidoost','↘':'zuidoost','⇙':'zuidwest','↙':'zuidwest','⇖':'noordwest','↖':'noordwest','⇑':'noord','↑':'noord','⇓':'zuid','↓':'zuid','⇒':'oost','→':'oost','⇐':'west','←':'west'};const band=original.direction==='oost'?({west:'oost',oost:'west'}[row.A?.band]||row.A?.band):row.A?.band;
      const label=side==='L'?'Afstootlengte in centimeter':side==='R'?'Raakpunt met de '+band+'band':side+' · speelrichting '+(directions[arrow]||'onbekend');symbol.setAttribute('aria-label',label);symbol.title=label;}
  }
  function refresh(tr,line){
    const input=tr.querySelector('.spoor-value[data-side=R]');
    if(!input){symbols(tr,line);return;}
    try{input.value=SpoorScreenFormat.format(SpoorGeometry.contact(working[line.key].V,working[line.key].A,original.geometry).value);input.setCustomValidity('');}
    catch(error){input.value='';input.title=error.message;input.setCustomValidity('');}
    symbols(tr,line);
  }
  function controls(td,line,side){
    const row=working[line.key],p=side==='L'?{value:row.lengthCm}:side==='R'?null:row[side];
    if(p?.kind==='acquit'){td.textContent='Start S'+(Number(p.offset)?(Number(p.offset)>0?'+':'')+p.offset:'');td.className='start';return;}
    const wrap=document.createElement('div');wrap.className='spoor-point';const symbol=document.createElement('span');symbol.className='spoor-symbol';symbol.dataset.side=side;symbol.setAttribute('role','img');
    const input=document.createElement('input');input.type='text';input.className='spoor-value';input.dataset.side=side;input.value=SpoorScreenFormat.format(p?.value);input.placeholder='·';input.autocomplete='off';input.spellcheck=false;input.disabled=line.terminal||side==='L'&&!original.strokeLimits;input.setAttribute('aria-label',side==='L'?'Neus afstootlengte in cm':line.label+' '+side+' waarde');
    wrap.append(input,symbol);if(side==='L'){const unit=document.createElement('small');unit.className='spoor-unit';unit.textContent='cm';wrap.append(unit);}td.append(wrap);
    input.oninput=()=>{
      try{
        const value=SpoorScreenFormat.parse(input.value);
        if(side==='L'){
          const limits=original.strokeLimits;if(value===null||!limits||value<limits.min-1e-6||value>limits.max+1e-6)throw Error('Lengte buiten bereik ('+Math.ceil(limits?.min||0)+'–'+Math.floor(limits?.max||0)+' cm).');row.lengthCm=value;row.changed.add('L');
        }else if(side==='R'){
          if(value===null)throw Error('Vul het raakpunt in, of kies Herlaad.');
          const a=SpoorGeometry.arrival(row.V,{band:row.A.band,value},original.geometry);row.A={...row.A,...a};row.changed.add('A');if(row.V.kind!=='acquit')row.changed.add('V');
          td.parentElement.querySelector('.spoor-value[data-side=A]').value=SpoorScreenFormat.format(a.value);
        }else{row[side]={...row[side],value};row.changed.add(side);}
        input.setCustomValidity('');dirty=true;if(side!=='R')refresh(td.parentElement,line);else symbols(td.parentElement,line);text('Wijzigingen nog niet bewaard.');
      }catch(error){input.setCustomValidity(error.message);text(error.message,true);}
    };
    input.onblur=()=>{if(input.checkValidity()&&input.value!=='')input.value=SpoorScreenFormat.format(SpoorScreenFormat.parse(input.value));};
  }
  function load(direction=viewDirection){
    original=adapter.read(direction);viewDirection=original.direction;working={};dirty=false;body.replaceChildren();
    $('spoorScreenTitle').textContent='Spoorscherm · '+original.label;$('mirrorSpoorScreen').checked=original.direction==='oost';$('spoorDirectionLabel').textContent=original.direction==='oost'?'Oost':'West';
    $('spoorMeasurementHint').textContent=original.direction==='oost'?'Eigen Oost-meting: apart bewaard in deze browser; de West-meting blijft behouden.':'';
    for(const line of original.lines){working[line.key]={V:structuredClone(line.V),A:structuredClone(line.A),lengthCm:line.key==='neus'?original.strokeLengthCm:null,changed:new Set()};const tr=document.createElement('tr');tr.dataset.line=line.key;
      const th=document.createElement('th');th.scope='row';th.textContent=line.label;tr.append(th);
      if(line.terminal){const small=document.createElement('span');small.className='terminal';small.textContent='Auto'+(line.fraction===.5?' · ½':line.fraction===.25?' · ¼':'');th.append(small);}
      for(const side of line.key==='neus'?['V','L','A']:['V','R','A']){const td=document.createElement('td');if(line.terminal)td.className='automatic';controls(td,line,side);tr.append(td);}body.append(tr);refresh(tr,line);
    }
    const start=$('spoorStart'),offset=Number(working.neus?.V?.offset)||0;start.querySelector('[data-legacy]')?.remove();if(![0,2,4].includes(offset)){const option=new Option('Bestaand · S'+(offset>0?'+':'')+offset,String(offset));option.dataset.legacy='true';start.add(option);}start.value=String(offset);
    dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');text(window.THREEB_TEST_ENVIRONMENT?'TEST · bewaren in aparte browseropslag.':'Bewaar spoor om je wijzigingen vast te leggen.');
  }
  for(const id of ['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'])$(id).onchange=()=>{localStorage.setItem(styleKey,JSON.stringify(Object.fromEntries(['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'].map(id=>[id,$(id).value]))));dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');for(const tr of body.rows)symbols(tr,original.lines.find(l=>l.key===tr.dataset.line));};
  $('spoorStart').onchange=()=>{const offset=Number($('spoorStart').value),row=working.neus;row.V={...row.V,kind:'acquit',value:offset?'S+'+offset:'S',offset,configuredStartOffset:offset};row.changed.add('S');dirty=true;const tr=body.querySelector('[data-line=neus]');tr.querySelector('.start').textContent='Start '+row.V.value;symbols(tr,original.lines.find(l=>l.key==='neus'));text('Startpunt gewijzigd; kies Bewaar spoor.');};
  let position;
  function place(next){const box=dialog.getBoundingClientRect();const left=Math.max(48-box.width,Math.min(innerWidth-48,next.left)),top=Math.max(-18,Math.min(innerHeight-32,next.top));position={left,top};dialog.style.left=left+'px';dialog.style.top=top+'px';}
  function recenter(){const box=dialog.getBoundingClientRect();place({left:(innerWidth-box.width)/2,top:Math.max(8,(innerHeight-box.height)/2)});}
  function open(options={}){
    if(dialog.open&&dirty){text('Bewaar of herlaad voordat je een andere lijn kiest.',true);return;}
    load();if(!dialog.open)dialog.show();
    if(options.recenter||!position)recenter();else place(position);
    if(options.line){const row=[...body.rows].find(row=>row.dataset.line===options.line);row?.classList.add('selected-line');}
    document.querySelector('#closeSelectionMenu')?.click();document.querySelector('#closeOwnerMenu')?.click();
  }
  window.openThreeBSpoorScreen=open;button.onclick=()=>open({recenter:true});
  $('positionSpoorScreen').onclick=recenter;
  const header=dialog.querySelector('header');header.onpointerdown=event=>{
    if(event.button!==0||event.target.closest('button,input,select'))return;
    event.preventDefault();const box=dialog.getBoundingClientRect(),x=event.clientX,y=event.clientY;header.setPointerCapture(event.pointerId);
    const move=e=>{if(e.pointerId===event.pointerId)place({left:box.left+e.clientX-x,top:box.top+e.clientY-y});};
    const end=e=>{if(e.pointerId!==event.pointerId)return;header.removeEventListener('pointermove',move);header.removeEventListener('pointerup',end);header.removeEventListener('pointercancel',end);};
    header.addEventListener('pointermove',move);header.addEventListener('pointerup',end);header.addEventListener('pointercancel',end);
  };
  window.addEventListener('resize',()=>{if(dialog.open&&position)place(position);});
  window.addEventListener('threeb-spoor-state',()=>{if(!dialog.open||saving)return;if(dirty){text('Tafel gewijzigd; bewaar of herlaad vóór verdere edits.',true);return;}load();});
  $('mirrorSpoorScreen').onchange=()=>{if(saving||dirty){$('mirrorSpoorScreen').checked=original.direction==='oost';text('Bewaar of herlaad voordat je spiegelt.',true);return;}load($('mirrorSpoorScreen').checked?'oost':'west');};
  function close(){if(saving)return;if(dirty){text('Bewaar je wijzigingen of kies Herlaad voordat je sluit.',true);return;}dialog.close();}
  $('closeSpoorScreen').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});$('reloadSpoorScreen').onclick=()=>{if(!saving)load();};
  $('saveSpoorScreen').onclick=async()=>{
    if(saving)return;for(const input of dialog.querySelectorAll('.spoor-value'))if(!input.reportValidity())return;if(!dirty){text('Geen gewijzigde waarden.');return;}
    const changes=[];for(const [line,row] of Object.entries(working))for(const side of row.changed)changes.push({line,side,point:side==='L'?{value:row.lengthCm}:side==='S'?row.V:row[side]});
    saving=true;for(const el of dialog.querySelectorAll('input,select,button'))el.disabled=true;text('Bewaren…');
    try{await adapter.save(original,changes);load();text(original.direction==='oost'?'Oost-meting apart bewaard in deze browser.':window.THREEB_TEST_ENVIRONMENT?'Spoor bewaard in de testbrowser.':'Spoor bewaard.');}
    catch(error){text(error.message,true);}
    finally{saving=false;for(const el of dialog.querySelectorAll('button,select,#mirrorSpoorScreen'))el.disabled=false;if(dirty)for(const tr of body.rows)if(!original.lines.find(l=>l.key===tr.dataset.line).terminal)for(const el of tr.querySelectorAll('input'))el.disabled=false;}
  };
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
};
