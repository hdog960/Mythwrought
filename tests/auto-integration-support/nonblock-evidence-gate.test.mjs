import test from 'node:test';
import assert from 'node:assert/strict';
import {auditNonblockEvidence} from '../../src/auto-integration-support/nonblock-evidence-gate.mjs';
const sha = 'a'.repeat(40);
const base = () => ({
  schema:'nonblock-object-v1', mode:'isolated', productionRegistration:false,
  refs:Object.fromEntries([':48',':24',':36',':00'].map(k=>[k,{sha,authenticated:true,method:'github-exact-ref'}])),
  objects:[{key:'nb1:seed:0:0:0:flora',kind:'flora',pickable:true,breakable:true,
    removable:true,persistentTombstone:true,selectionAabb:[0,0,0,1,1,1]}],
  tombstones:[], evidence:{realPick:true,realBreak:true,realSchema1Reload:true,chromiumWebgl2:true}
});
test('declared complete evidence is explicitly not independently verified',()=>{
 const r=auditNonblockEvidence(base()); assert.equal(r.ok,true);
 assert.equal(r.status,'EVIDENCE_DECLARED_NOT_INDEPENDENTLY_VERIFIED');
});
for(const [name,mutate,code] of [
 ['missing source',x=>delete x.refs[':00'],'unauthenticated-source::00'],
 ['fake provenance',x=>x.refs[':24'].method='caller','unauthenticated-source::24'],
 ['default spawn',x=>x.objects[0].spawnedByDefault=true,'default-spawn-forbidden'],
 ['unbreakable',x=>x.objects[0].breakable=false,'unbreakable-object'],
 ['tombstone respawn',x=>x.tombstones.push(x.objects[0].key),'tombstone-respawn'],
 ['bad bounds',x=>x.objects[0].selectionAabb=[1,0,0,0,1,1],'invalid-selection-aabb'],
 ['missing actual reload',x=>x.evidence.realSchema1Reload=false,'live-lifecycle-not-proven'],
 ['missing browser',x=>x.evidence.chromiumWebgl2=false,'webgl2-not-proven'],
 ['protected edit',x=>x.objects[0].overlapsProtectedEdit=true,'protected-edit-overlap'],
 ['production registration',x=>x.productionRegistration=true,'production-mode-forbidden'],
 ['duplicate key',x=>x.objects.push({...x.objects[0]}),'duplicate-or-invalid-key'],
 ['orphan FX',x=>x.objects.push({key:'nb1:fx',kind:'fx',effectMode:'parent-linked'}),'unowned-fx']
]) test(name,()=>{const x=base();mutate(x);assert.ok(auditNonblockEvidence(x).errors.includes(code));});
