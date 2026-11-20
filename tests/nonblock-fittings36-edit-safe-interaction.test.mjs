import test from 'node:test';
import assert from 'node:assert/strict';
import {createEditSafeInteraction} from '../src/nonblock-fittings36/edit-safe-interaction.mjs';
const make=(key,x,collisionIntent='solid-proposed')=>({contract:'nonblock-object-v1',seed:179,sceneId:'scene36:signpost',instanceKey:key,anchor:[x,0,0],attachment:'ground',collisionIntent,selectionAabbs:[{min:[x,0,0],max:[x+.7,2,.4]}],breakIntent:{targetKey:key,requiresOwner:':00'}});
const witness=()=>({verified:true,playerEdited:false,mountSupported:true,occupied:false});
const pick=objects=>objects[0]?{instanceKey:objects[0].instanceKey}:null;
const session=objects=>createEditSafeInteraction({seed:179,objects,inspectMount:witness,pick});
test('fail closed on edits, missing mount evidence, duplicate keys and solid occupancy',()=>{
 assert.equal(session([make('a',0),make('b',2)]).visible().length,2);
 assert.throws(()=>session([make('a',0),make('a',2)]),/duplicate/);
 assert.throws(()=>session([make('a',0),{...make('b',1),selectionAabbs:[{min:[.2,0,0],max:[.9,2,.4]}]}]),/overlapping/);
 for(const bad of [{playerEdited:true},{mountSupported:false},{occupied:true},{verified:false}]){
  assert.throws(()=>createEditSafeInteraction({seed:179,objects:[make('a',0)],inspectMount:()=>({...witness(),...bad}),pick}),/unverified/);
 }
 assert.throws(()=>createEditSafeInteraction({seed:179,objects:[make('a',0)],inspectMount:()=>null,pick}),/unverified/);
});
test('requires explicit :00 approval and restores isolated external tombstones',()=>{
 const objects=[make('a',0),make('b',2)],s=session(objects);
 assert.equal(s.breakPicked({},()=>false),null);assert.equal(s.visible().length,2);
 assert.throws(()=>s.breakPicked({}),/approval/);
 assert.deepEqual(s.breakPicked({},()=>true),{action:'remove-object',instanceKey:'a',sidecarOnly:true});
 const snap=s.snapshot();assert.deepEqual(snap.tombstones,['a']);
 const restored=session(objects);restored.restore(snap);
 assert.deepEqual(restored.visible().map(o=>o.instanceKey),['b']);
 assert.throws(()=>restored.restore({...snap,tombstones:['a','a']}),/invalid/);
 assert.throws(()=>restored.restore({...snap,tombstones:['unknown']}),/invalid/);
 assert.throws(()=>restored.restore({...snap,seed:1}),/invalid/);
});
test('pass-through selection volumes may overlap but are never automatically spawned',()=>{
 const s=session([make('a',0,'pass-through'),make('b',0,'pass-through')]);
 assert.equal(s.visible().length,2);
});
