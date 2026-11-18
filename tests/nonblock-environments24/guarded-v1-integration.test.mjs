import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
import {createEnvironmentV1Session} from '../../src/nonblock-environments24/v1-session.mjs';
import {breakVisibleEnvironment} from '../../src/nonblock-environments24/guarded-break.mjs';

// Real source-authored geometry and the real isolated :24 session, not a mocked picker.
// This fixture never writes production saves, alters world voxels or spawns objects.
const seed=179;
const a=exportEnvironmentV1('stalagmite',{seed,anchor:[0,0,0],variant:0});
const b=exportEnvironmentV1('crystal',{seed,anchor:[4,0,0],variant:1});
const ground=(x,y,z)=>y===-1;
const no=()=>false;
const create=(extra={})=>createEnvironmentV1Session({
 seed,descriptors:[a,b],blockAt:ground,editedAt:no,occupiedAt:no,...extra
});
const ray={origin:[0,1,4],direction:[0,0,-1],maxDistance:6};
const guarded=(session,extra={})=>breakVisibleEnvironment(session,{
 ...ray,blockAt:ground,editedAt:no,...extra
});

test('real v1 modeled stalagmite can be picked, removed once and reloaded as tombstone',()=>{
 const s=create();
 assert.deepEqual(s.visible().map(x=>x.instanceKey),[a.instanceKey,b.instanceKey]);
 const result=guarded(s);
 assert.equal(result.removed,true);
 assert.equal(result.instanceKey,a.instanceKey);
 assert.deepEqual(result.tombstones,[a.instanceKey]);
 assert.equal(guarded(s).removed,false);
 assert.deepEqual(s.visible().map(x=>x.instanceKey),[b.instanceKey]);
 const restored=create({snapshot:s.snapshot()});
 assert.deepEqual(restored.visible().map(x=>x.instanceKey),[b.instanceKey]);
 assert.deepEqual(restored.snapshot(),s.snapshot());
});

test('real v1 pick is blocked by a solid wall and preserves both objects',()=>{
 const s=create();
 const before=s.snapshot();
 const result=guarded(s,{blockAt:(x,y,z)=>ground(x,y,z)||(z===2&&y>=0)});
 assert.equal(result.removed,false);
 assert.deepEqual(s.snapshot(),before);
 assert.equal(s.visible().length,2);
});

test('real v1 pick is blocked by edited voxel without tombstone side effects',()=>{
 const s=create();
 const before=s.snapshot();
 const result=guarded(s,{editedAt:(x,y,z)=>z===2&&y>=0});
 assert.equal(result.removed,false);
 assert.deepEqual(s.snapshot(),before);
});

test('real v1 fixture rejects out-of-reach hit and leaves source geometry visible',()=>{
 const s=create();
 const result=guarded(s,{maxDistance:0.25});
 assert.equal(result.removed,false);
 assert.equal(s.visible().length,2);
 assert.deepEqual(s.snapshot().tombstones,[]);
});

test('real v1 fixture refuses forged external sidecar on reload',()=>{
 assert.throws(()=>create({snapshot:{contract:'nonblock-object-v1',seed,tombstones:['nb1:forged']}}),TypeError);
});
