/**
 * Builder 3A M2 — independent third-variation metalworking architectures.
 * 30 individually authored asymmetric wings and rooflines. All integer
 * physical coordinates; schematic cold, unpowered workshops only.
 */
import {slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';

const M=Object.freeze({stone:'pack1:002',slab:'pack1:007',pier:'pack1:010',
 plank:'pack2:013',timber:'pack2:015',tile:'pack3:023',
 slate:'pack3:025',fireplace:'pack4:064',crate:'pack4:057',
 anvil:'pack5:088'});
// Exact authored spatial specification: name, footprints and independent
// left/right wing segments, cross-roof massing, pier cadence, work lanes.
const ROWS=[
'blacksmith|temperate|small|brookside-arched-forge|24|26|8|22|3|13|split-gables|5|west-lantern',
'blacksmith|temperate|medium|river-quay-smith-complex|31|32|4|18|17|29|crossing-ridges|6|open-south',
'blacksmith|temperate|large|guildyard-triptych-forge|39|37|7|32|3|21|triple-naves|7|upper-clerestory',
'blacksmith|desert|small|windcatcher-copper-forge|25|27|12|24|2|11|windcatcher|5|open-north',
'blacksmith|desert|medium|shaded-copper-workcourt|32|30|3|20|15|28|butterfly-wings|6|side-arcade',
'blacksmith|desert|large|desert-iron-smelter-court|40|39|6|35|5|23|terrace-gallery|8|roof-lantern',
'blacksmith|snow|small|winter-anvil-cabin|26|28|9|25|4|15|steep-pitch|5|upper-clerestory',
'blacksmith|snow|medium|snowguard-forge-hall|33|33|5|21|13|30|crossing-ridges|7|open-north',
'blacksmith|snow|large|icepass-smith-shipyard|41|40|8|37|3|24|triple-naves|8|snow-lightwell',
'blacksmith|enchanted-forest|small|glowwood-forge-wings|27|27|9|24|4|14|forest-canopy|5|side-arcade',
'blacksmith|enchanted-forest|medium|runehammer-clearing-hall|34|32|4|18|16|30|lantern-canopy|6|roof-lantern',
'blacksmith|enchanted-forest|large|elder-branch-smith-cloister|42|41|7|37|5|24|triple-naves|8|west-lantern',
'blacksmith|mountain|small|highcliff-smith-shed|28|28|10|25|3|15|terrace-gallery|5|open-south',
'blacksmith|mountain|medium|ridge-ore-forging-house|35|35|5|22|16|32|stepped-halls|6|snow-lightwell',
'blacksmith|mountain|large|ironpass-cliff-forge|43|42|8|39|4|27|crossing-ridges|8|upper-clerestory',
'armorer|temperate|small|quayside-shield-atelier|25|26|10|23|4|14|split-gables|5|west-lantern',
'armorer|temperate|medium|civic-harness-triptych|32|31|4|20|16|28|triple-naves|6|open-south',
'armorer|temperate|large|regimental-plate-pavilion|40|39|7|36|3|22|crossing-ridges|8|upper-clerestory',
'armorer|desert|small|oasis-scale-cuirass-house|26|28|11|25|4|13|windcatcher|5|side-arcade',
'armorer|desert|medium|sunshield-armor-arcade|33|33|5|19|18|30|butterfly-wings|7|open-north',
'armorer|desert|large|bronze-regiment-assembly-yard|41|40|7|37|5|23|terrace-gallery|8|roof-lantern',
'armorer|snow|small|frostguard-sallet-gallery|27|29|9|26|3|16|steep-pitch|6|snow-lightwell',
'armorer|snow|medium|winter-plate-doublehall|34|34|4|22|17|31|crossing-ridges|6|upper-clerestory',
'armorer|snow|large|snowline-armory-cloister|42|42|8|39|4|24|triple-naves|8|open-south',
'armorer|enchanted-forest|small|thornmail-atelier|28|29|10|25|5|15|forest-canopy|6|roof-lantern',
'armorer|enchanted-forest|medium|silverleaf-shield-court|35|35|5|22|16|33|lantern-canopy|7|west-lantern',
'armorer|enchanted-forest|large|moonsteel-harness-compound|43|43|9|39|5|26|triple-naves|8|open-north',
'armorer|mountain|small|granite-sallet-shop|29|30|11|27|3|17|stepped-halls|6|side-arcade',
'armorer|mountain|medium|highridge-breastplate-hall|36|36|5|23|18|33|terrace-gallery|7|snow-lightwell',
'armorer|mountain|large|bastion-armor-workcourt|44|44|8|40|5|27|crossing-ridges|9|upper-clerestory'
];
const F=['type','biome','size','name','width','depth','westStart','westEnd','eastStart','eastEnd','roofPlan','pierStride','daylightPlan'];
export const M2_THIRD_VARIANT_SPECS=Object.freeze(ROWS.map(s=>{
 const a=s.split('|');if(a.length!==F.length)throw Error('Invalid authored 3A M2 spatial record '+s);
 return Object.freeze(Object.fromEntries(F.map((name,i)=>[name,[4,5,6,7,8,9,11].includes(i)?Number(a[i]):a[i]])));
}));
if(M2_THIRD_VARIANT_SPECS.length!==30)throw Error('Expected precisely thirty authentic metalwork variants');

function build(q){
 const {width:w,depth:d}=q, h=28,mid=Math.floor(w/2)-1,smith=q.type==='blacksmith';
 const modules=new Map(),occupied=new Map(),features=[];
 const key=(x,y,z)=>[x,y,z].join(',');
 const has=(x,y,z)=>occupied.has(key(x,y,z));
 function put(role,x,y,z,material,attachment=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=h||z<0||z>=d)
   throw Error(q.name+' out of authored 3D envelope '+key(x,y,z));
  const id=key(x,y,z);
  if(occupied.has(id))throw Error(q.name+' overlapping physical source at '+id);
  occupied.set(id,material);
  if(!modules.has(role))modules.set(role,[]);
  const cell=[x,y,z,material];
  if(attachment)cell.push(Object.freeze(attachment));
  modules.get(role).push(cell);
 }
 // Three disjoint but connected spatial bands: central hall + differently
 // offset west and east external workshops. The central two-wide spine persists
 // from the public south entrance to all interior rooms.
 function foot(x,z){
  if(x<0||x>=w||z<0||z>=d)return false;
  if(x>=6&&x<w-6)return true;
  if(x<6)return z>=q.westStart&&z<=q.westEnd;
  return z>=q.eastStart&&z<=q.eastEnd;
 }
 function roofHeight(x,z){
  const a=Math.min(x,w-1-x),p=Math.min(z,d-1-z);
  const wing=x<6?'west':x>=w-6?'east':'center';
  const wingRise=wing==='west'?2:wing==='east'?0:3;
  switch(q.roofPlan){
   case 'split-gables':return 9+wingRise+Math.min(4,Math.floor(a/4));
   case 'crossing-ridges':return 10+wingRise+Math.min(3,Math.floor(p/5))+Math.floor(z/15);
   case 'triple-naves':return 9+wingRise+Math.min(4,Math.floor(a/5))+Math.floor(z/17);
   case 'windcatcher':return 10+wingRise+Math.floor(z/8);
   case 'butterfly-wings':return 10+wingRise+Math.floor(Math.abs(x-w/2)/7);
   case 'terrace-gallery':return 9+wingRise+Math.floor(x/10)+Math.floor(z/13);
   case 'steep-pitch':return 10+wingRise+Math.min(5,Math.floor(Math.min(a,p)/3));
   case 'forest-canopy':return 10+wingRise+Math.min(4,Math.floor((a+(z%7))/5));
   case 'lantern-canopy':return 10+wingRise+Math.min(4,Math.floor((p+x%9)/5));
   case 'stepped-halls':return 9+wingRise+Math.floor(x/8)+Math.floor(z/12);
   default:throw Error('Unmapped individually authored roof');
  }
 }
 function openRoof(x,z){
  switch(q.daylightPlan){
   case 'west-lantern':return x>=2&&x<5&&z>q.westStart+2&&z<q.westEnd-2;
   case 'open-south':return x>=w-6&&z>=d-12&&z<d-7;
   case 'upper-clerestory':return x>=w-6&&z>q.eastStart+3&&z<q.eastEnd-3;
   case 'open-north':return x>=2&&x<5&&z>=q.westStart+2&&z<q.westStart+7;
   case 'side-arcade':return x>=w-5&&x<w-2&&z>q.eastStart+2&&z<q.eastEnd-2;
   case 'roof-lantern':return x>=w-8&&x<w-6&&z>q.eastStart+2&&z<q.eastEnd-2;
   case 'snow-lightwell':return x>=w-5&&x<w-2&&z>q.eastStart+3&&z<q.eastEnd-4;
   default:throw Error('Unmapped individual daylight');
  }
 }
 function opening(x,y,z){
  if(z===d-1&&x>=mid&&x<mid+2&&y>=2&&y<=5)return true;
  if(y>=4&&y<=6&&((x===6&&z>=d-10&&z<d-7)||
    (x===w-7&&z>=7&&z<10)))return true;
  if(x===0&&z>=q.westStart+2&&z<q.westStart+5&&y>=2&&y<=5)return true;
  if(x===w-1&&z>=q.eastEnd-5&&z<q.eastEnd-2&&y>=2&&y<=5)return true;
  return false;
 }
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  put('foundation',x,0,z,M.stone);
  put('floor',x,1,z,smith?M.slab:M.plank);
 }
 // Walls follow the wing's actual asymmetric convex and concave exterior.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  const exterior=!foot(x-1,z)||!foot(x+1,z)||!foot(x,z-1)||!foot(x,z+1);
  if(!exterior)continue;
  for(let y=2;y<=9;y++){
   if(opening(x,y,z))continue;
   put('wall',x,y,z,smith?M.stone:M.plank);
  }
 }
 // Distinct roof surfaces for the three spatial bands, not a single
 // rectangular shell or a cosmetic material switch.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!foot(x,z)||openRoof(x,z))continue;
  const y=roofHeight(x,z);
  put('roof',x,y,z,q.biome==='snow'||q.biome==='mountain'?M.slate:M.tile);
 }
 // Real ground-to-roof support posts and beams. No fabricated engineering signoff.
 for(let z=3;z<d-3;z+=q.pierStride){
  for(const x of [7,w-8,3,w-4]){
   if(!foot(x,z)||openRoof(x,z))continue;
   for(let y=2;y<roofHeight(x,z);y++){
    if(!has(x,y,z))put('support-pier',x,y,z,x<6||x>=w-6?M.timber:M.pier);
   }
  }
  for(let x=8;x<w-8;x++){
   if(!foot(x,z)||openRoof(x,z))continue;
   const y=roofHeight(x,z)-1;
   if(!has(x,y,z))put('roof-purlin',x,y,z,M.timber);
  }
 }
 // Cross-hall partition, all eight cells of the 2-wide doorway remain open.
 const partitionZ=Math.floor(d*.50);
 for(let x=7;x<w-7;x++){
  if(x>=mid&&x<mid+2)continue;
  for(let y=2;y<=6;y++){
   if(!has(x,y,partitionZ))put('work-zone-divider',x,y,partitionZ,smith?M.stone:M.plank);
  }
 }
 // Work-specific physical stations. Smith's hollow shaft is in the west
 // portion of the central hall; it is NOT the unapproved Pack4 chimney cap.
 const fx=8,fz=d-10;
 if(smith){
  // Hollow shaft ring: masonry with open flue from y=3 to y=22 inclusive.
  for(let y=2;y<=22;y++)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
   if(dx===0&&dz===0)continue;
   const x=fx+dx,z=fz+dz;
   if(has(x,y,z))throw Error(q.name+' chimney shell intersects occupied structural source');
   put('cold-flue-masonry',x,y,z,M.stone);
  }
  put('fixture',fx,2,fz,M.fireplace,{orientation:'north',state:{}});
  features.push({name:'cold hearth with masonry back support and open shaft',position:[fx,2,fz],assetRef:M.fireplace,active:false});
 }
 // Storage stands in independent wing and different loading directions.
 const storageX=smith?w-9:w-10;
 for(let z=7;z<d-5;z+=q.pierStride){
  if(!has(storageX,2,z)&&foot(storageX,z))for(let y=2;y<=4;y++)
   if(!has(storageX,y,z))put(smith?'metal-stock-rack':'harness-fitting-rack',storageX,y,z,M.timber);
 }
 const anvilX=smith?w-11:8,anvilZ=d-6;
 if(!foot(anvilX,anvilZ)||has(anvilX,2,anvilZ))throw Error(q.name+' anvil collision');
 put('fixture',anvilX,2,anvilZ,M.anvil,{orientation:'north',variant:'blackiron-horn',state:{}});
 features.push({name:smith?'separate anvil-hammering station':'cold armor-plate shaping station',position:[anvilX,2,anvilZ],assetRef:M.anvil,active:false});
 const crateX=w-10,crateZ=6;
 if(!foot(crateX,crateZ)||has(crateX,2,crateZ))throw Error(q.name+' stock crate intersects structure');
 put('fixture',crateX,2,crateZ,M.crate,{orientation:'north',state:{}});
 features.push({name:'nonfunctional parts crate',position:[crateX,2,crateZ],assetRef:M.crate,active:false});
 const nodes=[{id:'entry',x:mid,y:2,z:d-1,width:2,headroom:3},
 {id:'front',x:mid,y:2,z:d-7,width:2,headroom:3},
 {id:'rear',x:mid,y:2,z:4,width:2,headroom:3}];
 const b={id:slotId(q.type,q.biome,q.size,3),type:q.type,biome:q.biome,size:q.size,variant:3,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:h,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',facing:'south',x:mid,y:2,z:d-1,width:2,height:4}],
  clearances:[{x:mid,y:2,z:2,width:2,height:3,depth:d-2}],
  spaces:[{id:'front',kind:smith?'separated-cold-forge-and-anvil':'armorer-shaping-fitting',
   bounds:{x:6,y:2,z:d-13,width:w-12,height:6,depth:11},accessNode:'front'},
   {id:'rear',kind:smith?'metal-and-fuel-wing-stock':'harness-and-plate-wing-stock',
   bounds:{x:6,y:2,z:2,width:w-12,height:6,depth:d-14},accessNode:'rear'}],
  navigation:{entry:'entry',nodes,edges:[{from:'entry',to:'front',kind:'level'},{from:'front',to:'rear',kind:'level'}]},
  features,
  dependencies:['Producer Pack 1-5 oriented physical shape collision review unresolved',
   'Roof rain flashing, span certification and source heat safety not approved',
   smith?'Pack4:063 chimney-cap assembly remains symbolic; cold hollow masonry only':'No powered armor tooling or crafting enabled',
   'No world placement, schema-1 save, NPCs, behavior or iPhone-hardware testing'],
  architecture:{brief:q.name,roofPlan:q.roofPlan,wingSegments:{west:[q.westStart,q.westEnd],east:[q.eastStart,q.eastEnd]},
   sourcePattern:'connected asymmetric left and right functional wings + raised hall',
   upperDaylight:q.daylightPlan,pierStride:q.pierStride,threeIndependentRoofVolumes:true,
   coldHollowFlue:smith?{x:fx,z:fz,openFromY:3,openThroughY:22}:null,
   chimneyCapInstalled:false,structuralLoadApproved:false,weatherApproved:false,heatApproved:false,
   noProductionRegistration:true}
 };
 validateBlueprint(b);
 return b;
}
export function createM2ThirdVariant(type,biome,size){
 const row=M2_THIRD_VARIANT_SPECS.find(s=>s.type===type&&s.biome===biome&&s.size===size);
 if(!row)throw RangeError('No authorized third-variant metalwork architecture here');
 return build(row);
}
export function createM2ThirdVariantPool(){return M2_THIRD_VARIANT_SPECS.map(build);}
