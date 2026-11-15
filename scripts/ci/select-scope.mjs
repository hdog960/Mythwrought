import { execFileSync } from 'node:child_process';
import { classifyPaths } from './scope.mjs';

function selectScope() {
  if (process.env.GITHUB_EVENT_NAME !== 'pull_request') {
    return { mode: 'full', lanes: [], reason: 'main-push-or-manual-run' };
  }
  const base = process.env.GITHUB_BASE_SHA || '';
  if (!/^[0-9a-f]{40}$/i.test(base)) {
    return { mode: 'full', lanes: [], reason: 'missing-pr-base-commit' };
  }
  try {
    execFileSync('git', ['cat-file', '-e', `${base}^{commit}`], { stdio: 'pipe' });
    // --no-renames surfaces BOTH ends of a rename, so moving a shared file
    // into a lane cannot hide a potentially unsafe shared-code change.
    const changed = execFileSync('git',
      ['diff', '--no-renames', '--name-only', '-z', `${base}...HEAD`],
      { maxBuffer: 16 * 1024 * 1024 });
    const paths = changed.toString('utf8').split('\\0').filter(Boolean);
    return classifyPaths(paths);
  } catch {
    // Never silently skip production verification on missing history/errors.
    return { mode: 'full', lanes: [], reason: 'git-history-or-diff-error' };
  }
}

const scope = selectScope();
process.stdout.write(`mode=${scope.mode}\\nlanes=${scope.lanes.join(',')}\\nreason=${scope.reason}\\n`);
