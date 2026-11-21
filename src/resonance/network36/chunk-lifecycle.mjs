// Isolated, immutable chunk visibility filter for future :36 solver adapters.
// This module never reads world chunks, modifies saves, or grants energy.
export const LIFECYCLE_CONTRACT = 'resonance-network36-chunks-v1';
const safe = n => Number.isSafeInteger(n) && Math.abs(n) <= 1000000;
const chunkKey = a => [Math.floor(a.x / 16), Math.floor(a.y / 16), Math.floor(a.z / 16)].join(',');
const copy = item => ({...item, anchor:{...item.anchor}});
export function visibleResonanceSnapshot(snapshot, loadedChunks, options={}) {
  if (!snapshot || typeof snapshot !== 'object' || !Array.isArray(loadedChunks) ||
      loadedChunks.length > 25 || !['nodes','generators','devices','stores'].every(k=>Array.isArray(snapshot[k]) && snapshot[k].length<=2048))
    throw Error('invalid chunk snapshot budget');
  const loaded = new Set();
  for (const c of loadedChunks) {
    if (!Array.isArray(c) || c.length!==3 || !c.every(safe)) throw Error('invalid chunk coordinate');
    const k=c.join(',');
    if (loaded.has(k)) throw Error('duplicate loaded chunk');
    loaded.add(k);
  }
  if (options.failOnMissing !== undefined && typeof options.failOnMissing !== 'boolean') throw Error('invalid option');
  const result={contract:LIFECYCLE_CONTRACT, nodes:[],generators:[],devices:[],stores:[],excluded:[]};
  const ids=new Set();
  for (const category of ['nodes','generators','devices','stores']) {
    for (const item of snapshot[category]) {
      if (!item || typeof item.id!=='string' || !item.id || ids.has(item.id) ||
          !item.anchor || !['x','y','z'].every(k=>safe(item.anchor[k])))
        throw Error('invalid or duplicate entity');
      ids.add(item.id);
      if (loaded.has(chunkKey(item.anchor))) result[category].push(copy(item));
      else result.excluded.push(item.id);
    }
  }
  if (options.failOnMissing && result.excluded.length) throw Error('unloaded entities');
  return result;
}
