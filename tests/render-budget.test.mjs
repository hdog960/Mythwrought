import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRenderPreset,pixelBudget,bufferDimensions,RENDER_PREF} from '../src/render-budget.mjs';
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
