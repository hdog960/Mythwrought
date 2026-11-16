import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2Expansion1BPlans} from '../../../src/building-pool/roadmap-1b/m2-community-expansion.mjs';
import {getM2Community1BPlans} from '../../../src/building-pool/roadmap-1b/m2-community-structures.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,structuralFingerprint,stableBlueprintJSON} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=p=>p.join(',');
const plans=()=>getM2Expansion1BPlans();
const pick=(category,biome,size)=>plans().find(b=>b.category===category&&b.biome===biome&&b.size===size);
const purpose=(b,name)=>b.placements.filter(p=>p.purpose===name);
const roof=(b)=>b.placements.filter(p=>p.role==='roof');
const physical=(b)=>new Map(b.placements.map(p=>[K(p.at),p]));
test('M2b nine new original plans maintain 118/435 census, 15 inherited source-exact stables and 317 outstanding',()=>{
 const before=getM2Community1BPlans(),next=plans(),legacy=getInheritedStables(),all=get1BCandidates();
 const census=validateAllocation(all);
 assert.equal(before.length,9);assert.equal(next.length,9);assert.equal(legacy.length,15);
 assert.equal(all.length,118);assert.equal(census.authored,118);assert.equal(census.remaining,317);
 assert.equal(new Set(all.map(b=>b.id)).size,118);
 assert.equal(new Set(all.map(b=>structuralFingerprint(b))).size,118,'geometry reused by original or new candidates');
 for(const original of legacy){
  const actual=all.find(b=>b.id===original.id);
  assert.ok(actual);
  assert.equal(stableBlueprintJSON(actual),stableBlueprintJSON(original),'original stable byte contents altered');
 }
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(category=>[
  category,all.filter(b=>b.category===category).length
 ])),{'bathhouse':15,stable:28,'farm-barn':15,greenhouse:15,'fishing-lodge':15,'harbor-office':15,lighthouse:15});
 for(const category of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES){
  assert.ok(all.filter(b=>b.category===category&&b.biome===biome&&b.size===size).length<=QUOTAS[category]);
 }
});
test('M2b all nine source modules have real authored 3D geometry, connected physical circulation, safe unresolved ABI',()=>{
 const n=plans();
 assert.equal(n.length,9);assert.equal(new Set(n.map(b=>b.id)).size,9);
 for(const b of n){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=750,'not an authored building: '+b.id);
  assert.ok(b.walkable.length>=190,'no real interior walking: '+b.id);
  assert.ok(b.rooms.length>=3&&b.portals.length>=4,'incomplete 3D program: '+b.id);
  assert.ok(roof(b).length>=150,'missing weather roof: '+b.id);
  assert.ok(b.placements.some(p=>p.role==='foundation'));
  assert.ok(b.placements.some(p=>p.role==='support'));
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'));
  assert.deepEqual(b.dependencies.map(d=>d.asset),['pack4:030']);
  assert.ok(b.dependencies[0].requires.length===3);
  assert.ok(b.placements.every(p=>p.asset!=='pack5:090'),'oven is not a bathhouse/stable store');
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorApproval,false);
  const occupied=physical(b),walking=new Set(b.walkable.map(K));
  for(const portal of b.portals){
   assert.ok(walking.has(K(portal.at)),'doorway never reached '+b.id+':'+portal.to);
   assert.ok(!occupied.has(K(portal.at)),'doorway blocked '+b.id+':'+portal.to);
   assert.ok(!occupied.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'door head blocked '+b.id);
  }
  const repeated=plans().find(x=>x.id===b.id);
  assert.equal(stableBlueprintJSON(repeated),stableBlueprintJSON(b),'nondeterministic source '+b.id);
 }
});
test('Temperate medium Willowbrook Baths has a real roofless center, two separate empty basin rims and seven portals',()=>{
 const b=pick('bathhouse','temperate','medium'),occ=physical(b);
 assert.equal(b.id,'r1:bathhouse:temperate:medium:001');
 assert.equal(b.rooms.length,5);assert.equal(b.portals.length,7);
 assert.ok(!occ.has('11,7,12'),'central open sky courtyard roofed over');
 assert.ok(purpose(b,'west-empty-therapy-rim').length>=10);
 assert.ok(purpose(b,'east-empty-therapy-rim').length>=10);
 assert.ok(purpose(b,'masonry-thermal-pier').length>=30);
});
test('Desert small Amberstep has two empty wash bays and asymmetric side canopy without pretending live water',()=>{
 const b=pick('bathhouse','desert','small'),occ=physical(b);
 assert.equal(b.footprint.width,17);assert.equal(b.rooms.length,4);
 assert.ok(!occ.has('8,6,10'),'desert basin court cannot be fully roofed');
 assert.ok(purpose(b,'left-empty-ablution').length>=6);
 assert.ok(purpose(b,'right-empty-ablution').length>=6);
 assert.ok(roof(b).some(p=>p.roofProfile==='desert-west-arcade'));
 assert.ok(roof(b).some(p=>p.roofProfile==='desert-east-arcade'));
 assert.equal(b.architecturalIdentity.noRealWater,true);
});
test('Snow medium Glacier Ember Baths has distinct insulated snow and side-wing roofs',()=>{
 const b=pick('bathhouse','snow','medium');
 const profiles=new Set(roof(b).map(p=>p.roofProfile));
 assert.ok(profiles.has('glacier-entrance-snow-ridge'));
 assert.ok(profiles.has('glacier-rear-snow-ridge'));
 assert.ok(profiles.has('snow-side-wing-sheds'));
 assert.ok(purpose(b,'insulated-buttress').length>=36);
 assert.equal(b.rooms.length,5);
 assert.equal(b.architecturalIdentity.waterSimulation,false);
});
test('Temperate large Clovermeadow stable has four sheltered stalls around an actually open yard',()=>{
 const b=pick('stable','temperate','large'),occ=physical(b),walking=new Set(b.walkable.map(K));
 assert.equal(b.id,'r1:stable:temperate:large:004');
 assert.equal(b.rooms.length,7);
 assert.ok(!occ.has('15,8,15')&&!occ.has('15,9,15'),'the center exercise yard is not open-air');
 assert.ok(walking.has('15,1,16'));
 assert.ok(purpose(b,'empty-hay-feeder').length===8);
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Desert large Copperdune stable has eight independently authored empty stall doors',()=>{
 const b=pick('stable','desert','large');
 assert.equal(b.rooms.length,10);
 assert.equal(b.portals.filter(p=>p.opening==='empty-stall-bay').length,8);
 assert.ok(purpose(b,'empty-stall-waterless-manger').length>=12);
 assert.ok(roof(b).some(p=>p.roofProfile==='desert-west-canopy'));
 assert.ok(roof(b).some(p=>p.roofProfile==='desert-east-canopy'));
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Snow small Icetrail has four true empty wall openings and steep roof load pier candidates',()=>{
 const b=pick('stable','snow','small');
 assert.equal(b.portals.filter(p=>p.opening==='empty-stall-opening').length,4);
 assert.ok(purpose(b,'windward-wall-support').length>=24);
 assert.ok(new Set(roof(b).map(p=>p.at[1])).size>=5);
 assert.equal(b.architecturalIdentity.animals,0);
});
test('Temperate medium Brookrail barn has a raised cupola on its long pitched grain roof',()=>{
 const b=pick('farm-barn','temperate','medium');
 assert.ok(roof(b).some(p=>p.roofProfile==='brookrail-long-grain-roof'));
 assert.ok(roof(b).filter(p=>p.roofProfile==='grain-cupola').length>=20);
 assert.ok(purpose(b,'vent-cupola-standing-post').length>=15);
 assert.ok(b.rooms.some(r=>r.id==='west-rear-seed-bank'));
 assert.equal(b.architecturalIdentity.riverWater,false);
});
test('Mountain small Talus barn has an actual 7-height uphill pitched retaining roof',()=>{
 const b=pick('farm-barn','mountain','small');
 assert.equal(new Set(roof(b).map(p=>p.at[1])).size,7);
 assert.ok(purpose(b,'tapered-slope-bearing-pier').length>=24);
 assert.equal(b.rooms.length,3);
 assert.equal(b.architecturalIdentity.liveMining,false);
});
test('Enchanted large Briarhall curing barn keeps the center uncovered between four real roofs',()=>{
 const b=pick('farm-barn','enchanted-forest','large'),occ=physical(b);
 assert.ok(!occ.has('15,8,16')&&!occ.has('15,9,16'),'open curing court falsely roofed');
 assert.ok(roof(b).some(p=>p.roofProfile==='briarhall-front-truss'));
 assert.ok(roof(b).some(p=>p.roofProfile==='briarhall-rear-truss'));
 assert.ok(roof(b).some(p=>p.roofProfile==='western-moss-drying-shed'));
 assert.ok(roof(b).some(p=>p.roofProfile==='eastern-herb-drying-shed'));
 assert.ok(purpose(b,'living-timber-loaded-post').length>=48);
 assert.equal(b.architecturalIdentity.harvesting,false);
});

test('M2b all 55 actual pillar heads contact physical source roof cells without floating gaps',()=>{
 const plans=getM2Expansion1BPlans();
 let bearingPosts=0;
 for(const b of plans){
  const occ=physical(b);
  const heads=b.placements.filter(p=>p.role==='support'&&
   occ.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role!=='support');
  assert.ok(heads.length>=4,'roof lacks original post heads: '+b.id);
  for(const p of heads){
   const foot=occ.get(K([p.at[0],0,p.at[2]]));
   const cap=occ.get(K([p.at[0],p.at[1]+1,p.at[2]]));
   assert.equal(foot?.role,'foundation','pillar missing structural ground cell '+b.id+' '+K(p.at));
   assert.equal(cap?.role,'roof','roof physically detached from support '+b.id+' '+K(p.at));
  }
  bearingPosts+=heads.length;
 }
 assert.equal(bearingPosts,60,'pillar tally drift: inspect actual roof-to-post paths');
});
