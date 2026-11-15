import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,baseBlock,terrainHeight,meshChunk,collides,raycast,CHUNK_SIZE} from '../src/voxel.mjs';
import {liveVoxelDistrict,LIVE_DISTRICT_SIZE,LIVE_DISTRICT_CACHE_LIMIT} from '../src/live-voxel-world.mjs';
import {caveRoute} from '../src/experimental-cave-route.mjs';

const district=(world,dx,dz)=>liveVoxelDistrict(world.seed,dx,dz,
  (x,y,z)=>world.legacyBlockAt(x,y,z));

test('integration-008 seeded world visibly includes multiple real voxel trees without save edits',()=>{
  const world=new VoxelWorld(179),before=JSON.stringify(world.save());
  const scene=district(world,0,0);
  assert.ok(scene.trees.length>=3,'several real trees near the initial explorable district');
  assert.ok(scene.blockCount>100,'voxel geometry rather than decorative triangles');
  assert.ok(new Set(scene.trees.map(p=>p.variant)).size>=2,'multiple silhouettes');
  let touched=0;
  for(const tree of scene.trees.slice(0,4)){
    assert.ok(tree.cells.some(c=>c[3]===BLOCK.WOOD));
    assert.ok(tree.cells.some(c=>c[3]===BLOCK.LEAVES));
    for(const [x,y,z,id] of tree.cells){
      assert.equal(world.get(x,y,z),id,'world.get exposes all tree voxels');
      assert.ok(id<=BLOCK.DEEPSTONE,'registered 8-bit block IDs only');
      touched++;
    }
  }
  assert.ok(touched>60);
  assert.equal(JSON.stringify(world.save()),before,'worldgen never writes schema-1 edits');
});

test('new live tree blocks are collidable, raycastable, mineable and persistent',()=>{
  const world=new VoxelWorld(179),scene=district(world,0,0);
  const tree=scene.trees[0],trunk=tree.cells.find(c=>c[3]===BLOCK.WOOD);
  assert.ok(trunk);
  const [x,y,z,id]=trunk;
  assert.equal(world.get(x,y,z),BLOCK.WOOD);
  assert.equal(collides(world,x+.5,y,z+.5),true);
  assert.deepEqual(raycast(world,[x+.5,y+.5,z+.5],[0,0,1],2)?.hit,[x,y,z]);
  assert.ok(meshChunk(world,Math.floor(x/CHUNK_SIZE),Math.floor(z/CHUNK_SIZE)).length>0);
  assert.equal(world.set(x,y,z,BLOCK.AIR),true);
  assert.equal(world.get(x,y,z),BLOCK.AIR);
  assert.equal(VoxelWorld.restore(world.save()).get(x,y,z),BLOCK.AIR);
  assert.equal(world.set(x,y,z,id),true);
  assert.equal(world.get(x,y,z),id);
  assert.equal(world.edits.has(x+','+y+','+z),false);
});

test('two actual connected cave branches per seeded district are readable in gameplay',()=>{
  for(const seed of [179,917,-184]){
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const scene=district(world,0,0);
    assert.equal(scene.caves.length,2);
    for(const origin of scene.caves){
      const {floorAt}=caveRoute(seed,origin);
      for(const t of [1,2,3,8,14,23]){
        assert.equal(world.get(origin.x+t,floorAt(t)+1,origin.z),BLOCK.AIR,
          'physical mineable canyon corridor air at t='+t);
        assert.equal(world.get(origin.x+t,floorAt(t),origin.z),BLOCK.STONE,
          'supported cave floor at t='+t);
      }
      const wingX=origin.x+origin.length-14,wingY=floorAt(origin.length-14);
      assert.equal(world.get(wingX,wingY+1,origin.z-8),BLOCK.AIR,'real connected north wing');
      assert.equal(collides(world,wingX+.5,wingY+1,origin.z-8+.5),false,
        'north wing accommodates actual player body');
    }
    assert.equal(JSON.stringify(world.save()),before);
  }
});

test('physical two-arch pilgrim court actually appears in reachable seeded districts',()=>{
  const world=new VoxelWorld(179),before=JSON.stringify(world.save());
  const scenes=[[0,0],[-1,0],[0,-1],[-1,-1]].map(([dx,dz])=>district(world,dx,dz));
  const scene=scenes.find(s=>s.court);
  assert.ok(scene,'at least one live court within adjacent districts');
  const court=scene.court;
  assert.equal(court.gates.length,2);
  for(const [x,y,z,id] of court.cells){
    assert.equal(id,BLOCK.STONE);
    assert.equal(world.get(x,y,z),id,'court physically exists in normal world');
  }
  const [x,h,z]=court.origin;
  for(let dz=-11;dz<=11;dz++){
    assert.equal(collides(world,x+.5,h+1,z+dz+.5),false,'walk-through public approach');
  }
  assert.equal(JSON.stringify(world.save()),before);
});

test('new world assets obey edits, negative bounds, world seeds and bounded caches',()=>{
  const seed=917,w=new VoxelWorld(seed),a=district(w,-1,0),b=district(new VoxelWorld(seed),-1,0);
  assert.deepEqual(a.trees,b.trees);
  assert.deepEqual(a.court,b.court);
  const tree=a.trees[0],leaf=tree?.cells.find(c=>c[3]===BLOCK.LEAVES);
  assert.ok(leaf);
  const [x,y,z,id]=leaf;
  assert.equal(w.get(x,y,z),id);
  assert.equal(w.set(x,y,z,BLOCK.STONE),true);
  assert.equal(w.get(x,y,z),BLOCK.STONE,'explicit saved placement overrides seeded tree');
  const saved=w.save(),restored=VoxelWorld.restore(saved);
  assert.deepEqual(restored.save(),saved);
  assert.equal(restored.get(x,y,z),BLOCK.STONE);
  for(let dx=-12;dx<=12;dx++)w.get(dx*LIVE_DISTRICT_SIZE+10,12,10);
  assert.ok(w.liveDistrictCache.size<=LIVE_DISTRICT_CACHE_LIMIT);
});

test('old physical landmark cells remain unchanged and spawn remains traversable',async()=>{
  const {findSafeSpawn}=await import('../src/physics.mjs');
  const {voxelLandmarksForChunk}=await import('../src/voxel-landmarks.mjs');
  const world=new VoxelWorld(179);
  const old=voxelLandmarksForChunk(-7,-5,179,{
    heightAt:terrainHeight,baseAt:baseBlock,maxY:19,
    grass:BLOCK.GRASS,air:BLOCK.AIR,stone:BLOCK.STONE,
    wood:BLOCK.WOOD,crystal:BLOCK.CRYSTAL,ore:BLOCK.ORE
  });
  for(const [key,id] of old.blocks){
    const [x,y,z]=key.split(',').map(Number);
    assert.equal(world.get(x,y,z),id,'legacy landmarks are never overwritten');
  }
  const player=findSafeSpawn(world);
  assert.ok(Number.isFinite(player.feet)&&Math.abs(player.x)<8&&Math.abs(player.z)<8);
  assert.equal(collides(world,player.x,player.feet,player.z),false);
});
