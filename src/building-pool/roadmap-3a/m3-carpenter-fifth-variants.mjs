/**
 * Builder 3A M3 final carpentry allocation: 15 individually briefed variant-5
 * THREE-FINGER SAWMILL / offset comb-factory architectures. Each source
 * footprint has three unequal west production fingers, two unequal east
 * joinery wings, an actual enclosed two-wide longitudinal gallery, a north
 * finishing hall and south dispatch shed. Unlike older long-nave, H-cross
 * and open U-court designs, real gaps cut between 5 separate working bays.
 * Only hypothetical source geometry; no crafting, deployment or registry edit.
 */
import {BIOMES,SIZES,slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const P=Object.freeze({stone:'pack1:002',slab:'pack1:007',column:'pack1:010',
 plank:'pack2:013',timber:'pack2:015',tile:'pack3:023',slate:'pack3:025',crate:'pack4:057'});
// biome|size|unique trade programme|width|depth|north|dispatch|westWidth|eastWidth|
// westBegins(offset triplet)|eastBegins(offset pair)|westDepths|eastDepths|
// clerestory|roofPlan|supportStride
const SOURCE=[
'temperate|small|rushbrook-sawmill-threeblade|42|48|9|9|11|12|11,23,35|16,33|8,8,9|8,10|2|staggered-saw|5',
'temperate|medium|canal-furniture-five-shop|49|55|10|10|14|12|12,26,40|18,37|10,9,10|11,12|3|millrace-ridge|6',
'temperate|large|woodport-great-ship-ribworks|58|63|11|11|16|15|14,30,46|20,42|11,11,12|13,13|4|gantry-gable|8',
'desert|small|sunshade-threshold-cabinetry|43|49|9|8|12|11|12,24,36|17,34|8,9,9|9,10|2|courtyard-pergola|5',
'desert|medium|oasis-vane-and-lathe-mill|50|56|10|10|14|13|13,27,41|19,38|10,10,10|11,12|3|wind-stagger|7',
'desert|large|sandquay-longboard-frameworks|59|64|11|10|17|15|14,31,47|21,43|12,11,13|13,14|4|sun-sawtooth|8',
'snow|small|whitefir-insulated-joinery|44|50|10|9|12|12|13,25,37|18,35|8,9,9|10,10|2|snow-dual-hip|5',
'snow|medium|frostcrest-covered-plankmill|51|57|11|10|15|13|14,28,42|20,39|10,11,10|12,12|3|deep-gambrel|7',
'snow|large|northpass-log-and-frameworks|60|65|12|11|17|16|15,32,48|22,44|12,12,12|14,14|4|snow-spine|9',
'enchanted-forest|small|fernwhorl-branch-carver|45|51|10|9|13|12|13,26,38|18,36|9,9,10|10,11|2|bough-lantern|6',
'enchanted-forest|medium|lumenbark-inlay-craftyard|52|58|11|11|15|14|14,29,43|20,40|11,10,11|12,13|3|glade-canopy|7',
'enchanted-forest|large|moonroot-bentwood-guild|61|66|12|11|18|15|16,33,50|23,45|12,12,11|14,15|4|branch-fold|9',
'mountain|small|cragwood-beam-and-trestle|46|52|10|10|13|13|14,27,39|19,37|9,10,9|10,11|2|cliff-tier|6',
'mountain|medium|highspur-bridge-stringer-shop|53|59|11|11|16|14|15,30,44|21,41|11,11,11|13,13|3|ridge-cantilever|8',
'mountain|large|skybridge-five-bay-woodwright|62|67|12|12|18|17|16,34,51|23,46|13,12,12|14,15|4|crest-sawtooth|9'
];
const NAMES=['biome','size','name','width','depth','north','dispatch','westWidth','eastWidth',
 'westBegin','eastBegin','westDepths','eastDepths','clerestory','roof','stride'];
export const M3_CARPENTER_FIFTH_SPECS=Object.freeze(SOURCE.map(line=>{
 const a=line.split('|');if(a.length!==NAMES.length)throw Error('Incomplete fifth carpenter source brief');
 const s=Object.fromEntries(NAMES.map((k,i)=>[k,i>=3&&i<=8||i===13||i===15?Number(a[i]):a[i]]));
 for(const key of ['westBegin','eastBegin','westDepths','eastDepths'])s[key]=Object.freeze(s[key].split(',').map(Number));
 return Object.freeze(s);
}));
if(M3_CARPENTER_FIFTH_SPECS.length!==15||
 new Set(M3_CARPENTER_FIFTH_SPECS.map(x=>x.name)).size!==15)
 throw Error('Builder 3A carpenter fifth source allocation must contain 15 original programmes');

function build(s){
 const {width:w,depth:d}=s,H=34,mid=Math.floor(w/2)-1;
 const firstLeft=mid-s.westWidth-2,firstRight=mid+s.eastWidth+3;
 const occupied=new Map(),modules=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z,has=(x,y,z)=>occupied.has(key(x,y,z));
 const lefts=s.westBegin.map((z,i)=>({z,end:z+s.westDepths[i]-1,index:i,edge:Math.max(3,firstLeft+(i===1?-1:i===2?2:0))}));
 const rights=s.eastBegin.map((z,i)=>({z,end:z+s.eastDepths[i]-1,index:i,edge:Math.min(w-4,firstRight+(i===0?-2:0))}));
 function put(role,x,y,z,ref,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=H||z<0||z>=d)
   throw Error(s.name+' out-of-envelope source '+key(x,y,z));
  if(has(x,y,z))throw Error(s.name+' overlapping source '+key(x,y,z)+' existing '+occupied.get(key(x,y,z)));
  occupied.set(key(x,y,z),role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push(meta===null?[x,y,z,ref]:[x,y,z,ref,Object.freeze(meta)]);
 }
 function zone(x,z){
  if(x<2||x>w-3||z<2||z>d-3)return null;
  if(z<=s.north&&x>=3&&x<=w-4)return 'north-drying-finish-hall';
  if(z>=d-s.dispatch&&x>=mid-7&&x<=mid+8)return 'south-dispatch';
  if(x>=mid-3&&x<=mid+4)return 'covered-longitudinal-work-gallery';
  for(const t of lefts)if(z>=t.z&&z<=t.end&&x>=t.edge&&x<mid-3){
   // Actual diagonal-like staggered carved corner, no flat rectangular wing.
   if(z===t.z&&x<t.edge+3||z===t.end&&x<t.edge+2)return null;
   return 'west-timber-finger-'+(t.index+1);
  }
  for(const t of rights)if(z>=t.z&&z<=t.end&&x>mid+4&&x<=t.edge){
   if(z===t.z&&x>t.edge-3||z===t.end&&x>t.edge-2)return null;
   return 'east-joinery-finger-'+(t.index+1);
  }
  return null;
 }
 const foot=(x,z)=>zone(x,z)!==null;
 function aisle(x,z){
  if(x>=mid&&x<=mid+1)return true;
  if(z===3||z===4)return true;
  for(const t of lefts)if(z===t.z+3||z===t.z+4){
   if(x>=t.edge+2&&x<=mid)return true;
  }
  for(const t of rights)if(z===t.z+3||z===t.z+4){
   if(x>=mid+1&&x<=t.edge-2)return true;
  }
  return false;
 }
 function roofY(x,z){
  const kind=zone(x,z);
  if(kind==='south-dispatch')return 11+Math.floor((mid+8-x)/6);
  if(kind?.startsWith('west-')){const i=Number(kind.at(-1))-1;return 12+i+Math.floor((z-lefts[i].z)/5);}
  if(kind?.startsWith('east-')){const i=Number(kind.at(-1))-1;return 13+i+Math.floor((rights[i].end-z)/6);}
  if(kind==='north-drying-finish-hall'){
   const width=Math.min(x-3,w-4-x);
   switch(s.roof){
    case 'staggered-saw':case 'wind-stagger':case 'sun-sawtooth':case 'crest-sawtooth':
     return 18+(Math.floor(x/7)%3)+Math.floor(width/8);
    case 'millrace-ridge':case 'gantry-gable':case 'deep-gambrel':case 'snow-spine':
     return 18+Math.min(6,Math.floor(width/4));
    case 'courtyard-pergola':case 'glade-canopy':case 'branch-fold':
     return 17+Math.min(5,Math.floor(width/5))+(x%11<3?1:0);
    case 'snow-dual-hip':case 'bough-lantern':case 'cliff-tier':
     return 18+Math.floor(width/6)+(x%12<3?1:0);
    case 'ridge-cantilever':return 18+Math.floor(x/11)+Math.floor(width/8);
    default:throw Error('Missing original fifth roof shape '+s.roof);
   }
  }
  // This central high glazed-roof corridor makes the five workshop fingers
  // physically connected while their intermediate yards remain roofless.
  return 17+s.clerestory+((Math.floor(z/11)%2)===0?1:0);
 }
 function opening(x,y,z){
  if(z===d-3&&x>=mid&&x<=mid+1&&y>=2&&y<=5)return true;
  if(z===2&&x>=mid&&x<=mid+1&&y>=2&&y<=5)return true;
  if((x===3||x===w-4)&&z>=4&&z<=5&&y>=2&&y<=5)return true;
  return false;
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  put('foundation',x,0,z,P.stone);
  put('floor',x,1,z,P.plank);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  if([[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
  const top=zone(x,z)==='north-drying-finish-hall'?13:9;
  for(let y=2;y<=top;y++)if(!opening(x,y,z))
   put('wall',x,y,z,P.plank);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  put('roof',x,roofY(x,z),z,['snow','mountain'].includes(s.biome)?P.slate:P.tile);
 }
 // Real cross-purlins, anchored independent posts and explicit finite downstands.
 for(let z=3;z<d-3;z++){
  for(let x=3;x<w-3;x++)if(foot(x,z)&&(z%3===0||x%6===0)){
   const y=roofY(x,z)-1;if(!has(x,y,z))put('roof-purlin',x,y,z,P.timber);
  }
  if(z%s.stride!==0)continue;
  for(const x of [4,mid-5,mid+6,w-5]){
   if(!foot(x,z)||aisle(x,z))continue;
   const high=roofY(x,z)-1;
   for(let y=2;y<=high;y++)if(!has(x,y,z))
    put('bearing-pier',x,y,z,P.timber);
  }
 }
 // Five genuinely different trade working zones, not five metadata labels.
 for(const t of lefts){
  for(let z=t.z+2;z<t.end-1;z+=4){
   const x=t.edge+3;
   if(foot(x,z)&&!aisle(x,z)&&!has(x,2,z))
    for(let y=2;y<=4;y++)if(!has(x,y,z))
     put(t.index===0?'hand-ripsaw-support':t.index===1?'seasoning-gantry':'frame-squaring-station',
      x,y,z,P.timber);
  }
 }
 for(const t of rights){
  for(let z=t.z+2;z<t.end-1;z+=5){
   const x=t.edge-3;
   if(foot(x,z)&&!aisle(x,z)&&!has(x,2,z))
    put(t.index===0?'mortise-template-bench':'fine-joinery-block',x,2,z,P.plank);
  }
 }
 function fixture(ref,label,prefer){
  // Grounded producer referenced asset outside the 2x3 traversable routes;
  // source inspection checks exact floor/occupied reservations independently.
  const xs=prefer==='west'
    ? [...Array(mid-7).keys()].map(n=>n+4)
    : [...Array(w-mid-9).keys()].map(n=>mid+7+n);
  for(const x of xs)for(let z=s.north+2;z<d-s.dispatch-3;z++){
   if(!foot(x,z)||aisle(x,z)||has(x,2,z)||!has(x,1,z))continue;
   // Leave physical clearance from source walls/pier rows.
   if(![[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
   put('fixture',x,2,z,ref,{orientation:'north',state:{}});
   features.push({name:label,position:[x,2,z],assetRef:ref,active:false});return;
  }
  throw Error(s.name+' lacks clear sourced fixture bay '+label);
 }
 fixture(P.crate,'unpowered five-bay carpenter stock crate','west');
 fixture(P.plank,'unpowered measured-frame drawing table','east');
 const westNodes=lefts.map((t,i)=>({id:'west-finger-'+(i+1),x:t.edge+2,y:2,z:t.z+3,width:2,headroom:3}));
 const eastNodes=rights.map((t,i)=>({id:'east-finger-'+(i+1),x:t.edge-3,y:2,z:t.z+3,width:2,headroom:3}));
 const nodes=[
  {id:'entry',x:mid,y:2,z:d-3,width:2,headroom:3},
  {id:'dispatch',x:mid,y:2,z:d-7,width:2,headroom:3},
  {id:'finish-hall',x:mid,y:2,z:4,width:2,headroom:3},
  ...westNodes,...eastNodes];
 const b={id:slotId('carpenter',s.biome,s.size,5),type:'carpenter',biome:s.biome,size:s.size,variant:5,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:H,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-3,width:2,height:4,facing:'south'}],
  clearances:[
   {x:mid,y:2,z:3,width:2,height:3,depth:d-5},
   ...westNodes.map(n=>({x:n.x,y:2,z:n.z,width:mid-n.x+1,height:3,depth:2})),
   ...eastNodes.map(n=>({x:mid+1,y:2,z:n.z,width:n.x-mid+1,height:3,depth:2}))],
  spaces:[
   {id:'finish-hall',kind:'north-wide-beam-calibration-and-assembly',
    bounds:{x:3,y:2,z:2,width:w-6,height:11,depth:s.north-1},accessNode:'finish-hall'},
   {id:'dispatch',kind:'south-workpiece-outgoing-shelter',
    bounds:{x:mid-7,y:2,z:d-s.dispatch,width:16,height:9,depth:s.dispatch-2},accessNode:'dispatch'},
   ...westNodes.map((n,i)=>({id:n.id,kind:['raw-plank-saw-and-ripping','seasoned-lumber-spacing','full-truss-squaring'][i],
    bounds:{x:lefts[i].edge,y:2,z:lefts[i].z,width:mid-2-lefts[i].edge,height:8,depth:s.westDepths[i]},
    accessNode:n.id})),
   ...eastNodes.map((n,i)=>({id:n.id,kind:['large-tenon-and-cabinetry','fine-carved-joint-fitting'][i],
    bounds:{x:mid+5,y:2,z:rights[i].z,width:rights[i].edge-mid-4,height:8,depth:s.eastDepths[i]},
    accessNode:n.id}))],
  navigation:{entry:'entry',nodes,edges:[
   {from:'entry',to:'dispatch',kind:'level'},
   {from:'dispatch',to:'finish-hall',kind:'level'},
   ...westNodes.map(n=>({from:'finish-hall',to:n.id,kind:'level'})),
   ...eastNodes.map(n=>({from:'finish-hall',to:n.id,kind:'level'}))]},
  features,
  dependencies:[
   'Only real Pack1–5 source symbolic family names, never invented or registered numeric IDs',
   'Verify real producer fixture AABBs and physical support/reservation offsets independently',
   'Full roof engineering, climate, drainage, heat, craft mechanics and stock systems unapproved',
   'No production placement, builder inventory integration, save schema1 changes or iPhone approval'],
  architecture:{brief:s.name,originalProgramme:'five independent offset timber-work fingers off a covered assembly gallery',
   fiveDistinctWorkFingers:5,actualWestFingerStart:s.westBegin,actualEastFingerStart:s.eastBegin,
   sourceDepths:[...s.westDepths,...s.eastDepths],roofMorphology:s.roof,
   separateRoofMasses:7,rooms:7,uncoveredExteriorWorkGaps:true,
   sourceOnly:true,structuralLoadApproved:false,weatherApproved:false,creatorApproved:false}
 };
 validateBlueprint(b);return b;
}
export function createM3CarpenterFifthVariant(biome,size){
 if(!BIOMES.includes(biome)||!SIZES.includes(size))throw RangeError('No authorized fifth carpenter slot');
 const s=M3_CARPENTER_FIFTH_SPECS.find(q=>q.biome===biome&&q.size===size);
 if(!s)throw RangeError('Carpenter fifth source missing biome/size');
 return build(s);
}
export function createM3CarpenterFifthPool(){return M3_CARPENTER_FIFTH_SPECS.map(build);}
