// Opaque render-only architectural roofing for future landmark geometry.
// Tag 16 is NOT a voxel block ID and cannot be placed or saved.
export const STORYBOOK_ROOF_RENDER_TAG=16;
export const STORYBOOK_ROOF_GLSL=String.raw`
    // Overlapping scalloped ceramic shingles with warm terracotta glaze.
    // Alternating rows avoid straight vertical seams at mobile viewing sizes.
    vec2 roofGrid=vec2(vUv.x*6.0,vUv.y*7.0);
    float roofRow=floor(roofGrid.y);
    vec2 roofCell=vec2(roofGrid.x+mod(roofRow,2.0)*.5,roofGrid.y);
    vec2 roofLocal=fract(roofCell);
    float roofVariation=hashCell(floor(roofCell)+vec2(47.0,83.0));
    float roofSeam=1.0-smoothstep(.018,.075,min(roofLocal.x,1.0-roofLocal.x));
    float roofLap=1.0-smoothstep(.02,.13,roofLocal.y);
    float roofScallop=1.0-smoothstep(.025,.085,
      abs(length((roofLocal-vec2(.5,.72))*vec2(1.0,1.25))-.47));
    float roofGlaze=.5+.5*sin(roofLocal.x*9.0+roofLocal.y*6.0+roofVariation*4.0);
    shade=.78+.18*roofVariation+.10*roofGlaze-.22*roofSeam-.15*roofLap-.09*roofScallop;
    base=mix(base,vec3(.75,.31,.24),(.35+.12*roofVariation)*near);
`;
export const STORYBOOK_ROOF_RULES=Object.freeze({
  renderTag:16,placeableBlockId:null,rows:7,columns:6,
  staggered:true,scalloped:true,opaque:true,
  extraTextures:0,extraDrawCalls:0,saveSchemaChanged:false
});
