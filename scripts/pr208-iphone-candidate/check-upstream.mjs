import process from 'node:process';

const SOURCE = 'hdog960/Mythwrought';
const HEAD = '9ab03c3bbff5f449006a344e97e68c9d0141c228';
const BASE = '1f67efc9805e83866549515ffdad4dc7e225b234';
const RUNS = [44017370652,44017370653,44017370666,44017370697,44017370669];
const PATHS = [
  '.github/workflows/biome130-fidelity.yml',
  'docs/BIOME130_FIDELITY_GATE.md',
  'src/biome130-render.mjs',
  'src/builder-assets/biome130.mjs',
  'src/depth-mesh.mjs',
  'src/main.mjs',
  'src/voxel.mjs',
  'tests/biome130-fidelity-browser.mjs',
  'tests/biome130-render-fidelity.test.mjs'
].sort();
function requireCheck(value, message) {
  if (!value) throw new Error(message);
}
async function api(path) {
  const result = await fetch('https://api.github.com' + path, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'mythwrought-pr208-candidate-verifier',
      Authorization: 'Bearer ' + process.env.GITHUB_TOKEN_READONLY
    },
    signal: AbortSignal.timeout(20000)
  });
  requireCheck(result.ok, 'GitHub API returned ' + result.status + ' for ' + path);
  return result.json();
}
async function main() {
  requireCheck(process.env.GITHUB_REPOSITORY === SOURCE, 'Wrong repository');
  requireCheck(process.env.GITHUB_REF === 'refs/heads/pr208-iphone-candidate-build', 'Wrong branch');
  requireCheck(process.env.GITHUB_EVENT_NAME === 'push', 'Wrong event');
  requireCheck(process.env.GITHUB_TOKEN_READONLY, 'Missing read-only Actions token');
  const [repo, pr, main, ancestry, files, ...runs] = await Promise.all([
    api('/repos/' + SOURCE),
    api('/repos/' + SOURCE + '/pulls/208'),
    api('/repos/' + SOURCE + '/branches/main'),
    api('/repos/' + SOURCE + '/compare/' + BASE + '...main'),
    api('/repos/' + SOURCE + '/pulls/208/files?per_page=100'),
    ...RUNS.map(id => api('/repos/' + SOURCE + '/actions/runs/' + id))
  ]);
  requireCheck(repo.full_name === SOURCE && !repo.private, 'Source repository mismatch');
  requireCheck(pr.state === 'open' && pr.draft && !pr.merged_at, 'PR208 no longer draft/unmerged');
  requireCheck(pr.head.sha === HEAD && pr.base.sha === BASE && pr.base.ref === 'main', 'Accepted PR208 source/base drifted');
  requireCheck(pr.changed_files === 9, 'PR changed-file count drifted');
  requireCheck(Array.isArray(files) && files.length === 9 &&
    files.map(f=>f.filename).sort().every((p,i)=>p===PATHS[i]), 'PR ownership drifted');
  requireCheck(/^[a-f0-9]{40}$/.test(main.commit?.sha || ''), 'Cannot identify production main');
  requireCheck(ancestry.base_commit?.sha === BASE && ancestry.behind_by === 0 &&
    ['ahead','identical'].includes(ancestry.status), 'Production main diverged from accepted baseline');
  runs.forEach((run,i) => requireCheck(run.id === RUNS[i] && run.head_sha === HEAD &&
    run.status === 'completed' && run.conclusion === 'success', 'Required exact-head run failed: ' + RUNS[i]));
  process.stdout.write(JSON.stringify({
    source_repo: SOURCE, source_commit: HEAD, pr: 208,
    production_baseline: BASE, observed_main_tip: main.commit.sha,
    newer_main_not_included: true, build_branch: 'pr208-iphone-candidate-build',
    pr_changed_paths: PATHS, verified_workflow_runs: RUNS,
    deployment: false,
    storage_warning: 'Same github.io hostname shares origin; use separate Safari QA profile. No Pages publishing authorized.',
    created_at: new Date().toISOString()
  }, null, 2) + '\n');
}
main().catch(error => {
  console.error('::error::' + error.message);
  process.exitCode = 1;
});
