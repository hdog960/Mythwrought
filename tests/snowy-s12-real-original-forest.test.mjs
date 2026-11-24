// Complete ORIGINAL pinned post-Desert M7 classes, native collision and
// native mesh emission; only the detached candidate tree factory differs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,terrainHeight,collides,meshChunk}
 from '../production-readonly/src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld}
 from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalScenery} from '../production-readonly/src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../production-readonly/src/nonblock/candidate-scene.mjs';
import {stepPlayer} from '../production-readonly/src/physics.mjs';
import {auditSnowS6CrossOwnerForest} from '../src/manual-biomes/snowy-s6-cross-owner-forest-audit.mjs';
import {previewSnowS3CanonicalOwnerChunk} from '../src/manual-biomes/snowy-s3-owner-chunk-preview.mjs';
import {createSnowS12ClimateBoundTreeFactory} from '../src/manual-biomes/snowy-s12-natural-conifer-prototypes.mjs';
const k=(x,y,z)=>[x,y,z].join(',');
test('S12 real two-seed six-chunk original-source physical trees, meshes and actual movement',()=>{
 let total=0,totalFrames=0,totalVisible=0;
 for(const seed of [179,2026]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile),before=JSON.stringify(world.save());
  const deps={biomeAt:v6BiomeAt,terrainHeight,
    proposedSnowTree:createSnowS12ClimateBoundTreeFactory(seed,v6BiomeAt),
    legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z),
    planScenery:planEnvironmentalScenery,describeScene:describeCandidateObject,collides};
  const options={width:3,height:2,stepPlayer};
  const report=auditSnowS6CrossOwnerForest(world,-2,32,deps,options);
  assert.equal(report.safe,true,report.reason);
  const reverse=auditSnowS6CrossOwnerForest(world,-2,32,deps,{...options,reverse:true});
  assert.deepEqual(report,reverse);
  const cells=new Map(),slices=[];
  for(const c of report.chunks){
    const p=previewSnowS3CanonicalOwnerChunk(world,c.cx,c.cz,deps);
    assert.equal(p.safe,true,p.reason);
    assert.equal(p.physicalCells,c.physicalCells);
    for(const [x,y,z,id] of p.cells){
      const key=k(x,y,z);
      assert.equal(cells.has(key),false);
      assert.equal(world.get(x,y,z),0);
      assert.equal(world.edits.has(key),false);
      assert.equal(world.environmentCaves.get(x,y,z),undefined);
      assert.equal(deps.legacyNatural(x,y,z),0);
      assert.equal(v6BiomeAt(x,z,seed)?.name,'snow');
      cells.set(key,id);
    }
    if(p.cells.length)slices.push(p);
  }
  assert.ok(cells.size<=report.physicalCells);
  const overlay=Object.create(world);
  overlay.get=(x,y,z)=>cells.get(k(x,y,z))??world.get(x,y,z);
  overlay.save=()=>world.save();
  const meshes=[];
  for(const c of slices){
    const original=meshChunk(world,c.cx,c.cz),staged=meshChunk(overlay,c.cx,c.cz);
    assert.ok(original instanceof Float32Array&&staged instanceof Float32Array);
    assert.ok(staged.length>original.length,'candidate physical mesh did not add visible vertices');
    assert.ok(staged.byteLength-original.byteLength<=640*36*36,
      'Detached additional tree mesh exceeds conservative 640-cube per-chunk budget');
    let needleVerts=0;
    for(let i=0;i<staged.length;i+=9){
      if(staged[i+8]===18){
        const px=staged[i],py=staged[i+1],pz=staged[i+2];
        for(const x of [Math.floor(px),Math.floor(px)-1])
         for(const y of [Math.floor(py),Math.floor(py)-1])
          for(const z of [Math.floor(pz),Math.floor(pz)-1]){
           const id=cells.get(k(x,y,z));
           if(id===406||id===407){
             // Source needle neighborhood, not a claim of exclusive triangle ownership.
             needleVerts++;break;
           }
          }
      }
    }
    assert.ok(needleVerts>0);
    totalVisible+=needleVerts;
    meshes.push({cx:c.cx,cz:c.cz,originalBytes:original.byteLength,
      stagedBytes:staged.byteLength,physicalCells:c.physicalCells,needleNeighborhoodHits:needleVerts});
  }
  assert.equal(JSON.stringify(world.save()),before);
  assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
  total+=report.distinctAcceptedTrees;
  totalFrames+=report.originalStepFrames;
  console.log('SNOW_S12_ORIGINAL_CONIFER_NATIVE '+JSON.stringify({seed,
    acceptedTrees:report.distinctAcceptedTrees,styles:report.styleCounts,
    wholeTreesPhysicalCells:report.physicalCells,consumerCells:cells.size,
    bodyProbes:report.bodyProbes,preservedPairs:report.protectedDirectedPortalPairs,
    realStepFrames:report.originalStepFrames,meshes,saveAndLegacyUnchanged:true}));
 }
 assert.ok(total>=2&&totalFrames>=45&&totalVisible>0);
});
