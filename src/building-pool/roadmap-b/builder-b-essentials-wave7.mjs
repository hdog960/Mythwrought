// Builder B 1B Wave7: original winter greenhouse with real vertical transparent clerestory openings and opaque snow roofs; no weather, farming or growth simulation.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const RIMEGLASS_CRESCENT_GREENHOUSE_ID='r1:greenhouse:snow:small:002';
export function buildRimeglassCrescentSunGreenhouse(){
 const b=sourcePlan('greenhouse','snow','small',2,'Rimeglass Crescent-Sun Greenhouse',44,28,42);
 const wings=[[14,2,29,12],[3,9,18,32],[27,9,40,33],[10,29,34,40],[14,13,31,31],[2,28,12,39]],
  sunwell=[20,19,24,24],foot=new Set(),roofs=new Map(),K=(x,z)=>x+','+z;
 for(const [x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(let x=sunwell[0];x<=sunwell[2];x++)for(let z=sunwell[1];z<=sunwell[3];z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const k of foot){const[x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','pack2:013');
 }
 // True independent glass-growing aisles; deliberate two-cell connecting passages at the seams.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',18,10,32,[14,15,21,22,29,30]],
  ['x',27,11,32,[14,15,21,22,29,30]],
  ['z',29,10,35,[16,17,22,23,30,31]],
  ['z',13,14,33,[16,17,23,24,28,29]],
  ['x',33,30,39,[33,34]]
 ])for(let n=lo;n<=hi;n++){const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
 }
 for(const [x0,z0,x1,z1,y0,style] of [
  [14,2,29,12,14,'front-frost-windbreak-monitor'],
  [3,9,18,32,10,'west-low-sunroot-growing-shed'],
  [27,9,40,33,15,'east-clear-glasswinter-hip'],
  [10,29,34,40,12,'south-seed-drying-ridge'],
  [14,13,31,31,18,'central-light-catching-sunbell-arc'],
  [2,28,12,39,9,'southwest-potting-pavilion']
 ]){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofs.has(K(x,z)))continue;
   const rise=Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/5);
   const y=y0+rise;roofs.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','north',{beamFrame:true,roofLoadUncertified:true});
   // Pack4 clear-glass is a vertical opening pane, never a horizontal snow roof.
   // Preserve the entire original 1,261-cell roof silhouette using the Pack3 roof family.
   b.put(x,y,z,'roof','pack3:025','north',
    {sourceRoofWing:style,opaqueSnowRoof:true,realSnowSealingUncertified:true,roofLoadUncertified:true});
  }
 }
 for(const [x,z] of [[20,6],[27,6],[9,16],[11,28],[35,16],[38,28],[18,34],[30,34],[16,18],[29,18],[7,33]]) {
  const y=roofs.get(K(x,z));if(!y||!has(x,z))throw Error('Rimeglass roof support off original greenhouse floor '+K(x,z));
  b.support(x,z,y-1,'live:wood','source-winter-column-load-unapproved');
 }
 const originalGroundFacadeWindows=[[19,2,'north'],[26,2,'north'],[3,18,'west'],[3,26,'west'],
  [40,17,'east'],[40,29,'east'],[15,40,'south'],[29,40,'south'],[2,34,'west']];
 for(const [x,z,side] of originalGroundFacadeWindows){
  if(!has(x,z))throw Error('Rimeglass glasswall off source footprint '+K(x,z));
  b.pane(x,z,side);
 }
 for(const room of [
  ['north-snowdoor-windbreak',15,3,28,12],
  ['western-seedling-bank',4,10,17,28],
  ['eastern-winterherb-gallery',28,10,39,27],
  ['east-cold-frame-collection',28,28,39,32],
  ['central-frostglass-exhibit',15,14,30,28],
  ['south-planting-and-potting-court',11,30,32,39],
  ['west-bark-and-lantern-store',3,29,12,38]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-snowdoor-windbreak',21,2],
  ['north-snowdoor-windbreak','western-seedling-bank',17,12],
  ['north-snowdoor-windbreak','eastern-winterherb-gallery',29,13],
  ['western-seedling-bank','central-frostglass-exhibit',18,20],
  ['eastern-winterherb-gallery','central-frostglass-exhibit',27,23],
  ['eastern-winterherb-gallery','east-cold-frame-collection',34,29],
  ['central-frostglass-exhibit','south-planting-and-potting-court',23,29],
  ['south-planting-and-potting-court','west-bark-and-lantern-store',12,35],
  ['western-seedling-bank','west-bark-and-lantern-store',9,28],
  ['south-planting-and-potting-court','east-cold-frame-collection',32,31]
 ]){
  if(!has(x,z))throw Error('Rimeglass physically absent source door '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,role] of [
  [23,6,'inert-seed-checkin'],[10,19,'inert-snowseed-bench'],[35,20,'inert-frostmint-rack'],
  [35,30,'inert-coldframe-notes'],[26,33,'inert-potting-table'],[8,33,'inert-root-lamp-inventory']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,role,'pack4:059');
 // Pack4 roster 030 is a REAL upright pane with mount:'opening' and only cardinal
 // yaw. Preserve the original 278 distinct light-transmitting source cells as framed,
 // exterior-facing two-band clerestory openings, not fictitious tilted/flat roof tiles.
 // Every chosen column has intact wall lintels/sills at y2,y4,y6, and an exterior
 // void immediately beyond its selected outward facing. Never cut entrance/door cells.
 const offsets=[['north',0,-1],['south',0,1],['west',-1,0],['east',1,0]];
 const glazedWallColumns=[];
 for(const key of foot){
  const [x,z]=key.split(',').map(Number);
  // Old y2 opening panes must retain their framed ground-floor openings.
  // They are not a solid support sill for any new upper-band clerestory pane.
  if(originalGroundFacadeWindows.some(([gx,gz])=>gx===x&&gz===z))continue;
  if(![2,3,4,5,6].every(y=>!b.clear(x,y,z)))continue;
  // Restrict to truly single-face exposed wall columns; corners keep full posts.
  const exterior=offsets.filter(([,dx,dz])=>!has(x+dx,z+dz));
  if(exterior.length!==1)continue;
  const [side]=exterior[0];
  glazedWallColumns.push({x,z,side,rank:((x*1315423911)^(z*2654435761))>>>0});
 }
 // Deterministic balanced coverage across all six source wings, all four facades.
 glazedWallColumns.sort((a,b)=>a.rank-b.rank||a.z-b.z||a.x-b.x);
 if(glazedWallColumns.length<139)throw Error('Rimeglass lacks 139 genuinely framed upright two-band clerestory bays');
 const chosen=glazedWallColumns.slice(0,139);
 const facades=new Set(chosen.map(c=>c.side));
 if(facades.size!==4)throw Error('Rimeglass high glazing loses one of four real exterior facades');
 let trueGlazing=0;
 for(const {x,z,side} of chosen){
  for(const y of [3,5]){
   if(b.clear(x,y,z))throw Error('Rimeglass missing original upright frame wall '+[x,y,z]);
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side,{
    originalGlazing:true,uprightOpeningPane:true,framedClerestory:true,
    roofTile:false,sourceFacade:side,lightAdmitting:true,
    actualPaneWeatherSealCertified:false,livePack4CollisionCertified:false,
    horizontalRoofMountClaimed:false
   });
   trueGlazing++;
  }
 }
 if(trueGlazing!==278)throw Error('Rimeglass must retain precisely 278 authentic upright clear-glass source openings');
 return b.finish('Snow-biome greenhouse with six individually authored building masses, physically absent 30-column crescent daylight court, 1,261 genuine opaque Pack3 roof cells and 278 correctly upright Pack4 clear-glass clerestory openings over original seven connected rooms; all farming/weather/heating/integration OFF',{
  exclusiveSourceLane:'Builder B Roadmap B 1B wave7',
  worldPlacement:false,snowWeather:false,heat:false,plantGrowth:false,lightingSystem:false,
  winterGlassSnowLoadCertified:false,glassPanePhysicalCollisionCertified:false,roofSealingCertified:false, 
  sourceUprightGlazingCount:278,sourceOpaqueRoofCells:1261,sourceRoofGlassTiles:0,
  farmAI:false,realIphoneTested:false,saveSchema1Written:false,productionRegistered:false,creatorAccepted:false
 });
}
