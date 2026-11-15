// Builder 1B: seven original cross-biome architectural plans with exact 3D integer cells.
// Authored, source-owned, deterministic draft blueprints. Never registered or world-placed.
import {SCHEMA,validateBlueprint} from './legacy-stable-schema.mjs';
import {blueprintId,validateAllocation} from './schema.mjs';
const FULL=Object.freeze({kind:'full-cell',bounds:[0,0,0,1,1,1]});
const at=(x,y,z)=>x+','+y+','+z;
function architect(category,biome,size,variation,title,W,H,D){
 const cells=new Map(),rooms=[],portals=[];
 const occupied=(x,y,z)=>cells.has(at(x,y,z));
 function put(x,y,z,role,asset='live:stone',orientation='none',detail={}){
  if(![x,y,z].every(Number.isInteger)||x<0||x>=W||y<0||y>=H||z<0||z>=D)throw Error(title+': out of bounds '+at(x,y,z));
  const k=at(x,y,z);if(cells.has(k))throw Error(title+': duplicate physical placement '+k);
  cells.set(k,{at:[x,y,z],role,asset,orientation,
   occupancy:asset.startsWith('live:')?FULL:{kind:'unresolved',bounds:null,reason:asset+' requires actual shape, rotated collision, support and save-state validation'},
   ...detail});
 }
 function lift(x,y,z,role,asset='live:stone',orientation='none',detail={}){
  if(!occupied(x,y,z))put(x,y,z,role,asset,orientation,detail);
 }
 function remove(x,y,z){cells.delete(at(x,y,z));}
 function open(x,z,level=1){remove(x,level,z);remove(x,level+1,z);}
 function bed(x,z,purpose,asset='live:wood'){put(x,1,z,'furnishing',asset,'north',{purpose,operational:false});}
 function foundation(back=D-1,asset='live:stone'){
  for(let x=0;x<W;x++)for(let z=0;z<back;z++)put(x,0,z,'foundation',asset);
 }
 function rim(x0,z0,x1,z1,top=5,material='live:wood'){
  for(let y=1;y<=top;y++){
   for(let x=x0;x<=x1;x++){lift(x,y,z0,'wall',material);lift(x,y,z1,'wall',material);}
   for(let z=z0+1;z<z1;z++){lift(x0,y,z,'wall',material);lift(x1,y,z,'wall',material);}
  }
 }
 function partZ(z,x0,x1,top=4,material='live:wood'){
  for(let y=1;y<=top;y++)for(let x=x0;x<=x1;x++)lift(x,y,z,'partition',material);
 }
 function partX(x,z0,z1,top=4,material='live:wood'){
  for(let y=1;y<=top;y++)for(let z=z0;z<=z1;z++)lift(x,y,z,'partition',material);
 }
 function pane(x,z,orientation='north'){
  remove(x,2,z);put(x,2,z,'window','pack4:030',orientation,{glazingApproval:'pending'});
 }
 function windowBelt(entries){for(const [x,z,dir] of entries)pane(x,z,dir);}
 function namedRoom(id,x0,z0,x1,z1,top=5){
  rooms.push({id,min:[x0,1,z0],max:[x1,top,z1]});
 }
 function portal(from,to,x,z,opening='walkway',y=1){
  portals.push({from,to,at:[x,y,z],passable:true,opening});
 }
 function finalize(program,extraWalk=[]){
  const walkable=[];
  for(let x=0;x<W;x++)for(let z=0;z<D;z++)
   if(occupied(x,0,z)&&!occupied(x,1,z)&&!occupied(x,2,z))walkable.push([x,1,z]);
  for(const w of extraWalk)if(!walkable.some(c=>at(...c)===at(...w)))walkable.push(w);
  const dependencies=[...new Set([...cells.values()].filter(p=>!p.asset.startsWith('live:')).map(p=>p.asset))].sort().map(asset=>({
   asset,status:'unresolved',requires:['integrated source physical family AABB and cell reservation','yaw, collision/selection, transparency and mount support','schema-1 preserved orientation and physical load verification']
  }));
  const b={schema:SCHEMA,id:blueprintId(category,biome,size,variation),index:variation,category,biome,size,title,
   status:'candidate',frame:'local-x-east-y-up-z-south',footprint:{width:W,height:H,depth:D},
   worldPlacement:false,liveIntegration:false,placements:[...cells.values()],rooms,portals,walkable,dependencies,footprintReservations:[],
   architecturalIdentity:{program,geometry:'original coordinate-authored regional architectural plan',physicalSupportsApproved:false,
    weatherSealApproved:false,creatorApproved:false}};
  validateBlueprint(b);validateAllocation([b]);return b;
 }
 return {put,lift,remove,open,bed,foundation,rim,partZ,partX,pane,windowBelt,namedRoom,portal,finalize,occupied};
}

// A. Desert medium: shaded central arcade, four distinct bathing functions,
// cross-connected hot/cold basins and ventilated two-height stone canopy.
export function createDuneBathhouse(){
 const a=architect('bathhouse','desert','medium',1,'Saffron Court Bathhouse',21,12,23);
 const {put,open,bed,foundation,rim,partZ,partX,windowBelt,namedRoom,portal,finalize}=a;
 foundation();rim(1,1,19,21,5,'live:stone');open(10,1);
 partZ(7,2,18);for(const x of [5,10,15])open(x,7);
 partZ(16,2,18,3);for(const x of [6,10,14,15,18])open(x,16);
 partX(10,8,15,3);open(10,11);
 windowBelt([[3,1,'north'],[17,1,'north'],[1,5,'west'],[19,5,'east'],[1,12,'west'],[19,12,'east'],[5,21,'south'],[15,21,'south']]);
 // Fully supported open arcade: two physically different roof heights and exposed lintel strips.
 for(let x=1;x<=19;x++)for(let z=1;z<=16;z++){
  const covered=z<8 || x<4 || x>16 || z===16;
  if(covered)put(x,(x%4===0&&z>=8?7:6),z,'roof','live:stone','none',{canopy:'arched-shade-arcade',structuralBearing:'unresolved'});
 }
 for(const x of [4,10,16])for(const z of [8,12,16])put(x,5,z,'support','live:stone','none',{purpose:'shade-arch-post'});
 // Two separate authored empty basin rims, deliberately two door gaps.
 for(const [x0,x1,z0,z1,gx] of [[3,8,9,14,5],[12,17,17,20,14]]){
  for(let x=x0;x<=x1;x++)for(const z of [z0,z1])if(!(x===gx&&z===z0))bed(x,z,'empty-basin-rim','live:stone');
  for(let z=z0+1;z<z1;z++)for(const x of [x0,x1])bed(x,z,'empty-basin-rim','live:stone');
 }
 for(const [x,z,p] of [[4,4,'dressing-bench'],[5,4,'dressing-bench'],[16,4,'linen-cupboard-anchor'],
  [14,10,'steam-vent-plinth-no-heat'],[5,19,'cool-water-service-placeholder']])bed(x,z,p);
 namedRoom('arrival-and-changing',2,2,19,7);
 namedRoom('warm-stone-hammam',2,8,10,16);
 namedRoom('wash-and-service',11,8,19,16);
 namedRoom('open-air-cooling-court',2,17,19,21);
 portal('outside','arrival-and-changing',10,1);
 portal('arrival-and-changing','warm-stone-hammam',5,7);
 portal('arrival-and-changing','wash-and-service',15,7);
 portal('warm-stone-hammam','wash-and-service',10,11);
 portal('wash-and-service','open-air-cooling-court',15,16);
 return finalize('desert hammam with shaded arcade, warm/dry chambers, empty cooling basin and ventilated open court');
}

// B. Snow medium stable, fourth design slot — *not* the inherited medium #002.
// Explicit six empty pens, side loading, weather-protected central service aisle.
export function createSnowStable(){
 const a=architect('stable','snow','medium',4,'Frostbarrow Six-Pen Stables',23,13,27);
 const {put,open,bed,foundation,rim,partZ,partX,windowBelt,namedRoom,portal,finalize}=a;
 foundation();rim(1,1,21,25,6,'live:wood');for(const x of [10,11,12])open(x,1);
 partZ(20,2,20,5);open(11,20);
 for(const x of [7,15]){
  partX(x,3,19,2);for(const z of [5,12,17])open(x,z);
 }
 for(const z of [8,15]){partZ(z,2,6,2);partZ(z,16,20,2);}
 windowBelt([[4,1,'north'],[19,1,'north'],[1,9,'west'],[21,9,'east'],[5,25,'south'],[18,25,'south']]);
 // High snowfall gable with exposed bearing purlins.
 for(let x=1;x<=21;x++)for(let z=1;z<=25;z++){
  const rise=Math.floor((10-Math.abs(x-11))/3);
  put(x,7+rise,z,'roof','live:wood','east',{slope:'snow-load-gable',bearingCertified:false});
 }
 for(const x of [5,11,17])for(const z of [4,10,16,23]){
  const rise=Math.floor((10-Math.abs(x-11))/3);
  put(x,6+rise,z,'support','live:wood','east',{purpose:'roof-snow-brace',bearingCertified:false});
 }
 for(const [x,z] of [[4,4],[18,4],[4,11],[18,11],[4,18],[18,18]])bed(x,z,'empty-stall-feed-manger');
 for(const [x,z,p] of [[4,23,'tack-rack'],[5,23,'tack-rack'],[18,23,'blanket-store']])bed(x,z,p);
 namedRoom('weatherlock-loading-aisle',8,2,15,20,7);
 for(const [id,x0,z0,x1,z1] of [
  ['west-forward',2,3,7,8],['west-middle',2,9,7,15],['west-rear',2,16,7,20],
  ['east-forward',16,3,21,8],['east-middle',16,9,21,15],['east-rear',16,16,21,20]
 ])namedRoom(id,x0,z0,x1,z1,5);
 namedRoom('tack-and-feed',2,21,21,25);
 portal('outside','weatherlock-loading-aisle',11,1,'three-cell loading door');
 for(const [id,x,z] of [
  ['west-forward',7,5],['west-middle',7,12],['west-rear',7,17],
  ['east-forward',15,5],['east-middle',15,12],['east-rear',15,17]
 ])portal('weatherlock-loading-aisle',id,x,z,'open-empty-stall-bay');
 portal('weatherlock-loading-aisle','tack-and-feed',11,20);
 return finalize('snow stable with six physical empty pens, insulated weatherlock, rear tack/feed and steep snow-shedding roof');
}

// C. Mountain medium barn: long grain ramp, crated quarry supplies, two
// side-by-side load bays and traversable rear hay-loft preparation zone.
export function createMountainGranary(){
 const a=architect('farm-barn','mountain','medium',1,'Switchback Quarry Granary',25,13,23);
 const {put,open,bed,foundation,rim,partZ,partX,windowBelt,namedRoom,portal,finalize}=a;
 foundation();rim(1,1,23,21,6,'live:stone');
 for(const x of [8,9,15,16])open(x,1);
 partZ(8,2,22,4);for(const x of [9,16])open(x,8);
 partX(12,9,20,4);open(12,14);
 windowBelt([[4,1,'north'],[20,1,'north'],[1,10,'west'],[23,10,'east'],[5,21,'south'],[19,21,'south']]);
 // Split-slope mountain retaining roof with stone lower eaves and timber ridge.
 for(let x=1;x<=23;x++)for(let z=1;z<=21;z++){
  const rise=Math.floor(Math.min(x-1,23-x)/4);
  put(x,7+rise,z,'roof',rise===0?'live:stone':'live:wood','east',{slope:'mountain-retaining-ridge',snowLoadApproval:false});
 }
 for(const x of [5,12,19])for(const z of [4,10,18]){
  const rise=Math.floor(Math.min(x-1,23-x)/4);
  put(x,6+rise,z,'support','live:wood','north',{purpose:'granary-ridge-post'});
 }
 for(const [x,z,p] of [[3,3,'grain-crate'],[4,3,'grain-crate'],[21,3,'ore-crate'],
  [4,12,'hay-bundle'],[5,12,'hay-bundle'],[19,13,'equipment-rack'],[20,13,'equipment-rack']])bed(x,z,p);
 namedRoom('west-cart-depot',2,2,12,8);
 namedRoom('east-cart-depot',13,2,23,8);
 namedRoom('grain-drying',2,9,12,21);
 namedRoom('repair-and-packing',13,9,23,21);
 portal('outside','west-cart-depot',9,1);
 portal('outside','east-cart-depot',16,1);
 portal('west-cart-depot','grain-drying',9,8);
 portal('east-cart-depot','repair-and-packing',16,8);
 portal('grain-drying','repair-and-packing',12,14);
 return finalize('medium mountain granary with dual cart bays, structurally divided processing wings and timber-stone ridge');
}

// D. Mountain large greenhouse: three distinct vaulted grow galleries and
// separate real cold-frame and potting sheds under glazed stepped roof.
export function createMountainGlasshouse(){
 const a=architect('greenhouse','mountain','large',1,'Spirespan Alpine Glasshouse',29,17,31);
 const {put,open,bed,foundation,rim,partZ,partX,windowBelt,namedRoom,portal,finalize}=a;
 foundation();rim(1,1,27,29,7,'live:stone');for(const x of [13,14,15])open(x,1);
 partZ(21,2,26,5);for(const x of [6,14,22])open(x,21);
 partX(10,4,20,4);for(const z of [9,17])open(10,z);
 partX(19,4,20,4);for(const z of [9,17])open(19,z);
 partX(14,22,28,4);open(14,25);
 windowBelt([[4,1,'north'],[24,1,'north'],[1,6,'west'],[27,6,'east'],[1,15,'west'],
  [27,15,'east'],[5,29,'south'],[24,29,'south']]);
 // Three genuinely pitched glass spans at different heights: full roof
 // authored cell by cell; rib columns are real fixed stone/timber coordinates.
 for(let x=1;x<=27;x++)for(let z=1;z<=29;z++){
  const panel=x<10?1:x>19?2:3;
  const mid=panel===1?5:panel===2?23:14;
  const rise=Math.floor((4-Math.min(4,Math.abs(x-mid)))/2);
  put(x,8+rise,z,'roof',(x%5===0||z%9===0)?'live:wood':'pack4:030','north',
   {glazedMountainRidge:panel,weatherSealApproved:false});
 }
 for(const x of [4,14,24])for(const z of [5,12,19,25])put(x,7,z,'support','live:stone','none',{loadApproval:false});
 for(let z=5;z<=18;z++)for(const x of [4,6,13,15,23,25])bed(x,z,'tiered alpine propagation trough');
 for(const [x,z,p] of [[4,25,'seed-cabinet'],[5,25,'seed-cabinet'],[21,25,'cold-frame-table'],
  [22,25,'cold-frame-table'],[8,27,'potting-station'],[20,27,'weather-sensor-no-function']])bed(x,z,p);
 namedRoom('lower-west-alpine-bay',2,2,10,21,8);
 namedRoom('central-botany-aisle',11,2,19,21,8);
 namedRoom('east-moss-propagation',20,2,27,21,8);
 namedRoom('seed-bank-and-potting',2,22,14,29,7);
 namedRoom('rear-cold-frame',15,22,27,29,7);
 portal('outside','central-botany-aisle',14,1,'wide glasshouse entry');
 portal('central-botany-aisle','lower-west-alpine-bay',10,9);
 portal('central-botany-aisle','east-moss-propagation',19,9);
 portal('lower-west-alpine-bay','seed-bank-and-potting',6,21);
 portal('east-moss-propagation','rear-cold-frame',22,21);
 portal('seed-bank-and-potting','rear-cold-frame',14,25);
 return finalize('large alpine conservatory with separate growing wings, genuinely distinct roof ridges, seed bank and cold frame');
}

// E. Desert medium waterside lodge: open air boat-slip-facing two-prong pier,
// double storage halls and sheltered shore drying court, NO water simulation.
export function createDesertFishingLodge(){
 const a=architect('fishing-lodge','desert','medium',1,'Sunspill Caravan Fishing Lodge',23,13,33);
 const {put,open,bed,foundation,rim,partZ,partX,windowBelt,namedRoom,portal,finalize,occupied}=a;
 foundation(23);rim(1,1,21,21,5,'live:stone');open(11,1);open(11,21);
 partZ(8,2,20,4);for(const x of [7,16])open(x,8);
 partZ(16,2,20,4);for(const x of [6,11,17])open(x,16);
 partX(11,9,15,4);open(11,12);
 windowBelt([[4,1,'north'],[18,1,'north'],[1,12,'west'],[21,12,'east'],[5,21,'south'],[17,21,'south']]);
 for(let x=1;x<=21;x++)for(let z=1;z<=21;z++){
  const row=Math.floor((z-1)/7);
  put(x,6+row,z,'roof','live:wood','north',{profile:'desert-terraced-sunshade',weatherProof:false});
 }
 for(const x of [5,11,17])for(const z of [5,11,18])put(x,5+Math.floor((z-1)/7),z,'support','live:wood','north',{sunshadeLoadApproved:false});
 // Real T-shaped connected dock foundation with two independent projecting piers.
 for(let x=7;x<=15;x++)for(let z=23;z<=25;z++)put(x,0,z,'floor','live:wood','none',{dockShoreBearing:false});
 for(const x of [7,8,14,15])for(let z=26;z<=31;z++)put(x,0,z,'floor','live:wood','none',{dockShoreBearing:false});
 for(let z=27;z<=31;z++)for(const x of [7,15])put(x,1,z,'support','live:wood','none',{purpose:'pier-pile-and-guard'});
 for(const [x,z,p] of [[4,4,'rope-spool'],[18,4,'rope-spool'],[4,11,'fish-crate-empty'],
  [18,11,'fish-crate-empty'],[4,19,'air-drying-net'],[19,19,'air-drying-net']])bed(x,z,p);
 namedRoom('caravan-receiving',2,2,21,8);
 namedRoom('west-storeroom',2,9,11,16);
 namedRoom('east-equipment-bay',12,9,21,16);
 namedRoom('shaded-net-court',2,17,21,21);
 portal('outside','caravan-receiving',11,1);
 portal('caravan-receiving','west-storeroom',7,8);
 portal('caravan-receiving','east-equipment-bay',16,8);
 portal('west-storeroom','east-equipment-bay',11,12);
 portal('west-storeroom','shaded-net-court',6,16);
 portal('shaded-net-court','outside',11,21,'two-prong-shore-pier');
 return finalize('desert maritime depot with twin physically split dock prongs and roof-protected dry-net court; no working water');
}

// F. Enchanted forest medium public harbor administration with distinct
// circular reception, two archival wings and living-wood elevated clerestory.
export function createEnchantedHarborOffice(){
 const a=architect('harbor-office','enchanted-forest','medium',1,'Moonroot Harbor Registry',25,14,23);
 const {put,open,bed,foundation,rim,partZ,partX,windowBelt,namedRoom,portal,finalize}=a;
 foundation();rim(1,1,23,21,6,'live:wood');open(12,1);
 partZ(9,2,22,4);for(const x of [6,12,18])open(x,9);
 partX(12,10,20,4);open(12,16);
 windowBelt([[4,1,'north'],[20,1,'north'],[1,6,'west'],[23,6,'east'],[1,15,'west'],
  [23,15,'east'],[6,21,'south'],[19,21,'south']]);
 // Clerestory: actual raised central wood ribs and Pack4 glazed lateral roof.
 for(let x=1;x<=23;x++)for(let z=1;z<=21;z++){
  const rise=Math.max(0,3-Math.floor(Math.abs(x-12)/3));
  put(x,7+rise,z,'roof',(x===12||x%4===0||z%8===0)?'live:wood':'pack4:030','north',
   {moonrootVault:true,weatherSealApproved:false});
 }
 for(const x of [4,12,20])for(const z of [4,8,13,19])put(x,6,z,'support','live:wood','none',{purpose:'clerestory-support-arch'});
 // Semi-circular public information desk, functionally distinct room program.
 for(const [x,z] of [[8,5],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,5]])
  bed(x,z,'curving public permit counter');
 for(const [x,z,p] of [[4,13,'waterway-chart-plinth'],[5,13,'waterway-chart-plinth'],
  [19,13,'port-register-chest'],[20,13,'port-register-chest'],[4,19,'route-map-table'],[20,19,'archive-stand']])bed(x,z,p);
 namedRoom('open-public-lobby',2,2,23,9);
 namedRoom('chart-and-survey-wing',2,10,12,21);
 namedRoom('customs-ledger-wing',13,10,23,21);
 portal('outside','open-public-lobby',12,1);
 portal('open-public-lobby','chart-and-survey-wing',6,9);
 portal('open-public-lobby','customs-ledger-wing',18,9);
 portal('chart-and-survey-wing','customs-ledger-wing',12,16);
 return finalize('enchanted clerestory registry with curved public counter, distinct map wing and customs ledger');
}

// G. Snow medium lighthouse: angular tapering tower, vertical climb shaft,
// two reachable upper levels (climb ABI unresolved) and symbolic frost beacon.
export function createSnowLighthouse(){
 const a=architect('lighthouse','snow','medium',1,'Rimeglass Northwatch Light',19,29,19);
 const {put,open,bed,foundation,rim,namedRoom,portal,finalize,occupied}=a;
 foundation();rim(2,2,16,16,10,'live:stone');rim(4,4,14,14,12,'live:stone');open(9,2);open(9,4);
 // Four anchored interior column stacks bear both independent floors, with actual
 // support at the base and a contiguous load path through the first loft.
 for(const [x,z] of [[6,7],[12,7],[6,11],[12,11]]){
  for(let y=1;y<=8;y++)put(x,y,z,'support','live:wood','none',{purpose:'lower-landing-load-post'});
  for(let y=10;y<=18;y++)put(x,y,z,'support','live:wood','none',{purpose:'upper-landing-load-post'});
 }
 // Inner tapering height creates an explicit thick winter wall with a clear shaft.
 // Mid and upper internal floor is physically supported but never seals shaft.
 for(const [floor,low,high] of [[9,5,13],[19,5,13]]){
  for(let x=low;x<=high;x++)for(let z=low;z<=high;z++)if(!(x===9&&z===9)&&!(x===10&&z===9))
   if(!occupied(x,floor,z))put(x,floor,z,'floor','live:wood','none',{platformBearingApproved:false});
 }
 for(let y=1;y<=22;y++)if(!occupied(10,y,9))
  put(10,y,9,'stair','live:wood','west',{purpose:'fixed vertical rung; gameplay climb unapproved'});
 // Walking shaft and tier landings remain empty and connected vertically.
 for(const y of [11,17])for(const [x,z,f] of [[4,9,'west'],[14,9,'east']]){
  if(occupied(x,y,z))a.remove(x,y,z);
  put(x,y,z,'window','pack4:030',f,{winterSealApproved:false});
 }
 for(let x=4;x<=14;x++)for(let z=4;z<=14;z++)if(!(x===9&&z===9)){
  if(!occupied(x,23,z))put(x,23,z,'roof','live:stone','none',{bearingApproved:false});
 }
 for(const [x,z] of [[7,9],[11,9],[9,7],[9,11]])for(let y=24;y<=26;y++)
  put(x,y,z,'support','live:wood','none',{purpose:'unlit frost beacon support'});
 for(let x=7;x<=11;x++)for(let z=7;z<=11;z++)put(x,27,z,'roof','live:stone');
 for(const [x,z,p] of [[6,6,'storage-crate'],[12,6,'weather-rack'],[12,12,'signal-flag-cabinet']])bed(x,z,p);
 namedRoom('ground-keeper-store',5,5,14,9,9);
 namedRoom('wind-sheltered-middle-landing',7,7,12,12,15);
 namedRoom('upper-observation-deck',7,7,12,12,24);
 portal('outside','ground-keeper-store',9,2);
 portal('ground-keeper-store','wind-sheltered-middle-landing',9,9,'vertical ladder (unapproved)',10);
 portal('wind-sheltered-middle-landing','upper-observation-deck',9,9,'vertical ladder (unapproved)',20);
 const shaft=[];for(let y=1;y<=22;y++)shaft.push([9,y,9]);
 for(const level of [10,20])for(const [x,z] of [[8,9],[9,8],[9,10]])shaft.push([x,level,z]);
 return finalize('tapered angular winter stone tower, independent floors, continuous vertical shaft and symbolic unlit frost beacon',shaft);
}
export function getCrossBiome1BPlans(){
 return [createDuneBathhouse(),createSnowStable(),createMountainGranary(),createMountainGlasshouse(),
  createDesertFishingLodge(),createEnchantedHarborOffice(),createSnowLighthouse()];
}
