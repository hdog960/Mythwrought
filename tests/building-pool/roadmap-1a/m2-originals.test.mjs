import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2Originals,M2_ORIGINAL_DESIGN_IDS} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';

const newer=getM2Originals(),key=x=>x.join(',');
const occupied=b=>new Map(b.placements.map(p=>[key(p.at),p]));
const MOVES=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
function pathCells(b){const walk=new Set(b.walkable.map(key)),seen=new Set([key(b.portals[0].at)]),queue=[b.portals[0].at];
 for(let i=0;i<queue.length;i++)for(const step of MOVES){
  const c=queue[i].map((n,j)=>n+step[j]),k=key(c);
  if(walk.has(k)&&!seen.has(k)){seen.add(k);queue.push(c)}
 }
 return seen;
}
test('eight unique authored coordinate plans, not quota markers or palette/rotation variations',()=>{
 assert.equal(newer.length,8);
 assert.deepEqual(newer.map(b=>b.id),M2_ORIGINAL_DESIGN_IDS);
 assert.equal(new Set(newer.map(b=>b.id)).size,8);
 assert.equal(new Set(newer.map(b=>b.architecturalIdentity.plan)).size,8);
 assert.equal(new Set(newer.map(b=>b.title)).size,8);
 assert.deepEqual(newer.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:3,tavern:2,inn:3});
});
test('all 39 candidates satisfy official schema, category quota and D4 geometry uniqueness',()=>{
 const all=[...getM1Blueprints(),...getM1InnExemplars(),...newer];
 assert.equal(all.length,39);
 assert.equal(validatePool(all).authored,39);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.equal(new Set(all.map(structuralFingerprint)).size,39);
});
for(const b of newer){
 test('complete integer 3D coordinates, real two-high routes, fixtures and roof '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>800);
  assert.ok(b.rooms.length>=3);
  assert.equal(b.portals.length,b.rooms.length);
  for(const role of ['foundation','wall','roof','door','window','partition','furnishing','support'])
   assert.ok(b.placements.some(p=>p.role===role),b.id+': missing '+role);
  const occ=occupied(b),seen=pathCells(b);
  assert.equal(seen.size,b.walkable.length,'one or more inaccessible interior paths');
  for(const p of b.portals){const [x,y,z]=p.at;
   assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),b.id+' blocked portal');
  }
  for(const r of b.rooms)assert.ok(b.walkable.some(c=>c.every((v,i)=>v>=r.min[i]&&v<r.max[i])),r.id+' not physically occupiable');
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.extraCells.length,1);
   const [x,y,z]=r.extraCells[0];
   assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])));
   assert.ok(!seen.has(key([x,y,z])));
   assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
  }
  for(const p of b.placements.filter(x=>x.role==='roof')){
   const [x,y,z]=p.at;
   assert.ok(occ.has(key([x,y-1,z])),b.id+' roof lacks authored cell backing '+p.at);
   assert.equal(p.weatherSealApproved,false);
  }
  const names=new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset));
  assert.deepEqual([...names].sort(),b.dependencies.map(d=>d.asset));
  assert.ok(b.dependencies.every(d=>d.status==='unresolved'));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 });
 test('read-only real five-pack source geometry resolves without fake approval '+b.id,()=>{
  const a=auditM1PhysicalSources(b);
  assert.deepEqual(a.errors,[]);
  assert.deepEqual(a.unresolved,[]);
  assert.equal(a.bedHeads,b.footprintReservations.length);
  assert.equal(a.bedFeet,b.footprintReservations.length);
  assert.equal(a.roofTiles,b.placements.filter(p=>p.role==='roof').length);
  assert.equal(a.roofBackingCells,a.roofTiles);
  assert.equal(a.catalog.families,96);assert.equal(a.catalog.numericVariants,106);
  assert.equal(a.productionReady,false);assert.equal(a.worldPlaced,false);
 });
}
test('both outdoor courtyards have real vertical sky rather than intact hidden ceilings',()=>{
 const courts=newer.filter(b=>b.architecturalIdentity.outdoorCourtyard);
 assert.equal(courts.length,2);
 for(const b of courts){const [x0,z0,x1,z1]=b.architecturalIdentity.outdoorCourtyard,occ=occupied(b);
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let y=4;y<b.footprint.height;y++)
   assert.equal(occ.has(key([x,y,z])),false,b.id+' courtyard cell has false cover');
 }
});
test('30 inherited houses/taverns and first Inn retained, original code and IDs untouched',()=>{
 const old=getM1Blueprints(),inn=getM1InnExemplars()[0];
 assert.equal(old.length,30);assert.equal(inn.placements.length,1493);
 assert.ok(newer.every(b=>b.id!==inn.id&&!old.some(x=>x.id===b.id)));
});
