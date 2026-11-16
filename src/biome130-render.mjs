// Isolated biome130 visual fidelity, preserving the existing nine-float GPU ABI.
import {biome130Block} from './biome130-registry.mjs';
export const BIOME130_ICE_MATERIAL=49;
export const BIOME130_ICE_BLOCK_ID=350; // authored family 095
export const BIOME130_ICE_BLOCK_IDS=Object.freeze([275,276,277,280,281,282,350]);
const iceAlpha=new Map(BIOME130_ICE_BLOCK_IDS.map(id=>{
  const alpha=biome130Block(id).opacity;
  if(typeof alpha!=='number'||!Number.isFinite(alpha)||alpha<=0||alpha>=1)
    throw Error('Invalid source-authored ice opacity for biome block '+id);
  return [id,alpha];
}));
export function biome130MaterialTag(id){
  if(iceAlpha.has(id))return BIOME130_ICE_MATERIAL+iceAlpha.get(id);
  return Number.isInteger(id)&&id>=377&&id<=385?40+id-377:0;
}
// Chunk upload only: unchanged geometry and byte layout, no extra opaque passes.
export function splitBiome130Translucent(vertices){
  if(!(vertices instanceof Float32Array)||vertices.length%9!==0)
    throw new TypeError('Expected nine-float terrain vertices');
  const isIce=value=>value>=BIOME130_ICE_MATERIAL&&value<BIOME130_ICE_MATERIAL+1;
  let n=0;
  for(let i=8;i<vertices.length;i+=9)if(isIce(vertices[i]))n++;
  if(!n)return {opaque:vertices,translucent:new Float32Array(0)};
  const opaque=new Float32Array(vertices.length-9*n);
  const translucent=new Float32Array(9*n);
  let a=0,b=0;
  for(let i=0;i<vertices.length;i+=9){
    if(isIce(vertices[i+8])){translucent.set(vertices.subarray(i,i+9),b);b+=9;}
    else{opaque.set(vertices.subarray(i,i+9),a);a+=9;}
  }
  return {opaque,translucent};
}
// Tags 40–48 and 49.x never overlap Pack 2 material 21.
// Foliage UV cutouts work in both graphics presets; ice retains exact source alpha.
export function biome130TerrainFragmentShader(source){
  if(typeof source!=='string'||!source.includes('in float vDistance;')||
     !source.includes('void main(){')||!source.includes('float hashCell(vec2 p)'))
    throw new Error('Incompatible terrain shader');
  const prefix=[
    'void main(){',
    '  if(vMat==20){',
    '    float f=smoothstep(29.0,68.0,vDistance);',
    '    outColor=vec4(mix(vColor,uFog,f),vPack2Alpha);return;',
    '  }',
    '  if(vMat==49){',
    '    float f=smoothstep(29.0,68.0,vDistance);',
    '    vec3 glacial=mix(vColor,vec3(.77,.92,.98),.18);',
    '    outColor=vec4(mix(glacial,uFog,f),vPack2Alpha);return;',
    '  }',
    '  if(vMat>=40&&vMat<=48){',
    '    float density=vMat==40?.78:vMat==41?.48:vMat==42?.92:',
    '      vMat==43?.86:vMat==44?.58:vMat==45?.65:vMat==46?.90:',
    '      vMat==47?.74:.57;',
    '    vec2 p=vUv*12.0;',
    '    vec2 cell=floor(p);',
    '    vec2 tip=fract(p)-vec2(.5);',
    '    bool needles=vMat==42||vMat==43||vMat==46;',
    '    float contour=needles?max(abs(tip.x)*1.5,abs(tip.y)*.78):',
    '      length(tip*vec2(.86,1.22));',
    '    if(hashCell(cell+vec2(float(vMat)*13.0,7.0))>density||',
    '      contour>.48)discard;',
    '  }'
  ].join('\n');
  return source.replace('in float vDistance;',
    'in float vDistance; in float vPack2Alpha;').replace('void main(){',prefix);
}
