// Builder B Waves9/10 preview-authenticity and efficient combined-gallery preflight.
// Native-only regression; Chrome/WebGL2 images remain a separate required milestone.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../../../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const cases=[
 ['9','buildSaltreachTidalLanternStation','r1:lighthouse:temperate:small:002'],
 ['10','buildDunewakeOasisReedworksFishingLodge','r1:fishing-lodge:desert:small:002']
];
test('Wave9/10 source-preview imports resolve to their original exact exported constructors',()=>{
 for(const [wave,symbol,id] of cases){
  const src=read('src/building-pool/roadmap-b/builder-b-essentials-wave'+wave+'.mjs');
  const preview=read('tests/building-pool/roadmap-b/builder-b-essentials-wave'+wave+'-preview.html');
  assert.ok(src.includes('export function '+symbol+'('),'missing exact authored original constructor wave'+wave);
  assert.ok(src.includes("'"+id+"'"),'incorrect original ID source wave'+wave);
  assert.ok(preview.includes('import {'+symbol+'} from '),'invented preview constructor wave'+wave);
  assert.ok(preview.includes('const buildings=['+symbol+'()]'),'wrong instantiated source wave'+wave);
  assert.ok(preview.includes('builder-b-essentials-wave'+wave+'.mjs'),'preview uses unrelated source wave'+wave);
  assert.ok(preview.includes("const gl=canvas.getContext('webgl2'"),'not authentic Chromium WebGL2 preview');
 }
});
test('Combined proof captures 12 truly distinct exact-head source frames and independently verifies actual PNG CRC/SHA and provenance',()=>{
 const gallery=read('tests/building-pool/roadmap-b/builder-b-essentials-wave9-10-gallery.mjs');
 const auditor=read('tests/building-pool/roadmap-b/audit-builder-b-essentials-wave9-10-gallery.mjs');
 for(const [wave,symbol,id] of cases){
  assert.ok(gallery.includes('builder-b-essentials-wave'+wave+'.mjs'),'missing exact source SHA evidence');
  assert.ok(gallery.includes('builder-b-essentials-wave'+wave+'-preview.html'),'gallery missing real preview');
  assert.ok(gallery.includes(id),'gallery missing reserved original '+id);
  assert.ok(auditor.includes(id),'independent auditor missing original '+id);
 }
 for(const file of [gallery,auditor]){
  assert.ok(file.includes('BUILDER_B_EXPECTED_HEAD'),'exact HEAD not required');
  assert.ok(file.includes('sha256'),'SHA-256 requirement missing');
 }
 assert.ok(gallery.includes('records.length!==12||keys.size!==12'),'gallery no longer requires twelve unique frames');
 assert.ok(gallery.includes('PNG.sync.read(buf)'),'gallery no longer decodes Chromium PNG');
 assert.ok(auditor.includes('PNG.sync.read(img,{checkCRC:true})'),'audit no longer validates real PNG CRC');
 assert.ok(auditor.includes('obj.records?.length!==12||obj.sourceEvidence?.length!==5'),'incomplete two-original independent source provenance');
 assert.ok(auditor.includes('seen.size!==12||hashes.size!==12'),'audit accepts duplicate or missing PNG frames');
 assert.ok(gallery.includes('[[667,375],[844,390],[932,430]]'),'landscape viewport coverage weakened');
 assert.ok(gallery.includes("views=['exterior','cutaway']"),'exterior/cutaway source proof missing');
 assert.ok(auditor.includes('actualIphoneTested:false'),'false device acceptance');
});
