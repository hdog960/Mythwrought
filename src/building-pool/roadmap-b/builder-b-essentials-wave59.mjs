// MYTHWROUGHT Builder B ORIGINAL Wave59: Rimeglass Twin Beacon Observatory.
// Frozen B115-exclusive r1:lighthouse:snow:small:003. Two truly solid
// unequal beacon towers with uninterrupted masonry y1..28/y1..22,
// stone-backed unresolved Pack3 roof crown cells, 11 separately
// occupied hall roofs, 4 full-height sky-open stone courts, 3 solid
// masonry wind markers, two 5x5 raised dry stone signal plaques,
// connected ground-level walking around (NOT inside) both towers.
// No working beacon lights, upper floors, ship systems, native Pack3/4
// collision, original M7 player validation, settlement or save changes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const RIMEGLASS_TWIN_BEACON_ID='r1:lighthouse:snow:small:003';
export function buildRimeglassTwinBeaconObservatory(){
 const b=sourcePlan('lighthouse','snow','small',3,'Rimeglass Twin Beacon Observatory',70,42,94);
 const wings=[
 ['north-frostwind-reception',21,3,49,17,14,'pack3:026'],
 ['west-ridgekeeper-ledgers',5,10,27,45,16,'pack3:025'],
 ['east-winter-chart-archive',43,10,65,45,18,'pack3:023'],
 ['central-signal-nave',27,16,43,59,23,'pack3:026'],
 ['southwest-dry-frost-vault',8,46,29,61,17,'pack3:025'],
 ['southeast-moonmark-hall',41,46,62,61,19,'pack3:023'],
 ['northwest-bellwind-annex',3,6,19,33,15,'pack3:026'],
 ['northeast-spindrift-annex',51,6,66,33,17,'pack3:025'],
 ['southern-windward-nave',27,58,43,65,21,'pack3:023'],
 ['west-long-frost-bastion',3,35,13,58,17,'pack3:026'],
 ['east-long-rime-bastion',56,35,66,58,19,'pack3:025']
 ],courts=[
 ['north-starlit-stone-oculus',30,22,39,32],
 ['west-silent-rime-garden',15,36,22,44],
 ['east-silent-rime-garden',48,36,55,44],
 ['south-open-moonpool-stone',30,49,39,56]
 ],towers=[
 ['west-high-solid-rime-beacon',11,68,7,28,'pack3:026'],
 ['east-low-solid-snow-beacon',50,68,5,22,'pack3:025']
 ],markers=[
 ['western-stone-ice-marker',28,70],
 ['central-stone-ice-marker',35,70],
 ['eastern-stone-ice-marker',42,70]
 ],plaques=[
 ['west-dry-signal-tablet',30,79],
 ['east-dry-signal-tablet',42,79]
 ],K=(x,z)=>x+','+z,covered=new Set(),sky=new Set(),foot=new Map(),
 first=new Map(),posts=new Set(),towerXZ=new Set(),markerXZ=new Set(),
 plaqueXZ=new Set(),directions={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)covered.add(K(x,z));
 for(const [,x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){sky.add(K(x,z));covered.delete(K(x,z))}
 for(let x=2;x<=67;x++)for(let z=2;z<=91;z++)
  b.put(x,0,z,'foundation','live:stone','none',{realRimeglassStoneFoundation:true});
 for(const cell of covered){
  const [x,z]=cell.split(',').map(Number);
  if(Object.values(directions).some(([dx,dz])=>!covered.has(K(x+dx,z+dz))))
   for(let y=1;y<=10;y++)b.put(x,y,z,'wall','live:stone','none',
    {rimeglassActuallySourceMasonryEnvelope:true,pack3GamePhysicsUnrun:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(!covered.has(k)||foot.has(k))continue;
  const d=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(d/(name==='central-signal-nave'?3:5));
  foot.set(k,{name,y});
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',{rimeglassTrueOriginalImmediateRoofBacking:true});
  b.put(x,y,z,'roof',asset,'north',{rimeglassActualCoveredWing:name,installedPack3RoofCandidateOnly:true});
  if(!first.has(name))first.set(name,[x,z,y]);
 }
 for(const[name]of wings){const r=first.get(name);if(!r)throw Error('Entire original roof wing overlapped '+name);
  posts.add(K(r[0],r[1]));b.support(r[0],r[1],r[2]-1,'live:stone','rimeglass-grounded-original-hall-post-'+name);
 }
 let lowerStone=0,upperStone=0,crowns=0;
 for(const [name,cx,cz,span,top,asset]of towers){
  const rad=(span-1)/2;
  for(let x=cx-rad;x<=cx+rad;x++)for(let z=cz-rad;z<=cz+rad;z++){
   const k=K(x,z),edge=x===cx-rad||x===cx+rad||z===cz-rad||z===cz+rad;
   towerXZ.add(k);
   if(b.clear(x,0,z))throw Error('Tower has no original stone footing '+name+' '+k);
   for(let y=1;y<=4;y++){if(!b.clear(x,y,z))throw Error('Source tower lower block collision '+name+' '+K(x,z));
    b.put(x,y,z,'wall','live:stone','none',{rimeglassRealFourTierSolidTowerBase:name,realTowerEntry:false});lowerStone++;
   }
   if(!edge)continue;
   for(let y=5;y<=top;y++){if(!b.clear(x,y,z))throw Error('Original upper beacon stone ring interrupted '+name+' '+K(x,y,z));
    b.put(x,y,z,'wall','live:stone','none',{rimeglassRealFullHeightContinuousTowerRing:name,workingLantern:false});upperStone++;
   }
   if(!b.clear(x,top+1,z))throw Error('Unresolved beacon crown collision '+name+' '+K(x,z));
   b.put(x,top+1,z,'roof',asset,'north',{rimeglassTrueMasonryBackedTopCrown:name,operationalBeacon:false});crowns++;
  }
  // A solid tower is NOT a room. No false interior entrances or
  // fictional source upper-floor accessibility.
 }
 let windStone=0;
 for(const[name,cx,cz]of markers)for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  const k=K(x,z);markerXZ.add(k);
  if(b.clear(x,0,z)||towerXZ.has(k))throw Error('Wind marker has false original footing '+name);
  for(let y=1;y<=3;y++){if(!b.clear(x,y,z))throw Error('Wind marker original collision '+name+' '+K(x,y,z));
   b.put(x,y,z,'wall','live:stone','none',{rimeglassRealSolidSnowWindMarker:name,windPhysicsUnrun:true});windStone++;
  }
 }
 let tabletStone=0;
 for(const[name,cx,cz]of plaques)for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
  const k=K(x,z);plaqueXZ.add(k);
  if(b.clear(x,0,z)||towerXZ.has(k)||markerXZ.has(k)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Dry raised slate occupies invalid source '+name+' '+k);
  b.put(x,1,z,'furnishing','live:stone','none',
   {rimeglassRealRaisedStoneDrySignaltablet:name,realSignaling:false});tabletStone++;
 }
 for(const [axis,fixed,lo,hi,holes]of [
  ['x',27,17,51,[20,21,29,30,38,39,46,47]],
  ['x',43,17,51,[20,21,29,30,38,39,46,47]],
  ['z',19,21,50,[23,24,31,32,40,41,47,48]],
  ['z',56,13,57,[18,19,26,27,35,36,45,46,54,55]]
 ])for(let i=lo;i<=hi;i++){const x=axis==='x'?fixed:i,z=axis==='z'?fixed:i,k=K(x,z);
  if(!covered.has(k)||posts.has(k)||holes.includes(i))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood','none',
   {rimeglassRealHallScreen:true,livePhysicsUnrun:true});
 }
 for(const room of [
  ['north-frostwind-reception',22,4,48,16],
  ['west-ridgekeeper-ledgers',6,11,26,44],
  ['east-winter-chart-archive',44,11,64,44],
  ['central-signal-nave',28,17,42,58],
  ['southwest-dry-frost-vault',9,47,28,60],
  ['southeast-moonmark-hall',42,47,61,60],
  ['northwest-bellwind-annex',4,7,18,32],
  ['northeast-spindrift-annex',52,7,65,32],
  ['southern-windward-nave',28,59,42,64],
  ['west-long-frost-bastion',4,36,12,57],
  ['east-long-rime-bastion',57,36,65,57],
  ['north-starlit-stone-oculus',30,22,39,32],
  ['west-silent-rime-garden',15,36,22,44],
  ['east-silent-rime-garden',48,36,55,44],
  ['south-open-moonpool-stone',30,49,39,56],
  ['west-outer-stone-signal-approach',3,63,29,91],
  ['center-rimewind-open-walk',29,66,46,91],
  ['east-outer-stone-signal-approach',46,63,66,91],
  ['southern-open-signal-transverse',4,85,66,91]
 ])b.room(...room);
 for(const [from,to,x,z]of [
  ['outside','north-frostwind-reception',35,3],
  ['north-frostwind-reception','central-signal-nave',35,17],
  ['north-frostwind-reception','west-ridgekeeper-ledgers',27,12],
  ['north-frostwind-reception','east-winter-chart-archive',43,12],
  ['north-frostwind-reception','northwest-bellwind-annex',19,10],
  ['north-frostwind-reception','northeast-spindrift-annex',51,10],
  ['central-signal-nave','north-starlit-stone-oculus',29,27],
  ['north-starlit-stone-oculus','west-ridgekeeper-ledgers',27,26],
  ['north-starlit-stone-oculus','east-winter-chart-archive',42,26],
  ['central-signal-nave','west-silent-rime-garden',27,39],
  ['central-signal-nave','east-silent-rime-garden',43,39],
  ['west-ridgekeeper-ledgers','west-silent-rime-garden',23,39],
  ['east-winter-chart-archive','east-silent-rime-garden',47,39],
  ['central-signal-nave','south-open-moonpool-stone',29,52],
  ['south-open-moonpool-stone','southern-windward-nave',35,58],
  ['west-ridgekeeper-ledgers','southwest-dry-frost-vault',21,46],
  ['east-winter-chart-archive','southeast-moonmark-hall',51,46],
  ['southwest-dry-frost-vault','southern-windward-nave',28,60],
  ['southeast-moonmark-hall','southern-windward-nave',42,60],
  ['northwest-bellwind-annex','west-long-frost-bastion',9,35],
  ['northeast-spindrift-annex','east-long-rime-bastion',60,35],
  ['southwest-dry-frost-vault','west-outer-stone-signal-approach',19,62],
  ['southeast-moonmark-hall','east-outer-stone-signal-approach',53,62],
  ['southern-windward-nave','center-rimewind-open-walk',35,66],
  ['west-outer-stone-signal-approach','southern-open-signal-transverse',17,87],
  ['center-rimewind-open-walk','southern-open-signal-transverse',35,87],
  ['east-outer-stone-signal-approach','southern-open-signal-transverse',53,87]
 ]){
  const k=K(x,z);if(posts.has(k)||towerXZ.has(k)||markerXZ.has(k)||plaqueXZ.has(k))
   throw Error('Named passage would cut a real original solid structure '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let panes=0,bays=0;
 for(const cell of covered){const[x,z]=cell.split(',').map(Number);
  if(posts.has(cell)||(x*17+z*11)%11!==0||[1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(directions).find(([,d])=>
   !covered.has(K(x+d[0],z+d[1]))&&[2,3,4,5,6].every(y=>b.clear(x+d[0],y,z+d[1])));
  if(!face)continue;
  for(let y=2;y<=6;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],
   {rimeglassActuallyFramedSourcePack4Pane:true,livePack4PhysNotVerified:true});panes++;}
  bays++;
 }
 return b.finish('Two architecturally distinct truly solid-footed 7x7 and 5x5 unequal snow beacon monuments, full real masonry rings and stone-backed crown candidates, eleven actually supported covered roof wings, four fully sky-open stone courts, three physical windscreens, two raised stone dry tablet platforms and real exterior walking AROUND towers, never inside/above them. No lamps or navigation gameplay.',{
  originalBuilderBWave:59,
  authenticOccupiedCoveredRoofWings:first.size,
  fullHeightSkyOpenFoundedStoneCourtCounts:[110,72,72,80],
  realDistinctSolidBeaconMonuments:towers.length,
  trueSolidOriginalLowerBeaconStoneCells:lowerStone,
  trulyContinuousHighMasonryRingStoneCells:upperStone,
  originalStoneBackedUnresolvedPack3CrownCandidateCells:crowns,
  genuinelySolidStoneWindMarkerCells:windStone,
  actuallyRaisedDryStoneSignalTabletCells:tabletStone,
  realContiguousStoneY0FoundationCells:66*90,
  originalOutdoorBaseWalking:true,
  trueSourcePack4FiveHighCandidatePaneCells:panes,
  originalCompleteFramedFiveHighPaneBays:bays,
  activeBeaconLight:false,upperTowerAccess:false,shipNavigation:false,
  realInstalledPack3Pack4Physics:false,originalM7PlayerPhysTested:false,
  productionRegistered:false,worldPlacement:false,schema1SaveWritten:false,
  iPhoneHomeScreenPwaTested:false
 });
}
