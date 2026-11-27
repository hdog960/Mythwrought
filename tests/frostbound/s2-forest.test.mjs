import test from 'node:test';
import assert from 'node:assert/strict';
import {FrostboundForest,forestReservation} from '../../src/frostbound/s2-forest.mjs';
import {FrostboundS1Refined} from '../../src/frostbound/s1-refined-candidate.mjs';
import {FAMILIES} from '../../src/frostbound/s2-trees.mjs';
import {meshChunk,collides} from '../../src/voxel.mjs';
import {admitUpperGpuBatch} from '../../src/world-height-budget.mjs';
import {biome130Block} from '../../src/biome130-registry.mjs';
test('every lattice phase and signed 5x5 window reserves at most eight upper owners',()=>{
 for(const seed of [179,2026,-77,1])for(let cx=-15;cx<=15;cx++)for(let cz=-15;cz<=15;cz++){
  let n=0;for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){const r=forestReservation(x,z,seed);n+=r==='ancient'?4:r==='upper'?2:0;}assert.ok(n<=8);
 }
});
test('actual combined snow source, deterministic bounded forest, real meshes and protected cells',()=>{
 const seed=179,w=new FrostboundForest(seed),base=new FrostboundS1Refined(seed),sites=[],counts={},ownerRows=new Map();
 for(let cx=-16;cx<=16;cx++)for(let cz=17;cz<=46;cz++){
  const row=w.forestChunk(cx,cz);ownerRows.set(`${cx},${cz}`,row.owners.size);if(!row.site)continue;
  const s=row.site;sites.push(s);counts[s.family]=(counts[s.family]??0)+1;
  assert.ok(s.height>=FAMILIES[s.family][0]&&s.height<=FAMILIES[s.family][1]);
  for(const [k,id] of row.cells){const p=k.split(',').map(Number);assert.equal(base.naturalAndLandmarkBlock(...p),0);assert.equal(w.get(...p),id);assert.equal(base.environmentCaves.get(...p),undefined);}
 }
 assert.ok(w._forest.size<=64);assert.ok(sites.length>20);assert.ok(counts.frostfather>0);assert.equal(Object.keys(counts).length,7);
 const meshBytes=new Map();
 for(const [k,n] of ownerRows){if(!n)continue;const [cx,cz]=k.split(',').map(Number),row=w.forestChunk(cx,cz);let sum=0;
  for(const key of row.owners){const [x,z,section]=key.slice(4).split(',').map(Number),vertices=meshChunk(w,x,z,section+1);sum+=admitUpperGpuBatch(new Map(),[{key,section:section+1,vertices,water:new Float32Array()}]).bytes;}
  meshBytes.set(k,sum);
 }
 let maxOwners=0,maxWindowBytes=0;for(let cx=-14;cx<=14;cx++)for(let cz=19;cz<=44;cz++){let n=0,bytes=0;for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){n+=ownerRows.get(`${x},${z}`);bytes+=meshBytes.get(`${x},${z}`)??0;}maxOwners=Math.max(n,maxOwners);maxWindowBytes=Math.max(bytes,maxWindowBytes);assert.ok(n<=8&&bytes<=2097152);}
 let peak=0,maxSection=0;for(const family of Object.keys(FAMILIES)){
  const s=sites.find(s=>s.family===family),cx=Math.floor(s.x/16),cz=Math.floor(s.z/16),row=w.forestChunk(cx,cz);assert.deepEqual(s,row.site);
  const batch=[...row.owners].map(key=>{assert.ok(w.upperNaturalOccupied(key));const [x,z,section]=key.slice(4).split(',').map(Number);const vertices=meshChunk(w,x,z,section+1);maxSection=Math.max(maxSection,vertices.byteLength);return {key,section:section+1,vertices,water:new Float32Array()};});
  const stats=admitUpperGpuBatch(new Map(),batch);peak=Math.max(peak,stats.bytes);assert.ok(meshChunk(w,cx,cz).byteLength>0);
  const y=s.floor+1;assert.ok(collides(w,s.x+.5,y+.01,s.z+.5));const id=w.get(s.x,y,s.z);assert.ok(w.set(s.x,y,s.z,0));assert.equal(w.get(s.x,y,s.z),0);assert.ok(w.set(s.x,y,s.z,id));assert.equal(w.edits.size,0);
 }
 for(const id of [369,370,371,372])assert.ok(biome130Block(id).solid);
 assert.throws(()=>w.save(),/not a registered/);assert.deepEqual(meshChunk(w,0,0),meshChunk(base,0,0));
 console.log('FROSTBOUND_FOREST '+JSON.stringify({sites:sites.length,counts,maxOwners,maxWindowBytes,meshedChunks:meshBytes.size,peak,maxSection,firstAncient:sites.find(s=>s.family==='frostfather'),cache:w._forest.size}));
});
