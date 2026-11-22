import test from 'node:test';
import assert from 'node:assert/strict';
import {createHistorySession,executeHistoryBatch,undoHistory,redoHistory,buildFingerprint} from '../../src/creative-mode/history-model.mjs';
import {DETACHED_SAVE_ABI,DETACHED_SAVE_KEYS,MAX_SAVE_BYTES,detachedChecksum,serializeDetachedHistory,deserializeDetachedHistory,createDetachedMemoryStore,saveDetachedCheckpoint,loadDetachedCheckpoint} from '../../src/creative-mode/save-compat.mjs';
const block={id:71,name:'Synthetic stone',category:'test',kind:'block',registered:true,placeable:true,placementRules:{requiresSupport:true}};
const object={id:'lab:arch',name:'Synthetic arch',category:'test',kind:'object',registered:true,placeable:true,placementRules:{requiresSupport:true,footprint:[{dx:0,dy:0,dz:0},{dx:1,dy:0,dz:0},{dx:0,dy:1,dz:0},{dx:1,dy:1,dz:0}]}};
const catalog=[block,object];
const ports={isRegionReady:()=>true,canEdit:()=>true,canOccupy:()=>true,canSupport:({grounded})=>grounded};
const ctx={catalog,ports};
const place=(id=71,x=0,rotation=0)=>({type:'place',id,at:{x,y:0,z:0},rotation});
const make=()=>{
 let s=createHistorySession();s=executeHistoryBatch(s,[place(),place('lab:arch',3,1)],ctx,s.state.revision).session;
 return s;
};
const save=(store,s)=>saveDetachedCheckpoint(store,s);
const load=(store,options=ctx)=>loadDetachedCheckpoint(store,options);
const failingStore=(original,failAt)=>{
 let count=0;return {read:k=>original.read(k),remove:k=>{if(++count===failAt)throw Error('simulated crash or quota');original.remove(k);},
  write:(k,v)=>{if(++count===failAt)throw Error('simulated crash or quota');original.write(k,v);}};
};

test('M5 deterministic save uses isolated owner, schema-1 compatibility label and checksum',()=>{
 const s=make();const a=serializeDetachedHistory(s),b=serializeDetachedHistory(s);
 assert.equal(a,b);const payload=JSON.parse(a).payload;
 assert.equal(payload.abi,DETACHED_SAVE_ABI);assert.equal(payload.compatibleWorldSchema,1);
 assert.equal(payload.owner,'creative-standalone-only');assert.equal(payload.revision,1);
 assert.ok(a.length<MAX_SAVE_BYTES);assert.match(JSON.parse(a).checksum,/^[0-9a-f]{16}$/);
 for(const key of Object.values(DETACHED_SAVE_KEYS))assert.ok(key.startsWith('mythwrought.creative.detached.m5.'));
});
test('detached save roundtrip replays physical-family shapes and restores frozen revisions',()=>{
 const before=make(),serialized=serializeDetachedHistory(before),after=deserializeDetachedHistory(serialized,ctx);
 assert.equal(after.state.revision,before.state.revision);assert.equal(buildFingerprint(after.state),buildFingerprint(before.state));
 assert.equal(after.past.length,1);assert.ok(Object.isFrozen(after.state.placements[0].cells));
 const undone=undoHistory(after,ctx,after.state.revision);assert.equal(undone.ok,true);
 assert.equal(undone.session.state.placements.length,0);
});
test('after undo, serialize/restore preserves redo stack and deterministic rotation',()=>{
 const orig=make(),undone=undoHistory(orig,ctx,orig.state.revision).session;
 const restored=deserializeDetachedHistory(serializeDetachedHistory(undone),ctx);
 assert.equal(restored.future.length,1);assert.equal(restored.past.length,0);
 const r=redoHistory(restored,ctx,restored.state.revision);
 assert.equal(r.ok,true);assert.equal(buildFingerprint(r.session.state),buildFingerprint(orig.state));
});
test('memory adapter stays local, save/load commit and restart preserve world',()=>{
 const mem=createDetachedMemoryStore(),s=make(),result=save(mem,s);
 assert.equal(result.ok,true);assert.equal(result.persisted,'detached-memory-only');
 assert.equal(mem.snapshot()[DETACHED_SAVE_KEYS.pending],undefined);
 const loaded=load(mem);assert.equal(loaded.ok,true);assert.equal(loaded.source,'primary');
 assert.equal(loaded.session.state.revision,s.state.revision);
});
test('empty and corrupted saves fail closed without fabricating a session',()=>{
 const store=createDetachedMemoryStore();assert.equal(load(store).reason,'no-valid-committed-checkpoint');
 store.write(DETACHED_SAVE_KEYS.primary,'truncated{');
 assert.equal(load(store).reason,'no-valid-committed-checkpoint');
});
test('checksum and wrong world schema are rejected even if JSON shape is plausible',()=>{
 const doc=JSON.parse(serializeDetachedHistory(make()));doc.payload.compatibleWorldSchema=2;
 assert.throws(()=>deserializeDetachedHistory(JSON.stringify(doc),ctx),/schema/);
 doc.checksum=detachedChecksum(JSON.stringify(doc.payload));
 assert.throws(()=>deserializeDetachedHistory(JSON.stringify(doc),ctx),/schema/);
});
test('body with valid regenerated checksum still rejects altered object geometry',()=>{
 const doc=JSON.parse(serializeDetachedHistory(make()));doc.payload.placements[1].cells[0].x=17;
 doc.checksum=detachedChecksum(JSON.stringify(doc.payload));
 assert.throws(()=>deserializeDetachedHistory(JSON.stringify(doc),ctx),/footprint/);
});
test('restore refuses inventory records absent from current real-eligible mock catalog',()=>{
 const raw=serializeDetachedHistory(make());
 assert.throws(()=>deserializeDetachedHistory(raw,{catalog:[block],ports}),/unregistered/);
 assert.throws(()=>deserializeDetachedHistory(raw,{catalog:[block,{...object,scenicOnly:true}],ports}),/registry/);
});
test('restore refuses unloaded regions or edit permissions and stays detached',()=>{
 const raw=serializeDetachedHistory(make());
 for(const field of ['isRegionReady','canEdit','canOccupy','canSupport'])
  assert.throws(()=>deserializeDetachedHistory(raw,{catalog,ports:{...ports,[field]:()=>false}}),/adapters/);
});
test('successful second checkpoint keeps verified previous primary as backup',()=>{
 const store=createDetachedMemoryStore(),a=make();assert.equal(save(store,a).ok,true);
 const b=executeHistoryBatch(a,place(71,6),ctx,a.state.revision).session;
 assert.equal(save(store,b).ok,true);
 const old=deserializeDetachedHistory(store.read(DETACHED_SAVE_KEYS.backup),ctx);
 assert.equal(old.state.revision,a.state.revision);
 assert.equal(load(store).session.state.revision,b.state.revision);
});
test('corrupt newest primary falls back to verified previous backup without rewriting',()=>{
 const mem=createDetachedMemoryStore(),a=make();save(mem,a);
 const b=executeHistoryBatch(a,place(71,6),ctx,a.state.revision).session;save(mem,b);
 mem.write(DETACHED_SAVE_KEYS.primary,'{"partial":');
 const r=load(mem);assert.equal(r.ok,true);assert.equal(r.source,'backup');assert.equal(r.recovered,true);
 assert.equal(r.session.state.revision,a.state.revision);
 assert.equal(mem.read(DETACHED_SAVE_KEYS.primary),'{"partial":');
});
test('crash before and during staging preserves previously committed snapshot',()=>{
 const a=make(),b=executeHistoryBatch(a,place(71,6),ctx,a.state.revision).session;
 for(const stage of [1,2,3]){
  const mem=createDetachedMemoryStore();save(mem,a);
  const result=save(failingStore(mem,stage),b);
  assert.equal(result.ok,false);assert.equal(result.reason,'storage-failure');
  const recovered=load(mem);assert.equal(recovered.ok,true);
  assert.equal(recovered.session.state.revision,a.state.revision);
 }
});
test('crash after committing primary leaves complete recoverable new checkpoint',()=>{
 const a=make(),b=executeHistoryBatch(a,place(71,6),ctx,a.state.revision).session;
 const mem=createDetachedMemoryStore();save(mem,a);
 const failure=save(failingStore(mem,4),b);
 assert.equal(failure.ok,false);assert.equal(failure.stage,'cleanup');
 assert.equal(load(mem).session.state.revision,b.state.revision);
});
test('quota error on first save returns failure and does not claim a committed world',()=>{
 const mem=createDetachedMemoryStore();const r=save(failingStore(mem,1),make());
 assert.equal(r.ok,false);assert.equal(load(mem).ok,false);
});
test('partial pending journal is never treated as committed save',()=>{
 const mem=createDetachedMemoryStore(),data=serializeDetachedHistory(make());
 mem.write(DETACHED_SAVE_KEYS.pending,data);
 assert.equal(load(mem).reason,'no-valid-committed-checkpoint');
});
test('missing storage API rejected before a live save can be touched',()=>{
 assert.throws(()=>saveDetachedCheckpoint({write:()=>{}},make()),/Missing isolated/);
 assert.throws(()=>loadDetachedCheckpoint(null,ctx),/Missing isolated/);
});
test('shape poisoning and unsupported storage data cannot evade footprint checking',()=>{
 const doc=JSON.parse(serializeDetachedHistory(make()));
 doc.payload.placements[1].rotation=5;doc.checksum=detachedChecksum(JSON.stringify(doc.payload));
 assert.throws(()=>deserializeDetachedHistory(JSON.stringify(doc),ctx),/serialized placement/i);
});
test('deterministic checksum is stable and sensitive to mutation',()=>{
 assert.equal(detachedChecksum('hello'),detachedChecksum('hello'));
 assert.notEqual(detachedChecksum('hello'),detachedChecksum('hellO'));
});
test('new save never overwrites valid backup with corrupt primary after recovery',()=>{
 const mem=createDetachedMemoryStore(),a=make();save(mem,a);
 const b=executeHistoryBatch(a,place(71,6),ctx,a.state.revision).session;save(mem,b);
 mem.write(DETACHED_SAVE_KEYS.primary,'corrupted-primary');
 const recovered=load(mem);assert.equal(recovered.source,'backup');
 const after=executeHistoryBatch(recovered.session,place(71,7),ctx,recovered.session.state.revision).session;
 assert.equal(save(mem,after).ok,true);
 // The old recovered checkpoint remains a valid backup, NOT corrupted-primary.
 const safe=deserializeDetachedHistory(mem.read(DETACHED_SAVE_KEYS.backup),ctx);
 assert.equal(safe.state.revision,a.state.revision);
});
test('save failure after recovered corrupt primary retains original backup',()=>{
 const mem=createDetachedMemoryStore(),a=make();save(mem,a);
 const b=executeHistoryBatch(a,place(71,6),ctx,a.state.revision).session;save(mem,b);
 mem.write(DETACHED_SAVE_KEYS.primary,'corrupted-primary');
 const c=executeHistoryBatch(a,place(71,7),ctx,a.state.revision).session;
 // When primary is malformed, second write is new primary, not backup replacement.
 const failure=save(failingStore(mem,2),c);assert.equal(failure.ok,false);
 const recovery=load(mem);assert.equal(recovery.ok,true);assert.equal(recovery.source,'backup');
 assert.equal(recovery.session.state.revision,a.state.revision);
});
