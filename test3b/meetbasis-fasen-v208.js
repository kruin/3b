/* Read-only, phased introduction. Every ball and line comes from the course adapter. */
(() => {
  'use strict';
  const legacyCreate=window.ThreeBMeetsysteemIntro.create;
  window.ThreeBMeetsysteemIntro.create=options=>{
    const ns='http://www.w3.org/2000/svg',completionKey='3b-meetbasis-fasen-v1';let step=0,legacy=null,fanTrack='ZES',parallelTrack='VIJF+1',baseTable=options.setup?.()?.table||'klein';
    const guided=options.owner==='user'&&new URLSearchParams(location.search).get('uCourse')==='1';
    const phases=[
      {title:'Start bij acquit 0',text:'Het onderste acquit noemen we 0. Daar begint de Neus. De stippen liggen op de stiplijnen.',lines:[]},
      {title:'De waaier: VIJF',text:'Dit is de Neus van spoor VIJF. De lijn vertrekt bij 0 en eindigt bij A op de stiplijn; het raakpunt R op de band volgt daaruit.',lines:[['VIJF','VIJF']]},
      {title:'De waaier: VIJF en ZES',text:'Het vertrekpunt blijft 0, de richting verandert. Het volgende hoofdspoor heet ZES.',lines:[['VIJF','VIJF'],['ZES','ZES']]},
      {title:'De parallel van VIJF',text:'Bij een parallel blijft de richting gelijk. We nemen VIJF als basis. P staat voor parallel.',lines:[['VIJF','VIJF']]},
      {title:'VIJF en VIJF+1',text:'VIJF+1 is de parallel +1 van VIJF: het vertrek verschuift, de richting blijft gelijk. +1 hoort altijd bij P, de parallel.',lines:[['VIJF','VIJF'],['VIJF+1','VIJF+1']]},
      {title:'Later: dezelfde parallel op Groot',text:'De opbouw blijft gelijk. De lijnen komen nu uit de eigen meetbasis voor deze andere tafel.',lines:[['VIJF','VIJF'],['VIJF+1','VIJF+1']]}
    ];
    const dialog=document.createElement('dialog');dialog.id='meetbasisIntro';dialog.classList.toggle('guided-intro',guided);dialog.setAttribute('aria-labelledby','foundationTitle');
    dialog.innerHTML='<header><h2 id="foundationTitle">Meetbasis · 0, waaier en parallellen</h2><button type="button" id="closeFoundation" aria-label="Meetbasis sluiten">×</button></header><div class="foundation-layout"><section class="foundation-table"><span id="foundationTableName"></span><svg id="foundationSvg" role="img" aria-label="Meetlijnen vanuit de gekozen referentie 0"></svg></section><section class="foundation-info"><h3 id="foundationHeading"></h3><fieldset id="foundationChoice"><label>Mijn tafel <select id="foundationOwnTable"><option value="klein">Klein</option><option value="groot">Groot</option></select></label></fieldset><div id="foundationPlay" hidden><span id="foundationPlayName"></span><div id="foundationPlayChoices" role="group"></div></div><details id="foundationExplanation"><summary>Uitleg</summary><p id="foundationText"></p></details><div id="foundationValues"></div><details id="foundationMore"><summary>Meetwaarden en herkomst</summary><p id="foundationProvenance"></p></details><button id="foundationLarge" type="button" hidden>Later: Groot bekijken →</button></section></div><nav aria-label="Stappen van de meetbasis"><button id="foundationPrevious" type="button">← Vorige</button><button id="foundationNext" type="button">Volgende →</button></nav>';
    const style=document.createElement('style');style.textContent=`
      #meetbasisIntro{box-sizing:border-box;width:min(1120px,calc(100dvw - 16px));height:calc(100dvh - 16px);max-width:calc(100dvw - 16px);max-height:calc(100dvh - 16px);margin:auto;padding:12px;border:2px solid #176f4f;border-radius:12px;background:#faf8ef;color:#173b30;font:16px/1.5 system-ui;overflow:hidden}
      #meetbasisIntro[open]{display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:12px}#meetbasisIntro::backdrop{background:#0008}
      #meetbasisIntro header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:10px;border-bottom:1px solid #b6c7bd}#meetbasisIntro h2{font-size:20px;line-height:1.2;margin:0}#meetbasisIntro h3{font-size:21px;margin:12px 0}#meetbasisIntro p{margin:10px 0}
      #meetbasisIntro button{min-height:44px;padding:8px 12px;border:1px solid #78988b;border-radius:7px;background:white;color:#173b30;font:inherit}#meetbasisIntro button:disabled{opacity:.4}#closeFoundation{min-width:44px;font-size:22px!important}
      .foundation-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.85fr);gap:20px;min-height:0}.foundation-table{overflow:auto;display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0}.foundation-info{min-height:0;overflow:auto;overscroll-behavior:contain;padding-right:5px}
      #foundationTableName,#foundationProgress{font-size:14px;color:#486359}#foundationSvg{display:block;width:100%;height:100%;min-height:220px}#foundationMore{margin-top:18px;font-size:14px}#foundationMore summary{cursor:pointer;min-height:44px;display:flex;align-items:center}#foundationValues{font-size:15px}#foundationLarge{margin-top:16px}#meetbasisIntro [hidden]{display:none!important}#foundationChoice{border:1px solid #b6c7bd;border-radius:7px;padding:8px}#foundationChoice select{font:inherit;min-height:44px;background:white;color:#173b30}
      #meetbasisIntro>nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;border-top:1px solid #b6c7bd;padding-top:8px}#foundationNext{background:#176f4f!important;color:white!important}
      @media(max-width:600px) and (orientation:portrait){#meetbasisIntro{padding:8px}#meetbasisIntro h2{font-size:17px}.foundation-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1.6fr) minmax(0,1fr);gap:10px}.foundation-info{border-top:1px solid #b6c7bd;padding-top:5px}#meetbasisIntro h3{font-size:18px;margin:8px 0}#meetbasisIntro p{margin:6px 0}}
      @media(max-width:600px) and (max-height:560px){.foundation-layout{grid-template-columns:minmax(0,1fr) minmax(145px,.9fr);grid-template-rows:minmax(0,1fr)}.foundation-info{border-top:0;padding-top:0}}
      @media(orientation:landscape) and (max-height:500px){#meetbasisIntro{padding:6px;gap:5px}#meetbasisIntro h2{font-size:16px}#meetbasisIntro header{padding-bottom:4px}.foundation-layout{gap:12px}#meetbasisIntro h3{font-size:17px;margin:5px 0}#meetbasisIntro p{margin:5px 0}}

      #meetbasisIntro.guided-intro .foundation-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;gap:4px}
      #meetbasisIntro.guided-intro #foundationHeading,#meetbasisIntro.guided-intro #foundationTableName{display:none}
      #meetbasisIntro.guided-intro .foundation-table{grid-template-rows:minmax(0,1fr)}#meetbasisIntro.guided-intro #foundationSvg{min-height:0}
      #meetbasisIntro.guided-intro .foundation-info{border:0;padding:0;max-height:30dvh}
      #meetbasisIntro.guided-intro #foundationChoice{margin:0 0 4px;padding:4px 8px}
      #meetbasisIntro.guided-intro #foundationExplanation summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font-size:14px}
      #meetbasisIntro.guided-intro #foundationExplanation p{max-width:55ch;margin:4px 0 8px}
      #meetbasisIntro.guided-intro>nav{grid-template-columns:44px minmax(0,320px) 44px;justify-content:center;gap:8px}
      #meetbasisIntro.guided-intro #foundationPrevious{padding:4px;font-size:0}
      #meetbasisIntro.guided-intro #foundationPrevious::after{content:'←';font-size:20px}
      #foundationPlay{display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}#foundationPlayName{font-size:14px}#foundationPlayChoices{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}#foundationPlayChoices button{padding:6px 10px;font-size:14px}#foundationPlayChoices button[aria-pressed=true]{background:#176f4f;color:white;border-color:#176f4f;font-weight:700}
      #meetbasisIntro.guided-intro #foundationNext{min-height:52px;font-weight:700;font-size:18px}
      @media(max-height:560px){#meetbasisIntro.guided-intro .foundation-layout{grid-template-columns:minmax(0,1fr) minmax(150px,.8fr);grid-template-rows:minmax(0,1fr);gap:8px}#meetbasisIntro.guided-intro .foundation-info{max-height:100%}#meetbasisIntro.guided-intro #foundationPlay{flex-direction:column;align-items:center}}
    `;document.head.append(style);document.body.append(dialog);const $=id=>dialog.querySelector('#'+id),svg=$('foundationSvg');
    if(!guided){const detail=$('foundationExplanation');detail.before($('foundationText'));detail.remove();}
    const otherTable=()=>baseTable==='klein'?'groot':'klein';
    const read=(track='VIJF',table=step===5?otherTable():baseTable)=>options.route(track,table);
    function add(tag,attrs,text){const n=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attrs))n.setAttribute(key,String(value));if(text!==undefined)n.textContent=text;svg.append(n);return n;}
    const shownLines=()=>guided&&step===2?(fanTrack==='VIJF'?[['VIJF','VIJF']]:[['VIJF','VIJF'],[fanTrack,fanTrack]]):guided&&step===4?(parallelTrack==='VIJF'?[['VIJF','VIJF']]:[['VIJF','VIJF'],[parallelTrack,parallelTrack]]):phases[step].lines;
    function playControls(){
      const fan=step===2,visible=guided&&(fan||step===4);$('foundationPlay').hidden=!visible;$('foundationPlayChoices').replaceChildren();if(!visible)return;
      const selected=fan?fanTrack:parallelTrack,title=(fan?'W · ':'P · ')+(selected==='VIJF'?'VIJF':'VIJF en '+selected);$('foundationTitle').textContent=title;$('foundationHeading').textContent=title;$('foundationText').textContent=fan?'W staat voor waaier: hetzelfde vertrekpunt 0, een andere richting. VIJF, ZES en ZEVEN zijn hoofdsporen.':'P staat voor parallel: het vertrek verschuift, de richting blijft gelijk. +1 hoort altijd bij P, de parallel. VIJF+2 is de volgende parallel.';$('foundationPlayName').textContent=fan?'W · richting':'P · parallel';$('foundationPlayChoices').setAttribute('aria-label',fan?'Waaier vanuit 0':'Parallellen van VIJF');
      for(const track of fan?['VIJF','ZES','ZEVEN']:['VIJF','VIJF+1','VIJF+2']){const button=document.createElement('button');button.type='button';button.textContent=track;button.dataset.foundationChoiceTrack=track;button.setAttribute('aria-pressed',String(track===(fan?fanTrack:parallelTrack)));button.onclick=()=>{if(fan)fanTrack=track;else parallelTrack=track;playControls();draw();};$('foundationPlayChoices').append(button);}
    }
    function draw(){
      const base=read(),g=base.geometry,origin=base.neusPart?.from;if(!origin)return;svg.replaceChildren();window.ThreeBTableMarks.frame(svg,g);svg.dataset.table=step===5?otherTable():baseTable;
      const box=svg.viewBox.baseVal;add('rect',{x:box.x,y:box.y,width:box.width,height:box.height,fill:'#76512b',rx:1.2});add('rect',{x:0,y:0,width:g.widthCm,height:g.heightCm,fill:'#176548',stroke:'#e7cf94','stroke-width':.8});
      const matrix=svg.getScreenCTM(),unit=matrix?Math.hypot(matrix.a,matrix.b)||1:1,labelSize=Math.max(4,16/unit),valueSize=Math.max(4,14/unit);
      const rows=shownLines().map(([track,label])=>({track,label,data:read(track)})).filter(row=>row.data.neusPart);
      // Draw the actual ball-centre paths, followed by the actual projections to the stiplijn.
      for(const [i,row]of rows.entries()){const p=row.data.neusPart,ref=row.data.route.neus.to,aim=SpoorGeometry.point(ref,g),color=i===0?'#ffdc68':i===1?'#70dbda':'#e6a0db';
        add('line',{x1:p.from.x,y1:p.from.y,x2:p.to.x,y2:p.to.y,stroke:color,'stroke-width':guided&&(step===2||step===4)&&rows.length>1&&i===0?.8:1.6,opacity:guided&&(step===2||step===4)&&rows.length>1&&i===0?.5:1,'data-foundation-track':row.track,'data-foundation-label':row.label,'data-source-table':svg.dataset.table});
        add('line',{x1:p.to.x,y1:p.to.y,x2:aim.x,y2:aim.y,stroke:color,'stroke-width':.65,'stroke-dasharray':'2 1','data-foundation-projection':row.track});add('circle',{cx:aim.x,cy:aim.y,r:1.1,fill:color});
        add('text',{x:p.to.x+3,y:p.to.y+valueSize*1.2,'text-anchor':'start','font-size':valueSize,fill:color},'A '+ref.value);
        const t=rows.length===3?[.37,.66,.34][i]:[.45,.7][i]||.5;add('text',{x:p.from.x+(p.to.x-p.from.x)*t+3,y:p.from.y+(p.to.y-p.from.y)*t-3,'font-size':labelSize,fill:color,stroke:'#176548','stroke-width':1.1,'paint-order':'stroke'},row.label);
        if(Math.hypot(p.from.x-origin.x,p.from.y-origin.y)>1e-7)add('circle',{cx:p.from.x,cy:p.from.y,r:row.data.radiusCm,fill:'#fffaf0',stroke:color,'stroke-width':.45,'data-foundation-start':row.track});
      }
      add('circle',{cx:origin.x,cy:origin.y,r:base.radiusCm,fill:'#fffaf0',stroke:'#173b30','stroke-width':.4,'data-foundation-zero':'true'});add('text',{x:origin.x+6,y:origin.y+1.8,'font-size':Math.max(5.5,16/unit),fill:'#fffaf0'},'0');
      window.ThreeBTableMarks.draw(svg,g);
    }
    function render(){const phase=phases[step];dialog.dataset.phase=String(step);$('foundationTableName').textContent=((step===5?otherTable():baseTable)==='groot'?'Groot':'Klein')+' · Kruins meetbasis';$('foundationHeading').textContent=step===5?'Later: parallel op '+(otherTable()==='groot'?'Groot':'Klein'):phase.title;if(guided){$('foundationTitle').textContent=phase.title;$('foundationExplanation').open=false;}$('foundationText').textContent=step===0&&options.owner==='kruin'?'Het onderste acquit is vertrekpunt 0. Voor Kruin staat dit uitgangspunt in Config.':phase.text;$('foundationChoice').hidden=step!==0||options.owner==='kruin';$('foundationOwnTable').value=baseTable;$('foundationPrevious').disabled=step===0;$('foundationNext').textContent=guided?(step>=4?'Volgende: VIJF →':'Volgende →'):step>=4?'Begin met VIJF →':step===0&&options.owner!=='kruin'?'Gebruik 0 voor mijn tafel →':'Volgende →';$('foundationLarge').textContent='Later: '+(otherTable()==='groot'?'Groot':'Klein')+' bekijken →';$('foundationLarge').hidden=guided||step!==4;$('foundationMore').hidden=guided||step===0;
      $('foundationProvenance').textContent=phase.lines.map(([track])=>{const row=read(track),p=row.route.neus.to;return track+' · Neus A '+p.value+' · '+(p.measurement?'gemeten':p.status==='calculated'?'berekend':'Kruinreferentie');}).join('. ');playControls();$('foundationValues').textContent='';$('foundationMore').open=false;dialog.querySelector('.foundation-info').scrollTop=0;draw();
    }
    function finish(){try{localStorage.setItem(completionKey,'1');}catch(_){}dialog.close();options.onContinue({foundation:true,table:step===5?otherTable():baseTable});}
    $('foundationOwnTable').onchange=()=>{baseTable=$('foundationOwnTable').value;render();};
    const close=()=>{dialog.close();options.onClose?.();};$('closeFoundation').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});$('foundationPrevious').onclick=()=>{step=step===5?4:Math.max(0,step-1);render();};$('foundationNext').onclick=()=>{if(step===0&&options.owner!=='kruin')options.chooseSetup?.(baseTable);if(step>=4)finish();else{step++;render();}};$('foundationLarge').onclick=()=>{step=5;render();};
    return {dialog,pause(){legacy?.pause();},completed(){try{return localStorage.getItem(completionKey)==='1'&&(options.owner==='kruin'||!!options.setup?.());}catch(_){return false;}},open({parallel=false,at=0}={}){if(parallel){legacy??=legacyCreate(options);return legacy.open({parallel:true,at});}step=Math.max(0,Math.min(5,Number(at)||0));fanTrack='ZES';parallelTrack='VIJF+1';render();if(!dialog.open)dialog.showModal();requestAnimationFrame(draw);}};
  };
})();
