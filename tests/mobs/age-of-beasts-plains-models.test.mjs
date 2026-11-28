import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {buildBeastMesh,inspectBeastMesh,MODEL_LIMITS} from '../../src/mobs/age-of-beasts/mesh-contract.mjs';
import {PLAINS_MODEL_IDS,buildPlainsModel,plainsModelEnvelope} from '../../src/mobs/age-of-beasts/plains-models.mjs';
import {validExpansionBody} from '../../src/mobs/age-of-beasts/body-contract.mjs';
test('ten distinctive authored meshes cover exactly approved meadow identities',()=>{
 assert.deepEqual([...PLAINS_MODEL_IDS].sort(),APPROVED.filter(s=>s.biome==='meadow').map(s=>s.id).sort());
 const fingerprints=new Set();
 for(const id of PLAINS_MODEL_IDS){
  const a=buildPlainsModel(id),b=buildPlainsModel(id),{info,body}=plainsModelEnvelope(id);
  assert.notEqual(a,b);assert.deepEqual(a,b);
  assert.ok(info.triangles>=60&&info.bytes<=MODEL_LIMITS.bytes);
  assert.ok(info.minY>=-1e-5&&validExpansionBody(body)&&info.radius<=body.radius&&info.maxY<=body.height,id);
  assert.ok(info.joints.some(j=>j!==0),id);
  fingerprints.add(JSON.stringify([...a]));
 }
 assert.equal(fingerprints.size,10);assert.equal(buildPlainsModel('cow'),undefined);
});
test('mesh compiler rejects malformed parts and bounded allocation overflow',()=>{
 assert.throws(()=>buildBeastMesh(()=>{}));
 assert.throws(()=>buildBeastMesh(b=>b(0,0,0,1,0,1,'abcdef')));
 assert.throws(()=>buildBeastMesh(b=>b(0,0,0,1,1,1,'abcdef',99)));
 assert.throws(()=>buildBeastMesh(b=>{for(let i=0;i<65;i++)b(0,0,0,1,1,1,'abcdef');}));
 assert.throws(()=>inspectBeastMesh(new Float32Array(21)));
});
