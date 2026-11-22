// MYTHWROUGHT Builder B Wave38 — Sleetgrove Rafter-Lattice Winter Barn.
// A physically grounded LARGE SNOW farm-barn, exclusive frozen B115
// r1:farm-barn:snow:large:003. Eleven non-identical source-supported
// Pack3 roof wing families, three full-sky paved loading courtyards,
// original stone-ground 4-branch ladder access with a traversable final
// crossrail, and four solid stone 7x7 ice-break masonry piers.
// No live crop/ice/weather/animals, Pack physical producer, terrain edits,
// original-game placement, iPhone PWA, citizen AI or saved-world writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SLEETGROVE_RAFTER_LATTICE_ID='r1:farm-barn:snow:large:003';
export function buildSleetgroveRafterLatticeBarn(){
 const b=sourcePlan('farm-barn','snow','large',3,'Sleetgrove Rafter-Lattice Winter Barn',79,49,80);
 const wings=[
 ['north-battened-wheat-ledger',18,3,62,20,16,'pack3:025'],
 ['west-sheltered-wool-store',4,11,32,62,13,'pack3:026'],
 ['east-cold-grain-gallery',47,10,74,62,19,'pack3:023'],
 ['central-braced-lattice-walk',25,18,55,66,23,'pack3:025'],
 ['southwest-capped-woodlocker',8,57,34,73,15,'pack3:026'],
 ['southeast-stone-barrel-storage',43,57,70,74,17,'pack3:023'],
 ['northwest-overhang',3,5,21,36,10,'pack3:025'],
 ['northeast-empty-ice-chest',64,5,76,37,19,'pack3:026'],
 ['south-treble-gantry',29,62,53,75,17,'pack3:025'],
 ['west-outside-workshop',2,43,18,74,11,'pack3:026'],
 ['east-dormant-workshop',63,43,77,73,15,'pack3:023']
 ],courts=[[30,27,48,41],[13,51,23,61],[55,51,66,61]],
 K=(x,z)=>x+','+z,
 indoor=new Set(),sky=new Set(),loading=new Set(),supported=new Map(),
 sides={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   sky.add(K(x,z));indoor.delete(K(x,z));
 }
 // Four original groundstone ladder arms, with an actual 5-cell thick
 // south crossrail and source paths into both winter timber courtyards.
 for(const [x0,z0,x1,z1] of [[12,68,21,78],[28,68,34,78],[44,68,50,78],[58,68,68,78],[18,75,61,78]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!indoor.has(K(x,z))&&!sky.has(K(x,z)))loading.add(K(x,z));
 const enclosed=(x,z)=>indoor.has(K(x,z)),ground=(x,z)=>enclosed(x,z)||sky.has(K(x,z))||loading.has(K(x,z));
 for(const key of new Set([...indoor,...sky,...loading])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {actualOriginalWinterGrainStoneGround:true,sourceSnowNeverEdited:true});
 }
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(sides).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:wood','none',
    {physicalSourceGableEnvelope:true,realSnowLoadNotCertified:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!enclosed(x,z)||supported.has(K(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(d/(name==='central-braced-lattice-walk'?3:5));
   supported.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalImmediateLoadBearingSource:true,engineeredSnowRatingUnmeasured:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalSleetgroveRoofWing:name,realPackMeshPending:true});
  }
 // Four stone pier clusters on ORIGINAL indoor floor, fully y0 grounded.
 // The baffles are not placed inside true open-sky courtyards.
 for(const [x,z] of [[24,24],[53,24],[24,44],[53,45]]){
   if(!enclosed(x,z))throw Error('Sleetgrove ice-break pier outside real indoor source '+K(x,z));
   b.support(x,z,7,'live:stone','original-cold-wind-limestone-pier');
 }
 for(const [x,z] of [[24,8],[40,8],[57,8],[12,20],[21,48],
  [61,42],[27,60],[48,62],[9,63],[70,24],[17,17],
  [35,20],[46,21],[36,70],[53,71],[13,33],[66,36],[8,51]]){
  const y=supported.get(K(x,z));
  if(!y)throw Error('Sleetgrove permanent original timber member lacks actual roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','fully-source-grounded-original-rafter-bent');
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',28,20,61,[24,25,34,35,45,46,55,56]],
  ['x',50,19,62,[22,23,34,35,45,46,55,56]],
  ['z',20,18,62,[25,26,36,37,48,49,58,59]],
  ['z',57,7,73,[16,17,28,29,40,41,52,53,64,65]],
  ['x',19,7,36,[13,14,25,26,32,33]],
  ['x',67,11,37,[17,18,28,29,33,34]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!enclosed(x,z)||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {sourceBarnSeparationPanel:true,workingConveyorsDisabled:true});
 }
 for(const room of [
  ['north-empty-grain-census',19,4,61,19],
  ['west-unheated-wool-vault',5,12,31,61],
  ['east-empty-seed-drying-hall',48,11,73,61],
  ['central-winter-rafter-spine',26,19,54,65],
  ['southwest-nonsorting-storeroom',9,58,33,72],
  ['southeast-dormant-barrel-house',44,58,69,73],
  ['northwest-roofed-loading-porch',4,6,20,35],
  ['northeast-unused-snow-register',65,6,75,36],
  ['south-unpowered-transfer-spine',30,63,52,74],
  ['western-timber-repair-aisle',3,44,17,73],
  ['eastern-windproof-workshop',64,44,76,72],
  ['center-stone-snow-open-court',30,27,48,41],
  ['west-open-dry-ice-free-yard',13,51,23,61],
  ['east-open-dry-grain-yard',55,51,66,61],
  ['outdoor-ladder-left-granary',12,69,21,77],
  ['outdoor-ladder-center-left',28,69,34,77],
  ['outdoor-ladder-center-right',44,69,50,77],
  ['outdoor-ladder-right-granary',58,69,68,77],
  ['real-south-ladder-crossbar',18,75,61,78]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-empty-grain-census',40,3],
  ['north-empty-grain-census','west-unheated-wool-vault',28,17],
  ['north-empty-grain-census','east-empty-seed-drying-hall',50,17],
  ['north-empty-grain-census','central-winter-rafter-spine',40,20],
  ['west-unheated-wool-vault','central-winter-rafter-spine',28,34],
  ['east-empty-seed-drying-hall','central-winter-rafter-spine',50,34],
  ['central-winter-rafter-spine','southwest-nonsorting-storeroom',31,57],
  ['central-winter-rafter-spine','southeast-dormant-barrel-house',46,57],
  ['central-winter-rafter-spine','south-unpowered-transfer-spine',39,64],
  ['central-winter-rafter-spine','center-stone-snow-open-court',29,34],
  ['center-stone-snow-open-court','east-empty-seed-drying-hall',49,35],
  ['west-unheated-wool-vault','west-open-dry-ice-free-yard',18,50],
  ['west-open-dry-ice-free-yard','southwest-nonsorting-storeroom',20,62],
  ['east-empty-seed-drying-hall','east-open-dry-grain-yard',61,50],
  ['east-open-dry-grain-yard','southeast-dormant-barrel-house',61,62],
  ['southwest-nonsorting-storeroom','outdoor-ladder-left-granary',17,68],
  ['south-unpowered-transfer-spine','outdoor-ladder-center-left',31,68],
  ['south-unpowered-transfer-spine','outdoor-ladder-center-right',47,68],
  ['southeast-dormant-barrel-house','outdoor-ladder-right-granary',63,68],
  ['outdoor-ladder-left-granary','real-south-ladder-crossbar',21,76],
  ['outdoor-ladder-center-left','real-south-ladder-crossbar',32,76],
  ['real-south-ladder-crossbar','outdoor-ladder-center-right',47,76],
  ['real-south-ladder-crossbar','outdoor-ladder-right-granary',61,76],
  ['west-unheated-wool-vault','western-timber-repair-aisle',17,47],
  ['east-empty-seed-drying-hall','eastern-windproof-workshop',64,48],
  ['north-empty-grain-census','northwest-roofed-loading-porch',20,14],
  ['east-empty-seed-drying-hall','northeast-unused-snow-register',65,18]
 ]){
  if(!ground(x,z))throw Error('Sleetgrove original portal lacks real y0 floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Real y1 timber sill, upright y2..4 glass triple, solid y5 header,
 // outward air; all panes authored after original two-high portals.
 let windowCells=0,windowBays=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if((x*19+z*11)%13!==0)continue;
  const side=Object.entries(sides).find(([,d])=>!ground(x+d[0],z+d[1]));
  if(!side||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3,4]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side[0],
    {genuineTripleSourceWinterBarnGlazing:true,realPack4ColliderNotAccepted:true});
   windowCells++;
  }windowBays++;
 }
 for(const [x,z,label] of [[40,8,'idle-snow-wheat-scale'],[13,33,'rolled-dry-wool'],
   [61,40,'unused-ice-spade'],[32,59,'empty-sledge-register'],
   [52,60,'inert-hay-hook'],[70,16,'closed-winter-leaf-label']])
  if(enclosed(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Original large SNOW farm-barn with eleven independently supported timber roof wings, THREE genuinely stone-grounded paved sky-open courts (285+121+132), four original source-bent stone wind piers, physically crosslinked four-arm stone loading ladder, complete three-high upright Pack4 windows. Not a functioning snow farm.',{
  originalBuilderBOnlyWave:38,independentSourceRoofWings:11,
  groundedPavedUnroofedCourts:[285,121,132],
  physicallyPavedLoadingLadderCells:loading.size,originalGroundLoadingArms:4,
  groundedStoneWindbreakPosts:4,windowThreeHighBays:windowBays,
  completeVerticalPack4Cells:windowCells,
  activeHarvestSystem:false,workingGrainCrane:false,realSnowLoadAccepted:false,
  workingCitizensOrAnimals:false,actualPackColliderApproved:false,
  creatorVisualAccepted:false,realIphonePwaTested:false,
  sourceTerrainModified:false,worldPlacement:false,productionRegistered:false,
  saveSchema1Written:false
 });
}
