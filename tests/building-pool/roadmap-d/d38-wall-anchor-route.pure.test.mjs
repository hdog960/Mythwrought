import test from 'node:test';import assert from 'node:assert/strict';
import {solveD30IdealizedUnderslungTruss} from '../../../src/building-pool/roadmap-d/d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from '../../../src/building-pool/roadmap-d/d37-wall-pullout-fastener-contract.mjs';
import {deriveD38UnregisteredFaceCoupon,inspectD38FaceCouponClearance,
 inspectD38RootTensionCaptureRoutes,inspectD38CouponRayParity,screenD38ActualAnchorProvenance}
 from '../../../src/building-pool/roadmap-d/d38-wall-anchor-route-contract.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],
 palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
const make=(axis='x',side=1)=>{
 const math=solveD30IdealizedUnderslungTruss(13),member=math.members.find(m=>m.type==='diagonal-web'&&m.from==='T0'),
  start=[.5,6.5,.5],end=axis==='x'?[4,5.5,.5]:[.5,5.5,4],
  shape=deriveD31OriginalPack2Oblique(start,end,axis,beam),
  displaced=deriveD34LateralOriginalWeb(shape,axis,side),
  seat=findD32NonintrusiveWallSeat(displaced,[0,6,0]);
 assert.equal(seat.seatable,true);
 const socket=deriveD36IndependentRootSocket(seat.trimmed,[0,6,0],{plane:axis,palette}),
  force=screenD37OriginalRootTensilePath(socket,member,math,shape);
 const present=new Map([["0,0,0",{role:'foundation'}],["0,1,0",{role:'floor'}],
  ...[2,3,4,5,6].map(y=>[`0,${y},0`,{role:'wall'}]),["0,7,0",{role:'roof',asset:'live:wood'}]]);
 return {socket,force,source:{get:(x,y,z)=>present.get(`${x},${y},${z}`),nav:new Set()},present};
};
test('D38 authentic X/Z and both lateral directions keep source-painted coupon mesh and analytic AABB picking aligned, without granting a rated fastener',()=>{
 for(const axis of ['x','z'])for(const side of [-1,1]){
  const {socket}=make(axis,side),coupon=deriveD38UnregisteredFaceCoupon(socket,palette,{side});
  const parity=inspectD38CouponRayParity(coupon);
  assert.ok(parity.rayDelta<1e-5);
  assert.equal(coupon.sourcePaletteId,61);assert.equal(coupon.approvedBlockId,null);
  assert.equal(coupon.wallMechanicalCapture,false);assert.equal(coupon.socketMechanicalCapture,false);
  assert.equal(parity.sourceDerivedPaletteOnly,true);
  assert.equal(parity.actualOriginalPack2MeshUsed,false);
  assert.equal(coupon.mesh.colors[0],Math.fround(palette.metal[0]));
  assert.equal(coupon.mesh.indices.length,36);
  assert.throws(()=>deriveD38UnregisteredFaceCoupon(socket,{metal:[1,1,1]}, {side}),/palette/);
 }
});
test('D38 source-root original Y5/Y6 lateral solid neighbors veto a closed midheight wrap; a spatially vacant ring is only necessary, never a rated tensile anchor',()=>{
 const {socket,force,source,present}=make();
 present.set('0,6,1',{role:'wall'});present.set('1,5,0',{role:'partition'});
 const x=inspectD38RootTensionCaptureRoutes(socket,force,source);
 assert.deepEqual(x.sampledCourseRings.map(p=>p.originalSolidVetoes),[1,1]);
 assert.equal(x.anySingleCourseFourFaceRingSpatiallyVacant,false);
 assert.equal(x.genuineRatedExternalWrapOrMechanicalCapture,false);
 assert.equal(x.wallFaceOnlyPlateNoProvenTension,true);
 assert.equal(x.constructionAllowed,false);
 present.delete('0,6,1');present.delete('1,5,0');
 const free=inspectD38RootTensionCaptureRoutes(socket,force,source);
 assert.equal(free.anySingleCourseFourFaceRingSpatiallyVacant,true);
 assert.equal(screenD38ActualAnchorProvenance(free).constructionAllowed,false);
 assert.equal(screenD38ActualAnchorProvenance(free).realMechanicalCaptureAuthenticated,false);
});
test('D38 original wall/roof/WALK collision screen measures actual face-only plate and rejects an overlapping authored source without modifying it',()=>{
 const {socket,source,present}=make('z'),coupon=deriveD38UnregisteredFaceCoupon(socket,palette,{side:-1});
 const prior=[...present];const a=inspectD38FaceCouponClearance(coupon,source,socket);
 assert.equal(a.constructionAllowed,false);assert.equal(a.originalCellsChanged,0);
 const lo=coupon.box.min.map(Math.floor);present.set(lo.join(','),{role:'wall'});
 const b=inspectD38FaceCouponClearance(coupon,source,socket);
 assert.ok(b.originalClashes>=1);
 assert.equal(b.conservativeCouponSourceClear,false);
 assert.deepEqual([...present].slice(0,prior.length),prior);
 assert.throws(()=>inspectD38FaceCouponClearance({...coupon,format:'wrong'},source,socket),/original source/);
});
test('D38 invalid structural provenance, unrooted wall, counterfeit loads, and invented source-strength labels all fail closed',()=>{
 const {socket,force,source,present}=make();
 const route=inspectD38RootTensionCaptureRoutes(socket,force,source);
 assert.equal(screenD38ActualAnchorProvenance(route,{approvedFastenerOwner:'claimed',testReportPullout:'claimed'}).constructionAllowed,false);
 assert.equal(screenD38ActualAnchorProvenance(route).missingEvidence.length,10);
 assert.equal(screenD38ActualAnchorProvenance(route).normalizedActualRatedTensionCapacity,null);
 assert.throws(()=>inspectD38RootTensionCaptureRoutes(socket,{...force,constructionAllowed:true},source),/only genuine/);
 assert.throws(()=>inspectD38RootTensionCaptureRoutes(socket,{...force,tensileAxialForcePerUnknownUnitRoofLineLoad:-1},source),/only genuine/);
 present.delete('0,0,0');
 assert.throws(()=>inspectD38RootTensionCaptureRoutes(socket,force,source),/only genuine/);
 assert.throws(()=>screenD38ActualAnchorProvenance({...route,constructionAllowed:true}),/source-only/);
});
