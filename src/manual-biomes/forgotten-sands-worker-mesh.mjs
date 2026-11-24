// Portable actual-source research worker. No mutable world exposed.
import {prepareP0SecondSite,p0BenchmarkMesh} from './forgotten-sands-second-site.mjs';
let prepared=null;
export function p0WorkerMeshMessage(message,post){
  if(message?.type!=='mesh'||![message.id,message.epoch,message.cx,message.cz,message.s].every(Number.isSafeInteger)||
     message.s< -13||message.s>8||message.key!==[message.cx,message.cz,message.s].join(','))throw Error('Invalid worker request');
  try{
    prepared??=prepareP0SecondSite();
    const t=performance.now(),vertices=p0BenchmarkMesh(prepared.selected.view,message.cx,message.cz,message.s);
    post({type:'mesh-result',id:message.id,epoch:message.epoch,key:message.key,vertices,meshMs:performance.now()-t},[vertices.buffer]);
  }catch(e){post({type:'mesh-result',id:message.id,epoch:message.epoch,key:message.key,error:String(e)},[]);}
}
