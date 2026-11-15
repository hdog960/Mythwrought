import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const here=new URL('./',import.meta.url);
test('authentic 2A WebGL2 diagnostic is source-bound, syntax valid, and cannot claim production physical shapes',()=>{
 const page=readFileSync(new URL('m1-gallery.html',here),'utf8');
 const src=readFileSync(new URL('m1-gallery.mjs',here),'utf8');
 assert.match(page,/NOT final physical block-family shapes/);
 assert.match(src,/getContext\('webgl2'/);
 assert.match(src,/drawArraysInstanced/);
 assert.match(src,/M1_GENERAL_STORES/);
 assert.match(src,/M1_SPECIALIST_EXEMPLARS/);
 assert.match(src,/M1_NEW_MERCHANTS/);
 assert.match(src,/productionPhysicalFamilyGeometry:false/);
 const syntax=spawnSync(process.execPath,['--check',new URL('m1-gallery.mjs',here).pathname],{encoding:'utf8'});
 assert.equal(syntax.status,0,syntax.stderr);
});
