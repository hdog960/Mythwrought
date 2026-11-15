import assert from 'node:assert/strict';
import {test} from 'node:test';
import {surfaceBiomeAt,surfaceBiomeHeight,surfaceBiomeBlock,SURFACE_BIOME_REGIONS} from '../../src/surface-regions/regions.mjs';
import {terrainHeight} from '../../src/voxel.mjs';
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
    assert.equal(surfaceBiomeBlock(x,h+1,z,seed,{enabled:true}),null);\n    assert.equal(surfaceBiomeBlock(x,h-3,z,seed,{enabled:true}),null);
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
