'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=__dirname,ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root+'/config-v205.js','utf8'),ctx);
const C=ctx.window.THREEB_START_CONFIG,half=C.lineOneVariants.fan.entries.find(x=>x.key==='HALFNEGEN');
assert.equal(C.release,'205');
assert.deepStrictEqual(Array.from(C.lklTrackRules.panelTracks).slice(-2),['ACHT','NEGEN']);
assert.equal(C.lklTrackRules.noseArrivalByTrack.NEGEN,90);
assert(half&&half.noseArrival===85);
assert.deepStrictEqual(Array.from(half.between),['ACHT','NEGEN']);
for(const table of ['klein','groot']){
  const route=C.defaults[table].NEGEN;
  assert.equal(route.neus.to.band,'west');assert.equal(route.neus.to.value,90);
  assert.equal(route.neus.to.status,'calculated');assert.equal(route.neus.to.source,'automatic');
  assert.equal(route.neus.to.calculationBasis,'virtual_nose');
}
assert(C.lklTrackRules.appliesTo.includes('NEGEN'),'NEGEN moet dezelfde LKL-keten gebruiken');
assert.equal(C.patternByLine.NEGEN,'LKL');
assert.equal(C.speedProfiles.lkl.cushions,5);assert.equal(C.speedProfiles.lkl.runOut.line,'been');assert.equal(C.speedProfiles.lkl.runOut.fraction,.5);
assert.deepStrictEqual(Array.from(C.speedProfiles.sixSeven.framework),['neus','been']);assert.equal(C.speedProfiles.sixSeven.bodyIsFramework,false);
assert.deepStrictEqual(Object.keys(C.lklTrackRules.virtualNoseTracks).sort(),['HALFNEGEN','NEGEN','NEGEN-1','NEGEN-2'].sort());
console.log('VIRTUELE-NEUSCONTROLE OK: HALF NEGEN A85 en NEGEN−2/−1/P0 A70/80/90 hebben de gewone LKL-keten; snelheid telt 5 banden plus uitloop.');
