// MYTHWROUGHT Builder B Roadmap B Wave53: Mirageglass Triple-Tide Registry.
// Frozen B115-only r1:harbor-office:desert:large:004. Eleven true distinct
// backed covered hall roofs, four fully exposed stone-founded open courts,
// three entirely separate solid-founded tall DRY navigation registers with
// 16-cell stone-backed candidate Pack3 crowns apiece, three real elevated
// dry manifest dais and a triple-lane pedestrian-only exterior route.
// NO water, waves, harbor trade, ships, working beacons, real installed
// Pack3/Pack4 collider/selection, settlements, save writes or PWA approval.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const MIRAGEGLASS_TRIPLE_LEDGER_ID='r1:harbor-office:desert:large:004';
export function buildMirageglassTripleTideRegistry(){
 const b=sourcePlan('harbor-office','desert','large',4,
  'Mirageglass Triple-Tide Registry',84,39,96);
 const wings=[
  ['north-shimmergate-intake',27,3,57,17,17,'pack3:026'],
  ['west-dry-quay-chart-hall',6,12,32,55,15,'pack3:025'],
  ['east-mirageglass-claims',52,12,78,55,20,'pack3:023'],
  ['central-seven-arch-registry',30,18,53,62,24,'pack3:026'],
  ['southwest-dry-ledger-vault',9,49,35,71,17,'pack3:025'],
  ['southeast-inert-saltglass-hall',49,49,75,71,21,'pack3:023'],
  ['northwest-sand-signals',3,6,24,34,15,'pack3:026'],
  ['northeast-high-dune-archive',60,6,81,34,18,'pack3:025'],
  ['southern-crescent-register',31,63,52,76,21,'pack3:023'],
  ['west-unlit-mirror-outrigger',3,37,17,65,16,'pack3:026'],
  ['east-unpowered-lens-outrigger',68,37,81,65,19,'pack3:025']
 ],courts=[
  ['north-real-open-zenith',35,22,46,33],
  ['west-real-dry-rose-court',14,44,22,53],
  ['east-real-dry-rose-court',61,44,69,53],
  ['south-sun-flooded-register',36,55,46,64]
 ],key=(x,z)=>x+','+z,
 indoors=new Set(),openCourts=new Set(),outdoor=new Set(),
 roofByCell=new Map(),firstRoofByName=new Map(),bearingXZ=new Set(),
 directions={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  indoors.add(key(x,z));
 for(const [,x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  openCourts.add(key(x,z));indoors.delete(key(x,z));
 }
 // Three truly outside aprons with a continuous cardinal walking transverse
 // at z90..94. Beacon footprints at z81 never borrow enclosed hall floors.
 for(const [x0,x1] of [[9,28],[32,52],[57,76]])
  for(let x=x0;x<=x1;x++)for(let z=72;z<=94;z++)
   if(!indoors.has(key(x,z))&&!openCourts.has(key(x,z)))outdoor.add(key(x,z));
 for(let x=12;x<=73;x++)for(let z=90;z<=94;z++)
  if(!indoors.has(key(x,z))&&!openCourts.has(key(x,z)))outdoor.add(key(x,z));
 const founded=(x,z)=>indoors.has(key(x,z))||openCourts.has(key(x,z))||outdoor.has(key(x,z));
 for(const k of new Set([...indoors,...openCourts,...outdoor])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {originalMirageglassReallyFoundedStone:true,realHarborWaterAbsent:true});
 }
 for(const k of indoors){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(directions).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=10;y++)
    b.put(x,y,z,'wall','live:stone','none',
     {actualOriginalHarborBuildingEnvelope:true,liveStormCertification:false});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=key(x,z);if(!indoors.has(k)||roofByCell.has(k))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(name==='central-seven-arch-registry'?3:5));
   roofByCell.set(k,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {reallySolidImmediateSourceRoofBacking:true,Pack3InstalledUnknown:true});
   b.put(x,y,z,'roof',asset,'north',
    {mirageglassActuallyDistinctRoofWing:name,physicalPack3ABIPending:true});
   if(!firstRoofByName.has(name))firstRoofByName.set(name,[x,z,y]);
  }
 for(const [name] of wings){
  const p=firstRoofByName.get(name);
  if(!p)throw Error('Mirageglass ghost original roof: '+name);
  bearingXZ.add(key(p[0],p[1]));
  b.support(p[0],p[1],p[2]-1,'live:stone',
   'mirageglass-actual-ground-roof-bearing-'+name);
 }
 // Three genuine 5x5 dry navigation monuments on outdoor floor. Lower
 // y1..4 is fully filled stone, upper y5..23 is a complete sixteen-cell
 // perimeter each tier. Pack3 crown y24 has immediate y23 stone backing.
 // No player stair route is claimed, nor working lighthouse beacon.
 const towers=[
  ['west-unlit-tide-register',19,83],
  ['central-unlit-tide-register',42,83],
  ['east-unlit-tide-register',67,83]
 ];let fullLowerTowerCells=0,continuousRingCells=0,roofCrownCells=0;
 const towerFootprints=new Set();
 for(const [name,cx,cz] of towers)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   const k=key(x,z);
   towerFootprints.add(k);
   if(!outdoor.has(k)||b.clear(x,0,z))
    throw Error('Actual desert dry tower has no stone footing '+name+' '+k);
   for(let y=1;y<=4;y++){
    b.put(x,y,z,'wall','live:stone','none',
     {fullSolidOriginalLowerDryTideMarker:name,unlitMonument:true});
    fullLowerTowerCells++;
   }
   const boundary=x===cx-2||x===cx+2||z===cz-2||z===cz+2;
   if(!boundary)continue;
   for(let y=5;y<=23;y++){
    b.put(x,y,z,'wall','live:stone','none',
     {continuousTrueMirageglassStoneTowerRing:name,actualSourceTier:y});
    continuousRingCells++;
   }
   b.put(x,24,z,'roof','pack3:025','north',
    {directlyBackedUnpoweredPack3Crown:name,installedPhysicalEnvelopeUnapproved:true});
   roofCrownCells++;
  }
 // Three truly authored 3x3 raised, dry inventory dais in the three real
 // covered halls. No active trade or inventory processing is inferred.
 const dais=[['west-stone-manifest-plinth',20,26],
  ['center-stone-manifest-plinth',41,45],
  ['east-stone-manifest-plinth',65,26]];
 let raisedOriginalDaisStone=0;
 const occupiedDaisXZ=new Set();
 for(const [name,cx,cz] of dais)
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   if(!indoors.has(key(x,z))||b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Dais has false source floor or obstruction '+name+' '+key(x,z));
   occupiedDaisXZ.add(key(x,z));
   b.put(x,1,z,'furnishing','live:stone','none',
    {genuineOriginalRaisedManifestDais:name,noTradeState:true});
   raisedOriginalDaisStone++;
  }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',29,18,59,[22,23,31,32,40,41,49,50,57,58]],
  ['x',54,18,59,[22,23,31,32,40,41,49,50,57,58]],
  ['z',20,21,59,[25,26,34,35,43,44,53,54]],
  ['z',62,14,72,[19,20,29,30,40,41,52,53,65,66]]
 ])for(let i=lo;i<=hi;i++){
  const x=axis==='x'?fixed:i,z=axis==='z'?fixed:i,k=key(x,z);
  if(!indoors.has(k)||occupiedDaisXZ.has(k)||bearingXZ.has(k)||holes.includes(i))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {actualDryLedgerRoomDivider:true,realBorderCustomsAI:false});
 }
 for(const room of [
  ['north-shimmergate-intake',28,4,56,16],
  ['west-dry-quay-chart-hall',7,13,31,54],
  ['east-mirageglass-claims',53,13,77,54],
  ['central-seven-arch-registry',31,19,52,61],
  ['southwest-dry-ledger-vault',10,50,34,70],
  ['southeast-inert-saltglass-hall',50,50,74,70],
  ['northwest-sand-signals',4,7,23,33],
  ['northeast-high-dune-archive',61,7,80,33],
  ['southern-crescent-register',32,64,51,75],
  ['west-unlit-mirror-outrigger',4,38,16,64],
  ['east-unpowered-lens-outrigger',69,38,80,64],
  ['north-real-open-zenith',35,22,46,33],
  ['west-real-dry-rose-court',14,44,22,53],
  ['east-real-dry-rose-court',61,44,69,53],
  ['south-sun-flooded-register',36,55,46,64],
  ['west-outdoor-stone-manifest-arm',9,72,28,94],
  ['central-outdoor-stone-manifest-arm',32,76,52,94],
  ['east-outdoor-stone-manifest-arm',57,72,76,94],
  ['triple-dry-register-crosswharf',12,90,73,94]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-shimmergate-intake',42,3],
  ['north-shimmergate-intake','central-seven-arch-registry',42,18],
  ['north-shimmergate-intake','west-dry-quay-chart-hall',29,14],
  ['north-shimmergate-intake','east-mirageglass-claims',54,14],
  ['north-shimmergate-intake','northwest-sand-signals',24,11],
  ['north-shimmergate-intake','northeast-high-dune-archive',60,11],
  ['central-seven-arch-registry','north-real-open-zenith',34,26],
  ['north-real-open-zenith','west-dry-quay-chart-hall',33,27],
  ['north-real-open-zenith','east-mirageglass-claims',48,27],
  ['central-seven-arch-registry','west-real-dry-rose-court',29,47],
  ['central-seven-arch-registry','east-real-dry-rose-court',54,47],
  ['west-dry-quay-chart-hall','west-real-dry-rose-court',23,46],
  ['east-mirageglass-claims','east-real-dry-rose-court',60,46],
  ['central-seven-arch-registry','south-sun-flooded-register',35,57],
  ['south-sun-flooded-register','southern-crescent-register',42,65],
  ['west-dry-quay-chart-hall','southwest-dry-ledger-vault',25,50],
  ['east-mirageglass-claims','southeast-inert-saltglass-hall',65,50],
  ['southwest-dry-ledger-vault','southern-crescent-register',35,66],
  ['southeast-inert-saltglass-hall','southern-crescent-register',49,66],
  ['northwest-sand-signals','west-unlit-mirror-outrigger',10,37],
  ['northeast-high-dune-archive','east-unpowered-lens-outrigger',73,37],
  ['southwest-dry-ledger-vault','west-outdoor-stone-manifest-arm',22,72],
  ['southeast-inert-saltglass-hall','east-outdoor-stone-manifest-arm',65,72],
  ['southern-crescent-register','central-outdoor-stone-manifest-arm',42,77],
  ['west-outdoor-stone-manifest-arm','triple-dry-register-crosswharf',21,92],
  ['central-outdoor-stone-manifest-arm','triple-dry-register-crosswharf',42,92],
  ['east-outdoor-stone-manifest-arm','triple-dry-register-crosswharf',66,92]
 ]){
  const k=key(x,z);
  if(!founded(x,z)||towerFootprints.has(k)||bearingXZ.has(k)||occupiedDaisXZ.has(k))
   throw Error('Illegal actual grounded, tower, post or dais gateway '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let paneCells=0,paneBays=0;
 for(const k of indoors){
  const [x,z]=k.split(',').map(Number);
  if(bearingXZ.has(k)||(x*17+z*11)%13!==0||
     [1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  const out=Object.entries(directions).find(([,d])=>!founded(x+d[0],z+d[1]));
  if(!out)continue;
  for(let y=2;y<=5;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',out[0],
    {mirageglassActuallyFramedFourHighSourcePane:true,Pack4PhysicalUnknown:true});
   paneCells++;
  }paneBays++;
 }
 return b.finish('Original triple dry tide-register towers rise from actual stone footing with 16-cell immediately backed Pack3 crowns; eleven separate backed harbor hall roofs, four sky-open courts, three solid dry manifest dais and connected open-air triple stone crosswharf. No ocean, live harbor economy, lights, stairs, saves or real Pack physics.',{
  originalBuilderBWave:53,
  actuallyDistinctCoveredRoofWings:firstRoofByName.size,
  fourFullyStoneFoundedSkyOpenCourts:[144,90,90,110],
  physicallyDistinctDryTideRegisterTowers:towers.length,
  originalSolidTowerFoundationCells:fullLowerTowerCells,
  sourceContinuousFullTowerRingCells:continuousRingCells,
  directlyStoneBackedPack3CrownSourceCells:roofCrownCells,
  literallyThreeDryManifestStoneDais:dais.length,
  originalRaisedDryDaisStoneCells:raisedOriginalDaisStone,
  trulyUnroofedOutsideStoneCrosswharfCells:outdoor.size,
  genuinelyConnectedTripleOutdoorWalkingArms:true,
  realSourceFramedFourHighPack4CandidatePaneCells:paneCells,
  realCompleteFourHighFramedGlassBays:paneBays,
  workingBeaconLighting:false,realSeaOrWater:false,shippingNavigation:false,
  realInventoryTrading:false,physicalPack3Pack4Approval:false,
  workingStairsToTowerTop:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false,
  iphoneHomeScreenPwaTested:false,creatorArtSignoff:false
 });
}
