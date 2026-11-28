import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {FOREST_MODEL_IDS,buildForestModel} from '../../src/mobs/age-of-beasts/forest-models.mjs';
import {forestCandidate} from '../../src/mobs/age-of-beasts/forest-candidates.mjs';
import {inspectBeastMesh,MODEL_LIMITS} from '../../src/mobs/age-of-beasts/mesh-contract.mjs';
import {legacyIndex} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
test('ten enchanted meshes and candidate definitions preserve approved roster',()=>{
 assert.deepEqual([...FOREST_MODEL_IDS].sort(),APPROVED.filter(x=>x.biome==='forest').map(x=>x.id).sort());
 const shapes=new Set();
 for(const id of FOREST_MODEL_IDS){const mesh=buildForestModel(id),s=inspectBeastMesh(mesh),c=forestCandidate(id);
 assert.ok(s.minY>=-1e-5&&s.bytes<=MODEL_LIMITS.bytes&&s.triangles>=60,id);
 assert.equal(c.record.body,c.capability.body);assert.equal(legacyIndex.get(id),undefined);
 assert.deepEqual(mesh,buildForestModel(id));shapes.add(JSON.stringify([...mesh]));}
 assert.equal(shapes.size,10);assert.equal(forestCandidate('unicorn').capability.mount,'ground');
});
