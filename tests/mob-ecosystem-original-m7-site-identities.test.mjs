import test from 'node:test';
import assert from 'node:assert/strict';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {M7_MOB_SEEDS,M7_MOB_SURFACES,m7MobSourceBiome} from './helpers/m7-mob-source-sites.mjs';

for(const seed of M7_MOB_SEEDS)for(const site of M7_MOB_SURFACES){
  test('original V6 selector source identity '+seed+' '+site.source,()=>{
    const raw=v6BiomeAt(site.x,site.z,seed);
    assert.equal(raw?.name??null,site.source==='plains'?null:site.source);
    assert.equal(m7MobSourceBiome(site.x,site.z,seed),site.source);
    // Actual player spawn search may move up to seven cells from each site.
    // Confirm the entire original 15x15 search envelope remains the same biome.
    for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++)
      assert.equal(m7MobSourceBiome(site.x+dx+.5,site.z+dz+.5,seed),site.source);
  });
}
test('invalid input is unknown, not the valid Plains sentinel',()=>{
  for(const [x,z,seed] of [[NaN,0,179],[0,Infinity,179],[0,0,1.5],[0,0,2**31],[0,0,undefined]])
    assert.equal(m7MobSourceBiome(x,z,seed),null);
  assert.equal(v6BiomeAt(0,0,179),null);
  assert.equal(m7MobSourceBiome(0,0,179),'plains');
});
