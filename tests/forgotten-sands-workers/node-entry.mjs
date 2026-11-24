import {parentPort} from 'node:worker_threads';
import {p0WorkerMeshMessage} from '../../src/manual-biomes/forgotten-sands-worker-mesh.mjs';
parentPort.on('message',message=>p0WorkerMeshMessage(message,(value,transfer)=>parentPort.postMessage(value,transfer)));
