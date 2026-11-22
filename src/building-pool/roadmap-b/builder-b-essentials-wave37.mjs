// MYTHWROUGHT Builder B Wave37 — Silverpine Four-Court Winterglass.
// ORIGINAL frozen B115 large snow greenhouse; no real live registry.
// TEN distinct Pack3 source-backed wing shapes; FOUR independently source-
// grounded sky-open pedestrian gardens, a true U-shaped paved exterior
// winter walkway and full FIVE-cell upright Pack4 glass bays with real
// solid y1 sill and y7 timber lintel, authored AFTER all portal cuts.
// Cold-weather simulation, crops, water, selection/collider Pack approval,
// original PWA, save writes and settlements are NOT claimed or modified.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SILVERPINE_FOUR_COURT_ID='r1:greenhouse:snow:large:003';
export function buildSilverpineFourCourtWinterglass(){
 const b=sourcePlan('greenhouse','snow','large',3,
  'Silverpine Four-Court Winterglass',78,50,78);
 const wings=[
  ['north-frost-index-library',17,3,60,19,16,'pack3:025'],
  ['west-dry-ice-seed-aisle',4,12,30,60,13,'pack3:026'],
  ['east-cold-flora-research',49,11,72,60,19,'pack3:023'],
  ['central-silent-clearstory',24,19,53,62,23,'pack3:025'],
  ['southwest-dormant-bloom-house',8,54,36,71,15,'pack3:026'],
  ['southeast-winter-root-gallery',41,54,70,72,17,'pack3:023'],
  ['northwest-snow-entry-colonnade',3,5,19,34,10,'pack3:025'],
  ['northeast-unheated-frost-study',64,5,75,34,19,'pack3:026'],
  ['south-middle-snow-quiet-conduit',30,61,51,72,16,'pack3:025'],
  ['western-cold-harvest-folio',2,45,13,70,10,'pack3:026']
 ],courts=[[30,27,47,40],[12,51,21,60],[57,51,66,60],[30,61,49,66]],
 K=(x,z)=>x+','+z,indoor=new Set(),sky=new Set(),outside=new Set(),roofHeights=new Map(),
 sides={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  sky.add(K(x,z));indoor.delete(K(x,z));
 }
 // Real roofless U-shaped pedestrian promenade; all y0 stone cells are
 // directly grounded and y1 headspace remains clear across the U.
 for(const [x0,z0,x1,z1] of [[15,65,23,76],[55,65,64,76],[22,73,56,76]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!indoor.has(K(x,z))&&!sky.has(K(x,z)))outside.add(K(x,z));
 const enclosed=(x,z)=>indoor.has(K(x,z)),
  ground=(x,z)=>enclosed(x,z)||sky.has(K(x,z))||outside.has(K(x,z));
 for(const k of new Set([...indoor,...sky,...outside])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {physicalSourceWinterGardenPaving:true,actualSnowBiomeTerrainUntouched:true});
 }
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(sides).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:wood','none',
    {realTimberWindowEnvelope:true,realThermalWallPerformanceNotCertified:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!enclosed(x,z)||roofHeights.has(K(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(wing==='central-silent-clearstory'?3:5));
   roofHeights.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalImmediateSupportedPack3Roof:true,realSnowLoadRatingPending:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalSilverpineRoofWing:wing,genuinePack3CandidateSourceOnly:true});
  }
 // Ground-to-rafter real timber posts; every post explicitly verifies
 // a source roof overhead and stays outside all four sky openings.
 for(const [x,z] of [
  [22,8],[38,8],[55,8],[10,24],[17,43],[58,41],
  [27,58],[53,59],[11,59],[69,22],[17,15],[48,22],
  [34,20],[43,56],[35,68],[48,69],[7,65],[13,32]
 ]){
  const y=roofHeights.get(K(x,z));
  if(!y)throw Error('Silverpine real original timber bent not under roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','authentic-timber-girder-footed-to-source-ground');
 }
 // Physical open-ended wooden screening; no right-of-way or doorway is
 // fictional because the actual source opening() is authored later.
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',27,18,60,[22,23,32,33,43,44,52,53]],
  ['x',50,18,60,[22,23,32,33,43,44,52,53]],
  ['z',19,17,60,[25,26,35,36,46,47,56,57]],
  ['z',54,8,70,[16,17,28,29,39,40,49,50,61,62]],
  ['x',17,7,34,[13,14,23,24,29,30]],
  ['x',65,11,35,[15,16,24,25,31,32]],
  ['z',63,14,67,[18,19,29,30,42,43,54,55]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!enclosed(x,z)||holes.includes(n))continue;
  for(let y=1;y<=6;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {sourceSnowGardenTimberScreen:true,realCropVinesNotSimulated:true});
 }
 for(const row of [
  ['north-frost-botanical-index',18,4,59,18],
  ['west-winter-seed-storage',5,13,29,59],
  ['east-wind-free-growth-study',50,12,71,59],
  ['middle-open-timber-greenhouse',25,20,52,61],
  ['southwest-dry-orchid-archive',9,55,35,70],
  ['southeast-quiet-cold-seed-shed',42,55,69,71],
  ['northwest-winter-wool-porch',4,6,18,33],
  ['northeast-inert-snow-study',65,6,74,33],
  ['southern-central-unused-planter',31,62,50,71],
  ['western-cold-harvest-folio-room',3,46,12,69],
  ['main-open-stone-snow-court',30,27,47,40],
  ['west-open-winter-seed-court',12,51,21,60],
  ['east-open-frost-rest-court',57,51,66,60],
  ['southern-roofless-winter-court',30,61,49,66],
  ['outer-west-original-stone-walk',15,68,23,75],
  ['outer-east-original-stone-walk',55,68,64,75],
  ['original-stone-south-U-crosspath',22,73,56,76]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-frost-botanical-index',39,3],
  ['north-frost-botanical-index','west-winter-seed-storage',27,16],
  ['north-frost-botanical-index','east-wind-free-growth-study',50,16],
  ['north-frost-botanical-index','middle-open-timber-greenhouse',39,19],
  ['west-winter-seed-storage','middle-open-timber-greenhouse',27,34],
  ['east-wind-free-growth-study','middle-open-timber-greenhouse',50,34],
  ['middle-open-timber-greenhouse','southwest-dry-orchid-archive',32,54],
  ['middle-open-timber-greenhouse','southeast-quiet-cold-seed-shed',45,54],
  ['middle-open-timber-greenhouse','southern-central-unused-planter',38,62],
  ['middle-open-timber-greenhouse','main-open-stone-snow-court',29,34],
  ['main-open-stone-snow-court','east-wind-free-growth-study',48,34],
  ['west-winter-seed-storage','west-open-winter-seed-court',18,50],
  ['west-open-winter-seed-court','southwest-dry-orchid-archive',19,61],
  ['east-wind-free-growth-study','east-open-frost-rest-court',61,50],
  ['east-open-frost-rest-court','southeast-quiet-cold-seed-shed',61,61],
  ['southern-central-unused-planter','southern-roofless-winter-court',40,61],
  ['southern-roofless-winter-court','southwest-dry-orchid-archive',29,65],
  ['southern-roofless-winter-court','southeast-quiet-cold-seed-shed',50,65],
  ['southwest-dry-orchid-archive','outer-west-original-stone-walk',19,69],
  ['southeast-quiet-cold-seed-shed','outer-east-original-stone-walk',60,69],
  ['outer-west-original-stone-walk','original-stone-south-U-crosspath',23,74],
  ['original-stone-south-U-crosspath','outer-east-original-stone-walk',55,74],
  ['north-frost-botanical-index','northwest-winter-wool-porch',18,15],
  ['east-wind-free-growth-study','northeast-inert-snow-study',65,17],
  ['west-winter-seed-storage','western-cold-harvest-folio-room',12,47]
 ]){
  if(!ground(x,z))throw Error('Silverpine actual two-high passage lacks grounded y0 original floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Four-sided FIVE-tier y2..6 upright external glazing: deliberate y1
 // supporting sill and y7 original solid header, authored only after all
 // portal cuts. No fake flat roof Pack4 materials are introduced.
 let glassCells=0,glassBays=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if((x*17+z*13)%12!==0)continue;
  const exposure=Object.entries(sides).find(([,p])=>!ground(x+p[0],z+p[1]));
  if(!exposure||[1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3,4,5,6]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',exposure[0],
    {genuineSilverpineFiveHighWindow:true,realInstalledPackColliderUnknown:true});
   glassCells++;
  }glassBays++;
 }
 for(const [x,z,item] of [
  [39,8,'dormant-snow-root-census'],[11,36,'unheated-plant-labels'],
  [62,41,'folded-crop-atlas'],[27,59,'silent-winter-bell'],
  [49,58,'dry-garden-trellis-kit'],[69,16,'unpowered-pollen-lantern']
 ])if(enclosed(x,z)&&b.clear(x,1,z))b.fitting(x,z,item,'pack4:059');
 return b.finish('Large ORIGINAL snow winterglass greenhouse with ten distinct immediately backed Pack3 roof wings, FOUR entirely open-sky grounded source-walkable snow courts (252+100+100+120), true pedestrian U-promenade connected west to east, and authentic upright five-high Pack4 source glass with y1 wooden sill and y7 header. No plant simulation, climate machinery or real ice approval.',{
  originalBuilderBOnlyWave:37,originalSourceRoofWings:10,
  originalFourGenuinePavedSkyCourts:[252,100,100,120],
  genuineOpenSouthUPromenadeCells:outside.size,
  pedestrianUPromenadeBranches:2,sourceGroundedRafterBents:18,
  completeOriginalFiveHighGlassBays:glassBays,
  originalUprightPack4WindowCells:glassCells,
  plantGrowthSimulated:false,climateGeneratorsPowered:false,
  realIceAndSnowLoadCertified:false,actualPackCollisionCertified:false,
  sourceTerrainSavesModified:false,originalIphonePwaAccepted:false,
  creatorArtworkAccepted:false,productionRegistered:false,
  worldPlacement:false,saveSchema1Written:false
 });
}
