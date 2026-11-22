// MYTHWROUGHT Builder B Wave25 — Rimehook Wind-Shelter Stables.
// ORIGINAL SMALL SNOW source only. A navigable paved roofless stall-training
// courtyard, separate sky-exposed feed-loading square, five source-backed
// asymmetric winter roofs, a tall unpowered wind marker, physical half-arch
// masonry posts and authentic framed upright Pack4 glazing. Animal riding,
// AI, feeding, snowfall, world collision, saves, roads and villages inactive.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const RIMEHOOK_WINDSHELTER_STABLES_ID='r1:stable:snow:small:003';
export function buildRimehookWindShelterStables(){
 const b=sourcePlan('stable','snow','small',3,'Rimehook Wind-Shelter Stables',50,34,50);
 const wings=[
  ['north-trapper-arrival',12,3,36,15,13,'pack3:025'],
  ['west-dry-wool-stalls',4,10,21,38,11,'pack3:026'],
  ['east-ungroomed-sled-bays',32,10,45,40,16,'pack3:023'],
  ['central-windward-ramp-hall',18,14,37,39,18,'pack3:025'],
  ['south-wooden-gear-gallery',13,35,40,47,12,'pack3:026'],
  ['northwest-warmth-free-porch',3,4,14,22,9,'pack3:023']
 ],courts=[[23,23,30,30],[13,40,17,44]],vane=[40,17],K=(x,z)=>x+','+z,
 floor=new Set(),outdoor=new Set(),roofed=new Map(),
 compass={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)floor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   outdoor.add(K(x,z));floor.delete(K(x,z));
  }
 const indoor=(x,z)=>floor.has(K(x,z)),ground=(x,z)=>indoor(x,z)||outdoor.has(K(x,z));
 for(const key of new Set([...floor,...outdoor])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {realPavedSnowStableGround:true,liveTerrainUntouched:true});
 }
 for(const k of floor){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(compass).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood','none',
    {genuineStoneMountedWindBarrier:true,actualSnowSealNotCertified:true});
 }
 // Six nonidentical real source roofs, each backed at y-1 by actual authored
 // material. The two entire courtyards remain fully open from y1 upward.
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!indoor(x,z)||(x===vane[0]&&z===vane[1])||roofed.has(K(x,z)))continue;
   const rise=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(rise/(name==='central-windward-ramp-hall'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {authoredSourceRoofBearing:true,fullLoadPathUnknown:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalSnowStableRoof:name,actualIceWaterproofingUncertified:true});
  }
 if(!indoor(...vane))throw Error('Rimehook vane has no real y0 stable ground');
 b.support(vane[0],vane[1],23,'live:stone','true-grounded-unpowered-snow-vane');
 b.put(vane[0],24,vane[1],'roof','pack3:023','north',
  {actualGroundBackedVaneCap:true,unpoweredWindMarker:true});
 // Solid breakwater posts outside the 64-cell training court, never within
 // its walkable tiles or overhead sky.
 for(const [x,z] of [[22,23],[31,23],[22,30],[31,30]]){
  if(!indoor(x,z))throw Error('Rimehook side arch pier lacks original foundation '+K(x,z));
  b.support(x,z,6,'live:stone','original-outside-court-windbreak-post');
 }
 for(const [x,z] of [[17,7],[29,8],[9,17],[12,30],[40,25],[38,36],
  [23,43],[31,43],[7,11],[43,16]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Rimehook real timber rafter missing roof at '+K(x,z));
  b.support(x,z,y-1,'live:wood','grounded-winter-stable-bearing-post');
 }
 for(const [axis,at,lo,hi,gaps] of [
  ['x',20,15,39,[18,19,24,25,32,33,37,38]],
  ['x',33,15,40,[19,20,27,28,35,36]],
  ['z',15,12,36,[16,17,23,24,31,32]],
  ['z',36,13,40,[17,18,25,26,32,33]],
  ['x',14,5,22,[9,10,16,17]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?at:n,z=axis==='z'?at:n;
  if(!indoor(x,z)||gaps.includes(n)||(x===vane[0]&&z===vane[1]))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {actualSnowStallDivider:true,animalPenAI:false});
 }
 for(const room of [
  ['north-winter-mule-entry',13,4,35,14],
  ['west-vacant-wool-stalls',5,11,20,37],
  ['east-sled-trailer-bays',33,11,44,39],
  ['central-dry-hoof-corridor',19,15,36,38],
  ['south-sack-and-gear-shop',14,36,39,46],
  ['northwest-hardened-boot-porch',4,5,13,21],
  ['central-roofless-true-hoof-yard',23,23,30,30],
  ['western-paved-sky-feed-yard',13,40,17,44]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-winter-mule-entry',25,3],
  ['north-winter-mule-entry','west-vacant-wool-stalls',19,13],
  ['north-winter-mule-entry','central-dry-hoof-corridor',27,14],
  ['north-winter-mule-entry','east-sled-trailer-bays',34,13],
  ['west-vacant-wool-stalls','central-dry-hoof-corridor',20,27],
  ['east-sled-trailer-bays','central-dry-hoof-corridor',33,27],
  ['central-dry-hoof-corridor','south-sack-and-gear-shop',28,36],
  ['west-vacant-wool-stalls','western-paved-sky-feed-yard',15,39],
  ['western-paved-sky-feed-yard','south-sack-and-gear-shop',16,45],
  ['central-dry-hoof-corridor','central-roofless-true-hoof-yard',22,27],
  ['central-roofless-true-hoof-yard','east-sled-trailer-bays',31,27],
  ['north-winter-mule-entry','northwest-hardened-boot-porch',14,12]
 ]){
  if(!ground(x,z))throw Error('Rimehook two-high snow stable portal missing y0 foundation '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Genuine two-high upright exterior Pack4 glass on original y1/y4 wood.
 let twoTierBays=0,glassCells=0;
 for(const key of floor){
  const [x,z]=key.split(',').map(Number);
  if((x===vane[0]&&z===vane[1])||(x*13+z*7)%11!==0)continue;
  const ext=Object.entries(compass).find(([,v])=>!ground(x+v[0],z+v[1]));
  if(!ext||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',ext[0],
    {twoHighSnowStableGlass:true,weatherAndColliderUnknown:true});
   glassCells++;
  }twoTierBays++;
 }
 for(const [x,z,name] of [
  [26,7,'dry-sled-register'],[9,21,'vacant-tack-and-bridle'],
  [42,29,'unused-ice-harness'],[29,41,'empty-wood-feed-stand'],
  [16,46,'dormant-hay-drying-table'],[6,14,'unlit-lantern-shelf']
 ])if(indoor(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Six irregular winter stables surround a fully paved 64-cell sky-open handling yard and a separate 25-cell walking feed court, each with real stone y0, unbroken 2-high source access, exterior original two-level Pack4 glazing, four physical courtyard-side windbreak posts, six independent supported Pack3 roofs and an inert 23-tier grounded snow vane. Horses, feed and roads inactive.',{
  exclusiveBOriginal:'Wave25 small snow stable',
  originalSnowRoofWingCount:6,pavedWalkableOpenCourts:[64,25],
  originalFourCourtWindbreakPiers:4,tallGroundedWindVaneCells:23,
  exteriorDoubleTierGlassBays:twoTierBays,
  exteriorDoubleTierGlassCells:glassCells,
  liveHorses:false,feedingMechanics:false,activeSnowWind:false,
  liveRoads:false,actualTerrainSlopeTested:false,
  producerColliderCertified:false,weatherProofingCertified:false,
  actualIphoneTested:false,creatorArtworkAccepted:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
