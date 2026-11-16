// Builder 3B exclusive M2: eight further individually source-authored industry variant-2 layouts.
// Each design below is its own concrete irregular lot, piers, roof topology, work areas,
// finished ground route and source-cell manifest; future machinery/physical variants unresolved.
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
{
 type:'lumberyard',biome:'temperate',size:'medium',w:37,d:35,h:30,
 aisle:17,westX:11,westZ:16,eastX:28,eastZ:26,midZ:13,
 title:'riverbend boatwright timber depot with western long gable, two separated asymmetric dock cranes and sheltered unloading arcade',
 yard:'riverbend twin-dock turntable',west:'long riverboat timber loft',east:'cross-channel exported beam arcade',
 mask:[[15,21,0,34],[2,15,5,22],[23,34,3,16],[24,34,24,33],[10,30,31,34]],
 roofs:[{name:'boatwright-deep-gable',r:[3,13,6,20],top:15,shape:'gable',cover:'pack3:023',post:'pack2:022'},
  {name:'north-wharf-terrace',r:[24,33,4,15],top:12,shape:'terrace',cover:'pack3:025',post:'pack1:010'},
  {name:'sloping-dry-freight',r:[25,33,25,32],top:11,shape:'slope',cover:'pack3:023',post:'pack2:022'}],
 cargo:[['keel-lumber-racks',[5,10,2,4,8,11],'builtin:wood'],['port-authority-crates',[26,31,2,3,6,9],'pack4:057'],['river-cargo-pad',[26,32,2,2,28,30],'pack1:007']],
 details:[[4,2,7,'timber-drying-bay'],[32,2,30,'quay-head-bollard']],
 floor:'pack2:013',wall:'pack2:015',roofWallHeight:7,
 dependency:'No boats, navigable river, working cranes or harvestable logs; orientation and physical family multi-voxel fit pending'
},{
 type:'lumberyard',biome:'desert',size:'small',w:27,d:26,h:26,
 aisle:12,westX:8,westZ:12,eastX:21,eastZ:20,midZ:10,
 title:'small adobe sun-log kiln with open U-court reed portico and independent caravan camel-feed vault',
 yard:'reed-shaded caravan log-airdry court',west:'sandstone board-rack alcove',east:'camel-cart export annex',
 mask:[[10,16,0,25],[1,10,3,15],[19,25,8,21],[7,22,22,25]],
 roofs:[{name:'earth-arched-log-alcove',r:[2,9,4,14],top:13,shape:'flat',cover:'pack1:007',post:'pack1:010'},
  {name:'reed-timber-eave',r:[20,24,9,20],top:11,shape:'saw',cover:'pack3:025',post:'pack1:010'}],
 cargo:[['sun-bleached-plank-bundles',[3,6,2,3,5,8],'builtin:wood'],['caravan-woven-crates',[21,23,2,4,11,14],'pack4:057'],['sandstone-loading-ramp',[18,22,2,2,23,24],'pack1:007']],
 details:[[3,2,12,'sunshade-column'],[24,2,18,'camel-bollard']],
 floor:'pack1:007',wall:'pack1:002',roofWallHeight:6,
 dependency:'biome130:006 building materials still lack approved per-cell shape/rotation; camel carts and timber drying are nonfunctional'
},{
 type:'lumberyard',biome:'enchanted-forest',size:'medium',w:39,d:37,h:35,
 aisle:18,westX:12,westZ:17,eastX:29,eastZ:28,midZ:12,
 title:'bioluminescent grove saw-court with unequal trellis tunnel and twin detached root-preservation sheds',
 yard:'moon-root timber sorting spine',west:'luminous arboreal timber vault',east:'twin mycelium board depositories',
 mask:[[16,23,0,36],[2,16,3,25],[26,36,5,17],[27,36,25,34],[10,32,32,36]],
 roofs:[{name:'livingwood-long-vault',r:[3,14,4,22],top:16,shape:'cross',cover:'pack3:023',post:'pack2:022'},
  {name:'north-trellis',r:[27,35,6,15],top:13,shape:'saw',cover:'pack3:023',post:'pack2:022'},
  {name:'southern-sporewood-mews',r:[28,35,26,33],top:15,shape:'gable',cover:'pack3:025',post:'pack1:010'}],
 cargo:[['wood-hearts-in-crates',[5,10,2,4,7,11],'pack4:057'],['small-luminous-logs',[29,33,2,3,7,10],'builtin:wood'],['mycelium-drying-plinth',[29,34,2,2,28,31],'pack2:013']],
 details:[[4,2,18,'grove-support-column'],[34,2,31,'moonshade-fastener']],
 floor:'pack2:013',wall:'pack2:015',roofWallHeight:5,
 dependency:'biome130:096 livingwood rib unregistered; no growth simulation, magic saw, harvestable trees or approved structural mounting'
},{
 type:'lumberyard',biome:'mountain',size:'large',w:49,d:44,h:38,
 aisle:24,westX:16,westZ:20,eastX:38,eastZ:36,midZ:17,
 title:'split moraine-terrace log port with high retaining wall, three tier cliff-shelf sheds and load-bearing stone switching deck',
 yard:'freight cliff-switching groove',west:'granite-protected export larder',east:'three-tier cliffside log platforms',
 mask:[[20,28,0,43],[2,20,4,31],[31,46,5,19],[33,46,29,41],[12,38,39,43]],
 roofs:[{name:'retaining-deep-gallery',r:[3,17,5,28],top:19,shape:'terrace',cover:'pack3:025',post:'pack1:010'},
  {name:'high-cliff-rail-cover',r:[32,45,6,18],top:15,shape:'slope',cover:'pack3:025',post:'pack1:010'},
  {name:'low-log-crane-shed',r:[34,45,31,39],top:13,shape:'saw',cover:'pack3:025',post:'pack1:010'}],
 cargo:[['covered-ironwood-racks',[4,12,2,4,8,12],'builtin:wood'],['stone-quarry-export-crates',[34,42,2,3,8,12],'pack4:057'],['ridge-transfer-pad',[35,42,2,2,34,37],'pack1:007']],
 details:[[4,2,20,'quarry-cliff-anchor'],[44,2,34,'stone-rail-buttress']],
 floor:'pack1:007',wall:'pack1:002',roofWallHeight:10,
 dependency:'biome130:098 mountain cliff anchors unregistered; crane mechanics, cliff-terrain attachment and load proof not implemented'
},{
 type:'mill',biome:'temperate',size:'small',w:31,d:29,h:29,
 aisle:14,westX:9,westZ:13,eastX:24,eastZ:23,midZ:11,
 title:'separated one-stone seasonal watergrain mill with low river sluice lane and sloped wheelhouse cart annex',
 yard:'sluice-fed stone courtyard',west:'compact dry-grain vault',east:'separate river-side headrace cellar',
 mask:[[12,18,0,28],[2,12,4,15],[21,28,9,25],[7,24,25,28]],
 roofs:[{name:'grain-archive-gable',r:[3,11,5,14],top:14,shape:'gable',cover:'pack3:023',post:'pack2:022'},
  {name:'wheel-cistern-lean',r:[22,27,10,24],top:12,shape:'slope',cover:'pack3:025',post:'pack1:010'}],
 cargo:[['millstones-and-bins',[4,8,2,4,6,9],'pack4:057'],['headrace-stone-coupler',[23,26,2,3,12,15],'pack1:010'],['dry-flour-packing-floor',[21,25,2,2,25,26],'pack1:007']],
 details:[[3,2,12,'grindstone-side-pier'],[27,2,20,'sluice-conduit-stand']],
 floor:'pack2:013',wall:'pack2:015',roofWallHeight:8,
 dependency:'No actual water current, grain processing or wheel rotation; no physical multi-cell family collision approved'
},{
 type:'mill',biome:'snow',size:'medium',w:40,d:38,h:34,
 aisle:19,westX:12,westZ:16,eastX:31,eastZ:29,midZ:15,
 title:'triple-vault glacial grain mill with snowbank baffle, central thermal millstone route and frost shaft tower',
 yard:'protected icegrain milling spine',west:'heated-by-concept grain stores',east:'enclosed frost-wind drive and cold-safe quern',
 mask:[[16,24,0,37],[2,16,4,25],[27,37,2,15],[28,37,23,35],[10,31,34,37]],
 roofs:[{name:'snow-granary-crosscover',r:[3,14,5,23],top:17,shape:'cross',cover:'pack3:025',post:'pack1:010'},
  {name:'frostshaft-high-gable',r:[28,36,3,14],top:16,shape:'gable',cover:'pack3:025',post:'pack2:022'},
  {name:'thermal-millstone-terrace',r:[29,36,24,34],top:14,shape:'terrace',cover:'pack3:025',post:'pack1:010'}],
 cargo:[['winter-grain-storage',[4,11,2,4,7,10],'pack4:057'],['insulated-axle-stone',[30,34,2,5,5,9],'pack1:010'],['snow-grinding-dais',[30,34,2,2,26,29],'pack1:007']],
 details:[[3,2,12,'snowbaffle-outcrop'],[35,2,29,'frost-bearing-clamp']],
 floor:'pack1:007',wall:'pack1:002',roofWallHeight:9,
 dependency:'biome130:094 insulated cores unregistered; thermal simulations and active grinding/water flow not installed'
},{
 type:'mill',biome:'enchanted-forest',size:'large',w:52,d:47,h:43,
 aisle:24,westX:17,westZ:20,eastX:40,eastZ:36,midZ:22,
 title:'moonwater mill amphitheater with deep grain nave, raised rune channel workhouse and distinct low axle cloister',
 yard:'moonwater central transfer meadow',west:'towering mythgrain mill nave',east:'independent axis and rune-drive cloisters',
 mask:[[20,29,0,46],[3,20,3,32],[33,49,5,22],[34,49,31,43],[12,41,42,46]],
 roofs:[{name:'deep-luminous-granary',r:[4,18,4,29],top:19,shape:'gable',cover:'pack3:023',post:'pack2:022'},
  {name:'north-rune-gallery',r:[34,48,6,21],top:21,shape:'cross',cover:'pack3:025',post:'pack1:010'},
  {name:'southern-moonstone-cistern',r:[35,48,32,42],top:16,shape:'saw',cover:'pack3:023',post:'pack2:022'}],
 cargo:[['moonseed-grain-lockers',[6,14,2,4,7,13],'pack4:057'],['upper-rune-bearings',[36,43,2,5,8,14],'pack1:010'],['lit-stone-grind-dais',[36,42,2,2,35,40],'pack1:007']],
 details:[[5,2,21,'mystic-woodstone-crossrib'],[46,2,39,'runic-wheel-base']],
 floor:'pack2:013',wall:'pack2:015',roofWallHeight:10,
 dependency:'biome130:096 unregistered livingwood cores; lunar mills, water current and rune power are future-only'
},{
 type:'mill',biome:'mountain',size:'large',w:54,d:47,h:44,
 aisle:25,westX:16,westZ:18,eastX:42,eastZ:37,midZ:19,
 title:'great cliff-headwater grain foundry with deep left milling nave and two individually covered isolated turbine chambers',
 yard:'triple-terrain mountain switchback',west:'terraced highland grain abbey',east:'double high-headrace machinery rooms',
 mask:[[22,30,0,46],[3,22,6,28],[35,51,3,19],[35,51,30,44],[12,45,42,46]],
 roofs:[{name:'mountain-grain-cloister',r:[4,20,7,25],top:21,shape:'terrace',cover:'pack3:025',post:'pack1:010'},
  {name:'high-headrace-stone-roof',r:[36,50,4,18],top:19,shape:'slope',cover:'pack3:025',post:'pack1:010'},
  {name:'lower-cascade-mill-vault',r:[36,50,31,43],top:18,shape:'gable',cover:'pack3:025',post:'pack1:010'}],
 cargo:[['highland-grain-vaults',[6,13,2,5,9,14],'pack4:057'],['stoneheadrace-axle-base',[38,45,2,5,7,11],'pack1:010'],['south-quern-stonework',[38,45,2,3,34,38],'pack1:007']],
 details:[[4,2,13,'cliff-face-anchor'],[48,2,37,'highland-grinder-stanchion']],
 floor:'pack1:007',wall:'pack1:002',roofWallHeight:12,
 dependency:'biome130:098 mountain anchoring not registered; physical cliff support, headrace and wheel rotation not available'
}
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
 for(const [name,cube,ref] of p.partitions ?? [])volume('interior-'+name,cube,ref);
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
export function createVariant2ExpansionBlueprint(type,biome,size,variant=2){
 if(variant!==2)throw new RangeError('Only specifically authored variant 2 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-2 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant2ExpansionPool(){return plans.map(create);}
