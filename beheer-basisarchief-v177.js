/* Na herstel van Git worden ook alle vroeger gepubliceerde bases meegenomen. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=__dirname,file=path.join(root,'basis-catalogus-v177.js');
const context={};context.window=context;context.globalThis=context;
vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
const defaultId=context.THREEB_DEFAULT_BASIS;
const folder=path.join(root,'kruin-bases');
const files=fs.readdirSync(folder).filter(name=>name.endsWith('.js')).sort();
const content='window.THREEB_BASES=[];\n'+files.map(name=>fs.readFileSync(path.join(folder,name),'utf8')).join('')+'window.THREEB_DEFAULT_BASIS='+JSON.stringify(defaultId)+';\n';
const check={};check.window=check;check.globalThis=check;
vm.runInNewContext(content,check);
if(!check.THREEB_BASES.some(b=>b.id===defaultId))throw Error('De standaardbasis ontbreekt.');
for(const basis of check.THREEB_BASES)if(!fs.existsSync(path.join(folder,basis.id+'.sqlite3')))throw Error('Database ontbreekt: '+basis.id);
fs.writeFileSync(file,content);
console.log(`BASISARCHIEF OK: ${check.THREEB_BASES.length} bases blijven beschikbaar.`);
