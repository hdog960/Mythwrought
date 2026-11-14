import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../../../src/voxel.mjs';
import {PACK_2_IDS} from '../../../src/block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY_IDS} from '../../../src/block-packs/pack-2/joinery.mjs';
import {PACK_2_GROUND,PACK_2_GROUND_IDS,groundAsset,groundCell,
  parseGroundCell,groundShape,groundOccupies,groundPreviewMesh}
  from '../../../src/block-packs/pack-2/ground.mjs';
import {PACK_2_FIXTURE_IDS,Pack2Fixture} from './fixture.mjs';

test('four independent ground families allocate exclusive Pack 2 IDs 69–72',()=>{
  assert.deepEqual(PACK_2_GROUND_IDS,[69,70,71,72]);
  assert.deepEqual(PACK_2_GROUND.map(x=>x.roster),[39,40,41,42]);
  assert.equal(new Set(PACK_2_GROUND.map(x=>x.family)).size,4);
  assert.equal(new Set(PACK_2_GROUND.map(x=>x.surface.pattern)).size,4);
  assert.equal(new Set(PACK_2_GROUND.map(x=>JSON.stringify(x.palette))).size,4);
  assert.equal(new Set([...PACK_2_IDS,...PACK_2_JOINERY_IDS,...PACK_2_GROUND_IDS]).size,14);
  assert.equal(PACK_2_FIXTURE_IDS.length,14);
  assert.deepEqual(Object.values(BLOCK).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);
});
test('every orientation is backed by independently selectable physical local boxes',()=>{
  for(const a of PACK_2_GROUND){
    for(let rotation=0;rotation<a.orientation.turns;rotation++){
      const s=groundShape(a.id,rotation);
      assert.equal(s.id,a.id);
      assert.equal(s.candidateOnly,true);
      assert.equal(s.groundProfile,'walkable-top-surface');
      assert.ok(s.boxes.length>1&&s.boxes.length<=32);
      for(const b of s.boxes){
        assert.equal(b.length,6);assert.ok(b.every(Number.isFinite));
        for(let k=0;k<3;k++)assert.ok(b[k]>=0&&b[k]<b[k+3]&&b[k+3]<=1);
      }
      assert.ok(s.parts.every(x=>a.palette[x.role]?.length===3));
    }
  }
});
test('gravel is an actual granular top profile, not a featureless cube',()=>{
  const s=groundShape(69);
  assert.equal(s.boxes.length,9);
  assert.ok(groundOccupies(69,0,[.1,.9,.2]));
  assert.ok(groundOccupies(69,0,[.66,.97,.3]));
  assert.equal(groundOccupies(69,0,[.47,.9,.50]),false);
  assert.ok(groundOccupies(69,0,[.47,.75,.5]));
  assert.equal(groundAsset(69).physics.simulateLocally,false);
  assert.match(groundAsset(69).physics.requires,/gravity/);
  assert.throws(()=>groundCell(69,1),RangeError);
});
test('packed dirt path has real shallow lower ruts between raised edges',()=>{
  assert.ok(groundOccupies(70,0,[.1,.83,.5]));
  assert.equal(groundOccupies(70,0,[.25,.83,.5]),false);
  assert.ok(groundOccupies(70,0,[.5,.80,.5]));
  assert.equal(groundOccupies(70,0,[.5,.90,.5]),false);
  assert.ok(groundOccupies(70,1,[.5,.83,.1]));
  assert.equal(groundOccupies(70,1,[.5,.83,.25]),false);
});
test('cobblestone walking surface has mortar seams, inset low-profile stones',()=>{
  const s=groundShape(71);
  assert.equal(s.boxes.length,8);
  assert.ok(groundOccupies(71,0,[.2,.88,.2]));
  assert.equal(groundOccupies(71,0,[.47,.88,.2]),false);
  assert.ok(groundOccupies(71,0,[.47,.70,.2]));
  assert.ok(Math.max(...s.boxes.map(b=>b[4]))<1);
  assert.notDeepEqual(groundShape(71,0).boxes,groundShape(71,1).boxes);
});
test('decorative suncompass paving has distinct center inlay and lower surrounding tiles',()=>{
  const s=groundShape(72);
  assert.equal(s.boxes.length,11);
  assert.ok(s.parts.some(p=>p.role==='inlay'));
  assert.ok(groundOccupies(72,0,[.5,.93,.5]));
  assert.ok(groundOccupies(72,0,[.2,.83,.2]));
  assert.equal(groundOccupies(72,0,[.5,.93,.15]),false);
  assert.equal(groundOccupies(72,0,[.5,.97,.5]),false);
  assert.notDeepEqual(groundShape(72,0).boxes,groundShape(72,1).boxes);
});
test('candidate meshes have original colored material surfaces, no hidden-box fill',()=>{
  for(const a of PACK_2_GROUND)for(let rotation=0;rotation<a.orientation.turns;rotation++){
    const m=groundPreviewMesh(a.id,rotation);
    assert.ok(m.physicalQuads>10);
    assert.ok(m.decorationQuads>0);
    assert.ok(m.triangles>40&&m.triangles<=800);
    assert.equal(m.triangles,2*(m.physicalQuads+m.decorationQuads));
    assert.equal(m.indices.length,m.triangles*3);
    assert.equal(m.positions.length,m.colors.length);
    assert.equal(m.positions.length,m.normals.length);
    assert.equal(m.positions.length/3,(m.physicalQuads+m.decorationQuads)*4);
    assert.ok([...m.positions,...m.colors,...m.normals].every(Number.isFinite));
    assert.ok([...m.colors].every(x=>x>=0&&x<=1));
    assert.ok([...m.positions].every(x=>x>=-.005&&x<=1.005));
    const m2=groundPreviewMesh(a.id,rotation);
    assert.deepEqual(m.positions,m2.positions);
    assert.deepEqual(m.colors,m2.colors);
  }
});
test('per-face occlusion partition stays below naive global-grid overhead',()=>{
  const gravel=groundPreviewMesh(69);
  const mortar=groundPreviewMesh(71);
  const inlay=groundPreviewMesh(72);
  assert.ok(gravel.triangles<600);
  assert.ok(mortar.triangles<500);
  assert.ok(inlay.triangles<500);
  assert.ok(gravel.physicalQuads>gravel.decorationQuads);
});
test('physical and decorative triangle winding faces outward on all four profiles',()=>{
  for(const asset of PACK_2_GROUND){
    const m=groundPreviewMesh(asset.id);
    for(let i=0;i<m.indices.length;i+=3){
      const points=[m.indices[i],m.indices[i+1],m.indices[i+2]]
        .map(index=>Array.from(m.positions.slice(index*3,index*3+3)));
      const u=points[1].map((v,j)=>v-points[0][j]);
      const v=points[2].map((w,j)=>w-points[0][j]);
      const n=Array.from(m.normals.slice(m.indices[i]*3,m.indices[i]*3+3));
      const cross=[u[1]*v[2]-u[2]*v[1],
        u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      const dot=cross.reduce((sum,val,j)=>sum+val*n[j],0);
      assert.ok(dot>0,'inverted triangle for '+asset.key+' at index '+i);
    }
  }
});
test('ground state only needs compass orientation, never a fresh persistent ID',()=>{
  for(const a of PACK_2_GROUND)for(let rotation=0;rotation<a.orientation.turns;rotation++)
    assert.deepEqual(parseGroundCell(JSON.parse(JSON.stringify(groundCell(a.id,rotation)))),
      {id:a.id,rotation});
  assert.throws(()=>groundCell(4),RangeError);
  assert.throws(()=>groundCell(255),RangeError);
  assert.throws(()=>groundCell(70,4),RangeError);
  assert.throws(()=>groundCell(71,-1),RangeError);
  assert.throws(()=>groundCell(72,.5),RangeError);
  assert.throws(()=>parseGroundCell({id:72,rotation:1,open:true}),TypeError);
  assert.throws(()=>groundOccupies(69,0,[Infinity,0,0]),TypeError);
});
test('fixture supports ground candidate selection, rotation, targeting and removal',()=>{
  const f=new Pack2Fixture();
  f.select(69);
  assert.equal(f.place([0,1,0]),true);
  const high=f.target([.65,3,.25],[0,-1,0],5);
  assert.deepEqual(high.cell,[0,1,0]);
  assert.equal(high.id,69);
  assert.ok(high.distance<1.04&&high.distance>.9);
  assert.equal(f.mineRay([.65,3,.25],[0,-1,0],5).removed,true);
  assert.equal(f.read([0,1,0]),null);
  f.select(70);f.turn();assert.equal(f.selection().rotation,1);
  assert.equal(f.place([0,1,0]),true);
  assert.equal(f.read([0,1,0]).rotation,1);
});
test('fixture material and joinery snapshot envelopes remain backward-compatible',()=>{
  const f=new Pack2Fixture();
  f.select(59);assert.ok(f.place([0,1,0]));
  f.select(68);f.turn();f.toggleSelection();assert.ok(f.place([2,1,0]));
  f.select(72);f.turn();assert.ok(f.place([4,1,0]));
  const before=f.serialize();
  assert.deepEqual(before.cells[0],[0,1,0,59,0]);
  assert.equal(before.cells[1].length,7);
  assert.deepEqual(before.cells[2],[4,1,0,72,1]);
  const recovered=Pack2Fixture.restore(JSON.parse(JSON.stringify(before)));
  assert.deepEqual(recovered.serialize(),before);
  assert.equal(recovered.read([2,1,0]).open,true);
  assert.equal(recovered.read([4,1,0]).rotation,1);
  assert.equal(new VoxelWorld().set(4,1,0,72),false);
  assert.throws(()=>VoxelWorld.restore(before));
});
test('fixture corrupt ground records are refused without changing existing state',()=>{
  const f=new Pack2Fixture();
  const data=f.serialize();
  const bad=[
    [[0,0,0,69,1]],
    [[0,0,0,70,-1]],
    [[0,0,0,72,4]],
    [[0,0,0,72,1,'upper',false]],
    [[0,0,0,71,0],[0,0,0,71,0]]
  ];
  for(const cells of bad)assert.throws(()=>Pack2Fixture.restore({...data,cells}));
  assert.equal(f.serialize().cells.length,0);
});
test('all four are separate design families and nothing is world generated',()=>{
  for(const a of PACK_2_GROUND){
    assert.equal(groundShape(a.id).noWorldPlacement,true);
    assert.equal(a.physics.simulateLocally,false);
    assert.ok(a.surface.pattern.length>20);
  }
  assert.notDeepEqual(groundShape(70).boxes,groundShape(71).boxes);
  assert.notDeepEqual(groundShape(71).boxes,groundShape(72).boxes);
});
