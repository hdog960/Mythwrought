import test from 'node:test';
import assert from 'node:assert/strict';
import {createEditIntentLedger} from '../../src/auto-integration-support/edit-intent.mjs';
const cell={x:7,y:12,z:-3};
const options={registeredIds:[1,2,3]};
test('restored natural material remains explicit edit and suppresses procedural overlay',()=>{
  const ledger=createEditIntentLedger([{...cell,blockId:1,sequence:9}],options);
  assert.deepEqual(ledger.resolve(cell,{naturalId:1,overlayId:2}),
    {id:1,source:'player-edit',sequence:9});
  assert.deepEqual(createEditIntentLedger([],options).resolve(cell,{naturalId:1,overlayId:2}),
    {id:2,source:'overlay'});
});
test('mined air is explicit edit, not absence of overlay',()=>{
  const ledger=createEditIntentLedger([{...cell,blockId:0,sequence:4}],options);
  assert.equal(ledger.resolve(cell,{naturalId:1,overlayId:2}).id,0);
});
test('out-of-order replay is deterministic and roundtrip retains edit intent',()=>{
  const edits=[{...cell,blockId:2,sequence:3},{...cell,blockId:1,sequence:5},
    {x:0,y:0,z:0,blockId:3,sequence:1}];
  const a=createEditIntentLedger(edits,options);
  const b=createEditIntentLedger([...edits].reverse(),options);
  assert.deepEqual(a.exportFixture(),b.exportFixture());
  assert.deepEqual(createEditIntentLedger(JSON.parse(JSON.stringify(a.exportFixture())),options)
    .resolve(cell,{naturalId:1,overlayId:2}),a.resolve(cell,{naturalId:1,overlayId:2}));
  assert.ok(Object.isFrozen(a.records[0]));
});
test('reject unregistered blocks, invalid cells and ambiguous edit order',()=>{
  assert.throws(()=>createEditIntentLedger([{...cell,blockId:256,sequence:1}],options),/invalid/);
  assert.throws(()=>createEditIntentLedger([{...cell,x:0.5,blockId:1,sequence:1}],options),/invalid/);
  assert.throws(()=>createEditIntentLedger([{...cell,blockId:1,sequence:1},{...cell,blockId:2,sequence:1}],options),/ambiguous/);
  assert.throws(()=>createEditIntentLedger([],options).resolve(cell,{naturalId:256}),/unregistered/);
});

test('exact lexicographic ordering of extreme safe world coordinates',()=>{
  const max=Number.MAX_SAFE_INTEGER;
  const edits=[
    {x:max,y:0,z:0,blockId:1,sequence:1},
    {x:-max,y:0,z:0,blockId:2,sequence:2},
    {x:0,y:max,z:-max,blockId:3,sequence:3},
    {x:0,y:-max,z:max,blockId:1,sequence:4},
    {x:0,y:-max,z:-max,blockId:2,sequence:5}
  ];
  const expected=[[-max,0,0],[0,-max,-max],[0,-max,max],[0,max,-max],[max,0,0]];
  for(const input of [edits,[...edits].reverse()]){
    const ledger=createEditIntentLedger(input,options);
    assert.deepEqual(ledger.exportFixture().map(({x,y,z})=>[x,y,z]),expected);
    assert.equal(ledger.resolve({x:-max,y:0,z:0},{naturalId:2,overlayId:3}).source,'player-edit');
    assert.deepEqual(createEditIntentLedger(ledger.exportFixture(),options).exportFixture(),ledger.exportFixture());
  }
});
