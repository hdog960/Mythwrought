import test from 'node:test';
import assert from 'node:assert/strict';
import {planOriginalG2SkyGate} from '../../src/floating-islands/sky-g2-orchestrator.mjs';
import {createSkyPrefetchState} from '../../src/floating-islands/sky-creative-bridge.mjs';
const p=(x,y,z)=>({x,y,z});
const base={from:p(0,35.5,0),to:p(.4,35.5,0),worldToken:'seed179#0',
  expectedWorldToken:'seed179#0',originalG2Approved:true,
  prefetchState:createSkyPrefetchState('seed179#0'),intentToken:'toward',
  isBaseRegionReady:()=>true,isBaseBodyClear:()=>true,
  isSkyResident:()=>true,isSkyBodyClear:()=>true};
const plan=changes=>planOriginalG2SkyGate({...base,...changes});
test('original G2 plus physical swept checks must BOTH approve to move',()=>{
  const r=plan();assert.equal(r.approved,true);
  assert.equal(r.position.x,.4);assert.equal(r.stream.requests.length,0);
  assert.equal(r.worldWrites,0);
});
test('all 8 sky-seam loaded cells are tested at 0,35.5,0',()=>{
  const visited=new Set();
  const r=plan({isSkyResident:region=>{visited.add(region.key);return true;}});
  assert.equal(r.approved,true);assert.equal(visited.size,8);
});
test('physical island collision stops motion even when original G2 approves',()=>{
  const r=plan({isSkyBodyClear:point=>point.x<.25});
  assert.equal(r.approved,false);assert.equal(r.position.x,0);
  assert.match(r.reason,/collision/);assert.equal(r.stream.requests.length,0);
});
test('unloaded sky section blocks motion and issues max two named sky requests',()=>{
  const r=plan({isSkyResident:()=>false});
  assert.equal(r.approved,false);assert.equal(r.position.x,0);
  assert.equal(r.stream.requests.length,2);
  assert.ok(r.stream.requests.every(row=>row.key.startsWith('sky:')));
});
test('original G2 refusal due to sky-unloaded can still request real sky pages',()=>{
  const r=plan({originalG2Approved:false,originalG2DeniedBySkyResidency:true,
    isSkyResident:()=>false});
  assert.equal(r.approved,false);assert.equal(r.stream.requests.length,2);
});
test('original G2 rejection for an unrelated reason does not issue phantom sky work',()=>{
  const r=plan({originalG2Approved:false,originalG2DeniedBySkyResidency:false,
    isSkyResident:()=>false});
  assert.equal(r.approved,false);assert.equal(r.stream.requests.length,0);
});
test('world switch before sweep cancels previously pending sky requests',()=>{
  const prefetchState={worldToken:'seed179#0',intentToken:'toward',
    pending:Object.freeze([{key:'sky:0,0,0',cx:0,cz:0,section:0}])};
  const r=plan({worldToken:'seed2026#1',prefetchState});
  assert.equal(r.approved,false);assert.deepEqual(r.stream.cancelled,['sky:0,0,0']);
});
test('mid-sweep world switch cancels all previous queue keys',()=>{
  let token='seed179#0',reads=0;
  const prefetchState={worldToken:'seed179#0',intentToken:'toward',
    pending:Object.freeze([{key:'sky:0,0,0',cx:0,cz:0,section:0}])};
  const r=plan({prefetchState,readCurrentWorldToken:()=>token,
    isSkyBodyClear:()=>{if(++reads===2)token='seed2026#1';return true;}});
  assert.equal(r.approved,false);assert.equal(r.position.x,0);
  assert.deepEqual(r.stream.cancelled,['sky:0,0,0']);
  assert.equal(r.stream.state.worldToken,'seed2026#1');
});
test('negative and 10k far-coordinate sky movement stays in correct world',()=>{
  const r=plan({from:p(-12000,250,12000),to:p(-12000.25,250,12000.25)});
  assert.equal(r.approved,true);assert.equal(r.position.x,-12000.25);
});
test('planner never bypasses original G2 overspeed limitation',()=>{
  const r=plan({to:p(3,35.5,0)});
  assert.equal(r.approved,false);assert.match(r.reason,/travel budget/);
});
test('bad dual collision source is rejected instead of continuing in blind flight',()=>{
  assert.throws(()=>plan({isSkyBodyClear:undefined}),/source-backed/);
});
