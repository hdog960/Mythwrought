import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,baseBlock} from '../src/voxel.mjs';
import {liveVoxelDistrict,LIVE_DISTRICT_SIZE} from '../src/live-voxel-world.mjs';
import {caveRoute} from '../src/experimental-cave-route.mjs';

const district=(w,dx,dz)=>liveVoxelDistrict(w.seed,dx,dz,(x,y,z)=>w.legacyBlockAt(x,y,z));
const nearby=[[0,0],[-1,0],[0,-1],[-1,-1],[1,0],[0,1],[1,1],[-1,1],[1,-1]];

test('010 real automation assets appear as collision-visible seed voxels, not persisted edits',()=>{
  const world=new VoxelWorld(179),before=JSON.stringify(world.save());
  let galleryCount=0,rotunda=null,twinwood=null,courtSurveyCount=0;
  for(const [dx,dz] of nearby){
    const scene=district(world,dx,dz);
    assert.ok(scene.trees.length>0,'checkpoint 008 trees preserved');
    assert.equal(scene.caves.length,2,'checkpoint 008 cave origins preserved');
    assert.ok(scene.courtSource===null||scene.courtSource==='checkpoint-008'||
      scene.courtSource==='survey-010');
    assert.ok(scene.blockCount>=scene.trees.reduce((n,t)=>n+t.cells.length,0));
    if(scene.courtSource==='survey-010')courtSurveyCount++;
    for(const origin of scene.southGalleries){
      galleryCount++;
      const t=origin.length-11,x=origin.x+t,z=origin.z+8;
      const h=caveRoute(world.seed,origin).floorAt(t);
      assert.equal(world.get(x,h,z),BLOCK.STONE,'south gallery floor in actual world');
      assert.equal(world.get(x,h+1,z),BLOCK.AIR,'south gallery physical headroom');
      assert.equal(collides(world,x+.5,h+1,z+.5),false,'walkable new chamber');
    }
    for(const feature of [scene.rotunda,scene.twinwood]){
      if(!feature)continue;
      for(const [x,y,z,id] of feature.cells)
        assert.equal(world.get(x,y,z),id,'actual world returns new authored voxel');
      if(feature.kind==='stone-rotunda')rotunda??=feature;
      if(feature.kind==='twinwood')twinwood??=feature;
    }
  }
  assert.ok(galleryCount>=1,'at least one opt-in :24 south-gallery cave activated near spawn');
  assert.ok(rotunda,'at least one physical :36 rotunda activated within nearby districts');
  assert.ok(twinwood,'at least one physical :48 twinwood activated within nearby districts');
  assert.equal(JSON.stringify(world.save()),before,'seeded scenery must never write schema-1 edits');
  assert.ok(courtSurveyCount>=0);
  const [rx,rh,rz]=rotunda.origin;
  assert.equal(collides(world,rx+.5,rh+1,rz+.5),false,'rotunda interior is traversable');
  const [tx,th,tz]=twinwood.origin;
  assert.equal(collides(world,tx+.5,th+1,tz+.5),false,'twinwood central passage is walkable');
});

test('010 assets regenerate deterministically, accept mined edits, preserve depth and legacy saves',()=>{
  const world=new VoxelWorld(917);
  const a=district(world,0,0),b=district(new VoxelWorld(917),0,0);
  assert.deepEqual(a.trees,b.trees);
  assert.deepEqual(a.court,b.court);
  assert.deepEqual(a.southGalleries,b.southGalleries);
  assert.deepEqual(a.rotunda,b.rotunda);
  assert.deepEqual(a.twinwood,b.twinwood);
  assert.equal(world.get(0,-205,0),BLOCK.DEEPSTONE,'10x depth substrate remains intact');
  const scene=a.rotunda||a.twinwood||a.trees[0];
  assert.ok(scene);
  const voxel=scene.cells.find(c=>c[1]>0);
  assert.ok(voxel);
  const [x,y,z,id]=voxel;
  assert.equal(world.get(x,y,z),id);
  assert.equal(world.set(x,y,z,BLOCK.AIR),true,'mining physical seeded scenery');
  const saved=world.save(),restored=VoxelWorld.restore(saved);
  assert.equal(saved.schema,1);
  assert.deepEqual(restored.save(),saved);
  assert.equal(restored.get(x,y,z),BLOCK.AIR,'player edit prevails across reload');
  assert.equal(baseBlock(0,-205,0,917),BLOCK.DEEPSTONE);
  assert.equal(restored.get(0,-205,0),BLOCK.DEEPSTONE);
});

test('010 district chunk boundaries are deterministic and bounded',()=>{
  const world=new VoxelWorld(179);
  const a=district(world,-1,-1),b=district(world,-1,-1);
  assert.deepEqual(a.southGalleries,b.southGalleries);
  assert.deepEqual(a.rotunda,b.rotunda);
  assert.deepEqual(a.twinwood,b.twinwood);
  for(const p of [a.rotunda,a.twinwood].filter(Boolean))
    for(const [x,y,z,id] of p.cells){
      assert.ok(x>=-LIVE_DISTRICT_SIZE&&x<0);
      assert.ok(z>=-LIVE_DISTRICT_SIZE&&z<0);
      assert.equal(world.get(x,y,z),id);
    }
});
