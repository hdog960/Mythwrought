// Roadmap B Wave9 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"bookshop","biome":"mountain","size":"small","v":4,"title":"Skyslate Crooked-Spine Book Repository","w":49,"d":54,"h":36,"parts":[[19,2,36,12],[21,11,31,48],[3,14,25,22],[29,23,46,31],[3,32,23,45],[27,39,46,50],[2,2,12,19],[39,4,46,26],[12,42,34,51]],"voids":[],"roofs":[[19,2,36,12,15,"wave9-bookshop-mountain-architectural-ridge-0-4"],[21,11,31,48,21,"wave9-bookshop-mountain-architectural-ridge-1-4"],[3,14,25,22,17,"wave9-bookshop-mountain-architectural-ridge-2-4"],[29,23,46,31,12,"wave9-bookshop-mountain-architectural-ridge-3-4"],[3,32,23,45,22,"wave9-bookshop-mountain-architectural-ridge-4-4"],[27,39,46,50,16,"wave9-bookshop-mountain-architectural-ridge-5-4"],[2,2,12,19,20,"wave9-bookshop-mountain-architectural-ridge-6-4"],[39,4,46,26,13,"wave9-bookshop-mountain-architectural-ridge-7-4"],[12,42,34,51,19,"wave9-bookshop-mountain-architectural-ridge-8-4"]],"entry":[27,2],"doors":[[26,29],[14,18],[37,27],[13,38],[36,44],[7,10],[42,15],[23,46],[25,13],[26,13],[24,35],[25,35]],"windows":[[36,3],[44,4],[12,5],[19,9],[39,9],[33,12],[46,13],[14,14],[39,19]],"supports":[[21,4],[23,13],[5,16],[31,25],[5,34],[29,41],[4,4],[41,6],[14,44]],"fixtures":[[23,6,"wave9-inert-bookshop-distinct-service-0"],[25,15,"wave9-inert-bookshop-distinct-service-1"],[7,18,"wave9-inert-bookshop-distinct-service-2"],[33,27,"wave9-inert-bookshop-distinct-service-3"],[7,36,"wave9-inert-bookshop-distinct-service-4"],[31,43,"wave9-inert-bookshop-distinct-service-5"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"program":"Mountain scriptorium of unevenly angled narrow catalog stacks, west reading bridge, northeast protected manuscript tower, rear copying chambers and high ridge vault; no generated written lore. The north and south archive screens are opened by physically clear two-wide passageways at z13 and z35."},{"cat":"temple","biome":"desert","size":"large","v":5,"title":"Sunbell Open-Court Nine-Shrine Sanctuary","w":63,"d":61,"h":38,"parts":[[22,2,42,13],[8,10,26,48],[39,13,55,50],[16,43,49,56],[21,11,46,21],[19,37,47,45],[2,22,13,39],[52,19,60,40],[23,50,40,58],[2,2,12,22],[51,3,60,21]],"voids":[[28,24,37,35]],"roofs":[[22,2,42,13,21,"wave9-temple-desert-architectural-ridge-0-5"],[8,10,26,48,17,"wave9-temple-desert-architectural-ridge-1-5"],[39,13,55,50,12,"wave9-temple-desert-architectural-ridge-2-5"],[16,43,49,56,22,"wave9-temple-desert-architectural-ridge-3-5"],[21,11,46,21,16,"wave9-temple-desert-architectural-ridge-4-5"],[19,37,47,45,20,"wave9-temple-desert-architectural-ridge-5-5"],[2,22,13,39,13,"wave9-temple-desert-architectural-ridge-6-5"],[52,19,60,40,19,"wave9-temple-desert-architectural-ridge-7-5"],[23,50,40,58,11,"wave9-temple-desert-architectural-ridge-8-5"],[2,2,12,22,24,"wave9-temple-desert-architectural-ridge-9-5"],[51,3,60,21,15,"wave9-temple-desert-architectural-ridge-10-5"]],"entry":[32,2],"doors":[[17,29],[47,31],[32,49],[33,16],[33,41],[7,30],[56,29],[31,54],[7,12],[55,12]],"windows":[[54,3],[12,4],[42,4],[22,9],[60,10],[46,12],[60,20],[28,21],[38,21]],"supports":[[24,4],[10,12],[41,15],[18,45],[23,13],[21,39],[4,24],[54,21],[25,52],[4,4],[53,5]],"fixtures":[[26,6,"wave9-inert-temple-distinct-service-0"],[12,14,"wave9-inert-temple-distinct-service-1"],[43,17,"wave9-inert-temple-distinct-service-2"],[20,47,"wave9-inert-temple-distinct-service-3"],[25,15,"wave9-inert-temple-distinct-service-4"],[23,41,"wave9-inert-temple-distinct-service-5"]],"uses":["ceremonial-space","altar","public-circulation","ceremonial-space"],"program":"Solar sandstone sanctuary with a truly open central sun court, asymmetrical west processional wing and east scripture cloister, linked nine-shrine radial precinct, raised rear bell terrace and unpowered sun-dial colonnade; no worship AI."},{"cat":"market-square","biome":"enchanted-forest","size":"medium","v":4,"title":"Glowring Crossroad Five-Court Bazaar","w":52,"d":56,"h":37,"parts":[[4,2,20,13],[7,12,17,45],[17,22,45,31],[34,14,49,42],[16,40,44,52],[20,5,32,15],[22,14,29,26],[3,38,15,51],[43,2,50,19],[28,33,36,45]],"voids":[[37,23,41,27]],"roofs":[[4,2,20,13,17,"wave9-market-square-enchanted-forest-architectural-ridge-0-6"],[7,12,17,45,12,"wave9-market-square-enchanted-forest-architectural-ridge-1-6"],[17,22,45,31,22,"wave9-market-square-enchanted-forest-architectural-ridge-2-6"],[34,14,49,42,16,"wave9-market-square-enchanted-forest-architectural-ridge-3-6"],[16,40,44,52,20,"wave9-market-square-enchanted-forest-architectural-ridge-4-6"],[20,5,32,15,13,"wave9-market-square-enchanted-forest-architectural-ridge-5-6"],[22,14,29,26,19,"wave9-market-square-enchanted-forest-architectural-ridge-6-6"],[3,38,15,51,11,"wave9-market-square-enchanted-forest-architectural-ridge-7-6"],[43,2,50,19,24,"wave9-market-square-enchanted-forest-architectural-ridge-8-6"],[28,33,36,45,15,"wave9-market-square-enchanted-forest-architectural-ridge-9-6"]],"entry":[12,2],"doors":[[12,28],[31,26],[41,28],[30,46],[26,10],[25,20],[9,44],[46,10],[32,39]],"windows":[[20,4],[28,5],[43,5],[4,7],[32,13],[20,14],[40,14],[7,18],[39,22]],"supports":[[6,4],[9,14],[19,24],[36,16],[18,42],[22,7],[24,16],[5,40],[45,4],[30,35]],"fixtures":[[8,6,"wave9-inert-market-square-distinct-service-0"],[11,16,"wave9-inert-market-square-distinct-service-1"],[21,26,"wave9-inert-market-square-distinct-service-2"],[38,18,"wave9-inert-market-square-distinct-service-3"],[20,44,"wave9-inert-market-square-distinct-service-4"],[24,9,"wave9-inert-market-square-distinct-service-5"]],"uses":["square","vendor-stalls","public-circulation","vendor-stalls"],"program":"Enchanted market formed by five interwoven public courts, a missing-ground fern glade, crooked central cross-market bridge, split east and west vendor yards and a protected rear counting gallery; no trading NPCs."},{"cat":"butcher","biome":"desert","size":"large","v":4,"title":"Coppercut Terraced Provisions Exchange","w":60,"d":59,"h":38,"parts":[[5,2,28,14],[7,13,17,44],[16,29,45,39],[35,12,52,31],[33,39,54,53],[3,41,26,55],[24,4,43,15],[39,3,55,17],[19,46,38,55],[26,19,37,33],[2,22,11,36]],"voids":[],"roofs":[[5,2,28,14,12,"wave9-butcher-desert-architectural-ridge-0-7"],[7,13,17,44,22,"wave9-butcher-desert-architectural-ridge-1-7"],[16,29,45,39,16,"wave9-butcher-desert-architectural-ridge-2-7"],[35,12,52,31,20,"wave9-butcher-desert-architectural-ridge-3-7"],[33,39,54,53,13,"wave9-butcher-desert-architectural-ridge-4-7"],[3,41,26,55,19,"wave9-butcher-desert-architectural-ridge-5-7"],[24,4,43,15,11,"wave9-butcher-desert-architectural-ridge-6-7"],[39,3,55,17,24,"wave9-butcher-desert-architectural-ridge-7-7"],[19,46,38,55,15,"wave9-butcher-desert-architectural-ridge-8-7"],[26,19,37,33,21,"wave9-butcher-desert-architectural-ridge-9-7"],[2,22,11,36,17,"wave9-butcher-desert-architectural-ridge-10-7"]],"entry":[16,2],"doors":[[12,28],[30,34],[43,21],[43,46],[14,48],[33,9],[47,10],[28,50],[31,26],[6,29]],"windows":[[5,3],[40,3],[50,3],[55,8],[5,13],[18,14],[26,15],[35,18],[17,22]],"supports":[[7,4],[9,15],[18,31],[37,14],[35,41],[5,43],[26,6],[41,5],[21,48],[28,21],[4,24]],"fixtures":[[9,6,"wave9-inert-butcher-distinct-service-0"],[11,17,"wave9-inert-butcher-distinct-service-1"],[20,33,"wave9-inert-butcher-distinct-service-2"],[39,16,"wave9-inert-butcher-distinct-service-3"],[37,43,"wave9-inert-butcher-distinct-service-4"],[7,45,"wave9-inert-butcher-distinct-service-5"]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"],"program":"Cross-terraced desert food hall with separate dry cooling vault, west preparation cloister, high east inventory gallery, long rear shaded provisions wing, diagonal central delivery spine and inactive cold storage."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave9 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
  occupied.set(k(x,y,z),{x,y,z,kind,material,...extras});
 };
 for(const [x0,z0,x1,z1] of s.parts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.add(g(x,z));
 for(const [a,b,c,d] of s.voids||[])for(let x=a;x<=c;x++)for(let z=b;z<=d;z++)mask.delete(g(x,z));
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
  if(!inside(x,z))throw Error('Wave9 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave9 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave9-facade-glazing'});
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
export function getRoadmapBWave9B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE9_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
