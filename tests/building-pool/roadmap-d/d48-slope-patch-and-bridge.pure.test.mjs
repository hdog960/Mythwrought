import test from 'node:test';import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {deriveD47UnregisteredCongruentSaddle,d47ConvexPositiveVolumeCollision}
 from '../../../src/building-pool/roadmap-d/d47-original-congruent-socket-saddle.mjs';
import {inspectD45FractionalExteriorDogleg}
 from '../../../src/building-pool/roadmap-d/d45-source-blocker-and-face-egress.mjs';
import {deriveD48UnregisteredSlopedContactPatch,inspectD48ExactConvexSourceAndOwnerHits,
 deriveD48UnregisteredSaddleDoglegBridge,inspectD48BridgeContactAndCollisions,sampleD48OriginalPaletteTriangleRay}
 from '../../../src/building-pool/roadmap-d/d48-original-saddle-patches-and-bridge.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],
 palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function make(plane='x',side=1){const wall=[0,6,0],p=[.5,6.5,.5],q=plane==='x'?[4,5.5,.5]:[.5,5.5,4],
 g=deriveD31OriginalPack2Oblique(p,q,plane,beam),shift=deriveD34LateralOriginalWeb(g,plane,side),
 seat=findD32NonintrusiveWallSeat(shift,wall);assert.equal(seat.seatable,true);
 const socket=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,palette}),
  cells=new Map(Array.from({length:8},(_,y)=>[`0,${y},0`,{role:y===7?'roof':y===0?'foundation':y===1?'floor':'wall',asset:'live:wood'}])),
  source={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()},
  saddle=deriveD47UnregisteredCongruentSaddle(socket,side,palette),
  dog=inspectD45FractionalExteriorDogleg(wall,plane,false,source,socket.bounds,{side,height:6});
 return {wall,socket,source,cells,saddle,dog};
}
test('D48 all four exact D47 inset-face barycentric subpatches retain real coplanar positive area and no socket intrusion for X/Z and two lateral sides',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1]){
  const {saddle,socket,source,wall}=make(plane,side);
  for(const kind of ['center','corner0','corner1','corner2']){
   const patch=deriveD48UnregisteredSlopedContactPatch(saddle,kind,palette);
   assert.ok(patch.actualSourceContactArea>.01&&patch.actualSourceContactArea<.03);
   assert.equal(patch.exactSocketFaceCoplanar,true);
   assert.equal(d47ConvexPositiveVolumeCollision(patch,socket),false);
   assert.equal(patch.constructionAllowed,false);
   assert.equal(patch.mesh.colors[0],Math.fround(.29));
   assert.ok(sampleD48OriginalPaletteTriangleRay(patch).rayDelta<1e-5);
   assert.equal(inspectD48ExactConvexSourceAndOwnerHits(patch,source,wall).originalWrites,0);
  }
 }
});
test('D48 exact original-source SAT collision witnesses retain authored coordinates, relative root, role, and immutable source map',()=>{
 const {saddle,socket,source,cells,wall}=make(),p=deriveD48UnregisteredSlopedContactPatch(saddle,'corner0',palette),old=[...cells];
 const hit=p.vertices[3].map(Math.floor);cells.set(hit.join(','),{role:'wall',asset:'live:stone'});
 const check=inspectD48ExactConvexSourceAndOwnerHits(p,source,wall);
 assert.ok(check.sourceSolidCount>=1);assert.ok(check.sourceWallCount>=1);
 assert.ok(check.blockerCoordinates.some(x=>x.at.join(',')===hit.join(',')));
 assert.equal(check.constructionAllowed,false);assert.equal(check.originalWrites,0);
 cells.delete(hit.join(','));assert.deepEqual([...cells],old);
 assert.equal(d47ConvexPositiveVolumeCollision(p,socket),false);
});
test('D48 full oblique triangular prism begins on actual outer saddle patch face and is physically screened, not a source-painted fake fastener',()=>{
 const {saddle,socket,dog,source,wall}=make(),patch=deriveD48UnregisteredSlopedContactPatch(saddle,'center',palette);
 const bridge=deriveD48UnregisteredSaddleDoglegBridge(patch,dog,palette);
 assert.ok(bridge.genuinePositiveAreaPatchEndContact>.01);
 assert.equal(bridge.vertices.length,6);assert.equal(bridge.mesh.indices.length/3,8);
 const result=inspectD48BridgeContactAndCollisions(bridge,patch,dog,socket,source,wall);
 assert.equal(result.actualLoadPathProven,false);assert.equal(result.realFastenerAuth,false);
 assert.equal(result.foundationCertified,false);assert.equal(result.constructionAllowed,false);
 assert.ok(Number.isFinite(bridge.outwardNormalDisplacement));
 assert.equal(sampleD48OriginalPaletteTriangleRay(patch).previewOnly,true);
});
test('D48 forged source owner, altered color, fabricated patch identity, and unsupported source acceptance all fail closed',()=>{
 const {saddle,source,wall,dog,socket}=make(),p=deriveD48UnregisteredSlopedContactPatch(saddle,'center',palette);
 assert.throws(()=>deriveD48UnregisteredSlopedContactPatch({...saddle,constructionAllowed:true},'center',palette),/original D47/);
 assert.throws(()=>deriveD48UnregisteredSlopedContactPatch(saddle,'side',palette),/original D47/);
 assert.throws(()=>deriveD48UnregisteredSlopedContactPatch(saddle,'center',{...palette,metal:[1,1,1]}),/original D47/);
 assert.throws(()=>inspectD48ExactConvexSourceAndOwnerHits({...p,format:'forged'},source,wall),/original authored/);
 assert.throws(()=>deriveD48UnregisteredSaddleDoglegBridge(p,{...dog,format:'other'},palette),/original D45/);
 assert.throws(()=>inspectD48BridgeContactAndCollisions({...p,format:'forged'},p,dog,socket,source,wall),/original D36/);
});
