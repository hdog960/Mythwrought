import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { meshDepthSection } from '../../src/depth-mesh.mjs';

const floatsPerFace = 6 * 9;
const encode = vertices => Buffer.from(vertices.buffer, vertices.byteOffset, vertices.byteLength).toString('base64');

// The optional fixture covers a single mining edit whose native mesh changes
// consist entirely of new faces. Run it outside the live renderer.
export async function qualifyEditAppend({ projection, workingSet, owners, editedBatch, faceLimit }) {
  const { peak, peakEdit } = workingSet;
  for (const field of ['cx', 'cz', 'active', 'shaft']) assert.equal(peak[field], peakEdit[field]);
  const fixture = peak.wanted.map(key => {
    const [cx, cz, section] = key.split(',').map(Number);
    const before = meshDepthSection(projection.view, cx, cz, section);
    assert.equal(owners.get(key).oldFaces, 0, 'This fixture counts the whole allocation against the face cap');
    assert.equal(before.length / floatsPerFace, owners.get(key).combinedFaces);
    const after = editedBatch.meshes.find(mesh => mesh.key === key)?.vertices ?? before;
    const oldFaces = new Set();
    for (let i = 0; i < before.length; i += floatsPerFace) {
      oldFaces.add(encode(before.subarray(i, i + floatsPerFace)));
    }
    assert.equal(oldFaces.size, before.length / floatsPerFace, 'Expected unique opaque cube faces');
    const append = [];
    for (let i = 0; i < after.length; i += floatsPerFace) {
      const face = after.subarray(i, i + floatsPerFace);
      if (!oldFaces.delete(encode(face))) append.push(...face);
    }
    assert.equal(oldFaces.size, 0, 'This fixture cannot stage removed or modified faces');
    return { before: encode(before), after: encode(after), append: encode(Float32Array.from(append)) };
  });

  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(({ fixture, faceBytes, faceLimit }) => {
      const check = (ok, message) => { if (!ok) throw Error(message); };
      const gl = document.createElement('canvas').getContext('webgl2');
      check(gl, 'WebGL2 context required');
      const decode = text => Uint8Array.from(atob(text), character => character.charCodeAt(0));
      const equal = (a, b) => a.length === b.length && a.every((value, i) => value === b[i]);
      const bind = owner => gl.bindBuffer(gl.ARRAY_BUFFER, owner.handle);
      const checkGl = () => check(gl.getError() === gl.NO_ERROR && !gl.isContextLost(), 'WebGL2 buffer operation failed');
      const records = bytes => {
        const faces = [];
        check(bytes.length % faceBytes === 0, 'Partial face record');
        for (let i = 0; i < bytes.length; i += faceBytes) {
          faces.push(String.fromCharCode(...bytes.subarray(i, i + faceBytes)));
        }
        return faces.sort();
      };
      const owners = fixture.map(({ before, after, append }) => {
        const old = decode(before), added = decode(append);
        return { old, after: decode(after), added, capacity: old.length + added.length, visible: old.length };
      });
      const residentFaces = owners.reduce((total, owner) => total + owner.visible, 0) / faceBytes;
      const allocatedFaces = owners.reduce((total, owner) => total + owner.capacity, 0) / faceBytes;
      check(allocatedFaces <= faceLimit, 'Resident buffers and reserved slots exceed the face cap');
      const live = owners.filter(owner => owner.capacity);
      for (const owner of live) {
        owner.handle = gl.createBuffer();
        check(owner.handle, 'Buffer allocation failed');
        bind(owner);
        gl.bufferData(gl.ARRAY_BUFFER, owner.capacity, gl.DYNAMIC_DRAW);
        if (owner.visible) gl.bufferSubData(gl.ARRAY_BUFFER, 0, owner.old);
        checkGl();
      }
      const dirty = live.filter(owner => owner.added.length);
      const readVisible = owner => {
        const bytes = new Uint8Array(owner.visible);
        if (bytes.length) {
          bind(owner);
          gl.getBufferSubData(gl.ARRAY_BUFFER, 0, bytes);
          checkGl();
        }
        return bytes;
      };
      const stage = failAfter => {
        for (const [i, owner] of dirty.entries()) {
          bind(owner);
          gl.bufferSubData(gl.ARRAY_BUFFER, owner.visible, owner.added);
          checkGl();
          if (i + 1 === failAfter) throw Error('Injected publication failure');
        }
        for (const owner of dirty) owner.visible += owner.added.length;
      };
      try { stage(2); throw Error('Missing failure injection'); }
      catch (error) { check(error.message === 'Injected publication failure', error.message); }
      check(owners.every(owner => equal(readVisible(owner), owner.old)), 'The failed transaction changed visible geometry');
      stage(-1);
      check(owners.every(owner => equal(records(readVisible(owner)), records(owner.after))), 'GPU face records differ from a full native remesh');
      for (const owner of live) {
        bind(owner);
        check(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) === owner.capacity, 'Buffer allocation changed during the edit');
        gl.deleteBuffer(owner.handle);
      }
      checkGl();
      return { residentFaces, allocatedFaces, wantedOwners: owners.length, bufferHandles: live.length,
        dirtyOwners: dirty.length, appendedFaces: allocatedFaces - residentFaces,
        rollbackPreserved: true, fullNativeFaceParity: true, buffersReallocated: false };
    }, { fixture, faceBytes: floatsPerFace * Float32Array.BYTES_PER_ELEMENT, faceLimit });
    return { ...result, chromium: browser.version(), edit: peakEdit.edit, scope: 'isolated-append-only-fixture' };
  } finally {
    await browser.close();
  }
}
