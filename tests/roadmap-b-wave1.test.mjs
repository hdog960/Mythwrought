// Roadmap B six original Wave1 candidates: independent source-only native acceptance.
// This does NOT register buildings, claim producer Pack AABBs or replace browser proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {get1BCandidates} from '../src/building-pool/roadmap-1b/candidates.mjs';
import {validateBlueprint as validate1B} from '../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {validateBlueprint as validate2B,structuralFingerprint} from '../src/building-pool/roadmap-2b/schema.mjs';
import {createStoneveinSwitchbackBaths} from '../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {createIronpassHorseshoeExchange} from '../src/building-pool/roadmap-b/b2-ironpass-market.mjs';
import {getRoadmapBWave1B1} from '../src/building-pool/roadmap-b/wave1-community-b1.mjs';
import {getRoadmapBWave1B2} from '../src/building-pool/roadmap-b/wave1-trades-b2.mjs';
const coord=(x,y,z)=>x+','+y+','+z;
function basePoints(b){
 return b.placements?b.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]):
  b.voxels.filter(p=>p.kind==='floor').map(p=>[p.x,p.z]);
}
function normalize(points){const minX=Math.min(...points.map(p=>p[0])),minZ=Math.min(...points.map(p=>p[1]));return new Set(points.map(p=>(p[0]-minX)+','+(p[1]-minZ)));}
function maxD4IoU(a,b){
 let max=0,B=normalize(b);
 for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
  const moved=a.map(([xx,zz])=>{let x=mirror?-xx:xx,z=zz;for(let j=0;j<rot;j++){const t=x;x=-z;z=t;}return [x,z];});
  const A=normalize(moved);let hit=0;for(const k of A)if(B.has(k))hit++;
  max=Math.max(max,hit/(A.size+B.size-hit));
 }
 return max;
}
function walk2B(b){
 const occ=new Set(b.voxels.map(v=>coord(v.x,v.y,v.z)));
 const floor=new Set(b.voxels.filter(v=>v.kind==='floor').map(v=>v.x+','+v.z));
 const air=new Set([...floor].filter(k=>{const [x,z]=k.split(',');return !occ.has(x+',2,'+z)&&!occ.has(x+',3,'+z);}));
 const start=b.openings.find(o=>o.type==='entrance');const sk=start.x+','+start.z;
 assert.ok(air.has(sk),b.id+' front gate obstructed');
 const seen=new Set([sk]),queue=[sk];
 while(queue.length){const [x,z]=queue.shift().split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const key=(x+dx)+','+(z+dz);if(air.has(key)&&!seen.has(key)){seen.add(key);queue.push(key);}
  }
 }
 assert.equal(seen.size,air.size,b.id+' disconnected standing floor');
 for(const t of b.routeTargets||[])assert.ok(seen.has(t.x+','+t.z),b.id+' inaccessible functional destination');
 return seen.size;
}
test('Wave1 six exact unique slots do not alter 169 1B or 146 2B historical candidates',()=>{
 const old=get1BCandidates(),ledger=JSON.parse(readFileSync('src/building-pool/roadmap-2b/m1-authoring-ledger.json','utf8'));
 assert.equal(old.length,169);assert.equal(ledger.authoredCandidates,146);assert.equal(ledger.originals.length,131);
 const B1=getRoadmapBWave1B1(),B2=getRoadmapBWave1B2();
 assert.equal(B1.length,3);assert.equal(B2.length,3);
 const prior=new Set([...old.map(x=>x.id),...ledger.originals.map(x=>x.id)]);
 const ids=[...B1,...B2].map(x=>x.id);
 assert.equal(new Set(ids).size,6);
 for(const id of ids){assert.ok(!prior.has(id),'historical ID collision '+id);assert.ok(!id.startsWith('r2:temple:'),'protected original temple namespace');}
 for(const b of [...B1,...B2])assert.equal(b.worldPlacement??b.worldPlaced,false);
});
test('Wave1 1B three individually authored houses-of-service are physical, walkable, source-validated and unresolved',()=>{
 for(const b of getRoadmapBWave1B1()){
  assert.equal(validate1B(b),true,b.id);
  assert.ok(b.placements.length>3000&&b.walkable.length>600,b.id+' no actual 3D occupied cells');
  assert.ok(b.rooms.length>=4&&b.portals.length>=5,b.id+' missing working rooms');
  const occupied=new Set(b.placements.map(p=>coord(...p.at)));
  for(const portal of b.portals){
   assert.ok(!occupied.has(coord(...portal.at)),b.id+' blocked doorway');
   assert.ok(!occupied.has(coord(portal.at[0],2,portal.at[2])),b.id+' blocked head clearance');
  }
  const refs=new Set(b.dependencies.map(d=>d.asset));
  for(const p of b.placements.filter(v=>v.asset.startsWith('pack'))){
   assert.equal(p.occupancy.kind,'unresolved',b.id+' silently certified producer variant');
   assert.ok(refs.has(p.asset),b.id+' undeclared material');
  }
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=4);
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 }
});
test('Wave1 2B three actual shop/workroom shells have real 3-high doors, no overlaps, and connected floorwalk',()=>{
 for(const b of getRoadmapBWave1B2()){
  assert.equal(validate2B(b).valid,true,b.id);
  assert.ok(b.voxels.length>4500,b.id+' missing source cells');
  assert.ok(walk2B(b)>600,b.id+' missing accessible physical rooms');
  assert.ok(b.openings.filter(o=>o.type==='window').length>=6);
  const occ=new Set(b.voxels.map(v=>coord(v.x,v.y,v.z)));
  for(const o of b.openings.filter(x=>x.type==='entrance'||x.type==='internal-doorway'))
   for(let y=o.y;y<o.y+o.clearHeightCells;y++)assert.ok(!occ.has(coord(o.x,y,o.z)),b.id+' blocked passage');
  assert.ok(b.sourceSupportAudits.length>=5,b.id+' missing source-grounded roof bearings');
  assert.ok(b.unresolvedDependencies.length>=6,b.id+' silently certified physical ABI');
  assert.equal(b.numericIdsAssigned,false);assert.equal(b.worldPlaced,false);
 }
});
test('Wave1 original silhouettes and occupied-volume coordinates pass eight-way D4 uniqueness',()=>{
 const B1=getRoadmapBWave1B1(),B2=getRoadmapBWave1B2();
 const all=[...B1,...B2,createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange()];
 for(let i=0;i<all.length;i++)for(let j=0;j<i;j++){
  const score=maxD4IoU(basePoints(all[i]),basePoints(all[j]));
  assert.ok(score<0.85,all[i].id+' is a high-overlap reflected/rotated floor twin of '+all[j].id+' '+score.toFixed(4));
 }
 assert.equal(new Set(B2.map(structuralFingerprint)).size,3,'2B full occupied-volume D4 clone');
});
test('Wave1 new community candidates are not high-overlap floor twins of existing category originals',()=>{
 const original=get1BCandidates();
 for(const b of getRoadmapBWave1B1())for(const o of original.filter(x=>x.category===b.category)){
  const score=maxD4IoU(basePoints(b),basePoints(o));
  assert.ok(score<0.85,b.id+' near-duplicates historic '+o.id+' floor IoU '+score.toFixed(4));
 }
});
