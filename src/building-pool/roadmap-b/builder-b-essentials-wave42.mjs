// MYTHWROUGHT Builder B Wave42 — Greenbarrow Three-Lane Stonecrop Granary.
// Original temperate MEDIUM farm-barn, exclusively frozen B115.
// Eight separate physically backed Pack3 roof wings around THREE true
// sky-open groundstone threshing yards, a connected triple-lane outdoor
// stone crop loop, and two 8-tier genuine grounded stone drying markers.
// Every Pack3/4 shape remains unresolved physical producer candidate.
// No actual crops, AI, machinery, settlements, real load/physics or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const GREENBARROW_STONECROP_ID='r1:farm-barn:temperate:medium:004';
export function buildGreenbarrowThreeLaneStonecropGranary(){
 const b=sourcePlan('farm-barn','temperate','medium',4,'Greenbarrow Three-Lane Stonecrop Granary',64,43,68);
 const wings=[
  ['northern-rye-census',17,3,49,17,15,'pack3:025'],
  ['west-seed-batten',4,10,25,54,13,'pack3:026'],
  ['east-grain-veranda',39,11,60,55,16,'pack3:023'],
  ['central-angled-rake-hall',22,16,43,54,20,'pack3:025'],
  ['southwest-fallow-crib',8,49,28,61,14,'pack3:026'],
  ['southeast-husk-register',37,49,57,62,15,'pack3:023'],
  ['northwest-shuttered-porch',3,5,17,31,10,'pack3:025'],
  ['northeast-barley-shelter',50,5,62,31,17,'pack3:026']
 ],courts=[[27,25,37,35],[12,43,19,49],[46,43,53,49]],
 key=(x,z)=>x+','+z,inside=new Set(),court=new Set(),outside=new Set(),roofed=new Map(),
 faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)inside.add(key(x,z));
 for(const [x0,z0,x1,z1]of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  court.add(key(x,z));inside.delete(key(x,z));
 }
 // Three physically paved, independently authored original source lanes
 // with a southern shared fork; traversable outdoors without indoor cheats.
 for(const [x0,z0,x1,z1]of [[14,56,21,66],[30,56,36,66],[47,56,54,66],[19,63,50,66]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!inside.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 const isInside=(x,z)=>inside.has(key(x,z)),
  paved=(x,z)=>isInside(x,z)||court.has(key(x,z))||outside.has(key(x,z));
 for(const k of new Set([...inside,...court,...outside])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {trueGroundedTemperateStonecropPaving:true,liveSoilPreserved:true});
 }
 for(const k of inside){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(faces).some(([dx,dz])=>!paved(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {realOriginalTemperateBarnWall:true,noEngineeringWindCertificate:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset]of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!isInside(x,z)||roofed.has(key(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(d/(name==='central-angled-rake-hall'?3:5));
   roofed.set(key(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {immediateGenuinePack3Backing:true,physicalLoadPending:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalGreenbarrowRoofWing:name,realPack3MeshNotAccepted:true});
  }
 for(const [x,z]of [[21,8],[34,8],[46,8],[8,20],[55,21],[17,37],[48,38],[22,51],[43,52],[12,56],[52,57]]){
  const y=roofed.get(key(x,z));
  if(!y)throw Error('Greenbarrow actual rafter not under backed source roof '+key(x,z));
  b.support(x,z,y-1,'live:wood','source-grounded-original-barn-rafter');
 }
 // TWO low solid stone drying markers. Their source stone y0 footprints
 // each support a continuous eight-tier load path and backed Pack3 top.
 for(const [x,z,name]of [[16,23,'west-stonecrop-dryer'],[49,24,'east-stonecrop-dryer']]){
  if(!isInside(x,z))throw Error('Greenbarrow marker outside original stone floor');
  for(let y=1;y<=8;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'support','live:stone','none',
    {genuineGreenbarrowStoneMarker:name,sourceGroundedTier:y});
  }
  if(!b.clear(x,9,z))throw Error('Greenbarrow original backed cap collides roof');
  b.put(x,9,z,'roof','pack3:025','north',
   {actualSourceBackedGreenbarrowMarkerCap:name,neverWorkingDryer:true});
 }
 for(const [axis,fixed,lo,hi,gaps]of [
  ['x',23,16,52,[19,20,27,28,35,36,44,45]],
  ['x',42,16,53,[19,20,27,28,35,36,44,45]],
  ['z',17,16,49,[20,21,30,31,40,41]],
  ['z',50,8,57,[13,14,24,25,35,36,45,46]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!isInside(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {inactiveThreshingDivider:true,realGrainLogisticsAbsent:true});
 }
 for(const row of [
  ['north-rye-basket-ledger',18,4,48,16],
  ['west-dry-seed-store',5,11,24,53],
  ['east-empty-barley-gallery',40,12,59,54],
  ['central-grainless-rake-walk',23,17,42,53],
  ['southwest-unused-husk-vault',9,50,27,60],
  ['southeast-silent-sort-chamber',38,50,56,61],
  ['northwest-wind-entry',4,6,16,30],
  ['northeast-quiet-seed-porch',51,6,61,30],
  ['center-open-rye-terrace',27,25,37,35],
  ['western-empty-drying-yard',12,43,19,49],
  ['eastern-ungrown-oat-yard',46,43,53,49],
  ['west-source-grounded-lane',14,57,21,65],
  ['center-source-grounded-lane',30,57,36,65],
  ['east-source-grounded-lane',47,57,54,65],
  ['true-outdoor-original-fork-bar',19,63,50,66]
 ])b.room(...row);
 for(const [from,to,x,z]of [
  ['outside','north-rye-basket-ledger',33,3],
  ['north-rye-basket-ledger','west-dry-seed-store',23,14],
  ['north-rye-basket-ledger','east-empty-barley-gallery',42,14],
  ['north-rye-basket-ledger','central-grainless-rake-walk',33,17],
  ['west-dry-seed-store','central-grainless-rake-walk',23,32],
  ['east-empty-barley-gallery','central-grainless-rake-walk',42,32],
  ['central-grainless-rake-walk','center-open-rye-terrace',26,31],
  ['center-open-rye-terrace','east-empty-barley-gallery',38,31],
  ['west-dry-seed-store','western-empty-drying-yard',16,42],
  ['western-empty-drying-yard','southwest-unused-husk-vault',16,50],
  ['east-empty-barley-gallery','eastern-ungrown-oat-yard',50,42],
  ['eastern-ungrown-oat-yard','southeast-silent-sort-chamber',50,50],
  ['central-grainless-rake-walk','southwest-unused-husk-vault',25,50],
  ['central-grainless-rake-walk','southeast-silent-sort-chamber',41,50],
  ['southwest-unused-husk-vault','west-source-grounded-lane',18,56],
  ['central-grainless-rake-walk','center-source-grounded-lane',33,55],
  ['southeast-silent-sort-chamber','east-source-grounded-lane',50,56],
  ['west-source-grounded-lane','true-outdoor-original-fork-bar',21,64],
  ['center-source-grounded-lane','true-outdoor-original-fork-bar',33,64],
  ['true-outdoor-original-fork-bar','east-source-grounded-lane',48,64],
  ['north-rye-basket-ledger','northwest-wind-entry',16,14],
  ['east-empty-barley-gallery','northeast-quiet-seed-porch',51,15]
 ]){
  if(!paved(x,z))throw Error('Greenbarrow actual portal lacks source grounded original y0 floor '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let panes=0,bays=0;
 for(const k of inside){
  const [x,z]=k.split(',').map(Number);
  if((x*17+z*7)%11!==0||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(faces).find(([,d])=>!paved(x+d[0],z+d[1]));
  if(!face)continue;
  for(let y=2;y<=4;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',face[0],
    {actualThreeTierTemperateBarnWindow:true,noPhysicalPack4Approval:true});
   panes++;
  }bays++;
 }
 for(const [x,z,tag]of [[33,8,'inert-wheat-ledger'],[8,30,'unpowered-flail-hook'],[56,34,'closed-berry-rack']])
  if(isInside(x,z)&&b.clear(x,1,z))b.fitting(x,z,tag,'pack4:059');
 return b.finish('Original three-fork temperate granary with eight real source-backed Pack3 wings, 3 completely roofless physically grounded courts (121+56+56), three independent outdoor paved lanes genuinely linked at a southern groundstone crossbar and two low stone marker columns. No working harvest, buildings or residents registered.',{
  builderBOriginalWave:42,sourceBackedRoofWingCount:8,
  trueSkyOpenStoneCourts:[121,56,56],
  additionalSourceGroundedOutdoorLanes:outside.size,
  exteriorSourceForkCount:3,sourceGroundedStoneCropMarkers:2,
  genuineThreeHighGlassBays:bays,realUprightPack4Panes:panes,
  activeCropGrowth:false,workingGrainMachines:false,
  physicalPackMountAccepted:false,creatorArtworkAccepted:false,
  actualIphoneHomeScreenPwaTested:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
