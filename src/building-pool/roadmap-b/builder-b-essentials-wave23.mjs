// MYTHWROUGHT Builder B Wave23 — Crystalfen Staggered Winterglass Conservatory.
// ORIGINAL B115 medium snow greenhouse. A genuine 169-column paved outdoor
// sky court, separate 49-column smaller court, grounded glass walls in deep
// WINDWARD frames, eight roof masses and differing four-high vertical panes.
// Not actual crop growth, snow climate physics, power, water, terrain, or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const CRYSTALFEN_WINTERGLASS_ID='r1:greenhouse:snow:medium:002';
export function buildCrystalfenStaggeredWinterglass(){
 const b=sourcePlan('greenhouse','snow','medium',2,'Crystalfen Staggered Winterglass Conservatory',62,41,61);
 const wings=[
  ['north-glass-gallery',13,2,46,15,14,'pack3:025'],
  ['west-snowmoss-wing',4,9,21,47,11,'pack3:026'],
  ['east-hanging-root-gallery',41,10,55,46,16,'pack3:023'],
  ['central-winter-prism-walk',18,14,45,44,19,'pack3:025'],
  ['southwest-dormant-seed-house',8,43,31,57,12,'pack3:026'],
  ['southeast-snowfern-catalog',32,42,54,58,13,'pack3:023'],
  ['northwest-triple-windbreak',2,3,14,23,9,'pack3:026'],
  ['northeast-prismatic-frostwatch',50,3,58,29,16,'pack3:025']
 ],courts=[[25,23,37,35],[13,47,19,53]],K=(x,z)=>x+','+z,
 wingsFoot=new Set(),courtsFloor=new Set(),roofed=new Map(),
 face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)wingsFoot.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   courtsFloor.add(K(x,z));wingsFoot.delete(K(x,z));
  }
 const ground=(x,z)=>wingsFoot.has(K(x,z))||courtsFloor.has(K(x,z));
 for(const key of new Set([...wingsFoot,...courtsFloor])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {physicalWinterstoneFloor:true,originalTerrainClimateUnmodified:true});
 }
 for(const key of wingsFoot){
  const [x,z]=key.split(',').map(Number);
  if([[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalLoadBearingWinterWood:true,realFrozenGlazeWeatherSealUnverified:true});
 }
 // Eight independent support-backed, deliberately asymmetric roof pitches.
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!wingsFoot.has(K(x,z))||roofed.has(K(x,z)))continue;
   const xDist=Math.min(x-x0,x1-x),zDist=Math.min(z-z0,z1-z);
   const y=base+Math.floor(Math.min(xDist,zDist)/(wing==='central-winter-prism-walk'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalPhysicalRoofSupport:true,actualWindSnowLoadNotCertified:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalCrystalfenRoofWing:wing,weatherApproved:false});
  }
 for(const [x,z] of [[18,6],[29,7],[43,7],[9,18],[16,35],[49,15],
  [52,34],[24,50],[41,50],[6,13],[55,17]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Crystalfen original roof pier misses genuine roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','permanent-grounded-winter-rafters');
 }
 // Internal gallery partitions have large authored bypasses rather than
 // sealing individual dead-end squares into fake connected circulation.
 for(const [axis,fixed,lo,hi,doorGaps] of [
  ['x',21,15,46,[19,20,26,27,34,35,40,41]],
  ['x',41,15,45,[18,19,28,29,36,37]],
  ['z',15,14,48,[18,19,27,28,35,36,43,44]],
  ['z',44,8,54,[14,15,22,23,30,31,38,39,45,46]],
  ['x',14,9,22,[12,13,18,19]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!wingsFoot.has(K(x,z))||doorGaps.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {realWinterGlassPartition:true,automaticClimateControl:false});
 }
 // Two physically uninterrupted tall SUNLIT blue panes per selected external
 // frame: y2..y5; sill y1 and lintel y6 remain true wooden full cells.
 let fourTallBays=0,glassCells=0;
 for(const key of wingsFoot){
  const [x,z]=key.split(',').map(Number);
  const facing=Object.entries(face).find(([,d])=>!ground(x+d[0],z+d[1]));
  if(!facing||(x*11+z*7)%9!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  for(let y=2;y<=5;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',facing[0],
    {sourceFourTallGroundedGlass:true,actualWeatherSealCertified:false});
   glassCells++;
  }
  fourTallBays++;
 }
 for(const room of [
  ['north-snowlight-arrival',14,3,45,14],
  ['west-frost-lichen-archive',5,10,20,46],
  ['east-winter-root-trays',42,11,54,45],
  ['central-folded-prism-walk',19,15,44,43],
  ['southwest-cold-seed-cabinets',9,44,30,56],
  ['southeast-dry-germination-bays',33,43,53,57],
  ['northwest-entry-windbreak',3,4,13,22],
  ['northeast-silent-lantern-watch',51,4,57,28],
  ['central-sky-open-frost-court',25,23,37,35],
  ['southwest-open-coldframe-garden',13,47,19,53]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-snowlight-arrival',31,2],
  ['north-snowlight-arrival','west-frost-lichen-archive',20,13],
  ['north-snowlight-arrival','central-folded-prism-walk',30,15],
  ['north-snowlight-arrival','east-winter-root-trays',42,13],
  ['west-frost-lichen-archive','central-folded-prism-walk',21,27],
  ['east-winter-root-trays','central-folded-prism-walk',41,27],
  ['central-folded-prism-walk','southwest-cold-seed-cabinets',24,44],
  ['central-folded-prism-walk','southeast-dry-germination-bays',38,44],
  ['central-folded-prism-walk','central-sky-open-frost-court',24,28],
  ['central-sky-open-frost-court','east-winter-root-trays',38,29],
  ['southwest-cold-seed-cabinets','southwest-open-coldframe-garden',20,50],
  ['southwest-open-coldframe-garden','west-frost-lichen-archive',13,46],
  ['north-snowlight-arrival','northwest-entry-windbreak',13,12],
  ['north-snowlight-arrival','northeast-silent-lantern-watch',49,13],
  ['east-winter-root-trays','northeast-silent-lantern-watch',51,21]
 ]){
  if(!ground(x,z))throw Error('Crystalfen actual portal does not have y0 floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,name] of [
 [29,8,'inert-frostlight-table'],[12,26,'unpowered-snowglass-index'],
 [49,30,'closed-seed-ledger'],[26,52,'empty-winter-flora-pots'],
 [44,53,'dormant-coldframe-bell'],[8,17,'dry-snowmoss-tray']
 ])if(wingsFoot.has(K(x,z))&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Original medium winter greenhouse with eight genuine snow-weighted independently supported Pack3 roof wings, four-cell-high upright source-framed Pack4 glass bays, a 169-cell genuinely paved and sky-open central plant court and a separate 49-cell walkable open coldframe garden, with ten physically connected rooms. Crop, water and aurora mechanics inactive.',{
  owner:'Builder B exclusive 1B Wave23 medium snow greenhouse',
  roofWingCount:8,actualPavedSkyCourtCells:[169,49],
  framedFourTallUprightGlassBays:fourTallBays,
  actualUprightPack4GlassCells:glassCells,
  growingSimulationEnabled:false,waterIrrigationActive:false,
  magicalSnowLightingActive:false,thermalControlEnabled:false,
  physicalPackCollisionCertified:false,weatherSealApproved:false,
  realWorldSnowBiomeEdited:false,realIphoneTested:false,
  creatorArtworkApproved:false,worldPlacement:false,productionRegistered:false,
  saveSchema1Written:false
 });
}
