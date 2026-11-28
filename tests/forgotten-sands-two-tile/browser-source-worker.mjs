import { createP0TileWorker } from '../../src/manual-biomes/forgotten-sands-tile-worker.mjs';
import * as P from '/pinned-game/src/manual-biomes/profile-world.mjs';
import * as V from '/pinned-game/src/voxel.mjs';
import * as F from '/pinned-game/src/physics.mjs';
import * as H from '/pinned-game/src/world-height.mjs';
import * as N from '/pinned-game/src/world-height-natural-contract.mjs';

const receive = createP0TileWorker({ P, V, F, H, N, reserved: () => false,
  send: (message, transfer) => globalThis.postMessage(message, transfer ?? []),
  yieldSlice: () => new Promise(resolve => setTimeout(resolve, 0)),
});
globalThis.addEventListener('message', event => receive(event.data));
