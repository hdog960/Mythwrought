import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {buildStageCacheManifest} from '../../scripts/ci/build-stage-cache-manifest.mjs';

test('checked-in staged asset manifest matches every source shell byte',async()=>{
  const expected=await buildStageCacheManifest(process.cwd());
  const actual=JSON.parse(await readFile('nonblock-stage-assets.json','utf8'));
  assert.deepEqual(actual,expected);
  assert.match(actual.version,/^\d{8}-v\d+$/);
  assert.equal(actual.assets['./'],actual.assets['./index.html']);
  for(const path of ['./src/main.mjs','./sw-m5.js','./src/nonblock/candidate-effects.mjs'])
    assert.match(actual.assets[path],/^[a-f0-9]{64}$/);
  assert.ok(Object.keys(actual.assets).length>200);
});
