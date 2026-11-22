// Research-only, deterministic material feather suggestion.
// Not imported into production world generation; never edits existing saves.
// Preserve every real mountain-connected scree cell, and propose existing
// Desert rock (261) only for adjacent guarded hardpan (258) cells.
export const FEATHER_DESERT_ROCK=261;
export function proposedDesertRockFeather({seed,x,z,cap,eligible,screeNeighbor}){
  if(!eligible||cap!==258||!screeNeighbor)return cap;
  // Coordinate hash: zero state, no random seed and stable across chunks.
  let n=Math.imul(x,0x45d9f3b)^Math.imul(z,0x119de1f3)^(seed|0);
  n=Math.imul(n^(n>>>16),0x27d4eb2d);
  return ((n^(n>>>15))>>>0)%3===0?FEATHER_DESERT_ROCK:cap;
}
