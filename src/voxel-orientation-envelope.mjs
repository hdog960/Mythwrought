// Opt-in, separately persisted orientation envelope. Never mutates schema-1 saves.
// Host must explicitly store the returned JSON outside its existing save payload.
import {makeOrientationSidecar,restoreOrientationSidecar} from './voxel-orientation-sidecar.mjs';
export const ORIENTATION_FORMAT = 'mythwrought-orientation-v1';
const MAX_BYTES=262144;
function validSeed(seed) {return typeof seed==='string' && seed.length>0 && seed.length<=128;}
function validIdentity(id) {return typeof id==='string' && /^[a-zA-Z0-9._:-]{1,128}$/.test(id);}
export function encodeOrientationEnvelope(sidecar,readBlock,{seed,worldId,maxEntries=4096}={}) {
  if(!validSeed(seed)||!validIdentity(worldId)||!sidecar||typeof sidecar.snapshot!=='function') throw new TypeError('Invalid orientation context');
  const entries=sidecar.snapshot(readBlock);
  if(entries.length>maxEntries) throw new RangeError('Orientation entry budget exceeded');
  const payload=JSON.stringify({format:ORIENTATION_FORMAT,seed,worldId,entries});
  if(new TextEncoder().encode(payload).length>MAX_BYTES) throw new RangeError('Orientation payload too large');
  return payload;
}
// Fail closed on wrong seed/world, malformed data, oversized data or invalid records.
// Never substitute orientation records for block edits. Return empty state if no sidecar.
export function decodeOrientationEnvelope(payload,readBlock,{seed,worldId,maxEntries=4096}={}) {
  if(!validSeed(seed)||!validIdentity(worldId)||typeof readBlock!=='function') throw new TypeError('Invalid orientation context');
  if(payload==null||payload==='') return makeOrientationSidecar([],{maxEntries});
  if(typeof payload!=='string'||new TextEncoder().encode(payload).length>MAX_BYTES) throw new TypeError('Invalid orientation envelope');
  let data;
  try {data=JSON.parse(payload);} catch {throw new TypeError('Malformed orientation envelope');}
  if(!data||Array.isArray(data)||data.format!==ORIENTATION_FORMAT||data.seed!==seed||data.worldId!==worldId||!Array.isArray(data.entries)||data.entries.length>maxEntries) throw new TypeError('Orientation world mismatch or invalid envelope');
  // Strictly validate every record; malformed entries must not silently become rotations.
  const checked=makeOrientationSidecar(data.entries,{maxEntries});
  return restoreOrientationSidecar(checked.snapshot(readBlock),readBlock,{maxEntries});
}
