import test from 'node:test';
import assert from 'node:assert/strict';
import {createPack4Fixture,pack4Shape,pack4MountOffset,pack4State}
  from '../../../src/block-packs/pack-4/fixture.mjs';

test('all twenty-three IDs have physical selection and collision bounds',()=>{
 const f=createPack4Fixture();
 assert.deepEqual(f.availableIds,Array.from({length:23},(_,i)=>159+i));
 for(const id of f.availableIds){
  const s=pack4Shape(id,0);
  assert.ok(s.collision.length>=1&&s.selection.length>=1);
  assert.ok(s.collision.every(b=>b.length===6));
  assert.deepEqual(pack4State(id,3),{id,rotation:3});
 }
});
test('five window/opening families place separately and remove only target cell',()=>{
 const f=createPack4Fixture([[163,5,1]]);
 for(let id=159;id<=164;id++){
  assert.deepEqual(f.place([id,5,0],id).ok,true);
  assert.equal(f.get([id,5,0]).id,id);
 }
 assert.equal(f.count(),6);
 assert.equal(f.place([159,5,0],161).reason,'occupied');
 assert.equal(f.remove([161,5,0]).removed.id,161);
 assert.equal(f.get([161,5,0]),null);
 assert.equal(f.count(),5);
});
test('stand lanterns require floor supports; wall lantern and torch require wall supports',()=>{
 const f=createPack4Fixture([[0,0,0],[1,0,0],[2,1,1],[3,1,1]]);
 assert.equal(f.place([0,1,0],165).ok,true);
 assert.equal(f.place([1,1,0],167).ok,true);
 assert.equal(f.place([2,1,0],166).ok,true);
 assert.equal(f.place([3,1,0],168).ok,true);
 assert.equal(f.count(),4);
});
test('unsupported wall fixtures and floor fixtures fail without writing anything',()=>{
 const f=createPack4Fixture();
 for(const id of [165,166,167,168])
  assert.equal(f.place([0,1,0],id).reason,'missing fixed support');
 assert.equal(f.count(),0);
 assert.equal(f.get([0,1,0]),null);
});
test('wall mount offsets rotate to physically different neighboring supports',()=>{
 const f=createPack4Fixture([[0,1,1],[-1,1,0],[0,1,-1],[1,1,0]]);
 for(let r=0;r<4;r++){
  assert.deepEqual(pack4MountOffset(166,r),
   [[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]][r]);
  assert.equal(f.place([0,1,0],166,r).ok,true);
  assert.equal(f.get([0,1,0]).rotation,r);
  assert.equal(f.remove([0,1,0]).ok,true);
 }
});
test('target ray can pass between wrought bars; no fake full-cube selection',()=>{
 const f=createPack4Fixture();
 f.place([0,0,0],164);
 assert.equal(f.raycast([.12,.5,-2],[0,0,1]).id,164);
 assert.equal(f.raycast([.28,.5,-2],[0,0,1]),null);
});
test('ray target uses nearest independent cell even when aligned behind a pane',()=>{
 const f=createPack4Fixture();
 f.place([0,0,0],159);
 f.place([0,0,1],160);
 assert.equal(f.raycast([.5,.5,-3],[0,0,1]).id,159);
 assert.equal(f.remove([0,0,0]).ok,true);
 assert.equal(f.raycast([.5,.5,-3],[0,0,1]).id,160);
});
test('partial collisions do not occupy the full cell',()=>{
 const f=createPack4Fixture();
 f.place([0,0,0],164);
 assert.equal(f.collidesWithAabb([.11,.35,.45,.15,.65,.55]),true);
 assert.equal(f.collidesWithAabb([.28,.35,.45,.32,.65,.55]),false);
});
test('fixture saves every unique ID and rotation without changing schema-1 game saves',()=>{
 const supports=[[10,0,0],[11,0,0],[12,1,1],[13,1,1],[163,1,1]];
 const a=createPack4Fixture(supports);
 for(let id=159;id<=164;id++)assert.equal(a.place([id,1,0],id,id===163?0:id%4).ok,true);
 for(const [id,x] of [[165,10],[167,11],[166,12],[168,13]])
  assert.equal(a.place([x,1,0],id,id===166?0:id%4).ok,true);
 const json=JSON.parse(JSON.stringify(a.save()));
 assert.equal(json.schemaVersion,1);
 assert.equal(json.fixture,'mythwrought.pack4.fixture');
 assert.equal(json.cells.length,10);
 const b=createPack4Fixture(supports);
 assert.equal(b.restore(json),10);
 assert.deepEqual(b.save(),a.save());
 for(const item of json.cells)assert.deepEqual(b.get(item.cell).cell,item.cell);
});
test('bad save state never partially destroys already placed cells',()=>{
 const f=createPack4Fixture([[0,0,0]]);
 f.place([0,1,0],165);
 const before=JSON.stringify(f.save());
 const invalid=[
  null,{},[],{fixture:'x',schemaVersion:1,cells:[]},
  {fixture:'mythwrought.pack4.fixture',schemaVersion:2,cells:[]},
  {fixture:'mythwrought.pack4.fixture',schemaVersion:1,cells:[{cell:[1,1,1],id:255,rotation:0}]},
  {fixture:'mythwrought.pack4.fixture',schemaVersion:1,cells:[{cell:[1,1,1],id:159}]},
  {fixture:'mythwrought.pack4.fixture',schemaVersion:1,cells:[
    {cell:[1,1,1],id:159,rotation:0},{cell:[1,1,1],id:160,rotation:2}]},
  {fixture:'mythwrought.pack4.fixture',schemaVersion:1,cells:[
    {cell:[1,1,1],id:166,rotation:0}]}
 ];
 for(const snap of invalid){
  assert.throws(()=>f.restore(snap));
  assert.equal(JSON.stringify(f.save()),before);
 }
});
test('distant-world independent placement, collisions and fixture snapshot replay use safe integers',()=>{
 const floor=[1000000,2,65537],floorSupport=[1000000,1,65537];
 const wall=[-1000000,4,-65537],wallSupport=[-1000000,4,-65536];
 const supports=[floorSupport,wallSupport];
 const f=createPack4Fixture(supports);
 assert.equal(f.place(floor,165,2).ok,true);
 assert.equal(f.place(wall,166,0).ok,true);
 assert.equal(f.place([Number.MAX_SAFE_INTEGER,0,0],159,1).ok,true);
 assert.equal(f.count(),3);
 assert.equal(f.get(wall).rotation,0);
 assert.equal(f.collidesWithAabb([1000000.25,2.2,65537.25,
   1000000.75,2.75,65537.75]),true);
 const copy=JSON.parse(JSON.stringify(f.save()));
 const replay=createPack4Fixture(supports);
 assert.equal(replay.restore(copy),3);
 assert.deepEqual(replay.save(),f.save());
 assert.equal(replay.remove([Number.MAX_SAFE_INTEGER,0,0]).removed.id,159);
 assert.equal(f.place([0,Number.MIN_SAFE_INTEGER,0],165).reason,
   'support beyond safe world coordinates');
 assert.throws(()=>f.place([Number.MAX_SAFE_INTEGER+1,1,0],159));
 assert.throws(()=>f.get([0.5,2,0]));
});
test('reject invalid orientation, impossible cell coordinates and invalid ray',()=>{
 const f=createPack4Fixture();
 assert.throws(()=>f.place([1.5,0,0],159));
 assert.throws(()=>f.place([0,0,0],168,4));
 assert.throws(()=>f.place([0,0,0],255));
 assert.throws(()=>f.raycast([0,0,0],[0,0,0]));
 assert.throws(()=>f.raycast([0,0,0],[1,0,0],99));
});
