// MYTHWROUGHT Builder B Wave61 — Alderwisp Three-Lantern Seed Court.
// Original fixed footprint, three occupied roof wings and open dry courtyard.
// No crop, irrigation, runtime registration, settlement or save integration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ALDERWISP_THREE_LANTERN_ID='r1:greenhouse:temperate:small:003';
export function buildAlderwispThreeLanternSeedCourt(){
 const b=sourcePlan('greenhouse','temperate','small',3,'Alderwisp Three-Lantern Seed Court',31,19,35);
 const wings=[
  ['north-seed-reception',8,3,22,10,9,'pack3:026'],
  ['west-propagation-lantern',3,10,10,22,10,'pack3:025'],
  ['east-drying-lantern',20,10,27,24,12,'pack3:023']
 ];
 const K=(x,z)=>x+','+z, covered=new Set(),roofed=new Set(),roots=new Map();
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)covered.add(K(x,z));
 // Contiguous masonry footing across the U-shaped house and outdoor work court.
 for(let x=2;x<=28;x++)for(let z=2;z<=32;z++)b.put(x,0,z,'foundation','live:stone');
 for(const k of covered){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!covered.has(K(x+dx,z+dz))))
   for(let y=1;y<=6;y++)b.put(x,y,z,'wall','live:stone');
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=K(x,z);if(roofed.has(k))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/2);
   roofed.add(k);b.put(x,y-1,z,'support','live:stone');
   b.put(x,y,z,'roof',asset,'north',{alderwispWing:name,installedMeshPending:true});
   if(!roots.has(name))roots.set(name,[x,z,y]);
  }
 for(const [name,[x,z,y]] of roots)b.support(x,z,y-1,'live:stone','alderwisp-bearing-'+name);
 // Three independent dry seed trays: two courtyard, one southern outdoor bench.
 const trays=[['west-sun-tray',12,15,14,19],['east-sun-tray',16,15,18,19],['south-ledger-tray',12,27,18,28]];
 const trayXZ=new Set();
 for(const [name,x0,z0,x1,z1] of trays)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(covered.has(K(x,z))||b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))throw Error('Obstructed dry tray '+name);
  trayXZ.add(K(x,z));b.put(x,1,z,'furnishing','live:stone','none',{alderwispDryTray:name,workingCrops:false});
  if(x===x0||x===x1||z===z0||z===z1)b.put(x,2,z,'furnishing','live:stone','none',{alderwispDryRim:name});
 }
 const rooms=[
  ['north-seed-reception',8,3,22,10],['west-propagation-lantern',3,10,10,22],
  ['east-drying-lantern',20,10,27,24],['open-seed-court',11,11,19,24],
  ['southern-ledger-yard',3,25,27,32]
 ];
 for(const room of rooms)b.room(...room);
 const portals=[
  ['outside','north-seed-reception',15,3],
  ['north-seed-reception','west-propagation-lantern',9,10],
  ['north-seed-reception','east-drying-lantern',21,10],
  ['north-seed-reception','open-seed-court',15,10],
  ['west-propagation-lantern','open-seed-court',10,16],
  ['east-drying-lantern','open-seed-court',20,17],
  ['open-seed-court','southern-ledger-yard',15,25],
  ['west-propagation-lantern','southern-ledger-yard',6,22],
  ['east-drying-lantern','southern-ledger-yard',24,24],
  ['outside','southern-ledger-yard',15,32]
 ];
 const rootXZ=new Set([...roots.values()].map(([x,z])=>K(x,z)));
 for(const [from,to,x,z] of portals){
  if(rootXZ.has(K(x,z))||trayXZ.has(K(x,z)))throw Error('Portal cuts solid support/tray');
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Four-high windows with genuine stone sills/headers and outward empty cells.
 for(const k of covered){
  const[x,z]=k.split(',').map(Number);
  if(rootXZ.has(k)||(x*7+z*3)%5!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,d])=>!covered.has(K(x+d[0],z+d[1]))&&[2,3,4,5].every(y=>b.clear(x+d[0],y,z+d[1])));
  if(!face)continue;
  for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],{alderwispFourHighPane:true,installedPhysicsPending:true});}
 }
 return b.finish('Asymmetric U-shaped three-lantern dry seed greenhouse with two sun trays, one ledger tray, stone-backed stepped roofs and connected open-air work yard.',{
  originalBuilderBWave:61,workingCrops:false,workingIrrigation:false,productionRegistered:false,
  worldPlacement:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false
 });
}
