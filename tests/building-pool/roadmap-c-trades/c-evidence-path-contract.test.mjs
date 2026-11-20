// Read-only fail-fast witness: genuine screenshot tests must write to the exact
// directory and original source that independent PNG CRC and ZIP upload inspect.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../../../',import.meta.url);
const load=p=>readFile(new URL(p,root),'utf8');
const specs=[
 ['wave1-desert-market','r2:market-square:desert:small:01','wave1-desert-market.mjs','market-preview','roadmap-c-trade-desert-market'],
 ['wave2-riverbend-tailor','r2:tailor:temperate:small:03','wave2-riverbend-tailor.mjs','tailor-preview','roadmap-c-trade-riverbend-tailor'],
 ['wave3-5-butcher','r2:butcher:temperate:small:02','wave3-copperford-butcher.mjs','wave3-5-preview','roadmap-c-trade-copperford-butcher'],
 ['wave3-5-jeweler','r2:jeweler:temperate:small:02','wave4-silverfinch-jeweler.mjs','wave3-5-preview','roadmap-c-trade-silverfinch-jeweler'],
 ['wave3-5-bookshop','r2:bookshop:temperate:small:02','wave5-wrenfield-bookshop.mjs','wave3-5-preview','roadmap-c-trade-wrenfield-bookshop'],
 ['wave6-winterglass','r2:market-square:snow:small:03','wave6-winterglass-snow-market.mjs','wave6-winterglass-preview','roadmap-c-trade-winterglass-snow-market']
];
test('all six trade source-specific CDP tests use the same exact source module, preview, screenshot folder, CRC audit and ZIP uploader',async()=>{
 const p='tests/building-pool/roadmap-c-trades/';
 const audit=await load(p+'c-evidence-png-integrity.test.mjs');
 const workflow=await load('.github/workflows/roadmap-c-trade-webgl2.yml');
 const ids=new Set(),dirs=new Set();
 for(const [stem,id,source,preview,dir] of specs){
  assert.ok(!ids.has(id)&&!dirs.has(dir),'duplicate original trade source ID or capture directory');
  ids.add(id);dirs.add(dir);
  const sourcePath='src/building-pool/roadmap-c-trades/'+source;
  const script=await load(p+stem+'-chromium.test.mjs');
  const html=await load(p+preview+'.html');
  const js=await load(p+preview+'.mjs');
  assert.ok(script.includes("id='"+id+"'"),'Chromium is capturing the wrong source identity: '+stem);
  assert.ok(script.includes("const output=resolve('artifacts/"+dir+"/chromium-webgl2-source')"),
   'Chromium output folder disagrees with CRC artifact path: '+stem);
  assert.ok(script.includes("const sourceModulePath='"+sourcePath+"'"),
   'manifest source-module SHA256 does not correspond to original blueprint: '+stem);
  assert.ok(script.includes("/"+preview+".html?id="),
   'Chromium is opening a different preview than its original source: '+stem);
  assert.ok(html.includes('./'+preview+'.mjs'),
   'HTML loads wrong renderer source module: '+stem);
  assert.ok(js.includes('../../../'+sourcePath),
   'rendering is not derived from original source file: '+stem);
  assert.ok(js.includes("params.get('id')")&&js.includes('models.find'),
   'renderer does not select the exact source identity from the browser URL: '+stem);
  assert.ok(audit.includes("['"+dir+"','"+id+"','"+sourcePath+"']"),
   'PNG independent CRC audit source identity, bytes or screenshot folder mismatch: '+stem);
  assert.ok(workflow.includes('node --test '+p+stem+'-chromium.test.mjs'),
   'genuine Chromium screenshot script not executed by trade acceptance workflow: '+stem);
  assert.ok(workflow.includes('artifacts/'+dir+'/'),
   'real ZIP uploader does not contain expected source evidence: '+stem);
 }
 assert.equal(ids.size,6);assert.equal(dirs.size,6);
 assert.ok(audit.includes('assert.equal(global.size,36);assert.equal(total,36);'));
 assert.ok(workflow.includes('c-evidence-png-integrity.test.mjs'));
});
