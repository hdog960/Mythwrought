import assert from 'node:assert/strict';
import {test} from 'node:test';
import {terrainHeight} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {surfaceBiomeAt,surfaceBiomeHeight,SURFACE_BIOME_REGIONS} from '../../src/surface-regions/regions.mjs';

// Source-specific terrain-profile acceptance, not physical iPhone or WebGL2 evidence.
test('desert dunes, snow drifts and folded mountain ridges have reproducible physical relief',()=>{
 for(const seed of [179,7,2201]){
  const ranges=new Map();
  for(const region of SURFACE_BIOME_REGIONS){
   const heights=[];
   for(let dz=-56;dz<=56;dz+=4)for(let dx=-56;dx<=56;dx+=4){
    const x=region.x+dx,z=region.z+dz;
    assert.equal(surfaceBiomeAt(x,z,seed)?.name,region.name);
    const h=surfaceBiomeHeight(x,z,seed);
    assert.ok(Number.isInteger(h)&&h>=2&&h<=WORLD_MAX_Y-3);
    assert.equal(h,surfaceBiomeHeight(x,z,seed),'same seed must regenerate identically');
    heights.push(h);
   }
   ranges.set(region.name,Math.max(...heights)-Math.min(...heights));
  }
  assert.ok(ranges.get('mountain')>=4,'mountains must have actual vertical relief');
  assert.ok(ranges.get('desert')>=2,'dunes must have actual vertical relief');
  assert.ok(ranges.get('snow')>=2,'snowdrifts must have actual vertical relief');
 }
});

test('region shoulders transition to unchanged legacy terrain without chunk-relative discontinuity',()=>{
 for(const seed of [179,7,2201]){
  for(const region of SURFACE_BIOME_REGIONS){
   let foundOutside=false;
   for(let dx=160;dx<=220;dx+=4){
    const x=region.x+dx,z=region.z;
    if(surfaceBiomeAt(x,z,seed)===null){
     assert.equal(surfaceBiomeHeight(x,z,seed),terrainHeight(x,z,seed));
     foundOutside=true;
    }
   }
   assert.ok(foundOutside,region.name+' must end in legacy terrain');
   for(const dx of [-17,-16,-15,-1,0,1,15,16,17]){
    const x=region.x+dx,z=region.z;
    assert.equal(surfaceBiomeHeight(x,z,seed),surfaceBiomeHeight(x,z,seed));
   }
  }
 }
});
