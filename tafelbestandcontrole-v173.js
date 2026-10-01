'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context={window:{XLSX:require('./vendor/xlsx.full.min.js'),initSqlJs:require('./vendor/sql-asm.js')},TextDecoder};
context.globalThis=context.window;
vm.createContext(context);
for(const file of ['basis-catalogus-v173.js','tafelbestanden-v173.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),context);
const api=context.window.ThreeBFiles,copy=x=>JSON.parse(JSON.stringify(x)),basis=copy(context.window.THREEB_BASES.find(b=>b.id===context.window.THREEB_DEFAULT_BASIS));
const line={from:{band:'oost',value:20,status:'approved'},to:{band:'zuid',value:38,status:'approved'}};
const state={data:{klein:{VIJF:{romp:copy(line)}},groot:{VIJF:{romp:copy(line)}}},variantData:{},departurePositions:{},strokeLengthsCm:{},bandOverrides:{},ui:{language:'nl'}};
basis.baseline=api.tracked(state);
state.data.klein.VIJF.romp.to={band:'zuid',value:36.123456789,status:'edited',source:'user',userAdjusted:true};
state.departurePositions['klein:VIJF']=0;
state.strokeLengthsCm.klein={VIJF:83.987654321};
state.variantData.klein={'VIJF+1':{romp:copy(line)}};
state.variantData.klein['VIJF+1'].romp.to.value=-1.123456789;
const payload={format:'3B-tafel',version:1,tableName:'Café Kruin – tafel 2',basis,state};
(async()=>{
 for(const format of ['xlsx','ods','sqlite3','csv']){
  const bytes=await api.encode(payload,format),buffer=typeof bytes==='string'?new TextEncoder().encode(bytes):new Uint8Array(bytes);
  if(format==='sqlite3')assert.equal(Buffer.from(buffer).subarray(0,15).toString(),'SQLite format 3');
  if(format==='xlsx'||format==='ods')assert.equal(Buffer.from(buffer).subarray(0,2).toString(),'PK');
  const restored=await api.decode(buffer,api.filename(payload,format));
  assert.deepStrictEqual(copy(restored),copy(payload),format+' verandert de tafel');
  assert(api.filename(payload,format).includes(basis.id));
  const rows=api.rows(payload),change=rows.find(r=>r[0]==='Aanpassing'&&r[1]==='["data","klein","VIJF","romp","to","value"]');
  change[3]=35.987654321;
  assert.equal(api.fromRows(rows).state.data.klein.VIJF.romp.to.value,35.987654321);
 }
 const rows=api.rows(payload);rows.push(['Aanpassing','["data","__proto__","polluted"]','json','true','']);
 assert.throws(()=>api.fromRows(rows),/Ongeldig pad/);
 console.log('TAFELBESTANDCONTROLE OK: XLSX, ODS, SQLite en CSV; decimalen, nul, tafelnaam, varianten, afstootlengte, bewerkbare afwijkingen en basisidentiteit.');
})().catch(error=>{console.error(error);process.exitCode=1;});
