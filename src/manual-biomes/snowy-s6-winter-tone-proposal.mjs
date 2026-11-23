// Snow S6: original-source-compatible visual research, NOT an active renderer.
// Continuous absolute world-space gradients only: no per-voxel random palette,
// material-ID substitution, schema change, mesh, edit, or live game import.
export const SNOW_S6_CANDIDATE_PROFILE='mythwrought-five-surface-regions-v8-snow-optin-research';
const BASE=Object.freeze({
  272:Object.freeze([.835,.861,.866]), // compacted pale snow
  276:Object.freeze([.786,.831,.848]), // softened natural glacier
  279:Object.freeze([.681,.722,.738])  // weathered alpine rime
});
const freeze=Object.freeze;
const valid=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
const clamp=n=>Math.min(1,Math.max(0,n));
export function previewSnowS6WinterTone(seed,x,z,id,weight){
  if(!Number.isInteger(seed)||seed!==(seed|0)||!valid(x)||!valid(z)||
    !Object.prototype.hasOwnProperty.call(BASE,id)||
    !Number.isFinite(weight)||weight<0||weight>1)
    throw new TypeError('Snow S6 requires genuine bounded authored snow coordinates');
  const phase=(seed%223)*.017;
  // Smooth periodic wavelengths (not random per cell). Shared by snow,
  // ice and rime so adjacent materials have no independent checker noise.
  const drift=.012*Math.sin(x*.067+z*.041+phase)+
    .009*Math.cos(x*.029-z*.053-phase*.5);
  const shade=drift+.009*(weight-.5);
  const rgb=freeze(BASE[id].map(c=>Math.round(clamp(c+shade)*1e6)/1e6));
  return freeze({x,z,sourceCapId:id,proposedLinearRgb:rgb,
    worldSpaceContinuous:true,currentM7MaterialUnchanged:true,
    draftOnly:true});
}
