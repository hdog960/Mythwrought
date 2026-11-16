/**
 * Builder 3A M3: 30 independently specified carpenter/stonemason variant-3
 * SOURCE blueprints. H- and staggered-cross workcourt circulation is materially
 * different from the prior long-nave/L-wing second-variant architecture.
 * Unpowered, unapproved, unplaced; no runtime, save or block-registration edit.
 */
import {slotId,BIOMES,SIZES} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const P=Object.freeze({stone:'pack1:002',slab:'pack1:007',pillar:'pack1:010',
 plank:'pack2:013',timber:'pack2:015',tile:'pack3:023',slate:'pack3:025',
 crate:'pack4:057'});
// type|biome|size|original brief|W|D|westBegin|westEnd|eastBegin|eastEnd|
// westNotchOffset|eastNotchOffset|roofPlan|workBays|postStride|courtBegin|courtEnd
// Distinct dimensions, room adjacencies, shaped returns, roof planes and bays.
const PLANS=[
'carpenter|temperate|small|millbrook-offset-truss-yard|30|32|4|24|10|29|7|8|cross-truss|3|5|16|24',
'carpenter|temperate|medium|canal-joiner-threehall|37|40|6|34|5|30|9|10|twin-clerestory|4|6|19|31',
'carpenter|temperate|large|gilded-woodwright-courts|47|47|5|40|11|44|10|9|stepped-loggia|5|7|24|37',
'carpenter|desert|small|shade-frame-open-sawcourt|31|33|6|27|9|30|8|7|sun-butterfly|3|5|17|25',
'carpenter|desert|medium|oasis-pergola-framing-guild|38|41|5|36|12|38|10|8|vent-sawtooth|4|6|20|32',
'carpenter|desert|large|sandport-cabinetry-courtyard|48|48|8|43|9|45|11|10|terraced-vent|5|7|25|38',
'carpenter|snow|small|cold-cedar-joinery-cross|32|34|4|29|11|32|7|9|winter-cross-gable|3|5|17|26',
'carpenter|snow|medium|frostwood-drying-galleries|39|42|7|37|8|39|8|10|double-gambrel|4|7|22|33',
'carpenter|snow|large|fircrest-high-roof-timber-yard|49|49|6|44|12|46|10|11|loft-snow-ridge|5|8|26|39',
'carpenter|enchanted-forest|small|fernbranch-circular-joinery|33|35|5|30|10|33|8|9|forest-offset-hip|3|5|18|27',
'carpenter|enchanted-forest|medium|moonbeam-carpenter-atelier|40|43|8|39|9|40|9|8|lantern-crest|4|7|23|34',
'carpenter|enchanted-forest|large|elderbranch-open-roof-framing|50|50|7|46|13|48|11|9|triple-canopy|5|8|27|40',
'carpenter|mountain|small|ridgeline-handrail-mill|34|36|6|33|12|34|9|10|cliff-stepped-gable|3|6|19|28',
'carpenter|mountain|medium|granite-terrace-woodwork|41|44|7|40|10|42|10|9|cantilever-shed|4|7|23|35',
'carpenter|mountain|large|highpass-bridgewright-court|51|51|8|48|14|49|12|11|mountain-ridged-truss|5|8|28|41',
'stonemason|temperate|small|stream-ashlar-dressing-yard|30|33|5|27|12|31|9|8|low-stone-vault|3|5|17|26',
'stonemason|temperate|medium|civic-pier-sculptors-cross|38|40|7|36|9|38|10|9|civic-cross-vault|4|6|21|32',
'stonemason|temperate|large|old-bridge-monument-workers|48|48|6|44|14|46|11|10|columned-hip-hall|5|8|25|38',
'stonemason|desert|small|sandstone-arch-carvers-court|31|34|6|29|11|32|8|9|sandstone-butterfly|3|5|18|27',
'stonemason|desert|medium|terrace-stonecutters-cloister|39|41|8|38|10|39|11|10|flat-mason-terraces|4|7|22|33',
'stonemason|desert|large|oasis-column-cutters-forum|49|49|7|46|15|47|12|8|desert-vaulted-aisles|5|8|26|39',
'stonemason|snow|small|firgranite-cold-chisel-guild|32|35|4|31|12|33|9|8|snow-step-vault|3|6|19|28',
'stonemason|snow|medium|frost-cornice-carving-house|40|42|8|39|11|40|10|10|high-snow-arcade|4|7|23|34',
'stonemason|snow|large|winter-quoin-mason-college|50|50|8|47|13|48|11|9|gambrel-stone-bay|5|8|27|41',
'stonemason|enchanted-forest|small|lumenstone-garden-carvers|33|36|6|33|13|34|10|9|enchanted-colonnade|3|6|20|29',
'stonemason|enchanted-forest|medium|moss-arch-blockcutters|41|43|9|40|12|41|11|8|rune-light-vault|4|7|24|35',
'stonemason|enchanted-forest|large|moonquartz-great-carvers-forum|51|51|7|48|15|49|12|10|timbered-stone-arcade|5|9|29|42',
'stonemason|mountain|small|crag-stone-slaters-court|34|37|7|34|13|35|9|10|cliff-stone-step|3|6|20|30',
'stonemason|mountain|medium|highspur-quarry-column-yard|42|44|8|41|11|42|11|9|ridge-pier-arcade|4|8|24|36',
'stonemason|mountain|large|summit-master-quoin-hall|52|52|9|49|16|50|13|11|stone-sawtooth-roof|5|9|29|43'
];
const KEYS=['type','biome','size','name','width','depth','westBegin','westEnd',
 'eastBegin','eastEnd','westNotch','eastNotch','roofPlan','workBays','postStride',
 'courtBegin','courtEnd'];
export const M3_CRAFT_THIRD_SPECS=Object.freeze(PLANS.map(line=>{
 const a=line.split('|');if(a.length!==KEYS.length)throw Error('M3 third-variant source brief incomplete: '+line);
 return Object.freeze(Object.fromEntries(KEYS.map((k,i)=>[k,[4,5,6,7,8,9,10,11,13,14,15,16].includes(i)?Number(a[i]):a[i]])));
}));
if(M3_CRAFT_THIRD_SPECS.length!==30)throw Error('Exactly 30 source-authored craft third variants');

function build(q){
 const w=q.width,d=q.depth,h=30,wood=q.type==='carpenter';
 const mid=Math.floor(w/2)-1,westEndX=mid-6,eastBeginX=mid+7;
 const slots=new Map(),byRole=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z,has=(x,y,z)=>slots.has(key(x,y,z));
 function put(role,x,y,z,material,attachment=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||y<0||z<0||x>=w||y>=h||z>=d)
   throw Error(q.name+' out-of-envelope sourced coordinate '+key(x,y,z));
  if(has(x,y,z))throw Error(q.name+' overlapping voxel '+key(x,y,z)+' with '+slots.get(key(x,y,z)));
  slots.set(key(x,y,z),role);
  if(!byRole.has(role))byRole.set(role,[]);
  byRole.get(role).push(attachment===null?[x,y,z,material]:[x,y,z,material,Object.freeze(attachment)]);
 }
 const westRouteZ=q.westBegin+2,eastRouteZ=q.eastBegin+2;
 // The west/east transverse wings connect across a narrow, very tall central
 // axis. Difference from prior 2nd-variant: H/offset-cross geometry, narrow
 // column-spine, opposite staggered wings, deep real cut-out bays and roofed
 // carriage section (not one large long rectangle with shallow side wings).
 function zone(x,z){
  if(x<0||x>=w||z<0||z>=d)return null;
  if(x>=mid-5&&x<=mid+6)return 'hall';
  if(x>=1&&x<=westEndX&&z>=q.westBegin&&z<=q.westEnd){
   if(x>=1&&x<=3&&z>=q.westBegin+q.westNotch&&z<q.westBegin+q.westNotch+6)return null;
   return 'timber-wing';
  }
  if(x>=eastBeginX&&x<=w-2&&z>=q.eastBegin&&z<=q.eastEnd){
   if(x>=w-4&&x<=w-2&&z>=q.eastBegin+q.eastNotch&&z<q.eastBegin+q.eastNotch+7)return null;
   return 'carving-wing';
  }
  return null;
 }
 const foot=(x,z)=>zone(x,z)!==null;
 const aisle=(x,z)=>x>=mid&&x<mid+2||
  (z===westRouteZ||z===westRouteZ+1)&&x>=4&&x<=mid||
  (z===eastRouteZ||z===eastRouteZ+1)&&x>=mid+1&&x<=w-5;
 // Real open-to-sky loading yard sits in the east return, unroofed but with
 // walkable source floor and surrounding parapet. Loading remains conceptual.
 const court=(x,z)=>zone(x,z)==='carving-wing'&&x>=eastBeginX+2&&x<=w-5&&
  z>=q.courtBegin&&z<=q.courtEnd;
 function roofY(x,z){
  const p=zone(x,z);
  if(p==='timber-wing')return 10+Math.min(3,Math.floor((z-q.westBegin)/9));
  if(p==='carving-wing')return 11+Math.min(3,Math.floor((q.eastEnd-z)/10));
  const a=Math.min(x-(mid-5),(mid+6)-x),north=Math.min(z,d-1-z);
  switch(q.roofPlan){
   case 'cross-truss':return 17+Math.min(5,Math.floor(a/2))+(z%13<3?1:0);
   case 'twin-clerestory':return 18+Math.floor(a/3)+(z>=d*.31&&z<d*.54?2:0);
   case 'stepped-loggia':return 17+Math.floor(z/11)+Math.floor(a/4);
   case 'sun-butterfly':return 17+Math.floor(Math.abs(x-(mid+.5))/3)+Math.floor(z/20);
   case 'vent-sawtooth':return 17+Math.floor(z/7)%4+Math.floor(a/5);
   case 'terraced-vent':return 17+Math.floor(z/12)+Math.floor(a/4);
   case 'winter-cross-gable':return 18+Math.min(5,Math.floor(a/2));
   case 'double-gambrel':return 18+Math.min(5,Math.floor(a/2))+(z%15<4?1:0);
   case 'loft-snow-ridge':return 18+Math.min(6,Math.floor(a/2))+(z%16<4?1:0);
   case 'forest-offset-hip':return 17+Math.min(5,Math.floor(Math.min(a,north)/2));
   case 'lantern-crest':return 18+Math.min(5,Math.floor((a+z%8)/3));
   case 'triple-canopy':return 17+Math.min(4,Math.floor(a/2))+(Math.floor(z/10)%3);
   case 'cliff-stepped-gable':return 17+Math.floor(z/10)+Math.floor(a/4);
   case 'cantilever-shed':return 17+Math.floor(z/12)+Math.floor(a/3);
   case 'mountain-ridged-truss':return 18+Math.floor(z/12)+Math.floor(a/3);
   case 'low-stone-vault':return 17+Math.min(5,Math.floor(a/2));
   case 'civic-cross-vault':return 17+Math.min(5,Math.floor(Math.min(a,north)/2));
   case 'columned-hip-hall':return 17+Math.min(5,Math.floor(a/2))+Math.floor(z/17);
   case 'sandstone-butterfly':return 17+Math.floor(Math.abs(x-mid)/3);
   case 'flat-mason-terraces':return 17+Math.floor(z/10)+Math.floor(a/5);
   case 'desert-vaulted-aisles':return 17+Math.floor(z/12)+Math.floor(a/3);
   case 'snow-step-vault':return 18+Math.floor(z/10)+Math.floor(a/4);
   case 'high-snow-arcade':return 18+Math.min(5,Math.floor(a/2))+(z%11<4?1:0);
   case 'gambrel-stone-bay':return 18+Math.min(5,Math.floor(a/2));
   case 'enchanted-colonnade':return 17+Math.min(4,Math.floor((a+z%7)/3));
   case 'rune-light-vault':return 18+Math.min(5,Math.floor((a+z%8)/3));
   case 'timbered-stone-arcade':return 17+Math.min(5,Math.floor((a+z%12)/4));
   case 'cliff-stone-step':return 17+Math.floor(z/10)+Math.floor(a/5);
   case 'ridge-pier-arcade':return 18+Math.floor(z/10)+Math.floor(a/4);
   case 'stone-sawtooth-roof':return 17+Math.floor(z/7)%4+Math.floor(a/5);
   default:throw Error('Missing original M3 roof '+q.roofPlan);
  }
 }
 const opening=(x,y,z)=>{
  if(z===d-1&&x>=mid&&x<mid+2&&y>=2&&y<=5)return true;
  if(x===1&&z>=q.westEnd-5&&z<=q.westEnd-3&&y>=2&&y<=5)return true;
  if(x===w-2&&z>=q.eastEnd-5&&z<=q.eastEnd-3&&y>=2&&y<=5)return true;
  if((x===mid-5||x===mid+6)&&z>=Math.floor(d*.38)&&z<Math.floor(d*.38)+4&&y>=5&&y<=7)return true;
  return false;
 };
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  put('foundation',x,0,z,P.stone);put('floor',x,1,z,wood?P.plank:P.slab);
 }
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  if(foot(x-1,z)&&foot(x+1,z)&&foot(x,z-1)&&foot(x,z+1))continue;
  const top=zone(x,z)==='hall'?13:8;
  for(let y=2;y<=top;y++)if(!opening(x,y,z))
   put('wall',x,y,z,wood?P.plank:P.stone);
 }
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)&&!court(x,z)){
  put('roof',x,roofY(x,z),z,q.biome==='snow'||q.biome==='mountain'?P.slate:P.tile);
 }
 for(let z=2;z<d-2;z++){
  if(z%3===0)for(let x=2;x<w-2;x++)if(foot(x,z)&&!court(x,z)){
   const y=roofY(x,z)-1;
   if(!has(x,y,z))put('roof-purlin',x,y,z,P.timber);
  }
  if(z%q.postStride!==0)continue;
  for(const x of [5,mid-4,mid+5,w-6]){
   if(!foot(x,z)||aisle(x,z)||court(x,z))continue;
   const top=roofY(x,z)-1;
   for(let y=2;y<top;y++)if(!has(x,y,z))
    put('bearing-pier',x,y,z,wood?P.timber:P.pillar);
  }
 }
 // Divided nave with genuinely source-clear 2-wide partition opening.
 const partitionZ=Math.floor(d*.54);
 for(let x=mid-4;x<=mid+5;x++)if(!aisle(x,partitionZ))
  for(let y=2;y<=7;y++)if(!has(x,y,partitionZ))
   put('workflow-divider',x,y,partitionZ,wood?P.plank:P.stone);
 // Work-specific non-powered stations, not invented machines.
 for(let z=q.westBegin+7;z<=q.westEnd-4;z+=q.postStride){
  const x=Math.min(westEndX-2,mid-8);
  if(!foot(x,z)||aisle(x,z))continue;
  for(let y=2;y<=4;y++)if(!has(x,y,z))
   put(wood?'angled-seasoning-rack':'sculptural-column-block',x,y,z,wood?P.timber:P.pillar);
 }
 for(let z=q.eastBegin+7;z<=q.eastEnd-4;z+=q.postStride){
  const x=Math.max(eastBeginX+2,w-8);
  if(!foot(x,z)||aisle(x,z)||court(x,z))continue;
  if(!has(x,2,z))
   put(wood?'mortise-joinery-station':'sculpture-dressing-plinth',x,2,z,wood?P.plank:P.slab);
 }
 for(let n=0;n<q.workBays;n++){
  const x=mid-4+(n%2)*8,z=6+n*3;
  if(!foot(x,z)||aisle(x,z)||has(x,2,z))continue;
  put(wood?'framing-bench-support':'rough-stone-plinth',x,2,z,wood?P.timber:P.slab);
 }
 // One actually producer-typed stock crate, mounted on a source floor cell
 // in an unobstructed part of the east wing (not beside structural piers).
 const boxX=w-6;
 let boxZ=q.eastEnd-3;
 if(boxZ%q.postStride===0)boxZ--;
 if(!foot(boxX,boxZ)||aisle(boxX,boxZ)||has(boxX,2,boxZ))
  throw Error(q.name+' source stock crate obstructed '+key(boxX,2,boxZ));
 put('fixture',boxX,2,boxZ,P.crate,{orientation:'north',state:{}});
 features.push({name:wood?'dry timber stock chest':'cold rough-cut stone stock bin',position:[boxX,2,boxZ],assetRef:P.crate,active:false});
 const otherX=mid-4,otherZ=d-7;
 if(!foot(otherX,otherZ)||aisle(otherX,otherZ)||has(otherX,2,otherZ))
  throw Error(q.name+' grounded workbench blocked '+key(otherX,2,otherZ));
 put('fixture',otherX,2,otherZ,wood?P.plank:P.slab,{orientation:'north'});
 features.push({name:wood?'unpowered carpenter layout table':'unpowered mason measured-block table',position:[otherX,2,otherZ],assetRef:wood?P.plank:P.slab,active:false});
 const nodes=[
  {id:'entry',x:mid,y:2,z:d-1,width:2,headroom:3},
  {id:'main-work',x:mid,y:2,z:d-8,width:2,headroom:3},
  {id:'material-staging',x:mid,y:2,z:3,width:2,headroom:3},
  {id:'west-trade-wing',x:5,y:2,z:westRouteZ,width:2,headroom:3},
  {id:'east-court',x:w-6,y:2,z:eastRouteZ,width:2,headroom:3}
 ];
 const b={id:slotId(q.type,q.biome,q.size,3),type:q.type,biome:q.biome,size:q.size,variant:3,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
  modules:[...byRole].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-1,width:2,height:4,facing:'south'}],
  clearances:[{x:mid,y:2,z:2,width:2,height:3,depth:d-2},
   {x:4,y:2,z:westRouteZ,width:mid-3,height:3,depth:2},
   {x:mid+1,y:2,z:eastRouteZ,width:w-mid-5,height:3,depth:2}],
  spaces:[
   {id:'main-work',kind:wood?'full-frame-truss-and-hand-joinery':'dry-arch-and-cornice-shaping',
    bounds:{x:mid-5,y:2,z:d-14,width:12,height:7,depth:12},accessNode:'main-work'},
   {id:'material-staging',kind:wood?'separate-lumber-sorting':'separate-cut-block-grading',
    bounds:{x:mid-5,y:2,z:2,width:12,height:7,depth:Math.floor(d*.43)},accessNode:'material-staging'},
   {id:'west-trade-wing',kind:wood?'transverse-timber-seasoning-pavilion':'column-shaping-transverse-workshop',
    bounds:{x:1,y:2,z:q.westBegin,width:westEndX,height:7,depth:q.westEnd-q.westBegin+1},accessNode:'west-trade-wing'},
   {id:'east-court',kind:wood?'cross-wing-covered-joinery-plus-open-lumbercourt':'cross-wing-reinforced-vault-plus-rough-block-court',
    bounds:{x:eastBeginX,y:2,z:q.eastBegin,width:w-1-eastBeginX,height:7,depth:q.eastEnd-q.eastBegin+1},accessNode:'east-court'}],
  navigation:{entry:'entry',nodes,edges:[
   {from:'entry',to:'main-work',kind:'level'},
   {from:'main-work',to:'material-staging',kind:'level'},
   {from:'material-staging',to:'west-trade-wing',kind:'level'},
   {from:'main-work',to:'east-court',kind:'level'}]},
  features,
  dependencies:[
   'Pack 1-5 producer-selected exact AABB collision and fixture supports require independent audit',
   'Actual roof bearing, engineering span, open-air drainage and thermal safety not approved',
   'Timber joinery and stone cutting fixtures do not operate and do not produce resources',
   'No save schema, runtime block IDs, world placement, art acceptance, physical iPhone tests or automation changes'],
  architecture:{brief:q.name,originalProgramme:wood?'transverse framing/seasoning wing and elevated 12-wide joinery nave':
   'transverse sculptor/column workcourt and elevated 12-wide stone dressing nave',
   separateRoofVolumes:3,centralNaveWidth:12,transverseWingStarts:[q.westBegin,q.eastBegin],
   sourceWestReturnNotch:q.westNotch,sourceEastReturnNotch:q.eastNotch,
   actuallyOpenEastCourtyard:[q.courtBegin,q.courtEnd],
   roofMorphology:q.roofPlan,authoredTradeBays:q.workBays,sourceSupportSpacing:q.postStride,
   realSeparateWorkRooms:4,sourceOnly:true,structuralLoadApproved:false,
   weatherApproved:false,creatorApproved:false}};
 validateBlueprint(b);
 return b;
}
export function createM3CraftThirdVariant(type,biome,size){
 if(!['carpenter','stonemason'].includes(type)||!BIOMES.includes(biome)||!SIZES.includes(size))
  throw RangeError('No M3 third-variant architecture outside exclusive craft categories');
 const q=M3_CRAFT_THIRD_SPECS.find(s=>s.type===type&&s.biome===biome&&s.size===size);
 if(!q)throw RangeError('No third-variant spatial programme authored for slot');
 return build(q);
}
export function createM3CraftThirdPool(){return M3_CRAFT_THIRD_SPECS.map(build);}
