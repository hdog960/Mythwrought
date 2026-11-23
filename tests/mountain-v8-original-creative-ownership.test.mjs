import test from 'node:test';
import assert from 'node:assert/strict';
import {auditMountainV8OriginalCreativeOwners as audit}
  from '../src/manual-biomes/mountain-v8-original-creative-ownership.mjs';
import {readRegisteredSnapshot}
  from '../src/creative-integration/registry-snapshot.mjs';
import {BUILD_MATERIALS,BLOCK_NAMES} from '../src/blocks.mjs';
import {biome130Block} from '../src/biome130-registry.mjs';
import {ENVIRONMENT_GROUND} from '../src/environment-ground.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';

test('original Creative G1 exact installed material/record totals and fluid exclusion',()=>{
  const r=audit(),snap=readRegisteredSnapshot();
  assert.equal(BUILD_MATERIALS.length,153);
  assert.equal(r.installedSourceMaterialCount,153);
  assert.equal(snap.records.length,152);
  assert.equal(r.existingCreativeRecords,152);
  assert.deepEqual(snap.excluded.map(x=>x.id),[76]);
  assert.equal(r.sourceCatalogRevision,snap.revision);
});
test('15 already-installed mountain biome130 Creative records retain real AABBs',()=>{
  const r=audit(),snap=new Map(readRegisteredSnapshot().records.map(x=>[x.id,x]));
  assert.deepEqual(r.installedExistingMountain130.map(x=>x.id),
    Array.from({length:15},(_,i)=>301+i));
  for(const x of r.installedExistingMountain130){
    const installed=snap.get(x.id),physical=biome130Block(x.id);
    assert.equal(installed.source.producer,'biome130');
    assert.deepEqual(installed.placementRules.selectionBoxes,physical.boxes);
    assert.deepEqual(installed.placementRules.collisionBoxes,physical.boxes);
    assert.ok(x.originalPhysicalBoxes>1);
    assert.equal(x.approvedV8Alias,false);
  }
});
test('V7 named environment ground 400-402 is not installed as G1 Creative placeable',()=>{
  const r=audit(),ids=new Set(BUILD_MATERIALS);
  const snap=new Set(readRegisteredSnapshot().records.map(x=>x.id));
  assert.deepEqual(r.namedV7TerrainExcluded.map(x=>x.id),[400,401,402]);
  for(const x of r.namedV7TerrainExcluded){
    assert.equal(ENVIRONMENT_GROUND[x.name],x.id);
    assert.equal(typeof BLOCK_NAMES[x.id],'string');
    assert.equal(ids.has(x.id),false);
    assert.equal(snap.has(x.id),false);
  }
});
test('Pack5 builder-only bridge is not accidentally treated as registered G1 blocks',()=>{
  const source=MANUAL_FIVE_PACK_CATALOG.filter(x=>x.pack===5);
  assert.equal(source.length,18);
  for(const x of source){
    assert.equal(BUILD_MATERIALS.includes(x.numericId),false);
    assert.equal(readRegisteredSnapshot().records.some(r=>r.id===x.numericId),false);
  }
  assert.equal(audit().pack5BuilderOnlyBridgeCount,18);
});
test('V8 descriptors, new IDs and integration permission remain entirely absent',()=>{
  const r=audit();
  assert.equal(Object.isFrozen(r),true);
  assert.equal(r.v8SourceDescriptorNames.length,13);
  assert.equal(r.v8CreativePlaceablesRegistered,0);
  assert.equal(r.numericV8IdRegistrationAuthorized,false);
  assert.equal(r.creativeOwnerApprovalReceived,false);
  assert.deepEqual(r.approvedV8Aliases,[]);
  assert.equal(r.safeToIntegrate,false);
});
