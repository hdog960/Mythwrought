// MYTHWROUGHT SKY S4 — source-aware astronomical sky contracts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SKY_DAY_MS} from '../src/world-clock.mjs';
import {SKY_S4_CONTRACT,S4_STARS,starHash,countVirtualStars,sampleS4Sky} from '../src/sky-stars.mjs';
import {SKY_FRAGMENT_SHADER,SKY_VERTEX_SHADER} from '../src/sky.mjs';
const close=(a,b,e=.001)=>assert.ok(Math.abs(a-b)<e,a+' vs '+b);
test('S4 has >ten thousand deterministically positioned original virtual stars',()=>{
  assert.equal(S4_STARS.columns,384);
  assert.equal(S4_STARS.rows,192);
  assert.equal(S4_STARS.cellCount,73728);
  assert.equal(countVirtualStars(),10295);
  assert.ok(countVirtualStars()>10000);
  assert.equal(new Set(S4_STARS.pigments).size,3);
  assert.ok(starHash(1,1)<1&&starHash(1,1)>=0);
  close(starHash(2,3),starHash(2,3));
  assert.notEqual(starHash(2,3),starHash(3,2));
  assert.throws(()=>starHash(-1,1),/Invalid/);
  assert.throws(()=>starHash(1,NaN),/Invalid/);
});
test('S4 cycle is pure and phase continuous, including midnight seam',()=>{
  for(const p of [0,123,1439999,360000,720000,1100000]){
    assert.deepEqual(sampleS4Sky(p,0),sampleS4Sky(p+SKY_DAY_MS,0));
  }
  const a=sampleS4Sky(SKY_DAY_MS-.1,0),b=sampleS4Sky(.1,0);
  for(let i=0;i<2;i++){
    close(a.cloudA[i],b.cloudA[i],1e-5);
    close(a.cloudB[i],b.cloudB[i],1e-5);
  }
  assert.throws(()=>sampleS4Sky(Infinity,0),/Invalid/);
  assert.throws(()=>sampleS4Sky(0,1.1),/Invalid S4 daylight/);
});
test('stars fade smoothly in sunlight but remain visible in true night',()=>{
  const midnight=sampleS4Sky(0,0);
  const noon=sampleS4Sky(SKY_DAY_MS/2,1);
  assert.ok(midnight.starVisibility>.93);
  assert.equal(noon.starVisibility,0);
  assert.equal(noon.starFieldCellCount,73728);
  assert.ok(sampleS4Sky(0,.3).starVisibility<midnight.starVisibility);
  assert.ok(sampleS4Sky(0,.8).starVisibility<.01);
  assert.equal(SKY_S4_CONTRACT.additionalDrawCalls,0);
  assert.equal(SKY_S4_CONTRACT.newTextures,0);
});
test('two cloud populations move gently and independently with the in-game clock',()=>{
  const midnight=sampleS4Sky(0,0);
  const fourAm=sampleS4Sky(SKY_DAY_MS/6,0);
  const sixAm=sampleS4Sky(SKY_DAY_MS/4,0);
  assert.ok(Math.abs(midnight.cloudA[0]-fourAm.cloudA[0])>.04);
  assert.ok(Math.abs(midnight.cloudB[0]-fourAm.cloudB[0])>.002);
  assert.notDeepEqual(fourAm.cloudA,fourAm.cloudB);
  assert.notDeepEqual(sixAm.cloudA,fourAm.cloudA);
  for(const p of [0,8000,360000,720000,SKY_DAY_MS-100]){
    const sample=sampleS4Sky(p,.2);
    for(const v of [...sample.cloudA,...sample.cloudB])assert.ok(Number.isFinite(v)&&Math.abs(v)<.09);
  }
});
test('all S3 lunar uniforms and original S2 warm horizon stay in one sky pass',()=>{
  assert.match(SKY_VERTEX_SHADER,/gl_VertexID/);
  assert.match(SKY_FRAGMENT_SHADER,/vec3 warm=vec3\(\.80,\.81,\.73\)/);
  for(const key of ['uLunarScreen[3]','uLunarPhase[3]','uLunarColor[3]',
    'uLunarRadius[3]','uLunarVisibility[3]',
    'uStarVisibility','uTwinkleAngle','uCloudShiftA','uCloudShiftB'])
    assert.ok(SKY_FRAGMENT_SHADER.includes(key),key);
  assert.match(SKY_FRAGMENT_SHADER,/for\(int i=0;i<3;i\+\+\)/);
  assert.match(SKY_FRAGMENT_SHADER,/starSeed>\.86/);
  assert.match(SKY_FRAGMENT_SHADER,/uCloudShiftA\.x/);
  assert.match(SKY_FRAGMENT_SHADER,/uCloudShiftB\.y/);
  assert.doesNotMatch(SKY_FRAGMENT_SHADER,/sampler2D|samplerCube|texture\(|uWeather|uRareEvent|uBiome/);
  assert.equal(SKY_S4_CONTRACT.starLayers,1);
  assert.equal(SKY_S4_CONTRACT.cloudLayers,4);
  assert.equal(SKY_S4_CONTRACT.weatherDeferred,true);
});
test('S4 binds only sky-owned uniforms and reads the unchanged S1 clock per frame',()=>{
  const main=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
  const gpu=readFileSync(new URL('../src/gpu-pipeline.mjs',import.meta.url),'utf8');
  assert.match(main,/sampleS4Sky\(atmosphere\.phaseMs,atmosphere\.daylight\)/);
  assert.match(main,/gl\.uniform1f\(skyU\.starVisibility,nightCanvas\.starVisibility\)/);
  assert.match(main,/gl\.uniform2fv\(skyU\.cloudShiftA,nightCanvas\.cloudA\)/);
  assert.match(main,/gl\.uniform2fv\(skyU\.cloudShiftB,nightCanvas\.cloudB\)/);
  assert.match(main,/gl\.uniform1fv\(skyU\.lunarVisibility,lunar\.moons\.map\(m=>m\.visibility\)\)/);
  assert.match(main,/gl\.uniform3fv\(U\.uFog,atmosphere\.fog\)/);
  assert.match(main,/gl\.uniform3fv\(U\.uSkyLight,atmosphere\.light\)/);
  for(const key of ['starVisibility','twinkleAngle','cloudShiftA','cloudShiftB'])
    assert.ok(gpu.includes(key+':gl.getUniformLocation'),key);
  assert.doesNotMatch(readFileSync(new URL('../src/sky-stars.mjs',import.meta.url),'utf8'),
    /localStorage|sessionStorage|document\.|fetch\(|Math\.random|Date\.now|setInterval|setTimeout/);
});
