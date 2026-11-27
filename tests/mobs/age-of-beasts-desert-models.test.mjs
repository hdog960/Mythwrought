import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {DESERT_MODEL_IDS,buildDesertModel} from '../../src/mobs/age-of-beasts/desert-models.mjs';
import {desertCandidate} from '../../src/mobs/age-of-beasts/desert-candidates.mjs';
import {inspectBeastMesh,MODEL_LIMITS} from '../../src/mobs/age-of-beasts/mesh-contract.mjs';
import {legacyIndex} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
test('ten desert mesh-bound records match exact approved identities and body budgets',()=>{
 assert.deepEqual([...DESERT_MODEL_IDS].sort(),APPROVED.filter(x=>x.biome==='desert').map(x=>x.id).sort());
 const shapes=new Set();
 for(const id of DESERT_MODEL_IDS){const mesh=buildDesertModel(id),s=inspectBeastMesh(mesh),c=desertCandidate(id);
 assert.ok(s.minY>=-1e-5&&s.bytes<=MODEL_LIMITS.bytes&&s.triangles>=60,id);
 assert.equal(c.record.id,id);assert.equal(c.record.body,c.capability.body);assert.equal(legacyIndex.get(id),undefined);
 assert.deepEqual(mesh,buildDesertModel(id));shapes.add(JSON.stringify([...mesh]));}
 assert.equal(shapes.size,10);assert.equal(desertCandidate('camel').record.taming.eligible,true);assert.equal(desertCandidate('camel').capability.mount,'ground');
});
