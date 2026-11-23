import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique,d31RayOwnerPreview,d31TransformOriginalPack2Mesh}
 from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb}
 from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {inspectD35OriginalSplitWebWallTermination,inspectD35UnratedLateralMemberPatch,
 probeD35IndependentOriginalPostBridge}
 from '../../../src/building-pool/roadmap-d/d35-owner-wall-termination-and-bridge.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]];
const post=[[.33,0,.33,.67,1,.67],[.23,0,.23,.77,.14,.77],[.27,.86,.27,.73,1,.73]];
const make=(axis,L=3)=>{
 const a=[.5,6.5,.5],b=axis==='x'?[L+.5,5.5,.5]:[.5,5.5,L+.5],
  end=axis==='x'?[L+.5,6.5,.5]:[.5,6.5,L+.5];
 return {a,g:deriveD31OriginalPack2Oblique(a,b,axis,beam),
  chord:deriveD31OriginalPack2Oblique(a,end,axis,beam)};
};
const original=changes=>{
 const cells=new Map([['0,5,0',{role:'wall',asset:'live:stone'}],
  ['0,6,0',{role:'wall',asset:'live:stone'}],...changes]);
 return {cells,src:{get:(x,y,z)=>cells.get(`${x},${y},${z}`),nav:new Set()}};
};
test('D35 tests BOTH source-owned sides; wall trim plus actual neighbor veto selects opposite side without changing original cells',()=>{
 for(const axis of ['x','z']){
  const {g}=make(axis),extra=axis==='x'?['2,5,1',{role:'wall'}]:['1,5,2',{role:'wall'}],
   {cells,src}=original([extra]),snapshot=[...cells.entries()],r=inspectD35OriginalSplitWebWallTermination(g,axis,src,{rootWall:[0,6,0]});
  assert.equal(r.trials.length,2);assert.equal(r.selected?.side,-1);
  assert.equal(r.trials[0].sourceClear,false);assert.equal(r.trials[1].sourceClear,true);
  assert.ok(r.selected.wallCutback>.4&&r.selected.wallCutback<=1.5);
  assert.equal(r.selected.posttrimSourceHits.total,0);assert.equal(r.selected.originalWalkProbeClashes,0);
  assert.equal(r.originalRootWall[1],6);assert.equal(r.physicalRatedWallTransfer,false);
  assert.equal(r.constructionAllowed,false);assert.deepEqual([...cells.entries()],snapshot);
  assert.equal(r.selected.geometry.sourceOwnerId,61);assert.ok(r.selected.geometry.ownerOBBs.length>=1);
 }
});
test('D35 refuses counterfeit Y5/Y6 root, and original WALK/protected roof are hard vetoes, not silent fallback placements',()=>{
 const {g}=make('x'),{src,cells}=original([]);
 const fake={...src,get:(x,y,z)=>x===0&&y===5&&z===0?null:src.get(x,y,z)};
 assert.throws(()=>inspectD35OriginalSplitWebWallTermination(g,'x',fake,{rootWall:[0,6,0]}),/wall termination/);
 assert.throws(()=>inspectD35OriginalSplitWebWallTermination(g,'x',src,{rootWall:[0,5,0]}),/wall coordinates/);
 assert.throws(()=>inspectD35OriginalSplitWebWallTermination({...g,sourceOwnerId:99},'x',src),/owner/);
 assert.throws(()=>inspectD35OriginalSplitWebWallTermination(g,'x',src,{sideOrder:[1,1]}),/source owner/);
 assert.throws(()=>inspectD35OriginalSplitWebWallTermination(g,'x',src,{maxCells:1}),/source owner/);
 // Any Y7 source roof intersection survives all lateral options and must veto.
 const shield={...src,get:(x,y,z)=>y===7&&x>=0&&x<5&&z>=-1&&z<=1?
   {role:'roof',asset:'live:wood'}:src.get(x,y,z)};
 const r=inspectD35OriginalSplitWebWallTermination(g,'x',shield,{rootWall:[0,6,0]});
 assert.equal(r.selected?.posttrimSourceHits.roofAndUpper??0,0);
 assert.deepEqual([...cells.keys()],['0,5,0','0,6,0']);
});
test('D35 exact source ID61 lateral touching faces are measurable but DO NOT create joint ratings; clipping can erase contact',()=>{
 for(const axis of ['x','z']){
  const {g,chord}=make(axis,4),left=deriveD34LateralOriginalWeb(g,axis,-1),
   right=deriveD34LateralOriginalWeb(g,axis,1);
  for(const side of [left,right]){
   const patch=inspectD35UnratedLateralMemberPatch(side,chord,axis);
   assert.ok(patch.summedUnratedSourceFaceArea>.001);
   assert.ok(patch.facePairs>=1);assert.equal(patch.memberPositiveVolumeOverlap,false);
   assert.equal(patch.positiveRatedTensionOrCompressionTransfer,false);
   assert.equal(patch.constructionAllowed,false);
  }
  const {g:small,chord:smallChord}=make(axis,3);
  const smaller=inspectD35UnratedLateralMemberPatch(deriveD34LateralOriginalWeb(small,axis,1),smallChord,axis);
  assert.equal(smaller.summedUnratedSourceFaceArea,0);
  assert.throws(()=>inspectD35UnratedLateralMemberPatch(left,chord,axis,{cutback:.9}),/input/);
 }
});
test('D35 canonical ID62 post must independently touch BOTH actual ID61 faces without physical overlap and without authored source collision; all empty/blocked bridges remain UNRATED',()=>{
 for(const axis of ['x','z']){
  const {a,g,chord}=make(axis,4),moved=deriveD34LateralOriginalWeb(g,axis,1),
   {src}=original([]),r=probeD35IndependentOriginalPostBridge(a,axis,1,post,chord,moved,src);
  assert.equal(r.trials.length,7);assert.equal(r.sourceOwnerId,62);
  assert.equal(r.anyRatedJoint,false);assert.equal(r.constructionAllowed,false);
  assert.equal(r.geometricallyPossibleSourcePostBridge,false);
  assert.ok(r.trials.every(x=>x.ratedFastenerPresent===false&&
     x.geometricallyPossibleTwoFaceBridge===false));
  assert.throws(()=>probeD35IndependentOriginalPostBridge(a,axis,1,[[0,0,0,1,1,1]],chord,moved,src),/canonical/);
  assert.throws(()=>probeD35IndependentOriginalPostBridge(a,axis,1,post,chord,moved,src,{offsets:[.1]}),/required/);
 }
});
