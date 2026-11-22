import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-hinterland-preview.html',import.meta.url),'utf8');
const script=readFileSync(new URL('./m2-hinterland-preview.mjs',import.meta.url),'utf8');
const cdp=readFileSync(new URL('./m2-hinterland-chromium.test.mjs',import.meta.url),'utf8');
test('hinterland source diagnostic links eight genuinely authored designs to 48 real browser captures',()=>{
 assert.ok(html.includes('src="./m2-hinterland-preview.mjs"'));
 assert.ok(html.includes('id="design"'));
 for(const id of ['lumberyard:desert:large','lumberyard:snow:large','lumberyard:enchanted-forest:small','lumberyard:mountain:medium',
 'mill:desert:large','mill:snow:large','mill:enchanted-forest:small','mill:mountain:medium']){
  assert.ok(html.includes('value="'+id+'"'),id);
  assert.ok(cdp.includes("'"+id+"'"),id);
 }
 assert.ok(script.includes('createHinterlandBlueprint(type,biome,size,1)'));
 assert.ok(cdp.includes('reports.length,48'));
 assert.ok(cdp.includes('filename)).size,48'));
 assert.doesNotMatch(html,/id="type"/);
});
