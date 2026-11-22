import test from 'node:test';
import assert from 'node:assert/strict';
import {planSafeSkyResidency} from '../../src/floating-islands/sky-body-residency.mjs';
import {skyIslandBodyRegions} from '../../src/floating-islands/sky-runtime-adapter.mjs';
const position={x:0,feet:35.5,z:0};
const mandatory=skyIslandBodyRegions(position);
const sky=mandatory.map(({cx,cz,section})=>({cx,cz,section}));
const ground=Array.from({length:25},(_,i)=>({cx:i%5-2,cz:Math.floor(i/5)-2}));
test('eight real sky regions at x/z/Y triple seam fit under 25 shared GPU slots',()=>{
  const r=planSafeSkyResidency({position,ground,sky,residentKeys:[]});
  assert.equal(r.requiredSkySlots,8);assert.equal(r.skyCount,8);
  assert.equal(r.total,25);assert.equal(r.groundCount,17);
  assert.equal(r.requiredKeys.length,8);
  for(const k of r.requiredKeys)assert.ok(r.desired.some(row=>row.key===k));
  assert.ok(r.meshJobs.length<=2);assert.equal(r.canAdmitFlight,false);
});
test('old six-sky-slot default would deadlock mandatory loaded seam; wrapper cannot use it',()=>{
  assert.throws(()=>planSafeSkyResidency({position,sky,maxSkyResident:6}),/full-body/);
});
test('near-surface 3x3 original GPU keys retain exact depthMeshKey 2D grammar',()=>{
  const p={x:1,feet:20.1,z:1};
  const r=planSafeSkyResidency({position:p,ground,sky:[{cx:0,cz:0,section:0}],residentKeys:[]});
  for(let cx=-1;cx<=1;cx++)for(let cz=-1;cz<=1;cz++)
    assert.ok(r.desired.some(row=>row.key===`${cx},${cz}`));
  assert.ok(!r.desired.some(row=>row.key.startsWith('ground:')));
});
test('missing actual candidate for one physical seam prevents publishing rather than fabricating source',()=>{
  const r=planSafeSkyResidency({position,ground,sky:sky.slice(1),residentKeys:[]});
  assert.equal(r.canPublishPlan,false);assert.equal(r.canAdmitFlight,false);
  assert.equal(r.missingCandidates.length,1);
});
test('all eight resident keys make sky seam residency ready; collision still separate',()=>{
  const r=planSafeSkyResidency({position,ground,sky,residentKeys:mandatory.map(p=>p.key)});
  assert.equal(r.canAdmitFlight,true);assert.equal(r.missingResident.length,0);
  assert.equal(r.meshJobs.length,0);
});
test('only two at most new authenticated sky meshes requested, repeated tick remains bounded',()=>{
  const r=planSafeSkyResidency({position,ground,sky,residentKeys:[]});
  assert.equal(r.meshJobs.length,2);
  assert.ok(r.meshJobs.every(job=>r.requiredKeys.includes(job.key)));
  const next=planSafeSkyResidency({position,ground,sky,residentKeys:r.meshJobs.map(p=>p.key)});
  assert.equal(next.missingResident.length,6);
});
test('negative distant coordinates beyond 10k use stable keys and no remote allocation',()=>{
  const p={x:-12000,feet:151.7,z:14000};
  const distant=skyIslandBodyRegions(p);
  const candidates=distant.map(({cx,cz,section})=>({cx,cz,section}));
  const a=planSafeSkyResidency({position:p,sky:candidates,residentKeys:[]});
  const b=planSafeSkyResidency({position:p,sky:[...candidates].reverse(),residentKeys:[]});
  assert.deepEqual(new Set(a.requiredKeys),new Set(b.requiredKeys));
  assert.ok(a.desired.every(r=>Math.abs(r.cx)>500));
});
test('world-source sky data beyond height 256 is refused',()=>{
  assert.throws(()=>planSafeSkyResidency({position:{x:0,feet:257,z:0},sky}),/bounded/);
});
test('policy never introduces surface shadow pass or second day/night cycle',()=>{
  const r=planSafeSkyResidency({position,ground,sky});
  assert.equal(r.shadowPolicy.darkenGroundUnderIslands,false);
  assert.equal(r.shadowPolicy.shadowDrawPasses,0);
  assert.ok(!Object.hasOwn(r,'newSkyClock'));
});
