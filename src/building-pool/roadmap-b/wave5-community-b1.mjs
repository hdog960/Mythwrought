// Original, isolated Roadmap B Wave5 community architecture. No production registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
const SPECS=[{"cat":"bathhouse","biome":"desert","size":"medium","index":4,"title":"Sundrake Six-Court Steam Exchange","w":49,"d":49,"h":29,"parts":[[8,2,35,12],[3,10,17,32],[26,10,44,30],[12,25,39,40],[5,35,22,46],[32,36,45,46]],"program":"Dry desert bathhouse with separate shaded cool rooms, split privacy courts, central tall steam roof and rear caravan resting galleries; all water/fire features inactive","rooms":["sunshade-front-lobby","western-cool-court","eastern-cistern-archive","upper-caravan-steam-hall"],"roofs":[[8,2,35,12,12,"bathhouse-desert-wave5-north-cantilever"],[3,10,17,32,17,"bathhouse-desert-wave5-west-hall"],[26,10,44,30,10,"bathhouse-desert-wave5-east-tower"],[12,25,39,40,20,"bathhouse-desert-wave5-central-spine"],[5,35,22,46,11,"bathhouse-desert-wave5-south-loft"],[32,36,45,46,15,"bathhouse-desert-wave5-outer-jetty"]],"windows":[[9,2],[34,2],[3,14],[44,14],[16,40],[35,40]],"entrances":[[21,2],[10,21],[35,20],[25,32],[13,40],[38,41]],"posts":[[11,5],[6,13],[29,13],[15,28],[8,38],[35,39]],"fixture":[[12,7,"bathhouse-wave5-logbook"],[7,15,"bathhouse-wave5-inactive-amenity"],[30,15,"bathhouse-wave5-unlit-guidance"],[16,30,"bathhouse-wave5-storage-bench"]]},{"cat":"greenhouse","biome":"snow","size":"small","index":4,"title":"Palefern Split-Bell Winterglass House","w":39,"d":41,"h":26,"parts":[[8,2,28,12],[2,10,16,29],[21,10,36,30],[10,24,31,38],[14,14,26,32],[2,30,12,38],[29,2,36,13],[2,2,7,15],[30,30,36,38]],"program":"Snow miniature winter greenhouse with slender western heat loft, low eastern seedlings, tall central glass crown and a connected rear dormant tree gallery","rooms":["cold-vestibule","western-alpine-bench","eastern-frost-seed-room","southern-quiet-greenhouse"],"roofs":[[8,2,28,12,12,"greenhouse-snow-wave5-north-cantilever"],[2,10,16,29,18,"greenhouse-snow-wave5-west-hall"],[21,10,36,30,9,"greenhouse-snow-wave5-east-tower"],[10,24,31,38,14,"greenhouse-snow-wave5-central-spine"],[14,14,26,32,21,"greenhouse-snow-wave5-south-loft"],[2,30,12,38,13,"west-chilled-planting-lobe"],[29,2,36,13,16,"east-chilled-glass-spur"],[2,2,7,15,15,"snowglass-west-arrival-horn"],[30,30,36,38,19,"snowglass-south-remote-seedhouse"]],"windows":[[9,2],[27,2],[2,14],[36,14],[14,38],[27,38]],"entrances":[[18,2],[9,19],[28,20],[20,31],[20,23]],"posts":[[11,5],[5,13],[24,13],[13,27],[17,17],[4,32],[31,4],[4,4],[32,32]],"fixture":[[12,7,"greenhouse-wave5-logbook"],[6,15,"greenhouse-wave5-inactive-amenity"],[25,15,"greenhouse-wave5-unlit-guidance"],[14,29,"greenhouse-wave5-storage-bench"],[5,34,"west-chilled-planting-lobe-inactive"],[32,6,"east-chilled-glass-spur-inactive"],[5,6,"snowglass-west-arrival-horn-inactive"],[33,34,"snowglass-south-remote-seedhouse-inactive"]]},{"cat":"fishing-lodge","biome":"mountain","size":"large","index":4,"title":"Stormhook Razorback Fisher's Guild","w":54,"d":51,"h":33,"parts":[[12,2,34,12],[3,10,19,34],[30,10,49,31],[14,28,42,47],[2,35,23,46],[26,34,48,45]],"program":"High mountainous cliff angler guild with separate west fish register, deep eastern overhang net hall, raised rear fishery archive and two staggered cargo wings","rooms":["northern-angler-charter","western-scree-net-hall","eastern-cliff-counter","southern-guild-archive"],"roofs":[[12,2,34,12,13,"fishing-lodge-mountain-wave5-north-cantilever"],[3,10,19,34,11,"fishing-lodge-mountain-wave5-west-hall"],[30,10,49,31,22,"fishing-lodge-mountain-wave5-east-tower"],[14,28,42,47,15,"fishing-lodge-mountain-wave5-central-spine"],[2,35,23,46,19,"fishing-lodge-mountain-wave5-south-loft"],[26,34,48,45,10,"fishing-lodge-mountain-wave5-outer-jetty"]],"windows":[[13,2],[33,2],[3,14],[49,14],[18,47],[38,47]],"entrances":[[23,2],[11,22],[39,20],[28,37],[12,40],[37,39]],"posts":[[15,5],[6,13],[33,13],[17,31],[5,38],[29,37]],"fixture":[[16,7,"fishing-lodge-wave5-logbook"],[7,15,"fishing-lodge-wave5-inactive-amenity"],[34,15,"fishing-lodge-wave5-unlit-guidance"],[18,33,"fishing-lodge-wave5-storage-bench"]]},{"cat":"harbor-office","biome":"temperate","size":"large","index":4,"title":"Riverbend Five-Moor Customs Forum","w":54,"d":52,"h":33,"parts":[[14,2,40,12],[6,10,23,29],[34,10,51,35],[15,24,43,43],[2,33,21,47],[26,40,47,49]],"program":"Temperate harbor customs with two independent dock registries, stepped west quay tribunal, deep south chart arcade and off-axis northeast boat records","rooms":["northern-freight-lobby","western-freight-stamping","eastern-watch-records","southern-customs-archive"],"roofs":[[14,2,40,12,11,"harbor-office-temperate-wave5-north-cantilever"],[6,10,23,29,17,"harbor-office-temperate-wave5-west-hall"],[34,10,51,35,10,"harbor-office-temperate-wave5-east-tower"],[15,24,43,43,16,"harbor-office-temperate-wave5-central-spine"],[2,33,21,47,21,"harbor-office-temperate-wave5-south-loft"],[26,40,47,49,13,"harbor-office-temperate-wave5-outer-jetty"]],"windows":[[15,2],[39,2],[6,14],[51,14],[19,43],[39,43]],"entrances":[[27,2],[14,19],[42,22],[29,33],[11,40],[36,44]],"posts":[[17,5],[9,13],[37,13],[18,27],[5,36],[29,43]],"fixture":[[18,7,"harbor-office-wave5-logbook"],[10,15,"harbor-office-wave5-inactive-amenity"],[38,15,"harbor-office-wave5-unlit-guidance"],[19,29,"harbor-office-wave5-storage-bench"]]}];

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
  if(!top||!has(x,z))throw Error('Wave5 floating support '+s.title+' '+key(x,z));
  b.support(x,z,top-1,s.biome==='desert'?'live:stone':'live:wood','wave5-physical-source-bearing-column');
 }
 for(const [x,z] of s.windows){
  if(!has(x,z))throw Error('Wave5 window outside footprint '+key(x,z));
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
  if(!has(x,z))throw Error('Wave5 portal outside source envelope '+s.title+' '+key(x,z));
  b.opening(x,z);
  b.portal(i===0?'outside':s.rooms[(i-1)%4],s.rooms[i%4],x,z);
 }
 return b.finish(s.program,{
  sourceAuthor:'Roadmap B Wave5 individually authored site-specific geometry',
  isolatedStaging:true,liveIntegration:false,worldPlacement:false,
  schema1Writes:false,creatorArtAccepted:false,physicalPackFamilyAABBApproved:false,
  outlineRectangles:s.parts,roofMassCount:s.roofs.length,previousBlueprintsPreserved:true
 });
}
export function getRoadmapBWave5B1(){return SPECS.map(build);}
export const ROADMAP_B_WAVE5_B1_IDS=Object.freeze(SPECS.map(x=>
 ['r1',x.cat,x.biome,x.size,String(x.index).padStart(3,'0')].join(':')));
