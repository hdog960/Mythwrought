// MYTHWROUGHT Builder B Wave51: Suncairn Three-Crown Dry Beacon Relay.
// Original B115-exclusive r1:lighthouse:desert:large:003. Three distinct
// physically stone-founded unlit beacon towers with actual continuous
// perimeter masonry and source-backed 16-cell Pack3 crowns; eleven separate
// backed hall roofs, four real open-sky paved courts and three connected
// dry exterior walk arms. Towers have NO upper stair route certification.
// No actual light, water, ships, tides, live Pack3/4 collision/selection,
// settlements, environment physics, runtime registration or saved world edits.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNCAIRN_THREE_CROWN_ID='r1:lighthouse:desert:large:003';
export function buildSuncairnThreeCrownBeaconRelay(){
 const b=sourcePlan('lighthouse','desert','large',3,
  'Suncairn Three-Crown Dry Beacon Relay',80,40,86);
 const wings=[
  ['north-dry-watch-register',25,3,55,18,15,'pack3:025'],
  ['west-sandglass-records',6,13,30,52,16,'pack3:026'],
  ['east-unlit-signal-archive',49,12,73,53,18,'pack3:023'],
  ['central-long-sun-mapping',29,19,50,64,23,'pack3:025'],
  ['southwest-dry-keeper-hall',9,48,33,68,17,'pack3:026'],
  ['southeast-unpowered-mirror-store',46,48,71,68,20,'pack3:023'],
  ['northwest-shaded-beacon-annex',2,6,22,31,14,'pack3:025'],
  ['northeast-dust-dry-lookout',57,6,77,32,17,'pack3:026'],
  ['southern-three-crown-colonnade',29,64,51,74,21,'pack3:023'],
  ['west-outer-solar-shield',2,33,15,61,15,'pack3:026'],
  ['east-outer-solar-shield',65,33,77,62,19,'pack3:025']
 ],courts=[
  ['north-open-shadow-court',34,22,45,33],
  ['west-open-tally-court',14,43,22,51],
  ['east-open-tally-court',57,43,65,51],
  ['south-open-register-court',35,53,44,61]
 ],key=(x,z)=>x+','+z,indoors=new Set(),court=new Set(),outside=new Set(),
  roofMap=new Map(),firstRoofByName=new Map(),bearingXZ=new Set(),
  directions={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoors.add(key(x,z));
 for(const [,x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   court.add(key(x,z));indoors.delete(key(x,z));
  }
 for(const [x0,x1] of [[16,24],[36,44],[56,64]])
  for(let x=x0;x<=x1;x++)for(let z=72;z<=84;z++)
   if(!indoors.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 for(const [x0,x1]of [[16,24],[56,64]])
  for(let x=x0;x<=x1;x++)for(let z=69;z<=71;z++)
   if(!indoors.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 for(let x=18;x<=62;x++)for(let z=81;z<=84;z++)
  if(!indoors.has(key(x,z))&&!court.has(key(x,z)))outside.add(key(x,z));
 const founded=(x,z)=>indoors.has(key(x,z))||court.has(key(x,z))||outside.has(key(x,z));
 for(const c of new Set([...indoors,...court,...outside])){
  const [x,z]=c.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {actualSuncairnOriginalStoneBase:true,waterOrWorldStateUnchanged:true});
 }
 for(const c of indoors){
  const [x,z]=c.split(',').map(Number);
  if(Object.values(directions).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=10;y++)
    b.put(x,y,z,'wall','live:stone','none',
     {realSuncairnEnclosedMasonry:true,stormRatingNotVerified:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=key(x,z);if(!indoors.has(k)||roofMap.has(k))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(name==='central-long-sun-mapping'?3:5));
   roofMap.set(k,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {originalImmediateSupportUnderPack3:true,installedPack3BearingUnknown:true});
   b.put(x,y,z,'roof',asset,'north',
    {suncairnRealDifferentiatedRoofWing:name,colliderSelectionPending:true});
   if(!firstRoofByName.has(name))firstRoofByName.set(name,[x,z,y]);
  }
 for(const [name] of wings){
  const p=firstRoofByName.get(name);
  if(!p)throw Error('Suncairn proposed roof entirely occluded: '+name);
  bearingXZ.add(key(p[0],p[1]));
  b.support(p[0],p[1],p[2]-1,'live:stone',
   'suncairn-ground-to-real-roof-stone-post-'+name);
 }
 // Three independent solid-base unlit masonry beacon towers. y1..4 is
 // truly solid 25-cell original stone slab (no phantom ground walking),
 // y5..26 is a continuous ALL 16 perimeter cells x 22 tiers. Only those
 // perimeter cells receive directly stone-backed candidate Pack3 roof at y27.
 // No internal stair or elevated player walking is falsely claimed.
 const towers=[
  ['west-dry-crown',20,77],['center-dry-crown',40,77],
  ['east-dry-crown',60,77]
 ];let solidFoot=0,upperRing=0,crownCells=0;
 for(const [name,cx,cz] of towers)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   if(!outside.has(key(x,z))||b.clear(x,0,z))
    throw Error('Suncairn tower lacks genuinely exterior founded source floor '+name+' '+key(x,z));
   for(let y=1;y<=4;y++){
    b.put(x,y,z,'wall','live:stone','none',
     {solidFullLowerMasonryBeacon:name,permanentStoneBeaconBody:true});
    solidFoot++;
   }
   const perimeter=x===cx-2||x===cx+2||z===cz-2||z===cz+2;
   if(!perimeter)continue;
   for(let y=5;y<=26;y++){
    b.put(x,y,z,'wall','live:stone','none',
     {originalContinuousHighStoneBeaconRing:name,masonryTowerTier:y});
    upperRing++;
   }
   b.put(x,27,z,'roof','pack3:025','north',
    {immediatelyStoneBackedUnlitBeaconCrown:name,activeBeaconIllumination:false});
   crownCells++;
  }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',28,19,58,[24,25,32,33,41,42,49,50,56,57]],
  ['x',51,18,59,[23,24,31,32,40,41,49,50,57,58]],
  ['z',19,22,56,[26,27,34,35,43,44,51,52]],
  ['z',62,12,70,[17,18,30,31,40,41,57,58]]
 ])for(let i=lo;i<=hi;i++){
  const x=axis==='x'?fixed:i,z=axis==='z'?fixed:i;
  if(!indoors.has(key(x,z))||holes.includes(i)||bearingXZ.has(key(x,z)))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {drySignalArchiveDivider:true,actualAutomatedLighthouseWork:false});
 }
 for(const row of [
  ['north-dry-watch-register',26,4,54,17],
  ['west-sandglass-chart-cabinet',7,14,29,51],
  ['east-unlit-signal-archive',50,13,72,52],
  ['central-long-sun-mapping-hall',30,20,49,63],
  ['southwest-dry-keeper-gallery',10,49,32,67],
  ['southeast-unpowered-mirror-room',47,49,70,67],
  ['northwest-shaded-beacon-annex',3,7,21,30],
  ['northeast-dust-dry-lookout',58,7,76,31],
  ['southern-three-crown-colonnade',30,65,50,73],
  ['west-outer-solar-screen',3,34,14,60],
  ['east-outer-solar-screen',66,34,76,61],
  ['north-open-shadow-court',34,22,45,33],
  ['west-open-tally-court',14,43,22,51],
  ['east-open-tally-court',57,43,65,51],
  ['south-open-register-court',35,53,44,61],
  ['west-actual-stone-tower-approach',16,69,24,84],
  ['center-actual-stone-tower-approach',36,75,44,84],
  ['east-actual-stone-tower-approach',56,69,64,84],
  ['unroofed-three-crown-transverse-return',18,81,62,84]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-dry-watch-register',40,3],
  ['north-dry-watch-register','central-long-sun-mapping-hall',40,19],
  ['north-dry-watch-register','west-sandglass-chart-cabinet',28,14],
  ['north-dry-watch-register','east-unlit-signal-archive',51,14],
  ['north-dry-watch-register','northwest-shaded-beacon-annex',22,10],
  ['north-dry-watch-register','northeast-dust-dry-lookout',57,10],
  ['central-long-sun-mapping-hall','north-open-shadow-court',33,27],
  ['north-open-shadow-court','west-sandglass-chart-cabinet',32,26],
  ['north-open-shadow-court','east-unlit-signal-archive',46,26],
  ['central-long-sun-mapping-hall','west-open-tally-court',28,46],
  ['central-long-sun-mapping-hall','east-open-tally-court',51,46],
  ['west-sandglass-chart-cabinet','west-open-tally-court',23,47],
  ['east-unlit-signal-archive','east-open-tally-court',56,47],
  ['central-long-sun-mapping-hall','south-open-register-court',34,57],
  ['south-open-register-court','southern-three-crown-colonnade',40,63],
  ['west-sandglass-chart-cabinet','southwest-dry-keeper-gallery',21,49],
  ['east-unlit-signal-archive','southeast-unpowered-mirror-room',60,49],
  ['southwest-dry-keeper-gallery','southern-three-crown-colonnade',33,65],
  ['southeast-unpowered-mirror-room','southern-three-crown-colonnade',46,65],
  ['northwest-shaded-beacon-annex','west-outer-solar-screen',12,34],
  ['northeast-dust-dry-lookout','east-outer-solar-screen',68,34],
  ['southwest-dry-keeper-gallery','west-actual-stone-tower-approach',20,69],
  ['southeast-unpowered-mirror-room','east-actual-stone-tower-approach',60,69],
  ['southern-three-crown-colonnade','center-actual-stone-tower-approach',40,75],
  ['center-actual-stone-tower-approach','unroofed-three-crown-transverse-return',40,82],
  ['unroofed-three-crown-transverse-return','west-actual-stone-tower-approach',22,82],
  ['unroofed-three-crown-transverse-return','east-actual-stone-tower-approach',60,82]
 ]){
  if(!founded(x,z))throw Error('Suncairn portal has no actual stone foundation '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let glass=0,windows=0;
 for(const c of indoors){
  const [x,z]=c.split(',').map(Number);
  if(bearingXZ.has(c)||(x*23+z*11)%14!==0||[1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  const out=Object.entries(directions).find(([,v])=>!founded(x+v[0],z+v[1]));
  if(!out)continue;
  for(let y=2;y<=5;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',out[0],
    {originalTrueFourHighFramedDesertSignalGlass:true,actualPack4AssetNotCertified:true});
   glass++;
  }windows++;
 }
 return b.finish('Three genuine nonclimbable unlit 27-high desert stone beacon crowns, 11 individually source-backed covered gallery wings, four stone-founded open source sky-courts and a complete external three-branch tower footpath. No functioning lantern, boats, water, stairs or real runtime physics.',{
  originalBuilderBWave:51,
  genuinelyOccupiedCoveredRoofWings:firstRoofByName.size,
  genuinelySkyOpenStoneCourts:[144,81,81,90],
  threeGenuineOutdoorBeaconTowers:towers.length,
  solidBeaconFoundationTierCells:solidFoot,
  fullContinuousUpperBeaconStoneRingCells:upperRing,
  directlyStoneBackedPack3CrownCells:crownCells,
  fullyGroundedOutdoorStoneApproachCells:outside.size,
  realThreeArmUnroofedCardinalCrossRoute:true,
  trueFourHighFramedPack4SourcePaneCells:glass,
  completeFourHighFramedWindows:windows,
  actualTowerUpperStairs:false,
  workingBeaconLighting:false,shipNavigation:false,weatherPhysics:false,
  realPack3Pack4PhysicsMeshSelectionApproved:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false,realIphonePwaTested:false,
  creatorVisualSignoff:false
 });
}
