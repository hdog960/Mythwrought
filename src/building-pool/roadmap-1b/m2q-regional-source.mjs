// Mythwrought Builder 1B M2Q: four independent source-authored regional designs.
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
  sourceAuthor:'Builder 1B M2Q second-variant XYZ blueprint',
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








const SURVEYS=[{"category":"bathhouse","biome":"desert","size":"small","key":"sunharp","name":"Sunharp Fan-Court Baths","dim":[32,25,35],"mask":[[9,1,21,9],[1,8,8,21],[22,9,29,19],[9,17,21,21],[12,22,27,32]],"entries":[[15,1],[7,8],[7,9],[21,9],[22,9],[8,18],[9,18],[21,18],[22,18],[16,21],[16,22],[8,8],[9,8],[21,8],[22,10]],"windows":[[11,1,"north"],[20,1,"north"],[1,14,"west"],[29,16,"east"],[14,32,"south"],[25,32,"south"]],"roofs":[[[9,1,21,9],11,"sunharp-north-ceramic-cupola","gable-x","pack3:024"],[[1,8,8,21],9,"sunharp-west-low-brise-soleil","ramp-z","live:stone"],[[22,9,29,19],16,"sunharp-east-raised-dry-therapy","reverse-x","live:wood"],[[9,17,21,21],12,"sunharp-narrow-glass-fan-bridge","gable-z","pack4:030"],[[12,22,27,32],10,"sunharp-broad-back-cloak-library","hip","live:stone"]],"posts":[[12,5],[18,6],[5,15],[5,19],[26,14],[26,17],[16,19],[17,26],[23,29]],"furniture":[[17,5,"dry-bath-admission"],[5,12,"unpowered-desert-heat-well"],[26,15,"quartz-cloak-seal"],[17,19,"sunset-bath-route"],[20,29,"reed-towel-ledger"]],"dependencies":[[12,7,"pack5:080","sunstone-column-material-reference"]],"rooms":[["front-sun-registration",10,2,20,8],["west-shadow-therapy",2,9,7,20],["east-tall-meditation-hall",23,10,28,18],["central-fan-court-bridge",10,18,20,20],["south-wardrobe-hall",13,23,26,31]],"portals":[["outside","front-sun-registration",15,1],["front-sun-registration","west-shadow-therapy",7,8],["front-sun-registration","east-tall-meditation-hall",21,9],["west-shadow-therapy","central-fan-court-bridge",8,18],["central-fan-court-bridge","east-tall-meditation-hall",21,18],["central-fan-court-bridge","south-wardrobe-hall",16,21]],"description":"Compact fan-shaped desert bath with an elevated right-hand ceramic therapy hall, very low deep left brise-soleil, narrow central court bridge and wide rear cloakroom; no water or heating gameplay."},{"category":"farm-barn","biome":"snow","size":"small","key":"snowcoil","name":"Snowcoil Staggered Haymill","dim":[33,24,37],"mask":[[3,1,27,8],[3,9,10,28],[22,9,29,17],[11,17,21,22],[9,23,28,34]],"entries":[[15,1],[7,8],[7,9],[24,8],[24,9],[10,19],[11,19],[21,17],[22,17],[15,22],[15,23],[21,18],[23,17]],"windows":[[6,1,"north"],[25,1,"north"],[3,15,"west"],[29,14,"east"],[12,34,"south"],[25,34,"south"]],"roofs":[[[3,1,27,8],11,"snowcoil-oversailing-loading-gable","gable-x","pack3:025"],[[3,9,10,28],9,"snowcoil-west-long-low-hay-shed","ramp-z","live:wood"],[[22,9,29,17],17,"snowcoil-short-high-feed-silo","reverse-x","live:stone"],[[11,17,21,22],12,"snowcoil-middle-suspended-dry-crossing","gable-z","pack4:030"],[[11,23,28,34],10,"snowcoil-grand-rear-winter-loft","hip","live:wood"],[[9,29,10,34],10,"snowcoil-west-rear-bent-snow-visor","ramp-z","live:stone"]],"posts":[[8,5],[22,5],[6,14],[6,23],[25,13],[26,15],[16,20],[16,28],[23,30],[9,31]],"furniture":[[12,5,"hay-weighing-chit"],[25,5,"unpowered-crop-mill"],[6,18,"snow-crop-pallet"],[26,13,"granary-height-marker"],[17,20,"cargo-lift-ledger"],[20,30,"frozen-hay-archive"]],"dependencies":[[15,5,"pack1:005","snow-load-truss-material-reference"]],"rooms":[["north-hay-forecourt",4,2,26,7],["west-long-winter-stable-store",4,10,9,27],["east-very-high-silo-room",23,10,28,16],["center-closed-wind-link",12,18,20,21],["rear-feed-and-hay-archive",10,24,27,33]],"portals":[["outside","north-hay-forecourt",15,1],["north-hay-forecourt","west-long-winter-stable-store",7,8],["north-hay-forecourt","east-very-high-silo-room",24,8],["west-long-winter-stable-store","center-closed-wind-link",10,19],["center-closed-wind-link","east-very-high-silo-room",21,17],["center-closed-wind-link","rear-feed-and-hay-archive",15,22]],"description":"Asymmetric snow T-hayworks with a towering east feed silo, stretched low west crop awning, roofed high central windbreak and broad south hay archive. No machinery, crops or animals."},{"category":"greenhouse","biome":"temperate","size":"medium","key":"glasswick","name":"Glasswick Six-Wing Seedhouse","dim":[41,26,45],"mask":[[11,1,28,8],[2,8,11,29],[29,8,37,19],[12,19,28,25],[4,26,20,41],[21,26,36,38]],"entries":[[20,1],[11,8],[28,8],[29,8],[11,22],[12,22],[28,19],[29,19],[17,25],[17,26],[25,25],[25,26],[20,34],[21,34],[12,8],[11,9],[27,8],[29,9],[27,19],[29,18]],"windows":[[16,1,"north"],[26,1,"north"],[2,19,"west"],[37,15,"east"],[8,41,"south"],[33,38,"south"]],"roofs":[[[11,1,28,8],11,"glasswick-front-low-lenticular-arch","gable-x","pack3:023"],[[2,9,11,25],9,"glasswick-west-deep-moss-glass","ramp-z","live:wood"],[[29,8,37,19],17,"glasswick-tall-east-seed-vault","reverse-x","pack4:030"],[[12,19,28,25],12,"glasswick-middle-sky-courtyard-bridge","gable-z","live:wood"],[[4,26,20,41],10,"glasswick-back-left-low-fern-pier","hip","live:stone"],[[21,26,36,38],14,"glasswick-back-right-raised-orchid-room","reverse-z","live:wood"]],"posts":[[15,4],[24,4],[6,16],[7,25],[33,14],[34,17],[19,22],[9,35],[16,38],[29,32],[33,36]],"furniture":[[19,4,"seedhouse-public-ledger"],[6,18,"static-fern-sample"],[34,14,"cut-glass-sign"],[20,22,"nonliving-pollination-table"],[11,35,"dry-greenhouse-register"],[29,33,"seed-spore-cabinet"]],"dependencies":[[18,6,"pack1:002","temperate-glazing-sample"]],"rooms":[["north-seed-display",12,2,27,7],["west-deep-botanical-walk",3,10,10,28],["east-high-orchid-lab",30,9,36,18],["central-courtyard-glasspass",13,20,27,24],["back-left-plant-records",5,27,19,40],["back-right-high-root-library",22,27,35,37]],"portals":[["outside","north-seed-display",20,1],["north-seed-display","west-deep-botanical-walk",11,8],["north-seed-display","east-high-orchid-lab",28,8],["west-deep-botanical-walk","central-courtyard-glasspass",11,22],["central-courtyard-glasspass","east-high-orchid-lab",28,19],["central-courtyard-glasspass","back-left-plant-records",17,25],["central-courtyard-glasspass","back-right-high-root-library",25,25],["back-left-plant-records","back-right-high-root-library",20,34]],"description":"Two genuinely sky-open temperate glass courtyards crossed by a long glazed bridge, distinct six-wing roof massing with one elevated east orchid vault and a south double-return walk. Plants static."},{"category":"lighthouse","biome":"enchanted-forest","size":"small","key":"mossneedle","name":"Mossneedle Spiral-Root Beacon","dim":[39,44,44],"wallTop":8,"mask":[[2,1,16,20],[17,11,35,22],[2,21,9,37],[27,23,35,39],[10,31,26,36],[10,37,33,41]],"entries":[[9,1],[16,15],[17,15],[6,20],[6,21],[31,22],[31,23],[9,33],[10,33],[26,33],[27,33],[19,36],[19,37]],"windows":[[5,1,"north"],[2,13,"west"],[30,11,"north"],[35,18,"east"],[2,28,"west"],[33,39,"east"],[20,41,"south"]],"roofs":[[[17,11,35,22],13,"mossneedle-high-east-keeper-lantern-hall","gable-x","pack3:023"],[[2,21,9,37],9,"mossneedle-west-low-root-pier","ramp-z","live:wood"],[[27,23,35,36],12,"mossneedle-east-long-root-signal-archive","reverse-z","live:stone"],[[10,31,26,36],11,"mossneedle-south-center-arched-gateway","gable-z","pack4:030"],[[10,37,33,41],10,"mossneedle-back-wide-moss-ledger","hip","live:wood"],[[34,37,35,39],10,"mossneedle-east-tail-return-canopy","ramp-z","live:wood"]],"posts":[[22,15],[30,16],[5,27],[5,34],[31,29],[31,36],[17,33],[22,39],[29,39],[34,38]],"furniture":[[9,6,"inactive-lantern-record"],[24,16,"forest-keeper-archive"],[5,29,"root-bark-chart"],[31,30,"no-light-weather-swatch"],[18,33,"nonfunctional-signaller-map"],[19,39,"moss-store-inventory"]],"dependencies":[[24,17,"pack2:013","enchanted-root-truss-sample"]],"rooms":[["main-tall-root-beacon-foundation",3,2,15,19],["east-high-keeper-gallery",18,12,34,21],["west-long-low-root-supply",3,22,8,36],["east-long-signal-ledger",28,24,34,38],["central-south-courtyard-crossway",11,32,25,35],["rear-signal-archive",11,38,32,40]],"portals":[["outside","main-tall-root-beacon-foundation",9,1],["main-tall-root-beacon-foundation","east-high-keeper-gallery",16,15],["main-tall-root-beacon-foundation","west-long-low-root-supply",6,20],["east-high-keeper-gallery","east-long-signal-ledger",31,22],["west-long-low-root-supply","central-south-courtyard-crossway",9,33],["central-south-courtyard-crossway","east-long-signal-ledger",26,33],["central-south-courtyard-crossway","rear-signal-archive",19,36]],"beacon":{"stages":[["cap",2,1,16,20,9,9,"live:stone","mossneedle-wide-root-platform"],["ring",4,3,14,17,10,23,"live:wood","mossneedle-timber-prism-lower-shaft"],["cap",4,3,14,17,24,24,"live:stone","mossneedle-middle-moon-ring"],["ring",7,6,11,14,25,33,"live:wood","mossneedle-upper-tall-thin-gallery"],["cap",7,6,11,14,34,34,"live:crystal","mossneedle-frost-glass-crown"]],"finials":[[9,10,35,40,"live:crystal","mossneedle-unlit-single-crown"]]},"description":"Tiny high-aspect forest beacon with a tall supported two-stage crystalline crown, giant low west root pier, raised right keeper arch and a long east river archive connected by an airy south moss court. Beacon and upper access remain inactive."}];
export function getM2QRegional1BPlans(){return SURVEYS.map(original);}
