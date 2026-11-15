import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {Pack2LiveWorld,pack2StorageKey,loadPack2LiveWorld,savePack2LiveWorld}
  from '../src/pack2-world.mjs';

// Pack 2 saves must preserve damaged existing evidence, not silently "fix"
// it by overwriting the user's prior bytes during an ordinary edit/save.
const storage=()=>{const data=new Map();return {
  getItem:key=>data.has(key)?data.get(key):null,
  setItem:(key,value)=>data.set(key,String(value)),
  data
}};
const makeWorld=()=>new Pack2LiveWorld(new VoxelWorld(179));
const a=[500,19,500],b=[501,19,500],c=[502,19,500];

test('orphan damaged Pack 2 journal is never erased when primary is absent',()=>{
  const store=storage(),world=makeWorld(),key=pack2StorageKey(179);
  store.setItem(key+'-journal','{incomplete,do not discard');
  assert.equal(world.set(...a,59),true);
  const result=savePack2LiveWorld(store,world);
  assert.equal(result.ok,false);
  assert.match(result.reason,/damaged Pack 2 journal/);
  assert.equal(store.getItem(key),null);
  assert.equal(store.getItem(key+'-journal'),'{incomplete,do not discard');
  assert.throws(()=>loadPack2LiveWorld(store,new VoxelWorld(179)),/damaged/);
});

test('damaged journal cannot be overwritten despite a valid Pack 2 primary',()=>{
  const store=storage(),world=makeWorld(),key=pack2StorageKey(179);
  assert.equal(world.set(...a,60),true);
  assert.equal(savePack2LiveWorld(store,world).ok,true);
  const primary=store.getItem(key);
  store.setItem(key+'-journal','{"checksum":"tampered"}');
  assert.equal(world.set(...b,61),true);
  const result=savePack2LiveWorld(store,world);
  assert.equal(result.ok,false);
  assert.match(result.reason,/damaged Pack 2 journal/);
  assert.equal(store.getItem(key),primary);
  assert.equal(store.getItem(key+'-journal'),'{"checksum":"tampered"}');
  assert.equal(store.getItem(key+'-backup'),null);
  assert.equal(loadPack2LiveWorld(store,new VoxelWorld(179)).world.get(...a),60);
});

test('damaged previous-good Pack 2 backup is never destroyed by a new save',()=>{
  const store=storage(),world=makeWorld(),key=pack2StorageKey(179);
  assert.equal(world.set(...a,59),true);
  assert.equal(savePack2LiveWorld(store,world).ok,true);
  assert.equal(world.set(...b,60),true);
  assert.equal(savePack2LiveWorld(store,world).ok,true);
  const previousPrimary=store.getItem(key),journal=store.getItem(key+'-journal');
  store.setItem(key+'-backup','{damaged historical backup');
  assert.equal(world.set(...c,61),true);
  const result=savePack2LiveWorld(store,world);
  assert.equal(result.ok,false);
  assert.match(result.reason,/damaged Pack 2 previous-good backup/);
  assert.equal(store.getItem(key),previousPrimary);
  assert.equal(store.getItem(key+'-journal'),journal);
  assert.equal(store.getItem(key+'-backup'),'{damaged historical backup');
});

test('valid interrupted Pack 2 journal can still reconcile without losing prior bytes',()=>{
  const store=storage(),world=makeWorld(),key=pack2StorageKey(179);
  assert.equal(world.set(...a,59),true);
  assert.equal(savePack2LiveWorld(store,world).ok,true);
  const old=store.getItem(key);
  assert.equal(world.set(...b,60),true);
  assert.equal(savePack2LiveWorld(store,world).ok,true);
  const newer=store.getItem(key);
  store.setItem(key,old); // Crash after journal, before writing canonical primary.
  const recovered=loadPack2LiveWorld(store,new VoxelWorld(179));
  assert.equal(recovered.recovered,true);
  assert.equal(recovered.world.get(...b),60);
  assert.equal(savePack2LiveWorld(store,recovered.world).ok,true);
  assert.equal(store.getItem(key),newer);
  assert.equal(store.getItem(key+'-backup'),old);
});
