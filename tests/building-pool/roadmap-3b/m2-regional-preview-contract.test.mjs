import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-regional-preview.html',import.meta.url),'utf8');
const script=readFileSync(new URL('./m2-regional-preview.mjs',import.meta.url),'utf8');
const runner=readFileSync(new URL('./m2-regional-chromium.test.mjs',import.meta.url),'utf8');
test('M2 regional WebGL2 screenshot page binds all four distinct actual source IDs, no stale industry selector',()=>{
 assert.ok(html.includes('src="./m2-regional-preview.mjs"'));
 assert.ok(html.includes('id="design"'));
 for(const slot of ['lumberyard:temperate:medium','lumberyard:desert:small','mill:temperate:medium','mill:mountain:small']){
  assert.ok(html.includes('value="'+slot+'"'),slot);
  assert.ok(runner.includes("'"+slot+"'"),slot);
 }
 assert.doesNotMatch(html,/id="type"/);
 assert.ok(script.includes('createRegionalIndustryBlueprint(type,biome,size,1)'));
 assert.ok(runner.includes('reports.length,24'));
 assert.ok(runner.includes('size,24'));
});
