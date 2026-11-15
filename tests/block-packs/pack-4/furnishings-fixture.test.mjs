import test from 'node:test';
import assert from 'node:assert/strict';
import {createPack4Fixture,pack4Shape,pack4MountOffset,pack4State}
 from '../../../src/block-packs/pack-4/fixture.mjs';

const ids=[169,170,171,172,173,174,175];
const supports=[[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,0,0],
 [6,2,0],[7,1,1]];
function populate(){
 const f=createPack4Fixture(supports);
 for(let n=0;n<ids.length;n++){
  const r=f.place([n+1,1,0],ids[n],0);
  assert.equal(r.ok,true,JSON.stringify(r));
 }
 return f;
}
test('all M3 assets are independently placeable in one cell with correct floor, ceiling or wall supports',()=>{
 const f=populate();
 assert.equal(f.count(),7);
 for(let n=0;n<ids.length;n++){
  const item=f.get([n+1,1,0]);
  assert.equal(item.id,ids[n]);
  assert.deepEqual(item.cell,[n+1,1,0]);
  assert.equal(item.rotation,0);
 }
});
test('unsupported M3 fixture cannot materialize or occupy a cell',()=>{
 const f=createPack4Fixture();
 for(const id of ids){
  assert.equal(f.place([0,1,0],id).ok,false);
  assert.equal(f.count(),0);
 }
 assert.equal(f.get([0,1,0]),null);
});
test('all seven independent cells can be removed without clearing neighbors',()=>{
 const f=populate();
 assert.equal(f.remove([3,1,0]).removed.id,171);
 assert.equal(f.get([3,1,0]),null);
 assert.equal(f.count(),6);
 assert.equal(f.get([1,1,0]).id,169);
 assert.equal(f.get([7,1,0]).id,175);
 assert.equal(f.remove([3,1,0]).ok,false);
});
test('non-cube bench and table preserve open leg-space collisions',()=>{
 const f=populate();
 assert.equal(f.collidesWithAabb([3.45,1.2,.44,3.55,1.35,.54]),false,
  'bench center under seat open');
 assert.equal(f.collidesWithAabb([3.45,1.47,.44,3.55,1.50,.54]),true,
  'bench seat physical');
 assert.equal(f.collidesWithAabb([4.45,1.30,.44,4.55,1.45,.54]),false,
  'table underside open');
 assert.equal(f.collidesWithAabb([4.45,1.75,.44,4.55,1.78,.54]),true,
  'tabletop physical');
});
test('tall barrel top is selectable, and sign post is a narrow precise target',()=>{
 const f=populate();
 assert.equal(f.raycast([1.5,2.6,.5],[0,-1,0]).id,169);
 assert.equal(f.raycast([5.5,1.3,-1],[0,0,1]).id,173);
 assert.equal(f.collidesWithAabb([5.1,1.3,.1,5.2,1.35,.2]),false);
});
test('hanging banner suspended under ceiling is not a solid curtain wall',()=>{
 const f=populate();
 const shape=pack4Shape(174);
 assert.equal(shape.mount,'ceiling');
 assert.deepEqual(pack4MountOffset(174),[0,1,0]);
 assert.equal(f.collidesWithAabb([6.48,1.15,.48,6.52,1.20,.52]),false,
  'swallowtail gap near bottom is clear');
 assert.equal(f.collidesWithAabb([6.25,1.18,.48,6.32,1.23,.52]),true,
  'two lower tails remain physically selectable');
});
test('market canopy wall support rotates to all four neighboring faces',()=>{
 for(let r=0;r<4;r++){
  const o=pack4MountOffset(175,r);
  const f=createPack4Fixture([[0+o[0],1+o[1],0+o[2]]]);
  assert.equal(f.place([0,1,0],175,r).ok,true);
  assert.equal(f.get([0,1,0]).rotation,r);
  assert.equal(f.remove([0,1,0]).ok,true);
 }
});
test('combined 17 IDs serialize with one ID each and no live save migration',()=>{
 const f=populate();
 const snap=JSON.parse(JSON.stringify(f.save()));
 assert.equal(snap.fixture,'mythwrought.pack4.fixture');
 assert.equal(snap.schemaVersion,1);
 assert.equal(snap.cells.length,7);
 assert.deepEqual(snap.cells.map(x=>x.id).sort((a,b)=>a-b),ids);
 const restored=createPack4Fixture(supports);
 assert.equal(restored.restore(snap),7);
 assert.deepEqual(restored.save(),f.save());
 assert.equal(restored.get([7,1,0]).rotation,0);
});
test('fixture restore rejects missing wall/ceiling support atomically',()=>{
 const f=populate(),before=JSON.stringify(f.save());
 const corrupted=JSON.parse(before);
 corrupted.cells.find(x=>x.id===174).cell=[10,1,0];
 assert.throws(()=>f.restore(corrupted));
 assert.equal(JSON.stringify(f.save()),before);
 const corrupted2=JSON.parse(before);
 corrupted2.cells.find(x=>x.id===175).rotation=2;
 assert.throws(()=>f.restore(corrupted2));
 assert.equal(JSON.stringify(f.save()),before);
});
test('rotated furniture replay and invalid orientations fail closed',()=>{
 const f=createPack4Fixture([[0,0,0],[1,2,0]]);
 assert.equal(f.place([0,1,0],169,3).ok,true);
 assert.equal(f.place([1,1,0],174,2).ok,true);
 const snap=JSON.parse(JSON.stringify(f.save()));
 const g=createPack4Fixture([[0,0,0],[1,2,0]]);
 assert.equal(g.restore(snap),2);
 assert.deepEqual(g.get([0,1,0]),{id:169,rotation:3,cell:[0,1,0]});
 assert.deepEqual(g.get([1,1,0]),{id:174,rotation:2,cell:[1,1,0]});
 for(const bad of [-1,4,NaN,1.5,'0'])
  assert.throws(()=>f.place([10,10,10],170,bad));
});
