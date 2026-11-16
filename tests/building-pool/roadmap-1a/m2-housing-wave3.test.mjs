import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM2HousingWave3,M2_HOUSING_WAVE3_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave3.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const newHouses=getM2HousingWave3();
const earlier=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2()];
const pool=[...earlier,...newHouses],key=a=>a.join(',');
test('third 15-house wave: every biome and size, unique literal architectural plans',()=>{
 assert.equal(earlier.length,69);assert.equal(newHouses.length,15);
 assert.deepEqual(newHouses.map(b=>b.id),M2_HOUSING_WAVE3_IDS);
 assert.equal(new Set(newHouses.map(b=>b.architecturalIdentity.plan)).size,15);
 assert.equal(new Set(newHouses.map(b=>b.architecturalIdentity.regionalDetail)).size,15);
 assert.equal(newHouses.reduce((s,b)=>s+b.placements.length,0),43333);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  for(const size of ['small','medium','large'])
   assert.equal(newHouses.filter(b=>b.biome===biome&&b.size===size&&b.category==='house').length,1,biome+'/'+size);
});
test('entire 84-building 1A authored pool: exact schema, IDs and D4 equivalence',()=>{
 assert.equal(pool.length,84);
 assert.equal(validatePool(pool).authored,84);
 assert.equal(new Set(pool.map(b=>b.id)).size,84);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,84);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.deepEqual(pool.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:63,tavern:17,inn:4});
 assert.ok(pool.every(b=>b.liveIntegration===false&&b.worldPlacement===false));
});
function partitionSet(b){
 const s=new Set();
 for(const p of b.placements)if(p.role==='partition'&&p.at[1]===1){
  const x=Math.floor(16*p.at[0]/b.footprint.width),z=Math.floor(16*p.at[2]/b.footprint.depth);
  s.add(x+','+z);
 }
 return s;
}
test('near-duplicate planar split check on 45 original 1A-created houses',()=>{
 const authored=[...getM2HousingTranche(),...getM2HousingWave2(),...newHouses];
 const partitions=authored.map(partitionSet);
 for(let i=0;i<authored.length;i++)for(let j=i+1;j<authored.length;j++){
  const x=partitions[i],y=partitions[j],inter=[...x].filter(k=>y.has(k)).length;
  const similarity=inter/(x.size+y.size-inter||1);
  const sameKind=authored[i].rooms.length===authored[j].rooms.length&&
   authored[i].architecturalIdentity.roof===authored[j].architecturalIdentity.roof;
  assert.ok(!sameKind||similarity<.985,authored[i].id+' and '+authored[j].id+' have suspicious identical partitions');
 }
});
for(const b of newHouses){
 test('real 3D physical access, floor/roof/bed support and actual room volumes: '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>1000);
  const occ=new Map(b.placements.map(p=>[key(p.at),p]));
  const walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length);
  const entry=b.portals[0].at,queue=[entry],visited=new Set([key(entry)]);
  for(let i=0;i<queue.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const v=[queue[i][0]+dx,1,queue[i][2]+dz],k=key(v);
   if(walk.has(k)&&!visited.has(k)){visited.add(k);queue.push(v);}
  }
  assert.equal(visited.size,walk.size,'isolated walking tiles or blocked circulation');
  assert.ok(b.portals.length>=b.rooms.length);
  for(const p of b.portals){const [x,y,z]=p.at;
   assert.ok(walk.has(key(p.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])));
  }
  for(const r of b.rooms)assert.ok(b.walkable.some(v=>v.every((n,i)=>n>=r.min[i]&&n<r.max[i])),r.id+' empty room');
  for(const role of ['foundation','wall','partition','door','window','roof','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing physical role: '+role);
  for(const p of b.placements.filter(p=>p.role==='roof')){
   const [x,y,z]=p.at;
   assert.ok(occ.has(key([x,y-1,z])),'unsupported roof backing');
   assert.equal(p.weatherSealApproved,false);
  }
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   assert.equal(occ.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])));
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  if(b.architecturalIdentity.outdoorCourtyard){
   const [x0,z0,x1,z1]=b.architecturalIdentity.outdoorCourtyard;
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let y=4;y<b.footprint.height;y++)
    assert.ok(!occ.has(key([x,y,z])),'fake closed courtyard');
  }
  assert.deepEqual([...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort(),
   b.dependencies.map(d=>d.asset));
  assert.ok(b.dependencies.every(d=>d.status==='unresolved'));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 });
}
test('actual producer five-pack physical-family source geometry preflight, no production registration',()=>{
 for(const b of newHouses){
  const a=auditM1PhysicalSources(b);
  assert.equal(a.catalog.families,96);assert.equal(a.catalog.numericVariants,106);
  assert.deepEqual(a.errors,[],b.id+' physical source mismatch');
  assert.deepEqual(a.unresolved,[],b.id+' unresolved physical family');
  assert.equal(a.roofTiles,a.roofBackingCells);
  assert.equal(a.bedHeads,a.bedFeet);
  assert.ok(a.provisionalSupports.filter(x=>x.asset==='pack5:082').every(x=>x.authorSolid));
  assert.equal(a.productionReady,false);assert.equal(a.worldPlaced,false);
 }
});
