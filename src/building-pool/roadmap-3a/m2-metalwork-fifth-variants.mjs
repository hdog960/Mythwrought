/**
 * Mythwrought Builder 3A — M2 fifth variants.
 * Thirty individually specified courtyard-and-return-wing source-coordinate
 * blacksmith/armorer architecture candidates, never production world assets.
 * Orthogonal accessible split bay program, 3 different roof volumes, true
 * open-to-sky loading court, and a cold, hollow masonry source shaft for smiths.
 */
import {slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const P=Object.freeze({stone:'pack1:002',slab:'pack1:007',post:'pack1:010',
 plank:'pack2:013',beam:'pack2:015',roof:'pack3:023',slate:'pack3:025',
 fireplace:'pack4:064',anvil:'pack5:088',crate:'pack4:057'});
// Each entry is a UNIQUE spatial program, not a palette/rotation/reskin.
// type|biome|size|name|width|depth|westStart|westEnd|eastStart|eastEnd|courtStart|courtEnd|roof|piers
const PROPOSALS=[
'blacksmith|temperate|small|river-island-forge-quadrangle|27|29|3|24|5|26|13|19|cantilever-gable|5',
'blacksmith|temperate|medium|lockside-hammer-cloister|34|36|5|30|4|33|14|24|monitor-roof|6',
'blacksmith|temperate|large|town-guild-five-bay-forge|42|43|4|37|7|40|19|30|courtyard-hip|7',
'blacksmith|desert|small|sandshadow-copper-atelier|28|30|4|25|7|27|12|20|open-vent-canopy|5',
'blacksmith|desert|medium|oasis-bronze-covered-court|35|37|6|32|5|34|17|27|saw-light|6',
'blacksmith|desert|large|copper-dune-metallurgists-yard|43|44|5|39|8|42|20|31|terrace-nave|8',
'blacksmith|snow|small|cedar-beamed-hearth-court|29|31|4|26|6|29|14|21|steep-gambrel|5',
'blacksmith|snow|medium|blue-ice-farrier-gallery|36|38|5|33|9|36|17|28|clipped-hip|6',
'blacksmith|snow|large|frost-iron-guild-enclosure|44|45|6|40|7|43|21|32|snowmonitor|8',
'blacksmith|enchanted-forest|small|witchwood-cold-iron-cloister|30|32|5|28|7|30|15|23|canopy-lantern|5',
'blacksmith|enchanted-forest|medium|moonstone-hearth-crosscourt|37|39|6|35|10|37|18|29|split-arc|7',
'blacksmith|enchanted-forest|large|deep-grove-forgemaster-court|45|46|5|41|8|44|22|34|monitor-roof|8',
'blacksmith|mountain|small|river-crag-hammer-annex|31|33|4|29|9|31|15|23|cliff-step|5',
'blacksmith|mountain|medium|skybridge-blackiron-works|38|40|7|36|8|38|18|29|split-arc|7',
'blacksmith|mountain|large|granite-summit-forge-quad|46|47|6|43|11|45|23|35|terrace-nave|8',
'armorer|temperate|small|greenbridge-harness-court|27|30|4|25|8|28|13|21|clipped-hip|5',
'armorer|temperate|medium|armorers-arcade-and-courtyard|34|37|6|33|7|35|17|27|monitor-roof|6',
'armorer|temperate|large|longhall-plate-furnishing-court|42|44|5|39|9|42|20|32|courtyard-hip|7',
'armorer|desert|small|oasis-chain-assembly-enclosure|28|31|3|27|9|29|14|22|open-vent-canopy|5',
'armorer|desert|medium|sunstitch-brigandine-cloister|35|38|7|34|8|36|18|28|terrace-nave|6',
'armorer|desert|large|copper-guard-regalia-court|43|45|6|42|10|43|22|33|saw-light|8',
'armorer|snow|small|fircrest-shield-fitting-yard|29|32|4|28|8|30|15|23|steep-gambrel|5',
'armorer|snow|medium|winterguard-mailmaking-nave|36|39|6|36|9|37|19|29|snowmonitor|7',
'armorer|snow|large|icewatch-harness-cloister|44|46|5|42|11|44|22|34|clipped-hip|8',
'armorer|enchanted-forest|small|thornshield-pier-workshop|30|33|5|30|8|31|15|24|canopy-lantern|5',
'armorer|enchanted-forest|medium|starlit-mail-and-plate-yard|37|40|6|37|11|38|18|31|split-arc|7',
'armorer|enchanted-forest|large|ancient-warden-regalia-forum|45|47|7|44|9|45|23|35|courtyard-hip|8',
'armorer|mountain|small|passguard-sallet-quad|31|34|4|31|10|32|15|24|cliff-step|5',
'armorer|mountain|medium|highpass-plating-and-leather|38|41|7|39|9|39|19|31|split-arc|7',
'armorer|mountain|large|cliffwarden-armor-assembly|46|48|6|45|12|46|23|36|terrace-nave|9'
];
const KEYS=['type','biome','size','name','width','depth','westStart','westEnd','eastStart','eastEnd','courtStart','courtEnd','roofForm','pierStride'];
export const M2_FIFTH_VARIANT_SPECS=Object.freeze(PROPOSALS.map(text=>{
 const parts=text.split('|');
 if(parts.length!==KEYS.length)throw Error('Incomplete authored fifth-variant spatial specification');
 return Object.freeze(Object.fromEntries(KEYS.map((key,i)=>[key,[4,5,6,7,8,9,10,11,13].includes(i)?Number(parts[i]):parts[i]])));
}));
if(M2_FIFTH_VARIANT_SPECS.length!==30)throw Error('Exactly thirty final metalwork slots must be authored');

function build(q){
 const {width:w,depth:d}=q,height=29,mid=Math.floor(w/2)-1,smith=q.type==='blacksmith';
 const map=new Map(),modules=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z;
 const has=(x,y,z)=>map.has(key(x,y,z));
 function add(role,x,y,z,ref,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||z<0||z>=d||y<0||y>=height)
   throw Error(q.name+' source coordinate outside envelope '+key(x,y,z));
  if(has(x,y,z))throw Error(q.name+' source overlap '+key(x,y,z)+' with '+map.get(key(x,y,z)));
  map.set(key(x,y,z),role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push(meta===null?[x,y,z,ref]:[x,y,z,ref,Object.freeze(meta)]);
 }
 const centerWest=8,centerEast=w-9;
 const leftRoute=q.westStart+3,rightRoute=q.eastStart+3;
 const forgeX=4,forgeZ=q.westStart+8;
 function wing(x,z){
  if(x<0||x>=w||z<0||z>=d)return null;
  if(x>=centerWest&&x<=centerEast)return 'nave';
  if(x>=1&&x<8&&z>=q.westStart&&z<=q.westEnd)return 'west';
  if(x>=w-8&&x<w-1&&z>=q.eastStart&&z<=q.eastEnd)return 'east';
  return null;
 }
 const foot=(x,z)=>wing(x,z)!==null;
 const flue=(x,z)=>smith&&Math.abs(x-forgeX)<=1&&Math.abs(z-forgeZ)<=1;
 function passage(x,z){
  return (x>=mid&&x<mid+2)||
   (z>=leftRoute&&z<leftRoute+2&&x>=3&&x<=mid)||
   (z>=rightRoute&&z<rightRoute+2&&x>=mid+1&&x<=w-4);
 }
 function roofY(x,z){
  const side=wing(x,z);
  if(side==='west')return 11+Math.min(2,Math.floor((z-q.westStart)/9));
  if(side==='east')return 12+Math.min(2,Math.floor((q.eastEnd-z)/9));
  const apex=Math.min(x-centerWest,centerEast-x),north=Math.min(z,d-1-z);
  switch(q.roofForm){
   case 'cantilever-gable':return 15+Math.min(4,Math.floor(apex/3));
   case 'monitor-roof':return 16+Math.min(4,Math.floor(apex/3))+(z>d*.37&&z<d*.63?1:0);
   case 'courtyard-hip':return 15+Math.min(5,Math.floor(Math.min(apex,north)/3));
   case 'open-vent-canopy':return 15+Math.min(3,Math.floor(apex/4))+(z%10<3?1:0);
   case 'saw-light':return 15+Math.floor(z/7)%3+Math.floor(apex/6);
   case 'terrace-nave':return 15+Math.floor(z/10)+Math.floor(apex/5);
   case 'steep-gambrel':return 16+Math.min(5,Math.floor(apex/2));
   case 'clipped-hip':return 15+Math.min(4,Math.floor(Math.min(apex,north)/3));
   case 'snowmonitor':return 16+Math.min(4,Math.floor(apex/3))+(z%13<4?2:0);
   case 'canopy-lantern':return 15+Math.min(4,Math.floor((apex+z%8)/4));
   case 'split-arc':return 15+Math.min(4,Math.floor((apex+z%5)/3));
   case 'cliff-step':return 15+Math.floor(z/10)+Math.floor(apex/6);
   default:throw Error('Unknown individually authored roof '+q.roofForm);
  }
 }
 // The east-side work courtyard is open TO SKY but remains a continuous
 // physical ground-floor loading area, not a deleted topological placeholder.
 function openCourt(x,z){
  if(flue(x,z))return true;
  return wing(x,z)==='east'&&x>=w-6&&x<=w-3&&z>=q.courtStart&&z<=q.courtEnd;
 }
 function opening(x,y,z){
  if(z===d-1&&x>=mid&&x<mid+2&&y>=2&&y<=5)return true;
  if(x===1&&y>=2&&y<=5&&z>=q.westStart+2&&z<q.westStart+5)return true;
  if(x===w-2&&y>=2&&y<=5&&z>=q.eastEnd-6&&z<q.eastEnd-3)return true;
  if((x===centerWest||x===centerEast)&&y>=5&&y<=7&&z>=Math.floor(d*.32)&&z<Math.floor(d*.32)+4)return true;
  return false;
 }
 // Real load-bearing ground and a three-branch floorplate.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  add('foundation',x,0,z,P.stone);
  add('floor',x,1,z,smith?P.slab:P.plank);
 }
 // The perimeters genuinely wrap returns of the two asymmetrical side wings.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  if(foot(x-1,z)&&foot(x+1,z)&&foot(x,z-1)&&foot(x,z+1))continue;
  const upper=wing(x,z)==='nave'?11:9;
  for(let y=2;y<=upper;y++)if(!opening(x,y,z))
   add('wall',x,y,z,wing(x,z)==='west'?P.plank:P.stone);
 }
 // Source-backed open masonry chimney built without a physically fake cap.
 if(smith){
  for(let y=2;y<=23;y++)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
   if(dx===0&&dz===0)continue;
   add('cold-flue-masonry',forgeX+dx,y,forgeZ+dz,P.stone);
  }
  add('fixture',forgeX,2,forgeZ,P.fireplace,{orientation:'north',state:{}});
  features.push({name:'cold firebox and open smoke-shaft, NOT a working furnace',position:[forgeX,2,forgeZ],assetRef:P.fireplace,active:false});
 }
 // Each of the three volumes receives its OWN solid-coordinate roof plane;
 // open east court and furnace flue have no imaginary opaque roof blocks.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)&&!openCourt(x,z)){
  const y=roofY(x,z);
  add('roof',x,y,z,q.biome==='snow'||q.biome==='mountain'?P.slate:P.roof);
 }
 // Source purlins and supported piers are only placed clear of corridors and
 // the open court; these witness structural positions, NOT engineer strength.
 for(let z=2;z<d-2;z++){
  if(z%3===0)for(let x=2;x<w-2;x++)if(foot(x,z)&&!openCourt(x,z)&&!flue(x,z)){
   const y=roofY(x,z)-1;
   if(!has(x,y,z))add('roof-purlin',x,y,z,P.beam);
  }
  if(z%q.pierStride!==0)continue;
  for(const x of [3,9,w-10,w-4]){
   if(!foot(x,z)||openCourt(x,z)||flue(x,z)||passage(x,z))continue;
   const top=roofY(x,z)-1;
   for(let y=2;y<top;y++)if(!has(x,y,z))add('support-pier',x,y,z,P.post);
  }
 }
 const divZ=Math.floor(d*.57);
 for(let x=centerWest+1;x<centerEast;x++)if(!passage(x,divZ))
  for(let y=2;y<=6;y++)if(!has(x,y,divZ))
   add('room-divider',x,y,divZ,smith?P.stone:P.plank);
 // Orientation-aware fixtures in the two low side wings, off public aisles.
 const tools=[
  {x:w-5,z:(q.eastEnd-3)%q.pierStride===0?q.eastEnd-4:q.eastEnd-3,ref:P.anvil,variant:'blackiron-horn',label:smith?'cold hammer station':'plate shaping bench'},
  {x:6,z:q.westEnd-3,ref:P.crate,variant:null,label:smith?'separate metalstock crate':'equipment crate'}
 ];
 for(const t of tools){
  if(!foot(t.x,t.z)||passage(t.x,t.z)||has(t.x,2,t.z))
   throw Error(q.name+' real fixture/source corridor collision '+key(t.x,2,t.z));
  add('fixture',t.x,2,t.z,t.ref,t.variant?
    {orientation:'north',variant:t.variant,state:{}}:{orientation:'north',state:{}});
  features.push({name:t.label,position:[t.x,2,t.z],assetRef:t.ref,active:false});
 }
 const nodes=[
  {id:'gate',x:mid,y:2,z:d-1,width:2,headroom:3},
  {id:'nave-front',x:mid,y:2,z:d-7,width:2,headroom:3},
  {id:'nave-rear',x:mid,y:2,z:3,width:2,headroom:3},
  {id:'west-cold-work',x:4,y:2,z:leftRoute,width:2,headroom:3},
  {id:'east-open-court',x:w-5,y:2,z:rightRoute,width:2,headroom:3}
 ];
 const b={id:slotId(q.type,q.biome,q.size,5),type:q.type,biome:q.biome,size:q.size,variant:5,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',facing:'south',x:mid,y:2,z:d-1,width:2,height:4}],
  clearances:[{x:mid,y:2,z:2,width:2,height:3,depth:d-2},
    {x:3,y:2,z:leftRoute,width:mid-2,height:3,depth:2},
    {x:mid+1,y:2,z:rightRoute,width:w-mid-4,height:3,depth:2}],
  spaces:[
   {id:'nave-front',kind:smith?'anvil-hammering-and-reception':'plate-measuring-and-public-fitting',
    bounds:{x:centerWest,y:2,z:d-13,width:centerEast-centerWest+1,height:6,depth:11},accessNode:'nave-front'},
   {id:'nave-rear',kind:smith?'independent-cold-metal-handling':'sallet-and-harness-finished-stock',
    bounds:{x:centerWest,y:2,z:2,width:centerEast-centerWest+1,height:6,depth:Math.floor(d*.48)},accessNode:'nave-rear'},
   {id:'west-cold-work',kind:smith?'cold-firebox-and-bellows-wing':'material-repair-and-sewing-room',
    bounds:{x:1,y:2,z:q.westStart,width:7,height:6,depth:q.westEnd-q.westStart+1},accessNode:'west-cold-work'},
   {id:'east-open-court',kind:smith?'open-sky-iron-stock-and-cooling':'unroofed-armor-loading-court',
    bounds:{x:w-8,y:2,z:q.eastStart,width:7,height:6,depth:q.eastEnd-q.eastStart+1},accessNode:'east-open-court'}
  ],
  navigation:{entry:'gate',nodes,edges:[
   {from:'gate',to:'nave-front',kind:'level'},
   {from:'nave-front',to:'nave-rear',kind:'level'},
   {from:'nave-rear',to:'west-cold-work',kind:'level'},
   {from:'nave-front',to:'east-open-court',kind:'level'}]},
  features,dependencies:[
   'Real Pack physical-family orientation, mounts and multi-cell reservations must pass external fit gate',
   'Roof-load, open courtyard drainage, flashings and high roof support NOT engineered or accepted',
   smith?'Pack4:063 chimney cap is symbolic and uninstalled; fire heat NOT activated':'No armorer smithing, equipment crafting or active NPCs',
   'No live voxel world integration, new save IDs, game runtime, physical iPhone or artwork approval'],
  architecture:{brief:q.name,program:'asymmetric west atelier + tall central nave + open-sky east return courtyard',
   sideWingPlans:{west:[q.westStart,q.westEnd],east:[q.eastStart,q.eastEnd]},
   trueEastRoofOpenCourt:[q.courtStart,q.courtEnd],
   primaryRoof:q.roofForm,sourcePierStride:q.pierStride,physicalRoofVolumeCount:3,
   sourceAccessibleWorkRooms:4,
   sourceHollowColdFlue:smith?{x:forgeX,z:forgeZ,openFromY:3,openThroughY:23}:null,
   noCapInstalled:true,physicalHeatApproved:false,roofLoadCertified:false,
   weatherproofCourtyardApproved:false,creatorApproved:false,worldPlaced:false}
 };
 validateBlueprint(b);
 return b;
}
export function createM2FifthVariant(type,biome,size){
 const spec=M2_FIFTH_VARIANT_SPECS.find(s=>s.type===type&&s.biome===biome&&s.size===size);
 if(!spec)throw RangeError('No exclusive fifth-variant metalwork architecture');
 return build(spec);
}
export function createM2FifthVariantPool(){return M2_FIFTH_VARIANT_SPECS.map(build);}
