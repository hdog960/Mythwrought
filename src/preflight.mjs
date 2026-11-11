// Gate A evidence collection for an individual browser session. This is observational:
// it never edits the player world, alters save keys or claims iPhone certification.
export class FrameHistory {
  constructor(capacity=360){
    if(!Number.isInteger(capacity)||capacity<1||capacity>3600)throw Error('Invalid frame history capacity');
    this.samples=new Float64Array(capacity);this.index=0;this.count=0;this.previous=null;
  }
  frame(now,active){
    if(!active||!Number.isFinite(now)){this.previous=null;return;}
    if(this.previous!==null){
      const gap=now-this.previous;
      if(gap>0&&gap<=1000){
        this.samples[this.index]=gap;this.index=(this.index+1)%this.samples.length;
        this.count=Math.min(this.count+1,this.samples.length);
      }
    }
    this.previous=now;
  }
  stats(){
    if(!this.count)return {frames:0,p50Ms:null,p95Ms:null,worstMs:null,approxFps:null,slowFrames:0};
    const times=Array.from(this.samples.slice(0,this.count)).sort((a,b)=>a-b);
    const percentile=p=>Math.round(times[Math.min(times.length-1,Math.ceil(p*times.length)-1)]*10)/10;
    const total=times.reduce((n,t)=>n+t,0);
    return {frames:times.length,p50Ms:percentile(.5),p95Ms:percentile(.95),
      worstMs:percentile(1),approxFps:Math.round(1000*times.length/total),
      slowFrames:times.filter(t=>t>33.4).length};
  }
}
export function gripClearance(left,right,view){
  const horizontalGapL=Math.round((view.left-left.right)*10)/10;
  const horizontalGapR=Math.round((right.left-view.right)*10)/10;
  const viewportWidth=Math.round(view.width),viewportHeight=Math.round(view.height);
  return {horizontalGapL,horizontalGapR,viewportWidth,viewportHeight,
    unobstructed:horizontalGapL>=-2&&horizontalGapR>=-2&&viewportWidth>=200&&viewportHeight>=100};
}
// This uses a fresh, unrelated temporary key; even a failed probe must never
// write to, migrate, repair or delete a saved world or its journal/backup.
export function probeTemporaryStorage(storage,key){
  if(!/^mythwrought-v010-probe-[a-z0-9-]{8,}$/.test(key))throw Error('Unsafe storage probe key');
  let written=false,clean=false;
  try{
    if(storage.getItem(key)!==null)throw Error('Temporary probe key collision');
    storage.setItem(key,'device-check');written=true;
    if(storage.getItem(key)!=='device-check')throw Error('Temporary write readback mismatch');
    storage.removeItem(key);clean=true;
    if(storage.getItem(key)!==null)throw Error('Temporary key not removed');
    return {ok:true,detail:'Temporary key round-trip succeeded and was removed'};
  }catch(error){return {ok:false,detail:String(error)};}
  finally{if(written&&!clean){try{storage.removeItem(key);}catch(_){/* reported by probe; no world keys touched */}}}
}
export function formatPreflightReport(data){
  const {stamp,agent,dimensions,grips,frames,render,save,probe,quota,homeScreen}=data;
  const ms=v=>v===null?'insufficient foreground samples':v+' ms';
  return [
    'MYTHWROUGHT — v0.10 Gate A diagnostic (not certification)',
    'Captured: '+stamp,
    'Browser: '+agent,
    'Display: '+dimensions+', Home Screen hint: '+homeScreen,
    'World viewport: '+grips.viewportWidth+'×'+grips.viewportHeight+' px; left/right grip clearance '+grips.horizontalGapL+'/'+grips.horizontalGapR+' px; geometry '+(grips.unobstructed?'PASS':'FAIL'),
    'Rendering: '+render,
    'Foreground play frames: '+frames.frames+'; approx '+(frames.approxFps??'n/a')+' FPS; p50 '+ms(frames.p50Ms)+'; p95 '+ms(frames.p95Ms)+'; worst '+ms(frames.worstMs)+'; >33ms frames '+frames.slowFrames,
    'Save check: '+save,
    'Temporary storage: '+(probe.ok?'PASS':'FAIL')+' — '+probe.detail,
    'Storage estimate: '+quota,
    'IMPORTANT: Approximate sample, not a hardware benchmark. No save repair or migration was performed.',
    'MANUAL iPhone Safari + installed Home Screen checks still required:',
    '[ ] Hold both thumb pads while looking/walking; check notch and comfort',
    '[ ] Build/mine then force-quit and reopen; verify edits and exports',
    '[ ] Switch away/back, rotate, use 10+ minutes; note heat, stutters, reloads',
    '[ ] Check offline behavior separately; not claimed until implemented/tested',
    '[ ] Inspect original fantasy art and personally approve or reject it'
  ].join('\n');
}
