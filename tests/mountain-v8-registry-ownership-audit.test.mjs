import test from 'node:test';
import assert from 'node:assert/strict';
import {auditMountainV8KnownRegistryOwners as audit}
  from '../src/manual-biomes/mountain-v8-registry-ownership-audit.mjs';

test('source-backed nine-group owner census is collision-free with 258 occupied values',()=>{
  const r=audit();
  assert.ok(Object.isFrozen(r));
  assert.equal(r.groups.length,9);
  assert.deepEqual(r.groups.map(g=>[g.name,g.count]),[
    ['original-legacy',9],['manual-pack1',30],['pack2',18],
    ['manual-pack3',17],['manual-pack4',23],['manual-pack5',18],
    ['biome130',130],['original-environment-v7',11],
    ['original-sentinels',2]
  ]);
  assert.equal(r.knownOccupiedReservedOrSentinelCount,258);
  assert.equal(r.originalFivePackNumericBridgeCount,106);
  const ids=r.groups.flatMap(g=>g.ids);
  assert.equal(new Set(ids).size,258);
  assert.deepEqual(r.groups.at(-2).ids,Array.from({length:11},(_,i)=>400+i));
  assert.deepEqual(r.groups.at(-1).ids,[255,65535]);
});
test('registry census never allocates or recommends a V8 numeric material ID',()=>{
  const r=audit();
  assert.equal(r.fullMultiOwnerNamespaceAuditComplete,false);
  assert.equal(r.otherOwnerSignOffsObtained,false);
  assert.equal(r.allocatableIds,null);
  assert.equal(r.proposedV8Ids,null);
  assert.equal(r.registeredV8Ids,0);
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.measuredV8GpuBytes,null);
  for(const g of r.groups){
    assert.ok(Object.isFrozen(g));
    assert.ok(Object.isFrozen(g.ids));
  }
});
test('source registry census is deterministic with independent immutable output',()=>{
  const before=JSON.stringify(audit());
  const again=JSON.stringify(audit());
  assert.equal(before,again);
  assert.equal(audit().referenceSourceHead,
    '182cf99ed4c0231dd629c56d856ffc99fec935b0');
});
