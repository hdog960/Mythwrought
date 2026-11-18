import test from 'node:test';
import assert from 'node:assert/strict';
import {SKY_DAY_MS,SKY_DAY_TARGET_MS,SKY_NIGHT_TARGET_MS,SKY_CLOCK_KEY_PREFIX,
  skyClockKey,normalizeSkyPhase,phaseAfterMs,formatSkyTime,sampleSkyClock,
  loadSkyClock,selectSkyClockTime} from '../src/world-clock.mjs';

function storage(initial={}){
  const map=new Map(Object.entries(initial)),calls=[];
  return {map,calls,
    getItem(key){calls.push(['get',key]);return map.has(key)?map.get(key):null;},
    setItem(key,val){calls.push(['set',key]);map.set(key,String(val));},
    removeItem(key){calls.push(['remove',key]);map.delete(key);}};
}
const start=(s,seed=179,wallNowMs=1800000000000,monoNowMs=1000,allowWrites=true)=>
  loadSkyClock({seed,storage:s,wallNowMs,monoNowMs,allowWrites});
const select=(c,s,target,monoNowMs=1000,wallNowMs=1800000000000,allowWrites=true)=>
  selectSkyClockTime(c,target,{storage:s,monoNowMs,wallNowMs,allowWrites});

test('sky S1 is exactly 24 real minutes per in-world day, with exact wrapping',()=>{
  assert.equal(SKY_DAY_MS,1_440_000);
  assert.equal(phaseAfterMs(0,SKY_DAY_MS),0);
  assert.equal(phaseAfterMs(0,SKY_DAY_MS-1),SKY_DAY_MS-1);
  assert.equal(phaseAfterMs(SKY_DAY_TARGET_MS,SKY_DAY_MS/2),0);
  assert.equal(phaseAfterMs(0,SKY_DAY_MS*10+72_000),72_000);
  assert.equal(normalizeSkyPhase(-1),SKY_DAY_MS-1);
  assert.equal(formatSkyTime(0),'00:00');
  assert.equal(formatSkyTime(SKY_DAY_TARGET_MS),'12:00');
  assert.equal(formatSkyTime(1_439_999),'23:59');
});
test('clock is a pure deterministic function of phase and monotonic elapsed time',()=>{
  const s=storage(),c=start(s);
  assert.equal(c.persistence,'saved');
  assert.equal(sampleSkyClock(c,1000),SKY_DAY_TARGET_MS);
  assert.equal(sampleSkyClock(c,121000),SKY_DAY_TARGET_MS+120000);
  assert.equal(sampleSkyClock(c,721000),0);
  assert.equal(sampleSkyClock(c,1441000),SKY_DAY_TARGET_MS);
  assert.equal(sampleSkyClock(c,100),'720000' * 1);
  assert.equal(sampleSkyClock(c,121000),sampleSkyClock(c,121000));
  assert.equal(s.calls.filter(x=>x[0]==='set').length,1,'No per-frame sidecar writes');
});
test('SET DAY and SET NIGHT jump instantly but the cycle continues at same rate',()=>{
  const s=storage();let c=start(s);
  c=select(c,s,SKY_NIGHT_TARGET_MS,3000,1800000002000);
  assert.equal(sampleSkyClock(c,3000),0);
  assert.equal(sampleSkyClock(c,63000),60000);
  c=select(c,s,SKY_DAY_TARGET_MS,103000,1800000102000);
  assert.equal(sampleSkyClock(c,103000),SKY_DAY_TARGET_MS);
  assert.equal(sampleSkyClock(c,163000),SKY_DAY_TARGET_MS+60000);
  assert.equal(c.persistence,'saved');
  assert.throws(()=>select(c,s,31337),/Unsupported/);
});
test('same-seed reload advances from its independent persisted wall anchor',()=>{
  const s=storage(),a=start(s,179,1800000000000,400);
  assert.equal(a.source,'new');
  const b=start(s,179,1800000060000,700);
  assert.equal(b.source,'loaded');
  assert.equal(sampleSkyClock(b,700),SKY_DAY_TARGET_MS+60000);
  assert.equal(sampleSkyClock(b,1300),SKY_DAY_TARGET_MS+60600);
  assert.equal(s.calls.filter(x=>x[0]==='set').length,1,'Reload is read-only');
});
test('background and open settings do not clamp or pause elapsed sky time',()=>{
  const c=start(storage(),179,1800000000000,700);
  assert.equal(sampleSkyClock(c,700+SKY_DAY_MS*2+300000),SKY_DAY_TARGET_MS+300000);
  assert.equal(sampleSkyClock(c,700+SKY_DAY_MS*2+600000),
    normalizeSkyPhase(SKY_DAY_TARGET_MS+600000));
});
test('localStorage clock sidecar never writes canonical schema-1 or journal keys',()=>{
  const key='mythwrought-v002-world-179';
  const original='{"schema":1,"seed":179,"edits":[[4,5,6,3]]}';
  const s=storage({[key]:original,[key+'-integrity-v009']:'legacyJournal',
    [key+'-backup-v009']:'previousBackup'});
  const before=[s.getItem(key),s.getItem(key+'-integrity-v009'),s.getItem(key+'-backup-v009')];
  let c=start(s);c=select(c,s,SKY_NIGHT_TARGET_MS,2000,1800000001000);
  assert.deepEqual([s.getItem(key),s.getItem(key+'-integrity-v009'),s.getItem(key+'-backup-v009')],before);
  assert.deepEqual(s.calls.filter(x=>x[0]==='set').map(x=>x[1]),[skyClockKey(179),skyClockKey(179)]);
  assert.equal(JSON.parse(s.getItem(key)).schema,1);
});
test('independent seed sidecars cannot bleed into neighboring worlds',()=>{
  const s=storage(),a=start(s,179),b=start(s,-201);
  select(a,s,SKY_NIGHT_TARGET_MS,5000,1800000004000);
  const c=start(s,-201,1800000004000,6000);
  assert.equal(sampleSkyClock(c,6000),SKY_DAY_TARGET_MS+4000);
  assert.equal(sampleSkyClock(start(s,179,1800000004000,6000),6000),0);
  assert.notEqual(skyClockKey(179),skyClockKey(-201));
  assert.equal(b.seed,-201);
});
test('invalid sidecars are not destroyed or automatically replaced',()=>{
  const key=skyClockKey(179),bad='{"version":1,"seed":180,"wallAnchorMs":0,"anchorPhaseMs":4}';
  const s=storage({[key]:bad});
  let c=start(s);
  assert.equal(c.persistence,'protected');
  assert.match(c.warning,/preserved unchanged/);
  c=select(c,s,SKY_NIGHT_TARGET_MS);
  assert.equal(sampleSkyClock(c,1000),0);
  assert.equal(s.getItem(key),bad);
  assert.equal(s.calls.filter(x=>x[0]==='set').length,0);
});
test('readonly/corrupt world protection never writes even the sky sidecar',()=>{
  const s=storage(),c=start(s,179,1800000000000,1000,false);
  assert.equal(c.persistence,'protected');
  select(c,s,SKY_NIGHT_TARGET_MS,2000,1800000001000,false);
  assert.equal(s.calls.filter(x=>x[0]==='set').length,0);
  assert.equal(s.map.size,0);
});
test('unavailable quota or permission keeps in-memory clock running',()=>{
  const s=storage();s.setItem=()=>{throw Error('QuotaExceededError');};
  let c=start(s);
  assert.equal(c.persistence,'session-only');
  c=select(c,s,SKY_NIGHT_TARGET_MS,3000,1800000002000);
  assert.equal(sampleSkyClock(c,6000),3000);
});
test('wall clock adjustments do not speed up an active session',()=>{
  const s=storage(),c=start(s,179,1800000000000,1000);
  assert.equal(sampleSkyClock(c,61000),SKY_DAY_TARGET_MS+60000);
  const b=start(s,179,1799999990000,1000);
  assert.equal(sampleSkyClock(b,1000),SKY_DAY_TARGET_MS);
  assert.equal(sampleSkyClock(b,61000),SKY_DAY_TARGET_MS+60000);
});
test('phase validation rejects NaN, infinity and unsafe identifiers',()=>{
  assert.throws(()=>normalizeSkyPhase(NaN));
  assert.throws(()=>phaseAfterMs(0,-1));
  assert.throws(()=>skyClockKey(NaN));
  assert.throws(()=>loadSkyClock({seed:179,storage:storage(),monoNowMs:NaN,wallNowMs:5}));
  assert.equal(SKY_CLOCK_KEY_PREFIX,'mythwrought-sky-s1-clock-');
});
