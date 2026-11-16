import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M2_METALWORK_SPECIFICATIONS} from '../../../src/building-pool/roadmap-3a/m2-metalwork-second-variants.mjs';
test('M2 authentic 180-view browser capture targets 30 real source IDs, two cutaways and three landscape sizes',()=>{
 const html=readFileSync(new URL('./preview-m2.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('./preview-m2.mjs',import.meta.url),'utf8');
 const runner=readFileSync(new URL('./preview-m2-browser.mjs',import.meta.url),'utf8');
 assert.match(html,/Diagnostic cube envelopes/);
 for(const type of ['blacksmith','armorer'])assert.ok(html.includes('value="'+type+'"'));
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  assert.ok(html.includes('value="'+biome+'"'));
 for(const size of ['small','medium','large'])
  assert.ok(new RegExp('<option(?: selected)?>'+size+'</option>').test(html));
 for(const s of M2_METALWORK_SPECIFICATIONS)
  assert.ok(runner.includes('["'+s.type+'","'+s.biome+'","'+s.size+'"]'),'missing real authored preview '+s.name);
 assert.match(js,/createM2MetalworkBlueprint\(type,biome,size\)/);
 assert.match(js,/const geometry=createM2PreviewMesh\(b,/);
 assert.doesNotMatch(js,/createCoveragePreviewMesh\(b,/);
 assert.match(runner,/r3a:\$\{type\}:\$\{biome\}:\$\{size\}:2/);
 assert.match(runner,/completed!==180/);
 assert.doesNotMatch(html,/value="watchtower"/);
});
