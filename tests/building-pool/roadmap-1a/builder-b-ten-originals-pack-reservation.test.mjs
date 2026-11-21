// Builder B source-only candidate physical envelope PRE-FLIGHT; never certifies live-world Pack meshes,
// weather, loading, iPhone, bed interaction or save-schema-1 persistence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
import {getBuilderBHomesWave1} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave1.mjs';
import {getBuilderBHospitalityWave2} from '../../../src/building-pool/roadmap-1a/builder-b-hospitality-wave2.mjs';
import {getBuilderBInnsWave3} from '../../../src/building-pool/roadmap-1a/builder-b-inns-wave3.mjs';
import {getBuilderBHomesWave4} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave4.mjs';
import {getBuilderBHospitalityWave5} from '../../../src/building-pool/roadmap-1a/builder-b-hospitality-wave5.mjs';
import {getBuilderBHomesWave6} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave6.mjs';
import {getBuilderBHomesWave7} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave7.mjs';
import {getBuilderBHospitalityWave8} from '../../../src/building-pool/roadmap-1a/builder-b-hospitality-wave8.mjs';
const builders=[getBuilderBHomesWave1,getBuilderBHospitalityWave2,getBuilderBInnsWave3,
 getBuilderBHomesWave4,getBuilderBHospitalityWave5,getBuilderBHomesWave6,
 getBuilderBHomesWave7,getBuilderBHospitalityWave8];
const candidates=builders.flatMap(fn=>fn()),K=v=>v.join(','),add=(a,b)=>a.map((n,i)=>n+b[i]);
test('all ten new originals preserve honest unresolved Pack producer status and authored roof/door sources',()=>{
 assert.equal(candidates.length,10);
 assert.equal(new Set(candidates.map(x=>x.id)).size,10);
 let totalBeds=0,totalRoofs=0,totalPortals=0;
 for(const b of candidates){
  const voxel=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),physical=auditM1PhysicalSources(b);
  assert.deepEqual(physical.errors,[],b.id+' physically unresolvable assets');
  assert.deepEqual(physical.unresolved,[],b.id+' unresolved five-pack asset mapping');
  assert.equal(physical.productionReady,false,b.id+' falsely claimed producer certification');
  assert.equal(physical.roofLoadCertified,false,b.id+' falsely claimed roof load certification');
  assert.equal(physical.physicalIPhoneTested,false,b.id+' falsely claimed device test');
  const roofs=b.placements.filter(p=>p.role==='roof');
  assert.ok(roofs.length>70,b.id+' must have actual authored roofs');
  for(const p of roofs){
   const below=voxel.get(K([p.at[0],p.at[1]-1,p.at[2]]));
   assert.ok(below&&['wall','support','partition'].includes(below.role),
    b.id+' floating original roof cell '+K(p.at));
  }
  for(const door of b.portals){
   assert.ok(walk.has(K(door.at)),b.id+' portal not in connected walking graph');
   assert.ok(!voxel.has(K(door.at)),b.id+' portal head intersects fixture');
   assert.ok(!voxel.has(K([door.at[0],door.at[1]+1,door.at[2]])),
    b.id+' portal two-high clearance obstructed');
  }
  for(const reservation of b.footprintReservations??[]){
   assert.equal(reservation.asset,'pack5:082',b.id+' unsupported false second-cell reservation');
   const anchor=voxel.get(K(reservation.anchor));
   assert.ok(anchor&&anchor.asset===reservation.asset,b.id+' orphaned Pack5 bed reservation');
   const shape=resolveManualFivePackAsset(anchor.asset,{
    orientation:anchor.orientation,variant:anchor.variant,numericId:anchor.numericId??null
   });
   assert.equal(shape.physical,true,b.id+' Pack5 physical descriptor not decoded');
   assert.ok(shape.collisionBoxes.length>0,b.id+' Pack5 bed missing producer collision boxes');
   const extras=shape.occupiedOffsets.map(offset=>add(anchor.at,offset)).filter(at=>K(at)!==K(anchor.at));
   assert.deepEqual(extras.map(K).sort(),reservation.extraCells.map(K).sort(),
    b.id+' physical producer bed offsets disagree with authored reserved second cell');
   for(const at of extras){
    assert.ok(!voxel.has(K(at))&&!walk.has(K(at)),b.id+' bed second cell intersects living source/walking');
    assert.ok(!voxel.has(K([at[0],at[1]+1,at[2]])),b.id+' bed headspace blocked');
    assert.ok(voxel.has(K([at[0],at[1]-1,at[2]])),b.id+' bed foot has no source floor');
   }
   totalBeds++;
  }
  totalPortals+=b.portals.length;totalRoofs+=roofs.length;
 }
 assert.ok(totalBeds>=6,'Candidate hospitality bed reservations unexpectedly missing');
 assert.ok(totalRoofs>5000&&totalPortals>60,'Source geometry inventory unexpectedly truncated');
 console.log('BUILDER_B_SOURCE_ONLY_PACK5_BED_FOOTPRINTS_PASS '+JSON.stringify({
  candidates:candidates.length,totalBeds,totalRoofs,totalPortals,liveCollisionApproved:false,
  roofLoadCertified:false,actualIphone:false,schema1SavesWritten:false}));
});
