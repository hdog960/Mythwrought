// Builder 1B M2N — six original source-coordinate variant-002 service buildings. No world registration.
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





const SURVEYS=[{"category":"bathhouse","biome":"enchanted-forest","size":"medium","key":"thornmere","name":"Thornmere Petal-Court Baths","dim":[39,24,42],"mask":[[14,1,28,8],[11,9,25,24],[1,11,10,20],[26,15,35,28],[12,25,22,37],[3,21,10,31]],"entries":[[20,1],[20,8],[20,9],[11,16],[10,16],[25,19],[26,19],[17,24],[17,25],[6,20],[6,21]],"windows":[[18,1,"north"],[1,15,"west"],[35,22,"east"],[15,37,"south"],[3,27,"west"]],"roofs":[[[14,1,28,8],11,"thornmere-thin-portal-spire","gable-x","pack3:023"],[[11,9,25,24],13,"thornmere-tall-inner-petal","hip","pack4:030"],[[1,11,10,20],9,"thornmere-low-west-leaf","ramp-z","live:wood"],[[26,15,35,28],14,"thornmere-high-east-lotus","gable-z","live:wood"],[[12,25,22,37],10,"thornmere-south-cloak-gallery","reverse-z","live:stone"],[[3,21,10,31],9,"thornmere-curl-rear-porch","hip","live:wood"]],"posts":[[19,4],[18,14],[22,19],[5,15],[30,20],[31,24],[16,30],[7,27]],"furniture":[[22,5,"inert-forest-bath-book"],[17,18,"empty-thermal-well"],[5,17,"moss-stone-sample"],[31,22,"woodland-sauna-plan"],[17,32,"dry-spa-index"],[6,25,"unoperated-root-water-pump"]],"dependencies":[[23,6,"pack2:013","enchanted-moss-basin-sample"]],"rooms":[["north-ritual-entry",15,2,27,7],["central-leaf-court",12,10,24,23],["west-dry-leaf-bay",2,12,9,19],["east-high-fern-bath",27,16,34,27],["south-root-cloakroom",13,26,21,36],["southwest-willow-porch",4,22,9,30]],"portals":[["outside","north-ritual-entry",20,1],["north-ritual-entry","central-leaf-court",20,8],["central-leaf-court","west-dry-leaf-bay",11,16],["central-leaf-court","east-high-fern-bath",25,19],["central-leaf-court","south-root-cloakroom",17,24],["west-dry-leaf-bay","southwest-willow-porch",6,20]],"description":"Six radiating different-height leaf wings around an off-center open sky court, a curving back porch and a raised eastern bath wing. No water mechanics."},{"category":"farm-barn","biome":"temperate","size":"large","key":"alderfield","name":"Alderfield Windmill-Cross Barn","dim":[45,25,50],"mask":[[10,1,38,12],[15,13,29,27],[1,14,14,40],[30,15,41,25],[15,28,28,46],[3,41,14,46]],"entries":[[23,1],[22,12],[22,13],[14,20],[15,20],[29,19],[30,19],[21,27],[21,28],[9,40],[9,41],[14,43],[15,43]],"windows":[[15,1,"north"],[34,1,"north"],[1,23,"west"],[41,20,"east"],[23,46,"south"],[3,43,"west"]],"roofs":[[[10,1,38,12],11,"alderfield-wide-front-dutch-truss","gable-x","pack3:023"],[[15,13,29,27],13,"alderfield-high-cross-timber-ridge","gable-z","live:wood"],[[1,14,14,40],9,"alderfield-long-west-threshing-shed","ramp-z","live:stone"],[[30,15,41,25],15,"alderfield-east-short-silo-gallery","reverse-x","live:wood"],[[15,28,28,46],10,"alderfield-long-south-hay-vault","hip","pack3:023"],[[3,41,14,46],9,"alderfield-side-seed-store","reverse-z","live:wood"]],"posts":[[15,5],[33,5],[19,18],[25,23],[5,20],[5,34],[35,19],[21,34],[23,43],[8,43]],"furniture":[[20,5,"disused-temperate-thresher"],[32,5,"hayway-cartographic-map"],[21,20,"inactive-lift-record"],[5,27,"dry-grain-count"],[36,20,"silo-gear-model"],[22,39,"winter-feed-ledger"],[9,44,"wheat-charter"]],"dependencies":[[24,7,"pack1:002","old-growth-beam-swatch"]],"rooms":[["north-loading-crosshall",11,2,37,11],["middle-raised-windmill-bay",16,14,28,26],["west-long-threshing-aisle",2,15,13,39],["east-short-grain-silo",31,16,40,24],["southern-hay-guild",16,29,27,45],["back-west-grain-porch",4,42,13,45]],"portals":[["outside","north-loading-crosshall",23,1],["north-loading-crosshall","middle-raised-windmill-bay",22,12],["middle-raised-windmill-bay","west-long-threshing-aisle",14,20],["middle-raised-windmill-bay","east-short-grain-silo",29,19],["middle-raised-windmill-bay","southern-hay-guild",21,27],["west-long-threshing-aisle","back-west-grain-porch",9,40],["back-west-grain-porch","southern-hay-guild",14,43]],"description":"A six-direction windmill-cross farm: high central hay hall, huge low western wing, a high eastern silo and returned side seed porch."},{"category":"greenhouse","biome":"enchanted-forest","size":"medium","key":"wispglass","name":"Wispglass Split-Orchid Conservatory","dim":[43,26,48],"mask":[[8,1,31,11],[14,12,27,26],[1,14,13,34],[28,17,40,29],[11,27,31,44],[32,32,40,43]],"entries":[[20,1],[20,11],[20,12],[13,20],[14,20],[27,22],[28,22],[20,26],[20,27],[31,37],[32,37]],"windows":[[13,1,"north"],[28,1,"north"],[1,25,"west"],[40,22,"east"],[15,44,"south"],[37,43,"south"]],"roofs":[[[8,1,31,11],10,"wispglass-low-forest-glazed-entry","gable-x","pack3:023"],[[14,12,27,26],15,"wispglass-tall-central-crystal-aisle","gable-z","pack4:030"],[[1,14,13,34],11,"wispglass-west-fern-corridor","ramp-z","live:wood"],[[28,17,40,26],13,"wispglass-east-frost-orchid-bay","reverse-x","pack4:030"],[[14,27,31,44],9,"wispglass-wide-southern-root-bed","hip","live:wood"],[[32,32,40,43],12,"wispglass-side-rise-orchid-study","reverse-z","live:stone"],[[32,27,40,29],10,"wispglass-eastern-terrace-taper","reverse-z","live:stone"]],"posts":[[13,5],[27,5],[18,18],[23,22],[5,22],[5,30],[34,23],[35,27],[16,35],[24,39],[36,38]],"furniture":[[19,5,"inactive-glowing-seed-rack"],[22,17,"moon-orchid-chart"],[5,24,"empty-mushroom-tray"],[34,21,"root-glass-sample"],[22,37,"glasshouse-plant-ledger"],[37,38,"elder-fern-record"]],"dependencies":[[25,7,"pack2:013","enchanted-fern-stone-base"]],"rooms":[["north-fern-visitor-bay",9,2,30,10],["tall-center-glazing-aisle",15,13,26,25],["west-long-moss-research",2,15,12,33],["east-short-orchid-science",29,18,39,28],["south-open-seed-history",12,28,30,43],["southeast-side-study",33,33,39,42]],"portals":[["outside","north-fern-visitor-bay",20,1],["north-fern-visitor-bay","tall-center-glazing-aisle",20,11],["tall-center-glazing-aisle","west-long-moss-research",13,20],["tall-center-glazing-aisle","east-short-orchid-science",27,22],["tall-center-glazing-aisle","south-open-seed-history",20,26],["south-open-seed-history","southeast-side-study",31,37]],"description":"A tall central crystal aisle with widely varied roof heights and separate open-air orchid courts. Growing mechanics remain unimplemented."},{"category":"fishing-lodge","biome":"mountain","size":"large","key":"stonehook","name":"Stonehook Gorge-Zigzag Fishery","dim":[45,25,47],"mask":[[1,1,19,11],[20,7,38,16],[3,12,13,27],[12,17,38,24],[14,25,33,42],[34,25,41,37]],"entries":[[9,1],[19,9],[20,9],[9,11],[9,12],[27,16],[27,17],[13,21],[14,21],[24,24],[24,25],[33,31],[34,31]],"windows":[[5,1,"north"],[1,5,"west"],[35,7,"north"],[38,13,"east"],[3,19,"west"],[24,42,"south"],[41,31,"east"]],"roofs":[[[1,1,19,11],10,"stonehook-west-broken-cliff-gable","gable-x","pack3:025"],[[20,7,38,16],14,"stonehook-northeast-tall-watch","reverse-x","live:stone"],[[3,12,13,27],9,"stonehook-low-west-net-cove","ramp-z","live:wood"],[[14,17,38,24],12,"stonehook-long-gorge-bridge-roof","gable-z","pack4:030"],[[14,25,33,42],10,"stonehook-distant-fish-records","hip","live:wood"],[[34,25,41,37],13,"stonehook-narrow-right-drying-tower","reverse-z","live:stone"]],"posts":[[6,5],[15,5],[25,11],[33,12],[7,18],[9,24],[18,20],[30,20],[20,31],[25,39],[38,30]],"furniture":[[11,5,"dry-river-raft-map"],[30,11,"unpowered-cliff-signal"],[7,20,"net-splice-station"],[25,20,"inactive-bridge-buoy"],[21,33,"archived-fishery-record"],[38,32,"quarry-route-ledger"]],"dependencies":[[29,11,"pack1:006","quarry-stone-gorge-support"]],"rooms":[["northwest-cliff-net-house",2,2,18,10],["northeast-raised-watch",21,8,37,15],["deep-west-boat-gorge",4,13,12,26],["long-middle-bridge-hall",15,18,37,23],["south-river-archive",15,26,32,41],["east-net-drying-tower",35,26,40,36]],"portals":[["outside","northwest-cliff-net-house",9,1],["northwest-cliff-net-house","northeast-raised-watch",19,9],["northwest-cliff-net-house","deep-west-boat-gorge",9,11],["northeast-raised-watch","long-middle-bridge-hall",27,16],["deep-west-boat-gorge","long-middle-bridge-hall",13,21],["long-middle-bridge-hall","south-river-archive",24,24],["south-river-archive","east-net-drying-tower",33,31]],"description":"A stepped gorge-Z of a low net cove, tall off-axis cliff watchhouse and long bridged river hall. Fishing remains disabled."},{"category":"harbor-office","biome":"snow","size":"large","key":"snowguard","name":"Snowguard C-Court Harbor Bureau","dim":[44,25,52],"mask":[[1,1,40,12],[1,13,12,38],[31,13,40,25],[31,26,36,36],[13,27,30,32],[13,33,19,38],[9,39,35,48]],"entries":[[20,1],[6,12],[35,12],[12,29],[13,29],[30,29],[31,29],[17,32],[17,33],[10,38],[10,39]],"windows":[[8,1,"north"],[34,1,"north"],[1,22,"west"],[40,18,"east"],[35,34,"east"],[12,48,"south"],[30,48,"south"]],"roofs":[[[1,1,40,12],11,"snowguard-wide-state-front-cap","gable-x","pack3:025"],[[1,13,12,38],10,"snowguard-west-deep-maritime-ledger","ramp-z","live:stone"],[[31,13,40,25],15,"snowguard-right-high-levy-chamber","reverse-x","live:wood"],[[31,26,36,36],12,"snowguard-east-perched-observation","reverse-z","live:stone"],[[13,27,30,32],11,"snowguard-bridge-over-cold-court","gable-z","pack4:030"],[[13,33,19,38],9,"snowguard-throat-rear-run","ramp-z","live:wood"],[[9,39,35,48],10,"snowguard-long-back-chamber","hip","live:wood"]],"posts":[[8,5],[34,5],[6,20],[6,33],[35,18],[34,31],[18,29],[16,35],[15,43],[29,44]],"furniture":[[12,5,"unpaid-port-state-charter"],[30,5,"winter-levy-index"],[6,25,"snowbound-ship-log"],[35,20,"unpowered-maritime-signal"],[18,30,"bridge-clearance-record"],[16,36,"archive-supply-card"],[24,43,"harbor-office-registry"]],"dependencies":[[23,5,"pack1:005","harbor-winter-thick-timber"]],"rooms":[["wide-snow-state-counter",2,2,39,11],["west-deep-import-archive",2,14,11,37],["east-high-tax-gallery",32,14,39,24],["raised-east-observation",32,27,35,35],["middle-cold-court-bridge",14,28,29,31],["rear-neck-run",14,34,18,37],["giant-rear-public-library",10,40,34,47]],"portals":[["outside","wide-snow-state-counter",20,1],["wide-snow-state-counter","west-deep-import-archive",6,12],["wide-snow-state-counter","east-high-tax-gallery",35,12],["west-deep-import-archive","middle-cold-court-bridge",12,29],["middle-cold-court-bridge","raised-east-observation",30,29],["middle-cold-court-bridge","rear-neck-run",17,32],["rear-neck-run","giant-rear-public-library",10,39]],"description":"A sharply C-shaped snow port bureau with a large open inner snow courtyard, tall eastern roof and offset rear public archive."},{"category":"lighthouse","biome":"desert","size":"medium","key":"dunebeacon","name":"Dunebeacon Scarp-Step Observatory","dim":[42,42,46],"wallTop":8,"mask":[[1,1,17,22],[18,11,37,25],[1,23,11,35],[12,29,27,39],[28,26,38,41],[20,26,25,28]],"entries":[[9,1],[17,15],[18,15],[6,22],[6,23],[23,25],[23,26],[11,33],[12,33],[27,34],[28,34],[23,28],[23,29]],"windows":[[6,1,"north"],[1,14,"west"],[28,11,"north"],[37,20,"east"],[5,35,"west"],[22,39,"south"],[34,41,"south"]],"roofs":[[[18,11,37,25],12,"dunebeacon-big-sand-keeper-gable","gable-x","pack3:024"],[[1,23,11,35],9,"dunebeacon-west-low-scarp-porch","ramp-z","live:stone"],[[12,29,27,39],10,"dunebeacon-south-navigation-archive","hip","live:wood"],[[28,26,38,41],13,"dunebeacon-east-raised-keeper-vault","reverse-z","live:stone"],[[20,26,25,28],11,"dunebeacon-sunbridge-neck","ramp-z","live:stone"]],"posts":[[23,15],[32,18],[5,29],[6,33],[18,34],[23,37],[34,31],[35,37]],"furniture":[[9,6,"unlit-sand-signal-plan"],[26,16,"ancient-star-azimuth"],[5,30,"dry-sunbeam-record"],[18,35,"unpowered-desert-weather-chart"],[34,35,"scarp-wind-manifest"]],"dependencies":[[27,17,"pack5:080","desert-stone-window-mount"]],"rooms":[["base-buttress-observatory",2,2,16,21],["east-high-keeper-hall",19,12,36,24],["west-low-sand-pier",2,24,10,34],["south-navigation-library",13,30,26,38],["right-thick-archive-wing",29,27,37,40]],"portals":[["outside","base-buttress-observatory",9,1],["base-buttress-observatory","east-high-keeper-hall",17,15],["base-buttress-observatory","west-low-sand-pier",6,22],["east-high-keeper-hall","south-navigation-library",23,25],["west-low-sand-pier","south-navigation-library",11,33],["south-navigation-library","right-thick-archive-wing",27,34]],"beacon":{"stages":[["cap",1,1,17,22,9,9,"live:stone","dunebeacon-low-wide-buttress"],["ring",4,4,14,18,10,20,"live:stone","dunebeacon-first-inset-square-shaft"],["cap",4,4,14,18,21,21,"live:stone","dunebeacon-first-desert-sight-platform"],["ring",7,7,11,14,22,29,"live:wood","dunebeacon-final-prism-shaft"],["cap",7,7,11,14,30,30,"live:crystal","dunebeacon-high-sunroof"]],"finials":[[9,10,31,36,"live:crystal","dunebeacon-unlit-scarp-finial"]]},"description":"A stepped desert scarp observatory with a broad keeper house and separate low west/high east offices. Its beacon and upper access are disabled."}];
export function getM2NRegional1BPlans(){return SURVEYS.map(original);}
