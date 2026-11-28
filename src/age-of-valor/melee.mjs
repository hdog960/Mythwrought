// AV5 isolated sampled sweep; authoritative host snapshots and LOS required.
export function scanMelee({definition,sourceId,from,to,targets,lineOfSight}){
 const finite=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
 const vec=v=>Array.isArray(v)&&v.length===3&&v.every(n=>finite(n,-10000000,10000000));
 const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=v=>Math.hypot(...v),mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
 const unit=v=>{const n=norm(v);return n>=.999&&n<=1.001?v.map(x=>x/n):null};
 if(!definition||definition.delivery!=='melee'||!['sweep','ray'].includes(definition.geometry?.shape)||!finite(definition.reach,.01,16)||!finite(definition.geometry.radius,0,2)||!id(sourceId)||!from||!to||!vec(from.eye)||!vec(to.eye)||!vec(from.forward)||!vec(to.forward)||!unit(from.forward)||!unit(to.forward)||!Number.isSafeInteger(from.at)||!Number.isSafeInteger(to.at)||from.at<0||to.at<=from.at||to.at-from.at>100||!Array.isArray(targets)||targets.length>128||typeof lineOfSight!=='function')throw Error('invalid melee frame');
 if(from.eye[1]<-210||from.eye[1]>257||to.eye[1]<-210||to.eye[1]>257)throw Error('outside physical height');
 const travel=norm(sub(to.eye,from.eye)),turn=norm(sub(to.forward,from.forward));
 if(travel>2||turn>1)throw Error('discontinuous attacker sample');
 const seen=new Set(),hits=[];
 for(const t of targets){
  if(!t||!id(t.id)||seen.has(t.id)||!vec(t.from)||!vec(t.to)||!finite(t.radius,.01,2)||typeof t.alive!=='boolean'||typeof t.attackable!=='boolean'||typeof t.friendly!=='boolean'||typeof t.resident!=='boolean')throw Error('invalid target snapshot');
  seen.add(t.id);
  if(t.id===sourceId||!t.alive||!t.attackable||t.friendly||!t.resident)continue;
  if(t.from[1]<-210||t.from[1]>257||t.to[1]<-210||t.to[1]>257)continue;
  const motion=norm(sub(t.to,t.from));if(motion>2)continue;
  const steps=Math.max(1,Math.ceil((travel+motion+turn*definition.reach*2)/Math.min(.125,t.radius/2)));
  if(steps>128)continue; // refuse undersampled movement
  for(let j=0;j<=steps;j++){
   const f=j/steps,eye=mix(from.eye,to.eye,f),raw=mix(from.forward,to.forward,f),n=norm(raw);
   if(n<.5)continue;
   const dir=raw.map(x=>x/n),center=mix(t.from,t.to,f),rel=sub(center,eye);
   const projection=dot(rel,dir);
   if(projection<=0||projection>definition.reach+t.radius||norm(rel)>definition.reach+t.radius+definition.geometry.radius)continue;
   const along=Math.min(definition.reach,projection),contact=eye.map((x,i)=>x+dir[i]*along);
   if(norm(sub(center,contact))>t.radius+definition.geometry.radius)continue;
   let visible=false;try{visible=lineOfSight(eye,contact)===true&&lineOfSight(eye,center)===true;}catch{}
   if(!visible)continue;
   hits.push(Object.freeze({targetId:t.id,at:from.at+(to.at-from.at)*f,distance:norm(rel),contact:Object.freeze(contact)}));break;
  }
 }
 return Object.freeze(hits.sort((a,b)=>a.at-b.at||a.distance-b.distance||(a.targetId<b.targetId?-1:a.targetId>b.targetId?1:0)));
}
export function createMeleeExecution({definition,identity,activeFrom,activeUntil,readAuthority,resolve,apply,validateReceipt}){
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
 if(!definition||definition.delivery!=='melee'||!['fixture','content'].includes(definition.scope)||!id(definition.id)||!Number.isInteger(definition.geometry?.maxTargets)||definition.geometry.maxTargets<1||definition.geometry.maxTargets>32||!identity||!['worldId','profileId','actionId','sourceId'].every(k=>id(identity[k]))||!Number.isSafeInteger(activeFrom)||!Number.isSafeInteger(activeUntil)||activeFrom<0||activeUntil<=activeFrom||activeUntil-activeFrom>60000||![readAuthority,resolve,apply,validateReceipt].every(f=>typeof f==='function'))throw Error('invalid melee execution');
 const scope=Object.freeze({...identity}),attempted=new Set();let last=activeFrom,closed=false,busy=false;
 function permitted(){
  try{const a=readAuthority();return a?.active===true&&a.worldId===scope.worldId&&a.profileId===scope.profileId&&a.actionId===scope.actionId&&a.sourceId===scope.sourceId&&a.definitionId===definition.id&&a.fixture===(definition.scope==='fixture');}catch{return false;}
 }
 function step(frame){
  if(closed||busy)return Object.freeze([]);
  if(!permitted()){closed=true;return Object.freeze([]);}
  if(!frame||frame.from?.at!==last||frame.to?.at>activeUntil)throw Error('noncontiguous or out-of-window melee sample');
  busy=true;
  try{
   const hits=scanMelee({...frame,definition,sourceId:scope.sourceId});last=frame.to.at;
   const outcomes=[];
   for(const hit of hits){
    if(attempted.size>=definition.geometry.maxTargets)break;
    if(attempted.has(hit.targetId))continue;
    if(!permitted()){closed=true;break;}
    attempted.add(hit.targetId); // claim before callback, including uncertain outcomes
    const transactionId=scope.actionId+'.'+attempted.size;
    if(!id(transactionId)){closed=true;throw Error('transaction identity overflow');}
    try{
     const result=resolve(definition,hit);
     if(!result||result.definitionId!==definition.id||typeof result.amount!=='number'||!Number.isFinite(result.amount)||result.amount<0||result.amount>100000)throw Error('invalid damage calculation');
     if(result.amount===0){outcomes.push(Object.freeze({hit,status:'no-damage'}));continue;}
     if(!permitted()){closed=true;break;}
     const request=Object.freeze({version:1,worldId:scope.worldId,profileId:scope.profileId,actionId:scope.actionId,sourceId:scope.sourceId,targetId:hit.targetId,transactionId,definitionId:definition.id,fixture:definition.scope==='fixture',amount:result.amount});
     const receipt=validateReceipt(request,apply(request));
     outcomes.push(Object.freeze({hit,status:receipt.accepted?'accepted':'rejected',receipt}));
    }catch{outcomes.push(Object.freeze({hit,status:'authority-uncertain'}));closed=true;break;}
   }
   if(last===activeUntil)closed=true;
   return Object.freeze(outcomes);
  }finally{busy=false;}
 }
 return Object.freeze({step,close:()=>{closed=true},status:()=>Object.freeze({closed,attempted:attempted.size,last})});
}
