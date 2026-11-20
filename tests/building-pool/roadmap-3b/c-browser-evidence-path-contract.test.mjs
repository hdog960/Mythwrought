// Fail before expensive Chromium whenever a capture writes a folder different
// from the PNG CRC inspector or upload-artifact. This is not screenshot proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../../../',import.meta.url);
const load=path=>readFile(new URL(path,root),'utf8');
const specs=[
 {stem:'c2-twinstone-gatehouse',source:'c1-twinstone-pass-gatehouse.mjs',id:'r3:gatehouse:temperate:small:1',design:'gatehouse:temperate:small',dir:'roadmap-c-3b-twinstone-gatehouse'},
 {stem:'c3-fourwatch-wall',source:'c3-fourwatch-closed-city-wall.mjs',id:'r3:city-wall:temperate:small:1',design:'city-wall:temperate:small',dir:'roadmap-c-3b-fourwatch-city-wall'},
 {stem:'c4-sandglass-fork-barracks',source:'c4-sandglass-fork-desert-barracks.mjs',id:'r3:barracks:desert:medium:2',design:'barracks:desert:medium',dir:'roadmap-c-3b-sandglass-fork-barracks'},
 {stem:'c5-sunbarrow-gatehouse',source:'c5-sunbarrow-desert-gatehouse.mjs',id:'r3:gatehouse:desert:small:1',design:'gatehouse:desert:small',dir:'roadmap-c-3b-sunbarrow-gatehouse'},
 {stem:'c6-granite-switchback-wall',source:'c6-granite-switchback-mountain-wall.mjs',id:'r3:city-wall:mountain:small:1',design:'city-wall:mountain:small',dir:'roadmap-c-3b-granite-switchback-wall'}
];
test('all five 3B authentic browser source paths, preview IDs, PNG CRC folders, and upload ZIP paths are identical',async()=>{
 const prefix='tests/building-pool/roadmap-3b/';
 const auditor=await load(prefix+'c-evidence-png-integrity.test.mjs');
 const workflow=await load('.github/workflows/roadmap-c-gatehouse-webgl2.yml');
 assert.equal(specs.length,5);
 const uniqueIds=new Set(),uniqueDirs=new Set();
 for(const spec of specs){
  assert.ok(!uniqueIds.has(spec.id)&&!uniqueDirs.has(spec.dir),'duplicate 3B source identity or screenshot folder');
  uniqueIds.add(spec.id);uniqueDirs.add(spec.dir);
  const sourcePath='src/building-pool/roadmap-3b/'+spec.source;
  const script=await load(prefix+spec.stem+'-chromium.test.mjs');
  const html=await load(prefix+spec.stem+'-preview.html');
  const preview=await load(prefix+spec.stem+'-preview.mjs');
  const outputPath='artifacts/'+spec.dir+'/chromium-webgl2-source';
  assert.ok(script.includes("const output=resolve('"+outputPath+"')"),
   'Chromium writes a different directory from CRC audit: '+spec.stem);
  assert.ok(script.includes("const sourceModulePath='"+sourcePath+"'"),
   'Chromium source SHA256 does not pin original model: '+spec.stem);
  assert.ok(script.includes("'"+spec.design+"'"),
   'Chromium does not select expected original 3B design: '+spec.stem);
  assert.ok(html.includes('value="'+spec.design+'"'),
   'HTML preview selector does not have original 3B source type/biome/size: '+spec.stem);
  assert.ok(html.includes('./'+spec.stem+'-preview.mjs'),
   'preview HTML loads another source module: '+spec.stem);
  assert.ok(preview.includes('../../../'+sourcePath),
   'preview JS loads another source model: '+spec.stem);
  assert.ok(auditor.includes("['"+spec.dir+"','"+spec.id+"','"+sourcePath+"']"),
   'original screenshot identity missing or incorrect in independent CRC audit: '+spec.stem);
  assert.ok(workflow.includes('node --test '+prefix+spec.stem+'-chromium.test.mjs'),
   'browser test is not invoked in source-specific real CDP capture: '+spec.stem);
  assert.ok(workflow.includes('artifacts/'+spec.dir+'/'),
   'upload-artifact ZIP has wrong source screenshot directory: '+spec.stem);
 }
 assert.ok(auditor.includes('assert.equal(shaSet.size,30);assert.equal(n,30);'));
 assert.ok(workflow.includes('c-evidence-png-integrity.test.mjs'));
 assert.equal(uniqueIds.size,5);assert.equal(uniqueDirs.size,5);
});
