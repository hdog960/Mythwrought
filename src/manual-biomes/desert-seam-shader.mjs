// Isolated Desert P3 experiment: a tiny source-exact shader substitution.
// The live shader already carries fract(aMat) as vPack2Alpha for materials
// 20/23. Natural material 40 always had an integer tag before this branch.
// Only DESERT-source tagged 40.x vertices may opt into terrain texture mixing.
// No shader behavior changes for bare tag40, material42, or any other block.
export const ORIGINAL_DESERT_TERRAIN_SHADE=
  'if(vMat==40)      shade=1.0+.045*sin(vUv.x*1.45+vUv.y*.61+1.2*sweep)+.04*(grit-.5);';
const RESEARCH_DESERT_TERRAIN_SHADE=`if(vMat==40){
      float sandShade=1.0+.045*sin(vUv.x*1.45+vUv.y*.61+1.2*sweep)+.04*(grit-.5);
      shade=sandShade;
      if(vPack2Alpha>0.001){
        float stoneGrit=hashCell(floor(vUv*15.0)+42.0);
        float stoneShade=1.0+.06*sin(vUv.y*1.23+.82*sweep)+.085*(stoneGrit-.5);
        shade=mix(sandShade,stoneShade,clamp(vPack2Alpha,0.0,0.64));
      }
    }`;
export function withDesertSeamTextureBlend(fragment){
  if(typeof fragment!=='string'||!fragment.includes('in float vPack2Alpha;'))
    throw Error('Desert shader requires existing fractional material channel');
  if(!fragment.includes(ORIGINAL_DESERT_TERRAIN_SHADE)||
     fragment.indexOf(ORIGINAL_DESERT_TERRAIN_SHADE)!==
       fragment.lastIndexOf(ORIGINAL_DESERT_TERRAIN_SHADE))
    throw Error('Unexpected original Desert terrain shader contract');
  return fragment.replace(ORIGINAL_DESERT_TERRAIN_SHADE,RESEARCH_DESERT_TERRAIN_SHADE);
}
export const DESERT_SHADER_RESEARCH_POLICY=Object.freeze({
  physicalBlockIdsChanged:false,vertexFloatStride:9,fragmentTag:40,
  maxFractionalBlend:0.64,otherMaterialTagsChanged:false,
  baselineMaterial40PreservedWhenUntagged:true
});
