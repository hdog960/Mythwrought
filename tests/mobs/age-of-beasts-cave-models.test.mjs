import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {CAVE_MODEL_IDS,buildCaveModel} from '../../src/mobs/age-of-beasts/cave-models.mjs';
import {caveCandidate} from '../../src/mobs/age-of-beasts/cave-candidates.mjs';
import {inspectBeastMesh,MODEL_LIMITS} from '../../src/mobs/age-of-beasts/mesh-contract.mjs';
import {legacyIndex} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
test('ten cave meshes and definitions preserve approved roster, water and ceiling support',()=>{
 assert.deepEqual([...CAVE_MODEL_IDS].sort(),APPROVED.filter(x=>x.biome==='cave').map(x=>x.id).sort());
 const shapes=new Set();
 for(const id of CAVE_MODEL_IDS){const mesh=buildCaveModel(id),s=inspectBeastMesh(mesh),c=caveCandidate(id);
 assert.ok(s.minY>=-1e-5&&s.bytes<=MODEL_LIMITS.bytes&&s.triangles>=60,id);
 assert.equal(c.record.body,c.capability.body);assert.equal(legacyIndex.get(id),undefined);
 assert.deepEqual(mesh,buildCaveModel(id));shapes.add(JSON.stringify([...mesh]));}
 assert.equal(shapes.size,10);assert.deepEqual(caveCandidate('blind-cavefish').capability.spawnSupport,['water']);
 assert.deepEqual(caveCandidate('ceiling-lurker').capability.spawnSupport,['ceiling']);
});
