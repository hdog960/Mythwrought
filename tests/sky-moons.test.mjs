import test from 'node:test';
import assert from 'node:assert/strict';
import {SKY_DAY_MS,SKY_DAY_TARGET_MS,SKY_NIGHT_TARGET_MS} from '../src/world-clock.mjs';
import {MOON_FAMILIES,S3_LUNAR_CONTRACT,loadLunarEpoch,lunarEpochKey,sampleLunarAge,
  lunarIllumination,sampleThreeMoons} from '../src/sky-moons.mjs';
import {projectSunToScreen,sampleSkyAtmosphere} from '../src/sky-atmosphere.mjs';
import {SKY_FRAGMENT_SHADER} from '../src/sky.mjs';
const wall=1800000000000;
const storage=(o={})=>{const map=new Map(Object.entries(o)),writes=[];return{
  map,writes,getItem:k=>map.has(k)?map.get(k):null,
  setItem(k,v){writes.push(k);map.set(k,String(v));},removeItem(k){writes.push(k);map.delete(k);}
}};
const load=(s,seed=179,now=wall,mono=1000,allowWrites=true)=>
  loadLunarEpoch({seed,storage:s,wallNowMs:now,monoNowMs:mono,allowWrites});
const close=(a,b,eps=1e-6)=>assert.ok(Math.abs(a-b)<eps,a+' != '+b);
test('S3 has exactly THREE original differently colored, sized, named lunar bodies',()=>{
  assert.equal(S3_LUNAR_CONTRACT.count,3);
  assert.deepEqual(MOON_FAMILIES.map(m=>m.periodDays),[7,11,17]);
  assert.equal(new Set(MOON_FAMILIES.map(m=>m.name)).size,3);
  assert.equal(new Set(MOON_FAMILIES.map(m=>m.radius)).size,3);
  assert.equal(new Set(MOON_FAMILIES.map(m=>m.color.join(','))).size,3);
  assert.deepEqual(S3_LUNAR_CONTRACT.moonPeriodDays,[7,11,17]);
  assert.equal(S3_LUNAR_CONTRACT.noAdditionalDrawCalls,true);
  assert.equal(S3_LUNAR_CONTRACT.noTextures,true);
  assert.equal(S3_LUNAR_CONTRACT.starsDeferredToS4,true);
});
test('moon phases are independent, continuous, deterministic, and wrap only at own period',()=>{
  const a=sampleThreeMoons(0,0,0);
  const b=sampleThreeMoons(0,2*SKY_DAY_MS,0);
  assert.equal(a.moons.length,3);
  assert.equal(new Set(a.moons.map(m=>m.phaseFraction)).size,3);
  for(let i=0;i<3;i++){
    const m=MOON_FAMILIES[i];
    assert.notEqual(a.moons[i].phaseFraction,b.moons[i].phaseFraction);
    close(a.moons[i].phaseFraction,
      sampleThreeMoons(0,m.periodDays*SKY_DAY_MS,0).moons[i].phaseFraction);
    assert.ok(a.moons[i].illumination>=0&&a.moons[i].illumination<=1);
    assert.ok(a.moons[i].direction.every(Number.isFinite));
    close(Math.hypot(...a.moons[i].direction),1);
  }
  close(lunarIllumination(0),0);
  close(lunarIllumination(.5),1);
  close(lunarIllumination(.25),.5);
  assert.deepEqual(sampleThreeMoons(0,SKY_DAY_MS*3,.0),
    sampleThreeMoons(0,SKY_DAY_MS*3,.0));
});
test('orbital directions are world-space and track the 24-minute clock',()=>{
  const before=sampleThreeMoons(0,0),after=sampleThreeMoons(SKY_DAY_MS/4,0);
  const nearSeam=sampleThreeMoons(SKY_DAY_MS-1,0),seam=sampleThreeMoons(1,2);
  for(let i=0;i<3;i++){
    assert.ok(before.moons[i].direction[1]>.35,'moon above southern night sky');
    assert.ok(after.moons[i].direction[0]!==before.moons[i].direction[0]);
    assert.ok(nearSeam.moons[i].direction.every(Number.isFinite));
    for(let j=0;j<3;j++)assert.ok(Math.abs(nearSeam.moons[i].direction[j]-seam.moons[i].direction[j])<.001);
    const pixel=projectSunToScreen(before.moons[i].direction,Math.PI,.45,1.5);
    assert.ok(pixel.every(v=>v>.04&&v<.96),'three moons should fit a physical game sky screenshot');
  }
});
test('night moonlight is bounded, its phases affect light, and S2 day remains bright',()=>{
  const n=sampleThreeMoons(SKY_NIGHT_TARGET_MS,0,0);
  const d=sampleThreeMoons(SKY_DAY_TARGET_MS,0,1);
  assert.ok(n.moonlight>0&&n.moonlight<=.105);
  assert.equal(d.moonlight,0);
  assert.ok(n.moons.every(m=>m.visibility>.9));
  assert.ok(d.moons.every(m=>m.visibility<.2));
  assert.notDeepEqual(n.moons.map(m=>m.illumination),
    sampleThreeMoons(0,4*SKY_DAY_MS).moons.map(m=>m.illumination));
  const ambient=sampleSkyAtmosphere(0).light;
  assert.ok(ambient.every(v=>v>=.42));
  assert.ok(ambient.every((v,i)=>v+n.moonlight*[.71,.84,1][i]>=v));
});
test('lunar age uses monotonic session time and does not reset on S1 day/night buttons',()=>{
  const s=storage(),c=load(s);
  assert.equal(sampleLunarAge(c,1000),0);
  assert.equal(sampleLunarAge(c,1000+SKY_DAY_MS*3),SKY_DAY_MS*3);
  const p=sampleThreeMoons(0,sampleLunarAge(c,6000)).moons.map(m=>m.phaseFraction);
  const q=sampleThreeMoons(SKY_DAY_MS/2,sampleLunarAge(c,6000)).moons.map(m=>m.phaseFraction);
  assert.deepEqual(p,q,'manual clock jump cannot reset lunar phase');
  assert.deepEqual(s.writes,[lunarEpochKey(179)]);
});
test('epoch survives reload and seeds remain isolated without touching schema-1',()=>{
  const worldKey='mythwrought-v002-world-179',world='{"schema":1,"seed":179,"edits":[]}';
  const s=storage({[worldKey]:world});
  const a=load(s,179),b=load(s,-42);
  const after=load(s,179,wall+SKY_DAY_MS*3,700);
  assert.equal(after.source,'loaded');
  close(sampleLunarAge(after,700),SKY_DAY_MS*3);
  assert.equal(b.seed,-42);
  assert.equal(sampleLunarAge(a,1000),0);
  assert.deepEqual(s.writes,[lunarEpochKey(179),lunarEpochKey(-42)]);
  assert.equal(s.getItem(worldKey),world);
});
test('damaged lunar sidecar preserved fail-closed; protected world forbids writes',()=>{
  const key=lunarEpochKey(179),raw='{"version":1,"seed":99,"wallEpochMs":4}';
  const s=storage({[key]:raw}),c=load(s);
  assert.equal(c.persistence,'protected');
  assert.match(c.warning,/preserved unchanged/);
  assert.equal(s.getItem(key),raw);
  assert.deepEqual(s.writes,[]);
  const p=load(storage(),179,wall,1000,false);
  assert.equal(p.persistence,'protected');
  const q=storage();q.setItem=()=>{throw Error('quota')};
  assert.equal(load(q).persistence,'session-only');
});
test('source-true one-pass WebGL3 moon uniforms, fixed bounded loop, no S4 stars',()=>{
  for(const key of ['uLunarScreen[3]','uLunarPhase[3]','uLunarColor[3]',
    'uLunarRadius[3]','uLunarVisibility[3]'])
    assert.ok(SKY_FRAGMENT_SHADER.includes(key),key);
  assert.match(SKY_FRAGMENT_SHADER,/for\(int i=0;i<3;i\+\+\)/);
  assert.doesNotMatch(SKY_FRAGMENT_SHADER,/sampler2D|texture\(|uStars|uCloudTime|uWeather/);
  assert.ok(SKY_FRAGMENT_SHADER.includes('vec3 warm=vec3(.80,.81,.73)'));
});
