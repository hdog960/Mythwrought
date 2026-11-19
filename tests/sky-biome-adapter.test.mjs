import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sampleSkyAtmosphere} from '../src/sky-atmosphere.mjs';
import {sampleThreeMoons} from '../src/sky-moons.mjs';
import {sampleS4Sky} from '../src/sky-stars.mjs';
import {sampleS5Events} from '../src/sky-events.mjs';
import {SKY_DAY_MS} from '../src/world-clock.mjs';
import {S6_ANCHORS,S6_GENERATORS,S6_SKY_CONTRACT,S6_BIOME_SOURCE_HEAD,
  hasValidatedFourBiomeProfile,resolveS6Biome,sampleS6BiomeSky}
  from '../src/sky-biome-adapter.mjs';
const profile=(seed=179,generator=S6_GENERATORS[2])=>
  ({base:{seed,generationProfile:{kind:'mythwrought-generation-profile',
      version:1,seed,generator}},seed});
const sampler=(x,z)=>{const a=S6_ANCHORS.find(a=>a.x===x&&a.z===z);
  return a?{name:a.name,weight:1,center:[a.x,a.z]}:null};
test('S6 is source-authoritative and never guesses biome identity',()=>{
  assert.equal(S6_SKY_CONTRACT.count,4);
  assert.equal(S6_BIOME_SOURCE_HEAD,'0140db9ad5e599ac84850fdb17529b7f4d96e4f4');
  assert.deepEqual(S6_ANCHORS.map(x=>[x.name,x.x,x.z]),
    [['desert',512,0],['snow',0,512],['mountain',-512,0],['enchanted',0,-512]]);
  assert.deepEqual(S6_GENERATORS.map(x=>x.slice(-2)),['v2','v3','v4','v5']);
  assert.equal(S6_SKY_CONTRACT.additionalDrawCalls,0);
  assert.equal(S6_SKY_CONTRACT.texturesAdded,0);
  assert.equal(S6_SKY_CONTRACT.persistentStateAdded,0);
});
test('legacy and malformed profiles are truly null; no coordinate guessing',()=>{
  for(const w of [null,{}, {seed:179,base:{seed:179}}, {seed:179,
    base:{seed:179,generationProfile:{generator:'v5',seed:179}}}]){
    assert.equal(hasValidatedFourBiomeProfile(w),false);
    assert.equal(resolveS6Biome(w,512,0,sampler),null);
  }
  const w=profile();
  assert.equal(resolveS6Biome(w,512,0,null),null);
  assert.equal(resolveS6Biome(w,NaN,0,sampler),null);
  assert.equal(resolveS6Biome(w,510,0,sampler),null);
  assert.equal(resolveS6Biome(w,512,0,()=>({name:'desert',weight:.9,
    center:[512,1]})),null);
  assert.equal(resolveS6Biome(w,512,0,()=>({name:'desert',weight:.34,
    center:[512,0]})),null);
  assert.equal(resolveS6Biome(w,512,0,()=>({name:'desert',weight:1.2,
    center:[512,0]})),null);
  assert.equal(resolveS6Biome(w,512,0,()=>({name:'unknown',weight:1,
    center:[512,0]})),null);
  const forged=profile();forged.base.generationProfile.seed=181;
  assert.equal(resolveS6Biome(forged,512,0,sampler),null);
});
test('every source-authorized biome yields a subtly distinctive, bounded mood',()=>{
  const day=sampleSkyAtmosphere(SKY_DAY_MS/2),night=sampleSkyAtmosphere(0);
  const colors=new Set();
  for(const anchor of S6_ANCHORS){
    const biome=resolveS6Biome(profile(),anchor.x,anchor.z,sampler);
    assert.equal(biome?.name,anchor.name);
    assert.equal(biome?.strength,1);
    const mood=sampleS6BiomeSky(day,biome);
    colors.add(JSON.stringify(mood.horizon));
    for(const f of ['horizon','zenith','fog','cloud','ridge']){
      assert.equal(mood[f].length,3);
      mood[f].forEach((v,i)=>{
        assert.ok(v>=0&&v<=1&&Number.isFinite(v));
        assert.ok(Math.abs(v-day[f][i])<=.09);
      });
    }
    for(const f of ['phaseMs','elevation','daylight','twilight','sunDirection',
      'sunVisibility','sunColor','light'])
      assert.deepEqual(mood[f],day[f],f+' must stay globally identical');
    const midnight=sampleS6BiomeSky(night,biome);
    assert.ok(Math.max(...midnight.horizon.map((v,i)=>Math.abs(v-night.horizon[i])))<=.06);
  }
  assert.equal(colors.size,4);
});
test('the M5 genuine biome-weight shoulder blends smoothly to unchanged sky',()=>{
  const w=profile(),day=sampleSkyAtmosphere(720000);
  const derive=weight=>resolveS6Biome(w,512,0,()=>({
    name:'desert',weight,center:[512,0]}));
  const edge=derive(.35),mid=derive(.65),full=derive(.95);
  assert.equal(edge.strength,0);
  assert.ok(mid.strength>.45&&mid.strength<.55);
  assert.equal(full.strength,1);
  assert.deepEqual(sampleS6BiomeSky(day,edge).horizon,day.horizon);
  const midMood=sampleS6BiomeSky(day,mid);
  const maxMood=sampleS6BiomeSky(day,full);
  assert.ok(maxMood.horizon[0]>midMood.horizon[0]);
  assert.equal(sampleS6BiomeSky(day,null),day,'legacy keeps exact original object');
  assert.throws(()=>sampleS6BiomeSky(day,{name:'desert',strength:2}),/Untrusted/);
});
test('S1–S5 sky mechanics and three moons/events remain unchanged by mood',()=>{
  const time=720000;
  const original=sampleSkyAtmosphere(time);
  const tinted=sampleS6BiomeSky(original,resolveS6Biome(profile(),512,0,sampler));
  assert.equal(original.phaseMs,tinted.phaseMs);
  assert.deepEqual(original.sunDirection,tinted.sunDirection);
  assert.deepEqual(original.light,tinted.light);
  assert.deepEqual(sampleThreeMoons(0,0,0),sampleThreeMoons(0,0,0));
  assert.deepEqual(sampleS4Sky(0,0),sampleS4Sky(0,0));
  assert.deepEqual(sampleS5Events(0,sampleThreeMoons(0,0,0),0),
    sampleS5Events(0,sampleThreeMoons(0,0,0),0));
});
test('main integrates a lazy source module only under verified profile',()=>{
  const main=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
  assert.match(main,/if\(!hasValidatedFourBiomeProfile\(world\)\)/);
  assert.match(main,/import\('\.\/surface-regions\/regions\.mjs'\)/);
  assert.match(main,/resolveS6Biome\(world,player\.x,player\.z,s6Source\)/);
  assert.match(main,/sampleS6BiomeSky\(atmosphere,s6Biome\)/);
  assert.match(main,/gl\.uniform3fv\(U\.uFog,atmosphere\.fog\)/);
  assert.match(main,/if\(s6Biome\)gl\.uniform3fv\(U\.uFog,s6Mood\.fog\)/);
  assert.match(main,/gl\.uniform3fv\(U\.uSkyLight,atmosphere\.light\)/);
  assert.match(main,/gl\.uniform1f\(skyU\.starVisibility,nightCanvas\.starVisibility\)/);
  assert.match(main,/sampleS5Events\(atmosphere\.phaseMs,lunar,atmosphere\.daylight\)/);
  const lib=readFileSync(new URL('../src/sky-biome-adapter.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(lib,/localStorage|sessionStorage|Math\.random|Date\.now|fetch\(|setTimeout\(/);
});
