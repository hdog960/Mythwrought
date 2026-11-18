// Roadmap B B1: a new source-coordinate mountain bathhouse, held outside the
// accepted census until independent physical and browser gates pass.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';

export function createStoneveinSwitchbackBaths(){
 const b=sourcePlan('bathhouse','mountain','medium',4,
   'Stonevein Switchback Thermal Baths',38,22,43);
 const footprint=new Set(),roofAt=new Map();
 const key=(x,z)=>x+','+z;
 const wings=[
  [10,2,30,13],   // high front changing gallery
  [2,10,13,35],   // long western descending treatment wing
  [27,8,35,31],   // narrow eastern standing-stone ridge wing
  [9,27,34,40],  // southern sheltered soaking hall
  [11,23,30,29]  // thin southern cross-over gallery
 ];
 for(const [x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  footprint.add(key(x,z));
 const has=(x,z)=>footprint.has(key(x,z));
 // No ground cells under the central open-sky thermal garden.
 for(const cell of footprint){
  const [x,z]=cell.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=6;y++)b.put(x,y,z,'wall',x>26?'live:stone':'live:wood');
 }
 // Real room partitions and dual-wide passes, independently placed XYZ walls.
 for(const [axis,n,a,c,doors] of [
  ['z',10,11,29,[16,17,23,24]],
  ['z',29,10,33,[16,17,29,30]],
  ['x',11,16,31,[20,21,27,28]],
  ['x',30,12,27,[19,20]]
 ])for(let v=a;v<=c;v++){
  const x=axis==='z'?v:n,z=axis==='z'?n:v;
  if(!has(x,z)||doors.includes(v))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
    b.put(x,y,z,'partition','live:stone');
 }
 // Separate supported roof masses leave the inner basin courtyard uncovered.
 const roofs=[
  [10,2,30,13,10,'front-cross-gable','pack3:023'],
  [2,10,13,35,9,'west-descending-slate','live:stone'],
  [27,8,35,31,14,'east-standing-ridge','pack3:025'],
  [9,27,34,40,11,'southern-hip-gallery','pack3:024'],
  [11,23,30,29,13,'narrow-covered-return','live:wood']
 ];
 for(const [x0,z0,x1,z1,base,name,material] of roofs)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofAt.has(key(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x)/4);
   roofAt.set(key(x,z),y);
   b.put(x,y,z,'roof',material,'north',
     {roofProfile:name,weatherBearingApproved:false});
  }
 for(const [x,z] of [[15,5],[24,5],[7,17],[8,27],[31,15],[31,25],[15,33],[25,34],[29,35]]){
  const y=roofAt.get(key(x,z));
  if(!y||!has(x,z))throw Error('Unfounded mountain bearing '+key(x,z));
  b.support(x,z,y-1,'live:stone','stonevein-independent-grounded-thermal-support');
 }
 for(const [x,z,f] of [
  [12,2,'north'],[28,2,'north'],[2,19,'west'],[35,18,'east'],
  [14,40,'south'],[28,40,'south']
 ])b.pane(x,z,f);
 // Physical unlit fittings and basins; no heat, water or economy gameplay.
 for(const [x,z,purpose] of [
  [17,6,'dry-changing-bench'],[24,6,'towel-cabinet'],
  [6,19,'vacant-stone-pool-west'],[7,26,'dry-mineral-vessel'],
  [31,21,'cold-spring-chart'],[20,35,'empty-soaking-basin'],
  [26,35,'stone-lounger']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 const rooms=[
  ['front-changing-gallery',11,3,29,10],
  ['west-switchback-saunas',3,11,12,29],
  ['east-standing-stone-rooms',28,11,34,27],
  ['open-sky-courtyard-overlook',11,18,30,29],
  ['south-sheltered-thermal-hall',11,30,33,39]
 ];
 for(const r of rooms)b.room(...r);
 const doors=[
  ['outside','front-changing-gallery',20,2],
  ['front-changing-gallery','west-switchback-saunas',11,11],
  ['front-changing-gallery','east-standing-stone-rooms',30,11],
  ['west-switchback-saunas','open-sky-courtyard-overlook',11,20],
  ['east-standing-stone-rooms','open-sky-courtyard-overlook',30,22],
  ['open-sky-courtyard-overlook','south-sheltered-thermal-hall',18,30],
  ['east-standing-stone-rooms','south-sheltered-thermal-hall',30,30]
 ];
 for(const [from,to,x,z] of doors){
  if(!has(x,z))throw Error('Inaccessible authored thermal doorway '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 return b.finish('Mountain thermal baths with a sky-open switchback court, a narrow high eastern stone gallery, independently sloped western dry saunas, dry spring basins, and sheltered south soaking hall; all gameplay inactive',{
  sourceAuthor:'Roadmap B independently authored mountain bathhouse variant 004',
  sunlitCourtyardFoundationAbsent:true,unresolvedPhysicalPackVariants:true,
  waterAndHeatDisabled:true,originalHistoricalFingerprintsPreserved:true,
  visualPreviewAccepted:false,actualIphoneAccepted:false
 });
}
