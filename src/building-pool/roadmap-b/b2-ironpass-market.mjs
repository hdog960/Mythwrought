// Roadmap B B2: an original high-altitude market, authored as occupied XYZ cells.
// This is not registered in the 146-design accepted census until full source
// validation, D4 comparisons, producer physical truth, and Chromium review.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';

export function createIronpassHorseshoeExchange(){
 const W=39,D=43,H=22, cells=new Map(),footprint=new Set(),roofMap=new Map();
 const k=(x,y,z)=>x+','+y+','+z, g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extra={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=W||y<0||y>=H||z<0||z>=D||cells.has(k(x,y,z)))
   throw Error('Invalid Ironpass physical cell '+k(x,y,z));
  cells.set(k(x,y,z),{x,y,z,kind,material,...extra});
 };
 const has=(x,z)=>footprint.has(g(x,z));
 const parts=[
  [5,2,33,11],    // double public entry and exchange hall
  [2,10,13,37],   // mountain west stonemason and supply terrace
  [27,10,36,31],  // east winter cloth and high forage gallery
  [10,31,34,40],  // rear protected mountain merchant arcade
  [10,26,30,32],  // independent south-facing narrow return bridge
  [33,27,38,41]    // extra northeast cliff-ledger gallery: new physical footprint
 ];
 for(const [x0,z0,x1,z1] of parts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  footprint.add(g(x,z));
 for(const s of footprint){
  const [x,z]=s.split(',').map(Number);
  put(x,0,z,'foundation','pack1:002');put(x,1,z,'floor',z<12?'pack1:005':'pack2:013');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=2;y<=7;y++)put(x,y,z,'wall','pack2:015');
 }
 // Wall divisions are real, with deliberately different two-wide public gates.
 for(const [axis,n,a,c,doors] of [
  ['z',10,6,32,[12,13,29,30]],
  ['x',12,14,30,[18,19,26,27]],
  ['x',29,13,31,[20,21]],
  ['z',32,11,33,[17,18,29,30]]
 ])for(let q=a;q<=c;q++){
  const x=axis==='x'?n:q,z=axis==='x'?q:n;
  if(!has(x,z)||doors.includes(q))continue;
  for(let y=2;y<=6;y++)if(!cells.has(k(x,y,z)))put(x,y,z,'wall','pack1:002',{function:'partition'});
 }
 const roofs=[
  [5,2,33,11,11,'four-line-front-trading-hall','pack3:023'],
  [2,10,13,37,10,'low-staggered-west-cliff','pack3:025'],
  [27,10,36,31,14,'high-east-caravan-ridge','pack3:023'],
  [10,31,34,40,12,'rear-arcade-forked-roof','pack3:025'],
  [10,26,30,32,13,'crossing-spine-bridged-truss','pack3:023'],
  [33,27,38,41,16,'new-cliff-ledger-annex-hip','pack3:025']
 ];
 for(const [x0,z0,x1,z1,base,form,material] of roofs)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z)||roofMap.has(g(x,z)))continue;
  const y=base+Math.floor(Math.min(x-x0,x1-x)/4);
  roofMap.set(g(x,z),y);put(x,y,z,'roof',material,{profile:form,sourceBearingNotProducerCertified:true});
 }
 const cutDoor=(x,z)=>{
  if(!has(x,z))throw Error('Door outside authored Ironpass source '+g(x,z));
  for(let y=2;y<=4;y++)cells.delete(k(x,y,z));
 };
 const doorCoords=[[19,2],[12,10],[30,10],[12,19],[29,21],[18,32],[29,32]];
 for(const [x,z] of doorCoords)cutDoor(x,z);
 const windows=[];
 for(const [x,z,face] of [[8,2,'north'],[29,2,'north'],[2,20,'west'],[36,19,'east'],[15,40,'south'],[30,40,'south']]){
  if(!has(x,z)||!cells.has(k(x,3,z)))throw Error('Window not supported '+g(x,z));
  cells.set(k(x,3,z),{x,y:3,z,kind:'window',material:'pack4:030',face});
  windows.push({type:'window',x,y:3,z,material:'pack4:030'});
 }
 const supports=[];
 for(const [x,z] of [[10,5],[27,5],[7,17],[8,28],[32,16],[32,26],[14,35],[23,35],[30,36],[36,34]]){
  const upper=roofMap.get(g(x,z));
  if(!upper||!has(x,z))throw Error('Missing Ironpass roof support '+g(x,z));
  let p=0;
  for(let y=2;y<upper;y++)if(!cells.has(k(x,y,z))){put(x,y,z,'wall','pack1:002',{sourceBearing:true});p++;}
  supports.push({x,z,upper,placedCells:p});
 }
 // Physical fixtures are genuinely placed and outside the standing routes.
 for(const [x,z,kind,material] of [
  [8,18,'unlit-mountain-trade-firepit','pack4:059'],
  [8,24,'open-air-ore-counter','pack5:086'],
  [31,16,'folded-fabric-storage','pack5:087'],
  [31,25,'winter-feed-ledger','pack4:057'],
  [17,35,'mountain-tool-stand','pack4:057'],
  [25,35,'weathered-signage','pack4:061'],
   [36,36,'caravan-ledger-reading-bench','pack4:057']
 ])if(has(x,z)&&!cells.has(k(x,2,z)))put(x,2,z,'fixture',material,{purpose:kind});
 for(const [x,z] of [[15,6],[22,6],[6,28],[34,27],[24,36]])if(has(x,z)&&!cells.has(k(x,2,z)))
  put(x,2,z,'decor','pack4:035',{purpose:'unlit-wayfinding-light'});
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const materialRefs=new Set([...voxels.map(v=>v.material),'pack2:020']);
 const building={
  schema:SCHEMA,id:'r2:market-square:mountain:medium:03',category:'market-square',
  biome:'mountain',size:'medium',variation:3,title:'Ironpass Broken-Horseshoe Mountain Exchange',
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:W,y:H,z:D},units:'integer physical source-cell anchors, producer ABI not certified',
  architecturalSignature:'original steep asymmetric mountain longhouse, cliff market wings, undercut sky-open court, high narrow east caravan gallery and distinctive northeast cliff-ledger annex',
  roof:{form:'six independent four-height roof masses with northeast cliff-ledger annex',biomeSpecific:true},
  rooms:[
   {name:'Front public mountain trade hall',uses:['square','public-circulation'],bounds:{x0:6,x1:32,z0:3,z1:10}},
   {name:'Western individual quarry and food sellers',uses:['vendor-stalls'],bounds:{x0:3,x1:12,z0:11,z1:35}},
   {name:'Eastern covered winter supply',uses:['vendor-stalls','public-circulation'],bounds:{x0:28,x1:35,z0:11,z1:30}},
   {name:'Rear linked shelter corridor',uses:['public-circulation'],bounds:{x0:12,x1:33,z0:32,z1:39}},
    {name:'Northeast overcliff ledgers',uses:['public-circulation'],bounds:{x0:34,x1:38,z0:30,z1:41}}
  ],
  circulation:[
   {from:'exterior',to:'square',via:'physical three-high northern mountain gate'},
   {from:'square',to:'vendor-stalls',via:'two separate two-wide covered gallery passages'},
   {from:'vendor-stalls',to:'public-circulation',via:'roofed rear horseshoe crosswalk'}
  ],
  openings:[
   {type:'entrance',x:19,y:2,z:2,clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'},
   ...windows,
   ...doorCoords.slice(1).map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3}))
  ],
  features:['square','vendor-stalls','public-circulation','true open sky between supported mountain trade wings'],
  routeTargets:[{x:19,z:2,label:'street entrance'},{x:8,z:23,label:'west stalls'},
    {x:31,z:18,label:'east caravan gallery'},{x:20,z:35,label:'rear market link'},
    {x:36,z:35,label:'new physical cliff-ledger annex'}],
  intentionallyOpenRoof:[{x0:14,x1:26,z0:14,z1:25,groundAbsent:true}],
  symbolicStairApproaches:[],
  unresolvedDependencies:[...materialRefs].sort().map(ref=>({ref,issue:
   'Exact source producer variant/yaw, offsets/multicell AABB, actual support/collision and schema-1 placement must be verified separately'})),
  sourceSupportAudits:supports,
  voxels
 };
 validateBlueprint(building);
 return Object.freeze(building);
}
