import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine,LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import {createLiquidOwnerHandoff} from '../../../src/liquids/core/owner-handoff.mjs';
import {physicalRegionAt} from '../../../src/world-height.mjs';

const definitions=LIQUID_IDS.map(id=>({id,gravityLimit:8,lateralLimit:4}));
const owner=(x,y,z)=>physicalRegionAt(x,y,z);
const clone=o=>JSON.parse(JSON.stringify(o));
const state=(engine,parked=[])=>({version:1,resident:engine.save(),parked});
const allCells=s=>[...s.resident.cells,...s.parked.flatMap(p=>p.snapshot.cells)];
const totals=s=>{
  const rows=allCells(s),q={};let units=0;
  for(const c of rows){units+=c.units;for(const [k,v] of Object.entries(c.quantities))q[k]=(q[k]??0)+v;}
  return {units,q};
};
function fixture({maxCells=8192,maxParkedCells=8192,maxParkedOwners=64,isOpen=()=>true}={}){
  const unloaded=new Set();
  const isOwnerLoaded=o=>!unloaded.has(o.key);
  const isLoaded=(x,y,z)=>isOwnerLoaded(owner(x,y,z));
  const config={definitions,maxCells,isLoaded,isOpen};
  const handoff=createLiquidOwnerHandoff({...config,isOwnerLoaded,maxParkedCells,maxParkedOwners});
  return {unloaded,isOwnerLoaded,isLoaded,handoff,engine:(snapshot=null)=>createLiquidEngine({...config,snapshot})};
}
function detach(f,s,o){f.unloaded.add(o.key);return f.handoff.stage({state:s,owner:o,mode:'detach'});}
function attach(f,s,o){f.unloaded.delete(o.key);return f.handoff.stage({state:s,owner:o,mode:'attach'});}

test('all five liquid identities and quantities survive owner parking and rehydration',()=>{
  const f=fixture(),e=f.engine(),o=owner(-1,20,-1);
  for(let i=0;i<LIQUID_IDS.length;i++)assert(e.insert(-1-i,20,-1,LIQUID_IDS[i],i+1,{heat:i*3+1,energy:i*7+1}));
  e.insert(0,20,-1,'water',2,{energy:5});
  const s=state(e),before=clone(s),p=detach(f,s,o);
  assert.deepEqual(s,before);assert.equal(p.movedCells,5);assert.equal(p.movedUnits,15);
  assert.equal(p.state.resident.cells.length,1);assert.equal(p.state.parked[0].snapshot.cells.length,5);
  assert.deepEqual(totals(p.state),totals(s));
  assert.equal(f.handoff.stage({state:p.state,owner:o,mode:'detach'}),null);
  const restored=attach(f,clone(p.state),o);
  assert.deepEqual(totals(restored.state),totals(s));assert.equal(restored.state.parked.length,0);
  assert.deepEqual(restored.state.resident.cells.filter(c=>c.x<0),s.resident.cells.filter(c=>c.x<0));
  assert.equal(f.handoff.stage({state:restored.state,owner:o,mode:'attach'}),null);
  assert(Object.isFrozen(restored.state)&&Object.isFrozen(restored.state.resident.pending));
});

test('physical vertical boundaries and negative chunk seams use canonical shared keys',()=>{
  const f=fixture(),e=f.engine();
  for(const y of [-210,-20,-19,-4,-3,19,20,35,36,243,244,256])assert(e.insert(-16,y,-1,'water',1));
  assert(e.insert(-17,20,-1,'water',2));
  let s=state(e);const base=totals(s);
  for(const [y,n] of [[-210,1],[-20,1],[-19,2],[-3,2],[20,2],[36,1],[243,1],[244,2]]){
    const o=owner(-16,y,-1),p=detach(f,s,o);assert.equal(p.movedCells,n);s=p.state;
    assert(p.state.parked.at(-1).snapshot.cells.every(c=>owner(c.x,c.y,c.z).key===o.key));
  }
  assert.deepEqual(totals(s),base);assert.equal(s.resident.cells.length,1);
  assert.equal(s.resident.cells[0].x,-17);
  for(const p of [...s.parked])s=attach(f,s,p.owner).state;
  assert.deepEqual(totals(s),base);assert.equal(s.resident.cells.length,13);
});

test('parked owner keeps pending relative order and retained FIFO precedes resumed work',()=>{
  const f=fixture(),e=f.engine(),o=owner(16,0,0);
  for(const x of [20,0,21,1,22])e.insert(x,0,0,'water',1);
  const s=state(e);const p=detach(f,s,o);
  assert.deepEqual(p.state.resident.pending,[[0,0,0],[1,0,0]]);
  assert.deepEqual(p.state.parked[0].snapshot.pending,[[20,0,0],[21,0,0],[22,0,0]]);
  const a=attach(f,p.state,o);
  assert.deepEqual(a.state.resident.pending,[[0,0,0],[1,0,0],[20,0,0],[21,0,0],[22,0,0]]);
});

test('empty horizontal owner reopens a settled boundary without diagonal or remote wakes',()=>{
  const f=fixture({isOpen:(x,y,z)=>y===0&&((z===0&&(x===15||x===16||x===32||x===80))||(x===15&&z===-1))}),e=f.engine(),o=owner(16,0,0);
  e.insert(15,0,0,'water',8);e.insert(32,0,0,'water',1);
  e.insert(15,0,-1,'lava',1);e.insert(80,0,0,'water',1);
  f.unloaded.add(o.key);e.tick();assert.equal(e.save().pending.length,0);
  const p=detach(f,state(e),o);assert.equal(p.movedCells,0);
  // Detach woke the neighboring cells; settle them while the owner is closed.
  const resident=f.engine(p.state.resident);resident.tick();
  const a=attach(f,state(resident,p.state.parked),o);assert.equal(a.boundaryWoken,2);
  const live=f.engine(a.state.resident);live.tick(1);
  assert.equal(live.getCell(16,0,0).units,4);assert.deepEqual(totals(state(live)),{units:11,q:{}});
});

test('upper-to-surface gravity resumes across a previously unloaded empty owner',()=>{
  const f=fixture({isOpen:(x,y,z)=>x===0&&z===0&&(y===19||y===20)}),e=f.engine(),o=owner(0,19,0);
  f.unloaded.add(o.key);e.insert(0,20,0,'water',8,{trace:17});e.tick();
  const p=detach(f,state(e),o),resident=f.engine(p.state.resident);resident.tick();
  const a=attach(f,state(resident,p.state.parked),o),live=f.engine(a.state.resident);
  live.tick(1);assert.equal(live.getCell(0,20,0),null);
  assert.equal(live.getCell(0,19,0).units,8);assert.equal(live.getCell(0,19,0).quantities.trace,17);
});

test('resident or parked capacity rejection leaves both snapshots unchanged',()=>{
  const f=fixture({maxCells:2,maxParkedCells:1,maxParkedOwners:1}),e=f.engine(),o=owner(16,0,0);
  e.insert(16,0,0,'water',8);e.insert(0,0,0,'water',1);
  const p=detach(f,state(e),o);const resident=f.engine(p.state.resident);
  assert(resident.insert(1,0,0,'water',1));const s=state(resident,p.state.parked),before=clone(s);
  assert.equal(attach(f,s,o),null);assert.deepEqual(s,before);
  const other=owner(0,0,0);assert.equal(detach(f,s,other),null);assert.deepEqual(s,before);
  const g=fixture({maxParkedCells:0}),h=g.engine();h.insert(16,0,0,'water',1);
  assert.equal(detach(g,state(h),o),null);
});

test('loaded/open state is mandatory and blocked rehydration preserves parked mass',()=>{
  let blocked=false;const f=fixture({isOpen:x=>!(blocked&&x===16)}),e=f.engine(),o=owner(16,0,0);
  e.insert(16,0,0,'lava',3,{heat:240});const s=state(e);
  assert.equal(f.handoff.stage({state:s,owner:o,mode:'detach'}),null);
  const p=detach(f,s,o),before=clone(p.state);blocked=true;
  assert.equal(attach(f,p.state,o),null);assert.deepEqual(p.state,before);
  blocked=false;assert(attach(f,p.state,o));
});

test('malformed parked shard, foreign owner, duplicate owners and overlap fail closed',()=>{
  const f=fixture(),e=f.engine(),o=owner(16,0,0);e.insert(16,0,0,'acid',3,{solute:9});
  const p=detach(f,state(e),o),s=clone(p.state);
  const request=state=>f.handoff.stage({state,owner:o,mode:'attach'});
  assert.throws(()=>request({...s,version:2}));
  assert.throws(()=>request({...s,parked:[...s.parked,...s.parked]}));
  assert.throws(()=>request({...s,parked:[{...s.parked[0],owner:owner(0,0,0)}]}));
  assert.throws(()=>request({...s,resident:e.save()}));
  assert.throws(()=>request({...s,parked:[{...s.parked[0],snapshot:{...s.parked[0].snapshot,pending:[[0,0,0]]}}]}));
  assert.throws(()=>f.handoff.stage({state:s,owner:{...o,key:'wrong'},mode:'attach'}));
  assert.deepEqual(s,p.state);
});

test('staged result round-trips with deterministic continuation through actual core',()=>{
  const f=fixture(),e=f.engine(),o=owner(16,20,0);
  e.insert(16,20,0,'water',8,{energy:33});e.insert(15,20,0,'water',2,{energy:5});
  const p=detach(f,state(e),o),a=attach(f,p.state,o),b=attach(f,clone(p.state),o);
  assert.deepEqual(a,b);const x=f.engine(a.state.resident),y=f.engine(b.state.resident);
  for(let i=0;i<20;i++){assert.deepEqual(x.tick(2),y.tick(2));assert.deepEqual(x.save(),y.save());}
  assert.deepEqual(totals(state(x)),{units:10,q:{energy:38}});
});

test('unknown readiness and thrown host callbacks never mutate input state',()=>{
  const f=fixture(),e=f.engine(),o=owner(16,0,0);e.insert(16,0,0,'water',1);
  const s=state(e),before=clone(s);
  const h=createLiquidOwnerHandoff({definitions,isLoaded:()=>false,isOpen:()=>true,isOwnerLoaded:()=>undefined});
  assert.equal(h.stage({state:s,owner:o,mode:'detach'}),null);
  const k=createLiquidOwnerHandoff({definitions,isLoaded:()=>{throw Error('host error');},isOpen:()=>true,isOwnerLoaded:()=>false});
  assert.throws(()=>k.stage({state:s,owner:o,mode:'detach'}),/host error/);assert.deepEqual(s,before);
});


test('another parked owner must remain unloaded before an unrelated transition',()=>{
  const f=fixture(),e=f.engine(),o=owner(16,0,0),other=owner(32,0,0);
  e.insert(16,0,0,'water',1);e.insert(32,0,0,'acid',2,{solute:7});
  const p=detach(f,state(e),o),q=detach(f,p.state,other),before=clone(q.state);
  f.unloaded.delete(other.key);
  assert.equal(attach(f,q.state,o),null);assert.deepEqual(q.state,before);
  f.unloaded.add(other.key);assert(attach(f,q.state,o));
});
