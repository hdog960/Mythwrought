import test from 'node:test';
import assert from 'node:assert/strict';
import {createShrubInteractionFrame} from '../src/nonblock-scene48/shrub-interaction-frame.mjs';

const placements=[{anchor:[0,0,0],variant:1},{anchor:[4,0,0],variant:2},{anchor:[8,0,0],variant:3}];
const view=[[-2,-2,-2],[12,5,5]];

test('authoritative-hit key bridge removes only validated existing shrub and survives reload',()=>{
 const frame=createShrubInteractionFrame(179,placements,view);
 const keys=frame.visible().map(o=>o.instanceKey);
 assert.equal(frame.draw().visibleCount,3);
 assert.equal(frame.breakByValidatedKey('foreign:object'),false);
 assert.equal(frame.breakByValidatedKey(null),false);
 assert.equal(frame.draw().visibleCount,3);
 assert.equal(frame.breakByValidatedKey(keys[1]),true);
 assert.equal(frame.breakByValidatedKey(keys[1]),false);
 assert.deepEqual(frame.visible().map(o=>o.instanceKey),[keys[0],keys[2]]);
 assert.equal(frame.draw().visibleCount,2);
 assert.equal(frame.draw().batches.flatMap(b=>b.instances).some(o=>o.instanceKey===keys[1]),false);
 const restored=createShrubInteractionFrame(179,placements,view,JSON.parse(JSON.stringify(frame.snapshot())));
 assert.equal(restored.draw().visibleCount,2);
 assert.equal(restored.breakByValidatedKey(keys[1]),false);
 assert.equal(restored.breakByValidatedKey(keys[2]),true);
 assert.equal(restored.draw().visibleCount,1);
 assert.equal(createShrubInteractionFrame(180,placements,view).draw().visibleCount,3);
});

test('key bridge cannot target objects outside the registered fixture',()=>{
 const frame=createShrubInteractionFrame(179,placements,view);
 const other=createShrubInteractionFrame(180,placements,view);
 const foreign=other.visible()[0].instanceKey;
 assert.equal(frame.breakByValidatedKey(foreign),false);
 assert.equal(frame.snapshot().removed.length,0);
});
