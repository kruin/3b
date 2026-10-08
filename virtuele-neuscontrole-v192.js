'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=__dirname,ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root+'/config-v192.js','utf8'),ctx);
const C=ctx.window.THREEB_START_CONFIG,half=C.lineOneVariants.fan.entries.find(x=>x.key==='HALFNEGEN');
assert.equal(C.release,'192');
assert.deepStrictEqual(Array.from(C.lklTrackRules.panelTracks).slice(-2),['ACHT','NEGEN']);
assert.equal(C.lklTrackRules.noseArrivalByTrack.NEGEN,90);
assert(half&&half.virtual&&half.noseArrival===85);
assert.deepStrictEqual(Array.from(half.between),['ACHT','NEGEN']);
for(const table of ['klein','groot']){
  const route=C.defaults[table].NEGEN;
  assert.equal(route.neus.to.band,'west');assert.equal(route.neus.to.value,90);
  assert.equal(route.neus.to.status,'calculated');assert.equal(route.neus.to.source,'automatic');
  assert.equal(route.neus.to.calculationBasis,'virtual_nose');
}
assert(!C.lklTrackRules.appliesTo.includes('NEGEN'),'Virtuele Neus mag de bestaande LKL-berekenketen niet activeren');
assert.deepStrictEqual(Object.keys(C.lklTrackRules.virtualNoseTracks).sort(),['HALFNEGEN','NEGEN','NEGEN-1','NEGEN-2'].sort());
console.log('VIRTUELE-NEUSCONTROLE OK: HALF NEGEN A85 en NEGEN−2/−1/P0 A70/80/90 zijn Neus-only; bestaande LKL-berekenketen blijft begrensd tot ACHT.');
