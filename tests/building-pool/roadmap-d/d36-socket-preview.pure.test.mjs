// D36 pure physical screens; no fake source-building certification.
import test from 'node:test';import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket,d36SocketHitsAABB,d36SocketHitsOwner,rayD36Socket,previewD36PaletteAndRay}
 from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]];
const palette={base:[.40,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function shape(plane='x',side=1,atEnd=false){
 const a=[.5,6.5,.5],b=plane==='x'?[3.5,5.5,.5]:[.5,5.5,3.5],
  original=deriveD31OriginalPack2Oblique(a,b,plane,beam),moved=deriveD34LateralOriginalWeb(original,plane,side);
 const wall=atEnd?(plane==='x'?[3,6,0]:[0,6,3]):[0,6,0],
  seat=findD32NonintrusiveWallSeat(moved,wall,{atEnd});
 return {original,moved,wall,seat};
}
const source=(wall)=>({get:(x,y,z)=>x===wall[0]&&z===wall[2]&&y===6?{role:'wall',asset:'live:stone'}:null,
 nav:new Set()});
test('D36 independently derived two-face convex wall socket has actual nonzero wall+cut-face area and authentic owner RGB but remains unregistered',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1]){
  const {wall,seat}=shape(plane,side),connector=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,palette});
  assert.equal(connector.approvedPack2Variant,false);assert.equal(connector.realRatedJoint,false);
  assert.ok(connector.sourceOriginalFaceAreaWall>.001);
  assert.ok(Math.abs(connector.sourceOriginalCutFaceArea-.2304)<1e-8);
  assert.equal(connector.constructionAllowed,false);assert.ok(connector.faces.length>=5);
  const scan=probeD36OriginalSocket(connector,source(wall),seat.trimmed);
  assert.equal(scan.originalRootWallClashes,0);assert.equal(scan.originalY7RoofClashes,0);
  assert.equal(scan.memberPositiveVolumeOverlap,false);
  assert.equal(scan.constructionAllowed,false);
  const image=previewD36PaletteAndRay(connector);assert.ok(image.rayDelta<.00005);
  assert.ok(image.triangles>0&&image.bytes>0);
 }
});
test('D36 authentic wall remains solid: fail closed for neighboring source voxel, roof, player corridor and invalid source budgets',()=>{
 const {wall,seat}=shape(),connector=deriveD36IndependentRootSocket(seat.trimmed,wall,{palette});
 const s=source(wall),occupied={...s,get:(x,y,z)=>x===1&&y===6&&z===1?{role:'wall',asset:'live:stone'}:s.get(x,y,z)};
 const audit=probeD36OriginalSocket(connector,occupied,seat.trimmed);
 assert.equal(audit.constructionAllowed,false);
 assert.equal(audit.originalRootWallClashes,0);
 assert.throws(()=>probeD36OriginalSocket(connector,s,seat.trimmed,{maxCells:1}),/budget|query/);
 assert.equal(d36SocketHitsAABB(connector,[0,6,0],[1,7,1]),false);
 assert.equal(d36SocketHitsOwner(connector,seat.trimmed),false);
});
test('D36 exact-source provenance rejects counterfeit material, missing cut and forged wall geometry',()=>{
 const {wall,seat}=shape();
 assert.throws(()=>deriveD36IndependentRootSocket(seat.trimmed,wall,{palette:{base:[1,1,1]}}),/authentic/);
 assert.throws(()=>deriveD36IndependentRootSocket(seat.trimmed,[0,5,0],{palette}),/authentic/);
 assert.throws(()=>deriveD36IndependentRootSocket({...seat.trimmed,sourceOwnerId:97},wall,{palette}),/authentic/);
 assert.throws(()=>deriveD36IndependentRootSocket(seat.trimmed,[100,6,100],{palette}),/outside|wall/);
 const c=deriveD36IndependentRootSocket(seat.trimmed,wall,{palette});
 assert.throws(()=>rayD36Socket(c,[1,2,3],[0,0,0]),/invalid/);
 assert.throws(()=>d36SocketHitsAABB(c,[1,1,1],[0,0,0]),/invalid/);
});
test('D36 cap clipping is independent from original owner and original PALETTE; full original member mesh is not claimed as installed new connector',()=>{
 const {wall,seat}=shape('z',-1);const before=JSON.stringify(seat.trimmed.ownerOBBs),
  c=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane:'z',palette}),
  m=previewD36PaletteAndRay(c);
 assert.equal(JSON.stringify(seat.trimmed.ownerOBBs),before);
 assert.equal(m.actualSourceOwnedRuntimeMeshRegistered,false);
 assert.equal(m.derivedVisualEndFacesHaveNoApprovedUV,true);
 assert.equal(c.approvedEndCap,false);assert.equal(c.realMetalFastenerSourceUnknown,true);
});
