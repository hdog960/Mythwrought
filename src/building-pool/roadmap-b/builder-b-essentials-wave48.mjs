// MYTHWROUGHT Builder B Wave48: Frostmerefold Four-Court Winter Conservatory.
// Frozen exclusive B115 snow LARGE greenhouse #004. The N-S folded-spine
// winter hall supports eleven independent candidate Pack3 roof regions,
// four true no-canopy y1-accessible foundation courts and a three-leg outdoor
// return. Tall Pack4 glazing is physically framed in original stone walls.
// No actual crop growth, climate/heat/power, snowproof Pack producer ABI,
// active settlements, world save writes or live-player acceptance.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const FROSTMEREFOLD_FOUR_COURT_ID='r1:greenhouse:snow:large:004';
export function buildFrostmerefoldFourCourtWinterConservatory(){
 const b=sourcePlan('greenhouse','snow','large',4,'Frostmerefold Four-Court Winter Conservatory',68,36,78);
 const wings=[
  ['north-windbreak-foyer',21,3,47,15,19,'pack3:026'],
  ['west-thermal-stone-archive',5,10,26,44,17,'pack3:025'],
  ['east-reed-freeze-herbarium',42,9,63,43,20,'pack3:023'],
  ['central-frost-folded-gallery',26,12,43,55,25,'pack3:026'],
  ['southwest-seed-ledger',7,40,29,62,18,'pack3:025'],
  ['southeast-silent-botanical-house',38,40,61,63,21,'pack3:023'],
  ['northwest-snowwood-outrigger',3,5,22,30,15,'pack3:026'],
  ['northeast-froststone-drying',48,5,64,31,17,'pack3:025'],
  ['south-transverse-cloister',23,61,45,70,20,'pack3:023'],
  ['west-intermediate-propagation',2,31,12,57,16,'pack3:026'],
  ['east-intermediate-specimen',57,31,66,56,18,'pack3:025']
 ],courts=[
  ['north-recessed-sky-court',29,20,38,31],
  ['west-open-rest-court',12,46,20,55],
  ['east-open-rest-court',47,46,55,55],
  ['southlight-unroofed-court',28,50,39,57]
 ],
 key=(x,z)=>x+','+z,indoor=new Set(),courtyard=new Set(),exterior=new Set(),roofLevel=new Map(),
 faces={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]},
 plinthGround=new Set(['17,17','51,17','16,57','52,57']);
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  indoor.add(key(x,z));
 for(const [,x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   courtyard.add(key(x,z));indoor.delete(key(x,z));
  }
 for(const [x0,x1] of [[12,20],[28,39],[48,56]])
  for(let x=x0;x<=x1;x++)for(let z=60;z<=76;z++)
   if(!indoor.has(key(x,z))&&!courtyard.has(key(x,z)))exterior.add(key(x,z));
 for(let x=16;x<=53;x++)for(let z=72;z<=76;z++)
  if(!indoor.has(key(x,z))&&!courtyard.has(key(x,z)))exterior.add(key(x,z));
 const grounded=(x,z)=>indoor.has(key(x,z))||courtyard.has(key(x,z))||exterior.has(key(x,z));
 for(const k of new Set([...indoor,...courtyard,...exterior])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation',exterior.has(k)||courtyard.has(k)||plinthGround.has(k)?'live:stone':'live:wood','none',
   {sourceRealSolidWinterFloor:true,weatherPhysicsUnverified:true});
 }
 for(const k of indoor){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(faces).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=10;y++)b.put(x,y,z,'wall','live:stone','none',
    {originalFrostmerefoldBearingEnvelope:true,actualInsulation:false});
 }
 for(const [title,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!indoor.has(key(x,z))||roofLevel.has(key(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),
    y=base+Math.floor(d/(title==='central-frost-folded-gallery'?3:5));
   roofLevel.set(key(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {realSourceImmediatePack3Backing:true,weatherSupportNotApproved:true});
   b.put(x,y,z,'roof',asset,'north',
    {frostmerefoldElevenDistinctRoofWing:title,physicalPack3EnvelopeUnknown:true});
  }
 // A sparse, genuinely grounded set of stone-to-roof posts, rather than
 // inventing full-load proof for all candidate Pack3 roof geometry.
 for(const [x,z] of [[28,8],[38,8],[9,18],[59,20],[29,36],
   [16,42],[53,42],[18,59],[49,59],[33,66],[26,13],[40,15]]){
  const y=roofLevel.get(key(x,z));
  if(!y)throw Error('Frostmerefold true roof pier absent at '+key(x,z));
  b.support(x,z,y-1,'live:stone','true-ground-to-original-snow-roof-pier');
 }
 // Four dry original bench-like stone specimen plinths remain unpowered and
 // separate from open courts and route endpoints, with real y0 stone floor.
 const dryPlinths=[[17,17],[51,17],[16,57],[52,57]];
 for(const [x,z] of dryPlinths){
  if(!indoor.has(key(x,z)))throw Error('Frostmerefold dry specimen plinth ungrounded');
  if(!b.clear(x,1,z))throw Error('Frostmerefold original dry plinth collides');
  b.put(x,1,z,'furnishing','live:stone','north',
   {dryOriginalSeedPlinth:true,seedGrowth:false,power:false});
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',25,17,51,[20,21,29,30,38,39,46,47]],
  ['x',44,17,53,[22,23,31,32,40,41,49,50]],
  ['z',34,18,55,[22,23,31,32,43,44,51,52]],
  ['z',56,10,61,[15,16,27,28,36,37,48,49]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!indoor.has(key(x,z))||holes.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalDrySnowPropagationDivider:true,operatingGreenhouse:false});
 }
 for(const row of [
  ['north-snow-entry-foyer',22,4,46,14],
  ['west-frozen-ledger-vault',6,11,25,43],
  ['east-dry-specimen-library',43,10,62,42],
  ['central-folded-sun-gallery',27,13,42,54],
  ['southwest-frozen-seed-rest',8,41,28,61],
  ['southeast-glass-dry-frames',39,41,60,62],
  ['northwest-wood-glass-airlock',4,6,21,29],
  ['northeast-froststone-entry',49,6,63,30],
  ['south-transverse-winter-hall',24,62,44,69],
  ['west-propagation-aisle',11,33,19,55],
  ['east-seed-specimen-aisle',48,31,58,54],
  ['north-recessed-sky-court',29,20,38,31],
  ['west-open-rest-court',12,46,20,55],
  ['east-open-rest-court',47,46,55,55],
  ['southlight-unroofed-court',28,50,39,57],
  ['west-actual-exterior-snow-return',12,61,20,76],
  ['center-actual-exterior-snow-return',28,61,39,76],
  ['east-actual-exterior-snow-return',48,61,56,76],
  ['outer-solid-stone-crosspass',16,72,53,76]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-snow-entry-foyer',34,3],
  ['north-snow-entry-foyer','central-folded-sun-gallery',34,15],
  ['north-snow-entry-foyer','west-frozen-ledger-vault',25,13],
  ['north-snow-entry-foyer','east-dry-specimen-library',44,13],
  ['north-snow-entry-foyer','northwest-wood-glass-airlock',21,11],
  ['north-snow-entry-foyer','northeast-froststone-entry',48,11],
  ['central-folded-sun-gallery','north-recessed-sky-court',28,25],
  ['north-recessed-sky-court','west-frozen-ledger-vault',27,22],
  ['north-recessed-sky-court','east-dry-specimen-library',41,22],
  ['central-folded-sun-gallery','west-propagation-aisle',26,37],
  ['central-folded-sun-gallery','east-seed-specimen-aisle',43,37],
  ['west-frozen-ledger-vault','west-open-rest-court',15,45],
  ['east-dry-specimen-library','east-open-rest-court',51,45],
  ['west-propagation-aisle','southwest-frozen-seed-rest',20,46],
  ['east-seed-specimen-aisle','southeast-glass-dry-frames',47,46],
  ['central-folded-sun-gallery','southlight-unroofed-court',34,50],
  ['southwest-frozen-seed-rest','south-transverse-winter-hall',26,61],
  ['southeast-glass-dry-frames','south-transverse-winter-hall',42,61],
  ['central-folded-sun-gallery','south-transverse-winter-hall',34,61],
  ['south-transverse-winter-hall','center-actual-exterior-snow-return',34,70],
  ['southwest-frozen-seed-rest','west-actual-exterior-snow-return',16,61],
  ['southeast-glass-dry-frames','east-actual-exterior-snow-return',52,62],
  ['center-actual-exterior-snow-return','outer-solid-stone-crosspass',34,74],
  ['outer-solid-stone-crosspass','west-actual-exterior-snow-return',18,74],
  ['outer-solid-stone-crosspass','east-actual-exterior-snow-return',50,74]
 ]){
  if(!grounded(x,z))throw Error('Frostmerefold false grounded passage '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let glass=0,bays=0;
 for(const k of indoor){
  const [x,z]=k.split(',').map(Number);
  if((x*13+z*7)%11!==0||[1,2,3,4,5,6,7,8].some(y=>b.clear(x,y,z)))continue;
  const out=Object.entries(faces).find(([,d])=>!grounded(x+d[0],z+d[1]));
  if(!out)continue;
  for(let y=2;y<=6;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',out[0],
    {realFiveHighFramedWinterSourceGlazing:true,pack4SelectionColliderUnresolved:true});
   glass++;
  }bays++;
 }
 return b.finish('Eleven separately backed snow roof wings, four fully uncovered physically founded courtyards, four deliberately inert dry specimen plinths, five-high outward framed glazing, and three uninterrupted original grounded open-sky winter routes linked by an external stone crosspass. Source only; weather and live glass physical admission pending.',{
  originalBuilderBWave:48,originalSourceRoofWingCount:11,
  fourTrulyOpenStoneCourts:[120,90,90,96],
  actualSourceOutdoorUnroofedReturnCells:exterior.size,
  threeIndependentExteriorArms:true,originalFullHeightPlinthCount:dryPlinths.length,
  originalFiveHighWindowCells:glass,completeFiveHighFramedGlassBays:bays,
  realSnowGlassWeatherSealing:false,realHeating:false,liveCrops:false,waterPumps:false,
  actualPack3Pack4PhysicalApproval:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false,
  installedHomeScreenIphonePwaTested:false,creatorArtworkAccepted:false
 });
}
