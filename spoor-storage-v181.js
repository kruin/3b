/* De private Kruinconfig-starter verzorgt de lokale databaseverbinding. */
let revision=window.THREEB_KRUIN_VALUES?.beheerRevision;
window.SpoorStorage={async save(snapshot,basis){
  const payload=JSON.parse(JSON.stringify(snapshot));
  if(new URLSearchParams(location.hash.slice(1)).get("owner")!=="kruin")return payload;
  if(location.protocol!=="http:"||!["127.0.0.1","localhost"].includes(location.hostname))throw Error("Open de editor via Bekijk_Kruinconfig om naar de Kruinconfig-database te bewaren.");
  const response=await fetch("/api/kruin/spoor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({snapshot:payload,basis,revision})});
  const result=await response.json().catch(()=>({error:"De Kruinconfig-starter is niet actief."}));
  if(!response.ok)throw Error(result.error||"Opslaan mislukt.");
  if(JSON.stringify(result.snapshot)!==JSON.stringify(payload))throw Error("Opslagcontrole mislukt: de databasewaarden verschillen van het overzicht.");
  revision=result.revision;return result.snapshot;
}};
