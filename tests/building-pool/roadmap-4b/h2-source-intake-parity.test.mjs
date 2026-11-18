import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../../../', import.meta.url);
const provenance = JSON.parse(readFileSync(new URL('docs/building-pool/roadmap-c-staging/H2_SOURCE_PROVENANCE.json', root), 'utf8'));
const expectedHeads = new Map([
  ['1A', '628134928a171d6db46d0e9d2aa68a4bf877a08e'],
  ['3B', 'af1ba6f1259d094c4d3ed34f5ed8183fb3948424'],
  ['4B', '315eb1f3635aff4057542beae98dd7cf2d9da33a'],
]);
function gitBlobDigest(contents) {
  return createHash('sha1').update(Buffer.from('blob ' + contents.length + '\0')).update(contents).digest('hex');
}

test('Roadmap C H2 isolated intake preserves exact 355 original source-owned Git blob identities', () => {
  assert.equal(provenance.schema, 'mythwrought.roadmap-c.h2-provenance.v1');
  assert.equal(provenance.lanes.length, 3);
  assert.deepEqual(provenance.counts, { all: 355, authored: 613, target: 1095, remaining: 482 });
  const seen = new Set();
  let total = 0;
  for (const lane of provenance.lanes) {
    assert.equal(lane.head, expectedHeads.get(lane.name));
    assert.ok(lane.files.length > 0);
    for (const file of lane.files) {
      assert.match(file.path, new RegExp('^(src|tests|docs)/building-pool/' + lane.dir + '/'));
      assert.ok(!seen.has(file.path), 'duplicated path: ' + file.path);
      seen.add(file.path);
      const data = readFileSync(new URL(file.path, root));
      assert.equal(gitBlobDigest(data), file.sha, 'historical source bytes changed: ' + file.path);
      total++;
    }
  }
  assert.equal(total, 355);
  assert.equal(provenance.mainParent, '104e57ff678a0c58593d1e3c85c13c6c112da992');
});

test('Roadmap C H2 preserves isolated original portfolio source namespaces and opt-out gameplay gates', () => {
  assert.deepEqual(provenance.lanes.map(l => l.dir), ['roadmap-1a','roadmap-3b','roadmap-4b']);
  assert.equal(provenance.lanes.reduce((n,l) => n + l.authored, 0), 613);
  assert.equal(provenance.lanes.reduce((n,l) => n + l.target, 0), 1095);
  assert.ok(provenance.constraints.some(s => s.includes('creator approval')));
});
