import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK3_ORNAMENTAL_ASSETS,PACK3_ORNAMENTAL_IDS,pack3OrnamentalById,
  pack3OrnamentalShape,pack3OrnamentalPrototype}
  from '../../../src/block-packs/pack-3/ornamental-pieces.mjs';
import {PACK3_ROSTER,validatePack3Manifest} from '../../../src/block-packs/pack-3/manifest.mjs';
import {createPack3OrnamentalFixture,restorePack3OrnamentalFixture,
  ORNAMENTAL_FIXTURE_FORMAT} from '../../../src/block-packs/pack-3/ornamental-fixture.mjs';
const hit=(shape,x,y,z)=>shape.boxes.some(b=>x>=b[0]&&x<b[3]&&
  y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]);
const turn=b=>[1-b[5],b[1],b[0],1-b[2],b[4],b[3]];
test('manifest allocates 119–122 alongside all seventeen Pack 3 candidate IDs',()=>{
  assert.equal(validatePack3Manifest(),true);
  assert.deepEqual(PACK3_ORNAMENTAL_IDS,[119,120,121,122]);
  assert.deepEqual(PACK3_ROSTER.map(x=>x.roster),
    [23,24,25,26,27,28,29,69,70,71,72,73,74,75,76,77,78]);
  assert.deepEqual(PACK3_ROSTER.filter(x=>x.id!==null).map(x=>x.id),
    [109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125]);
  assert.equal(PACK3_ROSTER.filter(x=>x.id===null).length,0);
  assert.ok(PACK3_ROSTER.every(x=>x.id===null||(x.id>=109&&x.id<=158&&x.id!==255)));
});
test('four materially and physically distinct original sculptural silhouettes',()=>{
  assert.equal(new Set(PACK3_ORNAMENTAL_ASSETS.map(a=>JSON.stringify(a.boxes))).size,4);
  assert.equal(new Set(PACK3_ORNAMENTAL_ASSETS.map(a=>JSON.stringify(a.colors))).size,4);
  assert.deepEqual(PACK3_ORNAMENTAL_ASSETS.map(a=>a.roster),[72,73,74,75]);
  assert.deepEqual(PACK3_ORNAMENTAL_ASSETS.map(a=>a.kind),Array(4).fill('ornamental-component'));
  for(const a of PACK3_ORNAMENTAL_ASSETS){
    assert.notDeepEqual(a.boxes,[[0,0,0,1,1,1]]);
    assert.equal(a.persistence.liveIdRegistered,false);
    assert.equal(a.persistence.liveRotationSaved,false);
    assert.equal(a.integrated,false);
    assert.equal(a.placeable,false);
  }
});
test('all 16 rotated box unions and semantic metadata are immutable and bounded',()=>{
  for(const id of PACK3_ORNAMENTAL_IDS)for(let r=0;r<4;r++){
    const a=pack3OrnamentalById(id,r);
    assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.boxes)&&Object.isFrozen(a.parts));
    assert.equal(a.collision.boxes,a.selection.boxes);
    assert.equal(a.selection.boxes,a.shape.boxes);
    assert.equal(a.parts.length,a.boxes.length);
    assert.ok(a.parts.length>=8&&a.parts.length<=32);
    assert.deepEqual(pack3OrnamentalPrototype(id,r).boxes,a.boxes);
    assert.equal(pack3OrnamentalShape(id,r),a.shape);
    assert.deepEqual(a.placement.allowedRotations,[0,1,2,3]);
    for(const p of a.parts){
      assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.box));
      assert.ok(Object.hasOwn(a.colors,p.tone));
      const [x,y,z,X,Y,Z]=p.box;
      assert.ok([x,y,z,X,Y,Z].every(Number.isFinite));
      assert.ok(x>=0&&y>=0&&z>=0&&X<=1&&Y<=1&&Z<=1);
      assert.ok(x<X&&y<Y&&z<Z);
    }
  }
});
test('quarter-turns obey shared :00 Y rotation convention and wrap exactly',()=>{
  for(const id of PACK3_ORNAMENTAL_IDS)for(let r=0;r<4;r++)
    assert.deepEqual(pack3OrnamentalById(id,r).boxes.map(turn),
      pack3OrnamentalById(id,(r+1)%4).boxes);
});
test('column has freestanding fluted shaft, raised capital and projecting plinth',()=>{
  const s=pack3OrnamentalShape(119);
  assert.equal(hit(s,.5,.08,.5),true,'plinth');
  assert.equal(hit(s,.5,.55,.5),true,'solid carved core');
  assert.equal(hit(s,.5,.55,.27),true,'flute projects from shaft');
  assert.equal(hit(s,.5,.92,.5),true,'outward flared capital');
  assert.equal(hit(s,.05,.55,.05),false,'no generic full-cube face');
});
test('dentil cornice projects physically from wall and has three separated brackets',()=>{
  const s=pack3OrnamentalShape(120);
  assert.equal(hit(s,.5,.84,.4),true,'deep crown projection');
  assert.equal(hit(s,.5,.5,.8),true,'middle bracket');
  assert.equal(hit(s,.14,.5,.8),true,'left bracket');
  assert.equal(hit(s,.84,.5,.8),true,'right bracket');
  assert.equal(hit(s,.3,.5,.8),false,'physical gap between brackets');
  assert.equal(hit(s,.5,.2,.5),false,'empty lower cell');
});
test('stone arch surround has real unobstructed window opening and an overhead keystone, no glass',()=>{
  const a=pack3OrnamentalById(121),s=a.shape;
  assert.equal(hit(s,.5,.5,.5),false,'through opening stays empty');
  assert.equal(hit(s,.12,.5,.5),true,'left masonry jamb');
  assert.equal(hit(s,.9,.5,.5),true,'right masonry jamb');
  assert.equal(hit(s,.5,.9,.5),true,'raised central keystone');
  assert.equal(hit(s,.5,.95,.5),true,'upper carved arch cap');
  assert.ok(!/glazing|glass pane|wooden window frame/i.test(a.name));
  assert.equal(a.parts.some(p=>p.tone==='glass'||p.tone==='glazing'),false);
});
test('relief has actual 3D sculptural projection but no occupied full-block body',()=>{
  const s=pack3OrnamentalShape(122);
  assert.equal(hit(s,.5,.5,.6),true,'golden raised central sun');
  assert.equal(hit(s,.5,.5,.92),true,'shallow stone plaque backing');
  assert.equal(hit(s,.5,.5,.45),false,'open space in front of panel');
  assert.equal(hit(s,.03,.5,.9),false,'free space beside panel');
  assert.equal(hit(s,.5,.5,.1),false,'cell is not a solid carved cube');
});
test('isolated placement/rotation/look-up/removal works without editing game world',()=>{
  const f=createPack3OrnamentalFixture(179);
  for(let r=0;r<4;r++)assert.equal(f.place([r,4,3],119,r),true);
  assert.equal(f.place([-4,5,-1],120,2),true);
  assert.equal(f.place([2,6,9],121,3),true);
  assert.equal(f.place([8,5,-2],122,1),true);
  assert.equal(f.place([1,4,3],122,0),false,'occupied cell rejected');
  assert.equal(f.place([0,25,0],121,0),false,'height bounds preserved');
  assert.equal(f.place([0,5,0],8,0),false,'legacy ID not accepted');
  assert.equal(f.place([0,5,0],119,4),false,'rotation 4 rejected');
  assert.deepEqual(f.inspect([2,6,9]),{id:121,rotation:3});
  assert.deepEqual(f.shapeAt(2,6,9).boxes,pack3OrnamentalShape(121,3).boxes);
  assert.equal(f.shapeAt(2,8,9),null);
  assert.equal(f.remove([2,6,9]),true);
  assert.equal(f.remove([2,6,9]),false);
});
test('candidate-only orientation fixture round trips deterministically, not a player save',()=>{
  const f=createPack3OrnamentalFixture(-179);
  f.place([10,3,2],119,0);f.place([0,4,-2],120,3);
  f.place([-9,1,3],121,2);f.place([7,6,4],122,1);
  const a=f.snapshot();
  assert.equal(a.format,ORNAMENTAL_FIXTURE_FORMAT);
  assert.equal(Object.hasOwn(a,'schema'),false);
  assert.equal(a.parts.length,4);
  const b=restorePack3OrnamentalFixture(JSON.parse(JSON.stringify(a)));
  assert.equal(JSON.stringify(b.snapshot()),JSON.stringify(a));
  assert.notEqual(f,b);
});
test('preview restore rejects malformed or overlapping candidate saves and reserved IDs',()=>{
  const f=createPack3OrnamentalFixture();f.place([1,4,2],119,2);
  const snap=f.snapshot(),copy=()=>JSON.parse(JSON.stringify(snap));
  let v=copy();v.parts[0].id=255;
  assert.throws(()=>restorePack3OrnamentalFixture(v),TypeError);
  v=copy();v.parts[0].id=118;
  assert.throws(()=>restorePack3OrnamentalFixture(v),TypeError);
  v=copy();v.parts[0].rotation=-1;
  assert.throws(()=>restorePack3OrnamentalFixture(v),TypeError);
  v=copy();v.parts.push({...v.parts[0]});
  assert.throws(()=>restorePack3OrnamentalFixture(v),TypeError);
  v=copy();v.parts[0].cell=[0,99,0];
  assert.throws(()=>restorePack3OrnamentalFixture(v),TypeError);
  v=copy();v.format='mythwrought-live-save-schema-1';
  assert.throws(()=>restorePack3OrnamentalFixture(v),TypeError);
  assert.throws(()=>createPack3OrnamentalFixture(1.1),TypeError);
});
test('unknown/illegal block IDs and invalid orientation fail closed',()=>{
  assert.equal(pack3OrnamentalById(118),null);
  assert.equal(pack3OrnamentalById(123),null);
  assert.equal(pack3OrnamentalById(255),null);
  assert.throws(()=>pack3OrnamentalById(119,4),RangeError);
  assert.throws(()=>pack3OrnamentalById(120,-1),RangeError);
  assert.throws(()=>pack3OrnamentalPrototype(255),RangeError);
});
