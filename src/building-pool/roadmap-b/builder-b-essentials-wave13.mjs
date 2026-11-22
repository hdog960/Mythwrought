// MYTHWROUGHT Builder B 1B Wave13: original Glimmerbough Split-Sun Orchid House.
// Authorial glazed source architecture only; no plants/AI/growth, magic lighting,
// biome replacement, settlements, live Pack collision, world or save writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const GLIMMERBOUGH_SPLITSUN_ORCHID_ID='r1:greenhouse:enchanted-forest:small:002';
export function buildGlimmerboughSplitSunOrchidHouse(){
 const b=sourcePlan('greenhouse','enchanted-forest','small',2,
  'Glimmerbough Split-Sun Orchid House',46,30,47);
 // Five linked glass-growing pavilions, two smaller detached-feeling wings,
 // two genuinely sky-open courts and a high enclosed seed hall.
 const wings=[
  ['north-prism-seed-hall',17,2,36,14,13,'pack3:023'],
  ['west-low-moss-orchids',3,8,19,26,10,'pack3:025'],
  ['east-lantern-terrace',31,10,43,33,14,'pack3:023'],
  ['central-light-splitting-spine',17,13,33,35,18,'pack3:025'],
  ['southwest-bloom-press',8,29,24,44,12,'pack3:023'],
  ['southeast-dry-specimen-vault',27,30,40,45,11,'pack3:025'],
  ['west-attached-trefoil-porch',2,28,13,41,9,'pack3:023']
 ],sky=[[21,21,26,26],[11,34,14,37]],
 K=(x,z)=>x+','+z,foot=new Set(),roofed=new Map(),fac={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(const [x0,z0,x1,z1] of sky)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const q of foot){
  const [x,z]=q.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {rootsUnchanged:true,originalForestBiomeUntouched:true});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood','none',
    {sourceGreenhouseFrame:true,weatherSealCertified:false});
 }
 // Continuous authentic UPRIGHT manufacturer glass in three-cell-high outer
 // bays, never roof or horizontal skylight proxies. Corner pane orientation
 // uses one deterministic outward-facing direction and real wooden sill/lintel.
 let windowBays=0,panes=0;
 for(const q of foot){
  const [x,z]=q.split(',').map(Number);
  const outside=Object.entries(fac).find(([,v])=>!has(x+v[0],z+v[1]));
  // The north 2-high entry at (26,2) retains a solid framed arch;
  // stacked panes need a grounded sill, not air below an active doorway.
  if(!outside||((x*7+z*11)%4!==0)||(x===26&&z===2))continue;
  const [side]=outside;
  for(let y=2;y<=4;y++){
   if(b.clear(x,y,z))throw Error('Glimmerbough original glass has no exterior source frame '+K(x,z));
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side,
    {originalUprightThreeCellGlass:true,sourceWindowBay:true,
     liveCollisionCertified:false,weatherSealed:false,lightEmission:false});
   panes++;
  }
  windowBays++;
 }
 // Each interior partition is 4-high; authored doors remain two high or more.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',19,13,35,[16,17,24,25,30,31]],
  ['x',31,13,34,[17,18,27,28]],
  ['z',14,17,36,[22,23,29,30]],
  ['z',31,8,40,[16,17,23,24,31,32]],
  ['x',13,28,41,[32,33,38,39]],
  ['z',26,3,20,[11,12,16,17]],
  ['x',26,30,44,[35,36,39,40]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{originalBotanicRoomDivider:true});
 }
 // Opaque original pitched Pack3 tile roofs have immediate source supports,
 // explicitly separate from thousands of visible upright Pack4 glass facets.
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofed.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (name==='central-light-splitting-spine'?3:4));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {realPack3Backing:true,physicalLoadCertified:false});
   b.put(x,y,z,'roof',asset,'north',{sourceRoofWing:name,weatherSealCertified:false});
  }
 for(const [x,z] of [
  [22,5],[31,5],[9,13],[11,21],[36,17],[39,28],
  [18,38],[31,40],[6,34],[9,38],[30,17]
 ]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Glimmerbough source corner pier missing original roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','original-orchid-house-structural-pier');
 }
 for(const row of [
  ['north-seed-collection',18,3,35,13],
  ['west-low-moss-pots',4,9,18,25],
  ['east-lantern-workshop',32,11,42,32],
  ['central-sunlight-crossing',18,14,32,34],
  ['southwest-preserved-spore-drying',9,30,23,43],
  ['southeast-inert-seed-vault',28,31,39,44],
  ['west-trefoil-porch',3,29,12,40],
  ['northglass-display-ledger',20,6,33,12]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-seed-collection',26,2],
  ['north-seed-collection','west-low-moss-pots',18,12],
  ['north-seed-collection','central-sunlight-crossing',26,14],
  ['north-seed-collection','east-lantern-workshop',33,12],
  ['west-low-moss-pots','central-sunlight-crossing',19,23],
  ['east-lantern-workshop','central-sunlight-crossing',31,27],
  ['central-sunlight-crossing','southwest-preserved-spore-drying',20,31],
  ['central-sunlight-crossing','southeast-inert-seed-vault',30,31],
  ['west-low-moss-pots','west-trefoil-porch',10,28],
  ['west-trefoil-porch','southwest-preserved-spore-drying',13,33],
  ['southwest-preserved-spore-drying','southeast-inert-seed-vault',27,38],
  ['north-seed-collection','northglass-display-ledger',23,8]
 ]){
  if(!has(x,z))throw Error('Glimmerbough real source portal missing foundation '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,kind] of [
  [25,7,'unpowered-orchid-table'],[10,18,'inert-moss-collection-bench'],
  [38,19,'empty-lantern-case'],[20,36,'dry-specimen-shelves'],
  [8,35,'wooden-spore-pots'],[33,38,'sealed-seed-ledger']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,kind,'pack4:059');
 return b.finish('Seven unique enchanted-forest greenhouse pavilions; two real open courtyards, upright 3-tall original Pack4 glazed external bays, separate opaque supported Pack3 roofs, and inert soil/seed study chambers',{
  authoringLane:'Builder B 1B Wave13',originalUprightGlassBays:windowBays,
  originalVerticalGlassCellsBeforeEntrances:panes,
  sourceOpenPrismCourtColumns:36,sourceOpenSporeCourtColumns:16,
  plantGrowthEnabled:false,lightEmittersActive:false,
  actualForestBiomeEdited:false,realWeatherSealCertified:false,
  packPhysicalCollisionApproved:false,actualIphoneTested:false,
  creatorArtApproved:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
