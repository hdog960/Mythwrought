import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-frontier-preview.html',import.meta.url),'utf8');
const client=readFileSync(new URL('./m2-frontier-preview.mjs',import.meta.url),'utf8');
const cdp=readFileSync(new URL('./m2-frontier-chromium.test.mjs',import.meta.url),'utf8');
test('six-source frontier diagnostic preview UI and 36-capture Chromium script bind real source identities',()=>{
 assert.ok(html.includes('src="./m2-frontier-preview.mjs"'));
 assert.ok(html.includes('id="design"'));
 for(const id of ['lumberyard:snow:small','lumberyard:enchanted-forest:medium','lumberyard:mountain:large',
  'mill:desert:medium','mill:snow:medium','mill:enchanted-forest:large']){
  assert.ok(html.includes('value="'+id+'"'),id);
  assert.ok(cdp.includes("'"+id+"'"),id);
 }
 assert.ok(client.includes('createFrontierIndustryBlueprint(type,biome,size,1)'));
 assert.ok(cdp.includes('reports.length,36'));
 assert.ok(cdp.includes('filename)).size,36'));
 assert.doesNotMatch(html,/id="type"/);
});
