// Detached trusted owner frame port, no live authority granted.
export function createOwnerCollisionFrames({identity,readOwnerFrame,makeFrame}){
 const keys=['worldId','profileId','sourceId','fixture'];
 if(!identity||!['worldId','profileId','sourceId'].every(k=>typeof identity[k]==='string'&&identity[k].length>0)||typeof identity.fixture!=='boolean'||typeof readOwnerFrame!=='function'||typeof makeFrame!=='function')throw Error('invalid frame owner');
 const scope=Object.freeze(Object.fromEntries(keys.map(k=>[k,identity[k]])));let last=-1,revision=-1,closed=false,busy=false;
 function read(q){
  if(closed||busy||!q||!keys.every(k=>q.identity?.[k]===scope[k])||!Number.isSafeInteger(q.fromMs)||q.fromMs<0||q.fromMs%10||q.toMs!==q.fromMs+10||q.fromMs<=last)throw Error('invalid frame request');
  busy=true;try{const v=readOwnerFrame(Object.freeze({identity:scope,fromMs:q.fromMs,toMs:q.toMs}));if(closed||!v||v.version!==1||v.complete!==true||v.verified!==true||!keys.every(k=>v.identity?.[k]===scope[k])||v.fromMs!==q.fromMs||v.toMs!==q.toMs||!Number.isSafeInteger(v.revision)||v.revision<0||v.revision<revision)throw Error('uncertain owner frame');const frame=makeFrame({identity:scope,fromMs:q.fromMs,targets:v.targets,complete:true});if(closed)throw Error('closed');last=q.fromMs;revision=v.revision;return frame;}catch(e){closed=true;throw e;}finally{busy=false;}
 }
 return Object.freeze({read,close:()=>{closed=true},snapshot:()=>Object.freeze({last,revision,closed})});
}
