import test from 'node:test';
import assert from 'node:assert/strict';
import {planDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';
import {auditProposedSupportsAgainstMainGalleries}
 from '../src/living-underworld/combined-stair-footprints.mjs';
const plans=(seed,rx,rz,options)=>options.map(
 ([index,radius,cornerFlat,quarterTurns])=>
  planDetachedPedestrianSwitchback(seed,rx,rz,index,{
   radius,cornerFlat,quarterTurns
  })
);
test('individually sound ramps can obstruct a horizontal gallery despite passing cross-ramp checks',()=>{
 const q=auditProposedSupportsAgainstMainGalleries(179,-7,13,
  plans(179,-7,13,[
   [16,14,6,0],[25,14,6,3],[34,14,6,2],[35,14,6,2]
  ]));
 assert.equal(q.ok,false);
 assert.equal(q.reason,'PROPOSED_SUPPORT_BLOCKS_HORIZONTAL_GALLERY');
 assert.equal(q.pedestrianHorizontalPairsChecked,16);
 assert.ok(q.blockedCells>0);
 assert.ok(q.examples.some(x=>x.horizontalPairIndex>=0));
 assert.equal(q.worldChanged,false);
});
test('an actually clear sample keeps the original horizontal gallery clearance unobstructed',()=>{
 const q=auditProposedSupportsAgainstMainGalleries(179,0,0,
  plans(179,0,0,[
   [16,14,6,0],[25,14,6,2],[34,14,6,0],[35,14,6,0]
  ]));
 assert.equal(q.ok,true);
 assert.equal(q.blockedCells,0);
 assert.equal(q.pedestrianHorizontalPairsChecked,16);
 assert.ok(q.distinctGalleryClearanceCells>1000);
 assert.equal(q.physicallyTraversableInOriginalGame,false);
});
test('global horizontal clearance audit refuses budget exhaustion',()=>{
 const q=auditProposedSupportsAgainstMainGalleries(179,0,0,
  plans(179,0,0,[[16,14,6,0]]),{maxCells:1000});
 assert.equal(q.ok,false);
 assert.equal(q.reason,'GALLERY_FOOTPRINT_BUDGET');
 assert.equal(q.worldChanged,false);
});
test('invalid parameters never become successful main-gallery audits',()=>{
 assert.throws(()=>auditProposedSupportsAgainstMainGalleries(
  2147483648,0,0,[]),/Invalid/);
 assert.throws(()=>auditProposedSupportsAgainstMainGalleries(
  179,0,0,[]),/Invalid/);
});
