import test from 'node:test';
import assert from 'node:assert/strict';
import { projectCompactResonanceStatus as project } from '../src/resonance/devices48/compact-status-v1.mjs';
const base = { produced: 9, used: 4, stored: 3, requested: 4, missing: 0 };
test('compact status is deterministic, frozen and source-only', () => {
  const a = project(base);
  assert.deepEqual(a, project({ ...base }));
  assert.equal(a.summary, 'POWER OK');
  assert.deepEqual(a.lines, ['IN 9  USE 4', 'BANK 3  NEED 0']);
  assert.ok(Object.isFrozen(a) && Object.isFrozen(a.lines));
});
test('deficit is visible without granting power', () => {
  const a = project({ ...base, used: 2, requested: 4, missing: 2 });
  assert.equal(a.summary, 'POWER LOW');
  assert.equal(a.deficit, true);
  assert.equal('grant' in a, false);
});
test('bounded short display', () => {
  const a = project({ produced: 12345, used: 1000000, stored: 999, requested: 1000000, missing: 0 });
  assert.deepEqual(a.lines, ['IN 12.3k  USE 1m', 'BANK 999  NEED 0']);
});
test('invalid and inconsistent observations rejected', () => {
  for (const bad of [null, [], {}, { ...base, missing: 1 }, { ...base, used: 5 }, { ...base, stored: -1 }, { ...base, produced: 1.5 }, { ...base, requested: NaN }, { ...base, produced: 1000000001 }]) {
    assert.throws(() => project(bad));
  }
});
