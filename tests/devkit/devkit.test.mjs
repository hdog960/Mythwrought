import { strict as assert } from 'node:assert';
import { mkdtemp, rm, rmdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { authenticate, diagnose, plan } from '../../tools/devkit/inspect.mjs';
import { digest, makeRepo, repository } from '../../tools/devkit/repo.mjs';

const source = 'a'.repeat(40);
const candidate = 'b'.repeat(40);
const tree = 'c'.repeat(40);
const workflowBlob = 'e'.repeat(40);
const archive = Buffer.from('controlled artifact bytes');
const gate = { head: source, tree, workflow: '.github/workflows/fixture.yml', workflowBlob, branch: 'fixture', run: 42, attempt: 2,
  job: 43, jobName: 'check', steps: ['execute'], fixture: 'f'.repeat(40), reuse: 'toolkit-only',
  artifact: { id: 44, name: 'proof', digest: digest(archive) } };

function responses(overrides = {}) {
  return {
    'actions/runs/42/attempts/2': { id: 42, run_attempt: 2, status: 'completed', conclusion: 'success', head_sha: source,
      head_branch: 'fixture', path: gate.workflow, event: 'push', head_repository: { full_name: repository }, ...overrides.run },
    'actions/runs/42/attempts/2/jobs?per_page=100': { jobs: [{ id: 43, name: 'check', head_sha: source, status: 'completed', conclusion: 'success',
      steps: [{ name: 'execute', status: 'completed', conclusion: 'success' }], ...overrides.job }] },
    'actions/runs/42/artifacts?per_page=100': { artifacts: [{ ...gate.artifact, expired: false, ...overrides.artifact }] },
  };
}

function fixture(overrides = {}, delta = []) {
  const data = responses(overrides);
  const client = makeRepo(async url => Response.json(data[url.split(`${repository}/`)[1]]));
  return { ...client, tree: () => tree, blob: () => workflowBlob, diff: () => delta };
}

test('evidence verifies only the exact attempt, executed steps, source and artifact', async () => {
  assert.equal((await authenticate(fixture(), 'proof', gate, source, tree)).status, 'qualified');
  assert.equal((await authenticate(fixture({ run: { run_attempt: 3 } }), 'proof', gate, source, tree)).status, 'invalidated');
  assert.equal((await authenticate(fixture({ run: { status: 'in_progress' } }), 'proof', gate, source, tree)).status, 'pending');
  assert.equal((await authenticate(fixture({ run: { conclusion: 'failure' } }), 'proof', gate, source, tree)).status, 'failed');
  assert.equal((await authenticate(fixture({ job: { steps: [{ name: 'execute', status: 'completed', conclusion: 'skipped' }] } }), 'proof', gate, source, tree)).status, 'missing');
  assert.equal((await authenticate(fixture({ artifact: { digest: 'wrong' } }), 'proof', gate, source, tree)).status, 'missing');
  assert.equal((await authenticate(fixture(), 'proof', null, source, tree)).status, 'missing');
});

test('toolkit-only changes can reuse scoped evidence and preserve historical identity', async () => {
  const copy = await authenticate(fixture({}, ['AGENTS.md']), 'proof', gate, candidate, 'd'.repeat(40));
  assert.equal(copy.status, 'qualified');
  assert.equal(copy.head, source);
  assert.match(copy.scope, /historical job retained/);
  assert.equal((await authenticate(fixture({}, ['src/main.mjs']), 'proof', gate, candidate, 'd'.repeat(40))).status, 'invalidated');
  assert.equal((await authenticate(fixture(), 'proof', { ...gate, reuse: 'exact' }, candidate, tree)).status, 'stale');
});

test('one report reads each existing endpoint once and never dispatches', async () => {
  const repo = fixture();
  await Promise.all(Array.from({ length: 4 }, () => authenticate(repo, 'proof', gate, source, tree)));
  assert.deepEqual(repo.metrics, { git: 0, api: 3, downloads: 0, dispatches: 0, polls: 0, publicAssetReads: 0 });
});

test('artifact cache verifies bytes and rejects corruption', async () => {
  const client = makeRepo(async () => new Response(archive));
  const root = await mkdtemp(join(tmpdir(), 'mw-devkit-test-'));
  try {
    const evidence = { status: 'qualified', artifact: gate.artifact };
    const result = await client.artifact(evidence, root);
    assert.equal(result.cacheHit, false);
    assert.equal((await client.artifact(evidence, root)).cacheHit, true);
    assert.equal(client.metrics.downloads, 1);
    await writeFile(result.filename, 'damaged');
    await assert.rejects(client.artifact(evidence, root), /digest mismatch/);
  } finally {
    await rm(join(root, `${gate.artifact.digest.slice(7)}.zip`), { force: true });
    await rmdir(root);
  }
});

test('planning routes known changes and fails closed for unknown scope', () => {
  assert.match(plan(['docs/DEVELOPER_EFFICIENCY.md']).requiredReview, /No discretionary/);
  const runtime = plan(['src/main.mjs', 'manifest.webmanifest']);
  assert.ok(runtime.affected.includes('height') && runtime.affected.includes('offline'));
  assert.ok(runtime.local.includes('tests/persistence.test.mjs'));
  assert.match(plan(['unknown.file']).requiredReview, /full gate/);
  assert.match(plan(['AGENTS.md'], 'release').requiredReview, /full gate/);
});

test('blocker report favors stale refs and actionable pending state', () => {
  assert.equal(diagnose({ stale: true, evidence: [{ status: 'pending' }] })[0], 'stale-reference');
  assert.match(diagnose({ evidence: [{ status: 'pending' }], independent: true })[1], /Continue/);
  assert.match(diagnose({ checkpoint: { pending: [42] }, independent: false })[1], /stop/);
  assert.equal(diagnose({ access: 'permission' })[0], 'missing-permission');
});
