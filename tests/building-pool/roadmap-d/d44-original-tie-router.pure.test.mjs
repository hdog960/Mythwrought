import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectD44FirstPrismBlocker,inspectD44AlternateOriginalOutboardTie}
 from '../../../src/building-pool/roadmap-d/d44-source-full-volume-tie-router.mjs';
const wall=[0,6,0],socket={min:[100,100,100],max:[101,101,101]};
function fixture({level5Barrier=false,bodyAtFront=false,blockVerticalAtFront=false}={}){
 const cells=new Map([['0,0,0',{role:'foundation'}],['0,1,0',{role:'floor'}],
  ...[2,3,4,5,6].map(y=>[`0,${y},0`,{role:'wall',asset:'live:wood'}]),
  ['0,7,0',{role:'roof',asset:'live:wood'}],
  ['2,6,0',{role:'partition',asset:'live:stone'}],
  ['1,6,1',{role:'wall',asset:'live:stone'}],
  ['1,6,-1',{role:'wall',asset:'live:stone'}]]);
 if(level5Barrier)for(const cell of ['2,5,0','1,5,1','1,5,-1'])cells.set(cell,{role:'wall',asset:'live:wood'});
 if(blockVerticalAtFront)for(const cell of ['1,5,0','1,4,0'])cells.set(cell,{role:'wall',asset:'live:wood'});
 const nav=new Set(bodyAtFront?['1,2,0']:[]),source={get:(x,y,z)=>cells.get(`${x},${y},${z}`),nav};
 return {cells,source,nav};
}
test('D44 physically identifies exact D43 Y6 first blockers by original voxel coordinates and role, with no world edits',()=>{
 const {cells,source}=fixture(),before=[...cells.entries()];
 const a=inspectD44FirstPrismBlocker([1,6,0],[2,6,0],source,{socketBounds:socket});
 assert.equal(a.sourceClear,false);assert.deepEqual(a.firstOriginalSolid?.at,[2,6,0]);
 assert.equal(a.firstOriginalSolid?.role,'partition');assert.equal(a.walkingBodyCollisionEvents,0);
 assert.equal(a.socketCollisionEvents,0);assert.equal(a.constructionAllowed,false);
 assert.deepEqual([...cells.entries()],before);
 assert.throws(()=>inspectD44FirstPrismBlocker([1,6,0],[3,6,0],source),/six-connected/);
});
test('D44 genuine bounded full-prism BFS can bypass ALL D43 Y6 L blockers using Y5 without inventing an installed footing',()=>{
 const {source}=fixture();
 const r=inspectD44AlternateOriginalOutboardTie(wall,'x',false,source,{socketBounds:socket,maxTieCandidates:12,maxSamples:5});
 assert.ok(r.originalD43NearestCandidatePositions>0);
 assert.equal(r.originalD43Y6LSourceClear,0);
 assert.equal(r.originalY6BFSReachableCandidatePositions,0);
 assert.ok(r.y5PermittedBFSReachableCandidatePositions>0);
 assert.ok(r.newlyReachableWithY5>0);
 assert.equal(r.sourceApprovedFootings,0);assert.equal(r.verifiedGeneratedTerrainGround,0);
 assert.equal(r.actualRatedFastenerConnections,0);assert.equal(r.constructionAllowed,false);
 assert.ok(r.baselineFirstSolidBlockedPlans>0);
 assert.ok(r.samples.some(x=>x.boundedY5ShortestPath?.fullThicknessEdges>0));
});
test('D44 Y4 is a distinct physical alternative if Y5 is obstructed; standing WALK or source obstruction always vetoes',()=>{
 const r=inspectD44AlternateOriginalOutboardTie(wall,'x',false,fixture({level5Barrier:true}).source,
  {socketBounds:socket,maxTieCandidates:12,maxSamples:8});
 assert.equal(r.originalY6BFSReachableCandidatePositions,0);
 assert.equal(r.y5PermittedBFSReachableCandidatePositions,0);
 assert.ok(r.newlyReachableWithY4>0);
 assert.equal(r.y4PermittedBFSReachableCandidatePositions,r.newlyReachableWithY4);
 const b=inspectD44AlternateOriginalOutboardTie(wall,'x',false,fixture({level5Barrier:true,bodyAtFront:true}).source,
  {socketBounds:socket,maxTieCandidates:12,maxSamples:1});
 assert.equal(b.y4PermittedBFSReachableCandidatePositions,0);
 const c=inspectD44AlternateOriginalOutboardTie(wall,'x',false,fixture({blockVerticalAtFront:true}).source,
  {socketBounds:socket,maxTieCandidates:12,maxSamples:1});
 assert.equal(c.y5PermittedBFSReachableCandidatePositions,0);
 assert.equal(c.y4PermittedBFSReachableCandidatePositions,0);
});
test('D44 genuine source reader rejects counterfeit original root, forged socket and oversize budgets and does not claim connector load strength',()=>{
 const {source,cells}=fixture();
 const good=inspectD44AlternateOriginalOutboardTie(wall,'x',false,source,{socketBounds:socket,maxTieCandidates:1});
 assert.equal(good.modelledColumnNeverPlaced,true);assert.equal(good.originalSourceGroundIsNotGeneratedTerrain,true);
 assert.equal(good.actualSocketInterfaceNotFastened,true);assert.equal(good.structuralRoofReleaseAccepted,false);
 assert.equal(good.worldCellWrites,0);
 assert.throws(()=>inspectD44AlternateOriginalOutboardTie(wall,'x',false,source,{socketBounds:socket,maxTieCandidates:13}),/budget/);
 assert.throws(()=>inspectD44AlternateOriginalOutboardTie(wall,'x',false,source,{socketBounds:{min:[0,0,0],max:[0,1,1]}}),/immutable original/);
 cells.set('0,7,0',{role:'roof',asset:'live:stone'});
 assert.throws(()=>inspectD44AlternateOriginalOutboardTie(wall,'x',false,source,{socketBounds:socket}),/immutable original/);
});
