// Roadmap B Wave1 — three independently authored Builder 1B designs; isolated source only.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
const SPECS=[{"c":"farm-barn","b":"desert","s":"large","i":4,"title":"Saffron Mesa Split Granary","w":44,"h":23,"d":46,"program":"Covered caravan granary with open drying yard and physically distinct trade halls","parts":[[9,2,34,12],[2,10,15,36],[30,12,41,31],[13,30,37,43],[12,25,32,32]],"roofs":[[9,2,34,12,9,"sunshade-front"],[2,10,15,36,11,"west-threshing-shed"],[30,12,41,31,15,"east-high-grain-ridge"],[13,30,37,43,12,"south-granary-hip"],[12,25,32,32,14,"raised-crossing"]],"doors":[[22,2],[13,10],[32,12],[13,29],[32,30],[22,40]],"windows":[[10,2],[31,2],[2,19],[41,22],[18,43],[34,43]],"fittings":[[8,19,"stone-threshing-tray"],[36,20,"grain-sack-loading"],[25,36,"unfilled-grain-bin"]],"supports":[[13,7],[32,7],[8,17],[36,16],[19,35],[32,37]],"partitions":[["z",12,10,33,[13,14,21,22,31,32]],["x",13,16,30,[21,22,29,30]],["z",31,14,36,[20,21,32,33]]],"rooms":["entry-exchange","west-drying-hall","east-storage-hall","south-granary"]},{"c":"greenhouse","b":"snow","s":"medium","i":4,"title":"Frostglass Offset Botanical Conservatory","w":41,"h":24,"d":43,"program":"Winter glass conservatory with propagation hall and an off-axis study gallery","parts":[[12,2,29,13],[3,10,17,29],[14,13,34,23],[27,18,38,37],[8,29,32,40]],"roofs":[[12,2,29,13,11,"front-snow-vestibule"],[3,10,17,29,10,"west-ribbed-glass"],[14,13,34,23,16,"lightwell-high-roof"],[27,18,38,37,12,"east-botanical-shed"],[8,29,32,40,14,"rear-glass-sawtooth"]],"doors":[[20,2],[15,12],[28,19],[12,30],[30,32],[22,38]],"windows":[[13,2],[28,2],[3,20],[38,26],[12,40],[30,40]],"fittings":[[8,18,"winter-seed-bench"],[32,27,"dormant-snow-fern"],[22,35,"glasswork-observation-table"]],"supports":[[17,7],[26,7],[8,17],[31,22],[14,35],[27,35]],"partitions":[["z",12,12,29,[15,16,20,21,26,27]],["x",17,13,27,[17,18,22,23]],["z",30,9,32,[12,13,22,23,30,31]]],"rooms":["vestibule","winter-propagation","high-lightwell","nursery-research"]},{"c":"harbor-office","b":"enchanted-forest","s":"large","i":4,"title":"Glowroot Serpentine Harbor Registry","w":48,"h":24,"d":47,"program":"Serpentine customs house with permit booths, map observatory and inactive beacon","parts":[[5,2,27,11],[19,8,36,21],[9,18,30,29],[2,27,18,41],[15,34,42,44],[33,20,44,38]],"roofs":[[5,2,27,11,11,"pier-license-portico"],[19,8,36,21,16,"tall-customs-observatory"],[9,18,30,29,12,"registry-cross-gable"],[2,27,18,41,10,"west-map-office"],[15,34,42,44,14,"rear-pier-archive"],[33,20,44,38,18,"east-beacon-raft"]],"doors":[[16,2],[24,10],[25,20],[14,27],[17,36],[35,35]],"windows":[[7,2],[26,2],[2,31],[43,26],[20,44],[38,44]],"fittings":[[11,7,"customs-queue-desk"],[23,17,"harbor-permit-chart"],[11,34,"original-map-shelf"],[38,29,"inactive-beacon-lantern"]],"supports":[[11,7],[29,15],[14,23],[9,34],[28,38],[40,28]],"partitions":[["z",11,7,34,[16,17,24,25]],["x",16,27,39,[31,32,36,37]],["z",35,16,41,[21,22,35,36]]],"rooms":["public-permit-hall","customs-observatory","west-chart-house","east-beacon-archive"]}];

function build(s){
 const b=sourcePlan(s.c,s.b,s.s,s.i,s.title,s.w,s.h,s.d),key=(x,z)=>x+','+z;
 const mask=new Set(),roof=new Map();
 for(const [x0,z0,x1,z1] of s.parts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.add(key(x,z));
 const has=(x,z)=>mask.has(key(x,z));
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  b.put(x,0,z,'foundation',s.b==='desert'?'live:stone':'live:wood');
  if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz)))
   for(let y=1;y<=6;y++)b.put(x,y,z,'wall',s.b==='snow'?'live:stone':'live:wood');
 }
 for(const [axis,n,a,c,gates] of s.partitions)for(let v=a;v<=c;v++){
  const x=axis==='x'?n:v,z=axis==='x'?v:n;
  if(!has(x,z)||gates.includes(v))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
 }
 for(const [x0,z0,x1,z1,base,profile] of s.roofs)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z)||roof.has(key(x,z)))continue;
  const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/4);
  roof.set(key(x,z),y);
  b.put(x,y,z,'roof',s.b==='snow'?'pack3:025':s.b==='desert'?'pack3:023':'pack3:026','north',{roofProfile:profile,weatherBearingApproved:false});
 }
 for(const [x,z] of s.supports){
  const elevation=roof.get(key(x,z));
  if(!elevation||!has(x,z))throw Error('Unfounded roof '+key(x,z));
  b.support(x,z,elevation-1,'live:wood','grounded-source-post');
 }
 for(const [x,z] of s.windows){
  if(!has(x,z))throw Error('Unfounded window '+key(x,z));
  b.pane(x,z);
 }
 for(const [x,z,purpose] of s.fittings)if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 for(let i=0;i<s.rooms.length;i++){
  const [x0,z0,x1,z1]=s.parts[Math.min(i,s.parts.length-1)];
  b.room(s.rooms[i],x0+1,z0+1,x1,z1);
 }
 for(let i=0;i<s.doors.length;i++){
  const [x,z]=s.doors[i];
  if(!has(x,z))throw Error('Unfounded portal '+key(x,z));
  b.opening(x,z);
  b.portal(i===0?'outside':s.rooms[(i-1)%s.rooms.length],s.rooms[i%s.rooms.length],x,z);
 }
 return b.finish(s.program,{sourceAuthor:'Roadmap B Wave1 new original source-coordinate architecture',
   sourceBlueprintGeometry:true,sourcePhysicalPackABIApproved:false,creatorApproval:false,
   footprintUnion:s.parts,productionRegistration:false,actualIPhoneAccepted:false});
}
export function getRoadmapBWave1B1(){return SPECS.map(build);}
export const ROADMAP_B_WAVE1_B1_IDS=Object.freeze(SPECS.map(s=>['r1',s.c,s.b,s.s,String(s.i).padStart(3,'0')].join(':')));
