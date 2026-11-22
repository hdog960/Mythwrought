// Builder 1A isolated WebGL2 diagnostic camera; computed from real authored occupied cells.
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const unit=v=>{const l=Math.hypot(...v);if(!l)throw Error('zero camera vector');return v.map(x=>x/l)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export function lookAt(eye,center){
 const f=unit(sub(center,eye)),s=unit(cross(f,[0,1,0])),u=cross(s,f);
 return [s[0],u[0],-f[0],0,s[1],u[1],-f[1],0,s[2],u[2],-f[2],0,
  -dot(s,eye),-dot(u,eye),dot(f,eye),1];
}
export function ortho(l,r,b,t,n,f){return [2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1]}
export function mul(a,b){const out=new Array(16).fill(0);
 for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)out[j*4+i]+=a[k*4+i]*b[j*4+k];return out;
}
export function fitM2Camera(b,vertices,width,height){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('invalid viewport');
 if(!vertices?.length||vertices.length%6)throw Error('bad source mesh');
 const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<vertices.length;i+=6)for(let j=0;j<3;j++){
  lo[j]=Math.min(lo[j],vertices[i+j]);hi[j]=Math.max(hi[j],vertices[i+j]);
 }
 const mid=lo.map((x,i)=>(x+hi[i])/2);
 const {width:w,height:h,depth:d}=b.footprint;
 const eye=[mid[0]+w*1.3,mid[1]+h*1.12,mid[2]-d*1.35];
 const f=unit(sub(mid,eye)),s=unit(cross(f,[0,1,0])),u=cross(s,f);
 let halfX=0,halfY=0;
 for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]])for(const z of [lo[2],hi[2]]){
  const delta=sub([x,y,z],mid);
  halfX=Math.max(halfX,Math.abs(dot(delta,s)));halfY=Math.max(halfY,Math.abs(dot(delta,u)));
 }
 const aspect=width/height,span=Math.max(.5,halfY,halfX/aspect)*1.2;
 return {matrix:mul(ortho(-span*aspect,span*aspect,-span,span,-160,160),lookAt(eye,mid)),
  aspect,span,bounds:{lo,hi},center:mid};
}
