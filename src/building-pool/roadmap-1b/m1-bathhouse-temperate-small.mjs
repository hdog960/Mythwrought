// M1 first ORIGINAL (not carried from #121) full-coordinate single-level bathhouse.
// Temperate small public baths: dry changing zone, heated dry room, wash/service, and
// open stone basin. No water/heat/plumbing simulation or runtime placement.
// Every repeated placement is an actual integer voxel coordinate in a fixed physical plan.
import {SCHEMA,validateBlueprint,stableBlueprintJSON,structuralFingerprint} from './legacy-stable-schema.mjs';
import {blueprintId,validateAllocation} from './schema.mjs';
const FULL=Object.freeze({kind:'full-cell',bounds:[0,0,0,1,1,1]});
const occupancy=asset=>asset.startsWith('live:')?FULL:{
 kind:'unresolved',bounds:null,
 reason:asset+' still requires exact physical orientation, cell envelope, support and schema-1 compatibility verification'
};
const K=(x,y,z)=>x+','+y+','+z;
export function createTemperateSmallBathhouse(){
 const W=15,H=9,D=17, placed=new Map();
 const add=(x,y,z,role,asset='live:wood',orientation='none',extra={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||y<0||z<0||x>=W||y>=H||z>=D)throw Error('bathhouse out-of-bounds cell');
  const k=K(x,y,z);if(placed.has(k))throw Error('bathhouse conflicting physical cell '+k);
  placed.set(k,{at:[x,y,z],role,asset,orientation,occupancy:occupancy(asset),...extra});
 };
 const remove=(x,y,z)=>placed.delete(K(x,y,z));
 const clear=(x,y,z)=>!placed.has(K(x,y,z));
 // Stone base, continuous weather-bearing perimeter; deliberately fixed footprint.
 for(let x=0;x<W;x++)for(let z=0;z<D;z++)add(x,0,z,'foundation','live:stone');
 for(let y=1;y<=4;y++){
  for(let x=1;x<=13;x++)for(const z of [1,15])add(x,y,z,'wall','live:wood');
  for(let z=2;z<=14;z++)for(const x of [1,13])add(x,y,z,'wall','live:wood');
 }
 // Open NORTH-facing, two-block-high public entrance, with solid lintel overhead.
 for(const y of [1,2])remove(7,y,1);
 // Glazed facade openings: physical authored cells, final pane AABB still unresolved.
 for(const [x,z,face] of [[3,1,'north'],[11,1,'north'],[3,15,'south'],[11,15,'south'],[1,4,'west'],[13,4,'east'],[1,9,'west'],[13,9,'east']]){
  remove(x,2,z);add(x,2,z,'window','pack4:030',face,{glazingApproved:false});
 }
 // Doors in REAL three-cell-high wall partitions, not fictional text-only room labels.
 const gap1=new Set(['4,6','9,6','7,11']);
 for(let y=1;y<=3;y++)for(const z of [6,11])for(let x=2;x<=12;x++)
  if(!gap1.has(x+','+z))add(x,y,z,'partition','live:wood');
 for(let y=1;y<=3;y++){
  for(let z=2;z<=5;z++)if(z!==3)add(7,y,z,'partition','live:wood');
  for(let z=7;z<=10;z++)if(z!==8)add(7,y,z,'partition','live:stone');
 }
 // Ridge-supported flat ceramic/wood terrace with beam grid rather than floating roof.
 // Future rain drainage, load/span and glazing weather seal require separate approval.
 for(let x=1;x<=13;x++)for(let z=1;z<=15;z++)add(x,5,z,'roof','live:wood');
 for(const x of [3,7,11])for(let z=2;z<=14;z++)if(clear(x,4,z))add(x,4,z,'support','live:wood','east',{spanApproved:false});
 // Raised vent lantern has actual coordinate blocks but no invented working heat/air simulation.
 for(let x=5;x<=9;x++)for(const z of [7,10])add(x,6,z,'roof','live:wood');
 for(let z=8;z<=9;z++)for(const x of [5,9])add(x,6,z,'roof','live:wood');
 for(let x=5;x<=9;x++)for(let z=7;z<=10;z++)add(x,7,z,'roof','live:wood');
 // Separate furniture and baths by program; keep the central pedestrian channel clear.
 for(const [x,z,role,asset,purpose] of [
  [3,3,'furnishing','live:wood','changing bench'],[4,3,'furnishing','live:wood','changing bench'],
  [11,3,'furnishing','pack5:090','towel counter placeholder'],
  [3,8,'furnishing','live:stone','dry room heater mass - not operating'],
  [4,9,'furnishing','live:wood','sauna dry bench'],[10,8,'furnishing','pack5:090','wash supply cabinet placeholder'],
  [11,9,'furnishing','live:stone','wash tap plinth - no running plumbing']
 ])add(x,1,z,role,asset,'north',{purpose,operational:false});
 // Deliberate in-ground rectangular STONE BASIN rim; gap permits a real route inside.
 // This basin is empty, with no claim of world-fluid simulation or swimmable water.
 for(let x=3;x<=11;x++)for(const z of [12,14])if(!(x===7&&z===12))add(x,1,z,'furnishing','live:stone','none',{purpose:'empty bath basin rim'});
 for(let z=13;z<=13;z++)for(const x of [3,11])add(x,1,z,'furnishing','live:stone','none',{purpose:'empty bath basin endwall'});
 const rooms=[
  {id:'changing-room',min:[2,1,2],max:[7,4,6]},
  {id:'entry-and-towels',min:[8,1,2],max:[13,4,6]},
  {id:'dry-heated-room',min:[2,1,7],max:[7,4,11]},
  {id:'wash-service',min:[8,1,7],max:[13,4,11]},
  {id:'open-bath',min:[2,1,12],max:[13,4,15]}
 ];
 const portals=[
  {from:'outside',to:'entry-and-towels',at:[7,1,1],passable:true,opening:'open-public-entry'},
  {from:'entry-and-towels',to:'changing-room',at:[7,1,3],passable:true,opening:'open-changing-entry'},
  {from:'entry-and-towels',to:'wash-service',at:[9,1,6],passable:true,opening:'open-wash-entry'},
  {from:'wash-service',to:'dry-heated-room',at:[7,1,8],passable:true,opening:'open-dry-entry'},
  {from:'wash-service',to:'open-bath',at:[7,1,11],passable:true,opening:'open-basin-entry'}
 ];
 const walkable=[];
 for(let z=2;z<=14;z++)for(let x=2;x<=12;x++)
  if(clear(x,1,z)&&clear(x,2,z))walkable.push([x,1,z]);
 walkable.push([7,1,0],[7,1,1]);
 const deps=[...new Set([...placed.values()].map(p=>p.asset).filter(a=>!a.startsWith('live:')))].sort().map(asset=>({
  asset,status:'unresolved',
  requires:['actual integrated-family physical AABB and mounting clearance','orientation, transparency and selection/collision source ABI','schema-1 safe replacement; support and bearing certification']
 }));
 const b={
  schema:SCHEMA,id:blueprintId('bathhouse','temperate','small',1),category:'bathhouse',biome:'temperate',
  size:'small',index:1,status:'candidate',frame:'local-x-east-y-up-z-south',title:'Thimblebrook Public Baths',
  footprint:{width:W,height:H,depth:D},worldPlacement:false,liveIntegration:false,
  architecturalIdentity:{zoning:'two-wing changing and wet/dry treatments',roof:'vented inner lantern over full supported roof deck',
   basin:'physical rim with open access and EMPTY basin; no fluid simulation',steamAndPlumbingApproved:false,
   structuralSpanApproved:false,weatherproofApproved:false},
  placements:[...placed.values()],rooms,portals,walkable,footprintReservations:[],dependencies:deps
 };
 validateBlueprint(b);validateAllocation([b]);return b;
}
export const getBathhouseSourceSignature=()=>{
 const b=createTemperateSmallBathhouse();
 return {id:b.id,cellCount:b.placements.length,fingerprint:structuralFingerprint(b),
  serialized:stableBlueprintJSON(b)};
};