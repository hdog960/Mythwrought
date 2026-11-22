import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkyEditSession,planSkySessionEdit,skySessionOverlay,
  skySessionView,exportSkyEditSession,createSkyEditSessionFromSnapshot}
  from '../../src/floating-islands/sky-edit-session.mjs';
const source={seed:2026,worldId:'original-w1',generatorFingerprint:'unknown-generator-provisional',
  naturalAt:(x,y,z)=>x===0&&y===35&&z===0?370:0,
  validateId:id=>[0,3,370,379].includes(id)?id:null,
  rotationAllowed:id=>id===370||id===379};
const edit=(s,x,y,z,id,extra={},resident={})=>planSkySessionEdit(s,
  {x,y,z,id,rotation:0,expectedRevision:s.state.revision,
    worldId:s.state.worldId,generatorFingerprint:s.state.generatorFingerprint,...extra},
  {loadedSkyKeys:new Set(resident.sky??[]),loadedGroundKeys:new Set(resident.ground??[])});
test('mining across a sky vertical seam invalidates both real loaded sections',()=>{
  const s=createSkyEditSession(source);
  const r=edit(s,0,35,0,0,{}, {sky:['sky:0,0,0','sky:0,0,1']});
  assert.equal(r.changed,true);
  assert.deepEqual(r.meshInvalidations.skyKeys,['sky:0,0,0','sky:0,0,1']);
  assert.deepEqual(r.meshInvalidations.groundKeys,[]);
  assert.equal(skySessionView(r.session).get(0,35,0),0);
  assert.equal(skySessionView(s).get(0,35,0),370);
});
test('Y20 upper-side placement invalidates both loaded original surface and sky',()=>{
  const s=createSkyEditSession(source);
  const r=edit(s,0,20,0,3,{}, {sky:['sky:0,0,0','sky:-1,0,0'],ground:['0,0','-1,0']});
  assert.deepEqual(r.meshInvalidations.skyKeys,['sky:0,0,0','sky:-1,0,0']);
  assert.deepEqual(r.meshInvalidations.groundKeys,['0,0','-1,0']);
  assert.equal(skySessionView(r.session).get(0,20,0),3);
});
test('separate exported overlay copies can be mutated without changing the session',()=>{
  const s=createSkyEditSession(source);
  const r=edit(s,-12001,140,14001,379,{rotation:3});
  const a=skySessionOverlay(r.session),b=skySessionOverlay(r.session);
  assert.equal(a.edits.get('-12001,140,14001'),379);
  assert.equal(a.rotations.get('-12001,140,14001'),3);
  a.edits.clear();a.rotations.clear();
  assert.equal(b.edits.get('-12001,140,14001'),379);
  assert.equal(skySessionView(r.session).rotationAt(-12001,140,14001),3);
  assert.equal(a.groundSaveWrites,0);
});
test('world token mismatch returns untouched original session and no GPU invalidation',()=>{
  const s=createSkyEditSession(source);
  const r=edit(s,0,35,0,0,{worldId:'old-world'},
    {sky:['sky:0,0,0','sky:0,0,1']});
  assert.equal(r.ok,false);assert.equal(r.session,s);
  assert.deepEqual(r.meshInvalidations.skyKeys,[]);
});
test('snapshot reload keeps AIR and rotation metadata separate from original saved world',()=>{
  let s=createSkyEditSession(source);
  s=edit(s,0,35,0,0).session;
  s=edit(s,10000,110,-12000,379,{rotation:2}).session;
  const p=exportSkyEditSession(s);
  assert.ok(!Object.hasOwn(p,'schema'));
  const restored=createSkyEditSessionFromSnapshot(JSON.parse(JSON.stringify(p)),source);
  assert.equal(skySessionView(restored).get(0,35,0),0);
  assert.equal(skySessionView(restored).rotationAt(10000,110,-12000),2);
});
test('invalid missing resident sets or out of bounds fails before state change',()=>{
  const s=createSkyEditSession(source),a={x:1,y:60,z:1,id:3,expectedRevision:0,
    worldId:'original-w1',generatorFingerprint:'unknown-generator-provisional'};
  assert.throws(()=>planSkySessionEdit(s,a,{}),/resident/);
  assert.throws(()=>edit(s,0,257,0,3),/invalid/);
  assert.equal(s.state.revision,0);
});
test('exported state and source context are frozen, no world cell writer exists',()=>{
  const s=createSkyEditSession(source);
  assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(s.context));
  assert.ok(!Object.hasOwn(s,'groundWorld'));
  assert.ok(!Object.hasOwn(s,'set'));
});
