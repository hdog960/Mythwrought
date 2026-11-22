// Builder 3B M2 frontier: six original coordinate-authored lumberyard / mill candidates.
// No world placement, save edits, production collision or machinery. Distinct per-biome plans.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';

const rect=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const nav=(id,x,z)=>({id,x,y:2,z,width:2,headroom:3});
const edge=(from,to)=>({from,to,kind:'level'});
const zone=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const detail=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});

function studio(type,biome,size,width,depth,height){
 const occupied=new Set(),modules=new Map(),id=assertSlot(type,biome,size,1);
 const key=(x,y,z)=>x+','+y+','+z;
 const has=(x,y,z)=>occupied.has(key(x,y,z));
 function put(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=width||z<0||z>=depth||y<0||y>=height)throw Error(id+' out-of-envelope '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unknown symbol '+ref);
  const k=key(x,y,z);if(occupied.has(k))throw Error(id+' overlap '+k+' '+role);
  occupied.add(k);if(!modules.has(role))modules.set(role,[]);modules.get(role).push([x,y,z,ref]);
 }
 function safe(role,x,y,z,ref){if(!has(x,y,z))put(role,x,y,z,ref);}
 function base(deck){for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
  put('foundation',x,0,z,'builtin:stone');
  put('floor',x,1,z,typeof deck==='function'?deck(x,z):deck);
 }}
 function perimeter({to,aisle,ref,windows=[]}){
  for(let y=2;y<=to;y++)for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
   if(!(x===0||x===width-1||z===0||z===depth-1))continue;
   if(z===depth-1&&(x===aisle||x===aisle+1)&&y<=4)continue;
   if(windows.some(([wx,wz])=>(x===0||x===width-1)&&z===wz&&(y===wx||y===wx+1)))continue;
   put('wall',x,y,z,ref);
  }
 }
 function pillars(points,top,ref,role='roof-post'){
  for(const [x,z] of points)for(let y=2;y<=top;y++)safe(role,x,y,z,ref);
 }
 function canopy({x0,x1,z0,z1,y,ref,shape='flat',seamRef='pack2:015'}){
  const roofY=x=>shape==='gable'?y+Math.floor(Math.min(x-x0,x1-x)/3):
   shape==='terrace'?(x<Math.floor((x0+x1)/2)?y+2:y):y;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)put('roof',x,roofY(x),z,ref);
  // Exact voxel joints to prevent a gable step from magically floating in space.
  for(let x=x0+1;x<=x1;x++)if(roofY(x)!==roofY(x-1))
   for(let z=z0;z<=z1;z++)for(let yi=Math.min(roofY(x),roofY(x-1));yi<Math.max(roofY(x),roofY(x-1));yi++)
    safe('roof-joint',roofY(x)>roofY(x-1)?x:x-1,yi,z,seamRef);
  return roofY;
 }
 function block(role,x0,x1,y0,y1,z0,z1,ref){for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)safe(role,x,y,z,ref);}
 function finish({aisle,centerZ,branchZ,westX,eastX,eastZ,openName,rooms,features,architecture,dependencies}){
  const clearances=[
   rect(aisle,2,1,2,3,depth-1),
   rect(westX,2,branchZ,aisle-westX+2,3,2),
   rect(aisle,2,eastZ,eastX-aisle+2,3,2)];
  const paths={
   entry:'entry',
   nodes:[nav('entry',aisle,depth-1),nav('center',aisle,centerZ),nav('west',westX,branchZ),nav('east',eastX,eastZ)],
   edges:[edge('entry','center'),edge('center','west'),edge('center','east')]};
  const result={id,type,biome,size,variant:1,status:'theoretical',activated:false,
   envelope:rect(0,0,0,width,height,depth),
   modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
   clearances,openings:[{id:openName,facing:'south',x:aisle,y:2,z:depth-1,width:2,height:3}],
   spaces:rooms,navigation:paths,features,
   architecture:{...architecture,occupiedCoordinates:occupied.size,authoring:'six individually drawn frontier M2 plans',
    creatorApproved:false,worldPlaced:false,numericVariantSelected:false,perCellYawSelected:false},
   dependencies,implementation:'THEORETICAL_ONLY; no mechanical interactions, variant fitting, physical AABB or saving'};
  // Fail with the precise 3B-owned coordinate if an authored fixture blocks a reserved aisle.
  for(const clearance of clearances)for(let x=clearance.x;x<clearance.x+clearance.width;x++)
   for(let y=clearance.y;y<clearance.y+clearance.height;y++)
    for(let z=clearance.z;z<clearance.z+clearance.depth;z++)
     if(has(x,y,z))throw Error(id+' authored obstacle in declared two-wide clearance '+[x,y,z].join(','));
  validateBlueprint(result,ASSET_CATALOG);return result;
 }
 return {id,width,depth,height,put,safe,has,base,perimeter,pillars,canopy,block,finish};
}

// SNOW SMALL LUMBERYARD — narrow insulated twin-shed courtyard with winter sled ramp.
function snowSmallLumberyard(){
 const w=27,d=26,h=21,aisle=12,t=studio('lumberyard','snow','small',w,d,h);
 const {base,perimeter,pillars,canopy,block,safe,finish}=t;
 base((x,z)=>z>=19?'pack1:007':x<12?'pack2:013':'builtin:stone');
 perimeter({to:6,aisle,ref:'pack1:002'});
 // Two different-depth covered log-bays flanking the central exposed sled track.
 pillars([[2,2],[10,2],[2,13],[10,13]],10,'pack2:022');
 canopy({x0:2,x1:10,z0:2,z1:14,y:11,ref:'pack3:025',shape:'flat'});
 pillars([[17,4],[24,4],[17,12],[24,12]],9,'pack2:022','sled-bay-post');
 canopy({x0:17,x1:24,z0:4,z1:13,y:10,ref:'pack3:025',shape:'terrace'});
 for(let x=3;x<=8;x++)for(let z=4;z<=6;z++)for(let y=2;y<=3;y++)safe('frozen-log-racks',x,y,z,'builtin:wood');
 block('winter-crate-pallets',18,22,2,3,5,6,'pack4:057');
 for(let x=18;x<=23;x++)for(let z=17;z<=18;z++)safe('sled-loading-pad',x,2,z,'pack1:007');
 for(const x of [18,24])for(let z=19;z<=22;z++)if(x!==18||(z!==20&&z!==21))safe('sled-guides',x,2,z,'pack2:015');
 const branchZ=15,eastZ=20;
 return finish({aisle,centerZ:10,branchZ,westX:9,eastX:19,eastZ,openName:'double-winter-yard-gate',
  rooms:[zone('west-shed','insulated-timber-rack',rect(2,2,2,11,5,14),'west'),
   zone('winter-court','sled-transit-spine',rect(11,2,9,15,5,15),'center'),
   zone('east-loading','weather-covered-freight-yard',rect(16,2,17,10,4,8),'east')],
  features:[detail('snowproof-stone-path',12,2,20,'pack1:007'),detail('west-log-hall',5,2,5,'builtin:wood'),
   detail('winter-freight-crates',19,2,5,'pack4:057'),detail('sled-runners',18,2,20,'pack2:015'),
   detail('working-log-sled',24,2,23,null,'Sled physics/cargo and repair gameplay absent')],
  architecture:{kind:'twin-offset-insulated-snow-storage with dedicated sled-loading court',roofStyle:'one-flat-one-terraced-winter-roof',bayCount:2},
  dependencies:['pack1:002','pack1:007','pack2:015','pack2:022','pack3:025','pack4:057','Real insulated wall family and snow loads unapproved']});
}

// ENCHANTED MEDIUM LUMBERYARD — open arbor-workshop in a split-ring courtyard,
// unlike the square temperate shed / sandstone pergola / snow twin-bay.
function enchantedMediumLumberyard(){
 const w=35,d=32,h=24,aisle=16,t=studio('lumberyard','enchanted-forest','medium',w,d,h);
 const {base,perimeter,pillars,canopy,block,safe,finish}=t;
 base((x,z)=>x<=15&&z<=20?'pack2:013':'builtin:dirt');
 perimeter({to:4,aisle,ref:'pack2:015'});
 for(let z=3;z<=22;z++)for(let y=2;y<=6;y++){safe('livingwood-walk-rail',2,y,z,'pack2:015');if(z!==20&&z!==21)safe('livingwood-work-rail',12,y,z,'pack2:015');}
 pillars([[3,3],[11,3],[3,20],[11,20]],10,'pack2:022');
 canopy({x0:3,x1:11,z0:3,z1:21,y:11,ref:'pack3:023',shape:'gable'});
 pillars([[24,3],[32,3],[24,17],[32,17]],9,'pack2:022','arbor-east-post');
 canopy({x0:24,x1:32,z0:3,z1:18,y:10,ref:'pack3:023',shape:'flat'});
 for(let x=4;x<=8;x++)for(let z=5;z<=7;z++)for(let y=2;y<=4;y++)safe('ritual-sorted-livingwood',x,y,z,'builtin:wood');
 block('fungal-fiber-crates',26,30,2,3,5,7,'pack4:057');
 for(let x=27;x<=31;x++)for(let z=22;z<=24;z++)safe('east-export-wood-deck',x,2,z,'pack2:013');
 for(const x of [25,32])for(let z=22;z<=28;z++)if(x!==25||(z!==24&&z!==25))safe('freight-arbor-rails',x,2,z,'pack2:015');
 return finish({aisle,centerZ:11,branchZ:20,westX:12,eastX:25,eastZ:24,openName:'forest-freight-greenway',
  rooms:[zone('grove-hall','arbor-protected-wood-sorting',rect(3,2,3,15,5,20),'west'),
   zone('central-court','living-log-cart-circle',rect(15,2,10,19,4,19),'center'),
   zone('east-export','woven-wood-cart-staging',rect(24,2,19,11,4,12),'east')],
  features:[detail('west-wooden-arbor',5,2,6,'builtin:wood'),detail('east-fiber-crates',28,2,6,'pack4:057'),
   detail('grove-freight-tracks',28,2,23,'pack2:013'),detail('wooden-support-vault',3,6,20,'pack2:022'),
   detail('livingwood-growth',9,11,20,null,'Biome130 livingwood growth and magical mechanics not built')],
  architecture:{kind:'two separated tree-arbor sheds and circular forest-transit courtyard',roofStyle:'west-gabled-canopy-east-flat-fiber-arbor',operating:false},
  dependencies:['pack2:013','pack2:015','pack2:022','pack3:023','pack4:057','biome130:096 SYMBOLIC ONLY, not registered','per-cell occupancy unresolved']});
}

// MOUNTAIN LARGE LUMBERYARD — huge stone retaining/loading court with
// two cantilever-proxy tier decks (but actual supports, no magical hover).
function mountainLargeLumberyard(){
 const w=44,d=40,h=29,aisle=20,t=studio('lumberyard','mountain','large',w,d,h);
 const {base,perimeter,pillars,canopy,block,safe,finish}=t;
 base((x,z)=>z>=27?'pack1:007':x<=19?'pack2:013':'builtin:stone');
 perimeter({to:8,aisle,ref:'pack1:002'});
 for(let y=2;y<=7;y++)for(let z=3;z<=24;z++)safe('cliff-retaining-wall',2,y,z,'pack1:002');
 pillars([[3,3],[17,3],[3,24],[17,24]],14,'pack1:010');
 canopy({x0:3,x1:17,z0:3,z1:25,y:15,ref:'pack3:025',shape:'terrace'});
 pillars([[28,5],[40,5],[28,21],[40,21]],12,'pack1:010','ore-haul-post');
 canopy({x0:28,x1:40,z0:5,z1:22,y:13,ref:'pack3:025',shape:'gable'});
 block('upper-deck-raw-timber',5,11,2,5,6,9,'builtin:wood');
 block('haul-crates',31,36,2,3,9,12,'pack4:057');
 for(let x=29;x<=39;x++)for(let z=29;z<=30;z++)safe('granite-haul-landing',x,2,z,'pack1:007');
 for(const x of [30,41])for(let z=27;z<=36;z++)if(x!==30||(z!==34&&z!==35))safe('switchback-guarding',x,2,z,'pack1:010');
 return finish({aisle,centerZ:11,branchZ:25,westX:17,eastX:30,eastZ:34,openName:'quarry-sledge-exit',
  rooms:[zone('quarry-gallery','long-cliffside-timber-gallery',rect(3,2,3,19,7,24),'west'),
   zone('switchback-court','mountain-transit-ramp-court',rect(19,2,10,24,7,28),'center'),
   zone('haul-landing','oversize-stepped-log-haul-port',rect(28,2,26,15,6,13),'east')],
  features:[detail('cliffstone-brace',2,5,7,'pack1:002'),detail('upper-timber-storage',7,2,7,'builtin:wood'),
   detail('granite-loading-landing',33,2,29,'pack1:007'),detail('loaded-export-bins',34,2,11,'pack4:057'),
   detail('counterweighted-sledge',42,3,29,null,'No mechanical lift or sledge path engine')],
  architecture:{kind:'long stone cliff retaining hall with staggered saw-loft canopy and granite export switchback',roofStyle:'double-terrace-and-gabled-freight-shed'},
  dependencies:['pack1:002','pack1:007','pack1:010','pack3:025','pack4:057','biome130:098 cliff anchors SYMBOLIC ONLY','physical yaw/support/cantilever proof pending']});
}

// DESERT MEDIUM MILL — adobe wind-screen courtyard + shaded mill chamber;
// raised vented roof is stationary, not an active windmill rotor.
function desertMediumMill(){
 const w=34,d=31,h=25,aisle=15,t=studio('mill','desert','medium',w,d,h);
 const {base,perimeter,pillars,canopy,block,safe,finish}=t;
 base((x,z)=>z>=15?'pack1:007':x<=15?'pack2:013':'biome130:006');
 perimeter({to:9,aisle,ref:'pack1:002',windows:[[5,8],[5,22]]});
 for(let x=1;x<w-1;x++)for(let y=2;y<=6;y++)if(x!==aisle&&x!==aisle+1)safe('dry-grain-partition',x,y,11,'pack1:002');
 for(let z=13;z<=28;z++)for(let y=2;y<=6;y++)if(z!==21&&z!==22)safe('shaft-wind-wall',25,y,z,'pack1:002');
 pillars([[3,3],[13,3],[3,25],[13,25]],11,'pack1:010');
 canopy({x0:3,x1:13,z0:3,z1:26,y:12,ref:'pack1:007',shape:'flat'});
 pillars([[27,3],[31,3],[27,20],[31,20]],12,'pack1:010','wind-tower-pier');
 canopy({x0:27,x1:31,z0:3,z1:22,y:13,ref:'pack1:007',shape:'terrace'});
 block('dune-dry-cereal-bins',5,10,2,3,4,6,'pack4:057');
 block('stationary-grind-masonry',7,9,2,2,17,19,'pack1:007');
 for(let z=15;z<=18;z++)for(let y=2;y<=5;y++)safe('wind-drive-buttress',30,y,z,'pack1:010');
 return finish({aisle,centerZ:17,branchZ:9,westX:12,eastX:26,eastZ:21,openName:'desert-mill-south-portal',
  rooms:[zone('grain','adobe-dry-grain-store',rect(2,2,2,15,5,10),'west'),
   zone('grind','flat-roof-central-mill-court',rect(12,2,15,21,5,14),'center'),
   zone('wind','shaded-wind-drive-shaft-house',rect(26,2,13,7,5,16),'east')],
  features:[detail('dried-grain-crates',6,2,5,'pack4:057'),detail('wind-shaft-casing',30,3,16,'pack1:010'),
   detail('sunshade-colonnade',3,6,3,'pack1:010'),detail('grind-pier',8,2,17,'pack1:007'),
   detail('wind-rotor',33,10,17,null,'Wind vane, powered rotor and grain processing are not implemented')],
  architecture:{kind:'arid courtyard mill with isolated wind-vent shaft and sandstone portico',roofStyle:'flat-vented-adobe-portico-and-terraced-wind-shed',operating:false},
  dependencies:['biome130:006','pack1:002','pack1:007','pack1:010','pack2:013','pack4:057','wind energy and shaft rotations symbolic']});
}

// SNOW MEDIUM MILL — deep winter mill with a double-insulated roof tunnel,
// separated internal grain silo + timber-lined grinding hall.
function snowMediumMill(){
 const w=35,d=33,h=27,aisle=16,t=studio('mill','snow','medium',w,d,h);
 const {base,perimeter,pillars,canopy,block,safe,finish}=t;
 base((x,z)=>z<=13?'pack2:013':'pack1:007');
 perimeter({to:10,aisle,ref:'pack1:002',windows:[[4,7],[4,25]]});
 for(let x=1;x<w-1;x++)for(let y=2;y<=7;y++)if(x!==aisle&&x!==aisle+1)safe('grain-silo-transverse-wall',x,y,13,'pack1:002');
 for(let z=15;z<=29;z++)for(let y=2;y<=7;y++)if(z!==22&&z!==23)safe('frozen-shaft-wall',26,y,z,'pack2:015');
 pillars([[3,3],[13,3],[3,29],[13,29]],14,'pack2:022');
 canopy({x0:3,x1:13,z0:3,z1:30,y:15,ref:'pack3:025',shape:'gable'});
 pillars([[28,3],[32,3],[28,24],[32,24]],11,'pack1:010','winter-drive-pier');
 canopy({x0:28,x1:32,z0:3,z1:25,y:12,ref:'pack3:025',shape:'terrace'});
 block('grain-vault-sled-bins',5,10,2,4,4,7,'pack4:057');
 block('millstone-winter-masonry',6,9,2,2,19,21,'pack1:007');
 for(let z=16;z<=21;z++)for(let y=2;y<=4;y++)safe('heater-foundation',31,y,z,'pack1:010');
 return finish({aisle,centerZ:19,branchZ:9,westX:13,eastX:27,eastZ:22,openName:'snow-mill-freight-gate',
  rooms:[zone('grain','winter-silo-and-storage',rect(2,2,2,16,6,12),'west'),
   zone('mill','insulated-stone-grind-hall',rect(12,2,16,22,6,15),'center'),
   zone('frost-drive','frostproof-headrace-room',rect(27,2,15,7,6,15),'east')],
  features:[detail('winter-grain-racks',7,2,5,'pack4:057'),detail('roof-frost-shedding',8,15,18,'pack3:025'),
   detail('hearthless-cold-stone-grinding',8,2,20,'pack1:007'),detail('shaft-protection-piers',31,2,18,'pack1:010'),
   detail('heated-wheel-bearing',34,7,19,null,'Insulation/heat wheel mechanisms still symbolic')],
  architecture:{kind:'insulated double-shed snow mill with separate winter silo and enclosed shaft',roofStyle:'insulated-steep-gable-and-lower-terrace',operating:false},
  dependencies:['pack1:002','pack1:007','pack1:010','pack2:013','pack2:015','pack2:022','pack3:025','pack4:057','biome130:094 insulated wall core symbolic']});
}

// ENCHANTED LARGE MILL — three separated stone-milling, grain, and moonwater
// vaults with two architecturally unequal roof canopies and central courts.
function enchantedLargeMill(){
 const w=45,d=42,h=30,aisle=21,t=studio('mill','enchanted-forest','large',w,d,h);
 const {base,perimeter,pillars,canopy,block,safe,finish}=t;
 base((x,z)=>x<=20?'pack2:013':z<=25?'pack1:007':'builtin:stone');
 perimeter({to:8,aisle,ref:'pack2:015',windows:[[5,12],[5,33]]});
 for(let x=1;x<w-1;x++)for(let y=2;y<=6;y++)if(x!==aisle&&x!==aisle+1)safe('moonwater-transverse-wall',x,y,15,'pack2:015');
 for(let z=17;z<=38;z++)for(let y=2;y<=6;y++)if(z!==28&&z!==29)safe('forest-axle-vault-partition',32,y,z,'pack1:002');
 pillars([[3,3],[18,3],[3,38],[18,38]],17,'pack2:022');
 canopy({x0:3,x1:18,z0:3,z1:38,y:18,ref:'pack3:023',shape:'gable'});
 pillars([[35,5],[42,5],[35,32],[42,32]],12,'pack1:010','water-vault-support');
 canopy({x0:35,x1:42,z0:5,z1:33,y:13,ref:'pack3:025',shape:'terrace'});
 block('moon-grain-loom-crates',6,12,2,4,4,9,'pack4:057');
 block('deep-green-milling-dais',8,14,2,2,22,26,'pack1:007');
 for(let z=20;z<=26;z++)for(let y=2;y<=6;y++)safe('moonwater-wheel-pier',40,y,z,'pack1:010');
 return finish({aisle,centerZ:23,branchZ:10,westX:18,eastX:33,eastZ:28,openName:'forest-mill-vault-entry',
  rooms:[zone('granary','enclosed-canopy-grain-vault',rect(2,2,2,21,6,14),'west'),
   zone('grinder','forest-stone-deep-grind-court',rect(18,2,19,26,6,20),'center'),
   zone('moonwater','separate-livingwood-shaft-vault',rect(33,2,17,11,6,22),'east')],
  features:[detail('moonwater-axle-bearing',40,3,23,'pack1:010'),detail('deep-grind-dais',10,2,24,'pack1:007'),
   detail('forest-granary-bins',9,2,6,'pack4:057'),detail('vault-timber-posts',3,11,3,'pack2:022'),
   detail('magical-water-drive',44,9,23,null,'Magical water flow/rotor/mill behavior deliberately unresolved')],
  architecture:{kind:'triple-vault moonwater mill with a broad timber canopy and terraced stone axle tower',roofStyle:'asymmetric-forest-grain-vault-and-shaft-terrace',operating:false},
  dependencies:['pack1:002','pack1:007','pack1:010','pack2:013','pack2:015','pack2:022','pack3:023','pack3:025','pack4:057','biome130:096 livingwood structural core symbolic only']});
}

const builders=new Map([
 ['lumberyard:snow:small',snowSmallLumberyard],
 ['lumberyard:enchanted-forest:medium',enchantedMediumLumberyard],
 ['lumberyard:mountain:large',mountainLargeLumberyard],
 ['mill:desert:medium',desertMediumMill],
 ['mill:snow:medium',snowMediumMill],
 ['mill:enchanted-forest:large',enchantedLargeMill]
]);
export function createFrontierIndustryBlueprint(type,biome,size,variant=1){
 if(variant!==1)throw new RangeError('No variant 2+ source authored in frontier batch');
 const builder=builders.get(type+':'+biome+':'+size);
 if(!builder)throw new RangeError('No coordinate-authored frontier blueprint for '+[type,biome,size].join(':'));
 return builder();
}
export function createFrontierIndustryPool(){return [...builders.values()].map(build=>build());}
