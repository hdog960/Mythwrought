// MYTHWROUGHT Builder B Wave41 — Saltglass Tern-Fork Customs House.
// Original SMALL TEMPERATE harbor office, B115-only. Distinct wide forked
// groundstone berths / crossbar, THREE independent sky-open customs courts,
// seven source-backed Pack3 gabled/hipped wings, four grounded stone
// harbor wind baffles and upright two-high source-framed Pack4 panes.
// This does not register live boats, economics, terrain, saves, citizens,
// water or Pack physical colliders. Preserves immutable historical 228.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SALTGLASS_TERN_FORK_ID='r1:harbor-office:temperate:small:004';
export function buildSaltglassTernForkCustomsHouse(){
 const b=sourcePlan('harbor-office','temperate','small',4,'Saltglass Tern-Fork Customs House',57,38,61);
 const wings=[
 ['north-cargo-index-arcade',12,3,43,16,13,'pack3:025'],
 ['west-berth-register',3,10,21,47,12,'pack3:026'],
 ['east-riverglass-exchange',35,10,52,47,16,'pack3:023'],
 ['central-angled-customs-bridge',17,15,39,49,19,'pack3:025'],
 ['southwest-tally-watch',7,43,28,54,13,'pack3:026'],
 ['southeast-rented-net-counter',29,43,49,55,15,'pack3:023'],
 ['northwest-navigation-porch',2,4,15,27,10,'pack3:025']
 ],courts=[[24,22,32,31],[11,41,17,47],[39,36,45,42]],
 key=(x,z)=>x+','+z,inside=new Set(),courtsOpen=new Set(),piers=new Set(),roofs=new Map(),
 faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)inside.add(key(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   courtsOpen.add(key(x,z));inside.delete(key(x,z));
  }
 // Actual source y0 physical forked dry berths connected by a real
 // transverse stone walkway; no floating piers, procedural water or roads.
 for(const [x0,z0,x1,z1] of [[8,51,14,59],[25,51,31,59],[45,51,51,59],[13,56,47,59]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!inside.has(key(x,z))&&!courtsOpen.has(key(x,z)))piers.add(key(x,z));
 const isIndoor=(x,z)=>inside.has(key(x,z)),
  isGround=(x,z)=>isIndoor(x,z)||courtsOpen.has(key(x,z))||piers.has(key(x,z));
 for(const p of new Set([...inside,...courtsOpen,...piers])){
  const [x,z]=p.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{realOriginalPavedQuaySource:true,noRealWater:true});
 }
 for(const p of inside){
  const [x,z]=p.split(',').map(Number);
  if(Object.values(faces).some(([dx,dz])=>!isGround(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalTemperedTernCustomsFrame:true,weatherSealingNotApproved:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!isIndoor(x,z)||roofs.has(key(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(d/(name==='central-angled-customs-bridge'?3:5));
   roofs.set(key(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalRealPack3ImmediateBacking:true,notLoadCertified:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalSaltglassTernRoofWing:name,noLiveProducerApproval:true});
  }
 for(const [x,z] of [[16,8],[28,8],[40,8],[8,21],[46,22],[19,37],[35,36],[13,44],[45,46]]){
  const y=roofs.get(key(x,z));
  if(!y)throw Error('Saltglass true roof post has no roof overhead '+key(x,z));
  b.support(x,z,y-1,'live:wood','genuinely-original-source-grounded-rafter');
 }
 // Distinct stone baffles flank the real roofed traffic channel but
 // NEVER obstruct the fully open paved courts.
 for(const [x,z] of [[19,20],[37,20],[19,39],[37,43]]){
  if(!isIndoor(x,z))throw Error('Saltglass wind baffle in court '+key(x,z));
  b.support(x,z,6,'live:stone','six-tier-footed-harbor-semaphore-plinth');
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',21,15,46,[19,20,27,28,35,36,42,43]],
  ['x',36,15,46,[19,20,27,28,35,36,42,43]],
  ['z',16,12,43,[17,18,26,27,35,36]],
  ['z',44,7,48,[12,13,21,22,31,32,39,40]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!isIndoor(x,z)||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {inertBerthAccountScreen:true,notWorkingPortAI:true});
 }
 for(const row of [
  ['north-tern-records-hall',13,4,42,15],
  ['west-original-harbor-ledger',4,11,20,46],
  ['east-tempered-slip-register',36,11,51,46],
  ['middle-source-customs-lane',18,16,38,48],
  ['southwest-inert-shipping-desk',8,44,27,53],
  ['southeast-empty-crate-exchange',30,44,48,54],
  ['northwest-closed-quay-navigator',3,5,14,26],
  ['central-sky-open-weighing-yard',24,22,32,31],
  ['western-sky-open-tide-yard',11,41,17,47],
  ['eastern-open-dry-berth-court',39,36,45,42],
  ['west-grounded-tern-pier',8,52,14,59],
  ['middle-grounded-tern-pier',25,52,31,59],
  ['east-grounded-tern-pier',45,52,51,59],
  ['source-forked-stone-crosswalk',13,56,47,59]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-tern-records-hall',28,3],
  ['north-tern-records-hall','west-original-harbor-ledger',21,13],
  ['north-tern-records-hall','east-tempered-slip-register',36,13],
  ['north-tern-records-hall','middle-source-customs-lane',28,16],
  ['west-original-harbor-ledger','middle-source-customs-lane',21,30],
  ['east-tempered-slip-register','middle-source-customs-lane',36,30],
  ['middle-source-customs-lane','central-sky-open-weighing-yard',23,27],
  ['central-sky-open-weighing-yard','east-tempered-slip-register',33,27],
  ['west-original-harbor-ledger','western-sky-open-tide-yard',14,40],
  ['western-sky-open-tide-yard','southwest-inert-shipping-desk',14,48],
  ['east-tempered-slip-register','eastern-open-dry-berth-court',43,35],
  ['eastern-open-dry-berth-court','southeast-empty-crate-exchange',43,43],
  ['middle-source-customs-lane','southwest-inert-shipping-desk',24,44],
  ['middle-source-customs-lane','southeast-empty-crate-exchange',34,44],
  ['southwest-inert-shipping-desk','west-grounded-tern-pier',11,51],
  ['middle-source-customs-lane','middle-grounded-tern-pier',28,50],
  ['southeast-empty-crate-exchange','east-grounded-tern-pier',47,55],
  ['west-grounded-tern-pier','source-forked-stone-crosswalk',14,57],
  ['middle-grounded-tern-pier','source-forked-stone-crosswalk',28,57],
  ['source-forked-stone-crosswalk','east-grounded-tern-pier',47,57],
  ['north-tern-records-hall','northwest-closed-quay-navigator',14,13]
 ]){
  if(!isGround(x,z))throw Error('Saltglass authored original passage no grounded floor '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Exact two-high upright exterior glass, physically solid y1 timber sill
 // and y4 lintel, physically empty original source outward neighbor.
 let windows=0,bays=0;
 for(const p of inside){
  const [x,z]=p.split(',').map(Number);
  if((x*11+z*13)%10!==0||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  const facing=Object.entries(faces).find(([,d])=>!isGround(x+d[0],z+d[1]));
  if(!facing)continue;
  for(const y of [2,3]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',facing[0],
    {originalTwoTierHarborTernGlass:true,actualPackColliderUnknown:true});
   windows++;
  }bays++;
 }
 for(const [x,z,label] of [[28,8,'empty-berth-counter'],[8,30,'unpowered-coastal-chart'],[49,30,'silent-tern-flag']])
  if(isIndoor(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Seven original separately supported asymmetric Pack3 source wings, three genuinely open-sky paved customs yards, three grounded cardinal-connected stone dry-berths, four six-tier solid stone baffles and true upright Pack4 two-high source-framed windows. NO live harbor systems.',{
  originalBuilderBOnlyWave:41,originalRoofWings:7,
  trueSkyOpenPavedCustomsCourts:[90,49,49],groundedOuterQuayCrosswalkCells:piers.size,
  forkedDryBerthArms:3,originalGroundedStoneSemaphorePiers:4,
  fullyFramedTwoHighPack4Bays:bays,originalUprightWindowCells:windows,
  operationalCustoms:false,liveSeaOrBoats:false,
  actualPackMeshCollisionApproved:false,creatorArtworkAccepted:false,
  iPhoneHomeScreenApproved:false,productionRegistered:false,worldPlacement:false,saveSchema1Written:false
 });
}
