import test from 'node:test';
import assert from 'node:assert/strict';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {selectDistributedUnderworldRegions,UNDERWORLD_DISTRIBUTED_BIOMES}
 from '../src/living-underworld/distributed-biome-regions.mjs';

const biomeAt=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
test('20 authentic seed/biome cohorts cover near/middle/remote rather than clustered borders',()=>{
 for(const seed of [179,-17,2026,314159]){
  const q=selectDistributedUnderworldRegions(seed,biomeAt);
  assert.deepEqual(q,selectDistributedUnderworldRegions(seed,biomeAt));
  for(const biome of UNDERWORLD_DISTRIBUTED_BIOMES){
   const sites=q[biome];
   assert.equal(sites.length,6);
   assert.deepEqual(sites.map(s=>s.tier),
     ['near','near','middle','middle','remote','remote']);
   const distinct=new Set(sites.map(s=>s.rx+','+s.rz));
   assert.equal(distinct.size,6);
   for(const site of sites)assert.equal(
    biomeAt(site.rx*256+128,site.rz*256+128,seed),biome);
  }
 }
});
test('invalid worlds or missing source biome labels fail strictly',()=>{
 assert.throws(()=>selectDistributedUnderworldRegions(2.5,biomeAt),/Invalid/);
 assert.throws(()=>selectDistributedUnderworldRegions(179,()=> 'unrecognized'),/Unknown/);
});
