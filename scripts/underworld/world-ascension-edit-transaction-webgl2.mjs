import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { meshDepthSection } from '../../src/depth-mesh.mjs';

const floatsPerFace = 6 * 9;
const encode = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength).toString('base64');

// Fixed-capacity, per-owner buffers for one exact edit sequence. All reference
// meshes are produced by the native mesher before the browser runs.
export async function qualifyEditTransaction({ projection, workingSet, owners, edits, faceLimit }) {
  const { peak, peakEdit } = workingSet;
  for (const field of ['cx', 'cz', 'active', 'shaft']) assert.equal(peak[field], peakEdit[field]);
  const fixture = peak.wanted.map(key => {
    const [cx, cz, section] = key.split(',').map(Number);
    const before = meshDepthSection(projection.view, cx, cz, section);
    assert.equal(owners.get(key).oldFaces, 0, 'The entire allocation counts against the face cap');
    assert.equal(before.length / floatsPerFace, owners.get(key).combinedFaces);
    const updates = edits.map(({ meshes }) => meshes.find(mesh => mesh.key === key)?.vertices ?? before);
    const capacity = Math.max(before.length, ...updates.map(vertices => vertices.length)) / floatsPerFace;
    return { key, before: encode(before), updates: updates.map(vertices => vertices === before ? null : encode(vertices)), capacity };
  });

  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(({ fixture, faceBytes, faceLimit, labels }) => {
      const check = (ok, message) => { if (!ok) throw Error(message); };
      const gl = document.createElement('canvas').getContext('webgl2');
      check(gl, 'WebGL2 context required');
      const bind = owner => gl.bindBuffer(gl.ARRAY_BUFFER, owner.handle);
      const checkGl = () => check(gl.getError() === gl.NO_ERROR && !gl.isContextLost(), 'WebGL2 buffer operation failed');
      function decode(encoded) {
        const bytes = Uint8Array.from(atob(encoded), value => value.charCodeAt(0));
        check(bytes.length % faceBytes === 0, 'Incomplete native face record');
        const faces = new Map();
        for (let offset = 0; offset < bytes.length; offset += faceBytes) {
          const record = bytes.subarray(offset, offset + faceBytes);
          const key = String.fromCharCode(...record);
          check(!faces.has(key), 'Expected unique opaque native faces');
          faces.set(key, record);
        }
        return faces;
      }
      const owners = fixture.map(({ key, before, updates, capacity }) => {
        const initial = decode(before);
        const targets = updates.map(update => update === null ? initial : decode(update));
        return { key, initial, targets, capacity, slots: [...initial.keys()] };
      });
      const residentFaces = owners.reduce((total, owner) => total + owner.slots.length, 0);
      const allocatedFaces = owners.reduce((total, owner) => total + owner.capacity, 0);
      check(allocatedFaces <= faceLimit, 'Fixed owner allocations exceed the face cap');
      const live = owners.filter(owner => owner.capacity);
      let writeCalls = 0;
      function upload(owner, slot, record) {
        check(slot < owner.capacity, 'Write outside owner allocation');
        bind(owner);
        gl.bufferSubData(gl.ARRAY_BUFFER, slot * faceBytes, record);
        checkGl();
        writeCalls++;
      }
      for (const owner of live) {
        owner.handle = gl.createBuffer();
        check(owner.handle, 'Buffer allocation failed');
        bind(owner);
        gl.bufferData(gl.ARRAY_BUFFER, owner.capacity * faceBytes, gl.DYNAMIC_DRAW);
        const bytes = new Uint8Array(owner.slots.length * faceBytes);
        for (const [index, key] of owner.slots.entries()) bytes.set(owner.initial.get(key), index * faceBytes);
        if (bytes.length) gl.bufferSubData(gl.ARRAY_BUFFER, 0, bytes);
        checkGl();
        owner.published = owner.initial;
      }
      // Keep unchanged faces in their slots where possible. Fill holes with
      // moved or new faces and journal overwritten live slots for rollback.
      function prepare(owner, target) {
        check(target.size <= owner.capacity, 'Owner capacity refused');
        const pending = new Map(target);
        const slots = Array.from({ length: target.size }, (_, i) => {
          const face = owner.slots[i];
          return pending.delete(face) ? face : null;
        });
        const holes = pending.keys();
        const writes = [];
        for (let i = 0; i < slots.length; i++) {
          if (slots[i] !== null) continue;
          const key = holes.next().value;
          slots[i] = key;
          writes.push({ owner, index: i, next: target.get(key), previous: owner.published.get(owner.slots[i]) });
        }
        return { owner, target, slots, writes };
      }
      function transact(step, failAfter = 0, limit = faceLimit) {
        // Check every owner and both allocations before touching any buffer.
        const plans = live.map(owner => prepare(owner, owner.targets[step]));
        const writes = plans.flatMap(plan => plan.writes);
        const rollbackFaces = writes.filter(write => write.previous).length;
        check(allocatedFaces + rollbackFaces <= limit, 'Edit staging capacity refused');
        const attempted = [];
        try {
          for (const write of writes) {
            attempted.push(write);
            upload(write.owner, write.index, write.next);
            if (attempted.length === failAfter) throw Error('Injected publication failure');
          }
        } catch (error) {
          for (const write of attempted.reverse()) {
            if (write.previous) upload(write.owner, write.index, write.previous);
          }
          throw error;
        }
        for (const { owner, target, slots } of plans) {
          owner.published = target;
          owner.slots = slots;
        }
        return { uploads: writes.length, rollbackFaces, allocatedWithRollback: allocatedFaces + rollbackFaces };
      }
      function matchesNative(step) {
        return live.every(owner => {
          const target = step < 0 ? owner.initial : owner.targets[step];
          if (target.size !== owner.slots.length) return false;
          const bytes = new Uint8Array(target.size * faceBytes);
          if (bytes.length) {
            bind(owner);
            gl.getBufferSubData(gl.ARRAY_BUFFER, 0, bytes);
            checkGl();
          }
          return owner.slots.every((key, i) => {
            const expected = target.get(key);
            return expected && expected.every((value, j) => value === bytes[i * faceBytes + j]);
          });
        }) && owners.every(owner => owner.capacity || (step < 0 ? owner.initial : owner.targets[step]).size === 0);
      }
      check(matchesNative(-1), 'Initial GPU buffer bytes differ from native');
      const steps = [];
      for (const [step, label] of labels.entries()) {
        if (label === 'mine-adjacent') {
          const before = writeCalls;
          try { transact(step, 0, allocatedFaces); throw Error('Expected capacity refusal'); }
          catch (error) { check(error.message === 'Edit staging capacity refused', error.message); }
          check(writeCalls === before && matchesNative(step - 1), 'Capacity refusal wrote to the GPU');
          const writes = live.flatMap(owner => prepare(owner, owner.targets[step]).writes);
          const overwrite = writes.findIndex(write => write.previous);
          check(overwrite >= 0, 'Missing mixed edit with an overwritten live face');
          try { transact(step, overwrite + 1); throw Error('Missing failure injection'); }
          catch (error) { check(error.message === 'Injected publication failure', error.message); }
          check(matchesNative(step - 1), 'Rollback failed after overwriting a live face');
        }
        steps.push({ label, ...transact(step) });
        check(matchesNative(step), 'Published face records differ from the full native remesh');
      }
      for (const owner of live) {
        bind(owner);
        check(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) === owner.capacity * faceBytes, 'GPU capacity changed');
        gl.deleteBuffer(owner.handle);
      }
      checkGl();
      return { residentFaces, allocatedFaces, peakWithRollback: Math.max(...steps.map(step => step.allocatedWithRollback)),
        wantedOwners: owners.length, bufferHandles: live.length, steps,
        rollbackPreserved: true, stagedCapacityRefused: true, fullNativeFaceParity: true, buffersReallocated: false };
    }, { fixture, faceBytes: floatsPerFace * Float32Array.BYTES_PER_ELEMENT, faceLimit, labels: edits.map(edit => edit.label) });
    return { ...result, chromium: browser.version(), edit: peakEdit.edit,
      scope: 'detached-fixed-owner-capacity-edit-sequence' };
  } finally {
    await browser.close();
  }
}
