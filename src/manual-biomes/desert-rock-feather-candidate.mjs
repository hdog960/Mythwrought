// Isolated V7 Desert-only proposal. Existing worlds and protected gameplay
// branches do not import this until explicitly accepted.
export const DESERT_FEATHER_ROCK=261;
export function desertRockFeatherCandidate(seed,x,z,originalCap,eligible,screeAdjacent){
  if(!eligible||originalCap!==258||!screeAdjacent)return originalCap;
  let n=Math.imul(x,0x45d9f3b)^Math.imul(z,0x119de1f3)^(seed|0);
  n=Math.imul(n^(n>>>16),0x27d4eb2d);
  return ((n^(n>>>15))>>>0)%3===0?DESERT_FEATHER_ROCK:originalCap;
}
