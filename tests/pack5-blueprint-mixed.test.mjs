import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK5_BUILDER_CATALOG} from '../src/pack5-integration/catalog.mjs';
import {inspectPack5InMixedBlueprint} from '../src/pack5-integration/blueprint-handoff.mjs';

const family=PACK5_BUILDER_CATALOG.find(f=>f.symbolicId==='pack5:080');
test('roadmap-1 style mixed placements preserve foreign dependencies and exact Pack5 physical geometry',()=>{
  const source={id:'r1:test-mixed',placements:[
    {asset:'pack1:001',at:[0,4,0],orientation:'north'},
    {asset:'pack4:030',at:[1,4,0],orientation:'east'},
    {asset:'pack5:080',at:[3,4,0],orientation:'west',variant:family.variants[1]},
    {asset:'biome130:006',at:[5,4,0],orientation:'north'}
  ]};
  const before=JSON.stringify(source);
  const r=inspectPack5InMixedBlueprint(source,{origin:[100,0,-25]});
  assert.equal(JSON.stringify(source),before,'no cross-pack builder source mutation');
  assert.equal(r.pack5Total,1);
  assert.equal(r.resolvedPack5Count,1);
  assert.equal(r.physicalPlan.placements[0].asset,'pack5:080');
  assert.deepEqual(r.physicalPlan.placements[0].anchor,[103,4,-25]);
  assert.equal(r.physicalPlan.placements[0].rotation,3);
  assert.deepEqual(r.externalDependencies,['biome130:006','pack1:001','pack4:030']);
  assert.equal(r.worldPlaced,false);
  assert.equal(r.readyForCombinedPlacement,false);
  assert.equal(r.requiresCrossPackCollisionAndSupportValidation,true);
});
test('roadmap-2 style unresolved voxel references defer missing orientation and variant without inventing defaults',()=>{
  const bp={id:'r2:test',voxels:[
    {material:'pack5:082',x:5,y:4,z:2,kind:'fixture'},
    {material:'pack5:080',x:2,y:4,z:2,orientation:'east',variant:family.variants[0]},
    {material:'pack2:013',x:3,y:4,z:2,kind:'floor'},
    {material:'pack3:023',x:4,y:4,z:2,kind:'roof'}
  ]};
  const result=inspectPack5InMixedBlueprint(bp);
  assert.equal(result.pack5Total,2);
  assert.equal(result.resolvedPack5Count,0);
  assert.equal(result.physicalPlan,null);
  assert.equal(result.unresolvedPack5.length,1);
  assert.deepEqual(result.unresolvedPack5[0].missing,
    ['explicit-four-way-orientation','authored-variant']);
  assert.deepEqual(result.externalDependencies,['pack2:013','pack3:023']);
});
test('foreign material-only blueprint is not falsely labeled production-ready',()=>{
  const r=inspectPack5InMixedBlueprint({placements:[{asset:'pack4:030',at:[0,0,0]}]});
  assert.equal(r.pack5Total,0);
  assert.equal(r.physicalPlan,null);
  assert.equal(r.readyForCombinedPlacement,false);
});
test('Pack 5 namespace must never absorb out-of-band IDs or silently resolve bad geometry',()=>{
  assert.throws(()=>inspectPack5InMixedBlueprint({placements:[
    {asset:'pack5:099',at:[0,4,0],orientation:'north',variant:family.variants[0]}
  ]}),/outside assigned/);
  assert.throws(()=>inspectPack5InMixedBlueprint({placements:[
    {asset:'pack5:080',at:['bad',4,0],orientation:'north',variant:family.variants[0]}
  ]}),/placement cell/);
});
