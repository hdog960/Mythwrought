// Original MYTHWROUGHT v0.10 storybook voxel material artwork.
// Shader-only: unchanged world generator, block IDs, schema-1 saves, physics,
// GPU chunk buffers/draw counts, and controller viewport. No fetched textures.
export const STORYBOOK_MATERIAL_FRAGMENT_SHADER=String.raw`#version 300 es
precision highp float;
precision highp int;
in vec3 vColor;
in float vDistance;
in vec2 vUv;
flat in int vMat;
uniform vec3 uFog;
uniform float uArtQuality;
out vec4 outColor;
float hashCell(vec2 p){
  return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
}
float blockLine(vec2 p,float width){
  vec2 d=min(fract(p),1.0-fract(p));
  return 1.0-step(width,min(d.x,d.y));
}
void main(){
  // Economy mode deliberately skips expensive per-pixel procedural hashes;
  // the same existing mesh, shapes and solid colors remain visible.
  if(uArtQuality<.5){
    float distant=smoothstep(29.0,68.0,vDistance);
    outColor=vec4(mix(vColor,uFog,distant),1.0);
    return;
  }
  // Decorative work fades at distance rather than shimmering across pixels.
  float near=1.0-smoothstep(10.0,38.0,vDistance);
  float tile=hashCell(floor(vUv*14.0)+float(vMat)*13.1);
  vec3 base=vColor;
  float shade=.93+.12*tile;
  if(vMat==1){ // Grass: sun-dappled meadow with petite golden leaf flecks.
    vec2 p=floor(vUv*vec2(19.0,15.0));
    float leaf=step(.89,hashCell(p+vec2(2.0,7.0)));
    // Broad moss islands and scattered tiny butter-yellow pollen break up flat lawns.
    float moss=smoothstep(.48,.72,.5+.5*sin(vUv.x*9.0+sin(vUv.y*7.0)*1.7)*sin(vUv.y*8.0-vUv.x*2.0));
    float pollen=step(.974,hashCell(p+vec2(8.0,29.0)));
    float golden=step(.962,hashCell(p+vec2(21.0,4.0)));
    // Winding fallen-leaf clusters: broad ochre silhouettes, no extra geometry.
    vec2 litterUv=fract(vUv*vec2(5.0,4.0))-vec2(.5);
    vec2 litterCell=floor(vUv*vec2(5.0,4.0));
    float litterSeed=hashCell(litterCell+vec2(37.0,11.0));
    float litterAngle=litterSeed*6.28318;
    vec2 litterAxis=vec2(cos(litterAngle),sin(litterAngle));
    vec2 litterRot=vec2(dot(litterUv,litterAxis),dot(litterUv,vec2(-litterAxis.y,litterAxis.x)));
    float litterShape=1.0-smoothstep(.07,.14,length(litterRot*vec2(.75,1.7)));
    float fallenLeaf=step(.68,litterSeed)*litterShape;
    shade=.87+.12*tile+.075*leaf+.09*moss;
    base=mix(base,vec3(.33,.52,.28),.23*moss*near);
    base=mix(base,vec3(.93,.76,.31),(.20*golden+.14*pollen)*near);
    base=mix(base,vec3(.77,.49,.21),.28*fallenLeaf*near);
  }else if(vMat==2){ // Natural loam: ochre sediment shelves, embedded pebbles, root fibers.
    vec2 p=floor(vUv*vec2(18.0,17.0));
    float shelf=.5+.5*sin(vUv.y*27.0+2.0*sin(vUv.x*5.0));
    float silt=smoothstep(.48,.68,shelf);
    float pebble=step(.94,hashCell(p+vec2(5.0,17.0)));
    float root=1.0-smoothstep(.015,.06,abs(sin(vUv.x*9.0+vUv.y*3.0)));
    // Irregular pale clay lenses make exposed soil banks visibly different from rock.
    float clay=smoothstep(.72,.9,.5+.5*sin(vUv.x*6.0+sin(vUv.y*5.0))*sin(vUv.y*9.0));
    // Eroded ochre sediment fans: broad connected bands, with dark damp pockets.
    float fan=.5+.5*sin(vUv.y*15.0+2.3*sin(vUv.x*4.0+vUv.y*2.0));
    float fanEdge=1.0-smoothstep(.025,.12,abs(fan-.5));
    float damp=smoothstep(.75,.94,.5+.5*sin(vUv.x*4.0-vUv.y*3.0)*sin(vUv.y*5.0));
    // Exposed roots branch through sediment rather than repeating a masonry grid.
    float rootTrunk=1.0-smoothstep(.025,.075,abs(sin(vUv.x*5.0+vUv.y*2.5)));
    float rootBranch=1.0-smoothstep(.018,.06,abs(sin(vUv.x*9.0-vUv.y*7.0+sin(vUv.x*4.0))));
    float rootNetwork=max(rootTrunk*.65,rootBranch*.45)*smoothstep(.20,.65,vUv.y);
    shade=.79+.12*tile+.11*silt+.10*pebble-.065*root+.045*clay+.08*fanEdge-.08*damp;
    base=mix(base,vec3(.72,.48,.31),(.12*silt+.07*pebble)*near);
    base=mix(base,vec3(.77,.65,.47),.20*clay*near);
    base=mix(base,vec3(.85,.53,.28),.20*fan*near);
    base=mix(base,vec3(.35,.28,.24),.19*damp*near);
    base=mix(base,vec3(.33,.24,.17),.24*rootNetwork*near);
  }else if(vMat==3){ // Bedrock: three interleaved natural strata, fracture seams and mica.
    vec2 p=floor(vUv*vec2(11.0,13.0));
    float strata=.5+.5*sin(vUv.y*34.0+2.0*sin(vUv.x*6.5+tile));
    float crease=1.0-smoothstep(.045,.19,abs(sin(vUv.y*7.0+vUv.x*2.2)));
    float mica=step(.94,hashCell(p+vec2(11.0,5.0)));
    // Long diagonal slate veins and warmer limestone pockets break uniform cliffs.
    float slate=.5+.5*sin(vUv.x*8.0-vUv.y*15.0+2.0*tile);
    float limestone=step(.82,hashCell(floor(vUv*vec2(4.0,5.0))+vec2(19.0,3.0)));
    // Jagged pale quartz seams track natural bedding rather than brick joints.
    float quartz=1.0-smoothstep(.025,.10,abs(sin(vUv.x*4.0+vUv.y*13.0+sin(vUv.x*7.0))));
    // Frost-quartz ridges collect on high stone strata without changing terrain IDs.
    float frostRidge=1.0-smoothstep(.035,.13,abs(sin(vUv.y*18.0+sin(vUv.x*5.0)*1.6)));
    float coldPocket=smoothstep(.76,.93,.5+.5*sin(vUv.x*5.0+vUv.y*3.0)*sin(vUv.y*7.0));
    // A broad natural erosion scar crosses exposed cliff faces, never a brick grid.
    float erosion=.5+.5*sin(vUv.y*9.0+2.2*sin(vUv.x*3.0));
    float scar=1.0-smoothstep(.055,.19,abs(erosion-.5));
    shade=.79+.13*tile+.10*strata-.085*crease+.11*mica+.065*slate+.06*frostRidge-.085*scar;
    base=mix(base,vec3(.41,.53,.61),.16*slate*near);
    base=mix(base,vec3(.76,.69,.54),.14*limestone*near);
    base=mix(base,vec3(.84,.85,.77),.15*quartz*near);
    base=mix(base,vec3(.68,.82,.91),(.12*frostRidge+.09*coldPocket)*near);
    base=mix(base,vec3(.39,.35,.32),.17*scar*near);
    // Long sweeping pale calcite seams distinguish exposed limestone shelves.
    // Coordinates are face-local and deterministic; no terrain or save changes.
    float calciteFlow=vUv.y*6.0+1.4*sin(vUv.x*3.5)+.35*sin(vUv.x*10.0);
    float calcite=1.0-smoothstep(.055,.17,abs(sin(calciteFlow*3.14159)));
    float shaleShelf=smoothstep(.63,.82,.5+.5*sin(calciteFlow*.75+vUv.x*1.3));
    base=mix(base,vec3(.91,.86,.71),.21*calcite*near);
    base=mix(base,vec3(.34,.42,.47),.12*shaleShelf*(1.0-calcite)*near);
    // Broad weathered ironstone lenses add warm mineral contrast to cliff faces.
    float ironLens=smoothstep(.70,.91,.5+.5*sin(vUv.x*3.7+sin(vUv.y*4.1))*sin(vUv.y*5.6-vUv.x*1.3));
    float rim=1.0-smoothstep(.025,.10,abs(sin(vUv.x*3.7+sin(vUv.y*4.1))*sin(vUv.y*5.6-vUv.x*1.3)));
    base=mix(base,vec3(.64,.38,.27),.20*ironLens*near);
    base=mix(base,vec3(.86,.72,.53),.07*rim*near);
  }else if(vMat==4){ // Honey-colored timber, distinct planks and warm grain.
    float plank=blockLine(vec2(vUv.x*3.0,vUv.y*1.0),.035);
    float grain=.5+.5*sin(vUv.x*23.0+2.0*sin(vUv.y*7.0));
    float knots=step(.92,hashCell(floor(vUv*vec2(12.0,7.0))+4.0));
    shade=.80+.19*grain+.11*tile-.16*plank+.08*knots;
    base=mix(base,vec3(.83,.54,.31),.13*near);
  }else if(vMat==5){ // Raw crystal: angled amethyst and turquoise growth planes.
    float facet=step(.5,fract(vUv.x*2.5+vUv.y*1.75));
    float cleavage=1.0-smoothstep(.02,.09,abs(fract(vUv.x*3.0-vUv.y*2.0)-.5));
    float glint=step(.935,hashCell(floor(vUv*vec2(10.0,10.0))+7.0));
    // Twin chevron growth faces suggest clustered natural crystal prisms.
    float prism=1.0-smoothstep(.025,.10,abs(fract(vUv.x*4.0+abs(vUv.y-.5)*3.0)-.5));
    shade=.82+.17*facet+.13*glint+.09*cleavage+.13*prism;
    base=mix(base,vec3(.74,.59,1.0),(.25*facet+.11*glint)*near);
    base=mix(base,vec3(.37,.93,.83),(.12*cleavage+.16*prism)*near);
    // Sparse frost-white inclusions and deep indigo cores distinguish natural geodes.
    float inclusion=step(.955,hashCell(floor(vUv*vec2(7.0,9.0))+vec2(31.0,12.0)));
    float core=smoothstep(.68,.91,.5+.5*sin(vUv.x*6.0+vUv.y*4.0)*sin(vUv.y*8.0-vUv.x*3.0));
    base=mix(base,vec3(.22,.24,.54),.19*core*near);
    base=mix(base,vec3(.87,.94,1.0),.24*inclusion*near);
    // Agate-like nested mineral bands follow warped crystal growth planes.
    // All pigment is opaque and near-faded, with no new mesh or sampler.
    float bandPhase=length((vUv-vec2(.52,.48))*vec2(1.15,.85))*22.0
      +2.2*sin(vUv.x*9.0+vUv.y*4.0);
    float agateBand=1.0-smoothstep(.07,.22,abs(sin(bandPhase)));
    float agateCore=smoothstep(.72,.93,.5+.5*cos(bandPhase*.42));
    base=mix(base,vec3(.92,.69,.84),.16*agateBand*near);
    base=mix(base,vec3(.31,.43,.71),.11*agateCore*near);
    // Fine glacial cleavage gives some crystal faces a blue-white icy rim.
    float iceRim=1.0-smoothstep(.025,.11,abs(sin(vUv.x*7.0-vUv.y*9.0+sin(vUv.y*4.0))));
    float blueFacet=step(.79,hashCell(floor(vUv*vec2(5.0,6.0))+vec2(42.0,3.0)));
    base=mix(base,vec3(.64,.88,.98),(.11*iceRim+.08*blueFacet)*near);
  }else if(vMat==6){ // Raw ore: continuous amber mineral seams in weathered host rock.
    vec2 p=floor(vUv*vec2(12.0,15.0));
    float trace=step(.72,hashCell(p+17.0));
    float vein=1.0-smoothstep(.06,.18,abs(sin(vUv.x*11.0+vUv.y*7.0+tile)));
    // Small branching mineral seams read as embedded ore, not painted confetti.
    float branch=1.0-smoothstep(.03,.13,abs(sin(vUv.x*18.0-vUv.y*5.0+sin(vUv.y*12.0))));
    float gold=clamp(.48*trace+.42*vein+.24*branch,0.0,1.0);
    shade=.77+.15*tile+.19*gold;
    base=mix(base,vec3(.96,.69,.28),.28*gold*near);
    // Hematite-red host-rock plates and thin pale mineral boundaries.
    float hematite=.5+.5*sin(vUv.x*5.0+1.4*sin(vUv.y*6.0))*sin(vUv.y*7.0-vUv.x*2.0);
    float plate=smoothstep(.67,.84,hematite);
    float plateEdge=1.0-smoothstep(.035,.11,abs(hematite-.67));
    base=mix(base,vec3(.51,.27,.29),.18*plate*(1.0-gold)*near);
    base=mix(base,vec3(.82,.75,.62),.09*plateEdge*(1.0-gold)*near);
    // Oxidized teal seams frame the precious ore without transparency or glow passes.
    float oxidation=smoothstep(.67,.87,.5+.5*sin(vUv.x*8.0-vUv.y*6.0+sin(vUv.y*11.0)));
    base=mix(base,vec3(.19,.43,.39),.17*oxidation*(1.0-gold)*near);
  }else if(vMat==7){ // Solid polygon grass accents (opaque, no overdraw).
    shade=.92+.10*step(.5,tile);
  }else if(vMat==8||vMat==9){ // Flower petals and golden centers.
    shade=1.0;
  }else if(vMat==10){ // Natural grotto fungus stems, softly teal.
    shade=.91+.06*tile;
  }else if(vMat==11){ // Opaque luminous-color fungal caps and crystal faces.
    // Bright local colors without fake dynamic lights or transparency.
    shade=1.0;
  }else if(vMat==12){ // Warm gold spores; preserves art readability.
    shade=1.0;
  }else if(vMat==13||vMat==14){ // Original carved tree-star cave-wall sigils.
    // Matte warm gold or cool turquoise pigment, no transparent glow pass.
    shade=1.0;
  }
  float fog=smoothstep(29.0,68.0,vDistance);
  vec3 colored=mix(vColor,base*shade,near*.92);
  outColor=vec4(mix(colored,uFog,fog),1.0);
}
`;
export const STORYBOOK_ART_RULES=Object.freeze({
  existingSolidMaterials:Object.freeze([1,2,3,4,5,6]),
  existingFloraMaterials:Object.freeze([7,8,9]),
  renderOnlyGrottoMaterials:Object.freeze([10,11,12]),
  renderOnlyCaveRuneMaterials:Object.freeze([13,14]),
  detailStartDistance:10,
  detailEndDistance:38,
  fogStartDistance:29,
  fogEndDistance:68,
  newDrawCalls:0,
  newTextures:0,
  naturalDetailFamilies:Object.freeze(['sediment-shelves','slate-limestone-strata','raw-crystal-cleavage','gold-bearing-veins']),
  secondaryNaturalAccents:Object.freeze(['grass-moss-pollen','soil-clay-lenses','stone-quartz-seams','crystal-chevron-prisms','ore-branch-veins']),
  mineralInclusions:Object.freeze(['crystal-indigo-core','crystal-frost-inclusions','ore-oxidized-seams']),
  coldGeologyAccents:Object.freeze(['stone-frost-quartz-ridges','stone-cold-pockets','crystal-glacial-cleavage']),
  weatheredStrataAccents:Object.freeze(['soil-ochre-sediment-fans','soil-damp-pockets','stone-erosion-scars']),
  limestoneShelfAccents:Object.freeze(['stone-sweeping-calcite','stone-blue-shale-shelves']),
  ironstoneAccents:Object.freeze(['stone-ironstone-lenses','stone-pale-mineral-rims']),
  agateHematiteAccents:Object.freeze(['crystal-nested-agate-bands','crystal-indigo-growth-core','ore-hematite-host-plates','ore-pale-plate-boundaries']),
  forestFloorMaterialAccents:Object.freeze(['grass-fallen-leaf-clusters','soil-branching-exposed-roots'])
});
