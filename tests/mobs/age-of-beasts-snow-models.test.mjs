import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {SNOW_MODEL_IDS,buildSnowModel} from '../../src/mobs/age-of-beasts/snow-models.mjs';
import {snowCandidate} from '../../src/mobs/age-of-beasts/snow-candidates.mjs';
import {inspectBeastMesh,MODEL_LIMITS} from '../../src/mobs/age-of-beasts/mesh-contract.mjs';
import {legacyIndex} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
test('ten snow models and definitions match approved roster and bounded geometry',()=>{
 assert.deepEqual([...SNOW_MODEL_IDS].sort(),APPROVED.filter(x=>x.biome==='snow').map(x=>x.id).sort());
 const shapes=new Set();
 for(const id of SNOW_MODEL_IDS){const mesh=buildSnowModel(id),s=inspectBeastMesh(mesh),c=snowCandidate(id);
 assert.ok(s.minY>=-1e-5&&s.bytes<=MODEL_LIMITS.bytes&&s.triangles>=60,id);
 assert.equal(c.record.body,c.capability.body);assert.equal(legacyIndex.get(id),undefined);
 assert.deepEqual(mesh,buildSnowModel(id));shapes.add(JSON.stringify([...mesh]));}
 assert.equal(shapes.size,10);assert.equal(snowCandidate('woolly-mammoth').capability.mount,'ground');
});
