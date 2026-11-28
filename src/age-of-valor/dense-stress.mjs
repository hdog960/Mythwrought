// Synthetic dense impact benchmark, no device acceptance claim.
export function denseCombatStress({projectile,pool,frame,cycles=20,now=()=>Date.now()}){
 const scope={worldId:'w',profileId:'p',sourceId:'s',fixture:true};
 // All 128 targets in the same spatial neighborhood, only one intersecting at the last step.
 const targets=Array.from({length:128},(_,i)=>({id:'t:'+i,from:[i===0?1.0:2+(i%8)*.1,1,i===0?0:.5+(i%10)*.1],to:[i===0?1.0:2+(i%8)*.1,1,i===0?0:.5+(i%10)*.1],radius:.06,alive:true,friendly:false,attackable:true,resident:true}));
 function run(indexed){let validated=0,candidates=0,reads=0,terrain=0,impacts=0;const times=[],traces=[];
 for(let c=0;c<cycles;c++){const frames=[],x=pool({capacity:32,makeProjectile:projectile,authorizeLaunch:()=>true,...(indexed?{readSharedFrame:q=>{reads++;const v=frame({identity:scope,fromMs:q.fromMs,targets,complete:true});frames.push(v);return v}}:{})});
 for(let i=0;i<32;i++){const identity={...scope,actionId:'a:'+i,projectileId:'p:'+i,definitionId:'fixture:bolt'};if(!x.launch({sequence:i+1,options:{identity,origin:[0,1,0],velocity:[10,0,0],radius:.05,range:10,lifeMs:100,readAuthority:()=>({...identity,active:true}),traceTerrain:()=>{terrain++;return{complete:true,fraction:null}},readTargets:()=>{reads++;validated+=targets.length;candidates+=targets.length;return targets}}}))throw Error('launch');}
 const start=now(),out=x.advance(100);times.push(now()-start);if(!out.ok||out.events.length!==32||x.snapshot().count!==0)throw Error('dense impact missing');impacts+=out.events.length;traces.push(JSON.stringify(out.events));
 for(const f of frames){const s=f.stats();validated+=s.validated;candidates+=s.candidates;}
 }
 times.sort((a,b)=>a-b);return{metrics:{validated,candidates,reads,terrain,impacts,p95Ms:times[Math.ceil(.95*times.length)-1],maxMs:times.at(-1)},traces};
 }
 const a=run(false),b=run(true);if(JSON.stringify(a.traces)!==JSON.stringify(b.traces))throw Error('dense impact mismatch');return Object.freeze({direct:a.metrics,indexed:b.metrics,parity:true});
}
