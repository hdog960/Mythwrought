// Built-material artwork only. Existing physical WOOD (ID 4) remains placeable;
// this shader treatment does not allocate voxel IDs or change saved terrain.
// Compact opaque face-local plank, joinery and woodgrain treatment.
export const CRAFTED_TIMBER_GLSL=String.raw`
    // Three broad boards with staggered end joints and thin dark seams.
    // Work in face UV space: no additional geometry, texture or draw call.
    vec2 boards=vec2(vUv.x*3.0,vUv.y*2.0);
    float boardRow=floor(boards.y);
    float offset=mod(boardRow,2.0)*.43;
    float horizontalJoint=1.0-smoothstep(.012,.040,min(fract(boards.y),1.0-fract(boards.y)));
    float verticalJoint=1.0-smoothstep(.012,.045,min(fract(boards.x+offset),1.0-fract(boards.x+offset)));
    float seam=max(horizontalJoint,verticalJoint);
    float grain=.5+.5*sin(vUv.x*37.0+2.5*sin(vUv.y*8.0)+tile*1.2);
    float fineGrain=.5+.5*sin(vUv.x*91.0+sin(vUv.y*17.0));
    vec2 boardCell=floor(vec2(boards.x+offset,boards.y));
    float knotMask=step(.86,hashCell(boardCell+vec2(13.0,5.0)));
    vec2 knotUv=fract(vec2(boards.x+offset,boards.y))-.5;
    float knotRing=1.0-smoothstep(.07,.16,abs(length(knotUv*vec2(1.3,2.0))-.21));
    float peg=1.0-smoothstep(.025,.07,length(fract(boards)-vec2(.12,.15)));
    // Top-facing boards expose gentle end-grain rings instead of vertical wall seams.
    // Existing face lighting makes the top distinguishable without extra mesh attributes.
    float topFace=step(.59,vColor.r);
    vec2 ringsUv=(vUv-vec2(.5)) * vec2(1.0,1.16);
    float ringRadius=length(ringsUv);
    float ringWobble=.018*sin(atan(ringsUv.y,ringsUv.x)*7.0);
    float endRings=.5+.5*cos((ringRadius+ringWobble)*48.0);
    float endCracks=1.0-smoothstep(.012,.045,abs(ringsUv.x+sin(ringsUv.y*13.0)*.018));
    float sideShade=.80+.13*grain+.045*fineGrain+.08*tile-.24*seam-.075*knotMask*knotRing-.07*peg;
    float topShade=.83+.16*endRings+.06*tile-.10*endCracks;
    shade=mix(sideShade,topShade,topFace);
    base=mix(base,vec3(.85,.56,.34),(.11+.06*grain)*near);
`;
export const CRAFTED_TIMBER_RULES=Object.freeze({
  existingBlockId:4, boardsAcross:3, boardsHigh:2,
  endGrainOnTop:true, extraTextures:0, extraDrawCalls:0, saveSchemaChanged:false
});
