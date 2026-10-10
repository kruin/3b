'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');
const source=fs.readFileSync(path.join(__dirname,'spoor-opslagcontrole-v206.js'),'utf8');
const commands=[...source.matchAll(/\['-c','(import sqlite3,sys; [^']+)'/g)].map(x=>x[1]);
assert.strictEqual(commands.length,2,'Controleer beide SQLite-leesacties');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'3b-utf8-'));
try{
 const db=path.join(temp,'test.sqlite3'),snapshot={table:'groot',pattern:'VIJF',label:'VIJF−2 · Neus → Hiel',value:17.123456789};
 const env={...process.env,PYTHONUTF8:'0',PYTHONIOENCODING:'cp1252'};
 cp.execFileSync('python',['-c','import sqlite3,sys; c=sqlite3.connect(sys.argv[1]); c.execute("CREATE TABLE spoor_values (table_name TEXT, pattern TEXT, snapshot TEXT)"); c.execute("INSERT INTO spoor_values VALUES (?,?,?)",("groot","VIJF",sys.argv[2])); c.commit()',db,JSON.stringify(snapshot)],{env});
 const old=cp.spawnSync('python',['-c','print(chr(0x2212))'],{env,encoding:'utf8'});
 assert.notStrictEqual(old.status,0,'cp1252 moet de oorspronkelijke fout reproduceren');assert(old.stderr.includes('UnicodeEncodeError'));
 for(const code of commands)assert.deepStrictEqual(JSON.parse(cp.execFileSync('python',['-c',code,db,'groot','VIJF'],{env,encoding:'utf8'})),snapshot);
 console.log('PYTHON UTF-8 OK: oorspronkelijke cp1252-fout gereproduceerd; beide SQLite-leesacties behouden Unicode en decimalen exact.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
