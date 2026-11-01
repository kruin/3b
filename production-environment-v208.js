/* Production channel; the tested application and geometry stay unchanged. */
window.THREEB_RELEASE=Object.freeze({"version": "v208-r53", "date": "2026-11-01", "channel": "production", "compatibilityBase": "v208-r15"});
(()=>{
 const install=window.installMobileTestQr;
 const label=()=>{const b=document.getElementById('mobilePreview');if(b)b.textContent='QR · Open op telefoon';};
 window.addEventListener('threeb-spoor-state',label);
 window.addEventListener('resize',()=>requestAnimationFrame(label));
 window.installMobileTestQr=options=>{
  install({...options,imageUrl:new URL('qr-production.png?v=v208-r53',location.href).href,testUrl:'https://kruin.github.io/3b/',qrPageUrl:new URL('qr-production.html',location.href).href});
  if(options.button)options.button.textContent='QR · Open op telefoon';
  const title=document.getElementById('mobileQrTitle');if(title)title.textContent='Open op je telefoon';
 };
 document.addEventListener('DOMContentLoaded',()=>{
  document.title='3B · v208-r53';
  const style=document.createElement('style');style.textContent='#cleanConfigDialog #mobilePreview{display:block!important}#cleanConfigDialog #bandCore{padding:10px;border-radius:10px;background:#80582f}#cleanConfigDialog #bandCore small{font:600 14px system-ui;color:#fff4dd}#cleanConfigDialog #bandCore button{min-width:44px;min-height:44px;font:600 17px system-ui;background:#fff7e9;color:#442a13}#cleanConfigDialog #bandCore select{font:600 17px system-ui;background:#fff7e9;color:#442a13}#cleanConfigDialog #bandCore output{font:700 16px system-ui;color:white;min-width:100px;text-align:center}';document.head.append(style);
 },{once:true});
})();
