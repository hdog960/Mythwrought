// AV8 movement-owner command/receipt, no locomotion or immunity implementation.
export function createDodgeCommand({identity,readAuthority,move,maxDistance,durationMs}){
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x);
 const finite=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
 if(!identity||!['worldId','profileId','actionId','sourceId'].every(k=>id(identity[k]))||typeof readAuthority!=='function'||typeof move!=='function'||!finite(maxDistance,.01,8)||!Number.isSafeInteger(durationMs)||durationMs<1||durationMs>60000)throw Error('invalid dodge');
 const scope=Object.freeze(Object.fromEntries(['worldId','profileId','actionId','sourceId'].map(k=>[k,identity[k]])));let used=false;
 const result=(status,extra={})=>Object.freeze({status,...extra});
 function execute(direction){
  if(used)return result('already-used');
  if(!Array.isArray(direction)||direction.length!==2||direction.some(x=>!finite(x,-1,1))||Math.abs(Math.hypot(...direction)-1)>.001)return result('invalid-direction');
  used=true;
  try{
   const a=readAuthority();
   if(!a||a.active!==true||a.state!=='dodging'||a.fixture!==false||!Object.keys(scope).every(k=>a[k]===scope[k]))return result('not-authorized');
   const command=Object.freeze({version:1,...scope,direction:Object.freeze([...direction]),maxDistance,durationMs});
   const receipt=move(command);
   if(!receipt||receipt.version!==1||!Object.keys(scope).every(k=>receipt[k]===scope[k])||typeof receipt.accepted!=='boolean'||typeof receipt.blocked!=='boolean'||receipt.collisionVerified!==true||!Array.isArray(receipt.displacement)||receipt.displacement.length!==2||receipt.displacement.some(x=>!finite(x,-maxDistance,maxDistance)))return result('authority-uncertain');
   const distance=Math.hypot(...receipt.displacement),forward=receipt.displacement[0]*direction[0]+receipt.displacement[1]*direction[1];
   if(distance>maxDistance+1e-8||forward< -1e-8||(!receipt.accepted&&distance!==0)||(!receipt.blocked&&receipt.accepted&&distance===0))return result('authority-uncertain');
   return result(receipt.accepted?'accepted':'rejected',{blocked:receipt.blocked,distance,displacement:Object.freeze([...receipt.displacement])});
  }catch{return result('authority-uncertain');}
 }
 return Object.freeze({execute});
}
