import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight,baseBlock,meshChunk,raycast,collides,CHUNK_SIZE,WORLD_MAX_Y} from '../src/voxel.mjs';
import {voxelLandmarksForChunk,VOXEL_LANDMARK_KINDS,VOXEL_LANDMARK_CACHE_LIMIT} from '../src/voxel-landmarks.mjs';

const opts={heightAt:terrainHeight,baseAt:baseBlock,maxY:WORLD_MAX_Y,stone:BLOCK.STONE,wood:BLOCK.WOOD,crystal:BLOCK.CRYSTAL,ore:BLOCK.ORE};
const known={watchtower:[-7,-5],shrine:[2,-6],arch:[9,-23],causeway:[11,-11]};
const data=(cx,cz,seed=179)=>voxelLandmarksForChunk(cx,cz,seed,opts);
function firstWaystone(){
  for(let cx=-20;cx<=20;cx++)for(let cz=-20;cz<=20;cz++){
    if(((cx%4)+4)%4!==1||((cz%4)+4)%4!==2)continue;
    const found=data(cx,cz);
    if(found.sites.some(s=>s.kind==='waystone'))return [cx,cz];
  }
  throw Error('Expected a seeded waystone');
}
const sites=()=>({...known,waystone:firstWaystone()});
test('five pre-existing landmark locations now produce actual voxel templates',()=>{
  const locations=sites(),world=new VoxelWorld(179),before=world.save();
  assert.deepEqual(VOXEL_LANDMARK_KINDS,['waystone','watchtower','shrine','arch','causeway']);
  for(const kind of VOXEL_LANDMARK_KINDS){
    const [cx,cz]=locations[kind],a=data(cx,cz),b=data(cx,cz);
    assert.deepEqual(a,b,'deterministic block mapping at '+kind);
    const s=a.sites.find(s=>s.kind===kind);
    assert.ok(s,kind+' must exist at its old district position');
    assert.ok(s.voxelCount>3,kind+' must contain multiple genuine blocks');
    for(const [key,id] of a.blocks){
      const [x,y,z]=key.split(',').map(Number);
      assert.ok(x>=cx*CHUNK_SIZE&&x<(cx+1)*CHUNK_SIZE&&z>=cz*CHUNK_SIZE&&z<(cz+1)*CHUNK_SIZE);
      assert.ok(y>=0&&y<=WORLD_MAX_Y);
      assert.ok([BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL,BLOCK.ORE].includes(id));
      assert.equal(baseBlock(x,y,z,179),BLOCK.AIR,'no natural terrain overwritten');
      assert.equal(world.get(x,y,z),id,kind+' world.get must read physical voxel');
    }
  }
  assert.deepEqual(world.save(),before,'generated landmarks must not materialize save edits');
});

test('existing sites are real raycastable, collidable, editable and schema-one persistent blocks',()=>{
  const world=new VoxelWorld(179),loc=sites();
  for(const kind of VOXEL_LANDMARK_KINDS){
    const [cx,cz]=loc[kind],site=data(cx,cz),cell=[...site.blocks.keys()][0].split(',').map(Number);
    const [x,y,z]=cell,original=site.blocks.get(cell.join(','));
    assert.notEqual(world.get(x,y,z),BLOCK.AIR);
    assert.equal(collides(world,x+.5,y,z+.5),true,kind+' must physically stop player');
    const top=raycast(world,[x+.5,y+.5,z+.5],[0,0,1],1);
    assert.deepEqual(top?.hit,[x,y,z],kind+' must be targetable');
    world.set(x,y,z,BLOCK.AIR);
    assert.equal(world.get(x,y,z),BLOCK.AIR,kind+' mine must persist');
    const restored=VoxelWorld.restore(JSON.parse(JSON.stringify(world.save())));
    assert.equal(restored.save().schema,1);
    assert.equal(restored.get(x,y,z),BLOCK.AIR,kind+' mined cell must remain absent');
    world.set(x,y,z,original);
    assert.equal(world.get(x,y,z),original);
    assert.ok(!world.edits.has(cell.join(',')),'restoring generated voxel clears edit override');
  }
});
test('the center of a ruined watchtower and pilgrim arch remains freely walkable',()=>{
  const w=new VoxelWorld(179);
  for(const kind of ['watchtower','arch']){
    const [cx,cz]=known[kind],{sites}=data(cx,cz);
    const {x,z,groundY:h}=sites.find(s=>s.kind===kind);
    for(let dy=1;dy<=3;dy++){
      assert.equal(w.get(x,h+dy,z),BLOCK.AIR,kind+' central entrance obstructed');
    }
    assert.equal(collides(w,x+.5,h+1,z+.5),false,kind+' cannot be entered');
  }
});
test('edits at landmark sites override generated voxels without deleting neighboring parts',()=>{
  const w=new VoxelWorld(179),[cx,cz]=known.watchtower,grid=data(cx,cz);
  const cells=[...grid.blocks].map(([k,id])=>({coord:k.split(',').map(Number),id}));
  const [a,b]=cells;const [x,y,z]=a.coord;
  const beforeB=w.get(...b.coord);
  assert.equal(w.set(x,y,z,BLOCK.AIR),true);
  assert.equal(w.get(x,y,z),BLOCK.AIR);
  assert.equal(w.get(...b.coord),beforeB,'mining one pillar cannot erase whole landmark');
  assert.equal(w.set(x,y,z,BLOCK.WOOD),true);
  assert.equal(w.get(x,y,z),BLOCK.WOOD);
  assert.equal(VoxelWorld.restore(w.save()).get(x,y,z),BLOCK.WOOD);
});
test('voxel landmarks have no extra decorative mesh pass, while chunk rebuild reacts to edits',()=>{
  const w=new VoxelWorld(179),[cx,cz]=firstWaystone(),site=data(cx,cz);
  const mesh=meshChunk(w,cx,cz),[key]=site.blocks.keys();
  assert.ok(mesh instanceof Float32Array&&mesh.length%9===0);
  const p=key.split(',').map(Number),id=site.blocks.get(key);
  assert.equal(w.get(...p),id);
  assert.equal(w.set(...p,BLOCK.AIR),true);
  const changed=meshChunk(w,cx,cz);
  assert.notDeepEqual(changed,mesh);
  assert.deepEqual(changed,meshChunk(VoxelWorld.restore(w.save()),cx,cz));
});
test('seed differences, chunk boundaries and bounded caches retain deterministic generation',()=>{
  const w=new VoxelWorld(179),another=new VoxelWorld(917);
  for(let cx=-16;cx<=16;cx++)for(let cz=-16;cz<=16;cz++){
    w.get(cx*16+8,18,cz*16+8);
    another.get(cx*16+8,18,cz*16+8);
    assert.ok(w.landmarkCache.size<=VOXEL_LANDMARK_CACHE_LIMIT);
  }
  assert.ok(w.landmarkCache.size>0);
  assert.notDeepEqual(data(-7,-5,179),data(-7,-5,917));
  const restored=VoxelWorld.restore(w.save());
  const {blocks}=data(...known.watchtower);
  for(const [key] of blocks)assert.equal(w.get(...key.split(',').map(Number)),restored.get(...key.split(',').map(Number)));
});
