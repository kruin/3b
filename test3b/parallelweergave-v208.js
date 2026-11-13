/* Alleen weergavevoorkeuren; geen meetwaarden of spoorgeometrie. */
(() => {
  'use strict';
  const key='3b-parallelweergave-v1';
  const defaults={coding:'track',mode:'step',build:'whole'};
  const allowed={coding:['track','uniform','part'],mode:['step','all'],build:['whole','stages']};
  const palette=['#91dfff','#f5b4e0','#ffe28a','#b9ef94','#ffb089','#c7b9ff','#f1f3e5'];
  const dashes=['','6 2','2 2','8 2 1 2','4 2','1 2'];
  function isKruin(){return (new URLSearchParams(location.search).get('config')==='kruin'||['owner','config'].some(key=>new URLSearchParams(location.hash.slice(1)).get(key)==='kruin'))&&!window.THREEB_DESKTOP_MOBILE_PREVIEW&&!document.body?.classList.contains('customer-preview');}
  function syncRole(){document.documentElement.dataset.displayRole=isKruin()?'kruin':'user';}
  function get(){let stored={};try{stored=JSON.parse(localStorage.getItem(key))||{};}catch(_){}const p={...defaults};for(const k of Object.keys(defaults))if(allowed[k].includes(stored[k]))p[k]=stored[k];return p;}
  function set(patch){if(!isKruin())return get();const p=get();for(const k of Object.keys(defaults))if(allowed[k].includes(patch[k]))p[k]=patch[k];try{localStorage.setItem(key,JSON.stringify(p));}catch(_){}window.dispatchEvent(new Event('threeb-parallel-display'));return p;}
  function attrs(track,part,fallback='#ffe28a',scale=1){
    const prefs=get(),match=String(track).match(/^(HALF)?(VIER|VIJF|ZES|ZEVEN|ACHT|NEGEN)([+-]\d+)?$/);
    let index=0;if(match)index=['VIER','VIJF','ZES','ZEVEN','ACHT','NEGEN'].indexOf(match[2])*7+(Number(match[3])||0)+2+(match[1]?42:0);
    index=Math.max(0,index);
    const dash=prefs.coding==='uniform'?'4 2':prefs.coding==='part'?'':dashes[Math.floor(index/palette.length)%dashes.length];
    return {stroke:prefs.coding==='part'?fallback:prefs.coding==='uniform'?'#ffe28a':palette[index%palette.length],'stroke-dasharray':dash.split(' ').filter(Boolean).map(Number).map(n=>n*scale).join(' '),'data-parallel-track':track,'data-parallel-part':part,'data-parallel-code':prefs.coding==='track'?String(index):prefs.coding};
  }
  function controls(id,{course=true}={}){
    if(!isKruin())return null;
    const box=document.createElement('fieldset');box.id=id;box.dataset.kruinOnly='true';
    const legend=document.createElement('legend');legend.textContent='Parallelle Neuzen en sporen';box.append(legend);
    const fields=[['coding','Kleur en arcering',[['track','Per spoor · Neus en vervolg gelijk'],['uniform','Alle parallelsporen gelijk'],['part','Per lijnsoort · oorspronkelijke kleuren']]]];
    if(course)fields.push(['mode','Tegelijk in H2',[['step','Eén spoor · stap voor stap'],['all','Alle beschikbare sporen samen']]],['build','Opbouw in H2',[['whole','Volledig spoor'],['stages','Neus → Romp → volledig spoor']]]);
    for(const [name,title,options]of fields){const label=document.createElement('label');label.textContent=title+' ';const select=document.createElement('select');select.dataset.parallelSetting=name;select.setAttribute('aria-label',title);for(const [value,text]of options)select.add(new Option(text,value));label.append(select);box.append(label);}
    const note=document.createElement('p');note.textContent=course?'Stap voor stap helpt bij volgen; samen helpt bij vergelijken. Kleur én lijnpatroon houden Neus en spoor bij elkaar.':'De Neus door Wit houdt dezelfde kleur en arcering als zijn referentiespoor. De correctie blijft een aparte richtkeuze.';note.style.fontSize='13px';box.append(note);
    const sync=()=>{const p=get();for(const select of box.querySelectorAll('[data-parallel-setting]'))select.value=p[select.dataset.parallelSetting];};
    box.onchange=e=>{if(e.target.dataset.parallelSetting)set({[e.target.dataset.parallelSetting]:e.target.value});};window.addEventListener('threeb-parallel-display',sync);sync();return box;
  }
  const style=document.createElement('style');style.textContent='html[data-display-role=user] [data-kruin-only],html[data-display-role=user] #toggleConfig,html[data-display-role=user] #userSettings,html[data-display-role=user] #userSettingsButton,html[data-display-role=user] #spoorStyleConfig,html[data-display-role=user] #desktopMobileTest{display:none!important}#parallelBuildSteps[hidden],#courseParallelSettings[hidden]{display:none!important}#courseParallelSettings label,#correctionParallelSettings label,#generalParallelSettings label{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}#courseParallelSettings select,#correctionParallelSettings select,#generalParallelSettings select{max-width:100%;min-width:0}@media(max-width:600px){#lklLesson1 .course-progress-row>p{flex:1 0 100%}#lklLesson1 .course-progress-row>select{flex:1 1 150px}}';document.head.append(style);
  syncRole();new MutationObserver(syncRole).observe(document.body,{attributes:true,attributeFilter:['class']});
  window.ThreeBParallelDisplay={get,set,attrs,controls,isKruin};
})();
