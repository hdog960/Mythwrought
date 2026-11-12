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
out vec4 outColor;
float hashCell(vec2 p){
  return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
}
float blockLine(vec2 p,float width){
  vec2 d=min(fract(p),1.0-fract(p));
  return 1.0-step(width,min(d.x,d.y));
}
void main(){
  // Decorative work fades at distance rather than shimmering across pixels.
  float near=1.0-smoothstep(10.0,38.0,vDistance);
  float tile=hashCell(floor(vUv*14.0)+float(vMat)*13.1);
  vec3 base=vColor;
  float shade=.93+.12*tile;
  if(vMat==1){ // Grass: sun-dappled meadow with petite golden leaf flecks.
    vec2 p=floor(vUv*vec2(19.0,15.0));
    float leaf=step(.89,hashCell(p+vec2(2.0,7.0)));
    float golden=step(.962,hashCell(p+vec2(21.0,4.0)));
    shade=.90+.13*tile+.075*leaf;
    base=mix(base,vec3(.62,.78,.36),golden*.17*near);
  }else if(vMat==2){ // Warm earthen loam, fine layered soil and pebbles.
    vec2 p=floor(vUv*vec2(16.0,18.0));
    float band=.5+.5*sin(vUv.y*42.0+hashCell(p)*.9);
    float pebble=step(.91,hashCell(p+vec2(5.0,17.0)));
    shade=.82+.18*tile+.09*band+.08*pebble;
    base=mix(base,vec3(.68,.45,.30),.10*near);
  }else if(vMat==3){ // Hand-cut warm stone: staggered chips + etched mortar.
    vec2 p=vUv*vec2(3.5,5.5);
    p.x+=.5*mod(floor(p.y),2.0);
    float mortar=blockLine(p,.052);
    float chip=step(.82,hashCell(floor(vUv*vec2(13.0,13.0))+5.0));
    shade=.87+.15*tile+.07*chip-.21*mortar;
    base=mix(base,vec3(.65,.63,.59),.14*near);
  }else if(vMat==4){ // Honey-colored timber, distinct planks and warm grain.
    float plank=blockLine(vec2(vUv.x*3.0,vUv.y*1.0),.035);
    float grain=.5+.5*sin(vUv.x*23.0+2.0*sin(vUv.y*7.0));
    float knots=step(.92,hashCell(floor(vUv*vec2(12.0,7.0))+4.0));
    shade=.80+.19*grain+.11*tile-.16*plank+.08*knots;
    base=mix(base,vec3(.83,.54,.31),.13*near);
  }else if(vMat==5){ // Faceted turquoise crystal, cool/lilac glints.
    float facet=step(.5,fract(vUv.x*2.5+vUv.y*1.75));
    float glint=step(.935,hashCell(floor(vUv*vec2(10.0,10.0))+7.0));
    shade=.89+.17*facet+.13*glint;
    base=mix(base,vec3(.74,.59,1.0),(.24*facet+.12*glint)*near);
  }else if(vMat==6){ // Warm brass-gold specks in dark mineral seams.
    float trace=step(.72,hashCell(floor(vUv*vec2(12.0,15.0))+17.0));
    shade=.79+.15*tile+.24*trace;
    base=mix(base,vec3(1.0,.72,.30),.23*trace*near);
  }else if(vMat==7){ // Solid polygon grass accents (opaque, no overdraw).
    shade=.92+.10*step(.5,tile);
  }else if(vMat==8||vMat==9){ // Flower petals and golden centers.
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
  detailStartDistance:10,
  detailEndDistance:38,
  fogStartDistance:29,
  fogEndDistance:68,
  newDrawCalls:0,
  newTextures:0
});
