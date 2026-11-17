import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BIOMES,SIZES} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {createLegacyBlacksmith} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera,projectPoint} from './preview-camera.mjs';
const viewports=[[667,375],[844,390],[932,430]];
test('30 source-authored diagnostic envelopes: 15 exterior + 15 cutaways, no synthetic stand-in buildings',()=>{
 let cases=0;
 for(const biome of BIOMES)for(const size of SIZES){
   const authored=createLegacyBlacksmith(biome,size);
   const modelCells=authored.modules.reduce((n,m)=>n+m.cells.length,0);
   for(const cutaway of [false,true]){
     const m=createPreviewMesh(authored,{cutaway});
     assert.equal(m.isDiagnosticEnvelope,true);
     assert.equal(m.notAssetShapeProof,true);
     assert.equal(m.cutaway,cutaway);
     assert.ok(m.vertices instanceof Float32Array);
     assert.equal(m.vertices.length,m.triangleCount*3*6);
     assert.ok(m.triangleCount>30&&m.triangleCount<=25000);
     assert.ok(m.sourceCells>300&&m.sourceCells<=modelCells);
     assert.ok([...m.vertices].every(Number.isFinite));
     cases++;
   }
 }
 assert.equal(cases,30);
});
test('90 source-geometry projection checks at the three requested iPhone-like landscape viewports',()=>{
 let views=0;
 for(const biome of BIOMES)for(const size of SIZES){
  const b=createLegacyBlacksmith(biome,size);
  for(const cutaway of [false,true]){
   const mesh=createPreviewMesh(b,{cutaway});
   for(const [w,h] of viewports){
    const camera=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
    assert.equal(camera.matrix.length,16);
    assert.ok(camera.matrix.every(Number.isFinite));
    assert.ok(camera.projectedHalfWidth<=1&&camera.projectedHalfHeight<=1);
    views++;
   }
  }
 }
 assert.equal(views,90);
});
test('preview is blacksmith-only and does not disguise cube proxies as integrated asset shapes',()=>{
 const source=readFileSync(new URL('./preview.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('./preview.html',import.meta.url),'utf8');
 const runner=readFileSync(new URL('./preview-browser.mjs',import.meta.url),'utf8');
 assert.match(source,/createLegacyBlacksmith\(biome,size\)/);
 assert.doesNotMatch(html,/watchtower/i);
 assert.match(html,/Diagnostic cube envelopes/);
 assert.match(runner,/completed!==90/);
 assert.match(source,/canvas\.getContext\('webgl2'/);
});
