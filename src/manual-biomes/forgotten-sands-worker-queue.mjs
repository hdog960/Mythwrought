// Isolated worker handoff experiment; not installed in game startup.
// One outstanding request OR one completed CPU mesh; one upload per tick.
// An epoch change retires unwanted GPU buffers before admitting new ones.
import {validateChunkUploadBytes} from '../gpu-recovery.mjs';
const keyOf=k=>[k.cx,k.cz,k.s].join(',');
export function createP0WorkerQueue({send,upload,retire}){
  if([send,upload,retire].some(f=>typeof f!=='function'))throw Error('Missing worker queue adapter');
  let epoch=0,serial=0,desired=new Map(),resident=new Map(),flight=null,ready=null,closed=false;
  let discarded=0,peakResident=0,uploads=0,requests=0;
  function check(){if(closed)throw Error('Queue closed');}
  function dispatch(){
    if(flight||ready||closed)return;
    for(const k of desired.values()){
      if(resident.has(k.key))continue;
      flight=Object.freeze({type:'mesh',epoch,id:++serial,cx:k.cx,cz:k.cz,s:k.s,key:k.key});requests++;
      send(flight);break;
    }
  }
  return Object.freeze({
    replace(keys){
      check();
      if(!Array.isArray(keys)||keys.length>34)throw Error('Invalid resident window');
      const next=new Map();
      for(const k of keys){
        if(![k.cx,k.cz,k.s].every(Number.isSafeInteger)||k.s< -13||k.s>8||k.key!==keyOf(k)||next.has(k.key))throw Error('Invalid mesh key');
        next.set(k.key,Object.freeze({...k}));
      }
      epoch++;desired=next;
      for(const [key,value] of resident)if(!next.has(key)){retire(value.handle);resident.delete(key);}
      if(ready){ready=null;discarded++;}
      // Do not start a second worker task while an old request is running.
      dispatch();return epoch;
    },
    receive(msg){
      check();
      if(!flight||msg?.type!=='mesh-result'||msg.id!==flight.id||msg.epoch!==flight.epoch||msg.key!==flight.key)return false;
      const f=flight;flight=null;
      if(f.epoch!==epoch||!desired.has(f.key)){discarded++;dispatch();return false;}
      if(msg.error)throw Error('Worker mesh failed: '+msg.error);
      if(!(msg.vertices instanceof Float32Array))throw Error('Invalid mesh transfer');
      validateChunkUploadBytes(msg.vertices);
      ready={key:f.key,vertices:msg.vertices,meshMs:msg.meshMs};return true;
    },
    tick(){
      check();if(!ready){dispatch();return false;}
      const r=ready;ready=null;
      if(!desired.has(r.key)||resident.has(r.key))throw Error('Stale upload invariant');
      const handle=upload(r.vertices);resident.set(r.key,{handle,bytes:r.vertices.byteLength});
      uploads++;peakResident=Math.max(peakResident,resident.size);
      if(resident.size>desired.size||resident.size>34)throw Error('Resident overflow');
      dispatch();return true;
    },
    snapshot(){return Object.freeze({epoch,desired:desired.size,resident:resident.size,inFlight:flight?1:0,ready:ready?1:0,discarded,requests,uploads,peakResident,
      vertexBytes:[...resident.values()].reduce((n,r)=>n+r.bytes,0)});},
    close(){
      if(closed)return;closed=true;for(const r of resident.values())retire(r.handle);
      resident.clear();desired.clear();ready=null;flight=null;
    }
  });
}
