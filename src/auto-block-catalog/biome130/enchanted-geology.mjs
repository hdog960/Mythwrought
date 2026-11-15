// M3 enchanted geology: isolated physical candidate descriptors. No production registry writes.
const definitions=[
 {ordinal:37,name:'Bioluminescent sap veins',kind:'sap',seed:37017,attachment:'wall',solid:false,opacity:'cutout',palette:['#243b49','#317c79','#5bd3b5','#d3f7b2'],boxes:[[.06,.14,.44,.25,.9,.58],[.23,.55,.46,.64,.69,.56],[.61,.28,.46,.91,.42,.56],[.49,.36,.46,.65,.66,.56]],emissive:.68},
 {ordinal:38,name:'Enchanted glade stone',kind:'glade',seed:38029,attachment:'ground',solid:true,opacity:'opaque',palette:['#292f46','#46546b','#6d8191','#a2a5b4','#c4e8cf'],boxes:[[.03,0,.03,.97,.72,.97],[.16,.72,.15,.83,.85,.82],[.28,.85,.29,.7,.94,.69]],emissive:.08},
 {ordinal:39,name:'Whisperstone outcrops',kind:'whisper',seed:39041,attachment:'ground',solid:true,opacity:'opaque',palette:['#292638','#4a425c','#736b86','#b0a6b6','#bde4d9'],boxes:[[.12,0,.17,.4,.78,.43],[.44,0,.38,.77,.98,.72],[.68,0,.13,.9,.58,.38],[.28,0,.7,.53,.48,.9]],emissive:.14}
];
export const ENCHANTED_GEOLOGY=Object.freeze(definitions.map(d=>Object.freeze({...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,selectable:true,replaceable:true,collision:d.solid?'occupied':'none',rotationCount:4,boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)})));
export function geologyBoxes(asset,rotation=0){
 if(!ENCHANTED_GEOLOGY.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate or orientation');
 return asset.boxes.map(box=>{let [x0,y0,z0,x1,y1,z1]=box;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function geologySurface(asset,x,y,z,face=0){
 if(!ENCHANTED_GEOLOGY.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid material sample');
 let h=(Math.imul(x^asset.seed,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function geologyMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of geologyBoxes(asset,rotation))for(const f of faces){const start=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Isolated unculled prototype; not production renderer evidence.
}
export function geologyEditFixture(asset,rotation=0){
 geologyBoxes(asset,rotation);
 const cell=new Map();cell.set('0,0,0',{symbolicId:asset.id,rotation});
 const snapshot=JSON.stringify([...cell]);const restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');cell.delete('0,0,0');
 return {selected,removed:!cell.has('0,0,0'),snapshot}; // No live schema-1 mutation.
}
