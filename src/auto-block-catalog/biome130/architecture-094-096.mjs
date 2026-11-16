// :12 M8 isolated physical candidate families 094–096. No world placement or runtime IDs.
const raw=[{"ordinal":94,"name":"Insulated snow-region wall cores","kind":"layered-frostproof-turf-fiber-core","palette":["#c7d6d6","#8399a4","#e6e4d2","#8d7965","#d6e7e9"],"attachment":"wall","hardness":3,"boxes":[[0.02,0.02,0.02,0.98,0.98,0.98],[0.1,0.1,0,0.9,0.9,0.06],[0.12,0.12,0.94,0.88,0.88,1],[0.06,0.36,0.06,0.94,0.42,0.94],[0.06,0.66,0.06,0.94,0.72,0.94]]},{"ordinal":95,"name":"Ice-carved structural struts","kind":"translucent-faceted-glacial-cross-brace","palette":["#8ac5dc","#c5e9f0","#75a9c6","#e2f5f6","#5f93b3"],"attachment":"wall","hardness":4,"opacity":0.72,"boxes":[[0.04,0.04,0.04,0.23,0.96,0.24],[0.77,0.04,0.76,0.96,0.96,0.96],[0.2,0.18,0.2,0.8,0.33,0.8],[0.2,0.67,0.2,0.8,0.82,0.8],[0.39,0.32,0.38,0.61,0.68,0.62],[0.03,0.02,0.02,0.97,0.1,0.98],[0.03,0.9,0.02,0.97,0.98,0.98]]},{"ordinal":96,"name":"Enchanted livingwood wall ribs","kind":"naturally-twisted-livingwood-buttress","palette":["#3f5644","#658363","#9cb47b","#6c4c3b","#b6cb9b"],"attachment":"wall","hardness":3,"boxes":[[0.04,0.03,0.12,0.26,0.97,0.35],[0.74,0.03,0.65,0.96,0.97,0.88],[0.2,0.75,0.22,0.8,0.91,0.78],[0.2,0.45,0.25,0.8,0.57,0.75],[0.26,0.2,0.3,0.74,0.3,0.7],[0.4,0.04,0.35,0.6,0.46,0.65],[0.36,0.91,0.32,0.64,0.99,0.68]]}];
export const BIOME_ARCHITECTURE_094_096=Object.freeze(raw.map(d=>Object.freeze({...d,
 symbolicId:'biome130:'+String(d.ordinal).padStart(3,'0'),futureOnlyId:255+d.ordinal,
 selectable:true,replaceable:true,solid:true,collision:'occupied',rotationCount:4,
 opacity:d.opacity??1,boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)
})));
export function physicalBoxes(asset,rotation=0){
 if(!BIOME_ARCHITECTURE_094_096.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid asset or rotation');
 return asset.boxes.map(box=>{
  let [x0,y0,z0,x1,y1,z1]=box;
  for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
  return [x0,y0,z0,x1,y1,z1].map(v=>Number(v.toFixed(6)));
 });
}
export function materialSample(asset,x,y,z,face=0){
 if(!BIOME_ARCHITECTURE_094_096.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const hash=(Math.imul(x^asset.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face+asset.ordinal,2654435761))>>>0;
 return asset.palette[hash%asset.palette.length];
}
export function physicalMesh(asset,rotation=0){
 const vertices=[],indices=[];
 for(const b of physicalBoxes(asset,rotation)){
  const c=[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[0],b[4],b[2]],[b[0],b[1],b[5]],[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]]];
  for(const f of [[0,3,2,1],[5,6,7,4],[4,7,3,0],[1,2,6,5],[3,7,6,2],[4,0,1,5]]){
   const start=vertices.length/3;
   for(const i of f)vertices.push(...c[i]);
   indices.push(start,start+1,start+2,start,start+2,start+3);
  }
 }
 return {vertices,indices,opacity:asset.opacity};
}
// Opt-in symbolic fixture only. Production schema-1 saves never receive future numeric IDs.
export function editFixture(asset,rotation=0){
 physicalBoxes(asset,rotation);
 const placed=new Map([['2,3,4',{symbolicId:asset.symbolicId,rotation}]]);
 const serialized=JSON.stringify([...placed]);
 const loaded=new Map(JSON.parse(serialized));
 const selected=loaded.get('2,3,4');
 loaded.delete('2,3,4');
 return {serialized,selected,removed:!loaded.has('2,3,4')};
}
