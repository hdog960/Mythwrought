// Roadmap B Wave8 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"tailor","biome":"desert","size":"medium","v":5,"title":"Amberthread Dune Loom Exchange","w":51,"d":53,"h":34,"parts":[[16,2,36,12],[19,11,30,46],[3,17,21,32],[29,17,46,28],[2,38,23,49],[33,38,48,51],[10,26,17,41],[39,3,49,19],[23,40,38,48]],"roofs":[[16,2,36,12,22,"wave8-tailor-desert-distinct-mass-0"],[19,11,30,46,12,"wave8-tailor-desert-distinct-mass-1"],[3,17,21,32,17,"wave8-tailor-desert-distinct-mass-2"],[29,17,46,28,21,"wave8-tailor-desert-distinct-mass-3"],[2,38,23,49,14,"wave8-tailor-desert-distinct-mass-4"],[33,38,48,51,20,"wave8-tailor-desert-distinct-mass-5"],[10,26,17,41,18,"wave8-tailor-desert-distinct-mass-6"],[39,3,49,19,11,"wave8-tailor-desert-distinct-mass-7"],[23,40,38,48,19,"wave8-tailor-desert-distinct-mass-8"]],"entry":[26,2],"doors":[[24,28],[12,24],[37,22],[12,43],[40,44],[13,33],[44,11],[30,44]],"windows":[[30,13],[17,34],[24,48]],"supports":[[18,4],[21,13],[5,19],[31,19],[4,40],[35,40],[12,28],[41,5],[25,42]],"fixtures":[[20,6,"wave8-tailor-static-functional-zone-0"],[23,15,"wave8-tailor-static-functional-zone-1"],[7,21,"wave8-tailor-static-functional-zone-2"],[33,21,"wave8-tailor-static-functional-zone-3"],[6,42,"wave8-tailor-static-functional-zone-4"],[37,42,"wave8-tailor-static-functional-zone-5"]],"uses":["public entry hall","west working wing","east working wing","rear protected archive"],"program":"Amberthread Dune Loom Exchange: original multi-height offset axial architecture, staggered 9-mass silhouette, walkable connected galleries, asymmetric terminal wings, distinct roof ridges and four differentiated public/service rooms; no active gameplay production."},{"cat":"theater","biome":"snow","size":"large","v":4,"title":"Winterglass Split-Stage Amphitheater","w":61,"d":59,"h":37,"parts":[[19,2,42,13],[23,12,35,53],[3,16,25,31],[34,19,57,35],[3,43,26,56],[38,43,58,56],[8,30,17,45],[48,3,59,21],[27,47,45,55],[2,3,12,20],[45,30,54,48]],"roofs":[[19,2,42,13,12,"wave8-theater-snow-distinct-mass-0"],[23,12,35,53,17,"wave8-theater-snow-distinct-mass-1"],[3,16,25,31,21,"wave8-theater-snow-distinct-mass-2"],[34,19,57,35,14,"wave8-theater-snow-distinct-mass-3"],[3,43,26,56,20,"wave8-theater-snow-distinct-mass-4"],[38,43,58,56,18,"wave8-theater-snow-distinct-mass-5"],[8,30,17,45,11,"wave8-theater-snow-distinct-mass-6"],[48,3,59,21,19,"wave8-theater-snow-distinct-mass-7"],[27,47,45,55,24,"wave8-theater-snow-distinct-mass-8"],[2,3,12,20,15,"wave8-theater-snow-distinct-mass-9"],[45,30,54,48,22,"wave8-theater-snow-distinct-mass-10"]],"entry":[30,2],"doors":[[29,32],[14,23],[45,27],[14,49],[48,49],[12,37],[53,12],[36,51],[7,11],[49,39]],"windows":[[41,35],[17,34]],"supports":[[21,4],[25,14],[5,18],[36,21],[5,45],[40,45],[10,32],[50,5],[29,49],[4,5],[47,32]],"fixtures":[[23,6,"wave8-theater-static-functional-zone-0"],[27,16,"wave8-theater-static-functional-zone-1"],[7,20,"wave8-theater-static-functional-zone-2"],[38,23,"wave8-theater-static-functional-zone-3"],[7,47,"wave8-theater-static-functional-zone-4"],[42,47,"wave8-theater-static-functional-zone-5"]],"uses":["public entry hall","west working wing","east working wing","rear protected archive"],"program":"Winterglass Split-Stage Amphitheater: original multi-height offset axial architecture, staggered 11-mass silhouette, walkable connected galleries, asymmetric terminal wings, distinct roof ridges and four differentiated public/service rooms; no active gameplay production."},{"cat":"jeweler","biome":"mountain","size":"medium","v":5,"title":"Opalcrag Terraced Gem Treasury","w":52,"d":54,"h":35,"parts":[[16,2,35,13],[19,12,31,49],[2,16,21,30],[30,18,48,35],[4,39,22,51],[34,40,50,52],[8,27,15,42],[42,4,50,22],[24,44,42,51],[2,3,10,18]],"roofs":[[16,2,35,13,17,"wave8-jeweler-mountain-distinct-mass-0"],[19,12,31,49,21,"wave8-jeweler-mountain-distinct-mass-1"],[2,16,21,30,14,"wave8-jeweler-mountain-distinct-mass-2"],[30,18,48,35,20,"wave8-jeweler-mountain-distinct-mass-3"],[4,39,22,51,18,"wave8-jeweler-mountain-distinct-mass-4"],[34,40,50,52,11,"wave8-jeweler-mountain-distinct-mass-5"],[8,27,15,42,19,"wave8-jeweler-mountain-distinct-mass-6"],[42,4,50,22,24,"wave8-jeweler-mountain-distinct-mass-7"],[24,44,42,51,15,"wave8-jeweler-mountain-distinct-mass-8"],[2,3,10,18,22,"wave8-jeweler-mountain-distinct-mass-9"]],"entry":[25,2],"doors":[[25,30],[11,23],[39,26],[13,45],[42,46],[11,34],[46,13],[33,47],[6,10]],"windows":[[19,38],[31,15],[41,35]],"supports":[[18,4],[21,14],[4,18],[32,20],[6,41],[36,42],[10,29],[44,6],[26,46],[4,5]],"fixtures":[[20,6,"wave8-jeweler-static-functional-zone-0"],[23,16,"wave8-jeweler-static-functional-zone-1"],[6,20,"wave8-jeweler-static-functional-zone-2"],[34,22,"wave8-jeweler-static-functional-zone-3"],[8,43,"wave8-jeweler-static-functional-zone-4"],[38,44,"wave8-jeweler-static-functional-zone-5"]],"uses":["public entry hall","west working wing","east working wing","rear protected archive"],"program":"Opalcrag Terraced Gem Treasury: original multi-height offset axial architecture, staggered 10-mass silhouette, walkable connected galleries, asymmetric terminal wings, distinct roof ridges and four differentiated public/service rooms; no active gameplay production."},{"cat":"butcher","biome":"enchanted-forest","size":"large","v":5,"title":"Thornfeast Split-Arcade Provisions Hall","w":59,"d":58,"h":36,"parts":[[17,2,42,14],[22,13,34,51],[3,16,24,32],[34,17,55,32],[2,42,24,55],[39,43,56,56],[8,30,17,45],[47,3,57,21],[26,46,44,54],[3,3,12,20],[44,31,53,47]],"roofs":[[17,2,42,14,21,"wave8-butcher-enchanted-forest-distinct-mass-0"],[22,13,34,51,14,"wave8-butcher-enchanted-forest-distinct-mass-1"],[3,16,24,32,20,"wave8-butcher-enchanted-forest-distinct-mass-2"],[34,17,55,32,18,"wave8-butcher-enchanted-forest-distinct-mass-3"],[2,42,24,55,11,"wave8-butcher-enchanted-forest-distinct-mass-4"],[39,43,56,56,19,"wave8-butcher-enchanted-forest-distinct-mass-5"],[8,30,17,45,24,"wave8-butcher-enchanted-forest-distinct-mass-6"],[47,3,57,21,15,"wave8-butcher-enchanted-forest-distinct-mass-7"],[26,46,44,54,22,"wave8-butcher-enchanted-forest-distinct-mass-8"],[3,3,12,20,12,"wave8-butcher-enchanted-forest-distinct-mass-9"],[44,31,53,47,17,"wave8-butcher-enchanted-forest-distinct-mass-10"]],"entry":[29,2],"doors":[[28,32],[13,24],[44,24],[13,48],[47,49],[12,37],[52,12],[35,50],[7,11],[48,39]],"windows":[[21,42],[17,34],[26,52],[44,41]],"supports":[[19,4],[24,15],[5,18],[36,19],[4,44],[41,45],[10,32],[49,5],[28,48],[5,5],[46,33]],"fixtures":[[21,6,"wave8-butcher-static-functional-zone-0"],[26,17,"wave8-butcher-static-functional-zone-1"],[7,20,"wave8-butcher-static-functional-zone-2"],[38,21,"wave8-butcher-static-functional-zone-3"],[6,46,"wave8-butcher-static-functional-zone-4"],[43,47,"wave8-butcher-static-functional-zone-5"]],"uses":["public entry hall","west working wing","east working wing","rear protected archive"],"program":"Thornfeast Split-Arcade Provisions Hall: original multi-height offset axial architecture, staggered 11-mass silhouette, walkable connected galleries, asymmetric terminal wings, distinct roof ridges and four differentiated public/service rooms; no active gameplay production."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave8 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave8 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave8 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave8-facade-glazing'});
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
export function getRoadmapBWave8B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE7_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
