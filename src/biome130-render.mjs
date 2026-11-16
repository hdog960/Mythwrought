// Isolated biome130 visual fidelity, preserving the existing nine-float GPU ABI.
export const BIOME130_ICE_MATERIAL=31;
export const BIOME130_ICE_BLOCK_ID=350; // authored family 095
export function biome130MaterialTag(id){
  if(id===BIOME130_ICE_BLOCK_ID)return BIOME130_ICE_MATERIAL;
  return Number.isInteger(id)&&id>=377&&id<=385?21+id-377:0;
}
// Chunk upload only: unchanged geometry and byte layout, no extra opaque passes.
export function splitBiome130Translucent(vertices){
  if(!(vertices instanceof Float32Array)||vertices.length%9!==0)
    throw new TypeError('Expected nine-float terrain vertices');
  let n=0;
  for(let i=8;i<vertices.length;i+=9)if(vertices[i]===31)n++;
  if(!n)return {opaque:vertices,translucent:new Float32Array(0)};
  const opaque=new Float32Array(vertices.length-9*n);
  const translucent=new Float32Array(9*n);
  let a=0,b=0;
  for(let i=0;i<vertices.length;i+=9){
    if(vertices[i+8]===31){translucent.set(vertices.subarray(i,i+9),b);b+=9;}
    else{opaque.set(vertices.subarray(i,i+9),a);a+=9;}
  }
  return {opaque,translucent};
}
// Procedural cutout faces are stable in object UVs in both art presets.
// Ice is emitted into the existing water transparency pass (0.72 alpha).
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
    '  if(vMat==31){',
    '    float f=smoothstep(29.0,68.0,vDistance);',
    '    vec3 glacial=mix(vColor,vec3(.77,.92,.98),.18);',
    '    outColor=vec4(mix(glacial,uFog,f),.72);return;',
    '  }',
    '  if(vMat>=21&&vMat<=29){',
    '    float density=vMat==21?.78:vMat==22?.48:vMat==23?.92:',
    '      vMat==24?.86:vMat==25?.58:vMat==26?.65:vMat==27?.90:',
    '      vMat==28?.74:.57;',
    '    vec2 p=vUv*12.0;',
    '    vec2 cell=floor(p);',
    '    vec2 tip=fract(p)-vec2(.5);',
    '    bool needles=vMat==23||vMat==24||vMat==27;',
    '    float contour=needles?max(abs(tip.x)*1.5,abs(tip.y)*.78):',
    '      length(tip*vec2(.86,1.22));',
    '    if(hashCell(cell+vec2(float(vMat)*13.0,7.0))>density||',
    '      contour>.48)discard;',
    '  }'
  ].join('\n');
  return source.replace('in float vDistance;',
    'in float vDistance; in float vPack2Alpha;').replace('void main(){',prefix);
}
