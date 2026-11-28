import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { meshDepthSection } from '../../src/depth-mesh.mjs';

const floatsPerFace = 6 * 9;
const encode = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength).toString('base64');

// Detached shared allocation for one view of opaque native cube faces.
// Owner labels and draw ranges stay separate inside the single GPU buffer.
export async function qualifyEditTransaction({ projection, workingSet, owners, edits, faceLimit }) {
  const { peak, peakEdit } = workingSet;
  for (const field of ['cx', 'cz', 'active', 'shaft']) assert.equal(peak[field], peakEdit[field]);
  const fixture = peak.wanted.map(key => {
    const [cx, cz, section] = key.split(',').map(Number);
    const before = meshDepthSection(projection.view, cx, cz, section);
    assert.equal(owners.get(key).oldFaces, 0, 'The entire allocation counts against the face cap');
    assert.equal(before.length / floatsPerFace, owners.get(key).combinedFaces);
    const updates = edits.map(({ meshes }) => meshes.find(mesh => mesh.key === key)?.vertices ?? null);
    return { key, before: encode(before), updates: updates.map(vertices => vertices && encode(vertices)) };
  });

  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(({ fixture, faceBytes, faceLimit, cases }) => {
      const check = (ok, message) => { if (!ok) throw Error(message); };
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
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
      const native = fixture.map(({ key, before, updates }) => {
        const initial = decode(key, before);
        return { initial, targets: updates.map(update => update === null ? initial : decode(key, update)) };
      });
      const initial = native.flatMap(owner => [...owner.initial.values()]);
      // One binary opaque-cell edit changes at most six incident face
      // records. Reserve those staging records before allocating any slots.
      const stagingReserve = 6;
      const capacity = faceLimit - stagingReserve;
      check(initial.length <= capacity, 'Resident geometry exceeds shared allocation');
      let slots = [...initial, ...Array(capacity - initial.length).fill(null)];

      const buffer = gl.createBuffer();
      check(buffer, 'Buffer allocation failed');
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, capacity * faceBytes, gl.DYNAMIC_DRAW);
      const initialBytes = new Uint8Array(initial.length * faceBytes);
      initial.forEach(({ record }, index) => initialBytes.set(record, index * faceBytes));
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, initialBytes);
      checkGl();
      function shader(type, source) {
        const compiled = gl.createShader(type);
        gl.shaderSource(compiled, source);
        gl.compileShader(compiled);
        check(gl.getShaderParameter(compiled, gl.COMPILE_STATUS), gl.getShaderInfoLog(compiled));
        return compiled;
      }
      const vs = shader(gl.VERTEX_SHADER,
        '#version 300 es\nlayout(location=0) in vec3 p; void main(){gl_Position=vec4((p.x+632.0)/24.0,(p.z+2152.0)/24.0,(p.y+40.0)/50.0,1.0);}');
      const fs = shader(gl.FRAGMENT_SHADER,
        '#version 300 es\nprecision mediump float; out vec4 color; void main(){color=vec4(0.6,0.5,0.4,1.0);}');
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      check(gl.getProgramParameter(program, gl.LINK_STATUS), gl.getProgramInfoLog(program));
      gl.useProgram(program);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 0);
      let writeCalls = 0;
      function upload(index, entry) {
        check(index < capacity, 'Write outside shared allocation');
        gl.bufferSubData(gl.ARRAY_BUFFER, index * faceBytes, entry.record);
        checkGl();
        writeCalls++;
      }
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
        const target = new Map(native.flatMap(owner => [...owner.targets[step]]));
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
      check(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) === capacity * faceBytes, 'GPU allocation changed');
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      checkGl();
      return { residentFaces: initial.length, allocatedFaces: capacity, stagingReserve, initialRanges,
        peakStagedFaces: Math.max(...steps.filter(step => !step.refused).map(step => step.stagedFaces)), wantedOwners: native.length, steps,
        rollbackPreserved: true, stagedCapacityRefused: true, fullNativeFaceParity: true, buffersReallocated: false };
    }, { fixture, faceBytes: floatsPerFace * Float32Array.BYTES_PER_ELEMENT, faceLimit,
      cases: edits.map(({ label, refusal }) => ({ label, refusal })) });
    return { ...result, chromium: browser.version(), edit: peakEdit.edit,
      scope: 'detached-shared-opaque-buffer-owner-ranges' };
  } finally {
    await browser.close();
  }
}
