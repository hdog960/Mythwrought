// Isolated opt-in channel topology; no world or save access.
export const CHANNEL_GRAPH_CONTRACT = 'resonance-network36-channel-graph-v1';
const validId = x => typeof x === 'string' && x.length > 0 && x.length <= 128;
const coord = x => Number.isSafeInteger(x) && Math.abs(x) <= 30000000;
const key = p => `${p.x},${p.y},${p.z}`;
const offsets = [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]];
export function deriveChannelGraph({channels, endpoints = [], maxNodes = 4096} = {}) {
  if (!Array.isArray(channels) || !Array.isArray(endpoints) || !Number.isSafeInteger(maxNodes) || maxNodes < 1 || maxNodes > 4096 || channels.length + endpoints.length > maxNodes) throw Error('invalid graph envelope');
  const ids = new Set(), positions = new Map(), ordered = [];
  for (const c of channels) {
    if (!c || !validId(c.id) || ids.has(c.id) || !coord(c.x) || !coord(c.y) || !coord(c.z) || c.loaded !== true) throw Error('invalid or unloaded channel');
    ids.add(c.id);
    const k = key(c);
    if (positions.has(k)) throw Error('overlapping channels');
    positions.set(k,c.id); ordered.push(c);
  }
  const byId = new Map(ordered.map(c => [c.id,c]));
  const assigned = new Map(), networks = [];
  for (const id of [...byId.keys()].sort()) {
    if (assigned.has(id)) continue;
    const pending = [id], members = []; assigned.set(id,true);
    for (let i=0;i<pending.length;i++) {
      const current = pending[i], c=byId.get(current); members.push(current);
      for (const [dx,dy,dz] of offsets) {
        const neighbor=positions.get(`${c.x+dx},${c.y+dy},${c.z+dz}`);
        if (neighbor && !assigned.has(neighbor)) {assigned.set(neighbor,true);pending.push(neighbor);}
      }
    }
    members.sort(); networks.push({id:`channel:${members[0]}`,channels:members});
  }
  const membership = new Map();
  for (const n of networks) for (const id of n.channels) membership.set(id,n.id);
  const attached=[];
  for (const e of endpoints) {
    if (!e || !validId(e.id) || ids.has(e.id) || !coord(e.x) || !coord(e.y) || !coord(e.z) || e.loaded !== true) throw Error('invalid or unloaded endpoint');
    ids.add(e.id);
    const neighbors=new Set();
    for (const [dx,dy,dz] of offsets) {const ch=positions.get(`${e.x+dx},${e.y+dy},${e.z+dz}`);if(ch)neighbors.add(membership.get(ch));}
    // A device touching multiple disconnected channel systems must not bridge them implicitly.
    attached.push({id:e.id,network:neighbors.size===1?[...neighbors][0]:null,status:neighbors.size===0?'disconnected':neighbors.size===1?'connected':'ambiguous'});
  }
  return {contract:CHANNEL_GRAPH_CONTRACT,networks, endpoints:attached.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0), channelCount:channels.length};
}
