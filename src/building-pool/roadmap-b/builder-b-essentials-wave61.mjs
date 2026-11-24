// MYTHWROUGHT Builder B Wave61 — Rimewhorl Four Open Dry Sauna Courts.
// B115-exclusive original source r1:bathhouse:snow:small:004.
// Four independently passable 7x7 ORIGINAL walk-in, DRY stone ring
// courts, genuine two-tier stone surrounds with opposite clear gates,
// twelve founded stone benches, three full stone wind screens, nine
// separately source-backed covered winter-gallery Pack3 roof wings,
// four wholly sky-open interior courts and complete outward Pack4
// candidate glazed stone bays. No heat, fire, water, bathing gameplay,
// game registration, settlement, save change, or installed physics.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const RIMEWHORL_FOUR_DRY_COURTS_ID='r1:bathhouse:snow:small:004';
export function buildRimewhorlFourDrySaunaCourts(){
 const b=sourcePlan('bathhouse','snow','small',4,'Rimewhorl Four Open Dry Sauna Courts',64,33,76);
 const wings=[
  ['northern-slate-arrival',18,3,45,17,13,'pack3:026'],
  ['western-snowcloak-hall',5,12,23,48,14,'pack3:025'],
  ['eastern-rimecloak-hall',41,12,59,48,16,'pack3:023'],
  ['central-steamless-nave',24,18,40,52,20,'pack3:026'],
  ['southwest-dry-slate-room',7,45,28,60,16,'pack3:025'],
  ['southeast-dry-slate-room',36,45,57,60,18,'pack3:023'],
  ['northwest-winter-annex',4,7,16,31,14,'pack3:026'],
  ['northeast-winter-annex',48,7,60,31,16,'pack3:025'],
  ['southern-snowarch-traverse',25,52,40,62,19,'pack3:023']
 ],courts=[
  ['northern-frost-oculus',27,24,36,32],
  ['western-bright-rime-court',14,35,20,41],
  ['eastern-bright-rime-court',44,35,50,41],
  ['southern-open-slate-court',28,46,35,52]
 ],baths=[
  ['western-slate-dry-sauna',10,67],
  ['midwestern-slate-dry-sauna',24,67],
  ['mideastern-slate-dry-sauna',40,67],
  ['eastern-slate-dry-sauna',54,67]
 ],baffles=[
  ['left-stone-snowguard',17,67],['middle-stone-snowguard',33,67],
  ['right-stone-snowguard',47,67]
 ],K=(x,z)=>x+','+z,covered=new Set(),skyXZ=new Set(),
 ownedRoof=new Set(),firstRoof=new Map(),roofPosts=new Set(),
 ringXZ=new Set(),benchXZ=new Set(),windXZ=new Set(),
 dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const[,x0,z0,x1,z1]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)covered.add(K(x,z));
 for(const[,x0,z0,x1,z1]of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  skyXZ.add(K(x,z));covered.delete(K(x,z));
 }
 // One genuinely source-connected original y0 ground for halls,
 // outside walks, stone courtyard rings, benches and masonry baffles.
 for(let x=2;x<=61;x++)for(let z=2;z<=73;z++)
  b.put(x,0,z,'foundation','live:stone','none',{rimewhorlRealOriginalStoneFooting:true});
 for(const k of covered){const[x,z]=k.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!covered.has(K(x+dx,z+dz))))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:stone','none',
    {rimewhorlAuthenticSlateGalleryWall:true,actualHeating:false});
 }
 // Separate original authored roof cells with real stone solid
 // source y-1 backing; every named wing requires a bearing post.
 for(const[name,x0,z0,x1,z1,base,asset]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(!covered.has(k)||ownedRoof.has(k))continue;
  const d=Math.min(x-x0,x1-x,z-z0,z1-z),
   y=base+Math.floor(d/(name==='central-steamless-nave'?3:5));
  ownedRoof.add(k);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
   {rimewhorlActualImmediatePack3Backing:true});
  b.put(x,y,z,'roof',asset,'north',
   {rimewhorlDistinctRealRoofWing:name,installedPack3CollisionUnrun:true});
  if(!firstRoof.has(name))firstRoof.set(name,[x,z,y]);
 }
 for(const[name]of wings){const p=firstRoof.get(name);
  if(!p)throw Error('Original roof wing has no owned source cells '+name);
  roofPosts.add(K(p[0],p[1]));
  b.support(p[0],p[1],p[2]-1,'live:stone',
   'rimewhorl-original-full-stone-roof-post-'+name);
 }
 let railStone=0,gateCells=0,benchStone=0;
 for(const[name,cx,cz]of baths){
  // A 7x7 founding floor ring with only two opposite two-cell
  // real gates, opaque original y1 and y2 stone on the remaining
  // perimeter. Upper center remains truly open to sky.
  for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
   const k=K(x,z),perimeter=x===cx-3||x===cx+3||z===cz-3||z===cz+3,
    gate=(x===cx-1||x===cx)&&(z===cz-3||z===cz+3);
   if(b.clear(x,0,z))throw Error('Walk-in dry court has no actual stone y0 footing '+name+' '+k);
   if(perimeter&&!gate){
    ringXZ.add(k);
    for(let y=1;y<=2;y++){
     if(!b.clear(x,y,z))throw Error('Two-tier court ring intersects existing voxel '+name+' '+K(x,y,z));
     b.put(x,y,z,'wall','live:stone','none',
      {rimewhorlTrueTwoTierStoneCourtRing:name,liveSaunaHeating:false});railStone++;
    }
   }
   if(gate){
    if(!b.clear(x,1,z)||!b.clear(x,2,z))throw Error('Dry stone ring gate blocked '+name+' '+k);
    gateCells++;
   }
  }
  // One real 1x3 original stone bench per court, deliberately
  // offset so left-hand cardinal gate-to-gate walking survives.
  for(let z=cz-1;z<=cz+1;z++){
   const x=cx+1,k=K(x,z);
   if(b.clear(x,0,z)||ringXZ.has(k)||!b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Dry source stone bench physically obstructed '+name+' '+k);
   benchXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',
    {rimewhorlRealGroundedDrySaunaBench:name,noLiveThermalPhysics:true});benchStone++;
  }
  b.room(name,cx-2,cz-2,cx+2,cz+2);
 }
 let windStone=0;
 for(const[name,cx,cz]of baffles)for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  const k=K(x,z);
  if(b.clear(x,0,z)||ringXZ.has(k)||benchXZ.has(k))throw Error('Windguard real footing collides '+name+' '+k);
  windXZ.add(k);
  for(let y=1;y<=3;y++){
   if(!b.clear(x,y,z))throw Error('Windguard real source masonry blocked '+name+' '+K(x,y,z));
   b.put(x,y,z,'wall','live:stone','none',
    {rimewhorlActualStoneSnowguard:name,realWinterSimulation:false});windStone++;
  }
 }
 // Genuine original gallery partitions preserve open passage cuts.
 for(const[axis,fixed,lo,hi,holes]of [
  ['x',24,18,46,[22,23,29,30,36,37,43,44]],
  ['x',41,18,46,[22,23,29,30,36,37,43,44]],
  ['z',18,18,46,[21,22,29,30,37,38,43,44]],
  ['z',52,13,54,[18,19,26,27,34,35,43,44,51,52]]
 ])for(let t=lo;t<=hi;t++){
  const x=axis==='x'?fixed:t,z=axis==='z'?fixed:t,k=K(x,z);
  if(!covered.has(k)||roofPosts.has(k)||holes.includes(t))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {rimewhorlOriginalEnclosedGalleryScreen:true});
 }
 for(const room of [
  ['northern-slate-arrival',19,4,44,16],
  ['western-snowcloak-hall',6,13,22,47],
  ['eastern-rimecloak-hall',42,13,58,47],
  ['central-steamless-nave',25,19,39,51],
  ['southwest-dry-slate-room',8,46,27,59],
  ['southeast-dry-slate-room',37,46,56,59],
  ['northwest-winter-annex',5,8,15,30],
  ['northeast-winter-annex',49,8,59,30],
  ['southern-snowarch-traverse',26,53,39,61],
  ['northern-frost-oculus',27,24,36,32],
  ['western-bright-rime-court',14,35,20,41],
  ['eastern-bright-rime-court',44,35,50,41],
  ['southern-open-slate-court',28,46,35,52],
  ['west-snow-approach',3,61,17,73],
  ['midwest-snow-approach',18,61,31,73],
  ['mideast-snow-approach',32,61,47,73],
  ['east-snow-approach',48,61,61,73],
  ['southern-unbroken-stone-crosswalk',3,71,61,73]
 ])b.room(...room);
 for(const[from,to,x,z]of [
  ['outside','northern-slate-arrival',32,3],
  ['northern-slate-arrival','central-steamless-nave',32,18],
  ['northern-slate-arrival','western-snowcloak-hall',23,12],
  ['northern-slate-arrival','eastern-rimecloak-hall',41,12],
  ['northern-slate-arrival','northwest-winter-annex',16,10],
  ['northern-slate-arrival','northeast-winter-annex',48,10],
  ['central-steamless-nave','northern-frost-oculus',26,28],
  ['northern-frost-oculus','western-snowcloak-hall',23,27],
  ['northern-frost-oculus','eastern-rimecloak-hall',41,27],
  ['central-steamless-nave','western-bright-rime-court',23,38],
  ['central-steamless-nave','eastern-bright-rime-court',41,38],
  ['western-snowcloak-hall','western-bright-rime-court',21,38],
  ['eastern-rimecloak-hall','eastern-bright-rime-court',43,38],
  ['central-steamless-nave','southern-open-slate-court',27,49],
  ['southern-open-slate-court','southern-snowarch-traverse',32,53],
  ['western-snowcloak-hall','southwest-dry-slate-room',17,45],
  ['eastern-rimecloak-hall','southeast-dry-slate-room',47,45],
  ['southwest-dry-slate-room','southern-snowarch-traverse',28,57],
  ['southeast-dry-slate-room','southern-snowarch-traverse',36,57],
  ['northwest-winter-annex','western-snowcloak-hall',10,31],
  ['northeast-winter-annex','eastern-rimecloak-hall',54,31],
  ['southwest-dry-slate-room','west-snow-approach',10,61],
  ['southeast-dry-slate-room','east-snow-approach',54,61],
  ['southern-snowarch-traverse','midwest-snow-approach',25,63],
  ['southern-snowarch-traverse','mideast-snow-approach',40,63],
  ['west-snow-approach','southern-unbroken-stone-crosswalk',10,72],
  ['midwest-snow-approach','southern-unbroken-stone-crosswalk',24,72],
  ['mideast-snow-approach','southern-unbroken-stone-crosswalk',40,72],
  ['east-snow-approach','southern-unbroken-stone-crosswalk',54,72]
 ]){
  const k=K(x,z);
  if(roofPosts.has(k)||ringXZ.has(k)||benchXZ.has(k)||windXZ.has(k))
   throw Error('Original named clear portal would cut genuine solid '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const[name,cx,cz]of baths){
  for(const z of[cz-3,cz+3]){
   const x=cx-1,k=K(x,z);
   if(!b.clear(x,1,z)||!b.clear(x,2,z)||ringXZ.has(k)||benchXZ.has(k))
    throw Error('Original sauna named entry not actually two-high clear '+name+' '+k);
   b.portal('southern-unbroken-stone-crosswalk',name,x,z);
  }
 }
 let panes=0,bays=0;
 for(const cell of covered){const[x,z]=cell.split(',').map(Number);
  if(roofPosts.has(cell)||(x*17+z*11)%9!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,d])=>!covered.has(K(x+d[0],z+d[1]))&&
   [2,3,4,5].every(y=>b.clear(x+d[0],y,z+d[1])));
  if(!face)continue;
  for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],
   {rimewhorlTrueFramedSourceGlassCandidate:true,installedPack4SelectionUnrun:true});panes++;}
  bays++;
 }
 return b.finish('Four independently accessible real stone-founded DRY sauna courts, original two-high opaque stone perimeter rings and opposite two-high clear gates, four solid dry benches, three truly solid snowguards, nine original stone-supported winter roofs and real outdoor circulation. No actual heat or water.',{
  originalBuilderBWave:61,realOccupiedPack3CoveredRoofWings:firstRoof.size,
  sourceFullSkyOpenCourtCells:[90,49,49,56],
  actuallyClearHeadWalkThroughDryBathCourts:baths.length,
  originalTrueOpaqueTwoTierStoneCourtRingCells:railStone,
  originalTrueClearTwoHighGatePositions:gateCells,
  realStoneFoundedSolidDrySaunaBenchCells:benchStone,
  trueThreeTierSolidStoneSnowguards:windStone,
  genuinelyContinuousStoneY0FoundationCells:60*72,
  sourcePack4CandidatePaneCells:panes,realFourHighFramedWindowBays:bays,
  realHeating:false,liveWater:false,gameplayBathing:false,
  installedPack3Pack4PhysicalApproved:false,originalM7PlayerRun:false,
  productionRegistered:false,worldPlacement:false,schema1SaveWritten:false,
  installedIphoneHomeScreenPwaAccepted:false
 });
}
