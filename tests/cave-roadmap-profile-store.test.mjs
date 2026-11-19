import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey} from '../src/voxel.mjs';
import {worldSlotKey} from '../src/seeds.mjs';
import {descentRoute} from '../src/underground-switchback-descent.mjs';
import {CAVE_PROFILE_KIND} from '../src/manual-caves/cave-voxel-world.mjs';
import {caveProfileStorageKey,createStagedCaveProfile,saveStagedCaveProfile,
  loadStagedCaveProfile} from '../src/manual-caves/profile-store.mjs';

function store(seed=179){
  const records=new Map(),writes=[],denied=[];
  return {records,writes,denied,
    getItem:k=>records.get(k)??null,
    setItem(k,v){if(denied.includes(k))throw Error('Storage quota / interrupted write');
      writes.push(k);records.set(k,v);},
    removeItem:k=>records.delete(k),
    key:i=>[...records.keys()][i]??null,
    get length(){return records.size}
  };
}
test('cave profile refuses arbitrary seed, implicit selection, legacy canonical saves and extra sidecars',()=>{
 const s=store();
 assert.throws(()=>caveProfileStorageKey(2**33));
 assert.throws(()=>createStagedCaveProfile(s,179),/Explicit CREATE/);
 s.records.set(worldSlotKey(179),'LEGACY SAVE BYTES');
 assert.throws(()=>createStagedCaveProfile(s,179,{approved:true}),/existing world/i);
 assert.equal(s.getItem(worldSlotKey(179)),'LEGACY SAVE BYTES');
 assert.equal(s.writes.length,0);
 s.records.delete(worldSlotKey(179));
 s.records.set(worldSlotKey(179)+'-pack2-live-v1','SAVED BUILD');
 assert.throws(()=>createStagedCaveProfile(s,179,{approved:true}),/existing world/i);
 assert.equal(s.writes.length,0);
});
for(const seed of [179,1,2026,-77]){
 test('durable explicit cave-only save, edit, reload and recover seed '+seed,()=>{
  const s=store(seed),oldKey=worldSlotKey(seed),caveKey=caveProfileStorageKey(seed);
  const result=createStagedCaveProfile(s,seed,{approved:true});
  assert.equal(result.ok,true);assert.equal(result.schema,1);
  assert.equal(s.getItem(oldKey),null);
  assert.equal(s.getItem(caveKey+'.journal'),null);
  assert.ok(s.getItem(caveKey));
  assert.throws(()=>createStagedCaveProfile(s,seed,{approved:true}),/already has stored data/);
  const world=result.runtime.world;
  const p=descentRoute().find(q=>q.floor===-80);
  assert.ok(p);
  assert.equal(world.get(p.x,p.feet,p.z),BLOCK.AIR);
  assert.equal(world.set(p.x,p.feet,p.z,BLOCK.DEEPSTONE),true);
  assert.throws(()=>saveStagedCaveProfile(s,result.runtime),/Explicit cave-world save selection/);
  saveStagedCaveProfile(s,result.runtime,{approved:true});
  assert.equal(s.getItem(oldKey),null);
  const loaded=loadStagedCaveProfile(s,seed,{approved:true});
  assert.equal(loaded.recovered,false);
  assert.equal(loaded.runtime.profile,CAVE_PROFILE_KIND);
  assert.equal(loaded.runtime.world.get(p.x,p.feet,p.z),BLOCK.DEEPSTONE);
  assert.equal(loaded.runtime.world.set(p.x,p.feet,p.z,BLOCK.AIR),true);
  saveStagedCaveProfile(s,loaded.runtime,{approved:true});
  const reopened=loadStagedCaveProfile(s,seed,{approved:true});
  assert.equal(reopened.runtime.world.get(p.x,p.feet,p.z),BLOCK.AIR);
  assert.equal(reopened.runtime.world.base.edits.has(worldKey(p.x,p.feet,p.z)),false);
  assert.ok(s.getItem(caveKey+'.backup'),'previous-good cave save backed up');
  assert.equal(s.getItem(oldKey),null,'old per-seed canonical save never written');
 });
}
test('failed cave primary write retains verified previous bytes and recoverable journal',()=>{
 const s=store(),key=caveProfileStorageKey(179);
 const result=createStagedCaveProfile(s,179,{approved:true});
 const before=s.getItem(key),p=descentRoute().find(q=>q.floor===-80);
 result.runtime.world.set(p.x,p.feet,p.z,BLOCK.DEEPSTONE);
 s.denied.push(key);
 assert.throws(()=>saveStagedCaveProfile(s,result.runtime,{approved:true}),/interrupted write/);
 assert.equal(s.getItem(key),before,'good canonical profile remains byte-identical');
 assert.ok(s.getItem(key+'.journal'),'uncommitted newer cave save remains recoverable');
 const recovered=loadStagedCaveProfile(s,179,{approved:true});
 assert.equal(recovered.recovery,'pending-journal');
 assert.equal(recovered.runtime.world.get(p.x,p.feet,p.z),BLOCK.DEEPSTONE);
 assert.equal(s.getItem(worldSlotKey(179)),null);
 s.denied.length=0;
 assert.throws(()=>saveStagedCaveProfile(s,createStagedCaveProfile,{approved:true}),/Not an isolated explicit cave runtime/);
 saveStagedCaveProfile(s,recovered.runtime,{approved:true});
 assert.equal(s.getItem(key+'.journal'),null);
 assert.equal(loadStagedCaveProfile(s,179,{approved:true}).recovered,false);
});
test('damaged cave journal is never deleted or overwritten even with a good primary',()=>{
 const s=store(),key=caveProfileStorageKey(179);
 const result=createStagedCaveProfile(s,179,{approved:true});
 s.records.set(key+'.journal','{"damaged":"pending"}');
 assert.throws(()=>loadStagedCaveProfile(s,179,{approved:true}),/Damaged uncommitted/);
 assert.throws(()=>saveStagedCaveProfile(s,result.runtime,{approved:true}),/damaged cave journal/i);
 assert.equal(s.getItem(key+'.journal'),'{"damaged":"pending"}');
});
