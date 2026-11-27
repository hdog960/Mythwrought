import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {openP0CompositeFixture,P0_COMPOSITE_ID} from '../src/manual-biomes/forgotten-sands-composite-fixture.mjs';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Exact current checkout required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const P=await load('src/manual-biomes/profile-world.mjs'),H=await load('src/world-height.mjs'),N=await load('src/world-height-natural-contract.mjs'),V=await load('src/voxel.mjs');
test('real current M8 detached combined lower and upper natural source, actual mining and portable save replay',async()=>{
 for(const index of [1,3]){
  let rev='detached-test-r1';const opts={P,H,N,reserved:()=>false,revision:()=>rev};
  const f=await openP0CompositeFixture(index,opts),w=f.world,original=new P.FourRegionWorld(w.seed,P.fourRegionProfile(w.seed,P.M8_MOUNTAIN_GENERATOR)),before=JSON.stringify(original.save());
  assert.equal(f.identity.kind,P0_COMPOSITE_ID);assert.equal(f.placementAuthority,false);assert.equal(w.save().edits.length,0);
  assert.throws(()=>P.fourRegionProfile(w.seed,P0_COMPOSITE_ID),/Unknown/);
  for(const [x,y,z,id] of [f.witness.lower,f.witness.upper]){
   assert.equal(original.get(x,y,z),0);assert.equal(w.get(x,y,z),id);
   assert.equal(w.set(x,y,z,0),true);assert.equal(w.get(x,y,z),0);assert.ok(w.edits.has(V.worldKey(x,y,z)));
  }
  const [x,y,z,id]=f.witness.upper;assert.equal(w.upperNaturalOccupied(H.physicalRegionAt(x,y,z).key),true);
  assert.equal(w.set(x,256,z,3),true);assert.equal(w.set(x,257,z,3),false);
  const payload=JSON.parse(JSON.stringify(f.portable()));
  // A new independently reconstructed fixture must accept the exact envelope.
  const reopened=await openP0CompositeFixture(index,opts),restored=reopened.restore(payload);
  assert.equal(JSON.stringify(restored.save()),JSON.stringify(w.save()));assert.equal(restored.get(x,256,z),3);
  for(const [a,b,c,d] of [f.witness.lower,f.witness.upper]){
   assert.equal(restored.get(a,b,c),0);assert.equal(restored.set(a,b,c,d),true);assert.equal(restored.edits.has(V.worldKey(a,b,c)),false);
  }
  assert.equal(restored.get(0,-100,0),original.get(0,-100,0));assert.equal(JSON.stringify(original.save()),before);
  const tampered=JSON.parse(JSON.stringify(payload));tampered.identity.geometrySha='0'.repeat(64);assert.throws(()=>reopened.restore(tampered),/identity/);
  rev='detached-test-r2';assert.throws(()=>reopened.restore(payload),/revision/);
  console.log('P0 COMPOSITE',JSON.stringify({index,identity:f.identity,counts:f.counts,edits:payload.world.edits.length,placementAuthority:false}));
 }
});
