import test from 'node:test';
import assert from 'node:assert/strict';
import {PHYSICAL_MIN_Y,PHYSICAL_MAX_Y,PHYSICAL_LAYER_COUNT,UPPER_LAYER_COUNT,UPPER_SECTION_COUNT,
  physicalSectionForY,physicalSectionBounds,physicalMeshKey,physicalRegionAt,physicalEditKeys,physicalBodyRegions} from '../src/world-height.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y,sectionForY,depthMeshKey} from '../src/depth.mjs';
import {VoxelWorld,BLOCK,raycast,collides} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,M7_ENVIRONMENT_GENERATOR,M8_MOUNTAIN_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {meshSkyIslandSection} from '../src/floating-islands/sky-source-mesh.mjs';
test('all 467 cells uniquely partitioned; legacy keys unchanged',()=>{
  assert.deepEqual([PHYSICAL_MIN_Y,PHYSICAL_MAX_Y,PHYSICAL_LAYER_COUNT,UPPER_LAYER_COUNT,UPPER_SECTION_COUNT],[-210,256,467,237,15]);
  assert.deepEqual([WORLD_MIN_Y,WORLD_MAX_Y],[-210,19]);
  const regions=new Map();
  for(let y=-210;y<=256;y++){
    const r=physicalSectionForY(y),b=physicalSectionBounds(r),k=physicalMeshKey(-2,3,r);
    assert.ok(y>=b.minY&&y<=b.maxY);
    if(y<=19)assert.equal(k,depthMeshKey(-2,3,sectionForY(y)));
    if(!regions.has(k))regions.set(k,[]);
    regions.get(k).push(y);
  }
  for(const ys of regions.values()){const b=physicalSectionBounds(physicalSectionForY(ys[0]));assert.deepEqual([ys[0],ys.at(-1),ys.length],[b.minY,b.maxY,b.maxY-b.minY+1]);}
  assert.equal([...regions.keys()].filter(k=>k.startsWith('sky:')).length,15);
  assert.equal(physicalRegionAt(-.1,256.99,16).key,'sky:-1,1,14');
  assert.equal(physicalSectionForY(257),null);
});
test('former ceiling, signed x/z and upper vertical seams invalidate both owners',()=>{
  for(const y of [19,20]){const k=physicalEditKeys(-16,y,0);for(const cx of [-2,-1])for(const cz of [-1,0]){
    assert.ok(k.includes(cx+','+cz));assert.ok(k.includes('sky:'+cx+','+cz+',0'));
  }}
  for(const y of [35,36]){const k=physicalEditKeys(-16,y,0);for(const cx of [-2,-1])for(const cz of [-1,0])for(const s of [0,1])assert.ok(k.includes('sky:'+cx+','+cz+','+s));}
  assert.equal(physicalBodyRegions({x:0,feet:35,z:0}).length,8);
  assert.equal(physicalBodyRegions({x:0,feet:19,z:0}).length,8);
  assert.equal(physicalBodyRegions({x:0,feet:255.3,z:0}),null);
  assert.ok(physicalBodyRegions({x:0,feet:255.2,z:0}));
});
test('actual original VoxelWorld physical upper edits, native ray/collision and cold schema-1 restore',()=>{
  const w=new VoxelWorld(2026),x=-10001,z=10003;
  const lower=w.get(x,-210,z),raw=JSON.stringify(w.save());
  assert.equal(w.get(x,256,z),BLOCK.AIR);
  assert.equal(w.set(x,257,z,BLOCK.STONE),false);
  assert.equal(w.set(x,-211,z,BLOCK.STONE),false);
  for(const y of [20,35,36,256])assert.equal(w.set(x,y,z,BLOCK.STONE),true);
  assert.equal(w.edits.size,4);
  assert.equal(collides(w,x+.5,255.5,z+.5),true);
  assert.deepEqual(raycast(w,[x+.5,254.5,z+.5],[0,1,0]).hit,[x,256,z]);
  const reopened=VoxelWorld.restore(w.save());
  assert.deepEqual(reopened.save(),w.save());
  for(const y of [20,35,36,256])assert.equal(reopened.set(x,y,z,BLOCK.AIR),true);
  assert.equal(reopened.get(x,-210,z),lower);
  assert.equal(JSON.stringify(reopened.save()),raw);
});
test('historical M7 and current M8 profile saves retain generator and admit sparse upper edits',()=>{
  for(const g of [M7_ENVIRONMENT_GENERATOR,M8_MOUNTAIN_GENERATOR]){
    const profile=fourRegionProfile(2026,g),w=new FourRegionWorld(2026,profile);
    const base=w.get(0,-210,0),raw=JSON.stringify(w.save()),x=-10001,z=10003;
    assert.equal(w.set(x,256,z,BLOCK.STONE),true);
    const reopened=restoreFourRegionWorld(w.save(),profile);
    assert.equal(reopened.generationProfile.generator,g);
    assert.equal(reopened.get(x,256,z),BLOCK.STONE);
    assert.equal(reopened.set(x,256,z,BLOCK.AIR),true);
    assert.equal(reopened.get(0,-210,0),base);
    assert.equal(JSON.stringify(reopened.save()),raw);
  }
});
test('exact inherited source mesher reads real original sparse edits and culls vertical seam',()=>{
  const w=new VoxelWorld(2026);
  assert.ok(w.set(0,35,0,BLOCK.STONE));assert.ok(w.set(0,36,0,BLOCK.STONE));
  const mesh=section=>meshSkyIslandSection({source:w,cx:0,cz:0,section,
    shapeFor:id=>({cube:true,opaque:true}),appearanceFor:id=>({color:[.48,.51,.55],mat:id})});
  const a=mesh(0),b=mesh(1);assert.equal(a.exposedFaces,5);assert.equal(b.exposedFaces,5);
  assert.equal(a.bytes,1080);assert.equal(b.bytes,1080);
  w.set(0,36,0,BLOCK.AIR);assert.equal(mesh(0).exposedFaces,6);
});
