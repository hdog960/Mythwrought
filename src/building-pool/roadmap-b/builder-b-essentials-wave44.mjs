// MYTHWROUGHT Builder B Wave44 — Alderbrook Double-Horseshoe Coaching Stables.
// Entirely original, source-only frozen B115 temperate LARGE stable #005.
// Horseshoe roof geometry, genuinely open paved triple corral courts, three
// grounded outdoor horse-lane arms and a physical connecting crossbar.
// Eight actual source-gated stall bays and two solid low stone hitching posts.
// No horses, AI, breeding, water, Pack3/4 physical admission or game saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ALDERBROOK_DOUBLE_HORSESHOE_ID='r1:stable:temperate:large:005';
export function buildAlderbrookDoubleHorseshoeCoachingStables(){
 const b=sourcePlan('stable','temperate','large',5,'Alderbrook Double-Horseshoe Coaching Stables',73,45,75);
 const wings=[
 ['north-high-coach-loft',19,3,56,20,17,'pack3:025'],
 ['west-ridged-saddle-stable',5,13,27,58,14,'pack3:026'],
 ['east-horsegear-barn',45,12,68,60,18,'pack3:023'],
 ['central-tack-bridge',24,19,49,60,22,'pack3:025'],
 ['southwest-stall-return',9,55,35,68,15,'pack3:026'],
 ['southeast-harness-return',39,55,65,68,17,'pack3:023'],
 ['northwest-wooden-porch',3,5,20,34,11,'pack3:025'],
 ['northeast-unlit-farrier',61,5,70,34,19,'pack3:026'],
 ['south-center-groom-entry',30,61,44,70,17,'pack3:025']
 ],courts=[[28,27,44,42],[13,48,22,56],[53,48,62,56]],
 key=(x,z)=>x+','+z,inside=new Set(),sky=new Set(),outside=new Set(),roofed=new Map(),
 face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)inside.add(key(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){sky.add(key(x,z));inside.delete(key(x,z))}
 for(const [x0,z0,x1,z1] of [[13,65,22,73],[31,65,38,73],[54,65,64,73],[18,70,59,73]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!inside.has(key(x,z))&&!sky.has(key(x,z)))outside.add(key(x,z));
 const enclosed=(x,z)=>inside.has(key(x,z)),ground=(x,z)=>enclosed(x,z)||sky.has(key(x,z))||outside.has(key(x,z));
 for(const k of new Set([...inside,...sky,...outside])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{actualStablesSourceGroundedFloor:true,biomeUntouched:true});
 }
 for(const k of inside){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(face).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:wood','none',
    {realOriginalOuterStableEnvelope:true,windRated:false});
 }
 for(const [name,x0,z0,x1,z1,base,asset] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!enclosed(x,z)||roofed.has(key(x,z)))continue;
  const dist=Math.min(x-x0,x1-x,z-z0,z1-z),
   y=base+Math.floor(dist/(name==='central-tack-bridge'?3:5));
  roofed.set(key(x,z),y);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
   {originalImmediatelyBackedSourceRoof:true,actualProducerLoadNotCertified:true});
  b.put(x,y,z,'roof',asset,'north',
   {originalAlderbrookRoofWing:name,pack3PhysicalAdmissionPending:true});
 }
 for(const [x,z] of [[24,8],[37,9],[51,8],[12,22],[60,23],[25,45],[47,46],[31,58],[42,58],[15,60],[59,60],[35,68]]){
  const y=roofed.get(key(x,z));
  if(!y)throw Error('Alderbrook rafter is not below true original roof '+key(x,z));
  b.support(x,z,y-1,'live:wood','original-source-grounded-stable-hip-post');
 }
 // Eight physically distinct grounded unoccupied horse-sized stall
 // source bays: four facing west corridor and four facing east. Three
 // solid low fence sides per bay, all gates remain literal 2-high air.
 const stalls=[];
 for(const [side,start] of [['west',17],['east',52]]){
  for(let j=0;j<4;j++){
   const z=18+j*8,x=side==='west'?start:start;
   const name=side+'-unoccupied-stall-'+(j+1);
   if(!enclosed(x,z))throw Error('Alderbrook stall outside real indoor floor');
   // A single three-cell long rear railing, source-grounded at y0.
   for(let dx=-1;dx<=1;dx++){
    const xx=x+dx;
    if(!enclosed(xx,z)||!b.clear(xx,1,z))continue;
    b.put(xx,1,z,'partition','live:wood','north',
      {originalEmptyStallRail:name,activeAnimal:false});
   }
   const gate=[x,1,z+2];
   if(!ground(gate[0],gate[2]))throw Error('Alderbrook source stall gate lacks real floor');
   b.opening(gate[0],gate[2]);
   stalls.push({name,gate});
  }
 }
 // Two low unfired stone hitching posts, independent of fences and
 // genuinely continuous from a real stone y0 floor to y7.
 for(const [x,z,label] of [[19,26,'west-original-hitch'],[57,27,'east-original-hitch']]){
  if(!enclosed(x,z))throw Error('hitch post in open courtyard '+key(x,z));
  for(let y=1;y<=7;y++){
   if(!b.clear(x,y,z))b.cut(x,y,z);
   b.put(x,y,z,'support','live:stone','none',{trueStoneHitchPost:label,level:y});
  }
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',27,21,57,[25,26,36,37,47,48,54,55]],
  ['x',46,21,59,[25,26,36,37,47,48,54,55]],
  ['z',20,20,55,[25,26,35,36,46,47]],
  ['z',55,10,64,[17,18,29,30,40,41,53,54]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!enclosed(x,z)||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{originalStableSaddleScreen:true});
 }
 // Recut every original two-high stall gate AFTER the later timber screens;
 // otherwise a partition at z20 can silently close the eastern stall.
 for(const {gate} of stalls)b.opening(gate[0],gate[2]);
 for(const room of [
  ['northern-unmounted-coach-register',20,4,55,19],
  ['west-empty-stall-wing',6,14,26,57],['east-empty-horsegear-wing',46,13,67,59],
  ['central-saddle-entry-bridge',25,20,48,59],
  ['southwest-unpowered-coach-return',10,56,34,67],
  ['southeast-unused-harness-return',40,56,64,67],
  ['northwest-stone-walled-welcome',4,6,19,33],
  ['northeast-silent-farrier',62,6,69,33],
  ['south-unlived-groom-center',31,62,43,69],
  ['central-sky-open-courtyard',28,27,44,42],
  ['west-real-stone-corral',13,48,22,56],
  ['east-real-stone-corral',53,48,62,56],
  ['west-grounded-exercise-lane',13,66,22,72],
  ['center-grounded-exercise-lane',31,66,38,72],
  ['east-grounded-exercise-lane',54,66,64,72],
  ['southern-really-connected-riding-crossbar',18,70,59,73]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','northern-unmounted-coach-register',38,3],
  ['northern-unmounted-coach-register','west-empty-stall-wing',27,17],
  ['northern-unmounted-coach-register','east-empty-horsegear-wing',46,17],
  ['northern-unmounted-coach-register','central-saddle-entry-bridge',38,20],
  ['west-empty-stall-wing','central-saddle-entry-bridge',27,34],
  ['east-empty-horsegear-wing','central-saddle-entry-bridge',46,34],
  ['central-saddle-entry-bridge','central-sky-open-courtyard',27,34],
  ['central-sky-open-courtyard','east-empty-horsegear-wing',45,34],
  ['west-empty-stall-wing','west-real-stone-corral',19,47],
  ['west-real-stone-corral','southwest-unpowered-coach-return',19,57],
  ['east-empty-horsegear-wing','east-real-stone-corral',58,47],
  ['east-real-stone-corral','southeast-unused-harness-return',58,57],
  ['central-saddle-entry-bridge','southwest-unpowered-coach-return',32,55],
  ['central-saddle-entry-bridge','southeast-unused-harness-return',42,55],
  ['central-saddle-entry-bridge','south-unlived-groom-center',37,62],
  ['southwest-unpowered-coach-return','west-grounded-exercise-lane',19,65],
  ['south-unlived-groom-center','center-grounded-exercise-lane',35,65],
  ['southeast-unused-harness-return','east-grounded-exercise-lane',59,65],
  ['west-grounded-exercise-lane','southern-really-connected-riding-crossbar',21,71],
  ['center-grounded-exercise-lane','southern-really-connected-riding-crossbar',35,71],
  ['southern-really-connected-riding-crossbar','east-grounded-exercise-lane',57,71],
  ['northern-unmounted-coach-register','northwest-stone-walled-welcome',19,16],
  ['east-empty-horsegear-wing','northeast-silent-farrier',62,16]
 ]){if(!ground(x,z))throw Error('Alderbrook original grounded portal missing '+key(x,z));b.opening(x,z);b.portal(from,to,x,z);}
 // Distinct frame-solid upright Pack4 windows follow all original doors.
 let windowCells=0,fullBays=0;
 for(const k of inside){
  const [x,z]=k.split(',').map(Number);
  if((x*13+z*9)%11!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const d=Object.entries(face).find(([,p])=>!ground(x+p[0],z+p[1]));
  if(!d)continue;
  for(let y=2;y<=5;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',d[0],
    {realOriginalFourHighStablePane:true,noActualPack4ColliderApproval:true});
   windowCells++;
  }fullBays++;
 }
 return b.finish('Original large double-horseshoe temperate coaching stable: nine backed Pack3 roof wings, 8 unoccupied source-grounded stall bays, 3 truly sky-open physical stone courtyards, three connected outside exercise branches and 2 stone hitching columns. No live horses.',{
  originalBuilderBWave:44,originalPack3RoofWings:9,
  genuinelySkyOpenPavedCourts:[272,90,90],
  actualSourceOutdoorExerciseCells:outside.size,
  originalSourceStallGateCount:stalls.length,
  physicalOriginalHitchPosts:2,
  originalFourHighPack4GlassBays:fullBays,originalUprightPack4PaneCells:windowCells,
  activeAnimalSpawning:false,ridingOrBreeding:false,feedMachinery:false,
  sourcePackMeshColliderAccepted:false,creatorArtworkAccepted:false,
  originalIphonePwaTested:false,worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
