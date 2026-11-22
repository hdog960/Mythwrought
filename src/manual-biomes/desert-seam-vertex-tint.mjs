// MYTHWROUGHT Desert Phase 3 experimental SURFACE-ONLY vertex gradient.
// Mesh-build time only. Never modifies blocks, edits, geometry, UVs, materials,
// shaders, saves or existing 9-float GPU vertex layout.
export const DESERT_SCREe_EDGE_COLOR=Object.freeze([.46,.43,.40]);
export const DESERT_SEAM_RADIUS=3;
export const DESERT_SEAM_MAX_BLEND=.64;

// Query only a fixed 6 x 6 square centered on this integer world vertex.
// All cubes that share a vertex use the SAME world-space query bounds,
// avoiding discontinuities caused by each cube's own coordinate origin.
export function nearestNaturalScreeSquared(wx,wz,y,originalScreeAt){
  if(!Number.isInteger(wx)||!Number.isInteger(wz)||!Number.isInteger(y))
    throw Error('Desert seam query requires integral source vertices');
  let best=Infinity;
  for(let x=wx-3;x<=wx+2;x++)for(let z=wz-3;z<=wz+2;z++){
    if(!originalScreeAt(x,z,y))continue;
    const dx=wx-x-.5,dz=wz-z-.5,d2=dx*dx+dz*dz;
    if(d2<best)best=d2;
  }
  return best;
}

export function desertSeamVertexTint(base,distanceSquared){
  if(distanceSquared>=DESERT_SEAM_RADIUS**2||!Number.isFinite(distanceSquared))return base;
  const linear=1-Math.sqrt(distanceSquared)/DESERT_SEAM_RADIUS;
  const weight=DESERT_SEAM_MAX_BLEND*linear*linear*(3-2*linear);
  if(weight<=0)return base;
  return [0,1,2].map(i=>base[i]*(1-weight)+DESERT_SCREe_EDGE_COLOR[i]*weight);
}
