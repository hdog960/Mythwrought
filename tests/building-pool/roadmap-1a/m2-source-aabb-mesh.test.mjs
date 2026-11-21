import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2HousingWave2} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {makeM2SourceAABBMesh} from './m2-source-aabb-mesh.mjs';
const choose=['temperate','desert','snow','enchanted-forest','mountain']
 .map(biome=>getM2HousingWave2().find(b=>b.biome===biome&&b.size==='small'));
test('five actual Pack source-visible-box diagnostic meshes, one small house per biome',()=>{
 assert.equal(choose.length,5);
 for(const b of choose){
  const mesh=makeM2SourceAABBMesh(b);
  assert.equal(mesh.renderer,'CHROMIUM_WEBGL2_SOURCE_PACK_VISIBLE_AABB_CANDIDATE_DIAGNOSTIC');
  assert.equal(mesh.sourcePackVisibleAABBsRendered,true);
  assert.equal(mesh.realPackTexturesRendered,false);
  assert.equal(mesh.finalCollisionAndSupportApproved,false);
  assert.equal(mesh.worldPlaced,false);assert.equal(mesh.saveStateReplayed,false);
  assert.equal(mesh.sourceCells,b.placements.length);
  assert.ok(mesh.sourcePackVisibleBoxes>20);
  assert.ok(mesh.triangles>0);
  assert.equal(mesh.vertices.length,mesh.triangles*18);
  assert.ok(mesh.vertices.every(Number.isFinite));
 }
});
test('Pack source cutaways retain full source identity but display fewer placements',()=>{
 for(const b of choose){
  const original=makeM2SourceAABBMesh(b);
  const cut=makeM2SourceAABBMesh(b,{cutaway:true});
  assert.equal(cut.sourceCells,original.sourceCells);
  assert.ok(cut.displayedCells<original.displayedCells);
  assert.ok(cut.triangles<original.triangles);
  assert.equal(cut.sourcePackVisibleAABBsRendered,true);
 }
});
