import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M3_CRAFT_SECOND_SPECS} from '../../../src/building-pool/roadmap-3a/m3-craft-second-variants.mjs';
test('all 30 true M3 carpenter/stonemason second-variant identities have 180 exact source-pinned Chromium capture inputs',()=>{
 const base=new URL('./',import.meta.url);
 const html=readFileSync(new URL('preview-m3-second.html',base),'utf8');
 const js=readFileSync(new URL('preview-m3-second.mjs',base),'utf8');
 const runner=readFileSync(new URL('preview-m3-second-browser.mjs',base),'utf8');
 assert.equal(M3_CRAFT_SECOND_SPECS.length,30);
 for(const q of M3_CRAFT_SECOND_SPECS)
  assert.ok(runner.includes('["'+q.type+'","'+q.biome+'","'+q.size+'"]'),'missing source-specific design '+q.name);
 assert.match(runner,/completed!==180/);
 assert.match(runner,/r3a:\$\{type\}:\$\{biome\}:\$\{size\}:2/);
 assert.match(js,/createM3CraftSecondVariant\(type,biome,size\)/);
 assert.match(js,/const geometry=createM3CraftSecondPreviewMesh\(b,/);
 for(const type of ['carpenter','stonemason'])assert.ok(html.includes('value="'+type+'"'));
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  assert.ok(html.includes('value="'+biome+'"'));
 for(const size of ['small','medium','large'])
  assert.ok(new RegExp('<option(?: selected)?>'+size+'</option>').test(html));
 assert.doesNotMatch(html,/value="blacksmith"/);
 assert.match(html,/Diagnostic cube envelopes/);
});
