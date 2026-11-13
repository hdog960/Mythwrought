import test from 'node:test';
import assert from 'node:assert/strict';
import {meshChunk,BLOCK,CHUNK_SIZE,WORLD_MIN_Y,WORLD_MAX_Y} from '../src/voxel.mjs';

// A completely filled chunk has thousands of hidden cells. Its mesh must
// contain only the six exterior planes, regardless of buried block materials.
function filledChunk(){
  const hidden=new Map();
  return {
    seed:179,
    get(x,y,z){
      if(x<0||x>=CHUNK_SIZE||z<0||z>=CHUNK_SIZE||
         y<WORLD_MIN_Y||y>WORLD_MAX_Y)return BLOCK.AIR;
      return hidden.get(x+','+y+','+z)??BLOCK.STONE;
    },
    bury(x,y,z,id){hidden.set(x+','+y+','+z,id);}
  };
}
test('buried material edits do not change visible mesh, tint, or vertex order',()=>{
  const world=filledChunk(),before=meshChunk(world,0,0);
  const height=WORLD_MAX_Y-WORLD_MIN_Y+1;
  const expectedFaces=2*CHUNK_SIZE*CHUNK_SIZE+4*CHUNK_SIZE*height;
  assert.equal(before.length,expectedFaces*6*9);
  world.bury(7,8,7,BLOCK.WOOD);
  world.bury(8,9,8,BLOCK.CRYSTAL);
  assert.deepEqual(meshChunk(world,0,0),before);
});
test('opening a buried block exposes exactly six new faces with valid material colors',()=>{
  const world=filledChunk(),before=meshChunk(world,0,0);
  world.bury(7,8,7,BLOCK.AIR);
  const after=meshChunk(world,0,0);
  assert.equal(after.length-before.length,6*6*9);
  for(let i=0;i<after.length;i+=9){
    assert.ok(Number.isFinite(after[i+3])&&Number.isFinite(after[i+4])&&Number.isFinite(after[i+5]));
    assert.ok(after[i+3]>=0&&after[i+3]<=1);
  }
});
