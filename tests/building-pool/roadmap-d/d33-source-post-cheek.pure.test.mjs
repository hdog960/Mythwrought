import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical,d31OBBsOverlap,d31PreviewHitsAABB}
 from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD33UnregisteredSourcePostCheek,auditD33ClearanceOnlyPinPort,
 sampleD33OriginalOwnerMeshAndRay,d33SourcePostFingerprint}
 from '../../../src/building-pool/roadmap-d/d33-owner-cheek-pin-geometry.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]];
const post=[[.33,0,.33,.67,1,.67],[.23,0,.23,.77,.14,.77],[.27,.86,.27,.73,1,.73]];
const at=[3.5,6.5,.5];
test('D33 source-verified ID62 post retains all original 3 AABBs, Y7 roof clearance and disjoint outboard cheeks, in X and Z truss planes',()=>{
 assert.equal(JSON.parse(d33SourcePostFingerprint()).length,3);
 for(const plane of ['x','z']){
  const l=deriveD33UnregisteredSourcePostCheek(at,plane,-1,post),r=deriveD33UnregisteredSourcePostCheek(at,plane,1,post);
  assert.equal(l.ownerOBBs.length,3);assert.equal(r.ownerOBBs.length,3);
  assert.equal(l.sourceOwnerId,62);assert.equal(l.sourcePartGeometryChanged,false);
  assert.equal(l.actualJointFastenerExists,false);
  assert.equal(l.constructionAllowed,false);
  assert.ok(l.bounds.max[1]<=7);
  assert.equal(d31PreviewHitsAABB(l,[3,7,0],[4,8,1]),false);
  assert.ok(l.ownerOBBs.every(x=>r.ownerOBBs.every(y=>!d31OBBsOverlap(x,y))));
  for(const cheek of [l,r])for(let i=0;i<3;i++){
   const box=post[i],obb=cheek.ownerOBBs[i];
   assert.deepEqual(obb.half,[(box[3]-box[0])/2,(box[4]-box[1])/2,(box[5]-box[2])/2]);
  }
 }
});
test('D33 physically occupied wall nodes are not accepted as new safe connections, forged materials and arbitrary offsets veto',()=>{
 assert.throws(()=>deriveD33UnregisteredSourcePostCheek(at,'x',1,[[0,0,0,1,1,1]]),/authentic/);
 assert.throws(()=>deriveD33UnregisteredSourcePostCheek(at,'x',1,post.map((p,i)=>i===1?[...p.slice(0,4),.28,...p.slice(5)]:p)),/authentic/);
 assert.throws(()=>deriveD33UnregisteredSourcePostCheek(at,'x',0,post),/authentic/);
 assert.throws(()=>deriveD33UnregisteredSourcePostCheek([0,7.5,0],'x',1,post),/elevation/);
 assert.throws(()=>deriveD33UnregisteredSourcePostCheek(at,'x',1,post,{offset:.15}),/authentic/);
 const h=deriveD31OriginalPack2Oblique([3.5,6.5,.5],[6.5,6.5,.5],'x',beam);
 assert.throws(()=>auditD33ClearanceOnlyPinPort({id:'a',worldAt:at},[
  {member:{from:'a',to:'b'},shape:h},{member:{from:'missing',to:'b'},shape:h}],post),/incident/);
});
test('D33 pin CSG keeps ID61/ID62 physically disjoint where possible, but cannot hallucinate rated axial transfer',()=>{
 const h=deriveD31OriginalPack2Oblique([3.5,6.5,.5],[6.5,6.5,.5],'x',beam),
  d=deriveD31OriginalPack2Oblique([3.5,6.5,.5],[6.5,5.5,.5],'x',beam),
  v=deriveD31OriginalPack2Vertical([3.5,6.5,.5],[3.5,5.5,.5],post);
 const m=[{member:{from:'a',to:'b'},shape:h},{member:{from:'a',to:'c'},shape:d},
  {member:{from:'a',to:'c'},shape:v}];
 const x=auditD33ClearanceOnlyPinPort({id:'a',worldAt:at},m,post,{cutback:.45});
 assert.equal(x.incidentCount,3);assert.equal(x.bothCandidateCheeks.length,2);
 assert.ok(x.remainingMemberIntersections<=x.originalSourceOwnerOverlappingPairs);
 assert.equal(x.actualJoinedConstructionApproved,false);
 assert.equal(x.noPositiveAreaRatedJointTransfer,true);
 assert.equal(x.sourceOwnerRegisteredVariant,false);
 assert.ok(x.clippedOriginalMembers.every(y=>y.approvedCompositeCollider===false));
 const blocked=auditD33ClearanceOnlyPinPort({id:'a',worldAt:at},m,post,{sourceCell:(ix,iy,iz)=>ix===3&&iy===6&&iz===0});
 assert.ok(blocked.originalAuthoredCellIntersections>=0);
 assert.throws(()=>auditD33ClearanceOnlyPinPort({id:'a',worldAt:at},m,post,{cutback:.65}),/invalid/);
 assert.throws(()=>auditD33ClearanceOnlyPinPort({id:'a',worldAt:at},m.slice(0,1),post),/invalid/);
});
test('D33 a rendered translational original-owner cheek and exact physical box ray coincide in a protected no-recolor probe',()=>{
 const pin=deriveD33UnregisteredSourcePostCheek(at,'x',-1,post);
 // Focused synthetic *front shaft* triangle test. The authentic complete original
 // Pack2 material/palette/triangle source is independently tested in CI.
 const source={positions:Float32Array.from([.33,0,.33,.67,0,.33,.67,1,.33,.33,1,.33]),
  colors:Float32Array.from(Array.from({length:4},()=>[.58,.32,.20]).flat()),
  indices:Uint16Array.from([0,1,2,0,2,3])};
 const a=sampleD33OriginalOwnerMeshAndRay(pin,source);
 assert.equal(a.originalSourceColorArrayPreserved,true);
 assert.ok(a.rayDelta<1e-5);
 assert.equal(a.trueLiveRuntimePickingAccepted,false);
});
