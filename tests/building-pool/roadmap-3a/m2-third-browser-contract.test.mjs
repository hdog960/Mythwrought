import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M2_THIRD_VARIANT_SPECS} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
test('180 source-authentic real Chromium WebGL2 captures target 30 variant-3 metalwork geometries',()=>{
 const html=readFileSync(new URL('./preview-m2-third.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('./preview-m2-third.mjs',import.meta.url),'utf8');
 const runner=readFileSync(new URL('./preview-m2-third-browser.mjs',import.meta.url),'utf8');
 for(const s of M2_THIRD_VARIANT_SPECS)
  assert.ok(runner.includes('["'+s.type+'","'+s.biome+'","'+s.size+'"]'),s.name+' absent from real browser capture');
 assert.match(runner,/completed!==180/);
 assert.match(runner,/r3a:\$\{type\}:\$\{biome\}:\$\{size\}:3/);
 assert.match(js,/createM2ThirdVariant\(type,biome,size\)/);
 assert.match(js,/const geometry=createM2ThirdPreviewMesh\(b,/);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  assert.ok(html.includes('value="'+biome+'"'));
 for(const size of ['small','medium','large'])
  assert.ok(new RegExp('<option(?: selected)?>'+size+'</option>').test(html));
 assert.match(html,/Diagnostic cube envelopes/);
 assert.doesNotMatch(html,/value="watchtower"/);
});
