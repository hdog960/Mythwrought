import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const sha = /^[a-f0-9]{40}$/;
export const branch = /^(?!.*(?:\.\.|\/\/|\/@\{|@\{|\.lock(?:\/|$)))[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/;
export const positive = value => Number.isSafeInteger(value) && value > 0;
export const digest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
export const repository = 'hdog960/Mythwrought';
export const github = `https://github.com/${repository}`;
const remote = `${github}.git`;

export function makeRepo(fetcher = fetch) {
  const metrics = { git: 0, api: 0, downloads: 0, dispatches: 0, polls: 0, publicAssetReads: 0 };
  const responses = new Map();
  const objects = new Set();
  const git = (...args) => {
    metrics.git++;
    return execFileSync('git', args, {
      encoding: 'utf8', timeout: 35_000, maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
    }).trimEnd();
  };

  function ensure(commit) {
    if (!sha.test(commit)) throw new Error('Supply a complete commit SHA.');
    if (!objects.has(commit)) {
      try { git('cat-file', '-e', `${commit}^{commit}`); }
      catch { git('fetch', '--quiet', '--no-tags', '--no-write-fetch-head', remote, commit); }
      objects.add(commit);
    }
  }

  function refs(names) {
    const unique = [...new Set(names)];
    if (unique.some(name => !branch.test(name))) throw new Error('Invalid branch name.');
    const result = Object.fromEntries(unique.map(name => [name, null]));
    for (const line of git('ls-remote', '--heads', remote, ...unique.map(name => `refs/heads/${name}`)).split('\n')) {
      const [head, ref] = line.split('\t');
      if (sha.test(head) && unique.includes(ref?.slice(11))) result[ref.slice(11)] = head;
    }
    return result;
  }

  async function request(path, archive = false) {
    if (!/^[\w./?=&%-]+$/.test(path) || path.includes('..') || path.startsWith('/')) throw new Error('Invalid API route.');
    metrics[archive ? 'downloads' : 'api']++;
    const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetcher(`https://api.github.com/repos/${repository}/${path}`, {
      headers, signal: AbortSignal.timeout(25_000), redirect: archive ? 'follow' : 'error',
    });
    if (!response.ok) {
      const err = new Error(`GitHub returned ${response.status} for ${path}.`);
      err.status = response.status;
      err.rateLimited = response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after');
      throw err;
    }
    return response;
  }

  function api(path) {
    if (!responses.has(path)) responses.set(path, request(path).then(response => response.json()));
    return responses.get(path);
  }

  async function artifact(evidence, directory) {
    const item = evidence.artifact;
    if (evidence.status !== 'qualified' || !item || !positive(item.id) || !/^sha256:[a-f0-9]{64}$/.test(item.digest)) {
      throw new Error('Artifact retrieval requires qualified digest-bound evidence.');
    }
    const filename = join(directory, `${item.digest.slice(7)}.zip`);
    try {
      if (digest(await readFile(filename)) !== item.digest) throw new Error('Cached artifact digest mismatch.');
      return { filename, cacheHit: true };
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (item.expired) throw new Error('GitHub artifact expired and no verified local copy exists.');
    const response = await request(`actions/artifacts/${item.id}/zip`, true);
    const maximum = 128 * 1024 * 1024;
    const chunks = [];
    let length = 0;
    for await (const chunk of response.body) {
      length += chunk.byteLength;
      if (length > maximum) throw new Error('Artifact exceeds the 128 MiB cache limit.');
      chunks.push(chunk);
    }
    const bytes = Buffer.concat(chunks, length);
    if (digest(bytes) !== item.digest) throw new Error('Downloaded artifact digest mismatch.');
    await mkdir(directory, { recursive: true });
    try { await writeFile(filename, bytes, { flag: 'wx' }); }
    catch (error) {
      if (error.code !== 'EEXIST' || digest(await readFile(filename)) !== item.digest) throw error;
    }
    return { filename, cacheHit: false };
  }

  async function publicAssets(commit) {
    const paths = ['index.html', 'src/main.mjs', 'sw-m5.js', 'sw-nonblock-stage.js', 'nonblock-stage-assets.json', 'manifest.webmanifest'];
    return Promise.all(paths.map(async path => {
      metrics.publicAssetReads++;
      const expectedBlob = blob(commit, path);
      try {
        const response = await fetcher(`https://hdog960.github.io/Mythwrought/${path}`, {
          redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) return { path, matches: false, status: response.status, expectedBlob };
        const bytes = Buffer.from(await response.arrayBuffer());
        const publicBlob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
        return { path, matches: publicBlob === expectedBlob, expectedBlob, publicBlob };
      } catch (error) {
        return { path, matches: false, expectedBlob, error: error.cause?.code ?? error.message };
      }
    }));
  }

  function tree(commit) { ensure(commit); return git('rev-parse', `${commit}^{tree}`); }
  function blob(commit, path) { ensure(commit); return git('rev-parse', `${commit}:${path}`); }
  function readAt(commit, path) {
    ensure(commit);
    try { return git('show', `${commit}:${path}`); }
    catch { return null; }
  }
  function currentBranch() {
    try { return git('symbolic-ref', '--quiet', '--short', 'HEAD'); }
    catch { return null; }
  }
  function parents(commit) { ensure(commit); return git('show', '-s', '--format=%P', commit).split(' ').filter(Boolean); }
  function diff(from, to, mergeBase = false) {
    ensure(from);
    ensure(to);
    const start = mergeBase ? git('merge-base', from, to) : from;
    return git('diff', '--no-renames', '--name-only', '-z', start, to, '--').split('\0').filter(Boolean);
  }
  return { metrics, api, refs, ensure, tree, blob, readAt, currentBranch, parents, diff, artifact, publicAssets };
}
