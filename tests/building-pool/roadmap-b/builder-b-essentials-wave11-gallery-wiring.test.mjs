// Builder B Wave11 lightweight native preflight for authentic preview and WebGL2.
// This does NOT substitute real Chromium frame capture, independent image audit,
// exact source-head CI, physical Pack integration or creator art approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../../'+path,import.meta.url),'utf8');
test('Mossveil source preview imports exact original constructor, not a copied lighthouse or greenhouse',()=>{
 const source=read('src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs');
 const page=read('tests/building-pool/roadmap-b/builder-b-essentials-wave11-preview.html');
 const expected='buildMossveilTwinCourtSporeGranary';
 assert.ok(source.includes('export function '+expected+'('),'original source not exported');
 assert.ok(source.includes("'r1:farm-barn:enchanted-forest:small:002'"),'actual reserved source ID missing');
 assert.ok(page.includes('import {'+expected+'} from '),'preview imports a nonexistent source');
 assert.ok(page.includes('const buildings=['+expected+'()]'),'preview calls unrelated builder');
 assert.ok(page.includes('builder-b-essentials-wave11.mjs'),'preview points at another wave');
 assert.ok(page.includes("canvas.getContext('webgl2'"),'no genuine WebGL2 preview context');
 assert.ok(!page.includes('Frostwake')&&!page.includes('Rimeglass'),'copied unrelated preview contents');
});
test('Mossveil six source frame gallery and independent audit pin real exact head, CRC and unique SHA',()=>{
 const gallery=read('tests/building-pool/roadmap-b/builder-b-essentials-wave11-gallery.mjs');
 const audit=read('tests/building-pool/roadmap-b/audit-builder-b-essentials-wave11-gallery.mjs');
 for(const s of [gallery,audit]){
  assert.ok(s.includes("BUILDER_B_EXPECTED_HEAD"),'no exact-source SHA enforcement');
  assert.ok(s.includes('r1:farm-barn:enchanted-forest:small:002'),'wrong source candidate');
  assert.ok(s.includes('sha256'),'cryptographic frame provenance missing');
  assert.ok(s.includes('builder-b-essentials-wave11-mossveil-webgl2'),'wrong output artifact');
 }
 assert.ok(gallery.includes('builder-b-essentials-wave11-preview.html?id='),
  'gallery does not render actual original preview');
 assert.ok(gallery.includes("'src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs'"),
  'new original file not included in image source provenance');
 assert.ok(gallery.includes("PNG.sync.read(buf)"),'image generator does not decode actual PNG');
 assert.ok(audit.includes('PNG.sync.read(img,{checkCRC:true})'),
  'independent PNG chunk integrity not checked');
 assert.ok(gallery.includes('records.length!==6||keys.size!==6'),
  'gallery no longer requires all six distinct screenshot SHA values');
 assert.ok(audit.includes('seen.size!==6||hashes.size!==6'),
  'audit accepts missing or duplicate PNGs');
 assert.ok(gallery.includes('[[667,375],[844,390],[932,430]]'),
  'genuine 3-size iPhone landscape proxies omitted');
 assert.ok(gallery.includes("views=['exterior','cutaway']"),
  'external and interior source views no longer paired');
 assert.ok(audit.includes('actualIphoneTested:false')&&audit.includes('creatorArtAccepted:false'),
  'independent source report claims unearned device or artwork acceptance');
});
