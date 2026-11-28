// Replay the released owner publication function on the same native cave edit
// as the detached face pool. The released world is never mounted or mutated.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { meshDepthSection } from '../../src/depth-mesh.mjs';

const release = '0dbecd924629973412dfd4965db13ada4b3959af';
const floatsPerFace = 54;
const encode = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength).toString('base64');

export async function compareUnifiedCaveEdit({ projection, workingSet, meshes, faceLimit }) {
  const root = process.env.UNIFIED_GAME_SOURCE;
  assert.ok(root, 'UNIFIED_GAME_SOURCE must point to the exact unified release checkout');
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), release);
  const game = resolve(root);
  const main = await readFile(resolve(game, 'src/main.mjs'), 'utf8');
  function extract(name) {
    const start = main.indexOf('  function ' + name + '('), end = main.indexOf('\n  }', start);
    assert.ok(start >= 0 && end > start, 'Missing release function ' + name);
    return main.slice(start, end + 4);
  }
  const functions = ['deleteChunkBuffers', 'uploadPack2Chunk', 'publishEditedChunkBatchOriginal'].map(extract).join('\n');
  const fixture = workingSet.peak.wanted.map(key => {
    const [cx, cz, section] = key.split(',').map(Number);
    const before = meshDepthSection(projection.view, cx, cz, section);
    const update = meshes.find(row => row.key === key);
    assert.equal(before.length % floatsPerFace, 0);
    return { key, cx, cz, section, before: encode(before), after: update ? encode(update.vertices) : null };
  });
  assert.equal(fixture.filter(row => row.after !== null).length, meshes.length);

  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<!doctype html><canvas width="64" height="64"></canvas>');
        return;
      }
      const file = resolve(game, '.' + path);
      if (!file.startsWith(game + sep) || !file.endsWith('.mjs')) throw Error('Invalid release fixture module');
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { chromium } = createRequire(import.meta.url)('playwright');
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:' + server.address().port + '/');
    const result = await page.evaluate(async ({ fixture, functions, floatsPerFace }) => {
      const { uploadChunkBuffer } = await import('/src/gpu-recovery.mjs');
      const { admitUpperGpuBatch } = await import('/src/world-height-budget.mjs');
      const gl = document.querySelector('canvas').getContext('webgl2');
      const check = (ok, message) => { if (!ok) throw Error(message); };
      check(gl, 'WebGL2 required');
      const decode = encoded => new Float32Array(Uint8Array.from(atob(encoded), value => value.charCodeAt(0)).buffer);
      const data = fixture.map(({ before, after, ...owner }) => ({ ...owner, before: decode(before),
        after: after === null ? null : decode(after) }));
      const residentFaces = data.reduce((sum, row) => sum + row.before.length / floatsPerFace, 0);
      const chunks = new Map(data.map(({ key, cx, cz, section, before }) => [key,
        { x: cx, z: cz, section, buffer: uploadChunkBuffer(gl, before), count: before.length / 9,
          waterBuffer: null, waterCount: 0 }]));
      const old = new Map(chunks);
      const batch = data.filter(row => row.after !== null).map(({ key, cx, cz, section, after }) =>
        ({ key, cx, cz, section, vertices: after, water: new Float32Array() }));
      const assemble = Function('gl', 'chunks', 'world', 'uploadChunkBuffer', 'admitUpperGpuBatch', 'traceMeasure',
        functions + '\nreturn publishEditedChunkBatchOriginal;');
      function matches(buffer, vertices) {
        if (!gl.isBuffer(buffer)) return false;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const expected = new Uint8Array(vertices.buffer, vertices.byteOffset, vertices.byteLength);
        if (gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) !== expected.length) return false;
        const bytes = new Uint8Array(expected.length);
        gl.getBufferSubData(gl.ARRAY_BUFFER, 0, bytes);
        return bytes.every((val, i) => val === expected[i]);
      }

      const stagedBeforeFailure = [];
      const inject = (context, vertices) => {
        if (stagedBeforeFailure.length === 2) throw Error('Injected owner upload failure');
        const buffer = uploadChunkBuffer(context, vertices);
        stagedBeforeFailure.push(buffer);
        return buffer;
      };
      try {
        assemble(gl, chunks, {}, inject, admitUpperGpuBatch, null)(batch);
        throw Error('Missing owner upload failure');
      } catch (error) { check(error.message === 'Injected owner upload failure', error.message); }
      check(stagedBeforeFailure.every(buffer => !gl.isBuffer(buffer)), 'Staged buffers leaked after failure');
      check(data.every(({ key, before }) => chunks.get(key) === old.get(key) && matches(old.get(key).buffer, before)),
        'Failed publication changed resident cave data');

      const ready = assemble(gl, chunks, {}, uploadChunkBuffer, admitUpperGpuBatch, null)(batch);
      const stagedFaces = ready.reduce((sum, item) => sum + item.vertices.length / floatsPerFace, 0);
      check(data.every(({ key, before, after }) => matches(chunks.get(key).buffer, after ?? before)), 'Unified native bytes differ after publish');
      check(batch.every(({ key }) => !gl.isBuffer(old.get(key).buffer)), 'Replaced resident buffers leaked');
      for (const { buffer } of chunks.values()) gl.deleteBuffer(buffer);
      check(gl.getError() === gl.NO_ERROR, 'Unified staging WebGL error');
      return { residentFaces, stagedFaces, residentPlusStaged: residentFaces + stagedFaces,
        stagedOwners: ready.length, failedPublicationPreserved: true, fullNativeParity: true };
    }, { fixture, functions, floatsPerFace });
    return { ...result, meetsGalleryFaceLimit: result.residentPlusStaged <= faceLimit, faceLimit, release,
      sourceSha256: createHash('sha256').update(functions).digest('hex'), chromium: browser.version() };
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
