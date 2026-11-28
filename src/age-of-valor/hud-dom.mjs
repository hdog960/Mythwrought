// Isolated DOM owner; no shared runtime mounting.
export function mountCombatHud({root,input,readPresentation,emit,readZoneOptions,now,layout,hostWindow,hostDocument,readLayout}){
 if(!root||!root.ownerDocument||!input||![readPresentation,emit,readZoneOptions,now].every(f=>typeof f==='function')||!layout||!Array.isArray(layout.controls))throw Error('invalid HUD mount');
 const doc=root.ownerDocument,wrap=doc.createElement('section'),rail=doc.createElement('div'),hud=doc.createElement('div'),mode=doc.createElement('button'),target=doc.createElement('div'),effects=doc.createElement('div'),cooldowns=doc.createElement('div'),bars=new Map(),buttons=new Map(),captures=new Map(),listeners=[];
 let disposed=false,keyboardId=1000000000;
 wrap.className='av-shell';wrap.setAttribute('aria-label','Combat interface');rail.className='av-rail';hud.className='av-hud';mode.type='button';mode.className='av-mode';mode.textContent='Combat mode';wrap.append(mode,rail,hud);hud.append(target,effects,cooldowns);
 const listen=(node,type,fn)=>{node.addEventListener(type,fn);listeners.push(()=>node.removeEventListener(type,fn));};
 const time=()=>Math.max(input.snapshot().clock,Math.floor(now()));
 function releaseCaptures(){for(const [id,p] of captures){captures.delete(id);try{if(p.button.hasPointerCapture?.(id))p.button.releasePointerCapture(id);}catch{}}}
 function deliver(result){for(const v of result.intents)emit(v);if(result.intents.some(v=>v.kind==='cancel-combat-input'))releaseCaptures();return result;}
 function dispatch(event){if(disposed)return null;return deliver(input.dispatch({...event,at:time()}));}
 function cancel(reason){dispatch({type:reason});releaseCaptures();render();}
 function down(button,zone,id,kind){
  if(captures.has(id))return false;
  const result=dispatch({type:'pointerdown',id,zone,existingOwner:false,...readZoneOptions(zone)});
  const p=result?.snapshot.pointers.find(p=>p.id===id);if(!result?.handled||!p)return false;
  captures.set(id,{button,token:p.captureToken,kind});
  if(kind==='pointer'){try{button.setPointerCapture(id);}catch{end(id,'pointercancel');return false;}}
  return true;
 }
 function end(id,type){const p=captures.get(id);if(!p)return false;captures.delete(id);dispatch({type,id,captureToken:p.token});try{if(p.kind==='pointer'&&p.button.hasPointerCapture?.(id))p.button.releasePointerCapture(id);}catch{}return true;}
 listen(mode,'click',()=>dispatch({type:'mode',mode:input.snapshot().mode==='combat'?'exploration':'combat'}));
 for(const c of layout.controls){
  const button=doc.createElement('button');button.type='button';button.className='av-action av-'+c.zone;button.textContent=c.zone.toUpperCase();button.setAttribute('aria-label',c.ariaLabel);
  button.style.width=c.width+'px';button.style.height=c.height+'px';rail.append(button);buttons.set(c.zone,button);
  listen(button,'pointerdown',e=>{if(e.button!==0)return;if(down(button,c.zone,e.pointerId,'pointer'))e.preventDefault();});
  for(const t of ['pointerup','pointercancel','lostpointercapture'])listen(button,t,e=>{const p=captures.get(e.pointerId);if(p?.button===button&&!(t==='lostpointercapture'&&button.hasPointerCapture?.(e.pointerId))&&end(e.pointerId,t))e.preventDefault();});
  let key=null;listen(button,'keydown',e=>{if(![' ','Enter'].includes(e.key)||e.repeat||key!==null)return;e.preventDefault();const id=++keyboardId;if(down(button,c.zone,id,'keyboard'))key=id;});
  listen(button,'keyup',e=>{if(![' ','Enter'].includes(e.key)||key===null)return;e.preventDefault();end(key,'pointerup');key=null;});
  listen(button,'blur',()=>{if(key!==null){end(key,'pointercancel');key=null;}});
  // Assistive technology activation without pointer/key events.
  listen(button,'click',e=>{if(e.detail!==0||['touch','mouse','pen'].includes(e.pointerType)||e.sourceCapabilities?.firesTouchEvents===true||key!==null)return;const id=++keyboardId;if(down(button,c.zone,id,'assistive'))end(id,'pointerup');});
 }
 for(const id of ['health','stamina','mana']){
  const group=doc.createElement('div'),label=doc.createElement('span'),bar=doc.createElement('progress');group.className='av-bar av-'+id;bar.setAttribute('aria-label',id);bar.max=100;group.append(label,bar);hud.append(group);bars.set(id,{label,bar});
 }
 function applyLayout(next){if(!next||!['left','right'].includes(next.side)||!Array.isArray(next.controls)||next.controls.length!==buttons.size||!Number.isFinite(next.buttonSize)||next.buttonSize<44||next.buttonSize>55||new Set(next.controls.map(c=>c.zone)).size!==buttons.size||next.controls.some(c=>!buttons.has(c.zone)||c.width!==next.buttonSize||c.height!==next.buttonSize))throw Error('invalid rail layout');for(const c of next.controls){const b=buttons.get(c.zone);b.style.width=c.width+'px';b.style.height=c.height+'px';}rail.style.gridTemplateColumns=`repeat(2, ${next.buttonSize}px)`;wrap.dataset.side=next.side;}
 applyLayout(layout);
 function resize(){cancel('orientationchange');try{if(typeof readLayout==='function')applyLayout(readLayout());wrap.hidden=false;}catch{wrap.hidden=true;}}
 if(hostWindow&&typeof readLayout==='function')listen(hostWindow,'resize',resize);
 if(hostWindow)for(const t of ['blur','pagehide','orientationchange'])listen(hostWindow,t,()=>cancel(t));
 if(hostDocument)listen(hostDocument,'visibilitychange',()=>{if(hostDocument.hidden)cancel('hidden');});
 root.append(wrap);
 function render(){
  if(disposed)return false;const s=input.snapshot(),p=readPresentation();if(!p||!Array.isArray(p.bars))throw Error('invalid presentation');
  rail.hidden=s.mode!=='combat'||s.pending!==null||s.retired;mode.disabled=s.retired||s.pending!==null;mode.textContent=s.pending?'Switching…':s.mode==='combat'?'Exploration mode':'Combat mode';mode.setAttribute('aria-pressed',String(s.mode==='combat'));
  for(const b of p.bars){const n=bars.get(b.id);if(n){n.label.textContent=b.accessibleText;n.bar.value=b.percent;}}
  target.textContent=p.target?`${p.target.boss?'Boss · ':''}${p.target.id}${p.target.health?' · '+p.target.health.current+'/'+p.target.health.max:''}`:'No target';
  effects.textContent=p.effects.map(e=>`${e.id} ×${e.stacks} · ${Math.ceil(e.remainingMs/1000)}s`).join(' · ');
  cooldowns.textContent=p.cooldowns.filter(e=>e.remainingMs>0).map(e=>`${e.id} · ${Math.ceil(e.remainingMs/1000)}s`).join(' · ');
  return true;
 }
 function dispose(){if(disposed)return;cancel('pointercancelall');disposed=true;listeners.splice(0).forEach(fn=>fn());wrap.remove();}
 return Object.freeze({render,acknowledgeMode:(mode,generation)=>dispatch({type:'mode-ack',mode,generation}),cancel,resize,dispose});
}
