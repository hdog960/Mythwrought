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
  storage.setItem(key+':previous-good','{"version":false}');
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

test('refined fittings use finite, nondegenerate triangles and distinct bounded variants', () => {
  for (const sceneId of ['scene36:cloth-banner','scene36:rope-coil']) {
    const variants = [0,1,2,3].map(variant=>describeCandidateObject(seed,{sceneId,anchor,variant}));
    assert.equal(new Set(variants.map(o=>o.positions.join(','))).size,4);
    for(const {positions:p} of variants) {
      assert.ok(p.length/9 <= 256);
      for(let i=0;i<p.length;i+=9) {
        const [x,y,z,bx,by,bz,cx,cy,cz]=p.slice(i,i+9);
        const a=[bx-x,by-y,bz-z], b=[cx-x,cy-y,cz-z];
        const area=Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]);
        assert.ok(area>1e-8,sceneId+' has a degenerate triangle');
      }
    }
  }
});


test('a staged previous-good backup recovers removal when the primary is damaged',()=>{
  const storage=new MapStorage();
  const primary='mythwrought:nonblock-stage:v1:legacy:179';
  const deps={storage,blockAt:ground,voxelPick:()=>null};
  const scene=createCandidateScene(...args,deps);
  const hit=scene.pick(origin,facing);
  assert.equal(scene.breakHit(hit,origin,facing),true);
  assert.equal(storage.getItem(primary+':previous-good'),storage.getItem(primary));
  storage.setItem(primary,'{unfinished');
  const recovered=createCandidateScene(...args,deps);
  assert.equal(recovered.recovered,true);
  assert.deepEqual(recovered.visible().map(o=>o.sceneId),[neighbor.sceneId]);
  const neighborOrigin=[2.65,1.13,-2];
  const neighborHit=recovered.pick(neighborOrigin,facing);
  assert.equal(neighborHit?.sceneId,neighbor.sceneId);
  assert.equal(recovered.breakHit(neighborHit,neighborOrigin,facing),false);
  assert.equal(storage.getItem(primary),'{unfinished');
  assert.equal(storage.getItem(primary+':previous-good'),JSON.stringify({
    version:'mythwrought-nonblock-removals-v1',seed,worldId:'legacy',tombstones:[hit.instanceKey]
  }));
});

test('a backup failure after primary write rolls back the complete staged removal',()=>{
  const storage=new MapStorage();
  const deps={storage,blockAt:ground,voxelPick:()=>null};
  const scene=createCandidateScene(...args,deps);
  const hit=scene.pick(origin,facing);
  const original=storage.setItem.bind(storage);
  storage.setItem=(key,value)=>{
    if(key.endsWith(':previous-good'))throw Error('backup write rejected');
    original(key,value);
  };
  assert.equal(scene.breakHit(hit,origin,facing),false);
  assert.equal(storage.values.size,0);
  assert.equal(scene.visible().length,2);
  storage.setItem=original;
  assert.equal(scene.breakHit(hit,origin,facing),true);
});

test('a stale copy never replaces a newer primary or its backup',()=>{
  const storage=new MapStorage();
  const deps={storage,blockAt:ground,voxelPick:()=>null};
  const first=createCandidateScene(...args,deps),stale=createCandidateScene(...args,deps);
  const firstHit=first.pick(origin,facing),staleHit=stale.pick(origin,facing);
  assert.equal(first.breakHit(firstHit,origin,facing),true);
  const stored=new Map(storage.values);
  assert.equal(stale.breakHit(staleHit,origin,facing),false);
  assert.deepEqual(storage.values,stored);
  assert.equal(stale.pick(origin,facing),null);
});

test('a failed sidecar readback restores the exact earlier primary and backup',()=>{
  const storage=new MapStorage();
  const deps={storage,blockAt:ground,voxelPick:()=>null};
  const scene=createCandidateScene(...args,deps);
  assert.equal(scene.breakHit(scene.pick(origin,facing),origin,facing),true);
  const records=new Map(storage.values);
  const write=storage.setItem.bind(storage),read=storage.getItem.bind(storage);
  let rejectRead=false;
  storage.setItem=(key,value)=>{
    write(key,value);
    if(key.endsWith(':previous-good')&&value!==records.get(key))rejectRead=true;
  };
  storage.getItem=key=>{
    if(rejectRead&&key.endsWith(':previous-good')){rejectRead=false;return 'readback mismatch';}
    return read(key);
  };
  const neighborOrigin=[2.65,1.13,-2];
  assert.equal(scene.breakHit(scene.pick(neighborOrigin,facing),neighborOrigin,facing),false);
  assert.deepEqual(storage.values,records);
  assert.deepEqual(scene.visible().map(object=>object.sceneId),[neighbor.sceneId]);
});


test('only a valid world-scoped backup can recover a missing primary',()=>{
  const primary='mythwrought:nonblock-stage:v1:legacy:179';
  const backup=primary+':previous-good';
  const storage=new MapStorage();
  const deps={storage,blockAt:ground,voxelPick:()=>null};
  const scene=createCandidateScene(...args,deps);
  assert.equal(scene.breakHit(scene.pick(origin,facing),origin,facing),true);
  const valid=storage.getItem(backup);
  storage.removeItem(primary);
  assert.equal(createCandidateScene(...args,deps).recovered,true);
  assert.equal(storage.getItem(primary),null);
  const state=JSON.parse(valid);
  for(const patch of [{worldId:'other-world'},{seed:428},{tombstones:[...state.tombstones,...state.tombstones]},
    {tombstones:[state.tombstones[0].replace(':179:',':428:')]}]){
    storage.setItem(backup,JSON.stringify({...state,...patch}));
    assert.throws(()=>createCandidateScene(...args,deps),/sidecar/i);
  }
});

test('a legacy primary without a backup remains writable and gains a verified backup',()=>{
  const primary='mythwrought:nonblock-stage:v1:legacy:179';
  const backup=primary+':previous-good';
  const storage=new MapStorage();
  const old='{"version":"mythwrought-nonblock-removals-v1","seed":179,"worldId":"legacy","tombstones":[]}';
  storage.setItem(primary,old);
  const scene=createCandidateScene(...args,{storage,blockAt:ground,voxelPick:()=>null});
  assert.equal(scene.recovered,false);
  assert.equal(storage.getItem(primary),old);
  assert.equal(storage.getItem(backup),null);
  assert.equal(scene.breakHit(scene.pick(origin,facing),origin,facing),true);
  assert.equal(storage.getItem(primary),storage.getItem(backup));
});
