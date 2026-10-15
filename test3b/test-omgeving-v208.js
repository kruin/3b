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
  // Fail before loading the app if storage cannot be separated from production.
  for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{value:isolated(window[name]),configurable:false});
  document.addEventListener('DOMContentLoaded',()=>{
    const banner=document.createElement('aside');banner.id='testEnvironmentBanner';
    banner.style.cssText='padding:10px;background:#ffdf75;color:#302500;font:600 14px system-ui;text-align:center';
    banner.textContent='TEST v208-r15 · aparte browseropslag · geen databaseverbinding';
    const link=document.createElement('a');link.href=location.pathname+'#owner=kruin';link.textContent=' · Kruin-testbediening';banner.append(link);
    document.body.prepend(banner);document.title='TEST · 3B v208-r15';
  });
})();
