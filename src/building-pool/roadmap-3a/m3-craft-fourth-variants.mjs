/**
 * Builder 3A M3: thirty ORIGINAL fourth-variant carpenter and stonemason
 * source-coordinate architecture candidates (5 biomes x 3 sizes x 2 trades).
 *
 * Unlike the variant-2 long nave or variant-3 H-crosshall, these are
 * deliberately hollow PERIMETER COURT / broken-U plans: a full transverse
 * rear workshop, unequally long side shops, a south-front sales gallery,
 * a genuinely unroofed longitudinal yard path and cross-court carriageway.
 * Physical-source only. No block registration, runtime, saves, or placement.
 */
import {BIOMES,SIZES,slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';

const M=Object.freeze({
 stone:'pack1:002',slab:'pack1:007',column:'pack1:010',
 plank:'pack2:013',beam:'pack2:015',roof:'pack3:023',
 slate:'pack3:025',crate:'pack4:057'
});
// category|biome|size|unique site programme|width|depth|westWing|eastWing|
// northHall|southGallery|eastShort|crossCourtZ|notchZ|pierStride|roofProfile
const SOURCE=[
'carpenter|temperate|small|briarbank-wheelwright-open-yard|34|36|9|9|7|8|8|16|12|5|cross-gable',
'carpenter|temperate|medium|willowport-furniture-walled-court|41|43|10|11|8|9|10|20|15|6|broken-saw',
'carpenter|temperate|large|river-raft-framewright-compound|49|51|12|10|9|10|12|23|19|7|triple-hip',
'carpenter|desert|small|sunken-shade-joiner-hollow|35|37|10|9|7|7|9|17|14|5|wind-terrace',
'carpenter|desert|medium|sandquay-arched-timber-court|42|44|11|10|8|8|10|21|17|6|vented-butterfly',
'carpenter|desert|large|oasis-drywright-staggered-lanai|50|52|12|11|9|10|12|25|20|7|sunrise-saw',
'carpenter|snow|small|frostpine-high-frame-yard|36|38|9|10|8|8|9|18|14|5|snow-gambrel',
'carpenter|snow|medium|whitecedar-long-stock-quadrangle|43|45|11|11|9|9|11|22|18|6|double-ridge',
'carpenter|snow|large|glacier-bridgewright-stave-court|51|53|13|12|10|11|13|26|21|8|snow-horn',
'carpenter|enchanted-forest|small|fernring-branch-lathe-court|37|39|10|10|7|8|9|18|16|5|canopy-fold',
'carpenter|enchanted-forest|medium|moonbark-spiral-beam-atelier|44|46|12|10|9|9|12|23|19|6|lantern-hip',
'carpenter|enchanted-forest|large|heartroot-wood-cantilever-yard|52|54|13|12|10|10|12|27|23|8|tree-terrace',
'carpenter|mountain|small|cragpass-stave-and-cart-court|38|40|10|11|8|8|10|19|15|5|cliff-shed',
'carpenter|mountain|medium|stonepass-bridgewrights-square|45|47|12|11|9|10|11|23|20|7|ridge-terrace',
'carpenter|mountain|large|skybridge-joinery-fortified-yard|53|55|10|15|11|8|16|24|19|8|high-saw',
'stonemason|temperate|small|creek-ashlar-curved-yard|35|38|10|9|8|8|9|17|14|5|round-vault',
'stonemason|temperate|medium|guild-quarter-archcutters-court|42|45|11|10|9|9|11|22|18|6|column-hip',
'stonemason|temperate|large|bridgegate-master-keystone-forum|50|53|12|12|10|10|12|25|21|8|stepped-vault',
'stonemason|desert|small|dune-chisel-open-stone-loggia|36|39|9|11|7|8|9|18|15|5|sun-arcade',
'stonemason|desert|medium|sandstone-quoin-walled-court|43|46|12|10|8|9|11|22|19|7|flat-mason',
'stonemason|desert|large|sunspire-capstone-cutters-forum|51|54|13|12|9|11|13|26|22|8|terrace-vault',
'stonemason|snow|small|icequoin-lime-free-court|37|40|10|10|8|9|10|19|16|5|snow-column',
'stonemason|snow|medium|frost-hall-corbel-yard|44|47|12|11|9|9|11|23|20|7|frozen-vault',
'stonemason|snow|large|whitepeak-cornice-mason-forum|52|55|13|13|10|11|13|27|23|8|winter-buttress',
'stonemason|enchanted-forest|small|glowmoss-masonry-ringcourt|38|41|10|11|8|8|10|20|17|6|moss-arcade',
'stonemason|enchanted-forest|medium|lumen-arch-atelier-courtyard|45|48|11|12|9|10|12|24|20|7|moonlight-hip',
'stonemason|enchanted-forest|large|rune-quartz-colonnade-basin|53|56|14|12|10|11|13|28|23|8|tall-lantern',
'stonemason|mountain|small|granite-cairn-dressing-quadrangle|39|42|11|10|8|9|10|20|17|6|crag-shed',
'stonemason|mountain|medium|highridge-piercutters-terrace|46|49|12|12|9|10|12|24|21|7|canyon-step',
'stonemason|mountain|large|summit-quarry-capital-works|54|57|14|13|10|11|14|28|24|9|stone-sawtooth'
];
const FIELDS=['type','biome','size','name','width','depth','west','east','north','south','short','cross','notch','stride','roof'];
export const M3_CRAFT_FOURTH_SPECS=Object.freeze(SOURCE.map(line=>{
 const vals=line.split('|');
 if(vals.length!==FIELDS.length)throw Error('Malformed original M3 fourth-variant source '+line);
 return Object.freeze(Object.fromEntries(FIELDS.map((k,i)=>[k,i>=4&&i<=13?Number(vals[i]):vals[i]])));
}));
if(M3_CRAFT_FOURTH_SPECS.length!==30||
 new Set(M3_CRAFT_FOURTH_SPECS.map(s=>s.name)).size!==30)
 throw Error('Builder 3A M3 fourth-variant brief census mismatch');

function build(s){
 const w=s.width,d=s.depth,H=32,wood=s.type==='carpenter';
 const mid=Math.floor(w/2)-1,leftEnd=s.west+1,rightStart=w-s.east-2,
       northEnd=s.north+1,eastEnd=d-s.short-1,southStart=d-s.south,
       all=new Map(),roles=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z;
 const has=(x,y,z)=>all.has(key(x,y,z));
 function put(role,x,y,z,ref,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=H||z<0||z>=d)
   throw Error(s.name+' source voxel outside envelope '+key(x,y,z));
  if(has(x,y,z))throw Error(s.name+' colliding source voxels '+key(x,y,z)+' '+all.get(key(x,y,z)));
  all.set(key(x,y,z),role);
  if(!roles.has(role))roles.set(role,[]);
  roles.get(role).push(meta===null?[x,y,z,ref]:[x,y,z,ref,Object.freeze(meta)]);
 }
 function zone(x,z){
  if(x<2||x>w-3||z<2||z>d-3)return null;
  if(z<=northEnd)return 'north-transverse-guildhall';
  if(x<=leftEnd){
   if(x<=3&&z>=s.notch&&z<s.notch+6)return null;
   return 'west-material-shop';
  }
  if(x>=rightStart&&z<=eastEnd){
   if(x>=w-5&&z>=s.notch+3&&z<s.notch+9)return null;
   return 'east-trade-shop';
  }
  if(z>=southStart&&x<=mid+3)return 'south-market-gallery';
  if(x>=mid&&x<mid+2)return 'open-yard-spine';
  if(z>=s.cross&&z<s.cross+2&&x>=leftEnd&&x<=rightStart+3)return 'open-cross-court';
  return null;
 }
 const hasFloor=(x,z)=>zone(x,z)!==null;
 const roofed=(x,z)=>!!zone(x,z)&&!zone(x,z).startsWith('open-');
 const clearAisle=(x,z)=>
  (x>=mid&&x<mid+2)||
  (z===3||z===4)&&x>=3&&x<w-3||
  (x>=s.west-2&&x<=s.west-1&&z>=3&&z<d-3)||
  (x>=rightStart+2&&x<=rightStart+3&&z>=3&&z<=eastEnd-1)||
  (z>=s.cross&&z<s.cross+2&&x>=s.west-2&&x<=rightStart+3);
 function roofHeight(x,z){
  const q=zone(x,z);
  if(q==='west-material-shop')return 12+Math.floor((z+s.west)%11/6)+(s.roof.includes('snow')?2:0);
  if(q==='east-trade-shop')return 13+Math.floor((eastEnd-z+22)%12/5)+(s.roof.includes('vault')?1:0);
  if(q==='south-market-gallery')return 11+Math.min(3,Math.floor((mid+3-x)/4))+(s.roof.includes('terrace')?2:0);
  const ridge=Math.min(x-2,w-3-x),cross=Math.min(z-2,northEnd-z);
  switch(s.roof){
   case 'cross-gable':case 'round-vault':return 17+Math.min(6,Math.floor(ridge/3));
   case 'broken-saw':case 'sunrise-saw':case 'stone-sawtooth':return 17+(Math.floor(x/6)%4)+Math.floor(cross/3);
   case 'triple-hip':case 'column-hip':case 'lantern-hip':case 'moonlight-hip':
    return 17+Math.min(6,Math.floor(Math.min(ridge,cross*3)/3));
   case 'wind-terrace':case 'flat-mason':case 'terrace-vault':case 'tree-terrace':
    return 17+Math.floor(x/11)+Math.floor(cross/2);
   case 'vented-butterfly':case 'sun-arcade':case 'moss-arcade':
    return 17+Math.floor(Math.abs(x-(mid+.5))/4)+Math.floor(cross/3);
   case 'snow-gambrel':case 'frozen-vault':case 'winter-buttress':
    return 18+Math.min(6,Math.floor(ridge/3))+(x%13<3?1:0);
   case 'double-ridge':case 'snow-horn':case 'snow-column':
    return 18+Math.min(5,Math.floor(ridge/3))+(x%12<3?2:0);
   case 'canopy-fold':case 'tall-lantern':
    return 17+Math.min(6,Math.floor((ridge+x%8)/4));
   case 'cliff-shed':case 'crag-shed':case 'canyon-step':case 'ridge-terrace':
    return 17+Math.floor(x/10)+Math.floor(cross/3);
   case 'high-saw':case 'stepped-vault':
    return 18+(Math.floor(x/8)%3)+Math.floor(ridge/6);
   default:throw Error('Unknown fourth-variant original roof morphology: '+s.roof);
  }
 }
 // Actual floor cells: an open-air central courtyard is NOT a filled rectangle.
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(hasFloor(x,z)){
  put('foundation',x,0,z,M.stone);
  put('floor',x,1,z,wood?M.plank:M.slab);
 }
 function opening(x,y,z){
  return (z===d-3&&x>=mid&&x<mid+2&&y>=2&&y<=5)||
         (z===2&&x>=mid&&x<mid+2&&y>=2&&y<=5)||
         (x===2&&z>=s.cross&&z<s.cross+2&&y>=2&&y<=5)||
         (x===w-3&&z>=s.cross&&z<s.cross+2&&y>=2&&y<=5);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(roofed(x,z)){
  if([[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>hasFloor(x+dx,z+dz)))continue;
  const top=zone(x,z)==='north-transverse-guildhall'?13:9;
  for(let y=2;y<=top;y++)if(!opening(x,y,z)&&!has(x,y,z))
   put('wall',x,y,z,wood?M.plank:M.stone);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(roofed(x,z))
  put('roof',x,roofHeight(x,z),z,
      ['snow','mountain'].includes(s.biome)?M.slate:M.roof);
 // Source purlins and downward pier shafts in each separated roof mass.
 // Piers never enter the carriage passages or the two-cell open courtyard path.
 for(let z=2;z<d-2;z++){
  for(let x=2;x<w-2;x++)if(roofed(x,z)&&(z%3===0||x%6===0)){
   const y=roofHeight(x,z)-1;
   if(!has(x,y,z))put('roof-purlin',x,y,z,M.beam);
  }
  if(z%s.stride!==0)continue;
  for(const x of [4,s.west-3,rightStart+5,w-6,mid-4,mid+5]){
   if(!roofed(x,z)||clearAisle(x,z))continue;
   const top=roofHeight(x,z)-1;
   for(let y=2;y<=top;y++)if(!has(x,y,z))
    put('bearing-pier',x,y,z,wood?M.beam:M.column);
  }
 }
 // Source working stock is physically present and outside all clearance bands.
 for(let z=northEnd+4;z<d-8;z+=s.stride){
  const x=5;
  if(roofed(x,z)&&!clearAisle(x,z))
   for(let y=2;y<=4;y++)if(!has(x,y,z))
    put(wood?'dry-lumber-rack':'hand-carved-column-stock',x,y,z,wood?M.beam:M.column);
 }
 for(let z=northEnd+5;z<eastEnd-3;z+=s.stride){
  const x=rightStart+5;
  if(roofed(x,z)&&!clearAisle(x,z)&&!has(x,2,z))
   put(wood?'mortise-layout-bench':'ashlar-dressing-plinth',x,2,z,wood?M.plank:M.slab);
 }
 // Two explicitly producer-referenced, nonfunctional physical fixtures.
 function fixture(role,xStart,xEnd,zStart,zEnd,ref,name){
  for(let z=zStart;z<=zEnd;z++)for(let x=xStart;x<=xEnd;x++){
   if(!roofed(x,z)||clearAisle(x,z)||has(x,2,z)||!has(x,1,z))continue;
   put('fixture',x,2,z,ref,{orientation:'north',state:{}});
   features.push({name,position:[x,2,z],assetRef:ref,active:false});
   return;
  }
  throw Error('No physically clear grounded fixture bay in '+s.name+' '+name);
 }
 fixture('fixture',4,s.west-4,northEnd+6,d-8,M.crate,
         wood?'nonoperative lumber stock crate':'nonoperative rough stone crate');
 fixture('fixture',rightStart+5,w-6,northEnd+5,eastEnd-3,wood?M.plank:M.slab,
         wood?'unpowered carving-template worktop':'unpowered measured-ashlar table');
 const nave={id:'rear-hall',x:mid,y:2,z:4,width:2,headroom:3};
 const nodes=[
  {id:'entrance',x:mid,y:2,z:d-3,width:2,headroom:3},
  {id:'sales-gallery',x:mid,y:2,z:d-s.south+2,width:2,headroom:3},
  nave,
  {id:'wood-stock-or-quarry',x:s.west-2,y:2,z:northEnd+4,width:2,headroom:3},
  {id:'dressing-workshop',x:rightStart+2,y:2,z:northEnd+4,width:2,headroom:3},
  {id:'open-loading-court',x:mid,y:2,z:s.cross,width:2,headroom:3}
 ];
 const b={
  id:slotId(s.type,s.biome,s.size,4),type:s.type,biome:s.biome,size:s.size,variant:4,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:H,depth:d},
  modules:[...roles].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-3,width:2,height:4,facing:'south'}],
  clearances:[
   {x:mid,y:2,z:2,width:2,height:3,depth:d-4},
   {x:s.west-2,y:2,z:3,width:2,height:3,depth:d-7},
   {x:rightStart+2,y:2,z:3,width:2,height:3,depth:eastEnd-3},
   {x:s.west-2,y:2,z:s.cross,width:rightStart-s.west+6,height:3,depth:2},
   {x:3,y:2,z:3,width:w-6,height:3,depth:2}
  ],
  spaces:[
   {id:'rear-hall',kind:wood?'rear-frame-assembly-and-matched-truss-hall':'rear-vault-stone-pattern-and-quoin-setting',
    bounds:{x:2,y:2,z:2,width:w-4,height:10,depth:s.north},accessNode:'rear-hall'},
   {id:'sales-gallery',kind:wood?'south-pattern-gallery-and-dry-joinery-counter':'south-dimensioned-masonry-commission-gallery',
    bounds:{x:s.west+2,y:2,z:southStart,width:mid-s.west+1,height:8,depth:s.south-2},accessNode:'sales-gallery'},
   {id:'wood-stock-or-quarry',kind:wood?'west-lumber-seasoning-shed':'west-cold-quarry-block-selection',
    bounds:{x:2,y:2,z:northEnd+1,width:s.west,height:8,depth:d-northEnd-4},accessNode:'wood-stock-or-quarry'},
   {id:'dressing-workshop',kind:wood?'east-dovetail-and-tenon-atelier':'east-ashlar-dressing-and-chisel-atelier',
    bounds:{x:rightStart,y:2,z:northEnd+1,width:s.east,height:8,depth:eastEnd-northEnd},accessNode:'dressing-workshop'},
   {id:'open-loading-court',kind:'genuinely-open-sky-flagstone-carriageyard',
    bounds:{x:leftEnd+1,y:2,z:northEnd+1,width:rightStart-leftEnd-1,height:6,depth:southStart-northEnd-2},
    accessNode:'open-loading-court'}
  ],
  navigation:{entry:'entrance',nodes,edges:[
   {from:'entrance',to:'sales-gallery',kind:'level'},
   {from:'sales-gallery',to:'rear-hall',kind:'level'},
   {from:'rear-hall',to:'wood-stock-or-quarry',kind:'level'},
   {from:'rear-hall',to:'dressing-workshop',kind:'level'},
   {from:'rear-hall',to:'open-loading-court',kind:'level'}]},
  features,
  dependencies:[
   'Only integrated manual Pack1-5 source symbols, not invented biome130 numeric assets',
   'Producer physical fixture collision, occupancy and supports require independent audit',
   'Roof load, span, weather, exterior art and courtyard drainage remain unapproved',
   'No operative joinery, chisel, storage, world placement, schema1 or iPhone acceptance'],
  architecture:{
   brief:s.name,originalProgramme:'perimeter rear hall, unequal side wings and open U-courtyard',
   trueUnroofedCarriageyard:true,courtyardCrossingRows:[s.cross,s.cross+1],
   asymmetricSideWingLengths:[d-4,eastEnd-2],westActualNotchZ:s.notch,
   eastActualNotchZ:s.notch+3,distinctRoofMasses:4,roofMorphology:s.roof,
   realSeparateWorkRooms:5,tradeFixtureCount:2,
   sourceOnly:true,structuralLoadApproved:false,weatherApproved:false,
   creatorApproved:false
  }
 };
 validateBlueprint(b);
 return b;
}
export function createM3CraftFourthVariant(type,biome,size){
 if(!['carpenter','stonemason'].includes(type)||!BIOMES.includes(biome)||!SIZES.includes(size))
  throw RangeError('No M3 fourth-variant work outside Builder 3A craft allocation');
 const s=M3_CRAFT_FOURTH_SPECS.find(s=>s.type===type&&s.biome===biome&&s.size===size);
 if(!s)throw RangeError('No original source programme for M3 fourth slot');
 return build(s);
}
export function createM3CraftFourthPool(){return M3_CRAFT_FOURTH_SPECS.map(build);}
