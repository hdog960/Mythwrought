// Builder B Wave63 — Saffronveil Three-Pavilion Shade Conservatory.
// Three separate enclosed desert pavilions around a shaded open-air work plaza.
// Candidate only: no functioning plants, shade simulation, irrigation or world placement.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SAFFRONVEIL_ID='r1:greenhouse:desert:medium:003';
export function buildSaffronveilShadeConservatory(){
 const b=sourcePlan('greenhouse','desert','medium',3,'Saffronveil Three-Pavilion Shade Conservatory',47,21,39);
 const halls=[
  ['west-seed-vault',5,7,16,27,10,'pack3:025'],
  ['east-drying-house',29,9,41,31,12,'pack3:023'],
  ['north-record-pavilion',19,4,26,13,9,'pack3:026']
 ];
 const canopy=['central-open-shade',20,21,26,29,8,'pack3:025'];
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 const K=(x,z)=>x+','+z, roofs=new Map(),walls=new Set(),roots=new Set(),bedsXZ=new Set();
 for(let x=2;x<=44;x++)for(let z=2;z<=36;z++)b.put(x,0,z,'foundation','live:stone');
 for(const [name,x0,z0,x1,z1,base,asset]of [...halls,canopy])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const key=K(x,z),edge=x===x0||x===x1||z===z0||z===z1;
   if(roofs.has(key))throw Error('Overlapping pavilion '+key);
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/3);
   roofs.set(key,{name,y});
   if(name!==canopy[0]&&edge){walls.add(key);for(let j=1;j<y-1;j++)b.put(x,j,z,'wall','live:stone');}
   b.put(x,y-1,z,'support','live:stone');
   b.put(x,y,z,'roof',asset,'north',{saffronveilWing:name,installedPhysicsPending:true});
  }
 for(const [name,x0,z0,x1,z1]of [...halls,canopy])
  for(const [x,z]of [[x0,z0],[x0,z1],[x1,z0],[x1,z1]]){
   roots.add(K(x,z));b.support(x,z,roofs.get(K(x,z)).y-1,'live:stone','saffronveil-bearing-'+name);
  }
 const beds=[
  ['west-seed-stone-tray',8,11,12,15,true],['east-drying-stone-tray',32,15,36,19,true],
  ['north-sun-ledger',20,15,25,17,false],['south-hardening-bed',20,32,25,34,false]
 ];
 for(const [name,x0,z0,x1,z1,sheltered]of beds)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(roofs.has(k)!==sheltered||!b.clear(x,1,z)||!b.clear(x,2,z)||b.clear(x,0,z))throw Error('Invalid dry bed '+k);
  bedsXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',{saffronveilBed:name,sheltered});
  if(x===x0||x===x1||z===z0||z===z1)b.put(x,2,z,'furnishing','live:stone','none',{saffronveilRim:name});
 }
 // A low interior division in the west seed vault, with a two-cell doorway.
 for(let x=6;x<=15;x++)if(x!==10&&x!==11)for(let y=1;y<=3;y++)
  b.put(x,y,19,'partition','live:wood','none',{saffronveilSeedDivision:true});
 const rooms=[
  ['west-seed-vault',5,7,16,19],['west-sorting-room',5,19,16,27],
  ['east-drying-house',29,9,41,31],['north-record-pavilion',19,4,26,13],
  ['central-open-shade',20,21,26,29],['open-plaza',17,14,28,36]
 ];
 for(const room of rooms)b.room(...room);
 const doors=[
  ['outside','west-seed-vault',10,7],['west-seed-vault','open-plaza',16,16],
  ['west-seed-vault','west-sorting-room',10,19],['west-seed-vault','west-sorting-room',11,19],
  ['west-sorting-room','open-plaza',16,23],['outside','west-sorting-room',10,27],
  ['east-drying-house','open-plaza',29,23],['outside','east-drying-house',35,31],
  ['outside','north-record-pavilion',22,4],['north-record-pavilion','open-plaza',22,13],
  ['open-plaza','central-open-shade',23,21],['central-open-shade','open-plaza',23,29],
  ['outside','open-plaza',27,36]
 ];
 for(const[from,to,x,z]of doors){
  const k=K(x,z);if(roots.has(k)||bedsXZ.has(k)||b.clear(x,0,z))throw Error('Blocked doorway '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const k of walls){
  const[x,z]=k.split(',').map(Number);
  if(roots.has(k)||(x*5+z*3)%6!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,d])=>!roofs.has(K(x+d[0],z+d[1]))&&[2,3,4,5].every(y=>b.clear(x+d[0],y,z+d[1])));
  if(!face)continue;
  for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],{saffronveilPane:true,installedPhysicsPending:true});}
 }
 return b.finish('Three detached desert seed pavilions, open-sided central canopy on four continuous stone bearings, two sheltered and two exposed dry stone trays, split sorting room and outdoor circulation.',{
  originalBuilderBWave:63,workingCrops:false,workingIrrigation:false,workingClimateControl:false,productionRegistered:false,
  schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false
 });
}
