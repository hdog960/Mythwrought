// Exact geometry parity and bounded-work proof for iPhone underground mining.
// All reference meshes use the real production mesher with a fresh world reader.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {meshDepthSection,meshDepthSectionUpdate,discardDepthMeshCache} from '../src/depth-mesh.mjs';
import {BIOME130_REGISTERED_IDS} from '../src/biome130-registry.mjs';
import {sectionForY,verticalEditSections,WORLD_MIN_Y} from '../src/depth.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';

function uncachedReader(world){
  return {get:(...p)=>world.get(...p),
    rotationAt:(...p)=>world.rotationAt?.(...p)??0,
    getPack2State:(...p)=>world.getPack2State?.(...p)??null};
}
function parity(world,cell){
  const [x,y,z]=cell;
  for(const section of verticalEditSections(y))
    for(const {cx,cz} of editAffectedChunks(x,z)){
      if(section===0)continue;
      const quick=meshDepthSection(world,cx,cz,section,cell);
      const exact=meshDepthSection(uncachedReader(world),cx,cz,section);
      assert.deepEqual(quick,exact,
        'incremental vertex bytes differ at '+[cx,cz,section].join(',')+
        ' after '+cell.join(','));
    }
}
test('100 rapid deep edits retain full geometry, vertical seams and schema-1 save bytes',()=>{
  const w=new VoxelWorld(179);
  const points=[];
  for(let i=0;i<100;i++){
    const y=-11-i*2;
    if(y<WORLD_MIN_Y)break;
    const x=[0,15,16,-1,-16,-17,5][i%7];
    const z=[0,15,16,-1,-16,-17,5][(i*3)%7];
    points.push([x,y,z]);
  }
  const affected=new Map();
  for(const [x,y,z] of points){
    for(const section of verticalEditSections(y))
      for(const {cx,cz} of editAffectedChunks(x,z)){
        if(section>=0)continue;
        const k=[cx,cz,section].join(',');
        if(!affected.has(k)){
          affected.set(k,true);meshDepthSection(w,cx,cz,section);
        }
      }
    assert.equal(w.set(x,y,z,BLOCK.AIR),true);
    parity(w,[x,y,z]);
  }
  assert.equal(points.length,100);
  const raw=JSON.stringify(w.save());
  assert.equal(JSON.stringify(w.save()),raw);
  const restored=VoxelWorld.restore(JSON.parse(raw));
  for(const [x,y,z] of points)assert.equal(restored.get(x,y,z),BLOCK.AIR);
  for(const [cx,cz,section] of [...affected.keys()].slice(0,20).map(k=>k.split(',').map(Number)))
    assert.deepEqual(meshDepthSection(w,cx,cz,section),
      meshDepthSection(restored,cx,cz,section));
});

test('deep rotated biome130 physical shapes use exact neighbor culling',()=>{
  const world=new VoxelWorld(314159),x=15,z=15,y=-68,section=sectionForY(y);
  for(const cx of [0,1])for(const cz of [0,1])
    meshDepthSection(world,cx,cz,section);
  world.set(x,y,z,BLOCK.AIR);
  parity(world,[x,y,z]);
  world.set(x,y,z,BIOME130_REGISTERED_IDS.at(-1),2);
  parity(world,[x,y,z]);
  world.set(x,y,z,BLOCK.DEEPSTONE);
  parity(world,[x,y,z]);
});

test('Pack 2 water and shaped overlays preserve exact physical deep geometry',()=>{
  const base=new VoxelWorld(-54),world=new Pack2LiveWorld(base);
  const cell=[4,-91,4],section=sectionForY(cell[1]);
  base.set(...cell,BLOCK.AIR);
  meshDepthSection(world,0,0,section);
  assert.equal(world.placePack2(...cell,76,{}),true);
  parity(world,cell);
  assert.equal(world.set(...cell,BLOCK.AIR),true);
  parity(world,cell);
});

test('discard after failed GPU staging and world replacement cannot reuse stale columns',()=>{
  const world=new VoxelWorld(179),cell=[1,-100,1],section=sectionForY(cell[1]);
  const pristine=meshDepthSection(world,0,0,section);
  world.set(...cell,BLOCK.AIR);
  const changed=meshDepthSection(world,0,0,section,cell);
  assert.notDeepEqual(changed,pristine);
  world.set(...cell,BLOCK.DEEPSTONE);
  discardDepthMeshCache(world);
  assert.deepEqual(meshDepthSection(world,0,0,section,cell),pristine);
  const other=new VoxelWorld(179);
  other.set(...cell,BLOCK.AIR);
  assert.deepEqual(meshDepthSection(other,0,0,section),
    meshDepthSection(uncachedReader(other),0,0,section));
});

test('reused column cache avoids full deep section reads on a mining edit',()=>{
  const source=new VoxelWorld(179);
  let reads=0;
  const reader={get:(...p)=>{reads++;return source.get(...p);},
    rotationAt:(...p)=>source.rotationAt(...p)};
  meshDepthSection(reader,0,0,-5);
  const fullReads=reads;
  source.set(8,-71,8,BLOCK.AIR);
  reads=0;
  const quick=meshDepthSection(reader,0,0,-5,[8,-71,8]);
  const partialReads=reads;
  assert.deepEqual(quick,meshDepthSection(uncachedReader(source),0,0,-5));
  assert.ok(fullReads>2000,'baseline scanned a real full section: '+fullReads);
  assert.ok(partialReads<fullReads/3,
    'incremental mesher unexpectedly reread full chunk: '+partialReads+'/'+fullReads);
});

test('GPU no-op suppression only fires for byte-identical opaque geometry',()=>{
  const world=new VoxelWorld(179),cell=[7,-72,7],section=sectionForY(cell[1]);
  meshDepthSection(world,0,0,section);
  // A fully enclosed change between two solid materials cannot change a face.
  assert.equal(world.set(...cell,BLOCK.STONE),true);
  const solid=meshDepthSectionUpdate(world,0,0,section,cell);
  assert.equal(solid.changed,false,'occluded solid material should not cause a GPU upload');
  assert.deepEqual(solid.vertices,meshDepthSection(uncachedReader(world),0,0,section));
  // Opening the same cell must change its exposed faces.
  assert.equal(world.set(...cell,BLOCK.AIR),true);
  const opened=meshDepthSectionUpdate(world,0,0,section,cell);
  assert.equal(opened.changed,true,'air shaft must update its GPU mesh');
  assert.deepEqual(opened.vertices,meshDepthSection(uncachedReader(world),0,0,section));
  // Closing restores exact geometry; repeat never returns phantom same values.
  assert.equal(world.set(...cell,BLOCK.DEEPSTONE),true);
  const closed=meshDepthSectionUpdate(world,0,0,section,cell);
  assert.equal(closed.changed,true);
  assert.deepEqual(closed.vertices,meshDepthSection(uncachedReader(world),0,0,section));
});

test('water edits are not mistaken for safe GPU no-ops when opaque faces match',()=>{
  const base=new VoxelWorld(179),world=new Pack2LiveWorld(base),cell=[8,-92,8];
  const section=sectionForY(cell[1]);
  assert.equal(base.set(...cell,BLOCK.AIR),true);
  meshDepthSection(world,0,0,section);
  assert.equal(world.placePack2(...cell,76,{}),true);
  const changed=meshDepthSectionUpdate(world,0,0,section,cell);
  // Water lives in an independent GPU pass, so unchanged opaque geometry is
  // expected. The game's edit path must separately upload the water buffer.
  assert.equal(changed.changed,false);
  assert.ok(world.pack2Cells.size>0);
});
