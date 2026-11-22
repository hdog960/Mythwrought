// MYTHWROUGHT Builder B Wave29 — Starpetal Double-Garden Orchidarium.
// ORIGINAL medium enchanted forest greenhouse, frozen B115 exclusive.
// 8 different directly-backed roof wings, TWO large genuinely stone-paved
// walkable open-sky gardens, THREE-height upright Pack4 window bays with
// real wooden sill y1 and lintel y5. Trellis dividers and empty planters are
// inert original source geometry, not flora simulation or live settlements.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const STARPETAL_ORCHIDARIUM_ID='r1:greenhouse:enchanted-forest:medium:003';
export function buildStarpetalDoubleGardenOrchidarium(){
 const b=sourcePlan('greenhouse','enchanted-forest','medium',3,
  'Starpetal Double-Garden Orchidarium',64,41,65);
 const wings=[
  ['north-twilight-flora-library',15,3,49,17,15,'pack3:025'],
  ['west-shadow-orchid-aisle',4,10,23,47,12,'pack3:026'],
  ['east-spore-and-root-gallery',40,9,59,47,16,'pack3:023'],
  ['central-lantern-free-botanical-walk',20,17,45,49,19,'pack3:025'],
  ['southwest-moon-fern-vault',8,43,30,59,13,'pack3:026'],
  ['southeast-sky-seed-archive',34,43,56,60,14,'pack3:023'],
  ['northwest-glimmer-free-portico',3,5,16,25,9,'pack3:025'],
  ['northeast-ancient-bark-gallery',52,4,61,30,17,'pack3:026']
 ],courts=[[24,24,36,35],[12,45,20,52]],
 K=(x,z)=>x+','+z,indoor=new Set(),sky=new Set(),roofed=new Map(),
 dir={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++)indoor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)
  for(let z=z0;z<=z1;z++){
   sky.add(K(x,z));indoor.delete(K(x,z));
  }
 const enclosed=(x,z)=>indoor.has(K(x,z)),grounded=(x,z)=>enclosed(x,z)||sky.has(K(x,z));
 for(const key of new Set([...indoor,...sky])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {originalGardenPaving:true,sourceRealFoliageNotAnimated:true});
 }
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(dir).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalEnchantedExteriorTimber:true,magicalWeatherproofingUnverified:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!enclosed(x,z)||roofed.has(K(x,z)))continue;
   const minD=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(minD/(wing==='central-lantern-free-botanical-walk'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {actualImmediatePack3SourceRoofBearing:true,longSpanLoadNotCertified:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalStarpetalRoofWing:wing,realMeshProducerNotCertified:true});
  }
 // Braced organic timber supports sit just OUTSIDE the sky-garden tiles,
 // preserving the complete garden sky columns, even above head height.
 for(const [x,z] of [[18,7],[31,7],[44,8],[9,20],[16,36],
  [48,30],[27,53],[44,54],[12,55],[56,19],[55,40],[9,12]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Starpetal real grounding post misses its source roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','original-grounded-orchid-rafters');
 }
 // Three facing corridors form a navigable garden ring with several real
 // two-cell gaps, rather than sealed or wholly decorative indoor routes.
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',22,18,46,[21,22,28,29,36,37,43,44]],
  ['x',42,17,47,[20,21,28,29,38,39]],
  ['z',18,16,49,[23,24,30,31,40,41,46,47]],
  ['z',44,8,56,[14,15,25,26,33,34,43,44,51,52]],
  ['x',16,6,24,[12,13,19,20]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!enclosed(x,z)||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {trueSourceBotanicalTrellisDivider:true,climbingPlantsNotSimulated:true});
 }
 for(const row of [
  ['north-twilight-archive',16,4,48,16],
  ['west-shade-orchid-room',5,11,22,46],
  ['east-spore-and-root-hall',41,10,58,46],
  ['central-perforated-walk',21,18,44,48],
  ['southwest-dormant-fern-desk',9,44,29,58],
  ['southeast-unused-seed-library',35,44,55,59],
  ['northwest-dark-wood-porch',4,6,15,24],
  ['northeast-inert-leaf-hall',53,5,60,29],
  ['central-sky-open-moonflower-court',24,24,36,35],
  ['west-sky-open-fern-court',12,45,20,52]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-twilight-archive',31,3],
  ['north-twilight-archive','west-shade-orchid-room',22,14],
  ['north-twilight-archive','east-spore-and-root-hall',41,14],
  ['north-twilight-archive','central-perforated-walk',32,17],
  ['west-shade-orchid-room','central-perforated-walk',22,30],
  ['east-spore-and-root-hall','central-perforated-walk',42,30],
  ['central-perforated-walk','southwest-dormant-fern-desk',26,43],
  ['central-perforated-walk','southeast-unused-seed-library',39,43],
  ['central-perforated-walk','central-sky-open-moonflower-court',23,29],
  ['central-sky-open-moonflower-court','east-spore-and-root-hall',37,30],
  ['west-shade-orchid-room','west-sky-open-fern-court',17,44],
  ['west-sky-open-fern-court','southwest-dormant-fern-desk',17,53],
  ['north-twilight-archive','northwest-dark-wood-porch',16,13],
  ['east-spore-and-root-hall','northeast-inert-leaf-hall',53,20]
 ]){
  if(!grounded(x,z))throw Error('Starpetal authored greenhouse portal lacks real y0 stone '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // THREE-high Pack4 windows, real sill at y1 and lintel at y5. Each bay
 // remains truly external rather than facing a fake inner greenhouse wall.
 let cells=0,bays=0;
 for(const key of indoor){
  const [x,z]=key.split(',').map(Number);
  if((x*17+z*11)%10!==0)continue;
  const ext=Object.entries(dir).find(([,d])=>!grounded(x+d[0],z+d[1]));
  if(!ext||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3,4]){
   b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',ext[0],
    {sourceThreeHighGlassBay:true,physicalPackShapePending:true});
   cells++;
  }bays++;
 }
 for(const [x,z,name] of [[30,8,'empty-silverleaf-counter'],[10,28,'dry-vine-loam-trays'],
  [51,35,'sealed-spore-packets'],[27,53,'unused-orchid-box'],
  [42,55,'silent-seed-catalogue'],[57,14,'inert-bark-clock']])
  if(enclosed(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original enchanted medium greenhouse with eight uneven supported timber roof wings, two independent 156- and 72-cell genuinely paved WALKABLE roofless growing courts, braced walking galleries and three-tier upright framed Pack4 external glazing; magical lighting, plants, water and crop growth all deferred.',{
  originalBuilderBExclusiveWave:29,sourceRoofWingCount:8,
  actualPavedUnroofedCourts:[156,72],
  uprightThreeHighGlassBays:bays,physicalUprightPack4GlassCells:cells,
  liveFlowers:false,growingCrops:false,magicalLightingEnabled:false,
  functioningIrrigation:false,realWeatherSealCertified:false,
  PackProducerCollisionApproved:false,originalIphoneAcceptance:false,
  creatorVisualAcceptance:false,actualTerrainPlacement:false,
  productionRegistered:false,worldPlacement:false,saveSchema1Written:false
 });
}
