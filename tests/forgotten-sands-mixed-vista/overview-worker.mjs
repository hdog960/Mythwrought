// Overview-only aggregate mesh transfer, not an installed live LOD policy.
// One original section at a time, with exact chunk geometry in a bounded
// original-source envelope. No production state or save API.
import {prepareP0MixedGroup,p0MixedAuditEnvelope,p0BenchmarkMesh} from '../../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
let group=null,index=-1;
self.onmessage=e=>{
  const msg=e.data;
  try{
    if(msg.type==='prepare'){
      index=msg.index;group=prepareP0MixedGroup(index);
      self.postMessage({type:'prepared',index,spec:group.spec,proposedCells:group.group.proposedCells});return;
    }
    if(msg.type!=='section'||msg.index!==index||!group||![0,1,2].includes(msg.section))throw Error('Invalid overview request');
    const t=performance.now(),keys=p0MixedAuditEnvelope(group.spec).coords.filter(k=>k.s===msg.section);
    const pieces=[];let length=0;
    for(const k of keys){const v=p0BenchmarkMesh(group.group.view,k.cx,k.cz,k.s);pieces.push(v);length+=v.length;}
    if(length*4>8*1024*1024)throw Error('Overview exceeds original chunk upload cap');
    const vertices=new Float32Array(length);let at=0;
    for(const v of pieces){vertices.set(v,at);at+=v.length;}
    self.postMessage({type:'section',index,section:msg.section,chunks:keys.length,vertices,meshMs:performance.now()-t},[vertices.buffer]);
  }catch(e){self.postMessage({type:'fault',error:String(e)});}
};
