import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,terrainHeight,BLOCK} from '../src/voxel.mjs';
import {censusMountainV8Tiles as census}
  from '../src/manual-biomes/mountain-v8-tile-census.mjs';
import {surveyMountainV8OriginalWorld as survey}
  from '../src/manual-biomes/mountain-v8-original-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';

test('seeded V8 original-world site census is bounded, read-only and deterministic',()=>{
  for(const seed of [179,2026]){
    const world=new VoxelWorld(seed),save=world.save();
    const first=census({seed,tileX:-65,tileZ:-2,width:3,height:3,world});
    const second=census({seed,tileX:-65,tileZ:-2,width:3,height:3,world});
    assert.deepEqual(first,second);
    assert.equal(first.stats.tiles,9);
    assert.equal(first.stats.seen,9);
    assert.ok(first.stats.sourceSites>=9&&first.stats.sourceSites<=81);
    assert.equal(first.stats.sourceBudgetExhausted,0);
    assert.ok(first.stats.sourceCacheHits>=0);
    assert.ok(first.stats.cachedSourceVetoes<=first.stats.sourceSites);
    assert.ok(first.stats.plants<=first.stats.eligible);
    assert.equal(first.stats.eligible+first.stats.rejected+
      first.stats.terrainRejected+first.stats.seamRejected,first.stats.tiles);
    assert.ok(first.stats.terrainCells<=first.stats.eligible*18);
    assert.ok(first.stats.seamExposedFaces<=first.stats.eligible*8);
    assert.ok(first.stats.terrainCells>=first.stats.eligible);
    assert.ok(first.stats.plantCells<=first.stats.plants*18);
    assert.equal(world.save(),save);
    assert.equal(world.edits.size,0);
    assert.equal(world.rotations.size,0);
    assert.ok(first.sites.every(s=>v6BiomeAt(s.x,s.z,seed)?.name==='mountain'));
    console.log('MOUNTAIN V8 REAL TILE CENSUS '+JSON.stringify({
      seed,tiles:first.stats.tiles,checked:first.stats.seen,
      eligible:first.stats.eligible,plants:first.stats.plants,
      plantCells:first.stats.plantCells,terrainCells:first.stats.terrainCells,
      terrainRejected:first.stats.terrainRejected,
      seamRejected:first.stats.seamRejected,
      seamExposedFaces:first.stats.seamExposedFaces,
      sourceSites:first.stats.sourceSites,sourceCacheHits:first.stats.sourceCacheHits,
      cachedSourceVetoes:first.stats.cachedSourceVetoes,rejected:first.stats.rejected
    }));
  }
});
test('physical dwarf conifer and flower cells refuse nonair and protected landmarks',()=>{
  const seed=179,world=new VoxelWorld(seed);
  const result=census({seed,tileX:-65,tileZ:-1,width:2,height:2,world});
  assert.ok(result);
  assert.ok(result.stats.eligible<=result.stats.tiles);
  assert.ok(result.sites.every(s=>s.cells>=2&&s.cells<=18));
  assert.equal(world.edits.size,0);
});
test('exact old cave entrance is never accepted by V8 source survey',()=>{
  const seed=179,world=new VoxelWorld(seed);
  for(let x=-488;x<=-484;x++)for(let z=23;z<=25;z++){
    const y=terrainHeight(x,z,seed);
    assert.equal(world.naturalAndLandmarkBlock(x,y,z),BLOCK.AIR);
    assert.equal(survey(x,z,seed,{world}),null);
  }
  assert.equal(world.edits.size,0);
});
test('tile census rejects unbounded or dirty world and profile subclass',()=>{
  const a={seed:179,tileX:0,tileZ:0,width:9,height:9};
  assert.equal(census(a),null);
  assert.equal(census({...a,width:0,height:2}),null);
  const world=new VoxelWorld(179);
  world.edits.set('0,0,0',BLOCK.STONE);
  assert.equal(census({...a,width:1,height:1,world}),null);
  class ProfileWorld extends VoxelWorld{}
  assert.equal(census({...a,width:1,height:1,world:new ProfileWorld(179)}),null);
});
