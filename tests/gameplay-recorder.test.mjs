import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CAPTURE_MS,MAX_CAPTURE_BYTES,CAPTURE_FPS,MIME_PREFERENCES,
  recordingMime,recordingFilename
} from '../src/gameplay-recorder.mjs';
test('10-second maximum and bounded recording memory',()=>{
  assert.equal(MAX_CAPTURE_MS,10000);
  assert.equal(MAX_CAPTURE_BYTES,24*1024*1024);
  assert.equal(CAPTURE_FPS,24);
});
test('canvas recording does not request audio codec',()=>{
  assert.ok(MIME_PREFERENCES.every(t=>t.startsWith('video/')));
  assert.ok(MIME_PREFERENCES[0].startsWith('video/mp4'));
});
test('unavailable MediaRecorder returns explicit unsupported state',()=>{
  assert.equal(recordingMime(undefined),null);
  assert.equal(recordingMime(null),null);
});
test('prefers MP4 H264 when the actual encoder supports it',()=>{
  class Supported {}
  Supported.isTypeSupported=t=>t==='video/mp4;codecs=avc1.42E01E'||t==='video/webm';
  assert.equal(recordingMime(Supported),'video/mp4;codecs=avc1.42E01E');
});
test('uses WebM if MP4 is not available',()=>{
  class WebM {}
  WebM.isTypeSupported=t=>t==='video/webm;codecs=vp8';
  assert.equal(recordingMime(WebM),'video/webm;codecs=vp8');
});
test('uses default recorder settings if MIME support cannot be queried',()=>{
  class OldRecorder {}
  assert.equal(recordingMime(OldRecorder),'');
});
test('a throwing isTypeSupported does not prevent safe fallback',()=>{
  class Broken {}
  Broken.isTypeSupported=()=>{throw Error('unavailable');};
  assert.equal(recordingMime(Broken),'');
});
test('video filename is timestamped and extension matches encoding',()=>{
  const stamp=new Date('2026-11-18T23:30:00.000Z');
  assert.equal(recordingFilename(stamp,'video/mp4'),'mythwrought-2026-11-18T23-30-00-000Z.mp4');
  assert.equal(recordingFilename(stamp,'video/webm'),'mythwrought-2026-11-18T23-30-00-000Z.webm');
});
