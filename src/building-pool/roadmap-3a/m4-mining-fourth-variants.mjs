/**
 * Builder 3A M4 fourth-variant mining workshops: fifteen original radial
 * switchback/chevron quarry-headworks, one source brief per biome × size.
 *
 * Distinct from M1 sheds, M4 second five-finger combs and M4 third double-
 * court rings: four physically tapered diagonal hoist/service wings extend
 * from an enclosed axial oreway and a taller central weigh/hoist tower.
 * Real north sorting and south wagon halls, asymmetric supported roofs,
 * detached-void exterior working gaps, 2-wide × 3-high circulation, and
 * unpowered real Pack1–5 source family physical dependencies.
 * Source candidate only. Do NOT register/merge/place/deploy or change saves.
 */
import {BIOMES,SIZES,slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
const P=Object.freeze({stone:'pack1:002',slab:'pack1:007',post:'pack1:010',
 plank:'pack2:013',girder:'pack2:015',roof:'pack3:023',slate:'pack3:025',
 stock:'pack4:057'});
// biome|size|independent site's work identity|width|depth|northHall|southHall|
// northwestZ|southwestZ|northeastZ|southeastZ|northwestLen|southwestLen|
// northeastLen|southeastLen|westReach|eastReach|foldStride|pierStride|roof
const COMMISSIONS=[
'temperate|small|fernford-radial-quartz-tram-cross|49|55|9|9|13|34|18|33|12|10|11|12|13|12|3|5|switchback-saw',
'temperate|medium|rillgate-four-shaft-hub|55|62|10|10|15|39|21|38|14|12|13|13|15|14|4|6|split-gantry',
'temperate|large|millstone-grand-radial-minery|64|71|11|11|17|46|24|45|16|13|15|15|17|17|5|8|twin-overhead',
'desert|small|aridpass-ore-rose-gantry|50|56|9|9|14|35|19|34|12|10|11|12|12|14|3|5|sunshade-stagger',
'desert|medium|sunquay-crosspit-bulkgrader|56|63|10|10|16|40|22|39|14|11|13|14|14|16|4|7|vented-quoin',
'desert|large|ambercliff-radial-stone-exchange|65|72|12|10|18|46|25|47|15|14|15|14|18|16|5|8|desert-lantern',
'snow|small|whitepass-quoin-and-hoist-cross|51|57|10|9|15|36|20|35|12|11|12|11|14|13|3|6|frost-facet',
'snow|medium|frostfall-four-approach-minery|57|64|11|10|17|40|23|41|13|13|13|14|16|15|4|7|snow-split-hip',
'snow|large|icegate-cold-radial-sorting-fort|66|73|12|11|19|48|26|46|16|13|15|16|18|17|5|9|snow-highridge',
'enchanted-forest|small|lumenroot-starstone-grade-hall|52|58|10|10|15|37|20|36|13|11|12|12|15|13|3|6|mosslight-vault',
'enchanted-forest|medium|moonfen-oreway-spoked-workshop|58|65|11|11|18|42|24|40|14|13|14|14|16|16|4|8|canopy-split',
'enchanted-forest|large|crystalheart-pentagonal-shaftworks|67|74|12|12|20|49|27|47|16|14|16|16|19|17|5|9|root-lantern',
'mountain|small|cliffpath-four-slope-quarry|53|59|11|9|16|38|21|37|13|11|12|12|15|15|3|6|stone-cantilever',
'mountain|medium|highspur-switchback-mineral-keep|59|66|12|10|18|42|24|42|15|13|14|14|17|16|4|8|ridge-pylon',
'mountain|large|skycut-great-cross-ore-exchange|68|75|13|12|21|50|28|48|16|14|16|16|19|18|5|9|high-clifffold'
];
const KEYS=['biome','size','name','width','depth','north','south','northwestZ',
 'southwestZ','northeastZ','southeastZ','northwestLen','southwestLen',
 'northeastLen','southeastLen','westReach','eastReach','foldStride','pierStride','roofProfile'];
export const M4_MINING_FOURTH_SPECS=Object.freeze(COMMISSIONS.map(line=>{
 const parts=line.split('|');
 if(parts.length!==KEYS.length)throw Error('Incomplete radial quarry commission '+line);
 return Object.freeze(Object.fromEntries(KEYS.map((key,i)=>[key,i>=3&&i<=18?Number(parts[i]):parts[i]])));
}));
if(M4_MINING_FOURTH_SPECS.length!==15||
 new Set(M4_MINING_FOURTH_SPECS.map(x=>x.name)).size!==15)
 throw Error('M4 fourth requires 15 unique source programmes');

function build(s){
 const w=s.width,d=s.depth,H=38,mid=Math.floor(w/2)-1,centerZ=Math.floor(d/2);
 // Only Skycut mountain-large: a real grounded, lower eastern retaining
 // gallery joins the high north sorting façade to the existing NE spoke.
 // The south-east camera shows the old tall exposed end as an inverted V.
 const mountainShoulder=s.biome==='mountain'&&s.size==='large';
 const wings=[
  {id:'northwest',side:'west',z:s.northwestZ,len:s.northwestLen,reach:s.westReach,slope:0},
  {id:'southwest',side:'west',z:s.southwestZ,len:s.southwestLen,reach:s.westReach+1,slope:1},
  {id:'northeast',side:'east',z:s.northeastZ,len:s.northeastLen,reach:s.eastReach,slope:2},
  {id:'southeast',side:'east',z:s.southeastZ,len:s.southeastLen,reach:s.eastReach+2,slope:3}
 ];
 const occ=new Map(),modules=new Map(),features=[];
 const key=(x,y,z)=>x+','+y+','+z,has=(x,y,z)=>occ.has(key(x,y,z));
 function put(role,x,y,z,asset,metadata=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||y<0||z<0||x>=w||y>=H||z>=d)
   throw Error(s.name+' voxel out of source bounds '+key(x,y,z));
  const k=key(x,y,z);
  if(occ.has(k))throw Error(s.name+' source geometry overlap '+k+' '+occ.get(k));
  occ.set(k,role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push(metadata===null?[x,y,z,asset]:[x,y,z,asset,Object.freeze(metadata)]);
 }
 function wingEdge(wing,z){
  const t=z-wing.z,tail=wing.len-1-t;
  const taper=Math.min(t,tail);
  // The diagonal perimeter genuinely changes X by source Z, creating four
  // long chevron ramps and different exterior footprints. Not a fixed box.
  const extended=6+Math.floor(taper*wing.reach/(wing.len-1))+
   Math.floor(Math.min(t,wing.len-1)/s.foldStride)+(wing.slope%2);
  // Large southeast loading annexes are actual grounded stone trading bays,
  // NOT narrow triangular decorative cones: hold the far perimeter at least
  // fourteen cells from the axial corridor at both ends of the chevron.
  // The interior zigzag changes with the site's authored original brief.
  // Camera-facing FAR-RIGHT is the NORTH-EAST (lower z) wing, not the
  // south-east bay. Preserve a level full-width masonry loading hall along
  // its entire original source interval: a taper there rendered as a
  // visually unsupported inverted-cone outline in genuine WebGL2 images.
  // Width stays biome-author-specific, and the other three original
  // chevrons retain their separately authored irregular outlines.
  const supported=wing.id==='northeast'&&s.size==='large'
   ?Math.max(16,s.eastReach+1-(s.northeastLen%3))
   :wing.id==='southeast'&&s.size==='large'
    ?Math.max(14,extended):extended;
  return wing.side==='west'?mid-5-supported:mid+6+supported;
 }
 function wingAt(x,z){
  for(const a of wings){
   if(z<a.z||z>=a.z+a.len)continue;
   const edge=wingEdge(a,z);
   if(a.side==='west'&&x>=edge&&x<=mid-5)return a;
   if(a.side==='east'&&x>=mid+6&&x<=edge)return a;
  }
  return null;
 }
 function zone(x,z){
  if(x<2||x>w-3||z<2||z>d-3)return null;
  if(z<=s.north&&x>=mid-16&&x<=mid+17)return 'north-laboratory-hall';
  // Masonry is occupied all the way down to bedrock (foundation y=0),
  // not a camera-facing skirt. At z=2..north it adds a low east shoulder;
  // at north+1..NE approach it forms a covered, connected bearing gallery.
  if(mountainShoulder&&z>=2&&z<s.northeastZ&&
   ((x>=mid+18&&x<=mid+20)||
    (z>s.north&&x>=mid+10&&x<=mid+20)))
   return 'mountain-northeast-grounded-retaining-gallery';
  if(z>=d-s.south&&x>=mid-17&&x<=mid+17)return 'south-freight-hall';
  // The taller central tower overrides the covered axial oreway *inside*
  // its real footprint. A genuine 2×2 roof aperture now sits over the shaft.
  if(z>=centerZ-6&&z<=centerZ+6&&x>=mid-8&&x<=mid+9)
   return 'central-elevated-hoist-gallery';
  if(x>=mid-4&&x<=mid+5)return 'covered-axial-ore-transport';
  const a=wingAt(x,z);
  return a?'diagonal-ore-spoke-'+a.id:null;
 }
 const foot=(x,z)=>zone(x,z)!==null;
 function aisle(x,z){
  // Only the new outer mountain buttress edge is solid: the original
  // north cross-arcade at z=3..4 and every recorded 2x3 route stay open.
  if(mountainShoulder&&z>=3&&z<=4&&x>=mid+18)return false;
  if(x>=mid&&x<=mid+1)return true;
  if(z>=3&&z<=4)return true;
  for(const a of wings){
   const crossing=a.z+Math.floor(a.len/2)-1;
   if(z>=crossing&&z<=crossing+1){
    const edge=wingEdge(a,z);
    if(a.side==='west'&&x>=edge+2&&x<=mid+1)return true;
    if(a.side==='east'&&x>=mid&&x<=edge-2)return true;
   }
  }
  return false;
 }
 function roofY(x,z){
  const p=zone(x,z);
  if(p==='south-freight-hall')return 15+Math.floor((mid+17-x)/9);
  if(p==='north-laboratory-hall'){
   // Mountain Skycut's exposed east sorting façade now has a true stepped
   // low ore-testing roof, not a 20+ high isolated roof tooth above the
   // retaining gallery. The high central/west sorting ridge stays original.
   if(mountainShoulder){
    // Broad, low snow-country grading-hall massing; the original high
    // exposed west ridge projected as a second floating masonry tooth.
    // Keep the central shaft tall instead of an unsupported north needle.
    const ridgeSpan=Math.min(x-(mid-16),(mid+17)-x);
    return 15+Math.min(2,Math.floor(ridgeSpan/8))+(z>=7?1:0);
   }
   const ridge=Math.min(x-(mid-16),(mid+17)-x);
   switch(s.roofProfile){
    case 'switchback-saw':case 'sunshade-stagger':case 'high-clifffold':
      return 20+Math.floor(x/8)%3+Math.floor(ridge/9);
    case 'split-gantry':case 'snow-split-hip':case 'canopy-split':
      return 21+Math.min(5,Math.floor(ridge/4));
    case 'twin-overhead':case 'frost-facet':case 'stone-cantilever':
      return 20+Math.min(5,Math.floor(ridge/5))+(x%12<4?1:0);
    case 'vented-quoin':case 'desert-lantern':case 'root-lantern':
      return 20+Math.floor(ridge/7)+Math.floor(x/13)%2;
    case 'snow-highridge':case 'mosslight-vault':case 'ridge-pylon':
      return 21+Math.floor(ridge/6)+(x%9<3?1:0);
    default:throw Error('Missing original radial quarry roof '+s.roofProfile);
   }
  }
  if(p==='mountain-northeast-grounded-retaining-gallery')
   return 12+Math.floor((z-2)/8)+(x>=mid+18?1:0);
  if(p==='central-elevated-hoist-gallery')
   return 25+Math.floor(Math.min(Math.abs(x-mid+1),Math.abs(z-centerZ))/4)
    +(Math.floor(x/8)%2);
  if(p?.startsWith('diagonal-ore-spoke-')){
   const wing=wings.find(a=>p.endsWith(a.id));
   return 14+(wing.slope%3)+Math.floor((z-wing.z)/6);
  }
  return 19+(Math.floor(z/12)%2);
 }
 function opening(x,y,z){
  return (x>=mid&&x<=mid+1&&(z===2||z===d-3)&&y>=2&&y<=5);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  put('foundation',x,0,z,P.stone);
  put('floor',x,1,z,P.slab);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  if([[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
  const p=zone(x,z),wallTop=p==='central-elevated-hoist-gallery'?18:
   // Large north-hall source façade must genuinely meet the roof underside.
   // Keep intentional 2×3 cross-aisle arcades open under load-bearing lintels.
   p==='north-laboratory-hall'?(s.size==='large'?roofY(x,z)-1:12):
   p==='mountain-northeast-grounded-retaining-gallery'?roofY(x,z)-1:9;
  // Arcaded ground-level structural edges along true two-wide workshop
  // corridors: no obstructed path disguised as a connectivity annotation.
  for(let y=2;y<=wallTop;y++)
   if(!opening(x,y,z)&&!(aisle(x,z)&&y<=5))
    put('wall',x,y,z,P.stone);
 }
 // A true load-path-visible roof step at the high/low junction. Retain
 // two-cell walkable door gaps between periodic piers, not a solid divider.
 // Fill the upper gable from the lower east roof to the existing high roof;
 // three ground-bearing piers carry it at source-authored 3-cell intervals.
 if(mountainShoulder)for(let z=3;z<=s.north;z++){
  const highX=mid+17,lowX=mid+18;
  const sill=roofY(lowX,z),crown=roofY(highX,z);
  if(sill>=crown)throw Error(s.name+' invalid mountain roof step '+z);
  for(let y=sill;y<crown;y++)if(!has(highX,y,z))
   put('mountain-northeast-roof-step-masonry',highX,y,z,P.stone);
  if(z>=5&&z%3===0)for(let y=2;y<sill;y++)if(!has(highX,y,z))
   put('mountain-northeast-ground-bearing-pier',highX,y,z,P.stone);
  // The new lower east roof also meets the retained tall western sorting
  // roof on a genuine high/low masonry gable with periodic ground piers.
  const westX=mid+9,terraceX=mid+10;
  const terrace=roofY(terraceX,z),western=roofY(westX,z);
  if(terrace>=western)throw Error(s.name+' inverted western mountain roof tier '+z);
  for(let y=terrace;y<western;y++)if(!has(westX,y,z))
   put('mountain-west-sorting-roof-step-masonry',westX,y,z,P.stone);
  if(z>=5&&z%3===0)for(let y=2;y<terrace;y++)if(!has(westX,y,z))
   put('mountain-west-sorting-ground-pier',westX,y,z,P.stone);
 }
 for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(foot(x,z)){
  const height=roofY(x,z);
  // Hoist-lightwell is a real four-cell open roof aperture, not a texture.
  if(zone(x,z)==='central-elevated-hoist-gallery'&&
    x>=mid+2&&x<=mid+3&&z>=centerZ-1&&z<=centerZ)continue;
  put('roof',x,height,z,['snow','mountain'].includes(s.biome)?P.slate:P.roof);
 }
 for(let z=3;z<d-3;z++){
  for(let x=3;x<w-3;x++)if(foot(x,z)&&(z%2===0||x%5===0)){
   const y=roofY(x,z)-1;
   if(y>=2&&!has(x,y,z)&&!(zone(x,z)==='central-elevated-hoist-gallery'&&
      x>=mid+2&&x<=mid+3&&z>=centerZ-1&&z<=centerZ))
    put('roof-purlin',x,y,z,P.girder);
  }
  if(z%s.pierStride!==0)continue;
  for(const x of [mid-13,mid-6,mid+7,mid+14]){
   if(!foot(x,z)||aisle(x,z))continue;
   const top=roofY(x,z)-1;
   for(let y=2;y<top;y++)if(!has(x,y,z))put('bearing-pier',x,y,z,P.post);
  }
 }
 // Sourced bridge-spur apparatus for physical readability, left/right
 // diagonal mining functions remain nonoperative and have real floor support.
 for(const a of wings){
  // Put real loading columns beside each chevron approach, rather than in
  // its only traversable 2-wide crossing. Interior faces are source-checked.
  let planted=0;
  for(let z=a.z+2;z<a.z+a.len-2&&planted<2;z++){
   const edge=wingEdge(a,z);
   for(let pad=2;pad<=4&&planted<2;pad++){
    const x=a.side==='west'?edge+pad:edge-pad;
    if(!foot(x,z)||aisle(x,z)||!has(x,1,z)||has(x,2,z))continue;
    for(let y=2;y<=4;y++)if(!has(x,y,z))put('ore-wagon-bay-column',x,y,z,P.post);
    planted++;
   }
  }
  if(!planted)throw Error(s.name+' missing real ore-wagon radial pier '+a.id);
 }
 for(const a of wings){
  const edgeZ=a.z+2,edge=wingEdge(a,edgeZ);
  const x=a.side==='west'?edge+4:edge-4;
  if(foot(x,edgeZ)&&!aisle(x,edgeZ)&&has(x,1,edgeZ)&&!has(x,2,edgeZ))
   put('stationary-mineral-grade-table',x,2,edgeZ,P.slab);
 }
 for(let x=mid-14;x<=mid+15;x+=6){
  const z=6;if(foot(x,z)&&!aisle(x,z)&&!has(x,2,z))
   put('sampling-index-plinth',x,2,z,P.slab);
 }
 // Vertical source-built hoist frame at the physical central tower corners.
 for(const x of [mid-7,mid+8])for(const z of [centerZ-5,centerZ+5]){
  if(!foot(x,z)||aisle(x,z))continue;
  for(let y=2;y<=23;y++)if(!has(x,y,z))put('hoist-tower-post',x,y,z,P.post);
 }
 function physicalFixture(ref,name,side){
  const options=wings.filter(a=>a.side===side);
  for(const a of options)for(let z=a.z+1;z<a.z+a.len-1;z++){
   const edge=wingEdge(a,z);
   const start=side==='west'?edge+3:mid+7;
   const stop=side==='west'?mid-7:edge-3;
   for(let x=start;x<=stop;x++){
    if(!foot(x,z)||aisle(x,z)||has(x,2,z)||!has(x,1,z))continue;
    if(![[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dz])=>foot(x+dx,z+dz)))continue;
    put('fixture',x,2,z,ref,{orientation:'north',state:{}});
    features.push({name,position:[x,2,z],assetRef:ref,active:false});
    return;
   }
  }
  throw Error(s.name+' physical fixture absent '+name);
 }
 physicalFixture(P.stock,'unpowered rough-quartz gantry storage','west');
 physicalFixture(P.slab,'unpowered assay provenance stone','east');
 const wingNodes=wings.map(a=>{
  const z=a.z+Math.floor(a.len/2)-1,edge=wingEdge(a,z);
  return {id:'spoke-'+a.id,x:a.side==='west'?edge+2:edge-3,y:2,z,width:2,headroom:3};
 });
 const nodes=[
  {id:'entry',x:mid,y:2,z:d-3,width:2,headroom:3},
  {id:'south-dispatch',x:mid,y:2,z:d-s.south+3,width:2,headroom:3},
  {id:'central-hoist',x:mid,y:2,z:centerZ,width:2,headroom:3},
  {id:'north-sorting',x:mid,y:2,z:4,width:2,headroom:3},
  ...wingNodes
 ];
 const spaces=[
  {id:'south-dispatch',kind:'south-cold-mineral-wagon-dispatch',
   bounds:{x:mid-17,y:2,z:d-s.south,width:35,height:9,depth:s.south-2},
   accessNode:'south-dispatch'},
  {id:'central-hoist',kind:'towered-inert-hoist-plenum-and-weigh-gallery',
   bounds:{x:mid-8,y:2,z:centerZ-6,width:18,height:23,depth:13},
   accessNode:'central-hoist'},
  {id:'north-sorting',kind:'north-nonoperating-sample-classification-hall',
   bounds:{x:mid-16,y:2,z:2,width:34,height:12,depth:s.north-1},
   accessNode:'north-sorting'},
  ...wings.map((a,i)=>{
   const z=a.z+Math.floor(a.len/2)-1,edge=wingEdge(a,z);
   return {id:'spoke-'+a.id,
    kind:['northwest-ore-cart-unload','southwest-cold-gravel-sieve',
     'northeast-geological-assay','southeast-block-grade-assembly'][i],
    bounds:{x:a.side==='west'?edge:mid+6,y:2,z:a.z,
      width:a.side==='west'?mid-4-edge:Math.max(2,edge-mid-5),
      height:9,depth:a.len},accessNode:'spoke-'+a.id};
  })
 ];
 const b={id:slotId('mining-workshop',s.biome,s.size,4),
  type:'mining-workshop',biome:s.biome,size:s.size,variant:4,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:H,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:mid,y:2,z:d-3,width:2,height:4,facing:'south'}],
  clearances:[
   {x:mid,y:2,z:3,width:2,height:3,depth:d-5},
   ...wings.map(a=>{
    const z=a.z+Math.floor(a.len/2)-1,edge=wingEdge(a,z);
    return a.side==='west'
     ?{x:edge+2,y:2,z,width:mid-edge,height:3,depth:2}
     :{x:mid,y:2,z,width:edge-mid-1,height:3,depth:2};
   }),
   {x:mid-2,y:2,z:centerZ-2,width:4,height:3,depth:4},
   {x:mid-3,y:2,z:3,width:6,height:3,depth:2}
  ],
  spaces,
  navigation:{entry:'entry',nodes,edges:[
   {from:'entry',to:'south-dispatch',kind:'level'},
   {from:'south-dispatch',to:'central-hoist',kind:'level'},
   {from:'central-hoist',to:'north-sorting',kind:'level'},
   ...wingNodes.map(n=>({from:'central-hoist',to:n.id,kind:'level'}))]},
  features,
  dependencies:[
   'Real source manual Pack1–5 producer family fixtures only, numeric IDs resolved at eventual handoff',
   'No automation biome130 IDs, invented runtime assets, mining generation or crafting systems',
   'True producer physical AABB support/collision/occupied offset audit required before acceptance',
   'Diagonal slope-bearing roof, tall hoist tower weather/span/load and ore chute engineering unapproved',
   'No production placement, schema1 save changes, other builder work, integrated art or iPhone control approval'],
  architecture:{originalProgramme:s.name,
   sourceFamily:'radial-four-diagonal-chevrons-with-elevated-central-hoist-tower',
   sourceWings:wings.map(a=>({side:a.side,originZ:a.z,len:a.len,reach:a.reach,foldStride:s.foldStride})),
   originalHoistRoofAperture:true,wingCount:4,
   workRegions:7,roofProfile:s.roofProfile,
   radialConnected2WidePasses:true,sourceOnly:true,
   creatorApproved:false,structuralLoadApproved:false,weatherApproved:false}
 };
 validateBlueprint(b);return b;
}
export function createM4MiningFourthVariant(biome,size){
 if(!BIOMES.includes(biome)||!SIZES.includes(size))
  throw RangeError('Only fifteen assigned fourth mining-workshop sources permitted');
 const q=M4_MINING_FOURTH_SPECS.find(s=>s.biome===biome&&s.size===size);
 if(!q)throw RangeError('Missing M4 fourth original quarry brief');
 return build(q);
}
export function createM4MiningFourthPool(){return M4_MINING_FOURTH_SPECS.map(build);}
