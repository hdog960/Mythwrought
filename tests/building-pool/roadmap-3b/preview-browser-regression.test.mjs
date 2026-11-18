import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./preview-browser.mjs',import.meta.url),'utf8');
const markup=readFileSync(new URL('./preview.html',import.meta.url),'utf8');
test('3B screenshot runner selects only existing watchtower preview fields, never the deleted #type dropdown',()=>{
 for(const field of ['biome','size','view']){
  assert.match(markup,new RegExp('id="'+field+'"'));
  assert.ok(source.includes("'#"+field+"'"),field);
 }
 assert.doesNotMatch(markup,/id="type"/);
 assert.doesNotMatch(source,/selectOption\(['"]#type['"]/);
 assert.doesNotMatch(source,/\bfor\s*\(const type\b/);
 assert.match(source,/completed!==90/);
 assert.match(source,/r3:watchtower:/);
});
