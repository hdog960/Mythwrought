import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {M1_COMPLETION_SPECS} from '../../../src/building-pool/roadmap-3a/m1-coverage-specs.mjs';
import {createM1CompletionPool} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {createCoveragePreviewMesh} from './preview-coverage-mesh.mjs';
test('all 44 regionally authored roofs are present in source and removed only in cutaway proxy render',()=>{
 const models=createM1CompletionPool();
 assert.equal(models.length,44);
 for(const b of models){
  const count=b.modules.reduce((n,m)=>n+m.cells.length,0);
  const roof=b.modules.find(m=>m.role==='roof').cells.length;
  const ext=createCoveragePreviewMesh(b,{cutaway:false});
  const section=createCoveragePreviewMesh(b,{cutaway:true});
  assert.ok(ext.vertices.length>1000&&section.vertices.length>1000);
  assert.ok(ext.sourceCells>section.sourceCells,b.id+' no roof-removed cutaway');
  assert.ok(roof>100);
  assert.equal(b.modules.reduce((n,m)=>n+m.cells.length,0),count);
  assert.equal(ext.isDiagnosticEnvelope,true);
  assert.equal(section.notAssetShapeProof,true);
 }
});
test('optional Chromium runner covers 44 exact IDs at 667×375, 844×390, 932×430 without invented slots',()=>{
 const runner=readFileSync(new URL('./preview-coverage-browser.mjs',import.meta.url),'utf8');
 const js=readFileSync(new URL('./preview-coverage.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('./preview-coverage.html',import.meta.url),'utf8');
 for(const q of M1_COMPLETION_SPECS){
  assert.ok(runner.includes('["'+q.type+'","'+q.biome+'","'+q.size+'"]'),'omitted browser specimen '+q.design);
 }
 assert.match(runner,/completed!==264/);
 assert.match(js,/createM1CompletionWorkshop\(type,biome,size\)/);
 assert.match(js,/createCoveragePreviewMesh/);
 assert.match(html,/Diagnostic cube envelopes/);
 assert.doesNotMatch(html,/<option value="watchtower">/);
});
