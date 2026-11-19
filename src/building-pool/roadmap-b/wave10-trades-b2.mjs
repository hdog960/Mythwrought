// Roadmap B Wave10 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"tailor","biome":"temperate","size":"small","v":4,"title":"Willowspool Foldback Loom Arcade","w":55,"d":59,"h":39,"parts":[[18,2,37,13],[6,11,23,25],[33,11,47,20],[10,21,38,32],[5,30,17,54],[33,29,50,41],[13,43,37,56],[20,13,29,25],[2,4,11,18],[45,3,53,20],[26,30,32,51],[40,40,52,54]],"voids":[[24,27,28,31]],"roofs":[[18,2,37,13,16,"wave10-tailor-temperate-ridge-0-bearing"],[6,11,23,25,20,"wave10-tailor-temperate-ridge-1-bearing"],[33,11,47,20,12,"wave10-tailor-temperate-ridge-2-bearing"],[10,21,38,32,25,"wave10-tailor-temperate-ridge-3-bearing"],[5,30,17,54,15,"wave10-tailor-temperate-ridge-4-bearing"],[33,29,50,41,19,"wave10-tailor-temperate-ridge-5-bearing"],[13,43,37,56,22,"wave10-tailor-temperate-ridge-6-bearing"],[20,13,29,25,17,"wave10-tailor-temperate-ridge-7-bearing"],[2,4,11,18,14,"wave10-tailor-temperate-ridge-8-bearing"],[45,3,53,20,11,"wave10-tailor-temperate-ridge-9-bearing"],[26,30,32,51,18,"wave10-tailor-temperate-ridge-10-bearing"],[40,40,52,54,23,"wave10-tailor-temperate-ridge-11-bearing"]],"entry":[27,2],"doors":[[14,18],[40,15],[24,26],[11,42],[41,35],[25,49],[24,19],[6,11],[49,11],[29,40],[46,47]],"windows":[[5,4],[12,11],[40,11],[33,14],[5,18],[47,20],[40,29],[5,30],[19,32],[26,35]],"supports":[[20,4],[8,13],[35,13],[12,23],[7,32],[35,31],[15,45],[22,15],[4,6],[47,5],[28,32],[42,42]],"fixtures":[[22,6,"wave10-tailor-inert-fitting-0"],[10,15,"wave10-tailor-inert-fitting-1"],[37,15,"wave10-tailor-inert-fitting-2"],[14,25,"wave10-tailor-inert-fitting-3"],[9,34,"wave10-tailor-inert-fitting-4"],[37,33,"wave10-tailor-inert-fitting-5"],[17,47,"wave10-tailor-inert-fitting-6"]],"uses":["sales-floor","service-counter","garment-display","fitting-area"],"program":"Narrow crooked east workshop, deeply inset west dye canal, missing-ground rain yard, rear thread vault and independent roofed cross-fold gallery; crafting inactive."},{"cat":"temple","biome":"enchanted-forest","size":"small","v":5,"title":"Whisperroot Nine-Niche Canopy Shrine","w":60,"d":61,"h":40,"parts":[[21,2,39,15],[8,10,26,26],[34,12,51,28],[14,25,46,37],[7,36,23,54],[35,35,55,54],[21,44,40,58],[24,14,36,26],[2,19,11,39],[48,4,57,22],[3,3,12,20],[24,34,36,46]],"voids":[[28,28,33,33]],"roofs":[[21,2,39,15,20,"wave10-temple-enchanted-forest-ridge-0-bearing"],[8,10,26,26,12,"wave10-temple-enchanted-forest-ridge-1-bearing"],[34,12,51,28,25,"wave10-temple-enchanted-forest-ridge-2-bearing"],[14,25,46,37,15,"wave10-temple-enchanted-forest-ridge-3-bearing"],[7,36,23,54,19,"wave10-temple-enchanted-forest-ridge-4-bearing"],[35,35,55,54,22,"wave10-temple-enchanted-forest-ridge-5-bearing"],[21,44,40,58,17,"wave10-temple-enchanted-forest-ridge-6-bearing"],[24,14,36,26,14,"wave10-temple-enchanted-forest-ridge-7-bearing"],[2,19,11,39,11,"wave10-temple-enchanted-forest-ridge-8-bearing"],[48,4,57,22,18,"wave10-temple-enchanted-forest-ridge-9-bearing"],[3,3,12,20,23,"wave10-temple-enchanted-forest-ridge-10-bearing"],[24,34,36,46,16,"wave10-temple-enchanted-forest-ridge-11-bearing"]],"entry":[30,2],"doors":[[17,18],[42,20],[15,45],[45,44],[30,51],[30,20],[6,29],[52,13],[7,11],[30,40]],"windows":[[8,3],[57,4],[15,10],[43,12],[57,14],[29,27],[50,28],[8,54],[43,54],[22,58]],"supports":[[23,4],[10,12],[36,14],[16,27],[9,38],[37,37],[23,46],[26,16],[4,21],[50,6],[5,5],[26,36]],"fixtures":[[25,6,"wave10-temple-inert-fitting-0"],[12,14,"wave10-temple-inert-fitting-1"],[38,16,"wave10-temple-inert-fitting-2"],[18,29,"wave10-temple-inert-fitting-3"],[11,40,"wave10-temple-inert-fitting-4"],[39,39,"wave10-temple-inert-fitting-5"],[25,48,"wave10-temple-inert-fitting-6"]],"uses":["ceremonial-space","altar","public-circulation","ceremonial-space"],"program":"Forest canopy shrine with physically absent central root court, nine-niche arcades, west processional gallery, scripture wing and rear reliquary; NPCs inactive."},{"cat":"jeweler","biome":"temperate","size":"medium","v":4,"title":"Citrine Quayside Prismatic Vault","w":58,"d":60,"h":39,"parts":[[18,2,35,14],[9,10,22,37],[31,12,48,29],[15,32,44,43],[5,40,23,55],[33,40,53,56],[23,45,41,58],[22,12,36,23],[3,22,12,42],[44,4,55,21],[25,25,34,36]],"voids":[],"roofs":[[18,2,35,14,12,"wave10-jeweler-temperate-ridge-0-bearing"],[9,10,22,37,25,"wave10-jeweler-temperate-ridge-1-bearing"],[31,12,48,29,15,"wave10-jeweler-temperate-ridge-2-bearing"],[15,32,44,43,19,"wave10-jeweler-temperate-ridge-3-bearing"],[5,40,23,55,22,"wave10-jeweler-temperate-ridge-4-bearing"],[33,40,53,56,17,"wave10-jeweler-temperate-ridge-5-bearing"],[23,45,41,58,14,"wave10-jeweler-temperate-ridge-6-bearing"],[22,12,36,23,11,"wave10-jeweler-temperate-ridge-7-bearing"],[3,22,12,42,18,"wave10-jeweler-temperate-ridge-8-bearing"],[44,4,55,21,23,"wave10-jeweler-temperate-ridge-9-bearing"],[25,25,34,36,16,"wave10-jeweler-temperate-ridge-10-bearing"]],"entry":[26,2],"doors":[[15,23],[39,20],[29,37],[14,47],[43,48],[32,51],[29,17],[7,32],[49,12],[29,30]],"windows":[[18,3],[53,4],[39,12],[53,21],[4,22],[25,23],[39,29],[46,40],[4,42],[25,43]],"supports":[[20,4],[11,12],[33,14],[17,34],[7,42],[35,42],[25,47],[24,14],[5,24],[46,6],[27,27]],"fixtures":[[22,6,"wave10-jeweler-inert-fitting-0"],[13,14,"wave10-jeweler-inert-fitting-1"],[35,16,"wave10-jeweler-inert-fitting-2"],[19,36,"wave10-jeweler-inert-fitting-3"],[9,44,"wave10-jeweler-inert-fitting-4"],[37,44,"wave10-jeweler-inert-fitting-5"],[27,49,"wave10-jeweler-inert-fitting-6"]],"uses":["sales-floor","service-counter","jewelry-display","secure-workroom"],"program":"Waterfront gem registry with prismatic east tower, enclosed vault approach, west appraisal walk and remote rear inventory; trade inactive."},{"cat":"theater","biome":"temperate","size":"small","v":3,"title":"Brookmask Split-Crescent Playhouse","w":63,"d":59,"h":40,"parts":[[21,2,42,15],[8,12,25,29],[36,11,55,28],[14,26,48,39],[5,37,24,54],[39,36,58,54],[22,44,42,56],[25,15,38,28],[3,5,12,20],[49,3,60,20],[27,33,36,46]],"voids":[[28,29,33,34]],"roofs":[[21,2,42,15,25,"wave10-theater-temperate-ridge-0-bearing"],[8,12,25,29,15,"wave10-theater-temperate-ridge-1-bearing"],[36,11,55,28,19,"wave10-theater-temperate-ridge-2-bearing"],[14,26,48,39,22,"wave10-theater-temperate-ridge-3-bearing"],[5,37,24,54,17,"wave10-theater-temperate-ridge-4-bearing"],[39,36,58,54,14,"wave10-theater-temperate-ridge-5-bearing"],[22,44,42,56,11,"wave10-theater-temperate-ridge-6-bearing"],[25,15,38,28,18,"wave10-theater-temperate-ridge-7-bearing"],[3,5,12,20,23,"wave10-theater-temperate-ridge-8-bearing"],[49,3,60,20,16,"wave10-theater-temperate-ridge-9-bearing"],[27,33,36,46,20,"wave10-theater-temperate-ridge-10-bearing"]],"entry":[31,2],"doors":[[16,20],[45,19],[14,45],[48,45],[32,50],[31,21],[7,12],[54,11],[31,39]],"windows":[[21,3],[42,3],[56,3],[7,5],[49,6],[14,12],[7,20],[56,20],[28,28],[49,28]],"supports":[[23,4],[10,14],[38,13],[16,28],[7,39],[41,38],[24,46],[27,17],[5,7],[51,5],[29,35]],"fixtures":[[25,6,"wave10-theater-inert-fitting-0"],[12,16,"wave10-theater-inert-fitting-1"],[40,15,"wave10-theater-inert-fitting-2"],[18,30,"wave10-theater-inert-fitting-3"],[9,41,"wave10-theater-inert-fitting-4"],[43,40,"wave10-theater-inert-fitting-5"],[26,48,"wave10-theater-inert-fitting-6"]],"uses":["public-circulation","audience-area","stage","backstage"],"program":"Double crescent masked playhouse with missing-floor open sky stage court, dual audience galleries, separate backstage courts and multipitched roof ridge; performances inactive."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave10 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave10 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave10 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave10-facade-glazing'});
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
export function getRoadmapBWave10B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE10_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
