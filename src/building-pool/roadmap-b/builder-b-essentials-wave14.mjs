// MYTHWROUGHT Builder B exclusive B115 original Wave14 — Glassdune Split-Quay Registry.
// This is an original DESERT harbor office source with no actual sea, river, quay,
// customs economy, navigation mechanics, citizens, saves, settlement or world placement.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const GLASSDUNE_SPLITQUAY_REGISTRY_ID='r1:harbor-office:desert:small:002';
export function buildGlassduneSplitQuayRegistry(){
 const b=sourcePlan('harbor-office','desert','small',2,'Glassdune Split-Quay Registry',49,34,47);
 const wings=[
  {name:'northern-merchant-weighing-porch',r:[16,2,33,12],roofY:11},
  {name:'west-customs-shade-gallery',r:[3,9,19,30],roofY:10},
  {name:'east-record-and-cartography-office',r:[31,9,45,28],roofY:14},
  {name:'central-forked-ledger-aisle',r:[17,12,34,35],roofY:18},
  {name:'southwest-caravan-claims-desk',r:[7,30,24,43],roofY:12},
  {name:'southeast-sealed-map-vault',r:[27,31,42,44],roofY:11},
  {name:'low-west-ink-and-paper-drying',r:[2,29,12,41],roofY:9}
 ];
 const skyCourts=[[22,21,27,25],[13,35,16,38]],
  tower=[38,13,44,20],k=(x,z)=>x+','+z,ground=new Set(),roofed=new Map();
 for(const {r:[x0,z0,x1,z1]} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)ground.add(k(x,z));
 for(const [x0,z0,x1,z1] of skyCourts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)ground.delete(k(x,z));
 const has=(x,z)=>ground.has(k(x,z)),inTower=(x,z)=>
  x>=tower[0]&&x<=tower[2]&&z>=tower[1]&&z<=tower[3];
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {dryDesertSourceOnly:true,realShoreOrRiverVerified:false});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:stone','none',
    {handAuthoredSandstonePortico:true,actualSealApproved:false});
 }
 // Authored raised masonry signal room; physically grounded full-height
 // corner/perimeter piers, but NO working signal lamp or upper-floor stairs.
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  if(x!==tower[0]&&x!==tower[2]&&z!==tower[1]&&z!==tower[3])continue;
  for(let y=1;y<=24;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'wall','live:stone','none',
    {highRegistryTower:true,sourceMasonryColumn:true,upperRoomTraversable:false});
 }
 for(const [x,z] of [[41,13],[38,17],[44,17],[41,20]])b.opening(x,z);
 for(const [axis,fixed,from,to,gaps] of [
  ['x',18,12,35,[15,16,20,21,27,28]],
  ['x',33,12,35,[16,17,25,26,32,33]],
  ['z',13,17,34,[23,24,29,30]],
  ['z',30,9,42,[16,17,23,24,33,34]],
  ['x',12,29,42,[33,34,37,38]],
  ['z',28,4,20,[11,12,17,18]],
  ['x',28,31,43,[35,36,40,41]]
 ])for(let n=from;n<=to;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||inTower(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {sourceDryCustomsQueueSeparator:true,noActiveEconomy:true});
 }
 // Each isolated roof column gets an authored immediate y-1 bearing cell.
 // No Pack4 upright glazing masquerades as a roof or functional lantern.
 for(const {name,r:[x0,z0,x1,z1],roofY} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||inTower(x,z)||roofed.has(k(x,z)))continue;
   const y=roofY+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (name==='central-forked-ledger-aisle'?3:5));
   roofed.set(k(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {roofBearingXYZ:true,physicalLoadApproved:false});
   b.put(x,y,z,'roof','pack3:026','north',
    {originalRoofWing:name,weatherApproved:false});
  }
 for(let x=tower[0];x<=tower[2];x++)for(let z=tower[1];z<=tower[3];z++){
  const y=26+Math.floor(Math.min(x-tower[0],tower[2]-x,z-tower[1],tower[3]-z)/3);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
   {realSourceCrownSupport:true});
  b.put(x,y,z,'roof','pack3:025','north',
   {registryTowerCrown:true,sourceInertSignal:true});
 }
 for(const [x,z] of [[22,5],[30,5],[9,15],[10,23],[36,11],[17,40],[32,39],[8,35]]){
  const y=roofed.get(k(x,z));
  if(!y)throw Error('Glassdune grounded pier misses roof '+k(x,z));
  b.support(x,z,y-1,'live:wood','dry-registry-slope-pier');
 }
 // Verified exterior Pack4 vertical opening panes on original lower facades.
 const orientations={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [x,z,face] of [
  [21,2,'north'],[29,2,'north'],[3,15,'west'],[3,24,'west'],
  [45,25,'east'],[45,28,'east'],[12,43,'south'],[37,44,'south'],
  [2,35,'west'],[42,42,'east'],[2,38,'west'],[31,2,'north']
 ]){
  const [dx,dz]=orientations[face];
  if(!has(x,z)||has(x+dx,z+dz))throw Error('Glassdune low pane faces building '+k(x,z)+' '+face);
  b.pane(x,z,face);
 }
 // Eight high true UPRIGHT Pack4 manufacturer panes within authored tower
 // stone. An actual y17/19 stone sill/lintel remains under/over each pane.
 for(const [x,y,z,face] of [
  [40,18,13,'north'],[42,18,13,'north'],
  [38,18,15,'west'],[38,18,18,'west'],
  [44,18,15,'east'],[44,18,18,'east'],
  [40,18,20,'south'],[42,18,20,'south']
 ]){
  if(b.clear(x,y,z))throw Error('Glassdune high opening not cut from original tower wall '+x+','+z);
  b.cut(x,y,z);
  b.put(x,y,z,'window','pack4:030',face,
   {originalRaisedRegistryPane:true,sourceUpright:true,
    physicalPackApproved:false,glowEnabled:false,realWeatherSeal:false});
 }
 for(const room of [
  ['north-merchant-ledger-porch',17,3,32,12],
  ['western-paper-customs-gallery',4,10,18,29],
  ['eastern-survey-records',32,10,44,27],
  ['central-forked-claims-hall',18,13,33,34],
  ['southwest-caravan-claims',8,31,23,42],
  ['southeast-sealed-registry-vault',28,32,41,43],
  ['west-low-ink-drying-gallery',3,30,11,40],
  ['east-ground-register-ring',39,14,43,19]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-merchant-ledger-porch',25,2],
  ['north-merchant-ledger-porch','western-paper-customs-gallery',18,12],
  ['north-merchant-ledger-porch','central-forked-claims-hall',25,13],
  ['north-merchant-ledger-porch','eastern-survey-records',33,12],
  ['western-paper-customs-gallery','central-forked-claims-hall',18,22],
  ['eastern-survey-records','central-forked-claims-hall',33,25],
  ['eastern-survey-records','east-ground-register-ring',41,13],
  ['central-forked-claims-hall','southwest-caravan-claims',20,30],
  ['central-forked-claims-hall','southeast-sealed-registry-vault',30,31],
  ['southwest-caravan-claims','west-low-ink-drying-gallery',12,34],
  ['southeast-sealed-registry-vault','eastern-survey-records',39,28],
  ['central-forked-claims-hall','east-ground-register-ring',38,17]
 ]){
  if(!has(x,z))throw Error('Glassdune portal lacks authored foundation '+k(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,name] of [
  [25,7,'dry-balance-scale-inert'],[9,18,'no-fee-charter-booth'],
  [40,24,'unlit-map-survey-desk'],[17,38,'empty-permit-archive'],
  [33,38,'inert-cargo-seal-cabinet'],[7,34,'spare-ink-rack']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original seven-wing desert split-quay registry with physically grounded raised signal/census tower, eight authentic high upright Pack4 openings, forked ledger hall and two source-open daylight courts; wholly inert trade and dry-shore architecture',{
  exclusiveOwner:'Builder B original 1B Wave14',originalRoofWings:7,
  physicalOpenCourts:[30,16],raisedUprightTowerWindows:8,
  originalElevatedTowerNavigable:false,
  poweredSignalEnabled:false,realWaterAndShoreline:false,
  actualEconomyEnabled:false,realWeatherLoadCertified:false,
  physicalPackProducerAccepted:false,creatorArtApproved:false,
  liveIphoneTested:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
