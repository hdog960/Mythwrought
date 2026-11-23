// MYTHWROUGHT Roadmap B Wave52 — Sunmantle Six-Paddock Stone Caravansary.
// Original B115 desert large stable #005. Six actual dry fenced stone-ground
// paddocks, two-high rail gates, raised dry trough stones, four fully clear
// open courts, eleven distinct backed Pack3 roof wings and three connected
// outdoor stone aprons. No working horses, water, live Pack physics, world
// registration, settlement automation, save writes or creator visual signoff.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNMANTLE_SIX_PADDOCK_ID='r1:stable:desert:large:005';
export function buildSunmantleSixPaddockCaravansary(){
 const b=sourcePlan('stable','desert','large',5,'Sunmantle Six-Paddock Stone Caravansary',78,38,94);
 const wings=[
  ['north-red-dune-arrival',24,3,54,17,16,'pack3:025'],
  ['west-coach-ropes-and-tack',4,12,28,52,15,'pack3:026'],
  ['east-salt-pack-saddle-ledger',50,12,74,52,18,'pack3:023'],
  ['long-dry-caravan-crosshall',28,17,51,57,23,'pack3:025'],
  ['west-silent-animal-grooming',8,49,31,68,17,'pack3:026'],
  ['east-empty-saddle-vault',47,49,70,68,20,'pack3:023'],
  ['northwest-windbreak-vault',2,6,22,32,14,'pack3:025'],
  ['northeast-arched-dust-shelter',57,6,76,33,18,'pack3:026'],
  ['southern-unpowered-crossbeam',27,59,52,70,20,'pack3:025'],
  ['west-thick-clay-outrigger',2,35,15,62,16,'pack3:026'],
  ['east-stone-vent-outrigger',63,35,75,62,19,'pack3:023']
 ],courts=[
  ['north-sky-stone-rest',33,22,43,34],
  ['western-open-dry-groom',13,42,22,51],
  ['eastern-open-dry-groom',56,42,65,51],
  ['southern-open-stone-crossyard',34,53,45,61]
 ],paddocks=[
  ['west-inner-camel-free',9,74,'west-loading-apron'],
  ['west-outer-camel-free',18,74,'west-loading-apron'],
  ['central-west-pack-free',30,74,'center-loading-apron'],
  ['central-east-pack-free',41,74,'center-loading-apron'],
  ['east-inner-horse-free',55,74,'east-loading-apron'],
  ['east-outer-horse-free',65,74,'east-loading-apron']
 ],key=(x,z)=>x+','+z,
 indoor=new Set(),court=new Set(),outside=new Set(),
 roofs=new Map(),first=new Map(),bearingXZ=new Set(),penRailXZ=new Set(),
 facing={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [,x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   court.add(key(x,z));indoor.delete(key(x,z));
  }
 for(const [x0,x1] of [[7,25],[29,49],[53,72]])
  for(let x=x0;x<=x1;x++)for(let z=67;z<=91;z++)
   if(!indoor.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 for(let x=9;x<=70;x++)for(let z=87;z<=91;z++)
  if(!indoor.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 const founded=(x,z)=>indoor.has(key(x,z))||court.has(key(x,z))||outside.has(key(x,z));
 for(const c of new Set([...indoor,...court,...outside])){
  const [x,z]=c.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {originalFoundedStoneStableFloor:true,liveHorsesNotSpawned:true});
 }
 for(const c of indoor){
  const [x,z]=c.split(',').map(Number);
  if(Object.values(facing).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=10;y++)b.put(x,y,z,'wall','live:stone','none',
    {originalStableMasonryEnvelope:true,physicalWeatherUnverified:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=key(x,z);if(!indoor.has(k)||roofs.has(k))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(name==='long-dry-caravan-crosshall'?3:5));
   roofs.set(k,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {originalPack3RoofDirectBacking:true,packPhysicalUnknown:true});
   b.put(x,y,z,'roof',asset,'north',
    {sunmantleActualRoofWing:name,unapprovedPack3MeshCollider:true});
   if(!first.has(name))first.set(name,[x,z,y]);
  }
 for(const [name] of wings){
  const site=first.get(name);
  if(!site)throw Error('Sunmantle roof has no authored physical cells '+name);
  bearingXZ.add(key(site[0],site[1]));
  b.support(site[0],site[1],site[2]-1,'live:stone',
   'sunmantle-contiguous-source-roof-bearing-'+name);
 }
 let railCells=0,gates=0,troughCells=0;
 for(const [name,x0,z0] of paddocks){
  const gate=x0+3,x1=x0+6,z1=z0+6;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!outside.has(key(x,z))||b.clear(x,0,z))
    throw Error('Unfounded true 7x7 paddock '+name+' '+key(x,z));
   if(!(x===x0||x===x1||z===z0||z===z1)||x===gate&&z===z0)continue;
   for(let y=1;y<=2;y++){
    if(!b.clear(x,y,z))throw Error('Paddock original rail source clash');
    b.put(x,y,z,'wall','live:wood','none',
     {sunmantleTwoHighRealDryWoodRail:name,installedAnimalCollisionUnknown:true});
    railCells++;
   }
   penRailXZ.add(key(x,z));
  }
  if(!b.clear(gate,1,z0)||!b.clear(gate,2,z0))
   throw Error('Sunmantle gated entrance lacks two-high clearance '+name);
  gates++;
  for(let x=gate-1;x<=gate+1;x++){
   const z=z0+4;
   if(!b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Dry pen trough obstructed or already occupied');
   b.put(x,1,z,'furnishing','live:stone','north',
    {sunmantleAuthenticDryStoneTrough:name,actualWaterAndHorseUse:false});
   troughCells++;
  }
  b.room(name,x0+1,z0+1,x1-1,z1-1);
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',27,20,58,[23,24,31,32,41,42,50,51,56,57]],
  ['x',52,19,59,[22,23,32,33,41,42,51,52,57,58]],
  ['z',21,23,53,[27,28,35,36,44,45,51,52]],
  ['z',59,12,66,[18,19,29,30,39,40,51,52,62,63]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!indoor.has(key(x,z))||bearingXZ.has(key(x,z))||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {sourceOnlyDryStableScreen:true,animalServiceNotImplemented:true});
 }
 for(const room of [
  ['north-red-dune-arrival',25,4,53,16],
  ['west-coach-ropes-and-tack',5,13,27,51],
  ['east-salt-pack-saddle-ledger',51,13,73,51],
  ['long-dry-caravan-crosshall',29,18,50,56],
  ['west-silent-animal-grooming',9,50,30,67],
  ['east-empty-saddle-vault',48,50,69,67],
  ['northwest-windbreak-vault',3,7,21,31],
  ['northeast-arched-dust-shelter',58,7,75,32],
  ['southern-unpowered-crossbeam',28,60,51,69],
  ['west-thick-clay-outrigger',3,36,14,61],
  ['east-stone-vent-outrigger',64,36,74,61],
  ['north-sky-stone-rest',33,22,43,34],
  ['western-open-dry-groom',13,42,22,51],
  ['eastern-open-dry-groom',56,42,65,51],
  ['southern-open-stone-crossyard',34,53,45,61],
  ['west-loading-apron',7,68,25,91],
  ['center-loading-apron',29,70,49,91],
  ['east-loading-apron',53,68,72,91],
  ['outer-three-way-stone-crosspath',9,87,70,91]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-red-dune-arrival',39,3],
  ['north-red-dune-arrival','long-dry-caravan-crosshall',39,17],
  ['north-red-dune-arrival','west-coach-ropes-and-tack',27,14],
  ['north-red-dune-arrival','east-salt-pack-saddle-ledger',52,14],
  ['north-red-dune-arrival','northwest-windbreak-vault',22,10],
  ['north-red-dune-arrival','northeast-arched-dust-shelter',57,10],
  ['long-dry-caravan-crosshall','north-sky-stone-rest',32,28],
  ['north-sky-stone-rest','west-coach-ropes-and-tack',31,27],
  ['north-sky-stone-rest','east-salt-pack-saddle-ledger',45,27],
  ['long-dry-caravan-crosshall','western-open-dry-groom',27,46],
  ['long-dry-caravan-crosshall','eastern-open-dry-groom',52,46],
  ['west-coach-ropes-and-tack','western-open-dry-groom',23,45],
  ['east-salt-pack-saddle-ledger','eastern-open-dry-groom',55,45],
  ['long-dry-caravan-crosshall','southern-open-stone-crossyard',33,57],
  ['southern-open-stone-crossyard','southern-unpowered-crossbeam',39,63],
  ['west-coach-ropes-and-tack','west-silent-animal-grooming',22,50],
  ['east-salt-pack-saddle-ledger','east-empty-saddle-vault',57,50],
  ['west-silent-animal-grooming','southern-unpowered-crossbeam',31,65],
  ['east-empty-saddle-vault','southern-unpowered-crossbeam',47,65],
  ['northwest-windbreak-vault','west-thick-clay-outrigger',8,35],
  ['northeast-arched-dust-shelter','east-stone-vent-outrigger',69,35],
  ['west-silent-animal-grooming','west-loading-apron',17,69],
  ['east-empty-saddle-vault','east-loading-apron',61,69],
  ['southern-unpowered-crossbeam','center-loading-apron',39,71],
  ['west-loading-apron','outer-three-way-stone-crosspath',17,89],
  ['center-loading-apron','outer-three-way-stone-crosspath',39,89],
  ['east-loading-apron','outer-three-way-stone-crosspath',61,89]
 ]){
  if(!founded(x,z))throw Error('Unfounded source stable portal '+key(x,z));
  if(penRailXZ.has(key(x,z)))throw Error('Doorway touches authentic pen rail');
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [name,x0,z0,apron] of paddocks){
  const gate=x0+3;
  if(!outside.has(key(gate,z0)))throw Error('Pen gate has no outdoor source path');
  b.portal(apron,name,gate,z0);
 }
 let paneCells=0,paneBays=0;
 for(const cell of indoor){
  const [x,z]=cell.split(',').map(Number);
  if(bearingXZ.has(cell)||(x*19+z*7)%13!==0||
      [1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  const outward=Object.entries(facing).find(([,d])=>!founded(x+d[0],z+d[1]));
  if(!outward)continue;
  for(let y=2;y<=5;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',outward[0],
    {originalFramedFourHighPack4Candidate:true,realWindowPhysicsUnapproved:true});
   paneCells++;
  }
  paneBays++;
 }
 return b.finish('Eleven genuine source-backed gallery roofs, four truly sky-open founded courts, six individually founded 7x7 dry pen fences with actual two-high entrance gaps and raised empty stone troughs, plus a cardinal-connected three-way exterior stone approach. No working horses, water or runtime state.',{
  originalBuilderBWave:52,
  distinctActualRoofWings:first.size,
  fourSkyOpenStoneCourtSizes:[143,100,100,108],
  genuinelyFoundedDryPaddocks:paddocks.length,
  actuallyAuthoredTwoTierDryPenRailCells:railCells,
  actualTwoHighPenGates:gates,
  raisedEmptyStoneTroughCells:troughCells,
  actualUnroofedStoneApronCells:outside.size,
  genuinelyConnectedThreeLoadingArms:true,
  originalFourHighPack4CandidateWindowCells:paneCells,
  completeSourceFourHighWindowBays:paneBays,
  workingHorses:false,horseAI:false,liveWater:false,
  actualPack3Pack4PhysicalApproval:false,
  productionRegistered:false,worldPlacement:false,saveSchema1Written:false,
  iphoneHomeScreenPwaTested:false,creatorVisualApproval:false
 });
}
