import assert from 'node:assert/strict';
import test from 'node:test';
import {describeCandidateObject, createCandidateScene, readCandidateLayout} from '../src/nonblock/candidate-scene.mjs';

const seed = 179;
const anchor = [0, 1, 0];
const flower = {sceneId:'scene48:single-wildflower', anchor};
const neighbor = {sceneId:'scene36:rope-coil', anchor:[2,1,0]};
const layout = [flower, neighbor];
const args = [seed, 'legacy', layout];
const ground = (x,y,z) => y === 0;
const origin = [.5,1.3,-2];
const facing = [0,0,1];

test('only explicit loopback staging activates a bounded scene', () => {
  const suffix = '?nonblock-stage='+encodeURIComponent(JSON.stringify(layout));
  assert.deepEqual(readCandidateLayout(new URL('http://localhost:4173/'+suffix)), layout);
  assert.equal(readCandidateLayout(new URL('https://hdog960.github.io/Mythwrought/'+suffix)), null);
  assert.equal(readCandidateLayout(new URL('http://localhost:4173/')), null);
  assert.throws(() => readCandidateLayout(new URL('http://localhost:4173/?nonblock-stage={}')));
});

test('all five producer samples preserve canonical identity and finite triangle geometry', () => {
  for (const sceneId of [flower.sceneId, 'nonblock:d:desert-scrub', 'nonblock:e:pebble-scatter',
    'scene36:cloth-banner',neighbor.sceneId]) {
    const candidate = describeCandidateObject(seed,{sceneId,anchor,variant:2,orientation:0});
    assert.equal(candidate.contract,'nonblock-object-v1');
    assert.equal(candidate.instanceKey,'nb1:'+encodeURIComponent(sceneId)+':179:0,1,0:2'+
      (sceneId.startsWith('scene36:')?':r0':''));
    assert.ok(candidate.positions.length > 0 && candidate.positions.length % 9 === 0);
    assert.ok(candidate.positions.every(Number.isFinite));
  }
  assert.notEqual(describeCandidateObject(seed,{...neighbor,orientation:1}).instanceKey,
    describeCandidateObject(seed,neighbor).instanceKey);
  assert.throws(() => describeCandidateObject(seed,{...flower,variant:4}));
});

test('triangle picking respects reach, voxel ties, mount state and empty corners', () => {
  let supported = true;
  let voxel = null;
  const scene = createCandidateScene(...args,{storage:new MapStorage(), blockAt:(...p)=>supported && ground(...p),
    voxelPick:()=>voxel});
  const hit = scene.pick(origin,facing);
  assert.equal(hit?.sceneId,flower.sceneId);
  assert.equal(scene.pick(origin,facing,1),null);
  assert.equal(scene.pick([.65,1.3,-2],facing),null);
  voxel = {distance:hit.distance};
  assert.equal(scene.pick(origin,facing),null);
  voxel = null;
  supported = false;
  assert.equal(scene.pick(origin,facing),null);
});

test('a source-issued hit removes one instance and persists across scene construction', () => {
  const storage = new MapStorage();
  storage.setItem('schema-1-world','original bytes');
  const deps = {storage, blockAt:ground, voxelPick:()=>null};
  const scene = createCandidateScene(...args,deps);
  const hit = scene.pick(origin,facing);
  assert.equal(scene.breakHit({...hit},origin,facing),false);
  assert.equal(scene.breakHit(hit,origin,facing),true);
  assert.equal(scene.breakHit(hit,origin,facing),false);
  const reopened = createCandidateScene(...args,deps);
  assert.deepEqual(reopened.visible().map(o=>o.sceneId),[neighbor.sceneId]);
  assert.equal(createCandidateScene(seed,'four-regions',layout,deps).visible().length,2);
  assert.equal(createCandidateScene(seed+1,'legacy',layout,deps).visible().length,2);
  assert.equal(storage.getItem('schema-1-world'),'original bytes');
});

test('failed writes leave both objects visible and reject corrupted storage', () => {
  const storage = new MapStorage();
  const deps = {storage,blockAt:ground,voxelPick:()=>null};
  const scene = createCandidateScene(...args,deps);
  const hit = scene.pick(origin,facing);
  storage.fail = true;
  assert.equal(scene.breakHit(hit,origin,facing),false);
  assert.equal(scene.visible().length,2);
  storage.fail = false;
  assert.equal(scene.breakHit(hit,origin,facing),true);
  const [key] = storage.values.keys();
  storage.setItem(key,'{"version":false}');
  assert.throws(()=>createCandidateScene(...args,deps),/sidecar/i);
});

class MapStorage {
  values = new Map();
  fail = false;
  getItem(key){return this.values.get(key) ?? null;}
  setItem(key,value){
    if(this.fail) throw Error('storage unavailable');
    this.values.set(key,value);
  }
  removeItem(key){this.values.delete(key);}
}
