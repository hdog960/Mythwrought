import test from 'node:test';
import assert from 'node:assert/strict';
import {captureFourth} from './m3-fourth-source-cdp.mjs';

// Fail closed in GitHub Actions: only real headless Chromium WebGL2 can produce
// these 180 source-driven fourth-variant screenshots and their SHA256 manifest.
// On non-CI machines explicit runner is usable without making developers
// install browser tooling just to run native-only tests.
test('180 genuine fourth-variant source-driven Chromium WebGL2 exterior/cutaway PNG evidence', {timeout:300000},
 async t=>{
  if(process.env.CI!=='true')return t.skip('Run explicit source-driven browser runner outside Actions');
  const manifest=await captureFourth();
  assert.equal(manifest.count,180);
  assert.equal(manifest.webgl2,true);
  assert.equal(manifest.zeroGLErrors,true);
  assert.ok(manifest.records.every(r=>r.foreground>=20&&r.sha256.length===64));
 });
