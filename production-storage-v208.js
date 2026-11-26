/* Production storage: preserve native production keys; isolate the U course and volatile phone preview. */
(() => {
'use strict';
window.THREEB_PRODUCTION_TOOLS=true;
const userCoursePrefix='3b:u-course:',userCourse=new URLSearchParams(location.search).get('uCourse')==='1'&&new URLSearchParams(location.hash.slice(1)).get('owner')==='user';
window.THREEB_PRODUCTION_STORAGE=Object.freeze({storagePrefix:userCourse?userCoursePrefix:''});
  function isolated(native) {
    const prefix=userCourse?userCoursePrefix:'';
    const keys=()=>Array.from({length:native.length},(_,i)=>native.key(i)).filter(k=>k&&k.startsWith(prefix)&&(userCourse||!k.startsWith(userCoursePrefix)&&!k.startsWith('3b:test3b:')));
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
  if(preview){document.addEventListener('click',e=>{if(e.target.closest?.('a[href]')){e.preventDefault();e.stopImmediatePropagation();}},true);document.addEventListener('submit',e=>e.preventDefault(),true);window.THREEB_DESKTOP_MOBILE_PREVIEW=true;const state=JSON.parse(JSON.stringify(preview.state));state.basis={id:'desktop-mobile-preview',label:'Tijdelijke telefoonweergave',config:preview.config,values:preview.values};state.ui.explanationOpen=false;Object.defineProperty(window,'localStorage',{value:memory({...Object.fromEntries(Object.entries(preview.courseProgress||{}).filter(([key])=>/^3b-vijf-course-progress-v2(?::(?:VIJF|VIER|ZES|ZEVEN|ACHT))?$/.test(key))),'3b-canonical-west-v2':JSON.stringify(state)}),configurable:false});Object.defineProperty(window,'sessionStorage',{value:memory(),configurable:false});}
  else for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{value:isolated(window[name]),configurable:false});
})();
