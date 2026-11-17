import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRegistryEntries,sealReadOnlySnapshot,catalogRevisionOf,
 REGISTRY_SNAPSHOT_ABI,MAX_REGISTERED_PLACEABLES} from '../../src/creative-integration/registry-validation.mjs';
const good=(id=3)=>({id,name:'Source-shaped stone',category:'Core blocks',kind:'block',
 registered:true,placeable:true,scenicOnly:false,
 source:{producer:'core',installedRegistry:'src/blocks.mjs:BUILD_MATERIALS'},
 placementRules:{requiresSupport:false,supportPolicy:'none',
 footprint:[{dx:0,dy:0,dz:0}],selectionBoxes:[[0,0,0,1,1,1]],
 collisionBoxes:[[0,0,0,1,1,1]],rotations:[0]}});
test('G1 pure validator has a distinct ABI, no engine mutations',()=>{
 assert.equal(REGISTRY_SNAPSHOT_ABI,'mythwrought.creative.registry-snapshot.v1');
 assert.deepEqual(Object.keys(sealReadOnlySnapshot([])).sort(),['abi','origin','readOnly','records','revision']);
});
test('G1 empty snapshot is safe for absent or unapproved registries',()=>{
 const s=sealReadOnlySnapshot([]);assert.equal(s.records.length,0);assert.ok(Object.isFrozen(s));
});
test('G1 reject nonexistent, nonpositive, fractional and ambiguous IDs',()=>{
 for(const id of [0,-1,1.5,Infinity,NaN,null,undefined,'','3','bad id','../bad',{},[]])
  assert.throws(()=>validateRegistryEntries([{...good(),id}]),/stable ID/);
});
test('G1 source identity is required and producer whitelisted',()=>{
 for(const source of [undefined,null,{},
  {producer:'draft',installedRegistry:'src/blocks.mjs:BUILD_MATERIALS'},
  {producer:'core',installedRegistry:'draft-builder-catalog'}])
  assert.throws(()=>validateRegistryEntries([{...good(),source}]),/source/);
});
test('G1 draft, nonplaceable, scenic and explicitly false production flags are denied',()=>{
 for(const field of ['registered','placeable','candidateOnly','scenicOnly','productionRegistered','livePlaceable']){
  const val=['registered','placeable','productionRegistered','livePlaceable'].includes(field)?false:true;
  assert.throws(()=>validateRegistryEntries([{...good(),[field]:val}]),/not runtime/);
 }
});
test('G1 rejects duplicate IDs atomically; number IDs differ from namespaced string IDs',()=>{
 assert.throws(()=>validateRegistryEntries([good(3),good(3)]),/duplicate ID/);
 assert.deepEqual(validateRegistryEntries([good(3),good('core:3')]).map(x=>x.id),[3,'core:3']);
});
test('G1 rejects missing physical metadata, empty selection and invalid box shapes',()=>{
 const cases=[null,{},
  {...good().placementRules,selectionBoxes:[]},
  {...good().placementRules,selectionBoxes:[[0,0,0,0,1,1]]},
  {...good().placementRules,collisionBoxes:[[0,0,0,Infinity,1,1]]},
  {...good().placementRules,selectionBoxes:[[0,0,0,1,1]]}];
 for(const placementRules of cases)
  assert.throws(()=>validateRegistryEntries([{...good(),placementRules}]));
});
test('G1 disallows footprint overlaps, missing anchor and oversized offsets',()=>{
 const p=good().placementRules;
 for(const footprint of [[{dx:1,dy:0,dz:0}],
  [{dx:0,dy:0,dz:0},{dx:0,dy:0,dz:0}],
  [{dx:0,dy:0,dz:0},{dx:9000,dy:0,dz:0}]])
  assert.throws(()=>validateRegistryEntries([{...good(),placementRules:{...p,footprint}}]));
});
test('G1 rotation states are typed and cannot alias or be duplicated',()=>{
 const p=good().placementRules;
 for(const rotations of [[],[1],[0,0],[0,4],['0'],[0,1,2,3,4]])
  assert.throws(()=>validateRegistryEntries([{...good(),placementRules:{...p,rotations}}]));
});
test('G1 rejects oversized catalogs and nonarray inputs before iteration',()=>{
 assert.throws(()=>validateRegistryEntries({}),/snapshot size/);
 assert.throws(()=>validateRegistryEntries(Array(MAX_REGISTERED_PLACEABLES+1).fill(good())),/snapshot size/);
});
test('G1 revision changes deterministically when physical geometry changes',()=>{
 const a=validateRegistryEntries([good()]);const altered=good();
 altered.placementRules={...altered.placementRules,selectionBoxes:[[0,0,0,1,0.5,1]]};
 const b=validateRegistryEntries([altered]);
 assert.notEqual(catalogRevisionOf(a),catalogRevisionOf(b));
 assert.equal(catalogRevisionOf(a),catalogRevisionOf(validateRegistryEntries([good()])));
});
test('G1 invalid member cancels entire seal; no partial snapshot',()=>{
 assert.throws(()=>sealReadOnlySnapshot([good(),{...good(4),registered:false}]),/not runtime/);
});
