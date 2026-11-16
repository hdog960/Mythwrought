import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M3_CRAFT_FOURTH_SPECS} from '../../../src/building-pool/roadmap-3a/m3-craft-fourth-variants.mjs';
test('180 genuine fourth-variant carpenter and stonemason Chromium/WebGL2 review targets use actual authored source',()=>{
 const base=new URL('./',import.meta.url);
 const html=readFileSync(new URL('preview-m3-fourth.html',base),'utf8');
 const js=readFileSync(new URL('preview-m3-fourth.mjs',base),'utf8');
 const runner=readFileSync(new URL('preview-m3-fourth-browser.mjs',base),'utf8');
 assert.equal(M3_CRAFT_FOURTH_SPECS.length,30);
 for(const spec of M3_CRAFT_FOURTH_SPECS)
  assert.ok(runner.includes('["'+spec.type+'","'+spec.biome+'","'+spec.size+'"]'),'missing review source '+spec.name);
 assert.match(runner,/completed!==180/);
 assert.match(runner,/r3a:\$\{type\}:\$\{biome\}:\$\{size\}:4/);
 assert.match(js,/createM3CraftFourthVariant\(type,biome,size\)/);
 assert.match(js,/const geometry=createM3CraftFourthPreviewMesh\(b,/);
 assert.doesNotMatch(js,/createM3CraftSecondPreviewMesh\(b,/);
 for(const type of ['carpenter','stonemason'])assert.ok(html.includes('value="'+type+'"'));
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  assert.ok(html.includes('value="'+biome+'"'));
 for(const size of ['small','medium','large'])
  assert.ok(new RegExp('<option(?: selected)?>'+size+'</option>').test(html));
 assert.match(html,/Diagnostic cube envelopes/);
 assert.doesNotMatch(html,/value="blacksmith"/);
});
