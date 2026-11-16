import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {commitOrientedEdit} from '../src/voxel-orientation-transaction.mjs';

function fixture() {
  const cell=[1,2,-3], sidecar=makeOrientationSidecar();
  let id=4;
  sidecar.set(cell,id,3);
  const readIdentity=()=>id;
  const rollback=()=>{id=4;};
  const run=(edit,extra={})=>commitOrientedEdit({
    cell,sidecar,readIdentity,rollback,edit,...extra
  });
  return {cell,sidecar,run,readIdentity,setId:value=>{id=value;}};
}

test('committed same-ID replacement clears orientation, legacy schema remains untouched',async()=>{
  const f=fixture(),legacy={schema:1,edits:[[1,2,-3,4]]};
  const original=JSON.stringify(legacy);
  assert.equal(await f.run(()=>true),true);
  assert.equal(f.sidecar.get(f.cell,4),0);
  assert.equal(JSON.stringify(legacy),original);
});

test('rejected no-op preserves rotation',async()=>{
  const f=fixture();
  assert.equal(await f.run(()=>false),false);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('partial mutation followed by rejection rolls back without invalidating valid orientation',async()=>{
  const f=fixture();
  await assert.rejects(f.run(()=>{f.setId(5);return false;}),/Rejected edit mutated world/);
  assert.equal(f.readIdentity(),4);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('throwing edit rolls back before error escapes',async()=>{
  const f=fixture();
  await assert.rejects(f.run(()=>{f.setId(6);throw Error('write failed');}),/write failed/);
  assert.equal(f.readIdentity(),4);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('failed rollback fails closed and reports both errors',async()=>{
  const f=fixture();
  await assert.rejects(f.run(()=>{f.setId(7);throw Error('write failed');},{rollback:()=>{throw Error('undo failed');}}),
    error=>error instanceof AggregateError && error.errors.length===2);
  assert.equal(f.sidecar.get(f.cell,4),0);
});

test('readback failure during rejection triggers rollback',async()=>{
  const f=fixture();
  let reads=0;
  await assert.rejects(f.run(()=>false,{readIdentity:()=>{if(++reads===2)throw Error('chunk unavailable');return f.readIdentity();}}),/chunk unavailable/);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('invalid cell or callbacks cannot begin edit',async()=>{
  const f=fixture();
  await assert.rejects(commitOrientedEdit({cell:[0.5,0,0],sidecar:f.sidecar,readIdentity:()=>4,edit:()=>true,rollback:()=>{}}),TypeError);
  await assert.rejects(f.run(()=>true,{rollback:null}),TypeError);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('same-cell concurrent edits reject before reading or writing world',async()=>{
  const f=fixture();
  let release, writes=0, reads=0;
  const pending=new Promise(resolve=>{release=resolve;});
  const first=f.run(async()=>{writes++;await pending;return true;},{
    readIdentity:()=>{reads++;return f.readIdentity();}
  });
  await assert.rejects(f.run(()=>{writes++;return true;}),/Concurrent oriented edit/);
  assert.equal(writes,1);
  assert.equal(reads,1);
  assert.equal(f.sidecar.get(f.cell,4),3);
  release();
  assert.equal(await first,true);
  assert.equal(f.sidecar.get(f.cell,4),0);
  assert.equal(await f.run(()=>true),true);
});

test('different cells can edit independently while first cell awaits',async()=>{
  const f=fixture(), other=[2,2,-3];
  f.sidecar.set(other,4,2);
  let release;
  const pending=new Promise(resolve=>{release=resolve;});
  const first=f.run(async()=>{await pending;return true;});
  assert.equal(await f.run(()=>true,{cell:other}),true);
  assert.equal(f.sidecar.get(other,4),0);
  assert.equal(f.sidecar.get(f.cell,4),3);
  release();
  assert.equal(await first,true);
});

test('failed edit releases cell lock for subsequent recovery',async()=>{
  const f=fixture();
  await assert.rejects(f.run(()=>{throw Error('disk failure');}),/disk failure/);
  assert.equal(f.sidecar.get(f.cell,4),3);
  assert.equal(await f.run(()=>true),true);
  assert.equal(f.sidecar.get(f.cell,4),0);
});

test('successful edit with invalid readback rolls back and retains orientation',async()=>{
  const f=fixture();
  let reads=0;
  await assert.rejects(f.run(()=>{f.setId(255);return true;},{
    readIdentity:()=>{reads++;return f.readIdentity();}
  }),/invalid world identity/);
  assert.equal(reads,3);
  assert.equal(f.readIdentity(),4);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('successful edit with unavailable readback rolls back before returning',async()=>{
  const f=fixture();
  let reads=0;
  await assert.rejects(f.run(()=>{f.setId(5);return true;},{
    readIdentity:()=>{if(++reads===2)throw Error('readback unavailable');return f.readIdentity();}
  }),/readback unavailable/);
  assert.equal(f.readIdentity(),4);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('successful valid edit invalidates old orientation after commit readback',async()=>{
  const f=fixture();
  assert.equal(await f.run(()=>{f.setId(5);return true;}),true);
  assert.equal(f.readIdentity(),5);
  assert.equal(f.sidecar.get(f.cell,4),0);
});

test('explicitly rejected rollback fails closed even when block ID appears restored',async()=>{
  const f=fixture();
  const original=JSON.stringify({schema:1,edits:[[1,2,-3,4]]});
  let rollbackCalls=0;
  await assert.rejects(f.run(()=>{f.setId(5);throw Error('partial shape write');},{
    rollback:()=>{rollbackCalls++;f.setId(4);return false;}
  }),error=>error instanceof AggregateError &&
    error.errors[0].message==='partial shape write' &&
    error.errors[1].message==='Rollback explicitly rejected');
  assert.equal(rollbackCalls,1);
  assert.equal(f.readIdentity(),4,'same block ID does not prove shape rollback');
  assert.equal(f.sidecar.get(f.cell,4),0,'untrusted orientation must be invalidated');
  assert.equal(JSON.stringify({schema:1,edits:[[1,2,-3,4]]}),original);
  assert.equal(await f.run(()=>true),true,'lock is released after failed undo');
});

test('undefined rollback acknowledgement retains backwards-compatible successful undo',async()=>{
  const f=fixture();
  await assert.rejects(f.run(()=>{f.setId(5);throw Error('write failed');}),/write failed/);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('optional state fingerprint detects rejected same-ID shape mutation and restores it',async()=>{
  const f=fixture();
  let shape='north', undos=0;
  await assert.rejects(f.run(()=>{shape='east';return false;},{
    readState:()=>shape,
    rollback:()=>{undos++;shape='north';}
  }),/Rejected edit mutated shape state/);
  assert.equal(undos,1);
  assert.equal(shape,'north');
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('incomplete same-ID shape rollback invalidates orientation even if identity matches',async()=>{
  const f=fixture();
  let shape='north';
  await assert.rejects(f.run(()=>{shape='east';throw Error('partial edit');},{
    readState:()=>shape,
    rollback:()=>{ /* host forgot to undo the shape */ }
  }),error=>error instanceof AggregateError &&
    error.errors[0].message==='partial edit' &&
    error.errors[1].message==='Rollback did not restore shape state');
  assert.equal(f.readIdentity(),4);
  assert.equal(f.sidecar.get(f.cell,4),0);
});

test('invalid state fingerprint fails before edit without mutating rotation',async()=>{
  const f=fixture();
  let edits=0;
  await assert.rejects(f.run(()=>{edits++;return true;},{readState:()=>({mutable:true})}),/Invalid initial state fingerprint/);
  assert.equal(edits,0);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('optional state reader preserves old callback contract for successful same-ID edit',async()=>{
  const f=fixture();
  let shape='north';
  assert.equal(await f.run(()=>{shape='east';return true;},{readState:()=>shape}),true);
  assert.equal(shape,'east');
  assert.equal(f.sidecar.get(f.cell,4),0);
});

test('successful write with unreadable shape fingerprint rolls back before acknowledgement',async()=>{
  const f=fixture();
  let shape='north', undos=0;
  await assert.rejects(f.run(()=>{shape={corrupt:true};return true;},{
    readState:()=>shape,
    rollback:()=>{undos++;shape='north';}
  }),/Committed edit has invalid shape state/);
  assert.equal(undos,1);
  assert.equal(shape,'north');
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('non-finite initial shape fingerprint cannot start a world edit',async()=>{
  const f=fixture();
  let writes=0;
  await assert.rejects(f.run(()=>{writes++;return true;},{readState:()=>NaN}),/Invalid initial state fingerprint/);
  assert.equal(writes,0);
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('failed rollback after invalid committed shape invalidates stale rotation',async()=>{
  const f=fixture();
  let shape='north';
  await assert.rejects(f.run(()=>{shape=Infinity;return true;},{
    readState:()=>shape,
    rollback:()=>{ /* host cannot restore shape */ }
  }),error=>error instanceof AggregateError &&
    error.errors[0].message==='Committed edit has invalid shape state' &&
    error.errors[1].message==='Rollback did not restore shape state');
  assert.equal(f.sidecar.get(f.cell,4),0);
});

test('post-commit shape reader exception forces rollback and never acknowledges success',async()=>{
  const f=fixture();
  let shape='north',reads=0,undos=0;
  await assert.rejects(f.run(()=>{shape='east';return true;},{
    readState:()=>{if(++reads===2)throw Error('shape chunk unloaded');return shape;},
    rollback:()=>{undos++;shape='north';}
  }),/shape chunk unloaded/);
  assert.equal(undos,1);
  assert.equal(shape,'north');
  assert.equal(f.sidecar.get(f.cell,4),3);
});

test('unreadable rollback fingerprint fails closed even when original block ID survives',async()=>{
  const f=fixture();
  let shape='north',reads=0;
  await assert.rejects(f.run(()=>{shape='east';throw Error('partial write');},{
    readState:()=>{if(++reads===2)throw Error('shape read unavailable');return shape;},
    rollback:()=>{shape='north';}
  }),error=>error instanceof AggregateError &&
    error.errors[0].message==='partial write' &&
    error.errors[1].message==='shape read unavailable');
  assert.equal(f.readIdentity(),4);
  assert.equal(f.sidecar.get(f.cell,4),0);
});


test('ambiguous edit acknowledgements roll back partial writes rather than silently succeeding',async()=>{
  for (const acknowledgement of [undefined, null, 1, 'ok']) {
    const f=fixture();
    let undos=0;
    await assert.rejects(f.run(()=>{f.setId(6);return acknowledgement;},{
      rollback:()=>{undos++;f.setId(4);}
    }),/Invalid edit acknowledgement/);
    assert.equal(undos,1);
    assert.equal(f.readIdentity(),4);
    assert.equal(f.sidecar.get(f.cell,4),3);
  }
});

test('ambiguous acknowledgement with failed rollback invalidates orientation',async()=>{
  const f=fixture();
  await assert.rejects(f.run(()=>{f.setId(6);return undefined;},{
    rollback:()=>false
  }),error=>error instanceof AggregateError &&
    error.errors[0].message==='Invalid edit acknowledgement' &&
    error.errors[1].message==='Rollback explicitly rejected');
  assert.equal(f.sidecar.get(f.cell,4),0);
});
