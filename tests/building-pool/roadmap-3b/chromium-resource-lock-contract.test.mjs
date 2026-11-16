import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const modules=[
 'chromium-diagnostic.test.mjs',
 'm2-chromium.test.mjs',
 'm2-regional-chromium.test.mjs',
 'm2-frontier-chromium.test.mjs',
 'm2-hinterland-chromium.test.mjs',
 'm2-missing-sizes-chromium.test.mjs',
 'm2-variant2-chromium.test.mjs',
 'm2-variant2-expansion-chromium.test.mjs',
 'm2-variant2-completion-chromium.test.mjs'
];

test('all nine independent Builder 3B real-Chromium capture suites obtain and release the exclusive runner permit',()=>{
 for(const filename of modules){
  const s=readFileSync(new URL('./'+filename,import.meta.url),'utf8');
  assert.ok(s.includes("import {acquire3BChromiumPermit} from './chromium-resource-lock.mjs';"),filename+' lacks mutex');
  assert.ok(s.includes('const releaseChromium=await acquire3BChromiumPermit();'),filename+' launches Chrome without permit');
  assert.ok(s.includes('}finally{await releaseChromium();}'),filename+' may strand the permit after Chrome errors');
  assert.ok(s.includes("await cdp.send('Page.navigate'"),filename+' does not do actual source-browser work');
  assert.ok(s.includes('gl.readPixels('),filename+' does not verify real WebGL readback');
  assert.ok(s.includes("Page.captureScreenshot"),filename+' does not capture real Chrome screenshots');
 }
});
test('Chromium permit is atomic across Node test-file processes and fails closed if the resource remains busy',()=>{
 const s=readFileSync(new URL('./chromium-resource-lock.mjs',import.meta.url),'utf8');
 assert.ok(s.includes('await mkdir(lockPath)'), 'must create exclusive directory atomically');
 assert.ok(s.includes("e?.code!=='EEXIST'"), 'must not swallow unexpected file system failures');
 assert.ok(s.includes('Date.now()-began>timeoutMs'), 'must reject endless waits');
 assert.ok(s.includes('await rm(lockPath,{recursive:true,force:true})'),'must release only after Chrome teardown');
});
