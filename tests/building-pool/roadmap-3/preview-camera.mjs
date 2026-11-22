// Roadmap 3 isolated QA camera. Fits ACTUAL exposed mesh bounds, not a mostly
// empty theoretical envelope. Never used by game camera, iPhone controls or saves.
const unit=v=>{const n=Math.hypot(...v);if(!n)throw new RangeError('invalid camera direction');return v.map(x=>x/n);};
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export function lookAt(eye,at){const f=unit(sub(at,eye)),s=unit(cross(f,[0,1,0])),u=cross(s,f);
 return [s[0],u[0],-f[0],0, s[1],u[1],-f[1],0, s[2],u[2],-f[2],0, -dot(s,eye),-dot(u,eye),dot(f,eye),1];}
export function ortho(l,r,b,t,n,f){return [2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1];}
export function multiply(a,b){const out=new Array(16).fill(0);for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)out[j*4+i]+=a[k*4+i]*b[j*4+k];return out;}
export function projectPoint(m,p){const h=[...p,1],out=[0,0,0,0];for(let i=0;i<4;i++)for(let j=0;j<4;j++)out[i]+=m[j*4+i]*h[j];return out.slice(0,3).map(x=>x/out[3]);}
export function fitPreviewCamera(envelope,vertices,viewportWidth,viewportHeight){
 if(!(Number.isFinite(viewportWidth)&&Number.isFinite(viewportHeight))||viewportWidth<=0||viewportHeight<=0)
  throw new RangeError('positive finite canvas dimensions required');
 if(!vertices||vertices.length<18||vertices.length%6!==0)throw new RangeError('non-empty xyz/rgb mesh required');
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<vertices.length;i+=6){for(let axis=0;axis<3;axis++){
  const x=vertices[i+axis];if(!Number.isFinite(x))throw new RangeError('non-finite geometry');
  min[axis]=Math.min(min[axis],x);max[axis]=Math.max(max[axis],x);
 }}
 const center=min.map((n,i)=>(n+max[i])/2);
 const {width:w,height:h,depth:d}=envelope;
 if(![w,h,d].every(n=>Number.isFinite(n)&&n>0))throw new RangeError('invalid envelope');
 // Direction preserves the original readable south-east, slightly elevated view.
 const eye=[center[0]+w*1.3,center[1]+h*1.12,center[2]+d*1.3];
 const f=unit(sub(center,eye)),s=unit(cross(f,[0,1,0])),u=cross(s,f);
 let horizontal=0,vertical=0;
 for(let x of [min[0],max[0]])for(let y of [min[1],max[1]])for(let z of [min[2],max[2]]){
  const v=sub([x,y,z],center);horizontal=Math.max(horizontal,Math.abs(dot(v,s)));vertical=Math.max(vertical,Math.abs(dot(v,u)));
 }
 const aspect=viewportWidth/viewportHeight;
 const span=Math.max(vertical,horizontal/aspect,0.5)*1.16; // 16% side clearance for edge AA
 const matrix=multiply(ortho(-span*aspect,span*aspect,-span,span,-150,150),lookAt(eye,center));
 return Object.freeze({matrix,span,aspect,center,geometryMin:min,geometryMax:max,
  projectedHalfWidth:horizontal/(span*aspect),projectedHalfHeight:vertical/span});
}
