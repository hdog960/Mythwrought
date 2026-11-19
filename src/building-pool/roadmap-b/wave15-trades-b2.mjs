// Roadmap B Wave15 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"butcher","biome":"mountain","size":"medium","title":"Granitefold Carved-Gorge Provisions","w":124,"d":115,"h":55,"parts":[[45,2,68,16],[10,12,44,34],[66,17,103,35],[25,28,89,44],[4,43,27,70],[93,41,121,66],[32,52,54,87],[65,48,87,95],[8,83,39,110],[84,78,115,111],[46,33,67,112],[32,97,97,112],[83,37,100,45]],"voids":[[56,58,61,66],[52,83,60,88]],"roofs":[[45,2,68,16,17,"wave15-butcher-mountain-original-supported-roof-0"],[10,12,44,34,24,"wave15-butcher-mountain-original-supported-roof-1"],[66,17,103,35,12,"wave15-butcher-mountain-original-supported-roof-2"],[25,28,89,44,19,"wave15-butcher-mountain-original-supported-roof-3"],[4,43,27,70,26,"wave15-butcher-mountain-original-supported-roof-4"],[93,41,121,66,14,"wave15-butcher-mountain-original-supported-roof-5"],[32,52,54,87,21,"wave15-butcher-mountain-original-supported-roof-6"],[65,48,87,95,28,"wave15-butcher-mountain-original-supported-roof-7"],[8,83,39,110,16,"wave15-butcher-mountain-original-supported-roof-8"],[84,78,115,111,23,"wave15-butcher-mountain-original-supported-roof-9"],[46,33,67,112,11,"wave15-butcher-mountain-original-supported-roof-10"],[32,97,97,112,18,"wave15-butcher-mountain-original-supported-roof-11"],[83,37,100,45,25,"wave15-butcher-mountain-original-supported-roof-12"]],"program":"High gorge meat exchange with cross-ridge halls, two open cooling clefts and independently sheltered storage aisles; trade and food decay inert.","v":4,"entry":[56,2],"doors":[[27,23],[84,26],[57,36],[15,56],[107,53],[43,69],[76,71],[23,96],[99,94],[56,72],[64,104],[91,41]],"windows":[[45,2],[12,12],[47,16],[89,17],[10,25],[10,33],[97,37],[13,43],[79,44],[76,48],[41,52],[121,57],[32,63],[108,66]],"supports":[[47,4],[12,14],[68,19],[27,30],[6,45],[95,43],[34,54],[67,50],[10,85],[86,80],[48,35],[34,99],[85,39]],"fixtures":[[59,13,"wave15-butcher-inert-records"],[30,27,"wave15-butcher-inert-access"],[87,30,"wave15-butcher-inert-inventory"],[60,40,"wave15-butcher-inert-storage"],[18,60,"wave15-butcher-inert-wayfinding"],[110,57,"wave15-butcher-inert-display"],[46,73,"wave15-butcher-inert-work"]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"]},{"cat":"theater","biome":"temperate","size":"large","title":"Riverstar Half-Moon Festival Stage","w":96,"d":135,"h":55,"parts":[[37,2,57,19],[9,14,38,34],[55,15,89,43],[25,30,72,55],[4,51,27,82],[70,56,93,89],[18,70,53,105],[51,88,82,126],[4,109,37,131],[68,112,93,132],[34,16,62,132]],"voids":[[41,42,48,51],[40,81,46,91]],"roofs":[[37,2,57,19,22,"wave15-theater-temperate-original-supported-roof-0"],[9,14,38,34,29,"wave15-theater-temperate-original-supported-roof-1"],[55,15,89,43,17,"wave15-theater-temperate-original-supported-roof-2"],[25,30,72,55,24,"wave15-theater-temperate-original-supported-roof-3"],[4,51,27,82,12,"wave15-theater-temperate-original-supported-roof-4"],[70,56,93,89,19,"wave15-theater-temperate-original-supported-roof-5"],[18,70,53,105,26,"wave15-theater-temperate-original-supported-roof-6"],[51,88,82,126,14,"wave15-theater-temperate-original-supported-roof-7"],[4,109,37,131,21,"wave15-theater-temperate-original-supported-roof-8"],[68,112,93,132,28,"wave15-theater-temperate-original-supported-roof-9"],[34,16,62,132,16,"wave15-theater-temperate-original-supported-roof-10"]],"program":"Long riverfront festival theatre with unequal balcony wings, open rehearsal courts, separate backstage and supported central audience aisle; performances inert.","v":3,"entry":[47,2],"doors":[[23,24],[72,29],[25,30],[15,66],[81,72],[35,87],[66,107],[20,120],[80,122],[48,74]],"windows":[[37,2],[57,10],[57,14],[89,16],[9,34],[46,41],[72,45],[18,51],[67,55],[93,57],[70,63],[62,69],[70,76],[8,82]],"supports":[[39,4],[11,16],[57,17],[27,32],[6,53],[72,58],[20,72],[53,90],[6,111],[70,114],[36,18]],"fixtures":[[50,14,"wave15-theater-inert-records"],[26,28,"wave15-theater-inert-access"],[75,33,"wave15-theater-inert-inventory"],[51,46,"wave15-theater-inert-storage"],[18,70,"wave15-theater-inert-wayfinding"],[84,76,"wave15-theater-inert-display"],[38,91,"wave15-theater-inert-work"]],"uses":["stage","audience-area","backstage","public-circulation"]},{"cat":"temple","biome":"enchanted-forest","size":"medium","title":"Elderbranch Five-Bough Pilgrim Shrine","w":142,"d":71,"h":55,"parts":[[56,2,86,17],[19,11,58,30],[87,14,128,32],[38,27,105,45],[3,38,39,64],[106,37,139,65],[26,47,70,68],[78,48,119,68],[8,3,24,25],[119,3,138,26],[55,18,88,67]],"voids":[[66,31,75,39],[59,52,67,59]],"roofs":[[56,2,86,17,27,"wave15-temple-enchanted-forest-original-supported-roof-0"],[19,11,58,30,15,"wave15-temple-enchanted-forest-original-supported-roof-1"],[87,14,128,32,22,"wave15-temple-enchanted-forest-original-supported-roof-2"],[38,27,105,45,29,"wave15-temple-enchanted-forest-original-supported-roof-3"],[3,38,39,64,17,"wave15-temple-enchanted-forest-original-supported-roof-4"],[106,37,139,65,24,"wave15-temple-enchanted-forest-original-supported-roof-5"],[26,47,70,68,12,"wave15-temple-enchanted-forest-original-supported-roof-6"],[78,48,119,68,19,"wave15-temple-enchanted-forest-original-supported-roof-7"],[8,3,24,25,26,"wave15-temple-enchanted-forest-original-supported-roof-8"],[119,3,138,26,14,"wave15-temple-enchanted-forest-original-supported-roof-9"],[55,18,88,67,21,"wave15-temple-enchanted-forest-original-supported-roof-10"]],"program":"Wide mystic forest cloister with five distinct side sanctuaries, canopy-clear light courts and grounded procession hall; rituals inert.","v":5,"entry":[71,2],"doors":[[38,20],[107,23],[38,27],[21,51],[122,51],[48,57],[98,58],[16,14],[128,14],[71,42]],"windows":[[56,2],[9,3],[132,3],[8,8],[37,11],[87,14],[118,14],[17,25],[30,30],[111,32],[65,36],[131,37],[25,38],[139,40]],"supports":[[58,4],[21,13],[89,16],[40,29],[5,40],[108,39],[28,49],[80,50],[10,5],[121,5],[57,20]],"fixtures":[[74,13,"wave15-temple-inert-records"],[41,24,"wave15-temple-inert-access"],[110,27,"wave15-temple-inert-inventory"],[74,40,"wave15-temple-inert-storage"],[24,55,"wave15-temple-inert-wayfinding"],[125,55,"wave15-temple-inert-display"],[51,61,"wave15-temple-inert-work"]],"uses":["ceremonial-space","altar","public-circulation","sanctuary"]},{"cat":"bookshop","biome":"snow","size":"small","title":"Frostglass Zigzag Scriptoria","w":81,"d":124,"h":55,"parts":[[30,2,50,17],[7,14,31,36],[49,13,73,34],[21,33,58,54],[2,51,26,79],[56,52,78,83],[18,76,42,107],[40,79,67,118],[6,105,26,120],[60,105,78,121],[28,18,54,120]],"voids":[[33,41,40,50],[33,74,40,82]],"roofs":[[30,2,50,17,13,"wave15-bookshop-snow-original-supported-roof-0"],[7,14,31,36,20,"wave15-bookshop-snow-original-supported-roof-1"],[49,13,73,34,27,"wave15-bookshop-snow-original-supported-roof-2"],[21,33,58,54,15,"wave15-bookshop-snow-original-supported-roof-3"],[2,51,26,79,22,"wave15-bookshop-snow-original-supported-roof-4"],[56,52,78,83,29,"wave15-bookshop-snow-original-supported-roof-5"],[18,76,42,107,17,"wave15-bookshop-snow-original-supported-roof-6"],[40,79,67,118,24,"wave15-bookshop-snow-original-supported-roof-7"],[6,105,26,120,12,"wave15-bookshop-snow-original-supported-roof-8"],[60,105,78,121,19,"wave15-bookshop-snow-original-supported-roof-9"],[28,18,54,120,26,"wave15-bookshop-snow-original-supported-roof-10"]],"program":"Long angular winter bookhouse with two open snowlight shafts, source-supported arcades and rear reading retreat; books inert.","v":4,"entry":[40,2],"doors":[[19,25],[61,23],[21,33],[14,65],[67,67],[30,91],[53,98],[16,112],[69,113],[41,69]],"windows":[[30,2],[30,8],[70,13],[7,16],[7,31],[13,36],[32,42],[58,49],[39,51],[2,55],[2,60],[2,65],[2,70],[56,73]],"supports":[[32,4],[9,16],[51,15],[23,35],[4,53],[58,54],[20,78],[42,81],[8,107],[62,107],[30,20]],"fixtures":[[43,13,"wave15-bookshop-inert-records"],[22,29,"wave15-bookshop-inert-access"],[64,27,"wave15-bookshop-inert-inventory"],[42,47,"wave15-bookshop-inert-storage"],[17,69,"wave15-bookshop-inert-wayfinding"],[70,71,"wave15-bookshop-inert-display"],[33,95,"wave15-bookshop-inert-work"]],"uses":["sales-floor","service-counter","bookshelves","reading-area"]}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave15 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave15 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave15 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave15-facade-glazing'});
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
export function getRoadmapBWave15B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE15_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
