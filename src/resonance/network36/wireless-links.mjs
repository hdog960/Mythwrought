// Source-only, opt-in wireless admission; no terrain, saves, or device mutations.
import { deriveChannelGraph } from './channel-graph.mjs';
export const WIRELESS_LINK_CONTRACT = 'resonance-network36-wireless-v1';
const validId = v => typeof v === 'string' && v.length > 0 && v.length <= 128;
const validCoord = v => Number.isSafeInteger(v) && Math.abs(v) <= 30000000;
const position = v => v && validCoord(v.x) && validCoord(v.y) && validCoord(v.z);
const distanceSquared = (a,b) => (a.x-b.x)**2 + (a.y-b.y)**2 + (a.z-b.z)**2;
export function deriveWirelessLinks({channels = [], transmitters = [], endpoints = [], maxNodes = 4096, maxRadius = 6} = {}) {
  if (![channels,transmitters,endpoints].every(Array.isArray) || !Number.isSafeInteger(maxNodes) || maxNodes < 1 || maxNodes > 4096 || channels.length+transmitters.length+endpoints.length > maxNodes || !Number.isSafeInteger(maxRadius) || maxRadius < 1 || maxRadius > 16) throw Error('invalid wireless envelope');
  const ids = new Set();
  for (const v of [...channels,...transmitters,...endpoints]) {
    if (!validId(v?.id) || ids.has(v.id) || !position(v) || v.loaded !== true) throw Error('invalid, duplicate or unloaded descriptor');
    ids.add(v.id);
  }
  for (const t of transmitters) if (!Number.isSafeInteger(t.radius) || t.radius < 1 || t.radius > maxRadius) throw Error('invalid transmitter radius');
  const topology = deriveChannelGraph({channels,endpoints:[...transmitters,...endpoints],maxNodes});
  const memberships = new Map(topology.endpoints.map(e=>[e.id,e]));
  const active = transmitters.filter(t=>memberships.get(t.id).status==='connected').sort((a,b)=>a.id.localeCompare(b.id));
  const linked = endpoints.map(e=>{
    const wired = memberships.get(e.id);
    const candidates = new Set();
    if (wired.network) candidates.add(wired.network);
    for (const t of active) if (distanceSquared(e,t) <= t.radius*t.radius) candidates.add(memberships.get(t.id).network);
    const networks = [...candidates].sort();
    const status = wired.status==='ambiguous' || networks.length>1 ? 'ambiguous' : networks.length===1 ? 'connected' : 'disconnected';
    return {id:e.id,network:status==='connected'?networks[0]:null,status,medium:wired.network && status==='connected'?'channel':status==='connected'?'wireless':null};
  }).sort((a,b)=>a.id.localeCompare(b.id));
  return {contract:WIRELESS_LINK_CONTRACT,networks:topology.networks,transmitters:active.map(t=>({id:t.id,network:memberships.get(t.id).network,radius:t.radius})),endpoints:linked};
}
