// Conservative source-vertex bounds for UNDERGROUND chunk draw rejection.
// Never changes GPU residency, source mesh bytes, saves or visibility of any
// geometry intersecting the original WebGL terrain shader's view frustum.
const STRIDE=9;
export function sourceVertexBounds(...meshes){
  let minX=Infinity,minY=Infinity,minZ=Infinity,
    maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity,seen=false;
  for(const mesh of meshes){
    if(!(mesh instanceof Float32Array)||mesh.length%STRIDE!==0)
      throw Error('Draw bounds require the original packed vertex format');
    for(let i=0;i<mesh.length;i+=STRIDE){
      const x=mesh[i],y=mesh[i+1],z=mesh[i+2];
      // Bad coordinates are a geometry error elsewhere; never cull uncertain
      // source geometry and accidentally hide it from a real browser test.
      if(![x,y,z].every(Number.isFinite))return null;
      minX=Math.min(minX,x);minY=Math.min(minY,y);minZ=Math.min(minZ,z);
      maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);maxZ=Math.max(maxZ,z);
      seen=true;
    }
  }
  return seen?{minX,minY,minZ,maxX,maxY,maxZ}:null;
}
function maxPlaneAtBox(bounds,origin,normal){
  const x=normal[0]>=0?bounds.maxX:bounds.minX,
    y=normal[1]>=0?bounds.maxY:bounds.minY,
    z=normal[2]>=0?bounds.maxZ:bounds.minZ;
  return normal[0]*(x-origin[0])+normal[1]*(y-origin[1])+
    normal[2]*(z-origin[2]);
}
export function sourceBoundsInFrustum(bounds,eye,forward,right,up,aspect,tan){
  // All uncertain inputs remain visible, fail-open for CULLING ONLY.
  if(!bounds)return true;
  const fields=['minX','minY','minZ','maxX','maxY','maxZ'];
  if(!fields.every(key=>Number.isFinite(bounds[key]))||
     bounds.minX>bounds.maxX||bounds.minY>bounds.maxY||bounds.minZ>bounds.maxZ||
     ![eye,forward,right,up].every(v=>Array.isArray(v)&&v.length===3&&
       v.every(Number.isFinite))||!(aspect>0)||!(tan>0))return true;
  const plane=(basis,width,sign)=>[
    forward[0]*width+basis[0]*sign,
    forward[1]*width+basis[1]*sign,
    forward[2]*width+basis[2]*sign
  ];
  // The actual terrain VS uses clip.x=x/(aspect*tan), clip.y=y/tan,
  // clip.w=z and near clip z≈0.075. Each plane has a POSITIVE
  // forward contribution and either sign of the lateral/up basis.
  // Reject only when the *entire* source AABB is outside a clip plane.
  const planes=[
    forward,plane(right,aspect*tan,1),plane(right,aspect*tan,-1),
    plane(up,tan,1),plane(up,tan,-1)
  ];
  for(const normal of planes)
    if(maxPlaneAtBox(bounds,eye,normal)<-0.001)return false;
  return true;
}
