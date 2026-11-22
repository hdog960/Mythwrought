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

export function desertSeamBlendWeight(distanceSquared){
  if(distanceSquared>=DESERT_SEAM_RADIUS**2||!Number.isFinite(distanceSquared))return 0;
  const linear=1-Math.sqrt(distanceSquared)/DESERT_SEAM_RADIUS;
  return DESERT_SEAM_MAX_BLEND*linear*linear*(3-2*linear);
}
export function desertSeamVertexTint(base,distanceSquared){
  const weight=desertSeamBlendWeight(distanceSquared);
  if(weight<=0)return base;
  return [0,1,2].map(i=>base[i]*(1-weight)+DESERT_SCREe_EDGE_COLOR[i]*weight);
}
// aMat is still 1 Float32 per vertex. The integer ID remains the original
// terrain art material 40. Only natural eligible Desert boundary vertices
// receive a small fractional shader-mix factor; water/particles use other IDs.
export function desertSeamPackedTerrainTag(originalArtTag,weight){
  if(originalArtTag!==40||weight<=0)return originalArtTag;
  if(!Number.isFinite(weight)||weight>DESERT_SEAM_MAX_BLEND)
    throw Error('Invalid Desert seam material mix');
  return 40+weight;
}

export function canBlendNaturalDesertSurface({id,edited,region,sourceSurface,y}){
  return id===258&&!edited&&region?.name==='desert'&&region.weight<=.50&&
    sourceSurface?.top===y&&sourceSurface.id===258;
}
