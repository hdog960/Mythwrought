import test from 'node:test';import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {deriveD47UnregisteredCongruentSaddle} from '../../../src/building-pool/roadmap-d/d47-original-congruent-socket-saddle.mjs';
import {deriveD48UnregisteredSlopedContactPatch} from '../../../src/building-pool/roadmap-d/d48-original-saddle-patches-and-bridge.mjs';
import {inspectD45FractionalExteriorDogleg} from '../../../src/building-pool/roadmap-d/d45-source-blocker-and-face-egress.mjs';
import {deriveD49NormalDepartureAndElbow,inspectD49FullVolumeConnection,sampleD49StageTriangleRay} from '../../../src/building-pool/roadmap-d/d49-two-stage-normal-elbow.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function fixture(plane='x',side=1,rootAtEnd=false,height=6){
 const wall=[0,6,0],start=[.5,6.5,.5],end=plane==='x'?[4,5.5,.5]:[.5,5.5,4],
  a=deriveD31OriginalPack2Oblique(start,end,plane,beam),b=deriveD34LateralOriginalWeb(a,plane,side),seat=findD32NonintrusiveWallSeat(b,wall);
 assert.equal(seat.seatable,true);const socket=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,rootAtEnd,palette}),
  cells=new Map(Array.from({length:8},(_,y)=>[`0,${y},0`,{role:y===7?'roof':y===0?'foundation':y===1?'floor':'wall',asset:'live:wood'}])),
  src={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()},
  saddle=deriveD47UnregisteredCongruentSaddle(socket,side,palette),patch=deriveD48UnregisteredSlopedContactPatch(saddle,'center',palette),
  dog=inspectD45FractionalExteriorDogleg(wall,plane,rootAtEnd,src,socket.bounds,{side,height});
 return {wall,socket,source:src,cells,patch,dog};
}
test('D49 two real convex stages for X/Z both sides and both heights have genuine D48 positive contact and exact shared full-area endcaps, independent triangle rays',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1])for(const height of [5,6]){
  const {patch,dog}=fixture(plane,side,false,height);
  for(const normalLength of [.08,.16,.32,.48]){
   const t=deriveD49NormalDepartureAndElbow(patch,dog,palette,{normalLength});
   assert.ok(t.originalD48ContactArea>.008);assert.ok(Math.abs(t.elbowCapContactArea-t.originalD48ContactArea)<1e-10);
   assert.ok(t.outwardNormal>.0799);assert.equal(t.departure.mesh.indices.length,24);
   assert.equal(t.constructionAllowed,false);assert.equal(t.trueMechanicalFastening,false);
   assert.ok(sampleD49StageTriangleRay(t).maxRayDelta<1e-5);
  }
 }
});
test('D49 real D36 socket SAT and full original solid/WALK member veto is enforced for both thick stages, not a pointwise path',()=>{
 const {socket,source,cells,patch,dog,wall}=fixture(),t=deriveD49NormalDepartureAndElbow(patch,dog,palette);
 const a=inspectD49FullVolumeConnection(t,patch,dog,socket,source,wall);
 assert.equal(a.constructionAllowed,false);assert.equal(a.sourceOriginalWrites,0);
 assert.ok(Math.abs(a.positiveAreaStageToStageEndcap-patch.actualSourceContactArea)<1e-10);
 assert.equal(a.nonpenetratingOriginalSocket,a.socket===0);
 const p=t.departure.vertices[3].map(Math.floor);cells.set(p.join(','),{role:'wall',asset:'live:stone'});
 const b=inspectD49FullVolumeConnection(t,patch,dog,socket,source,wall);
 assert.ok(b.solid>=a.solid);assert.equal(b.physicalGeometryCandidateClear,false);
});
test('D49 rejects false evidence, fabricated palette, unbounded outward length, missing dogleg and claimed strength',()=>{
 const {patch,dog,socket,source,wall}=fixture('z',-1),two=deriveD49NormalDepartureAndElbow(patch,dog,palette);
 assert.throws(()=>deriveD49NormalDepartureAndElbow(patch,dog,{...palette,metal:[1,1,1]}),/immutable D48/);
 assert.throws(()=>deriveD49NormalDepartureAndElbow(patch,dog,palette,{normalLength:.65}),/immutable D48/);
 assert.throws(()=>deriveD49NormalDepartureAndElbow({...patch,constructionAllowed:true},dog,palette),/immutable D48/);
 assert.throws(()=>inspectD49FullVolumeConnection({...two,format:'fake'},patch,dog,socket,source,wall),/original physical/);
 assert.equal(inspectD49FullVolumeConnection(two,patch,dog,socket,source,wall).loadBearingMechanicalFastenerPresent,false);
});
test('D49 structurally fail closed even with clean geometric envelopes; never reinterpret a colored triangle or empty footing as installed',()=>{
 const {socket,source,wall,patch,dog}=fixture('x',-1),t=deriveD49NormalDepartureAndElbow(patch,dog,palette,{normalLength:.32});
 const v=inspectD49FullVolumeConnection(t,patch,dog,socket,source,wall);
 assert.equal(v.foundationAndRoofRatingPresent,false);assert.equal(v.loadBearingMechanicalFastenerPresent,false);
 assert.equal(v.constructionAllowed,false);assert.equal(v.positiveAreaOriginalSocketSlopedContact,patch.actualSourceContactArea);
 assert.equal(sampleD49StageTriangleRay(t).realRuntimePickingTested,false);
});
