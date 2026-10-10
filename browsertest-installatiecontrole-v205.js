"use strict";
const assert=require("assert"),fs=require("fs"),{ensure,status}=require("./browsertest-installatie");
for(const initial of ["playwright","versie","chromium","gereed"]) {
 let state=initial,calls=[];
 ensure({check:()=>state,cli:()=>"playwright-cli.js",run:(file,args)=>{calls.push([file,args]);if(args.includes("chromium"))state="gereed";return 0;},platform:"win32",log:()=>{}});
 assert.equal(calls.length, initial==="gereed"?0:initial==="chromium"?1:2);
 if(initial==="playwright" || initial==="versie") assert(calls[0][1].join(" ").includes("npm ci"));
}
for(const failure of [0,1]) {
 let calls=0;
 assert.throws(()=>ensure({check:()=>"playwright",cli:()=>"cli",run:()=>calls++===failure?1:0,platform:"win32",log:()=>{}}),/mislukt/);
 assert.equal(calls,failure+1,"Installatiefout moet alle vervolgstappen blokkeren");
}
assert.equal(status(()=>{throw Error("missing")}),"playwright");
for (const name of ["Publiceer_3B.bat","Regressiecontrole_3B.bat"]) {
 const s=fs.readFileSync(name,"utf8"),install=s.indexOf("call Installeer_Browsertests_3B.bat --install-only"),tests=s.indexOf("node controleer-alles");
 assert(install>=0&&install<tests);assert(/if errorlevel 1/.test(s.slice(install,tests)));
 if(name.startsWith("Publiceer"))assert(tests<s.indexOf("git clone"));
}
const ps=fs.readFileSync("Voorbereid_Node_3B.ps1","utf8");
assert(ps.includes("Get-FileHash")&&ps.includes("https://nodejs.org/")&&ps.includes("-ge 20"));
ensure();
console.log("Browserinstallatie: ontbrekende/onjuiste Playwright, ontbrekend Chromium, beide foutstops, batchvolgorde en werkelijke runtime akkoord.");
