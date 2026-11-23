// MYTHWROUGHT Builder B Wave46 — Cattailreach Three-Finger Dry Fishing Lodge.
// Frozen B115-only ID r1:fishing-lodge:temperate:small:003; entirely source-owned physical blueprint.
// Unpowered, dry, non-world-placed: no fishing/water, live Pack3/4 physical
// mesh/collider acceptance, settlement placement, saves, or iPhone approval.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const CATTAILREACH_THREE_FINGER_ID='r1:fishing-lodge:temperate:small:003';
export function buildCattailreachThreeFingerFishingLodge(){
 const b=sourcePlan('fishing-lodge','temperate','small',3,
  'Cattailreach Three-Finger Dry Fishing Lodge',43,25,50);
 const wings=[
  ['north-entry-porch',13,2,30,10,12,'pack3:025'],
  ['west-reed-bait-hall',3,5,19,20,11,'pack3:026'],
  ['east-dry-net-gallery',25,4,40,20,15,'pack3:023'],
  ['central-weighing-house',14,8,30,27,17,'pack3:025'],
  ['southwest-unlit-smoke-shed',5,22,20,34,12,'pack3:026'],
  ['southeast-crate-and-rope-hall',23,22,39,35,15,'pack3:023'],
  ['south-reed-drying-gallery',13,31,30,40,14,'pack3:025']
 ],courts=[[17,13,24,20],[8,28,13,33],[31,29,36,34]],
   pierBands=[[6,10],[19,23],[34,38]],
   key=(x,z)=>x+','+z,indoor=new Set(),court=new Set(),dryPiers=new Set(),roofs=new Map(),
   faces={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){court.add(key(x,z));indoor.delete(key(x,z))}
 for(const [x0,x1] of pierBands)
  for(let x=x0;x<=x1;x++)for(let z=39;z<=48;z++)
   if(!indoor.has(key(x,z))&&!court.has(key(x,z)))dryPiers.add(key(x,z));
 for(let x=6;x<=38;x++)for(let z=46;z<=48;z++)
  if(!indoor.has(key(x,z))&&!court.has(key(x,z)))dryPiers.add(key(x,z));
 const ground=(x,z)=>indoor.has(key(x,z))||court.has(key(x,z))||dryPiers.has(key(x,z));
 const allGround=new Set([...indoor,...court,...dryPiers]);
 for(const k of allGround){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation',dryPiers.has(k)?'live:wood':'live:stone','none',
   {sourceActualGroundedWalking:true,workingFishery:false,seaTerrainUnchanged:true});
 }
 for(const k of indoor){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(faces).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {actualSourceOuterReedWall:true,weatherApproval:false});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!indoor.has(key(x,z))||roofs.has(key(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(d/(name==='central-weighing-house'?3:4));
   roofs.set(key(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {genuineImmediateUnderRoofSourceBacking:true,pack3LiveMeshUnverified:true});
   b.put(x,y,z,'roof',asset,'north',
    {cattailreachIndividualRoofWing:name,noPhysicalPack3Approval:true});
  }
 for(const [x,z] of [[17,6],[34,9],[8,15],[37,16],[15,25],[34,25],[17,35],[27,36]]){
  const y=roofs.get(key(x,z));
  if(!y)throw Error('Cattailreach false ground-roof pier '+key(x,z));
  b.support(x,z,y-1,'live:wood','original-true-reed-lodge-roof-column');
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',14,10,30,[12,13,18,19,24,25,28,29]],
  ['x',29,10,34,[14,15,23,24,29,30]],
  ['z',22,9,36,[12,13,18,19,26,27,32,33]],
  ['z',34,12,31,[17,18,22,23,27,28]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!indoor.has(key(x,z))||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood','none',
   {sourceOnlyFishingWorkDivider:true,liveProduction:false});
 }
 // Distinct source-grounded timber mooring guides on the lateral edges.
 for(const [x,z] of [[6,44],[10,44],[19,43],[23,43],[34,44],[38,44]]){
  if(!dryPiers.has(key(x,z)))throw Error('ungrounded dry-jetty marker');
  for(let y=1;y<=5;y++)b.put(x,y,z,'support','live:wood','none',
   {physicalDryMooringPost:true,sourceTier:y,noDockingLogic:true});
 }
 for(const row of [
  ['north-reed-entry',14,3,29,9],
  ['west-bait-hall',4,6,18,19],
  ['east-net-gallery',26,5,39,19],
  ['central-weighing-hall',15,9,29,26],
  ['unlit-west-smoke-house',6,23,19,33],
  ['southeast-dry-crate-room',24,23,38,34],
  ['south-hanging-gallery',14,32,29,39],
  ['middle-sky-fish-sorting-court',17,13,24,20],
  ['west-sky-reed-rest',8,28,13,33],
  ['east-sky-reed-rest',31,29,36,34],
  ['west-actual-dry-jetty',6,40,10,48],
  ['center-actual-dry-jetty',19,40,23,48],
  ['east-actual-dry-jetty',34,40,38,48],
  ['actual-outdoor-transverse-timber-return',11,46,33,48]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-reed-entry',21,3],
  ['north-reed-entry','central-weighing-hall',21,10],
  ['central-weighing-hall','west-bait-hall',14,12],
  ['central-weighing-hall','east-net-gallery',29,14],
  ['central-weighing-hall','middle-sky-fish-sorting-court',17,16],
  ['middle-sky-fish-sorting-court','west-bait-hall',17,13],
  ['west-bait-hall','unlit-west-smoke-house',13,22],
  ['east-net-gallery','southeast-dry-crate-room',34,22],
  ['unlit-west-smoke-house','west-sky-reed-rest',12,28],
  ['southeast-dry-crate-room','east-sky-reed-rest',34,29],
  ['unlit-west-smoke-house','south-hanging-gallery',18,33],
  ['southeast-dry-crate-room','south-hanging-gallery',27,34],
  ['south-hanging-gallery','center-actual-dry-jetty',21,40],
  ['center-actual-dry-jetty','actual-outdoor-transverse-timber-return',21,47],
  ['actual-outdoor-transverse-timber-return','west-actual-dry-jetty',8,47],
  ['actual-outdoor-transverse-timber-return','east-actual-dry-jetty',36,47]
 ]){
  if(!ground(x,z))throw Error('Cattailreach portal missing real ground '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let panes=0,bays=0;
 for(const k of indoor){
  const [x,z]=k.split(',').map(Number);
  if((x*7+z*11)%9!==0||![1,2,3,4,5,6].every(y=>!b.clear(x,y,z)))continue;
  const facing=Object.entries(faces).find(([,dir])=>!ground(x+dir[0],z+dir[1]));
  if(!facing)continue;
  for(let y=2;y<=4;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',facing[0],
    {genuineThreeHighReedLodgePane:true,glassSourcePhysicalPending:true});
   panes++;
  }bays++;
 }
 return b.finish('Original split-tide fishing lodge: seven backed independent roof wings, three truly unroofed paved courts, actual three dry wooden fingers linked by full transverse exterior return, six grounded mooring posts, and upright physically framed candidate glazing. No water, fishing, NPC AI, world placement or producer approval.',{
  originalBuilderBWave:46,
  genuineCattailreachRoofWings:7,
  trueOpenSourceCourts:[64,36,36],
  actualGroundedDryJettyBands:3,
  realSourceDryJettyCells:dryPiers.size,
  originalRealDryMooringPosts:6,
  genuineThreeHighPack4PaneCells:panes,
  genuineCompleteThreeHighFramedBays:bays,
  workingFishing:false,workingSmokehouse:false,waterGenerated:false,
  physicalPack3Pack4ProducerApproved:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false,
  creatorVisualApproved:false,installedIphonePwaTested:false
 });
}
