// MYTHWROUGHT Builder B Wave18: Hearthspan Double-Court Winter Bathhouse.
// ORIGINAL SOURCE ONLY: no live heat, steam, water, settlements, biome edits or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const HEARTHSPAN_WINTER_BATH_ID='r1:bathhouse:snow:small:002';
export function buildHearthspanDoubleCourtWinterBathhouse(){
 const b=sourcePlan('bathhouse','snow','small',2,'Hearthspan Double-Court Winter Bathhouse',46,32,46);
 const wings=[
  ['north-frost-cloak-porch',12,2,33,13,12,'pack3:025'],
  ['west-dry-warming-gallery',3,9,18,31,10,'pack3:026'],
  ['east-inert-steam-bays',29,9,42,31,13,'pack3:025'],
  ['central-thermal-bridge',15,12,32,36,17,'pack3:023'],
  ['southwest-empty-cistern-hall',8,32,23,43,11,'pack3:026'],
  ['southeast-wool-drying',25,31,39,43,10,'pack3:025'],
  ['northwest-snowcloak-nook',2,4,12,21,8,'pack3:023']
 ],courts=[[21,21,26,26],[12,34,14,37]],chimney=[37,17],K=(x,z)=>x+','+z,
 floor=new Set(),roofed=new Map(),face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)floor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)floor.delete(K(x,z));
 const has=(x,z)=>floor.has(K(x,z)),isFlue=(x,z)=>x===chimney[0]&&z===chimney[1];
 for(const key of floor){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{originalSnowTerrainUnchanged:true});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:stone','none',
    {originalWindbreakMasonry:true,heatPerformanceUncertified:true});
 }
 // Original physical partitions with explicit two-cell pass-through intervals.
 for(const [axis,fixed,from,to,gaps] of [
  ['x',18,12,35,[15,16,23,24,30,31]],
  ['x',29,12,35,[17,18,26,27,32,33]],
  ['z',13,12,33,[17,18,23,24,29,30]],
  ['z',31,9,39,[15,16,22,23,30,31]],
  ['x',12,29,40,[32,33,37,38]],
  ['z',21,3,18,[7,8,11,12]],
  ['x',25,32,43,[35,36,39,40]]
 ])for(let n=from;n<=to;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||isFlue(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{actualBathPrivacySeparator:true});
 }
 // Seven independently pitched Pack3 roof masses, y-1 bearer authored per tile.
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||isFlue(x,z)||roofed.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (wing==='central-thermal-bridge'?3:4));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {trueRoofBearingBelow:true,snowLoadCertified:false});
   b.put(x,y,z,'roof',asset,'north',
    {originalRoofWing:wing,weatherSealApproved:false});
  }
 // Source-grounded solid, unlit, unheated chimney shaft and true separate cap.
 if(!has(...chimney))throw Error('Hearthspan chimney source foundation absent');
 b.support(chimney[0],chimney[1],24,'live:stone','unlit-grounded-winter-chimney');
 b.put(chimney[0],25,chimney[1],'roof','pack3:025','north',
  {sourceChimneyCap:true,smokeOrFlameActive:false});
 for(const [x,z] of [[16,5],[29,5],[8,14],[10,25],[35,12],[40,26],
  [17,38],[33,38],[7,17],[28,18]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Hearthspan true roof brace not under roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','snow-wing-roof-brace');
 }
 for(const r of [
  ['north-cloak-entry',13,3,32,12],
  ['west-dry-hearth-lounge',4,10,17,30],
  ['east-empty-steam-gallery',30,10,41,30],
  ['central-sheltered-bridge',16,13,31,35],
  ['southwest-empty-stone-basin',9,33,22,42],
  ['southeast-clean-wool-store',26,32,38,42],
  ['northwest-outer-boot-room',3,5,11,20]
 ])b.room(...r);
 for(const [from,to,x,z] of [
  ['outside','north-cloak-entry',24,2],
  ['north-cloak-entry','west-dry-hearth-lounge',17,12],
  ['north-cloak-entry','central-sheltered-bridge',24,13],
  ['north-cloak-entry','east-empty-steam-gallery',30,12],
  ['west-dry-hearth-lounge','central-sheltered-bridge',18,24],
  ['east-empty-steam-gallery','central-sheltered-bridge',29,25],
  ['central-sheltered-bridge','southwest-empty-stone-basin',20,32],
  ['central-sheltered-bridge','southeast-clean-wool-store',28,32],
  ['west-dry-hearth-lounge','northwest-outer-boot-room',11,19],
  ['southwest-empty-stone-basin','southeast-clean-wool-store',25,37],
  ['northwest-outer-boot-room','north-cloak-entry',12,9]
 ]){
  if(!has(x,z))throw Error('Hearthspan two-high portal has no actual footing '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Glaze only undisturbed original outward masonry, never another wing or a door.
 let windowCount=0;
 for(const key of floor){
  const [x,z]=key.split(',').map(Number),f=Object.entries(face).find(([,d])=>!has(x+d[0],z+d[1]));
  if(!f||(x*11+z*13)%13!==0||b.clear(x,1,z)||b.clear(x,2,z)||b.clear(x,3,z))continue;
  b.pane(x,z,f[0]);windowCount++;
 }
 for(const [x,z,name] of [
  [23,8,'unlit-wool-drying-shelf'],[9,18,'inert-stone-hearth'],
  [37,23,'dry-basin-trough'],[18,39,'folded-wool-cabinet'],
  [33,38,'unpowered-vent-control'],[8,13,'winter-cloak-pegs']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Seven original staggered winter spa wings, two physically unfilled cold courts, connected sheltered source bridge, grounded 24-cell unlit chimney and original windowed stone windbreaks. No water, steam, heat or healing gameplay.',{
  originalOwner:'Builder B 1B Wave18',originalRoofWings:7,openCourts:[36,12],
  chimneyTrueGroundedTiers:24,originalFacadeWindows:windowCount,
  sourceBathWaterActive:false,steamActive:false,heatingActive:false,
  actualSnowBiomeModified:false,realWeatherSealApproved:false,
  liveProducerCollisionCertified:false,realIphoneAccepted:false,
  creatorArtworkApproved:false,worldPlacement:false,productionRegistered:false,
  saveSchema1Written:false
 });
}
