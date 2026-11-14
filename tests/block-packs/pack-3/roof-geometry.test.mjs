import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK3_GEOMETRY_IDS,PACK3_ROOF_GEOMETRY,pack3GeometryById,
  pack3GeometryShape,pack3PrototypeGeometry}
  from '../../../src/block-packs/pack-3/roof-geometry.mjs';
import {PACK3_ROSTER,validatePack3Manifest}
  from '../../../src/block-packs/pack-3/manifest.mjs';
import {createPack3RoofGeometryFixture,restorePack3RoofGeometryFixture}
  from '../../../src/block-packs/pack-3/roof-geometry-fixture.mjs';
const occupied=(shape,x,y,z)=>shape.boxes.some(b=>
  x>=b[0]&&y>=b[1]&&z>=b[2]&&x<=b[3]&&y<=b[4]&&z<=b[5]);
const turn=b=>[1-b[5],b[1],b[0],1-b[2],b[4],b[3]];
test('manifest owns ten unique 109–118 candidates, including 27/28/29',()=>{
  assert.equal(validatePack3Manifest(),true);
  assert.deepEqual(PACK3_GEOMETRY_IDS,[113,114,115]);
  assert.deepEqual(PACK3_ROSTER.filter(r=>r.id!==null).map(r=>r.id),
    [109,110,111,112,113,114,115,116,117,118]);
  for(const roster of [27,28,29])assert.equal(PACK3_ROSTER.find(r=>r.roster===roster).integrated,false);
  assert.equal(PACK3_ROSTER.filter(r=>r.id===null).length,7);
});
test('all four quarter-turns preserve unit-cell occupancy, immutable physical bounds and budgets',()=>{
  for(const id of PACK3_GEOMETRY_IDS)for(let rotation=0;rotation<4;rotation++){
    const asset=pack3GeometryById(id,rotation);
    assert.ok(Object.isFrozen(asset)&&Object.isFrozen(asset.parts));
    assert.equal(asset.id,id);assert.equal(asset.rotation,rotation);
    assert.equal(asset.integrated,false);
    assert.equal(asset.materialSourceId,110);
    assert.equal(asset.prototypeOnly,true);assert.equal(asset.placeable,false);
    assert.equal(asset.shape.boxes,asset.collision.boxes);
    assert.equal(asset.shape.boxes,asset.selection.boxes);
    assert.equal(asset.parts.length,asset.boxes.length);
    assert.ok(asset.boxes.length>=4&&asset.boxes.length<=32);
    assert.ok(asset.boxes.length*12<=384,'naive mesh triangles must stay bounded');
    for(const part of asset.parts){
      assert.ok(Object.isFrozen(part)&&Object.isFrozen(part.box));
      assert.ok(Object.hasOwn(asset.colors,part.tone));
      const [x,y,z,X,Y,Z]=part.box;
      assert.ok([x,y,z,X,Y,Z].every(Number.isFinite));
      assert.ok(x>=0&&y>=0&&z>=0&&X<=1&&Y<=1&&Z<=1);
      assert.ok(x<X&&y<Y&&z<Z);
    }
    assert.equal(pack3GeometryShape(id,rotation),asset.shape);
    assert.deepEqual(pack3PrototypeGeometry(id,rotation).boxes,asset.boxes);
  }
});
test('rotation follows :00 quarter-turn coordinate convention and cycles after four turns',()=>{
  for(const id of PACK3_GEOMETRY_IDS){
    for(let rotation=0;rotation<4;rotation++){
      const current=pack3GeometryById(id,rotation).boxes;
      const next=pack3GeometryById(id,(rotation+1)%4).boxes;
      assert.deepEqual(current.map(turn),next,id+' turn '+rotation);
    }
  }
});
test('roof stair, double-axis hip corner, and ridge have three truly distinct physical silhouettes',()=>{
  const [slope,hip,ridge]=PACK3_ROOF_GEOMETRY;
  assert.equal(new Set(PACK3_ROOF_GEOMETRY.map(a=>JSON.stringify(a.boxes))).size,3);
  assert.equal(occupied(slope.shape,.5,.73,.94),true,'pitched slope rises at back');
  assert.equal(occupied(slope.shape,.5,.73,.06),false,'forward side is low');
  assert.equal(occupied(pack3GeometryShape(113,2),.5,.73,.06),true,'half-turn reverses pitch');
  assert.equal(occupied(hip.shape,.90,.70,.90),true,'hip rises toward diagonal corner');
  assert.equal(occupied(hip.shape,.10,.70,.90),false,'hip not a straight stair');
  assert.equal(occupied(hip.shape,.90,.70,.10),false,'hip rises on both horizontal axes');
  assert.equal(occupied(ridge.shape,.5,.60,.5),true,'raised central spine is solid');
  assert.equal(occupied(ridge.shape,.05,.60,.5),false,'ridge edge remains low');
  assert.equal(occupied(ridge.shape,.95,.60,.5),false);
  assert.equal(occupied(slope.shape,.5,.96,.5),false,'unfilled headroom exists');
});
test('longitudinal ridge repeats after half-turn, while hip corners remain directional',()=>{
  const normalized=id=>rot=>pack3GeometryById(id,rot).boxes.map(JSON.stringify).sort();
  assert.deepEqual(normalized(115)(0),normalized(115)(2));
  assert.notDeepEqual(normalized(115)(0),normalized(115)(1));
  assert.notDeepEqual(normalized(114)(0),normalized(114)(2));
  assert.notDeepEqual(normalized(113)(0),normalized(113)(2));
});
test('unique IDs reject 255, legacy blocks, future IDs and invalid rotations',()=>{
  assert.equal(pack3GeometryById(255),null);
  assert.equal(pack3GeometryById(8),null);
  assert.equal(pack3GeometryById(116),null);
  assert.throws(()=>pack3GeometryById(113,4),RangeError);
  assert.throws(()=>pack3GeometryById(115,-1),RangeError);
  assert.throws(()=>pack3PrototypeGeometry(116),RangeError);
});
test('isolated fixture supports per-cell rotated placement, physical targeting, removal',()=>{
  const f=createPack3RoofGeometryFixture(179);
  for(let r=0;r<4;r++)assert.equal(f.place([r,3,4],113,r),true);
  assert.equal(f.place([0,3,4],114,2),false);
  assert.equal(f.place([5,4,5],114,3),true);
  assert.equal(f.place([5,5,5],115,1),true);
  assert.equal(f.place([5,20,5],113,0),false);
  assert.equal(f.place([8,3,4],255,0),false);
  assert.equal(f.place([8,3,4],113,4),false);
  assert.equal(f.place([8,3,4],113,-1),false);
  assert.deepEqual(f.inspect([0,3,4]),{id:113,rotation:0});
  assert.deepEqual(f.shapeAt(1,3,4).boxes,pack3GeometryShape(113,1).boxes);
  assert.equal(f.shapeAt(9,2,9),null);
  assert.equal(f.remove([0,3,4]),true);
  assert.equal(f.inspect([0,3,4]),null);
  assert.equal(f.remove([0,3,4]),false);
});
test('orientation-preview sidecar round-trips deterministically; never masquerades as live save',()=>{
  const f=createPack3RoofGeometryFixture(179);
  assert.equal(f.place([-8,4,2],113,3),true);
  assert.equal(f.place([10,2,1],115,1),true);
  assert.equal(f.place([4,1,-20],114,2),true);
  const before=f.snapshot();
  assert.equal(before.schema,1);
  assert.equal(before.format,'mythwrought-pack3-oriented-preview-v1');
  assert.equal(before.edits.length,3);
  assert.equal(before.orientations.length,3);
  assert.equal(JSON.stringify(restorePack3RoofGeometryFixture(
    JSON.parse(JSON.stringify(before))).snapshot()),JSON.stringify(before));
  assert.equal(f.inspect([10,2,1]).rotation,1);
});
test('candidate restore rejects invalid IDs, orientation edits, duplicates and mismatched coordinates',()=>{
  const f=createPack3RoofGeometryFixture();
  assert.equal(f.place([1,2,3],113,2),true);
  const src=f.snapshot();
  const make=()=>JSON.parse(JSON.stringify(src));
  let invalid=make();invalid.format='schema-1-game';assert.throws(()=>restorePack3RoofGeometryFixture(invalid),TypeError);
  invalid=make();invalid.orientations[0][3]=4;assert.throws(()=>restorePack3RoofGeometryFixture(invalid),TypeError);
  invalid=make();invalid.orientations[0][0]=9;assert.throws(()=>restorePack3RoofGeometryFixture(invalid),TypeError);
  invalid=make();invalid.edits[0][3]=255;assert.throws(()=>restorePack3RoofGeometryFixture(invalid),TypeError);
  invalid=make();invalid.edits.push([...invalid.edits[0]]);invalid.orientations.push([...invalid.orientations[0]]);
  assert.throws(()=>restorePack3RoofGeometryFixture(invalid),TypeError);
  invalid=make();invalid.orientations=[];assert.throws(()=>restorePack3RoofGeometryFixture(invalid),TypeError);
  assert.throws(()=>createPack3RoofGeometryFixture(1.1),TypeError);
});
