// B Roadmap source-only regression: preview must import real authored constructor, not an invented name.
// This catches the Meadowstep fishing-lodge name corruption BEFORE Chromium is asked to run.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../../'+path,import.meta.url),'utf8');
const assignments=[
 ['builder-b-essentials-preview.html','builder-b-essentials-gallery.mjs',
  ['buildBriarfordSwitchwingBarn','buildAlderglassTrellisConservatory'],
  ['builder-b-essentials-wave1.mjs','builder-b-essentials-wave2.mjs']],
 ['builder-b-essentials-wave3-preview.html','builder-b-essentials-wave3-gallery.mjs',
  ['buildSedgewatchTidehookFishingLodge'],['builder-b-essentials-wave3.mjs']],
 ['builder-b-essentials-wave4-preview.html','builder-b-essentials-wave4-gallery.mjs',
  ['buildMeadowstepSplitAisleStables'],['builder-b-essentials-wave4.mjs']],
 ['builder-b-essentials-wave5-preview.html','builder-b-essentials-wave5-gallery.mjs',
  ['buildSunshardSplitWellBathhouse'],['builder-b-essentials-wave5.mjs']],
 ['builder-b-essentials-wave6-preview.html','builder-b-essentials-wave6-gallery.mjs',
  ['buildTidehollowCrosswharfHarborOffice'],['builder-b-essentials-wave6.mjs']],
 ['builder-b-essentials-wave7-preview.html','builder-b-essentials-wave7-gallery.mjs',
  ['buildRimeglassCrescentSunGreenhouse'],['builder-b-essentials-wave7.mjs']],
 ['builder-b-essentials-wave8-preview.html','builder-b-essentials-wave8-gallery.mjs',
  ['buildFrostwakeCrownbridgeLighthouse'],['builder-b-essentials-wave8.mjs']]
];
test('all eight service source preview pages reference exactly their exported original constructors',()=>{
 for(const [preview,gallery,names,modules] of assignments){
  const doc=read('tests/building-pool/roadmap-b/'+preview);
  const evidence=read('tests/building-pool/roadmap-b/'+gallery);
  for(let i=0;i<names.length;i++){
   const source=read('src/building-pool/roadmap-b/'+modules[i]);
   assert.match(source,new RegExp('export function '+names[i]+'\\('),modules[i]+' real export missing');
   assert.ok(doc.includes('import {'+names[i]+'}'),preview+' imported nonexistent name');
   assert.ok(doc.includes(names[i]+'()'),preview+' did not call sourced constructor');
   assert.ok(doc.includes(modules[i]),preview+' does not name authentic source module');
  }
  assert.ok(doc.includes('const gl=canvas.getContext(\'webgl2\''),'no real WebGL2 source preview');
  assert.ok(evidence.includes(preview+'?id='),gallery+' does not navigate authentic HTML');
  assert.ok(evidence.includes("BUILDER_B_EXPECTED_HEAD"),gallery+' missing expected exact checkout');
  assert.ok(evidence.includes("PNG.sync.read(buf)"),gallery+' not decoding real PNG frame');
 }
});
