import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,meshChunk,CHUNK_SIZE,chunkCoord} from '../src/voxel.mjs';
import {chunkKey,editAffectedChunks,prepareSeamBatch,priorityMissingChunks} from '../src/chunks.mjs';
import {touchMovementX,touchCameraX} from '../src/input.mjs';

function isolated(points){
  const cells=new Map(points.map(p=>[p.slice(0,3).join(','),p[3]]));
  return {seed:179,get(x,y,z){return cells.get([x,y,z].join(','))??BLOCK.AIR;},
    set(x,y,z,value){if(value===BLOCK.AIR)cells.delete([x,y,z].join(','));
      else cells.set([x,y,z].join(','),value);}};
}
function planarFaces(mesh,axis,plane){
  let count=0;
  // Each visible block face is six vertices, stride nine floats per vertex.
  for(let i=0;i<mesh.length;i+=54){
    let entire=true;
    for(let j=0;j<6;j++)if(Math.abs(mesh[i+j*9+axis]-plane)>1e-7)entire=false;
    if(entire)count++;
  }
  return count;
}
test('positive and negative edit positions select only the owner and touching neighbors',()=>{
  assert.deepEqual(editAffectedChunks(6,7),[{cx:0,cz:0}]);
  assert.deepEqual(editAffectedChunks(15,7),[{cx:0,cz:0},{cx:1,cz:0}]);
  assert.deepEqual(editAffectedChunks(16,7),[{cx:1,cz:0},{cx:0,cz:0}]);
  assert.deepEqual(editAffectedChunks(-1,-16),[{cx:-1,cz:-1},{cx:0,cz:-1},{cx:-1,cz:-2}]);
  assert.deepEqual(editAffectedChunks(-16,-1),[{cx:-1,cz:-1},{cx:-2,cz:-1},{cx:-1,cz:0}]);
  assert.equal(editAffectedChunks(15,15).length,3,'No diagonal update needed for face normals');
  assert.throws(()=>editAffectedChunks(.2,1));
  assert.equal(chunkCoord(-16),-1);
  assert.equal(chunkKey(-2,3),'-2,3');
});
test('unmodified adjoining x chunks do not draw hidden interior faces',()=>{
  const world=isolated([[15,12,2,BLOCK.STONE],[16,12,2,BLOCK.STONE]]);
  const left=meshChunk(world,0,0),right=meshChunk(world,1,0);
  assert.equal(planarFaces(left,0,16),0);
  assert.equal(planarFaces(right,0,16),0);
  assert.equal(left.length/54,5);
  assert.equal(right.length/54,5);
  world.set(16,12,2,BLOCK.AIR);
  assert.equal(planarFaces(meshChunk(world,0,0),0,16),1,'Mining right neighbor exposes precisely left +X face');
  assert.equal(planarFaces(meshChunk(world,1,0),0,16),0);
  world.set(16,12,2,BLOCK.STONE);
  assert.equal(planarFaces(meshChunk(world,0,0),0,16),0);
  assert.equal(planarFaces(meshChunk(world,1,0),0,16),0);
  world.set(15,12,2,BLOCK.AIR);
  assert.equal(planarFaces(meshChunk(world,1,0),0,16),1,'Mining left neighbor exposes precisely right -X face');
});
test('z seam, diagonal neighbor and negative seam do not create phantom faces',()=>{
  const world=isolated([[2,9,-1,BLOCK.CRYSTAL],[2,9,0,BLOCK.CRYSTAL],
    [-1,9,5,BLOCK.STONE],[0,9,5,BLOCK.STONE]]);
  assert.equal(planarFaces(meshChunk(world,0,-1),2,0),0);
  assert.equal(planarFaces(meshChunk(world,0,0),2,0),0);
  assert.equal(planarFaces(meshChunk(world,-1,0),0,0),0);
  assert.equal(planarFaces(meshChunk(world,0,0),0,0),0);
  world.set(2,9,0,BLOCK.AIR);
  assert.equal(planarFaces(meshChunk(world,0,-1),2,0),1);
  world.set(-1,9,5,BLOCK.AIR);
  assert.equal(planarFaces(meshChunk(world,0,0),0,0),1);
});
test('edit batch regenerates exactly loaded bordering chunks without mutating maps',()=>{
  const world=isolated([[15,10,0,BLOCK.STONE],[16,10,0,BLOCK.STONE]]);
  const loaded=new Map([['0,0',{buffer:1}],['1,0',{buffer:2}],['0,-1',{buffer:3}]]);
  let calls=0;
  const batch=prepareSeamBatch(world,loaded,15,0,(w,cx,cz)=>{
    calls++;return meshChunk(w,cx,cz);
  });
  assert.equal(calls,3);
  assert.deepEqual(batch.map(x=>x.key),['0,0','1,0','0,-1']);
  assert.ok(batch.every(x=>x.vertices instanceof Float32Array));
  assert.equal(loaded.size,3);
  assert.equal(loaded.get('0,0').buffer,1);
  const interior=prepareSeamBatch(world,loaded,5,8);
  assert.deepEqual(interior.map(x=>x.key),['0,0']);
  assert.deepEqual(prepareSeamBatch(world,new Map(),15,0),[]);
});
test('correct seed/edit serialization preserves seamless border samples',()=>{
  const world=new VoxelWorld(-137);
  for(const x of [-17,-16,-1,0,15,16,31,32])for(const z of [-17,-16,-1,0,15,16,31,32])
    world.set(x,18,z,(x+z)%2===0?BLOCK.CRYSTAL:BLOCK.WOOD);
  const reloaded=VoxelWorld.restore(world.save());
  assert.deepEqual(reloaded.save(),world.save());
  for(const x of [-17,-16,-1,0,15,16,31,32])for(const z of [-17,-16,-1,0,15,16,31,32])
    assert.equal(world.get(x,18,z),reloaded.get(x,18,z));
  const a=meshChunk(world,-1,0),b=meshChunk(reloaded,-1,0);
  assert.deepEqual(a,b);
});
test('one-frame generation queue sorts nearest first including signed coordinates',()=>{
  const m=new Map([['4,4',[4,4]],['0,0',[0,0]],['-1,-1',[-1,-1]],['2,0',[2,0]]]);
  const sorted=priorityMissingChunks(m,-1,-1);
  assert.equal(sorted[0][0],'-1,-1');
  assert.deepEqual(sorted.map(x=>x[0]),['-1,-1','0,0','2,0','4,4']);
  assert.equal(m.size,4);
});
test('touch horizontal directions corrected for both sticks; vertical unchanged',()=>{
  assert.equal(touchMovementX(.75),-.75);
  assert.equal(touchMovementX(-.75),.75);
  assert.equal(touchCameraX(32),-32);
  assert.equal(touchCameraX(-32),32);
  assert.equal(touchMovementX(0),0);
  assert.equal(touchCameraX(0),0);
  assert.throws(()=>touchMovementX(NaN));
  assert.throws(()=>touchCameraX(Infinity));
});
