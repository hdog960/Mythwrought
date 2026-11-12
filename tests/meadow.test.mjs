import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,terrainHeight,meshChunk} from '../src/voxel.mjs';
import {meadowAccentVertices,MEADOW_MATERIALS} from '../src/meadow.mjs';

const accents=(w,cx,cz)=>meadowAccentVertices(w,cx,cz,{
  chunkSize:CHUNK_SIZE,heightAt:terrainHeight,grass:BLOCK.GRASS,air:BLOCK.AIR
});
const xyzs=mesh=>Array.from({length:mesh.length/9},(_,i)=>[mesh[i*9],mesh[i*9+1],mesh[i*9+2],mesh[i*9+8]]);
test('whimsical meadow decoration is deterministic for seeds and negative chunks',()=>{
  for(const seed of [179,0,-78123,987654321]){
    const a=new VoxelWorld(seed),b=new VoxelWorld(seed);
    for(const [x,z] of [[0,0],[-1,-1],[1,-2]]){
      const first=accents(a,x,z),second=accents(b,x,z);
      assert.deepEqual(first,second,'Meadow decoration changed for identical seed');
      assert.equal(first.length%27,0);
      assert.ok(first.length/9<=MEADOW_MATERIALS.maxAccents*36,
        'Exceeded bounded per-chunk geometry budget');
      assert.ok(Array.from(first).every(Number.isFinite),'Invalid mesh coordinate/color');
      for(const [vx,vy,vz,id] of xyzs(first)){
        assert.ok(vx>=x*CHUNK_SIZE&&vx<=(x+1)*CHUNK_SIZE);
        assert.ok(vz>=z*CHUNK_SIZE&&vz<=(z+1)*CHUNK_SIZE);
        assert.ok([7,8,9].includes(id),'A visual-only material must stay out of save IDs');
        assert.ok(vy>=-2&&vy<=16);
      }
    }
  }
});
test('meadow accents are render-only, and survive exact original schema-1 export and restore',()=>{
  const w=new VoxelWorld(179),before=JSON.stringify(w.save());
  const foliage=accents(w,0,0);
  assert.ok(foliage.length>0,'Default world lost meadow decoration');
  assert.ok(xyzs(foliage).some(row=>row[3]===8),'Default seed has no flower heads');
  assert.equal(JSON.stringify(w.save()),before,'Generating decoration mutated a world');
  const copy=VoxelWorld.restore(JSON.parse(before));
  assert.deepEqual(accents(copy,0,0),foliage);
  assert.equal(copy.save().schema,1);
  assert.equal(w.get(0,20,0),BLOCK.AIR,'Visual accents were treated as physical voxels');
});
test('mining a flower anchor removes that decoration without changing other plants',()=>{
  const w=new VoxelWorld(179),all=accents(w,0,0);
  const [vx,vy,vz]=xyzs(all)[0];
  const x=Math.floor(vx),z=Math.floor(vz),y=terrainHeight(x,z,w.seed);
  assert.equal(w.get(x,y,z),BLOCK.GRASS);
  const before=JSON.stringify(w.save());
  assert.equal(w.set(x,y,z,BLOCK.AIR),true);
  const mined=accents(w,0,0);
  assert.ok(mined.length<all.length,'Flower remained after its supporting block was mined');
  assert.notEqual(JSON.stringify(w.save()),before);
  assert.equal(w.set(x,y,z,BLOCK.GRASS),true);
  assert.deepEqual(accents(w,0,0),all,'Original blossom must return after restoring original grass');
  assert.equal(JSON.stringify(w.save()),before,'Restoring original block left a phantom edit');
  assert.equal(w.set(x,y+1,z,BLOCK.STONE),true);
  assert.ok(accents(w,0,0).length<all.length,'Flower clipped through added construction');
});
test('meadow mesh uses existing chunk buffer with no new physical block IDs',()=>{
  const w=new VoxelWorld(179),before=JSON.stringify(w.save());
  const mesh=meshChunk(w,-1,0),flora=accents(w,-1,0);
  assert.equal(mesh.length%9,0);
  assert.ok(mesh.length>flora.length);
  assert.deepEqual(mesh.slice(-flora.length),flora,
    'Visual accents must share the same mesh buffer as the editable voxels');
  assert.equal(JSON.stringify(w.save()),before,'Rendering changed original schema-1 bytes');
  assert.equal(w.set(0,15,0,7),false,'Visual-only ID accidentally became storable');
  assert.equal(w.edits.size,0,'Decorations must not create edits');
});
test('flowers do not grow through ceiling blocks, and density stays finite at seams',()=>{
 const w=new VoxelWorld(-31);
 for(const [cx,cz] of [[0,0],[-1,0],[0,-1],[-2,-2]]){
   const a=accents(w,cx,cz);
   assert.ok(a.length<=MEADOW_MATERIALS.maxAccents*36*9);
 }
 assert.throws(()=>meadowAccentVertices(w,0.5,0,{heightAt:terrainHeight}),/Invalid/);
 assert.throws(()=>meadowAccentVertices({},0,0,{heightAt:terrainHeight}),/Invalid/);
});

test('flower artwork has sculpted tapered petals rather than flat rectangular cards',()=>{
 const w=new VoxelWorld(179),foliage=accents(w,0,0);
 const flower=xyzs(foliage).find(row=>row[3]===8);
 assert.ok(flower,'Expected original colorful flowers');
 const bx=Math.floor(flower[0]),bz=Math.floor(flower[2]);
 const petals=[];
 for(let i=0;i<foliage.length;i+=9){
   if(foliage[i+8]===8&&Math.floor(foliage[i])===bx&&Math.floor(foliage[i+2])===bz)
     petals.push([foliage[i],foliage[i+1],foliage[i+2]]);
 }
 assert.equal(petals.length,12,'A blossom needs four distinct triangular petals');
 assert.ok(new Set(petals.map(p=>p[1])).size>=3,'Petals must taper in height, not form square cards');
 assert.ok(Math.max(...petals.map(p=>p[0]))-Math.min(...petals.map(p=>p[0]))<.5);
 assert.ok(Math.max(...petals.map(p=>p[2]))-Math.min(...petals.map(p=>p[2]))<.5);
});
