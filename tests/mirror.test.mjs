import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {MIRROR_DB,MIRROR_PREF,mirrorSnapshot,validateMirrorSnapshot,
  inspectMirrorRecord,MirrorWriteQueue,inspectMirror} from '../src/mirror.mjs';
const world=(seed=179,id=BLOCK.WOOD)=>{const w=new VoxelWorld(seed);w.set(15,18,-1,id);return JSON.stringify(w.save());};
test('separate mirror preserves exact original schema-1 bytes and checksum',()=>{
 const raw=world(),slot=mirrorSnapshot(raw,179,'2026-11-11T20:00:00Z');
 assert.equal(validateMirrorSnapshot(slot,179).raw,raw);
 assert.equal(slot.edits,1);
 assert.equal(MIRROR_PREF,'mythwrought-v010-enable-mirror');
 assert.match(MIRROR_DB,/save-mirror/);
});
test('tampered, mismatched, unsupported data rejected without rewriting it',()=>{
 const good=mirrorSnapshot(world(),179);
 assert.throws(()=>validateMirrorSnapshot({...good,checksum:'deadbeef'},179),/checksum/);
 assert.throws(()=>validateMirrorSnapshot({...good,seed:180},179),/seed/);
 assert.throws(()=>validateMirrorSnapshot({...good,edits:4},179),/edit count/);
 assert.throws(()=>mirrorSnapshot(world(),180),/seed mismatch/);
 assert.throws(()=>inspectMirrorRecord({version:2,seed:179},179),/metadata/);
 const inspected=inspectMirrorRecord({version:1,seed:179,current:{...good,raw:'broken'},previous:good},179);
 assert.equal(inspected.current.valid,false);
 assert.equal(inspected.previous.valid,true);
 assert.equal(inspected.previous.raw,good.raw);
});
test('one seed queue preserves source order even across delayed writes',async()=>{
 const seen=[],queue=new MirrorWriteQueue(async raw=>{
   if(JSON.parse(raw).edits[0][3]===BLOCK.WOOD)await new Promise(resolve=>setTimeout(resolve,12));
   seen.push(JSON.parse(raw).edits[0][3]);
 });
 const first=queue.enqueue(world(179,BLOCK.WOOD));
 const second=queue.enqueue(world(179,BLOCK.CRYSTAL));
 await Promise.all([first,second]);await queue.idle();
 assert.deepEqual(seen,[BLOCK.WOOD,BLOCK.CRYSTAL]);
});
test('a failed mirror write does not prevent a subsequent canonical snapshot',async()=>{
 const seen=[],queue=new MirrorWriteQueue(async raw=>{
   const id=JSON.parse(raw).edits[0][3];if(id===BLOCK.WOOD)throw Error('Quota');
   seen.push(id);
 });
 await assert.rejects(queue.enqueue(world(179,BLOCK.WOOD)),/Quota/);
 await queue.enqueue(world(179,BLOCK.CRYSTAL));
 assert.deepEqual(seen,[BLOCK.CRYSTAL]);
});
test('unavailable IndexedDB rejects without touching live world bytes',async()=>{
 const raw=world(),saved=new Map([['mythwrought-v002-world-179',raw]]);
 await assert.rejects(inspectMirror(179,null),/IndexedDB unavailable/);
 assert.equal(saved.get('mythwrought-v002-world-179'),raw);
});
