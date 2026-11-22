// Isolated Desert Phase 3: reciprocal visual-only boundary tint.
// Only genuinely generated, currently visible original M7 terrain top caps
// can qualify. Never changes material IDs, world generation, save schema,
// geometry, shaders, vertex count/stride, or other biomes.
import {nearestNaturalScreeSquared,DESERT_SEAM_RADIUS} from './desert-seam-vertex-tint.mjs';

export const SCREE_DESERT_CONTACT_COLOR=Object.freeze([.66,.50,.36]);
export const SCREE_DESERT_MAX_WARMTH=.55;
export function canWarmSourceScree({id,edited,region,sourceSurface,y}){
  return id===401&&!edited&&sourceSurface?.top===y&&
    sourceSurface?.id===401&&(
      region?.name==='desert'||
      region?.name==='mountain'&&region.weight<=.55
    );
}
export function canUseDesertHardpanCue({sourceSurface,region,edited,actualId,atY,sampleY}){
  return !edited&&sourceSurface?.id===258&&
    sourceSurface?.top===atY&&actualId===258&&
    region?.name==='desert'&&region.weight<=.50&&
    Math.abs(atY-sampleY)<=1;
}
export function nearestDesertHardpanSquared(wx,wz,y,isOriginalHardpan){
  return nearestNaturalScreeSquared(wx,wz,y,isOriginalHardpan);
}
export function warmScreeVertexColor(base,distanceSquared){
  if(!Number.isFinite(distanceSquared)||distanceSquared>=DESERT_SEAM_RADIUS**2)
    return base;
  const linear=1-Math.sqrt(distanceSquared)/DESERT_SEAM_RADIUS;
  const blend=SCREE_DESERT_MAX_WARMTH*linear*linear*(3-2*linear);
  if(blend<=0)return base;
  return [0,1,2].map(i=>base[i]*(1-blend)+SCREE_DESERT_CONTACT_COLOR[i]*blend);
}
