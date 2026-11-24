// Builder B Wave62: Frostwillow Six-Coldframe Winterglass.
// Fixed L-shaped masonry greenhouse, four sheltered dry beds and two outdoor beds.
// Candidate only: no crop simulation, irrigation, weatherproof claim or runtime registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const FROSTWILLOW_ID='r1:greenhouse:snow:medium:003';
export function buildFrostwillowSixColdframes(){
 const b=sourcePlan('greenhouse','snow','medium',3,'Frostwillow Six-Coldframe Winterglass',43,23,49);
 const wings=[
  ['west-winterglass',5,5,22,34,11,'pack3:026'],
  ['east-seed-drying',23,16,37,30,13,'pack3:025'],
  ['south-work-porch',11,35,18,41,8,'pack3:023'],
  ['north-east-lantern',23,8,31,15,15,'pack3:026']
 ];
 const K=(x,z)=>x+','+z,covered=new Map(),dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const[name,x0,z0,x1,z1,base,asset]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/3);
  if(covered.has(K(x,z)))throw Error('Overlapping authored roof wings');
  covered.set(K(x,z),{name,y,asset});
 }
 for(let x=2;x<=40;x++)for(let z=2;z<=46;z++)b.put(x,0,z,'foundation','live:stone');
 for(const[k,p]of covered){
  const[x,z]=k.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!covered.has(K(x+dx,z+dz))))for(let y=1;y<p.y-1;y++)
   b.put(x,y,z,'wall','live:stone','none',{frostwillowContinuousExterior:true});
  b.put(x,p.y-1,z,'support','live:stone');
  b.put(x,p.y,z,'roof',p.asset,'north',{frostwillowWing:p.name,installedPhysicsPending:true});
 }
 const roots=[['west-winterglass',5,5],['east-seed-drying',37,30],['south-work-porch',11,41],['north-east-lantern',31,8]];
 for(const[name,x,z]of roots){
  const p=covered.get(K(x,z));if(p?.name!==name)throw Error('Missing roof bearing');
  b.support(x,z,p.y-1,'live:stone','frostwillow-bearing-'+name);
 }
 const rootXZ=new Set(roots.map(([,x,z])=>K(x,z)));
 for(let z=16;z<=30;z++)if(z!==20&&z!==26)
  for(let y=1;y<=4;y++)if(b.clear(22,y,z))b.put(22,y,z,'partition','live:stone');
 const beds=[
  ['northwest-coldframe',8,9,11,14,true],['northeast-coldframe',16,9,19,14,true],
  ['southwest-coldframe',8,24,11,29,true],['southeast-coldframe',16,24,19,29,true],
  ['outdoor-seed-rack',26,35,30,39,false],['outdoor-hardening-rack',34,35,38,39,false]
 ];
 const bedXZ=new Set();
 for(const[name,x0,z0,x1,z1,inside]of beds)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);
  if(covered.has(k)!==inside||b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))throw Error('Invalid coldframe '+name);
  bedXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',{frostwillowBed:name,inside,workingCrops:false});
  if(x===x0||x===x1||z===z0||z===z1)b.put(x,2,z,'furnishing','live:stone','none',{frostwillowRim:name});
 }
 const rooms=[
  ['west-winterglass',5,5,22,34],['east-seed-drying',23,16,37,30],
  ['south-work-porch',11,35,18,41],['north-east-lantern',23,8,31,15],
  ['open-north-court',33,5,39,13],['open-south-workyard',23,33,39,45]
 ];
 for(const room of rooms)b.room(...room);
 const doors=[
  ['outside','west-winterglass',13,5],['west-winterglass','east-seed-drying',22,20],
  ['west-winterglass','east-seed-drying',22,26],['west-winterglass','north-east-lantern',22,12],
  ['north-east-lantern','east-seed-drying',27,15],['north-east-lantern','open-north-court',31,11],
  ['east-seed-drying','open-south-workyard',28,30],['west-winterglass','south-work-porch',14,34],
  ['south-work-porch','open-south-workyard',18,39],['outside','south-work-porch',14,41],
  ['outside','open-south-workyard',31,46],['outside','open-north-court',36,5]
 ];
 for(const[from,to,x,z]of doors){
  if(rootXZ.has(K(x,z))||bedXZ.has(K(x,z))||b.clear(x,0,z))throw Error('Blocked door');
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const[k,p]of covered){
  const[x,z]=k.split(',').map(Number);
  if(rootXZ.has(k)||(x*11+z*7)%7!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,d])=>!covered.has(K(x+d[0],z+d[1]))&&[2,3,4,5].every(y=>b.clear(x+d[0],y,z+d[1])));
  if(!face)continue;
  for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],{frostwillowGlazing:true,installedPhysicsPending:true});}
 }
 return b.finish('Asymmetric winterglass with closed stone envelopes, four roof levels, two thermal partition passages, four sheltered and two sky-open stone coldframes, no live crops or heat.',{
  originalBuilderBWave:62,workingCrops:false,workingIrrigation:false,workingHeat:false,productionRegistered:false,
  schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false
 });
}
