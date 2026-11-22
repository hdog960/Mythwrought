import test from 'node:test';
import assert from 'node:assert/strict';
import {stageSkyIslandGpuTransaction} from '../../src/floating-islands/sky-gpu-transaction.mjs';
import {publishSkyIslandGpuFrame} from '../../src/floating-islands/sky-frame-publish.mjs';
const mesh=(key)=>({key,cx:0,cz:0,section:0,vertices:new Float32Array(54),vertexCount:6});
function build({existingChunks=new Map([['ground:0,0',{buffer:{id:'oldGround'}}]]),
  desiredKeys=['ground:0,0','sky:0,0,0'],meshes=[mesh('sky:0,0,0')],
  failUpload=0}={}){
  let nextId=0,uploaded=[],deleted=[];
  const gl={deleteBuffer:b=>deleted.push(b)};
  const uploadBuffer=(context)=>{assert.equal(context,gl);
    if(++nextId===failUpload)throw Error('WebGL out of memory');
    const b={id:'new'+nextId};uploaded.push(b);return b;};
  const transaction=stageSkyIslandGpuTransaction({gl,existingChunks,
    batch:{meshes},desiredKeys,uploadBuffer});
  let current=existingChunks,epoch=8,world='seed179#0',context='webgl2:0',
    failSet=false,failAfterSet=false,failDispose=false,changes=0;
  const host={transaction,getChunks:()=>current,
    setChunks:map=>{if(failSet)throw Error('publish refused');current=map;changes++;
      if(failAfterSet)throw Error('publish after swap');},
    deleteBuffer:b=>{if(failDispose)throw Error('delete fault');deleted.push(b);},
    worldToken:world,expectedWorldToken:world,contextToken:context,expectedContextToken:context,
    epoch,expectedEpoch:epoch};
  return {host,gl,existingChunks,uploaded,deleted,get current(){return current},
    get changes(){return changes},setWorld:s=>{host.worldToken=s},setEpoch:n=>{host.epoch=n},
    setContext:s=>{host.contextToken=s},setFailSet:b=>{failSet=b},
    setFailAfterSet:b=>{failAfterSet=b},setFailDispose:b=>{failDispose=b},
    setCurrent:map=>{current=map}};
}
test('renderer explicitly publishes before deleting replaced buffers',()=>{
  const oldSky={buffer:{id:'oldSky'}};
  const old=new Map([['ground:0,0',{buffer:{id:'ground'}}],['sky:0,0,0',oldSky]]);
  const a=build({existingChunks:old});
  const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'published');assert.equal(a.current,a.host.transaction.nextChunks);
  assert.equal(a.current.get('ground:0,0'),old.get('ground:0,0'));
  assert.deepEqual(a.deleted,[oldSky.buffer]);assert.equal(r.resident,2);
});
test('old world token causes staged cleanup and keeps all live ground buffers',()=>{
  const a=build();a.setWorld('seed2026#1');const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'stale');assert.equal(a.current,a.existingChunks);
  assert.deepEqual(a.deleted,a.uploaded);
});
test('GPU context loss refuses publication and must not issue gl.deleteBuffer',()=>{
  const a=build();a.setContext('webgl2:lost');const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'refused');assert.equal(r.abandonedOnContextLoss,true);
  assert.equal(a.deleted.length,0);assert.equal(a.current,a.existingChunks);
});
test('renderer epoch change uses exact compare-and-swap and discards new candidate',()=>{
  const a=build();a.setEpoch(9);const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'stale');assert.deepEqual(a.deleted,a.uploaded);
});
test('mutation of existing map in-place during GPU staging is detected',()=>{
  const a=build();a.existingChunks.set('ground:0,0',{buffer:{id:'tampered'}});
  const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'stale');assert.equal(a.changes,0);
  assert.deepEqual(a.deleted,a.uploaded);
});
test('map ownership changed by another frame is not silently overwritten',()=>{
  const a=build();const other=new Map(a.existingChunks);a.setCurrent(other);
  const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'stale');assert.equal(a.current,other);
});
test('synchronous publish refusal retains old map and destroys staged candidate',()=>{
  const a=build();a.setFailSet(true);
  const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'refused');assert.equal(a.current,a.existingChunks);
  assert.deepEqual(a.deleted,a.uploaded);
});
test('publisher throws after swapping; safe rollback restores prior owner',()=>{
  const a=build();a.setFailAfterSet(true);
  const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'fatal'); // rollback callback also threw -> no safe disposal
  assert.equal(r.needsRendererReset,true);assert.equal(a.deleted.length,0);
});
test('GPU deletion failure after successful publication is disclosed, not rolled back',()=>{
  const a=build({existingChunks:new Map([['sky:1,0,0',{buffer:{id:'old'}}]]),
    desiredKeys:['sky:0,0,0']});a.setFailDispose(true);
  const r=publishSkyIslandGpuFrame(a.host);
  assert.equal(r.status,'published');assert.equal(r.disposeFailed.length,1);
  assert.equal(a.current.has('sky:1,0,0'),false);
});
test('transaction cannot be replayed to double-free buffers',()=>{
  const a=build();const first=publishSkyIslandGpuFrame(a.host);
  assert.equal(first.status,'published');
  const second=publishSkyIslandGpuFrame(a.host);
  assert.equal(second.status,'refused');assert.match(second.reason,/already finalized/);
});
test('shared sky/ground resident cap is enforced at staging instead of allowing 27',()=>{
  const existingChunks=new Map(),gl={deleteBuffer:()=>{}};
  assert.throws(()=>stageSkyIslandGpuTransaction({gl,existingChunks,batch:{meshes:[]},
    desiredKeys:['a'],uploadBuffer:()=>({}),maxResident:27}),/bounded/);
});
test('staging captures source entries before a hostile uploader mutates live map',()=>{
  const existingChunks=new Map([['ground:0,0',{buffer:{id:'ground'}}]]),gl={deleteBuffer:()=>{}};
  const transaction=stageSkyIslandGpuTransaction({gl,existingChunks,batch:{meshes:[mesh('sky:0,0,0')]},
    desiredKeys:['ground:0,0','sky:0,0,0'],uploadBuffer:()=>{
      existingChunks.set('ground:0,0',{buffer:{id:'changed'}});return {id:'new'};}});
  assert.notEqual(transaction.baseEntries[0][1],existingChunks.get('ground:0,0'));
  assert.ok(Object.isFrozen(transaction.baseEntries));
});
test('tampered staged nextChunks is refused before any renderer callback',()=>{
  const a=build();a.host.transaction.nextChunks.set('sky:999,0,0',{buffer:{id:'forged'}});
  assert.throws(()=>publishSkyIslandGpuFrame(a.host),/modified after GPU upload/);
  assert.equal(a.changes,0);
});
test('staging seals exact base and next entry lists',()=>{
  const a=build();const t=a.host.transaction;
  assert.ok(Object.isFrozen(t.baseEntries));assert.ok(Object.isFrozen(t.nextEntries));
  assert.ok(t.nextEntries.every(Object.isFrozen));
  assert.equal(t.baseChunks,a.existingChunks);
});
test('renderer owner unavailable before CAS safely frees freshly staged resources',()=>{
  const a=build();let calls=0;
  const r=publishSkyIslandGpuFrame({...a.host,getChunks:()=>{calls++;throw Error('lost owner');}});
  assert.equal(r.status,'refused');assert.equal(calls,1);assert.deepEqual(a.deleted,a.uploaded);
});
test('renderer getter fails after setter exception, refuses unsafe deletion',()=>{
  const a=build();let calls=0;
  const r=publishSkyIslandGpuFrame({...a.host,getChunks:()=>{
    if(++calls===1)return a.existingChunks;
    throw Error('post-publish map inaccessible');
  },setChunks:()=>{throw Error('failed');}});
  assert.equal(r.status,'fatal');assert.equal(r.needsRendererReset,true);
  assert.equal(a.deleted.length,0);
});
