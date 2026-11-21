import test from 'node:test';
import assert from 'node:assert/strict';
import {auditCaveCenterline,auditRegionNetworkContinuity,auditProposedSurfaceConnection}
 from '../src/living-underworld/physical-connectivity-audit.mjs';
import {planUnderworldSurfaceEntrance} from '../src/living-underworld/surface-entrance-proposal.mjs';

test('six-connected cave path fails closed on a single physically sealed route voxel',()=>{
 const air=(x,y,z)=>!(x===5&&y===0&&z===0);
 const bad=auditCaveCenterline({x:0,y:0,z:0},{x:10,y:0,z:0},air);
 assert.equal(bad.ok,false);assert.equal(bad.reason,'SEALED_CENTERLINE');
 const good=auditCaveCenterline({x:0,y:0,z:0},{x:10,y:0,z:0},()=>true);
 assert.equal(good.ok,true);assert.equal(good.faceSteps,10);
 assert.throws(()=>auditCaveCenterline({x:0,y:0,z:0},{x:10,y:0,z:0},null),/Invalid/);
});
test('six-connected cave path rejects deliberately disconnected diagonal-only voxels',()=>{
 const diagonal=(x,y,z)=>x===y&&z===0;
 const bad=auditCaveCenterline({x:0,y:0,z:0},{x:8,y:8,z:0},diagonal);
 assert.equal(bad.ok,false);assert.equal(bad.reason,'NO_FACE_CONNECTED_STEP');
});
test('world network tunnels physically pass through shared portals and depth links across far coordinates',()=>{
 let routes=0,steps=0;
 for(const seed of [179,-17,2026])for(const [rx,rz] of [[0,0],[-7,13],[300,-302],[-300,250],[1,-1]]){
  const q=auditRegionNetworkContinuity(seed,rx,rz);
  assert.equal(q.pass,true,JSON.stringify(q.failures));
  assert.equal(q.routesChecked,52);
  routes+=q.routesChecked;steps+=q.physicalVoxelRouteChecks;
 }
 assert.equal(routes,780);assert.ok(steps>40000);
});
test('detached surface gallery has face-connected voxel air throughout the proposed entrance',()=>{
 for(const seed of [179,2026])for(const [rx,rz] of [[0,0],[-300,150]]){
  const proposal=planUnderworldSurfaceEntrance(seed,rx,rz,{
   surfaceHeightAt:()=>8,biomeAt:()=> 'plains'});
  assert.equal(proposal.ok,true);
  const r=auditProposedSurfaceConnection(seed,proposal);
  assert.equal(r.pass,true,JSON.stringify(r.failures));
  assert.equal(r.segments,2);
  assert.equal(r.protectedLiveM7CellsNotChecked,true);
 }
});
