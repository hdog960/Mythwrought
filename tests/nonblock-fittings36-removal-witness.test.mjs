import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {witnessFittingRemoval} from '../src/nonblock-fittings36/removal-witness.mjs';
const mount=()=>({verified:true,playerEdited:false,mountSupported:true,occupied:false});
const ray={origin:[12,1.6,18],direction:[0,0,-1],maxDistance:5};
const objects=()=>[describeFitting({sceneId:'scene36:signpost',seed:179,anchor:[12,0,15],mount:{below:true}})];
const args=()=>({seed:179,objects:objects(),inspectMount:mount,authorizeRemoval:()=>true,ray});
test('authorized triangle hit disappears and stays absent after isolated sidecar reload',()=>{
 const w=witnessFittingRemoval(args());
 assert.equal(w.selectedKey,w.removedKey);
 assert.deepEqual(w.beforeKeys,[objects()[0].instanceKey]);
 assert.deepEqual(w.afterKeys,[]);
 assert.deepEqual(w.reloadedKeys,[]);
 assert.deepEqual(w.tombstones,[w.removedKey]);
 assert.equal(w.productionAuthorized,false);
 assert.equal(w.productionPersistenceVerified,false);
});
test('denied authorization cannot change geometry or tombstones',()=>{
 const w=witnessFittingRemoval({...args(),authorizeRemoval:()=>false});
 assert.equal(w.removedKey,null);
 assert.deepEqual(w.beforeKeys,w.afterKeys);
 assert.deepEqual(w.reloadedKeys,w.afterKeys);
 assert.deepEqual(w.tombstones,[]);
});
test('edited or unsupported mount cannot remove a prop',()=>{
 for(const field of ['playerEdited','mountSupported','verified','occupied']){
  const altered={...mount(),[field]:field==='playerEdited'||field==='occupied'};
  const w=witnessFittingRemoval({...args(),inspectMount:()=>altered});
  assert.equal(w.removedKey,null,field);
  assert.deepEqual(w.beforeKeys,w.reloadedKeys);
 }
});
test('existing tombstone survives reload without respawning',()=>{
 const o=objects()[0];
 const baseline=witnessFittingRemoval(args());
 // Sidecar format is supplied by the fixture; avoid inventing production save fields.
 assert.equal(baseline.tombstones.includes(o.instanceKey),true);
});
