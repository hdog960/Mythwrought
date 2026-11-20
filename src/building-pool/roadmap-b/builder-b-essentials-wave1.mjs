// MYTHWROUGHT Builder B essential-services Wave1: Briarford original barn.
// Source-only structure. No animals, farming simulation, economy, placement, live registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const BRIARFORD_BARN_ID='r1:farm-barn:temperate:small:004';
export function buildBriarfordSwitchwingBarn(){
 const b=sourcePlan('farm-barn','temperate','small',4,'Briarford Switchwing Grain Barn',46,26,45);
 const wings=[[14,2,31,14],[5,10,18,32],[29,11,41,28],[13,26,37,41],[16,18,32,30],[2,24,12,42]];
 const voids=[[20,16,26,23]];const shape=new Set(),roofs=new Map(),K=(x,z)=>x+','+z;
 for(const [x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)shape.add(K(x,z));
 for(const [x0,z0,x1,z1] of voids)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)shape.delete(K(x,z));
 const has=(x,z)=>shape.has(K(x,z));
 for(const cell of shape){
  const [x,z]=cell.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood');
 }
 // Open bays and separate workrooms are hand surveyed, not a material swap.
 for(const [axis,n,a,d,passages] of [
  ['x',18,11,25,[12,20]],['x',29,13,27,[17,24]],
  ['z',26,13,37,[17,23,31]],['x',10,25,40,[28,35]]
 ]){
  for(let q=a;q<=d;q++){
   const x=axis==='x'?n:q,z=axis==='z'?n:q;
   if(!has(x,z)||passages.includes(q))continue;
   for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
  }
 }
 const roofSections=[
  [14,2,31,14,11,'front-deep-oak-monitor'],
  [5,10,18,32,12,'western-threshing-gable'],
  [29,11,41,28,15,'cart-hay-high-pitch'],
  [13,26,37,41,13,'southern-grain-hip'],
  [2,24,12,42,9,'low-river-grain-shed'],
  [16,18,32,30,16,'central-arched-bridge']
 ];
 for(const [x0,z0,x1,z1,base,name] of roofSections)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofs.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/4);
   roofs.set(K(x,z),y);
   b.put(x,y,z,'roof','pack3:026','north',{roofProfile:name,physicalProducerApproved:false});
  }
 for(const [x,z] of [[18,6],[10,20],[35,19],[22,36],[7,34],[18,27],[30,29],[31,12]]){
  const y=roofs.get(K(x,z));
  if(!y||!has(x,z))throw Error('Briarford roof not physically borne '+K(x,z));
  b.support(x,z,y-1,'live:wood','grounded-grain-barn-column');
 }
 for(const [x,z,dir] of [[18,2,'north'],[28,2,'north'],[5,20,'west'],[41,19,'east'],
   [19,41,'south'],[32,41,'south'],[2,34,'west']]){
  if(!has(x,z))throw Error('Briarford glazing outside authored barn '+K(x,z));
  b.pane(x,z,dir);
 }
 const rooms=[
 ['public-threshing-entry',15,3,30,13],['west-grain-processing',6,11,17,31],
 ['east-cart-holding',30,12,40,27],['rear-hay-distribution',14,27,36,40],
 ['low-river-drying-annex',3,25,11,41]
 ];
 for(const room of rooms)b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','public-threshing-entry',23,2],
  ['public-threshing-entry','west-grain-processing',18,12],
  ['public-threshing-entry','east-cart-holding',29,17],
  ['west-grain-processing','rear-hay-distribution',17,26],
  ['east-cart-holding','rear-hay-distribution',31,26],
  ['west-grain-processing','low-river-drying-annex',10,28],
  ['rear-hay-distribution','low-river-drying-annex',12,35]
 ]){
  if(!has(x,z))throw Error('Briarford portal outside source '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,purpose] of [
  [23,7,'dry-seed-weights'],[9,17,'sack-loading'],[36,20,'wagon-rack'],
  [23,36,'hay-stacker-clearance-marker'],[6,37,'grain-drying-survey']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 return b.finish('Compact river-farm barn: open overhead central drying courtyard, split hay working wings, large front wagon portal, offset storage cart wing and rear unloading route; farming and animals disabled',{
  sourceAuthor:'Builder B essentials independent Briarford hand-coordinate source',
  genuineAbsentGroundCourt:true,wideWagonPortalReservation:true,
  sourceApproved:false,manualPackPhysicalABIApproved:false,
  livestockSpawning:false,farmingSystems:false,worldPlacement:false,
  settlementGenerator:false,productionMerged:false
 });
}
