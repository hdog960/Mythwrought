import test from 'node:test';
import assert from 'node:assert/strict';
import {createCTradeWaves3to5Handoffs} from '../../../src/building-pool/roadmap-c-trades/c-trade-wave3-5-settlement-handoff.mjs';
test('C7 source-backed butcher, jeweler and bookshop handoffs preserve exact measured geometry and false production flags',()=>{
 const a=createCTradeWaves3to5Handoffs(),b=createCTradeWaves3to5Handoffs();
 assert.deepEqual(a,b);
 assert.deepEqual(a.map(x=>x.id),[
  'r2:butcher:temperate:small:02','r2:jeweler:temperate:small:02','r2:bookshop:temperate:small:02'
 ]);
 assert.deepEqual(a.map(x=>x.sourceWitness.occupiedXYZVoxels),[2927,3043,3911]);
 assert.deepEqual(a.map(x=>x.actualFoundation.occupiedColumns),[708,682,933]);
 assert.deepEqual(a.map(x=>x.physicalWindows),[18,22,20]);
 assert.deepEqual(a.map(x=>x.trueSourceCourtyard.sourceAbsentColumns),[8,6,6]);
 for(const x of a){
  assert.match(x.sourceWitness.sha256,/^[0-9a-f]{64}$/);
  assert.equal(x.roadAndRoomEntrances.length,5);
  assert.equal(x.roadAndRoomEntrances[0].clearHeight,3);
  assert.equal(x.sourceOnly,true);assert.equal(x.productionApproved,false);
  assert.equal(x.worldRegistered,false);assert.equal(x.technicalRelease.allProtectedD4Accepted,false);
  assert.equal(x.settlementPlaced,false);assert.equal(x.merchantAIEnabled,false);
  assert.ok(Object.isFrozen(x));
 }
});
