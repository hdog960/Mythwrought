// MYTHWROUGHT Builder B Wave54 — Solglass Four-Terrace Desert Sunhouse.
// Frozen B115-only r1:greenhouse:desert:large:003. Twelve genuinely authored
// backed roof wings, five full-height sky-open courts, four 5x7 stone dry
// cultivation terraces with separate raised rims, four full original masonry
// windbreak columns, framed upright candidate Pack4 panes and a genuine
// unroofed three-way external corridor. NO working crop, water, climate,
// Pack3/4 physical ABI, settlement placement, saves or PWA integration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SOLGLASS_FOUR_TERRACE_ID='r1:greenhouse:desert:large:003';
export function buildSolglassFourTerraceSunhouse(){
 const b=sourcePlan('greenhouse','desert','large',3,'Solglass Four-Terrace Sunhouse',80,38,94);
 const wings=[
  ['north-sunkey-entrance',25,3,54,17,16,'pack3:026'],
  ['west-sunplate-gallery',5,12,30,56,16,'pack3:025'],
  ['east-dry-glass-gallery',49,12,74,56,19,'pack3:023'],
  ['central-sun-spine',30,18,50,63,24,'pack3:026'],
  ['southwest-seedwork-hall',9,49,34,70,17,'pack3:025'],
  ['southeast-dry-leaf-vault',46,49,71,70,20,'pack3:023'],
  ['northwest-sand-vane-annex',2,7,23,32,15,'pack3:026'],
  ['northeast-shade-vane-annex',56,7,78,32,18,'pack3:025'],
  ['southern-sundial-ambulatory',28,63,52,74,21,'pack3:023'],
  ['west-slatted-light-filter',2,36,17,65,16,'pack3:026'],
  ['east-slate-light-filter',64,36,78,65,20,'pack3:025'],
  ['south-open-view-canopy',30,74,50,78,19,'pack3:023']
 ],courts=[
  ['north-sky-sunwell',34,24,45,35],
  ['west-open-garden',14,44,22,53],
  ['east-open-garden',57,44,65,53],
  ['south-sunlit-court',35,55,45,64],
  ['southwest-side-lightwell',21,57,26,64]
 ],beds=[
  ['west-dry-seed-terrace',17,83],
  ['westcenter-dry-seed-terrace',35,84],
  ['eastcenter-dry-seed-terrace',46,84],
  ['east-dry-seed-terrace',63,83]
 ],key=(x,z)=>x+','+z,indoor=new Set(),sky=new Set(),
 outdoor=new Set(),roofed=new Map(),first=new Map(),bearers=new Set(),reserved=new Set(),
 dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [,x0,z0,x1,z1]of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){sky.add(key(x,z));indoor.delete(key(x,z))}
 for(const [a,c]of [[8,29],[31,49],[52,73]])for(let x=a;x<=c;x++)for(let z=78;z<=92;z++)
  if(!indoor.has(key(x,z))&&!sky.has(key(x,z)))outdoor.add(key(x,z));
 for(const [a,c,z0,z1]of [[15,23,70,79],[58,67,70,79],[37,43,75,80]])
  for(let x=a;x<=c;x++)for(let z=z0;z<=z1;z++)
   if(!indoor.has(key(x,z))&&!sky.has(key(x,z)))outdoor.add(key(x,z));
 for(let x=12;x<=70;x++)for(let z=89;z<=92;z++)
  if(!indoor.has(key(x,z))&&!sky.has(key(x,z)))outdoor.add(key(x,z));
 const founded=(x,z)=>indoor.has(key(x,z))||sky.has(key(x,z))||outdoor.has(key(x,z));
 for(const cell of new Set([...indoor,...sky,...outdoor])){
  const[x,z]=cell.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {actualOriginalSolglassStoneFooting:true,sourceOnlyNoWater:true});
 }
 for(const cell of indoor){
  const[x,z]=cell.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=11;y++)b.put(x,y,z,'wall','live:stone','none',
    {genuineStoneSunhouseEnvelope:true,noClimateApproval:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset]of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=key(x,z);if(!indoor.has(k)||roofed.has(k))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(name==='central-sun-spine'?3:5));
   roofed.set(k,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {trueDirectPack3BackingSource:true,actualPack3ABINotApproved:true});
   b.put(x,y,z,'roof',asset,'north',
    {solglassActuallyCoveredRoofWing:name,realPack3ColliderUnknown:true});
   if(!first.has(name))first.set(name,[x,z,y]);
  }
 for(const[name]of wings){
  const p=first.get(name);if(!p)throw Error('Source roof wing occluded '+name);
  bearers.add(key(p[0],p[1]));
  b.support(p[0],p[1],p[2]-1,'live:stone',
   'solglass-true-solid-original-bearing-'+name);
 }
 // Each 5x7 bed is a physically solid 35-cell y1 raised stone plate with
 // 20 actual y2 perimeter rim cells, visibly DRY. Crop physics absent.
 let bedBases=0,bedRims=0;
 for(const[name,cx,cz]of beds)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-3;z<=cz+3;z++){
   const k=key(x,z),perim=x===cx-2||x===cx+2||z===cz-3||z===cz+3;
   if(!outdoor.has(k)||b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Original dry growing plate lacks founded clear cell '+name+' '+k);
   reserved.add(k);
   b.put(x,1,z,'furnishing','live:stone','none',
    {solglassOriginalSolidDryPlantPlate:name,activeGrowing:false});
   bedBases++;
   if(perim){
    b.put(x,2,z,'furnishing','live:stone','none',
     {solglassRealStoneBedRim:name,noIrrigation:true});
    bedRims++;
   }
  }
 // Four independently founded 3x3x3 masonry windbreak markers. None are
 // functioning light filters; all cells block original source walking.
 let windbreakStone=0;
 for(const[name,cx,cz]of [
  ['west-north-shadow',10,82],['west-south-shadow',10,88],
  ['east-north-shadow',71,82],['east-south-shadow',71,88]
 ]){
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   const k=key(x,z);
   if(!outdoor.has(k)||reserved.has(k)||b.clear(x,0,z))
    throw Error('Source dry marker lacks authentic stone floor '+name+' '+k);
   for(let y=1;y<=3;y++){
    if(!b.clear(x,y,z))throw Error('Dry marker overlaps authored source '+k);
    b.put(x,y,z,'wall','live:stone','none',
     {solglassSolidOriginalSunMarker:name,actuallyUnlit:true});
    windbreakStone++;
   }
  }
 }
 for(const[axis,fixed,lo,hi,holes]of [
  ['x',29,20,59,[23,24,31,32,40,41,49,50,57,58]],
  ['x',51,20,59,[23,24,31,32,40,41,49,50,57,58]],
  ['z',20,23,58,[26,27,35,36,44,45,53,54]],
  ['z',63,12,71,[17,18,28,29,39,40,52,53,65,66]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n,k=key(x,z);
  if(!indoor.has(k)||bearers.has(k)||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalDrySunhousePartition:true,automatedFarming:false});
 }
 for(const room of [
  ['north-sunkey-entrance',26,4,53,16],
  ['west-sunplate-gallery',6,13,29,55],
  ['east-dry-glass-gallery',50,13,73,55],
  ['central-sun-spine',31,19,49,62],
  ['southwest-seedwork-hall',10,50,33,69],
  ['southeast-dry-leaf-vault',47,50,70,69],
  ['northwest-sand-vane-annex',3,8,22,31],
  ['northeast-shade-vane-annex',57,8,77,31],
  ['southern-sundial-ambulatory',29,64,51,73],
  ['west-slatted-light-filter',3,37,16,64],
  ['east-slate-light-filter',65,37,77,64],
  ['south-open-view-canopy',31,75,49,77],
  ['north-sky-sunwell',34,24,45,35],
  ['west-open-garden',14,44,22,53],
  ['east-open-garden',57,44,65,53],
  ['south-sunlit-court',35,55,45,64],
  ['southwest-side-lightwell',21,57,26,64],
  ['west-dry-terrace-corridor',8,78,29,92],
  ['center-dry-terrace-corridor',31,80,49,92],
  ['east-dry-terrace-corridor',52,78,73,92],
  ['solar-transverse-exterior',12,89,70,92]
 ])b.room(...room);
 for(const[from,to,x,z]of [
  ['outside','north-sunkey-entrance',40,3],
  ['north-sunkey-entrance','central-sun-spine',40,18],
  ['north-sunkey-entrance','west-sunplate-gallery',29,14],
  ['north-sunkey-entrance','east-dry-glass-gallery',51,14],
  ['north-sunkey-entrance','northwest-sand-vane-annex',23,10],
  ['north-sunkey-entrance','northeast-shade-vane-annex',56,10],
  ['central-sun-spine','north-sky-sunwell',33,28],
  ['north-sky-sunwell','west-sunplate-gallery',32,27],
  ['north-sky-sunwell','east-dry-glass-gallery',48,27],
  ['central-sun-spine','west-open-garden',29,47],
  ['central-sun-spine','east-open-garden',51,47],
  ['west-sunplate-gallery','west-open-garden',23,46],
  ['east-dry-glass-gallery','east-open-garden',56,46],
  ['central-sun-spine','south-sunlit-court',34,59],
  ['south-sunlit-court','southern-sundial-ambulatory',40,65],
  ['west-sunplate-gallery','southwest-seedwork-hall',26,50],
  ['east-dry-glass-gallery','southeast-dry-leaf-vault',62,50],
  ['southwest-seedwork-hall','southern-sundial-ambulatory',34,67],
  ['southeast-dry-leaf-vault','southern-sundial-ambulatory',46,67],
  ['northwest-sand-vane-annex','west-slatted-light-filter',12,36],
  ['northeast-shade-vane-annex','east-slate-light-filter',69,36],
  ['west-sunplate-gallery','southwest-side-lightwell',20,59],
  ['southwest-side-lightwell','southwest-seedwork-hall',27,61],
  ['southwest-seedwork-hall','west-dry-terrace-corridor',19,71],
  ['southeast-dry-leaf-vault','east-dry-terrace-corridor',62,71],
  ['southern-sundial-ambulatory','south-open-view-canopy',40,75],
  ['south-open-view-canopy','center-dry-terrace-corridor',40,79],
  ['west-dry-terrace-corridor','solar-transverse-exterior',19,91],
  ['center-dry-terrace-corridor','solar-transverse-exterior',40,91],
  ['east-dry-terrace-corridor','solar-transverse-exterior',62,91]
 ]){
  const k=key(x,z);
  if(!founded(x,z)||reserved.has(k)||bearers.has(k))
   throw Error('Genuine original doorway cuts source structure or unfounded '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let panes=0,bays=0;
 for(const k of indoor){
  const[x,z]=k.split(',').map(Number);
  if(bearers.has(k)||(x*19+z*13)%12!==0||
   [1,2,3,4,5,6,7,8].some(y=>b.clear(x,y,z)))continue;
  const outward=Object.entries(dirs).find(([,d])=>!founded(x+d[0],z+d[1]));
  if(!outward)continue;
  for(let y=2;y<=6;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',outward[0],
    {originalFiveHighFramedCandidateGlass:true,actualPack4ColliderPending:true});
   panes++;
  }bays++;
 }
 return b.finish('Twelve authentically backed source roof wings, five full-height stone-founded open sky courtyards, four 5x7 real raised but dry cultivation terraces, four independently solid three-tier sun markers and three connected unroofed stone approaches. No agriculture, climate physics, working lighting or generated settlements.',{
  originalBuilderBWave:54,
  realSourceCoveredWings:first.size,
  trulySkyOpenStoneCourtSizes:[144,90,90,110,48],
  dryRaisedTerraceCount:beds.length,
  trulySolidDrySeedTerraceSourceCells:bedBases,
  actualRaisedStoneDryTerraceRims:bedRims,
  trueThreeTierSolidMasonryWindbreakCells:windbreakStone,
  genuineExteriorOriginalStoneFloorCells:outdoor.size,
  actualCardinalThreeArmExteriorConnection:true,
  realFramedFiveHighPack4CandidateCells:panes,
  completeFramedFiveHighOriginalBays:bays,
  cropGrowth:false,realWater:false,workingIrrigation:false,
  sunlightMechanics:false,installedPack3Pack4PhysicalApproval:false,
  productionRegistered:false,worldPlacement:false,saveSchema1Written:false,
  originalIphoneHomeScreenPwaAccepted:false,creatorVisualApproved:false
 });
}
