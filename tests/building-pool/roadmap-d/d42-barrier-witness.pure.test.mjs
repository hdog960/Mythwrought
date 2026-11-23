// D42 NEW pure tests only; no original-source import or world mutation.
import test from 'node:test';import assert from 'node:assert/strict';
import {inspectD42OriginalBarrierWitness} from '../../../src/building-pool/roadmap-d/d42-root-barrier-witness.mjs';
const wall=[0,6,0],opts={radius:4,levels:[3,4,5,6],halfWidth:.08};
function fixture(){const cells=new Map([['0,0,0',{role:'foundation'}],['0,1,0',{role:'floor'}],
 ...[2,3,4,5,6].map(y=>[`0,${y},0`,{role:'wall'}]),['0,7,0',{role:'roof',asset:'live:wood'}]]);
 return {cells,source:{get:(x,y,z)=>cells.get(`${x},${y},${z}`),nav:new Set()}};
}
function run(source,socketBounds=null){return inspectD42OriginalBarrierWitness(wall,'x',false,source,{...opts,socketBounds});}
test('D42 original-style vacant rooted source makes a zero-blocked-center path and preserves negative structural authority',()=>{
 const {cells,source}=fixture(),before=[...cells];const r=run(source);
 assert.equal(r.rootFailureCategory,'complete-bounded-route');
 assert.equal(r.hypotheticalMinimumBlockedCenters,0);
 assert.equal(r.minimumBlockedPositionsSample.length,0);
 assert.equal(r.minimumIsBlockedCENTERCountNotMinimalGraphCut,true);
 assert.equal(r.constructionAllowed,false);assert.equal(r.registeredConnectorId,null);
 assert.deepEqual([...cells],before);
});
test('D42 exact minimum blocked CENTER path counts the original solid cut separating front from rear without approving cuts',()=>{
 const {cells,source}=fixture();for(let z=-4;z<=4;z++)if(z!==0)for(let y=3;y<=6;y++)cells.set(`0,${y},${z}`,{role:'wall'});
 const before=[...cells];const r=run(source);
 assert.equal(r.rootFailureCategory,'center-graph-disconnected');
 assert.equal(r.centerGraphFrontRearConnected,false);
 assert.equal(r.hypotheticalMinimumBlockedCenters,1);
 assert.ok(r.exactFrontBlockingFrontierSites>0);
 assert.ok(r.frontierSourceSolidSites>0);
 assert.equal(r.hypotheticalBlockedCenterOriginalSolidCount,1);
 assert.equal(r.minimumBlockedPositionsSample[0].solid>0,true);
 assert.equal(r.protectedBarrierSitesAreNeverRemovalOrCarvingInstructions,true);
 assert.deepEqual([...cells],before);
});
test('D42 inaccessible rear is distinguished from source-clear but non-tensile tangential side face, and WALK obstructions remain barriers',()=>{
 const {cells,source}=fixture();for(const y of [5,6])cells.set(`-1,${y},0`,{role:'wall'});
 const r=run(source);
 assert.equal(r.rootFailureCategory,'rear-source-entry-blocked');
 assert.deepEqual(r.rearHeights,[]);
 assert.ok(r.clearSideFaceCandidates>0);
 assert.ok(r.frontReachableSideFaceCandidates>0);
 assert.ok(r.hypotheticalMinimumBlockedCenters>=1);
 assert.equal(r.sideFaceShearNotProofOfAxialRearRetention,true);
 // A real authored Y2 WALK standing body must not be silently treated as air.
 const {source:walkSource}=fixture();walkSource.nav.add('1,2,0');
 const w=run(walkSource);assert.ok(w.originalD41CenterSites<run(fixture().source).originalD41CenterSites);
 assert.equal(w.constructionAllowed,false);
});
test('D42 separate non-winding rear path has zero nonzero fundamental winding cycles and rejects forged wall, budgets and model geometry',()=>{
 const {cells,source}=fixture();for(let x=-4;x<=4;x++)for(let z=-4;z<0;z++)for(let y=3;y<=6;y++)cells.set(`${x},${y},${z}`,{role:'wall'});
 const r=run(source);
 assert.equal(r.rootFailureCategory,'winding-or-closure-unavailable');
 assert.equal(r.centerGraphFrontRearConnected,true);
 assert.equal(r.sweptFundamentalCycleWitness?.reachableRear,true);
 assert.equal(r.sweptFundamentalCycleWitness?.nonzeroWindingCycles,0);
 assert.equal(r.sweptFundamentalCycleWitness?.possibleNonzeroWinding,false);
 assert.throws(()=>inspectD42OriginalBarrierWitness(wall,'x',false,source,{...opts,radius:5}),/budgets|required/);
 assert.throws(()=>inspectD42OriginalBarrierWitness(wall,'x',false,source,{...opts,halfWidth:0}),/budgets|required/);
 cells.set('0,7,0',{role:'roof',asset:'live:stone'});
 assert.throws(()=>run(source),/authentic/);
});
