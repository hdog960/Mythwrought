import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK3_MONUMENTAL_ASSETS,PACK3_MONUMENTAL_IDS,
  pack3MonumentalById,pack3MonumentalShape,pack3MonumentalPrototype}
  from '../../../src/block-packs/pack-3/monumental-pieces.mjs';
import {PACK3_ROSTER,PACK3_COORDINATION,validatePack3Manifest}
  from '../../../src/block-packs/pack-3/manifest.mjs';
import {createPack3MonumentalFixture,restorePack3MonumentalFixture,
  MONUMENTAL_FIXTURE_FORMAT} from '../../../src/block-packs/pack-3/monumental-fixture.mjs';
const contains=(shape,x,y,z)=>shape.boxes.some(b=>
  x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]);
const turn=b=>[1-b[5],b[1],b[0],1-b[2],b[4],b[3]];
test('17 distinct roster families receive unique provisional Pack 3 IDs 109–125',()=>{
  assert.equal(validatePack3Manifest(),true);
  assert.deepEqual(PACK3_MONUMENTAL_IDS,[123,124,125]);
  assert.deepEqual(PACK3_MONUMENTAL_ASSETS.map(a=>a.roster),[76,77,78]);
  assert.equal(PACK3_ROSTER.length,17);
  assert.deepEqual(PACK3_ROSTER.map(r=>r.id),Array.from({length:17},(_,i)=>i+109));
  assert.equal(new Set(PACK3_ROSTER.map(r=>r.id)).size,17);
  assert.ok(PACK3_ROSTER.every(r=>r.implementation==='physical-candidate'&&!r.integrated));
  assert.equal(PACK3_COORDINATION.integratedCheckpoint,'008');
  assert.equal(PACK3_COORDINATION.auditedMain,'ac263720b60641c65b02330348dd76d0ef9cb75e');
  assert.equal(PACK3_COORDINATION.reservedId,255);
});
test('12 rotated monumental candidates have immutable and identical physical targeting/collision boxes',()=>{
  for(const id of PACK3_MONUMENTAL_IDS)for(let r=0;r<4;r++){
    const a=pack3MonumentalById(id,r);
    assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.parts)&&Object.isFrozen(a.boxes));
    assert.equal(a.shape.boxes,a.collision.boxes);
    assert.equal(a.shape.boxes,a.selection.boxes);
    assert.equal(a.boxes.length,a.parts.length);
    assert.equal(a.kind,'monumental-component');
    assert.equal(a.status,'unmerged-candidate');
    assert.equal(a.integrated,false);
    assert.equal(a.placeable,false);
    assert.deepEqual(a.placement.allowedRotations,[0,1,2,3]);
    assert.ok(a.parts.length>=10&&a.parts.length<=32);
    assert.deepEqual(pack3MonumentalPrototype(id,r).boxes,a.boxes);
    for(const part of a.parts){
      assert.ok(Object.isFrozen(part)&&Object.isFrozen(part.box));
      assert.ok(Object.hasOwn(a.colors,part.tone));
      const [x,y,z,X,Y,Z]=part.box;
      assert.ok([x,y,z,X,Y,Z].every(Number.isFinite));
      assert.ok(x>=0&&y>=0&&z>=0&&X<=1&&Y<=1&&Z<=1);
      assert.ok(x<X&&y<Y&&z<Z);
    }
  }
});
test('rotations preserve exact :00 right-angle Y-turn box contract including wrap',()=>{
  for(const id of PACK3_MONUMENTAL_IDS)for(let r=0;r<4;r++)
    assert.deepEqual(pack3MonumentalById(id,r).boxes.map(turn),
      pack3MonumentalById(id,(r+1)%4).boxes);
});
test('aqueduct physically contains an empty longitudinal channel bounded by walls',()=>{
  const trough=pack3MonumentalShape(123);
  assert.equal(contains(trough,.5,.15,.5),true,'trough bottom is physical');
  assert.equal(contains(trough,.1,.55,.5),true,'left channel bank physical');
  assert.equal(contains(trough,.9,.55,.5),true,'right channel bank physical');
  assert.equal(contains(trough,.5,.55,.5),false,'middle is genuinely empty');
  assert.equal(contains(trough,.5,.85,.5),false,'open sky above trough');
  assert.equal(contains(trough,.5,.55,.05),false,'open longitudinal endpoint');
  assert.equal(contains(trough,.5,.55,.95),false,'other endpoint is open');
});
test('aqueduct only advertises passive dry geometry, no fake fluid behavior',()=>{
  const a=pack3MonumentalById(123),d=a.dependencies;
  assert.equal(d.waterEngineRequired,true);
  assert.equal(d.fluidLevelSupported,false);
  assert.equal(d.flowSimulation,false);
  assert.equal(d.currentContents,'empty');
  assert.ok(!Object.hasOwn(a,'fluidSimulation'));
  assert.equal(a.persistence.liveIdRegistered,false);
});
test('spire has physical stepped stone neck and separate narrow crystal, not ID 5 cube',()=>{
  const s=pack3MonumentalShape(124),a=pack3MonumentalById(124);
  assert.equal(contains(s,.5,.06,.5),true,'stone foot');
  assert.equal(contains(s,.5,.45,.5),true,'rising neck');
  assert.equal(contains(s,.5,.72,.5),true,'crystal lower crown');
  assert.equal(contains(s,.5,.91,.5),true,'tapered crystal apex');
  assert.equal(contains(s,.05,.91,.5),false);
  assert.equal(contains(s,.5,.91,.05),false);
  assert.ok(a.parts.some(p=>p.tone==='inlay'));
  assert.notDeepEqual(a.boxes,[[0,0,0,1,1,1]]);
});
test('spire emits no real engine light and declares missing light integration',()=>{
  const d=pack3MonumentalById(124).dependencies;
  assert.equal(d.emitsLight,false);
  assert.equal(d.lightRadius,null);
  assert.equal(d.lightEngineRequired,true);
  assert.match(d.currentLight,/none/);
});
test('guardian is an actual miniature sculpture with two feet, shoulders, helm and projecting shield',()=>{
  const s=pack3MonumentalShape(125);
  assert.equal(contains(s,.36,.26,.5),true,'left leg');
  assert.equal(contains(s,.64,.26,.5),true,'right leg');
  assert.equal(contains(s,.5,.26,.5),false,'air gap between legs');
  assert.equal(contains(s,.5,.52,.5),true,'torso');
  assert.equal(contains(s,.24,.56,.5),true,'left arm');
  assert.equal(contains(s,.76,.56,.5),true,'right arm');
  assert.equal(contains(s,.5,.91,.5),true,'helmet crest');
  assert.equal(contains(s,.2,.55,.18),true,'raised forward shield');
  assert.equal(contains(s,.5,.55,.1),false,'not an all-solid cube');
});
test('guardian has no character entity, animation or assembled landmark contracts',()=>{
  const d=pack3MonumentalById(125).dependencies;
  assert.equal(d.entityBehavior,false);
  assert.equal(d.assemblyRequired,false);
  assert.equal(d.npc,false);
  assert.equal(d.animation,false);
});
test('three monumental candidate silhouettes and material palettes are genuinely distinct',()=>{
  const a=PACK3_MONUMENTAL_ASSETS;
  assert.equal(new Set(a.map(x=>x.slug)).size,3);
  assert.equal(new Set(a.map(x=>JSON.stringify(x.boxes))).size,3);
  assert.equal(new Set(a.map(x=>JSON.stringify(x.colors))).size,3);
  for(const x of a)for(const c of Object.values(x.colors))
    assert.match(c,/^#[0-9a-f]{6}$/);
});
test('isolated cell fixture supports targeting, placement, rotate, remove and overlap rejection',()=>{
  const f=createPack3MonumentalFixture(179);
  for(let r=0;r<4;r++)assert.equal(f.place([r,4,3],123,r),true);
  assert.equal(f.place([5,5,6],124,2),true);
  assert.equal(f.place([8,6,9],125,3),true);
  assert.equal(f.place([0,4,3],124,1),false,'reject occupied cell');
  assert.equal(f.place([0,50,3],124,1),false,'reject out of world bounds');
  assert.equal(f.place([0,2,3],255,0),false,'reject reserved sentinel');
  assert.equal(f.place([0,2,3],8,0),false,'reject old unrelated ID');
  assert.equal(f.place([0,2,3],123,4),false,'reject rotation outside 0..3');
  assert.deepEqual(f.inspect([5,5,6]),{id:124,rotation:2});
  assert.deepEqual(f.shapeAt(5,5,6).boxes,pack3MonumentalShape(124,2).boxes);
  assert.equal(f.shapeAt(0,10,0),null);
  assert.equal(f.remove([5,5,6]),true);
  assert.equal(f.inspect([5,5,6]),null);
  assert.equal(f.remove([5,5,6]),false);
});
test('monumental candidate snapshots round-trip independently of production save schema',()=>{
  const a=createPack3MonumentalFixture(-179);
  a.place([6,3,-4],123,0);a.place([-4,2,2],124,3);a.place([0,6,0],125,2);
  const snapshot=a.snapshot();
  assert.equal(snapshot.format,MONUMENTAL_FIXTURE_FORMAT);
  assert.equal(Object.hasOwn(snapshot,'schema'),false);
  assert.equal(snapshot.parts.length,3);
  const b=restorePack3MonumentalFixture(JSON.parse(JSON.stringify(snapshot)));
  assert.deepEqual(b.snapshot(),snapshot);
  assert.notEqual(b,a);
});
test('fail-closed restore rejects malformed, duplicated, stale or unsupported candidate parts',()=>{
  const a=createPack3MonumentalFixture();a.place([0,3,0],123,1);
  const clone=()=>JSON.parse(JSON.stringify(a.snapshot()));
  let v=clone();v.format='game-schema-1';
  assert.throws(()=>restorePack3MonumentalFixture(v),TypeError);
  v=clone();v.parts[0].rotation=-1;
  assert.throws(()=>restorePack3MonumentalFixture(v),TypeError);
  v=clone();v.parts[0].rotation=4;
  assert.throws(()=>restorePack3MonumentalFixture(v),TypeError);
  v=clone();v.parts[0].id=255;
  assert.throws(()=>restorePack3MonumentalFixture(v),TypeError);
  v=clone();v.parts[0].id=126;
  assert.throws(()=>restorePack3MonumentalFixture(v),TypeError);
  v=clone();v.parts[0].cell=[0,25,0];
  assert.throws(()=>restorePack3MonumentalFixture(v),TypeError);
  v=clone();v.parts.push({...v.parts[0]});
  assert.throws(()=>restorePack3MonumentalFixture(v),TypeError);
  assert.throws(()=>createPack3MonumentalFixture(1.2),TypeError);
});
test('bad IDs and orientations are never treated as ordinary playable blocks',()=>{
  assert.equal(pack3MonumentalById(8),null);
  assert.equal(pack3MonumentalById(122),null);
  assert.equal(pack3MonumentalById(255),null);
  assert.throws(()=>pack3MonumentalById(123,4),RangeError);
  assert.throws(()=>pack3MonumentalById(124,-1),RangeError);
  assert.throws(()=>pack3MonumentalPrototype(255),RangeError);
});
