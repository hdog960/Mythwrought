import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareBatch,evaluateBatch} from '../src/resonance/devices48/resource-batch-v1.mjs';
import {prepareResourceFixture} from '../src/resonance/devices48/resource-fixture-v1.mjs';
const item=(id,cell)=>({id,cell,kind:'ore',quantity:1,playerOwned:false,fixtureApproved:true});
const make=(id,cell)=>prepareResourceFixture({seed:3,tick:9,deviceId:id,mode:'collect',energyDemand:4,items:[item('item_'+id,cell)],protectedCells:[]});
const a=make('a','cell_a'),b=make('b','cell_b');
test('deterministic order and immutable non-mutating proposal',()=>{
 const x=prepareBatch([b,a],{seed:3,tick:9});assert.deepEqual(x,prepareBatch([a,b],{seed:3,tick:9}));
 const y=evaluateBatch(x,{grants:[{id:'b',granted:4},{id:'a',granted:4}],clearance:[{id:'a',clear:true},{id:'b',clear:true}],inventoryReady:[{id:'a',ready:true},{id:'b',ready:true}]});
 assert.equal(y.proposals.length,2);assert.equal(y.proposals[0].state,'eligible');assert.equal(y.worldChanged,false);assert.equal(y.inventoryChanged,false);assert.equal(y.productionBound,false);
});
test('shortage and absent authority stop safely',()=>{const x=prepareBatch([a],{seed:3,tick:9});const y=evaluateBatch(x,{grants:[{id:'a',granted:3}],clearance:[],inventoryReady:[]});assert.equal(y.proposals[0].state,'stopped');assert.equal(y.proposals[0].items.length,0);});
test('duplicate resources and occupied cells rejected',()=>{assert.throws(()=>prepareBatch([a,{...b,items:[{...b.items[0],cell:'cell_a'}]}],{seed:3,tick:9}));assert.throws(()=>prepareBatch([a,a],{seed:3,tick:9}));});
test('foreign grant, duplicate grant and overgrant rejected',()=>{const x=prepareBatch([a],{seed:3,tick:9});for(const grants of [[{id:'z',granted:1}],[{id:'a',granted:2},{id:'a',granted:2}],[{id:'a',granted:5}]])assert.throws(()=>evaluateBatch(x,{grants,clearance:[],inventoryReady:[]}));});
test('cross-world and stale-tick fixtures rejected',()=>{assert.throws(()=>prepareBatch([a],{seed:4,tick:9}));assert.throws(()=>prepareBatch([a],{seed:3,tick:10}));});
