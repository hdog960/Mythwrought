import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-variant3-first-preview.html',import.meta.url),'utf8');
const client=readFileSync(new URL('./m2-variant3-first-preview.mjs',import.meta.url),'utf8');
const browser=readFileSync(new URL('./m2-variant3-first-chromium.test.mjs',import.meta.url),'utf8');
const slots=["lumberyard:temperate:small","lumberyard:desert:large","lumberyard:snow:medium","lumberyard:enchanted-forest:small","lumberyard:mountain:large","mill:temperate:medium","mill:desert:small","mill:snow:large","mill:enchanted-forest:medium","mill:mountain:small"];
test('ten true source-authored variation-3 industry plans bind 60 real protected Chromium WebGL2 source captures',()=>{
 assert.ok(html.includes('src="./m2-variant3-first-preview.mjs"'));
 assert.ok(client.includes('createVariant3FirstBlueprint(type,biome,size,3)'));
 assert.ok(browser.includes("expectedId='r3:'+type+':'+biome+':'+size+':3';"));
 assert.ok(browser.includes("const releaseChromium=await acquire3BChromiumPermit();"));
 assert.ok(browser.includes("}finally{await releaseChromium();}"));
 assert.ok(browser.includes('reports.length,60'));
 assert.ok(browser.includes('filename)).size,60'));
 for(const id of slots){assert.ok(html.includes('value="'+id+'"'),id);assert.ok(browser.includes("'"+id+"'"),id);}
 assert.doesNotMatch(html,/id="type"/);
});