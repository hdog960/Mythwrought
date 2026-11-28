import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion,networkAirAt} from '../src/living-underworld/worldwide-network.mjs';
import {planUnderworldSurfaceEntrance,proposedSurfaceAirAt,auditProposedEntranceCenterline}
 from '../src/living-underworld/surface-entrance-proposal.mjs';
import {cityFloorAt,detachedUnderworldAirAt,auditDetachedCityFloor}
 from '../src/living-underworld/city-floor-proposal.mjs';

test('all surface entrance plans are based on arbitrary regional coordinates, never fixed named sites',()=>{
 let accepted=0;
 for(const seed of [179,-17,314159])for(const [rx,rz] of [[0,0],[30,-30],[-300,240]]){
  const args={surfaceHeightAt:()=>8,biomeAt:()=> 'mountain'};
  const a=planUnderworldSurfaceEntrance(seed,rx,rz,args);
  const b=planUnderworldSurfaceEntrance(seed,rx,rz,args);
  assert.deepEqual(a,b);
  assert.equal(a.ok,true);
  assert.equal(a.biome,'mountain');
  assert.equal(a.mouth.y,9);
  assert.equal(Math.floor(a.mouth.x/256),rx);
  assert.equal(Math.floor(a.mouth.z/256),rz);
  assert.ok(proposedSurfaceAirAt(a,a.mouth.x,8,a.mouth.z));
  assert.ok(proposedSurfaceAirAt(a,a.start.x,a.start.y,a.start.z));
  assert.ok(networkAirAt(seed,a.start.x,a.start.y,a.start.z));
  const report=auditProposedEntranceCenterline(a);
  assert.ok(report.centerlineSamples>100);
  assert.equal(report.worldCollisionsNotYetValidated,true);
  accepted++;
 }
 assert.equal(accepted,9);
});

test('no unsafe candidate may carve when surface or protected anchor is blocked',()=>{
 const rejected=planUnderworldSurfaceEntrance(179,0,0,{
  surfaceHeightAt:()=>20,biomeAt:()=> 'plains'});
 assert.equal(rejected.ok,false);
 assert.equal(rejected.rejectionHistory.length,4);
 assert.throws(()=>proposedSurfaceAirAt(rejected,0,0,0),/Invalid/);
 const seed=2026;
 const rejectedAgain=planUnderworldSurfaceEntrance(seed,-2,1,{
  surfaceHeightAt:()=>4,protectedAt:()=>true,biomeAt:()=> 'enchanted'});
 assert.equal(rejectedAgain.ok,false);
 assert.equal(rejectedAgain.reason,'NO_SAFE_SURFACE_CANDIDATE');
 assert.throws(()=>planUnderworldSurfaceEntrance(seed,0,0,{}),/Invalid/);
});

test('repeating city-scale cavern candidates have a tested solid plateau and nine-block clear interior',()=>{
 let sites=0;
 for(let rx=-7;rx<=7;rx++)for(let rz=-7;rz<=7;rz++){
  const city=planUnderworldRegion(179,rx,rz).cityCandidate;
  if(!city)continue;
  sites++;
  assert.ok(city.rx>=100&&city.rz>=100);
  const report=auditDetachedCityFloor(179,rx,rz,{sampleStep:5});
  assert.equal(report.floorAndClearanceConfirmedAtSampledCells,true,
    'city floor has a failing cell '+JSON.stringify(report));
  assert.ok(report.estimatedContiguousFloorCells>3500);
  assert.equal(cityFloorAt(179,city.x,city.y-8,city.z),true);
  assert.equal(detachedUnderworldAirAt(179,city.x,city.y-8,city.z),false);
  assert.equal(detachedUnderworldAirAt(179,city.x,city.y-7,city.z),true);
 }
 assert.ok(sites>=4&&sites<=60);
});

test('candidate plateau does not expose invalid depth or generate surface caves on its own',()=>{
 assert.equal(detachedUnderworldAirAt(179,0,-211,0),false);
 assert.equal(detachedUnderworldAirAt(179,0,19,0),false);
 assert.throws(()=>detachedUnderworldAirAt(179,0.5,-10,0),/Invalid/);
 assert.throws(()=>auditDetachedCityFloor(179,0,0,{sampleStep:0}),/Invalid/);
});
