import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRenderPreset,pixelBudget,bufferDimensions,deepMiningRenderActive,
  deepMiningBufferDimensions,DEEP_MINING_QUALITY_HOLD_MS,RENDER_PREF}
  from '../src/render-budget.mjs';
test('default balanced mode retains old 1.5 DPR render cap',()=>{
 assert.equal(normalizeRenderPreset(undefined),'balanced');
 assert.equal(bufferDimensions(596,369,'balanced',1).width,596);
 assert.equal(bufferDimensions(596,369,'balanced',3).width,894);
 assert.equal(bufferDimensions(596,369,'unknown',3).width,894);
 assert.equal(RENDER_PREF,'mythwrought-v010-render-preset');
});
test('battery and economy reduce pixel workload but not canvas geometry',()=>{
 const hi=bufferDimensions(596,369,'balanced',3),med=bufferDimensions(596,369,'battery',3);
 const lo=bufferDimensions(596,369,'economy',3);
 assert.ok(hi.width*hi.height>med.width*med.height);
 assert.ok(med.width*med.height>lo.width*lo.height);
 assert.equal(med.width,Math.floor(596*.85));
 assert.equal(lo.width,Math.floor(596*.65));
 assert.equal(normalizeRenderPreset('battery'),'battery');
 assert.equal(normalizeRenderPreset('economy'),'economy');
});
test('invalid DPR and zero-size viewport fail safely',()=>{
 assert.equal(pixelBudget('balanced',NaN),1);
 assert.equal(bufferDimensions(0,0,'battery',2).width,1);
 assert.throws(()=>bufferDimensions(NaN,20,'battery',2),/Invalid/);
});

test('adaptive deep-mining workload activates only on real recent below-ground edits',()=>{
  const t=50000;
  assert.equal(deepMiningRenderActive(-78,false,t-50,t),true);
  assert.equal(deepMiningRenderActive(-48,false,t,t),true);
  assert.equal(deepMiningRenderActive(-47.9,false,t,t),false);
  assert.equal(deepMiningRenderActive(-78,true,t,t),false,'protected cave graphics unchanged');
  assert.equal(deepMiningRenderActive(-78,false,-Infinity,t),false,'normal exploration unchanged');
  assert.equal(deepMiningRenderActive(-78,false,t-DEEP_MINING_QUALITY_HOLD_MS-1,t),false,
    'original quality automatically returns when mining stops');
  assert.equal(deepMiningRenderActive(-78,false,t+1,t),false,'future timestamps never activate');
});
test('adaptive deep framebuffer saves pixel work but never enlarges or changes CSS layout',()=>{
  const w=956,h=440;
  const normal=bufferDimensions(w,h,'balanced',3);
  const deep=deepMiningBufferDimensions(w,h,'balanced',3,true);
  assert.equal(normal.width,Math.floor(w*1.5));
  assert.equal(deep.width,Math.floor(w*.65));
  assert.equal(deep.height,Math.floor(h*.65));
  assert.ok(deep.width*deep.height<normal.width*normal.height*.2);
  assert.deepEqual(deepMiningBufferDimensions(w,h,'balanced',3,false),normal);
  assert.deepEqual(deepMiningBufferDimensions(w,h,'economy',3,true),
    bufferDimensions(w,h,'economy',3),'preserve user's already-lighter preset');
  assert.deepEqual(deepMiningBufferDimensions(w,h,'balanced',1,false),
    bufferDimensions(w,h,'balanced',1),'restore exact original viewport');
  assert.equal(RENDER_PREF,'mythwrought-v010-render-preset');
});
