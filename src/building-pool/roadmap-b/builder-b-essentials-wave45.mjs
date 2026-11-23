// MYTHWROUGHT Builder B Wave45 — Graywake Double-Return Beacon Lodge.
// Original frozen B115 temperate MEDIUM lighthouse #003. One single
// continuously grounded 31-tier octagonal masonry tower with 24 real
// backed roof crown blocks and six outward stone-framed high Pack4 panes.
// Eight independent angular roof wings, three truly sky-open stone courts,
// and a genuine exterior double-return y1 walking system. Unpowered,
// unplaced source: NO sea, beacon, live Pack mesh/collision or save writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const GRAYWAKE_DOUBLE_RETURN_BEACON_ID='r1:lighthouse:temperate:medium:003';
export function buildGraywakeDoubleReturnBeaconLodge(){
 const b=sourcePlan('lighthouse','temperate','medium',3,'Graywake Double-Return Beacon Lodge',69,44,74);
 const wings=[
 ['north-map-observatory',16,3,52,18,16,'pack3:025'],
 ['west-chart-gallery',4,13,27,57,13,'pack3:026'],
 ['east-dry-lantern-shed',44,12,64,58,17,'pack3:023'],
 ['central-radial-navigator',23,19,47,60,21,'pack3:025'],
 ['southwest-closed-fog-horn',8,53,34,67,15,'pack3:026'],
 ['southeast-unlit-lens-cellar',38,53,62,67,16,'pack3:023'],
 ['northwest-unpowered-timekeeping',3,5,20,33,10,'pack3:025'],
 ['south-mid-roof-crossing',28,59,48,69,17,'pack3:025']
 ],courts=[[27,25,42,37],[11,47,20,55],[46,48,54,56]],
 tower={name:'graywake-source-octagonal-watch',x0:52,x1:58,z0:20,z1:28,h:31},
 key=(x,z)=>x+','+z,indoor=new Set(),court=new Set(),outer=new Set(),roofs=new Map(),
 faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  court.add(key(x,z));indoor.delete(key(x,z));
 }
 const towerAt=(x,z)=>x>=tower.x0&&x<=tower.x1&&z>=tower.z0&&z<=tower.z1;
 for(const [x0,z0,x1,z1] of [
  [11,61,19,72],[28,61,34,72],[50,61,58,72],
  [17,65,53,67],[17,69,53,72]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  if(!indoor.has(key(x,z))&&!court.has(key(x,z)))outer.add(key(x,z));
 const inside=(x,z)=>indoor.has(key(x,z)),ground=(x,z)=>inside(x,z)||court.has(key(x,z))||outer.has(key(x,z))||towerAt(x,z),
  roofable=(x,z)=>inside(x,z)&&!towerAt(x,z);
 for(const p of new Set([...indoor,...court,...outer])){
  const [x,z]=p.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {physicalOriginalGraywakeStonePaving:true,coastBiomeUntouched:true});
 }
 for(const p of indoor){const [x,z]=p.split(',').map(Number);
  if(towerAt(x,z))continue;
  if(Object.values(faces).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:stone','none',
    {originalLiveStoneEnvelope:true,stormLoadNotRated:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!roofable(x,z)||roofs.has(key(x,z)))continue;
   const dist=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(dist/(wing==='central-radial-navigator'?3:5));
   roofs.set(key(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {directOriginalPack3SourceBacking:true,installedMeshPending:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalGraywakeAngularRoofWing:wing,originalTrueWeatherPhysicsUnrated:true});
  }
 for(const [x,z] of [
  [20,8],[34,8],[48,8],[10,24],[18,42],[48,42],
  [25,55],[44,55],[16,60],[55,59],[35,64],[11,18]
 ]){
  const y=roofs.get(key(x,z));
  if(!y)throw Error('Graywake true ground-to-roof stone post is not directly under original roof '+key(x,z));
  b.support(x,z,y-1,'live:stone','source-grounded-original-coastal-rafter');
 }
 for(const [axis,fixed,lo,hi,holes]of [
  ['x',25,21,58,[25,26,34,35,45,46,53,54]],
  ['x',46,20,58,[25,26,34,35,45,46,54,55]],
  ['z',19,16,53,[23,24,33,34,44,45]],
  ['z',54,8,61,[15,16,27,28,40,41,52,53]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!roofable(x,z)||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:stone','none',
    {unusedLighthouseAdministrativeDivider:true});
 }
 // Every tower cell physically anchored: 7x9 stone foundation and filled
 // y1-3 lower body, complete original stone ring y4-31, directly backed
 // ring crown (24 Pack3 slabs). No invented stairs or live tower floors.
 const ring=(x,z)=>(x===tower.x0||x===tower.x1||z===tower.z0||z===tower.z1)&&
  !((x===tower.x0||x===tower.x1)&&(z===tower.z0||z===tower.z1));
 for(let x=tower.x0;x<=tower.x1;x++)for(let z=tower.z0;z<=tower.z1;z++){
  if(b.clear(x,0,z))b.put(x,0,z,'foundation','live:stone','none',{sourceGroundedBeaconFoundation:true});
  for(let y=1;y<=3;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'wall','live:stone','none',{realGraywakeSolidTowerLowerCell:true});
  }
  if(!ring(x,z))continue;
  for(let y=4;y<=tower.h;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'wall','live:stone','none',
    {originalGraywakeContinuousShaft:true,sourceStoneTier:y});
  }
  b.put(x,tower.h+1,z,'roof','pack3:025','north',
   {originalGraywakeBackedCrown:true,liveBeaconNotPowered:true});
 }
 for(const row of [
  ['north-unlit-navigation-chamber',17,4,51,17],
  ['west-coastal-map-archive',5,14,26,56],
  ['east-empty-lens-workroom',45,13,63,57],
  ['central-silent-celestial-crossing',24,20,46,59],
  ['southwest-unpowered-fog-horn',9,54,33,66],
  ['southeast-inert-glass-works',39,54,61,66],
  ['northwest-still-clock-porch',4,6,19,32],
  ['south-mid-navigation-bridge',29,60,47,68],
  ['central-sky-open-navigator-court',27,25,42,37],
  ['west-open-stone-weather-yard',11,47,20,55],
  ['east-open-dry-lantern-court',46,48,54,56],
  ['west-original-stone-approach',11,62,19,71],
  ['central-original-stone-approach',28,62,34,71],
  ['east-original-stone-approach',50,62,58,71],
  ['upper-stone-pedestrian-return',17,65,53,67],
  ['lower-stone-pedestrian-return',17,69,53,72]
 ])b.room(...row);
 for(const [from,to,x,z]of [
  ['outside','north-unlit-navigation-chamber',34,3],
  ['north-unlit-navigation-chamber','west-coastal-map-archive',25,16],
  ['north-unlit-navigation-chamber','east-empty-lens-workroom',46,16],
  ['north-unlit-navigation-chamber','central-silent-celestial-crossing',34,19],
  ['west-coastal-map-archive','central-silent-celestial-crossing',25,35],
  ['east-empty-lens-workroom','central-silent-celestial-crossing',46,35],
  ['central-silent-celestial-crossing','central-sky-open-navigator-court',26,31],
  ['central-sky-open-navigator-court','east-empty-lens-workroom',43,31],
  ['west-coastal-map-archive','west-open-stone-weather-yard',16,46],
  ['west-open-stone-weather-yard','southwest-unpowered-fog-horn',16,56],
  ['east-empty-lens-workroom','east-open-dry-lantern-court',50,47],
  ['east-open-dry-lantern-court','southeast-inert-glass-works',50,57],
  ['central-silent-celestial-crossing','southwest-unpowered-fog-horn',29,54],
  ['central-silent-celestial-crossing','southeast-inert-glass-works',42,54],
  ['central-silent-celestial-crossing','south-mid-navigation-bridge',36,61],
  ['southwest-unpowered-fog-horn','west-original-stone-approach',16,61],
  ['south-mid-navigation-bridge','central-original-stone-approach',31,61],
  ['southeast-inert-glass-works','east-original-stone-approach',54,61],
  ['west-original-stone-approach','upper-stone-pedestrian-return',19,66],
  ['upper-stone-pedestrian-return','central-original-stone-approach',31,66],
  ['central-original-stone-approach','lower-stone-pedestrian-return',31,70],
  ['lower-stone-pedestrian-return','east-original-stone-approach',53,70],
  ['north-unlit-navigation-chamber','northwest-still-clock-porch',19,13]
 ]){
  if(!ground(x,z)||towerAt(x,z))throw Error('Graywake genuine grounded portal missing at '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let high=0;
 for(const [x,z,facing] of [
  [54,20,'north'],[56,20,'north'],[54,28,'south'],[56,28,'south'],
  [52,23,'west'],[58,25,'east']
 ]){
  const y=24,[dx,dz]=faces[facing];
  if(b.clear(x,y,z)||b.clear(x,y-1,z)||b.clear(x,y+1,z)||
     !b.clear(x+dx,y,z+dz))throw Error('Graywake high stone window has invalid true frame or exterior '+key(x,z));
  b.cut(x,y,z);
  b.put(x,y,z,'window','pack4:030',facing,
   {realGraywakeHighStoneFramedPane:true,pack4PhysicalColliderPending:true});
  high++;
 }
 let lower=0,bays=0;
 for(const k of indoor){
  const [x,z]=k.split(',').map(Number);
  if(towerAt(x,z)||(x*17+z*11)%12!==0||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  const outward=Object.entries(faces).find(([,d])=>!ground(x+d[0],z+d[1]));
  if(!outward)continue;
  for(let y=2;y<=4;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',outward[0],
    {originalGraywakeThreeHighSourceGlass:true,actualPack4MountNotApproved:true});
   lower++;
  }bays++;
 }
 return b.finish('Original medium temperate Graywake lighthouse with eight physically supported angular Pack3 roof wings, genuine 31-tier fully grounded original octagonal watchshaft and 24 backed crown cells, 6 high stone-framed glass windows, 3 sky-open paved courts and 2 external return corridors. No powered beacon, sea simulation or world writes.',{
  originalBuilderBWave:45,originalSourceRoofWingCount:8,
  sourceGenuinelySkyOpenStoneCourts:[208,90,81],
  sourceExteriorDoubleReturnCells:outer.size,
  sourceOutsideReturnBands:2,originalStoneTowerHeight:31,
  genuineOriginalPack3CrownCells:24,originalHighStoneFramedPack4Windows:high,
  originalLowerUprightPack4Cells:lower,originalCompleteThreeHighGlassBays:bays,
  poweredBeacon:false,realOceanDynamics:false,
  physicalPackMeshColliderAccepted:false,creatorVisualApproved:false,
  originalIphoneHomeScreenPwaTested:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
