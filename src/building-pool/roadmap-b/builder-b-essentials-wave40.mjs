// MYTHWROUGHT Builder B Wave40 — Moonfern Triskelion Arboretum.
// Original enchanted-forest SMALL greenhouse. Three separate true sky-open
// court faces around radial roof wings, a paved triple-spoke outer loop,
// supported Pack3 candidates and four-high outward Pack4 glass. Detached
// B115 source ONLY. No flora AI, magic power, planting, saves or settlement.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const MOONFERN_TRISKELION_ID='r1:greenhouse:enchanted-forest:small:003';
export function buildMoonfernTriskelionArboretum(){
 const b=sourcePlan('greenhouse','enchanted-forest','small',3,'Moonfern Triskelion Arboretum',55,39,57);
 const wings=[
 ['north-arc-entrance',14,3,42,15,13,'pack3:025'],
 ['west-glassleaf-arcade',3,11,20,44,14,'pack3:026'],
 ['east-quiet-spore-bench',34,10,51,43,17,'pack3:023'],
 ['middle-angled-intersection',19,14,36,45,20,'pack3:025'],
 ['southwest-moss-dryhouse',7,39,27,51,15,'pack3:026'],
 ['southeast-lanternless-orchid-store',29,40,48,52,16,'pack3:023'],
 ['northwest-book-nook',2,5,15,27,10,'pack3:025'],
 ['northeast-cold-root-labels',40,4,52,28,17,'pack3:026']
 ],courts=[[23,22,31,30],[11,39,17,45],[37,38,43,45]],
 key=(x,z)=>x+','+z,indoor=new Set(),court=new Set(),path=new Set(),roof=new Map(),
 faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)indoor.add(key(x,z));
 for(const [x0,z0,x1,z1] of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){court.add(key(x,z));indoor.delete(key(x,z))}
 // Three distinct paved outer spokes, joined by a real stone crescent
 // crosspath: no imaginary connectivity through distant tagged rooms.
 for(const [x0,z0,x1,z1] of [[8,47,13,55],[24,47,30,55],[43,47,49,55],[12,52,44,55]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)if(!indoor.has(key(x,z))&&!court.has(key(x,z)))path.add(key(x,z));
 const inside=(x,z)=>indoor.has(key(x,z)),ground=(x,z)=>inside(x,z)||court.has(key(x,z))||path.has(key(x,z));
 for(const k of new Set([...indoor,...court,...path])){const [x,z]=k.split(',').map(Number);b.put(x,0,z,'foundation','live:stone','none',{genuinelyGroundedMoonfernSource:true})}
 for(const k of indoor){const [x,z]=k.split(',').map(Number);if(Object.values(faces).some(([dx,dz])=>!ground(x+dx,z+dz)))
  for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',{originalMoonsilkTimberWall:true,windCertified:false})}
 for(const [name,x0,z0,x1,z1,base,asset] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!inside(x,z)||roof.has(key(x,z)))continue;
  const d=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(d/(name==='middle-angled-intersection'?3:5));
  roof.set(key(x,z),y);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',{immediateOriginalRoofBearer:true});
  b.put(x,y,z,'roof',asset,'north',{originalMoonfernRadialWing:name,noOriginalPack3PhysicalCertification:true});
 }
 // Supported 9-tier ringed standing woodland observation marker,
 // physically footed on an internal roof-side stone foundation.
 const bx=7,bz=22;
 for(let y=1;y<=9;y++)b.put(bx,y,bz,'support','live:stone','none',
  {originalGroundedMoonDialTier:y,unpoweredMarker:true});
 b.put(bx,10,bz,'roof','pack3:025','north',{directlySourceBackedMoonDialCap:true});
 for(const [x,z] of [[17,7],[28,8],[40,8],[11,21],[45,22],[18,38],[39,39],[26,43],[12,46],[45,46]]){
  const y=roof.get(key(x,z));if(!y)throw Error('Moonfern roof rafter misses real roof '+key(x,z));
  b.support(x,z,y-1,'live:wood','ground-to-moonfern-roof-bent');
 }
 for(const [axis,fixed,lo,hi,holes] of [
  ['x',20,16,43,[21,22,29,30,36,37]],
  ['x',35,16,44,[21,22,29,30,36,37]],
  ['z',16,14,42,[19,20,27,28,35,36]],
  ['z',41,8,47,[13,14,22,23,30,31,38,39]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!inside(x,z)||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood','none',{unpoweredTrellisScreen:true});
 }
 for(const row of [
  ['northern-frostleaf-entrance',15,4,41,14],['west-silent-seed-cabin',4,12,19,42],
  ['east-spore-notes-library',35,11,50,42],['center-moonfern-crosshall',20,15,35,44],
  ['southwest-unplanted-terrace',8,40,26,50],['southeast-empty-bloom-bench',30,41,47,51],
  ['northwest-book-arcade',3,6,14,26],['northeast-unlit-botanist-desk',41,5,51,27],
  ['central-fully-open-moon-court',23,22,31,30],
  ['western-open-root-court',11,39,17,45],['eastern-sky-open-foliage-court',37,38,43,45],
  ['west-grounded-moon-path',8,48,13,54],['center-grounded-moon-path',24,48,30,54],
  ['east-grounded-moon-path',43,48,49,54],['outer-moonstone-crescent',12,52,44,55]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','northern-frostleaf-entrance',27,3],
  ['northern-frostleaf-entrance','west-silent-seed-cabin',20,13],
  ['northern-frostleaf-entrance','east-spore-notes-library',35,13],
  ['northern-frostleaf-entrance','center-moonfern-crosshall',27,16],
  ['west-silent-seed-cabin','center-moonfern-crosshall',20,32],
  ['east-spore-notes-library','center-moonfern-crosshall',35,32],
  ['center-moonfern-crosshall','central-fully-open-moon-court',22,26],
  ['central-fully-open-moon-court','east-spore-notes-library',32,26],
  ['west-silent-seed-cabin','western-open-root-court',15,38],
  ['western-open-root-court','southwest-unplanted-terrace',15,46],
  ['east-spore-notes-library','eastern-sky-open-foliage-court',40,37],
  ['eastern-sky-open-foliage-court','southeast-empty-bloom-bench',40,46],
  ['southwest-unplanted-terrace','west-grounded-moon-path',11,47],
  ['southeast-empty-bloom-bench','east-grounded-moon-path',46,47],
  ['west-grounded-moon-path','outer-moonstone-crescent',13,53],
  ['center-grounded-moon-path','outer-moonstone-crescent',27,53],
  ['outer-moonstone-crescent','east-grounded-moon-path',44,53],
  ['northern-frostleaf-entrance','northwest-book-arcade',14,11],
  ['east-spore-notes-library','northeast-unlit-botanist-desk',41,18]
 ]){
  if(!ground(x,z))throw Error('Moonfern actual portal has no physical y0 floor '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let nGlass=0,nBays=0;
 for(const k of indoor){const [x,z]=k.split(',').map(Number);
  if((x*13+z*7)%9!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const exposed=Object.entries(faces).find(([,v])=>!ground(x+v[0],z+v[1]));
  if(!exposed)continue;
  for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',exposed[0],{authenticFourTierMoonfernGlass:true,producerMeshNotAccepted:true});nGlass++}
  nBays++;
 }
 for(const [x,z,label] of [[26,8,'silent-spore-census'],[42,34,'closed-moon-herb-box'],[16,34,'dry-moonvine-journal']])
  if(inside(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Eight genuinely separate backed original Pack3 radial wings, three fully open-to-sky stone walking courts and three grounded linked outdoor lunar paths with a small true stone signal marker; all vertical Pack4 bays remain unmounted source candidates.',{
  originalBuilderBOnlyWave:40,originalRoofWingCount:8,
  actualPavedSkyOpenCourts:[81,49,56],outsideGroundedMoonPaths:path.size,
  trueOriginalStoneMoonDialHeight:9,
  fourHighOriginalWindowCells:nGlass,fullFourHighGlassBays:nBays,
  livePlantGrowth:false,workingMagicalMoondial:false,
  physicalPackCollisionAccepted:false,creatorArtAccepted:false,
  actualIphonePwaApproved:false,productionRegistered:false,
  worldPlacement:false,saveSchema1Written:false
 });
}
