// NEW D37 ONLY — exact D36 source geometry, force sign and conservative original API contract.
import test from 'node:test';import assert from 'node:assert/strict';
import {solveD30IdealizedUnderslungTruss} from '../../../src/building-pool/roadmap-d/d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {inspectD37ExactWallAndWebCaps,screenD37OriginalRootTensilePath,inspectD37ConservativeOriginalBodyAdapter}
 from '../../../src/building-pool/roadmap-d/d37-wall-pullout-fastener-contract.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],
 palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
const make=(axis='x',side=1)=>{
 const statics=solveD30IdealizedUnderslungTruss(13),member=statics.members.find(m=>m.from==='T0'&&m.type==='diagonal-web'),
  start=[.5,6.5,.5],end=axis==='x'?[4,5.5,.5]:[.5,5.5,4],
  shape=deriveD31OriginalPack2Oblique(start,end,axis,beam),
  moved=deriveD34LateralOriginalWeb(shape,axis,side),wall=[0,6,0],seat=findD32NonintrusiveWallSeat(moved,wall);
 if(!seat.seatable)throw Error('original compact fixture wall source cannot seat');
 return {socket:deriveD36IndependentRootSocket(seat.trimmed,wall,{plane:axis,palette}),member,statics,shape};
};
test('D37 independent actual convex source cap planes/areas: X/Z and lateral ±; geometric contact does not permit tensile fastener claims',()=>{
 for(const axis of ['x','z'])for(const side of [1,-1]){
  const {socket}=make(axis,side),r=inspectD37ExactWallAndWebCaps(socket);
  assert.ok(Math.abs(r.actualMeasuredWallFaceArea-.018)<1e-8);
  assert.ok(Math.abs(r.actualMeasuredWebFaceArea-.2304)<1e-8);
  assert.equal(r.twoPositiveAreaGeometryFaces,true);
  assert.equal(r.independentWallAnchorProven,false);
  assert.equal(r.ratedFastenerStrengthKnown,false);
  assert.equal(r.constructionAllowed,false);
  assert.throws(()=>inspectD37ExactWallAndWebCaps({...socket,sourceOriginalFaceAreaWall:.5}),/forged/);
  assert.throws(()=>inspectD37ExactWallAndWebCaps({...socket,sourceOriginalCutFaceArea:.02}),/forged/);
  assert.throws(()=>inspectD37ExactWallAndWebCaps({...socket,wallCap:socket.wallCap.map(p=>p.map((v,i)=>i===(axis==='x'?0:2)?v+.1:v))}),/plane/);
  assert.throws(()=>inspectD37ExactWallAndWebCaps({...socket,constructionAllowed:true}),/UNREGISTERED/);
 }
});
test('D37 D30 original normalized root members are all TENSILE, require separate pullout anchors and cannot use compression wall bearing',()=>{
 for(const axis of ['x','z']){
  const {socket,member,statics,shape}=make(axis),r=screenD37OriginalRootTensilePath(socket,member,statics,shape);
  assert.ok(r.tensileAxialForcePerUnknownUnitRoofLineLoad>0);
  assert.ok(r.outwardFromUnmodifiedWallForcePerUnknownLineLoad>0);
  assert.ok(r.necessaryWallAnchorTensionStressCoefficient>r.necessaryWebCutTensionStressCoefficient);
  assert.equal(r.requiredTransferMode,'tensile anchorage, not compressive wall contact');
  assert.equal(r.authenticatedRatedConnectionEdges,0);
  assert.equal(r.requiredEvidence.length,9);
  assert.equal(r.passesPhysicalStructuralApproval,false);
  assert.equal(r.constructionAllowed,false);
  assert.throws(()=>screenD37OriginalRootTensilePath(socket,{...member,normalizedAxialForce:-5},statics,shape),/non-original|non-tensile/);
  assert.throws(()=>screenD37OriginalRootTensilePath(socket,member,{...statics,roofSupportCertified:true},shape),/non-original|non-tensile/);
  assert.throws(()=>screenD37OriginalRootTensilePath(socket,member,statics,{start:shape.end,end:shape.start}),/orientation/);
 }
});
test('D37 conservative AABB adapter uses exact original inspectBodyFit signature but is never an approved convex registry entry',()=>{
 const {socket}=make();let called=0;const faithful=(body,getShape,options)=>{
  called++;assert.equal(options.maxCells,32);
  assert.equal(body.length,6);
  const lo=body.slice(0,3).map(Math.floor),hi=body.slice(3).map(x=>Math.ceil(x)-1);
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
   const s=getShape(x,y,z);if(!s)continue;
   for(const b of s.boxes){if([0,1,2].every((i)=>body[i]<b[i+3]+[x,y,z][i]&&body[i+3]>b[i]+[x,y,z][i]))return {fits:false,cell:[x,y,z]};}
  }return {fits:true,cell:null};
 };
 const clear=inspectD37ConservativeOriginalBodyAdapter(socket,[1.2,2,.2,1.8,4.5,.8],faithful);
 assert.equal(clear.conservativeAABBBodyFits,true);
 const inside=[socket.bounds.min[0]-.1,socket.bounds.min[1]-.1,socket.bounds.min[2]-.1,
  socket.bounds.max[0]+.1,socket.bounds.max[1]+.1,socket.bounds.max[2]+.1];
 const blocked=inspectD37ConservativeOriginalBodyAdapter(socket,inside,faithful);
 assert.equal(blocked.conservativeAABBBodyFits,false);assert.equal(blocked.passedForConstruction,false);
 assert.equal(called,2);
 assert.throws(()=>inspectD37ConservativeOriginalBodyAdapter(socket,inside,()=>({lies:true})),/counterfeit/);
});
test('D37 no forged construction rating, non-root graph, invalid AABB or preview metadata can silently authorize a structural connection',()=>{
 const {socket,statics,member,shape}=make();
 assert.throws(()=>screenD37OriginalRootTensilePath({...socket,realRatedJoint:true},member,statics,shape),/UNREGISTERED/);
 assert.throws(()=>screenD37OriginalRootTensilePath(socket,{...member,from:'B1'},statics,shape),/non-original|non-tensile/);
 assert.throws(()=>screenD37OriginalRootTensilePath(socket,member,statics,{start:[0,0,0],end:[0,0,0]}),/orientation|collapsed/);
 assert.throws(()=>inspectD37ConservativeOriginalBodyAdapter(socket,[1,2,3,0,0,0],()=>({fits:true})),/AABB/);
});
