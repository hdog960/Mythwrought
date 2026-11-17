import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';

// Deterministic state-machine test: independent reference model, no random globals.
test('256-cell atomic boundary, stale rollback, orientation epochs and schema-1 reload', () => {
  const cells = Array.from({length:256}, (_,i)=>({cell:[i,0,0],id:(i%8)+1}));
  const session = recoverLegacyVoxelSession(cells);
  for(let i=0;i<256;i++) assert.equal(session.setOrientation([i,0,0],(i%8)+1,0,i%4),true);
  const batch = cells.map(({cell,id})=>({cell,expectedId:id,expectedRevision:0,nextId:id}));
  assert.equal(session.editMany(batch),true);
  for(let i=0;i<256;i++){
    assert.deepEqual(session.read([i,0,0]),{id:(i%8)+1,revision:1});
    assert.equal(session.orientation([i,0,0]),null);
  }
  assert.equal(session.setOrientation([0,0,0],1,1,3),true);
  const before=session.exportLegacyCells();
  const stale=batch.map((item,i)=>({...item,expectedRevision:i===255?0:1}));
  assert.equal(session.editMany(stale),false);
  assert.deepEqual(session.exportLegacyCells(),before);
  assert.equal(session.orientation([0,0,0]),3);
  assert.throws(()=>session.editMany([...stale, {cell:[256,0,0],expectedId:1,expectedRevision:0,nextId:1}]),/Invalid edit batch/);
  assert.deepEqual(session.exportLegacyCells(),before);
  const restored=recoverLegacyVoxelSession(before);
  assert.equal(restored.orientation([0,0,0]),null);
  assert.deepEqual(restored.read([0,0,0]),{id:1,revision:0});
  assert.equal(restored.edit([0,0,0],1,1,2),false);
  assert.equal(restored.edit([0,0,0],1,0,2),true);
  assert.deepEqual(restored.exportLegacyCells()[0],{cell:[0,0,0],id:2});
});

test('model-driven sequence never leaks orientation into legacy exports',()=>{
  let seed=0x6d2b79f5;
  const next=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed>>>0;};
  const input=Array.from({length:24},(_,i)=>({cell:[i,2,-3],id:1+i%7}));
  const s=recoverLegacyVoxelSession(input);
  const model=input.map(x=>({id:x.id,revision:0,turn:null}));
  for(let step=0;step<600;step++){
    const index=next()%24, cell=[index,2,-3], state=model[index];
    if(next()%3===0){
      const turn=next()%4;
      assert.equal(s.setOrientation(cell,state.id,state.revision,turn),true);
      state.turn=turn;
    }else{
      const stale=next()%5===0;
      const expectedRevision=state.revision+(stale?1:0);
      const nextId=1+next()%9;
      assert.equal(s.edit(cell,state.id,expectedRevision,nextId),!stale);
      if(!stale){state.id=nextId;state.revision++;state.turn=null;}
    }
    assert.deepEqual(s.read(cell),{id:state.id,revision:state.revision});
    assert.equal(s.orientation(cell),state.turn);
  }
  const legacy=s.exportLegacyCells();
  assert.deepEqual(legacy,model.map((x,i)=>({cell:[i,2,-3],id:x.id})));
  const reloaded=recoverLegacyVoxelSession(legacy);
  for(let i=0;i<24;i++){
    assert.deepEqual(reloaded.read([i,2,-3]),{id:model[i].id,revision:0});
    assert.equal(reloaded.orientation([i,2,-3]),null);
  }
});
