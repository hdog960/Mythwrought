import assert from 'node:assert/strict';
import {test} from 'node:test';
import {v6BiomeAt,V6_BIOME_FRACTIONS,V6_BIOME_TILE_SIZE}
  from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,M6_BALANCED_GENERATOR,M5_EXPERIMENTAL_GENERATOR,
  FOUR_REGION_GENERATOR,fourRegionProfile}
  from '../../src/manual-biomes/profile-world.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World,
  exportM2World,inspectM2WorldExport}
  from '../../src/manual-biomes/m2-runtime-bridge.mjs';
import {readFourRegionProfile} from '../../src/manual-biomes/profile-storage.mjs';
const biome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const exact={plains:12,mountain:7,desert:7,snow:7,enchanted:7};
test('V6 each 40-macrotile supertile has exact 30/17.5/17.5/17.5/17.5 allocation',()=>{
  assert.deepEqual(V6_BIOME_FRACTIONS,{
    plains:.30,mountain:.175,desert:.175,snow:.175,enchanted:.175});
  for(const seed of [179,-918,3,2201])
    for(const sx of [-2,-1,0,1,2])for(const sz of [-2,-1,0,1,2]){
      const counts={plains:0,mountain:0,desert:0,snow:0,enchanted:0};
      for(let i=0;i<8;i++)for(let j=0;j<5;j++)
        counts[biome((sx*8+i)*V6_BIOME_TILE_SIZE,
          (sz*5+j)*V6_BIOME_TILE_SIZE,seed)]++;
      assert.deepEqual(counts,exact,seed+' supertile '+sx+','+sz);
    }
});
test('V6 guarantees approachable diverse biomes near the familiar spawn',()=>{
  assert.equal(biome(0,0,179),'plains');
  assert.equal(biome(512,0,179),'desert');
  assert.equal(biome(0,512,179),'snow');
  assert.equal(biome(-512,0,179),'mountain');
  assert.equal(biome(0,-512,179),'enchanted');
});
test('V6 measures representative world surface area, not isolated patches',()=>{
  for(const seed of [179,2201,-443]){
    const counts={plains:0,mountain:0,desert:0,snow:0,enchanted:0};let n=0;
    for(let x=-16384;x<16384;x+=128)for(let z=-16384;z<16384;z+=128){
      counts[biome(x+19,z+27,seed)]++;n++;
    }
    for(const [key,target] of Object.entries(V6_BIOME_FRACTIONS))
      assert.ok(Math.abs(counts[key]/n-target)<.028,
        seed+' '+key+' actual '+(counts[key]/n)+' target '+target);
  }
});
test('V6 preserves all previously accepted v4/v5 generator identities',()=>{
  for(const generator of [FOUR_REGION_GENERATOR,M5_EXPERIMENTAL_GENERATOR]){
    const old=new FourRegionWorld(179,fourRegionProfile(179,generator));
    assert.equal(old.generationProfile.generator,generator);
    assert.ok(Number.isInteger(old.naturalAndLandmarkBlock(512,6,0)));
  }
  const balanced=new FourRegionWorld(179,fourRegionProfile(179,M6_BALANCED_GENERATOR));
  assert.equal(balanced.generationProfile.generator,M6_BALANCED_GENERATOR);
  assert.ok(Number.isInteger(balanced.naturalAndLandmarkBlock(512,6,0)));
});
class Storage{
  state=new Map();
  get length(){return this.state.size;}
  key(i){return [...this.state.keys()][i]??null;}
  getItem(k){return this.state.get(k)??null;}
  setItem(k,v){this.state.set(k,String(v));}
  removeItem(k){this.state.delete(k);}
}
test('V6 must use unused, explicitly confirmed seed; survives save/reopen/export',()=>{
  const storage=new Storage();
  assert.throws(()=>planM2WorldChoice('32591',M2_WORLD_MODE.CREATE_BALANCED_V6),/confirm/i);
  const choice=planM2WorldChoice('32591',M2_WORLD_MODE.CREATE_BALANCED_V6,{confirmed:true});
  const activated=openM2World(storage,choice);
  assert.equal(activated.base.generationProfile.generator,M6_BALANCED_GENERATOR);
  assert.equal(readFourRegionProfile(storage,32591).profile.generator,M6_BALANCED_GENERATOR);
  assert.ok(saveM2World(storage,activated.world).ok);
  assert.equal(openM2World(storage,planM2WorldChoice('32591')).base.generationProfile.generator,M6_BALANCED_GENERATOR);
  assert.equal(inspectM2WorldExport(exportM2World(activated.world))
    .world.base.generationProfile.generator,M6_BALANCED_GENERATOR);
  assert.throws(()=>openM2World(storage,choice),/profile|Existing/i);
  const old=openM2World(new Storage(),planM2WorldChoice('2201',
    M2_WORLD_MODE.CREATE_FOUR,{confirmed:true}));
  assert.equal(old.base.generationProfile.generator,FOUR_REGION_GENERATOR);
});
