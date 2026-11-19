import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,BLOCK,terrainHeight,meshChunk,chunkCoord,collides}
  from '../../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M5_EXPERIMENTAL_GENERATOR,
  FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,M2_FOUR_REGION_GENERATOR,
  restoreFourRegionWorld} from '../../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {m5V5MountainFreshColumn,v5MountainPassDistance,
  V5_MOUNTAIN_PASS_WAYPOINTS} from '../../src/manual-biomes/mountain-pass-v5.mjs';
import {m4ThreeRegionFreshColumn} from '../../src/manual-biomes/three-regions-m4.mjs';
import {SURFACE_BIOME_REGIONS} from '../../src/surface-regions/regions.mjs';
import {exportM2World,inspectM2WorldExport} from '../../src/manual-biomes/m2-runtime-bridge.mjs';
import {planM5NaturalOverland,replayM5PhysicalWalk}
  from '../../src/manual-biomes/overland-walk-m5.mjs';

const SEED=179;
const w=v=>new FourRegionWorld(SEED,fourRegionProfile(SEED,v));
const opt=()=>{
 const old=new VoxelWorld(SEED);
 return {enabled:true,profileIsFresh:true,
   readBaseline:(x,y,z)=>old.naturalAndLandmarkBlock(x,y,z),
   hasEdit:()=>false,isProtected:()=>false};
};
test('M5 v5 candidate: default and all accepted v2/v3/v4 generation profiles remain immutable',()=>{
 assert.equal(FOUR_REGION_GENERATOR,'mythwrought-four-surface-regions-v4');
 assert.equal(M5_EXPERIMENTAL_GENERATOR,'mythwrought-four-surface-regions-v5');
 assert.equal(new FourRegionWorld(SEED).generationProfile.generator,FOUR_REGION_GENERATOR);
 assert.deepEqual([M2_FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,
   FOUR_REGION_GENERATOR,M5_EXPERIMENTAL_GENERATOR].map(v=>w(v).generationProfile.generator),
   ['mythwrought-four-surface-regions-v2','mythwrought-four-surface-regions-v3',
    'mythwrought-four-surface-regions-v4','mythwrought-four-surface-regions-v5']);
 assert.throws(()=>fourRegionProfile(SEED,'mythwrought-four-surface-regions-v6'));
 const old=w(FOUR_REGION_GENERATOR),modern=w(M5_EXPERIMENTAL_GENERATOR);
 for(const region of SURFACE_BIOME_REGIONS){
   for(let dx=-18;dx<=18;dx+=3)for(let dz=-18;dz<=18;dz+=3)
     for(const y of [-40,0,5,10,15,19]){
       if(region.name==='mountain')continue;
       assert.equal(old.get(region.x+dx,y,region.z+dz),
         modern.get(region.x+dx,y,region.z+dz),
         'new v5 Mountain pass may not alter '+region.name+' or caves');
     }
 }
 assert.equal(new VoxelWorld(SEED).save().schema,1);
 assert.deepEqual(old.save(),{schema:1,seed:SEED,edits:[]});
});

test('M5 v5: real continuous source-authored switchback replaces raised crests only on new worlds',()=>{
 assert.equal(V5_MOUNTAIN_PASS_WAYPOINTS.length,6);
 const legacy=new VoxelWorld(SEED),older=w(FOUR_REGION_GENERATOR),
   newer=w(M5_EXPERIMENTAL_GENERATOR),oldSave=JSON.stringify(older.save());
 let lowered=0,physicalCap=0;
 for(let x=-535;x<=-390;x+=3)for(let z=-42;z<=20;z+=3){
   const d=v5MountainPassDistance(x,z);
   const capY=terrainHeight(x,z,SEED);
   if(d===null||d>22)continue;
   const original=m4ThreeRegionFreshColumn(x,z,SEED,opt());
   const pass=m5V5MountainFreshColumn(x,z,SEED,opt());
   if(!pass||!original)continue;
   assert.ok(pass.top>=capY,'new pass never lowers legacy surface');
   assert.ok(pass.top<=original.top,'new pass can only lower a NEW shelf');
   if(pass.top<original.top)lowered++;
   if(pass.writes.some(p=>p.y===pass.top&&p.to===302)){
     physicalCap++;
     assert.ok(collides(newer,x+.5,pass.top+.05,z+.5));
   }
   assert.equal(newer.get(x,-40,z),legacy.get(x,-40,z));
 }
 assert.ok(lowered>30,'gorge must actually be physical and distinct from v4');
 assert.ok(physicalCap>20,'gorge must have a real mineable/clashable stone floor');
 assert.equal(JSON.stringify(older.save()),oldSave,'old world never migrated');
});

test('M5 v5: cave, landmark, protected edits and standing headroom fail whole column closed',()=>{
 const sample=V5_MOUNTAIN_PASS_WAYPOINTS[3],x=sample[0],z=sample[1],
   old=new VoxelWorld(SEED),original=opt();
 assert.ok(v5MountainPassDistance(x,z)<.01);
 const clean=m5V5MountainFreshColumn(x,z,SEED,original);
 assert.ok(clean!==undefined);
 const protectedEdit=m5V5MountainFreshColumn(x,z,SEED,{
  ...original,hasEdit:()=>true
 });
 assert.equal(protectedEdit,null);
 const tree=m5V5MountainFreshColumn(x,z,SEED,{
  ...original,readBaseline:(a,y,c)=>y===19?BLOCK.WOOD:
    old.naturalAndLandmarkBlock(a,y,c)
 });
 assert.equal(tree,null);
 const cave=m5V5MountainFreshColumn(x,z,SEED,{
  ...original,readBaseline:(a,y,c)=>y===terrainHeight(a,c,SEED)-1?
    BLOCK.AIR:old.naturalAndLandmarkBlock(a,y,c)
 });
 assert.equal(cave,null);
});

test('M5 v5: actual untouched-source Mountain approach traverses from spawn using REAL production stepPlayer',()=>{
 const base=w(M5_EXPERIMENTAL_GENERATOR);
 const world=new Pack2LiveWorld(base),before=JSON.stringify(world.save());
 const route=planM5NaturalOverland(world,{target:'mountain'});
 assert.equal(route.ok,true,JSON.stringify({
  reason:route.reason,closest:route.closest,visited:route.visited,
  sampled:route.sampled
 }));
 assert.ok(route.path.length>=450);
 const physical=replayM5PhysicalWalk(world,route,{maxFramesPerCell:34});
 assert.equal(physical.ok,true,JSON.stringify(physical));
 assert.ok(physical.steps>=450);
 assert.equal(JSON.stringify(world.save()),before,'no terrain carving to pass the route');
});

test('M5 v5: exact versioned portable export/restore and per-chunk GPU cap preserved',()=>{
 const base=w(M5_EXPERIMENTAL_GENERATOR),world=new Pack2LiveWorld(base);
 const sample=V5_MOUNTAIN_PASS_WAYPOINTS[3],x=sample[0],z=sample[1],
   h=terrainHeight(x,z,SEED);
 const original=world.get(x,h,z);
 assert.equal(world.set(x,h,z,BLOCK.AIR),true);
 const packed=exportM2World(world),imported=inspectM2WorldExport(packed);
 assert.equal(imported.world.base.generationProfile.generator,M5_EXPERIMENTAL_GENERATOR);
 assert.equal(imported.world.get(x,h,z),BLOCK.AIR);
 assert.deepEqual(imported.world.save(),world.save());
 const restored=restoreFourRegionWorld(base.save(),base.generationProfile);
 assert.equal(restored.generationProfile.generator,M5_EXPERIMENTAL_GENERATOR);
 assert.equal(restored.get(x,h,z),BLOCK.AIR);
 assert.equal(restored.set(x,h,z,original),true);
 // Real 25 mountain chunks, not a reduced visual fixture.
 const gpu=new Pack2LiveWorld(w(M5_EXPERIMENTAL_GENERATOR));
 for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
   const verts=meshChunk(gpu,chunkCoord(-512)+dx,chunkCoord(0)+dz);
   assert.ok(verts.byteLength<=8388608,
     'v5 Mountain real GPU chunk exceeded 8MiB: '+verts.byteLength);
 }
});
