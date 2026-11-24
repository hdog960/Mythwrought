import test from 'node:test';import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {inspectD45FractionalExteriorDogleg} from '../../../src/building-pool/roadmap-d/d45-source-blocker-and-face-egress.mjs';
import {inspectD46ActualSocketDoglegGap,inspectD46FractionalExitToOutboard,
 probeD46FractionalPhysicalSegment,inspectD46OriginalPaletteExtensionRay,
 listD46OriginalUnprovenOutboardFootprints}
 from '../../../src/building-pool/roadmap-d/d46-socket-to-fractional-tie-contract.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]],
 palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
const make=(plane='x',side=1,rootAtEnd=false)=>{
 const wall=[0,6,0],cells=new Map([...Array(8)].map((_,y)=>[`0,${y},0`,
  {role:y===0?'foundation':y===1?'floor':y===7?'roof':'wall',asset:'live:wood'}]));
 const src={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()};
 const start=[.5,6.5,.5],end=plane==='x'?[4,5.5,.5]:[.5,5.5,4];
 const g=deriveD31OriginalPack2Oblique(start,end,plane,beam),
  q=deriveD34LateralOriginalWeb(g,plane,side),seat=findD32NonintrusiveWallSeat(q,wall);
 assert.equal(seat.seatable,true);
 const socket=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,palette});
 return {socket,src,cells,wall,plane,side};
};
test('D46 D36 original convex socket is genuinely separated from D45 full-prism dogleg; bounding-face tangent has ZERO positive-area source hull interface',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1]){
  const {socket,wall,src}=make(plane,side);
  for(const height of [5,6]){
   const dog=inspectD45FractionalExteriorDogleg(wall,plane,false,src,socket.bounds,{side,height});
   const r=inspectD46ActualSocketDoglegGap(socket,dog,src);
   assert.ok(r.signedAxialSocketToDoglegGap>.15&&r.signedAxialSocketToDoglegGap<.4);
   assert.ok(Math.abs(r.signedLateralOuterExtremeGap)<1e-7);
   assert.equal(r.socketActualExtremeFaceArea,0);
   assert.equal(r.socketExtremeHullVertexCount,2);
   assert.ok(r.doglegNeckTruePositiveEndFaceArea>.025);
   assert.equal(r.neckExactSocketPenetration,false);
   assert.equal(r.positiveAreaSocketToNeckAttachmentProven,false);
   assert.equal(r.constructionAllowed,false);
  }
 }
});
test('D46 full physical candidate neck refuses authored wall and WALK; testing a dogleg on the WRONG source-selected side is not an installed transition',()=>{
 const {socket,wall,src,cells}=make('x',1),dog=inspectD45FractionalExteriorDogleg(wall,'x',false,src,socket.bounds,{side:1,height:6});
 const a=inspectD46ActualSocketDoglegGap(socket,dog,src);
 assert.equal(a.neckSourceClear,true);assert.equal(a.originalCellsWritten,0);
 cells.set('1,6,0',{role:'wall',asset:'live:stone'});
 const b=inspectD46ActualSocketDoglegGap(socket,dog,src);
 assert.ok(b.neckOriginalSourceHits>0);assert.equal(b.neckSourceClear,false);
 cells.delete('1,6,0');
 assert.throws(()=>inspectD46ActualSocketDoglegGap(socket,{...dog,side:-1},src),/mismatch|socket|egress/);
 assert.throws(()=>inspectD46ActualSocketDoglegGap({...socket,constructionAllowed:true},dog,src),/authentic/);
 assert.throws(()=>probeD46FractionalPhysicalSegment([0,6,0],[1,7,0],src),/orthogonal/);
});
test('D46 exact full-thickness fractional continuation can reach a hypothetical outboard footprint in a controlled fixture, but fails closed on original solids and unknown foundation',()=>{
 for(const plane of ['x','z']){
  const {socket,src,cells,wall}=make(plane,1),dog=inspectD45FractionalExteriorDogleg(wall,plane,false,src,socket.bounds,{side:1,height:6});
  const site=plane==='x'?[3,6,2]:[2,6,3];
  const clear=inspectD46FractionalExitToOutboard(dog,site,src,{socket});
  assert.equal(clear.anyCompletelyClearExtension,true);
  assert.ok(clear.approaches.some(a=>a.fullExtensionPhysicalClear));
  assert.equal(clear.actualSocketToOutboardMechanicallyContinuous,false);
  assert.equal(clear.generatedWorldTerrainAndCavesCertified,false);
  const first=clear.approaches.find(a=>a.points.length>1);
  const parity=inspectD46OriginalPaletteExtensionRay(first.points[0],first.points[1],palette);
  assert.ok(parity.physicalAABBVsActualTriangleDelta<1e-5);
  assert.equal(parity.actualProductionPickingValidated,false);
  const blocked=plane==='x'?[2,6,2]:[2,6,2];
  cells.set(blocked.join(','),{role:'wall',asset:'live:wood'});
  const q=inspectD46FractionalExitToOutboard(dog,site,src,{socket});
  assert.ok(q.approaches.some(a=>a.sourceSolidIntersections>0));
  assert.equal(q.constructionAllowed,false);
 }
});
test('D46 exact D43-style original source footprint recheck does not misrepresent author Y0/Y1 vacancy as generated terrain foundation, rejects counterfeit owner and false RGB',()=>{
 const {wall,src,socket,cells}=make('x',1),ledger=listD46OriginalUnprovenOutboardFootprints(wall,'x',false,src,socket,{limit:8});
 assert.ok(ledger.prospectiveSites.length>0&&ledger.prospectiveSites.length<=8);
 assert.equal(ledger.geologicalSupportVerified,false);
 assert.equal(ledger.constructionAllowed,false);
 const p=ledger.prospectiveSites[0].at;
 cells.set(`${p[0]},0,${p[2]}`,{role:'foundation'});
 const b=listD46OriginalUnprovenOutboardFootprints(wall,'x',false,src,socket,{limit:8});
 assert.equal(b.constructionAllowed,false);
 assert.throws(()=>listD46OriginalUnprovenOutboardFootprints(wall,'x',false,src,{...socket,format:'fake'}),/genuine original/);
 assert.throws(()=>inspectD46OriginalPaletteExtensionRay([0,6,0],[1,6,0],{metal:[1,1,1]}),/source/);
 assert.throws(()=>inspectD46FractionalExitToOutboard({format:'forged'},[3,6,2],src),/authentic/);
});
