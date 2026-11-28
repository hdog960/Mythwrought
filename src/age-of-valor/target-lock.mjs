// AV13 optional target selection; does not change camera or authorize hits.
export function createTargetLock({identity,maxRange,minimumDot,graceMs,readFrame,lineOfSight}){
 const finite=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b,id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x),vec=x=>Array.isArray(x)&&x.length===3&&x.every(v=>finite(v,-1e7,1e7));
 const keys=['worldId','profileId','sourceId'];
 if(!identity||!keys.every(k=>id(identity[k]))||typeof identity.fixture!=='boolean'||!finite(maxRange,1,128)||!finite(minimumDot,-1,1)||!Number.isSafeInteger(graceMs)||graceMs<0||graceMs>2000||typeof readFrame!=='function'||typeof lineOfSight!=='function')throw Error('invalid lock policy');
 const scope=Object.freeze({...Object.fromEntries(keys.map(k=>[k,identity[k]])),fixture:identity.fixture});
 let selected=null,last=0,hiddenSince=null,closed=false,busy=false;
 const snapshot=()=>Object.freeze({targetId:selected,visible:selected!==null&&hiddenSince===null,clock:last,closed});
 function update(command='refresh'){
  if(closed||busy)return snapshot();
  if(!['refresh','acquire','next','previous','clear'].includes(command))throw Error('invalid lock command');
  if(command==='clear'){selected=null;hiddenSince=null;return snapshot();}
  busy=true;
  try{
   const f=readFrame();
   if(!f||!keys.every(k=>f[k]===scope[k])||f.fixture!==scope.fixture||f.alive!==true){closed=true;selected=null;hiddenSince=null;return snapshot();}
   if(f.playable!==true||f.combatMode!==true){selected=null;hiddenSince=null;return snapshot();}
   if(!Number.isSafeInteger(f.at)||f.at<last||!vec(f.eye)||!vec(f.forward)||Math.abs(Math.hypot(...f.forward)-1)>.001||!Array.isArray(f.targets)||f.targets.length>128)throw Error('invalid frame');
   last=f.at;const seen=new Set(),eligible=[];
   for(const t of f.targets){
    if(!t||!id(t.id)||seen.has(t.id)||!vec(t.center)||!['alive','resident','attackable','friendly'].every(k=>typeof t[k]==='boolean'))throw Error('invalid target');
    seen.add(t.id);
    if(t.id===scope.sourceId||!t.alive||!t.resident||!t.attackable||t.friendly||t.center[1]<-210||t.center[1]>257)continue;
    const ray=t.center.map((x,i)=>x-f.eye[i]),distance=Math.hypot(...ray);if(distance<.01||distance>maxRange)continue;
    const dot=ray.reduce((sum,x,i)=>sum+x*f.forward[i],0)/distance;
    const visible=lineOfSight(f.eye,t.center)===true;
    eligible.push({id:t.id,distance,dot,visible});
   }
   const candidates=eligible.filter(t=>t.visible&&t.dot>=minimumDot).sort((a,b)=>b.dot-a.dot||a.distance-b.distance||(a.id<b.id?-1:a.id>b.id?1:0));
   const current=eligible.find(t=>t.id===selected);
   if(command==='refresh'){
    if(!current){selected=null;hiddenSince=null;}
    else if(current.visible)hiddenSince=null;
    else{hiddenSince??=last;if(last-hiddenSince>=graceMs){selected=null;hiddenSince=null;}}
   }else{
    const idx=candidates.findIndex(t=>t.id===selected);
    const next=command==='acquire'?0:command==='next'?(idx+1)%candidates.length:idx<0?candidates.length-1:(idx-1+candidates.length)%candidates.length;
    selected=candidates[next]?.id??null;hiddenSince=null;
   }
   return snapshot();
  }catch{selected=null;hiddenSince=null;closed=true;return snapshot();}finally{busy=false;}
 }
 return Object.freeze({update,snapshot,close:()=>{closed=true;selected=null;hiddenSince=null;return snapshot();}});
}
