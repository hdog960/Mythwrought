// Roadmap B Wave2 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"jeweler","biome":"mountain","size":"large","v":4,"title":"Stormcrown Veinwright Atelier","w":49,"d":47,"h":29,"program":"Mountain facet-cutting atelier with high eastern stone-vault tower, visible public gem counter, lower western secure workshop and descending rear assay hall","parts":[[7,2,34,13],[2,11,17,38],[27,10,46,31],[12,30,40,44],[15,22,36,33]],"roofs":[[7,2,34,13,11,"public-polished-diamond-entry"],[2,11,17,38,9,"low-west-miners-gallery"],[27,10,46,31,19,"high-east-jewel-vault"],[12,30,40,44,14,"rear-assay-fork"],[15,22,36,33,16,"crossing-glass-ridge"]],"entry":[20,2],"doors":[[13,12],[31,12],[33,30],[21,34],[14,34]],"windows":[[9,2],[32,2],[2,24],[46,21],[18,44],[36,44]],"supports":[[14,7],[30,8],[8,21],[37,21],[23,38],[33,37]],"fixtures":[[11,23,"secure-rough-gem-cabinet"],[37,21,"physical-polishing-bench"],[25,37,"assay-logbook"]],"uses":["sales-floor","service-counter","jewelry-display","secure-workroom"]},{"cat":"market-square","biome":"desert","size":"large","v":4,"title":"Dunewake Windfork Spice Caravan Square","w":49,"d":49,"h":27,"program":"Sunlit desert bazaar with a literal absent central courtyard, independent west fabric stalls, east vaulted spice canopy and rear caravan counting hall","parts":[[6,2,40,13],[2,11,17,39],[29,10,47,31],[10,34,43,46],[12,28,35,37]],"roofs":[[6,2,40,13,10,"desert-open-caravan-portal"],[2,11,17,39,13,"west-shade-galleries"],[29,10,47,31,18,"east-spice-tower"],[10,34,43,46,11,"deep-rear-merchant-hall"],[12,28,35,37,14,"cross-courtyard-trading-bridge"]],"entry":[22,2],"doors":[[12,12],[34,13],[14,36],[32,35],[23,41]],"windows":[[8,2],[37,2],[2,23],[47,19],[14,46],[38,46]],"supports":[[16,7],[31,7],[9,22],[37,21],[18,39],[33,40]],"fixtures":[[9,22,"covered-woven-stall"],[38,19,"inactive-spice-counter"],[23,40,"caravan-weigh-house"]],"uses":["square","vendor-stalls","public-circulation","vendor-stalls"]},{"cat":"theater","biome":"snow","size":"medium","v":3,"title":"Frostmoth Midwinter Tri-Court Playhouse","w":45,"d":48,"h":28,"program":"Enclosed snow playhouse with offset left audience gallery, physically raised unpowered stage, rear costume hall and separate right musician wing","parts":[[12,2,32,13],[3,11,19,36],[28,10,42,35],[12,30,39,45],[15,21,34,32]],"roofs":[[12,2,32,13,12,"low-snow-ticket-arcade"],[3,11,19,36,11,"west-audience-shed"],[28,10,42,35,19,"east-stage-truss"],[12,30,39,45,14,"high-backstage-roof"],[15,21,34,32,16,"central-covered-orchestra"]],"entry":[22,2],"doors":[[15,13],[34,13],[16,32],[33,32],[22,40]],"windows":[[13,2],[31,2],[3,20],[42,24],[16,45],[35,45]],"supports":[[16,7],[28,7],[11,23],[36,21],[19,38],[33,38]],"fixtures":[[11,24,"seating-aisle-marker"],[35,24,"dry-stage-platform"],[24,39,"costume-rail"]],"uses":["public-circulation","audience-area","stage","backstage"]}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave2 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave2 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave2 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave2-facade-glazing'});
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
export function getRoadmapBWave2B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE2_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
