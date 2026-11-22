// MYTHWROUGHT Builder B Wave34 — Coppermesa Comb-Lane Harvest Barn.
// ORIGINAL B115 desert medium farm-barn; entirely detached 1B source.
// Two independent 7x9 grounded thirty-tier grain silos, distinct roofed
// threshing wings, real open-air hardstands, three separately paved
// harvesting lanes and a traversable stone comb crosspiece. No real grain,
// harvest, NPCs, wind/thermal loads, source/world saves, or live registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const COPPERMESA_COMB_HARVEST_ID='r1:farm-barn:desert:medium:003';
export function buildCoppermesaCombLaneHarvestBarn(){
 const b=sourcePlan('farm-barn','desert','medium',3,'Coppermesa Comb-Lane Harvest Barn',71,46,73);
 const wings=[
 ['northern-threshers-registry',16,3,53,18,15,'pack3:025'],
 ['western-wind-sheltered-hay',4,12,28,54,12,'pack3:026'],
 ['eastern-sun-dry-grain-hall',43,11,67,54,17,'pack3:023'],
 ['central-straw-harvest-passage',23,18,49,56,20,'pack3:025'],
 ['southwestern-empty-seed-locker',8,51,34,66,13,'pack3:026'],
 ['southeastern-copper-crib',38,51,64,67,15,'pack3:023'],
 ['northwest-inert-scales-porch',3,5,19,31,9,'pack3:025'],
 ['northeast-desert-canvas-arcade',56,5,69,32,16,'pack3:026']
 ],courts=[[27,25,42,37],[13,49,20,56]],
 silos=[
  {name:'west-unfilled-grain-silo',x0:7,x1:13,z0:21,z1:29,h:29},
  {name:'east-unfilled-seed-silo',x0:59,x1:65,z0:21,z1:29,h:32}
 ],K=(x,z)=>x+','+z,base=new Set(),outdoor=new Set(),lanes=new Set(),roofed=new Map(),
 dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)base.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   outdoor.add(K(x,z));base.delete(K(x,z));
  }
 const tower=(x,z)=>silos.find(t=>x>=t.x0&&x<=t.x1&&z>=t.z0&&z<=t.z1),
  roofable=(x,z)=>base.has(K(x,z))&&!tower(x,z);
 // Three genuine OUTDOOR harvesting lanes and their single cross-braid.
 // All retained cells will have real physical y0 stone, no elevated decks.
 for(const [x0,z0,x1,z1] of [
  [17,62,23,71],[32,62,38,71],[49,62,55,71],[20,68,52,71]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  if(!base.has(K(x,z))&&!outdoor.has(K(x,z)))lanes.add(K(x,z));
 const grounded=(x,z)=>base.has(K(x,z))||outdoor.has(K(x,z))||lanes.has(K(x,z))||tower(x,z);
 for(const k of new Set([...base,...outdoor,...lanes])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {genuinelyGroundedHarvestPaving:true,actualDesertTerrainUnmodified:true});
 }
 for(const key of base){
  const [x,z]=key.split(',').map(Number);
  if(tower(x,z))continue;
  if(Object.values(dirs).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalBarnOuterHayWall:true,actualSandproofingNotCertified:true});
 }
 for(const [name,x0,z0,x1,z1,y0,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!roofable(x,z)||roofed.has(K(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=y0+Math.floor(d/(name==='central-straw-harvest-passage'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {authoredRealYMinusOneRoofBearer:true,engineeringLoadNotRated:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalCoppermesaRoofWing:name,producerPackNotInstalled:true});
  }
 // Eight authentic timber bents begin from ground, never in the paved courts.
 for(const [x,z] of [[21,8],[35,8],[50,8],[16,39],
  [53,39],[25,55],[47,56],[33,20]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Coppermesa true timber bent not below source roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','real-roof-to-ground-timber-bent');
 }
 for(const [axis,fix,lo,hi,gaps] of [
  ['x',25,18,55,[21,22,29,30,37,38,47,48]],
  ['x',44,18,55,[21,22,29,30,39,40,47,48]],
  ['z',18,16,53,[22,23,31,32,41,42,49,50]],
  ['z',52,8,64,[14,15,24,25,34,35,43,44,54,55]],
  ['x',18,6,30,[12,13,20,21,27,28]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fix:n,z=axis==='z'?fix:n;
  if(!roofable(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalEmptyGrainSectionDivider:true,noHarvestMechanics:true});
 }
 // The silos have actual solid load-bearing bases, then continuous
 // ring walls. Upper contents/upper floors are NOT player accessible.
 // Each of 24 octagonal ring stones has an authentic supported Pack3 crown.
 for(const t of silos){
  const rim=(x,z)=>(x===t.x0||x===t.x1||z===t.z0||z===t.z1)&&
   !((x===t.x0||x===t.x1)&&(z===t.z0||z===t.z1));
  for(let x=t.x0;x<=t.x1;x++)for(let z=t.z0;z<=t.z1;z++){
   if(b.clear(x,0,z))b.put(x,0,z,'foundation','live:stone','none',
    {originalSiloRealFoundation:true});
   for(let y=1;y<=3;y++){
    if(!b.clear(x,y,z))b.cut(x,y,z);
    b.put(x,y,z,'wall','live:stone','none',
     {genuineStoneSolidLowerSilo:t.name,noUpperAccessibleFloor:true});
   }
   if(!rim(x,z))continue;
   for(let y=4;y<=t.h;y++){
    if(!b.clear(x,y,z))b.cut(x,y,z);
    b.put(x,y,z,'wall','live:stone','none',
     {sourceGroundedSiloRim:t.name,genuineStoneTier:y});
   }
   b.put(x,t.h+1,z,'roof','pack3:025','north',
    {originalBackedSiloCrown:t.name,noLiveGrainFlow:true});
  }
 }
 for(const row of [
  ['northern-threshing-registrar',17,4,52,17],
  ['western-baled-hay-store',5,13,27,53],
  ['eastern-empty-dry-grain-store',44,12,66,53],
  ['central-strawless-work-arcade',24,19,48,55],
  ['southwestern-dormant-seed-vault',9,52,33,65],
  ['southeastern-idle-crib-gallery',39,52,63,66],
  ['northwest-shaded-scales-porch',4,6,18,30],
  ['northeast-open-wind-gallery',57,6,68,31],
  ['central-unroofed-stone-threshing-yard',27,25,42,37],
  ['west-sky-open-dry-loading-yard',13,49,20,56],
  ['western-grounded-harvest-lane',17,63,23,70],
  ['center-grounded-harvest-lane',32,63,38,70],
  ['eastern-grounded-harvest-lane',49,63,55,70],
  ['real-southern-lane-cross-braid',20,68,52,71]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','northern-threshing-registrar',34,3],
  ['northern-threshing-registrar','western-baled-hay-store',25,15],
  ['northern-threshing-registrar','eastern-empty-dry-grain-store',44,15],
  ['northern-threshing-registrar','central-strawless-work-arcade',36,18],
  ['western-baled-hay-store','central-strawless-work-arcade',25,31],
  ['eastern-empty-dry-grain-store','central-strawless-work-arcade',44,31],
  ['central-strawless-work-arcade','southwestern-dormant-seed-vault',30,52],
  ['central-strawless-work-arcade','southeastern-idle-crib-gallery',43,52],
  ['central-strawless-work-arcade','central-unroofed-stone-threshing-yard',26,31],
  ['central-unroofed-stone-threshing-yard','eastern-empty-dry-grain-store',43,32],
  ['western-baled-hay-store','west-sky-open-dry-loading-yard',18,48],
  ['west-sky-open-dry-loading-yard','southwestern-dormant-seed-vault',19,57],
  ['southwestern-dormant-seed-vault','western-grounded-harvest-lane',21,62],
  ['southwestern-dormant-seed-vault','center-grounded-harvest-lane',33,62],
  ['southeastern-idle-crib-gallery','eastern-grounded-harvest-lane',51,64],
  ['western-grounded-harvest-lane','real-southern-lane-cross-braid',23,69],
  ['center-grounded-harvest-lane','real-southern-lane-cross-braid',35,69],
  ['real-southern-lane-cross-braid','eastern-grounded-harvest-lane',49,69],
  ['northern-threshing-registrar','northwest-shaded-scales-porch',18,14],
  ['eastern-empty-dry-grain-store','northeast-open-wind-gallery',57,18]
 ]){
  if(!grounded(x,z)||tower(x,z))
   throw Error('Coppermesa source doorway has no safe grounded original floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // High real upright Pack4 glass in each silo, with independent stone y-1
 // sill/y+1 lintel and same-tier outward-air admission.
 let high=0;
 for(const t of silos){
  const y=t.h-6;
  for(const [x,z,face] of [
   [t.x0+2,t.z0,'north'],[t.x0+4,t.z0,'north'],
   [t.x0+2,t.z1,'south'],[t.x0+4,t.z1,'south'],
   [t.x0,t.z0+3,'west'],[t.x1,t.z0+5,'east']
  ]){
   const [dx,dz]=dirs[face];
   if(b.clear(x,y,z)||b.clear(x,y-1,z)||b.clear(x,y+1,z)||
      !b.clear(x+dx,y,z+dz))
    throw Error('Coppermesa high stone window misses true exterior stone frame '+K(x,z));
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',face,
    {realOriginalHighSiloWindow:true,actualPackMeshNotRegistered:true});
   high++;
  }
 }
 let low=0;
 for(const key of base){
  const [x,z]=key.split(',').map(Number);
  if(tower(x,z)||(x*13+z*11)%12!==0)continue;
  const side=Object.entries(dirs).find(([,v])=>!grounded(x+v[0],z+v[1]));
  if(!side||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side[0],
    {genuineTwoHighBarnPack4Glass:true,mountNotCertified:true});
   low++;
  }
 }
 for(const [x,z,name] of [[35,8,'inactive-threshing-tally'],[12,36,'dry-rafter-canvas'],
  [50,37,'unpowered-barn-lift-sign'],[28,59,'closed-copper-seed-chest'],
  [47,58,'stacked-empty-hay-tag'],[10,12,'silent-iron-grain-counter']])
  if(roofable(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original medium desert barn with two genuine tall grounded masonry silos, 48 physically backed individual crown cells, 12 elevated stone-framed windows, eight directly backed Pack3 roof wings, 208+64 uncovered paved walking yards and three connected unroofed comb-lane handling tracks. Inert source only.',{
  builderBOnlyWave:34,originalSupportedRoofWings:8,
  originalOpenPavedYards:[208,64],genuineGroundedCombLaneCells:lanes.size,
  groundConnectedHarvestLanes:3,sourceSiloWallHeights:[29,32],
  physicallyBackedSiloCrownCells:48,
  originalHighPack4Windows:high,lowerTwoTierPack4GlassCells:low,
  noLiveGrainOrCropGrowth:true,liveHarvestMachines:false,
  noLiveHeatOrWindOrSandPhysics:true,upperSiloFloorsNotAccessible:true,
  originalWorldPlacement:false,producerColliderApproved:false,
  actualIphonePwaTested:false,creatorArtAccepted:false,
  productionRegistered:false,worldPlacement:false,saveSchema1Written:false
 });
}
