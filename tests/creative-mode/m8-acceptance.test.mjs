// Roadmap 9 M8: independent acceptance evidence, not runtime activation.
// This suite is reachable from unchanged npm test through feature-owned root bridge.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname,resolve,relative,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {CREATIVE_ENABLED_BY_DEFAULT,CREATIVE_ADAPTER_ABI,inspectCreativePorts,validateRegisteredPlaceables} from '../../src/creative-mode/adapter-contract.mjs';
import {UX_SAMPLE_ITEMS,initialCreativeUxState} from '../../src/creative-mode/ux-state.mjs';
import {FLIGHT_PROFILES,MAX_PREFETCH_PENDING,MAX_PREFETCH_PER_STEP} from '../../src/creative-mode/flight-model.mjs';
import {createInventoryState,replaceInventorySnapshot,virtualInventoryWindow,stablePlaceableKey} from '../../src/creative-mode/inventory-model.mjs';
import {makeInventoryContractFixture} from '../../src/creative-mode/inventory-fixture.mjs';
import {MAX_BATCH_EDITS,MAX_WORLD_CELLS,MAX_SHAPE_CELLS,MAX_REFRESH_CHUNKS} from '../../src/creative-mode/build-model.mjs';
import {DEFAULT_HISTORY_LIMIT,MAX_HISTORY_LIMIT} from '../../src/creative-mode/history-model.mjs';
import {DETACHED_SAVE_KEYS,PRODUCTION_SCHEMA_COMPATIBILITY,createDetachedMemoryStore} from '../../src/creative-mode/save-compat.mjs';
import {MAX_SELECTION_CELLS,MAX_TOOL_ACTIONS,MAX_SELECTION_SPAN} from '../../src/creative-mode/advanced-tools.mjs';
import {BLUEPRINT_ABI,MAX_PREVIEW_VOXELS,MAX_VISIBLE_ROWS,inspectBlueprintAdapter,screenBlueprintSnapshot,filterBlueprints} from '../../src/creative-mode/blueprint-browser.mjs';
import {syntheticBlueprintSnapshot} from '../../src/creative-mode/blueprint-fixture.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const features=resolve(ROOT,'src/creative-mode');
const baseline=JSON.parse(readFileSync(resolve(ROOT,'tests/creative-mode/m8-baseline.json'),'utf8'));
const read=path=>readFileSync(resolve(ROOT,path),'utf8');
function gitBlob(path){const contents=readFileSync(resolve(ROOT,path));return createHash('sha1').update(`blob ${contents.length}\0`).update(contents).digest('hex');}

test('M8 immutable 50-file baseline is the exact successful M7 PR-head Git tree',()=>{
 assert.equal(baseline.baselineHead,'74c75e548b31406ccd68a1c8d07c1215ab4cb24e');
 assert.equal(baseline.baselineTree,'643821527c38ce73ada7118f70c7cf332c72c547');
 assert.equal(Object.keys(baseline.blobHashes).length,50);
 for(const [path,expected] of Object.entries(baseline.blobHashes)){
  assert.match(expected,/^[0-9a-f]{40}$/);
  assert.equal(gitBlob(path),expected,`M0–M7 source/test changed: ${path}`);
 }
});
test('all 50 inherited code/test filenames respect feature ownership',()=>{
 const paths=Object.keys(baseline.blobHashes);
 assert.equal(new Set(paths).size,paths.length);
 assert.ok(paths.every(path=>/^(src\/creative-mode\/|tests\/creative-mode\/|tests\/creative-mode-m\d+\.test\.mjs$)/.test(path)));
 assert.ok(paths.every(path=>!path.includes('..')));
});
test('every source ESM import closes inside the private Creative Mode directory',()=>{
 const paths=Object.keys(baseline.blobHashes).filter(p=>p.startsWith('src/creative-mode/')&&p.endsWith('.mjs'));
 assert.ok(paths.length>=15);
 for(const path of paths){
  const code=read(path),regex=/\b(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while((match=regex.exec(code))){
   const specifier=match[1];
   assert.ok(specifier.startsWith('./'),`Non-feature import: ${path}: ${specifier}`);
   const target=resolve(dirname(resolve(ROOT,path)),specifier);
   assert.ok(target.startsWith(features+'/'),`Escaped source ownership: ${path}: ${specifier}`);
   assert.equal(extname(target),'.mjs');
   assert.ok(readFileSync(target).length>0,`Missing private import target: ${target}`);
  }
 }
});
test('private preview documents expose local-only script and stylesheet references',()=>{
 const pages=['preview.html','build-preview.html','history-preview.html','tools-preview.html','blueprint-preview.html'];
 for(const p of pages){
  const html=read('src/creative-mode/'+p);
  assert.doesNotMatch(html,/\b(?:src|href)\s*=\s*['"](?:https?:|\/\/)/i,`Remote resource in ${p}`);
  assert.match(html,/viewport-fit=cover/,`Safe area viewport missing in ${p}`);
  assert.match(html,/\.\/.*\.mjs/);
 }
});
test('no production runtime or network dependency is activated through source entry points',()=>{
 const paths=Object.keys(baseline.blobHashes).filter(p=>p.startsWith('src/creative-mode/')&&p.endsWith('.mjs'));
 for(const p of paths){
  const script=read(p).replace(/^\s*\/\/.*$/gm,'');
  assert.doesNotMatch(script,/\bfetch\s*\(/,`Network access in ${p}`);
  assert.doesNotMatch(script,/\b(?:localStorage|indexedDB|serviceWorker)\s*\./,`Production storage/PWA access in ${p}`);
 }
});
test('M0 remains explicitly disabled even when mock port shape passes',()=>{
 assert.equal(CREATIVE_ENABLED_BY_DEFAULT,false);
 assert.equal(CREATIVE_ADAPTER_ABI,'mythwrought.creative.adapters.v1');
 const absent=inspectCreativePorts(null);
 assert.equal(absent.enabled,false);assert.equal(absent.runtimeIntegrated,false);assert.equal(absent.shapeValid,false);
});
test('M1 preview samples remain unregistered and non-placeable',()=>{
 assert.equal(initialCreativeUxState().mode,'explore');
 assert.equal(UX_SAMPLE_ITEMS.length,4);
 assert.ok(UX_SAMPLE_ITEMS.every(r=>r.previewOnly===true&&r.registered===false&&r.placeable===false));
});
test('M2 flight budgets and speed profiles remain bounded and detached',()=>{
 assert.deepEqual(Object.keys(FLIGHT_PROFILES),['precision','normal','fast','travel']);
 assert.equal(MAX_PREFETCH_PER_STEP,2);assert.equal(MAX_PREFETCH_PENDING,6);
 assert.ok(FLIGHT_PROFILES.travel>FLIGHT_PROFILES.fast);
});
test('M3 fixture data cannot be interpreted as an authoritative production adapter',()=>{
 const fixture=makeInventoryContractFixture(1632);
 assert.ok(fixture.every(r=>r.syntheticFixture===true));
 assert.equal(createInventoryState().items.length,0);
 assert.throws(()=>validateRegisteredPlaceables([{...fixture[0],registered:false}]),/Unregistered/);
 assert.throws(()=>replaceInventorySnapshot(createInventoryState(),[fixture[0],fixture[0]]),/Duplicate/);
 const win=virtualInventoryWindow(5600,9000,192);
 assert.ok(win.rendered<=24);
 assert.notEqual(stablePlaceableKey(1),stablePlaceableKey('1'));
});
test('M4/M5/M6 edit, shape, history and selection budgets remain capped',()=>{
 assert.equal(MAX_BATCH_EDITS,24);assert.equal(MAX_SHAPE_CELLS,16);
 assert.ok(MAX_WORLD_CELLS<=512);assert.ok(MAX_REFRESH_CHUNKS<=48);
 assert.equal(DEFAULT_HISTORY_LIMIT,32);assert.equal(MAX_HISTORY_LIMIT,64);
 assert.equal(MAX_TOOL_ACTIONS,MAX_BATCH_EDITS);
 assert.equal(MAX_SELECTION_CELLS,216);assert.equal(MAX_SELECTION_SPAN,12);
});
test('M5 uses a namespaced memory-only save driver, never production storage keys',()=>{
 assert.equal(PRODUCTION_SCHEMA_COMPATIBILITY,1);
 const keys=Object.values(DETACHED_SAVE_KEYS);
 assert.equal(new Set(keys).size,3);
 assert.ok(keys.every(k=>k.startsWith('mythwrought.creative.detached.m5.')));
 const store=createDetachedMemoryStore();
 store.write(keys[0],'test');assert.equal(store.read(keys[0]),'test');
 assert.equal(store.read(keys[1]),null);
});
test('M7 adapter shape cannot attest creator acceptance or runtime integration',()=>{
 const missing=inspectBlueprintAdapter();
 assert.equal(missing.shapeValid,false);assert.equal(missing.readOnly,true);
 const mock=inspectBlueprintAdapter({listReadyBlueprints:()=>[],provenance:'accepted-blueprint-registry',worldSchema:1});
 assert.equal(mock.shapeValid,true);assert.equal(mock.runtimeIntegrated,false);
 assert.equal(BLUEPRINT_ABI,'mythwrought.creative.blueprint-browser.v1');
});
test('M7 draft, missing dependency, and unapproved examples never appear eligible',()=>{
 const sample=syntheticBlueprintSnapshot(300);
 const result=screenBlueprintSnapshot(sample);
 assert.equal(result.acceptedCount,297);assert.equal(result.excludedCount,3);
 assert.equal(result.fixture,true);assert.equal(result.runtimeIntegrated,false);assert.equal(result.readOnly,true);
 assert.ok([1,2,3].every(i=>!result.records.some(r=>r.id===sample.records[i].id)));
 assert.ok(result.records.every(r=>r.previewCells.length<=MAX_PREVIEW_VOXELS));
 assert.ok(filterBlueprints(result,{query:'structure-0001'}).total===0);
 assert.ok(filterBlueprints(result,{query:'structure-0003'}).total===0);
});
test('M7 unapproved identity duplicates reject the entire feed, not just one row',()=>{
 const sample=syntheticBlueprintSnapshot(12);
 sample.records[7].id=sample.records[1].id;
 assert.throws(()=>screenBlueprintSnapshot(sample),/Duplicate blueprint identity/);
});
test('M7 list virtualization and previews remain limited even for thousands of mock entries',()=>{
 const catalog=screenBlueprintSnapshot(syntheticBlueprintSnapshot(3000));
 assert.equal(catalog.acceptedCount,2997);
 assert.ok(filterBlueprints(catalog,{offset:0,limit:MAX_VISIBLE_ROWS}).items.length<=20);
 assert.throws(()=>filterBlueprints(catalog,{limit:21}),RangeError);
 assert.throws(()=>screenBlueprintSnapshot({abi:BLUEPRINT_ABI,provenance:'untrusted',registryRevision:1,records:[]}),/Untrusted/);
});
