// Builder 3B: four distinct original regional industry structures, dry-run only.
import {slotId} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const box=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const corridor=(x,y,z,width,height,depth)=>box(x,y,z,width,height,depth);
const node=(id,x,y,z)=>({id,x,y,z,width:2,headroom:3});
const room=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const edge=(from,to)=>({from,to,kind:'level'});
const item=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});
function author(type,biome,size,w,d,h){
 const occupied=new Set(),roles=new Map();
 function has(x,y,z){return occupied.has(x+','+y+','+z);}
 function put(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=h||z<0||z>=d)throw Error('Invalid '+role+' coordinates '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error('Missing symbolic family '+ref);
  const key=x+','+y+','+z;if(occupied.has(key))throw Error('Overlapping geometry '+key+' '+role);
  occupied.add(key);if(!roles.has(role))roles.set(role,[]);roles.get(role).push([x,y,z,ref]);
 }
 function putIfEmpty(role,x,y,z,ref){if(!has(x,y,z))put(role,x,y,z,ref);}
 function base(deck){for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  put('foundation',x,0,z,'builtin:stone');put('floor',x,1,z,typeof deck==='function'?deck(x,z):deck);
 }}
 function finish({clearances,openings,spaces,navigation,features,architecture,dependencies}){
  const result={id:slotId(type,biome,size,1),type,biome,size,variant:1,
   status:'theoretical',activated:false,envelope:box(0,0,0,w,h,d),
   modules:[...roles].map(([role,cells])=>({id:role+'-01',role,cells})),
   clearances,openings,spaces,navigation,features,
   architecture:{...architecture,occupiedCoordinates:occupied.size,authorship:'M2 original regional coordinate-authored exemplar',worldPlaced:false,perCellVariantResolved:false},
   dependencies,implementation:'SOURCE_ONLY; no wheel/saw/crafting behavior; unapproved collision, support and asset variants'};
  validateBlueprint(result,ASSET_CATALOG);return result;
 }
 return {put,putIfEmpty,has,base,finish};
}
function temperateMediumLumberyard(){
 const w=32,d=29,h=20,b=author('lumberyard','temperate','medium',w,d,h),{put,putIfEmpty,has,base}=b;
 base((x,z)=>x<=16&&z<=15?'pack2:013':z>=19?'pack1:007':'builtin:dirt');
 // Tall perimeter, separate wide timber shed to NW, open eastern freight court.
 for(let y=2;y<=4;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++)if((x===0||x===w-1||z===0||z===d-1)&&!(z===d-1&&(x===15||x===16)))put('wall',x,y,z,'pack2:015');
 for(let y=2;y<=8;y++){
  for(let x=2;x<=14;x++)putIfEmpty('shed-back-wall',x,y,2,'pack2:015');
  for(let z=3;z<=14;z++)putIfEmpty('shed-west-wall',2,y,z,'pack2:015');
  for(let z=3;z<=9;z++)putIfEmpty('shed-east-wall',14,y,z,'pack2:015');
 }
 for(const [x,z] of [[2,2],[14,2],[2,14],[14,14]])for(let y=2;y<=11;y++)putIfEmpty('shed-post',x,y,z,'pack2:022');
 const roofY=x=>12+Math.floor(Math.min(x-2,14-x)/3);
 for(let x=2;x<=14;x++)for(let z=2;z<=14;z++)put('roof',x,roofY(x),z,'pack3:023');
 for(let x=3;x<=14;x++){const prev=roofY(x-1),now=roofY(x);if(now>prev)for(let z=2;z<=14;z++)put('roof-join',x,now-1,z,'pack2:015');}
 for(let x=5;x<=9;x++)for(let z=4;z<=6;z++)for(let y=2;y<=3;y++)put('timber-rack',x,y,z,'builtin:wood');
 for(let x=6;x<=11;x++)for(let y=2;y<=4;y++)put('plank-bays',x,y,8,'pack2:013');
 for(let x=23;x<=27;x++)for(let z=5;z<=9;z++)for(let y=2;y<=3;y++)put('outdoor-timber',x,y,z,'builtin:wood');
 for(let x=24;x<=28;x++)for(let z=23;z<=25;z++)put('shipping-crates',x,2,z,'pack4:057');
 for(const x of [24,29])for(let z=17;z<=22;z++)putIfEmpty('loading-guides',x,2,z,'pack2:015');
 const clearances=[corridor(15,2,1,2,3,28),corridor(12,2,11,5,3,2),corridor(15,2,20,9,3,2)];
 return b.finish({clearances,openings:[{id:'central-cart-gate',facing:'south',x:15,y:2,z:28,width:2,height:3}],
  spaces:[room('warehouse','covered-gabled-timber-hall',box(3,2,3,13,5,12),'shed'),room('yard','sort-and-stack-court',box(15,2,9,16,4,17),'yard'),room('loading','freight-train-marshalling',box(20,2,17,11,4,11),'loading')],
  navigation:{entry:'entry',nodes:[node('entry',15,2,28),node('yard',15,2,16),node('shed',12,2,11),node('loading',22,2,20)],edges:[edge('entry','yard'),edge('yard','shed'),edge('yard','loading')]},
  features:[item('west-covered-wood-racks',7,2,5,'builtin:wood'),item('plank-sorting-shelves',8,2,8,'pack2:013'),item('east-exposed-log-piles',25,2,7,'builtin:wood'),item('wagon-loading-marker',26,2,24,'pack4:057'),item('operational-sawing',18,2,6,null,'No integrated saw station / harvesting mechanics')],
  architecture:{kind:'gabled timber-warehouse and separate open cart court',roofStyle:'saw-yard-arched-gable',shedFootprint:[2,2,14,14],gabledShell:true,roofSupports:4,operating:false},
  dependencies:['pack2:013','pack2:015','pack2:022','pack3:023','pack4:057','physical shape yaw/support/occupancy to be resolved per placement']});
}
function desertSmallLumberyard(){
 const w=26,d=22,h=17,b=author('lumberyard','desert','small',w,d,h),{put,putIfEmpty,base}=b;
 base((x,z)=>x<=12&&z<=13?'pack1:007':'biome130:006');
 // Wide sandstone windbreak; an inward-facing flat pergola rather than a gabled shed.
 for(let y=2;y<=6;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++)if((x===0||x===w-1||z===0||z===d-1)&&!(z===d-1&&(x===12||x===13)))put('wall',x,y,z,'pack1:002');
 for(const [x,z] of [[3,3],[10,3],[3,13],[10,13]])for(let y=2;y<=8;y++)put('arcade-column',x,y,z,'pack1:010');
 for(let x=3;x<=10;x++)for(let z=3;z<=13;z++)put('roof',x,9,z,'pack1:007');
 for(let x=4;x<=9;x++)for(let z=4;z<=12;z+=3)put('shade-vent-trim',x,10,z,'pack2:015');
 for(let x=5;x<=7;x++)for(let z=5;z<=7;z++)for(let y=2;y<=3;y++)put('covered-sawn-wood',x,y,z,'pack2:013');
 for(let x=18;x<=21;x++)for(let z=5;z<=8;z++)for(let y=2;y<=4;y++)put('courtyard-log-berms',x,y,z,'builtin:wood');
 for(let x=17;x<=20;x++)for(let z=14;z<=16;z++)put('sandstone-loading-pads',x,2,z,'pack1:007');
 const clearances=[corridor(12,2,1,2,3,21),corridor(8,2,11,6,3,2),corridor(12,2,18,8,3,2)];
 return b.finish({clearances,openings:[{id:'windbreak-south-gate',facing:'south',x:12,y:2,z:21,width:2,height:3}],
  spaces:[room('court','sun-protected-courtyard',box(11,2,7,14,4,14),'court'),room('shade','column-supported-pergola',box(4,2,4,8,4,10),'shade'),room('freight','dry-stone-cart-pads',box(15,2,14,10,4,7),'freight')],
  navigation:{entry:'entry',nodes:[node('entry',12,2,21),node('court',12,2,10),node('shade',8,2,11),node('freight',18,2,18)],edges:[edge('entry','court'),edge('court','shade'),edge('entry','freight')]},
  features:[item('pergola-columns',3,3,3,'pack1:010'),item('sawn-planks-under-shade',6,2,6,'pack2:013'),item('outdoor-timber-drying',19,2,6,'builtin:wood'),item('stone-pallets',19,2,15,'pack1:007'),item('dust-shading-behavior',8,9,8,null,'Dynamic weather and cooling unavailable')],
  architecture:{kind:'adobe courtyard and flat shaded stone colonnade',roofStyle:'flat-vented-pergola',columns:4,perimeterWindbreakY:[2,6]},
  dependencies:['biome130:006','pack1:002','pack1:007','pack1:010','pack2:015','per-cell physical-support orientation pending']});
}
function temperateMediumMill(){
 const w=31,d=28,h=24,b=author('mill','temperate','medium',w,d,h),{put,putIfEmpty,base}=b;
 base((x,z)=>z<11?'pack2:013':'pack1:007');
 for(let y=2;y<=9;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++)if((x===0||x===w-1||z===0||z===d-1)&&!(z===d-1&&(x===14||x===15)&&y<=4)&&!((x===0||x===w-1)&&(z===6||z===20)&&y>=4&&y<=5))put('wall',x,y,z,'pack1:002');
 for(let x=1;x<w-1;x++)for(let y=2;y<=6;y++)if(x!==14&&x!==15)put('grain-partition',x,y,10,'pack2:015');
 for(let z=12;z<=25;z++)for(let y=2;y<=6;y++)if(z!==19&&z!==20)put('drive-chamber-partition',22,y,z,'pack1:002');
 const roofY=x=>11+Math.floor(Math.min(x,w-1-x)/4);
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)put('roof',x,roofY(x),z,'pack3:025');
 for(let x=0;x<w;x++)for(const z of [0,d-1])for(let y=10;y<roofY(x);y++)putIfEmpty('gable-core',x,y,z,'pack1:002');
 // Transverse rafters and genuinely load-bearing roof supports, not an unsupported canopy.
 for(const [x,z] of [[2,3],[28,3],[2,24],[28,24]])for(let y=2;y<roofY(x);y++)putIfEmpty('support-post',x,y,z,'pack2:015');
 for(let x=2;x<=28;x++)putIfEmpty('overhead-joist',x,10,14,'pack2:015');
 for(let x=4;x<=9;x++)for(let z=3;z<=6;z++)for(let y=2;y<=3;y++)put('grain-storage-crates',x,y,z,'pack4:057');
 for(let x=5;x<=8;x++)for(let z=15;z<=18;z++)put('grinding-pit-rim',x,2,z,'pack1:007');
 for(let x=26;x<=27;x++)for(let z=14;z<=17;z++)for(let y=2;y<=4;y++)put('drive-shaft-buttress',x,y,z,'pack1:010');
 const clearances=[corridor(14,2,1,2,3,27),corridor(14,2,19,12,4,2),corridor(12,2,15,5,3,2)];
 return b.finish({clearances,openings:[{id:'mill-freight-portal',facing:'south',x:14,y:2,z:27,width:2,height:3}],
  spaces:[room('grain','long-grain-warehouse',box(2,2,2,27,4,8),'grain'),room('mill','dual-stone-processing-hall',box(2,2,12,20,4,14),'grind'),room('drive','separate-wheel-axle-room',box(23,2,12,7,4,14),'drive'),room('receiving','front-freight-intake',box(12,2,24,7,3,4),'entry')],
  navigation:{entry:'entry',nodes:[node('entry',14,2,27),node('grind',14,2,15),node('grain',14,2,5),node('drive',24,2,19)],edges:[edge('entry','grind'),edge('grind','grain'),edge('grind','drive')]},
  features:[item('grain-vault',6,2,4,'pack4:057'),item('two-grinding-stations',6,2,16,'pack1:007'),item('axle-saddle-masonry',26,2,15,'pack1:010'),item('roof-truss-bearings',2,10,14,'pack2:015'),item('mill-race-and-wheel',30,7,19,null,'No physical operating wheel/water/axle/gear behavior')],
  architecture:{kind:'three-wing partitioned grain mill with dedicated side shaft bay',roofStyle:'wide-gabled-clerestory',roofCrossSection:Array.from({length:w},(_,x)=>roofY(x)),roofSupports:4,operating:false},
  dependencies:['pack1:002','pack1:007','pack1:010','pack2:013','pack2:015','pack3:025','pack4:057','Wheel/shaft/water supply symbolic','Physical variant/rotated support collision unapproved']});
}
function mountainSmallMill(){
 const w=23,d=25,h=22,b=author('mill','mountain','small',w,d,h),{put,putIfEmpty,base}=b;
 base((x,z)=>x<=11?'pack1:007':'builtin:stone');
 for(let y=2;y<=9;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++)if((x===0||x===w-1||z===0||z===d-1)&&!(z===d-1&&(x===10||x===11)&&y<=4))put('wall',x,y,z,'pack1:002');
 for(let z=8;z<=21;z++)for(let y=2;y<=5;y++)if(z!==13&&z!==14)put('drive-room-wall',13,y,z,'pack1:002');
 // An asymmetrically terraced steep granite roof with a connecting raised step-face.
 const roofY=x=>x<=11?12:10;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)put('roof',x,roofY(x),z,'pack3:025');
 for(let z=0;z<d;z++)put('terrace-join',12,11,z,'pack1:002');
 for(let x=0;x<=11;x++)for(const z of [0,d-1])for(let y=10;y<=11;y++)putIfEmpty('raised-terrace-gable',x,y,z,'pack1:002');
 for(const [x,z] of [[2,2],[9,2],[2,22],[9,22]])for(let y=2;y<=11;y++)putIfEmpty('upper-roof-post',x,y,z,'pack1:010');
 for(let x=3;x<=7;x++)for(let z=4;z<=6;z++)for(let y=2;y<=3;y++)put('ore-grain-bins',x,y,z,'pack4:057');
 for(let x=4;x<=7;x++)for(let z=14;z<=17;z++)put('lower-grinding-stone',x,2,z,'pack1:007');
 for(let x=17;x<=19;x++)for(let z=12;z<=16;z++)for(let y=2;y<=3;y++)put('wheel-axle-buttress',x,y,z,'pack1:010');
 const clearances=[corridor(10,2,1,2,3,24),corridor(10,2,13,7,3,2),corridor(8,2,16,5,3,2)];
 return b.finish({clearances,openings:[{id:'cut-stone-mill-door',facing:'south',x:10,y:2,z:24,width:2,height:3}],
  spaces:[room('grain','stone-dry-storage',box(2,2,2,9,4,8),'grain'),room('grind','underground-headrace-service',box(2,2,12,11,4,11),'grind'),room('drive','terraced-cliffside-drive',box(14,2,10,8,4,12),'drive')],
  navigation:{entry:'entry',nodes:[node('entry',10,2,24),node('grind',10,2,16),node('grain',10,2,5),node('drive',15,2,13)],edges:[edge('entry','grind'),edge('grind','grain'),edge('grind','drive')]},
  features:[item('rock-grinder-platform',5,2,16,'pack1:007'),item('grain-vault-crates',4,2,5,'pack4:057'),item('cliffside-wheel-pedestal',18,2,14,'pack1:010'),item('stone-roof-buttresses',2,8,2,'pack1:010'),item('headrace-water-wheel',22,6,14,null,'Symbolic source-only waterpower and wheel; no fluid/rotor mechanics')],
  architecture:{kind:'asymmetric mountain terrace mill with isolated drive chamber',roofStyle:'terraced-double-elevation-stone',roofTerraces:[{x:[0,11],y:12},{x:[12,22],y:10}],operating:false},
  dependencies:['pack1:002','pack1:007','pack1:010','pack3:025','pack4:057','Biome mountain rock support and physical occupied AABBs to be verified','No spinning mill wheel or water simulation']});
}
const builders=new Map([
 ['lumberyard:temperate:medium',temperateMediumLumberyard],
 ['lumberyard:desert:small',desertSmallLumberyard],
 ['mill:temperate:medium',temperateMediumMill],
 ['mill:mountain:small',mountainSmallMill]
]);
export function createRegionalIndustryBlueprint(type,biome,size,variant=1){
 if(variant!==1)throw new RangeError('Only four explicitly authored original M2 regional variants exist');
 const f=builders.get(type+':'+biome+':'+size);
 if(!f)throw new RangeError('Unwritten regional industry slot '+[type,biome,size].join(':'));
 return f();
}
export function createRegionalIndustryPool(){return [...builders.values()].map(f=>f());}
