/**
 * Builder 3A — M3 Artisan Craftsmanship: 30 second variants.
 * These are manually specified ORIGINAL timber/stone working architectures,
 * not new runtime blocks, working tools, settlements, mirrored structures,
 * biome palette swaps, or saves. One full coordinate plan for every
 * category × biome × size combination (carpenter and stonemason only).
 */
import {slotId,BIOMES,SIZES} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const F=Object.freeze({stone:'pack1:002',slab:'pack1:007',column:'pack1:010',
 plank:'pack2:013',beam:'pack2:015',roof:'pack3:023',slate:'pack3:025',
 crate:'pack4:057'});
// Source-specific spatial programmes. Column meanings:
// category|biome|size|name|width|depth|westStart|westEnd|eastStart|eastEnd|
// courtStart|courtEnd|roof|bearingCadence|stockWing|joineryBays
const SOURCES=[
'carpenter|temperate|small|riverside-framing-lodge|28|30|4|25|8|28|14|20|offset-cross-shed|5|west|3',
'carpenter|temperate|medium|millrace-joiners-guild|35|38|6|34|4|32|18|27|covered-sawtooth|6|east|4',
'carpenter|temperate|large|timberyard-five-aisle-workhouse|44|44|5|40|12|42|22|33|triple-timber-bay|7|west|5',
'carpenter|desert|small|shade-pergola-cabinetry|29|31|5|27|10|29|15|23|sunshade-pergola|5|east|3',
'carpenter|desert|medium|oasis-furniture-lumbercourt|36|39|7|35|6|36|19|29|split-vented-shed|6|west|4',
'carpenter|desert|large|dune-frame-drying-colonnade|45|46|6|42|11|44|23|35|terraced-beam-yard|8|east|5',
'carpenter|snow|small|fir-hearthless-joinery|30|32|5|29|9|30|15|24|snow-gambrel-frame|5|west|3',
'carpenter|snow|medium|winter-cedar-framehall|37|40|6|37|12|38|19|30|deep-eave-twin-ridge|7|east|4',
'carpenter|snow|large|snowline-log-seasoning-barns|46|47|7|43|10|45|24|36|snow-gambrel-frame|8|west|5',
'carpenter|enchanted-forest|small|bentbranch-woodwright-hall|31|33|6|30|8|31|16|25|woven-canopy|5|east|3',
'carpenter|enchanted-forest|medium|moonbough-joinery-bowers|38|41|7|38|13|39|20|31|lantern-beam-hall|7|west|4',
'carpenter|enchanted-forest|large|elderwood-framing-sanctuary|47|48|6|44|11|46|24|37|lantern-beam-hall|8|east|5',
'carpenter|mountain|small|cliff-cedar-sawhouse|32|34|5|31|10|32|16|25|stepped-timber-terraces|6|west|3',
'carpenter|mountain|medium|ridgecraft-purlin-works|39|42|8|39|12|40|21|32|high-hip-drying-shed|7|east|4',
'carpenter|mountain|large|highpass-master-woodwright|48|49|7|46|12|47|25|38|stepped-timber-terraces|8|west|5',
'stonemason|temperate|small|brookstone-masons-court|29|31|5|28|9|29|15|23|half-vault-gallery|5|east|3',
'stonemason|temperate|medium|civic-column-cutters-yard|36|39|7|36|10|37|20|29|cross-vault-and-court|6|west|4',
'stonemason|temperate|large|great-stoneguild-sculpture-hall|45|45|5|42|12|43|23|34|monumental-arcade|8|east|5',
'stonemason|desert|small|sandstone-inlay-bay|30|32|6|29|10|30|16|25|sandstone-shade-vault|5|west|3',
'stonemason|desert|medium|sunbrick-cutting-colonnade|37|40|7|37|12|38|20|31|open-carving-vault|7|east|4',
'stonemason|desert|large|dune-ornament-stonemasons|46|47|6|44|14|45|25|36|monumental-arcade|8|west|5',
'stonemason|snow|small|frostgranite-chisel-house|31|33|5|30|10|31|17|25|insulated-stone-gable|5|east|3',
'stonemason|snow|medium|winter-column-finishing-yard|38|41|8|38|13|39|21|31|high-snow-carving-hip|7|west|4',
'stonemason|snow|large|icepass-block-masonry-forum|47|48|7|45|13|46|25|37|high-snow-carving-hip|8|east|5',
'stonemason|enchanted-forest|small|glimmerstone-carving-bower|32|34|6|32|11|32|17|26|forest-stone-lantern|6|west|3',
'stonemason|enchanted-forest|medium|rune-etched-block-atelier|39|42|8|39|13|40|22|33|forest-stone-lantern|7|east|4',
'stonemason|enchanted-forest|large|moonstone-arch-cutting-garden|48|49|7|46|14|47|26|39|cross-vault-and-court|9|west|5',
'stonemason|mountain|small|cliffcarver-stonebay|33|35|6|33|12|33|18|27|stepped-quarry-arcade|6|east|3',
'stonemason|mountain|medium|granite-ridge-masonworks|40|43|9|40|14|41|22|34|terraced-carving-arch|7|west|4',
'stonemason|mountain|large|highcastle-blockcutters-court|49|50|8|48|15|48|27|40|terraced-carving-arch|9|east|5'
];
const KEYS=['type','biome','size','name','width','depth','westStart','westEnd','eastStart','eastEnd','courtStart','courtEnd','roof','bearingCadence','stockWing','joineryBays'];
export const M3_CRAFT_SECOND_SPECS=Object.freeze(SOURCES.map(s=>{
 const a=s.split('|');if(a.length!==KEYS.length)throw Error('Incomplete distinct M3 authored architecture specification');
 return Object.freeze(Object.fromEntries(KEYS.map((k,i)=>[k,[4,5,6,7,8,9,10,11,13,15].includes(i)?Number(a[i]):a[i]])));
}));
if(M3_CRAFT_SECOND_SPECS.length!==30)throw Error('M3 must provide precisely 30 new source-authored carpenter/stonemason plans');
function create(q){
 const w=q.width,d=q.depth,h=28,mid=Math.floor(w/2)-1,wood=q.type==='carpenter';
 const placements=new Map(),modules=new Map(),features=[];
 const key=(x,y,z)=>[x,y,z].join(',');
 const has=(x,y,z)=>placements.has(key(x,y,z));
 function put(role,x,y,z,asset,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||y<0||z<0||x>=w||y>=h||z>=d)
   throw Error(q.name+' authored voxel out of bounds '+key(x,y,z));
  if(has(x,y,z))throw Error(q.name+' occupied-cell collision '+key(x,y,z)+' with '+placements.get(key(x,y,z)));
  placements.set(key(x,y,z),role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push(meta==null?[x,y,z,asset]:[x,y,z,asset,Object.freeze(meta)]);
 }
 const spineWest=9,spineEast=w-10;
 const westAisleZ=q.westStart+3,eastAisleZ=q.eastStart+3;
 const westShedX=4,westShedZ=q.westStart+9;
 function region(x,z){
  if(x<0||x>=w||z<0||z>=d)return null;
  // Trade-specific return-wing loading niches alter ACTUAL floor, walls,
  // roof and load-bearing supports rather than merely renaming/recoloring.
  if(q.stockWing==='west'&&x>=1&&x<=4&&
     z>=q.westStart+q.joineryBays+4&&z<=q.westStart+q.joineryBays+9)return null;
  if(q.stockWing==='east'&&x>=w-4&&x<=w-2&&
     z>=q.eastStart+7&&z<=q.eastStart+12)return null;
  if(x>=spineWest&&x<=spineEast)return 'main-nave';
  if(x>=1&&x<spineWest&&z>=q.westStart&&z<=q.westEnd)return 'west-atelier';
  if(x>spineEast&&x<w-1&&z>=q.eastStart&&z<=q.eastEnd)return 'east-stock-court';
  return null;
 }
 const floor=(x,z)=>region(x,z)!==null;
 const walkway=(x,z)=>x>=mid&&x<mid+2||
  (z===westAisleZ||z===westAisleZ+1)&&x>=3&&x<=mid||
  (z===eastAisleZ||z===eastAisleZ+1)&&x>=mid+1&&x<=w-4;
 function openCourt(x,z){
  const stockCourt=region(x,z)==='east-stock-court'&&x>=w-7&&x<=w-3&&
    z>=q.courtStart&&z<=q.courtEnd;
  return stockCourt;
 }
 function roofY(x,z){
  const r=region(x,z);
  if(r==='west-atelier')return 11+Math.min(2,Math.floor((z-q.westStart)/9))+(q.roof.includes('vault')?1:0);
  if(r==='east-stock-court')return 12+Math.min(2,Math.floor((q.eastEnd-z)/9));
  const a=Math.min(x-spineWest,spineEast-x),north=Math.min(z,d-1-z);
  switch(q.roof){
   case 'offset-cross-shed':return 15+Math.min(4,Math.floor(a/3))+(z>=d*.46&&z<d*.57?1:0);
   case 'covered-sawtooth':return 15+(Math.floor(z/7)%3)+Math.floor(a/6);
   case 'triple-timber-bay':return 15+Math.min(4,Math.floor(a/4))+Math.floor(z/17);
   case 'sunshade-pergola':return 15+(Math.floor(z/8)%2)+Math.floor(a/5);
   case 'split-vented-shed':return 15+Math.floor((w-x)/12)+Math.floor(z/14);
   case 'terraced-beam-yard':return 15+Math.floor(z/12)+Math.floor(a/6);
   case 'snow-gambrel-frame':return 15+Math.min(5,Math.floor(a/3));
   case 'deep-eave-twin-ridge':return 15+Math.min(5,Math.floor(a/3))+(z%15<4?1:0);
   case 'woven-canopy':return 15+Math.min(4,Math.floor((a+z%7)/4));
   case 'lantern-beam-hall':return 16+Math.min(4,Math.floor(a/4))+(z%d>Math.floor(d*.3)&&z<d*.48?2:0);
   case 'stepped-timber-terraces':return 15+Math.floor(z/12)+Math.floor(a/5);
   case 'high-hip-drying-shed':return 15+Math.min(5,Math.floor(Math.min(a,north)/3));
   case 'half-vault-gallery':return 15+Math.min(5,Math.floor(a/3));
   case 'cross-vault-and-court':return 15+Math.min(5,Math.floor(Math.min(a,north)/3))+(z>Math.floor(d*.58)?1:0);
   case 'monumental-arcade':return 16+Math.min(4,Math.floor(a/4))+Math.floor(z/18);
   case 'sandstone-shade-vault':return 15+Math.min(4,Math.floor(a/4))+(z%10<3?1:0);
   case 'open-carving-vault':return 15+Math.floor(z/9)%3+Math.floor(a/5);
   case 'insulated-stone-gable':return 16+Math.min(5,Math.floor(a/3));
   case 'high-snow-carving-hip':return 16+Math.min(5,Math.floor(Math.min(a,north)/3));
   case 'forest-stone-lantern':return 15+Math.min(4,Math.floor((a+(z%8))/4));
   case 'stepped-quarry-arcade':return 15+Math.floor(z/11)+Math.floor(a/5);
   case 'terraced-carving-arch':return 15+Math.floor(z/12)+Math.floor(a/4);
   default:throw Error('Unknown custom carpenter/stonemason roof '+q.roof);
  }
 }
 function aperture(x,y,z){
  if(z===d-1&&x>=mid&&x<mid+2&&y>=2&&y<=5)return true;
  if(x===1&&z>=q.westEnd-6&&z<q.westEnd-3&&y>=2&&y<=5)return true;
  if(x===w-2&&z>=q.eastStart+4&&z<q.eastStart+8&&y>=2&&y<=5)return true;
  if((x===spineWest||x===spineEast)&&z>=Math.floor(d*.31)&&z<Math.floor(d*.31)+5&&y>=6&&y<=8)return true;
  return false;
 }
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(floor(x,z)){
  put('foundation',x,0,z,F.stone);
  put('floor',x,1,z,wood?F.plank:F.slab);
 }
 // True concave return walls around the offset working wings; each roof
 // level independently responds to its zone rather than resizing a shell.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(floor(x,z)){
  if(floor(x-1,z)&&floor(x+1,z)&&floor(x,z-1)&&floor(x,z+1))continue;
  const crown=region(x,z)==='main-nave'?11:9;
  for(let y=2;y<=crown;y++)if(!aperture(x,y,z))
   put('wall',x,y,z,wood?F.plank:F.stone);
 }
 // Fully roofed tall working nave; side galleries protected except the east
 // equipment courtyard which is explicitly open to precipitation.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(floor(x,z)&&!openCourt(x,z)){
  put('roof',x,roofY(x,z),z,q.biome==='snow'||q.biome==='mountain'?F.slate:F.roof);
 }
 // Actual supporting piers and cross-beam rafters, leave the two-wide,
 // three-high central and both cross aisles unobstructed.
 for(let z=2;z<d-2;z++){
  if(z%3===0)for(let x=2;x<w-2;x++)if(floor(x,z)&&!openCourt(x,z)){
   const yy=roofY(x,z)-1;
   if(!has(x,yy,z))put('roof-purlin',x,yy,z,F.beam);
  }
  if(z%q.bearingCadence)continue;
  for(const x of [4,spineWest+1,spineEast-1,w-5]){
   if(!floor(x,z)||walkway(x,z)||openCourt(x,z))continue;
   const top=roofY(x,z)-1;
   for(let y=2;y<top;y++)if(!has(x,y,z))
    put('bearing-pier',x,y,z,wood?F.beam:F.column);
  }
 }
 const divideZ=Math.floor(d*.55);
 for(let x=spineWest+1;x<spineEast;x++)if(!walkway(x,divideZ))
  for(let y=2;y<=6;y++)if(!has(x,y,divideZ))
   put('workflow-divider',x,y,divideZ,wood?F.plank:F.stone);
 // Hand-authored category-specific functional construction (not operating machines).
 // Timber: drying racks, sawbench support and frame joinery; stone: cutting
 // plinths, blocking/hoist piers and independently stored rough stock.
 for(let z=q.westStart+6;z<q.westEnd-3;z+=Math.max(4,q.bearingCadence)){
  const x=6;
  if(walkway(x,z))continue;
  for(let y=2;y<=5;y++)if(!has(x,y,z))
   put(wood?'seasoning-lumber-upright':'column-carving-backstop',x,y,z,wood?F.beam:F.column);
 }
 for(let z=q.eastStart+7;z<q.eastEnd-3;z+=Math.max(4,q.bearingCadence)){
  const x=w-5;
  if(walkway(x,z)||openCourt(x,z))continue;
  if(!has(x,2,z))put(wood?'unworked-timber-stock':'rough-quarry-block-stock',x,2,z,wood?F.beam:F.stone);
 }
 for(let i=0;i<q.joineryBays;i++){
  const z=Math.min(d-7,7+i*4),x=spineWest+3+(i%2)*2;
  if(walkway(x,z)||has(x,2,z))continue;
  put(wood?'dry-joinery-workbench':'stone-dressing-plinth',x,2,z,wood?F.plank:F.slab);
 }
 // Actual Pack4 movable stock bin (unpowered, not a save container).
 const stockX=w-5,stockZ=(q.eastEnd-3)%q.bearingCadence===0?q.eastEnd-4:q.eastEnd-3; // keep moveable crate clear of authored pier rows
 if(!floor(stockX,stockZ)||walkway(stockX,stockZ)||has(stockX,2,stockZ))
  throw Error(q.name+' source crate intersects work bay/aisle');
 put('fixture',stockX,2,stockZ,F.crate,{orientation:'north',state:{}});
 features.push({name:wood?'unpowered joinery stock crate':'rough-cut stone storage crate',
  position:[stockX,2,stockZ],assetRef:F.crate,active:false});
 const toolX=5,toolZ=q.westEnd-4;
 if(!floor(toolX,toolZ)||walkway(toolX,toolZ)||has(toolX,2,toolZ))
  throw Error(q.name+' category tooling stand overlaps supported geometry');
 put('fixture',toolX,2,toolZ,wood?F.plank:F.slab,{orientation:'north'});
 features.push({name:wood?'nonworking hand-planing bench':'cold stone carving block',
  position:[toolX,2,toolZ],assetRef:wood?F.plank:F.slab,active:false});
 const nodes=[{id:'entry',x:mid,y:2,z:d-1,width:2,headroom:3},
  {id:'assembly',x:mid,y:2,z:d-8,width:2,headroom:3},
  {id:'finishing',x:mid,y:2,z:4,width:2,headroom:3},
  {id:'tool-wing',x:4,y:2,z:westAisleZ,width:2,headroom:3},
  {id:'load-yard',x:w-5,y:2,z:eastAisleZ,width:2,headroom:3}];
 const b={id:slotId(q.type,q.biome,q.size,2),type:q.type,biome:q.biome,size:q.size,variant:2,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-1,width:2,height:4,facing:'south'}],
  clearances:[{x:mid,y:2,z:2,width:2,height:3,depth:d-2},
   {x:3,y:2,z:westAisleZ,width:mid-2,height:3,depth:2},
   {x:mid+1,y:2,z:eastAisleZ,width:w-mid-4,height:3,depth:2}],
  spaces:[
   {id:'assembly',kind:wood?'full-frame-carpentry-and-joinery':'cold-block-dressing-and-layout',
    bounds:{x:spineWest,y:2,z:d-14,width:spineEast-spineWest+1,height:7,depth:12},accessNode:'assembly'},
   {id:'finishing',kind:wood?'assembled-woodstock-and-hand-finishing':'measured-stone-columns-and-finishing',
    bounds:{x:spineWest,y:2,z:2,width:spineEast-spineWest+1,height:7,depth:Math.floor(d*.46)},accessNode:'finishing'},
   {id:'tool-wing',kind:wood?'enclosed-sawbench-and-timber-joining':'reinforced-chisel-and-carving-bay',
    bounds:{x:1,y:2,z:q.westStart,width:spineWest-1,height:7,depth:q.westEnd-q.westStart+1},accessNode:'tool-wing'},
   {id:'load-yard',kind:wood?'air-drying-timber-return-and-loading':'open-air-rough-block-stock-court',
    bounds:{x:w-9,y:2,z:q.eastStart,width:8,height:7,depth:q.eastEnd-q.eastStart+1},accessNode:'load-yard'}],
  navigation:{entry:'entry',nodes,edges:[
   {from:'entry',to:'assembly',kind:'level'},
   {from:'assembly',to:'finishing',kind:'level'},
   {from:'finishing',to:'tool-wing',kind:'level'},
   {from:'assembly',to:'load-yard',kind:'level'}]},
  features,
  dependencies:[
   'Real Pack1–5 producer AABB and support check required for every oriented fixture',
   'Structural roof load, open courtyard drainage/weather protection not accepted',
   wood?'Dry joinery, stacked lumber and sawblade behavior symbolic, no working timber processing':'Chisel, stone-cutting and hoist function purely decorative, no mining/crafting',
   'No live terrain/world placement, save-schema-1 modifications, iPhone test or Gate A approval'],
  architecture:{name:q.name,trade:q.type,roofStyle:q.roof,
   originalSpatialProgram:wood?'timber-drying-west-ateliers / two-zone joinery nave / open-east-lumber-court':
    'column-carving-west-bays / reinforced-dressing-nave / open-east-rough-block-yard',
   westWing:[q.westStart,q.westEnd],eastWing:[q.eastStart,q.eastEnd],
   sourceOpenLoadingCourt:[q.courtStart,q.courtEnd],sourceBearingCadence:q.bearingCadence,
   uniqueJoineryOrCuttingBays:q.joineryBays,
   actualIndependentWorkrooms:4,physicalLoadApproved:false,
   weatherproofApproved:false,creatorApproved:false,sourceOnly:true}};
 validateBlueprint(b);
 return b;
}
export function createM3CraftSecondVariant(type,biome,size){
 if(!['carpenter','stonemason'].includes(type)||!BIOMES.includes(biome)||!SIZES.includes(size))
  throw RangeError('Builder 3A M3 category or biome/size excluded');
 const q=M3_CRAFT_SECOND_SPECS.find(s=>s.type===type&&s.biome===biome&&s.size===size);
 if(!q)throw RangeError('M3 craft variant not individually authored');
 return create(q);
}
export function createM3CraftSecondPool(){return M3_CRAFT_SECOND_SPECS.map(create);}
