import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK3_FORTIFIED_IDS,PACK3_FORTIFIED_ASSETS,
  pack3FortifiedById,pack3FortifiedShape,pack3FortifiedPrototype}
  from '../../../src/block-packs/pack-3/fortified-pieces.mjs';
import {createPack3FortifiedFixture,restorePack3FortifiedFixture,
  FORTIFIED_FIXTURE_FORMAT}
  from '../../../src/block-packs/pack-3/fortified-fixture.mjs';
const contains=(shape,x,y,z)=>shape.boxes.some(b=>
  x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]);
const rotate=b=>[1-b[5],b[1],b[0],1-b[2],b[4],b[3]];
test('fortified slots use only reserved IDs and assigned roster, no live registration',()=>{
  assert.deepEqual(PACK3_FORTIFIED_IDS,[116,117,118]);
  assert.deepEqual(PACK3_FORTIFIED_ASSETS.map(a=>a.roster),[69,70,71]);
  assert.equal(new Set(PACK3_FORTIFIED_IDS).size,3);
  for(const a of PACK3_FORTIFIED_ASSETS){
    assert.ok(a.id>=109&&a.id<=158&&a.id!==255);
    assert.equal(a.sourcePack,3);
    assert.equal(a.status,'unmerged-candidate');
    assert.equal(a.persistence.liveIdRegistered,false);
    assert.equal(a.persistence.rotationSaved,false);
    assert.equal(a.integrated,false);
  }
});
test('twelve immutable selected/colliding box unions bounded in voxel cell',()=>{
  for(const id of PACK3_FORTIFIED_IDS)for(let r=0;r<4;r++){
    const a=pack3FortifiedById(id,r);
    assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.boxes));
    assert.equal(a.collision.boxes,a.selection.boxes);
    assert.equal(a.shape.boxes,a.collision.boxes);
    assert.equal(a.boxes.length,a.parts.length);
    assert.ok(a.parts.length>=8&&a.parts.length<=32);
    assert.equal(a.placement.allowedRotations.length,4);
    assert.deepEqual(pack3FortifiedPrototype(id,r).boxes,a.boxes);
    assert.equal(pack3FortifiedShape(id,r),a.shape);
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
test('four Y quarter turns match :00 box-rotation convention, including wrap',()=>{
  for(const id of PACK3_FORTIFIED_IDS)for(let r=0;r<4;r++){
    assert.deepEqual(pack3FortifiedById(id,r).boxes.map(rotate),
      pack3FortifiedById(id,(r+1)%4).boxes);
  }
});
test('fortress wall has physical arrow slit and projecting armored face',()=>{
  const wall=pack3FortifiedShape(116);
  assert.equal(contains(wall,.5,.65,.5),false,'through-slit cannot be solid');
  assert.equal(contains(wall,.5,.15,.5),true,'lower armored course is solid');
  assert.equal(contains(wall,.2,.65,.5),true,'side pier is solid');
  assert.equal(contains(wall,.8,.65,.5),true,'second pier is solid');
  assert.equal(contains(wall,.5,.95,.5),true,'protective cap is solid');
  assert.equal(contains(wall,.18,.68,.02),true,'forward ornamental relief has actual depth');
  assert.equal(contains(pack3FortifiedShape(116,2),.5,.65,.5),false);
});
test('battlement has two high merlons and an actual central firing gap',()=>{
  const crenel=pack3FortifiedShape(117);
  assert.equal(contains(crenel,.5,.7,.5),false,'central gap must be open');
  assert.equal(contains(crenel,.19,.7,.5),true);
  assert.equal(contains(crenel,.8,.7,.5),true);
  assert.equal(contains(crenel,.5,.2,.5),true,'defensive sill bears load');
  assert.equal(contains(crenel,.5,.93,.5),false);
});
test('buttress is a tapered forward-projecting support instead of a pillar',()=>{
  const buttress=pack3FortifiedShape(118);
  assert.equal(contains(buttress,.5,.1,.94),true,'bottom foot projects');
  assert.equal(contains(buttress,.5,.8,.94),false,'upper support recedes');
  assert.equal(contains(buttress,.5,.82,.24),true,'upper neck anchors');
  assert.equal(contains(buttress,.05,.82,.24),false,'upper section tapers in width');
  assert.equal(contains(buttress,.5,.98,.5),false,'high headroom remains empty');
});
test('physical silhouettes and selectability are not interchangeable with generic block',()=>{
  const signatures=PACK3_FORTIFIED_ASSETS.map(a=>JSON.stringify(a.boxes));
  assert.equal(new Set(signatures).size,3);
  for(const a of PACK3_FORTIFIED_ASSETS){
    assert.ok(a.boxes.length>1);
    assert.notDeepEqual(a.boxes,[[0,0,0,1,1,1]]);
    assert.ok(a.colors.ash!==a.colors.rune);
  }
});
test('candidate placement, rotation selection, removal and overlap guard',()=>{
  const f=createPack3FortifiedFixture(179);
  assert.equal(f.place([10,4,-8],116,3),true);
  assert.equal(f.place([10,4,-8],117,0),false);
  assert.equal(f.place([-5,3,2],117,1),true);
  assert.equal(f.place([1,2,3],118,2),true);
  assert.deepEqual(f.inspect([10,4,-8]),{id:116,rotation:3});
  assert.deepEqual(f.shapeAt(10,4,-8).boxes,pack3FortifiedShape(116,3).boxes);
  assert.equal(f.shapeAt(0,2,0),null);
  assert.equal(f.place([10,20,-8],116,1),false);
  assert.equal(f.place([4,2,2],118,4),false);
  assert.equal(f.place([4,2,2],118,-1),false);
  assert.equal(f.place([4,2,2],255,0),false);
  assert.equal(f.remove([10,4,-8]),true);
  assert.equal(f.remove([10,4,-8]),false);
  assert.equal(f.inspect([10,4,-8]),null);
});
test('isolated oriented candidate round-trip is deterministic, not schema-1 game save',()=>{
  const f=createPack3FortifiedFixture(12345);
  assert.equal(f.place([8,2,2],116,0),true);
  assert.equal(f.place([-2,3,8],117,3),true);
  assert.equal(f.place([0,6,0],118,2),true);
  const state=f.snapshot();
  assert.equal(state.format,FORTIFIED_FIXTURE_FORMAT);
  assert.equal(Object.hasOwn(state,'schema'),false);
  assert.equal(state.parts.length,3);
  assert.equal(JSON.stringify(restorePack3FortifiedFixture(
    JSON.parse(JSON.stringify(state))).snapshot()),JSON.stringify(state));
});
test('restore rejects duplicate positions, malformed orientation, unknown ID and sentinel',()=>{
  const f=createPack3FortifiedFixture();f.place([1,3,2],116,0);
  const state=f.snapshot(),clone=()=>JSON.parse(JSON.stringify(state));
  let v=clone();v.parts[0].id=255;
  assert.throws(()=>restorePack3FortifiedFixture(v),TypeError);
  v=clone();v.parts[0].id=119;
  assert.throws(()=>restorePack3FortifiedFixture(v),TypeError);
  v=clone();v.parts[0].rotation=4;
  assert.throws(()=>restorePack3FortifiedFixture(v),TypeError);
  v=clone();v.parts[0].cell=[0,20,0];
  assert.throws(()=>restorePack3FortifiedFixture(v),TypeError);
  v=clone();v.parts.push({...v.parts[0]});
  assert.throws(()=>restorePack3FortifiedFixture(v),TypeError);
  v=clone();v.format='mythwrought-live-schema-1';
  assert.throws(()=>restorePack3FortifiedFixture(v),TypeError);
  assert.throws(()=>createPack3FortifiedFixture(NaN),TypeError);
});
test('unknown IDs and out-of-range rotations fail without exposing a live block',()=>{
  assert.equal(pack3FortifiedById(115),null);
  assert.equal(pack3FortifiedById(255),null);
  assert.throws(()=>pack3FortifiedById(117,4),RangeError);
  assert.throws(()=>pack3FortifiedById(116,-1),RangeError);
  assert.throws(()=>pack3FortifiedPrototype(112),RangeError);
});
