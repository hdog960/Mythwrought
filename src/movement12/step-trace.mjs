// Source-only diagnostic adapter; host injects genuine stepPlayer.
// Never registers controls, changes saves, or modifies production physics.
const pos=p=>({x:p.x,y:p.feet,z:p.z});
const validPos=p=>p&&['x','z','feet'].every(k=>Number.isFinite(p[k]));
export function captureStepTrace({world,player,inputs,dt=1/60,step,maxFrames=240}={}){
  if(!world||typeof world.get!=='function'||!validPos(player)||typeof step!=='function'||
     !Array.isArray(inputs)||inputs.length===0||!Number.isInteger(maxFrames)||maxFrames<1||maxFrames>1024||inputs.length>maxFrames||
     !Number.isFinite(dt)||dt<=0||dt>.05)throw Error('Invalid step trace contract');
  const p={...player};
  const frames=[{time:0,start:pos(p),end:pos(p),event:null}];
  for(let i=0;i<inputs.length;i++){
    const input=inputs[i];
    if(!input||typeof input!=='object'||Array.isArray(input)||
       !['forward','strafe'].every(k=>input[k]===undefined||Number.isFinite(input[k]))||
       (input.jump!==undefined&&typeof input.jump!=='boolean'))throw Error('Invalid trace input at '+i);
    const start=pos(p);
    const event=step(world,p,{forward:input.forward??0,strafe:input.strafe??0,jump:input.jump??false},dt);
    if(!validPos(p)||!event||typeof event!=='object'||Array.isArray(event))throw Error('Invalid physics result at '+i);
    frames.push({time:(i+1)*dt,start,end:pos(p),event:{...event}});
  }
  return {frames,finalPlayer:{...p},source:'injected-stepPlayer',integrated:false};
}
