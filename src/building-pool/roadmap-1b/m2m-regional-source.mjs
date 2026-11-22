// Builder 1B M2M: nine independent second-variant source-coordinate blueprints.
// Frozen integer masks and roof cells; never merge, world-place or claim physical Pack ABI.
import {sourcePlan} from './m2-community-structures.mjs';
function irregular(category,biome,size,title,w,h,d,rectangles,voids=[],wallTop=5){
 const b=sourcePlan(category,biome,size,2,title,w,h,d),mask=new Set(),K=(x,z)=>x+','+z,roofMap=new Map();
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

function original(d){
 const g=irregular(d.category,d.biome,d.size,d.name,...d.dim,d.mask,d.voids??[],d.wallTop??7);
 // All geometry is keyed to explicit builder-owned integer source coordinates.
 for(const [x,z] of d.entries)g.open(x,z);
 g.glazed(d.windows);
 for(const [r,y,label,shape,asset] of d.roofs)
  g.roof(r,y,label,shape,asset);
 g.bearing(d.posts,d.key+'-roof-structural-column',
  ['desert','mountain'].includes(d.biome)?'live:stone':'live:wood');
 for(const [x,z,purpose] of d.furniture)g.fit([[x,z,purpose]]);
 for(const [x,z,asset,purpose] of d.dependencies){
  if(!g.has(x,z)||!g.b.clear(x,1,z))throw Error(d.key+' misplaced candidate '+purpose);
  g.b.put(x,1,z,'furnishing',asset,'north',
   {purpose,fullPhysicalBoundsApproved:false,orientationABIApproved:false});
 }
 for(const [name,x0,z0,x1,z1] of d.rooms)g.room(name,x0,z0,x1,z1);
 for(const [from,to,x,z] of d.portals)g.portal(from,to,x,z);
 if(d.beacon)sourceBeacon(g,d);
 return g.finish(d.description,{
  sourceAuthor:'Builder 1B M2M second-variant XYZ blueprint',
  worldInteractionsEnabled:false,fishHarvestEnabled:false,
  actualPlantGrowth:false,customsEconomy:false,signalLightEnabled:false,
  upperTowerAccess:false,fullPhysicalPackABIApproved:false,
  certifiedLoadPath:false,sourceMaterialDependenciesUnresolved:true,
  creatorArtApproved:false});
}
function sourceBeacon(g,d){
 // Independent lower foundation/cap and vertically staggered narrower towers.
 // Every upper wall rests directly on a dedicated full source cap one Y below.
 const {b,has}=g;
 for(const [type,x0,z0,x1,z1,first,last,material,name] of d.beacon.stages){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z))throw Error(d.key+' tower outside footprint '+name);
   if(type==='cap')b.put(x,first,z,'roof',material,'none',
    {roofProfile:name,beaconCap:true,certifiedBearing:false});
   else if(x===x0||x===x1||z===z0||z===z1)
    for(let y=first;y<=last;y++)
     b.put(x,y,z,'wall',material,'none',
      {towerProfile:name,upperNavigation:false,roofLoadCertified:false});
  }
 }
 for(const [x,z,first,last,material,purpose] of d.beacon.finials)
  for(let y=first;y<=last;y++)
   b.put(x,y,z,'decoration',material,'none',
    {purpose,lightActive:false,physicalIphoneApproved:false});
}




const SURVEYS=[{"category":"bathhouse","biome":"desert","size":"large","key":"sirocco","name":"Sirocco Rift-Court Thermae","dim":[44,24,47],"mask":[[9,1,32,11],[1,12,12,34],[27,12,41,23],[27,24,29,26],[13,26,26,30],[10,31,36,44]],"entries":[[20,1],[11,11],[29,11],[12,28],[27,25],[19,31]],"windows":[[12,1,"north"],[29,1,"north"],[1,22,"west"],[41,18,"east"],[15,44,"south"],[32,44,"south"]],"roofs":[[[9,1,32,11],11,"sirocco-ventilated-broad-auditorium","gable-x","pack3:024"],[[1,12,12,34],10,"sirocco-long-shadow-well","ramp-z","live:stone"],[[27,12,41,23],12,"sirocco-short-sun-therapy","reverse-x","live:stone"],[[27,24,29,26],10,"sirocco-east-thin-turn","reverse-z","live:wood"],[[13,26,26,30],11,"sirocco-skewed-court-bridge","gable-z","pack4:030"],[[13,31,36,44],9,"sirocco-south-rear-archive","hip","live:wood"]],"posts":[[14,5],[28,5],[5,17],[6,29],[33,16],[36,20],[18,28],[21,38]],"furniture":[[16,5,"inert-sun-basin"],[26,5,"desert-thermal-record"],[6,20,"dry-water-well"],[35,18,"unheated-relief-bench"],[20,28,"archived-sauna-chart"],[21,39,"stone-cloak-locker"]],"dependencies":[[24,7,"pack5:080","sunstone-facade-sample"]],"rooms":[["front-sun-porch",10,2,31,10],["west-deep-bath-ledger",2,13,11,33],["east-shallow-hot-stone",28,13,40,22],["narrow-central-toll-bridge",14,27,25,29],["rear-sandstone-cloak-house",14,32,35,43]],"portals":[["outside","front-sun-porch",20,1],["front-sun-porch","west-deep-bath-ledger",11,11],["front-sun-porch","east-shallow-hot-stone",29,11],["west-deep-bath-ledger","narrow-central-toll-bridge",12,28],["east-shallow-hot-stone","narrow-central-toll-bridge",27,25],["narrow-central-toll-bridge","rear-sandstone-cloak-house",19,31]],"description":"A true 6-region split rift court desert thermae with two cavernous uncovered courtyards and lopsided distinct roof wing pitches; non-operating bath"},{"category":"bathhouse","biome":"mountain","size":"small","key":"taluscrank","name":"Taluscrank Cliff-Bend Bath Lodge","dim":[27,21,31],"mask":[[1,1,24,9],[1,10,7,17],[16,10,24,23],[7,18,15,22],[6,23,19,28]],"entries":[[12,1],[5,9],[20,9],[7,19],[16,19],[13,23]],"windows":[[5,1,"north"],[22,1,"north"],[1,14,"west"],[24,16,"east"],[9,28,"south"],[18,28,"south"]],"roofs":[[[1,1,24,9],10,"taluscrank-rock-porch-gable","gable-x","pack3:025"],[[1,10,7,17],9,"taluscrank-west-heater-shelf","ramp-z","live:stone"],[[16,10,24,22],12,"taluscrank-long-east-cliff-gable","reverse-x","live:wood"],[[7,18,15,22],10,"taluscrank-bent-short-path","gable-z","pack4:030"],[[6,23,19,28],9,"taluscrank-returned-rear-cloak","hip","live:wood"]],"posts":[[5,5],[20,5],[4,13],[21,16],[21,21],[11,20],[11,26]],"furniture":[[9,5,"dry-stone-spring-label"],[19,5,"unheated-bath-permit"],[4,14,"rock-scoop-sample"],[21,17,"winter-cape-rack"],[10,20,"empty-stone-flume"],[12,26,"cold-cloak-ledger"]],"dependencies":[[13,6,"pack1:006","mountain-timber-bolt-sample"]],"rooms":[["front-warmth-register",2,2,23,9],["west-short-spring-shaft",2,10,6,16],["east-terraced-therapy",17,10,23,22],["narrow-diagonal-bath-aisle",8,19,14,21],["rear-talus-wardrobe",7,24,18,27]],"portals":[["outside","front-warmth-register",12,1],["front-warmth-register","west-short-spring-shaft",5,9],["front-warmth-register","east-terraced-therapy",20,9],["west-short-spring-shaft","narrow-diagonal-bath-aisle",7,19],["narrow-diagonal-bath-aisle","east-terraced-therapy",16,19],["narrow-diagonal-bath-aisle","rear-talus-wardrobe",13,23]],"description":"Mountain compact sideways crank with east long stone therapy hall, very short west bath tower, broken-rock sky court and physical S-turn walk"},{"category":"farm-barn","biome":"snow","size":"medium","key":"rimecroft","name":"Rimecroft Forked Hay Depot","dim":[35,23,39],"mask":[[1,1,32,9],[1,10,10,25],[23,10,32,32],[11,21,22,26],[5,27,22,36]],"entries":[[17,1],[6,9],[28,9],[10,23],[23,23],[15,27]],"windows":[[5,1,"north"],[29,1,"north"],[1,18,"west"],[32,20,"east"],[9,36,"south"],[20,36,"south"]],"roofs":[[[1,1,32,9],11,"rimecroft-long-snow-loading-bay","gable-x","pack3:025"],[[1,10,10,25],10,"rimecroft-short-left-hay-awning","ramp-z","live:wood"],[[23,10,32,32],12,"rimecroft-long-right-silo-shed","reverse-x","live:stone"],[[11,21,22,26],11,"rimecroft-staggered-wind-corridor","gable-z","pack4:030"],[[5,27,22,36],10,"rimecroft-rear-dry-crop-storage","hip","live:wood"]],"posts":[[6,5],[28,5],[5,15],[27,15],[28,28],[15,23],[11,31],[18,34]],"furniture":[[9,5,"dry-hay-inventory"],[27,5,"unpowered-hoist-plan"],[5,17,"snow-thresher-notice"],[28,20,"frost-stack-ledger"],[17,23,"silent-cargo-track"],[12,32,"winter-hay-tally"]],"dependencies":[[18,6,"pack1:005","snow-barn-joiner-sample"]],"rooms":[["north-broad-hay-loading",2,2,31,9],["west-short-snow-bay",2,10,9,24],["east-long-silo-charts",24,10,31,31],["staggered-center-aisle",12,22,21,25],["rear-frosted-feed-store",6,28,21,35]],"portals":[["outside","north-broad-hay-loading",17,1],["north-broad-hay-loading","west-short-snow-bay",6,9],["north-broad-hay-loading","east-long-silo-charts",28,9],["west-short-snow-bay","staggered-center-aisle",10,23],["staggered-center-aisle","east-long-silo-charts",23,23],["staggered-center-aisle","rear-frosted-feed-store",15,27]],"description":"Huge split dry hay depot with east finger twice west length, irregular connected crossing and daylight-open snowy grain yards"},{"category":"greenhouse","biome":"desert","size":"large","key":"miragehook","name":"Miragehook Open-Atrium Botanic House","dim":[45,24,48],"mask":[[1,1,43,9],[1,10,10,38],[32,10,43,28],[11,24,31,29],[11,30,18,38],[8,39,36,45]],"entries":[[22,1],[6,9],[38,9],[10,26],[32,26],[15,39]],"windows":[[6,1,"north"],[37,1,"north"],[1,23,"west"],[43,20,"east"],[12,45,"south"],[33,45,"south"]],"roofs":[[[1,1,43,9],11,"miragehook-broad-long-sunshade","gable-x","pack3:024"],[[1,10,10,38],10,"miragehook-deep-windbreak-cloister","ramp-z","live:stone"],[[32,10,43,28],13,"miragehook-short-high-orchid-wing","reverse-x","live:stone"],[[11,24,31,29],11,"miragehook-narrow-glazed-crosspass","gable-z","pack4:030"],[[11,30,18,38],10,"miragehook-southern-spine","reverse-z","live:wood"],[[8,39,36,45],9,"miragehook-deep-back-garden-store","hip","live:wood"]],"posts":[[7,5],[36,5],[5,18],[5,33],[37,18],[38,25],[19,27],[14,34],[17,42],[30,42]],"furniture":[[9,5,"dry-arid-seed-ledger"],[34,5,"mirror-sun-record"],[5,21,"retired-water-condenser"],[38,18,"desert-potted-sandplant"],[20,27,"unpowered-light-reflector"],[15,34,"empty-soil-recipe"],[25,42,"seed-catalogue"]],"dependencies":[[21,5,"pack5:080","desert-granite-glaze-base"]],"rooms":[["front-wide-sun-hall",2,2,42,9],["west-deep-wind-shelter",2,10,9,37],["east-short-bright-workroom",33,10,42,27],["center-glass-traverse",12,25,30,28],["southern-stem-hall",12,31,17,37],["rear-cultivation-archive",9,40,35,44]],"portals":[["outside","front-wide-sun-hall",22,1],["front-wide-sun-hall","west-deep-wind-shelter",6,9],["front-wide-sun-hall","east-short-bright-workroom",38,9],["west-deep-wind-shelter","center-glass-traverse",10,26],["center-glass-traverse","east-short-bright-workroom",32,26],["center-glass-traverse","southern-stem-hall",15,29],["southern-stem-hall","rear-cultivation-archive",15,39]],"description":"6-region desert botanical cloister around an extremely broad true missing-source atrium, with divergent sunroof elevations and long rear dogleg"},{"category":"greenhouse","biome":"temperate","size":"large","key":"mossbell","name":"Mossbell Double-Loop Fernery","dim":[46,24,50],"mask":[[12,1,33,10],[1,11,12,34],[33,11,44,22],[13,20,32,25],[30,26,39,35],[12,36,39,47]],"entries":[[22,1],[12,10],[33,10],[12,22],[33,21],[31,26],[12,33],[22,36],[12,11],[33,11],[13,22],[32,21],[31,25],[33,35],[33,36],[12,9],[12,12],[33,9],[33,12]],"windows":[[16,1,"north"],[30,1,"north"],[1,21,"west"],[44,17,"east"],[15,47,"south"],[36,47,"south"]],"roofs":[[[12,1,33,10],11,"mossbell-north-arched-reed-hall","gable-x","pack3:023"],[[1,11,12,34],10,"mossbell-long-west-fern-gallery","ramp-z","live:wood"],[[33,11,44,22],13,"mossbell-short-high-east-orchard","reverse-x","pack4:030"],[[13,20,32,25],11,"mossbell-central-glass-bridge","gable-z","live:wood"],[[30,26,39,35],12,"mossbell-east-return-archive","reverse-z","live:stone"],[[12,36,39,47],10,"mossbell-broad-return-garden","hip","live:wood"]],"posts":[[17,5],[29,5],[6,19],[5,29],[38,16],[18,22],[27,22],[35,31],[19,40],[32,42]],"furniture":[[18,5,"fern-specimen-journal"],[28,5,"natural-moss-ledger"],[7,19,"dry-pump-note"],[39,17,"retired-blossom-plan"],[19,22,"glasshouse-map"],[36,31,"seasonal-fern-shelf"],[25,41,"botanic-index"]],"dependencies":[[24,7,"pack1:002","temperate-ceiling-trim"]],"rooms":[["front-arch-visitor-gallery",13,2,32,9],["west-deep-plant-lane",2,12,11,33],["east-upper-fern-observatory",34,12,43,21],["central-courtyard-bridge",14,21,31,24],["east-back-record-library",31,27,38,34],["rear-broad-glass-archive",13,37,38,46]],"portals":[["outside","front-arch-visitor-gallery",22,1],["front-arch-visitor-gallery","west-deep-plant-lane",12,10],["front-arch-visitor-gallery","east-upper-fern-observatory",33,10],["west-deep-plant-lane","central-courtyard-bridge",12,22],["central-courtyard-bridge","east-upper-fern-observatory",33,21],["central-courtyard-bridge","east-back-record-library",31,26],["west-deep-plant-lane","rear-broad-glass-archive",12,33],["east-back-record-library","rear-broad-glass-archive",22,36]],"description":"Two giant separate outdoor voids threaded by overlapping-looking but distinct physically linked glass loops and dissimilar west/east ridge elevations"},{"category":"fishing-lodge","biome":"snow","size":"medium","key":"driftwake","name":"Driftwake Forked-Net Exchange","dim":[33,23,41],"mask":[[1,1,14,11],[15,1,30,7],[1,12,10,31],[22,8,30,23],[11,22,21,27],[12,28,16,32],[7,32,24,38]],"entries":[[8,1],[22,1],[7,11],[24,7],[10,24],[22,22],[14,28],[14,32]],"windows":[[4,1,"north"],[27,1,"north"],[1,19,"west"],[30,17,"east"],[10,38,"south"],[21,38,"south"]],"roofs":[[[1,1,14,11],10,"driftwake-broken-west-load-hall","gable-x","pack3:025"],[[15,1,30,7],12,"driftwake-short-tall-east-bay","reverse-x","live:stone"],[[1,12,10,31],10,"driftwake-deep-west-ice-net","ramp-z","live:wood"],[[22,8,30,23],11,"driftwake-middle-east-quay","gable-z","live:stone"],[[11,22,21,27],10,"driftwake-central-short-bridge","reverse-z","pack4:030"],[[12,28,16,31],9,"driftwake-south-throat","ramp-z","live:wood"],[[7,32,24,38],10,"driftwake-back-harbor-ledger","hip","live:wood"]],"posts":[[5,5],[10,5],[22,4],[7,19],[6,27],[27,16],[16,25],[14,30],[16,35]],"furniture":[[6,5,"dried-net-index"],[24,4,"winter-landing-certificate"],[5,19,"unused-hook-station"],[26,17,"snow-dock-flag"],[17,25,"dry-route-plan"],[16,36,"cold-creel-shelf"]],"dependencies":[[10,7,"pack1:005","snow-runway-timber-frame"]],"rooms":[["west-main-loading-hall",2,2,13,10],["east-short-public-window",16,2,29,7],["west-long-ice-cooperative",2,12,9,30],["east-mid-trade-office",23,9,29,22],["middle-crossing",12,23,20,26],["back-trade-room",8,33,23,37]],"portals":[["outside","west-main-loading-hall",8,1],["outside","east-short-public-window",22,1],["west-main-loading-hall","west-long-ice-cooperative",7,11],["east-short-public-window","east-mid-trade-office",24,7],["west-long-ice-cooperative","middle-crossing",10,24],["middle-crossing","east-mid-trade-office",22,22],["middle-crossing","back-trade-room",14,32]],"description":"Asymmetric split-front fishing cooperative with two physically independent street entries connected by a twisting snow-yard walk"},{"category":"harbor-office","biome":"mountain","size":"medium","key":"ridgebar","name":"Ridgebar Cantilever Customs Registry","dim":[36,23,42],"mask":[[1,1,33,10],[1,11,9,28],[24,11,33,21],[10,21,23,26],[19,27,25,28],[9,29,30,39]],"entries":[[17,1],[5,10],[28,10],[9,23],[24,21],[20,27],[20,29],[5,11],[28,11],[10,23],[23,21],[20,26],[20,28],[24,20],[22,21]],"windows":[[5,1,"north"],[30,1,"north"],[1,18,"west"],[33,16,"east"],[13,39,"south"],[28,39,"south"]],"roofs":[[[1,1,33,10],11,"ridgebar-huge-front-slate-cap","gable-x","pack3:025"],[[1,11,9,28],10,"ridgebar-west-cliff-records","ramp-z","live:stone"],[[24,11,33,21],13,"ridgebar-east-higher-levy-cabin","reverse-x","live:wood"],[[10,21,23,26],11,"ridgebar-narrow-central-ridgewalk","gable-z","pack4:030"],[[19,27,25,28],10,"ridgebar-offset-lower-throat","ramp-z","live:stone"],[[9,29,30,39],10,"ridgebar-wide-back-archive","hip","live:wood"]],"posts":[[6,5],[28,5],[5,18],[28,16],[16,23],[21,27],[14,34],[25,35]],"furniture":[[10,5,"mountain-customs-paper"],[27,5,"unpaid-harbor-tariff"],[5,19,"cliff-flag-ledger"],[29,17,"route-signal-notice"],[17,23,"stone-crosswalk-chart"],[18,34,"dried-import-record"]],"dependencies":[[20,7,"pack1:006","stone-ledge-mounting-swatch"]],"rooms":[["front-state-registrar",2,2,32,9],["west-long-cliff-ledger",2,12,8,27],["east-short-quarry-stamp",25,12,32,20],["narrow-bridge-record",11,22,22,25],["southern-main-paper-store",10,30,29,38]],"portals":[["outside","front-state-registrar",17,1],["front-state-registrar","west-long-cliff-ledger",5,10],["front-state-registrar","east-short-quarry-stamp",28,10],["west-long-cliff-ledger","narrow-bridge-record",9,23],["narrow-bridge-record","east-short-quarry-stamp",24,21],["narrow-bridge-record","southern-main-paper-store",20,29]],"description":"Cranked cliff registry with offset back warehouse, high short eastern roof cliff and long west records gallery separated by outdoor exposed stone"},{"category":"lighthouse","biome":"enchanted-forest","size":"large","key":"moonbranch","name":"Moonbranch Crown-Spiral Beacon","dim":[42,44,48],"wallTop":8,"mask":[[1,1,18,22],[18,12,39,25],[1,23,10,39],[27,26,39,42],[11,32,26,37],[12,38,26,45]],"entries":[[9,1],[18,15],[6,22],[29,25],[10,34],[26,34],[17,38]],"windows":[[5,1,"north"],[1,15,"west"],[34,12,"north"],[39,19,"east"],[5,37,"west"],[23,45,"south"]],"roofs":[[[19,12,39,25],12,"moonbranch-high-east-keeper-gallery","gable-x","pack3:023"],[[1,23,10,39],10,"moonbranch-west-long-root-pier","ramp-z","live:wood"],[[27,26,39,42],11,"moonbranch-deep-east-moon-charts","reverse-z","live:stone"],[[11,32,26,37],10,"moonbranch-bottom-cross-shade","gable-z","pack4:030"],[[12,38,26,45],10,"moonbranch-south-chart-loggia","hip","live:wood"]],"posts":[[24,17],[33,19],[5,28],[6,36],[33,31],[34,38],[17,35],[18,41]],"furniture":[[9,6,"unpowered-moon-lens"],[29,17,"forest-keeper-paper"],[5,29,"root-signal-ledger"],[34,33,"river-chart-record"],[18,35,"inactive-stars-stand"],[17,42,"archive-vellum"]],"dependencies":[[25,18,"pack2:013","enchanted-rootstone-trim"]],"rooms":[["lower-beacon-hollow",2,2,17,21],["high-eastern-keeper-room",19,13,38,24],["west-sky-root-gallery",2,24,9,38],["rear-east-moon-archives",28,27,38,41],["southern-chart-crosspass",12,33,25,36],["end-loggia",13,39,25,44]],"portals":[["outside","lower-beacon-hollow",9,1],["lower-beacon-hollow","high-eastern-keeper-room",18,15],["lower-beacon-hollow","west-sky-root-gallery",6,22],["high-eastern-keeper-room","rear-east-moon-archives",29,25],["west-sky-root-gallery","southern-chart-crosspass",10,34],["southern-chart-crosspass","rear-east-moon-archives",26,34],["southern-chart-crosspass","end-loggia",17,38]],"beacon":{"stages":[["cap",1,1,18,22,9,9,"live:wood","moonbranch-broad-rooted-platform"],["ring",4,4,15,19,10,22,"live:wood","moonbranch-thick-cantilever-wood-shaft"],["cap",4,4,15,19,23,23,"live:stone","moonbranch-circular-sight-belt"],["ring",6,6,13,17,24,30,"live:wood","moonbranch-sky-prism-upper-shaft"],["cap",6,6,13,17,31,31,"live:crystal","moonbranch-unlit-crown-cap"]],"finials":[[9,11,32,37,"live:crystal","moonbranch-nonoperational-lunar-finial"]]},"description":"Giant rooted moon beacon with one tall stepped shaft, bent rear and side service ranges, and open rocky forest courts; upper access and light remain disabled"},{"category":"fishing-lodge","biome":"enchanted-forest","size":"medium","key":"fernwater","name":"Fernwater Asymmetric River-Hook Guild","dim":[36,23,39],"mask":[[7,1,28,8],[1,9,10,28],[24,9,33,21],[11,21,23,26],[14,27,18,29],[8,29,30,36]],"entries":[[18,1],[7,8],[27,8],[10,23],[24,21],[16,27],[16,29],[7,9],[27,9],[11,23],[23,21],[16,26],[24,20],[22,21]],"windows":[[11,1,"north"],[25,1,"north"],[1,17,"west"],[33,17,"east"],[13,36,"south"],[26,36,"south"]],"roofs":[[[7,1,28,8],10,"fernwater-thin-river-street-porch","gable-x","pack3:023"],[[1,9,10,28],10,"fernwater-left-deep-net-return","ramp-z","live:wood"],[[24,9,33,21],12,"fernwater-east-high-boat-records","reverse-x","live:stone"],[[11,21,23,26],11,"fernwater-middle-forkwalk","gable-z","pack4:030"],[[14,27,18,28],9,"fernwater-lower-connecting-neck","ramp-z","live:wood"],[[8,29,30,36],10,"fernwater-rear-wetland-shelf","hip","live:wood"]],"posts":[[12,4],[23,4],[5,16],[5,25],[29,15],[29,20],[17,23],[16,27],[13,33],[25,33]],"furniture":[[14,4,"retired-river-net"],[24,4,"empty-cargo-tracker"],[6,16,"reed-boat-archive"],[29,16,"silent-fishing-scale"],[18,23,"river-map-slate"],[17,33,"dry-fernwater-log"]],"dependencies":[[20,5,"pack2:013","rootstone-pier-trim"]],"rooms":[["front-reed-landing",8,2,27,8],["west-long-boat-chart",2,10,9,27],["east-short-flower-guild",25,10,32,20],["middle-shade-bridge",12,22,22,25],["rear-river-guild-archive",9,30,29,35]],"portals":[["outside","front-reed-landing",18,1],["front-reed-landing","west-long-boat-chart",7,8],["front-reed-landing","east-short-flower-guild",27,8],["west-long-boat-chart","middle-shade-bridge",10,23],["middle-shade-bridge","east-short-flower-guild",24,21],["middle-shade-bridge","rear-river-guild-archive",16,29]],"description":"Unique long L-to-hook wetland guild with thin north stem, long left pier, high short east pavilion and back-traversing archive around empty source courtyards"}];
export function getM2MRegional1BPlans(){return SURVEYS.map(original);}
