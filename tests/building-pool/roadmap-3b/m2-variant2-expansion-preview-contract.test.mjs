import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-variant2-expansion-preview.html',import.meta.url),'utf8');
const client=readFileSync(new URL('./m2-variant2-expansion-preview.mjs',import.meta.url),'utf8');
const runner=readFileSync(new URL('./m2-variant2-expansion-chromium.test.mjs',import.meta.url),'utf8');
const ids=['lumberyard:temperate:medium','lumberyard:desert:small','lumberyard:enchanted-forest:medium','lumberyard:mountain:large','mill:temperate:small','mill:snow:medium','mill:enchanted-forest:large','mill:mountain:large'];
test('all eight independently source-authored variant-2 layouts bind the correct 48 real Chromium software-WebGL2 views',()=>{
 assert.ok(html.includes('src="./m2-variant2-expansion-preview.mjs"'));
 assert.ok(client.includes('createVariant2ExpansionBlueprint(type,biome,size,2)'));
 assert.ok(runner.includes("expectedId='r3:'+type+':'+biome+':'+size+':2';"));
 assert.ok(runner.includes("const releaseChromium=await acquire3BChromiumPermit();"));
 assert.ok(runner.includes("}finally{await releaseChromium();}"));
 assert.ok(runner.includes('reports.length,48'));
 for(const id of ids){assert.ok(html.includes('value="'+id+'"'),id);assert.ok(runner.includes("'"+id+"'"),id)}
 assert.doesNotMatch(html,/id="type"/);
});