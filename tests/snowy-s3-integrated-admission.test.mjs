import assert from 'node:assert/strict';
import test from 'node:test';
import {snowS3SitesForChunk,snowS3StyleAt} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {reviewSnowS3SafeChunk,previewSnowS3FullyAdmittedChunk}
  from '../src/manual-biomes/snowy-s3-integrated-admission.mjs';

const key=(x,y,z)=>x+','+y+','+z;
const M7='mythwrought-five-surface-regions-v7';
const make=()=>{
  const seed=179,edits=new Map(),caves=new Map(),extra=new Map();
  const get=(x,y,z)=>edits.get(key(x,y,z))??extra.get(key(x,y,z))??
    (y===6?272:y===5?278:y<5?3:0);
  const world={seed,generationProfile:{generator:M7},edits,
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _columnPlan:()=>new Map([[5,278],[6,272]]),
    _environmentBaseline:get,naturalAndLandmarkBlock:get,get,
    save:()=>({schema:1,seed,edits:[...edits.entries()]})};
  const source={biomeAt:()=>({name:'snow',weight:.96}),terrainHeight:()=>5,
    legacyNatural:()=>0,proposedSnowTree};
  return {world,source,caves,extra,edits,sites:snowS3SitesForChunk(seed,0,32)};
};
function originalDesc(sceneId,anchor,{min,max,supports,colliders=[]}={}){
  const [x,y,z]=anchor;
  return {contract:'nonblock-object-v1',seed:179,sceneId,anchor,
    instanceKey:`nb1:${sceneId}:179:${x},${y},${z}:0`,
    min:min??[x+.1,y+.1,z+.1],max:max??[x+.8,y+.6,z+.8],
    supports:supports??[[x,y-1,z]],colliders};
}
const sceneDeps=objects=>({
  planScenery:(world,cx,cz)=>objects.map(o=>({sceneId:o.sceneId,anchor:o.anchor})),
  describeScene:(seed,p)=>objects.find(o=>o.sceneId===p.sceneId&&
    o.anchor.join(',')===p.anchor.join(','))
});

test('detached S3 admission independently clears authentic four-style tree cells and caches scene reads',()=>{
  const {world,source,sites}=make();
  assert.equal(sites.length,3);
  let calls=0;
  const r=reviewSnowS3SafeChunk(world,0,32,{...source,...sceneDeps([]),
    planScenery:()=>{calls++;return []}});
  assert.equal(r.safe,true,JSON.stringify(r));
  assert.equal(r.sourceCandidates,3);
  assert.equal(r.admitted.length,3);
  assert.equal(r.rejected.length,0);
  assert.equal(r.sourceWorldUnchanged,true);
  assert.equal(r.sceneCalls,15);
  assert.equal(calls,15);
  assert.equal(r.sceneRequests,27);
  assert.equal(world.edits.size,0);
  for(const c of r.admitted){
    const real=proposedSnowTree(c.style,c.x,c.floor,c.z,{wind:c.wind});
    assert.deepEqual(c.cells,real.cells);
    assert.ok(Object.isFrozen(c.cells));
  }
});

test('S3 admission rejects explicit cave override near path without falsifying original source protection',()=>{
  const {world,source,sites,caves}=make(),site=sites[0];
  caves.set(key(site.x+2,6,site.z),0);
  const r=reviewSnowS3SafeChunk(world,0,32,{...source,...sceneDeps([])});
  assert.equal(r.safe,true);
  assert.ok(r.rejected.some(o=>o.key===site.key&&o.reason==='near-original-cave-override'));
  assert.equal(r.admitted.length,2);
  assert.equal(r.sourceCandidates,3);
  assert.equal(world.edits.size,0);
});

test('S3 admission blocks original foliage geometry across a tree, preserving non-block assets',()=>{
  const {world,source,sites}=make(),site=sites[1],
    style=snowS3StyleAt(site,6),tree=proposedSnowTree(style,site.x,6,site.z,{wind:site.wind});
  const canopy=tree.cells.find(c=>c[3]===407)||tree.cells.find(c=>c[3]===406);
  const [x,y,z]=canopy;
  const desc=originalDesc('nonblock:d:frost-fern',[x+1,y,z],{
    min:[x+.6,y+.1,z+.2],max:[x+1.4,y+.7,z+.8]});
  const r=reviewSnowS3SafeChunk(world,0,32,{...source,...sceneDeps([desc])});
  assert.equal(r.safe,true);
  assert.ok(r.rejected.some(o=>o.key===site.key&&o.reason==='overlaps-original-scene-mesh-bounds'));
  assert.ok(r.admitted.every(o=>o.key!==site.key));
  assert.equal(r.sceneCalls,15,'overlapping 3x3 neighborhoods must share source scene plans');
  assert.equal(world.edits.size,0);
});

test('S3 admission rejects broken source/real scene identity and any save mutation',()=>{
  const {world,source,edits}=make();
  assert.equal(reviewSnowS3SafeChunk({...world,generationProfile:{generator:'legacy'}},
    0,32,{...source,...sceneDeps([])}).safe,false);
  assert.equal(reviewSnowS3SafeChunk(world,0,32,{...source}).safe,false);
  const r=reviewSnowS3SafeChunk(world,0,32,{...source,
    planScenery:()=>{edits.set('4,8,4',0);return []},describeScene:()=>null});
  assert.equal(r.safe,false);
  assert.equal(r.reason,'source-changed-schema-1-world-during-review');
});


test('fully admitted chunk clips only source/route/scenery-safe immutable physical cells',()=>{
  const {world,source,caves,sites}=make();
  const deps={...source,...sceneDeps([])};
  const p=previewSnowS3FullyAdmittedChunk(world,0,32,deps);
  assert.equal(p.safe,true);
  assert.equal(p.trees,3);
  assert.ok(p.physicalCells>25&&p.physicalCells<=640);
  assert.ok(p.cells.every(c=>Math.floor(c[0]/16)===0&&
    Math.floor(c[2]/16)===32&&Object.isFrozen(c)));
  assert.equal(new Set(p.cells.map(c=>c.slice(0,3).join(','))).size,p.physicalCells);
  caves.set(key(sites[0].x+2,6,sites[0].z),0);
  const after=previewSnowS3FullyAdmittedChunk(world,0,32,deps);
  assert.equal(after.safe,true);
  assert.equal(after.trees,2);
  assert.ok(after.physicalCells<p.physicalCells,
    'Protected cave veto must remove physically previewed cells as well');
  assert.equal(world.edits.size,0);
});
