import test from 'node:test';
import assert from 'node:assert/strict';
import {createLavaThermalScheduler} from '../../../src/liquids/lava/physics/thermal-scheduler.mjs';
import {lavaQuantities} from '../../../src/liquids/lava/physics/definition.mjs';
const p=x=>[x,0,0];
const lava=x=>Object.freeze({x,y:0,z:0,id:'lava',units:4,quantities:lavaQuantities(4)});
function fixture(over={}){
  const cells=new Map();
  const options={engine:{getCell:x=>cells.get(x)??null},isLoaded:()=>true,
    isOpen:()=>true,canCool:()=>true,maxTracked:3,...over};
  return {cells,options,s:createLavaThermalScheduler(options)};
}
test('dirty move retires emptied origin before admitting new destination at cap',()=>{
  const {s,cells}=fixture({maxTracked:1});
  cells.set(0,lava(0));s.track(...p(0));cells.delete(0);cells.set(1,lava(1));
  assert.deepEqual(s.reconcileChanged([p(1),p(0)]),{added:1,retired:1,deferred:[],pending:1});
  assert.deepEqual(s.save().pending,[p(1)]);
  assert.equal(s.step().observations[0].heat,320);
});
test('foreign cells retire, surviving lava retains FIFO, duplicate dirty entries append once',()=>{
  const {s,cells}=fixture();s.track(...p(0));s.track(...p(1));s.track(...p(2));
  cells.set(0,{id:'water'});cells.set(1,lava(1));cells.set(2,lava(2));cells.set(3,lava(3));
  assert.deepEqual(s.reconcileChanged([p(3),p(2),p(0),p(3)]),{added:1,retired:1,deferred:[],pending:3});
  assert.deepEqual(s.save().pending,[p(1),p(2),p(3)]);
});
test('insufficient net capacity rejects all queue changes',()=>{
  const {s,cells}=fixture({maxTracked:2});s.track(...p(0));s.track(...p(1));
  for(const x of [1,2,3])cells.set(x,lava(x));
  const before=s.save();assert.equal(s.reconcileChanged([p(0),p(2),p(3)]),null);
  assert.deepEqual(s.save(),before);
});
test('unloaded dirty cells never read engine or retire tracked entries; defer for attach',()=>{
  const reads=[];let loaded=false;
  const {s}=fixture({isLoaded:()=>loaded,engine:{getCell:x=>{reads.push(x);return x===1?lava(x):null;}}});
  s.track(...p(0));const r=s.reconcileChanged([p(0),p(1),p(1)]);
  assert.deepEqual(r,{added:0,retired:0,deferred:[p(0),p(1)],pending:1});assert.deepEqual(reads,[]);
  assert.ok(Object.isFrozen(r.deferred)&&Object.isFrozen(r.deferred[0]));
  loaded=true;assert.deepEqual(s.reconcileChanged(r.deferred),{added:1,retired:1,deferred:[],pending:1});
  assert.deepEqual(s.save().pending,[p(1)]);
});
test('invalid heat and callback failure leave exact queue unchanged',()=>{
  let mode='invalid';const {s}=fixture({engine:{getCell:x=>{
    if(x===0)return null;if(mode==='throw')throw Error('host failure');
    return {...lava(x),quantities:{'lava-heat':401}};
  }}});s.track(...p(0));const before=s.save();
  assert.throws(()=>s.reconcileChanged([p(0),p(1)]),TypeError);assert.deepEqual(s.save(),before);
  mode='throw';assert.throws(()=>s.reconcileChanged([p(0),p(1)]),/host failure/);assert.deepEqual(s.save(),before);
});
test('invalid or oversized dirty lists fail before any host read',()=>{
  let reads=0;const {s}=fixture({isLoaded:()=>{reads++;return true;}});
  for(const batch of [[p(0),[1,257,0]],[p(0),[1,0]],Array(385).fill(p(0))])
    assert.throws(()=>s.reconcileChanged(batch),RangeError);
  assert.throws(()=>s.reconcileChanged([p(0)],{limit:24577}),RangeError);
  assert.equal(reads,0);assert.deepEqual(s.save().pending,[]);
});
test('reentrant queue edits fail without retiring an earlier coordinate',()=>{
  let s;({s}=fixture({engine:{getCell:x=>x===0?null:s.track(...p(2))}}));
  s.track(...p(0));const before=s.save();
  assert.throws(()=>s.reconcileChanged([p(0),p(1)]),/Reentrant/);assert.deepEqual(s.save(),before);
});
test('restored scheduler preserves reconciled queue and deterministic next step',()=>{
  const {s,cells,options}=fixture({maxVisits:1});cells.set(0,lava(0));cells.set(1,lava(1));
  assert.deepEqual(s.reconcileChanged([p(1),p(0)]),{added:2,retired:0,deferred:[],pending:2});
  const t=createLavaThermalScheduler({...options,snapshot:JSON.parse(JSON.stringify(s.save()))});
  assert.deepEqual(t.step(),s.step());assert.deepEqual(t.save(),s.save());
});
