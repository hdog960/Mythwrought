// Original, isolated Roadmap B Wave2 community architecture. No production registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
const SPECS=[{"cat":"lighthouse","biome":"desert","size":"large","index":4,"title":"Miragehook Two-Basin Beacon Station","w":49,"d":48,"h":29,"program":"Two detached-feeling sandstone quay wings converging on an unusually tall central unlit lighthouse and a tiered rear archive; shore navigation and beacon remain inactive","parts":[[15,2,29,17],[8,14,36,23],[2,20,17,37],[32,19,44,34],[12,33,38,44]],"roofs":[[15,2,29,17,20,"sandstone-light-tower"],[8,14,36,23,10,"transverse-public-landing"],[2,20,17,37,12,"west-basin-fork"],[32,19,44,34,15,"east-watch-gallery"],[12,33,38,44,9,"south-cargo-deck"]],"windows":[[17,2],[27,2],[2,28],[44,24],[17,44],[34,44]],"entrances":[[22,2],[17,18],[33,22],[12,34],[34,34],[23,40]],"posts":[[21,8],[25,9],[11,18],[7,28],[38,25],[20,38]],"fixture":[[20,10,"inactive-beacon-control"],[9,27,"dry-basin-charts"],[38,27,"unlit-direction-lantern"],[21,38,"quay-registry"]],"rooms":["sand-lantern-beacon-core","sunset-quay-ledger","eastern-watch-log","rear-boat-register"]},{"cat":"fishing-lodge","biome":"snow","size":"large","index":4,"title":"Rimewater Switchback Ice Fisheries Lodge","w":49,"d":49,"h":26,"program":"Snow harbor switchback with an elevated drying hall, separate icehouse, supported cutting gallery, dry wood walkway and disconnected-looking but reachable covered store","parts":[[5,2,20,16],[14,10,32,21],[25,16,44,29],[3,25,19,42],[16,32,40,45],[14,20,18,38],[17,27,30,34]],"roofs":[[5,2,20,16,11,"west-boat-gable"],[14,10,32,21,15,"high-ice-drying-ridge"],[25,16,44,29,9,"east-net-loft"],[3,25,19,42,17,"deep-snow-icehouse"],[16,32,40,45,12,"rear-skiff-return"],[14,20,18,38,13,"west-ice-bridge"],[17,27,30,34,14,"right-return-truss"]],"windows":[[7,2],[18,2],[44,21],[3,30],[10,42],[34,45]],"entrances":[[12,2],[18,14],[30,20],[17,34],[26,38],[37,44]],"posts":[[11,7],[22,16],[37,23],[9,34],[25,38],[35,41]],"fixture":[[11,11,"empty-boat-shed"],[23,16,"idle-net-rack"],[35,23,"fishery-account-shelf"],[12,35,"nonrefrigerated-ice-cell"]],"rooms":["skiff-arrival-house","high-net-drying-hall","east-pond-lookout","low-ice-storage"]},{"cat":"bathhouse","biome":"enchanted-forest","size":"large","index":4,"title":"Moonroot Crescent Spring Court","w":49,"d":47,"h":27,"program":"Enchanted crescent baths with genuinely absent courtyard foundation, two long asymmetrical dry-water wings, cedar bath hall and a high stargazing annex; no liquid or healing gameplay","parts":[[10,2,36,11],[4,9,18,31],[30,9,44,30],[8,28,39,43],[16,23,30,36],[39,23,47,39],[2,29,12,41]],"roofs":[[10,2,36,11,12,"northern-cedar-arcade"],[4,9,18,31,10,"west-bath-hip"],[30,9,44,30,18,"moon-observation-vault"],[8,28,39,43,11,"south-basin-triple-gable"],[16,23,30,36,15,"central-return-ridge"],[39,23,47,39,16,"eastern-moon-deck"],[2,29,12,41,10,"western-root-therapy-cloister"]],"windows":[[13,2],[32,2],[4,19],[44,20],[13,43],[35,43]],"entrances":[[23,2],[14,11],[33,11],[16,30],[33,31],[23,40]],"posts":[[18,7],[29,7],[9,21],[37,20],[18,37],[32,38],[43,34],[7,35]],"fixture":[[14,7,"changing-benches"],[8,21,"empty-west-basin"],[36,20,"stargazing-stone"],[23,37,"dry-moonpool"],[44,35,"sky-lantern-not-lit"],[6,37,"dry-root-remedy-table"]],"rooms":["cedar-changing-portico","western-dry-springs","eastern-moonvault","southern-sauna-hall"]}];

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
  if(!top||!has(x,z))throw Error('Wave2 floating support '+s.title+' '+key(x,z));
  b.support(x,z,top-1,s.biome==='desert'?'live:stone':'live:wood','wave2-physical-source-bearing-column');
 }
 for(const [x,z] of s.windows){
  if(!has(x,z))throw Error('Wave2 window outside footprint '+key(x,z));
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
  if(!has(x,z))throw Error('Wave2 portal outside source envelope '+s.title+' '+key(x,z));
  b.opening(x,z);
  b.portal(i===0?'outside':s.rooms[(i-1)%4],s.rooms[i%4],x,z);
 }
 return b.finish(s.program,{
  sourceAuthor:'Roadmap B Wave2 individually authored site-specific geometry',
  isolatedStaging:true,liveIntegration:false,worldPlacement:false,
  schema1Writes:false,creatorArtAccepted:false,physicalPackFamilyAABBApproved:false,
  outlineRectangles:s.parts,roofMassCount:s.roofs.length,previousBlueprintsPreserved:true
 });
}
export function getRoadmapBWave2B1(){return SPECS.map(build);}
export const ROADMAP_B_WAVE2_B1_IDS=Object.freeze(SPECS.map(x=>
 ['r1',x.cat,x.biome,x.size,String(x.index).padStart(3,'0')].join(':')));
