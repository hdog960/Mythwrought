// MYTHWROUGHT Builder B Wave17 — original Amberwell Sandglass Conservatory.
// Source-only eight-pavilion desert greenhouse with grounded stone prism tower,
// three-cell-high upright Pack4 bays and opaque independently supported Pack3 roof.
// NO crops, water, solar devices, settlements, world placement, citizens or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const AMBERWELL_SANDGLASS_ID='r1:greenhouse:desert:small:002';
export function buildAmberwellSandglassConservatory(){
 const b=sourcePlan('greenhouse','desert','small',2,'Amberwell Sandglass Conservatory',51,35,49);
 const wings=[
  ['north-open-prism-portico',14,2,34,14,13,'pack3:023'],
  ['west-clay-cooling-hall',4,7,18,29,10,'pack3:025'],
  ['east-seed-cabinet-gallery',30,8,44,32,15,'pack3:026'],
  ['central-diagonal-prism-aisle',17,13,35,35,19,'pack3:025'],
  ['southwest-dry-orchid-pods',8,31,25,45,11,'pack3:023'],
  ['southeast-desert-seed-vault',27,31,42,46,12,'pack3:026'],
  ['west-low-shaded-trellis',2,28,12,42,9,'pack3:023'],
  ['east-crest-lightwell-hall',40,10,47,22,16,'pack3:025']
 ],courts=[[22,21,28,26],[13,35,16,39]],tower=[42,12,47,20],
  K=(x,z)=>x+','+z,foot=new Set(),roofed=new Map(),
  cardinal={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z)),
  inTower=(x,z)=>x>=tower[0]&&x<=tower[2]&&z>=tower[1]&&z<=tower[3];
 for(const key of foot){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {sourceSandstoneFooting:true,originalDesertGroundUnchanged:true});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:stone','none',
    {physicallyAuthoredSandstoneFrame:true,sealNotCertified:true});
 }
 // Real 24-tier grounded solid perimeter prism tower. Upper access is NOT
 // supplied by invented stairs. Roof crown is a separate anchored Pack3 slope.
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  if(x!==tower[0]&&x!==tower[2]&&z!==tower[1]&&z!==tower[3])continue;
  for(let y=1;y<=24;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'wall','live:stone','none',
    {dryPrismTowerSource:true,upperTowerNavigation:false});
 }
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',18,13,35,[16,17,22,23,31,32]],
  ['x',31,13,35,[17,18,25,26,32,33]],
  ['z',14,14,34,[21,22,28,29]],
  ['z',32,8,43,[17,18,23,24,33,34]],
  ['x',12,28,42,[32,33,37,38]],
  ['z',29,4,18,[10,11,15,16]],
  ['x',27,31,45,[35,36,41,42]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||inTower(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {actualSandglassRoomSeparator:true,activeEnvironmentalControl:false});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||inTower(x,z)||roofed.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (wing==='central-diagonal-prism-aisle'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {authoredImmediateRoofBacking:true,snowWindLoadsNotCertified:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalOpaqueRoofWing:wing,weatherSealedApproved:false});
  }
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  const y=27+Math.floor(Math.min(x-tower[0],tower[2]-x,z-tower[1],tower[3]-z)/3);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
   {realTowerCrownBacking:true,actuallyNavigable:false});
  b.put(x,y,z,'roof','pack3:025','north',
   {originalPrismTowerCrown:true,beaconPowered:false});
 }
 for(const [x,z] of [[18,5],[28,6],[9,12],[11,23],[33,10],[37,27],
  [20,39],[32,40],[7,36],[29,18]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Amberwell original roof pier not grounded '+K(x,z));
  b.support(x,z,y-1,'live:wood','real-sandglass-roof-column');
 }
 for(const row of [
  ['north-sunshade-entrance',15,3,33,13],
  ['west-clay-cooled-orchids',5,8,17,28],
  ['east-dry-seed-catalog',31,9,43,31],
  ['central-prism-chamber',18,14,34,34],
  ['southwest-sand-dried-orchids',9,32,24,44],
  ['southeast-seed-reserve',28,32,41,45],
  ['west-low-trellis-workshop',3,29,11,41],
  ['east-prism-ground-registry',43,13,46,19]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-sunshade-entrance',25,2],
  ['north-sunshade-entrance','west-clay-cooled-orchids',17,12],
  ['north-sunshade-entrance','central-prism-chamber',25,14],
  ['north-sunshade-entrance','east-dry-seed-catalog',32,12],
  ['west-clay-cooled-orchids','central-prism-chamber',18,22],
  ['east-dry-seed-catalog','central-prism-chamber',31,25],
  ['central-prism-chamber','southwest-sand-dried-orchids',20,31],
  ['central-prism-chamber','southeast-seed-reserve',30,33],
  ['west-clay-cooled-orchids','west-low-trellis-workshop',10,29],
  ['west-low-trellis-workshop','southwest-sand-dried-orchids',12,36],
  ['southeast-seed-reserve','east-dry-seed-catalog',39,32],
  ['east-dry-seed-catalog','east-prism-ground-registry',42,15]
 ]){
  if(!has(x,z))throw Error('Amberwell authored 2-high portal missing foundation '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Only REAL lower exterior vertically mounted Pack4 glass. No fake Pack4
 // skylights, no pane suspended above open doors and no unframed upper air.
 let glassBays=0,glassCells=0;
 for(const key of foot){
  const [x,z]=key.split(',').map(Number);
  if(inTower(x,z)||(x*13+z*5)%5!==0)continue;
  const exterior=Object.entries(cardinal).find(([,d])=>!has(x+d[0],z+d[1]));
  if(!exterior||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  for(let y=2;y<=4;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',exterior[0],
    {originalThreeTierVerticalGlass:true,liveCollisionCert:false,sealCert:false});
   glassCells++;
  }
  glassBays++;
 }
 for(const [x,z,fixture] of [
  [22,7,'inert-solar-census'],[10,18,'dry-clay-cooling-stand'],
  [37,21,'paper-seed-inventory'],[18,39,'empty-specimen-pots'],
  [33,42,'unpowered-vent-toggle'],[7,34,'shade-mesh-loom']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,fixture,'pack4:059');
 return b.finish('Eight original dryland greenhouse wings around two true sky-open courts, one fully physically grounded raised closed masonry prism tower, angled distinct supported opaque Pack3 roofs and numerous genuinely upright three-cell-high Pack4 lower exterior glass bays; all botany, lighting and irrigation inert',{
  exclusiveBuilderLane:'Builder B 1B Wave17',
  originalRoofWings:8,originalOpenSandCourts:[42,20],
  originalVerticalGlassBays:glassBays,originalVerticalGlassCells:glassCells,
  upperPrismTowerStairs:false,upperPrismTowerTransparent:false,
  cropGrowthEnabled:false,waterIrrigationEnabled:false,solarPowerEnabled:false,
  activeHeatClimateControls:false,physicalPackCollisionApproved:false,
  actualWeatherSealCertified:false,liveWorldBiomeModified:false,
  actualIphoneTested:false,creatorArtworkAccepted:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
