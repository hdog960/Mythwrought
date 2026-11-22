// MYTHWROUGHT Builder B Roadmap B 1B Wave8 — original Frostwake Crown-Bridge Lighthouse.
// SOURCE-ONLY. The raised beacon is a fixed unlit geometry witness, NOT a powered lamp,
// navigable upper stair, settlement, citizen, world object, weather seal or save migration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const FROSTWAKE_CROWNBRIDGE_LIGHTHOUSE_ID='r1:lighthouse:snow:small:002';
export function buildFrostwakeCrownbridgeLighthouse(){
 const b=sourcePlan('lighthouse','snow','small',2,'Frostwake Crown-Bridge Lighthouse',38,32,41);
 const wings=[
  {name:'winter-landing',rect:[14,2,25,15],roofY:11},
  {name:'west-keepers-wing',rect:[4,11,18,29],roofY:10},
  {name:'east-chart-wing',rect:[22,11,35,28],roofY:12},
  {name:'south-storeroom-bridge',rect:[11,29,30,38],roofY:10},
  {name:'central-windbreak-cross',rect:[14,13,26,32],roofY:14},
 ];
 const courtyard=[8,19,10,21],tower=[17,16,23,24],foot=new Set(),K=(x,z)=>x+','+z;
 for(const w of wings)for(let x=w.rect[0];x<=w.rect[2];x++)
  for(let z=w.rect[1];z<=w.rect[3];z++)foot.add(K(x,z));
 for(let x=courtyard[0];x<=courtyard[2];x++)for(let z=courtyard[1];z<=courtyard[3];z++)
  foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z)),inTower=(x,z)=>
  x>=tower[0]&&x<=tower[2]&&z>=tower[1]&&z<=tower[3];
 for(const q of foot){
  const [x,z]=q.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','pack2:013','north',
    {winterExterior:true,realSnowLoadCertified:false});
 }
 // Dedicated offset beacon tower remains a TRUE vertical silhouette: supported
 // corner pier columns from ground to upper band and eight upright high windows.
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  if(!(x===tower[0]||x===tower[2]||z===tower[1]||z===tower[3]))continue;
  for(let y=1;y<=23;y++)if(b.clear(x,y,z))b.put(x,y,z,'wall','live:stone','none',
   {beaconTowerWall:true,loadCertificationPending:true});
 }
 for(const [x,z] of [[19,16],[20,24],[17,20],[23,20]])b.opening(x,z);
 // Hand-authored windbreak passages, not a fully sealed giant common room.
 for(const [axis,fixed,from,to,pass] of [
  ['z',12,15,25,[18,19,20]],
  ['x',15,14,29,[17,18,23,24,27]],
  ['x',25,14,29,[17,18,23,24,27]],
  ['z',30,15,26,[19,20,21]],
  ['x',30,18,28,[23,24]],
  ['z',27,5,17,[12,13]]
 ]){
  for(let n=from;n<=to;n++){
   const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
   if(!has(x,z)||inTower(x,z)||pass.includes(n))continue;
   for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
  }
 }
 // All source roofs (including the watch crown) have a genuine immediately
 // authored lower cell; no Pack4 window panes masquerade as horizontal tiles.
 const roofColumns=new Map();
 for(const w of wings)for(let x=w.rect[0];x<=w.rect[2];x++)
  for(let z=w.rect[1];z<=w.rect[3];z++){
   if(!has(x,z)||inTower(x,z)||roofColumns.has(K(x,z)))continue;
   const [x0,z0,x1,z1]=w.rect,
    y=w.roofY+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/5);
   roofColumns.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {sourceTimberBearing:true,realLoadApproval:false});
   b.put(x,y,z,'roof','pack3:026','north',
    {sourceWing:w.name,stormSlopeSource:true,actualSnowLoadApproved:false});
  }
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  const y=25+Math.floor(Math.min(x-tower[0],tower[2]-x,z-tower[1],tower[3]-z)/3);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
   {beaconCrownBearingSource:true,upperTowerActualAccessApproved:false});
  b.put(x,y,z,'roof','pack3:025','north',
   {stormCrownRoof:true,upperBeaconInert:true,notIlluminated:true});
 }
 // Exterior facade glass at y=2; real producer is a vertical opening pane.
 for(const [x,z,side] of [
  [18,2,'north'],[23,2,'north'],[4,18,'west'],[4,25,'west'],
  [35,18,'east'],[35,24,'east'],[16,38,'south'],[27,38,'south'],
  [11,34,'west'],[30,34,'east']
 ]){
  if(!has(x,z))throw Error('Frostwake invalid physically absent low window '+K(x,z));
  b.pane(x,z,side);
 }
 for(const [x,y,z,facing] of [
  [19,16,16,'north'],[21,16,16,'north'],
  [17,16,19,'west'],[17,16,22,'west'],
  [23,16,19,'east'],[23,16,22,'east'],
  [19,16,24,'south'],[21,16,24,'south']
 ]){
  if(b.clear(x,y,z))throw Error('Frostwake upper beacon window lacks real tower wall');
  b.cut(x,y,z);
  b.put(x,y,z,'window','pack4:030',facing,
   {verticalPack4Opening:true,inertBeaconLens:true,sourceUpperTowerWall:true,
    liveLight:false,realWindowWeatherSealApproved:false,actualWindowCollisionApproved:false});
 }
 for(const [name,x0,z0,x1,z1] of [
  ['north-windward-landing',15,3,24,12],
  ['entry-storm-door-vestibule',15,13,25,17],
  ['west-keeper-kitchen',5,13,14,26],
  ['east-charts-and-coastal-survey',26,13,34,24],
  ['ground-beacon-ring-circulation',18,17,22,23],
  ['northwest-snowcloak-nook',5,27,17,29],
  ['east-lens-spare-and-wick-store',26,25,34,28],
  ['south-winter-supply-drying-bridge',12,30,29,37]
 ])b.room(name,x0,z0,x1,z1);
 for(const [from,to,x,z] of [
  ['outside','north-windward-landing',20,2],
  ['north-windward-landing','entry-storm-door-vestibule',19,12],
  ['entry-storm-door-vestibule','west-keeper-kitchen',15,17],
  ['entry-storm-door-vestibule','east-charts-and-coastal-survey',25,17],
  ['entry-storm-door-vestibule','ground-beacon-ring-circulation',19,16],
  ['west-keeper-kitchen','northwest-snowcloak-nook',12,27],
  ['east-charts-and-coastal-survey','east-lens-spare-and-wick-store',30,24],
  ['entry-storm-door-vestibule','south-winter-supply-drying-bridge',20,30],
  ['ground-beacon-ring-circulation','south-winter-supply-drying-bridge',20,24]
 ]){
  if(!has(x,z))throw Error('Frostwake portal outside original footing '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,name] of [
  [20,7,'empty-harbor-log'],[8,16,'cold-kitchen-cabinet'],[30,19,'unlit-chart-table'],
  [20,19,'unlit-beacon-lens-model'],[15,34,'dry-crate-shelf'],[31,26,'spare-frostglass']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Hand-authored staggered six-wing coastal winter lighthouse with a tall masonry beacon crown, eight real high upright source windows, a true sky-open snowdrift alcove, shore landing, detached keeper/charts rooms, south drying bridge and genuine interior circulation; beacon NOT lit and upper tower NOT live-navigable',{
  exclusiveSourceLane:'Builder B original 1B wave8',
  originalSnowLighthouse:true,realFootprintVoidCells:9,
  raisedBeaconUnlit:true,upperTowerTraversable:false,realStaircaseInstalled:false,
  glassPhysicallyApproved:false,roofSnowWeatherCertified:false,
  liveBeaconPowered:false,playerPlacement:false,sourceMaker:false,
  liveIphoneTested:false,creatorApproved:false,saveSchema1Written:false,
  productionRegistered:false
 });
}
