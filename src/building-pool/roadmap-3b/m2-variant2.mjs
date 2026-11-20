// Builder 3B M2 — independently authored variant-2 industrial blueprints.
// The six plans have irregular, purpose-specific 3D footprints rather than a
// common rectangular full-site template or any transform of variant-1 sources.
// Theoretical only; nothing touches live world, saves, registry, other lanes.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';

const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const N=(id,x,z)=>({id,x,y:2,z,width:2,headroom:3});
const E=(from,to)=>({from,to,kind:'level'});
const room=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const item=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
const plans=[
 {type:'lumberyard',biome:'temperate',size:'small',w:29,d:28,h:25,aisle:14,westX:8,westZ:10,eastX:22,eastZ:19,midZ:15,
  title:'asymmetric U-shaped river timber co-op with open central float yard and split pier sheds',
  yard:'river timber float court',west:'boat plank repair bay',east:'low cart loading veranda',
  mask:[[12,17,0,27],[2,12,3,15],[18,26,11,23],[9,25,22,27]],
  roofs:[{name:'river-boathouse',r:[2,11,3,15],top:12,shape:'gable',cover:'pack3:023',post:'pack2:022'},
   {name:'wagon-porch',r:[19,26,13,23],top:10,shape:'slope',cover:'pack3:025',post:'pack1:010'}],
  cargo:[['staggered-raft-logs',[4,8,2,4,5,7],'builtin:wood'],['dovetail-planks',[20,24,2,3,14,17],'pack2:013'],['cart-landing',[18,24,2,2,24,25],'pack1:007']],
  details:[[3,5,3,'west-watergate'],[26,4,20,'low-rivercart-truss']],
  floor:'pack2:013',wall:'pack2:015',roofWallHeight:5,dependency:'Working river, floating timber, sawbenches and boat physics are future-only'},
 {type:'lumberyard',biome:'snow',size:'large',w:46,d:43,h:35,aisle:21,westX:12,westZ:20,eastX:34,eastZ:32,midZ:19,
  title:'three-offset avalanche bunkers with east/west freight atrium and protected sled passage',
  yard:'avalanche-break cargo spine',west:'deep reinforced beam chamber',east:'dual winter freight vaults',
  mask:[[18,25,0,42],[3,18,3,30],[28,42,6,16],[30,42,26,38],[12,34,34,42]],
  roofs:[{name:'avalanche-shell',r:[3,16,3,29],top:17,shape:'cross',cover:'pack3:025',post:'pack1:010'},
   {name:'northern-freight-bay',r:[29,42,6,16],top:13,shape:'saw',cover:'pack3:025',post:'pack2:022'},
   {name:'southern-sled-bay',r:[31,42,27,37],top:14,shape:'terrace',cover:'pack3:025',post:'pack1:010'}],
  cargo:[['iced-beam-stacks',[5,13,2,4,8,13],'builtin:wood'],['winter-sled-pallets',[32,39,2,4,8,11],'pack4:057'],['hauling-ramp',[31,39,2,2,36,39],'pack1:007']],
  details:[[4,3,6,'avalanche-barrier'],[40,2,28,'sled-buttress']],
  floor:'pack1:007',wall:'pack1:002',roofWallHeight:8,dependency:'Avalanche triggers, sled traction and thermal timber treatment are future-only; biome130:094 unregistered'},
 {type:'lumberyard',biome:'desert',size:'large',w:48,d:42,h:32,aisle:23,westX:13,westZ:17,eastX:36,eastZ:27,midZ:20,
  title:'open desert caravan oasis with separated wind porticoes and independent sun-drying gallery',
  yard:'cross-oasis caravan marshalling',west:'open reed canopy grainwood rack',east:'sun-baked timber export hall',
  mask:[[19,28,0,41],[3,19,3,23],[33,45,4,32],[13,40,34,41]],
  roofs:[{name:'reeded-windbreak',r:[4,17,3,22],top:14,shape:'saw',cover:'pack1:007',post:'pack1:010'},
   {name:'oasis-stone-portico',r:[34,44,4,31],top:16,shape:'flat',cover:'pack3:025',post:'pack1:010'},
   {name:'caravan-checkpoint',r:[16,21,35,40],top:10,shape:'lean',cover:'pack1:007',post:'pack1:010'}],
  cargo:[['sun-baked-timber',[5,13,2,3,7,11],'builtin:wood'],['wicker-sorting-crates',[36,40,2,4,7,12],'pack4:057'],['oasis-export-stone',[31,38,2,2,37,39],'pack1:007']],
  details:[[5,2,7,'desert-windshield'],[44,2,29,'sun-vented-masonry']],
  floor:'pack1:007',wall:'pack1:002',roofWallHeight:6,dependency:'Oasis water, functional caravan trade, shade physics and biome130:006 material selection remain unapproved'},
 {type:'mill',biome:'desert',size:'medium',w:37,d:34,h:30,aisle:18,westX:12,westZ:8,eastX:28,eastZ:22,midZ:16,
  title:'Z-shaped adobe quern mill with exposed ventilating court and detached elevated windshaft room',
  yard:'sand-cooling grinding court',west:'covered dry barley vault',east:'offset windshaft and storage bay',
  mask:[[16,21,0,33],[3,16,2,12],[23,34,15,28],[9,31,27,33]],
  roofs:[{name:'barley-archive',r:[3,15,2,12],top:12,shape:'flat',cover:'pack1:007',post:'pack1:010'},
   {name:'towered-windshaft',r:[24,33,16,27],top:19,shape:'terrace',cover:'pack1:007',post:'pack1:010'}],
  cargo:[['covered-grain-racks',[5,10,2,4,4,7],'pack4:057'],['windmill-stone-bearings',[27,31,2,5,18,20],'pack1:010'],['flourstone-unloading',[24,29,2,2,29,31],'pack1:007']],
  details:[[4,5,8,'adobe-mill-flue'],[33,2,25,'windshaft-stone-pier']],
  floor:'pack1:007',wall:'pack1:002',roofWallHeight:8,dependency:'Windmill rotor, gearing, quern animation and biome130:006 state remain unresolved'},
 {type:'mill',biome:'mountain',size:'small',w:31,d:32,h:31,aisle:14,westX:9,westZ:13,eastX:24,eastZ:24,midZ:16,
  title:'stepped cliff-grinder with left stone granary and elevated asymmetrical shaft retaining wall',
  yard:'rock pass-through mill court',west:'low cliff-side stonegrain larder',east:'terraced wheel casing chamber',
  mask:[[12,19,0,31],[2,12,4,19],[21,28,8,27],[9,26,25,31]],
  roofs:[{name:'rock-larder',r:[2,11,4,19],top:15,shape:'terrace',cover:'pack3:025',post:'pack1:010'},
   {name:'mountain-wheelhouse',r:[22,28,8,26],top:12,shape:'slope',cover:'pack3:025',post:'pack1:010'}],
  cargo:[['granite-grain-bins',[4,7,2,4,7,10],'pack4:057'],['lithic-quern-plinth',[23,26,2,3,11,14],'pack1:007'],['cliff-bridge-blocks',[21,25,2,2,27,29],'pack1:010']],
  details:[[2,4,15,'cliff-retaining-face'],[28,4,24,'hillside-axle-bearing']],
  floor:'pack1:007',wall:'pack1:002',roofWallHeight:9,dependency:'No functional water wheel, operating grindstone, cliff anchoring or biome130:098 physical shape'},
 {type:'mill',biome:'enchanted-forest',size:'medium',w:40,d:38,h:34,aisle:18,westX:12,westZ:18,eastX:29,eastZ:30,midZ:20,
  title:'H-shaped livingwood mill with unequal moon-grain and water-loom roof arcades',
  yard:'open central millhouse atrium',west:'long luminous-grain nave',east:'separated moonwater shaft towers',
  mask:[[16,23,0,37],[3,16,3,32],[25,37,4,16],[27,35,24,34],[7,34,32,37]],
  roofs:[{name:'livingwood-nave',r:[3,15,3,31],top:16,shape:'gable',cover:'pack3:023',post:'pack2:022'},
   {name:'northern-moon-loom',r:[26,37,4,16],top:18,shape:'cross',cover:'pack3:025',post:'pack1:010'},
   {name:'southern-axle-chapel',r:[28,35,24,34],top:13,shape:'terrace',cover:'pack3:023',post:'pack2:022'}],
  cargo:[['wood-vault-grain',[5,9,2,4,7,11],'pack4:057'],['fairy-mill-beam',[29,33,2,4,7,11],'pack2:013'],['moonwater-landing',[28,33,2,2,32,34],'pack1:007']],
  details:[[4,6,10,'livingwood-buttress'],[36,8,30,'lunar-axle-granite']],
  floor:'pack2:013',wall:'pack2:015',roofWallHeight:7,dependency:'No rune millshaft, flowing moonwater, growing livingwood or registered biome130:096 load-bearing family'}
];

function create(p){
 const {w,d,h,aisle,westX,westZ,eastX,eastZ,midZ}=p;
 const id=assertSlot(p.type,p.biome,p.size,2),shape=new Set();
 const one=(x,z)=>flat(x,z);
 for(const [x0,x1,z0,z1] of p.mask)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)shape.add(one(x,z));
 const reserved=[B(aisle,2,0,2,3,d),
  B(westX,2,westZ,aisle-westX+2,3,2),
  B(aisle,2,eastZ,eastX-aisle+2,3,2)];
 // Physically author the complete freight bridges between offset structures.
 // Each route extension receives the same real foundation and floor as the
 // bespoke masked wings; no graph-only teleportation or hovering corridor.
 for(const q of reserved)for(let x=q.x;x<q.x+q.width;x++)
  for(let z=q.z;z<q.z+q.depth;z++)shape.add(one(x,z));
 const corridor=(x,y,z)=>reserved.some(q=>x>=q.x&&x<q.x+q.width&&y>=q.y&&y<q.y+q.height&&z>=q.z&&z<q.z+q.depth);
 const cells=new Map(),roles=new Map();
 function has(x,y,z){return cells.has(key(x,y,z));}
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=h||z<0||z>=d)throw Error(id+' outside local voxel bounds '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unregistered candidate family '+ref);
  if(role!=='foundation'&&role!=='floor'&&!shape.has(one(x,z)))return false;
  if(corridor(x,y,z)||has(x,y,z))return false;
  cells.set(key(x,y,z),{role,x,y,z});
  if(!roles.has(role))roles.set(role,[]);
  roles.get(role).push([x,y,z,ref]);
  return true;
 }
 function volume(role,[x0,x1,y0,y1,z0,z1],ref){
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)write(role,x,y,z,ref);
 }
 // Voxel-exact non-rectangular building footprint includes open-air freight.
 for(const q of shape){const [x,z]=q.split(',').map(Number);
  write('foundation',x,0,z,'builtin:stone');write('floor',x,1,z,p.floor);
 }
 // Only actual footprint boundaries grow walls; no rectangular filler/outside blocks.
 for(const q of shape){const [x,z]=q.split(',').map(Number);
  if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,b])=>!shape.has(one(a,b))) && !corridor(x,2,z))
   for(let y=2;y<=p.roofWallHeight;y++)write('wall',x,y,z,p.wall);
 }
 const topOf=(roof,x,z)=>{
  const [x0,x1,z0,z1]=roof.r;
  if(roof.shape==='gable')return roof.top+Math.floor(Math.min(x-x0,x1-x)/3);
  if(roof.shape==='cross')return roof.top+Math.floor(Math.min(z-z0,z1-z)/4);
  if(roof.shape==='terrace')return roof.top+(x<=Math.floor((x0+x1)/2)?2:0);
  if(roof.shape==='saw')return roof.top+(Math.floor((x-x0)/3)%2);
  if(roof.shape==='slope')return roof.top+Math.floor((x-x0)/4);
  if(roof.shape==='lean')return roof.top+Math.floor((x-x0)/4);
  return roof.top;
 };
 for(const [n,roof] of p.roofs.entries()){
  const [x0,x1,z0,z1]=roof.r;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!shape.has(one(x,z)))throw Error(id+' invalid disconnected roof over missing foundation '+[x,z]);
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)write('roof',x,topOf(roof,x,z),z,roof.cover);
  // Join each stepped plane to preserve face-connected roof geometry.
  for(let x=x0+1;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const a=topOf(roof,x-1,z),b=topOf(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)write('roof-step-x',a<b?x:x-1,y,z,'pack2:015');
  }
  for(let z=z0+1;z<=z1;z++)for(let x=x0;x<=x1;x++){
   const a=topOf(roof,x,z-1),b=topOf(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)write('roof-step-z',x,y,a<b?z:z-1,'pack2:015');
  }
  const points=[[x0,z0],[x1,z0],[x0,z1],[x1,z1],
    [Math.floor((x0+x1)/2),z0],[Math.floor((x0+x1)/2),z1]];
  for(const [x,z] of points)for(let y=2;y<topOf(roof,x,z);y++)write('roof-pier-'+n,x,y,z,roof.post);
 }
 for(const [name,cube,ref] of p.cargo)volume(name,cube,ref);
 for(const [x,y,z,label] of p.details)write('distinct-architectural-'+label,x,y,z,'pack1:010');
 for(const b of reserved)for(let x=b.x;x<b.x+b.width;x++)for(let y=b.y;y<b.y+b.height;y++)for(let z=b.z;z<b.z+b.depth;z++)
  if(cells.has(key(x,y,z)))throw Error(id+' blocked concrete two-wide aisle '+[x,y,z]);
 const nav={entry:'entry',nodes:[N('entry',aisle,d-1),N('center',aisle,midZ),N('west',westX,westZ),N('east',eastX,eastZ)],
   edges:[E('entry','center'),E('center','west'),E('center','east')]};
 const result={id,type:p.type,biome:p.biome,size:p.size,variant:2,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,h,d),modules:[...roles].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances:reserved,openings:[{id:'two-wide-south-loading-door',facing:'south',x:aisle,y:2,z:d-1,width:2,height:3}],
  navigation:nav,
  spaces:[
    room('west-storage',p.west,B(1,2,1,aisle,6,d-2),'west'),
    room('open-cart-court',p.yard,B(aisle,2,1,2,6,d-1),'center'),
    room('east-industry',p.east,B(aisle+2,2,1,w-aisle-2,6,d-2),'east')
  ],
  features:[
    item('source-west-process-zone',westX,2,westZ,p.cargo[0][2]),
    item('source-east-warehouse',eastX,2,eastZ,p.cargo[1][2]),
    item('uneven-loading-zone',aisle,2,d-4,p.floor),
    item('stone-roof-bearing',p.details[0][0],p.details[0][1],p.details[0][2],'pack1:010'),
    item('unbuilt-working-machinery',w-2,3,d-4,null,p.dependency)
  ],
  architecture:{kind:p.title,footprintShape:'nonrectangular original mask of joined individual work bays',
    footprintCells:shape.size,openAirFreightCourt:true,roofProfiles:p.roofs.map(q=>q.shape),
    originalRoofRuns:p.roofs.map(q=>q.r),occupiedCoordinates:cells.size,
    creatorApproved:false,worldPlaced:false,perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,...p.roofs.map(q=>q.cover),...p.cargo.map(q=>q[2]),p.dependency,
    'Manual family numeric variant / yaw / multi-voxel physical support and collision unresolved'],
  implementation:'3B_THEORETICAL_VARIANT2_ONLY: no world placements, saves, biome registration, powered mills or harvesting'};
 validateBlueprint(result,ASSET_CATALOG);
 return result;
}
const bySlot=new Map(plans.map(p=>[p.type+':'+p.biome+':'+p.size,p]));
export function createVariant2IndustryBlueprint(type,biome,size,variant=2){
 if(variant!==2)throw new RangeError('Only specifically authored variant 2 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-2 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant2IndustryPool(){return plans.map(create);}
