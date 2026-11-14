import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
const path=new URL('../../../docs/building-pool/roadmap-3/M1_MANIFEST.json',import.meta.url);
const manifest=JSON.parse(readFileSync(path,'utf8'));
const pool=createM1Pool();
test('committed M1 manifest declares thirty non-live design identities',()=>{
 assert.equal(manifest.schema,'mythwrought.building-roadmap-3.m1-review.v1');
 assert.equal(manifest.m1Authored,30);
 assert.equal(manifest.designSlots,705);
 assert.equal(manifest.productionIntegrated,false);
 assert.equal(manifest.designs.length,30);
 assert.equal(new Set(manifest.designs.map(d=>d.id)).size,30);
 assert.ok(manifest.designs.every(d=>d.status==='THEORETICAL_UNMERGED'));
});
test('manifest coordinates and profiles match exact generated full 3D blueprints',()=>{
 let count=0;
 for(let i=0;i<pool.length;i++){
  const b=pool[i],d=manifest.designs[i];
  assert.equal(d.id,b.id);
  assert.deepEqual(d.envelope,b.envelope);
  assert.equal(d.occupiedCoordinates,b.architecture.physicalCellSlots);
  assert.equal(d.stairSteps,b.architecture.stairSteps??0);
  assert.equal(d.roofStyle,b.architecture.roofStyle);
  count+=d.occupiedCoordinates;
 }
 assert.equal(count,70921);
 assert.equal(count,manifest.coordinateSlots);
});
test('canonical blueprints remain JSON roundtrip exact and save schema independent',()=>{
 for(const b of pool){
  const json=JSON.stringify(b);
  assert.deepEqual(JSON.parse(json),b);
  assert.equal(b.activated,false);
  assert.match(b.implementation,/CONCEPT_ONLY/);
 }
});
