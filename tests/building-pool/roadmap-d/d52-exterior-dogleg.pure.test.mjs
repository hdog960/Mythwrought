import test from 'node:test';import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {deriveD47UnregisteredCongruentSaddle} from '../../../src/building-pool/roadmap-d/d47-original-congruent-socket-saddle.mjs';
import {deriveD48UnregisteredSlopedContactPatch} from '../../../src/building-pool/roadmap-d/d48-original-saddle-patches-and-bridge.mjs';
import {inspectD45FractionalExteriorDogleg} from '../../../src/building-pool/roadmap-d/d45-source-blocker-and-face-egress.mjs';
import {deriveD51ArticulatedExteriorLink} from '../../../src/building-pool/roadmap-d/d51-articulated-true-endface-link.mjs';
import {deriveD52ExteriorDoglegApproach,inspectD52FullOriginalVolume,sampleD52ExteriorMeshRay} from '../../../src/building-pool/roadmap-d/d52-exterior-terminal-approach.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],
 palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function fixture(plane='x',side=1,height=6){
 const wall=[0,6,0],p0=[.5,6.5,.5],p1=plane==='x'?[4,5.5,.5]:[.5,5.5,4],
  original=deriveD31OriginalPack2Oblique(p0,p1,plane,beam),
  shifted=deriveD34LateralOriginalWeb(original,plane,side),
  seat=findD32NonintrusiveWallSeat(shifted,wall);
 assert.equal(seat.seatable,true);
 const socket=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,palette});
 const cells=new Map(Array.from({length:8},(_,y)=>[`0,${y},0`,{role:y===0?'foundation':y===1?'floor':y===7?'roof':'wall',asset:'live:wood'}]));
 const source={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()};
 const saddle=deriveD47UnregisteredCongruentSaddle(socket,side,palette),
  patch=deriveD48UnregisteredSlopedContactPatch(saddle,'center',palette),
  dog=inspectD45FractionalExteriorDogleg(wall,plane,false,source,socket.bounds,{side,height});
 assert.equal(dog.allPhysicalVolumesClear,true);
 const make=(entry,hingeSide,hingeAngle)=>deriveD51ArticulatedExteriorLink(patch,dog,palette,{entry,hingeSide,hingeAngle});
 return {wall,source,cells,socket,patch,dog,make};
}
test('D52 actual original D45 X/Z both-side exterior endcaps and new staging cap preserve independent positive contact and TRUE inward final travel',()=>{
 let examined=0,invalid=0;
 for(const plane of ['x','z'])for(const side of [-1,1])for(const height of [5,6]){
  const f=fixture(plane,side,height);
  for(const entry of ['first-axial','second-lateral'])for(const hingeSide of [-1,1]){
   let old;try{old=f.make(entry,hingeSide,12)}catch(e){if(/nonconvex\/twisted/.test(e.message)){invalid++;continue;}throw e;}
   for(const outwardDistance of [.16,.32])for(const offset of [-.12,0,.12]){
    let x;try{x=deriveD52ExteriorDoglegApproach(old,f.dog,palette,{outwardDistance,offset});}
    catch(e){if(/non-supporting, zero-volume or nonconvex/.test(e.message)){invalid++;continue;}throw e;}
    examined++;
    assert.equal(x.stages.length,4);assert.ok(x.realSocketContactArea>.008&&x.realDoglegCapArea>.001);
    assert.equal(x.genuineSharedTriangleCaps,3);assert.ok(x.faceApproachedFromOutside);
    assert.ok(Math.abs(x.finalTravel+outwardDistance)<1e-7);
    const ray=sampleD52ExteriorMeshRay(x);assert.ok(ray.rayDelta<=ray.rayRoundingBound);
    assert.ok(ray.probeDistance<ray.originalExteriorSeparation);
    assert.equal(x.stages[3].mesh.positions.length,x.stages[3].mesh.colors.length);
    const check=inspectD52FullOriginalVolume(x,f.patch,f.dog,f.socket,f.source,f.wall);
    assert.equal(check.exactTerminus,true);assert.equal(check.exactSocket,true);
    assert.equal(check.constructionAllowed,false);assert.equal(check.sourceCellsModified,0);
   }
  }
 }
 assert.ok(examined>8,`expected real valid rotated exterior cap configurations, got ${examined}, invalid ${invalid}`);
});
test('D52 independent exterior terminal lands ON dogleg boundary with no positive-volume internal dogleg penetration in at least some tested fixtures',()=>{
 let valid=0,terminalClean=0;
 for(const plane of ['x','z'])for(const side of [-1,1]){
  const f=fixture(plane,side);
  for(const entry of ['first-axial','second-lateral'])for(const hingeSide of [-1,1])for(const angle of [12,24]){
   let old;try{old=f.make(entry,hingeSide,angle)}catch(e){if(/nonconvex\/twisted/.test(e.message))continue;throw e;}
   for(const distance of [.16,.32,.56]){
    let x;try{x=deriveD52ExteriorDoglegApproach(old,f.dog,palette,{outwardDistance:distance});}
    catch(e){if(/non-supporting, zero-volume or nonconvex/.test(e.message))continue;throw e;}
    valid++;const check=inspectD52FullOriginalVolume(x,f.patch,f.dog,f.socket,f.source,f.wall);
    if(check.rows[3].dogleg===0)terminalClean++;
    assert.ok(x.faceApproachedFromOutside);assert.equal(check.realEndcapArea,x.realDoglegCapArea);
   }
  }
 }
 assert.ok(valid>8);assert.ok(terminalClean>0,`terminal dogleg exterior failed, valid=${valid}`);
});
test('D52 original authored wall collision and WALK veto are genuinely measured, not overridden by cosmetic colors, and nothing is approved',()=>{
 const f=fixture('z',-1),old=f.make('first-axial',-1,12),link=deriveD52ExteriorDoglegApproach(old,f.dog,palette);
 const before=inspectD52FullOriginalVolume(link,f.patch,f.dog,f.socket,f.source,f.wall);
 const p=link.stages[2].vertices[4].map(Math.floor);f.cells.set(p.join(','),{role:'wall',asset:'live:stone'});
 const after=inspectD52FullOriginalVolume(link,f.patch,f.dog,f.socket,f.source,f.wall);
 assert.ok(after.solid>=before.solid);assert.equal(after.constructionAllowed,false);
 assert.equal(after.realFastenerRated,false);assert.equal(after.realFoundationRated,false);
 assert.equal(after.productionRendererColliderPwaAccepted,false);
 assert.equal(after.sourceMaterialIDsAdded,0);
});
test('D52 invalid source hull, false original palette, fake approval, or fabricated dogleg endcap fails closed',()=>{
 const f=fixture(),old=f.make('first-axial',1,12);
 assert.throws(()=>deriveD52ExteriorDoglegApproach(old,f.dog,{metal:[1,1,1]}),/D52 only/);
 assert.throws(()=>deriveD52ExteriorDoglegApproach({...old,format:'fake'},f.dog,palette),/D52 only/);
 assert.throws(()=>deriveD52ExteriorDoglegApproach(old,f.dog,palette,{outwardDistance:-.16}),/D52 only/);
 const x=deriveD52ExteriorDoglegApproach(old,f.dog,palette);
 assert.ok(sampleD52ExteriorMeshRay(x).rayDelta<1e-5);
 assert.throws(()=>inspectD52FullOriginalVolume({...x,format:'counterfeit'},f.patch,f.dog,f.socket,f.source,f.wall),/D52 only/);
 assert.equal(inspectD52FullOriginalVolume(x,f.patch,f.dog,f.socket,f.source,f.wall).constructionAllowed,false);
});
