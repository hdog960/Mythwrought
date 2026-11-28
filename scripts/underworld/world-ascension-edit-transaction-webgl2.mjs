import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { meshDepthSection } from '../../src/depth-mesh.mjs';
import { engineWantedSections } from '../../src/living-underworld/gallery-streaming-working-set.mjs';

const floatsPerFace = 6 * 9;
const encode = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength).toString('base64');

// Detached shared allocation for one view of opaque native cube faces.
// Owner labels and draw ranges stay separate inside the single GPU buffer.
export async function qualifyEditTransaction({ projection, workingSet, owners, edits, faceLimit }) {
  const { peak, peakEdit } = workingSet;
  for (const field of ['cx', 'cz', 'active', 'shaft']) assert.equal(peak[field], peakEdit[field]);
  const deeper = engineWantedSections(peak.cx, peak.cz, peak.active - 1, peak.shaft);
  const peakKeys = new Set(peak.wanted);
  const fixture = [...new Set([...peak.wanted, ...deeper])].map(key => {
    const [cx, cz, section] = key.split(',').map(Number);
    assert.ok(owners.has(key), `Stream owner must be inside the native capture: ${key}`);
    const before = meshDepthSection(projection.view, cx, cz, section);
    assert.equal(owners.get(key).oldFaces, 0, 'The entire allocation counts against the face cap');
    assert.equal(before.length / floatsPerFace, owners.get(key).combinedFaces);
    const updates = edits.map(({ meshes }) => meshes.find(mesh => mesh.key === key)?.vertices ?? null);
    const live = peakKeys.has(key);
    assert.ok(live || updates.every(vertices => vertices === null));
    return { key, live, before: encode(before), updates: updates.map(vertices => vertices && encode(vertices)) };
  });

  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(async ({ fixture, deeper, faceBytes, faceLimit, cases }) => {
      const check = (ok, message) => { if (!ok) throw Error(message); };
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      document.body.append(canvas);
      const gl = canvas.getContext('webgl2');
      check(gl, 'WebGL2 context required');
      const checkGl = () => check(gl.getError() === gl.NO_ERROR && !gl.isContextLost(), 'WebGL2 buffer operation failed');
      function decode(owner, encoded) {
        const bytes = Uint8Array.from(atob(encoded), value => value.charCodeAt(0));
        check(bytes.length % faceBytes === 0, 'Incomplete native face record');
        const faces = new Map();
        for (let offset = 0; offset < bytes.length; offset += faceBytes) {
          const record = bytes.subarray(offset, offset + faceBytes);
          const key = owner + ':' + String.fromCharCode(...record);
          check(!faces.has(key), 'Expected unique opaque native faces');
          faces.set(key, { owner, key, record });
        }
        return faces;
      }
      const native = new Map(fixture.map(({ key, before }) => [key, decode(key, before)]));
      const liveOwners = fixture.filter(owner => owner.live);
      const initial = liveOwners.flatMap(({ key }) => [...native.get(key).values()]);
      // One binary opaque-cell edit changes at most six incident face
      // records. Reserve those staging records before allocating any slots.
      const stagingReserve = 6;
      const capacity = faceLimit - stagingReserve;
      check(initial.length <= capacity, 'Resident geometry exceeds shared allocation');
      let slots = [...initial, ...Array(capacity - initial.length).fill(null)];

      function shader(type, source) {
        const compiled = gl.createShader(type);
        gl.shaderSource(compiled, source);
        gl.compileShader(compiled);
        check(gl.getShaderParameter(compiled, gl.COMPILE_STATUS), gl.getShaderInfoLog(compiled));
        return compiled;
      }
      function createGpuResources() {
        const buffer = gl.createBuffer();
        check(buffer, 'Buffer allocation failed');
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, capacity * faceBytes, gl.DYNAMIC_DRAW);
        const vs = shader(gl.VERTEX_SHADER,
          '#version 300 es\nlayout(location=0) in vec3 p; void main(){gl_Position=vec4((p.x+632.0)/24.0,(p.z+2152.0)/24.0,(p.y+40.0)/50.0,1.0);}');
        const fs = shader(gl.FRAGMENT_SHADER,
          '#version 300 es\nprecision mediump float; out vec4 color; void main(){color=vec4(0.6,0.5,0.4,1.0);}');
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        check(gl.getProgramParameter(program, gl.LINK_STATUS), gl.getProgramInfoLog(program));
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.useProgram(program);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 0);
        checkGl();
        return { buffer, program };
      }
      let gpu = createGpuResources();
      let writeCalls = 0;
      function upload(index, entry) {
        check(index < capacity, 'Write outside shared allocation');
        gl.bufferSubData(gl.ARRAY_BUFFER, index * faceBytes, entry.record);
        checkGl();
        writeCalls++;
      }
      function uploadBatches(writes, failAfter = 0) {
        const scratch = new Uint8Array(stagingReserve * faceBytes);
        let uploads = 0, maxUploadFaces = 0;
        for (let offset = 0; offset < writes.length;) {
          const { index: start } = writes[offset];
          let count = 0;
          while (count < stagingReserve && writes[offset + count]?.index === start + count) {
            scratch.set(writes[offset + count].entry.record, count * faceBytes);
            count++;
          }
          check(start + count <= capacity, 'Batch upload outside shared allocation');
          gl.bufferSubData(gl.ARRAY_BUFFER, start * faceBytes, scratch, 0, count * faceBytes);
          checkGl();
          maxUploadFaces = Math.max(maxUploadFaces, count);
          uploads++;
          writeCalls++;
          offset += count;
          if (uploads === failAfter) throw Error('Injected arrival upload failure');
        }
        return { uploads, maxUploadFaces };
      }
      const uploadLiveSlots = () => uploadBatches(slots.flatMap((entry, index) => entry ? [{ entry, index }] : []));
      uploadLiveSlots();
      function prepare(target) {
        check(target.size <= capacity, 'Shared slots refused');
        const pending = new Map(target);
        const next = slots.map(entry => entry && pending.delete(entry.key) ? entry : null);
        const free = [];
        const freedByOwner = new Map();
        for (let index = 0; index < capacity; index++) {
          if (next[index]) continue;
          free.push(index);
          const previous = slots[index];
          if (previous) freedByOwner.set(previous.owner, [...(freedByOwner.get(previous.owner) ?? []), index]);
        }
        let fallback = 0;
        const writes = [];
        for (const entry of pending.values()) {
          let index = freedByOwner.get(entry.owner)?.shift();
          if (index === undefined || next[index]) {
            while (next[free[fallback]]) fallback++;
            index = free[fallback++];
          }
          check(index !== undefined, 'Shared slots exhausted during planning');
          next[index] = entry;
          writes.push({ index, entry, previous: slots[index] });
        }
        return { next, writes };
      }
      function transact(plan, failAfter = 0, limit = faceLimit) {
        const { next, writes } = plan;
        const rollbackFaces = writes.filter(write => write.previous).length;
        const stagedFaces = capacity + writes.length + rollbackFaces;
        check(stagedFaces <= limit, 'Edit staging capacity refused');
        const attempted = [];
        try {
          for (const write of writes) {
            attempted.push(write);
            upload(write.index, write.entry);
            if (attempted.length === failAfter) throw Error('Injected publication failure');
          }
        } catch (error) {
          for (const write of attempted.reverse()) {
            if (write.previous) upload(write.index, write.previous);
          }
          throw error;
        }
        slots = next;
        return { uploads: writes.length, rollbackFaces, stagedFaces };
      }
      function matchesNative(target) {
        const bytes = new Uint8Array(capacity * faceBytes);
        gl.getBufferSubData(gl.ARRAY_BUFFER, 0, bytes);
        checkGl();
        const remaining = new Map(target);
        return slots.every((entry, index) => {
          if (!entry) return true;
          const expected = remaining.get(entry.key);
          remaining.delete(entry.key);
          return expected && expected.record.every((value, j) => value === bytes[index * faceBytes + j]);
        }) && remaining.size === 0;
      }
      function ranges() {
        const result = [];
        for (const [start, entry] of slots.entries()) {
          if (!entry) continue;
          const last = result.at(-1);
          if (last?.owner === entry.owner && last.start+last.count === start) last.count++;
          else result.push({ owner: entry.owner, start, count: 1 });
        }
        return result;
      }
      function draw(targetFaceCount) {
        const draws = ranges();
        check(draws.reduce((total, draw) => total + draw.count, 0) === targetFaceCount, 'Owner draw ranges omit native faces');
        gl.clear(gl.COLOR_BUFFER_BIT);
        for (const { start, count } of draws) gl.drawArrays(gl.TRIANGLES, start * 6, count * 6);
        checkGl();
        return draws.length;
      }
      const initialTarget = new Map(initial.map(entry => [entry.key, entry]));
      check(matchesNative(initialTarget), 'Initial GPU bytes differ from native');
      const initialRanges = draw(initialTarget.size);
      let previous = initialTarget;
      const steps = [];
      for (const [step, { label, refusal }] of cases.entries()) {
        const target = new Map(liveOwners.flatMap(({ key, updates }) =>
          [...(updates[step] === null ? native.get(key) : decode(key, updates[step]))]));
        if (refusal) {
          const before = writeCalls;
          try { prepare(target); throw Error('Expected shared allocation refusal'); }
          catch (error) { check(error.message === refusal, error.message); }
          check(writeCalls === before && matchesNative(previous), 'Over-capacity edit changed GPU data');
          steps.push({ label, refused: true, requestedFaces: target.size });
          continue;
        }
        const plan = prepare(target);
        if (label === 'mine-adjacent') {
          const before = writeCalls;
          try { transact(plan, 0, capacity); throw Error('Expected staging refusal'); }
          catch (error) { check(error.message === 'Edit staging capacity refused', error.message); }
          check(writeCalls === before && matchesNative(previous), 'Capacity refusal wrote to the GPU');
          const overwritten = plan.writes.findIndex(write => write.previous);
          check(overwritten >= 0, 'Missing mixed edit with an overwritten face');
          try { transact(plan, overwritten + 1); throw Error('Missing failure injection'); }
          catch (error) { check(error.message === 'Injected publication failure', error.message); }
          check(matchesNative(previous), 'Rollback failed after overwriting a live face');
        }
        steps.push({ label, ...transact(plan), liveFaces: target.size, ranges: draw(target.size) });
        check(matchesNative(target), 'Published GPU ranges differ from the full native remesh');
        previous = target;
      }

      const deeperTarget = new Map(deeper.flatMap(key => [...native.get(key)]));
      function streamWindow(target, failAfter = 0) {
        check(target.size <= capacity, 'Stream window capacity refused');
        // Retire departures before reusing their slots. Until all arrivals
        // are uploaded, only the surviving owners have published ranges.
        const retained = slots.map(entry => entry && target.has(entry.key) ? entry : null);
        slots = retained;
        const { next, writes } = prepare(target);
        check(writes.every(write => !write.previous), 'Stream upload would overwrite a retained face');
        const uploaded = uploadBatches(writes, failAfter);
        check(retained.every((entry, index) => !entry || entry === next[index]), 'Retained face moved');
        slots = next;
        check(matchesNative(target), 'Streamed GPU ranges differ from the full native mesh');
        return { residentFaces: target.size, keptFaces: target.size - writes.length,
          uploadedFaces: writes.length, ...uploaded, ranges: draw(target.size) };
      }
      const union = new Map([...initialTarget, ...deeperTarget]);
      const writesBeforeCapacity = writeCalls;
      try { streamWindow(union); throw Error('Expected stream capacity refusal'); }
      catch (error) { check(error.message === 'Stream window capacity refused', error.message); }
      check(writeCalls === writesBeforeCapacity && matchesNative(initialTarget), 'Over-capacity stream retired or wrote live faces');

      const kept = new Map([...initialTarget].filter(([key]) => deeperTarget.has(key)));
      try { streamWindow(deeperTarget, 2); throw Error('Expected arrival failure'); }
      catch (error) { check(error.message === 'Injected arrival upload failure', error.message); }
      check(writeCalls === writesBeforeCapacity + 2 && matchesNative(kept), 'Failed arrival exposed partial uploads or lost retained faces');
      const keptRangesAfterFailure = draw(kept.size);
      const descent = streamWindow(deeperTarget);

      async function recoverContext(target) {
        const extension = gl.getExtension('WEBGL_lose_context');
        check(extension, 'Context-loss extension required');
        function readFrame() {
          const pixels = new Uint8Array(canvas.width * canvas.height * 4);
          gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          checkGl();
          return pixels;
        }
        function expectEvent(type, request) {
          return new Promise((resolve, reject) => {
            const listener = event => {
              event.preventDefault();
              clearTimeout(timer);
              resolve();
            };
            const timer = setTimeout(() => {
              canvas.removeEventListener(type, listener);
              reject(Error(`Missing ${type} event`));
            }, 5000);
            canvas.addEventListener(type, listener, { once: true });
            request();
          });
        }
        check(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) === capacity * faceBytes, 'Allocation changed before context loss');
        const originalFrame = readFrame();
        check(originalFrame.some(value => value !== 0), 'Missing cave pixels before context loss');
        const previousGpu = gpu;
        await expectEvent('webglcontextlost', () => extension.loseContext());
        check(gl.isContextLost(), 'Context loss event did not invalidate the context');
        // Let the browser finish dispatching the cancelable loss event.
        await expectEvent('webglcontextrestored', () => setTimeout(() => extension.restoreContext(), 0));
        check(!gl.isBuffer(previousGpu.buffer), 'Old pool survived context loss');
        gpu = createGpuResources();
        const restored = uploadLiveSlots();
        check(matchesNative(target), 'Recovered GPU ranges differ from the published native mesh');
        const ranges = draw(target.size);
        check(readFrame().every((value, index) => value === originalFrame[index]), 'Recovered cave pixels changed');
        return { residentFaces: target.size, ...restored, ranges, oldBufferInvalidated: true, pixelParity: true };
      }
      const contextRecovery = await recoverContext(deeperTarget);
      const ascent = streamWindow(initialTarget);
      check(descent.uploadedFaces && ascent.uploadedFaces, 'Stream fixture must upload native arrivals in both directions');
      check(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) === capacity * faceBytes, 'GPU allocation changed');
      gl.deleteBuffer(gpu.buffer);
      gl.deleteProgram(gpu.program);
      checkGl();
      return { residentFaces: initial.length, allocatedFaces: capacity, stagingReserve, initialRanges,
        peakStagedFaces: Math.max(...steps.filter(step => !step.refused).map(step => step.stagedFaces)), wantedOwners: liveOwners.length, steps,
        streaming: { deeperOwners: deeper.length, descent, ascent,
          unionRefusedFaces: union.size, failedArrivalUploads: 2, keptRangesAfterFailure },
        contextRecovery, rollbackPreserved: true, stagedCapacityRefused: true, fullNativeFaceParity: true,
        buffersReallocatedDuringEditsOrStreaming: false };
    }, { fixture, deeper, faceBytes: floatsPerFace * Float32Array.BYTES_PER_ELEMENT, faceLimit,
      cases: edits.map(({ label, refusal }) => ({ label, refusal })) });
    return { ...result, chromium: browser.version(), edit: peakEdit.edit,
      scope: 'detached-shared-opaque-buffer-owner-ranges' };
  } finally {
    await browser.close();
  }
}
