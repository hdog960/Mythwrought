import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SKY_DAY_MS} from '../src/world-clock.mjs';
import {solarDirection,sampleSkyAtmosphere,projectSunToScreen,SKY_S2_CONTRACT} from '../src/sky-atmosphere.mjs';
import {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER} from '../src/sky.mjs';

const quarter=SKY_DAY_MS/4;
const noon=SKY_DAY_MS/2;
const dusk=quarter*3;
const approx=(value,expected,eps=1e-6)=>assert.ok(Math.abs(value-expected)<=eps,
  'Expected '+value+' ~= '+expected+' ± '+eps);
const luminance=c=>.2126*c[0]+.7152*c[1]+.0722*c[2];
const finiteColor=c=>assert.ok(Array.isArray(c)&&c.length===3&&c.every(v=>Number.isFinite(v)&&v>=0&&v<=1),
  'Palette must be finite RGB within 0..1');

test('S2 sun completes exactly one smooth 24-minute world-space orbit',()=>{
  assert.equal(SKY_S2_CONTRACT.dayLengthMs,1_440_000);
  for(const p of [0,quarter,noon,dusk,SKY_DAY_MS]){
    const v=solarDirection(p);
    approx(Math.hypot(...v),1);
  }
  approx(solarDirection(0)[1],-1);
  approx(solarDirection(quarter)[0],1);
  approx(solarDirection(quarter)[1],0);
  approx(solarDirection(noon)[1],1);
  approx(solarDirection(dusk)[0],-1);
  approx(solarDirection(dusk)[1],0);
  for(let i=0;i<3;i++)approx(solarDirection(0)[i],solarDirection(SKY_DAY_MS)[i]);
});
test('day noon, midnight, sunrise and sunset produce grounded smooth palette',()=>{
  const day=sampleSkyAtmosphere(noon),night=sampleSkyAtmosphere(0);
  const rise=sampleSkyAtmosphere(quarter),set=sampleSkyAtmosphere(dusk);
  approx(day.elevation,1);approx(night.elevation,-1);
  assert.ok(day.daylight>.99);
  assert.ok(night.daylight<.001);
  assert.ok(day.sunVisibility>.99);
  assert.ok(night.sunVisibility<.001);
  assert.ok(luminance(day.zenith)>luminance(night.zenith)*3);
  assert.ok(luminance(day.fog)>luminance(night.fog)*2);
  assert.ok(luminance(day.light)>luminance(night.light));
  assert.ok(rise.twilight>.6&&set.twilight>.6);
  assert.ok(rise.horizon[0]>rise.horizon[2]&&set.horizon[0]>set.horizon[2],
    'Sunrise and sunset horizon should be warm');
  for(const field of ['zenith','horizon','fog','ridge','cloud','light','sunColor'])
    for(const sky of [day,night,rise,set])finiteColor(sky[field]);
});
test('night is atmospheric and moonlit, never pitch-black terrain',()=>{
  const night=sampleSkyAtmosphere(0);
  assert.ok(night.zenith.some(v=>v>.04));
  assert.ok(night.horizon.every(v=>v>.09));
  assert.ok(night.light.every(v=>v>=SKY_S2_CONTRACT.nightLightMinimum));
  assert.ok(night.fog.every(v=>v>=.10));
  assert.ok(night.light[2]>night.light[0],'Night ambient should lean cool');
});
test('seamless sunrise and sunset, including midnight cycle seam',()=>{
  for(const phase of [0,quarter,noon,dusk,SKY_DAY_MS]){
    const a=sampleSkyAtmosphere(phase-1),b=sampleSkyAtmosphere(phase+1);
    for(const f of ['zenith','horizon','fog','ridge','cloud','light','sunColor'])
      for(let i=0;i<3;i++)assert.ok(Math.abs(a[f][i]-b[f][i])<.001,
        f+' jumped at '+phase);
    assert.ok(Math.abs(a.sunVisibility-b.sunVisibility)<.001);
  }
  for(const p of [0,123456,quarter,noon,dusk,SKY_DAY_MS-1]){
    const a=sampleSkyAtmosphere(p),b=sampleSkyAtmosphere(p+SKY_DAY_MS);
    assert.deepEqual(a,b,'Cycle repeated with different colors at '+p);
  }
});
test('sun projection follows actual voxel camera direction, not a painted fixed UV',()=>{
  const east=solarDirection(quarter);
  const eastFacing=projectSunToScreen(east,Math.PI/2,0,1.5);
  approx(eastFacing[0],.5,1e-6);
  approx(eastFacing[1],.5,1e-6);
  const behind=projectSunToScreen(east,-Math.PI/2,0,1.5);
  assert.deepEqual(behind,[-10,-10]);
  const northLooking=projectSunToScreen(east,0,0,1.5);
  assert.deepEqual(northLooking,[-10,-10]);
  const highSun=projectSunToScreen(solarDirection(noon),0,Math.PI/2-.02,1.5);
  assert.ok(highSun[0]>.3&&highSun[0]<.7&&highSun[1]>.3&&highSun[1]<.7);
  const noonLookingDown=projectSunToScreen(solarDirection(noon),0,-.5,1.5);
  assert.deepEqual(noonLookingDown,[-10,-10]);
});
test('S2 projection validates bad camera data and remains deterministic',()=>{
  assert.throws(()=>projectSunToScreen([1,0,0],0,0,0),/Invalid/);
  assert.throws(()=>projectSunToScreen([NaN,0,0],0,0,1.5),/Invalid/);
  assert.throws(()=>sampleSkyAtmosphere(Infinity),/Invalid sky phase/);
  const sun=solarDirection(quarter+144000);
  assert.deepEqual(projectSunToScreen(sun,1.2,.25,1.4),
    projectSunToScreen(sun,1.2,.25,1.4));
});
test('S2 maintains the existing fullscreen sky pass and avoids all S3 assets',()=>{
  assert.match(SKY_VERTEX_SHADER,/gl_VertexID/);
  assert.match(SKY_FRAGMENT_SHADER,/uSunScreen/);
  assert.ok(SKY_FRAGMENT_SHADER.includes('vec3 warm=vec3(.80,.81,.73)'));
  for(const s of ['uSunVisibility','uSkyFog','uCloud','uRidge','uSunColor','uHorizon','uZenith'])
    assert.ok(SKY_FRAGMENT_SHADER.includes(s),s);
  assert.doesNotMatch(SKY_FRAGMENT_SHADER,/sampler2D|samplerCube|uMoon|uStars|uCloudTime/);
  assert.equal(SKY_S2_CONTRACT.originalDrawCallsAdded,0);
  assert.equal(SKY_S2_CONTRACT.texturesAdded,0);
  assert.equal(SKY_S2_CONTRACT.moonsDeferredToS3,true);
});
test('S2 synchronizes sky pass and all terrain / water / economy fog paths',()=>{
  const main=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
  const pipeline=readFileSync(new URL('../src/gpu-pipeline.mjs',import.meta.url),'utf8');
  assert.match(main,/sampleSkyAtmosphere\(sampleSkyClock\(skyClock,now\)\)/);
  assert.match(main,/gl\.clearColor\(\.\.\.atmosphere\.fog,1\)/);
  assert.match(main,/gl\.uniform3fv\(U\.uFog,atmosphere\.fog\)/);
  assert.match(main,/gl\.uniform3fv\(U\.uSkyLight,atmosphere\.light\)/);
  assert.match(main,/mix\(vColor\*uSkyLight,uFog,distant\)/);
  assert.match(main,/mix\(colored\*uSkyLight,uFog,fog\)/);
  assert.match(main,/mix\(vColor\*uSkyLight,uFog,f\)/);
  assert.match(pipeline,/uSkyLight/);
  assert.match(pipeline,/sunScreen:gl\.getUniformLocation/);
});
