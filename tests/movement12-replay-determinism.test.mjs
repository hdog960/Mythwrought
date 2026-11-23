import test from 'node:test';
import assert from 'node:assert/strict';
import {compareStepReplays} from '../src/movement12/replay-determinism.mjs';
const world={get:()=>0};
const player=()=>({x:0,z:0,feet:1,vX:0,vY:0,vZ:0});
const opts=(step)=>({world,player:player(),inputs:[{forward:1},{forward:0},{jump:true}],dt:1/60,step});
test('repeatable injected physics produces identical positions and events',()=>{
  const r=compareStepReplays(opts((w,p,input,dt)=>{p.x+=(input.forward??0)*dt;return {hitWall:false};}));
  assert.equal(r.deterministic,true);assert.equal(r.frames,4);assert.equal(r.geometryCertified,false);
});
test('detects nondeterministic movement across two passes',()=>{
  let calls=0;
  const r=compareStepReplays(opts((w,p)=>{p.x+=(++calls>3?.1:.05);return {hitWall:false};}));
  assert.equal(r.deterministic,false);assert.ok(r.violations.some(v=>v.kind==='position-drift'));
});
test('detects collision event nondeterminism independently of position',()=>{
  let calls=0;
  const r=compareStepReplays(opts(()=>({hitWall:++calls>3})));
  assert.ok(r.violations.some(v=>v.kind==='event-drift'));
});
test('isolates the supplied player and input frames',()=>{
  const o=opts((w,p,input)=>{p.x+=1;input.forward=999;return {};});
  compareStepReplays(o);assert.equal(o.player.x,0);assert.equal(o.inputs[0].forward,1);
});
test('rejects invalid tolerances and invalid replay contracts',()=>{
  assert.throws(()=>compareStepReplays(opts(()=>({})),{positionTolerance:NaN}));
  assert.throws(()=>compareStepReplays({inputs:null}));
});

test('detects nondeterministic final velocity despite identical positions and events',()=>{
  let calls=0;
  const r=compareStepReplays(opts((w,p)=>{p.vX=++calls>3?2:1;return {hitWall:false};}));
  assert.equal(r.deterministic,false);
  assert.ok(r.violations.some(v=>v.kind==='motion-state-drift'));
});
test('detects nondeterministic grounded and jump-buffer state',()=>{
  let calls=0;
  const r=compareStepReplays(opts((w,p)=>{p.onGround=++calls>3;return {landed:false};}));
  assert.ok(r.violations.some(v=>v.kind==='motion-state-drift'));
});
test('allows insignificant finite motion-state roundoff within tolerance',()=>{
  let calls=0;
  const r=compareStepReplays(opts((w,p)=>{p.vY=++calls>3?1+1e-9:1;return {}; }));
  assert.equal(r.deterministic,true);
});
