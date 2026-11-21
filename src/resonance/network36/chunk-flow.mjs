// Opt-in N1/N2 flow adapter. All topology is explicit; never mutates world or saves.
import {visibleResonanceSnapshot} from './chunk-lifecycle.mjs';
import {allocateChannelCapacity} from './shared-capacity.mjs';
export const CHUNK_FLOW_CONTRACT='resonance-network36-chunk-flow-v1';
export function allocateVisibleChannelCapacity(snapshot, loadedChunks, edges=[], options={}) {
  const visible=visibleResonanceSnapshot(snapshot,loadedChunks,options);
  if (!Array.isArray(edges)||edges.length>2048) throw Error('edge budget');
  const conductorIds=new Set(visible.nodes.map(n=>n.id));
  if(conductorIds.size!==visible.nodes.length)throw Error('duplicate conductors');
  const activeEdges=[];
  for(const edge of edges){
    if(!edge||typeof edge.from!=='string'||typeof edge.to!=='string'||
       typeof edge.id!=='string'||!edge.id||!Number.isSafeInteger(edge.capacity)||edge.capacity<0)
      throw Error('invalid channel edge');
    if(conductorIds.has(edge.from)&&conductorIds.has(edge.to))activeEdges.push({...edge});
  }
  const attached=(entities,field)=>entities.map(entity=>{
    if(typeof entity.at!=='string'||!conductorIds.has(entity.at))
      return null;
    return {id:entity.id,at:entity.at,[field]:entity[field],...(field==='demand'?{priority:entity.priority}: {})};
  }).filter(Boolean);
  const generators=attached(visible.generators,'output');
  const devices=attached(visible.devices,'demand');
  const result=allocateChannelCapacity({edges:activeEdges,generators,devices});
  const states={...result.deviceStates};
  for(const device of snapshot.devices){
    if(!Object.hasOwn(states,device.id))states[device.id]='disconnected';
  }
  return {contract:CHUNK_FLOW_CONTRACT,deviceStates:states,delivered:result.delivered,
    used:result.used,activeEdges:activeEdges.length,excluded:[...visible.excluded],
    // Storage is intentionally not charged/discharged by this throughput-only adapter.
    nextCharges:Object.fromEntries(snapshot.stores.map(store=>[store.id,store.charge]))};
}
