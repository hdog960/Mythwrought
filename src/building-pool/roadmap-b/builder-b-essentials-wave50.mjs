// MYTHWROUGHT Builder B Wave50 — Vesperfrost Four-Court Dry Winter Baths.
// Frozen exclusively B115 snow LARGE bathhouse #003; original structural
// source only. No working water/heating/weather sealing, Pack3/4 ABI/collider,
// active settlements, runtime registration, schema-1 writes or iPhone signoff.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const VESPERFROST_FOUR_COURT_ID='r1:bathhouse:snow:large:003';
export function buildVesperfrostFourCourtDryBathhouse(){
 const b=sourcePlan('bathhouse','snow','large',3,'Vesperfrost Four-Court Dry Winter Baths',70,36,82);
 const wings=[
 ['north-arrival-vault',22,3,48,16,16,'pack3:026'],
 ['west-bath-gallery',5,12,26,50,16,'pack3:025'],
 ['east-bath-gallery',43,12,64,51,18,'pack3:023'],
 ['central-frosted-spine',25,17,44,47,23,'pack3:026'],
 ['southwest-dry-bathhouse',8,44,29,65,17,'pack3:025'],
 ['southeast-dry-bathhouse',40,44,61,65,19,'pack3:023'],
 ['northwest-banded-flue-shell',2,6,19,30,15,'pack3:026'],
 ['northeast-unpowered-hearth-shell',51,6,68,30,17,'pack3:025'],
 ['south-reflection-gallery',25,52,44,69,20,'pack3:023'],
 ['west-dormant-vent-wing',2,35,15,61,16,'pack3:026'],
 ['east-dormant-vent-wing',56,35,68,62,18,'pack3:025'],
 ['southern-cold-air-transverse',22,65,48,73,19,'pack3:023']
 ],courts=[
 ['north-real-open-air-oculus',30,21,39,31],
 ['west-real-open-stone-court',11,40,19,49],
 ['east-real-open-stone-court',50,40,58,49],
 ['southern-open-bathyard',30,54,39,61]
 ],key=(x,z)=>x+','+z,indoor=new Set(),court=new Set(),outside=new Set(),roofMap=new Map(),first=new Map(),
 facing={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [,x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){court.add(key(x,z));indoor.delete(key(x,z))}
 for(const [x0,x1] of [[14,20],[32,40],[50,58]])for(let x=x0;x<=x1;x++)for(let z=64;z<=80;z++)
  if(!indoor.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 for(let x=16;x<=55;x++)for(let z=77;z<=80;z++)
  if(!indoor.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 const founded=(x,z)=>indoor.has(key(x,z))||court.has(key(x,z))||outside.has(key(x,z));
 for(const cell of new Set([...indoor,...court,...outside])){
  const [x,z]=cell.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{originalTrueStoneFoundation:true,originalOnly:true});
 }
 for(const cell of indoor){
  const [x,z]=cell.split(',').map(Number);
  if(Object.values(facing).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=10;y++)b.put(x,y,z,'wall','live:stone','none',
    {sourceStoneEnvelope:true,realThermalCertification:false});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const cell=key(x,z);if(!indoor.has(cell)||roofMap.has(cell))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(d/(name==='central-frosted-spine'?3:5));
   roofMap.set(cell,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {immediatelyTrueSolidSupportedSourcePack3:true,realPack3Installed:false});
   b.put(x,y,z,'roof',asset,'north',
    {vesperfrostRealRoofWing:name,Pack3ColliderAndMeshUnverified:true});
   if(!first.has(name))first.set(name,[x,z,y]);
  }
 for(const [name] of wings){
  const p=first.get(name);
  if(!p)throw Error('Vesperfrost roof wing is occluded '+name);
  b.support(p[0],p[1],p[2]-1,'live:stone','vesperfrost-source-bearing-post-'+name);
  // b.support records the real support plan but may leave unfilled tiers.
  // Close actual y1..roof-1 stone load path, without replacing occupied cells.
  for(let y=1;y<p[2];y++)if(b.clear(p[0],y,p[1]))
   b.put(p[0],y,p[1],'support','live:stone','none',
    {physicallyContinuousVesperfrostPost:name,sourceOnlyLoadCertification:false});
 }
 const basins=[
 ['west-inner-dry-plunge',16,25],['east-inner-dry-plunge',54,25],
 ['southwest-stone-cooling-basin',19,57],['southeast-stone-cooling-basin',51,57]
 ];let basinStone=0,rimStone=0;
 const basinReserved=new Set();
 for(const [name,cx,cz] of basins)for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
  if(!indoor.has(key(x,z))||b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Basin lacks real y0 support and free y1-2 '+name+' '+key(x,z));
  basinReserved.add(key(x,z));
  b.put(x,1,z,'furnishing','live:stone','none',
   {originalSolidDryBasinBottom:name,operatingWaterSystem:false});basinStone++;
  if(x===cx-2||x===cx+2||z===cz-2||z===cz+2){
   b.put(x,2,z,'furnishing','live:stone','none',
    {originalRaisedFullPerimeterRim:name,workingBasin:false});rimStone++;
  }
 }
 for(const [axis,fixed,lo,hi,holes] of [
 ['x',24,18,54,[21,22,29,30,38,39,46,47,52,53]],
 ['x',45,18,54,[21,22,29,30,38,39,46,47,52,53]],
 ['z',20,18,52,[22,23,30,31,40,41,48,49]],
 ['z',58,14,55,[18,19,30,31,40,41,50,51]]
 ])for(let i=lo;i<=hi;i++){
  const x=axis==='x'?fixed:i,z=axis==='z'?fixed:i;
  if(!indoor.has(key(x,z))||basinReserved.has(key(x,z))||holes.includes(i))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{dryOriginalDivider:true,powered:false});
 }
 for(const row of [
 ['north-stone-entrance',23,4,47,15],
 ['west-dry-plunge-gallery',6,13,25,49],
 ['east-dry-plunge-gallery',44,13,63,50],
 ['central-unheated-winter-spine',26,18,43,46],
 ['southwest-stone-rim-baths',9,45,28,64],
 ['southeast-stone-rim-baths',41,45,60,64],
 ['northwest-dormant-furnace-room',3,7,18,29],
 ['northeast-empty-water-works',52,7,67,29],
 ['south-cold-reflection-hall',26,53,43,68],
 ['west-inert-vent-outer-wing',3,36,14,60],
 ['east-inert-vent-outer-wing',57,36,67,61],
 ['southern-stone-transverse',23,66,47,72],
 ['north-real-open-air-oculus',30,21,39,31],
 ['west-real-open-stone-court',11,40,19,49],
 ['east-real-open-stone-court',50,40,58,49],
 ['southern-open-bathyard',30,54,39,61],
 ['west-unroofed-stone-return',14,66,20,80],
 ['center-unroofed-stone-return',32,72,40,80],
 ['east-unroofed-stone-return',50,66,58,80],
 ['real-unroofed-transverse-crosswalk',16,77,55,80]
 ])b.room(...row);
 for(const [from,to,x,z] of [
 ['outside','north-stone-entrance',35,3],
 ['north-stone-entrance','central-unheated-winter-spine',35,17],
 ['north-stone-entrance','west-dry-plunge-gallery',24,14],
 ['north-stone-entrance','east-dry-plunge-gallery',44,14],
 ['north-stone-entrance','northwest-dormant-furnace-room',19,9],
 ['north-stone-entrance','northeast-empty-water-works',51,9],
 ['central-unheated-winter-spine','north-real-open-air-oculus',29,26],
 ['north-real-open-air-oculus','west-dry-plunge-gallery',25,26],
 ['north-real-open-air-oculus','east-dry-plunge-gallery',43,26],
 ['central-unheated-winter-spine','southwest-stone-rim-baths',24,48],
 ['central-unheated-winter-spine','southeast-stone-rim-baths',45,48],
 ['west-dry-plunge-gallery','west-real-open-stone-court',20,44],
 ['east-dry-plunge-gallery','east-real-open-stone-court',49,44],
 ['central-unheated-winter-spine','southern-open-bathyard',29,56],
 ['southern-open-bathyard','south-cold-reflection-hall',35,62],
 ['northwest-dormant-furnace-room','west-inert-vent-outer-wing',5,40],
 ['northeast-empty-water-works','east-inert-vent-outer-wing',62,40],
 ['southwest-stone-rim-baths','southern-stone-transverse',25,65],
 ['southeast-stone-rim-baths','southern-stone-transverse',44,65],
 ['south-cold-reflection-hall','southern-stone-transverse',35,69],
 ['southwest-stone-rim-baths','west-unroofed-stone-return',17,66],
 ['southeast-stone-rim-baths','east-unroofed-stone-return',54,66],
 ['southern-stone-transverse','center-unroofed-stone-return',35,74],
 ['west-unroofed-stone-return','real-unroofed-transverse-crosswalk',18,79],
 ['center-unroofed-stone-return','real-unroofed-transverse-crosswalk',35,79],
 ['east-unroofed-stone-return','real-unroofed-transverse-crosswalk',54,79]
 ]){
  if(!founded(x,z))throw Error('Vesperfrost portal has no stone foundation '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let glass=0,bays=0;
 for(const cell of indoor){
  const [x,z]=cell.split(',').map(Number);
  if((x*19+z*11)%13!==0||[1,2,3,4,5,6,7,8].some(y=>b.clear(x,y,z)))continue;
  const out=Object.entries(facing).find(([,v])=>!founded(x+v[0],z+v[1]));
  if(!out)continue;
  for(let y=2;y<=6;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',out[0],
    {trulySourceStoneFramedFiveHighGlazing:true,Pack4SelectionUnapproved:true});glass++;
  }bays++;
 }
 return b.finish('Twelve genuinely occupied source-backed winter bathhouse roofs, four completely open foundation courts, four 5x5 solid-bottom and raised-rim DRY masonry baths, and a continuous three-way exterior stone return. This source does not implement real heated water, piping, weather or runtime physics.',{
  originalBuilderBWave:50,distinctRealRoofWings:first.size,
  genuinelyOpenStoneCourts:[110,90,90,80],
  actuallyGroundedExteriorStoneCells:outside.size,
  genuineThreeArmOutdoorStoneReturn:true,
  actualStoneDryBasinCount:basins.length,
  actualOriginalSolidDryBasinCells:basinStone,
  actualOriginalDryBasinRimCells:rimStone,
  candidatePack4FiveHighFramedPaneCells:glass,
  completeFiveHighSourceFramedBays:bays,
  realHeatedWater:false,waterPiping:false,realHeating:false,
  Pack3Pack4PhysicalAcceptance:false,realWeatherSeal:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false,
  installedIphonePwaTested:false,creatorVisualApproved:false
 });
}
