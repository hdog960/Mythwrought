// Builder 1B M2L: nine creator-unapproved second-variant fixed XYZ sources.
// Own index=002 constructor copied from Builder 1B's reviewed source-polygon
// contract; this does not mutate first-variant helpers or other producer code.
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
  sourceAuthor:'Builder 1B M2L second-variant XYZ blueprint',
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



const SURVEYS=[{"category":"bathhouse","biome":"temperate","size":"small","key":"wrenstep","name":"Wrenstep Reed-Braid Bath Gallery","dim":[28,19,32],"mask":[[8,1,19,8],[1,8,8,25],[18,9,26,20],[9,17,17,20],[9,21,23,29]],"entries":[[13,1],[8,11],[18,11],[8,20],[18,18],[13,21],[8,8],[8,9],[18,9],[18,10],[8,18],[17,19],[18,19]],"windows":[[11,1,"north"],[1,16,"west"],[26,16,"east"],[12,29,"south"],[21,29,"south"]],"roofs":[[[8,1,19,8],10,"wrenstep-short-front-roof","gable-x","pack3:023"],[[1,9,8,25],9,"wrenstep-west-reed-long-roof","ramp-z","live:wood"],[[18,9,26,20],10,"wrenstep-offset-east-steam-vault","reverse-z","live:wood"],[[9,17,17,20],11,"wrenstep-narrow-braid-bridge","gable-z","pack4:030"],[[9,21,23,29],9,"wrenstep-broad-rear-cloakroom","hip","live:wood"]],"posts":[[12,4],[5,14],[5,22],[22,13],[23,18],[13,18],[13,25],[20,25]],"furniture":[[14,5,"dry-spa-route-card"],[5,17,"inactive-reed-well"],[23,15,"quiet-bath-changer"],[14,25,"bench-of-moss"],[12,18,"tub-sign"],[11,26,"historical-heat-plan"]],"dependencies":[[16,5,"pack1:002","temperate-timber-lintel-sample"]],"rooms":[["front-cottage-spa-hall",9,2,18,8],["west-long-waterless-bath",2,9,7,24],["east-abbreviated-steam-suite",19,10,25,19],["middle-braided-connector",10,18,16,19],["rear-dry-cloak-gallery",10,22,22,28]],"portals":[["outside","front-cottage-spa-hall",13,1],["front-cottage-spa-hall","west-long-waterless-bath",8,11],["front-cottage-spa-hall","east-abbreviated-steam-suite",18,11],["west-long-waterless-bath","middle-braided-connector",8,20],["middle-braided-connector","east-abbreviated-steam-suite",18,18],["middle-braided-connector","rear-dry-cloak-gallery",13,21]],"description":"second independently authored temperate cottage bath with narrow north stem, long west and short east ranges, diagonal center crossing and two genuine sky courtyards"},{"category":"bathhouse","biome":"snow","size":"large","key":"whitefall","name":"Whitefall Horseshoe Thermal Archive","dim":[42,23,47],"mask":[[1,1,37,10],[1,11,9,37],[28,11,39,26],[10,20,27,25],[9,30,30,44]],"entries":[[18,1],[5,10],[33,10],[9,22],[28,22],[15,30]],"windows":[[5,1,"north"],[34,1,"north"],[1,21,"west"],[39,19,"east"],[14,44,"south"],[28,44,"south"]],"roofs":[[[1,1,37,10],11,"whitefall-front-frost-cap","gable-x","pack3:025"],[[1,11,9,37],10,"whitefall-deep-west-ice-trough","ramp-z","live:stone"],[[28,11,39,26],12,"whitefall-rising-east-thermal-records","gable-z","live:wood"],[[10,20,27,25],11,"whitefall-cross-sky-walk","reverse-x","pack4:030"],[[10,30,30,44],10,"whitefall-long-rear-bath-archive","hip","live:stone"]],"posts":[[8,5],[31,5],[5,19],[5,33],[33,17],[33,23],[18,23],[15,35],[25,39]],"furniture":[[7,5,"temperature-log-sheet"],[30,5,"snow-grit-stand"],[5,23,"ice-outflow-dry-ditch"],[32,19,"tide-pressure-display"],[17,22,"fixed-crossing-table"],[18,37,"undrawn-rest-rooms"]],"dependencies":[[24,6,"pack1:005","winter-truss-source-sample"]],"rooms":[["wide-front-ice-registration",2,2,36,10],["west-long-cold-stone-gallery",2,11,8,36],["east-short-snow-relief-wing",29,11,38,25],["cross-arch-snow-bridge",11,21,26,24],["rear-ritual-archive",10,31,29,43]],"portals":[["outside","wide-front-ice-registration",18,1],["wide-front-ice-registration","west-long-cold-stone-gallery",5,10],["wide-front-ice-registration","east-short-snow-relief-wing",33,10],["west-long-cold-stone-gallery","cross-arch-snow-bridge",9,22],["cross-arch-snow-bridge","east-short-snow-relief-wing",28,22],["west-long-cold-stone-gallery","rear-ritual-archive",15,30]],"description":"snow thermal archive with massive front cover, unequal shielded side wings, offset connector and missing-source courtyard cells"},{"category":"farm-barn","biome":"desert","size":"medium","key":"sunbreak","name":"Sunbreak Serrated Granary","dim":[34,22,39],"mask":[[1,1,32,9],[2,10,9,21],[21,10,32,23],[10,16,20,23],[2,24,21,36]],"entries":[[16,1],[6,9],[27,9],[9,18],[21,19],[14,24]],"windows":[[5,1,"north"],[29,1,"north"],[2,16,"west"],[32,17,"east"],[6,36,"south"],[18,36,"south"]],"roofs":[[[1,1,32,9],10,"sunbreak-front-wide-sun-visor","gable-x","pack3:024"],[[2,10,9,21],9,"sunbreak-left-short-trench-lean","ramp-z","live:stone"],[[21,10,32,23],11,"sunbreak-right-deep-crop-records","reverse-x","live:stone"],[[10,16,20,23],10,"sunbreak-central-sand-braid","gable-z","pack4:030"],[[2,24,21,36],9,"sunbreak-back-tall-grain-lock","hip","live:wood"]],"posts":[[5,5],[27,5],[5,16],[25,15],[27,21],[14,19],[8,28],[16,32]],"furniture":[[7,5,"empty-crop-ledger"],[28,5,"inert-dune-scale"],[5,15,"dusty-storage-index"],[26,18,"no-crop-manifest"],[15,19,"shipping-arch-sign"],[9,29,"dry-barley-register"]],"dependencies":[[12,6,"pack5:080","desert-hardened-wood-composite-sample"]],"rooms":[["north-long-dune-warehouse",2,2,31,9],["west-short-wind-barn",3,10,8,20],["east-granary-office",22,10,31,22],["middle-open-vent-connector",11,17,19,22],["rear-stone-pit-repository",3,25,20,35]],"portals":[["outside","north-long-dune-warehouse",16,1],["north-long-dune-warehouse","west-short-wind-barn",6,9],["north-long-dune-warehouse","east-granary-office",27,9],["west-short-wind-barn","middle-open-vent-connector",9,18],["middle-open-vent-connector","east-granary-office",21,19],["middle-open-vent-connector","rear-stone-pit-repository",14,24]],"description":"literal 5-zone serrated front/side/Z-rear desert granary with uneven pitched support roofs and no harvesting"},{"category":"farm-barn","biome":"enchanted-forest","size":"large","key":"glimmerroot","name":"Glimmerroot Staggered Canopy Barn","dim":[45,24,49],"mask":[[10,1,32,12],[1,10,9,34],[33,10,42,25],[10,23,32,29],[10,30,32,46]],"entries":[[20,1],[9,11],[33,11],[9,26],[33,24],[18,30]],"windows":[[12,1,"north"],[30,1,"north"],[1,22,"west"],[42,18,"east"],[14,46,"south"],[29,46,"south"]],"roofs":[[[10,1,32,12],11,"glimmerroot-thick-front-trunk","gable-x","pack3:023"],[[1,13,9,34],9,"glimmerroot-twisted-west-loom","ramp-z","live:wood"],[[33,13,42,25],12,"glimmerroot-east-sky-orchard","reverse-x","pack4:030"],[[10,23,32,29],10,"glimmerroot-center-sky-crosswalk","gable-z","live:stone"],[[10,30,32,46],10,"glimmerroot-grand-rear-storage","hip","live:wood"]],"posts":[[15,5],[27,5],[5,19],[5,30],[38,19],[39,23],[18,26],[17,35],[27,41]],"furniture":[[16,5,"disused-root-crate"],[26,5,"forest-trade-book"],[5,20,"empty-mushroom-loft"],[39,19,"dry-seed-counter"],[20,26,"woodland-trade-record"],[21,38,"hay-shelter-rack"]],"dependencies":[[17,6,"pack2:013","enchanted-rootstone-brace-sample"]],"rooms":[["front-hollow-tree-loading",11,2,31,11],["west-long-root-rack",2,12,8,33],["east-high-coppice-loft",34,12,41,24],["central-wind-crossbar",11,24,31,28],["rear-forest-store",11,31,31,45]],"portals":[["outside","front-hollow-tree-loading",20,1],["front-hollow-tree-loading","west-long-root-rack",9,11],["front-hollow-tree-loading","east-high-coppice-loft",33,11],["west-long-root-rack","central-wind-crossbar",9,26],["central-wind-crossbar","east-high-coppice-loft",33,24],["central-wind-crossbar","rear-forest-store",18,30]],"description":"original five-lobed canopy timber warehouse with staggered eastern loft and two sky-open side courts, no growth or livestock"},{"category":"greenhouse","biome":"mountain","size":"small","key":"cragsprig","name":"Cragsprig Sheltered Fern Switchback","dim":[27,18,31],"mask":[[1,1,24,7],[1,8,8,25],[18,8,24,18],[9,18,17,24],[9,25,22,28]],"entries":[[12,1],[5,7],[21,7],[8,19],[18,18],[14,25],[5,8],[21,8],[8,18],[8,20],[17,18],[13,24],[16,18],[15,18]],"windows":[[5,1,"north"],[22,1,"north"],[1,13,"west"],[24,14,"east"],[12,28,"south"]],"roofs":[[[1,1,24,7],10,"cragsprig-stone-front-visor","gable-x","live:stone"],[[1,8,8,25],9,"cragsprig-west-long-fern-tunnel","ramp-z","pack3:025"],[[18,8,24,18],11,"cragsprig-east-short-terrace","reverse-x","live:wood"],[[9,18,17,24],10,"cragsprig-mid-window-bridge","gable-z","pack4:030"],[[9,25,22,28],9,"cragsprig-rear-fragile-bench","hip","live:wood"]],"posts":[[5,4],[21,4],[5,15],[5,23],[21,13],[13,21],[13,27]],"furniture":[[7,4,"stone-greenhouse-label"],[22,4,"seed-sample-cabinet"],[5,17,"dry-fern-display"],[21,14,"unused-cliff-soil-chart"],[14,21,"coldhouse-bridge-ledger"],[17,27,"moss-archive"]],"dependencies":[[10,5,"pack1:006","cliff-masonry-sample"]],"rooms":[["front-stone-fernery",2,2,23,7],["west-long-green-tunnel",2,8,7,24],["east-small-root-ledge",19,8,23,17],["mid-glass-narrow-crossing",10,19,16,23],["rear-cold-seed-bay",10,26,21,27]],"portals":[["outside","front-stone-fernery",12,1],["front-stone-fernery","west-long-green-tunnel",5,7],["front-stone-fernery","east-small-root-ledge",21,7],["west-long-green-tunnel","mid-glass-narrow-crossing",8,19],["mid-glass-narrow-crossing","east-small-root-ledge",18,18],["mid-glass-narrow-crossing","rear-cold-seed-bay",14,25]],"description":"small terrace H footprint with deep missing center cliff court, narrow glass bridge and unsupported future growing functions"},{"category":"greenhouse","biome":"snow","size":"large","key":"frostveil","name":"Frostveil Twin-Courtyard Seed Library","dim":[43,23,49],"mask":[[8,1,33,13],[1,11,8,36],[34,12,41,27],[8,22,33,27],[8,28,34,46]],"entries":[[20,1],[8,12],[34,13],[8,25],[34,25],[21,28]],"windows":[[12,1,"north"],[30,1,"north"],[1,22,"west"],[41,20,"east"],[13,46,"south"],[30,46,"south"]],"roofs":[[[8,1,33,13],11,"frostveil-upper-ice-spine","gable-x","pack3:025"],[[1,14,7,36],10,"frostveil-west-cold-root-tunnel","ramp-z","live:wood"],[[34,12,41,27],12,"frostveil-east-stone-seed-vault","reverse-x","live:stone"],[[8,22,33,27],11,"frostveil-long-glass-crossing","gable-z","pack4:030"],[[9,28,34,46],10,"frostveil-grand-rear-snow-archive","hip","live:wood"]],"posts":[[13,6],[28,6],[4,18],[4,32],[38,18],[38,24],[15,25],[26,25],[17,37],[28,42]],"furniture":[[15,6,"archival-snow-seed-ledger"],[27,6,"nonliving-growing-bed"],[4,21,"unused-glacial-sample"],[38,20,"winter-keeper-notebook"],[18,25,"clear-ice-crossbar-plaque"],[21,37,"cold-plant-seed-index"]],"dependencies":[[22,8,"pack1:005","cold-weather-wood-post-sample"]],"rooms":[["front-frost-public-collection",9,2,32,12],["west-long-ice-root-vault",2,12,7,35],["east-short-specimen-study",35,13,40,26],["mid-glazed-heated-bridge",9,23,32,26],["rear-grand-dormant-fernery",9,29,33,45]],"portals":[["outside","front-frost-public-collection",20,1],["front-frost-public-collection","west-long-ice-root-vault",8,12],["front-frost-public-collection","east-short-specimen-study",34,13],["west-long-ice-root-vault","mid-glazed-heated-bridge",8,25],["mid-glazed-heated-bridge","east-short-specimen-study",34,25],["mid-glazed-heated-bridge","rear-grand-dormant-fernery",21,28]],"description":"large multi-front snow botanical archive separated by true outer ice courts and extensive source-built glazed crossing"},{"category":"fishing-lodge","biome":"desert","size":"large","key":"saltwind","name":"Saltwind Off-Axis Dry Quay Guild","dim":[41,23,46],"mask":[[1,1,38,10],[1,11,11,30],[29,11,38,35],[12,25,28,32],[8,33,32,44]],"entries":[[19,1],[6,10],[34,10],[11,26],[29,27],[19,33]],"windows":[[6,1,"north"],[34,1,"north"],[1,18,"west"],[38,21,"east"],[12,44,"south"],[28,44,"south"]],"roofs":[[[1,1,38,10],11,"saltwind-sun-export-crosshall","gable-x","pack3:024"],[[1,11,11,30],10,"saltwind-west-sand-net-run","ramp-z","live:stone"],[[29,11,38,32],12,"saltwind-east-bright-dry-office","reverse-x","live:wood"],[[12,25,28,32],11,"saltwind-center-salt-shade-bridge","gable-z","pack4:030"],[[8,33,32,44],10,"saltwind-back-export-warehouse","hip","live:stone"]],"posts":[[7,5],[33,5],[6,19],[6,27],[34,18],[34,28],[18,29],[13,39],[26,40]],"furniture":[[8,5,"empty-salt-creel"],[32,5,"inactive-dock-counter"],[7,19,"dry-net-mending-frame"],[34,20,"desert-route-beacon-form"],[17,29,"wind-compass-model"],[18,39,"dry-quay-record"]],"dependencies":[[22,6,"pack5:080","sandstone-harbor-support-swatch"]],"rooms":[["front-wide-landing-office",2,2,37,10],["west-net-repair-wing",2,11,10,29],["east-export-charter",30,11,37,34],["middle-shade-crosspass",13,26,27,31],["rear-dry-export-house",9,34,31,43]],"portals":[["outside","front-wide-landing-office",19,1],["front-wide-landing-office","west-net-repair-wing",6,10],["front-wide-landing-office","east-export-charter",34,10],["west-net-repair-wing","middle-shade-crosspass",11,26],["middle-shade-crosspass","east-export-charter",29,27],["middle-shade-crosspass","rear-dry-export-house",19,33]],"description":"sun-dried original waterfront with huge front crossbar and strongly unlike long/short wings enclosing two voids"},{"category":"harbor-office","biome":"temperate","size":"small","key":"reedmark","name":"Reedmark Folded Canal Ledger","dim":[26,19,31],"mask":[[1,1,24,9],[1,10,8,20],[16,10,24,21],[7,20,15,26],[2,24,16,28]],"entries":[[12,1],[5,9],[20,9],[8,20],[16,20],[12,24]],"windows":[[5,1,"north"],[22,1,"north"],[1,17,"west"],[24,17,"east"],[5,28,"south"],[14,28,"south"]],"roofs":[[[1,1,24,9],10,"reedmark-first-canal-visor","gable-x","live:wood"],[[1,10,8,20],9,"reedmark-west-short-bookshelf","ramp-z","pack3:023"],[[16,10,24,21],11,"reedmark-east-slate-levy-vault","reverse-x","live:stone"],[[7,21,15,23],10,"reedmark-central-braided-record","gable-z","pack4:030"],[[2,24,16,28],9,"reedmark-back-long-document-lock","hip","live:wood"]],"posts":[[6,5],[21,5],[4,16],[20,16],[11,22],[6,26],[14,26]],"furniture":[[7,5,"shipping-office-registry"],[22,5,"inert-canal-license"],[5,16,"retired-port-desk"],[21,16,"waterway-chart"],[12,22,"bridge-record-card"],[10,26,"charter-ledger"]],"dependencies":[[13,6,"pack1:002","reedwood-mounting-swatch"]],"rooms":[["front-public-canal-hall",2,2,23,9],["west-small-ticket-bay",2,10,7,19],["east-stone-tax-vault",17,10,23,20],["middle-card-crossway",8,21,14,23],["rear-deep-charter-archive",3,25,15,27]],"portals":[["outside","front-public-canal-hall",12,1],["front-public-canal-hall","west-small-ticket-bay",5,9],["front-public-canal-hall","east-stone-tax-vault",20,9],["west-small-ticket-bay","middle-card-crossway",8,20],["middle-card-crossway","east-stone-tax-vault",16,20],["middle-card-crossway","rear-deep-charter-archive",12,24]],"description":"second temperate canal office: compact S-turn crossing and real central open-air river notch, unequal multi-profile roofs"},{"category":"lighthouse","biome":"mountain","size":"large","key":"peakbind","name":"Peakbind Stone-Shoulder Observatory Beacon","dim":[43,42,48],"wallTop":8,"mask":[[1,1,17,22],[18,10,39,21],[27,22,39,38],[1,23,11,35],[12,30,27,44]],"entries":[[9,1],[17,14],[7,22],[30,21],[11,32],[27,33]],"windows":[[6,1,"north"],[1,13,"west"],[29,10,"north"],[39,17,"east"],[33,38,"south"],[17,44,"south"]],"roofs":[[[18,10,39,21],11,"peakbind-north-east-stone-keeper","gable-x","pack3:025"],[[27,22,39,38],11,"peakbind-late-mountain-archive","reverse-z","live:stone"],[[1,23,11,35],10,"peakbind-west-cliff-chisel-porch","ramp-z","live:wood"],[[12,30,26,44],10,"peakbind-south-survey-records","hip","live:stone"]],"posts":[[23,14],[34,16],[32,27],[34,34],[5,28],[18,35],[23,41]],"furniture":[[9,7,"silent-mountain-signal"],[22,15,"keeper-ledger-arch"],[35,16,"unlit-stone-compass"],[34,29,"cliff-route-book"],[5,29,"cairn-statute-shelf"],[19,37,"ridge-survey-table"]],"dependencies":[[27,16,"pack1:006","mountain-quarry-trim-sample"]],"rooms":[["grand-rock-beacon-base",2,2,16,21],["east-keeper-cross-vault",19,11,38,20],["deep-right-gorge-archive",28,23,38,37],["west-cliff-supply-porch",2,24,10,34],["south-mountain-records",13,31,26,43]],"portals":[["outside","grand-rock-beacon-base",9,1],["grand-rock-beacon-base","east-keeper-cross-vault",17,14],["grand-rock-beacon-base","west-cliff-supply-porch",7,22],["east-keeper-cross-vault","deep-right-gorge-archive",30,21],["west-cliff-supply-porch","south-mountain-records",11,32],["south-mountain-records","deep-right-gorge-archive",27,33]],"beacon":{"stages":[["cap",1,1,17,22,9,9,"live:stone","peakbind-broad-earthquake-shoulder"],["ring",3,3,15,19,10,22,"live:stone","peakbind-thick-square-buttress-shaft"],["cap",3,3,15,19,23,23,"live:stone","peakbind-mid-belt-observatory"],["ring",6,6,12,15,24,30,"live:wood","peakbind-narrow-open-wind-observatory"],["cap",6,6,12,15,31,31,"live:crystal","peakbind-tall-single-crown"]],"finials":[[9,10,32,37,"live:crystal","peakbind-unlit-prism-crest"]]},"description":"independently second-variant grand mountain single-crown beacon, two-tier stone plinth, deep off-axis keeper halls, real sky-cut cliff yards and no upper access"}];
export function getM2LRegional1BPlans(){return SURVEYS.map(original);}
