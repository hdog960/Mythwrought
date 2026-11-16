/**
 * Builder 3A M4: 15 independently authored MINING-WORKSHOP second-variant
 * two-sided orehead transferworks. Five biomes × three sizes.
 * Physically excavated inter-bay yards, an open-to-sky assay court, north
 * cold grading shed, south ore dispatch and a sheltered 2x3 through-gallery.
 * No mining logic, machinery, production registration, saves or world placement.
 */
import {BIOMES,SIZES,slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const P=Object.freeze({stone:'pack1:002',slab:'pack1:007',column:'pack1:010',
 board:'pack2:013',beam:'pack2:015',tile:'pack3:023',slate:'pack3:025',
 stock:'pack4:057'});
// biome|size|site|w|d|north|south|leftWidth|rightWidth|westStarts|westLengths|
// eastStarts|eastLengths|courtZStart|courtZEnd|supportStride|roofProfile
const ORIGINAL=[
'temperate|small|brookcut-gravel-switchworks|38|45|8|8|11|10|11,23,34|8,8,8|16,33|11,9|20|26|5|saw-lintel',
'temperate|medium|riverbend-three-ore-tram-house|45|53|9|9|13|11|12,27,41|10,10,10|19,38|12,12|23|31|6|hip-chute',
'temperate|large|lowvale-great-cold-washworks|54|62|10|10|15|14|14,31,48|12,11,12|21,45|13,14|27|37|8|high-wash',
'desert|small|dune-crush-dry-sorting-square|39|46|8|9|12|9|12,24,35|8,9,8|17,34|10,10|19|25|5|wind-vent',
'desert|medium|sunquay-amber-ore-transfer|46|54|10|8|12|13|13,28,42|11,9,10|20,39|12,13|24|32|7|flat-terrace',
'desert|large|sandspire-dry-column-minery|55|63|11|10|16|13|15,32,49|12,12,11|22,45|15,15|28|38|8|vent-saw',
'snow|small|firpass-frozen-ore-headhouse|40|48|9|8|11|12|13,26,38|9,9,8|18,35|11,11|21|27|6|snow-gable',
'snow|medium|northdrift-insulated-crusher-bays|47|55|10|10|14|11|14,29,43|10,11,10|20,40|12,12|25|33|7|double-snow',
'snow|large|frostgate-seven-pier-mineral-yard|56|64|11|11|16|14|15,33,50|12,11,12|22,47|14,15|28|39|9|deep-hip',
'enchanted-forest|small|glimmerfen-lumen-ore-sorting|41|49|9|9|12|11|13,26,38|10,9,9|18,36|12,10|22|29|6|forest-vault',
'enchanted-forest|medium|moonshale-cold-splinterworks|48|56|10|10|13|14|14,30,44|10,11,10|21,40|13,13|26|34|7|canopy-step',
'enchanted-forest|large|rootglass-radial-shaft-transfer|57|65|12|10|16|15|16,34,51|12,12,11|23,47|14,15|29|40|9|glade-lantern',
'mountain|small|cragface-granite-ore-gallery|42|50|10|8|13|11|14,27,39|10,9,9|19,36|12,10|23|29|6|cliff-notch',
'mountain|medium|highspur-pithead-ore-weighhouse|49|57|11|9|15|12|15,30,44|11,10,11|22,41|13,12|26|35|8|ridge-run',
'mountain|large|skyquarry-crosscut-transferworks|58|66|12|12|17|15|17,35,52|13,11,11|24,48|14,15|30|41|9|stone-stagger'
];
const F=['biome','size','name','width','depth','north','south','leftWidth','rightWidth',
 'westStarts','westDepths','eastStarts','eastDepths','courtStart','courtEnd','stride','roof'];
export const M4_MINING_SECOND_SPECS=Object.freeze(ORIGINAL.map(line=>{
 const v=line.split('|');if(v.length!==F.length)throw Error('M4 source brief incomplete '+line);
 const s=Object.fromEntries(F.map((k,i)=>[k,([3,4,5,6,7,8,13,14,15].includes(i)?Number(v[i]):v[i])]));
 for(const k of ['westStarts','westDepths','eastStarts','eastDepths'])s[k]=Object.freeze(s[k].split(',').map(Number));
 return Object.freeze(s);
}));
if(M4_MINING_SECOND_SPECS.length!==15||new Set(M4_MINING_SECOND_SPECS.map(s=>s.name)).size!==15)
 throw Error('Must author exactly 15 distinct M4 second-variant pithead source programmes');

function build(q){
 const w=q.width,d=q.depth,H=33,mid=Math.floor(w/2)-1,leftInner=mid-5,rightInner=mid+6;
 const western=q.westStarts.map((z,i)=>({z,end:z+q.westDepths[i]-1,edge:Math.max(2,mid-q.leftWidth-2+(i===1?-1:i===2?2:0)),id:i+1}));
 const eastern=q.eastStarts.map((z,i)=>({z,end:z+q.eastDepths[i]-1,edge:Math.min(w-3,mid+q.rightWidth+3+(i===1?-2:0)),id:i+1}));
 const occupied=new Map(),modules=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z;
 const has=(x,y,z)=>occupied.has(key(x,y,z));
 function put(role,x,y,z,ref,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=H||z<0||z>=d)
   throw Error(q.name+' source outside envelope '+key(x,y,z));
  const k=key(x,y,z);
  if(occupied.has(k))throw Error(q.name+' actual voxel overlap '+k+' '+occupied.get(k));
  occupied.set(k,role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push(meta===null?[x,y,z,ref]:[x,y,z,ref,Object.freeze(meta)]);
 }
 function zone(x,z){
  if(x<2||x>=w-2||z<2||z>=d-2)return null;
  if(z<=q.north&&x>=3&&x<=w-4)return 'north-cold-ore-grading';
  if(z>=d-q.south&&x>=mid-7&&x<=mid+8)return 'south-staging-and-dispatch';
  if(x>=mid-4&&x<=mid+5)return 'central-covered-oreway';
  for(const a of western)if(x>=a.edge&&x<mid-4&&z>=a.z&&z<=a.end){
   if((z===a.z&&x<a.edge+3)||(z===a.end&&x<a.edge+2))return null;
   return 'west-material-transfer-'+a.id;
  }
  for(const a of eastern)if(x>mid+5&&x<=a.edge&&z>=a.z&&z<=a.end){
   if((z===a.z&&x>a.edge-3)||(z===a.end&&x>a.edge-2))return null;
   return 'east-ore-assay-'+a.id;
  }
  return null;
 }
 const foot=(x,z)=>zone(x,z)!==null;
 const yard=(x,z)=>zone(x,z)==='east-ore-assay-1'&&x>=rightInner+3&&x<=w-6&&z>=q.courtStart&&z<=q.courtEnd;
 function aisle(x,z){
  if(x>=mid&&x<=mid+1)return true;
  if(z===3||z===4)return true;
  for(const a of western)if(z===a.z+3||z===a.z+4)if(x>=a.edge+2&&x<=mid)return true;
  for(const a of eastern)if(z===a.z+3||z===a.z+4)if(x>=mid+1&&x<=a.edge-2)return true;
  return false;
 }
 function roofY(x,z){
  const p=zone(x,z);
  if(p?.startsWith('west-')){const a=western[Number(p.at(-1))-1];return 13+a.id+Math.floor((z-a.z)/7);}
  if(p?.startsWith('east-')){const a=eastern[Number(p.at(-1))-1];return 13+a.id+Math.floor((a.end-z)/8);}
  if(p==='south-staging-and-dispatch')return 12+Math.floor((mid+8-x)/7);
  if(p==='central-covered-oreway')return 18+(Math.floor(z/13)%2);
  const a=Math.min(x-3,w-4-x),n=Math.min(z-2,q.north-z);
  switch(q.roof){
   case 'saw-lintel':case 'vent-saw':case 'stone-stagger':return 18+(Math.floor(x/8)%3)+Math.floor(n/3);
   case 'hip-chute':case 'high-wash':case 'deep-hip':return 18+Math.min(5,Math.floor(Math.min(a,n*3)/4));
   case 'wind-vent':case 'flat-terrace':return 18+Math.floor(x/12)+Math.floor(n/3);
   case 'snow-gable':case 'double-snow':return 19+Math.min(6,Math.floor(a/4))+(x%11<3?1:0);
   case 'forest-vault':case 'glade-lantern':return 18+Math.min(6,Math.floor((a+x%8)/5));
   case 'canopy-step':case 'cliff-notch':case 'ridge-run':return 18+Math.floor(x/10)+Math.floor(n/4);
   default:throw Error(q.name+' unknown original orehouse roof programme '+q.roof);
  }
 }
 const roofed=(x,z)=>foot(x,z)&&!yard(x,z);
 function opening(x,y,z){
  return (z===d-3&&x>=mid&&x<=mid+1&&y>=2&&y<=5)||
   (z===2&&x>=mid&&x<=mid+1&&y>=2&&y<=5);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  put('foundation',x,0,z,P.stone);put('floor',x,1,z,P.slab);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  if([[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
  const top=zone(x,z)==='north-cold-ore-grading'?12:9;
  for(let y=2;y<=top;y++)if(!opening(x,y,z))
   put('wall',x,y,z,P.stone);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(roofed(x,z))
  put('roof',x,roofY(x,z),z,['snow','mountain'].includes(q.biome)?P.slate:P.tile);
 // All roof modules have real sourced purlins; support pier spacing is a
 // distinct independent physical bay layout. Roof witness != engineering load.
 for(let z=3;z<d-3;z++){
  for(let x=3;x<w-3;x++)if(roofed(x,z)&&(z%2===0||x%5===0)){
   const y=roofY(x,z)-1;
   if(!has(x,y,z))put('roof-purlin',x,y,z,P.beam);
  }
  if(z%q.stride!==0)continue;
  for(const x of [4,mid-6,mid+7,w-5]){
   if(!roofed(x,z)||aisle(x,z))continue;
   for(let y=2;y<roofY(x,z)-1;y++)if(!has(x,y,z))
    put('bearing-pier',x,y,z,P.column);
  }
 }
 // Five cold, non-operating physical mining functions.
 for(const a of western){
  const x=a.edge+3;
  for(let z=a.z+2;z<a.end-1;z+=4){
   if(foot(x,z)&&!aisle(x,z))
    for(let y=2;y<=4;y++)if(!has(x,y,z))
     put(['ore-tram-spur-support','raw-mineral-sorting-post','cold-tailings-rack'][a.id-1],x,y,z,P.column);
  }
 }
 for(const a of eastern){
  const x=a.edge-3;
  for(let z=a.z+2;z<a.end-1;z+=5)
   if(foot(x,z)&&!aisle(x,z)&&!yard(x,z)&&!has(x,2,z))
    put(a.id===1?'hand-sample-grading-plinth':'mineral-weighing-stand',x,2,z,P.slab);
 }
 // Actual producer referenced but nonfunctional crates / dry stone measuring slab.
 function fixture(ref,name,side){
  const a=side==='west'?western[1]:eastern[1];
  for(let z=a.z+2;z<a.end-1;z++)for(let x=side==='west'?a.edge+3:mid+8;
      x<=(side==='west'?mid-6:a.edge-3);x++){
   if(!foot(x,z)||yard(x,z)||aisle(x,z)||!has(x,1,z)||has(x,2,z))continue;
   if(![[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
   put('fixture',x,2,z,ref,{orientation:'north',state:{}});
   features.push({name,position:[x,2,z],assetRef:ref,active:false});return;
  }
  throw Error(q.name+' no safe physical fixture footprint '+name);
 }
 fixture(P.stock,'cold rough-ore crate not functioning','west');
 fixture(P.slab,'nonoperative measured mineral tablet','east');
 const westNodes=western.map(a=>({id:'west-ore-'+a.id,x:a.edge+2,y:2,z:a.z+3,width:2,headroom:3}));
 const eastNodes=eastern.map(a=>({id:'east-assay-'+a.id,x:a.edge-3,y:2,z:a.z+3,width:2,headroom:3}));
 const nodes=[
  {id:'entry',x:mid,y:2,z:d-3,width:2,headroom:3},
  {id:'dispatch',x:mid,y:2,z:d-7,width:2,headroom:3},
  {id:'ore-grading',x:mid,y:2,z:4,width:2,headroom:3},
  ...westNodes,...eastNodes
 ];
 const b={
  id:slotId('mining-workshop',q.biome,q.size,2),
  type:'mining-workshop',biome:q.biome,size:q.size,variant:2,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:H,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-3,width:2,height:4,facing:'south'}],
  clearances:[
   {x:mid,y:2,z:3,width:2,height:3,depth:d-5},
   ...westNodes.map(n=>({x:n.x,y:2,z:n.z,width:mid+1-n.x,height:3,depth:2})),
   ...eastNodes.map(n=>({x:mid+1,y:2,z:n.z,width:n.x-mid+1,height:3,depth:2}))],
  spaces:[
   {id:'ore-grading',kind:'north-dry-hand-grading-shed',
    bounds:{x:3,y:2,z:2,width:w-6,height:11,depth:q.north-1},accessNode:'ore-grading'},
   {id:'dispatch',kind:'south-stock-transfer-and-outbound-mineral-floor',
    bounds:{x:mid-7,y:2,z:d-q.south,width:16,height:8,depth:q.south-2},accessNode:'dispatch'},
   ...westNodes.map((n,i)=>({id:n.id,
    kind:['inactive-cold-mine-tram-frame','mineral-bulk-bucket-layout','dry-reject-tailings-pile'][i],
    bounds:{x:western[i].edge,y:2,z:western[i].z,width:mid-4-western[i].edge,height:7,depth:q.westDepths[i]},accessNode:n.id})),
   ...eastNodes.map((n,i)=>({id:n.id,
    kind:i===0?'hand-assay-and-inert-rock-laboratory':'finished-ore-batch-weighing',
    bounds:{x:mid+6,y:2,z:eastern[i].z,width:eastern[i].edge-mid-5,height:7,depth:q.eastDepths[i]},accessNode:n.id}))],
  navigation:{entry:'entry',nodes,edges:[
   {from:'entry',to:'dispatch',kind:'level'},
   {from:'dispatch',to:'ore-grading',kind:'level'},
   ...westNodes.map(n=>({from:'ore-grading',to:n.id,kind:'level'})),
   ...eastNodes.map(n=>({from:'ore-grading',to:n.id,kind:'level'}))]},
  features,
  dependencies:[
   'Only existing physical symbolic manual Pack1–5 families; biome130 remains unregistered and unused',
   'Producer exact AABB collision/fixture support and other physical mining dependencies require audit',
   'No active mine carts, extraction, refinery, ore generation or production systems',
   'Roof load/span, climate, hydrology, drainage, final approved art and physical iPhone acceptance pending',
   'No runtime blocks, save schema1, live world placement, sibling builder or v0.11 changes'],
  architecture:{
   name:q.name,siteProgramme:'cold pithead oreway with staggered 3+2 exterior working fingers',
   actualOutdoorLoadingCourt:[q.courtStart,q.courtEnd],
   physicalOreProcessingFingers:5,independentRoofRegions:7,
   westSourceStarts:q.westStarts,eastSourceStarts:q.eastStarts,
   westSourceDepths:q.westDepths,eastSourceDepths:q.eastDepths,
   roofMorphology:q.roof,sourceOnly:true,
   structuralLoadApproved:false,weatherApproved:false,creatorApproved:false
  }
 };
 validateBlueprint(b);
 return b;
}
export function createM4MiningSecondVariant(biome,size){
 if(!BIOMES.includes(biome)||!SIZES.includes(size))
  throw RangeError('Only Builder 3A mining M4 exact second-variant slots are allocated');
 const s=M4_MINING_SECOND_SPECS.find(s=>s.biome===biome&&s.size===size);
 if(!s)throw RangeError('Missing source-authored M4 mining specification');
 return build(s);
}
export function createM4MiningSecondPool(){return M4_MINING_SECOND_SPECS.map(build);}
