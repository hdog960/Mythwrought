import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK3_ROOFING_ASSETS,PACK3_INITIAL_IDS,pack3RoofById,
  pack3ShapeForId,pack3PrototypeDescriptor} from '../../../src/block-packs/pack-3/roofing-materials.mjs';
import {PACK3_COORDINATION,PACK3_ROSTER,validatePack3Manifest}
  from '../../../src/block-packs/pack-3/manifest.mjs';
import {createPack3Fixture,restorePack3Fixture}
  from '../../../src/block-packs/pack-3/fixture.mjs';

test('ownership: 17 families, four roofing material IDs, three roof shapes and three fortified IDs',()=>{
  assert.equal(validatePack3Manifest(),true);
  assert.deepEqual(PACK3_ROSTER.map(x=>x.roster),[23,24,25,26,27,28,29,69,70,71,72,73,74,75,76,77,78]);
  assert.deepEqual(PACK3_INITIAL_IDS,[109,110,111,112]);
  assert.equal(new Set(PACK3_INITIAL_IDS).size,4);
  assert.equal(PACK3_COORDINATION.integratedCheckpoint,'006');
  for(const x of PACK3_ROSTER)if(x.id!==null){
    assert.ok(x.id>=109&&x.id<=158&&x.id!==255);
    assert.equal(x.implementation,'physical-candidate');
    assert.equal(x.integrated,false);
  }
  for(const x of PACK3_ROSTER.slice(10))assert.equal(x.id,null);
  assert.equal(PACK3_ROSTER.filter(x=>x.id!==null).length,10);
});
test('four independent original physical roofing families and matching selection/collision',()=>{
  const geometries=new Set(),slugs=new Set(),palettes=new Set();
  for(const roof of PACK3_ROOFING_ASSETS){
    assert.ok(Object.isFrozen(roof)&&Object.isFrozen(roof.parts));
    assert.ok(roof.parts.length>=7&&roof.parts.length<=32);
    assert.equal(roof.boxes.length,roof.parts.length);
    assert.equal(roof.selection.boxes,roof.boxes);
    assert.equal(roof.collision.boxes,roof.boxes);
    assert.equal(roof.persistence.rotationState,false);
    assert.equal(roof.persistence.integrated,false);
    assert.equal(roof.placement.defaultRotation,0);
    assert.equal(roof.sourcePack,3);
    assert.equal(roof.kind,'roof-surface');
    for(const part of roof.parts){
      assert.ok(Object.isFrozen(part)&&Object.isFrozen(part.box));
      assert.ok(Object.hasOwn(roof.colors,part.tone));
      const [x,y,z,X,Y,Z]=part.box;
      assert.ok(x>=0&&y>=0&&z>=0&&X<=1&&Y<=1&&Z<=1);
      assert.ok(x<X&&y<Y&&z<Z);
      assert.ok(Y<=.3125,'roof surfaces must remain shallow, not solid cubes');
    }
    geometries.add(JSON.stringify(roof.boxes));
    slugs.add(roof.slug);
    palettes.add(JSON.stringify(roof.colors));
  }
  assert.equal(geometries.size,4);
  assert.equal(slugs.size,4);
  assert.equal(palettes.size,4);
});
test('materials provide independently legible warm wood, red clay, cool slate, golden straw',()=>{
  const [wood,clay,slate,straw]=PACK3_ROOFING_ASSETS;
  assert.match(wood.style,/cedar/);
  assert.match(clay.style,/terracotta/);
  assert.match(slate.style,/slate/);
  assert.match(straw.style,/grass/);
  for(const a of PACK3_ROOFING_ASSETS)
    for(const color of Object.values(a.colors))assert.match(color,/^#[0-9a-f]{6}$/);
});
test(':00 and :12 box-descriptor adapters preserve precisely the original occupied volumes',()=>{
  for(const asset of PACK3_ROOFING_ASSETS){
    assert.equal(pack3RoofById(asset.id),asset);
    assert.equal(pack3ShapeForId(asset.id).boxes,asset.boxes);
    const prototype=pack3PrototypeDescriptor(asset.id);
    assert.equal(prototype.prototypeOnly,true);
    assert.equal(prototype.placeable,false);
    assert.equal(prototype.boxes,asset.boxes);
    assert.ok(prototype.boxes.length<=32,':00 box-union budget');
  }
  assert.equal(pack3RoofById(5),null);
  assert.equal(pack3ShapeForId(255),null);
  assert.throws(()=>pack3PrototypeDescriptor(255),RangeError);
});
test('vertical candidate selection respects the raised shallow roof surface and empty headroom',()=>{
  const occupied=(asset,x,y,z)=>asset.boxes.some(b=>
    x>=b[0]&&x<=b[3]&&y>=b[1]&&y<=b[4]&&z>=b[2]&&z<=b[5]);
  for(const asset of PACK3_ROOFING_ASSETS){
    assert.equal(occupied(asset,.5,.05,.5),true,'underlay is physically solid');
    assert.equal(occupied(asset,.5,.75,.5),false,'top half of cell remains empty');
    assert.equal(occupied(asset,1.1,.1,.5),false);
  }
});
test('isolated fixture places, rejects overlap, removes and restores all four IDs deterministically',()=>{
  const f=createPack3Fixture(179);
  assert.equal(f.place([2,4,2],109),true);
  assert.equal(f.place([2,4,2],110),false);
  assert.equal(f.place([0,5,-1],110),true);
  assert.equal(f.place([-5,6,-3],111),true);
  assert.equal(f.place([8,7,2],112),true);
  assert.equal(f.place([0,25,0],109),false);
  assert.equal(f.place([1,4,1],8),false);
  const before=JSON.stringify(f.snapshot());
  const r=restorePack3Fixture(JSON.parse(before));
  assert.equal(JSON.stringify(r.snapshot()),before);
  assert.deepEqual(r.shapeAt(2,4,2).boxes,pack3RoofById(109).boxes);
  assert.equal(r.shapeAt(2,5,2),null);
  assert.equal(r.remove([2,4,2]),true);
  assert.equal(r.get([2,4,2]),0);
  assert.equal(r.remove([2,4,2]),false);
  assert.equal(f.get([2,4,2]),109,'restored fixture is independent');
});
test('isolated snapshot guards invalid, duplicate, unsupported and future IDs',()=>{
  const base={schema:1,seed:179,edits:[[0,1,0,109]]};
  assert.throws(()=>restorePack3Fixture({...base,schema:2}),TypeError);
  assert.throws(()=>restorePack3Fixture({...base,edits:[[0,1,0,109],[0,1,0,110]]}),TypeError);
  assert.throws(()=>restorePack3Fixture({...base,edits:[[0,1,0,255]]}),TypeError);
  assert.throws(()=>restorePack3Fixture({...base,edits:[[0,1,0,113]]}),TypeError);
  assert.throws(()=>restorePack3Fixture({...base,edits:[[0,200,0,109]]}),TypeError);
  assert.throws(()=>createPack3Fixture(1.5),TypeError);
});
