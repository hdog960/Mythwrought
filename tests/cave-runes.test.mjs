import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,terrainHeight,baseBlock,WORLD_MIN_Y,WORLD_MAX_Y,meshChunk} from '../src/voxel.mjs';
import {caveRuneVertices,CAVE_RUNE_LIMITS} from '../src/cave-runes.mjs';
const runes=(w,cx,cz)=>caveRuneVertices(w,cx,cz,{
  chunkSize:CHUNK_SIZE,minY:WORLD_MIN_Y,maxY:WORLD_MAX_Y,
  heightAt:terrainHeight,baseAt:baseBlock,
  air:BLOCK.AIR,stone:BLOCK.STONE,ore:BLOCK.ORE
});
const vertices=v=>Array.from({length:v.length/9},(_,i)=>
  [v[i*9],v[i*9+1],v[i*9+2],v[i*9+8]]);
test('original stone-wall glyphs are seed-stable, bounded and never mutate saved worlds',()=>{
  let visible=0;const variants=new Set();
  for(const seed of [179,0,-578,987123]){
    const a=new VoxelWorld(seed),b=new VoxelWorld(seed),before=JSON.stringify(a.save());
    for(const [cx,cz] of [[0,0],[-1,-1],[1,0],[-2,1],[1,-2]]){
      const first=runes(a,cx,cz),second=runes(b,cx,cz);
      assert.deepEqual(first,second);
      assert.equal(first.length%9,0);
      assert.ok(first.length<=CAVE_RUNE_LIMITS.maxSigilsPerChunk*
        CAVE_RUNE_LIMITS.verticesPerSigil*9);
      assert.ok([...first].every(Number.isFinite));
      for(const [x,y,z,id] of vertices(first)){
        // An intentionally offset wall face can sit +/- .008 outside its
        // owning x/z coordinate; no neighboring chunk GPU geometry is owned.
        assert.ok(x>=cx*16-.012&&x<=(cx+1)*16+.012);
        assert.ok(z>=cz*16-.012&&z<=(cz+1)*16+.012);
        assert.ok(CAVE_RUNE_LIMITS.materials.includes(id));
        assert.ok(y>=WORLD_MIN_Y&&y<=WORLD_MAX_Y+1);
        variants.add(id);
      }
      visible+=first.length;
    }
    assert.equal(JSON.stringify(a.save()),before,'Rendering a rune changed canonical save bytes');
  }
  assert.ok(visible>0,'No natural original cave-wall glyphs in tested seeds');
  assert.deepEqual(CAVE_RUNE_LIMITS.materials,[13,14]);
});
test('mining an original glyph wall removes its render-only art and restores it on undo',()=>{
  const world=new VoxelWorld(179);
  let example=null;
  for(let cx=-2;cx<=2&&!example;cx++)for(let cz=-2;cz<=2&&!example;cz++){
    const geom=runes(world,cx,cz);
    if(!geom.length)continue;
    // First vertex is on an offset natural rock wall; floor gives physical
    // wall cell after epsilon correction.
    const p=vertices(geom)[0];
    const faceInfo=[ [1,0],[-1,0],[0,1],[0,-1] ];
    for(const [dx,dz] of faceInfo){
      const x=Math.floor(p[0]-(dx===1?.012:dx===-1?-.012:0));
      const y=Math.floor(p[1]),z=Math.floor(p[2]-(dz===1?.012:dz===-1?-.012:0));
      const old=world.get(x,y,z);
      if(![BLOCK.STONE,BLOCK.ORE].includes(old))continue;
      world.set(x,y,z,BLOCK.AIR);
      const changed=runes(world,cx,cz);
      world.set(x,y,z,old);
      if(changed.length<geom.length){example={x,y,z,cx,cz,old,geom};break;}
    }
  }
  assert.ok(example,'No eligible mined rune wall was found');
  const {x,y,z,cx,cz,old,geom}=example;
  const pristine=JSON.stringify(world.save());
  assert.equal(world.set(x,y,z,BLOCK.AIR),true);
  assert.ok(runes(world,cx,cz).length<geom.length);
  const saved=JSON.stringify(world.save());
  assert.equal(VoxelWorld.restore(JSON.parse(saved)).get(x,y,z),BLOCK.AIR);
  assert.equal(world.set(x,y,z,old),true);
  assert.deepEqual(runes(world,cx,cz),geom);
  assert.equal(JSON.stringify(world.save()),pristine);
  assert.equal(world.set(x,y,z,13),false,'Art material accidentally became a physical block');
  assert.equal(world.set(x,y,z,14),false,'Art material accidentally became a physical block');
});
test('cave rune geometry is in the existing chunk GPU data and separate from seeded flora',()=>{
  const w=new VoxelWorld(179),saved=JSON.stringify(w.save());
  let found=false;
  for(const [cx,cz] of [[0,0],[-1,-1],[1,1],[-2,0]]){
    const mesh=meshChunk(w,cx,cz),actual=runes(w,cx,cz);
    assert.equal(mesh.length%9,0);
    const fromChunk=[];
    for(let i=0;i<mesh.length;i+=9)
      if(mesh[i+8]===13||mesh[i+8]===14)fromChunk.push(...mesh.subarray(i,i+9));
    assert.deepEqual(new Float32Array(fromChunk),actual);
    found ||=actual.length>0;
  }
  assert.ok(found,'No rune geom found in the active chunk mesh');
  assert.equal(JSON.stringify(w.save()),saved);
});
test('invalid placement sources or chunk coordinates fail instead of adding saved blocks',()=>{
 const w=new VoxelWorld(179);
 assert.throws(()=>caveRuneVertices(w,0.25,0,{heightAt:terrainHeight,baseAt:baseBlock}),/Invalid/);
 assert.throws(()=>caveRuneVertices(w,0,0,{heightAt:terrainHeight}),/Invalid/);
 assert.throws(()=>caveRuneVertices({},0,0,{heightAt:terrainHeight,baseAt:baseBlock}),/Invalid/);
});
