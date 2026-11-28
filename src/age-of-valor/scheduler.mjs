// AV1 isolated scheduler v1; no world or health writes.
export function createCombatScheduler() {
  const states = Object.freeze(['idle','attack-windup','attack-active','attack-recovery','blocking','parrying','dodging','casting','stagger','incapacitated','dead']);
  let state='idle', clock=0, seq=0, action=null, deadline=null, phases=[];
  const snapshot=()=>Object.freeze({version:1,state,clock,actionId:action?.id??null,kind:action?.kind??null,deadline});
  const validMs=x=>Number.isSafeInteger(x)&&x>=1&&x<=60000;
  const result=(ok,reason,events=[])=>({ok,reason,events,snapshot:snapshot()});
  function transition(next,at,events) {
    const previous=state;state=next;
    events.push(Object.freeze({type:'transition',from:previous,to:next,at,actionId:action?.id??null,kind:action?.kind??null}));
  }
  function finish(at,events) {transition('idle',at,events);action=null;deadline=null;phases=[];}
  function begin(intent) {
    if(state!=='idle')return result(false,'busy');
    if(!intent||typeof intent!=='object')return result(false,'invalid-intent');
    const {kind}=intent;let p;
    if(kind==='light'||kind==='heavy'){
      if(![intent.windupMs,intent.activeMs,intent.recoveryMs].every(validMs))return result(false,'invalid-timing');
      p=[['attack-windup',intent.windupMs],['attack-active',intent.activeMs],['attack-recovery',intent.recoveryMs]];
    }else if(kind==='block')p=[['blocking',null]];
    else if(['parry','dodge','cast'].includes(kind)){
      if(!validMs(intent.durationMs))return result(false,'invalid-timing');
      p=[[{parry:'parrying',dodge:'dodging',cast:'casting'}[kind],intent.durationMs]];
    }else return result(false,'unknown-action');
    if(seq===Number.MAX_SAFE_INTEGER||clock>Number.MAX_SAFE_INTEGER-180000)return result(false,'clock-limit');
    action={id:++seq,kind};const [next,duration]=p.shift();phases=p;
    deadline=duration===null?null:clock+duration;
    const events=[];transition(next,clock,events);return result(true,'started',events);
  }
  function advance(ms){
    if(!Number.isSafeInteger(ms)||ms<0||ms>60000||clock>Number.MAX_SAFE_INTEGER-ms)return result(false,'invalid-delta');
    const end=clock+ms,events=[];
    while(deadline!==null&&deadline<=end){
      const at=deadline;
      if(phases.length){const [next,duration]=phases.shift();deadline=at+duration;transition(next,at,events);}
      else finish(at,events);
    }
    clock=end;return result(true,'advanced',events);
  }
  function releaseBlock(id){
    if(state!=='blocking'||id!==action?.id)return result(false,'stale-or-not-blocking');
    const events=[];finish(clock,events);return result(true,'released',events);
  }
  function cancel(id){
    if(!action||id!==action.id||['stagger','incapacitated','dead'].includes(state))return result(false,'not-cancellable');
    if(!['attack-windup','casting','blocking'].includes(state))return result(false,'committed-action');
    const events=[];finish(clock,events);return result(true,'cancelled',events);
  }
  function abortForLifecycle(){
    if(!action)return result(false,'no-owned-action');
    const events=[];finish(clock,events);return result(true,'lifecycle-abort',events);
  }
  function interrupt(kind,durationMs){
    if(state==='dead')return result(false,'dead');
    if(!['stagger','incapacitated','dead'].includes(kind))return result(false,'unknown-interrupt');
    if(kind!=='dead'&&(!validMs(durationMs)||clock>Number.MAX_SAFE_INTEGER-durationMs))return result(false,'invalid-timing');
    if(state==='incapacitated'&&kind==='stagger')return result(false,'lower-priority');
    if(state===kind&&kind!=='dead'){
      deadline=Math.max(deadline,clock+durationMs);
      return result(true,'interrupt-extended');
    }
    const events=[];transition(kind,clock,events);action=null;phases=[];
    deadline=kind==='dead'?null:clock+durationMs;
    return result(true,'interrupted',events);
  }
  function resetAfterRespawn(){
    if(state!=='dead')return result(false,'not-dead');
    const events=[];finish(clock,events);return result(true,'respawn-reset',events);
  }
  return Object.freeze({states,snapshot,begin,advance,releaseBlock,cancel,abortForLifecycle,interrupt,resetAfterRespawn});
}
