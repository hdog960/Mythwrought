// Roadmap B Wave7 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"market-square","biome":"temperate","size":"small","v":4,"title":"Briarford Nine-Arcade Village Exchange","w":44,"d":47,"h":28,"parts":[[10,2,30,11],[3,9,16,29],[25,10,40,27],[2,33,19,44],[30,29,41,44],[16,14,29,29],[11,25,18,41],[18,36,34,42],[2,2,10,23]],"roofs":[[10,2,30,11,12,"wave7-market-square-temperate-north-ticket-ridge"],[3,9,16,29,18,"wave7-market-square-temperate-west-monument"],[25,10,40,27,9,"wave7-market-square-temperate-east-tall-stack"],[2,33,19,44,21,"wave7-market-square-temperate-southwest-return"],[30,29,41,44,11,"wave7-market-square-temperate-southeast-yard"],[16,14,29,29,17,"wave7-market-square-temperate-internal-crosslink"],[11,25,18,41,17,"wave7-original-market-square-covered-courtyard-arm-0"],[18,36,34,42,12,"wave7-original-market-square-covered-courtyard-arm-1"],[2,2,10,23,17,"wave7-original-market-west-orchard-entrance-arcade"]],"entry":[20,2],"doors":[[9,19],[32,18],[10,38],[35,36],[22,21],[14,33],[26,39],[6,12]],"windows":[[13,2],[27,2],[2,19],[40,18],[15,44],[29,42]],"supports":[[12,4],[5,11],[27,12],[4,35],[32,31],[18,16],[13,27],[20,38],[4,4]],"fixtures":[[13,5,"wave7-market-square-unpowered-cashbox"],[5,14,"wave7-market-square-static-guild-sign-relocated-to-dry-side-counter"],[28,13,"wave7-market-square-record-cabinet"],[14,28,"wave7-market-square-dry-vendor-display"],[14,28,"wave7-static-market-square-covered-courtyard-arm-0"],[21,39,"wave7-static-market-square-covered-courtyard-arm-1"],[5,5,"wave7-static-market-west-orchard-entrance-arcade"]],"uses":["square","vendor-stalls","public-circulation","vendor-stalls"],"program":"Temperate farmers' courtyard market with nine vendor arches, actual open missing-ground center, independent west orchard stall, east grain sheds and split south counting halls; no citizens or active trading."},{"cat":"theater","biome":"mountain","size":"large","v":3,"title":"Thundershelf Three-Tier Stone Playhouse","w":56,"d":57,"h":34,"parts":[[15,2,39,13],[3,12,20,36],[32,10,50,32],[3,39,21,52],[37,36,51,53],[22,15,37,34],[46,2,53,17],[10,28,23,48],[34,29,44,49],[21,44,38,51]],"roofs":[[15,2,39,13,13,"wave7-theater-mountain-north-ticket-ridge"],[3,12,20,36,10,"wave7-theater-mountain-west-monument"],[32,10,50,32,25,"wave7-theater-mountain-east-tall-stack"],[3,39,21,52,21,"wave7-theater-mountain-southwest-return"],[37,36,51,53,12,"wave7-theater-mountain-southeast-yard"],[22,15,37,34,19,"wave7-theater-mountain-internal-crosslink"],[46,2,53,17,15,"wave7-theater-mountain-northeast-offset-tower"],[10,28,23,48,17,"wave7-original-theater-covered-courtyard-arm-0"],[34,29,44,49,12,"wave7-original-theater-covered-courtyard-arm-1"],[21,44,38,51,15,"wave7-original-theater-covered-courtyard-arm-2"]],"entry":[27,2],"doors":[[11,24],[41,21],[12,45],[44,44],[29,24],[49,9],[16,38],[39,39],[29,47]],"windows":[[18,2],[36,2],[3,24],[50,21],[14,52],[36,51]],"supports":[[17,4],[5,14],[34,12],[5,41],[39,38],[24,17],[48,4],[12,30],[36,31],[23,46]],"fixtures":[[18,5,"wave7-theater-unpowered-cashbox"],[6,15,"wave7-theater-static-guild-sign"],[35,13,"wave7-theater-record-cabinet"],[13,31,"wave7-theater-dry-vendor-display"],[13,31,"wave7-static-theater-covered-courtyard-arm-0"],[37,32,"wave7-static-theater-covered-courtyard-arm-1"],[24,47,"wave7-static-theater-covered-courtyard-arm-2"]],"uses":["public-circulation","audience-area","stage","backstage"],"program":"Mountain amphitheater with a real covered audience floor, a much taller east performance colonnade, sloped western stone foyer, paired isolated-looking but connected costume wings and narrow rear staircase; no actors."},{"cat":"tailor","biome":"enchanted-forest","size":"medium","v":4,"title":"Bramblelace Whisperloom Tailoring Guild","w":49,"d":51,"h":31,"parts":[[7,2,33,13],[2,11,17,33],[30,9,43,34],[13,26,36,44],[4,36,21,48],[34,32,45,48],[21,12,32,29],[2,2,9,33],[40,15,48,45],[2,39,17,50]],"roofs":[[7,2,33,13,13,"wave7-tailor-enchanted-forest-north-ticket-ridge"],[2,11,17,33,19,"wave7-tailor-enchanted-forest-west-monument"],[30,9,43,34,10,"wave7-tailor-enchanted-forest-east-tall-stack"],[13,26,36,44,17,"wave7-tailor-enchanted-forest-deep-central-hall"],[4,36,21,48,23,"wave7-tailor-enchanted-forest-southwest-return"],[34,32,45,48,11,"wave7-tailor-enchanted-forest-southeast-yard"],[21,12,32,29,15,"wave7-tailor-enchanted-forest-internal-crosslink"],[2,2,9,33,18,"wave7-original-forest-tailor-west-branch-arcade"],[40,15,48,45,14,"wave7-original-forest-tailor-east-cutting-wing"],[2,39,17,50,21,"wave7-original-forest-tailor-back-cloak-gallery"]],"entry":[20,2],"doors":[[9,22],[36,21],[24,35],[12,42],[39,40],[26,20],[5,17],[44,30],[9,44]],"windows":[[10,2],[30,2],[2,22],[48,21],[18,48],[32,44]],"supports":[[9,4],[4,13],[32,11],[15,28],[6,38],[36,34],[23,14],[4,4],[42,17],[4,41]],"fixtures":[[10,5,"wave7-tailor-unpowered-cashbox"],[5,14,"wave7-tailor-static-guild-sign"],[33,12,"wave7-tailor-record-cabinet"],[16,29,"wave7-tailor-dry-vendor-display"],[5,5,"wave7-static-forest-tailor-west-branch-arcade"],[43,18,"wave7-static-forest-tailor-east-cutting-wing"],[5,42,"wave7-static-forest-tailor-back-cloak-gallery"]],"uses":["sales-floor","service-counter","garment-display","fitting-area"],"program":"Enchanted forest textile guild with long northwest shade-loom hall, asymmetric east raised cutting room, two back cloak vaults and open center weaving yard; no crafting or animated fabric."},{"cat":"bookshop","biome":"snow","size":"large","v":4,"title":"Frostfolio Split-Gable Record Library","w":54,"d":55,"h":34,"parts":[[14,2,39,13],[3,12,20,36],[39,12,49,36],[2,41,21,53],[39,37,51,52],[22,15,34,35],[47,2,52,17],[11,31,22,49],[35,33,43,50],[21,44,37,51],[2,2,14,34],[45,2,53,29],[2,28,13,47]],"roofs":[[14,2,39,13,12,"wave7-bookshop-snow-north-ticket-ridge"],[3,12,20,36,23,"wave7-bookshop-snow-west-monument"],[39,12,49,36,9,"wave7-frostfolio-long-thin-eastern-gabled-records"],[2,41,21,53,19,"wave7-bookshop-snow-southwest-return"],[39,37,51,52,13,"wave7-bookshop-snow-southeast-yard"],[22,15,34,35,16,"wave7-bookshop-snow-internal-crosslink"],[47,2,52,17,11,"wave7-bookshop-snow-northeast-offset-tower"],[11,31,22,49,17,"wave7-original-bookshop-covered-courtyard-arm-0"],[35,33,43,50,12,"wave7-original-bookshop-covered-courtyard-arm-1"],[21,44,37,51,15,"wave7-original-bookshop-covered-courtyard-arm-2"],[2,2,14,34,20,"wave7-original-snow-folio-northwest-cathedral-stack"],[45,2,53,29,12,"wave7-original-snow-folio-northeast-side-entry"],[2,28,13,47,19,"wave7-frostfolio-west-backglazed-reading-wing"]],"entry":[26,2],"doors":[[11,24],[44,24],[11,47],[45,44],[28,25],[49,9],[16,40],[39,41],[29,47],[8,18],[49,15],[7,37]],"windows":[[17,2],[36,2],[2,24],[53,24],[15,53],[38,50]],"supports":[[16,4],[5,14],[41,14],[4,43],[41,39],[24,17],[49,4],[13,33],[37,35],[23,46],[4,4],[47,4],[4,30]],"fixtures":[[17,5,"wave7-bookshop-unpowered-cashbox"],[6,15,"wave7-bookshop-static-guild-sign"],[33,15,"wave7-bookshop-record-cabinet"],[14,34,"wave7-bookshop-dry-vendor-display"],[14,34,"wave7-static-bookshop-covered-courtyard-arm-0"],[38,36,"wave7-static-bookshop-covered-courtyard-arm-1"],[24,47,"wave7-static-bookshop-covered-courtyard-arm-2"],[5,5,"wave7-static-snow-folio-northwest-cathedral-stack"],[48,5,"wave7-static-snow-folio-northeast-side-entry"],[5,33,"unpowered-folio-side-access"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"program":"Snow-covered public manuscript library with an exceptionally tall west catalogue wing, low eastern paper counting hall, long warm rear reading gallery, unusual crossed spines and protected side ice records; no text generation gameplay."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave7 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
  occupied.set(k(x,y,z),{x,y,z,kind,material,...extras});
 };
 for(const [x0,z0,x1,z1] of s.parts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.add(g(x,z));
 const inside=(x,z)=>mask.has(g(x,z));
 for(const coord of mask){
  const [x,z]=coord.split(',').map(Number);
  put(x,0,z,'foundation',P.stone,{sourceActual:true});
  put(x,1,z,'floor',P.wood,{sourceActual:true});
  if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!inside(x+dx,z+dz)))
   for(let y=2;y<=7;y++)put(x,y,z,'wall',P.beam,{purpose:'weather-sealed-exterior-source'});
 }
 for(const [x0,z0,x1,z1,base,profile] of s.roofs)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!inside(x,z)||roofMap.has(g(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/4);
   roofMap.set(g(x,z),y);
   put(x,y,z,'roof',s.biome==='snow'?'pack3:025':s.biome==='desert'?'pack3:023':'pack3:026',
    {roofProfile:profile,physicalProducerUnverified:true});
  }
 const postEvidence=[];
 for(const [x,z] of s.supports){
  const top=roofMap.get(g(x,z));
  if(!top||!inside(x,z))throw Error('Unsupported source post '+s.title+' '+g(x,z));
  let added=0;
  for(let y=2;y<top;y++)if(!occupied.has(k(x,y,z))){put(x,y,z,'wall',P.stone,{purpose:'true-grounded-bearing-post'});added++;}
  postEvidence.push({x,z,roofHeight:top,added});
 }
 // Physical partitions define separately navigable rooms without fake graph-only dividers.
 for(const [axis,n,a,b,doors] of (
  s.cat==='theater'?[['z',13,13,30,[15,16,22,23,29,30]],['z',32,13,37,[15,16,29,30]]]:
  [['z',13,8,37,[12,13,20,21,32,33]],['z',35,11,40,[16,17,31,32]]]
 )){
  for(let v=a;v<=b;v++){
   const x=axis==='z'?v:n,z=axis==='z'?n:v;
   if(!inside(x,z)||doors.includes(v))continue;
   for(let y=2;y<=4;y++)if(!occupied.has(k(x,y,z)))put(x,y,z,'wall',P.beam,{purpose:'independent-room-partition'});
  }
 }
 const holes=[s.entry,...s.doors];
 for(const [x,z] of holes){
  if(!inside(x,z))throw Error('Wave7 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave7 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave7-facade-glazing'});
  windows.push({type:'window',x,y:3,z,material:P.window});
 }
 for(const [x,z,purpose] of s.fixtures)
  if(inside(x,z)&&!occupied.has(k(x,2,z)))put(x,2,z,'fixture',P.fixture,{purpose,noGameplayPower:true});
 for(const [x,z] of [[s.entry[0]-5,8],[s.entry[0]+5,8]])
  if(inside(x,z)&&!occupied.has(k(x,2,z)))put(x,2,z,'decor',P.decor,{purpose:'unlit-navigation-pillar'});
 const sourceCells=[...occupied.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const symbolic=[...new Set([...sourceCells.map(x=>x.material),P.door])].sort();
 const used=s.uses;
 const bp={schema:SCHEMA,id:['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':'),
  title:s.title,category:s.cat,biome:s.biome,size:s.size,variation:s.v,
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:s.w,y:s.h,z:s.d},units:'hand-authored architectural XYZ cells; physical Pack producer family unresolved',
  architecturalSignature:s.program,roof:{form:s.roofs.map(x=>x[5]).join(' / '),biomeSpecific:true},
  rooms:[
   {name:'front trade lobby',uses:[used[0]],bounds:{x0:s.parts[0][0]+1,x1:s.parts[0][2]-1,z0:s.parts[0][1]+1,z1:s.parts[0][3]-1}},
   {name:'western trade wing',uses:[used[1]],bounds:{x0:s.parts[1][0]+1,x1:s.parts[1][2]-1,z0:s.parts[1][1]+1,z1:s.parts[1][3]-1}},
   {name:'eastern workshop',uses:[used[2]],bounds:{x0:s.parts[2][0]+1,x1:s.parts[2][2]-1,z0:s.parts[2][1]+1,z1:s.parts[2][3]-1}},
   {name:'south archive',uses:[used[3]],bounds:{x0:s.parts[3][0]+1,x1:s.parts[3][2]-1,z0:s.parts[3][1]+1,z1:s.parts[3][3]-1}}
  ],
  circulation:[
   {from:'exterior',to:used[0],via:'three-high real northern entrance'},
   {from:used[0],to:used[1],via:'western doorway into enclosed room'},
   {from:used[1],to:used[2],via:'physically supported middle cross-gallery'},
   {from:used[2],to:used[3],via:'rear supported covered annex'}
  ],features:[...used,'literal missing footprints outside strongly irregular walls','inactive amenities'],
  openings:[{type:'entrance',x:s.entry[0],y:2,z:s.entry[1],clearHeightCells:3,doorSymbol:P.door,doorOpenState:'unverified'},
   ...s.doors.map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3})),...windows],
  routeTargets:[{x:s.entry[0],z:s.entry[1],purpose:'street entrance'},...s.doors.map(([x,z],i)=>({x,z,purpose:'public branch '+i}))],
  footprintRectangles:s.parts,sourceSupportAudits:postEvidence,
  unresolvedDependencies:symbolic.map(ref=>({ref,issue:'Producer variant/yaw physical mesh, source-offset, AABB occupancy, window load and schema-1 not certified'})),
  actualIphoneAccepted:false,sourceOriginal:true,worldRegistration:false,voxels:sourceCells
 };
 validateBlueprint(bp);return Object.freeze(bp);
}
export function getRoadmapBWave7B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE7_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
