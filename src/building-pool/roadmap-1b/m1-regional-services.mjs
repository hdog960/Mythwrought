// Builder 1B M1. Source-only coordinate-authored service buildings.
// None are installed, spawned, approved, or saved to the live world.
import {SCHEMA,validateBlueprint} from './legacy-stable-schema.mjs';
import {blueprintId,validateAllocation} from './schema.mjs';
const FULL=Object.freeze({kind:'full-cell',bounds:[0,0,0,1,1,1]});
const key=(x,y,z)=>[x,y,z].join(',');
function plan(category,biome,size,title,W,H,D){
 const cells=new Map(),rooms=[],portals=[];
 function put(x,y,z,role,asset='live:wood',orientation='none',extra={}){
  if(![x,y,z].every(Number.isInteger)||x<0||y<0||z<0||x>=W||y>=H||z>=D)throw Error(title+': out of bounds '+key(x,y,z));
  const pos=key(x,y,z);if(cells.has(pos))throw Error(title+': overlapping cell '+pos);
  cells.set(pos,{at:[x,y,z],role,asset,orientation,occupancy:asset.startsWith('live:')?FULL:{
   kind:'unresolved',bounds:null,reason:asset+' exact physical envelope, mounting and rotation unresolved'
  },...extra});
 }
 const cut=(x,y,z)=>cells.delete(key(x,y,z));
 const clear=(x,y,z)=>!cells.has(key(x,y,z));
 const hatch=(x,z)=>{cut(x,1,z);cut(x,2,z);};
 const partZ=(z,x0,x1,top=4)=>{for(let y=1;y<=top;y++)for(let x=x0;x<=x1;x++)put(x,y,z,'partition');};
 const partX=(x,z0,z1,top=4)=>{for(let y=1;y<=top;y++)for(let z=z0;z<=z1;z++)put(x,y,z,'partition');};
 const room=(id,x0,z0,x1,z1,ymax=5)=>rooms.push({id,min:[x0,1,z0],max:[x1,ymax,z1]});
 const link=(from,to,x,z,opening='passage',y=1)=>portals.push({from,to,at:[x,y,z],passable:true,opening});
 const base=(wallTop,back=D-2,ground='live:stone')=>{
  for(let x=0;x<W;x++)for(let z=0;z<=back+1;z++)put(x,0,z,'foundation',ground);
  for(let y=1;y<=wallTop;y++){
   for(let x=1;x<W-1;x++)for(const z of [1,back])put(x,y,z,'wall');
   for(let z=2;z<back;z++)for(const x of [1,W-2])put(x,y,z,'wall');
  }
 };
 const windows=(list,asset='pack4:030')=>{for(const [x,z,f] of list){
  cut(x,2,z);put(x,2,z,'window',asset,f,{glazingApproved:false});
 }};
 const roof=(y,back=D-2,asset='live:wood')=>{
  for(let x=1;x<W-1;x++)for(let z=1;z<=back;z++)put(x,y,z,'roof',asset,'none',{spanApproved:false});
 };
 const furnish=(x,z,purpose,asset='live:wood')=>put(x,1,z,'furnishing',asset,'north',{purpose,operational:false});
 const finish=(details,extraWalk=[])=>{
  const walkable=[];
  for(let x=0;x<W;x++)for(let z=0;z<D;z++)
   if(cells.has(key(x,0,z))&&clear(x,1,z)&&clear(x,2,z))walkable.push([x,1,z]);
  for(const c of extraWalk)if(!walkable.some(w=>key(...w)===key(...c)))walkable.push(c);
  const dependencies=[...new Set([...cells.values()].filter(x=>!x.asset.startsWith('live:')).map(x=>x.asset))].sort().map(asset=>({
   asset,status:'unresolved',requires:['exact integrated physical family AABB, cell occupancy and attachment',
      'source rotation/selection/collision/transparency','bearing and schema-1 save compatibility']
  }));
  const b={schema:SCHEMA,id:blueprintId(category,biome,size,1),category,biome,size,index:1,
   title,status:'candidate',frame:'local-x-east-y-up-z-south',
   footprint:{width:W,height:H,depth:D},placements:[...cells.values()],rooms,
   portals,walkable,dependencies,footprintReservations:[],
   architecturalIdentity:{...details,approved:false,authoring:'fixed integer-coordinate structural program'},
   worldPlacement:false,liveIntegration:false};
  validateBlueprint(b);validateAllocation([b]);return b;
 };
 return {put,cut,clear,hatch,partZ,partX,room,link,base,windows,roof,furnish,finish};
}
export function createWheatfieldBarn(){
 const b=plan('farm-barn','temperate','small','Wheatfield Wagon Barn',17,11,19);
 const {put,hatch,partZ,partX,room,link,base,windows,roof,furnish,finish}=b;
 base(5);for(const x of [8,9])hatch(x,1);
 partZ(8,2,14);for(const x of [7,11])hatch(x,8);
 partX(8,9,16);hatch(8,13);
 windows([[3,1,'north'],[13,1,'north'],[1,12,'west'],[15,12,'east'],[4,17,'south'],[12,17,'south']]);
 roof(6,17);for(let x=2;x<=14;x+=4)for(const z of [4,12,16])put(x,7,z,'roof','live:wood','east',{roofRib:true});
 for(const [x,z,p] of [[3,4,'seed-crate'],[4,4,'seed-crate'],[3,11,'grain-stack'],[4,11,'grain-stack'],
  [12,12,'repair-rack'],[13,12,'repair-rack'],[12,15,'wagon-tackle']])furnish(x,z,p);
 room('wagon-unload',2,2,15,8,6);room('grain-and-hay',2,9,8,17,6);room('tools-and-repair',9,9,15,17,6);
 link('outside','wagon-unload',8,1,'two-cell-wide-wagon-gate');
 link('wagon-unload','grain-and-hay',7,8);
 link('wagon-unload','tools-and-repair',11,8);
 link('grain-and-hay','tools-and-repair',8,13);
 return finish({categoryFunction:'grain, repair and wagon ingress with distinct storage bays',
  agricultureGameplay:false,animals:0,roofBearingApproved:false});
}
export function createGlowglassConservatory(){
 const b=plan('greenhouse','enchanted-forest','small','Glowglass Fern Conservatory',15,10,19);
 const {put,hatch,partZ,room,link,base,windows,furnish,finish}=b;
 base(4);hatch(7,1);partZ(14,2,12,3);hatch(7,14);
 windows([[3,1,'north'],[11,1,'north'],[1,4,'west'],[13,4,'east'],
  [1,9,'west'],[13,9,'east'],[4,17,'south'],[10,17,'south']]);
 for(let x=1;x<=13;x++)for(let z=1;z<=17;z++){
  const rib=[1,4,10,13].includes(x)||z===1||z===17;
  put(x,5,z,'roof',rib?'live:wood':'pack4:030','none',{weatherSealApproved:false});
 }
 for(const [x,z] of [[4,5],[10,5],[4,12],[10,12]])put(x,6,z,'support','live:wood');
 for(let z=4;z<=12;z++){
  for(const x of [3,5,9,11])furnish(x,z,'raised-growing-tray');
  for(const x of [4,10])furnish(x,z,'decorative-potting-soil','live:dirt');
 }
 for(const x of [3,4,5,10,11])furnish(x,16,'potting-table');
 room('glass-growing-house',2,2,13,14);room('potting-workroom',2,15,13,17);
 link('outside','glass-growing-house',7,1);
 link('glass-growing-house','potting-workroom',7,14);
 return finish({categoryFunction:'transparent roof with two genuine raised beds and rear planting workroom',
  actualGrowing:false,weatherSealApproved:false});
}
export function createReedhookPierLodge(){
 const b=plan('fishing-lodge','temperate','small','Reedhook Pier Lodge',15,10,25);
 const {put,hatch,partZ,room,link,base,windows,roof,furnish,finish}=b;
 base(5,16);hatch(7,1);hatch(7,16);
 partZ(9,2,12);hatch(7,9);
 windows([[3,1,'north'],[11,1,'north'],[1,6,'west'],[13,6,'east'],[4,16,'south'],[10,16,'south']]);
 roof(6,16);for(let x=1;x<=13;x+=3)for(const z of [1,9,16])put(x,7,z,'roof','live:wood','north',{purlin:true});
 // z=17 already belongs to contiguous shore base, so dock starts at z=18.
 for(let z=18;z<=23;z++)for(let x=5;x<=9;x++)put(x,0,z,'floor','live:wood','north',{shorePierBearing:'unresolved'});
 for(let z=18;z<=23;z++)for(const x of [5,9])put(x,1,z,'support','live:wood','north',{purpose:'dock-side-rail'});
 for(const [x,z,p] of [[3,4,'dry-net-rack'],[11,4,'dry-net-rack'],[3,12,'gear-crate'],[11,12,'secure-store']])furnish(x,z,p);
 room('shore-equipment',2,2,13,9,6);room('net-drying-and-store',2,10,13,16,6);
 link('outside','shore-equipment',7,1);
 link('shore-equipment','net-drying-and-store',7,9);
 link('net-drying-and-store','outside',7,16,'pier-side-exit');
 return finish({categoryFunction:'physical shoreline storage with rail-supported external pier',
  simulatedWater:false,boatSystem:false,fishingGameplay:false,shorePierBearingApproved:false});
}
export function createEstuaryHarborOffice(){
 const b=plan('harbor-office','temperate','small','Estuary Chart & Ledger Office',17,11,17);
 const {put,hatch,partZ,partX,room,link,base,windows,roof,furnish,finish}=b;
 base(5);hatch(8,1);partZ(9,2,14);for(const x of [4,12])hatch(x,9);
 partX(8,10,14);hatch(8,12);
 windows([[3,1,'north'],[13,1,'north'],[1,5,'west'],[15,5,'east'],[3,15,'south'],[13,15,'south']]);
 roof(6,15);for(let z=1;z<=15;z+=3)put(8,7,z,'roof','live:wood','north',{ridgeMember:true});
 for(const [x,z,p] of [[4,5,'public-counter'],[5,5,'public-counter'],[11,5,'customs-desk'],
  [4,12,'chart-table'],[4,13,'chart-table'],[12,12,'records-cabinet'],[12,13,'records-cabinet']])furnish(x,z,p);
 room('public-permit-lobby',2,2,15,9,6);
 room('charts-and-navigation',2,10,8,15,6);
 room('ledger-office',9,10,15,15,6);
 link('outside','public-permit-lobby',8,1);
 link('public-permit-lobby','charts-and-navigation',4,9);
 link('public-permit-lobby','ledger-office',12,9);
 link('charts-and-navigation','ledger-office',8,12);
 return finish({categoryFunction:'public permit lobby, physical chart room and lockable records zone',
  economy:false,navigationSimulation:false});
}
export function createHighpassLighthouse(){
 const b=plan('lighthouse','mountain','small','Highpass Signal Beacon',15,24,15);
 const {put,cut,room,link,finish}=b;
 for(let x=1;x<=13;x++)for(let z=1;z<=13;z++){
  const r=(x-7)**2+(z-7)**2;
  if(r<=36)put(x,0,z,'foundation','live:stone');
  if(r>=25&&r<=36)for(let y=1;y<=17;y++)put(x,y,z,'wall','live:stone');
 }
 cut(7,1,2);cut(7,2,2); // Foundation at (7,0,1) is already in the authored radius-6 circle.
 for(const [x,z] of [[7,12],[2,7],[12,7]]){
  cut(x,10,z);put(x,10,z,'window','pack4:030',x===2?'west':x===12?'east':'south',{glazingApproved:false});
 }
 // Physically authored rungs in a continuous vertical interior shaft. Two
 // independently supported mid/high landings, with actual climbing ABI pending.
 for(let y=2;y<=16;y++)put(8,y,7,'stair','live:wood','west',{purpose:'inner-climb-rung',climbMechanicApproved:false});
 for(const [supportY,landingY] of [[5,6],[11,12]]){
  put(7,supportY,8,'support','live:wood','none',{purpose:'landing-underframe'});
  put(8,supportY,8,'support','live:stone','none',{purpose:'landing-bracket'});
  for(const x of [7,8])put(x,landingY,9,'support','live:wood','north',{purpose:'landing-guard'});
 }
 for(let x=1;x<=13;x++)for(let z=1;z<=13;z++)
  if((x-7)**2+(z-7)**2<=36)put(x,18,z,'roof','live:stone');
 for(const [x,z] of [[7,5],[7,9],[5,7],[9,7]])for(let y=19;y<=21;y++)
  put(x,y,z,'support','live:wood','none',{purpose:'nonworking-beacon-support'});
 for(let x=5;x<=9;x++)for(let z=5;z<=9;z++)put(x,22,z,'roof','live:stone');
 room('ground-store',3,3,12,12,5);
 room('mid-landing',6,6,10,10,8);
 room('observation-landing',6,12,10,13,17);
 link('outside','ground-store',7,2);
 link('ground-store','mid-landing',7,7,'conceptual-ladder-access',6);
 link('mid-landing','observation-landing',7,7,'conceptual-ladder-access',12);
 const shaft=[];for(let y=2;y<=16;y++)shaft.push([7,y,7]);
 shaft.push([7,6,8],[7,12,8]);
 return finish({categoryFunction:'hollow stone tower with true vertical shaft, supported landings and unlit beacon',
  beaconLit:false,climbMechanicApproved:false,verticalRouteRequires:'physical ladder/rail integration'},shaft);
}
export function getM1ServiceExemplars(){
 return [createWheatfieldBarn(),createGlowglassConservatory(),createReedhookPierLodge(),
  createEstuaryHarborOffice(),createHighpassLighthouse()];
}
