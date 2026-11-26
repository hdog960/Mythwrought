// Experimental single outstanding frame admission. Never wait synchronously,
 // never consume GL errors, never change geometry, ownership or save bytes.
export class GpuFrameAdmission {
  constructor(gl){
    this.gl=gl;this.fence=null;this.submitted=0;this.skipped=0;this.faults=0;
    this.enabled=['fenceSync','clientWaitSync','deleteSync','flush','isContextLost'].every(k=>typeof gl?.[k]==='function');
  }
  reset(){
    const old=this.fence;this.fence=null;
    if(old&&!this.gl.isContextLost())this.gl.deleteSync(old);
  }
  disable(){this.reset();this.enabled=false;this.faults++;}
  ready(){
    if(!this.enabled)return true;
    const gl=this.gl;
    if(gl.isContextLost()){this.fence=null;return false;}
    if(!this.fence)return true;
    let state;
    try{state=gl.clientWaitSync(this.fence,0,0);}catch(_){this.disable();return true;}
    if(state===gl.TIMEOUT_EXPIRED){this.skipped++;return false;}
    if(state!==gl.ALREADY_SIGNALED&&state!==gl.CONDITION_SATISFIED){this.disable();return true;}
    this.reset();return true;
  }
  submittedFrame(){
    this.submitted++;
    if(!this.enabled||this.gl.isContextLost())return;
    if(this.fence)throw Error('Previous frame fence still owned');
    try{
      this.fence=this.gl.fenceSync(this.gl.SYNC_GPU_COMMANDS_COMPLETE,0);
      if(!this.fence){this.disable();return;}
      this.gl.flush();
    }catch(_){this.disable();}
  }
  run(now,draw){
    if(!this.ready())return false;
    draw(now);
    this.submittedFrame();return true;
  }
  stats(){return {enabled:this.enabled,submitted:this.submitted,skipped:this.skipped,faults:this.faults,pending:Number(!!this.fence)};}
}
