(() => {
  'use strict';
  window.THREEB_TEST_ENVIRONMENT = Object.freeze({release:'v208-r15',storagePrefix:'3b:test3b:'});
  function isolated(native) {
    const prefix=window.THREEB_TEST_ENVIRONMENT.storagePrefix;
    const keys=()=>Array.from({length:native.length},(_,i)=>native.key(i)).filter(k=>k&&k.startsWith(prefix));
    return Object.freeze({
      get length(){return keys().length;},
      key(i){return keys()[i]?.slice(prefix.length)??null;},
      getItem(k){return native.getItem(prefix+String(k));},
      setItem(k,v){native.setItem(prefix+String(k),String(v));},
      removeItem(k){native.removeItem(prefix+String(k));},
      clear(){for(const k of keys())native.removeItem(k);}
    });
  }
  let preview=null;
  if(new URLSearchParams(location.search).get('desktopMobile')==='1'&&parent!==window){try{preview=parent.ThreeBDesktopMobilePreview?.snapshot||null;}catch(_){} }
  function memory(seed={}){const values=new Map(Object.entries(seed));return Object.freeze({get length(){return values.size;},key(i){return [...values.keys()][i]??null;},getItem(k){return values.get(String(k))??null;},setItem(k,v){values.set(String(k),String(v));},removeItem(k){values.delete(String(k));},clear(){values.clear();}});}
  // A preview never reads or writes native storage, and always starts as User.
  if(preview){document.addEventListener('click',e=>{if(e.target.closest?.('a[href]')){e.preventDefault();e.stopImmediatePropagation();}},true);document.addEventListener('submit',e=>e.preventDefault(),true);window.THREEB_DESKTOP_MOBILE_PREVIEW=true;const state=JSON.parse(JSON.stringify(preview.state));state.basis={config:preview.config,values:preview.values};state.ui.explanationOpen=false;Object.defineProperty(window,'localStorage',{value:memory({'3b-canonical-west-v2':JSON.stringify(state)}),configurable:false});Object.defineProperty(window,'sessionStorage',{value:memory(),configurable:false});}
  else for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{value:isolated(window[name]),configurable:false});
  document.addEventListener('DOMContentLoaded',()=>{
    const banner=document.createElement('aside');banner.id='testEnvironmentBanner';
    banner.style.cssText='padding:10px;background:#ffdf75;color:#302500;font:600 14px system-ui;text-align:center';
    banner.textContent='TEST v208-r15 · aparte browseropslag · geen databaseverbinding';
    const link=document.createElement('a');link.href=location.pathname+'#owner=kruin';link.textContent=' · Kruin-testbediening';banner.append(link);
    document.body.prepend(banner);document.title=new URLSearchParams(location.search).get('h1')==='romp-kruis'?'TEST · kruis 0.1':'TEST · 3B v208-r15';
    if(preview){const mark=()=>{if(banner.textContent!=='Mobiele test · tijdelijke kopie')banner.textContent='Mobiele test · tijdelijke kopie';};mark();new MutationObserver(mark).observe(banner,{childList:true,subtree:true,characterData:true});}
  });
})();
