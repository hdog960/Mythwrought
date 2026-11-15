// Builder 3A M1: four NEW, individually authored physical-coordinate workshop exemplars.
// These are independent theoretical structures, not generated world terrain or crafting machines.
import {slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';

const C=Object.freeze({
 stone:'pack1:002',slab:'pack1:007',pillar:'pack1:010',
 plank:'pack2:013',beam:'pack2:015',shingles:'pack3:023',
 slate:'pack3:025',brick:'pack5:080',anvil:'pack5:088',
 crate:'pack4:057'
});
const defs=Object.freeze({
 armorer:{w:18,d:19,h:14,roof:'stepped-gable',theme:'metalwork',roomFront:'fitting-gallery',roomBack:'armor-shaping'},
 carpenter:{w:20,d:21,h:15,roof:'lean-to-saw-shed',theme:'joinery',roomFront:'open-assembly',roomBack:'timber-storage'},
 stonemason:{w:22,d:24,h:15,roof:'covered-carving-court',theme:'stonecutting',roomFront:'open-block-yard',roomBack:'carving-workroom'},
 'mining-workshop':{w:21,d:24,h:17,roof:'reinforced-ore-sorting-bays',theme:'ore-handling',roomFront:'loading-bay',roomBack:'dry-sorting-room'}
});
function make(type) {
 const q=defs[type];
 if(!q)throw RangeError('M1 only contains four distinct workshop exemplars');
 const {w,d,h}=q,x0=Math.floor(w/2)-1;
 const modules=new Map(),occupied=new Map();
 function put(role,x,y,z,asset){
  if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||!Number.isSafeInteger(z)||
     x<0||y<0||z<0||x>=w||y>=h||z>=d)throw RangeError('building placement out of envelope');
  const key=[x,y,z].join(',');
  if(occupied.has(key))throw Error('Duplicate physical placement '+key);
  occupied.set(key,asset);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push([x,y,z,asset]);
 }
 function open(x,y,z){
  // A two-cell-wide, three-high actual south doorway. Side windows are open air.
  if(z===d-1&&x>=x0&&x<x0+2&&y>=2&&y<=4)return true;
  if(y>=4&&y<=5&&((x===0&&z>=4&&z<=6)||(x===w-1&&z>=d-7&&z<=d-5)))return true;
  if(type==='carpenter'&&x===w-1&&z>=4&&z<=d-9&&y>=2&&y<=4)return true;
  if(type==='stonemason'&&z===d-1&&x>=w-6&&y>=2&&y<=5)return true;
  if(type==='mining-workshop'&&z===d-1&&x<=4&&y>=2&&y<=5)return true;
  return false;
 }
 const west=type==='carpenter'?C.plank:type==='stonemason'?C.stone:C.stone;
 const deck=type==='armorer'||type==='mining-workshop'?C.slab:C.plank;
 // Every occupied foundation and deck coordinate is physically authored.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   put('foundation',x,0,z,C.stone);
   put('floor',x,1,z,deck);
 }
 for(let y=2;y<=7;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   const perimeter=x===0||x===w-1||z===0||z===d-1;
   if(!perimeter||open(x,y,z))continue;
   const trim=z===d-1&&(x===x0-1||x===x0+2)&&y<=6;
   put(trim?'entry-frame':'wall',x,y,z,trim?C.pillar:west);
 }
 // Distinct roof and floor plans: not palette/rotation variants.
 function roofHeight(x,z){
  if(type==='armorer')return 8+Math.min(3,Math.floor(Math.min(x,w-1-x)/3));
  if(type==='carpenter')return 8+Math.floor((w-1-x)/7);
  if(type==='stonemason')return 8+Math.min(2,Math.floor(Math.min(x,12-x)/4));
  return 9+(z>=d-8?1:0);
 }
 const roofLimit=type==='stonemason'?13:w;
 for(let x=0;x<roofLimit;x++)for(let z=0;z<d;z++){
  // Mining loading stripe is left uncovered for lifting and daylight.
  if(type==='mining-workshop'&&x>=w-7&&x<w-4&&z>=d-10&&z<d-3)continue;
  put('roof',x,roofHeight(x,z),z,type==='armorer'||type==='stonemason'?C.slate:C.shingles);
 }
 // Rafter-bearing physical coordinates below the roof at regular spacing.
 for(let z=2;z<d-2;z+=4)for(let x=1;x<roofLimit-1;x++){
  const y=roofHeight(x,z)-1;
  if(!occupied.has([x,y,z].join(',')))put('rafter',x,y,z,C.beam);
 }
 const divZ=type==='armorer'?9:type==='mining-workshop'?10:null;
 if(divZ!==null)for(let x=1;x<w-1;x++){
  if(x>=x0&&x<=x0+1)continue;
  for(let y=2;y<=5;y++)put('partition',x,y,divZ,type==='armorer'?C.plank:C.stone);
 }
 // Independent, physically authored category-specific structures and stations.
 const stations=[],features=[];
 function station(name,x,z,asset,unresolvedDependency){
  put('fixture',x,2,z,asset);
  stations.push({name,position:[x,2,z],assetRef:asset,
    unresolvedDependency:unresolvedDependency??null,active:false});
 }
 if(type==='armorer'){
  for(const z of [4,6,12,14])for(let y=2;y<=4;y++)put('rack-post',w-3,y,z,C.beam);
  for(const z of [6,12])for(let x=2;x<=4;x++)put('bench-support',x,2,z,C.plank);
  station('non-operating shaping anvil',3,4,C.anvil,'Resolve physical Pack 5 authored fixture variant and occupied offsets');
  station('display mannequin pedestal',w-5,6,C.pillar,'Armour mannequin is a conceptual fixture, not an NPC');
 }else if(type==='carpenter'){
  for(const z of [4,8,12,16])for(let y=2;y<=6;y++)put('lumber-rack',2,y,z,C.beam);
  for(let z=4;z<=d-5;z+=4)for(let y=2;y<=4;y++)put('timber-pier',w-3,y,z,C.beam);
  station('non-operating joinery bench',w-5,7,C.plank,'Saw/woodworking gameplay not implemented');
  station('wood stock',4,5,C.beam,'Length and attachment of non-cubic long timber unresolved');
 }else if(type==='stonemason'){
  for(const z of [4,9,14,19])for(let y=2;y<=5;y++)put('open-yard-pier',14,y,z,C.pillar);
  for(let x=16;x<=19;x++)for(let z=3;z<=5;z++)put('rough-block-stock',x,2,z,C.stone);
  station('non-operating carving table',3,7,C.slab,'Tool interaction and slab orientation pending');
  station('unfinished stone column',17,12,C.pillar,'Physical collision and load support require approval');
 }else{
  for(const z of [4,8,14,19])for(let y=2;y<=6;y++)put('ore-sort-pier',2,y,z,C.pillar);
  for(let x=w-6;x<=w-4;x++)for(let z=4;z<=6;z++)put('stone-stock',x,2,z,C.stone);
  station('dry-sorting crate',w-4,14,C.crate,'Ore handling and persistent container state not active');
  station('support pier',4,17,C.pillar,'Mine/tunnel or drill machinery not authored');
 }
 const entry={kind:'entrance',facing:'south',x:x0,y:2,z:d-1,width:2,height:3};
 const nodes=[
  {id:'entry',x:x0,y:2,z:d-1,width:2,headroom:2},
  {id:'front',x:x0,y:2,z:d-6,width:2,headroom:2},
  {id:'back',x:x0,y:2,z:4,width:2,headroom:2}
 ];
 const clearances=[
  {x:x0,y:2,z:2,width:2,height:3,depth:d-2}
 ];
 const spaces=[
  {id:'front-bay',kind:q.roomFront,
    bounds:{x:1,y:2,z:d-9,width:w-2,height:4,depth:8},accessNode:'front'},
  {id:'back-bay',kind:q.roomBack,
    bounds:{x:1,y:2,z:2,width:w-2,height:4,depth:d-12},accessNode:'back'}
 ];
 const b={id:slotId(type,'temperate','small',1),type,biome:'temperate',size:'small',variant:1,
  status:'theoretical',activated:false,worldPlaced:false,
  envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[entry],clearances,spaces,
  navigation:{entry:'entry',nodes,edges:[
    {from:'entry',to:'front',kind:'level'},{from:'front',to:'back',kind:'level'}]},
  features:stations,dependencies:[
    'source-authentic manual Pack 1-5 family variant/orientation/support verification required',
    'unresolved live runtime collision and final production building-height limits',
    'No powered tools, crafting, harvesting, functional machinery, mining tunnels or saves'
  ],
  architecture:{workshopType:q.theme,roofStyle:q.roof,coveredWorkBay:type!=='stonemason',
   exteriorOpenYard:type==='stonemason',openEquipmentAtrium:type==='mining-workshop',
   forgeOperational:false,candidateOnly:true,structuralLoadApproved:false}
 };
 validateBlueprint(b);
 return b;
}
export const M1_ORIGINAL_TYPES=Object.freeze(Object.keys(defs));
export function createM1OriginalWorkshop(type){return make(type);}
export function createM1OriginalWorkshopPool(){return M1_ORIGINAL_TYPES.map(make);}
