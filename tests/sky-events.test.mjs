import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SKY_DAY_MS} from '../src/world-clock.mjs';
import {sampleThreeMoons} from '../src/sky-moons.mjs';
import {sampleSkyAtmosphere} from '../src/sky-atmosphere.mjs';
import {S5_EVENT_TYPES,S5_EVENT_SCHEDULE,S5_EVENT_CONTRACT,sampleS5Events} from '../src/sky-events.mjs';
import {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER} from '../src/sky.mjs';
const sample=(phase,age)=>sampleS5Events(phase*SKY_DAY_MS,
  sampleThreeMoons(phase*SKY_DAY_MS,age*SKY_DAY_MS,0),
  sampleSkyAtmosphere(phase*SKY_DAY_MS).daylight);
test('S5 has four unique bounded visual-only event kinds, no rendering pass or save writes',()=>{
  assert.deepEqual(Object.values(S5_EVENT_TYPES),[0,1,2,3,4]);
  assert.equal(S5_EVENT_CONTRACT.kinds,4);
  assert.equal(S5_EVENT_CONTRACT.additionalDrawCalls,0);
  assert.equal(S5_EVENT_CONTRACT.texturesAdded,0);
  assert.equal(S5_EVENT_CONTRACT.persistentStateAdded,0);
  assert.equal(S5_EVENT_CONTRACT.weatherDeferred,true);
  assert.equal(S5_EVENT_CONTRACT.biomeVariantsDeferred,true);
  assert.equal(new Set(S5_EVENT_SCHEDULE.map(x=>x.id)).size,3);
  assert.deepEqual(S5_EVENT_SCHEDULE.map(x=>x.every),[29,53,97]);
  assert.ok(SKY_VERTEX_SHADER.includes('gl_VertexID'));
  assert.match(SKY_FRAGMENT_SHADER,/uS5EventStrength>\.001/);
  assert.match(SKY_FRAGMENT_SHADER,/uS5EventType==4/);
  assert.doesNotMatch(SKY_FRAGMENT_SHADER,/uWeather|sampler2D|samplerCube|texture\(/);
});
test('meteor occurs in a bounded ~52-second window once in 29 lunar days',()=>{
  const e=sample(.055,11.25);
  assert.equal(e.kind,S5_EVENT_TYPES.meteor);
  assert.ok(e.strength>.8&&e.progress>.49&&e.progress<.51);
  assert.equal(sample(.055,12.25).kind,0);
  assert.equal(sample(.09,11.25).kind,0);
  assert.equal(sample(.055,40.25).kind,1);
  assert.equal(sample(.055,69.25).kind,1);
});
test('luminous arc and silver comet have independent rare schedules',()=>{
  const arc=sample(.125,18.25),comet=sample(.175,37.25);
  assert.equal(arc.kind,S5_EVENT_TYPES.aurora);
  assert.equal(comet.kind,S5_EVENT_TYPES.comet);
  assert.ok(arc.strength>.8&&comet.strength>.8);
  assert.notDeepEqual(arc.color,comet.color);
  assert.equal(sample(.125,19.25).kind,0);
  assert.equal(sample(.175,38.25).kind,0);
  assert.equal(sample(.125,71.25).kind,2);
  assert.equal(sample(.175,134.25).kind,3);
});
test('exceptional conjunction requires actual THREE near-aligned illuminated lunar vectors',()=>{
  const e=sample(0,1.25);
  assert.equal(e.kind,S5_EVENT_TYPES.alignment);
  assert.ok(e.alignmentDot>.985);
  assert.ok(e.strength>.4);
  assert.ok(Math.hypot(...e.direction)>.999);
  assert.equal(sample(0,0).kind,0,'Original three moons are not naturally aligned yet');
  const unaligned=sample(0,11.25);
  assert.notEqual(unaligned.kind,S5_EVENT_TYPES.alignment);
  // Fully illuminated fake moon states may never override true geometry.
  const lun=sampleThreeMoons(0,1.25*SKY_DAY_MS,0);
  lun.moons[0].direction=[1,0,0];
  assert.notEqual(sampleS5Events(0,lun,0).kind,S5_EVENT_TYPES.alignment);
  lun.moons[0].direction=[NaN,0,0];
  assert.throws(()=>sampleS5Events(0,lun,0),/Invalid S5 moon/);
});
test('all celestial events fade with day without changing the 24-minute mechanics',()=>{
  for(const [phase,age] of [[.055,11.25],[.125,18.25],[.175,37.25],[0,1.25]]){
    const l=sampleThreeMoons(phase*SKY_DAY_MS,age*SKY_DAY_MS,0);
    assert.equal(sampleS5Events(phase*SKY_DAY_MS,l,1).kind,0);
    const a=sampleS5Events(phase*SKY_DAY_MS,l,0);
    assert.ok(a.strength>=0&&a.strength<=1);
    assert.ok(a.progress>=0&&a.progress<=1);
    assert.ok(a.vector.every(Number.isFinite)&&a.direction.every(Number.isFinite));
  }
  assert.throws(()=>sampleS5Events(Infinity,sampleThreeMoons(0,0,0),0));
  assert.throws(()=>sampleS5Events(0,null,0),/Invalid S5 lunar/);
  assert.throws(()=>sampleS5Events(0,sampleThreeMoons(0,0,0),-1),/Invalid S5 daylight/);
});
test('rare events are sparse when audited across 1000 actual lunar days',()=>{
  let counts=[0,0,0,0,0];
  for(let day=0;day<1000;day++){
    const event=sample(.055,day+.25);
    counts[event.kind]++;
  }
  assert.ok(counts[0]>950,'Rare celestial phenomena became common');
  assert.ok(counts[1]>=30&&counts[1]<=36,'Meteor rarity changed');
  assert.ok(counts[4]<8,'Three-moon alignments are too frequent');
});
test('repeatability, 24-minute wrapping and smooth window endpoints',()=>{
  for(const [phase,age] of [[.055,11.25],[.125,18.25],[.175,37.25],[0,1.25]]){
    const lunar=sampleThreeMoons(phase*SKY_DAY_MS,age*SKY_DAY_MS,0);
    const a=sampleS5Events(phase*SKY_DAY_MS,lunar,0);
    const b=sampleS5Events((phase+1)*SKY_DAY_MS,lunar,0);
    assert.deepEqual(a,b);
  }
  const near=sample(.055+.018-.00001,11.25);
  const out=sample(.055+.018+.00001,11.25);
  assert.ok(near.strength<.001);
  assert.equal(out.kind,0);
  assert.deepEqual(sample(.055,11.25),sample(.055,11.25));
});
test('S0-S4 remain intact; S5 adds no new storage, gameplay, or weather hooks',()=>{
  const src=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
  const gpu=readFileSync(new URL('../src/gpu-pipeline.mjs',import.meta.url),'utf8');
  const events=readFileSync(new URL('../src/sky-events.mjs',import.meta.url),'utf8');
  assert.match(src,/sampleS5Events\(atmosphere\.phaseMs,lunar,atmosphere\.daylight\)/);
  assert.match(src,/gl\.uniform1i\(skyU\.s5Type,skyEvent\.kind\)/);
  assert.match(src,/gl\.uniform3fv\(U\.uFog,atmosphere\.fog\)/);
  assert.match(src,/gl\.uniform3fv\(U\.uSkyLight,atmosphere\.light\)/);
  assert.match(src,/gl\.uniform1fv\(skyU\.lunarVisibility,lunar\.moons\.map\(m=>m\.visibility\)\)/);
  assert.match(src,/gl\.uniform1f\(skyU\.starVisibility,nightCanvas\.starVisibility\)/);
  for(const v of ['s5Type','s5Strength','s5Center','s5Vector','s5Color'])
    assert.ok(gpu.includes(v+':gl.getUniformLocation'),v);
  assert.doesNotMatch(events,/localStorage|sessionStorage|Math\.random|Date\.now|fetch\(|setTimeout|setInterval/);
});
