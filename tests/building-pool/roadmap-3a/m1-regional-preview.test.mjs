import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createM1RegionalPool,M1_REGIONAL_SPECS} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createRegionalPreviewMesh} from './preview-regional-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
test('regional cutaway hides roofs only in diagnostic mesh; source roof geometry stays unchanged',()=>{
 for(const b of createM1RegionalPool()){
  const before=b.modules.reduce((n,m)=>n+m.cells.length,0);
  const roof=b.modules.find(m=>m.role==='roof');
  assert.ok(roof&&roof.cells.length>100);
  const exterior=createRegionalPreviewMesh(b,{cutaway:false});
  const cut=createRegionalPreviewMesh(b,{cutaway:true});
  assert.ok(exterior.triangleCount>0&&cut.triangleCount>0);
  assert.ok(exterior.vertices.every(Number.isFinite));
  assert.ok(cut.vertices.every(Number.isFinite));
  assert.ok(cut.sourceCells<exterior.sourceCells);
  assert.ok(b.modules.find(m=>m.role==='roof').cells.length===roof.cells.length);
  assert.equal(b.modules.reduce((n,m)=>n+m.cells.length,0),before);
  assert.equal(exterior.isDiagnosticEnvelope,true);
  assert.equal(cut.notAssetShapeProof,true);
 }
});
test('72 viewport-accurate regional 3D cameras fit real authored geometry',()=>{
 let n=0;
 for(const b of createM1RegionalPool())for(const cutaway of [false,true]){
  const m=createRegionalPreviewMesh(b,{cutaway});
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,m.vertices,w,h);
   assert.ok(c.projectedHalfWidth<1&&c.projectedHalfHeight<1);
   n++;
  }
 }
 assert.equal(n,72);
});
test('optional authentic Chromium runner targets all and ONLY twelve source-authored models',()=>{
 const html=readFileSync(new URL('./preview-regional.html',import.meta.url),'utf8');
 const script=readFileSync(new URL('./preview-regional.mjs',import.meta.url),'utf8');
 const runner=readFileSync(new URL('./preview-regional-browser.mjs',import.meta.url),'utf8');
 for(const s of M1_REGIONAL_SPECS){
  assert.ok(runner.includes('["'+s.type+'","'+s.biome+'","'+s.size+'"]'));
 }
 assert.match(script,/createM1RegionalWorkshop\(type,biome,size\)/);
 assert.match(script,/createRegionalPreviewMesh/);
 assert.match(html,/Diagnostic cube envelopes/);
 assert.match(runner,/completed!==72/);
 assert.doesNotMatch(html,/<option value="watchtower">/);
});
