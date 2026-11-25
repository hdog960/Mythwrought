import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk} from '../src/voxel.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {auditSharedSingleEditHaloBound} from '../src/living-underworld/gallery-streaming-working-set.mjs';
import {meshReadOnlySharedBatch,sharedMeshHaloCells} from '../src/living-underworld/shared-native-mesh-snapshot.mjs';
test('all actual single-edit staging patterns have bounded deduplicated voxel halo',()=>{
 const r=auditSharedSingleEditHaloBound();
 console.log(JSON.stringify({sharedHalo:r}));
 assert.equal(r.maxUnshared,41796);
 assert.ok(r.withinReadCap);
 assert.ok(r.maxShared<r.maxUnshared);
 assert.equal(r.liveRendererConnected,false);
});
test('real mixed surface and depth mesher outputs identical under shared bounded snapshot',()=>{
 const world=new FourRegionWorld(179,fourRegionProfile(179,M7_ENVIRONMENT_GENERATOR));
 const keys=['-135,11','-134,11','-135,12','-135,11,-1','-134,11,-1','-135,12,-1'];
 const initial=JSON.stringify(world.save());
 const r=meshReadOnlySharedBatch(world,keys);
 assert.ok(r.ok,JSON.stringify({reason:r.reason,calls:r.calls,theoretical:r.theoretical}));
 assert.ok(r.calls<=40000&&r.hits>0);
 for(const {key,vertices} of r.meshes){
  const [x,z,s=0]=key.split(',').map(Number);
  const direct=s===0?meshChunk(world,x,z):meshDepthSection(world,x,z,s);
  assert.deepEqual(vertices,direct,key);
 }
 assert.equal(JSON.stringify(world.save()),initial);
 console.log(JSON.stringify({nativeMixedBatch:{theoretical:r.theoretical,calls:r.calls,hits:r.hits,meshes:r.meshes.map(m=>({key:m.key,vertices:m.vertices.length/9})),byteExact:true}}));
});
test('snapshot refuses duplicate owner and oversized mixed halo before mesh work',()=>{
 assert.throws(()=>meshReadOnlySharedBatch({get:()=>3},['0,0','0,0']),TypeError);
 const keys=['0,0','10,10','20,20','30,30','40,40','50,50'];
 assert.ok(sharedMeshHaloCells(keys)>40000);
 const r=meshReadOnlySharedBatch({get:()=>{throw Error('must not read')}},keys);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'SHARED_HALO_READ_BUDGET');
});
