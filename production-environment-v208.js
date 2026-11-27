/* Production wrapper only: tested application and geometry unchanged. */
window.THREEB_RELEASE=Object.freeze({"version": "v208-r131", "date": "2026-11-27", "channel": "production", "compatibilityBase": "v208-r15", "name": "De Waaier", "measurementRevision": "af0db7f79b00c741b35ed19da2437fdbd629b07c079bcc5eecfc9d9ecc8a447f", "appSourceCommit": "2c9518bd48557a956eb001332a8efccc87392710", "measurementReference": "test-Kruin", "measurementSourceDbSha": "6345a0c518103237aa7803f840b7485227bdc6c6", "testVersion": "v208-r131"});
(()=>{
 const install=window.installMobileTestQr;
 const label=()=>{const b=document.getElementById('mobilePreview');if(b)b.textContent='QR · Open op telefoon';const v=document.getElementById('testVersionRecall');if(v)v.textContent='De Waaier · Versie en status';};
 window.installMobileTestQr=options=>{const owner=options.button?.id==='databaseStartQr',target=new URL(owner?'./?v=v208-r131#owner=kruin':'./?cursus=waaier&uCourse=1&v=v208-r131#owner=user',location.href);install({...options,imageUrl:window.ThreeBMobileView.image(target.href),testUrl:target.href,qrPageUrl:new URL(owner?'qr-production-kruin.html':'qr-production.html',location.href).href});label();setTimeout(label,0);const h=document.getElementById('mobileQrTitle');if(h)h.textContent='De Waaier · Open op je telefoon';};
 window.addEventListener('threeb-spoor-state',label);window.addEventListener('resize',()=>requestAnimationFrame(label));
 document.addEventListener('DOMContentLoaded',()=>{document.title=new URLSearchParams(location.search).get('h1')==='romp-kruis'?'kruis 0.1 · 3B':'De Waaier · v208-r131';label();},{once:true});
})();
