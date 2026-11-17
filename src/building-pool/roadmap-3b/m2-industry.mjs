// Builder 3B M2: TWO genuinely new Temperate Small coordinate-authored industry blueprints.
// Dry-run only, no world placement, save edits, functional mill rotation, crafting or AI.
import {slotId} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';

const box=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const passage=(x,y,z,width=2,height=3,depth=1)=>box(x,y,z,width,height,depth);
const node=(id,x,y,z)=>({id,x,y,z,width:2,headroom:3});
const space=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const feature=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});
const link=(from,to)=>({from,to,kind:'level'});
function draft(type,width,depth,height){
 const occupied=new Map(),parts=new Map();
 function put(role,x,y,z,ref){
  if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||!Number.isSafeInteger(z)||
     x<0||x>=width||y<0||y>=height||z<0||z>=depth)
   throw new RangeError('M2 coordinate outside envelope: '+[role,x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error('Unknown source family '+ref);
  const key=[x,y,z].join(',');
  if(occupied.has(key))throw Error('M2 occupied cell collision '+key+' between '+occupied.get(key)+' and '+role);
  occupied.set(key,role);
  if(!parts.has(role))parts.set(role,[]);
  parts.get(role).push([x,y,z,ref]);
 }
 function has(x,y,z){return occupied.has([x,y,z].join(','));}
 function finish({clearances,openings,spaces,navigation,features,architecture,dependencies}){
  const b={id:slotId(type,'temperate','small',1),type,biome:'temperate',size:'small',variant:1,
   status:'theoretical',activated:false,
   envelope:box(0,0,0,width,height,depth),
   modules:[...parts].map(([role,cells])=>({id:role+'-01',role,cells})),
   clearances,openings,spaces,navigation,features,
   architecture:{...architecture,occupiedCoordinates:occupied.size,authorship:'M2 original coordinate design',
    variantDeclared:false,orientationDeclared:false,worldPlaced:false},
   dependencies,
   implementation:'SOURCE_ONLY; actual physical family collision/variant/support integration unresolved'};
  validateBlueprint(b,ASSET_CATALOG);
  return b;
 }
 return {put,has,finish,width,depth,height};
}
function buildTemperateSmallLumberyard(){
 const w=24,d=21,h=16,b=draft('lumberyard',w,d,h),{put,has}=b;
 // The broad outdoor service yard and covered storage shed use different material zones.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  put('foundation',x,0,z,'builtin:stone');
  const deck=(x<=10&&z<=11)?'pack2:013':(z>=16?'pack1:007':'builtin:dirt');
  put('floor',x,1,z,deck);
 }
 // A low open-air security fence. A true 2-wide south gate is carved all the way through.
 for(let y=2;y<=3;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!(x===0||x===w-1||z===0||z===d-1))continue;
  if(z===d-1&&(x===11||x===12))continue;
  if(!has(x,y,z))put('wall',x,y,z,'pack2:015');
 }
 // West timber shed: three supported sides, open to the east yard path.
 for(let y=4;y<=7;y++){
  for(let x=1;x<=10;x++)if(!has(x,y,1))put('wall',x,y,1,'pack2:015');
  for(let z=2;z<=10;z++)if(!has(1,y,z))put('wall',1,y,z,'pack2:015');
 }
 for(const [x,z] of [[2,2],[9,2],[2,10],[9,10]])
  for(let y=2;y<=8;y++)if(!has(x,y,z))put('shed-post',x,y,z,'pack2:022');
 // Distinct thin rain canopy with real roof strips and edge drip rows, no full-volume slab.
 for(let x=1;x<=10;x++)for(let z=1;z<=11;z++)put('roof',x,9,z,'pack3:023');
 for(let x=1;x<=10;x++){
  if(!has(x,8,11))put('roof-edge',x,8,11,'pack2:015');
 }
 // Deliberately physical outdoor stack rows, separated by a clear two-wide main aisle.
 for(let x=4;x<=6;x++)for(let z=3;z<=4;z++)for(let y=2;y<=3;y++)put('sheltered-log-stack',x,y,z,'builtin:wood');
 for(let x=4;x<=7;x++)for(let y=2;y<=4;y++)put('shed-plank-stacks',x,y,6,'pack2:013');
 for(let x=17;x<=20;x++)for(let z=4;z<=7;z++)for(let y=2;y<=3;y++)put('outdoor-log-stack',x,y,z,'builtin:wood');
 for(let x=18;x<=20;x++)for(let z=13;z<=15;z++)put('loading-crates',x,2,z,'pack4:057');
 // Visible staging pads and real bay markings, not a title-only footprint.
 for(const x of [17,22])for(let z=10;z<=16;z++)if(!has(x,2,z))put('loading-rail',x,2,z,'pack2:015');
 const clearances=[passage(11,2,1,2,3,20),passage(6,2,8,7,3,2),passage(11,2,16,6,3,2)];
 const openings=[{id:'yard-south-gate',facing:'south',x:11,y:2,z:20,width:2,height:3}];
 const spaces=[
  space('yard','open-service-yard',box(10,2,8,13,3,12),'yard'),
  space('shelter','covered-timber-storage',box(2,2,2,9,3,9),'shed'),
  space('freight','cart-loading-bay',box(14,2,12,9,3,7),'loading')
 ];
 const navigation={entry:'entry',nodes:[node('entry',11,2,20),node('yard',11,2,11),node('shed',7,2,8),node('loading',14,2,16)],
  edges:[link('entry','yard'),link('yard','shed'),link('yard','loading')]};
 const features=[feature('sheltered-cut-log-racks',4,2,3,'builtin:wood'),
  feature('plank-staging',5,2,6,'pack2:013'),feature('freight-crates',19,2,14,'pack4:057'),
  feature('non-operating-sawbench',15,2,9,null,'A selectable manual sawbench family and use mechanics are not integrated'),
  feature('shed-rainwater-runoff',8,9,8,null,'Roof-water simulation and gutters are intentionally not modeled')];
 return b.finish({clearances,openings,spaces,navigation,features,
  architecture:{kind:'three-bay lumberyard',shed:{x:1,z:1,width:10,depth:11,canopyY:9},
   openGate:{x:11,z:20,width:2},workingAreas:['covered timber storage','open yard','freight loading'],
   supportPostCount:4,roofShellThickness:1,perimeterFenceY:[2,3]},
  dependencies:['pack2:013','pack2:015','pack2:022','pack3:023','pack4:057',
   'manual-family per-cell numeric variant, orientation, collision, mounting and supports pending centralized physical review',
   'non-operational lumber processing; no saw/crafting/transport mechanics']});
}
function buildTemperateSmallMill(){
 const w=25,d=23,h=21,b=draft('mill',w,d,h),{put,has}=b;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  put('foundation',x,0,z,'builtin:stone');
  put('floor',x,1,z,(z<=8?'pack2:013':'pack1:007'));
 }
 // Complete millhouse envelope with two narrow north/south gables and a two-wide main door.
 for(let y=2;y<=8;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!(x===0||x===w-1||z===0||z===d-1))continue;
  if(z===d-1&&(x===11||x===12)&&y<=4)continue;
  if((x===0||x===w-1)&&(z===6||z===16)&&(y===4||y===5))continue;
  put('wall',x,y,z,'pack1:002');
 }
 // Interior grain-room partition and separate side service room, with physical passages.
 for(let x=1;x<w-1;x++)for(let y=2;y<=5;y++){
  if(x===11||x===12)continue;
  put('partition',x,y,8,'pack2:015');
 }
 for(let z=10;z<=20;z++)for(let y=2;y<=5;y++){
  if(z===15||z===16)continue;
  put('service-wall',17,y,z,'pack2:015');
 }
 // Gabled single-cell shell, end gables extending into the actual roof, not a solid roof slab.
 const roofY=x=>10+Math.floor(Math.min(x,w-1-x)/3);
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)put('roof',x,roofY(x),z,'pack3:023');
 for(let x=0;x<w;x++)for(const z of [0,d-1])for(let y=9;y<roofY(x);y++)
  if(!has(x,y,z))put('gable',x,y,z,'pack1:002');
 // Load-bearing roof posts and cross beams are separate from the lower partitions.
 for(const [x,z] of [[2,2],[22,2],[2,19],[22,19]])
  for(let y=2;y<roofY(x);y++)if(!has(x,y,z))put('roof-support',x,y,z,'pack2:015');
 for(let x=2;x<=22;x++)if(!has(x,9,10))put('roof-rafter',x,9,10,'pack2:015');
 // Built, inert grinding foundation, material bins and shaft housing.
 for(let x=5;x<=7;x++)for(let z=12;z<=14;z++)put('stone-grinding-base',x,2,z,'pack1:007');
 for(let x=3;x<=5;x++)for(let z=3;z<=5;z++)for(let y=2;y<=3;y++)put('grain-crates',x,y,z,'pack4:057');
 for(let x=20;x<=21;x++)for(let z=11;z<=13;z++)for(let y=2;y<=4;y++)put('static-shaft-pier',x,y,z,'pack1:010');
 const clearances=[passage(11,2,1,2,3,22),passage(11,2,15,11,4,2),passage(9,2,12,4,3,2)];
 const openings=[{id:'millhouse-south-entry',facing:'south',x:11,y:2,z:22,width:2,height:3}];
 const spaces=[
  space('grain-room','grain-storage',box(2,2,2,21,4,6),'grain'),
  space('mill-floor','grinding-room',box(2,2,10,15,4,10),'grind'),
  space('drive-room','shaft-service',box(18,2,11,6,4,9),'service'),
  space('front-entry','receiving',box(10,2,20,4,3,3),'entry')
 ];
 const navigation={entry:'entry',nodes:[node('entry',11,2,22),node('grind',11,2,12),node('grain',11,2,4),node('service',18,2,16)],
  edges:[link('entry','grind'),link('grind','grain'),link('grind','service')]};
 const features=[feature('stone-millstone-foundation',6,2,13,'pack1:007'),
  feature('grain-bins',4,2,4,'pack4:057'),feature('stone-shaft-pier',20,2,12,'pack1:010'),
  feature('external-wheel-mount',24,6,12,null,'Actual complete axle/wheel shape and powered-fluid drive are unavailable'),
  feature('static-internal-drive-train',21,5,12,null,'Nonfunctional drive gears/belts are not an integrated physical block family')];
 return b.finish({clearances,openings,spaces,navigation,features,
  architecture:{kind:'partitioned gable millhouse',floorZones:['grain storage','grinding','shaft service'],
   roofStyle:'stepped gable',roofShellThickness:1,roofCrossSection:Array.from({length:w},(_,x)=>roofY(x)),
   mainEntrance:{x:11,z:22,width:2},wheelPower:'SYMBOLIC_ONLY',operating:false,
   supportingPosts:4},
  dependencies:['pack1:002','pack1:007','pack1:010','pack2:013','pack2:015','pack3:023','pack4:057',
   'actual wheel/rotor shape, collision, axle, power, flow and mill functions are NOT part of this theoretical blueprint',
   'per-placement variant, orientation, material AABBs and mounting/support to resolve centrally']});
}
export function createM2IndustryBlueprint(type,biome='temperate',size='small',variant=1){
 if(biome!=='temperate'||size!=='small'||variant!==1)
  throw new RangeError('Only two new coordinate-authored Temperate Small M2 industry exemplars exist');
 if(type==='lumberyard')return buildTemperateSmallLumberyard();
 if(type==='mill')return buildTemperateSmallMill();
 throw new RangeError('Unsupported M2 industry exemplar '+type);
}
export function createM2IndustryPool(){return ['lumberyard','mill'].map(type=>createM2IndustryBlueprint(type));}
