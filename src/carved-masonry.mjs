// Render-only architectural pigment for constructed landmark faces.
// Material 15 is a render tag, NOT a placeable voxel block ID.
// The :36 structures lane may assign this tag to its own geometry after review.
export const CARVED_MASONRY_RENDER_TAG=15;
export const CARVED_MASONRY_GLSL=String.raw`
    // Large staggered ashlar courses with warm mortar, chipped corners,
    // broad dressed faces and sparse carved keystones. One opaque pass.
    vec2 courses=vec2(vUv.x*3.0,vUv.y*4.0);
    float row=floor(courses.y);
    vec2 cell=vec2(courses.x+mod(row,2.0)*.5,courses.y);
    vec2 local=fract(cell);
    vec2 edge=min(local,1.0-local);
    float mortar=1.0-smoothstep(.025,.085,min(edge.x,edge.y));
    float bevel=1.0-smoothstep(.09,.19,min(edge.x,edge.y));
    float blockVariation=hashCell(floor(cell)+vec2(19.0,41.0));
    float dressing=.5+.5*sin(local.x*12.0+local.y*7.0+blockVariation*6.0);
    float chisel=.5+.5*sin(local.x*31.0-local.y*18.0);
    float chip=step(.88,hashCell(floor(cell)+vec2(71.0,13.0)))
      *(1.0-smoothstep(.035,.12,length(local-vec2(.07,.08))));
    // A rare diamond rune remains entirely within the face; no emissive pass.
    float runeCell=step(.965,hashCell(floor(cell)+vec2(97.0,59.0)));
    vec2 runeUv=(local-.5)*vec2(1.0,1.2);
    float rune=1.0-smoothstep(.022,.058,abs(abs(runeUv.x)+abs(runeUv.y)-.29));
    float runeInk=rune*runeCell*near;
    shade=.82+.14*blockVariation+.09*dressing+.035*chisel
      -.25*mortar-.11*bevel-.12*chip-.17*runeInk;
    base=mix(base,vec3(.79,.76,.68),(.17+.07*blockVariation)*near);
`;
export const CARVED_MASONRY_RULES=Object.freeze({
  renderTag:15, placeableBlockId:null, courseRows:4, courseColumns:3,
  staggeredCourses:true, chippedCorners:true, rareCarvedRunes:true,
  extraDrawCalls:0, extraTextures:0, saveSchemaChanged:false
});
