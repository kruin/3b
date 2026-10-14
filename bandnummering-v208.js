/* 3B v208-r14: bandcontacten en contra, onafhankelijk van geometrie. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.THREEB_BANDNUMMERING=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 const opposite={west:'oost',oost:'west',noord:'zuid',zuid:'noord'};
 function classify(parts,expected,actual,initial='+'){
  let loop=initial,number=0;const result=[];
  for(const part of parts){const key=typeof part==='string'?part:part.key;const a=actual?.[key],e=expected?.[key];const from=a?.from?.band??null,to=a?.to?.band??null;
   const plannedFrom=e?.from??null,plannedTo=e?.to??null;
   const skipped=!!(from&&to&&opposite[from]===to);
   // Een sprong tussen tegenoverliggende banden is een expliciete bandoverslag.
   // Een afwijkend bandnummer of andere route alleen is geen bewijs van contra.
   if(skipped)loop=loop==='+'?'-':'+';
   if(to)number++;
   result.push({key,nummer:to?number:null,band:to,verwacht:plannedTo,van:from,verwachtVan:plannedFrom,afwijkend:!!(plannedTo&&to&&plannedTo!==to),overslag:skipped,contra:loop==='-',loop});
  }
  return result;
 }
 return {classify};
});
