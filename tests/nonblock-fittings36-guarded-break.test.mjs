import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {createGuardedFittingSession} from '../src/nonblock-fittings36/guarded-break-session.mjs';
const verified=()=>({verified:true,playerEdited:false,mountSupported:true,occupied:false});
test('guarded break requires current mount and explicit owner approval; tombstone restores',()=>{
 let edited=false,approved=false;
 const o=describeFitting({sceneId:'scene36:signpost',seed:179,anchor:[12,0,15],mount:{below:true}});
 const session=createGuardedFittingSession({seed:179,objects:[o],inspectMount:()=>({...verified(),playerEdited:edited}),authorizeRemoval:()=>approved});
 const ray={origin:[12,1.6,18],direction:[0,0,-1],maxDistance:5};
 assert.equal(session.visible().length,1);
 assert.equal(session.breakPicked(ray),null);
 edited=true;approved=true;
 assert.equal(session.breakPicked(ray),null);
 edited=false;
 const result=session.breakPicked(ray);
 assert.equal(result?.instanceKey,o.instanceKey);
 assert.equal(session.visible().length,0);
 const saved=session.snapshot();
 const restored=createGuardedFittingSession({seed:179,objects:[o],inspectMount:verified,authorizeRemoval:()=>true});
 restored.restore(saved);assert.equal(restored.visible().length,0);
 assert.throws(()=>restored.restore({...saved,tombstones:['foreign']}),/invalid/);
 assert.equal(restored.visible().length,0);
});
test('invalid ray cannot trigger break or authorization',()=>{
 let calls=0;
 const o=describeFitting({sceneId:'scene36:signpost',seed:1,anchor:[0,0,0],mount:{below:true}});
 const s=createGuardedFittingSession({seed:1,objects:[o],inspectMount:verified,authorizeRemoval:()=>{calls++;return true;}});
 assert.equal(s.breakPicked({origin:[0,1,2],direction:[0,0,0]}),null);
 assert.equal(s.breakPicked({origin:[0,1,2],direction:[NaN,0,-1]}),null);
 assert.equal(calls,0);
});

test('approval-time mount edit fails closed without writing tombstone',()=>{
 let edited=false, approvals=0;
 const o=describeFitting({sceneId:'scene36:signpost',seed:2026,anchor:[12,0,15],mount:{below:true}});
 const ray={origin:[12,1.6,18],direction:[0,0,-1],maxDistance:5};
 const s=createGuardedFittingSession({
  seed:2026,objects:[o],
  inspectMount:()=>({...verified(),playerEdited:edited}),
  authorizeRemoval:()=>{approvals++;edited=true;return true;}
 });
 assert.equal(s.breakPicked(ray),null);
 assert.equal(approvals,1);
 assert.deepEqual(s.snapshot().tombstones,[]);
 assert.equal(s.visible().length,1);
});
test('nonboolean authorization cannot remove a prop',()=>{
 const o=describeFitting({sceneId:'scene36:signpost',seed:-77,anchor:[12,0,15],mount:{below:true}});
 const s=createGuardedFittingSession({seed:-77,objects:[o],inspectMount:verified,authorizeRemoval:()=>Promise.resolve(true)});
 const ray={origin:[12,1.6,18],direction:[0,0,-1],maxDistance:5};
 assert.equal(s.breakPicked(ray),null);
 assert.deepEqual(s.snapshot().tombstones,[]);
});
