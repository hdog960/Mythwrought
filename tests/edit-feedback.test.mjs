import test from 'node:test';
import assert from 'node:assert/strict';
import {recordWorldEditFeedback,sampleWorldEditFeedback,MAX_EDIT_TRAILS,BLOCKED_FEEDBACK_MS} from '../src/edit-feedback.mjs';

test('rapid mine/place edits retain bounded distinct world-space confirmations',()=>{
  let state=[];
  for(let i=0;i<6;i++)state=recordWorldEditFeedback(state,{ok:true,mode:i%2?'place':'mine',cell:[i,10,0]},i*30);
  assert.equal(state.length,MAX_EDIT_TRAILS);
  assert.deepEqual(state.map(e=>e.cell[0]),[3,4,5]);
  const sample=sampleWorldEditFeedback(state,160);
  assert.ok(sample.vertices.length>0);
  assert.equal(sample.vertices.length%9,0);
  assert.ok([...sample.vertices].every(Number.isFinite));
  assert.equal(sampleWorldEditFeedback(state,1000).vertices.length,0);
});

test('blocked placement briefly marks its actual adjacent cell, never a HUD',()=>{
  const inspection={adjacent:[12,8,-5]};
  const state=recordWorldEditFeedback([],{ok:false,reason:'Cannot place inside the player'},100,inspection);
  inspection.adjacent[0]=999;
  assert.deepEqual(state[0].cell,[12,8,-5]);
  const first=sampleWorldEditFeedback(state,100);
  const later=sampleWorldEditFeedback(state,100+BLOCKED_FEEDBACK_MS/2);
  assert.ok(first.vertices.length>0);
  assert.notEqual(first.key,later.key);
  assert.ok(first.vertices[3]>later.vertices[3]);
  assert.equal(sampleWorldEditFeedback(state,100+BLOCKED_FEEDBACK_MS).vertices.length,0);
});

test('unrelated failures, missing targets and nonfinite timing produce no ghost geometry',()=>{
  for(const reason of ['Look at a nearby block','Unknown block action','Block update failed; nothing changed']){
    assert.deepEqual(recordWorldEditFeedback([],{ok:false,reason},10,{adjacent:[1,2,3]}),[]);
  }
  assert.deepEqual(recordWorldEditFeedback([],{ok:false,reason:'Placement space occupied'},10,{adjacent:null}),[]);
  assert.equal(sampleWorldEditFeedback([{kind:'blocked',cell:[1,NaN,3],start:0}],10).vertices.length,0);
  assert.equal(sampleWorldEditFeedback([],NaN).vertices.length,0);
  assert.equal(sampleWorldEditFeedback(null,10).vertices.length,0);
});

test('new edit clears expired history and never changes saved voxel payload',()=>{
  const result={ok:true,mode:'mine',cell:[2,3,4],previous:2,next:0};
  const before=JSON.stringify(result);
  let state=recordWorldEditFeedback([],result,0);
  state=recordWorldEditFeedback(state,{ok:true,mode:'place',cell:[4,3,2]},700);
  assert.equal(state.length,1);
  assert.equal(JSON.stringify(result),before);
});
