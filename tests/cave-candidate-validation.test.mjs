import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,meshChunk} from '../src/voxel.mjs';
import {caveCandidateMesh,caveTraversalTrace} from '../src/cave-candidate-validation.mjs';
import {CAVE_CANDIDATE,caveRoute} from '../src/experimental-cave-route.mjs';

for(const seed of [179,1,2026,-77]){
  test('candidate meshes and checks continuous player-body route for seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const before=JSON.stringify(world.save());
    const trace=caveTraversalTrace(world);
    assert.equal(trace.samples.length,CAVE_CANDIDATE.length+5);
    assert.deepEqual(trace.failures,[],JSON.stringify(trace.failures));
    assert.equal(trace.walkable,true);
    const cx=Math.floor(CAVE_CANDIDATE.x/CHUNK_SIZE),cz=Math.floor(CAVE_CANDIDATE.z/CHUNK_SIZE);
    const candidate=caveCandidateMesh(world,cx,cz);
    const ordinary=meshChunk(world,cx,cz);
    assert.ok(candidate instanceof Float32Array);
    assert.equal(candidate.length%9,0);
    assert.notDeepEqual(candidate,ordinary,'cave must change actual meshed voxel faces');
    assert.equal(JSON.stringify(world.save()),before,'opt-in render must never mutate saves');
    assert.deepEqual(caveTraversalTrace(new VoxelWorld(seed)),trace,'deterministic trace');
  });
}
test('placed block obstructing passage fails actual player-body traversal',()=>{
  const world=new VoxelWorld(179);
  const {x,z}=CAVE_CANDIDATE;
  const feet=caveRoute(179).floorAt(8)+1;
  assert.equal(world.set(x+8,feet,z,BLOCK.WOOD),true);
  const trace=caveTraversalTrace(world);
  assert.equal(trace.walkable,false);
  assert.ok(trace.failures.some(p=>p.x===x+8));
});
