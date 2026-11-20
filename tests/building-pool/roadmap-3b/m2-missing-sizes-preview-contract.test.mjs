import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-missing-sizes-preview.html',import.meta.url),'utf8');
const client=readFileSync(new URL('./m2-missing-sizes-preview.mjs',import.meta.url),'utf8');
const runner=readFileSync(new URL('./m2-missing-sizes-chromium.test.mjs',import.meta.url),'utf8');
const ids=['lumberyard:temperate:large','lumberyard:desert:medium','lumberyard:snow:medium',
 'lumberyard:enchanted-forest:large','lumberyard:mountain:small','mill:temperate:large',
 'mill:desert:small','mill:snow:small','mill:enchanted-forest:medium','mill:mountain:large'];
test('exact authored ten first-variant source pages bind 60 real Chromium screenshots without old selectors',()=>{
 assert.ok(html.includes('src="./m2-missing-sizes-preview.mjs"'));
 assert.ok(html.includes('id="design"'));
 assert.ok(client.includes('createMissingSlotIndustryBlueprint(type,biome,size,1)'));
 assert.ok(runner.includes('reports.length,60'));
 assert.ok(runner.includes('filename)).size,60'));
 for(const id of ids){
  assert.ok(html.includes('value="'+id+'"'),id);
  assert.ok(runner.includes("'"+id+"'"),id);
 }
 assert.doesNotMatch(html,/id="type"/);
});
