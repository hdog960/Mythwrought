// Opaque, render-only manufactured trim for constructed arches and cornices.
// Tag 17 is not a physical block ID; structure meshes may opt into it.
export const CARVED_TRIM_RENDER_TAG=17;
export const CARVED_TRIM_GLSL=String.raw`
    // Broad limestone bands, fine double fillets and sparse carved rosettes.
    // Face-local UVs keep ornament stable and independent of world generation.
    vec2 trimUv=vUv;
    float trimUpper=1.0-smoothstep(.018,.047,abs(trimUv.y-.19));
    float trimLower=1.0-smoothstep(.018,.047,abs(trimUv.y-.81));
    float trimInnerUpper=1.0-smoothstep(.009,.026,abs(trimUv.y-.28));
    float trimInnerLower=1.0-smoothstep(.009,.026,abs(trimUv.y-.72));
    float trimJoint=1.0-smoothstep(.012,.048,
      min(fract(trimUv.x*5.0),1.0-fract(trimUv.x*5.0)));
    vec2 trimCell=vec2(fract(trimUv.x*5.0)-.5,(trimUv.y-.5)*1.8);
    float trimIndex=floor(trimUv.x*5.0);
    float trimRosetteSeed=step(.78,hashCell(vec2(trimIndex,43.0)));
    float trimRadius=length(trimCell);
    float trimRing=1.0-smoothstep(.014,.041,abs(trimRadius-.19));
    float trimPetals=1.0-smoothstep(.025,.075,
      abs(sin(atan(trimCell.y,trimCell.x)*4.0))*.12);
    float trimRosette=trimRosetteSeed*trimRing*(.65+.35*trimPetals);
    float trimWear=step(.90,hashCell(vec2(trimIndex,97.0)));
    float trimPatina=.5+.5*sin(trimUv.x*17.0+trimUv.y*8.0);
    shade=.87+.09*trimPatina+.16*(trimUpper+trimLower)
      +.07*(trimInnerUpper+trimInnerLower)-.18*trimJoint
      +.12*trimRosette-.055*trimWear;
    base=mix(base,vec3(.87,.79,.63),.38*near);
    base=mix(base,vec3(.61,.70,.66),.12*trimWear*near);
`;
export const CARVED_TRIM_RULES=Object.freeze({
  renderTag:17,placeableBlockId:null,opaque:true,
  doubleFillets:true,sparseRosettes:true,weatheredJoints:true,
  extraTextures:0,extraDrawCalls:0,saveSchemaChanged:false
});
