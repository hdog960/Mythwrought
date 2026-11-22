// Builder 1B original M2 regional community designs — no world imports or runtime registration.
// These are NINE hand-programmed spatial briefs, not a random generator or rescaled copy.
import {SCHEMA,validateBlueprint} from './legacy-stable-schema.mjs';
import {blueprintId,validateAllocation} from './schema.mjs';
const FULL=Object.freeze({kind:'full-cell',bounds:[0,0,0,1,1,1]});
const K=(x,y,z)=>x+','+y+','+z;
export function sourcePlan(category,biome,size,index,title,w,h,d) {
 const vox=new Map(),rooms=[],portals=[];
 function put(x,y,z,role,asset='live:wood',orientation='none',extra={}) {
  if(![x,y,z].every(Number.isInteger)||x<0||y<0||z<0||x>=w||y>=h||z>=d)
   throw Error(title+' out-of-bounds authored coordinate '+K(x,y,z));
  const key=K(x,y,z);if(vox.has(key))throw Error(title+' duplicate authored cell '+key);
  vox.set(key,{at:[x,y,z],role,asset,orientation,
   occupancy:asset.startsWith('live:')?FULL:{kind:'unresolved',bounds:null,
    reason:asset+' requires physical source AABB, orientation, transparent collision and supporting-mount acceptance'},...extra});
 }
 const clear=(x,y,z)=>!vox.has(K(x,y,z));
 const cut=(x,y,z)=>vox.delete(K(x,y,z));
 const opening=(x,z)=>{cut(x,1,z);cut(x,2,z);};
 function floor(material='live:stone'){for(let x=0;x<w;x++)for(let z=0;z<d;z++)put(x,0,z,'foundation',material);}
 function wallRing(top=5,material='live:wood',rear=d-2){
  for(let y=1;y<=top;y++){
   for(let x=1;x<w-1;x++)for(const z of [1,rear])put(x,y,z,'wall',material);
   for(let z=2;z<rear;z++)for(const x of [1,w-2])put(x,y,z,'wall',material);
  }
 }
 function wallZ(z,x0=2,x1=w-3,top=4,asset='live:wood'){
  for(let y=1;y<=top;y++)for(let x=x0;x<=x1;x++)put(x,y,z,'partition',asset);
 }
 function wallX(x,z0,z1,top=4,asset='live:wood'){
  for(let y=1;y<=top;y++)for(let z=z0;z<=z1;z++)put(x,y,z,'partition',asset);
 }
 function pane(x,z,facing='north'){
  cut(x,2,z);put(x,2,z,'window','pack4:030',facing,{actualPaneProfileApproved:false});
 }
 function fitting(x,z,purpose,asset='live:wood'){
  put(x,1,z,'furnishing',asset,'north',{purpose,workingMechanics:false});
 }
 function room(name,x0,z0,x1,z1,upper=5){
  rooms.push({id:name,min:[x0,1,z0],max:[x1,upper,z1]});
 }
 function portal(from,to,x,z,openingType='two-high-physical-opening',y=1){
  portals.push({from,to,at:[x,y,z],passable:true,opening:openingType});
 }
 function support(x,z,upTo,asset='live:wood',purpose='roof-column'){
  // A true contiguous y=1 ... upTo physical column, not a floating roof tag.
  for(let y=1;y<=upTo;y++)if(clear(x,y,z))put(x,y,z,'support',asset,'none',{purpose,loadApproved:false});
 }
 function gable(z0,z1,x0,x1,y0,slopeDiv=3,material='live:wood',name='gable'){
  const mid=(x0+x1)/2,span=(x1-x0)/2;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const y=y0+Math.floor((span-Math.abs(x-mid))/slopeDiv);
   put(x,y,z,'roof',material,'east',{roofProfile:name,weatherBearingApproved:false});
  }
 }
 function shed(x0,x1,z0,z1,y0,step=4,name='shed',asset='live:wood'){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   put(x,y0+Math.floor((z-z0)/step),z,'roof',asset,'north',{roofProfile:name,weatherBearingApproved:false});
 }
 function hip(x0,x1,z0,z1,y0,step=3,name='hip',asset='live:wood'){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const rise=Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/step);
   put(x,y0+rise,z,'roof',asset,'none',{roofProfile:name,weatherBearingApproved:false});
  }
 }
 function rim(x0,x1,z0,z1,entranceX,asset='live:stone',purpose='empty-basin-rim'){
  for(let x=x0;x<=x1;x++)for(const z of [z0,z1]){
   if(x===entranceX&&z===z0)continue;
   fitting(x,z,purpose,asset);
  }
  for(let z=z0+1;z<z1;z++)for(const x of [x0,x1])fitting(x,z,purpose,asset);
 }
 function finish(program,detail={}) {
  const walkable=[];
  for(let x=0;x<w;x++)for(let z=0;z<d;z++)
   if(vox.has(K(x,0,z))&&clear(x,1,z)&&clear(x,2,z))walkable.push([x,1,z]);
  const unresolved=[...new Set([...vox.values()].filter(p=>!p.asset.startsWith('live:')).map(p=>p.asset))].sort();
  const dependencies=unresolved.map(asset=>({asset,status:'unresolved',
   requires:['producer exact visible/selection/collider envelopes and yaw','mounted support, real weather sealing and source shape parity',
    'runtime placement-safe physical reservation + save schema 1 ABI verification']}));
  const b={schema:SCHEMA,id:blueprintId(category,biome,size,index),category,biome,size,index,title,
   status:'candidate',frame:'local-x-east-y-up-z-south',footprint:{width:w,height:h,depth:d},
   placements:[...vox.values()],walkable,rooms,portals,dependencies,footprintReservations:[],
   architecturalIdentity:{program,designMethod:'fixed coordinate authored floorplan and silhouette',
    structuralApproval:false,weatherproofApproval:false,creatorApproval:false,...detail},
   worldPlacement:false,liveIntegration:false};
  validateBlueprint(b);validateAllocation([b]);return b;
 }
 return {put,clear,cut,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,
  gable,shed,hip,rim,finish};
}

// Snow Small: two room heated interior, external snow porch, empty stone pool
// and true two-high access from changing area through dry warming zone.
export function buildSnowWarmingBath(){
 const b=sourcePlan('bathhouse','snow','small',1,'Hearthfrost Winter Baths',17,13,21);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,rim,finish}=b;
 floor();wallRing(5,'live:stone');
 opening(8,1);wallZ(7,2,14,4,'live:stone');opening(8,7);
 wallZ(14,2,14,4,'live:stone');for(const x of [5,8,12])opening(x,14);
 wallX(8,8,13,3,'live:stone');for(const z of [8,11])opening(8,z);
 for(const [x,z,f] of [[3,1,'north'],[13,1,'north'],[1,5,'west'],[15,5,'east'],[3,19,'south'],[13,19,'south']])pane(x,z,f);
 // Gabled snow roof with projecting outriggers and a real chimney pedestal (unlit).
 gable(1,19,1,15,6,2,'live:wood','steep-winter-drain-gable');
 for(const [x,z] of [[4,6],[12,6],[4,13],[12,13]])support(x,z,5,'live:stone','frost-roof-post');
 for(const [x,z,p] of [[4,4,'boot-bench'],[5,4,'boot-bench'],[12,4,'dry-towel-shelf'],
   [4,10,'unlit-hearth-slab'],[12,10,'service-tank-no-water']])fitting(x,z,p);
 rim(3,6,16,18,5);rim(10,13,16,18,11);
 room('snow-entry-changing',2,2,15,7);
 room('dry-warming-zone',2,8,8,14);
 room('unheated-wash-zone',9,8,15,14);
 room('twin-empty-basin-court',2,15,15,20);
 portal('outside','snow-entry-changing',8,1);
 portal('snow-entry-changing','dry-warming-zone',8,7);
 portal('dry-warming-zone','unheated-wash-zone',8,11);
 portal('unheated-wash-zone','twin-empty-basin-court',8,14);
 return finish('double winter baths: thermal entry, dry/wash separation and empty matching basin court',
  {steam:false,heating:false,actualWater:false});
}

// Enchanted forest Medium: opposed bath pavilions around sky-open middle
// courtyard with two side portals, not a rectangular cold/hot duplicate.
export function buildMoonpondCourt(){
 const b=sourcePlan('bathhouse','enchanted-forest','medium',1,'Moonpond Cloister Baths',25,14,25);
 const {opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,hip,rim,finish}=b;
 floor('live:stone');wallRing(5,'live:wood');
 for(const x of [11,12,13])opening(x,1);
 wallZ(8,2,22,4);for(const x of [6,12,18])opening(x,8);
 wallZ(18,2,22,4);for(const x of [6,12,18])opening(x,18);
 wallX(9,9,17,3);opening(9,12);
 wallX(16,9,17,3);opening(16,12);
 for(const [x,z,f] of [[4,1,'north'],[20,1,'north'],[1,7,'west'],[23,7,'east'],
  [1,20,'west'],[23,20,'east'],[5,23,'south'],[19,23,'south']])pane(x,z,f);
 // Twin hipped roofs on NORTH and SOUTH pavilions; courtyard remains sky open.
 hip(1,23,1,8,6,3,'front-moonwood-pavilion');
 hip(1,23,18,23,6,3,'back-moonwood-pavilion');
 for(const [x,z] of [[5,5],[19,5],[5,21],[19,21]])support(x,z,5,'live:wood','pavilion-bearing-post');
 rim(3,7,10,15,5,'live:stone','west-basin-rim');
 rim(18,22,10,15,20,'live:stone','east-basin-rim');
 for(const [x,z,p] of [[4,4,'cloak-storage'],[20,4,'herb-wrack-no-harvest'],
  [12,21,'private-drying-bench'],[12,5,'entry-attendant-desk']])fitting(x,z,p);
 room('cloister-entrance-hall',2,2,23,8);
 room('moonlit-west-basin',2,9,9,18);
 room('center-open-cloister',10,9,16,18);
 room('moonlit-east-basin',17,9,23,18);
 room('rear-dry-towel-gallery',2,19,23,23);
 portal('outside','cloister-entrance-hall',12,1);
 portal('cloister-entrance-hall','moonlit-west-basin',6,8);
 portal('cloister-entrance-hall','center-open-cloister',12,8);
 portal('cloister-entrance-hall','moonlit-east-basin',18,8);
 portal('moonlit-west-basin','center-open-cloister',9,12);
 portal('center-open-cloister','moonlit-east-basin',16,12);
 portal('center-open-cloister','rear-dry-towel-gallery',12,18);
 return finish('opposed hipped bath pavilions with genuinely open-air central cloister and split basins',
 {skyOpenCourt:true,waterSimulation:false,biomeMagicGameplay:false});
}

// Mountain Large: front lobby, three independent treatment rooms and high
// open-sky terraced court. Stone hip roofs slope around the central light well.
export function buildCliffBathTerrace(){
 const b=sourcePlan('bathhouse','mountain','large',1,'Cliffstep Travertine Bath Terrace',29,18,29);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,hip,rim,finish}=b;
 floor('live:stone');wallRing(6,'live:stone');
 for(const x of [13,14,15])opening(x,1);
 wallZ(9,2,26,5,'live:stone');for(const x of [6,14,22])opening(x,9);
 wallZ(19,2,26,4,'live:stone');for(const x of [6,14,22])opening(x,19);
 wallX(10,10,18,4,'live:stone');for(const z of [11,16])opening(10,z);
 wallX(19,10,18,4,'live:stone');for(const z of [11,16])opening(19,z);
 for(const [x,z,f] of [[4,1,'north'],[24,1,'north'],[1,5,'west'],[27,5,'east'],
  [1,15,'west'],[27,15,'east'],[4,27,'south'],[24,27,'south']])pane(x,z,f);
 // A physically separated pavilion roof across the north/west/east treatment
 // ranges; NO made-up functional hot water or pumping.
 for(let x=1;x<=27;x++)for(let z=1;z<=19;z++){
  if(z>=10&&x>=11&&x<=18)continue; // skylight over actual central circulation
  const rise=Math.floor(Math.min(x-1,27-x,z-1,19-z)/4);
  put(x,7+rise,z,'roof','live:stone','none',{roofProfile:'terraced-travertine-hips',spanApproval:false});
 }
 for(const [x,z] of [[5,5],[23,5],[5,14],[23,14]])support(x,z,6,'live:stone','stone-hip-pier');
 rim(4,8,22,26,6,'live:stone','upper-empty-stone-bath');
 rim(19,24,22,26,21,'live:stone','lower-empty-stone-bath');
 for(const [x,z,p] of [[4,5,'dressing-cubbies'],[6,5,'dressing-cubbies'],[24,5,'traveler-towel-room'],
  [5,13,'heating-plant-shell-unlit'],[23,13,'dry-sauna-bench'],[13,24,'stone-service-altar']])fitting(x,z,p);
 room('arrival-locker-hall',2,2,27,9);
 room('left-dry-heating-room',2,10,10,19);
 room('central-air-well',11,10,19,19);
 room('right-wet-washing-room',20,10,27,19);
 room('terrace-double-basin',2,20,27,27);
 portal('outside','arrival-locker-hall',14,1);
 portal('arrival-locker-hall','left-dry-heating-room',6,9);
 portal('arrival-locker-hall','central-air-well',14,9);
 portal('arrival-locker-hall','right-wet-washing-room',22,9);
 portal('left-dry-heating-room','central-air-well',10,11);
 portal('central-air-well','right-wet-washing-room',19,11);
 portal('central-air-well','terrace-double-basin',14,19);
 return finish('large stone mountain baths with triple therapy wings, sky-well and two open terraced basins',
 {mountainLoadUnverified:true,functioningSpa:false});
}

// Desert small stable: four recessed empty shaded pens facing a double-wide
// sand portico. Deliberately NOT inherited Desert Small stable variation 001.
export function buildDuneshadeStable(){
 const b=sourcePlan('stable','desert','small',4,'Duneshade Four-Bay Rest Stable',19,11,21);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,shed,finish}=b;
 floor();wallRing(5,'live:stone');
 for(const x of [8,9,10])opening(x,1);
 wallX(7,3,15,3,'live:wood');for(const z of [5,12])opening(7,z);
 wallX(11,3,15,3,'live:wood');for(const z of [5,12])opening(11,z);
 wallZ(9,2,6,3,'live:wood');wallZ(9,12,16,3,'live:wood');
 wallZ(16,2,16,4,'live:stone');opening(9,16);
 for(const [x,z,f] of [[3,1,'north'],[15,1,'north'],[1,7,'west'],[17,7,'east'],[4,19,'south'],[14,19,'south']])pane(x,z,f);
 // Sun-facing asymmetric canopy with a raised center ridge, not a snow gable.
 for(let x=1;x<=17;x++)for(let z=1;z<=19;z++)
  put(x,6+Math.floor((x>=7&&x<=11?2:0)+(z-1)/9),z,'roof','live:wood','north',
   {roofProfile:'sunshade-step-vent',sandSealApproved:false});
 for(const [x,z] of [[4,6],[14,6],[4,15],[14,15]])support(x,z,5,'live:stone','stone-arcade-pier');
 for(const [x,z] of [[4,4],[14,4],[4,13],[14,13]])fitting(x,z,'empty-stall-manger');
 fitting(4,18,'spare-tack');fitting(15,18,'caravan-rope');
 room('central-handling-aisle',8,2,11,16);
 room('west-front-empty-pen',2,3,7,9);
 room('west-rear-empty-pen',2,10,7,16);
 room('east-front-empty-pen',12,3,17,9);
 room('east-rear-empty-pen',12,10,17,16);
 room('rear-tack-cupboard',2,17,17,20);
 portal('outside','central-handling-aisle',9,1);
 for(const [to,x,z] of [['west-front-empty-pen',7,5],['west-rear-empty-pen',7,12],
  ['east-front-empty-pen',11,5],['east-rear-empty-pen',11,12]])portal('central-handling-aisle',to,x,z,'empty-stall-bay');
 portal('central-handling-aisle','rear-tack-cupboard',9,16);
 return finish('desert side-pen stable with four empty insulated stalls and ventilated shade canopy',
  {animals:0,animalSpawn:false});
}

// Mountain Large: eight truly separate pen doors, 3-wide haul road,
// raised ridge and cross-ribs; no animal or stable interaction simulated.
export function buildHighpassStable(){
 const b=sourcePlan('stable','mountain','large',4,'Highpass Eight-Pen Caravan Stable',31,16,33);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,finish}=b;
 floor('live:stone');wallRing(7,'live:wood');
 for(const x of [14,15,16])opening(x,1);
 wallX(13,3,25,4,'live:wood');wallX(17,3,25,4,'live:wood');
 for(const z of [5,11,17,23]){opening(13,z);opening(17,z);}
 for(const z of [8,14,20]){wallZ(z,2,12,4);wallZ(z,18,28,4);}
 wallZ(26,2,28,5);opening(15,26);
 for(const [x,z,f] of [[4,1,'north'],[26,1,'north'],[1,5,'west'],[29,5,'east'],
  [1,16,'west'],[29,16,'east'],[5,31,'south'],[25,31,'south']])pane(x,z,f);
 gable(1,31,1,29,8,3,'live:wood','highpass-heavy-snow-roof');
 for(const x of [6,15,24])for(const z of [4,12,20,28])
  support(x,z,6,'live:stone','heavy-snow-roof-truss-column');
 for(const z of [4,10,16,22])for(const x of [5,25])fitting(x,z,'empty-stall-stone-trough');
 fitting(5,29,'ice-clearing-tool-rack');fitting(25,29,'blanket-store');
 room('three-wide-loaded-aisle',14,2,17,26,8);
 for(const [label,x0,x1,z0,z1] of [
  ['west-pen-a',2,13,3,8],['west-pen-b',2,13,9,14],
  ['west-pen-c',2,13,15,20],['west-pen-d',2,13,21,26],
  ['east-pen-a',18,29,3,8],['east-pen-b',18,29,9,14],
  ['east-pen-c',18,29,15,20],['east-pen-d',18,29,21,26]
 ])room(label,x0,z0,x1,z1,6);
 room('rear-load-and-supply-store',2,27,29,32,7);
 portal('outside','three-wide-loaded-aisle',15,1,'three-cell wagon entry');
 for(const [name,x,z] of [
  ['west-pen-a',13,5],['west-pen-b',13,11],['west-pen-c',13,17],['west-pen-d',13,23],
  ['east-pen-a',17,5],['east-pen-b',17,11],['east-pen-c',17,17],['east-pen-d',17,23]
 ])portal('three-wide-loaded-aisle',name,x,z,'empty-wide-pen-access');
 portal('three-wide-loaded-aisle','rear-load-and-supply-store',15,26);
 return finish('eight-cellular-stall mountain stable with wide central wagon road and bearing high gable', {animals:0});
}

// Enchanted Small: two breeding-free stalls to each side, rear working
// space, deep leaf eaves and actual wood frames independent of roof decoration.
export function buildFernshadeStable(){
 const b=sourcePlan('stable','enchanted-forest','small',4,'Fernshade Open-Stall Shelter',17,13,19);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,hip,finish}=b;
 floor('live:stone');wallRing(5,'live:wood');opening(8,1);
 wallX(6,3,14,3);wallX(10,3,14,3);
 for(const z of [5,12]){opening(6,z);opening(10,z);}
 wallZ(9,2,5,3);wallZ(9,11,14,3);
 wallZ(15,2,14,4);for(const x of [3,8,13])opening(x,15);
 for(const [x,z,f] of [[3,1,'north'],[13,1,'north'],[1,7,'west'],[15,7,'east'],[4,17,'south'],[12,17,'south']])pane(x,z,f);
 hip(1,15,1,17,6,2,'forest-wood-canopy-hip','live:wood');
 for(const [x,z] of [[3,4],[13,4],[3,13],[13,13]])support(x,z,5,'live:wood','leaf-canopy-bearing-post');
 for(const [x,z,p] of [[4,4,'empty-wood-feeder'],[12,4,'empty-wood-feeder'],
  [3,12,'empty-wood-feeder'],[12,12,'empty-wood-feeder'],[4,16,'dry-brush-box'],[12,16,'tack-stool']])
  fitting(x,z,p);
 room('covered-mid-aisle',7,2,10,15);
 room('west-forest-pen-front',2,3,6,9);
 room('west-forest-pen-back',2,10,6,15);
 room('east-forest-pen-front',11,3,15,9);
 room('east-forest-pen-back',11,10,15,15);
 room('dry-rear-service-room',2,16,15,18);
 portal('outside','covered-mid-aisle',8,1);
 for(const [name,x,z] of [
  ['west-forest-pen-front',6,5],['west-forest-pen-back',6,12],
  ['east-forest-pen-front',10,5],['east-forest-pen-back',10,12]
 ])portal('covered-mid-aisle',name,x,z,'open-forest-stall');
 portal('covered-mid-aisle','dry-rear-service-room',8,15);
 return finish('compact exposed timber shelter with four open empty pens, deep roof eaves and one dry service bay',
 {harvest:false,animals:0,woodRoofLoadPending:true});
}

// Desert Large: load-bearing perimeter, three storage wings and an
// actually sky-open interior threshing court — not merely a big closed rectangle.
export function buildOasisGrainBarn(){
 const b=sourcePlan('farm-barn','desert','large',1,'Oasiscourt Three-Wing Granary',29,15,31);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,shed,finish}=b;
 floor('live:stone');wallRing(6,'live:stone');
 for(const x of [13,14,15])opening(x,1);
 wallZ(8,2,26,5,'live:stone');for(const x of [6,14,22])opening(x,8);
 wallZ(22,2,26,4,'live:stone');for(const x of [6,14,22])opening(x,22);
 wallX(9,9,21,4,'live:stone');opening(9,14);
 wallX(19,9,21,4,'live:stone');opening(19,14);
 wallX(14,23,28,4,'live:stone');opening(14,26);
 for(const [x,z,f] of [[4,1,'north'],[24,1,'north'],[1,5,'west'],[27,5,'east'],
  [1,17,'west'],[27,17,'east'],[4,29,'south'],[24,29,'south']])pane(x,z,f);
 // Open-air threshing court central x10..18,z9..21; three separate roofs.
 shed(1,27,1,8,7,4,'front-storage-shed');
 shed(1,9,9,21,7,6,'west-granary-shed');
 shed(19,27,9,21,7,6,'east-granary-shed');
 shed(1,27,22,29,7,3,'rear-caravan-storage');
 for(const [x,z] of [[5,5],[23,5],[5,14],[23,14],[5,25],[23,25]])
  support(x,z,6,'live:stone','sun-ramp-storage-pier');
 for(const [x,z,p] of [[4,4,'barley-stack'],[5,4,'barley-stack'],[23,4,'date-grain-crate'],
  [5,12,'empty-palm-seed-bin'],[23,12,'empty-palm-seed-bin'],[4,25,'wagon-tools'],
  [24,25,'shade-cloth-rack'],[12,12,'threshing-plinth-no-crops']])fitting(x,z,p);
 room('front-grain-receiving',2,2,27,8);
 room('west-seed-drying-store',2,9,9,22);
 room('sky-open-threshing-court',10,9,19,22);
 room('east-oasis-crop-storage',20,9,27,22);
 room('rear-cart-depot',2,23,14,29);
 room('rear-repair-and-fittings',15,23,27,29);
 portal('outside','front-grain-receiving',14,1,'three-cell cart door');
 portal('front-grain-receiving','west-seed-drying-store',6,8);
 portal('front-grain-receiving','sky-open-threshing-court',14,8);
 portal('front-grain-receiving','east-oasis-crop-storage',22,8);
 portal('west-seed-drying-store','sky-open-threshing-court',9,14);
 portal('sky-open-threshing-court','east-oasis-crop-storage',19,14);
 portal('west-seed-drying-store','rear-cart-depot',6,22);
 portal('east-oasis-crop-storage','rear-repair-and-fittings',22,22);
 portal('rear-cart-depot','rear-repair-and-fittings',14,26);
 return finish('three-wing desert grain storage with genuine open central court and separate rear cart/repair bays',
 {cropsLive:false,workingFarm:false});
}

// Snow Small: genuinely low stone grain cold-storage shell, single loading
// portal, rear fuel cells and very steep ice shedding roof.
export function buildSnowRootBarn(){
 const b=sourcePlan('farm-barn','snow','small',1,'Snowroot Frostproof Provision Barn',17,15,21);
 const {put,opening,floor,wallRing,wallZ,pane,fitting,room,portal,support,gable,finish}=b;
 floor('live:stone');wallRing(6,'live:stone');
 for(const x of [7,8,9])opening(x,1);
 wallZ(9,2,14,5,'live:wood');for(const x of [5,11])opening(x,9);
 wallZ(15,2,14,4,'live:stone');opening(8,15);
 for(const [x,z,f] of [[3,1,'north'],[13,1,'north'],[1,5,'west'],[15,5,'east'],[4,19,'south'],[12,19,'south']])pane(x,z,f);
 gable(1,19,1,15,7,1,'live:wood','high-steep-ice-deflection');
 for(const [x,z] of [[4,5],[12,5],[4,12],[12,12]])
  support(x,z,6,'live:stone','high-snow-roof-bearing-post');
 for(const [x,z,p] of [[4,4,'grain-box'],[13,4,'grain-box'],[5,12,'frozen-herb-rack'],
  [13,12,'rope-spool'],[4,17,'dry-fuel-box'],[12,17,'tool-storage']])fitting(x,z,p);
 room('sled-loading-hall',2,2,15,9);
 room('cold-grain-store',2,10,9,15);
 room('rope-and-repair-store',10,10,15,15);
 room('back-snow-shelter',2,16,15,20);
 portal('outside','sled-loading-hall',8,1,'three-cell sled door');
 portal('sled-loading-hall','cold-grain-store',5,9);
 portal('sled-loading-hall','rope-and-repair-store',11,9);
 portal('cold-grain-store','back-snow-shelter',8,15);
 return finish('compact snow provision barn with sled gate, distinct cold grain and rope stores and steep wood snow roof',
 {weatherHeating:false,animals:0});
}

// Forest Medium: two parallel high-timber harvest stores and a wood
// cross-passage; roofs have individually offset ridge profiles with a lantern.
export function buildMycelialDryingBarn(){
 const b=sourcePlan('farm-barn','enchanted-forest','medium',1,'Latticegrove Drying & Tackle Barn',23,14,25);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,finish}=b;
 floor('live:stone');wallRing(6,'live:wood');
 for(const x of [10,11,12])opening(x,1);
 wallZ(8,2,20,5,'live:wood');for(const x of [6,11,17])opening(x,8);
 wallX(11,9,18,4,'live:wood');for(const z of [11,16])opening(11,z);
 wallZ(19,2,20,4,'live:wood');for(const x of [6,17])opening(x,19);
 for(const [x,z,f] of [[4,1,'north'],[18,1,'north'],[1,5,'west'],[21,5,'east'],
  [1,12,'west'],[21,12,'east'],[4,23,'south'],[18,23,'south']])pane(x,z,f);
 gable(1,23,1,21,7,2,'live:wood','twin-latticegrove-truss');
 for(const [x,z] of [[5,5],[17,5],[5,13],[17,13],[5,21],[17,21]])
  support(x,z,6,'live:wood','living-wood-rib-support');
 for(const [x,z,p] of [[4,4,'dried-fiber-bale'],[17,4,'dried-fiber-bale'],
  [4,12,'herbal-drying-frame-no-harvest'],[18,12,'dry-rope-winding-stand'],
  [4,17,'seed-storage-crate'],[18,17,'basket-shelf'],
  [4,22,'field-tool-rack'],[18,22,'field-tool-rack']])fitting(x,z,p);
 room('wagon-inbound-and-loading',2,2,21,8);
 room('west-drying-bay',2,9,11,19);
 room('east-tackle-store',12,9,21,19);
 room('rear-covered-sorting',2,20,21,24);
 portal('outside','wagon-inbound-and-loading',11,1,'triple wagon leaf door');
 portal('wagon-inbound-and-loading','west-drying-bay',6,8);
 portal('wagon-inbound-and-loading','east-tackle-store',17,8);
 portal('west-drying-bay','east-tackle-store',11,11);
 portal('west-drying-bay','rear-covered-sorting',6,19);
 portal('east-tackle-store','rear-covered-sorting',17,19);
 return finish('forest two-wing drying/tackle facility with independently roofed connected work zones',
 {harvesting:false,crops:false,animals:0});
}

export function getM2Community1BPlans(){
 return [buildSnowWarmingBath(),buildMoonpondCourt(),buildCliffBathTerrace(),
  buildDuneshadeStable(),buildHighpassStable(),buildFernshadeStable(),
  buildOasisGrainBarn(),buildSnowRootBarn(),buildMycelialDryingBarn()];
}
