import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {FrostboundS1Candidate} from '../../src/frostbound/s1-candidate.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {meshChunk} from '../../src/voxel.mjs';
import {validateChunkUploadBytes} from '../../src/gpu-recovery.mjs';
const make=seed=>[new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR)),new FrostboundS1Candidate(seed)];
test('four-seed real source census: winter caps and drifts, unchanged other biomes, no cave overwrite',()=>{
 for(const seed of [179,2026,1,-77]){
  const [a,b]=make(seed);let sampled=0,snow=0,cap=0,drift=0,nonSnow=0,changedCells=0;
  for(let x=-320;x<=320;x+=8)for(let z=192;z<=832;z+=8){
   const region=v6BiomeAt(x,z,seed),p=a._columnPlan(x,z),q=b._columnPlan(x,z);
   sampled++;if(region?.name==='snow')snow++;else nonSnow++;
   if(JSON.stringify([...p])===JSON.stringify([...q]))continue;
   assert.equal(region?.name,'snow');assert.ok(region.weight>=.65);
   if(p.size===0)cap++;else drift++;
   for(const [y,id] of q){if(p.get(y)===id)continue;
    assert.equal(b.environmentCaves.get(x,y,z),undefined);assert.equal(b.get(x,y,z),id);changedCells++;}
  }
  assert.ok(cap>0&&drift>0);assert.ok(b._frostColumns.size<=1024);
  console.log('FROSTBOUND_S1_CENSUS '+JSON.stringify({seed,sampled,snow,nonSnow,cap,drift,changedCells}));
 }
});
test('actual original chunk mesh changes at snow drift and stays byte-identical at plains spawn',()=>{
 const [a,b]=make(179);
 for(const [cx,cz,changes] of [[-6,28,true],[0,0,false]]){
  const old=meshChunk(a,cx,cz),next=meshChunk(b,cx,cz);
  assert.ok(old instanceof Float32Array&&next instanceof Float32Array);
  assert.doesNotThrow(()=>validateChunkUploadBytes(next));
  if(changes)assert.notDeepEqual(next,old);else assert.deepEqual(next,old);
  console.log('FROSTBOUND_S1_MESH '+JSON.stringify({cx,cz,oldBytes:old.byteLength,newBytes:next.byteLength,changes}));
 }
});
