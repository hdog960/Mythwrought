// Builder 3B M2: eight distinct coordinate-authored hinterland production buildings.
// Dry-run design pool only. Never writes the world, save schema, block IDs or gameplay.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const box=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const node=(id,x,z)=>({id,x,y:2,z,width:2,headroom:3});
const edge=(from,to)=>({from,to,kind:'level'});
const space=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const feature=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});

// Each program below defines *actual rectangles, roof cross-sections, load
// bearing columns, wall splits and freight zones*, not recolors or seeds.
// Rectangular coordinate runs expand into every occupied physical voxel.
const programs=[
 {t:'lumberyard',b:'desert',s:'large',w:46,d:41,h:28,a:22,l:17,lz:18,r:29,rz:29,cz:13,
  kind:'karez-quadrangle-with-separated-sun-vault-and-saw-roof',
  west:'shaded-timber-galleries',center:'open-karez-goods-court',east:'sun-drying-load-port',
  floor:'pack1:007',wall:'pack1:002',wallTop:6,
  roofs:[
   {bounds:[3,16,3,18],y:13,shape:'flat',ref:'pack1:007',post:'pack1:010'},
   {bounds:[31,42,4,21],y:15,shape:'saw',ref:'pack3:025',post:'pack1:010'}],
  partitions:[{x:2,z0:3,z1:16,top:7,ref:'pack1:002'}],
  cargo:[{role:'sawn-westwood',v:[5,12,2,4,7,9],ref:'builtin:wood'},
   {role:'karez-crates',v:[33,39,2,4,8,12],ref:'pack4:057'},
   {role:'sun-sandstone-pad',v:[30,39,2,2,31,34],ref:'pack1:007'}],
  deps:['biome130:006 registered desert material diagnostic only','Karez water/transport behavior not implemented']},
 {t:'lumberyard',b:'snow',s:'large',w:44,d:39,h:30,a:21,l:15,lz:19,r:29,rz:26,cz:14,
  kind:'avalanche-baffled-double-winter-log-vault-and-sled-court',
  west:'enclosed-winter-timber-store',center:'open-snow-sled-lane',east:'snow-protected-outbound-freight',
  floor:'pack2:013',wall:'pack1:002',wallTop:7,
  roofs:[
   {bounds:[4,17,3,23],y:15,shape:'gable',ref:'pack3:025',post:'pack2:022'},
   {bounds:[27,40,4,22],y:13,shape:'terrace',ref:'pack3:025',post:'pack1:010'}],
  partitions:[{x:2,z0:2,z1:22,top:8,ref:'pack1:010'}],
  cargo:[{role:'deep-log-snow-racks',v:[6,14,2,4,6,10],ref:'builtin:wood'},
   {role:'sled-station',v:[32,38,2,2,10,13],ref:'pack4:057'},
   {role:'winter-granite-pad',v:[30,39,2,2,30,34],ref:'pack1:007'}],
  deps:['biome130:094 unregistered insulated wall cores symbolic only','Avalanche and functioning sled not implemented']},
 {t:'lumberyard',b:'enchanted-forest',s:'small',w:26,d:25,h:21,a:12,l:8,lz:15,r:19,rz:18,cz:10,
  kind:'small-separate-trellis-and-grove-drying-arbor',
  west:'livingwood-rack-grove',center:'forest-cart-ring',east:'sporewood-sapling-depot',
  floor:'pack2:013',wall:'pack2:015',wallTop:3,
  roofs:[
   {bounds:[2,9,3,14],y:10,shape:'cross',ref:'pack3:023',post:'pack2:022'},
   {bounds:[18,23,4,13],y:9,shape:'shed',ref:'pack3:023',post:'pack2:022'}],
  partitions:[{z:2,x0:3,x1:8,top:7,ref:'pack2:015'}],
  cargo:[{role:'fae-grain-crates',v:[4,6,2,3,6,8],ref:'pack4:057'},
   {role:'micro-lumber-pile',v:[19,22,2,3,5,7],ref:'builtin:wood'},
   {role:'sapling-export-pad',v:[20,23,2,2,20,21],ref:'pack2:013'}],
  deps:['biome130:096 unregistered livingwood ribs symbolic only','Growing foliage is nonfunctional']},
 {t:'lumberyard',b:'mountain',s:'medium',w:36,d:34,h:27,a:17,l:12,lz:17,r:24,rz:26,cz:12,
  kind:'retaining-cliff-saw-gallery-with-dual-level-haul-deck',
  west:'quarry-backed-beam-corridor',center:'granite-switchback-aisle',east:'cliffside-export-ramp',
  floor:'pack1:007',wall:'pack1:002',wallTop:6,
  roofs:[
   {bounds:[3,14,3,24],y:14,shape:'terrace',ref:'pack3:025',post:'pack1:010'},
   {bounds:[25,32,6,21],y:12,shape:'shed',ref:'pack3:025',post:'pack1:010'}],
  partitions:[{x:2,z0:2,z1:23,top:9,ref:'pack1:002'}],
  cargo:[{role:'cliff-lumber-stack',v:[5,10,2,4,5,8],ref:'builtin:wood'},
   {role:'granite-export-crates',v:[27,31,2,3,8,11],ref:'pack4:057'},
   {role:'granite-haul-pad',v:[26,32,2,2,29,31],ref:'pack1:007'}],
  deps:['biome130:098 unregistered mountain cliff-anchor symbolic only','No working lifting cranes or sledge']},
 {t:'mill',b:'desert',s:'large',w:48,d:42,h:32,a:23,l:17,lz:12,r:33,rz:30,cz:19,
  kind:'wide-windmill-house-with-karez-granary-transept-and-drive-room',
  west:'flour-grain-vault',center:'milling-stone-processing-hall',east:'isolated-wind-rotor-drive',
  floor:'pack1:007',wall:'pack1:002',wallTop:11,
  roofs:[{bounds:[0,47,0,41],y:12,shape:'gable',ref:'pack1:007',post:'pack1:010'}],
  partitions:[
   {z:14,x0:1,x1:46,top:8,ref:'pack1:002'},
   {x:35,z0:15,z1:40,top:8,ref:'pack1:002'}],
  cargo:[{role:'flour-grain-bins',v:[5,14,2,4,4,8],ref:'pack4:057'},
   {role:'flourstone-dais',v:[7,13,2,2,23,25],ref:'pack1:007'},
   {role:'wind-shaft-bearing',v:[39,42,2,5,17,21],ref:'pack1:010'}],
  deps:['biome130:006 registered source geometry diagnostic only','Wind rotor and processing not functional']},
 {t:'mill',b:'snow',s:'large',w:46,d:43,h:33,a:22,l:16,lz:11,r:31,rz:31,cz:20,
  kind:'large-insulated-snow-mill-with-separated-thermal-silo',
  west:'winter-grain-silo',center:'stone-grinding-hall',east:'frostproof-wheelhouse',
  floor:'pack2:013',wall:'pack1:002',wallTop:12,
  roofs:[{bounds:[0,45,0,42],y:13,shape:'cross',ref:'pack3:025',post:'pack1:010'}],
  partitions:[
   {z:15,x0:1,x1:44,top:8,ref:'pack1:002'},
   {x:34,z0:16,z1:41,top:7,ref:'pack2:015'}],
  cargo:[{role:'heatless-grain-vault',v:[5,14,2,4,5,9],ref:'pack4:057'},
   {role:'snow-flourstone',v:[9,15,2,2,24,27],ref:'pack1:007'},
   {role:'shielded-ice-bearing',v:[38,41,2,5,22,25],ref:'pack1:010'}],
  deps:['biome130:094 insulated wall family unregistered and symbolic only','Active heating/frozen-water behavior not implemented']},
 {t:'mill',b:'enchanted-forest',s:'small',w:28,d:27,h:25,a:13,l:9,lz:9,r:20,rz:19,cz:13,
  kind:'two-narrow-dissimilar-treetop-roof-halls-of-moonwater-mill',
  west:'enchanted-grain-hall',center:'moon-grind-stone-passage',east:'stream-shaft-bay',
  floor:'pack2:013',wall:'pack2:015',wallTop:9,
  roofs:[
   {bounds:[0,12,0,26],y:10,shape:'gable',ref:'pack3:023',post:'pack2:022'},
   {bounds:[15,27,0,26],y:10,shape:'shed',ref:'pack3:025',post:'pack1:010'}],
  partitions:[{z:10,x0:1,x1:26,top:6,ref:'pack2:015'}],
  cargo:[{role:'fae-grain-bins',v:[3,7,2,3,3,6],ref:'pack4:057'},
   {role:'moon-grind-plinth',v:[4,6,2,2,16,18],ref:'pack1:007'},
   {role:'wood-stream-bearing',v:[23,25,2,4,14,16],ref:'pack1:010'}],
  deps:['biome130:096 unregistered magic livingwood symbolic only','Stream rotation/moonwater generation not functional']},
 {t:'mill',b:'mountain',s:'medium',w:38,d:36,h:30,a:18,l:12,lz:12,r:28,rz:26,cz:17,
  kind:'cliffside-terraced-rock-granary-and-ledge-mill',
  west:'granite-grain-chamber',center:'tiered-grind-floor',east:'rock-water-drive-vault',
  floor:'pack1:007',wall:'pack1:002',wallTop:11,
  roofs:[{bounds:[0,37,0,35],y:14,shape:'terrace',ref:'pack3:025',post:'pack1:010'}],
  partitions:[
   {z:13,x0:1,x1:36,top:7,ref:'pack1:002'},
   {x:31,z0:14,z1:34,top:7,ref:'pack1:002'}],
  cargo:[{role:'mountain-grain-chamber',v:[4,10,2,3,4,7],ref:'pack4:057'},
   {role:'granite-mill-dais',v:[5,9,2,2,19,22],ref:'pack1:007'},
   {role:'cliffshaft-bearing',v:[33,35,2,5,18,21],ref:'pack1:010'}],
  deps:['biome130:098 unregistered mountain cliff anchor symbolic only','Gravitation/load and water drive need future verification']}
];

function author(p){
 const {t,b,s,w,d,h,a,l,lz,r,rz,cz}=p,id=assertSlot(t,b,s,1);
 const occupied=new Set(),roles=new Map(),key=(x,y,z)=>x+','+y+','+z;
 const corridors=[box(a,2,0,2,3,d),box(l,2,lz,a-l+2,3,2),box(a,2,rz,r-a+2,3,2)];
 const isReserved=(x,y,z)=>corridors.some(c=>x>=c.x&&x<c.x+c.width&&y>=c.y&&y<c.y+c.height&&z>=c.z&&z<c.z+c.depth);
 function add(role,x,y,z,ref,{skip=false}={}){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||z<0||z>=d||y<0||y>=h)throw Error(id+' authored coordinate outside bounds '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unregistered material '+ref);
  const k=key(x,y,z);
  if(occupied.has(k)||isReserved(x,y,z)){if(skip)return false;throw Error(id+' occupied/route overlap '+[x,y,z]);}
  occupied.add(k);if(!roles.has(role))roles.set(role,[]);roles.get(role).push([x,y,z,ref]);return true;
 }
 const safe=(...args)=>add(...args,{skip:true});
 const solid=(role,[x0,x1,y0,y1,z0,z1],ref)=>{
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)safe(role,x,y,z,ref);
 };
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  add('foundation',x,0,z,'builtin:stone');
  add('floor',x,1,z,p.floor);
 }
 for(let y=2;y<=p.wallTop;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++)
  if(x===0||x===w-1||z===0||z===d-1)safe('wall',x,y,z,p.wall);
 for(const part of p.partitions){
  if(part.x!==undefined)for(let z=part.z0;z<=part.z1;z++)for(let y=2;y<=part.top;y++)safe('inner-partition',part.x,y,z,part.ref);
  if(part.z!==undefined)for(let x=part.x0;x<=part.x1;x++)for(let y=2;y<=part.top;y++)safe('inner-partition',x,y,part.z,part.ref);
 }
 for(const [i,roof] of p.roofs.entries()){
  const [x0,x1,z0,z1]=roof.bounds;
  function ry(x,z){
   const dx=x-x0,span=x1-x0;
   if(roof.shape==='gable')return roof.y+Math.floor(Math.min(dx,span-dx)/3);
   if(roof.shape==='terrace')return roof.y+(x<=Math.floor((x0+x1)/2)?2:0);
   if(roof.shape==='shed')return roof.y+Math.floor(dx/4);
   if(roof.shape==='saw')return roof.y+(Math.floor(dx/4)%2);
   if(roof.shape==='cross')return roof.y+Math.floor(Math.min(z-z0,z1-z)/5);
   return roof.y;
  }
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)safe('roof',x,ry(x,z),z,roof.ref);
  // Physically contiguous stair-step seams on both axes, never floating over void.
  for(let x=x0+1;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const v=ry(x-1,z),n=ry(x,z);
   if(v!==n)for(let y=Math.min(v,n);y<Math.max(v,n);y++)safe('roof-x-joint',v<n?x:x-1,y,z,'pack2:015');
  }
  for(let z=z0+1;z<=z1;z++)for(let x=x0;x<=x1;x++){
   const v=ry(x,z-1),n=ry(x,z);
   if(v!==n)for(let y=Math.min(v,n);y<Math.max(v,n);y++)safe('roof-z-joint',x,y,v<n?z:z-1,'pack2:015');
  }
  // Load-bearing corner columns meet each roof surface directly.
  const corners=[[x0,z0],[x1,z0],[x0,z1],[x1,z1]];
  for(const [x,z] of corners)for(let y=2;y<ry(x,z);y++)safe('roof-pier-'+i,x,y,z,roof.post);
 }
 for(const cargo of p.cargo)solid(cargo.role,cargo.v,cargo.ref);
 const clearanceChecks=()=>{for(const c of corridors)for(let x=c.x;x<c.x+c.width;x++)
  for(let y=c.y;y<c.y+c.height;y++)for(let z=c.z;z<c.z+c.depth;z++)
   if(occupied.has(key(x,y,z)))throw Error(id+' conceptual aisle blocked at '+[x,y,z]);};
 clearanceChecks();
 const rooms=[
  space('western-worksite',p.west,box(1,2,1,a,6,d-3),'west'),
  space('covered-and-open-main-court',p.center,box(a,2,2,2,6,d-2),'spine'),
  space('eastern-freight-worksite',p.east,box(a+2,2,1,w-a-3,6,d-3),'east')];
 const features=[
  feature('west-material-warehouse',l,2,lz-3,'pack2:013'),
  feature('central-cart-transit',a,2,cz,'pack1:007'),
  feature('east-loading-station',r,2,rz-3,'pack4:057'),
  feature('structural-support-station',2,3,3,'pack1:010'),
  feature('unimplemented-processing-mechanism',w-2,3,d-3,null,'Saws, mills, pulleys, NPCs and processing logic do not exist')];
 const result={id,type:t,biome:b,size:s,variant:1,status:'theoretical',activated:false,
  envelope:box(0,0,0,w,h,d),modules:[...roles].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances:corridors,openings:[{id:'south-two-wide-material-gate',facing:'south',x:a,y:2,z:d-1,width:2,height:3}],
  spaces:rooms,navigation:{entry:'entry',nodes:[node('entry',a,d-1),node('spine',a,cz),node('west',l,lz),node('east',r,rz)],edges:[edge('entry','spine'),edge('spine','west'),edge('spine','east')]},features,
  architecture:{kind:p.kind,roofStyles:p.roofs.map(q=>q.shape),occupiedCoordinates:occupied.size,
   distinctSourceCoordinates:true,perCellPhysicalVariantsSelected:false,worldPlaced:false},
  dependencies:[...p.deps,'Physical shape fit, yaw, per-cell support and occupied multi-cell AABBs remain unverified'],
  implementation:'THEORETICAL_3B_ONLY; no actual world placement, crafting, rotor, engine or save modifications'};
 validateBlueprint(result,ASSET_CATALOG);
 return result;
}
const byId=new Map(programs.map(p=>[p.t+':'+p.b+':'+p.s,p]));
export function createHinterlandBlueprint(type,biome,size,variant=1){
 if(variant!==1)throw new RangeError('Hinterland only has authored version 1');
 const p=byId.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten 3B hinterland slot '+[type,biome,size].join(':'));
 return author(p);
}
export function createHinterlandPool(){return programs.map(author);}
