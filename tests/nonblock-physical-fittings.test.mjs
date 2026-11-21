import assert from 'node:assert/strict';
import test from 'node:test';
import {planOwnedFitting,OWNED_FITTING_IDS} from '../src/nonblock/physical-fittings.mjs';

test('matching roster slots resolve the physical owner and its approved geometry',()=>{
  const ids=[67,67,68,66,163,68,65,175,168,166,173,174];
  assert.equal(OWNED_FITTING_IDS.length,ids.length);
  for(const [index,id] of OWNED_FITTING_IDS.entries()) {
    const plan=planOwnedFitting(id,{anchor:[2,5,9],orientation:1});
    assert.equal(plan.placements[0].numericId,ids[index]);
    assert.equal(plan.blueprint.physicalAssets[0].numericId,ids[index]);
    assert.ok(plan.blueprint.physicalAssets[0].selection.length>0);
    assert.ok(plan.blueprint.physicalAssets[0].collision.length>0);
    assert.equal(plan.blueprint.physicalAssets[0].sourcePack,ids[index]<100?2:4);
  }
});

test('paired leaves have separated hinges and use only existing coordinate and state owners',()=>{
  const id='scene36:double-door-pair';
  const closed=planOwnedFitting(id,{anchor:[2,5,9],orientation:0});
  const open=planOwnedFitting(id,{anchor:[2,5,9],orientation:0,open:true});
  assert.deepEqual(open.placements.map(p=>[p.at,p.orientation]),[[[2,5,9],0],[[3,5,9],2]]);
  assert.ok(open.blueprint.physicalAssets[0].collision.every(b=>b[3]<2.29));
  assert.ok(open.blueprint.physicalAssets[1].collision.every(b=>b[0]>3.70));
  assert.ok(closed.blueprint.physicalAssets[0].collision.some(b=>b[3]-b[0]>.8));
  assert.equal(planOwnedFitting('scene36:trapdoor',{anchor:[0,2,0]}).placements[0].state.variant,'lower');
  assert.equal(planOwnedFitting('scene36:hinged-hatch',{anchor:[0,2,0]}).placements[0].state.variant,'upper');
  assert.throws(()=>planOwnedFitting('scene36:window-shutters',{anchor:[0,2,0],open:true}));
  const lantern=planOwnedFitting('scene36:hanging-lantern',{anchor:[0,2,0]});
  assert.equal(lantern.placements[0].numericId,166);
  assert.deepEqual(lantern.blueprint.unresolvedSupports[0].at,[0,2,1]);
});

test('pair placement rolls back both cells and owner storage if the physical save cannot commit',async()=>{
  const {placeOwnedDoorPair}=await import('../src/nonblock/physical-fittings.mjs');
  const {VoxelWorld}=await import('../src/voxel.mjs');
  const {Pack2LiveWorld,loadPack2LiveWorld}=await import('../src/pack2-world.mjs');
  const source=new VoxelWorld(179);
  const live=new Pack2LiveWorld(source);
  const data=new Map();
  let rejectPrimary=true;
  const storage={
    getItem:key=>data.get(key)??null,
    setItem(key,value){
      if(rejectPrimary&&key.endsWith('-pack2-live-v1'))throw Error('primary write rejected');
      data.set(key,value);
    },
    removeItem:key=>data.delete(key)
  };
  const options={anchor:[10,9,7]};
  const worldSave=JSON.stringify(source.save());
  const host={world:live,storage,rebuild:()=>{},player:{x:.5,z:.5,feet:12}};
  const failed=placeOwnedDoorPair(options,host);
  assert.equal(failed.ok,false);
  assert.equal(failed.requiresRecovery,false);
  assert.equal(live.pack2Cells.size,0);
  assert.equal(data.size,0);
  rejectPrimary=false;
  const committed=placeOwnedDoorPair(options,host);
  assert.equal(committed.ok,true);
  assert.deepEqual(loadPack2LiveWorld(storage,source).world.pack2Snapshot(),live.pack2Snapshot());
  assert.equal(live.pack2Cells.size,2);
  assert.equal(JSON.stringify(source.save()),worldSave);
});
