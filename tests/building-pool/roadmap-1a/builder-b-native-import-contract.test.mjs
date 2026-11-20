// Builder B source-only native contract catches duplicate binding imports BEFORE any historical/Chromium test starts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const files=['builder-b-homes-wave1.test.mjs','builder-b-hospitality-wave2.test.mjs',
 'builder-b-inns-wave3.test.mjs','builder-b-homes-wave4.test.mjs',
 'builder-b-hospitality-wave5.test.mjs','builder-b-homes-wave6.test.mjs'];
test('every 1A Builder B wave imports unique real exported original symbols, with no duplicate lexical bindings',()=>{
 for(const name of files){
  const file=resolve(root,name),body=readFileSync(file,'utf8'),seen=new Set(),builderImports=[];
  const imports=[...body.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g)];
  assert.ok(imports.length>12,name+' native historical source imports missing');
  for(const found of imports){
   // Built-in Node imports are real, but not repository source files.
   // The source-export contract applies ONLY to relative authored modules.
   if(!found[2].startsWith('./')&&!found[2].startsWith('../'))continue;
   const dependency=resolve(dirname(file),found[2]);
   const source=readFileSync(dependency,'utf8');
   for(const part of found[1].split(',')){
    const symbol=part.trim().split(/\s+as\s+/)[0].trim();
    assert.ok(!seen.has(symbol),name+' duplicate lexical named import '+symbol);
    seen.add(symbol);
    if(/^getBuilderB|^BUILDER_B_/.test(symbol)){
     assert.ok(source.includes('export function '+symbol+'(')||
       source.includes('export const '+symbol+'='),
       name+' references nonexistent source-export '+symbol+' in '+found[2]);
     builderImports.push(symbol);
    }
   }
  }
  assert.ok(builderImports.length>=2,name+' contains no real Builder B wave source');
 }
});
