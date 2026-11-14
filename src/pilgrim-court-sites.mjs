// Gate A :36 — bounded, deterministic discovery survey for opt-in physical pilgrim courts.
// Read-only: no seeded world changes, edits, persistent IDs, or automatic placement.
import {planVoxelPilgrimCourt,placeVoxelPilgrimCourt} from './voxel-pilgrim-court.mjs';

function mix(n) {
  n = Math.imul(n ^ (n >>> 16), 0x7feb352d);
  n = Math.imul(n ^ (n >>> 15), 0x846ca68b);
  return (n ^ (n >>> 16)) >>> 0;
}
function score(seed,x,z) {
  return mix((seed ^ Math.imul(x, 73856093) ^ Math.imul(z, 19349663)) | 0);
}

/**
 * Find at most one genuine, traversable, physical gateway site near a known
 * exploration origin. This survey never builds anything and never scans an
 * unbounded world. Caller must explicitly place the returned plan.
 *
 * Sites are sorted by seeded hash, NOT discovery iteration order; therefore
 * repeated surveys produce identical results for unchanged worlds.
 */
export function surveyPilgrimCourtSites(world, originX, originZ, options={}) {
  const {minDistance=48,maxDistance=144,step=4,maxCandidates=256,
    maxResults=1,planner=planVoxelPilgrimCourt,excludeSites=[],exclusionRadius=48} = options;
  if (!world || !Number.isInteger(world.seed) ||
      !Number.isInteger(originX) || !Number.isInteger(originZ) ||
      !Number.isInteger(minDistance) || minDistance<24 ||
      !Number.isInteger(maxDistance) || maxDistance<minDistance || maxDistance>256 ||
      !Number.isInteger(step) || step<2 || step>32 ||
      !Number.isInteger(maxCandidates) || maxCandidates<1 || maxCandidates>1024 ||
      !Number.isInteger(maxResults) || maxResults<1 || maxResults>8 ||
      typeof planner!=='function' || !Array.isArray(excludeSites) || excludeSites.length>128 ||
      !Number.isInteger(exclusionRadius) || exclusionRadius<24 || exclusionRadius>256 ||
      !excludeSites.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isSafeInteger))) return [];
  const candidates=[];
  // At most 1024 candidate sites, independent of map size and chunk count.
  const radius=Math.ceil(maxDistance/step);
  for(let iz=-radius;iz<=radius;iz++)for(let ix=-radius;ix<=radius;ix++){
    const dx=ix*step,dz=iz*step,dist2=dx*dx+dz*dz;
    if(dist2<minDistance*minDistance || dist2>maxDistance*maxDistance)continue;
    const x=originX+dx,z=originZ+dz;
    candidates.push({x,z,rank:score(world.seed,x,z)});
  }
  candidates.sort((a,b)=>a.rank-b.rank || a.x-b.x || a.z-b.z);
  const found=[];
  for(const site of candidates.slice(0,maxCandidates)){
    // Never propose a court over an already discovered or constructed landmark.
    if(excludeSites.some(([x,z])=>Math.hypot(x-site.x,z-site.z)<exclusionRadius))continue;
    const plan=planner(world,site.x,site.z);
    if(!plan || !Array.isArray(plan.origin) || plan.origin.length!==3 ||
       plan.origin[0]!==site.x || plan.origin[2]!==site.z ||
       !Number.isInteger(plan.origin[1]) || plan.optIn!==true)continue;
    // Reject nearby duplicates; a court occupies 23 cells along z.
    if(found.some(other=>Math.abs(other.origin[0]-site.x)<32 &&
       Math.abs(other.origin[2]-site.z)<40))continue;
    found.push(plan);
    if(found.length===maxResults)break;
  }
  return found;
}

// Explicit opt-in construction, with the same last-second revalidation and
// rollback protections as the integrated physical court placement routine.
export function placeSurveyedPilgrimCourt(world,plan){
  return placeVoxelPilgrimCourt(world,plan);
}
