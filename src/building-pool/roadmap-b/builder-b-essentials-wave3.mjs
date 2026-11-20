// Builder B source-only Roadmap B wave3. Original shoreline-facing fishing lodge.
// All XYZ cells are authored in distinct multi-wing plans; no fish AI, fluid, economy, runtime, or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SEDGEWATCH_FISHING_LODGE_ID='r1:fishing-lodge:temperate:small:002';
export function buildSedgewatchTidehookFishingLodge(){
 const b=sourcePlan('fishing-lodge','temperate','small',2,'Sedgewatch Tidehook Fishing Lodge',43,25,43);
 const w=[[12,2,28,12],[4,10,16,31],[26,10,38,26],[13,25,32,38],[14,15,29,27],[2,26,11,38]];
 const voids=[[19,18,24,23]],K=(x,z)=>x+','+z,foot=new Set(),rmap=new Map();
 for(const [x0,z0,x1,z1] of w)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(const [x0,z0,x1,z1] of voids)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const cell of foot){
  const [x,z]=cell.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood');
 }
 // Shore-aware circulation: a low net wing, high east chart house, and distinct pier store.
 for(const [axis,fixed,lo,hi,passes] of [
  ['x',16,12,31,[16,22,27,28]],
  ['x',26,12,26,[14,15,23,24]],
  ['z',25,13,32,[17,22,28]],
  ['z',12,13,28,[15,20,27]]
 ])for(let q=lo;q<=hi;q++){
  const x=axis==='x'?fixed:q,z=axis==='z'?fixed:q;
  if(!has(x,z)||passes.includes(q))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
 }
 const roofs=[
  [12,2,28,12,12,'windward-saltcedar-porch'],
  [4,10,16,31,10,'long-northwest-net-drying-ridge'],
  [26,10,38,26,15,'short-high-river-chart-room'],
  [13,25,32,38,13,'south-slope-cookhouse'],
  [14,15,29,27,16,'bridge-crossing-smokehouse'],
  [2,26,11,38,9,'outer-pier-basket-hut']
 ];
 for(const [x0,z0,x1,z1,y0,name] of roofs)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||rmap.has(K(x,z)))continue;
   const y=y0+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/4);
   rmap.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','north',{sourceWeatherDeck:true,loadCertification:false});
   b.put(x,y,z,'roof','pack3:023','north',{roofProfile:name,sourceOnly:true,finalRoofSealApproved:false});
  }
 for(const [x,z] of [[19,5],[9,15],[10,27],[33,15],[34,22],[17,33],[27,34],[6,34],[16,23],[28,20]]){
  const y=rmap.get(K(x,z));if(!y)throw Error('Sedgewatch grounded brace misses roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','sedgewatch-crossbraced-river-pier');
 }
 for(const [x,z,facing] of [
  [15,2,'north'],[26,2,'north'],[4,18,'west'],[4,26,'west'],[38,16,'east'],
  [37,25,'east'],[14,38,'south'],[27,38,'south'],[2,33,'west'],[11,33,'east']
 ]){if(!has(x,z))throw Error('Sedgewatch window misses real wall '+K(x,z));b.pane(x,z,facing);}
 for(const room of [
  ['north-river-register',13,3,27,11],
  ['west-net-repair-bay',5,11,15,30],
  ['east-navigation-chart-room',27,11,37,25],
  ['rear-kitchen-and-mess',14,26,31,37],
  ['central-covered-passage',15,15,28,26],
  ['outer-low-boat-kit-store',3,27,10,37]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-river-register',20,2],
  ['north-river-register','west-net-repair-bay',15,12],
  ['north-river-register','east-navigation-chart-room',27,12],
  ['north-river-register','central-covered-passage',22,12],
  ['west-net-repair-bay','central-covered-passage',16,22],
  ['east-navigation-chart-room','central-covered-passage',27,23],
  ['central-covered-passage','rear-kitchen-and-mess',22,26],
  ['west-net-repair-bay','outer-low-boat-kit-store',9,29]
 ]){if(!has(x,z))throw Error('Sedgewatch portal off authored footprint '+K(x,z));b.opening(x,z);b.portal(from,to,x,z);}
 for(const [x,z,label] of [
  [20,7,'harbor-logbook-inert'],[9,19,'dry-net-work-bench'],
  [33,20,'chart-case'],[20,34,'dry-fish-record-inventory'],[6,34,'empty-basket-rack']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Low riverfront tidal fishing lodge with six separate circulation-connected wings, genuine open-water-side garden court, protected roofed net work, raised chart house, rear preparation room and low boat-kit hut; no fishing or fluid gameplay',{
  originalSourceOwner:'Roadmap B wave3 1B service portfolio',
  shorelineAwareFoundation:true,requiresActualShorelineAndSlopeCheck:true,
  absentCourtTerrain:true,fishingSystemEnabled:false,fluidSimulationEnabled:false,
  boatInteractionEnabled:false,actualIphoneTested:false,physicalABIApproved:false,
  creatorArtAccepted:false,worldPlacement:false,productionRegistered:false
 });
}
