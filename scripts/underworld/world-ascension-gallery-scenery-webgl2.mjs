import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { sectionForY } from '../../src/depth.mjs';
import { candidateVertices, NONBLOCK_SCENERY_MATERIAL } from '../../src/nonblock/candidate-scene.mjs';
import { STORYBOOK_MATERIAL_FRAGMENT_SHADER } from '../../src/storybook-materials.mjs';
import { engineWantedSections } from '../../src/living-underworld/gallery-streaming-working-set.mjs';
import { meshReadOnlySharedBatch } from '../../src/living-underworld/shared-native-mesh-snapshot.mjs';

const asBytes = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export async function renderGalleryScenery({ view, witnesses, output }) {
  const root = process.cwd(), main = await readFile(resolve(root, 'src/main.mjs'), 'utf8');
  const start = main.indexOf('const VS=['), end = main.indexOf('let program,skyProgram', start);
  assert.ok(start >= 0 && end > start);
  const expression = main.slice(start, end);
  const shaders = Function('STORYBOOK_MATERIAL_FRAGMENT_SHADER', 'nonblockGeometry', expression + 'return {VS,FS};')(
    STORYBOOK_MATERIAL_FRAGMENT_SHADER, { NONBLOCK_SCENERY_MATERIAL });
  const rows = witnesses.map(({ object, eye, direction, visible, reopened }) => {
    const [x, y, z] = eye;
    const keys = engineWantedSections(Math.floor(x / 16), Math.floor(z / 16), sectionForY(y - 1.55));
    const meshes = [];
    for (let begin = 0; begin < keys.length; begin += 6) {
      const batch = meshReadOnlySharedBatch(view, keys.slice(begin, begin + 6));
      assert.equal(batch.ok, true);
      meshes.push(...batch.meshes.map(row => asBytes(row.vertices)));
    }
    const terrain = Buffer.concat(meshes);
    assert.ok(terrain.byteLength > 0);
    return { id: object.sceneId, anchor: object.anchor, eye, direction, owners: keys.length,
      meshes: { terrain, intact: asBytes(candidateVertices(visible)), removed: asBytes(candidateVertices(reopened)) } };
  });
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1').pathname;
      if (url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<!doctype html><canvas width="844" height="390" style="display:block"></canvas>');
        return;
      }
      const data = /^\/mesh\/(\d+)\/(terrain|intact|removed)$/.exec(url);
      if (data) {
        const bytes = rows[Number(data[1])]?.meshes[data[2]];
        if (!bytes) throw Error('Unknown mesh');
        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        res.end(bytes);
        return;
      }
      const file = resolve(root, '.' + decodeURIComponent(url));
      if (!file.startsWith(root + sep) || !file.endsWith('.mjs')) throw Error('Outside fixture modules');
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(bytes);
    } catch {
      if (!res.headersSent) res.writeHead(404);
      res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { chromium } = createRequire(import.meta.url)('playwright');
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const page = await browser.newPage({ viewport: { width: 860, height: 406 } });
    await page.goto('http://127.0.0.1:' + server.address().port);
    await page.evaluate(async ({ VS, FS }) => {
      const { buildGpuPipeline } = await import('/src/gpu-pipeline.mjs');
      const { uploadChunkBuffer } = await import('/src/gpu-recovery.mjs');
      const { SKY_VERTEX_SHADER, SKY_FRAGMENT_SHADER } = await import('/src/sky.mjs');
      const canvas = document.querySelector('canvas');
      const gl = canvas.getContext('webgl2', { alpha: false, depth: true, preserveDrawingBuffer: true });
      const p = buildGpuPipeline(gl, { terrainVertex: VS, terrainFragment: FS,
        skyVertex: SKY_VERTEX_SHADER, skyFragment: SKY_FRAGMENT_SHADER });
      gl.enable(gl.DEPTH_TEST);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(p.terrainProgram);
      const U = p.uniforms;
      const fog = [.053, .068, .088];
      gl.clearColor(...fog, 1);
      gl.uniform3fv(U.uFog, fog);
      gl.uniform3fv(U.uSkyLight, [.76, .81, .91]);
      gl.uniform1f(U.uCaveHaze, 1);
      gl.uniform1f(U.uArtQuality, 1);
      gl.uniform1f(U.uAspect, canvas.width / canvas.height);
      gl.uniform1f(U.uTan, Math.tan(Math.PI / 5));
      window.drawGalleryWitness = async ({ index, eye, direction }) => {
        const forward = direction.map(value => value / Math.hypot(...direction));
        const [fx, fy, fz] = forward, horizontal = Math.hypot(fx, fz);
        const right = [-fz / horizontal, 0, fx / horizontal];
        const up = [-fy * fx / horizontal, horizontal, -fy * fz / horizontal];
        gl.uniform3fv(U.uEye, eye);
        gl.uniform3fv(U.uForward, forward);
        gl.uniform3fv(U.uRight, right);
        gl.uniform3fv(U.uUp, up);
        const sources = await Promise.all(['terrain', 'intact', 'removed'].map(async layer => {
          const response = await fetch('/mesh/' + index + '/' + layer);
          if (!response.ok) throw Error('Missing gallery mesh');
          const bytes = await response.arrayBuffer();
          return { buffer: bytes.byteLength ? uploadChunkBuffer(gl, new Float32Array(bytes)) : null,
            count: bytes.byteLength / 36 };
        }));
        function draw(scenery) {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          for (const { buffer, count } of [sources[0], scenery]) {
            if (!buffer) continue;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            for (const [attribute, size, offset] of [[p.atPos, 3, 0], [p.atColor, 3, 12], [p.atUv, 2, 24], [p.atMat, 1, 32]]) {
              gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 36, offset);
            }
            gl.drawArrays(gl.TRIANGLES, 0, count);
          }
          const pixels = new Uint8Array(canvas.width * canvas.height * 4);
          gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          return pixels;
        }
        const removed = draw(sources[2]), intact = draw(sources[1]);
        let changedPixels = 0;
        for (let i = 0; i < intact.length; i += 4) {
          if (intact[i] !== removed[i] || intact[i + 1] !== removed[i + 1] || intact[i + 2] !== removed[i + 2]) changedPixels++;
        }
        for (const row of sources) if (row.buffer) gl.deleteBuffer(row.buffer);
        return { changedPixels, error: gl.getError() };
      };
    }, shaders);
    const evidence = [];
    for (const [index, { id, anchor, eye, direction, owners, meshes }] of rows.entries()) {
      const stats = await page.evaluate(args => window.drawGalleryWitness(args), { index, eye, direction });
      assert.equal(stats.error, 0);
      assert.ok(stats.changedPixels > 0, id + ' made no visible contribution');
      const file = 'gallery-' + id.split(':').at(-1) + '.png';
      const image = await page.screenshot({ path: resolve(output, file) });
      evidence.push({ id, anchor, eye, owners, file, sha256: digest(image), terrainBytes: meshes.terrain.length,
        sceneryBytes: meshes.intact.length, ...stats });
    }
    return { stockShaderSha256: digest(expression), browser: browser.version(), evidence };
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
