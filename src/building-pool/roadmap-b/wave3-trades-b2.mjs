// Roadmap B Wave3 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"theater","biome":"enchanted-forest","size":"large","v":3,"title":"Everglow Six-Gallery Sky-Stage","w":51,"d":51,"h":30,"parts":[[9,2,37,12],[3,11,19,33],[29,11,48,38],[15,25,39,47],[3,36,23,48],[36,38,48,48]],"roofs":[[9,2,37,12,11,"theater-enchanted-forest-unique-wave3-mass-high-porch"],[3,11,19,33,14,"theater-enchanted-forest-unique-wave3-mass-west-gable"],[29,11,48,38,20,"theater-enchanted-forest-unique-wave3-mass-east-vault"],[15,25,39,47,12,"theater-enchanted-forest-unique-wave3-mass-deep-gallery"],[3,36,23,48,16,"theater-enchanted-forest-unique-wave3-mass-return-roof"],[36,38,48,48,9,"theater-enchanted-forest-unique-wave3-mass-low-fork"]],"entry":[23,2],"doors":[[11,22],[38,24],[27,36],[13,42],[42,43]],"windows":[[12,2],[34,2],[3,22],[48,24],[6,48],[45,48]],"supports":[[11,4],[5,13],[31,13],[17,27],[5,38],[38,40]],"fixtures":[[13,6,"theater-wave3-source-bench"],[7,15,"theater-wave3-unpowered-fixture"],[33,15,"theater-wave3-no-gameplay-ledger"]],"uses":["public-circulation","audience-area","stage","backstage"],"program":"An original forest theater: sheltered audience loges, an east moon-stage vault, split rear dressing galleries and an open inactive minstrel court"},{"cat":"bookshop","biome":"desert","size":"large","v":4,"title":"Sunchalk Spiral Manuscript Bazaar","w":51,"d":49,"h":28,"parts":[[7,2,36,12],[30,10,47,28],[4,10,18,34],[14,26,38,39],[21,35,48,46],[2,36,16,44]],"roofs":[[7,2,36,12,10,"bookshop-desert-unique-wave3-mass-high-porch"],[30,10,47,28,18,"bookshop-desert-unique-wave3-mass-west-gable"],[4,10,18,34,12,"bookshop-desert-unique-wave3-mass-east-vault"],[14,26,38,39,15,"bookshop-desert-unique-wave3-mass-deep-gallery"],[21,35,48,46,11,"bookshop-desert-unique-wave3-mass-return-roof"],[2,36,16,44,21,"bookshop-desert-unique-wave3-mass-low-fork"]],"entry":[21,2],"doors":[[38,19],[11,22],[26,32],[34,40],[9,40]],"windows":[[10,2],[33,2],[30,19],[18,22],[24,46],[13,44]],"supports":[[9,4],[32,12],[6,12],[16,28],[23,37],[4,38]],"fixtures":[[11,6,"bookshop-wave3-source-bench"],[34,14,"bookshop-wave3-unpowered-fixture"],[8,14,"bookshop-wave3-no-gameplay-ledger"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"program":"Desert folio exchange with a high north wind-baffle, western parchment gallery, eastern book vault, staggered back-stack and physically separated rear reading chapel"},{"cat":"market-square","biome":"mountain","size":"large","v":4,"title":"Cloudspine Humped Ridge Market","w":51,"d":51,"h":30,"parts":[[13,2,38,10],[5,8,20,32],[32,8,48,40],[17,28,41,48],[2,35,18,46],[26,16,35,30]],"roofs":[[13,2,38,10,9,"market-square-mountain-unique-wave3-mass-high-porch"],[5,8,20,32,17,"market-square-mountain-unique-wave3-mass-west-gable"],[32,8,48,40,11,"market-square-mountain-unique-wave3-mass-east-vault"],[17,28,41,48,15,"market-square-mountain-unique-wave3-mass-deep-gallery"],[2,35,18,46,19,"market-square-mountain-unique-wave3-mass-return-roof"],[26,16,35,30,13,"market-square-mountain-unique-wave3-mass-low-fork"]],"entry":[25,2],"doors":[[12,20],[40,24],[29,38],[10,40],[30,23]],"windows":[[16,2],[35,2],[5,20],[48,24],[5,46],[26,27]],"supports":[[15,4],[7,10],[34,10],[19,30],[4,37],[28,18]],"fixtures":[[17,6,"market-square-wave3-source-bench"],[9,12,"market-square-wave3-unpowered-fixture"],[36,12,"market-square-wave3-no-gameplay-ledger"]],"uses":["square","vendor-stalls","public-circulation","vendor-stalls"],"program":"Five-wing mountain trade court around a real missing-ground open center, severe stepped shop roofs, an eastern caravan ledge and a west terrace"},{"cat":"tailor","biome":"snow","size":"medium","v":4,"title":"Palesnow Starfold Weavers' Hall","w":45,"d":49,"h":27,"parts":[[9,2,31,14],[2,10,17,36],[29,12,42,29],[11,25,33,39],[3,36,21,46],[27,34,40,45]],"roofs":[[9,2,31,14,11,"tailor-snow-unique-wave3-mass-high-porch"],[2,10,17,36,19,"tailor-snow-unique-wave3-mass-west-gable"],[29,12,42,29,9,"tailor-snow-unique-wave3-mass-east-vault"],[11,25,33,39,15,"tailor-snow-unique-wave3-mass-deep-gallery"],[3,36,21,46,12,"tailor-snow-unique-wave3-mass-return-roof"],[27,34,40,45,18,"tailor-snow-unique-wave3-mass-low-fork"]],"entry":[20,2],"doors":[[9,23],[35,20],[22,32],[12,41],[33,39]],"windows":[[12,2],[28,2],[2,23],[42,20],[6,46],[37,45]],"supports":[[11,4],[4,12],[31,14],[13,27],[5,38],[29,36]],"fixtures":[[13,6,"tailor-wave3-source-bench"],[6,14,"tailor-wave3-unpowered-fixture"],[33,16,"tailor-wave3-no-gameplay-ledger"]],"uses":["sales-floor","service-counter","garment-display","fitting-area"],"program":"Multi-spur snow workshop with a stepped glazed front fitting counter, west velvet-drying gallery, east long loom room and two sheltered back corridors"}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave3 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave3 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave3 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave3-facade-glazing'});
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
   {name:'public lobby',uses:[used[0]],bounds:{x0:s.entry[0]-7,x1:s.entry[0]+7,z0:3,z1:12}},
   {name:'left workroom',uses:[used[1]],bounds:{x0:4,x1:17,z0:13,z1:31}},
   {name:'right workshop',uses:[used[2]],bounds:{x0:30,x1:42,z0:14,z1:30}},
   {name:'rear annex',uses:[used[3]],bounds:{x0:14,x1:37,z0:33,z1:43}}
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
export function getRoadmapBWave3B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE3_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
