// G2A detached input ownership; no DOM listeners or edits to Explore controls.
const fail=s=>{throw new TypeError('G2 controls: '+s);};
const AXES=Object.freeze({x:0,y:0});
const empty=()=>Object.freeze({move:AXES,look:AXES,pointers:Object.freeze([]),
  keys:Object.freeze([]),up:false,down:false,land:false});
const clamp=n=>Math.max(-1,Math.min(1,n));
const validId=id=>Number.isSafeInteger(id)&&id>=0;
const frozenState=(s,fields)=>Object.freeze({...s,...fields});
export function createG2ControlState(){
  return Object.freeze({owner:'explore',paused:true,controls:empty(),reason:'Flight controls off'});
}
export function enterG2ControlOwnership(state,{flightReady=false,featureEnabled=false}={}){
  if(!state||state.owner!=='explore')fail('explore owner required');
  if(!flightReady||!featureEnabled)return frozenState(state,{reason:'Flight not verified or disabled'});
  return frozenState(state,{owner:'creative-flight',paused:false,controls:empty(),reason:'Flight controls ready'});
}
export function clearG2Controls(state,reason='Input cancelled'){
  if(!state)fail('state required');
  return frozenState(state,{paused:true,controls:empty(),reason});
}
export function resumeG2Controls(state,{flightStillSafe=false}={}){
  if(!state||state.owner!=='creative-flight'||!flightStillSafe)return state;
  return frozenState(state,{paused:false,controls:empty(),reason:'Flight controls resumed'});
}
export function releaseG2ControlOwnership(state,{landed=false}={}){
  if(!state)fail('state required');
  if(state.owner==='explore')return state;
  // Cannot hand gravity and ordinary controls back while still airborne.
  if(!landed)return clearG2Controls(state,'No verified landing; remain hovering');
  return createG2ControlState();
}
function build(base,{move=base.move,look=base.look,pointers=base.pointers,keys=base.keys,
 up=base.up,down=base.down,land=base.land}={}){
  return Object.freeze({move:Object.freeze({...move}),look:Object.freeze({...look}),
    pointers:Object.freeze(pointers.map(p=>Object.freeze({...p}))),keys:Object.freeze([...keys]),up,down,land});
}
export function dispatchG2Control(state,event){
  if(!state||!event||typeof event.type!=='string')fail('event required');
  if(['blur','hidden','orientationchange','pointercancelall','contextlost','overlay-open','worldchange'].includes(event.type))
    return clearG2Controls(state,'Interrupted: '+event.type);
  if(state.owner!=='creative-flight'||state.paused)return state;
  const c=state.controls;
  if(event.type==='key'){
    if(!['KeyW','KeyA','KeyS','KeyD','KeyE','KeyQ','Space'].includes(event.code)||
       typeof event.pressed!=='boolean')return state;
    const keys=new Set(c.keys);event.pressed?keys.add(event.code):keys.delete(event.code);
    return frozenState(state,{controls:build(c,{keys:[...keys].sort()})});
  }
  if(event.type==='pointerdown'){
    if(!validId(event.id)||!['move','look','up','down','land'].includes(event.zone)||
       c.pointers.some(p=>p.id===event.id||p.zone===event.zone))return state;
    const pointers=[...c.pointers,{id:event.id,zone:event.zone}];
    return frozenState(state,{controls:build(c,{pointers,
      up:c.up||event.zone==='up',down:c.down||event.zone==='down',
      land:c.land||event.zone==='land'})});
  }
  if(event.type==='pointermove'){
    const owner=c.pointers.find(p=>p.id===event.id);
    if(!owner||!['move','look'].includes(owner.zone))return state;
    if(!Number.isFinite(event.x)||!Number.isFinite(event.y))fail('invalid stick axis');
    const val={x:clamp(event.x),y:clamp(event.y)};
    return frozenState(state,{controls:build(c,{[owner.zone]:val})});
  }
  if(event.type==='pointerup'||event.type==='pointercancel'){
    const p=c.pointers.find(x=>x.id===event.id);
    if(!p)return state;
    const pointers=c.pointers.filter(x=>x.id!==event.id);
    return frozenState(state,{controls:build(c,{pointers,
      move:p.zone==='move'?AXES:c.move,look:p.zone==='look'?AXES:c.look,
      up:p.zone==='up'?false:c.up,down:p.zone==='down'?false:c.down,
      land:p.zone==='land'?false:c.land})});
  }
  return state;
}
export function readG2ControlIntent(state){
  if(!state||state.owner!=='creative-flight'||state.paused)
    return Object.freeze({strafe:0,forward:0,vertical:0,lookX:0,lookY:0,landRequested:false});
  const c=state.controls,k=new Set(c.keys);
  return Object.freeze({strafe:clamp(c.move.x+Number(k.has('KeyD'))-Number(k.has('KeyA'))),
    forward:clamp(-c.move.y+Number(k.has('KeyW'))-Number(k.has('KeyS'))),
    vertical:clamp(Number(c.up||k.has('KeyE'))-Number(c.down||k.has('KeyQ'))),
    lookX:c.look.x,lookY:c.look.y,landRequested:c.land||k.has('Space')});
}
