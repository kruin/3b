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
  return {contact,arrival};
})();

/* Complete spoor editing on the existing table; static tests stay in browser storage. */
window.installThreeBSpoorScreen=adapter=>{
  if(document.getElementById('openSpoorscherm'))return;
  const style=document.createElement('style');style.textContent=`
  #spoorScreen{width:min(96vw,900px);max-height:94dvh;overflow:auto;padding:16px;border:1px solid #8a9b91;border-radius:10px;background:#f7f5ed;color:#213b30;font:15px system-ui}
  #spoorScreen::backdrop{background:#0008}#spoorScreen header,#spoorScreen footer{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}#spoorScreen h2{font-size:20px;margin:0}
  #spoorScreen table{width:100%;border-collapse:collapse;background:white}#spoorScreen th,#spoorScreen td{padding:6px;border-bottom:1px solid #d8dfd8;text-align:left}#spoorScreen input,#spoorScreen select{display:block;width:100%;min-width:0;min-height:38px;margin:3px 0;font:inherit;box-sizing:border-box}#spoorScreen input{max-width:100%}#spoorScreen th:first-child{width:16%}#spoorScreen td{width:28%}#spoorScreen footer{position:sticky;bottom:0;background:#f7f5ed;padding:10px 0}#spoorScreen button{min-height:40px}#spoorScreen .automatic{font-style:italic;color:#74522d}#spoorScreen .hint{font-size:13px}#spoorScreenStatus{display:block;flex-basis:100%}#spoorScreenStatus.error{color:#a72222}
  @media(max-width:500px){#spoorScreen{padding:8px}#spoorScreen td,#spoorScreen th{padding:3px;font-size:13px}#spoorScreen input,#spoorScreen select{font-size:14px}}
  `;document.head.append(style);
  const button=document.createElement('button');button.id='openSpoorscherm';button.type='button';button.textContent='Spoorscherm · V/R/A';
  document.querySelector('.selection-menu-header').after(button);
  const dialog=document.createElement('dialog');dialog.id='spoorScreen';
  dialog.innerHTML='<header><h2 id="spoorScreenTitle">Spoorscherm</h2><button id="closeSpoorScreen" type="button">Sluiten</button></header><p class="hint">V = vertrek op de stiplijn · R = raakpunt met de band · A = aankomst op de stiplijn. Wijzig R om A te berekenen; V blijft daarbij vaststaan.</p><table><thead><tr><th>Lijn</th><th>V · vertrek</th><th>R · raakpunt</th><th>A · aankomst</th></tr></thead><tbody></tbody></table><footer><button id="saveSpoorScreen" type="button">Bewaar spoor</button><button id="reloadSpoorScreen" type="button">Herlaad</button><span id="spoorScreenStatus" role="status" aria-live="polite"></span></footer>';
  document.body.append(dialog);
  const status=dialog.querySelector('#spoorScreenStatus'),body=dialog.querySelector('tbody');
  let original,working,dirty=false,saving=false;
  const displayBand=band=>original.direction==='oost'?({west:'oost',oost:'west'}[band]||band):band;
  const bands=['west','noord','oost','zuid'],round=value=>Number(value.toFixed(6));
  const text=(message,error=false)=>{status.textContent=message;status.classList.toggle('error',error);};
  function controls(td,line,side,editable){
    const p=side==='R'?null:working[line.key][side];
    if(p?.kind==='acquit'){td.textContent='Start '+(p.start||p.value||'S');return;}
    const select=document.createElement('select');select.dataset.side=side;select.className='spoor-band';
    for(const band of bands){const option=document.createElement('option');option.value=displayBand(band);option.textContent={west:'West',noord:'Noord',oost:'Oost',zuid:'Zuid'}[displayBand(band)];select.append(option);}
    const input=document.createElement('input');input.type='number';input.step='any';input.dataset.side=side;input.className='spoor-value';input.placeholder='n.b.';
    input.setAttribute('aria-label',line.label+' '+side+' waarde');select.setAttribute('aria-label',line.label+' '+side+' band');
    select.value=displayBand(p?.band||line.A?.band||'west');input.value=p?.value==null?'':p.value;select.disabled=input.disabled=!editable;
    td.append(select,input);
    for(const el of [select,input])el.addEventListener('input',()=>{
      try{
        if(input.validity.badInput)throw Error('Vul een geldig getal in.');
        const band=displayBand(select.value),value=input.value===''?null:Number(input.value);
        if(value!==null&&!Number.isFinite(value))throw Error('Vul een geldig getal in.');
        if(side==='R'){
          if(value===null)throw Error('Vul het raakpunt in, of herlaad om je wijziging te verwerpen.');
          const from=working[line.key].V,a=SpoorGeometry.arrival(from,{band,value},original.geometry);
          working[line.key].A={...working[line.key].A,...a};
          working[line.key].changed.add('A');
          if(from.kind!=='acquit')working[line.key].changed.add('V');
          const tr=td.parentElement;tr.querySelector('.spoor-band[data-side=A]').value=displayBand(a.band);tr.querySelector('.spoor-value[data-side=A]').value=round(a.value);
        }else{
          working[line.key][side]={...working[line.key][side],band,value};working[line.key].changed.add(side);
        }
        input.setCustomValidity('');dirty=true;refreshContact(td.parentElement,line);text('Wijzigingen nog niet bewaard.');
      }catch(error){input.setCustomValidity(error.message);input.reportValidity();text(error.message,true);}
    });
  }
  function refreshContact(tr,line){
    const input=tr.querySelector('.spoor-value[data-side=R]'),select=tr.querySelector('.spoor-band[data-side=R]');
    try{const r=SpoorGeometry.contact(working[line.key].V,working[line.key].A,original.geometry);input.value=round(r.value);select.value=displayBand(r.band);input.setCustomValidity('');}
    catch(error){input.value='';input.title=error.message;input.setCustomValidity('');}
  }
  function load(){
    original=adapter.read();working={};dirty=false;body.replaceChildren();
    dialog.querySelector('#spoorScreenTitle').textContent='Spoorscherm · '+original.label;
    for(const line of original.lines){
      working[line.key]={V:structuredClone(line.V),A:structuredClone(line.A),changed:new Set()};
      const tr=document.createElement('tr');tr.dataset.line=line.key;
      const label=document.createElement('th');label.scope='row';label.textContent=line.label;tr.append(label);
      for(const side of ['V','R','A']){const td=document.createElement('td');if(line.terminal)td.className='automatic';controls(td,line,side,!line.terminal);tr.append(td);}
      body.append(tr);refreshContact(tr,line);
      if(line.terminal){const note=document.createElement('small');note.textContent='Auto · '+(line.fraction===.5?'½ ':line.fraction===.25?'¼ ':'')+line.label;label.append(document.createElement('br'),note);}
    }
    text(window.THREEB_TEST_ENVIRONMENT?'TEST · bewaren in aparte browseropslag.':'Bewaar spoor om je wijzigingen vast te leggen.');
  }
  button.onclick=()=>{load();dialog.showModal();};
  function close(){if(saving)return;if(dirty){text('Bewaar je wijzigingen of kies Herlaad voordat je sluit.',true);return;}dialog.close();}
  dialog.querySelector('#closeSpoorScreen').onclick=close;dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.querySelector('#reloadSpoorScreen').onclick=()=>{if(!saving)load();};
  dialog.querySelector('#saveSpoorScreen').onclick=async()=>{
    if(saving)return;
    for(const input of dialog.querySelectorAll('input'))if(!input.reportValidity())return;
    if(!dirty){text('Geen gewijzigde waarden.');return;}
    const changes=[];
    for(const [line,row] of Object.entries(working))for(const side of row.changed)changes.push({line,side,point:row[side]});
    saving=true;for(const el of dialog.querySelectorAll('input,select,button'))el.disabled=true;text('Bewaren…');
    try{await adapter.save(original,changes);load();text(window.THREEB_TEST_ENVIRONMENT?'Spoor bewaard in de testbrowser.':'Spoor bewaard.');}
    catch(error){text(error.message,true);}
    finally{saving=false;for(const el of dialog.querySelectorAll('button'))el.disabled=false;if(dirty)for(const tr of body.rows)if(!original.lines.find(line=>line.key===tr.dataset.line).terminal)for(const el of tr.querySelectorAll('input,select'))el.disabled=false;}
  };
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
};
