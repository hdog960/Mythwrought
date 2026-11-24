import test from 'node:test';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {createP0WorkerQueue} from '../src/manual-biomes/forgotten-sands-worker-queue.mjs';
import {prepareP0SecondSite,p0BenchmarkMesh,p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
const sha=v=>createHash('sha256').update(Buffer.from(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
test('real Node worker original meshes transfer exactly; stale epoch discarded and bounded one upload/tick',async()=>{
  const worker=new Worker(new URL('./forgotten-sands-workers/node-entry.mjs',import.meta.url));
  const direct=prepareP0SecondSite().selected.view;
  const handles=new Set(),hashes=[],timings=[];
  const queue=createP0WorkerQueue({send:m=>worker.postMessage(m),upload:v=>{const h={hash:sha(v)};handles.add(h);hashes.push(h.hash);return h;},
    retire:h=>{assert.equal(handles.delete(h),true);}});
  const a=p0BenchmarkWindow(-58,-129,36),b=p0BenchmarkWindow(-59,-128,52);
  try{
    // One pending old request survives window replacement, then is dropped.
    queue.replace(a);queue.replace(b);
    const [old]=await once(worker,'message');assert.equal(queue.receive(old),false);
    assert.equal(queue.snapshot().discarded,1);assert.equal(queue.snapshot().inFlight,1);
    for(let i=0;i<b.length;i++){
      const [msg]=await once(worker,'message');assert.ok(!msg.error,msg.error);
      const k=b[i];assert.equal(msg.key,k.key);assert.equal(sha(msg.vertices),sha(p0BenchmarkMesh(direct,k.cx,k.cz,k.s)));
      timings.push(msg.meshMs);
      assert.equal(queue.receive(msg),true);assert.equal(queue.snapshot().ready,1);assert.equal(queue.snapshot().inFlight,0);
      const n=queue.snapshot().uploads;assert.equal(queue.tick(),true);assert.equal(queue.snapshot().uploads,n+1);
      assert.ok(queue.snapshot().resident<=27);assert.ok(queue.snapshot().inFlight+queue.snapshot().ready<=1);
    }
    assert.equal(queue.snapshot().resident,27);assert.equal(queue.snapshot().requests,28);
    assert.equal(queue.tick(),false);assert.equal(handles.size,27);
    const state=queue.snapshot();queue.close();assert.equal(handles.size,0);
    console.log('P0 WORKER',JSON.stringify({state,transferHashes:hashes.length,workerMeshP95:timings.sort((a,b)=>a-b)[Math.ceil(timings.length*.95)-1],retired:27}));
  }finally{queue.close();await worker.terminate();}
});
