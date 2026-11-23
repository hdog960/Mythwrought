// Native Node test: this actual ESM source module has no external imports.
// The helper does not patch or invoke world.set; all world-owner wiring is
// intentionally absent and remains a mandatory production-release hold.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMobSourceEditEpoch} from '../src/mobs/source-edit-epoch.mjs';

test('new Mob-only edit ledger starts at zero and exposes immutable API', () => {
  const clock = createMobSourceEditEpoch();
  assert.equal(clock.revision(), 0);
  assert.equal(Object.isFrozen(clock), true);
  assert.deepEqual(Object.keys(clock).sort(), ['recordAcceptedEdit', 'revision']);
});

test('successful source edits advance exactly one monotonic integer each', () => {
  const clock = createMobSourceEditEpoch();
  for (let i = 1; i <= 1000; i++) {
    assert.equal(clock.recordAcceptedEdit(true), i);
    assert.equal(clock.revision(), i);
  }
});

test('rejected world changes cannot advance the edit epoch', () => {
  const clock = createMobSourceEditEpoch(11);
  assert.equal(clock.recordAcceptedEdit(false), 11);
  assert.equal(clock.revision(), 11);
  assert.equal(clock.recordAcceptedEdit(true), 12);
  assert.equal(clock.recordAcceptedEdit(false), 12);
});

test('only exactly boolean edit outcomes may be recorded', () => {
  const clock = createMobSourceEditEpoch();
  for (const result of [0, 1, undefined, null, 'true', {}, [], NaN])
    assert.throws(() => clock.recordAcceptedEdit(result), TypeError);
  assert.equal(clock.revision(), 0);
});

test('initial revision requires nonnegative safe integer, no fractional or string values', () => {
  for (const value of [-1, .5, NaN, Infinity, -Infinity, '0', null, 2 ** 53])
    assert.throws(() => createMobSourceEditEpoch(value), TypeError);
  assert.equal(createMobSourceEditEpoch(22).revision(), 22);
});

test('epoch exhaustion throws rather than silently wrapping or reusing a source token', () => {
  const clock = createMobSourceEditEpoch(Number.MAX_SAFE_INTEGER - 1);
  assert.equal(clock.recordAcceptedEdit(true), Number.MAX_SAFE_INTEGER);
  assert.throws(() => clock.recordAcceptedEdit(true), RangeError);
  assert.equal(clock.revision(), Number.MAX_SAFE_INTEGER);
  assert.equal(clock.recordAcceptedEdit(false), Number.MAX_SAFE_INTEGER);
});

test('a successful world edit followed by a successful restore is two distinct writes', () => {
  const clock = createMobSourceEditEpoch();
  let cell = 0;
  const mutate = next => {
    const accepted = Number.isInteger(next);
    if (accepted) cell = next;
    clock.recordAcceptedEdit(accepted);
  };
  mutate(3);
  mutate(0);
  assert.equal(cell, 0);
  assert.equal(clock.revision(), 2, 'Same bytes do not mean no writes occurred');
});

test('world mutations cannot affect ledger unless an owner explicitly reports them', () => {
  const clock = createMobSourceEditEpoch();
  const world = {get() { return 4; }, set() { return true; }};
  world.set(0, 0, 0, 3);
  assert.equal(clock.revision(), 0, 'Not a source witness until all write sites notify it');
  clock.recordAcceptedEdit(true);
  assert.equal(clock.revision(), 1);
  assert.equal(Object.getOwnPropertyDescriptor(world, 'set').value instanceof Function, true);
});

test('stable source revision is usable as a zero-allocation synchronous callback', () => {
  const clock = createMobSourceEditEpoch();
  const read = clock.revision;
  assert.equal(read(), 0);
  clock.recordAcceptedEdit(true);
  assert.equal(read(), 1);
  assert.equal(read(), 1);
});

test('read callbacks cannot mutate or reset the source epoch', () => {
  const clock = createMobSourceEditEpoch(8);
  assert.equal(Reflect.set(clock, 'revision', () => -1), false);
  assert.equal(Reflect.set(clock, 'reset', () => 0), false);
  assert.equal(clock.revision(), 8);
});
