// Detached CPU worker endpoint. The caller supplies the pinned game modules
// and reservation reader. Results carry the build ID and immutable manifest.
import { openP0TileWorld } from './forgotten-sands-tile-world.mjs';

export function createP0TileWorker({ P, V, F, H, N, reserved, send, yieldSlice }) {
  if ([reserved, send, yieldSlice].some(callback => typeof callback !== 'function')) {
    throw TypeError('Missing detached tile worker adapter');
  }
  let current = null, lastId = 0;

  async function build({ id, seed, tiles, revision }) {
    if (!Number.isSafeInteger(id) || id <= lastId || typeof revision !== 'string' || !revision || revision.length > 256) {
      throw Error('Invalid or stale tile build request');
    }
    lastId = id;
    const request = { id, snapshot: null };
    current = request;
    try {
      const snapshot = await openP0TileWorld(seed, tiles, {
        P, V, F, H, N, reserved, revision: () => current === request ? revision : '',
        async yieldControl(slice) {
          await yieldSlice();
          if (current !== request) return;
          if (slice.stage === 'assemble') {
            const tile = slice.tile.join(',');
            if (request.assembling !== tile) {
              request.assembling = tile;
              send({ type: 'assembling', id, tile: slice.tile });
            }
          }
        },
      });
      if (current !== request) return;
      request.snapshot = snapshot;
      send({ type: 'ready', id, identity: snapshot.identity, counts: snapshot.counts, witnesses: snapshot.witnesses });
    } catch (error) {
      if (current !== request) return;
      current = null;
      send({ type: 'failed', id, message: error.message });
    }
  }

  function sample({ id, manifestSha, site }) {
    if (!current?.snapshot || current.id !== id || current.snapshot.identity.manifestSha !== manifestSha) {
      throw Error('Tile mesh request needs the current manifest');
    }
    const { world, witnesses } = current.snapshot;
    const witness = witnesses[site];
    if (!Number.isSafeInteger(site) || !witness?.lower || !witness.upper) throw Error('Unknown tile mesh witness');
    const meshes = [witness.lower, witness.upper].map(([x, y, z]) => {
      const cx = Math.floor(x / 16), cz = Math.floor(z / 16), section = H.runtimeSectionForY(y);
      return { cx, cz, section, vertices: V.meshChunk(world, cx, cz, section) };
    });
    send({ type: 'meshes', id, manifestSha, site, meshes }, meshes.map(mesh => mesh.vertices.buffer));
  }

  return async message => {
    const { type, id } = message ?? {};
    try {
      if (type === 'build') await build(message);
      else if (type === 'cancel' && current?.id === id) {
        current = null;
        send({ type: 'canceled', id });
      } else if (type === 'sample') sample(message);
      else throw Error('Unknown or stale tile worker request');
    } catch (error) {
      send({ type: 'refused', id, message: error.message });
    }
  };
}
