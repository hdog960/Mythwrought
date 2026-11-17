// M6 #077–080. Physical, independent cavern components; candidate-only, never world-placed.
const raw=[
 {ordinal:77,name:'Underground wall niches',kind:'recessed-cavern-alcove',attachment:'wall',hardness:6,palette:['#26313b','#495864','#82919a','#c0bba8'],boxes:[[.04,.04,.08,.22,.96,.92],[.78,.04,.08,.96,.96,.92],[.22,.04,.08,.78,.22,.92],[.22,.78,.08,.78,.96,.92],[.22,.22,.75,.78,.78,.92],[.29,.22,.22,.71,.29,.75]]},
 {ordinal:78,name:'Mineral conduit channels',kind:'open-stone-mineral-trough',attachment:'ground',hardness:5,palette:['#263b43','#4d666b','#79939b','#bad6cb','#d2b77f'],boxes:[[.02,0,.02,.98,.18,.98],[.02,.18,.02,.21,.63,.98],[.79,.18,.02,.98,.63,.98],[.21,.18,.02,.79,.26,.19],[.21,.18,.81,.79,.26,.98],[.21,.18,.19,.79,.21,.81]]},
 {ordinal:79,name:'Broad cavern landing modules',kind:'asymmetric-landing-stone',attachment:'ground',hardness:7,palette:['#2d3944','#52636b','#819196','#b0aba0'],boxes:[[.02,0,.02,.98,.19,.98],[.06,.19,.08,.94,.38,.86],[.12,.38,.14,.88,.53,.76],[.06,.19,.86,.94,.31,.98],[.08,.19,.02,.27,.39,.14],[.73,.19,.02,.92,.39,.14]]},
 {ordinal:80,name:'Ancient acoustic resonator stones',kind:'inert-hollow-resonator',attachment:'ground',hardness:6,palette:['#303b48','#596d78','#94a6a5','#b8a58e','#c6d4c8'],boxes:[[.08,0,.08,.92,.17,.92],[.17,.17,.17,.35,.79,.83],[.65,.17,.17,.83,.79,.83],[.35,.17,.17,.65,.32,.83],[.35,.68,.17,.65,.79,.83],[.25,.79,.24,.75,.96,.76],[.39,.32,.72,.61,.68,.83]]}
];
export const UNDERGROUND_CIVILIZATION_COMPLETION=Object.freeze(raw.map(a=>Object.freeze({...a,id:'biome130:'+String(a.ordinal).padStart(3,'0'),prospectiveId:255+a.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied-boxes',opacity:'opaque',rotationCount:4,dynamic:false,emissive:false,active:false,boxes:Object.freeze(a.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(a.palette)})));
export function completionBoxes(asset,rotation=0){
 if(!UNDERGROUND_CIVILIZATION_COMPLETION.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate or rotation');
 return asset.boxes.map(box=>{let [x0,y0,z0,x1,y1,z1]=box;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function completionMaterial(asset,x,y,z,face=0){
 if(!UNDERGROUND_CIVILIZATION_COMPLETION.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid material sample');
 const h=(Math.imul(x+asset.ordinal,73856093)^Math.imul(y+17,19349663)^Math.imul(z+31,83492791)^Math.imul(face+5,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function completionMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]];
 for(const [x0,y0,z0,x1,y1,z1] of completionBoxes(asset,rotation)){
  const corners=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  for(const face of faces){const s=vertices.length/3;for(const c of face)vertices.push(...corners[c]);indices.push(s,s+1,s+2,s,s+2,s+3);}
 }
 return {vertices,indices}; // Isolated mesh fixture, not production renderer.
}
export function completionEditFixture(asset,rotation=0){
 completionBoxes(asset,rotation);
 const cell={symbolicId:asset.id,rotation};
 const encoded=JSON.stringify({schema:'biome130-candidate-v1',cell:[0,0,0],placed:cell});
 const restored=JSON.parse(encoded),selected=restored.placed;restored.placed=null;
 return {encoded,selected,removed:restored.placed===null};
}
