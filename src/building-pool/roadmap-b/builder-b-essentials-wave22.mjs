// MYTHWROUGHT Builder B Wave22 — Duneharp Spiral Granary and Threshing Court.
// ORIGINAL LARGE DESERT 1B B115 source. Broad roofless WALKABLE threshing
// yard, an intersecting paved sun-drying terrace and two independently
// founded tall stone grain silos. No actual crops, farming, machinery,
// wind power, production, settlements, terrain, saves or game registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const DUNEHARP_SPIRAL_GRANARY_ID='r1:farm-barn:desert:large:002';
export function buildDuneharpSpiralGranary(){
 const b=sourcePlan('farm-barn','desert','large',2,'Duneharp Spiral Granary',69,48,66);
 const wings=[
  ['north-harvest-arc',13,2,52,15,14,'pack3:023'],
  ['west-shaded-chaff-press',3,10,20,39,11,'pack3:025'],
  ['east-sack-stacking-hall',48,10,63,43,15,'pack3:026'],
  ['south-sun-dried-grain-vault',21,47,51,61,13,'pack3:023'],
  ['southwest-roped-bale-warehouse',5,42,27,59,12,'pack3:025'],
  ['northeast-high-lookout-gallery',48,4,63,21,18,'pack3:026'],
  ['south-east-weighing-shed',52,42,65,61,10,'pack3:023']
 ];
 const courts=[[23,20,45,42],[12,45,19,53]],silos=[
  {name:'northwest-saltproof-grain-silo',x0:9,z0:15,x1:15,z1:23,height:28},
  {name:'southeast-spiral-grain-silo',x0:56,z0:31,x1:62,z1:39,height:32}
 ],K=(x,z)=>x+','+z,wing=new Set(),paved=new Set(),paths=new Set(),roofed=new Map(),
 face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  wing.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  paved.add(K(x,z));wing.delete(K(x,z));
 }
 const route=(x0,z0,x1,z1)=>{for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  if(!wing.has(K(x,z))&&!paved.has(K(x,z)))paths.add(K(x,z));};
 route(31,13,35,23);route(17,29,25,33);route(43,29,52,33);
 route(32,40,38,49);route(16,39,20,47);route(44,50,57,54);
 route(16,4,23,16);route(48,18,58,26);
 const ground=(x,z)=>wing.has(K(x,z))||paved.has(K(x,z))||paths.has(K(x,z));
 for(const key of new Set([...wing,...paved,...paths])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{originalDryThreshingFooting:true,realDesertBiomeUnmodified:true});
 }
 for(const key of wing){
  const [x,z]=key.split(',').map(Number);
  if([[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:stone','none',
    {originalGranaryPerimeterMasonry:true,realWeatherSealPending:true});
 }
 // Real two HIGH round-corner stone silos, at actual existing y0 footings,
 // one 28 tall and the other 32 tall, NOT floating decor or working elevators.
 const siloPerimeter=(s,x,z)=>x>=s.x0&&x<=s.x1&&z>=s.z0&&z<=s.z1&&
  (x===s.x0||x===s.x1||z===s.z0||z===s.z1)&&
  !((x===s.x0||x===s.x1)&&(z===s.z0||z===s.z1));
 for(const s of silos)for(let x=s.x0;x<=s.x1;x++)for(let z=s.z0;z<=s.z1;z++){
  if(!siloPerimeter(s,x,z))continue;
  if(!ground(x,z))b.put(x,0,z,'foundation','live:stone','none',{sourceStoneSiloBearing:true});
  for(let y=1;y<=s.height;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'wall','live:stone','none',
    {originalContinuousGrainSilo:s.name,realUpperFloorWalkable:false});
  if(b.clear(x,s.height+1,z))b.put(x,s.height+1,z,'roof','pack3:025','north',
   {supportedOriginalStoneSiloCrown:s.name,actualWindPower:false});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const key=K(x,z);if(!wing.has(key)||roofed.has(key))continue;
  const inTallSilo=silos.some(s=>x>=s.x0&&x<=s.x1&&z>=s.z0&&z<=s.z1);
  if(inTallSilo)continue;
  const d=Math.min(x-x0,x1-x,z-z0,z1-z);
  const y=base+Math.floor(d/(name==='north-harvest-arc'?3:5));
  roofed.set(key,y);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
   {originalImmediateLateralRafter:true,roofSpanLoadNotApproved:true});
  b.put(x,y,z,'roof',asset,'north',{originalGranaryRoofWing:name,sourceOnlyWeatherEnvelope:true});
 }
 for(const [x,z] of [[17,7],[28,7],[43,7],[7,22],[16,35],[55,16],[61,25],
  [32,53],[44,57],[11,53],[21,52],[59,48]]){
  const y=roofed.get(K(x,z));if(!y)throw Error('Duneharp physical rafter post misses source roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','original-large-granary-grounded-post');
 }
 // Semi-open ground circulation is never blocked by fake curtains:
 // sparse internal partitions, plus two-cell authentic bypass openings.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['z',14,17,50,[23,24,32,33,42,43]],
  ['x',19,15,38,[20,21,27,28,33,34]],
  ['x',50,13,42,[18,19,26,27,35,36]],
  ['z',48,21,51,[25,26,32,33,39,40,46,47]],
  ['z',43,52,64,[55,56,61,62]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!wing.has(K(x,z))||silos.some(s=>x>=s.x0&&x<=s.x1&&z>=s.z0&&z<=s.z1)||gaps.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{originalDryThreshingPartition:true,noProcessingAI:true});
 }
 for(const room of [
 ['north-harvest-census',14,3,51,14],
 ['west-dry-chaff-press',4,11,19,38],
 ['east-sack-warehouse',49,11,62,42],
 ['southern-stone-grain-vault',22,48,50,60],
 ['southwest-bale-archive',6,43,26,58],
 ['northeast-roofed-viewpoint',49,5,62,20],
 ['southeast-spare-grain-shed',53,43,64,60],
 ['large-open-stone-threshing-yard',23,20,45,42],
 ['west-roofless-sun-drying-court',12,45,19,53],
 ['northwest-grounded-silo-shell',10,16,14,22],
 ['southeast-grounded-silo-shell',57,32,61,38]
 ])b.room(...room);
 for(const [from,to,x,z] of [
 ['outside','north-harvest-census',32,2],
 ['north-harvest-census','west-dry-chaff-press',19,12],
 ['north-harvest-census','east-sack-warehouse',50,13],
 ['north-harvest-census','large-open-stone-threshing-yard',33,15],
 ['west-dry-chaff-press','large-open-stone-threshing-yard',20,30],
 ['east-sack-warehouse','large-open-stone-threshing-yard',48,30],
 ['large-open-stone-threshing-yard','southern-stone-grain-vault',34,47],
 ['southern-stone-grain-vault','southwest-bale-archive',23,49],
 ['southern-stone-grain-vault','southeast-spare-grain-shed',52,52],
 ['west-dry-chaff-press','west-roofless-sun-drying-court',16,42],
 ['west-roofless-sun-drying-court','southwest-bale-archive',16,54],
 ['northeast-roofed-viewpoint','north-harvest-census',49,11],
 ['east-sack-warehouse','northeast-roofed-viewpoint',54,21],
 ['west-dry-chaff-press','northwest-grounded-silo-shell',15,20],
 ['east-sack-warehouse','southeast-grounded-silo-shell',56,35]
 ]){
  if(!ground(x,z)&&!silos.some(s=>x>=s.x0&&x<=s.x1&&z>=s.z0&&z<=s.z1))
   throw Error('Duneharp portal missing genuine y0 stone '+K(x,z));
  if(b.clear(x,0,z))b.put(x,0,z,'foundation','live:stone','none',{originalSiloOrGranaryPortalGround:true});
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let windows=0;
 for(const key of wing){
  const [x,z]=key.split(',').map(Number);
  if(silos.some(s=>x>=s.x0&&x<=s.x1&&z>=s.z0&&z<=s.z1)||(x*7+z*13)%11!==0)continue;
  const side=Object.entries(face).find(([,d])=>!ground(x+d[0],z+d[1]));
  if(!side||[1,2,3].some(y=>b.clear(x,y,z)))continue;
  b.pane(x,z,side[0]);windows++;
 }
 for(const [x,z,name] of [[31,7,'dry-wind-chime-weights'],[11,23,'inert-threshing-flail'],
  [55,29,'empty-grain-scales'],[28,52,'sealed-seed-register'],
  [16,50,'dry-sunseed-tarp'],[58,51,'unpowered-coach-wheel']])
  if(wing.has(K(x,z))&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original LARGE desert agricultural campus with seven distinct physically backed roof wings, a 529-column entirely walkable and roofless raised stone threshing hardstand and separate 72-column paved drying yard, two separate real 28/32-tier octagonal stone silos, all linked by grounded source paths, real Pack4 upright panes; no live farming or production.',{
  exclusiveOwner:'Builder B original 1B Wave22 large desert farm-barn',
  originalGranaryWingCount:7,groundedThreshingCourtCells:[529,72],
  genuineGroundPavedRouteCells:paths.size,originalSiloWallTiers:[28,32],
  realExteriorUprightGlassCount:windows,
  liveGrainProduction:false,actuallyOperatingSilo:false,grainTransportActive:false,
  workingWindPower:false,upperTowerStairsInstalled:false,
  realDesertTerrainSlopeVerified:false,physicalPackCollisionCertified:false,
  weatherBearingCertified:false,actualIphoneTested:false,
  creatorArtApproved:false,worldPlacement:false,productionRegistered:false,
  saveSchema1Written:false
 });
}
