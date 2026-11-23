// Native ORIGINAL two-checkout study: isolated V8 read-only candidate vs
// exact CURRENT Desert Phase3 main at db4bbcc32156e5df311f733bcaa53d559c17313b.
// MUST be run only with the pinned current-main checkout in the focused workflow.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {mountainV8TileRoot}
  from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS}
  from '../src/manual-biomes/mountain-v8-vegetation-cells.mjs';
import {auditMountainV8P3ConiferFootprint as audit,
  MOUNTAIN_V8_P3_REQUIRED_MAIN as CURRENT,
  MOUNTAIN_V8_P3_TREE_SOURCE_BLOB as TREE_BLOB}
  from '../src/manual-biomes/mountain-v8-p3-conifer-footprint-preflight.mjs';
import {v6BiomeAt as isolatedBiome}
  from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {chunkCoord,CHUNK_SIZE,raycast as originalLegacyRaycast}
  from '../src/voxel.mjs';
import {raycastShapes}
  from '../src/voxel-shape-interactions.mjs';

const mainRoot=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!mainRoot)throw Error('Exact Desert P3 current-main checkout REQUIRED');
const fromMain=async relative=>import(pathToFileURL(path.join(mainRoot,relative)).href);
const {naturalTreeTouchesDesert}=await fromMain('src/manual-biomes/environment-v7.mjs');
const {v6BiomeAt:currentBiome}=await fromMain('src/manual-biomes/v6-balanced-biomes.mjs');
const {VoxelWorld,terrainHeight,BLOCK}=await fromMain('src/voxel.mjs');
const {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}=
  await fromMain('src/manual-biomes/profile-world.mjs');

const seed=179,source=Object.freeze({sourceMainHead:CURRENT,
  sourceDesertTreeBlob:TREE_BLOB,
  originalDesertTreeTouches:naturalTreeTouchesDesert});
const rootAt=(tx,tz)=>mountainV8TileRoot(tx,tz,seed);
function proposal(tx,tz){
  const root=rootAt(tx,tz);
  return {x:root.rootX,z:root.rootZ,seed,top:10,cap:'alpine-grass',
    snowy:false,cliff:false,slope:.1,vegetation:'dwarf-conifer',
    vegetationSite:{tileX:tx,tileZ:tz,...root,chosen:true},
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'};
}
const empty=f=>({ ...source,worldMaxY:19,airId:BLOCK.AIR,
  readOriginalBlock:()=>BLOCK.AIR,
  protectedAt:()=>false,proposedSurfaceAt:()=>10,...f});
const allParts=(p)=>MOUNTAIN_V8_PLANT_PATTERNS['dwarf-conifer'].map(
  ([dx,dy,dz,material])=>[p.x+dx,p.top+dy,p.z+dz,material]);
function findRealOriginalMountainSite(){
  // Source-seeded root in the existing original Mountain biome; bounded
  // deterministic search, no V7 world construction or gameplay writes.
  for(let tx=-70;tx<=-58;tx++)for(let tz=-9;tz<=9;tz++){
    const p=proposal(tx,tz),r=audit(p,empty());
    if(r)return {p,r,tx,tz};
  }
  throw Error('No source-authentic seed179 original Mountain root in search range');
}
const site=findRealOriginalMountainSite();

test('exact new-main V6 source agrees with isolated unchanged original biome ABI on positive and negative geography',()=>{
  for(const [x,z] of [[0,0],[512,0],[-512,0],[-2048,512],[-255,-255],
    [site.p.x,site.p.z],[site.p.x+1,site.p.z],[site.p.x-1,site.p.z]])
    assert.deepEqual(isolatedBiome(x,z,seed),currentBiome(x,z,seed));
  assert.equal(currentBiome(site.p.x,site.p.z,seed)?.name,'mountain');
  assert.ok(currentBiome(site.p.x,site.p.z,seed).weight>=.82);
});
test('real current-main Desert P3 veto inspects ANY tree canopy cell, even from a non-Desert root',()=>{
  let edge=null;
  for(let x=0;x<750;x++){
    const left=currentBiome(x,0,seed),right=currentBiome(x+1,0,seed);
    if(left?.name!=='desert'&&right?.name==='desert'){edge=x;break;}
  }
  assert.notEqual(edge,null,'Expected known current original Plains/Desert boundary');
  assert.equal(naturalTreeTouchesDesert(seed,[[edge,12,0]], [edge,10,0]),false);
  assert.equal(naturalTreeTouchesDesert(seed,
    [[edge,12,0],[edge+1,12,0]],[edge,10,0]),true);
});
test('13-cell authentic Mountain conifer root and leaves certified by source with no ID or activation',()=>{
  const {p,r}=site;
  assert.equal(r.sourceCells.length,13);
  assert.equal(r.sourceCellCount,13);
  assert.deepEqual(r.origin,[p.x,p.top,p.z]);
  assert.deepEqual(r.chunk,[chunkCoord(p.x),chunkCoord(p.z)]);
  assert.equal(r.distinctSourceChunkCount,1);
  assert.deepEqual(r.sourceCells.map(c=>[c.x,c.y,c.z,c.material]),allParts(p));
  assert.ok(r.sourceCells.every(c=>c.y>p.top));
  assert.equal(r.noNewMaterialIds,true);
  assert.equal(r.runtimeActivationAuthorized,false);
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.gpuBytesMeasured,null);
  assert.equal(Object.isFrozen(r),true);
});
test('all negative/positive 8x8 seeded conifer roots and +/-1 leaf arms remain inside true sign-correct 16x16 chunk',()=>{
  assert.equal(CHUNK_SIZE,16);
  for(const tx of [-100,-65,-64,-63,-3,-2,-1,0,1,2,63,64,100])
    for(const tz of [-99,-65,-64,-63,-3,-2,-1,0,1,2,63,64,99]){
      const p=proposal(tx,tz);
      for(const [x,,z] of allParts(p)){
        assert.equal(chunkCoord(x),chunkCoord(p.x),
          'Conifer footprint unexpectedly crosses x-chunk '+tx);
        assert.equal(chunkCoord(z),chunkCoord(p.z),
          'Conifer footprint unexpectedly crosses z-chunk '+tz);
      }
      assert.equal(Math.floor(p.x/8),tx);
      assert.equal(Math.floor(p.z/8),tz);
    }
});
test('whole source-authored side foliage protected by cave/structure owner veto rejects atomically',()=>{
  const p=site.p,side=allParts(p).find(c=>c[0]===p.x-1);
  assert.ok(side);
  let seen=[];
  assert.equal(audit(p,empty({protectedAt:(x,y,z)=>x===side[0]&&y===side[1]&&z===side[2],
    onVeto:x=>seen.push(x)})),null);
  assert.deepEqual(seen.map(x=>x.reason),['source-plant-envelope-or-air-veto']);
  assert.equal(audit(p,empty({readOriginalBlock:(x,y,z)=>
    x===side[0]&&y===side[1]&&z===side[2]?BLOCK.WOOD:BLOCK.AIR})),null);
});
test('raised neighboring V8 terrain never buries low side leaves',()=>{
  const p=site.p,side=allParts(p).find(c=>c[0]===p.x+1);
  assert.equal(audit(p,empty({proposedSurfaceAt:(x,z)=>
    x===side[0]&&z===side[2]?p.top+3:p.top})),null);
});
test('forged root, stale Desert main source SHA and absent whole-tree veto fail closed',()=>{
  const p=site.p;
  for(const [fake,opts] of [
    [{...p,x:p.x+1},empty()],
    [p,empty({sourceMainHead:'7016e14cd6289f45eaf7fc6a79a362b47996df65'})],
    [p,empty({sourceDesertTreeBlob:'stale-source'})],
    [p,empty({originalDesertTreeTouches:undefined})],
    [{...p,vegetationSite:{...p.vegetationSite,rootX:p.x+1}},empty()]
  ])assert.equal(audit(fake,opts),null);
});
test('source original shape raycast through real thirteen-cell conifer respects narrow trunk',()=>{
  const r=site.r,p=site.p;
  const shapes=new Map(r.sourceCells.map(c=>[
    [c.x,c.y,c.z].join(','),{boxes:c.selectionBoxes}]));
  const eye=[p.x+.5,p.top+1.5,p.z-.5],direction=[0,0,1];
  const ray=raycastShapes(eye,direction,(x,y,z)=>shapes.get([x,y,z].join(','))??null,3);
  assert.deepEqual(ray.cell,[p.x,p.top+1,p.z]);
  assert.ok(Math.abs(ray.distance-.86)<1e-6);
  assert.deepEqual(ray.normal,[0,0,-1]);
});
test('real current-main world original cave AIR and source saves stay unmodified',()=>{
  const original=new VoxelWorld(seed),before=JSON.stringify(original.save());
  for(let x=-488;x<=-484;x++)for(let z=23;z<=25;z++){
    const y=terrainHeight(x,z,seed);
    assert.equal(original.naturalAndLandmarkBlock(x,y,z),BLOCK.AIR);
  }
  const profile=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const first=JSON.stringify(profile.save()),p=site.p;
  const r=audit(p,empty({
    readOriginalBlock:(x,y,z)=>profile.get(x,y,z),
    // Genuine current M7 world original+profile edits must be checked even if
    // raised flora candidate has no physical room.
    protectedAt:(x,y,z)=>profile.edits.has(x+','+y+','+z)
  }));
  if(r)for(const c of r.sourceCells)
    assert.equal(profile.get(c.x,c.y,c.z),BLOCK.AIR);
  assert.equal(JSON.stringify(profile.save()),first);
  assert.equal(JSON.stringify(original.save()),before);
  assert.equal(original.edits.size,0);
  assert.equal(profile.edits.size,0);
});
