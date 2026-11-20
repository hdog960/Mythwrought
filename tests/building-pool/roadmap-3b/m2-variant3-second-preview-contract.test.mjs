import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m2-variant3-second-preview.html',import.meta.url),'utf8');
const client=readFileSync(new URL('./m2-variant3-second-preview.mjs',import.meta.url),'utf8');
const browser=readFileSync(new URL('./m2-variant3-second-chromium.test.mjs',import.meta.url),'utf8');
const ids=["lumberyard:temperate:medium","lumberyard:desert:small","lumberyard:snow:large","lumberyard:enchanted-forest:large","lumberyard:mountain:small","mill:temperate:small","mill:desert:medium","mill:snow:medium","mill:enchanted-forest:large","mill:mountain:large"];
test('ten second-cohort source variation-3 structures really drive 60 protected Chromium WebGL2 captures',()=>{
 assert.ok(html.includes('src="./m2-variant3-second-preview.mjs"'));
 assert.ok(client.includes('createVariant3SecondBlueprint(type,biome,size,3)'));
 assert.ok(browser.includes("expectedId='r3:'+type+':'+biome+':'+size+':3';"));
 assert.ok(browser.includes('const releaseChromium=await acquire3BChromiumPermit();'));
 assert.ok(browser.includes('}finally{await releaseChromium();}'));
 assert.ok(browser.includes('gl.readPixels('));
 assert.ok(browser.includes('Page.captureScreenshot'));
 assert.ok(browser.includes('reports.length,60'));
 assert.ok(browser.includes('filename)).size,60'));
 for(const id of ids){
  assert.ok(html.includes('value="'+id+'"'),id);
  assert.ok(browser.includes("'"+id+"'"),id);
 }
 assert.doesNotMatch(html,/id="type"/);
});