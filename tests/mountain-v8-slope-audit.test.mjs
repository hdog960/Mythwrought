// Source-derived terrain/biome audit only. NOT full original VoxelWorld.
import test from 'node:test';
import assert from 'node:assert/strict';
import {terrainHeight} from '../src/voxel.mjs';
import {auditMountainV8SourceSlopes as audit}
  from '../src/manual-biomes/mountain-v8-slope-audit.mjs';
const window={xMin:-1056,xMax:-256,zMin:-224,zMax:224,
  step:8,worldMaxY:19,heightAt:terrainHeight};
test('authentic original V6 climate and terrain-height source have bounded adjacent V8 slopes',()=>{
  for(const [seed,eligible,checked,missing,ceiling,faces] of [
    [179,4959,4917,42,657,1939],
    [2026,3117,3088,29,320,1347]
  ]){
    const p=audit({...window,seed});
    assert.ok(p);
    assert.equal(p.counts.samples,5757);
    assert.equal(p.counts.sourceEligible,eligible);
    assert.equal(p.counts.checked,checked);
    assert.equal(p.counts.missingNeighbors,missing);
    assert.equal(p.counts.ceiling,ceiling);
    assert.equal(p.counts.exposedFaces,faces);
    assert.equal(p.counts.excessiveSteps,0);
    assert.equal(p.counts.largestStep,2);
    assert.equal(p.fullVoxelWorldVerified,false);
    assert.equal(p.safeToIntegrate,false);
    console.log('MOUNTAIN V8 SOURCE SLOPES '+JSON.stringify(p));
  }
});
test('bounded source-only slope audit is deterministic and rejects unsafe inputs',()=>{
  const p={...window,seed:179};
  assert.deepEqual(audit(p),audit(p));
  assert.equal(audit({...p,step:1}),null);
  assert.equal(audit({...p,step:0}),null);
  assert.equal(audit({...p,worldMaxY:9}),null);
  assert.equal(audit({...p,seed:179.5}),null);
  assert.equal(audit({...p,heightAt:undefined}),null);
});
