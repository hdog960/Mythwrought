// Enchanted forest M3: independent symbolic voxel candidates, never registered in live world.
// Geometry is unit-cell local; boxes define physical occupancy, not decorative render-only props.
const definitions=[
 {ordinal:31,name:'Aether-saturated forest soil',attachment:'ground',solid:true,opacity:'opaque',pattern:'aether-strata',seed:31073,
  palette:['#342d45','#50436a','#76659a','#a6d1c3','#d6b6e9'],
  boxes:[[0,0,0,1,.82,1],[.07,.82,.09,.94,.91,.93],[.19,.91,.17,.31,.98,.29],[.7,.91,.68,.83,.97,.8]],
  accents:[[.12,.78,.12,.88,.81,.16],[.22,.81,.75,.77,.84,.79]]},
 {ordinal:32,name:'Star-moss ground',attachment:'ground',solid:false,opacity:'cutout',pattern:'stellate-moss',seed:32089,
  palette:['#193c39','#2c766e','#64b5a2','#b7f0d4','#e9f8b8'],
  boxes:[[.06,0,.06,.94,.11,.94],[.19,.11,.2,.29,.23,.3],[.69,.11,.22,.79,.27,.32],[.45,.11,.63,.57,.26,.75],[.22,.11,.71,.34,.2,.84]],
  accents:[[.22,.2,.24,.26,.31,.28],[.72,.22,.24,.76,.33,.28]]},
 {ordinal:33,name:'Glowspore mycelium mat',attachment:'ground',solid:false,opacity:'cutout',pattern:'branching-hyphae',seed:33103,
  palette:['#263544','#375b67','#568e93','#a5d5c7','#e1f7e5'],
  boxes:[[.03,0,.04,.97,.075,.96],[.12,.075,.45,.87,.14,.55],[.45,.075,.13,.56,.17,.88],[.19,.075,.19,.31,.18,.32],[.7,.075,.69,.82,.22,.83]],
  accents:[[.17,.15,.48,.24,.24,.54],[.73,.17,.72,.79,.28,.78]]}
];
export const ENCHANTED_GROUND_CANDIDATES=Object.freeze(definitions.map(d=>Object.freeze({
 ...d,id:`biome130:${String(d.ordinal).padStart(3,'0')}`,prospectiveId:255+d.ordinal,
 selectable:true,replaceable:true,rotationCount:4,collision:d.solid?'occupied':'none',
 boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),accents:Object.freeze(d.accents.map(b=>Object.freeze(b))),
 palette:Object.freeze(d.palette)
})));
export function rotateOccupancy(candidate,turns=0){
 if(!Number.isInteger(turns)||turns<0||turns>3)throw new RangeError('turns must be 0..3');
 return candidate.boxes.map(box=>{
  let [x0,y0,z0,x1,y1,z1]=box;
  for(let n=0;n<turns;n++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];
  return [x0,y0,z0,x1,y1,z1].map(x=>Number(x.toFixed(6)));
 });
}
export function materialSample(candidate,x,y,z,face=0){
 const h=(Math.imul((x|0)^candidate.seed,73856093)^Math.imul(y|0,19349663)^Math.imul(z|0,83492791)^Math.imul(face|0,2654435761))>>>0;
 return candidate.palette[h%candidate.palette.length];
}
// A deliberately opt-in geometry fixture; live engine must implement adjacent-box culling.
export function surfacePrototype(candidate,turns=0){
 const vertices=[],indices=[];
 const quads=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of rotateOccupancy(candidate,turns))for(const q of quads){
  const start=vertices.length/3;
  for(const p of q)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));
  indices.push(start,start+1,start+2,start,start+2,start+3);
 }
 return {vertices,indices};
}
export function symbolicEditFixture(candidate,turns=0){
 rotateOccupancy(candidate,turns);
 const placed=JSON.stringify({id:candidate.id,orientation:turns});
 const restored=JSON.parse(placed);
 if(restored.id!==candidate.id)throw new Error('identity lost');
 return {placed:restored,removed:null};
}
