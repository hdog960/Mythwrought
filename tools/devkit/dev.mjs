import { readFile, appendFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { authenticate, diagnose, plan, systems } from './inspect.mjs';
import { branch, github, makeRepo, positive, sha } from './repo.mjs';

const registry = JSON.parse(await readFile(new URL('./registry.json', import.meta.url), 'utf8'));
const aliases = {
  'continue development': 'continue', 'continue my development': 'continue', 'recover my checkpoint': 'continue',
  'authenticate my existing tests': 'evidence', 'check for shared-system changes': 'compatibility',
  'run only the necessary tests': 'plan', 'find my blocking issue': 'blocker', 'audit my remaining roadmap': 'continue',
  'prepare my release candidate': 'release', 'check my release readiness': 'release',
  'check whether my branch is compatible': 'compatibility', 'generate my continuation checkpoint': 'checkpoint',
  'audit my development efficiency': 'metrics',
};

function options(args) {
  const allowed = new Set(['owner', 'branch', 'pr', 'checkpoint', 'head', 'base', 'gate', 'cache', 'run', 'mode', 'next', 'done', 'blocker', 'pending', 'remaining', 'roadmap-version', 'systems', 'access', 'protect', 'publication']);
  const result = Object.create(null);
  for (let i = 0; i < args.length; i += 2) {
    const name = args[i].slice(2);
    const value = args[i + 1];
    if (!args[i].startsWith('--') || !allowed.has(name) || Object.hasOwn(result, name) || !value || value.startsWith('--')) {
      throw new Error(`Invalid option ${args[i]}. Each option requires one value.`);
    }
    result[name] = value;
  }
  return result;
}

function checkpointValid(value) {
  if (!value || value.schema !== 1 || typeof value.owner !== 'string' || !branch.test(value.branch) ||
      !sha.test(value.head) || !sha.test(value.base) || (value.pr !== null && !positive(value.pr)) ||
      !Array.isArray(value.pending) || !value.pending.every(positive) || !Array.isArray(value.evidence) ||
      !value.evidence.every(gate => Object.hasOwn(registry.qualification, gate)) || !Array.isArray(value.systems) ||
      !Array.isArray(value.protected) || value.protected.length > 12 || !value.protected.every(item => item && branch.test(item.ref) && sha.test(item.sha)) ||
      !value.systems.every(key => /^[a-z]+$/.test(key))) throw new Error('Invalid or unsupported checkpoint.');
  for (const field of ['done', 'remaining', 'next', 'blocker', 'roadmapVersion']) {
    if (typeof value[field] !== 'string' || value[field].length > 900) throw new Error(`Invalid checkpoint ${field}.`);
  }
  return value;
}

function split(value) { return value ? value.split(',').map(part => part.trim()).filter(Boolean) : []; }

async function publication(repo, main, argument) {
  const id = Number(argument);
  if (!positive(id)) throw new Error('Invalid Pages workflow run ID.');
  const item = await repo.api(`actions/runs/${id}`);
  const run = { id, head: item.head_sha, url: item.html_url, status: item.status, conclusion: item.conclusion };
  if (item.head_branch !== registry.base || item.head_sha !== main || item.path !== '.github/workflows/pages.yml' || item.conclusion !== 'success') {
    return { run, status: 'unverified', reason: 'Expected a successful Pages workflow at the current main SHA.' };
  }
  const assets = await repo.publicAssets(main);
  return { run, assets, status: assets.every(item => item.matches) ? 'Pages workflow and sampled live bytes match current main' : 'live byte mismatch' };
}

async function run(command, args, repo) {
  if (command === 'registry') return registry;
  if (command === 'metrics') {
    return { unit: 'one operation', metrics: repo.metrics, instructions: 'Use the metrics on each report and Pilot measurement in DEVELOPER_EFFICIENCY_PILOT.md.' };
  }
  let cp = args.checkpoint ? checkpointValid(JSON.parse((await readFile(args.checkpoint, 'utf8')).replace(/^\uFEFF/, ''))) : null;
  const localBranch = command === 'continue' && !args.branch && !args.owner && !cp ? repo.currentBranch() : null;
  const matchingOwner = Object.entries(registry.assignments).find(([, entry]) => entry.branch === (args.branch ?? localBranch))?.[0];
  const owner = (args.owner ?? cp?.owner ?? matchingOwner)?.replace(/^:/, '');
  if (cp && owner !== cp.owner) throw new Error('Checkpoint belongs to another identity.');
  const assignment = Object.hasOwn(registry.assignments, owner) ? registry.assignments[owner] : null;
  const automation = Object.hasOwn(registry.automations, owner) ? registry.automations[owner] : null;
  const chosen = args.branch ?? assignment?.branch ?? cp?.branch;
  if (assignment && chosen !== assignment.branch) throw new Error('Branch conflicts with the registry. Confirm the owner source before proceeding.');
  const pr = args.pr ? Number(args.pr) : assignment?.pr ?? cp?.pr ?? null;
  if ((pr !== null && !positive(pr)) || (assignment && pr !== assignment.pr)) throw new Error('Invalid PR or conflict with the registry.');
  if (args.head && chosen) throw new Error('Use either a live branch or a historical --head.');
  if ((args.head && !sha.test(args.head)) || (args.base && !sha.test(args.base))) throw new Error('Supply complete SHA values.');
  if (!chosen && !args.head) return {
    owner: owner ?? null, automation, status: 'assignment-required',
    next: 'Read your existing assignment and supply its branch and PR. Confirm permission in the original instructions.',
  };
  if (args.head && !['evidence', 'plan', 'runs', 'blocker'].includes(command)) throw new Error('This operation needs a live branch.');

  let protectedNames = [...new Set([registry.base, ...(cp?.protected.map(item => item.ref) ?? []), ...split(args.protect)])];
  if (protectedNames.length > 12) throw new Error('Checkpoint may track at most twelve protected refs, including main.');
  let refs = repo.refs([...protectedNames, ...(chosen ? [chosen] : [])]);
  let main = refs[registry.base];
  const head = args.head ?? refs[chosen];
  if (!head || !main) return { branch: chosen, refs, diagnostic: diagnose({ stale: true }) };
  let autoCheckpointError;
  let checkpointOnlyCommit = false;
  if (!cp && command === 'continue' && owner && /^[a-z0-9-]{1,40}$/.test(owner)) {
    const path = `docs/developer-checkpoints/${owner}.json`;
    const body = repo.readAt(head, path);
    if (body) {
      try {
        const saved = checkpointValid(JSON.parse(body));
        if (saved.owner !== owner) throw new Error('Stored checkpoint identifies a different owner.');
        cp = saved;
        if (cp.head !== head) {
          const parents = repo.parents(head);
          checkpointOnlyCommit = parents.length === 1 && parents[0] === cp.head && repo.diff(cp.head, head).every(changed => changed === path);
        }
        const extraRefs = cp.protected.map(item => item.ref).filter(ref => !protectedNames.includes(ref));
        if (extraRefs.length) {
          protectedNames = [...protectedNames, ...new Set(extraRefs)];
          refs = repo.refs([...protectedNames, chosen]);
          main = refs[registry.base];
        }
      } catch (error) { autoCheckpointError = error.message; }
    }
  }
  const prior = args.base ?? cp?.base ?? main;
  const hosted = pr ? await repo.api(`pulls/${pr}`) : null;
  const prMismatch = hosted && (hosted.head?.sha !== head || hosted.head?.ref !== chosen || hosted.head?.repo?.full_name !== registry.repository || hosted.state !== 'open');
  const stale = Boolean(prMismatch || (chosen && refs[chosen] !== head) || autoCheckpointError || (cp && ((cp.head !== head && !checkpointOnlyCommit) || cp.branch !== chosen || cp.pr !== pr)));
  const tree = repo.tree(head);

  if (command === 'runs') {
    const runs = await repo.api(`actions/runs?head_sha=${head}&per_page=30`);
    return { head, tree, total: runs.total_count, limit: 30, runs: runs.workflow_runs.map(item => ({
      id: item.id, attempt: item.run_attempt, workflow: item.path, status: item.status, conclusion: item.conclusion,
      url: item.html_url, jobs: `${item.html_url}/attempts/${item.run_attempt}`, start: item.run_started_at,
    })) };
  }

  const gateNames = [...new Set([...split(args.gate), ...(cp?.evidence ?? [])])];
  if (gateNames.length > 8) throw new Error('Select at most eight gates per report.');
  const gates = await Promise.all(gateNames.map(name => authenticate(repo, name, Object.hasOwn(registry.qualification, name) ? registry.qualification[name] : null, head, tree)));
  if (command === 'evidence') {
    if (args.cache && gates.length !== 1) throw new Error('Select one gate when retrieving an artifact.');
    const artifact = args.cache ? await repo.artifact(gates[0], args.cache) : undefined;
    return { head, tree, evidence: gates, artifact };
  }

  let delta;
  let upstream;
  let conflicts = [];
  let diffError;
  try {
    delta = repo.diff(main, head, true);
    if (prior !== main) {
      upstream = repo.diff(prior, main);
      const upstreamPaths = new Set(upstream);
      conflicts = delta.filter(path => upstreamPaths.has(path));
    }
  } catch (error) { diffError = error.message; }
  const interests = args.systems ? split(args.systems) : assignment?.systems ?? cp?.systems ?? systems(delta ?? []);
  const upstreamSystems = upstream ? systems(upstream) : [];
  const relevant = upstreamSystems.filter(system => interests.includes(system));
  const protectedRefs = [registry.base, ...protectedNames.filter(ref => ref !== registry.base)].map(ref => ({ ref, sha: refs[ref], previous: cp?.protected?.find(item => item.ref === ref)?.sha ?? null }));
  const changedProtected = protectedRefs.filter(item => item.previous && item.sha !== item.previous);
  const access = args.access ?? gates.find(item => item.category)?.category ?? (diffError ? 'prerequisite' : undefined);
  const diagnostic = !cp && !args.next && !stale && !conflicts.length && !access && !gates.some(item => ['pending', 'failed'].includes(item.status))
    ? ['owner-checkpoint-needed', 'Recover the owner roadmap and handoff before deciding whether independent work is exhausted.']
    : diagnose({ checkpoint: cp, stale, conflicts, evidence: gates, independent: !stale && Boolean(cp?.next || args.next), access });
  let pending;
  if (args.run) {
    const id = Number(args.run);
    if (!positive(id)) throw new Error('Invalid run ID.');
    const item = await repo.api(`actions/runs/${id}`);
    pending = { id, head: item.head_sha, matchesCandidate: item.head_sha === head, status: item.status, conclusion: item.conclusion, url: item.html_url };
  }
  const tests = plan(delta ?? [], command === 'release' ? 'release' : args.mode);
  const status = stale ? 'stale' : diffError ? 'unverified' : 'live refs verified';
  const context = { owner: owner ?? null, assignment, automation, branch: chosen ?? null, head, tree, main, autoCheckpointError, checkpointOnlyCommit,
    handoff: assignment?.handoff ? `${github}/blob/${head}/${assignment.handoff}` : null,
    pr: hosted ? { number: pr, url: `${github}/pull/${pr}`, draft: hosted.draft, status: hosted.state, observedHead: hosted.head?.sha } : null,
    status, rules: registry.rules.map(id => `${github}/issues/${id}`), protected: protectedRefs, changedProtected,
    coordination: { from: prior, upstreamSystems, relevant, overlappingPaths: conflicts.slice(0, 20), overlapCount: conflicts.length,
      assessment: diffError ? 'Diff unavailable. Inspect the common base and available objects.' : prior === main ? 'No previous main baseline supplied for a coordination comparison.' : 'Path and system overlap are advisory. Coordinate with owners and run required integration checks.',
      source: registry.coordinationSource },
    changedPaths: delta?.slice(0, 20) ?? [], changedCount: delta?.length ?? null, tests, evidence: gates, pending, diagnostic,
  };
  if (command === 'plan' || command === 'compatibility' || command === 'blocker') return context;
  if (command === 'release') return { ...context, readiness: 'review required', publication: args.publication ? await publication(repo, main, args.publication) : undefined, required: [
    'Creator authorization for this exact candidate and its agreed integration queue slot.',
    'Expected head and protected refs rechecked immediately before the authorized merge.',
    'Required branch checks, exact final aggregate, dependency reconciliation and owner review.',
    'Normal Create World produces the combined systems (#492), shared-height limits hold (#498), and historical saves keep their generator and data.',
    'Verified manifest inventory and hashes, installed upgrade, rollback, offline cold boot and historical save replay.',
    'After authorized publication, independently verify Pages run, deployed source/release identity and live assets.',
    'Physical iPhone acceptance by the authorized reviewer for the exact release and applicable scenarios.',
  ] };
  if (command === 'checkpoint') {
    if (!owner || !args.next || stale || diffError || protectedRefs.some(item => !item.sha)) throw new Error('A checkpoint requires identity, verified live refs and next action. Reconcile stale or missing input first.');
    return checkpointValid({ schema: 1, owner, branch: chosen, head, base: main, pr, systems: interests,
      protected: protectedRefs.map(({ ref, sha }) => ({ ref, sha })), evidence: gates.filter(item => item.status === 'qualified').map(item => item.name),
      pending: split(args.pending).map(Number), done: args.done ?? '', blocker: args.blocker ?? '',
      remaining: args.remaining ?? '', next: args.next, roadmapVersion: args['roadmap-version'] ?? '',
    });
  }
  return { ...context, checkpoint: cp && !stale ? cp : null, next: stale ? 'Reconcile the exact head before using checkpoint instructions.' : cp?.next ?? 'Read the assignment source and recover the most recent owner checkpoint.' };
}

const started = performance.now();
const [action = 'help', ...raw] = process.argv.slice(2);
const command = Object.hasOwn(aliases, action.toLowerCase()) ? aliases[action.toLowerCase()] : action;
const repo = makeRepo();
try {
  if (!['help', 'registry', 'continue', 'plan', 'evidence', 'runs', 'compatibility', 'blocker', 'checkpoint', 'release', 'metrics'].includes(command)) throw new Error(`Unknown operation ${command}. Use help.`);
  const output = command === 'help' ? { usage: 'node tools/devkit/dev.mjs <continue|registry|plan|evidence|runs|compatibility|blocker|checkpoint|release|metrics> [options]', example: 'node tools/devkit/dev.mjs continue --owner beasts', docs: 'docs/DEVELOPER_EFFICIENCY.md' } : await run(command, options(raw), repo);
  const metrics = { ...repo.metrics, elapsedMs: Math.round(performance.now() - started) };
  const body = JSON.stringify(command === 'checkpoint' ? output : { ...output, metrics }, null, 2);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Mythwrought developer report\n\nDownload or copy this report for continuation.\n\n\`\`\`json\n${body.replaceAll('`', '\\u0060')}\n\`\`\`\n`);
  console.log(body);
} catch (error) {
  const access = error.rateLimited || error.status >= 500 || ['TimeoutError', 'TypeError'].includes(error.name)
    ? 'service' : [401, 403].includes(error.status) ? 'permission' : undefined;
  console.error(JSON.stringify({ error: error.message, diagnostic: access ? diagnose({ access }) : undefined, metrics: repo.metrics }));
  process.exitCode = 1;
}
