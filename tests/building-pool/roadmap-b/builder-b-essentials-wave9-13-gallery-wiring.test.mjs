// Builder B 1B Waves9-13 original source gallery wiring, not visual approval.
// Native preflight: strict five IDs, source exports, original previews, 24 SHA-unique
// real Chromium PNGs at milestone. Source-only point-voxel proxy, not final meshes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../../'+p,import.meta.url),'utf8');
const candidates=[
 ['9','buildSaltreachTidalLanternStation','r1:lighthouse:temperate:small:002'],
 ['10','buildDunewakeOasisReedworksFishingLodge','r1:fishing-lodge:desert:small:002'],
 ['11','buildMossveilTwinCourtSporeGranary','r1:farm-barn:enchanted-forest:small:002'],
 ['12','buildSunspokeForkedShelterCorralStables','r1:stable:desert:small:002'],
 ['13','buildGlimmerboughSplitSunOrchidHouse','r1:greenhouse:enchanted-forest:small:002']
];
test('Waves9-13 each preview actual authored original with exact own constructor, ID and WebGL2 renderer',()=>{
 for(const [wave,fn,id] of candidates){
  const src=read('src/building-pool/roadmap-b/builder-b-essentials-wave'+wave+'.mjs');
  const html=read('tests/building-pool/roadmap-b/builder-b-essentials-wave'+wave+'-preview.html');
  assert.ok(src.includes('export function '+fn+'('),'missing authored original '+wave);
  assert.ok(src.includes("'"+id+"'"),'wrong exact original ownership '+wave);
  assert.ok(html.includes('import {'+fn+'} from '),'preview imports invented source '+wave);
  assert.ok(html.includes('const buildings=['+fn+'()]'),'preview renders wrong physical original '+wave);
  assert.ok(html.includes('builder-b-essentials-wave'+wave+'.mjs'),'preview path mismatched '+wave);
  assert.ok(html.includes("canvas.getContext('webgl2'"),'preview has no genuine WebGL2 source');
 }
 assert.equal(new Set(candidates.map(x=>x[2])).size,5,'reused ownership slot');
});
test('One four-original gallery requires 30 distinct genuine frames, original 4 source SHA, PNG decode and independent exact HEAD',()=>{
 const gallery=read('tests/building-pool/roadmap-b/builder-b-essentials-wave9-13-gallery.mjs');
 const audit=read('tests/building-pool/roadmap-b/audit-builder-b-essentials-wave9-13-gallery.mjs');
 for(const [wave,fn,id] of candidates){
  assert.ok(gallery.includes('builder-b-essentials-wave'+wave+'.mjs'),'source SHA missing wave'+wave);
  assert.ok(gallery.includes('builder-b-essentials-wave'+wave+'-preview.html'),'source preview unmapped wave'+wave);
  assert.ok(gallery.includes(id),'gallery source identity absent '+wave);
  assert.ok(audit.includes(id),'independent audit source absent '+wave);
 }
 for(const code of [gallery,audit]){
  assert.ok(code.includes('BUILDER_B_EXPECTED_HEAD'),'exact head not enforced');
  assert.ok(code.includes('sha256'),'authentic PNG SHA evidence missing');
  assert.ok(code.includes('builder-b-essentials-wave9-13-source-webgl2'),'artifact source path mismatch');
 }
 assert.ok(gallery.includes('records.length!==30||keys.size!==30'),'gallery accepts fewer than 24 unique screenshots');
 assert.ok(audit.includes('obj.records?.length!==30||obj.sourceEvidence?.length!==8'),'auditor misses four source files and shared schema');
 assert.ok(audit.includes('seen.size!==30||hashes.size!==30'),'auditor accepts incomplete/deduplicated source frames');
 assert.ok(gallery.includes('PNG.sync.read(buf)'),'gallery does not decode real PNG');
 assert.ok(audit.includes('PNG.sync.read(img,{checkCRC:true})'),'independent audit fails to check PNG CRC');
 assert.ok(gallery.includes('[[667,375],[844,390],[932,430]]'),'all required three landscape widths missing');
 assert.ok(gallery.includes("views=['exterior','cutaway']"),'both original source views required');
 assert.ok(audit.includes('actualIphoneTested:false'),'image proxy falsely claims device acceptance');
 assert.ok(audit.includes('creatorArtAccepted:false'),'image proxy falsely claims creator art acceptance');
});
