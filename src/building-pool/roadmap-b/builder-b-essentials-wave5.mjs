// Builder B Wave5 original desert bathhouse. All heat, plumbing, water, basin gameplay disabled.
// No entity spawning, fluid physics, terrain change, live registration, or save writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNSHARD_BATHHOUSE_ID='r1:bathhouse:desert:small:004';
export function buildSunshardSplitWellBathhouse(){
 const b=sourcePlan('bathhouse','desert','small',4,'Sunshard Split-Well Dry Bathhouse',50,26,39);
 const masses=[
  [19,2,39,11],[2,11,23,34],[32,9,47,28],[16,27,40,37],[18,16,35,28],[6,5,20,16]
 ],court=[23,18,30,24],K=(x,z)=>x+','+z,foot=new Set(),roof=new Map();
 for(const [x0,z0,x1,z1] of masses)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(let x=court[0];x<=court[2];x++)for(let z=court[1];z<=court[3];z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const key of foot){const[x,z]=key.split(',').map(Number);b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','pack1:002');
 }
 // Dry bath routines stay fictional/disabled, but the rooms and broad walking alleys are truly partitioned.
 for(const [axis,fixed,from,to,passes] of [
  ['x',19,11,34,[15,16,24,25]],
  ['x',32,10,28,[14,15,24,25]],
  ['z',27,16,40,[20,21,33,34]],
  ['z',12,6,38,[10,11,25,26,36,37]],
  ['z',16,18,35,[24,25,32,33]]
 ])for(let q=from;q<=to;q++){
  const x=axis==='x'?fixed:q,z=axis==='z'?fixed:q;
  if(!has(x,z)||passes.includes(q))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','pack1:002');
 }
 for(const [x0,z0,x1,z1,base,label] of [
  [19,2,39,11,14,'north-open-vent-windcatcher'],
  [2,11,23,34,11,'western-solar-sandstone-sawtooth'],
  [32,9,47,28,16,'east-dry-heat-monitor'],
  [16,27,40,37,13,'south-gathering-courtyard-shade'],
  [18,16,35,28,18,'central-ventilated-ring-canopy'],
  [6,5,20,16,12,'northwest-cistern-tower-roof']
 ]){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roof.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/6);
   roof.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','north',{dryWeatherBacking:true,physicalLoadPending:true});
   b.put(x,y,z,'roof','pack3:024','north',{originalRoofFamily:label,heatAndWaterDisabled:true});
  }
 }
 for(const [x,z] of [
  [25,6],[35,6],[9,13],[12,29],[40,14],[40,24],[20,33],[34,33],[27,26],[19,19]
 ]){
  const y=roof.get(K(x,z));if(!y||!has(x,z))throw Error('Sunshard roof column off actual source mass '+K(x,z));
  b.support(x,z,y-1,'live:wood','sunshard-independently-grounded-colonnade');
 }
 for(const [x,z,side] of [
  [26,2,'north'],[37,2,'north'],[2,18,'west'],[2,29,'west'],
  [47,16,'east'],[47,24,'east'],[23,37,'south'],[37,37,'south'],[6,10,'west']
 ]){
  if(!has(x,z))throw Error('Sunshard exterior aperture outside actual footprint '+K(x,z));
  b.pane(x,z,side);
 }
 for(const r of [
  ['north-registration-gallery',20,3,38,10],
  ['west-dry-steam-alcove',3,12,18,25],
  ['west-dressing-and-storage',3,26,20,33],
  ['east-waterless-heat-gallery',33,10,46,27],
  ['central-open-air-walk',19,17,34,26],
  ['rear-community-cloister',17,28,39,36],
  ['northwest-solar-cistern-store',7,6,18,15]
 ])b.room(...r);
 for(const [from,to,x,z] of [
  ['outside','north-registration-gallery',26,2],
  ['north-registration-gallery','northwest-solar-cistern-store',19,10],
  ['north-registration-gallery','east-waterless-heat-gallery',34,11],
  ['north-registration-gallery','central-open-air-walk',27,16],
  ['west-dry-steam-alcove','central-open-air-walk',20,22],
  ['west-dry-steam-alcove','west-dressing-and-storage',12,26],
  ['central-open-air-walk','rear-community-cloister',31,28],
  ['rear-community-cloister','east-waterless-heat-gallery',36,27],
  ['northwest-solar-cistern-store','west-dry-steam-alcove',14,16]
 ]){
  if(!has(x,z))throw Error('Sunshard entrance has no real source footprint '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,label] of [
  [29,7,'inert-registration-slate'],[9,19,'dry-sauna-seating'],[11,30,'linen-storage'],
  [41,19,'inert-desert-heat-register'],[22,33,'dry-communal-dais'],[12,11,'empty-cistern-rack']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Desert dry-bath civic hall with genuinely open 56-column split-well sun court, independent six-part sandstone roof silhouette, broad human service paths, inert alcoves, roof venting and southwest clothing store; heating, water and gameplay all disabled',{
  sourceAuthor:'Builder B independently designed desert bathhouse Wave5',
  dryCistern:true,openSkyCourtColumns:56,activeHeat:false,activeWater:false,
  livestockEnabled:false,actualWorldShoreAndSlopePreflight:false,
  meshPhysicalABIApproved:false,creatorArtAccepted:false,iPhoneAccepted:false,
  schemaOneSaveWritten:false,worldPlacement:false,productionRegistered:false
 });
}
