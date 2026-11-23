// Snow S7: real original M7 stepPlayer crossing ORIGINAL 16x16 CHUNK
// boundaries with the authenticated, read-only six-chunk S3 forest overlay.
// Not a fake physics function, screenshot, live renderer or production code.
import assert from 'node:assert/strict';
import test from 'node:test';
import {VoxelWorld,collides,BLOCK,terrainHeight} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
 restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {previewSnowS3CanonicalOwnerChunk}
 from '../src/manual-biomes/snowy-s3-owner-chunk-preview.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {planEnvironmentalScenery} from '../src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';
import {stepPlayer} from '../src/physics.mjs';

const key=(x,y,z)=>x+','+y+','+z;
const chunks=[[-2,32],[-1,32],[0,32],[-2,33],[-1,33],[0,33]];
function eligibleFeet(w,x,z){
 for(let feet=19;feet>=3;feet--){
  if(w.get(Math.floor(x),feet-1,Math.floor(z))===BLOCK.AIR)continue;
  if(collides(w,x,feet,z)||!collides(w,x,feet-.065,z))continue;
  return feet;
 }
 return null;
}
function walk(w,x,z,feet,border){
 const p={x,z,feet,vX:0,vY:0,vZ:0,yaw:Math.PI/2,pitch:0,
   onGround:true,coyote:.09,jumpBuffer:0};
 let firstCross=null,minFeet=feet,maxFeet=feet;
 for(let i=0;i<132;i++){
  stepPlayer(w,p,{forward:1,strafe:0,jump:false},1/60);
  assert.ok([p.x,p.z,p.feet].every(Number.isFinite));
  assert.equal(collides(w,p.x,p.feet,p.z),false,
    'Original player must never penetrate source or staged forest');
  minFeet=Math.min(minFeet,p.feet);maxFeet=Math.max(maxFeet,p.feet);
  if(firstCross===null&&p.x>=border+.75)firstCross=i+1;
 }
 return {crossed:firstCross!==null,firstCross,xEnd:p.x,zEnd:p.z,
   feetEnd:p.feet,verticalRange:[minFeet,maxFeet],frames:132};
}

test('real original M7 stepPlayer crosses shared owner-chunk x-seams with physical conifers',()=>{
 let total=0,originalTrials=0;
 for(const seed of [179,2026]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile),before=JSON.stringify(world.save());
  const deps={biomeAt:v6BiomeAt,terrainHeight,proposedSnowTree,
    legacyNatural:(x,y,z)=>
      VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z),
    planScenery:planEnvironmentalScenery,describeScene:describeCandidateObject,
    collides};
  const cells=new Map();
  let totalAccepted=0,sourceChunks=0;
  for(const [cx,cz] of chunks){
   const result=previewSnowS3CanonicalOwnerChunk(world,cx,cz,deps);
   assert.equal(result.safe,true,'Original source chunk failed: '+cx+','+cz+' '+result.reason);
   assert.equal(result.physicalCells,result.cells.length);
   totalAccepted+=result.accepted.length;
   sourceChunks++;
   for(const [x,y,z,id] of result.cells){
    const k=key(x,y,z);
    assert.equal(cells.has(k),false,'Canonical consumer generated physical overlap');
    assert.equal(world.get(x,y,z),BLOCK.AIR);
    assert.equal(world.environmentCaves.get(x,y,z),undefined);
    assert.equal(world.edits.has(k),false);
    cells.set(k,id);
   }
  }
  const staged=Object.create(world);
  staged.get=(x,y,z)=>cells.get(key(x,y,z))??world.get(x,y,z);
  const cases=[];
  let baselineCrossings=0;
  for(const boundary of [-16,0]){
   let approvedAtBorder=0;
   for(let z=512;z<544;z+=2){
    if(approvedAtBorder>=2)break;
    const startX=boundary-2.5,startZ=z+.5;
    if(v6BiomeAt(startX,startZ,seed)?.name!=='snow'||
       v6BiomeAt(boundary+2,startZ,seed)?.name!=='snow')continue;
    const feet=eligibleFeet(world,startX,startZ);
    if(feet===null||collides(staged,startX,feet,startZ))continue;
    const base=walk(world,startX,startZ,feet,boundary);
    originalTrials++;
    if(!base.crossed)continue;
    baselineCrossings++;
    const withForest=walk(staged,startX,startZ,feet,boundary);
    assert.equal(withForest.crossed,true,
      'Real originally walkable across chunk seam severed by S6 physical conifer source: '+boundary+','+z);
    assert.ok(withForest.firstCross<=132);
    assert.equal(Math.floor(startX/16)<Math.floor(withForest.xEnd/16),true);
    cases.push({boundary,xStart:startX,z:startZ,startFeet:feet,
      originalCrossFrame:base.firstCross,
      stagedCrossFrame:withForest.firstCross,
      originalEnd:[base.xEnd,base.feetEnd,base.zEnd],
      stagedEnd:[withForest.xEnd,withForest.feetEnd,withForest.zEnd]});
    total++;
    approvedAtBorder++;
   }
  }
  assert.equal(JSON.stringify(world.save()),before);
  assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
  assert.equal(world.edits.size,0);
  assert.equal(sourceChunks,6);
  console.log('SNOW_S7_REAL_OLD_AND_STAGED_CHUNK_WALKS '+JSON.stringify({
   seed,consumerChunks:sourceChunks,originalAcceptedTreeSlices:totalAccepted,
   originalPhysicalTreeCells:cells.size,
   originalBaselineTrials:originalTrials,
   genuineBaselineCrossings:baselineCrossings,
   protectedForestCrossings:cases.length,
   exactOriginalStepPlayerFramesPerTrial:132,
   crossings:cases,
   savedWorldAndCavesUntouched:true}));
 }
 assert.ok(total>=1,
   'No actual original seed179/2026 multi-chunk foot route was source-authenticated; do not invent passage evidence');
});
