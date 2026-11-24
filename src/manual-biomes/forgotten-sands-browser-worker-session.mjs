// Isolated module-worker lifecycle adapter. Failure is terminal: no hidden
// retries, no orphaned CPU results, no continued uploads after context loss.
import {createP0WorkerQueue} from './forgotten-sands-worker-queue.mjs';
export function createP0BrowserWorkerSession({worker,canvas,upload,retire,timeoutMs=15000,now=()=>performance.now(),onFault=()=>{}}){
  if(!worker||!canvas||!Number.isFinite(timeoutMs)||timeoutMs<=0)throw Error('Invalid worker session');
  let stopped=false,reason=null,deadline=null,startupAt=now(),ready=false;
  let queue;
  const stop=why=>{
    if(stopped)return false;stopped=true;reason=String(why);deadline=null;
    worker.removeEventListener('message',message);worker.removeEventListener('error',error);worker.removeEventListener('messageerror',error);
    canvas.removeEventListener('webglcontextlost',lost);
    try{worker.terminate();}finally{queue.close();}
    if(why!=='closed')onFault(reason);return true;
  };
  const message=e=>{
    if(stopped)return;
    try{
      if(e.data?.type==='ready'){ready=true;return;}
      const before=queue.snapshot();
      const accepted=queue.receive(e.data);
      const after=queue.snapshot();
      // A stale but matching reply may dispatch the next request inside receive;
      // do not clear its newly armed deadline.
      if(accepted||(!after.inFlight&&before.inFlight))deadline=null;
    }catch(e){stop('worker-result: '+String(e));}
  };
  const error=e=>{e.preventDefault?.();stop('worker-error: '+String(e.message??e.type));};
  const lost=e=>{e.preventDefault();stop('webgl-context-lost');};
  queue=createP0WorkerQueue({send:m=>{deadline=now()+timeoutMs;worker.postMessage(m);},upload,retire});
  worker.addEventListener('message',message);worker.addEventListener('error',error);worker.addEventListener('messageerror',error);
  canvas.addEventListener('webglcontextlost',lost);
  return Object.freeze({
    replace(keys){if(stopped||!ready)return false;try{queue.replace(keys);return true;}catch(e){stop('replace: '+String(e));return false;}},
    tick(){
      if(stopped)return false;
      if(!ready&&now()-startupAt>timeoutMs){stop('worker-startup-timeout');return false;}
      if(deadline!==null&&now()>deadline){stop('worker-mesh-timeout');return false;}
      if(!ready)return false;
      try{return queue.tick();}catch(e){stop('upload: '+String(e));return false;}
    },
    snapshot(){return {...queue.snapshot(),stopped,reason,workerReady:ready};},
    close(){stop('closed');}
  });
}
