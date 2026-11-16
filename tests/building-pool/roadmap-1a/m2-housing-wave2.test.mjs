import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2,M2_HOUSING_WAVE2_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const key=a=>a.join(',');
const newHouses=getM2HousingWave2();
const previous=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche()];
const all=[...previous,...newHouses];
test('15 different second-wave house plans, one per every biome x size',()=>{
 assert.equal(newHouses.length,15);
 assert.deepEqual(newHouses.map(b=>b.id),M2_HOUSING_WAVE2_IDS);
 assert.equal(new Set(newHouses.map(b=>b.id)).size,15);
 assert.equal(new Set(newHouses.map(b=>b.architecturalIdentity.plan)).size,15);
 assert.equal(new Set(newHouses.map(b=>b.architecturalIdentity.regionalDetail)).size,15);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  for(const size of ['small','medium','large'])
   assert.equal(newHouses.filter(b=>b.biome===biome&&b.size===size&&b.category==='house').length,1,biome+'/'+size);
 assert.equal(newHouses.reduce((s,b)=>s+b.placements.length,0),33908);
});
test('full 69-building pool: source schema, IDs, D4 rotations and mirrors all unique',()=>{
 assert.equal(previous.length,54);assert.equal(all.length,69);
 assert.equal(validatePool(all).authored,69);
 assert.equal(new Set(all.map(x=>x.id)).size,69);
 assert.equal(new Set(all.map(structuralFingerprint)).size,69);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.deepEqual(all.reduce((acc,x)=>(acc[x.category]=(acc[x.category]??0)+1,acc),{}),
  {house:48,tavern:17,inn:4});
});
function normalizedPartition(b){
 const out=new Set();
 for(const p of b.placements)if(p.role==='partition'&&p.at[1]===1){
  const x=Math.min(15,Math.floor(16*p.at[0]/b.footprint.width));
  const z=Math.min(15,Math.floor(16*p.at[2]/b.footprint.depth));
  out.add(x+','+z);
 }
 return out;
}
test('no trivial near-duplicate floorplans inside the 30 new house tranche',()=>{
 const designs=[...getM2HousingTranche(),...newHouses];
 const partitions=designs.map(normalizedPartition);
 for(let i=0;i<designs.length;i++)for(let j=i+1;j<designs.length;j++){
  const a=partitions[i],b=partitions[j],intersection=[...a].filter(k=>b.has(k)).length;
  const overlap=intersection/(a.size+b.size-intersection||1);
  // A very high normalized partition overlap is suspicious if the rooms and
  // roof architecture are ALSO the same; biome/color/text cannot be a defense.
  const comparable=designs[i].rooms.length===designs[j].rooms.length &&
    designs[i].architecturalIdentity.roof===designs[j].architecturalIdentity.roof;
  assert.ok(!comparable||overlap<.985,
   'near-duplicate floorplan '+designs[i].id+' vs '+designs[j].id+' '+overlap);
 }
});
for(const b of newHouses){
 test('real source routes, roofs, bed support, windows and unresolved ABI for '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>1100);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length);
  assert.equal(b.portals.length,b.rooms.length);
  const entry=b.portals[0].at,queue=[entry],visited=new Set([key(entry)]);
  for(let i=0;i<queue.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const at=[queue[i][0]+dx,1,queue[i][2]+dz],k=key(at);
   if(walk.has(k)&&!visited.has(k)){visited.add(k);queue.push(at)}
  }
  assert.equal(visited.size,walk.size,'unreachable walkable tile');
  for(const p of b.portals){
   const [x,y,z]=p.at;
   assert.ok(walk.has(key(p.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])));
  }
  for(const room of b.rooms)
   assert.ok(b.walkable.some(p=>p.every((n,i)=>n>=room.min[i]&&n<room.max[i])),
   'empty or unreachable room '+room.id);
  for(const role of ['foundation','wall','partition','door','window','roof','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing role '+role);
  for(const p of b.placements.filter(p=>p.role==='roof')){
   const [x,y,z]=p.at;
   assert.ok(occ.has(key([x,y-1,z])),'missing roof underlay');
   assert.equal(p.weatherSealApproved,false);
  }
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');
   assert.equal(r.approval,'unresolved');
   assert.equal(occ.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])));
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  if(b.architecturalIdentity.outdoorCourtyard){
   const [x0,z0,x1,z1]=b.architecturalIdentity.outdoorCourtyard;
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let y=4;y<b.footprint.height;y++)
    assert.ok(!occ.has(key([x,y,z])),'courtyard sky obstructed');
  }
  assert.deepEqual([...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort(),
   b.dependencies.map(d=>d.asset));
  assert.ok(b.dependencies.every(d=>d.status==='unresolved'));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 });
}
test('actual five-pack source AABB and support dependency preflight for all 15 new houses',()=>{
 for(const b of newHouses){
  const audit=auditM1PhysicalSources(b);
  assert.equal(audit.catalog.families,96);
  assert.equal(audit.catalog.numericVariants,106);
  assert.deepEqual(audit.errors,[],b.id+' asset shape errors');
  assert.deepEqual(audit.unresolved,[],b.id+' unresolved source families');
  assert.equal(audit.roofTiles,audit.roofBackingCells);
  assert.equal(audit.bedHeads,audit.bedFeet);
  assert.ok(audit.provisionalSupports.filter(x=>x.asset==='pack5:082').every(x=>x.authorSolid));
  assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);
 }
});
