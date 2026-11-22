// Original VoxelWorld read-only V8 four-atlas acceptance. Never dispatches V8.
// The atlas coordinates were selected with authenticated V6 climate and
// original terrainHeight, and are revalidated against REAL source blocks here.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {VoxelWorld,meshChunk} from '../src/voxel.mjs';
import {censusMountainV8Tiles} from '../src/manual-biomes/mountain-v8-tile-census.mjs';

const ATLASES=Object.freeze([
  Object.freeze({seed:179,tileX:-88,tileZ:24,label:'snow-dominant'}),
  Object.freeze({seed:179,tileX:-80,tileZ:-8,label:'meadow-rock-mixed'}),
  Object.freeze({seed:2026,tileX:-48,tileZ:-8,label:'snow-dominant'}),
  Object.freeze({seed:2026,tileX:-80,tileZ:-24,label:'meadow-rock-mixed'})
]);
const sum=(rows,key)=>rows.reduce((n,r)=>n+r.stats[key],0);
const count=(items)=>Object.values(items).reduce((a,b)=>a+b,0);
const reasons=(rows,key)=>Object.fromEntries(
  Object.keys(rows[0].stats[key]).map(reason=>[
    reason,rows.reduce((n,r)=>n+r.stats[key][reason],0)
  ])
);
const digest=mesh=>createHash('sha256')
  .update(Buffer.from(mesh.buffer,mesh.byteOffset,mesh.byteLength)).digest('hex');
test('four genuinely generated 64-tile alpine atlases retain diverse safe geometry and original V7 mesh',()=>{
  const reports=[];
  const snapshots=[];
  for(const {seed,tileX,tileZ,label} of ATLASES){
    const world=new VoxelWorld(seed);
    const saveBefore=JSON.stringify(world.save());
    // Original 9-float terrain vertex layout, never a predicted V8 GPU draw.
    const cx=Math.floor((tileX*8+32)/16);
    const cz=Math.floor((tileZ*8+32)/16);
    const originalMesh=meshChunk(world,cx,cz);
    const originalHash=digest(originalMesh);
    const started=performance.now();
    const report=censusMountainV8Tiles({seed,tileX,tileZ,
      width:8,height:8,world});
    const elapsedMs=Number((performance.now()-started).toFixed(3));
    assert.ok(report,seed+' '+label+' source census refused');
    assert.equal(report.stats.tiles,64);
    assert.equal(report.stats.seen,64);
    assert.equal(report.stats.eligible+report.stats.rejected+
      report.stats.terrainRejected+report.stats.seamRejected,64);
    assert.ok(report.stats.sourceSites<=576);
    assert.equal(report.stats.sourceBudgetExhausted,0);
    assert.ok(report.stats.plants<=report.stats.eligible);
    assert.ok(report.stats.plantCells<=18*report.stats.plants);
    assert.ok(report.stats.terrainCells<=18*report.stats.eligible);
    assert.ok(report.stats.seamExposedFaces<=8*report.stats.eligible);
    assert.equal(count(report.stats.seamVetoReasons),report.stats.seamRejected);
    assert.equal(count(report.stats.rootSourceVetoReasons),report.stats.rejected);
    assert.equal(count(report.stats.seamSourceVetoReasons),
      report.stats.seamVetoReasons.biomeBoundary+
      report.stats.seamVetoReasons.sourceUnavailableInMountain);
    assert.ok(report.stats.meadow+report.stats.snow+report.stats.rock===
      report.stats.eligible);
    assert.equal(JSON.stringify(world.save()),saveBefore,
      'Source census changed original schema-1 save');
    assert.equal(world.edits.size,0);
    assert.equal(world.rotations.size,0);
    const afterMesh=meshChunk(world,cx,cz);
    assert.equal(afterMesh.byteLength,originalMesh.byteLength,
      'Source census changed the original V7 mesh byte count');
    assert.equal(digest(afterMesh),originalHash,
      'Source census changed original V7 mesh vertices');
    // Bounded theoretical maximum if EACH proposed cell were a separate,
    // fully exposed cube: 6 faces * 6 vertices * 9 floats * 4 bytes.
    // This is NOT measured V8 GPU use (registry and meshing not approved).
    const proposedCellLimitBytes=(report.stats.terrainCells+
      report.stats.plantCells)*6*6*9*4;
    assert.ok(proposedCellLimitBytes<=64*36*1296);
    snapshots.push({seed,label,originalV7MeshBytes:originalMesh.byteLength,
      originalV7MeshSHA256:originalHash,proposedCellLimitBytes});
    reports.push(report);
    console.log('MOUNTAIN V8 ORIGINAL 64-TILE ATLAS '+JSON.stringify({
      seed,label,tileX,tileZ,elapsedMs,...report.stats,
      originalV7MeshBytes:originalMesh.byteLength,
      originalV7MeshSHA256:originalHash,proposedCellLimitBytes,
      preservedSchema1:true}));
  }
  for(const seed of [179,2026]){
    const own=reports.filter(r=>r.seed===seed);
    const eligible=sum(own,'eligible');
    assert.ok(eligible>0,'No original-world mountain terrain admitted at seed '+seed);
    assert.ok(sum(own,'snow')>0,'No original-world snowy mountains at seed '+seed);
    assert.ok(sum(own,'rock')>0,'No original-world rocky mountains at seed '+seed);
    assert.ok(sum(own,'meadow')>0,'No original-world alpine meadows at seed '+seed);
    assert.ok(sum(own,'cliff')>0,'No original-world rocky cliffs at seed '+seed);
    assert.ok(sum(own,'plants')>0,'No sparse original-world plant sites at seed '+seed);
    console.log('MOUNTAIN V8 ORIGINAL TWO-ATLAS SUMMARY '+JSON.stringify({
      seed,tiles:128,eligible,snow:sum(own,'snow'),
      meadow:sum(own,'meadow'),rock:sum(own,'rock'),
      cliff:sum(own,'cliff'),plants:sum(own,'plants'),
      plantCells:sum(own,'plantCells'),
      terrainCells:sum(own,'terrainCells'),
      seamExposedFaces:sum(own,'seamExposedFaces'),
      terrainRejected:sum(own,'terrainRejected'),
      seamRejected:sum(own,'seamRejected'),
      sourceRejected:sum(own,'rejected'),
      sourceSites:sum(own,'sourceSites'),
      sourceCacheHits:sum(own,'sourceCacheHits'),
      seamVetoReasons:reasons(own,'seamVetoReasons'),
      rootSourceVetoReasons:reasons(own,'rootSourceVetoReasons'),
      seamSourceVetoReasons:reasons(own,'seamSourceVetoReasons'),
      unchangedOriginalChunkMeshes:2}));
  }
  assert.equal(snapshots.length,4);
});
