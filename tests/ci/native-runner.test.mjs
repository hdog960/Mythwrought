import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const runner = resolve(fileURLToPath(new URL('../../scripts/ci/run-isolated.mjs', import.meta.url)));
function withCheckout(fn) {
  const checkout = mkdtempSync(join(tmpdir(), 'mythwrought-ci-runner-'));
  try { return fn(checkout); } finally { rmSync(checkout, { recursive: true, force: true }); }
}
function run(checkout, lane) {
  return spawnSync(process.execPath, [runner, lane], { cwd: checkout, encoding: 'utf8' });
}

test('isolated runner discovers and executes nested native tests', () => withCheckout((checkout) => {
  const root = join(checkout, 'tests/block-packs/pack-4');
  mkdirSync(join(root, 'fixtures'), { recursive: true });
  writeFileSync(join(root, 'top.test.mjs'),
    "import test from 'node:test'; import { writeFileSync } from 'node:fs'; test('top',()=>writeFileSync('top.marker','ok'));\n");
  writeFileSync(join(root, 'fixtures/deep.test.mjs'),
    "import test from 'node:test'; import { writeFileSync } from 'node:fs'; test('nested',()=>writeFileSync('deep.marker','ok'));\n");
  const p = run(checkout, 'pack-4');
  assert.equal(p.status, 0, p.stderr);
  assert.match(p.stdout, /executing 2 native Node test file/);
  assert.equal(existsSync(join(checkout, 'top.marker')), true);
  assert.equal(existsSync(join(checkout, 'deep.marker')), true);
}));

test('isolated runner fails closed if no native tests exist', () => withCheckout((checkout) => {
  mkdirSync(join(checkout, 'tests/building-pool/roadmap-1'), { recursive: true });
  const p = run(checkout, 'roadmap-1');
  assert.notEqual(p.status, 0);
  assert.match(p.stderr, /zero native Node test files/);
}));

test('isolated runner rejects unexpected lane values', () => withCheckout((checkout) => {
  for (const lane of ['unknown', 'pack-1,pack-1', '../pack-1']) {
    const p = run(checkout, lane);
    assert.notEqual(p.status, 0, lane);
  }
}));
