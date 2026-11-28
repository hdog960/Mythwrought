// Optional Water B style: no geometry, simulation, world or GL state mutation.
import {WATER_MATERIAL} from './material.mjs';
const unit=v=>Number.isFinite(v)&&v>=0&&v<=1;
const mask=v=>Number.isInteger(v)&&v>=0&&v<=15;
const axisNormal=n=>Array.isArray(n)&&n.length===3&&n.every(v=>[-1,0,1].includes(v))&&n.reduce((s,v)=>s+Math.abs(v),0)===1;
const fract=v=>v-Math.floor(v);
const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
export const WATER_SHADING_DEFAULTS=Object.freeze({foamWidth:0.12,fallStrength:0.16,sideShade:0.82,bottomShade:0.68});
// One flat quad's style, prepared at mesh rebuild, never sampled per pixel.
// normal is outward axis normal; surface is describeWaterSurface's result.
// Unknown signals default to calm water. No inference of actual velocity.
export function prepareWaterShade({normal,surface=null,policy=WATER_SHADING_DEFAULTS}={}){
  if(!axisNormal(normal)||!policy||!unit(policy.fallStrength)||!unit(policy.sideShade)||!unit(policy.bottomShade)||!Number.isFinite(policy.foamWidth)||policy.foamWidth<=0||policy.foamWidth>0.5)throw RangeError('Invalid water shade policy or normal');
  if(surface!==null&&(!mask(surface.foamMask)||!mask(surface.fallMask)||!unit(surface.foamStrength)||typeof surface.exposedTop!=='boolean'))throw TypeError('Invalid water surface signals');
  const face=normal[0]===1?0:normal[2]===1?1:normal[0]===-1?2:normal[2]===-1?3:-1;
  const top=normal[1]===1;
  return Object.freeze({base:Object.freeze([...WATER_MATERIAL.color,WATER_MATERIAL.alpha]),
    shade:top?1:normal[1]===-1?policy.bottomShade:policy.sideShade,
    foamMask:top&&surface?.exposedTop?surface.foamMask:0,
    foamStrength:top&&surface?.exposedTop?surface.foamStrength:0,
    foamWidth:policy.foamWidth,
    fallStrength:face>=0&&((surface?.fallMask??0)&(1<<face))?policy.fallStrength:0,
    tangentAxis:normal[0]!==0?2:0});
}
// Reference for deterministic pixel fixtures. Positions are batch-local; integer
// origins ensure fractional patterns repeat across owner boundaries.
export function evaluateWaterShade(s,p){
  if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))throw TypeError('Invalid local shading position');
  const u=fract(p[0]),v=fract(p[2]),edges=[1-u,1-v,u,v];
  let edge=1;
  for(let i=0;i<4;i++)if(s.foamMask&(1<<i))edge=Math.min(edge,edges[i]);
  const foam=s.foamStrength*(1-smooth(s.foamWidth*0.5,s.foamWidth,edge));
  const stripe=1-smooth(0.12,0.35,Math.abs(fract(p[s.tangentAxis]*4+p[1])-0.5));
  return Object.freeze([...s.base.slice(0,3).map(c=>{const shaded=c*s.shade;const streak=shaded+(1-shaded)*s.fallStrength*stripe;return streak+(1-streak)*foam;}),s.base[3]]);
}
// Straight alpha, no discard or depth modification. Host sets existing water
// pass state and supplies camera-relative transform; no new vertex attributes.
export const WATER_VERTEX_GLSL=`#version 300 es
layout(location=0) in vec3 position;
uniform mat4 clipFromLocal;
out highp vec3 localPosition;
void main(){localPosition=position;gl_Position=clipFromLocal*vec4(position,1.0);}`;
export const WATER_FRAGMENT_GLSL=`#version 300 es
precision highp float;
precision highp int;
in highp vec3 localPosition;
uniform vec4 base;
uniform float shade,foamStrength,foamWidth,fallStrength;
uniform int foamMask,tangentAxis;
out vec4 color;
void main(){
  vec2 uv=fract(localPosition.xz);
  vec4 edges=vec4(1.0-uv.x,1.0-uv.y,uv.x,uv.y);
  float edge=1.0;
  for(int i=0;i<4;i++){if((foamMask & (1<<i))!=0)edge=min(edge,edges[i]);}
  float foam=foamStrength*(1.0-smoothstep(foamWidth*0.5,foamWidth,edge));
  float tangent=tangentAxis==2?localPosition.z:localPosition.x;
  float stripe=1.0-smoothstep(0.12,0.35,abs(fract(tangent*4.0+localPosition.y)-0.5));
  vec3 rgb=mix(base.rgb*shade,vec3(1.0),fallStrength*stripe);
  color=vec4(mix(rgb,vec3(1.0),foam),base.a);
}`;
