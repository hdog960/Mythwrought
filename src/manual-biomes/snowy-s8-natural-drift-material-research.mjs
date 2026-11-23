// Snow S8 isolated shader laboratory: return an IN-MEMORY candidate module.
// Never imported by the live renderer; no new shader, texture or material IDs.
// Pigment is world-space, deterministic, low frequency, with less 15x15 grit.
// Exact source needle keeps Desert/Mountain/plains and legacy shaders intact.
export const SNOW_S8_MATERIAL_TAG=41;
export const SNOW_S8_EXISTING_BRANCH=
  'else if(vMat==41) shade=1.0+.025*sweep+.065*(grit-.5);';
export const SNOW_S8_DRAFT_BRANCH=[
  'else if(vMat==41){ // S8 test-only natural snowdrift material, world-space UV.',
  '      // Remove block-sized high-contrast grit in favor of broad winter drifts.',
  '      float longDrift=sin(vUv.x*.115+vUv.y*.081+.72*sweep);',
  '      shade=.965+.040*sweep+.028*longDrift+.012*(grit-.5);',
  '    }'
].join('\n');
export function composeSnowS8NaturalDriftMaterial(original){
  if(typeof original!=='string'||original.length<200||
     original.split(SNOW_S8_EXISTING_BRANCH).length!==2||
     !original.includes('}else if(vMat>=40&&vMat<=43)')||
     !original.includes("export const STORYBOOK_MATERIAL_FRAGMENT_SHADER"))
    throw new TypeError('Snow S8 requires exact pinned original storybook vMat41 GLSL branch');
  const draft=original.replace(SNOW_S8_EXISTING_BRANCH,SNOW_S8_DRAFT_BRANCH);
  if(draft===original||draft.split(SNOW_S8_DRAFT_BRANCH).length!==2)
    throw new Error('Snow S8 cannot duplicate or silently skip material branch');
  return draft;
}
