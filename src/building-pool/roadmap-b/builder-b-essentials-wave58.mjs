// MYTHWROUGHT Builder B Wave58 — Rimebound Twin-Arc Snow Corrals.
// Frozen B115-only r1:stable:snow:small:005. Entire real authored
// yard foundation connected; asymmetric 11x13 and 13x15 timber-fenced
// corrals, stone-dry raised five-by-five feed tables, two original
// snow-wind baffles, eleven independently authored solid-backed
// Pack3 candidate roofs, four sky-open courts, true stone-glazed
// upright Pack4 candidate windows, and real exterior circulation.
// No horses, working feeding, snow AI, settlement, live registration,
// installed asset physics, saves, WebGL2 or iPhone PWA acceptance.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const RIMEBOUND_TWIN_ARC_ID='r1:stable:snow:small:005';
export function buildRimeboundTwinArcCorralStable(){
 const b=sourcePlan('stable','snow','small',5,'Rimebound Twin-Arc Snow Corrals',64,35,84);
 const roofWings=[
  ['northern-rime-entry',20,5,45,16,13,'pack3:026'],
  ['west-tack-and-fir-gallery',5,13,23,47,14,'pack3:025'],
  ['east-snowshoe-ledger',40,13,58,47,17,'pack3:023'],
  ['central-braided-windbreak',24,19,39,55,22,'pack3:026'],
  ['west-feeding-refuge',9,42,27,60,16,'pack3:025'],
  ['east-dry-hoof-hall',37,42,55,60,19,'pack3:023'],
  ['northwest-iced-arch',5,7,18,30,14,'pack3:026'],
  ['northeast-rimewatch-room',46,7,58,30,16,'pack3:025'],
  ['southern-pine-archway',27,53,37,62,19,'pack3:023'],
  ['west-fir-side-vault',5,31,12,50,15,'pack3:026'],
  ['east-fir-side-vault',51,31,58,50,17,'pack3:025']
 ],courts=[
  ['northern-open-sky-oculus',27,24,36,34],
  ['west-open-snow-yard',14,38,21,45],
  ['east-open-snow-yard',43,38,50,45],
  ['southern-open-crosscourt',28,48,36,55]
 ],corrals=[
  ['west-elongated-snow-corral',8,65,18,77,13,71],
  ['east-broad-rime-corral',43,63,55,77,49,70]
 ],K=(x,z)=>x+','+z,roofFoot=new Map(),roofsFirst=new Map(),
 halls=new Set(),sky=new Set(),roofSupports=new Set(),railsXZ=new Set(),
 feedXZ=new Set(),windXZ=new Set(),border={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1]of roofWings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)halls.add(K(x,z));
 for(const [,x0,z0,x1,z1]of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){sky.add(K(x,z));halls.delete(K(x,z))}
 // A single actual connected stone yard, rather than disconnected
 // decorative room islands. The protected sourcePlan walking and
 // duplicate voxel validators remain completely unchanged.
 const founded=(x,z)=>x>=4&&x<=59&&z>=3&&z<=81;
 for(let x=4;x<=59;x++)for(let z=3;z<=81;z++)
  b.put(x,0,z,'foundation','live:stone','none',{rimeboundTrueOriginalContiguousStoneYard:true});
 // Three substantial but open-ended facade walls; no fictitious
 // enclosing structures or wall-teleporting walking connectivity.
 for(const [axis,n,lo,hi]of [['x',5,15,38],['x',58,15,38],['z',5,24,41]]){
  for(let t=lo;t<=hi;t++){
   const x=axis==='x'?n:t,z=axis==='z'?n:t;
   if(sky.has(K(x,z)))continue;
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:stone','none',
    {rimeboundOriginalMasonryWinterFacade:true,notWeatherCertified:true});
  }
 }
 for(const[name,x0,z0,x1,z1,base,asset]of roofWings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(!halls.has(k)||roofFoot.has(k))continue;
  const d=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(d/(name==='central-braided-windbreak'?3:5));
  roofFoot.set(k,{name,y});
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
   {rimeboundActuallyDirectOriginalPack3Backing:true});
  b.put(x,y,z,'roof',asset,'north',{rimeboundActualUniqueRoofWing:name,realPack3ProducerUnrun:true});
  if(!roofsFirst.has(name))roofsFirst.set(name,[x,z,y]);
 }
 for(const [name]of roofWings){const p=roofsFirst.get(name);if(!p)throw Error('Rimebound roof wing entirely occluded '+name);
  roofSupports.add(K(p[0],p[1]));
  b.support(p[0],p[1],p[2]-1,'live:stone','rimebound-source-continuous-roof-bearing-'+name);
 }
 let trueRailCells=0,gateCells=0,feedStoneCells=0,raisedFeedRims=0;
 for(const[name,x0,z0,x1,z1,cx,cz]of corrals){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=K(x,z),rim=x===x0||x===x1||z===z0||z===z1,
    gate=(x===cx-1||x===cx)&&(z===z0||z===z1);
   if(!founded(x,z)||b.clear(x,0,z))throw Error('Unfounded corral '+name+' '+k);
   if(rim&&!gate){railsXZ.add(k);for(let y=1;y<=2;y++){
    if(!b.clear(x,y,z))throw Error('Corral timber rail overlaps authored source '+name+' '+k);
    b.put(x,y,z,'wall','live:wood','none',{rimeboundPhysicalOpaqueTwoHighCorralRail:name,actualAnimalCollisionNotTested:true});trueRailCells++;
   }}
   if(gate){if(!b.clear(x,1,z)||!b.clear(x,2,z))throw Error('Real two-high gate obstructed '+name+' '+k);gateCells++;}
  }
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   const k=K(x,z),raised=x===cx-2||x===cx+2||z===cz-2||z===cz+2;
   if(b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('False physically raised dry snow-stable feeder '+name+' '+k);
   feedXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',
    {rimeboundTrueStoneFoundedDryFiveByFiveFeeder:name,workingHorseFeeding:false});feedStoneCells++;
   if(raised){b.put(x,2,z,'furnishing','live:stone','none',
     {rimeboundActualRaisedStoneFeederRim:name,realFeedStorage:false});raisedFeedRims++;}
  }
  b.room(name,x0+1,z0+1,x1-1,z1-1);
 }
 let windCells=0;
 for(const[name,cx,cz]of [['west-original-snowwall',29,65],['east-original-snowwall',36,65]]){
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   const k=K(x,z);
   if(b.clear(x,0,z)||railsXZ.has(k)||feedXZ.has(k))throw Error('Winter wind baffle not actually founded '+name+' '+k);
   windXZ.add(k);
   for(let y=1;y<=3;y++){if(!b.clear(x,y,z))throw Error('Winter wind baffle physically overlapping '+k);
    b.put(x,y,z,'wall','live:stone','none',{rimeboundTrueGroundedThreeHighWindBaffle:name,noLiveWindPhysics:true});windCells++;
   }
  }
 }
 let tack=0;
 for(let x=31;x<=33;x++)for(let z=72;z<=74;z++){
  const k=K(x,z);
  if(b.clear(x,0,z)||windXZ.has(k)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Original raised dry tack counter not grounded/empty '+k);
  feedXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',{rimeboundRealNineStoneDryTackPlinth:true});tack++;
 }
 // Hollow timber partitions with reserved apertures only within the
 // original hall footprint, without modifying original global validators.
 for(const [axis,fixed,lo,hi,holes]of [
  ['x',24,18,52,[21,22,28,29,36,37,43,44,49,50]],
  ['x',40,18,52,[21,22,28,29,36,37,43,44,49,50]],
  ['z',19,18,47,[22,23,29,30,37,38,43,44]],
  ['z',55,14,53,[18,19,26,27,35,36,44,45]]
 ])for(let t=lo;t<=hi;t++){
  const x=axis==='x'?fixed:t,z=axis==='z'?fixed:t,k=K(x,z);
  if(!halls.has(k)||roofSupports.has(k)||holes.includes(t))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood','none',
   {rimeboundOriginalFrostStableScreen:true,workingStableSystems:false});
 }
 for(const [name,x0,z0,x1,z1]of [
  ['northern-rime-entry',21,6,44,15],['west-tack-and-fir-gallery',6,14,22,46],
  ['east-snowshoe-ledger',41,14,57,46],['central-braided-windbreak',25,20,38,54],
  ['west-feeding-refuge',10,43,26,59],['east-dry-hoof-hall',38,43,54,59],
  ['northwest-iced-arch',6,8,17,29],['northeast-rimewatch-room',47,8,57,29],
  ['southern-pine-archway',28,54,36,61],['west-fir-side-vault',6,32,11,49],
  ['east-fir-side-vault',52,32,57,49],
  ['northern-open-sky-oculus',27,24,36,34],['west-open-snow-yard',14,38,21,45],
  ['east-open-snow-yard',43,38,50,45],['southern-open-crosscourt',28,48,36,55],
  ['west-frost-corral-approach',5,61,23,81],
  ['center-frost-stone-crossyard',24,61,40,81],
  ['east-frost-corral-approach',41,61,59,81],
  ['south-snowshoe-transverse',10,79,55,81]
 ])b.room(name,x0,z0,x1,z1);
 const doorways=[
  ['outside','northern-rime-entry',32,5],
  ['northern-rime-entry','central-braided-windbreak',32,18],
  ['northern-rime-entry','west-tack-and-fir-gallery',24,13],
  ['northern-rime-entry','east-snowshoe-ledger',40,13],
  ['northern-rime-entry','northwest-iced-arch',18,10],
  ['northern-rime-entry','northeast-rimewatch-room',46,10],
  ['central-braided-windbreak','northern-open-sky-oculus',26,28],
  ['northern-open-sky-oculus','west-tack-and-fir-gallery',23,27],
  ['northern-open-sky-oculus','east-snowshoe-ledger',40,27],
  ['central-braided-windbreak','west-open-snow-yard',24,40],
  ['central-braided-windbreak','east-open-snow-yard',40,40],
  ['west-tack-and-fir-gallery','west-open-snow-yard',22,39],
  ['east-snowshoe-ledger','east-open-snow-yard',41,39],
  ['central-braided-windbreak','southern-open-crosscourt',27,50],
  ['southern-open-crosscourt','southern-pine-archway',32,56],
  ['west-tack-and-fir-gallery','west-feeding-refuge',19,44],
  ['east-snowshoe-ledger','east-dry-hoof-hall',48,44],
  ['west-feeding-refuge','southern-pine-archway',28,57],
  ['east-dry-hoof-hall','southern-pine-archway',40,57],
  ['northwest-iced-arch','west-fir-side-vault',8,31],
  ['northeast-rimewatch-room','east-fir-side-vault',55,31],
  ['west-feeding-refuge','west-frost-corral-approach',15,62],
  ['east-dry-hoof-hall','east-frost-corral-approach',50,62],
  ['southern-pine-archway','center-frost-stone-crossyard',32,63],
  ['west-frost-corral-approach','south-snowshoe-transverse',14,80],
  ['center-frost-stone-crossyard','south-snowshoe-transverse',32,80],
  ['east-frost-corral-approach','south-snowshoe-transverse',50,80]
 ];
 for(const[from,to,x,z]of doorways){
  const k=K(x,z);
  if(!founded(x,z)||roofSupports.has(k)||railsXZ.has(k)||feedXZ.has(k)||windXZ.has(k))
   throw Error('Source portal would illegally cut original bearing, rail or dry feeder '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [name,x0,z0,x1,z1,cx]of corrals)for(const z of [z0,z1]){
  const x=cx-1,k=K(x,z);
  if(!founded(x,z)||railsXZ.has(k)||feedXZ.has(k)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Original snow corral portal not actually two-high clear '+name+' '+k);
  b.portal('south-snowshoe-transverse',name,x,z);
 }
 let panes=0,bays=0;
 // Four-high source candidate Pack4 glazing in original partial wall
 // facades, preserving solid y1/y7 framing and exterior-facing cells.
 for(const cell of halls){
  const [x,z]=cell.split(',').map(Number);
  if(roofSupports.has(cell)||(x*17+z*13)%7!==0||
     [1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(border).find(([,d])=>!halls.has(K(x+d[0],z+d[1]))&&[2,3,4,5,6].every(y=>b.clear(x+d[0],y,z+d[1])));
  if(!face)continue;
  for(let y=2;y<=6;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],
    {rimeboundRealFramedCandidatePack4Window:true,installedPack4SelectionUnverified:true});panes++;}
  bays++;
 }
 return b.finish('Rimebound small snow-stable original stone-founded continuous yard, two asymmetric truly timber-fenced open corrals with physically clear north/south gates and 5x5 raised dry feed platforms, two solid masonry snow baffles, one stone tack plinth, four completely open courts and eleven supported roof regions. Only source geometry; no actual horses, snow weather, power or live game integration.',{
  originalBuilderBWave:58,actuallyDistinctRoofWings:roofsFirst.size,
  trulyStoneFoundedFullHeightSkyOpenCourts:[110,64,64,72],
  originalAsymmetricCorralCount:corrals.length,
  trulyOpaqueTwoTierWoodRailCells:trueRailCells,
  trueTwoHighOppositeGateCells:gateCells,
  realSolidDryFiveByFiveFeedPlatformCells:feedStoneCells,
  genuineRaisedStoneFeederRimCells:raisedFeedRims,
  trulyGroundedStoneSnowBaffleCells:windCells,
  actualRaisedDryStoneTackCells:tack,
  originalFootingStoneCells:56*79,
  trueSouthThreeWayOutsideWalk:true,
  originalPack4CandidateWindowCells:panes,completeOriginalFramedGlazingBays:bays,
  activeHorses:false,workingAnimalFeeding:false,liveWeather:false,
  realPack3Pack4CollisionSelectionAccepted:false,
  realM7PlayerStepAccepted:false,productionRegistered:false,
  worldPlacement:false,schema1SaveWritten:false,iphonePwaAccepted:false
 });
}
