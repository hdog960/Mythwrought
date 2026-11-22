// DETACHED S3 ADMISSION — joins authentic M7 source provenance, S3 one-step
// walkway proxy and S5 original nonblock mesh/support/collider clearance.
// Read-only candidate filter, NEVER imported by the current game generator.
// The original scene planner can be expensive: cache its 3x3 neighborhood
// results per chunk in this one bounded review, without a global sidecar.
import {reviewSnowS3WorldChunk} from './snowy-s3-world-review.mjs';
import {auditSnowS3Walkway} from './snowy-s3-walkway-audit.mjs';
import {inspectSnowS3OriginalSceneClearance}
  from './snowy-s3-s5-original-scene-clearance.mjs';

const M7='mythwrought-five-surface-regions-v7';
const originalSave=world=>JSON.stringify(world.save());
const fail=(reason)=>Object.freeze({
  kind:'detached-snow-S3-original-scene-admission',safe:false,reason
});

// A scene-source read must not change the cave/legacy/physical cells that
// were approved earlier in this SAME synchronous review. Schema-1 save
// equality alone cannot detect a changed cave override or natural cache.
// Snapshot ONLY already proposed trees and the protective five-cell ring;
// no global world hash or per-frame scan. The original legacy reader is
// passed through from VoxelWorld.prototype.naturalAndLandmarkBlock.
function sourceCertificate(world,candidate,legacyNatural){
  if(typeof world.get!=='function'||
    typeof world.environmentCaves?.get!=='function'||
    typeof world.naturalAndLandmarkBlock!=='function'||
    typeof legacyNatural!=='function')return null;
  const {x,z,floor}=candidate,checks=[];
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)
    for(let dy=-1;dy<=3;dy++){
      const ax=x+dx,ay=floor+dy,az=z+dz;
      const cave=world.environmentCaves.get(ax,ay,az);
      checks.push(cave===undefined?null:cave);
    }
  for(const [ax,ay,az] of candidate.cells){
    checks.push(world.get(ax,ay,az));
    checks.push(world.naturalAndLandmarkBlock(ax,ay,az));
    checks.push(legacyNatural(ax,ay,az));
    const cave=world.environmentCaves.get(ax,ay,az);
    checks.push(cave===undefined?null:cave);
    checks.push(world.edits.has(ax+','+ay+','+az));
  }
  return JSON.stringify(checks);
}

export function reviewSnowS3SafeChunk(world,cx,cz,{
  biomeAt,terrainHeight,legacyNatural,proposedSnowTree,
  planScenery,describeScene
}={}){
  if(world?.generationProfile?.generator!==M7||
    typeof world.save!=='function'||!(world.edits instanceof Map)||
    ![biomeAt,terrainHeight,legacyNatural,proposedSnowTree,
      planScenery,describeScene].every(fn=>typeof fn==='function'))
    return fail('missing-authentic-read-only-M7-source');
  const before=originalSave(world);
  let raw;
  try{raw=reviewSnowS3WorldChunk(world,cx,cz,{
    biomeAt,terrainHeight,legacyNatural,proposedSnowTree});}
  catch{return fail('invalid-source-chunk-review')}
  if(raw.proposals.length>24||raw.proposals.length>raw.checked)
    return fail('excessive-S3-proposals');
  // Capture all candidates before any scene callback, including those
  // visited later. A planner must not silently invalidate an earlier OR
  // future tree simply because scene plans are visited in chunk order.
  const certificates=new Map();
  try{
    for(const candidate of raw.proposals){
      const proof=sourceCertificate(world,candidate,legacyNatural);
      if(proof===null)return fail('missing-stable-M7-source-certificates');
      certificates.set(candidate.key,proof);
    }
  }catch{return fail('original-M7-source-certificate-failed')}
  const sourceUnchanged=()=>{
    try{return raw.proposals.every(c=>
      sourceCertificate(world,c,legacyNatural)===certificates.get(c.key));}
    catch{return false}
  };
  const sceneCache=new Map(),describeCache=new Map();
  let sceneRequests=0,sceneCalls=0,descriptorCalls=0;
  const cachedPlanner=(world,x,z)=>{
    const k=x+','+z;
    sceneRequests++;
    if(!sceneCache.has(k)){
      sceneCalls++;
      sceneCache.set(k,planScenery(world,x,z));
    }
    return sceneCache.get(k);
  };
  const cachedDescribe=(seed,p)=>{
    const k=[seed,p.sceneId,...p.anchor,p.variant??0,p.orientation??0].join('|');
    if(!describeCache.has(k)){
      descriptorCalls++;
      describeCache.set(k,describeScene(seed,p));
    }
    return describeCache.get(k);
  };
  const admitted=[],rejected=[];
  for(const candidate of raw.proposals){
    // A failed walking proxy never reaches the potentially expensive scene
    // geometry phase, so narrow pedestrian corridors remain authoritative.
    let walk;
    try{walk=auditSnowS3Walkway(world,candidate)}
    catch{return fail('walking-source-review-failed')}
    if(!walk.safe){
      rejected.push(Object.freeze({key:candidate.key,reason:walk.reason}));
      continue;
    }
    let scenery;
    try{scenery=inspectSnowS3OriginalSceneClearance(world,candidate,{
      planScenery:cachedPlanner,describeScene:cachedDescribe});}
    catch{return fail('scene-source-review-failed')}
    if(!scenery.safe){
      rejected.push(Object.freeze({key:candidate.key,reason:scenery.reason}));
      if(!sourceUnchanged())return fail('original-M7-source-changed-during-scene-review');
      continue;
    }
    // A scene resolver can affect cave overrides or occupied voxels without
    // changing a schema-1 edit. Recheck BEFORE admitting and AGAIN once all
    // candidates have been inspected (later calls can invalidate earlier ones).
    if(!sourceUnchanged())return fail('original-M7-source-changed-during-scene-review');
    admitted.push(candidate); // Already deeply frozen by source clearance.
  }
  if(originalSave(world)!==before)
    return fail('source-changed-schema-1-world-during-review');
  if(!sourceUnchanged())return fail('original-M7-source-changed-during-scene-review');
  return Object.freeze({kind:'detached-snow-S3-original-scene-admission',
    safe:true,cx,cz,checked:raw.checked,sourceCandidates:raw.proposals.length,
    sourceRejected:raw.checked-raw.proposals.length,
    admitted:Object.freeze(admitted),rejected:Object.freeze(rejected),
    sceneRequests,sceneCalls,descriptorCalls,sourceWorldUnchanged:true,
    originalPlayerStepAndFullM7Accepted:false});
}

/** Build a detached 16x16 physical-cell slice from ONLY fully admitted trees.
 * This intentionally does not call the older, provenance-only preview path.
 * Actual M7 rendering remains unchanged until a new generator is approved.
 */
export function previewSnowS3FullyAdmittedChunk(world,cx,cz,deps){
  const review=reviewSnowS3SafeChunk(world,cx,cz,deps);
  if(!review.safe)return review;
  const minX=cx*16,minZ=cz*16,approved=new Map();
  for(const tree of review.admitted){
    for(const cell of tree.cells){
      const [x,y,z,block]=cell;
      if(x<minX||x>=minX+16||z<minZ||z>=minZ+16)continue;
      const k=x+','+y+','+z;
      if(approved.has(k)||world.get(x,y,z)!==0||
        world.edits.has(k)||world.environmentCaves?.get(x,y,z)!==undefined)
        return fail('admitted-physical-cells-changed-after-provenance');
      approved.set(k,Object.freeze([x,y,z,block]));
      if(approved.size>640)return fail('admitted-chunk-cell-budget-exceeded');
    }
  }
  const cells=Object.freeze([...approved.values()].sort((a,b)=>
    a[0]-b[0]||a[1]-b[1]||a[2]-b[2]));
  return Object.freeze({kind:'detached-snow-S3-fully-admitted-physical-chunk',
    safe:true,cx,cz,trees:review.admitted.length,
    sourceCandidates:review.sourceCandidates,
    physicalCells:cells.length,cells,
    noM7OrSchema1Changes:true,
    originalPlayerStepAndFullM7Accepted:false});
}
