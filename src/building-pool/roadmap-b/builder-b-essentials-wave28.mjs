// MYTHWROUGHT Builder B Wave28 — Driftgale T-Landing Snow Lodge.
// ORIGINAL frozen-B115 medium snow fishing lodge. T-shaped ground-paved
// load apron, two complete sky-exposed walkable courts, eight stepped
// source-bearing roof wings and physically framed two-tier upright glass.
// Inert source geometry only; no ice safety, fishing, boats, AI, settlement,
// save writes, weatherproofing, or real iPhone/WebGL acceptance.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const DRIFTGALE_T_LANDING_ID='r1:fishing-lodge:snow:medium:003';
export function buildDriftgaleTLandingSnowLodge(){
 const b=sourcePlan('fishing-lodge','snow','medium',3,'Driftgale T-Landing Snow Lodge',64,39,67);
 const wings=[
 ['north-ice-route-logroom',17,3,45,17,14,'pack3:025'],
 ['west-net-and-winter-tackle',4,10,24,46,11,'pack3:026'],
 ['east-sled-skiff-service',40,9,58,46,16,'pack3:023'],
 ['central-frost-arcade',20,16,44,49,18,'pack3:025'],
 ['southwest-timber-trap-house',9,43,30,58,12,'pack3:026'],
 ['southeast-dry-salt-chamber',33,43,55,59,14,'pack3:023'],
 ['northwest-wool-sorting-booth',3,5,18,24,9,'pack3:026'],
 ['northeast-unused-ice-signal',51,4,60,28,16,'pack3:025']
 ],courts=[[25,24,37,37],[14,46,20,52]],
 K=(x,z)=>x+','+z,roofFoot=new Set(),sky=new Set(),apron=new Set(),roofed=new Map(),
 compass={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},marker=[54,19];
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)roofFoot.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   sky.add(K(x,z));roofFoot.delete(K(x,z));
  }
 // True T landing apron, one long south arm and broad transverse landing bar.
 // Its ALL physical stone y0 cells remain unroofed; no unsupported ice floor.
 for(const [x0,z0,x1,z1] of [[29,55,35,65],[17,61,48,65]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!roofFoot.has(K(x,z))&&!sky.has(K(x,z)))apron.add(K(x,z));
 const inside=(x,z)=>roofFoot.has(K(x,z)),
  grounded=(x,z)=>inside(x,z)||sky.has(K(x,z))||apron.has(K(x,z));
 for(const key of new Set([...roofFoot,...sky,...apron])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {originalDryIceQuayStone:true,actualIceThicknessUncertified:true});
 }
 for(const key of roofFoot){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(compass).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalWinterDockExterior:true,thermalEnvelopeUnverified:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!inside(x,z)||roofed.has(K(x,z))||(x===marker[0]&&z===marker[1]))continue;
   const rise=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(rise/(wing==='central-frost-arcade'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalYMinusOneRoofBearing:true,fullStructuralWeatherLoadPending:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalDriftgaleRoofWing:wing,sourceOnlyIceWeather:false});
  }
 if(!inside(...marker))throw Error('Driftgale marker has no real ground');
 b.support(marker[0],marker[1],22,'live:stone','true-unpowered-winter-dock-marker');
 b.put(marker[0],23,marker[1],'roof','pack3:025','north',
  {genuineSourceStoneMarkerCrown:true,poweredSignal:false});
 for(const [x,z] of [[21,7],[33,7],[42,7],[9,19],[13,35],
  [49,33],[28,54],[44,53],[12,51],[57,16],[10,12]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Driftgale authentic source post misses roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','genuine-grounded-lodge-rafter-post');
 }
 for(const [axis,fixed,lo,hi,pass] of [
  ['x',23,17,45,[21,22,28,29,37,38,42,43]],
  ['x',41,15,46,[19,20,29,30,38,39]],
  ['z',17,17,45,[23,24,31,32,39,40]],
  ['z',44,9,55,[16,17,25,26,36,37,44,45]],
  ['x',16,5,23,[11,12,18,19]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!inside(x,z)||pass.includes(n)||(x===marker[0]&&z===marker[1]))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {winterNetHallScreen:true,noLiveCatch:true});
 }
 for(const row of [
  ['north-ice-route-surveyor',18,4,44,16],
  ['west-stored-net-loom',5,11,23,45],
  ['east-vacant-skiff-garage',41,10,57,45],
  ['central-unheated-net-arcade',21,17,43,48],
  ['southwest-empty-trap-bunks',10,44,29,57],
  ['southeast-frozen-harvest-ledger',34,44,54,58],
  ['northwest-snow-canvas-porch',4,6,17,23],
  ['northeast-inert-flare-desk',52,5,59,27],
  ['main-grounded-sky-ice-yard',25,24,37,37],
  ['west-open-snow-gear-court',14,46,20,52],
  ['outer-south-stone-loading-stem',29,59,35,64],
  ['outer-east-stone-loading-bar',36,61,48,65]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-ice-route-surveyor',31,3],
  ['north-ice-route-surveyor','west-stored-net-loom',23,14],
  ['north-ice-route-surveyor','east-vacant-skiff-garage',41,14],
  ['north-ice-route-surveyor','central-unheated-net-arcade',30,17],
  ['west-stored-net-loom','central-unheated-net-arcade',23,30],
  ['east-vacant-skiff-garage','central-unheated-net-arcade',41,30],
  ['central-unheated-net-arcade','southwest-empty-trap-bunks',26,44],
  ['central-unheated-net-arcade','southeast-frozen-harvest-ledger',38,44],
  ['central-unheated-net-arcade','main-grounded-sky-ice-yard',24,29],
  ['main-grounded-sky-ice-yard','east-vacant-skiff-garage',38,29],
  ['west-stored-net-loom','west-open-snow-gear-court',17,46],
  ['west-open-snow-gear-court','southwest-empty-trap-bunks',18,53],
  ['southwest-empty-trap-bunks','outer-south-stone-loading-stem',29,58],
  ['southeast-frozen-harvest-ledger','outer-south-stone-loading-stem',34,59],
  ['outer-south-stone-loading-stem','outer-east-stone-loading-bar',35,62],
  ['north-ice-route-surveyor','northwest-snow-canvas-porch',17,13],
  ['east-vacant-skiff-garage','northeast-inert-flare-desk',52,20]
 ]){
  if(!grounded(x,z))throw Error('Driftgale source passage lacks physical floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let panes=0,bays=0;
 for(const key of roofFoot){
  const [x,z]=key.split(',').map(Number);
  if((x===marker[0]&&z===marker[1])||(x*13+z*7)%10!==0)continue;
  const exposure=Object.entries(compass).find(([,d])=>!grounded(x+d[0],z+d[1]));
  if(!exposure||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',exposure[0],
    {realTwoTierWinterGlass:true,producerCollisionUncertified:true});
   panes++;
  }bays++;
 }
 for(const [x,z,purpose] of [[31,8,'dry-catch-ledger'],[11,25,'frozen-rope-rack'],
  [50,34,'blank-ice-sled-chart'],[23,52,'empty-warmup-bench'],
  [44,54,'unused-bait-cabinet'],[10,10,'silent-chime']])
  if(inside(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 return b.finish('Original medium snow lodge with eight source-supported asymmetric roofs, two genuine 182/49-cell paved roofless handling courts and one actually walkable 2-arm T loading apron; framed upright Pack4 glass, backed source roof timbers and inert raised winter marker; no fish, ice simulation or boats.',{
  builderBExclusiveWave:28,sourceRoofWingCount:8,
  sourcePavedSkyCourts:[182,49],realPavedTApproachCells:apron.size,
  groundedMarkerStoneTiers:22,framedUprightGlassBays:bays,
  genuineUprightPack4Cells:panes,
  actualIceBearingVerified:false,workingFishCatch:false,
  workingSkiffs:false,animatedIceSignals:false,
  sourceTerrainOrSaveEdited:false,physicalPackColliderApproved:false,
  originalGameIphoneApproved:false,creatorVisualApproved:false,
  productionRegistered:false,worldPlacement:false,saveSchema1Written:false
 });
}
