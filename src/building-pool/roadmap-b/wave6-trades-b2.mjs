// Roadmap B Wave6 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"market-square","biome":"snow","size":"medium","v":4,"title":"Rimeglass Crosswind Market Forum","w":49,"d":50,"h":30,"parts":[[7,2,40,9],[7,9,15,37],[34,9,42,24],[11,32,37,40],[25,20,42,28],[2,38,22,47],[27,38,45,47],[19,9,29,16],[17,27,25,36]],"heights":[12,18,9,16,21,12],"program":"Rimeglass: an original open-sky zigzag snow market, long raised north crossbeam, visibly missing central court, narrow west shopping arcade, detached-feeling eastern stalls linked by a true standing walkway, two independent rear loading lodges; no active vendor AI.","uses":["square","vendor-stalls","public-circulation","vendor-stalls"],"roofs":[[7,2,40,9,11,"rimeglass-wave6-independent-front-crossbeam"],[7,9,15,37,16,"rimeglass-wave6-independent-west-arcade"],[34,9,42,24,19,"rimeglass-wave6-independent-east-watch"],[11,32,37,40,14,"rimeglass-wave6-independent-southern-trade-hall"],[25,20,42,28,10,"rimeglass-wave6-independent-east-vendor-crescent"],[2,38,22,47,21,"rimeglass-wave6-independent-southwest-depot"],[27,38,45,47,13,"rimeglass-wave6-independent-southeast-cargo"],[19,9,29,16,18,"rimeglass-wave6-independent-central-ticket-bridge"],[17,27,25,36,12,"rimeglass-wave6-independent-western-courtyard-gate"]],"windows":[[13,2],[36,2],[7,21],[42,21],[13,47],[37,47]],"entry":[23,2],"doors":[[11,23],[38,16],[24,36],[33,24],[12,42],[36,42],[24,12],[21,31]],"supports":[[9,4],[9,11],[36,11],[13,34],[27,22],[4,40],[29,40],[21,11],[19,29]],"fixtures":[[10,5,"rimeglass-market-wave6-static-0"],[10,12,"rimeglass-market-wave6-static-1"],[37,12,"rimeglass-market-wave6-static-2"]]},{"cat":"tailor","biome":"mountain","size":"large","v":4,"title":"Needlepeak Seven-Loom Tailors' Terrace","w":53,"d":51,"h":32,"parts":[[8,2,32,12],[2,10,16,33],[26,11,46,37],[13,28,39,47],[2,38,21,49],[41,3,51,17],[38,36,50,48]],"heights":[13,10,23,17,11,19,15],"program":"Mountain tailors' hall with a high northeast loom tower, distinct weft archive, west public fitting gallery and long rear workshop; static cloth, no crafting.","uses":["sales-floor","service-counter","garment-display","fitting-area"],"roofs":[[8,2,32,12,13,"tailor-mountain-wave6-front-civic-ridge"],[2,10,16,33,10,"tailor-mountain-wave6-west-annex"],[26,11,46,37,23,"tailor-mountain-wave6-east-jewel-tower"],[13,28,39,47,17,"tailor-mountain-wave6-rear-main-hall"],[2,38,21,49,11,"tailor-mountain-wave6-deep-west-corridor"],[41,3,51,17,19,"tailor-mountain-wave6-east-service-loft"],[38,36,50,48,15,"tailor-mountain-wave6-extra-spur"]],"windows":[[11,2],[29,2],[2,21],[46,24],[16,49],[36,47]],"entry":[20,2],"doors":[[9,21],[36,24],[26,37],[11,43],[46,10],[44,42]],"supports":[[10,5],[4,13],[28,14],[15,31],[4,41],[43,6],[40,39]],"fixtures":[[11,6,"wave6-tailor-public-sign"],[5,14,"wave6-tailor-static-tool"],[29,15,"wave6-tailor-unlit-lamp"],[16,32,"wave6-tailor-archive-ledger"]]},{"cat":"bookshop","biome":"temperate","size":"medium","v":4,"title":"Oakwater Split-Stack Book Curia","w":45,"d":48,"h":29,"parts":[[9,2,28,13],[3,11,17,33],[22,10,41,27],[11,25,34,43],[2,35,21,46],[32,30,43,45],[33,2,41,12]],"heights":[12,21,10,16,13,19,10],"program":"Temperate manuscript curia with a braided west reading room, eastern two-height stacks, rear public learning annex and separate northern paper archive.","uses":["sales-floor","service-counter","bookshelves","reading-area"],"roofs":[[9,2,28,13,12,"bookshop-temperate-wave6-front-civic-ridge"],[3,11,17,33,21,"bookshop-temperate-wave6-west-annex"],[22,10,41,27,10,"bookshop-temperate-wave6-east-jewel-tower"],[11,25,34,43,16,"bookshop-temperate-wave6-rear-main-hall"],[2,35,21,46,13,"bookshop-temperate-wave6-deep-west-corridor"],[32,30,43,45,19,"bookshop-temperate-wave6-east-service-loft"],[33,2,41,12,10,"bookshop-temperate-wave6-extra-spur"]],"windows":[[12,2],[25,2],[3,22],[41,18],[14,46],[31,43]],"entry":[18,2],"doors":[[10,22],[31,18],[22,34],[11,40],[37,37],[37,7]],"supports":[[11,5],[5,14],[24,13],[13,28],[4,38],[34,33],[35,5]],"fixtures":[[12,6,"wave6-bookshop-public-sign"],[6,15,"wave6-bookshop-static-tool"],[25,14,"wave6-bookshop-unlit-lamp"],[14,29,"wave6-bookshop-archive-ledger"]]},{"cat":"jeweler","biome":"snow","size":"large","v":4,"title":"Hailstone Prismatic Jewelsmith Hall","w":54,"d":53,"h":33,"parts":[[14,2,38,12],[2,10,20,35],[31,9,51,31],[10,28,43,45],[4,38,21,50],[33,39,51,50],[40,2,52,16]],"heights":[12,9,24,15,19,12,18],"program":"Snow jewelry atelier with a tall east faceting vault, independent west gem-checking mezzanine, two long backstore wings and dry crystalline window bays.","uses":["sales-floor","service-counter","jewelry-display","secure-workroom"],"roofs":[[14,2,38,12,12,"jeweler-snow-wave6-front-civic-ridge"],[2,10,20,35,9,"jeweler-snow-wave6-west-annex"],[31,9,51,31,24,"jeweler-snow-wave6-east-jewel-tower"],[10,28,43,45,15,"jeweler-snow-wave6-rear-main-hall"],[4,38,21,50,19,"jeweler-snow-wave6-deep-west-corridor"],[33,39,51,50,12,"jeweler-snow-wave6-east-service-loft"],[40,2,52,16,18,"jeweler-snow-wave6-extra-spur"]],"windows":[[17,2],[35,2],[2,22],[51,20],[13,50],[40,50]],"entry":[26,2],"doors":[[11,22],[41,20],[26,36],[12,44],[42,44],[46,9]],"supports":[[16,5],[4,13],[33,12],[12,31],[6,41],[35,42],[42,5]],"fixtures":[[17,6,"wave6-jeweler-public-sign"],[5,14,"wave6-jeweler-static-tool"],[34,13,"wave6-jeweler-unlit-lamp"],[13,32,"wave6-jeweler-archive-ledger"]]}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave6 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave6 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave6 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave6-facade-glazing'});
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
export function getRoadmapBWave6B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE6_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
