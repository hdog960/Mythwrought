import assert from 'node:assert/strict';
import {test} from 'node:test';
import {FourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {meshChunk,chunkCoord} from '../src/voxel.mjs';
import {MAX_CHUNK_UPLOAD_BYTES,validateChunkUploadBytes} from '../src/gpu-recovery.mjs';
import {SURFACE_BIOME_REGIONS} from '../src/surface-regions/regions.mjs';

test('M2 four-biome REAL source meshing fits the production 8MiB GPU chunk cap',()=>{
  const world=new Pack2LiveWorld(new FourRegionWorld(179));
  for(const biome of SURFACE_BIOME_REGIONS){
    const cx=chunkCoord(biome.x),cz=chunkCoord(biome.z);
    // Mirror the actual 25-chunk landscape streaming window, including
    // diagonal/outer-ring chunks that source-specific ridges may overload.
    for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
      const x=cx+dx,z=cz+dz;
      const vertices=meshChunk(world,x,z);
      assert.ok(vertices instanceof Float32Array,biome.name+' real chunk');
      const bytes=vertices.byteLength;
      console.log('# M2 GPU SOURCE BUDGET '+JSON.stringify({
        biome:biome.name,cx:x,cz:z,vertices:vertices.length/9,bytes,
        cap:MAX_CHUNK_UPLOAD_BYTES}));
      assert.doesNotThrow(()=>validateChunkUploadBytes(vertices),
        biome.name+' chunk '+x+','+z+' exceeds actual upload budget '+bytes+' > '+MAX_CHUNK_UPLOAD_BYTES);
    }
  }
});
