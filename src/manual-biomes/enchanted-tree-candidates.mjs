// Phase 2 source-only candidate silhouettes for M7 Enchanted Forest.
// NOT selected by historical M7 worlds. Activated only through an explicit
// source-local opt-in while generator version/save migration is under review.
// Uses existing mineable IDs. No globals, no random calls, no save writes.
import {WORLD_MAX_Y} from '../depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';

export const ENCHANTED_TREE_CANDIDATE_KIND=Object.freeze({
  STARSPIRE:'starspire',MOONWILLOW:'moonwillow',ANCIENT_GIANT:'ancient-giant'
});
export const ENCHANTED_TREE_MAX_RADIUS=4;
export const ENCHANTED_TREE_MAX_CELLS=240;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

// Selection is independent of the existing seeded tree site and density rolls.
// NEVER change treeRoll's existing sequence, including snow and conifer sites.
export function enchantedTreeCandidateKind(styleRoll){
  if(!(styleRoll>=0&&styleRoll<1))throw Error('Invalid enchanted candidate style roll');
  return styleRoll<.14?ENCHANTED_TREE_CANDIDATE_KIND.ANCIENT_GIANT:
    styleRoll<.63?ENCHANTED_TREE_CANDIDATE_KIND.STARSPIRE:
      ENCHANTED_TREE_CANDIDATE_KIND.MOONWILLOW;
}
export function buildEnchantedTreeCandidate(x,floor,z,styleRoll){
  if(![x,floor,z].every(Number.isInteger))throw Error('Tree origin must be integer');
  const species=enchantedTreeCandidateKind(styleRoll);
  // Ancient Giants deliberately require low valley floors: physical canopy
  // cannot extend above WORLD_MAX_Y=19. A 4–6x tree is not feasible here.
  const trunk=species===ENCHANTED_TREE_CANDIDATE_KIND.ANCIENT_GIANT?
    10+Math.floor(styleRoll/.14*2):
    species===ENCHANTED_TREE_CANDIDATE_KIND.STARSPIRE?
      8+Math.floor((styleRoll-.14)/.49*3):
      7+Math.floor((styleRoll-.63)/.37*2);
  const highest=species===ENCHANTED_TREE_CANDIDATE_KIND.MOONWILLOW?trunk+1:trunk+2;
  if(floor+highest>WORLD_MAX_Y)return null;
  const items=new Map();
  const put=(dx,dy,dz,id)=>{
    if(dy<1||Math.abs(dx)>ENCHANTED_TREE_MAX_RADIUS||
       Math.abs(dz)>ENCHANTED_TREE_MAX_RADIUS||
       floor+dy>WORLD_MAX_Y)throw Error('Candidate outside physical envelope');
    items.set((x+dx)+','+(floor+dy)+','+(z+dz),[x+dx,floor+dy,z+dz,id]);
  };
  if(species===ENCHANTED_TREE_CANDIDATE_KIND.STARSPIRE){
    // Slim offset shaft, tiered pointed moonlit crown and side spire tips.
    const bend=styleRoll<.38?-1:1;
    for(let dy=1;dy<=trunk;dy++)put(dy>=trunk-2?bend:0,dy,0,G.aetherBark);
    put(bend,trunk-3,0,G.aetherBark);
    for(let dy=trunk-3;dy<=trunk+2;dy++){
      const radius=dy<=trunk-2?2:dy===trunk-1?2:dy===trunk?1:0;
      for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
        if(Math.abs(dx)+Math.abs(dz)>radius+1||
          (dx===0&&dz===0&&dy<=trunk))continue;
        put(bend+dx,dy,dz,dy>=trunk?G.moonLeaves:G.aetherLeaves);
      }
    }
    for(const dir of [-1,1]){
      put(bend+2*dir,trunk-2,0,G.aetherBark);
      put(bend+2*dir,trunk-1,0,G.moonLeaves);
      put(bend+2*dir,trunk,0,G.moonLeaves);
    }
  }else if(species===ENCHANTED_TREE_CANDIDATE_KIND.MOONWILLOW){
    // Raised sweeping arms with distinct drooping foliage strands. The
    // lowest leaf wisps remain well above the ground, leaving player access.
    const bend=styleRoll<.81?-1:1;
    for(let dy=1;dy<=trunk;dy++)put(dy>=trunk-2?bend:0,dy,0,G.aetherBark);
    for(let dy=trunk-2;dy<=trunk+1;dy++){
      const r=dy===trunk+1?1:dy===trunk-2?2:3;
      for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){
        const distance=Math.abs(dx)+Math.abs(dz);
        if(distance>r+1||distance<1&&dy<trunk)continue;
        // Open an airy inner crown rather than filling a solid green cube.
        if(dy===trunk-2&&distance<2)continue;
        put(bend+dx,dy,dz,dy===trunk+1?G.moonLeaves:G.aetherLeaves);
      }
    }
    for(const [dx,dz] of [[-3,0],[3,0],[0,-3],[0,3],[-2,-2],[2,2]])
      for(let dy=trunk-3;dy<=trunk-1;dy++)
        put(bend+dx,dy,dz,G.moonLeaves);
    for(const dx of [-2,2])put(bend+dx,trunk-1,0,G.aetherBark);
  }else{
    // A true mineable two-by-two old-growth shaft, rooted on four supporting
    // columns. Bounded branching crown reaches up to 4 voxels horizontally.
    for(let dy=1;dy<=trunk;dy++){
      for(let dx=0;dx<=1;dx++)for(let dz=0;dz<=1;dz++)
        put(dx,dy,dz,G.aetherBark);
    }
    for(const [dx,dz] of [[-2,0],[3,0],[0,-2],[0,3]])
      for(let dy=trunk-3;dy<=trunk-1;dy++)
        put(dx,dy,dz,G.aetherBark);
    for(let dy=trunk-3;dy<=trunk+2;dy++){
      const radius=dy<trunk-1?2:dy<=trunk?3:dy===trunk+1?3:1;
      for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
        const distance=Math.max(Math.abs(dx),Math.abs(dz));
        if(distance>radius||distance===radius&&
          Math.abs(dx)+Math.abs(dz)>radius+2)continue;
        if(dx>=0&&dx<=1&&dz>=0&&dz<=1&&dy<=trunk)continue;
        put(dx,dy,dz,dy>=trunk?G.moonLeaves:G.aetherLeaves);
      }
    }
  }
  const cells=[...items.values()];
  if(cells.length>ENCHANTED_TREE_MAX_CELLS)
    throw Error('Candidate tree exceeds deterministic voxel budget '+cells.length);
  return Object.freeze({
    species,origin:Object.freeze([x,floor,z]),
    trunkHeight:trunk,highestY:floor+highest,
    footprint:species===ENCHANTED_TREE_CANDIDATE_KIND.ANCIENT_GIANT?
      Object.freeze([[0,0],[1,0],[0,1],[1,1]].map(v=>Object.freeze(v))):
      Object.freeze([Object.freeze([0,0])]),
    cells:Object.freeze(cells.map(v=>Object.freeze(v)))
  });
}
