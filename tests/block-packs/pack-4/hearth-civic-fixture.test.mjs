import test from 'node:test';
import assert from 'node:assert/strict';
import {createPack4Fixture,pack4Shape,pack4MountOffset,pack4State}
 from '../../../src/block-packs/pack-4/fixture.mjs';

const ids=[176,177,178,179,180,181];
const supports=[[1,1,0],[2,2,1],[3,1,0],[4,2,1],[5,2,1],[6,1,0]];
function world(){
 const f=createPack4Fixture(supports);
 for(let i=0;i<6;i++){
  const placed=f.place([i+1,2,0],ids[i],0);
  assert.equal(placed.ok,true,'failed to independently place ID '+ids[i]);
 }
 return f;
}
test('six M4 physical candidates are individually placeable with exact wall/floor support',()=>{
 const f=world();
 assert.equal(f.count(),6);
 for(let i=0;i<6;i++){
  const cell=[i+1,2,0],item=f.get(cell);
  assert.equal(item.id,ids[i]);
  assert.equal(item.rotation,0);
  assert.deepEqual(item.cell,cell);
  assert.ok(pack4Shape(item.id).collision.length>5);
  assert.deepEqual(pack4State(item.id,3),{id:item.id,rotation:3});
 }
});
test('unsupported M4 objects cannot be placed or left as floating occupants',()=>{
 const f=createPack4Fixture();
 for(const id of ids){
  assert.deepEqual(f.place([0,2,0],id),{ok:false,reason:'missing fixed support'});
  assert.equal(f.count(),0);
 }
});
test('removing one fireplace leaves five neighboring independent cells intact',()=>{
 const f=world();
 assert.equal(f.remove([2,2,0]).removed.id,177);
 assert.equal(f.count(),5);
 assert.equal(f.get([2,2,0]),null);
 for(const [x,id] of [[1,176],[3,178],[4,179],[5,180],[6,181]])
  assert.equal(f.get([x,2,0]).id,id);
});
test('hollow chimney center remains air, wall still collides and targets',()=>{
 const f=world();
 assert.equal(f.collidesWithAabb([1.45,2.4,.45,1.55,2.5,.55]),false);
 assert.equal(f.collidesWithAabb([1.17,2.4,.45,1.25,2.5,.55]),true);
 assert.equal(f.raycast([1.5,3.5,.5],[0,-1,0]),null);
 assert.equal(f.raycast([.2,2.5,.5],[1,0,0]).id,176);
});
test('open hearth and fountain basin are actually non-full collision fixtures',()=>{
 const f=world();
 assert.equal(f.collidesWithAabb([2.45,2.45,.26,2.55,2.55,.31]),false);
 assert.equal(f.collidesWithAabb([2.14,2.45,.26,2.22,2.55,.31]),true);
 assert.equal(f.collidesWithAabb([6.45,2.36,.45,6.55,2.45,.55]),false);
 assert.equal(f.collidesWithAabb([6.45,2.12,.45,6.55,2.15,.55]),true);
});
test('well rim does not seal quarter interior and well-roof underside stays open',()=>{
 const f=world();
 assert.equal(f.collidesWithAabb([3.59,2.28,.59,3.67,2.38,.67]),false);
 assert.equal(f.collidesWithAabb([3.17,2.28,.59,3.22,2.38,.67]),true);
 assert.equal(f.collidesWithAabb([4.45,2.28,.45,4.55,2.38,.55]),false);
 assert.equal(f.collidesWithAabb([4.45,2.88,.45,4.55,2.91,.55]),true);
});
test('each independent wall mount rotates to one of four fixed neighboring faces',()=>{
 for(const id of [177,179,180]){
  for(let r=0;r<4;r++){
   const off=pack4MountOffset(id,r),f=createPack4Fixture([[...off.map((n,i)=>n+[0,2,0][i])]]);
   assert.equal(f.place([0,2,0],id,r).ok,true);
   assert.equal(f.get([0,2,0]).rotation,r);
   assert.equal(f.remove([0,2,0]).ok,true);
  }
 }
});
test('all six candidate IDs and orientation data survive isolated JSON save replay',()=>{
 const first=world(),serialized=JSON.parse(JSON.stringify(first.save()));
 const second=createPack4Fixture(supports);
 assert.equal(second.restore(serialized),6);
 assert.deepEqual(second.save(),first.save());
 assert.deepEqual(serialized.cells.map(c=>c.id).sort((a,b)=>a-b),ids);
 assert.equal(serialized.schemaVersion,1);
 assert.equal(serialized.fixture,'mythwrought.pack4.fixture');
});
test('restore remains atomic on truncated state, duplicate cell or unsupported mount',()=>{
 const f=world(),before=JSON.stringify(f.save());
 const invalid=JSON.parse(before);
 invalid.cells.find(x=>x.id===180).rotation=2;
 assert.throws(()=>f.restore(invalid));
 assert.equal(JSON.stringify(f.save()),before);
 const partial=JSON.parse(before);
 delete partial.cells.find(x=>x.id===181).rotation;
 assert.throws(()=>f.restore(partial));
 assert.equal(JSON.stringify(f.save()),before);
 const same=JSON.parse(before);
 same.cells.find(x=>x.id===180).cell=[1,2,0];
 assert.throws(()=>f.restore(same));
 assert.equal(JSON.stringify(f.save()),before);
});
test('reject unknown IDs, unsafe coordinates and unsupported rotations',()=>{
 const f=createPack4Fixture(supports);
 for(const x of [0,175,182,208,255,1.5])
  assert.throws(()=>f.place([0,2,0],x));
 for(const r of [-1,4,NaN,1.5,null,'0'])
  assert.throws(()=>f.place([0,2,0],176,r));
 assert.throws(()=>f.place([.5,2,0],176));
 assert.equal(f.count(),0);
});
