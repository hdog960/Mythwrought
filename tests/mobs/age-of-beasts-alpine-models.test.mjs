import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {ALPINE_MODEL_IDS,buildAlpineModel} from '../../src/mobs/age-of-beasts/alpine-models.mjs';
import {alpineCandidate} from '../../src/mobs/age-of-beasts/alpine-candidates.mjs';
import {inspectBeastMesh,MODEL_LIMITS} from '../../src/mobs/age-of-beasts/mesh-contract.mjs';
import {legacyIndex} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
test('ten alpine meshes and definitions preserve approved roster and aerial mount declaration',()=>{
 assert.deepEqual([...ALPINE_MODEL_IDS].sort(),APPROVED.filter(x=>x.biome==='alpine').map(x=>x.id).sort());
 const shapes=new Set();
 for(const id of ALPINE_MODEL_IDS){const mesh=buildAlpineModel(id),s=inspectBeastMesh(mesh),c=alpineCandidate(id);
 assert.ok(s.minY>=-1e-5&&s.bytes<=MODEL_LIMITS.bytes&&s.triangles>=60,id);
 assert.equal(c.record.body,c.capability.body);assert.equal(legacyIndex.get(id),undefined);
 assert.deepEqual(mesh,buildAlpineModel(id));shapes.add(JSON.stringify([...mesh]));}
 assert.equal(shapes.size,10);assert.equal(alpineCandidate('griffin').capability.mount,'aerial');
 assert.equal(alpineCandidate('yak').record.taming.eligible,true);
});
