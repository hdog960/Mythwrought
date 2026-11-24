import test from 'node:test';import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {deriveD47UnregisteredCongruentSaddle} from '../../../src/building-pool/roadmap-d/d47-original-congruent-socket-saddle.mjs';
import {deriveD48UnregisteredSlopedContactPatch} from '../../../src/building-pool/roadmap-d/d48-original-saddle-patches-and-bridge.mjs';
import {inspectD45FractionalExteriorDogleg} from '../../../src/building-pool/roadmap-d/d45-source-blocker-and-face-egress.mjs';
import {deriveD51DoglegActualBoundaryCap,deriveD51ArticulatedExteriorLink,
 inspectD51ArticulatedPhysicalPath,sampleD51OriginalPaletteTriangleParity}
 from '../../../src/building-pool/roadmap-d/d51-articulated-true-endface-link.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],
 palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function originalFixture(plane='x',side=1,height=6){
 const wall=[0,6,0],a=[.5,6.5,.5],b=plane==='x'?[4,5.5,.5]:[.5,5.5,4],
  shape=deriveD31OriginalPack2Oblique(a,b,plane,beam),shift=deriveD34LateralOriginalWeb(shape,plane,side),
  seat=findD32NonintrusiveWallSeat(shift,wall);
 assert.equal(seat.seatable,true);
 const socket=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,palette}),
  cells=new Map(Array.from({length:8},(_,y)=>[`0,${y},0`,
   {role:y===0?'foundation':y===1?'floor':y===7?'roof':'wall',asset:'live:wood'}])),
  source={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()},
  saddle=deriveD47UnregisteredCongruentSaddle(socket,side,palette),
  patch=deriveD48UnregisteredSlopedContactPatch(saddle,'center',palette),
  dog=inspectD45FractionalExteriorDogleg(wall,plane,false,source,socket.bounds,{side,height});
 assert.equal(dog.allPhysicalVolumesClear,true);
 return {wall,source,cells,socket,patch,dog};
}
test('D51 actual original dogleg physical FIRST axial and SECOND lateral outside faces are coplanar, inset and positive-area on both axes, both courses and both sides',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1])for(const height of [5,6]){
  const {dog}=originalFixture(plane,side,height);
  for(const entry of ['first-axial','second-lateral']){
   const cap=deriveD51DoglegActualBoundaryCap(dog,{entry});assert.ok(cap.contactArea>.001);
   for(const p of cap.triangle){assert.ok(Math.abs(p[cap.axis]-cap.face)<1e-10);
    for(let i=0;i<3;i++)assert.ok(p[i]>=cap.sourceOriginalAABB.min[i]-1e-8&&p[i]<=cap.sourceOriginalAABB.max[i]+1e-8);}
   assert.equal(cap.ownerUnregistered,true);assert.equal(cap.constructionAllowed,false);
  }
 }
});
test('D51 genuine cap rotation creates source-colored convex supporting hull triangles, two matched intermediate caps and independent mesh/ray parity',()=>{
 let accepted=0,rejected=0;
 for(const plane of ['x','z'])for(const side of [-1,1])for(const height of [5,6]){
  const {patch,dog}=originalFixture(plane,side,height);
  for(const entry of ['first-axial','second-lateral'])for(const hingeSide of [-1,1])for(const hingeAngle of [12,24]){
   try{
    const c=deriveD51ArticulatedExteriorLink(patch,dog,palette,{entry,hingeSide,hingeAngle});accepted++;
    assert.equal(c.stages.length,3);assert.equal(c.genuineSharedCapTriangles,2);
    assert.ok(c.originalPatchArea>.008&&c.realDoglegArea>.001);assert.ok(c.firstDeparture>.15);
    assert.equal(c.rotatedCaps,2);assert.equal(c.registeredFastener,false);
    assert.ok(c.stages.some(s=>s.triangleCount>=8));
    for(const s of c.stages){assert.ok(s.triangleCount>=6);assert.equal(s.mesh.positions.length,s.mesh.colors.length);}
    assert.ok(sampleD51OriginalPaletteTriangleParity(c).rayDelta<1e-5);
   }catch(e){if(!/nonconvex\/twisted union or degenerate non-supporting connector cap/.test(e.message))throw e;rejected++;}
  }
 }
 assert.ok(accepted>20);assert.ok(rejected>0);assert.equal(accepted+rejected,64);
});
test('D51 full true-convex SAT preserves socket and source veto, distinguishes real D45 exterior end contact from forbidden dogleg positive-volume penetration',()=>{
 const {wall,source,cells,socket,patch,dog}=originalFixture('z',-1,6),
  c=deriveD51ArticulatedExteriorLink(patch,dog,palette,{entry:'first-axial',hingeSide:-1,hingeAngle:12,offset:.24});
 const before=inspectD51ArticulatedPhysicalPath(c,patch,dog,socket,source,wall);
 assert.equal(before.endcapMatches,true);assert.ok(before.actualPositiveDoglegEndcapArea>.001);
 assert.equal(before.constructionAllowed,false);assert.equal(before.ownerRegistration,false);
 assert.equal(before.approvedFastener,false);assert.equal(before.sourceEdits,0);
 const at=c.stages[1].vertices[3].map(Math.floor),k=at.join(',');cells.set(k,{role:'wall',asset:'live:stone'});
 const after=inspectD51ArticulatedPhysicalPath(c,patch,dog,socket,source,wall);
 assert.ok(after.solid>=before.solid);assert.equal(after.constructionAllowed,false);
 assert.equal(after.realTensileLoadPath,false);assert.ok(before.dogleg>=0);
});
test('D51 invalid owner colors, fake geometry, invalid rotation, forged approval or original patch mutation fail closed',()=>{
 const {wall,source,socket,patch,dog}=originalFixture();
 assert.throws(()=>deriveD51ArticulatedExteriorLink(patch,dog,{...palette,metal:[0,0,0]}),/strict authentic/);
 assert.throws(()=>deriveD51ArticulatedExteriorLink(patch,dog,palette,{hingeAngle:179}),/strict authentic/);
 assert.throws(()=>deriveD51ArticulatedExteriorLink({...patch,constructionAllowed:true},dog,palette),/strict authentic/);
 assert.throws(()=>deriveD51DoglegActualBoundaryCap({...dog,format:'fake'}),/exact physical/);
 const c=deriveD51ArticulatedExteriorLink(patch,dog,palette,{entry:'first-axial',hingeSide:1,hingeAngle:12});
 assert.throws(()=>inspectD51ArticulatedPhysicalPath({...c,format:'fake'},patch,dog,socket,source,wall),/authenticated/);
 assert.equal(inspectD51ArticulatedPhysicalPath(c,patch,dog,socket,source,wall).ratedFoundation,false);
});
