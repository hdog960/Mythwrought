import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root=new URL('./',import.meta.url);
const runner=fs.readFileSync(new URL('webgl2-inline-browser.py',root),'utf8');
const entry=fs.readFileSync(new URL('webgl2-preview-browser.py',root),'utf8');
test('genuine WebGL2 acceptance runner and official entrypoint parse in native Python',()=>{
  for(const file of ['webgl2-inline-browser.py','webgl2-preview-browser.py']){
    const p=new URL(file,root);
    execFileSync('python3',['-c',`import ast;ast.parse(open(${JSON.stringify(p.pathname)}).read())`],{stdio:'pipe'});
  }
  assert.match(entry,/webgl2-inline-browser\.py/);
  assert.match(entry,/module\.run\(\)/);
  assert.doesNotMatch(entry,/\['triangles'\]/);
});
test('genuine reviewer checks actual WebGL2 draw and synchronizes GL without false GPU certification',()=>{
  for(const phrase of ["data.get('drawnTriangles',0)","proof['version'].startswith('WebGL 2.0')",
    'gl.finish()',"proof['error']","data.get('lost')",'sourceBundleSha256'])
    assert.ok(runner.includes(phrase),'missing proof: '+phrase);
  assert.match(runner,/page\.add_script_tag\(content=compiled\)/);
  assert.doesNotMatch(runner,/getContext\('2d'\)/);
  assert.match(runner,/realIPhoneTested':False/);
  assert.match(runner,/physicalCollisionCertified':False/);
});
test('M1 review covers 30 designs, 3 landscape sizes, and exterior and cutaway captures',()=>{
  assert.match(runner,/\(667,375\),\(844,390\),\(932,430\)/);
  assert.match(runner,/\('civic-hall','castle-palace'\)/);
  assert.match(runner,/for cut in \(False,True\)/);
  assert.match(runner,/data\['canvasSize'\] != \[w,h\]/);
});
test('source-only bundler preserves author geometry and actual renderer, not illustrative reimplementations',()=>{
  assert.match(runner,/builder=\(SRC\/'m1-blueprints\.mjs'\)/);
  assert.match(runner,/shapes=\(SRC\/'m1-preview-shapes\.mjs'\)/);
  assert.match(runner,/render=\(TESTS\/'webgl2-preview\.mjs'\)/);
  assert.match(runner,/schema=\(SRC\/'schema\.mjs'\)/);
  assert.match(runner,/Unexpected module syntax/);
});
