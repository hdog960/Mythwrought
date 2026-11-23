// Two exact immutable checkouts REQUIRED: isolated V8 research plus current
// Desert Phase3 production original. No merge/ID/deploy/user-world writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {auditMountainV8P3Uplift as uplift,
  auditMountainV8ExistingP3EditHalo as halo,
  V8_P3_SOURCE_HEAD as CURRENT,V8_P3_HALO_SOURCE_BLOB as HALO_BLOB}
  from '../src/manual-biomes/mountain-v8-p3-uplift-and-halo-audit.mjs';
import {surveyMountainV8Column,mountainV8TileRoot}
  from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Pinned current-main original checkout required');
const main=relative=>import(pathToFileURL(path.join(root,relative)).href);
const [{VoxelWorld,BLOCK,terrainHeight,chunkCoord,meshChunk,worldKey,CHUNK_SIZE},
 {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR},
 {v6BiomeAt},
 {desertSeamEditAffectedChunks,DESERT_SEAM_VISUAL_RADIUS},
 {editAffectedChunks},
 {verticalEditSections,depthMeshKey,sectionForY,WORLD_MAX_Y,LEGACY_WORLD_MIN_Y},
 {canWarmSourceScree,nearestDesertHardpanSquared,warmScreeVertexColor},
 {nearestNaturalScreeSquared,desertSeamVertexTint,canBlendNaturalDesertSurface}]
 =await Promise.all([
 main('src/voxel.mjs'),main('src/manual-biomes/profile-world.mjs'),
 main('src/manual-biomes/v6-balanced-biomes.mjs'),
 main('src/manual-biomes/desert-seam-invalidation.mjs'),main('src/chunks.mjs'),
 main('src/depth.mjs'),main('src/manual-biomes/desert-bilateral-rgb.mjs'),
 main('src/manual-biomes/desert-seam-vertex-tint.mjs')]);
const seed=179,original=new VoxelWorld(seed);
const p3=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const cfg={sourceMainHead:CURRENT,originalVoxelReaderIdentityVerified:true};
const haloCfg={sourceMainHead:CURRENT,originalHaloBlob:HALO_BLOB,
  currentMainP3Halo:desertSeamEditAffectedChunks};
const survey=(x,z,w=original)=>surveyMountainV8Column({x,z,seed,
  worldMaxY:WORLD_MAX_Y,biomeAt:v6BiomeAt,heightAt:terrainHeight,
  readBlock:(a,b,c)=>w.naturalAndLandmarkBlock(a,b,c),
  protectedAt:(a,b,c)=>w.edits.has(worldKey(a,b,c)),
  ids:BLOCK});
const findSite=()=>{
  // Existing originally accepted Mountain V8 64-tile atlases from source.
  const ranges=[[-88,24],[-80,-8]];
  for(const [tx0,tz0] of ranges)
    for(let tz=tz0;tz<tz0+8;tz++)
      for(let tx=tx0;tx<tx0+8;tx++){
        const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,seed);
        const p=survey(x,z);
        if(!p)continue;
        const proof=uplift(p,{originalWorld:original,...cfg});
        if(proof)return {p,proof,tx,tz};
      }
  throw Error('No source-authentic current-main legacy physical uplift in two known original Mountain atlases');
};
const site=findSite();
const hash=vertices=>createHash('sha256').update(Buffer.from(
  vertices.buffer,vertices.byteOffset,vertices.byteLength)).digest('hex');

test('exact current-main real legacy voxels support one bounded source-only mountain uplift without save writes',()=>{
  const {p,proof}=site,before=JSON.stringify(original.save());
  assert.equal(proof.sourceMainHead,CURRENT);
  assert.equal(proof.seed,seed);
  assert.equal(proof.x,p.x);assert.equal(proof.z,p.z);
  assert.equal(proof.originalLegacyTop,p.legacyTop);
  assert.equal(proof.proposedV8Top,p.top);
  assert.ok(proof.sourcePhysicalCells>=1&&proof.sourcePhysicalCells<=18);
  assert.equal(proof.originalPhysicalDescriptorMaterials.length,proof.sourcePhysicalCells);
  assert.deepEqual(proof.sections,[0]);
  assert.ok(proof.geometryChunkCoordinates.length>=1&&proof.geometryChunkCoordinates.length<=3);
  assert.equal(proof.actualV8GpuBytes,null);
  assert.equal(proof.newV8MaterialIdsRegistered,0);
  assert.equal(proof.oldM7ColorHaloClaimed,false);
  assert.equal(proof.V8ColorAndGPUInvalidationOwnerApprovalRequired,true);
  assert.equal(proof.safeToIntegrate,false);
  assert.equal(JSON.stringify(original.save()),before);
  assert.equal(original.edits.size,0);
});
test('genuine legacy source provenance and unregistered v8 identity must agree before physical uplift',()=>{
  const {p}=site;
  for(const changed of [
    {...p,legacyTop:p.legacyTop+1},
    {...p,top:p.top+1},
    {...p,cap:'snow'},
    {...p,seed:2026},
    {...p,generatorIdentityRequired:'mythwrought-environment-v7'},
    {...p,safeToIntegrate:true},
    {...p,sourceProvenance:{...p.sourceProvenance,originalGroundIntact:false}},
    {...p,sourceProvenance:{...p.sourceProvenance,neighborTops:[1,1,1,1]}}
  ])assert.equal(uplift(changed,{originalWorld:original,...cfg}),null);
  assert.equal(uplift(p,{originalWorld:original,sourceMainHead:'stale',
    originalVoxelReaderIdentityVerified:true}),null);
  assert.equal(uplift(p,{originalWorld:original,sourceMainHead:CURRENT}),null);
});
test('protected actual original cave AIR at seed179 throat is never uplifted',()=>{
  for(let x=-488;x<=-484;x++)for(let z=23;z<=25;z++){
    const y=terrainHeight(x,z,seed);
    assert.equal(original.naturalAndLandmarkBlock(x,y,z),BLOCK.AIR);
    const p={...site.p,x,z,legacyTop:y,top:y,cap:'slate'};
    assert.equal(uplift(p,{originalWorld:original,...cfg}),null);
  }
  assert.equal(original.edits.size,0);
});
test('in-memory original player edit blocks prospective uplift and survives inspection byte-for-byte',()=>{
  const {p}=site,w=new VoxelWorld(seed);
  const editedY=p.legacyTop;
  assert.equal(w.set(p.x,editedY,p.z,BLOCK.AIR),true);
  const before=JSON.stringify(w.save());
  assert.equal(uplift(p,{originalWorld:w,...cfg}),null);
  assert.equal(JSON.stringify(w.save()),before);
  assert.equal(w.edits.get(worldKey(p.x,editedY,p.z)),BLOCK.AIR);
  assert.equal(original.edits.size,0);
});
test('real current M7 P3 radius-three RGB refresh includes previously missed adjacent negative chunk',()=>{
  assert.equal(DESERT_SEAM_VISUAL_RADIUS,3);
  const x=-786,y=4,z=-1774,neighbor={cx:-50,cz:-112};
  assert.equal(p3.get(x,y,z),401);
  const source=halo(p3,x,y,z,haloCfg);
  assert.ok(source);
  assert.ok(source.actualM7P3Chunks.some(c=>c.cx===neighbor.cx&&c.cz===neighbor.cz));
  assert.ok(source.extraM7OnlyColorHaloChunks.some(c=>c.cx===neighbor.cx&&c.cz===neighbor.cz));
  assert.ok(source.actualM7P3Chunks.length<=5);
  assert.ok(source.geometryChunkCoordinates===undefined);
  assert.deepEqual(source.verticalSections,[0]);
  assert.equal(source.newV8GeneratorHaloTested,false);
  assert.equal(source.noChunkUploadPerformed,true);
  assert.equal(source.safeToIntegrate,false);
});
test('source-current original M7 protected cave and deep edit never inherit surface RGB halo',()=>{
  const cave=[40,9,63],c=halo(p3,...cave,haloCfg);
  assert.equal(p3.get(...cave),BLOCK.AIR);
  assert.equal(p3._columnPlan(cave[0],cave[2]).size,0);
  assert.deepEqual(c.actualM7P3Chunks,editAffectedChunks(cave[0],cave[2]));
  const deep=halo(p3,-16,-20,-1,haloCfg);
  assert.deepEqual(deep.actualM7P3Chunks,editAffectedChunks(-16,-1));
  assert.deepEqual(deep.extraM7OnlyColorHaloChunks,[]);
  assert.deepEqual(deep.verticalSections,[-2,-1]);
});
test('source-current RGB halo does not apply to old V6 identity or invented V8 profile',()=>{
  const v6=new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
  const x=-786,y=4,z=-1774;
  assert.deepEqual(desertSeamEditAffectedChunks(v6,x,z,y),editAffectedChunks(x,z));
  assert.equal(halo(v6,x,y,z,haloCfg),null);
  assert.equal(halo(p3,x,y,z,{...haloCfg,sourceMainHead:'stale-main'}),null);
  assert.equal(halo(p3,x,y,z,{...haloCfg,originalHaloBlob:'stale'}),null);
});
test('genuine original negative chunk x/z geometry edge is sign-correct and bounded',()=>{
  assert.equal(CHUNK_SIZE,16);
  for(const [x,z] of [[-16,-1],[-1,-16],[0,0],[15,-1],
    [16,16],[-17,-17],[-15,15],[-32,-32]]){
    const cx=Math.floor(x/16),cz=Math.floor(z/16);
    assert.equal(chunkCoord(x),cx);assert.equal(chunkCoord(z),cz);
    const h=halo(p3,x,-4,z,haloCfg);
    assert.deepEqual(h.actualM7P3Chunks,editAffectedChunks(x,z));
    assert.deepEqual(h.verticalSections,[-1,0]);
    assert.deepEqual(h.originalSectionMeshKeys,
      h.actualM7P3Chunks.flatMap(c=>[-1,0].map(s=>depthMeshKey(c.cx,c.cz,s))));
  }
});
test('original Y-section contact has no V8 uplift escape to underground, preserves old mesh key ABI',()=>{
  assert.equal(sectionForY(site.p.legacyTop),0);
  assert.deepEqual(verticalEditSections(-3),[0,-1]);
  assert.deepEqual(verticalEditSections(-4),[-1,0]);
  assert.deepEqual(verticalEditSections(-19),[-1,-2]);
  assert.deepEqual(verticalEditSections(-20),[-2,-1]);
  assert.equal(depthMeshKey(-1,-2,0),'-1,-2');
  assert.equal(depthMeshKey(-1,-2,-1),'-1,-2,-1');
  assert.equal(LEGACY_WORLD_MIN_Y,-3);
});
test('original M7 P3 color guards require source top and leave non-RGB material tags unchanged',()=>{
  const x=-786,y=4,z=-1774;
  const plan=p3._columnPlan(x,z);
  assert.ok(plan.size>0);
  assert.equal(plan.get(Math.max(...plan.keys())),401);
  const climate=v6BiomeAt(x,z,seed);
  assert.equal(canWarmSourceScree({id:401,edited:false,region:climate,
    sourceSurface:{top:y,id:401},y}),true);
  assert.equal(canWarmSourceScree({id:401,edited:true,region:climate,
    sourceSurface:{top:y,id:401},y}),false);
  assert.equal(canBlendNaturalDesertSurface({id:401,edited:false,region:climate,
    sourceSurface:{top:y,id:401},y}),false);
  const originalColor=[.5,.55,.6],changed=warmScreeVertexColor(originalColor,1);
  assert.notDeepEqual(changed,originalColor);
  assert.deepEqual(warmScreeVertexColor(originalColor,Infinity),originalColor);
  assert.deepEqual(desertSeamVertexTint(originalColor,9),originalColor);
  assert.ok(nearestNaturalScreeSquared(0,0,0,()=>false)===Infinity);
  assert.ok(nearestDesertHardpanSquared(0,0,0,()=>false)===Infinity);
});
test('real current M7 WebGL2 CPU vertex payload and both schema-1 snapshots are invariant under audits',()=>{
  const x=-786,z=-1774,y=4,cx=-50,cz=-112;
  const snapshot=JSON.stringify(p3.save()),legacySave=JSON.stringify(original.save());
  const before=meshChunk(p3,cx,cz),digest=hash(before);
  assert.equal(before.length%9,0);
  assert.ok(halo(p3,x,y,z,haloCfg));
  assert.ok(uplift(site.p,{originalWorld:original,...cfg}));
  const after=meshChunk(p3,cx,cz);
  assert.equal(hash(after),digest);
  assert.equal(after.byteLength,before.byteLength);
  assert.equal(JSON.stringify(p3.save()),snapshot);
  assert.equal(JSON.stringify(original.save()),legacySave);
  assert.equal(p3.edits.size,0);
});
