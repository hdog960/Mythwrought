// Two-frame bounded research queue. Poll nonblocking; never consume GL errors.
// Fences are FIFO: completion of a later fence implies all prior work complete.
export class GpuFrameAdmission {
 constructor(gl){
  this.gl=gl;this.fences=[];this.submitted=0;this.skipped=0;this.faults=0;
  this.enabled=['fenceSync','clientWaitSync','deleteSync','flush','isContextLost'].every(k=>typeof gl?.[k]==='function');
 }
 reset(){
  const old=this.fences;this.fences=[];
  if(!this.gl.isContextLost())for(const fence of old)this.gl.deleteSync(fence);
 }
 disable(){this.reset();this.enabled=false;this.faults++;}
 ready(){
  if(!this.enabled)return true;
  const gl=this.gl;
  if(gl.isContextLost()){this.fences=[];return false;}
  while(this.fences.length){
   let state;
   try{state=gl.clientWaitSync(this.fences[0],0,0);}catch(_){this.disable();return true;}
   if(state===gl.TIMEOUT_EXPIRED)break;
   if(state!==gl.ALREADY_SIGNALED&&state!==gl.CONDITION_SATISFIED){this.disable();return true;}
   gl.deleteSync(this.fences.shift());
  }
  if(this.fences.length>=2){this.skipped++;return false;}
  return true;
 }
 submittedFrame(){
  this.submitted++;
  if(!this.enabled||this.gl.isContextLost())return;
  if(this.fences.length>=2)throw Error('GPU frame queue capacity exceeded');
  try{
   const fence=this.gl.fenceSync(this.gl.SYNC_GPU_COMMANDS_COMPLETE,0);
   if(!fence){this.disable();return;}
   this.fences.push(fence);this.gl.flush();
  }catch(_){this.disable();}
 }
 run(now,draw){
  if(!this.ready())return false;
  draw(now);this.submittedFrame();return true;
 }
 stats(){return {enabled:this.enabled,submitted:this.submitted,skipped:this.skipped,faults:this.faults,pending:this.fences.length};}
}
