// Isolated M3 physical root/trunk candidates; not registered, placed or persisted in live worlds.
// All geometry is cell-local. Separate boxes are occupancy/selection geometry, not render-only scenery.
const raw=[
 {ordinal:34,name:'Luminous root segments',pattern:'veined-root',seed:34091,opacity:'opaque',solid:true,attachment:'ground',
  palette:['#2c253b','#49324e','#725077','#b07bb6','#d3e6b0'],
  boxes:[[.06,.22,.36,.94,.52,.64],[.12,.13,.39,.31,.34,.61],[.7,.1,.4,.89,.35,.6],[.43,.48,.42,.6,.72,.58]],
  veins:[[.1,.45,.49,.89,.48,.53],[.48,.5,.45,.54,.7,.55]]},
 {ordinal:35,name:'Twisted ancient root joints',pattern:'interlocking-heartwood',seed:35113,opacity:'opaque',solid:true,attachment:'ground',
  palette:['#241e30','#423044','#655061','#8d7069','#b9a48a'],
  boxes:[[.3,.04,.29,.7,.94,.71],[.04,.24,.37,.96,.55,.63],[.16,.08,.16,.42,.38,.42],[.59,.1,.58,.86,.4,.85],[.36,.61,.18,.64,.85,.82]],
  veins:[[.12,.4,.46,.9,.45,.52],[.48,.2,.19,.53,.78,.8]]},
 {ordinal:36,name:'Hollow mystic trunk segments',pattern:'hollow-rune-bark',seed:36127,opacity:'cutout',solid:true,attachment:'ground',
  palette:['#1e2935','#354552','#526776','#76948a','#b1cdb3'],
  // Four side-wall segments preserve an actual vertical hollow channel (not a painted dark circle).
  boxes:[[.1,0,.1,.34,1,.9],[.66,0,.1,.9,1,.9],[.34,0,.1,.66,1,.34],[.34,0,.66,.66,1,.9]],
  veins:[[.11,.14,.12,.19,.84,.15],[.81,.18,.81,.87,.88,.84]]}
];
export const ENCHANTED_ROOT_CANDIDATES=Object.freeze(raw.map(d=>Object.freeze({
 ...d,id:'biome130:'+String(d.ordinal).padStart(3,'0'),prospectiveId:255+d.ordinal,
 selectable:true,replaceable:true,rotationCount:4,collision:'occupied',
 boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),veins:Object.freeze(d.veins.map(b=>Object.freeze(b))),
 palette:Object.freeze(d.palette)
})));
export function orientedBoxes(candidate,turns=0){
 if(!Number.isInteger(turns)||turns<0||turns>3)throw new RangeError('orientation 0..3 required');
 return candidate.boxes.map(b=>{
  let [x0,y0,z0,x1,y1,z1]=b;
  for(let i=0;i<turns;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
  return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));
 });
}
export function rootMaterial(candidate,x,y,z,face=0){
 const h=(Math.imul((x|0)^candidate.seed,73856093)^Math.imul(y|0,19349663)^Math.imul(z|0,83492791)^Math.imul(face|0,2654435761))>>>0;
 return candidate.palette[h%candidate.palette.length];
}
export function rootMesh(candidate,turns=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of orientedBoxes(candidate,turns))for(const face of faces){
  const offset=vertices.length/3;
  for(const p of face)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));
  indices.push(offset,offset+1,offset+2,offset,offset+2,offset+3);
 }
 return {vertices,indices}; // Unculled opt-in fixture; production renderer compatibility unverified.
}
export function rootEditFixture(candidate,turns=0){
 orientedBoxes(candidate,turns);
 const serialized=JSON.stringify({symbolicId:candidate.id,orientation:turns});
 const restored=JSON.parse(serialized);
 if(restored.symbolicId!==candidate.id)throw Error('symbolic ID mismatch');
 return {restored,removed:null}; // Never touches live schema-1 saves.
}
