import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const main=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
const browser=readFileSync(new URL('../scripts/ci/manual-biomes-m2-live-webgl2.mjs',import.meta.url),'utf8');
const workflow=readFileSync(new URL('../.github/workflows/manual-four-biomes-m2-live.yml',import.meta.url),'utf8');
test('M2 live: legacy startup path remains in place; profiled seeds opt into authoritative loader',()=>{
  assert.match(main,/if\(readFourRegionProfile\(localStorage,seed\)\)/);
  assert.match(main,/openM2World\(localStorage,planM2WorldChoice\(String\(seed\)\)\)/);
  assert.match(main,/const result=loadWorldSafe\(localStorage,seed\)/);
  assert.match(main,/loadPack2LiveWorld\(localStorage,result\.world\)/);
  assert.doesNotMatch(main,/createSurfaceBiomeWorldView\(/);
});
test('M2 live: separate new-world selection requires explicit confirmation and unused seed',()=>{
  assert.match(main,/createFourBiomeButton\.id='createFourBiomeWorld'/);
  assert.match(main,/if\(next===world\.seed\)throw Error/);
  assert.match(main,/window\.confirm\('CREATE A NEW FOUR-BIOME WORLD/);
  assert.match(main,/planM2WorldChoice\(seedInput\.value,M2_WORLD_MODE\.CREATE_FOUR,\{confirmed:true\}\)/);
  assert.match(main,/saveM2World\(localStorage,loaded\.world\)/);
  assert.match(main,/new unused seed/);
});
test('M2 live: saves and seed switching use profiled baseline without changing legacy save path',()=>{
  assert.match(main,/if\(world\.base instanceof FourRegionWorld\)\{\s*const result=saveM2World/);
  assert.match(main,/const overlay=savePack2LiveWorld\(localStorage,world\);/);
  assert.match(main,/const result=saveWorldSafe\(localStorage,world\);/);
  assert.match(main,/const result=candidate\.base instanceof FourRegionWorld\?/);
});
test('M2 live: exports include profile, and unsafe import/vault/mirror restore refuse',()=>{
  assert.match(main,/JSON\.parse\(exportM2World\(world\)\)/);
  assert.match(main,/inspectM2WorldExport\(data\)/);
  assert.match(main,/const examined=inspectM2WorldExport\(rawImport\)/);
  assert.match(main,/readFourRegionProfile\(localStorage,imported\.seed\)/);
  assert.match(main,/readFourRegionProfile\(localStorage,snapshot\.seed\)/);
  assert.match(main,/Refusing legacy mirror restore on a four-biome profile/);
  assert.match(main,/Four-biome world requires profile-safe WORLD EXPORT/);
});
test('M2 live: authentic browser script captures all four with independent sizes and real saves',()=>{
  assert.match(browser,/chromium\.launch/);
  assert.match(browser,/page\.goto\(url/);
  assert.match(browser,/page\.screenshot/);
  assert.match(browser,/page\.reload/);
  assert.match(browser,/fourBiomeProfile/);
  assert.match(browser,/editBiomeCell/);
  assert.match(browser,/\[667,375\]/);
  assert.match(browser,/\[844,390\]/);
  assert.match(browser,/\[932,430\]/);
  assert.match(workflow,/ubuntu-24\.04/);
  assert.match(workflow,/manual-biomes-m2-live-webgl2\.mjs/);
});
