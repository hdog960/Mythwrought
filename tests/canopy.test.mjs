import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight,meshChunk,CHUNK_SIZE} from '../src/voxel.mjs';
import {woodlandCanopyVertices,woodlandTreeStyle,woodlandSentinelChunk,CANOPY_LIMITS} from '../src/canopy.mjs';

const base=(x,y,z,seed)=>new VoxelWorld(seed).get(x,y,z);
const options={chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:base,grass:BLOCK.GRASS,air:BLOCK.AIR};
test('canopy is deterministic, finite, chunk-local and bounded without saved edits',()=>{
  const world=new VoxelWorld(179),before=JSON.stringify(world.save());
  let found=0;
  for(let cx=-4;cx<=4;cx++)for(let cz=-4;cz<=4;cz++){
    const a=woodlandCanopyVertices(world,cx,cz,options);
    const b=woodlandCanopyVertices(world,cx,cz,options);
    assert.deepEqual(a,b);
    assert.equal(a.length%CANOPY_LIMITS.stride,0);
    assert.ok(a.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    for(let i=0;i<a.length;i+=9){
      assert.ok(Number.isFinite(a[i])&&Number.isFinite(a[i+1])&&Number.isFinite(a[i+2]));
      assert.ok(a[i]>=cx*16&&a[i]<(cx+1)*16);
      assert.ok(a[i+2]>=cz*16&&a[i+2]<(cz+1)*16);
    }
    if(a.length)found++;
  }
  assert.ok(found>0,'at least one sculpted canopy should be visible in seeded landscape');
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(CANOPY_LIMITS.newDrawCalls,0);
});
test('mining natural tree anchors or building into canopy removes visuals on remesh',()=>{
  const world=new VoxelWorld(179);
  let match;
  for(let cx=-4;cx<=4&&!match;cx++)for(let cz=-4;cz<=4&&!match;cz++){
    const before=woodlandCanopyVertices(world,cx,cz,options);
    if(!before.length)continue;
    // Find the tree's original trunk anchor from the repeated base vertices.
    const x=Math.floor(before[0]),z=Math.floor(before[2]),h=terrainHeight(x,z,world.seed);
    if(world.get(x,h,z)!==BLOCK.GRASS)continue;
    match={cx,cz,x,z,h,before};
  }
  assert.ok(match);
  const {cx,cz,x,z,h,before}=match;
  assert.ok(meshChunk(world,cx,cz).length>=before.length);
  assert.equal(world.set(x,h,z,BLOCK.AIR),true);
  assert.ok(woodlandCanopyVertices(world,cx,cz,options).length<before.length);
  const saved=world.save(),restored=VoxelWorld.restore(saved);
  assert.deepEqual(woodlandCanopyVertices(restored,cx,cz,options),woodlandCanopyVertices(world,cx,cz,options));
  assert.equal(world.set(x,h,z,BLOCK.GRASS),true);
  assert.deepEqual(woodlandCanopyVertices(world,cx,cz,options),before);
});

test('seeded woodland includes distinct original evergreen and broadleaf silhouettes without altering world edits',()=>{
  const world=new VoxelWorld(179),before=JSON.stringify(world.save());
  const styles=new Set();
  for(let cx=-8;cx<=8;cx++)for(let cz=-8;cz<=8;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
    styles.add(woodlandTreeStyle(x,z,world.seed));
    if(styles.size===2)break;
  }
  assert.deepEqual([...styles].sort(),['broadleaf','evergreen']);
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(woodlandTreeStyle(10,-4,179),woodlandTreeStyle(10,-4,179));
});

test('sculpted roots and sunlit facets stay inside editable chunk budget and preserve saves',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let broad=0,ever=0;
  for(let cx=-7;cx<=7;cx++)for(let cz=-7;cz<=7;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    assert.equal(mesh.length%CANOPY_LIMITS.stride,0);
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    const style=woodlandTreeStyle(Math.floor(mesh[0]),Math.floor(mesh[2]),world.seed);
    if(style==='broadleaf')broad++;else ever++;
    // Every authored foliage/root vertex remains finite and local.
    for(let i=0;i<mesh.length;i+=9){
      assert.ok(Number.isFinite(mesh[i])&&Number.isFinite(mesh[i+1])&&Number.isFinite(mesh[i+2]));
      assert.ok(mesh[i]>=cx*CHUNK_SIZE&&mesh[i]<(cx+1)*CHUNK_SIZE);
      assert.ok(mesh[i+2]>=cz*CHUNK_SIZE&&mesh[i+2]<(cz+1)*CHUNK_SIZE);
    }
  }
  assert.ok(broad>0&&ever>0,'both rooted silhouettes must exist');
  assert.equal(JSON.stringify(world.save()),saved,'render-only woodland may not mutate saves');
});

test('rare golden sentinel pines create taller deterministic landmarks within unchanged mesh budgets',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let sentinels=0,ordinary=0;
  for(let cx=-16;cx<=16;cx++)for(let cz=-16;cz<=16;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    assert.deepEqual(mesh,woodlandCanopyVertices(world,cx,cz,options));
    assert.ok(mesh.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
    if(woodlandSentinelChunk(cx,cz,world.seed)){
      sentinels++;
      let top=-Infinity;
      for(let i=1;i<mesh.length;i+=CANOPY_LIMITS.stride)top=Math.max(top,mesh[i]);
      const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
      assert.ok(top>terrainHeight(x,z,world.seed)+6,'sentinel silhouette rises clearly above ordinary trees');
    }else ordinary++;
  }
  assert.ok(sentinels>4&&ordinary>30,'landmarks should be sparse but present');
  assert.equal(JSON.stringify(world.save()),saved);
  assert.equal(CANOPY_LIMITS.newDrawCalls,0);
  assert.equal(woodlandSentinelChunk(-2,3,179),woodlandSentinelChunk(-2,3,179));
});
