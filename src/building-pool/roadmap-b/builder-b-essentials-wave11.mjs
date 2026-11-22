// Builder B 1B Wave11: original Mossveil Twin-Court Spore Granary.
// SOURCE ONLY; no crops, creatures, farming, gameplay, weather seals, world or save writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const MOSSVEIL_TWINCOURT_BARN_ID='r1:farm-barn:enchanted-forest:small:002';
export function buildMossveilTwinCourtSporeGranary(){
 const b=sourcePlan('farm-barn','enchanted-forest','small',2,
  'Mossveil Twin-Court Spore Granary',48,30,45);
 const wings=[
  ['north-seed-sorting',18,2,37,13,12,'pack3:023'],
  ['west-bark-mill',4,8,20,22,10,'pack3:025'],
  ['east-spore-weaving',34,9,44,31,14,'pack3:023'],
  ['southwest-drying-rafters',9,22,23,41,12,'pack3:025'],
  ['southeast-raised-grain-store',24,28,40,42,11,'pack3:023'],
  ['central-canopy-crossing',19,12,35,32,18,'pack3:025'],
  ['low-moss-tools',2,27,12,38,9,'pack3:023']
 ],courts=[[25,20,29,25],[12,32,14,35]],
  K=(x,z)=>x+','+z,foot=new Set(),roofMap=new Map();
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const key of foot){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {unchangedForestGeneration:true,actualTerrainSlopePending:true});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood','none',
    {wovenBarkSource:true,realLoadSealCertified:false});
 }
 // Deliberate 2-cell gaps through genuine source partitions.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',20,12,30,[15,16,22,23,27,28]],
  ['x',34,11,31,[13,14,19,20,27,28]],
  ['z',29,12,40,[17,18,26,27,34,35]],
  ['z',13,18,37,[23,24,30,31,35,36]],
  ['x',12,27,40,[29,30,35,36]],
  ['z',22,9,23,[13,14,19,20]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{sourceBarkDivider:true});
 }
 // Each original Pack3 roof cell has an actual authored cell directly beneath it.
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofMap.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
     (name==='central-canopy-crossing'?3:4));
   roofMap.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalBearingCell:true,physicalLoadApproved:false});
   b.put(x,y,z,'roof',asset,'north',
    {namedWing:name,originalRoof:true,weatherSealApproved:false});
  }
 for(const [x,z] of [[23,5],[32,5],[9,12],[10,19],[38,15],[40,25],
  [18,26],[21,37],[29,36],[36,37],[5,31],[8,36]]){
  const y=roofMap.get(K(x,z));
  if(!y)throw Error('Mossveil timber post not under real source roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','mossveil-grounded-forked-roof-pier');
 }
 // Real vertical Pack4 openings on only outward-facing source facades.
 for(const [x,z,side] of [
  [24,2,'north'],[33,2,'north'],[4,16,'west'],[44,18,'east'],
  [44,27,'east'],[40,37,'east'],[15,41,'south'],[30,42,'south'],
  [2,33,'west'],[9,39,'west'],[37,5,'east'],[40,42,'south']
 ]){
  const delta={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]}[side],
   [dx,dz]=delta;
  if(!has(x,z)||has(x+dx,z+dz))
   throw Error('Mossveil window does not face exterior air '+K(x,z)+' '+side);
  b.pane(x,z,side);
 }
 for(const room of [
  ['north-seed-sort',19,3,36,12],
  ['west-bark-mill',5,9,19,21],
  ['east-spore-weaving',35,10,43,30],
  ['central-covered-branch-crossing',20,13,34,31],
  ['southwest-spore-drying',10,23,22,40],
  ['southeast-raised-grain',25,29,39,41],
  ['west-low-tools',3,28,11,37],
  ['central-inert-spore-ledger',20,16,34,25]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-seed-sort',27,2],
  ['north-seed-sort','west-bark-mill',19,11],
  ['north-seed-sort','central-covered-branch-crossing',27,13],
  ['north-seed-sort','east-spore-weaving',35,12],
  ['west-bark-mill','southwest-spore-drying',15,22],
  ['east-spore-weaving','central-covered-branch-crossing',34,20],
  ['central-covered-branch-crossing','southwest-spore-drying',22,31],
  ['central-covered-branch-crossing','southeast-raised-grain',29,29],
  ['southwest-spore-drying','west-low-tools',11,32],
  ['central-covered-branch-crossing','central-inert-spore-ledger',24,18],
  ['southeast-raised-grain','east-spore-weaving',39,30]
 ]){
  if(!has(x,z))throw Error('Mossveil source passage missing actual foundation '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,purpose] of [
  [27,7,'inert-seed-log'],[10,14,'bark-press-shell-unpowered'],
  [39,20,'weaving-bench-inert'],[32,36,'empty-cask-cabinet'],
  [8,34,'moss-tool-rack'],[17,37,'dry-spore-baskets']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 return b.finish('Seven original staggered enchanted-forest farm-barn wings surrounding a 30-column open grove and separate 12-column drying alcove, with physically roofed seed sorting, bark mill, weaving, drying and grain rooms; inert craft fixtures only',{
  originalSourceOwner:'Builder B 1B Wave11',
  skyOpenGroveColumns:30,skyOpenDryingColumns:12,
  fungusGrowthEnabled:false,machinesEnabled:false,
  liveForestModified:false,realTerrainChecked:false,
  packPhysicalCollisionCertified:false,realWeatherSealCertified:false,
  creatorArtApproved:false,actualIphoneTested:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
