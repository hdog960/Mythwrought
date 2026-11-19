// Roadmap B Wave11 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"butcher","biome":"desert","size":"small","v":4,"title":"Miragecut Switchyard Provision Hall","w":55,"d":64,"h":41,"parts":[[20,2,37,14],[5,11,25,22],[35,10,52,27],[12,23,44,33],[4,32,19,55],[37,31,51,57],[17,47,43,60],[21,12,34,26],[2,4,12,20],[45,3,53,20],[26,35,34,50]],"voids":[[27,27,32,31]],"roofs":[[20,2,37,14,11,"wave11-butcher-desert-distinct-bearing-0"],[5,11,25,22,20,"wave11-butcher-desert-distinct-bearing-1"],[35,10,52,27,16,"wave11-butcher-desert-distinct-bearing-2"],[12,23,44,33,22,"wave11-butcher-desert-distinct-bearing-3"],[4,32,19,55,19,"wave11-butcher-desert-distinct-bearing-4"],[37,31,51,57,17,"wave11-butcher-desert-distinct-bearing-5"],[17,47,43,60,12,"wave11-butcher-desert-distinct-bearing-6"],[21,12,34,26,23,"wave11-butcher-desert-distinct-bearing-7"],[2,4,12,20,15,"wave11-butcher-desert-distinct-bearing-8"],[45,3,53,20,21,"wave11-butcher-desert-distinct-bearing-9"],[26,35,34,50,14,"wave11-butcher-desert-distinct-bearing-10"]],"entry":[28,2],"doors":[[15,16],[43,18],[11,43],[44,44],[30,53],[27,19],[7,12],[49,11],[30,42]],"windows":[[3,4],[45,4],[20,6],[37,8],[12,10],[9,22],[52,25],[29,26],[44,29],[12,31],[22,33]],"supports":[[22,4],[7,13],[37,12],[14,25],[6,34],[39,33],[19,49],[23,14],[4,6],[47,5],[28,37]],"fixtures":[[24,6,"wave11-butcher-inert-architectural-element-0"],[9,15,"wave11-butcher-inert-architectural-element-1"],[39,14,"wave11-butcher-inert-architectural-element-2"],[16,27,"wave11-butcher-inert-architectural-element-3"],[8,36,"wave11-butcher-inert-architectural-element-4"],[41,35,"wave11-butcher-inert-architectural-element-5"],[21,51,"wave11-butcher-inert-architectural-element-6"]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"],"program":"Miragecut is a desert switchyard meat market with offset sand-cooled cells, a true uncovered ventilating court, distinct dry-salt processing wings, a roofed west cart lane and an eastern covered deliveries vault; meat production inactive."},{"cat":"market-square","biome":"mountain","size":"small","v":4,"title":"Slatepass Double-Switch Mountain Bazaar","w":59,"d":64,"h":41,"parts":[[18,2,39,14],[8,10,25,28],[37,11,54,25],[14,24,48,34],[5,32,20,53],[40,32,55,52],[20,43,44,60],[23,12,36,27],[3,3,12,18],[48,3,57,22],[26,31,34,47],[4,49,15,60]],"voids":[[28,28,34,33]],"roofs":[[18,2,39,14,16,"wave11-market-square-mountain-distinct-bearing-0"],[8,10,25,28,22,"wave11-market-square-mountain-distinct-bearing-1"],[37,11,54,25,19,"wave11-market-square-mountain-distinct-bearing-2"],[14,24,48,34,17,"wave11-market-square-mountain-distinct-bearing-3"],[5,32,20,53,12,"wave11-market-square-mountain-distinct-bearing-4"],[40,32,55,52,23,"wave11-market-square-mountain-distinct-bearing-5"],[20,43,44,60,15,"wave11-market-square-mountain-distinct-bearing-6"],[23,12,36,27,21,"wave11-market-square-mountain-distinct-bearing-7"],[3,3,12,18,14,"wave11-market-square-mountain-distinct-bearing-8"],[48,3,57,22,25,"wave11-market-square-mountain-distinct-bearing-9"],[26,31,34,47,18,"wave11-market-square-mountain-distinct-bearing-10"],[4,49,15,60,11,"wave11-market-square-mountain-distinct-bearing-11"]],"entry":[28,2],"doors":[[16,19],[45,18],[12,42],[47,42],[32,51],[29,19],[7,10],[52,12],[30,39],[9,54]],"windows":[[6,3],[48,3],[13,10],[3,15],[8,23],[53,25],[28,27],[48,31],[11,32],[21,34],[35,34]],"supports":[[20,4],[10,12],[39,13],[16,26],[7,34],[42,34],[22,45],[25,14],[5,5],[50,5],[6,51]],"fixtures":[[22,6,"wave11-market-square-inert-architectural-element-0"],[12,14,"wave11-market-square-inert-architectural-element-1"],[41,15,"wave11-market-square-inert-architectural-element-2"],[18,28,"wave11-market-square-inert-architectural-element-3"],[9,36,"wave11-market-square-inert-architectural-element-4"],[44,36,"wave11-market-square-inert-architectural-element-5"],[24,47,"wave11-market-square-inert-architectural-element-6"]],"uses":["square","vendor-stalls","public-circulation","vendor-stalls"],"program":"Slatepass is a cliff-ridge public trading square laid out as two switching diagonals with a literally missing-ground shared cold courtyard, elevated stone stalls, winding western approach and separated eastern granary arcade; trading inactive."},{"cat":"jeweler","biome":"snow","size":"small","v":4,"title":"Snowglint Needlecrag Jewelsmith Atelier","w":52,"d":61,"h":41,"parts":[[17,2,33,15],[8,12,21,33],[31,11,46,25],[15,28,41,40],[5,38,21,55],[34,37,48,56],[19,47,36,59],[22,12,31,27],[2,3,11,18],[41,3,49,19],[26,38,33,51]],"voids":[[24,31,28,36]],"roofs":[[17,2,33,15,19,"wave11-jeweler-snow-distinct-bearing-0"],[8,12,21,33,17,"wave11-jeweler-snow-distinct-bearing-1"],[31,11,46,25,12,"wave11-jeweler-snow-distinct-bearing-2"],[15,28,41,40,23,"wave11-jeweler-snow-distinct-bearing-3"],[5,38,21,55,15,"wave11-jeweler-snow-distinct-bearing-4"],[34,37,48,56,21,"wave11-jeweler-snow-distinct-bearing-5"],[19,47,36,59,14,"wave11-jeweler-snow-distinct-bearing-6"],[22,12,31,27,25,"wave11-jeweler-snow-distinct-bearing-7"],[2,3,11,18,18,"wave11-jeweler-snow-distinct-bearing-8"],[41,3,49,19,11,"wave11-jeweler-snow-distinct-bearing-9"],[26,38,33,51,20,"wave11-jeweler-snow-distinct-bearing-10"]],"entry":[25,2],"doors":[[14,22],[38,18],[13,46],[41,46],[27,53],[26,19],[6,10],[45,11],[29,44]],"windows":[[7,3],[42,3],[17,5],[49,10],[5,18],[46,22],[33,25],[8,27],[41,28],[15,34],[29,34]],"supports":[[19,4],[10,14],[33,13],[17,30],[7,40],[36,39],[21,49],[24,14],[4,5],[43,5],[28,40]],"fixtures":[[21,6,"wave11-jeweler-inert-architectural-element-0"],[12,16,"wave11-jeweler-inert-architectural-element-1"],[35,15,"wave11-jeweler-inert-architectural-element-2"],[19,32,"wave11-jeweler-inert-architectural-element-3"],[9,42,"wave11-jeweler-inert-architectural-element-4"],[38,41,"wave11-jeweler-inert-architectural-element-5"],[23,51,"wave11-jeweler-inert-architectural-element-6"]],"uses":["sales-floor","service-counter","jewelry-display","secure-workroom"],"program":"Snowglint is a snowbound glass-cutting atelier with an unbuilt light shaft, narrow angular inspection towers, offset wind-protected storefront and a physical rear double vault; gem crafting and economy inactive."},{"cat":"bookshop","biome":"temperate","size":"large","v":4,"title":"Willowfolio Braided River Grand Bookhall","w":69,"d":63,"h":42,"parts":[[25,2,45,14],[8,10,29,25],[38,10,61,26],[15,23,55,35],[4,32,21,52],[49,31,65,51],[23,43,48,59],[23,13,41,27],[3,2,13,22],[55,3,66,21],[30,33,38,49],[6,49,23,59],[48,48,62,60]],"voids":[[32,27,38,31]],"roofs":[[25,2,45,14,12,"wave11-bookshop-temperate-distinct-bearing-0"],[8,10,29,25,23,"wave11-bookshop-temperate-distinct-bearing-1"],[38,10,61,26,15,"wave11-bookshop-temperate-distinct-bearing-2"],[15,23,55,35,21,"wave11-bookshop-temperate-distinct-bearing-3"],[4,32,21,52,14,"wave11-bookshop-temperate-distinct-bearing-4"],[49,31,65,51,25,"wave11-bookshop-temperate-distinct-bearing-5"],[23,43,48,59,18,"wave11-bookshop-temperate-distinct-bearing-6"],[23,13,41,27,11,"wave11-bookshop-temperate-distinct-bearing-7"],[3,2,13,22,20,"wave11-bookshop-temperate-distinct-bearing-8"],[55,3,66,21,16,"wave11-bookshop-temperate-distinct-bearing-9"],[30,33,38,49,22,"wave11-bookshop-temperate-distinct-bearing-10"],[6,49,23,59,19,"wave11-bookshop-temperate-distinct-bearing-11"],[48,48,62,60,17,"wave11-bookshop-temperate-distinct-bearing-12"]],"entry":[35,2],"doors":[[18,17],[49,18],[12,42],[57,41],[35,51],[32,20],[8,12],[60,12],[34,41],[14,54],[55,54]],"windows":[[64,3],[13,4],[25,5],[3,9],[45,9],[66,16],[5,22],[61,22],[13,25],[32,26],[57,31]],"supports":[[27,4],[10,12],[40,12],[17,25],[6,34],[51,33],[25,45],[25,15],[5,4],[57,5],[32,35],[8,51],[50,50]],"fixtures":[[29,6,"wave11-bookshop-inert-architectural-element-0"],[12,14,"wave11-bookshop-inert-architectural-element-1"],[42,14,"wave11-bookshop-inert-architectural-element-2"],[19,27,"wave11-bookshop-inert-architectural-element-3"],[8,36,"wave11-bookshop-inert-architectural-element-4"],[53,35,"wave11-bookshop-inert-architectural-element-5"],[27,47,"wave11-bookshop-inert-architectural-element-6"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"program":"Willowfolio is a sprawling riverfront manuscript hall with two braided stacks bridged over a true unbuilt reading court, separate east and west printing cloisters, three distinct archive towers and a rear secure folio store; no generated books or citizen AI."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave11 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave11 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave11 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave11-facade-glazing'});
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
export function getRoadmapBWave11B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE11_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
