/* Production wrapper only: tested application and geometry unchanged. */
window.THREEB_RELEASE=Object.freeze({"version": "v208-r109", "date": "2026-11-15", "channel": "production", "compatibilityBase": "v208-r15", "name": "De Waaier", "measurementRevision": "af0db7f79b00c741b35ed19da2437fdbd629b07c079bcc5eecfc9d9ecc8a447f", "appSourceCommit": "0e12753573522d5392480a7c6f1663b8d931cd45", "measurementReference": "test-Kruin", "measurementSourceDbSha": "6345a0c518103237aa7803f840b7485227bdc6c6"});
(()=>{
 const install=window.installMobileTestQr;
 const label=()=>{const b=document.getElementById('mobilePreview');if(b)b.textContent='QR · Open op telefoon';const v=document.getElementById('testVersionRecall');if(v)v.textContent='De Waaier · Versie en status';};
 window.installMobileTestQr=options=>{install({...options,imageUrl:new URL('qr-production.png?v=v208-r109',location.href).href,testUrl:"https://kruin.github.io/3b/open.html?mode=user#owner=user",qrPageUrl:new URL('qr-production.html',location.href).href});label();setTimeout(label,0);const h=document.getElementById('mobileQrTitle');if(h)h.textContent='De Waaier · Open op je telefoon';};
 window.addEventListener('threeb-spoor-state',label);window.addEventListener('resize',()=>requestAnimationFrame(label));
 document.addEventListener('DOMContentLoaded',()=>{document.title=new URLSearchParams(location.search).get('h1')==='romp-kruis'?'kruis 0.1 · 3B':'De Waaier · v208-r109';label();},{once:true});
})();
