import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../../../src/voxel.mjs';
import {PACK_2_ASSETS,PACK_2_IDS,pack2Asset,pack2Shape,pack2Cell,
  parsePack2Cell,pack2Occupies,pack2PreviewMesh} from '../../../src/block-packs/pack-2/definitions.mjs';
import {Pack2Fixture} from './fixture.mjs';

test('four original Phase-1 timber families have exclusive provisional IDs',()=>{
  assert.deepEqual(PACK_2_IDS,[59,60,61,62]);
  assert.deepEqual(PACK_2_ASSETS.map(a=>a.roster),[13,14,15,22]);
  assert.equal(new Set(PACK_2_ASSETS.map(a=>a.family)).size,4);
  assert.equal(new Set(PACK_2_ASSETS.map(a=>a.profile)).size,4);
  assert.equal(new Set(PACK_2_ASSETS.map(a=>a.surface.grain)).size,4);
  assert.equal(new Set(PACK_2_ASSETS.map(a=>a.palette.base.join(','))).size,4);
  for(const a of PACK_2_ASSETS)assert.ok(a.id>=59&&a.id<=108&&a.id!==255);
  assert.deepEqual(Object.values(BLOCK).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);
  assert.equal(pack2Asset(4),null);
});
test('each candidate has valid, finite, physical boxes and no alias to legacy timber',()=>{
  const signatures=[];
  for(const a of PACK_2_ASSETS){
    const shape=pack2Shape(a.id);
    assert.equal(shape.candidateOnly,true);
    assert.ok(shape.boxes.length>0&&shape.boxes.length<=32);
    for(const b of shape.boxes){
      assert.equal(b.length,6);
      assert.ok(b.every(Number.isFinite));
      for(let i=0;i<3;i++)assert.ok(0<=b[i]&&b[i]<b[i+3]&&b[i+3]<=1);
    }
    signatures.push(JSON.stringify(shape.boxes));
  }
  assert.equal(new Set(signatures).size,4);
  assert.deepEqual(pack2Shape(59).boxes,[[0,0,0,1,1,1]]);
  assert.notDeepEqual(pack2Shape(60).boxes,pack2Shape(61).boxes);
});
test('rotating the horizontal stripped log changes its actual hitbox axis',()=>{
  const unturned=pack2Shape(60,0),turned=pack2Shape(60,1);
  assert.notDeepEqual(unturned.boxes,turned.boxes);
  assert.equal(pack2Occupies(60,0,[.05,.5,.5]),true);
  assert.equal(pack2Occupies(60,1,[.05,.5,.5]),false);
  assert.equal(pack2Occupies(60,1,[.5,.5,.05]),true);
  assert.equal(pack2Occupies(60,0,[.5,.5,.05]),false);
});
test('load-bearing vertical support stays vertical and uses one ID',()=>{
  const post=pack2Shape(62);
  assert.ok(post.boxes.some(b=>b[1]===0&&b[4]===1));
  assert.ok(post.boxes.some(b=>b[0]<.33&&b[4]<=.14));
  assert.throws(()=>pack2Shape(62,1),RangeError);
  assert.throws(()=>pack2Shape(59,4),RangeError);
});
test('candidate cell record round trips while rejecting unknown IDs and states',()=>{
  assert.deepEqual(parsePack2Cell(JSON.parse(JSON.stringify(pack2Cell(61,3)))),{id:61,rotation:3});
  assert.throws(()=>pack2Cell(255),RangeError);
  assert.throws(()=>parsePack2Cell({id:59,rotation:0,other:1}),TypeError);
  assert.throws(()=>parsePack2Cell({id:60,rotation:1.5}),RangeError);
});
test('meshes have deterministic original colors, exposed surfaces and bounded triangles',()=>{
  for(const a of PACK_2_ASSETS){
    const m=pack2PreviewMesh(a.id);
    const repeated=pack2PreviewMesh(a.id);
    assert.ok(m.physicalQuads>=6&&m.decorationQuads>=2);
    assert.ok(m.triangles>=12&&m.triangles<1600);
    assert.equal(m.triangles,(m.physicalQuads+m.decorationQuads)*2);
    assert.equal(m.positions.length,m.colors.length);
    assert.equal(m.positions.length,m.normals.length);
    assert.equal(m.indices.length,m.triangles*3);
    assert.deepEqual(m.positions,repeated.positions);
    assert.deepEqual(m.colors,repeated.colors);
    assert.ok([...m.positions,...m.colors,...m.normals].every(Number.isFinite));
    assert.ok([...m.colors].every(v=>v>=0&&v<=1));
    assert.ok([...m.positions].every(v=>v>=-.01&&v<=1.01));
  }
});
test('rotated meshes are real geometry with stable material identity',()=>{
  const m=pack2PreviewMesh(61,1),n=pack2PreviewMesh(61,0);
  assert.notDeepEqual(m.positions,n.positions);
  assert.equal(m.triangles,n.triangles);
  assert.ok(m.decorationQuads>0);
});
test('fixture can place, target, mine and avoid the empty side of a narrow support post',()=>{
  const f=new Pack2Fixture();
  f.select(62);
  assert.equal(f.place([0,0,0]),true);
  assert.equal(f.place([0,0,0]),false);
  assert.equal(f.target([.95,.5,-1],[0,0,1]),null);
  const selected=f.target([.5,.5,-1],[0,0,1]);
  assert.deepEqual(selected.cell,[0,0,0]);
  assert.equal(selected.id,62);
  assert.ok(selected.distance>1&&selected.distance<2);
  assert.equal(f.mineRay([.5,.5,-1],[0,0,1]).removed,true);
  assert.equal(f.target([.5,.5,-1],[0,0,1]),null);
});
test('fixture snapshot is deterministic and separate from world schema-1 saves',()=>{
  const f=new Pack2Fixture(); f.place([4,1,6]);f.select(60);f.turn();f.place([-2,1,-3]);
  const raw=JSON.stringify(f.serialize());
  const restored=Pack2Fixture.restore(JSON.parse(raw));
  assert.equal(JSON.stringify(restored.serialize()),raw);
  assert.equal(restored.read([-2,1,-3]).rotation,1);
  assert.equal(restored.remove([4,1,6]),true);
  assert.equal(restored.remove([4,1,6]),false);
  assert.equal(new VoxelWorld().set(4,1,6,59),false);
  assert.throws(()=>VoxelWorld.restore(f.serialize()));
});
test('fixture fails closed on corrupted IDs, duplicate positions, and invalid reach',()=>{
  const f=new Pack2Fixture(),d=f.serialize();
  assert.throws(()=>Pack2Fixture.restore({...d,cells:[[0,0,0,59,0],[0,0,0,59,0]]}),TypeError);
  assert.throws(()=>Pack2Fixture.restore({...d,cells:[[0,0,0,209,0]]}),RangeError);
  assert.throws(()=>Pack2Fixture.restore({...d,cells:[[0,100,0,59,0]]}),TypeError);
  assert.throws(()=>f.target([0,0,0],[0,0,0]),RangeError);
  assert.throws(()=>f.place([0,20,0]),RangeError);
});
