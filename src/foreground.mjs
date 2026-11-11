// Gate A v0.10: bounded foreground rendering and measured chunk-mesh cadence.
// No gameplay timers or save data are owned by these helpers.
export class ForegroundFrameDriver {
  constructor(request,cancel,onFrame){
    if(typeof request!=='function'||typeof cancel!=='function'||typeof onFrame!=='function')
      throw Error('Frame driver requires request, cancel and draw callbacks');
    this.request=request;this.cancel=cancel;this.onFrame=onFrame;
    this.running=false;this.ticket=null;this.epoch=0;
    this.wakeCount=0;this.pauseCount=0;
  }
  resume(){
    if(this.running)return false;
    this.running=true;this.epoch++;this.wakeCount++;
    this.arm();return true;
  }
  pause(){
    if(!this.running)return false;
    this.running=false;this.epoch++;this.pauseCount++;
    if(this.ticket!==null){this.cancel(this.ticket);this.ticket=null;}
    return true;
  }
  arm(){
    if(!this.running||this.ticket!==null)return;
    const epoch=this.epoch;
    this.ticket=this.request(now=>{
      if(!this.running||this.epoch!==epoch)return;
      this.ticket=null;
      // If onFrame throws, do not schedule an unbounded broken loop.
      this.onFrame(now);
      this.arm();
    });
  }
  snapshot(){return {running:this.running,wakeCount:this.wakeCount,pauseCount:this.pauseCount};}
}
// Exactly one candidate per eligible frame. Heavy mesh uploads are spaced
// across a handful of *rendered* frames, never background timers.
export class MeshFrameCadence {
  constructor({budgetMs=10,maxCooldown=2}={}){
    if(!Number.isFinite(budgetMs)||budgetMs<=0||
      !Number.isInteger(maxCooldown)||maxCooldown<0||maxCooldown>8)
      throw Error('Invalid mesh frame budget');
    this.budgetMs=budgetMs;this.maxCooldown=maxCooldown;
    this.cooldown=0;this.meshes=0;this.skipped=0;this.slowestMs=0;
    this.lastMs=null;
  }
  ready(){
    if(this.cooldown>0){this.cooldown--;this.skipped++;return false;}
    return true;
  }
  finished(durationMs){
    if(!Number.isFinite(durationMs)||durationMs<0)throw Error('Invalid mesh duration');
    this.meshes++;this.lastMs=Math.round(durationMs*10)/10;
    this.slowestMs=Math.max(this.slowestMs,this.lastMs);
    // A chunk taking 10-20ms costs one recovery frame; 20+ two frames.
    // Skips are bounded and never stop nearby chunks from eventually loading.
    this.cooldown=Math.min(this.maxCooldown,Math.floor(durationMs/this.budgetMs));
  }
  resetCooldown(){this.cooldown=0;}
  stats(){return {meshes:this.meshes,skipped:this.skipped,slowestMs:this.slowestMs,
    lastMs:this.lastMs,cooldown:this.cooldown,budgetMs:this.budgetMs};}
}
