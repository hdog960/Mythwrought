// SNOW S3/S5 DETACHED SOURCE-OBJECT CLEARANCE GATE.
// Use describeCandidateObject() and planEnvironmentalScenery() supplied by
// the original, unchanged M7 scene host. Check actual mesh bounds, supports
// AND collider AABBs — not just the scenery's central anchor.
// No edits, imports into M7, sidecar changes, or new scenery assets.
import {reviewSnowS3CandidateSelection} from './snowy-s3-collision-review.mjs';

const M7='mythwrought-five-surface-regions-v7';
const SOURCE_SCENE_BLOB='567c2055330b82d67cb37fab9c0101c7da33fc82';
const SOURCE_STAGE_BLOB='b9badfcc9c6d243721429a9893b33fdb06e5076b';
const EPS=1e-6;
const int=n=>Number.isSafeInteger(n);
const key=(x,y,z)=>`${x},${y},${z}`;
const validVector=(v,n,integer=false)=>Array.isArray(v)&&v.length===n&&
  v.every(x=>integer?int(x):Number.isFinite(x));
const safeScene=(desc,placement,seed)=>{
  if(!desc||desc.contract!=='nonblock-object-v1'||
    desc.seed!==seed||desc.sceneId!==placement.sceneId||
    !validVector(desc.anchor,3,true)||
    desc.anchor.some((v,i)=>v!==placement.anchor[i])||
    typeof desc.instanceKey!=='string'||!desc.instanceKey.startsWith('nb1:')||
    !validVector(desc.min,3)||!validVector(desc.max,3)||
    desc.min.some((v,i)=>v>desc.max[i])||
    !Array.isArray(desc.supports)||desc.supports.length>8||
    !desc.supports.every(v=>validVector(v,3,true))||
    !Array.isArray(desc.colliders)||desc.colliders.length>16||
    !desc.colliders.every(v=>validVector(v,6)&&
      v.slice(0,3).every((n,i)=>n<v[i+3])))return false;
  // Current source non-block objects are bounded. Fail on unusual geometry
  // rather than silently overlooking a distant limb or support.
  return desc.min.every((v,i)=>v>=desc.anchor[i]-12)&&
    desc.max.every((v,i)=>v<=desc.anchor[i]+13);
};
const overlaps=(voxel,min,max)=>[0,1,2].every(i=>
  voxel[i]+1>min[i]+EPS&&voxel[i]<max[i]-EPS);
const stop=(reason,info={})=>Object.freeze({
  kind:'detached-s3-s5-original-scene-clearance',safe:false,reason,...info
});

export function inspectSnowS3OriginalSceneClearance(world,candidate,{
  planScenery,describeScene,
  originalSceneBlob=SOURCE_SCENE_BLOB,
  originalStageBlob=SOURCE_STAGE_BLOB
}={}){
  if(world?.generationProfile?.generator!==M7||!int(world.seed)||
    !(world.edits instanceof Map)||typeof world.save!=='function'||
    typeof planScenery!=='function'||typeof describeScene!=='function'||
    originalSceneBlob!==SOURCE_SCENE_BLOB||
    originalStageBlob!==SOURCE_STAGE_BLOB||
    !reviewSnowS3CandidateSelection(candidate))
    return stop('missing-genuine-scene-or-tree-contract');
  const before=JSON.stringify(world.save());
  // Three chunk columns/rows around the tree's stem accommodate the
  // original scene planner's neighborhood-wide object discovery.
  const cx=Math.floor(candidate.x/16),cz=Math.floor(candidate.z/16);
  const checked=new Map(),all=[];
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
    let placements;
    try{placements=planScenery(world,cx+dx,cz+dz);}
    catch{return stop('original-scene-plan-error')}
    if(!Array.isArray(placements)||placements.length>48)
      return stop('unbounded-original-scene-plan');
    for(const placement of placements){
      if(!placement||typeof placement.sceneId!=='string'||
        !validVector(placement.anchor,3,true))
        return stop('malformed-original-scene-placement');
      let scene;
      try{scene=describeScene(world.seed,placement)}
      catch{return stop('invalid-original-scene-geometry')}
      if(!safeScene(scene,placement,world.seed))
        return stop('untrusted-original-scene-contract');
      // Snapshot original source geometry immediately: a later source call
      // cannot alter a previously reviewed mesh/collider array. Duplicated
      // instance keys across neighboring planner requests must agree exactly.
      const frozen=Object.freeze({sceneId:scene.sceneId,
        instanceKey:scene.instanceKey,
        min:Object.freeze([...scene.min]),max:Object.freeze([...scene.max]),
        supports:Object.freeze(scene.supports.map(v=>Object.freeze([...v]))),
        colliders:Object.freeze(scene.colliders.map(v=>Object.freeze([...v])))});
      const fingerprint=JSON.stringify(frozen);
      if(checked.has(scene.instanceKey)){
        if(checked.get(scene.instanceKey)!==fingerprint)
          return stop('inconsistent-duplicate-original-scene-identity');
        continue;
      }
      checked.set(scene.instanceKey,fingerprint);
      if(checked.size>432)return stop('unbounded-scene-neighborhood');
      all.push(frozen);
    }
  }
  let inspectedCells=0;
  for(const scene of all){
    for(const cell of candidate.cells){
      const voxel=cell.slice(0,3),where=key(...voxel);
      inspectedCells++;
      if(scene.supports.some(s=>key(...s)===where))
        return stop('would-remove-original-scene-support',{sceneId:scene.sceneId,
          sceneKey:scene.instanceKey,voxel:Object.freeze(voxel)});
      if(overlaps(voxel,scene.min,scene.max))
        return stop('overlaps-original-scene-mesh-bounds',{sceneId:scene.sceneId,
          sceneKey:scene.instanceKey,voxel:Object.freeze(voxel)});
      for(const bounds of scene.colliders){
        if(overlaps(voxel,bounds.slice(0,3),bounds.slice(3)))
          return stop('overlaps-original-scene-collider',{sceneId:scene.sceneId,
            sceneKey:scene.instanceKey,voxel:Object.freeze(voxel)});
      }
    }
  }
  if(JSON.stringify(world.save())!==before)
    return stop('world-changed-during-read-only-scene-review');
  return Object.freeze({kind:'detached-s3-s5-original-scene-clearance',
    safe:true,reviewedScenes:all.length,reviewedCells:inspectedCells,
    inspectedChunks:9,worldUnchanged:true,
    caveAndLivePlayerPhysicsAccepted:false});
}
