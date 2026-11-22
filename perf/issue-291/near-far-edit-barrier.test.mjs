// Narrow mock-only near/far/voxel/save rollback ordering tests. These do NOT
// represent live GPU, real storage, actual mine/gravity or iPhone acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMockNearFarEditBarrier} from './near-far-edit-barrier.mjs';
const marker={__mythwrought291MockOnly:true};
function fixture({fail=null,flipContext=null}={}){
  const calls=[],fault={at:fail};
  const on=(part,action)=>{
    calls.push(part+'.'+action);
    if(fault.at===part+'.'+action)throw Error('injected-'+part+'.'+action);
    if(flipContext===part+'.'+action)ctx.valid=false;
  };
  const world={...marker,id:'world-m7',revision:41,block:11,
    digest(){return JSON.stringify([this.id,this.revision,this.block]);},
    capture(){on('world','capture');return {digest:this.digest(),revision:this.revision,block:this.block};},
    edit(cell,changed){on('world','edit');this.block=changed;this.revision++;},
    restore(snapshot){on('world','restore');this.revision=snapshot.revision;this.block=snapshot.block;}
  };
  function gpu(part){return {...marker,part,revision:41,ready:false,source:'old-source',
    digest(){return JSON.stringify([this.revision,this.ready,this.source]);},
    capture(){on(part,'capture');return {revision:this.revision,ready:this.ready,source:this.source,digest:this.digest()};},
    stage({revision}){on(part,'stage');this.ready=true;this.source='new-source';this.revision=revision;},
    commit(){on(part,'commit');if(!this.ready)throw Error('not staged');this.ready=false;},
    restore(s){on(part,'restore');this.revision=s.revision;this.source=s.source;this.ready=s.ready;}
  }};
  const near=gpu('near'),far=gpu('far');
  const storage={...marker,raw:world.digest(),digest(){return this.raw;},
    capture(){on('storage','capture');return {raw:this.raw,digest:this.raw};},
    commit(next){on('storage','commit');this.raw=next;},
    restore(snapshot){on('storage','restore');this.raw=snapshot.raw;}
  };
  const gate={...marker,closed:false,
    block(){on('gate','block');this.closed=true;},
    unblock(){on('gate','unblock');this.closed=false;},isBlocked(){return this.closed;}
  };
  const ctx={...marker,id:'context-v1',generation:4,valid:true,
    current(){on('context','current');return this.valid;}
  };
  const snapshot=()=>({world:world.digest(),near:near.digest(),far:far.digest(),save:storage.digest()});
  const original=snapshot();
  const create=()=>createMockNearFarEditBarrier({world,near,far,storage,gate,context:ctx});
  return {world,near,far,storage,gate,ctx,create,original,snapshot,calls,fault};
}
const execute=f=>f.create().execute({cell:[1,-78,1],replacement:0});
function original(f){assert.deepEqual(f.snapshot(),f.original);}
function blocked(r,f){assert.equal(r.phase,'blocked');assert.equal(r.drawBlocked,true);
 assert.equal(f.gate.isBlocked(),true);assert.equal(r.liveIntegrationApproved,false);}
function restored(r,f){assert.equal(r.phase,'restored-mock');assert.equal(r.drawBlocked,false);
 assert.equal(f.gate.isBlocked(),false);original(f);}

test('the one permissible happy path stages near THEN far, commits both, saves LAST, unblocks LAST',()=>{
 const f=fixture(),p=execute(f);assert.equal(p.phase,'committed-mock');assert.equal(p.liveIntegrationApproved,false);
 assert.equal(f.gate.isBlocked(),false);assert.equal(f.world.revision,42);
 assert.equal(f.storage.digest(),f.world.digest());
 const order=['gate.block','world.edit','near.stage','far.stage','near.commit','far.commit','storage.commit','gate.unblock'];
 const places=order.map(x=>f.calls.indexOf(x));assert.ok(places.every(x=>x>=0));
 assert.deepEqual([...places].sort((a,b)=>a-b),places);
 assert.equal(p.nativeBufferRollbackProven,false);
});
test('never allows reuse of a mock transaction',()=>{
 const f=fixture(),t=f.create();t.execute({cell:[1,-78,1],replacement:0});
 assert.throws(()=>t.execute({cell:[1,-78,1],replacement:0}),/ALREADY_EXECUTED/);
});
for(const failure of ['world.edit','near.stage','far.stage','near.commit','far.commit','storage.commit']){
 test(failure+' exception reverts original world, native mock near+far, and save in reverse priority',()=>{
   const f=fixture({fail:failure}),r=execute(f);restored(r,f);
   assert.equal(r.stage,failure==='world.edit'?'edit':failure==='storage.commit'?'save':failure.replace('.', '-'));
   assert.equal(f.calls.filter(x=>x==='storage.restore').length,1);
   assert.ok(f.calls.indexOf('far.restore')<f.calls.indexOf('near.restore'));
   assert.ok(f.calls.indexOf('near.restore')<f.calls.indexOf('world.restore'));
   assert.ok(f.calls.indexOf('world.restore')<f.calls.indexOf('storage.restore'));
 });
}
test('storage save failure never publishes near/far geometry and recovers exact saved digest',()=>{
 const f=fixture({fail:'storage.commit'}),r=execute(f);restored(r,f);
 assert.ok(!f.calls.includes('gate.unblock') || f.calls.indexOf('gate.unblock')>f.calls.indexOf('storage.restore'));
});
test('partial storage write then an exception is still rolled back',()=>{
 const f=fixture();const orig=f.storage.commit;
 f.storage.commit=x=>{orig(x);throw Error('storage write after-effect failure');};
 restored(execute(f),f);
});
test('storage returns success but writes wrong bytes: observed digest mismatch rolls back all domains',()=>{
 const f=fixture();f.storage.commit=()=>{f.storage.raw='invalid-save';};
 const r=execute(f);restored(r,f);assert.match(r.reason,/persisted-save-digest-mismatch/);
});
test('rollback of near buffers fails, so GPU render gate remains sealed',()=>{
 const g=fixture({fail:'far.stage'});g.fault.at='far.stage';
 g.near.restore=()=>{throw Error('rollback near buffer failed')};
 blocked(execute(g),g);
});
test('rollback of far buffers fails, so render gate remains blocked',()=>{
 const f=fixture({fail:'far.stage'});
 f.far.restore=()=>{throw Error('GPU context corrupted')};
 const r=execute(f);blocked(r,f);assert.match(r.reason,/GPU context corrupted/);
});
test('world rollback fails and no valid save is published, render gate remains blocked',()=>{
 const f=fixture({fail:'far.commit'});
 f.world.restore=()=>{throw Error('world rollback failed')};
 blocked(execute(f),f);
});
test('save rollback fails and render gate remains blocked',()=>{
 const f=fixture({fail:'storage.commit'});
 f.storage.restore=()=>{throw Error('persistent storage rollback failed')};
 blocked(execute(f),f);
});
test('fake rollback reports success but modifies world wrong; digest detects and seals render',()=>{
 const f=fixture({fail:'far.commit'});
 f.world.restore=()=>{f.world.block=999;f.world.revision=41};
 const r=execute(f);blocked(r,f);assert.match(r.reason,/restore-mismatch/);
});
test('fake rollback reports success but modifies far source; digest detects wrong GPU state',()=>{
 const f=fixture({fail:'near.commit'});
 f.far.restore=()=>{f.far.source='invalid';};
 const r=execute(f);blocked(r,f);assert.match(r.reason,/far:restore-mismatch/);
});
test('context loss immediately after world edit forbids any further staging and blocks rendering',()=>{
 const f=fixture({flipContext:'world.edit'}),r=execute(f);
 blocked(r,f);assert.ok(!f.calls.includes('near.stage'));
});
test('context loss after near staging prevents far staging and never claims old near buffers restored',()=>{
 const f=fixture({flipContext:'near.stage'}),r=execute(f);
 blocked(r,f);assert.equal(f.calls.includes('far.stage'),false);
 assert.equal(f.calls.includes('near.restore'),false);
});
test('context loss after far staging halts native commits and blocks scene',()=>{
 const f=fixture({flipContext:'far.stage'}),r=execute(f);
 blocked(r,f);assert.equal(f.calls.includes('near.commit'),false);
});
test('context loss after far commit does not proceed to save',()=>{
 const f=fixture({flipContext:'far.commit'}),r=execute(f);
 blocked(r,f);assert.equal(f.calls.includes('storage.commit'),false);
});
test('changed context generation after near stage invalidates whole attempted publication',()=>{
 const f=fixture();const original=f.near.stage;
 f.near.stage=(arg)=>{original.call(f.near,arg);f.ctx.generation++;};
 blocked(execute(f),f);
});
test('world identity change during near stage seals draw gate',()=>{
 const f=fixture();const original=f.near.stage;
 f.near.stage=(arg)=>{original.call(f.near,arg);f.world.id='other-world';};
 blocked(execute(f),f);
});
test('world revision jumps by two: reject before any near GPU staging',()=>{
 const f=fixture();f.world.edit=()=>{f.world.revision+=2;f.world.block=0;};
 const r=execute(f);restored(r,f);assert.equal(f.calls.includes('near.stage'),false);
});
test('invalid edit positions and IDs are rejected without world or GPU changes',()=>{
 for(const [cell,replacement] of [[[1.1,-78,1],0],[[1,-78],0],[[1,-78,1],1.1],[[1,-78,1],Infinity]]){
  const f=fixture(),r=f.create().execute({cell,replacement});restored(r,f);
  assert.equal(f.calls.includes('world.edit'),false);
 }
});
test('a fake successful GPU commit but externally reopened gate is detected before save',()=>{
 const f=fixture();const old=f.far.commit;
 f.far.commit=()=>{old();f.gate.closed=false};
 const r=execute(f);restored(r,f);
 assert.ok(!f.calls.includes('storage.commit'));
});
test('gate itself cannot block initially: no edit, no GPU allocation, no commit',()=>{
 const f=fixture({fail:'gate.block'}),r=execute(f);
 assert.equal(r.phase,'fatal-stop-required');
 assert.equal(r.drawBlocked,false);
 assert.equal(r.requiresExternalRenderLoopStop,true);
 original(f);assert.equal(f.calls.includes('world.edit'),false);
});
test('gate cannot unblock after true restore: remain blocked (and no false recovery)',()=>{
 const f=fixture({fail:'far.stage'});f.gate.unblock=()=>{throw Error('cannot reopen')};
 const r=execute(f);blocked(r,f);
});
test('mock-only marker required for every collaborator, not just renderer',()=>{
 const f=fixture();delete f.far.__mythwrought291MockOnly;
 assert.throws(f.create,/MOCK_ONLY_far/);
});
test('client may not call functions on live WebGL source without mock-only marker',()=>{
 const f=fixture();delete f.ctx.__mythwrought291MockOnly;
 assert.throws(f.create,/MOCK_ONLY_context/);
});
test('phase remains fully read-only and explicitly unapproved for integration',()=>{
 const f=fixture(),t=f.create();const s=t.state();
 assert.equal(s.nativeBufferRollbackProven,false);assert.equal(s.liveIntegrationApproved,false);
 assert.throws(()=>{s.phase='bogus';},TypeError);
 assert.equal(t.state().phase,'created');
});

test('gate tampering during rollback plus failed reblock demands external loop termination',()=>{
 const f=fixture({fail:'far.stage'});
 f.far.restore=()=>{f.gate.closed=false;throw Error('native rollback failed')};
 const prior=f.gate.block.bind(f.gate);let called=0;
 f.gate.block=()=>{called++;if(called===1)return prior();throw Error('cannot reblock')};
 const r=execute(f);
 assert.equal(r.phase,'blocked');
 assert.equal(r.drawBlocked,false);
 assert.equal(r.requiresExternalRenderLoopStop,true);
 assert.match(r.reason,/native rollback failed/);
});
test('out-of-order draw gate reopening during successful rollback with unblock failure reports accurate actual status',()=>{
 const f=fixture({fail:'far.stage'});
 f.gate.unblock=()=>{f.gate.closed=false;throw Error('unexpected draw gate release')};
 const r=execute(f);
 assert.equal(r.phase,'blocked');
 assert.equal(r.drawBlocked,false);
 assert.equal(r.requiresExternalRenderLoopStop,true);
});
