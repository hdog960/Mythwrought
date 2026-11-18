// Original, isolated Roadmap B Wave6 community architecture. No production registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
const SPECS=[{"cat":"stable","biome":"snow","size":"large","title":"Whitecrag Seven-Stall Caravan Mews","w":55,"d":52,"h":31,"parts":[[8,2,28,14],[2,12,17,34],[24,9,46,22],[11,30,37,45],[31,20,50,47],[4,36,22,49],[42,3,52,14]],"levels":[13,20,11,16,9,18,22],"program":"Snow-trail seven-stall caravan mews; staggered west feed loft, east tack aisle, rear sheltered carriage stores and high signal extension; no citizen/animal AI.","rooms":["north-sled-reception","western-hay-gallery","east-empty-stall-court","rear-carriage-records"],"index":5,"roofs":[[8,2,28,14,13,"stable-snow-wave6-north-porch"],[2,12,17,34,20,"stable-snow-wave6-western-apse"],[24,9,46,22,11,"stable-snow-wave6-eastern-gallery"],[11,30,37,45,16,"stable-snow-wave6-central-court"],[31,20,50,47,9,"stable-snow-wave6-south-loft"],[4,36,22,49,18,"stable-snow-wave6-branch-arcade"],[42,3,52,14,22,"stable-snow-wave6-additional-spur"]],"windows":[[9,2],[27,2],[2,15],[46,13],[14,45],[34,45]],"entrances":[[18,2],[9,23],[35,15],[24,37],[40,33],[13,42],[47,8]],"posts":[[10,4],[4,14],[26,11],[13,32],[33,22],[6,38],[44,5]],"fixture":[[12,6,"stable-wave6-unpowered-board"],[6,16,"stable-wave6-empty-rack"],[28,13,"stable-wave6-archive"],[15,34,"stable-wave6-nonfunctional-device"]]},{"cat":"greenhouse","biome":"desert","size":"medium","title":"Copperbloom Crescent Seed Conservatory","w":46,"d":48,"h":27,"parts":[[12,2,32,13],[3,10,16,26],[26,12,43,37],[10,24,34,42],[3,34,19,46],[36,2,43,13]],"levels":[11,19,13,16,10,22],"program":"Desert botanical conservatory, with deep eastern shadehouse, asymmetrical high northern glass hood, western seed vault and open sand-light courtyard; no farming gameplay.","rooms":["desert-seed-vestibule","western-waterless-vault","eastern-copperbloom-walk","southern-herb-logbook"],"index":4,"roofs":[[12,2,32,13,11,"greenhouse-desert-wave6-north-porch"],[3,10,16,26,19,"greenhouse-desert-wave6-western-apse"],[26,12,43,37,13,"greenhouse-desert-wave6-eastern-gallery"],[10,24,34,42,16,"greenhouse-desert-wave6-central-court"],[3,34,19,46,10,"greenhouse-desert-wave6-south-loft"],[36,2,43,13,22,"greenhouse-desert-wave6-branch-arcade"]],"windows":[[13,2],[31,2],[3,13],[43,16],[13,42],[31,42]],"entrances":[[22,2],[9,18],[34,24],[22,33],[11,40],[39,7]],"posts":[[14,4],[5,12],[28,14],[12,26],[5,36],[38,4]],"fixture":[[16,6,"greenhouse-wave6-unpowered-board"],[7,14,"greenhouse-wave6-empty-rack"],[30,16,"greenhouse-wave6-archive"],[14,28,"greenhouse-wave6-nonfunctional-device"]]},{"cat":"bathhouse","biome":"temperate","size":"large","title":"Willowmere Tidal Willow Baths","w":53,"d":51,"h":30,"parts":[[16,2,35,13],[2,11,20,32],[28,9,50,34],[9,27,42,47],[3,39,19,49],[42,30,51,47],[8,2,15,11],[2,2,15,15],[36,2,50,15]],"levels":[12,10,23,16,19,13,11],"program":"Temperate riverside bathhouse with exposed skybreak courtyard, lofty eastern willow steam gallery, west dry therapy rooms, southern secluded terraces and western garden fork; no flowing liquids.","rooms":["north-dry-changing-entry","western-willow-therapy","high-eastern-steamgallery","south-register-library"],"index":4,"roofs":[[16,2,35,13,12,"bathhouse-temperate-wave6-north-porch"],[2,11,20,32,10,"bathhouse-temperate-wave6-western-apse"],[28,9,50,34,23,"bathhouse-temperate-wave6-eastern-gallery"],[9,27,42,47,16,"bathhouse-temperate-wave6-central-court"],[3,39,19,49,19,"bathhouse-temperate-wave6-south-loft"],[42,30,51,47,13,"bathhouse-temperate-wave6-branch-arcade"],[8,2,15,11,11,"bathhouse-temperate-wave6-additional-spur"],[2,2,15,15,18,"willowmere-west-upstream-portico"],[36,2,50,15,10,"willowmere-sunlit-east-service-jetty"]],"windows":[[17,2],[34,2],[2,14],[50,13],[12,47],[39,47]],"entrances":[[25,2],[11,21],[39,21],[25,37],[11,44],[46,38],[11,6]],"posts":[[18,4],[4,13],[30,11],[11,29],[5,41],[44,32],[10,4],[4,4],[38,4]],"fixture":[[20,6,"bathhouse-wave6-unpowered-board"],[6,15,"bathhouse-wave6-empty-rack"],[32,13,"bathhouse-wave6-archive"],[13,31,"bathhouse-wave6-nonfunctional-device"],[5,6,"willowmere-west-upstream-portico-static-ledger"],[39,6,"willowmere-sunlit-east-service-jetty-static-ledger"]]},{"cat":"fishing-lodge","biome":"enchanted-forest","size":"medium","title":"Lumenfen Crooked Reed Anglers Hall","w":47,"d":49,"h":28,"parts":[[6,2,29,12],[22,10,42,29],[2,11,13,31],[13,27,37,41],[4,36,22,47],[32,34,44,46],[34,2,43,17]],"levels":[13,18,9,15,22,11,10],"program":"Enchanted fen fishing lodge with very tall southern lichen loft, open inner reed quay, east mooring charts, west tackle records and split roof skylights; no live boats or mobs.","rooms":["north-pier-logbook","east-mooring-alcove","covered-reed-fishing-gallery","south-net-witness"],"index":4,"roofs":[[6,2,29,12,13,"fishing-lodge-enchanted-forest-wave6-north-porch"],[22,10,42,29,18,"fishing-lodge-enchanted-forest-wave6-western-apse"],[2,11,13,31,9,"fishing-lodge-enchanted-forest-wave6-eastern-gallery"],[13,27,37,41,15,"fishing-lodge-enchanted-forest-wave6-central-court"],[4,36,22,47,22,"fishing-lodge-enchanted-forest-wave6-south-loft"],[32,34,44,46,11,"fishing-lodge-enchanted-forest-wave6-branch-arcade"],[34,2,43,17,10,"fishing-lodge-enchanted-forest-wave6-additional-spur"]],"windows":[[7,2],[28,2],[22,13],[13,15],[16,41],[34,41]],"entrances":[[17,2],[32,19],[7,21],[25,34],[13,41],[38,40],[38,9]],"posts":[[8,4],[24,12],[4,13],[15,29],[6,38],[34,36],[36,4]],"fixture":[[10,6,"fishing-lodge-wave6-unpowered-board"],[26,14,"fishing-lodge-wave6-empty-rack"],[6,15,"fishing-lodge-wave6-archive"],[17,31,"fishing-lodge-wave6-nonfunctional-device"]]}];

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
  if(!top||!has(x,z))throw Error('Wave6 floating support '+s.title+' '+key(x,z));
  b.support(x,z,top-1,s.biome==='desert'?'live:stone':'live:wood','wave6-physical-source-bearing-column');
 }
 for(const [x,z] of s.windows){
  if(!has(x,z))throw Error('Wave6 window outside footprint '+key(x,z));
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
  if(!has(x,z))throw Error('Wave6 portal outside source envelope '+s.title+' '+key(x,z));
  b.opening(x,z);
  b.portal(i===0?'outside':s.rooms[(i-1)%4],s.rooms[i%4],x,z);
 }
 return b.finish(s.program,{
  sourceAuthor:'Roadmap B Wave6 individually authored site-specific geometry',
  isolatedStaging:true,liveIntegration:false,worldPlacement:false,
  schema1Writes:false,creatorArtAccepted:false,physicalPackFamilyAABBApproved:false,
  outlineRectangles:s.parts,roofMassCount:s.roofs.length,previousBlueprintsPreserved:true
 });
}
export function getRoadmapBWave6B1(){return SPECS.map(build);}
export const ROADMAP_B_WAVE6_B1_IDS=Object.freeze(SPECS.map(x=>
 ['r1',x.cat,x.biome,x.size,String(x.index).padStart(3,'0')].join(':')));
