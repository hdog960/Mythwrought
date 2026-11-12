import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {worldSlotKey,LEGACY_WORLD_KEY,SELECTED_SEED_KEY} from '../src/seeds.mjs';
import {SAVE_JOURNAL_SUFFIX,SAVE_BACKUP_SUFFIX,SAVE_DAMAGED_SUFFIX,saveFingerprint,parseWorldData,loadWorldSafe,saveWorldSafe,importWorldData} from '../src/persistence.mjs';

function store(initial={}){
  const map=new Map(Object.entries(initial));
  let failure=()=>false;
  const api={
    getItem(k){if(failure('get',k))throw Error('Blocked read');return map.has(k)?map.get(k):null;},
    setItem(k,v){if(failure('set',k))throw Error('QuotaExceededError');map.set(k,String(v));},
    removeItem(k){map.delete(k);},
    fail(fn){failure=fn;},map
  };
  return api;
}
function changed(seed=179){const w=new VoxelWorld(seed);w.set(15,18,-1,BLOCK.WOOD);w.set(16,18,0,BLOCK.CRYSTAL);w.set(-16,17,-17,BLOCK.AIR);return w;}
test('canonical slot and schema remain byte-for-byte compatible with v0.08',()=>{
  const storage=store(),w=changed();
  assert.equal(saveWorldSafe(storage,w).ok,true);
  assert.equal(storage.getItem(worldSlotKey(179)),JSON.stringify(w.save()));
  assert.equal(JSON.parse(storage.getItem(worldSlotKey(179))).schema,1);
  assert.equal(loadWorldSafe(storage,179).source,'primary');
  assert.deepEqual(loadWorldSafe(storage,179).world.save(),w.save());
});
test('old v0.01 and v0.08 keys open without automatic migration',()=>{
  const a=changed(),raw=JSON.stringify(a.save()),legacy=store({[LEGACY_WORLD_KEY]:raw});
  assert.equal(loadWorldSafe(legacy,179).source,'legacy');
  assert.equal(legacy.getItem(worldSlotKey(179)),null);
  const modern=store({[worldSlotKey(179)]:raw});
  assert.equal(loadWorldSafe(modern,179).source,'primary');
  assert.equal(modern.getItem(worldSlotKey(179)+SAVE_JOURNAL_SUFFIX),null);
});
test('different seed slots never read or overwrite each other',()=>{
  const storage=store(),a=changed(179),b=changed(-201);
  assert.equal(saveWorldSafe(storage,a).ok,true);
  const before=storage.getItem(worldSlotKey(179));
  assert.equal(saveWorldSafe(storage,b).ok,true);
  assert.equal(storage.getItem(worldSlotKey(179)),before);
  assert.deepEqual(loadWorldSafe(storage,-201).world.save(),b.save());
  assert.deepEqual(loadWorldSafe(storage,179).world.save(),a.save());
});
test('each successful change archives the previous validated primary',()=>{
  const storage=store(),w=changed();
  assert.equal(saveWorldSafe(storage,w).ok,true);
  const original=storage.getItem(worldSlotKey(179));
  w.set(-17,18,15,BLOCK.STONE);
  assert.equal(saveWorldSafe(storage,w).ok,true);
  assert.equal(storage.getItem(worldSlotKey(179)+SAVE_BACKUP_SUFFIX),original);
  assert.notEqual(storage.getItem(worldSlotKey(179)),original);
});
test('corrupt canonical data recovers from checksum-verified journal, no deletion',()=>{
  const storage=store(),w=changed();saveWorldSafe(storage,w);
  const key=worldSlotKey(179);
  storage.setItem(key,'{damaged');
  const loaded=loadWorldSafe(storage,179);
  assert.equal(loaded.source,'journal');assert.equal(loaded.recovered,true);
  assert.deepEqual(loaded.world.save(),w.save());
  assert.equal(storage.getItem(key),'{damaged');
  assert.equal(saveWorldSafe(storage,loaded.world).ok,true);
  assert.equal(storage.getItem(key+SAVE_DAMAGED_SUFFIX),'{damaged');
  assert.deepEqual(loadWorldSafe(storage,179).world.save(),w.save());
});
test('tampered journal cannot override a valid canonical save',()=>{
  const storage=store(),w=changed();saveWorldSafe(storage,w);
  const key=worldSlotKey(179);
  storage.setItem(key+SAVE_JOURNAL_SUFFIX,'{"version":1,"seed":179,"checksum":"ffff","raw":"{}"}');
  assert.equal(loadWorldSafe(storage,179).source,'primary');
});
test('backup recovers when both primary and journal are damaged',()=>{
  const storage=store(),w=changed();saveWorldSafe(storage,w);
  const old=w.save();
  w.set(15,18,-1,BLOCK.STONE);saveWorldSafe(storage,w);
  const key=worldSlotKey(179);
  storage.setItem(key,'not-json');storage.setItem(key+SAVE_JOURNAL_SUFFIX,'not-json');
  assert.equal(loadWorldSafe(storage,179).source,'backup');
  assert.deepEqual(loadWorldSafe(storage,179).world.save(),old);
});
test('completely corrupt seed refuses silent reset or overwriting older bytes',()=>{
  const key=worldSlotKey(179),storage=store({[key]:'broken-existing-world'});
  assert.throws(()=>loadWorldSafe(storage,179),/NOT overwritten/);
  assert.equal(saveWorldSafe(storage,changed()).ok,false);
  assert.equal(storage.getItem(key),'broken-existing-world');
});
test('write failure before backup leaves previous world intact',()=>{
  const storage=store(),w=changed();saveWorldSafe(storage,w);
  const key=worldSlotKey(179),old=storage.getItem(key);
  w.set(10,16,8,BLOCK.WOOD);
  storage.fail((op,k)=>op==='set'&&k===key+SAVE_BACKUP_SUFFIX);
  assert.equal(saveWorldSafe(storage,w).ok,false);
  assert.equal(storage.getItem(key),old);
});
test('write failure after journal leaves old canonical, but does not report success',()=>{
  const storage=store(),w=changed();saveWorldSafe(storage,w);
  const key=worldSlotKey(179),old=storage.getItem(key);
  w.set(10,16,8,BLOCK.WOOD);
  storage.fail((op,k)=>op==='set'&&k===key);
  const outcome=saveWorldSafe(storage,w);
  assert.equal(outcome.ok,false);
  assert.equal(storage.getItem(key),old);
  const recovered=loadWorldSafe(storage,179);
  assert.equal(recovered.source,'journal');
  assert.equal(recovered.recovered,true);
  assert.deepEqual(recovered.world.save(),w.save());
  assert.equal(storage.getItem(key),old,'Failed primary write must not mutate canonical bytes');
  storage.fail(()=>false);
  assert.equal(saveWorldSafe(storage,recovered.world).ok,true);
  assert.equal(loadWorldSafe(storage,179).source,'primary');
  assert.deepEqual(parseWorldData(storage.getItem(key+SAVE_BACKUP_SUFFIX)).save(),JSON.parse(old));
});
test('journal write corruption is detected via read-after-write verification',()=>{
  const storage=store(),w=changed(),key=worldSlotKey(179);
  storage.setItem=(k,v)=>{storage.map.set(k,k.endsWith(SAVE_JOURNAL_SUFFIX)?'corrupted':v);};
  assert.equal(saveWorldSafe(storage,w).ok,false);
  assert.equal(storage.getItem(key),null);
});
test('selected world preference failure never lies about saved edits',()=>{
  const storage=store(),w=changed(),key=worldSlotKey(179);
  storage.fail((op,k)=>op==='set'&&k===SELECTED_SEED_KEY);
  const result=saveWorldSafe(storage,w);
  assert.equal(result.ok,true);assert.match(result.warning,/preference/);
  assert.deepEqual(parseWorldData(storage.getItem(key),179).save(),w.save());
});
test('bad export, seed mismatch, excessive edits, duplicates and wrong schema rejected',()=>{
  const w=changed(),text=JSON.stringify(w.save());
  assert.deepEqual(importWorldData(text).save(),w.save());
  assert.throws(()=>parseWorldData(text,180),/seed mismatch/);
  const row=w.save().edits[0];
  assert.throws(()=>importWorldData(JSON.stringify({schema:1,seed:179,edits:[row,row]})),/Duplicate/);
  assert.throws(()=>importWorldData(JSON.stringify({schema:2,seed:179,edits:[]})),/Unsupported/);
  assert.throws(()=>importWorldData('x'.repeat(21*1024*1024)),/too large/);
  assert.throws(()=>importWorldData('{'),SyntaxError);
});
test('original save exports round-trip exactly without wrapper or migration',()=>{
  const w=changed(),data=JSON.stringify(w.save(),null,2),r=importWorldData(data);
  assert.deepEqual(r.save(),w.save());
  assert.equal(saveFingerprint(data),saveFingerprint(data));
  assert.notEqual(saveFingerprint(data),saveFingerprint(data+' '));
});
test('corrupted legacy world never silently becomes empty new seed',()=>{
  const storage=store({[LEGACY_WORLD_KEY]:'garbage'});
  assert.throws(()=>loadWorldSafe(storage,179),/Legacy world data is damaged/);
  assert.equal(storage.getItem(worldSlotKey(179)),null);
});

test('explicit import repair preserves exact damaged bytes while restoring valid data',()=>{
  const key=worldSlotKey(179),storage=store({[key]:'not-json-data'}),w=changed();
  const blocked=saveWorldSafe(storage,w);
  assert.equal(blocked.ok,false);
  const approved=saveWorldSafe(storage,w,{allowReplaceCorrupt:true});
  assert.equal(approved.ok,true);
  assert.equal(storage.getItem(key+SAVE_DAMAGED_SUFFIX),'not-json-data');
  assert.deepEqual(loadWorldSafe(storage,179).world.save(),w.save());
});

test('verified stale journal takes precedence only when it differs from the primary',()=>{
  const storage=store(),w=changed(),key=worldSlotKey(179);
  assert.equal(saveWorldSafe(storage,w).ok,true);
  const original=storage.getItem(key);
  w.set(4,18,4,BLOCK.WOOD);
  storage.fail((op,k)=>op==='set'&&k===key);
  assert.equal(saveWorldSafe(storage,w).ok,false);
  const recovered=loadWorldSafe(storage,179);
  assert.equal(recovered.source,'journal');
  assert.deepEqual(recovered.world.save(),w.save());
  assert.equal(storage.getItem(key),original);
  storage.fail(()=>false);
  assert.equal(saveWorldSafe(storage,recovered.world).ok,true);
  assert.equal(loadWorldSafe(storage,179).source,'primary');
});
test('damaged evidence cannot be silently replaced with different damaged bytes',()=>{
  const storage=store(),w=changed(),key=worldSlotKey(179);
  storage.setItem(key,'damaged-A');
  assert.equal(saveWorldSafe(storage,w,{allowReplaceCorrupt:true}).ok,true);
  assert.equal(storage.getItem(key+SAVE_DAMAGED_SUFFIX),'damaged-A');
  storage.setItem(key,'damaged-B');
  assert.equal(saveWorldSafe(storage,w,{allowReplaceCorrupt:true}).ok,false);
  assert.equal(storage.getItem(key),'damaged-B');
  assert.equal(storage.getItem(key+SAVE_DAMAGED_SUFFIX),'damaged-A');
});
