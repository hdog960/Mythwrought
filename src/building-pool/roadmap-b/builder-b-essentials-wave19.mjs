// MYTHWROUGHT Builder B Wave19 — Auroracrest Folded-Frost Seedhouse.
// Original snow greenhouse source only, no actual crop growth, snow simulation,
// heat, power, glass weather seal, citizens, world placement or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const AURORACREST_FOLDED_FROST_ID='r1:greenhouse:snow:small:003';
export function buildAuroracrestFoldedFrostSeedhouse(){
 const b=sourcePlan('greenhouse','snow','small',3,'Auroracrest Folded-Frost Seedhouse',49,32,50);
 const wings=[
  ['north-long-glazing-gallery',11,2,35,13,13,'pack3:025'],
  ['west-snowmoss-nursery',3,10,20,34,11,'pack3:026'],
  ['east-ice-lantern-seedroom',33,9,46,34,14,'pack3:023'],
  ['central-folded-canopy-bridge',18,12,35,38,18,'pack3:025'],
  ['southwest-cold-seed-archive',8,34,25,47,12,'pack3:026'],
  ['southeast-frostfern-study',27,35,43,47,11,'pack3:025'],
  ['northwest-low-coldframe',2,4,12,23,9,'pack3:023'],
  ['northeast-tall-seed-atrium',42,4,47,24,15,'pack3:026']
 ],courts=[[23,21,28,27],[13,38,16,42]],mast=[43,15],K=(x,z)=>x+','+z,
 floor=new Set(),roofs=new Map(),dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)floor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)floor.delete(K(x,z));
 const has=(x,z)=>floor.has(K(x,z)),isMast=(x,z)=>x===mast[0]&&z===mast[1];
 for(const key of floor){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{naturalSnowAndCavesUnchanged:true});
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalSnowGlassMountingFrame:true,realWeatherSealPending:true});
 }
 // Coldframe dividers have real two-column air gaps; no fake occupant walkways.
 for(const [axis,fixed,from,to,gaps] of [
  ['x',20,12,38,[15,16,23,24,30,31,35,36]],
  ['x',33,12,38,[17,18,25,26,32,33]],
  ['z',13,11,35,[17,18,23,24,29,30]],
  ['z',34,8,43,[14,15,22,23,30,31,37,38]],
  ['x',12,23,46,[27,28,34,35,42,43]],
  ['x',27,35,47,[37,38,43,44]],
  ['z',23,3,21,[8,9,15,16]]
 ])for(let n=from;n<=to;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||isMast(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {originalDrySeedroomDivider:true,activeVentilation:false});
 }
 // Separately profiled opaque Pack3 winter roof with exactly y-1 support for
 // every source roofing cell, not a pretend transparent Pack4 horizontal face.
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||isMast(x,z)||roofs.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/
    (wing==='central-folded-canopy-bridge'?3:4));
   roofs.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalImmediateRoofBacking:true,snowLoadCertification:false});
   b.put(x,y,z,'roof',asset,'north',
    {originalWinterRoofWing:wing,snowWeatherSealing:false});
  }
 // A physically continuous and unlit raised wind-vane source, not a power device.
 if(!has(...mast))throw Error('Auroracrest vane mast has no original ground');
 b.support(mast[0],mast[1],23,'live:stone','source-unpowered-aurora-signal-vane');
 b.put(mast[0],24,mast[1],'roof','pack3:025','north',
  {inertWinterVaneCap:true,noGlowOrClimateEffects:true});
 for(const [x,z] of [[17,6],[29,6],[7,16],[11,27],[37,12],[40,30],
  [20,42],[34,42],[7,8],[45,20],[15,35]]){
  const y=roofs.get(K(x,z));if(!y)throw Error('Auroracrest timber pier misses source roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','original-ice-glass-roof-brace');
 }
 for(const row of [
  ['north-snow-seed-arrival',12,3,34,12],
  ['west-low-snowmoss-cases',4,11,19,33],
  ['east-ice-fern-ledger',34,10,45,33],
  ['central-covered-coldframe-bridge',19,13,34,37],
  ['southwest-inert-root-reserve',9,35,24,46],
  ['southeast-dry-spore-shelf',28,36,42,46],
  ['northwest-trefoil-coldframe',3,5,11,22],
  ['northeast-unpowered-aurora-atrium',43,5,46,23]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-snow-seed-arrival',25,2],
  ['north-snow-seed-arrival','west-low-snowmoss-cases',19,12],
  ['north-snow-seed-arrival','central-covered-coldframe-bridge',25,13],
  ['north-snow-seed-arrival','east-ice-fern-ledger',34,12],
  ['west-low-snowmoss-cases','central-covered-coldframe-bridge',20,26],
  ['east-ice-fern-ledger','central-covered-coldframe-bridge',33,27],
  ['central-covered-coldframe-bridge','southwest-inert-root-reserve',20,34],
  ['central-covered-coldframe-bridge','southeast-dry-spore-shelf',30,35],
  ['west-low-snowmoss-cases','northwest-trefoil-coldframe',11,18],
  ['southwest-inert-root-reserve','southeast-dry-spore-shelf',27,41],
  ['east-ice-fern-ledger','northeast-unpowered-aurora-atrium',43,20],
  ['northeast-unpowered-aurora-atrium','north-snow-seed-arrival',42,11]
 ]){
  if(!has(x,z))throw Error('Auroracrest two-high portal has no authentic snow foundation '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Only exterior timber with genuine lower y1 sill and upper y4 lintel gets
 // double-height upright Pack4 030 panes. Door and side-court walls are excluded.
 let twoHighBays=0,panes=0;
 for(const key of floor){
  const [x,z]=key.split(',').map(Number);
  const exposure=Object.entries(dirs).find(([,v])=>!has(x+v[0],z+v[1]));
  if(!exposure||(x*7+z*11)%8!==0||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',exposure[0],
    {sourceTwoHighUprightGlass:true,physicalLiveSealNotApproved:true});
   panes++;
  }twoHighBays++;
 }
 for(const [x,z,kind] of [
  [23,8,'inert-seed-catalog'],[10,20,'dormant-coldframe-pottery'],
  [38,24,'dry-northern-herb-archive'],[17,41,'empty-glass-trays'],
  [33,41,'unpowered-coldair-valve'],[7,15,'frostproof-packing-box']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,kind,'pack4:059');
 return b.finish('Eight original offset winter nursery wings with 42-column open frost court and separate 20-column coldframe lightwell, eight distinct source-supported Pack3 roof pitches, double-height upright and genuinely framed Pack4 panes, one real grounded unpowered aurora vane. Inert snow-growing rooms with no water, heat or plant simulation.',{
  exclusiveOwner:'Builder B Wave19 original 1B',sourceWinterRoofWings:8,
  skyOpenFrozenCourts:[42,20],actualSnowGlazingBays:twoHighBays,
  actualUprightGlassCells:panes,groundedUnpoweredVaneTiers:23,
  cropGrowthEnabled:false,thermalPlantControlsActive:false,
  auroraLightEmitted:false,waterOrIrrigationActive:false,
  snowOrCaveWorldModified:false,PackPhysicalCollisionCertified:false,
  glassWeatherproofCertified:false,actualIphoneTested:false,
  creatorArtApproved:false,worldPlacement:false,productionRegistered:false,
  saveSchema1Written:false
 });
}
