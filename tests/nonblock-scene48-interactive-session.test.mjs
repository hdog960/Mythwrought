import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockInteractiveSession} from '../src/nonblock-scene48/interactive-session.mjs';
const placements=[
 {sceneId:'scene48:low-grass',anchor:[0,0,0]},
 {sceneId:'scene48:short-fern',anchor:[2,0,0]},
 {sceneId:'scene48:button-mushroom',anchor:[4,0,0]},
 {sceneId:'scene48:clover-patch',anchor:[6,0,0]}
];
test('opt-in fixture picks nearest shaped descriptor, removes only hit and excludes tombstoned draw',()=>{
 const s=createNonblockInteractiveSession({seed:17,placements});
 assert.equal(s.visible().length,4);
 const hit=s.target([-2,.2,0],[1,0,0]);
 assert.equal(hit.sceneId,'scene48:low-grass');
 const result=s.breakAt([-2,.2,0],[1,0,0]);
 assert.equal(result.removed,true);
 assert.equal(s.visible().length,3);
 assert.equal(s.drawCandidates().some(o=>o.instanceKey===result.instanceKey),false);
 assert.equal(s.breakAt([-2,.2,0],[1,0,0]).removed,false);
 assert.equal(s.revision(),1);
});
test('tombstone snapshot survives isolated fixture reload without modifying schema-1',()=>{
 const s=createNonblockInteractiveSession({seed:17,placements});
 const key=s.breakAt([-2,.2,0],[1,0,0]).instanceKey;
 const snapshot=s.snapshot();
 const reloaded=createNonblockInteractiveSession({seed:17,placements,sidecarSnapshot:snapshot});
 assert.equal(reloaded.visible().length,3);
 assert.equal(reloaded.visible().some(o=>o.instanceKey===key),false);
 assert.equal(snapshot.contract,'nonblock-object-v1');
 assert.throws(()=>createNonblockInteractiveSession({seed:18,placements,sidecarSnapshot:snapshot}),/sidecar|tombstone/i);
});
test('session rejects duplicate anchors, oversized collections, invalid rays and unsafe reach',()=>{
 assert.throws(()=>createNonblockInteractiveSession({seed:17,placements:[placements[0],placements[0]]}),/duplicate/i);
 assert.throws(()=>createNonblockInteractiveSession({seed:17,placements,maxObjects:2}),/invalid/i);
 const s=createNonblockInteractiveSession({seed:17,placements});
 assert.throws(()=>s.breakAt([0,0,0],[1,0,0],7),/reach/i);
 assert.throws(()=>s.target([NaN,0,0],[1,0,0]),/ray/i);
});
