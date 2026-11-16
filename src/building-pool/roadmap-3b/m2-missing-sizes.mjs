// Builder 3B M2: exact missing variant-1 industry biome/size slots.
// Ten individually coordinate-authored industrial buildings; NO world, save, runtime,
// registry, automation, shared code or creator approval effects.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';

const bounds=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const node=(id,x,z)=>({id,x,y:2,z,width:2,headroom:3});
const link=(from,to)=>({from,to,kind:'level'});
const space=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const detail=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});

// These are ten independent spatial-program drawings, not rotations, palette
// reskins or a loop that creates variants from random/seed parameters.
// Each drawing specifies actual independent roof footprints/cross-sections,
// support points, masonry divisions, routes, work areas and structural fixtures.
const drawings=[
 {type:'lumberyard',biome:'temperate',size:'large',W:50,D:45,H:31,aisle:24,left:18,leftZ:18,right:34,rightZ:32,spineZ:15,
  title:'riverfront timber customs depot with broad dry saw-shed and stepped cart piers',
  floor:'pack2:013',wall:'pack2:015',wallTop:6,
  roofs:[{range:[3,20,3,25],top:14,shape:'gable',ref:'pack3:023',post:'pack2:022'},
   {range:[31,46,7,28],top:12,shape:'sawtooth',ref:'pack3:025',post:'pack1:010'},
   {range:[31,45,34,41],top:10,shape:'lean',ref:'pack3:023',post:'pack2:022'}],
  divides:[{axis:'z',at:11,from:2,to:20,height:6,ref:'pack2:015'},
   {axis:'x',at:44,from:6,to:27,height:7,ref:'pack2:015'}],
  stock:[{name:'greenwood-rounds',xyz:[5,13,2,4,6,10],ref:'builtin:wood'},
   {name:'dry-beam-customs',xyz:[33,41,2,4,10,13],ref:'pack4:057'},
   {name:'south-export-landing',xyz:[33,43,2,2,35,39],ref:'pack1:007'}],
  symbolic:['Dock water, timber commerce, harvesting, crane and powered saw still nonfunctional'],
  rooms:['covered-saw-platform','open-haul-yard','canal-side-customs-loading'],
  featureRefs:['builtin:wood','pack4:057','pack1:007']},
 {type:'lumberyard',biome:'desert',size:'medium',W:34,D:32,H:24,aisle:16,left:11,leftZ:14,right:25,rightZ:25,spineZ:11,
  title:'courtyard sandstone peg-and-beam warehouse with disconnected shade wings',
  floor:'pack1:007',wall:'pack1:002',wallTop:7,
  roofs:[{range:[2,12,3,18],top:11,shape:'flat',ref:'pack1:007',post:'pack1:010'},
   {range:[25,31,5,20],top:12,shape:'lean',ref:'pack3:025',post:'pack1:010'},
   {range:[23,31,25,29],top:9,shape:'flat',ref:'pack1:007',post:'pack1:010'}],
  divides:[{axis:'x',at:2,from:3,to:20,height:8,ref:'pack1:010'}],
  stock:[{name:'sand-dried-plank-bins',xyz:[4,10,2,3,6,8],ref:'pack4:057'},
   {name:'courtyard-dry-log-piles',xyz:[27,30,2,4,8,11],ref:'builtin:wood'},
   {name:'covered-caravan-staging',xyz:[24,30,2,2,26,28],ref:'pack1:007'}],
  symbolic:['biome130:006 desert sand symbol source-registered but per-cell physical choice unresolved','No working caravan or waterwheel'],
  rooms:['north-shaded-dry-store','sun-vented-freight-court','caravan-cart-alcove'],
  featureRefs:['pack4:057','builtin:wood','pack1:007']},
 {type:'lumberyard',biome:'snow',size:'medium',W:36,D:35,H:29,aisle:17,left:12,leftZ:16,right:26,rightZ:27,spineZ:12,
  title:'snowdrift bunker with unequal pitched sheds and enclosed sled pad',
  floor:'pack1:007',wall:'pack1:002',wallTop:8,
  roofs:[{range:[2,14,2,22],top:14,shape:'cross',ref:'pack3:025',post:'pack1:010'},
   {range:[25,33,4,24],top:13,shape:'gable',ref:'pack3:025',post:'pack2:022'}],
  divides:[{axis:'z',at:6,from:2,to:13,height:8,ref:'pack1:002'},
   {axis:'x',at:34,from:8,to:25,height:6,ref:'pack1:010'}],
  stock:[{name:'frostproof-stacked-wood',xyz:[4,11,2,4,8,10],ref:'builtin:wood'},
   {name:'sled-cover-bundles',xyz:[28,31,2,3,8,12],ref:'pack4:057'},
   {name:'sled-turnout-stones',xyz:[27,32,2,2,29,32],ref:'pack1:007'}],
  symbolic:['biome130:094 insulation not registered','No vehicle movement or avalanche simulation'],
  rooms:['covered-winter-sawmill','ice-road-two-track','sled-wheelhouse-court'],
  featureRefs:['builtin:wood','pack4:057','pack1:007']},
 {type:'lumberyard',biome:'enchanted-forest',size:'large',W:51,D:46,H:33,aisle:25,left:18,leftZ:20,right:37,rightZ:34,spineZ:16,
  title:'double-height vine arboretum with sunken sorting orchard and asymmetrical east grove',
  floor:'pack2:013',wall:'pack2:015',wallTop:4,
  roofs:[{range:[3,19,3,26],top:14,shape:'cross',ref:'pack3:023',post:'pack2:022'},
   {range:[35,48,5,31],top:16,shape:'terrace',ref:'pack3:023',post:'pack2:022'},
   {range:[36,48,36,43],top:12,shape:'sawtooth',ref:'pack3:025',post:'pack1:010'}],
  divides:[{axis:'x',at:2,from:4,to:25,height:11,ref:'pack2:015'},
   {axis:'z',at:5,from:35,to:48,height:8,ref:'pack2:015'}],
  stock:[{name:'livingwood-sample-logs',xyz:[5,14,2,4,7,11],ref:'builtin:wood'},
   {name:'fungal-fiber-pallets',xyz:[40,45,2,4,9,15],ref:'pack4:057'},
   {name:'magical-grove-freight-deck',xyz:[38,46,2,2,38,41],ref:'pack2:013'}],
  symbolic:['biome130:096 future livingwood masonry unregistered','No animated saplings or magical growth'],
  rooms:['west-livingwood-greenhouse','grove-trunk-drying-garden','high-mycology-cart-depot'],
  featureRefs:['builtin:wood','pack4:057','pack2:013']},
 {type:'lumberyard',biome:'mountain',size:'small',W:29,D:30,H:27,aisle:13,left:9,leftZ:13,right:22,rightZ:24,spineZ:10,
  title:'granite cliff cleft with stepped western gallery and unsupported crane reserved',
  floor:'pack1:007',wall:'pack1:002',wallTop:9,
  roofs:[{range:[2,10,3,17],top:14,shape:'terrace',ref:'pack3:025',post:'pack1:010'},
   {range:[21,27,6,19],top:11,shape:'lean',ref:'pack3:025',post:'pack1:010'}],
  divides:[{axis:'x',at:2,from:3,to:20,height:10,ref:'pack1:002'}],
  stock:[{name:'rough-rock-lumber',xyz:[3,7,2,4,5,8],ref:'builtin:wood'},
   {name:'granite-ridge-wrapping',xyz:[23,26,2,3,8,12],ref:'pack4:057'},
   {name:'cliffside-freight-pad',xyz:[21,26,2,2,26,28],ref:'pack1:007'}],
  symbolic:['biome130:098 rock anchor symbolic not registered','Crane and cliff physics not active'],
  rooms:['retaining-ledge-store','stone-switchback-cart-aisle','cliff-rigging-court'],
  featureRefs:['builtin:wood','pack4:057','pack1:007']},
 {type:'mill',biome:'temperate',size:'large',W:52,D:46,H:35,aisle:25,left:18,leftZ:13,right:38,rightZ:33,spineZ:20,
  title:'large three-courtyard waterwheel guild mill with enclosed grain galleries',
  floor:'pack2:013',wall:'pack1:002',wallTop:12,
  roofs:[{range:[0,51,0,45],top:14,shape:'gable',ref:'pack3:023',post:'pack2:022'},
   {range:[36,49,8,25],top:26,shape:'flat',ref:'pack3:025',post:'pack1:010'}],
  divides:[{axis:'z',at:15,from:1,to:50,height:9,ref:'pack1:002'},
   {axis:'x',at:41,from:16,to:44,height:10,ref:'pack1:002'}],
  stock:[{name:'three-pier-grain-chests',xyz:[4,13,2,5,4,9],ref:'pack4:057'},
   {name:'deep-grind-stone-plinths',xyz:[6,14,2,2,24,28],ref:'pack1:007'},
   {name:'mill-bearing-bridge-foundation',xyz:[43,48,2,5,23,26],ref:'pack1:010'}],
  symbolic:['Active waterwheel, river channel, gear trains and flour economy omitted'],
  rooms:['grain-guild-warehouse','three-bay-grinding-hall','river-drive-gear-vault'],
  featureRefs:['pack4:057','pack1:007','pack1:010']},
 {type:'mill',biome:'desert',size:'small',W:28,D:27,H:27,aisle:13,left:9,leftZ:10,right:22,rightZ:20,spineZ:14,
  title:'flat-sheltered courtyard quern workshop and passive desert windshaft',
  floor:'pack1:007',wall:'pack1:002',wallTop:8,
  roofs:[{range:[1,11,1,25],top:10,shape:'flat',ref:'pack1:007',post:'pack1:010'},
   {range:[20,26,4,17],top:13,shape:'sawtooth',ref:'pack3:025',post:'pack1:010'}],
  divides:[{axis:'z',at:8,from:1,to:11,height:6,ref:'pack1:002'},
   {axis:'x',at:25,from:2,to:18,height:9,ref:'pack1:002'}],
  stock:[{name:'date-grain-baskets',xyz:[3,6,2,3,3,5],ref:'pack4:057'},
   {name:'quern-stone-pair',xyz:[4,6,2,2,15,17],ref:'pack1:007'},
   {name:'wind-casing-timbers',xyz:[22,24,2,4,8,10],ref:'pack2:013'}],
  symbolic:['biome130:006 desert masonry diagnostic only','Passive windshaft is not a working windmill'],
  rooms:['caravan-grain-alcove','quern-courtyard','wind-casing-service-shed'],
  featureRefs:['pack4:057','pack1:007','pack2:013']},
 {type:'mill',biome:'snow',size:'small',W:30,D:30,H:29,aisle:14,left:10,leftZ:10,right:23,rightZ:22,spineZ:15,
  title:'snowblind crossroof quernhouse with frostproof grain tunnel',
  floor:'pack2:013',wall:'pack1:002',wallTop:11,
  roofs:[{range:[0,29,0,29],top:12,shape:'cross',ref:'pack3:025',post:'pack1:010'},
   {range:[21,27,4,15],top:20,shape:'flat',ref:'pack3:025',post:'pack1:010'}],
  divides:[{axis:'z',at:11,from:1,to:28,height:7,ref:'pack1:002'},
   {axis:'x',at:25,from:12,to:28,height:9,ref:'pack2:015'}],
  stock:[{name:'sealed-winter-grain-lockers',xyz:[3,7,2,4,4,6],ref:'pack4:057'},
   {name:'small-insulated-millstone',xyz:[5,8,2,2,19,22],ref:'pack1:007'},
   {name:'frostshaft-mount',xyz:[24,27,2,4,14,17],ref:'pack1:010'}],
  symbolic:['biome130:094 insulated wall not registered','No heating/frozen-water mechanical behavior'],
  rooms:['warming-free-grain-bins','stone-mill-crosshall','protected-ice-shaft-room'],
  featureRefs:['pack4:057','pack1:007','pack1:010']},
 {type:'mill',biome:'enchanted-forest',size:'medium',W:39,D:37,H:31,aisle:19,left:13,leftZ:14,right:30,rightZ:28,spineZ:18,
  title:'twin moonwater processing vault and livingwood canal workroom',
  floor:'pack2:013',wall:'pack2:015',wallTop:10,
  roofs:[{range:[1,16,0,36],top:13,shape:'gable',ref:'pack3:023',post:'pack2:022'},
   {range:[22,38,0,36],top:12,shape:'cross',ref:'pack3:025',post:'pack1:010'},
   {range:[10,29,6,13],top:20,shape:'flat',ref:'pack3:023',post:'pack2:022'}],
  divides:[{axis:'z',at:11,from:1,to:37,height:7,ref:'pack2:015'},
   {axis:'x',at:34,from:14,to:35,height:9,ref:'pack2:015'}],
  stock:[{name:'moon-grain-cabinet',xyz:[4,10,2,4,4,7],ref:'pack4:057'},
   {name:'enchanted-grind-dais',xyz:[5,10,2,2,22,26],ref:'pack1:007'},
   {name:'stream-axle-granite',xyz:[31,35,2,5,17,20],ref:'pack1:010'}],
  symbolic:['biome130:096 livingwood structural rib unregistered','No flowing moonwater or rune-based milling'],
  rooms:['moonwater-grain-vault','fae-milling-terrace','livingwood-axle-vault'],
  featureRefs:['pack4:057','pack1:007','pack1:010']},
 {type:'mill',biome:'mountain',size:'large',W:53,D:49,H:39,aisle:25,left:18,leftZ:16,right:39,rightZ:36,spineZ:22,
  title:'multi-level cliffside stonegrain monastery-mill with load-bearing cantilever buttresses',
  floor:'pack1:007',wall:'pack1:002',wallTop:13,
  roofs:[{range:[0,52,0,48],top:15,shape:'terrace',ref:'pack3:025',post:'pack1:010'},
   {range:[37,51,8,32],top:25,shape:'gable',ref:'pack3:025',post:'pack1:010'}],
  divides:[{axis:'z',at:17,from:1,to:51,height:10,ref:'pack1:002'},
   {axis:'x',at:42,from:18,to:47,height:11,ref:'pack1:002'},
   {axis:'x',at:4,from:2,to:20,height:10,ref:'pack1:010'}],
  stock:[{name:'ridge-grain-rock-bins',xyz:[6,14,2,5,4,10],ref:'pack4:057'},
   {name:'upper-ledge-grind-piers',xyz:[7,14,2,2,27,31],ref:'pack1:007'},
   {name:'headrace-cliff-buttresses',xyz:[44,48,2,6,24,27],ref:'pack1:010'}],
  symbolic:['biome130:098 cliff support anchors not registered','Headwater channel, actual drive and mountain support untested'],
  rooms:['rock-grain-archive','multi-stone-grind-gallery','headrace-shaft-service-vault'],
  featureRefs:['pack4:057','pack1:007','pack1:010']}
];

function author(d){
 const {W:w,D:depth,H:height,aisle,left,leftZ,right,rightZ,spineZ}=d, id=assertSlot(d.type,d.biome,d.size,1);
 const keyed=(x,y,z)=>x+','+y+','+z,used=new Map(),roles=new Map();
 const route=[bounds(aisle,2,0,2,3,depth),bounds(left,2,leftZ,aisle-left+2,3,2),bounds(aisle,2,rightZ,right-aisle+2,3,2)];
 const routeHas=(x,y,z)=>route.some(s=>x>=s.x&&x<s.x+s.width&&y>=s.y&&y<s.y+s.height&&z>=s.z&&z<s.z+s.depth);
 function put(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=height||z<0||z>=depth)throw Error(id+' out of bounds '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unknown physical-family symbol '+ref);
  const k=keyed(x,y,z);
  if(used.has(k)||routeHas(x,y,z))return false;
  used.set(k,{x,y,z,ref,role});if(!roles.has(role))roles.set(role,[]);roles.get(role).push([x,y,z,ref]);return true;
 }
 const fill=(role,r,ref)=>{const [x0,x1,y0,y1,z0,z1]=r;for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)put(role,x,y,z,ref);};
 // Fully authored solid foundation and floor.
 for(let x=0;x<w;x++)for(let z=0;z<depth;z++){put('foundation',x,0,z,'builtin:stone');put('floor',x,1,z,d.floor);}
 for(let y=2;y<=d.wallTop;y++)for(let x=0;x<w;x++)for(let z=0;z<depth;z++)
  if(x===0||x===w-1||z===0||z===depth-1)put('wall',x,y,z,d.wall);
 // Original room divisions, including real door openings at all declared aisles.
 for(const p of d.divides){
  if(p.axis==='z')for(let x=p.from;x<=p.to;x++)for(let y=2;y<=p.height;y++)put('room-division',x,y,p.at,p.ref);
  else for(let z=p.from;z<=p.to;z++)for(let y=2;y<=p.height;y++)put('room-division',p.at,y,z,p.ref);
 }
 const roofAt=(r,x,z)=>{
  const [x0,x1,z0,z1]=r.range;
  if(r.shape==='gable')return r.top+Math.floor(Math.min(x-x0,x1-x)/3);
  if(r.shape==='cross')return r.top+Math.floor(Math.min(z-z0,z1-z)/5);
  if(r.shape==='terrace')return r.top+(x<=Math.floor((x0+x1)/2)?2:0);
  if(r.shape==='sawtooth')return r.top+(Math.floor((x-x0)/4)%2);
  if(r.shape==='lean')return r.top+Math.floor((x-x0)/5);
  return r.top;
 };
 for(const [n,roof] of d.roofs.entries()){
  const [x0,x1,z0,z1]=roof.range;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)put('roof',x,roofAt(roof,x,z),z,roof.ref);
  for(let x=x0+1;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const a=roofAt(roof,x-1,z),b=roofAt(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)put('roof-x-step',a<b?x:x-1,y,z,'pack2:015');
  }
  for(let z=z0+1;z<=z1;z++)for(let x=x0;x<=x1;x++){
   const a=roofAt(roof,x,z-1),b=roofAt(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)put('roof-z-step',x,y,a<b?z:z-1,'pack2:015');
  }
  // Structural bearing at exact roof corners and at two inner thirds; never
  // claim the entire canopy is supported by a symbolic or imagined fixture.
  const padX=Math.max(2,Math.floor((x1-x0)/3)),padZ=Math.max(2,Math.floor((z1-z0)/3));
  const supports=[[x0,z0],[x1,z0],[x0,z1],[x1,z1],
   [Math.min(x1,x0+padX),Math.min(z1,z0+padZ)],
   [Math.max(x0,x1-padX),Math.max(z0,z1-padZ)]];
  for(const [x,z] of supports)for(let y=2;y<roofAt(roof,x,z);y++)put('bearing-pier-'+n,x,y,z,roof.post);
 }
 for(const stock of d.stock)fill(stock.name,stock.xyz,stock.ref);
 for(const r of route)for(let x=r.x;x<r.x+r.width;x++)for(let y=r.y;y<r.y+r.height;y++)for(let z=r.z;z<r.z+r.depth;z++)
  if(used.has(keyed(x,y,z)))throw Error(id+' required 2-wide aisle blocked '+[x,y,z]);
 const modules=[...roles].map(([role,cells])=>({id:role+'-01',role,cells}));
 const spaces=[
  space('west-production',d.rooms[0],bounds(1,2,1,aisle-1,6,depth-3),'west'),
  space('freight-spine',d.rooms[1],bounds(aisle,2,2,2,6,depth-2),'center'),
  space('east-production',d.rooms[2],bounds(aisle+2,2,1,w-aisle-3,6,depth-3),'east')];
 const features=[
  detail('west-primary-workpiece',left-1,2,Math.max(2,leftZ-3),d.featureRefs[0]),
  detail('central-sorting-floor',aisle,2,spineZ,'pack1:007'),
  detail('east-freight-assembly',right+1,2,Math.max(2,rightZ-3),d.featureRefs[1]),
  detail('material-bracing',Math.max(1,left-3),3,Math.max(2,leftZ-5),'pack1:010'),
  detail('logistics-support-pallet',right,2,Math.max(2,rightZ-5),d.featureRefs[2]),
  detail('missing-operating-machinery',w-2,3,depth-3,null,'No working forestry, milling, wheels or economic processing in this theoretical candidate')];
 const out={id,type:d.type,biome:d.biome,size:d.size,variant:1,status:'theoretical',activated:false,
  envelope:bounds(0,0,0,w,height,depth),modules,clearances:route,
  openings:[{id:'source-double-freight-door',facing:'south',x:aisle,y:2,z:depth-1,width:2,height:3}],
  spaces,navigation:{entry:'entry',nodes:[
   node('entry',aisle,depth-1),node('center',aisle,spineZ),node('west',left,leftZ),node('east',right,rightZ)
  ],edges:[link('entry','center'),link('center','west'),link('center','east')]},
  features,architecture:{kind:d.title,roofCrossSections:d.roofs.map(r=>r.shape),
   occupiedCoordinates:used.size,structuralRoofSpans:d.roofs.map(r=>r.range),
   sourceAuthoring:'ten independently composed biome-size construction drawings',worldPlaced:false,
   perCellVariantSelected:false,perCellOrientationSelected:false},
  dependencies:[
   d.wall,d.floor,...d.roofs.map(r=>r.ref),...d.stock.map(s=>s.ref),
   ...d.symbolic,'per-cell manual pack numeric variant, yaw/state/attachment/collision/multicell reservations not approved'
  ],
  implementation:'THEORETICAL_BLUEPRINT_ONLY — all mill and forestry interactions symbolic; no world/save/deploy'};
 validateBlueprint(out,ASSET_CATALOG);
 return out;
}
const designMap=new Map(drawings.map(d=>[d.type+':'+d.biome+':'+d.size,d]));
export function createMissingSlotIndustryBlueprint(type,biome,size,variant=1){
 if(variant!==1)throw new RangeError('Original variant one only; additional variants require distinct authored diagrams');
 const spec=designMap.get(type+':'+biome+':'+size);
 if(!spec)throw new RangeError('No authored 3B missing-slot source for '+[type,biome,size].join(':'));
 return author(spec);
}
export function createMissingSlotIndustryPool(){return drawings.map(author);}
