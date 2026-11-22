import test from 'node:test';
import assert from 'node:assert/strict';
import {depthMeshKey,sectionWindow} from '../../src/depth.mjs';
import {skyIslandBodyRegions} from '../../src/floating-islands/sky-runtime-adapter.mjs';
import {inspectNativeDepthKey,planSkyNativeOwner} from '../../src/floating-islands/sky-native-owner.mjs';
const position={x:0,feet:35.5,z:0};
const sky=skyIslandBodyRegions(position).map(({cx,cz,section})=>({cx,cz,section}));
const surface=Array.from({length:25},(_,i)=>depthMeshKey(i%5-2,Math.floor(i/5)-2,0));
const resident=keys=>new Map(keys.map(k=>[k,{buffer:{key:k},count:36}]));
const plan=(wanted,extra={})=>planSkyNativeOwner({position,nativeWanted:wanted,
  nativeChunks:resident(wanted),skyCandidates:sky,worldToken:'seed179#0',
  rendererEpoch:11,nativeRevision:2,grant:{worldToken:'seed179#0',
  rendererEpoch:11,nativeRevision:2,nativeWanted:[...wanted],skyBudgetApproved:true},...extra});
test('original 2D surface and negative depth key grammar preserved',()=>{
  assert.equal(inspectNativeDepthKey('0,0').section,0);
  assert.equal(inspectNativeDepthKey('-750,875,-3').section,-3);
  assert.throws(()=>inspectNativeDepthKey('sky:0,0,0'));
});
test('27 original underground buffers cannot be evicted by sky planner',()=>{
  const wanted=[];for(const s of [-2,-1,0])for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)
    wanted.push(depthMeshKey(x,z,s));
  const r=planSkyNativeOwner({position:{x:0,feet:-5,z:0},nativeWanted:wanted,
    nativeChunks:resident(wanted),skyCandidates:sky,
    worldToken:'seed179#0',rendererEpoch:11,nativeRevision:2});
  assert.equal(r.mode,'native-depth-pass-through');
  assert.equal(r.desiredKeys.length,27);
  assert.deepEqual(sectionWindow(-5),[-1,0,-2]);
});
test('25 original surface slots block unapproved sky eviction',()=>{
  const r=plan(surface);assert.equal(r.readyForStage,false);
  assert.match(r.reason,/released enough/);
});
test('original renderer explicitly releases eight slots for full body at triple seam',()=>{
  const r=plan(surface.slice(0,17));
  assert.equal(r.mode,'sky-authorized');assert.equal(r.slots,25);
  assert.equal(r.skyCount,8);assert.equal(r.skyJobs.length,2);
  assert.equal(r.shadowPolicy.darkenGroundUnderIslands,false);
});
test('missing original grant or original source cell cannot silently authorize sky',()=>{
  const r=plan(surface.slice(0,17),{grant:null});
  assert.equal(r.readyForStage,false);
  const m=plan(surface.slice(0,17),{skyCandidates:sky.slice(1)});
  assert.equal(m.readyForStage,false);
});
