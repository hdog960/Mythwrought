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
    // Each board receives a stable individual honey/amber tint, without texture lookups.
    // Subtle edge wear follows the seam and never adds translucent geometry.
    float boardTone=hashCell(boardCell+vec2(37.0,19.0));
    float edgeDist=min(fract(boards.y),1.0-fract(boards.y));
    float edgeWear=1.0-smoothstep(.035,.14,edgeDist);
    float pegPair=1.0-smoothstep(.024,.063,length(fract(boards)-vec2(.88,.15)));
    float sideShade=.76+.13*grain+.045*fineGrain+.12*boardTone+.045*tile
      -.22*seam+.055*edgeWear-.075*knotMask*knotRing-.055*(peg+pegPair);
    // Hand-planed raised board edges and occasional carved diamond ornaments.
    // These are opaque, face-local details, with no additional geometry.
    vec2 boardLocal=fract(vec2(boards.x+offset,boards.y));
    float rimX=min(boardLocal.x,1.0-boardLocal.x);
    float rimY=min(boardLocal.y,1.0-boardLocal.y);
    float bevel=smoothstep(.012,.11,min(rimX,rimY));
    float innerBorder=1.0-smoothstep(.010,.032,abs(min(rimX,rimY)-.12));
    vec2 emblemUv=(boardLocal-vec2(.5))*vec2(1.0,1.2);
    float diamond=abs(emblemUv.x)+abs(emblemUv.y);
    float etchedDiamond=1.0-smoothstep(.018,.042,abs(diamond-.27));
    float ornamentCell=step(.79,hashCell(boardCell+vec2(59.0,23.0)));
    float ornament=etchedDiamond*ornamentCell*near;
    // Sparse diagonal joinery creates readable framed timber panels.
    float braceCell=step(.90,hashCell(boardCell+vec2(83.0,41.0)));
    float braceSlope=abs(boardLocal.y-(.17+.66*boardLocal.x));
    float braceBand=(1.0-smoothstep(.055,.085,braceSlope))*bevel*braceCell;
    float braceHighlight=(1.0-smoothstep(.090,.135,braceSlope))*bevel*braceCell;
    float mortiseX=1.0-smoothstep(.025,.065,abs(boardLocal.x-.18));
    float mortiseY=1.0-smoothstep(.045,.095,abs(boardLocal.y-.72));
    float mortise=mortiseX*mortiseY*(1.0-seam);
    // Distinct crafted beam framing: broad corner posts, inset panel and
    // small square ironwood corner bosses. All remain opaque shader relief.
    float frameX=1.0-smoothstep(.09,.18,rimX);
    float frameY=1.0-smoothstep(.09,.18,rimY);
    float frame=max(frameX,frameY);
    float panel=smoothstep(.17,.25,min(rimX,rimY));
    float bossX=1.0-smoothstep(.035,.085,abs(rimX-.13));
    float bossY=1.0-smoothstep(.035,.085,abs(rimY-.13));
    float cornerBoss=bossX*bossY;
    float inlayLine=1.0-smoothstep(.009,.026,abs(min(rimX,rimY)-.22));
    float frameCell=step(.68,hashCell(boardCell+vec2(97.0,31.0)));
    float craftedFrame=frame*frameCell;
    // Occasional carpenter's arched lattice: a readable structural motif
    // spanning a whole panel, rather than tiny noisy grain. It follows the
    // existing board UVs and fades with the same near-field art budget.
    float latticeCell=step(.87,hashCell(boardCell+vec2(121.0,67.0)));
    vec2 latticeUv=(boardLocal-vec2(.5))*vec2(1.0,1.08);
    float archRadius=length(vec2(latticeUv.x,latticeUv.y+.13));
    float archBand=(1.0-smoothstep(.025,.065,abs(archRadius-.34)))
      *step(-.08,latticeUv.y);
    float archPillar=(1.0-smoothstep(.018,.055,abs(abs(latticeUv.x)-.31)))
      *(1.0-smoothstep(-.30,-.13,latticeUv.y));
    float lattice=clamp(archBand+archPillar,0.0,1.0)
      *latticeCell*panel*near;
    float latticeEdge=(1.0-smoothstep(.06,.11,abs(archRadius-.34)))
      *latticeCell*panel*near;
    sideShade += .11*craftedFrame-.065*panel*frameCell
      +.085*cornerBoss*frameCell-.045*inlayLine*frameCell;
    sideShade += -.15*lattice+.045*latticeEdge+.095*bevel-.035*innerBorder-.07*ornament
      -.11*braceBand+.045*braceHighlight-.065*mortise;
    // End-grain also has a softly planed perimeter.
    float topEdge=min(min(vUv.x,1.0-vUv.x),min(vUv.y,1.0-vUv.y));
    float topBevel=smoothstep(.015,.13,topEdge);
    float topShade=.83+.16*endRings+.06*tile-.10*endCracks+.085*topBevel;
    shade=mix(sideShade,topShade,topFace);
    base=mix(base,vec3(.85,.56,.34),(.11+.06*grain)*near);
`;
export const CRAFTED_TIMBER_RULES=Object.freeze({
  existingBlockId:4, boardsAcross:3, boardsHigh:2,
  endGrainOnTop:true, perBoardTint:true, pairedJoineryPegs:true, handPlanedBevel:true, rareEngravedDiamond:true, sparseDiagonalJoinery:true, pairedMortises:true, framedPanels:true, cornerBosses:true, archedLatticePanels:true, extraTextures:0, extraDrawCalls:0, saveSchemaChanged:false
});
