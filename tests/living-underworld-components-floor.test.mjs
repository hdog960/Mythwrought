import test from 'node:test';
import assert from 'node:assert/strict';
import {auditBoundedCaveComponents} from '../src/living-underworld/bounded-components.mjs';
import {auditFullCityCandidate} from '../src/living-underworld/city-full-floor-audit.mjs';
import {planUnderworldRegion} from '../src/living-underworld/worldwide-network.mjs';
import {detachedCalibratedUnderworldAirAt} from '../src/living-underworld/depth-calibrated-proposal.mjs';

test('true 3-D face-adjacent floodfill rejects diagonally touching cavities',()=>{
 const sample=auditBoundedCaveComponents({origin:{x:0,y:0,z:0},size:{x:4,y:4,z:4},
  anchors:[{x:0,y:0,z:0},{x:1,y:0,z:0},{x:3,y:3,z:3}],
  airAt:(x,y,z)=>(z===0&&y===0&&(x===0||x===1))||
    (x===3&&y===3&&z===3)});
 assert.equal(sample.air,3);
 assert.equal(sample.componentCount,2);
 assert.equal(sample.largestAirComponent,2);
 assert.equal(sample.allAirAnchorsConnected,false);
 assert.deepEqual(sample.componentSizes,[2,1]);
 assert.equal(sample.wholeWorldConnectivityVerified,false);
});
test('bounded floodfill counts cavern air and refuses oversized or invalid windows',()=>{
 const good=auditBoundedCaveComponents({origin:{x:-16,y:-80,z:24},
  size:{x:16,y:8,z:16},airAt:()=>true,
  anchors:[{x:-16,y:-80,z:24},{x:-1,y:-73,z:39}]});
 assert.equal(good.componentCount,1);
 assert.equal(good.largestAirShare,1);
 assert.equal(good.allAirAnchorsConnected,true);
 const over=auditBoundedCaveComponents({origin:{x:0,y:0,z:0},
  size:{x:64,y:64,z:64},airAt:()=>true});
 assert.equal(over.ok,false);
 assert.equal(over.reason,'VOXEL_BUDGET_EXCEEDED');
 assert.throws(()=>auditBoundedCaveComponents({origin:{x:0,y:0,z:0},
  size:{x:0,y:3,z:3},airAt:()=>true}),/Invalid/);
});
test('actual calibrated candidate bounded 3-D voxels form a connected hub-local cavern',()=>{
 for(const seed of [179,-17])for(const [rx,rz] of [[0,0],[-128,64]]){
  const hub=planUnderworldRegion(seed,rx,rz).layers[1].hub;
  const q=auditBoundedCaveComponents({
   origin:{x:hub.x-8,y:hub.y-6,z:hub.z-8},
   size:{x:17,y:13,z:17},anchors:[hub],
   airAt:(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z)});
  assert.equal(q.ok,true);
  assert.equal(q.anchors[0].air,true);
  assert.ok(q.largestAirComponent>600);
  assert.ok(q.largestAirShare>.6);
 }
});
test('a complete city pad footprint has rock support, headroom and one four-connected build surface',()=>{
 let first=null;
 for(let rx=-4;rx<=4&&!first;rx++)for(let rz=-4;rz<=4&&!first;rz++)
  if(planUnderworldRegion(179,rx,rz).cityCandidate)first={rx,rz};
 assert.ok(first,'expected a reproducible city cavern');
 const site=auditFullCityCandidate(179,first.rx,first.rz);
 assert.equal(site.sitePresent,true);
 assert.equal(site.ok,true,JSON.stringify(site));
 assert.ok(site.footprintCount>4000);
 assert.equal(site.connectedFloorComponents,1);
 assert.equal(site.unusableCount,0);
 assert.equal(site.fullyExhaustiveWithinCandidateFootprint,true);
});
