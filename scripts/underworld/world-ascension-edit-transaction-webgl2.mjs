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
      function uploadBatches(writes, offset = 0, limit = Infinity, failAfter = 0) {
        const scratch = new Uint8Array(stagingReserve * faceBytes);
        const startOffset = offset;
        let uploads = 0, maxUploadFaces = 0;
        while (offset < writes.length && uploads < limit) {
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
        return { uploads, maxUploadFaces, uploadedFaces: offset - startOffset };
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
      const uploadCallsPerFrame = 16;
      let arrival = null;
      function beginArrival(target) {
        check(target.size <= capacity, 'Stream window capacity refused');
        // Retain an owner only when every requested face is already published.
        const live = new Set(slots.filter(Boolean).map(entry => entry.key));
        const moving = new Set([...target.values()].filter(entry => !live.has(entry.key)).map(entry => entry.owner));
        const retained = slots.map(entry => entry && target.has(entry.key) && !moving.has(entry.owner) ? entry : null);
        slots = retained;
        const { next, writes } = prepare(target);
        check(writes.every(write => !write.previous), 'Stream upload would overwrite a retained face');
        check(retained.every((entry, index) => !entry || entry === next[index]), 'Retained face would move');
        const owners = new Map();
        for (const write of writes) {
          const owner = write.entry.owner;
          if (!owners.has(owner)) owners.set(owner, { indices: [], uploaded: 0 });
          owners.get(owner).indices.push(write.index);
        }
        arrival = { target, next, writes, owners, offset: 0, publishedFaces: 0, publishedOwners: 0,
          keptFaces: target.size - writes.length };
        return arrival;
      }
      function arrivalFrame(plan, failAfter = 0) {
        if (arrival !== plan) return null;
        const before = writeCalls;
        let uploaded;
        try {
          uploaded = uploadBatches(plan.writes, plan.offset, uploadCallsPerFrame, failAfter);
        } catch (error) {
          arrival = null;
          throw error;
        }
        check(writeCalls - before === uploaded.uploads && uploaded.uploads <= uploadCallsPerFrame, 'Frame upload budget exceeded');
        // Commit whole owners after all uploads in this frame have succeeded.
        const end = plan.offset + uploaded.uploadedFaces;
        for (const { entry } of plan.writes.slice(plan.offset, end)) {
          const owner = plan.owners.get(entry.owner);
          owner.uploaded++;
          if (owner.uploaded !== owner.indices.length) continue;
          for (const index of owner.indices) slots[index] = plan.next[index];
          plan.publishedFaces += owner.uploaded;
          plan.publishedOwners++;
        }
        plan.offset += uploaded.uploadedFaces;
        if (plan.offset === plan.writes.length) arrival = null;
        return uploaded;
      }
      const nextFrame = () => new Promise(requestAnimationFrame);
      function drawPublished(plan) {
        const visibleOwners = new Set(slots.filter(Boolean).map(entry => entry.owner));
        const expected = new Map([...plan.target].filter(([, entry]) => visibleOwners.has(entry.owner)));
        check(expected.size === plan.keptFaces + plan.publishedFaces, 'Published owner count disagrees with arrived faces');
        check(matchesNative(expected), 'Published owner differs from its complete native mesh');
        return draw(expected.size);
      }
      async function finishArrival(plan) {
        let frames = 0, uploads = 0, maxUploadFaces = 0, maxCallsInFrame = 0, maxFacesInFrame = 0;
        let firstOwnerFrame = null, intermediateOwnerFrames = 0, ranges = 0;
        while (arrival === plan) {
          await nextFrame();
          const frame = arrivalFrame(plan);
          check(frame, 'Scheduled arrival was superseded');
          frames++;
          uploads += frame.uploads;
          maxUploadFaces = Math.max(maxUploadFaces, frame.maxUploadFaces);
          maxCallsInFrame = Math.max(maxCallsInFrame, frame.uploads);
          maxFacesInFrame = Math.max(maxFacesInFrame, frame.uploadedFaces);
          ranges = drawPublished(plan);
          if (plan.publishedOwners) {
            firstOwnerFrame ??= frames;
            if (arrival === plan) intermediateOwnerFrames++;
          }
        }
        check(matchesNative(plan.target), 'Streamed GPU ranges differ from the full native mesh');
        return { residentFaces: plan.target.size, keptFaces: plan.keptFaces, uploadedFaces: plan.offset,
          frames, uploads, maxUploadFaces, maxCallsInFrame, maxFacesInFrame, ranges, firstOwnerFrame,
          intermediateOwnerFrames, publishedOwners: plan.publishedOwners };
      }
      const union = new Map([...initialTarget, ...deeperTarget]);
      const writesBeforeCapacity = writeCalls;
      try { beginArrival(union); throw Error('Expected stream capacity refusal'); }
      catch (error) { check(error.message === 'Stream window capacity refused', error.message); }
      check(writeCalls === writesBeforeCapacity && matchesNative(initialTarget), 'Over-capacity stream retired or wrote live faces');

      const kept = new Map([...initialTarget].filter(([key]) => deeperTarget.has(key)));
      const interrupted = beginArrival(deeperTarget);
      try { arrivalFrame(interrupted, 2); throw Error('Expected arrival failure'); }
      catch (error) { check(error.message === 'Injected arrival upload failure', error.message); }
      check(writeCalls === writesBeforeCapacity + 2 && matchesNative(kept), 'Failed arrival exposed partial uploads or lost retained faces');
      const keptRangesAfterFailure = draw(kept.size);

      const abandoned = beginArrival(deeperTarget);
      let framesBeforeReversal = 0;
      while (arrival === abandoned && (!abandoned.publishedOwners || abandoned.offset === abandoned.publishedFaces)) {
        await nextFrame();
        check(arrivalFrame(abandoned).uploads === uploadCallsPerFrame, 'Expected full upload frames before reversing');
        framesBeforeReversal++;
        drawPublished(abandoned);
      }
      check(arrival === abandoned && abandoned.publishedOwners && abandoned.offset > abandoned.publishedFaces,
        'Expected completed owners and an incomplete owner at reversal');
      const pendingFrame = nextFrame().then(() => arrivalFrame(abandoned));
      const reversing = beginArrival(initialTarget);
      const writesBeforeStale = writeCalls;
      check(await pendingFrame === null && writeCalls === writesBeforeStale, 'Superseded arrival submitted GPU writes');
      check(matchesNative(kept), 'Retargeting changed live geometry before publication');
      const reversal = { framesBeforeReversal, retiredPublishedFaces: abandoned.publishedFaces,
        canceledFaces: abandoned.offset - abandoned.publishedFaces, staleFrameRefused: true,
        returned: await finishArrival(reversing) };
      const descent = await finishArrival(beginArrival(deeperTarget));

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
        slots.fill(null);
        const restored = await finishArrival(beginArrival(target));
        check(restored.intermediateOwnerFrames > 0, 'Context recovery must draw owners before the whole window settles');
        check(matchesNative(target), 'Recovered GPU ranges differ from the published native mesh');
        const ranges = draw(target.size);
        check(readFrame().every((value, index) => value === originalFrame[index]), 'Recovered cave pixels changed');
        return { residentFaces: target.size, ...restored, ranges, oldBufferInvalidated: true, pixelParity: true };
      }
      const contextRecovery = await recoverContext(deeperTarget);
      const ascent = await finishArrival(beginArrival(initialTarget));
      check(descent.uploadedFaces && ascent.uploadedFaces, 'Stream fixture must upload native arrivals in both directions');
      check(descent.intermediateOwnerFrames > 0 && ascent.intermediateOwnerFrames > 0, 'Both directions must draw arriving owners before settling');

      const retryable = beginArrival(deeperTarget);
      for (let frame = 0; frame < framesBeforeReversal; frame++) {
        await nextFrame();
        arrivalFrame(retryable);
        drawPublished(retryable);
      }
      const beforeFailure = writeCalls;
      await nextFrame();
      try { arrivalFrame(retryable, 2); throw Error('Expected arrival retry failure'); }
      catch (error) { check(error.message === 'Injected arrival upload failure', error.message); }
      check(arrival === null && writeCalls === beforeFailure + 2, 'Late failure must stop the active arrival');
      drawPublished(retryable);
      const retry = await finishArrival(beginArrival(deeperTarget));
      check(retry.keptFaces === retryable.keptFaces + retryable.publishedFaces, 'Retry must retain fully published owners');

      check(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) === capacity * faceBytes, 'GPU allocation changed');
      gl.deleteBuffer(gpu.buffer);
      gl.deleteProgram(gpu.program);
      checkGl();
      return { residentFaces: initial.length, allocatedFaces: capacity, stagingReserve, initialRanges,
        peakStagedFaces: Math.max(...steps.filter(step => !step.refused).map(step => step.stagedFaces)), wantedOwners: liveOwners.length, steps,
        streaming: { deeperOwners: deeper.length, uploadCallsPerFrame, descent, ascent, reversal, retry,
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
