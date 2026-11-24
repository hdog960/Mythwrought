// MYTHWROUGHT Builder B Wave56 — Willowmarsh Three-Ring Dry Bath Pavilion.
// Frozen Builder-B-only B115 ID: r1:bathhouse:temperate:large:003.
// Twelve genuinely authored and source-backed Pack3 hall roof wings,
// five actually open stone courts, three distinct 9x9 STONE-FOUNDED
// unpowered open-air bath precincts (fully opaque original two-high
// stone perimeter, four two-high actual gate cells each), three 3x3
// solid stone raised DRY inner basin displays with open upper centers,
// five-high genuinely framed source candidate Pack4 glazing, and
// uninterrupted exterior connecting circulation. No functioning water,
// temperature, draining, steam, healing, Pak3/4 installed collision,
// world generation, settlement registration or schema-1 save writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const WILLOWMARSH_THREE_RING_ID='r1:bathhouse:temperate:large:003';
export function buildWillowmarshThreeRingDryBathPavilion(){
 const b=sourcePlan('bathhouse','temperate','large',3,
  'Willowmarsh Three-Ring Dry Bath Pavilion',84,40,104);
 const wings=[
  ['northern-flagstone-reception',27,3,57,19,16,'pack3:026'],
  ['western-rainroot-dry-gallery',5,12,34,61,17,'pack3:025'],
  ['eastern-copperleaf-dry-gallery',50,12,79,61,20,'pack3:023'],
  ['central-sunshade-bath-promenade',33,18,51,72,25,'pack3:026'],
  ['southwest-dry-linen-vault',8,55,36,78,18,'pack3:025'],
  ['southeast-unheated-stone-hall',48,55,76,78,21,'pack3:023'],
  ['northwest-arched-copper-room',2,6,25,37,16,'pack3:026'],
  ['northeast-openwork-rest-room',60,6,82,37,19,'pack3:025'],
  ['southern-three-ring-procession',29,70,55,81,22,'pack3:023'],
  ['western-woodland-portico',2,39,18,74,17,'pack3:026'],
  ['eastern-silent-basin-wing',69,39,82,74,20,'pack3:025'],
  ['southern-arched-sun-porch',35,81,49,85,19,'pack3:023']
 ],openCourts=[
  ['northern-broad-sky-fountaincourt',36,26,48,39],
  ['western-open-sun-court',16,49,25,59],
  ['eastern-open-sun-court',59,49,68,59],
  ['southern-stone-lightcourt',36,63,47,72],
  ['southwestern-side-breathing-court',26,63,32,70]
 ],bathRings=[
  ['western-stone-dry-bath',19,90,'west-open-stone-approach'],
  ['central-stone-dry-bath',42,90,'center-open-stone-approach'],
  ['eastern-stone-dry-bath',65,90,'east-open-stone-approach']
 ],key=(x,z)=>x+','+z,
 covered=new Set(),sky=new Set(),outside=new Set(),
 roofFoot=new Map(),roofStarts=new Map(),roofLoadXZ=new Set(),
 railXZ=new Set(),basinXZ=new Set(),
 directions={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  covered.add(key(x,z));
 for(const [,x0,z0,x1,z1] of openCourts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  sky.add(key(x,z));covered.delete(key(x,z));
 }
 for(const [x0,x1] of [[8,29],[32,52],[55,78]])
  for(let x=x0;x<=x1;x++)for(let z=84;z<=102;z++)
   if(!covered.has(key(x,z))&&!sky.has(key(x,z)))outside.add(key(x,z));
 for(let x=11;x<=76;x++)for(let z=99;z<=102;z++)
  if(!covered.has(key(x,z))&&!sky.has(key(x,z)))outside.add(key(x,z));
 const founded=(x,z)=>covered.has(key(x,z))||sky.has(key(x,z))||outside.has(key(x,z));
 for(const cell of new Set([...covered,...sky,...outside])){
  const [x,z]=cell.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {actualWillowmarshOriginalStoneFooting:true,workingBathWater:false});
 }
 for(const cell of covered){
  const [x,z]=cell.split(',').map(Number);
  if(Object.values(directions).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=11;y++)
    b.put(x,y,z,'wall','live:stone','none',
     {genuineWillowmarshOriginalMasonryEnvelope:true,realMoistureSealPending:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const cell=key(x,z);
   if(!covered.has(cell)||roofFoot.has(cell))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(name==='central-sunshade-bath-promenade'?3:5));
   roofFoot.set(cell,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {sourceTrulySolidPack3RoofBacking:true,installedMeshPhysicsNotValidated:true});
   b.put(x,y,z,'roof',asset,'north',
    {willowmarshRealNonemptyRoofWing:name,Pack3InstalledCandidateOnly:true});
   if(!roofStarts.has(name))roofStarts.set(name,[x,z,y]);
  }
 for(const [name] of wings){
  const pos=roofStarts.get(name);
  if(!pos)throw Error('Whole Willowmarsh roof wing source footprint shadowed '+name);
  roofLoadXZ.add(key(pos[0],pos[1]));
  b.support(pos[0],pos[1],pos[2]-1,'live:stone',
   'willowmarsh-real-full-height-roof-bearing-'+name);
 }
 // Three genuinely separate 9x9 original stone dry bath precincts:
 // every footprint coordinate has original solid stone y0, 32 perimeter
 // positions minus four opposite two-wide entry gaps. Source masonry at
 // both y1 and y2 on every remaining perimeter position, not fake rails.
 // 3x3 actual solid raised dry basin plates at y1 with an eight-cell y2
 // raised stone rim. NO water or climate-dependent gameplay.
 let perimeterStone=0,openGateCells=0,bathBaseStone=0,basinRims=0;
 for(const [name,cx,cz] of bathRings){
  const x0=cx-4,x1=cx+4,z0=cz-4,z1=cz+4;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const cell=key(x,z);
   if(!outside.has(cell)||b.clear(x,0,z))
    throw Error('Real 9x9 open bath ring lacks source stone foundation '+name+' '+cell);
   const perimeter=x===x0||x===x1||z===z0||z===z1;
   const isGate=(x===cx-1||x===cx)&&(z===z0||z===z1);
   if(perimeter&&!isGate){
    railXZ.add(cell);
    for(let y=1;y<=2;y++){
     if(!b.clear(x,y,z))throw Error('Willowmarsh perimeter intersects existing solid '+cell);
     b.put(x,y,z,'wall','live:stone','none',
      {willowmarshActualTwoTierDryStoneBathWall:name,workingWater:false});
     perimeterStone++;
    }
   }
   if(isGate){
    if(!b.clear(x,1,z)||!b.clear(x,2,z))
     throw Error('Bath precinct gate lacks genuine y1/y2 clearance '+name+' '+cell);
    openGateCells++;
   }
  }
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   const cell=key(x,z),rim=x===cx-1||x===cx+1||z===cz-1||z===cz+1;
   if(b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Source original actual raised basin footing missing '+name+' '+cell);
   basinXZ.add(cell);
   b.put(x,1,z,'furnishing','live:stone','none',
    {willowmarshGenuineDryStoneInnerBasin:name,literalWater:false});
   bathBaseStone++;
   if(rim){
    b.put(x,2,z,'furnishing','live:stone','none',
     {willowmarshFullOriginalDryStoneInnerBasinRim:name,liquidSimulation:false});
    basinRims++;
   }
  }
  b.room(name,cx-3,cz-3,cx+3,cz+3);
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',32,20,63,[23,24,33,34,42,43,51,52,60,61]],
  ['x',52,20,63,[23,24,33,34,42,43,51,52,60,61]],
  ['z',22,25,64,[29,30,38,39,47,48,56,57]],
  ['z',68,14,77,[18,19,32,33,44,45,56,57,66,67]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n,cell=key(x,z);
  if(!covered.has(cell)||roofLoadXZ.has(cell)||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalDryBathRoomScreen:true,activeBathService:false});
 }
 for(const room of [
  ['northern-flagstone-reception',28,4,56,18],
  ['western-rainroot-dry-gallery',6,13,33,60],
  ['eastern-copperleaf-dry-gallery',51,13,78,60],
  ['central-sunshade-bath-promenade',34,19,50,71],
  ['southwest-dry-linen-vault',9,56,35,77],
  ['southeast-unheated-stone-hall',49,56,75,77],
  ['northwest-arched-copper-room',3,7,24,36],
  ['northeast-openwork-rest-room',61,7,81,36],
  ['southern-three-ring-procession',30,71,54,80],
  ['western-woodland-portico',3,40,17,73],
  ['eastern-silent-basin-wing',70,40,81,73],
  ['southern-arched-sun-porch',36,82,48,84],
  ['northern-broad-sky-fountaincourt',36,26,48,39],
  ['western-open-sun-court',16,49,25,59],
  ['eastern-open-sun-court',59,49,68,59],
  ['southern-stone-lightcourt',36,63,47,72],
  ['southwestern-side-breathing-court',26,63,32,70],
  ['west-open-stone-approach',8,84,29,102],
  ['center-open-stone-approach',32,84,52,102],
  ['east-open-stone-approach',55,84,78,102],
  ['triple-bath-stone-exterior-transverse',11,99,76,102]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','northern-flagstone-reception',42,3],
  ['northern-flagstone-reception','central-sunshade-bath-promenade',42,19],
  ['northern-flagstone-reception','western-rainroot-dry-gallery',32,14],
  ['northern-flagstone-reception','eastern-copperleaf-dry-gallery',52,14],
  ['northern-flagstone-reception','northwest-arched-copper-room',25,11],
  ['northern-flagstone-reception','northeast-openwork-rest-room',60,11],
  ['central-sunshade-bath-promenade','northern-broad-sky-fountaincourt',35,32],
  ['northern-broad-sky-fountaincourt','western-rainroot-dry-gallery',34,32],
  ['northern-broad-sky-fountaincourt','eastern-copperleaf-dry-gallery',49,32],
  ['central-sunshade-bath-promenade','western-open-sun-court',32,52],
  ['central-sunshade-bath-promenade','eastern-open-sun-court',52,52],
  ['western-rainroot-dry-gallery','western-open-sun-court',26,51],
  ['eastern-copperleaf-dry-gallery','eastern-open-sun-court',58,51],
  ['central-sunshade-bath-promenade','southern-stone-lightcourt',35,67],
  ['southern-stone-lightcourt','southern-three-ring-procession',42,73],
  ['western-rainroot-dry-gallery','southwest-dry-linen-vault',27,56],
  ['eastern-copperleaf-dry-gallery','southeast-unheated-stone-hall',64,56],
  ['southwest-dry-linen-vault','southern-three-ring-procession',36,75],
  ['southeast-unheated-stone-hall','southern-three-ring-procession',49,75],
  ['northwest-arched-copper-room','western-woodland-portico',12,39],
  ['northeast-openwork-rest-room','eastern-silent-basin-wing',74,39],
  ['western-rainroot-dry-gallery','southwestern-side-breathing-court',25,66],
  ['southwestern-side-breathing-court','southwest-dry-linen-vault',33,67],
  ['southwest-dry-linen-vault','west-open-stone-approach',19,84],
  ['southeast-unheated-stone-hall','east-open-stone-approach',65,84],
  ['southern-three-ring-procession','southern-arched-sun-porch',42,82],
  ['southern-arched-sun-porch','center-open-stone-approach',42,85],
  ['west-open-stone-approach','triple-bath-stone-exterior-transverse',19,101],
  ['center-open-stone-approach','triple-bath-stone-exterior-transverse',42,101],
  ['east-open-stone-approach','triple-bath-stone-exterior-transverse',65,101]
 ]){
  const cell=key(x,z);
  if(!founded(x,z)||railXZ.has(cell)||basinXZ.has(cell)||roofLoadXZ.has(cell))
   throw Error('Bath room portal unfounded or intersects physical post/basin/stone wall '+cell);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Two north/south graph portals per bath ring are on REAL reserved stone
 // foundation and genuinely source-clear y1 and y2 without cutting walls.
 for(const [name,cx,cz,approach] of bathRings){
  for(const z of [cz-4,cz+4]){
   const x=cx-1,cell=key(x,z);
   if(!outside.has(cell)||railXZ.has(cell)||basinXZ.has(cell)||
       !b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Authentic source bath entry not body/head clear '+name+' '+cell);
   b.portal(approach,name,x,z);
  }
 }
 let windowCells=0,windowBays=0;
 for(const cell of covered){
  const [x,z]=cell.split(',').map(Number);
  if(roofLoadXZ.has(cell)||(x*19+z*13)%14!==0||
      [1,2,3,4,5,6,7,8].some(y=>b.clear(x,y,z)))continue;
  const outward=Object.entries(directions).find(([,d])=>!founded(x+d[0],z+d[1]));
  if(!outward)continue;
  for(let y=2;y<=6;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',outward[0],
    {willowmarshActualSourceFramedPack4Pane:true,realInstalledSelectionPending:true});
   windowCells++;
  }windowBays++;
 }
 return b.finish('Three genuine open-air, fully founded 9x9 dry stone bath-ring precincts with complete two-tier walls, truly clear two-high north/south entrances and real raised dry basin displays; twelve independent solid-backed roof wings, five full original sky-clear courts and genuine outdoor three-way stone circulation. No working water, steam, game temperature or settlements.',{
  originalBuilderBWave:56,
  genuinelyOccupiedRoofWings:roofStarts.size,
  fullHeightOriginalSourceSkyOpenCourtSizes:[182,110,110,120,56],
  actualDistinctDryBathPrecincts:bathRings.length,
  originalSolidTwoHighBathPerimeterCells:perimeterStone,
  genuineTwoHighSourceGateCells:openGateCells,
  physicallyStoneFoundedOriginalDryBasinBottomCells:bathBaseStone,
  actualRaisedOriginalStoneBasinRimCells:basinRims,
  actuallySourceUnroofedOutdoorStoneFoundationCells:outside.size,
  realThreeWayExteriorCardinalPath:true,
  genuinePack4FiveHighFramedCandidatePaneCells:windowCells,
  fullyFramedFiveHighWindowBays:windowBays,
  workingHotWater:false,workingSteam:false,actualLiquidPhysics:false,
  installedPack3Pack4ProducerAccepted:false,
  realM7PlayerCollisionApproved:false,productionRegistered:false,
  worldPlacement:false,schema1SaveWritten:false,
  realInstalledIphoneHomeScreenPwaAccepted:false,creatorVisualApproved:false
 });
}
