// MYTHWROUGHT Builder B Wave39 — Coppersalt Triple Dry-Slip Lodge.
// ORIGINAL FROZEN B115 LARGE desert fishing-lodge, source only.
// Three individually paved open-air sandstone courts; a genuinely
// grounded triple-fork dry-slip exterior walking network; one original
// continuous fully stone-grounded 28-tier octagonal watch-signal shaft,
// ten supported distinct Pack3 roof wings, six high source-framed Pack4
// windows and complete three-high outward glass bays placed AFTER all
// passage cuts. NO sea/water/fish/boats, livelihood AI, Pack3/4 real
// collider certification, placement, weather, saves or original iPhone.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const COPPERSALT_TRIPLE_DRY_SLIP_ID='r1:fishing-lodge:desert:large:004';
export function buildCoppersaltTripleDrySlipLodge(){
 const b=sourcePlan('fishing-lodge','desert','large',4,
  'Coppersalt Triple Dry-Slip Lodge',80,49,80);
 const wings=[
 ['north-sealed-net-ledger',18,3,61,20,16,'pack3:025'],
 ['west-sun-tanned-net-store',4,12,31,60,13,'pack3:026'],
 ['east-spare-boat-office',48,11,74,61,19,'pack3:023'],
 ['central-arched-dry-slip',24,18,55,65,23,'pack3:025'],
 ['southwest-idle-catch-count',7,55,36,73,15,'pack3:026'],
 ['southeast-unused-salt-crate',44,54,73,73,17,'pack3:023'],
 ['northwest-shaded-dock-record',3,5,21,36,10,'pack3:025'],
 ['northeast-fishless-sun-gallery',65,5,76,35,19,'pack3:026'],
 ['southern-quiet-stone-plinth',28,62,53,74,16,'pack3:025'],
 ['western-arched-net-room',2,42,17,72,11,'pack3:026']
 ],courts=[[30,28,48,42],[13,52,23,62],[56,52,67,62]],
 tower={name:'coppersalt-north-dry-signal',x0:66,x1:72,z0:24,z1:32,h:28},
 K=(x,z)=>x+','+z,
 indoor=new Set(),courtyard=new Set(),slips=new Set(),roofs=new Map(),
 sides={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  courtyard.add(K(x,z));indoor.delete(K(x,z));
 }
 const towerAt=(x,z)=>x>=tower.x0&&x<=tower.x1&&z>=tower.z0&&z<=tower.z1;
 // Triple genuine external original stone dry-slips with a shared
 // solid y0 transverse apron. No real waves/ice are modeled.
 for(const [x0,z0,x1,z1] of [
  [13,69,22,78],[32,69,39,78],[57,69,66,78],[20,75,60,78]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  if(!indoor.has(K(x,z))&&!courtyard.has(K(x,z)))slips.add(K(x,z));
 const enclosed=(x,z)=>indoor.has(K(x,z)),
  ground=(x,z)=>enclosed(x,z)||courtyard.has(K(x,z))||slips.has(K(x,z))||towerAt(x,z),
  roofable=(x,z)=>enclosed(x,z)&&!towerAt(x,z);
 for(const key of new Set([...indoor,...courtyard,...slips])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {actualOriginalDrySlipGround:true,liveWaterAndFishNotSimulated:true});
 }
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(towerAt(x,z))continue;
  if(Object.values(sides).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:stone','none',
    {sourceFishingLodgeStoneEnvelope:true,desertWeatherproofingUnknown:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!roofable(x,z)||roofs.has(K(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(wing==='central-arched-dry-slip'?3:5));
   roofs.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {sourceOriginalRoofYMinusOneStoneBearing:true,loadSpansNotPhysicallyRated:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalCoppersaltRoofWing:wing,realInstalledMeshNotCertified:true});
  }
 for(const [x,z] of [
  [23,8],[41,8],[57,8],[10,25],[20,47],[57,43],
  [30,61],[49,62],[12,62],[69,39],[16,17],
  [34,21],[47,22],[33,70],[50,70],[8,54]
 ]){
  const y=roofs.get(K(x,z));
  if(!y)throw Error('Coppersalt original continuous stone supporting bent not below authentic roof '+K(x,z));
  b.support(x,z,y-1,'live:stone','fully-grounded-original-pack3-roof-bearing-column');
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',28,20,62,[22,23,33,34,43,44,53,54]],
  ['x',52,19,62,[22,23,34,35,44,45,54,55]],
  ['z',20,18,60,[25,26,36,37,48,49,57,58]],
  ['z',57,8,72,[17,18,27,28,39,40,49,50,62,63]],
  ['x',18,7,36,[14,15,25,26,32,33]],
  ['x',68,11,36,[17,18,27,28,34,35]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!roofable(x,z)||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalInertFishingNetRack:true,actualFishingAIInactive:true});
 }
 // A FULL 7x9 lower-solid stone tower core, true original perimeter
 // wall at EVERY tier and 24 immediately source-backed crown caps.
 const rim=(x,z)=>(x===tower.x0||x===tower.x1||z===tower.z0||z===tower.z1)&&
  !((x===tower.x0||x===tower.x1)&&(z===tower.z0||z===tower.z1));
 for(let x=tower.x0;x<=tower.x1;x++)for(let z=tower.z0;z<=tower.z1;z++){
  if(b.clear(x,0,z))b.put(x,0,z,'foundation','live:stone','none',
   {originalGroundedDryLookoutFooting:true});
  for(let y=1;y<=3;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'wall','live:stone','none',
    {actualSolidStoneDrySignalBase:true,upperTowerStairsNotAuthorized:true});
  }
  if(!rim(x,z))continue;
  for(let y=4;y<=tower.h;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'wall','live:stone','none',
    {originalRealCoppersaltTowerWall:true,stoneTier:y});
  }
  b.put(x,tower.h+1,z,'roof','pack3:025','north',
   {originalDirectlyBackedCoppersaltCrown:true,lightSignalDisabled:true});
 }
 for(const room of [
  ['north-sealed-navigation-net-desk',19,4,60,19],
  ['west-quiet-net-storage',5,13,30,59],
  ['east-waterless-slip-office',49,12,73,60],
  ['center-arched-net-concourse',25,19,54,64],
  ['southwest-inert-fishing-gear-vault',8,56,35,72],
  ['southeast-sealed-copper-crate',45,55,72,72],
  ['northwest-fishless-quay-porch',4,6,20,35],
  ['northeast-unlit-sun-observatory',66,6,75,34],
  ['south-stone-arch-gallery',29,63,52,73],
  ['western-empty-dry-net-hall',3,43,16,71],
  ['center-open-fishless-stone-court',30,28,48,42],
  ['west-open-net-airing-court',13,52,23,62],
  ['east-open-desert-dry-stone-court',56,52,67,62],
  ['western-grounded-sand-slip',13,70,22,77],
  ['central-grounded-sand-slip',32,70,39,77],
  ['eastern-grounded-sand-slip',57,70,66,77],
  ['southern-original-dry-slip-crosspath',20,75,60,78]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-sealed-navigation-net-desk',40,3],
  ['north-sealed-navigation-net-desk','west-quiet-net-storage',28,17],
  ['north-sealed-navigation-net-desk','east-waterless-slip-office',52,17],
  ['north-sealed-navigation-net-desk','center-arched-net-concourse',40,20],
  ['west-quiet-net-storage','center-arched-net-concourse',28,35],
  ['east-waterless-slip-office','center-arched-net-concourse',52,35],
  ['center-arched-net-concourse','southwest-inert-fishing-gear-vault',32,57],
  ['center-arched-net-concourse','southeast-sealed-copper-crate',48,57],
  ['center-arched-net-concourse','south-stone-arch-gallery',39,64],
  ['center-arched-net-concourse','center-open-fishless-stone-court',29,35],
  ['center-open-fishless-stone-court','east-waterless-slip-office',49,35],
  ['west-quiet-net-storage','west-open-net-airing-court',18,51],
  ['west-open-net-airing-court','southwest-inert-fishing-gear-vault',20,63],
  ['east-waterless-slip-office','east-open-desert-dry-stone-court',61,51],
  ['east-open-desert-dry-stone-court','southeast-sealed-copper-crate',62,63],
  ['southwest-inert-fishing-gear-vault','western-grounded-sand-slip',18,69],
  ['south-stone-arch-gallery','central-grounded-sand-slip',35,69],
  ['southeast-sealed-copper-crate','eastern-grounded-sand-slip',61,69],
  ['western-grounded-sand-slip','southern-original-dry-slip-crosspath',22,76],
  ['central-grounded-sand-slip','southern-original-dry-slip-crosspath',36,76],
  ['southern-original-dry-slip-crosspath','eastern-grounded-sand-slip',59,76],
  ['north-sealed-navigation-net-desk','northwest-fishless-quay-porch',20,16],
  ['east-waterless-slip-office','northeast-unlit-sun-observatory',68,18],
  ['west-quiet-net-storage','western-empty-dry-net-hall',16,46]
 ]){
  if(!ground(x,z)||towerAt(x,z))throw Error('Coppersalt original source portal lacks grounded y0 walk '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // SIX real high tower windows, y-1 stone sill and y+1 lintel.
 let high=0;
 for(const [x,z,orientation] of [
  [tower.x0+2,tower.z0,'north'],[tower.x0+4,tower.z0,'north'],
  [tower.x0+2,tower.z1,'south'],[tower.x0+4,tower.z1,'south'],
  [tower.x0,tower.z0+3,'west'],[tower.x1,tower.z0+5,'east']
 ]){
  const y=23,[dx,dz]=sides[orientation];
  if(b.clear(x,y,z)||b.clear(x,y-1,z)||b.clear(x,y+1,z)||
     !b.clear(x+dx,y,z+dz))
   throw Error('Coppersalt real high stone window has ungrounded aperture '+K(x,z));
  b.cut(x,y,z);
  b.put(x,y,z,'window','pack4:030',orientation,
   {actualHighCoppersaltStoneGlass:true,physicalPackMountNotCertified:true});
  high++;
 }
 // Triplet Pack4 source windows after all openings, real y1 stone sill,
 // y2..4 upright glass and y5 stone lintel, outward to source AIR.
 let panes=0,glassBays=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(towerAt(x,z)||(x*17+z*11)%12!==0)continue;
  const external=Object.entries(sides).find(([,d])=>!ground(x+d[0],z+d[1]));
  if(!external||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3,4]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',external[0],
    {authenticThreeTierFishingLodgeGlass:true,noRealPackColliderAssertion:true});
   panes++;
  }glassBays++;
 }
 for(const [x,z,label] of [[40,8,'inactive-fishing-record'],[11,34,'dry-net-binder'],
  [60,42,'unlit-harbor-ledger'],[31,64,'empty-salt-count'],
  [51,64,'coiled-dry-rope'],[74,16,'silent-copper-sextant']])
  if(roofable(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Large ORIGINAL desert fishing lodge with ten authentic immediate-backed Pack3 roof wings, three independent actual paved sky-open dry courts (285+121+132), three genuinely connected unroofed stone dry slips, one continuous 28-tier grounded octagonal lookout tower with 24 directly backed Pack3 caps and six original high windows, plus upright three-high Pack4 glazing with source frames. No live sea, fishing or boats.',{
  originalBuilderBOnlyWave:39,authenticSupportedRoofWings:10,
  realPavedSkyOpenCourts:[285,121,132],
  unroofedTripleDrySlipCells:slips.size,sourceGroundedDrySlipBranches:3,
  originalStoneTowerHeight:28,originalBackedCrownCells:24,
  originalHighStoneFramedGlass:high,lowerSourceUprightGlassCells:panes,
  fullThreeHighGlassBays:glassBays,
  liveFishingOrFish:false,actualBoatsOrSea:false,
  originalSandWeatherSafetyApproved:false,actualPackMeshColliderCertified:false,
  liveMobOrCitizenJobs:false,realIphonePwaAccepted:false,
  originalWorldTerrainModified:false,creatorArtAccepted:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
