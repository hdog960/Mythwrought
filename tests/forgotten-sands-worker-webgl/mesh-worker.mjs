import {p0WorkerMeshMessage} from '../../src/manual-biomes/forgotten-sands-worker-mesh.mjs';
self.addEventListener('message',e=>p0WorkerMeshMessage(e.data,(message,transfer)=>self.postMessage(message,transfer)));
self.postMessage({type:'ready'});
