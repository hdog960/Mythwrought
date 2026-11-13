import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight,meshChunk,CHUNK_SIZE} from '../src/voxel.mjs';
import {woodlandCanopyVertices,woodlandTreeStyle,CANOPY_LIMITS} from '../src/canopy.mjs';

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

test('woodland floor detail uses decorative foliage and stone facets within GPU and save budgets',()=>{
  const world=new VoxelWorld(179),saved=JSON.stringify(world.save());
  let found=false,stone=false,foliage=false;
  for(let cx=-6;cx<=6;cx++)for(let cz=-6;cz<=6;cz++){
    const vertices=woodlandCanopyVertices(world,cx,cz,options);
    if(!vertices.length)continue;
    found=true;
    for(let i=0;i<vertices.length;i+=CANOPY_LIMITS.stride){
      const material=vertices[i+8];
      if(material===3)stone=true;
      if(material===7)foliage=true;
      assert.ok(Number.isFinite(material));
    }
    assert.ok(vertices.length<=CANOPY_LIMITS.maxTreesPerChunk*CANOPY_LIMITS.maxVerticesPerTree*CANOPY_LIMITS.stride);
  }
  assert.ok(found&&stone&&foliage,'seeded woodland includes grounded stone and foliage');
  assert.equal(JSON.stringify(world.save()),saved,'visual forest floor never mutates schema-1 edits');
});

// The broadleaf uses the tightest authored vertex budget; test its exact
// standalone allocation so future decoration cannot hide behind a sparse tree.
test('individual broadleaf mesh respects the 450-vertex cap even when alone',()=>{
  const world=new VoxelWorld(179);
  let inspected=0;
  for(let cx=-8;cx<=8;cx++)for(let cz=-8;cz<=8;cz++){
    const mesh=woodlandCanopyVertices(world,cx,cz,options);
    if(!mesh.length)continue;
    const x=Math.floor(mesh[0]),z=Math.floor(mesh[2]);
    if(woodlandTreeStyle(x,z,world.seed)!=='broadleaf')continue;
    // Remove every other tree's natural grass anchor in this chunk, leaving
    // the first authored broadleaf. This must not alter the persisted fixture.
    const h=terrainHeight(x,z,world.seed);
    const isolated=new VoxelWorld(179);
    for(let dx=0;dx<CHUNK_SIZE;dx++)for(let dz=0;dz<CHUNK_SIZE;dz++){
      const px=cx*CHUNK_SIZE+dx,pz=cz*CHUNK_SIZE+dz;
      if(px===x&&pz===z)continue;
      const py=terrainHeight(px,pz,world.seed);
      if(isolated.get(px,py,pz)===BLOCK.GRASS)isolated.set(px,py,pz,BLOCK.AIR);
    }
    const solo=woodlandCanopyVertices(isolated,cx,cz,options);
    assert.ok(solo.length>0,'the selected broadleaf survives isolation');
    assert.ok(solo.length/CANOPY_LIMITS.stride<=CANOPY_LIMITS.maxVerticesPerTree);
    inspected++;
    if(inspected===3)return;
  }
  assert.ok(inspected>0,'seeded world contains broadleaf fixtures');
});
