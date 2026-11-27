import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTRACT, describeGenerator, evaluateGenerator, simulateTicks } from '../src/resonance/generation24/index.mjs';

const generator = (model, level=0, id='g4_limits') =>
  describeGenerator({ id, model, level, seed: 179, anchor: [1,2,3] });
const environments = {
  hand: { operator: true },
  crystal: { crystalPresent: true },
  waterwheel: { waterPresent: true, flow: 1 },
  windmill: { exposed: true, wind: 1 },
  heat: { heatPresent: true, fuelUnits: 60 }
};

for (const model of Object.keys(environments)) {
  test(model + ' upgrades preserve bounded, deterministic generation', () => {
    let previous = -1;
    for (let level=0; level<=3; level++) {
      const d=generator(model,level);
      const a=simulateTicks(d,environments[model],10);
      const b=simulateTicks(d,environments[model],10);
      assert.deepEqual(a,b);
      assert.equal(a.status,'available');
      assert.ok(a.availablePerTick<=a.capacityPerTick);
      assert.ok(a.availablePerTick>=previous);
      assert.equal(a.generated,a.availablePerTick*a.ticks);
      assert.equal(a.fuelConsumed,model==='heat'?a.ticks:0);
      previous=a.availablePerTick;
    }
  });
  test(model + ' rejects unsafe catchup ticks', () => {
    const d=generator(model);
    for (const ticks of [-1,1.5,NaN,Infinity,CONTRACT.maxCatchupTicks+1]) {
      assert.throws(()=>simulateTicks(d,environments[model],ticks));
    }
  });
}
test('environmental thresholds require real enabling flags',()=>{
  for(const [model,flag,field,threshold] of [
    ['waterwheel','waterPresent','flow',0.4],
    ['windmill','exposed','wind',0.3]
  ]) {
    const d=generator(model);
    assert.equal(evaluateGenerator(d,{[flag]:false,[field]:1}).status,'blocked');
    assert.equal(evaluateGenerator(d,{[flag]:true,[field]:threshold-0.001}).status,'blocked');
    assert.equal(evaluateGenerator(d,{[flag]:true,[field]:threshold}).status,'available');
    for(const invalid of [-1,NaN,Infinity]) {
      assert.equal(simulateTicks(d,{[flag]:true,[field]:invalid},10).ticks,0);
    }
  }
});
test('heat fuel exhaustion never fabricates completed ticks',()=>{
  const d=generator('heat');
  for(const fuelUnits of [0,0.5,1,1.9,2,2.9]) {
    const r=simulateTicks(d,{heatPresent:true,fuelUnits},10);
    assert.equal(r.ticks,Math.floor(fuelUnits));
    assert.equal(r.fuelConsumed,Math.floor(fuelUnits));
  }
});
test('instance identity changes without changing source capacity',()=>{
  const a=generator('crystal',0,'a');
  const b=generator('crystal',0,'b');
  assert.notEqual(a.instanceKey,b.instanceKey);
  assert.equal(a.capacity,b.capacity);
  assert.equal(a.ratedOutput,b.ratedOutput);
});
