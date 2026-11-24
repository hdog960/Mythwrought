// Real unmodified Desert-P3 M7 source, deterministic search for genuine
// physically emitted natural rime ID279 material41. Never fabricate a cap.
// No candidate source or original world mutations, no shader/camera claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {meshChunk,BLOCK} from '../production-readonly/src/voxel.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';

const u=t=>.5+.5*Math.sin(t);
function sourceRimeSignal(x,z,seed){
 const phase=(seed%223)*.19;
 const band=u(x*.043+z*.028+phase+Math.sin(z*.026)*.63);
 const patch=u(x*.023-z*.028-phase+Math.sin(x*.032)*.84);
 return {band,patch};
}
function visibleRimeTopFaces(vertices,x,y,z){
 const tags=[];
 for(let k=0;k<vertices.length;k+=27){
   let isTop=true;
   for(const p of [k,k+9,k+18])
     if(Math.abs(vertices[p+1]-(y+1))>1e-6||
       vertices[p]<x-1e-6||vertices[p]>x+1+1e-6||
       vertices[p+2]<z-1e-6||vertices[p+2]>z+1+1e-6)
       isTop=false;
   if(isTop){
     const tag=vertices[k+8];
     assert.equal(vertices[k+17],tag,'physical M7 rime face material mismatch');
     assert.equal(vertices[k+26],tag,'physical M7 rime face material mismatch');
     tags.push(tag);
   }
 }
 return tags;
}
test('authentic M7 both seeds find natural visible rime 279 material41 without altering worlds',()=>{
 for(const seed of [179,2026]){
   const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
   const world=new FourRegionWorld(seed,profile),original=JSON.stringify(world.save());
   let scan=0,signal=0,sourceCandidates=0,blocked=0;
   const found=[],meshCache=new Map();
   outer: for(let z=288;z<=800;z+=3)
     for(let x=-384;x<=0;x+=3){
       scan++;
       const {band,patch}=sourceRimeSignal(x,z,seed);
       if(band<=.92||patch<.10)continue;
       signal++;
       const biome=v6BiomeAt(x,z,seed);
       if(biome?.name!=='snow'||biome.weight<.6)continue;
       const plan=world._columnPlan(x,z);
       if(!(plan instanceof Map)||!plan.size)continue;
       let y=-Infinity;
       for(const py of plan.keys())y=Math.max(y,py);
       if(plan.get(y)!==279)continue;
       sourceCandidates++;
       if(world.get(x,y,z)!==279||
          world.get(x,y+1,z)!==BLOCK.AIR||
          world.get(x,y-1,z)===BLOCK.AIR||
          world.edits.has(x+','+y+','+z)||
          world.edits.has(x+','+(y-1)+','+z)||
          world.environmentCaves.get(x,y,z)!==undefined||
          world.environmentCaves.get(x,y-1,z)!==undefined){
         blocked++;continue;
       }
       const cx=Math.floor(x/16),cz=Math.floor(z/16),key=cx+','+cz;
       if(!meshCache.has(key))meshCache.set(key,meshChunk(world,cx,cz));
       const tags=visibleRimeTopFaces(meshCache.get(key),x,y,z);
       if(!tags.length){blocked++;continue}
       assert.ok(tags.every(tag=>tag===41),
         'Original real top rime 279 material must be original 41, never guessed');
       found.push({x,y,z,cx,cz,sourceId:279,originalShaderMaterial:41,
         originalTopTriangles:tags.length,snowWeight:biome.weight});
       if(found.length>=3)break outer;
     }
   assert.equal(found.length,3,'No genuine visible original ID279 rime in bounded source domain');
   assert.equal(JSON.stringify(world.save()),original,
     'Original world source/save bytes were changed by read-only census');
   assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
   console.log('SNOW_S11_REAL_ORIGINAL_RIME_279_MATERIAL41 '+JSON.stringify({
     seed,scan,signal,sourceCandidates,blocked,
     originalMeshChunks:meshCache.size,genuineRimeTopFaces:found,
     originalSourceWorldAndSaveUnchanged:true,
     liveRimeGeneratorOrShaderEnabled:false,
     originalPlayerCameraNotYetVerified:true
   }));
 }
});
