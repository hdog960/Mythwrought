/**
 * Builder 3A M2 — fourth metalwork variant, 30 genuinely new coordinate-authored
 * U-/H-plan cold workshops with distinct tiered roof volumes.
 * Source candidates only; no gameplay machines, save migration or world writes.
 */
import {slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const P=Object.freeze({stone:'pack1:002',slab:'pack1:007',post:'pack1:010',
 plank:'pack2:013',beam:'pack2:015',roof:'pack3:023',slate:'pack3:025',
 fireplace:'pack4:064',anvil:'pack5:088',crate:'pack4:057'});
// Each line is a separate authored spatial/roof/work-court brief.
// kind|biome|size|name|W|D|westStart|westEnd|eastStart|eastEnd|roof|court|piers
const LINES=[
'blacksmith|temperate|small|riverbend-bellows-court|25|27|3|19|8|24|double-gable|west-yard|4',
'blacksmith|temperate|medium|copper-quay-crosshall|31|33|5|24|3|19|raised-monitor|east-light|5',
'blacksmith|temperate|large|three-arch-smith-commons|39|39|4|28|11|36|broken-hip|north-stone|6',
'blacksmith|desert|small|windward-shade-bloomery|26|28|4|20|9|26|desert-butterfly|east-light|4',
'blacksmith|desert|medium|terraced-bronze-smithcourt|33|34|6|27|3|21|stepped-pavilion|west-yard|5',
'blacksmith|desert|large|saffron-forge-colonnade|40|40|5|30|12|37|raised-monitor|south-loggia|7',
'blacksmith|snow|small|snowcrest-hearth-house|27|29|5|22|9|27|winter-gambrel|north-stone|4',
'blacksmith|snow|medium|ice-ridge-hammersmith|34|35|4|26|10|33|double-gable|east-light|6',
'blacksmith|snow|large|frosthall-smithworks|41|41|6|32|4|28|high-pitch|west-yard|7',
'blacksmith|enchanted-forest|small|whispergrove-forging-shed|28|30|4|23|11|28|forest-lantern|south-loggia|5',
'blacksmith|enchanted-forest|medium|silver-bough-metal-atelier|35|36|5|27|3|24|broken-hip|north-stone|6',
'blacksmith|enchanted-forest|large|elder-copse-forge-cloister|42|42|6|33|11|39|raised-monitor|east-light|7',
'blacksmith|mountain|small|ledgeiron-mason-forge|29|30|4|23|10|28|step-terrace|west-yard|5',
'blacksmith|mountain|medium|cragside-hammer-gallery|36|37|6|28|4|25|high-pitch|south-loggia|6',
'blacksmith|mountain|large|stormbreak-plate-smithhall|43|43|5|34|12|40|step-terrace|east-light|7',
'armorer|temperate|small|heraldic-shield-courtyard|25|28|4|20|10|26|broken-hip|east-light|4',
'armorer|temperate|medium|founders-harness-workhouse|32|33|5|25|3|21|double-gable|south-loggia|5',
'armorer|temperate|large|crown-plate-gallery|40|40|6|30|12|38|raised-monitor|north-stone|6',
'armorer|desert|small|palmshade-chainmail-house|27|28|5|21|9|26|desert-butterfly|west-yard|4',
'armorer|desert|medium|amber-shieldmakers-court|34|35|4|27|12|33|step-terrace|east-light|6',
'armorer|desert|large|golden-regiment-equipment-yard|41|41|6|32|4|29|broken-hip|south-loggia|7',
'armorer|snow|small|cedar-sallet-atelier|28|29|5|23|11|27|winter-gambrel|north-stone|5',
'armorer|snow|medium|whiteguard-breastplate-hall|35|36|4|27|12|34|high-pitch|west-yard|6',
'armorer|snow|large|fort-north-harness-compound|42|42|6|34|3|28|double-gable|east-light|7',
'armorer|enchanted-forest|small|leafsteel-vambrace-garden|29|30|5|22|12|28|forest-lantern|south-loggia|5',
'armorer|enchanted-forest|medium|dawnwarden-armor-terraces|36|37|4|29|13|35|raised-monitor|north-stone|6',
'armorer|enchanted-forest|large|thronewood-shield-cloister|43|43|6|34|4|29|broken-hip|west-yard|7',
'armorer|mountain|small|granite-helm-and-shield|30|31|5|24|10|29|step-terrace|east-light|5',
'armorer|mountain|medium|highspur-harness-courtyard|37|38|4|30|13|36|high-pitch|south-loggia|6',
'armorer|mountain|large|bastion-forgefree-armory|44|44|7|36|4|30|raised-monitor|north-stone|7'
];
const F=['type','biome','size','name','width','depth','westStart','westEnd','eastStart','eastEnd','roof','court','pierStep'];
export const M2_FOURTH_VARIANT_SPECS=Object.freeze(LINES.map(line=>{
 const a=line.split('|');
 if(a.length!==F.length)throw Error('Incomplete M2 original fourth architectural specification');
 return Object.freeze(Object.fromEntries(F.map((k,i)=>[k,[4,5,6,7,8,9,12].includes(i)?Number(a[i]):a[i]])));
}));
if(M2_FOURTH_VARIANT_SPECS.length!==30)throw Error('M2 fourth variants must be exactly 30 source programmes');

function make(q){
 const w=q.width,d=q.depth,h=27,mid=Math.floor(w/2)-1,smith=q.type==='blacksmith';
 const own=new Map(),byRole=new Map(),features=[];
 const at=(x,y,z)=>x+','+y+','+z;
 const has=(x,y,z)=>own.has(at(x,y,z));
 function put(role,x,y,z,ref,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||z<0||z>=d||y<0||y>=h)
   throw Error(q.name+' out-of-envelope source cell '+at(x,y,z));
  if(has(x,y,z))throw Error(q.name+' source occupancy collision '+at(x,y,z));
  own.set(at(x,y,z),role);
  if(!byRole.has(role))byRole.set(role,[]);
  byRole.get(role).push(meta===null?[x,y,z,ref]:[x,y,z,ref,Object.freeze(meta)]);
 }
 const midWest=7,midEast=w-8,fx=3,fz=q.westStart+8;
 const westRoute=q.westStart+2,eastRoute=q.eastStart+2;
 const inFlue=(x,z)=>smith&&Math.abs(x-fx)<=1&&Math.abs(z-fz)<=1;
 function segment(x,z){
  if(x<0||x>=w||z<0||z>=d)return null;
  if(x>=midWest&&x<=midEast)return 'nave';
  if(x>=1&&x<=6&&z>=q.westStart&&z<=q.westEnd)return 'west-wing';
  if(x>=w-7&&x<=w-2&&z>=q.eastStart&&z<=q.eastEnd)return 'east-wing';
  return null;
 }
 const foot=(x,z)=>segment(x,z)!==null;
 function aisle(x,z){
  if(x>=mid&&x<mid+2)return true;
  if(z>=westRoute&&z<westRoute+2&&x>=3&&x<=mid)return true;
  if(z>=eastRoute&&z<eastRoute+2&&x>=mid+1&&x<=w-4)return true;
  return false;
 }
 const offset=(x,z)=>Math.min(x,w-1-x,z,d-1-z);
 function roofY(x,z){
  const seg=segment(x,z);
  if(seg==='west-wing')return 10+Math.min(2,Math.floor((z-q.westStart)/7))+(q.roof==='step-terrace'?1:0);
  if(seg==='east-wing')return 11+Math.min(2,Math.floor((q.eastEnd-z)/8));
  const apex=Math.min(x-midWest,midEast-x);
  switch(q.roof){
   case 'double-gable':return 14+Math.min(4,Math.floor(apex/2));
   case 'raised-monitor':return 15+Math.min(4,Math.floor(apex/2))+(z>=Math.floor(d*.36)&&z<Math.floor(d*.63)?1:0);
   case 'broken-hip':return 14+Math.min(4,Math.floor(Math.min(apex,offset(x,z))/2));
   case 'desert-butterfly':return 14+Math.floor(Math.abs(x-(w-1)/2)/3);
   case 'stepped-pavilion':return 14+Math.floor(z/10)+Math.floor(apex/4);
   case 'winter-gambrel':return 14+Math.min(5,Math.floor(apex/2));
   case 'high-pitch':return 15+Math.min(6,Math.floor(apex/2));
   case 'forest-lantern':return 14+Math.min(4,Math.floor((apex+z%8)/3));
   case 'step-terrace':return 14+Math.floor(z/8)+Math.floor(apex/5);
   default:throw Error('Unknown authored fourth roof type '+q.roof);
  }
 }
 function courtOpening(x,z){
  if(inFlue(x,z))return true; // physically open smoke shaft without approved cap
  const s=segment(x,z);
  if(q.court==='west-yard')return s==='west-wing'&&x<=4&&z>=q.westStart+2&&z<q.westStart+6;
  if(q.court==='east-light')return s==='east-wing'&&x>=w-5&&z>=q.eastStart+6&&z<q.eastStart+11;
  if(q.court==='north-stone')return s==='nave'&&z<8&&x>=mid+3&&x<mid+6;
  if(q.court==='south-loggia')return s==='east-wing'&&z>q.eastEnd-8&&z<q.eastEnd-3&&x>=w-5;
  throw Error('Unmapped authored fourth daylight programme '+q.court);
 }
 function aperture(x,y,z){
  if(z===d-1&&x>=mid&&x<mid+2&&y>=2&&y<=5)return true;
  // Two side loading arches and separate high daylight windows.
  if(y>=2&&y<=5&&x===1&&z>=q.westEnd-5&&z<q.westEnd-2)return true;
  if(y>=2&&y<=5&&x===w-2&&z>=q.eastStart+5&&z<q.eastStart+8)return true;
  if(y>=5&&y<=6&&z===0&&x>=mid+3&&x<mid+6)return true;
  return false;
 }
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  put('foundation',x,0,z,P.stone);
  put('floor',x,1,z,smith?P.slab:P.plank);
 }
 // Actual facade and wing-return walls: taller central nave, lower side workshops.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  const s=segment(x,z);if(!s)continue;
  if(foot(x-1,z)&&foot(x+1,z)&&foot(x,z-1)&&foot(x,z+1))continue;
  const top=s==='nave'?11:8;
  for(let y=2;y<=top;y++)if(!aperture(x,y,z))
   put('wall',x,y,z,s==='west-wing'?P.plank:P.stone);
 }
 // New masonry chimney is an independent, vertically hollow square shell.
 if(smith){
  for(let y=2;y<=22;y++)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
   if(dx===0&&dz===0)continue;
   const x=fx+dx,z=fz+dz;
   if(has(x,y,z))throw Error(q.name+' chimney shell intersects authored source at '+at(x,y,z));
   put('cold-flue-masonry',x,y,z,P.stone);
  }
  put('fixture',fx,2,fz,P.fireplace,{orientation:'north',state:{}});
  features.push({name:'cold hearth, unpowered hollow chimney',position:[fx,2,fz],assetRef:P.fireplace,active:false});
 }
 // Three separate roof volumes, the nave visibly 3–7 voxels above both wings.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)&&!courtOpening(x,z)){
  const y=roofY(x,z);
  if(has(x,y,z))throw Error(q.name+' structural roof/wall conflict '+at(x,y,z));
  put('roof',x,y,z,q.biome==='snow'||q.biome==='mountain'?P.slate:P.roof);
 }
 // Structural pier and beam rails in each roof volume. Purlins at 3-cell
 // cadence provide a source bearing witness; final load strength is UNAPPROVED.
 for(let z=2;z<d-2;z++){
  if(z%3===0){
   for(let x=2;x<w-2;x++){
    const s=segment(x,z);
    if(!s||courtOpening(x,z)||inFlue(x,z))continue;
    const y=roofY(x,z)-1;
    if(!has(x,y,z))put('roof-purlin',x,y,z,P.beam);
   }
  }
  if(z%q.pierStep!==0)continue;
  for(const x of [3,8,w-9,w-4]){
   if(!foot(x,z)||courtOpening(x,z)||inFlue(x,z)||aisle(x,z))continue;
   const limit=roofY(x,z)-1;
   for(let y=2;y<limit;y++)if(!has(x,y,z))put('support-pier',x,y,z,P.post);
  }
 }
 // Partition west/east rear rooms without closing the central two-wide aisle.
 const partZ=Math.floor(d*.58);
 for(let x=midWest+1;x<midEast;x++)if(!aisle(x,partZ))
  for(let y=2;y<=6;y++)if(!has(x,y,partZ))
   put('room-divider',x,y,partZ,smith?P.stone:P.plank);
 // Interior spaces with authentic physical inventory and independently accessible bays.
 // Place two nonoperating producer-backed stations only in source-clear wing cells.
 const fixtures=[
  {asset:P.anvil,preferred:[w-5,q.eastEnd-4],name:smith?'cold hammer anvil':'mail and plate shaping anvil',variant:'blackiron-horn'},
  {asset:P.crate,preferred:[5,q.westEnd-3],name:smith?'metalstock crate':'armor material crate',variant:null}
 ];
 for(const f of fixtures){
  const [x,z]=f.preferred;
  if(!foot(x,z)||aisle(x,z)||has(x,2,z))throw Error(q.name+' physical work station obstruction '+at(x,2,z));
  put('fixture',x,2,z,f.asset,f.variant?{orientation:'north',variant:f.variant,state:{}}:{orientation:'north',state:{}});
  features.push({name:f.name,position:[x,2,z],assetRef:f.asset,active:false});
 }
 const nav=[
  {id:'gate',x:mid,y:2,z:d-1,width:2,headroom:3},
  {id:'front',x:mid,y:2,z:d-8,width:2,headroom:3},
  {id:'rear',x:mid,y:2,z:3,width:2,headroom:3},
  {id:'west-bay',x:4,y:2,z:westRoute,width:2,headroom:3},
  {id:'east-bay',x:w-5,y:2,z:eastRoute,width:2,headroom:3}
 ];
 const b={id:slotId(q.type,q.biome,q.size,4),type:q.type,biome:q.biome,size:q.size,variant:4,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
  modules:[...byRole].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-1,width:2,height:4,facing:'south'}],
  clearances:[{x:mid,y:2,z:2,width:2,height:3,depth:d-2},
    {x:3,y:2,z:westRoute,width:mid-2,height:3,depth:2},
    {x:mid+1,y:2,z:eastRoute,width:w-mid-4,height:3,depth:2}],
  spaces:[
   {id:'front',kind:smith?'anvil-and-material-handling':'plate-shaping-public-hall',
     bounds:{x:midWest,y:2,z:d-13,width:midEast-midWest+1,height:6,depth:10},accessNode:'front'},
   {id:'rear',kind:smith?'separate-cold-forge-stock':'armorer-finished-work-inventory',
     bounds:{x:midWest,y:2,z:2,width:midEast-midWest+1,height:6,depth:Math.floor(d*.46)},accessNode:'rear'},
   {id:'west-bay',kind:smith?'grounded-cold-forge-and-bellows':'cutting-and-repair-wing',
     bounds:{x:1,y:2,z:q.westStart,width:6,height:6,depth:q.westEnd-q.westStart+1},accessNode:'west-bay'},
   {id:'east-bay',kind:smith?'open-load-metalwork-yard':'separate-harness-rack-court',
     bounds:{x:w-7,y:2,z:q.eastStart,width:6,height:6,depth:q.eastEnd-q.eastStart+1},accessNode:'east-bay'}
  ],
  navigation:{entry:'gate',nodes:nav,edges:[
   {from:'gate',to:'front',kind:'level'},{from:'front',to:'rear',kind:'level'},
   {from:'rear',to:'west-bay',kind:'level'},{from:'front',to:'east-bay',kind:'level'}
  ]},
  features,
  dependencies:[
   'Producer Pack physical-family shape/collision and source supports need construction acceptance',
   'No approved actual roof span, water flashing, chimney heat or world height claim',
   smith?'Pack4:063 hollow chimney cap remains a separate symbolic dependency only':'No operating forge/crafting machine',
   'No gameplay placement, structural integration, saves, NPC, automation or physics changes'
  ],
  architecture:{name:q.name,spatialProgram:'raised-aisled-central-nave-and-two-asymmetric-low-side-wings',
   westWing:[q.westStart,q.westEnd],eastWing:[q.eastStart,q.eastEnd],
   roofMorphology:q.roof,daylight:q.court,sourcePurlinCadence:3,
   sourcePierStep:q.pierStep,distinctRoofVolumes:3,independentNamedSpaces:4,
   actualCrossWingAisles:[westRoute,eastRoute],
   hollowColdShaft:smith?{x:fx,z:fz,openFromY:3,openThroughY:22}:null,
   truePhysicalHeatApproved:false,finalRoofWeatherApproved:false,
   roofEngineeringApproved:false,sourceOnly:true}
 };
 validateBlueprint(b);
 return b;
}
export function createM2FourthVariant(type,biome,size){
 const q=M2_FOURTH_VARIANT_SPECS.find(x=>x.type===type&&x.biome===biome&&x.size===size);
 if(!q)throw RangeError('No independently authored fourth metalwork blueprint at this slot');
 return make(q);
}
export function createM2FourthVariantPool(){return M2_FOURTH_VARIANT_SPECS.map(make);}
