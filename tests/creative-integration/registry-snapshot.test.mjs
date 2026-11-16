import test from 'node:test';
import assert from 'node:assert/strict';
import {readRegisteredSnapshot,getCatalogRevision,readOnlyRegistryPort}
  from '../../src/creative-integration/registry-snapshot.mjs';
import {REGISTRY_SNAPSHOT_ABI,typedPlaceableKey} from '../../src/creative-integration/registry-validation.mjs';
import {BUILD_MATERIALS} from '../../src/blocks.mjs';
import {BIOME130_REGISTERED_IDS} from '../../src/biome130-registry.mjs';
import {PACK2_LIVE_IDS} from '../../src/pack2-integration.mjs';

const snapshot=()=>readRegisteredSnapshot();
test('G1 reads the real installed BUILD_MATERIALS, not draft manual builder catalogs',()=>{
  const s=snapshot();
  assert.equal(s.abi,REGISTRY_SNAPSHOT_ABI);assert.equal(s.readOnly,true);
  assert.equal(s.origin,'merged-main-registered-materials');
  assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(s.records));
  assert.equal(s.records.length,BUILD_MATERIALS.length-s.excluded.length);
  assert.equal(s.excluded.length,1);
  assert.deepEqual(s.excluded.map(x=>x.id),[76]);
  assert.match(s.excluded[0].reason,/not-certified/);
});
test('G1 includes installed biome130 001..080 without exposing unregistered 081..130',()=>{
 const s=snapshot(), ids=new Set(s.records.map(x=>x.id));
 // Updated against integrated main 440ab01a (live registration of 071..080).
 assert.equal(BIOME130_REGISTERED_IDS.length,80);
 assert.ok(BIOME130_REGISTERED_IDS.every(id=>ids.has(id)));
 for(let ordinal=1;ordinal<=80;ordinal++){
  const id=255+ordinal;
  assert.ok(BIOME130_REGISTERED_IDS.includes(id),'Missing registered biome130:'+ordinal);
  assert.ok(ids.has(id),'Live biome family withheld: '+ordinal);
 }
 for(let ordinal=81;ordinal<=130;ordinal++)
  assert.ok(!ids.has(255+ordinal),'Unregistered biome candidate leaked: '+ordinal);
 assert.equal(s.records.length,102);
});
test('G1 includes only independently verified Pack2 solid selections',()=>{
 const s=snapshot(), ids=new Set(s.records.map(x=>x.id));
 assert.equal(PACK2_LIVE_IDS.length,18);
 assert.ok(PACK2_LIVE_IDS.filter(id=>id!==76).every(id=>ids.has(id)));
 assert.ok(!ids.has(76));
});
test('G1 excludes unregistered reserved Pack1,3,4,5 and unrelated legacy terrain',()=>{
 const ids=new Set(snapshot().records.map(x=>x.id));
 for(const id of [0,1,2,6,9,15,31,109,125,159,181,209,226,255])assert.ok(!ids.has(id),String(id));
 for(const id of [3,4,5,7,8])assert.ok(ids.has(id),String(id));
});
test('G1 production source identity and physical details are present for every row',()=>{
 for(const x of snapshot().records){
  assert.ok(x.registered&&x.placeable&&!x.scenicOnly);
  assert.equal(x.source.installedRegistry,'src/blocks.mjs:BUILD_MATERIALS');
  assert.ok(['core','biome130','pack2'].includes(x.source.producer));
  assert.ok(x.placementRules.selectionBoxes.length>=1);
  assert.ok(x.placementRules.rotations.includes(0));
  assert.equal(typeof x.placementRules.requiresSupport,'boolean');
 }
});
test('G1 type-preserving stable IDs cannot alias or synthesize candidate aliases',()=>{
 const rows=snapshot().records,keys=rows.map(x=>typedPlaceableKey(x.id));
 assert.equal(keys.length,new Set(keys).size);
 assert.notEqual(typedPlaceableKey(3),typedPlaceableKey('3'));
 assert.ok(rows.every(x=>typeof x.id==='number'&&Number.isSafeInteger(x.id)));
});
test('G1 snapshots are deterministic and deep-frozen',()=>{
 const a=snapshot(),b=snapshot();assert.deepEqual(a,b);
 assert.equal(getCatalogRevision(),a.revision);
 assert.ok(Object.isFrozen(a.records[0]));assert.ok(Object.isFrozen(a.records[0].placementRules));
 assert.ok(Object.isFrozen(a.records[0].placementRules.selectionBoxes[0]));
 assert.throws(()=>{a.records[0].name='mutated';},TypeError);
});
test('G1 does not add any unsafe game API methods or save write callbacks',()=>{
 const port=readOnlyRegistryPort();
 assert.deepEqual(Object.keys(port).sort(),['getCatalogRevision','listPlaceables','readRegisteredSnapshot']);
 for(const name of ['tryPlace','applyEditBatch','saveCreativeEdits','set','mutate','enable'])
  assert.equal(port[name],undefined);
 assert.ok(Object.isFrozen(port));
});
test('G1 async read-only port only returns the same structurally verified entries',async()=>{
 const p=readOnlyRegistryPort(),rows=await p.listPlaceables();
 assert.deepEqual(rows,snapshot().records);assert.ok(Object.isFrozen(rows));
 assert.equal(p.getCatalogRevision(),snapshot().revision);
});
