// Roadmap B Wave3 — eight original source-authoring candidates, no physical Pack ABI or production registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {get1BCandidates} from '../src/building-pool/roadmap-1b/candidates.mjs';
import {validateBlueprint as validate1B} from '../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {validateBlueprint as validate2B} from '../src/building-pool/roadmap-2b/schema.mjs';
import {getRoadmapBWave1B1} from '../src/building-pool/roadmap-b/wave1-community-b1.mjs';
import {getRoadmapBWave1B2} from '../src/building-pool/roadmap-b/wave1-trades-b2.mjs';
import {getRoadmapBWave2B1} from '../src/building-pool/roadmap-b/wave2-community-b1.mjs';
import {getRoadmapBWave2B2} from '../src/building-pool/roadmap-b/wave2-trades-b2.mjs';
import {getRoadmapBWave3B1,ROADMAP_B_WAVE3_B1_IDS} from '../src/building-pool/roadmap-b/wave3-community-b1.mjs';
import {getRoadmapBWave3B2,ROADMAP_B_WAVE3_B2_IDS} from '../src/building-pool/roadmap-b/wave3-trades-b2.mjs';
import {createStoneveinSwitchbackBaths} from '../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {createIronpassHorseshoeExchange} from '../src/building-pool/roadmap-b/b2-ironpass-market.mjs';

const key=(x,y,z)=>[x,y,z].join(',');
const points=b=>b.placements?b.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]):
 b.voxels.filter(p=>p.kind==='floor').map(p=>[p.x,p.z]);
function norm(pts){const minX=Math.min(...pts.map(p=>p[0])),minZ=Math.min(...pts.map(p=>p[1]));
 return new Set(pts.map(([x,z])=>(x-minX)+','+(z-minZ)));}
function d4(a,b){const B=norm(b);let max=0;
 for(let mirror=0;mirror<2;mirror++)for(let r=0;r<4;r++){
  const A=norm(a.map(([xx,zz])=>{let x=mirror?-xx:xx,z=zz;for(let t=0;t<r;t++){const q=x;x=-z;z=q;}return [x,z];}));
  let hit=0;for(const v of A)if(B.has(v))hit++;
  max=Math.max(max,hit/(A.size+B.size-hit));
 }return max;}
function walking2B(b){
 const occ=new Set(b.voxels.map(p=>key(p.x,p.y,p.z)));
 const floor=new Set(b.voxels.filter(p=>p.kind==='floor').map(p=>p.x+','+p.z));
 const air=new Set([...floor].filter(p=>{const [x,z]=p.split(',');return !occ.has(x+',2,'+z)&&!occ.has(x+',3,'+z);}));
 const entry=b.openings.find(o=>o.type==='entrance');assert.ok(entry,b.id+' lacks entrance');
 const start=entry.x+','+entry.z;assert.ok(air.has(start),b.id+' obstructed entrance');
 const seen=new Set([start]),queue=[start];
 while(queue.length){const [x,z]=queue.shift().split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next=(x+dx)+','+(z+dz);if(air.has(next)&&!seen.has(next)){seen.add(next);queue.push(next);}
  }
 }
 assert.equal(seen.size,air.size,b.id+' unreachable physical interior floor');
 for(const p of b.routeTargets)assert.ok(seen.has(p.x+','+p.z),b.id+' unreachable route '+p.purpose);
 return seen.size;
}
test('Wave3 eight independently authored IDs do not collide with 169/146 historic census or 14 earlier staging candidates',()=>{
 const prior=get1BCandidates(),ledger=JSON.parse(readFileSync('src/building-pool/roadmap-2b/m1-authoring-ledger.json','utf8'));
 assert.equal(prior.length,169);assert.equal(ledger.authoredCandidates,146);
 const originals=new Set([...prior.map(p=>p.id),...ledger.originals.map(p=>p.id)]);
 const earlier=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange()];
 const newer=[...getRoadmapBWave3B1(),...getRoadmapBWave3B2()];
 assert.equal(newer.length,8);assert.equal(earlier.length,14);
 const allIds=newer.map(p=>p.id),earlierIds=new Set(earlier.map(p=>p.id));
 assert.deepEqual(getRoadmapBWave3B1().map(p=>p.id),[...ROADMAP_B_WAVE3_B1_IDS]);
 assert.deepEqual(getRoadmapBWave3B2().map(p=>p.id),[...ROADMAP_B_WAVE3_B2_IDS]);
 assert.equal(new Set(allIds).size,8);
 for(const b of newer){
  assert.ok(!originals.has(b.id),b.id+' collides with accepted historical source');
  assert.ok(!earlierIds.has(b.id),b.id+' collides with staged source');
  assert.equal(b.worldPlacement??b.worldPlaced,false,b.id+' illegally placed');
 }
});
test('Wave3 four 1B community buildings are physically walkable with actual site-authored roof mass and unresolved producer dependencies',()=>{
 const buildings=getRoadmapBWave3B1();assert.equal(buildings.length,4);
 for(const b of buildings){
  assert.equal(validate1B(b),true,b.id);assert.ok(b.placements.length>3900,b.id+' lacks complete source XYZ cells');
  assert.ok(b.walkable.length>1000,b.id+' missing connected physical floor');
  assert.equal(b.rooms.length,4);assert.equal(b.portals.length,6);
  const occupied=new Set(b.placements.map(p=>key(...p.at)));
  for(const p of b.portals){assert.ok(!occupied.has(key(...p.at)),b.id+' blocked threshold');
   assert.ok(!occupied.has(key(p.at[0],2,p.at[2])),b.id+' portal head blocked');}
  assert.equal(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size,6);
  assert.ok(b.dependencies.length>=2&&b.dependencies.every(d=>d.status==='unresolved'));
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 }
});
test('Wave3 four 2B source shops/arts have real connected two-cell-high corridors and completely symbolic physical producer status',()=>{
 const buildings=getRoadmapBWave3B2();assert.equal(buildings.length,4);
 for(const b of buildings){
  assert.equal(validate2B(b).valid,true,b.id);assert.ok(b.voxels.length>5900,b.id+' insufficient true occupied source XYZ');
  assert.ok(walking2B(b)>1100,b.id+' physically inaccessible floor');
  assert.ok(b.rooms.length>=4&&b.openings.filter(x=>x.type==='window').length>=6);
  assert.equal(new Set(b.voxels.filter(p=>p.kind==='roof').map(p=>p.roofProfile)).size,6);
  assert.ok(b.sourceSupportAudits.length>=6&&b.unresolvedDependencies.length>=6);
  assert.ok(b.unresolvedDependencies.every(d=>d.issue.includes('not certified')));
  assert.equal(b.worldRegistration,false);assert.equal(b.worldPlaced,false);
 }
});
test('Waves 1, 2, 3 and prior provisional: 22 unique source silhouettes pass 231 independent eight-way D4 IoU comparisons below 0.85',()=>{
 const all=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange(),...getRoadmapBWave3B1(),...getRoadmapBWave3B2()];
 assert.equal(all.length,22);
 let count=0,max=0;
 for(let i=0;i<all.length;i++)for(let j=0;j<i;j++){
  const score=d4(points(all[i]),points(all[j]));count++;max=Math.max(max,score);
  assert.ok(score<0.85,all[i].id+' overlaps '+all[j].id+' D4 '+score.toFixed(7));
 }
 assert.equal(count,231);assert.ok(max<0.85);
});
