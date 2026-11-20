// Mythwrought Builder 1B M2g — nine original regional services, exact integer XYZ.
// Draft architectural blueprints only. All physical Pack meshes, lantern lighting,
// crop/fishing/economy gameplay, roof certification and upper traversal unresolved.
import {irregular} from './m2-asymmetric-services.mjs';

export function branchglassGardenCourt(){
 const g=irregular('greenhouse','temperate','large','Branchglass Forked Wintergarden Court',35,20,39,
 [[1,1,33,11],[2,12,13,37],[22,12,31,27],[14,28,25,37]],[],7);
 const {open,wallZ,wallX,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [16,17,18])open(x,1);
 wallZ(11,2,32,[7,24],5);wallX(13,28,36,[32],4);wallZ(28,19,25,[25],4);
 glazed([[4,1,'north'],[30,1,'north'],[1,5,'west'],[33,7,'east'],[2,19,'west'],
 [13,20,'east'],[31,18,'east'],[22,19,'west'],[5,37,'south'],[23,37,'south']]);
 roof([1,1,33,11],9,'branchglass-grand-cross-gable','gable-x','pack4:030');
 roof([2,12,13,37],8,'branchglass-west-root-shelter','ramp-z');
 roof([22,12,31,27],9,'branchglass-east-orchid-clerestory','gable-x','pack4:030');
 roof([14,28,25,37],8,'branchglass-rear-botany-house','hip','live:stone');
 bearing([[5,5],[28,5],[6,19],[7,32],[23,18],[27,22],[17,33]],'branchglass-grounded-wood-ribs');
 fit([[7,5,'seed-catalogue-not-crafting'],[27,5,'wintergarden-visitor-bench'],
 [7,19,'unwatered-shade-trays'],[25,19,'orchid-frame-not-growing'],
 [8,32,'botanical-archive-desk'],[22,33,'dry-leaf-case']]);
 room('grand-north-transverse-glass-gallery',2,2,32,11);
 room('west-deep-exhibition-aisle',3,12,12,36);
 room('east-orchid-spur',23,12,30,27);
 room('rear-botany-crosshouse',15,28,24,36);
 portal('outside','grand-north-transverse-glass-gallery',17,1,'three-wide-public-entry');
 portal('grand-north-transverse-glass-gallery','west-deep-exhibition-aisle',7,11);
 portal('grand-north-transverse-glass-gallery','east-orchid-spur',24,11);
 portal('west-deep-exhibition-aisle','rear-botany-crosshouse',13,32);
 portal('east-orchid-spur','rear-botany-crosshouse',25,28);
 return finish('four-wing forked greenhouse and large uncovered central orchard court, crossed gables and divergent glass and wood roofs',
 {growSimulation:false,waterMechanics:false,roofLoadCertified:false});
}
export function sunneedleXerophyteHouse(){
 const g=irregular('greenhouse','desert','medium','Sunneedle Z-Arc Xerophyte Nursery',29,17,33,
 [[1,1,27,9],[11,10,20,20],[3,21,20,31]],[[3,25,5,30]],6);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [13,14,15])open(x,1);
 wallZ(9,12,19,[15],4);wallZ(21,11,19,[15],4);
 glazed([[4,1,'north'],[24,1,'north'],[1,5,'west'],[27,5,'east'],
 [11,15,'west'],[20,16,'east'],[6,31,'south'],[18,31,'south']]);
 roof([1,1,27,9],8,'sunneedle-front-sandstone-arch','ramp-x','live:stone');
 roof([11,10,20,20],8,'sunneedle-narrow-glazed-light-ridge','gable-x','pack4:030');
 roof([3,21,20,31],8,'sunneedle-west-returning-cactus-roof','reverse-z','live:stone');
 bearing([[5,5],[24,5],[13,15],[17,18],[9,25],[17,26]],
 'sunneedle-physical-sandstone-porch-post','live:stone');
 fit([[6,5,'seed-cooling-shelf'],[23,5,'waterless-soil-box'],[14,14,'dry-desert-botany-notebook'],
 [7,26,'nonharvestable-cactus-planter'],[16,26,'sunshade-repair-cabinet']]);
 room('east-west-intake-sun-gallery',2,2,26,9);
 room('middle-offset-growing-neck',12,10,19,20);
 room('west-returning-shaded-nursery',4,21,19,30);
 portal('outside','east-west-intake-sun-gallery',14,1);
 portal('east-west-intake-sun-gallery','middle-offset-growing-neck',15,9);
 portal('middle-offset-growing-neck','west-returning-shaded-nursery',15,21);
 return finish('hand-authored Z-shaped nonrectangular xerophyte glasshouse, crosswise sandstone entry, glassed narrow stem and returning west-bent nursery',
 {irrigation:false,plantHarvest:false});
}
export function keystoneCloudglassHouse(){
 const g=irregular('greenhouse','mountain','small','Keystone Cloudglass Pocket Nursery',23,18,29,
 [[1,1,18,10],[12,11,21,20],[4,19,15,27]],[],6);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [8,9,10])open(x,1);
 wallZ(10,12,17,[15],4);wallZ(20,12,15,[13],4);
 glazed([[4,1,'north'],[16,1,'north'],[1,6,'west'],[18,6,'east'],
 [12,16,'west'],[21,16,'east'],[5,25,'west'],[12,27,'south']]);
 roof([1,1,18,10],8,'keystone-downhill-stone-crossbar','gable-z','live:stone');
 roof([12,11,21,19],8,'keystone-glazed-upper-right-rise','ramp-z','pack4:030');
 roof([4,20,15,27],8,'keystone-rear-left-coldframe','reverse-x','live:wood');
 bearing([[4,5],[15,5],[15,15],[18,17],[8,24]],'keystone-grounded-rock-frame','live:stone');
 fit([[5,5,'retaining-wall-seed-collection'],[14,5,'wool-seal-box'],
 [15,14,'stone-slope-fern-tray'],[9,24,'mountain-rock-collection']]);
 room('lowland-crosswise-seed-visitor-hall',2,2,17,10);
 room('upper-right-glazed-growing-passage',13,11,20,20);
 room('rear-left-coldframe-drying-turn',5,21,14,26);
 portal('outside','lowland-crosswise-seed-visitor-hall',9,1);
 portal('lowland-crosswise-seed-visitor-hall','upper-right-glazed-growing-passage',15,10);
 portal('upper-right-glazed-growing-passage','rear-left-coldframe-drying-turn',13,20);
 return finish('small original backtracking mountain S-bend cloudglass nursery with three differently inclined ridges and a deep garden-side notch',
 {growing:false,engineeringCliffCertification:false});
}
export function saltmoonDryPierLodge(){
 const g=irregular('fishing-lodge','desert','large','Saltmoon Long-Backtracking Pier Lodge',37,20,41,
 [[1,1,35,11],[19,12,27,27],[7,28,32,39]],[[7,35,10,38]],7);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [16,17,18])open(x,1);
 wallZ(11,20,26,[23],4);wallZ(28,19,27,[22],4);
 glazed([[5,1,'north'],[30,1,'north'],[1,6,'west'],[35,6,'east'],
 [19,17,'west'],[27,21,'east'],[11,39,'south'],[29,39,'south']]);
 roof([1,1,35,11],9,'saltmoon-long-cooperative-reception-gable','gable-x','live:stone');
 roof([19,12,27,27],9,'saltmoon-narrow-jetty-net-shade','ramp-z','live:wood');
 roof([7,28,32,39],8,'saltmoon-offset-dry-dock-store','reverse-x','live:stone');
 bearing([[6,5],[31,5],[22,16],[25,23],[13,33],[28,33]],
 'saltmoon-wind-driven-timber-post','live:stone');
 fit([[7,5,'unpowered-fish-ledger'],[30,5,'empty-wagon-net-rack'],
 [23,17,'dry-net-repair-box'],[13,32,'unlaunched-fishing-sloop-plan'],
 [28,34,'salt-soaked-rope-case']]);
 room('long-cooperative-public-wharf-front',2,2,34,11);
 room('drynet-covered-narrow-jetty',20,12,26,27);
 room('backtracking-harbor-dry-storage',8,28,31,38);
 portal('outside','long-cooperative-public-wharf-front',17,1);
 portal('long-cooperative-public-wharf-front','drynet-covered-narrow-jetty',23,11);
 portal('drynet-covered-narrow-jetty','backtracking-harbor-dry-storage',22,28);
 return finish('long desert drying-fish T/Z hybrid: grand public sandstone crossbar, narrow deep pier and far offset warehouse return',
 {fishMechanics:false,liveWater:false,boats:false});
}
export function shalehookSwitchbackLodge(){
 const g=irregular('fishing-lodge','mountain','small','Shalehook Mountain Switchback Net Lodge',23,18,29,
 [[1,1,19,10],[2,11,11,19],[9,20,21,27]],[],6);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [8,9,10])open(x,1);
 wallZ(10,3,11,[7],4);wallZ(20,9,11,[10],4);
 glazed([[4,1,'north'],[16,1,'north'],[1,5,'west'],[19,5,'east'],
 [2,15,'west'],[11,15,'east'],[9,25,'west'],[19,27,'south']]);
 roof([1,1,19,10],8,'shalehook-cliff-front-stone-shed','ramp-x','live:stone');
 roof([2,11,11,19],8,'shalehook-long-west-gear-hall','reverse-z','live:wood');
 roof([9,20,21,27],9,'shalehook-right-return-signal-loft','gable-x','live:stone');
 bearing([[5,5],[16,5],[5,15],[10,17],[13,24]],
 'shalehook-stone-retaining-arch','live:stone');
 fit([[6,5,'rockfish-cooperative-sign'],[15,5,'rope-coiling-shelf'],
 [6,15,'empty-fishing-line-rack'],[16,24,'nonworking-signal-mast']]);
 room('front-wide-cliff-net-reception',2,2,18,10);
 room('left-sheltered-rope-work-branch',3,11,10,19);
 room('rear-overlook-and-weather-shelter',10,20,20,26);
 portal('outside','front-wide-cliff-net-reception',9,1);
 portal('front-wide-cliff-net-reception','left-sheltered-rope-work-branch',7,10);
 portal('left-sheltered-rope-work-branch','rear-overlook-and-weather-shelter',10,20);
 return finish('small offset mountain fishing lodge with an alternating left-right hooked stone/wood and roof triad',
 {cliffAccessApproved:false,fishing:false});
}
export function suncharterRegistryHall(){
 const g=irregular('harbor-office','desert','large','Suncharter Cross-Linked Port Registry',39,20,43,
 [[1,1,37,11],[13,12,23,28],[3,29,30,41],[29,33,37,41]],[],7);
 const {open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [18,19,20])open(x,1);
 wallZ(11,14,22,[18],5);wallZ(29,13,23,[19],4);
 glazed([[5,1,'north'],[33,1,'north'],[1,7,'west'],[37,7,'east'],
 [13,19,'west'],[23,18,'east'],[3,34,'west'],[37,37,'east'],[19,41,'south']]);
 roof([1,1,37,11],9,'suncharter-sandstone-tax-court-crossroof','gable-x','live:stone');
 roof([13,12,23,28],8,'suncharter-narrow-records-bridge','ramp-z','live:wood');
 roof([3,29,30,41],8,'suncharter-crosswise-dock-archives','hip','live:stone');
 roof([31,33,37,41],9,'suncharter-extended-right-watch-arcade','reverse-x','live:wood');
 bearing([[5,5],[34,5],[16,18],[20,25],[7,35],[25,36],[34,37]],
 'suncharter-sandstone-roof-bearing-pier','live:stone');
 fit([[6,5,'permit-counter'],[33,5,'blank-shipping-declaration'],
 [16,19,'chart-register'],[8,35,'harbor-seal-not-working'],
 [24,36,'costal-ships-dry-manifest'],[33,37,'port-watch-command-desk']]);
 room('grand-customs-state-ship-hall',2,2,36,11);
 room('narrow-middle-shipping-records',14,12,22,28);
 room('wide-rear-cross-linked-document-vault',4,29,29,40);
 room('east-rear-permit-watch-room',31,34,36,40);
 portal('outside','grand-customs-state-ship-hall',19,1);
 portal('grand-customs-state-ship-hall','narrow-middle-shipping-records',18,11);
 portal('narrow-middle-shipping-records','wide-rear-cross-linked-document-vault',19,29);
 portal('wide-rear-cross-linked-document-vault','east-rear-permit-watch-room',30,36);
 return finish('long Z-to-cross desert state port office: colossal colonnaded entry, narrow manifest bridge, broad rear records and east-extended watch annex',
 {harborEconomy:false,tradeSimulation:false,portShipControls:false});
}
export function moonharborCrosscloister(){
 const g=irregular('harbor-office','enchanted-forest','large','Moonharbor H-Cloister Port Authority',39,21,43,
 [[1,1,37,10],[1,11,12,39],[26,11,37,39],[12,19,26,27]],[[1,29,3,35]],7);
 const {open,wallZ,wallX,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [18,19,20])open(x,1);
 wallZ(10,2,37,[6,32],4);wallX(12,19,26,[23],4);wallX(26,19,26,[23],4);
 glazed([[5,1,'north'],[32,1,'north'],[1,7,'west'],[37,7,'east'],
 [1,20,'west'],[12,32,'east'],[26,31,'west'],[37,30,'east'],
 [7,39,'south'],[32,39,'south'],[18,19,'north'],[20,27,'south']]);
 roof([1,1,37,10],9,'moonharbor-deep-mariner-inquiry-gable','gable-x','live:wood');
 roof([1,11,12,39],9,'moonharbor-west-chart-annex-shed','ramp-z','live:wood');
 roof([13,19,25,27],9,'moonharbor-transverse-glass-bridge','gable-z','pack4:030');
 roof([26,11,37,39],9,'moonharbor-east-spiral-chapel-hip','reverse-x','live:stone');
 bearing([[5,5],[32,5],[6,17],[7,35],[18,23],[31,17],[33,35]],'moonharbor-root-and-stone-column');
 fit([[6,5,'warden-map-table'],[31,5,'unlit-arcane-shipping-sign'],
 [6,19,'archived-coast-chart'],[8,35,'signal-reed-bundle'],
 [19,23,'waterless-tide-exhibit'],[32,18,'dry-shipwright-scroll'],[32,35,'marsh-port-registration']]);
 room('public-north-coastal-permit-hall',2,2,36,10);
 room('west-long-reed-chart-stacks',2,11,11,38);
 room('skybridge-manifest-crossover',13,20,25,26);
 room('east-long-enchanted-river-authority',27,11,36,38);
 portal('outside','public-north-coastal-permit-hall',19,1);
 portal('public-north-coastal-permit-hall','west-long-reed-chart-stacks',6,10);
 portal('public-north-coastal-permit-hall','east-long-enchanted-river-authority',32,10);
 portal('west-long-reed-chart-stacks','skybridge-manifest-crossover',12,23);
 portal('skybridge-manifest-crossover','east-long-enchanted-river-authority',26,23);
 return finish('true H-shaped, fully branched enchanted port-administration plan with central transverse skylit archive between two independent long gallery wings and open-air north/south courtyards',
 {ships:false,magicalBeacons:false,waterPhysics:false});
}

// Original, source-authored faceted tower outlines. No bogus walkable upper
// chambers or finalized glass/engineering ABI; all actual upper wall cells
// bear on full physical source plates at the exact prior height.
function faceted(x0,x1,z0,z1,chamfer=1){
 const all=new Set(),k=(x,z)=>x+','+z;
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  if(Math.min(x-x0,x1-x)+Math.min(z-z0,z1-z)>=chamfer)all.add(k(x,z));
 const cells=[...all].map(s=>s.split(',').map(Number));
 const edge=cells.filter(([x,z])=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!all.has(k(x+dx,z+dz))));
 return {cells,edge};
}
function plate(b,shape,y,name,material='live:stone'){
 for(const [x,z] of shape.cells)b.put(x,y,z,'roof',material,'none',
  {roofProfile:name,upperWalkable:false,roofBearingCertification:false});
}
function band(b,shape,minY,maxY,name,material='live:stone'){
 for(const [x,z] of shape.edge)for(let y=minY;y<=maxY;y++)b.put(x,y,z,'wall',material,'none',
  {towerProfile:name,upperTraversal:false,engineeringApproval:false});
}
function crenel(b,shape,y,name,asset='live:wood',period=3){
 for(let i=0;i<shape.edge.length;i++)if(i%period===0){
  const [x,z]=shape.edge[i];if(b.clear(x,y,z))
   b.put(x,y,z,'decoration',asset,'none',{purpose:name,upperDeckSafe:false});
 }
}
function slit(b,x,y,z,orientation){
 b.cut(x,y,z);
 b.put(x,y,z,'window','pack4:030',orientation,{slit:true,clearGlassShapeApproved:false});
}
export function brookwatchCrownLight(){
 const g=irregular('lighthouse','temperate','small','Brookwatch Faceted Rose Lantern',25,29,31,
 [[1,1,11,14],[10,9,22,19],[14,20,22,29]],[],7);
 const {b,open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [5,6,7])open(x,1);
 open(11,11);open(17,9);wallZ(19,15,21,[18],4);
 glazed([[3,1,'north'],[9,1,'north'],[1,7,'west'],[11,5,'east'],
  [18,9,'north'],[22,15,'east'],[15,26,'west'],[19,29,'south']]);
 const base=faceted(1,11,1,14,1);
 plate(b,base,8,'brookwatch-base-rising-octagon-roof');
 const first=faceted(2,10,2,13,1);
 band(b,first,9,16,'brookwatch-oak-stone-eight-sided-shaft','live:stone');
 slit(b,6,13,2,'north');slit(b,10,13,7,'east');
 plate(b,first,17,'brookwatch-raised-wood-keepers-balcony','live:wood');
 crenel(b,first,18,'brookwatch-battlement','live:wood',3);
 const upper=faceted(4,8,5,10,0);
 band(b,upper,18,21,'brookwatch-short-openglass-crown','live:wood');
 plate(b,upper,22,'brookwatch-sloped-rosegold-beacon-cap','live:crystal');
 crenel(b,upper,23,'brookwatch-rosegold-mooring-crown','live:stone',2);
 for(let y=23;y<=25;y++)if(b.clear(6,y,7))
  b.put(6,y,7,'decoration','live:crystal','none',{purpose:'brookwatch-unlit-signalfire',beaconOperational:false});
 roof([12,9,22,19],8,'brookwatch-crosswind-keeper-gable','gable-x','live:wood');
 roof([14,20,22,29],8,'brookwatch-rear-flag-chart-pavilion','ramp-z','live:stone');
 bearing([[14,13],[20,13],[16,24],[20,26]],'brookwatch-keeper-office-load-columns','live:wood');
 fit([[6,5,'empty-keeper-signal-stand'],[15,13,'dry-navigation-map'],
 [20,16,'rope-coil-no-crafting'],[17,24,'ledger-shelf']]);
 room('faceted-lantern-ground-foyer',2,2,10,13);
 room('right-angle-keeper-chamber',12,10,21,19);
 room('rear-coastal-flag-store',15,20,21,28);
 portal('outside','faceted-lantern-ground-foyer',6,1);
 portal('faceted-lantern-ground-foyer','right-angle-keeper-chamber',11,11);
 portal('outside','right-angle-keeper-chamber',17,9);
 portal('right-angle-keeper-chamber','rear-coastal-flag-store',18,19);
 return finish('compact temperate lighthouse with physically bevelled octagonal broad base, raised exterior crenels, much narrower timber lantern ring, pointed rose crystal finial and asymmetric rear keeper house',
 {activeLight:false,upperAccessApproved:false,roofLoadCertified:false});
}
export function highcairnForkedSpire(){
 const g=irregular('lighthouse','mountain','large','Highcairn Forked Twin-Horn Gorge Beacon',43,45,45,
 [[1,1,18,20],[16,12,37,27],[27,27,40,43]],[[38,36,40,40]],8);
 const {b,open,wallZ,glazed,roof,bearing,fit,room,portal,finish}=g;
 for(const x of [7,8,9])open(x,1);
 open(18,15);for(const x of [26,27])open(x,12);
 wallZ(27,28,39,[32],5);
 glazed([[4,1,'north'],[14,1,'north'],[1,9,'west'],[18,6,'east'],
  [22,12,'north'],[37,19,'east'],[27,32,'west'],[40,30,'east'],[32,43,'south']]);
 const footprint=faceted(1,18,1,20,2);
 plate(b,footprint,9,'highcairn-fundamental-load-octagonal-stone');
 const first=faceted(2,17,2,19,2);
 band(b,first,10,20,'highcairn-broad-stone-windbreaker-tier','live:stone');
 slit(b,9,15,2,'north');slit(b,17,16,10,'east');
 plate(b,first,21,'highcairn-first-battlement-promontory','live:stone');
 crenel(b,first,22,'highcairn-source-stone-scarp-battlement','live:stone',4);
 const middle=faceted(4,15,4,17,2);
 band(b,middle,22,29,'highcairn-raised-crystalline-watch-chamber','live:wood');
 slit(b,9,25,4,'north');
 plate(b,middle,30,'highcairn-overlook-bifurcation-platform','live:stone');
 // M2h: the two freestanding horns are intentionally offset in BOTH X and Z.
 // The prior parallel 5x7 shafts overlapped in the 844x390 source WebGL view.
 // Both narrower, unequal-height 3D horns stand entirely on the existing y30
 // octagonal source cap; their full projected cube bounds leave visible sky.
 // The stagger is real geometry, not camera, palette or screenshot masking.
 const left=faceted(5,8,12,14,0),right=faceted(10,14,6,8,0);
 band(b,left,31,35,'highcairn-west-forked-stone-pylon','live:stone');
 band(b,right,31,37,'highcairn-east-taller-wind-pylon','live:wood');
 plate(b,left,36,'highcairn-short-west-slate-horn','live:crystal');
 plate(b,right,38,'highcairn-taller-east-sunstone-horn','live:crystal');
 for(let y=37;y<=39;y++)b.put(6,y,13,'decoration','live:stone','none',
  {purpose:'highcairn-short-stone-peak',beaconOperational:false});
 for(let y=39;y<=41;y++)b.put(12,y,7,'decoration','live:crystal','none',
  {purpose:'highcairn-taller-crystal-peak',beaconOperational:false});
 roof([19,12,37,27],10,'highcairn-stepped-gorge-keeper-hall','gable-x','live:stone');
 roof([27,28,40,43],9,'highcairn-crosswind-lodge-and-archive','reverse-z','live:wood');
 bearing([[22,17],[33,19],[30,34],[35,37]],'highcairn-keeper-landing-foundation','live:stone');
 fit([[8,7,'unlit-highcairn-signal-lantern'],[22,18,'cliff-watch-map'],
 [33,20,'unpowered-vertical-gear-locker'],[31,34,'dry-gorge-harbor-register']]);
 room('highcairn-faceted-stone-ground-tower',2,2,17,19);
 room('gorge-watch-keeper-crosshall',19,13,36,27);
 room('eastern-rear-archive-pavilion',28,28,39,42);
 portal('outside','highcairn-faceted-stone-ground-tower',8,1);
 portal('highcairn-faceted-stone-ground-tower','gorge-watch-keeper-crosshall',18,15);
 portal('outside','gorge-watch-keeper-crosshall',27,12);
 portal('gorge-watch-keeper-crosshall','eastern-rear-archive-pavilion',32,27);
 return finish('physically source-built mountain lighthouse crowned by two diagonally staggered, visibly separated unequal-height horns on ONE wide cantilever-uncertified octagonal stepped shaft, asymmetrical stone keeper crosshall and wooded deep rear archive',
 {lightsOperational:false,mountainClimbing:false,hornRoofBearingCertified:false});
}
export function getM2GroveHarbor1BPlans(){
 return [branchglassGardenCourt(),sunneedleXerophyteHouse(),keystoneCloudglassHouse(),
 saltmoonDryPierLodge(),shalehookSwitchbackLodge(),suncharterRegistryHall(),
 moonharborCrosscloister(),brookwatchCrownLight(),highcairnForkedSpire()];
}
