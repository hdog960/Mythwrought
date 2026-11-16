// Mythwrought Builder 1B M2i — nine ORIGINAL coordinate-authored regional
// structures. Explicit authored polygons, roof regions, portal positions and
// asymmetric tower stages. No seeds, copy/mirror, scaling, placement or runtime.
import {irregular} from './m2-asymmetric-services.mjs';

// Every design below is a distinct fixed survey of physical XYZ source cells.
// The small transformer solely implements the literal per-building coordinates.
function authored(d) {
 const g=irregular(d.c,d.b,d.s,d.title,...d.dim,d.parts,d.voids??[],d.wallTop??6);
 for(const [axis,fixed,a,b,doors] of d.partitions??[])
  axis==='z'?g.wallZ(fixed,a,b,doors,4):g.wallX(fixed,a,b,doors,4);
 for(const [x,z] of d.open)g.open(x,z);
 g.glazed(d.windows);
 for(const [rect,y,name,profile,asset] of d.roofs)
  g.roof(rect,y,name,profile,asset);
 g.bearing(d.bear,d.slug+'-full-foundation-roof-posts',
  d.b==='desert'||d.b==='mountain'?'live:stone':'live:wood');
 g.fit(d.furniture);
 // A future material is an actual source-cell candidate with unresolved
 // occupancy. These are NOT approved full-cube collision/placement claims.
 for(const [x,z,asset,purpose] of d.packs??[])
  g.b.put(x,1,z,'furnishing',asset,'north',{purpose,
   physicalGeometryApproved:false,creatorApproval:false});
 for(const [name,x0,z0,x1,z1] of d.rooms)g.room(name,x0,z0,x1,z1);
 for(const [from,to,x,z] of d.portals)g.portal(from,to,x,z);
 if(d.tower)buildTower(g,d.tower);
 return g.finish(d.program,{regionalSourceMilestone:'M2i',
  growing:false,fishing:false,harborEconomy:false,beaconOperational:false,
  physicalPackABIApproved:false,upperTowerTraversalApproved:false,
  roofLoadCertified:false});
}
function buildTower(g,t){
 const {b,has}=g;
 // Each cap is a literal complete source roof surface. Every subsequent
 // upper wall starts directly on a cap one level lower; no floating rings.
 for(const step of t.stages) {
  const [kind,x0,z0,x1,z1,y0,y1,asset,name]=step;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z))throw Error('Tower outside physical source footprint '+name);
   if(kind==='plate'){
    b.put(x,y0,z,'roof',asset,'none',{roofProfile:name,
     towerCap:true,upperWalkable:false,roofLoadCertified:false});
   } else if(x===x0||x===x1||z===z0||z===z1) {
    for(let y=y0;y<=y1;y++)
     if(b.clear(x,y,z))b.put(x,y,z,'wall',asset,'none',
      {towerProfile:name,upperAccess:false,loadCertified:false});
   }
  }
 }
 for(const [x,z,from,to,asset,purpose] of t.finials)
  for(let y=from;y<=to;y++)b.put(x,y,z,'decoration',asset,'none',
   {purpose,beaconOperational:false});
}

export function snowglenGlassCloister(){return authored({
 c:'greenhouse',b:'snow',s:'medium',title:'Snowglen Twin-Court H-Glass Cloister',slug:'snowglen',dim:[29,20,35],
 parts:[[1,1,27,9],[1,10,10,32],[19,10,27,32],[10,21,19,26]],
 open:[[14,1],[6,9],[23,9],[10,23],[19,23]],
 windows:[[4,1,'north'],[25,1,'north'],[1,17,'west'],[27,17,'east'],[5,32,'south'],[23,32,'south']],
 roofs:[[[1,1,27,9],9,'snowglen-broad-thermal-gable','gable-x','pack3:025'],
 [[1,10,10,32],9,'snowglen-west-snowplant-lean','ramp-z','live:wood'],
 [[19,10,27,32],9,'snowglen-east-crystal-ridge','gable-x','pack4:030'],
 [[11,21,18,26],10,'snowglen-sky-crossing','reverse-x','live:stone']],
 bear:[[5,5],[22,5],[5,17],[5,28],[23,17],[23,28],[14,23]],
 furniture:[[7,5,'winter-seed-reading-shelf'],[23,5,'glaze-inspection-stand'],[6,18,'empty-cold-bed'],[22,18,'empty-root-cloche'],[14,24,'open-crosspass-plant-ledger']],
 packs:[[8,6,'pack1:005','unmounted-snowgrain-cornice-candidate']],
 rooms:[['front-snowlock-exhibition',2,2,26,9],['west-long-coldhouse',2,10,9,31],['east-frostleaf-conservatory',20,10,26,31],['short-glazed-crosspass',11,22,18,25]],
 portals:[['outside','front-snowlock-exhibition',14,1],['front-snowlock-exhibition','west-long-coldhouse',6,9],['front-snowlock-exhibition','east-frostleaf-conservatory',23,9],['west-long-coldhouse','short-glazed-crosspass',10,23],['short-glazed-crosspass','east-frostleaf-conservatory',19,23]],
 program:'genuine H-groundplan with TWO uncovered gardens divided by a transverse crystal passage, unequal covered east and west plant aisles'
});}

export function thornwhorlBotanyCourt(){return authored({
 c:'greenhouse',b:'enchanted-forest',s:'medium',title:'Thornwhorl Open-Ring Fernery',slug:'thornwhorl',dim:[31,19,35],
 parts:[[1,1,29,9],[1,10,9,32],[20,10,28,20],[10,25,27,32]],
 open:[[15,1],[5,9],[24,9],[9,28]],
 windows:[[5,1,'north'],[25,1,'north'],[1,17,'west'],[28,14,'east'],[12,32,'south'],[25,32,'south']],
 roofs:[[[1,1,29,9],9,'thornwhorl-front-canopy-ridge','gable-z','pack3:023'],
 [[1,10,9,32],9,'thornwhorl-west-root-ramp','ramp-z','live:wood'],
 [[20,10,28,20],10,'thornwhorl-east-lotus-shed','reverse-x','pack4:030'],
 [[10,25,27,32],8,'thornwhorl-unequal-southern-store','hip','live:wood']],
 bear:[[6,5],[23,5],[5,18],[5,28],[24,15],[15,28],[24,28]],
 furniture:[[7,5,'fern-ledger-table'],[24,5,'reed-curator-desk'],[5,21,'unwatered-forest-fronds'],[23,15,'shade-specimen-tray'],[16,28,'archived-herb-cabinet']],
 packs:[[7,6,'pack2:013','root-bonded-masonry-trim-candidate']],
 rooms:[['north-forest-public-fernery',2,2,28,9],['west-bent-long-specimen-gallery',2,10,8,31],['east-short-orchid-observatory',21,10,27,19],['southern-botany-archive',11,26,26,31]],
 portals:[['outside','north-forest-public-fernery',15,1],['north-forest-public-fernery','west-bent-long-specimen-gallery',5,9],['north-forest-public-fernery','east-short-orchid-observatory',24,9],['west-bent-long-specimen-gallery','southern-botany-archive',9,28]],
 program:'irregular three-sided open ring with shortened east spur, deeply sky-open central grove and rear sideways document store'
});}

export function kestrelSandglassTurn(){return authored({
 c:'greenhouse',b:'desert',s:'small',title:'Kestrel Sandglass Backturn Nursery',slug:'kestrel',dim:[25,17,29],
 parts:[[1,1,22,8],[11,9,19,18],[2,19,14,27]],
 open:[[10,1],[15,8],[12,19]],
 windows:[[4,1,'north'],[20,1,'north'],[1,5,'west'],[22,6,'east'],[19,14,'east'],[3,24,'west'],[12,27,'south']],
 roofs:[[[1,1,22,8],8,'kestrel-sandstone-crossvisor','reverse-x','pack3:024'],
 [[11,9,19,18],9,'kestrel-central-lantern-run','gable-x','pack4:030'],
 [[2,19,14,27],8,'kestrel-backturned-cactus-aisle','ramp-z','live:stone']],
 bear:[[5,4],[19,4],[14,13],[17,16],[6,24],[12,24]],
 furniture:[[7,4,'dry-seed-ledger'],[20,5,'dune-shade-bench'],[15,14,'unused-suntrap-gauge'],[6,23,'dry-prickly-pear-display']],
 packs:[[18,5,'pack5:080','desert-hardened-material-sample']],
 rooms:[['crosswise-public-desert-chamber',2,2,21,8],['offset-solar-growing-stem',12,9,18,18],['left-returning-cold-nursery',3,20,13,26]],
 portals:[['outside','crosswise-public-desert-chamber',10,1],['crosswise-public-desert-chamber','offset-solar-growing-stem',15,8],['offset-solar-growing-stem','left-returning-cold-nursery',12,19]],
 program:'literal right/left/rear S-loop with separately pitched solar lantern ridge, not a scaled L-house'
});}

export function frostquayPinwheelNetStation(){return authored({
 c:'fishing-lodge',b:'snow',s:'large',title:'Frostquay Pinwheel Net Station',slug:'frostquay',dim:[39,21,43],
 parts:[[12,1,27,12],[1,9,11,30],[28,7,37,24],[8,31,31,41]],
 open:[[19,1],[12,10],[27,10],[10,30]],
 windows:[[14,1,'north'],[25,1,'north'],[1,18,'west'],[37,16,'east'],[10,41,'south'],[28,41,'south']],
 roofs:[[[12,1,27,12],10,'frostquay-forward-snowbridge-gable','gable-x','pack3:025'],
 [[1,9,11,30],9,'frostquay-west-net-drying-shed','ramp-z','live:wood'],
 [[28,7,37,24],10,'frostquay-east-watch-pavilion','reverse-x','live:stone'],
 [[8,31,31,41],9,'frostquay-rear-grand-cooperative-roof','gable-z','pack3:025']],
 bear:[[17,5],[23,5],[6,16],[6,26],[32,12],[32,21],[14,36],[26,36]],
 furniture:[[18,6,'frozen-berth-registry'],[24,6,'cold-weather-bench'],[6,21,'dry-net-repair-frame'],[32,18,'stationary-shipping-flag'],[15,35,'net-ledger-no-fishing'],[27,36,'unloaded-stone-sled']],
 packs:[[23,7,'pack1:005','winter-structural-trim-sample']],
 rooms:[['narrow-front-cooperative-hall',13,2,26,12],['long-west-fishing-net-hall',2,10,10,29],['east-watch-workshop',29,8,36,23],['long-rear-dry-freight-hall',9,32,30,40]],
 portals:[['outside','narrow-front-cooperative-hall',19,1],['narrow-front-cooperative-hall','long-west-fishing-net-hall',12,10],['narrow-front-cooperative-hall','east-watch-workshop',27,10],['long-west-fishing-net-hall','long-rear-dry-freight-hall',10,30]],
 program:'wind-pinwheel station with narrow front spindle, radically different left and right covered arms, broad rear cooperative and actual open diagonal sky areas'
});}

export function willowwhorlRiverGuild(){return authored({
 c:'fishing-lodge',b:'enchanted-forest',s:'large',title:'Willowwhorl Split-Estuary River Guild',slug:'willowwhorl',dim:[39,21,45],
 parts:[[1,1,37,10],[1,11,11,38],[25,11,37,30],[7,31,28,43]],
 open:[[19,1],[6,10],[31,10],[9,31],[27,31]],
 windows:[[5,1,'north'],[32,1,'north'],[1,21,'west'],[37,18,'east'],[9,43,'south'],[25,43,'south']],
 roofs:[[[1,1,37,10],9,'willowwhorl-deep-market-crossroof','gable-x','live:wood'],
 [[1,11,11,38],9,'willowwhorl-timber-left-netwalk','ramp-z','pack3:023'],
 [[25,11,37,30],10,'willowwhorl-root-gallery-highroof','gable-z','live:wood'],
 [[12,31,28,43],9,'willowwhorl-rear-river-charter-house','hip','pack3:023'],
 [[7,39,11,43],9,'willowwhorl-rear-west-return-gable','gable-z','live:wood']],
 bear:[[6,5],[32,5],[6,18],[6,34],[31,18],[31,27],[13,36],[23,36]],
 furniture:[[7,5,'empty-creel-inspection'],[32,6,'fisherman-guild-ledger'],[6,24,'nonfunctional-netting-frame'],[31,21,'reed-bound-knot-bench'],[14,36,'charter-map-stack'],[24,36,'dry-boat-plan']],
 packs:[[8,7,'pack2:013','stone-marsh-binding-specimen']],
 rooms:[['great-river-trade-hall',2,2,36,10],['west-long-reed-gathering-hall',2,11,10,37],['east-raise-root-keeper-wing',26,11,36,29],['southern-river-records-pavilion',8,32,27,42]],
 portals:[['outside','great-river-trade-hall',19,1],['great-river-trade-hall','west-long-reed-gathering-hall',6,10],['great-river-trade-hall','east-raise-root-keeper-wing',31,10],['west-long-reed-gathering-hall','southern-river-records-pavilion',9,31],['east-raise-root-keeper-wing','southern-river-records-pavilion',27,31]],
 program:'four-sided broken double-court waterfront guild with disconnected eave lines, physically traversable covered routes and asymmetric dry-boathouse massing'
});}

export function cragchainCustomsBureau(){return authored({
 c:'harbor-office',b:'mountain',s:'large',title:'Cragchain Terraced Customs Bureau',slug:'cragchain',dim:[43,22,45],
 parts:[[1,1,41,11],[18,12,28,27],[3,28,22,43],[29,23,40,39]],
 open:[[21,1],[23,11],[20,28],[28,25]],
 windows:[[5,1,'north'],[37,1,'north'],[1,7,'west'],[41,7,'east'],[18,18,'west'],[3,36,'west'],[40,32,'east'],[10,43,'south']],
 roofs:[[[1,1,41,11],10,'cragchain-stone-customs-grand-front','gable-x','pack3:025'],
 [[18,12,28,27],9,'cragchain-sloping-manifest-bridge','ramp-z','live:stone'],
 [[3,28,22,43],10,'cragchain-rear-west-cliff-archive','reverse-x','live:wood'],
 [[29,23,40,39],11,'cragchain-east-high-watch-wing','gable-z','live:stone']],
 bear:[[7,5],[35,5],[21,17],[24,23],[8,34],[18,38],[33,28],[35,35]],
 furniture:[[9,5,'unissued-stone-dock-permit'],[36,6,'unfilled-cliff-shipping-log'],[23,19,'unpaid-tariff-record'],[8,35,'anchor-plan-stack'],[34,31,'vertical-signal-desk']],
 packs:[[32,6,'pack1:006','mountain-structural-stone-sample']],
 rooms:[['wide-front-state-reception',2,2,40,11],['slender-center-permit-bridge',19,12,27,27],['broad-west-cliff-ledgers',4,29,21,42],['east-suspended-signal-office',30,24,39,38]],
 portals:[['outside','wide-front-state-reception',21,1],['wide-front-state-reception','slender-center-permit-bridge',23,11],['slender-center-permit-bridge','broad-west-cliff-ledgers',20,28],['slender-center-permit-bridge','east-suspended-signal-office',28,25]],
 program:'huge mountain sideways state hall with long narrow bridge, double-elevation wings and two genuinely open uneven courts, no ships or active tariffs'
});}

export function frostmarkTQuayRegistry(){return authored({
 c:'harbor-office',b:'snow',s:'small',title:'Frostmark Offset Ice-Quay Registry',slug:'frostmark',dim:[25,17,29],
 parts:[[1,1,23,9],[1,10,9,25],[15,10,23,27],[9,20,15,24]],
 open:[[12,1],[5,9],[19,9],[9,22],[15,22]],
 windows:[[4,1,'north'],[20,1,'north'],[1,15,'west'],[23,16,'east'],[4,25,'south'],[20,27,'south']],
 roofs:[[[1,1,23,9],8,'frostmark-front-winter-customs-gable','gable-x','pack3:025'],
 [[1,10,9,25],8,'frostmark-west-snow-statutes-ramp','ramp-z','live:wood'],
 [[15,10,23,27],9,'frostmark-east-ice-cargo-hip','hip','live:stone'],
 [[10,20,14,24],10,'frostmark-center-bridge-lean','reverse-x','pack4:030']],
 bear:[[5,5],[20,5],[5,16],[5,22],[19,15],[19,24],[12,22]],
 furniture:[[6,5,'ice-ferry-document-box'],[19,5,'dry-trade-stamp'],[5,17,'frozen-port-manifest'],[19,18,'quay-light-not-powered'],[12,23,'dry-ship-chart']],
 packs:[[7,6,'pack1:005','winter-beam-trim-candidate']],
 rooms:[['front-winter-shipping-desk',2,2,22,9],['west-document-wing',2,10,8,24],['east-dry-cargo-office',16,10,22,26],['short-mid-crossing',10,21,14,23]],
 portals:[['outside','front-winter-shipping-desk',12,1],['front-winter-shipping-desk','west-document-wing',5,9],['front-winter-shipping-desk','east-dry-cargo-office',19,9],['west-document-wing','short-mid-crossing',9,22],['short-mid-crossing','east-dry-cargo-office',15,22]],
 program:'snowbound compact twin-wing registry with a high glazed physical crosspass and actually absent central near/far courts'
});}

export function sunscarTurnBeacon(){return authored({
 c:'lighthouse',b:'desert',s:'medium',title:'Sunscar Quarterturn Signal Cairn',slug:'sunscar',dim:[31,35,37],wallTop:7,
 parts:[[1,1,13,16],[11,9,29,18],[20,19,29,35]],
 open:[[6,1],[13,12],[23,18]],
 windows:[[4,1,'north'],[1,8,'west'],[13,6,'east'],[27,9,'north'],[29,14,'east'],[25,35,'south']],
 roofs:[[[14,9,29,18],9,'sunscar-side-trade-keeper-shade','ramp-x','pack3:024'],
 [[20,19,29,35],9,'sunscar-rear-navigation-house','gable-z','live:stone']],
 bear:[[17,13],[25,13],[23,24],[26,31]],
 furniture:[[6,7,'unlit-dune-beacon-control'],[18,13,'dry-anchor-compass'],[25,14,'sand-chart-shelf'],[23,27,'unpowered-tide-archive']],
 packs:[[17,14,'pack5:080','desert-hardened-sandstone-trim']],
 rooms:[['broad-base-signal-lobby',2,2,12,15],['right-angled-keeper-admin',14,10,28,18],['rear-navigation-archive',21,20,28,34]],
 portals:[['outside','broad-base-signal-lobby',6,1],['broad-base-signal-lobby','right-angled-keeper-admin',13,12],['right-angled-keeper-admin','rear-navigation-archive',23,18]],
 tower:{stages:[
 ['plate',1,1,13,16,8,8,'live:stone','sunscar-thick-foundation-podium'],
 ['ring',2,2,11,14,9,20,'live:stone','sunscar-first-sandstone-chamfer-tier'],
 ['plate',2,2,11,14,21,21,'live:stone','sunscar-wide-shadow-balcony'],
 ['ring',4,4,9,12,22,26,'live:wood','sunscar-tall-narrow-glassless-lantern'],
 ['plate',4,4,9,12,27,27,'live:crystal','sunscar-flat-suncrystal-cap']],
 finials:[[7,8,28,30,'live:crystal','sunscar-inert-signal-disk']]},
 program:'distinct compact three-tier forward beacon, broad sandstone platform, recessed narrow watch ring and long right-angle rear archive, no climb or active light'
});}

export function wyrmrootCrownLantern(){return authored({
 c:'lighthouse',b:'enchanted-forest',s:'medium',title:'Wyrmroot Crown Lantern House',slug:'wyrmroot',dim:[35,37,39],wallTop:7,
 parts:[[1,1,13,17],[11,10,31,21],[19,22,31,37]],
 open:[[6,1],[13,13],[24,21]],
 windows:[[5,1,'north'],[1,9,'west'],[13,6,'east'],[26,10,'north'],[31,17,'east'],[27,37,'south']],
 roofs:[[[14,10,31,21],10,'wyrmroot-angled-rootkeeper-crossroof','gable-x','pack3:023'],
 [[19,22,31,37],9,'wyrmroot-long-hanging-river-archive','reverse-z','live:wood']],
 bear:[[17,15],[27,15],[23,28],[28,33]],
 furniture:[[6,7,'unlit-woodmoon-lantern'],[19,14,'reed-astronomy-reference'],[27,16,'dried-signal-plant-press'],[23,29,'silent-forest-port-ledger']],
 packs:[[20,17,'pack2:013','enchanted-wallstone-inscription-candidate']],
 rooms:[['broad-treebase-hollow',2,2,12,16],['gabled-rootkeeper-signal-hall',14,11,30,21],['deep-forest-navigation-loggia',20,22,30,36]],
 portals:[['outside','broad-treebase-hollow',6,1],['broad-treebase-hollow','gabled-rootkeeper-signal-hall',13,13],['gabled-rootkeeper-signal-hall','deep-forest-navigation-loggia',24,21]],
 tower:{stages:[
 ['plate',1,1,13,17,8,8,'live:wood','wyrmroot-first-woodmoon-base-dais'],
 ['ring',3,3,11,15,9,19,'live:wood','wyrmroot-rootbound-narrow-frame'],
 ['plate',3,3,11,15,20,20,'live:stone','wyrmroot-deep-crown-observation-ring'],
 ['ring',5,5,9,12,21,29,'live:wood','wyrmroot-tall-central-lantern-column'],
 ['plate',5,5,9,12,30,30,'live:crystal','wyrmroot-moon-glass-crown']],
 finials:[[7,8,31,34,'live:crystal','wyrmroot-inert-blue-moon-cap']]},
 program:'narrow tree-root centered vertical lantern with tall crystal crown, asymmetric two-part gabled lodge, real lower-floor access and no alleged upper floor climb'
});}

export function getM2IRegional1BPlans(){return [
 snowglenGlassCloister(),thornwhorlBotanyCourt(),kestrelSandglassTurn(),
 frostquayPinwheelNetStation(),willowwhorlRiverGuild(),
 cragchainCustomsBureau(),frostmarkTQuayRegistry(),
 sunscarTurnBeacon(),wyrmrootCrownLantern()
];}
