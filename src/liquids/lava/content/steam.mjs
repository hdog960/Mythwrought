// Lava B: presentation-only steam from committed, live host events.
export const STEAM_MATERIAL=Object.freeze({pass:'transparent',color:Object.freeze([0.82,0.86,0.88]),depthTest:true,depthWrite:false,blend:'straight-alpha',cull:false});
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const point=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
// Stable integer noise; never consume simulation RNG.
function noise(seq,i,salt){
  let n=(seq>>>0)^Math.imul(Math.floor(seq/4294967296),0x85ebca6b)^Math.imul(i+1,0x9e3779b1)^salt;
  n=Math.imul(n^(n>>>16),0x7feb352d);n=Math.imul(n^(n>>>15),0x846ca68b);
  return ((n^(n>>>16))>>>0)/4294967296;
}
// One instance per live ordered host event stream. No persistence or offline replay.
export function createLavaSteam({isVisible,maxParticles=96,particlesPerUnit=2,lifetime=24,maxEvents=32,initialSequence=0}={}){
  if(typeof isVisible!=='function')throw new TypeError('explicit steam visibility callback required');
  if(!int(maxParticles,1,256)||!int(particlesPerUnit,1,4)||!int(lifetime,2,120)||!int(maxEvents,1,128)||!int(initialSequence,0,Number.MAX_SAFE_INTEGER))throw new RangeError('steam budget');
  let particles=[],lastSequence=initialSequence,busy=false;
  function guard(){if(busy)throw new Error('reentrant steam operation');}
  function ingest(events){
    guard();
    if(!Array.isArray(events)||events.length>maxEvents)throw new RangeError('steam event budget');
    // Validate the entire ordered batch before consuming any sequence.
    let prev=0;
    for(const e of events){
      if(!e||e.kind!=='lava-quench'||e.committed!==true||!int(e.sequence,1,Number.MAX_SAFE_INTEGER)||e.sequence<=prev||!point(e.x,e.y,e.z)||!int(e.steamUnits,1,8))throw new TypeError('invalid committed steam event');
      prev=e.sequence;
    }
    let emitted=0,dropped=0,duplicates=0,nextSequence=lastSequence;
    const staged=[];
    busy=true;
    try{
      for(const e of events){
        if(e.sequence<=nextSequence){duplicates++;continue;}
        nextSequence=e.sequence;
        const count=e.steamUnits*particlesPerUnit;
        if(isVisible(e.x,e.y,e.z)!==true){dropped+=count;continue;}
        const admitted=Math.min(count,maxParticles-particles.length-staged.length);
        dropped+=count-admitted;
        for(let i=0;i<admitted;i++)staged.push({x:e.x,y:e.y,z:e.z,age:0,
          ox:0.25+0.5*noise(e.sequence,i,1),oz:0.25+0.5*noise(e.sequence,i,2),
          vx:(noise(e.sequence,i,3)-0.5)*0.035,vz:(noise(e.sequence,i,4)-0.5)*0.035,
          rise:0.035+noise(e.sequence,i,5)*0.035,size:0.12+noise(e.sequence,i,6)*0.12});
        emitted+=admitted;
      }
      particles.push(...staged);lastSequence=nextSequence;
      return Object.freeze({emitted,dropped,duplicates,active:particles.length});
    }finally{busy=false;}
  }
  // Host chooses bounded visual clock steps, never physical simulation ticks.
  function advance(steps=1){
    guard();if(!int(steps,0,120))throw new RangeError('steam visual steps');
    busy=true;
    try{
      const next=[];
      for(const p of particles){
        const age=p.age+steps;
        if(age>=lifetime)continue;
        const x=p.x+Math.floor(p.ox+p.vx*age),y=p.y+Math.floor(0.85+p.rise*age),z=p.z+Math.floor(p.oz+p.vz*age);
        if(point(x,y,z)&&isVisible(x,y,z)===true)next.push({...p,age});
      }
      particles=next;return particles.length;
    }finally{busy=false;}
  }
  // Camera-relative packed xyz, size, opacity. No GPU ownership or sort policy.
  function sample(origin){
    guard();if(!Array.isArray(origin)||origin.length!==3||!point(...origin))throw new RangeError('steam render origin');
    const rows=new Float32Array(particles.length*5);let n=0;
    busy=true;
    try{
      for(const p of particles){
        const dx=p.x-origin[0],dy=p.y-origin[1],dz=p.z-origin[2],t=p.age/lifetime;
        if(Math.max(Math.abs(dx),Math.abs(dy),Math.abs(dz))>4096)continue;
        const ox=p.ox+p.vx*p.age,oy=0.85+p.rise*p.age,oz=p.oz+p.vz*p.age;
        const x=p.x+Math.floor(ox),y=p.y+Math.floor(oy),z=p.z+Math.floor(oz);
        if(!point(x,y,z)||isVisible(x,y,z)!==true)continue;
        rows.set([dx+ox,dy+oy,dz+oz,p.size*(1+t),0.6*(1-t)**2],n*5);n++;
      }
      return Object.freeze({count:n,stride:5,data:rows.subarray(0,n*5)});
    }finally{busy=false;}
  }
  function clear(){guard();particles=[];}
  function stats(){return Object.freeze({active:particles.length,lastSequence});}
  return Object.freeze({ingest,advance,sample,clear,stats});
}
