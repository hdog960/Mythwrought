// Original, isolated Roadmap B Wave4 community architecture. No production registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
const SPECS=[{"cat":"bathhouse","biome":"mountain","size":"small","index":4,"title":"Gloamstep Thermal Terrace","w":36,"d":37,"h":22,"parts":[[11,2,26,11],[4,9,16,27],[23,9,32,25],[8,24,29,34],[14,13,25,27]],"roofs":[[11,2,26,11,9,"w4-bathhouse-mountain-north-portico"],[4,9,16,27,12,"w4-bathhouse-mountain-west-terrace"],[23,9,32,25,15,"w4-bathhouse-mountain-east-peak"],[8,24,29,34,10,"w4-bathhouse-mountain-rear-ridge"],[14,13,25,27,17,"w4-bathhouse-mountain-central-bridge"]],"windows":[[12,2],[25,2],[4,13],[32,14],[12,34],[25,34]],"entrances":[[18,2],[10,18],[27,17],[18,29],[19,20]],"posts":[[13,5],[6,12],[25,12],[10,27],[16,16]],"fixture":[[15,6,"bathhouse-wave4-public-record"],[8,13,"bathhouse-wave4-unpowered-workbench"],[27,13,"bathhouse-wave4-dry-display"],[12,28,"bathhouse-wave4-nonplayable-machine"]],"rooms":["stone-changing-chamber","west-hearth-terrace","mountain-mist-chapel","dry-sauna-platform"],"program":"Mountain dry bathhouse with a narrow central arcade, west warming cellar, high east mist chamber and low rear sauna"},{"cat":"greenhouse","biome":"temperate","size":"medium","index":4,"title":"Briarweave Ribbon Conservatory","w":43,"d":43,"h":26,"parts":[[8,2,31,11],[2,9,14,30],[28,9,40,32],[10,26,36,40],[16,13,30,29]],"roofs":[[8,2,31,11,12,"w4-greenhouse-temperate-north-portico"],[2,9,14,30,16,"w4-greenhouse-temperate-west-terrace"],[28,9,40,32,9,"w4-greenhouse-temperate-east-peak"],[10,26,36,40,14,"w4-greenhouse-temperate-rear-ridge"],[16,13,30,29,19,"w4-greenhouse-temperate-central-bridge"]],"windows":[[9,2],[30,2],[2,13],[40,14],[14,40],[32,40]],"entrances":[[19,2],[8,19],[34,20],[23,33],[23,21]],"posts":[[10,5],[4,12],[30,12],[12,29],[18,16]],"fixture":[[12,6,"greenhouse-wave4-public-record"],[6,13,"greenhouse-wave4-unpowered-workbench"],[32,13,"greenhouse-wave4-dry-display"],[14,30,"greenhouse-wave4-nonplayable-machine"]],"rooms":["public-plant-entry","west-sapling-gallery","east-bloom-corridor","southern-herbal-seed-room"],"program":"Long ribbon conservatory where angled west sapling hall and east glass gallery join a broad low rear herb field"},{"cat":"fishing-lodge","biome":"desert","size":"small","index":4,"title":"Copperwind Dry-Reed Fisheries","w":36,"d":39,"h":23,"parts":[[4,2,24,10],[19,7,33,24],[2,17,14,34],[10,26,30,36],[10,8,24,29]],"roofs":[[4,2,24,10,9,"w4-fishing-lodge-desert-north-portico"],[19,7,33,24,15,"w4-fishing-lodge-desert-west-terrace"],[2,17,14,34,11,"w4-fishing-lodge-desert-east-peak"],[10,26,30,36,17,"w4-fishing-lodge-desert-rear-ridge"],[10,8,24,29,12,"w4-fishing-lodge-desert-central-bridge"]],"windows":[[5,2],[23,2],[19,11],[14,22],[14,36],[26,36]],"entrances":[[14,2],[26,15],[8,25],[20,31],[17,18]],"posts":[[6,5],[21,10],[4,20],[12,29],[12,11]],"fixture":[[8,6,"fishing-lodge-wave4-public-record"],[23,11,"fishing-lodge-wave4-unpowered-workbench"],[6,21,"fishing-lodge-wave4-dry-display"],[14,30,"fishing-lodge-wave4-nonplayable-machine"]],"rooms":["north-net-exchange","reed-net-storage","west-boat-counting","south-oasis-rod-loft"],"program":"Sun-dried reed lodge with an off-axis net hall, a shaded west boat log and narrow south fishing-repair gallery"},{"cat":"lighthouse","biome":"snow","size":"medium","index":4,"title":"Frostspire Offset Watch","w":45,"d":45,"h":29,"parts":[[13,2,28,20],[5,10,37,17],[2,20,16,37],[29,17,42,37],[11,31,35,42],[17,17,30,32]],"roofs":[[13,2,28,20,22,"w4-lighthouse-snow-north-portico"],[5,10,37,17,10,"w4-lighthouse-snow-west-terrace"],[2,20,16,37,14,"w4-lighthouse-snow-east-peak"],[29,17,42,37,9,"w4-lighthouse-snow-rear-ridge"],[11,31,35,42,17,"w4-lighthouse-snow-central-bridge"],[17,17,30,32,12,"w4-lighthouse-snow-outer-fork"]],"windows":[[14,2],[27,2],[5,14],[16,25],[33,37],[38,37]],"entrances":[[20,2],[21,13],[9,28],[35,27],[23,36],[23,24]],"posts":[[15,5],[7,13],[4,23],[31,20],[13,34],[19,20]],"fixture":[[17,6,"lighthouse-wave4-public-record"],[9,14,"lighthouse-wave4-unpowered-workbench"],[6,24,"lighthouse-wave4-dry-display"],[33,21,"lighthouse-wave4-nonplayable-machine"]],"rooms":["north-ice-signal","west-winter-marker","east-snow-vault","rear-boat-chart-archive"],"program":"Snow lighthouse with tall northward tower, off-axis east viewing platform, south ice ledger and bent western customs hall"}];

function build(s){
 const b=sourcePlan(s.cat,s.biome,s.size,s.index,s.title,s.w,s.h,s.d);
 const footprint=new Set(),roofMap=new Map(),key=(x,z)=>x+','+z;
 for(const [x0,z0,x1,z1] of s.parts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)footprint.add(key(x,z));
 const has=(x,z)=>footprint.has(key(x,z));
 for(const place of footprint){
  const [x,z]=place.split(',').map(Number);
  b.put(x,0,z,'foundation',s.biome==='snow'?'live:stone':'live:wood');
  if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz)))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall',s.biome==='desert'?'live:stone':'live:wood');
 }
 for(const [x0,z0,x1,z1,at,profile] of s.roofs)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofMap.has(key(x,z)))continue;
   const h=at+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/5);
   roofMap.set(key(x,z),h);
   b.put(x,h,z,'roof',s.biome==='snow'?'pack3:025':s.biome==='desert'?'pack3:023':'pack3:026','north',
    {roofProfile:profile,originalMassing:true,producerPhysicalSupportApproved:false});
  }
 for(const [x,z] of s.posts){
  const top=roofMap.get(key(x,z));
  if(!top||!has(x,z))throw Error('Wave4 floating support '+s.title+' '+key(x,z));
  b.support(x,z,top-1,s.biome==='desert'?'live:stone':'live:wood','wave4-physical-source-bearing-column');
 }
 for(const [x,z] of s.windows){
  if(!has(x,z))throw Error('Wave4 window outside footprint '+key(x,z));
  b.pane(x,z);
 }
 for(const [x,z,purpose] of s.fixture)
  if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 const physicalRooms=[
  [s.rooms[0],s.parts[0]],[s.rooms[1],s.parts[2]],
  [s.rooms[2],s.parts[3]],[s.rooms[3],s.parts[4]]
 ];
 for(const [room,[x0,z0,x1,z1]] of physicalRooms)b.room(room,x0+1,z0+1,x1-1,z1-1);
 for(let i=0;i<s.entrances.length;i++){
  const [x,z]=s.entrances[i];
  if(!has(x,z))throw Error('Wave4 portal outside source envelope '+s.title+' '+key(x,z));
  b.opening(x,z);
  b.portal(i===0?'outside':s.rooms[(i-1)%4],s.rooms[i%4],x,z);
 }
 return b.finish(s.program,{
  sourceAuthor:'Roadmap B Wave4 individually authored site-specific geometry',
  isolatedStaging:true,liveIntegration:false,worldPlacement:false,
  schema1Writes:false,creatorArtAccepted:false,physicalPackFamilyAABBApproved:false,
  outlineRectangles:s.parts,roofMassCount:s.roofs.length,previousBlueprintsPreserved:true
 });
}
export function getRoadmapBWave4B1(){return SPECS.map(build);}
export const ROADMAP_B_WAVE4_B1_IDS=Object.freeze(SPECS.map(x=>
 ['r1',x.cat,x.biome,x.size,String(x.index).padStart(3,'0')].join(':')));
