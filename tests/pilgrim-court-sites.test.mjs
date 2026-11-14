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

test('previously discovered sites are excluded before expensive terrain planning',()=>{
  const w=new VoxelWorld(179);
  const planned=[];
  const planner=(_w,x,z)=>{planned.push([x,z]);return {origin:[x,4,z],optIn:true};};
  const options={minDistance:48,maxDistance:80,step:8,maxCandidates:128,maxResults:2,planner};
  const initial=surveyPilgrimCourtSites(w,0,0,options);
  assert.equal(initial.length,2);
  const prior=initial.map(p=>[p.origin[0],p.origin[2]]);
  planned.length=0;
  const next=surveyPilgrimCourtSites(w,0,0,{...options,excludeSites:prior,exclusionRadius:48});
  assert.ok(next.every(p=>prior.every(([x,z])=>Math.hypot(x-p.origin[0],z-p.origin[2])>=48)));
  assert.ok(planned.every(([x,z])=>prior.every(([px,pz])=>Math.hypot(px-x,pz-z)>=48)));
  assert.deepEqual(surveyPilgrimCourtSites(w,0,0,{...options,excludeSites:prior,exclusionRadius:48}),next);
});
test('malformed planner results and invalid exclusion requests cannot produce sites',()=>{
  const w=new VoxelWorld(179);
  const opts={minDistance:48,maxDistance:64,step:8,maxCandidates:16};
  for(const planner of [()=>({origin:[999,4,999],optIn:true}),()=>({origin:[0,4,0],optIn:false}),()=>({origin:[0,4,0]})])
    assert.deepEqual(surveyPilgrimCourtSites(w,0,0,{...opts,planner}),[]);
  for(const excludeSites of [[[0]],[[0,'1']],Array.from({length:129},()=>[0,0])])
    assert.deepEqual(surveyPilgrimCourtSites(w,0,0,{...opts,excludeSites}),[]);
  assert.deepEqual(surveyPilgrimCourtSites(w,0,0,{...opts,exclusionRadius:0}),[]);
});
