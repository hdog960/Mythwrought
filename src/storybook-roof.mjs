// Opaque render-only architectural roofing for future landmark geometry.
// Tag 16 is NOT a voxel block ID and cannot be placed or saved.
export const STORYBOOK_ROOF_RENDER_TAG=16;
export const STORYBOOK_ROOF_GLSL=String.raw`
    // Staggered terracotta fish-scale shingles; all details are analytic and opaque.
    vec2 roofGrid=vec2(vUv.x*6.0,vUv.y*7.0);
    float roofRow=floor(roofGrid.y);
    vec2 roofCell=vec2(roofGrid.x+mod(roofRow,2.0)*.5,roofGrid.y);
    vec2 roofLocal=fract(roofCell);
    vec2 roofIndex=floor(roofCell);
    float roofVariation=hashCell(roofIndex+vec2(47.0,83.0));
    float roofSeam=1.0-smoothstep(.018,.075,min(roofLocal.x,1.0-roofLocal.x));
    float roofLap=1.0-smoothstep(.02,.13,roofLocal.y);
    float roofScallop=1.0-smoothstep(.025,.085,
      abs(length((roofLocal-vec2(.5,.72))*vec2(1.0,1.25))-.47));
    float roofGlaze=.5+.5*sin(roofLocal.x*9.0+roofLocal.y*6.0+roofVariation*4.0);
    // A narrow raised center rib catches the light on each curved ceramic tile.
    float roofRib=(1.0-smoothstep(.015,.11,abs(roofLocal.x-.5)))*
      smoothstep(.10,.26,roofLocal.y)*(1.0-smoothstep(.79,.97,roofLocal.y));
    // Rare stamped sunburst medallions break up large roofs without tiling noise.
    float roofEmblemCell=step(.94,hashCell(roofIndex+vec2(91.0,19.0)));
    vec2 roofEmblemUv=(roofLocal-vec2(.5,.47))*vec2(1.0,1.15);
    float roofEmblemRing=1.0-smoothstep(.018,.048,abs(length(roofEmblemUv)-.21));
    float roofEmblemRay=1.0-smoothstep(.02,.055,
      abs(sin(atan(roofEmblemUv.y,roofEmblemUv.x)*4.0))*.16);
    float roofEmblem=roofEmblemCell*roofEmblemRing*(.7+.3*roofEmblemRay);
    // Small glazed edge chips appear on a minority of shingles, not all seams.
    float roofChipCell=step(.86,hashCell(roofIndex+vec2(13.0,57.0)));
    float roofChip=roofChipCell*(1.0-smoothstep(.025,.10,
      length((roofLocal-vec2(.07,.85))*vec2(1.0,1.2))));
    // Hand-finished ridge tiles cap the top edge with a continuous glazed crest.
    // UV-only, so this is a visual treatment, not extra roof geometry.
    float roofRidgeBand=1.0-smoothstep(.065,.14,vUv.y);
    float roofRidgeLip=1.0-smoothstep(.009,.028,abs(vUv.y-.125));
    float roofRidgeSegment=1.0-smoothstep(.018,.06,
      min(fract(vUv.x*8.0),1.0-fract(vUv.x*8.0)));
    float roofRidgeMedallion=1.0-smoothstep(.022,.075,
      abs(length((fract(vUv.x*8.0)-.5)*vec2(1.0,0.0)+vec2(0.0,vUv.y*2.0-.12))-.16));
    shade=.78+.18*roofVariation+.10*roofGlaze-.22*roofSeam-.15*roofLap
      -.09*roofScallop+.13*roofRib+.09*roofEmblem-.17*roofChip\n      +.17*roofRidgeBand+.12*roofRidgeLip-.12*roofRidgeBand*roofRidgeSegment\n      +.08*roofRidgeBand*roofRidgeMedallion;
    base=mix(base,vec3(.75,.31,.24),(.35+.12*roofVariation)*near);\n    base=mix(base,vec3(.88,.49,.30),roofRidgeBand*.34*near);
`;
export const STORYBOOK_ROOF_RULES=Object.freeze({
  renderTag:16,placeableBlockId:null,rows:7,columns:6,
  staggered:true,scalloped:true,raisedRibs:true,rareStampedEmblems:true,
  sparseEdgeChips:true,glazedRidgeCrest:true,opaque:true,extraTextures:0,extraDrawCalls:0,
  saveSchemaChanged:false
});
