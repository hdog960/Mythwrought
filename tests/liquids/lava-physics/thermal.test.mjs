import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as lava from '../../../src/liquids/lava/physics/definition.mjs';
import {createLavaThermalScheduler as create} from '../../../src/liquids/lava/physics/thermal-scheduler.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const {lavaQuantities:q,readLavaHeat:heat,createLavaVent:vent,visitLavaVent:visit}=lava;
const cell=(x,units=4,h=80)=>Object.freeze({x,y:0,z:0,id:'lava',units,quantities:q(units,h)});
const opts=(over={})=>({engine:{getCell:x=>cell(x)},isLoaded:()=>true,isOpen:()=>true,canCool:()=>true,...over});
const xs=r=>r.proposals.map(p=>p.expected.x);
const track=(s,...xs)=>{for(const x of xs)assert.equal(s.track(x,0,0),true);};

test('bounded FIFO fairness, no duplicate reordering',()=>{
  const s=create(opts({maxVisits:2}));track(s,0,1,2,0);
  assert.deepEqual(xs(s.step()),[0,1]);assert.deepEqual(xs(s.step()),[2,0]);
  assert.deepEqual(xs(s.step()),[1,2]);assert.throws(()=>s.step(3),RangeError);
});
test('cap refuses new work and loaded obsolete coordinates free capacity even when blocked',()=>{
  const s=create(opts({maxTracked:1,isOpen:()=>false,engine:{getCell:()=>null}}));
  assert.equal(s.track(0,-210,0),true);assert.equal(s.track(1,256,0),false);
  assert.equal(s.step().retired,1);assert.equal(s.track(1,256,0),true);
  assert.throws(()=>s.track(0,257,0),RangeError);assert.throws(()=>s.track(0,-211,0),RangeError);
});
test('unloaded never reads core; obstructed loaded lava is not exposed and resumes',()=>{
  let loaded=false,open=false,reads=0;
  const s=create(opts({isLoaded:()=>loaded,isOpen:()=>open,engine:{getCell:x=>{reads++;return cell(x);}}}));
  track(s,0);assert.equal(s.step().deferred,1);assert.equal(reads,0);
  loaded=true;const blocked=s.step();assert.equal(blocked.deferred,1);assert.equal(blocked.observations.length,0);
  assert.equal(blocked.pending,1);assert.equal(reads,1);
  open=true;assert.deepEqual(xs(s.step()),[0]);assert.equal(reads,2);
});
test('cooling eligibility is separate from heat observation and neither mutates state',()=>{
  const c=cell(0);let enabled=false;
  const s=create(opts({engine:{getCell:()=>c},canCool:()=>enabled,lossPerUnit:7}));track(s,0);
  const first=s.step();assert.equal(first.proposals.length,0);
  assert.deepEqual(first.observations[0],{expected:c,id:'lava',fill:.5,heat:320,heatPerUnit:80});
  enabled=true;const p=s.step().proposals[0];
  assert.deepEqual([p.nextHeat,p.releasedHeat,heat(c),p.expected===c],[292,28,320,true]);
  assert.ok(Object.isFrozen(first.observations)&&Object.isFrozen(first.observations[0]));
});
test('foreign and invalid cells retire or report without proposals',()=>{
  const s=create(opts({engine:{getCell:x=>x===0?{id:'water'}:{...cell(x),quantities:{other:1}}}}));
  track(s,0,1);const r=s.step();assert.deepEqual([r.retired,r.invalid,r.proposals,r.observations,r.pending],[1,[[1,0,0]],[],[],0]);
});
test('snapshot keeps exact queue order, config and rejects invalid restore',()=>{
  const o=opts({maxVisits:1}),s=create(o);track(s,0,1);s.step();
  const saved=JSON.parse(JSON.stringify(s.save())),t=create({...o,snapshot:saved});
  assert.deepEqual(t.save(),saved);assert.deepEqual(xs(t.step()),xs(s.step()));assert.deepEqual(t.save(),s.save());
  for(const snapshot of [{...saved,pending:[[0,0,0],[0,0,0]]},{...saved,pending:[[0,257,0]]},{...saved,version:2}])
    assert.throws(()=>create({...o,snapshot}),TypeError);
  assert.throws(()=>create({...o,lossPerUnit:5,snapshot:saved}),TypeError);
});
test('failure after an earlier successful observation preserves entire queue prefix',()=>{
  let fail=true;const s=create(opts({canCool:c=>{if(fail&&c.x===1)throw Error('host failure');return true;}}));
  track(s,0,1,2);const before=s.save();assert.throws(()=>s.step(2),/host failure/);
  assert.deepEqual(s.save(),before);fail=false;assert.deepEqual(xs(s.step(2)),[0,1]);
});
test('reentrant host mutation refuses without rotation',()=>{
  let s;s=create(opts({canCool:()=>s.track(1,0,0)}));track(s,0);
  const before=s.save();assert.throws(()=>s.step(),/Reentrant/);assert.deepEqual(s.save(),before);
});
test('partial cold mass is accounted but not a full voxel or terrain write',()=>{
  const c=cell(0,3,0),s=create(opts({engine:{getCell:()=>c}}));track(s,0);
  const p=s.step().proposals[0];assert.deepEqual([p.consumeLava,p.solidUnits,p.fullVoxelCandidate,heat(c)],[3,3,false,0]);
});
test('empty queue does no host work and zero loss does not manufacture heat change',()=>{
  const s=create(opts({lossPerUnit:0}));assert.deepEqual(s.step(),{visited:0,deferred:0,retired:0,invalid:[],observations:[],proposals:[],pending:0});
  track(s,0);const r=s.step();assert.equal(r.proposals.length,0);assert.equal(r.observations[0].heat,320);
});

// The peer is supplied as an independently pinned file, never vendored on this branch.
const corePath=process.env.LIQUID_ENGINE_MODULE;
const core=corePath?await import(pathToFileURL(resolve(corePath)).href):null;
const make=(loaded,open,snapshot=null)=>core.createLiquidEngine({isLoaded:loaded,isOpen:open,definitions:[lava.LAVA_DEFINITION],snapshot});
test('actual core: flow invalidates expected-cell identity; dirty cells track without energy loss',{skip:!core},()=>{
  const loaded=()=>true,open=(x,y,z)=>x===0&&z===0&&(y===0||y===1),e=make(loaded,open);
  e.insert(0,1,0,'lava',8,q(8));const s=create({engine:e,isLoaded:loaded,isOpen:open,canCool:()=>true});
  s.track(0,1,0);const old=s.step().proposals[0],delta=e.tick(1);
  for(const p of delta.changed)assert.equal(s.track(...p),true);
  assert.notEqual(e.getCell(0,1,0),old.expected);
  const before=e.save(),r=s.step();assert.deepEqual(r.proposals.map(p=>p.expected.y),[1,0]);assert.deepEqual(e.save(),before);
  assert.equal(r.proposals.reduce((sum,p)=>sum+p.expected.units,0),8);
  assert.equal(r.proposals.reduce((sum,p)=>sum+p.nextHeat+p.releasedHeat,0),640);
});
test('actual core: finite vent and thermal queue survive unload and JSON restore',{skip:!core},()=>{
  let active=true;const loaded=()=>active,open=(x,y,z)=>x===0&&y===0&&z===0;
  let e=make(loaded,open),v=vent({x:0,y:0,z:0,rate:2,remaining:3});
  let s=create({engine:e,isLoaded:loaded,isOpen:open,canCool:()=>true});track(s,0);
  v=visit(e,v).state;active=false;e.tick(1);assert.equal(s.step().deferred,1);assert.deepEqual(visit(e,v).state,v);
  const saved=JSON.parse(JSON.stringify({engine:e.save(),vent:v,thermal:s.save()}));
  e=make(loaded,open,saved.engine);v=vent(saved.vent);
  s=create({engine:e,isLoaded:loaded,isOpen:open,canCool:()=>true,snapshot:saved.thermal});
  assert.equal(s.step().proposals.length,0);active=true;e.wake(0,0,0);v=visit(e,v).state;
  assert.deepEqual([v.remaining,v.emitted,e.getCell(0,0,0).units,heat(e.getCell(0,0,0))],[0,3,3,240]);
  assert.equal(visit(e,v).inserted,0);assert.equal(s.step().proposals[0].releasedHeat,12);
});
