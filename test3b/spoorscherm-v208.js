window.THREEB_RELEASE=Object.freeze({"version": "v208-r17", "date": "2026-10-28", "channel": "test", "compatibilityBase": "v208-r15"});
/* Physical phone testing: show the project's published QR, without changing app state. */
if(typeof window!=='undefined'){
  window.installMobileTestQr=function({button,imageUrl,testUrl,qrPageUrl}){
    if(!button)return;
    let dialog=document.getElementById('mobileQrDialog');
    if(!dialog){
      const style=document.createElement('style');style.textContent='#mobileQrDialog{width:min(94vw,440px);max-height:92dvh;box-sizing:border-box;overflow:auto;padding:16px;border:1px solid #82958b;border-radius:12px;background:#fff;color:#142e24;font:16px system-ui;text-align:center}#mobileQrDialog::backdrop{background:#0006}#mobileQrDialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}#mobileQrDialog h2{font:700 20px system-ui;margin:0}#mobileQrDialog button{min-width:44px;min-height:44px;font:20px system-ui;color:#142e24;background:#f1f5f2;border:1px solid #82958b;border-radius:6px}#mobileQrDialog img{display:block;width:100%;height:auto;max-width:410px;margin:12px auto;background:#fff}#mobileQrDialog p{font:14px/1.4 system-ui;margin:10px 0}#mobileQrDialog a{color:#1552a0;text-decoration:underline}';document.head.append(style);
      dialog=document.createElement('dialog');dialog.id='mobileQrDialog';dialog.setAttribute('aria-labelledby','mobileQrTitle');
      const header=document.createElement('header'),title=document.createElement('h2'),close=document.createElement('button');title.id='mobileQrTitle';title.textContent='Test op je telefoon';close.type='button';close.textContent='×';close.setAttribute('aria-label','QR sluiten');close.onclick=()=>dialog.close();header.append(title,close);
      const img=document.createElement('img');img.src=imageUrl;img.alt='QR-code om dit project op je telefoon te openen';
      const instruction=document.createElement('p');instruction.textContent='Scan met de camera van je telefoon. Test staand én liggend.';
      const links=document.createElement('p'),large=document.createElement('a'),open=document.createElement('a');large.href=qrPageUrl;large.textContent='QR groot openen';large.target='_blank';large.rel='noopener';open.href=testUrl;open.textContent='Open de site';open.target='_blank';open.rel='noopener';links.append(large,document.createTextNode(' · '),open);
      const note=document.createElement('p');note.textContent='De QR opent de site; eigen gegevens en instellingen worden niet automatisch overgenomen.';
      dialog.append(header,instruction,img,links,note);document.body.append(dialog);
    }
    button.textContent='QR · Test op telefoon';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','mobileQrDialog');button.onclick=()=>{if(!dialog.open)dialog.showModal();};
  };
  const script=document.currentScript;
  if(script?.dataset.testUrl){
    const setup=()=>{const button=document.createElement('button');button.id='openMobileQr';button.type='button';button.style.cssText='position:fixed;right:12px;top:12px;z-index:3000;min-height:44px;padding:8px 14px;border:1px solid #82958b;border-radius:8px;background:white;color:#142e24;font:700 15px system-ui';document.body.append(button);window.installMobileTestQr({button,imageUrl:new URL(script.dataset.qrImage,script.src).href,testUrl:script.dataset.testUrl,qrPageUrl:new URL(script.dataset.qrPage,script.src).href});};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
  }
}

'use strict';
// R uses the cushion numbering (0–80 / 0–40). Its tangential coordinate
// is the ball centre's coordinate; the normal coordinate is the cushion edge.
const SpoorGeometry = (() => {
  const bands=['west','noord','oost','zuid'];
  const known=p=>p&&(p.kind==='acquit'||p.value!==null&&p.value!==''&&Number.isFinite(Number(p.value))&&bands.includes(p.band));
  function point(p,g){
    if(!known(p))throw Error('V of A is nog onbekend.');
    const {widthCm:w,heightCm:h,dotOffsetCm:d}=g,v=Number(p.value);
    if(p.kind==='acquit')return {x:w/2,y:h*(.75-((Number(p.offset)||0)+(Number(g.startAcquitOffset)||0))/8)};
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
  function arrival(v,r,g){return arrivalFromBall(point(v,g),r,g);}
  function arrivalFromBall(from,r,g){
    if(!bands.includes(r.band)||!Number.isFinite(r.value))throw Error('Kies een band en een geldig raakpunt.');
    const w=g.widthCm,h=g.heightCm,d=g.dotOffsetCm,i=g.inset;
    const ball={west:{x:i,y:(1-r.value/80)*h},oost:{x:w-i,y:r.value/80*h},noord:{x:r.value/40*w,y:i},zuid:{x:(1-r.value/40)*w,y:h-i}}[r.band];
    if(ball.x<i-1e-6||ball.x>w-i+1e-6||ball.y<i-1e-6||ball.y>h-i+1e-6)throw Error('Raakpunt ligt buiten de band.');
    const axis=['west','oost'].includes(r.band)?'x':'y',target={west:-d,oost:w+d,noord:-d,zuid:h+d}[r.band],delta=from[axis]-ball[axis];
    if(Math.abs(delta)<1e-9)throw Error('Geen unieke aankomst.');
    const u=(target-ball[axis])/delta,p={x:ball.x+u*(from.x-ball.x),y:ball.y+u*(from.y-ball.y)};
    return {band:r.band,value:value(r.band,p,g)};
  }
  function departureFromBall(ball,a,band,g){
    const aim=point(a,g),axis=['west','oost'].includes(band)?'x':'y',target={west:-g.dotOffsetCm,oost:g.widthCm+g.dotOffsetCm,noord:-g.dotOffsetCm,zuid:g.heightCm+g.dotOffsetCm}[band],delta=aim[axis]-ball[axis];
    if(Math.abs(delta)<1e-9)throw Error('Geen uniek vertrek.');const u=(target-ball[axis])/delta,p={x:ball.x+u*(aim.x-ball.x),y:ball.y+u*(aim.y-ball.y)};return {band,value:value(band,p,g)};
  }
  return {contact,arrival,arrivalFromBall,departureFromBall,point};
})();

/* Translate a launch ray, then find its real cushion sequence. Coordinates are
   ball centres; stip values are projections on the original diamond lines. */
const ThreeBStartRay=(()=>{
  function trace(nose,g,offset,count=9){
    const w=g.widthCm,h=g.heightCm,d=g.dotOffsetCm,r=g.inset;
    if(!nose?.from||!nose?.to||nose.to.value===null||nose.to.value===undefined||nose.to.value===''||!Number.isFinite(Number(nose.to.value)))return {error:'Neusrichting nog onbekend',pattern:'?'};
    const from=SpoorGeometry.point(nose.from,{...g,startAcquitOffset:Number(g.referenceOffset)||0}),aim=SpoorGeometry.point(nose.to,{...g,startAcquitOffset:0});
    let p={x:from.x,y:from.y-h*offset/8},v={x:aim.x-from.x,y:aim.y-from.y};
    const heading={...v},origin={...p},hits=[],segments=[];
    if(!Object.values(v).every(Number.isFinite)||Math.hypot(v.x,v.y)<1e-9)return {error:'Neusrichting nog onbekend',pattern:'?'};
    if(p.x<=r||p.x>=w-r||p.y<=r||p.y>=h-r)return {error:'Vertrekpunt ligt buiten het speelvlak',pattern:'?'};
    function stip(band,at,dir){
      const vertical=band==='west'||band==='oost',axis=vertical?'x':'y',target={west:-d,oost:w+d,noord:-d,zuid:h+d}[band];
      const u=(target-at[axis])/dir[axis],q={x:at.x+u*dir.x,y:at.y+u*dir.y};
      const value={west:(1-q.y/h)*80,oost:q.y/h*80,noord:q.x/w*40,zuid:(1-q.x/w)*40}[band];
      return {band,value,status:'calculated',source:'start_acquit_geometry',calculationBasis:'translated_launch_ray'};
    }
    for(let i=0;i<count;i++){
      const times=[['west',v.x<0?(r-p.x)/v.x:Infinity],['oost',v.x>0?(w-r-p.x)/v.x:Infinity],['noord',v.y<0?(r-p.y)/v.y:Infinity],['zuid',v.y>0?(h-r-p.y)/v.y:Infinity]].filter(([,t])=>t>1e-9).sort((a,b)=>a[1]-b[1]);
      if(!times.length||!Number.isFinite(times[0][1]))return {error:'Geen volgende band',pattern:'?',hits,segments,heading,origin};
      if(Math.abs(times[0][1]-times[1]?.[1])<1e-8)return {error:'Hoekpunt: geen eenduidige bandvolgorde',pattern:'?',hits,segments,heading,origin};
      const [band,t]=times[0],end={x:p.x+t*v.x,y:p.y+t*v.y};
      segments.push({from:i?stip(hits[i-1].band,p,v):{...nose.from},to:stip(band,end,v)});
      hits.push({band,center:end});p=end;v={x:(band==='west'||band==='oost')?-v.x:v.x,y:(band==='noord'||band==='zuid')?-v.y:v.y};
    }
    return {pattern:hits.slice(0,3).map(hit=>['west','oost'].includes(hit.band)?'L':'K').join(''),hits,segments,heading,origin};
  }
  return {trace};
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
  if(window.THREEB_TEST_ENVIRONMENT){
    document.body.classList.add('threeb-test-appearance');
    if(!document.getElementById('threebTestAppearance')){const style=document.createElement('style');style.id='threebTestAppearance';style.textContent=`
      body.threeb-test-appearance,.threeb-test-appearance .drawing{background:#eee9f7!important}
      .threeb-test-appearance #testEnvironmentBanner{position:sticky;top:0;z-index:4000;background:#4e347a!important;color:#fff!important;border-bottom:3px solid #bba5df;font:600 14px system-ui!important;padding:10px!important}
      .threeb-test-appearance #testEnvironmentBanner a{color:#fff!important;text-decoration:underline}
      .threeb-test-appearance #spoorTestVersion{display:inline-block;background:#fff;color:#4e347a;padding:3px 8px;border-radius:5px;font-weight:800;margin-right:6px}
      .threeb-test-appearance #testTransfer{position:relative!important;top:auto!important;right:auto!important;z-index:1!important;margin:8px 8px 8px auto;background:#f4effc!important;border-color:#8064a6!important}
      .threeb-test-appearance #centralStartAcquitControl{background:#f4effc;border-color:#8064a6}
      .threeb-test-appearance #spoorScreen{background:#faf8ff;border:2px solid #8064a6}
    `;document.head.append(style);}
  }

  const releaseVersion=window.THREEB_RELEASE?.version||'onbekend';
  window.installMobileTestQr?.({button:document.getElementById('mobilePreview'),imageUrl:new URL('qr-test-neus.png?v='+releaseVersion,location.href).href,testUrl:'https://kruin.github.io/3b/test3b/?v='+releaseVersion+'#owner=kruin',qrPageUrl:new URL('qr.html',location.href).href});
  const markTestVersion=()=>{const banner=document.querySelector('#testEnvironmentBanner');if(banner&&!document.querySelector('#spoorTestVersion')){const version=document.createElement('span');version.id='spoorTestVersion';version.textContent='TEST '+releaseVersion;document.title='TEST · 3B '+releaseVersion;if(banner.firstChild?.nodeType===3)banner.firstChild.textContent=banner.firstChild.textContent.replace('TEST v208-r15 · aparte browseropslag · geen databaseverbinding',' · testopslag · geen database · ');banner.prepend(version);const height=()=>document.documentElement.style.setProperty('--threeb-test-banner-height',banner.offsetHeight+'px');height();window.addEventListener('resize',height);}};
  markTestVersion();window.addEventListener('DOMContentLoaded',markTestVersion,{once:true});

  if(document.getElementById('openSpoorscherm'))return;
  const css=document.createElement('style');css.textContent=`
  body:has(#explanationCarousel:not([hidden])) #testTransfer,body:has(#spoorScreen[open]) #testTransfer{display:none}
  .spoor-origin-options [hidden]{display:none!important}
  .spoor-reference-diff{border-color:#a36b00!important;background:#fff3d4!important}.spoor-origin-options{display:flex;gap:4px;width:100%}.spoor-origin-options button{flex:1;min-height:44px;min-width:0;padding:5px 4px;border:1px solid #8a9b91;border-radius:5px;background:#f7f5ed;color:#142e24;font:600 13px system-ui;touch-action:manipulation}#spoorScreen .spoor-origin-options button{min-height:44px}.spoor-origin-options button.active{background:#176f4f!important;color:#fff!important;border-color:#0d4934}.spoor-start-setting{grid-column:1/-1;display:grid;gap:4px}#centralStartAcquit[hidden],#spoorStart[hidden]{display:none!important}
  [data-start-acquit="true"]{pointer-events:auto;cursor:pointer}#centralStartAcquitControl{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;padding:5px 8px;background:#f7f5ed;color:#142e24;border:1px solid #8a9b91;border-radius:6px;font:600 13px system-ui}#spoorScreen .spoor-start-cycle{font:inherit;padding:0 3px;background:transparent;border:0;color:inherit;min-width:0;width:100%;touch-action:manipulation}#startAcquitCycle{font:800 16px system-ui;padding:2px 8px;min-height:32px;touch-action:manipulation}#startAcquitPatternStatus{flex-basis:100%;text-align:center;font-size:12px}#centralStartAcquitControl{flex-wrap:wrap}#centralStartAcquit{min-height:32px;max-width:65%;font:inherit} #spoorScreen{position:fixed;inset:auto;margin:0;z-index:3000;box-shadow:0 8px 30px #0005;width:min(96vw,460px);max-height:94dvh;overflow:auto;padding:12px;border:1px solid #8a9b91;border-radius:10px;background:#f7f5ed;color:#142e24;font:15px system-ui;box-sizing:border-box;--spoor-symbol-size:32px}
  body.spoor-editor-only #lineEditor,body.spoor-editor-only #ballNudgePanel,body.spoor-editor-only .workspace>.editor,body.spoor-editor-only .ball-value-window,body.spoor-editor-only #toggleConfig{display:none!important}#spoorScreen>header{cursor:grab;touch-action:none;user-select:none}#spoorScreen>header:active{cursor:grabbing}#spoorScreen header,#spoorScreen footer{display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap}#spoorScreen h2{font-size:18px;margin:0}
  #spoorScreen table{width:100%;table-layout:fixed;border-collapse:collapse;background:#fff}#spoorScreen th,#spoorScreen td{padding:6px 3px;border-bottom:1px solid #d8dfd8;text-align:left}#spoorScreen thead th{font-size:14px;text-align:center;background:#e4ece5}#spoorScreen th:first-child{width:19%;white-space:nowrap}#spoorScreen td{width:27%}#spoorScreen tbody th{font-size:13px;text-transform:none;letter-spacing:0}#spoorScreen .spoor-point{position:relative;display:flex;align-items:center;white-space:nowrap;isolation:isolate}
  #spoorScreen .spoor-symbol{position:absolute;right:4px;top:50%;transform:translateY(-50%);z-index:0;opacity:.24;pointer-events:none;font-family:'Noto Sans Symbols 2','DejaVu Sans',sans-serif;font-size:var(--spoor-symbol-size);font-weight:800;line-height:1.25;min-width:1.1em;text-align:center;color:#123e2c;font-style:normal;-webkit-text-stroke:.25px currentColor}
  #spoorScreen .spoor-value{position:relative;z-index:1;background:transparent!important;width:100%;min-width:0;min-height:38px;padding:4px 2px;margin:0;font:600 16px system-ui;font-variant-numeric:tabular-nums;text-align:center;box-sizing:border-box}#spoorScreen .spoor-value:disabled{opacity:1;color:#655b40;background:#f4f1e8}#spoorScreen .spoor-unit{position:absolute;right:4px;bottom:1px;z-index:2;font-size:9px;pointer-events:none}#spoorScreen .selected-line{background:#fff2c7}#spoorScreen .automatic{color:#655b40}#spoorScreen footer{position:sticky;bottom:0;background:#f7f5ed;padding:8px 0 0}#spoorScreen button{min-height:38px}#spoorScreen .hint{font-size:12px;line-height:1.4;margin:8px 0}#spoorScreenStatus{flex-basis:100%;font-size:13px}#spoorScreenStatus.error{color:#a72222}#spoorScreen .spoor-tools{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:8px 0}#spoorScreen .spoor-tools label{display:flex;align-items:center;gap:6px}#spoorStyleConfig{margin:8px 0;font-size:13px}#spoorStyleConfig summary{cursor:pointer;font-weight:700;padding:10px;border:1px solid #8a9b91;border-radius:6px;background:#e4ece5}#spoorScreen #configSpoorScreen,#courseSpoorConfig{font-weight:700;background:#e4ece5;color:#142e24;border:1px solid #8a9b91;border-radius:6px;padding:6px 12px;min-height:38px}#spoorStyleConfig .styles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}#spoorStyleConfig label{display:grid;gap:3px}#spoorScreen select{min-height:36px;max-width:100%;font:inherit}#spoorScreen .start{font-size:13px}#spoorScreen .terminal{display:block;font-size:10px;white-space:normal}
  #svgMount .table-svg[data-desktop-angle] text{transform-box:fill-box;transform-origin:center;transform:rotate(calc(-1 * var(--desktop-table-angle,0deg)))}
  #svgMount .table-svg[data-desktop-angle] :is(.route-caption,.value-tag){transform-box:fill-box;transform-origin:center;transform:rotate(calc(-1 * var(--desktop-table-angle,0deg)))}
  #svgMount .table-svg[data-desktop-angle] :is(.route-caption,.value-tag) text{transform:none}
  #svgMount .segment-hit:focus{outline:none}#svgMount .segment-hit:focus-visible{stroke:#ffd35a;stroke-width:4}

  body.table-only.mobile-preview.mobile-preview-landscape .drawing{width:min(844px,96vw)!important;height:min(390px,90dvh)!important}
  @media(pointer:coarse){body.table-only .view-actions{display:none!important}}
  /* Mobile preview is a container, not the desktop viewport. */
  body.table-only.mobile-preview .onscreen-layout{width:100%;height:100%;min-width:0;min-height:0}
  body.table-only.mobile-preview .drawing{padding:0;box-sizing:border-box}
  body.table-only.mobile-preview .svg-mount,body.table-only.mobile-preview .drawing-card{min-width:0;min-height:0;max-width:100%;max-height:100%}
  @media(min-width:761px){body.table-only .view-actions{left:8px;right:auto;z-index:2251}}
  @media(max-width:400px){#spoorScreen{padding:8px}#spoorScreen th,#spoorScreen td{padding:5px 1px}#spoorScreen .spoor-value{font-size:15px}#spoorScreen .spoor-symbol{min-width:1em}}
  `;document.head.append(css);
  const button=document.createElement('button');button.id='openSpoorscherm';button.type='button';button.textContent='Spoorscherm · V/R/A';document.querySelector('.selection-menu-header').after(button);
  const dialog=document.createElement('dialog');dialog.id='spoorScreen';
  dialog.innerHTML=`<header><h2 id="spoorScreenTitle">Spoorscherm</h2><div><button id="configSpoorScreen" type="button" aria-expanded="false" aria-controls="spoorStyleConfig">⚙ Config</button><button id="positionSpoorScreen" type="button" title="Terug in beeld" aria-label="Spoorscherm terug in beeld">↺</button><button id="closeSpoorScreen" type="button" aria-label="Sluiten" title="Sluiten">×</button></div></header>
  <div class="spoor-tools"><label><input id="mirrorSpoorScreen" type="checkbox">Spiegelen · naar Oost</label><span id="spoorDirectionLabel"></span></div>
  <table><thead><tr><th>Lijn</th><th>V</th><th>R</th><th>A</th></tr></thead><tbody></tbody></table>
  <details id="spoorStyleConfig"><summary>Config</summary><p id="spoorComparisonInfo" class="hint" hidden></p><div class="styles"><div class="spoor-start-setting"><span>Vertrekacquit</span><div class="spoor-origin-options" role="group" aria-label="Zuid Onder Midden Boven"><button type="button" data-spoor-origin="-2">Z · Zuid</button><button type="button" data-spoor-origin="0">O · Onder</button><button type="button" data-spoor-origin="2">M · Midden</button><button type="button" data-spoor-origin="4">B · Boven</button></div><select id="spoorStart" hidden aria-hidden="true" tabindex="-1"><option value="-2">Z · Zuid</option><option value="0">O · Onder</option><option value="2">M · Midden</option><option value="4">B · Boven</option></select></div><label><span>Acquits Z/S · O · M · B op tafel</span><input id="showTableAcquits" type="checkbox" style="width:24px;height:24px;min-height:24px"></label><label>Mobiel · staand / liggend<select id="mobileTableOrientation"><option value="auto">Automatisch</option><option value="upright">Staand</option><option value="right">Liggend ↻ rechtsom</option><option value="left">Liggend ↺ linksom</option></select></label><label>Desktop · Klein<select id="desktopOrientationKlein"><option value="upright">Rechtop</option><option value="right">↻ Kwartslag rechtsom</option><option value="left">↺ Kwartslag linksom</option></select></label><label>Desktop · Groot<select id="desktopOrientationGroot"><option value="upright">Rechtop</option><option value="right">↻ Kwartslag rechtsom</option><option value="left">↺ Kwartslag linksom</option></select></label><label>V en A<select id="spoorArrowStyle"><option value="double">⇖ Dubbele pijlen</option><option value="single">↖ Enkele pijlen</option></select></label><label>Raakpunt<select id="spoorContactStyle"><option value="bar">⇥ Pijl met bandstreep</option><option value="single">→ Enkele pijl</option></select></label><label>Symboolgrootte<select id="spoorSymbolSize"><option value="24">24</option><option value="28">28</option><option value="32" selected>32</option></select></label></div><p class="hint">Z = Zuid (Engels S = South), O = Onder, M = Midden, B = Boven. Z/S ligt op de zuidband (VIJF−2): referentiepunt, geen balpositie; een korte Neus blijft mogelijk. Notatie: M · ZEVEN (= O · VIJF+2). Onder, Midden en Boven liggen op hun vaste acquit. Parallel (+/−) en waaier blijven relatief aan het gekozen vertrekpunt.<br>V en A volgen de speelrichting; R wijst naar de geraakte band.<br>30+ ≈ 30¼ · 30++ ≈ 30½ · 31− ≈ 30¾. Exacte bestaande waarden blijven bewaard.</p></details>
  <p id="spoorMeasurementHint" class="hint"></p><footer><button id="saveSpoorScreen" type="button">Bewaar spoor</button><button id="reloadSpoorScreen" type="button">Herlaad</button><span id="spoorScreenStatus" role="status" aria-live="polite"></span></footer>`;
  document.body.append(dialog);
  const $=id=>dialog.querySelector('#'+id),body=dialog.querySelector('tbody'),text=(message,error=false)=>{$('spoorScreenStatus').textContent=message;$('spoorScreenStatus').classList.toggle('error',error);};
  let original,working,dirty=false,saving=false,viewDirection;
  $('showTableAcquits').checked=adapter.showAcquits?.()!==false;$('showTableAcquits').onchange=()=>adapter.setShowAcquits($('showTableAcquits').checked);
  $('mobileTableOrientation').value=adapter.mobileOrientation?.()||'auto';$('mobileTableOrientation').onchange=()=>adapter.setMobileOrientation($('mobileTableOrientation').value);
  for(const table of ['klein','groot']){
    const field=$('desktopOrientation'+(table==='klein'?'Klein':'Groot'));field.value=adapter.desktopOrientations?.()[table]||'upright';
    field.onchange=()=>adapter.setDesktopOrientation(table,field.value);
  }
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
    if(p?.kind==='acquit'){const start=document.createElement('button');start.type='button';start.className='spoor-start-cycle';start.textContent='Start '+originCode()+(Number(p.offset)?(Number(p.offset)>0?'+':'')+p.offset:'');bindStartChoice(start);td.append(start);td.className='start';return;}
    const wrap=document.createElement('div');wrap.className='spoor-point';const symbol=document.createElement('span');symbol.className='spoor-symbol';symbol.dataset.side=side;symbol.setAttribute('role','img');
    const input=document.createElement('input');input.type='text';input.className='spoor-value';input.dataset.side=side;input.value=SpoorScreenFormat.format(p?.value);input.placeholder='·';input.autocomplete='off';input.spellcheck=false;input.disabled=line.terminal||side==='L'&&!original.strokeLimits||side==='V'&&line.editableV===false||side==='A'&&line.editableA===false||side==='R'&&line.editableA===false;input.setAttribute('aria-label',side==='L'?'Neus afstootlengte in cm':line.label+' '+side+' waarde');
    if(p?.inputReference&&(p.band!==p.inputReference.band||Math.abs(p.value-p.inputReference.value)>.125)){input.title='Afgeleid uit karkas; opgeslagen meting '+SpoorScreenFormat.format(p.inputReference.value);input.classList.add('spoor-reference-diff');}
    wrap.append(input,symbol);if(side==='L'){const unit=document.createElement('small');unit.className='spoor-unit';unit.textContent='cm';wrap.append(unit);}td.append(wrap);
    input.oninput=()=>{
      try{
        const value=SpoorScreenFormat.parse(input.value);
        if(side==='L'){
          const limits=original.strokeLimits;if(value===null||!limits||value<limits.min-1e-6||value>limits.max+1e-6)throw Error('Lengte buiten bereik ('+Math.ceil(limits?.min||0)+'–'+Math.floor(limits?.max||0)+' cm).');row.lengthCm=value;row.changed.add('L');
        }else if(side==='R'){
          if(value===null)throw Error('Vul het raakpunt in, of kies Herlaad.');
          const r={band:row.A.band,value},a=line.editableV===false&&row.startBall?SpoorGeometry.arrivalFromBall(row.startBall,r,original.geometry):SpoorGeometry.arrival(row.V,r,original.geometry);row.A={...row.A,...a};row.changed.add('A');if(row.V.kind!=='acquit'&&line.editableV!==false)row.changed.add('V');
          td.parentElement.querySelector('.spoor-value[data-side=A]').value=SpoorScreenFormat.format(a.value);
        }else{row[side]={...row[side],value};row.changed.add(side);}
        if(line.editableV===false&&row.startBall&&(side==='A'||side==='R')){row.V={...row.V,...SpoorGeometry.departureFromBall(row.startBall,row.A,row.V.band,original.geometry)};td.parentElement.querySelector('.spoor-value[data-side=V]').value=SpoorScreenFormat.format(row.V.value);}
        input.setCustomValidity('');dirty=true;if(side!=='R')refresh(td.parentElement,line);else symbols(td.parentElement,line);text('Wijzigingen nog niet bewaard.');
      }catch(error){input.setCustomValidity(error.message);text(error.message,true);}
    };
    input.onblur=()=>{if(input.checkValidity()&&input.value!=='')input.value=SpoorScreenFormat.format(SpoorScreenFormat.parse(input.value));};
  }
  function load(direction=viewDirection){
    original=adapter.read(direction);viewDirection=original.direction;working={};dirty=false;body.replaceChildren();
    const comparison=$('spoorComparisonInfo');comparison.hidden=!window.THREEB_TEST_ENVIRONMENT;comparison.textContent=adapter.comparisonInfo?.()||'';comparison.title='Vergelijk deze tafelcode op desktop en telefoon. Bij verschillende codes zijn de getoonde tafelgegevens of instellingen niet gelijk.';
    $('spoorScreenTitle').textContent='Spoorscherm · '+original.label+' · '+original.actualPattern;$('mirrorSpoorScreen').checked=original.direction==='oost';$('spoorDirectionLabel').textContent=original.direction==='oost'?'Oost':'West';
    $('spoorMeasurementHint').textContent=(original.startError?original.startError+'. ':original.actualPattern!=='LKL'?'Dit spoor valt buiten LKL ('+original.actualPattern+'). ':'')+(original.direction==='oost'?'Eigen Oost-meting: apart bewaard in deze browser; de West-meting blijft behouden.':'');
    const head=original.lines.find(line=>line.key==='kop')?.A;if(!head||head.value===null)$('spoorMeasurementHint').textContent+=' Kop A is nog niet gemeten; de tussenroute is onvolledig.';else if(head.source==='estimate')$('spoorMeasurementHint').textContent+=' Kop A is een schatting, geen meting.';
    $('spoorMeasurementHint').textContent+=' Neus en Romp zijn leidend; Kop A is het meetanker. De tussenwaarden zijn afgeleid.';
    for(const line of original.lines){working[line.key]={V:structuredClone(line.V),A:structuredClone(line.A),lengthCm:line.key==='neus'?original.strokeLengthCm:null,startBall:line.startBall,changed:new Set()};const tr=document.createElement('tr');tr.dataset.line=line.key;
      const th=document.createElement('th');th.scope='row';th.textContent=line.label;tr.append(th);
      if(line.terminal){const small=document.createElement('span');small.className='terminal';small.textContent='Auto'+(line.fraction===.5?' · ½':line.fraction===.25?' · ¼':'');th.append(small);}
      for(const side of ['V','R','A']){const td=document.createElement('td');if(line.terminal)td.className='automatic';if(line.key==='neus'&&side==='R'){td.textContent='—';td.setAttribute('aria-label','Neus heeft geen raakpunt');}else controls(td,line,side);tr.append(td);}body.append(tr);refresh(tr,line);
    }
    const refs=original.lines.flatMap(line=>['V','A'].filter(side=>line[side]?.inputReference&&Math.abs(line[side].value-line[side].inputReference.value)>.125).map(side=>line.label+' '+side+': opgeslagen '+SpoorScreenFormat.format(line[side].inputReference.value)+', uit karkas '+SpoorScreenFormat.format(line[side].value)));if(refs.length)$('spoorMeasurementHint').textContent+=' Tussenmetingen bewaard als referentie: '+refs.join('; ')+'.';
    $('spoorStart').value=String(original.startAcquitOffset);
    dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');text(window.THREEB_TEST_ENVIRONMENT?'TEST · bewaren in aparte browseropslag.':'Bewaar spoor om je wijzigingen vast te leggen.');
  }
  for(const id of ['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'])$(id).onchange=()=>{localStorage.setItem(styleKey,JSON.stringify(Object.fromEntries(['spoorArrowStyle','spoorContactStyle','spoorSymbolSize'].map(id=>[id,$(id).value]))));dialog.style.setProperty('--spoor-symbol-size',$('spoorSymbolSize').value+'px');for(const tr of body.rows)symbols(tr,original.lines.find(l=>l.key===tr.dataset.line));};
  function setStart(offset){
    if(dirty||saving){syncStart();text('Bewaar of herlaad je spoorwijzigingen voordat je het vertrekpunt wijzigt.',true);return;}
    try{adapter.setStartAcquit(Number(offset));syncStart();if(dialog.open)load();text('Vertrekpunt gewijzigd: Zuid / Onder / Midden / Boven.');}catch(error){syncStart();text(error.message,true);}
  }
  const central=document.createElement('div');central.id='centralStartAcquitControl';central.innerHTML='<div class="spoor-origin-options" role="group" aria-label="Vertrekpunt"><button type="button" data-spoor-origin="-2">Z · Zuid</button><button type="button" data-spoor-origin="0">O · Onder</button><button type="button" data-spoor-origin="2">M · Midden</button><button type="button" data-spoor-origin="4">B · Boven</button></div><select id="centralStartAcquit" hidden aria-hidden="true" tabindex="-1"><option value="-2">Z · Zuid</option><option value="0">O · Onder</option><option value="2">M · Midden</option><option value="4">B · Boven</option></select><small id="startAcquitPatternStatus" role="status"></small>';document.getElementById('bandDock')?.append(central);
  function originCode(){return adapter.startAcquitCode?.()||{'-2':'Z',0:'O',2:'M',4:'B'}[adapter.startAcquitOffset()]||'O';}
  function bindStartChoice(node){node.title='Kies Zuid, Onder, Midden of Boven';node.setAttribute('aria-label','Vertrekpunt '+originCode()+' · kies acquit');node.onclick=showConfig;}
  for(const node of [...central.querySelectorAll('[data-spoor-origin]'),...dialog.querySelectorAll('[data-spoor-origin]')])node.onclick=()=>setStart(Number(node.dataset.spoorOrigin));
  document.addEventListener('click',e=>{if(!e.target.closest('[data-start-acquit="true"]'))return;e.preventDefault();e.stopImmediatePropagation();open({recenter:true});showConfig();},true);
  function syncStart(){const value=String(adapter.startAcquitOffset()),available=adapter.availableStartAcquits?.()||[-2,0,2,4];$('spoorStart').value=value;central.querySelector('select').value=value;for(const node of [...central.querySelectorAll('[data-spoor-origin]'),...dialog.querySelectorAll('[data-spoor-origin]')]){const active=node.dataset.spoorOrigin===value;if(node.dataset.spoorOrigin==='-2')node.textContent=adapter.language?.()==='en'?'S · South':'Z · Zuid';node.hidden=!available.includes(Number(node.dataset.spoorOrigin));node.classList.toggle('active',active);node.setAttribute('aria-pressed',String(active));}for(const select of [$('spoorStart'),central.querySelector('select')])for(const option of select.options){if(option.value==='-2')option.textContent=adapter.language?.()==='en'?'S · South':'Z · Zuid';option.hidden=!available.includes(Number(option.value));option.disabled=option.hidden;}}
  $('spoorStart').onchange=()=>setStart($('spoorStart').value);central.querySelector('select').onchange=e=>setStart(e.target.value);window.addEventListener('threeb-spoor-state',syncStart);syncStart();

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
  function fitExpandedConfig(){requestAnimationFrame(()=>{if(!dialog.open)return;const box=dialog.getBoundingClientRect();if(box.top>=0&&box.bottom>innerHeight-8)place({left:box.left,top:Math.max(8,innerHeight-box.height-8)});});}
  function showConfig(){const config=$('spoorStyleConfig');config.open=true;fitExpandedConfig();config.scrollIntoView({block:'nearest'});dialog.querySelector('[data-spoor-origin="'+adapter.startAcquitOffset()+'"]').focus({preventScroll:true});}
  $('configSpoorScreen').onclick=showConfig;
  $('spoorStyleConfig').ontoggle=()=>{ $('configSpoorScreen').setAttribute('aria-expanded',String($('spoorStyleConfig').open));if($('spoorStyleConfig').open)fitExpandedConfig(); };
  const courseActions=document.querySelector('#explanationCarousel .course-header-actions');if(courseActions){const config=document.createElement('button');config.type='button';config.id='courseSpoorConfig';config.textContent='⚙ Config';config.onclick=()=>{open({recenter:true});showConfig();};courseActions.prepend(config);}

  const course=document.querySelector('#explanationCarousel');
  if(course&&!document.getElementById('courseAcquitMotivation')){
    const motivation=document.createElement('p');motivation.id='courseAcquitMotivation';
    motivation.textContent='Oriëntatie op de echte tafel: O · Onder, M · Midden en B · Boven zijn vaste herkenningspunten. Van daaruit lees of trek je de lijnen naar de stippen en stiplijnen. De acquitletter hoort bij je spoornotatie. Voorbeeld: M · ZEVEN = O · VIJF+2. Dit zijn twee notaties voor hetzelfde spoor: alle lijnen, raakpunten en ballen zijn gelijk. Je kiest een ander vast punt als referentie; je krijgt daardoor geen ander spoor. Z · Zuid (Engels: S · South) is ook een vertrekkeuze op de zuidband, met VIJF−2 als referentie. Op dat referentiepunt past geen bal; een korte Neus met de bal binnen het speelvlak is wel mogelijk. Via Config kun je deze markeringen op de tafel tonen.';
    motivation.style.cssText='margin:8px 12px;line-height:1.45;max-width:70ch';
    const assessment=document.getElementById('courseAssessment');
    if(assessment?.parentElement)assessment.before(motivation);else course.append(motivation);
  }

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
    const changes=[];for(const [line,row] of Object.entries(working))for(const side of row.changed)changes.push({line,side,point:side==='L'?{value:row.lengthCm}:row[side]});
    saving=true;for(const el of dialog.querySelectorAll('input,select,button'))el.disabled=true;text('Bewaren…');
    try{await adapter.save(original,changes);load();text(original.direction==='oost'?'Oost-meting apart bewaard in deze browser.':window.THREEB_TEST_ENVIRONMENT?'Spoor bewaard in de testbrowser.':'Spoor bewaard.');}
    catch(error){text(error.message,true);}
    finally{saving=false;for(const el of dialog.querySelectorAll('button,select,#mirrorSpoorScreen'))el.disabled=false;if(dirty)for(const tr of body.rows)if(!original.lines.find(l=>l.key===tr.dataset.line).terminal)for(const el of tr.querySelectorAll('input'))el.disabled=false;}
  };
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
};
