// AV16 deterministic bounded worst-case candidate scan; no iPhone timing claim.
export function qualifyCombatStress({makeProjectile,makePool,cycles=20,now=()=>Date.now()}){
 if(!Number.isSafeInteger(cycles)||cycles<1||cycles>100||typeof now!=='function')throw Error('invalid stress plan');
 let launched=0,terrainCalls=0,targetCalls=0,impactCount=0,peak=0;const times=[];
 const scope={worldId:'fixture:world',profileId:'fixture:profile',sourceId:'fixture:source',fixture:true};
 const targets=Object.freeze(Array.from({length:128},(_,i)=>Object.freeze({id:'target:'+i,from:[20,1,i+10],to:[20,1,i+10],radius:.1,alive:true,friendly:false,attackable:true,resident:true})));
 for(let c=0;c<cycles;c++){
  const pool=makePool({capacity:32,makeProjectile,authorizeLaunch:()=>true});
  for(let i=0;i<32;i++){const identity={...scope,actionId:'action:'+i,projectileId:'projectile:'+i,definitionId:'fixture:bolt'};if(!pool.launch({sequence:i+1,options:{identity,origin:[0,1,0],velocity:[10,0,0],radius:.05,range:10,lifeMs:100,readAuthority:()=>({...identity,active:true}),traceTerrain:()=>{terrainCalls++;return{complete:true,fraction:null}},readTargets:()=>{targetCalls++;return targets}}}))throw Error('launch failure');launched++;}
  peak=Math.max(peak,pool.snapshot().count);
  const start=now(),step=pool.advance(100);times.push(Math.max(0,now()-start));if(!step.ok||pool.snapshot().count!==0)throw Error('pool not retired');impactCount+=step.events.length;
 }
 const ordered=[...times].sort((a,b)=>a-b);
 return Object.freeze({cycles,launched,peak,terrainCalls,targetCalls,candidateChecks:targetCalls*128,impactCount,p95Ms:ordered[Math.ceil(.95*ordered.length)-1],maxMs:ordered.at(-1)});
}
