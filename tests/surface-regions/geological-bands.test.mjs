import assert from 'node:assert/strict';
import {test} from 'node:test';
import {terrainHeight} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {biome130Block,isBiome130BlockId} from '../../src/biome130-registry.mjs';
import {SURFACE_BIOME_REGIONS,surfaceBiomeFreshColumn} from '../../src/surface-regions/regions.mjs';

// Candidate source-coordinate material test; NOT a browser or phone playtest.
test('fresh four-biome columns use only registered solid materials and repeat across chunk boundaries',()=>{
 for(const seed of [179,7,2201]){
  for(const region of SURFACE_BIOME_REGIONS){
   for(const dx of [-17,-16,-15,-1,0,1,15,16,17,31,32,33]){
    const x=region.x+dx,z=region.z+9;
    const legacyTop=terrainHeight(x,z,seed);
    const readBaseline=(cx,y,cz)=>y<=terrainHeight(cx,cz,seed)?2:0;
    const args={enabled:true,profileIsFresh:true,readBaseline,hasEdit:()=>false,isProtected:()=>false};
    const a=surfaceBiomeFreshColumn(x,z,seed,args);
    const b=surfaceBiomeFreshColumn(x,z,seed,args);
    assert.deepEqual(a,b,'fixed seed and coordinates must produce identical writes');
    if(!a)continue;
    assert.equal(a.name,region.name);
    assert.ok(a.top>=legacyTop&&a.top<=WORLD_MAX_Y-3);
    const seen=new Set();
    for(const w of a.writes){
     assert.equal(w.x,x);assert.equal(w.z,z);
     assert.ok(w.y>=legacyTop-2&&w.y<=a.top);
     assert.ok(!seen.has(w.y),'no duplicate write');seen.add(w.y);
     assert.ok(isBiome130BlockId(w.to));
     assert.equal(biome130Block(w.to).solid,true);
     assert.equal(w.from,readBaseline(x,w.y,z));
    }
   }
  }
 }
});

test('raised terrain never writes through a protected cell or existing structure',()=>{
 for(const region of SURFACE_BIOME_REGIONS){
  const x=region.x,z=region.z,seed=179;
  const top=terrainHeight(x,z,seed);
  const readBaseline=(cx,y,cz)=>y<=terrainHeight(cx,cz,seed)?2:0;
  const base={enabled:true,profileIsFresh:true,readBaseline,hasEdit:()=>false,isProtected:()=>false};
  assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...base,isProtected:(cx,y,cz)=>cx===x&&cz===z&&y===top}),null);
  assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...base,hasEdit:(cx,y,cz)=>cx===x&&cz===z&&y===top}),null);
  assert.equal(surfaceBiomeFreshColumn(x,z,seed,{...base,readBaseline:(cx,y,cz)=>y===WORLD_MAX_Y?3:readBaseline(cx,y,cz)}),null);
 }
});
