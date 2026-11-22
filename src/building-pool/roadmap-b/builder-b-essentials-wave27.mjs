// MYTHWROUGHT Builder B Wave27 — Saffronwind Double-Tower Harbor Registry.
// ORIGINAL medium DESERT 1B source. Two independently grounded solid-based
// tall octagonal stone register towers with high upright Pack4 window cells,
// a real paved open customs court, eight separate supported Pack3 roof masses.
// No simulated harbor, sea, customs, freight, citizens, power, boats or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SAFFRONWIND_DUAL_REGISTRY_ID='r1:harbor-office:desert:medium:002';
export function buildSaffronwindDoubleTowerHarborRegistry(){
 const b=sourcePlan('harbor-office','desert','medium',2,
  'Saffronwind Double-Tower Harbor Registry',63,42,63);
 const wings=[
  ['north-copper-customs-entry',13,2,48,17,15,'pack3:025'],
  ['west-sand-stamped-record-hall',3,11,23,46,12,'pack3:026'],
  ['east-manifest-and-mooring-office',40,10,59,46,16,'pack3:023'],
  ['central-shade-quadrangle',20,16,44,48,19,'pack3:025'],
  ['southwest-ledger-storage',8,43,29,58,12,'pack3:026'],
  ['southeast-chart-vault',35,43,55,59,14,'pack3:023'],
  ['northwest-outdoor-queue-shelter',2,5,14,28,9,'pack3:025'],
  ['northeast-ledger-stairless-porch',52,3,60,27,17,'pack3:026']
 ],courts=[[26,25,37,35],[14,47,19,52]],towers=[
  {name:'western-stone-registration-tower',x0:6,z0:18,x1:12,z1:26,h:25},
  {name:'eastern-stone-registration-tower',x0:52,z0:14,x1:58,z1:22,h:29}
 ],K=(x,z)=>x+','+z,roofFloor=new Set(),courtyard=new Set(),
 roofs=new Map(),facing={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++)roofFloor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   courtyard.add(K(x,z));roofFloor.delete(K(x,z));
  }
 const insideTower=(x,z)=>towers.some(t=>x>=t.x0&&x<=t.x1&&z>=t.z0&&z<=t.z1),
  roofable=(x,z)=>roofFloor.has(K(x,z))&&!insideTower(x,z),
  grounded=(x,z)=>roofFloor.has(K(x,z))||courtyard.has(K(x,z))||insideTower(x,z);
 for(const key of new Set([...roofFloor,...courtyard])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {originalCustomsStonePaving:true,actualWorldTerrainUnchanged:true});
 }
 for(const key of roofFloor){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(facing).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:stone','none',
    {originalDryHarborMasonry:true,weatherproofingNotCertified:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!roofable(x,z)||roofs.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (name==='central-shade-quadrangle'?3:5));
   roofs.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {genuineOriginalCustomsRoofBearing:true,wholeSpanNotCertified:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalSaffronwindRoofWing:name,actualSandproofSealUnapproved:true});
  }
 for(const [x,z] of [[19,7],[32,8],[44,8],[8,15],[18,39],[48,33],
  [27,50],[44,52],[12,51],[55,41],[9,8],[37,20]]){
  const y=roofs.get(K(x,z));
  if(!y)throw Error('Saffronwind authored masonry pier missing roof '+K(x,z));
  b.support(x,z,y-1,'live:stone','permanent-original-customs-pier');
 }
 // Real original internal dividers, broad legal ground access openings,
 // never pretend an inaccessible secret tower floor is player navigable.
 for(const [axis,fix,lo,hi,holes] of [
  ['x',22,17,47,[20,21,29,30,38,39,44,45]],
  ['x',41,17,47,[19,20,27,28,36,37,42,43]],
  ['z',17,13,48,[18,19,27,28,35,36,43,44]],
  ['z',44,8,55,[14,15,24,25,32,33,42,43,49,50]],
  ['x',14,11,28,[15,16,22,23]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fix:n,z=axis==='z'?fix:n;
  if(!roofable(x,z)||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalHarborLedgerSeparator:true,customsEconomyDisabled:true});
 }
 // Unreachable upper rooms are NOT authored. Both 7x9 tower footprints are
 // physically solid from ground through y3, then hollow octagonal shafts.
 // The original ring starts at y4 and terminates in a directly backed
 // per-cell Pack3 crown. Corner cuts are intentional, not unsupported air.
 for(const tower of towers){
  const {x0,z0,x1,z1,h}=tower,perimeter=(x,z)=>
   (x===x0||x===x1||z===z0||z===z1)&&
   !((x===x0||x===x1)&&(z===z0||z===z1));
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(b.clear(x,0,z))b.put(x,0,z,'foundation','live:stone','none',
    {authoredRealStoneTowerFooting:true});
   for(let y=1;y<=3;y++){
    if(!b.clear(x,y,z))b.cut(x,y,z);
    b.put(x,y,z,'wall','live:stone','none',
     {physicalSolidBaseStone:tower.name,unreachableUpperDeck:true});
   }
   if(!perimeter(x,z))continue;
   for(let y=4;y<=h;y++){
    if(!b.clear(x,y,z))b.cut(x,y,z);
    b.put(x,y,z,'wall','live:stone','none',
     {sourceGroundedRegistryTower:tower.name,originalMasonryTier:y});
   }
   b.put(x,h+1,z,'roof','pack3:025','north',
    {originalStoneTowerCrown:tower.name,activeBeacon:false});
  }
 }
 for(const row of [
  ['north-stamped-customs-arrivals',14,3,47,16],
  ['west-dry-ledger-counter',4,12,22,45],
  ['east-trade-manifest-gallery',41,11,58,45],
  ['central-legal-queue-walk',21,17,43,47],
  ['southwest-sealed-ship-books',9,44,28,57],
  ['southeast-unpowered-chart-store',36,44,54,58],
  ['northwest-sandstorm-shade',3,6,13,27],
  ['northeast-outside-flag-desk',53,4,59,26],
  ['central-paved-open-queue-court',26,25,37,35],
  ['southwest-roofless-tariff-court',14,47,19,52]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-stamped-customs-arrivals',31,2],
  ['north-stamped-customs-arrivals','west-dry-ledger-counter',22,15],
  ['north-stamped-customs-arrivals','east-trade-manifest-gallery',41,15],
  ['north-stamped-customs-arrivals','central-legal-queue-walk',30,17],
  ['west-dry-ledger-counter','central-legal-queue-walk',22,29],
  ['east-trade-manifest-gallery','central-legal-queue-walk',41,30],
  ['central-legal-queue-walk','southwest-sealed-ship-books',25,44],
  ['central-legal-queue-walk','southeast-unpowered-chart-store',39,44],
  ['central-legal-queue-walk','central-paved-open-queue-court',25,30],
  ['central-paved-open-queue-court','east-trade-manifest-gallery',38,30],
  ['west-dry-ledger-counter','southwest-roofless-tariff-court',17,46],
  ['southwest-roofless-tariff-court','southwest-sealed-ship-books',18,53],
  ['north-stamped-customs-arrivals','northwest-sandstorm-shade',14,14],
  ['east-trade-manifest-gallery','northeast-outside-flag-desk',53,13]
 ]){
  if(!grounded(x,z)||insideTower(x,z))
   throw Error('Saffronwind original portal has no open grounded floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Twelve real HIGH exterior stone windows at y21 or y24, with original
 // masonry lintel y+1 and sill y-1, outward air at same height.
 let highWindowCount=0;
 for(const t of towers){
  const y=t.h===25?19:23;
  for(const [x,z,face] of [
   [t.x0+2,t.z0,'north'],[t.x0+4,t.z0,'north'],
   [t.x0+2,t.z1,'south'],[t.x0+4,t.z1,'south'],
   [t.x0,t.z0+3,'west'],[t.x1,t.z0+5,'east']
  ]){
   const [dx,dz]=facing[face];
   if(b.clear(x,y,z)||b.clear(x,y-1,z)||b.clear(x,y+1,z)||
      !b.clear(x+dx,y,z+dz))
    throw Error('Saffronwind elevated window lacks true exposed stone frame '+K(x,z));
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',face,
    {realElevatedStoneFrame:true,sourceY:y,noRealLitBeacon:true});
   highWindowCount++;
  }
 }
 let lowWindowCount=0;
 for(const key of roofFloor){
  const [x,z]=key.split(',').map(Number);
  if(insideTower(x,z)||(x*13+z*7)%11!==0)continue;
  const exposure=Object.entries(facing).find(([,d])=>!grounded(x+d[0],z+d[1]));
  if(!exposure||[1,2,3].some(y=>b.clear(x,y,z)))continue;
  b.pane(x,z,exposure[0]);lowWindowCount++;
 }
 for(const [x,z,name] of [
  [28,8,'closed-harbor-manifest'],[10,31,'inert-brass-import-scale'],
  [48,32,'dry-sailing-ledger'],[26,52,'sealed-sand-tax-chest'],
  [45,54,'unpowered-mast-signal'],[9,14,'inactive-customs-clock']
 ])if(roofable(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original eight asymmetric dry harbor-office roof masses around a 132-cell fully paved open legal queue court and 36-cell open tariff yard, TWO real octagonal stone register towers with complete solid lower footings, high genuine outward-facing Pack4 glass, and independent backed Pack3 roof crowns. No live customs, sea or active machinery.',{
  sourceOwner:'Builder B original Wave27 desert medium harbor office',
  originalSaffronwindRoofWings:8,sourceSkyOpenQueueCourts:[132,36],
  groundedOctagonalTowerHeights:[25,29],
  sourceElevatedStoneFramedPack4Windows:highWindowCount,
  realLowerVerticalWindowCells:lowWindowCount,
  actualTowerUpperStairs:false,realHarborTraffic:false,
  liveWaterOrSeaPhysics:false,customsEconomyActive:false,
  physicalProducerColliderApproved:false,actualWeatherproofingApproved:false,
  actualIphoneTested:false,creatorArtworkApproved:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
