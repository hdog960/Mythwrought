import assert from 'node:assert/strict';
import {test} from 'node:test';
import {surfaceBiomeAt,surfaceBiomeHeight,surfaceBiomeBlock,SURFACE_BIOME_REGIONS,surfaceBiomeOverlay,surfaceBiomeElevationPlan,surfaceBiomeFreshColumn,createSurfaceBiomeWorldView} from '../../src/surface-regions/regions.mjs';
import {terrainHeight,VoxelWorld,meshChunk,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
test('four physically registered regions occupy multiple chunks on fixed seeds',()=>{
 for(const seed of [179,7,2201]){
  for(const r of SURFACE_BIOME_REGIONS){
   let cells=0;
   for(let dz=-32;dz<=32;dz+=8)for(let dx=-32;dx<=32;dx+=8){
    const x=r.x+dx,z=r.z+dz,h=surfaceBiomeHeight(x,z,seed);
    assert.equal(surfaceBiomeAt(x,z,seed)?.name,r.name);
    assert.ok(h>=2&&h<=WORLD_MAX_Y-3);
    assert.equal(surfaceBiomeBlock(x,h,z,seed,{enabled:true}),r.surface);
    assert.equal(surfaceBiomeBlock(x,h+1,z,seed,{enabled:true}),null);
    assert.equal(surfaceBiomeBlock(x,h-3,z,seed,{enabled:true}),null);
    cells++;
   }
   assert.ok(cells>=81);
  }
 }
});
test('opt-in gate and protected legacy spawn remain unchanged',()=>{
 for(const seed of [179,7,2201]){
  for(let x=-64;x<=64;x+=8)for(let z=-64;z<=64;z+=8){
   assert.equal(surfaceBiomeAt(x,z,seed),null);
   assert.equal(surfaceBiomeHeight(x,z,seed),terrainHeight(x,z,seed));
   assert.equal(surfaceBiomeBlock(x,terrainHeight(x,z,seed),z,seed,{enabled:true}),null);
  }
  for(const r of SURFACE_BIOME_REGIONS)
   assert.equal(surfaceBiomeBlock(r.x,8,r.z,seed),null);
 }
});
test('deterministic sampling and adjacent-column continuity',()=>{
 for(const r of SURFACE_BIOME_REGIONS){
  const a=Array.from({length:128},(_,i)=>surfaceBiomeHeight(r.x+i-64,r.z,179));
  assert.deepEqual(a,Array.from({length:128},(_,i)=>surfaceBiomeHeight(r.x+i-64,r.z,179)));
  assert.ok(a.every(y=>Number.isInteger(y)&&y<=WORLD_MAX_Y-3));
 }
});

test('surface candidate never emits destructive air or alters deep cave-bearing strata',()=>{
 for(const seed of [179,7,2201])for(const r of SURFACE_BIOME_REGIONS){
  for(let dx=-32;dx<=32;dx+=4){
   const x=r.x+dx,z=r.z,h=surfaceBiomeHeight(x,z,seed);
   for(let y=h-12;y<=h+3;y++){
    const candidate=surfaceBiomeBlock(x,y,z,seed,{enabled:true});
    assert.notEqual(candidate,0,'surface must not erase cave or saved terrain');
    if(y<h-2||y>h)assert.equal(candidate,null);
   }
  }
 }
});

test('overlay cannot erase caves, landmarks or saved edits',()=>{
 for(const seed of [179,7,2201])for(const r of SURFACE_BIOME_REGIONS){
  const x=r.x,z=r.z,h=terrainHeight(x,z,seed);
  for(let y=h-2;y<=h+2;y++){
   assert.equal(surfaceBiomeOverlay(x,y,z,seed,{enabled:true,baseline:0}),null);
   assert.equal(surfaceBiomeOverlay(x,y,z,seed,{enabled:true,baseline:1,hasEdit:true}),null);
   assert.equal(surfaceBiomeOverlay(x,y,z,seed,{enabled:false,baseline:1}),null);
   const candidate=surfaceBiomeOverlay(x,y,z,seed,{enabled:true,baseline:1,isNaturalGround:true});
   if(candidate!==null)assert.ok(candidate>=256&&candidate<=325);
  }
 }
});

test('natural-only veneer supplies real surface and subsoil at existing heights',()=>{
 for(const seed of [179,7,2201])for(const r of SURFACE_BIOME_REGIONS){
  const x=r.x,z=r.z,top=terrainHeight(x,z,seed);
  assert.equal(surfaceBiomeOverlay(x,top,z,seed,{enabled:true,baseline:1,isNaturalGround:true}),r.surface);
  assert.equal(surfaceBiomeOverlay(x,top-1,z,seed,{enabled:true,baseline:2,isNaturalGround:true}),r.subsoil);
  for(const baseline of [0,3,4,5,6,7,8,255])
   assert.equal(surfaceBiomeOverlay(x,top,z,seed,{enabled:true,baseline,isNaturalGround:true}),null);
  assert.equal(surfaceBiomeOverlay(x,top,z,seed,{enabled:true,baseline:1}),null);
  assert.equal(surfaceBiomeOverlay(x,top+1,z,seed,{enabled:true,baseline:1,isNaturalGround:true}),null);
 }
});
test('biome veneer fades deterministically at region shoulders without spawn edits',()=>{
 for(const seed of [179,7,2201])for(const r of SURFACE_BIOME_REGIONS){
  let converted=0,untouched=0;
  for(let dx=110;dx<=160;dx+=2)for(let dz=-12;dz<=12;dz+=3){
   const x=r.x+dx,z=r.z,top=terrainHeight(x,z,seed);
   const result=surfaceBiomeOverlay(x,top,z,seed,{enabled:true,baseline:1,isNaturalGround:true});
   if(result===null)untouched++;else converted++;
   assert.equal(result,surfaceBiomeOverlay(x,top,z,seed,{enabled:true,baseline:1,isNaturalGround:true}));
  }
  assert.ok(untouched>0,'transition should preserve original cells');
  assert.ok(converted>0,'transition should include biome material');
 }
});

test('fresh-world elevation plans are atomic, bounded and never implicitly enabled',()=>{
 for(const seed of [179,7,2201]){
  let raisedMountains=0;
  for(const r of SURFACE_BIOME_REGIONS){
   for(let dx=-32;dx<=32;dx+=8)for(let dz=-32;dz<=32;dz+=8){
    const x=r.x+dx,z=r.z+dz;
    const opts={enabled:true,profileIsFresh:true,columnClear:true};
    assert.equal(surfaceBiomeElevationPlan(x,z,seed),null);
    assert.equal(surfaceBiomeElevationPlan(x,z,seed,{...opts,columnClear:false}),null);
    assert.equal(surfaceBiomeElevationPlan(x,z,seed,{...opts,profileIsFresh:false}),null);
    const plan=surfaceBiomeElevationPlan(x,z,seed,opts);
    if(!plan)continue;
    assert.equal(plan.name,r.name);
    assert.ok(plan.top<=WORLD_MAX_Y-3);
    assert.ok(plan.oldTop<plan.top);
    assert.equal(plan.layers.length,plan.top-plan.oldTop);
    assert.deepEqual(plan.layers.map(v=>v.y),
      Array.from({length:plan.top-plan.oldTop},(_,i)=>plan.oldTop+1+i));
    assert.equal(plan.layers.at(-1).id,r.surface);
    assert.deepEqual(plan,surfaceBiomeElevationPlan(x,z,seed,opts));
    if(r.name==='mountain')raisedMountains++;
   }
  }
  assert.ok(raisedMountains>0,'mountain ridge should have physical raised columns');
 }
});

test('atomic fresh columns produce real elevation with protected headroom',()=>{
 for(const seed of [179,7,2201]){
  let elevated=0;
  for(const r of SURFACE_BIOME_REGIONS){
   for(let dx=-24;dx<=24;dx+=12)for(let dz=-24;dz<=24;dz+=12){
    const x=r.x+dx,z=r.z+dz,oldTop=terrainHeight(x,z,seed);
    const baseline=(cx,y,cz)=>y>terrainHeight(cx,cz,seed)?0:y===terrainHeight(cx,cz,seed)?1:2;
    const opts={enabled:true,profileIsFresh:true,readBaseline:baseline,
      hasEdit:()=>false,isProtected:()=>false};
    const plan=surfaceBiomeFreshColumn(x,z,seed,opts);
    assert.ok(plan);
    assert.equal(plan.name,r.name);
    assert.deepEqual(plan,surfaceBiomeFreshColumn(x,z,seed,opts));
    assert.ok(plan.writes.every(w=>w.from===baseline(w.x,w.y,w.z)));
    assert.ok(plan.writes.every(w=>w.y>=oldTop-2&&w.y<=WORLD_MAX_Y-3));
    assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...opts,profileIsFresh:false}),null);
    assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...opts,hasEdit:()=>true}),null);
    assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...opts,isProtected:()=>true}),null);
    assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...opts,
      readBaseline:(cx,y,cz)=>y===oldTop+1?3:baseline(cx,y,cz)}),null);
    if(r.name==='mountain'&&plan.top>oldTop){
      assert.ok(plan.writes.some(w=>w.y>oldTop));
      elevated++;
    }
   }
  }
  assert.ok(elevated>0);
 }
});

test('opt-in world view renders four physical regions without touching schema-1 saves',()=>{
 for(const seed of [179,7,2201]){
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  assert.equal(createSurfaceBiomeWorldView(world),null);
  assert.equal(createSurfaceBiomeWorldView(world,{enabled:true,profileIsFresh:true}),null);
  const view=createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,isProtected:()=>false,maxCachedColumns:32
  });
  assert.ok(view);
  assert.equal(typeof view.set,'undefined');
  for(const region of SURFACE_BIOME_REGIONS){
   const x=region.x,z=region.z,oldTop=terrainHeight(x,z,seed);
   const actual=view.get(x,oldTop,z);
   assert.equal(actual,region.surface,region.name+' surface should be physically present');
   assert.equal(view.get(x,oldTop-8,z),world.get(x,oldTop-8,z));
   if(surfaceBiomeHeight(x,z,seed)>oldTop)
    assert.notEqual(view.get(x,oldTop+1,z),0);
  }
  assert.ok(view.cachedColumns<=32);
  assert.equal(JSON.stringify(world.save()),before);
  const restored=VoxelWorld.restore(world.save());
  assert.equal(JSON.stringify(restored.save()),before);
  world.set(0,terrainHeight(0,0,seed)+1,0,4);
  assert.equal(createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,isProtected:()=>false
  }),null,'edited world cannot be silently treated as a fresh profile');
 }
});

test('real chunk mesher consumes opted-in physical biome view',()=>{
 const world=new VoxelWorld(179);
 const view=createSurfaceBiomeWorldView(world,{
  enabled:true,profileIsFresh:true,isProtected:()=>false,maxCachedColumns:512
 });
 const cx=chunkCoord(512),cz=chunkCoord(0);
 const mesh=meshChunk(view,cx,cz);
 assert.ok(mesh,'chunk meshing must accept the biome view');
 assert.ok(view.cachedColumns<=512);
 assert.equal(world.edits.size,0);
});


test('real legacy stone substrate is eligible only in untouched fresh columns',()=>{
 for(const seed of [179,7,2201])for(const r of SURFACE_BIOME_REGIONS){
  const x=r.x,z=r.z,oldTop=terrainHeight(x,z,seed);
  const natural=(cx,y,cz)=>{
   const top=terrainHeight(cx,cz,seed);
   return y>top?0:y===top?1:y>=top-3?2:3;
  };
  const opts={enabled:true,profileIsFresh:true,readBaseline:natural,
   hasEdit:()=>false,isProtected:()=>false};
  const plan=surfaceBiomeFreshColumn(x,z,seed,opts);
  assert.ok(plan,r.name+' should accept natural stone below the topsoil');
  assert.ok(plan.writes.length>0);
  assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...opts,
   readBaseline:(cx,y,cz)=>y===oldTop-2?0:natural(cx,y,cz)}),null,
   'existing cave air must never be filled');
  assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...opts,
   readBaseline:(cx,y,cz)=>y===oldTop-2?4:natural(cx,y,cz)}),null,
   'existing timber/landmarks must never be overwritten');
  assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...opts,
   hasEdit:(cx,y,cz)=>y===oldTop-2}),null,
   'saved edits block the entire atomic column');
 }
});

test('cached terrain remains stable after edits while edited cells take precedence',()=>{
 for(const seed of [179,7,2201]){
  const world=new VoxelWorld(seed);
  const view=createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,isProtected:()=>false,maxCachedColumns:32
  });
  assert.ok(view);
  const r=SURFACE_BIOME_REGIONS[2],h=terrainHeight(r.x,r.z,seed);
  assert.equal(view.active,true);
  assert.equal(view.get(r.x,h,r.z),r.surface);
  const raised=view.get(r.x,h+1,r.z);
  const cached=view.cachedColumns;
  assert.ok(cached>0);
  // A distant player build must not erase generated mountains.
  const editY=terrainHeight(0,0,seed)+1;
  assert.equal(world.set(0,editY,0,4),true);
  assert.equal(view.active,true);
  assert.equal(view.get(r.x,h,r.z),r.surface);
  assert.equal(view.get(r.x,h+1,r.z),raised);
  assert.equal(view.get(0,editY,0),4);
  // An edit inside a generated column is authoritative at its exact cell.
  assert.equal(world.set(r.x,h,r.z,4),true);
  assert.equal(view.get(r.x,h,r.z),4);
  assert.equal(view.get(r.x,h+1,r.z),raised);
  // Creating a fresh view after any edit remains prohibited.
  assert.equal(createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,isProtected:()=>false
  }),null);
 }
});

test('edits before first biome-column read and after cache eviction preserve terrain',()=>{
 for(const seed of [179,7,2201]){
  const world=new VoxelWorld(seed);
  const view=createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,isProtected:()=>false,maxCachedColumns:1
  });
  assert.ok(view);
  const r=SURFACE_BIOME_REGIONS[2],h=terrainHeight(r.x,r.z,seed);
  // A player may build in a region before its column is ever meshed.
  assert.equal(world.set(r.x,h,r.z,4),true);
  assert.equal(view.get(r.x,h,r.z),4);
  const neighborX=r.x+1,neighborH=terrainHeight(neighborX,r.z,seed);
  assert.equal(view.get(neighborX,neighborH,r.z),r.surface);
  // Evict the first column, then revisit it: edits still win and
  // surrounding untouched raised layers must regenerate identically.
  const raised=view.get(r.x,h+1,r.z);
  view.get(neighborX,neighborH,r.z);
  assert.equal(view.cachedColumns,1);
  assert.equal(view.get(r.x,h,r.z),4);
  assert.equal(view.get(r.x,h+1,r.z),raised);
  assert.equal(view.cachedColumns,1);
 }
});
