// M6 #074–076. Isolated physical candidates; no live registry or world placement.
const definitions=[
 {ordinal:74,name:'Subterranean ceiling anchors',kind:'inverted-cavern-anchor',attachment:'ceiling',hardness:7,palette:['#28343c','#50606b','#83919a','#b0a596'],boxes:[[.18,.79,.18,.82,1,.82],[.27,.42,.27,.73,.79,.73],[.37,.12,.37,.63,.42,.63],[.08,.81,.39,.27,.96,.61],[.73,.81,.39,.92,.96,.61],[.39,.81,.08,.61,.96,.27],[.39,.81,.73,.61,.96,.92]]},
 {ordinal:75,name:'Carved ventilation grilles',kind:'perforated-stone-vent',attachment:'wall',hardness:5,palette:['#293b44','#576973','#a2a7a0','#c2bca9'],boxes:[[.06,.05,.12,.2,.95,.88],[.8,.05,.12,.94,.95,.88],[.2,.05,.12,.8,.18,.88],[.2,.82,.12,.8,.95,.88],[.35,.18,.43,.44,.82,.57],[.56,.18,.43,.65,.82,.57]]},
 {ordinal:76,name:'Recessed glowstone sockets',kind:'inert-recessed-mineral-seat',attachment:'wall',hardness:6,palette:['#27363e','#50636b','#7f9295','#b9c6ad','#e4d5a0'],boxes:[[.04,.04,.1,.25,.96,.9],[.75,.04,.1,.96,.96,.9],[.25,.04,.1,.75,.23,.9],[.25,.77,.1,.75,.96,.9],[.25,.23,.65,.75,.77,.9],[.31,.29,.51,.69,.71,.65]]}
];
export const UNDERGROUND_CIVILIZATION_DETAILS=Object.freeze(definitions.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied-boxes',opacity:'opaque',rotationCount:4,dynamic:false,emissive:false,boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)})));
export function detailBoxes(asset,rotation=0){
 if(!UNDERGROUND_CIVILIZATION_DETAILS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('asset or rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let n=0;n<rotation;n++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(v=>+v.toFixed(6));});
}
export function detailMaterial(asset,x,y,z,face=0){
 if(!UNDERGROUND_CIVILIZATION_DETAILS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('material input');
 const hash=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+17,19349663)^Math.imul(z+29,83492791)^Math.imul(face+3,2654435761))>>>0;
 return asset.palette[hash%asset.palette.length];
}
export function detailMesh(asset,rotation=0){
 const vertices=[],indices=[];
 for(const b of detailBoxes(asset,rotation)){
  const [x0,y0,z0,x1,y1,z1]=b, corners=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  for(const f of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]]){
   const start=vertices.length/3;for(const i of f)vertices.push(...corners[i]);indices.push(start,start+1,start+2,start,start+2,start+3);
  }
 }
 return {vertices,indices}; // isolated source-authentic fixture, not live renderer
}
export function detailEditFixture(asset,rotation=0){
 detailBoxes(asset,rotation);
 const placed={symbolicId:asset.id,rotation};
 const encoded=JSON.stringify({schema:'biome130-candidate-v1',cell:[0,0,0],placed});
 const restored=JSON.parse(encoded);
 if(restored.placed.symbolicId!==asset.id)throw new Error('symbolic roundtrip failed');
 const selected=restored.placed;restored.placed=null;
 return {encoded,selected,removed:restored.placed===null};
}
