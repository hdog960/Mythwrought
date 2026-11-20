// :48 opt-in regression: independent shrub tombstones across variants and reloads.
import test from 'node:test';
import assert from 'node:assert/strict';
import {makeShrubBreakFixture} from '../src/nonblock-scene48/shrub-break-fixture.mjs';
import {prepareNonblockDrawBatches} from '../src/nonblock-scene48/bounded-draw-batches.mjs';

const placements=[
 {anchor:[2,0,2],variant:1},
 {anchor:[5,0,2],variant:2},
 {anchor:[8,0,2],variant:3}
];
const bounds=[[-20,-20,-20],[20,20,20]];
test('three shrub variants remove independently and stay absent from bounded draw batches after two reloads',()=>{
 const first=makeShrubBreakFixture(179,placements);
 const keys=first.visible().map(x=>x.instanceKey);
 assert.equal(new Set(keys).size,3);
 assert.equal(first.breakByKey(keys[1]),true);
 assert.equal(first.breakByKey(keys[1]),false);
 const second=makeShrubBreakFixture(179,placements,JSON.parse(JSON.stringify(first.snapshot())));
 assert.deepEqual(second.visible().map(x=>x.instanceKey),[keys[0],keys[2]]);
 assert.equal(prepareNonblockDrawBatches(second.visible(),bounds).visibleCount,2);
 assert.equal(second.breakByKey(keys[0]),true);
 const third=makeShrubBreakFixture(179,placements,JSON.parse(JSON.stringify(second.snapshot())));
 assert.deepEqual(third.visible().map(x=>x.instanceKey),[keys[2]]);
 assert.equal(prepareNonblockDrawBatches(third.visible(),bounds).visibleCount,1);
 assert.equal(makeShrubBreakFixture(180,placements).visible().length,3);
});
test('tampered shrub sidecars reject atomically without changing an existing fixture',()=>{
 const fixture=makeShrubBreakFixture(179,placements);
 const keys=fixture.visible().map(x=>x.instanceKey);
 const good=fixture.snapshot();
 for(const removed of [[keys[0],keys[0]],['foreign'],[keys[0], 'foreign'],[null],keys]){
  const bad={...good,removed};
  if(removed===keys)continue; // all known removals are legitimate
  assert.throws(()=>makeShrubBreakFixture(179,placements,bad),TypeError);
 }
 assert.deepEqual(fixture.visible().map(x=>x.instanceKey),keys);
 assert.deepEqual(makeShrubBreakFixture(179,placements,{...good,removed:keys}).visible(),[]);
});
