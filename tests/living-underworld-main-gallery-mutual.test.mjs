import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditMutualMainGalleryClearance} from '../src/living-underworld/main-gallery-mutual-clearance.mjs';
test('all 120 mutually safe pairs are checked',()=>{
 let count=0;
 const result=auditMutualMainGalleryClearance(179,0,0,{
  pairAuditor:()=>{count++;return {ok:true,rawCells:25};}
 });
 assert.equal(count,120);assert.equal(result.ok,true);
 assert.equal(result.examinedCells,3000);
});
test('refuses incomplete pair coverage',()=>{
 const result=auditMutualMainGalleryClearance(179,0,0,{maxPairs:119,
  pairAuditor:()=>({ok:true,rawCells:1})});
 assert.equal(result.ok,false);assert.equal(result.reason,'MUTUAL_GALLERY_PAIR_BUDGET');
});
test('captures intersections rather than ignoring them',()=>{
 let count=0;
 const result=auditMutualMainGalleryClearance(179,0,0,{pairAuditor:()=>{
  count++;return {ok:count!==3,rawCells:2,crossRouteBlockedCells:7,
   reason:'CROSS_ROUTE_SUPPORT_BLOCKS_CLEARANCE',examples:[]};
 }});
 assert.equal(result.ok,false);assert.equal(result.conflictingPairs,1);
 assert.equal(result.blockedCells,7);
});
test('refuses work-cell budget overflow',()=>{
 const result=auditMutualMainGalleryClearance(179,0,0,{maxCells:100,
  pairAuditor:()=>({ok:true,rawCells:51})});
 assert.equal(result.ok,false);assert.equal(result.reason,'MUTUAL_GALLERY_CELL_BUDGET');
});
test('refuses invalid auditor output',()=>{
 const result=auditMutualMainGalleryClearance(179,0,0,{pairAuditor:()=>({ok:true})});
 assert.equal(result.ok,false);assert.equal(result.reason,'INVALID_PAIR_AUDIT_RESULT');
});
test('rejects invalid seed or query budgets',()=>{
 assert.throws(()=>auditMutualMainGalleryClearance(2**40,0,0));
 assert.throws(()=>auditMutualMainGalleryClearance(179,0,0,{maxPairs:121}));
});
test('preserves original source grade refusal without misleading invalid-response label',()=>{
 const r=auditMutualMainGalleryClearance(179,0,0,{pairAuditor:()=>({
  ok:false,reason:'INDIVIDUAL_STAIR_UNSAFE',failures:['NONWALKABLE_STEP']
 })});
 assert.equal(r.ok,false);assert.equal(r.reason,'INDIVIDUAL_STAIR_UNSAFE');
 assert.deepEqual(r.pair,[0,2]);
});
