import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-variant2-completion-preview.html',import.meta.url),'utf8');
const client=readFileSync(new URL('./m2-variant2-completion-preview.mjs',import.meta.url),'utf8');
const runner=readFileSync(new URL('./m2-variant2-completion-chromium.test.mjs',import.meta.url),'utf8');
const designs=["lumberyard:temperate:large","lumberyard:desert:medium","lumberyard:snow:small","lumberyard:snow:medium","lumberyard:enchanted-forest:small","lumberyard:enchanted-forest:large","lumberyard:mountain:small","lumberyard:mountain:medium","mill:temperate:medium","mill:temperate:large","mill:desert:small","mill:desert:large","mill:snow:small","mill:snow:large","mill:enchanted-forest:small","mill:mountain:medium"];
test('all 16 genuinely original missing variant-2 industry plans are individually bound to 96 true Chromium screenshots',()=>{
 assert.ok(html.includes('src="./m2-variant2-completion-preview.mjs"'));
 assert.ok(client.includes('createVariant2CompletionBlueprint(type,biome,size,2)'));
 assert.ok(runner.includes("expectedId='r3:'+type+':'+biome+':'+size+':2';"));
 assert.ok(runner.includes('const releaseChromium=await acquire3BChromiumPermit();'));
 assert.ok(runner.includes('}finally{await releaseChromium();}'));
 assert.ok(runner.includes('reports.length,96'));
 assert.ok(runner.includes('filename)).size,96'));
 for(const id of designs){
  assert.ok(html.includes('value="'+id+'"'),id+' not in source-native dropdown');
  assert.ok(runner.includes("'"+id+"'"),id+' not in actual Chromium screenshot test');
 }
 assert.doesNotMatch(html,/id="type"/);
});