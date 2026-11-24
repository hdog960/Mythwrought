import test from 'node:test';import assert from 'node:assert/strict';
import {d45SourceVoxelEntryFraction,inspectD45OriginalSourceLAnatomy,
 inspectD45FractionalExteriorDogleg,sampleD45OriginalPaletteFractionalRay} from '../../../src/building-pool/roadmap-d/d45-source-blocker-and-face-egress.mjs';
import {inspectD44FirstPrismBlocker} from '../../../src/building-pool/roadmap-d/d44-source-full-volume-tie-router.mjs';
const mk=(extra=[])=>{
 const cells=new Map([['0,0,0',{role:'foundation'}],['0,1,0',{role:'floor'}],
  ...[2,3,4,5,6].map(y=>[`0,${y},0`,{role:'wall',asset:'live:wood'}]),
  ['0,7,0',{role:'roof',asset:'live:wood'}],...extra]);
 return {cells,source:{get:(x,y,z)=>cells.get(`${x},${y},${z}`)??null,nav:new Set()}};
};
const socket={min:[.93,5.62,.36],max:[1.09,6.89,.64]};
test('D45 source physical entry fraction distinguishes initial penetration from real mid-segment first contact and never pretends a count is a ray',()=>{
 assert.equal(d45SourceVoxelEntryFraction([1,6,0],[2,6,0],[1,6,0]),0);
 assert.ok(Math.abs(d45SourceVoxelEntryFraction([1,6,0],[2,6,0],[2,6,0])-.42)<1e-9);
 assert.equal(d45SourceVoxelEntryFraction([1,6,0],[2,6,0],[2,6,1]),null);
 assert.throws(()=>d45SourceVoxelEntryFraction([1,6,0],[3,6,0],[2,6,0]),/unit/);
});
test('D45 first-blocked source Y6 L routes classify original solid role, Y6 position, true volume-contact distance and first-edge vs mid',()=>{
 const {source,cells}=mk([['2,6,0',{role:'beam',asset:'live:wood'}]]);
 const sample=inspectD44FirstPrismBlocker([1,6,0],[2,6,0],source,{socketBounds:socket});
 assert.equal(sample.sourceCollisionEvents,1);
 const audit=inspectD45OriginalSourceLAnatomy([0,6,0],'x',false,[3,6,0],source,socket);
 assert.equal(audit.twoSourceOriginalOrders.length,2);
 for(const route of audit.twoSourceOriginalOrders){
  assert.equal(route.class,'socket-adjacent-first-segment');
  assert.equal(route.representativeExactFirstContact.role,'beam');
  assert.deepEqual(route.representativeExactFirstContact.at,[2,6,0]);
  assert.ok(route.representativeExactFirstContact.firstFraction>.4);
  assert.equal(route.constructionAllowed,false);
 }
 assert.equal(audit.originalSourceEdits,0);
 assert.equal(cells.get('2,6,0').role,'beam');
});
test('D45 bounded fractional wall-face dogleg checks ENTIRE two physical prisms and protected side-route occupancy on X and Z roots',()=>{
 for(const plane of ['x','z'])for(const side of [-1,1]){
  const {source}=mk(),fresh=inspectD45FractionalExteriorDogleg([0,6,0],plane,false,source,socket,{side});
  assert.equal(fresh.sourceAndWalkingClear,true);
  assert.equal(fresh.path.length,3);assert.equal(fresh.fullPrismBounds.length,2);
  assert.equal(fresh.constructionAllowed,false);
  const mesh=sampleD45OriginalPaletteFractionalRay(fresh,{metal:[.29,.32,.33],base:[.4,.24,.17]});
  assert.equal(mesh.coloredTriangles,24);assert.ok(mesh.maxRayDisagreement<1e-5);
  assert.equal(mesh.actualRegisteredVariant,false);
  const blockedAt=plane==='x'?[1,6,side<0?-1:1]:[side<0?-1:1,6,1];
  const {source:blocked}=mk([[blockedAt.join(','),{role:'partition'}]]);
  const q=inspectD45FractionalExteriorDogleg([0,6,0],plane,false,blocked,socket,{side});
  assert.ok(q.originalSourceSolidCollisionEvents>=1);
  assert.equal(q.sourceAndWalkingClear,false);
 }
});
test('D45 no counterfeit original root, missing original Y7 weather wood, fake socket, wrong physically owned tolerance or unauthorized construction',()=>{
 const {source,cells}=mk();
 assert.throws(()=>inspectD45FractionalExteriorDogleg([0,6,0],'x',false,source,socket,{halfWidth:.01}),/bounded/);
 assert.throws(()=>inspectD45FractionalExteriorDogleg([0,6,0],'x',false,source,socket,{height:7}),/bounded/);
 assert.throws(()=>inspectD45OriginalSourceLAnatomy([0,6,0],'x',false,[0,6,0],source,socket),/support/);
 assert.throws(()=>inspectD45OriginalSourceLAnatomy([0,6,0],'x',false,[3,6,0],source,socket),/unexpectedly/);
 cells.delete('0,7,0');
 assert.throws(()=>inspectD45FractionalExteriorDogleg([0,6,0],'x',false,source,socket),/rooted wall/);
});
