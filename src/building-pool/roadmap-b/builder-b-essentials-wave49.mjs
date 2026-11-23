// MYTHWROUGHT Builder B Wave49 — Brackenmere Three-Silo Crossyard Granary.
// Original B115-only temperate MEDIUM farm-barn #003. Nine individually
// backed covered regions, three genuinely open courts, 3 wholly grounded
// dry stone grain-marker towers, and exterior three-lane stone access.
// Candidate Pack3/Pack4 meshes/collision unresolved. No active harvest,
// grain production, power, NPC AI, settlements, runtime or save writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const BRACKENMERE_THREE_SILO_ID='r1:farm-barn:temperate:medium:003';
export function buildBrackenmereThreeSiloCrossyardGranary(){
 const b=sourcePlan('farm-barn','temperate','medium',3,'Brackenmere Three-Silo Crossyard Granary',60,32,81);
 const wings=[
  ['north-receiving',18,3,44,16,14,'pack3:025'],
  ['western-dry-storage',4,11,25,45,12,'pack3:026'],
  ['eastern-grain-records',35,11,56,45,17,'pack3:023'],
  ['central-crossing-hall',23,17,38,55,21,'pack3:025'],
  ['southwest-unpowered-threshing',7,43,29,61,15,'pack3:026'],
  ['southeast-inert-bagging',32,43,54,61,17,'pack3:023'],
  ['northwest-silo-tools',3,5,18,30,12,'pack3:025'],
  ['northeast-dry-ledgers',46,5,57,30,18,'pack3:026'],
  ['south-loading-crossbeam',24,58,39,65,17,'pack3:025']
 ],courts=[
  ['north-sky-court',26,24,34,34],
  ['west-sky-court',10,44,17,52],
  ['east-sky-court',44,44,52,52]
 ],key=(x,z)=>x+','+z,
  indoor=new Set(),sky=new Set(),outer=new Set(),roofSites=new Map(),
  firstRoofByWing=new Map(),
  facings={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [,x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   sky.add(key(x,z));indoor.delete(key(x,z));
  }
 for(const [x0,x1] of [[10,19],[25,37],[44,55]])
  for(let x=x0;x<=x1;x++)for(let z=64;z<=79;z++)
   if(!indoor.has(key(x,z))&&!sky.has(key(x,z)))outer.add(key(x,z));
 for(const [x0,x1]of [[12,18],[46,52]])
  for(let x=x0;x<=x1;x++)for(let z=62;z<=65;z++)
   if(!indoor.has(key(x,z))&&!sky.has(key(x,z)))outer.add(key(x,z));
 for(let x=14;x<=51;x++)for(let z=75;z<=79;z++)
  if(!indoor.has(key(x,z))&&!sky.has(key(x,z)))outer.add(key(x,z));
 const grounded=(x,z)=>indoor.has(key(x,z))||sky.has(key(x,z))||outer.has(key(x,z));
 for(const p of new Set([...indoor,...sky,...outer])){
  const [x,z]=p.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{actualOriginalStoneGround:true,worldUnmodified:true});
 }
 for(const p of indoor){
  const [x,z]=p.split(',').map(Number);
  if(Object.values(facings).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:stone','none',
    {originalFullStoneGranaryEnvelope:true,notStructurallyRated:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=key(x,z);
   if(!indoor.has(k)||roofSites.has(k))continue;
   const depth=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(depth/(name==='central-crossing-hall'?3:5));
   roofSites.set(k,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {originalImmediatelyBackedPack3Candidate:true,physicalProducerUnapproved:true});
   b.put(x,y,z,'roof',asset,'north',
    {brackenmereActualCoveredWing:name,Pack3ApprovalUnresolved:true});
   if(!firstRoofByWing.has(name))firstRoofByWing.set(name,[x,z,y]);
  }
 // Only actual authored roof-site coordinates may own continuous posts.
 for(const [name] of wings){
  const site=firstRoofByWing.get(name);
  if(!site)throw Error('Brackenmere overlapping roof region has zero genuine cells: '+name);
  const [x,z,y]=site;
  b.support(x,z,y-1,'live:stone','grounded-Brackenmere-barn-roof-bearer-'+name);
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',22,18,56,[21,22,29,30,38,39,48,49,53,54]],
  ['x',40,17,57,[22,23,31,32,40,41,48,49,54,55]],
  ['z',19,18,46,[21,22,29,30,38,39,43,44]],
  ['z',55,11,52,[16,17,28,29,37,38,47,48]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!indoor.has(key(x,z))||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{dryOriginalGrainScreen:true,noRealProcessing:true});
 }
 const bins=[['west-solid-base-bin',15,70],['center-solid-base-bin',31,70],['east-solid-base-bin',49,70]];
 let crown=0;
 for(const [name,cx,cz] of bins)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   if(!outer.has(key(x,z))||b.clear(x,0,z))throw Error('Brackenmere stone bin not supported '+key(x,z));
   for(let y=1;y<=3;y++)b.put(x,y,z,'wall','live:stone','none',
    {physicalOriginalSolidBinLowerBody:name});
   const dx=Math.abs(x-cx),dz=Math.abs(z-cz),ring=(dx===2||dz===2)&&!(dx===2&&dz===2);
   if(!ring)continue;
   for(let y=4;y<=15;y++)b.put(x,y,z,'wall','live:stone','none',
    {sourceTrulyContinuousSiloRing:name,tier:y});
   b.put(x,16,z,'roof','pack3:025','north',
    {originalStoneBackedBinCrown:name,actualGrainVolume:false});
   crown++;
  }
 for(const row of [
  ['north-real-intake',19,4,43,15],
  ['western-dry-store',5,12,24,44],
  ['eastern-dry-ledgers',36,12,55,44],
  ['central-crosshall',24,18,37,54],
  ['southwest-unpowered-screen',8,44,28,60],
  ['southeast-empty-wagon-storage',33,44,53,60],
  ['northwest-inert-millroom',4,6,17,29],
  ['northeast-empty-bin-office',47,6,56,29],
  ['south-original-loading-house',25,59,38,64],
  ['north-sky-court',26,24,34,34],
  ['west-sky-court',10,44,17,52],
  ['east-sky-court',44,44,52,52],
  ['west-real-loading-arm',10,66,19,79],
  ['center-real-loading-arm',25,66,37,79],
  ['east-real-loading-arm',44,66,55,79],
  ['stone-exterior-cross-return',14,75,51,79]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-real-intake',30,3],
  ['north-real-intake','central-crosshall',30,17],
  ['north-real-intake','western-dry-store',22,13],
  ['north-real-intake','eastern-dry-ledgers',40,13],
  ['north-real-intake','northwest-inert-millroom',18,10],
  ['north-real-intake','northeast-empty-bin-office',46,10],
  ['central-crosshall','north-sky-court',25,28],
  ['north-sky-court','western-dry-store',25,26],
  ['north-sky-court','eastern-dry-ledgers',35,26],
  ['central-crosshall','southwest-unpowered-screen',22,48],
  ['central-crosshall','southeast-empty-wagon-storage',40,48],
  ['western-dry-store','west-sky-court',17,43],
  ['eastern-dry-ledgers','east-sky-court',49,43],
  ['southwest-unpowered-screen','west-real-loading-arm',15,62],
  ['southeast-empty-wagon-storage','east-real-loading-arm',49,62],
  ['central-crosshall','south-original-loading-house',31,57],
  ['south-original-loading-house','center-real-loading-arm',31,66],
  ['west-real-loading-arm','stone-exterior-cross-return',17,78],
  ['center-real-loading-arm','stone-exterior-cross-return',31,78],
  ['east-real-loading-arm','stone-exterior-cross-return',49,78]
 ]){
  if(!grounded(x,z))throw Error('Brackenmere portal lacks source y0 stone '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let windows=0,bays=0;
 for(const p of indoor){
  const [x,z]=p.split(',').map(Number);
  if((x*17+z*13)%12!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const facing=Object.entries(facings).find(([,v])=>!grounded(x+v[0],z+v[1]));
  if(!facing)continue;
  for(let y=2;y<=4;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',facing[0],
    {originalStoneFramedThreeHighWindow:true,realPaneColliderPending:true});
   windows++;
  }bays++;
 }
 return b.finish('Original Brackenmere medium granary has nine individually backed roof sections, three open grounded courts, three fully stone-founded and lower-solid corner-cut dry grain towers with real directly stone-backed crowns, and three connected outdoor stone loading lanes. No real farming or milling.',{
  originalBuilderBWave:49,realDistinctRoofWingCount:firstRoofByWing.size,
  trulyOpenSourceStoneCourts:[99,72,81],originalSourceOutdoorStoneCells:outer.size,
  trulyGroundedUnpoweredStoneBins:bins.length,realStoneBinVerticalHeight:15,
  originalFullyStoneBackedSiloRoofCrownCells:crown,
  actualThreeHighPack4WindowCells:windows,actualCompleteThreeHighWindows:bays,
  workingStorage:false,workingMilling:false,harvestSimulation:false,
  physicalPack3Pack4ProducerApproved:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false,
  installedIphoneHomeScreenPwaTested:false,creatorArtworkAccepted:false
 });
}
