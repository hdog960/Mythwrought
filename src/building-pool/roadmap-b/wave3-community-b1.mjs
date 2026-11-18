// Original, isolated Roadmap B Wave3 community architecture. No production registration.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
const SPECS=[{"cat":"greenhouse","biome":"mountain","size":"large","index":4,"title":"Quartzfall Terraced Cloudglass Arboretum","w":52,"d":52,"h":30,"parts":[[4,2,35,11],[30,10,45,25],[11,9,23,34],[2,27,21,45],[17,38,45,49],[27,24,35,40]],"roofs":[[4,2,35,11,10,"greenhouse-mountain-independent-roof-tower"],[30,10,45,25,16,"greenhouse-mountain-independent-roof-fork"],[11,9,23,34,13,"greenhouse-mountain-independent-roof-gallery"],[2,27,21,45,11,"greenhouse-mountain-independent-roof-lobe"],[17,38,45,49,20,"greenhouse-mountain-independent-roof-atrium"],[27,24,35,40,14,"greenhouse-mountain-independent-roof-return"]],"windows":[[5,2],[34,2],[11,12],[21,42],[20,49],[42,49]],"entrances":[[19,2],[37,17],[17,21],[11,36],[31,43],[31,32]],"posts":[[7,5],[33,13],[14,12],[5,30],[20,41],[30,27]],"fixture":[[9,7,"greenhouse-original-survey-desk"],[35,15,"greenhouse-original-unlit-marker"],[16,14,"greenhouse-original-no-gameplay-fixture"],[7,32,"greenhouse-original-source-ledger"]],"rooms":["research-vestibule","alpine-strata-nursery","western-seed-terraces","southern-observation-hall"],"program":"Alpine seed nursery, terraced cloudglass wings, high rear observation deck"},{"cat":"harbor-office","biome":"snow","size":"medium","index":4,"title":"Rimehaven Crooked Pier Registry","w":43,"d":47,"h":27,"parts":[[6,2,27,13],[20,10,35,27],[3,20,22,40],[17,32,39,44],[11,14,20,35],[32,17,41,32]],"roofs":[[6,2,27,13,10,"harbor-office-snow-independent-roof-tower"],[20,10,35,27,13,"harbor-office-snow-independent-roof-fork"],[3,20,22,40,16,"harbor-office-snow-independent-roof-gallery"],[17,32,39,44,11,"harbor-office-snow-independent-roof-lobe"],[11,14,20,35,18,"harbor-office-snow-independent-roof-atrium"],[32,17,41,32,9,"harbor-office-snow-independent-roof-return"]],"windows":[[7,2],[26,2],[3,23],[39,41],[14,35],[17,35]],"entrances":[[16,2],[27,18],[12,30],[28,38],[15,24],[36,24]],"posts":[[9,5],[23,13],[6,23],[20,35],[14,17],[35,20]],"fixture":[[11,7,"harbor-office-original-survey-desk"],[25,15,"harbor-office-original-unlit-marker"],[8,25,"harbor-office-original-no-gameplay-fixture"],[22,37,"harbor-office-original-source-ledger"]],"rooms":["river-permit-counter","eastern-quay-records","western-frost-ledger","rear-ship-registry"],"program":"Snowbound river office with split quay log halls and staggered rear chart archive"},{"cat":"farm-barn","biome":"enchanted-forest","size":"medium","index":4,"title":"Morrowmoss Split-Trough Fieldhall","w":45,"d":50,"h":26,"parts":[[8,2,30,12],[2,10,15,32],[27,9,42,28],[11,24,32,40],[4,35,23,47],[26,36,41,46]],"roofs":[[8,2,30,12,10,"farm-barn-enchanted-forest-independent-roof-tower"],[2,10,15,32,16,"farm-barn-enchanted-forest-independent-roof-fork"],[27,9,42,28,9,"farm-barn-enchanted-forest-independent-roof-gallery"],[11,24,32,40,13,"farm-barn-enchanted-forest-independent-roof-lobe"],[4,35,23,47,18,"farm-barn-enchanted-forest-independent-roof-atrium"],[26,36,41,46,11,"farm-barn-enchanted-forest-independent-roof-return"]],"windows":[[9,2],[29,2],[27,12],[32,37],[7,47],[20,47]],"entrances":[[19,2],[8,21],[34,18],[21,32],[13,41],[33,41]],"posts":[[11,5],[5,13],[30,12],[14,27],[7,38],[29,39]],"fixture":[[13,7,"farm-barn-original-survey-desk"],[7,15,"farm-barn-original-unlit-marker"],[32,14,"farm-barn-original-no-gameplay-fixture"],[16,29,"farm-barn-original-source-ledger"]],"rooms":["northern-threshing-entry","western-drying-loft","eastern-seedhouse","southern-crop-archive"],"program":"Uneven enchanted forest fieldhall with deep central crop corridor and separate west drying loft"},{"cat":"lighthouse","biome":"temperate","size":"large","index":4,"title":"Tidemark Forked Tidewatch Lighthouse","w":50,"d":50,"h":31,"parts":[[13,2,28,21],[5,10,37,16],[2,16,15,36],[30,14,47,40],[14,29,36,47],[8,34,25,43]],"roofs":[[13,2,28,21,22,"lighthouse-temperate-independent-roof-tower"],[5,10,37,16,10,"lighthouse-temperate-independent-roof-fork"],[2,16,15,36,15,"lighthouse-temperate-independent-roof-gallery"],[30,14,47,40,11,"lighthouse-temperate-independent-roof-lobe"],[14,29,36,47,17,"lighthouse-temperate-independent-roof-atrium"],[8,34,25,43,9,"lighthouse-temperate-independent-roof-return"]],"windows":[[14,2],[27,2],[2,19],[47,37],[17,47],[33,47]],"entrances":[[20,2],[21,13],[8,26],[38,27],[25,38],[16,38]],"posts":[[16,5],[8,13],[5,19],[33,17],[17,32],[11,37]],"fixture":[[18,7,"lighthouse-original-survey-desk"],[10,15,"lighthouse-original-unlit-marker"],[7,21,"lighthouse-original-no-gameplay-fixture"],[35,19,"lighthouse-original-source-ledger"]],"rooms":["north-signal-tower","western-water-ledger","eastern-boathouse-watch","southern-charter-room"],"program":"Temperate signal tower joining three forked pier wings, waterfront records and an asymmetric rear quay"}];

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
  if(!top||!has(x,z))throw Error('Wave3 floating support '+s.title+' '+key(x,z));
  b.support(x,z,top-1,s.biome==='desert'?'live:stone':'live:wood','wave3-physical-source-bearing-column');
 }
 for(const [x,z] of s.windows){
  if(!has(x,z))throw Error('Wave3 window outside footprint '+key(x,z));
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
  if(!has(x,z))throw Error('Wave3 portal outside source envelope '+s.title+' '+key(x,z));
  b.opening(x,z);
  b.portal(i===0?'outside':s.rooms[(i-1)%4],s.rooms[i%4],x,z);
 }
 return b.finish(s.program,{
  sourceAuthor:'Roadmap B Wave3 individually authored site-specific geometry',
  isolatedStaging:true,liveIntegration:false,worldPlacement:false,
  schema1Writes:false,creatorArtAccepted:false,physicalPackFamilyAABBApproved:false,
  outlineRectangles:s.parts,roofMassCount:s.roofs.length,previousBlueprintsPreserved:true
 });
}
export function getRoadmapBWave3B1(){return SPECS.map(build);}
export const ROADMAP_B_WAVE3_B1_IDS=Object.freeze(SPECS.map(x=>
 ['r1',x.cat,x.biome,x.size,String(x.index).padStart(3,'0')].join(':')));
