import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createLiquidMeshCache} from '../../../src/liquids/presentation/mesh-cache.mjs';
import {invalidateLiquidChanges} from '../../../src/liquids/presentation/dirty-bridge.mjs';

// Explicit native integration runner: no copied peer engine in this branch.
// Water A exact dependency commit 3d843a3bbb91912c6baf5bb439593d4d0153173c.
const root=process.env.LIQUID_CORE_ROOT;
if(!root)throw Error('Set LIQUID_CORE_ROOT to a checkout of the pinned Water A commit');
async function pinned(path,expected){
  const file=resolve(root,path),bytes=readFileSync(file);
  const hash=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(hash,expected,`Peer blob mismatch: ${path}`);
  return import(pathToFileURL(file).href);
}
const {createLiquidEngine}=await pinned('src/liquids/core/engine.mjs','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {WATER_DEFINITION}=await pinned('src/liquids/water/physics/definition.mjs','78bb5be0317698b0a7e2c27ad69f13d58d2bb054');
const {createWaterSources}=await pinned('src/liquids/water/physics/sources.mjs','61b63656d80ea30071f75423ad69b48a1000784a');

// Explicit fixture batches straddling a physical seam. This is not an owner registry.
function fixture(a=[15,0,0],b=[16,0,0],options={}){
  const same=(p,q)=>p.every((n,i)=>n===q[i]);
  let unavailable=false;
  const isLoaded=(...p)=>!unavailable||!same(p,b);
  const isOpen=(...p)=>[a,b].some(q=>same(p,q)||same(p,[q[0],q[1]+1,q[2]]));
  const engine=createLiquidEngine({isLoaded,isOpen,definitions:[WATER_DEFINITION],...options.engine});
  const batchesForCell=(...p)=>same(p,a)?['a']:same(p,b)?['b']:[];
  const describeBatch=id=>id==='a'?{origin:a,cells:[a]}:id==='b'?{origin:b,cells:[b]}:null;
  const cache=createLiquidMeshCache({engine,isLoaded,isOpen,describeBatch,...options.cache});
  const route=(changed,over={})=>invalidateLiquidChanges({cache,changed,batchesForCell,...over});
  const publish=changed=>{const r=route(changed);assert.equal(r.accepted,true);return cache.step();};
  const top=id=>{
    const mesh=cache.get(id)?.mesh;
    if(!mesh)return null;
    const ys=[];
    for(const g of mesh.groups)for(let i=0;i<g.normals.length;i+=3)
      if(g.normals[i+1]===1)ys.push(g.positions[i+1]+mesh.origin[1]);
    return ys.length?Math.max(...ys):null;
  };
  return {a,b,engine,cache,route,publish,top,setUnavailable:v=>unavailable=v};
}

test('real flow updates both horizontal owner batches, with fractional tops and no stale seam face',()=>{
  const f=fixture();assert.equal(f.engine.insert(...f.a,'water',8),true);
  f.publish([f.a]);assert.equal(f.top('a'),1);assert.equal(f.cache.get('b'),null);
  const r=f.engine.tick(1);assert.deepEqual(r.changed,[f.a,f.b]);
  const before=f.engine.save();const result=f.publish(r.changed);
  assert.equal(result.published.length,2);assert.equal(f.top('a'),.5);assert.equal(f.top('b'),.5);
  for(const id of ['a','b']){
    const g=f.cache.get(id).mesh.groups[0];assert.equal(g.id,'water');
    assert.ok(!Array.from(g.normals).some((n,i)=>i%3===0&&n!==0));
  }
  assert.deepEqual(f.engine.save(),before);
});

test('real finite source and extraction update a fractional top and remove the final mesh',()=>{
  const f=fixture();const [x,y,z]=f.a;
  const sources=createWaterSources({engine:f.engine,sources:[{id:'fixture',x,y,z,mode:'finite',rate:3,target:8,initialUnits:3}]});
  const r=sources.step();assert.equal(r.inserted,3);f.publish(r.changed);assert.equal(f.top('a'),.375);
  const out=f.engine.extract(...f.a,2);assert.equal(out.units,2);f.publish([f.a]);assert.equal(f.top('a'),.125);
  assert.equal(f.engine.extract(...f.a,8).units,1);const empty=f.publish([f.a]);
  assert.ok(empty.published.some(p=>p.id==='a'&&p.empty));assert.equal(f.cache.get('a'),null);assert.equal(f.cache.stats().residentBytes,0);
});

test('vertical physical seam displacement invalidates the emptied upper cell and new lower cell',()=>{
  const f=fixture([0,20,0],[0,19,0]);assert.equal(f.engine.insert(...f.a,'water',8),true);f.publish([f.a]);
  const plan=f.engine.planDisplacement(...f.a);assert.ok(plan);
  const r=f.engine.commitDisplacement(plan);assert.deepEqual(r.changed,[f.a,f.b]);
  const published=f.publish(r.changed);assert.ok(published.published.some(p=>p.id==='a'&&p.empty));
  assert.equal(f.cache.get('a'),null);assert.equal(f.top('b'),20);assert.equal(f.engine.getCell(...f.b).units,8);
});

test('unloaded boundary defers its prior-good mesh, explicit retirement and reload recover both batches',()=>{
  const f=fixture([-1,0,0],[0,0,0]);f.engine.insert(...f.a,'water',4);f.engine.insert(...f.b,'water',4);f.publish([f.a,f.b]);
  const prior=f.cache.get('b');assert.ok(prior);f.setUnavailable(true);
  const r=f.publish([f.b]);assert.ok(r.deferred.some(p=>p.id==='b'&&p.reason==='unavailable'));
  assert.equal(f.cache.get('b'),prior);assert.equal(f.cache.drop('b'),true);
  f.setUnavailable(false);f.engine.wake(...f.b);f.publish([f.b]);assert.equal(f.top('a'),.5);assert.equal(f.top('b'),.5);
  assert.equal(f.cache.stats().pending,0);
});

test('mapping and routing rejection have no cache side effects; retry admits exact deduplicated work',()=>{
  const f=fixture();const before=f.cache.stats();
  assert.equal(f.route([f.a],{maxBatchIds:1}).reason,'routing-budget');assert.deepEqual(f.cache.stats(),before);
  assert.equal(f.route([f.a],{batchesForCell:(x)=>x===16?null:['a']}).reason,'mapping-unavailable');assert.deepEqual(f.cache.stats(),before);
  assert.throws(()=>f.route([f.a],{batchesForCell:()=>['']}),TypeError);assert.deepEqual(f.cache.stats(),before);
  const accepted=f.route([f.a,f.a,f.b]);assert.deepEqual(accepted.ids,['a','b']);assert.equal(f.cache.stats().pending,2);
});

test('cache union admission rejection retains prior queued work; explicit retry after retirement works',()=>{
  const f=fixture(undefined,undefined,{cache:{maxBatches:2}});assert.equal(f.cache.invalidate(['retired']),true);
  const before=f.cache.stats();assert.equal(f.route([f.a],{maxBatchIds:2}).reason,'cache-budget');assert.deepEqual(f.cache.stats(),before);
  assert.equal(f.cache.drop('retired'),true);assert.equal(f.route([f.a],{maxBatchIds:2}).accepted,true);assert.equal(f.cache.stats().pending,2);
});

test('physical edge clipping and explicit nonresident mapping never schedule out-of-range cells',()=>{
  const f=fixture();const seen=[];
  const r=f.route([[0,256,0],[0,-210,0]],{batchesForCell:(...p)=>{seen.push(p);return [];}});
  assert.equal(r.accepted,true);assert.equal(r.dirtyCount,12);assert.equal(seen.length,12);
  assert.ok(seen.every(p=>p[1]>=-210&&p[1]<=256));assert.deepEqual(f.cache.stats(),{tracked:0,pending:0,residentBytes:0});
});
