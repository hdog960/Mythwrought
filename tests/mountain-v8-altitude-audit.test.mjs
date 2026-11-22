import test from 'node:test';
import assert from 'node:assert/strict';
import {terrainHeight} from '../src/voxel.mjs';
import {auditMountainV8Altitude as audit}
  from '../src/manual-biomes/mountain-v8-altitude-audit.mjs';
const window={xMin:-1056,xMax:-256,zMin:-224,zMax:224,step:8,worldMaxY:19};
test('actual original terrain-height and V6 biome source avoids flat mountain ceilings',()=>{
  const expected=new Map([
    [179,{core:5100,sourceEligible:4978,ceiling:657,snow:1156,meadow:369,stone:3453}],
    [2026,{core:3212,sourceEligible:3133,ceiling:320,snow:835,meadow:242,stone:2056}]
  ]);
  for(const [seed,counts] of expected){
    const result=audit({...window,seed,heightAt:terrainHeight});
    assert.ok(result);
    assert.equal(result.counts.samples,5757);
    for(const [key,value] of Object.entries(counts))
      assert.equal(result.counts[key],value,seed+' real original-source '+key);
    assert.ok(result.counts.ceiling/result.counts.sourceEligible<.15);
    assert.equal(result.counts.snow+result.counts.meadow+result.counts.stone,
      result.counts.sourceEligible);
    assert.equal(result.safeToIntegrate,false);
    console.log('MOUNTAIN V8 SOURCE ALTITUDE '+JSON.stringify({seed,...result.counts}));
  }
});
test('bounded sampled audit is deterministic and refuses unbounded world sweeps',()=>{
  const p={...window,seed:179,heightAt:terrainHeight};
  assert.deepEqual(audit(p),audit(p));
  assert.equal(audit({...p,step:1}),null);
  assert.equal(audit({...p,step:0}),null);
  assert.equal(audit({...p,seed:179.5}),null);
  assert.equal(audit({...p,heightAt:undefined}),null);
});
test('original source never reports rock and meadow and snow simultaneously',()=>{
  const out=audit({...window,seed:2026,heightAt:terrainHeight});
  assert.equal(out.counts.sourceEligible+out.counts.unplanned<=out.counts.core,true);
  assert.ok(out.counts.snow>300);
  assert.ok(out.counts.meadow>100);
  assert.ok(out.counts.stone>1000);
});
