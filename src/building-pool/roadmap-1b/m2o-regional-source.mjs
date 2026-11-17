// Builder 1B M2O: six independently source-authored second-variant buildings. Draft only.
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
  sourceAuthor:'Builder 1B M2O second-variant XYZ blueprint',
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






const SURVEYS=[{"category":"bathhouse","biome":"snow","size":"medium","key":"rimewheel","name":"Rimewheel Cross-Court Snow Thermae","dim":[37,26,41],"mask":[[11,1,25,9],[1,10,11,31],[25,10,35,24],[12,18,24,24],[12,25,32,38],[3,32,11,37]],"entries":[[18,1],[11,9],[11,10],[25,9],[25,10],[11,21],[12,21],[24,20],[25,20],[18,24],[18,25],[9,31],[9,32],[11,34],[12,34],[12,8],[12,9],[24,8],[24,9],[11,11],[25,11]],"windows":[[16,1,"north"],[1,19,"west"],[35,17,"east"],[20,38,"south"],[3,35,"west"],[32,31,"east"]],"roofs":[[[11,1,25,9],11,"rimewheel-narrow-northern-ice-vault","gable-x","pack3:025"],[[1,10,11,31],9,"rimewheel-long-west-bathing-ramp","ramp-z","live:stone"],[[25,10,35,24],14,"rimewheel-short-high-east-steam-shield","reverse-x","live:wood"],[[12,18,24,24],11,"rimewheel-cross-court-bridge","gable-z","pack4:030"],[[12,25,32,38],10,"rimewheel-broad-rear-cloak-gallery","hip","live:wood"],[[3,32,11,37],9,"rimewheel-offset-west-snow-porch","reverse-z","live:stone"]],"posts":[[16,5],[5,15],[6,26],[30,17],[31,22],[18,21],[19,32],[27,35],[6,35]],"furniture":[[20,5,"dry-frost-thermal-placard"],[5,19,"inactive-snow-waterway"],[30,18,"cold-vapor-chart"],[18,22,"unpowered-thermal-flow"],[23,32,"cloak-index"],[7,34,"snow-workbench"]],"dependencies":[[21,5,"pack1:005","winter-column-sample"]],"rooms":[["north-narrow-registration",12,2,24,8],["west-deep-ice-gallery",2,11,10,30],["east-short-glass-bath",26,11,34,23],["central-warm-bridge",13,19,23,23],["rear-cold-weather-archive",13,26,31,37],["westward-snow-store",4,33,10,36]],"portals":[["outside","north-narrow-registration",18,1],["north-narrow-registration","west-deep-ice-gallery",11,9],["north-narrow-registration","east-short-glass-bath",25,9],["west-deep-ice-gallery","central-warm-bridge",11,21],["central-warm-bridge","east-short-glass-bath",25,20],["central-warm-bridge","rear-cold-weather-archive",18,24],["west-deep-ice-gallery","westward-snow-store",9,31],["westward-snow-store","rear-cold-weather-archive",11,34]],"description":"Snow-bath radial cross of six unequal wings, long low west gallery, short high east shield, double genuine courtyard gaps and side snow-room; no real heating or water."},{"category":"farm-barn","biome":"desert","size":"small","key":"duneshift","name":"Duneshift Crooked Grain Silo","dim":[28,22,33],"mask":[[1,1,25,8],[1,9,8,20],[19,9,25,26],[9,17,18,22],[9,23,22,30],[1,22,8,29]],"entries":[[13,1],[5,8],[5,9],[22,8],[22,9],[8,18],[9,18],[18,19],[19,19],[14,22],[14,23],[8,26],[9,26]],"windows":[[4,1,"north"],[23,1,"north"],[1,14,"west"],[25,20,"east"],[13,30,"south"],[1,25,"west"]],"roofs":[[[1,1,25,8],10,"duneshift-wide-front-tiled-awning","gable-x","pack3:024"],[[1,9,8,20],9,"duneshift-short-west-dust-shed","ramp-z","live:stone"],[[19,9,25,22],12,"duneshift-tall-east-granary-tower","reverse-z","live:wood"],[[9,17,18,22],11,"duneshift-angled-west-crosswalk","gable-z","pack4:030"],[[9,23,22,30],10,"duneshift-rear-broken-hay-archive","hip","live:stone"],[[1,22,8,29],9,"duneshift-offset-west-cargo-locker","reverse-x","live:wood"],[[23,23,25,26],10,"duneshift-east-far-grain-lean","ramp-z","live:stone"]],"posts":[[5,4],[21,4],[5,14],[22,15],[22,23],[13,20],[17,27],[4,25]],"furniture":[[9,4,"dry-sand-feed-ledger"],[20,4,"empty-desert-grain-counter"],[5,16,"unpowered-trailer-scale"],[22,18,"cactus-hay-label"],[14,20,"silent-transport-sign"],[18,27,"storage-route-map"],[4,26,"old-silo-ticket"]],"dependencies":[[11,5,"pack5:080","desert-granary-trim-swatch"]],"rooms":[["front-public-dry-cart-bay",2,2,24,8],["west-short-dust-trough",2,10,7,19],["east-taller-feed-annex",20,10,24,25],["center-tilted-loading-link",10,18,17,21],["rear-dry-grain-records",10,24,21,29],["west-cargo-locker",2,23,7,28]],"portals":[["outside","front-public-dry-cart-bay",13,1],["front-public-dry-cart-bay","west-short-dust-trough",5,8],["front-public-dry-cart-bay","east-taller-feed-annex",22,8],["west-short-dust-trough","center-tilted-loading-link",8,18],["center-tilted-loading-link","east-taller-feed-annex",19,19],["center-tilted-loading-link","rear-dry-grain-records",14,22],["west-cargo-locker","rear-dry-grain-records",8,26]],"description":"Compact desert grain-house with asymmetrical broken-Z cargo path, extended eastern silo arm and western small cargo locker, exposed central sand court."},{"category":"greenhouse","biome":"mountain","size":"large","key":"skyterrace","name":"Skyterrace Seven-Range Cliff Conservatory","dim":[48,26,53],"mask":[[15,1,33,12],[1,13,14,37],[34,13,45,25],[15,23,33,28],[28,29,42,40],[10,41,42,50],[5,38,9,45],[14,12,17,14],[32,12,35,14]],"entries":[[24,1],[20,12],[9,13],[36,13],[14,25],[15,25],[33,25],[34,25],[29,28],[29,29],[29,40],[29,41],[7,37],[7,38],[9,43],[10,43],[15,12],[16,11],[16,12],[15,13],[14,13],[14,14],[32,11],[32,12],[33,12],[33,13],[34,13],[34,14],[35,13],[35,14]],"windows":[[20,1,"north"],[30,1,"north"],[1,23,"west"],[45,20,"east"],[36,36,"east"],[27,50,"south"],[5,42,"west"]],"roofs":[[[15,1,33,12],12,"skyterrace-north-crag-arch","gable-x","pack3:025"],[[1,13,14,37],9,"skyterrace-west-limestone-glass-run","ramp-z","live:stone"],[[34,13,45,25],15,"skyterrace-high-east-wind-terrace","reverse-x","pack4:030"],[[15,23,33,28],11,"skyterrace-broad-crossing-snow-window","gable-z","live:wood"],[[28,29,42,40],12,"skyterrace-rising-eastern-herb-shelves","reverse-z","live:stone"],[[10,41,42,50],10,"skyterrace-south-orchid-collection","hip","live:wood"],[[5,38,9,45],9,"skyterrace-west-narrow-return","ramp-z","live:stone"]],"posts":[[19,5],[29,5],[6,18],[6,31],[39,19],[40,23],[20,26],[32,26],[35,35],[19,46],[34,46],[7,42]],"furniture":[[22,5,"mountain-seed-catalogue"],[30,5,"altitude-botany-guide"],[6,22,"dry-cliff-planter"],[39,21,"inactive-cloud-irrigator"],[21,26,"glass-bridge-survey"],[36,35,"ledge-collection-tag"],[23,46,"rare-fern-index"],[8,42,"stone-specimen-record"]],"dependencies":[[27,7,"pack1:006","mountain-glazing-support-sample"]],"rooms":[["front-cliff-seed-exhibition",16,2,32,11],["west-long-stone-greenhouse",2,14,13,36],["east-high-wind-fernery",35,14,44,24],["middle-stone-glass-crosspass",16,24,32,27],["southeast-herb-ledges",29,30,41,39],["rear-grand-stone-glasshall",11,42,41,49],["west-narrow-return-office",6,39,8,44]],"portals":[["outside","front-cliff-seed-exhibition",24,1],["front-cliff-seed-exhibition","west-long-stone-greenhouse",14,14],["front-cliff-seed-exhibition","east-high-wind-fernery",34,14],["west-long-stone-greenhouse","middle-stone-glass-crosspass",14,25],["middle-stone-glass-crosspass","east-high-wind-fernery",33,25],["middle-stone-glass-crosspass","southeast-herb-ledges",29,28],["southeast-herb-ledges","rear-grand-stone-glasshall",29,40],["west-long-stone-greenhouse","west-narrow-return-office",7,37],["west-narrow-return-office","rear-grand-stone-glasshall",9,43]],"description":"Seven distinct roof ridges over physically staggered cliff terraces, deep open canyon, high short east fernery and immense rear glass botanical hall; plants static."},{"category":"fishing-lodge","biome":"temperate","size":"large","key":"tidegate","name":"Tidegate Twin-Quay Fisher Cooperative","dim":[46,25,50],"mask":[[1,1,17,11],[27,1,43,9],[18,10,27,25],[1,12,12,35],[33,10,43,29],[13,26,32,31],[22,32,29,35],[9,36,36,47]],"entries":[[9,1],[34,1],[9,11],[9,12],[27,9],[27,10],[17,11],[18,11],[12,27],[13,27],[32,27],[33,27],[23,25],[23,26],[25,31],[25,32],[25,35],[25,36],[10,35],[10,36],[28,9],[27,11],[26,11]],"windows":[[4,1,"north"],[39,1,"north"],[1,22,"west"],[43,20,"east"],[14,47,"south"],[31,47,"south"]],"roofs":[[[1,1,17,11],10,"tidegate-west-town-dock-hall","gable-x","pack3:023"],[[27,1,43,9],13,"tidegate-raised-east-trade-dock","reverse-x","live:wood"],[[18,10,27,25],11,"tidegate-offaxis-main-net-corridor","gable-z","pack4:030"],[[1,12,12,35],9,"tidegate-long-west-waterfront-archive","ramp-z","live:stone"],[[33,10,43,29],12,"tidegate-longer-east-sea-watch","reverse-z","live:wood"],[[13,26,32,31],10,"tidegate-cross-quay-bridge","gable-x","live:wood"],[[22,32,29,35],11,"tidegate-back-sluice-connector","ramp-z","live:stone"],[[9,36,36,47],10,"tidegate-rear-market-guildhall","hip","pack3:023"]],"posts":[[5,5],[12,5],[32,4],[40,4],[22,15],[7,19],[7,31],[38,17],[38,26],[20,28],[28,28],[26,33],[16,42],[29,43]],"furniture":[[10,5,"dried-boat-chart"],[35,4,"fishing-trade-registry"],[23,15,"inactive-net-traverse"],[7,22,"old-wharf-record"],[39,19,"unoperated-fish-scale"],[21,28,"dry-route-marker"],[27,33,"charter-index"],[22,42,"quay-guild-ledger"]],"dependencies":[[24,17,"pack1:002","temperate-dock-floor-sample"]],"rooms":[["west-quay-public-guild",2,2,16,10],["east-quay-raised-dock",28,2,42,8],["central-long-net-aisle",19,11,26,24],["west-deep-warehouse",2,13,11,34],["east-longer-watch-office",34,11,42,28],["central-trade-crossway",14,27,31,30],["southern-narrow-throat",23,33,28,34],["rear-wide-fisher-archive",10,37,35,46]],"portals":[["outside","west-quay-public-guild",9,1],["outside","east-quay-raised-dock",34,1],["west-quay-public-guild","central-long-net-aisle",17,11],["east-quay-raised-dock","central-long-net-aisle",27,9],["west-quay-public-guild","west-deep-warehouse",9,11],["central-long-net-aisle","central-trade-crossway",23,25],["west-deep-warehouse","central-trade-crossway",12,27],["east-longer-watch-office","central-trade-crossway",33,27],["central-trade-crossway","southern-narrow-throat",25,31],["southern-narrow-throat","rear-wide-fisher-archive",25,35]],"description":"True twin-street-quay with split offset front entrances, very deep west/east piers, central canyon, crossing and rear market, no fish simulation."},{"category":"harbor-office","biome":"enchanted-forest","size":"large","key":"rootcourt","name":"Rootcourt Split-Canal Forest Registry","dim":[49,27,53],"mask":[[10,1,37,11],[1,12,11,37],[35,12,47,25],[12,26,34,31],[35,26,43,41],[3,38,11,45],[12,42,43,50],[22,12,26,25]],"entries":[[23,1],[11,11],[11,12],[35,11],[35,12],[24,11],[24,12],[11,28],[12,28],[24,25],[24,26],[34,27],[35,27],[38,25],[38,26],[38,41],[38,42],[9,37],[9,38],[11,43],[12,43]],"windows":[[15,1,"north"],[33,1,"north"],[1,22,"west"],[47,18,"east"],[38,34,"east"],[24,50,"south"],[3,42,"west"]],"roofs":[[[10,1,37,11],12,"rootcourt-wide-front-heraldic-hall","gable-x","pack3:023"],[[1,12,11,37],9,"rootcourt-low-west-paper-canal","ramp-z","live:wood"],[[35,12,47,25],15,"rootcourt-high-east-civic-terrace","reverse-x","live:stone"],[[12,26,34,31],11,"rootcourt-lower-arced-crossing","gable-z","pack4:030"],[[35,26,43,41],12,"rootcourt-east-rear-ledger-tower","reverse-z","live:wood"],[[3,38,11,45],9,"rootcourt-short-west-mushroom-locker","ramp-z","live:stone"],[[12,42,43,50],10,"rootcourt-grand-forest-records","hip","live:wood"],[[22,12,26,25],14,"rootcourt-long-thin-upper-record-bridge","gable-z","live:wood"]],"posts":[[15,5],[30,5],[6,20],[6,32],[41,17],[41,23],[17,29],[29,29],[39,32],[39,38],[6,42],[20,46],[35,46],[24,19]],"furniture":[[18,5,"root-court-civic-map"],[31,5,"old-canal-permit"],[6,22,"unpaid-waterway-tariff"],[42,18,"inactive-forest-weather-flag"],[25,19,"river-bridge-ledger"],[22,29,"empty-customs-till"],[39,34,"forest-vessel-docket"],[21,46,"land-charter-archive"],[6,41,"dry-mushroom-ledger"]],"dependencies":[[28,6,"pack2:013","forest-rootstone-trim"]],"rooms":[["front-grand-rootway-counter",11,2,36,10],["west-deep-canal-records",2,13,10,36],["east-short-raised-state-hall",36,13,46,24],["thin-upper-root-map-bridge",23,13,25,24],["center-arched-register-crossing",13,27,33,30],["east-back-customs-records",36,27,42,40],["west-return-charter-safe",4,39,10,44],["rear-grand-forest-library",13,43,42,49]],"portals":[["outside","front-grand-rootway-counter",23,1],["front-grand-rootway-counter","west-deep-canal-records",11,11],["front-grand-rootway-counter","east-short-raised-state-hall",35,11],["front-grand-rootway-counter","thin-upper-root-map-bridge",24,11],["thin-upper-root-map-bridge","center-arched-register-crossing",24,25],["west-deep-canal-records","center-arched-register-crossing",11,28],["center-arched-register-crossing","east-back-customs-records",34,27],["east-short-raised-state-hall","east-back-customs-records",38,25],["east-back-customs-records","rear-grand-forest-library",38,41],["west-deep-canal-records","west-return-charter-safe",9,37],["west-return-charter-safe","rear-grand-forest-library",11,43]],"description":"Two sky-open inner forest canals split by a narrow raised north-south archive bridge, monumental stepped east roof and low long west gallery, entirely nonfunctional customs."},{"category":"lighthouse","biome":"snow","size":"large","key":"frostneedle","name":"Frostneedle Split-Terrace Lighthouse","dim":[46,46,51],"wallTop":8,"mask":[[1,1,18,24],[1,25,10,42],[19,13,43,25],[11,26,28,31],[29,26,43,42],[11,43,34,48],[11,32,20,42]],"entries":[[10,1],[18,18],[19,18],[8,24],[8,25],[10,28],[11,28],[36,25],[36,26],[28,30],[29,30],[16,31],[16,32],[16,42],[16,43],[32,42],[32,43]],"windows":[[5,1,"north"],[1,15,"west"],[37,13,"north"],[43,20,"east"],[5,35,"west"],[32,48,"south"]],"roofs":[[[1,25,10,42],10,"frostneedle-west-long-supply-ramp","ramp-z","live:wood"],[[19,13,43,25],14,"frostneedle-higher-east-keeper-gallery","gable-x","pack3:025"],[[11,26,28,31],11,"frostneedle-central-snowwalk","gable-z","pack4:030"],[[29,26,43,42],12,"frostneedle-east-rear-cold-records","reverse-z","live:stone"],[[11,43,34,48],10,"frostneedle-wide-back-weather-station","hip","live:wood"],[[11,32,20,42],9,"frostneedle-southwest-narrow-shelter","reverse-x","live:stone"]],"posts":[[5,30],[5,38],[27,17],[38,18],[35,22],[19,28],[36,31],[37,39],[15,35],[16,39],[17,46],[28,46]],"furniture":[[10,6,"unlit-snow-signal-log"],[30,17,"ice-watch-route-map"],[5,32,"dry-frost-keeper-notes"],[36,33,"inactive-boreal-trade"],[17,28,"frozen-ship-index"],[17,39,"snow-supply-ledger"],[25,46,"old-navigation-archive"]],"dependencies":[[31,19,"pack1:005","frost-timber-stone-mount"]],"rooms":[["north-beacon-rooted-hall",2,2,17,23],["east-raised-keeper-lodge",20,14,42,24],["west-long-cold-supplies",2,26,9,41],["central-short-snowwalk",12,27,27,30],["east-deep-weather-records",30,27,42,41],["rear-broad-chart-office",12,44,33,47],["southwest-winter-porch",12,33,19,41]],"portals":[["outside","north-beacon-rooted-hall",10,1],["north-beacon-rooted-hall","east-raised-keeper-lodge",18,18],["north-beacon-rooted-hall","west-long-cold-supplies",8,24],["west-long-cold-supplies","central-short-snowwalk",10,28],["east-raised-keeper-lodge","east-deep-weather-records",36,25],["central-short-snowwalk","east-deep-weather-records",28,30],["central-short-snowwalk","southwest-winter-porch",16,31],["southwest-winter-porch","rear-broad-chart-office",16,42],["east-deep-weather-records","rear-broad-chart-office",32,42]],"beacon":{"stages":[["cap",1,1,18,24,9,9,"live:stone","frostneedle-broad-low-snow-cap"],["ring",3,3,16,22,10,24,"live:stone","frostneedle-heavy-lower-square-shaft"],["cap",3,3,16,22,25,25,"live:stone","frostneedle-mid-weather-platform"],["ring",7,7,13,18,26,33,"live:wood","frostneedle-inset-upper-observation"],["cap",7,7,13,18,34,34,"live:crystal","frostneedle-high-ice-prism-roof"]],"finials":[[10,12,35,40,"live:crystal","frostneedle-disabled-ice-finial"]]},"description":"Tall single snow prism with thick grounded two-stage high tower and six highly offset keeper/record roofs; no signal operation or upper-level access."}];
export function getM2ORegional1BPlans(){return SURVEYS.map(original);}
