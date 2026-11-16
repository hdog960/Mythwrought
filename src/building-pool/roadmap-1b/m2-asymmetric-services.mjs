// MYTHWROUGHT Builder 1B M2e — nine independent asymmetric regional services.
// Source-only draft; actual per-coordinate occupancy, no procedural seed/rotation,
// no world placement, no runtime, no saves or Pack/automations/sibling writes.
import {sourcePlan} from './m2-community-structures.mjs';

// Each footprint below is an authored union of explicit orthogonal rooms and
// voids. Unlike a bounding-box wallRing, wall and foundation cells trace the
// *actual* L/T/U/C exterior perimeter and concave courtyards at every Y level.
export function irregular(category,biome,size,title,w,h,d,rectangles,voids=[],wallTop=5){
 const b=sourcePlan(category,biome,size,1,title,w,h,d),mask=new Set(),K=(x,z)=>x+','+z,roofMap=new Map();
 for(const [x0,z0,x1,z1] of rectangles)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(x<1||z<1||x>=w-1||z>=d-1)throw Error(title+' authored polygon outside bounds');
   mask.add(K(x,z));
  }
 for(const [x0,z0,x1,z1] of voids)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.delete(K(x,z));
 const has=(x,z)=>mask.has(K(x,z));
 for(let x=1;x<w-1;x++)for(let z=1;z<d-1;z++)if(has(x,z)){
  b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=wallTop;y++)b.put(x,y,z,'wall',biome==='desert'?'live:stone':'live:wood');
 }
 const open=(x,z)=>{if(!has(x,z))throw Error(title+' opening off real footprint '+K(x,z));b.opening(x,z);};
 function glazed(entries){
  for(const [x,z,face] of entries){
   if(!has(x,z))throw Error(title+' glazing absent footprint '+K(x,z));
   b.pane(x,z,face);
  }
 }
 function wallZ(z,x0,x1,doorXs=[],top=4){
  for(let x=x0;x<=x1;x++)if(has(x,z)){
   const isDoor=doorXs.includes(x);
   if(isDoor){b.opening(x,z);continue;}
   for(let y=1;y<=top;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
  }
 }
 function wallX(x,z0,z1,doorZs=[],top=4){
  for(let z=z0;z<=z1;z++)if(has(x,z)){
   if(doorZs.includes(z)){b.opening(x,z);continue;}
   for(let y=1;y<=top;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
  }
 }
 function roof(rect,y0,profile,kind='hip',material='live:wood',filter=null){
  const [x0,z0,x1,z1]=rect;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)if(has(x,z)&&(!filter||filter(x,z))){
   if(roofMap.has(K(x,z)))throw Error(title+' roof overlap '+K(x,z));
   const ax=Math.min(x-x0,x1-x),az=Math.min(z-z0,z1-z);
   let rise=kind==='hip'?Math.floor(Math.min(ax,az)/2):
    kind==='gable-x'?Math.floor(ax/3):
    kind==='gable-z'?Math.floor(az/3):
    kind==='ramp-x'?Math.floor((x-x0)/4):
    kind==='ramp-z'?Math.floor((z-z0)/4):
    kind==='reverse-x'?Math.floor((x1-x)/4):
    kind==='reverse-z'?Math.floor((z1-z)/4):0;
   const y=y0+rise;
   if(y>=h)throw Error(title+' roof outside elevation at '+K(x,z));
   b.put(x,y,z,'roof',material,'none',{roofProfile:profile,weatherApproved:false});
   roofMap.set(K(x,z),y);
  }
 }
 function bearing(pts,label,material='live:wood'){
  for(const [x,z] of pts){
   const y=roofMap.get(K(x,z));
   if(!y)throw Error(title+' roof bearing on missing roof '+K(x,z));
   b.support(x,z,y-1,material,label);
  }
 }
 function fit(pts){for(const [x,z,name] of pts){
  if(!has(x,z))throw Error(title+' fixture outside footprint '+K(x,z));
  b.fitting(x,z,name);
 }}
 function room(name,x0,z0,x1,z1){b.room(name,x0,z0,x1,z1);}
 function portal(from,to,x,z,type='two-high-authored-opening'){
  b.portal(from,to,x,z,type);
 }
 const finish=(program,details={})=>b.finish(program,{
  footprintTopology:'source-authored nonrectangular polygon; traced perimeter and concave negative-space courtyards',
  roofBearingApproval:false,physicalPackWindowABI:'unresolved pack4:030',...details});
 return {b,has,open,glazed,wallZ,wallX,roof,bearing,fit,room,portal,finish,mask,roofMap};
}
// Temperate medium greenhouse: offset L-shaped fern wing with a glazed
// cross-ridge; cropped footprint preserves real negative-space open garden.
export function thimbleglassConservatory(){
 const g=irregular('greenhouse','temperate','medium','Thimbleglass L-Wing Conservatory',27,15,29,
  [[1,1,25,9],[2,9,12,27]],[[1,15,3,21]],6);
 const {open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [11,12,13])open(x,1);
 wallZ(9,2,12,[7],4);
 glazed([[5,1,'north'],[21,1,'north'],[1,5,'west'],[25,5,'east'],[4,24,'west'],[12,25,'east'],[6,27,'south']]);
 roof([1,1,25,9],7,'transverse-glass-fern-gallery','gable-x','pack4:030');
 roof([2,10,12,27],7,'deep-green-timber-growing-rib','reverse-z','live:wood');
 bearing([[5,5],[21,5],[6,15],[10,23]],'glass-gallery-bearing-post');
 fit([[6,5,'permanent-potting-counter'],[20,5,'dry-botany-ledger'],[6,12,'empty-soil-tray'],
  [8,21,'nonharvestable-floral-stand']]);
 room('wide-front-glass-gallery',2,2,24,9);
 room('west-shaded-plant-wing',3,10,11,26);
 portal('outside','wide-front-glass-gallery',12,1,'three-cell-glass-entry');
 portal('wide-front-glass-gallery','west-shaded-plant-wing',7,9);
 return finish('asymmetric L-plan glazed exhibition gallery with projecting timber plant wing and true recessed garden cutout',
  {harvesting:false,plantGrowth:false,glassSealingApproved:false});
}
// Desert large greenhouse: broad U-shaped sun-trap around a TRUE missing
// central foundation court; covered stone access spine connects both arms.
export function suncisternAtrium(){
 const g=irregular('greenhouse','desert','large','Suncistern Sunken Atrium Glasshouse',33,19,37,
  [[1,1,31,10],[1,10,10,35],[22,10,31,35]],[[2,28,4,33],[28,14,30,20]],6);
 const {open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [15,16,17])open(x,1);
 wallZ(10,2,31,[6,16,26],4);
 glazed([[5,1,'north'],[27,1,'north'],[1,6,'west'],[31,6,'east'],[1,16,'west'],
  [10,23,'east'],[22,24,'west'],[31,27,'east'],[6,35,'south'],[26,35,'south']]);
 roof([1,1,31,10],7,'sun-cistern-sandstone-crossbar','hip','live:stone');
 roof([1,11,10,35],8,'west-deep-glass-clerestory','gable-x','pack4:030');
 roof([22,11,31,35],8,'east-mashrabiya-shade-ridge','reverse-z','live:wood');
 bearing([[6,5],[26,5],[6,18],[6,32],[26,18],[26,30]],'sunken-atrium-sandstone-pier','live:stone');
 fit([[7,5,'dry-seed-inventory'],[25,5,'shaded-potting-table'],[6,14,'empty-sand-pit'],
  [26,13,'unwatered-desert-planter'],[7,29,'waterless-cistern-exhibit'],[25,31,'sunlight-bench']]);
 room('transverse-public-sun-hall',2,2,30,10);
 room('long-west-controlled-plant-wing',2,11,10,34);
 room('east-sun-shaded-plant-wing',23,11,30,34);
 portal('outside','transverse-public-sun-hall',16,1);
 portal('transverse-public-sun-hall','long-west-controlled-plant-wing',6,10);
 portal('transverse-public-sun-hall','east-sun-shaded-plant-wing',26,10);
 return finish('vast U-footprint desert glasshouse with physically open large central sun court and two radically different side roof ranges',
  {irrigation:false,plantGrowth:false,cisternFunctional:false});
}
// Snow small greenhouse: literal T-shaped snow hotbed, with narrow rear
// glazed raised ridge and a lower broad storm-resistant visitor crossbar.
export function snowbudTGlasshouse(){
 const g=irregular('greenhouse','snow','small','Snowbud T-Glass Winterhouse',23,16,25,
  [[1,1,21,8],[7,8,15,23]],[],6);
 const {open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [10,11,12])open(x,1);
 wallZ(8,8,14,[11],4);
 glazed([[4,1,'north'],[18,1,'north'],[1,5,'west'],[21,5,'east'],[7,14,'west'],
  [15,14,'east'],[11,23,'south']]);
 roof([1,1,21,8],7,'snowbud-windlock-wide-eaves','gable-x','live:wood');
 roof([7,9,15,23],8,'snowbud-central-glass-snow-saddle','gable-x','pack4:030');
 bearing([[4,5],[18,5],[9,15],[13,20]],'snowbud-winter-rib');
 fit([[5,4,'cold-storage-bench'],[17,4,'dry-tools-bin'],[10,15,'empty-frost-tray'],[12,21,'winter-root-display-no-harvest']]);
 room('crossbar-snowlock-and-visitor-hall',2,2,20,8);
 room('rear-stem-winter-growing-nave',8,9,14,22);
 portal('outside','crossbar-snowlock-and-visitor-hall',11,1,'wide-storm-vestibule');
 portal('crossbar-snowlock-and-visitor-hall','rear-stem-winter-growing-nave',11,8);
 return finish('actual T-plan small snow glasshouse with broad windlock crossbar and long glazed winter stem',
  {heating:false,greenhouseGrowth:false,snowRoofLoadApproved:false});
}
// Temperate large fishing lodge: classic T-plan waterfront cooperative.
// Footprint sharply narrows to a dock-facing stem (dry, no simulated water).
export function reedcrossFisherCooperative(){
 const g=irregular('fishing-lodge','temperate','large','Reedcross Fisher Cooperative & Pier Lodge',35,18,39,
  [[1,1,33,12],[12,12,23,37]],[[13,29,15,36]],6);
 const {open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [15,16,17,18])open(x,1);
 wallZ(12,13,22,[17],4);
 glazed([[5,1,'north'],[29,1,'north'],[1,8,'west'],[33,8,'east'],[12,23,'west'],[23,25,'east'],[19,37,'south']]);
 roof([1,1,33,12],8,'fisher-market-wide-ridge','gable-x','live:wood');
 roof([12,13,23,31],7,'deep-pier-timber-drying-shed','ramp-z','live:wood');
 // Last six z rows remain open-air pier staging, physically grounded *candidate* deck.
 bearing([[5,6],[29,6],[15,19],[20,27]],'shore-cooperative-timber-bearing-pier');
 fit([[6,6,'dry-net-storage'],[28,6,'unpowered-fish-scale-desk'],[16,18,'unloaded-fishing-crates'],
  [20,29,'repairable-net-frame-not-active'],[18,35,'unlaunched-boat-mooring-candidate']]);
 room('transverse-fish-market-cooperative',2,2,32,12);
 room('long-covered-net-drying-jetty',13,13,22,31);
 room('open-shore-staging-tail',16,32,22,36);
 portal('outside','transverse-fish-market-cooperative',17,1,'four-wide-cooperative-entry');
 portal('transverse-fish-market-cooperative','long-covered-net-drying-jetty',17,12);
 portal('long-covered-net-drying-jetty','open-shore-staging-tail',18,31);
 return finish('true wide market crossbar narrowing into offset dry jetty stem and open rear shoreline service deck',
  {boats:false,liveWater:false,fishingMechanics:false});
}

// Mountain medium fishing lodge: L-shaped cliff perch, split gable and
// cantilevered lookout *candidate* with explicit no-height-traversal claim.
export function highcragHookFishingLodge(){
 const g=irregular('fishing-lodge','mountain','medium','Highcrag Hookline Cliff Lodge',29,18,31,
  [[1,1,25,10],[1,10,10,28],[9,23,16,28]],[[1,20,3,25]],6);
 const {open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [11,12,13])open(x,1);
 wallZ(10,2,23,[6],4);
 glazed([[5,1,'north'],[22,1,'north'],[25,5,'east'],[1,7,'west'],[1,16,'west'],
  [10,17,'east'],[5,28,'south'],[15,28,'south']]);
 roof([1,1,25,10],8,'highcrag-broad-cliff-grain-stone-gable','gable-x','live:stone');
 roof([1,11,10,23],8,'highcrag-north-hookline-drying-lean','ramp-z','live:wood');
 roof([4,24,16,28],9,'highcrag-upper-stone-lookout','reverse-x','live:stone');
 bearing([[5,5],[21,5],[6,15],[8,21],[12,26]],'highcrag-retaining-masonry-foot','live:stone');
 fit([[7,5,'rope-drying-rack'],[20,5,'cliff-fishing-ledger'],[5,15,'dry-hookline-shell'],
  [8,25,'lookout-stone-bench'],[13,26,'empty-landing-bucket']]);
 room('wide-cliff-receiving-room',2,2,24,10);
 room('narrow-vertical-hook-drying-wing',2,11,9,23);
 room('offset-lookout-and-tackle-landing',5,24,15,27);
 portal('outside','wide-cliff-receiving-room',12,1);
 portal('wide-cliff-receiving-room','narrow-vertical-hook-drying-wing',6,10);
 portal('narrow-vertical-hook-drying-wing','offset-lookout-and-tackle-landing',8,23);
 return finish('genuinely nonrectangular mountain L-perch: long stone frontage, hooked drying wing and offset cliff lookout',
  {fishing:false,climbABI:'unresolved',realWater:false,bridgeLoadApproved:false});
}
// Desert small harbor office: offset Z plan with three distinct terraces,
// physically routed customs desk and a dry boardwalk annex.
export function dunehookHarborRegistry(){
 const g=irregular('harbor-office','desert','small','Dunehook Z-Footprint Harbor Registry',25,15,29,
  [[1,1,22,8],[7,8,16,18],[12,18,22,27]],[],5);
 const {open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [10,11,12])open(x,1);
 wallZ(8,8,15,[11],3);
 wallZ(18,12,16,[14],3);
 glazed([[4,1,'north'],[19,1,'north'],[1,5,'west'],[22,5,'east'],
  [7,14,'west'],[16,14,'east'],[12,24,'west'],[22,24,'east'],[17,27,'south']]);
 roof([1,1,22,8],7,'dunehook-forward-tax-and-chart-shelf','ramp-z','live:stone');
 roof([7,9,16,18],8,'dunehook-central-skewed-ledger-crossing','gable-x','live:wood');
 roof([12,19,22,27],8,'dunehook-dock-facing-sun-canopy','reverse-x','live:stone');
 bearing([[4,4],[19,4],[10,13],[14,16],[16,23],[20,24]],'dunehook-customs-arcade-pier','live:stone');
 fit([[5,4,'cargo-declaration-counter'],[18,4,'coastal-chart-stand'],
  [12,13,'unfilled-berth-register'],[15,23,'dock-pilot-waiting-bench'],[20,25,'nonoperational-signal-flag']]);
 room('wide-port-customs-reception',2,2,21,8);
 room('narrow-central-manifest-run',8,9,15,18);
 room('right-offset-dock-pilot-office',13,19,21,26);
 portal('outside','wide-port-customs-reception',11,1,'three-cell-public-customs');
 portal('wide-port-customs-reception','narrow-central-manifest-run',11,8);
 portal('narrow-central-manifest-run','right-offset-dock-pilot-office',14,18);
 return finish('source-authored zigzag Z-plan customs station with sideways salt-stone hall, angled middle manifest run and offset rear harbor arcade',
  {ships:false,water:false,economy:false});
}
// Snow large harbor office: two long insulated customs arms on a common
// forward snow-guard spine; physically uncovered central snow inspection court.
export function frostportCustomsCitadel(){
 const g=irregular('harbor-office','snow','large','Frostport U-Court Winter Customs House',37,20,39,
  [[1,1,35,10],[1,10,11,37],[25,10,35,37]],[[1,28,4,34],[32,18,35,22]],7);
 const {open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [17,18,19])open(x,1);
 wallZ(10,2,35,[6,18,30],5);
 glazed([[5,1,'north'],[31,1,'north'],[1,6,'west'],[35,6,'east'],[1,16,'west'],
  [11,23,'east'],[25,22,'west'],[35,29,'east'],[7,37,'south'],[29,37,'south']]);
 roof([1,1,35,10],9,'frostport-forward-snow-buttressed-cross-gable','gable-x','live:wood');
 roof([1,11,11,37],9,'frostport-long-west-customs-roof','ramp-z','live:stone');
 roof([25,11,35,37],9,'frostport-high-east-inspection-ridge','gable-x','live:wood');
 bearing([[6,5],[30,5],[6,17],[6,30],[30,15],[29,30]],'frostport-roofload-stone-buttress','live:stone');
 fit([[7,5,'winter-ship-tax-ledger'],[29,5,'ice-port-map-cabinet'],
 [7,17,'unpowered-cargo-lift'],[28,17,'frozen-manifest-locker'],
 [7,31,'packed-freight-rack'],[28,31,'customs-warden-bench']]);
 room('forward-ship-customs-great-hall',2,2,34,10);
 room('long-west-cargo-assessment',2,11,10,36);
 room('long-east-port-authority',26,11,34,36);
 portal('outside','forward-ship-customs-great-hall',18,1,'three-wide-winter-harbor-gate');
 portal('forward-ship-customs-great-hall','long-west-cargo-assessment',6,10);
 portal('forward-ship-customs-great-hall','long-east-port-authority',30,10);
 return finish('large U-plan winter customs citadel open to central snow court, unequal solid side arms, snow-load roof trusses',
  {economy:false,shipControl:false,realIceMechanics:false});
}
// Vertical towers are authored physical multi-Y wall loops. Their access remains
// a ground-floor two-high portal; no ladder/climbing/rendering approval is claimed.
function lighthouseTower(g,x0,z0,x1,z1,wallHeight,roofTop,profile,entrance,material='live:stone'){
 const {b,has}=g;
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z))throw Error('tower extends outside source footprint '+x+','+z);
  const border=x===x0||x===x1||z===z0||z===z1;
  if(border)for(let y=1;y<=wallHeight;y++){
   if(x===entrance[0]&&z===entrance[1]&&y<=2)continue;
   if(b.clear(x,y,z))b.put(x,y,z,'wall',material,'none',
    {towerBearingCandidate:true,upperTraversalApproved:false});
  }
 }
 // To preserve the tower base's usable entrance, clear two real wall voxels.
 b.opening(entrance[0],entrance[1]);
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const rise=Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/3);
  b.put(x,roofTop+rise,z,'roof',x===x0||x===x1||z===z0||z===z1?'live:stone':'live:crystal',
   'none',{roofProfile:profile,beaconOperational:false,loadApproval:false});
 }
 return [x0,z0,x1,z1];
}
// Temperate medium lighthouse: 19-high tower integrated into *L-shaped*
// keeper's office + offset survey porch. Upper roof a real source cap.
export function windwardSignalLight(){
 const g=irregular('lighthouse','temperate','medium','Windward Hook Signal Lighthouse',31,27,33,
  [[1,1,11,12],[10,8,29,18],[16,18,29,31]],[],6);
 const {b,open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 lighthouseTower(g,1,1,11,12,18,20,'windward-crowned-signal-lantern',[11,10]);
 open(5,1);for(const x of [20,21])open(x,8);
 wallZ(18,17,28,[22],4);
 glazed([[3,1,'north'],[1,6,'west'],[11,4,'east'],[25,8,'north'],
  [29,13,'east'],[16,26,'west'],[24,31,'south']]);
 roof([12,8,29,18],8,'windward-angular-keeper-hall-gable','gable-x','live:wood');
 roof([16,19,29,31],8,'windward-rear-signal-ledger-hip','hip','live:stone');
 bearing([[15,13],[25,13],[20,24],[26,27]],'windward-keeper-masonry-pier');
 fit([[5,6,'unlit-beacon-gears-shell'],[16,13,'signal-flags-no-action'],
  [25,14,'harbor-keeper-bedroll'],[20,25,'dry-charting-desk'],[25,28,'empty-ship-registry']]);
 room('tower-ground-lantern-shaft',2,2,10,11);
 room('offset-keeper-desk-and-storage',12,9,28,18);
 room('rear-survey-and-signal-annex',17,19,28,30);
 portal('outside','tower-ground-lantern-shaft',5,1);
 portal('tower-ground-lantern-shaft','offset-keeper-desk-and-storage',11,10);
 portal('outside','offset-keeper-desk-and-storage',20,8);
 portal('offset-keeper-desk-and-storage','rear-survey-and-signal-annex',22,18);
 return finish('true asymmetric L-hook lighthouse: 20-high physical stone signal tower and diagonally offset twin keeper houses',
  {beacon:false,ladder:'future-only',climbABI:false});
}
// Enchanted large lighthouse: taller 25-high carved canopy beacon with
// physically disconnected upper rooms (no climb claim) and long hooked research
// loggia, all lower circulation 2-high and roof-bearing on actual foundations.
export function elderstarTwinLanternLight(){
 const g=irregular('lighthouse','enchanted-forest','large','Elderstar Moonwood High Lantern',35,34,41,
  [[1,1,13,15],[11,9,33,22],[19,22,33,39]],[[30,33,33,37]],7);
 const {b,open,glazed,wallZ,roof,bearing,fit,room,portal,finish}=g;
 lighthouseTower(g,1,1,13,15,25,27,'elderstar-halo-rose-crystal-high-beacon',[13,12],'live:wood');
 open(6,1);for(const x of [23,24])open(x,9);
 wallZ(22,20,32,[25],4);
 glazed([[4,1,'north'],[1,8,'west'],[13,5,'east'],[29,9,'north'],
  [33,16,'east'],[20,30,'west'],[26,39,'south']]);
 roof([14,9,33,22],9,'elderstar-deep-moonwood-corridor','gable-x','live:wood');
 roof([19,23,33,39],9,'elderstar-east-facing-chapel-loggia','reverse-z','live:wood');
 bearing([[17,15],[29,17],[23,27],[28,34]],'elderstar-living-wood-roof-pier');
 fit([[5,7,'unpowered-star-glass-beacon'],[17,14,'lighthouse-archive-shelf'],
  [29,16,'moon-ship-ledger'],[23,28,'no-light-arcane-astrolabe'],[27,34,'dry-signal-flag']]);
 room('ground-elderstar-lantern-shaft',2,2,12,14);
 room('moonwood-archive-keeper-hall',14,10,32,22);
 room('long-forest-signal-loggia',20,23,32,38);
 portal('outside','ground-elderstar-lantern-shaft',6,1);
 portal('ground-elderstar-lantern-shaft','moonwood-archive-keeper-hall',13,12);
 portal('outside','moonwood-archive-keeper-hall',24,9);
 portal('moonwood-archive-keeper-hall','long-forest-signal-loggia',25,22);
 return finish('true 27-high tall enchanted rose-crystal tower and L-offset Moonwood research halls, not a recolored rectangular lighthouse',
  {magicalLight:false,climbABI:false,towerMechanics:false});
}
export function getM2Asymmetric1BPlans(){
 return [thimbleglassConservatory(),suncisternAtrium(),snowbudTGlasshouse(),
  reedcrossFisherCooperative(),highcragHookFishingLodge(),dunehookHarborRegistry(),
  frostportCustomsCitadel(),windwardSignalLight(),elderstarTwinLanternLight()];
}
