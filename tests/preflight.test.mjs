import test from 'node:test';
import assert from 'node:assert/strict';
import {FrameHistory,gripClearance,probeTemporaryStorage,formatPreflightReport} from '../src/preflight.mjs';

test('frame history excludes background gaps and computes actual quantiles',()=>{
  const h=new FrameHistory(5);h.frame(0,true);for(const t of [16,32,48,90,106,122])h.frame(t,true);
  assert.equal(h.stats().frames,5);assert.equal(h.stats().p95Ms,42);
  assert.equal(h.stats().slowFrames,1);
  h.frame(5000,false);h.frame(8000,true);h.frame(8016,true);
  assert.equal(h.stats().worstMs,42);assert.equal(h.stats().frames,5);
});
test('empty frame history and capacity guard are honest',()=>{
  const h=new FrameHistory();assert.equal(h.stats().approxFps,null);
  assert.throws(()=>new FrameHistory(0));
});
test('controller geometry validates gaps and min viewing area',()=>{
  const left={right:160},right={left:780};const view={left:160,right:780,width:620,height:360};
  assert.equal(gripClearance(left,right,view).unobstructed,true);
  assert.equal(gripClearance(left,right,{...view,width:150}).unobstructed,false);
  assert.equal(gripClearance(left,right,{...view,right:800}).unobstructed,false);
});
test('storage probe never touches canonical world keys on success and failure',()=>{
  const m=new Map([['mythwrought-v002-world-179','precious']]);
  const store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};
  const key='mythwrought-v010-probe-12345678';
  assert.equal(probeTemporaryStorage(store,key).ok,true);
  assert.equal(m.get('mythwrought-v002-world-179'),'precious');assert.equal(m.has(key),false);
  store.setItem=()=>{throw Error('quota')};
  assert.equal(probeTemporaryStorage(store,key).ok,false);
  assert.equal(m.get('mythwrought-v002-world-179'),'precious');
  assert.throws(()=>probeTemporaryStorage(store,'mythwrought-v002-world-179'),/Unsafe/);
});
test('report labels hardware limitations without claiming acceptance',()=>{
 const report=formatPreflightReport({stamp:'2026',agent:'test',dimensions:'932×430',homeScreen:'unknown',
  grips:gripClearance({right:200},{left:730},{left:200,right:730,width:530,height:370}),
  frames:new FrameHistory().stats(),render:'WebGL2',save:'unverified',probe:{ok:false,detail:'quota'},quota:'unavailable'});
 assert.match(report,/not certification/);assert.match(report,/insufficient foreground samples/);
 assert.match(report,/Temporary storage: FAIL/);assert.match(report,/MANUAL iPhone/);
});
