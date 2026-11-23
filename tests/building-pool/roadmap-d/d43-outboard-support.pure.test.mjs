import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectD43TangentialWallFace,inspectD43IndependentOutboardSupport,
 sampleD43SourcePaletteTieSegment} from '../../../src/building-pool/roadmap-d/d43-source-backed-outboard-support.mjs';
const palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function model(){
 const present=new Map();present.set('0,0,0',{role:'foundation'});
 present.set('0,1,0',{role:'floor'});
 for(let y=2;y<=6;y++)present.set(`0,${y},0`,{role:'wall'});
 present.set('0,7,0',{role:'roof',asset:'live:wood'});
 return {present,src:{get:(x,y,z)=>present.get(`${x},${y},${z}`),nav:new Set()}};
}
test('D43 actual original side face normal is tangential to axial pullout, NEVER an independent rear retention claim',()=>{
 for(const plane of ['x','z'])for(const atEnd of [false,true]){
  const face={at:plane==='x'?[0,6,1]:[1,6,0],sourceClear:true,reachableFromFront:true};
  const v=inspectD43TangentialWallFace([0,6,0],plane,atEnd,face);
  assert.equal(v.normalTensionDot,0);assert.equal(v.frontReachable,true);
  assert.equal(v.rearFaceMechanicalRetentionProven,false);assert.equal(v.constructionAllowed,false);
 }
 assert.throws(()=>inspectD43TangentialWallFace([0,6,0],'x',false,
  {at:[1,6,0],sourceClear:true,reachableFromFront:true}),/side-face/);
});
test('D43 distinct empty exterior pylon space and an actual finite-thickness outboard tie are NOT a proven footing or rated load path',()=>{
 for(const plane of ['x','z']){
  const {src,present}=model(),before=[...present];
  const t=inspectD43IndependentOutboardSupport([0,6,0],plane,false,src);
  assert.ok(t.candidateOpenVerticalPylonEnvelopes>0);
  assert.ok(t.sourceClearExternalTieCorridors>0);
  assert.equal(t.sourceClearExternalTieCorridors,t.sourceClearYetNoActualFoundation);
  assert.equal(t.authenticatedNewFootings,0);assert.equal(t.authenticatedTensionConnections,0);
  assert.equal(t.constructionAllowed,false);assert.equal(t.worldWrites,0);
  assert.equal(t.originalD36SocketIsNeverSilentlyConnected,true);
  assert.ok(t.candidates.some(x=>x.tieCorridorSourceClear&&x.terrainFoundationVerified===false));
  assert.deepEqual([...present],before);
 }
});
test('D43 exact original source solid, WALK and rooted authored column are distinguished and never overwritten or counted as independent tensile ratings',()=>{
 const {src,present}=model();
 present.set('2,0,0',{role:'foundation'});present.set('2,1,0',{role:'floor'});
 for(let y=2;y<=6;y++)present.set(`2,${y},0`,{role:'column'});
 src.nav.add('2,2,2');
 present.set('1,6,0',{role:'wall'});
 const snapshot=[...present],out=inspectD43IndependentOutboardSupport([0,6,0],'x',false,src);
 assert.ok(out.unrelatedExistingAuthoredRootedPositions>=1);
 assert.ok(out.authoredStandingWALKVetoPositions>=1);
 assert.ok(out.authoredColumnSolidVetoPositions>=1);
 assert.equal(out.independentlyRatedExistingSupports,0);
 assert.equal(out.authenticatedTensionConnections,0);
 assert.deepEqual([...present],snapshot);
 assert.throws(()=>inspectD43IndependentOutboardSupport([0,6,0],'x',false,src,{radius:6}),/budget/);
 present.delete('0,0,0');
 assert.throws(()=>inspectD43IndependentOutboardSupport([0,6,0],'x',false,src),/rooted wall/);
});
test('D43 exact original ID61 palette-derived two-cell prism mesh and physical ray parity remain unregistered and fail closed on forged colors',()=>{
 const z=sampleD43SourcePaletteTieSegment([1,6,0],[2,6,0],palette);
 assert.equal(z.previewMeshTriangles,12);
 assert.ok(z.previewBytes>0&&z.physicalMeshRayDelta<1e-5);
 assert.equal(z.actualRegisteredFastenerAndCollider,false);
 assert.equal(z.constructionAllowed,false);
 assert.throws(()=>sampleD43SourcePaletteTieSegment([1,6,0],[2,6,0],{...palette,metal:[0,0,0]}),/palette/);
});
