// Deterministic opt-in enchanted-tree mesh-cell ownership. Neighboring
// eight-block seed sites can have touching 4-block crowns; all chunk builds
// must agree about any overlapping voxels, independent of site iteration.
// This only applies when BOTH voxels use the three new enchanted tree IDs.
// Historical M7 and other-biome materials keep their original write order.
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';

const ranks=new Map([
  [G.aetherLeaves,1],
  [G.moonLeaves,2],
  [G.aetherBark,3]
]);

export function resolveEnchantedTreeOverlap(previous,incoming){
  if(previous===undefined)return incoming;
  const priorRank=ranks.get(previous),nextRank=ranks.get(incoming);
  if(priorRank===undefined||nextRank===undefined)return incoming;
  return priorRank>=nextRank?previous:incoming;
}
