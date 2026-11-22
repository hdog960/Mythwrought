// Roadmap B Wave14 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"bookshop","biome":"enchanted-forest","size":"large","v":4,"title":"Thornwisp Triple-Arc Atlas Hall","w":119,"d":69,"h":52,"parts":[[45,2,72,15],[13,10,49,28],[68,11,104,30],[25,26,93,43],[2,34,30,63],[89,35,115,65],[32,43,56,66],[60,45,91,66],[4,3,22,25],[97,3,116,25],[28,33,93,50],[44,48,76,67]],"voids":[[54,30,63,37],[44,49,50,55]],"roofs":[[45,2,72,15,14,"wave14-bookshop-enchanted-forest-original-supported-roof-0"],[13,10,49,28,23,"wave14-bookshop-enchanted-forest-original-supported-roof-1"],[68,11,104,30,18,"wave14-bookshop-enchanted-forest-original-supported-roof-2"],[25,26,93,43,26,"wave14-bookshop-enchanted-forest-original-supported-roof-3"],[2,34,30,63,12,"wave14-bookshop-enchanted-forest-original-supported-roof-4"],[89,35,115,65,24,"wave14-bookshop-enchanted-forest-original-supported-roof-5"],[32,43,56,66,15,"wave14-bookshop-enchanted-forest-original-supported-roof-6"],[60,45,91,66,29,"wave14-bookshop-enchanted-forest-original-supported-roof-7"],[4,3,22,25,19,"wave14-bookshop-enchanted-forest-original-supported-roof-8"],[97,3,116,25,11,"wave14-bookshop-enchanted-forest-original-supported-roof-9"],[28,33,93,50,22,"wave14-bookshop-enchanted-forest-original-supported-roof-10"],[44,48,76,67,16,"wave14-bookshop-enchanted-forest-original-supported-roof-11"]],"entry":[58,2],"doors":[[31,19],[86,20],[16,48],[102,50],[75,55],[13,14],[106,14],[60,41],[60,57]],"windows":[[10,3],[45,3],[101,3],[115,3],[72,6],[22,9],[38,10],[82,11],[96,11],[4,14],[116,14],[55,15]],"supports":[[47,4],[15,12],[70,13],[27,28],[4,36],[91,37],[34,45],[62,47],[6,5],[99,5],[30,35]],"fixtures":[[49,6,"wave14-bookshop-inert-records"],[17,14,"wave14-bookshop-inert-access"],[72,15,"wave14-bookshop-inert-inventory"],[29,30,"wave14-bookshop-inert-storage"],[6,38,"wave14-bookshop-inert-wayfinding"],[93,39,"wave14-bookshop-inert-display"],[36,47,"wave14-bookshop-inert-work"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"program":"Three offset enchanted scriptoria under arching roof masses, two source-empty light courts, separate catalog hall and broad rear mapmaker's hall; NPCs and books inert."},{"cat":"jeweler","biome":"temperate","size":"small","v":4,"title":"Sunglass Meander Gemwright Studio","w":58,"d":105,"h":50,"parts":[[21,2,38,17],[4,12,23,31],[35,15,54,39],[14,29,43,46],[2,42,18,65],[40,44,56,71],[19,46,39,86],[6,70,26,102],[32,80,55,103],[22,16,33,102],[4,3,14,20]],"voids":[[24,43,30,49],[26,70,32,76]],"roofs":[[21,2,38,17,26,"wave14-jeweler-temperate-original-supported-roof-0"],[4,12,23,31,12,"wave14-jeweler-temperate-original-supported-roof-1"],[35,15,54,39,24,"wave14-jeweler-temperate-original-supported-roof-2"],[14,29,43,46,15,"wave14-jeweler-temperate-original-supported-roof-3"],[2,42,18,65,29,"wave14-jeweler-temperate-original-supported-roof-4"],[40,44,56,71,19,"wave14-jeweler-temperate-original-supported-roof-5"],[19,46,39,86,11,"wave14-jeweler-temperate-original-supported-roof-6"],[6,70,26,102,22,"wave14-jeweler-temperate-original-supported-roof-7"],[32,80,55,103,16,"wave14-jeweler-temperate-original-supported-roof-8"],[22,16,33,102,28,"wave14-jeweler-temperate-original-supported-roof-9"],[4,3,14,20,20,"wave14-jeweler-temperate-original-supported-roof-10"]],"entry":[29,2],"doors":[[13,21],[44,27],[28,37],[10,53],[48,57],[29,66],[16,86],[43,91],[27,59],[9,11]],"windows":[[4,3],[38,6],[14,8],[42,15],[4,17],[33,21],[54,21],[4,31],[54,35],[14,36],[43,40],[5,42]],"supports":[[23,4],[6,14],[37,17],[16,31],[4,44],[42,46],[21,48],[8,72],[34,82],[24,18],[6,5]],"fixtures":[[25,6,"wave14-jeweler-inert-records"],[8,16,"wave14-jeweler-inert-access"],[39,19,"wave14-jeweler-inert-inventory"],[18,33,"wave14-jeweler-inert-storage"],[6,46,"wave14-jeweler-inert-wayfinding"],[44,48,"wave14-jeweler-inert-display"],[23,50,"wave14-jeweler-inert-work"]],"uses":["sales-floor","service-counter","jewelry-display","secure-workroom"],"program":"Long meandering river-gem workshop with offset low repair pavilion, two literal courtyard openings, an axial stone observation gallery and separated rear secure rooms; jewelry economy inactive."},{"cat":"temple","biome":"mountain","size":"large","v":5,"title":"Stormbell Seven-Traverse Mountain Shrine","w":111,"d":83,"h":52,"parts":[[44,2,66,16],[15,10,46,27],[67,12,95,29],[27,26,83,40],[3,39,29,63],[85,38,108,64],[35,42,75,73],[9,63,38,80],[74,65,105,80],[28,72,81,81],[4,3,20,22],[96,3,109,23],[24,36,88,49]],"voids":[[52,30,60,36],[47,59,55,65]],"roofs":[[44,2,66,16,15,"wave14-temple-mountain-original-supported-roof-0"],[15,10,46,27,29,"wave14-temple-mountain-original-supported-roof-1"],[67,12,95,29,19,"wave14-temple-mountain-original-supported-roof-2"],[27,26,83,40,11,"wave14-temple-mountain-original-supported-roof-3"],[3,39,29,63,22,"wave14-temple-mountain-original-supported-roof-4"],[85,38,108,64,16,"wave14-temple-mountain-original-supported-roof-5"],[35,42,75,73,28,"wave14-temple-mountain-original-supported-roof-6"],[9,63,38,80,20,"wave14-temple-mountain-original-supported-roof-7"],[74,65,105,80,14,"wave14-temple-mountain-original-supported-roof-8"],[28,72,81,81,23,"wave14-temple-mountain-original-supported-roof-9"],[4,3,20,22,18,"wave14-temple-mountain-original-supported-roof-10"],[96,3,109,23,26,"wave14-temple-mountain-original-supported-roof-11"],[24,36,88,49,12,"wave14-temple-mountain-original-supported-roof-12"]],"entry":[55,2],"doors":[[30,18],[81,20],[16,51],[96,51],[55,57],[23,71],[89,72],[54,76],[12,12],[102,13],[56,42]],"windows":[[5,3],[19,3],[96,3],[44,5],[66,9],[26,10],[79,12],[93,12],[52,16],[4,20],[67,20],[101,23]],"supports":[[46,4],[17,12],[69,14],[29,28],[5,41],[87,40],[37,44],[11,65],[76,67],[30,74],[6,5],[98,5],[26,38]],"fixtures":[[48,6,"wave14-temple-inert-records"],[19,14,"wave14-temple-inert-access"],[71,16,"wave14-temple-inert-inventory"],[31,30,"wave14-temple-inert-storage"],[7,43,"wave14-temple-inert-wayfinding"],[89,42,"wave14-temple-inert-display"],[39,46,"wave14-temple-inert-work"]],"uses":["ceremonial-space","altar","public-circulation","ceremonial-space"],"program":"High mountain temple with seven sheltered ritual traverses, twin source-empty sky observatories, a genuinely long stone processional middle spine, two rear bell shrines and split pilgrim arcades; ceremonies inactive."},{"cat":"butcher","biome":"desert","size":"medium","v":4,"title":"Redmesa Needle-Reach Provision Yard","w":69,"d":110,"h":50,"parts":[[25,2,43,17],[5,13,28,37],[39,14,65,36],[17,31,50,49],[2,48,20,75],[50,44,66,77],[23,46,43,95],[4,76,29,106],[37,77,64,108],[19,94,48,108],[28,17,38,99]],"voids":[[29,38,34,45],[29,73,34,80]],"roofs":[[25,2,43,17,11,"wave14-butcher-desert-original-supported-roof-0"],[5,13,28,37,22,"wave14-butcher-desert-original-supported-roof-1"],[39,14,65,36,16,"wave14-butcher-desert-original-supported-roof-2"],[17,31,50,49,28,"wave14-butcher-desert-original-supported-roof-3"],[2,48,20,75,20,"wave14-butcher-desert-original-supported-roof-4"],[50,44,66,77,14,"wave14-butcher-desert-original-supported-roof-5"],[23,46,43,95,23,"wave14-butcher-desert-original-supported-roof-6"],[4,76,29,106,18,"wave14-butcher-desert-original-supported-roof-7"],[37,77,64,108,26,"wave14-butcher-desert-original-supported-roof-8"],[19,94,48,108,12,"wave14-butcher-desert-original-supported-roof-9"],[28,17,38,99,24,"wave14-butcher-desert-original-supported-roof-10"]],"entry":[34,2],"doors":[[16,25],[52,25],[11,61],[58,60],[33,70],[16,91],[50,92],[33,101],[33,58]],"windows":[[43,4],[25,9],[5,13],[49,14],[63,14],[5,27],[65,29],[51,36],[11,37],[32,37],[60,44],[29,46]],"supports":[[27,4],[7,15],[41,16],[19,33],[4,50],[52,46],[25,48],[6,78],[39,79],[21,96],[30,19]],"fixtures":[[29,6,"wave14-butcher-inert-records"],[9,17,"wave14-butcher-inert-access"],[43,18,"wave14-butcher-inert-inventory"],[21,35,"wave14-butcher-inert-storage"],[6,52,"wave14-butcher-inert-wayfinding"],[54,48,"wave14-butcher-inert-display"],[27,50,"wave14-butcher-inert-work"]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"],"program":"Long desert provision yard with slender center cooling spine, uneven west and east shade halls, actual unbuilt drying shafts and distant cross-ridge storage porch; food work inactive."}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave14 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave14 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave14 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave14-facade-glazing'});
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
export function getRoadmapBWave14B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE14_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
