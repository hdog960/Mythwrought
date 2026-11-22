// MYTHWROUGHT Builder B 1B Wave12: original Sunspoke Forked-Shelter Corral Stables.
// SOURCE ONLY: no actual animals, routes, settlements, water, power, game world or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNSPOKE_FORKED_CORRAL_ID='r1:stable:desert:small:002';
export function buildSunspokeForkedShelterCorralStables(){
 const b=sourcePlan('stable','desert','small',2,'Sunspoke Forked-Shelter Corral Stables',47,28,47);
 const wings=[
  ['north-saddle-trade',16,2,35,13,12,'pack3:023'],
  ['west-rope-hoofsmith',3,8,18,28,10,'pack3:025'],
  ['east-shaded-stalls',34,11,43,33,13,'pack3:023'],
  ['central-forked-harness',16,12,36,33,17,'pack3:025'],
  ['southwest-grain-store',6,32,23,43,11,'pack3:023'],
  ['southeast-separate-stalls',25,30,39,44,9,'pack3:023'],
  ['west-low-tack-booth',2,29,11,39,8,'pack3:025']
 ],courts=[[21,19,26,24],[13,34,16,37]],
 K=(x,z)=>x+','+z,foot=new Set(),roofMap=new Map();
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const v of foot){
  const [x,z]=v.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{biomeTerrainUnverified:true});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood','none',
    {handBuiltDesertShade:true,animalCollisionUnverified:true});
 }
 for(const [axis,fixed,from,to,gaps] of [
  ['x',18,12,33,[15,16,20,21,28,29]],['x',34,12,34,[16,17,25,26,30,31]],
  ['z',13,16,35,[23,24,30,31]],['z',32,15,40,[19,20,26,27,34,35]],
  ['x',11,29,42,[33,34,38,39]],['z',29,6,22,[12,13,17,18]],
  ['x',27,31,42,[35,36]]
 ])for(let n=from;n<=to;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{sourceStallDivider:true,liveHorseAI:false});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofMap.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (name==='central-forked-harness'?3:5));
   roofMap.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {realImmediateRoofBacking:true,roofLoadApproved:false});
   b.put(x,y,z,'roof',asset,'north',{originalRoofWing:name,actualWeatherSeal:false});
  }
 for(const [x,z] of [
  [20,5],[29,5],[8,12],[12,21],[38,18],[40,28],
  [19,38],[31,38],[8,36],[16,30],[30,14]
 ]){
  const y=roofMap.get(K(x,z));
  if(!y)throw Error('Sunspoke grounding post not below a real roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','original-desert-roof-pier');
 }
 const faced={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [x,z,facing] of [
  [22,2,'north'],[31,2,'north'],[3,16,'west'],[3,25,'west'],
  [43,17,'east'],[43,28,'east'],[12,43,'south'],[33,44,'south'],
  [2,35,'west'],[39,41,'east'],[2,37,'west'],[16,2,'north']
 ]){
  const [dx,dz]=faced[facing];
  if(!has(x,z)||has(x+dx,z+dz))
   throw Error('Sunspoke vertical pane faces a false exterior '+K(x,z)+' '+facing);
  b.pane(x,z,facing);
 }
 for(const room of [
  ['north-saddle-traders',17,3,34,12],['west-hoofsmith',4,9,17,27],
  ['east-shaded-stall-service',35,12,42,32],['forked-harness-crossing',17,13,35,31],
  ['southwest-grain-drying',7,33,22,42],['southeast-inert-quarantine',26,31,38,43],
  ['west-low-tack-booth',3,30,10,38],['east-gear-rigging',35,14,42,25]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-saddle-traders',26,2],
  ['north-saddle-traders','west-hoofsmith',17,12],
  ['north-saddle-traders','forked-harness-crossing',26,13],
  ['north-saddle-traders','east-shaded-stall-service',35,12],
  ['west-hoofsmith','west-low-tack-booth',10,29],
  ['west-hoofsmith','forked-harness-crossing',18,24],
  ['east-shaded-stall-service','east-gear-rigging',39,22],
  ['east-shaded-stall-service','forked-harness-crossing',34,26],
  ['forked-harness-crossing','southwest-grain-drying',19,32],
  ['forked-harness-crossing','southeast-inert-quarantine',30,32],
  ['southwest-grain-drying','west-low-tack-booth',11,35],
  ['southeast-inert-quarantine','east-shaded-stall-service',38,32]
 ]){
  if(!has(x,z))throw Error('Sunspoke portal lacks original ground '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,name] of [
  [23,6,'empty-tack-ledger'],[9,18,'inert-hoof-workbench'],
  [39,18,'vacant-stall-marker'],[12,38,'unfilled-grain-trough'],
  [31,37,'unpowered-care-cabinet'],[8,34,'spare-saddle-frames']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original asymmetrical seven-wing desert stable with forked interior harness crossing, 36-column open sun paddock, distinct 16-column south court, real physical-bearing sloped Pack3 roofs, upright Pack4 openings and unoccupied roofed stall rooms',{
  owner:'Builder B original 1B Wave12',originalRoofWings:7,
  openSunPaddockColumns:36,openSaddlingCourtColumns:16,
  liveHorses:false,liveAnimalMovement:false,actualWater:false,
  terrainSlopeVerified:false,realWeatherProof:false,packProducerAccepted:false,
  actualIphoneTested:false,creatorArtAccepted:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
