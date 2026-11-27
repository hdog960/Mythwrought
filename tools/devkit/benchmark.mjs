import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { authenticate } from './inspect.mjs';
import { makeRepo } from './repo.mjs';

const registry = JSON.parse(await readFile(new URL('./registry.json', import.meta.url), 'utf8'));
const gate = registry.qualification['mining-installed'];
const branch = registry.assignments.beasts.branch;
const consumers = 4;

async function trial(shared) {
  const started = performance.now();
  const repos = [];
  const results = [];
  for (let i = 0; i < (shared ? 1 : consumers); i++) {
    const repo = makeRepo();
    repos.push(repo);
    const refs = shared ? repo.refs(['main', branch]) : { ...repo.refs(['main']), ...repo.refs([branch]) };
    const result = await authenticate(repo, 'mining-installed', gate, gate.head, repo.tree(gate.head));
    assert.equal(result.status, 'qualified', result.reason);
    assert.ok(refs.main && refs[branch]);
    results.push({ refs, status: result.status, run: result.run, artifact: result.artifact.id });
  }
  return {
    results, ms: Math.round(performance.now() - started),
    git: repos.reduce((sum, repo) => sum + repo.metrics.git, 0),
    api: repos.reduce((sum, repo) => sum + repo.metrics.api, 0),
    downloads: 0, dispatches: 0, polls: 0,
  };
}

const baseline = await trial(false);
const toolkit = await trial(true);
for (const checked of baseline.results) assert.deepEqual(checked, toolkit.results[0]);
const { results, ...before } = baseline;
const { results: consolidated, ...after } = toolkit;
console.log(JSON.stringify({ scenario: 'Four handoff consumers recover the same refs and authenticate one known installed gate.',
  before, after, observed: consolidated[0] }, null, 2));
