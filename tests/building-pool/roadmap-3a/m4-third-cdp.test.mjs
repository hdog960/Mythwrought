import test from 'node:test';
import assert from 'node:assert/strict';
import {captureMiningThird} from './m4-third-source-cdp.mjs';

// Fail closed in GitHub Actions: only real headless Chromium WebGL2 can produce
// these 90 source-driven third-variant mining screenshots and their SHA256 manifest.
// On non-CI machines explicit runner is usable without making developers
// install browser tooling just to run native-only tests.
test('90 genuine third-variant ring-mining source-driven Chromium WebGL2 exterior/cutaway PNG evidence', {timeout:150000},
 async t=>{
  if(process.env.CI!=='true')return t.skip('Run explicit source-driven browser runner outside Actions');
  const manifest=await captureMiningThird();
  assert.equal(manifest.count,90);
  assert.equal(manifest.webgl2,true);
  assert.equal(manifest.zeroGLErrors,true);
  assert.ok(manifest.records.every(r=>r.foreground>=20&&r.sha256.length===64));
 });
