import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK5_BUILDER_CATALOG} from '../src/pack5-integration/catalog.mjs';
import {resolvePack5BlueprintPhysical,planPack5BuilderBlueprint} from '../src/pack5-integration/blueprint-handoff.mjs';
test('all 18 roadmapped symbols and 36 authored variants resolve physical geometry at four turns',()=>{
  assert.equal(PACK5_BUILDER_CATALOG.length,18);
  for(const f of PACK5_BUILDER_CATALOG)for(const variant of f.variants)
    for(const [rotation,orientation] of ['north','east','south','west'].entries()){
      const a=resolvePack5BlueprintPhysical({asset:f.symbolicId,at:[3,4,5],variant,orientation});
      assert.equal(a.rotation,rotation);
      assert.equal(a.numericId,null);
      assert.equal(a.worldPlaced,false);
      assert.equal(a.productionPlacement,false);
      assert.equal(a.physical.hasRealPhysicalGeometry,true);
      assert.ok(a.physical.visible.length>0&&a.physical.occupiedCells.length>0);
      assert.ok(a.physical.visible.every(b=>b.length===6&&b.slice(0,3).every((n,i)=>n<b[i+3])));
      assert.ok(a.physical.requiredSupports.every(c=>c.length===3));
    }
});
test('builder handoff preserves multi-cell occupied footprint and forbids duplicates',()=>{
  const sample=planPack5BuilderBlueprint({id:'test-bed',placements:[
    {asset:'pack5:082',at:[0,4,0],variant:'moonwatch-canopy',orientation:'east'},
    {asset:'pack5:080',at:[10,4,0],orientation:'north'}
  ]},{origin:[100,0,-90]});
  assert.equal(sample.resolvedCount,2);
  assert.ok(sample.occupiedCount>=2);
  assert.equal(sample.worldPlaced,false);
  assert.equal(sample.saveWritten,false);
  assert.ok(sample.placements[0].physical.occupiedCells.every(c=>c[0]>=98&&c[2]<0));
  assert.throws(()=>planPack5BuilderBlueprint({placements:[
    {asset:'pack5:080',at:[0,4,0]},
    {asset:'pack5:080',at:[0,4,0]}]}),/overlapping/);
});
test('other roadmap namespaces cannot be hijacked or quietly assigned numeric IDs',()=>{
  for(const ref of ['pack3:023','pack4:030','biome130:079','pack5:097']){
    assert.throws(()=>planPack5BuilderBlueprint({placements:[{asset:ref,at:[0,4,0]}]}));
  }
  assert.throws(()=>resolvePack5BlueprintPhysical({asset:'pack5:080',at:[0,4,0],orientation:'unresolved'}));
});
