import test from 'node:test';
import assert from 'node:assert/strict';
import {auditMountainV8OriginalMountainShapeOwners as audit}
  from '../src/manual-biomes/mountain-v8-existing-mountain-shape-ownership.mjs';
import {biome130Block} from '../src/biome130-registry.mjs';
import {environmentGround} from '../src/environment-ground.mjs';
import {raycastShapes,FULL_CUBE}
  from '../src/voxel-shape-interactions.mjs';

test('original 15 mountain biome130 IDs already own physically authored shapes',()=>{
  const r=audit();
  assert.deepEqual(r.existingMountain130.map(x=>x.id),
    Array.from({length:15},(_,i)=>301+i));
  assert.ok(r.existingMountain130.every(x=>x.sourceOwned===true));
  assert.ok(r.existingMountain130.every(x=>x.originalBoxes>1));
  assert.ok(r.existingMountain130.every(x=>x.exactSingleFullCube===false));
  assert.ok(r.existingMountain130.every(x=>x.allocatable===false));
});
test('original 400-402 V7 slate/scree/gneiss are occupied, not proposed V8 aliases',()=>{
  const r=audit();
  assert.deepEqual(r.existingV7Ground.map(x=>[x.name,x.id]),
    [['slate',400],['scree',401],['gneiss',402]]);
  for(const row of r.existingV7Ground){
    assert.ok(environmentGround(row.id));
    assert.equal(row.v8MaterialAliasApproved,false);
    assert.equal(row.allocatable,false);
  }
});
test('original authored flora patterns 2+2+13 remain descriptor-only and not live shapes',()=>{
  const r=audit();
  assert.deepEqual(r.originalV8FloraPatterns.map(x=>[x.name,x.sourceCellCount]),
    [['alpine-flower',2],['low-heather',2],['dwarf-conifer',13]]);
  assert.equal(r.sourceDescriptorCount,13);
  assert.ok(r.originalV8FloraPatterns.every(x=>!x.livePhysicsApproved&&x.sourcePatternOnly));
  assert.equal(r.noncubeFloraColliderApproved,false);
});
test('raycast shows a genuine existing mountain talus shape differs from cube fallback',()=>{
  const asset=biome130Block(301);
  const origin=[.01,.75,-.5],direction=[0,0,1],limit=2;
  const lookup=(x,y,z)=>x===0&&y===0&&z===0?
    {boxes:asset.boxes}:null;
  const cubes=(x,y,z)=>x===0&&y===0&&z===0?FULL_CUBE:null;
  assert.equal(raycastShapes(origin,direction,lookup,limit),null);
  const cubeHit=raycastShapes(origin,direction,cubes,limit);
  assert.deepEqual(cubeHit?.cell,[0,0,0]);
  assert.ok(cubeHit.distance>=0);
});
test('no auto-alias, new ID or complete cross-owner registry permission leaks',()=>{
  const r=audit();
  assert.equal(Object.isFrozen(r),true);
  assert.ok(Object.isFrozen(r.existingMountain130));
  assert.deepEqual(r.aliasesApproved,[]);
  assert.equal(r.newNumericIdsProposed,null);
  assert.equal(r.distinctKnownIdsIncludingThese,258);
  assert.equal(r.completeRegistryAudit,false);
  assert.equal(r.safeToIntegrate,false);
});
