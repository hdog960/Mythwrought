// Isolated biome130 visual fidelity, preserving the existing nine-float GPU ABI.
import {biome130Block} from './biome130-registry.mjs';
export const BIOME130_ICE_MATERIAL=49;
export const BIOME130_ICE_BLOCK_ID=350; // authored family 095
export const BIOME130_ICE_BLOCK_IDS=Object.freeze([275,276,277,280,281,282,350]);
// One tint per leaf species, chosen from the M11 author's middle palette swatch.
// The existing per-face source color remains primary; this only bridges large
// mismatched single-color polygons without inventing a new art palette.
export const BIOME130_LEAF_SOURCE_TINTS=Object.freeze(Array.from({length:9},(_,index)=>{
  const colors=biome130Block(377+index).palette;
  return Object.freeze([...colors[Math.floor(colors.length/2)]]);
}));
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
// The M11 authored first box is a real twig, not a leaf lobe. Preserve
// existing exposed stem triangles as opaque; keep exactly the same geometry.
const foliageStemCache=new Map(); // 9 source IDs x 4 rotations maximum
export function biome130TriangleMaterialTag(id,rotation,positions,indices,start){
  const leafMaterial=biome130MaterialTag(id);
  if(id<377||id>385)return leafMaterial;
  if(!Number.isInteger(rotation)||rotation<0||rotation>3||
     !positions||!indices||!Number.isInteger(start)||start<0||start+2>=indices.length)
    throw new RangeError('Invalid foliage triangle');
  const key=id*4+rotation;
  let stem=foliageStemCache.get(key);
  if(!stem){
    stem=biome130Block(id,rotation).boxes[0];
    foliageStemCache.set(key,stem);
  }
  const epsilon=1e-5;
  for(let vertex=start;vertex<start+3;vertex++){
    const i=indices[vertex]*3;
    for(let axis=0;axis<3;axis++){
      const v=positions[i+axis];
      if(v<stem[axis]-epsilon||v>stem[axis+3]+epsilon)return leafMaterial;
    }
  }
  return 0; // established opaque terrain material, no new shader/program
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
// Needle cutouts are larger and less frequent than before for phone-scale readability.
// This is a fragment-only change: source mesh, vertex count and pass count unchanged.
// Source twig triangles do not get perforated; leaf lobes keep the cutout.
// Foliage masks read as tapered leaves; gentle source-palette midpoint tint
// reconciles each per-face color with its species, without a new color lookup.
// Sub-box source faces receive whole-leaf, tapered silhouettes rather than checker perforations.
// Foliage UV cutouts work in both graphics presets; ice retains exact source alpha.
export function biome130TerrainFragmentShader(source){
  if(typeof source!=='string'||!source.includes('in float vDistance;')||
     !source.includes('void main(){')||!source.includes('float hashCell(vec2 p)'))
    throw new Error('Incompatible terrain shader');
  const sourceLeafTint=BIOME130_LEAF_SOURCE_TINTS.map((rgb,index)=>
    'vMat=='+(index+40)+'?vec3('+rgb.map(v=>v.toFixed(5)).join(',')+')'
  ).join(':')+':vColor';
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
    '    bool needles=vMat==42||vMat==43||vMat==46;',
    '    bool hanging=vMat==44||vMat==48;',
    '    vec2 p=vUv*(needles?6.0:7.0);',
    '    vec2 cell=floor(p);',
    '    float seed=hashCell(cell+vec2(float(vMat)*13.0,7.0));',
    '    if(seed>density)discard;',
    '    vec2 leaf=fract(p)-vec2(.5);',
    '    float lean=(hashCell(cell+vec2(4.0,19.0))-.5)*.66;',
    '    leaf.x+=lean*leaf.y;',
    '    float lengthRatio=abs(leaf.y)/(hanging?.49:.47);',
    '    float width=needles?.18:(hanging?.24:(vMat==41?.29:vMat==47?.28:.40));',
    '    float edge=width*sqrt(max(0.0,1.0-lengthRatio*lengthRatio));',
    '    if(lengthRatio>1.0||abs(leaf.x)>edge)discard;',
    '    float vein=1.0-smoothstep(.015,.085,abs(leaf.x+leaf.y*.09));',
    '    float detail=uArtQuality>.5?vein*.08:0.0;',
    '    vec3 leafTint='+sourceLeafTint+';',
    '    vec3 pigment=mix(vColor,leafTint,.42)*(.91+.12*seed+detail);',
    '    float fog=smoothstep(29.0,68.0,vDistance);',
    '    outColor=vec4(mix(pigment,uFog,fog),1.0);return;',
    '  }'
  ].join('\n');
  return source.replace('in float vDistance;',
    'in float vDistance; in float vPack2Alpha;').replace('void main(){',prefix);
}
