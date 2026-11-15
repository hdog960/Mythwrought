import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
test('four source-authored M1 workshops create eight nonblank exterior/cutaway meshes',()=>{
 let count=0;
 for(const b of createM1OriginalWorkshopPool())for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  assert.ok(m.vertices.length>3000);
  assert.ok(m.triangleCount>100&&m.triangleCount<25000);
  assert.ok(m.vertices.every(Number.isFinite));
  assert.ok(m.sourceCells>300);
  assert.equal(m.isDiagnosticEnvelope,true);
  assert.equal(m.notAssetShapeProof,true);
  count++;
 }
 assert.equal(count,8);
});
test('four distinct original workshop camera bounds fit three mobile landscape resolutions (24 projections)',()=>{
 let n=0;
 for(const b of createM1OriginalWorkshopPool())for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,m.vertices,width,height);
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);
   n++;
  }
 }
 assert.equal(n,24);
});
test('browser source selects only the four original candidate types; no live placement claims',()=>{
 const html=readFileSync(new URL('./preview-new.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('./preview-new.mjs',import.meta.url),'utf8');
 const runner=readFileSync(new URL('./preview-new-browser.mjs',import.meta.url),'utf8');
 for(const type of ['armorer','carpenter','stonemason','mining-workshop'])
  assert.ok(html.includes('value="'+type+'"'));
 assert.doesNotMatch(html,/<option value="watchtower">/);
 assert.match(js,/createM1OriginalWorkshop\(type\)/);
 assert.match(runner,/completed!==24/);
 assert.match(html,/Diagnostic cube envelopes/);
});
