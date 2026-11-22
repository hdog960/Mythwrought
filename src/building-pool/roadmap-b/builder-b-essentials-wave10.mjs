// MYTHWROUGHT Builder B 1B Wave10 — original Dunewake Oasis Reedworks Fishing Lodge.
// Architecturally authored dry-oasis source, no actual water, fish AI, shoreline, boat,
// citizens, biome placement, climate seal, runtime, saves or producer certification.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const DUNEWAKE_OASIS_REEDWORKS_ID='r1:fishing-lodge:desert:small:002';
export function buildDunewakeOasisReedworksFishingLodge(){
 const b=sourcePlan('fishing-lodge','desert','small',2,'Dunewake Oasis Reedworks Fishing Lodge',43,26,44);
 const wings=[
  {name:'northern-trade-loggia',r:[14,2,30,13],roofY:11},
  {name:'west-dry-reed-hall',r:[4,10,17,32],roofY:9},
  {name:'east-dune-watch-room',r:[28,10,40,30],roofY:15},
  {name:'south-net-and-kit-pavilion',r:[12,29,35,40],roofY:12},
  {name:'center-shaded-oasis-causeway',r:[15,14,29,31],roofY:16},
  {name:'west-low-crescent-gear-shed',r:[3,28,13,39],roofY:8}
 ];
 const court=[20,20,23,24],K=(x,z)=>x+','+z,foot=new Set(),roofMap=new Map();
 for(const {r:[x0,z0,x1,z1]} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(let x=court[0];x<=court[2];x++)for(let z=court[1];z<=court[3];z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const key of foot){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{actualOasisShorelineValidated:false});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:stone','none',
    {sandstoneReedFacade:true,weatherSealApproved:false});
 }
 // Distinct low-vault drying bays and passable trade-to-net service passages.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',17,13,32,[17,18,23,24,28,29]],
  ['x',28,12,30,[16,17,21,22,28,29]],
  ['z',29,12,35,[19,20,23,24,29,30]],
  ['z',14,14,31,[20,21,26,27]],
  ['x',13,28,39,[32,33,36,37]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{dryReedDivision:true,actualDoorHardware:false});
 }
 // All roof pitches have immediately adjacent real authored bearing cells.
 // Zero upright glass windows may become fake Pack3-slope skylights.
 for(const {name,r:[x0,z0,x1,z1],roofY} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofMap.has(K(x,z)))continue;
   const y=roofY+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/4);
   roofMap.set(K(x,z),y);
   if(b.clear(x,y-1,z))
    b.put(x,y-1,z,'support','live:wood','none',
     {dryRoofBacking:true,loadBearingCertified:false});
   b.put(x,y,z,'roof','pack3:023','north',
    {originalRoofWing:name,pitchDrySource:true,roofWeatherProof:false});
  }
 // Grounded reed-truss corner spurs visibly distinguish the desert source.
 for(const [x,z] of [[18,6],[26,6],[8,15],[8,29],[35,15],[35,26],
  [17,35],[29,35],[6,35]]){
  const y=roofMap.get(K(x,z));
  if(!y||!has(x,z))throw Error('Dunewake grounded reed-truss misses roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','dry-pier-crossbrace');
 }
 // Ten original upright ordinary openings face exterior terrain-free source air.
 for(const [x,z,side] of [
  [18,2,'north'],[27,2,'north'],[4,16,'west'],[4,24,'west'],
  [40,17,'east'],[40,26,'east'],[18,40,'south'],[29,40,'south'],
  [3,34,'west'],[13,37,'east']
 ]){
  if(!has(x,z))throw Error('Dunewake glass not mounted on real wall '+K(x,z));
  b.pane(x,z,side);
 }
 for(const [name,x0,z0,x1,z1] of [
  ['trade-arrival-shade',15,3,29,12],
  ['west-reed-crafting-hall',5,11,16,30],
  ['east-silt-map-room',29,11,39,25],
  ['central-shaded-net-causeway',16,15,28,29],
  ['south-dry-fish-kit-store',13,30,34,39],
  ['west-tied-rope-hut',4,29,12,38],
  ['east-supply-ledger',29,26,39,29],
  ['west-entry-palm-rib-workshop',5,12,16,21]
 ])b.room(name,x0,z0,x1,z1);
 for(const [from,to,x,z] of [
  ['outside','trade-arrival-shade',22,2],
  ['trade-arrival-shade','west-reed-crafting-hall',16,12],
  ['trade-arrival-shade','central-shaded-net-causeway',22,13],
  ['trade-arrival-shade','east-silt-map-room',29,12],
  ['west-reed-crafting-hall','west-entry-palm-rib-workshop',12,17],
  ['west-reed-crafting-hall','west-tied-rope-hut',10,29],
  ['central-shaded-net-causeway','east-silt-map-room',28,21],
  ['central-shaded-net-causeway','south-dry-fish-kit-store',24,29],
  ['east-silt-map-room','east-supply-ledger',35,25],
  ['south-dry-fish-kit-store','west-tied-rope-hut',13,33],
  ['central-shaded-net-causeway','west-reed-crafting-hall',17,23]
 ]){
  if(!has(x,z))throw Error('Dunewake doorway lacks real footings '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,purpose] of [
  [22,8,'trade-reed-ledger-inert'],[9,19,'dry-netting-frame'],
  [34,19,'unlit-oasis-route-chart'],[25,35,'empty-fishing-repair-racks'],
  [7,34,'coiled-canal-rope'],[35,27,'sealed-trading-box']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 return b.finish('Original desert oasis six-wing source: shaded dry trading gallery, low reed craft hall, high dune navigation post, south net-store, open sandwell court and sheltered packhouse, with no actual fishing/fluid gameplay',{
  owner:'Builder B 1B Wave10',sourceOnly:true,sourceSkyOpenCourtColumns:20,
  fishingEnabled:false,waterSimulated:false,boatEnabled:false,
  sourceShorelineOrSlopeValidated:false,roofSealCertified:false,
  pack4ProducerCollisionInLiveGameCertified:false,
  actualIphoneTested:false,creatorArtApproved:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
