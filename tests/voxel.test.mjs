import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,chunkCoord,chunkWindow,terrainHeight,baseBlock,meshChunk,raycast,collides,WORLD_MAX_Y} from '../src/voxel.mjs';

test('deterministic positive and negative coordinates',()=>{
  const a=new VoxelWorld(917),b=new VoxelWorld(917);
  for(let x=-39;x<39;x+=7)for(let z=-29;z<29;z+=9){
    assert.equal(terrainHeight(x,z,a.seed),terrainHeight(x,z,b.seed));
    for(let y=-3;y<19;y+=3)assert.equal(a.get(x,y,z),b.get(x,y,z));
  }
});
test('negative chunk boundaries use floor division',()=>{
  assert.equal(chunkCoord(-1),-1);assert.equal(chunkCoord(-16),-1);
  assert.equal(chunkCoord(-17),-2);assert.equal(chunkCoord(16),1);
});
test('edits survive restore and original values revert cleanly',()=>{
  const a=new VoxelWorld(440);
  const original=a.get(-5,15,19);
  assert.equal(original,BLOCK.AIR);
  a.set(-5,15,19,BLOCK.WOOD);
  a.set(5,2,5,BLOCK.AIR);
  const restored=VoxelWorld.restore(JSON.parse(JSON.stringify(a.save())));
  assert.equal(restored.get(-5,15,19),BLOCK.WOOD);
  assert.equal(restored.get(5,2,5),BLOCK.AIR);
  restored.set(-5,15,19,original);
  assert.equal(restored.edits.has('-5,15,19'),false);
});
test('invalid saves and out of bounds edits are rejected',()=>{
  const w=new VoxelWorld(1);
  assert.equal(w.set(0,WORLD_MAX_Y+1,0,BLOCK.STONE),false);
  assert.throws(()=>VoxelWorld.restore({schema:2,seed:1,edits:[]}));
  assert.throws(()=>VoxelWorld.restore({schema:1,seed:1,edits:[[0,20,0,3]]}));
});
test('chunk mesh has valid triangles and non-empty geometry',()=>{
  const a=new VoxelWorld(179);
  const mesh=meshChunk(a,-1,0);
  assert.ok(mesh.length>100);
  assert.equal(mesh.length%27,0);
  assert.ok([...mesh.slice(0,60)].every(Number.isFinite));
});
test('raycasts meet real block and report prior adjacent air',()=>{
  const a=new VoxelWorld(4);
  a.set(0,15,0,BLOCK.STONE);
  const hit=raycast(a,[.5,16.5,.5],[0,-1,0],6);
  assert.deepEqual(hit.hit,[0,15,0]);
  assert.deepEqual(hit.adjacent,[0,16,0]);
});
test('collision detects solid voxels without treating air as solid',()=>{
  const w=new VoxelWorld(4);
  w.set(0,15,0,BLOCK.STONE);
  assert.equal(collides(w,.5,15,.5),true);
  assert.equal(collides(w,.5,17,.5),false);
});

test('material vertex stride includes tile coordinates and valid material IDs',()=>{
  const data=meshChunk(new VoxelWorld(179),0,0);
  assert.equal(data.length%9,0);
  for(let i=0;i<Math.min(data.length,9*100);i+=9){
    assert.ok(data[i+6]>=0&&data[i+6]<=1);
    assert.ok(data[i+7]>=0&&data[i+7]<=1);
    assert.ok(Number.isInteger(data[i+8])&&data[i+8]>=1&&data[i+8]<=6);
  }
});
test('chunk window has unique deterministic nearest-first coordinates at negative bounds',()=>{
  const a=chunkWindow(-.5,-16.5),b=chunkWindow(-.5,-16.5);
  assert.deepEqual(a,b);
  assert.equal(a.length,25);
  assert.deepEqual(a[0],{cx:-1,cz:-2,distance:0});
  assert.equal(new Set(a.map(c=>c.cx+','+c.cz)).size,25);
  assert.throws(()=>chunkWindow(0,0,20));
});
test('seeded voxel samples are stable at positive and negative chunk boundaries',()=>{
  for(const seed of [179,-184,2147483647,-2147483648,0]){
    const one=new VoxelWorld(seed),two=VoxelWorld.restore(one.save());
    for(const x of [-33,-32,-17,-16,-1,0,15,16,31,32,48]){
      for(const z of [-18,-16,-1,0,15,16,33]){
        for(const y of [-3,0,4,8,12,19])assert.equal(one.get(x,y,z),two.get(x,y,z));
      }
    }
  }
});

test('shared chunk border does not emit interior cube faces or cracks',()=>{
  const world={seed:179,get(x,y,z){
    return y===12&&z===0&&(x===15||x===16)?BLOCK.STONE:BLOCK.AIR;
  }};
  const left=meshChunk(world,0,0),right=meshChunk(world,1,0);
  assert.equal(left.length/9,30,'Left chunk block should have 5 visible faces');
  assert.equal(right.length/9,30,'Right chunk block should have 5 visible faces');
  const leftSurface=Array.from({length:left.length/9},(_,i)=>left[i*9]).filter(x=>x===16).length;
  const rightSurface=Array.from({length:right.length/9},(_,i)=>right[i*9]).filter(x=>x===16).length;
  // Shared faces absent; vertices on x=16 still appear on the adjoining visible top/bottom/front/back faces.
  assert.ok(leftSurface>0&&rightSurface>0);
});
