// AV13 combined isolated clock coordinator, injected trusted owners.
export function createCombatSimulation({controller,guard,poise,status,ability,readContext,worldEpoch,consumeProposal}){
 if(!controller||!guard||!poise||!status||!ability||typeof readContext!=='function'||typeof consumeProposal!=='function'||!Number.isSafeInteger(worldEpoch)||worldEpoch<0)throw Error('invalid simulation');
 let clock=0,closed=false,busy=false;
 const snapshot=()=>Object.freeze({clock,closed,controller:controller.state(),poise:poise.snapshot(),status:status.snapshot(),ability:ability.snapshot()});
 const out=(ok,reason,events=[])=>Object.freeze({ok,reason,events:Object.freeze(events),snapshot:snapshot()});
 function retire(){closed=true;controller.cancel();guard.close();poise.close();status.close();ability.close();}
 function context(){const c=readContext();if(!c||c.worldEpoch!==worldEpoch||c.alive!==true){retire();return 'retired';}if(c.playable!==true||c.combatMode!==true||c.creative!==false||c.mounted!==false||c.readOnly!==false){controller.cancel();ability.cancel();guard.synchronize();return 'paused';}return null;}
 function clocks(){const s=controller.state();return [s.scheduler.clock,s.resources.clock,poise.snapshot().clock,status.snapshot().clock,ability.snapshot().clock].every(t=>t===clock);}
 function publish(events,delivered){
  for(const event of events){
   if(context())return false;
   if(event.type==='tick-proposal'||event.type==='ability-execution-proposal'){
    const receipt=consumeProposal(event);
    if(!receipt||receipt.confirmed!==true||typeof receipt.accepted!=='boolean'||(receipt.interrupt!==undefined&&typeof receipt.interrupt!=='boolean'))throw Error('uncertain proposal');
    if(receipt.accepted&&receipt.interrupt===true){ability.cancel();controller.cancel();}
   }
   delivered.push(event);
   if(context())return false;
  }
  return true;
 }
 function advance(ms){
  if(closed||busy||!Number.isSafeInteger(ms)||ms<0||ms>1000||clock>Number.MAX_SAFE_INTEGER-ms)return out(false,'unavailable-or-invalid');
  busy=true;const delivered=[];
  try{
   let gate=context();if(gate)return out(false,gate);
   if(!clocks())throw Error('clock divergence');
   const end=clock+ms;
   while(clock<end){
    const g=guard.synchronize();if(!g.ok&&g.reason!=='guard-broken')throw Error('guard fault');
    const a=ability.snapshot().active,st=status.snapshot().effects,deadline=controller.state().scheduler.deadline;
    const boundaries=[end,clock+100,g.next,a?.next,deadline,...st.flatMap(e=>[e.next,e.expires])].filter(x=>Number.isSafeInteger(x)&&x>clock);
    const next=Math.min(...boundaries),dt=next-clock;
    const c=controller.advance(dt);if(!c.ok)throw Error('controller fault');
    const p=poise.advance(dt);if(p.kind!=='advanced')throw Error('poise fault');
    const s=status.advance(dt,{epoch:worldEpoch});if(!s.ok)throw Error('status fault');
    clock=next;
    const drain=guard.synchronize();if(!drain.ok&&drain.reason!=='guard-broken')throw Error('guard drain fault');
    delivered.push(...c.events);
    if(drain.reason==='guard-broken'){delivered.push(Object.freeze({type:'guard-broken',at:clock}));ability.cancel();}
    // Status outcomes take precedence over a due ability pulse. A confirmed host interruption cancels it before authorization.
    if(!publish(s.events,delivered)){if(!closed){retire();}return out(false,'retired',delivered);}
    const b=ability.advance(dt);
    if(!clocks()||b.reason==='authority-uncertain'||b.snapshot.closed)throw Error('ability fault');
    if(!publish(b.events,delivered))return out(false,closed?'retired':'paused',delivered);
    gate=context();if(gate)return out(false,gate,delivered);
   }
   return out(true,'advanced',delivered);
  }catch{retire();return out(false,'authority-uncertain',delivered);}finally{busy=false;}
 }
 function command(fn){if(closed||busy)return out(false,'unavailable');busy=true;try{const g=context();if(g)return out(false,g);if(!clocks())throw Error('clock divergence');return fn();}catch{retire();return out(false,'authority-uncertain');}finally{busy=false;}}
 return Object.freeze({advance,snapshot,request:kind=>command(()=>{const v=controller.request(kind);const g=guard.synchronize();if(!g.ok&&g.reason!=='guard-broken')throw Error('guard fault');return out(v.ok,v.reason,v.events);}),releaseBlock:id=>command(()=>{const v=controller.releaseBlock(id);guard.synchronize();return out(v.ok,v.reason,v.events);}),applyStatus:proposal=>command(()=>{const v=status.apply(proposal);return out(v.ok,v.reason,v.events);}),impact:proposal=>command(()=>{const v=poise.impact(proposal);return out(v.kind!=='invalid',v.kind,v.kind==='stagger-proposal'?[Object.freeze({type:'stagger-proposal',at:clock,durationMs:v.durationMs})]:[]);}),startAbility:intent=>command(()=>{const b=ability.start(intent),events=[];if(!publish(b.events,events))return out(false,'interrupted',events);if(b.snapshot.closed)throw Error('ability fault');return out(b.ok,b.reason,events);}),releaseAbility:()=>command(()=>{const b=ability.release(),events=[];if(!publish(b.events,events))return out(false,'interrupted',events);return out(b.ok,b.reason,events);}),close:()=>{retire();return snapshot();}});
}
