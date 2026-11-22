// MYTHWROUGHT Builder B Wave32 — Alderquay Split-Pier Harbor Office.
// ORIGINAL medium TEMPERATE harbor-office source, frozen B115 only.
// Two distinct paved forked handling piers, a connecting raised-in-plan
// (NOT elevated in Y) crossing, two real sky-open paved customs courts,
// eight physically backed Pack3 roofs and genuine outward two-high Pack4
// glass in full wooden frames. NO water, boats, customs economy, citizens,
// lighthouse lamp, iPhone acceptance, settlement/world registration or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ALDERQUAY_SPLIT_PIER_ID='r1:harbor-office:temperate:medium:002';
export function buildAlderquaySplitPierHarborOffice(){
 const b=sourcePlan('harbor-office','temperate','medium',2,'Alderquay Split-Pier Harbor Office',67,42,70);
 const wings=[
  ['north-curved-clearance-desk',14,3,50,18,15,'pack3:025'],
  ['west-quayside-seal-archive',4,11,24,47,12,'pack3:026'],
  ['east-mooring-registrar-office',41,10,61,48,16,'pack3:023'],
  ['center-customs-walkway',20,17,45,50,19,'pack3:025'],
  ['southwest-ledger-vault',8,45,31,61,13,'pack3:026'],
  ['southeast-wool-cargo-tally',35,46,59,62,14,'pack3:023'],
  ['northwest-storm-free-gallery',3,5,17,29,10,'pack3:025'],
  ['northeast-open-book-cabinet',54,4,63,31,17,'pack3:026']
 ];
 const courts=[[26,25,38,37],[12,48,20,55]],
  K=(x,z)=>x+','+z,indoor=new Set(),sky=new Set(),pier=new Set(),roofed=new Map(),
  directions={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++){sky.add(K(x,z));indoor.delete(K(x,z));}
 // Two substantive and physically contiguous source-only pier loops:
 // the east limb reaches Z68; the west runs to Z67. Both are connected
 // by a wide y0 source-stone crosslink, not imaginary or floating docks.
 for(const [x0,z0,x1,z1] of [[11,54,19,67],[46,54,54,68],[18,63,49,66]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!indoor.has(K(x,z))&&!sky.has(K(x,z)))pier.add(K(x,z));
 const inside=(x,z)=>indoor.has(K(x,z)),
  grounded=(x,z)=>inside(x,z)||sky.has(K(x,z))||pier.has(K(x,z));
 for(const key of new Set([...indoor,...sky,...pier])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {trueGroundedHarborPierSource:true,noLiveSeaDepthClaim:true});
 }
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(directions).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalStoneFootedHarborTimber:true,stormSealNotCertified:true});
 }
 for(const [name,x0,z0,x1,z1,y0,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!inside(x,z)||roofed.has(K(x,z)))continue;
   const dist=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=y0+Math.floor(dist/(name==='center-customs-walkway'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {realOriginalImmediateRoofBacking:true,engineeredLoadPathNotVerified:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalAlderquayRoofWing:name,originalPackMeshNotLiveMounted:true});
  }
 // Independently anchored timber bents inside actual roof footprints,
 // not decorative columns floating over a quay or source sky court.
 for(const [x,z] of [[19,8],[32,9],[47,8],[10,19],[15,40],
  [52,34],[26,55],[42,55],[12,53],[59,20],[9,12],[44,23]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Alderquay original timber bent misses real supported roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','physical-bent-under-original-roof');
 }
 for(const [axis,fix,lo,hi,gaps] of [
  ['x',23,18,48,[21,22,30,31,37,38,45,46]],
  ['x',43,18,49,[21,22,29,30,37,38,44,45]],
  ['z',18,14,50,[21,22,30,31,39,40,47,48]],
  ['z',47,8,59,[15,16,24,25,33,34,42,43,52,53]],
  ['x',16,6,29,[12,13,20,21,26,27]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fix:n,z=axis==='z'?fix:n;
  if(!inside(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {genuineHarborBookcaseDivider:true,tradeSimulationDisabled:true});
 }
 for(const room of [
  ['north-clearance-book-hall',15,4,49,17],
  ['west-stamped-record-locker',5,12,23,46],
  ['east-slip-and-berth-tally',42,11,60,47],
  ['central-passport-free-arcade',21,18,44,49],
  ['southwest-silent-cargo-archive',9,46,30,60],
  ['southeast-unpowered-tariff-office',36,47,58,61],
  ['northwest-dry-customs-porch',4,6,16,28],
  ['northeast-empty-harbor-books',55,5,62,30],
  ['open-main-stone-trade-yard',26,25,38,37],
  ['open-secondary-cargo-count-yard',12,48,20,55],
  ['west-genuine-woodless-pier',11,58,19,66],
  ['east-genuine-woodless-pier',46,58,54,67],
  ['paved-wharf-crossing',19,63,48,66]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-clearance-book-hall',33,3],
  ['north-clearance-book-hall','west-stamped-record-locker',23,15],
  ['north-clearance-book-hall','east-slip-and-berth-tally',43,15],
  ['north-clearance-book-hall','central-passport-free-arcade',33,18],
  ['west-stamped-record-locker','central-passport-free-arcade',23,32],
  ['east-slip-and-berth-tally','central-passport-free-arcade',43,32],
  ['central-passport-free-arcade','southwest-silent-cargo-archive',27,47],
  ['central-passport-free-arcade','southeast-unpowered-tariff-office',40,47],
  ['central-passport-free-arcade','open-main-stone-trade-yard',25,31],
  ['open-main-stone-trade-yard','east-slip-and-berth-tally',39,32],
  ['west-stamped-record-locker','open-secondary-cargo-count-yard',17,47],
  ['open-secondary-cargo-count-yard','southwest-silent-cargo-archive',19,56],
  ['southwest-silent-cargo-archive','west-genuine-woodless-pier',16,62],
  ['southeast-unpowered-tariff-office','east-genuine-woodless-pier',50,63],
  ['west-genuine-woodless-pier','paved-wharf-crossing',19,64],
  ['paved-wharf-crossing','east-genuine-woodless-pier',46,64],
  ['north-clearance-book-hall','northwest-dry-customs-porch',16,14],
  ['east-slip-and-berth-tally','northeast-empty-harbor-books',55,22]
 ]){
  if(!grounded(x,z))throw Error('Alderquay corridor portal missing original grounded floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Insert all glass AFTER portal clearance cuts. A true exterior y1
 // wood sill supports each TWO-high y2-3 upright glass bay; timber lintel
 // survives at y4. Never claim these Pack4 mesh/collider ABIs are installed.
 let paneCount=0,bayCount=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if((x*11+z*17)%10!==0)continue;
  const side=Object.entries(directions).find(([,d])=>!grounded(x+d[0],z+d[1]));
  if(!side||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side[0],
    {originalTwoHighHarborGlass:true,physicalPackMountPending:true});
   paneCount++;
  }bayCount++;
 }
 for(const [x,z,label] of [[32,8,'dry-cargo-pass'],[11,30,'inert-ship-count'],
  [50,34,'unused-customs-copper-stamp'],[23,55,'empty-tariff-crate'],
  [46,55,'blank-berth-tally'],[12,12,'silent-navigation-chart']])
  if(inside(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Original medium temperate harbor office with eight backed Pack3 roofs, 169-cell and 72-cell genuine paved source-open trade courts, two long all-grounded wharf limbs joined by a walkable stone cross-deck, and framed Pack4 upright glass. No active harbor, sea, customs or trade mechanics.',{
  originalBExclusiveWave:32,originalRoofWingCount:8,
  pavedSkyCourts:[169,72],extraUnroofedWharfCells:pier.size,
  realPavedPierFingers:2,framedTwoTierGlassBays:bayCount,
  uprightOriginalPack4GlassCells:paneCount,
  liveCustoms:false,realSeaOrBoats:false,activePortEconomy:false,
  trueWorldTerrainOrSavesEdited:false,
  physicalPackWeatherAndColliderApproved:false,
  actualIphonePwaAccepted:false,creatorArtworkAccepted:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
