/**
 * Mythwrought Builder 3A M2. Thirty fully coordinate-authored independent
 * blacksmith/armorer second variants, one per biome × size × metalwork category.
 * No save, runtime, gameplay, registration or physical-iPhone claim.
 */
import {slotId,BIOMES,SIZES} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const A=Object.freeze({stone:'pack1:002',slab:'pack1:007',pillar:'pack1:010',
 timber:'pack2:015',plank:'pack2:013',slate:'pack3:025',tile:'pack3:023',
 fireplace:'pack4:064',anvil:'pack5:088',crate:'pack4:057'});
// Individual building architectural briefs; never substitute rotations/reskins.
const RAW=[
'blacksmith|temperate|small|village-arc-forge|21|22|twin-ridge|west|8|11|4|clerestory',
'blacksmith|temperate|medium|riverside-hammerhall|27|29|cross-gable|east|10|13|5|sawlight',
'blacksmith|temperate|large|guild-courtyard-smithy|36|34|courtyard-hip|west|12|16|6|ridge-light',
'blacksmith|desert|small|sunshade-bronze-forge|23|24|butterfly|east|8|11|4|vent-strip',
'blacksmith|desert|medium|oasis-metals-workyard|30|28|split-shed|west|9|14|5|clerestory',
'blacksmith|desert|large|grand-bazaar-foundry-shell|37|35|terraced|east|14|17|7|vent-strip',
'blacksmith|snow|small|heated-slope-smithy|24|26|steep-hip|west|9|12|4|ridge-light',
'blacksmith|snow|medium|frost-hammer-vestibule|29|31|twin-ridge|east|11|15|5|clerestory',
'blacksmith|snow|large|highsnow-forge-house|38|36|gambrel|west|13|18|6|ridge-light',
'blacksmith|enchanted-forest|small|spindlewood-forge|25|25|forest-canopy|east|8|12|5|sawlight',
'blacksmith|enchanted-forest|medium|moonglass-iron-bloomery|31|30|cross-gable|west|11|14|6|vent-strip',
'blacksmith|enchanted-forest|large|eldergrove-hammer-pavilion|39|37|courtyard-hip|east|13|18|6|ridge-light',
'blacksmith|mountain|small|cliffside-blackiron-smith|26|27|stepped|west|9|13|4|vent-strip',
'blacksmith|mountain|medium|stonebridge-smelting-hall|33|32|terraced|east|12|16|6|sawlight',
'blacksmith|mountain|large|highpass-forge-citadel|40|38|gambrel|west|14|19|7|clerestory',
'armorer|temperate|small|squire-harness-house|22|23|cross-gable|east|8|10|4|ridge-light',
'armorer|temperate|medium|shieldmakers-gallery|29|30|twin-ridge|west|11|14|5|sawlight',
'armorer|temperate|large|royal-armory-barracks|38|35|courtyard-hip|east|14|17|6|clerestory',
'armorer|desert|small|desert-brigandine-shop|23|26|split-shed|west|9|12|4|vent-strip',
'armorer|desert|medium|copper-harness-arcade|32|29|butterfly|east|11|14|5|ridge-light',
'armorer|desert|large|sunsteel-plate-guild|39|37|terraced|west|14|18|7|sawlight',
'armorer|snow|small|snowmail-fitting-house|25|27|steep-hip|east|9|12|4|clerestory',
'armorer|snow|medium|fir-clad-plate-armory|30|32|gambrel|west|11|16|5|ridge-light',
'armorer|snow|large|winter-guard-harness-hall|40|39|twin-ridge|east|15|19|7|sawlight',
'armorer|enchanted-forest|small|silverleaf-mailmaker|26|25|forest-canopy|west|8|11|4|ridge-light',
'armorer|enchanted-forest|medium|thornward-armor-atelier|34|31|cross-gable|east|12|16|6|clerestory',
'armorer|enchanted-forest|large|moonwarden-equipment-court|41|40|courtyard-hip|west|15|20|7|ridge-light',
'armorer|mountain|small|ridgeguard-sallet-workshop|27|28|stepped|east|9|13|5|vent-strip',
'armorer|mountain|medium|mountain-plate-foundry|35|33|terraced|west|12|16|6|sawlight',
'armorer|mountain|large|fortress-armor-assembly|42|40|gambrel|east|16|20|7|clerestory'
];
const F=['type','biome','size','name','width','depth','roofForm','wingSide','wingLength','baySplit','supportInterval','daylight'];
export const M2_METALWORK_SPECIFICATIONS=Object.freeze(RAW.map(line=>{
 const a=line.split('|');if(a.length!==F.length)throw Error('M2 authored specification missing fields');
 return Object.freeze(Object.fromEntries(F.map((k,i)=>[k,[4,5,8,9,10].includes(i)?Number(a[i]):a[i]])));
}));
function make(q){
 const w=q.width,d=q.depth,h=27,mid=Math.floor(w/2)-1,forge=q.type==='blacksmith',fx=3,fz=d-9;
 const modules=new Map(),used=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z,has=(x,y,z)=>used.has(key(x,y,z));
 function put(role,x,y,z,asset,metadata=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=h||z<0||z>=d)
   throw Error(q.name+' out-of-bounds coordinate '+key(x,y,z));
  const k=key(x,y,z);if(used.has(k))throw Error(q.name+' occupied voxel overlap '+k);
  used.set(k,role);if(!modules.has(role))modules.set(role,[]);
  const c=[x,y,z,asset];if(metadata)c.push(Object.freeze(metadata));modules.get(role).push(c);
 }
 function foot(x,z){
  if(x<0||x>=w||z<0||z>=d)return false;
  if((q.wingSide==='west'?x<6:x>=w-6)&&z>=3&&z<q.wingLength)return false;
  if((q.wingSide==='west'?x>=w-5:x<5)&&z<4)return false;
  return true;
 }
 function roofY(x,z){
  const a=Math.min(x,w-1-x),b=Math.min(z,d-1-z);
  switch(q.roofForm){
   case 'twin-ridge':return 10+Math.min(5,Math.floor(Math.min(x%Math.ceil(w/2),Math.ceil(w/2)-1-x%Math.ceil(w/2))/2));
   case 'cross-gable':return 10+Math.min(4,Math.floor(a/4))+Math.floor(z/18);
   case 'courtyard-hip':return 10+Math.min(5,Math.floor(Math.min(a,b)/4));
   case 'butterfly':return 11+Math.floor(Math.abs(x-(w-1)/2)/6);
   case 'split-shed':return 10+Math.floor((w-1-x)/7)+(z<Math.floor(d/2)?1:0);
   case 'terraced':return 10+Math.floor(z/8)+Math.floor(x/15);
   case 'steep-hip':return 10+Math.min(6,Math.floor(Math.min(a,b)/3));
   case 'gambrel':return 10+Math.min(6,Math.floor(a/3));
   case 'forest-canopy':return 10+Math.min(5,Math.floor((a+z%9)/5));
   case 'stepped':return 10+Math.floor(x/8)+Math.floor(z/12);
   default:throw Error('M2 unknown roof cross-section');
  }
 }
 const ring=(x,z)=>forge&&Math.abs(x-fx)<=1&&Math.abs(z-fz)<=1;
 function skylight(x,z){
  if(q.daylight==='ridge-light')return x>=mid+4&&x<mid+7&&z>=10&&z<d-10;
  if(q.daylight==='clerestory')return x>=w-10&&x<w-7&&z>=8&&z<d-9;
  if(q.daylight==='sawlight')return x>=w-10&&x<w-7&&z>=10&&z<d-10&&z%3!==0;
  return x>=w-9&&x<w-6&&z>=7&&z<d-7;
 }
 function opening(x,y,z){
  if(z===d-1&&x>=mid&&x<mid+2&&y>=2&&y<=4)return true;
  if(y>=4&&y<=5&&((x===0&&z>=d-8&&z<=d-5)||(x===w-1&&z>=5&&z<=8)))return true;
  if((q.wingSide==='west'?x===0:x===w-1)&&z>=d-12&&z<d-9&&y>=2&&y<=5)return true;
  return false;
 }
 // Nonrectangular integral ground structure and physically traversable deck.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  put('foundation',x,0,z,A.stone);put('floor',x,1,z,forge?A.slab:A.plank);
 }
 // All exterior walls follow footprint cuts, with real entrance/windows.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!foot(x,z)||foot(x-1,z)&&foot(x+1,z)&&foot(x,z-1)&&foot(x,z+1))continue;
  for(let y=2;y<=9;y++)if(!opening(x,y,z)){
   const jamb=z===d-1&&(x===mid-1||x===mid+2)&&y<=7;
   put(jamb?'entry-frame':'wall',x,y,z,jamb?A.pillar:forge?A.stone:A.plank);
  }
 }
 // New forge: masonry shaft surrounds a continuous *empty* center.
 // Pack4 chimney top course is NOT installed until physical fit certified.
 if(forge){
  for(let y=2;y<=20;y++)for(let x=fx-1;x<=fx+1;x++)for(let z=fz-1;z<=fz+1;z++){
   if(x===fx&&z===fz)continue;
   if(!has(x,y,z))put('flue-masonry',x,y,z,A.stone);
  }
  put('fixture',fx,2,fz,A.fireplace,{orientation:'north',state:{}});
 }
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)&&!ring(x,z)&&!skylight(x,z)){
  const y=roofY(x,z);if(!has(x,y,z))put('roof',x,y,z,q.biome==='snow'||q.biome==='mountain'?A.slate:A.tile);
 }
 // Grounded column runs with authentic under-roof purlin coordinates.
 for(let z=3;z<d-3;z+=q.supportInterval){
  for(const x of [7,w-8]){
   if(!foot(x,z)||skylight(x,z)||ring(x,z))continue;
   for(let y=2;y<roofY(x,z);y++)if(!has(x,y,z))put('support-pier',x,y,z,A.pillar);
  }
  for(let x=8;x<w-8;x++){
   if(!foot(x,z)||skylight(x,z)||ring(x,z))continue;
   const y=roofY(x,z)-1;if(!has(x,y,z))put('roof-purlin',x,y,z,A.timber);
  }
 }
 // Two independent workflow rooms and actual two-wide internal door corridor.
 for(let x=1;x<w-1;x++){
  if(x>=mid&&x<mid+2||!foot(x,q.baySplit)||ring(x,q.baySplit))continue;
  for(let y=2;y<=5;y++)if(!has(x,y,q.baySplit))
   put('internal-bay-separation',x,y,q.baySplit,forge?A.stone:A.plank);
 }
 const stockX=q.wingSide==='west'?w-5:6,oppX=q.wingSide==='west'?7:w-7;
 for(let z=5;z<d-5;z+=q.supportInterval){
  if(foot(stockX,z))for(let y=2;y<=4;y++)
   if(!has(stockX,y,z))put(forge?'forge-tool-rack':'plate-harness-rack',stockX,y,z,A.timber);
  if(foot(oppX,z)&&!has(oppX,2,z))
   put(forge?'coal-and-metal-stock':'fitting-measure-post',oppX,2,z,A.slab);
 }
 const places=forge?[
  {name:'non-operating anvil',x:w-9,z:d-7,asset:A.anvil,variant:'blackiron-horn'},
  {name:'unpowered stock crate',x:q.wingSide==='east'?w-9:w-6,z:5,asset:A.crate}
 ]:[
  {name:'plate shaping anvil',x:8,z:d-7,asset:A.anvil,variant:'blackiron-horn'},
  {name:'harness stock chest',x:q.wingSide==='east'?w-9:w-6,z:5,asset:A.crate}
 ];
 for(const p of places){
  if(!foot(p.x,p.z)||has(p.x,2,p.z))throw Error(q.name+' fixture collision at '+key(p.x,2,p.z));
  put('fixture',p.x,2,p.z,p.asset,p.variant?{orientation:'north',variant:p.variant,state:{}}:{orientation:'north',state:{}});
  features.push({name:p.name,position:[p.x,2,p.z],assetRef:p.asset,active:false});
 }
 if(forge)features.unshift({name:'cold forge-mouth with hollow masonry flue',position:[fx,2,fz],assetRef:A.fireplace,active:false});
 const nodes=[{id:'entry',x:mid,y:2,z:d-1,width:2,headroom:3},
  {id:'work',x:mid,y:2,z:d-8,width:2,headroom:3},
  {id:'stock',x:mid,y:2,z:4,width:2,headroom:3}];
 const b={id:slotId(q.type,q.biome,q.size,2),type:q.type,biome:q.biome,size:q.size,variant:2,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-1,width:2,height:3,facing:'south'}],
  clearances:[{x:mid,y:2,z:2,width:2,height:3,depth:d-2}],
  navigation:{entry:'entry',nodes,edges:[{from:'entry',to:'work',kind:'level'},{from:'work',to:'stock',kind:'level'}]},
  spaces:[{id:'front-work-bay',kind:forge?'cold-forge-and-anvil-zone':'shaping-and-fitting-gallery',
    bounds:{x:1,y:2,z:d-13,width:w-2,height:5,depth:11},accessNode:'work'},
   {id:'rear-stock-bay',kind:forge?'separate-metal-and-fuel-stock':'independent-harness-storage',
    bounds:{x:1,y:2,z:2,width:w-2,height:5,depth:d-15},accessNode:'stock'}],
  features,
  dependencies:['Pack 1–5 physical orientation/heat/collision needs central acceptance',
   'Daylight opening, roof load and weatherproofing unapproved',
   forge?'pack4:063 future hollow chimney cap SYMBOLIC ONLY; not placed':'No equipment crafting',
   'No live world or schema-1 save, NPCs, crafting, active heat, or powered machines'],
  architecture:{brief:q.name,roofStyle:q.roofForm,footprint:'lateral-wing-plus-opposite-rear-notch',
   wingSide:q.wingSide,wingCutLength:q.wingLength,openDaylight:q.daylight,
   supportPierSpacing:q.supportInterval,rooms:['front-work-bay','rear-stock-bay'],
   accessWidth:2,flueVoid:forge?[fx,fz]:null,physicalFlueRing:forge,
   flueVerticallyClear:forge,chimneyCapUnresolved:forge,
   heatApproved:false,weatherApproved:false,structuralLoadApproved:false,finalSourceOnly:true}
 };
 validateBlueprint(b);
 return b;
}
export function createM2MetalworkBlueprint(type,biome,size){
 if(!['blacksmith','armorer'].includes(type)||!BIOMES.includes(biome)||!SIZES.includes(size))
  throw RangeError('Builder 3A M2 outside exclusive category ownership');
 const q=M2_METALWORK_SPECIFICATIONS.find(v=>v.type===type&&v.biome===biome&&v.size===size);
 if(!q)throw RangeError('M2 unallocated variant');
 return make(q);
}
export function createM2MetalworkPool(){return M2_METALWORK_SPECIFICATIONS.map(make);}
