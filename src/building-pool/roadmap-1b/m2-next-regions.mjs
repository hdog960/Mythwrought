// Mythwrought Builder 1B / M2d: nine original fixed-coordinate community buildings.
// Draft blueprints only: no runtime, world writes, saves, Pack registration or placement.
// Every design authors its own perimeter/circulation/roof topology, not rotation or reskin.
import {sourcePlan} from './m2-community-structures.mjs';

// Source-cell bearing is computed against ACTUALLY authored roof coordinates.
// Fails closed instead of inventing support for floating gables.
function drafting(b){
 const top=new Map(),key=(x,z)=>x+','+z;
 const roof=(x,y,z,profile,material='live:wood',extra={})=>{
  b.put(x,y,z,'roof',material,'none',{roofProfile:profile,weatherApproval:false,...extra});
  if(top.has(key(x,z)))throw Error('M2d overlapping roof planes '+key(x,z));
  top.set(key(x,z),y);
 };
 const post=(x,z,purpose,material='live:wood')=>{
  const h=top.get(key(x,z));if(!h||h<2)throw Error('M2d unsupported roofing '+key(x,z));
  b.support(x,z,h-1,material,purpose);
 };
 const glazes=entries=>{for(const [x,z,d] of entries)b.pane(x,z,d);};
 return {roof,post,glazes};
}

// Enchanted SMALL baths: a clear CENTRAL covered procession but TWO tiny
// freestanding, uncovered basins; asymmetric crescent side arbor and low service.
export function moonfernPocketBath(){
 const b=sourcePlan('bathhouse','enchanted-forest','small',1,'Moonfern Pocket Bath Grove',17,13,21);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(5,'live:wood');
 b.opening(8,1);b.wallZ(6,2,14,4);for(const x of [4,8,12])b.opening(x,6);
 b.wallX(6,7,14,3);for(const z of [8,12])b.opening(6,z);
 b.wallX(11,7,14,3);for(const z of [8,12])b.opening(11,z);
 b.wallZ(15,2,14,3);for(const x of [4,8,12])b.opening(x,15);
 glazes([[3,1,'north'],[13,1,'north'],[1,4,'west'],[15,4,'east'],[3,19,'south'],[13,19,'south']]);
 // Long front lantern roof, bowed outer garden side eaves, low service tail.
 for(let x=1;x<=15;x++)for(let z=1;z<=6;z++)
  roof(x,6+Math.floor(Math.min(x-1,15-x)/3),z,'moonfern-lantern-entry');
 for(let x=1;x<=5;x++)for(let z=7;z<=14;z++)
  roof(x,6+Math.floor((5-x)/2),z,'moonfern-west-bowed-arbor');
 for(let x=12;x<=15;x++)for(let z=7;z<=14;z++)
  roof(x,6+Math.floor((x-12)/2),z,'moonfern-east-bowed-arbor');
 for(let x=1;x<=15;x++)for(let z=15;z<=19;z++)
  roof(x,6+Math.floor(Math.min(z-15,19-z)/2),z,'moonfern-low-service-pavilion');
 for(const [x,z] of [[3,4],[13,4],[3,11],[13,11],[4,17],[12,17]])
  post(x,z,'moonfern-grove-pier');
 b.rim(2,5,9,12,3,'live:stone','west-unfilled-moon-basin');
 b.rim(12,14,9,12,13,'live:stone','east-unfilled-moon-basin');
 for(const [x,z,p] of [[4,3,'cloak-shelf'],[12,3,'plant-cordage-seat'],[7,11,'dry-stone-walk'],
  [4,18,'herbal-towel-box'],[12,18,'dry-soap-cache']])b.fitting(x,z,p);
 b.room('lantern-changing-porch',2,2,15,6);
 b.room('west-botanical-bathing-alcove',2,7,6,15);
 b.room('middle-open-moon-court',7,7,11,15);
 b.room('east-botanical-bathing-alcove',12,7,15,15);
 b.room('dry-service-shelter',2,16,15,19);
 b.portal('outside','lantern-changing-porch',8,1);
 for(const [x,n] of [[4,'west-botanical-bathing-alcove'],[8,'middle-open-moon-court'],
  [12,'east-botanical-bathing-alcove']])b.portal('lantern-changing-porch',n,x,6);
 b.portal('west-botanical-bathing-alcove','middle-open-moon-court',6,8);
 b.portal('middle-open-moon-court','east-botanical-bathing-alcove',11,8);
 b.portal('middle-open-moon-court','dry-service-shelter',8,15);
 return b.finish('compact original pocket grove with three converging walkways, uncovered paired empty basins and curved-height arbor roof', {waterPhysics:false,harvest:false,heating:false});
}

// Enchanted LARGE baths: open axial garden from reception to rear, 2 enclosed
// baths in E/W wings, THREE independent pagoda-height timber roof masses.
export function elderwillowCanopyBath(){
 const b=sourcePlan('bathhouse','enchanted-forest','large',1,'Elderwillow Three-Crown Bath Sanctuary',31,18,35);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(7,'live:wood');
 for(const x of [14,15,16])b.opening(x,1);
 b.wallZ(8,2,28,5);for(const x of [7,15,23])b.opening(x,8);
 b.wallZ(25,2,28,4);for(const x of [7,15,23])b.opening(x,25);
 b.wallX(11,9,24,4);for(const z of [12,20])b.opening(11,z);
 b.wallX(20,9,24,4);for(const z of [12,20])b.opening(20,z);
 b.wallX(15,26,32,3);for(const z of [28,31])b.opening(15,z);
 glazes([[4,1,'north'],[26,1,'north'],[1,7,'west'],[29,7,'east'],[1,19,'west'],
  [29,19,'east'],[5,33,'south'],[26,33,'south']]);
 for(let x=1;x<=29;x++)for(let z=1;z<=8;z++)
  roof(x,8+Math.floor(Math.min(x-1,29-x,z-1,8-z)/2),z,'elderwillow-forward-pagoda');
 for(let x=1;x<=11;x++)for(let z=9;z<=24;z++)
  roof(x,8+Math.floor(Math.min(x-1,11-x,z-9,24-z)/3),z,'elderwillow-west-arched-canopy');
 for(let x=20;x<=29;x++)for(let z=9;z<=24;z++)
  roof(x,8+Math.floor(Math.min(x-20,29-x,z-9,24-z)/3),z,'elderwillow-east-cascade-canopy');
 for(let x=1;x<=29;x++)for(let z=25;z<=33;z++)
  roof(x,8+Math.floor(Math.min(x-1,29-x,z-25,33-z)/3),z,'elderwillow-rear-ceremonial-portico');
 for(const [x,z] of [[4,4],[26,4],[4,16],[26,16],[4,29],[26,29]])
  post(x,z,'elderwillow-wood-bearing-column');
 b.rim(3,9,13,18,6,'live:stone','west-stone-empty-therapy-rim');
 b.rim(22,28,13,18,25,'live:stone','east-stone-empty-therapy-rim');
 for(const [x,z,p] of [[5,4,'visitor-garment-shelf'],[25,4,'linen-counter'],[15,14,'dry-center-slab'],
  [5,29,'flower-drying-shelf-no-harvest'],[25,29,'silent-sitting-stone']])b.fitting(x,z,p);
 b.room('forward-pagoda-lobby',2,2,29,8);
 b.room('west-therapy-pavilion',2,9,11,25);
 b.room('central-sky-garden-procession',12,9,20,25);
 b.room('east-therapy-pavilion',21,9,29,25);
 b.room('rear-quiet-pavilion',2,26,15,33);
 b.room('rear-dressing-vault',16,26,29,33);
 b.portal('outside','forward-pagoda-lobby',15,1,'triple-wood-entry');
 for(const [x,n] of [[7,'west-therapy-pavilion'],[15,'central-sky-garden-procession'],
  [23,'east-therapy-pavilion']])b.portal('forward-pagoda-lobby',n,x,8);
 for(const [x,n] of [[11,'west-therapy-pavilion'],[20,'east-therapy-pavilion']])
  b.portal(n,'central-sky-garden-procession',x,12);
 b.portal('central-sky-garden-procession','rear-quiet-pavilion',15,25);
 b.portal('east-therapy-pavilion','rear-dressing-vault',23,25);
 b.portal('rear-quiet-pavilion','rear-dressing-vault',15,28);
 return b.finish('grand enchanted pagoda bath with four separately peaked canopy spans around sky-open central procession', {actualWater:false,biomeMagic:false});
}

// MOUNTAIN SMALL baths: real uphill retaining roof, split stone warm/cold
// chambers and a covered switchback front porch, no imaginary functioning heat.
export function screeledgeStoneBath(){
 const b=sourcePlan('bathhouse','mountain','small',1,'Screeledge Switchback Stone Baths',19,15,23);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(7,'live:stone');
 for(const x of [8,9,10])b.opening(x,1);
 b.wallZ(8,2,16,4,'live:stone');for(const x of [5,9,13])b.opening(x,8);
 b.wallX(9,9,20,4,'live:stone');for(const z of [12,18])b.opening(9,z);
 b.wallZ(17,2,8,3,'live:stone');b.opening(5,17);
 glazes([[3,1,'north'],[15,1,'north'],[1,6,'west'],[17,6,'east'],
  [1,15,'west'],[17,15,'east'],[4,21,'south'],[14,21,'south']]);
 // Big slope-backed roof and lower stone entrance awning form unusual stepped silhouette.
 for(let x=1;x<=17;x++)for(let z=1;z<=21;z++)
  roof(x,8+Math.floor((z-1)/3),z,'screeledge-uphill-retaining-shed','live:stone');
 for(let x=7;x<=11;x++)roof(x,6,0,'screeledge-entrance-outcrop','live:stone',{cantileverApproval:false});
 for(const [x,z] of [[4,4],[14,4],[4,15],[14,12],[4,20],[14,20]])
  post(x,z,'screeledge-retaining-stone-pier','live:stone');
 b.rim(3,7,11,14,5,'live:stone','lower-unfilled-healing-rim');
 b.rim(12,15,16,19,14,'live:stone','upper-empty-cliff-bath');
 for(const [x,z,p] of [[5,4,'stone-change-bench'],[13,4,'travel-gear-locker'],
  [4,19,'unlit-heating-stone'],[15,20,'spare-blanket-stow']])b.fitting(x,z,p);
 b.room('stone-switchback-entry',2,2,17,8);
 b.room('west-lower-bath',2,9,9,21);
 b.room('east-dry-therapy',10,9,17,21);
 b.portal('outside','stone-switchback-entry',9,1,'three-cell-stone-door');
 b.portal('stone-switchback-entry','west-lower-bath',5,8);
 b.portal('stone-switchback-entry','east-dry-therapy',13,8);
 b.portal('west-lower-bath','east-dry-therapy',9,12);
 b.portal('west-lower-bath','east-dry-therapy',9,18);
 return b.finish('small mountain retaining-slope bath with front stone overhang, split empty pools and two parallel walk-throughs', {steam:false,realCliffPath:false,heating:false});
}

// TEMPERATE SMALL stable: split four EMPTY stalls; central two-wide
// loading lane with mini side loft monitor and separately roofed rear tack.
export function ashgroveQuarterStable(){
 const b=sourcePlan('stable','temperate','small',4,'Ashgrove Four-Quarter Village Stable',19,14,23);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(6,'live:wood');
 for(const x of [8,9,10])b.opening(x,1);
 b.wallX(7,3,17,4);b.wallX(12,3,17,4);
 for(const z of [6,14]){b.opening(7,z);b.opening(12,z);}
 for(const z of [10]){b.wallZ(z,2,6,4);b.wallZ(z,13,16,4);}
 b.wallZ(18,2,16,4);b.opening(9,18);
 glazes([[3,1,'north'],[15,1,'north'],[1,8,'west'],[17,8,'east'],
  [1,17,'west'],[17,17,'east'],[4,21,'south'],[14,21,'south']]);
 for(let x=1;x<=17;x++)for(let z=1;z<=18;z++)
  roof(x,7+Math.floor((8-Math.abs(x-9))/3),z,'ashgrove-compact-hay-gable');
 for(let x=1;x<=17;x++)for(let z=19;z<=21;z++)
  roof(x,7+Math.floor((z-19)/2),z,'ashgrove-gear-shed');
 for(let x=8;x<=10;x++)for(let z=7;z<=11;z++)
  b.put(x,11,z,'roof','live:wood','none',{roofProfile:'ashgrove-raised-central-vent-monitor',sourceLoadApproval:false});
 for(const x of [8,10])for(const z of [8,10])b.put(x,10,z,'support','live:wood','none',{purpose:'ashgrove-monitor-on-gable-riser',loadApproved:false});
 for(const [x,z] of [[4,5],[14,5],[4,13],[14,13],[4,20],[14,20]])
  post(x,z,'ashgrove-stall-gable-post');
 for(const x of [5,15])for(const z of [5,14])b.fitting(x,z,'empty-stall-feed-rack');
 b.fitting(6,19,'dry-saddle-trunk');b.fitting(12,19,'empty-carriage-bucket');
 b.room('central-two-wide-carriage-lane',8,2,12,18);
 for(const [side,x0,x1] of [['west',2,7],['east',13,17]])for(const [tier,z0,z1] of [['forward',3,10],['rear',11,18]])
  b.room(side+'-'+tier+'-empty-stall',x0,z0,x1,z1);
 b.room('covered-rear-tack-room',2,19,17,21);
 b.portal('outside','central-two-wide-carriage-lane',9,1,'three-cell-cart-gate');
 for(const [name,x,z] of [['west-forward-empty-stall',7,6],['west-rear-empty-stall',7,14],
  ['east-forward-empty-stall',12,6],['east-rear-empty-stall',12,14]])
  b.portal('central-two-wide-carriage-lane',name,x,z,'empty-stall-access');
 b.portal('central-two-wide-carriage-lane','covered-rear-tack-room',9,18);
 return b.finish('compact quarter-stall village structure with independent tack shed and central raised drying monitor', {animals:0,hayProcessing:false});
}

// DESERT MEDIUM stable: six EMPTY independent caravan boxes plus shaded
// court and crossed side grain corridors. Two parallel roof wings are unequal.
export function suntrailSixBayStable(){
 const b=sourcePlan('stable','desert','medium',4,'Suntrail Six-Bay Caravan Outpost',25,15,29);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(6,'live:stone');
 for(const x of [11,12,13])b.opening(x,1);
 b.wallX(9,3,22,4,'live:stone');b.wallX(15,3,22,4,'live:stone');
 for(const z of [5,12,19]){b.opening(9,z);b.opening(15,z);}
 for(const z of [8,16]){b.wallZ(z,2,8,3,'live:wood');b.wallZ(z,16,22,3,'live:wood');}
 b.wallZ(23,2,22,4,'live:stone');b.opening(12,23);
 glazes([[4,1,'north'],[20,1,'north'],[1,7,'west'],[23,7,'east'],
  [1,19,'west'],[23,19,'east'],[4,27,'south'],[20,27,'south']]);
 for(let x=1;x<=9;x++)for(let z=1;z<=23;z++)
  roof(x,7+Math.floor((9-x)/4),z,'suntrail-west-deep-sand-arcade','live:stone');
 for(let x=15;x<=23;x++)for(let z=1;z<=23;z++)
  roof(x,7+Math.floor((x-15)/4),z,'suntrail-east-raised-palm-arcade','live:stone');
 for(let x=10;x<=14;x++)for(let z=1;z<=6;z++)
  roof(x,7+Math.floor((z-1)/5),z,'suntrail-central-welcome-lintel');
 for(let x=1;x<=23;x++)for(let z=24;z<=27;z++)
  roof(x,7+Math.floor((z-24)/2),z,'suntrail-rear-gear-sunshade');
 for(const [x,z] of [[4,4],[20,4],[4,13],[20,13],[4,20],[20,20],[4,25],[20,25]])
  post(x,z,'suntrail-load-bearing-arcade');
 for(const x of [5,20])for(const z of [5,12,19])b.fitting(x,z,'empty-caravan-feed-rim');
 b.fitting(4,26,'dry-grooming-rope');b.fitting(21,26,'saddle-storage-stand');
 b.room('center-shaded-loading-road',10,2,15,23);
 for(const [side,x0,x1] of [['west',2,9],['east',16,23]])for(const [tier,z0,z1] of [['north',3,8],['center',9,16],['south',17,23]])
  b.room(side+'-'+tier+'-empty-caravan-bay',x0,z0,x1,z1);
 b.room('rear-gear-and-waterless-feed',2,24,23,27);
 b.portal('outside','center-shaded-loading-road',12,1,'three-cell-wagon-entry');
 for(const [name,x,z] of [['west-north-empty-caravan-bay',9,5],['west-center-empty-caravan-bay',9,12],['west-south-empty-caravan-bay',9,19],
  ['east-north-empty-caravan-bay',15,5],['east-center-empty-caravan-bay',15,12],['east-south-empty-caravan-bay',15,19]])
  b.portal('center-shaded-loading-road',name,x,z,'open-empty-stall-arcade');
 b.portal('center-shaded-loading-road','rear-gear-and-waterless-feed',12,23);
 return b.finish('two uneven shaded canopies flank a wide open central caravan road with six physically fenced empty bays', {animals:0,waterWorking:false});
}

// MOUNTAIN SMALL stable: physically separate four EMPTY cliffside pens with
// an uphill roof and dry windlock; no livestock/gear traversal implementation.
export function cragpostStoneStable(){
 const b=sourcePlan('stable','mountain','small',4,'Cragpost Cliff-Edge Pack Stable',19,15,25);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(7,'live:stone');
 for(const x of [8,9,10])b.opening(x,1);
 b.wallZ(5,2,16,4,'live:stone');b.opening(9,5);
 b.wallX(7,6,19,4,'live:stone');b.wallX(12,6,19,4,'live:stone');
 for(const z of [8,16]){b.opening(7,z);b.opening(12,z);}
 for(const z of [12]){b.wallZ(z,2,6,4,'live:wood');b.wallZ(z,13,16,4,'live:wood');}
 b.wallZ(20,2,16,4,'live:stone');b.opening(9,20);
 glazes([[3,1,'north'],[15,1,'north'],[1,8,'west'],[17,8,'east'],
  [1,18,'west'],[17,18,'east'],[4,23,'south'],[14,23,'south']]);
 // Two roof heights: supported uphill stone shed and lower tack lean-to.
 for(let x=1;x<=17;x++)for(let z=1;z<=20;z++)
  roof(x,8+Math.floor((z-1)/4),z,'cragpost-rising-stone-terrace','live:stone');
 for(let x=1;x<=17;x++)for(let z=21;z<=23;z++)
  roof(x,8+Math.floor((z-21)/2),z,'cragpost-lower-rear-tack-roof','live:wood');
 for(const [x,z] of [[4,4],[14,4],[4,9],[14,9],[4,17],[14,17],[4,22],[14,22]])
  post(x,z,'cragpost-stone-bearing-buttress','live:stone');
 for(const x of [4,15])for(const z of [8,16])b.fitting(x,z,'empty-cliffside-stall-rack');
 b.fitting(5,22,'winter-saddle-cabinet');b.fitting(15,22,'rope-fastener-box');
 b.room('mountain-windlock-loading',2,2,17,5);
 b.room('stone-central-porter-aisle',8,6,12,20);
 for(const [side,x0,x1] of [['west',2,7],['east',13,17]])for(const [tier,z0,z1] of [['upper',6,12],['lower',13,20]])
  b.room(side+'-'+tier+'-empty-shelter',x0,z0,x1,z1);
 b.room('rear-repair-shelf',2,21,17,23);
 b.portal('outside','mountain-windlock-loading',9,1);
 b.portal('mountain-windlock-loading','stone-central-porter-aisle',9,5);
 for(const [name,x,z] of [['west-upper-empty-shelter',7,8],['west-lower-empty-shelter',7,16],
  ['east-upper-empty-shelter',12,8],['east-lower-empty-shelter',12,16]])
  b.portal('stone-central-porter-aisle',name,x,z,'stone-empty-stall-opening');
 b.portal('stone-central-porter-aisle','rear-repair-shelf',9,20);
 return b.finish('small mountain retaining stable with true stone lower-to-upper roof ascent and four empty load-bays', {animals:0,roadSlopeEnginePending:true});
}

// DESERT SMALL barn: genuine central open-air threshing pad and two tiny
// covered grain alcoves under separately sloped dry stone sunshades.
export function datewindOasisBarn(){
 const b=sourcePlan('farm-barn','desert','small',1,'Datewind Oasis Grain Shelter',19,13,23);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(5,'live:stone');
 for(const x of [8,9,10])b.opening(x,1);
 b.wallZ(7,2,16,4,'live:stone');for(const x of [5,9,13])b.opening(x,7);
 b.wallX(7,8,17,3,'live:stone');b.wallX(12,8,17,3,'live:stone');
 for(const z of [10,15]){b.opening(7,z);b.opening(12,z);}
 b.wallZ(18,2,16,3,'live:stone');for(const x of [5,9,13])b.opening(x,18);
 glazes([[3,1,'north'],[15,1,'north'],[1,5,'west'],[17,5,'east'],
  [1,13,'west'],[17,13,'east'],[4,21,'south'],[14,21,'south']]);
 for(let x=1;x<=17;x++)for(let z=1;z<=7;z++)
  roof(x,6+Math.floor((z-1)/3),z,'datewind-forward-receiving-sunshade','live:stone');
 for(let x=1;x<=7;x++)for(let z=8;z<=17;z++)
  roof(x,7+Math.floor((7-x)/3),z,'datewind-west-grain-porch','live:stone');
 for(let x=12;x<=17;x++)for(let z=8;z<=17;z++)
  roof(x,7+Math.floor((x-12)/3),z,'datewind-east-saltstore-porch','live:stone');
 for(let x=1;x<=17;x++)for(let z=18;z<=21;z++)
  roof(x,7+Math.floor((z-18)/3),z,'datewind-rear-gear-service');
 for(const [x,z] of [[4,4],[14,4],[4,12],[14,12],[4,20],[14,20]])
  post(x,z,'datewind-open-threshing-pier','live:stone');
 for(const [x,z,p] of [[4,3,'date-grain-crate'],[14,3,'empty-cart-rack'],
  [4,10,'unharvested-grain-tray'],[14,10,'dry-salt-container'],
  [9,14,'empty-threshing-stone'],[5,20,'repair-gear-stand'],[13,20,'tied-dry-bundle']])b.fitting(x,z,p);
 b.room('shaded-cart-receiving',2,2,17,7);
 b.room('west-dry-grain-porch',2,8,7,18);
 b.room('roofless-central-threshing-pad',8,8,12,18);
 b.room('east-salt-boxes',13,8,17,18);
 b.room('rear-tool-cupboard',2,19,17,21);
 b.portal('outside','shaded-cart-receiving',9,1,'three-wide-dry-cart-gate');
 for(const [x,n] of [[5,'west-dry-grain-porch'],[9,'roofless-central-threshing-pad'],[13,'east-salt-boxes']])
  b.portal('shaded-cart-receiving',n,x,7);
 b.portal('west-dry-grain-porch','roofless-central-threshing-pad',7,10);
 b.portal('roofless-central-threshing-pad','east-salt-boxes',12,10);
 b.portal('roofless-central-threshing-pad','rear-tool-cupboard',9,18);
 return b.finish('small oasis barn with physically open crop-processing court and dissimilar sandstone side sunshades', {harvest:false,crafting:false,irrigation:false});
}

// SNOW LARGE barn: a fully COVERED long grain depot, several actual
// partitioned sled bays and a raised clerestory day-light roof monitor.
export function whitebarrowSnowGranary(){
 const b=sourcePlan('farm-barn','snow','large',1,'Whitebarrow Deep-Winter Granary',31,18,35);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(7,'live:stone');
 for(const x of [7,8,9,14,15,16,22,23,24])b.opening(x,1);
 b.wallZ(10,2,28,5,'live:stone');for(const x of [7,15,23])b.opening(x,10);
 b.wallZ(25,2,28,4,'live:stone');for(const x of [7,15,23])b.opening(x,25);
 b.wallX(11,11,24,4,'live:stone');for(const z of [14,21])b.opening(11,z);
 b.wallX(19,11,24,4,'live:stone');for(const z of [14,21])b.opening(19,z);
 b.wallX(15,26,32,4,'live:stone');for(const z of [29,32])b.opening(15,z);
 glazes([[4,1,'north'],[26,1,'north'],[1,7,'west'],[29,7,'east'],
  [1,19,'west'],[29,19,'east'],[5,33,'south'],[25,33,'south']]);
 // Big snow profile spans every full-cell roof coordinate; offset one-plane
 // raised lantern monitor is explicitly placed above the ridge, not a stripe.
 for(let x=1;x<=29;x++)for(let z=1;z<=33;z++)
  roof(x,8+Math.floor((14-Math.abs(x-15))/3),z,'whitebarrow-high-snow-ridge');
 // True separate forward snow-break and clerestory, avoiding overlapping XY cells.
 for(let x=12;x<=18;x++)for(let z=12;z<=22;z++)
  b.put(x,14+Math.floor((3-Math.abs(x-15))/2),z,'roof','live:wood','none',
   {roofProfile:'whitebarrow-roof-light-monitor',sourceLoadApproval:false});
 for(const [x,z] of [[4,5],[26,5],[4,16],[26,16],[4,29],[26,29]])
  post(x,z,'whitebarrow-snow-foundation-pier','live:stone');
 for(const x of [13,17])for(const z of [14,20])
  b.put(x,13,z,'support','live:wood','none',{purpose:'whitebarrow-raised-lantern-riser',loadApproved:false});
 for(const [x,z,p] of [[4,4,'sled-harness-stand'],[26,4,'unloaded-grain-wagon'],
  [4,14,'winter-grain-chest'],[26,14,'snow-lumber-rack'],
  [4,21,'equipment-shelving'],[26,21,'dry-wool-bundle'],
  [5,29,'dry-miller-ledger'],[25,29,'sled-ice-shovel']])b.fitting(x,z,p);
 b.room('triple-sled-unload-gallery',2,2,29,10);
 b.room('west-grain-cold-vault',2,11,11,25);
 b.room('high-daylight-logistics-hall',12,11,19,25);
 b.room('east-sled-maintenance',20,11,29,25);
 b.room('rear-sealed-grain-bay',2,26,15,33);
 b.room('rear-snow-repair-room',16,26,29,33);
 for(const x of [8,15,23])b.portal('outside','triple-sled-unload-gallery',x,1,'triple-separated-sled-doors');
 for(const [x,n] of [[7,'west-grain-cold-vault'],[15,'high-daylight-logistics-hall'],
  [23,'east-sled-maintenance']])b.portal('triple-sled-unload-gallery',n,x,10);
 b.portal('west-grain-cold-vault','high-daylight-logistics-hall',11,14);
 b.portal('high-daylight-logistics-hall','east-sled-maintenance',19,14);
 b.portal('high-daylight-logistics-hall','rear-sealed-grain-bay',15,25);
 b.portal('east-sled-maintenance','rear-snow-repair-room',23,25);
 b.portal('rear-sealed-grain-bay','rear-snow-repair-room',15,29);
 return b.finish('large roof-enclosed long snow granary with three wide separate loading doors, daylight monitor and six service zones', {lumberTransport:false,workingMechanics:false,roofMonitorLoadApproved:false});
}

// FOREST SMALL barn: zig-zag drying route through two covered material
// stores, rear open yard and a split wood/pitched weather canopy.
export function fernhookCuringBarn(){
 const b=sourcePlan('farm-barn','enchanted-forest','small',1,'Fernhook Coppice Drying Barn',19,14,25);
 const {roof,post,glazes}=drafting(b);
 b.floor('live:stone');b.wallRing(6,'live:wood');
 for(const x of [8,9,10])b.opening(x,1);
 b.wallZ(8,2,16,4,'live:wood');for(const x of [5,9,13])b.opening(x,8);
 b.wallX(9,9,19,4,'live:wood');for(const z of [12,18])b.opening(9,z);
 b.wallZ(20,2,16,4,'live:wood');for(const x of [5,9,13])b.opening(x,20);
 glazes([[3,1,'north'],[15,1,'north'],[1,5,'west'],[17,5,'east'],
  [1,15,'west'],[17,15,'east'],[4,23,'south'],[14,23,'south']]);
 for(let x=1;x<=17;x++)for(let z=1;z<=8;z++)
  roof(x,7+Math.floor(Math.min(x-1,17-x,z-1,8-z)/2),z,'fernhook-front-basket-hip');
 for(let x=1;x<=9;x++)for(let z=9;z<=19;z++)
  roof(x,7+Math.floor((9-x)/4),z,'fernhook-west-fiber-lean');
 for(let x=10;x<=17;x++)for(let z=9;z<=19;z++)
  roof(x,7+Math.floor((x-10)/4),z,'fernhook-east-crate-lean');
 for(let x=1;x<=17;x++)for(let z=20;z<=23;z++)
  roof(x,7+Math.floor((z-20)/3),z,'fernhook-rear-forest-raincover');
 for(const [x,z] of [[4,4],[14,4],[4,12],[14,12],[4,22],[14,22]])
  post(x,z,'fernhook-wood-truss-pier');
 for(const [x,z,p] of [[5,4,'dry-fiber-bundle-no-harvest'],[13,4,'seed-transport-crate'],
  [4,13,'dry-moss-frame'],[14,13,'basket-weave-station-no-crafting'],
  [5,22,'coppice-tool-bench'],[13,22,'cordage-repair-box']])b.fitting(x,z,p);
 b.room('front-empty-cart-and-fiber',2,2,17,8);
 b.room('west-shaded-drying-bay',2,9,9,20);
 b.room('east-basket-assembly-bay',10,9,17,20);
 b.room('rear-dry-fiber-courtyard',2,21,17,23);
 b.portal('outside','front-empty-cart-and-fiber',9,1,'three-cell-forest-wagon-door');
 for(const [x,n] of [[5,'west-shaded-drying-bay'],[13,'east-basket-assembly-bay']])
  b.portal('front-empty-cart-and-fiber',n,x,8);
 b.portal('west-shaded-drying-bay','east-basket-assembly-bay',9,12);
 b.portal('west-shaded-drying-bay','east-basket-assembly-bay',9,18);
 for(const [x,n] of [[5,'west-shaded-drying-bay'],[13,'east-basket-assembly-bay']])
  b.portal(n,'rear-dry-fiber-courtyard',x,20);
 return b.finish('compact enchanted drying barn with two distinct wood drying sheds, zigzag work route and back raincover', {harvesting:false,crafting:false,biomeSpread:false});
}

export function getM2NextRegion1BPlans(){
 return [moonfernPocketBath(),elderwillowCanopyBath(),screeledgeStoneBath(),
  ashgroveQuarterStable(),suntrailSixBayStable(),cragpostStoneStable(),
  datewindOasisBarn(),whitebarrowSnowGranary(),fernhookCuringBarn()];
}
