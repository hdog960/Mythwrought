import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {surveyPilgrimCourtSites,placeSurveyedPilgrimCourt} from '../src/pilgrim-court-sites.mjs';

test('seeded site ranking is deterministic, bounded and leaves world unchanged',()=>{
  const w=new VoxelWorld(179),before=w.save();
  const visited=[];
  const planner=(_w,x,z)=>{visited.push([x,z]);return {origin:[x,4,z],optIn:true};};
  const opts={minDistance:48,maxDistance:80,step:8,maxCandidates:64,maxResults:3,planner};
  const first=surveyPilgrimCourtSites(w,0,0,opts);
  const order=visited.map(p=>p.join(','));
  visited.length=0;
  assert.deepEqual(surveyPilgrimCourtSites(w,0,0,opts),first);
  assert.deepEqual(visited.map(p=>p.join(',')),order);
  assert.ok(visited.length<=64);
  assert.equal(first.length,3);
  assert.deepEqual(w.save(),before);
  for(const p of first){
    const d=Math.hypot(p.origin[0],p.origin[2]);
    assert.ok(d>=48&&d<=80);
  }
});
test('no suitable ground yields no sites, not a synthetic landmark',()=>{
  const w=new VoxelWorld(179),before=w.save();
  assert.deepEqual(surveyPilgrimCourtSites(w,0,0,{planner:()=>null}),[]);
  assert.deepEqual(w.save(),before);
});
test('invalid and unbounded survey requests are rejected',()=>{
  const w=new VoxelWorld(179);
  for(const options of [{maxDistance:10000},{minDistance:0},{step:0},
    {maxCandidates:99999},{maxResults:99},{planner:null}])
    assert.deepEqual(surveyPilgrimCourtSites(w,0,0,options),[]);
});
test('site results never imply automatic construction',()=>{
  const w=new VoxelWorld(179);
  const fake={origin:[0,4,0],optIn:true};
  assert.equal(placeSurveyedPilgrimCourt(w,fake),false);
});
