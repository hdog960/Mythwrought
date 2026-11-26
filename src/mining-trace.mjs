// Diagnostic-only bounded foreground trace. No GPU calls, persistence or timers.
export function createMiningTrace(clock=()=>performance.now()){
  const ring=(limit)=>({items:[],cursor:0,limit});
  const frames=ring(360),edits=ring(64);
  const push=(r,v)=>{r.items[r.cursor%r.limit]=v;r.cursor++;};
  const values=r=>r.cursor<=r.limit?r.items.slice():
    r.items.slice(r.cursor%r.limit).concat(r.items.slice(0,r.cursor%r.limit));
  let active=null,lastFrame=null,seq=0,pending=[];
  const ms=(a,b)=>Math.round(Math.max(0,b-a)*100)/100;
  function measure(name,fn){
    const e=active;
    if(!e)return fn();
    const start=clock();
    try{return fn();}finally{
      const p=e.phases[name]??(e.phases[name]={count:0,totalMs:0,maxMs:0});
      const d=ms(start,clock());p.count++;p.totalMs=ms(0,p.totalMs+d);p.maxMs=Math.max(p.maxMs,d);
    }
  }
  function action(mode,context,fn){
    if(active)return fn();
    const e={id:++seq,mode,context,start:clock(),phases:{},outcome:'unclassified'};
    active=e;
    try{return fn();}catch(error){e.outcome='threw';throw error;}finally{
      e.end=clock();e.totalMs=ms(e.start,e.end);active=null;push(edits,e);
      if(pending.length===64)pending.shift();pending.push(e);
    }
  }
  function mark(outcome,details={}){
    if(active){active.outcome=outcome;Object.assign(active,details);}
  }
  function frame(now,eligible,context,fn){
    if(!eligible){lastFrame=null;pending=[];return fn();}
    const start=clock(),gap=lastFrame===null?null:ms(lastFrame,now);lastFrame=now;
    const waiting=pending;pending=[];
    try{return fn();}finally{
      const end=clock();
      for(const e of waiting){e.nextDrawStartMs=ms(e.end,start);e.nextDrawEndMs=ms(e.end,end);}
      push(frames,{gapMs:gap,drawMs:ms(start,end),editIds:waiting.map(e=>e.id),...context});
    }
  }
  return {measure,action,mark,frame,resetContinuity(){lastFrame=null;pending=[];},
    report(){return {frameCount:frames.cursor,editCount:edits.cursor,frames:values(frames),edits:values(edits)};}};
}
