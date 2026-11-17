/**
 * Builder 3A M4 original THIRD mining-workshop architectures: two unequal
 * open pit courts enclosed by separate irregular ring workshops, with actual
 * two-cell stone bridges across each void, a central continuous covered oreway,
 * and independent north and south mineral halls.
 *
 * These are source-coordinate ring/cross-gallery mines; NOT the first-variant
 * single-bay sheds or second-variant five-finger pithead combs. Every biome/size
 * has a written site programme, unique dimensions/court returns and roof form.
 * No mining mechanics, generator placement, saves or production registration.
 */
import {BIOMES,SIZES,slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const MAT=Object.freeze({stone:'pack1:002',slab:'pack1:007',pillar:'pack1:010',
 plank:'pack2:013',beam:'pack2:015',roof:'pack3:023',slate:'pack3:025',
 crate:'pack4:057'});
// biome|size|site|width|depth|north|south|westCourtZ|westCourtDepth|
// eastCourtZ|eastCourtDepth|westCourtWidth|eastCourtWidth|
// outsideNotchWestZ|outsideNotchEastZ|roofProfile|pierStep
const ORIGINAL=[
'temperate|small|streamcut-double-assay-pit-forum|44|50|9|9|15|14|19|13|7|6|28|16|crossed-roofwell|5',
'temperate|medium|coppergate-beltstone-dual-court|50|57|10|10|16|17|22|15|8|7|33|18|double-quoin|6',
'temperate|large|barrowford-deep-lime-quarries|58|65|11|11|18|19|25|18|10|9|36|20|triple-beam|8',
'desert|small|wastescar-wind-ore-square|45|51|9|10|16|13|20|14|8|6|30|17|sun-pit-lantern|5',
'desert|medium|oasis-dry-ore-twin-arcades|51|58|11|9|18|15|23|17|9|7|33|19|desert-cantilever|7',
'desert|large|dunecliff-multipart-mineral-forum|59|66|12|10|19|18|25|20|11|9|38|22|heat-shade-gable|8',
'snow|small|frostmere-quoin-grading-courts|46|52|10|9|17|15|21|14|8|7|31|18|snow-twin-hip|6',
'snow|medium|northwatch-two-pit-oreworks|52|59|11|10|18|16|24|17|9|8|34|19|gambrel-bridge|7',
'snow|large|icefall-ore-forum-double-ridge|60|67|12|11|18|18|27|20|8|11|36|24|winter-vault|9',
'enchanted-forest|small|glowslate-buried-court-counters|47|53|10|10|17|14|22|15|8|7|32|19|lantern-branch|6',
'enchanted-forest|medium|heartroot-wraithstone-observatory|53|60|12|10|19|17|25|16|9|8|35|21|folded-canopy|8',
'enchanted-forest|large|moonquartz-twin-rune-pithead|61|68|12|12|20|19|27|19|11|10|40|23|orelight-gallery|9',
'mountain|small|cragrim-stone-audit-quadrangles|48|54|11|9|18|15|23|14|9|7|32|20|split-ridge|6',
'mountain|medium|passwatch-slabscale-high-courts|54|61|12|11|19|17|25|18|10|8|36|21|cliff-fracture|8',
'mountain|large|summit-shaftgate-mineral-forum|62|69|13|12|21|20|28|19|11|10|41|24|long-ridge-tressle|9'
];
const KEYS=['biome','size','name','width','depth','north','south','westZ','westDepth','eastZ',
 'eastDepth','westWidth','eastWidth','notchWestZ','notchEastZ','roof','stride'];
export const M4_MINING_THIRD_SPECS=Object.freeze(ORIGINAL.map(s=>{
 const vals=s.split('|');if(vals.length!==KEYS.length)throw Error('Incomplete original quarry ring programme '+s);
 return Object.freeze(Object.fromEntries(KEYS.map((key,i)=>[key,i>=3&&i<=14||i===16?Number(vals[i]):vals[i]])));
}));
if(M4_MINING_THIRD_SPECS.length!==15||
 new Set(M4_MINING_THIRD_SPECS.map(s=>s.name)).size!==15)
 throw Error('M4 third-variant exact original 15-brief scope mismatch');

function build(s){
 const w=s.width,d=s.depth,H=36,mid=Math.floor(w/2)-1,
  wX=7,wEnd=wX+s.westWidth-1,
  eX=mid+8,eEnd=eX+s.eastWidth-1,
  wBridge=s.westZ+Math.floor(s.westDepth/2)-1,
  eBridge=s.eastZ+Math.floor(s.eastDepth/2)-1,
  southStart=d-s.south;
 const roles=new Map(),occupied=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z,has=(x,y,z)=>occupied.has(key(x,y,z));
 function put(role,x,y,z,ref,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=H||z<0||z>=d)
   throw Error(s.name+' voxel out of source envelope '+key(x,y,z));
  const k=key(x,y,z);
  if(occupied.has(k))throw Error(s.name+' source voxel collision '+k+' '+occupied.get(k));
  occupied.set(k,role);
  if(!roles.has(role))roles.set(role,[]);
  roles.get(role).push(meta===null?[x,y,z,ref]:[x,y,z,ref,Object.freeze(meta)]);
 }
 function courtyard(x,z,side){
  return side==='west'?
   x>=wX&&x<=wEnd&&z>=s.westZ&&z<s.westZ+s.westDepth:
   x>=eX&&x<=eEnd&&z>=s.eastZ&&z<s.eastZ+s.eastDepth;
 }
 function zone(x,z){
  if(x<2||x>w-3||z<2||z>d-3)return null;
  if(z<=s.north)return 'north-cold-assay-and-sample-hall';
  if(z>=southStart)return 'south-ore-transport-hall';
  if(x>=mid-2&&x<=mid+3)return 'main-sheltered-mineral-pass';
  if(x<=mid-3){
   // Real irregular outer west wall, never blocking the inner walking ring.
   if(x<=3&&z>=s.notchWestZ&&z<s.notchWestZ+6)return null;
   if(courtyard(x,z,'west')){
    if(z===wBridge||z===wBridge+1)return 'open-west-stone-court-bridge';
    return null;
   }
   return 'west-cold-ore-inspection-ring';
  }
  if(x>=mid+4){
   if(x>=w-4&&z>=s.notchEastZ&&z<s.notchEastZ+7)return null;
   if(courtyard(x,z,'east')){
    if(z===eBridge||z===eBridge+1)return 'open-east-quoin-court-bridge';
    return null;
   }
   return 'east-mineral-grading-ring';
  }
  return null;
 }
 const foot=(x,z)=>zone(x,z)!==null;
 const roofed=(x,z)=>foot(x,z)&&!zone(x,z).startsWith('open-');
 function aisle(x,z){
  return (x>=mid&&x<=mid+1)||
   (z===3||z===4)||
   (x>=5&&x<=6)||(x>=w-7&&x<=w-6)||
   (z>=wBridge&&z<=wBridge+1&&x>=5&&x<=mid+1)||
   (z>=eBridge&&z<=eBridge+1&&x>=mid&&x<=w-6);
 }
 function roofY(x,z){
  const zoneName=zone(x,z);
  if(zoneName==='south-ore-transport-hall')return 14+Math.floor((mid+8-x)/7);
  if(zoneName==='west-cold-ore-inspection-ring')
   return 14+Math.floor((z+s.westWidth)%13/6)+(s.roof.includes('snow')?1:0);
  if(zoneName==='east-mineral-grading-ring')
   return 15+Math.floor((s.eastDepth+z)%13/6);
  if(zoneName==='main-sheltered-mineral-pass')return 18+(Math.floor(z/13)%2);
  const ridge=Math.min(x-2,w-3-x),end=Math.min(z-2,s.north-z);
  switch(s.roof){
   case 'crossed-roofwell':case 'double-quoin':case 'triple-beam':
    return 20+Math.min(6,Math.floor(ridge/4))+(Math.floor(x/9)%2);
   case 'sun-pit-lantern':case 'desert-cantilever':case 'heat-shade-gable':
    return 19+Math.floor(ridge/6)+Math.floor(x/13);
   case 'snow-twin-hip':case 'gambrel-bridge':case 'winter-vault':
    return 20+Math.min(6,Math.floor(ridge/4))+(x%13<3?1:0);
   case 'lantern-branch':case 'folded-canopy':case 'orelight-gallery':
    return 20+Math.min(6,Math.floor((ridge+x%8)/5));
   case 'split-ridge':case 'cliff-fracture':case 'long-ridge-tressle':
    return 20+Math.floor(x/11)+Math.floor(end/3);
   default:throw Error('Unknown authored M4 third roof '+s.roof);
  }
 }
 function opening(x,y,z){
  if(z===d-3&&x>=mid&&x<=mid+1&&y>=2&&y<=5)return true;
  if(z===2&&x>=mid&&x<=mid+1&&y>=2&&y<=5)return true;
  // Courtyard entries where actual two-wide stone decks cross exposed pit holes.
  if(z>=wBridge&&z<=wBridge+1&&x===wX-1&&y>=2&&y<=5)return true;
  if(z>=eBridge&&z<=eBridge+1&&x===eEnd+1&&y>=2&&y<=5)return true;
  return false;
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  put('foundation',x,0,z,MAT.stone);put('floor',x,1,z,MAT.slab);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(roofed(x,z)){
  if([[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
  const maxY=zone(x,z)==='north-cold-assay-and-sample-hall'?12:9;
  // Low-height arcades preserve 2-wide, 3-high circulation where ring
  // boundaries face the two open pit courts; high lintels remain supported.
  for(let y=2;y<=maxY;y++)if(!opening(x,y,z)&&!(aisle(x,z)&&y<=4))
   put('wall',x,y,z,MAT.stone);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(roofed(x,z))
  put('roof',x,roofY(x,z),z,['snow','mountain'].includes(s.biome)?MAT.slate:MAT.roof);
 // Purlin-bearing roof assembly; strict native physical AABB and roof sampling
 // still required. A close structural witness is NOT a span/load guarantee.
 for(let z=3;z<d-3;z++){
  for(let x=3;x<w-3;x++)if(roofed(x,z)&&(z%2===0||x%5===0)){
   const y=roofY(x,z)-1;
   if(!has(x,y,z))put('roof-purlin',x,y,z,MAT.beam);
  }
  if(z%s.stride!==0)continue;
  for(const x of [4,mid-5,mid+6,w-5]){
   if(!roofed(x,z)||aisle(x,z))continue;
   const maxY=roofY(x,z)-1;
   for(let y=2;y<maxY;y++)if(!has(x,y,z))
    put('bearing-pier',x,y,z,MAT.pillar);
  }
 }
 // Separate stationary ore-working physical modules, never a disguised
 // functional crusher, hopper, collection system or animated machinery.
 for(let z=s.north+3;z<southStart-3;z+=s.stride){
  for(const x of [8,mid-6]){
   if(!roofed(x,z)||aisle(x,z)||!has(x,1,z))continue;
   for(let y=2;y<=4;y++)if(!has(x,y,z))
    put('ore-quarantine-rack',x,y,z,MAT.pillar);
  }
 }
 for(let z=s.north+4;z<southStart-3;z+=s.stride+2){
  for(const x of [mid+7,w-9]){
   if(!roofed(x,z)||aisle(x,z)||!has(x,1,z)||has(x,2,z))continue;
   put('hand-ore-grading-stand',x,2,z,MAT.slab);
  }
 }
 for(let z=6;z<s.north-2;z+=3){
  const x=mid+7;if(roofed(x,z)&&!has(x,2,z))
   put('cold-quartz-register',x,2,z,MAT.slab);
 }
 function fixture(ref,name,side){
  const begin=side==='west'?8:mid+6,end=side==='west'?mid-5:w-9;
  for(let z=s.north+3;z<southStart-3;z++)for(let x=begin;x<=end;x++){
   if(!roofed(x,z)||!has(x,1,z)||has(x,2,z)||aisle(x,z))continue;
   if(![[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
   put('fixture',x,2,z,ref,{orientation:'north',state:{}});
   features.push({name,position:[x,2,z],assetRef:ref,active:false});return;
  }
  throw Error(s.name+' no physically legal '+name+' fixture location');
 }
 fixture(MAT.crate,'inert rock-grade archive crate','west');
 fixture(MAT.slab,'unpowered ashlar sampling tablet','east');
 const nodes=[
  {id:'south-entry',x:mid,y:2,z:d-3,width:2,headroom:3},
  {id:'ore-transfer',x:mid,y:2,z:d-s.south+3,width:2,headroom:3},
  {id:'north-assay',x:mid,y:2,z:4,width:2,headroom:3},
  {id:'west-perimeter',x:5,y:2,z:wBridge,width:2,headroom:3},
  {id:'west-bridge',x:wX+1,y:2,z:wBridge,width:2,headroom:3},
  {id:'east-perimeter',x:w-7,y:2,z:eBridge,width:2,headroom:3},
  {id:'east-bridge',x:eX+1,y:2,z:eBridge,width:2,headroom:3}
 ];
 const n={id:slotId('mining-workshop',s.biome,s.size,3),
  type:'mining-workshop',biome:s.biome,size:s.size,variant:3,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:H,depth:d},
  modules:[...roles].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-3,width:2,height:4,facing:'south'}],
  clearances:[
   {x:mid,y:2,z:3,width:2,height:3,depth:d-5},
   {x:5,y:2,z:s.north+2,width:2,height:3,depth:southStart-s.north-3},
   {x:w-7,y:2,z:s.north+2,width:2,height:3,depth:southStart-s.north-3},
   {x:5,y:2,z:wBridge,width:mid-3,height:3,depth:2},
   {x:mid,y:2,z:eBridge,width:w-mid-6,height:3,depth:2},
   {x:3,y:2,z:3,width:w-6,height:3,depth:2}
  ],
  spaces:[
   {id:'ore-transfer',kind:'south-inert-mineral-cart-transfer',
    bounds:{x:3,y:2,z:southStart,width:w-6,height:10,depth:s.south-2},accessNode:'ore-transfer'},
   {id:'north-assay',kind:'north-cold-mineral-facies-lab',
    bounds:{x:3,y:2,z:2,width:w-6,height:12,depth:s.north-1},accessNode:'north-assay'},
   {id:'west-ring',kind:'left-perimeter-ore-quarantine-and-inert-staging',
    bounds:{x:3,y:2,z:s.north+1,width:mid-5,height:9,depth:southStart-s.north-2},accessNode:'west-perimeter'},
   {id:'west-court',kind:'genuine-open-sky-negative-space-pit-observation-bridge',
    bounds:{x:wX,y:2,z:s.westZ,width:s.westWidth,height:7,depth:s.westDepth},accessNode:'west-bridge'},
   {id:'east-ring',kind:'right-perimeter-mineral-grading-and-ashlar-index',
    bounds:{x:mid+4,y:2,z:s.north+1,width:w-mid-6,height:9,depth:southStart-s.north-2},accessNode:'east-perimeter'},
   {id:'east-court',kind:'open-sky-stone-assay-bridge-and-trim-gallery',
    bounds:{x:eX,y:2,z:s.eastZ,width:s.eastWidth,height:7,depth:s.eastDepth},accessNode:'east-bridge'}],
  navigation:{entry:'south-entry',nodes,edges:[
   {from:'south-entry',to:'ore-transfer',kind:'level'},
   {from:'ore-transfer',to:'north-assay',kind:'level'},
   {from:'north-assay',to:'west-perimeter',kind:'level'},
   {from:'west-perimeter',to:'west-bridge',kind:'level'},
   {from:'north-assay',to:'east-perimeter',kind:'level'},
   {from:'east-perimeter',to:'east-bridge',kind:'level'}]},
  features,dependencies:[
   'Physical source-manifest families from existing integrated manual Packs1–5 only; never invented biome130 IDs',
   'Independent source Pack AABB collider, occupied offsets, support and reservation audit is mandatory',
   'Courtyard rims, roof loading/span, soil stability and drainage are unapproved',
   'Cold mining benches and ore samples have no active gameplay/crafting/extraction systems',
   'No world placement, shared runtime, save schema1, terrain edits, physical iPhone or v0.11'],
  architecture:{
   sourceProgramme:s.name,planFamily:'double open-court mineral-loop with 2×2 cross-braced stone bridges',
   originalWestCourt:[wX,s.westZ,s.westWidth,s.westDepth],
   originalEastCourt:[eX,s.eastZ,s.eastWidth,s.eastDepth],
   trueUnroofedCourtCount:2,crossingDecks:true,roofMorphology:s.roof,
   independentSourceRoofRegions:5,actualUsableWorkZones:6,
   structuralLoadApproved:false,weatherApproved:false,creatorApproved:false,sourceOnly:true
  }
 };
 validateBlueprint(n);return n;
}
export function createM4MiningThirdVariant(biome,size){
 if(!BIOMES.includes(biome)||!SIZES.includes(size))
  throw RangeError('Only M4 third-variant mining workshop exact allocations may be authored');
 const s=M4_MINING_THIRD_SPECS.find(v=>v.biome===biome&&v.size===size);
 if(!s)throw RangeError('M4 third original physical programme missing');
 return build(s);
}
export function createM4MiningThirdPool(){return M4_MINING_THIRD_SPECS.map(build);}
