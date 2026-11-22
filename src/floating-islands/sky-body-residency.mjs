// MYTHWROUGHT: fail-closed sky+surface iPhone GPU residency admission.
// The earlier default upper-slot cap of SIX cannot certify a player body
// touching two vertical slices AND four horizontal chunks (EIGHT regions).
// Plan at most eight sky slots, always within 25 SHARED ground/sky slots.
// World metadata is supplied by the actual source; no generated voxels here.
import {skyIslandBodyRegions,skyIslandMeshKey,planSkyIslandResidency,
  planSkyIslandMeshJobs,SKY_ISLAND_LIGHTING_POLICY} from './sky-runtime-adapter.mjs';
export const SKY_REQUIRED_SEAM_SLOTS=8;
export const SKY_TOTAL_SHARED_GPU_SLOTS=25;
const fail=s=>{throw new TypeError('Sky body residency: '+s);};
const safe=Number.isSafeInteger;
const freezeRows=a=>Object.freeze(a.map(row=>Object.freeze({...row})));
const realGroundKey=(cx,cz)=>cx+','+cz; // original src/depth.mjs depthMeshKey(...,0)
export function planSafeSkyResidency({position,ground=[],sky=[],residentKeys=[],
    maxSkyResident=SKY_REQUIRED_SEAM_SLOTS}={}){
  if(!position||![position.x,position.feet,position.z].every(Number.isFinite)||
     position.feet>256||!Array.isArray(ground)||!Array.isArray(sky)||
     !Array.isArray(residentKeys)||!residentKeys.every(k=>typeof k==='string')||
     !safe(maxSkyResident)||maxSkyResident<SKY_REQUIRED_SEAM_SLOTS||
     maxSkyResident>SKY_TOTAL_SHARED_GPU_SLOTS)
    fail('full-body bounded 25-slot residency inputs required');
  const mandatory=skyIslandBodyRegions(position);
  const requiredKeys=new Set(mandatory.map(row=>row.key));
  if(requiredKeys.size>maxSkyResident)fail('not enough sky slots for full body');
  const skyCandidates=new Map();
  for(const p of sky){
    if(!p||![p.cx,p.cz,p.section].every(safe))fail('unsafe sky metadata');
    const key=skyIslandMeshKey(p.cx,p.cz,p.section);
    skyCandidates.set(key,{kind:'sky',key,cx:p.cx,cz:p.cz,section:p.section});
  }
  const missingCandidates=[...requiredKeys].filter(k=>!skyCandidates.has(k));
  // Reuse the prior weighted ranking; EIGHT sky slots is an explicit opt-in
  // because it is the maximum geometric body overlap, not a budget increase.
  const ranked=planSkyIslandResidency({position,ground,sky,
    maxResident:SKY_TOTAL_SHARED_GPU_SLOTS,maxSkyResident,minimumSkyReserve:3});
  const chosen=[],selected=new Set();let skyCount=0;
  const add=row=>{
    if(!row||selected.has(row.key)||chosen.length>=SKY_TOTAL_SHARED_GPU_SLOTS||
      (row.kind==='sky'&&skyCount>=maxSkyResident))return false;
    chosen.push(row);selected.add(row.key);
    if(row.kind==='sky')skyCount++;
    return true;
  };
  const centerX=Math.floor(position.x/16),centerZ=Math.floor(position.z/16);
  // Preserve original 3x3 surface priority while close to terrain.
  if(position.feet<=52)
    for(const p of ground){
      if(!p||![p.cx,p.cz].every(safe))fail('unsafe source ground metadata');
      if(Math.max(Math.abs(p.cx-centerX),Math.abs(p.cz-centerZ))>1)continue;
      add({kind:'ground',cx:p.cx,cz:p.cz,key:realGroundKey(p.cx,p.cz)});
    }
  // All eight *authenticated* seam sections outrank optional sky geometry.
  for(const p of mandatory)add(skyCandidates.get(p.key));
  // Convert the old planner's abstract ground:cx,cz identities to the REAL
  // original depthMeshKey(...,0) so GPU ownership never duplicates terrain.
  for(const row of ranked.slots)add(row.kind==='ground'?{...row,key:realGroundKey(row.cx,row.cz)}:row);
  const desired=freezeRows(chosen),resident=new Set(residentKeys);
  const missingResident=[...requiredKeys].filter(k=>!resident.has(k));
  const residentPlan=planSkyIslandMeshJobs({desired,resident:residentKeys,maxNewJobs:2});
  return Object.freeze({desired,total:desired.length,skyCount,
    groundCount:desired.length-skyCount,
    requiredKeys:Object.freeze([...requiredKeys]),
    missingCandidates:Object.freeze(missingCandidates),
    missingResident:Object.freeze(missingResident),
    canAdmitFlight:!missingCandidates.length&&!missingResident.length,
    canPublishPlan:!missingCandidates.length,
    meshJobs:residentPlan.requests,
    requiredSkySlots:mandatory.length,
    maxResident:SKY_TOTAL_SHARED_GPU_SLOTS,
    shadowPolicy:SKY_ISLAND_LIGHTING_POLICY});
}
