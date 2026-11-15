import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche,M2_HOUSING_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const houses=getM2HousingTranche(),all=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...houses];
const key=a=>a.join(',');
test('15 independently authored houses cover the 5-biome x 3-size matrix and 32,859 placements',()=>{
 assert.equal(houses.length,15);
 assert.deepEqual(houses.map(x=>x.id),M2_HOUSING_IDS);
 assert.equal(new Set(houses.map(x=>x.id)).size,15);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  for(const size of ['small','medium','large'])
   assert.equal(houses.filter(b=>b.category==='house'&&b.biome===biome&&b.size===size).length,1,biome+'/'+size);
 assert.equal(new Set(houses.map(b=>b.architecturalIdentity.plan)).size,15);
 assert.equal(new Set(houses.map(b=>b.architecturalIdentity.regionalDetail)).size,15);
 assert.equal(houses.reduce((s,b)=>s+b.placements.length,0),32859);
});
test('all 54 original and new full coordinate blueprints are distinct by ID, geometry and D4 turns/mirrors',()=>{
 assert.equal(all.length,54);
 assert.equal(validatePool(all).authored,54);
 assert.equal(new Set(all.map(b=>b.id)).size,54);
 assert.equal(new Set(all.map(structuralFingerprint)).size,54);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.deepEqual(all.reduce((out,b)=>(out[b.category]=(out[b.category]??0)+1,out),{}),{house:33,tavern:17,inn:4});
});
for(const b of houses){
 test('fully grounded, connected and author-detailed source with roof/bed/portal clearance: '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>1100);
  assert.ok(b.rooms.length>=3);
  assert.equal(b.portals.length,b.rooms.length);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length);
  const visited=new Set([key(b.portals[0].at)]),queue=[b.portals[0].at];
  for(let i=0;i<queue.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const p=[queue[i][0]+dx,1,queue[i][2]+dz],k=key(p);
   if(walk.has(k)&&!visited.has(k)){visited.add(k);queue.push(p);}
  }
  assert.equal(visited.size,walk.size,'route islands disconnected from entrance');
  for(const p of b.portals){
   const [x,y,z]=p.at;
   assert.ok(walk.has(key(p.at)));
   assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'blocked doorway/headroom');
  }
  for(const r of b.rooms)assert.ok(b.walkable.some(c=>c.every((n,i)=>n>=r.min[i]&&n<r.max[i])),r.id+' empty room');
  for(const role of ['foundation','wall','partition','roof','window','door','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing '+role);
  for(const p of b.placements.filter(p=>p.role==='roof')){
   const [x,y,z]=p.at;
   assert.ok(occ.has(key([x,y-1,z])),'unsupported roof cell');
   assert.equal(p.weatherSealApproved,false);
  }
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   assert.equal(occ.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(!occ.has(key([x,y,z]))&&!walk.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])));
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  if(b.architecturalIdentity.outdoorCourtyard){
   const [x0,z0,x1,z1]=b.architecturalIdentity.outdoorCourtyard;
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let y=4;y<b.footprint.height;y++)
    assert.ok(!occ.has(key([x,y,z])),'fake covered courtyard shaft');
  }
  assert.deepEqual([...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort(),
   b.dependencies.map(d=>d.asset));
  assert.ok(b.dependencies.every(x=>x.status==='unresolved'));
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 });
}
test('read-only exact five-pack candidate physical source audit for all 15 houses',()=>{
 for(const b of houses){
  const a=auditM1PhysicalSources(b);
  assert.equal(a.catalog.families,96);assert.equal(a.catalog.numericVariants,106);
  assert.equal(a.catalog.productionRegistered,false);
  assert.equal(a.productionReady,false);assert.equal(a.worldPlaced,false);
  assert.deepEqual(a.errors,[],b.id+': physical resolver error');
  assert.deepEqual(a.unresolved,[],b.id+': unresolved physical symbols');
  assert.equal(a.roofTiles,a.roofBackingCells);
  assert.equal(a.bedHeads,a.bedFeet);
  assert.ok(a.descriptors.some(x=>x.startsWith('pack3:')));
  assert.ok(a.descriptors.some(x=>x.startsWith('pack4:')));
  assert.ok(a.provisionalSupports.filter(x=>x.asset==='pack5:082').every(x=>x.authorSolid));
 }
});
