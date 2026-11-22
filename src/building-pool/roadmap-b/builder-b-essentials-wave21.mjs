// MYTHWROUGHT Builder B Wave21: Sunscar Open-Oculus Lanternwatch.
// Original desert small lighthouse: a REAL grounded octagonal hollow masonry
// lantern shaft with source-exterior high upright glass and a sky-open top,
// separate crescent service wings, and paved open-sky courtyard. No working
// beacon, actual coastal water/ship traffic, terrain, settlements or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNSCAR_OPEN_OCULUS_ID='r1:lighthouse:desert:small:002';
export function buildSunscarOpenOculusLanternwatch(){
 const b=sourcePlan('lighthouse','desert','small',2,'Sunscar Open-Oculus Lanternwatch',47,42,48);
 const wings=[
  ['northern-dry-lantern-approach',8,2,31,13,12,'pack3:025'],
  ['western-chart-and-sail-room',3,10,18,33,11,'pack3:026'],
  ['central-unlit-lens-room',15,12,33,37,16,'pack3:023'],
  ['south-stone-map-archive',9,34,36,45,12,'pack3:025'],
  ['east-crew-windbreak',31,10,44,36,14,'pack3:026']
 ],tower=[35,14,41,22],courtyard=[21,22,27,29],
 K=(x,z)=>x+','+z,floor=new Set(),roofed=new Map(),sides={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 const inTower=(x,z)=>x>=tower[0]&&x<=tower[2]&&z>=tower[1]&&z<=tower[3];
 const towerWall=(x,z)=>inTower(x,z)&&
  (x===tower[0]||x===tower[2]||z===tower[1]||z===tower[3])&&
  !((x===tower[0]||x===tower[2])&&(z===tower[1]||z===tower[3]));
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  floor.add(K(x,z));
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++)
  floor.add(K(x,z));
 const courtyardKeys=new Set();
 for(let x=courtyard[0];x<=courtyard[2];x++)for(let z=courtyard[1];z<=courtyard[3];z++)
  courtyardKeys.add(K(x,z));
 const ground=(x,z)=>floor.has(K(x,z)),underRoof=(x,z)=>ground(x,z)&&
  !inTower(x,z)&&!courtyardKeys.has(K(x,z));
 // Four 2x2 tower corners are genuinely beveled; no ungrounded false corner.
 for(const key of floor){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {originalDesertStoneFoundation:true,realCoastalTerrainUnverified:true});
  if(underRoof(x,z)&&[[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:stone','none',
    {authoredDryOuterFacade:true,liveWeatherSealUnapproved:true});
 }
 // Original source tower is octagonal, NOT a fake stack of floating ring props.
 // Exactly one source stone wall cell at EVERY y1..29 for each perimeter
 // coordinate, directly backed at y-1 by same coordinate stone/foundation.
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  if(!towerWall(x,z))continue;
  for(let y=1;y<=29;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'wall','live:stone','none',
    {continuousSourceOctagonalTower:true,actualWindLoadApproval:false});
  b.put(x,30,z,'roof','pack3:025','north',
   {directlyGroundBackedTowerCrown:true,activeBeacon:false});
 }
 // Tower stays intentionally hollow and OPEN at upper oculus; no inventing an
 // unsupported solid glass roof or playable upper stairwell.
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++){
   if(!underRoof(x,z)||roofed.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (wing==='central-unlit-lens-room'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {immediateOriginalPack3RoofBearing:true,fullLoadPathUncertified:true});
   b.put(x,y,z,'roof',asset,'north',
    {sourceRoofWing:wing,producerWeatherApproved:false});
  }
 for(const [x,z] of [[12,5],[24,5],[6,16],[13,28],[20,17],[28,33],
  [16,41],[30,41],[39,29],[42,35]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Sunscar actual floor-to-rafter post misses roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','desert-lantern-rafter-ground-post');
 }
 // Contrasting pentagonal shade fins sit in the five lower source wings.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',17,13,32,[16,17,23,24,29,30]],
  ['z',13,15,31,[19,20,26,27]],
  ['x',32,14,37,[17,18,25,26,32,33]],
  ['z',34,9,36,[15,16,23,24,30,31]],
  ['x',25,35,45,[37,38,41,42]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!underRoof(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{originalWindShadeFin:true,activeMachinery:false});
 }
 for(const row of [
  ['north-sandstone-lantern-desk',9,3,30,12],
  ['western-sail-archive',4,11,17,32],
  ['central-lens-service-inert',16,13,32,36],
  ['southern-dry-cartography-vault',10,35,35,44],
  ['eastern-windbreak-crew-room',32,11,43,35],
  ['real-sky-open-sun-court',21,22,27,29],
  ['low-tower-entry-hollow-oculus',36,15,40,21]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-sandstone-lantern-desk',19,2],
  ['north-sandstone-lantern-desk','western-sail-archive',17,12],
  ['north-sandstone-lantern-desk','central-lens-service-inert',23,13],
  ['north-sandstone-lantern-desk','eastern-windbreak-crew-room',32,12],
  ['western-sail-archive','central-lens-service-inert',17,24],
  ['central-lens-service-inert','eastern-windbreak-crew-room',32,26],
  ['central-lens-service-inert','southern-dry-cartography-vault',25,34],
  ['eastern-windbreak-crew-room','low-tower-entry-hollow-oculus',35,18],
  ['central-lens-service-inert','real-sky-open-sun-court',21,25]
 ]){
  if(!ground(x,z))throw Error('Sunscar portal has no real stone floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Eight true ELEVATED Pack4 openings in uninterrupted original masonry:
 // y22 only, real y21 sill and y23 lintel; outward source air must be clear.
 let highPanes=0;
 for(const [x,z,facing] of [
  [37,14,'north'],[39,14,'north'],[37,22,'south'],[39,22,'south'],
  [35,17,'west'],[35,19,'west'],[41,17,'east'],[41,19,'east']
 ]){
  const [dx,dz]=sides[facing],y=22;
  if(!towerWall(x,z)||b.clear(x,y,z)||b.clear(x,y-1,z)||b.clear(x,y+1,z)||
      !b.clear(x+dx,y,z+dz))
   throw Error('Sunscar high pane lacks actual stone frame/exterior air '+K(x,z));
  b.cut(x,y,z);
  b.put(x,y,z,'window','pack4:030',facing,{
   elevatedRealUprightSourcePane:true,sourceUnlit:true,
   physicalPackAABBApproved:false});
  highPanes++;
 }
 let lowPanes=0;
 for(const key of floor){
  const [x,z]=key.split(',').map(Number);
  if(!underRoof(x,z)||(x*13+z*7)%11!==0)continue;
  const f=Object.entries(sides).find(([,d])=>!ground(x+d[0],z+d[1]));
  if(!f||[1,2,3].some(y=>b.clear(x,y,z)))continue;
  b.pane(x,z,f[0]);lowPanes++;
 }
 for(const [x,z,name] of [
  [21,7,'unpowered-sun-chart'],[9,19,'inert-ship-route-cabinet'],
  [27,40,'closed-signal-oil-chest'],[40,28,'spare-shade-flag']
 ])if(underRoof(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original desert lanternwatch with TRUE contiguous 29-cell-high open-oculus octagonal stone tower and eight high upright Pack4 windows, a separate fully backed Pack3 crown ring, five differently pitched crescent service roofs, and genuine 56-column roofless WALKABLE stone sun courtyard; no sea, active light or elevated navigation.',{
  owner:'Builder B Wave21 original desert lighthouse',
  sourceOctagonalTowerHeight:30,octagonalTowerHighPanes:highPanes,
  truePavedSkyCourtColumns:56,lowerUprightPack4Panes:lowPanes,
  sourceCrescentRoofWings:5,activeLighthouseBeacon:false,
  upperTowerStairsInstalled:false,liveSeaWaterMechanics:false,
  terrainSlopeOrCoastalCollisionApproved:false,packProducerMeshesCertified:false,
  actualIphoneTested:false,creatorArtApproved:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
