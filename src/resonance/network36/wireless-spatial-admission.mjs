// Pure N2 adapter: authenticated topology + bounded spatial pairs; no world writes.
import { deriveChannelGraph } from './channel-graph.mjs';
import { enumerateWirelessCandidates } from './wireless-spatial.mjs';
export const SPATIAL_ADMISSION_CONTRACT = 'resonance-network36-spatial-admission-v1';
const order=(a,b)=>a.id<b.id?-1:a.id>b.id?1:0;
export function deriveSpatialWirelessAdmission({channels=[],transmitters=[],endpoints=[],maxNodes=4096,maxComparisons=65536,maxRadius=16}={}) {
  if (![channels,transmitters,endpoints].every(Array.isArray) || !Number.isSafeInteger(maxNodes) || maxNodes<1 || maxNodes>4096 ||
      channels.length+transmitters.length+endpoints.length>maxNodes) throw Error('invalid spatial admission envelope');
  const ids=new Set();
  for(const item of [...channels,...transmitters,...endpoints]){
    if(typeof item?.id!=='string'||!item.id||ids.has(item.id)) throw Error('duplicate or invalid descriptor identity');
    ids.add(item.id);
  }
  // Both primitives independently validate loaded state, coordinates, bounds and radius.
  const topology=deriveChannelGraph({channels,endpoints:[...transmitters,...endpoints],maxNodes});
  const membership=new Map(topology.endpoints.map(e=>[e.id,e]));
  const active=transmitters.filter(t=>membership.get(t.id)?.status==='connected');
  const spatial=enumerateWirelessCandidates({transmitters:active,endpoints,maxNodes,maxComparisons,maxRadius});
  const candidates=new Map(endpoints.map(e=>[e.id,new Set()]));
  for(const e of endpoints){
    const wired=membership.get(e.id);
    if(wired?.network) candidates.get(e.id).add(wired.network);
  }
  for(const pair of spatial.pairs){
    const transmitter=membership.get(pair.transmitterId);
    if(!candidates.has(pair.endpointId)||transmitter?.status!=='connected'||!transmitter.network) throw Error('invalid spatial pair');
    candidates.get(pair.endpointId).add(transmitter.network);
  }
  const linked=endpoints.map(e=>{
    const wired=membership.get(e.id);
    const networks=[...candidates.get(e.id)].sort();
    const status=wired?.status==='ambiguous'||networks.length>1?'ambiguous':networks.length===1?'connected':'disconnected';
    return {id:e.id,network:status==='connected'?networks[0]:null,status,medium:status!=='connected'?null:wired.network?'channel':'wireless'};
  }).sort(order);
  return {contract:SPATIAL_ADMISSION_CONTRACT,networks:topology.networks,transmitters:active.map(t=>({id:t.id,network:membership.get(t.id).network,radius:t.radius})).sort(order),endpoints:linked,comparisons:spatial.comparisons};
}
