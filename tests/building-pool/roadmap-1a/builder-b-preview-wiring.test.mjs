// Builder B fail-closed preview source wiring, no game integration.
// Static native check intentionally catches import losses before Chromium runners are available.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=p=>readFileSync(new URL('../../../'+p,import.meta.url),'utf8');
const gallery=[
 ['builder-b-current-wave-preview.mjs','builder-b-current-wave-preview.html',
 ['builder-b-homes-wave1.mjs','builder-b-hospitality-wave2.mjs','builder-b-inns-wave3.mjs'],
 ['getBuilderBHomesWave1','getBuilderBHospitalityWave2','getBuilderBInnsWave3']],
 ['builder-b-homes-wave4-preview.mjs','builder-b-homes-wave4-preview.html',
 ['builder-b-homes-wave4.mjs'],['getBuilderBHomesWave4']],
 ['builder-b-hospitality-wave5-preview.mjs','builder-b-hospitality-wave5-preview.html',
 ['builder-b-hospitality-wave5.mjs'],['getBuilderBHospitalityWave5']],
 ['builder-b-homes-wave6-preview.mjs','builder-b-homes-wave6-preview.html',
 ['builder-b-homes-wave6.mjs'],['getBuilderBHomesWave6']],
 ['builder-b-homes-wave7-preview.mjs','builder-b-homes-wave7-preview.html',
 ['builder-b-homes-wave7.mjs'],['getBuilderBHomesWave7']],
 ['builder-b-hospitality-wave8-preview.mjs','builder-b-hospitality-wave8-preview.html',
 ['builder-b-hospitality-wave8.mjs'],['getBuilderBHospitalityWave8']]
];
test('all Builder B 1A source-preview imports resolve to real building and geometry-camera exports',()=>{
 for(const [sourceName,htmlName,sourceFiles,sourceSymbols] of gallery){
  const body=get('tests/building-pool/roadmap-1a/'+sourceName);
  const html=get('tests/building-pool/roadmap-1a/'+htmlName);
  assert.ok(html.includes('src="./'+sourceName+'"'),htmlName+' missing genuine source script');
  for(let i=0;i<sourceFiles.length;i++){
   const source=get('src/building-pool/roadmap-1a/'+sourceFiles[i]);
   assert.ok(source.includes('export function '+sourceSymbols[i]+'('),sourceFiles[i]+' constructor disappeared');
   assert.ok(body.includes('import {'+sourceSymbols[i]+'}'),sourceName+' not importing real constructor');
   assert.ok(body.includes(sourceFiles[i]),sourceName+' incorrect source dependency');
  }
  for(const [symbol,filename] of [
   ['makeM2DiagnosticMesh','m2-preview-mesh.mjs'],
   ['makeM2SourceAABBMesh','m2-source-aabb-mesh.mjs'],
   ['fitM2Camera','m2-preview-camera.mjs']]){
   const helper=get('tests/building-pool/roadmap-1a/'+filename);
   assert.ok(helper.includes('export function '+symbol+'('),'Genuine '+filename+' export missing');
   assert.ok(body.includes('import {'+symbol+'} from \'./'+filename+'\';'),
    'WebGL2 source render crashes because required '+symbol+' import is missing in '+sourceName);
  }
  assert.ok(body.includes("canvas.getContext('webgl2'"),sourceName+' no real WebGL2 context');
  assert.ok(body.includes('makeM2SourceAABBMesh(b,'),sourceName+' no genuine Pack visibleBox renderer');
 }
});
