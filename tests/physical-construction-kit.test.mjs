import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,WORLD_MAX_Y} from '../src/voxel.mjs';
import {stoneColumn,stoneGateway,timberFrame,planUneditedConstruction,ruinedWall,stoneSteps,CONSTRUCTION_IDS,CONSTRUCTION_CONTRACT} from '../src/physical-construction-kit.mjs';

test('physical palette reuses stable saved block IDs and cube collision',()=>{
  assert.deepEqual({...CONSTRUCTION_IDS},{masonry:BLOCK.STONE,timber:BLOCK.WOOD,inset:BLOCK.CRYSTAL});
  assert.equal(CONSTRUCTION_CONTRACT.newBlockIds,0);
  assert.equal(CONSTRUCTION_CONTRACT.saveSchema,1);
  assert.equal(CONSTRUCTION_CONTRACT.kind,'full-voxel');
});
test('gateway is a real hollow 5-wide, 6-high voxel arch, on both axes',()=>{
  for(const axis of ['x','z']){
    const cells=stoneGateway([40,8,40],{axis,span:5,height:6,depth:2});
    assert.equal(cells.length,(2*6+3)*2);
    assert.equal(new Set(cells.map(c=>c.slice(0,3).join(','))).size,cells.length);
    assert(cells.every(c=>c[3]===BLOCK.STONE));
    const at=(s,y,d)=>axis==='x'?[40+s,8+y,40+d]:[40+d,8+y,40+s];
    for(let s=1;s<4;s++)for(let y=0;y<5;y++)for(let d=0;d<2;d++)
      assert(!cells.some(c=>c.slice(0,3).every((v,i)=>v===at(s,y,d)[i])));
  }
});
test('stone columns have a solid capital and valid limits',()=>{
  const c=stoneColumn([0,3,0],{height:5,width:1});
  assert.equal(c.length,5+8*2);
  assert(c.some(v=>v[0]===-1&&v[1]===7&&v[2]===-1));
  assert.throws(()=>stoneColumn([0,WORLD_MAX_Y,0]),/bounds/);
});
test('timber frames are physical posts and lintels, no duplicate cells',()=>{
  const c=timberFrame([0,3,0],{span:7,height:5});
  assert.equal(c.length,7+2*4);
  assert(c.every(v=>v[3]===BLOCK.WOOD));
  assert.equal(timberFrame([0,3,0],{span:7,height:5,posts:false}).length,7);
});
test('construction planning never overwrites saved edits or existing terrain',()=>{
  const w=new VoxelWorld(179);
  const cells=stoneGateway([40,13,40],{height:4,span:3,depth:1});
  const [x,y,z]=cells[0];
  assert.equal(w.set(x,y,z,BLOCK.AIR),true);
  // Explicit AIR edits are protected even when empty.
  assert.equal(w.edits.has(x+','+y+','+z),true);
  const before=JSON.stringify(w.save());
  const result=planUneditedConstruction(w,cells);
  assert(result.blocked.some(c=>c[0]===x&&c[1]===y&&c[2]===z));
  assert.equal(result.safe,false);
  assert.equal(JSON.stringify(w.save()),before);
  assert.throws(()=>planUneditedConstruction(w,[[0,0,0,99]]),/Invalid construction cell/);
});
test('deterministic geometry and bounded input reject malformed templates',()=>{
  assert.deepEqual(stoneGateway([3,5,7]),stoneGateway([3,5,7]));
  assert.throws(()=>stoneGateway([0,0,0],{span:2}),/span/);
  assert.throws(()=>timberFrame([0,0,0],{axis:'diagonal'}),/axis/);
  assert.throws(()=>stoneColumn([0,0.5,0]),/integer/);
});

test('ruined walls have traversable 3-wide doorway and deterministic broken silhouette',()=>{
  for(const axis of ['x','z']){
    const cells=ruinedWall([50,4,50],{axis,length:11,height:6,thickness:2});
    assert.deepEqual(cells,ruinedWall([50,4,50],{axis,length:11,height:6,thickness:2}));
    assert.equal(new Set(cells.map(c=>c.slice(0,3).join(','))).size,cells.length);
    const key=(s,y,d)=>axis==='x'?[50+s,4+y,50+d]:[50+d,4+y,50+s];
    for(let s=4;s<7;s++)for(let y=0;y<3;y++)for(let d=0;d<2;d++)
      assert(!cells.some(c=>c.slice(0,3).every((v,i)=>v===key(s,y,d)[i])));
    assert(cells.some(c=>c[1]===9));
    assert(cells.some(c=>c[1]===7));
    assert(cells.every(c=>c[3]===BLOCK.STONE));
  }
  assert.throws(()=>ruinedWall([0,3,0],{doorWidth:10}),/doorWidth/);
  assert.throws(()=>ruinedWall([0,3,0],{axis:'y'}),/axis/);
});
test('full-block stairs are one-step increments on both axes and remain inside world bounds',()=>{
  for(const axis of ['x','z']){
    const cells=stoneSteps([10,4,10],{axis,steps:5,width:3});
    assert.equal(cells.length,15);
    assert.equal(new Set(cells.map(c=>c.slice(0,3).join(','))).size,15);
    for(let s=0;s<5;s++)assert.equal(cells.filter(c=>c[1]===4+s).length,3);
    assert(cells.every(c=>c[3]===BLOCK.STONE));
  }
  assert.equal(stoneSteps([0,8,0],{rise:-1,steps:3}).at(-1)[1],6);
  assert.throws(()=>stoneSteps([0,WORLD_MAX_Y,0],{steps:3}),/bounds/);
  assert.throws(()=>stoneSteps([0,3,0],{rise:2}),/rise/);
});
