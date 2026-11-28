import { parentPort, workerData } from 'node:worker_threads';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createP0TileWorker } from '../../src/manual-biomes/forgotten-sands-tile-worker.mjs';

const load = path => import(pathToFileURL(resolve(workerData.root, path)).href);
const [P, V, F, H, N] = await Promise.all([
  'src/manual-biomes/profile-world.mjs', 'src/voxel.mjs', 'src/physics.mjs',
  'src/world-height.mjs', 'src/world-height-natural-contract.mjs',
].map(load));
const receive = createP0TileWorker({ P, V, F, H, N, reserved: () => false,
  send: (message, transfer) => parentPort.postMessage(message, transfer),
  yieldSlice: () => new Promise(resolve => setImmediate(resolve)),
});
parentPort.on('message', receive);
