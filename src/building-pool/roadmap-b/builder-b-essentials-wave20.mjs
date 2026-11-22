// MYTHWROUGHT Builder B Wave20: original Bramblecross Split-Rail Coach Stables.
// Medium temperate source; 217 genuine sky-open WALKABLE stone yard cells, plus
// physical stone approach paths. No live mounts, road economy, settlements,
// placement, save changes, AABB/weather certification or powered equipment.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const BRAMBLECROSS_COACH_STABLES_ID='r1:stable:temperate:medium:001';
export function buildBramblecrossSplitRailCoachStables(){
 const b=sourcePlan('stable','temperate','medium',1,'Bramblecross Split-Rail Coach Stables',56,38,55);
 const wings=[
 ['west-tack-stables',4,6,21,36,12,'pack3:023'],
 ['north-coach-entry',18,2,44,16,15,'pack3:025'],
 ['east-harness-shop',39,10,51,39,14,'pack3:026'],
 ['south-wagon-workshop',23,33,45,50,13,'pack3:023'],
 ['southwest-dry-feed',7,37,24,51,11,'pack3:025'],
 ['northeast-braced-loft',43,4,52,22,17,'pack3:026']
 ],courts=[[23,19,36,31],[13,37,17,43]],
 K=(x,z)=>x+','+z,wingFloor=new Set(),yard=new Set(),paths=new Set(),roofMap=new Map();
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)wingFloor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   yard.add(K(x,z));wingFloor.delete(K(x,z));
  }
 const path=(x0,z0,x1,z1)=>{for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  if(!wingFloor.has(K(x,z))&&!yard.has(K(x,z)))paths.add(K(x,z));};
 path(27,15,30,20);    // walkable north entrance to inner open hardstand
 path(20,23,25,26);    // west stable to hardstand
 path(35,24,40,27);    // hardstand to east harness store
 path(28,29,31,35);    // hardstand to southern repair shop
 path(15,34,18,39);    // west building to secondary mounting court
 path(16,41,26,44);    // secondary court to dry feed / wagon wing
 const hasWing=(x,z)=>wingFloor.has(K(x,z)),hasFloor=(x,z)=>
  wingFloor.has(K(x,z))||yard.has(K(x,z))||paths.has(K(x,z));
 for(const key of new Set([...wingFloor,...yard,...paths])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
    {originalGroundHardstand:true,originalTerrainSlopeApprovalPending:true});
 }
 // These are walkable, intentionally roofless yards with actual y0 masonry.
 for(const key of wingFloor){
  const [x,z]=key.split(',').map(Number);
  if(!hasFloor(x-1,z)||!hasFloor(x+1,z)||!hasFloor(x,z-1)||!hasFloor(x,z+1))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {coachHallOriginalExterior:true,realHorseCollisionNotApproved:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!hasWing(x,z)||roofMap.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (wing==='north-coach-entry'?3:5));
   roofMap.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {realImmediateRoofBacking:true,fullSpanLoadPending:true});
   b.put(x,y,z,'roof',asset,'north',{originalRoofWing:wing,actualWeatherSeal:false});
  }
 for(const [x,z] of [[10,12],[17,26],[27,7],[37,8],[46,15],[47,31],
  [29,41],[39,46],[12,45],[18,45],[47,7]]){
  const y=roofMap.get(K(x,z));
  if(!y)throw Error('Original timber post cannot support absent roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','grounded-original-coach-rafter');
 }
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',19,8,33,[13,14,22,23,29,30]],
  ['z',16,20,44,[24,25,32,33,39,40]],
  ['x',40,11,38,[16,17,26,27,34,35]],
  ['z',34,23,45,[27,28,36,37,42,43]],
  ['z',37,7,24,[12,13,18,19]],
  ['x',44,5,22,[10,11,16,17]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!hasWing(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{sourceStallRailDivider:true});
 }
 for(const room of [
  ['north-coach-receiving',19,3,43,15],
  ['western-horse-tack-shop',5,7,20,35],
  ['eastern-harness-service',40,11,50,38],
  ['south-wagon-workshop',24,34,44,49],
  ['southwest-dry-feed-gallery',8,38,23,50],
  ['northeast-loft-footing',44,5,51,21],
  ['central-paved-open-sky-yard',23,19,36,31],
  ['west-paved-open-mounting-court',13,37,17,43]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-coach-receiving',31,2],
  ['north-coach-receiving','western-horse-tack-shop',19,12],
  ['north-coach-receiving','eastern-harness-service',40,13],
  ['north-coach-receiving','central-paved-open-sky-yard',28,16],
  ['western-horse-tack-shop','central-paved-open-sky-yard',21,24],
  ['eastern-harness-service','central-paved-open-sky-yard',39,26],
  ['central-paved-open-sky-yard','south-wagon-workshop',29,33],
  ['south-wagon-workshop','southwest-dry-feed-gallery',23,41],
  ['western-horse-tack-shop','west-paved-open-mounting-court',16,36],
  ['west-paved-open-mounting-court','southwest-dry-feed-gallery',17,44],
  ['north-coach-receiving','northeast-loft-footing',44,13]
 ]){
  if(!hasFloor(x,z))throw Error('Source coach passage has no real foundation '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Source-level wall intersection (39,33) is genuinely isolated from all
 // other y1 walk cells; fill it as a four-high grounded structural pier instead
 // of pretending the player can step through surrounding partitions.
 for(let y=1;y<=4;y++)if(b.clear(39,y,33))
  b.put(39,y,33,'partition','live:wood','none',
   {sealedEastHarnessBearingPier:true,nonWalkableOriginal:true});
 const side={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 let windows=0;
 for(const key of wingFloor){
  const [x,z]=key.split(',').map(Number),f=Object.entries(side).find(([,d])=>!hasFloor(x+d[0],z+d[1]));
  if(!f||(x*17+z*11)%9!==0||[1,2,3].some(y=>b.clear(x,y,z)))continue;
  b.pane(x,z,f[0]);windows++;
 }
 for(const [x,z,kind] of [
  [30,7,'inert-coach-ledger'],[12,20,'unused-grooming-bench'],
  [46,25,'unpowered-harness-vise'],[31,43,'spare-wheel-rack'],
  [17,47,'dry-hay-stores'],[47,13,'vacant-coach-labels']
 ])if(hasWing(x,z)&&b.clear(x,1,z))b.fitting(x,z,kind,'pack4:059');
 return b.finish('Original medium temperate coach stable with SIX asymmetric real roofed timber wings, 182-column physically paved and fully sky-open central yard, separate 35-column paved secondary court, genuinely walkable connecting stone pathways, backed Pack3 roofs, upright Pack4 panes and ground-to-roof posts. No horses, carts or settlements active.',{
  originalOwner:'Builder B Wave20 original medium stable',roofWings:6,
  pavedGroundSkyCourts:[182,35],originalConnectingPavedPathCells:paths.size,
  authenticExteriorGlassWindows:windows,horsesActive:false,
  cartMechanicsEnabled:false,realSettlementRoads:false,
  actualTerrainSlopeTested:false,PackPhysicalCollisionApproved:false,
  weatherSealCertified:false,actualIphoneTested:false,
  creatorArtAccepted:false,worldPlacement:false,productionRegistered:false,
  saveSchema1Written:false
 });
}
