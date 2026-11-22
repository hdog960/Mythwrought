// Isolated Desert P3 visual-only color feather. No block writes, new IDs,
// vertex attributes, texture bindings, GPU uploads or shader work.
// Called solely while building an exposed original M7 hardpan mesh face.
export const DESERT_SCREe_EDGE_COLOR=Object.freeze([.46,.43,.40]);
export function desertSeamVertexTint(base,px,pz,contact){
  // One-block continuous quad-edge gradient. Keep opposite corners identical
  // to original natural hardpan, while coloring the contacting edge toward
  // the established original scree vertex palette.
  const east=contact.east&&px>.5?1:0;
  const west=contact.west&&px<.5?1:0;
  const south=contact.south&&pz>.5?1:0;
  const north=contact.north&&pz<.5?1:0;
  const weight=Math.min(1,east+west+south+north)*.72;
  if(weight===0)return base;
  return [0,1,2].map(i=>base[i]*(1-weight)+DESERT_SCREe_EDGE_COLOR[i]*weight);
}
