// Roadmap C first independent, nonproduction Builder 3B gatehouse.
// All solidity comes from literal XYZ source modules; no world creation/registration.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
import {validateGatehouseTopology} from './fortification-topology.mjs';

const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const coord=(x,y,z)=>x+','+y+','+z,ground=(x,z)=>x+','+z;
const addRect=(set,a,b,c,d)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)set.add(ground(x,z));};
const stairPosition=(x,z)=>x>=8&&x<=9&&z>=22&&z<=25;

export function createRoadmapCFirstGatehouseBlueprint(){
 const id=assertSlot('gatehouse','temperate','small',1);
 const W=28,D=28,H=15,footprint=new Set();
 // Two unequal physically connected guard barracks flank a long, defensible gate throat.
 // Two transverse bridges (not a metadata-only connected room graph) join both bastions.
 addRect(footprint,1,9,2,25);
 addRect(footprint,18,26,3,25);
 addRect(footprint,11,14,0,27);
 addRect(footprint,8,19,7,8);
 addRect(footprint,8,19,20,21);
 addRect(footprint,9,16,22,27);
 const courtyards=[[3,5,12,15],[22,24,12,15]];
 let openGround=0;
 for(const [a,b,c,d] of courtyards){
  for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)if(footprint.delete(ground(x,z)))openGround++;
 }
 if(openGround!==24)throw Error(id+' open-air source courtyards were lost');
 const clearances=[
  B(12,2,0,2,3,28),             // Actual 2 wide x 3 high cart passage: north to south
  B(8,2,7,12,3,2), B(8,2,20,12,3,2), // Two cross-gallery links to the guard rooms
  B(2,2,4,7,3,7), B(19,2,4,7,3,7),
  B(2,2,17,6,3,5), B(19,2,17,7,3,8),
  B(8,3,22,2,3,1), B(8,4,23,2,3,1), // Real stepped climb: clear above each tread
  B(8,5,24,2,3,1), B(8,6,25,2,3,1),
  B(10,7,25,2,3,1)             // Roof landing: standing atop actual y=6 structure
 ];
 const reserved=(x,y,z)=>clearances.some(b=>x>=b.x&&x<b.x+b.width&&y>=b.y&&y<b.y+b.height&&z>=b.z&&z<b.z+b.depth);
 const occupied=new Map(),modules=new Map();
 const put=(role,x,y,z,asset)=>{
  if(!footprint.has(ground(x,z)))return false;
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=W||z<0||z>=D||y<0||y>=H)throw Error(id+' invalid source coordinate');
  if(!Object.hasOwn(ASSET_CATALOG,asset))throw Error(id+' unknown symbolic asset '+asset);
  if(role!=='foundation'&&role!=='floor'&&reserved(x,y,z))return false;
  const k=coord(x,y,z);if(occupied.has(k))return false;
  occupied.set(k,role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push([x,y,z,asset]);
  return true;
 };
 for(const xy of footprint){
  const [x,z]=xy.split(',').map(Number);
  put('foundation',x,0,z,'builtin:stone');
  put('floor',x,1,z,'pack1:007');
 }
 const has=(x,z)=>footprint.has(ground(x,z));
 for(const xy of footprint){
  const [x,z]=xy.split(',').map(Number);
  const perimeter=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([xx,zz])=>!has(xx,zz));
  if(perimeter&&!stairPosition(x,z))
   for(let y=2;y<=5;y++)put('wall',x,y,z,'pack1:002');
 }
 // Source-contiguous, grounded stone gate posts; only two genuine cross-bridge
 // doorway slots are carved, never the midpoint/load-bearing gate arches.
 for(let z=0;z<D;z++)for(const x of [11,14])
  for(let y=2;y<=5;y++)if(!stairPosition(x,z))put('wall',x,y,z,'pack1:002');
 for(const [x,z] of [[2,3],[24,5],[3,19],[23,21]]){
  put('equipment-store',x,2,z,'pack4:057');
  put('equipment-store',x,3,z,'pack5:079');
 }
 // Eight independent structural roof strips over unequal bastion wings.
 for(const xy of footprint){
  const [x,z]=xy.split(',').map(Number);
  if(stairPosition(x,z))continue; // stair headroom is kept genuinely open
  put('roof',x,6,z,'pack3:025');
  const isWing=(x>=1&&x<=9)||(x>=18&&x<=26);
  if(!isWing||z<3||z>24)continue;
  const center=x<11?5:22,span=Math.abs(x-center);
  const rise=span<=1?3:span<=3?2:0;
  for(let y=7;y<=6+rise;y++)put('raised-roof-mass',x,y,z,'pack3:025');
 }
 // Real overhead stone lintel is three-high clear underneath (y=2..4).
 for(let z=12;z<=16;z++)for(let x=12;x<=13;x++)
  put('roof',x,5,z,'pack3:069');
 // A two-wide, individually stepped source ramp climbs onto the south parapet.
 for(let i=0;i<4;i++)for(let x=8;x<=9;x++){
  const ok=put('stair',x,2+i,22+i,'pack1:008');
  if(!ok)throw Error(id+' stair source collisions at '+[x,2+i,22+i]);
 }
 // Raised guard posts are attached to their real roof deck, not detached towers.
 for(const [x,z] of [[3,5],[24,7],[4,21],[23,22]])
  for(let y=9;y<=10;y++)put('watch-post',x,y,z,'pack2:015');
 const nodes=[
  {id:'entry',x:12,y:2,z:27,width:2,headroom:3},
  {id:'north-gateway',x:12,y:2,z:7,width:2,headroom:3},
  {id:'south-gateway',x:12,y:2,z:20,width:2,headroom:3},
  {id:'west-watch',x:5,y:2,z:7,width:2,headroom:3},
  {id:'east-watch',x:21,y:2,z:7,width:2,headroom:3},
  {id:'west-reserve',x:4,y:2,z:19,width:2,headroom:3},
  {id:'east-reserve',x:21,y:2,z:19,width:2,headroom:3},
  {id:'stair-foot',x:8,y:2,z:21,width:2,headroom:3},
  ...Array.from({length:4},(_,i)=>({id:'stair-'+(i+1),x:8,y:3+i,z:22+i,width:2,headroom:3})),
  {id:'parapet',x:10,y:7,z:25,width:2,headroom:3}
 ];
 const edges=[
  {from:'entry',to:'south-gateway',kind:'level'},
  {from:'south-gateway',to:'north-gateway',kind:'level'},
  {from:'north-gateway',to:'west-watch',kind:'level'},
  {from:'north-gateway',to:'east-watch',kind:'level'},
  {from:'south-gateway',to:'west-reserve',kind:'level'},
  {from:'south-gateway',to:'east-reserve',kind:'level'},
  {from:'south-gateway',to:'stair-foot',kind:'level'},
  {from:'stair-foot',to:'stair-1',kind:'stair'},
  ...Array.from({length:3},(_,i)=>({from:'stair-'+(i+1),to:'stair-'+(i+2),kind:'stair'})),
  {from:'stair-4',to:'parapet',kind:'stair'}
 ];
 const spaces=[
  {id:'wheel-clear-gate',kind:'gateway',bounds:B(12,2,0,2,3,28),accessNode:'entry'},
  {id:'western-guard-house',kind:'guard-room',bounds:B(2,2,4,7,3,7),accessNode:'west-watch'},
  {id:'eastern-guard-house',kind:'guard-room',bounds:B(19,2,4,7,3,7),accessNode:'east-watch'},
  {id:'western-sentry-reserve',kind:'equipment',bounds:B(2,2,17,6,3,5),accessNode:'west-reserve'},
  {id:'eastern-muster-room',kind:'muster',bounds:B(19,2,17,7,3,8),accessNode:'east-reserve'},
  {id:'source-stair-landing',kind:'stair-landing',bounds:B(8,6,25,2,3,1),accessNode:'stair-4'},
  {id:'defensible-south-parapet',kind:'battlement',bounds:B(10,7,25,2,3,1),accessNode:'parapet'}
 ];
 const bp={
  id,type:'gatehouse',biome:'temperate',size:'small',variant:1,
  status:'theoretical',activated:false,envelope:B(0,0,0,W,H,D),
  modules:[...modules].map(([role,cells])=>({id:role+'-source',role,cells})),
  clearances,
  openings:[
   {id:'north-road',facing:'north',x:12,y:2,z:0,width:2,height:3},
   {id:'south-road',facing:'south',x:12,y:2,z:27,width:2,height:3}
  ],
  spaces,navigation:{entry:'entry',nodes,edges},
  fortification:{gateRoute:{axis:'z',floorY:2,width:2,height:3,
   points:Array.from({length:28},(_,z)=>[12,z])},
   gateInstall:{futureOnly:true,hingeReserved:true,clearanceCells:[2,3,28]},
   guardBridgeSlots:[[8,7,19,8],[8,20,19,21]],
   terrainFoundation:{flatRequired:true,minSupportHeight:1},
   rampartSockets:[{x:10,y:7,z:25,facing:'south',width:2}]},
  features:[
   {name:'open-air north and south guard courts',position:[3,2,12],assetRef:null,unresolvedDependency:'two genuinely removed source-ground courtyards; vegetation/weather not installed'},
   {name:'inert supply bins',position:[2,2,3],assetRef:'pack4:057',unresolvedDependency:null},
   {name:'unpowered portcullis reservation',position:[12,2,14],assetRef:null,unresolvedDependency:'mechanical heavy gate never installed by this roadmap'}
  ],
  architecture:{title:'Twinstone Pass Twin-Bastion Gatehouse',originalDesign:true,
   structuralBridgeCount:2,trueOpenCourtyardGroundCells:openGround,
   sourceBastions:2,gateWidth:2,clearGateHeight:3,sourceRoofHeights:[6,8,9],
   sourceStairSteps:4,creatorApproved:false,physicalProducerResolved:false},
  dependencies:['pack1:002','pack1:007','pack1:008','pack2:015','pack3:025','pack3:069',
   'pack4:057','pack5:079','future physical variant yaw / AABB and hinge collision review'],
  implementation:'SOURCE-ONLY C GATEHOUSE WAVE1; no world placement, creator release or gameplay mechanisms'
 };
 validateBlueprint(bp,ASSET_CATALOG);
 validateGatehouseTopology(bp);
 return bp;
}
export function createRoadmapCFirstGatehousePool(){return [createRoadmapCFirstGatehouseBlueprint()];}
