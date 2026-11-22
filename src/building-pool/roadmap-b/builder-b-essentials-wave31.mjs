// MYTHWROUGHT Builder B Wave31 — Willowglass Triple-Atrium Conservatory.
// ORIGINAL LARGE temperate 1B B115. Nine separately backed Pack3 roof
// wings around THREE fully ground-paved, connected sky-open courts, 4-high
// real vertical Pack4:030 window bays. Optional dormant timber dividers
// have physically open doorways; no crops/AI/water/heat, real world, saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const WILLOWGLASS_TRIPLE_ATRIUM_ID='r1:greenhouse:temperate:large:003';
export function buildWillowglassTripleAtriumConservatory(){
 const b=sourcePlan('greenhouse','temperate','large',3,
  'Willowglass Triple-Atrium Conservatory',73,45,73);
 const wings=[
  ['north-sunroom-library',15,3,57,18,15,'pack3:025'],
  ['western-vine-drying-crescent',4,12,27,54,12,'pack3:026'],
  ['east-temperate-flora-aisle',43,11,67,55,16,'pack3:023'],
  ['central-cooling-arcade',23,17,49,57,20,'pack3:025'],
  ['southwest-seed-archive',7,51,33,67,13,'pack3:026'],
  ['southeast-pollen-cabinet',42,50,67,68,14,'pack3:023'],
  ['northwest-open-light-porch',3,4,18,30,9,'pack3:025'],
  ['northeast-fern-study-porch',59,4,69,28,17,'pack3:026'],
  ['south-middle-sprout-exchange',28,53,46,67,16,'pack3:023']
 ],courts=[[28,26,43,40],[13,49,22,57],[53,49,62,57]],
 K=(x,z)=>x+','+z,indoor=new Set(),sky=new Set(),roofed=new Map(),
 sides={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++){
   sky.add(K(x,z));indoor.delete(K(x,z));
  }
 const enclosed=(x,z)=>indoor.has(K(x,z)),grounded=(x,z)=>enclosed(x,z)||sky.has(K(x,z));
 for(const k of new Set([...indoor,...sky])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {physicalTemperateGlasshouseFloor:true,noBiomeTerrainModifications:true});
 }
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(sides).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:wood','none',
    {genuineWillowglassEnvelopeTimber:true,weatherSealUnapproved:true});
 }
 // Each distinct roof wing carries a direct solid y-1 source bearer.
 // Large temperate raised aisles and meadow-facing roofs cannot be
 // transparent horizontal "window" placeholders.
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!enclosed(x,z)||roofed.has(K(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(d/(name==='central-cooling-arcade'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {realSourceFloorBackedRafter:true,completeOriginalLoadCertification:false});
   b.put(x,y,z,'roof',asset,'north',
    {originalWillowglassRoofWing:name,Pack3RealWeatherGatePending:true});
  }
 // Permanent timber bents, each source-connected all the way from
 // original y0 foundation to the immediately backed roof.
 for(const [x,z] of [[20,7],[35,8],[52,8],[9,23],[15,39],[58,31],
  [26,61],[53,62],[12,61],[65,18],[64,43],[8,12],
  [32,19],[45,20],[38,53],[33,58]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Willowglass permanent timber bent misses authentic roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','true-grounded-large-greenhouse-bent');
 }
 // Four branch trellises and a central cross divider. Real door breaks
 // preserve source pedestrian continuity and accessibility to all courts.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',26,18,55,[21,22,29,30,37,38,45,46,52,53]],
  ['x',45,17,56,[19,20,28,29,38,39,48,49]],
  ['z',18,16,57,[21,22,31,32,40,41,48,49,55,56]],
  ['z',52,7,66,[15,16,24,25,34,35,44,45,55,56,63,64]],
  ['x',17,10,52,[14,15,24,25,33,34,43,44]],
  ['x',61,12,55,[16,17,26,27,37,38,48,49]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!enclosed(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {authenticDormantVineTrellis:true,noPlantGrowthAI:true});
 }
 // Nine genuine rooms plus THREE completely unroofed botanist courts.
 for(const row of [
  ['north-unpowered-glass-library',16,4,56,17],
  ['west-dry-root-sampling',5,13,26,53],
  ['east-silent-growing-gallery',44,12,66,54],
  ['central-open-arcade',24,18,48,56],
  ['southwest-green-seed-storage',8,52,32,66],
  ['southeast-dormant-pollen-study',43,51,66,67],
  ['northwest-entry-windbreak',4,5,17,29],
  ['northeast-sporeless-fern-archive',60,5,68,27],
  ['south-temperate-potting-walk',29,54,45,66],
  ['large-central-open-temperate-sun-court',28,26,43,40],
  ['west-open-soil-hardened-court',13,49,22,57],
  ['east-open-wind-drying-court',53,49,62,57]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-unpowered-glass-library',36,3],
  ['north-unpowered-glass-library','west-dry-root-sampling',25,15],
  ['north-unpowered-glass-library','east-silent-growing-gallery',45,15],
  ['north-unpowered-glass-library','central-open-arcade',36,18],
  ['west-dry-root-sampling','central-open-arcade',26,32],
  ['east-silent-growing-gallery','central-open-arcade',45,32],
  ['central-open-arcade','southwest-green-seed-storage',29,52],
  ['central-open-arcade','southeast-dormant-pollen-study',46,52],
  ['central-open-arcade','south-temperate-potting-walk',37,54],
  ['central-open-arcade','large-central-open-temperate-sun-court',27,32],
  ['large-central-open-temperate-sun-court','east-silent-growing-gallery',44,33],
  ['west-dry-root-sampling','west-open-soil-hardened-court',18,48],
  ['west-open-soil-hardened-court','southwest-green-seed-storage',20,58],
  ['east-silent-growing-gallery','east-open-wind-drying-court',56,48],
  ['east-open-wind-drying-court','southeast-dormant-pollen-study',57,58],
  ['southwest-green-seed-storage','south-temperate-potting-walk',30,61],
  ['southeast-dormant-pollen-study','south-temperate-potting-walk',45,61],
  ['north-unpowered-glass-library','northwest-entry-windbreak',17,14],
  ['north-unpowered-glass-library','northeast-sporeless-fern-archive',59,15]
 ]){
  if(!grounded(x,z))throw Error('Willowglass original portal lacks physically grounded y0 floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Critical ordering: insert original four-high glass only AFTER all
 // original portal cuts. Every y2..5 pane must survive as one complete
 // mounted vertical BAY with y1 ground sill and y6 actual timber lintel.
 let panes=0,bays=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if((x*17+z*11)%11!==0)continue;
  const side=Object.entries(sides).find(([,d])=>!grounded(x+d[0],z+d[1]));
  if(!side||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  for(let y=2;y<=5;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side[0],
    {authenticOriginalFourHighTemperedGlass:true,verifiedLivePackShape:false});
   panes++;
  }bays++;
 }
 for(const [x,z,name] of [[36,8,'inert-plant-register'],[10,32,'dry-root-trays'],
  [58,37,'dormant-temperate-seed-cabinet'],[26,59,'closed-moss-catalogue'],
  [48,60,'unheated-glasshouse-bell'],[63,16,'unused-flora-index']])
  if(enclosed(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original LARGE temperate greenhouse with nine different directly backed Pack3 roof wings, three grounded sky-exposed connected pedestrian botanical atriums (240+90+90 cells), sixteen real ground-to-rafter timber bents, and genuine externally framed four-high Pack4 030 vertical glass. No farming, irrigation, temperature, live plant species, settlements or saves.',{
  originalB115Wave:31,nineOriginalRoofWings:9,
  realGroundedOpenSkyAtriums:[240,90,90],
  trueGroundedRoofBents:16,realFourHighPack4GlassBays:bays,
  actualOriginalUprightGlassCells:panes,
  activePlantGrowth:false,irrigationPowered:false,
  realBiomePlantPlacement:false,actualWeatherproofingCertified:false,
  producerCollisionAndSelectionApproved:false,realIphoneHomeScreenTested:false,
  creatorArtAccepted:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
