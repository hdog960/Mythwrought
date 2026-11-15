import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2a/manifest.json',import.meta.url),'utf8'));
function testSuite(){
 const cellmap=b=>new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
 const accessible=(b,extraBlocked=[])=>{
  const c=cellmap(b),start=b.openings.find(o=>o.type==='entrance'),q=[[start.x,1]],seen=new Set(),blocked=new Set(extraBlocked.map(o=>`${o.x},${o.z}`));
  for(let i=0;i<q.length;i++){const [x,z]=q[i],key=`${x},${z}`;if(seen.has(key)||blocked.has(key)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||c.get(`${x},1,${z}`)?.kind!=='floor'||[2,3,4].some(y=>c.has(`${x},${y},${z}`)))continue;seen.add(key);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);}return seen;
 };
 test('M1 five genuine specialist model sources and all reserved unique identities',()=>{
  assert.equal(M1_SPECIALIST_EXEMPLARS.length,5);
  assert.deepEqual(M1_SPECIALIST_EXEMPLARS.map(b=>b.category),['pet-shop','magic-shop','potion-shop','bakery','bank']);
  assert.equal(new Set(M1_SPECIALIST_EXEMPLARS.map(b=>b.id)).size,5);
  for(const b of M1_SPECIALIST_EXEMPLARS)assert(plannedSlots().some(s=>s.id===b.id&&s.authoredHere&&s.status==='authored-candidate'),b.id);
 });
 test('native concrete blueprint physical-cell validation on all five categories',()=>{
  for(const b of M1_SPECIALIST_EXEMPLARS){const r=validateBlueprint(b),kinds=new Set(b.voxels.map(v=>v.kind));assert(r.valid&&r.uniqueCells===b.voxels.length,b.id);assert(b.voxels.length>800,b.id);for(const kind of ['foundation','floor','wall','roof','window','fixture','decor'])assert(kinds.has(kind),`${b.id} ${kind}`);assert(b.voxels.filter(v=>v.kind==='roof').length>=b.extents.x*b.extents.z);}
 });
 test('genuine 3-high floor-collision BFS reaches every room and actual opening is clear',()=>{
  for(const b of M1_SPECIALIST_EXEMPLARS){const seen=accessible(b),map=cellmap(b);assert(seen.size>40,b.id);for(const room of b.rooms){assert(room.access[0]>=room.bounds.x0&&room.access[0]<=room.bounds.x1&&room.access[1]>=room.bounds.z0&&room.access[1]<=room.bounds.z1,b.id);assert(seen.has(`${room.access[0]},${room.access[1]}`),`${b.id} inaccessible ${room.name}`);}for(const o of b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway'))for(let y=2;y<=4;y++)assert(!map.has(`${o.x},${y},${o.z}`),b.id);}
 });
 test('all physical window glass/frame cells have exact material-matching opening records',()=>{
  for(const b of M1_SPECIALIST_EXEMPLARS){const windows=b.voxels.filter(v=>v.kind==='window'),listed=b.openings.filter(o=>o.type==='window'),map=cellmap(b);assert.equal(windows.length,8,b.id);assert.equal(listed.length,windows.length,b.id);for(const o of listed)assert.equal(map.get(`${o.x},${o.y},${o.z}`)?.material,o.material,b.id);}
 });
 test('five category-specific fixture assemblies actually exist on structural floors',()=>{
  const roles=[['pet-shop','empty-display-rail',6],['magic-shop','unpowered-display-plinth',4],['potion-shop','unpowered-alchemy-station',1],['bakery','unlit-oven',1],['bank','teller-counter',4]];
  for(const [category,role,n] of roles){const b=M1_SPECIALIST_EXEMPLARS.find(b=>b.category===category),map=cellmap(b),rows=b.voxels.filter(v=>v.role===role);assert.equal(rows.length,n,b.id);for(const x of rows)assert.equal(map.get(`${x.x},1,${x.z}`)?.kind,'floor',b.id);}
 });
 test('bank vault threshold and rear corridor have separate access; closing threshold blocks vault',()=>{
  const b=M1_SPECIALIST_EXEMPLARS.find(b=>b.category==='bank'),vault=b.openings.find(o=>o.role==='vault-threshold');assert(vault&&vault.doorSymbol==='pack5:094');const reachable=accessible(b,[vault,...b.openings.filter(o=>o.role==='vault-wide-secondary')]);assert(!reachable.has('10,18'),'vault bypassed the declared threshold');assert(reachable.has('17,18'),'rear corridor also blocked');});
 test('15 inherited stores and 5 specialists are twenty physically distinct, non-recolored architectures',()=>{const full=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS];assert.equal(new Set(full.map(b=>b.id)).size,20);assert.equal(new Set(full.map(structuralFingerprint)).size,20);});
 test('fail-closed manifest counts and no production/live changes',()=>{assert.equal(manifest.locallyMigratedAndParityVerified,15);assert.equal(manifest.newlyAuthored,11);assert.equal(manifest.authoredCandidateTotal,26);assert.equal(manifest.unwrittenNewCandidates,394);assert.equal(manifest.creatorApproved,0);assert.equal(manifest.integratedIntoGame,0);assert.equal(manifest.M1SpecialistExemplars.length,5);});
 test('native reject missing window cell, blocked entrance, duplicate occupied voxel and missing dependency',()=>{for(const b of M1_SPECIALIST_EXEMPLARS){const entrance=b.openings.find(o=>o.type==='entrance'),w=b.openings.find(o=>o.type==='window');assert.throws(()=>validateBlueprint({...b,openings:b.openings.filter(o=>o!==w)}),/unregistered physical window cells/);assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:entrance.x,y:2,z:entrance.z,material:b.voxels[0].material,kind:'wall'}]}),/blocked entrance/);assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,b.voxels[0]]}),/overlapping voxel/);assert.throws(()=>validateBlueprint({...b,unresolvedDependencies:b.unresolvedDependencies.filter(d=>d.ref!==b.voxels[0].material)}),/missing symbolic material dependency/);}});
}
testSuite();
