// Pure opt-in bounded spatial candidate enumeration for N2 wireless; no world mutations.
export const WIRELESS_SPATIAL_CONTRACT = 'resonance-network36-wireless-spatial-v1';
const integer = n => Number.isSafeInteger(n);
const coordinate = n => integer(n) && Math.abs(n) <= 30000000;
const valid = p => p && typeof p.id === 'string' && p.id.length > 0 && p.id.length <= 128 && coordinate(p.x) && coordinate(p.y) && coordinate(p.z) && p.loaded === true;
const cellKey = (x,y,z) => x+','+y+','+z;
const order = (a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
/**
 * Returns only nearby transmitter/endpoint pairs, not links or powered status.
 * A fail-closed comparison limit prevents partial, misleading network results.
 */
export function enumerateWirelessCandidates({transmitters=[], endpoints=[], maxRadius=16, maxNodes=4096, maxComparisons=65536}={}) {
  if (!Array.isArray(transmitters) || !Array.isArray(endpoints) || !integer(maxRadius) || maxRadius<1 || maxRadius>16 ||
      !integer(maxNodes) || maxNodes<1 || maxNodes>4096 || transmitters.length+endpoints.length>maxNodes ||
      !integer(maxComparisons) || maxComparisons<1 || maxComparisons>1048576) throw Error('invalid spatial budget');
  const ids=new Set();
  for (const p of [...transmitters,...endpoints]) {
    if (!valid(p) || ids.has(p.id)) throw Error('invalid spatial descriptor');
    ids.add(p.id);
  }
  for (const t of transmitters) if (!integer(t.radius) || t.radius<1 || t.radius>maxRadius) throw Error('invalid transmitter radius');
  const width=maxRadius+1, buckets=new Map();
  const cell=p=>[Math.floor(p.x/width),Math.floor(p.y/width),Math.floor(p.z/width)];
  for (const e of endpoints) {
    const k=cellKey(...cell(e));if(!buckets.has(k))buckets.set(k,[]);
    buckets.get(k).push(e);
  }
  for (const bucket of buckets.values()) bucket.sort(order);
  const pairs=[];let comparisons=0;
  for (const t of [...transmitters].sort(order)) {
    const [x,y,z]=cell(t);
    for (let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++) for(let dz=-1;dz<=1;dz++) {
      for (const e of buckets.get(cellKey(x+dx,y+dy,z+dz))||[]) {
        if (++comparisons>maxComparisons) throw Error('wireless comparison budget exceeded');
        const a=t.x-e.x,b=t.y-e.y,c=t.z-e.z;
        if (a*a+b*b+c*c<=t.radius*t.radius) pairs.push({transmitterId:t.id,endpointId:e.id});
      }
    }
  }
  pairs.sort((a,b)=>a.transmitterId<b.transmitterId?-1:a.transmitterId>b.transmitterId?1:a.endpointId<b.endpointId?-1:a.endpointId>b.endpointId?1:0);
  return {contract:WIRELESS_SPATIAL_CONTRACT,pairs,comparisons,transmitterCount:transmitters.length,endpointCount:endpoints.length};
}
