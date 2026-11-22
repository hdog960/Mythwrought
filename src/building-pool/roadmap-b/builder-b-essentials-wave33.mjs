// MYTHWROUGHT Builder B Wave33 — Sunfall Braided-Sand Caravan Stables.
// ORIGINAL medium desert stable, frozen B115 service ID. Three physically
// paved braided handling tracks connect a large 225-cell open inner corral,
// separate 64-cell sky-open feed yard and two long handling return spurs.
// Eight distinct immediately-backed Pack3 roofs; grounded but unpowered
// limestone windbreaks and fully framed upright Pack4 glazing. Horse/camel
// spawning, riding, sandstorm, terrain, villages and saves are NOT active.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNFALL_BRAIDED_STABLE_ID='r1:stable:desert:medium:003';
export function buildSunfallBraidedSandCaravanStables(){
 const b=sourcePlan('stable','desert','medium',3,
  'Sunfall Braided-Sand Caravan Stables',69,42,70);
 const wings=[
  ['northern-saddle-registration',16,3,52,18,15,'pack3:025'],
  ['west-pack-camel-shelter',4,11,25,50,12,'pack3:026'],
  ['east-empty-beast-shelter',43,10,64,51,16,'pack3:023'],
  ['middle-dry-hoof-arcade',22,16,48,51,20,'pack3:025'],
  ['southwest-harness-room',8,46,34,61,13,'pack3:026'],
  ['southeast-waterless-feed-store',36,45,63,62,15,'pack3:023'],
  ['northwest-shadow-screen',3,5,18,29,9,'pack3:025'],
  ['northeast-unpowered-windwatch',57,5,65,30,17,'pack3:026']
 ],courts=[[25,23,39,37],[13,47,20,54]],
 K=(x,z)=>x+','+z,inside=new Set(),sky=new Set(),braid=new Set(),roofed=new Map(),
 sides={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)inside.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   sky.add(K(x,z));inside.delete(K(x,z));
  }
 // Three intertwined SOURCE ground tracks, never procedural sand physics.
 // Outboard west/east limbs stay separated until they meet a 5-cell
 // thick physical southern cross-deck; all y0 entries are actual stone.
 for(const [x0,z0,x1,z1] of [
  [12,54,20,67],[45,54,55,68],[19,63,47,67],
  [29,59,35,66]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!inside.has(K(x,z))&&!sky.has(K(x,z)))braid.add(K(x,z));
 }
 const enclosed=(x,z)=>inside.has(K(x,z)),
  grounded=(x,z)=>enclosed(x,z)||sky.has(K(x,z))||braid.has(K(x,z));
 for(const k of new Set([...inside,...sky,...braid])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {physicalDesertStableGround:true,actualSandBiomeUnchanged:true});
 }
 for(const k of inside){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(sides).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {sourceSandbreakStableEnvelope:true,actualWindLoadNotCertified:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!enclosed(x,z)||roofed.has(K(x,z)))continue;
   const rise=Math.min(x-x0,x1-x,z-z0,z1-z),
     y=base+Math.floor(rise/(name==='middle-dry-hoof-arcade'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {actualOriginalYMinusOneRoofBacking:true,sourceNotLiveLoadValidated:true});
   b.put(x,y,z,'roof',asset,'north',
    {sourceSunfallRoofWing:name,weatherSealNotApproved:true});
  }
 // Four real source masonry wind baffles INSIDE the roof footprints,
 // set strictly outside the 225-cell sky courtyard, backed from y0.
 for(const [x,z] of [[24,24],[40,24],[24,37],[40,37]]){
  if(!enclosed(x,z)||!b.clear(x,1,z))throw Error('Sunfall roof-side windbreak cannot occupy true source court '+K(x,z));
  b.support(x,z,6,'live:stone','real-standing-limestone-sandbreak-post');
 }
 for(const [x,z] of [
  [20,7],[34,7],[48,8],[9,22],[14,40],[55,34],
  [27,56],[48,57],[10,55],[62,19],[12,12],[45,21]
 ]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Sunfall roof-bearing timber post misses original roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','grounded-roof-rafter-bent');
 }
 // Each partition has explicit broad source breaks; courtyard doors are
 // later opened to exact y1 and y2 clearance, not decorative tags.
 for(const [axis,fix,lo,hi,holes] of [
  ['x',24,17,51,[20,21,29,30,38,39,45,46]],
  ['x',43,17,51,[20,21,28,29,38,39,46,47]],
  ['z',18,16,52,[22,23,31,32,41,42,49,50]],
  ['z',47,8,63,[15,16,24,25,34,35,44,45,54,55]],
  ['x',17,6,29,[12,13,21,22,26,27]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fix:n,z=axis==='z'?fix:n;
  if(!enclosed(x,z)||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {realEmptyCaravanStallDivider:true,noNpcPenAI:true});
 }
 for(const room of [
  ['north-dry-caravan-desk',17,4,51,17],
  ['west-empty-camel-stalls',5,12,24,49],
  ['east-dormant-horse-stalls',44,11,63,50],
  ['middle-roofed-handling-aisle',23,17,47,50],
  ['southwest-unused-saddle-rack',9,47,33,60],
  ['southeast-dry-feed-warehouse',37,46,62,61],
  ['northwest-quiet-wind-shade',4,6,17,28],
  ['northeast-closed-storm-desk',58,6,64,29],
  ['large-grounded-open-caravan-court',25,23,39,37],
  ['west-secondary-roofless-feed-court',13,47,20,54],
  ['outer-west-ground-braided-track',12,57,20,66],
  ['outer-east-ground-braided-track',45,57,55,67],
  ['southern-braided-track-crossing',19,63,47,67]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-dry-caravan-desk',34,3],
  ['north-dry-caravan-desk','west-empty-camel-stalls',24,15],
  ['north-dry-caravan-desk','east-dormant-horse-stalls',43,15],
  ['north-dry-caravan-desk','middle-roofed-handling-aisle',33,18],
  ['west-empty-camel-stalls','middle-roofed-handling-aisle',24,31],
  ['east-dormant-horse-stalls','middle-roofed-handling-aisle',43,31],
  ['middle-roofed-handling-aisle','southwest-unused-saddle-rack',29,47],
  ['middle-roofed-handling-aisle','southeast-dry-feed-warehouse',40,47],
  ['middle-roofed-handling-aisle','large-grounded-open-caravan-court',24,31],
  ['large-grounded-open-caravan-court','east-dormant-horse-stalls',40,32],
  ['west-empty-camel-stalls','west-secondary-roofless-feed-court',18,46],
  ['west-secondary-roofless-feed-court','southwest-unused-saddle-rack',20,55],
  ['southwest-unused-saddle-rack','outer-west-ground-braided-track',16,61],
  ['southeast-dry-feed-warehouse','outer-east-ground-braided-track',50,62],
  ['outer-west-ground-braided-track','southern-braided-track-crossing',20,65],
  ['southern-braided-track-crossing','outer-east-ground-braided-track',46,65],
  ['north-dry-caravan-desk','northwest-quiet-wind-shade',17,14],
  ['east-dormant-horse-stalls','northeast-closed-storm-desk',58,24]
 ]){
  if(!grounded(x,z))throw Error('Sunfall actual caravan doorway missing y0 stone '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let panes=0,bays=0;
 for(const key of inside){
  const [x,z]=key.split(',').map(Number);
  if((x*17+z*7)%10!==0)continue;
  const exposure=Object.entries(sides).find(([,d])=>!grounded(x+d[0],z+d[1]));
  if(!exposure||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3]){
   b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',exposure[0],
    {twoTierSourceDesertStableGlass:true,realPackMountUnknown:true});
   panes++;
  }bays++;
 }
 for(const [x,z,label] of [[34,8,'dry-caravan-route-book'],[11,30,'empty-saddle-sling'],
  [50,37,'unused-feed-scale'],[26,55,'stowed-bridles'],
  [47,57,'unpowered-sand-gate'],[10,13,'silent-camel-bell']])
  if(enclosed(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Original medium desert caravan stable: eight grounded Pack3 roof wings, two completely walkable sky-open source courts (225+64), three physically connected stone handling-track arms, four full-grounded limestone wind baffles and upright source-framed Pack4 panes. Not a simulation of animals, desert weather, terrain or trading.',{
  builderBExclusiveWave:33,roofWings:8,realOpenPavedCourts:[225,64],
  braidPavedUnroofedCells:braid.size,originalBraidedTrackArms:3,
  groundedStoneWindbreakPiers:4,originalFramedGlassBays:bays,
  uprightPack4SourceGlassCells:panes,
  liveCaravanHorses:false,caravanEconomy:false,feedingOrRiding:false,
  weatherAndSandPhysics:false,worldTerrainEdited:false,
  physicalPackCollisionApproved:false,realIphoneAccepted:false,
  creatorArtAccepted:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
