// STRICT NEW S3 DETACHED PLAYER-BODY ADMISSION, never a live M7 generator.
// Only the original real voxel.collides callback may satisfy the full-game
// acceptance gate; local substitutes are explicitly just focused regressions.
import {reviewSnowS3SafeChunk} from './snowy-s3-integrated-admission.mjs';
import {auditSnowS3OriginalPlayerBody} from './snowy-s3-player-body-audit.mjs';

const fail=reason=>Object.freeze({kind:'detached-S3-original-player-body-chunk',safe:false,reason});
// The original collision callback is supposed to be pure. Save checks do
// not cover transient or direct cave runtime modifications, so capture a
// bounded cave/voxel witness for every source-approved physical candidate.
function sourceSnapshot(world,trees){
  if(typeof world.environmentCaves?.get!=='function'||typeof world.get!=='function')
    return null;
  const cells=new Set();
  for(const tree of trees){
    for(const [x,y,z] of tree.cells)cells.add(x+','+y+','+z);
    for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)
      for(let dy=-1;dy<=3;dy++)
        cells.add((tree.x+dx)+','+(tree.floor+dy)+','+(tree.z+dz));
  }
  const coords=[...cells].sort(),values=[];
  for(const coord of coords){
    const [x,y,z]=coord.split(',').map(Number);
    const cave=world.environmentCaves.get(x,y,z);
    values.push([coord,cave===undefined?null:cave,world.get(x,y,z)]);
  }
  return JSON.stringify(values);
}
export function reviewSnowS3PlayerApprovedChunk(world,cx,cz,{collides,...source}={}){
  if(typeof collides!=='function'||typeof world?.save!=='function')
    return fail('missing-original-body-or-schema-1-source');
  const before=JSON.stringify(world.save());
  const survey=reviewSnowS3SafeChunk(world,cx,cz,source);
  if(!survey.safe)return fail(survey.reason);
  const admitted=[],rejected=[...survey.rejected];
  const originalSource=sourceSnapshot(world,survey.admitted);
  if(originalSource===null)return fail('missing-original-cave-runtime-for-player-collision');
  let probes=0,connections=0;
  for(const tree of survey.admitted){
    const result=auditSnowS3OriginalPlayerBody(world,tree,{collides});
    probes+=result.collisionProbes??0;
    if(!result.safe){
      if(result.reason==='original-schema-1-save-mutated-during-body-review'||
         result.reason==='original-player-collision-callback-failed')
        return fail(result.reason);
      rejected.push(Object.freeze({key:tree.key,reason:result.reason}));
      continue;
    }
    connections+=result.preservedPairs;
    admitted.push(tree);
  }
  if(JSON.stringify(world.save())!==before)
    return fail('source-changed-schema-1-during-physical-player-review');
  if(sourceSnapshot(world,survey.admitted)!==originalSource)
    return fail('original-M7-cave-or-voxel-state-changed-during-player-review');
  return Object.freeze({kind:'detached-S3-original-player-body-chunk',safe:true,cx,cz,
    sourceCandidates:survey.sourceCandidates,sourceAdmitted:survey.admitted.length,
    admitted:Object.freeze(admitted),rejected:Object.freeze(rejected),
    collisionProbes:probes,preservedPortalConnections:connections,
    originalBodyCallbackRequired:true,notLiveM7:true,sourceWorldUnchanged:true});
}
