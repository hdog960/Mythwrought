// Builder B 1B original source-only Meadowstep Split-Aisle Stables.
// Distinctive double-stall bays around separate human circulation and sky-open bedding court.
// All stalls are inert future reservations. No animal spawning, mounts, agriculture, gameplay, production or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const MEADOWSTEP_STABLES_ID='r1:stable:temperate:small:002';
export function buildMeadowstepSplitAisleStables(){
 const b=sourcePlan('stable','temperate','small',2,'Meadowstep Split-Aisle Stables',44,25,40);
 const wings=[[15,2,31,13],[3,10,18,32],[27,9,41,32],[12,27,36,38],[15,16,32,29],[2,27,13,38]],
  voids=[[20,19,25,24]],K=(x,z)=>x+','+z,pad=new Set(),roofs=new Map();
 for(const [x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)pad.add(K(x,z));
 for(const [x0,z0,x1,z1] of voids)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)pad.delete(K(x,z));
 const has=(x,z)=>pad.has(K(x,z));
 for(const v of pad){const[x,z]=v.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood');
 }
 // Four source-authored stall walls in protected individual bays, with 2-wide human aisle gaps.
 for(const [axis,at,lo,hi,passages] of [
  ['x',18,13,32,[17,18,25,26]],
  ['x',27,12,31,[14,15,25,26]],
  ['z',28,12,36,[16,17,29,30]],
  ['z',15,15,31,[20,21,28,29]],
  ['z',22,3,18,[9,10,15,16]]
 ]){
  for(let n=lo;n<=hi;n++){const x=axis==='x'?at:n,z=axis==='z'?at:n;
   if(!has(x,z)||passages.includes(n))continue;
   for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
  }
 }
 const masses=[
  [15,2,31,13,12,'entry-shallow-monitor'],
  [3,10,18,32,11,'west-multi-stall-pitch'],
  [27,9,41,32,15,'east-raised-grain-loft'],
  [12,27,36,38,13,'rear-hay-cross-roof'],
  [15,16,32,29,17,'central-corridor-arched-pitch'],
  [2,27,13,38,9,'low-water-and-tack-annex']
 ];
 for(const [x0,z0,x1,z1,y0,name] of masses)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z)||roofs.has(K(x,z)))continue;
  const y=y0+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/5);
  roofs.set(K(x,z),y);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','north',{beamDeck:true,loadNotCertified:true});
  b.put(x,y,z,'roof','pack3:023','north',{ridge:name,physicalLoadAndWeatherPending:true});
 }
 for(const [x,z] of [[20,5],[29,6],[9,17],[11,29],[35,17],[35,29],[17,34],[30,34],[7,34],[17,20],[29,21]]){
  const y=roofs.get(K(x,z));if(!y||!has(x,z))throw Error('Stall roof misses foundation '+K(x,z));
  b.support(x,z,y-1,'live:wood','meadowstep-deep-grounded-ridge-post');
 }
 for(const [x,z,side] of [[19,2,'north'],[28,2,'north'],[3,17,'west'],[3,27,'west'],
  [41,16,'east'],[41,26,'east'],[15,38,'south'],[30,38,'south'],[2,34,'west']]){
  if(!has(x,z))throw Error('Meadowstep exterior aperture outside '+K(x,z));
  b.pane(x,z,side);
 }
 for(const room of [
  ['public-gear-entrance',16,3,30,12],
  ['west-stall-one',4,11,17,21],
  ['west-stall-two',4,23,17,31],
  ['east-stall-one',28,11,40,22],
  ['east-stall-two',28,23,40,31],
  ['central-human-service-aisle',19,16,26,28],
  ['rear-loft-and-hay-workroom',13,29,35,37],
  ['low-west-tack-storage',3,29,12,37]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','public-gear-entrance',23,2],
  ['public-gear-entrance','west-stall-one',18,17],
  ['public-gear-entrance','east-stall-one',27,15],
  ['west-stall-one','west-stall-two',10,22],
  ['east-stall-one','east-stall-two',35,22],
  ['west-stall-two','central-human-service-aisle',18,25],
  ['east-stall-two','central-human-service-aisle',27,25],
  ['central-human-service-aisle','rear-loft-and-hay-workroom',22,28],
  ['rear-loft-and-hay-workroom','low-west-tack-storage',13,33]
 ]){if(!has(x,z))throw Error('Meadowstep actual source doorway off plot '+K(x,z));b.opening(x,z);b.portal(from,to,x,z);}
 for(const [x,z,kind] of [
  [20,7,'inert-brush-stand'],[8,17,'inert-stall-feeder-one'],[8,27,'inert-stall-feeder-two'],
  [35,17,'inert-stall-feeder-three'],[35,27,'inert-stall-feeder-four'],[23,34,'inert-hay-storage'],
  [7,33,'inert-tack-cabinet']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,kind,'pack4:059');
 return b.finish('Compact double-bay village stables with four genuinely partitioned stall spaces, distinct two-cell passage reservations, central human servicing aisle, south hay room, real sky-open dry court and low separate tack store; all animals and simulation disabled',{
  originalSourceOnly:true,owner:'MYTHWROUGHT Builder B service wave4',stallCount:4,
  stallAnimalSpawning:false,horseAI:false,fluidSimulation:false,
  mechanicalDoors:false,creatorArtworkApproved:false,physicalPackABIApproved:false,
  exactShorelineAndSlopeCheckPending:true,worldPlacement:false,saveWrites:false,productionRegistered:false
 });
}
