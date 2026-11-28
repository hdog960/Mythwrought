// AV1 isolated trusted-host authorization; no gameplay effects.
export function createCombatAuthorization({scheduler,worldEpoch,definitions,readContext,authorize}){
  if(!scheduler||!Number.isSafeInteger(worldEpoch)||worldEpoch<0||typeof readContext!=='function'||typeof authorize!=='function'||!definitions||typeof definitions!=='object')throw Error('invalid combat authority');
  const kinds=['light','heavy','block','parry','dodge','cast'];
  const validMs=x=>Number.isSafeInteger(x)&&x>=1&&x<=60000;
  const catalog=new Map();
  for(const [kind,d] of Object.entries(definitions)){
    if(!kinds.includes(kind)||!d||typeof d!=='object')throw Error('invalid action definition');
    let def={kind};
    if(kind==='light'||kind==='heavy'){
      if(![d.windupMs,d.activeMs,d.recoveryMs].every(validMs))throw Error('invalid attack timing');
      Object.assign(def,{windupMs:d.windupMs,activeMs:d.activeMs,recoveryMs:d.recoveryMs});
    }else if(kind!=='block'){
      if(!validMs(d.durationMs))throw Error('invalid action timing');
      def.durationMs=d.durationMs;
    }
    catalog.set(kind,Object.freeze(def));
  }
  let suspended=false,retired=false;
  const reply=(ok,reason,events=[])=>({ok,reason,events,snapshot:scheduler.snapshot()});
  function context(){
    try{return readContext();}catch{return null;}
  }
  function synchronize(){
    const c=context();
    if(c&&Number.isSafeInteger(c.worldEpoch)&&c.worldEpoch!==worldEpoch)retired=true;
    if(retired||!c||c.worldEpoch!==worldEpoch||typeof c.alive!=='boolean'){
      const abort=scheduler.abortForLifecycle();suspended=true;return reply(false,'world-unavailable',abort.events);
    }
    if(!c.alive){
      suspended=true;const death=scheduler.interrupt('dead');return reply(false,'dead',death.events);
    }
    if(c.playable!==true||c.combatMode!==true||c.creative!==false||c.mounted!==false||c.readOnly!==false){
      suspended=true;const abort=scheduler.abortForLifecycle();return reply(false,'context-blocked',abort.events);
    }
    if(scheduler.snapshot().state==='dead'){suspended=true;return reply(false,'respawn-required');}
    suspended=false;return reply(true,'ready');
  }
  function request(kind){
    const gate=synchronize();if(!gate.ok)return gate;
    if(scheduler.snapshot().state!=='idle')return reply(false,'busy');
    const d=catalog.get(kind);if(!d)return reply(false,'undefined-action');
    let permitted=false;
    try{permitted=authorize(d,scheduler.snapshot())===true;}catch{}
    if(!permitted)return reply(false,'action-not-authorized');
    return scheduler.begin(d);
  }
  function advance(ms){
    const gate=synchronize();return gate.ok?scheduler.advance(ms):gate;
  }
  function releaseBlock(id){
    const gate=synchronize();return gate.ok?scheduler.releaseBlock(id):gate;
  }
  function cancelInput(){
    suspended=true;return scheduler.abortForLifecycle();
  }
  function acknowledgeRespawn(){
    const c=context();
    if(retired||!c||c.worldEpoch!==worldEpoch||c.alive!==true)return reply(false,'respawn-not-confirmed');
    return scheduler.resetAfterRespawn();
  }
  return Object.freeze({request,advance,releaseBlock,cancelInput,acknowledgeRespawn,status:()=>Object.freeze({suspended,retired,snapshot:scheduler.snapshot()})});
}
