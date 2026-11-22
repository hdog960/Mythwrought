import assert from 'node:assert/strict';
import test from 'node:test';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {reviewSnowS3WorldSite,reviewSnowS3WorldChunk}
  from '../src/manual-biomes/snowy-s3-world-review.mjs';
import {snowS3SitesForChunk}
  from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
const M7='mythwrought-five-surface-regions-v7';
const coord=(x,y,z)=>x+','+y+','+z;
const prototype=proposedSnowTree;
const makeWorld=()=>{
  const seed=179;
  const sites=snowS3SitesForChunk(seed,0,32);
  assert.ok(sites.length>0);
  const original=new Map(),edits=new Map(),caves=new Map();
  const ground=6,under=5;
  for(const s of sites){
    original.set(coord(s.x,ground,s.z),272);
    original.set(coord(s.x,under,s.z),278);
  }
  const read=(x,y,z)=>original.get(coord(x,y,z))??0;
  const world={seed,generationProfile:{generator:M7},edits,
    _columnPlan:()=>new Map([[under,278],[ground,272]]),
    _environmentBaseline:(x,y,z)=>read(x,y,z),
    naturalAndLandmarkBlock:read,get:(x,y,z)=>edits.get(coord(x,y,z))??read(x,y,z),
    environmentCaves:{get:(...xyz)=>caves.get(coord(...xyz))}};
  const deps={biomeAt:()=>({name:'snow',weight:.98}),terrainHeight:()=>under,
    legacyNatural:()=>0,proposedSnowTree:prototype};
  return {world,deps,caves,original,site:sites[0]};
};
test('original-world adapter yields deterministic proposals without writing to edits',()=>{
  const {world,deps,site}=makeWorld();
  const before=JSON.stringify([...world.edits]);
  const a=reviewSnowS3WorldSite(world,site,deps);
  assert.ok(a&&a.voxelCount>=16);
  assert.deepEqual(reviewSnowS3WorldSite(world,site,deps),a);
  assert.equal(JSON.stringify([...world.edits]),before);
  const chunk=reviewSnowS3WorldChunk(world,0,32,deps);
  assert.ok(chunk.checked>0&&chunk.checked<=24);
  assert.ok(chunk.proposals.length>0);
  assert.ok(Object.isFrozen(chunk.proposals));
  assert.deepEqual(reviewSnowS3WorldChunk(world,0,32,deps),chunk);
});
test('original-world adapter rejects authored cave AIR, old legacy trees and edited canopy',()=>{
  const {world,deps,site,caves,original}=makeWorld();
  const tree=prototype('compact-fir',site.x,6,site.z);
  const occupied=tree.cells.find(([x,y,z,id])=>id===407);
  assert.ok(reviewSnowS3WorldSite(world,site,deps));
  caves.set(coord(...occupied.slice(0,3)),0);
  assert.equal(reviewSnowS3WorldSite(world,site,deps),null,
    'Explicit cave AIR remains protected even though rendered as empty');
  caves.clear();
  const protectedDeps={...deps,legacyNatural:(...xyz)=>
    coord(...xyz)===coord(...occupied.slice(0,3))?7:0};
  assert.equal(reviewSnowS3WorldSite(world,site,protectedDeps),null,
    'Historical old LEAVES remain protected despite current M7 masks');
  world.edits.set(coord(...occupied.slice(0,3)),0);
  assert.equal(reviewSnowS3WorldSite(world,site,deps),null,
    'Player mined empty canopy is intentionally still protected');
  world.edits.clear();
  original.set(coord(...occupied.slice(0,3)),4);
  assert.equal(reviewSnowS3WorldSite(world,site,deps),null,
    'Existing natural M7 WOOD cannot be overwritten');
});
test('the adapter refuses unsupported profile, old columns, cave floor, source mismatch',()=>{
  const {world,deps,site,caves}=makeWorld();
  assert.ok(reviewSnowS3WorldSite(world,site,deps));
  for(const broken of [
    {...world,generationProfile:{generator:'legacy'}},
    {...world,_columnPlan:()=>new Map()},
    {...world,_columnPlan:()=>new Map([[5,278],[6,279]])},
    {...world,environmentCaves:null},
    {...world,edits:{}},
    {...world,naturalAndLandmarkBlock:()=>1},
  ])assert.equal(reviewSnowS3WorldSite(broken,site,deps),null);
  for(const invalid of [
    {...deps,biomeAt:()=>({name:'desert',weight:1})},
    {...deps,biomeAt:()=>({name:'snow',weight:.7})},
    {...deps,legacyNatural:null},
    {...deps,proposedSnowTree:null},
    {...deps,terrainHeight:()=>8},
  ]){
    // old top greater than authored cap must be rejected
    assert.equal(reviewSnowS3WorldSite(world,site,invalid),null);
  }
  caves.set(coord(site.x,6,site.z),0);
  assert.equal(reviewSnowS3WorldSite(world,site,deps),null);
  assert.throws(()=>reviewSnowS3WorldChunk(world,100001,0,deps),/Invalid/);
});
