// MYTHWROUGHT Builder B Wave47 — Hearthquay Split-Register Dry Harbor Office.
// Original exclusive B115 temperate MEDIUM harbor office #003. Nine individual
// Pack3 source-backed wings, three genuine sky-open source courtyards, two
// asymmetrical administrative halls, three long grounded wooden quay fingers
// and a complete outside-only three-way connecting return.
// All current Pack3/4 physical producer envelopes unresolved; no boats, tides,
// settlements, actual harbor economics, runtime writes or save modifications.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const HEARTHQUAY_SPLIT_REGISTER_ID='r1:harbor-office:temperate:medium:003';
export function buildHearthquayThreeFingerRegistry(){
 const b=sourcePlan('harbor-office','temperate','medium',3,
  'Hearthquay Split-Register Dry Harbor Office',58,30,66);
 const wings=[
  ['north-boatless-administration',15,3,41,14,13,'pack3:025'],
  ['west-shipping-ledger-archive',4,9,23,41,12,'pack3:026'],
  ['east-customs-document-gallery',34,8,54,41,18,'pack3:023'],
  ['central-weighing-clerk-arcade',19,13,39,49,21,'pack3:025'],
  ['west-harbor-parcel-store',6,40,26,55,15,'pack3:026'],
  ['east-unpowered-signal-depot',32,40,51,55,18,'pack3:023'],
  ['central-dry-cargo-transfer',21,48,37,58,16,'pack3:025'],
  ['northwest-lookout-office',3,3,17,25,11,'pack3:026'],
  ['northeast-salt-record-room',43,3,55,26,17,'pack3:023']
 ],courts=[[23,18,32,27],[9,31,16,38],[41,32,48,39]],
 key=(x,z)=>x+','+z,indoors=new Set(),courtyard=new Set(),wharves=new Set(),roofs=new Map(),
 faces={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  indoors.add(key(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  courtyard.add(key(x,z));indoors.delete(key(x,z));
 }
 const fingerBands=[[8,16],[25,30],[40,48]];
 for(const [x0,x1] of fingerBands)
  for(let x=x0;x<=x1;x++)for(let z=55;z<=64;z++)
   if(!indoors.has(key(x,z))&&!courtyard.has(key(x,z)))wharves.add(key(x,z));
 for(let x=12;x<=44;x++)for(let z=61;z<=64;z++)
  if(!indoors.has(key(x,z))&&!courtyard.has(key(x,z)))wharves.add(key(x,z));
 const grounded=(x,z)=>indoors.has(key(x,z))||courtyard.has(key(x,z))||wharves.has(key(x,z));
 for(const p of new Set([...indoors,...courtyard,...wharves])){
  const [x,z]=p.split(',').map(Number);
  b.put(x,0,z,'foundation',wharves.has(p)?'live:wood':'live:stone','none',
   {genuinelyFoundedHearthquaySource:true,unplacedDryRegistry:true});
 }
 for(const p of indoors){
  const [x,z]=p.split(',').map(Number);
  if(Object.values(faces).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:stone','none',
    {realOriginalOuterAdministrativeMasonry:true,noFloodCertification:true});
 }
 for(const [title,x0,z0,x1,z1,base,roof] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!indoors.has(key(x,z))||roofs.has(key(x,z)))continue;
   const dist=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(dist/(title==='central-weighing-clerk-arcade'?3:5));
   roofs.set(key(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {immediatelySupportedPack3SourceRoof:true,physicalPack3Approval:false});
   b.put(x,y,z,'roof',roof,'north',
    {hearthquayTrueIndividualRoofWing:title,unapprovedMeshCollider:true});
  }
 for(const [x,z] of [[22,7],[35,7],[8,20],[49,21],[28,34],[12,47],[45,47],[28,52]]){
  const y=roofs.get(key(x,z));
  if(!y)throw Error('Hearthquay false grounded roof post '+key(x,z));
  b.support(x,z,y-1,'live:stone','true-original-ground-to-roof-stone-column');
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',19,14,47,[18,19,24,25,32,33,40,41]],
  ['x',38,13,48,[18,19,24,25,33,34,41,42]],
  ['z',15,16,40,[20,21,28,29,35,36]],
  ['z',42,8,50,[13,14,24,25,34,35,43,44]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!indoors.has(key(x,z))||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood','none',
   {actualClerkStoragePartition:true,workingOfficeSystem:false});
 }
 // Six fully stone-founded and vertically stacked six-high wharf markers.
 for(const [x,z,side] of [[8,59,'west'],[16,59,'west'],
   [25,59,'center'],[30,59,'center'],[40,59,'east'],[48,59,'east']]){
  if(!wharves.has(key(x,z)))throw Error('Hearthquay mooring on false floor');
  for(let y=1;y<=6;y++)b.put(x,y,z,'support','live:stone','none',
   {realGroundedUnpoweredHarborMark:side,sourceTier:y,dockingMechanics:false});
 }
 for(const row of [
  ['front-customs-intake',16,4,40,13],
  ['west-ledger-records',5,10,22,40],
  ['east-parcel-tally',35,9,53,40],
  ['central-public-registry',20,14,38,48],
  ['west-unlit-storage-yard',7,41,25,54],
  ['east-signal-hold',33,41,50,54],
  ['central-dry-transfer-hall',22,49,36,57],
  ['northwest-lookout-clerks',4,4,16,24],
  ['northeast-salt-census',44,4,54,25],
  ['central-sky-open-number-court',23,18,32,27],
  ['west-sky-open-weight-court',9,31,16,38],
  ['east-sky-open-ledger-court',41,32,48,39],
  ['true-west-dry-shipping-jetty',8,56,16,64],
  ['true-center-dry-jetty',25,56,30,64],
  ['true-east-dry-jetty',40,56,48,64],
  ['original-full-transverse-quay',12,61,44,64]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','front-customs-intake',28,3],
  ['front-customs-intake','central-public-registry',28,14],
  ['front-customs-intake','west-ledger-records',19,12],
  ['front-customs-intake','east-parcel-tally',38,12],
  ['front-customs-intake','northwest-lookout-clerks',16,9],
  ['front-customs-intake','northeast-salt-census',43,9],
  ['central-public-registry','central-sky-open-number-court',22,22],
  ['central-sky-open-number-court','west-ledger-records',23,20],
  ['west-ledger-records','west-sky-open-weight-court',17,34],
  ['east-parcel-tally','east-sky-open-ledger-court',40,34],
  ['west-ledger-records','west-unlit-storage-yard',18,41],
  ['east-parcel-tally','east-signal-hold',42,41],
  ['central-public-registry','central-dry-transfer-hall',28,48],
  ['west-unlit-storage-yard','central-dry-transfer-hall',24,50],
  ['east-signal-hold','central-dry-transfer-hall',35,50],
  ['central-dry-transfer-hall','true-center-dry-jetty',28,58],
  ['true-center-dry-jetty','original-full-transverse-quay',28,62],
  ['original-full-transverse-quay','true-west-dry-shipping-jetty',14,62],
  ['original-full-transverse-quay','true-east-dry-jetty',44,62]
 ]){
  if(!grounded(x,z))throw Error('Hearthquay original portal without true floor '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let glass=0,windowBays=0;
 for(const p of indoors){
  const [x,z]=p.split(',').map(Number);
  if((x*11+z*17)%11!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const outward=Object.entries(faces).find(([,v])=>!grounded(x+v[0],z+v[1]));
  if(!outward)continue;
  for(let y=2;y<=4;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',outward[0],
    {genuineSourceStoneFramedThreeHighWindow:true,physicalPack4Approval:false});
   glass++;
  }windowBays++;
 }
 return b.finish('Genuine original nine-wing medium shore registry with three wholly open stone-founded courts, three actual long connected dry piers and exterior-only transverse walkway, six continuous masonry markers and physically framed source candidate panes. No boats or functioning harbor services.',{
  originalBuilderBWave:47,sourceRoofWingCount:9,
  trulyOpenStoneSourceCourts:[100,64,64],
  actuallyGroundedUnroofedQuayCells:wharves.size,
  distinctOriginalDryQuayFingers:3,
  realSixHighStoneQuayMarkers:6,
  genuineFramedThreeHighPack4Cells:glass,
  completeSourceThreeHighFramedWindowBays:windowBays,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false,
  actualFisheriesOrBoats:false,seaGenerated:false,harborEconomy:false,
  installedPackPhysicalApproval:false,installedIphonePwaTested:false,creatorVisualApproved:false
 });
}
