import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M2_FIFTH_VARIANT_SPECS} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fifth-variants.mjs';
test('180 authentic source-driven Chromium/WebGL2 captures target 30 independently authored fifth-metalworking models',()=>{
 const base=new URL('./',import.meta.url);
 const html=readFileSync(new URL('preview-m2-fifth.html',base),'utf8');
 const js=readFileSync(new URL('preview-m2-fifth.mjs',base),'utf8');
 const runner=readFileSync(new URL('preview-m2-fifth-browser.mjs',base),'utf8');
 assert.equal(M2_FIFTH_VARIANT_SPECS.length,30);
 for(const spec of M2_FIFTH_VARIANT_SPECS)
  assert.ok(runner.includes('["'+spec.type+'","'+spec.biome+'","'+spec.size+'"]'),'missing exact screenshot '+spec.name);
 assert.match(runner,/completed!==180/);
 assert.match(runner,/r3a:\$\{type\}:\$\{biome\}:\$\{size\}:5/);
 assert.match(js,/createM2FifthVariant\(type,biome,size\)/);
 assert.match(js,/const geometry=createM2FifthPreviewMesh\(b,/);
 assert.doesNotMatch(js,/createM2FourthPreviewMesh\(b,/);
 for(const type of ['blacksmith','armorer'])assert.ok(html.includes('value="'+type+'"'));
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  assert.ok(html.includes('value="'+biome+'"'));
 for(const size of ['small','medium','large'])
  assert.ok(new RegExp('<option(?: selected)?>'+size+'</option>').test(html));
 assert.match(html,/Diagnostic cube envelopes/);
 assert.doesNotMatch(html,/value="watchtower"/);
});
