import test from 'node:test';
import assert from 'node:assert/strict';
import {createMiningTrace} from '../src/mining-trace.mjs';
import {uploadChunkBuffer} from '../src/gpu-recovery.mjs';
test('bounded trace retains long foreground stalls, preserves outcomes and resets lifecycle',()=>{
 let t=0;const trace=createMiningTrace(()=>t);
 trace.frame(0,true,{},()=>{t=2;});
 t=3;assert.equal(trace.action('mine',{},()=>{trace.measure('mesh',()=>{t=8;});trace.mark('voxelSaved');t=12;return 42;}),42);
 t=1200;trace.frame(1200,true,{},()=>{t=1204;});
 let r=trace.report();assert.equal(r.frames[1].gapMs,1200);assert.equal(r.edits[0].nextDrawEndMs,1192);assert.equal(r.edits[0].phases.mesh.totalMs,5);
 assert.throws(()=>trace.action('mine',{},()=>{throw Error('expected');}),/expected/);
 trace.resetContinuity();t=2000;trace.frame(2000,true,{},()=>{});assert.equal(trace.report().frames.at(-1).gapMs,null);
 for(let i=0;i<400;i++){t++;trace.frame(t,true,{},()=>{});trace.action('mine',{},()=>{});}
 r=trace.report();assert.equal(r.frames.length,360);assert.equal(r.edits.length,64);assert.equal(r.edits.at(-1).id,402);
});
test('optional upload timing preserves exact GL call order, error code and cleanup',()=>{
 function run(withTrace,fail){const calls=[];const buf={};let checks=0,t=0;const trace=createMiningTrace(()=>++t);
 const gl={NO_ERROR:0,ARRAY_BUFFER:1,STATIC_DRAW:2,createBuffer(){calls.push('create');return buf;},getError(){calls.push('error');return ++checks===2&&fail?1285:0;},bindBuffer(){calls.push('bind');},bufferData(){calls.push('data');},deleteBuffer(){calls.push('delete');}};
 const f=()=>uploadChunkBuffer(gl,new Float32Array(9),withTrace?trace.measure:null);
 if(fail)assert.throws(()=>trace.action('mine',{},f),/1285/);else assert.equal(trace.action('mine',{},f),buf);
 if(withTrace)assert.equal(trace.report().edits[0].phases.glPostGetError.count,1);
 return calls;}
 for(const fail of [false,true])assert.deepEqual(run(true,fail),run(false,fail));
});
test('frame streaming measurement is separate from edit phases',()=>{
 let t=0;const trace=createMiningTrace(()=>t);
 trace.frame(0,true,{},()=>{trace.measure('stream',()=>{t=8;});t=10;});
 t=12;trace.action('mine',{},()=>{trace.measure('glPreGetError',()=>{t=20;});});
 const r=trace.report();assert.equal(r.frames[0].phases.stream.totalMs,8);
 assert.equal(r.frames[0].drawMs,10);assert.equal(r.edits[0].phases.glPreGetError.totalMs,8);
 assert.equal(r.frames[0].phases.glPreGetError,undefined);
});
