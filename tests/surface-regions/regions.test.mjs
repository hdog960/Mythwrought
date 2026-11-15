import assert from 'node:assert/strict';
import {test} from 'node:test';
import {surfaceBiomeAt,surfaceBiomeHeight,surfaceBiomeBlock,SURFACE_BIOME_REGIONS,surfaceBiomeOverlay} from '../../src/surface-regions/regions.mjs';
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
