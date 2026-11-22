// MYTHWROUGHT Builder B Wave36 — Sunspire Twin-Crown Desert Lighthouse.
// ORIGINAL frozen B115 large desert lighthouse; source-only original 1B.
// TWO fully stone-grounded octagonal original towers (38/34), 9 asymmetric
// immediately supported Pack3 wings, 3 walkable sky-open courts, real
// paved south Y-shaped source approach, high upright stone-framed Pack4
// windows and complete 3-high low window bays. No powered lamps, sea,
// engineering wind-rating, world registration, NPC, saves or mobile proof.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNSPIRE_TWIN_CROWN_ID='r1:lighthouse:desert:large:002';
export function buildSunspireTwinCrownDesertLighthouse(){
 const b=sourcePlan('lighthouse','desert','large',2,
  'Sunspire Twin-Crown Desert Lighthouse',78,50,78);
 const wings=[
  ['northern-sun-chart-nave',18,3,59,19,16,'pack3:025'],
  ['western-shadow-keel-archive',4,12,29,59,12,'pack3:026'],
  ['eastern-glass-inventory-hall',49,10,72,58,18,'pack3:023'],
  ['central-triple-gallery',25,19,53,61,22,'pack3:025'],
  ['southwest-sealed-navigation-room',8,52,37,70,15,'pack3:026'],
  ['southeast-unlit-signal-workshop',41,52,70,71,16,'pack3:023'],
  ['northwest-fabric-navigation-porch',3,5,20,33,10,'pack3:025'],
  ['northeast-unused-celestial-desk',63,5,75,34,18,'pack3:026'],
  ['south-center-unheated-crosshall',29,59,51,71,17,'pack3:025']
 ],courts=[[30,27,47,40],[13,50,22,59],[56,50,65,59]],
 towers=[
  {name:'west-grounded-sunspire',x0:7,x1:13,z0:22,z1:30,h:38},
  {name:'east-grounded-sunspire',x0:65,x1:71,z0:22,z1:30,h:34}
 ],K=(x,z)=>x+','+z,indoor=new Set(),outdoor=new Set(),approach=new Set(),roofed=new Map(),
 sides={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  outdoor.add(K(x,z));indoor.delete(K(x,z));
 }
 const towerAt=(x,z)=>towers.find(t=>x>=t.x0&&x<=t.x1&&z>=t.z0&&z<=t.z1);
 const isIndoor=(x,z)=>indoor.has(K(x,z)),roofable=(x,z)=>isIndoor(x,z)&&!towerAt(x,z);
 for(const [x0,z0,x1,z1] of [[18,65,26,76],[52,65,60,76],[24,72,54,76]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!isIndoor(x,z)&&!outdoor.has(K(x,z)))approach.add(K(x,z));
 const ground=(x,z)=>isIndoor(x,z)||outdoor.has(K(x,z))||approach.has(K(x,z))||!!towerAt(x,z);
 for(const k of new Set([...indoor,...outdoor,...approach])){
  const [x,z]=k.split(',').map(Number);b.put(x,0,z,'foundation','live:stone','none',
   {sourceDesertLighthouseStoneWalk:true,realDesertTerrainNotModified:true});
 }
 for(const k of indoor){
  const [x,z]=k.split(',').map(Number);
  if(towerAt(x,z))continue;
  if(Object.values(sides).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:stone','none',
    {sourceWindShelteredOuterWall:true,actualWindLoadUncertified:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!roofable(x,z)||roofed.has(K(x,z)))continue;
   const dist=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(dist/(wing==='central-triple-gallery'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {actualOriginalRoofYMinusOneBacking:true,spansNotLoadRated:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalSunspireRoofWing:wing,originalRoofProducerNotMounted:true});
  }
 for(const [x,z] of [
  [24,8],[38,8],[55,8],[17,40],[59,40],[28,56],[49,57],
  [12,56],[68,41],[17,15],[56,23],[33,20],[45,64],[38,67]
 ]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Sunspire permanent stone bent misses true roof '+K(x,z));
  b.support(x,z,y-1,'live:stone','real-y0-to-roof-stone-bent');
 }
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',28,20,58,[23,24,32,33,41,42,51,52]],
  ['x',51,20,58,[23,24,32,33,43,44,51,52]],
  ['z',19,18,60,[25,26,35,36,45,46,55,56]],
  ['z',53,8,70,[16,17,28,29,39,40,49,50,60,61]],
  ['x',18,7,33,[13,14,23,24,29,30]],
  ['x',66,9,35,[15,16,25,26,31,32]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!roofable(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalNonpoweredHarborMapScreen:true,noCreatureOrMerchantAI:true});
 }
 for(const tower of towers){
  const ring=(x,z)=>(x===tower.x0||x===tower.x1||z===tower.z0||z===tower.z1)&&
   !((x===tower.x0||x===tower.x1)&&(z===tower.z0||z===tower.z1));
  for(let x=tower.x0;x<=tower.x1;x++)for(let z=tower.z0;z<=tower.z1;z++){
   if(b.clear(x,0,z))b.put(x,0,z,'foundation','live:stone','none',
    {realOriginalGroundedSunspireFoundation:tower.name});
   for(let y=1;y<=3;y++){
    if(!b.clear(x,y,z))b.cut(x,y,z);
    b.put(x,y,z,'wall','live:stone','none',
     {trueSolidStoneLowerTower:tower.name,noUpperFloors:true});
   }
   if(!ring(x,z))continue;
   for(let y=4;y<=tower.h;y++){
    if(!b.clear(x,y,z))b.cut(x,y,z);
    b.put(x,y,z,'wall','live:stone','none',
     {continuousOriginalTowerWall:tower.name,trueShaftTier:y});
   }
   b.put(x,tower.h+1,z,'roof','pack3:025','north',
    {realDirectlyBackedSunspireCrown:tower.name,lightBeaconActive:false});
  }
 }
 for(const row of [
  ['north-dry-celestial-chart-room',19,4,58,18],
  ['west-unused-sun-sail-library',5,13,28,58],
  ['east-stored-glass-reference',50,11,71,57],
  ['central-stone-circulation-nave',26,20,52,60],
  ['southwest-unpowered-lens-vault',9,53,36,69],
  ['southeast-silent-copper-repair',42,53,69,70],
  ['northwest-wind-chart-porch',4,6,19,32],
  ['northeast-closed-astral-desk',64,6,74,33],
  ['south-grounded-crosshall',30,60,50,70],
  ['main-source-open-sand-yard',30,27,47,40],
  ['west-actual-unroofed-stone-yard',13,50,22,59],
  ['east-actual-unroofed-stone-yard',56,50,65,59],
  ['western-source-y-approach',18,67,26,75],
  ['eastern-source-y-approach',52,67,60,75],
  ['southern-source-y-crosspiece',24,72,54,76]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-dry-celestial-chart-room',38,3],
  ['north-dry-celestial-chart-room','west-unused-sun-sail-library',28,16],
  ['north-dry-celestial-chart-room','east-stored-glass-reference',51,16],
  ['north-dry-celestial-chart-room','central-stone-circulation-nave',38,19],
  ['west-unused-sun-sail-library','central-stone-circulation-nave',28,33],
  ['east-stored-glass-reference','central-stone-circulation-nave',51,33],
  ['central-stone-circulation-nave','southwest-unpowered-lens-vault',32,53],
  ['central-stone-circulation-nave','southeast-silent-copper-repair',47,53],
  ['central-stone-circulation-nave','south-grounded-crosshall',38,61],
  ['central-stone-circulation-nave','main-source-open-sand-yard',29,33],
  ['main-source-open-sand-yard','east-stored-glass-reference',48,34],
  ['west-unused-sun-sail-library','west-actual-unroofed-stone-yard',19,49],
  ['west-actual-unroofed-stone-yard','southwest-unpowered-lens-vault',20,60],
  ['east-stored-glass-reference','east-actual-unroofed-stone-yard',61,49],
  ['east-actual-unroofed-stone-yard','southeast-silent-copper-repair',62,60],
  ['southwest-unpowered-lens-vault','western-source-y-approach',22,68],
  ['southeast-silent-copper-repair','eastern-source-y-approach',56,69],
  ['western-source-y-approach','southern-source-y-crosspiece',26,74],
  ['southern-source-y-crosspiece','eastern-source-y-approach',52,74],
  ['north-dry-celestial-chart-room','northwest-wind-chart-porch',19,15],
  ['east-stored-glass-reference','northeast-closed-astral-desk',64,19]
 ]){
  if(!ground(x,z)||towerAt(x,z))throw Error('Sunspire portal lacks actual unoccupied y0 walking floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Every high original Pack4 stone window has the true y-1 supporting
 // masonry sill, true y+1 lintel and unobstructed exterior air.
 let high=0;
 for(const t of towers){
  const y=t.h-7;
  for(const [x,z,orientation] of [
   [t.x0+2,t.z0,'north'],[t.x0+4,t.z0,'north'],
   [t.x0+2,t.z1,'south'],[t.x0+4,t.z1,'south'],
   [t.x0,t.z0+3,'west'],[t.x1,t.z0+5,'east']
  ]){
   const [dx,dz]=sides[orientation];
   if(b.clear(x,y,z)||b.clear(x,y-1,z)||b.clear(x,y+1,z)||
      !b.clear(x+dx,y,z+dz))
    throw Error('Sunspire high-window original-source stone frame/exterior missing '+K(x,z));
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',orientation,
    {originalHighSunspireWindow:t.name,actualPack4CollisionPending:true});
   high++;
  }
 }
 // Exterior triple-height glass is authored ONLY after ground portal
 // cuts, with y1 masonry sill and y5 lintel; no interior-facing panes.
 let low=0,bays=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(towerAt(x,z)||(x*13+z*11)%12!==0)continue;
  const external=Object.entries(sides).find(([,p])=>!ground(x+p[0],z+p[1]));
  if(!external||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3,4]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',external[0],
    {originalThreeHighSunspireGlass:true,sourceMountNotCertified:true});
   low++;
  }bays++;
 }
 for(const [x,z,label] of [
  [38,8,'dry-astronomy-table'],[12,38,'unlit-celestial-calendar'],
  [54,42,'sealed-copper-signal-reflector'],[28,63,'unused-range-finder'],
  [48,64,'closed-lens-chest'],[15,14,'quiet-sand-clock']
 ])if(roofable(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Large ORIGINAL desert twin-crown lighthouse: nine source-bearing roof wings, two truly grounded 38/34-tall octagonal stone tower shafts with 48 backed Pack3 crown cells and 12 high stone-framed original windows, three individually paved true sky-open courtyards, and a physically traversable outdoor Y-shaped approach. NO powered lighthouse or working water/sea mechanics.',{
  originalBuilderBOnlyWave:36,supportedOriginalRoofWings:9,
  trueGroundedOpenSkyCourts:[252,100,100],
  originalPavedUnroofedYApproachCells:approach.size,sourcePavedApproachBranches:2,
  realStoneTowerWallHeights:[38,34],realPack3CrownCells:48,
  originalHighStoneFramedPack4Windows:high,
  completeThreeHighExteriorGlassBays:bays,originalLowUprightGlassCells:low,
  livePowerOrBeacon:false,upperTowerPlayerStairs:false,
  realSeaOrDesertWindSimulation:false,sourceWorldModified:false,
  actualPackCollisionApproved:false,iphoneHomeScreenAccepted:false,
  creatorVisualAccepted:false,productionRegistered:false,
  worldPlacement:false,saveSchema1Written:false
 });
}
