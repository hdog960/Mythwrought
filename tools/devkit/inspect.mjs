import { classifyPaths } from '../../scripts/ci/scope.mjs';
import { github, repository, sha } from './repo.mjs';

const shared = {
  world: /^(?:src\/(?:main\.mjs|voxel\.mjs|seeds\.mjs|chunks\.mjs|depth\.mjs|manual-biomes\/|surface-regions\/|nonblock\/|.*(?:world|cave|terrain).*\.mjs)|index\.html)/,
  height: /^src\/(?:main\.mjs|voxel\.mjs|depth\.mjs|world-height|manual-biomes\/(?:profile-world|m2-runtime-bridge))/,
  materials: /^src\/(?:blocks\.mjs|block-packs\/|.*(?:material|registry|shape).*\.mjs)/,
  creatures: /^src\/(?:mobs\/|main\.mjs|.*(?:creature|wildlife).*\.mjs)/,
  buildings: /^src\/(?:building-pool\/|builder-assets\/|pack5-integration\/|.*(?:construction|blueprint).*\.mjs)/,
  render: /^(?:src\/(?:main\.mjs|voxel\.mjs|mobs\/|.*(?:render|gpu|mesh|shader).*\.mjs)|assets\/|styles\.css)/,
  movement: /^src\/(?:main\.mjs|voxel\.mjs|input\.mjs|physics\.mjs|camera\.mjs|.*(?:movement|collision).*\.mjs)/,
  persistence: /^src\/(?:main\.mjs|voxel\.mjs|persistence\.mjs|vault\.mjs|manual-biomes\/|.*(?:save|storage|sidecar).*\.mjs)/,
  offline: /^(?:sw[^/]*\.js|index\.html|manifest\.webmanifest|nonblock-stage-assets\.json|src\/(?:app-update|.*offline).*\.mjs|scripts\/ci\/build-stage-cache-manifest\.mjs)/,
  interfaces: /^src\/(?:main\.mjs|voxel\.mjs|chunks\.mjs|.*(?:contract|adapter|bridge).*\.mjs)/,
};

const focused = {
  world: ['tests/voxel.test.mjs', 'tests/nonblock-unified-world-browser.mjs'],
  height: ['tests/shared-world-height-h1-h2.test.mjs', 'tests/shared-world-height-h4-sidecars.test.mjs', 'tests/shared-world-height-browser.mjs'],
  materials: ['tests/blocks-browser.mjs'],
  creatures: ['tests/mobs/spatial-movement.test.mjs', '.github/workflows/unified-five-system-live-mobs.yml'],
  buildings: ['tests/pack5-integration.test.mjs', 'tests/pack5-integration-browser.mjs'],
  render: ['tests/browser-smoke.mjs', 'tests/context-restore-browser.mjs'],
  movement: ['tests/movement-browser.mjs', 'tests/touch-browser.mjs'],
  persistence: ['tests/persistence.test.mjs', 'tests/persistence-browser.mjs', 'historical save compatibility for the affected generator and release'],
  offline: ['tests/unified-offline-atomic-cache.test.mjs', 'scripts/ci/build-stage-cache-manifest.mjs --check', 'installed prior-release upgrade, rollback and offline cold boot'],
  interfaces: ['integration-specific regression tests for the affected owners'],
};

function docsOnly(path) { return /^(?:docs\/.+|README|AGENTS)\.md$/.test(path); }
function devkitOnly(path) { return /^(?:tools\/devkit\/|tests\/devkit\/|\.github\/workflows\/developer-toolkit\.yml$)/.test(path); }
export function systems(paths) {
  return Object.keys(shared).filter(key => paths.some(path => shared[key].test(path)));
}

export function plan(paths, mode = 'development') {
  const affected = systems(paths);
  const lane = classifyPaths(paths);
  const unknown = paths.filter(path => !docsOnly(path) && !devkitOnly(path) && !systems([path]).length && classifyPaths([path]).mode === 'full');
  const local = [...new Set([...paths.filter(path => /^tests\/(?:[\w.-]+\/)*[\w.-]+\.(?:test\.mjs|mjs)$/.test(path)), ...affected.flatMap(key => focused[key])])];
  if (paths.some(devkitOnly)) local.push('node --test tests/devkit/devkit.test.mjs');
  if (lane.mode === 'isolated') local.push(`node scripts/ci/run-isolated.mjs ${lane.lanes.join(',')}`, 'tests/browser-smoke.mjs', 'tests/layout-browser.mjs');
  const escalation = mode !== 'development' || !paths.length || unknown.length > 0 || affected.length > 0;
  return {
    affected, unknown: unknown.slice(0, 20), unknownCount: unknown.length, local,
    requiredReview: escalation ? 'Review affected owners and applicable branch/release gates. Use the existing full gate where shared inputs, unknown scope or release policy require it.' : 'Preserve branch-required checks. No discretionary broad gameplay dispatch indicated.',
    ci: 'Existing workflow and branch protections govern. This plan never dispatches a test.',
  };
}

export function diagnose({ checkpoint, stale, conflicts, evidence, independent, access }) {
  if (access === 'permission') return ['missing-permission', 'Use an authorized read surface or give the exact denied operation to the owner.'];
  if (access === 'service') return ['temporary-infrastructure', 'Preserve the error and retry once when the service or rate limit recovers.'];
  if (access === 'workflow') return ['incorrect-workflow-configuration', 'Compare checkout, job, environment and fixture inputs with the approved workflow.'];
  if (access === 'assumption') return ['incorrect-assumption', 'Check the live ref, creator directive or original log supporting the assumption.'];
  if (access === 'prerequisite') return ['missing-integration-prerequisite', 'Record the missing source, fixture, owner or acceptance decision with its required identity.'];
  if (stale) return ['stale-reference', 'Reconcile the checkpoint with the live branch and PR before acting on its next task.'];
  if (conflicts?.length) return ['dependency-conflict', 'Review the overlapping files with their owners before integrating.'];
  if (evidence?.some(item => item.status === 'failed')) return ['failure-needs-triage', 'Inspect the first failing job and separate product, fixture, configuration and runner errors.'];
  if (evidence?.some(item => item.status === 'pending') || checkpoint?.pending?.length) return ['pending-qualification', independent ? 'Continue the verified independent task and keep the run link.' : 'Save the run link and stop until the result can change the next action.'];
  if (checkpoint?.blocker) return ['reported-blocker', 'Use the existing evidence and record a new observation before retrying the same action.'];
  if (!independent) return ['independent-work-exhausted', 'Record the handoff and stop if the owner confirms there is no authorized independent work.'];
  return ['actionable', 'Continue the verified independent assignment.'];
}

export async function authenticate(repo, name, gate, head, targetTree) {
  if (!gate) return { name, status: 'missing', reason: 'No reviewed gate record exists.' };
  const url = `${github}/actions/runs/${gate.run}/attempts/${gate.attempt}`;
  const result = { name, head: gate.head, tree: gate.tree, workflow: gate.workflow, run: gate.run, attempt: gate.attempt, job: gate.job,
    url, environment: gate.environment, fixture: gate.fixture, scope: 'historical only until verified' };
  const done = (status, reason, more = {}) => ({ ...result, status, reason, ...more });
  try {
    let scope = 'exact commit';
    if (head !== gate.head) {
      if (gate.reuse !== 'toolkit-only') return done('stale', 'This gate requires fresh qualification at the exact candidate commit.');
      const delta = targetTree === gate.tree ? [] : repo.diff(gate.head, head);
      if (delta.some(path => !devkitOnly(path) && !['AGENTS.md', 'README.md', 'docs/DEVELOPER_EFFICIENCY.md', 'docs/DEVELOPER_EFFICIENCY_PILOT.md'].includes(path))) {
        return done('invalidated', 'The candidate changes files outside the reviewed toolkit-only exclusions.');
      }
      scope = 'same gate inputs under reviewed toolkit exclusions, historical job retained';
    }
    const source = `actions/runs/${gate.run}`;
    if (repo.tree(gate.head) !== gate.tree || repo.blob(gate.head, gate.workflow) !== gate.workflowBlob || !sha.test(gate.fixture)) {
      return done('invalidated', 'Source tree, workflow blob or fixture declaration differs.');
    }
    const run = await repo.api(`${source}/attempts/${gate.attempt}`);
    if (run.id !== gate.run || run.run_attempt !== gate.attempt || run.head_sha !== gate.head || run.head_branch !== gate.branch ||
        run.path !== gate.workflow || run.event !== 'push' || run.head_repository?.full_name !== repository) {
      return done('invalidated', 'GitHub run identity does not match the reviewed gate.');
    }
    if (run.status !== 'completed') return done('pending', `GitHub reports ${run.status}.`);
    const jobs = await repo.api(`${source}/attempts/${gate.attempt}/jobs?per_page=100`);
    const job = jobs.jobs?.find(item => item.id === gate.job && item.name === gate.jobName && item.head_sha === gate.head);
    if (run.conclusion !== 'success') return done('failed', `Run conclusion is ${run.conclusion}.`, { jobUrl: job?.html_url });
    if (!job || job.status !== 'completed' || job.conclusion !== 'success' || !gate.steps.every(name => job.steps?.some(step => step.name === name && step.status === 'completed' && step.conclusion === 'success'))) {
      return done('missing', 'The exact successful job and required executed steps were not found.');
    }
    const artifacts = await repo.api(`${source}/artifacts?per_page=100`);
    const artifact = artifacts.artifacts?.find(item => item.id === gate.artifact.id && item.name === gate.artifact.name && item.digest === gate.artifact.digest);
    if (!artifact) return done('missing', 'The exact GitHub artifact and digest were not found.');
    return done('qualified', 'GitHub attempt, job, executed steps, source and artifact metadata match.', {
      scope, jobUrl: job.html_url,
      artifact: { ...gate.artifact, url: `${github}/actions/runs/${gate.run}/artifacts/${artifact.id}`, expired: artifact.expired },
      requiresArtifactReview: true,
    });
  } catch (error) {
    const category = error.rateLimited || error.status >= 500 || ['TimeoutError', 'TypeError'].includes(error.name) ? 'service' : [401, 403].includes(error.status) ? 'permission' : undefined;
    return done('missing', error.message, { category });
  }
}
