// Roadmap B Wave12 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"market-square","biome":"snow","size":"large","v":4,"title":"Whitecross Windward Arcade Market","w":102,"d":56,"h":47,"parts":[[41,2,60,14],[15,9,45,26],[59,11,88,29],[26,24,78,36],[3,29,26,49],[81,30,99,51],[35,36,67,53],[2,3,17,22],[88,3,100,24],[20,43,36,55],[68,40,88,55],[12,23,92,31]],"voids":[[47,26,55,32],[20,26,26,30]],"roofs":[[41,2,60,14,11,"wave12-market-square-snow-original-bearing-0"],[15,9,45,26,24,"wave12-market-square-snow-original-bearing-1"],[59,11,88,29,16,"wave12-market-square-snow-original-bearing-2"],[26,24,78,36,22,"wave12-market-square-snow-original-bearing-3"],[3,29,26,49,18,"wave12-market-square-snow-original-bearing-4"],[81,30,99,51,21,"wave12-market-square-snow-original-bearing-5"],[35,36,67,53,13,"wave12-market-square-snow-original-bearing-6"],[2,3,17,22,25,"wave12-market-square-snow-original-bearing-7"],[88,3,100,24,17,"wave12-market-square-snow-original-bearing-8"],[20,43,36,55,23,"wave12-market-square-snow-original-bearing-9"],[68,40,88,55,15,"wave12-market-square-snow-original-bearing-10"],[12,23,92,31,27,"wave12-market-square-snow-original-bearing-11"]],"entry":[50,2],"doors":[[30,17],[73,20],[14,39],[90,40],[51,44],[9,12],[94,13],[28,49],[78,47]],"windows":[[9,3],[93,3],[60,5],[41,7],[22,9],[66,11],[80,11],[48,14],[59,18],[7,22],[50,23],[93,24]],"supports":[[43,4],[17,11],[61,13],[28,26],[5,31],[83,32],[37,38],[4,5],[90,5],[22,45],[70,42],[14,25]],"fixtures":[[45,6,"wave12-market-square-inert-inspection"],[19,13,"wave12-market-square-inert-rest"],[63,15,"wave12-market-square-inert-record"],[30,28,"wave12-market-square-inert-market"],[7,33,"wave12-market-square-inert-supply"],[85,34,"wave12-market-square-inert-route"],[39,40,"wave12-market-square-inert-display"]],"uses":["square","vendor-stalls","public-circulation","vendor-stalls"],"program":"Snowbound covered market: two long timber trade roads, two actual empty open-sky courts, west warm-goods refuge, east watch-market and rear sheltered granary; vendor gameplay inactive."},{"cat":"butcher","biome":"snow","size":"small","v":4,"title":"Ironrime Lantern Coldhall","w":46,"d":94,"h":47,"parts":[[16,2,29,15],[5,12,20,36],[26,13,42,31],[12,31,35,44],[2,44,17,63],[31,43,44,68],[17,17,28,83],[10,63,33,78],[13,77,37,92],[2,73,14,92],[35,71,44,89]],"voids":[[20,35,25,40]],"roofs":[[16,2,29,15,16,"wave12-butcher-snow-original-bearing-0"],[5,12,20,36,22,"wave12-butcher-snow-original-bearing-1"],[26,13,42,31,18,"wave12-butcher-snow-original-bearing-2"],[12,31,35,44,21,"wave12-butcher-snow-original-bearing-3"],[2,44,17,63,13,"wave12-butcher-snow-original-bearing-4"],[31,43,44,68,25,"wave12-butcher-snow-original-bearing-5"],[17,17,28,83,17,"wave12-butcher-snow-original-bearing-6"],[10,63,33,78,23,"wave12-butcher-snow-original-bearing-7"],[13,77,37,92,15,"wave12-butcher-snow-original-bearing-8"],[2,73,14,92,27,"wave12-butcher-snow-original-bearing-9"],[35,71,44,89,19,"wave12-butcher-snow-original-bearing-10"]],"entry":[22,2],"doors":[[12,24],[34,22],[9,53],[37,55],[22,50],[21,70],[25,84],[8,82],[39,80]],"windows":[[29,4],[16,5],[9,12],[31,13],[20,16],[42,17],[5,22],[42,31],[24,34],[5,36],[35,38],[12,43]],"supports":[[18,4],[7,14],[28,15],[14,33],[4,46],[33,45],[19,19],[12,65],[15,79],[4,75],[37,73]],"fixtures":[[20,6,"wave12-butcher-inert-inspection"],[9,16,"wave12-butcher-inert-rest"],[30,17,"wave12-butcher-inert-record"],[16,35,"wave12-butcher-inert-market"],[6,48,"wave12-butcher-inert-supply"],[35,47,"wave12-butcher-inert-route"],[21,21,"wave12-butcher-inert-display"]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"],"program":"Tall winter provisions coldhall: unequal intake lanes, deep frost rails, actual open cooling shaft, three stepped work wings and far dry rear smokehouse; animals and meat work inactive."},{"cat":"tailor","biome":"temperate","size":"large","v":4,"title":"Blueweft Crescent Loom Exchange","w":90,"d":66,"h":48,"parts":[[36,2,53,13],[11,10,38,27],[51,11,75,28],[24,22,63,37],[2,28,23,52],[65,29,87,54],[29,42,58,63],[8,49,31,64],[60,48,82,63],[16,32,76,43],[3,3,15,22],[78,3,88,23],[73,12,82,21]],"voids":[[39,26,46,33],[55,39,59,44]],"roofs":[[36,2,53,13,18,"wave12-tailor-temperate-original-bearing-0"],[11,10,38,27,21,"wave12-tailor-temperate-original-bearing-1"],[51,11,75,28,13,"wave12-tailor-temperate-original-bearing-2"],[24,22,63,37,25,"wave12-tailor-temperate-original-bearing-3"],[2,28,23,52,17,"wave12-tailor-temperate-original-bearing-4"],[65,29,87,54,23,"wave12-tailor-temperate-original-bearing-5"],[29,42,58,63,15,"wave12-tailor-temperate-original-bearing-6"],[8,49,31,64,27,"wave12-tailor-temperate-original-bearing-7"],[60,48,82,63,19,"wave12-tailor-temperate-original-bearing-8"],[16,32,76,43,11,"wave12-tailor-temperate-original-bearing-9"],[3,3,15,22,24,"wave12-tailor-temperate-original-bearing-10"],[78,3,88,23,16,"wave12-tailor-temperate-original-bearing-11"],[73,12,82,21,22,"wave12-tailor-temperate-original-bearing-12"]],"entry":[44,2],"doors":[[24,18],[63,19],[12,40],[76,41],[43,52],[19,56],[71,55],[46,37],[9,12],[83,13],[77,16]],"windows":[[12,3],[82,3],[36,6],[3,8],[53,9],[19,10],[62,11],[77,12],[43,13],[51,21],[3,22],[81,23]],"supports":[[38,4],[13,12],[53,13],[26,24],[4,30],[67,31],[31,44],[10,51],[62,50],[18,34],[5,5],[80,5],[75,14]],"fixtures":[[40,6,"wave12-tailor-inert-inspection"],[15,14,"wave12-tailor-inert-rest"],[55,15,"wave12-tailor-inert-record"],[28,26,"wave12-tailor-inert-market"],[6,32,"wave12-tailor-inert-supply"],[69,33,"wave12-tailor-inert-route"],[33,46,"wave12-tailor-inert-display"]],"uses":["sales-floor","service-counter","garment-display","fitting-area"],"program":"Large textile campus with two offset C-shaped routes, double genuine unbuilt dye courts, central loom aisle, west load cloister, right cross-weaving pavilion and a physically continuous northeastern thread bridge; crafting inactive."},{"cat":"temple","biome":"temperate","size":"medium","v":5,"title":"Riverglass Seven-Bridge Sanctum","w":64,"d":102,"h":49,"parts":[[23,2,41,16],[6,12,26,33],[40,14,57,34],[13,30,48,44],[3,43,20,70],[47,41,61,66],[24,17,39,85],[15,65,49,79],[3,75,22,97],[42,76,61,98],[21,86,45,100],[12,50,53,58]],"voids":[[29,35,34,41],[29,69,35,74]],"roofs":[[23,2,41,16,13,"wave12-temple-temperate-original-bearing-0"],[6,12,26,33,25,"wave12-temple-temperate-original-bearing-1"],[40,14,57,34,17,"wave12-temple-temperate-original-bearing-2"],[13,30,48,44,23,"wave12-temple-temperate-original-bearing-3"],[3,43,20,70,15,"wave12-temple-temperate-original-bearing-4"],[47,41,61,66,27,"wave12-temple-temperate-original-bearing-5"],[24,17,39,85,19,"wave12-temple-temperate-original-bearing-6"],[15,65,49,79,11,"wave12-temple-temperate-original-bearing-7"],[3,75,22,97,24,"wave12-temple-temperate-original-bearing-8"],[42,76,61,98,16,"wave12-temple-temperate-original-bearing-9"],[21,86,45,100,22,"wave12-temple-temperate-original-bearing-10"],[12,50,53,58,18,"wave12-temple-temperate-original-bearing-11"]],"entry":[32,2],"doors":[[16,22],[48,24],[11,56],[54,53],[31,51],[12,86],[51,87],[33,93],[32,54]],"windows":[[41,6],[23,9],[12,12],[49,14],[6,20],[57,22],[12,33],[34,34],[55,34],[8,43],[23,44],[44,44]],"supports":[[25,4],[8,14],[42,16],[15,32],[5,45],[49,43],[26,19],[17,67],[5,77],[44,78],[23,88],[14,52]],"fixtures":[[27,6,"wave12-temple-inert-inspection"],[10,16,"wave12-temple-inert-rest"],[44,18,"wave12-temple-inert-record"],[17,34,"wave12-temple-inert-market"],[7,47,"wave12-temple-inert-supply"],[51,45,"wave12-temple-inert-route"],[28,21,"wave12-temple-inert-display"]],"uses":["ceremonial-space","altar","public-circulation","ceremonial-space"],"program":"Long riverlight temple: seven traversable covered junction bridges between two real open skycourts, slender processional spine, staggered chapels and remote rear archive sanctum; ceremonies inactive."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave12 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave12 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave12 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave12-facade-glazing'});
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
export function getRoadmapBWave12B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE12_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
