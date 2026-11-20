// Conservative world-space pick envelope from actual triangle vertices.
// No world writes; instance scale/yaw are bounded and deterministic.
export function meshSelectionBounds(mesh,anchor,{yaw=0,scale=1}={}){
 if(!(mesh?.positions instanceof Float32Array)||mesh.positions.length===0||mesh.positions.length%9!==0||
 !Array.isArray(anchor)||anchor.length!==3||!anchor.every(Number.isFinite)||
 !Number.isFinite(yaw)||!Number.isFinite(scale)||scale<=0||scale>2)throw new TypeError('invalid mesh selection input');
 const c=Math.cos(yaw),s=Math.sin(yaw),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<mesh.positions.length;i+=3){
  const x=mesh.positions[i],y=mesh.positions[i+1],z=mesh.positions[i+2];
  if(![x,y,z].every(Number.isFinite))throw new TypeError('nonfinite mesh vertex');
  const p=[anchor[0]+scale*(c*x-s*z),anchor[1]+scale*y,anchor[2]+scale*(s*x+c*z)];
  for(let k=0;k<3;k++){min[k]=Math.min(min[k],p[k]);max[k]=Math.max(max[k],p[k]);}
 }
 // Minimum pick thickness for flat leaves and zero-thickness surfaces.
 for(let k=0;k<3;k++){const mid=(min[k]+max[k])/2,half=Math.max((max[k]-min[k])/2,0.025);min[k]=mid-half;max[k]=mid+half;}
 return {min,max};
}
