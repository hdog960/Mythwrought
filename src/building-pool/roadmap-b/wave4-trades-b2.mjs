// Roadmap B Wave4 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"temple","biome":"mountain","size":"medium","v":5,"title":"Basalt Hymn Split-Sanctum","w":44,"d":47,"h":29,"parts":[[11,2,30,12],[3,9,17,32],[26,10,40,30],[9,28,34,43],[16,16,29,35],[34,24,42,39],[2,34,13,45]],"roofs":[[11,2,30,12,13,"w4-temple-mountain-north-arched-doorway"],[3,9,17,32,10,"w4-temple-mountain-west-raised-wing"],[26,10,40,30,20,"w4-temple-mountain-east-faceted-tower"],[9,28,34,43,12,"w4-temple-mountain-rear-deep-hall"],[16,16,29,35,17,"w4-temple-mountain-mid-ridge-return"],[34,24,42,39,9,"w4-temple-mountain-outer-courtyard-fork"],[2,34,13,45,16,"w4-temple-mountain-west-pilgrim-stair"]],"entry":[20,2],"doors":[[10,20],[33,20],[21,35],[22,25],[38,31]],"windows":[[13,2],[28,2],[3,20],[40,20],[5,45],[32,43]],"supports":[[13,4],[5,11],[28,12],[11,30],[18,18],[36,26],[4,36]],"fixtures":[[15,6,"w4-temple-record-shelf"],[7,13,"w4-temple-dry-worktable"],[30,14,"w4-temple-inactive-fixture"],[7,40,"silent-pilgrim-log"]],"uses":["ceremonial-space","altar","public-circulation","public-circulation"],"program":"High mountain shrine around two nonfunctioning ceremonial galleries, no boss or altar gameplay, central split-stone ritual nave and west pilgrims' entry"},{"cat":"butcher","biome":"snow","size":"medium","v":4,"title":"Palecreek Ice-Smoke Provision Yard","w":42,"d":44,"h":27,"parts":[[7,2,26,12],[2,10,15,29],[24,9,37,30],[8,25,32,41],[12,16,27,34],[29,27,39,40],[32,31,40,43]],"roofs":[[7,2,26,12,12,"w4-butcher-snow-north-arched-doorway"],[2,10,15,29,16,"w4-butcher-snow-west-raised-wing"],[24,9,37,30,9,"w4-butcher-snow-east-faceted-tower"],[8,25,32,41,13,"w4-butcher-snow-rear-deep-hall"],[12,16,27,34,19,"w4-butcher-snow-mid-ridge-return"],[29,27,39,40,11,"w4-butcher-snow-outer-courtyard-fork"],[32,31,40,43,18,"w4-butcher-snow-eastern-hanging-annex"]],"entry":[16,2],"doors":[[8,19],[30,19],[20,33],[19,25],[34,33]],"windows":[[9,2],[24,2],[2,19],[37,19],[10,41],[30,41]],"supports":[[9,4],[4,12],[26,11],[10,27],[14,18],[31,29],[34,34]],"fixtures":[[11,6,"w4-butcher-record-shelf"],[6,14,"w4-butcher-dry-worktable"],[28,13,"w4-butcher-inactive-fixture"],[36,38,"unpowered-smoke-shelf"]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"],"program":"Snow butcher trading hall with an unpowered cold pan, high west curing gallery and multiple service rooms around an irregular thawing court"},{"cat":"jeweler","biome":"desert","size":"small","v":4,"title":"Saffron Lattice Jewel Workshop","w":38,"d":41,"h":24,"parts":[[8,2,24,11],[2,9,14,28],[21,9,34,26],[9,23,28,37],[14,14,24,30]],"roofs":[[8,2,24,11,11,"w4-jeweler-desert-north-arched-doorway"],[2,9,14,28,15,"w4-jeweler-desert-west-raised-wing"],[21,9,34,26,9,"w4-jeweler-desert-east-faceted-tower"],[9,23,28,37,14,"w4-jeweler-desert-rear-deep-hall"],[14,14,24,30,18,"w4-jeweler-desert-mid-ridge-return"]],"entry":[16,2],"doors":[[8,18],[27,17],[18,30],[19,22]],"windows":[[10,2],[22,2],[2,18],[34,17],[11,37],[26,37]],"supports":[[10,4],[4,11],[23,11],[11,25],[16,16]],"fixtures":[[12,6,"w4-jeweler-record-shelf"],[6,13,"w4-jeweler-dry-worktable"],[25,13,"w4-jeweler-inactive-fixture"]],"uses":["sales-floor","service-counter","jewelry-display","secure-workroom"],"program":"Low desert gemstone atelier with tall east faceting tower, undercut west customer window and raised rear locked display ledger"},{"cat":"bookshop","biome":"enchanted-forest","size":"small","v":4,"title":"Willowcrypt Lantern Folio Den","w":39,"d":43,"h":25,"parts":[[7,2,28,12],[2,11,14,27],[24,9,36,33],[8,25,29,39],[12,16,28,31]],"roofs":[[7,2,28,12,13,"w4-bookshop-enchanted-forest-north-arched-doorway"],[2,11,14,27,9,"w4-bookshop-enchanted-forest-west-raised-wing"],[24,9,36,33,17,"w4-bookshop-enchanted-forest-east-faceted-tower"],[8,25,29,39,12,"w4-bookshop-enchanted-forest-rear-deep-hall"],[12,16,28,31,15,"w4-bookshop-enchanted-forest-mid-ridge-return"]],"entry":[17,2],"doors":[[8,19],[30,21],[18,32],[20,23]],"windows":[[9,2],[26,2],[2,19],[36,21],[10,39],[27,39]],"supports":[[9,4],[4,13],[26,11],[10,27],[14,18]],"fixtures":[[11,6,"w4-bookshop-record-shelf"],[6,15,"w4-bookshop-dry-worktable"],[28,13,"w4-bookshop-inactive-fixture"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"program":"Enchanted cedar folio den with paired lantern-free reading alcoves, west shadow shelves, east high roofstack, no writing/crafting mechanics"}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave4 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave4 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave4 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave4-facade-glazing'});
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
export function getRoadmapBWave4B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE4_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
