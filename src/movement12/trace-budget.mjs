// Opt-in diagnostic: bounded deterministic swept trace accounting. No production registration.
export const TRACE_BUDGET_CONTRACT='movement12-trace-budget-v1';
const point=p=>p&&['x','feet','z'].every(k=>typeof p[k]==='number'&&Number.isFinite(p[k]));
export function auditBoundedTrace({world,positions,collides,maxSegment=.1,maxSamples=4096}={}){
 if(!Array.isArray(positions)||positions.length<2||positions.length>4097||!positions.every(point))throw new TypeError('finite bounded positions required');
 if(typeof collides!=='function')throw new TypeError('host collision reader required');
 if(!(Number.isFinite(maxSegment)&&maxSegment>0&&maxSegment<=.25)||!Number.isSafeInteger(maxSamples)||maxSamples<1)throw new RangeError('invalid sampling budget');
 const steps=[];let required=1;
 for(let i=1;i<positions.length;i++){
  const a=positions[i-1],b=positions[i],distance=Math.hypot(b.x-a.x,b.feet-a.feet,b.z-a.z);
  const n=Math.max(1,Math.ceil(distance/maxSegment));required+=n;
  if(!Number.isSafeInteger(required)||required>maxSamples)return Object.freeze({safe:false,reason:'budget-exceeded',samples:0,required,firstBlocked:null,live:false});
  steps.push(n);
 }
 let samples=0;
 for(let i=0;i<steps.length;i++){
  const a=positions[i],b=positions[i+1],n=steps[i];
  for(let j=i===0?0:1;j<=n;j++){
   const t=j/n,x=a.x+(b.x-a.x)*t,feet=a.feet+(b.feet-a.feet)*t,z=a.z+(b.z-a.z)*t;
   const hit=collides(world,x,feet,z);samples++;
   if(typeof hit!=='boolean')throw new TypeError('host collision reader must return boolean');
   if(hit)return Object.freeze({safe:false,reason:samples===1?'embedded-start':'collision',samples,required,segment:i,firstBlocked:Object.freeze({x,feet,z,t}),live:false});
  }
 }
 return Object.freeze({safe:true,reason:'clear',samples,required,segment:null,firstBlocked:null,live:false});
}