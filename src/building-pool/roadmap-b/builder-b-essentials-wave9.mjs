// MYTHWROUGHT Builder B Roadmap B 1B Wave9 — original Saltreach Tidal Lantern Station.
// SOURCE-ONLY candidate: no beacon power, terrain/shoreline claim, stairs, inhabitants,
// glass weather seal, live collision, saves, world placement or production registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SALTREACH_TIDAL_LANTERN_ID='r1:lighthouse:temperate:small:002';
export function buildSaltreachTidalLanternStation(){
 const b=sourcePlan('lighthouse','temperate','small',2,'Saltreach Tidal Lantern Station',44,35,44);
 const wings=[
  {name:'north-chart-entry',r:[16,3,34,13],roofY:12},
  {name:'west-boatwork-porch',r:[4,5,17,16],roofY:9},
  {name:'east-navigation-house',r:[29,12,41,30],roofY:11},
  {name:'south-drying-and-supply',r:[16,30,37,41],roofY:10},
  {name:'central-watch-causeway',r:[15,12,31,33],roofY:15},
  {name:'west-net-drying-yard',r:[3,21,18,39],roofY:10}
 ];
 const skyCourt=[8,25,11,28], tower=[21,15,28,23],
  K=(x,z)=>x+','+z,ground=new Set(),roofed=new Set();
 for(const {r:[x0,z0,x1,z1]} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)ground.add(K(x,z));
 for(let x=skyCourt[0];x<=skyCourt[2];x++)for(let z=skyCourt[1];z<=skyCourt[3];z++)
  ground.delete(K(x,z));
 const has=(x,z)=>ground.has(K(x,z)),inTower=(x,z)=>
  x>=tower[0]&&x<=tower[2]&&z>=tower[1]&&z<=tower[3];
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood','none',
    {saltWindCladding:true,shoreFoundationsUnverified:true});
 }
 // Offset tall stone beacon drum, with a physically hollow, grounded base.
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  if(x!==tower[0]&&x!==tower[2]&&z!==tower[1]&&z!==tower[3])continue;
  for(let y=1;y<=27;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'wall','live:stone','none',
    {lanternTowerSource:true,actualStairOrLoadCertification:false});
 }
 // Four full-height lower entrances into the watch drum; no phantom stairs.
 for(const [x,z] of [[24,15],[28,19],[24,23],[21,19]])b.opening(x,z);
 // Physical dividing walls have authored two-cell open gaps for circulation.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['z',13,16,33,[23,24,25]],
  ['x',18,14,33,[18,19,27,28]],
  ['x',31,13,32,[18,19,27,28]],
  ['z',30,16,37,[24,25,26]],
  ['x',14,22,39,[29,30,31]],
  ['z',23,31,40,[35,36]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||inTower(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{sourcePassageDivider:true});
 }
 // Each roof cell is supported by a distinct immediately lower authored cell.
 // Pack3 is a roofing source; actual weather sealing remains unapproved.
 for(const {name,r:[x0,z0,x1,z1],roofY} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||inTower(x,z)||roofed.has(K(x,z)))continue;
   const rise=Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/4);
   const y=roofY+rise;
   roofed.add(K(x,z));
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {sourceRoofBearing:true,loadCertified:false});
   b.put(x,y,z,'roof','pack3:026','north',
    {roofWing:name,sourceOnly:true,realWindOrWaterSeal:false});
  }
 // High separate tower cap has literal supports and no glass roof impostors.
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  const y=29+Math.floor(Math.min(x-tower[0],tower[2]-x,z-tower[1],tower[3]-z)/4);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
   {upperCrownSourceBearing:true,upperTowerNavigable:false});
  b.put(x,y,z,'roof','pack3:025','north',
   {stoneLanternCrown:true,beaconUnlit:true,sourceOnly:true});
 }
 for(const [x,z,side] of [
  [22,3,'north'],[29,3,'north'],[4,10,'west'],[3,28,'west'],[3,35,'west'],
  [41,19,'east'],[41,27,'east'],[22,41,'south'],[31,41,'south'],[37,40,'east']
 ]){
  if(!has(x,z)||!b.clear(x+({east:1,west:-1,north:0,south:0})[side],0,
   z+({south:1,north:-1,east:0,west:0})[side]))
   throw Error('Saltreach window lacks exterior daylight footprint: '+K(x,z)+' '+side);
  b.pane(x,z,side);
 }
 // Eight upright Pack4 source openings at the real, high masonry lantern;
 // no transparent horizontal roof claims or live beacon mechanics.
 for(const [x,y,z,side] of [
  [23,18,15,'north'],[26,18,15,'north'],[21,18,17,'west'],[21,18,21,'west'],
  [28,18,17,'east'],[28,18,21,'east'],[23,18,23,'south'],[26,18,23,'south']
 ]){
  if(b.clear(x,y,z))throw Error('Saltreach glass missing real lantern wall '+x+','+y+','+z);
  b.cut(x,y,z);
  b.put(x,y,z,'window','pack4:030',side,
   {highUprightPack4Pane:true,lanternUnlit:true,
    producerCollisionInLiveGameCertified:false,actualWaterSealApproved:false});
 }
 for(const room of [
  ['salt-air-arrival',17,4,33,13],
  ['west-boatwork-landing',5,6,16,16],
  ['east-cartographer-house',32,14,40,23],
  ['central-watch-causeway',16,14,30,29],
  ['tower-ground-lens-service',22,16,27,22],
  ['south-dry-supply',17,31,36,40],
  ['west-net-drying-ward',4,22,17,38],
  ['east-keeper-room',32,24,40,29]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','salt-air-arrival',25,3],
  ['salt-air-arrival','west-boatwork-landing',16,12],
  ['salt-air-arrival','central-watch-causeway',24,13],
  ['salt-air-arrival','east-cartographer-house',32,14],
  ['central-watch-causeway','tower-ground-lens-service',24,15],
  ['central-watch-causeway','south-dry-supply',25,30],
  ['central-watch-causeway','west-net-drying-ward',17,29],
  ['east-cartographer-house','east-keeper-room',35,23],
  ['central-watch-causeway','east-keeper-room',31,27],
  ['west-boatwork-landing','west-net-drying-ward',14,23]
 ]){
  if(!has(x,z))throw Error('Saltreach portal missing real footprint '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,kind] of [
  [26,7,'sealed-chart-cabinet'],[9,12,'unlit-mariner-lantern'],
  [35,19,'paper-navigation-case'],[24,19,'inert-beacon-lens-case'],
  [26,36,'dry-supply-box'],[9,33,'dry-net-basket'],[35,27,'keeper-shelf']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,kind,'pack4:059');
 return b.finish('Asymmetrical six-wing temperate harbor lantern station with offset tall hollow stone beacon drum, open salt-net court, dry keeper and survey wings, multiple real connected passages and a high masonry roof; entirely inert source-only architecture',{
  owner:'MYTHWROUGHT Builder B 1B Wave9',originalAuthorPlan:true,
  sourceOpenSkyCourtColumns:16,upperLanternGlazing:8,lowerSourceWindows:10,
  lighthousePowerOn:false,actualTerrainOrShorelineChecked:false,
  physicallyNavigableUpperTower:false,realStairsInstalled:false,
  producerAABBsAcceptedInGame:false,realWindowWeatherSealApproved:false,
  realRoofWeatherSealApproved:false,actualIphoneTested:false,creatorArtApproved:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
