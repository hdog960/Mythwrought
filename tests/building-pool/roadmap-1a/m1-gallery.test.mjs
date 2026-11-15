import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./m1-inn-canvas.html',import.meta.url),'utf8');
test('browser preview imports the exact 1A coordinate-authored Inn source without external JS/CDNs',()=>{
 assert.match(html,/getM1InnExemplars/);
 assert.match(html,/m1-inn-exemplars\.mjs/);
 assert.doesNotMatch(html,/https?:\/\/|src="https?:/);
 assert.match(html,/Canvas2D/);
});
test('gallery labels both preview modes as proxy, not physical-family WebGL2 acceptance',()=>{
 assert.match(html,/cutaway/);
 assert.match(html,/roofBacking/);
 assert.match(html,/NOT production WebGL2/);
 assert.match(html,/physical-family meshes/);
});
