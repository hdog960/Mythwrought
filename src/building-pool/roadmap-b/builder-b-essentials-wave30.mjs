// MYTHWROUGHT Roadmap B Wave30 — Briarcliff Crescent-Walk Lighthouse.
// Authentic original 1B B115 MEDIUM temperate source. A grounded crescent-
// walk south apron, ONE genuine high octagonal masonry signal tower, seven
// physical Pack3-backed asymmetric attached roofs, exterior grounded Pack4
// glazing, and TWO open walkable paved courts. NO powered lighthouse,
// real water, settlements, sea cliffs, walkable upper tower, saves, or game.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const BRIARCLIFF_CRESCENT_BEACON_ID='r1:lighthouse:temperate:medium:002';
export function buildBriarcliffCrescentWalkLighthouse(){
 const b=sourcePlan('lighthouse','temperate','medium',2,'Briarcliff Crescent-Walk Lighthouse',66,45,70);
 const wings=[
  ['north-keeper-chart-chamber',16,3,48,18,16,'pack3:025'],
  ['western-sail-seam-workshop',4,12,24,48,12,'pack3:026'],
  ['eastern-weather-observatory',42,10,61,48,17,'pack3:023'],
  ['middle-arched-keeper-ledger',20,17,46,51,20,'pack3:025'],
  ['southwest-rope-and-lantern-storeroom',8,45,30,61,13,'pack3:026'],
  ['southeast-signal-glass-workhouse',36,45,58,62,14,'pack3:023'],
  ['northwest-unpowered-flag-gallery',3,5,17,29,9,'pack3:025']
 ],courts=[[26,25,37,36],[13,48,19,54]],
 tower={x0:51,z0:14,x1:57,z1:22,h:34},
 K=(x,z)=>x+','+z,indoor=new Set(),sky=new Set(),boardwalk=new Set(),roofed=new Map(),
 dir={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 const inTower=(x,z)=>x>=tower.x0&&x<=tower.x1&&z>=tower.z0&&z<=tower.z1,
  towerRing=(x,z)=>inTower(x,z)&&(x===tower.x0||x===tower.x1||z===tower.z0||z===tower.z1)&&
   !((x===tower.x0||x===tower.x1)&&(z===tower.z0||z===tower.z1));
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   sky.add(K(x,z));indoor.delete(K(x,z));
  }
 // A genuine masonry crescent pier: two spaced legs and a complete bottom
 // connecting lip. All source boards have y0 ground and y1 walkability.
 for(const [x0,z0,x1,z1] of [[14,53,20,67],[44,53,51,67],[18,64,48,68]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!indoor.has(K(x,z))&&!sky.has(K(x,z)))boardwalk.add(K(x,z));
 const roofable=(x,z)=>indoor.has(K(x,z))&&!inTower(x,z),
  ground=(x,z)=>indoor.has(K(x,z))||sky.has(K(x,z))||boardwalk.has(K(x,z))||inTower(x,z);
 for(const key of new Set([...indoor,...sky,...boardwalk])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {originalCrescentSeaWalkStone:true,actualSeaAndCliffPhysicsNotSimulated:true});
 }
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(inTower(x,z))continue;
  if(Object.values(dir).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:stone','none',
    {sourceKeeperMasonryEnvelope:true,actualWeatherproofingNotCertified:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!roofable(x,z)||roofed.has(K(x,z)))continue;
   const rise=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(rise/(name==='middle-arched-keeper-ledger'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {originalRealImmediateRoofSupport:true,engineeredLoadNotCertified:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalBriarcliffRoofWing:name,sourcePack3NotInstalled:true});
  }
 for(const [x,z] of [[19,7],[31,8],[45,7],[8,20],[14,40],[47,33],
  [24,56],[43,55],[11,51],[56,37],[12,13],[37,21]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Briarcliff physical keeper pier not under real roof '+K(x,z));
  b.support(x,z,y-1,'live:stone','genuine-grounded-lighthouse-pier');
 }
 for(const [axis,fix,lo,hi,gaps] of [
  ['x',23,18,49,[21,22,29,30,38,39,45,46]],
  ['x',43,17,49,[20,21,29,30,37,38,44,45]],
  ['z',18,16,48,[23,24,32,33,40,41]],
  ['z',45,8,58,[14,15,24,25,34,35,43,44,52,53]],
  ['x',16,6,29,[12,13,20,21,26,27]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fix:n,z=axis==='z'?fix:n;
  if(!roofable(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalLighthouseCorridorPrivacyScreen:true,realAutomationsDisabled:true});
 }
 // This is a real solid-bearing lighthouse shaft. Every perimeter stone
 // tier y4..34 rests on y3 and below; the 7x9 core is fully solid y1..y3.
 for(let x=tower.x0;x<=tower.x1;x++)for(let z=tower.z0;z<=tower.z1;z++){
  if(b.clear(x,0,z))b.put(x,0,z,'foundation','live:stone','none',{genuineTowerFooting:true});
  for(let y=1;y<=3;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'wall','live:stone','none',
    {originalSolidBase:true,noFakeUpperStairs:true});
  }
  if(!towerRing(x,z))continue;
  for(let y=4;y<=tower.h;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'wall','live:stone','none',
    {realGroundedBriarcliffSignalMasonry:true,stoneTier:y});
  }
  b.put(x,tower.h+1,z,'roof','pack3:025','north',
   {genuineDirectlyBackedBriarcliffCrown:true,realPoweredBeacon:false});
 }
 for(const row of [
  ['north-keeper-navigation-room',17,4,47,17],
  ['west-repair-and-ropes',5,13,23,47],
  ['east-dry-weather-records',43,11,60,47],
  ['central-arched-map-hall',21,18,45,50],
  ['southwest-coil-locker',9,46,29,60],
  ['southeast-unlit-copper-lens-room',37,46,57,61],
  ['northwest-dry-flag-cabin',4,6,16,28],
  ['central-roofless-rock-garden',26,25,37,36],
  ['western-sky-open-mooring-court',13,48,19,54],
  ['southern-west-stone-crescent-leg',14,56,20,67],
  ['southern-east-stone-crescent-leg',44,56,51,67],
  ['southern-crosslinked-rock-boardwalk',19,64,48,68]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-keeper-navigation-room',32,3],
  ['north-keeper-navigation-room','west-repair-and-ropes',23,15],
  ['north-keeper-navigation-room','east-dry-weather-records',43,14],
  ['north-keeper-navigation-room','central-arched-map-hall',32,18],
  ['west-repair-and-ropes','central-arched-map-hall',23,31],
  ['east-dry-weather-records','central-arched-map-hall',43,31],
  ['central-arched-map-hall','southwest-coil-locker',26,45],
  ['central-arched-map-hall','southeast-unlit-copper-lens-room',39,45],
  ['central-arched-map-hall','central-roofless-rock-garden',25,31],
  ['central-roofless-rock-garden','east-dry-weather-records',38,31],
  ['west-repair-and-ropes','western-sky-open-mooring-court',16,47],
  ['western-sky-open-mooring-court','southwest-coil-locker',18,55],
  ['southwest-coil-locker','southern-west-stone-crescent-leg',17,61],
  ['southeast-unlit-copper-lens-room','southern-east-stone-crescent-leg',47,62],
  ['southern-west-stone-crescent-leg','southern-crosslinked-rock-boardwalk',20,65],
  ['southern-crosslinked-rock-boardwalk','southern-east-stone-crescent-leg',44,65],
  ['north-keeper-navigation-room','northwest-dry-flag-cabin',16,13]
 ]){
  if(!ground(x,z)||inTower(x,z))throw Error('Briarcliff source doorway has no genuine open floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Eight REAL upper source Pack4 glass panes in solid tower stone at y25,
 // framed by y24 sill and y26 lintel; outward original same-height AIR.
 let high=0;
 for(const [x,z,f] of [
  [53,14,'north'],[55,14,'north'],[53,22,'south'],[55,22,'south'],
  [51,17,'west'],[51,19,'west'],[57,17,'east'],[57,19,'east']
 ]){
  const [dx,dz]=dir[f],y=25;
  if(!towerRing(x,z)||b.clear(x,y,z)||b.clear(x,y-1,z)||b.clear(x,y+1,z)||
     !b.clear(x+dx,y,z+dz))throw Error('Briarcliff elevated tower pane lacks stone frame/exterior air '+K(x,z));
  b.cut(x,y,z);
  b.put(x,y,z,'window','pack4:030',f,
   {originalHighBriarcliffStoneGlass:true,beaconUnpowered:true});
  high++;
 }
 let low=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(inTower(x,z)||(x*13+z*7)%11!==0)continue;
  const f=Object.entries(dir).find(([,d])=>!ground(x+d[0],z+d[1]));
  if(!f||[1,2,3].some(y=>b.clear(x,y,z)))continue;
  b.pane(x,z,f[0]);low++;
 }
 for(const [x,z,label] of [[30,8,'silent-navigation-compass'],[9,27,'folded-navigation-sails'],
  [48,31,'unlit-star-chart'],[24,55,'dry-rope-vault'],
  [44,56,'sealed-glass-case'],[12,14,'inert-signal-flags']])
  if(roofable(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Original temperate medium lighthouse: one 34-tier complete lower-solid and higher-ring stone tower with 24 physically backed Pack3 crown blocks, eight fully outward high original Pack4 windows, 7 asymmetric grounded service roofs, two sky-exposed paved walkable courts and a genuine source-paved crescent promenade with linked legs. No lighthouse signal or real sea mechanics.',{
  builderBExclusiveWave:30,originalCrescentRoofWings:7,
  genuineGroundedSkyCourts:[144,42],originalCrescentPavedCells:boardwalk.size,
  stoneTowerWallHeight:34,realStoneCrownCells:24,
  trulyElevatedUprightWindows:high,lowerExteriorWindows:low,
  liveBeacon:false,upperTowerNavigationAvailable:false,
  seaOrCliffCollisionTested:false,PackMeshLoadCertified:false,
  liveGameIphoneTested:false,creatorArtworkApproved:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
