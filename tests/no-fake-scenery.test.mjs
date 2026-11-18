// Creator-approved meaning of geometry cleanup: remove visual-only props
// from LIVE play, retain all real editable voxels and saved world geometry.
// Source generators remain available for historical tests and conversion work.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,meshChunk,terrainHeight,baseBlock} from '../src/voxel.mjs';
import {woodlandCanopyVertices} from '../src/canopy.mjs';
import {meadowAccentVertices} from '../src/meadow.mjs';
import {storybookGroveVertices} from '../src/grove.mjs';
import {liveVoxelDistrict} from '../src/live-voxel-world.mjs';

const FAKE_MATERIAL_TAGS=new Set([7,8,9,10,11,12,13,14,15,16,17]);
const meshTags=mesh=>new Set(Array.from({length:mesh.length/9},(_,i)=>mesh[i*9+8]));

test('live chunk meshes contain no unbreakable decorative geometry tags',()=>{
  const w=new VoxelWorld(179),before=JSON.stringify(w.save());
  let solidVertices=0,physicalLeafFaces=0,physicalWoodFaces=0;
  for(const [cx,cz] of [[0,0],[-1,0],[0,-1],[1,1],[-2,1]]){
    const mesh=meshChunk(w,cx,cz),tags=meshTags(mesh);
    assert.equal(mesh.length%9,0);
    assert.ok(mesh.every(Number.isFinite));
    assert.ok(mesh.length>0,'existing playable terrain must remain visible');
    for(const tag of FAKE_MATERIAL_TAGS)
      assert.equal(tags.has(tag),false,'unmineable art tag '+tag+' reentered live mesh');
    physicalLeafFaces+=Array.from({length:mesh.length/9},(_,i)=>mesh[i*9+8])
      .filter(id=>id===18).length;
    physicalWoodFaces+=Array.from({length:mesh.length/9},(_,i)=>mesh[i*9+8])
      .filter(id=>id===BLOCK.WOOD).length;
    solidVertices+=mesh.length/9;
  }
  assert.ok(solidVertices>500,'real terrain faces remain visible');
  // Source-selected district trees can be outside the five sampled chunks.
  // Find an ACTUAL visible tree in the original deterministic seeded district
  // and inspect that exact active chunk instead of relying on a lucky region.
  const scene=liveVoxelDistrict(w.seed,0,0,(x,y,z)=>w.legacyBlockAt(x,y,z));
  const tree=scene.trees.find(t=>t.cells.some(row=>row[3]===BLOCK.LEAVES));
  assert.ok(tree,'known original live district retains a physical harvestable tree');
  const [lx,ly,lz]=tree.cells.find(row=>row[3]===BLOCK.LEAVES);
  const leafMesh=meshChunk(w,Math.floor(lx/16),Math.floor(lz/16));
  assert.ok(meshTags(leafMesh).has(18),
    'actual seeded physical leaf face stays in the playable mesh');
  assert.ok(physicalWoodFaces>0||meshTags(leafMesh).has(BLOCK.WOOD),
    'actual seeded physical timber remains visible');
  assert.equal(JSON.stringify(w.save()),before,
    'geometry cleanup must not persist an invisible world edit');
});

test('old decorative generators are retained as inert source references only',()=>{
  const w=new VoxelWorld(179);
  const option={heightAt:terrainHeight,baseAt:baseBlock};
  let oldDecorations=0;
  for(let cx=-2;cx<=2;cx++)for(let cz=-2;cz<=2;cz++){
    oldDecorations+=woodlandCanopyVertices(w,cx,cz,option).length;
    oldDecorations+=storybookGroveVertices(w,cx,cz,option).length;
    oldDecorations+=meadowAccentVertices(w,cx,cz,{heightAt:terrainHeight}).length;
    const realMesh=meshChunk(w,cx,cz);
    for(let i=8;i<realMesh.length;i+=9)
      assert.ok(!FAKE_MATERIAL_TAGS.has(realMesh[i]),
        'prototype decoration must never be added to actual renderer');
  }
  assert.ok(oldDecorations>0,'keep archived procedural prototypes available for :48 conversion');
  assert.equal(w.edits.size,0);
});

test('physical leaf mining, save and restoration remain exactly functional',()=>{
  const w=new VoxelWorld(179),before=JSON.stringify(w.save());
  const scene=liveVoxelDistrict(w.seed,0,0,(x,y,z)=>w.legacyBlockAt(x,y,z));
  const leaf=scene.trees.flatMap(t=>t.cells).find(row=>row[3]===BLOCK.LEAVES);
  assert.ok(leaf,'find real seeded editable foliage');
  const [x,y,z]=leaf;
  assert.equal(w.edits.size,0);
  assert.equal(w.set(x,y,z,BLOCK.AIR),true);
  assert.equal(w.get(x,y,z),BLOCK.AIR);
  const saved=w.save();
  assert.equal(saved.schema,1);
  assert.ok(saved.edits.some(row=>row[0]===x&&row[1]===y&&row[2]===z&&row[3]===BLOCK.AIR));
  assert.equal(VoxelWorld.restore(saved).get(x,y,z),BLOCK.AIR);
  assert.equal(w.set(x,y,z,BLOCK.LEAVES),true);
  assert.equal(JSON.stringify(w.save()),before,'restoring generated leaf makes no phantom edit');
});
