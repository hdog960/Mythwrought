import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectD41RootFailureCertificate} from '../../../src/building-pool/roadmap-d/d41-finite-route-failure-certificate.mjs';
import {inspectD40SweptOriginalWallRoute} from '../../../src/building-pool/roadmap-d/d40-swept-exterior-capture.mjs';
const wall=[0,6,0];
function fixture(){const cells=new Map([['0,0,0',{role:'foundation'}],['0,1,0',{role:'floor'}],
 ...[2,3,4,5,6].map(y=>[`0,${y},0`,{role:'wall'}]),['0,7,0',{role:'roof',asset:'live:wood'}]]);
 const source={get:(x,y,z)=>cells.get(`${x},${y},${z}`),nav:new Set()};return {cells,source};
}
const settings={radius:4,levels:[3,4,5,6],halfWidth:.08};
function pair(source,props={}){
 const options={...settings,...props},n=inspectD41RootFailureCertificate(wall,'x',false,source,options),
  old=inspectD40SweptOriginalWallRoute(wall,'x',false,source,options);
 assert.equal(n.completeSweptLoop,old.finiteThicknessClosedWindingFound);
 assert.deepEqual(n.availableFrontHeights,old.frontHeights);
 assert.deepEqual(n.availableRearHeights,old.rearHeights);
 assert.equal(n.admissibleCenters,old.sourceClearVacantCenters);
 assert.equal(n.centerSolidVetoes,old.centerOriginalCellVetoes);
 assert.equal(n.centerWalkingVetoes,old.centerStandingBodyVetoes);
 assert.equal(n.centerSocketVetoes,old.centerSocketVetoes);
 assert.equal(n.constructionAllowed,false);assert.equal(n.worldWrites,0);
 return n;
}
test('D41 complete independently built finite-prism topology witnesses an original-style VACANT-wall fixture and agrees with genuine D40 algorithm',()=>{
 const {source}=fixture(),r=pair(source);
 assert.equal(r.rootFailureCategory,'complete-bounded-route');
 assert.equal(r.completeSweptLoop,true);assert.equal(r.sweptGraphFrontToRearConnected,true);
 assert.ok(r.finiteSweptEdgesTested>0);assert.ok(r.windingStates>0);
 assert.equal(r.noNewAnchorOrIndependentRearFastener,true);
});
test('D41 discriminates blocked physical front, blocked rear and both; counts original source barriers without editing source',()=>{
 const {source,cells}=fixture(),baseline=[...cells];
 for(const y of [5,6])cells.set(`1,${y},0`,{role:'wall'});
 let r=pair(source);assert.equal(r.rootFailureCategory,'front-source-entry-blocked');
 for(const y of [5,6])cells.delete(`1,${y},0`);
 for(const y of [5,6])cells.set(`-1,${y},0`,{role:'wall'});
 r=pair(source);assert.equal(r.rootFailureCategory,'rear-source-entry-blocked');
 for(const y of [5,6])cells.set(`1,${y},0`,{role:'wall'});
 r=pair(source);assert.equal(r.rootFailureCategory,'front-and-rear-source-entries-blocked');
 assert.equal(r.frontHeightReasons.length,2);assert.equal(r.rearHeightReasons.length,2);
 assert.deepEqual(baseline.slice(0,2),[...cells].slice(0,2));
});
test('D41 separates disconnected center graph from swept-edge-only obstruction, and one-sided corridor from nonzero winding proof',()=>{
 const {source,cells}=fixture();
 // The entirely occupied x=0 axis divides x-positive and x-negative
 // centers, regardless of whether a rear face is individually vacant.
 for(let z=-4;z<=4;z++)if(z!==0)for(let y=3;y<=6;y++)cells.set(`0,${y},${z}`,{role:'wall'});
 let r=pair(source);assert.equal(r.rootFailureCategory,'center-graph-disconnected');
 assert.equal(r.centerGraphFrontToRearConnected,false);
 for(let z=-4;z<=4;z++)if(z!==0)for(let y=3;y<=6;y++)cells.delete(`0,${y},${z}`);
 // Thin hypothetical floating blocker intersects *edges* across the x=1
 // plane but no voxel-center prism. This is a synthetic collision fixture,
 // not a source-authenticated Pack2 wall socket.
 const slab={min:[.99,2,-4.8],max:[1.01,8,4.8]};
 r=pair(source,{socketBounds:slab});
 assert.equal(r.rootFailureCategory,'swept-segment-graph-disconnected');
 assert.equal(r.centerGraphFrontToRearConnected,true);
 assert.equal(r.sweptGraphFrontToRearConnected,false);
 assert.ok(r.edgeSocketVetoes>0);
 // A one-sided detour can reach the original rear without encircling it.
 for(let x=-4;x<=4;x++)for(let z=-4;z<0;z++)for(let y=3;y<=6;y++)cells.set(`${x},${y},${z}`,{role:'wall'});
 r=pair(source);assert.equal(r.rootFailureCategory,'winding-or-closure-unavailable');
 assert.equal(r.sweptGraphFrontToRearConnected,true);
 assert.equal(r.completeSweptLoop,false);
});
test('D41 forged rooted source, missing roof, deleted original wall role, impossible budget or fictional source authority never create rated anchors',()=>{
 const {source,cells}=fixture();
 const r=pair(source);assert.equal(r.registeredSourceOwner,false);
 assert.equal(r.socketAABBIsConservativeNotExactConvex,true);
 assert.throws(()=>inspectD41RootFailureCertificate(wall,'x',false,source,{...settings,maxPrismCells:2}),/settings/);
 assert.throws(()=>inspectD41RootFailureCertificate(wall,'x',false,source,{...settings,radius:5}),/settings/);
 assert.throws(()=>inspectD41RootFailureCertificate(wall,'x',false,source,{...settings,levels:[3,3,6]}),/settings/);
 assert.throws(()=>inspectD41RootFailureCertificate(wall,'x',false,source,{...settings,halfWidth:0}),/settings/);
 cells.set('0,7,0',{role:'roof',asset:'live:stone'});
 assert.throws(()=>inspectD41RootFailureCertificate(wall,'x',false,source,settings),/authentic/);
 cells.set('0,7,0',{role:'roof',asset:'live:wood'});cells.delete('0,0,0');
 assert.throws(()=>inspectD41RootFailureCertificate(wall,'x',false,source,settings),/authentic/);
});
