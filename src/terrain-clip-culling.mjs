// Experimental conservative terrain-owner culling. Exact source packed
// positions and the original terrain shader's four lateral clip halfspaces.
// Unknown/malformed bounds, eye or projection fail open (draw as before).
export function terrainMeshBounds(vertices){
  if(!(vertices instanceof Float32Array)||vertices.length%9||!vertices.length)return null;
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<vertices.length;i+=9)for(let j=0;j<3;j++){
    const n=vertices[i+j];if(!Number.isFinite(n))return null;
    if(n<min[j])min[j]=n;if(n>max[j])max[j]=n;
  }
  return {min,max};
}
export function terrainClipPlanes(eye,forward,right,up,aspect,tan){
  const vec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
  if(![eye,forward,right,up].every(vec)||!Number.isFinite(aspect)||aspect<=0||
     !Number.isFinite(tan)||tan<=0)return null;
  const nx=1/(aspect*tan),ny=1/tan;
  if(!Number.isFinite(nx)||!Number.isFinite(ny))return null;
  const planes=[[right,nx],[right,-nx],[up,ny],[up,-ny]].map(([axis,k])=>forward.map((f,i)=>f+k*axis[i]));
  if(planes.some(p=>!vec(p)))return null;
  return {eye:[...eye],planes};
}
export function terrainBoundsOutside(bounds,clip){
  if(!bounds||!clip)return false;
  const {min,max}=bounds,{eye,planes}=clip;
  if(!Array.isArray(min)||!Array.isArray(max)||min.length!==3||max.length!==3||
     !min.every((n,i)=>Number.isFinite(n)&&Number.isFinite(max[i])&&n<=max[i]))return false;
  // Bound float32 cancellation and shader rounding conservatively; at very
  // large world coordinates the slack grows, reducing culling, never coverage.
  const scale=1+min.reduce((s,n,i)=>s+Math.max(Math.abs(n),Math.abs(max[i]))+Math.abs(eye[i]),0);
  for(const p of planes){
    const farthest=p.reduce((s,n,i)=>s+n*((n>=0?max[i]:min[i])-eye[i]),0);
    const slack=.01+scale*0.00001*(1+p.reduce((s,n)=>s+Math.abs(n),0));
    if(farthest < -slack)return true;
  }
  return false;
}
