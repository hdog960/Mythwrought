import {moonbellVertices} from '../src/moonbells.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,terrainHeight,baseBlock,meshChunk} from '../src/voxel.mjs';
import {storybookGroveVertices,GROVE_LIMITS} from '../src/grove.mjs';
import {meadowAccentVertices} from '../src/meadow.mjs';
import {grottoAccentVertices} from '../src/grotto.mjs';
import {caveRuneVertices} from '../src/cave-runes.mjs';

const grove=(world,cx,cz)=>storybookGroveVertices(world,cx,cz,{
  chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,
  grass:BLOCK.GRASS,air:BLOCK.AIR
});
const coords=v=>Array.from({length:v.length/9},(_,i)=>[
  v[9*i],v[9*i+1],v[9*i+2],v[9*i+8]
]);
const findFirst=(world)=>{
  for(let cz=-2;cz<=2;cz++)for(let cx=-2;cx<=2;cx++){
    const foliage=grove(world,cx,cz);
    if(foliage.length){
      const first=coords(foliage)[0];
      return {cx,cz,foliage,anchor:[Math.floor(first[0]),Math.floor(first[2])]};
    }
  }
  throw Error('No generated original surface groves in five-by-five view');
};
test('original garden composition is seeded and bounded across negative and positive chunks',()=>{
  for(const seed of [179,0,-184,987654321,-2147483648]){
    const w=new VoxelWorld(seed),copy=new VoxelWorld(seed);
    let count=0;
    for(const [cx,cz] of [[-2,-1],[-1,-1],[0,0],[1,-2],[1,1]]){
      const one=grove(w,cx,cz),two=grove(copy,cx,cz);
      assert.deepEqual(one,two,'Same seed/chunk must reproduce authored art');
      assert.equal(one.length%27,0,'Every sculpted leaf must be a triangle');
      assert.ok(one.length/9<=GROVE_LIMITS.maxClumpsPerChunk*GROVE_LIMITS.maxVerticesPerClump);
      assert.ok(Array.from(one).every(Number.isFinite));
      for(const [x,y,z,id] of coords(one)){
        assert.ok(x>=cx*16&&x<=(cx+1)*16,'Leaf escaped chunk x');
        assert.ok(z>=cz*16&&z<=(cz+1)*16,'Leaf escaped chunk z');
        assert.ok(y>-2&&y<16,'Unexpected vertical extent');
        assert.ok(GROVE_LIMITS.materialIds.includes(id),'Original foliage ID is not render-only');
      }
      count+=one.length;
    }
    assert.ok(count>0,'No surface foliage present in sampled terrain for seed '+seed);
  }
  assert.equal(GROVE_LIMITS.newDrawCalls,0);
  assert.equal(GROVE_LIMITS.newTextures,0);
});
test('new groves are anchored only to untouched natural grass and edit away reversibly',()=>{
  const w=new VoxelWorld(179),original=JSON.stringify(w.save());
  const {cx,cz,foliage,anchor:[x,z]}=findFirst(w),h=terrainHeight(x,z,w.seed);
  assert.equal(baseBlock(x,h,z,w.seed),BLOCK.GRASS);
  assert.equal(w.get(x,h,z),BLOCK.GRASS);
  assert.ok(foliage.length>=27);
  assert.equal(JSON.stringify(w.save()),original,'Rendering cannot alter schema-1 saves');
  assert.equal(w.set(x,h,z,BLOCK.AIR),true);
  const removed=grove(w,cx,cz);
  assert.ok(removed.length<foliage.length,'Mined natural grass retained foliage');
  const edit=JSON.stringify(w.save());
  assert.match(edit,/"schema":1/);
  assert.equal(VoxelWorld.restore(JSON.parse(edit)).get(x,h,z),BLOCK.AIR);
  assert.equal(w.set(x,h,z,BLOCK.GRASS),true);
  assert.deepEqual(grove(w,cx,cz),foliage,'Restored original grass should restore exact composition');
  assert.equal(JSON.stringify(w.save()),original);
  assert.equal(w.set(x,h+1,z,BLOCK.STONE),true);
  assert.ok(grove(w,cx,cz).length<foliage.length,'Placed construction overlapped foliage');
  assert.equal(w.set(x,h+1,z,BLOCK.AIR),true);
  assert.deepEqual(grove(w,cx,cz),foliage);
  assert.equal(w.set(x,h+2,z,BLOCK.WOOD),true);
  assert.ok(grove(w,cx,cz).length<foliage.length,'Overhead placed block hid garden');
  assert.equal(w.set(x,h+2,z,BLOCK.AIR),true);
  assert.deepEqual(grove(w,cx,cz),foliage);
});
test('true renderer integrates surface foliage into the existing single chunk mesh',()=>{
  const w=new VoxelWorld(179),original=JSON.stringify(w.save());
  const {cx,cz,foliage}=findFirst(w);
  const meadow=meadowAccentVertices(w,cx,cz,{heightAt:terrainHeight});
  const runes=caveRuneVertices(w,cx,cz,{
    heightAt:terrainHeight,baseAt:baseBlock,
    minY:-3,maxY:19,air:BLOCK.AIR,stone:BLOCK.STONE,ore:BLOCK.ORE
  });
  const grotto=grottoAccentVertices(w,cx,cz,{
    heightAt:terrainHeight,baseAt:baseBlock,
    minY:-3,maxY:19,air:BLOCK.AIR,stone:BLOCK.STONE,ore:BLOCK.ORE
  });
  const mesh=meshChunk(w,cx,cz);
  const moonbells=moonbellVertices(w,cx,cz,{heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR});
  const solids=mesh.length-foliage.length-meadow.length-runes.length-grotto.length-moonbells.length;
  assert.ok(solids>0,'No real voxel triangles');
  assert.deepEqual(mesh.slice(solids,solids+foliage.length),foliage,
    'Grove not integrated into actual renderer buffer');
  assert.deepEqual(mesh.slice(solids+foliage.length,solids+foliage.length+meadow.length),meadow,
    'Original meadow ordering changed');
  if(grotto.length)assert.deepEqual(mesh.slice(-grotto.length),grotto,'Original cave accents were displaced');
  assert.equal(JSON.stringify(w.save()),original);
  for(const id of GROVE_LIMITS.materialIds)assert.equal(w.set(0,15,0,id),false,
    'Render-only material ID must remain impossible to save');
  assert.equal(w.edits.size,0);
});
test('do not create physical scenery in artificial grass or blocked pockets',()=>{
  const w=new VoxelWorld(179),{anchor:[x,z],cx,cz,foliage}=findFirst(w);
  const h=terrainHeight(x,z,w.seed);
  // Original base source is required even if caller fakes grass at a different height.
  const fake={seed:w.seed,get:(a,b,c)=>b===h&&a===x&&c===z?BLOCK.GRASS:w.get(a,b,c)};
  assert.deepEqual(grove(fake,cx,cz),foliage);
  const deny={seed:w.seed,get:(a,b,c)=>a===x&&c===z&&b===h+1?BLOCK.STONE:w.get(a,b,c)};
  assert.ok(grove(deny,cx,cz).length<foliage.length);
  assert.throws(()=>storybookGroveVertices({},0,0,{heightAt:terrainHeight,baseAt:baseBlock}),/Invalid/);
  assert.throws(()=>storybookGroveVertices(w,.5,0,{heightAt:terrainHeight,baseAt:baseBlock}),/Invalid/);
});

test('sculpted blossom petals retain the exact 66-vertex per-clump safety ceiling',()=>{
  // Each authored blossom has 12 leaf-bowl, 5 inner-petal, 4 folded-petal
  // and 1 golden center triangles. No extra draw call or saved voxel exists.
  const w=new VoxelWorld(179);
  let found=false;
  for(let cz=-3;cz<=3;cz++)for(let cx=-3;cx<=3;cx++){
    const vertices=grove(w,cx,cz);
    assert.ok(vertices.length/9<=GROVE_LIMITS.maxClumpsPerChunk*66);
    if(vertices.length>0)found=true;
  }
  assert.ok(found);
  assert.equal(GROVE_LIMITS.maxVerticesPerClump,66);
  assert.equal(GROVE_LIMITS.newDrawCalls,0);
});

test('tall bellflower spires remain deterministic, nonphysical and respect overhead edits',()=>{
  const w=new VoxelWorld(179),before=JSON.stringify(w.save());
  let foundTall=false;
  for(let cz=-3;cz<=3;cz++)for(let cx=-3;cx<=3;cx++){
    const vertices=grove(w,cx,cz);
    assert.ok(vertices.length/9<=GROVE_LIMITS.maxClumpsPerChunk*66);
    const pts=coords(vertices);
    for(const [x,y,z] of pts){
      const h=terrainHeight(Math.floor(x),Math.floor(z),w.seed);
      if(y>h+2.3)foundTall=true;
    }
  }
  assert.ok(foundTall,'No tall original flowering silhouette was generated');
  assert.equal(JSON.stringify(w.save()),before);
  assert.equal(GROVE_LIMITS.newDrawCalls,0);
  assert.equal(GROVE_LIMITS.maxHeight,1.8);
});
