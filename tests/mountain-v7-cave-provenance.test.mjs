// Phase 0 source-coordinate provenance: real built VoxelWorld and V7 world.
// This test does not change caves. It identifies actual rectangular legacy
// entrance voxels before authorizing any mountain geometry cleanup.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {experimentalCaveWorld,caveRoute} from '../src/experimental-cave-route.mjs';
import {planEnvironmentalColumn} from '../src/manual-biomes/environment-v7.mjs';

const SEED=179;
// This entrance belongs to the actual district (-4,0): 128-wide districts
// place a cave origin at (district.minX+24,district.minZ+24).
const ENTRANCE=Object.freeze({x:-488,z:24,length:28,width:3});

test('seed 179 mountain has source-authored axis-aligned entrance AIR at exact physical coordinates',()=>{
  const original=new VoxelWorld(SEED);
  const reader={seed:SEED,edits:new Map(),get:(x,y,z)=>original.legacyBlockAt(x,y,z)};
  const authored=experimentalCaveWorld(reader,ENTRANCE);
  const route=caveRoute(SEED,ENTRANCE);
  const samples=[];
  for(let x=ENTRANCE.x;x<=ENTRANCE.x+4;x++)for(let z=ENTRANCE.z-1;z<=ENTRANCE.z+1;z++){
    const top=terrainHeight(x,z,SEED);
    const biome=v6BiomeAt(x,z,SEED);
    assert.equal(biome?.name,'mountain',`Expected actual mountain at ${x},${z}`);
    assert.equal(original.legacyBlockAt(x,top,z),BLOCK.GRASS);
    const authoredCell=authored.get(x,top,z);
    const actualCell=original.naturalAndLandmarkBlock(x,top,z);
    samples.push({x,z,y:top,authored:authoredCell,actual:actualCell});
  }
  // The original live district's physical cave get() is the authority,
  // and a direct source-mask sampler must agree in this undisturbed throat.
  const realOpen=samples.filter(s=>s.actual===BLOCK.AIR&&s.authored===BLOCK.AIR);
  assert.ok(realOpen.length>=6,'Exact district daylight throat was not found');
  assert.ok(route.floorAt(0)<terrainHeight(ENTRANCE.x,ENTRANCE.z,SEED));
  assert.equal(original.edits.size,0,'Reading actual legacy cave wrote player edits');
  console.log('MOUNTAIN EXACT LEGACY CAVE ENTRANCE PROVENANCE '+JSON.stringify({
    seed:SEED,origin:ENTRANCE,confirmedOpen:realOpen.length,
    examples:realOpen.slice(0,6)}));
});

test('V7 mountain respects physical legacy/combined cave precedence at same coordinates',()=>{
  const world=new FourRegionWorld(SEED,fourRegionProfile(SEED,M7_ENVIRONMENT_GENERATOR));
  const old=new VoxelWorld(SEED);
  const records=[];
  let preservedLegacyAir=0,overriddenByAuthoredCave=0;
  for(let x=ENTRANCE.x;x<=ENTRANCE.x+4;x++)for(let z=ENTRANCE.z-1;z<=ENTRANCE.z+1;z++){
    const y=terrainHeight(x,z,SEED);
    const legacy=old.naturalAndLandmarkBlock(x,y,z);
    const cave=world.environmentCaves.get(x,y,z);
    const actual=world.naturalAndLandmarkBlock(x,y,z);
    const biome=v6BiomeAt(x,z,SEED);
    assert.equal(biome?.name,'mountain');
    if(cave!==undefined){
      assert.equal(actual,cave,'The explicit combined-cave source must win');
      overriddenByAuthoredCave++;
    }else if(legacy===BLOCK.AIR){
      assert.equal(world._environmentBaseline(x,y,z),BLOCK.AIR);
      const overlay=planEnvironmentalColumn(x,z,SEED,
        (a,b,c)=>world._environmentBaseline(a,b,c),biome);
      assert.equal(overlay.has(y),false,'Must not seal a cave-owned original surface AIR');
      assert.equal(actual,BLOCK.AIR);
      preservedLegacyAir++;
    }
    records.push({x,y,z,legacy,cave:cave??null,actual});
  }
  assert.equal(world.edits.size,0);
  assert.ok(preservedLegacyAir+overriddenByAuthoredCave>=6,
    'Known authored cave throat must have verifiable source ownership');
  console.log('MOUNTAIN V7 ACTUAL CAVE PRECEDENCE '+JSON.stringify({
    seed:SEED,origin:ENTRANCE,preservedLegacyAir,overriddenByAuthoredCave,
    records:records.slice(0,8)}));
});
