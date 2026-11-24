// Exact historical main.mjs shader expression (original source blob 3768eb68bc2951dd7e6f41490720a9b4c6616a87).
// Extracted unchanged except module export and local indentation.
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER} from '../storybook-materials.mjs';
import * as nonblockGeometry from '../nonblock/candidate-scene.mjs';
import {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER} from '../sky.mjs';
  const VS=[
    '#version 300 es','precision highp float;',
    'in vec3 aPos; in vec3 aColor; in vec2 aUv; in float aMat;',
    'uniform vec3 uEye,uForward,uRight,uUp;',
    'uniform float uAspect,uTan;',
    'out vec3 vColor; out float vDistance; out vec2 vUv; flat out int vMat; out float vPack2Alpha;',
    'void main(){ vec3 d=aPos-uEye;',
    'float x=dot(d,uRight); float y=dot(d,uUp); float z=dot(d,uForward);',
    'gl_Position=vec4(x/(uAspect*uTan),y/uTan,1.0015*z-0.1501,z);',
    'vColor=aColor; vDistance=length(d); vUv=aUv; vMat=int(floor(aMat+.001)); vPack2Alpha=fract(aMat); }'
  ].join('\n');
  // Reserved transparent-water material 20; legacy materials stay unchanged.
  const FS=STORYBOOK_MATERIAL_FRAGMENT_SHADER
    .replace('uniform vec3 uFog;',
      'uniform vec3 uFog; uniform vec3 uSkyLight; uniform float uCaveHaze;'+
      'float worldFog(float distanceToEye){ return smoothstep(mix(29.0,9.0,uCaveHaze),'+
        'mix(68.0,27.0,uCaveHaze),distanceToEye); }')
    .replace('mix(vColor,uFog,distant)','mix(vColor*uSkyLight,uFog,distant)')
    .replace('mix(colored,uFog,fog)','mix(colored*uSkyLight,uFog,fog)')
    .replace('in float vDistance;','in float vDistance; in float vPack2Alpha;')
    .replace('void main(){',
      'void main(){ if(vMat==20){ float f=smoothstep(29.0,68.0,vDistance);'+
      'outColor=vec4(mix(vColor*uSkyLight,uFog,f),vPack2Alpha); return; }'+
      `if(vMat==${nonblockGeometry.NONBLOCK_SCENERY_MATERIAL}){ float f=smoothstep(29.0,68.0,vDistance);`+
      'outColor=vec4(mix(vColor,uFog,f),1.0); return; }'+
      'if(vMat==23){ float f=smoothstep(14.0,24.0,vDistance);'+
      'outColor=vec4(vColor,vPack2Alpha*(1.0-f)); return; }'
    ).replaceAll('smoothstep(29.0,68.0,vDistance)','worldFog(vDistance)');

export const P0_ORIGINAL_SHADERS=Object.freeze({terrainVertex:VS,terrainFragment:FS,skyVertex:SKY_VERTEX_SHADER,skyFragment:SKY_FRAGMENT_SHADER});
