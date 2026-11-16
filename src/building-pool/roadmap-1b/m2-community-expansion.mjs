// Builder 1B M2 regional community expansion: nine SOURCE-AUTHORED original voxel plans.
// The common helper validates occupancy, but every floor plan, portal graph and roof below
// is explicitly programmed per design. No procedural seeds/rotations/reskins, runtime
// imports, world placement, save mutation, livestock, harvesting, or functional water.
import {sourcePlan} from './m2-community-structures.mjs';

// Temperate Medium bathhouse: a real corridor around an enclosed triangular
// stone thermal hearth, with parallel side treatments and a dry rear conservatory.
export function buildWillowbrookBaths(){
 const b=sourcePlan('bathhouse','temperate','medium',1,'Willowbrook Riverstone Baths',23,13,25);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,hip,rim,finish}=b;
 floor('live:stone');wallRing(5,'live:wood');for(const x of [10,11,12])opening(x,1);
 wallZ(8,2,20,4);for(const x of [5,11,17])opening(x,8);
 wallZ(17,2,20,4);for(const x of [5,11,17])opening(x,17);
 wallX(8,9,16,3);for(const z of [10,15])opening(8,z);
 wallX(14,9,16,3);for(const z of [10,15])opening(14,z);
 for(const [x,z,f] of [[3,1,'north'],[19,1,'north'],[1,5,'west'],[21,5,'east'],
  [4,23,'south'],[18,23,'south']])pane(x,z,f);
 // Perimeter-supported U-roof, center skylight left deliberately uncovered.
 for(let x=1;x<=21;x++)for(let z=1;z<=23;z++){
  if(z>8&&z<18&&x>7&&x<15)continue;
  const rise=Math.floor(Math.min(x-1,21-x,z-1,23-z)/4);
  put(x,6+rise,z,'roof','live:wood','none',{roofProfile:'willow-hip-and-open-core',spanApproved:false});
 }
 for(const [x,z] of [[4,4],[18,4],[4,13],[18,13],[4,21],[18,21]])support(x,z,5,'live:stone','masonry-thermal-pier');
 rim(3,6,11,15,5,'live:stone','west-empty-therapy-rim');
 rim(16,19,11,15,17,'live:stone','east-empty-therapy-rim');
 for(const [x,z,p] of [[5,4,'changing-bench'],[17,4,'linen-drawer'],[10,12,'dry-heat-mass-unlit'],
  [12,12,'stone-relaxation-seat'],[5,21,'quiet-garden-planter'],[17,21,'dry-soap-cabinet']])fitting(x,z,p);
 room('public-checkin',2,2,21,8);
 room('left-dry-treatment',2,9,8,17);
 room('open-stone-court',9,9,14,17);
 room('right-private-wash',15,9,21,17);
 room('back-relaxation-conservatory',2,18,21,23);
 portal('outside','public-checkin',11,1,'wide-walkway');
 portal('public-checkin','left-dry-treatment',5,8);
 portal('public-checkin','open-stone-court',11,8);
 portal('public-checkin','right-private-wash',17,8);
 portal('left-dry-treatment','open-stone-court',8,10);
 portal('open-stone-court','right-private-wash',14,10);
 portal('open-stone-court','back-relaxation-conservatory',11,17);
 return finish('riverstone U-roofed spa, parallel therapy rooms and open skylight courtyard',
  {workingWater:false,steam:false,thermalSimulation:false});
}

// Desert Small bathhouse: a lantern-lined *open-roof* entrance arcade with a
// genuinely separate north soaking rim and back wash space.
export function buildAmberstepBasin(){
 const b=sourcePlan('bathhouse','desert','small',1,'Amberstep Sunken Basin Baths',17,12,19);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,shed,rim,finish}=b;
 floor('live:stone');wallRing(4,'live:stone');opening(8,1);
 wallZ(6,2,14,3,'live:stone');for(const x of [4,8,12])opening(x,6);
 wallZ(13,2,14,3,'live:stone');for(const x of [2,4,5,8,11,12,14])opening(x,13);
 wallX(8,7,12,3,'live:stone');for(const z of [8,11,12])opening(8,z);
 for(const [x,z,f] of [[3,1,'north'],[13,1,'north'],[1,8,'west'],[15,8,'east'],
  [3,17,'south'],[13,17,'south']])pane(x,z,f);
 // Canopy is ONLY the pair of side verandas plus wash gallery, open court in middle.
 shed(1,4,1,17,5,7,'desert-west-arcade','live:stone');
 shed(12,15,1,17,5,7,'desert-east-arcade','live:stone');
 shed(5,11,13,17,5,4,'desert-ablution-gallery','live:wood');
 for(const [x,z] of [[3,4],[13,4],[3,10],[13,10]])support(x,z,4,'live:stone','desert-court-pillar');
 rim(4,7,14,16,5,'live:stone','left-empty-ablution');
 rim(10,13,14,16,11,'live:stone','right-empty-ablution');
 for(const [x,z,p] of [[4,3,'travel-cloak-bench'],[12,3,'linen-stack'],
  [5,10,'dry-mud-heat-plinth'],[11,10,'bath-access-seat']])fitting(x,z,p);
 room('shaded-arrival',2,2,15,6);
 room('west-dry-mud-room',2,7,8,13);
 room('central-service-walk',9,7,15,13);
 room('rear-ablution-court',2,14,15,17);
 portal('outside','shaded-arrival',8,1);
 portal('shaded-arrival','west-dry-mud-room',4,6);
 portal('shaded-arrival','central-service-walk',12,6);
 portal('west-dry-mud-room','central-service-walk',8,8);
 portal('central-service-walk','rear-ablution-court',12,13);
 return finish('small desert bath without a roof over open courtyard, two empty wash rims and shaded outer arcade',
 {noRealWater:true,weatherBearingUnverified:true});
}

// Snow Medium: L-shaped insulated colonnade surrounding uncovered frost
// court, dry stove room and clear separate empty snow-water basin.
export function buildGlacierEmberBath(){
 const b=sourcePlan('bathhouse','snow','medium',1,'Glacier Ember Healing Baths',25,16,27);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,rim,finish}=b;
 floor('live:stone');wallRing(7,'live:stone');for(const x of [11,12,13])opening(x,1);
 wallZ(9,2,22,5,'live:stone');for(const x of [5,12,19])opening(x,9);
 wallZ(20,2,22,5,'live:stone');for(const x of [5,12,19])opening(x,20);
 wallX(10,10,19,4,'live:stone');for(const z of [12,17])opening(10,z);
 wallX(17,10,19,4,'live:stone');for(const z of [12,17])opening(17,z);
 for(const [x,z,f] of [[4,1,'north'],[20,1,'north'],[1,7,'west'],[23,7,'east'],
  [5,25,'south'],[19,25,'south']])pane(x,z,f);
 // Snow-shedding ridge spans front and back; side wings separate, center skylight.
 gable(1,9,1,23,8,3,'live:wood','glacier-entrance-snow-ridge');
 gable(20,25,1,23,8,3,'live:stone','glacier-rear-snow-ridge');
 for(let z=10;z<=19;z++)for(const x of [1,2,3,4,19,20,21,22,23])
   put(x,8+Math.floor((z-10)/5),z,'roof','live:wood','north',
   {roofProfile:'snow-side-wing-sheds',bearingApproved:false});
 for(const [x,z] of [[5,5],[19,5],[5,15],[21,15],[9,23],[16,23]])
  support(x,z,7,'live:stone','insulated-buttress');
 rim(3,8,22,24,5,'live:stone','covered-ice-basin-rim');
 rim(17,21,22,24,19,'live:stone','sun-melt-basin-rim');
 for(const [x,z,p] of [[4,4,'dry-clothing-rack'],[19,4,'glove-drying-bench'],
  [4,12,'stove-plinth-unlit'],[20,12,'heating-plant-shell-no-steam'],
  [12,23,'winter-well-altar-unpowered']])fitting(x,z,p);
 room('snow-lock-reception',2,2,23,9);
 room('west-insulated-warming',2,10,10,20);
 room('sky-lit-central-treatment',11,10,17,20);
 room('east-meltwater-wash',18,10,23,20);
 room('winter-basin-court',2,21,23,25);
 portal('outside','snow-lock-reception',12,1);
 portal('snow-lock-reception','west-insulated-warming',5,9);
 portal('snow-lock-reception','sky-lit-central-treatment',12,9);
 portal('snow-lock-reception','east-meltwater-wash',19,9);
 portal('west-insulated-warming','sky-lit-central-treatment',10,12);
 portal('sky-lit-central-treatment','east-meltwater-wash',17,12);
 portal('sky-lit-central-treatment','winter-basin-court',12,20);
 return finish('L-plan winter baths with exposed central snow-lit corridor and distinct dual empty basin rims',
 {actualSteam:false,heatingApproved:false,waterSimulation:false});
}

// Temperate Large: three connected wings, eight *empty* stall cells,
// true cross aisle and open-sky center exercising yard.
export function buildClovermeadowStable(){
 const b=sourcePlan('stable','temperate','large',4,'Clovermeadow Equestrian Yard',31,16,33);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,hip,finish}=b;
 floor('live:stone');wallRing(7,'live:wood');for(const x of [14,15,16])opening(x,1);
 wallZ(8,2,28,4,'live:wood');for(const x of [6,15,24])opening(x,8);
 wallZ(24,2,28,4,'live:wood');for(const x of [6,15,24])opening(x,24);
 wallX(12,9,23,4,'live:wood');for(const z of [11,19])opening(12,z);
 wallX(18,9,23,4,'live:wood');for(const z of [11,19])opening(18,z);
 for(const z of [15]){wallZ(z,2,11,3,'live:wood');wallZ(z,19,28,3,'live:wood');}
 for(const [x,z,f] of [[4,1,'north'],[26,1,'north'],[1,10,'west'],[29,10,'east'],
  [1,20,'west'],[29,20,'east'],[5,31,'south'],[25,31,'south']])pane(x,z,f);
 // Deliberate OPEN central exercising court; roof each side and front and rear
 // wings with physically different silhouette spans.
 gable(1,8,1,29,8,4,'live:wood','clover-forward-hay-gable');
 gable(24,31,1,29,8,4,'live:wood','clover-rear-tack-gable');
 for(let x=1;x<=12;x++)for(let z=9;z<=23;z++)
  put(x,8+Math.floor((12-x)/5),z,'roof','live:wood','east',{roofProfile:'west-stall-lean-roof'});
 for(let x=18;x<=29;x++)for(let z=9;z<=23;z++)
  put(x,8+Math.floor((x-18)/5),z,'roof','live:wood','east',{roofProfile:'east-stall-lean-roof'});
 for(const x of [5,25])for(const z of [5,12,21,28])support(x,z,7,'live:wood','equine-yard-structural-pier');
 for(const x of [5,8,22,25])for(const z of [11,19])fitting(x,z,'empty-hay-feeder');
 for(const [x,z,p] of [[5,4,'unloaded-hay-cart'],[25,4,'saddle-rack'],
  [7,28,'bedding-store'],[23,28,'repair-equipment-shelf']])fitting(x,z,p);
 room('arrival-hay-entrance',2,2,29,8);
 room('west-front-empty-stalls',2,9,12,15);
 room('west-back-empty-stalls',2,16,12,24);
 room('open-training-yard',13,9,18,24);
 room('east-front-empty-stalls',19,9,29,15);
 room('east-back-empty-stalls',19,16,29,24);
 room('rear-feed-and-equipment',2,25,29,31);
 portal('outside','arrival-hay-entrance',15,1,'three-cell-wagon-gate');
 for(const x of [6,15,24])portal('arrival-hay-entrance',x===6?'west-front-empty-stalls':x===15?'open-training-yard':'east-front-empty-stalls',x,8);
 portal('west-front-empty-stalls','open-training-yard',12,11);
 portal('west-back-empty-stalls','open-training-yard',12,19);
 portal('open-training-yard','east-front-empty-stalls',18,11);
 portal('open-training-yard','east-back-empty-stalls',18,19);
 portal('open-training-yard','rear-feed-and-equipment',15,24);
 return finish('three-wing equestrian yard, covered empty stall galleries and actual sky-open exercising center',
 {animals:0,horseMovement:false});
}

// Desert Large: inn-free caravan rest station; eight empty booths on a
// central arcade with two open warming courts, isolated waterless troughs.
export function buildCopperduneCaravanStable(){
 const b=sourcePlan('stable','desert','large',4,'Copperdune Eight-Bay Caravan Stable',29,15,31);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,shed,hip,finish}=b;
 floor('live:stone');wallRing(6,'live:stone');for(const x of [13,14,15])opening(x,1);
 wallX(11,3,22,4,'live:stone');wallX(17,3,22,4,'live:stone');
 for(const z of [5,11,17,21]){opening(11,z);opening(17,z);}
 for(const z of [8,14,19]){wallZ(z,2,10,3,'live:wood');wallZ(z,18,26,3,'live:wood');}
 wallZ(23,2,26,4,'live:stone');opening(14,23);
 for(const [x,z,f] of [[4,1,'north'],[24,1,'north'],[1,6,'west'],[27,6,'east'],
  [1,20,'west'],[27,20,'east'],[4,29,'south'],[24,29,'south']])pane(x,z,f);
 // Asymmetric twin raised sun-shade decks over side stalls; courtyard is
 // sky-open strip between the two canopies except over front waterless vestibule.
 for(let x=1;x<=11;x++)for(let z=1;z<=23;z++)
  put(x,7+Math.floor((11-x)/6),z,'roof','live:stone','east',{roofProfile:'desert-west-canopy'});
 for(let x=17;x<=27;x++)for(let z=1;z<=23;z++)
  put(x,7+Math.floor((x-17)/6),z,'roof','live:stone','east',{roofProfile:'desert-east-canopy'});
 shed(12,16,1,7,7,5,'caravan-entry-bridge','live:wood');
 hip(1,27,24,29,7,4,'south-repair-hip','live:wood');
 for(const x of [5,23])for(const z of [5,11,17,25])support(x,z,6,'live:stone','arcade-standing-column');
 for(const x of [4,8,20,24])for(const z of [4,10,16,21])fitting(x,z,'empty-stall-waterless-manger');
 for(const [x,z,p] of [[4,26,'saddle-strap-frame'],[24,26,'caravan-supply-cabinet'],
  [14,26,'animal-free-grooming-rack']])fitting(x,z,p);
 room('caravan-wide-arrival',12,2,17,23);
 room('west-pen-one',2,3,11,8);
 room('west-pen-two',2,9,11,14);
 room('west-pen-three',2,15,11,19);
 room('west-pen-four',2,20,11,23);
 room('east-pen-one',18,3,27,8);
 room('east-pen-two',18,9,27,14);
 room('east-pen-three',18,15,27,19);
 room('east-pen-four',18,20,27,23);
 room('rear-repair-gallery',2,24,27,29);
 portal('outside','caravan-wide-arrival',14,1);
 for(const [name,x,z] of [
 ['west-pen-one',11,5],['west-pen-two',11,11],['west-pen-three',11,17],['west-pen-four',11,21],
 ['east-pen-one',17,5],['east-pen-two',17,11],['east-pen-three',17,17],['east-pen-four',17,21]
 ])portal('caravan-wide-arrival',name,x,z,'empty-stall-bay');
 portal('caravan-wide-arrival','rear-repair-gallery',14,23);
 return finish('eight deserted caravan stalls with opposed stone shade canopies, open central court and rear gear atelier',
 {animals:0,waterSimulation:false,shadeCanopyLoadsPending:true});
}

// Snow Small: compact six-wall windbreak around four empty sheltered pens,
// with intentionally different offset metal-free timber snow sheds.
export function buildIcetrailStable(){
 const b=sourcePlan('stable','snow','small',4,'Icetrail Hollow Windbreak Stable',19,14,23);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,shed,finish}=b;
 floor('live:stone');wallRing(6,'live:wood');for(const x of [8,9,10])opening(x,1);
 wallX(7,3,16,4);wallX(11,3,16,4);
 for(const z of [5,13]){opening(7,z);opening(11,z);}
 for(const z of [9]){wallZ(z,2,6,4);wallZ(z,12,16,4);}
 wallZ(17,2,16,4,'live:wood');opening(9,17);
 for(const [x,z,f] of [[3,1,'north'],[15,1,'north'],[1,6,'west'],[17,6,'east'],[4,21,'south'],[14,21,'south']])pane(x,z,f);
 gable(1,21,1,17,7,2,'live:wood','icetrail-steep-crosswind-roof');
 for(const [x,z] of [[4,5],[14,5],[4,13],[14,13],[4,19],[14,19]])
  support(x,z,6,'live:stone','windward-wall-support');
 for(const [x,z,p] of [[4,4,'grain-crate-empty'],[14,4,'grain-crate-empty'],
  [4,12,'empty-hay-trough'],[14,12,'empty-hay-trough'],
  [5,19,'ice-scraper-rack'],[13,19,'gear-cabinet']])fitting(x,z,p);
 room('windlock-wagon-aisle',8,2,11,17);
 room('west-front-empty-pen',2,3,7,9);
 room('west-back-empty-pen',2,10,7,17);
 room('east-front-empty-pen',12,3,17,9);
 room('east-back-empty-pen',12,10,17,17);
 room('insulated-back-gear',2,18,17,21);
 portal('outside','windlock-wagon-aisle',9,1,'three-cell-wide-windbreak');
 for(const [name,x,z] of [
 ['west-front-empty-pen',7,5],['west-back-empty-pen',7,13],
 ['east-front-empty-pen',11,5],['east-back-empty-pen',11,13]
 ])portal('windlock-wagon-aisle',name,x,z,'empty-stall-opening');
 portal('windlock-wagon-aisle','insulated-back-gear',9,17);
 return finish('high-wind snow stable with four empty side pens, deep weatherlock and actual windward roof supports',
 {animals:0,heatingSystem:false});
}

// Temperate Medium: grain-drying pier-facing two-part cart barn; raised
// timber cupola but no invented grain machinery or flowing water.
export function buildBrookrailGranary(){
 const b=sourcePlan('farm-barn','temperate','medium',1,'Brookrail Riverside Granary',23,15,27);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,shed,finish}=b;
 floor();wallRing(6,'live:wood');for(const x of [9,10,11])opening(x,1);
 wallZ(10,2,20,4);for(const x of [5,11,17])opening(x,10);
 wallX(11,11,24,4);for(const z of [14,21])opening(11,z);
 wallZ(20,2,10,3);opening(6,20);
 for(const [x,z,f] of [[4,1,'north'],[18,1,'north'],[1,6,'west'],[21,6,'east'],
  [1,16,'west'],[21,16,'east'],[5,25,'south'],[17,25,'south']])pane(x,z,f);
 gable(1,25,1,21,7,3,'live:wood','brookrail-long-grain-roof');
 // Raised physical clerestory cupola over short center ridge; no simulated airflow.
 for(const [x,z] of [[9,11],[13,11],[9,15],[13,15]])support(x,z,10,'live:wood','vent-cupola-standing-post');
 for(let x=9;x<=13;x++)for(let z=11;z<=15;z++){
  const y=11+Math.floor(Math.min(x-9,13-x)/2);
  put(x,y,z,'roof','live:wood','none',{roofProfile:'grain-cupola',draftVentApproval:false});
 }
 for(const [x,z,p] of [[4,5,'cart-rope-spool'],[17,5,'cart-rope-spool'],
  [4,14,'baled-grain-storage'],[17,14,'miller-tally-bench'],
  [4,23,'winter-grain-sacks'],[18,23,'wagon-equipment-rack']])fitting(x,z,p);
 room('front-carts-and-loading',2,2,21,10);
 room('west-high-grain-store',2,11,11,20);
 room('east-drying-wing',12,11,21,25);
 room('west-rear-seed-bank',2,21,11,25);
 portal('outside','front-carts-and-loading',10,1,'triple-grain-cart-gate');
 portal('front-carts-and-loading','west-high-grain-store',5,10);
 portal('front-carts-and-loading','east-drying-wing',17,10);
 portal('west-high-grain-store','east-drying-wing',11,14);
 portal('west-high-grain-store','west-rear-seed-bank',6,20);
 portal('west-rear-seed-bank','east-drying-wing',11,21);
 return finish('riverside long grain store with actual two-wing drying area, seed bank and raised timber clerestory',
 {grainMachinery:false,riverWater:false});
}

// Mountain Small: stone stair-step retaining granary, open front carts,
// split rear bins and a roof that rises with the rear slope.
export function buildTalusStepBarn(){
 const b=sourcePlan('farm-barn','mountain','small',1,'Talus Step Storehouse',19,15,23);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,shed,finish}=b;
 floor('live:stone');wallRing(7,'live:stone');for(const x of [8,9,10])opening(x,1);
 wallZ(9,2,16,5,'live:stone');for(const x of [5,9,13])opening(x,9);
 wallX(9,10,20,4,'live:stone');for(const z of [13,18])opening(9,z);
 for(const [x,z,f] of [[3,1,'north'],[15,1,'north'],[1,5,'west'],[17,5,'east'],
  [1,15,'west'],[17,15,'east'],[4,21,'south'],[14,21,'south']])pane(x,z,f);
 shed(1,17,1,21,8,3,'rising-mountain-retaining-roof','live:stone');
 for(const [x,z] of [[4,4],[14,4],[4,12],[14,12],[4,20],[14,20]])
  support(x,z,7,'live:stone','tapered-slope-bearing-pier');
 for(const [x,z,p] of [[5,4,'miner-empty-load-box'],[13,4,'mountain-flour-crate'],
  [4,13,'dry-grain-shelf'],[14,13,'tool-sharpening-stand-nonfunctional'],
  [5,20,'rock-hammer-cabinet'],[13,20,'stored-forest-grain']])fitting(x,z,p);
 room('stone-unloading-deck',2,2,17,9);
 room('west-dry-granary-bin',2,10,9,21);
 room('east-tool-and-repair-bay',10,10,17,21);
 portal('outside','stone-unloading-deck',9,1,'three-cell-stone-cart-entrance');
 portal('stone-unloading-deck','west-dry-granary-bin',5,9);
 portal('stone-unloading-deck','east-tool-and-repair-bay',13,9);
 portal('west-dry-granary-bin','east-tool-and-repair-bay',9,13);
 return finish('small mountain stone granary whose whole shed roof steps upward with retaining slope',
 {liveMining:false,roadHeightABI:'unresolved'});
}

// Enchanted Large: split long halls around a genuine roofless fungus-drying
// court, with rear covered work gallery and six independent timber supports.
export function buildBriarhallCuringBarn(){
 const b=sourcePlan('farm-barn','enchanted-forest','large',1,'Briarhall Triple-Gallery Curing Barn',31,17,33);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,gable,shed,hip,finish}=b;
 floor('live:stone');wallRing(7,'live:wood');for(const x of [14,15,16])opening(x,1);
 wallZ(9,2,28,5,'live:wood');for(const x of [6,15,24])opening(x,9);
 wallZ(24,2,28,5,'live:wood');for(const x of [6,15,24])opening(x,24);
 wallX(11,10,23,4,'live:wood');for(const z of [12,21])opening(11,z);
 wallX(19,10,23,4,'live:wood');for(const z of [12,21])opening(19,z);
 for(const [x,z,f] of [[4,1,'north'],[26,1,'north'],[1,6,'west'],[29,6,'east'],
  [1,18,'west'],[29,18,'east'],[4,31,'south'],[26,31,'south']])pane(x,z,f);
 // Structural plan: covered front gallery, two separated drying pavilions,
 // central open air cultivation court, and protected rear curing rooms.
 gable(1,9,1,29,8,4,'live:wood','briarhall-front-truss');
 gable(24,31,1,29,8,4,'live:wood','briarhall-rear-truss');
 for(let x=1;x<=11;x++)for(let z=10;z<=23;z++)
  put(x,8+Math.floor((11-x)/4),z,'roof','live:wood','east',{roofProfile:'western-moss-drying-shed'});
 for(let x=19;x<=29;x++)for(let z=10;z<=23;z++)
  put(x,8+Math.floor((x-19)/4),z,'roof','live:wood','east',{roofProfile:'eastern-herb-drying-shed'});
 for(const [x,z] of [[4,5],[26,5],[4,14],[26,14],[4,22],[26,22],[4,29],[26,29]])
  support(x,z,7,'live:wood','living-timber-loaded-post');
 for(const [x,z,p] of [[5,5,'drying-bundle-lattice'],[25,5,'empty-basket-crate'],
  [5,13,'moss-rack-no-harvest'],[25,13,'seedling-propagation-frame'],
  [5,20,'fungus-curing-shelf-no-harvest'],[25,20,'loom-material-bin'],
  [4,28,'tackle-cabinet'],[26,28,'cart-repair-shelf']])fitting(x,z,p);
 room('wagon-load-transverse',2,2,29,9);
 room('west-drying-hall',2,10,11,24);
 room('open-moss-sorting-court',12,10,19,24);
 room('east-plant-fiber-hall',20,10,29,24);
 room('rear-covered-logistics',2,25,29,31);
 portal('outside','wagon-load-transverse',15,1,'three-cell-caravan-entry');
 for(const x of [6,15,24])portal('wagon-load-transverse',
  x===6?'west-drying-hall':x===15?'open-moss-sorting-court':'east-plant-fiber-hall',x,9);
 portal('west-drying-hall','open-moss-sorting-court',11,12);
 portal('west-drying-hall','open-moss-sorting-court',11,21);
 portal('open-moss-sorting-court','east-plant-fiber-hall',19,12);
 portal('open-moss-sorting-court','east-plant-fiber-hall',19,21);
 portal('open-moss-sorting-court','rear-covered-logistics',15,24);
 return finish('large forest curing complex: split covered halls encircle truly open drying court and protected rear shipping',
 {actualGrowing:false,harvesting:false,animals:0});
}

export function getM2Expansion1BPlans(){
 return [buildWillowbrookBaths(),buildAmberstepBasin(),buildGlacierEmberBath(),
  buildClovermeadowStable(),buildCopperduneCaravanStable(),buildIcetrailStable(),
  buildBrookrailGranary(),buildTalusStepBarn(),buildBriarhallCuringBarn()];
}
