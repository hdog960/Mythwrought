import assert from 'node:assert/strict';
import {test} from 'node:test';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {VoxelWorld} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M5_EXPERIMENTAL_GENERATOR,
  M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {resolveS6Biome,sampleS6BiomeSky} from '../src/sky-biome-adapter.mjs';
import {hasValidatedV6SkyProfile,resolveV6SkyBiome,
  S6_V6_AUTHORITY} from '../src/sky-v6-adapter.mjs';
const seed=179;
const world=new Pack2LiveWorld(new FourRegionWorld(seed,
  fourRegionProfile(seed,M6_BALANCED_GENERATOR)));
const original=new Pack2LiveWorld(new FourRegionWorld(seed,
  fourRegionProfile(seed,M5_EXPERIMENTAL_GENERATOR)));
const mock={daylight:1,horizon:[.5,.5,.5],zenith:[.6,.6,.6],
  fog:[.55,.55,.55],cloud:[.65,.65,.65],ridge:[.4,.4,.4],
  sunDirection:[1,1,1],sunVisibility:.7,light:[.7,.7,.7]};
test('S6 V6 validates only exact schema-1 V6 profile and seed',()=>{
  assert.equal(hasValidatedV6SkyProfile(world),true);
  assert.equal(hasValidatedV6SkyProfile(original),false);
  assert.equal(hasValidatedV6SkyProfile(new Pack2LiveWorld(new VoxelWorld(seed))),false);
  assert.equal(hasValidatedV6SkyProfile({...world,seed:180}),false);
  assert.equal(hasValidatedV6SkyProfile({...world,base:{...world.base,seed:1}}),false);
  assert.equal(resolveV6SkyBiome(original,512,0),null);
  assert.equal(resolveV6SkyBiome(world,Infinity,0),null);
  assert.equal(resolveV6SkyBiome(world,0,NaN),null);
  assert.equal(S6_V6_AUTHORITY.persistentWrites,0);
  assert.equal(S6_V6_AUTHORITY.additionalDrawCalls,0);
});
test('V6 five real source positions, neutral Plains and source-true four special atmospheres',()=>{
  const places={plains:[0,0],desert:[512,0],snow:[0,512],
    mountain:[-512,0],enchanted:[0,-512]};
  const samples=[];
  assert.equal(v6BiomeAt(0,0,seed),null,'V6 source Plains is neutral');
  assert.equal(resolveV6SkyBiome(world,0,0),null);
  assert.strictEqual(sampleS6BiomeSky(mock,resolveV6SkyBiome(world,0,0)),mock,
    'Plains must preserve exact S5 atmosphere object');
  for(const [name,[x,z]] of Object.entries(places)){
    if(name==='plains')continue;
    const source=v6BiomeAt(x,z,seed),region=resolveV6SkyBiome(world,x,z);
    assert.equal(source.name,name);
    assert.equal(region.name,name);
    assert.equal(region.generator,M6_BALANCED_GENERATOR);
    assert.equal(region.seed,seed);
    assert.deepEqual([region.center.x,region.center.z],source.center);
    assert.ok(region.strength>.6,'Must be an interior, source-strong V6 sky');
    assert.equal(Object.isFrozen(region),true);
    const day=sampleS6BiomeSky(mock,region);
    const night=sampleS6BiomeSky({...mock,daylight:0},region);
    assert.notDeepEqual(day.horizon,mock.horizon);
    assert.notDeepEqual(night.horizon,mock.horizon);
    assert.deepEqual(day.sunDirection,mock.sunDirection);
    assert.deepEqual(day.light,mock.light);
    assert.ok(day.horizon.every(c=>c>=0&&c<=1));
    samples.push([name,day.horizon.join(','),night.horizon.join(',')]);
  }
  assert.equal(new Set(samples.map(x=>x[1])).size,4);
  assert.equal(new Set(samples.map(x=>x[2])).size,4);
});
test('Source V2–V5 adapter unchanged and cannot reinterpret V6 data',()=>{
  assert.equal(resolveS6Biome(world,512,0,()=>v6BiomeAt(512,0,seed)),null);
  assert.equal(resolveV6SkyBiome(original,512,0),null);
});
test('V6 neutral Plains remains unchanged for all source-consistent seeds',()=>{
  for(const seed of [179,3,2201,-918]){
    const w=new Pack2LiveWorld(new FourRegionWorld(seed,
      fourRegionProfile(seed,M6_BALANCED_GENERATOR)));
    for(const x of [-1024,-512,0,512,1024])
      for(const z of [-512,0,512]){
        const s=v6BiomeAt(x,z,seed);
        const sky=resolveV6SkyBiome(w,x,z);
        assert.equal(sky?.name??'plains',s?.name??'plains');
        if(s===null)assert.equal(sky,null);
      }
  }
});
