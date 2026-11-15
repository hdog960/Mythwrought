// No world registration; verifies a precise Pack 1 -> future-builder interface.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PACK1_BUILDER_CATALOG,PACK1_BUILDER_FAMILY_REFS,
  pack1BuilderFamilyCandidates,resolvePack1BuilderFamily,
  pack1BuilderShape,pack1InteractionReaderShapes,pack1BuilderPlacementPlan,
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
  for(const {id,support} of PACK1_BUILDER_CATALOG){
    const p=pack1BuilderPlacementPlan(id,{
      cell:[-17,4,23],wallMounted:support==='vertical-face'
    });
    assert.equal(p.ok,true);
    if(support==='vertical-face'){
      assert.equal(p.canonicalSchema1Only,false);
      assert.equal(p.requiredMountState.blockId,id);
      assert.throws(()=>pack1CanonicalSchema1Edit(p),/orientation\/variant\/mount/);
    }else{
      assert.deepEqual(pack1CanonicalSchema1Edit(p),[-17,4,23,id]);
      assert.equal(p.canonicalSchema1Only,true);
      assert.equal(p.requiredMountState,null);
    }
  }
  for(const id of [15,16,17,21,24,27,32,38]){
    const p=pack1BuilderPlacementPlan(id,{
      cell:[0,5,0],rotation:3,wallMounted:id===27||id===28
    });
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

test('all 21 building-roadmap family symbols resolve explicitly to 30 distinct ID variants',()=>{
  const families=[
    ...Array.from({length:12},(_,i)=>'pack1:'+String(i+1).padStart(3,'0')),
    ...Array.from({length:9},(_,i)=>'pack1:'+String(i+47).padStart(3,'0'))
  ].sort();
  assert.deepEqual(PACK1_BUILDER_FAMILY_REFS,families);
  assert.equal(PACK1_BUILDER_CATALOG.filter(x=>x.symbolicRef==='pack1:053').length,4);
  assert.deepEqual(pack1BuilderFamilyCandidates('pack1:051').map(x=>x.id),[25,26]);
  assert.deepEqual(pack1BuilderFamilyCandidates('pack1:052').map(x=>x.id),[27,28]);
  assert.deepEqual(pack1BuilderFamilyCandidates('pack1:053').map(x=>x.id),[32,33,34,35]);
  assert.deepEqual(pack1BuilderFamilyCandidates('pack1:054').map(x=>x.id),[36,37,38]);
  assert.deepEqual(pack1BuilderFamilyCandidates('pack1:055').map(x=>x.id),[29,30,31]);
  assert.equal(resolvePack1BuilderFamily('pack1:001').id,9);
  assert.equal(resolvePack1BuilderFamily('pack1:053',{candidateId:35}).id,35);
  assert.throws(()=>resolvePack1BuilderFamily('pack1:053'),/Ambiguous/);
  assert.throws(()=>resolvePack1BuilderFamily('pack1:051',{candidateId:35}),/not part/);
  assert.throws(()=>resolvePack1BuilderFamily('pack1:039'),/Unknown/);
  assert.deepEqual(pack1BuilderFamilyCandidates('pack2:001'),[]);
});

test('ray selection remains authored while soft plant collision uses null reader shape',()=>{
  for(const id of [26,27,28,29,30,31,32,33,34,35]){
    for(const rotation of [0,1,2,3]){
      const r=pack1InteractionReaderShapes(id,{rotation});
      assert.equal(r.isPassable,true);
      assert.equal(r.collisionShape,null);
      assert.ok(r.targetShape.boxes.length>0);
      assert.ok(r.targetShape.boxes.every(b=>b.length===6));
    }
  }
  assert.equal(pack1InteractionReaderShapes(8),null);
});
test('all Pack 1 collision and target reader shapes match nonempty shared AABB input contract',()=>{
  const valid=s=>s&&Array.isArray(s.boxes)&&s.boxes.length>=1&&
    s.boxes.length<=32&&s.boxes.every(b=>Array.isArray(b)&&b.length===6&&
      b.every(Number.isFinite)&&[0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1));
  for(const {id} of PACK1_BUILDER_CATALOG){
    for(const rotation of [0,1,2,3]){
      const r=pack1InteractionReaderShapes(id,{rotation});
      assert.ok(valid(r.targetShape),id+'/'+rotation+' target');
      assert.ok(r.collisionShape===null||valid(r.collisionShape),id+'/'+rotation+' body');
      assert.equal(r.isPassable,r.collisionShape===null);
    }
  }
});
test('nonpassable masonry and stem-only mushrooms retain real collision geometry',()=>{
  for(const id of [9,10,11,12,13,14,36,37,38]){
    const r=pack1InteractionReaderShapes(id,{rotation:3});
    assert.equal(r.isPassable,false);
    assert.ok(r.collisionShape.boxes.length>0);
  }
  const stem=pack1InteractionReaderShapes(36);
  assert.ok(stem.collisionShape.boxes.length<stem.targetShape.boxes.length);
  const upper=pack1InteractionReaderShapes(16,{rotation:2,variant:'upper'});
  assert.ok(upper.collisionShape.boxes.length>0);
});

test('mount direction cannot be silently erased by a four-value schema-1 edit',()=>{
  for(const id of [27,28]){
    const plan=pack1BuilderPlacementPlan(id,{cell:[14,3,9],wallMounted:true});
    assert.equal(plan.ok,true);
    assert.equal(plan.requiredOrientationSidecar,null);
    assert.equal(plan.requiredVariantState,null);
    assert.equal(plan.canonicalSchema1Only,false);
    assert.equal(plan.requiredMountState.requiresFace,true);
    assert.deepEqual(plan.requiredMountState.cell,[14,3,9]);
    assert.throws(()=>pack1CanonicalSchema1Edit(plan),/orientation\/variant\/mount/);
    assert.throws(()=>pack1CanonicalSchema1Edit({...plan,canonicalSchema1Only:true,
      requiredMountState:null}),/orientation\/variant\/mount/);
  }
});
test('non-wall blocks cannot pass the source mount preflight, even without rotation',()=>{
  for(const id of [9,15,24,33,37]){
    const p=pack1BuilderPlacementPlan(id,{cell:[1,4,5],wallMounted:true});
    assert.equal(p.ok,false);
    assert.equal(p.reason,'wall-mount-not-supported');
  }
  for(const id of [27,28]){
    const p=pack1BuilderPlacementPlan(id,{cell:[1,4,5],wallMounted:false});
    assert.equal(p.ok,false);
    assert.equal(p.reason,'supporting-vertical-face-required');
  }
  assert.throws(()=>pack1BuilderPlacementPlan(27,{cell:[1,4,5],wallMounted:'west'}),
    /wallMounted must be a boolean/);
});
