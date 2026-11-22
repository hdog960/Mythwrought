// MYTHWROUGHT D20 original-source opaque cornice + translucent glass mesh.
// Standalone read-only physical preview only. No original Pack owner replacement,
// settlement placement, live registry, schema-1 save changes, or renderer approval.
const faces=Object.freeze([
 Object.freeze({normal:[-1,0,0],corners:[0,4,7,3]}),
 Object.freeze({normal:[ 1,0,0],corners:[1,2,6,5]}),
 Object.freeze({normal:[0,-1,0],corners:[0,1,5,4]}),
 Object.freeze({normal:[0, 1,0],corners:[3,7,6,2]}),
 Object.freeze({normal:[0,0,-1],corners:[0,3,2,1]}),
 Object.freeze({normal:[0,0, 1],corners:[4,5,6,7]})
]);
const K=a=>a.join(',');
const cell=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const aabb=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
  [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
const color=hex=>{
 if(typeof hex!=='string'||!/^#[A-Fa-f0-9]{6}$/.test(hex))throw Error('Original Pack3 tone has no genuine hex color');
 return [parseInt(hex.slice(1,3),16)/255,parseInt(hex.slice(3,5),16)/255,
  parseInt(hex.slice(5,7),16)/255,1];
};
function boxCorners(b){
 const [x,y,z,X,Y,Z]=b;
 return [[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
}
function originalColoredCorniceMesh(at,parts){
 if(!cell(at)||!Array.isArray(parts)||parts.length<8||parts.length>15)
  throw Error('Original physical cornice source must remain bounded and site-authored');
 const out=new Float32Array(parts.length*12*3*10);
 let i=0;
 for(const part of parts){
  if(!part||!aabb(part.localAabb)||!part.sourceOriginalId120)
   throw Error('Not an authenticated original Pack3 source part');
  const rgba=color(part.sourceHex),corners=boxCorners(part.localAabb);
  for(const face of faces){
   const [a,b,c,d]=face.corners;
   for(const vertexIndex of [a,b,c,a,c,d]){
    const v=corners[vertexIndex];
    for(let axis=0;axis<3;axis++)out[i++]=v[axis]+at[axis];
    for(const n of face.normal)out[i++]=n;
    for(const c of rgba)out[i++]=c;
   }
  }
 }
 if(i!==out.length)throw Error('Original Pack3 10-float physical source mesh miscount');
 return out;
}
function worldGlazingMesh(at,group){
 if(!(group instanceof Float32Array)||group.length%30!==0)
  throw Error('Original Pack4 source mesh must be whole typed triangles');
 const result=new Float32Array(group);
 for(let i=0;i<group.length;i+=10){
  for(let axis=0;axis<3;axis++){
   const x=group[i+axis];
   if(!Number.isFinite(x)||x<0||x>1)throw Error('Original Pack4 source exceeds local cell');
   result[i+axis]=x+at[axis];
  }
  const normal=Math.hypot(group[i+3],group[i+4],group[i+5]);
  if(Math.abs(normal-1)>1e-3)throw Error('Pack4 original source normals invalid');
  for(let j=6;j<10;j++)if(!Number.isFinite(group[i+j])||group[i+j]<0||group[i+j]>1)
   throw Error('Pack4 physical source RGBA invalid');
 }
 return result;
}
export function buildD20OriginalWindowWorldMesh({at,pack3SourceParts,pack4PhysicalAsset,maxBytes=48*1024}={}){
 if(!cell(at)||!Array.isArray(pack3SourceParts)||
    !pack4PhysicalAsset||pack4PhysicalAsset.hasRealPhysicalGeometry!==true||
    pack4PhysicalAsset.registeredInLiveGame!==false||
    pack4PhysicalAsset.previewMesh?.stride!==10||
    !(pack4PhysicalAsset.previewMesh.opaque instanceof Float32Array)||
    !(pack4PhysicalAsset.previewMesh.translucent instanceof Float32Array))
   throw Error('Genuine original Pack3/Pack4 window source meshes required');
 if(!Number.isSafeInteger(maxBytes)||maxBytes<8192||maxBytes>48*1024)
   throw RangeError('Bounded D20 source material sample memory only');
 const input=pack4PhysicalAsset.previewMesh;
 const triangles=pack3SourceParts.length*12+(input.opaque.length+input.translucent.length)/30;
 if(!Number.isSafeInteger(triangles)||triangles<60||triangles>320)
   throw Error('Original combined window and cornice exceeds 320 source triangles');
 const bytes=triangles*30*4;
 if(bytes>maxBytes)throw Error('Original Pack3/Pack4 window sample byte budget exceeded');
 const cornice=originalColoredCorniceMesh(at,pack3SourceParts);
 const glassOpaque=worldGlazingMesh(at,input.opaque);
 const glassTranslucent=worldGlazingMesh(at,input.translucent);
 if(cornice.byteLength+glassOpaque.byteLength+glassTranslucent.byteLength!==bytes)
  throw Error('Original physical mixed-material source vertex byte count invalid');
 return Object.freeze({
  format:'mythwrought.builder-d.d20.original-source-physical-window-vertices.v1',
  originalSourceAt:Object.freeze([...at]),originalPack3CorniceOpaqueWorldVertices:cornice,
  originalPack4OpaqueWorldVertices:glassOpaque,
  originalPack4TranslucentWorldVertices:glassTranslucent,
  originalPack3CorniceTriangles:cornice.length/30,
  originalPack4OpaqueTriangles:glassOpaque.length/30,
  originalPack4TranslucentTriangles:glassTranslucent.length/30,
  sourceVertexBytes:bytes,stride:10,
  originalSourceColorsPreserved:true,sourceShapesUnmodified:true,
  originalWindowTransparencyUnsorted:true,
  originalRendererOcclusionUncertified:true,originalPickingCollisionUncertified:true,
  certifiedOriginalGameWebGL2:false,placedInGame:false
 });
}
