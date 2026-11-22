import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-variant2-preview.html',import.meta.url),'utf8');
const client=readFileSync(new URL('./m2-variant2-preview.mjs',import.meta.url),'utf8');
const chromium=readFileSync(new URL('./m2-variant2-chromium.test.mjs',import.meta.url),'utf8');
const ids=['lumberyard:temperate:small','lumberyard:snow:large','lumberyard:desert:large',
 'mill:desert:medium','mill:mountain:small','mill:enchanted-forest:medium'];
test('six original 3B variant-2 source candidates correctly power exact 36 real WebGL2 browser views',()=>{
 assert.ok(html.includes('src="./m2-variant2-preview.mjs"'));
 assert.ok(html.includes('id="design"'));
 assert.ok(client.includes('createVariant2IndustryBlueprint(type,biome,size,2)'));
 assert.ok(chromium.includes("expectedId='r3:'+type+':'+biome+':'+size+':2';"));
 assert.ok(chromium.includes('reports.length,36'));
 assert.ok(chromium.includes('filename)).size,36'));
 for(const id of ids){assert.ok(html.includes('value="'+id+'"'),id);assert.ok(chromium.includes("'"+id+"'"),id);}
 assert.doesNotMatch(html,/id="type"/);
});
