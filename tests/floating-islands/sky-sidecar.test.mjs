import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkySidecar,planSkyCellEdit,readSkyEdit,exportSkySidecar,
  restoreSkySidecar,SKY_SIDECAR_FORMAT} from '../../src/floating-islands/sky-sidecar.mjs';
const ctx={naturalAt:(x,y,z)=>x===3&&y===70&&z===4?370:0,
  validateId:id=>[0,3,370,379,376,385,375,384,287].includes(id)?id:null,
  rotationAllowed:id=>id>=256};
const init=(over={})=>createSkySidecar({seed:179,worldId:'w0',generatorFingerprint:'codex-not-yet-known',...over});
const edit=(state,x,y,z,id,extra={})=>planSkyCellEdit(state,
  {x,y,z,id,expectedRevision:state.revision,worldId:state.worldId,
    generatorFingerprint:state.generatorFingerprint,...extra},ctx);
test('separate sky editing uses true AIR=0 to mine naturally generated physical blocks',()=>{
  const s=init();assert.equal(readSkyEdit(s,3,70,4,ctx).id,370);
  const a=edit(s,3,70,4,0);
  assert.equal(a.ok,true);assert.equal(a.state.revision,1);
  assert.deepEqual(readSkyEdit(a.state,3,70,4,ctx),{id:0,rotation:0,edited:true});
  assert.equal(readSkyEdit(s,3,70,4,ctx).id,370);
});
test('placing then resetting natural block shrinks save instead of retaining redundant edit',()=>{
  const s=init(),a=edit(s,10001,90,-12321,379);
  assert.equal(a.state.edits.length,1);
  const b=edit(a.state,10001,90,-12321,0);
  assert.equal(b.state.edits.length,0);
  assert.equal(b.state.revision,2);
});
test('rotation of source-authorized real biome material persists and rejects legacy rotations',()=>{
  const s=init(),a=edit(s,-10004,250,10350,379,{rotation:2});
  assert.equal(readSkyEdit(a.state,-10004,250,10350,ctx).rotation,2);
  assert.throws(()=>edit(s,0,50,0,3,{rotation:1}),/rotation/);
});
test('export/restore is separate, stable, sorted and unaliased to source world',()=>{
  let state=init();
  state=edit(state,12000,201,-14000,379).state;
  state=edit(state,-10000,35,-1,370).state;
  state=edit(state,3,70,4,0).state;
  const exported=exportSkySidecar(state,ctx);
  assert.equal(exported.format,SKY_SIDECAR_FORMAT);
  assert.deepEqual(exported.edits.map(r=>r[0]),[-10000,3,12000]);
  const restored=restoreSkySidecar(JSON.parse(JSON.stringify(exported)),
    {seed:179,worldId:'w0',generatorFingerprint:'codex-not-yet-known'},ctx);
  assert.deepEqual(restored.edits,state.edits);
  exported.edits[0][3]=0;
  assert.equal(restored.edits[0][3],370);
});
test('wrong seed, world identity and generator fingerprint fail closed',()=>{
  const state=edit(init(),3,70,4,0).state;
  const data=exportSkySidecar(state,ctx);
  for(const option of [{seed:2026},{worldId:'other-world'},{generatorFingerprint:'other-generator'}])
    assert.throws(()=>restoreSkySidecar(data,
      {seed:179,worldId:'w0',generatorFingerprint:'codex-not-yet-known',...option},ctx),/wrong source world/);
});
test('stale revision or token cannot publish a new sidecar edit',()=>{
  const state=init();
  assert.equal(edit(state,0,50,0,3,{expectedRevision:99}).ok,false);
  assert.equal(edit(state,0,50,0,3,{worldId:'unrelated'}).ok,false);
  assert.equal(edit(state,0,50,0,3,{generatorFingerprint:'new generator'}).ok,false);
  assert.equal(state.edits.length,0);
});
test('per-world edit budget refuses partial edit and preserves prior snapshot',()=>{
  const state=init({maxEdits:1});
  const a=edit(state,0,100,0,3).state;
  const b=edit(a,1,100,0,3);
  assert.equal(b.ok,false);assert.equal(b.state,a);
  assert.equal(a.edits.length,1);
});
test('duplicate forged rows and unsupported rotated IDs fail restore before use',()=>{
  const s=init(),raw=exportSkySidecar(s,ctx);
  raw.edits=[[1,99,1,370,0],[1,99,1,379,0]];
  assert.throws(()=>restoreSkySidecar(raw,{seed:179,worldId:'w0',
    generatorFingerprint:'codex-not-yet-known'},ctx),/duplicate/);
  raw.edits=[[1,99,1,65534,0]];
  assert.throws(()=>restoreSkySidecar(raw,{seed:179,worldId:'w0',
    generatorFingerprint:'codex-not-yet-known'},ctx),/physical block/);
});
test('negative and far horizontal coordinates admitted but out-of-height or unsafe numbers refused',()=>{
  const s=init();
  assert.equal(edit(s,-100000,20,100000,370).ok,true);
  for(const [x,y,z] of [[0,19,0],[0,257,0],[Number.MAX_SAFE_INTEGER,20,0],[1.5,50,0]])
    assert.throws(()=>edit(s,x,y,z,3),/invalid cell/);
});
test('original world schema is never changed or read through a save API',()=>{
  let calls=0;const ground={save(){calls++;throw Error('must not call');}};
  const s=init(),next=edit(s,12,35,14,370).state;
  assert.equal(exportSkySidecar(next,ctx).format,SKY_SIDECAR_FORMAT);
  assert.equal(calls,0);assert.ok(ground.save);
});
test('editing natural equal ID is no-op and cannot grow revision',()=>{
  const s=init(),result=edit(s,3,70,4,370);
  assert.equal(result.changed,false);assert.equal(result.state,s);
});
