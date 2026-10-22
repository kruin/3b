/* Browser backup and explicit private-GitHub handoff. No credentials or GitHub writes. */
(() => {
  'use strict';
  const clone=v=>JSON.parse(JSON.stringify(v));
  const comparable=p=>JSON.stringify(['kind','offset','configuredStartOffset','band','value','status','source','userAdjusted','measurement','calculationBasis'].map(k=>p?.[k]??null));
  function packet(capture) {
    const {source,state}=capture, operations=[], routes={};
    if(!source?.beheerRevision||!source?.beheerBasis)throw Error('De databasebron ontbreekt. Herlaad de testtafel.');
    for(const group of [state.data,state.variantData]) for(const [table,tracks] of Object.entries(group||{}))
      for(const [track,route] of Object.entries(tracks)) routes[table+':'+track]={table,track,route};
    for(const {table,track,route} of Object.values(routes)) for(const [line,points] of Object.entries(route))
      for(const side of ['from','to']) {
        const after=points?.[side];
        if(!after||!(after.userAdjusted||after.source==='user'||after.status==='edited'||after.transferReset)) continue;
        const before=source.tracks?.[table]?.[track]?.linePoints?.[line]?.[side]??null;
        if(comparable(before)===comparable(after))continue;
        operations.push({kind:'point',table,track,line,side,before:clone(before),after:clone(after)});
      }
    for(const [table,tracks] of Object.entries(state.strokeLengthsCm||{})) for(const [track,after] of Object.entries(tracks)) {
      const before=source.strokeLengthsCm?.[table]?.[track]??null;
      if(before!==after&&!(before===null&&capture.strokeDefaults?.[table]?.[track]===after))operations.push({kind:'stroke',table,track,before,after});
    }
    for(const [table,changes] of Object.entries(state.noseCorrectionConfig||{})) {
      const before=source.noseLengthCorrection?.[table],after={...before,...changes};
      if(JSON.stringify(before)!==JSON.stringify(after))operations.push({kind:'nose-settings',table,before:clone(before),after});
    }
    for(const [table,tracks] of Object.entries(state.noseLengthAnchors||{})) for(const [track,after] of Object.entries(tracks)) {
      const prior=(source.savedSpoorValues||[]).find(s=>s.table===table&&s.pattern===track);
      const before=prior?.noseLengthCorrection?.anchor??null;
      if(JSON.stringify(before)!==JSON.stringify(after))operations.push({kind:'nose-anchor',table,track,before:clone(before),after:clone(after)});
    }
    return {format:'3b-testoverdracht',schema:1,release:'v208-r15',createdAt:new Date().toISOString(),
      sourceRevision:source.beheerRevision,basis:source.beheerBasis,
      sourceSite:location.href,operations,backup:clone(capture)};
  }
  window.ThreeBTransfer=Object.freeze({packet});
  document.addEventListener('DOMContentLoaded',()=>{
    if(new URLSearchParams(location.hash.slice(1)).get('owner')!=='kruin')return;
    const box=document.createElement('section');box.id='testTransfer';box.style.cssText='position:fixed;top:8px;right:8px;z-index:2147483000;max-width:calc(100vw - 16px);width:360px;padding:10px;box-sizing:border-box;border:1px solid #a88630;border-radius:8px;box-shadow:0 2px 8px #0004;background:#fff3c4;color:#302500;font:14px system-ui';
    const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Back-up en overzetten naar GitHub';details.append(summary);
    const button=document.createElement('button');button.id='downloadTestTransfer';button.textContent='Wijzigingen downloaden en overzetten';
    const status=document.createElement('p');status.id='testTransferStatus';status.setAttribute('role','status');
    status.textContent='Deze knop maakt een JSON-overdracht, geen SQLite-back-up. Upload die privé op GitHub. Na een groene controle download je bij Actions → Artifacts → SQLite-backups de echte database vóór en ná import. Productie volgt pas na jouw bevestiging.';
    const upload=document.createElement('a');upload.href='https://github.com/kruin/3b-kruin-beheer/upload/main/overdrachten/inbox';upload.target='_blank';upload.rel='noopener noreferrer';upload.textContent='Open private GitHub-upload';upload.hidden=true;
    button.addEventListener('click',()=>{
      try {
        const capture=window.captureThreeBTransfer();const data=packet(capture);
        const name='3b-testoverdracht-'+data.createdAt.replace(/[:.]/g,'-')+'.json';
        const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));
        const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
        upload.hidden=false;
        status.textContent=`JSON-overdracht aangeboden als ${name}. Controleer je download. ${data.operations.length} wijziging(en) voor SQLite. Upload het bestand op GitHub en kies Commit changes. Open daarna Actions → Controleer testoverdracht. Download na een groene run bij Artifacts → SQLite-backups de echte .sqlite3-bestanden. Productie wordt niet automatisch gewijzigd.`;
        window.open(upload.href,'_blank','noopener,noreferrer');
      } catch(error){status.textContent='Overdracht niet gemaakt: '+error.message;}
    });
    details.append(button,status,upload);box.append(details);(document.querySelector('#testEnvironmentBanner')||document.body).after(box);
  });
})();
