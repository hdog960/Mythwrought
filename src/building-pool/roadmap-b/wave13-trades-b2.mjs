// Roadmap B Wave13 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"bookshop","biome":"mountain","size":"large","v":4,"title":"Pinecrag Double-Ridge Grand Archive","w":118,"d":55,"h":48,"parts":[[47,2,70,15],[14,10,49,27],[67,12,100,31],[34,23,81,35],[2,31,27,51],[91,31,115,53],[25,38,58,52],[63,39,98,53],[3,3,17,25],[100,3,116,27],[35,42,84,54],[19,24,100,31]],"voids":[[53,23,63,30],[28,39,33,44]],"roofs":[[47,2,70,15,11,"wave13-bookshop-mountain-individual-supported-mass-0"],[14,10,49,27,23,"wave13-bookshop-mountain-individual-supported-mass-1"],[67,12,100,31,17,"wave13-bookshop-mountain-individual-supported-mass-2"],[34,23,81,35,21,"wave13-bookshop-mountain-individual-supported-mass-3"],[2,31,27,51,14,"wave13-bookshop-mountain-individual-supported-mass-4"],[91,31,115,53,19,"wave13-bookshop-mountain-individual-supported-mass-5"],[25,38,58,52,13,"wave13-bookshop-mountain-individual-supported-mass-6"],[63,39,98,53,25,"wave13-bookshop-mountain-individual-supported-mass-7"],[3,3,17,25,16,"wave13-bookshop-mountain-individual-supported-mass-8"],[100,3,116,27,22,"wave13-bookshop-mountain-individual-supported-mass-9"],[35,42,84,54,15,"wave13-bookshop-mountain-individual-supported-mass-10"],[19,24,100,31,27,"wave13-bookshop-mountain-individual-supported-mass-11"]],"entry":[58,2],"doors":[[31,18],[83,21],[14,41],[103,42],[41,45],[80,46],[10,14],[108,15],[59,48]],"windows":[[8,3],[106,3],[70,5],[17,6],[100,8],[47,9],[29,10],[77,12],[91,12],[3,13],[58,15],[67,18]],"supports":[[49,4],[16,12],[69,14],[36,25],[4,33],[93,33],[27,40],[65,41],[5,5],[102,5],[37,44],[21,26]],"fixtures":[[51,6,"wave13-bookshop-inert-records"],[18,14,"wave13-bookshop-inert-dispatch"],[71,16,"wave13-bookshop-inert-rest"],[38,27,"wave13-bookshop-inert-craft"],[6,35,"wave13-bookshop-inert-gallery"],[95,35,"wave13-bookshop-inert-access"],[29,42,"wave13-bookshop-inert-support"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"program":"Very wide mountain grand archive with twin ridge stacks, two physically empty reading courts, west/east scriptoria and sheltered back transfer gallery; books inactive."},{"cat":"jeweler","biome":"enchanted-forest","size":"medium","v":4,"title":"Iridescent Spireglass Jewel Gallery","w":57,"d":108,"h":48,"parts":[[20,2,37,17],[3,15,20,38],[34,17,54,41],[13,34,41,54],[2,55,17,77],[39,56,55,82],[18,47,35,98],[7,79,24,106],[29,91,48,107],[23,26,33,94],[2,3,13,18],[44,3,55,19],[38,52,45,61]],"voids":[[25,45,29,52]],"roofs":[[20,2,37,17,17,"wave13-jeweler-enchanted-forest-individual-supported-mass-0"],[3,15,20,38,21,"wave13-jeweler-enchanted-forest-individual-supported-mass-1"],[34,17,54,41,14,"wave13-jeweler-enchanted-forest-individual-supported-mass-2"],[13,34,41,54,19,"wave13-jeweler-enchanted-forest-individual-supported-mass-3"],[2,55,17,77,13,"wave13-jeweler-enchanted-forest-individual-supported-mass-4"],[39,56,55,82,25,"wave13-jeweler-enchanted-forest-individual-supported-mass-5"],[18,47,35,98,16,"wave13-jeweler-enchanted-forest-individual-supported-mass-6"],[7,79,24,106,22,"wave13-jeweler-enchanted-forest-individual-supported-mass-7"],[29,91,48,107,15,"wave13-jeweler-enchanted-forest-individual-supported-mass-8"],[23,26,33,94,27,"wave13-jeweler-enchanted-forest-individual-supported-mass-9"],[2,3,13,18,18,"wave13-jeweler-enchanted-forest-individual-supported-mass-10"],[44,3,55,19,11,"wave13-jeweler-enchanted-forest-individual-supported-mass-11"],[38,52,45,61,23,"wave13-jeweler-enchanted-forest-individual-supported-mass-12"]],"entry":[28,2],"doors":[[11,26],[44,29],[27,44],[9,66],[47,69],[26,72],[15,92],[38,99],[28,60],[7,10],[49,11],[41,56]],"windows":[[6,3],[20,3],[48,3],[37,4],[13,10],[44,11],[27,17],[3,23],[20,24],[34,24],[54,26],[23,32]],"supports":[[22,4],[5,17],[36,19],[15,36],[4,57],[41,58],[20,49],[9,81],[31,93],[25,28],[4,5],[46,5],[40,54]],"fixtures":[[24,6,"wave13-jeweler-inert-records"],[7,19,"wave13-jeweler-inert-dispatch"],[38,21,"wave13-jeweler-inert-rest"],[17,38,"wave13-jeweler-inert-craft"],[6,59,"wave13-jeweler-inert-gallery"],[43,60,"wave13-jeweler-inert-access"],[22,51,"wave13-jeweler-inert-support"]],"uses":["sales-floor","service-counter","jewelry-display","secure-workroom"],"program":"Long gem gallery, two unequally shaped vault wings and a real floor bridge to eastern cutting atelier around an open prism well; gem work inactive."},{"cat":"tailor","biome":"desert","size":"small","v":4,"title":"Ochrethread Twin-Sickle Loom Arcade","w":102,"d":58,"h":48,"parts":[[43,2,61,13],[7,9,41,20],[64,12,94,27],[22,19,74,32],[3,30,22,53],[82,29,100,55],[25,31,48,51],[54,36,80,54],[17,42,34,56],[67,44,90,56],[36,20,60,44],[3,3,15,23],[39,10,69,20],[72,25,89,37]],"voids":[[40,27,47,32],[59,33,66,38]],"roofs":[[43,2,61,13,14,"wave13-tailor-desert-individual-supported-mass-0"],[7,9,41,20,19,"wave13-tailor-desert-individual-supported-mass-1"],[64,12,94,27,13,"wave13-tailor-desert-individual-supported-mass-2"],[22,19,74,32,25,"wave13-tailor-desert-individual-supported-mass-3"],[3,30,22,53,16,"wave13-tailor-desert-individual-supported-mass-4"],[82,29,100,55,22,"wave13-tailor-desert-individual-supported-mass-5"],[25,31,48,51,15,"wave13-tailor-desert-individual-supported-mass-6"],[54,36,80,54,27,"wave13-tailor-desert-individual-supported-mass-7"],[17,42,34,56,18,"wave13-tailor-desert-individual-supported-mass-8"],[67,44,90,56,11,"wave13-tailor-desert-individual-supported-mass-9"],[36,20,60,44,23,"wave13-tailor-desert-individual-supported-mass-10"],[3,3,15,23,17,"wave13-tailor-desert-individual-supported-mass-11"],[39,10,69,20,21,"wave13-tailor-desert-individual-supported-mass-12"],[72,25,89,37,14,"wave13-tailor-desert-individual-supported-mass-13"]],"entry":[52,2],"doors":[[24,14],[79,19],[48,25],[12,41],[91,42],[36,41],[67,45],[25,49],[78,50],[48,32],[9,13],[54,15],[80,31]],"windows":[[4,3],[61,8],[22,9],[36,9],[73,12],[87,12],[3,19],[94,19],[20,20],[45,26],[90,27],[8,30]],"supports":[[45,4],[9,11],[66,14],[24,21],[5,32],[84,31],[27,33],[56,38],[19,44],[69,46],[38,22],[5,5],[41,12],[74,27]],"fixtures":[[47,6,"wave13-tailor-inert-records"],[11,13,"wave13-tailor-inert-dispatch"],[68,16,"wave13-tailor-inert-rest"],[26,23,"wave13-tailor-inert-craft"],[7,34,"wave13-tailor-inert-gallery"],[86,33,"wave13-tailor-inert-access"],[29,35,"wave13-tailor-inert-support"]],"uses":["sales-floor","service-counter","garment-display","fitting-area"],"program":"Twin-sickle weaving bazaar with actual enclosed northern threshold bridge, cross-gallery to eastern silk court, and two missing-floor dye wells; crafting inactive."},{"cat":"theater","biome":"enchanted-forest","size":"medium","v":3,"title":"Hollowbloom Twin-Arc Forest Playhouse","w":74,"d":89,"h":48,"parts":[[27,2,45,15],[9,11,30,31],[43,12,68,34],[19,28,56,42],[3,39,18,69],[56,38,72,67],[21,40,49,61],[7,65,29,87],[38,62,67,88],[28,75,48,87],[11,33,60,46],[26,53,44,75]],"voids":[[33,36,40,42],[30,60,35,67]],"roofs":[[27,2,45,15,13,"wave13-theater-enchanted-forest-individual-supported-mass-0"],[9,11,30,31,25,"wave13-theater-enchanted-forest-individual-supported-mass-1"],[43,12,68,34,16,"wave13-theater-enchanted-forest-individual-supported-mass-2"],[19,28,56,42,22,"wave13-theater-enchanted-forest-individual-supported-mass-3"],[3,39,18,69,15,"wave13-theater-enchanted-forest-individual-supported-mass-4"],[56,38,72,67,27,"wave13-theater-enchanted-forest-individual-supported-mass-5"],[21,40,49,61,18,"wave13-theater-enchanted-forest-individual-supported-mass-6"],[7,65,29,87,11,"wave13-theater-enchanted-forest-individual-supported-mass-7"],[38,62,67,88,23,"wave13-theater-enchanted-forest-individual-supported-mass-8"],[28,75,48,87,17,"wave13-theater-enchanted-forest-individual-supported-mass-9"],[11,33,60,46,21,"wave13-theater-enchanted-forest-individual-supported-mass-10"],[26,53,44,75,14,"wave13-theater-enchanted-forest-individual-supported-mass-11"]],"entry":[36,2],"doors":[[19,21],[55,23],[37,35],[10,54],[64,52],[35,50],[18,76],[52,75],[38,81]],"windows":[[45,8],[27,9],[12,11],[57,12],[38,15],[68,18],[9,24],[30,24],[43,26],[16,31],[68,32],[41,37]],"supports":[[29,4],[11,13],[45,14],[21,30],[5,41],[58,40],[23,42],[9,67],[40,64],[30,77],[13,35],[28,55]],"fixtures":[[31,6,"wave13-theater-inert-records"],[13,15,"wave13-theater-inert-dispatch"],[47,16,"wave13-theater-inert-rest"],[23,32,"wave13-theater-inert-craft"],[7,43,"wave13-theater-inert-gallery"],[60,42,"wave13-theater-inert-access"],[25,44,"wave13-theater-inert-support"]],"uses":["stage","audience-area","backstage","public-circulation"],"program":"Two independent forest stage crescents with open-air lightwells, lateral audience houses, physically supported source stage and rear dressing arcade; performances inactive."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave13 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave13 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave13 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave13-facade-glazing'});
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
export function getRoadmapBWave13B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE13_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
