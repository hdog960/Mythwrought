// Optional orientation metadata recovery for legacy schema-1 worlds.
// Never reads, rewrites, migrates or changes the legacy save payload.
import {restoreOrientationSidecar} from './voxel-orientation-sidecar.mjs';

export function recoverOptionalOrientation(serialized, readBlock, options) {
  if (typeof readBlock !== 'function') throw new TypeError('Missing world block reader');
  const maxEntries=options?.maxEntries??4096;
  if (!Number.isSafeInteger(maxEntries)||maxEntries<1)
    throw new TypeError('Invalid orientation capacity');
  // Corrupt optional metadata must never prevent the authoritative legacy world
  // from loading. Reject whole oversized/non-array envelopes before any reads.
  if (serialized !== undefined && serialized !== null &&
      (!Array.isArray(serialized)||serialized.length>maxEntries))
    return {sidecar:restoreOrientationSidecar(null,readBlock,{maxEntries}),recovered:false};
  return {sidecar:restoreOrientationSidecar(serialized,readBlock,{maxEntries}),
    recovered:serialized===undefined||serialized===null||Array.isArray(serialized)};
}
