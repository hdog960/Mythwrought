import test from 'node:test';
import assert from 'node:assert/strict';
import {createInventoryState,replaceInventorySnapshot,readLiveRegisteredPort,inventoryCategories,
  filterInventory,updateInventoryState,selectedInventoryPlaceable,virtualInventoryWindow,stablePlaceableKey} from '../../src/creative-mode/inventory-model.mjs';
import {makeInventoryContractFixture} from '../../src/creative-mode/inventory-fixture.mjs';
const sample=(id,name='Placed mock',category='Stone')=>({id,name,category,kind:'block',registered:true,placeable:true,placementRules:{requiresSupport:false}});
test('M3 begins with no fabricated live records and six empty hotbar slots',()=>{
 const s=createInventoryState();assert.equal(s.items.length,0);assert.deepEqual(s.hotbar,[null,null,null,null,null,null]);assert.ok(Object.isFrozen(s));
});
test('M3 uses M0 eligibility guard to reject nonplaceable, scenic, invalid, and duplicate rows atomically',()=>{
 const prev=replaceInventorySnapshot(createInventoryState(),[sample('fixture:good')]);
 for(const bad of [[sample('fixture:dupe'),sample('fixture:dupe')],[{...sample('fixture:bad'),registered:false}],
   [{...sample('fixture:bad'),placeable:false}],[{...sample('fixture:bad'),scenicOnly:true}],
   [{...sample('bad id')}],[{...sample('fixture:bad'),placementRules:null}]]){
    assert.throws(()=>replaceInventorySnapshot(prev,bad));assert.equal(prev.items.length,1);
 }
});
test('stable typed IDs do not alias and preserve source exact identity',()=>{
 assert.notEqual(stablePlaceableKey(23),stablePlaceableKey('23'));
 const s=replaceInventorySnapshot(createInventoryState(),[sample(23),sample('b:23')]);
 assert.deepEqual(s.items.map(x=>x.id),[23,'b:23']);
});
test('provenance-gated live port is never inferred from mock rows',async()=>{
 await assert.rejects(readLiveRegisteredPort({provenance:'test-fixture',listPlaceables:()=>[sample('foo')]}),/not connected/);
 await assert.rejects(readLiveRegisteredPort(null),/not connected/);
 const rows=await readLiveRegisteredPort({provenance:'live-registered-placeables',listPlaceables:async()=>[sample('official:block')]});
 assert.equal(rows.length,1);assert.ok(Object.isFrozen(rows));
 await assert.rejects(readLiveRegisteredPort({provenance:'live-registered-placeables',listPlaceables:()=>[sample(1),sample(1)]}),/Duplicate/);
});
test('search and categories are dynamic, normalized and combined',()=>{
 let s=replaceInventorySnapshot(createInventoryState(),[sample('st:1','Granite','Stone'),sample('wo:2','Oak beam','Timber'),sample('st:3','Marble','Stone')]);
 assert.deepEqual(inventoryCategories(s),['all','Stone','Timber']);
 s=updateInventoryState(s,{type:'CATEGORY',category:'Stone'});
 s=updateInventoryState(s,{type:'SEARCH',query:'  GRAN  '});
 assert.deepEqual(filterInventory(s).map(x=>x.id),['st:1']);
 assert.equal(updateInventoryState(s,{type:'CATEGORY',category:'Imaginary'}),s);
});
test('hotbar assign/select/clear synchronize by stable registered identity',()=>{
 let s=replaceInventorySnapshot(createInventoryState(),[sample('st:1','Granite'),sample('st:2','Marble')]);
 s=updateInventoryState(s,{type:'SELECT_SLOT',slot:4});s=updateInventoryState(s,{type:'ASSIGN',id:'st:2'});
 assert.equal(selectedInventoryPlaceable(s).name,'Marble');assert.equal(s.hotbar[4],'string:st:2');
 assert.equal(updateInventoryState(s,{type:'ASSIGN',id:'not:here'}),s);
 s=updateInventoryState(s,{type:'SELECT_SLOT',slot:0});assert.equal(selectedInventoryPlaceable(s),null);
 s=updateInventoryState(s,{type:'SELECT_SLOT',slot:4});s=updateInventoryState(s,{type:'CLEAR_SLOT'});
 assert.equal(selectedInventoryPlaceable(s),null);assert.ok(Object.isFrozen(s.hotbar));
});
test('catalog refresh clears vanished hotbar IDs and resets missing categories',()=>{
 let s=replaceInventorySnapshot(createInventoryState(),[sample('s:1','Granite','Stone'),sample('t:2','Oak','Timber')]);
 s=updateInventoryState(s,{type:'ASSIGN',id:'s:1'});
 s=updateInventoryState(s,{type:'CATEGORY',category:'Stone'});
 s=replaceInventorySnapshot(s,[sample('t:2','Oak','Timber')]);
 assert.equal(s.hotbar[0],null);assert.equal(s.category,'all');
});
test('virtual window caps DOM rows near top, middle and end of large catalog',()=>{
 for(const count of [0,1,15,1200,5600]){
  for(const top of [0,1600,999999]){
   const v=virtualInventoryWindow(count,top,192);
   assert.ok(v.start>=0&&v.end<=count&&v.end>=v.start);
   assert.ok(v.rendered<=24);
   assert.equal(v.start%2,0);
  }
 }
});
test('invalid virtualization dimensions are rejected',()=>{
 for(const args of [[-1,0,100],[10,-2,100],[10,0,-5],[10,Infinity,100]])
  assert.throws(()=>virtualInventoryWindow(...args),RangeError);
});
test('large catalog 5600 mock entries filters and virtualizes without full DOM construction',()=>{
 const t=performance.now();const fixture=makeInventoryContractFixture(5600);
 let s=replaceInventorySnapshot(createInventoryState(),fixture);
 assert.equal(s.items.length,5600);
 const categories=inventoryCategories(s);assert.equal(categories.length,6);
 s=updateInventoryState(s,{type:'SEARCH',query:'fixture 040'});
 const matches=filterInventory(s);assert.ok(matches.length>=100&&matches.length<=150);
 const v=virtualInventoryWindow(matches.length,280,165);
 assert.ok(v.rendered<=24);
 assert.ok(performance.now()-t<1500,'fixture load/search exceeds generous 1.5s local test budget');
});
test('valid snapshot includes mixed object/block records but no sample-only rows',()=>{
 const items=makeInventoryContractFixture(11);assert.ok(items.some(x=>x.kind==='object'));
 const state=replaceInventorySnapshot(createInventoryState(),items);
 assert.ok(state.items.every(x=>x.registered===true&&x.placeable===true));
 assert.equal(state.items.length,11);
});
