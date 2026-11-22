// MYTHWROUGHT Desert P3: research-only contiguous band, not wired to gameplay.
// No coordinate hash or randomness. ORIGINAL eligible mountain-scree columns
// are immutable; original protected and non-Desert columns fail closed.
// Only hardpan immediately beside original authentic Desert scree may convert
// to existing Desert rock, creating a one-block rock apron. Radius is fixed.
export const DESERT_BAND_ROCK=261;
export const DESERT_BAND_RADIUS=1;
export const DESERT_BAND_OFFSETS=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
export function proposedDesertBandCap(cell,originalAt){
  if(!cell?.eligible||cell.biome!=='desert'||cell.weight>.5||cell.cap!==258)
    return cell?.cap??null;
  for(const [dx,dz] of DESERT_BAND_OFFSETS){
    const neighbor=originalAt(cell.x+dx,cell.z+dz);
    if(neighbor?.eligible&&neighbor.biome==='desert'&&neighbor.cap===401)
      return DESERT_BAND_ROCK;
  }
  return cell.cap;
}
