import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M2_FOURTH_VARIANT_SPECS} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fourth-variants.mjs';
test('180 genuine Chromium exterior/cutaway view inputs target exactly 30 individually authored fourth metalwork variant source IDs',()=>{
 const base=new URL('./',import.meta.url);
 const html=readFileSync(new URL('preview-m2-fourth.html',base),'utf8');
 const js=readFileSync(new URL('preview-m2-fourth.mjs',base),'utf8');
 const runner=readFileSync(new URL('preview-m2-fourth-browser.mjs',base),'utf8');
 assert.equal(M2_FOURTH_VARIANT_SPECS.length,30);
 for(const q of M2_FOURTH_VARIANT_SPECS){
  assert.ok(runner.includes('["'+q.type+'","'+q.biome+'","'+q.size+'"]'),q.name);
 }
 assert.match(runner,/completed!==180/);
 assert.match(runner,/r3a:\$\{type\}:\$\{biome\}:\$\{size\}:4/);
 assert.match(js,/createM2FourthVariant\(type,biome,size\)/);
 assert.match(js,/const geometry=createM2FourthPreviewMesh\(b,/);
 assert.doesNotMatch(js,/createM2ThirdPreviewMesh\(b,/);
 for(const type of ['blacksmith','armorer'])assert.ok(html.includes('value="'+type+'"'));
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  assert.ok(html.includes('value="'+biome+'"'));
 for(const size of ['small','medium','large'])
  assert.ok(new RegExp('<option(?: selected)?>'+size+'</option>').test(html));
 assert.match(html,/Diagnostic cube envelopes/);
 assert.doesNotMatch(html,/value="watchtower"/);
});
