// MYTHWROUGHT Builder B exclusive original Wave15: Icehaven Bifurcated Snow Customs House.
// Spatially authored source design: inert warning mast, snowbreak halls and dry
// source ledgers. No sea/ocean, ice physics, custom charges, citizens, navigation,
// shoreline gameplay, settlement placement, saves or powered lights.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ICEHAVEN_WINTER_CUSTOMS_ID='r1:harbor-office:snow:small:002';
export function buildIcehavenBifurcatedSnowCustoms(){
 const b=sourcePlan('harbor-office','snow','small',2,
  'Icehaven Bifurcated Snow Customs House',48,30,49);
 const wings=[
  {name:'north-ice-passenger-customs',r:[16,2,34,13],roofY:13,asset:'pack3:025'},
  {name:'west-broken-wharf-signals',r:[3,8,20,29],roofY:11,asset:'pack3:026'},
  {name:'east-snow-load-records',r:[32,12,44,31],roofY:14,asset:'pack3:025'},
  {name:'central-windbreak-exchange',r:[16,13,34,36],roofY:18,asset:'pack3:026'},
  {name:'southwest-dry-salvage',r:[7,31,23,44],roofY:11,asset:'pack3:025'},
  {name:'southeast-frozen-map-storage',r:[27,30,41,45],roofY:12,asset:'pack3:025'},
  {name:'low-west-icecraft-shed',r:[2,29,13,42],roofY:9,asset:'pack3:026'}
 ];
 // Two noninterchangeable real holes in ground, not decorative texture patches.
 const courts=[[23,22,28,27],[12,36,14,40]],
  marker=[42,16],K=(x,z)=>x+','+z,ground=new Set(),roofed=new Map();
 for(const {r:[x0,z0,x1,z1]} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)ground.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)ground.delete(K(x,z));
 const has=(x,z)=>ground.has(K(x,z)),atMarker=(x,z)=>x===marker[0]&&z===marker[1];
 for(const k of ground){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {snowLandscapeUnaltered:true,actualFrozenShorelineVerified:false});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','pack2:013','north',
    {handAuthoredWinterCladding:true,thermalPerformanceCertified:false});
 }
 // Asymmetrical dividing halls and physically clear source passages.
 for(const [axis,fixed,from,to,gaps] of [
  ['x',20,12,36,[15,16,23,24,30,31]],
  ['x',32,13,36,[17,18,26,27,32,33]],
  ['z',13,16,34,[21,22,28,29]],
  ['z',31,8,42,[16,17,23,24,31,32,37,38]],
  ['x',13,29,42,[33,34,38,39]],
  ['z',28,4,21,[11,12,17,18]],
  ['x',27,31,45,[35,36,40,41]]
 ])for(let i=from;i<=to;i++){
  const x=axis==='x'?fixed:i,z=axis==='z'?fixed:i;
  if(!has(x,z)||atMarker(x,z)||gaps.includes(i))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalSnowBreakPartition:true,thermalDeviceActive:false});
 }
 // Original seven staggered roof bands; raised central ridge, not a flat cube.
 // The northeast iceway warning post has a specifically omitted roof column.
 for(const {name,r:[x0,z0,x1,z1],roofY,asset} of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofed.has(K(x,z))||atMarker(x,z))continue;
   const y=roofY+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (name==='central-windbreak-exchange'?3:4));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalBearingTimber:true,roofSnowLoadVerified:false});
   b.put(x,y,z,'roof',asset,'north',{originalWinterRoof:name,
    loadApproved:false,weatherSealAccepted:false});
  }
 // Grounded 21-cell warning mast, not an imaginary light or powered pole:
 // all levels 1..20 are real structural source blocks with one Pack3 cap.
 if(!has(...marker))throw Error('Icehaven winter mast is not grounded');
 b.support(marker[0],marker[1],20,'live:stone','icehaven-unpowered-anchored-warning-mast');
 b.put(marker[0],21,marker[1],'roof','pack3:025','north',
  {unlitWarningMastCap:true,windLoadPending:true});
 for(const [x,z] of [[22,5],[30,5],[9,15],[11,23],[38,12],[40,27],
  [17,39],[33,40],[7,35],[19,16],[31,16]]){
  const y=roofed.get(K(x,z));if(!y)throw Error('Icehaven winter pier not under real roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','original-winter-snow-roof-pier');
 }
 const faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [x,z,face] of [
  [20,2,'north'],[30,2,'north'],[3,15,'west'],[3,24,'west'],
  [44,20,'east'],[44,27,'east'],[12,44,'south'],[34,45,'south'],
  [2,36,'west'],[41,42,'east'],[2,40,'west'],[26,2,'north']
 ]){
  const [dx,dz]=faces[face];
  if(!has(x,z)||has(x+dx,z+dz))throw Error('Icehaven pane lacks actual outside air '+K(x,z)+' '+face);
  b.pane(x,z,face);
 }
 for(const room of [
  ['north-frost-passenger-customs',17,3,33,12],
  ['west-ice-warning-register',4,9,19,28],
  ['east-snow-cargo-ledger',33,13,43,30],
  ['central-winter-cross-exchange',17,14,33,35],
  ['southwest-inert-salvage-inventory',8,32,22,43],
  ['southeast-dry-frozen-charts',28,31,40,44],
  ['low-west-old-rigging-shed',3,30,12,41],
  ['central-windbreak-logbooks',20,16,31,29]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-frost-passenger-customs',26,2],
  ['north-frost-passenger-customs','west-ice-warning-register',19,12],
  ['north-frost-passenger-customs','central-winter-cross-exchange',26,13],
  ['north-frost-passenger-customs','east-snow-cargo-ledger',33,13],
  ['west-ice-warning-register','central-winter-cross-exchange',20,23],
  ['east-snow-cargo-ledger','central-winter-cross-exchange',32,26],
  ['central-winter-cross-exchange','southwest-inert-salvage-inventory',19,31],
  ['central-winter-cross-exchange','southeast-dry-frozen-charts',29,31],
  ['west-ice-warning-register','low-west-old-rigging-shed',11,29],
  ['low-west-old-rigging-shed','southwest-inert-salvage-inventory',12,37],
  ['southwest-inert-salvage-inventory','southeast-dry-frozen-charts',27,36],
  ['central-winter-cross-exchange','central-windbreak-logbooks',26,18]
 ]){
  if(!has(x,z))throw Error('Icehaven source portal has no actual winter footings '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,purpose] of [
  [24,8,'unpowered-ice-crossing-ledger'],[10,17,'dry-signal-ropes'],
  [39,19,'closed-cargo-folio'],[16,39,'frozen-harbor-claim-box'],
  [33,38,'rolled-chart-container'],[8,36,'original-wooden-rigging-shelf']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 return b.finish('Original bifurcated snow-customs house with seven staggered real Pack3 roofs, high winter central exchange, fully grounded unlit stone warning mast, dual open snowdrift courts and source-visible timber storm walls. No actual harbor gameplay',{
  exclusiveOwner:'Builder B original 1B Wave15',
  winterRoofWings:7,openSkyCourtCells:[36,15],
  groundedWarningMastHeight:21,warningBeaconPowered:false,
  naturalBiomeSnowGenerationUnchanged:true,
  worldIceOrShorelineActive:false,weatherSealedApproved:false,
  physicalPackAABBApproved:false,actualIphoneTested:false,
  creatorArtApproved:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
