// No world registration; verifies a precise Pack 1 -> future-builder interface.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PACK1_BUILDER_CATALOG,pack1BuilderShape,pack1BuilderPlacementPlan,
  pack1CanonicalSchema1Edit,pack1BuilderFaceTexture
} from '../../../src/block-packs/pack-1/builder-handoff.mjs';
import {candidateSurface} from '../../../src/block-packs/pack-1/webgl2-candidates.mjs';

test('all 30 stable physical candidates have one builder catalog entry, no legacy ID overlap',()=>{
  assert.deepEqual(PACK1_BUILDER_CATALOG.map(x=>x.id),
    Array.from({length:30},(_,i)=>9+i));
  assert.equal(new Set(PACK1_BUILDER_CATALOG.map(x=>x.slug)).size,30);
  assert.equal(new Set(PACK1_BUILDER_CATALOG.map(x=>x.roster)).size,21);
  assert.ok(PACK1_BUILDER_CATALOG.every(e=>e.candidateOnly&&!e.productionRegistered));
  assert.equal(pack1BuilderShape(8),null);
  assert.equal(pack1BuilderShape(255),null);
});
test('120 rotation cases are shape/selection/collision safe and renderer source bounded',()=>{
  let n=0;
  for(const {id} of PACK1_BUILDER_CATALOG)for(const rotation of [0,1,2,3]){
    const s=pack1BuilderShape(id,{rotation});
    assert.ok(s.shape.boxes.length>0&&s.shape.boxes.length<=32);
    assert.ok(s.selection.boxes.length>0);
    assert.ok(s.collision.boxes.length<=s.shape.boxes.length);
    assert.equal(s.cellSpan[0]*s.cellSpan[1]*s.cellSpan[2],1);
    assert.equal(s.requiresOrientationSidecar,rotation!==0&&id>14);
    const surface=candidateSurface(id,rotation);
    assert.ok(surface.triangles>0&&surface.triangles<10000,
      'source-only surface budget exceeded for '+id+'/'+rotation);
    n++;
  }
  assert.equal(n,120);
});
test('flowers are selectable but passable; mushrooms keep stem-only collisions',()=>{
  for(const id of [26,27,28,29,30,31,32,33,34,35])
    assert.equal(pack1BuilderShape(id).collision.boxes.length,0);
  for(const id of [36,37,38]){
    const s=pack1BuilderShape(id);
    assert.ok(s.collision.boxes.length>0&&s.collision.boxes.length<s.shape.boxes.length);
  }
});
test('canonical schema-1 plans are reversible four-item edits; no implicit save of rotation',()=>{
  for(const {id} of PACK1_BUILDER_CATALOG){
    const p=pack1BuilderPlacementPlan(id,{cell:[-17,4,23],wallMounted:true});
    assert.equal(p.ok,true);
    assert.deepEqual(pack1CanonicalSchema1Edit(p),[-17,4,23,id]);
    assert.equal(p.canonicalSchema1Only,true);
  }
  for(const id of [15,16,17,21,24,27,32,38]){
    const p=pack1BuilderPlacementPlan(id,{cell:[0,5,0],rotation:3,wallMounted:true});
    assert.equal(p.requiredOrientationSidecar.turns,3);
    assert.equal(p.canonicalSchema1Only,false);
    assert.throws(()=>pack1CanonicalSchema1Edit(p),/orientation\/variant/);
  }
});
test('upper slab/stair variants require separate variant persistence even without rotation',()=>{
  for(const id of [15,16]){
    const p=pack1BuilderPlacementPlan(id,{cell:[0,0,0],variant:'upper'});
    assert.equal(p.requiredOrientationSidecar,null);
    assert.equal(p.requiredVariantState.variant,'upper');
    assert.throws(()=>pack1CanonicalSchema1Edit(p),/orientation\/variant/);
    assert.notDeepEqual(p.shape.shape.boxes,pack1BuilderShape(id).shape.boxes);
  }
  assert.throws(()=>pack1BuilderShape(19,{variant:'upper'}),/Upper variant/);
  assert.throws(()=>pack1BuilderShape(14,{variant:'upper'}),/Upper variant/);
});
test('ivy and wisteria require vertical support; no false live placement',()=>{
  for(const id of [27,28]){
    assert.equal(pack1BuilderPlacementPlan(id,{cell:[1,2,3]}).reason,
      'supporting-vertical-face-required');
    const p=pack1BuilderPlacementPlan(id,{cell:[1,2,3],wallMounted:true});
    assert.equal(p.ok,true);
    assert.equal(p.supportMustBeRevalidated,true);
  }
  assert.throws(()=>pack1BuilderPlacementPlan(999,{cell:[0,0,0]}),/Unknown/);
  assert.throws(()=>pack1BuilderPlacementPlan(9,{cell:[.5,0,0]}),/safe integers/);
  assert.throws(()=>pack1BuilderShape(15,{rotation:4}),/quarter turn/);
});
test('original role textures are available to builders without inventing new assets',()=>{
  const t=pack1BuilderFaceTexture(22,'cedar','north',24);
  assert.equal(t.pixels.length,24*24*4);
  assert.throws(()=>pack1BuilderFaceTexture(8,'stone','north'),/Unknown/);
});
