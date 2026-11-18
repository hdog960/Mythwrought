import test from 'node:test';
import assert from 'node:assert/strict';
import {BLUEPRINT_ABI,MAX_PREVIEW_VOXELS,MAX_VISIBLE_ROWS,inspectBlueprintAdapter,screenBlueprintSnapshot,filterBlueprints,virtualBlueprintWindow} from '../../src/creative-mode/blueprint-browser.mjs';
import {syntheticBlueprintSnapshot} from '../../src/creative-mode/blueprint-fixture.mjs';
const example=()=>syntheticBlueprintSnapshot(20);
const edit=(index,field,value)=>{const s=example();s.records[index]={...s.records[index],[field]:value};return s;};
test('M7 ABI is a read-only detached adapter regardless of mock completeness',()=>{
 assert.equal(BLUEPRINT_ABI,'mythwrought.creative.blueprint-browser.v1');
 const empty=inspectBlueprintAdapter();assert.equal(empty.shapeValid,false);assert.equal(empty.runtimeIntegrated,false);
 const mock=inspectBlueprintAdapter({listReadyBlueprints:()=>[],provenance:'accepted-blueprint-registry',worldSchema:1});
 assert.equal(mock.shapeValid,true);assert.equal(mock.runtimeIntegrated,false);assert.equal(mock.readOnly,true);
});
test('registry provenance, revision, envelope and record limits fail closed',()=>{
 for(const s of [null,{}, {...example(),provenance:'building-pool-drafts'},{...example(),registryRevision:0},{...example(),records:'fake'},
  {...example(),records:new Array(4097).fill(null)}])assert.throws(()=>screenBlueprintSnapshot(s),/Untrusted|oversized/);
});
test('structurally accepted, source-authored and dependency-resolved fixture entries only',()=>{
 const v=screenBlueprintSnapshot(example());assert.equal(v.acceptedCount,17);assert.equal(v.excludedCount,3);
 assert.equal(v.fixture,true);assert.equal(v.runtimeIntegrated,false);assert.equal(v.readOnly,true);
 assert.ok(v.records.every(r=>Object.isFrozen(r)&&Object.isFrozen(r.previewCells)));
 assert.deepEqual(v.excluded.map(e=>e.reason),['draft-excluded','creator-approval-missing','missing-dependency']);
});
test('drafts, unmerged source, missing creator acceptance and unverified geometry cannot appear',()=>{
 const modifications=[['status','draft'],['sourceState','unmerged'],['approval',{status:'pending',authority:'creator',decisionId:'fixture:pending'}],
  ['approval',{status:'accepted',authority:'builder',decisionId:'fixture:builder'}],['geometry',{coordinateAuthored:false,fingerprint:'a'.repeat(64),previewCells:[{x:0,y:0,z:0,type:'wall'}]}]];
 for(const [field,value] of modifications){const s=edit(4,field,value);const v=screenBlueprintSnapshot(s);assert.ok(!v.records.some(r=>r.id===s.records[4].id));}
});
test('missing or duplicated dependencies fail closed without leaking the blueprint',()=>{
 const s=example(),record=s.records[4];record.dependencies.resolved=[];
 assert.equal(screenBlueprintSnapshot(s).excluded.find(x=>x.id===record.id).reason,'missing-dependency');
 const t=example();t.records[4].dependencies.required.push(t.records[4].dependencies.required[0]);
 assert.equal(screenBlueprintSnapshot(t).excluded.find(x=>x.id===t.records[4].id).reason,'duplicate-dependency');
});
test('malformed and unsafe source preview geometry is rejected',()=>{
 const variants=[null,[],Array.from({length:MAX_PREVIEW_VOXELS+1},(_,i)=>({x:i,y:0,z:0,type:'roof'})),
  [{x:64,y:0,z:0,type:'roof'}],[{x:0,y:0,z:0,type:'unknown'}],
  [{x:0,y:0,z:0,type:'roof'},{x:0,y:0,z:0,type:'wall'}]];
 for(const cells of variants){const s=example();s.records[4].geometry.previewCells=cells;const v=screenBlueprintSnapshot(s);
  assert.ok(!v.records.some(x=>x.id===s.records[4].id));}
});
test('duplicate source IDs poison entire registry, including excluded draft records',()=>{
 const s=example();s.records[5].id=s.records[1].id;
 assert.throws(()=>screenBlueprintSnapshot(s),/Duplicate blueprint identity/);
});
test('search and category/biome/size filters operate solely on eligible items',()=>{
 const s=screenBlueprintSnapshot(syntheticBlueprintSnapshot(250));
 assert.equal(s.acceptedCount,247);
 const q=filterBlueprints(s,{query:'synthetic snow',biome:'snow',limit:12});
 assert.ok(q.total>0&&q.items.every(x=>x.biome==='snow'));
 const w=filterBlueprints(s,{kind:'arcane',size:'medium',limit:12});
 assert.ok(w.items.every(x=>x.kind==='arcane'&&x.size==='medium'));
 assert.equal(filterBlueprints(s,{query:'draft',limit:12}).total,0);
});
test('oversized, invalid, or adversarial query windows fail closed',()=>{
 const s=screenBlueprintSnapshot(example());
 for(const args of [{offset:-1},{limit:21},{limit:0},{query:7},{query:'x'.repeat(201)},{biome:'foobar'}])
  assert.throws(()=>filterBlueprints(s,args));
 for(const args of [[-1,42,170],[0,0,170],[0,42,0]])assert.throws(()=>virtualBlueprintWindow(s,{},...args));
});
test('4096-input fixture screen and 3000-item filtered virtualized window stay bounded',()=>{
 const s=screenBlueprintSnapshot(syntheticBlueprintSnapshot(3000));
 assert.equal(s.acceptedCount,2997);
 const v=virtualBlueprintWindow(s,{},2300,40,240);
 assert.ok(v.items.length<=MAX_VISIBLE_ROWS);
 assert.equal(v.items.length,9);
 assert.equal(v.offset,56);
 assert.equal(v.topSpacer,2240);
 assert.ok(v.bottomSpacer>0);
});
test('empty approved registry is legitimate and shows no fabricated buildings',()=>{
 const s=screenBlueprintSnapshot(syntheticBlueprintSnapshot(0));
 assert.equal(s.acceptedCount,0);assert.equal(filterBlueprints(s).total,0);
});
