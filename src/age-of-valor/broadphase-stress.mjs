// AV16 same-workload direct versus shared spatial frame comparison.
export function compareBroadphase({makeProjectile,makePool,makeFrame,cycles=20,now=()=>Date.now()}){
 const scope={worldId:'fixture:world',profileId:'fixture:profile',sourceId:'fixture:source',fixture:true};
 const targets=Array.from({length:128},(_,i)=>({id:'target:'+i,from:[20,1,i+10],to:[20,1,i+10],radius:.1,alive:true,friendly:false,attackable:true,resident:true}));
 function run(indexed){
  let launches=0,terrain=0,reads=0,validated=0,candidates=0,queries=0,peak=0;const times=[];
  for(let c=0;c<cycles;c++){
   const frames=[];
   const pool=makePool({capacity:32,makeProjectile,authorizeLaunch:()=>true,...(indexed?{readSharedFrame:q=>{reads++;const f=makeFrame({identity:q.identity,fromMs:q.fromMs,targets,complete:true});frames.push(f);return f}}:{})});
   for(let i=0;i<32;i++){const identity={...scope,actionId:'action:'+i,projectileId:'projectile:'+i,definitionId:'fixture:bolt'};if(!pool.launch({sequence:i+1,options:{identity,origin:[0,1,0],velocity:[10,0,0],radius:.05,range:10,lifeMs:100,readAuthority:()=>({...identity,active:true}),traceTerrain:()=>{terrain++;return{complete:true,fraction:null}},readTargets:()=>{reads++;validated+=targets.length;candidates+=targets.length;queries++;return targets}}}))throw Error('launch failure');launches++;}
   peak=Math.max(peak,pool.snapshot().count);const start=now(),out=pool.advance(100);times.push(now()-start);if(!out.ok||out.events.length||pool.snapshot().count)throw Error('stress outcome');
   for(const f of frames){const s=f.stats();validated+=s.validated;candidates+=s.candidates;queries+=s.queries;}
  }
  times.sort((a,b)=>a-b);return Object.freeze({launches,peak,terrain,reads,validated,candidates,queries,p95Ms:times[Math.ceil(.95*times.length)-1],maxMs:times.at(-1)});
 }
 return Object.freeze({baseline:run(false),indexed:run(true)});
}
