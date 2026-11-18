// Builder 1B M2f: coordinate-authored regional services and sculpted lighthouse silhouettes.
// Standalone source candidates ONLY, no shared runtime/save/pack/biome/main mutations.
// Each fixed design has a distinct mask, rooms, foundation/walls, roof-bearing columns.
import {irregular} from './m2-asymmetric-services.mjs';

// MOUNTAIN GREENHOUSE — ridge crossing a long downhill winterglazing wing.
export function talusglassRidgeHouse(){
 const g=irregular('greenhouse','mountain','medium','Talusglass Retaining-Ridge Conservatory',29,18,31,
  [[1,1,26,10],[14,10,26,29]],[[24,22,26,27]],6);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [11,12,13])open(x,1);
 wallZ(10,14,25,[20],4);
 glazed([[4,1,'north'],[23,1,'north'],[1,6,'west'],[26,5,'east'],[14,19,'west'],[26,15,'east'],[19,29,'south']]);
 roof([1,1,26,10],8,'talusglass-stone-visitor-crossroof','gable-x','live:stone');
 roof([14,11,26,29],8,'talusglass-glazed-upslope-glory','ramp-z','pack4:030');
 bearing([[5,5],[22,5],[17,15],[20,26]],'talusglass-anchored-ridge-pier','live:stone');
 fit([[6,5,'unpowered-mountain-thermometer'],[23,6,'dry-soil-inventory'],
  [18,17,'cold-fern-trellis-no-growing'],[19,26,'unwatered-rock-garden']]);
 room('mountain-transverse-visitor-gallery',2,2,25,10);
 room('descending-glazed-plant-wing',15,11,25,28);
 portal('outside','mountain-transverse-visitor-gallery',12,1,'three-wide-front-entry');
 portal('mountain-transverse-visitor-gallery','descending-glazed-plant-wing',20,10);
 return finish('L-shaped mountain retaining conservatory: unequal stone visitor gable, long raised glass growing arm and missing side-court',
 {plantsGrowing:false,irrigation:false,rockfallLoadApproved:false});
}

// ENCHANTED GREENHOUSE — a full C-shaped growing cloister. The missing
// center is genuine absent foundation, not transparent geometry or scenery.
export function thorncrownCloisterGlass(){
 const g=irregular('greenhouse','enchanted-forest','large','Thorncrown C-Arc Botanical Cloister',35,20,40,
  [[1,1,33,11],[1,11,11,38],[10,29,33,38]],[[1,23,3,29],[29,32,32,37]],7);
 const {open,wallZ,wallX,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [16,17,18])open(x,1);
 wallZ(11,2,11,[6],5);wallX(11,29,37,[33],4);
 glazed([[5,1,'north'],[28,1,'north'],[1,6,'west'],[33,7,'east'],[1,17,'west'],
  [11,20,'east'],[5,37,'south'],[19,38,'south'],[33,30,'east']]);
 roof([1,1,33,11],9,'thorncrown-great-leaflight-nave','hip','pack4:030');
 roof([1,12,11,38],8,'thorncrown-hanging-root-portico','ramp-z','live:wood');
 roof([12,29,33,38],9,'thorncrown-aftergarden-crossridge','gable-x','live:wood');
 bearing([[6,5],[27,5],[6,16],[7,34],[18,33],[27,34]],
  'thorncrown-living-arch-bearing-post');
 fit([[7,5,'unlit-grove-lantern'],[26,5,'seed-scroll-counter'],[7,16,'fixed-spore-terrarium'],
  [8,34,'empty-root-pot'],[20,33,'dry-botany-herbarium'],[26,34,'tree-sapling-exhibit-no-growth']]);
 room('long-front-greenhouse-nave',2,2,32,11);
 room('western-root-colonnade',2,12,10,37);
 room('southern-botanical-records',12,30,32,37);
 portal('outside','long-front-greenhouse-nave',17,1);
 portal('long-front-greenhouse-nave','western-root-colonnade',6,11);
 portal('western-root-colonnade','southern-botanical-records',11,33);
 return finish('original physical C-footprint growing conservatory: sky-open inner garden, long root-gallery, glazed broad front hall and rear archive',
 {biomeMagic:false,plantsHarvestable:false,growthSimulation:false});
}

// SNOW GREENHOUSE — two wide winter sheds joined by a raised glass H bridge.
export function bridgefrostHGlasshouse(){
 const g=irregular('greenhouse','snow','large','Bridgefrost H-Bridge Seed Conservatory',35,21,41,
  [[1,1,11,39],[23,1,33,39],[10,16,24,25]],[],7);
 const {open,wallX,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [5,6,7,27,28,29])open(x,1);
 wallX(11,16,25,[20],5);wallX(23,16,25,[20],5);
 glazed([[1,7,'west'],[11,10,'east'],[1,30,'west'],[11,31,'east'],
  [23,7,'west'],[33,8,'east'],[23,29,'west'],[33,30,'east'],
  [13,16,'north'],[20,25,'south'],[5,39,'south'],[29,39,'south']]);
 roof([1,1,11,39],9,'bridgefrost-long-west-snow-shedding-vault','gable-x','live:stone');
 roof([12,16,22,25],9,'bridgefrost-elevated-frostglass-connector','gable-z','pack4:030');
 roof([23,1,33,39],9,'bridgefrost-opposite-lantern-ridge','reverse-z','live:wood');
 bearing([[5,10],[6,29],[16,20],[27,10],[29,30]],
  'bridgefrost-snow-anchored-lattice-column','live:stone');
 fit([[6,6,'unpowered-winter-storage'],[6,27,'cold-root-rack'],
  [16,19,'glass-bridge-cabinet'],[28,7,'snow-seed-bin'],[27,30,'dry-frost-herbarium']]);
 room('western-long-seed-winterhouse',2,2,10,38);
 room('bridged-crosswise-frostglass-gallery',12,17,22,24);
 room('eastern-winter-tool-and-nursery',24,2,32,38);
 portal('outside','western-long-seed-winterhouse',6,1);
 portal('western-long-seed-winterhouse','bridged-crosswise-frostglass-gallery',11,20);
 portal('bridged-crosswise-frostglass-gallery','eastern-winter-tool-and-nursery',23,20);
 portal('outside','eastern-winter-tool-and-nursery',28,1);
 return finish('genuine H-plan enclosed winter seed house with two opposing long gabled arms and one narrow roof-glazed crossing',
 {heating:false,iceLoadApproved:false,nurseryPlantGrowth:false});
}

// SNOW FISHING LODGE — U of enclosed net-work wings around an open ice yard.
export function icehookUCooperative(){
 const g=irregular('fishing-lodge','snow','medium','Icehook U-Plan Net & Sled Cooperative',31,18,35,
  [[1,1,29,10],[1,10,10,33],[20,10,29,33]],[],7);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [14,15,16])open(x,1);
 wallZ(10,2,29,[5,25],4);
 glazed([[5,1,'north'],[25,1,'north'],[1,6,'west'],[29,6,'east'],
  [1,17,'west'],[10,22,'east'],[20,19,'west'],[29,23,'east'],
  [5,33,'south'],[25,33,'south']]);
 roof([1,1,29,10],8,'icehook-crosswise-storm-cutter','gable-x','live:stone');
 roof([1,11,10,33],8,'icehook-west-sled-repair-hip','ramp-z','live:wood');
 roof([20,11,29,33],8,'icehook-east-drynet-snow-ridge','reverse-z','live:stone');
 bearing([[5,5],[25,5],[5,16],[6,28],[24,16],[25,28]],'icehook-snow-roof-buttress','live:stone');
 fit([[6,5,'unpowered-winter-net-scale'],[24,5,'frozen-catch-ledger'],
  [6,16,'empty-ice-sledge'],[25,18,'drynet-braid-no-crafting'],
  [6,29,'spare-hook-woodrack'],[25,29,'cold-boat-spar-no-boat']]);
 room('public-cooperative-windlock',2,2,28,10);
 room('western-sled-and-gear-hall',2,11,9,32);
 room('eastern-rope-and-drynet-hall',21,11,28,32);
 portal('outside','public-cooperative-windlock',15,1);
 portal('public-cooperative-windlock','western-sled-and-gear-hall',5,10);
 portal('public-cooperative-windlock','eastern-rope-and-drynet-hall',25,10);
 return finish('true U-plan winter shore cooperative with open source-absent middle ice yard and asymmetrically roofed drynet wings',
 {iceSledMechanics:false,realWater:false,realFishing:false});
}

// ENCHANTED FISHING LODGE — hook-ended T-pier with a tall timber boat loft.
export function glimmerhookTReedHouse(){
 const g=irregular('fishing-lodge','enchanted-forest','medium','Glimmerhook T-Head Reed Lodge',29,17,35,
  [[1,1,27,10],[10,10,19,27],[15,24,27,33]],[[25,28,27,32]],6);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [12,13,14])open(x,1);
 wallZ(10,11,18,[14],4);wallZ(24,16,19,[17],4);
 glazed([[5,1,'north'],[23,1,'north'],[1,6,'west'],[27,6,'east'],
  [10,18,'west'],[19,19,'east'],[16,32,'south'],[27,25,'east']]);
 roof([1,1,27,10],8,'glimmerhook-reedfront-timber-hip','hip','live:wood');
 roof([10,11,19,23],8,'glimmerhook-central-hanging-net-ridge','gable-x','live:wood');
 roof([15,24,27,33],8,'glimmerhook-eastern-hooked-signal-lean','ramp-z','live:stone');
 bearing([[5,5],[23,5],[13,17],[17,20],[19,29]],'glimmerhook-river-logged-post');
 fit([[6,5,'nonworking-fish-smoking-rack'],[22,6,'dry-reed-net-cabinet'],
  [14,17,'hanging-cordage-no-crafting'],[20,28,'unlit-marsh-buoy']]);
 room('wide-crossbeam-boatkeepers-gathering',2,2,26,10);
 room('narrow-reed-drying-spine',11,11,18,24);
 room('east-projecting-signal-and-storage',16,25,26,32);
 portal('outside','wide-crossbeam-boatkeepers-gathering',13,1);
 portal('wide-crossbeam-boatkeepers-gathering','narrow-reed-drying-spine',14,10);
 portal('narrow-reed-drying-spine','east-projecting-signal-and-storage',17,24);
 return finish('T-headed original river lodge with a narrow timber stem ending in east-hooked signal platform, not a straight rectangle',
 {boats:false,harvestableReeds:false,smokerMechanics:false});
}
// TEMPERATE LARGE HARBOR OFFICE — C-shaped court with independently raised
// eastern signal annex and stone-arched dock records on a back arcade.
export function estuaryCivicArcade(){
 const g=irregular('harbor-office','temperate','large','Estuary C-Arc Pier Administration',37,19,39,
  [[1,1,35,10],[1,10,12,37],[11,29,31,37],[25,15,35,29]],[],7);
 const {open,wallZ,wallX,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [16,17,18])open(x,1);
 wallZ(10,2,12,[6],4);wallX(12,29,36,[33],4);wallZ(29,25,31,[28],4);
 glazed([[4,1,'north'],[31,1,'north'],[1,6,'west'],[35,6,'east'],
 [1,20,'west'],[12,22,'east'],[5,37,'south'],[21,37,'south'],
 [35,20,'east'],[25,23,'west']]);
 roof([1,1,35,10],8,'estuary-front-customs-vault','gable-x','live:stone');
 roof([1,11,12,28],8,'estuary-long-west-pier-archives','ramp-z','live:wood');
 roof([11,29,31,37],9,'estuary-rear-ledger-mosaic-roof','hip','live:stone');
 roof([25,15,35,28],9,'estuary-east-watch-and-flag-office','reverse-x','live:wood');
 bearing([[5,5],[30,5],[6,19],[6,27],[17,33],[28,20]],'estuary-joint-hall-arch-pier','live:stone');
 fit([[7,5,'port-master-ledger'],[29,5,'unloaded-cargo-map'],
 [6,20,'harbor-records-station'],[6,32,'paper-archive-storage'],
 [21,33,'tide-clock-no-physics'],[29,20,'unpowered-harbor-flag']]);
 room('wide-riverport-public-front-hall',2,2,34,10);
 room('left-deep-document-and-dock-wing',2,11,11,28);
 room('back-public-chart-library',12,30,30,36);
 room('right-independent-harbor-flag-wing',26,16,34,28);
 portal('outside','wide-riverport-public-front-hall',17,1);
 portal('wide-riverport-public-front-hall','left-deep-document-and-dock-wing',6,10);
 portal('left-deep-document-and-dock-wing','back-public-chart-library',12,33);
 portal('back-public-chart-library','right-independent-harbor-flag-wing',28,29);
 return finish('four separately roofed C-plan pier office wings surrounding a genuinely open rectangular ship-inspection court',
 {harborEconomy:false,ships:false,realTideSystem:false});
}
// MOUNTAIN MEDIUM HARBOR OFFICE — zigzag gorge crossing from front tax
// ledger hall to offset signal court on three independent sloping roofs.
export function switchbackPortCartography(){
 const g=irregular('harbor-office','mountain','medium','Switchback Gorge Port Cartography',31,18,33,
  [[1,1,26,10],[9,10,18,22],[13,22,29,31]],[],6);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [11,12,13])open(x,1);
 wallZ(10,10,17,[13],4);wallZ(22,13,18,[16],4);
 glazed([[4,1,'north'],[22,1,'north'],[1,5,'west'],[26,6,'east'],
 [9,15,'west'],[18,17,'east'],[13,28,'west'],[29,26,'east'],[22,31,'south']]);
 roof([1,1,26,10],8,'switchback-high-pass-ledger-gable','gable-x','live:stone');
 roof([9,11,18,22],8,'switchback-narrow-vertical-map-archive','ramp-z','live:wood');
 roof([13,23,29,31],8,'switchback-offset-harbor-signal-roof','reverse-x','live:stone');
 bearing([[5,5],[22,5],[12,15],[16,20],[18,27],[24,27]],'switchback-gorge-load-pier','live:stone');
 fit([[6,5,'cliff-port-customs-desk'],[21,6,'navigation-chart-locker'],
 [13,15,'dry-miners-waybill'],[19,27,'stone-port-register'],[25,27,'unlit-peak-signal']]);
 room('front-terraced-road-customs-hall',2,2,25,10);
 room('narrow-upland-archive-bridge',10,11,17,22);
 room('right-offset-gorge-signal-office',14,23,28,30);
 portal('outside','front-terraced-road-customs-hall',12,1);
 portal('front-terraced-road-customs-hall','narrow-upland-archive-bridge',13,10);
 portal('narrow-upland-archive-bridge','right-offset-gorge-signal-office',16,22);
 return finish('original stepped Z-shaped gorge harbor office: three bearing-supported roofs and offset manifest rooms',
 {mountainHarborTransport:false,signalLight:false});
}

// Segment builders for source-visible *tiered*, inset lighthouse forms.  Each
// band has an independently authored physical cap that bears the next band.
// Caps are NOT certified engineered loads or accessible upper floors.
function octFootprint(x0,x1,z0,z1,cut){
 const S=new Set(),K=(x,z)=>x+','+z;
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const ax=Math.min(x-x0,x1-x),az=Math.min(z-z0,z1-z);
  if(ax+az>=cut)S.add(K(x,z));
 }
 return {cells:[...S].map(k=>k.split(',').map(Number)),
  edge:[...S].map(k=>k.split(',').map(Number)).filter(([x,z])=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!S.has(K(x+dx,z+dz))))};
}
function towerPlate(b,shape,y,profile,asset='live:stone'){
 for(const [x,z] of shape.cells)if(b.clear(x,y,z))
  b.put(x,y,z,'roof',asset,'none',{roofProfile:profile,loadCertification:false,roofWalking:false});
}
function towerBand(b,shape,y0,y1,profile,asset='live:stone'){
 for(const [x,z] of shape.edge)for(let y=y0;y<=y1;y++){
  if(!b.clear(x,y,z))throw Error('Tier band source overlap '+profile+' '+[x,y,z]);
  b.put(x,y,z,'wall',asset,'none',{towerProfile:profile,climbApproved:false});
 }
}
function crenellations(b,shape,y,profile,asset='live:stone',period=3){
 for(let n=0;n<shape.edge.length;n++)if(n%period===0){
  const [x,z]=shape.edge[n];
  if(b.clear(x,y,z))b.put(x,y,z,'decoration',asset,'none',
   {towerProfile:profile,sourceCrenellation:true,walkableParapetApproved:false});
 }
}
function towerSlit(b,x,y,z,facing='north'){
 b.cut(x,y,z);
 b.put(x,y,z,'window','pack4:030',facing,{towerSlit:true,physicalPaneMountApproved:false});
}
// DESERT LARGE LIGHTHOUSE — 3 real tier setbacks, octagonal bevels, source
// stepped balustrades and a crystal-tipped crown; not a straight solid column.
export function mirajOctagonBeacon(){
 const g=irregular('lighthouse','desert','large','Miraj Three-Tier Octagon Harbor Beacon',39,39,43,
  [[1,1,16,17],[14,11,36,24],[20,24,36,41]],[[31,34,35,39]],7);
 const {b,open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [7,8,9])open(x,1);
 open(16,14);for(const x of [26,27])open(x,11);
 wallZ(24,21,35,[28],5);
 glazed([[4,1,'north'],[12,1,'north'],[1,7,'west'],[16,5,'east'],
  [22,11,'north'],[36,18,'east'],[20,30,'west'],[36,30,'east'],[26,41,'south']]);
 // Tier 0: ground-level broad 16×17 stone platform.  Source upper geometry
 // starts above the 7-high irregular traced stone perimeter.
 const t0=octFootprint(1,16,1,17,2);
 towerPlate(b,t0,8,'miraj-ground-tier-roof-plate');
 const t1=octFootprint(2,15,2,16,2);
 towerBand(b,t1,9,18,'miraj-wide-beveled-first-minaret-band');
 towerSlit(b,8,14,2,'north');towerSlit(b,15,14,9,'east');
 towerPlate(b,t1,19,'miraj-octagonal-outward-first-gallery');
 crenellations(b,t1,20,'miraj-source-topped-sandstone-crenels','live:stone',3);
 const t2=octFootprint(5,12,5,13,1);
 towerBand(b,t2,20,25,'miraj-narrow-second-setback-signal-stage');
 towerSlit(b,8,23,5,'north');
 towerPlate(b,t2,26,'miraj-secondary-walkgallery-roof','live:stone');
 crenellations(b,t2,27,'miraj-offset-tasselled-arcade','live:wood',2);
 const t3=octFootprint(6,11,6,11,1);
 towerBand(b,t3,27,30,'miraj-open-signal-crown');
 towerPlate(b,t3,31,'miraj-glassless-crystal-beacon-cap','live:crystal');
 // The upper finial is a real, grounded sequence of cells resting on the
 // upper cap, NOT a fake functioning navigational light.
 for(let y=32;y<=34;y++)b.put(8,y,8,'decoration','live:crystal','none',
  {purpose:'miraj-fixed-nonluminous-beacon-finial',beaconOperational:false});
 roof([17,11,36,24],9,'miraj-crosswind-customs-stone-terrace','gable-x','live:stone');
 roof([20,25,36,41],9,'miraj-dockward-tally-court','hip','live:wood');
 bearing([[20,15],[32,18],[24,29],[30,32]],'miraj-keeper-hall-shade-column','live:stone');
 fit([[8,6,'unpowered-octagon-beacon-controls'],[21,15,'caravan-coast-pilot-desk'],
  [31,18,'dry-shipping-seal-box'],[25,30,'saltwind-observation-maps'],[29,34,'empty-signal-crate']]);
 room('octagonal-ground-minaret-entry',2,2,15,16);
 room('right-stone-customs-keeper-wing',17,12,35,24);
 room('rear-dock-chart-terrace',21,25,35,40);
 portal('outside','octagonal-ground-minaret-entry',8,1,'three-wide-ancient-gate');
 portal('octagonal-ground-minaret-entry','right-stone-customs-keeper-wing',16,14);
 portal('outside','right-stone-customs-keeper-wing',27,11);
 portal('right-stone-customs-keeper-wing','rear-dock-chart-terrace',28,24);
 return finish('three completely different source physical inset minaret bands: wide faceted eight-sided stone stage, projecting crenelated gallery, thin pierced tier and crystal finial on L-hook harbor outbuildings',
  {beaconOperational:false,lighthouseClimbing:false,upperGalleryWalkable:false,roofLoadApproved:false});
}
// SNOW LARGE LIGHTHOUSE — a paired-height landmark rather than a single
// skyscraper: faceted main watch tower, independent shorter snow-ward signal
// turret and two angular connecting buildings, all lower-level traversable.
export function rimewatchTwinBeacon(){
 const g=irregular('lighthouse','snow','large','Rimewatch Twin-Crown Ice Sound Light',39,40,43,
  [[1,1,14,16],[13,12,35,25],[25,24,37,41]],[[35,34,37,38]],7);
 const {b,open,wallZ,wallX,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [6,7,8])open(x,1);
 open(14,14);for(const x of [23,24])open(x,12);
 wallZ(25,26,35,[30],5);
 wallX(27,29,35,[32],4);
 glazed([[4,1,'north'],[11,1,'north'],[1,7,'west'],[14,6,'east'],
  [19,12,'north'],[35,19,'east'],[25,29,'west'],[37,28,'east'],[29,41,'south']]);
 const low=octFootprint(1,14,1,16,1);
 towerPlate(b,low,8,'rimewatch-ground-buttress-cap','live:stone');
 const r1=octFootprint(2,13,2,15,2);
 towerBand(b,r1,9,19,'rimewatch-broad-windward-faceted-iceguard','live:stone');
 towerSlit(b,7,16,2,'north');towerSlit(b,13,16,8,'east');
 towerPlate(b,r1,20,'rimewatch-stone-first-snow-gallery','live:wood');
 crenellations(b,r1,21,'rimewatch-windbreak-battlement','live:stone',2);
 const r2=octFootprint(4,11,4,12,1);
 towerBand(b,r2,21,28,'rimewatch-narrow-stone-upper-watch-tier','live:wood');
 towerPlate(b,r2,29,'rimewatch-icy-second-signalshelf','live:stone');
 const upper=octFootprint(5,10,5,11,1);
 towerBand(b,upper,30,33,'rimewatch-guarded-sky-signal-ring','live:crystal');
 towerPlate(b,upper,34,'rimewatch-pale-lantern-snowcap','live:crystal');
 for(let y=35;y<=37;y++)b.put(7,y,8,'decoration','live:stone','none',
  {purpose:'rimewatch-ice-sound-finial',activeLamp:false});
 // Secondary shorter lookout is cut directly from the far western cliff
 // office's real filled footprint, with its OWN source-height story and roof.
 const secondary=octFootprint(27,35,28,37,1);
 towerPlate(b,secondary,8,'rimewatch-secondary-base-load-plate','live:wood');
 const s1=octFootprint(28,34,29,36,1);
 towerBand(b,s1,9,16,'rimewatch-shorter-independent-rear-watch-turret','live:stone');
 towerPlate(b,s1,17,'rimewatch-secondary-shingle-snow-gallery','live:wood');
 crenellations(b,s1,18,'rimewatch-small-mooring-battlement','live:stone',2);
 const small=octFootprint(29,33,30,35,1);
 towerBand(b,small,18,21,'rimewatch-second-signal-crown','live:stone');
 towerPlate(b,small,22,'rimewatch-secondary-gabled-crystal-beacon','live:crystal');
 roof([15,12,35,25],9,'rimewatch-wide-keepers-timber-bridge','gable-x','live:wood');
 roof([25,26,37,41],9,'rimewatch-rear-bay-roof-not-on-secondary','reverse-z','live:stone',
  (x,z)=>!(x>=27&&x<=35&&z>=28&&z<=37));
 bearing([[18,16],[31,17],[27,26],[36,32]],'rimewatch-long-gallery-snow-roofload','live:stone');
 fit([[7,6,'unlit-high-ice-lantern-stand'],[20,16,'storm-registry-desk'],
  [30,17,'winter-shipping-ledger'],[29,26,'dry-cargo-pallet'],
  [32,38,'winter-signal-rope-no-mechanics']]);
 room('main-tall-tower-ground-hall',2,2,13,15);
 room('covered-snow-navigation-hall',15,13,34,25);
 room('rear-short-lighthouse-supply-and-tools',26,26,36,40);
 room('secondary-ground-watch-turret',28,29,34,36);
 portal('outside','main-tall-tower-ground-hall',7,1,'winter-stone-triple-gate');
 portal('main-tall-tower-ground-hall','covered-snow-navigation-hall',14,14);
 portal('outside','covered-snow-navigation-hall',24,12);
 portal('covered-snow-navigation-hall','rear-short-lighthouse-supply-and-tools',30,25);
 portal('rear-short-lighthouse-supply-and-tools','secondary-ground-watch-turret',27,32);
 return finish('true dual-height lighthouse composition: tall faceted and inset crystal tower with crenellated tiers, separate short western signal turret, and long L-linked ice-harbor keeper galleries',
  {beaconsActive:false,verticalTraversal:false,glassMountApproved:false,roofLoadApproved:false});
}
export function getM2Beacon1BPlans(){
 return [talusglassRidgeHouse(),thorncrownCloisterGlass(),bridgefrostHGlasshouse(),
  icehookUCooperative(),glimmerhookTReedHouse(),estuaryCivicArcade(),
  switchbackPortCartography(),mirajOctagonBeacon(),rimewatchTwinBeacon()];
}
