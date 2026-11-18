// Builder 1B M2P: six original independent variant-002 regional life structures. Draft only.
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
  sourceAuthor:'Builder 1B M2P second-variant XYZ blueprint',
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







const SURVEYS=[{"category":"bathhouse","biome":"temperate","size":"large","key":"briarloop","name":"Briarloop Crescent Baths","dim":[51,28,53],"mask":[[14,1,34,12],[2,13,13,36],[35,12,47,26],[14,25,34,30],[34,31,42,36],[14,42,42,49],[7,37,13,46],[13,12,13,12],[35,37,39,41]],"entries":[[24,1],[16,12],[17,12],[13,16],[35,18],[34,26],[34,29],[35,31],[35,36],[14,27],[13,27],[10,36],[10,37],[13,43],[14,43],[13,12],[14,12],[13,13],[34,12],[35,12],[34,25],[35,25],[34,30],[34,31],[37,36],[37,37],[37,41],[37,42],[15,12],[13,14],[33,12],[35,13]],"windows":[[18,1,"north"],[30,1,"north"],[2,21,"west"],[47,19,"east"],[39,43,"east"],[20,49,"south"],[7,42,"west"]],"roofs":[[[14,1,34,12],11,"briarloop-north-pavilion-arched","gable-x","pack3:023"],[[2,13,13,36],9,"briarloop-west-long-curved-bath","ramp-z","live:wood"],[[35,12,47,26],16,"briarloop-east-tall-thermal-terrace","reverse-x","live:stone"],[[14,25,34,30],11,"briarloop-middle-glass-bridge","gable-z","pack4:030"],[[34,31,42,36],13,"briarloop-right-bent-high-landing","reverse-z","live:wood"],[[14,42,42,49],10,"briarloop-wide-south-cloak-arc","hip","live:wood"],[[7,37,13,46],9,"briarloop-offset-west-dry-pier","ramp-z","live:stone"],[[35,37,39,41],10,"briarloop-south-curled-cloak-bridge","ramp-z","live:wood"]],"posts":[[18,5],[30,5],[6,19],[6,31],[42,18],[41,23],[20,27],[30,27],[38,33],[20,46],[34,46],[10,42],[37,39]],"furniture":[[22,5,"reed-waterless-heat-ledger"],[28,6,"terrace-bath-map"],[8,19,"dry-basin-stone"],[41,19,"silent-steam-generator"],[22,27,"old-cloak-ticket"],[37,33,"heated-seat-design"],[26,46,"forest-cloak-directory"],[10,41,"bath-supply-record"]],"dependencies":[[26,8,"pack1:002","timber-boundary-support-sample"]],"rooms":[["north-arrival-vault",15,2,33,11],["west-winding-thermal-run",3,14,12,35],["east-grand-raised-bath",36,13,46,25],["middle-courtyard-overpass",15,26,33,29],["right-thin-upper-return",35,32,41,35],["rear-broad-cloak-archive",15,43,41,48],["western-return-lockers",8,38,12,45],["right-lower-bath-passage",36,38,38,40]],"portals":[["outside","north-arrival-vault",24,1],["north-arrival-vault","west-winding-thermal-run",13,12],["north-arrival-vault","east-grand-raised-bath",35,18],["west-winding-thermal-run","middle-courtyard-overpass",13,27],["middle-courtyard-overpass","right-thin-upper-return",35,31],["west-winding-thermal-run","western-return-lockers",10,36],["western-return-lockers","rear-broad-cloak-archive",13,43],["right-thin-upper-return","right-lower-bath-passage",37,37],["right-lower-bath-passage","rear-broad-cloak-archive",37,41]],"description":"Asymmetric open-air C bath: deep western low wing, short elevated eastern steam wing, broken center glazed bridge and sweeping back cloak archive. Water and heating inactive."},{"category":"farm-barn","biome":"mountain","size":"medium","key":"basaltstep","name":"Basaltstep Sawtooth Fold Barn","dim":[44,26,44],"mask":[[3,1,35,9],[3,10,12,29],[27,10,39,22],[13,21,26,26],[15,27,24,30],[11,31,30,41]],"entries":[[19,1],[7,9],[7,10],[29,9],[29,10],[12,23],[13,23],[26,22],[27,22],[19,26],[19,27],[19,30],[19,31]],"windows":[[7,1,"north"],[31,1,"north"],[3,18,"west"],[39,17,"east"],[18,41,"south"],[27,41,"south"]],"roofs":[[[3,1,35,9],12,"basaltstep-deep-mountain-loading-saw","gable-x","pack3:025"],[[3,10,12,29],9,"basaltstep-low-left-quarry-awn","ramp-z","live:stone"],[[27,10,39,22],15,"basaltstep-raised-right-feed-tower","reverse-x","live:wood"],[[13,21,26,26],10,"basaltstep-crossing-under-sky-slope","gable-z","pack4:030"],[[15,27,24,30],11,"basaltstep-centered-narrow-feed-neck","reverse-z","live:wood"],[[11,31,30,41],10,"basaltstep-wide-low-rear-hay-court","hip","live:stone"]],"posts":[[7,5],[30,5],[7,16],[7,25],[34,15],[34,19],[18,23],[20,29],[17,37],[25,37]],"furniture":[[11,5,"dormant-rock-granary"],[28,5,"unpulled-hay-lift"],[6,19,"cold-rock-supply-list"],[34,17,"mining-feed-record"],[19,23,"dusty-load-chart"],[20,28,"staggered-cargo-form"],[21,36,"stored-snow-ledger"]],"dependencies":[[16,5,"pack1:006","basalt-frame-masonry-sample"]],"rooms":[["front-quarry-loading",4,2,34,8],["west-deep-low-stone-loft",4,11,11,28],["east-higher-hay-watch",28,11,38,21],["skewed-central-stairless-crosspass",14,22,25,25],["thin-rear-cargo-neck",16,28,23,29],["broad-rear-feed-gallery",12,32,29,40]],"portals":[["outside","front-quarry-loading",19,1],["front-quarry-loading","west-deep-low-stone-loft",7,9],["front-quarry-loading","east-higher-hay-watch",29,9],["west-deep-low-stone-loft","skewed-central-stairless-crosspass",12,23],["east-higher-hay-watch","skewed-central-stairless-crosspass",27,22],["skewed-central-stairless-crosspass","thin-rear-cargo-neck",19,26],["thin-rear-cargo-neck","broad-rear-feed-gallery",19,30]],"description":"Jagged uphill barn with massive front sawtooth roof, long ground-level west quarry chute, short raised east feed tower and narrow diagonal rear connection."},{"category":"greenhouse","biome":"desert","size":"medium","key":"sundial","name":"Sundial Split-Loop Glassworks","dim":[43,26,47],"mask":[[13,1,29,8],[3,8,12,30],[30,8,38,23],[13,22,29,27],[24,28,38,42],[4,34,23,43],[15,28,23,33]],"entries":[[20,1],[12,8],[13,8],[29,8],[30,8],[12,24],[13,24],[29,22],[30,22],[20,27],[20,28],[23,35],[24,35],[18,33],[18,34],[14,8],[15,8],[16,8],[17,8],[18,8],[19,8],[20,8],[21,8],[22,8],[23,8],[24,8],[25,8],[26,8],[27,8],[28,8],[12,9],[30,9]],"windows":[[16,1,"north"],[27,1,"north"],[3,19,"west"],[38,17,"east"],[30,42,"south"],[8,43,"south"]],"roofs":[[[13,1,29,8],12,"sundial-front-small-light-visor","gable-x","pack3:024"],[[3,8,12,30],9,"sundial-west-sun-shadow-run","ramp-z","live:stone"],[[30,8,38,23],15,"sundial-high-east-refraction-lab","reverse-x","pack4:030"],[[13,22,29,27],11,"sundial-middle-glass-court-bridge","gable-z","live:wood"],[[24,28,38,42],13,"sundial-back-east-flower-pier","reverse-z","live:stone"],[[4,34,23,43],9,"sundial-back-west-root-lodge","hip","live:wood"],[[15,28,23,33],10,"sundial-lower-mid-dogleg","ramp-z","live:stone"]],"posts":[[17,4],[26,4],[7,15],[7,26],[34,16],[35,21],[19,25],[31,34],[34,39],[9,39],[18,39],[19,30]],"furniture":[[21,4,"unpowered-solar-window"],[7,18,"arid-soil-seed-cabinet"],[34,18,"dry-glasshouse-lens"],[20,25,"cold-water-tile"],[31,36,"sand-herb-record"],[12,39,"tomb-seed-index"],[19,31,"unused-glaze-counter"]],"dependencies":[[23,6,"pack5:080","arid-greenhouse-rock-trim"]],"rooms":[["north-sun-registration",14,2,28,7],["west-long-cool-shade",4,9,11,29],["east-raised-light-house",31,9,37,22],["mid-bridge-with-void-courts",14,23,28,26],["back-east-specimen-record",25,29,37,41],["back-west-shade-archive",5,35,22,42],["lower-glass-dogleg",16,29,22,32]],"portals":[["outside","north-sun-registration",20,1],["north-sun-registration","west-long-cool-shade",12,8],["north-sun-registration","east-raised-light-house",29,8],["west-long-cool-shade","mid-bridge-with-void-courts",12,24],["east-raised-light-house","mid-bridge-with-void-courts",29,22],["mid-bridge-with-void-courts","lower-glass-dogleg",20,27],["lower-glass-dogleg","back-west-shade-archive",18,33],["back-west-shade-archive","back-east-specimen-record",23,35]],"description":"Split-loop desert conservatory with one long low shading wing, one high bright wing, thin central glass court and asymmetric double return around real uncovered sand."},{"category":"fishing-lodge","biome":"snow","size":"large","key":"icewater","name":"Icewater Two-Quay Guildhouse","dim":[49,28,54],"mask":[[1,1,17,11],[26,1,45,10],[18,9,25,27],[2,12,14,36],[34,11,45,30],[15,28,33,33],[18,34,30,38],[10,39,40,51]],"entries":[[9,1],[36,1],[17,10],[18,10],[25,9],[26,9],[10,11],[10,12],[14,29],[15,29],[33,29],[34,29],[21,27],[21,28],[23,33],[23,34],[23,38],[23,39]],"windows":[[5,1,"north"],[40,1,"north"],[2,19,"west"],[45,19,"east"],[16,51,"south"],[35,51,"south"]],"roofs":[[[1,1,17,11],10,"icewater-wide-west-winter-net-hall","gable-x","pack3:025"],[[26,1,45,10],14,"icewater-high-east-ice-trade-room","reverse-x","live:stone"],[[18,9,25,27],12,"icewater-central-narrow-net-channel","gable-z","pack4:030"],[[2,12,14,36],9,"icewater-west-deep-cold-wharf","ramp-z","live:wood"],[[34,11,45,30],13,"icewater-high-east-deep-charter","reverse-z","live:stone"],[[15,28,33,33],11,"icewater-glass-harbor-crossing","gable-x","live:wood"],[[18,34,30,38],10,"icewater-south-braided-canal","ramp-z","live:stone"],[[10,39,40,51],10,"icewater-rear-grand-harbor-record","hip","live:wood"]],"posts":[[6,5],[12,5],[32,4],[40,4],[22,15],[7,19],[8,32],[38,18],[39,26],[21,30],[30,30],[23,36],[18,45],[33,45]],"furniture":[[10,5,"frost-net-archive"],[35,5,"icewater-trade-ledger"],[23,15,"unpowered-hook-rig"],[8,20,"unused-dock-scale"],[39,20,"silent-north-signal"],[22,30,"fishery-tariff-paper"],[24,36,"ice-navigation-register"],[23,45,"harbor-guild-log"]],"dependencies":[[21,17,"pack1:005","snow-dock-beam-sample"]],"rooms":[["left-main-wharf",2,2,16,10],["right-higher-trade-hall",27,2,44,9],["central-long-snow-net-passage",19,10,24,26],["left-deep-ice-pier",3,13,13,35],["right-tall-cold-office",35,12,44,29],["middle-sheltered-crosspass",16,29,32,32],["southern-lower-quay-braid",19,35,29,37],["rear-wide-fish-guild",11,40,39,50]],"portals":[["outside","left-main-wharf",9,1],["outside","right-higher-trade-hall",36,1],["left-main-wharf","central-long-snow-net-passage",17,10],["right-higher-trade-hall","central-long-snow-net-passage",25,9],["left-main-wharf","left-deep-ice-pier",10,11],["central-long-snow-net-passage","middle-sheltered-crosspass",21,27],["left-deep-ice-pier","middle-sheltered-crosspass",14,29],["right-tall-cold-office","middle-sheltered-crosspass",34,29],["middle-sheltered-crosspass","southern-lower-quay-braid",23,33],["southern-lower-quay-braid","rear-wide-fish-guild",23,38]],"description":"Double unequal winter wharves joined by a narrow central net spine, deep opposed sea wings, a lower transverse canal and a huge rear guildhouse."},{"category":"harbor-office","biome":"enchanted-forest","size":"small","key":"brookshade","name":"Brookshade Offset Civic Ledger","dim":[37,25,41],"mask":[[5,1,26,8],[2,9,10,24],[27,8,34,19],[11,18,26,23],[20,24,28,28],[12,29,32,38],[2,25,11,34]],"entries":[[16,1],[7,8],[7,9],[26,8],[27,8],[10,20],[11,20],[26,19],[27,19],[23,23],[23,24],[23,28],[23,29],[11,31],[12,31],[7,24],[7,25],[25,8],[28,8],[28,9]],"windows":[[8,1,"north"],[24,1,"north"],[2,17,"west"],[34,15,"east"],[22,38,"south"],[2,30,"west"]],"roofs":[[[5,1,26,8],11,"brookshade-front-bent-wood-arch","gable-x","pack3:023"],[[2,9,10,24],9,"brookshade-west-long-fern-ledger","ramp-z","live:wood"],[[27,8,34,19],15,"brookshade-east-raised-barge-lodge","reverse-x","live:stone"],[[11,18,26,23],12,"brookshade-central-roofed-civic-neck","gable-z","pack4:030"],[[20,24,28,28],11,"brookshade-south-thin-cross-canal","reverse-z","live:wood"],[[12,29,32,38],10,"brookshade-back-register-archive","hip","live:wood"],[[2,25,11,34],9,"brookshade-left-lower-guild-clerk","ramp-z","live:stone"]],"posts":[[9,4],[22,4],[6,15],[6,22],[30,14],[31,17],[18,20],[24,26],[18,34],[28,35],[6,30]],"furniture":[[13,4,"retired-canal-charter"],[23,5,"forest-vessel-record"],[6,18,"wetland-tax-guide"],[30,16,"inactive-forest-lantern"],[18,21,"guild-letter-ledger"],[25,26,"unused-stamp-case"],[22,34,"customs-library-index"],[6,29,"moss-archive"]],"dependencies":[[16,5,"pack2:013","woodland-pier-support"]],"rooms":[["north-visitor-entry",6,2,25,7],["west-long-levy-clerk",3,10,9,23],["east-short-upper-charters",28,9,33,18],["center-paper-crossing",12,19,25,22],["downstream-arch-bridge",21,25,27,27],["south-grand-civic-index",13,30,31,37],["west-lower-copy-vault",3,26,10,33]],"portals":[["outside","north-visitor-entry",16,1],["north-visitor-entry","west-long-levy-clerk",7,8],["north-visitor-entry","east-short-upper-charters",26,8],["west-long-levy-clerk","center-paper-crossing",10,20],["east-short-upper-charters","center-paper-crossing",26,19],["center-paper-crossing","downstream-arch-bridge",23,23],["downstream-arch-bridge","south-grand-civic-index",23,28],["west-long-levy-clerk","west-lower-copy-vault",7,24],["west-lower-copy-vault","south-grand-civic-index",11,31]],"description":"Asymmetric small civic office with raised east ledgers, deep low west record gallery, a thin zigzag paper crossing and widened rear charter rooms."},{"category":"lighthouse","biome":"temperate","size":"large","key":"crownspire","name":"Crownspire Split-Arc Beacon","dim":[47,48,54],"wallTop":8,"mask":[[1,1,19,24],[20,11,44,23],[2,25,11,43],[32,24,44,43],[12,34,31,39],[12,40,31,43],[12,44,36,51]],"entries":[[10,1],[19,17],[20,17],[8,24],[8,25],[36,23],[36,24],[11,36],[12,36],[31,36],[32,36],[20,39],[20,40],[20,43],[20,44]],"windows":[[5,1,"north"],[1,16,"west"],[29,11,"north"],[44,20,"east"],[5,35,"west"],[23,51,"south"]],"roofs":[[[20,11,44,23],15,"crownspire-high-east-keeper-archive","gable-x","pack3:023"],[[2,25,11,43],9,"crownspire-long-west-low-root-porch","ramp-z","live:wood"],[[32,24,44,43],13,"crownspire-eastern-return-tower-shed","reverse-z","live:stone"],[[12,34,31,39],11,"crownspire-broad-west-east-walk","gable-z","pack4:030"],[[12,40,31,43],9,"crownspire-south-narrow-paper-neck","reverse-x","live:wood"],[[12,44,36,51],10,"crownspire-grand-rear-record-house","hip","live:wood"]],"posts":[[26,16],[38,16],[6,30],[6,40],[38,30],[39,40],[18,36],[27,37],[18,42],[20,47],[30,48]],"furniture":[[10,6,"old-temperate-navigation-chart"],[27,16,"inactive-weather-office"],[6,31,"harbor-supply-ledger"],[39,31,"crown-canal-survey"],[20,36,"silent-signal-notice"],[18,41,"archive-shipping-map"],[24,47,"keeper-history-book"]],"dependencies":[[29,17,"pack1:002","temperate-tower-truss"]],"rooms":[["main-tall-beacon-foundation",2,2,18,23],["east-high-keeper-and-signal",21,12,43,22],["west-very-long-supply-court",3,26,10,42],["east-large-return-ledger",33,25,43,42],["central-stone-overpass",13,35,30,38],["south-long-shipping-bridge",13,41,30,42],["rear-grand-navigation-office",13,45,35,50]],"portals":[["outside","main-tall-beacon-foundation",10,1],["main-tall-beacon-foundation","east-high-keeper-and-signal",19,17],["main-tall-beacon-foundation","west-very-long-supply-court",8,24],["east-high-keeper-and-signal","east-large-return-ledger",36,23],["west-very-long-supply-court","central-stone-overpass",11,36],["central-stone-overpass","east-large-return-ledger",31,36],["central-stone-overpass","south-long-shipping-bridge",20,39],["south-long-shipping-bridge","rear-grand-navigation-office",20,43]],"beacon":{"stages":[["cap",1,1,19,24,9,9,"live:stone","crownspire-broad-anchored-platform"],["ring",3,3,17,22,10,27,"live:stone","crownspire-prismatic-stone-shaft"],["cap",3,3,17,22,28,28,"live:stone","crownspire-middle-crown-platform"],["ring",7,7,13,18,29,37,"live:wood","crownspire-higher-wind-tower"],["cap",7,7,13,18,38,38,"live:crystal","crownspire-tall-single-prism-cap"]],"finials":[[10,12,39,43,"live:crystal","unlit-crownspire-reflector"]]},"description":"Grand stone and rootwood single-prism beacon with long staggered east keeper annex, deep western low supply arm, wide split courtyard and grand rear ledger; no functional light, upper access or gameplay."}];
export function getM2PRegional1BPlans(){return SURVEYS.map(original);}
