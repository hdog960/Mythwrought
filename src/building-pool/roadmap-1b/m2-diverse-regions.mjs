// MYTHWROUGHT / BUILDER 1B / M2-C: Nine fixed, source-authored physical regional plans.
// Strict Builder 1B-only import; no runtime, world, saves, sibling builder or pack writes.
// Each plan has its own room partition program, full XYZ voxel roof, grounded
// support posts, two-high portals and per-instance material/physical dependency manifest.
import {sourcePlan} from './m2-community-structures.mjs';

// TEMPERATE LARGE BATHHOUSE: a U-shaped civic bath with independently covered
// reception, therapy wings, open-sky dry social court and rear garden pavilion.
export function createWillowCrownBathTerrace(){
 const b=sourcePlan('bathhouse','temperate','large',1,'Willowcrown Public Bath Terrace',31,17,33);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,rim,finish}=b;
 floor('live:stone');wallRing(7,'live:stone');
 for(const x of [14,15,16])opening(x,1);
 wallZ(9,2,28,5,'live:stone');for(const x of [6,15,24])opening(x,9);
 wallZ(24,2,28,5,'live:stone');for(const x of [6,15,24])opening(x,24);
 wallX(11,10,23,4,'live:wood');for(const z of [13,21])opening(11,z);
 wallX(19,10,23,4,'live:wood');for(const z of [13,21])opening(19,z);
 wallX(15,25,30,4,'live:wood');opening(15,28);
 for(const [x,z,f] of [[4,1,'north'],[26,1,'north'],[1,6,'west'],[29,6,'east'],
  [1,18,'west'],[29,18,'east'],[5,31,'south'],[25,31,'south']])pane(x,z,f);
 // Three independent roof masses, not a roof over the central sky court.
 for(let x=1;x<=29;x++)for(let z=1;z<=9;z++){
  const rise=Math.floor((14-Math.abs(x-15))/4);
  put(x,8+rise,z,'roof','live:wood','east',{roofProfile:'willowcrown-front-cross-gable',weatherApproved:false});
 }
 for(let x=1;x<=11;x++)for(let z=10;z<=23;z++)
  put(x,8+Math.floor((11-x)/5),z,'roof','live:wood','east',{roofProfile:'western-treatment-hip',weatherApproved:false});
 for(let x=19;x<=29;x++)for(let z=10;z<=23;z++)
  put(x,8+Math.floor((x-19)/5),z,'roof','live:wood','east',{roofProfile:'eastern-therapy-lean-to',weatherApproved:false});
 for(let x=1;x<=29;x++)for(let z=24;z<=31;z++){
  const rise=Math.floor(Math.min(x-1,29-x,z-24,31-z)/2);
  put(x,8+rise,z,'roof','live:stone','none',{roofProfile:'stone-rear-garden-pavilion',weatherApproved:false});
 }
 for(const [x,z,y] of [[5,5,9],[25,5,9],[5,15,9],[25,15,9],[5,28,9],[25,28,9]])
  support(x,z,y-1,'live:stone','public-pavilion-bearing-pier');
 rim(3,8,14,20,6,'live:stone','west-drained-rim');
 rim(22,27,14,20,24,'live:stone','east-drained-rim');
 for(const [x,z,p] of [[4,4,'ticket-bench'],[26,4,'towel-counter'],[14,14,'open-court-stone-seat'],
  [4,27,'herb-garden-no-harvest'],[26,27,'linen-cabinet'],[18,28,'quiet-garden-chair']])fitting(x,z,p);
 room('front-ticketing-hall',2,2,29,9);
 room('western-dry-treatment-suite',2,10,11,24);
 room('sky-open-social-terrace',12,10,19,24);
 room('eastern-private-washing',20,10,29,24);
 room('rear-garden-reception',2,25,15,31);
 room('rear-dressing-and-linen',16,25,29,31);
 portal('outside','front-ticketing-hall',15,1,'triple-wide-bath-entry');
 for(const [x,name] of [[6,'western-dry-treatment-suite'],[15,'sky-open-social-terrace'],
  [24,'eastern-private-washing']])portal('front-ticketing-hall',name,x,9);
 for(const [x,name] of [[11,'western-dry-treatment-suite'],[19,'eastern-private-washing']])
  portal(name,'sky-open-social-terrace',x,13);
 portal('sky-open-social-terrace','rear-garden-reception',15,24);
 portal('eastern-private-washing','rear-dressing-and-linen',24,24);
 portal('rear-garden-reception','rear-dressing-and-linen',15,28);
 return finish('U-shaped covered therapy wings surrounding genuine open-air courtyard, independent rear stone-garden pavilion',
  {waterOperational:false,steam:false,heatSimulation:false});
}

// DESERT LARGE BATHHOUSE: a sequence of sun-shading terraces, separated
// dry soak courts and waterless washing pavilions, with TWO open sky courts.
export function createQasrSunArcadeBath(){
 const b=sourcePlan('bathhouse','desert','large',1,'Qasr Sun-Arcade Baths',27,16,35);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,rim,finish}=b;
 floor('live:stone');wallRing(6,'live:stone');
 for(const x of [12,13,14])opening(x,1);
 wallZ(9,2,24,4,'live:stone');for(const x of [6,13,20])opening(x,9);
 wallZ(23,2,24,4,'live:stone');for(const x of [6,13,20])opening(x,23);
 wallX(9,10,22,4,'live:stone');for(const z of [13,19])opening(9,z);
 wallX(17,10,22,4,'live:stone');for(const z of [13,19])opening(17,z);
 wallX(13,24,32,4,'live:stone');opening(13,29);
 for(const [x,z,f] of [[4,1,'north'],[22,1,'north'],[1,6,'west'],[25,6,'east'],
  [1,18,'west'],[25,18,'east'],[5,33,'south'],[21,33,'south']])pane(x,z,f);
 // Full source cube terrace canopy above reception, side courts left dry and
 // exposed center, independently hipped southern court roof.
 for(let x=1;x<=25;x++)for(let z=1;z<=9;z++){
  const step=Math.floor((z-1)/4);
  put(x,7+step,z,'roof','live:stone','north',{roofProfile:'sunarcade-reception-step'});
 }
 for(let x=1;x<=9;x++)for(let z=10;z<=22;z++)
  put(x,8+Math.floor((9-x)/4),z,'roof','live:stone','east',{roofProfile:'sunarcade-west-porch'});
 for(let x=17;x<=25;x++)for(let z=10;z<=22;z++)
  put(x,8+Math.floor((x-17)/4),z,'roof','live:stone','east',{roofProfile:'sunarcade-east-porch'});
 for(let x=1;x<=25;x++)for(let z=23;z<=33;z++){
  const rise=Math.floor(Math.min(x-1,25-x,z-23,33-z)/3);
  put(x,8+rise,z,'roof','live:wood','none',{roofProfile:'south-cooling-gallery-hip'});
 }
 for(const [x,z,up] of [[4,5,7],[22,5,7],[4,15,9],[22,15,9],[4,29,9],[22,29,9]])
  support(x,z,up,'live:stone','qasr-arcade-colonnade');
 rim(3,7,13,18,5,'live:stone','waterless-west-basin');
 rim(19,23,13,18,21,'live:stone','waterless-east-basin');
 for(const [x,z,p] of [[4,4,'dry-towel-shelf'],[22,4,'sunshade-register'],
  [12,16,'sun-open-stone-concourse'],[4,28,'stone-linen-cupboard'],[22,28,'dry-laundry-tray']])fitting(x,z,p);
 room('caravan-bath-reception',2,2,25,9);
 room('west-shaded-ablution',2,10,9,23);
 room('open-central-cooling-court',10,10,17,23);
 room('east-sunbath-alcove',18,10,25,23);
 room('rear-garden-terrace',2,24,13,33);
 room('rear-linen-and-drying',14,24,25,33);
 portal('outside','caravan-bath-reception',13,1);
 for(const [x,name] of [[6,'west-shaded-ablution'],[13,'open-central-cooling-court'],
  [20,'east-sunbath-alcove']])portal('caravan-bath-reception',name,x,9);
 for(const [x,name] of [[9,'west-shaded-ablution'],[17,'east-sunbath-alcove']])
  portal(name,'open-central-cooling-court',x,13);
 portal('open-central-cooling-court','rear-garden-terrace',13,23);
 portal('east-sunbath-alcove','rear-linen-and-drying',20,23);
 portal('rear-garden-terrace','rear-linen-and-drying',13,29);
 return finish('desert sun-arcaded bath complex with pair of empty ablution rims, sky-open center and sheltered dry rear court',
  {noWaterOrSteamSimulation:true,weatherSealPending:true});
}

// SNOW LARGE BATHHOUSE: fully roofed triple treatment halls with source-real
// glazed winter clerestory for daylight, wind-lock entry and rear boiler shell.
export function createFrostspireGrandBath(){
 const b=sourcePlan('bathhouse','snow','large',1,'Frostspire Grand Winter Bathhouse',33,19,31);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,rim,finish}=b;
 floor('live:stone');wallRing(8,'live:stone');
 for(const x of [15,16,17])opening(x,1);
 wallZ(9,2,30,5,'live:stone');for(const x of [6,16,26])opening(x,9);
 wallZ(23,2,30,5,'live:stone');for(const x of [6,16,26])opening(x,23);
 wallX(12,10,22,4,'live:stone');for(const z of [13,20])opening(12,z);
 wallX(20,10,22,4,'live:stone');for(const z of [13,20])opening(20,z);
 wallX(16,24,28,4,'live:stone');opening(16,27);
 for(const [x,z,f] of [[4,1,'north'],[28,1,'north'],[1,7,'west'],[31,7,'east'],
  [1,18,'west'],[31,18,'east'],[5,29,'south'],[27,29,'south']])pane(x,z,f);
 for(let x=1;x<=31;x++)for(let z=1;z<=29;z++){
  const rise=Math.floor((15-Math.abs(x-16))/3),clerestory=x>=14&&x<=18&&z>=11&&z<=21;
  put(x,9+rise,z,'roof',clerestory?'pack4:030':'live:wood','east',
   {roofProfile:clerestory?'frostspire-winter-glass-ridge':'frostspire-high-snow-saddle',
    weatherSealApproved:false,glassLoadApproved:false});
 }
 for(const [x,z,y] of [[5,5,10],[27,5,10],[5,16,10],[27,16,10],[5,27,10],[27,27,10],
  [16,5,14],[14,26,13]])support(x,z,y-1,'live:stone','frostspire-arched-load-post');
 rim(3,8,14,20,5,'live:stone','left-empty-winter-pool-rim');
 rim(24,29,14,20,26,'live:stone','right-empty-winter-pool-rim');
 for(const [x,z,p] of [[4,4,'frost-lock-drying-bench'],[28,4,'winter-towel-cabinet'],
  [4,12,'unlit-hearth-chamber'],[28,12,'glass-thermal-window-seat'],
  [6,27,'ice-management-rack'],[26,27,'boiler-shell-no-heat']])fitting(x,z,p);
 room('insulated-snowlock-entry',2,2,31,9);
 room('west-warming-suite',2,10,12,23);
 room('glazed-central-winter-hall',13,10,20,23);
 room('east-private-wash-suite',21,10,31,23);
 room('rear-equipment-and-towels',2,24,16,29);
 room('rear-unpowered-heating-plant',17,24,31,29);
 portal('outside','insulated-snowlock-entry',16,1,'three-cell-snowlock');
 for(const [x,name] of [[6,'west-warming-suite'],[16,'glazed-central-winter-hall'],
  [26,'east-private-wash-suite']])portal('insulated-snowlock-entry',name,x,9);
 for(const [x,name] of [[12,'west-warming-suite'],[20,'east-private-wash-suite']])
  portal(name,'glazed-central-winter-hall',x,13);
 portal('glazed-central-winter-hall','rear-equipment-and-towels',16,23);
 portal('east-private-wash-suite','rear-unpowered-heating-plant',26,23);
 portal('rear-equipment-and-towels','rear-unpowered-heating-plant',16,27);
 return finish('fully covered tall winter bath with three independent treatment halls and a source-glazed raised clerestory',
  {water:false,steam:false,heating:false,glassMountApproved:false});
}

// TEMPERATE MEDIUM STABLE: six empty pen bays, tack chamber, daylit
// center aisle and a separately pitched raised clerestory monitor.
export function createThistlefordCarriageStable(){
 const b=sourcePlan('stable','temperate','medium',4,'Thistleford Six-Bay Carriage Stable',25,15,27);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,finish}=b;
 floor('live:stone');wallRing(6,'live:wood');
 for(const x of [11,12,13])opening(x,1);
 wallZ(5,2,22,4);opening(12,5);
 wallZ(22,2,22,4);opening(12,22);
 wallX(9,6,21,4);wallX(15,6,21,4);
 for(const z of [8,14,20]){opening(9,z);opening(15,z);}
 for(const z of [11,17]){wallZ(z,2,8,3);wallZ(z,16,22,3);}
 for(const [x,z,f] of [[4,1,'north'],[20,1,'north'],[1,8,'west'],[23,8,'east'],
  [1,18,'west'],[23,18,'east'],[5,25,'south'],[19,25,'south']])pane(x,z,f);
 for(let x=1;x<=23;x++)for(let z=1;z<=25;z++){
  const rise=Math.floor((11-Math.abs(x-12))/3);
  put(x,8+rise,z,'roof','live:wood','east',{roofProfile:'thistleford-hay-gable'});
 }
 // Independently supported raised roof monitor, not a floating roof stripe.
 for(const [x,z] of [[10,10],[14,10],[10,17],[14,17]])support(x,z,12,'live:wood','daylight-monitor-post');
 for(let x=10;x<=14;x++)for(let z=10;z<=17;z++){
  const rise=Math.floor((2-Math.abs(x-12))/2);
  put(x,13+rise,z,'roof','live:wood','east',{roofProfile:'thistleford-hay-monitor'});
 }
 for(const [x,z] of [[4,6],[20,6],[4,19],[20,19]]){
  const rise=Math.floor((11-Math.abs(x-12))/3);
  support(x,z,7+rise,'live:wood','side-stall-truss-pier');
 }
 for(const x of [4,20])for(const z of [8,14,20])fitting(x,z,'empty-hay-trough');
 for(const [x,z,p] of [[4,3,'carriage-strap-rack'],[20,3,'unloaded-cart-wheel'],
  [4,24,'tack-cabinet'],[20,24,'dry-horse-blanket']])fitting(x,z,p);
 room('loading-shelter',2,2,23,5);
 room('central-daylit-wagon-aisle',10,6,15,22);
 room('west-front-empty-pen',2,6,9,11);
 room('west-middle-empty-pen',2,12,9,17);
 room('west-back-empty-pen',2,18,9,22);
 room('east-front-empty-pen',16,6,23,11);
 room('east-middle-empty-pen',16,12,23,17);
 room('east-back-empty-pen',16,18,23,22);
 room('rear-tack-and-dry-gear',2,23,23,25);
 portal('outside','loading-shelter',12,1,'three-wide-carriage-door');
 portal('loading-shelter','central-daylit-wagon-aisle',12,5);
 for(const [x,z,name] of [
  [9,8,'west-front-empty-pen'],[9,14,'west-middle-empty-pen'],[9,20,'west-back-empty-pen'],
  [15,8,'east-front-empty-pen'],[15,14,'east-middle-empty-pen'],[15,20,'east-back-empty-pen']
 ])portal('central-daylit-wagon-aisle',name,x,z,'empty-stall-opening');
 portal('central-daylit-wagon-aisle','rear-tack-and-dry-gear',12,22);
 return finish('temperate six-pen carriage stable with genuinely separate loft-monitor roof, wide central daylight passage, front load and rear tack',
  {animals:0,stablingInteractions:false,monitorLoadPending:true});
}

// SNOW LARGE STABLE: eight physically empty pens, FIVE-wide snow
// evacuation aisle and rear snowdrift equipment store under a second lower roof.
export function createRidgebreakSnowRelay(){
 const b=sourcePlan('stable','snow','large',4,'Ridgebreak Snow Relay Stables',33,18,37);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,finish}=b;
 floor('live:stone');wallRing(7,'live:wood');
 for(const x of [15,16,17])opening(x,1);
 wallZ(4,2,30,5);opening(16,4);
 wallZ(29,2,30,5);opening(16,29);
 wallX(13,5,28,4);wallX(19,5,28,4);
 for(const z of [7,13,20,26]){opening(13,z);opening(19,z);}
 for(const z of [10,17,24]){wallZ(z,2,12,4);wallZ(z,20,30,4);}
 for(const [x,z,f] of [[4,1,'north'],[28,1,'north'],[1,7,'west'],[31,7,'east'],
  [1,22,'west'],[31,22,'east'],[5,35,'south'],[27,35,'south']])pane(x,z,f);
 for(let x=1;x<=31;x++)for(let z=1;z<=29;z++){
  const rise=Math.floor((15-Math.abs(x-16))/3);
  put(x,8+rise,z,'roof','live:wood','east',{roofProfile:'relay-high-snow-evacuation-gable'});
 }
 for(let x=1;x<=31;x++)for(let z=30;z<=35;z++)
  put(x,8+Math.floor((z-30)/2),z,'roof','live:stone','north',{roofProfile:'relay-rear-ice-shed'});
 for(const [x,z,up] of [[6,6,9],[26,6,9],[6,16,9],[26,16,9],[6,25,9],[26,25,9],[6,33,9],[26,33,9]])
  support(x,z,up,'live:stone','relay-snow-load-bearing-column');
 for(const x of [5,27])for(const z of [7,13,20,26])fitting(x,z,'empty-insulated-feed-bin');
 for(const [x,z,p] of [[5,3,'sled-harness-locker'],[27,3,'winter-horse-blanket'],
  [5,32,'ice-axle-repair-tools'],[27,32,'snow-clearing-gear']])fitting(x,z,p);
 room('wind-gate-foyer',2,2,31,4);
 room('central-five-wide-snow-aisle',14,5,19,29);
 for(const [side,x0,x1] of [['west',2,13],['east',20,31]]){
  for(const [n,z0,z1] of [['one',5,10],['two',11,17],['three',18,24],['four',25,29]])
   room(side+'-'+n+'-empty-pen',x0,z0,x1,z1);
 }
 room('rear-frozen-equipment-store',2,30,31,35);
 portal('outside','wind-gate-foyer',16,1,'three-cell-sled-gate');
 portal('wind-gate-foyer','central-five-wide-snow-aisle',16,4);
 for(const [name,x,z] of [
  ['west-one-empty-pen',13,7],['west-two-empty-pen',13,13],['west-three-empty-pen',13,20],['west-four-empty-pen',13,26],
  ['east-one-empty-pen',19,7],['east-two-empty-pen',19,13],['east-three-empty-pen',19,20],['east-four-empty-pen',19,26]
 ])portal('central-five-wide-snow-aisle',name,x,z,'empty-stall-ice-lane');
 portal('central-five-wide-snow-aisle','rear-frozen-equipment-store',16,29);
 return finish('snow evacuation stable: eight genuinely empty bays, separate wind-lock entrance, five-wide aisle and lower stone rear ice shed',
  {animals:0,snowMechanics:false,loadApproval:false});
}

// ENCHANTED MEDIUM STABLE: four partially open pens around a real
// internal botanical lightwell; three detached-but-contiguous roof pavilions.
export function createMosswickFernstable(){
 const b=sourcePlan('stable','enchanted-forest','medium',4,'Mosswick Lantern-Fern Stable',25,15,25);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,hip,finish}=b;
 floor('live:stone');wallRing(6,'live:wood');for(const x of [11,12,13])opening(x,1);
 wallZ(5,2,22,4);opening(12,5);
 wallZ(18,2,22,4);opening(12,18);
 wallX(9,6,17,3);wallX(15,6,17,3);
 for(const z of [8,15]){opening(9,z);opening(15,z);}
 for(const z of [12]){wallZ(z,2,8,3);wallZ(z,16,22,3);}
 wallX(12,19,22,3);for(const z of [19,21])opening(12,z);
 for(const [x,z,f] of [[4,1,'north'],[20,1,'north'],[1,9,'west'],[23,9,'east'],
  [4,23,'south'],[20,23,'south']])pane(x,z,f);
 hip(1,23,1,5,7,2,'mosswick-front-lantern-hip','live:wood');
 for(let x=1;x<=9;x++)for(let z=6;z<=17;z++)
  put(x,8+Math.floor((9-x)/4),z,'roof','live:wood','east',{roofProfile:'mosswick-forest-west-leaf-eave'});
 for(let x=15;x<=23;x++)for(let z=6;z<=17;z++)
  put(x,8+Math.floor((x-15)/4),z,'roof','live:wood','east',{roofProfile:'mosswick-forest-east-leaf-eave'});
 hip(1,23,18,23,7,2,'mosswick-rear-low-lantern-gallery','live:wood');
 for(const [x,z,up] of [[5,3,7],[19,3,7],[5,9,8],[19,9,8],[5,16,8],[19,16,8],[5,21,7],[19,21,7]])
  support(x,z,up,'live:wood','mosswick-living-wood-pier');
 for(const x of [5,19])for(const z of [8,15])fitting(x,z,'empty-fernstall-feeder');
 for(const [x,z,p] of [[6,3,'bracken-bundle-no-harvest'],[18,3,'empty-dry-feed-bin'],
  [11,10,'nonharvestable-lightwell-planter'],[6,21,'fern-woven-saddle-stand'],
  [18,21,'lantern-frame-no-light']])fitting(x,z,p);
 room('timber-reception-porch',2,2,23,5);
 room('central-sky-lantern-walk',10,6,15,18);
 room('west-front-empty-stall',2,6,9,12);
 room('west-rear-empty-stall',2,13,9,18);
 room('east-front-empty-stall',16,6,23,12);
 room('east-rear-empty-stall',16,13,23,18);
 room('rear-service-store',2,19,12,23);
 room('rear-tack-repair',13,19,23,23);
 portal('outside','timber-reception-porch',12,1);
 portal('timber-reception-porch','central-sky-lantern-walk',12,5);
 for(const [name,x,z] of [
 ['west-front-empty-stall',9,8],['west-rear-empty-stall',9,15],
 ['east-front-empty-stall',15,8],['east-rear-empty-stall',15,15]
 ])portal('central-sky-lantern-walk',name,x,z,'empty-stall-forest-arch');
 portal('central-sky-lantern-walk','rear-service-store',12,18);
 portal('rear-service-store','rear-tack-repair',12,21);
 return finish('forest fernstable with four accessible empty stalls, timber side eaves, internal open sky lightwell and separated rear tack',
  {animals:0,realLighting:false,harvesting:false});
}

// TEMPERATE LARGE FARM BARN: three front wagon gates lead to separated grain
// loading, drying, hay and rear offices around a true uncovered central airwell.
export function createMeadowspanGrainCourt(){
 const b=sourcePlan('farm-barn','temperate','large',1,'Meadowspan Triple-Gate Grain Court',31,17,35);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,hip,finish}=b;
 floor('live:stone');wallRing(7,'live:wood');
 for(const x of [7,8,9,15,16,17,23,24,25])opening(x,1);
 wallZ(10,2,28,5);for(const x of [7,16,24])opening(x,10);
 wallZ(25,2,28,4);for(const x of [7,16,24])opening(x,25);
 wallX(11,11,24,4);for(const z of [15,22])opening(11,z);
 wallX(20,11,24,4);for(const z of [15,22])opening(20,z);
 wallX(16,26,32,4);opening(16,29);
 for(const [x,z,f] of [[4,1,'north'],[27,1,'north'],[1,7,'west'],[29,7,'east'],
  [1,19,'west'],[29,19,'east'],[5,33,'south'],[26,33,'south']])pane(x,z,f);
 for(let x=1;x<=29;x++)for(let z=1;z<=10;z++){
  const rise=Math.floor((14-Math.abs(x-15))/4);
  put(x,8+rise,z,'roof','live:wood','east',{roofProfile:'meadowspan-triple-load-cross-gable'});
 }
 for(let x=1;x<=11;x++)for(let z=11;z<=24;z++)
  put(x,8+Math.floor((11-x)/4),z,'roof','live:wood','east',{roofProfile:'meadowspan-west-drying-lean-roof'});
 for(let x=20;x<=29;x++)for(let z=11;z<=24;z++)
  put(x,8+Math.floor((x-20)/4),z,'roof','live:wood','east',{roofProfile:'meadowspan-east-hay-gambrel-side'});
 hip(1,29,25,33,8,3,'meadowspan-rear-grain-administration','live:wood');
 for(const [x,z,up] of [[5,6,8],[25,6,8],[5,17,9],[25,17,9],[5,29,9],[25,29,9]])
  support(x,z,up,'live:wood','meadowspan-bearing-grain-pier');
 for(const [x,z,p] of [[4,5,'dry-grain-cart'],[26,5,'empty-sled-wagon'],[4,16,'seed-packing-sack'],
  [26,16,'hay-lift-no-mechanics'],[16,16,'open-court-counting-plinth'],
  [4,29,'account-ledger-shelf'],[26,29,'harvest-roping-tools']])fitting(x,z,p);
 room('three-wide-wagon-reception',2,2,29,10);
 room('west-seed-drying-hall',2,11,11,25);
 room('open-air-grain-aeration-court',12,11,20,25);
 room('east-hay-and-cart-hall',21,11,29,25);
 room('rear-grain-records-office',2,26,16,33);
 room('rear-tackle-workroom',17,26,29,33);
 for(const x of [8,16,24])portal('outside','three-wide-wagon-reception',x,1,'independent-cart-door');
 for(const [x,name] of [[7,'west-seed-drying-hall'],[16,'open-air-grain-aeration-court'],
  [24,'east-hay-and-cart-hall']])portal('three-wide-wagon-reception',name,x,10);
 portal('west-seed-drying-hall','open-air-grain-aeration-court',11,15);
 portal('open-air-grain-aeration-court','east-hay-and-cart-hall',20,15);
 portal('open-air-grain-aeration-court','rear-grain-records-office',16,25);
 portal('east-hay-and-cart-hall','rear-tackle-workroom',24,25);
 portal('rear-grain-records-office','rear-tackle-workroom',16,29);
 return finish('triple front wagon gate, open central grain court, lateral high pitched drying/hay wings and split rear service',
  {grainGameplay:false,harvesting:false,hayPulley:false});
}

// DESERT MEDIUM FARM BARN: a ventilated grain/salt drying hall with a roofless
// central threshing pad, two enclosed side porticos and a rear cart workshop.
export function createSaltwindThreshingStore(){
 const b=sourcePlan('farm-barn','desert','medium',1,'Saltwind Courtyard Threshing Store',25,15,29);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,hip,finish}=b;
 floor('live:stone');wallRing(6,'live:stone');for(const x of [11,12,13])opening(x,1);
 wallZ(9,2,22,4,'live:stone');for(const x of [5,12,19])opening(x,9);
 wallZ(21,2,22,4,'live:stone');for(const x of [5,12,19])opening(x,21);
 wallX(9,10,20,4,'live:stone');for(const z of [13,18])opening(9,z);
 wallX(15,10,20,4,'live:stone');for(const z of [13,18])opening(15,z);
 wallX(12,22,26,3,'live:stone');opening(12,25);
 for(const [x,z,f] of [[4,1,'north'],[20,1,'north'],[1,6,'west'],[23,6,'east'],
  [1,17,'west'],[23,17,'east'],[4,27,'south'],[20,27,'south']])pane(x,z,f);
 for(let x=1;x<=23;x++)for(let z=1;z<=9;z++)
  put(x,7+Math.floor((z-1)/4),z,'roof','live:stone','north',
   {roofProfile:'saltwind-south-facing-terrace-canopy'});
 for(let x=1;x<=9;x++)for(let z=10;z<=20;z++)
  put(x,8+Math.floor((9-x)/4),z,'roof','live:stone','east',{roofProfile:'saltwind-west-storage-canopy'});
 for(let x=15;x<=23;x++)for(let z=10;z<=20;z++)
  put(x,8+Math.floor((x-15)/4),z,'roof','live:stone','east',{roofProfile:'saltwind-east-packing-canopy'});
 hip(1,23,21,27,8,3,'saltwind-rear-cart-workshop-hip','live:wood');
 for(const [x,z,up] of [[4,5,7],[20,5,7],[4,15,9],[20,15,9],[4,25,8],[20,25,8]])
  support(x,z,up,'live:stone','saltwind-raised-roof-arcade');
 for(const [x,z,p] of [[4,4,'sun-dried-grain-tray'],[20,4,'unused-wagon-hitch'],
  [4,13,'dry-salt-grain-crate'],[20,13,'packing-table-no-crafting'],
  [11,15,'uncovered-threshing-stone'],[5,25,'empty-barrel'],[19,25,'repair-desk']])fitting(x,z,p);
 room('open-cart-receiving',2,2,23,9);
 room('west-grain-drying-vault',2,10,9,21);
 room('unroofed-threshing-pad',10,10,15,21);
 room('east-salt-packing-vault',16,10,23,21);
 room('rear-wagon-gear-room',2,22,12,27);
 room('rear-repair-bay',13,22,23,27);
 portal('outside','open-cart-receiving',12,1,'three-cell-travel-wagon-entrance');
 for(const [x,name] of [[5,'west-grain-drying-vault'],[12,'unroofed-threshing-pad'],[19,'east-salt-packing-vault']])
  portal('open-cart-receiving',name,x,9);
 portal('west-grain-drying-vault','unroofed-threshing-pad',9,13);
 portal('unroofed-threshing-pad','east-salt-packing-vault',15,13);
 portal('unroofed-threshing-pad','rear-wagon-gear-room',12,21);
 portal('east-salt-packing-vault','rear-repair-bay',19,21);
 portal('rear-wagon-gear-room','rear-repair-bay',12,25);
 return finish('desert open threshing-pad barn with three deliberately distinct covered ranges and rear cart gear store',
  {workingHarvester:false,grainMechanics:false});
}

// SNOW MEDIUM FARM BARN: roofed ice windlock and two separate dry
// grain/machine-free lumber bays; real timber roof supports and lower porch.
export function createFircrestSledBarn(){
 const b=sourcePlan('farm-barn','snow','medium',1,'Fircrest Raised-Ridge Sled Barn',25,17,29);
 const {put,opening,floor,wallRing,wallZ,wallX,pane,fitting,room,portal,support,finish}=b;
 floor('live:stone');wallRing(7,'live:stone');for(const x of [11,12,13])opening(x,1);
 wallZ(10,2,22,5,'live:stone');for(const x of [6,12,18])opening(x,10);
 wallZ(20,2,22,5,'live:stone');for(const x of [6,12,18])opening(x,20);
 wallX(12,11,19,4,'live:stone');for(const z of [13,17,19])opening(12,z);
 wallX(12,21,26,4,'live:stone');opening(12,24);
 for(const [x,z,f] of [[4,1,'north'],[20,1,'north'],[1,7,'west'],[23,7,'east'],
  [1,17,'west'],[23,17,'east'],[5,27,'south'],[19,27,'south']])pane(x,z,f);
 for(let x=1;x<=23;x++)for(let z=1;z<=27;z++){
  const rise=Math.floor((11-Math.abs(x-12))/3);
  put(x,8+rise,z,'roof','live:wood','east',{roofProfile:'fircrest-windbreak-long-snow-ridge'});
 }
 // Genuine front lowered snowdrift vestibule overhang, wholly in source
 // coordinates, with separate full-cell posts at the origin-side porch.
 for(let x=9;x<=15;x++)for(const z of [0])
  put(x,6,z,'roof','live:wood','none',{roofProfile:'fircrest-lower-sled-porch',cantileverLoadApproved:false});
 // The one-cell porch eave is a dry cantilever off the standing front wall at z=1;
 // freestanding posts at z=0 would isolate exterior walking strips.
 for(const [x,z,up] of [[5,5,9],[19,5,9],[5,15,9],[19,15,9],[5,25,9],[19,25,9]])
  support(x,z,up,'live:stone','fircrest-long-roof-bearing-pier');
 for(const [x,z,p] of [[4,4,'snow-sled-winch-no-physics'],[20,4,'winter-grain-sack'],
  [4,14,'loose-snow-rope'],[20,14,'empty-lumber-staging-crate'],
  [5,24,'cold-spare-tools'],[19,24,'nonmechanical-grain-cabinet']])fitting(x,z,p);
 room('sled-windbreak-unloading',2,2,23,10);
 room('left-winter-grain-store',2,11,12,20);
 room('right-dry-lumber-store',13,11,23,20);
 room('rear-logistics-and-grain',2,21,12,27);
 room('rear-insulated-tool-closet',13,21,23,27);
 portal('outside','sled-windbreak-unloading',12,1,'three-wide-sled-gate');
 for(const [x,name] of [[6,'left-winter-grain-store'],[18,'right-dry-lumber-store']])
  portal('sled-windbreak-unloading',name,x,10);
 portal('left-winter-grain-store','right-dry-lumber-store',12,13);
 portal('left-winter-grain-store','rear-logistics-and-grain',6,20);
 portal('right-dry-lumber-store','rear-insulated-tool-closet',18,20);
 portal('rear-logistics-and-grain','rear-insulated-tool-closet',12,24);
 return finish('snow survival grain barn with lower snow porch, high sloped wood roof, isolated grain/lumber bays and tool store',
  {movingWinch:false,harvesting:false,liveAnimalCount:0});
}

export function getM2Diverse1BPlans(){
 return [createWillowCrownBathTerrace(),createQasrSunArcadeBath(),createFrostspireGrandBath(),
  createThistlefordCarriageStable(),createRidgebreakSnowRelay(),createMosswickFernstable(),
  createMeadowspanGrainCourt(),createSaltwindThreshingStore(),createFircrestSledBarn()];
}
