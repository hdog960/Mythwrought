// MYTHWROUGHT Builder B Wave55 — Alderwake Triple Dry-Slip Fishing Lodge.
// B115-exclusive r1:fishing-lodge:temperate:large:003. Original-only
// waterfront-styled structure with 12 separately occupied supported roof
// wings, 5 truly open source sky courts, THREE independent stone-founded
// 7x11 dry landing-slip pens with two-high solid timber guardrail perimeters
// and actual 2-cell two-high north/south gates, three 3x3 raised STONE
// dry sorting tables with empty centers, and connected open-air walk lanes.
// NO actual sea, boats, fish spawning, swimming, real water, catch AI,
// installed Pack3/Pack4 collider, settlements, game register or save writes.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ALDERWAKE_TRIPLE_DRY_SLIP_ID='r1:fishing-lodge:temperate:large:003';
export function buildAlderwakeTripleDrySlipFishingLodge(){
 const b=sourcePlan('fishing-lodge','temperate','large',3,
  'Alderwake Triple Dry-Slip Fishing Lodge',86,38,100);
 const wings=[
  ['northern-siltwatch-receiving',27,3,59,18,16,'pack3:026'],
  ['western-dry-nets-and-twine',6,13,35,59,16,'pack3:025'],
  ['eastern-unflooded-chart-hall',52,13,81,59,19,'pack3:023'],
  ['central-seven-beam-dry-market',32,19,54,71,24,'pack3:026'],
  ['southwest-reedwork-gallery',9,53,37,76,17,'pack3:025'],
  ['southeast-cold-net-ledger',50,53,77,76,20,'pack3:023'],
  ['northwest-mooring-register',3,7,25,38,15,'pack3:026'],
  ['northeast-inert-signal-desk',63,7,84,38,18,'pack3:025'],
  ['southern-dry-wharf-breezeway',32,70,55,80,21,'pack3:023'],
  ['western-stone-catch-outpost',3,39,18,72,16,'pack3:026'],
  ['eastern-empty-oyster-room',71,39,84,72,20,'pack3:025'],
  ['central-reed-lantern-porch',30,78,56,82,19,'pack3:023']
 ],courts=[
  ['north-genuine-open-sky-tidewell',37,26,49,37],
  ['west-open-netyard',17,47,26,56],
  ['east-open-netyard',61,47,70,56],
  ['south-clear-reed-yard',37,60,48,69],
  ['southwest-open-pier-lightwell',24,60,30,67]
 ],slips=[
  ['western-true-dry-landing-slip',13,84,'west-open-dry-pier'],
  ['central-true-dry-landing-slip',40,84,'center-open-dry-pier'],
  ['eastern-true-dry-landing-slip',67,84,'east-open-dry-pier']
 ],key=(x,z)=>x+','+z,indoor=new Set(),court=new Set(),
 exterior=new Set(),roofMap=new Map(),firstRoof=new Map(),bearers=new Set(),
 guardRail=new Set(),rackFootprints=new Set(),facing={
  north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]
 };
 for(const [,x0,z0,x1,z1]of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [,x0,z0,x1,z1]of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   court.add(key(x,z));indoor.delete(key(x,z));
  }
 for(const [x0,x1]of [[10,27],[33,54],[60,79]])
  for(let x=x0;x<=x1;x++)for(let z=81;z<=98;z++)
   if(!indoor.has(key(x,z))&&!court.has(key(x,z)))exterior.add(key(x,z));
 for(let x=11;x<=78;x++)for(let z=95;z<=98;z++)
  if(!indoor.has(key(x,z))&&!court.has(key(x,z)))exterior.add(key(x,z));
 const founded=(x,z)=>indoor.has(key(x,z))||court.has(key(x,z))||exterior.has(key(x,z));
 for(const c of new Set([...indoor,...court,...exterior])){
  const [x,z]=c.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {actualAlderwakeOriginalGroundStone:true,realGameSeaUntouched:true});
 }
 for(const c of indoor){
  const [x,z]=c.split(',').map(Number);
  if(Object.values(facing).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=11;y++)b.put(x,y,z,'wall','live:stone','none',
    {actualAlderwakeStoneEnvelope:true,realDampSealUnknown:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset]of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=key(x,z);if(!indoor.has(k)||roofMap.has(k))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(name==='central-seven-beam-dry-market'?3:5));
   roofMap.set(k,{y,name});
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {trueImmediateOriginalPack3RoofBacking:true,livePack3PhysicsUnknown:true});
   b.put(x,y,z,'roof',asset,'north',
    {alderwakeActualDistinctRoofWing:name,pack3InstalledABIPending:true});
   if(!firstRoof.has(name))firstRoof.set(name,[x,z,y]);
  }
 for(const [name]of wings){
  const at=firstRoof.get(name);
  if(!at)throw Error('Entire roof wing is a phantom overlap '+name);
  bearers.add(key(at[0],at[1]));
  b.support(at[0],at[1],at[2]-1,'live:stone',
   'alderwake-actual-full-height-stone-bearing-'+name);
 }
 // Each physical 7x11 dry slip has stone y0 at ALL 77 cells and genuine
 // y1 and y2 opaque wood guardrail cells on 32 perimeter coordinates,
 // except TWO-cell source clear gates on each north and south edge.
 // Each contains an authentic fully stone-founded 3x3 y1 DRY sorting
 // table and eight y2 raised rim stones, with center void y2 genuinely
 // empty and no phantom y1 player passage through the stone.
 let railCells=0,gateCells=0,raisedTableCells=0,raisedRimCells=0;
 for(const [name,x0,z0]of slips){
  const x1=x0+6,z1=z0+10;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const k=key(x,z);
   if(!exterior.has(k)||b.clear(x,0,z))
    throw Error('Dry slip lacks original actual stone ground: '+name+' '+k);
   const perimeter=x===x0||x===x1||z===z0||z===z1;
   const genuineGate=(x===x0+2||x===x0+3)&&(z===z0||z===z1);
   if(perimeter&&!genuineGate){
    guardRail.add(k);
    for(let y=1;y<=2;y++){
     if(!b.clear(x,y,z))throw Error('Genuine slip guardrail overlaps source: '+k);
     b.put(x,y,z,'wall','live:wood','none',
      {alderwakeTrueTwoTierDryPierRail:name,workingDockCollisionUnverified:true});
     railCells++;
    }
   }
  }
  for(const z of [z0,z1])for(const x of [x0+2,x0+3]){
   if(!b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Original north/south dry slip entrance is not truly body+head clear '+name);
   gateCells++;
  }
  for(let x=x0+2;x<=x0+4;x++)for(let z=z0+4;z<=z0+6;z++){
   const k=key(x,z);
   if(!b.clear(x,1,z)||!b.clear(x,2,z)||b.clear(x,0,z))
    throw Error('Raised dry sorting table lacks original solid stone foundation '+k);
   rackFootprints.add(k);
   b.put(x,1,z,'furnishing','live:stone','none',
    {alderwakeOriginalRaisedDryFishSortingTable:name,actuallyFishOrCatch:false});
   raisedTableCells++;
   if(x===x0+2||x===x0+4||z===z0+4||z===z0+6){
    b.put(x,2,z,'furnishing','live:stone','none',
     {alderwakeFullStoneRaisedTableRim:name,liveFishAI:false});
    raisedRimCells++;
   }
  }
  b.room(name,x0+1,z0+1,x1-1,z1-1);
 }
 for(const [axis,fixed,lo,hi,holes]of [
  ['x',31,20,64,[22,23,31,32,40,41,49,50,58,59,62,63]],
  ['x',55,20,64,[22,23,31,32,40,41,49,50,58,59,62,63]],
  ['z',21,24,61,[28,29,37,38,46,47,55,56]],
  ['z',67,14,75,[18,19,31,32,44,45,54,55,66,67]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n,k=key(x,z);
  if(!indoor.has(k)||bearers.has(k)||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {actualOriginalDryHarborPartitions:true,workingFishStorage:false});
 }
 for(const room of [
  ['northern-siltwatch-receiving',28,4,58,17],
  ['western-dry-nets-and-twine',7,14,34,58],
  ['eastern-unflooded-chart-hall',53,14,80,58],
  ['central-seven-beam-dry-market',33,20,53,70],
  ['southwest-reedwork-gallery',10,54,36,75],
  ['southeast-cold-net-ledger',51,54,76,75],
  ['northwest-mooring-register',4,8,24,37],
  ['northeast-inert-signal-desk',64,8,83,37],
  ['southern-dry-wharf-breezeway',33,71,54,79],
  ['western-stone-catch-outpost',4,40,17,71],
  ['eastern-empty-oyster-room',72,40,83,71],
  ['central-reed-lantern-porch',31,79,55,81],
  ['north-genuine-open-sky-tidewell',37,26,49,37],
  ['west-open-netyard',17,47,26,56],
  ['east-open-netyard',61,47,70,56],
  ['south-clear-reed-yard',37,60,48,69],
  ['southwest-open-pier-lightwell',24,60,30,67],
  ['west-open-dry-pier',10,81,27,98],
  ['center-open-dry-pier',33,83,54,98],
  ['east-open-dry-pier',60,81,79,98],
  ['genuine-unroofed-transverse',11,95,78,98]
 ])b.room(...room);
 // Literal room graph portals are cut AFTER original roof post and slip
 // rail/table admission, with exact footprint and two-high ground guard.
 for(const [from,to,x,z]of [
  ['outside','northern-siltwatch-receiving',43,3],
  ['northern-siltwatch-receiving','central-seven-beam-dry-market',43,19],
  ['northern-siltwatch-receiving','western-dry-nets-and-twine',31,14],
  ['northern-siltwatch-receiving','eastern-unflooded-chart-hall',55,14],
  ['northern-siltwatch-receiving','northwest-mooring-register',25,11],
  ['northern-siltwatch-receiving','northeast-inert-signal-desk',63,11],
  ['central-seven-beam-dry-market','north-genuine-open-sky-tidewell',36,31],
  ['north-genuine-open-sky-tidewell','western-dry-nets-and-twine',35,32],
  ['north-genuine-open-sky-tidewell','eastern-unflooded-chart-hall',50,32],
  ['central-seven-beam-dry-market','west-open-netyard',31,51],
  ['central-seven-beam-dry-market','east-open-netyard',55,51],
  ['western-dry-nets-and-twine','west-open-netyard',27,49],
  ['eastern-unflooded-chart-hall','east-open-netyard',60,49],
  ['central-seven-beam-dry-market','south-clear-reed-yard',36,64],
  ['south-clear-reed-yard','southern-dry-wharf-breezeway',43,70],
  ['western-dry-nets-and-twine','southwest-reedwork-gallery',29,54],
  ['eastern-unflooded-chart-hall','southeast-cold-net-ledger',67,54],
  ['southwest-reedwork-gallery','southern-dry-wharf-breezeway',36,73],
  ['southeast-cold-net-ledger','southern-dry-wharf-breezeway',50,73],
  ['northwest-mooring-register','western-stone-catch-outpost',11,39],
  ['northeast-inert-signal-desk','eastern-empty-oyster-room',76,39],
  ['western-dry-nets-and-twine','southwest-open-pier-lightwell',23,63],
  ['southwest-open-pier-lightwell','southwest-reedwork-gallery',31,65],
  ['southwest-reedwork-gallery','west-open-dry-pier',21,81],
  ['southeast-cold-net-ledger','east-open-dry-pier',70,81],
  ['southern-dry-wharf-breezeway','central-reed-lantern-porch',43,79],
  ['central-reed-lantern-porch','center-open-dry-pier',43,83],
  ['west-open-dry-pier','genuine-unroofed-transverse',21,97],
  ['center-open-dry-pier','genuine-unroofed-transverse',43,97],
  ['east-open-dry-pier','genuine-unroofed-transverse',70,97]
 ]){
  const k=key(x,z);
  if(!founded(x,z)||guardRail.has(k)||rackFootprints.has(k)||bearers.has(k))
   throw Error('Authentic source hall portal is unfounded, cut post, fence or rack '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Each dry slip is entered by two genuine two-high front openings.
 // The 4 entrance points per slip remain walkable without b.opening()
 // cutting a physical rail because they were reserved before any wood.
 for(const [name,x0,z0,outer]of slips){
  for(const z of [z0,z0+10]){
   const x=x0+2,k=key(x,z);
   if(!founded(x,z)||guardRail.has(k)||rackFootprints.has(k)||
      !b.clear(x,1,z)||!b.clear(x,2,z))
    throw Error('Real northern/southern source slip gate obstructed '+name+' '+k);
   b.portal(outer,name,x,z);
  }
 }
 let glassCells=0,framedBays=0;
 for(const cell of indoor){
  const [x,z]=cell.split(',').map(Number);
  if(bearers.has(cell)||(x*17+z*11)%14!==0||
     [1,2,3,4,5,6,7,8].some(y=>b.clear(x,y,z)))continue;
  const outward=Object.entries(facing).find(([,d])=>!founded(x+d[0],z+d[1]));
  if(!outward)continue;
  for(let y=2;y<=6;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',outward[0],
    {alderwakeRealFiveHighStoneFramedCandidatePane:true,realPack4TransparencyAndColliderUnapproved:true});
   glassCells++;
  }framedBays++;
 }
 return b.finish('A temperate stone waterfront-style lodge with 12 genuinely source-backed covered roof masses, 5 sky-open founded stone courtyards, three stone-founded 7x11 DRY landing slips with two clear northern/southern two-high timber gates each, three physically raised 3x3 dry stone sorting tables and a three-way outdoor cardinal walk. No water, boats, fish, inventory or actual installed Pack collision.',{
  originalBuilderBWave:55,
  trulyOccupiedSourceRoofWings:firstRoof.size,
  foundedFullySkyOpenCourtSizes:[156,100,100,120,56],
  originalDryLandingSlips:slips.length,
  sourceTwoTierWoodenPierRailCells:railCells,
  originalTwoHighOpenDrySlipGateCells:gateCells,
  originalGenuinelySolidDryRaisedSortingTableCells:raisedTableCells,
  sourceRaisedDrySortingTableRimCells:raisedRimCells,
  trulyStoneFoundedOpenAirWalkCells:exterior.size,
  originalSourceThreeArmUnroofedCrosswalk:true,
  originalFiveHighFramedPack4CandidateGlassCells:glassCells,
  originalCompleteFiveHighFramedBays:framedBays,
  activeBoatOrWater:false,realFishing:false,realLiveFish:false,
  workingCatchInventory:false,Pack3Pack4PhysicsSelectionApproved:false,
  genuineEnginePlayerCollisionTested:false,productionRegistered:false,
  worldPlacement:false,saveSchema1Written:false,
  actualIphoneHomeScreenPwaTested:false,creatorArtApproved:false
 });
}
