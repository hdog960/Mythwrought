// Builder 1B-only M2c exact-source native tests. No world, shared CI or packs touched.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2Diverse1BPlans} from '../../../src/building-pool/roadmap-1b/m2-diverse-regions.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=p=>p.join(',');
const nine=()=>getM2Diverse1BPlans();
const select=(category,biome,size)=>nine().find(b=>b.category===category&&b.biome===biome&&b.size===size);
const purposes=(b,id)=>b.placements.filter(p=>p.purpose===id);
const roofs=b=>b.placements.filter(p=>p.role==='roof');
const occupancy=b=>new Map(b.placements.map(p=>[K(p.at),p]));
function connectedWalk(b){
 const avail=new Map(b.walkable.map(p=>[K(p),p])),start=b.walkable[0],seen=new Set([K(start)]),q=[start];
 for(let i=0;i<q.length;i++)for(const delta of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]]){
  const next=q[i].map((n,j)=>n+delta[j]),key=K(next);
  if(avail.has(key)&&!seen.has(key)){seen.add(key);q.push(next);}
 }
 return seen.size===avail.size;
}
test('M2c: exact 169/435 inventory, 15 source-identical original stables and category quotas',()=>{
 const all=get1BCandidates(),legacy=getInheritedStables(),fresh=nine(),c=validateAllocation(all);
 assert.equal(all.length,169);assert.equal(c.authored,169);assert.equal(c.remaining,266);
 assert.equal(fresh.length,9);assert.equal(legacy.length,15);
 assert.equal(new Set(all.map(b=>b.id)).size,169);
 assert.equal(new Set(all.map(b=>structuralFingerprint(b))).size,169);
 assert.equal(new Set(fresh.map(b=>b.architecturalIdentity.program)).size,9);
 const expected={bathhouse:24,stable:33,'farm-barn':23,greenhouse:24,'fishing-lodge':22,'harbor-office':21,lighthouse:22};
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(k=>[k,all.filter(b=>b.category===k).length])),expected);
 for(const biome of BIOMES)for(const size of SIZES)for(const [category,max] of Object.entries(QUOTAS))
  assert.ok(all.filter(b=>b.category===category&&b.biome===biome&&b.size===size).length<=max);
 for(const original of legacy){
  const carried=all.find(b=>b.id===original.id);
  assert.ok(carried,'inherited stable ID lost '+original.id);
  assert.equal(stableBlueprintJSON(carried),stableBlueprintJSON(original),'original source geometry mutated');
 }
});
test('M2c: all nine real integer-source voxels, unobstructed portals, full-cell base and connected routes',()=>{
 for(const b of nine()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=1800,'not fully authored 3D volume '+b.id);
  assert.ok(b.rooms.length>=5&&b.portals.length>=7,'room circulation program missing '+b.id);
  assert.ok(b.walkable.length>=400,'insufficient two-high walkable voxels '+b.id);
  assert.ok(connectedWalk(b),'disconnected independent horizontal walk flood '+b.id);
  assert.ok(b.placements.some(p=>p.role==='foundation')&&roofs(b).length>=400);
  assert.ok(b.placements.some(p=>p.role==='support')&&b.placements.some(p=>p.role==='window'));
  assert.deepEqual(b.dependencies.map(d=>d.asset),['pack4:030'],'unexpected/unsupported source family');
  assert.ok(b.dependencies.every(d=>d.status==='unresolved'&&d.requires.length===3));
  assert.ok(b.placements.every(p=>p.asset!=='pack5:090'),'oven incorrectly used as construction storage');
  assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorApproval,false);
  const occ=occupancy(b),walk=new Set(b.walkable.map(K));
  for(const p of b.portals){
   assert.ok(walk.has(K(p.at)),'portal not truly reachable '+b.id+' -> '+p.to);
   assert.ok(!occ.has(K(p.at)),'door voxel occupied '+b.id);
   assert.ok(!occ.has(K([p.at[0],p.at[1]+1,p.at[2]])),'door head blocked '+b.id);
  }
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(nine().find(p=>p.id===b.id)),
   'non-deterministic source cell program '+b.id);
 }
});
test('M2c: all 66 grounded roof posts physically contact their own authored roof cells',()=>{
 let total=0;
 for(const b of nine()){
  const occ=occupancy(b);
  const heads=b.placements.filter(p=>p.role==='support'&&
   occ.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role!=='support');
  assert.ok(heads.length>=6,'missing physical roof load posts '+b.id);
  for(const p of heads){
   assert.equal(occ.get(K([p.at[0],0,p.at[2]]))?.role,'foundation','post lacks source-foundation '+b.id);
   assert.equal(occ.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role,'roof','floating canopy/roof pier '+b.id);
  }
  total+=heads.length;
 }
 assert.equal(total,66,'roof-bearing pier count changed');
});
test('Temperate large Willowcrown baths has 4 real roof masses and central sky court',()=>{
 const b=select('bathhouse','temperate','large'),occ=occupancy(b),profiles=new Set(roofs(b).map(p=>p.roofProfile));
 assert.equal(profiles.size,4);assert.ok(profiles.has('willowcrown-front-cross-gable'));
 assert.ok(profiles.has('stone-rear-garden-pavilion'));
 assert.ok(!occ.has('15,9,16')&&!occ.has('15,10,16'),'central sky court unintentionally capped');
 assert.ok(purposes(b,'west-drained-rim').length>=20&&purposes(b,'east-drained-rim').length>=20);
 assert.equal(b.rooms.length,6);assert.equal(b.portals.length,9);
 assert.equal(b.architecturalIdentity.waterOperational,false);
});
test('Desert large Qasr bathhouse has true terraced reception shade and split waterless ablution',()=>{
 const b=select('bathhouse','desert','large'),profiles=new Set(roofs(b).map(p=>p.roofProfile));
 assert.equal(b.footprint.depth,35);assert.equal(profiles.size,4);
 assert.ok(profiles.has('sunarcade-reception-step')&&profiles.has('sunarcade-west-porch'));
 assert.ok(purposes(b,'waterless-west-basin').length>15);
 assert.ok(purposes(b,'waterless-east-basin').length>15);
 assert.equal(b.architecturalIdentity.noWaterOrSteamSimulation,true);
});
test('Snow large Frostspire winter baths has genuine source glass clerestory spanning its high snow roof',()=>{
 const b=select('bathhouse','snow','large');
 assert.equal(b.footprint.height,19);
 assert.ok(roofs(b).filter(p=>p.roofProfile==='frostspire-winter-glass-ridge'&&p.asset==='pack4:030').length>=50);
 assert.ok(purposes(b,'frostspire-arched-load-post').length>=75);
 assert.ok(purposes(b,'boiler-shell-no-heat').length===1);
 assert.equal(b.rooms.length,6);
 assert.equal(b.architecturalIdentity.heating,false);
});
test('Temperate medium Thistleford stable has six empty physically distinct doors and an elevated supported monitor',()=>{
 const b=select('stable','temperate','medium');
 assert.equal(b.id,'r1:stable:temperate:medium:004');
 assert.equal(b.portals.filter(p=>p.opening==='empty-stall-opening').length,6);
 assert.ok(roofs(b).filter(p=>p.roofProfile==='thistleford-hay-monitor').length>=35);
 assert.ok(purposes(b,'daylight-monitor-post').length>=40);
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Snow large Ridgebreak relay stable has eight real empty stalls and two independently roofed load regions',()=>{
 const b=select('stable','snow','large'),profiles=new Set(roofs(b).map(p=>p.roofProfile));
 assert.equal(b.portals.filter(p=>p.opening==='empty-stall-ice-lane').length,8);
 assert.equal(b.rooms.filter(r=>r.id.endsWith('empty-pen')).length,8);
 assert.ok(profiles.has('relay-high-snow-evacuation-gable')&&profiles.has('relay-rear-ice-shed'));
 assert.ok(purposes(b,'relay-snow-load-bearing-column').length>=60);
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Enchanted medium Mosswick stable is four distinct empty bays around uncovered source lightwell',()=>{
 const b=select('stable','enchanted-forest','medium'),occ=occupancy(b);
 assert.equal(b.portals.filter(p=>p.opening==='empty-stall-forest-arch').length,4);
 assert.ok(!occ.has('12,8,12'),'central botanical walk falsely roofed');
 assert.ok(purposes(b,'mosswick-living-wood-pier').length>=56);
 assert.ok(purposes(b,'nonharvestable-lightwell-planter').length===1);
 assert.equal(b.architecturalIdentity.harvesting,false);
});
test('Temperate large Meadowspan grain complex has three wagon portals and truly open central grain court',()=>{
 const b=select('farm-barn','temperate','large'),occ=occupancy(b);
 assert.equal(b.portals.filter(p=>p.opening==='independent-cart-door').length,3);
 assert.ok(!occ.has('16,8,16')&&!occ.has('16,9,16'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='meadowspan-triple-load-cross-gable'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='meadowspan-rear-grain-administration'));
 assert.equal(b.architecturalIdentity.grainGameplay,false);
});
test('Desert medium Saltwind granary has distinct covered arms and genuine uncovered threshing slab',()=>{
 const b=select('farm-barn','desert','medium'),occ=occupancy(b);
 assert.ok(!occ.has('12,8,15')&&!occ.has('12,9,15'));
 for(const x of ['saltwind-west-storage-canopy','saltwind-east-packing-canopy','saltwind-rear-cart-workshop-hip'])
  assert.ok(roofs(b).some(p=>p.roofProfile===x),'missing separately authored roof '+x);
 assert.ok(purposes(b,'uncovered-threshing-stone').length===1);
 assert.equal(b.architecturalIdentity.workingHarvester,false);
});
test('Snow medium Fircrest barn has defensible porch overhang, supported winter ridge and cross-bay load path',()=>{
 const b=select('farm-barn','snow','medium'),occ=occupancy(b),profile=new Set(roofs(b).map(p=>p.roofProfile));
 assert.ok(profile.has('fircrest-windbreak-long-snow-ridge')&&profile.has('fircrest-lower-sled-porch'));
 assert.ok(roofs(b).filter(p=>p.roofProfile==='fircrest-lower-sled-porch').every(p=>p.cantileverLoadApproved===false),
  'lower one-cell winter porch cantilever was falsely approved');
 assert.ok(purposes(b,'fircrest-long-roof-bearing-pier').length>=45);
 assert.ok(!occ.has('12,1,0'),'snow porch blocks exterior road');
 assert.equal(b.architecturalIdentity.harvesting,false);
});
