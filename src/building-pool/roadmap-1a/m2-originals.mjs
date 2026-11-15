// Builder 1A: eight independently drafted, integer-coordinate domestic/hospitality plans.
// The literal room/partition/portal/fixture tables are architectural input, not seeds or palettes.
// No global ID, runtime, save, or production placement mutations.
import {SCHEMA,blueprintId,validateBlueprint} from './legacy-schema.mjs';

const FULL=Object.freeze({kind:'full-cell',bounds:[0,0,0,1,1,1]});
const pending=asset=>({kind:'unresolved',bounds:null,reason:asset+' physical AABB/support/rotation/load and save ABI pending central acceptance'});
const key=(x,y,z)=>[x,y,z].join(',');
const room=(id,x0,z0,x1,z1)=>({id,min:[x0,1,z0],max:[x1+1,4,z1+1]});
const door=(x,z,from,to)=>({at:[x,1,z],from,to});
const bed=(x,z,id)=>({x,z,room:id,asset:'pack5:082',variant:'wanderer-quilt'});
const furnish=(x,z,id,asset='pack4:059')=>({x,z,room:id,asset});

// All segments specify exact [x0,z0,x1,z1] local grid endpoints, inclusive.
const DESIGNS=Object.freeze([
 {
  category:'house',biome:'desert',size:'small',index:2,title:'Windshade Terrace Dwelling',w:16,d:15,
  plan:'rear-sleeping-with-transverse-service-niche',roof:'terrace',skin:'pack5:080',roofAsset:'pack3:024',
  segments:[[2,7,13,7],[10,8,10,12]],
  entry:[8,1,'living'],doors:[door(6,7,'living','sleeping'),door(10,10,'sleeping','pantry')],
  rooms:[room('living',2,2,13,6),room('sleeping',2,8,9,12),room('pantry',11,8,13,12)],
  windows:[[3,1,'north'],[13,1,'north'],[1,5,'west'],[14,10,'east'],[4,13,'south']],
  fixtures:[furnish(4,4,'living'),furnish(11,4,'living','pack4:058'),bed(3,9,'sleeping'),furnish(12,11,'pantry','pack4:057')],
  posts:[3,12],detail:'shade-terrace-and-front-dune-posts'
 },
 {
  category:'house',biome:'snow',size:'medium',index:2,title:'Frostpine Cross-Hall Residence',w:20,d:18,
  plan:'central-spine-with-opposed-sleeping-and-cooking-wings',roof:'steep',skin:'live:wood',roofAsset:'pack3:025',
  segments:[[7,2,7,15],[12,2,12,15],[8,10,11,10]],
  entry:[9,1,'spine'],doors:[door(7,5,'spine','sleeping'),door(12,6,'spine','kitchen'),door(10,10,'spine','library')],
  rooms:[room('spine',8,2,11,9),room('sleeping',2,2,6,15),room('kitchen',13,2,17,15),room('library',8,11,11,15)],
  windows:[[3,1,'north'],[16,1,'north'],[1,8,'west'],[18,9,'east'],[10,16,'south']],
  fixtures:[furnish(10,4,'spine','pack4:064'),bed(3,11,'sleeping'),furnish(15,11,'kitchen','pack4:057'),furnish(9,13,'library','pack5:084')],
  posts:[4,15],detail:'winter-break-porch-with-high-gable'
 },
 {
  category:'house',biome:'mountain',size:'large',index:2,title:'Stonepass Open-Court Hall',w:25,d:22,
  plan:'front-hall-to-sun-court-with-two-service-wings',roof:'courtyard',skin:'pack1:006',roofAsset:'pack3:025',
  segments:[[2,8,22,8],[8,9,8,19],[16,9,16,19],[2,15,7,15],[17,15,22,15]],
  entry:[12,1,'hearth-hall'],doors:[door(12,8,'hearth-hall','court'),door(8,13,'court','sleeping'),door(16,13,'court','kitchen'),door(5,15,'sleeping','study'),door(20,15,'kitchen','store')],
  rooms:[room('hearth-hall',2,2,22,7),room('court',9,9,15,19),room('sleeping',2,9,7,14),room('study',2,16,7,19),room('kitchen',17,9,22,14),room('store',17,16,22,19)],
  windows:[[4,1,'north'],[21,1,'north'],[1,11,'west'],[23,12,'east'],[5,20,'south'],[20,20,'south']],
  fixtures:[furnish(10,4,'hearth-hall','pack4:064'),furnish(14,5,'hearth-hall'),bed(3,11,'sleeping'),furnish(5,18,'study','pack5:084'),furnish(20,11,'kitchen','pack4:057'),furnish(20,18,'store','pack4:057')],
  courtyard:[10,10,14,16],posts:[6,18],detail:'mountain-courtyard-and-double-flank-rooms'
 },
 {
  category:'tavern',biome:'temperate',size:'small',index:2,title:'Copper Kettle Wayside',w:16,d:16,
  plan:'offset-taproom-and-rear-service-lane',roof:'hip',skin:'pack2:013',roofAsset:'pack3:023',
  segments:[[2,9,13,9],[9,10,9,13]],
  entry:[5,1,'taproom'],doors:[door(4,9,'taproom','kitchen'),door(9,11,'kitchen','store')],
  rooms:[room('taproom',2,2,13,8),room('kitchen',2,10,8,13),room('store',10,10,13,13)],
  windows:[[3,1,'north'],[12,1,'north'],[1,6,'west'],[14,7,'east'],[3,14,'south']],
  fixtures:[furnish(7,3,'taproom','pack4:059'),furnish(11,6,'taproom','pack4:058'),furnish(5,11,'kitchen','pack4:064'),furnish(11,12,'store','pack4:057')],
  posts:[3,10],detail:'asymmetric-porch-and-hipped-alewing'
 },
 {
  category:'tavern',biome:'enchanted-forest',size:'medium',index:2,title:'Silverleaf Lantern Gallery',w:21,d:20,
  plan:'parallel-gallery-with-four-cross-hall-serving-bays',roof:'butterfly',skin:'pack2:013',roofAsset:'pack3:023',
  segments:[[8,2,8,17],[13,2,13,17],[2,10,7,10],[14,10,18,10]],
  entry:[10,1,'gallery'],doors:[door(8,5,'gallery','taproom'),door(13,6,'gallery','seating'),door(8,14,'gallery','kitchen'),door(13,15,'gallery','store')],
  rooms:[room('gallery',9,2,12,17),room('taproom',2,2,7,9),room('seating',14,2,18,9),room('kitchen',2,11,7,17),room('store',14,11,18,17)],
  windows:[[3,1,'north'],[17,1,'north'],[1,6,'west'],[19,7,'east'],[4,18,'south'],[17,18,'south']],
  fixtures:[furnish(4,4,'taproom','pack4:059'),furnish(16,5,'seating','pack4:058'),furnish(4,14,'kitchen','pack4:064'),furnish(16,15,'store','pack4:057'),furnish(10,9,'gallery','pack4:059')],
  posts:[6,14],detail:'lantern-arcade-with-inverted-butterfly-profile'
 },
 {
  category:'inn',biome:'desert',size:'medium',index:1,title:'Oasis Caravan Court',w:23,d:20,
  plan:'front-desk-to-open-court-with-four-guest-bays',roof:'courtyard',skin:'pack5:080',roofAsset:'pack3:024',
  segments:[[2,6,20,6],[8,7,8,17],[14,7,14,17],[2,13,7,13],[15,13,20,13]],
  entry:[11,1,'reception'],doors:[door(11,6,'reception','court'),door(8,10,'court','west-front'),door(14,10,'court','east-front'),door(5,13,'west-front','west-rear'),door(18,13,'east-front','east-rear')],
  rooms:[room('reception',2,2,20,5),room('court',9,7,13,17),room('west-front',2,7,7,12),room('east-front',15,7,20,12),room('west-rear',2,14,7,17),room('east-rear',15,14,20,17)],
  windows:[[4,1,'north'],[18,1,'north'],[1,9,'west'],[21,9,'east'],[4,18,'south'],[18,18,'south']],
  fixtures:[furnish(8,4,'reception','pack4:059'),furnish(14,4,'reception','pack4:058'),bed(3,9,'west-front'),bed(17,9,'east-front'),bed(3,15,'west-rear'),bed(17,15,'east-rear')],
  courtyard:[9,8,13,12],posts:[5,17],detail:'four-wings-around-open-sand-court'
 },
 {
  category:'inn',biome:'snow',size:'small',index:1,title:'Frostgate Hearth Lodge',w:18,d:17,
  plan:'front-commons-leading-into-bent-guest-corridor',roof:'steep',skin:'live:wood',roofAsset:'pack3:025',
  segments:[[2,7,15,7],[7,8,7,14],[8,11,15,11],[2,11,6,11]],
  entry:[9,1,'commons'],doors:[door(5,7,'commons','hall'),door(7,10,'hall','guest-front'),door(4,11,'hall','linen'),door(12,11,'guest-front','guest-back')],
  rooms:[room('commons',2,2,15,6),room('hall',2,8,6,10),room('linen',2,12,6,14),room('guest-front',8,8,15,10),room('guest-back',8,12,15,14)],
  windows:[[3,1,'north'],[14,1,'north'],[1,5,'west'],[16,9,'east'],[13,15,'south']],
  fixtures:[furnish(7,4,'commons','pack4:064'),furnish(10,4,'commons','pack4:059'),furnish(4,13,'linen','pack4:057'),bed(12,8,'guest-front'),bed(14,12,'guest-back')],
  posts:[3,14],detail:'snowbreak-porch-and-bent-guest-access'
 },
 {
  category:'inn',biome:'mountain',size:'large',index:1,title:'Ridgewarden Resthouse',w:25,d:22,
  plan:'deep-central-spine-with-four-lodging-wings-and-service-hall',roof:'sawtooth',skin:'pack1:006',roofAsset:'pack3:025',
  segments:[[9,2,9,19],[15,2,15,19],[2,11,8,11],[16,11,22,11],[10,7,14,7]],
  entry:[12,1,'reception'],doors:[door(12,7,'reception','spine'),door(9,5,'reception','west-front'),door(15,5,'reception','east-front'),door(9,14,'spine','west-back'),door(15,15,'spine','east-back')],
  rooms:[room('reception',10,2,14,6),room('spine',10,8,14,19),room('west-front',2,2,8,10),room('east-front',16,2,22,10),room('west-back',2,12,8,19),room('east-back',16,12,22,19)],
  windows:[[4,1,'north'],[20,1,'north'],[1,6,'west'],[23,6,'east'],[1,16,'west'],[23,16,'east'],[4,20,'south'],[20,20,'south']],
  fixtures:[furnish(11,4,'reception','pack4:059'),furnish(13,4,'reception','pack4:058'),furnish(11,11,'spine','pack4:064'),bed(4,6,'west-front'),bed(19,6,'east-front'),bed(4,16,'west-back'),bed(19,16,'east-back')],
  posts:[5,19],detail:'ridge-sawtooth-bay-and-four-lodging-wings'
 }
]);

function create(d){
 const wallTop=4,height=12,occupied=new Map(),reserved=new Set(),reservations=[];
 function place(x,y,z,role,asset,orientation='north',extra={}){
  const at=[x,y,z],k=key(x,y,z);
  if(x<0||x>=d.w||y<0||y>=height||z<0||z>=d.d||occupied.has(k)||reserved.has(k))
   throw Error(d.title+': overlapping/out-of-bounds coordinate '+k+' ('+role+')');
  occupied.set(k,{at,role,asset,orientation,occupancy:asset.startsWith('live:')?FULL:pending(asset),...extra});
 }
 const wall=(x,y,z,role)=>place(x,y,z,role,d.skin);
 for(let x=0;x<d.w;x++)for(let z=0;z<d.d;z++)place(x,0,z,'foundation',d.biome==='snow'?'live:wood':'live:stone');
 for(let y=1;y<=wallTop;y++){
  for(let x=1;x<d.w-1;x++)for(const z of [1,d.d-2])wall(x,y,z,'wall');
  for(let z=2;z<d.d-2;z++)for(const x of [1,d.w-2])wall(x,y,z,'wall');
 }
 for(const [x0,z0,x1,z1] of d.segments){
  if(x0!==x1&&z0!==z1)throw Error(d.title+': diagonal partitions forbidden');
  const dx=Math.sign(x1-x0),dz=Math.sign(z1-z0),count=Math.max(Math.abs(x1-x0),Math.abs(z1-z0));
  for(let i=0;i<=count;i++)for(let y=1;y<=3;y++){
   const x=x0+i*dx,z=z0+i*dz,k=key(x,y,z);
   if(!occupied.has(k))wall(x,y,z,'partition');
   else if(occupied.get(k).role!=='partition')throw Error(d.title+': partition overlaps foreign role '+k);
  }
 }
 const entry=[d.entry[0],d.entry[1]],allDoors=[door(entry[0],entry[1],'outside',d.entry[2]),...d.doors];
 for(const portal of allDoors){
  const [x,,z]=portal.at;
  if(!occupied.has(key(x,1,z)))throw Error(d.title+': portal not on authored wall '+portal.at);
  for(let y=1;y<=2;y++)occupied.delete(key(x,y,z));
 }
 for(const [x,z,yaw] of d.windows){
  const k=key(x,2,z);
  if(!occupied.has(k)||occupied.get(k).role!=='wall')throw Error(d.title+': window not on solid exterior wall '+k);
  occupied.delete(k);place(x,2,z,'window','pack4:030',yaw,{mount:'exterior-opening',glazingApproved:false});
 }
 // Stowed leaf in a neighboring real jamb wall, NOT in the portal throat.
 for(const portal of allDoors){
  const [x,,z]=portal.at;
  let found=false;
  for(const [dx,dz,orientation] of [[-1,0,'east'],[1,0,'west'],[0,-1,'north'],[0,1,'south']]){
   const k=key(x+dx,1,z+dz),prev=occupied.get(k);
   if(prev?.role==='wall'||prev?.role==='partition'){
    occupied.delete(k);place(x+dx,1,z+dz,'door','pack2:020',orientation,
     {doorState:'open-stowed',mount:[x,z],sweptClearanceCertified:false});
    found=true;break;
   }
  }
  if(!found)throw Error(d.title+': missing stowable portal jamb '+portal.at);
 }
 for(const f of d.fixtures){
  const at=[f.x,1,f.z];
  place(f.x,1,f.z,'furnishing',f.asset,'north',{
   room:f.room,...(f.variant?{variant:f.variant}:{})});
  if(f.asset==='pack5:082'){
   const foot=[f.x,1,f.z+1],k=key(...foot);
   if(occupied.has(k)||reserved.has(k))throw Error(d.title+': blocked bed foot '+k);
   reserved.add(k);
   reservations.push({asset:f.asset,anchor:at,extraCells:[foot],source:'pack5:082-physical-authored-two-cell-bed',approval:'unresolved'});
  }
 }
 const openCourt=(x,z)=>d.courtyard&&x>=d.courtyard[0]&&x<=d.courtyard[2]&&z>=d.courtyard[1]&&z<=d.courtyard[3];
 for(let x=0;x<d.w;x++)for(let z=0;z<d.d;z++){
  if(openCourt(x,z))continue;
  if(!occupied.has(key(x,4,z)))place(x,4,z,'support','live:wood','north',{weatherBacking:true});
 }
 function roofY(x,z){
  const edgeX=Math.min(x,d.w-1-x),edgeZ=Math.min(z,d.d-1-z);
  switch(d.roof){
   case 'terrace':case 'courtyard':return 5;
   case 'hip':return 5+Math.min(2,Math.floor(Math.min(edgeX,edgeZ)/3));
   case 'steep':return 5+Math.min(3,Math.floor(edgeX/3));
   case 'butterfly':return 5+Math.min(2,Math.floor(Math.abs(x-(d.w-1)/2)/4));
   case 'sawtooth':return 5+(x%7<3?1:2);
   default:throw Error(d.title+': unknown authored roof profile '+d.roof);
  }
 }
 for(let x=0;x<d.w;x++)for(let z=0;z<d.d;z++){
  if(openCourt(x,z))continue;
  const y=roofY(x,z);
  for(let level=5;level<y;level++)if(!occupied.has(key(x,level,z)))
   place(x,level,z,'support','live:wood','north',{steppedRoofRiser:true});
  place(x,y,z,'roof',d.roofAsset,'north',{weatherSealApproved:false,profile:d.roof});
 }
 for(const x of d.posts)for(let y=1;y<=3;y++)place(x,y,0,'support','pack2:022','north',{roofPost:'front-support',strengthApproved:false});
 const walkable=[];
 for(let x=2;x<d.w-2;x++)for(let z=2;z<d.d-2;z++){
  if(!occupied.has(key(x,1,z))&&!occupied.has(key(x,2,z))&&!reserved.has(key(x,1,z)))walkable.push([x,1,z]);
 }
 for(const p of allDoors)if(!walkable.some(q=>key(...q)===key(...p.at)))walkable.push(p.at);
 walkable.push([entry[0],1,0]);
 const dependencies=[...new Set([...occupied.values()].filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort()
  .map(asset=>({asset,status:'unresolved',requires:['real source AABB/state/rotation and support',
   'waterproofing, door-swing clearance and physical collision when placed',
   'save-schema-1 sidecar, runtime selection and future settlement integration']}));
 const blueprint={schema:SCHEMA,id:blueprintId(d.category,d.biome,d.size,d.index),category:d.category,biome:d.biome,size:d.size,index:d.index,
  title:d.title,status:'candidate',frame:'local-x-east-y-up-z-south',footprint:{width:d.w,height,depth:d.d},
  architecturalIdentity:{plan:d.plan,roof:d.roof,regionalDetail:d.detail,
   roofWeatherSealApproved:false,roofStrengthApproved:false,
   outdoorCourtyard:d.courtyard??null,levels:1,stairsRequired:false,
   materialAcceptance:'symbolic-plus-exact-candidate-AABB-not-production-approved'},
  placements:[...occupied.values()],rooms:d.rooms,portals:allDoors.map(p=>({from:p.from,to:p.to,at:p.at,passable:true,opening:'hinged-leaf'})),
  walkable,footprintReservations:reservations,dependencies,worldPlacement:false,liveIntegration:false};
 validateBlueprint(blueprint);
 return blueprint;
}
export function getM2Originals(){return DESIGNS.map(create);}
export function getM2Original(id){return getM2Originals().find(b=>b.id===id)??null;}
export const M2_ORIGINAL_DESIGN_IDS=Object.freeze(DESIGNS.map(d=>blueprintId(d.category,d.biome,d.size,d.index)));
