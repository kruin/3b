'use strict';
(()=>{
 const ns='http://www.w3.org/2000/svg',number=(value,digits=1)=>new Intl.NumberFormat('nl-NL',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);
 let examples=null,table='klein',focus='both';
 const node=(tag,attrs={},text)=>{const element=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attrs))element.setAttribute(key,String(value));if(text!==undefined)element.textContent=text;return element;};
 const stip=(point,g)=>point.band==='west'?{x:-g.dotOffsetCm,y:(1-point.value/80)*g.heightCm}:{x:point.value/40*g.widthCm,y:-g.dotOffsetCm};
 const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
 function draw(){
  const d=examples[table],g=d.geometry,center=d.incoming.to,A=stip(d.incoming.arrival,g),V=stip(d.outgoing.departure,g),scale=8,left=-23,top=center.y-37.5,width=440,height=640;
  const map=p=>({x:(p.x-left)*scale,y:(p.y-top)*scale});
  const svg=node('svg',{xmlns:ns,viewBox:`0 0 ${width} ${height}`,width,height,role:'img','aria-labelledby':'line-values-title line-values-desc','data-table':table});
  svg.append(node('title',{id:'line-values-title'},`VIJF op ${d.label}: aankomst Neus ${number(d.incoming.arrival.value,0)} en vertrek Kop ${number(d.outgoing.departure.value)}`),node('desc',{id:'line-values-desc'},'Twee lijnen delen één bandbal. De blauwe Neus eindigt bij A op de stiplijn. De gele Kop begint bij V op diezelfde stiplijn. Het contact R ligt op de bandrand. De echte geometrie van de applicatie is op beide assen met dezelfde factor vergroot.'));
  const defs=node('defs');const clip=node('clipPath',{id:'detail-clip'});clip.append(node('rect',{width,height}));defs.append(clip);svg.append(defs);
  const scene=node('g',{'clip-path':'url(#detail-clip)'});svg.append(scene);
  const edge=map({x:0,y:top}).x,diamond=map(A).x;
  scene.append(node('rect',{width,height,fill:'#176548'}),node('rect',{width:edge,height,fill:'#795735'}));
  scene.append(node('line',{x1:diamond,y1:38,x2:diamond,y2:height-20,stroke:'#f6e5b6','stroke-width':1.5,'stroke-dasharray':'5 5','data-stiplijn':'west'}),node('line',{x1:edge,y1:0,x2:edge,y2:height,stroke:'#ffefb8','stroke-width':3,'data-bandrand':'west'}));
  const label=(x,y,text,color='#fff6dc',size=15,attrs={})=>scene.append(node('text',{x,y,fill:color,'font-family':'system-ui,sans-serif','font-size':size,'font-weight':650,...attrs},text));
  label(diamond,24,'Stiplijn','#fff6dc',14,{'text-anchor':'middle'});label(edge+12,24,'Laken','#e1f1e3',14);label(edge+12,50,'Bandrand','#fff0c6',12);scene.append(node('line',{x1:edge,y1:46,x2:edge+8,y2:46,stroke:'#fff0c6','stroke-width':1.5}));
  for(let value=0;value<=80;value+=10){const p=map(stip({band:'west',value},g));if(p.y<50||p.y>height-55)continue;scene.append(node('circle',{cx:p.x,cy:p.y,r:3.5,fill:'#fff6dc'}));if(value!==d.incoming.arrival.value)label(p.x-12,p.y+5,String(value),'#fff6dc',14,{'text-anchor':'end'});}
  const group=(kind,color)=>{const group=node('g',{'data-line':kind,opacity:focus==='both'||focus===kind?1:.2});scene.append(group);return {group,color};};
  const segment=(group,a,b,color,dashed=false)=>{a=map(a);b=map(b);const element=node('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:color,'stroke-width':dashed?2.5:4,'stroke-linecap':'round',...(dashed?{'stroke-dasharray':'6 5'}:{})});group.append(element);return element;};
  const arrow=(group,from,to,color,fraction)=>{const a=map(from),b=map(to),p=mix(a,b,fraction),length=Math.hypot(b.x-a.x,b.y-a.y),ux=(b.x-a.x)/length,uy=(b.y-a.y)/length;group.append(node('polygon',{points:`${p.x},${p.y} ${p.x-14*ux+5*uy},${p.y-14*uy-5*ux} ${p.x-14*ux-5*uy},${p.y-14*uy+5*ux}`,fill:color}));};
  const incoming=group('incoming','#8ad7ff'),outgoing=group('outgoing','#ffe177');
  const incomingPath=segment(incoming.group,d.incoming.from,center,incoming.color);incomingPath.dataset.actualPath='Neus';
  const arrivalGuide=segment(incoming.group,center,A,incoming.color,true);arrivalGuide.dataset.lineEndpoint='A';
  arrow(incoming.group,d.incoming.from,center,incoming.color,.77);
  const outgoingPath=segment(outgoing.group,center,d.outgoing.to,outgoing.color);outgoingPath.dataset.actualPath='Kop';
  const departureGuide=segment(outgoing.group,V,center,outgoing.color,true);departureGuide.dataset.lineEndpoint='V';
  arrow(outgoing.group,center,d.outgoing.to,outgoing.color,.19);
  for(const [point,kind,value,name,color,owner]of [[A,'A',d.incoming.arrival.value,'Neus',incoming.color,incoming.group],[V,'V',d.outgoing.departure.value,'Kop',outgoing.color,outgoing.group]]){
   const p=map(point);owner.append(node('circle',{cx:p.x,cy:p.y,r:6,fill:color,stroke:'#263c32','stroke-width':1.5,'data-stip-value':kind,'data-value':value}));
   const badge=node('g',{'data-value-badge':kind});badge.append(node('rect',{x:12,y:p.y-33,width:82,height:58,rx:8,fill:'#253b2f'}),node('text',{x:22,y:p.y-11,fill:color,'font-family':'system-ui,sans-serif','font-size':14},`${name} · ${kind}`),node('text',{x:22,y:p.y+13,fill:color,'font-family':'system-ui,sans-serif','font-size':20,'font-weight':750},number(value,kind==='A'?0:1)));owner.append(badge);
  }
  const C=map(center),R={x:edge,y:C.y};
  scene.append(node('circle',{cx:C.x,cy:C.y,r:d.radiusCm*scale,fill:'#fffdf4',stroke:'#243d30','stroke-width':2,'data-bandbal':'true'}),node('line',{x1:R.x,y1:R.y,x2:C.x,y2:C.y,stroke:'#a63037','stroke-width':1.5}),node('circle',{cx:R.x,cy:R.y,r:4,fill:'#ff9696','data-bandcontact':'R'}),node('circle',{cx:C.x,cy:C.y,r:2.5,fill:'#203d30'}));
  label(C.x+d.radiusCm*scale+12,C.y+5,'Bal 1','#ffffff',15);
  scene.append(node('line',{x1:R.x-3,y1:R.y,x2:edge-38,y2:R.y-24,stroke:'#ffd4d4','stroke-width':1.5}));label(edge-10,C.y-34,'R','#ffd4d4',16,{'text-anchor':'end'});label(edge-10,C.y-17,'bandcontact','#ffd4d4',11,{'text-anchor':'end'});
  const pIn=map(mix(center,d.incoming.from,.27));label(pIn.x+12,pIn.y+8,'Neus',incoming.color,17);
  const pOut=map(mix(center,d.outgoing.to,.14));label(pOut.x+14,pOut.y-5,'Kop',outgoing.color,17);
  const dimensionY=height-22;scene.append(node('line',{x1:diamond,y1:dimensionY,x2:edge,y2:dimensionY,stroke:'#fff0c6','stroke-width':1.5}));for(const x of [diamond,edge])scene.append(node('line',{x1:x,y1:dimensionY-5,x2:x,y2:dimensionY+5,stroke:'#fff0c6','stroke-width':1.5}));label((diamond+edge)/2,dimensionY-10,'9,5 cm','#fff0c6',12,{'text-anchor':'middle'});
  document.getElementById('diagram').replaceChildren(svg);
  document.getElementById('arrival-value').textContent=number(d.incoming.arrival.value,0);
  for(const id of ['departure-value','departure-sentence'])document.getElementById(id).textContent=number(d.outgoing.departure.value);
  document.getElementById('full-line-example').textContent=`De volledige Kop loopt van V = ${number(d.outgoing.departure.value)} op West naar A = ${number(d.outgoing.arrival.value,0)} op Noord.`;
  document.getElementById('load-status').textContent=`VIJF · ${d.label} · bestaande appgeometrie. Kop V = ${number(d.outgoing.departure.value,2)} is berekend.`;
  for(const button of document.querySelectorAll('[data-table]'))if(button.tagName==='BUTTON')button.setAttribute('aria-pressed',String(button.dataset.table===table));
  for(const button of document.querySelectorAll('[data-focus]'))button.setAttribute('aria-pressed',String(button.dataset.focus===focus));
 }
 for(const button of document.querySelectorAll('[data-table]'))button.onclick=()=>{if(examples){table=button.dataset.table;draw();}};
 for(const button of document.querySelectorAll('[data-focus]'))button.onclick=()=>{if(examples){focus=button.dataset.focus;draw();}};
 document.getElementById('download-diagram').onclick=()=>{const svg=document.querySelector('#diagram svg');if(!svg)return;const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`stiplijnen-vijf-${table}.svg`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 fetch('stiplijnen-voorbeeld-v208.json?v=1').then(response=>{if(!response.ok)throw Error('meetgegevens');return response.json();}).then(data=>{examples=data.examples;draw();}).catch(()=>{const status=document.getElementById('load-status');status.textContent='De voorbeeldgegevens konden niet worden geladen. Vernieuw deze pagina.';status.className='error';});
})();
