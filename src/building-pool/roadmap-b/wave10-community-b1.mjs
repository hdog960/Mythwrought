// Original, isolated Roadmap B Wave10 community architecture. No production registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
const SPECS=[{"cat":"farm-barn","biome":"snow","size":"medium","index":4,"title":"Frostbraid Spiral Threshing Cloister","w":54,"d":59,"h":38,"parts":[[17,2,35,14],[9,12,23,43],[29,10,44,47],[14,40,40,53],[20,18,36,39],[20,34,34,42],[2,19,14,35],[40,22,51,37],[4,42,17,54],[34,40,51,56],[3,3,12,22],[41,3,50,21]],"voids":[[26,26,31,33]],"roofs":[[17,2,35,14,14,"wave10-farm-barn-snow-ridge-0-bearing"],[9,12,23,43,11,"wave10-farm-barn-snow-ridge-1-bearing"],[29,10,44,47,18,"wave10-farm-barn-snow-ridge-2-bearing"],[14,40,40,53,23,"wave10-farm-barn-snow-ridge-3-bearing"],[20,18,36,39,16,"wave10-farm-barn-snow-ridge-4-bearing"],[20,34,34,42,20,"wave10-farm-barn-snow-ridge-5-bearing"],[2,19,14,35,12,"wave10-farm-barn-snow-ridge-6-bearing"],[40,22,51,37,25,"wave10-farm-barn-snow-ridge-7-bearing"],[4,42,17,54,15,"wave10-farm-barn-snow-ridge-8-bearing"],[34,40,51,56,19,"wave10-farm-barn-snow-ridge-9-bearing"],[3,3,12,22,22,"wave10-farm-barn-snow-ridge-10-bearing"],[41,3,50,21,17,"wave10-farm-barn-snow-ridge-11-bearing"]],"windows":[[7,3],[35,3],[49,3],[14,12],[28,14],[28,25],[7,35],[49,37],[21,53],[7,54]],"entrances":[[26,2],[16,27],[36,28],[27,46],[27,38],[8,27],[45,29],[10,48],[42,48],[7,12],[45,12]],"posts":[[19,4],[11,14],[31,12],[16,42],[22,20],[22,36],[4,21],[42,24],[6,44],[36,42],[5,5],[43,5]],"fixture":[[21,6,"wave10-farm-barn-inert-fitting-0"],[13,16,"wave10-farm-barn-inert-fitting-1"],[33,14,"wave10-farm-barn-inert-fitting-2"],[18,44,"wave10-farm-barn-inert-fitting-3"],[24,22,"wave10-farm-barn-inert-fitting-4"],[24,38,"wave10-farm-barn-inert-fitting-5"],[6,23,"wave10-farm-barn-inert-fitting-6"]],"rooms":["arrival hall","western workshop","eastern specialist wing","rear archive"],"program":"Snow seed-cloister with a truly unbuilt spiral grain yard, side granaries, tall silo records and independent rear threshing gallery; farming inactive."},{"cat":"stable","biome":"mountain","size":"small","index":5,"title":"Ridgebit Split-Track Mountain Mews","w":52,"d":55,"h":39,"parts":[[19,2,32,13],[6,9,23,22],[28,10,46,23],[7,20,18,43],[35,19,48,45],[13,40,39,51],[18,11,36,18],[17,31,38,40],[3,30,11,47],[41,30,50,50],[21,23,33,34]],"voids":[[24,25,29,31]],"roofs":[[19,2,32,13,11,"wave10-stable-mountain-ridge-0-bearing"],[6,9,23,22,18,"wave10-stable-mountain-ridge-1-bearing"],[28,10,46,23,23,"wave10-stable-mountain-ridge-2-bearing"],[7,20,18,43,16,"wave10-stable-mountain-ridge-3-bearing"],[35,19,48,45,20,"wave10-stable-mountain-ridge-4-bearing"],[13,40,39,51,12,"wave10-stable-mountain-ridge-5-bearing"],[18,11,36,18,25,"wave10-stable-mountain-ridge-6-bearing"],[17,31,38,40,15,"wave10-stable-mountain-ridge-7-bearing"],[3,30,11,47,19,"wave10-stable-mountain-ridge-8-bearing"],[41,30,50,50,22,"wave10-stable-mountain-ridge-9-bearing"],[21,23,33,34,17,"wave10-stable-mountain-ridge-10-bearing"]],"windows":[[10,9],[38,10],[24,18],[3,30],[24,32],[3,40],[10,47],[45,50],[17,51],[31,51]],"entrances":[[25,2],[14,15],[37,16],[12,31],[41,32],[26,45],[27,14],[27,35],[7,38],[45,40]],"posts":[[21,4],[8,11],[30,12],[9,22],[37,21],[15,42],[20,13],[19,33],[5,32],[43,32],[23,25]],"fixture":[[23,6,"wave10-stable-inert-fitting-0"],[10,13,"wave10-stable-inert-fitting-1"],[32,14,"wave10-stable-inert-fitting-2"],[11,24,"wave10-stable-inert-fitting-3"],[39,23,"wave10-stable-inert-fitting-4"],[17,44,"wave10-stable-inert-fitting-5"],[22,15,"wave10-stable-inert-fitting-6"]],"rooms":["arrival hall","western workshop","eastern specialist wing","rear archive"],"program":"Canyon-edge mews with a truly unbuilt turning circle, supported roofed bridges, separate tack vaults and a stone rear feed hall; mounts inactive."},{"cat":"greenhouse","biome":"enchanted-forest","size":"small","index":4,"title":"Moonpetal Orchid Ringhouse","w":55,"d":58,"h":39,"parts":[[18,2,35,13],[8,9,23,28],[31,10,46,31],[13,26,42,38],[5,36,20,51],[32,36,52,52],[18,44,39,55],[21,13,34,28],[3,3,11,19],[43,2,52,22],[23,37,31,48]],"voids":[[25,30,30,35]],"roofs":[[18,2,35,13,18,"wave10-greenhouse-enchanted-forest-ridge-0-bearing"],[8,9,23,28,23,"wave10-greenhouse-enchanted-forest-ridge-1-bearing"],[31,10,46,31,16,"wave10-greenhouse-enchanted-forest-ridge-2-bearing"],[13,26,42,38,20,"wave10-greenhouse-enchanted-forest-ridge-3-bearing"],[5,36,20,51,12,"wave10-greenhouse-enchanted-forest-ridge-4-bearing"],[32,36,52,52,25,"wave10-greenhouse-enchanted-forest-ridge-5-bearing"],[18,44,39,55,15,"wave10-greenhouse-enchanted-forest-ridge-6-bearing"],[21,13,34,28,19,"wave10-greenhouse-enchanted-forest-ridge-7-bearing"],[3,3,11,19,22,"wave10-greenhouse-enchanted-forest-ridge-8-bearing"],[43,2,52,22,17,"wave10-greenhouse-enchanted-forest-ridge-9-bearing"],[23,37,31,48,14,"wave10-greenhouse-enchanted-forest-ridge-10-bearing"]],"windows":[[6,3],[13,9],[41,10],[6,19],[48,22],[13,29],[27,29],[6,36],[48,36],[20,39]],"entrances":[[26,2],[15,18],[38,20],[12,43],[42,44],[28,49],[27,20],[7,11],[47,12],[27,42]],"posts":[[20,4],[10,11],[33,12],[15,28],[7,38],[34,38],[20,46],[23,15],[5,5],[45,4],[25,39]],"fixture":[[22,6,"wave10-greenhouse-inert-fitting-0"],[12,13,"wave10-greenhouse-inert-fitting-1"],[35,14,"wave10-greenhouse-inert-fitting-2"],[17,30,"wave10-greenhouse-inert-fitting-3"],[9,40,"wave10-greenhouse-inert-fitting-4"],[36,40,"wave10-greenhouse-inert-fitting-5"],[22,48,"wave10-greenhouse-inert-fitting-6"]],"rooms":["arrival hall","western workshop","eastern specialist wing","rear archive"],"program":"Glass-rimmed orchid ringhouse with truly open-air missing-foundation pollinator well, offset seed laboratories and an enclosed rear botanic gallery; growth inactive."},{"cat":"fishing-lodge","biome":"temperate","size":"large","index":4,"title":"Larkwater Sawtooth Anglers Forum","w":63,"d":59,"h":39,"parts":[[22,2,40,12],[10,8,26,27],[35,9,53,31],[9,26,53,38],[3,31,17,50],[46,33,60,53],[17,41,45,56],[18,12,42,21],[26,35,34,46],[3,4,12,17],[50,3,61,20]],"voids":[[28,28,34,33]],"roofs":[[22,2,40,12,23,"wave10-fishing-lodge-temperate-ridge-0-bearing"],[10,8,26,27,16,"wave10-fishing-lodge-temperate-ridge-1-bearing"],[35,9,53,31,20,"wave10-fishing-lodge-temperate-ridge-2-bearing"],[9,26,53,38,12,"wave10-fishing-lodge-temperate-ridge-3-bearing"],[3,31,17,50,25,"wave10-fishing-lodge-temperate-ridge-4-bearing"],[46,33,60,53,15,"wave10-fishing-lodge-temperate-ridge-5-bearing"],[17,41,45,56,19,"wave10-fishing-lodge-temperate-ridge-6-bearing"],[18,12,42,21,22,"wave10-fishing-lodge-temperate-ridge-7-bearing"],[26,35,34,46,17,"wave10-fishing-lodge-temperate-ridge-8-bearing"],[3,4,12,17,14,"wave10-fishing-lodge-temperate-ridge-9-bearing"],[50,3,61,20,11,"wave10-fishing-lodge-temperate-ridge-10-bearing"]],"windows":[[51,3],[9,4],[16,8],[44,9],[9,17],[58,20],[30,21],[9,27],[58,33],[30,34]],"entrances":[[31,2],[18,17],[44,20],[10,40],[53,43],[31,48],[30,16],[30,40],[7,10],[55,11]],"posts":[[24,4],[12,10],[37,11],[11,28],[5,33],[48,35],[19,43],[20,14],[28,37],[5,6],[52,5]],"fixture":[[26,6,"wave10-fishing-lodge-inert-fitting-0"],[14,12,"wave10-fishing-lodge-inert-fitting-1"],[39,13,"wave10-fishing-lodge-inert-fitting-2"],[13,30,"wave10-fishing-lodge-inert-fitting-3"],[7,35,"wave10-fishing-lodge-inert-fitting-4"],[50,37,"wave10-fishing-lodge-inert-fitting-5"],[21,45,"wave10-fishing-lodge-inert-fitting-6"]],"rooms":["arrival hall","western workshop","eastern specialist wing","rear archive"],"program":"River fishing lodge with sawtooth bays, sky-open dry fish court, roofed net bridge, east records turret and far rear tackle archive; fishing inactive."}];

function build(s){
 const b=sourcePlan(s.cat,s.biome,s.size,s.index,s.title,s.w,s.h,s.d);
 const footprint=new Set(),roofMap=new Map(),key=(x,z)=>x+','+z;
 for(const [x0,z0,x1,z1] of s.parts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)footprint.add(key(x,z));
 for(const [a,b,c,d] of s.voids||[])for(let x=a;x<=c;x++)for(let z=b;z<=d;z++)footprint.delete(key(x,z));
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
  if(!top||!has(x,z))throw Error('Wave10 floating support '+s.title+' '+key(x,z));
  b.support(x,z,top-1,s.biome==='desert'?'live:stone':'live:wood','wave10-physical-source-bearing-column');
 }
 for(const [x,z] of s.windows){
  if(!has(x,z))throw Error('Wave10 window outside footprint '+key(x,z));
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
  if(!has(x,z))throw Error('Wave10 portal outside source envelope '+s.title+' '+key(x,z));
  b.opening(x,z);
  b.portal(i===0?'outside':s.rooms[(i-1)%4],s.rooms[i%4],x,z);
 }
 return b.finish(s.program,{
  sourceAuthor:'Roadmap B Wave10 individually authored site-specific geometry',
  isolatedStaging:true,liveIntegration:false,worldPlacement:false,
  schema1Writes:false,creatorArtAccepted:false,physicalPackFamilyAABBApproved:false,
  outlineRectangles:s.parts,roofMassCount:s.roofs.length,previousBlueprintsPreserved:true
 });
}
export function getRoadmapBWave10B1(){return SPECS.map(build);}
export const ROADMAP_B_WAVE10_B1_IDS=Object.freeze(SPECS.map(x=>
 ['r1',x.cat,x.biome,x.size,String(x.index).padStart(3,'0')].join(':')));
