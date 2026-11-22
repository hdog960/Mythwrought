// MYTHWROUGHT Builder B Wave16 — original Frostline Eight-Wing Icewatch Fishing Lodge.
// SOURCE ONLY: no fishing AI, ice/water world, boats, settlements, saves or powered beacon.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const FROSTLINE_ICEWATCH_ID='r1:fishing-lodge:snow:small:002';
export function buildFrostlineEightWingIcewatchLodge(){
 const b=sourcePlan('fishing-lodge','snow','small',2,'Frostline Eight-Wing Icewatch Fishing Lodge',52,33,48);
 const wings=[
  ['north-sled-charter',8,3,28,14,12,'pack3:025'],
  ['east-icewatch-longhouse',30,3,47,23,15,'pack3:026'],
  ['central-ice-chart-corridor',18,13,39,33,18,'pack3:023'],
  ['west-tackle-mending-run',3,15,18,40,10,'pack3:025'],
  ['south-cold-drying-hall',13,31,34,45,12,'pack3:026'],
  ['eastern-net-vault',37,23,49,42,14,'pack3:023'],
  ['north-west-signal-porch',3,4,9,25,9,'pack3:025'],
  ['south-east-hook-shed',30,37,45,46,11,'pack3:026']
 ],courts=[[23,21,28,26],[40,30,43,34]],mast=[44,12],
  K=(x,z)=>x+','+z,foot=new Set(),roofed=new Map();
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z)),inMast=(x,z)=>x===mast[0]&&z===mast[1];
 for(const key of foot){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{originalSnowAndIceTerrainUnmodified:true});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood','none',
    {windShieldOriginal:true,insulationPhysicallyUnverified:true});
 }
 for(const [axis,fixed,a,z,gaps] of [
  ['z',14,8,28,[12,13,20,21,25,26]],
  ['x',18,15,39,[18,19,25,26,32,33]],
  ['x',39,15,42,[19,20,25,26,36,37]],
  ['z',31,13,34,[17,18,27,28,32,33]],
  ['x',30,31,46,[34,35,41,42]],
  ['z',23,30,49,[34,35,42,43]],
  ['x',9,5,25,[10,11,19,20]]
 ])for(let n=a;n<=z;n++){
  const x=axis==='x'?fixed:n,Z=axis==='z'?fixed:n;
  if(!has(x,Z)||inMast(x,Z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,Z))
   b.put(x,y,Z,'partition','live:wood','none',{actualSnowBreakDivider:true,gameHeat:false});
 }
 // Eight independently pitched Pack3 roof masses with immediate real y-1 supports.
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||inMast(x,z)||roofed.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (name==='central-ice-chart-corridor'?3:4));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalDirectRoofSupport:true,snowLoadCertification:false});
   b.put(x,y,z,'roof',asset,'north',
    {frostlineRoofWing:name,producerWeatherSealApproved:false});
  }
 // Original real grounded 25-tier unpowered wayfinding signal with physical cap.
 if(!has(...mast))throw Error('Frostline mast absent foundation');
 b.support(mast[0],mast[1],25,'live:stone','original-icewatch-signal-mast');
 b.put(mast[0],26,mast[1],'roof','pack3:025','north',
  {signalCapUnpowered:true,producerWindLoadUnverified:true});
 for(const [x,z] of [[13,7],[24,7],[35,8],[43,19],[10,21],[15,35],
  [25,41],[42,38],[33,42],[6,18],[46,34]]){
  const y=roofed.get(K(x,z));if(!y)throw Error('Frostline rafter post lacks roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','original-grounded-winter-rafters');
 }
 const dir={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]};
 for(const [x,z,side] of [
  [12,3,'north'],[22,3,'north'],[34,3,'north'],[45,3,'north'],
  [3,5,'west'],[3,20,'west'],[3,34,'west'],
  [49,30,'east'],[49,39,'east'],[47,18,'east'],
  [20,45,'south'],[35,46,'south'],[45,45,'east']
 ]){
  const [dx,dz]=dir[side];
  if(!has(x,z)||has(x+dx,z+dz))
   throw Error('Frostline glass not exposed to original outside '+K(x,z)+' '+side);
  b.pane(x,z,side);
 }
 for(const room of [
  ['north-sled-fare',9,4,27,13],
  ['east-patrol-chart-room',31,4,46,22],
  ['central-windbreak-passage',19,14,38,32],
  ['west-nets-repair-run',4,16,17,39],
  ['south-dried-catch-inert',14,32,33,44],
  ['east-ice-vault-inert',38,24,48,41],
  ['northwest-warning-porch',4,5,8,24],
  ['southeast-empty-gear-bays',31,38,44,45]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-sled-fare',19,3],
  ['north-sled-fare','northwest-warning-porch',8,11],
  ['north-sled-fare','central-windbreak-passage',23,13],
  ['central-windbreak-passage','east-patrol-chart-room',34,18],
  ['central-windbreak-passage','west-nets-repair-run',18,24],
  ['central-windbreak-passage','south-dried-catch-inert',24,32],
  ['central-windbreak-passage','east-ice-vault-inert',38,28],
  ['east-patrol-chart-room','east-ice-vault-inert',42,23],
  ['west-nets-repair-run','south-dried-catch-inert',16,33],
  ['south-dried-catch-inert','southeast-empty-gear-bays',32,40],
  ['east-ice-vault-inert','southeast-empty-gear-bays',40,39],
  ['northwest-warning-porch','west-nets-repair-run',7,19]
 ]){
  if(!has(x,z))throw Error('Frostline unsupported source two-high door '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,kind] of [
  [18,8,'unlit-sled-ledger'],[40,9,'inert-ice-chart-stand'],
  [8,25,'dry-rope-hooks'],[26,39,'salted-catch-crates-empty'],
  [44,32,'unused-fishing-cages'],[35,41,'winter-gear-repair']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,kind,'pack4:059');
 return b.finish('Eight distinct attached cold-harbor source wings circling two genuine absent-ground ice courts, high grounded unlit navigation mast, real backed varied Pack3 roofing, and thirteen true upright Pack4 windows; source-only winter fishing station',{
  originalOwner:'MYTHWROUGHT Builder B Wave16',
  originalRoofWings:8,openIceCourts:[36,20],groundedSignalMastHeight:26,
  fishingActive:false,liveOceanOrIcePhysics:false,iceTerrainModified:false,
  boatsActive:false,beaconPowered:false,producerPhysicalPackAccepted:false,
  snowLoadOrWeatherSealed:false,actualIphoneTested:false,
  creatorArtApproved:false,worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
