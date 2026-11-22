import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical,d31PreviewHitsAABB}
 from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {clipD32OriginalOwnerAxially,findD32NonintrusiveWallSeat,inspectD32UnratedPinPorts,d32RayClippedOwner}
 from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
const b=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]];
const post=[[.33,0,.33,.67,1,.67],[.23,0,.23,.77,.14,.77],[.27,.86,.27,.73,1,.73]];
test('D32 clips original three-box ID61 along its physical axis, preserving exact transverse member and ray source',()=>{
 const g=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,6.5,.5],'x',b),c=clipD32OriginalOwnerAxially(g,.5,.2);
 assert.equal(c.sourceOwnerId,61);assert.equal(c.ownerOBBs.length,2); // The original short end collar is correctly excluded by the seat trim.
 assert.ok(c.bounds.min[0]>=1-1e-8);assert.ok(c.bounds.max[0]<=3.3+1e-8);
 assert.equal(c.originalOwnerModified,false);assert.equal(c.approvedCompositeCollider,false);
 assert.equal(d31PreviewHitsAABB(c,[0,6,0],[1,7,1]),false);
 assert.ok(d32RayClippedOwner(c,[2,6.5,-1],[0,0,1],5)>0);
 assert.equal(d32RayClippedOwner(c,[.75,6.5,-1],[0,0,1],5),null);
 assert.throws(()=>clipD32OriginalOwnerAxially(g,2,2),/retain/);
 assert.throws(()=>clipD32OriginalOwnerAxially({...g,ownerOBBs:[g.ownerOBBs[0]]},0,0),/three-part/);
});
test('D32 original exterior wall is protected without carving source; horizontal chord and oblique diagonal remain UNRATED even when trimmed',()=>{
 const h=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,6.5,.5],'x',b);
 const d=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,5.5,.5],'x',b);
 assert.equal(d31PreviewHitsAABB(h,[0,6,0],[1,7,1]),true);
 assert.equal(d31PreviewHitsAABB(d,[0,6,0],[1,7,1]),true);
 for(const g of [h,d]){
  const s=findD32NonintrusiveWallSeat(g,[0,6,0]);
  assert.equal(s.seatable,true);assert.equal(s.sourceWallIntersectionUnresolved,false);
  assert.ok(s.cut>.4&&s.cut<=1.5);
  assert.equal(d31PreviewHitsAABB(s.trimmed,[0,6,0],[1,7,1]),false);
  assert.equal(d31PreviewHitsAABB(s.trimmed,[0,5,0],[1,6,1]),false);
  assert.equal(s.capWallFaceArea,0);assert.equal(s.positiveAreaWallTransferCertified,false);
  assert.equal(s.constructionAllowed,false);
 }
 assert.equal(findD32NonintrusiveWallSeat(h,[0,6,0],{maxCut:.1}).seatable,false);
 const opposite=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,6.5,.5],'x',b);
 assert.equal(findD32NonintrusiveWallSeat(opposite,[3,6,0],{atEnd:true}).seatable,true);
});
test('D32 typed ID62 vertical post remains separate and pin clearance cannot invent a rated joint',()=>{
 const x=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,6.5,.5],'x',b),
   y=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,5.5,.5],'x',b),
   v=deriveD31OriginalPack2Vertical([3.5,6.5,.5],[3.5,5.5,.5],post);
 const members=[{member:{from:'a',to:'b'},shape:x},{member:{from:'a',to:'c'},shape:y},
  {member:{from:'b',to:'c'},shape:v}];
 const scan=inspectD32UnratedPinPorts(members,[{id:'a'},{id:'b'},{id:'c'}],{cutback:.35});
 assert.equal(scan.members,3);assert.equal(scan.nodes,3);assert.equal(scan.pairs,3);
 assert.equal(scan.constructionAllowed,false);assert.equal(scan.proofOfNonoverlapAndRatedConnection,false);
 assert.ok(scan.overlappingResidualPairs<=scan.pairs);
 assert.throws(()=>inspectD32UnratedPinPorts(members,[{id:'a'},{id:'b'}]),/graph/);
 assert.throws(()=>inspectD32UnratedPinPorts(members,[{id:'a'},{id:'b'},{id:'c'}],{cutback:.8}),/invalid/);
 assert.throws(()=>inspectD32UnratedPinPorts(members,[{id:'a'},{id:'b'},{id:'c'}],{maxPairs:1}),/budget/);
});
test('D32 fails closed on wrong type and nonphysical wall source data',()=>{
 const h=deriveD31OriginalPack2Oblique([.5,6.5,.5],[3.5,6.5,.5],'x',b);
 assert.throws(()=>findD32NonintrusiveWallSeat(h,[0,6.5,0]),/integer/);
 assert.throws(()=>findD32NonintrusiveWallSeat(h,[0,6,0],{maxCut:4}),/budget/);
 assert.throws(()=>clipD32OriginalOwnerAxially({...h,sourceOwnerId:555},0,0),/authentic/);
});
