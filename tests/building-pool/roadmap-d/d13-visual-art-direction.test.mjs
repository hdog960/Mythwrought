import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE13_IDS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave13.mjs';
import {ROADMAP_D_WAVE13_VISUAL_INTENT as intent} from '../../../src/building-pool/roadmap-d/d13-visual-art-direction.mjs';

test('D13 art intent covers exactly eight genuinely owned original source IDs, no historical or adjacent lanes',()=>{
 assert.equal(intent.length,8);
 assert.deepEqual(intent.map(x=>x.sourceId).sort(),[...ROADMAP_D_WAVE13_IDS].sort());
 assert.equal(new Set(intent.map(x=>x.sourceId)).size,8);
 assert.equal(new Set(intent.map(x=>x.title)).size,8);
 assert.deepEqual(intent.reduce((m,x)=>(m[x.type]=(m[x.type]||0)+1,m),{}),{schoolhouse:3,'magical-research-institute':3,'arcane-academy':2});
});
test('D13 proposals define eight distinct silhouette, roof and feature concepts without asserting they are built',()=>{
 for(const field of ['silhouette','roofIntent','facadeIntent','signatureFeature','interiorIntent']){
  assert.equal(new Set(intent.map(x=>x[field])).size,8,field+' repeated');
  for(const x of intent)assert.ok(typeof x[field]==='string'&&x[field].trim().length>=24,'underspecified '+field+' '+x.sourceId);
 }
});
test('source-only visual checkpoint cannot be misrepresented as physical/final/PWA acceptance',()=>{
 for(const x of intent){
  assert.equal(x.acceptanceState,'visual-intent-only');
  for(const flag of ['actualManualPackMeshesVerified','originalSourceGeometryChanged','creatorArtApproved','liveWorldRegistered','iphoneHomeScreenVerified'])assert.equal(x[flag],false,flag+' incorrectly asserted');
 }
});
