import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createWaterHostQueries} from '../../../src/liquids/water/content/host-queries.mjs';
const peer=resolve(process.env.LIQUID_PEER_MODULES??'.','engine.mjs');
const bytes=readFileSync(peer);
assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),'48269883882fd04020bf3856ac1350a607f842a7');
const {createLiquidEngine}=await import(pathToFileURL(peer));
function setup(opts={}){
  const isLoaded=opts.isLoaded??(()=>true),isOpen=opts.isOpen??(()=>true);
  const engine=createLiquidEngine({isLoaded,isOpen,definitions:['water','lava','acid','amber-sap','liquid-resonance'].map(id=>({id,gravityLimit:0,lateralLimit:0}))});
  return {engine,q:createWaterHostQueries({engine,isLoaded,isOpen,maxIrrigationSamples:opts.maxIrrigationSamples??32})};
}
test('physical fractional swimming samples and exact surface boundary',()=>{
  const {engine:e,q}=setup();e.insert(-1,19,0,'water',3);e.insert(-1,20,0,'water',8);
  const before=e.save(),r=q.sampleSwimming([[-.5,19.2,.5],[-.5,19.375,.5],[-.5,20.9,.5]]);
  assert.deepEqual(r.map(s=>s.status),['water','dry','water']);assert.equal(r[0].surfaceY,19.375);assert.equal(r[0].fill,3/8);assert.deepEqual(e.save(),before);
});
test('unknown and closed cells never leak retained water or count as dry',()=>{
  let loaded=true,open=true;const {engine:e,q}=setup({isLoaded:()=>loaded,isOpen:()=>open});e.insert(0,0,0,'water',8);
  const before=e.save();loaded=false;assert.equal(q.sampleSwimming([[0,.5,0]])[0].status,'unavailable');
  loaded=true;open=false;assert.equal(q.sampleSwimming([[0,.5,0]])[0].status,'blocked');
  open=undefined;assert.equal(q.sampleSwimming([[0,.5,0]])[0].status,'unavailable');assert.deepEqual(e.save(),before);
});
test('other liquid identities are not water',()=>{
  const {engine:e,q}=setup();for(const [i,id] of ['lava','acid','amber-sap','liquid-resonance'].entries())e.insert(i,0,0,id,8);
  const r=q.sampleSwimming([0,1,2,3].map(x=>[x,.5,0]));assert.deepEqual(r.map(s=>s.id),['lava','acid','amber-sap','liquid-resonance']);assert.ok(r.every(s=>s.status==='other-liquid'));
  assert.equal(q.inspectIrrigation({positions:[[0,0,0],[1,0,0],[2,0,0],[3,0,0]]}).status,'no-water');
});
test('irrigation deduplicates explicit probes and distinguishes unknown',()=>{
  const {engine:e,q}=setup({isLoaded:x=>x!==2});e.insert(0,0,0,'water',3);e.insert(1,0,0,'water',7);
  const before=e.save(),r=q.inspectIrrigation({positions:[[0,0,0],[1,0,0],[1,0,0],[2,0,0]],minUnits:4});
  assert.equal(r.status,'water-present');assert.equal(r.samples.length,3);assert.deepEqual(r.qualifying,[[1,0,0]]);
  assert.equal(q.inspectIrrigation({positions:[[0,0,0],[2,0,0]],minUnits:4}).status,'unknown');assert.equal(q.inspectIrrigation({positions:[]}).status,'unknown');assert.deepEqual(e.save(),before);
});
test('pump gives only a volume upper bound, not a transfer',()=>{
  const {engine:e,q}=setup();e.insert(15,20,0,'water',6,{trace:17});e.insert(16,20,0,'water',7,{trace:2**40});
  const before=e.save(),r=q.inspectPump({intake:[15,20,0],outlet:[16,20,0],maxUnits:5});
  assert.equal(r.status,'candidate');assert.equal(r.upperBound,1);assert.equal(r.source.cell.quantities.trace,17);assert.equal(r.destination.cell.quantities.trace,2**40);assert.deepEqual(e.save(),before);
});
test('pump rejects full, unlike, obstructed or unavailable endpoints',()=>{
  const {engine:e,q}=setup({isLoaded:x=>x!==4,isOpen:x=>x!==3});e.insert(0,0,0,'water',8);e.insert(1,0,0,'water',8);e.insert(2,0,0,'acid',1);
  for(const x of [1,2,3,4]){const r=q.inspectPump({intake:[0,0,0],outlet:[x,0,0]});assert.equal(r.upperBound,0);assert.equal(r.status,x===4?'unavailable':'blocked');}
});
test('gate reports signed face fill only, checks host state and all axes',()=>{
  let gateOpen=false;const {engine:e,q}=setup({isOpen:(x,y,z)=>x!==0||y!==0||z!==0||gateOpen});e.insert(-1,0,0,'water',6);e.insert(1,0,0,'water',2);e.insert(0,-1,0,'water',8);e.insert(0,0,1,'lava',4);
  const before=e.save(),p={position:[0,0,0],axis:'x',gateOpen:false};assert.equal(q.inspectGate(p).fillDifference,.5);assert.equal(q.inspectGate(p).status,'closed');assert.equal(q.inspectGate({...p,gateOpen:true}).status,'unknown');
  gateOpen=true;assert.equal(q.inspectGate({...p,gateOpen:true}).status,'open');assert.equal(q.inspectGate({...p,axis:'y',gateOpen:true}).fillDifference,1);assert.equal(q.inspectGate({...p,axis:'z',gateOpen:true}).fillDifference,null);assert.deepEqual(e.save(),before);
});
test('physical limits and unavailable gate faces fail closed',()=>{
  const {engine:e,q}=setup({isLoaded:x=>x!==1});e.insert(0,-210,0,'water',8);e.insert(0,256,0,'water',8);
  assert.deepEqual(q.sampleSwimming([[0,-209.5,0],[0,256.99,0]]).map(s=>s.status),['water','water']);
  assert.equal(q.inspectGate({position:[0,256,0],axis:'y',gateOpen:true}).status,'unavailable');assert.equal(q.inspectGate({position:[0,0,0],axis:'x',gateOpen:true}).status,'unavailable');
  assert.throws(()=>q.sampleSwimming([[0,257,0]]),RangeError);
});
test('budgets and malformed inputs reject before readiness callbacks',()=>{
  let reads=0;const {q}=setup({isLoaded:()=>{reads++;return true;},maxIrrigationSamples:2});
  for(const call of [()=>q.sampleSwimming(Array(1)),()=>q.sampleSwimming(Array(9).fill([0,0,0])),()=>q.sampleSwimming([[0,0,0],[NaN,0,0]]),()=>q.inspectIrrigation({positions:[[0,0,0],[0,0,0],[0,0,0]]}),()=>q.inspectPump({intake:[0,0,0],outlet:[0,0,0]}),()=>q.inspectGate({position:[0,0,0],axis:'x',gateOpen:1})])assert.throws(call);
  assert.equal(reads,0);
});
