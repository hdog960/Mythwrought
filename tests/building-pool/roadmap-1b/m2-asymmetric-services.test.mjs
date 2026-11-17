// Builder 1B M2e asymmetric services: native source-backed acceptance.
// No runtime, shared test harness, save, pack, sibling builder or world edits.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2Asymmetric1BPlans} from '../../../src/building-pool/roadmap-1b/m2-asymmetric-services.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,structuralFingerprint,stableBlueprintJSON} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=p=>p.join(',');
const models=()=>getM2Asymmetric1BPlans();
const select=(cat,biome,size)=>models().find(b=>b.category===cat&&b.biome===biome&&b.size===size);
const mesh=b=>new Map(b.placements.map(p=>[K(p.at),p]));
const roofs=b=>b.placements.filter(p=>p.role==='roof');
const purpose=(b,name)=>b.placements.filter(p=>p.purpose===name);
function sourceConnected(b){
 const cells=new Set(b.walkable.map(K)),visited=new Set([K(b.walkable[0])]),q=[b.walkable[0]];
 for(let n=0;n<q.length;n++)for(const delta of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]]){
  const v=q[n].map((x,i)=>x+delta[i]),k=K(v);
  if(cells.has(k)&&!visited.has(k)){visited.add(k);q.push(v);}
 }
 return visited.size===cells.size;
}
test('M2e 158/435 original authored IDs and physical fingerprints; 15 exact inherited stables untouched',()=>{
 const all=get1BCandidates(),old=getInheritedStables(),fresh=models(),c=validateAllocation(all);
 assert.equal(all.length,158);assert.equal(c.authored,158);assert.equal(c.remaining,277);
 assert.equal(old.length,15);assert.equal(fresh.length,9);
 assert.equal(new Set(all.map(p=>p.id)).size,158);
 assert.equal(new Set(all.map(p=>structuralFingerprint(p))).size,158);
 assert.equal(new Set(fresh.map(p=>p.architecturalIdentity.program)).size,9);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(k=>[k,all.filter(p=>p.category===k).length])),
  {'bathhouse':23,stable:28,'farm-barn':22,greenhouse:23,'fishing-lodge':21,'harbor-office':20,lighthouse:21});
 for(const b of old){const carried=all.find(p=>p.id===b.id);assert.ok(carried);
  assert.equal(stableBlueprintJSON(carried),stableBlueprintJSON(b),'legacy stable source modified '+b.id);
 }
 for(const biome of BIOMES)for(const size of SIZES)for(const [category,max] of Object.entries(QUOTAS))
  assert.ok(all.filter(p=>p.category===category&&p.biome===biome&&p.size===size).length<=max);
});
test('M2e nine different genuinely concave/nonrectangular foundations and roof profiles, not flat metadata variants',()=>{
 for(const b of models()){
  assert.equal(validateBlueprint(b),true);
  const f=b.placements.filter(p=>p.role==='foundation').length;
  const bounding=(b.footprint.width-2)*(b.footprint.depth-2);
  assert.ok(f/bounding<=0.78,'rectangular filler foundation masquerading as asymmetric '+b.id);
  assert.ok(b.architecturalIdentity.footprintTopology.includes('nonrectangular'));
  assert.ok(roofs(b).length>190);
  assert.ok(new Set(roofs(b).map(p=>p.roofProfile)).size>=2,'single rectangular roof '+b.id);
  assert.ok(b.placements.some(p=>p.role==='wall'));
  assert.ok(b.walkable.length>170&&b.rooms.length>=2&&b.portals.length>=2);
  assert.ok(sourceConnected(b),'disconnected physical walk cells '+b.id);
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.creatorApproval,false);
  assert.deepEqual(b.dependencies.map(d=>d.asset),['pack4:030']);
  assert.equal(b.dependencies[0].status,'unresolved');
  assert.ok(b.dependencies[0].requires.length===3);
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(models().find(q=>q.id===b.id)),
   'non-deterministic authored geometry '+b.id);
 }
});
test('M2e every genuine source roof pier from foundation reaches a real roof cell above',()=>{
 let columns=0;
 for(const b of models()){
  const occ=mesh(b);
  const heads=b.placements.filter(p=>p.role==='support'&&
   occ.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role!=='support');
  assert.ok(heads.length>=4,'missing physical roof piers '+b.id);
  for(const p of heads){
   assert.equal(occ.get(K([p.at[0],0,p.at[2]]))?.role,'foundation',
    'no source foundation below column '+b.id);
   assert.equal(occ.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role,'roof',
    'floating roof over pier '+b.id);
   columns++;
  }
 }
 assert.equal(columns,43);
});
test('M2e all circulation portals are real standing voxels with two-high clearance',()=>{
 for(const b of models()){
  const walk=new Set(b.walkable.map(K)),occ=mesh(b);
  for(const p of b.portals){
   assert.ok(walk.has(K(p.at)),b.id+' portal not walkable '+p.to);
   assert.ok(!occ.has(K(p.at))&&!occ.has(K([p.at[0],p.at[1]+1,p.at[2]])),
    'blocked source door '+b.id);
  }
 }
});
test('Temperate L-plan Thimbleglass conservatory has an actual source-empty negative-space garden',()=>{
 const b=select('greenhouse','temperate','medium'),occ=mesh(b);
 assert.ok(!occ.has('21,0,20')&&!occ.has('21,7,20'));
 assert.ok(occ.has('8,0,22')&&occ.has('20,0,6'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='transverse-glass-fern-gallery'&&p.asset==='pack4:030'));
 assert.equal(b.architecturalIdentity.harvesting,false);
});
test('Desert large Suncistern U greenhouse has an uncovered central void and independent wing materials',()=>{
 const b=select('greenhouse','desert','large'),occ=mesh(b);
 assert.ok(!occ.has('16,0,22')&&!occ.has('16,9,22'));
 assert.ok(occ.has('6,0,27')&&occ.has('26,0,27'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='west-deep-glass-clerestory'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='east-mashrabiya-shade-ridge'));
 assert.equal(b.architecturalIdentity.cisternFunctional,false);
});
test('Snow Small Snowbud T glasshouse has a genuinely narrow rear glazed stem',()=>{
 const b=select('greenhouse','snow','small'),occ=mesh(b);
 assert.ok(!occ.has('3,0,17')&&!occ.has('19,0,17'));
 assert.ok(occ.has('11,0,20')&&occ.has('20,0,5'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='snowbud-central-glass-snow-saddle'&&p.asset==='pack4:030'));
 assert.equal(b.architecturalIdentity.heating,false);
});
test('Temperate Large Reedcross fishing cooperative has a real narrowed jetty and unroofed staging tail',()=>{
 const b=select('fishing-lodge','temperate','large'),occ=mesh(b);
 assert.ok(!occ.has('30,0,29')&&occ.has('18,0,35'));
 assert.ok(!occ.has('18,10,35'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='fisher-market-wide-ridge'));
 assert.equal(b.architecturalIdentity.boats,false);
});
test('Mountain Medium Highcrag cliff lodge has offset rear hook and a stone gable',()=>{
 const b=select('fishing-lodge','mountain','medium'),occ=mesh(b);
 assert.ok(!occ.has('22,0,23')&&occ.has('11,0,25'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='highcrag-upper-stone-lookout'));
 assert.equal(b.architecturalIdentity.climbABI,'unresolved');
});
test('Desert Small Dunehook harbor registry is a real Z-plan with a split rear projection',()=>{
 const b=select('harbor-office','desert','small'),occ=mesh(b);
 assert.ok(!occ.has('3,0,24')&&occ.has('17,0,24'));
 assert.ok(occ.has('3,0,4')&&!occ.has('20,0,15'));
 assert.equal(new Set(roofs(b).map(p=>p.roofProfile)).size,3);
 assert.equal(b.architecturalIdentity.economy,false);
});
test('Snow Large Frostport customs house is a U-plan with physically sky-open central inspection court',()=>{
 const b=select('harbor-office','snow','large'),occ=mesh(b);
 assert.ok(!occ.has('18,0,26')&&!occ.has('18,10,26'));
 assert.ok(occ.has('7,0,27')&&occ.has('27,0,27'));
 assert.ok(new Set(roofs(b).map(p=>p.roofProfile)).size===3);
 assert.equal(b.architecturalIdentity.shipControl,false);
});
test('Temperate Medium Windward lighthouse contains a literal tall tower and an L-offset keeper wing',()=>{
 const b=select('lighthouse','temperate','medium'),occ=mesh(b);
 assert.ok(occ.has('5,21,5')&&occ.has('5,17,1'));
 assert.ok(!occ.has('5,0,25')&&occ.has('23,0,25'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='windward-crowned-signal-lantern'));
 assert.equal(b.architecturalIdentity.climbABI,false);
});
test('Enchanted Large Elderstar lighthouse carries a taller real tower with no claimed magical/climb mechanics',()=>{
 const b=select('lighthouse','enchanted-forest','large'),occ=mesh(b);
 assert.ok(occ.has('5,28,5')&&occ.has('1,25,6'));
 assert.ok(!occ.has('5,0,30')&&occ.has('25,0,30'));
 assert.ok(roofs(b).some(p=>p.roofProfile==='elderstar-halo-rose-crystal-high-beacon'));
 assert.equal(b.architecturalIdentity.towerMechanics,false);
});
