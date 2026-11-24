import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveD31OriginalPack2Oblique} from '../../../src/building-pool/roadmap-d/d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb} from '../../../src/building-pool/roadmap-d/d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat} from '../../../src/building-pool/roadmap-d/d32-pack2-wall-seat-joint-ports.mjs';
import {deriveD36IndependentRootSocket} from '../../../src/building-pool/roadmap-d/d36-wall-socket-convex-preview.mjs';
import {deriveD47UnregisteredCongruentSaddle,auditD47SaddleSourceAndOwnerClearance,
 d47ConvexPositiveVolumeCollision,sampleD47SaddleTriangleParity,
 inspectD47FirstFractionalVoxelBarrier}
 from '../../../src/building-pool/roadmap-d/d47-original-congruent-socket-saddle.mjs';
const beam=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]];
const palette={base:[.4,.24,.17],grain:[.22,.13,.11],metal:[.29,.32,.33]};
function make(plane='x',side=1){
 const wall=[0,6,0],p=[.5,6.5,.5],q=plane==='x'?[4,5.5,.5]:[.5,5.5,4],
  g=deriveD31OriginalPack2Oblique(p,q,plane,beam),shifted=deriveD34LateralOriginalWeb(g,plane,side),
  seat=findD32NonintrusiveWallSeat(shifted,wall);
 assert.equal(seat.seatable,true);
 const socket=deriveD36IndependentRootSocket(seat.trimmed,wall,{plane,palette}),
  cells=new Map(Array.from({length:8},(_,y)=>[`${0},${y},${0}`,{role:y===7?'roof':y===0?'foundation':y===1?'floor':'wall',asset:'live:wood'}]));
 return {socket,wall,cells,source:{get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()}};
}
test('D47 authentic D36 X/Z side slopes: actual inset triangular face, positive area, true zero-volume penetration, independent source color triangle-ray parity',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1]){
  const {socket,source}=make(plane,side),s=deriveD47UnregisteredCongruentSaddle(socket,side,palette);
  assert.ok(s.actualSocketContactArea>.02&&s.actualSocketContactArea<s.actualFullSocketFaceArea);
  assert.equal(d47ConvexPositiveVolumeCollision(socket,s),false);
  assert.equal(s.genuineSocketPositiveVolumeOverlap,false);
  assert.equal(s.mesh.indices.length/3,8);
  assert.equal(s.mesh.colors[0],Math.fround(palette.metal[0]));
  const check=auditD47SaddleSourceAndOwnerClearance(s,source);
  assert.equal(check.authoredSolidClashes,0);assert.equal(check.authoredWalkClashes,0);
  assert.equal(check.geometricallyClearOfSourceAndOtherOwners,true);
  const parity=sampleD47SaddleTriangleParity(s);
  assert.ok(parity.rayDelta<1e-6);assert.equal(parity.physicalGameplayRaycastAccepted,false);
  assert.equal(s.constructionAllowed,false);assert.equal(s.realMechanicalCapture,false);
 }
});
test('D47 author solidity, standing WALK and hypothetical original-other-member collision prohibit fabricated ownership or approval',()=>{
 const {socket,source,cells}=make(),s=deriveD47UnregisteredCongruentSaddle(socket,1,palette),before=[...cells];
 const occupied=s.vertices[3].map(Math.floor);cells.set(occupied.join(','),{role:'wall',asset:'live:stone'});
 const result=auditD47SaddleSourceAndOwnerClearance(s,source);
 assert.ok(result.authoredSolidClashes>0);assert.equal(result.constructionAllowed,false);
 cells.delete(occupied.join(','));assert.deepEqual([...before],[...cells]);
 assert.throws(()=>deriveD47UnregisteredCongruentSaddle({...socket,constructionAllowed:true},1,palette),/immutable/);
 assert.throws(()=>deriveD47UnregisteredCongruentSaddle(socket,1,{...palette,metal:[1,1,1]}),/immutable/);
 assert.throws(()=>deriveD47UnregisteredCongruentSaddle(socket,0,palette),/immutable/);
 assert.throws(()=>deriveD47UnregisteredCongruentSaddle(socket,1,palette,{thickness:.4}),/immutable/);
});
test('D47 fractional physical source-first-contact finder reports genuine segment order and first entry, not first lexicographic block',()=>{
 const cells=new Map([['2,6,0',{role:'wall',asset:'live:wood'}],['4,6,0',{role:'wall',asset:'live:stone'}]]),
  source={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()},
  path={points:[[.5,6.5,.5],[3.5,6.5,.5],[5.5,6.5,.5]]};
 const hit=inspectD47FirstFractionalVoxelBarrier(path,source);
 assert.deepEqual(hit.firstOriginalVoxel.at,[2,6,0]);
 assert.equal(hit.firstOriginalVoxel.segmentIndex,0);
 assert.ok(hit.firstOriginalVoxel.fraction>0&&hit.firstOriginalVoxel.fraction<1);
 assert.ok(hit.totalSourceVolumeHits>=2);
 assert.equal(hit.constructionAllowed,false);
 const negative={points:[[5.5,6.5,.5],[3.5,6.5,.5],[.5,6.5,.5]]};
 const b=inspectD47FirstFractionalVoxelBarrier(negative,source);
 assert.deepEqual(b.firstOriginalVoxel.at,[4,6,0]);
 assert.equal(b.firstOriginalVoxel.segmentIndex,0);
});
test('D47 separated convex twins reject positive volume but preserve coplanar contact and reject fabricated routes',()=>{
 const {socket}=make(),s=deriveD47UnregisteredCongruentSaddle(socket,1,palette),
  shifted={...s,vertices:s.vertices.map(p=>p.map((x,i)=>x+(i===1?.002:0)))};
 assert.equal(s.actualSocketContactArea>0,true);
 assert.equal(sampleD47SaddleTriangleParity(s).constructionAllowed,false);
 assert.throws(()=>d47ConvexPositiveVolumeCollision({},s),/convex/);
 const empty={get:()=>null,nav:new Set()};
 assert.throws(()=>inspectD47FirstFractionalVoxelBarrier({points:[[0,6,0],[1,7,0]]},empty),/nonaxis/);
 assert.throws(()=>inspectD47FirstFractionalVoxelBarrier({points:[[0,6,0],[1,6,0]]},empty,{halfWidth:.2}),/genuine/);
 assert.equal(auditD47SaddleSourceAndOwnerClearance(s,empty).originalEdits,0);
 assert.equal(shifted.vertices.length,6);
});
