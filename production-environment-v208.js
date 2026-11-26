/* Production wrapper only: tested application and geometry unchanged. */
window.THREEB_RELEASE=Object.freeze({"version": "v208-r124", "date": "2026-11-26", "channel": "production", "compatibilityBase": "v208-r15", "name": "De Waaier", "measurementRevision": "af0db7f79b00c741b35ed19da2437fdbd629b07c079bcc5eecfc9d9ecc8a447f", "appSourceCommit": "acf0a504f66e7dc1ba6d5d5b66766f3ce466cd7f", "measurementReference": "test-Kruin", "measurementSourceDbSha": "6345a0c518103237aa7803f840b7485227bdc6c6", "testVersion": "v208-r124"});
(()=>{
 const install=window.installMobileTestQr;
 const label=()=>{const b=document.getElementById('mobilePreview');if(b)b.textContent='QR · Open op telefoon';const v=document.getElementById('testVersionRecall');if(v)v.textContent='De Waaier · Versie en status';};
 window.installMobileTestQr=options=>{const owner=options.button?.id==='databaseStartQr',target=new URL(owner?'./?v=v208-r124#owner=kruin':'./?cursus=waaier&uCourse=1&v=v208-r124#owner=user',location.href);install({...options,imageUrl:window.ThreeBMobileView.image(target.href),testUrl:target.href,qrPageUrl:new URL(owner?'qr-production-kruin.html':'qr-production.html',location.href).href});label();setTimeout(label,0);const h=document.getElementById('mobileQrTitle');if(h)h.textContent='De Waaier · Open op je telefoon';};
 window.addEventListener('threeb-spoor-state',label);window.addEventListener('resize',()=>requestAnimationFrame(label));
 document.addEventListener('DOMContentLoaded',()=>{document.title=new URLSearchParams(location.search).get('h1')==='romp-kruis'?'kruis 0.1 · 3B':'De Waaier · v208-r124';label();},{once:true});
})();
