// Builder B source-only preflight: the independent screenshot auditors must never demand
// five IDs or thirty frames from single-original six-frame capture tests.
// This is a consistency regression, NOT a substitute for real Chromium, PNG CRC or ZIP audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
const read=n=>readFileSync(join(here,n),'utf8');
for(const [family,auditName,captureName,sourceName] of [
 ['Granitebell','audit-builder-b-homes-wave4.mjs','builder-b-homes-wave4-webgl2.test.mjs','builder-b-homes-wave4.mjs'],
 ['Foxglade','audit-builder-b-hospitality-wave5.mjs','builder-b-hospitality-wave5-webgl2.test.mjs','builder-b-hospitality-wave5.mjs'],
 ['Willowmere','audit-builder-b-homes-wave6.mjs','builder-b-homes-wave6-webgl2.test.mjs','builder-b-homes-wave6.mjs'],
 ['Highglen','audit-builder-b-homes-wave7.mjs','builder-b-homes-wave7-webgl2.test.mjs','builder-b-homes-wave7.mjs']
]){
 test(family+' exact one-source/six-per-renderer screenshot audit and capture counts agree',()=>{
  const audit=read(auditName),capture=read(captureName);
  const parent=read('../../..'+'/src/building-pool/roadmap-1a/'+sourceName);
  assert.ok(parent.includes('export function getBuilderB'),'Original authored source export absent');
  assert.ok(audit.includes('ids.length!==1||new Set(ids).size!==1'),'Auditor wrongly demands multiple source IDs');
  assert.ok(audit.includes('records?.length!==6||new Set(records.map(x=>x.filename)).size!==6'),
   'Auditor has logically impossible per-renderer record count');
  assert.ok(audit.includes('seen.size!==6'),'Auditor missing unique source/viewport records');
  assert.ok(audit.includes('realChromiumWebGL2Frames:12'),'Auditor expects wrong full two-mode count');
  assert.ok(audit.includes('PNG.sync.read(buf,{checkCRC:true})'),'Auditor missing real PNG CRC decoder');
  assert.ok(audit.includes('sha(buf)'),'Auditor missing actual source PNG hash');
  assert.ok(audit.includes('sourceHead!==expectedHead'),'Auditor missing exact head proof');
  assert.ok(capture.includes('assert.equal(wanted.length,1)'),'Real source gallery isn't single-original');
  assert.ok(capture.includes('assert.equal(captures.length,6)'),'Chromium cube gallery does not assert 6 images');
  assert.ok(capture.includes('assert.equal(physicalWanted.length,1)'),'Physical Pack AABB gallery source count incorrect');
 });
}
