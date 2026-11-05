/* Production wrapper only: tested application and geometry unchanged. */
window.THREEB_RELEASE=Object.freeze({"version": "v208-r89", "date": "2026-11-05", "channel": "production", "compatibilityBase": "v208-r15", "name": "VIJF"});
(()=>{
 const install=window.installMobileTestQr;
 const label=()=>{const b=document.getElementById('mobilePreview');if(b)b.textContent='QR · Open op telefoon';const v=document.getElementById('testVersionRecall');if(v)v.textContent='VIJF · Versie en status';};
 window.installMobileTestQr=options=>{install({...options,imageUrl:new URL('qr-production.png?v=v208-r89',location.href).href,testUrl:"https://kruin.github.io/3b/open.html?mode=user#owner=user",qrPageUrl:new URL('qr-production.html',location.href).href});label();setTimeout(label,0);const h=document.getElementById('mobileQrTitle');if(h)h.textContent='VIJF · Open op je telefoon';};
 window.addEventListener('threeb-spoor-state',label);window.addEventListener('resize',()=>requestAnimationFrame(label));
 document.addEventListener('DOMContentLoaded',()=>{document.title='De Waaier · VIJF · v208-r89';label();},{once:true});
})();
