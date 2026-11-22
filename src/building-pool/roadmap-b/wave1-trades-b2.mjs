// Roadmap B Wave1 — three original 2B trade/culture source models, not registered.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const SPECS=[{"c":"tailor","b":"desert","s":"large","n":4,"title":"Saffron Arch Drapers and Dyers","w":46,"d":46,"h":24,"parts":[[8,2,37,12],[2,9,16,40],[13,28,41,43],[32,12,43,36],[14,20,34,30]],"roofs":[[8,2,37,12,10,"southcloth-trade-porch"],[2,9,16,40,12,"dyers-west-windtower"],[13,28,41,43,15,"deep-rear-display-gallery"],[32,12,43,36,11,"east-cutting-rooms"],[14,20,34,30,17,"covered-diagonal-spine"]],"entry":[22,2],"doors":[[15,12],[35,13],[16,29],[35,31]],"windows":[[9,2],[36,2],[2,19],[43,23],[19,43],[38,43]],"posts":[[12,7],[33,7],[9,22],[37,22],[22,35]],"fixtures":[[8,20,"dye-vat"],[36,22,"cutting-table"],[22,37,"hanging-brocade"]],"partitions":[["z",12,9,36,[15,16,22,23,35,36]],["x",16,14,34,[20,21,29,30]]],"uses":["sales-floor","service-counter","garment-display","fitting-area"],"signature":"Split western dye court, eastern measuring workshop, elevated central canopy and long rear fabric nave with five original staggered masses"},{"c":"butcher","b":"enchanted-forest","s":"large","n":4,"title":"Mossglen Cooled Wilds Provision Hall","w":49,"d":48,"h":24,"parts":[[6,2,32,11],[3,9,18,28],[17,15,44,28],[8,27,27,43],[26,27,39,39],[35,10,46,25]],"roofs":[[6,2,32,11,11,"front-ribbed-trade-hall"],[3,9,18,28,10,"west-counter-shed"],[17,15,44,28,17,"high-hanging-prep-room"],[8,27,27,43,13,"western-cold-store"],[26,27,39,39,15,"rear-processing-platform"],[35,10,46,25,12,"eastern-forest-larder"]],"entry":[20,2],"doors":[[14,10],[29,16],[15,28],[32,31]],"windows":[[7,2],[31,2],[3,20],[46,16],[12,43],[36,39]],"posts":[[12,7],[28,7],[9,17],[37,19],[15,34],[32,33]],"fixtures":[[10,18,"trade-counter"],[25,22,"dry-workbench"],[17,36,"unpowered-cold-chest"]],"partitions":[["z",11,7,31,[14,15,20,21]],["x",18,15,28,[19,20,25,26]]],"uses":["sales-floor","service-counter","butcher-workspace","cold-storage"],"signature":"Offset stall, elevated wilds preparation wing, two separate rear cold chambers and eastern supplier sleeve with five distinct roof heights"},{"c":"bookshop","b":"snow","s":"medium","n":4,"title":"Hearthscript Split Archive and Reading Rooms","w":39,"d":46,"h":24,"parts":[[10,2,27,13],[3,10,14,36],[13,17,33,30],[25,11,36,43],[7,32,30,42]],"roofs":[[10,2,27,13,11,"front-snow-canopy"],[3,10,14,36,15,"west-page-tower"],[13,17,33,30,12,"central-gabled-reading-hall"],[25,11,36,43,17,"east-archive-roof"],[7,32,30,42,10,"rear-low-study-shed"]],"entry":[19,2],"doors":[[12,13],[27,19],[14,33],[29,34]],"windows":[[11,2],[26,2],[3,20],[36,24],[12,42],[36,42]],"posts":[[15,7],[24,7],[8,19],[29,21],[13,37]],"fixtures":[[9,23,"page-shelves"],[25,26,"reading-desks"],[31,34,"catalog-desk"]],"partitions":[["z",13,11,27,[12,13,19,20,26,27]],["x",26,20,39,[24,25,34,35]]],"uses":["sales-floor","service-counter","bookshelves","reading-area"],"signature":"Tall western book tower, snow-split reading hall, long east archive, low rear study annexe and comb-roof skyline"}];

const MATERIAL={foundation:'pack1:002',floor:'pack2:013',wall:'pack2:015',roof:'pack3:023',glass:'pack4:030',fixture:'pack5:086',decor:'pack4:035',door:'pack2:020'};
function build(s){
 const cells=new Map(),footprint=new Set(),roofMap=new Map();
 const key=(x,y,z)=>x+','+y+','+z,g=(x,z)=>x+','+z;
 const put=(x,y,z,kind,material,extra={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=s.w||y<0||y>=s.h||z<0||z>=s.d||cells.has(key(x,y,z)))
   throw Error(s.title+' invalid source cell '+key(x,y,z));
  cells.set(key(x,y,z),{x,y,z,kind,material,...extra});
 };
 const has=(x,z)=>footprint.has(g(x,z));
 for(const [x0,z0,x1,z1] of s.parts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)footprint.add(g(x,z));
 for(const item of footprint){
  const [x,z]=item.split(',').map(Number);
  put(x,0,z,'foundation',MATERIAL.foundation);
  put(x,1,z,'floor',x%7===0?'pack1:005':MATERIAL.floor);
  if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz)))
   for(let y=2;y<=7;y++)put(x,y,z,'wall',MATERIAL.wall,{purpose:'source-shell'});
 }
 for(const [axis,n,a,c,gates] of s.partitions)for(let v=a;v<=c;v++){
  const x=axis==='x'?n:v,z=axis==='x'?v:n;
  if(!has(x,z)||gates.includes(v))continue;
  for(let y=2;y<=5;y++)if(!cells.has(key(x,y,z)))put(x,y,z,'wall',MATERIAL.wall,{purpose:'actual-interior-divider'});
 }
 for(const [x0,z0,x1,z1,base,profile] of s.roofs)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z)||roofMap.has(g(x,z)))continue;
  const elevation=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/4);
  roofMap.set(g(x,z),elevation);
  put(x,elevation,z,'roof',s.b==='snow'?'pack3:025':s.b==='enchanted-forest'?'pack3:026':MATERIAL.roof,{profile,physicalProducerApproved:false});
 }
 const grounded=[];
 for(const [x,z] of s.posts){
  const top=roofMap.get(g(x,z));if(!top||!has(x,z))throw Error('Ungrounded post '+g(x,z));
  let placed=0;for(let y=2;y<top;y++)if(!cells.has(key(x,y,z))){put(x,y,z,'wall',MATERIAL.wall,{purpose:'source-grounded-bearing-post'});placed++;}
  grounded.push({x,z,roofElevation:top,placed});
 }
 for(const [x,z,purpose] of s.fixtures)if(has(x,z)&&!cells.has(key(x,2,z)))put(x,2,z,'fixture',MATERIAL.fixture,{purpose});
 for(const [x,z] of [[s.entry[0]+2,6],[s.entry[0]-2,6]])if(has(x,z)&&!cells.has(key(x,2,z)))
  put(x,2,z,'decor',MATERIAL.decor,{purpose:'unlit-reference-light'});
 const openDoor=(x,z)=>{if(!has(x,z))throw Error('Door not source-backed '+g(x,z));for(let y=2;y<=4;y++)cells.delete(key(x,y,z));};
 openDoor(...s.entry);for(const port of s.doors)openDoor(...port);
 const windows=[];
 for(const [x,z] of s.windows){
  if(!cells.has(key(x,3,z)))throw Error('Unframed pane '+g(x,z));
  cells.set(key(x,3,z),{x,y:3,z,kind:'window',material:MATERIAL.glass,purpose:'physical-source-pane'});
  windows.push({type:'window',x,y:3,z,material:MATERIAL.glass});
 }
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const materials=[...new Set([...voxels.map(v=>v.material),MATERIAL.door])].sort(),uses=s.uses;
 const bp={schema:SCHEMA,id:['r2',s.c,s.b,s.s,String(s.n).padStart(2,'0')].join(':'),
  title:s.title,category:s.c,biome:s.b,size:s.s,variation:s.n,
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:s.w,y:s.h,z:s.d},units:'authored exact integer XYZ occupied voxels; physical producer ABI unresolved',
  architecturalSignature:s.signature,roof:{form:s.roofs.map(r=>r[5]).join(' + '),biomeSpecific:true},
  footprintRectangles:s.parts,rooms:[
   {name:'Public trade entry',uses:[uses[0]],bounds:{x0:s.entry[0]-5,x1:s.entry[0]+5,z0:2,z1:12}},
   {name:'Specialty counter',uses:[uses[1]],bounds:{x0:4,x1:19,z0:12,z1:27}},
   {name:'Dedicated workroom',uses:[uses[2]],bounds:{x0:16,x1:35,z0:18,z1:32}},
   {name:'Private specialty annex',uses:[uses[3]],bounds:{x0:11,x1:34,z0:29,z1:41}}],
  circulation:[{from:'exterior',to:uses[0],via:'source-clear three-high public gate'},
   {from:uses[0],to:uses[1],via:'occupied gallery with three-high door clearance'},
   {from:uses[1],to:uses[2],via:'physical central cross-gallery'},
   {from:uses[2],to:uses[3],via:'roofed rear offset passage'}],
  openings:[{type:'entrance',x:s.entry[0],y:2,z:s.entry[1],clearHeightCells:3,doorSymbol:MATERIAL.door,doorOpenState:'unverified'},
   ...s.doors.map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3})),...windows],
  features:[...uses,'source-occupied-nonrectangular-massing','physical-open-rooms'],
  routeTargets:[{x:s.entry[0],z:s.entry[1],purpose:'street-gate'},...s.doors.map(([x,z],i)=>({x,z,purpose:'gallery-'+i}))],
  sourceSupportAudits:grounded,unresolvedDependencies:materials.map(ref=>({ref,issue:'Producer shape/variant/yaw, AABB, load-bearing support, glazing and schema-1 integration not approved'})),
  sourceCoordinateAuthoring:true,worldRegistration:false,creatorApproval:false,voxels};
 validateBlueprint(bp);return Object.freeze(bp);
}
export function getRoadmapBWave1B2(){return SPECS.map(build);}
export const ROADMAP_B_WAVE1_B2_IDS=Object.freeze(SPECS.map(s=>['r2',s.c,s.b,s.s,String(s.n).padStart(2,'0')].join(':')));
