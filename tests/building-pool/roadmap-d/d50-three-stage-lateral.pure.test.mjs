import test from 'node:test';import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {deriveD47UnregisteredCongruentSaddle} from '../../../src/building-pool/roadmap-d/d47-original-congruent-socket-saddle.mjs';
import {deriveD48UnregisteredSlopedContactPatch} from '../../../src/building-pool/roadmap-d/d48-original-saddle-patches-and-bridge.mjs';
import {inspectD45FractionalExteriorDogleg} from '../../../src/building-pool/roadmap-d/d45-source-blocker-and-face-egress.mjs';
import {inspectD50DoglegSlopedPlaneSeparation,deriveD50ThreeStageLateralCandidate,
 inspectD50SourceAndSocketContinuity,sampleD50OriginalPaletteMeshRay} from '../../../src/building-pool/roadmap-d/d50-lateral-three-stage-connector.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function fixture(plane='x',side=1,height=6){
 let wall=[0,6,0],start=[.5,6.5,.5],end=plane==='x'?[4,5.5,.5]:[.5,5.5,4];
 const member=deriveD31OriginalPack2Oblique(start,end,plane,beam), displaced=deriveD34LateralOriginalWeb(member,plane,side),
  seat=findD32NonintrusiveWallSeat(displaced,wall);assert.equal(seat.seatable,true);
 const socket=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,palette});
 const cells=new Map(Array.from({length:8},(_,y)=>[`0,${y},0`,{role:y===0?'foundation':y===1?'floor':y===7?'roof':'wall',asset:'live:wood'}]));
 const source={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()},
  saddle=deriveD47UnregisteredCongruentSaddle(socket,side,palette),patch=deriveD48UnregisteredSlopedContactPatch(saddle,'center',palette),
  dog=inspectD45FractionalExteriorDogleg(wall,plane,false,source,socket.bounds,{side,height});
 return {wall,socket,patch,dog,source,cells};
}
test('D50 real D36 face and original D45 full volumes for X/Z, both lateral sides/heights: three full convex stages and congruent caps',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1])for(const height of [5,6]){
  let {patch,dog}=fixture(plane,side,height),sep=inspectD50DoglegSlopedPlaneSeparation(patch,dog);
  assert.equal(sep.bySweptPrism.length,2);
  for(const lateralSign of [-1,1])for(const targetIndex of [0,2]){
   const c=deriveD50ThreeStageLateralCandidate(patch,dog,palette,{lateralSign,targetIndex});
   assert.equal(c.stages.length,3);assert.ok(c.realCapContactArea>.008);assert.equal(c.trueSharedEndcaps,2);
   assert.ok(c.signedFaceNormalTravel[0]>.15);assert.ok(c.signedFaceNormalTravel[1]>.079);
   assert.equal(c.registeredFastener,false);assert.equal(c.constructionAllowed,false);
   assert.ok(sampleD50OriginalPaletteMeshRay(c).maxRayDelta<1e-5);
  }
 }
});
test('D50 genuine full convex SAT rejects socket, authored wall and conservative standing WALK; no fake closure',()=>{
 const {wall,socket,patch,dog,source,cells}=fixture('x',1),c=deriveD50ThreeStageLateralCandidate(patch,dog,palette,{targetIndex:2});
 const x=inspectD50SourceAndSocketContinuity(c,patch,dog,socket,source,wall);
 assert.equal(x.constructionAllowed,false);assert.equal(x.materialStrengthRated,false);
 assert.equal(x.originalWorldWrites,0);assert.equal(x.positiveAreaElbowEndcaps,2);
 assert.equal(x.physicalGeometryCandidateClear,false);
 cells.set(c.stages[1].vertices[3].map(Math.floor).join(','),{role:'wall',asset:'live:stone'});
 const y=inspectD50SourceAndSocketContinuity(c,patch,dog,socket,source,wall);
 assert.ok(y.authoredSolid>=x.authoredSolid);assert.equal(y.physicalGeometryCandidateClear,false);
});
test('D50 alternate dogleg supports physical swept AABB rather than centerline-only shortcut',()=>{
 const {patch,dog}=fixture('z',-1),sep=inspectD50DoglegSlopedPlaneSeparation(patch,dog);
 for(const b of sep.bySweptPrism)assert.ok(b.maxSignedDistance>=b.minSignedDistance);
 const a=deriveD50ThreeStageLateralCandidate(patch,dog,palette,{lateralSign:1,targetIndex:0}),
  b=deriveD50ThreeStageLateralCandidate(patch,dog,palette,{lateralSign:-1,targetIndex:2});
 assert.notDeepEqual(a.entryPoint,b.entryPoint);assert.notDeepEqual(a.stages[1].bounds,b.stages[1].bounds);
 assert.equal(b.actualTensileRating,null);
});
test('D50 counterfeit palette, out-of-bounds geometry, forged source, and asserted owner do not receive admission',()=>{
 const {wall,socket,patch,dog,source}=fixture(),c=deriveD50ThreeStageLateralCandidate(patch,dog,palette);
 assert.throws(()=>deriveD50ThreeStageLateralCandidate(patch,dog,{...palette,metal:[0,0,0]}),/immutable original/);
 assert.throws(()=>deriveD50ThreeStageLateralCandidate(patch,dog,palette,{lateralReach:3}),/immutable original/);
 assert.throws(()=>deriveD50ThreeStageLateralCandidate({...patch,constructionAllowed:true},dog,palette),/immutable original/);
 assert.throws(()=>inspectD50SourceAndSocketContinuity({...c,format:'fake'},patch,dog,socket,source,wall),/genuine original/);
 assert.equal(inspectD50SourceAndSocketContinuity(c,patch,dog,socket,source,wall).ownerApprovedConnection,false);
});
