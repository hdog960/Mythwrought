// Read-only adapter for network36 proposal-v1 states. NOT proof of delivered energy.
export const NETWORK36_CANDIDATE_V1 = Object.freeze({id:'resonance-devices48-network36-candidate-v1',upstream:'resonance-network36-proposal-v1',productionBound:false});
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const validId=s=>typeof s==='string'&&/^[a-z0-9_-]{1,48}$/.test(s);
export function mapNetwork36Candidate(batch,solution,{expectedTick,expectedSeed,sourceSha}={}) {
  if(!batch||batch.contract!=='resonance-devices48-batch-v1'||!natural(batch.tick)||!natural(batch.seed)||!Array.isArray(batch.entries)||!natural(batch.demand))throw Error('invalid batch');
  if(batch.tick!==expectedTick||batch.seed!==expectedSeed)throw Error('world/tick mismatch');
  if(!solution||solution.contract!==NETWORK36_CANDIDATE_V1.upstream||solution.tick!==expectedTick||!solution.deviceStates||Array.isArray(solution.deviceStates)||typeof solution.deviceStates!=='object')throw Error('invalid upstream snapshot');
  if(typeof sourceSha!=='string'||!/^[0-9a-f]{40}$/.test(sourceSha))throw Error('unpinned upstream source');
  const seen=new Set();let demand=0;
  const grants=batch.entries.map(e=>{
    if(!e||!validId(e.deviceId)||seen.has(e.deviceId)||!natural(e.demand)||e.demand>64)throw Error('invalid device entry');
    seen.add(e.deviceId);demand+=e.demand;
    if(!Object.hasOwn(solution.deviceStates,e.deviceId))throw Error('missing upstream state');
    const state=solution.deviceStates[e.deviceId];
    if(!['active','shortage','disconnected'].includes(state))throw Error('unknown upstream state');
    return Object.freeze({id:e.deviceId,granted:state==='active'?e.demand:0});
  });
  if(demand!==batch.demand||demand>256||grants.length>16)throw Error('invalid aggregate demand');
  // An upstream active flag is only a candidate allocation. Caller must independently
  // validate actual delivered grants before invoking any production machinery.
  return Object.freeze({contract:NETWORK36_CANDIDATE_V1.id,sourceSha,seed:expectedSeed,tick:expectedTick,candidateGrants:Object.freeze(grants),delivered:false,productionBound:false});
}
