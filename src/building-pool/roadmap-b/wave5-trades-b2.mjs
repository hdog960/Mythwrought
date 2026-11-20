// Roadmap B Wave5 original independent 2B architectures; source-only, producer ABI unresolved.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"cat":"temple","biome":"snow","size":"medium","v":5,"title":"Winterglass Forked Aurora Chapel","w":47,"d":49,"h":32,"parts":[[11,2,33,12],[3,10,19,31],[29,10,43,29],[13,27,38,45],[4,36,22,46],[32,31,44,42],[2,2,10,11]],"roofs":[[11,2,33,12,12,"wave5-temple-snow-0-independent-roof"],[3,10,19,31,16,"wave5-temple-snow-1-independent-roof"],[29,10,43,29,10,"wave5-temple-snow-2-independent-roof"],[13,27,38,45,21,"wave5-temple-snow-3-independent-roof"],[4,36,22,46,14,"wave5-temple-snow-4-independent-roof"],[32,31,44,42,18,"wave5-temple-snow-5-independent-roof"],[2,2,10,11,17,"northwest-pilgrims-vestibule"]],"uses":["ceremonial-space","altar","public-circulation","public-circulation"],"program":"Winterglass Forked Aurora Chapel: original asymmetrically connected snow temple with distinct public north entry, independent western hall, high eastern wing, and deep service archives; all magical/machine features inactive","entry":[22,2],"doors":[[11,20],[36,19],[25,36],[13,41],[38,36]],"windows":[[13,2],[31,2],[3,20],[43,19],[16,46],[35,45]],"supports":[[13,5],[5,13],[31,13],[15,30],[6,39],[34,34],[4,4]],"fixtures":[[14,6,"temple-wave5-symbolic-0"],[6,14,"temple-wave5-symbolic-1"],[32,14,"temple-wave5-symbolic-2"],[5,6,"northwest-pilgrims-vestibule-inactive"]]},{"cat":"butcher","biome":"mountain","size":"small","v":4,"title":"Ironpeak Thornhook Provisions","w":41,"d":43,"h":28,"parts":[[7,2,26,12],[2,10,16,29],[22,10,37,26],[10,24,31,40],[27,30,39,40],[2,29,12,40],[30,2,37,12]],"roofs":[[7,2,26,12,11,"wave5-butcher-mountain-0-independent-roof"],[2,10,16,29,19,"wave5-butcher-mountain-1-independent-roof"],[22,10,37,26,10,"wave5-butcher-mountain-2-independent-roof"],[10,24,31,40,15,"wave5-butcher-mountain-3-independent-roof"],[27,30,39,40,21,"wave5-butcher-mountain-4-independent-roof"],[2,29,12,40,13,"mountain-west-provisions-court"],[30,2,37,12,18,"mountain-north-cutting-annex"]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"],"program":"Ironpeak Thornhook Provisions: original asymmetrically connected mountain butcher with distinct public north entry, independent western hall, high eastern wing, and deep service archives; all magical/machine features inactive","entry":[16,2],"doors":[[9,19],[29,18],[20,32],[33,35]],"windows":[[9,2],[24,2],[2,19],[37,18],[13,40],[28,40]],"supports":[[9,5],[4,13],[24,13],[12,27],[29,33],[4,31],[32,4]],"fixtures":[[10,6,"butcher-wave5-symbolic-0"],[5,14,"butcher-wave5-symbolic-1"],[25,14,"butcher-wave5-symbolic-2"],[5,33,"mountain-west-provisions-court-inactive"],[33,6,"mountain-north-cutting-annex-inactive"]]},{"cat":"jeweler","biome":"enchanted-forest","size":"large","v":4,"title":"Moonlace Asymmetric Gem Archive","w":53,"d":52,"h":32,"parts":[[10,2,38,12],[2,10,17,30],[30,11,49,34],[13,26,41,46],[4,35,23,48],[30,40,48,49],[2,2,9,18],[41,33,50,48]],"roofs":[[10,2,38,12,12,"wave5-jeweler-enchanted-forest-0-independent-roof"],[2,10,17,30,10,"wave5-jeweler-enchanted-forest-1-independent-roof"],[30,11,49,34,22,"wave5-jeweler-enchanted-forest-2-independent-roof"],[13,26,41,46,15,"wave5-jeweler-enchanted-forest-3-independent-roof"],[4,35,23,48,19,"wave5-jeweler-enchanted-forest-4-independent-roof"],[30,40,48,49,11,"wave5-jeweler-enchanted-forest-5-independent-roof"],[2,2,9,18,19,"mossgem-north-sales-turret"],[41,33,50,48,13,"mossgem-east-vault-wing"]],"uses":["sales-floor","service-counter","jewelry-display","secure-workroom"],"program":"Moonlace Asymmetric Gem Archive: original asymmetrically connected enchanted-forest jeweler with distinct public north entry, independent western hall, high eastern wing, and deep service archives; all magical/machine features inactive","entry":[24,2],"doors":[[9,20],[39,22],[27,36],[13,41],[39,44]],"windows":[[12,2],[36,2],[2,20],[49,22],[16,48],[38,49]],"supports":[[12,5],[4,13],[32,14],[15,29],[6,38],[32,43],[4,4],[43,35]],"fixtures":[[13,6,"jeweler-wave5-symbolic-0"],[5,14,"jeweler-wave5-symbolic-1"],[33,15,"jeweler-wave5-symbolic-2"],[5,6,"mossgem-north-sales-turret-inactive"],[44,37,"mossgem-east-vault-wing-inactive"]]},{"cat":"theater","biome":"desert","size":"medium","v":3,"title":"Cinnabar Sunstep Caravan Playhouse","w":47,"d":50,"h":30,"parts":[[8,2,34,12],[3,11,18,32],[29,11,43,30],[15,26,39,45],[2,37,21,47],[32,35,44,46],[2,2,7,20],[35,2,44,18],[39,31,45,47],[2,31,14,47]],"roofs":[[8,2,34,12,11,"wave5-theater-desert-0-independent-roof"],[3,11,18,32,13,"wave5-theater-desert-1-independent-roof"],[29,11,43,30,20,"wave5-theater-desert-2-independent-roof"],[15,26,39,45,16,"wave5-theater-desert-3-independent-roof"],[2,37,21,47,10,"wave5-theater-desert-4-independent-roof"],[32,35,44,46,19,"wave5-theater-desert-5-independent-roof"],[2,2,7,20,12,"desert-west-ticket-arcade"],[35,2,44,18,18,"desert-east-side-gallery"],[39,31,45,47,15,"desert-rear-service-jetty"],[2,31,14,47,21,"desert-southwest-second-curtain-house"]],"uses":["public-circulation","audience-area","stage","backstage"],"program":"Cinnabar Sunstep Caravan Playhouse: original asymmetrically connected desert theater with distinct public north entry, independent western hall, high eastern wing, and deep service archives; all magical/machine features inactive","entry":[21,2],"doors":[[10,21],[36,20],[27,35],[11,42],[38,40]],"windows":[[10,2],[32,2],[3,21],[43,20],[18,47],[36,46]],"supports":[[10,5],[5,14],[31,14],[17,29],[4,40],[34,38],[4,4],[37,4],[41,33],[4,33]],"fixtures":[[11,6,"theater-wave5-symbolic-0"],[6,15,"theater-wave5-symbolic-1"],[32,15,"theater-wave5-symbolic-2"],[5,6,"desert-west-ticket-arcade-inactive"],[38,6,"desert-east-side-gallery-inactive"],[42,35,"desert-rear-service-jetty-inactive"],[5,35,"desert-southwest-second-curtain-house-inactive"]]}];

const P={stone:'pack1:002',wood:'pack2:013',beam:'pack2:015',window:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const occupied=new Map(),mask=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extras={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||occupied.has(k(x,y,z)))
   throw Error('Wave5 2B illegal occupied source XYZ '+s.title+' '+k(x,y,z));
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
  if(!inside(x,z))throw Error('Wave5 physical doorway missing footprint '+s.title+' '+g(x,z));
  for(let y=2;y<=4;y++)occupied.delete(k(x,y,z));
 }
 const windows=[];
 for(const [x,z] of s.windows){
  if(!inside(x,z)||!occupied.has(k(x,3,z)))throw Error('Unfounded Wave5 window '+s.title+' '+g(x,z));
  occupied.set(k(x,3,z),{x,y:3,z,kind:'window',material:P.window,sourceAuthor:'wave5-facade-glazing'});
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
export function getRoadmapBWave5B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE5_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.cat,s.biome,s.size,String(s.v).padStart(2,'0')].join(':')));
