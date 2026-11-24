// Snow S11: isolated shader-source transformer for original, physically
// authenticated natural snow material 41. Zero production material changes.
// No textures, fragment discards, extra draw calls, material IDs or shaders.
export const ORIGINAL_SNOW41_BRANCH=
  'else if(vMat==41) shade=1.0+.025*sweep+.065*(grit-.5);';
export const RESEARCH_S11_WIND_SNOW41=[
  'else if(vMat==41){ // detached S11 research: broad continuous wind-snow contours',
  '      // WORLD UV supplied unchanged by genuine original mesh surface.',
  '      float snowSweepA=sin(vUv.x*.14+vUv.y*.22+.65*sweep);',
  '      float snowSweepB=sin(vUv.x*.041-vUv.y*.071);',
  '      shade=.955+.032*sweep+.050*snowSweepA+.022*snowSweepB+.006*(grit-.5);',
  '    }'
].join('\n');
export function snowS11ResearchOnlyMaterial41(original){
  if(typeof original!=='string'||original.length<1000||
    original.split(ORIGINAL_SNOW41_BRANCH).length!==2||
    !original.includes('}else if(vMat>=40&&vMat<=43)')||
    !original.includes('export const STORYBOOK_MATERIAL_FRAGMENT_SHADER')||
    !original.includes('newTextures:0')||!original.includes('newDrawCalls:0'))
    throw new TypeError('S11 requires exact ORIGINAL Storybook Snow41 source');
  const changed=original.replace(ORIGINAL_SNOW41_BRANCH,RESEARCH_S11_WIND_SNOW41);
  if(changed.split(RESEARCH_S11_WIND_SNOW41).length!==2)
    throw new Error('S11 must only change one original authored snow41 branch');
  return changed;
}
export const S11_MATERIAL_CONTRACT=Object.freeze({
  material:41,worldUv:true,sourceOnly:true,
  noNewTexture:true,noNewDrawCalls:true,
  originalMaterial0GlacierUnchanged:true,
  originalSourceWorldUnmodified:true,
  playerIceUnchanged:true,unregisteredWorldProfile:true
});
