// Mythwrought Builder 1B — M2j: nine discrete original architectural plans.
// Every footprint, roof region, portal, source decoration and bearing station is
// explicitly described below. No seeded repetition, rescaling, flips or copies.
// Draft blueprints only; no runtime, persistent state, world placement or merges.
import {irregular} from './m2-asymmetric-services.mjs';

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
  sourceAuthor:'Builder 1B M2j independent XYZ blueprint',
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

// Temperate SMALL is the final missing original greenhouse size/biome slot.
// The front room curls around a real empty garden via four unequal roof ranges.
export function rainwoldSpiralNursery(){return original({
 category:'greenhouse',biome:'temperate',size:'small',key:'rainwold',
 name:'Rainwold Spiral-Return Nursery',dim:[26,19,28],
 mask:[[1,1,23,7],[1,8,8,23],[9,17,20,25],[17,8,23,15],[13,13,16,16]],
 entries:[[12,1],[6,7],[20,7],[8,20],[15,17],[17,14]],
 windows:[[3,1,'north'],[22,1,'north'],[1,13,'west'],[23,11,'east'],[5,23,'south'],[18,25,'south']],
 roofs:[[[1,1,23,7],9,'rainwold-wide-ridge-gallery','gable-x','pack4:030'],
 [[1,8,8,23],8,'rainwold-long-west-root-wing','ramp-z','live:wood'],
 [[9,17,20,25],9,'rainwold-returned-rear-orchard','gable-z','pack3:023'],
 [[17,8,23,15],10,'rainwold-short-east-bloom-shed','reverse-x','live:wood'],
 [[13,13,16,16],8,'rainwold-passage-fold','hip','live:wood']],
 posts:[[4,4],[20,4],[4,13],[4,20],[14,21],[19,21],[20,12],[15,15]],
 furniture:[[6,4,'unplanted-seed-bench'],[21,4,'label-slate'],[5,15,'dry-fern-stand'],[18,12,'glaze-batten-sample'],[12,21,'dry-root-ledger']],
 dependencies:[[8,5,'pack1:002','timber-trim-source-candidate']],
 rooms:[['front-moss-glass-gallery',2,2,22,7],['west-shade-turn',2,8,7,22],['east-bloom-annex',18,8,22,14],['rear-winter-bed',9,18,19,24],['mid-return-pass',13,13,16,16]],
 portals:[['outside','front-moss-glass-gallery',12,1],['front-moss-glass-gallery','west-shade-turn',6,7],['front-moss-glass-gallery','east-bloom-annex',20,7],['west-shade-turn','rear-winter-bed',8,20],['rear-winter-bed','mid-return-pass',15,17],['mid-return-pass','east-bloom-annex',17,14]],
 description:'five-range looping temperate exhibition nursery with two deep sky-open voids, different supported roof elevations and truly curled pedestrian rooms'
});}

// Desert SMALL: angular dry-quay archive, NOT a working fishing mechanic.
export function dunetideSwitchbackGuild(){return original({
 category:'fishing-lodge',biome:'desert',size:'small',key:'dunetide',
 name:'Dunetide Crooked Quay Guild',dim:[25,19,30],
 mask:[[1,1,22,8],[14,9,22,19],[9,16,13,19],[2,20,17,27]],
 entries:[[11,1],[18,8],[14,17],[11,20]],
 windows:[[4,1,'north'],[21,1,'north'],[22,14,'east'],[2,23,'west'],[15,27,'south']],
 roofs:[[[1,1,22,8],9,'dunetide-stone-cross-gable','gable-x','pack3:024'],
 [[14,9,22,19],10,'dunetide-solar-fishing-ledger','reverse-z','live:stone'],
 [[9,16,13,19],8,'dunetide-crooked-narrow-pass','ramp-x','live:wood'],
 [[2,20,17,27],9,'dunetide-reverse-quay-warehouse','gable-z','live:stone']],
 posts:[[5,4],[19,4],[17,12],[19,17],[10,18],[7,23],[13,24]],
 furniture:[[6,4,'empty-quay-rack'],[20,4,'paper-fish-permit'],[17,14,'dry-net-station'],[12,18,'route-marker'],[8,23,'unloaded-cargo-ledger']],
 dependencies:[[8,5,'pack5:080','dry-sand-stone-material-candidate']],
 rooms:[['wide-front-dry-trading',2,2,21,8],['east-net-sorting-office',15,9,21,18],['crooked-bridging-lobby',9,16,13,19],['rear-west-dry-boat-archives',3,21,16,26]],
 portals:[['outside','wide-front-dry-trading',11,1],['wide-front-dry-trading','east-net-sorting-office',18,8],['east-net-sorting-office','crooked-bridging-lobby',14,17],['crooked-bridging-lobby','rear-west-dry-boat-archives',11,20]],
 description:'authored Z-harbor fishing hall with true offset 5-cell throat and left-returned inland net store; no active water, boats or fishing'
});}

// Mountain LARGE: crossed gull-wing dry goods and physically distinct sky yards.
export function cloudhookCliffLodge(){return original({
 category:'fishing-lodge',biome:'mountain',size:'large',key:'cloudhook',
 name:'Cloudhook Cliffstep Fisher Cooperative',dim:[41,24,47],
 mask:[[9,1,29,12],[1,13,12,31],[25,13,38,27],[13,24,24,31],[2,32,25,44]],
 entries:[[19,1],[10,12],[27,12],[12,26],[25,25],[16,32]],
 windows:[[11,1,'north'],[26,1,'north'],[1,18,'west'],[38,19,'east'],[4,44,'south'],[23,44,'south']],
 roofs:[[[9,1,29,12],10,'cloudhook-arched-front-drydock','gable-x','pack3:025'],
 [[1,13,12,31],9,'cloudhook-west-braided-net-ramp','ramp-z','live:wood'],
 [[25,13,38,27],11,'cloudhook-high-east-quarry-lookout','reverse-x','live:stone'],
 [[13,24,24,31],10,'cloudhook-cliff-crosswalk-hood','gable-z','pack3:025'],
 [[2,32,25,44],9,'cloudhook-deep-southern-archive','hip','live:wood']],
 posts:[[13,5],[25,5],[6,18],[6,27],[32,18],[32,24],[18,27],[8,37],[20,37]],
 furniture:[[17,5,'dry-creel-sample'],[24,5,'cliff-ledger'],[6,20,'nonoperating-ice-hook'],[32,21,'route-stone'],[18,28,'windy-dry-map'],[9,39,'retired-boat-plans']],
 dependencies:[[22,6,'pack1:006','mountain-masonry-source-sample']],
 rooms:[['front-crossbay-landing',10,2,28,12],['west-stone-net-gallery',2,14,11,30],['east-cliff-watch-exchange',26,14,37,26],['middle-sky-bridge',13,25,24,30],['rear-dry-charter-store',3,33,24,43]],
 portals:[['outside','front-crossbay-landing',19,1],['front-crossbay-landing','west-stone-net-gallery',10,12],['front-crossbay-landing','east-cliff-watch-exchange',27,12],['west-stone-net-gallery','middle-sky-bridge',12,26],['middle-sky-bridge','east-cliff-watch-exchange',25,25],['middle-sky-bridge','rear-dry-charter-store',16,32]],
 description:'large cliffside five-wing cross-cooperative, western long net hall, eastern raised watch and real open diagonal cliff courtyards'
});}

// Snow MEDIUM: double-snow court in a connected barbell H with broad archive.
export function rimebreakCustomsStarhall(){return original({
 category:'harbor-office',biome:'snow',size:'medium',key:'rimebreak',
 name:'Rimebreak Split-Court Customs Starhall',dim:[33,21,40],
 mask:[[1,1,30,10],[1,11,10,32],[22,11,30,24],[11,21,21,26],[7,27,24,37]],
 entries:[[15,1],[6,10],[26,10],[10,23],[22,23],[16,27]],
 windows:[[5,1,'north'],[27,1,'north'],[1,18,'west'],[30,19,'east'],[10,37,'south'],[22,37,'south']],
 roofs:[[[1,1,30,10],10,'rimebreak-broad-state-snow-gable','gable-x','pack3:025'],
 [[1,11,10,26],9,'rimebreak-tall-left-records','ramp-z','live:wood'],
 [[1,27,6,32],9,'rimebreak-westward-archival-return','reverse-x','live:wood'],
 [[22,11,30,24],10,'rimebreak-short-right-tariff','reverse-x','live:stone'],
 [[11,21,21,26],11,'rimebreak-glass-cross-hall','gable-z','pack4:030'],
 [[7,27,24,37],9,'rimebreak-rear-paper-archive','hip','live:wood']],
 posts:[[5,5],[25,5],[5,17],[5,28],[26,17],[15,24],[12,32],[21,33]],
 furniture:[[7,5,'winter-import-notice'],[24,5,'unused-cargo-stamp'],[5,21,'chart-counter'],[27,17,'snow-route-marker'],[14,23,'crosspass-bench'],[16,32,'signed-dry-records']],
 dependencies:[[7,7,'pack1:005','ice-lintel-trim-sample']],
 rooms:[['wide-snow-public-office',2,2,29,10],['long-west-licensing',2,11,9,31],['short-east-cargo-inspection',23,11,29,23],['roofed-bridge-room',11,22,21,25],['rear-manifest-ledgers',8,28,23,36]],
 portals:[['outside','wide-snow-public-office',15,1],['wide-snow-public-office','long-west-licensing',6,10],['wide-snow-public-office','short-east-cargo-inspection',26,10],['long-west-licensing','roofed-bridge-room',10,23],['roofed-bridge-room','short-east-cargo-inspection',22,23],['roofed-bridge-room','rear-manifest-ledgers',16,27]],
 description:'five original stepped snow-hall regions arranged around physically absent left and right courtyard cavities'
});}

// Enchanted SMALL: channel magistracy enclosing a large uneven stone-less void.
export function rootglassCanalMagistracy(){return original({
 category:'harbor-office',biome:'enchanted-forest',size:'small',key:'rootglass',
 name:'Rootglass Riverbend Canal Office',dim:[25,19,30],
 mask:[[1,1,21,8],[1,9,7,25],[16,9,22,20],[8,21,20,28]],
 entries:[[11,1],[5,8],[19,8],[7,23],[18,20]],
 windows:[[4,1,'north'],[19,1,'north'],[1,16,'west'],[22,15,'east'],[12,28,'south'],[19,28,'south']],
 roofs:[[[1,1,21,8],9,'rootglass-front-river-courthouse','gable-z','pack3:023'],
 [[1,9,7,25],8,'rootglass-lower-west-statute-ramp','ramp-z','live:wood'],
 [[16,9,22,20],10,'rootglass-short-rootway-gable','reverse-x','pack4:030'],
 [[8,21,20,28],9,'rootglass-southern-chart-cabinet','hip','live:wood']],
 posts:[[5,5],[18,5],[4,16],[4,23],[19,15],[12,24],[18,25]],
 furniture:[[7,4,'silent-river-reed-registry'],[18,4,'blank-canal-permit'],[4,18,'dry-trade-flag'],[19,14,'empty-chart-plinth'],[13,25,'archived-root-paper']],
 dependencies:[[6,5,'pack2:013','enchanted-masonry-swatch']],
 rooms:[['front-river-public-counter',2,2,20,8],['left-curving-ledger',2,9,6,24],['right-short-charter-wing',17,9,21,19],['rear-forest-charts',8,22,19,27]],
 portals:[['outside','front-river-public-counter',11,1],['front-river-public-counter','left-curving-ledger',5,8],['front-river-public-counter','right-short-charter-wing',19,8],['left-curving-ledger','rear-forest-charts',7,23],['right-short-charter-wing','rear-forest-charts',18,20]],
 description:'source-forking tiny river office with contrasting low long-west and high short-east wings and fully sky-open central channel'
});}

// Desert MEDIUM: dry export tariff H with rear irregular excavation-like yard.
export function saltbridgeTariffCourt(){return original({
 category:'harbor-office',biome:'desert',size:'medium',key:'saltbridge',
 name:'Saltbridge Open-Atrium Tariff Court',dim:[32,21,37],
 mask:[[1,1,29,9],[1,10,9,26],[23,10,29,26],[10,19,22,23],[9,27,25,35]],
 entries:[[15,1],[5,9],[26,9],[9,21],[23,21],[15,27],[9,29]],
 windows:[[4,1,'north'],[25,1,'north'],[1,16,'west'],[29,16,'east'],[12,35,'south'],[23,35,'south']],
 roofs:[[[1,1,29,9],10,'saltbridge-front-vaulted-gable','gable-x','pack3:024'],
 [[1,10,9,26],9,'saltbridge-west-late-trade-lean','ramp-z','live:stone'],
 [[23,10,29,26],10,'saltbridge-east-import-loggia','reverse-z','live:stone'],
 [[10,19,22,23],11,'saltbridge-central-glazed-tollpass','gable-z','pack4:030'],
 [[9,27,25,35],9,'saltbridge-rear-archive-ridge','hip','live:wood']],
 posts:[[5,5],[24,5],[5,16],[5,24],[26,16],[26,24],[15,21],[13,31],[21,31]],
 furniture:[[7,5,'dry-quay-registry'],[25,5,'no-fee-tax-book'],[5,18,'import-ledger'],[26,17,'unused-stamp'],[16,21,'port-link-chart'],[14,31,'inert-cargo-catalog']],
 dependencies:[[18,6,'pack5:080','sandstone-facade-sample']],
 rooms:[['north-public-entry-hall',2,2,28,9],['west-tax-office',2,10,8,25],['east-import-desk',24,10,28,25],['center-bridge-archives',10,20,22,22],['southern-dry-goods-storage',10,28,24,34]],
 portals:[['outside','north-public-entry-hall',15,1],['north-public-entry-hall','west-tax-office',5,9],['north-public-entry-hall','east-import-desk',26,9],['west-tax-office','center-bridge-archives',9,21],['center-bridge-archives','east-import-desk',23,21],['west-tax-office','southern-dry-goods-storage',9,29]],
 description:'desert five-fork dry office with skyline bridge, east shorter customs arm, west longer hall and asymmetric rear sky court'
});}

// Snow SMALL lighthouse: unusually low cliffside parapet and vertical inset.
export function hailneedleOffsetBeacon(){return original({
 category:'lighthouse',biome:'snow',size:'small',key:'hailneedle',
 name:'Hailneedle Drift-Cut Lantern Beacon',dim:[27,31,31],wallTop:7,
 mask:[[1,1,12,15],[12,8,24,18],[17,19,24,28]],
 entries:[[6,1],[12,12],[20,18]],
 windows:[[3,1,'north'],[1,8,'west'],[15,8,'north'],[24,15,'east'],[21,28,'south']],
 roofs:[[[13,8,24,18],9,'hailneedle-low-signal-keeper-gable','gable-x','pack3:025'],
 [[17,19,24,28],9,'hailneedle-rear-dry-run','reverse-z','live:wood']],
 posts:[[17,12],[22,14],[19,23],[22,26]],
 furniture:[[6,6,'unlit-ice-signal-panel'],[17,13,'harbor-keeper-chart'],[21,15,'frost-ledger'],[19,24,'icebound-rope-sample']],
 dependencies:[[16,15,'pack1:005','snow-capped-structural-trim']],
 rooms:[['low-forward-snow-lantern-base',2,2,11,14],['offset-right-service-hall',13,9,23,18],['rear-narrow-harbor-store',18,20,23,27]],
 portals:[['outside','low-forward-snow-lantern-base',6,1],['low-forward-snow-lantern-base','offset-right-service-hall',12,12],['offset-right-service-hall','rear-narrow-harbor-store',20,18]],
 beacon:{stages:[
 ['cap',1,1,12,15,8,8,'live:stone','hailneedle-wind-dais'],
 ['ring',3,3,10,13,9,16,'live:stone','hailneedle-shaft-tall-drift-wall'],
 ['cap',3,3,10,13,17,17,'live:stone','hailneedle-protective-band'],
 ['ring',5,5,8,11,18,21,'live:wood','hailneedle-open-crystal-upper-ring'],
 ['cap',5,5,8,11,22,22,'live:crystal','hailneedle-crown-cap']],
 finials:[[6,8,23,26,'live:crystal','hailneedle-cold-unpowered-prism']]},
 description:'compact snow spike with tiered low base and far-right covered keeper arm, supported roof cap levels but no real climb'
});}

// Mountain MEDIUM: stone beacon with full west storage spur and offset archive.
export function cragforkBridgeBeacon(){return original({
 category:'lighthouse',biome:'mountain',size:'medium',key:'cragfork',
 name:'Cragfork Bent-Axis Beacon House',dim:[35,36,38],wallTop:8,
 mask:[[1,1,14,18],[13,10,32,21],[25,22,32,35],[1,19,9,27]],
 entries:[[7,1],[14,14],[7,18],[27,21]],
 windows:[[4,1,'north'],[1,12,'west'],[22,10,'north'],[32,17,'east'],[27,35,'south'],[5,27,'south']],
 roofs:[[[15,10,32,21],11,'cragfork-cross-keeper-pitched-vault','gable-x','pack3:025'],
 [[25,22,32,35],10,'cragfork-stone-rear-gorge-archive','ramp-z','live:stone'],
 [[1,19,9,27],9,'cragfork-west-chisel-store-shed','reverse-x','live:wood']],
 posts:[[18,15],[28,15],[28,28],[29,33],[5,23]],
 furniture:[[7,8,'quarry-trail-signal-record'],[20,15,'mineral-navigation-chart'],[28,17,'mountain-route-pedestal'],[28,29,'unlit-harbor-lookup'],[6,23,'dry-supply-counter']],
 dependencies:[[19,16,'pack1:006','mountain-stone-shape-candidate']],
 rooms:[['stone-base-beacon-lobby',2,2,13,17],['east-keeper-cross-gallery',15,11,31,20],['far-right-gorge-archive',26,23,31,34],['west-supply-sidehall',2,20,8,26]],
 portals:[['outside','stone-base-beacon-lobby',7,1],['stone-base-beacon-lobby','east-keeper-cross-gallery',14,14],['stone-base-beacon-lobby','west-supply-sidehall',7,18],['east-keeper-cross-gallery','far-right-gorge-archive',27,21]],
 beacon:{stages:[
 ['cap',1,1,14,18,9,9,'live:stone','cragfork-broad-rough-base'],
 ['ring',3,3,12,15,10,20,'live:stone','cragfork-stone-lantern-tower'],
 ['cap',3,3,12,15,21,21,'live:stone','cragfork-rough-cut-upper-band'],
 ['ring',5,5,9,13,22,26,'live:wood','cragfork-open-low-tower-ring'],
 ['cap',5,5,9,13,27,27,'live:crystal','cragfork-rough-crystal-crown']],
 finials:[[7,9,28,31,'live:crystal','cragfork-nonfunctioning-prismatic-gauge']]},
 description:'tall rocky cap shaft and three asymmetrical lateral wings with actual separate west and eastern courtyard cutbacks'
});}

// Temperate LARGE: broad porch, two unequal logistics wings, rear signal hall.
export function seabloomArcadeBeacon(){return original({
 category:'lighthouse',biome:'temperate',size:'large',key:'seabloom',
 name:'Seabloom Broad-Arc Harbor Beacon',dim:[42,40,48],wallTop:9,
 mask:[[8,1,24,19],[1,10,8,33],[24,12,39,23],[9,27,23,33],[7,34,29,45]],
 entries:[[16,1],[8,14],[24,15],[8,30],[16,34]],
 windows:[[10,1,'north'],[22,1,'north'],[1,20,'west'],[39,18,'east'],[11,45,'south'],[27,45,'south']],
 roofs:[[[1,10,7,33],10,'seabloom-long-west-navigation-pier','ramp-z','live:wood'],
 [[25,12,39,23],11,'seabloom-short-east-shipping-arcade','gable-z','pack3:023'],
 [[9,27,23,33],10,'seabloom-rear-cross-arcade','reverse-x','live:wood'],
 [[7,34,29,45],10,'seabloom-wide-archive-vault','hip','live:wood']],
 posts:[[4,16],[4,28],[31,16],[35,20],[12,29],[20,30],[12,39],[23,40]],
 furniture:[[16,8,'unpowered-harbor-beacon-control'],[4,21,'dry-landing-marker'],[30,18,'tide-ledger-empty'],[14,30,'fixed-crosshall-map'],[15,40,'archive-records-cabinet']],
 dependencies:[[19,8,'pack1:002','temperate-structural-wood-candidate']],
 rooms:[['forward-stone-tower-foot',9,2,23,18],['west-long-navigation-pier',2,11,7,32],['east-short-signal-office',25,13,38,22],['back-cross-arcade',10,28,22,32],['rear-archive-gallery',8,35,28,44]],
 portals:[['outside','forward-stone-tower-foot',16,1],['forward-stone-tower-foot','west-long-navigation-pier',8,14],['forward-stone-tower-foot','east-short-signal-office',24,15],['west-long-navigation-pier','back-cross-arcade',8,30],['back-cross-arcade','rear-archive-gallery',16,34]],
 beacon:{stages:[
 ['cap',8,1,24,19,10,10,'live:stone','seabloom-wide-stone-bastion'],
 ['ring',11,4,21,16,11,24,'live:stone','seabloom-great-viewer-tower'],
 ['cap',11,4,21,16,25,25,'live:stone','seabloom-high-arched-shoulder'],
 ['ring',13,6,19,14,26,30,'live:wood','seabloom-wood-crystal-upper-observatory'],
 ['cap',13,6,19,14,31,31,'live:crystal','seabloom-wide-prismatic-upper-roof']],
 finials:[[16,10,32,35,'live:crystal','seabloom-unlit-coastal-prism']]},
 description:'broad skyline tower with one LONG west pier, shorter east arcade, real off-axis connecting back hall and deep archive'
});}

export function getM2JRegional1BPlans(){return [
 rainwoldSpiralNursery(),dunetideSwitchbackGuild(),cloudhookCliffLodge(),
 rimebreakCustomsStarhall(),rootglassCanalMagistracy(),saltbridgeTariffCourt(),
 hailneedleOffsetBeacon(),cragforkBridgeBeacon(),seabloomArcadeBeacon()
];}
